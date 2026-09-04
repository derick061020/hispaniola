import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Users, Tag, ArrowDown, BadgeCheck, Heart, Share2, Check } from 'lucide-react'
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
import {
  DESCUENTO_MAXIMO,
  addOnsDisponibles,
  totalAddOns,
  saltoDeTramo,
} from '@/lib/tarifas'
import { AddOnsWidget } from '@/components/tour/add-ons-widget'
import { useCotizacion } from '@/components/tour/use-cotizacion'
import { BannerGrupo } from '@/components/tour/banner-grupo'
import { NumeroEditable } from '@/components/ui/numero-editable'
import { PasajerosPopover, FilasPasajeros } from '@/components/tour/pasajeros-popover'
import { numero, t, tp } from '@/lib/i18n'

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
//    docs/proceso/analisis/revision-wireframes.md §1.1.
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
  /** [v2 2026-07-28] El nº de personas SUBE a la página, por el mismo motivo
   *  que `variante` y `paquete`: la tabla de precios de la columna izquierda
   *  llevaba desde el 07-17 prometiendo por escrito que «muestra el tramo que
   *  aplica según las personas que elijas en el widget» — y no lo hacía. Era
   *  una promesa falsa en pantalla, no solo una función que faltaba. */
  onPersonasChange?: (n: number) => void
  /** [2026-08-07] Los add-ons marcados. CUARTO estado que sube a la página, y
   *  el primero que es de DOBLE sentido: el panel de aquí los marca, pero la
   *  franja de la langosta del bloque de menú —columna izquierda— también, y
   *  las dos piezas tienen que mostrar la misma reserva. Por eso es una prop
   *  controlada (como `variante`) y no un `onChange` a secas. */
  addOnsElegidos: string[]
  onAddOnsChange: (ids: string[]) => void
}

// Tope del contador de personas de ESTE booking. v3 (2026-07-17, Saona): con
// subVariantes (Saona: speedboat hasta 25, catamarán hasta 70) el tope
// crece — el stepper se calcula por tour: el `maxPax` de TOURS (data/home.ts)
// para tours con subVariantes, o 6 (tope clásico del Select que el stepper
// reemplaza, conservado para los tours "completo" sin sub-variantes como
// semi-privado y snorkel-lovers). Un grupo de 25+ no se arma en un solo
// formulario de los tours clásicos — para eso existe el charter.
// Exportado desde 2026-08-07: el stepper del FUNNEL (resumen-reserva.tsx) tiene
// que topar en el mismo número que el del widget, o el visitante podría subir
// en el checkout a un grupo que la ficha no le deja configurar.
export const MAX_PERSONAS_DEFAULT = 6

// La fórmula del tope, en una función porque la usan el widget y el funnel y
// tenían dos copias distintas: el widget subía a 85 en el charter (el tramo más
// alto de sus botes) y el funnel topaba en 6, así que un charter configurado
// para 30 personas llegaba al checkout convertido en uno de 6 —silenciosamente,
// y con el menú equivocado, porque de 21 en adelante la carta pasa a buffet de
// pinchos (lib/menu-reserva.ts). Detectado el 2026-08-07 al revisar por qué el
// paso del menú salía vacío en Saona y en el charter.
export function maxPersonasDe(tour: Tour, ficha: FichaTour): number {
  // Tarifa dual (Snorkel Lovers): el aforo del tour.
  if (tour.precioNino != null) return tour.maxPax ?? 30
  // Sub-variantes (Saona, charter): el tramo más alto de cualquier bote.
  if (ficha.subVariantes) {
    const topes = ficha.subVariantes.flatMap((v) =>
      v.tabla.map((tramo) => tramo.hasta ?? tramo.desde),
    )
    // [2026-08-25] `Math.max()` sin argumentos devuelve **-Infinity**, y de ahí
    // salía el «infinito» en pantalla: el aforo se volvía -Infinity, el
    // stepper de personas lo pintaba tal cual y el total se iba a NaN.
    //
    // Pasa cuando hay sub-variantes SIN tabla de precios, que es justo el caso
    // que estrenaron los paquetes de eventos: su precio lo pone Odoo, así que
    // aquí no hay tramos que recorrer. El aforo entonces es el del producto.
    return topes.length ? Math.max(...topes) : tour.maxPax ?? MAX_PERSONAS_DEFAULT
  }
  // Sin sub-variantes se mantiene el tope de siempre: tocar esto subiría de 6
  // a su aforo el stepper de semi-privado, que es otra decisión y no la de hoy.
  return MAX_PERSONAS_DEFAULT
}

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

function Caja({
  children,
  premium = false,
  pieFijo = false,
}: {
  children: React.ReactNode
  /** [v2 2026-07-28] Tema oscuro/oro del widget. Va como PROP y no leyendo el
   *  estado: `Caja` es un envoltorio de presentación sin acceso al estado del
   *  widget, y darle uno solo para el color lo convertiría en otra cosa. */
  premium?: boolean
  /** [2026-08-07] El widget de booking completo fija su CTA al pie de la caja
   *  (`.widget-pie`), y para eso la caja tiene que CEDERLE su padding inferior:
   *  un elemento `sticky` se detiene en el borde de la caja de CONTENIDO, así
   *  que con el padding puesto el pie se paraba 20px antes del suelo y por esa
   *  franja seguía asomando el contenido que pasa por debajo. Sin padding
   *  abajo, el pie llega al borde real y es él quien pone la separación.
   *  Las ramas de cotización/consulta NO lo activan: no tienen pie fijo y su
   *  último elemento quedaría pegado al borde. */
  pieFijo?: boolean
}) {
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
      // [v2 2026-07-28, pedido de Samuel] En Premium el widget entero pasa a
      // tema oscuro con terminaciones doradas. `widget-premium` no aplica
      // estilos: REDEFINE LOS TOKENS de color en este ámbito, y todo lo de
      // dentro —que ya usaba tokens— sigue a la nueva paleta solo. Ver el
      // bloque «Widget de reserva en modo PREMIUM» en componentes.css.
      className={`flex scroll-mt-sticky-top flex-col gap-4 rounded-card-grande bg-papel p-4 widget-marco [&>*]:shrink-0 sm:p-5 lg:max-h-[calc(100svh-var(--spacing-sticky-top)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain scroll-sutil ${
        premium ? 'widget-premium' : ''
      } ${pieFijo ? 'lg:pb-0' : ''}`}
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
    return <p className="font-display text-precio font-semibold text-navy">{t('US$ —')}</p>
  }
  const sufijo = unidad === 'grupo' ? t('per group') : t('per person')
  return (
    <p className="text-navy">
      {unidad === 'desde' ? <span className="text-sm text-navy-sub">{t('From')}{' '}</span> : null}
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
  onPersonasChange,
  addOnsElegidos,
  onAddOnsChange,
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
  // [v2 2026-07-27] Tercer tramo de edad: bebés 0-2, gratis. Viaja al funnel
  // para que la tripulación sepa cuántos van a bordo, aunque no paguen.
  const [bebes, setBebes] = useState(0)
  // [2026-09-04, Derick: «poner una opción de que los niños puedan hacer un
  // upgrade a menú Premium de adulto por 15$US más cada uno»] Todo o nada, que
  // es como se pidió: o suben todos los niños de la reserva o ninguno.
  const [ninosPremium, setNinosPremium] = useState(false)
  const [personas, setPersonas] = useState(2)
  // [v2 2026-07-27] ABRE EN PREMIUM. Cambio pedido explícitamente por el
  // cliente (slide 4 del PDF v2: «poner aquí por defecto el premium») y
  // ratificado por Samuel el 07-27 sabiendo la consecuencia. Ver la nota
  // larga del encabezado del archivo.
  const [paquete, setPaquete] = useState<'light' | 'premium'>('premium')

  // [v2 2026-07-28] Tours PREMIUM DE BASE — Samuel: «Isla Saona y Charter
  // Privado, que el widget sea tema oscuro, porque esos 2 servicios son
  // premium de base». Su widget abre y se queda en piel oscura pase lo que
  // pase con `paquete`, que en esos dos ni siquiera se usa: se venden por
  // sub-variante (bote/tarifario), sin toggle Light/Premium. Ahí la piel
  // oscura deja de significar «has subido a Premium» y pasa a describir el
  // producto. El flag es de la FICHA, no del estado — ver
  // `widgetPremiumDeBase` en data/tours.ts.
  const premiumDeBase = ficha.widgetPremiumDeBase === true

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
  // [v2 2026-07-28] Publica el nº de personas hacia arriba (ver `onPersonasChange`
  // en Props). Va por efecto y no colgado de cada `setPersonas` porque el valor
  // sale de DOS modelos distintos —stepper simple y adultos+niños del dual—, y
  // colgarlo de los handlers obligaba a acordarse en cinco sitios. Con el
  // efecto, la página siempre ve el mismo número que el widget usa para
  // calcular, incluido el primer render.
  // ⚠️ Va AQUÍ ARRIBA, y no junto a `paxActuales` (que es donde pedía el
  // cuerpo), porque más abajo hay dos `return` tempranos —booking 'cotizacion'
  // y 'consulta'— y un hook después de ellos cambia el número de hooks entre
  // renders. La expresión se repite en vez de leer `totalPersonas` porque esa
  // constante se declara 15 líneas más abajo; es la MISMA fórmula, y si algún
  // día deja de serlo, `paxActuales` y esto tienen que moverse juntos.
  useEffect(() => {
    onPersonasChange?.(esDual ? adultos + ninos : personas)
  }, [esDual, adultos, ninos, personas, onPersonasChange])

  // Quitar los niños tiene que apagar su upgrade: si no, el interruptor
  // desaparece de la pantalla con el estado en `true` y el checkout cobraría un
  // salto de menú para cero niños.
  useEffect(() => {
    if (ninos === 0 && ninosPremium) setNinosPremium(false)
  }, [ninos, ninosPremium])

  // Tope del stepper de personas — misma fórmula que el funnel (ver
  // maxPersonasDe, arriba): aforo del tour si la tarifa es dual, el tramo más
  // alto si hay sub-variantes, y 6 en el resto.
  const maxPersonas = maxPersonasDe(tour, ficha)
  // Para Snorkel Lovers (dual), adultos + niños no puede superar maxPax.
  const totalPersonas = esDual ? adultos + ninos : personas

  // Los extras que ofrece ESTE barco. Vive aquí arriba —y no junto al cálculo
  // del total, que es donde se usa— porque más abajo hay dos `return`
  // tempranos y la cotización de Odoo, que es un hook, tiene que quedar por
  // encima de ellos.
  // [v3 2026-08-06] Los add-ons pueden estar atados a sub-variantes concretas
  // (`soloSubVariantes`): la langosta del charter solo existe en los barcos de
  // 4 h, que son los que navegan con la cocina flotante. El filtro vive en
  // `addOnsDisponibles` (lib/tarifas) porque la franja de la langosta del
  // bloque de menú aplica EXACTAMENTE la misma regla — si no, el panel, el
  // desglose, el total y la franja podrían discrepar sobre si aplica.
  // `totalPersonas` tambien: hay add-ons con condicion de tamano de grupo (la
  // comida del Maite, que solo existe por debajo de 8). Ver `addOnsDisponibles`.
  // [2026-09-01, fusion con Samuel] Su regla de pax para los add-ons —los
  // opcionales del charter desaparecen al cruzar al tramo que ya los
  // incluye— pero declarada AQUI, que es donde la necesita la cotizacion.
  const paxParaAddOns = esDual ? totalPersonas : personas
  const addOns = addOnsDisponibles(ficha, variante, paxParaAddOns)

  // [2026-08-18] EL PRECIO BUENO LO PONE ODOO (ver use-cotizacion.ts). Hasta
  // hoy la ficha calculaba en el navegador y el checkout preguntaba a Odoo:
  // dos motores, y por tanto dos números que podían no coincidir. El cálculo
  // local se queda como lo que se pinta mientras la respuesta viaja y como red
  // si el servidor no contesta —una ficha sin precio no vende nada—, pero
  // cuando Odoo contesta, gana Odoo.
  //
  // La cotización YA incluye los add-ons, así que sustituye al total entero,
  // no solo a la parte del tour.
  const cotizacion = useCotizacion(
    tour.precioLight === null
      ? null
      : {
          tour: tour.slug,
          // Misma resolución que `subActiva` más abajo: el barco elegido, o el
          // primero si todavía no se ha tocado.
          variante: variante ?? varianteInicial,
          pax: esDual
            ? { adults: adultos, children: ninos, infants: 0 }
            : { adults: personas, children: 0, infants: 0 },
          paquete,
          ninosPremium,
          addons: addOnsElegidos.filter((id) => addOns.some((a) => a.id === id)),
        },
  )

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
  //  - 'forever-teresa' (default recomendado): el tramo ALTO por persona.
  //    ⚡ [2026-09-01] Con el tarifario nuevo de este barco (1-30 grupo · 31+
  //    por persona) las 30 personas de antes caen en el tramo de GRUPO, así que
  //    el flag sube a 31 para seguir enseñando lo que quería enseñar:
  //    31 × US$ 75 = US$ 2.325.
  //  - 'maite-8': el tramo grupo de Maite (1-8 pax, US$ 625 fijo) — el
  //    usuario ve el caso "precio fijo de grupo", no multiplica.
  //  - 'maite-12': el tramo persona de Maite (9-15, US$ 99/pax) — el
  //    usuario ve el caso "US$ 99 × 12 = US$ 1.188".
  //  - 'grandma-5': el tramo de grupo de GrandMa (1-12 pax, US$ 900 fijo).
  useDevFlag('dev-charter', (v) => {
    const fechaManana = sumarDias(hoyISO(), 1)
    if (v === 'forever-teresa') {
      setFecha(fechaManana)
      setVariante('forever-teresa')
      setPersonas(31)
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
      // `premiumDeBase` también en estas dos ramas: hoy los dos tours que lo
      // llevan son booking 'completo' y no pasan por aquí, pero la piel es de
      // la FICHA — si mañana uno vuelve a cotización, no tiene por qué dejar
      // de ser premium por el camino.
      <Caja premium={premiumDeBase}>
        <Precio precio={tour.precioLight} unidad="desde" />
        <p className="text-sm text-navy-sub">
          {t('This tour is quoted to fit you, based on the number of guests and the menu. Up to')}{' '}
          {tour.maxPax} {t('guests.')}
        </p>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <EnlacePrototipo>{t('Request a quote')}</EnlacePrototipo>
        </FancyButton.Root>
        <FancyButton.Root variant="basic" className="w-full" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            {t('WhatsApp us directly')}
          </a>
        </FancyButton.Root>
      </Caja>
    )
  }

  if (tour.booking === 'consulta') {
    return (
      <Caja premium={premiumDeBase}>
        <Precio precio={tour.precioLight} unidad="desde" />
        {/* El copy no se maquilla: es la verdad del producto (dato pendiente
            del cliente, ver PLAN-v3.md §9). Un precio inventado aquí sería el
            peor sitio posible para inventarlo. */}
        <p className="text-sm text-navy-sub">
          <strong className="font-semibold text-navy">{t('Price still to be confirmed with the client.')}</strong> {t('Duration and capacity are still to be defined too.')}
        </p>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            {t('Ask on WhatsApp')}
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
    ninosPremium,
  )

  // [v2 2026-07-27] Add-ons: se suman DESPUÉS del precio del tour y se
  // muestran como línea aparte en el desglose, nunca fundidos en el precio
  // base — así el visitante siempre ve qué parte del total es el tour y qué
  // parte eligió añadir.
  // [v3 2026-08-06] Los add-ons pueden estar atados a sub-variantes concretas
  // (`soloSubVariantes`): la langosta del charter solo existe en los barcos de
  // 4 h, que son los que navegan con la cocina flotante. El filtro estaba
  // escrito aquí; desde el 2026-08-07 vive en `addOnsDisponibles` (lib/tarifas)
  // porque la franja de la langosta del bloque de menú también marca add-ons y
  // tiene que aplicar EXACTAMENTE la misma regla — si no, el panel, el desglose,
  // el total y la franja podrían discrepar sobre si la langosta aplica.
  // [2026-09-01] El filtro recibe además el nº de personas: las comidas
  // opcionales del charter desaparecen al cruzar al tramo que ya las incluye
  // (`soloHastaPersonas`). Se pasa el mismo pax que se usa para cobrarlas, así
  // que el panel y el total no pueden discrepar.
  // ¿Hay algún extra que el visitante haya PEDIDO, en vez de venir marcado de
  // fábrica? Decide si el panel de upsells se adelanta a la fecha — ver la
  // puerta más abajo. Hoy ninguno viene marcado (el álbum de fotos, que era el
  // único `porDefecto`, se retiró el 2026-09-01), así que basta con que haya
  // uno elegido; la condición se deja escrita entera porque es la regla, no el
  // estado actual del catálogo.
  const hayAddOnPedido = addOns.some((a) => addOnsElegidos.includes(a.id) && !a.porDefecto)
  const importeAddOns = totalAddOns(addOns, addOnsElegidos, paxParaAddOns)
  const totalLocal = totalTour === null ? null : totalTour + importeAddOns
  // Odoo si ha contestado; el cálculo local mientras tanto.
  const total = cotizacion.total ?? totalLocal
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
  // Un solo booleano para la piel oscura, y se calcula una vez: lo consumen la
  // `Caja` (que redefine los tokens) y las piezas que se PORTALIZAN fuera de
  // ese ámbito y por tanto no se enteran del cambio de tema — hoy los tooltips
  // de los tramos de edad. Dos lecturas del mismo dato en sitios distintos se
  // desincronizan; una sola no.
  const pielOscura = premiumDeBase || (paquete === 'premium' && tienePaquetes)
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
  // [v2 2026-07-28] Los horarios del bote activo se calculan AQUÍ, en el
  // cuerpo, y no dentro del bloque de horario: el campo de fecha también los
  // necesita para mostrar la hora elegida junto al día. Dos lecturas del mismo
  // dato en sitios distintos se desincronizan; una sola no.
  const horariosActivos =
    subActiva?.horarios && subActiva.horarios.length > 0 ? subActiva.horarios : ficha.horarios
  const horaElegida = horariosActivos[horario]?.hora ?? null

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
    <Caja premium={pielOscura} pieFijo>
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
        <span>· {numero(tour.resenas)} {t('verified reviews')}</span>
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
              {formatoDinero(tramoActivo.precio)} × {paxActuales} {t(paxActuales === 1 ? 'guest' : 'guests')}
              {' · '}
              <span className="text-navy-sub">{t('tier')}{' '}{tramoActivo.desde}–{tramoActivo.hasta === null ? '120' : tramoActivo.hasta} {t('pax')}</span>
            </>
          ) : (
            <>
              {t('Flat group price')}
              {' · '}
              <span className="text-navy-sub">{t('tier')}{' '}{tramoActivo.desde}–{tramoActivo.hasta === null ? '120' : tramoActivo.hasta} {t('pax')}</span>
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
              paquete === 'premium' ? 'premium-pista' : 'bg-linea'
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
              className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${
                paquete === 'premium' ? 'premium-thumb' : 'bg-papel shadow-sm'
              }`}
              // [v2 2026-07-28] PREMIUM ES EL PRIMERO, así que el reposo del
              // thumb es la IZQUIERDA y quien se desplaza es Light. Es la
              // inversión de la condición anterior, no un ajuste de la fórmula:
              // el `calc(100% + 0.25rem)` (1 ancho de thumb + el gap) sigue
              // siendo correcto y ya costó una vuelta acertarlo el 07-17.
              style={{ transform: paquete === 'light' ? 'translateX(calc(100% + 0.25rem))' : 'translateX(0)' }}
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
            {/* [v2 2026-07-28, pedido de Samuel: «Premium tiene que estar de
                primero, a la izquierda»] El orden del array ES el orden en
                pantalla. Y tiene lógica de producto: desde el 07-27 el widget
                ABRE en Premium, así que la opción por defecto estaba apareciendo
                en segundo lugar — se leía primero lo que no está elegido. En
                lectura occidental el primer sitio es el de la opción que la casa
                recomienda. */}
            {[
              { id: 'premium' as const, nombre: 'Premium', precio: precioBase + upgrade },
              { id: 'light' as const, nombre: 'Light', precio: precioBase },
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

      {/* [2026-08-18] El calendario pregunta a Odoo qué días quedan, y lo hace
          con el barco y el tamaño del grupo que están elegidos AHORA: el aforo
          es por barco y por número de personas, así que cambiar cualquiera de
          los dos puede abrir o cerrar días. */}
      <CalendarioWidget
        fecha={fecha}
        onSeleccionar={setFecha}
        hora={horaElegida}
        tour={tour.slug}
        variante={subActiva?.id ?? null}
        personas={paxActuales}
      />

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
        return (
          // [v2 2026-07-28] HORARIO REDISEÑADO (pedido de Samuel: «dejar solo
          // el texto de salida… pero no me convence cómo se escoge»).
          //
          // Antes: rejilla de 2 tarjetas de TRES líneas cada una (Salida ↓
          // Regreso), ~86px + label. Ahora: una fila de PÍLDORAS con solo la
          // hora de salida, y UNA línea debajo que confirma el resto.
          //
          // El razonamiento, que es el patrón de Viator/GetYourGuide/Civitatis:
          //  · La hora de salida es con lo que se DECIDE; la de regreso es una
          //    consecuencia. Poniendo las dos en cada opción, elegir entre N
          //    horarios obliga a leer 2N datos — y la mitad no ayudan a decidir.
          //  · El regreso no se pierde: se muda a la línea de confirmación,
          //    donde sí importa (ya has elegido, ahora quieres saber a qué hora
          //    vuelves). Ahí se le suma la duración, que es la pregunta real de
          //    quien organiza el día.
          //  · Escala. Con 2 horarios la rejilla de tarjetas aguanta; con 4-5
          //    —y el charter ya tiene botes con horarios propios— crecería
          //    fuera de la pantalla. Una fila de píldoras que envuelve, no.
          <div className="duration-200 animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-wrap gap-2">
              {horariosActivos.map((h, i) => {
                const elegido = horario === i
                return (
                  <button
                    key={h.hora}
                    type="button"
                    onClick={() => setHorario(i)}
                    aria-pressed={elegido}
                    aria-label={
                      h.regreso
                        ? tp('Departure {salida}, back at {vuelta}', { salida: h.hora, vuelta: h.regreso })
                        : tp('Departure {salida}', { salida: h.hora })
                    }
                    // `text-papel` y NO `text-white`: el blanco de Tailwind es un
                    // valor fijo, no un token, así que en el tema oscuro se
                    // quedaba blanco sobre el crema de `bg-navy` remapeado — la
                    // hora elegida se volvía invisible. `--color-papel` y
                    // `--color-navy` se voltean JUNTOS en `.widget-premium`, así
                    // que el par se mantiene legible en los dos temas sin una
                    // sola condición.
                    className={`rounded-full px-3.5 py-2 text-sm tabular-nums transition-colors ${
                      elegido
                        ? 'bg-navy font-semibold text-papel shadow-sm'
                        : 'bg-papel-hueso text-navy-sub hover:bg-papel-hueso/70 hover:text-navy'
                    }`}
                  >
                    {h.hora}
                  </button>
                )
              })}
            </div>
            {/* La confirmación de lo elegido, en una sola línea. Solo si hay
                regreso publicado — no se inventa una hora de vuelta. */}
            {horariosActivos[horario]?.regreso ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-navy-soft">
                <ArrowDown className="size-3 shrink-0 -rotate-90" aria-hidden="true" />
                {t('You’re back at')}{' '}
                <span className="font-semibold text-navy">{horariosActivos[horario].regreso}</span>
                <span className="text-navy-soft/70">&middot; {ficha.duracion}</span>
              </p>
            ) : null}
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
          // [v2 2026-07-27] DUAL, ahora PLEGADO EN UN POPOVER (pedido de
          // Samuel, con la referencia de Viator). Los tres steppers —adultos,
          // niños, bebés— ocupaban ~190px de alto SIEMPRE, aunque la mayoría de
          // reservas no lleven menores. Ahora el widget muestra una sola línea
          // («2 pasajeros») y el detalle se despliega al tocarla.
          //
          // Solo aquí: los tours sin tramos de edad tienen un único stepper y
          // meterlo en un popover añadiría un clic sin ahorrar nada.
          <>
          <PasajerosPopover total={totalPersonas} max={maxPersonas}>
            {/* [v2 2026-07-28] Filas SIN borde, con el rango de edad en el
                propio título y el mínimo/máximo debajo — patrón de Viator, que
                Samuel pasó como referencia. Antes eran tres cajas con borde
                dentro de otra caja con borde.
                ⚠️ Los rangos de edad los fijó Derick el 2026-09-04, y
                corrigen los que puso Samuel el 07-28 (niños 4-7, bebés 0-3):
                adultos 13-99, niños 3-12, bebés 0-2. El tope de 7 dejaba fuera
                de la tarifa reducida a cualquier niño de 8 a 12, que acababa
                pagando 114 de adulto. */}
            <FilasPasajeros
              adultos={adultos}
              ninos={ninos}
              bebes={bebes}
              maxPersonas={maxPersonas}
              onAdultos={setAdultos}
              onNinos={setNinos}
              onBebes={setBebes}
              precioNino={tour.precioNino}
              sobreOscuro={pielOscura}
            />
          </PasajerosPopover>
          {/* [2026-09-04, Derick: «poner una opción de que los niños puedan
              hacer un upgrade a menú Premium de adulto por 15$US más cada
              uno»] Fuera del popover a propósito: no es cuánta gente viaja,
              es qué comen — y dentro del desplegable nadie lo vería.
              Solo aparece si hay niños Y el tour tiene salto de menú; si no,
              es una casilla que no cambia el precio. */}
          {ninos > 0 && ficha.upgradePremium ? (
            <label
              className={`mt-2 flex cursor-pointer items-start gap-3 rounded-card border px-3 py-2.5 ${
                pielOscura ? 'border-white/15 bg-white/5' : 'border-linea bg-papel'
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-aqua"
                checked={ninosPremium}
                onChange={(e) => setNinosPremium(e.target.checked)}
              />
              <span className="text-sm">
                <span className={`font-semibold ${pielOscura ? 'text-papel' : 'text-navy'}`}>
                  {t('Kids on the adult Premium menu')}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    pielOscura ? 'text-papel/70' : 'text-navy-sub'
                  }`}
                >
                  {t('Instead of the Kid’s Meal.')}{' '}
                  {tp('+{precio} per child', { precio: formatoDinero(ficha.upgradePremium) })}
                </span>
              </span>
            </label>
          ) : null}
          </>
        ) : (
          // CLÁSICO: 1 input «Personas» (semi-privado, charter, Saona)
          <>
            {/* [v2 2026-07-27] Sin label visible, mismo criterio que el campo de
                fecha: el icono y el propio valor («2 personas») lo dicen. El
                nombre accesible se conserva en `aria-label` más abajo. */}
            {/* v3 (2026-07-17, Saona): si la sub-variante activa tiene un mínimo
                superior al state actual, mostramos el aviso justo debajo del
                stepper (no encima) — es info contextual, no título. El state
                `personas` sigue siendo 2 por defecto; el usuario lo sube con el +. */}
            {(() => {
              if (!ficha.subVariantes || !variante) return null
              const v = ficha.subVariantes.find((s) => s.id === variante)
              if (!v) return null
              const min = Math.min(...v.tabla.map((tramo) => tramo.desde))
              if (personas >= min) return null
              return (
                <p className="mb-1.5 text-xs text-navy-soft">
                  {v.nombre} {t('requires a minimum of')}{' '}{min} {t('guests.')}
                </p>
              )
            })()}
            <div
              role="group"
              aria-label={t('Number of guests')}
              className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5"
            >
              <span className="flex items-center gap-1 text-paragraph-sm text-text-strong-950">
                <Users className="mr-1 size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
                <NumeroEditable
                  valor={personas}
                  min={1}
                  max={maxPersonas}
                  onCambio={setPersonas}
                  etiqueta={t('Number of guests')}
                  className="tabular-nums"
                />
                {t(personas === 1 ? 'guest' : 'guests')}
              </span>
              <div className="flex items-center gap-1">
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Remove a guest')}
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
                  aria-label={t('Add a guest')}
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

      {/* [2026-09-01, pedido de Samuel] BANNER DE DESCUENTO POR GRUPO, en el
          widget de TODOS los tours. Va PEGADO AL CONTADOR DE PERSONAS, que es
          lo único que puede cambiar si aplica o no: el banner reacciona al
          número que hay justo encima (invita mientras falten personas, celebra
          cuando ya llega), así que separarlo del stepper lo convertiría en un
          cartel suelto. Ver banner-grupo.tsx para los tres estados y para el
          placeholder del porcentaje, que Samuel decide más adelante. */}
      <BannerGrupo
        personas={paxActuales}
        maxPersonas={maxPersonas}
        contactoUrl={WHATSAPP_URL}
      />

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
            {t('With Premium you add 4 things for')}{' '}{formatoDinero(upgrade ?? 0)}
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
            // [v2 2026-07-28, pedido de Samuel: «que parezca dorado 3D como el
            // selector cuando está en estado premium, mismo estilo»] Deja de ser
            // un relleno de oro plano y pasa a ser LA MISMA PIEZA que el thumb
            // del selector: `.premium-thumb` — degradado en diagonal, filo de luz
            // arriba, sombra abajo y halo cálido. Es literalmente la misma clase,
            // no un dorado parecido, y eso importa: este botón lleva justo al
            // estado donde esa pieza vive, así que reconocerla es parte del
            // mensaje.
            className="premium-thumb mt-3 w-full rounded-full px-4 py-2 text-xs font-bold text-premium-fondo transition hover:brightness-110"
          >
            {t('Switch to Premium')}
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
          {t('With')}{' '}<strong className="text-navy">{paxActuales + 1} {t('guests')}</strong> {t('the rate for this boat changes: it goes to')}{' '}{formatoDinero(salto.hasta)}{t('. Boating regulations require more crew from that group size on.')}
        </p>
      ) : null}

      {/* [v2 2026-07-27] Upsells. Aparecen SOLO con la reserva ya configurada
          (fecha elegida): mientras el visitante todavía está formando el
          precio —subiendo el contador, comparando barcos— un extra compite con
          la decisión principal y engorda un total que aún se está evaluando.
          Al final, cuando ya decidió ir, US$ 20 sobre una reserva de varios
          cientos es un sí fácil. Es la posición de «order bump» y es lo que
          Samuel pidió: «llamativo en su momento, pero no invasivo». */}
      {/* [2026-08-07] …CON UNA EXCEPCIÓN: si el visitante ya PIDIÓ un extra
          desde la franja de la langosta del bloque de menú, esconderlo aquí
          sería peor que enseñarlo pronto — habría marcado algo que no aparece
          por ninguna parte. La puerta se abre entonces aunque no haya fecha.
          Se compara contra los add-ons que arrancan marcados (el álbum) para
          no confundir «lo eligió» con «venía puesto». */}
      {addOns.length > 0 && (fecha !== null || hayAddOnPedido) ? (
        <AddOnsWidget
          addOns={addOns}
          personas={paxParaAddOns}
          elegidos={addOnsElegidos}
          onCambiar={onAddOnsChange}
        />
      ) : null}

      {/* «Ahorra hasta 15%» (decisión de precio, Fase B): el precio mostrado es
          el de LISTA (el que todos pagan); los descuentos —recurrente +
          anticipación + efectivo— se comunican aquí, junto al CTA, sin anclar
          el precio en ellos.
          [v2 2026-07-28] El número deja de estar escrito a mano y sale de
          DESCUENTO_MAXIMO, el mismo array que pinta el bloque «Cómo pagar
          menos» y que aplica el descuento al cobrar. Este chip lleva desde la
          Fase B prometiendo un 15% que ninguna otra parte del sitio explicaba;
          ahora que la explicación existe, lo peligroso sería que las dos
          cifras pudieran separarse. */}
      <div className="flex items-center justify-center gap-1.5 rounded-btn bg-menta px-3 py-1.5 text-center text-xs font-medium text-menta-texto">
        <Tag className="size-3.5 shrink-0" aria-hidden="true" />
        {t('Book direct and save up to')}{' '}{DESCUENTO_MAXIMO}%
      </div>

      {/* Sin fecha, el CTA está DESHABILITADO de verdad (no un botón gris que
          igual navega): el estado vacío es una variante del componente en
          Figma (FancyButton disabled), y se resuelve con los slots del
          sistema, no bajando la opacidad. */}
      {/* [2026-08-07] EL CTA SE FIJA AL PIE DE LA CAJA (Samuel: «cuando hay
          scroll suficiente el botón se sale y no se ve completo; debe estar
          fijado al final, la idea es que siempre siempre esté visible para ser
          clickeado»). Desde que el scroll vive en la propia caja (v2
          2026-07-27, comentario de `Caja`), el widget mide ~900px de contenido
          en los ~700 que deja la pantalla: el botón —que es la razón de ser de
          toda esta columna— quedaba cortado por el borde inferior salvo que se
          scrolleara hasta él.

          `sticky bottom-0` y no un pie fuera del scroll: así el botón se
          despega solo cuando hace falta y, al llegar al final, vuelve a su
          sitio del flujo con el ticker de garantías y la reseña debajo — no
          hay dos maquetas distintas que mantener.

          Los negativos laterales (`-mx-5` + `px-5`) llevan el fondo hasta los
          bordes de la caja, para que el contenido no asome por los costados al
          pasar por debajo. Son los 5 del `sm:p-5` de `Caja`: a partir de lg el
          padding ya es siempre ese, así que no hace falta la pareja de móvil.

          `z-10` deja el pie por encima del selector de paquete (su thumb
          también es z-10, pero este va después en el DOM) y POR DEBAJO del
          calendario y el popover de pasajeros (z-20): un panel abierto tiene
          que taparlo, no al revés.

          El `pb-5` del pie ES el padding inferior de la caja, que se lo cede
          (`pieFijo` en `Caja`, y el `lg:pb-5` de la fila de deseos que lo
          devuelve al final del scroll). No es decoración: un `sticky` se para
          en el borde de la caja de CONTENIDO de su contenedor, así que con el
          padding puesto el pie se detenía 20px antes del suelo y por esa franja
          seguía asomando el contenido que pasaba por debajo — probado en el
          navegador, y un margen negativo NO lo arregla (Chrome recorta igual).
          Cediéndolo, el pie llega al borde real y el hueco bajo el botón lo
          pone él. */}
      <div className="widget-pie lg:sticky lg:bottom-0 lg:z-10 lg:-mx-5 lg:px-5 lg:pb-5 lg:pt-3">
        {fecha === null ? (
          <FancyButton.Root variant="primary" className="w-full" disabled>
            {t('Pick a date')}
          </FancyButton.Root>
        ) : total === null ? (
          // v3 (2026-07-17, Saona): con subVariantes, hay un 2º estado disabled
          // — la fecha está pero el nº de personas no llega al mínimo del
          // tramo de la variante activa. Sin este caso el botón se queda
          // habilitado y "Continuar — —" (que no se ve bien) al cambiar
          // variante sin ajustar pax.
          <FancyButton.Root variant="primary" className="w-full" disabled>
            {t('Adjust the number of guests')}
          </FancyButton.Root>
        ) : (
          <FancyButton.Root variant="primary" className="w-full" asChild>
            <Link
              to={`/book/${tour.slug}?${new URLSearchParams({
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
                      // [2026-09-04] El upgrade de menú de los niños viaja al
                      // funnel como los bebés: solo si está pedido, para no
                      // ensuciar la URL del caso normal. Sin esto, marcar la
                      // casilla en la ficha no llegaba al checkout y Odoo
                      // cobraba sin el salto.
                      ...(ninosPremium ? { ninosPremium: '1' } : {}),
                      personas: String(totalPersonas),
                    }
                  : { personas: String(personas) }),
                // [2026-08-18] LOS ADD-ONS VIAJAN. No lo hacían: el álbum de
                // US$ 20 y la langosta de US$ 30/pax se elegían aquí y
                // desaparecían entre dos pantallas. Desde que la ficha cotiza
                // contra Odoo eso además descuadraba el precio — la ficha los
                // sumaba y el checkout no—, así que ya no es solo una compra
                // perdida: son dos números distintos para la misma reserva.
                ...(addOnsElegidos.length > 0
                  ? { addons: addOnsElegidos.filter((id) => addOns.some((a) => a.id === id)).join(',') }
                  : {}),
              }).toString()}`}
            >
              {t('Continue ·')}{' '}{formatoDinero(total)}
            </Link>
          </FancyButton.Root>
        )}
      </div>

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
            t('Book now, pay later: confirm with just 25%'),
            t('Free cancellation up to 7 days before'),
            t('Full refund for bad weather'),
          ]}
        />
      </div>

      {/* Reseña verificada dentro del widget (correcciones v1, slide 4). La
          maqueta la pone justo aquí y acierta: es el último argumento antes
          de decidir. Es una reseña REAL del pool del sitio (QUOTES), no un
          texto escrito para vender — por eso lleva su plataforma y su firma. */}
      {/* [v2 2026-07-28] La FIRMA sube a la misma línea del sello, alineada a
          la derecha (pedido de Samuel, para ahorrar alto). Se pierde una línea
          entera sin perder información: quién lo dice y dónde está verificado
          son el mismo dato de credibilidad, así que leerlos juntos incluso
          funciona mejor que separados por la cita. */}
      <figure className="rounded-card bg-papel-hueso p-3">
        {/* items-CENTER, no items-baseline: el lado izquierdo es a su vez un
            flex con un SVG dentro, y un contenedor flex expone como línea base
            la de su primer hijo — el icono, que no tiene baseline de texto. El
            resultado era la firma visiblemente más abajo que el título. Con los
            dos lados al mismo tamaño de letra, centrar es lo que los alinea. */}
        <figcaption className="flex items-center justify-between gap-2 text-xs font-medium text-menta-texto">
          <span className="flex min-w-0 items-center gap-1.5">
            <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{t('Verified review on')}{' '}{resenaWidget.plataforma}</span>
          </span>
          <span className="shrink-0 font-semibold text-navy">{resenaWidget.autor}</span>
        </figcaption>
        <blockquote className="mt-1.5 text-xs italic text-navy-sub">
          «{resenaWidget.texto}»
        </blockquote>
      </figure>

      {/* Lista de deseos + compartir (correcciones v1, slide 4). Guardar vive
          en localStorage, como el resto del prototipo (lib/reservas.ts hace
          lo mismo con la reserva). Compartir usa la Web Share API nativa
          cuando existe (móvil) y cae a copiar el enlace en escritorio. */}
      {/* [2026-08-07] `lg:pb-5` devuelve aquí el padding inferior que la caja
          le cede al pie fijo del CTA (ver `pieFijo` en `Caja`): esta fila es el
          último elemento, y sin él quedaría pegada al borde al llegar al final
          del scroll. */}
      <div className="flex items-center justify-between gap-2 border-t border-linea pt-3 lg:pb-5">
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
          {enDeseos ? t('On your list') : t('Add to wishlist')}
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
