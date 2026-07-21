import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { ARTICULOS, CATEGORIAS_BLOG, type Articulo, type CategoriaBlog } from '@/data/blog'
import { EQUIPO } from '@/data/nosotros'

// Índice del blog (correcciones v1 del cliente, 2026-07-20 —
// planes/06-blog.md slides 1-3): artículo destacado + rejilla filtrable por
// categoría + newsletter.
//
// ⚠️ ARTÍCULOS SIN ESCRIBIR: solo uno tiene cuerpo (ver data/blog.ts para el
// porqué). Los demás se pintan igual —el cliente propuso esos títulos y
// quiere ver la estructura— pero marcados «Próximamente» y SIN enlace: es
// preferible a un enlace que lleva a una página vacía. Cuando se escriban,
// basta con rellenar `cuerpo` y la card se vuelve navegable sola.

function autorDe(id: string): string {
  return EQUIPO.find((m) => m.id === id)?.nombre ?? 'Hispaniola'
}

function MetaArticulo({ articulo }: { articulo: Articulo }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-navy-soft">
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-full bg-aqua-tint text-[0.625rem] font-semibold text-aqua-dark"
      >
        {autorDe(articulo.autorId).slice(0, 1)}
      </span>
      <span className="font-medium text-navy-sub">{autorDe(articulo.autorId)}</span>
      <span aria-hidden="true">·</span>
      <span>{articulo.fecha}</span>
      <span aria-hidden="true">·</span>
      <span>{articulo.minutos} min</span>
    </p>
  )
}

function ChipCategoria({ categoria }: { categoria: CategoriaBlog }) {
  return (
    <span className="rounded-chip bg-aqua-tint px-3 py-1 text-xs font-medium text-aqua-dark">
      {categoria}
    </span>
  )
}

// «Próximamente» en vez de enlace roto — ver la nota de arriba.
function SinEscribir() {
  return (
    <span className="mt-4 inline-flex items-center rounded-chip bg-papel-hueso px-3 py-1 text-xs font-medium text-navy-soft">
      Próximamente
    </span>
  )
}

function CardDestacado({ articulo }: { articulo: Articulo }) {
  const contenido = (
    <>
      <div className="overflow-hidden rounded-card-grande lg:h-full">
        <img
          src={`/fotos/${articulo.foto}.webp`}
          alt={articulo.fotoAlt}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-72 lg:h-full"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-chip bg-navy px-3 py-1 text-xs font-semibold text-white">
            Destacado
          </span>
          <ChipCategoria categoria={articulo.categoria} />
        </div>
        <h3 className="mt-4 text-balance font-display text-h2 font-semibold text-navy">
          {articulo.titulo}
        </h3>
        <p className="mt-3 text-lead text-navy-sub">{articulo.extracto}</p>
        <MetaArticulo articulo={articulo} />
        {articulo.cuerpo ? (
          <span className="mt-5 inline-flex items-center gap-1.5 self-start rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-coral-dark">
            Leer el artículo
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        ) : (
          <SinEscribir />
        )}
      </div>
    </>
  )

  const clases =
    'group grid grid-cols-1 gap-6 rounded-card-grande bg-papel p-4 ring-1 ring-linea lg:grid-cols-2 lg:gap-10 lg:p-6'

  if (!articulo.cuerpo) return <div className={clases}>{contenido}</div>
  return (
    <Link to={`/blog/${articulo.slug}`} className={clases}>
      {contenido}
    </Link>
  )
}

function CardArticulo({ articulo }: { articulo: Articulo }) {
  const contenido = (
    <>
      <div className="overflow-hidden rounded-card">
        <img
          src={`/fotos/${articulo.foto}.webp`}
          alt={articulo.fotoAlt}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex grow flex-col p-5">
        <ChipCategoria categoria={articulo.categoria} />
        <h3 className="mt-3 text-balance font-display text-h3 font-semibold text-navy">
          {articulo.titulo}
        </h3>
        <p className="mt-2 grow text-sm text-navy-sub">{articulo.extracto}</p>
        <MetaArticulo articulo={articulo} />
        {!articulo.cuerpo ? <SinEscribir /> : null}
      </div>
    </>
  )

  const clases =
    'group flex flex-col overflow-hidden rounded-card-grande bg-papel ring-1 ring-linea'

  if (!articulo.cuerpo) return <article className={clases}>{contenido}</article>
  return (
    <article className={clases}>
      <Link to={`/blog/${articulo.slug}`} className="flex grow flex-col">
        {contenido}
      </Link>
    </article>
  )
}

export function ListaArticulos() {
  const [activa, setActiva] = useState<CategoriaBlog | null>(null)

  const destacado = ARTICULOS.find((a) => a.destacado)
  const resto = ARTICULOS.filter((a) => !a.destacado)
  const visibles = activa ? resto.filter((a) => a.categoria === activa) : resto

  return (
    <div className="flex flex-col gap-12">
      {destacado ? <CardDestacado articulo={destacado} /> : null}

      <div>
        {/* Filtros por categoría (slide 2). Mismo patrón que los chips de la
            página FAQ — un solo idioma de filtro en todo el sitio. */}
        <div
          role="group"
          aria-label="Filtrar artículos por categoría"
          className="flex flex-wrap gap-2"
        >
          {[{ id: null as CategoriaBlog | null, nombre: 'Todos' }, ...CATEGORIAS_BLOG.map((c) => ({ id: c, nombre: c }))].map(
            (chip) => {
              const seleccionado = activa === chip.id
              return (
                <button
                  key={chip.nombre}
                  type="button"
                  onClick={() => setActiva(chip.id)}
                  aria-pressed={seleccionado}
                  className={`rounded-chip px-4 py-2 text-sm font-medium transition-colors ${
                    seleccionado
                      ? 'bg-navy text-white'
                      : 'bg-papel text-navy-sub ring-1 ring-linea hover:bg-papel-hueso'
                  }`}
                >
                  {chip.nombre}
                </button>
              )
            },
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((a) => (
            <CardArticulo key={a.slug} articulo={a} />
          ))}
        </div>
      </div>

      <Newsletter />
    </div>
  )
}

// Newsletter (slide 3). SOLO PROTOTIPO, como el formulario de contacto: no
// hay servicio de email conectado (Mailchimp/Brevo es una decisión pendiente
// del cliente), así que el submit confirma en pantalla y no envía nada. El
// microcopy no promete lo que no hacemos.
export function Newsletter() {
  const [enviado, setEnviado] = useState(false)
  return (
    <section className="rounded-card-grande bg-navy px-6 py-10 text-center sm:px-10">
      <Etiqueta sobreOscuro>Newsletter</Etiqueta>
      <h2 className="mt-3 font-display text-h2 font-semibold text-white">No te pierdas nada</h2>
      <p className="mx-auto mt-3 max-w-xl text-lead text-white/80">
        Guías, historias del mar y ofertas para tu viaje a Punta Cana — directo a tu correo, sin
        spam.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setEnviado(true)
        }}
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder="tu@email.com"
          aria-label="Tu email"
          className="min-w-0 flex-1 rounded-btn border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          Suscribirme
        </button>
      </form>
      {enviado ? (
        <p role="status" className="mt-3 text-sm font-medium text-aqua-claro">
          ¡Gracias! Te escribiremos cuando publiquemos algo que valga la pena.
        </p>
      ) : null}
      <p className="mt-3 text-xs text-white/50">
        Al suscribirte aceptas recibir novedades de Hispaniola. Puedes darte de baja cuando quieras.
      </p>
    </section>
  )
}
