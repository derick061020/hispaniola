// DE QUÉ CAMPAÑA VIENE ESTA VISITA — y que sobreviva a la navegación.
//
// [2026-09-14, pedido del cliente vía Samuel: «cómo podemos asignar las ventas
// de una campaña, y que en Odoo aparezca» — con nombres tipo
// `HAA_META_VENTAS-CORAL_QUEST_2026-09`]
//
// La web ya mandaba `utm_source/medium/campaign` a Odoo (`metaOrigen()` en
// lib/api/api.ts), pero los leía de la URL EN EL MOMENTO de llamar a la API.
// El anuncio aterriza en `/tours/coral-quest?utm_campaign=…`, el visitante
// pulsa «Book» y en `/book/coral-quest` los parámetros ya no están: de 196
// pedidos en producción solo uno (de prueba) tenía UTM. La atribución se
// perdía en el primer clic.
//
// Aquí se guardan la PRIMERA vez que aparecen en la URL y se reutilizan en
// todas las llamadas de esa visita, hasta 30 días (la ventana larga de
// atribución de Meta). Una visita nueva CON parámetros pisa a la anterior:
// manda el último anuncio en el que hizo clic, que es como lo cuenta Meta.
//
// `fbclid` es el identificador de clic que Meta añade a todo enlace que sale
// de Facebook/Instagram, con o sin UTM. Si llega solo, se anota al menos que
// la visita viene de Meta: mejor «meta / social» que «Directo».

export type OrigenVisita = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  /** En Meta, el nombre del anuncio (`{{ad.name}}`). */
  utm_content?: string
  /** En Meta, el conjunto de anuncios (`{{adset.name}}`). */
  utm_term?: string
  /** Primera página en la que aterrizó con estos parámetros. */
  landing?: string
  /** ISO. Para caducar. */
  desde?: string
}

const CLAVE = 'hispaniola.origen-visita'

// localStorage puede estar lleno, bloqueado (navegación privada, políticas
// de cookies) o no existir: nunca es motivo para romper la página.
function leerLocal<T>(clave: string): T | null {
  try {
    const bruto = window.localStorage.getItem(clave)
    return bruto ? (JSON.parse(bruto) as T) : null
  } catch {
    return null
  }
}

function escribirLocal(clave: string, valor: unknown) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // silencioso a propósito
  }
}

const DIAS_VIGENCIA = 30
const CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

function limpio(valor: string | null): string | undefined {
  const v = (valor ?? '').trim().slice(0, 128)
  return v || undefined
}

/** Lee los parámetros de la URL actual. Vacío si no trae ninguno. */
function origenDeLaUrl(): OrigenVisita | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const origen: OrigenVisita = {}
  for (const campo of CAMPOS) {
    const v = limpio(params.get(campo))
    if (v) origen[campo] = v
  }
  // Clic desde Facebook/Instagram sin UTM: al menos la fuente.
  if (!origen.utm_source && params.get('fbclid')) {
    origen.utm_source = 'meta'
    origen.utm_medium = origen.utm_medium ?? 'social'
  }
  if (!origen.utm_source && params.get('gclid')) {
    origen.utm_source = 'google'
    origen.utm_medium = origen.utm_medium ?? 'cpc'
  }
  if (Object.keys(origen).length === 0) return null
  origen.landing = window.location.pathname + window.location.search
  origen.desde = new Date().toISOString()
  return origen
}

function vigente(origen: OrigenVisita | null): origen is OrigenVisita {
  if (!origen?.desde) return false
  const edadMs = Date.now() - new Date(origen.desde).getTime()
  return edadMs >= 0 && edadMs < DIAS_VIGENCIA * 86_400_000
}

/** Llamar UNA vez al arrancar la app: si la URL trae parámetros de campaña,
 *  los guarda para el resto de la visita. */
export function recordarOrigenVisita() {
  const nuevo = origenDeLaUrl()
  if (nuevo) escribirLocal(CLAVE, nuevo)
}

/** El origen que se manda a Odoo: lo que traiga la URL ahora mismo, y si no,
 *  lo guardado al aterrizar (mientras no haya caducado). */
export function origenVisita(): OrigenVisita {
  const actual = origenDeLaUrl()
  if (actual) return actual
  const guardado = leerLocal<OrigenVisita>(CLAVE)
  return vigente(guardado) ? guardado : {}
}
