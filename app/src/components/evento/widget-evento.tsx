import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, MessageCircle, Tag, Users } from 'lucide-react'
import * as Modal from '@/components/alignui/modal'
import * as Select from '@/components/alignui/select'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as CompactButton from '@/components/alignui/compact-button'
import { ChecksTicker } from '@/components/ui/checks-ticker'
import { NumeroEditable } from '@/components/ui/numero-editable'
import { guardarCotizacion } from '@/lib/cotizacion-evento'
import { useDevFlag } from '@/dev/use-dev-flag'
import { WHATSAPP_URL, type FichaEvento } from '@/data/eventos'
import { t } from '@/lib/i18n'

// Widget de las landings de evento (PLAN-EVENTOS.md) — clon del `widget-reserva.tsx`
// con 2 cambios:
//
//  1) Sin precio. Sin calendario de 14 días. Los eventos se COTIZAN (no
//     se reservan): el formulario va al CRM, no al funnel. La frontera
//     con el backend sigue siendo localStorage (sin Odoo/xpotours, ver
//     PLAN-LANZAMIENTO.md Bloque 0.1/0.2).
//  2) El CTA primario NO navega a un funnel — abre la página de gracias
//     `/events/:slug/thank-you?reserva=XXX` con el resumen del form, el
//     CTA WhatsApp grande y el copy "Pronto nos pondremos en contacto".
//
// Chrome: misma Caja, mismo FancyButton coral, mismo lenguaje AlignUI que
// el widget de tour (Slots ya tematizados en styles/alignui.css). Mismo
// padding ajustado (Samuel: "reduce el padding" — la v3 del widget de
// tour bajó a p-4 sm:p-5, mismo aquí).
//
// ── EL FORMULARIO NO COMPITE CON LA COMPRA (2026-07-28) ─────────────────
// Desde que la columna lleva la reserva online arriba (calculadora-evento.tsx),
// el formulario de cotización debajo era un segundo camino, siempre desplegado,
// con sus 7 campos a la vista. Samuel lo detectó y propuso un TOGGLE arriba de
// la columna, por defecto en «Reserva online».
//
// Se hace distinto —divulgación progresiva en vez de toggle— y conviene decir
// por qué, porque el objetivo es el mismo:
//   · Un toggle de 2 posiciones OBLIGA a elegir antes de saber qué hay detrás
//     de cada una, y en el sitio más caro de la página. Es el gesto correcto
//     cuando las dos opciones son igual de probables (Light/Premium del widget
//     de tour), y aquí no lo son: la inmensa mayoría de quien llega a party
//     boat cabe en un paquete de precio cerrado.
//   · Dos pestañas del mismo tamaño dicen «esto son dos caminos iguales». La
//     página entonces empata comprar con pedir presupuesto, que es exactamente
//     lo que Samuel quiere evitar («que no distraiga al usuario de la compra»).
//   · Con el toggle, el formulario sigue existiendo entero al otro lado: la
//     columna no se acorta y el visitante que solo quiere reservar sigue
//     teniendo un botón que le lleva a rellenar campos.
// Así que el formulario se PLIEGA detrás de una sola línea que nombra su caso
// de uso («tu evento no encaja en un paquete»). Quien no se ve en esa frase no
// se distrae; quien sí, la reconoce y abre. Cuesta un clic más, pero solo a
// quien de todas formas iba a rellenar 7 campos.
//
// Se sigue cumpliendo el orden que pidió el cliente en los slides 14-15
// («reserva online y DEBAJO el formulario»): sigue debajo, y sin toggle que
// esconda la reserva online.
//
// ⚠️ REVERTIR ES BARATO si Samuel prefiere su toggle: el estado ya vive aquí
// (`abierto`) — sería levantarlo a pages/evento.tsx y pintar dos pestañas
// arriba de la columna.

type Props = {
  evento: FichaEvento
  /** [v2 2026-07-28] El formulario arranca PLEGADO, detrás de una línea de
   *  invitación. Lo activa pages/evento.tsx solo cuando la columna tiene
   *  arriba la reserva online (party boat y bodas, las dos landings con
   *  paquetes de precio cerrado). Sin calculadora —MICE— el formulario ES
   *  el widget y se pinta abierto, como siempre. */
  colapsable?: boolean
  /** Id del paquete marcado en la columna de al lado. Viaja con la solicitud
   *  para que la cotización llegue a Odoo diciendo qué se pidió. */
  paqueteElegido?: string | null
}

const MAX_PERSONAS = 200 // tope: la web del cliente lo tiene en min=1, max=120
const MIN_PERSONAS = 1

function Caja({ children }: { children: React.ReactNode }) {
  return (
    // `widget-marco` (sombra INSET de 1px) en vez de `ring-1 ring-linea`: el
    // ring se pinta POR FUERA del borde y el contenedor de scroll de la
    // columna (lg:overflow-y-auto en pages/evento.tsx) lo recortaba a los
    // lados — el borde se veía a trozos. Mismo diagnóstico y misma cura que
    // en el widget de la ficha de tour (ver componentes.css §widget-marco).
    // El ancla #evento-widget YA NO vive aquí: se muda a la columna entera en
    // pages/evento.tsx, para que el «Reservar» del header caiga en la reserva
    // online (que es lo primero de la columna) y no en el formulario.
    <div className="flex flex-col gap-4 rounded-card-grande bg-papel p-4 widget-marco sm:p-5">
      {children}
    </div>
  )
}

// Campo de texto con label — HTML nativo con tokens. Mismo idioma visual
// que el Select de AlignUI (mismo borde, mismo alto, mismo focus). El
// `error` pinta un asterisco invisible a los lectores de pantalla +
// texto adyacente (a11y: el <label> lo describe, no `aria-required`).
function Campo({
  id,
  label,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
  min,
  max,
  autoComplete,
}: {
  id: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number'
  required?: boolean
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  min?: number
  max?: number
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-navy-sub">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-coral">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3 text-paragraph-sm text-text-strong-950 outline-none transition duration-200 ease-out placeholder:text-text-sub-600 hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950"
      />
    </div>
  )
}

function Textarea({
  id,
  label,
  required = false,
  value,
  onChange,
  placeholder,
  filas = 4,
}: {
  id: string
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  placeholder?: string
  filas?: number
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-navy-sub">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-coral">
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={filas}
        className="w-full rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-paragraph-sm text-text-strong-950 outline-none transition duration-200 ease-out placeholder:text-text-sub-600 hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950"
      />
    </div>
  )
}

// Stepper de personas — mismo lenguaje que el del widget de tour
// (CompactButton ×2 + count, con `active:` override para feedback).
// El chip "+N personas" usa `tabular-nums` para que no salte al
// pasar de 9 a 10. Mismo `key={personas}` para que el `.stepper-tick`
// (componentes.css) re-dispare la animación de pulso en cada cambio.
function StepperPersonas({
  value,
  onChange,
  min = MIN_PERSONAS,
  max = MAX_PERSONAS,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
      <span className="flex items-center gap-1 text-paragraph-sm text-text-strong-950">
        <Users className="mr-1 size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
        <NumeroEditable
          valor={value}
          min={min}
          max={max}
          onCambio={onChange}
          etiqueta={t('Number of guests')}
          className="tabular-nums"
        />
        {t(value === 1 ? 'guest' : 'guests')}
      </span>
      <div className="flex items-center gap-1">
        <CompactButton.Root
          type="button"
          variant="stroke"
          fullRadius
          aria-label={t('Remove one guest')}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
        >
          <CompactButton.Icon as={Minus} />
        </CompactButton.Root>
        <CompactButton.Root
          type="button"
          variant="stroke"
          fullRadius
          aria-label={t('Add one guest')}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
        >
          <CompactButton.Icon as={Plus} />
        </CompactButton.Root>
      </div>
    </div>
  )
}

export function WidgetEvento({ evento, colapsable = false, paqueteElegido = null }: Props) {
  const navigate = useNavigate()
  // [v2 2026-07-28] Ver el comentario largo de arriba (§EL FORMULARIO NO
  // COMPITE CON LA COMPRA). `abierto` arranca en true salvo que la página
  // pida plegarlo.
  const [abierto, setAbierto] = useState(!colapsable)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  // tipoIdx: si el evento tiene un tipo fijo (bodas: "Boda"), arranca en
  // ese. Si no, en -1 (el placeholder "Selecciona…" del Select es el
  // estado inicial). El `required` del Select se valida a -1 como vacío.
  const [tipoIdx, setTipoIdx] = useState<number>(evento.tipoFijo)
  const [fecha, setFecha] = useState('')
  const [personas, setPersonas] = useState(20) // default del prototipo: 20
  const [mensaje, setMensaje] = useState('')
  // [2026-08-10, conexión con Odoo] El envío dejó de ser instantáneo: ahora
  // viaja al CRM. Estos dos estados son el mínimo para no mentirle a nadie —
  // sin ellos se puede pulsar dos veces (dos cotizaciones duplicadas) y un
  // fallo de red terminaría en la pantalla de «pronto te contactamos» sin que
  // el mensaje haya salido del navegador.
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'lleno' pre-rellena los 7 campos para mostrar el frame "form lleno"
  // de Figma + verificar la validación visual.
  useDevFlag('dev-widget-evento', (v) => {
    if (v === 'lleno') {
      // Un form lleno pero plegado no se ve: el frame de Figma lo necesita
      // abierto, aunque la landing lo pliegue por defecto.
      setAbierto(true)
      setNombre(t('Ana Pérez'))
      setEmail('ana@email.com')
      setWhatsapp('+1 829 000 0000')
      if (evento.tipoFijo === -1) setTipoIdx(0)
      setFecha('2026-12-15')
      setPersonas(40)
      setMensaje(t('I’d like a quote for a birthday with dinner and open bar.'))
    }
  })

  // [dev-mode] ?dev-cotizacion-evento=plegada|abierta — los dos frames del
  // formulario plegable en la landing que sí lo pliega (party boat).
  useDevFlag('dev-cotizacion-evento', (v) => {
    if (v === 'plegada') setAbierto(false)
    if (v === 'abierta') setAbierto(true)
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Si el tipo es el placeholder (-1), el `required` del Select ya
    // bloqueó el submit — pero por si el navegador es permisivo, no
    // navegamos con tipo inválido.
    if (tipoIdx < 0 || tipoIdx >= evento.tiposEvento.length) return
    if (enviando) return

    setEnviando(true)
    setErrorEnvio(null)
    const cotizacion = await guardarCotizacion({
      slug: evento.slug,
      contacto: { nombre, email, whatsapp },
      tipoEvento: evento.tiposEvento[tipoIdx],
      // [2026-08-25, Samuel: «los eventos no funciona su compra, manéjalo
      // correctamente con Odoo»] Estos tres productos NO se cobran online (en
      // Odoo son `booking_mode: quote`), así que lo que tiene que funcionar es
      // la solicitud — y llegaba coja: el visitante marcaba «Grand Package» en
      // la columna de al lado y al equipo le entraba una cotización que no
      // decía qué paquete había elegido. Se manda el NOMBRE, no el id: lo lee
      // una persona en el back-office.
      paquete: evento.paquetes?.items.find((p) => p.id === paqueteElegido)?.nombre,
      fecha,
      personas,
      mensaje,
    })
    setEnviando(false)

    // Si no llegó al CRM no se navega a «pronto nos pondremos en contacto»:
    // se queda aquí, con el formulario intacto y el error a la vista, para que
    // pueda reintentar o irse por WhatsApp (el CTA de al lado).
    if (cotizacion.error) {
      setErrorEnvio(cotizacion.error)
      return
    }

    // Navega a la página de gracias. El `replace: true` evita que el
    // back del navegador vuelva al form con datos sensibles ya enviados.
    navigate(`/events/${evento.slug}/thank-you?reserva=${cotizacion.codigo}`, { replace: true })
  }

  // EL FORMULARIO, una sola vez. Se pinta o dentro de la Caja de la columna
  // (bodas, empresas) o dentro del modal (party boat) — mismos campos, misma
  // validación, mismo submit. `enModal` solo cambia la REJILLA: en la columna
  // de 374px los campos van uno debajo de otro; en el modal, que es el doble
  // de ancho, van a 2 columnas para que el formulario entero se lea sin
  // scroll (que es justo lo que se venía a arreglar).
  const formulario = (enModal: boolean) => (
    <>
      <form
        id="evento-form"
        onSubmit={handleSubmit}
        className={enModal ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-col gap-3'}
        noValidate={false}
      >
        <Campo
          id="evento-nombre"
          label={t('Name')}
          required
          value={nombre}
          onChange={setNombre}
          placeholder={t('Your name')}
          autoComplete="name"
        />
        <Campo
          id="evento-email"
          label={t('Email')}
          type="email"
          required
          value={email}
          onChange={setEmail}
          placeholder={t('you@email.com')}
          autoComplete="email"
        />
        <Campo
          id="evento-whatsapp"
          label={t('WhatsApp')}
          type="tel"
          required
          value={whatsapp}
          onChange={setWhatsapp}
          placeholder="+1 829 000 0000"
          autoComplete="tel"
        />

        {/* Select de tipo de evento. Si el evento tiene un tipo fijo
            (bodas: solo "Boda"), se pinta como campo deshabilitado —
            no como select — para que el visitante entienda que no
            elige: YA eligió al entrar a esta landing. */}
        {evento.tiposEvento.length === 1 ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-sub">{t('Event type')}</label>
            <div className="flex h-10 items-center rounded-10 border border-stroke-soft-200 bg-bg-weak-50 px-3 text-paragraph-sm text-text-strong-950">
              {evento.tiposEvento[0]}
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="evento-tipo" className="mb-1 block text-xs font-medium text-navy-sub">
              {t('Event type')}
              <span aria-hidden="true" className="ml-0.5 text-coral">
                *
              </span>
            </label>
            {/* [v2 2026-07-28] `''` y no `'-1'` cuando no hay tipo elegido:
                Radix solo pinta el placeholder con value vacío o undefined —
                con '-1' (una cadena que no casa con ninguna opción) dejaba el
                campo EN BLANCO, sin el «Selecciona el tipo». Se veía poco
                estando el form apilado en la columna; en el modal, con los
                campos a 2 columnas, quedaba un hueco vacío al lado de
                WhatsApp. Es un campo obligatorio: tiene que decir qué se
                espera de él. */}
            <Select.Root
              value={tipoIdx >= 0 ? String(tipoIdx) : ''}
              onValueChange={(v) => setTipoIdx(Number(v))}
            >
              <Select.Trigger
                id="evento-tipo"
                className="h-10 w-full"
                // El Select de AlignUI gestiona `data-placeholder` cuando el
                // value no matchea ninguna opción. tipoIdx === -1 → placeholder.
              >
                <Select.Value placeholder={t('Choose the type')} />
              </Select.Trigger>
              <Select.Content>
                {evento.tiposEvento.map((tipo, i) => (
                  <Select.Item key={tipo} value={String(i)}>
                    {tipo}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {/* `required` simulado: el Select de AlignUI no soporta HTML
                required. Marcamos el Select como requerido y validamos
                a mano: si tipoIdx < 0 al submit, abortamos. La
                validación visible la da el placeholder "Selecciona…"
                + el asterisco del label. */}
            <input
              type="hidden"
              required
              value={tipoIdx >= 0 ? 'x' : ''}
              onChange={() => {}}
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        )}

        <Campo
          id="evento-fecha"
          label={t('Preferred date')}
          type="date"
          value={fecha}
          onChange={setFecha}
        />

        <div>
          <span className="mb-1 block text-xs font-medium text-navy-sub" id="evento-label-personas">
            {t('No. of guests')}
          </span>
          <div role="group" aria-labelledby="evento-label-personas">
            <StepperPersonas value={personas} onChange={setPersonas} />
          </div>
        </div>

        {/* Los `sm:col-span-2` solo hacen algo en el modal (el contenedor es
            grid); en la columna el contenedor es flex y son inertes. */}
        <div className="sm:col-span-2">
          <Textarea
            id="evento-mensaje"
            label={t('Tell us more')}
            value={mensaje}
            onChange={setMensaje}
            placeholder={t('Event details, preferred time, menu, etc.')}
            filas={enModal ? 3 : 4}
          />
        </div>

        <FancyButton.Root
          type="submit"
          variant="primary"
          className="w-full sm:col-span-2"
          disabled={enviando}
        >
          {enviando ? 'Sending…' : evento.ctaPrincipal}
        </FancyButton.Root>

        {errorEnvio ? (
          <p role="alert" className="text-sm text-coral sm:col-span-2">
            {t('We could not send your request. Please try again, or reach us on WhatsApp.')}
          </p>
        ) : null}

        {/* CTA secundario opcional — solo empresas tiene "Dossier
            corporativo (PDF)" en data. Va como link a WhatsApp
            (mismo mensaje, contacto directo) — la web del cliente lo
            tenía como botón "demo" sin PDF real. */}
        {evento.ctaSecundaria ? (
          <FancyButton.Root variant="basic" className="w-full sm:col-span-2" asChild>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi! I'd like the corporate dossier for Hispaniola Aquatic Adventures. My name is `)}`}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle className="mr-2 size-4" aria-hidden="true" />
              {evento.ctaSecundaria}
            </a>
          </FancyButton.Root>
        ) : null}
      </form>

      {/* Banner de confianza — el descuento del 5% es por reservar
          directo, no por OTA. Aplica también a eventos. */}
      <div className="flex items-center justify-center gap-1.5 rounded-btn bg-menta px-3 py-1.5 text-center text-xs font-medium text-menta-texto">
        <Tag className="size-3.5 shrink-0" aria-hidden="true" />
        {t('Quote direct and save up to 15%')}
      </div>

      {/* 3 checks de reassurance — TICKER INFINITO horizontal, IGUAL
          al del widget de tour (2026-07-17, pedido de Samuel: "que los
          3 puntos (que son los mismos que tenemos en tours) sean igual
          un ticker infinito pasando en horizontal, tiene que ser el
          mismo que esta en tours"). Reusa el mismo componente
          `components/ui/checks-ticker.tsx` — misma animación, misma
          pausa al hover, misma respuesta a prefers-reduced-motion.
          [v2 2026-07-28] En el modal NO se pinta: sus dos primeros checks
          («respuesta en menos de 24 h», «sin compromiso») ya los dice la
          bajada del título, y un texto que se desliza solo al pie de un
          formulario abierto compite con lo único que ahí importa, que es
          rellenarlo. */}
      {enModal ? null : (
        <ChecksTicker
          lineas={[
            t('Reply within 24 h'),
            t('No commitment, quotes are free'),
            t('WhatsApp straight to the boat’s team'),
          ]}
        />
      )}
    </>
  )

  // ── SIN CALCULADORA (MICE): el formulario ES el widget ──────────────────
  if (!colapsable) {
    return (
      <Caja>
        <h2 className="font-display text-lg font-semibold text-navy">{evento.ctaPrincipal}</h2>
        {formulario(false)}
      </Caja>
    )
  }

  // ── CON CALCULADORA (party boat, bodas): teaser en la columna + modal ───
  // El teaser cabe en 3 líneas a propósito (Samuel, 2026-07-28: «que entre
  // sin que haya que hacer scroll»): junto a la calculadora recortada, la
  // columna entera cabe en una ventana de portátil, así que el visitante ve
  // los DOS caminos —comprar y cotizar— sin mover la página.
  // El copy del teaser sale del DATO (`cotizacionPlegada`) porque nombra el
  // caso que sí hay que cotizar, y ese caso cambia con la ocasión: en party
  // boat es «no cabe en un paquete»; en bodas, la ceremonia y el montaje.
  // Decirle «Bodas, grupos grandes…» a quien está en la landing de bodas
  // sería mandarle a donde ya está.
  return (
    <>
      <Caja>
        <p className="font-display text-base font-semibold text-navy">
          {evento.cotizacionPlegada?.titulo ?? t('Doesn’t your event fit a package?')}
        </p>
        <p className="-mt-2 text-sm text-navy-sub">
          {evento.cotizacionPlegada?.sub ??
            'Large groups or a custom menu: we quote you free within 24 h.'}
        </p>
        {/* `basic` (neutro) a propósito: el coral de esta columna es del CTA
            de reserva, y dos botones coral seguidos serían dos «acción
            principal». */}
        <FancyButton.Root
          type="button"
          variant="basic"
          className="w-full"
          onClick={() => setAbierto(true)}
          aria-haspopup="dialog"
        >
          {evento.ctaPrincipal}
        </FancyButton.Root>
      </Caja>

      {/* EL FORMULARIO ABRE EN MODAL y no desplegado en la columna (Samuel,
          2026-07-28: «al darle el botón que el formulario aparezca como modal,
          no puesto ahí para que también haya que hacer scroll»). Tiene razón y
          el argumento va más allá del scroll: un formulario de 7 campos metido
          en una columna de 374px se sale de la ventana por abajo sí o sí, así
          que rellenarlo obligaba a scrollear dentro de un widget sticky —el
          peor sitio para escribir— mientras el resto de la página distraía por
          detrás. En modal, el formulario tiene el doble de ancho (2 columnas
          de campos), entra entero en pantalla, atrapa el foco y se cierra con
          Escape.
          Mismo Modal de AlignUI que la ficha técnica de la flota y el visor de
          videos: scroll-lock, focus-trap y overlay con blur ya resueltos. */}
      {abierto ? (
        <Modal.Root open onOpenChange={(v) => setAbierto(v)}>
          <Modal.Content
            overlayClassName="bg-navy/55 p-4 backdrop-blur-md"
            // max-h + flex-col: si la ventana es baja (o el móvil es
            // pequeño), scrollea SOLO el cuerpo y la cabecera se queda.
            className="flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-card-grande"
            aria-describedby={undefined}
          >
            {/* `pr-10` deja sitio al botón de cerrar del vendor, que va
                absoluto en la esquina. */}
            <div className="shrink-0 border-b border-linea px-5 pb-4 pt-5">
              <Modal.Title className="pr-10 font-display text-h3 font-semibold text-navy">
                {evento.ctaPrincipal}
              </Modal.Title>
              <p className="mt-1 text-sm text-navy-sub">
                {t('Tell us what you have in mind and we’ll reply within 24 h. No commitment.')}
              </p>
            </div>

            <div className="scroll-sutil flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
              {formulario(true)}
            </div>
          </Modal.Content>
        </Modal.Root>
      ) : null}
    </>
  )
}
