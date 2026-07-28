import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Users, Baby, PersonStanding, Tag, ArrowDown, BadgeCheck, Heart, Share2, Check } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as CompactButton from '@/components/alignui/compact-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { ChecksTicker } from '@/components/ui/checks-ticker'
import { CalendarioWidget } from '@/components/tour/calendario-widget'
import { ChipsUrgencia } from '@/components/tour/chips-urgencia'
import { SubVariantePicker } from '@/components/tour/sub-variante-picker'
import { useDevFlag } from '@/dev/use-dev-flag'
import { hoyISO, sumarDias } from '@/lib/fechas'
import { formatoDinero, QUOTES, type Tour } from '@/data/home'
import { WHATSAPP_URL, calcularTotalTour, type FichaTour } from '@/data/tours'
import { ALBUM_UPSELL, totalAddOns, saltoDeTramo } from '@/lib/tarifas'
import { AddOnsWidget } from '@/components/tour/add-ons-widget'
import { PistaInfo } from '@/components/ui/pista-info'

// «El widget ES la página» (wireframe A2): sticky en desktop, con el precio en
// el primer viewport — en la web actual ese precio está a 6 pantallas de
// scroll. Es la superficie de decisión de todo el sitio.
//
// ⚠️⚠️ EL WIDGET ABRE EN PREMIUM (US$ 114), NO EN LIGHT. Esto INVIERTE la
// decisión anterior y NO es un descuido — no lo «corrijas» sin leer esto.
//
// Historia, para que la próxima vuelta no deshaga trabajo:
//  - Hasta 2026-07-27 abría en Light (US$ 99) a propósito. La card del grid, el
//    ticker del hero, el megamenú y el <meta> de SEO prometen «desde US$ 99», y
//    arrancar en Premium significa que quien entró por el 99 ve 114 sin haberlo
//    pedido. Eso es bait-and-switch, y era una de las 7 correcciones P1 de
//    analisis/revision-wireframes.md §1.1.
//  - El cliente lo pidió igual y explícitamente (slide 4 del PDF de
//    correcciones v2: «poner aquí por defecto el premium»), y en la reunión del
//    07-24 (17:40) dejó claro el porqué: «jugando con ese sesgo de que por 15
//    dólares más tiene premium».
//  - Samuel decidió el 2026-07-27 aplicarlo LITERAL, sabiendo la consecuencia, y
//    que el ancla de US$ 99 NO se toca en el resto del sitio.
//
// O sea: el patrón está reabierto A PROPÓSITO. Si hay que cerrarlo, es cambiar
// el useState de `paquete` a 'light' — pero es decisión de negocio, no limpieza.
//
// MECÁNICA DE DOS ESTADOS que pidió el cliente (reunión 07-24, 15:36-17:44):
//   - Con LIGHT elegido   → Premium se muestra como «+US$ 15» (el salto, no el
//     total). Ese framing ya existía en el bloque de menú de la columna
//     izquierda; aquí se replica en el selector, que es lo que pedía Samuel
//     (15:46: «yo lo hice así en el lado izquierdo… sería ponerlo igual en el
//     selector derecho»).
//   - Con PREMIUM elegido → su precio real, US$ 114.
//
// El «precio anterior US$ 129» del slide 5 NO se pinta: no está verificado que
// 129 fuera nunca tarifa de lista real, y un tachado que no existió es
// publicidad engañosa. Pendiente de que Fernando lo confirme por escrito
// (TARIFARIO-WEB-ORIGINAL.md §4-B).
//
// El «ahorra hasta 15%» junto al CTA son los descuentos reales (recurrente +
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

type Props = {
  tour: Tour
  ficha: FichaTour
  variante?: string | null
  onVarianteChange?: (id: string) => void
  /** [v2 2026-07-27] El paquete elegido se SUBE a la página para que la banda
   *  «estás en la versión Premium» (slide 6), que vive en la columna
   *  izquierda, pueda reaccionar. Mismo movimiento que ya se hizo con
   *  `variante` (el bote del charter) el 2026-07-17 y por la misma razón —
   *  hay precedente, es el patrón de la casa. */
  onPaqueteChange?: (p: 'light' | 'premium') => void
}

// Tope del contador de personas de ESTE booking. v3 (2026-07-17, Saona): con
// subVariantes (Saona: speedboat hasta 25, catamarán hasta 70) el tope
// crece — el stepper se calcula por tour: el `maxPax` de TOURS (data/home.ts)
// para tours con subVariantes, o 6 (tope clásico del Select que el stepper
// reemplaza, conservado para los tours "completo" sin sub-variantes como
// semi-privado y snorkel-lovers). Un grupo de 25+ no se arma en un solo
// formulario de los tours clásicos — para eso existe el charter.
const MAX_PERSONAS_DEFAULT = 6

// Garantías del pie del widget — TICKER (components/ui/checks-ticker.tsx).
//
// Historia completa, porque esta línea ha ido y venido tres veces y conviene
// que la próxima persona no la mueva sin saberlo:
//  1. Empezaron como 3 líneas apiladas.
//  2. 2026-07-17, Samuel: «que estén en una fila, en un ticker infinito, para
//     reducir el alto». → ticker.
//  3. 2026-07-20, correcciones v1: Fernando señaló el ticker con una flecha —
//     «Eso se ve raro» — y se volvió a 3 checks quietos en grid. El argumento
//     era razonable: un marquee dentro de la caja donde se decide pagar mueve
//     la letra pequeña justo cuando se intenta leer.
//  4. 2026-07-22, Samuel: «recuerda que lo que está abajo del widget, los 3
//     checks de reserva ahora, cancela gratis y reembolso, debe ser un ticker
//     infinito de una línea». → ticker otra vez, y esta vez es la buena.
//
// Quien decide es Samuel, y su argumento de 2026-07-17 no ha caducado: el
// widget de esta 2ª vuelta ha CRECIDO (chips de urgencia arriba, reseña
// verificada, deseos/compartir abajo), así que las tres líneas apiladas
// cuestan ahora más alto del que costaban cuando el cliente las pidió — y
// el alto del widget es lo que decide si el CTA cabe en el primer viewport.
// Además el ticker ya es el lenguaje del widget de evento (misma pieza,
// mismo componente en Figma), así que volver a él también deshace una
// divergencia entre dos widgets que deberían ser hermanos.

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
      // [v2 2026-07-27, 2ª vuelta] EL SCROLL VIVE AQUÍ, no en el envoltorio
      // sticky de la página. Cuando estaba fuera pasaban dos cosas malas:
      //  · el `ring` de esta caja se dibuja FUERA de su borde, y el envoltorio
      //    con overflow lo recortaba a los lados — el borde se veía a trozos.
      //  · el ring rodeaba los ~670px REALES del contenido, así que al
      //    scrollear los bordes de arriba y abajo se iban de la vista y la
      //    caja parecía abierta por los extremos.
      // Con el scroll en la propia caja, su marco es el que se queda quieto y
      // el contenido corre por dentro.
      //
      // Y el marco pasa de `ring` a SOMBRA INTERNA (idea de Samuel): una
      // sombra `inset` se pinta dentro del borde, así que no depende de que
      // nadie la recorte y no puede volver a perderse.
      //
      // `svh` y no `vh`/`dvh`: aprendizaje del proyecto — `vh` en móvil mide el
      // viewport grande (barra de URL oculta) y `dvh` cambia al hacer scroll.
      // `[&>*]:shrink-0` NO es cosmético — sin él el widget se rompe. Esta caja
      // es `flex flex-col` y desde que tiene `max-h`, flexbox COMPRIME a los
      // hijos (todos con flex-shrink: 1 por defecto) para intentar que quepan,
      // ANTES de rendirse y dejar que aparezca el scroll. Con ~912px de
      // contenido en 531 disponibles, el CTA «Continuar» se aplastaba de 40px
      // a 20 y perdía su padding — detectado por Samuel al elegir fecha.
      // Con los hijos sin encoger, el contenido conserva su alto y el
      // desbordamiento se resuelve donde toca: en el scroll.
      className="flex scroll-mt-sticky-top flex-col gap-4 rounded-card-grande bg-papel p-4 widget-marco [&>*]:shrink-0 sm:p-5 lg:max-h-[calc(100svh-var(--spacing-sticky-top)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain scroll-sutil"
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

// Clave de la lista de deseos en localStorage. Mismo criterio que
// lib/reservas.ts: el prototipo persiste en el navegador para sentirse real
// sin backend.
const CLAVE_DESEOS = 'hispaniola:deseos'

function leerDeseos(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const bruto = window.localStorage.getItem(CLAVE_DESEOS)
    const lista: unknown = bruto ? JSON.parse(bruto) : []
    return Array.isArray(lista) ? lista.filter((x): x is string => typeof x === 'string') : []
  } catch {
    // localStorage puede fallar (modo privado de Safari, cuota llena). La
    // lista de deseos es un extra: si no se puede leer, se sigue sin ella.
    return []
  }
}

export function WidgetReserva({
  tour,
  ficha,
  variante: varianteProp,
  onVarianteChange,
  onPaqueteChange,
}: Props) {
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
  // [v2 2026-07-27] Tercer tramo de edad: bebés 1-3, gratis. Viaja al funnel
  // para que la tripulación sepa cuántos van a bordo, aunque no paguen.
  const [bebes, setBebes] = useState(0)
  const [personas, setPersonas] = useState(2)
  // [v2 2026-07-27] ABRE EN PREMIUM. Cambio pedido explícitamente por el
  // cliente (slide 4 del PDF v2: «poner aquí por defecto el premium») y
  // ratificado por Samuel el 07-27 sabiendo la consecuencia. Ver la nota
  // larga del encabezado del archivo.
  const [paquete, setPaquete] = useState<'light' | 'premium'>('premium')

  // Lista de deseos + compartir (correcciones v1, planes/02-producto.md
  // slide 4). Estado inicial perezoso: leer localStorage en el render de
  // arranque, no en un efecto, evita el parpadeo de «no guardado → guardado».
  const [enDeseos, setEnDeseos] = useState(() => leerDeseos().includes(tour.slug))
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const lista = leerDeseos()
    const siguiente = enDeseos
      ? Array.from(new Set([...lista, tour.slug]))
      : lista.filter((s) => s !== tour.slug)
    try {
      window.localStorage.setItem(CLAVE_DESEOS, JSON.stringify(siguiente))
    } catch {
      // Ver leerDeseos(): si el navegador no deja escribir, el botón sigue
      // funcionando en la sesión aunque no persista.
    }
  }, [enDeseos, tour.slug])

  const compartir = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    // Web Share API donde exista (móvil): abre la hoja nativa del sistema.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: tour.nombre, url })
        return
      } catch {
        // El usuario canceló la hoja de compartir: no es un error que haya
        // que reportar, y tampoco hay que caer al portapapeles (ya decidió).
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso de portapapeles no hay nada que hacer desde aquí; el
      // usuario siempre puede copiar la URL de la barra de direcciones.
    }
  }

  // Reseña que se incrusta en el widget. Se elige por el slug y no al azar
  // para que no cambie en cada render (y para que cada tour muestre siempre
  // la misma, que es lo que esperaría alguien que vuelve a la página).
  const resenaWidget = QUOTES[tour.slug.length % QUOTES.length]
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
  // [dev-mode] [v2 2026-07-27] ?dev-paquete=light fuerza el paquete a Light.
  // Hace falta un flag PROPIO porque desde el 07-27 el widget abre en Premium:
  // el estado Light —con el «+US$ 15» en el selector y la caja de upsell— ya
  // no se alcanza sin interactuar, así que sin esto no habría forma de
  // congelarlo para Figma. Avisa a la página con onPaqueteChange para que la
  // banda «estás en Premium» de la columna izquierda se apague también.
  useDevFlag('dev-paquete', (v) => {
    if (v !== 'light' && v !== 'premium') return
    setPaquete(v)
    onPaqueteChange?.(v)
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
  const totalTour = calcularTotalTour(
    ficha,
    variante,
    esDual ? totalPersonas : personas,
    tour.precioLight,
    tour.precioNino,
    paquete,
    esDual ? { adultos, ninos } : undefined,
  )

  // [v2 2026-07-27] Add-ons: se suman DESPUÉS del precio del tour y se
  // muestran como línea aparte en el desglose, nunca fundidos en el precio
  // base — así el visitante siempre ve qué parte del total es el tour y qué
  // parte eligió añadir.
  const addOns = ficha.addOns ?? []
  const [addOnsElegidos, setAddOnsElegidos] = useState<string[]>(() =>
    addOns.filter((a) => a.porDefecto && ALBUM_UPSELL.porDefecto).map((a) => a.id),
  )
  const paxParaAddOns = esDual ? totalPersonas : personas
  const importeAddOns = totalAddOns(addOns, addOnsElegidos, paxParaAddOns)
  const total = totalTour === null ? null : totalTour + importeAddOns
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
  // [v2] ¿La siguiente persona cruza de tramo? Se calcula aquí y se pinta
  // junto al stepper, ANTES de que el precio salte — ver el aviso más abajo.
  const salto = subActiva ? saltoDeTramo(subActiva.tabla, paxActuales) : null
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
      {/* Chips de aceleración, lo primero del widget (Samuel, 2026-07-22).
          Van ARRIBA DEL TODO, antes incluso del rating: son el motivo por el
          que alguien deja de leer y mira el precio.

          ⚠️ SON MAQUETA, NO DATO — y eso tiene su propia nota larga en
          components/tour/chips-urgencia.tsx, incluido qué hay que enchufar
          cuando el motor de reservas exista. Esto DEROGA en parte el aviso
          que sigue aquí abajo: de los 4 elementos de urgencia que pedía la
          maqueta del cliente, ahora se pintan 2 (los que Samuel pidió
          explícitamente) y siguen fuera los otros 2 —el «−18% · Antes
          US$ 120» y el «pocas fechas disponibles»—, que son los que tocan
          el PRECIO y la DISPONIBILIDAD. Esa frontera no es arbitraria: un
          badge de popularidad exagerado es marketing; un precio tachado
          falso o una escasez falsa es lo que la ley llama publicidad
          engañosa, y además es justo el bait-and-switch contra el que este
          archivo lleva avisando desde el primer día. */}
      <ChipsUrgencia />

      {/* Prueba social en la cabecera del widget (correcciones v1 del cliente,
          planes/02-producto.md slide 4: «agregar los elementos de aceleración
          de venta»). El rating y el número de reseñas SÍ son reales y son los
          mismos de todo el sitio. */}
      <div className="-mt-1 flex items-center gap-1.5 text-xs text-navy-sub">
        <span className="text-estrella" aria-hidden="true">
          ★
        </span>
        <span className="font-semibold text-navy">{tour.rating}</span>
        <span>· {tour.resenas.toLocaleString('es-ES')} reseñas verificadas</span>
      </div>

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
          {/* [v2 2026-07-27] EL SELECTOR CAMBIA DE PIEL EN PREMIUM (slide 4:
              «el Premium que tenga colores como negros, de lujo»).
              ⚠️ Y SOLO EL SELECTOR. Samuel preguntó al cliente en la reunión
              del 07-24 si lo oscuro era «solamente el selector o toda la
              página» y la respuesta acotó el alcance a la columna derecha:
              «de toda la página, lo de la derecha… [toda] es demasiado»
              (25:06). Una ficha entera en negro pelearía con el hero de fotos
              reales — por eso el modo premium vive aquí, en el comparador y en
              el bloque de menú, y en ningún sitio más. */}
          <div
            className={`relative grid grid-cols-2 gap-1 rounded-full p-1 transition-colors duration-200 motion-reduce:transition-none ${
              paquete === 'premium' ? 'bg-premium-fondo' : 'bg-linea'
            }`}
          >
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
              className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${
                paquete === 'premium' ? 'bg-premium-oro' : 'bg-papel'
              }`}
              style={{ transform: paquete === 'premium' ? 'translateX(calc(100% + 0.25rem))' : 'translateX(0)' }}
            />
            {/* [v2 2026-07-27] MECÁNICA DE DOS ESTADOS (reunión 07-24,
                15:36-17:44). Premium no muestra siempre lo mismo:
                  · con Light elegido  → «+US$ 15», el SALTO. Un incremento
                    pequeño convence mucho mejor que un total grande, y es el
                    framing que el propio bloque de menú ya usaba en la columna
                    izquierda. Samuel pidió literalmente replicarlo aquí.
                  · con Premium elegido → su precio real, US$ 114.
                Light siempre muestra su precio real: es el ancla del sitio y
                no se toca. */}
            {[
              { id: 'light' as const, nombre: 'Light', precio: precioBase },
              { id: 'premium' as const, nombre: 'Premium', precio: precioBase + upgrade },
            ].map((p) => {
              const activo = paquete === p.id
              const muestraSalto = p.id === 'premium' && paquete === 'light' && upgrade > 0
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPaquete(p.id)
                    onPaqueteChange?.(p.id)
                  }}
                  aria-pressed={activo}
                  // En piel premium, el botón activo va sobre el thumb dorado
                  // (texto casi negro) y el inactivo sobre el fondo oscuro
                  // (texto apagado cálido). Sin esto, el navy del tema claro
                  // quedaba ilegible sobre el oro.
                  className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    paquete === 'premium'
                      ? activo
                        ? 'text-premium-fondo'
                        : 'text-premium-texto-suave hover:text-premium-texto'
                      : activo
                        ? 'text-navy'
                        : 'text-navy-sub/55 hover:text-navy-sub'
                  }`}
                >
                  {p.nombre}
                  <span
                    className={`font-normal ${
                      paquete === 'premium' ? '' : activo ? 'text-navy-soft' : ''
                    }`}
                  >
                    {muestraSalto ? `+${formatoDinero(upgrade)}` : formatoDinero(p.precio)}
                  </span>
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
                  {/* size-11 (44px) en className, NO en el prop `size` del vendor
                      (auditoría móvil 2026-07-17): el tamaño "large" propio del
                      componente es size-6 (24px) — por debajo del mínimo táctil
                      recomendado (~44px), y este stepper se toca varias veces
                      seguidas para subir el conteo. tv() mergea `className` con
                      tailwind-merge, así que sobrescribe el size-6 del vendor sin
                      tocar compact-button.tsx (regla del proyecto: los vendor no
                      se editan a mano). Mismo cambio en los otros 5 steppers de
                      este widget + los 2 de widget-evento.tsx. */}
                  <div className="flex items-center gap-1">
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Quitar un adulto"
                      disabled={adultos <= 1}
                      onClick={() => setAdultos((a) => Math.max(1, a - 1))}
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
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
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Plus} />
                    </CompactButton.Root>
                  </div>
                </div>
              </div>
              <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
                {/* [v2 2026-07-27] El icono de «Niños» YA NO es el bebé
                    (pedido de Samuel): con bebés y niños como tramos
                    separados, el mismo icono en los dos no distinguía nada.
                    PersonStanding para el niño que ya camina, Baby para el
                    tramo de 1-3. */}
                <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
                  <PersonStanding className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                  <span className="text-navy-sub">Niños</span>
                  <PistaInfo
                    etiqueta="Qué edad cuenta como niño"
                    texto="Niños de 4 a 7 años, con tarifa reducida. De 1 a 3 años no pagan: añádelos abajo, en Bebés."
                  />
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
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
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
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Plus} />
                    </CompactButton.Root>
                  </div>
                </div>
              </div>

              {/* [v2 2026-07-27, plan 01 §6] TERCER TRAMO: bebés de 1 a 3 años.
                  El cliente lo aclaró en la reunión del 07-24 (01:58): «los
                  niños de uno a tres años no pagan».

                  ⚠️ Dos decisiones que conviene no deshacer sin preguntar:
                  1. NO SUMAN al aforo. Es literal de Samuel el 07-27 («los
                     bebés no suman»), así que no se restan de `maxPersonas`.
                     Operativamente eso significa que un barco de 30 plazas
                     puede acabar con 30 + bebés a bordo — si el cliente
                     quiere que ocupen plaza, es cambiar el `disabled` y las
                     dos restas de arriba, no rehacer nada.
                  2. Solo se pinta en los tours con selector de edad, que
                     según la decisión del 07-27 es SOLO Snorkel Lovers. El
                     semi-privado no admite niños; charter, Saona y eventos
                     van por tramos y ahí «una plaza es una plaza, sin edad».

                  ⚠️ El tope de 3 años está sin confirmar por escrito: en la
                  reunión Miguel no recordaba el rango y aceptó por cortesía el
                  «¿será 7?» que propuso Samuel para el tramo siguiente. */}
              <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
                <span className="flex items-center gap-2 text-paragraph-sm text-text-strong-950">
                  <Baby className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                  <span className="text-navy-sub">
                    Bebés <span className="text-navy-soft">gratis</span>
                  </span>
                  <PistaInfo
                    etiqueta="Qué edad cuenta como bebé"
                    texto="Bebés de 1 a 3 años, sin coste. A partir de los 4 años pagan tarifa de niño."
                  />
                </span>
                <div className="flex items-center gap-2">
                  <span
                    key={bebes}
                    aria-live="polite"
                    className="stepper-tick min-w-[1.5rem] text-center font-semibold tabular-nums text-navy"
                  >
                    {bebes}
                  </span>
                  <div className="flex items-center gap-1">
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Quitar un bebé"
                      disabled={bebes <= 0}
                      onClick={() => setBebes((b) => Math.max(0, b - 1))}
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                    >
                      <CompactButton.Icon as={Minus} />
                    </CompactButton.Root>
                    <CompactButton.Root
                      type="button"
                      variant="stroke"
                      fullRadius
                      aria-label="Añadir un bebé"
                      onClick={() => setBebes((b) => b + 1)}
                      className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
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
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
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
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Plus} />
                </CompactButton.Root>
              </div>
            </div>
          </>
        )}
      </div>

      {/* [v2 2026-07-27] CAJA DE UPSELL A PREMIUM (slide 5: «agregar algo así
          como un upsell para que el usuario escoja la versión premium»).
          Miguel insistió en la reunión (17:45): «siempre está el bloque que te
          viene con premium sumas cuatro cosas por 15 dólares, que tiene que
          estar destacado».
          Se pinta SOLO con Light elegido y desaparece al pasar a Premium,
          donde la sustituye la banda de la columna izquierda — uno aparece
          cuando el otro se va, nunca los dos. Las 4 ventajas salen del MISMO
          array que consume el comparador, para que no puedan desincronizarse. */}
      {tienePaquetes && paquete === 'light' && ficha.ventajasPremium?.length ? (
        <div className="rounded-card bg-premium-fondo p-4">
          <p className="text-sm font-semibold text-premium-oro">
            Con Premium sumas 4 cosas por {formatoDinero(upgrade ?? 0)}
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {ficha.ventajasPremium.map((v) => (
              <li key={v} className="flex items-start gap-2 text-xs text-premium-texto">
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-premium-oro"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {v}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setPaquete('premium')
              onPaqueteChange?.('premium')
            }}
            className="mt-3 w-full rounded-full bg-premium-oro px-4 py-2 text-xs font-bold text-premium-fondo transition hover:brightness-110"
          >
            Cambiar a Premium
          </button>
        </div>
      ) : null}

      {/* [v2 2026-07-27] Aviso de SALTO DE TRAMO. Los tarifarios reales del
          charter y de Saona funcionan por sustitución: al cruzar un tramo, la
          reserva deja de pagar «el barco» y pasa a pagar por cabeza, así que
          UNA persona más puede subir el total cientos de dólares (Forever
          Teresa 4h: de 18 a 19 personas, +US$ 490; Saona catamarán: de 30 a
          31, +US$ 1.305). Sin explicación se lee como un fallo del widget y se
          abandona la reserva. El motivo real lo dio el cliente en la reunión
          del 07-24 (07:06): a partir de cierto número hay que llevar más
          tripulación por normativa. */}
      {salto !== null ? (
        <p className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          Con <strong className="text-navy">{paxActuales + 1} personas</strong> cambia la tarifa de
          este barco: pasa a {formatoDinero(salto.hasta)}. Las normativas de navegación exigen más
          tripulación a partir de ese grupo.
        </p>
      ) : null}

      {/* [v2 2026-07-27] Upsells. Aparecen SOLO con la reserva ya configurada
          (fecha elegida): mientras el visitante todavía está formando el
          precio —subiendo el contador, comparando barcos— un extra compite con
          la decisión principal y engorda un total que aún se está evaluando.
          Al final, cuando ya decidió ir, US$ 20 sobre una reserva de varios
          cientos es un sí fácil. Es la posición de «order bump» y es lo que
          Samuel pidió: «llamativo en su momento, pero no invasivo». */}
      {addOns.length > 0 && fecha !== null ? (
        <AddOnsWidget
          addOns={addOns}
          personas={paxParaAddOns}
          elegidos={addOnsElegidos}
          onCambiar={setAddOnsElegidos}
          mensajeAlDesmarcar={ALBUM_UPSELL.mensajeAlDesmarcar}
        />
      ) : null}

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
                ? {
                    adultos: String(adultos),
                    ninos: String(ninos),
                    // [v2] Los bebés viajan al funnel aunque no paguen: la
                    // tripulación necesita saber cuántos van a bordo
                    // (chalecos, sillas). Solo se añade si hay alguno, para no
                    // ensuciar la URL del caso normal.
                    ...(bebes > 0 ? { bebes: String(bebes) } : {}),
                    personas: String(totalPersonas),
                  }
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

      {/* border-t + pt-3 en un envoltorio, no en el propio ticker: el ticker
          es `overflow: hidden` y un borde suyo se recortaría contra su
          propia pista. La hairline separa el bloque de garantías del CTA,
          igual que lo hacía la lista quieta a la que sustituye. */}
      <div className="border-t border-linea pt-3">
        <ChecksTicker
          lineas={[
            'Reserva ahora y paga después: confirmas con solo el 25%',
            'Cancela gratis hasta 7 días antes',
            'Reembolso total por mal clima',
          ]}
        />
      </div>

      {/* Reseña verificada dentro del widget (correcciones v1, slide 4). La
          maqueta la pone justo aquí y acierta: es el último argumento antes
          de decidir. Es una reseña REAL del pool del sitio (QUOTES), no un
          texto escrito para vender — por eso lleva su plataforma y su firma. */}
      <figure className="rounded-card bg-papel-hueso p-3">
        <figcaption className="flex items-center gap-1.5 text-xs font-medium text-menta-texto">
          <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
          Reseña verificada en {resenaWidget.plataforma}
        </figcaption>
        <blockquote className="mt-1.5 text-xs italic text-navy-sub">
          «{resenaWidget.texto}»
        </blockquote>
        <p className="mt-1.5 text-xs font-semibold text-navy">— {resenaWidget.autor}</p>
      </figure>

      {/* Lista de deseos + compartir (correcciones v1, slide 4). Guardar vive
          en localStorage, como el resto del prototipo (lib/reservas.ts hace
          lo mismo con la reserva). Compartir usa la Web Share API nativa
          cuando existe (móvil) y cae a copiar el enlace en escritorio. */}
      <div className="flex items-center justify-between gap-2 border-t border-linea pt-3">
        <button
          type="button"
          onClick={() => setEnDeseos((v) => !v)}
          aria-pressed={enDeseos}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-sub transition-colors hover:text-navy"
        >
          <Heart
            className={`size-4 ${enDeseos ? 'fill-coral text-coral' : ''}`}
            aria-hidden="true"
          />
          {enDeseos ? 'En tu lista' : 'Agregar a la lista de deseos'}
        </button>
        <button
          type="button"
          onClick={compartir}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-sub transition-colors hover:text-navy"
        >
          <Share2 className="size-4" aria-hidden="true" />
          {copiado ? '¡Enlace copiado!' : 'Compartir'}
        </button>
      </div>
    </Caja>
  )
}
