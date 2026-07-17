import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Users, Tag } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as CompactButton from '@/components/alignui/compact-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { CalendarioWidget } from '@/components/tour/calendario-widget'
import { useDevFlag } from '@/dev/use-dev-flag'
import { hoyISO, sumarDias } from '@/lib/fechas'
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

// Tope del contador de personas de ESTE booking (no el aforo del barco,
// tour.maxPax — un grupo de 25 no se arma en un solo formulario). Mismo
// límite que ya traía el Select que este stepper reemplaza (2026-07-17,
// pedido de Samuel: "− N +" en vez de un desplegable).
const MAX_PERSONAS = 6

// Ticker infinito en una sola línea (2026-07-17, pedido de Samuel: "que estén
// en una fila, en un ticker infinito, para reducir el alto" — antes eran 3
// líneas apiladas). MISMA mecánica que el marquee de Opiniones (pista
// duplicada 2x, loop con translate: -50%, pausa al hover) pero clases e
// ítems propios — ver .widget-checks-* en componentes.css: aquí no hay
// cards, son 3 frases cortas corriendo en una fila continua.
function Checks({ lineas }: { lineas: string[] }) {
  const [pausado, setPausado] = useState(false)
  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-widget-checks', (v) => {
    if (v === 'pausado') setPausado(true)
  })
  const estatico =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const item = (texto: string, key: string, oculto: boolean) => (
    <span
      key={key}
      aria-hidden={oculto || undefined}
      className="widget-checks-item flex items-center gap-1.5 text-xs text-navy-soft"
    >
      <span aria-hidden="true" className="text-menta-texto">
        ✓
      </span>
      {texto}
    </span>
  )

  return (
    <div
      role="group"
      aria-label="Garantías de la reserva"
      className={`widget-checks-wrapper ${estatico ? 'widget-checks-wrapper--estatico' : ''}`}
    >
      <div className={`widget-checks-pista ${pausado ? 'widget-checks-pista--pausada' : ''}`}>
        {lineas.map((l) => item(l, l, false))}
        {/* 2ª copia para el loop del -50%, oculta a lectores de pantalla
            (mismo trato que el ticker del hero) — no hace falta si es
            estático (reduced-motion). */}
        {!estatico ? lineas.map((l) => item(l, `dup-${l}`, true)) : null}
      </div>
    </div>
  )
}

function Caja({ children }: { children: React.ReactNode }) {
  // Mismo lenguaje «objeto suave» que la TourCard de la home: la decisión de
  // compra vive en una caja propia, no suelta sobre el fondo — pero con SU
  // PROPIO padding (no BLOQUE_FICHA, 2026-07-17, pedido de Samuel: "reduce el
  // padding, veo que tiene mucho"), no el que comparten itinerario/incluye/
  // menú/opiniones/FAQ: ese padding tiene que seguir sirviendo a esos 5
  // bloques de texto largo, así que reducirlo A TODOS para que uno quepa
  // mejor los habría desajustado a ellos. Mismo radio/fondo/borde que
  // BLOQUE_FICHA (bloque-ficha.ts) para seguir leyendo como la misma card.
  return (
    <div
      id="ficha-widget"
      className="flex scroll-mt-sticky-top flex-col gap-4 rounded-card-grande bg-papel p-4 ring-1 ring-linea sm:p-5"
    >
      {children}
    </div>
  )
}

// «Desde US$ 99 por persona», una sola frase leída de corrido (2026-07-17,
// pedido de Samuel: "que sea un texto más humano como el de Viator" — su
// widget dice literalmente "Desde USD 94.00 por persona", no 3 fragmentos
// pegados). Reemplaza al layout anterior (monto grande + "/persona · desde"
// suelto detrás, en ESE orden: sonaba a 3 etiquetas de depuración, no a una
// frase). `desde` antepone "Desde": se usa cuando el precio es un SUELO
// (Light, o el «desde US$ 75» de una cotización), no cuando es la tarifa
// exacta ya elegida (Premium).
function Precio({ precio, desde = false }: { precio: number | null; desde?: boolean }) {
  if (precio === null) {
    return <p className="font-display text-precio font-semibold text-navy">US$ —</p>
  }
  return (
    <p className="text-navy">
      {desde ? <span className="text-sm text-navy-sub">Desde </span> : null}
      <span className="font-display text-precio font-semibold">{formatoDinero(precio)}</span>
      <span className="text-sm text-navy-sub"> por persona</span>
    </p>
  )
}

export function WidgetReserva({ tour, ficha }: Props) {
  const [fecha, setFecha] = useState<string | null>(null)
  const [horario, setHorario] = useState(0)
  const [personas, setPersonas] = useState(2)
  // Fase B: el paquete se elige en el widget. Abre en Light (ancla US$ 99);
  // Premium es opt-in explícito — ver la nota de bait-and-switch de arriba.
  const [paquete, setPaquete] = useState<'light' | 'premium'>('light')

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'fecha' elige mañana (nunca cae en uno de los 2 días agotados de ejemplo
  // del calendario, hoy+3/hoy+10 — ver calendario-widget.tsx); 'premium'
  // además cambia el paquete a Premium (el frame que enseña el precio
  // saltando a la tarifa Premium).
  useDevFlag('dev-widget', (v) => {
    if (v !== 'fecha' && v !== 'premium') return
    setFecha(sumarDias(hoyISO(), 1))
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
          (upgradePremium !== null). TOGGLE SEGMENTADO tipo iOS (2ª vuelta
          2026-07-17, pedido de Samuel): el THUMB activo es BLANCO PURO
          (bg-papel + shadow-sm), no relleno navy — así el control pesa MENOS
          (competía con la fila de horario). La pista va un punto más oscura
          (bg-linea, no bg-papel-hueso) para que el thumb blanco se despegue.
          Texto del segmento activo en navy (sobre el thumb blanco); el
          inactivo, atenuado (opacidad) para que solo "grite" el elegido.
          Cada mitad lleva su tarifa de LISTA inline (99 vs 114 de un
          vistazo); sin el conteo de platos (eso vive en la sección de menú).
          El ancho/desplazamiento del thumb deriva de p-1 (4px) + gap-1 (4px):
          cada segmento mide calc(50% - 6px) y el salto al 2º es su ancho +
          el gap → translateX(100% + 4px). */}
      {tienePaquetes && precioBase !== null && upgrade !== null ? (
        <div>
          <div className="relative grid grid-cols-2 gap-1 rounded-full bg-linea p-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
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
                  className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    activo ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
                  }`}
                >
                  {p.nombre}
                  <span className={`font-normal ${activo ? 'text-navy-soft' : ''}`}>{formatoDinero(p.precio)}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <CalendarioWidget fecha={fecha} onSeleccionar={setFecha} />

      {/* Horario: aparece SOLO tras elegir fecha (2ª vuelta 2026-07-17, pedido
          de Samuel — el flujo tiene que ser obvio: "qué tocar primero y
          luego"). Deroga la decisión anterior de dejarlo siempre visible:
          aunque ficha.horarios NO cambia con el día (lista fija del tour), el
          MODELO MENTAL universal de una reserva es fecha → hora, así que
          mostrar la hora antes de la fecha hacía que compitiera con ella y se
          leyera "roto". Revelado debajo del calendario ya elegido, la
          secuencia se explica sola y de paso baja el alto del estado inicial.
          Peso LIGERO (chip con tinte navy/10 + ring, no relleno navy) para
          que no pese como el toggle de paquete. Entra con un fade+slide corto
          (tw-animate-css, importado por alignui.css) para que el reveal se
          sienta fluido. */}
      {fecha !== null ? (
        <div className="duration-200 animate-in fade-in slide-in-from-top-1">
          <p className="mb-1.5 text-xs font-medium text-navy-sub">Horario</p>
          <div className="flex flex-wrap gap-1.5">
            {ficha.horarios.map((h, i) => {
              const elegido = horario === i
              return (
                <button
                  key={h.hora}
                  type="button"
                  onClick={() => setHorario(i)}
                  aria-pressed={elegido}
                  className={`rounded-btn px-3 py-1.5 text-sm transition-colors ${
                    elegido
                      ? 'bg-navy/10 font-semibold text-navy ring-1 ring-inset ring-navy/20'
                      : 'bg-papel-hueso text-navy-soft hover:text-navy'
                  }`}
                >
                  {h.hora}
                  {h.regreso ? <span className="text-navy-soft"> · regreso {h.regreso}</span> : null}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub" id="widget-label-personas">
          Personas
        </span>
        {/* Stepper "− N +" (2026-07-17, pedido de Samuel: no un desplegable
            para esto) — CompactButton de AlignUI para los 2 botones, mismo
            alto (h-10) y forma (rounded-10, border-stroke-soft-200) que el
            Select de Horario de arriba, para que las 2 filas lean como el
            mismo sistema de campos. */}
        <div
          role="group"
          aria-labelledby="widget-label-personas"
          className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5"
        >
          <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
            <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
            {/* key={personas} remonta el span y dispara la animación .stepper-tick
                en cada cambio (2026-07-17, pedido de Samuel: "como que no se
                nota" al sumar/restar — el pulso da una señal imposible de
                perder al lado del icono). tabular-nums evita que el ancho
                salte al pasar de 9 a 10 personas. */}
            <span key={personas} aria-live="polite" className="stepper-tick tabular-nums">
              {personas === 1 ? '1 persona' : `${personas} personas`}
            </span>
          </span>
          <div className="flex items-center gap-1">
            {/* Feedback de click en los +/− (override via className, sin tocar
                el vendor de AlignUI — patrón de personalización de
                PLAN-ALIGNUI.md). active:scale-90 encoge el botón al apretar;
                active:bg-navy + active:text-papel lo "invierte" al coral del
                CTA por un instante; active:shadow-none lo mete en la
                superficie. Combinados, el gesto se siente. */}
            <CompactButton.Root
              type="button"
              variant="stroke"
              fullRadius
              aria-label="Quitar una persona"
              disabled={personas <= 1}
              onClick={() => setPersonas((p) => Math.max(1, p - 1))}
              className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
            >
              <CompactButton.Icon as={Minus} />
            </CompactButton.Root>
            <CompactButton.Root
              type="button"
              variant="stroke"
              fullRadius
              aria-label="Añadir una persona"
              disabled={personas >= MAX_PERSONAS}
              onClick={() => setPersonas((p) => Math.min(MAX_PERSONAS, p + 1))}
              className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
            >
              <CompactButton.Icon as={Plus} />
            </CompactButton.Root>
          </div>
        </div>
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
