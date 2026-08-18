// Carga de Stripe.js v3 y los tipos mínimos que usa el checkout.
//
// [2026-08-14] Se añade al portar a Hispaniola los MISMOS medios de pago que
// tiene el checkout de Eclipse (`form_checkout.html`): tarjeta por Stripe
// Elements + PayPal. El backend (`hispaniola_web`) ya servía los dos desde el
// 2026-08-10; lo que faltaba era la interfaz.
//
// ⚠️ El script se carga DESDE js.stripe.com, nunca desde node_modules ni desde
// nuestro bundle. No es una preferencia: es lo que mantiene los datos de la
// tarjeta dentro del iframe de Stripe y a nosotros en PCI-DSS SAQ A. Servir una
// copia propia de Stripe.js invalida ese alcance.
//
// Por qué a mano y no `@stripe/stripe-js`: ese paquete hace exactamente esto
// —inyectar el <script> y esperar al global— y una dependencia menos es una
// dependencia menos. Es además lo que hace Eclipse (form_checkout.html:852).

const URL_SDK = 'https://js.stripe.com/v3/'

// ── Tipos mínimos ──────────────────────────────────────────────────────────
// Solo lo que tocamos. Stripe.js no trae tipos si no instalas su paquete, y
// declarar la superficie entera para usar tres métodos sería peor.

export type CampoTarjeta = {
  mount(nodo: HTMLElement | string): void
  unmount(): void
  destroy(): void
  clear(): void
  on(evento: 'change', cb: (e: CambioTarjeta) => void): void
}

export type CambioTarjeta = {
  /** true cuando número, caducidad y CVC están completos y son válidos. */
  complete: boolean
  empty: boolean
  error?: { message: string; code?: string }
}

type Elements = {
  create(tipo: 'card', opciones?: Record<string, unknown>): CampoTarjeta
}

export type ResultadoPago = {
  error?: { message?: string; code?: string; decline_code?: string }
  paymentIntent?: { id: string; status: string }
}

export type Stripe = {
  elements(opciones?: Record<string, unknown>): Elements
  confirmCardPayment(clientSecret: string, datos?: Record<string, unknown>): Promise<ResultadoPago>
}

declare global {
  interface Window {
    Stripe?: (clave: string) => Stripe
  }
}

// ── Carga ──────────────────────────────────────────────────────────────────

let sdk: Promise<void> | null = null

/** Inyecta Stripe.js una sola vez, aunque se llame desde varios sitios. */
function cargarSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No browser.'))
  if (window.Stripe) return Promise.resolve()
  if (sdk) return sdk

  sdk = new Promise<void>((resolver, rechazar) => {
    const existente = document.querySelector<HTMLScriptElement>(`script[src="${URL_SDK}"]`)
    const script = existente ?? document.createElement('script')
    if (!existente) {
      script.src = URL_SDK
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolver())
    script.addEventListener('error', () => {
      // Se olvida la promesa fallida: un bloqueador de anuncios o una caída de
      // red no pueden dejar el checkout muerto para siempre. El siguiente
      // intento vuelve a probar.
      sdk = null
      rechazar(new Error('Stripe.js could not be loaded.'))
    })
  })
  return sdk
}

// Una instancia por clave publicable. `Stripe(clave)` es caro y crear dos
// instancias con la misma clave duplica los iframes.
const instancias = new Map<string, Stripe>()

export async function cargarStripe(clavePublicable: string): Promise<Stripe> {
  if (!clavePublicable) throw new Error('Stripe is not configured.')
  const cacheada = instancias.get(clavePublicable)
  if (cacheada) return cacheada

  await cargarSdk()
  if (!window.Stripe) throw new Error('Stripe.js could not be loaded.')
  const instancia = window.Stripe(clavePublicable)
  instancias.set(clavePublicable, instancia)
  return instancia
}

// ── Estilo del campo ───────────────────────────────────────────────────────

/** Lee un token del tema. El campo de la tarjeta vive en un iframe de Stripe:
 *  no hereda nuestro CSS, hay que pasarle los colores como valores. Esta es la
 *  única forma de respetar la regla de «cero hex en componentes» aquí — el hex
 *  sigue viviendo solo en `styles/tokens.css`. */
function token(nombre: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  return valor || undefined
}

/** Estilo del `card` element, construido con los tokens del tema.
 *
 *  ⚠️ La tipografía NO se pasa: el iframe no ve las fuentes que servimos desde
 *  `@fontsource`, así que Poppins no resolvería. Stripe permite cargarla con
 *  `elements({fonts: [{cssSrc}]})`, pero eso exige una URL pública (Google
 *  Fonts) y el sitio autoaloja las fuentes a propósito. Se deja el stack del
 *  sistema: son dígitos, y la alternativa es una petición a Google en el paso
 *  de pago. */
export function estiloCampoTarjeta(): Record<string, unknown> {
  return {
    base: {
      fontSize: '16px', // <16px hace que iOS haga zoom al enfocar el campo
      fontFamily: 'system-ui, sans-serif',
      color: token('--color-navy'),
      iconColor: token('--color-aqua'),
      '::placeholder': { color: token('--color-navy-soft') },
    },
    invalid: {
      color: token('--color-coral'),
      iconColor: token('--color-coral'),
    },
  }
}

/** Mensaje de error de Stripe en algo que un cliente pueda leer.
 *
 *  Se ramifica por `code`, no por el texto: el texto es copy de Stripe y puede
 *  cambiar, igual que hacemos con `ErrorApi.codigo` en la capa de API. */
export function mensajeDeError(error: { message?: string; code?: string; decline_code?: string }): string {
  switch (error.code) {
    case 'card_declined':
      return error.decline_code === 'insufficient_funds'
        ? 'Your card was declined for insufficient funds. Try another card.'
        : 'Your card was declined. Try another card or use PayPal.'
    case 'expired_card':
      return 'That card has expired. Check the expiry date or try another card.'
    case 'incorrect_cvc':
      return 'The security code (CVC) is not correct.'
    case 'processing_error':
      return 'The bank could not process the card right now. Try again in a moment.'
    default:
      return error.message || 'The payment could not be completed.'
  }
}
