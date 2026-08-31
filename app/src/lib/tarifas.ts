import type { FichaTour, TramoPrecio } from '@/data/tours'
import { traducible } from '@/lib/i18n'

/** Motor de tarifas (correcciones v2, 2026-07-27).
 *
 *  Existen DOS modelos de precio en el negocio y el widget tiene que soportar
 *  los dos. Salen del tarifario real de la web del cliente, extraído y
 *  verificado en `docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`:
 *
 *  1. TOURS (charter privado, Saona) → SUSTITUCIÓN DE TRAMO.
 *     Según en qué tramo caiga el TOTAL de personas se aplica ese y solo ese:
 *       - `tipo: 'grupo'`   → precio plano, no se multiplica.
 *       - `tipo: 'persona'` → precio × TODAS las personas, no solo las que
 *                             exceden el tramo anterior.
 *     Ejemplo real (Maite): 8 pax = US$ 625 plano · 9 pax = 9 × 99 = US$ 891.
 *     La persona nº 9 no «cuesta 99»: hace saltar toda la reserva de tramo.
 *
 *  2. EVENTOS (party boat, bodas) → MARGINAL.
 *     Base fija para 1-12 personas + tanto por cada persona extra.
 *     Ejemplo real: US$ 1.188 hasta 12 pax, +US$ 99 por cada una desde la 13.
 *
 *  No mezclar los dos. La función de eventos vive en `lib/cotizacion-evento.ts`.
 */

/** Encuentra el tramo que contiene `personas`. Devuelve null si no hay
 *  ninguno (p. ej. más personas que el tope del último tramo). */
export function tramoDe(tabla: TramoPrecio[], personas: number): TramoPrecio | null {
  return (
    tabla.find((t) => t.desde <= personas && (t.hasta === null || t.hasta >= personas)) ?? null
  )
}

/** Precio base de un tramo para N personas, aplicando sustitución. */
export function precioDeTramo(tramo: TramoPrecio, personas: number): number {
  // El suplemento por persona solo acompaña a la tarifa de GRUPO — en cuanto el
  // tramo se cobra por cabeza ya va dentro del precio. Misma regla que aplica
  // el servidor (haa.excursion.transfer_price), que es quien manda.
  if (tramo.tipo === 'grupo') {
    return tramo.precio + (tramo.extraPorPax ?? 0) * Math.max(personas, 0)
  }
  return tramo.precio * personas
}

/** Aforo máximo real de una tabla de tramos: el `hasta` del último tramo.
 *  Se deriva del tarifario en vez de escribirse a mano, para que no puedan
 *  desincronizarse (regla del TARIFARIO §5). */
export function aforoDe(tabla: TramoPrecio[]): number {
  const topes = tabla.map((t) => t.hasta ?? Infinity)
  const max = Math.max(...topes)
  return Number.isFinite(max) ? max : 999
}

/** Mínimo real de una tabla: el `desde` del primer tramo. */
export function minimoDe(tabla: TramoPrecio[]): number {
  return Math.min(...tabla.map((t) => t.desde))
}

/** El precio de entrada que se anuncia («desde US$ X»).
 *
 *  ⚠️ Se CALCULA del tarifario, nunca se copia el «from us$» de la web del
 *  cliente: sus «from» no se derivan de sus propias tablas (Santa Maria
 *  anuncia «desde 1.150» cuando su tramo de grupo son 1.000) y ya provocaron
 *  precios mal portados en el repo — ver los `[tarifa-v2]` de `data/tours.ts`.
 *
 *  Para tramos de grupo el mínimo es el precio plano; para tramos por persona,
 *  el precio de una persona sola no es representativo (no se vende un charter
 *  para 1), así que se toma el precio del tramo aplicado a su `desde`. */
export function precioDesde(tabla: TramoPrecio[]): number {
  return Math.min(...tabla.map((t) => precioDeTramo(t, t.desde)))
}

// ── Add-ons ────────────────────────────────────────────────────────────────

/** Un extra opcional de la reserva.
 *
 *  `base` decide cómo se multiplica:
 *   - 'persona' → precio × nº de personas (langosta, comida opcional)
 *   - 'grupo'   → precio fijo, no escala (álbum de fotos)
 *
 *  Los tres son UPSELL: superficie de venta con peso visual, no letra pequeña
 *  (decisión de Samuel 2026-07-27). */
export type AddOn = {
  id: string
  etiqueta: string
  descripcion?: string
  base: 'persona' | 'grupo'
  precio: number
  /** Arranca marcado. Hoy solo el álbum de fotos — ver ALBUM_UPSELL. */
  porDefecto?: boolean
  /** Nota honesta del cliente que hay que mostrar junto al add-on
   *  (ej. la langosta no está disponible de marzo a junio). */
  nota?: string
  /** [v3 2026-08-06] IDs de `subVariantes` a las que aplica este add-on. Sin
   *  el campo, el add-on vale para toda la ficha (el caso de siempre).
   *
   *  Nace con la langosta del charter: el copy aprobado la ofrece como
   *  «optional upgrade» SOLO en los charters de 4 horas, porque son los que
   *  navegan con la cocina flotante — los de 3 horas llevan el Taste of
   *  Hispaniola (brochetas). Ofrecerla en un barco de 3h sería vender algo
   *  que no se puede servir.
   *
   *  El widget filtra por aquí antes de pintar y antes de sumar, así que si
   *  alguien marca la langosta y luego cambia a un barco de 3h, el add-on
   *  desaparece del panel Y del total: `totalAddOns` solo cobra lo que sigue
   *  en la lista filtrada, y un id huérfano en la selección no encuentra
   *  pareja. */
  soloSubVariantes?: string[]
  /** [2026-08-31] Condicion por tamano de grupo, la trae Odoo.
   *
   *  Derick: «en el Maite, en la web, si quieren comida y estan en menos de 8
   *  personas, son 20$ mas por persona». Por encima de ese numero la comida va
   *  incluida, asi que el add-on no debe ni aparecer. Sin campo, el add-on vale
   *  para cualquier grupo, que es el caso de siempre. */
  desdePax?: number
  hastaPax?: number
}

export function precioAddOn(addOn: AddOn, personas: number): number {
  return addOn.base === 'grupo' ? addOn.precio : addOn.precio * personas
}

export function totalAddOns(addOns: AddOn[], elegidos: string[], personas: number): number {
  return addOns
    .filter((a) => elegidos.includes(a.id))
    .reduce((suma, a) => suma + precioAddOn(a, personas), 0)
}

/** Configuración del upsell del álbum de fotos (US$ 20 por grupo).
 *
 *  ⚠️ DECISIÓN DE NEGOCIO CON RIESGO LEGAL REGISTRADO (Samuel, 2026-07-27).
 *  `porDefecto: true` = la casilla arranca MARCADA. Eso contraviene la
 *  Directiva 2011/83/UE art. 22, que exige consentimiento EXPRESO para todo
 *  pago adicional y da derecho a reembolso cuando se infiere de una casilla
 *  premarcada que el usuario debe rechazar. Punta Cana recibe mucho turismo
 *  europeo y el cobro será real en cuanto Odoo esté conectado.
 *
 *  Se implementa como pidió el cliente, pero AISLADO EN DOS BOOLEANOS a
 *  propósito: si hay que desactivarlo (o variar por mercado) es una línea, no
 *  una refactorización del widget. NO cablear esta lógica en los componentes.
 *  Detalle completo en TARIFARIO-WEB-ORIGINAL.md §4-C. */
export const ALBUM_UPSELL = {
  porDefecto: true,
  mensajeAlDesmarcar: true,
} as const

// ── Descuentos ─────────────────────────────────────────────────────────────

/** Los 3 descuentos publicados por el cliente, acumulables hasta 15%
 *  (decisión de Samuel 2026-07-27: se suman, no se encadenan — 15% plano,
 *  que es lo que el chip del widget lleva prometiendo desde la v1).
 *
 *  ⚠️ `recurrente` NO se auto-aplica: el sitio no tiene cuentas ni login, así
 *  que no puede verificar que alguien ya haya comprado. Una casilla libre de
 *  «ya he venido» la marca todo el mundo. Se MUESTRA como descuento existente
 *  y lo aplica el equipo al confirmar. Ver TARIFARIO §4-E. */
export type Descuento = {
  id: 'recurrente' | 'anticipacion' | 'efectivo'
  etiqueta: string
  porcentaje: number
  /** false = se muestra pero no se calcula solo (requiere verificación humana). */
  autoAplicable: boolean
}

export const DESCUENTOS: Descuento[] = traducible([
  {
    id: 'recurrente',
    etiqueta: 'Returning guests',
    porcentaje: 5,
    autoAplicable: false,
  },
  {
    id: 'anticipacion',
    etiqueta: 'Booking 30+ days ahead',
    porcentaje: 5,
    autoAplicable: true,
  },
  {
    id: 'efectivo',
    etiqueta: 'Paying in cash',
    porcentaje: 5,
    autoAplicable: true,
  },
])

export const DESCUENTO_MAXIMO = DESCUENTOS.reduce((s, d) => s + d.porcentaje, 0)

/** Aplica los descuentos SUMADOS (15% plano si aplican los tres), no
 *  encadenados. Redondea a 2 decimales para no arrastrar flotantes. */
export function aplicarDescuentos(total: number, ids: string[]): number {
  const pct = DESCUENTOS.filter((d) => ids.includes(d.id)).reduce((s, d) => s + d.porcentaje, 0)
  return Math.round(total * (1 - Math.min(pct, DESCUENTO_MAXIMO) / 100) * 100) / 100
}

// ── Cálculo completo ───────────────────────────────────────────────────────

export type DesgloseReserva = {
  /** Precio del tramo aplicado, antes de extras y descuentos. */
  base: number
  /** El tramo que se aplicó (para poder explicarlo en pantalla). */
  tramo: TramoPrecio | null
  addOns: { id: string; etiqueta: string; importe: number }[]
  subtotal: number
  descuento: number
  total: number
}

/** Desglose completo de una reserva por tramos (charter y Saona).
 *  Devuelve `null` si no hay tramo para ese número de personas. */
export function desglosarPorTramos(
  tabla: TramoPrecio[],
  personas: number,
  addOns: AddOn[] = [],
  addOnsElegidos: string[] = [],
  descuentos: string[] = [],
): DesgloseReserva | null {
  const tramo = tramoDe(tabla, personas)
  if (!tramo) return null

  const base = precioDeTramo(tramo, personas)
  const lineas = addOns
    .filter((a) => addOnsElegidos.includes(a.id))
    .map((a) => ({ id: a.id, etiqueta: a.etiqueta, importe: precioAddOn(a, personas) }))
  const subtotal = base + lineas.reduce((s, l) => s + l.importe, 0)
  const total = aplicarDescuentos(subtotal, descuentos)

  return { base, tramo, addOns: lineas, subtotal, descuento: subtotal - total, total }
}

/** ¿El siguiente pasajero cambia de tramo? Se usa para avisar en el widget
 *  ANTES de que el precio pegue el salto.
 *
 *  Los saltos son grandes y reales: en el Forever Teresa 4h pasar de 18 a 19
 *  personas sube el total de US$ 1.600 a US$ 2.090 (+490), porque la reserva
 *  deja de pagar «el barco» y pasa a pagar por cabeza. Sin explicación se lee
 *  como un fallo del widget y se abandona la reserva; el motivo real lo dio el
 *  cliente en la reunión del 07-24: a partir de cierto número hay que llevar
 *  más tripulación por normativa. */
export function saltoDeTramo(
  tabla: TramoPrecio[],
  personas: number,
): { desde: number; hasta: number; diferencia: number } | null {
  const actual = tramoDe(tabla, personas)
  const siguiente = tramoDe(tabla, personas + 1)
  if (!actual || !siguiente || actual === siguiente) return null

  const precioActual = precioDeTramo(actual, personas)
  const precioSiguiente = precioDeTramo(siguiente, personas + 1)
  return {
    desde: precioActual,
    hasta: precioSiguiente,
    diferencia: precioSiguiente - precioActual,
  }
}

/** Los add-ons que aplican a una ficha concreta. El álbum de fotos NO es
 *  global: la web original solo lo ofrece en semi-privado y charter, pero
 *  Samuel decidió el 07-27 extenderlo a los 6 productos porque la política
 *  real del negocio es uniforme (las mejores fotos gratis en su Facebook, el
 *  álbum completo en máxima calidad por US$ 20). El TEXTO sí cambia por
 *  producto — en charter ya regalan «todas» las fotos, así que ahí solo se
 *  vende la calidad, no el «álbum completo». */
export function addOnsDeFicha(ficha: FichaTour): AddOn[] {
  return ficha.addOns ?? []
}

/** Los add-ons que se pueden elegir AHORA: los de la ficha menos los que su
 *  `soloSubVariantes` deja fuera del barco activo (la langosta del charter solo
 *  existe en los barcos de 4 h — ver `soloSubVariantes` arriba).
 *
 *  [2026-08-07] El filtro vivía dentro de widget-reserva.tsx, con una nota que
 *  pedía mantenerlo en UN solo sitio para que el panel, el desglose y el total
 *  no pudieran discrepar. Sube aquí porque ahora hay un segundo sitio donde se
 *  marcan add-ons —la franja de la langosta del bloque de menú
 *  (tour/banner-langosta.tsx)— y la regla tiene que seguir siendo una. */
export function addOnsDisponibles(
  ficha: FichaTour,
  variante?: string | null,
  personas?: number,
): AddOn[] {
  return addOnsDeFicha(ficha).filter((a) => {
    if (a.soloSubVariantes && !(variante != null && a.soloSubVariantes.includes(variante))) {
      return false
    }
    // El tamano del grupo solo descarta si se conoce: sin `personas` se ofrece
    // todo, que es como se comportaba antes de existir esta condicion.
    if (personas == null) return true
    if (a.desdePax && personas < a.desdePax) return false
    if (a.hastaPax && personas > a.hastaPax) return false
    return true
  })
}

/** Lo que el bloque de menú necesita saber de la reserva para que su franja de
 *  extra (la langosta, en oro) sea elegible y no solo un cartel.
 *
 *  Baja desde tour.tsx, que es donde vive la selección de add-ons desde el
 *  2026-08-07 — misma mudanza que ya hicieron `variante`, `paquete` y
 *  `personas`, y por la misma razón: la columna izquierda tiene que poder tocar
 *  algo que se pinta en la derecha. */
export type SeleccionAddOns = {
  /** ids marcados en la reserva. */
  elegidos: string[]
  /** ids que el barco activo permite — la salida de `addOnsDisponibles`. */
  disponibles: string[]
  alternar: (id: string) => void
}

/** Resuelve la franja de un bloque de menú contra la selección de la reserva.
 *
 *  Devuelve las props VACÍAS —y por tanto una franja informativa, sin botón—
 *  en los tres casos en que no hay nada que marcar: la franja no declara
 *  `addOnId`, la página no pasó contexto, o el add-on no aplica al barco activo
 *  (la langosta en un charter de 3 h, cuya cocina no puede servirla). */
export function estadoDeFranja(
  addOn: { addOnId?: string } | undefined,
  seleccion?: SeleccionAddOns,
): { activo?: boolean; alternar?: () => void } {
  const id = addOn?.addOnId
  if (!id || !seleccion || !seleccion.disponibles.includes(id)) return {}
  return {
    activo: seleccion.elegidos.includes(id),
    alternar: () => seleccion.alternar(id),
  }
}
