import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Camera, Check, ChevronRight, Handshake, Megaphone } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { ERROR_ENVIO, useEnvioFormulario } from '@/lib/use-envio-formulario'
import { Campo } from '@/components/ui/campo'
import { IconoWhatsApp } from '@/components/ui/iconos-redes'
import { PERFILES_TRABAJO, PERFIL_POR_DEFECTO, RESPALDO, esPerfilValido } from '@/data/trabaja'
import type { PerfilTrabajo } from '@/data/trabaja'
import { FLOTA } from '@/data/nosotros'
import { WHATSAPP_URL } from '@/data/tours'
import { useDevFlag } from '@/dev/use-dev-flag'

// Formulario de «Trabaja con nosotros» — el mismo formulario para los tres
// perfiles, no tres páginas. El cliente pidió tres enlaces distintos en el
// footer ("Como proveedor de actividades / Como creador de contenido / Como
// afiliado"), pero detrás hay UN destino: cada enlace trae su `?perfil=` y lo
// único que cambia son las 2-3 preguntas del segundo grupo. Tres páginas
// gemelas envejecen mal (se tocan por separado y se desincronizan) y además
// esconden las otras dos opciones a quien llega por la de en medio.
//
// ═══ REDISEÑO 2026-07-22, misma sesión (Samuel: «creo que se puede mejorar
// el diseño y la ux del formulario... dale una vuelta») ═══
//
// EL DIAGNÓSTICO. La 1ª versión repetía, punto por punto, lo que el rediseño
// de home/contacto.tsx de este mismo día vino a arreglar allí:
//   · Una card BLANCA con hairline sobre el papel BLANCO de la página — el
//     panel no recortaba nada, solo dibujaba una raya alrededor del vacío.
//   · Losas del mismo peso apiladas: 3 tarjetas de perfil, un párrafo gris,
//     siete campos y un botón, todo `mt-N` sobre la misma superficie. Sin
//     figura/fondo no hay dónde mirar primero.
//   · El "qué pasa después" era un párrafo dentro de una caja gris que se
//     leía como un INPUT DESHABILITADO, justo encima de los inputs de verdad.
//   · Siete campos seguidos sin agrupar, y sin decir cuáles son opcionales:
//     el formulario se ve más largo de lo que es.
//   · La confirmación era una línea verde DEBAJO del botón, con el formulario
//     entero todavía ahí, relleno e invitando a reenviarlo.
//   · A 1440px, un `max-w-3xl` centrado dejaba media pantalla en blanco.
//
// LA ESTRUCTURA, la misma que Samuel ya validó en Contacto (un panel, un
// carril gris, hairlines en vez de elevación):
//
//   ┌─ PANEL (un solo hairline recorta TODO, sin sombra) ───────────────┐
//   │ carril (gris)              │ formulario (blanco = la acción)      │
//   │  · los 3 perfiles, filas   │  · «Solicitud como <perfil>»         │
//   │    seleccionables          │  · TUS DATOS: nombre · email · tel.  │
//   │  · qué pasa después (1·2·3)│  · SOBRE TU <ámbito>: campos propios │
//   │  · atajo de WhatsApp       │  · enviar + microcopy                │
//   └───────────────────────────────────────────────────────────────────┘
//
// LA DECISIÓN DE FONDO: el CARRIL se queda con la elección de perfil, y el
// formulario queda como una sola columna de «rellena esto». Antes la
// elección vivía arriba del formulario y empujaba los campos media pantalla
// hacia abajo; y como tarjetas en fila, los títulos partían en dos líneas y
// las descripciones no cabían. En vertical caben enteras, se comparan de un
// vistazo y el formulario empieza donde tiene que empezar. Elegir perfil aquí
// se parece más a navegar que a rellenar un campo — por eso vive en el
// carril, que es donde este sitio pone la navegación de un módulo.
//
// ⚠️ SOLO PROTOTIPO (sin backend), mismo criterio que FormularioAgentes y
// home/contacto.tsx. Y sin condiciones inventadas: el porqué, en data/trabaja.ts.

const ICONOS: Record<PerfilTrabajo['id'], typeof Handshake> = {
  proveedor: Handshake,
  creador: Camera,
  afiliado: Megaphone,
}

// Los 3 perfiles como filas seleccionables del carril. El radio es REAL
// (sr-only dentro del label): así el grupo se recorre con las flechas del
// teclado y un lector de pantalla lo anuncia como lo que es, un grupo de
// opciones — no como tres divs clicables. El foco de teclado se pinta con
// `has-[:focus-visible]:`, que sin esto sería invisible al ir con Tab.
function FilaPerfil({
  perfil,
  activo,
  onElegir,
}: {
  perfil: PerfilTrabajo
  activo: boolean
  onElegir: () => void
}) {
  const Icono = ICONOS[perfil.id]
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3.5 px-6 py-4 transition-colors sm:px-7 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-aqua ${
        activo ? 'bg-papel' : 'hover:bg-papel/60'
      }`}
    >
      <input
        type="radio"
        name="perfil"
        value={perfil.id}
        checked={activo}
        onChange={onElegir}
        className="sr-only"
      />
      {/* Barra de selección ABSOLUTA y siempre presente (transparente cuando
          no toca): con un border-l real, marcar y desmarcar movería el texto
          4px a un lado en cada clic. */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${activo ? 'bg-aqua' : 'bg-transparent'}`}
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-btn transition-colors ${
          activo ? 'bg-aqua text-white' : 'bg-aqua-tint text-aqua-dark'
        }`}
      >
        <Icono className="size-4" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-navy">{perfil.titulo}</span>
        <span className="mt-1 block text-xs leading-snug text-navy-sub">{perfil.resumen}</span>
      </span>
      {activo ? (
        <span
          aria-hidden="true"
          className="mt-1 grid size-5 shrink-0 place-items-center rounded-chip bg-aqua text-white"
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      ) : null}
    </label>
  )
}

// «Qué pasa después» — la pregunta que ningún formulario de captación de este
// sitio contestaba. Antes era el `quePasa` del perfil metido en una caja gris
// sobre los inputs (donde se leía como un campo deshabilitado); aquí son tres
// pasos numerados en el carril, que es información de contexto, no de acción.
// Los dos primeros pasos son iguales para todos y viven aquí; el tercero es
// el `quePasa` del perfil elegido — o sea que la lista CAMBIA al cambiar de
// perfil, y no hay ningún dato nuevo inventado para construirla.
function PasosDespues({ perfil }: { perfil: PerfilTrabajo }) {
  const pasos = [
    'The team reads it. There’s no bot filtering here.',
    'We write back within 24 hours, however you prefer.',
    perfil.quePasa,
  ]
  return (
    <div className="border-t border-linea p-6 sm:p-7">
      <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
        What happens next
      </p>
      <ol className="mt-3 flex flex-col gap-3">
        {pasos.map((paso, i) => (
          <li key={paso} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid size-5 shrink-0 place-items-center rounded-chip bg-aqua-tint text-eyebrow font-semibold text-aqua-dark"
            >
              {i + 1}
            </span>
            <span className="text-sm leading-snug text-navy-sub">{paso}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// «Con quién trabajarías» — cierra el carril con las cuatro credenciales que
// el sitio ya sostiene en otras páginas (ver RESPALDO en data/trabaja.ts para
// el porqué y la procedencia de cada una). El número de barcos se CUENTA
// sobre FLOTA en vez de escribirse, para que no envejezca solo.
function Respaldo() {
  return (
    <div className="border-t border-linea p-6 sm:p-7">
      <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
        Who you’d be working with
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {RESPALDO.map((linea) => (
          <li key={linea} className="flex items-start gap-2.5 text-sm leading-snug text-navy-sub">
            <Check className="mt-0.5 size-3.5 shrink-0 text-aqua-dark" strokeWidth={2.5} aria-hidden="true" />
            {linea.replace('{barcos}', String(FLOTA.length))}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Atajo de WhatsApp — fila con hairline (patrón de apple.com/contact que ya
// usa el carril de Contacto), NO un botón coral: el botón coral de esta
// pantalla es «Enviar solicitud» y no debe competir con nada. Está porque un
// proveedor o un creador muchas veces prefiere escribir dos líneas por
// WhatsApp antes que rellenar un formulario, y el sitio entero promete ese
// canal.
function AtajoWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      className="group mt-auto flex items-center gap-3.5 border-t border-linea px-6 py-4 transition-colors hover:bg-papel sm:px-7"
    >
      <IconoWhatsApp className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
          Rather talk it through?
        </span>
        <span className="mt-0.5 block text-sm font-medium leading-snug text-navy">
          Message us on WhatsApp
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-navy-soft transition group-hover:translate-x-0.5 group-hover:text-aqua-dark"
      />
    </a>
  )
}

// El envío SUSTITUYE al formulario (mismo criterio que Confirmacion en
// home/contacto.tsx): una línea verde bajo el botón dejaba el formulario
// entero relleno y en pie, invitando a reenviarlo. Ocupa el mismo hueco, así
// que el panel no pega un salto de alto al enviar.
function Confirmacion({ perfil, onReset }: { perfil: PerfilTrabajo; onReset: () => void }) {
  return (
    <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
      <div aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-menta text-menta-texto">
        <Check className="size-6" strokeWidth={2.5} />
      </div>
      <p className="mt-4 font-display text-h3 font-semibold text-navy">Application sent</p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-navy-sub">
        We received it as {perfil.titulo.toLowerCase()}. We’ll write to you within 24 h, and if you want
        to get ahead in the meantime, our WhatsApp is right here.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 text-sm font-semibold text-aqua-dark hover:underline"
      >
        Enviar otra solicitud
      </button>
    </div>
  )
}

export function FormularioTrabaja() {
  const [searchParams] = useSearchParams()
  const perfilUrl = searchParams.get('perfil')
  const [perfilId, setPerfilId] = useState<PerfilTrabajo['id']>(
    esPerfilValido(perfilUrl) ? perfilUrl : PERFIL_POR_DEFECTO,
  )
  // Guarda el perfil CON EL QUE SE ENVIÓ, no un booleano: el carril sigue
  // vivo tras enviar (se puede cambiar de perfil), y con un booleano el acuse
  // de recibo se reescribiría solo al tocar el carril, diciendo que mandaste
  // algo que no mandaste.
  // [2026-08-18] YA ENVÍA. Era `setEnviadoComo(perfilId)` y nada más: la
  // candidatura entera —perfil, datos y los campos propios de cada perfil— se
  // perdía en el navegador. Ahora entra en Odoo como `haa.web.lead` de tipo
  // `careers`, con el perfil elegido en `subject` para poder filtrarlas.
  const { estado, enviar, enviando } = useEnvioFormulario('careers')
  const [enviadoComo, setEnviadoComo] = useState<PerfilTrabajo['id'] | null>(null)

  // Los tres enlaces del footer apuntan a esta MISMA ruta con distinto
  // `?perfil=`. Sin esto, pulsar "Como afiliado" estando ya en la página no
  // haría nada visible: React Router no remonta el componente y el estado
  // inicial se calculó en el primer render.
  useEffect(() => {
    if (esPerfilValido(perfilUrl)) setPerfilId(perfilUrl)
  }, [perfilUrl])

  // [dev-mode] ?dev-trabaja=enviado congela la confirmación → frame para Figma.
  useDevFlag('dev-trabaja', (v) => {
    if (v === 'enviado') setEnviadoComo(perfilId)
  }) // [dev-mode]

  const perfil = PERFILES_TRABAJO.find((p) => p.id === perfilId) ?? PERFILES_TRABAJO[0]
  const perfilEnviado = PERFILES_TRABAJO.find((p) => p.id === enviadoComo) ?? null

  return (
    // max-w-5xl y no max-w-contenido (1400px): a lo ancho de la página los
    // campos medirían 500px cada uno. Mismo tope que el panel de Contacto —
    // el ancho lo pide el contenido, no la rejilla.
    <section className="mx-auto max-w-5xl">
      {/* El <form> envuelve LAS DOS columnas: los radios del perfil viven en
          el carril y los campos en la otra, pero son un solo envío. */}
      <form
        onSubmit={(e) =>
          void enviar(e, { subject: perfil.titulo, profile: perfilId }).then(
            (ok) => {
              // Solo se pasa a la confirmación si el envío salió: enseñar
              // «te contestamos en 24 h» sobre una candidatura que no ha
              // llegado es exactamente lo que había que arreglar.
              if (ok) setEnviadoComo(perfilId)
            },
          )
        }
        className="overflow-hidden rounded-card-grande bg-papel ring-1 ring-linea"
      >
        {/* EL CARRIL SE PARTE EN DOS PIEZAS, y no es un capricho de layout:
            en móvil todo esto se apila ENCIMA del formulario, y con el carril
            entero arriba había que scrollear ~870px de contexto (3 perfiles +
            3 pasos + 4 credenciales + WhatsApp) antes de ver el primer campo.
            La elección de perfil SÍ va antes del formulario (es la decisión
            que lo configura); lo demás es apoyo y va después.

            En lg vuelven a ser una sola columna gris: rejilla de 2 columnas ×
            2 filas donde las dos piezas grises se apilan en la columna 1
            (filas 1 y 2) y el formulario ocupa la columna 2 entera. La
            columna gris es `auto` y son las piezas las que llevan
            `w-trabaja-rail` — así el ancho lo sigue diciendo el token, sin
            meter el valor en la plantilla de la rejilla. */}
        <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] lg:grid-rows-[auto_1fr]">
          {/* CARRIL, pieza 1 — la elección. Gris dentro del panel blanco: el
              contraste manda la mirada al formulario, que es la acción. */}
          <div className="order-1 border-b border-linea bg-papel-hueso lg:col-start-1 lg:row-start-1 lg:w-trabaja-rail lg:border-b-0 lg:border-r">
            <fieldset>
              <legend className="px-6 pb-1 pt-6 text-sm font-semibold text-navy sm:px-7">
                How would you like to work with us?
              </legend>
              <div className="mt-2 border-t border-linea">
                {PERFILES_TRABAJO.map((p, i) => (
                  <div key={p.id} className={i > 0 ? 'border-t border-linea' : ''}>
                    <FilaPerfil
                      perfil={p}
                      activo={p.id === perfilId}
                      onElegir={() => setPerfilId(p.id)}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* CARRIL, pieza 2 — el apoyo. En móvil cae DEBAJO del formulario
              (order-3); en lg vuelve a la columna gris, bajo la pieza 1.
              flex-col + la fila `1fr` de la rejilla es lo que permite al
              `mt-auto` de AtajoWhatsApp pegarse al fondo del carril. */}
          {/* Sin border-t propio: la raya que lo separa de lo de arriba (del
              formulario en móvil, del selector en lg) ya la pone PasosDespues,
              que la lleva en los dos casos. Dos bordes darían línea doble. */}
          <div className="order-3 flex flex-col bg-papel-hueso lg:col-start-1 lg:row-start-2 lg:w-trabaja-rail lg:border-r lg:border-linea">
            <PasosDespues perfil={perfil} />
            <Respaldo />
            <AtajoWhatsApp />
          </div>

          {/* FORMULARIO — blanco, el único sitio del panel donde se escribe.
              min-w-0 obligatorio: sin él los campos del grid interno
              desbordan la celda en vez de encogerse. */}
          <div className="order-2 p-6 sm:p-8 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:min-w-0 lg:p-10">
            {perfilEnviado ? (
              <Confirmacion perfil={perfilEnviado} onReset={() => setEnviadoComo(null)} />
            ) : (
              <>
                {/* El titular nombra el perfil elegido: es el acuse de que el
                    formulario de la derecha se adaptó a lo que marcaste en el
                    carril de la izquierda. */}
                <h2 className="font-display text-h3 font-semibold text-navy">
                  Applying as {perfil.titulo.toLowerCase()}
                </h2>
                <p className="mt-2 text-sm text-navy-sub">
                  Just enough for us to get back to you. No accounts, no passwords.
                </p>

                <div className="mt-7 flex flex-col gap-5">
                  <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
                    Tus datos
                  </p>
                  <Campo etiqueta="Full name" name="name" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo etiqueta="Email" name="email" type="email" required />
                    <Campo etiqueta="Phone / WhatsApp" name="phone" type="tel" required />
                  </div>
                </div>

                {/* 2º grupo, separado por hairline y con título propio: siete
                    campos seguidos se leen como una cuesta; dos grupos de
                    tres o cuatro, como dos preguntas. El título cambia con el
                    perfil («Sobre tu operación» / «tu perfil» / «tu canal»). */}
                <div className="mt-7 flex flex-col gap-5 border-t border-linea pt-7">
                  <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
                    {perfil.grupoCampos}
                  </p>

                  {/* key con el perfil delante: al cambiar de perfil los
                      campos específicos son OTROS, y sin key React reutiliza
                      el input (mismo tipo, misma posición) con el valor
                      tecleado para el perfil anterior. */}
                  {perfil.campos.map((campo) => (
                    <Campo
                      key={`${perfil.id}-${campo.name}`}
                      // «(opcional)» en vez de un asterisco en los obligatorios:
                      // aquí casi todo es obligatorio, así que marcar la
                      // minoría dice más y ensucia menos.
                      etiqueta={campo.requerido ? campo.etiqueta : `${campo.etiqueta} (opcional)`}
                      name={campo.name}
                      type={campo.tipo ?? 'text'}
                      placeholder={campo.pista}
                      required={campo.requerido}
                    />
                  ))}

                  <Campo
                    etiqueta="Tell us a bit more (optional)"
                    name="message"
                    textarea
                    rows={4}
                    placeholder="Anything you think we should know before we reply."
                  />
                </div>

                <Boton
                  type="submit"
                  className="mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  disabled={enviando}
                >
                  {enviando ? 'Sending…' : 'Send application'}
                </Boton>
                {estado === 'error' ? (
                  <p role="alert" className="mt-3 rounded-btn border border-coral/40 bg-coral/5 p-3 text-xs leading-relaxed text-navy-sub">
                    {ERROR_ENVIO}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-navy-soft">
                    We reply within 24 h. We won’t add you to any mailing list.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}
