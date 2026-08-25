// [2026-08-25, pedido de Samuel: «el selector de moneda que funcione
// correctamente en toda la web, y que esté conectada a una api gratuita para
// un cambio de moneda real»]
//
// Hasta hoy el selector del footer era decoración: un `<select>` con
// `defaultValue="USD"`, sin estado y sin handler. Elegir EUR no cambiaba un
// solo número — está escrito en su propio comentario y en `MONEDAS`.
//
// ── CÓMO ALCANZA A TODA LA WEB ───────────────────────────────────────────
// No hay que tocar 25 ficheros. Todos los precios del sitio se pintan con
// `formatoDinero()` (data/home.ts), así que la conversión vive AHÍ y el resto
// del sitio la hereda sin enterarse. Es el mismo truco que el idioma: una sola
// función por la que ya pasaba todo.
//
// El repintado también copia al idioma: `t()` no es un hook y `formatoDinero()`
// tampoco, así que un re-render normal dejaría medio sitio con los precios
// viejos (cualquier `useMemo` que ya hubiera guardado una cadena). El proveedor
// remonta el árbol — ver `proveedor-moneda.tsx` y el porqué largo en
// `lib/i18n/proveedor.tsx`.
//
// ── LO QUE NO HACE, Y ES DELIBERADO ──────────────────────────────────────
// **El cobro sigue siendo en USD.** Odoo tarifa en USD y Stripe y PayPal
// cobran en USD; esto convierte lo que se LEE, no lo que se paga. Por eso el
// resumen del checkout, cuando la moneda elegida no es el dólar, dice con
// todas las letras el importe exacto que se va a cargar. Enseñar «€1.014» y
// cobrar «US$ 1.188» sin avisar sería mentir en la única pantalla donde no se
// puede.
//
// Y si no hay tasas —la API caída, sin red, o `localStorage` bloqueado— el
// sitio se queda en USD en vez de inventarse un cambio. Un precio aproximado
// de mentira es peor que un precio en otra divisa.

import { idiomaUI } from '@/lib/i18n'

export type Moneda = 'USD' | 'EUR' | 'DOP'

export const MONEDAS_DISPONIBLES: Moneda[] = ['USD', 'EUR', 'DOP']

/** Símbolo corto para los sitios donde `Intl` es demasiado (el selector). */
export const SIMBOLO: Record<Moneda, string> = {
  USD: 'US$',
  EUR: '€',
  DOP: 'RD$',
}

const CLAVE_MONEDA = 'hispaniola.moneda'
const CLAVE_TASAS = 'hispaniola.tasas'

/** API gratuita, sin clave y con `Access-Control-Allow-Origin: *`. Publica el
 *  cambio una vez al día con base USD, que es justo la base del tarifario. */
const API_TASAS = 'https://open.er-api.com/v6/latest/USD'

/** Cada cuánto se vuelve a preguntar. La fuente actualiza a diario; 12 h deja
 *  margen sin castigar a quien entra tres veces en una tarde. */
const VIGENCIA_MS = 12 * 60 * 60 * 1000

type Tasas = { fecha: number; valores: Partial<Record<Moneda, number>> }

// Fuera de React, igual que el idioma: `formatoDinero()` se llama cientos de
// veces por render y no puede pasar por un contexto.
let actual: Moneda = 'USD'
let tasas: Tasas | null = null
const oyentes = new Set<() => void>()

// [2026-08-25] POR QUÉ HACE FALTA UN CONTADOR.
//
// El selector se suscribe con `useSyncExternalStore`, que compara la
// instantánea anterior con la nueva y NO repinta si son iguales. La moneda por
// sí sola no sirve como instantánea: cuando llegan las tasas del día, la moneda
// sigue siendo «USD» y React se ahorra el render — así que las opciones se
// quedaban deshabilitadas para siempre y el selector parecía muerto en la
// primera visita, que es justo cuando todavía no hay tasas guardadas.
//
// El contador cambia en CADA aviso, así que la instantánea del selector cambia
// también cuando lo que cambió fueron las tasas y no la moneda.
let version = 0

function avisar() {
  version += 1
  oyentes.forEach((fn) => fn())
}

function leeGuardado<T>(clave: string): T | null {
  try {
    const crudo = window.localStorage.getItem(clave)
    return crudo ? (JSON.parse(crudo) as T) : null
  } catch {
    // Safari en privado tira al leer. No es motivo para no pintar precios.
    return null
  }
}

function guarda(clave: string, valor: unknown) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin persistencia se sigue funcionando: se vuelve a pedir en la próxima
    // visita y la moneda dura lo que dure la pestaña.
  }
}

function inicial(): Moneda {
  if (typeof window === 'undefined') return 'USD'
  const guardada = leeGuardado<Moneda>(CLAVE_MONEDA)
  return guardada && MONEDAS_DISPONIBLES.includes(guardada) ? guardada : 'USD'
}

if (typeof window !== 'undefined') {
  actual = inicial()
  tasas = leeGuardado<Tasas>(CLAVE_TASAS)
}

export function monedaActiva(): Moneda {
  return actual
}

/** Instantánea para quien tiene que repintarse también al llegar las tasas —
 *  el selector. El proveedor NO usa esta: él solo remonta el árbol cuando
 *  cambia la moneda de verdad, y hacerlo por unas tasas nuevas sería tirar la
 *  página entera para nada. */
export function instantaneaMoneda(): string {
  return `${actual}|${version}`
}

/** ¿Hay cambio real para esa moneda? El selector desactiva las que no. */
export function hayTasa(moneda: Moneda): boolean {
  return moneda === 'USD' || Boolean(tasas?.valores?.[moneda])
}

export function fijaMoneda(moneda: Moneda) {
  // Sin tasa no se cambia: sería enseñar un número inventado.
  const destino = hayTasa(moneda) ? moneda : 'USD'
  if (destino === actual) return
  actual = destino
  guarda(CLAVE_MONEDA, destino)
  avisar()
}

export function escuchaMoneda(fn: () => void): () => void {
  oyentes.add(fn)
  return () => {
    oyentes.delete(fn)
  }
}

/** Fecha del cambio que se está aplicando, para poder decirlo en pantalla. */
export function fechaTasas(): Date | null {
  return tasas ? new Date(tasas.fecha) : null
}

/** Importe en USD convertido a la moneda activa. */
export function convierte(usd: number): number {
  if (actual === 'USD') return usd
  const tasa = tasas?.valores?.[actual]
  return tasa ? usd * tasa : usd
}

/** Precio listo para pintar, ya convertido.
 *
 *  `US$` y no `$` a secas para el dólar: en República Dominicana `$` es el
 *  peso, y era el rótulo que el sitio ya usaba. */
export function formatoMoneda(usd: number | null): string {
  if (usd === null) return '—'
  const valor = convierte(usd)
  const locale = idiomaUI() === 'es' ? 'es-DO' : 'en-US'
  // Los pesos no llevan céntimos en un precio comercial; el dólar y el euro sí
  // cuando los tienen.
  const decimales = actual === 'DOP' ? 0 : 2
  const numero = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  }).format(valor)
  return `${SIMBOLO[actual]} ${numero}`
}

/** El importe EXACTO que se va a cobrar, pase lo que pase con el selector.
 *  Lo usa el resumen del checkout — ver el porqué arriba. */
export function formatoUSD(usd: number | null): string {
  if (usd === null) return '—'
  const locale = idiomaUI() === 'es' ? 'es-DO' : 'en-US'
  return 'US$ ' + new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(usd)
}

let enVuelo: Promise<void> | null = null

/** Pide el cambio del día si el guardado ya no vale. Silenciosa a propósito:
 *  si falla, el sitio se queda en dólares y nadie ve un error por una divisa. */
export function cargaTasas(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const fresco = tasas && Date.now() - tasas.fecha < VIGENCIA_MS
  if (fresco) return Promise.resolve()
  enVuelo ??= fetch(API_TASAS)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('http'))))
    .then((datos: { result?: string; rates?: Record<string, number> }) => {
      if (datos.result !== 'success' || !datos.rates) throw new Error('respuesta')
      const valores: Tasas['valores'] = {}
      for (const moneda of MONEDAS_DISPONIBLES) {
        const tasa = datos.rates[moneda]
        // Una tasa de 0 o negativa es un dato roto, no un cambio.
        if (typeof tasa === 'number' && tasa > 0) valores[moneda] = tasa
      }
      tasas = { fecha: Date.now(), valores }
      guarda(CLAVE_TASAS, tasas)
      // Si la moneda guardada se quedó sin tasa, se vuelve a dólares antes de
      // que nadie llegue a leer un precio sin convertir.
      if (!hayTasa(actual)) fijaMoneda('USD')
      avisar()
    })
    .catch(() => {
      // Sin tasas nuevas se sigue con las guardadas si las hay; si no, USD.
    })
    .finally(() => {
      enVuelo = null
    })
  return enVuelo
}
