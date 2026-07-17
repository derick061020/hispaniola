import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Users, Baby, Tag, ArrowDown } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as CompactButton from '@/components/alignui/compact-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { ChecksTicker } from '@/components/ui/checks-ticker'
import { CalendarioWidget } from '@/components/tour/calendario-widget'
import { SubVariantePicker } from '@/components/tour/sub-variante-picker'
import { useDevFlag } from '@/dev/use-dev-flag'
import { hoyISO, sumarDias } from '@/lib/fechas'
import { formatoDinero, type Tour } from '@/data/home'
import { WHATSAPP_URL, calcularTotalTour, type FichaTour } from '@/data/tours'

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

type Props = { tour: Tour; ficha: FichaTour; variante?: string | null; onVarianteChange?: (id: string) => void }

// Tope del contador de personas de ESTE booking. v3 (2026-07-17, Saona): con
// subVariantes (Saona: speedboat hasta 25, catamarán hasta 70) el tope
// crece — el stepper se calcula por tour: el `maxPax` de TOURS (data/home.ts)
// para tours con subVariantes, o 6 (tope clásico del Select que el stepper
// reemplaza, conservado para los tours "completo" sin sub-variantes como
// semi-privado y snorkel-lovers). Un grupo de 25+ no se arma en un solo
// formulario de los tours clásicos — para eso existe el charter.
const MAX_PERSONAS_DEFAULT = 6

// Ticker infinito en una sola línea (2026-07-17, pedido de Samuel: "que estén
// en una fila, en un ticker infinito, para reducir el alto" — antes eran 3
// líneas apiladas). Reusado por el widget de evento (PLAN-EVENTOS.md §3)
// desde `components/ui/checks-ticker.tsx` — misma pieza, mismo CSS,
// misma animacion.
function Checks({ lineas }: { lineas: string[] }) {
  return <ChecksTicker lineas={lineas} />
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
// frase).
//
// v3 (2026-07-17, charter): la unidad ya no es siempre "por persona" — el
// tramo activo de cada bote puede ser `tipo: 'grupo'` (precio fijo de
// grupo, ej: Maite 1-8 pax = US$ 625 grupo) o `tipo: 'persona'`
// (US$/pax × pax, ej: Maite 9-19 pax = US$ 99 × N). `unidad` lo dice:
// - 'persona' → «US$ 99 por persona»
// - 'grupo'   → «US$ 825 por grupo» (precio fijo, NO multiplica)
// - 'desde'   → «Desde US$ 75 por persona» (ancla de la home, no hay
//   tramo que aplique todavía — se muestra solo como fallback cuando
//   personas no entra en ningún tramo, o en Light cuando no hay
//   subVariantes).
function Precio({
  precio,
  unidad = 'persona',
}: {
  precio: number | null
  unidad?: 'persona' | 'grupo' | 'desde'
}) {
  if (precio === null) {
    return <p className="font-display text-precio font-semibold text-navy">US$ —</p>
  }
  const sufijo = unidad === 'grupo' ? 'por grupo' : 'por persona'
  return (
    <p className="text-navy">
      {unidad === 'desde' ? <span className="text-sm text-navy-sub">Desde </span> : null}
      <span className="font-display text-precio font-semibold">{formatoDinero(precio)}</span>
      <span className="text-sm text-navy-sub"> {sufijo}</span>
    </p>
  )
}

export function WidgetReserva({ tour, ficha, variante: varianteProp, onVarianteChange }: Props) {
  const [fecha, setFecha] = useState<string | null>(null)
  const [horario, setHorario] = useState(0)
  // v3 (2026-07-17, Snorkel Lovers): tarifa dual Adulto/Niño. Cuando el tour
  // tiene `precioNino` (Snorkel Lovers), el state es por ROL — `adultos` y
  // `ninos` se mantienen sincronizados para que la suma viaje al funnel
  // (`?adultos=N&ninos=M`). Cuando no hay `precioNino`, el state es el
  // clásico `personas: number`. La suma de adultos+ninos nunca excede
  // `maxPax` (que para Snorkel Lovers es 30 según la web).
  const esDual = tour.precioNino !== null && tour.precioNino !== undefined
  const [adultos, setAdultos] = useState(2)
  const [ninos, setNinos] = useState(0)
  const [personas, setPersonas] = useState(2)
  // Fase B: el paquete se elige en el widget. Abre en Light (ancla US$ 99);
  // Premium es opt-in explícito — ver la nota de bait-and-switch de arriba.
  const [paquete, setPaquete] = useState<'light' | 'premium'>('light')
  // v3 (2026-07-17, Saona): cuando el tour tiene subVariantes (Saona:
  // speedboat / fishing / catamarán), el selector de paquetes pasa a ser un
  // selector de BOTE — el toggle Light/Premium se oculta. El id arranca en
  // la 1ª sub-variante (speedboat, la más común). El cálculo del total se
  // delega en `calcularTotalTour()` (data/tours.ts) para que la lógica de
  // tramos viva en datos, no en el componente.
  //
  // v3 (2026-07-17, charter): el state es CONTROLADO cuando el padre pasa
  // `variante`/`onVarianteChange` (lo hace `tour.tsx` para que la
  // `TablaPreciosCharter` de la izquierda pueda pintar el highlight del
  // bote activo). Si las props NO vienen (tours sin subVariantes: el state
  // interno nunca se lee), el componente cae a su propio useState —
  // compatibilidad con semi-privado y snorkel-lovers.
  const varianteInicial = ficha.subVariantes?.[0]?.id ?? null
  const [varianteLocal, setVarianteLocal] = useState<string | null>(varianteInicial)
  const variante = varianteProp !== undefined ? varianteProp : varianteLocal
  const setVariante = (id: string) => {
    if (onVarianteChange) onVarianteChange(id)
    setVarianteLocal(id)
  }
  // Tope del stepper de personas:
  //  - esDual (Snorkel Lovers): el max del tour (30).
  //  - subVariantes (Saona): el tramo más alto (70 en catamarán).
  //  - resto: 6 (tope clásico del Select que el stepper reemplaza).
  const maxPersonas = esDual
    ? tour.maxPax ?? 30
    : ficha.subVariantes
      ? Math.max(...ficha.subVariantes.flatMap((v) => v.tabla.map((t) => t.hasta ?? t.desde)))
      : MAX_PERSONAS_DEFAULT
  // Para Snorkel Lovers (dual), adultos + niños no puede superar maxPax.
  const totalPersonas = esDual ? adultos + ninos : personas

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
  // [dev-mode] v3 (2026-07-17, Saona): el sub-variante picker se cambia a
  // Catamarán para mostrar el frame de la opción con la tabla de tramos
  // distinta (1-30 pax = grupo, 31-70 pax = por persona). Sin el flag, abre
  // en Speedboat (la 1ª, la más común).
  useDevFlag('dev-saona', (v) => {
    if (v !== 'catamaran') return
    setFecha(sumarDias(hoyISO(), 1))
    setVariante('catamaran')
  })
  // [dev-mode] v3 (2026-07-17, Snorkel Lovers): preconfigura el escenario
  // familiar típico para el frame de Figma — 2 adultos + 1 niño + mañana
  // elegida (así el CTA muestra el total con la tarifa dual real:
  // 114×2 + 65×1 = US$ 343). Sin el flag, el state es 2 adultos + 0 niños
  // (pareja sin niños, el caso más simple — no enseña la fila de Niños).
  useDevFlag('dev-snorkel', (v) => {
    if (v !== 'familia') return
    setFecha(sumarDias(hoyISO(), 1))
    setAdultos(2)
    setNinos(1)
  })
  // [dev-mode] v3 (2026-07-17, charter): escenarios preconfigurados para
  // capturar el frame de Figma con cada tipo de tramo visible. Cada valor
  // del flag elige bote + pax + mañana, así la TablaPreciosCharter de la
  // izquierda pinta el highlight del bote activo y el desglose del
  // widget muestra la fórmula correcta (US$/pax × N para tramos por
  // persona, "precio fijo de grupo" para tramos por grupo).
  //  - 'forever-teresa' (default recomendado): el tramo ALTO por persona
  //    (30-120, US$ 75/pax) — 30 pax × 75 = US$ 2.250.
  //  - 'maite-8': el tramo grupo de Maite (1-8 pax, US$ 625 fijo) — el
  //    usuario ve el caso "precio fijo de grupo", no multiplica.
  //  - 'maite-12': el tramo persona de Maite (9-19, US$ 99/pax) — el
  //    usuario ve el caso "US$ 99 × 12 = US$ 1.188".
  //  - 'grandma-5': el único tramo de GrandMa (1-20 pax, US$ 825 fijo).
  useDevFlag('dev-charter', (v) => {
    const fechaManana = sumarDias(hoyISO(), 1)
    if (v === 'forever-teresa') {
      setFecha(fechaManana)
      setVariante('forever-teresa')
      setPersonas(30)
      return
    }
    if (v === 'maite-8') {
      setFecha(fechaManana)
      setVariante('maite')
      setPersonas(8)
      return
    }
    if (v === 'maite-12') {
      setFecha(fechaManana)
      setVariante('maite')
      setPersonas(12)
      return
    }
    if (v === 'grandma-5') {
      setFecha(fechaManana)
      setVariante('grandma')
      setPersonas(5)
      return
    }
  })

  if (tour.booking === 'cotizacion') {
    return (
      <Caja>
        <Precio precio={tour.precioLight} unidad="desde" />
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
        <Precio precio={tour.precioLight} unidad="desde" />
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

  // booking 'completo': el precio se calcula con `calcularTotalTour()`, que
  // entiende los 3 modelos (subVariantes, tarifa dual, light/premium clásico).
  //  - Saona: tramo por pax total según sub-variante.
  //  - Snorkel Lovers (dual, sin Light): adultos × precioLight + niños ×
  //    precioNino. No hay upgrade (la web NO publica Premium para este tour
  //    — la opción Light/Premium se quitó el 2026-07-17 por pedido de
  //    Samuel; `paquete` siempre es 'light' y `ficha.upgradePremium` es
  //    null, así que el cálculo no suma nada).
  //  - Semi-privado (con Light/Premium): precioLight × personas
  //    (+ upgrade si Premium).
  const total = calcularTotalTour(
    ficha,
    variante,
    esDual ? totalPersonas : personas,
    tour.precioLight,
    tour.precioNino,
    paquete,
    esDual ? { adultos, ninos } : undefined,
  )
  // Ancla del widget: el "desde" que se ve en la cabecera. Con
  // subVariantes, es el precio del TRAMO ACTIVO de la variante activa
  // (charter: cambia al cambiar de bote o de pax — antes era el tramo
  // más barato de la 1ª sub-variante y se quedaba fijo aunque el
  // usuario seleccionara Forever Teresa o subiera a 30 pax; era el bug
  // que Samuel reportó el 2026-07-17: "no está saliendo el precio por
  // persona"). Sin subVariantes, el modelo clásico (precioLight o
  // premium según el toggle).
  const precioBase = tour.precioLight
  const upgrade = ficha.upgradePremium
  // v3 (2026-07-17, Snorkel Lovers): el toggle Light/Premium se pinta solo
  // si el tour TIENE Light definido (`menuLight.length > 0`). Snorkel Lovers
  // ya no tiene diferenciador de menú (quitado por Samuel: la web del
  // cliente NO publica Premium para ese tour) — `menuLight: []` por lo
  // que el toggle no se muestra. Semi-privado, en cambio, sigue con sus
  // 2 platos de Light, y el toggle se pinta normal.
  const tienePaquetes =
    precioBase !== null && upgrade !== null && ficha.menuLight.length > 0
  const tieneSubVariantes = ficha.subVariantes !== undefined && ficha.subVariantes.length > 0
  // Tramo ACTIVO de la variante ACTIVA con las pax actuales. Es la fuente
  // de verdad del precio unitario que se muestra en la cabecera del
  // widget, y la que decide si el desglose del CTA dice "US$ 99 × 12
  // personas" o "Precio fijo de grupo". Cuando `personas` no entra en
  // ningún tramo (ej: 2 pax con Maite — sí entra en 1-8 grupo; 4 pax
  // con Forever Teresa — sí entra en 1-18 grupo; pero 4 pax con
  // catamarán de Saona — NO entra, el mínimo es 30), `tramoActivo` es
  // null y caemos al ancla "desde" de la home.
  const paxActuales = esDual ? totalPersonas : personas
  const subActiva = tieneSubVariantes
    ? (variante ? ficha.subVariantes!.find((s) => s.id === variante) : null) ?? ficha.subVariantes![0]
    : null
  const tramoActivo = subActiva
    ? subActiva.tabla.find(
        (tr) => tr.desde <= paxActuales && (tr.hasta === null || tr.hasta >= paxActuales),
      ) ?? null
    : null
  // Lo que se muestra en la cabecera: si hay tramo, su precio unitario
  // (por persona o por grupo, según `tipo`). Si no, el "desde" de la
  // home como fallback. La cabecera SIEMPRE dice la verdad del momento:
  // cambia al mover el stepper o al cambiar de bote.
  const precioAnclaNum = tieneSubVariantes
    ? tramoActivo
      ? tramoActivo.precio
      : precioBase
    : paquete === 'premium' && tienePaquetes
      ? precioBase! + upgrade!
      : precioBase
  const unidadAncla: 'persona' | 'grupo' | 'desde' = tieneSubVariantes
    ? tramoActivo
      ? tramoActivo.tipo === 'persona'
        ? 'persona'
        : 'grupo'
      : 'desde'
    : paquete === 'premium' && tienePaquetes
      ? 'persona'
      : 'desde'

  return (
    <Caja>
      <Precio precio={precioAnclaNum} unidad={unidadAncla} />

      {/* v3 (2026-07-17, charter): el cálculo del total en vivo, justo
          debajo de la cabecera. Es la pieza que faltaba — antes el
          usuario veía "Continuar — US$ 1.188" sin saber de dónde salía
          (¿es por persona? ¿es fijo? ¿con qué tramo?). Ahora el
          desglose se ve ARRIBA, al lado del precio unitario, y cambia
          al sumar/quitar personas o cambiar de bote. Charter es el
          caso más útil (4 botes × 4-7 tramos = 16-28 combinaciones);
          Saona y los otros tours no lo necesitan (su precio es por
          persona simple). */}
      {tieneSubVariantes && tramoActivo ? (
        <p className="-mt-2 text-xs text-navy-soft tabular-nums">
          {tramoActivo.tipo === 'persona' ? (
            <>
              {formatoDinero(tramoActivo.precio)} × {paxActuales} {paxActuales === 1 ? 'persona' : 'personas'}
              {' · '}
              <span className="text-navy-sub">tramo {tramoActivo.desde}–{tramoActivo.hasta === null ? '120' : tramoActivo.hasta} pax</span>
            </>
          ) : (
            <>
              Precio fijo de grupo
              {' · '}
              <span className="text-navy-sub">tramo {tramoActivo.desde}–{tramoActivo.hasta === null ? '120' : tramoActivo.hasta} pax</span>
            </>
          )}
        </p>
      ) : null}

      {/* Selector de paquete o de sub-variante. v3 (2026-07-17, Saona y
          charter): cuando hay subVariantes, oculta el toggle Light/Premium y
          pinta un segmented control con las N sub-variantes (Saona 3:
          speedboat/fishing/catamarán; charter 4: Maite/GrandMa/Santa
          Maria/Forever Teresa). Mismo lenguaje visual que el toggle de
          Fase B (thumb blanco sobre pista gris, mismo translateX animado)
          — pero el thumb y el grid se calculan dinámicamente según el
          número de sub-variantes. */}
      {tieneSubVariantes ? (
        <SubVariantePicker
          subVariantes={ficha.subVariantes!}
          // TS no conecta `tieneSubVariantes === true` con `subVariantes !== undefined`
          // (se tipa por separado, no como Record<...>). Usamos una guarda local
          // explícita para no perder el control-flow analysis.
          activa={variante ?? ficha.subVariantes![0].id}
          onChange={(id) => {
            setVariante(id)
            // Reset horario al cambiar de bote (cada bote tiene sus horarios).
            setHorario(0)
          }}
        />
      ) : tienePaquetes && precioBase !== null && upgrade !== null ? (
        <div>
          <div className="relative grid grid-cols-2 gap-1 rounded-full bg-linea p-1">
            {/* v3 (2026-07-17, fix Samuel): el thumb estaba MAL
                posicionado. El w-[calc(50%-0.375rem)] (50% - 6px) sí
                es correcto (ancho de columna: 100% - 2*4px - 4px =
                100% - 12px, dividido 2 = 50% - 6px), pero el
                translateX(calc(100% + 0.25rem)) lo movía 100% + 4px
                desde left-1 (4px), es decir, terminaba a 100% + 8px —
                fuera del contenedor. Fórmula correcta: 100% = 1
                width del thumb (= 1 columna), + 4px = el gap. */}
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
          Entra con un fade+slide corto (tw-animate-css, importado por
          alignui.css) para que el reveal se sienta fluido.

          Diseño del chip (3ª vuelta 2026-07-17, pedido de Samuel):
          2 columnas lado a lado (grid-cols-2 — antes se apilaban con
          flex-wrap), contenido en 2 líneas con "Salida: HH" arriba,
          una flecha ↓ y "Regreso: HH PM" abajo. El estado seleccionado
          ahora es bg-navy text-white (antes era bg-navy/10 ring-1 — se
          leía como "deshabilitado" por su tinte gris, no como "elegido"). */}
      {fecha !== null ? (() => {
        // v3 (2026-07-17, charter): cada bote tiene SUS horarios (2 o 3).
        // Si la sub-variante activa tiene horarios propios, usamos esos;
        // si no, los globales de la ficha. Esto evita que se muestren
        // horarios de OTRO bote cuando el usuario cambia de Maite a
        // GrandMa.
        const subActiva = ficha.subVariantes?.find((s) => s.id === variante)
        const horariosActivos =
          subActiva?.horarios && subActiva.horarios.length > 0 ? subActiva.horarios : ficha.horarios
        return (
          <div className="duration-200 animate-in fade-in slide-in-from-top-1">
            <p className="mb-1.5 text-xs font-medium text-navy-sub">Horario</p>
            <div className="grid grid-cols-2 gap-2">
              {horariosActivos.map((h, i) => {
                const elegido = horario === i
                return (
                  <button
                    key={h.hora}
                    type="button"
                    onClick={() => setHorario(i)}
                    aria-pressed={elegido}
                    aria-label={`Salida ${h.hora}${h.regreso ? `, regreso ${h.regreso}` : ''}`}
                    className={`flex flex-col items-center gap-0.5 rounded-btn px-2 py-2 text-sm transition-colors ${
                      elegido
                        ? 'bg-navy font-semibold text-white shadow-sm'
                        : 'bg-papel-hueso text-navy-soft hover:bg-papel-hueso/80 hover:text-navy'
                    }`}
                  >
                    <span className="text-xs">
                      Salida: <span className="font-semibold">{h.hora}</span>
                    </span>
                    {h.regreso ? (
                      <>
                        <ArrowDown
                          className={`size-3 ${elegido ? 'text-white/70' : 'text-navy-soft/70'}`}
                          aria-hidden="true"
                        />
                        <span className="text-xs">
                          Regreso: <span className="font-semibold">{h.regreso}</span>
                        </span>
                      </>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })() : null}

      {/* Stepper de personas. 2 modelos:
          - esDual (Snorkel Lovers, v3 2026-07-17): 2 inputs «Adultos» + «Niños»
            con icono Baby en el de niños, 1 fila por rol, suma al total por
            tarifa separada (Adulto 114 / Niño 65 + +15 si Premium).
          - resto: 1 input «Personas» con icono Users, modelo clásico
            (precioLight × personas + upgrade si Premium).
          En el modo dual los 2 steppers comparten el mismo grupo ARIA y el
          mismo `maxPersonas` global (= maxPax del tour = 30 para snorkel-
          lovers): la suma adultos+ninos no puede superarlo — el botón + del
          2º se deshabilita cuando adultos+ninos=maxPersonas. */}
      <div>
        {esDual ? (
          // DUAL: Adultos + Niños
          <>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-xs font-medium text-navy-sub">Pasajeros</span>
              <span className="text-xs text-navy-soft tabular-nums">
                {totalPersonas} / {maxPersonas}
              </span>
            </div>
            <div role="group" aria-labelledby="widget-label-personas" className="flex flex-col gap-2">
              <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
                <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
                  <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                  <span className="text-navy-sub">Adultos</span>
                </span>
                <div className="flex items-center gap-2">
                  <span
                    key={adultos}
                    aria-live="polite"
                    className="stepper-tick min-w-[1.5rem] text-center font-semibold tabular-nums text-navy"
                  >
                    {adultos}
                  </span>
                  <div className="flex items-center gap-1">
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Quitar un adulto"
                      disabled={adultos <= 1}
                      onClick={() => setAdultos((a) => Math.max(1, a - 1))}
                      className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Minus} />
                    </CompactButton.Root>
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Añadir un adulto"
                      disabled={adultos + ninos >= maxPersonas}
                      onClick={() => setAdultos((a) => Math.min(maxPersonas - ninos, a + 1))}
                      className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Plus} />
                    </CompactButton.Root>
                  </div>
                </div>
              </div>
              <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
                <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
                  <Baby className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                  <span className="text-navy-sub">Niños</span>
                </span>
                <div className="flex items-center gap-2">
                  <span
                    key={ninos}
                    aria-live="polite"
                    className="stepper-tick min-w-[1.5rem] text-center font-semibold tabular-nums text-navy"
                  >
                    {ninos}
                  </span>
                  <div className="flex items-center gap-1">
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Quitar un niño"
                      disabled={ninos <= 0}
                      onClick={() => setNinos((n) => Math.max(0, n - 1))}
                      className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Minus} />
                    </CompactButton.Root>
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Añadir un niño"
                      disabled={adultos + ninos >= maxPersonas}
                      onClick={() => setNinos((n) => Math.min(maxPersonas - adultos, n + 1))}
                      className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Plus} />
                    </CompactButton.Root>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // CLÁSICO: 1 input «Personas» (semi-privado, charter, Saona)
          <>
            <span className="mb-1 block text-xs font-medium text-navy-sub" id="widget-label-personas">
              Personas
            </span>
            {/* v3 (2026-07-17, Saona): si la sub-variante activa tiene un mínimo
                superior al state actual, mostramos el aviso justo debajo del
                stepper (no encima) — es info contextual, no título. El state
                `personas` sigue siendo 2 por defecto; el usuario lo sube con el +. */}
            {(() => {
              if (!ficha.subVariantes || !variante) return null
              const v = ficha.subVariantes.find((s) => s.id === variante)
              if (!v) return null
              const min = Math.min(...v.tabla.map((t) => t.desde))
              if (personas >= min) return null
              return (
                <p className="mb-1.5 text-xs text-navy-soft">
                  {v.nombre} requiere mínimo {min} personas.
                </p>
              )
            })()}
            <div
              role="group"
              aria-labelledby="widget-label-personas"
              className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5"
            >
              <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
                <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                <span key={personas} aria-live="polite" className="stepper-tick tabular-nums">
                  {personas === 1 ? '1 persona' : `${personas} personas`}
                </span>
              </span>
              <div className="flex items-center gap-1">
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
                  disabled={personas >= maxPersonas}
                  onClick={() => setPersonas((p) => Math.min(maxPersonas, p + 1))}
                  className="active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Plus} />
                </CompactButton.Root>
              </div>
            </div>
          </>
        )}
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
      ) : total === null ? (
        // v3 (2026-07-17, Saona): con subVariantes, hay un 2º estado disabled
        // — la fecha está pero el nº de personas no llega al mínimo del
        // tramo de la variante activa. Sin este caso el botón se queda
        // habilitado y "Continuar — —" (que no se ve bien) al cambiar
        // variante sin ajustar pax.
        <FancyButton.Root variant="primary" className="w-full" disabled>
          Ajusta las personas
        </FancyButton.Root>
      ) : (
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <Link
            to={`/reservar/${tour.slug}?${new URLSearchParams({
              // Saona (subVariantes) manda `variante` en vez de `paquete` (no
              // hay Light/Premium — el menú buffet es igual en las 3
              // sub-variantes; lo que cambia es el BOTE). El funnel aún no
              // conoce `variante` — cuando se desbloquee la frontera con el
              // motor, leerá este param y hará la rama de sub-variante.
              ...(tieneSubVariantes ? { variante: variante ?? '' } : { paquete }),
              fecha,
              horario: String(horario),
              // Snorkel Lovers (tarifa dual, v3 2026-07-17): manda adultos y
              // niños por separado, Y la suma como `personas` (compatibilidad
              // con el funnel cuando se construya, que hoy lee `personas`).
              ...(esDual
                ? { adultos: String(adultos), ninos: String(ninos), personas: String(totalPersonas) }
                : { personas: String(personas) }),
            }).toString()}`}
          >
            Continuar — {formatoDinero(total)}
          </Link>
        </FancyButton.Root>
      )}

      {/* v3 (2026-07-17, charter): el desglose del total se pinta ARRIBA,
          en la cabecera, justo debajo del precio unitario (no aquí, donde
          duplicaba la info). Es la pieza que faltaba — el usuario ve
          «US$ 99 × 12 personas · tramo 9-19 pax» cambiar en vivo al
          sumar/quitar personas o cambiar de bote. */}

      <Checks
        lineas={['Confirma con 25% de depósito', 'Cancela gratis hasta 7 días antes', 'Reembolso total por mal clima']}
      />
    </Caja>
  )
}
