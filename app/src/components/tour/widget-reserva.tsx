import { useMemo, useState } from 'react'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { useDevFlag } from '@/dev/use-dev-flag'
import { diaCorto, hoyISO, numeroDeDia, sumarDias } from '@/lib/fechas'
import { formatoDinero, type Tour } from '@/data/home'
import { WHATSAPP_URL, type FichaTour } from '@/data/tours'

// «El widget ES la página» (wireframe A2): sticky en desktop, con el precio en
// el primer viewport — en la web actual ese precio está a 6 pantallas de
// scroll. Es la superficie de decisión de todo el sitio.
//
// ⚠️ El precio ancla es SIEMPRE Light (`precioLight`), nunca Premium: la card
// de la home y este widget prometen «desde US$ 99» y el paso 1 del booking
// tiene que abrir en 99. Anclar aquí y cobrar 114 allí es el bait-and-switch
// que la revisión de conversión marcó como P1 (revision-wireframes.md §1.1) —
// el mismo patrón que criticamos de la web actual. Premium solo aparece como
// delta («+US$ 15») en la sección de menú.
//
// ⚠️ FRONTERA DEL BUILD: el funnel de reserva (4 pasos) no existe en React —
// sigue bloqueado por la decisión del motor xpotours (reemplazar / re-skinear),
// pendiente del cliente. El CTA se pinta con su estado real (deshabilitado sin
// fecha, con el total calculado al elegirla) pero no navega.

type Props = { tour: Tour; ficha: FichaTour }

const DIAS_VISIBLES = 14

function Checks({ lineas }: { lineas: string[] }) {
  return (
    <ul className="flex flex-col gap-1 text-xs text-navy-soft">
      {lineas.map((l) => (
        <li key={l} className="flex gap-1.5">
          <span aria-hidden="true" className="text-menta-texto">
            ✓
          </span>
          {l}
        </li>
      ))}
    </ul>
  )
}

function Caja({ children }: { children: React.ReactNode }) {
  // Mismo lenguaje «objeto suave» que la TourCard de la home: la decisión de
  // compra vive en una caja propia, no suelta sobre el papel.
  return (
    <div
      id="ficha-widget"
      className="flex scroll-mt-sticky-top flex-col gap-4 rounded-card-grande bg-papel p-5 shadow-card ring-1 ring-linea"
    >
      {children}
    </div>
  )
}

function Precio({ tour }: { tour: Tour }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-precio font-semibold text-navy">
        {tour.precioLight !== null ? formatoDinero(tour.precioLight) : 'US$ —'}
      </span>
      {tour.precioLight !== null ? <span className="text-xs text-navy-soft">/persona · desde</span> : null}
    </div>
  )
}

export function WidgetReserva({ tour, ficha }: Props) {
  const [fecha, setFecha] = useState<string | null>(null)
  const [horario, setHorario] = useState(0)
  const [personas, setPersonas] = useState(2)

  // Los 14 días que ofrece el widget. Dos salen agotados (hoy+3 y hoy+10, como
  // el prototipo): el estado «no disponible» tiene que existir en pantalla —
  // es un frame de Figma y es la realidad de un tour que se llena.
  const dias = useMemo(() => {
    const hoy = hoyISO()
    const agotados = [sumarDias(hoy, 3), sumarDias(hoy, 10)]
    return Array.from({ length: DIAS_VISIBLES }, (_, i) => {
      const iso = sumarDias(hoy, i)
      return { iso, agotado: agotados.includes(iso) }
    })
  }, [])

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-widget', (v) => {
    if (v !== 'fecha') return
    const primero = dias.find((d) => !d.agotado)
    if (primero) setFecha(primero.iso)
  })

  if (tour.booking === 'cotizacion') {
    return (
      <Caja>
        <Precio tour={tour} />
        <p className="text-sm text-navy-sub">
          Este tour se cotiza a tu medida según nº de personas y menú — hasta {tour.maxPax} personas.
        </p>
        <EnlacePrototipo className="inline-flex w-full items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark">
          Pedir cotización
        </EnlacePrototipo>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex w-full items-center justify-center rounded-btn bg-papel-hueso px-5 py-3 text-sm font-semibold text-navy ring-1 ring-linea transition hover:bg-papel hover:ring-linea-fuerte"
        >
          WhatsApp directo
        </a>
      </Caja>
    )
  }

  if (tour.booking === 'consulta') {
    return (
      <Caja>
        <Precio tour={tour} />
        {/* El copy no se maquilla: es la verdad del producto (dato pendiente
            del cliente, ver PLAN-v3.md §9). Un precio inventado aquí sería el
            peor sitio posible para inventarlo. */}
        <p className="text-sm text-navy-sub">
          <strong className="font-semibold text-navy">Precio pendiente de confirmar con el cliente.</strong> Duración y
          capacidad también están por definir.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex w-full items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark"
        >
          Consultar por WhatsApp
        </a>
      </Caja>
    )
  }

  const total = tour.precioLight !== null ? tour.precioLight * personas : null
  const claseCampo =
    'w-full rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy transition-colors hover:border-linea-fuerte focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/30'

  return (
    <Caja>
      <Precio tour={tour} />

      <div>
        <p className="mb-2 text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">Elige una fecha</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5">
          {dias.map((d) => {
            const elegido = fecha === d.iso
            return (
              <button
                key={d.iso}
                type="button"
                disabled={d.agotado}
                onClick={() => setFecha(d.iso)}
                aria-pressed={elegido}
                aria-label={`${diaCorto(d.iso)} ${numeroDeDia(d.iso)}${d.agotado ? ' — sin plazas' : ''}`}
                className={`flex min-w-11 shrink-0 flex-col items-center rounded-btn px-2 py-1.5 text-xs transition-colors ${
                  elegido
                    ? 'bg-navy text-white'
                    : d.agotado
                      ? 'cursor-not-allowed bg-papel-hueso text-linea-fuerte line-through'
                      : 'bg-papel-hueso text-navy-sub hover:bg-menta hover:text-menta-texto'
                }`}
              >
                <span className="uppercase">{diaCorto(d.iso)}</span>
                <span className="font-semibold">{numeroDeDia(d.iso)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-navy-sub">Horario</span>
        <select className={claseCampo} value={horario} onChange={(e) => setHorario(Number(e.target.value))}>
          {ficha.horarios.map((h, i) => (
            <option key={h.hora} value={i}>
              {h.hora}
              {h.regreso ? ` — regreso ${h.regreso}` : ''}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-navy-sub">Personas</span>
        <select className={claseCampo} value={personas} onChange={(e) => setPersonas(Number(e.target.value))}>
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {/* Sin fecha, el CTA está DESHABILITADO de verdad (no un botón gris que
          igual navega): el estado vacío es una variante del componente en
          Figma, y se resuelve con tokens, no bajando la opacidad. */}
      {fecha === null ? (
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-btn bg-papel-hueso px-5 py-3 text-sm font-semibold text-navy-soft"
        >
          Elige una fecha
        </button>
      ) : (
        <EnlacePrototipo className="inline-flex w-full items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-cta transition hover:bg-coral-dark">
          Continuar — {formatoDinero(total)}
        </EnlacePrototipo>
      )}

      <Checks
        lineas={['Confirma con 25% de depósito', 'Cancela gratis hasta 7 días antes', 'Reembolso total por mal clima']}
      />
    </Caja>
  )
}
