import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Tag } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as Select from '@/components/alignui/select'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { useDevFlag } from '@/dev/use-dev-flag'
import { diaCorto, hoyISO, numeroDeDia, sumarDias } from '@/lib/fechas'
import { formatoDinero, type Tour } from '@/data/home'
import { WHATSAPP_URL, type FichaTour } from '@/data/tours'

// «El widget ES la página» (wireframe A2): sticky en desktop, con el precio en
// el primer viewport — en la web actual ese precio está a 6 pantallas de
// scroll. Es la superficie de decisión de todo el sitio.
//
// ⚠️ El precio ABRE SIEMPRE en Light (`precioLight`), nunca en Premium: la card
// de la home y este widget prometen «desde US$ 99». Fase B (2026-07-17): el
// paquete ya se ELIGE aquí (selector Light/Premium) y al pasar a Premium el
// precio de cabecera y el total del CTA saltan a la tarifa Premium — pero es un
// opt-in EXPLÍCITO del visitante, con Light por defecto, así que se mantiene el
// guardarraíl anti bait-and-switch (analisis/revision-wireframes.md §1.1: lo
// prohibido es ANCLAR en 99 y cobrar 114 sin que el usuario lo pida). El
// «ahorra hasta 15%» junto al CTA son los descuentos reales (recurrente +
// anticipación + efectivo) mostrados SOBRE el precio de lista, no anclados en
// él (decisión de precio de Samuel: se ancla en la tarifa que todos pagan).
//
// FRONTERA DEL BUILD (Fase C, 2026-07-17): el funnel de reserva YA existe
// (/reservar/:slug, 4 pasos) y «Continuar» navega a él con la config en la URL
// (paquete · fecha · horario · personas). La frontera se MUEVE al final de ese
// funnel: el depósito del 25% no se cobra (el motor xpotours sigue pendiente del
// cliente) y el paso 4 lo dice con todas las letras. El CTA sigue deshabilitado
// de verdad sin fecha.
//
// Etapa A (PLAN-ALIGNUI.md): el chrome del widget habla AlignUI — selects de
// Radix (Select) y CTAs FancyButton con los slots tematizados (primary=coral).
// Los CHIPS DE FECHA y el selector de PAQUETE se quedan como diseño propio: son
// piezas de conversión del widget y AlignUI no tiene equivalente (decisión
// abierta §13 del plan). El halo coral (--shadow-cta) se retira del CTA:
// FancyButton trae su propio relieve (shadow-fancy-buttons-primary) y los dos
// lenguajes de sombra a la vez se pelean.

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
  // compra vive en una caja propia, no suelta sobre el fondo. PLAN-INTERNAS-
  // V2.md §C2: BLOQUE_FICHA en vez de un p-5 propio — la misma receta que el
  // resto de bloques de la ficha, para que el widget lea como una card más
  // sobre --color-fondo-ficha y no como la única pieza con su padding aparte.
  return (
    <div id="ficha-widget" className={`${BLOQUE_FICHA} flex scroll-mt-sticky-top flex-col gap-4`}>
      {children}
    </div>
  )
}

// `desde` añade «· desde» al sufijo: se usa cuando el precio es un SUELO (Light,
// o el «desde US$ 75» de una cotización), no cuando es la tarifa exacta ya
// elegida (Premium).
function Precio({ precio, desde = false }: { precio: number | null; desde?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-precio font-semibold text-navy">
        {precio !== null ? formatoDinero(precio) : 'US$ —'}
      </span>
      {precio !== null ? <span className="text-xs text-navy-soft">/persona{desde ? ' · desde' : ''}</span> : null}
    </div>
  )
}

export function WidgetReserva({ tour, ficha }: Props) {
  const [fecha, setFecha] = useState<string | null>(null)
  const [horario, setHorario] = useState(0)
  const [personas, setPersonas] = useState(2)
  // Fase B: el paquete se elige en el widget. Abre en Light (ancla US$ 99);
  // Premium es opt-in explícito — ver la nota de bait-and-switch de arriba.
  const [paquete, setPaquete] = useState<'light' | 'premium'>('light')

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

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'fecha' elige el 1er día libre; 'premium' además cambia el paquete a
  // Premium (el frame que enseña el precio saltando a la tarifa Premium).
  useDevFlag('dev-widget', (v) => {
    if (v !== 'fecha' && v !== 'premium') return
    const primero = dias.find((d) => !d.agotado)
    if (primero) setFecha(primero.iso)
    if (v === 'premium') setPaquete('premium')
  })

  if (tour.booking === 'cotizacion') {
    return (
      <Caja>
        <Precio precio={tour.precioLight} desde />
        <p className="text-sm text-navy-sub">
          Este tour se cotiza a tu medida según nº de personas y menú — hasta {tour.maxPax} personas.
        </p>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <EnlacePrototipo>Pedir cotización</EnlacePrototipo>
        </FancyButton.Root>
        <FancyButton.Root variant="basic" className="w-full" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            WhatsApp directo
          </a>
        </FancyButton.Root>
      </Caja>
    )
  }

  if (tour.booking === 'consulta') {
    return (
      <Caja>
        <Precio precio={tour.precioLight} desde />
        {/* El copy no se maquilla: es la verdad del producto (dato pendiente
            del cliente, ver PLAN-v3.md §9). Un precio inventado aquí sería el
            peor sitio posible para inventarlo. */}
        <p className="text-sm text-navy-sub">
          <strong className="font-semibold text-navy">Precio pendiente de confirmar con el cliente.</strong> Duración y
          capacidad también están por definir.
        </p>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            Consultar por WhatsApp
          </a>
        </FancyButton.Root>
      </Caja>
    )
  }

  // booking 'completo': precio reactivo al paquete elegido. El ancla es Light;
  // Premium suma el upgrade real (delta de data/tours.ts). Los tours 'completo'
  // siempre traen precio y upgrade, pero se comprueba null por el tipo.
  const precioBase = tour.precioLight
  const upgrade = ficha.upgradePremium
  const tienePaquetes = precioBase !== null && upgrade !== null
  const precioPersona =
    paquete === 'premium' && precioBase !== null && upgrade !== null ? precioBase + upgrade : precioBase
  const total = precioPersona !== null ? precioPersona * personas : null

  return (
    <Caja>
      <Precio precio={precioPersona} desde={paquete === 'light'} />

      {/* Selector de paquete (Fase B). Solo si el tour vende por paquetes
          (upgradePremium !== null). TOGGLE SEGMENTADO, no dos cards-selector
          (feedback de Samuel 2026-07-17: "que parezca más un toggle switch
          button"): una sola pista tipo switch (bg-papel-hueso) con el segmento
          activo relleno en navy. Cada mitad lleva su tarifa de LISTA inline
          para comparar 99 vs 114 de un vistazo; sin el conteo de platos (eso
          vive en la sección de menú). */}
      {tienePaquetes && precioBase !== null && upgrade !== null ? (
        <div>
          <p className="mb-2 text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">Elige tu paquete</p>
          {/* Track relativo con un THUMB deslizante (feedback de Samuel
              2026-07-17): en vez de que cada botón cambie su propio fondo, un
              único elemento navy se DESLIZA al segmento activo — lee más como un
              switch de verdad. El ancho del thumb y su desplazamiento derivan de
              p-1 (4px) + gap-1 (4px): cada segmento mide calc(50% - 6px) y el
              salto al 2º es su ancho + el gap → translateX(100% + 4px). */}
          <div className="relative grid grid-cols-2 gap-1 rounded-full bg-papel-hueso p-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-navy transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: paquete === 'premium' ? 'translateX(calc(100% + 0.25rem))' : 'translateX(0)' }}
            />
            {[
              { id: 'light' as const, nombre: 'Light', precio: precioBase },
              { id: 'premium' as const, nombre: 'Premium', precio: precioBase + upgrade },
            ].map((p) => {
              const activo = paquete === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaquete(p.id)}
                  aria-pressed={activo}
                  className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors ${
                    activo ? 'text-white' : 'text-navy-sub hover:text-navy'
                  }`}
                >
                  <span className="font-semibold">{p.nombre}</span>
                  <span className={activo ? 'text-white/70' : 'text-navy-soft'}>{formatoDinero(p.precio)}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

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

      {/* Radix necesita valores string: el índice del horario y el nº de
          personas viajan como String(n) y vuelven con Number(v). */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub" id="widget-label-horario">
          Horario
        </span>
        <Select.Root value={String(horario)} onValueChange={(v) => setHorario(Number(v))}>
          <Select.Trigger aria-labelledby="widget-label-horario">
            <Select.TriggerIcon as={Clock} />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {ficha.horarios.map((h, i) => (
              <Select.Item key={h.hora} value={String(i)}>
                {h.hora}
                {h.regreso ? ` — regreso ${h.regreso}` : ''}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub" id="widget-label-personas">
          Personas
        </span>
        <Select.Root value={String(personas)} onValueChange={(v) => setPersonas(Number(v))}>
          <Select.Trigger aria-labelledby="widget-label-personas">
            <Select.TriggerIcon as={Users} />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <Select.Item key={n} value={String(n)}>
                {n === 1 ? '1 persona' : `${n} personas`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* «Ahorra hasta 15%» (decisión de precio, Fase B): el precio mostrado es
          el de LISTA (el que todos pagan); los descuentos —recurrente +
          anticipación + efectivo— se comunican aquí, junto al CTA, sin anclar
          el precio en ellos. */}
      <div className="flex items-center justify-center gap-1.5 rounded-btn bg-menta px-3 py-1.5 text-center text-xs font-medium text-menta-texto">
        <Tag className="size-3.5 shrink-0" aria-hidden="true" />
        Reservando directo ahorras hasta 15%
      </div>

      {/* Sin fecha, el CTA está DESHABILITADO de verdad (no un botón gris que
          igual navega): el estado vacío es una variante del componente en
          Figma (FancyButton disabled), y se resuelve con los slots del
          sistema, no bajando la opacidad. */}
      {fecha === null ? (
        <FancyButton.Root variant="primary" className="w-full" disabled>
          Elige una fecha
        </FancyButton.Root>
      ) : (
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <Link
            to={`/reservar/${tour.slug}?${new URLSearchParams({
              paquete,
              fecha,
              horario: String(horario),
              personas: String(personas),
            }).toString()}`}
          >
            Continuar — {formatoDinero(total)}
          </Link>
        </FancyButton.Root>
      )}

      <Checks
        lineas={['Confirma con 25% de depósito', 'Cancela gratis hasta 7 días antes', 'Reembolso total por mal clima']}
      />
    </Caja>
  )
}
