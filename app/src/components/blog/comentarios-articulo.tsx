import { useState, type FormEvent } from 'react'
import { Clock, MessageCircle, Reply, ThumbsDown, ThumbsUp } from 'lucide-react'
import { enviarFormulario } from '@/lib/api/api'
import { errorEnvio as textoErrorEnvio } from '@/lib/use-envio-formulario'
import { COMENTARIOS_POOL, type Comentario } from '@/data/comentarios'
import { t } from '@/lib/i18n'

// Comentarios del artículo (correcciones v1, pedido de Samuel 2026-07-22).
//
// [2026-08-18] YA SE ENVÍAN. El formulario solo añadía el comentario al estado
// local: se veía publicado en la pantalla de quien escribía y desaparecía al
// recargar, sin llegar a nadie. Ahora viaja a Odoo como `haa.web.lead` de tipo
// `comment` y el comentario se pinta con el chip «Awaiting review» — que es la
// verdad: entra en una cola de moderación, no se publica solo. Enseñarlo sin
// el chip sería el mismo engaño de antes con más pasos.
// 2ª vuelta, mismo día ("los comentarios publicados deben tener like,
// dislike y contestar comentario"): cada comentario gana 3 acciones —
// like/dislike (mutuamente excluyentes, un clic sobre el ya activo lo
// quita) y responder (abre un formulario inline, la respuesta se anida
// UN nivel, sin poder responder a una respuesta — misma profundidad que
// cualquier hilo de comentarios simple).
//
// La lista inicial sale de COMENTARIOS_POOL (data/comentarios.ts): un hash
// simple del slug elige cuántos (2-5) y desde dónde, así cada artículo
// muestra un hilo distinto sin tener que escribir comentarios a mano para
// cada uno de los ~18 artículos del blog.
function hashSlug(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return hash
}

function comentariosParaSlug(slug: string): Comentario[] {
  const hash = hashSlug(slug)
  const total = COMENTARIOS_POOL.length
  const cantidad = 2 + (hash % 4)
  const inicio = hash % total
  return Array.from({ length: cantidad }, (_, i) => COMENTARIOS_POOL[(inicio + i) % total])
}

// Mismo trato que Iniciales en home/reviews.tsx: nombre + iniciales en
// círculo, sin fotos de clientes (privacidad) — no se repite el import
// porque ese componente no está exportado desde su archivo.
function Iniciales({ nombre, pequeno = false }: { nombre: string; pequeno?: boolean }) {
  const iniciales = nombre
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-aqua-tint font-semibold text-aqua-dark ${
        pequeno ? 'size-8 text-xs' : 'size-10 text-sm'
      }`}
    >
      {iniciales}
    </div>
  )
}

type Reaccion = 'like' | 'dislike'

export function ComentariosArticulo({ slug }: { slug: string }) {
  const [comentarios, setComentarios] = useState<Comentario[]>(() => comentariosParaSlug(slug))
  const [reacciones, setReacciones] = useState<Partial<Record<number, Reaccion>>>({})
  const [respondiendoA, setRespondiendoA] = useState<number | null>(null)
  const [nombreResp, setNombreResp] = useState('')
  const [textoResp, setTextoResp] = useState('')

  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)
  /** Índices de los comentarios que ha escrito esta visita: llevan el chip de
   *  moderación mientras el equipo no los aprueba. */
  const [pendientes, setPendientes] = useState<number[]>([])

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !texto.trim() || enviando) return
    setEnviando(true)
    setErrorEnvio(null)
    try {
      await enviarFormulario('comment', {
        name: nombre.trim(),
        message: texto.trim(),
        article: slug,
      })
    } catch {
      setErrorEnvio(textoErrorEnvio())
      setEnviando(false)
      return
    }
    setComentarios((prev) => [
      { autor: nombre.trim(), fecha: t('Just now'), texto: texto.trim(), likes: 0, dislikes: 0 },
      ...prev,
    ])
    // Se añade ARRIBA, así que el nuevo es el índice 0 y los pendientes que ya
    // hubiera se desplazan uno.
    setPendientes((prev) => [0, ...prev.map((i) => i + 1)])
    setNombre('')
    setTexto('')
    setEnviando(false)
  }

  const reaccionar = (indice: number, tipo: Reaccion) => {
    const actual = reacciones[indice]
    const siguiente = actual === tipo ? undefined : tipo

    setComentarios((prev) =>
      prev.map((c, i) => {
        if (i !== indice) return c
        let { likes, dislikes } = c
        if (actual === 'like') likes -= 1
        if (actual === 'dislike') dislikes -= 1
        if (siguiente === 'like') likes += 1
        if (siguiente === 'dislike') dislikes += 1
        return { ...c, likes, dislikes }
      }),
    )
    setReacciones((prev) => ({ ...prev, [indice]: siguiente }))
  }

  const enviarRespuesta = async (e: FormEvent, indice: number) => {
    e.preventDefault()
    if (!nombreResp.trim() || !textoResp.trim()) return
    // Igual que el comentario principal: primero viaja, después se pinta.
    try {
      await enviarFormulario('comment', {
        name: nombreResp.trim(),
        message: textoResp.trim(),
        article: slug,
        replying_to: comentarios[indice]?.autor,
      })
    } catch {
      setErrorEnvio(textoErrorEnvio())
      return
    }
    setComentarios((prev) =>
      prev.map((c, i) =>
        i === indice
          ? {
              ...c,
              respuestas: [
                ...(c.respuestas ?? []),
                { autor: nombreResp.trim(), fecha: t('Just now'), texto: textoResp.trim() },
              ],
            }
          : c,
      ),
    )
    setNombreResp('')
    setTextoResp('')
    setRespondiendoA(null)
  }

  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-h3 font-semibold text-navy">
        <MessageCircle className="size-5 text-aqua-dark" aria-hidden="true" />
        {t('Comments (')}{comentarios.length})
      </h2>

      <form onSubmit={(e) => void enviar(e)} className="mt-5 rounded-card-grande bg-papel-hueso p-5 sm:p-6">
        <p className="text-sm font-semibold text-navy">{t('Leave a comment')}</p>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t('Your name')}
          className="mt-3 w-full rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm text-navy placeholder:text-navy-soft focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
        />
        <textarea
          required
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={t('Write your comment...')}
          rows={3}
          className="mt-3 w-full resize-none rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm text-navy placeholder:text-navy-soft focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
        />
        <button
          type="submit"
          disabled={enviando}
          className="mt-3 rounded-btn bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Sending…' : t('Post comment')}
        </button>
        {errorEnvio ? (
          <p role="alert" className="mt-3 rounded-btn border border-coral/40 bg-coral/5 p-3 text-xs leading-relaxed text-navy-sub">
            {errorEnvio}
          </p>
        ) : null}
      </form>

      <ul className="mt-6 flex flex-col gap-5">
        {comentarios.map((c, i) => (
          <li key={i} className="flex gap-3">
            <Iniciales nombre={c.autor} />
            <div className="min-w-0 flex-1 border-b border-linea pb-5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-navy">{c.autor}</span>
                <span className="text-xs text-navy-soft">{c.fecha}</span>
                {pendientes.includes(i) ? (
                  <span className="inline-flex items-center gap-1 rounded-chip bg-papel-hueso px-2 py-0.5 text-xs font-medium text-navy-soft">
                    <Clock className="size-3" aria-hidden="true" />
                    {t('Awaiting review')}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-navy-sub">{c.texto}</p>

              <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-navy-soft">
                <button
                  type="button"
                  onClick={() => reaccionar(i, 'like')}
                  aria-pressed={reacciones[i] === 'like'}
                  className={`inline-flex items-center gap-1.5 transition-colors hover:text-navy ${
                    reacciones[i] === 'like' ? 'text-aqua-dark' : ''
                  }`}
                >
                  <ThumbsUp className="size-3.5" aria-hidden="true" />
                  {c.likes}
                </button>
                <button
                  type="button"
                  onClick={() => reaccionar(i, 'dislike')}
                  aria-pressed={reacciones[i] === 'dislike'}
                  className={`inline-flex items-center gap-1.5 transition-colors hover:text-navy ${
                    reacciones[i] === 'dislike' ? 'text-coral' : ''
                  }`}
                >
                  <ThumbsDown className="size-3.5" aria-hidden="true" />
                  {c.dislikes}
                </button>
                <button
                  type="button"
                  onClick={() => setRespondiendoA(respondiendoA === i ? null : i)}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-navy"
                >
                  <Reply className="size-3.5" aria-hidden="true" />
                  {t('Reply')}
                </button>
              </div>

              {respondiendoA === i ? (
                <form
                  onSubmit={(e) => void enviarRespuesta(e, i)}
                  className="mt-3 flex flex-col gap-2 rounded-card bg-papel-hueso p-3"
                >
                  <input
                    type="text"
                    required
                    value={nombreResp}
                    onChange={(e) => setNombreResp(e.target.value)}
                    placeholder={t('Your name')}
                    className="rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy placeholder:text-navy-soft focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
                  />
                  <textarea
                    required
                    value={textoResp}
                    onChange={(e) => setTextoResp(e.target.value)}
                    placeholder={t('Write your reply...')}
                    rows={2}
                    className="resize-none rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy placeholder:text-navy-soft focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setRespondiendoA(null)}
                      className="text-xs font-semibold text-navy-soft hover:text-navy"
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="rounded-btn bg-coral px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-coral-dark"
                    >
                      {t('Reply')}
                    </button>
                  </div>
                </form>
              ) : null}

              {c.respuestas && c.respuestas.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-4 border-l-2 border-linea pl-4">
                  {c.respuestas.map((r, ri) => (
                    <li key={ri} className="flex gap-2.5">
                      <Iniciales nombre={r.autor} pequeno />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm font-semibold text-navy">{r.autor}</span>
                          <span className="text-xs text-navy-soft">{r.fecha}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-navy-sub">{r.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
