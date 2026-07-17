import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, MessageCircle, Tag, Users } from 'lucide-react'
import * as Select from '@/components/alignui/select'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as CompactButton from '@/components/alignui/compact-button'
import { guardarCotizacion } from '@/lib/cotizacion-evento'
import { useDevFlag } from '@/dev/use-dev-flag'
import { WHATSAPP_URL, type FichaEvento } from '@/data/eventos'

// Widget de las landings de evento (PLAN-EVENTOS.md) — clon del `widget-reserva.tsx`
// con 2 cambios:
//
//  1) Sin precio. Sin calendario de 14 días. Los eventos se COTIZAN (no
//     se reservan): el formulario va al CRM, no al funnel. La frontera
//     con el backend sigue siendo localStorage (sin Odoo/xpotours, ver
//     PLAN-LANZAMIENTO.md Bloque 0.1/0.2).
//  2) El CTA primario NO navega a un funnel — abre la página de gracias
//     `/eventos/:slug/gracias?reserva=XXX` con el resumen del form, el
//     CTA WhatsApp grande y el copy "Pronto nos pondremos en contacto".
//
// Chrome: misma Caja, mismo FancyButton coral, mismo lenguaje AlignUI que
// el widget de tour (Slots ya tematizados en styles/alignui.css). Mismo
// padding ajustado (Samuel: "reduce el padding" — la v3 del widget de
// tour bajó a p-4 sm:p-5, mismo aquí).

type Props = { evento: FichaEvento }

const MAX_PERSONAS = 200 // tope: la web del cliente lo tiene en min=1, max=120
const MIN_PERSONAS = 1

function Caja({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="evento-widget"
      className="flex scroll-mt-sticky-top flex-col gap-4 rounded-card-grande bg-papel p-4 ring-1 ring-linea sm:p-5"
    >
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
      <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
        <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
        <span key={value} aria-live="polite" className="stepper-tick tabular-nums">
          {value === 1 ? '1 persona' : `${value} personas`}
        </span>
      </span>
      <div className="flex items-center gap-1">
        <CompactButton.Root
          type="button"
          variant="stroke"
          fullRadius
          aria-label="Quitar una persona"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
        >
          <CompactButton.Icon as={Minus} />
        </CompactButton.Root>
        <CompactButton.Root
          type="button"
          variant="stroke"
          fullRadius
          aria-label="Añadir una persona"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
        >
          <CompactButton.Icon as={Plus} />
        </CompactButton.Root>
      </div>
    </div>
  )
}

export function WidgetEvento({ evento }: Props) {
  const navigate = useNavigate()
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

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'lleno' pre-rellena los 7 campos para mostrar el frame "form lleno"
  // de Figma + verificar la validación visual.
  useDevFlag('dev-widget-evento', (v) => {
    if (v === 'lleno') {
      setNombre('Ana Pérez')
      setEmail('ana@email.com')
      setWhatsapp('+1 829 000 0000')
      if (evento.tipoFijo === -1) setTipoIdx(0)
      setFecha('2026-12-15')
      setPersonas(40)
      setMensaje('Quisiera cotizar para un cumpleaños con cena y barra libre.')
    }
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Si el tipo es el placeholder (-1), el `required` del Select ya
    // bloqueó el submit — pero por si el navegador es permisivo, no
    // navegamos con tipo inválido.
    if (tipoIdx < 0 || tipoIdx >= evento.tiposEvento.length) return

    const cotizacion = guardarCotizacion({
      slug: evento.slug,
      contacto: { nombre, email, whatsapp },
      tipoEvento: evento.tiposEvento[tipoIdx],
      fecha,
      personas,
      mensaje,
    })

    // Navega a la página de gracias. El `replace: true` evita que el
    // back del navegador vuelva al form con datos sensibles ya enviados.
    navigate(`/eventos/${evento.slug}/gracias?reserva=${cotizacion.codigo}`, { replace: true })
  }

  // Mismo banner "Ahorra 5% en efectivo" que el widget de tour — es
  // confianza, no precio, y aplica también a eventos: reservar por
  // WhatsApp directo (no por OTA) tiene el mismo descuento.
  return (
    <Caja>
      <h2 className="font-display text-lg font-semibold text-navy">
        {evento.ctaPrincipal}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate={false}>
        <Campo
          id="evento-nombre"
          label="Nombre"
          required
          value={nombre}
          onChange={setNombre}
          placeholder="Tu nombre"
          autoComplete="name"
        />
        <Campo
          id="evento-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={setEmail}
          placeholder="tu@email.com"
          autoComplete="email"
        />
        <Campo
          id="evento-whatsapp"
          label="WhatsApp"
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
            <label className="mb-1 block text-xs font-medium text-navy-sub">Tipo de evento</label>
            <div className="flex h-10 items-center rounded-10 border border-stroke-soft-200 bg-bg-weak-50 px-3 text-paragraph-sm text-text-strong-950">
              {evento.tiposEvento[0]}
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="evento-tipo" className="mb-1 block text-xs font-medium text-navy-sub">
              Tipo de evento
              <span aria-hidden="true" className="ml-0.5 text-coral">
                *
              </span>
            </label>
            <Select.Root value={String(tipoIdx)} onValueChange={(v) => setTipoIdx(Number(v))}>
              <Select.Trigger
                id="evento-tipo"
                className="h-10 w-full"
                // El Select de AlignUI gestiona `data-placeholder` cuando el
                // value no matchea ninguna opción. tipoIdx === -1 → placeholder.
              >
                <Select.Value placeholder="Selecciona el tipo" />
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
          label="Fecha tentativa"
          type="date"
          value={fecha}
          onChange={setFecha}
        />

        <div>
          <span className="mb-1 block text-xs font-medium text-navy-sub" id="evento-label-personas">
            Nº de personas
          </span>
          <div role="group" aria-labelledby="evento-label-personas">
            <StepperPersonas value={personas} onChange={setPersonas} />
          </div>
        </div>

        <Textarea
          id="evento-mensaje"
          label="Cuéntanos más"
          value={mensaje}
          onChange={setMensaje}
          placeholder="Detalles del evento, horario preferido, menú, etc."
        />

        <FancyButton.Root type="submit" variant="primary" className="w-full">
          {evento.ctaPrincipal}
        </FancyButton.Root>

        {/* CTA secundario opcional — solo empresas tiene "Dossier
            corporativo (PDF)" en data. Va como link a WhatsApp
            (mismo mensaje, contacto directo) — la web del cliente lo
            tenía como botón "demo" sin PDF real. */}
        {evento.ctaSecundaria ? (
          <FancyButton.Root variant="basic" className="w-full" asChild>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola! Me interesa el dossier corporativo de Hispaniola Aquatic Adventures. Mi nombre es `)}`}
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
        Cotizando directo ahorras hasta 15%
      </div>

      {/* 3 checks de reassurance — el mismo lenguaje del widget de
          tour, adaptado a eventos (no hay "25% de depósito" porque no
          se reserva con depósito). */}
      <ul className="flex flex-col gap-1.5 text-xs text-navy-soft">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-menta-texto">✓</span>
          Respuesta en menos de 24 h
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-menta-texto">✓</span>
          Sin compromiso — cotizamos gratis
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-menta-texto">✓</span>
          WhatsApp directo con el equipo del barco
        </li>
      </ul>
    </Caja>
  )
}
