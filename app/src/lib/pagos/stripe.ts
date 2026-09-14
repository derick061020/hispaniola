import { t } from '@/lib/i18n'
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

// [2026-09-14, pedido del cliente: «Apple Pay, Google Pay, Link, Cash App
// Pay… que Stripe muestre automáticamente los métodos compatibles según el
// dispositivo… confirmen que usan Payment Element y no una integración
// antigua»] Hasta hoy ERA la integración antigua: `elements().create('card')`
// + `confirmCardPayment`, que solo sabe de tarjeta. Los wallets solo existen
// en la generación nueva de Stripe.js: PAYMENT ELEMENT (un solo elemento que
// pinta tarjeta, Link, Cash App… según lo que la cuenta tenga activo y el
// navegador soporte) y EXPRESS CHECKOUT ELEMENT (los botones de Apple Pay /
// Google Pay / Link arriba del todo, para pagar en un toque sin teclear una
// tarjeta). Aquí se añaden los tipos de las dos y `confirmPayment`, que es el
// cierre común. `CampoTarjeta`/`confirmCardPayment` se quedan declarados por
// si hay que volver atrás, pero ya nadie los monta.

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

/** Payment Element: tarjeta + Link + Cash App + lo que la cuenta tenga. */
export type ElementoPago = {
  mount(nodo: HTMLElement | string): void
  unmount(): void
  destroy(): void
  collapse(): void
  on(evento: 'change', cb: (e: CambioPago) => void): void
  on(evento: 'ready' | 'loaderror', cb: (e: { error?: { message?: string } }) => void): void
}

export type CambioPago = {
  complete: boolean
  empty: boolean
  /** 'card', 'link', 'cashapp', 'apple_pay'… — lo que el visitante tiene abierto. */
  value?: { type?: string }
}

/** Express Checkout Element: los botones de Apple Pay / Google Pay / Link. */
export type ElementoExpress = {
  mount(nodo: HTMLElement | string): void
  unmount(): void
  destroy(): void
  on(evento: 'ready', cb: (e: { availablePaymentMethods?: Record<string, boolean> }) => void): void
  on(evento: 'click', cb: (e: EventoClickExpress) => void): void
  on(evento: 'confirm', cb: (e: EventoConfirmExpress) => void): void
  on(evento: 'cancel', cb: () => void): void
  on(evento: 'loaderror', cb: (e: { error?: { message?: string } }) => void): void
}

export type EventoClickExpress = {
  expressPaymentType: string
  /** Hay que llamarlo SÍNCRONO (Apple Pay no abre la hoja si se tarda). */
  resolve(opciones?: Record<string, unknown>): void
}

export type EventoConfirmExpress = {
  expressPaymentType: string
  billingDetails?: { name?: string; email?: string; phone?: string }
  paymentFailed(opciones?: { reason?: 'fail' | 'invalid_shipping_address' | 'invalid_billing_address' }): void
}

export type Elements = {
  create(tipo: 'card', opciones?: Record<string, unknown>): CampoTarjeta
  create(tipo: 'payment', opciones?: Record<string, unknown>): ElementoPago
  create(tipo: 'expressCheckout', opciones?: Record<string, unknown>): ElementoExpress
  /** Cambiar el importe (o el modo) sin remontar. */
  update(opciones: Record<string, unknown>): void
  /** Valida lo tecleado ANTES de crear el intento en el servidor. */
  submit(): Promise<{ error?: { message?: string; code?: string } }>
}

export type ResultadoPago = {
  error?: { message?: string; code?: string; decline_code?: string; type?: string }
  paymentIntent?: { id: string; status: string }
}

export type Stripe = {
  elements(opciones?: Record<string, unknown>): Elements
  confirmCardPayment(clientSecret: string, datos?: Record<string, unknown>): Promise<ResultadoPago>
  /** Cierre común de Payment Element y Express Checkout. Con
   *  `redirect: 'if_required'` solo sale del sitio para los métodos que lo
   *  exigen (Cash App en móvil abre la app y vuelve por `return_url`). */
  confirmPayment(opciones: {
    elements: Elements
    clientSecret?: string
    confirmParams: Record<string, unknown>
    redirect?: 'if_required' | 'always'
  }): Promise<ResultadoPago>
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
      rechazar(new Error(t('Stripe.js could not be loaded.')))
    })
  })
  return sdk
}

// Una instancia por clave publicable. `Stripe(clave)` es caro y crear dos
// instancias con la misma clave duplica los iframes.
const instancias = new Map<string, Stripe>()

export async function cargarStripe(clavePublicable: string): Promise<Stripe> {
  if (!clavePublicable) throw new Error(t('Stripe is not configured.'))
  const cacheada = instancias.get(clavePublicable)
  if (cacheada) return cacheada

  await cargarSdk()
  if (!window.Stripe) throw new Error(t('Stripe.js could not be loaded.'))
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

/** Apariencia de Payment Element / Express Checkout con los tokens de marca.
 *
 *  Los elementos viven en iframes de Stripe: no ven nuestro CSS, así que se
 *  les pasan los colores y radios como VALORES, leídos de `tokens.css` (el hex
 *  sigue viviendo solo allí). Tema `stripe` como base y encima lo nuestro:
 *  aqua para el foco y las selecciones, coral para errores, navy para el texto,
 *  los mismos bordes hairline y el radio de los botones del sitio.
 *
 *  Tipografía: sistema, por lo mismo que `estiloCampoTarjeta`. */
export function aparienciaStripe(): Record<string, unknown> {
  const linea = token('--color-linea')
  return {
    theme: 'stripe',
    labels: 'above',
    variables: {
      colorPrimary: token('--color-aqua-dark'),
      colorBackground: token('--color-papel'),
      colorText: token('--color-navy'),
      colorTextSecondary: token('--color-navy-sub'),
      colorTextPlaceholder: token('--color-navy-soft'),
      colorDanger: token('--color-coral'),
      colorIcon: token('--color-navy-soft'),
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontSizeBase: '16px', // <16px hace que iOS haga zoom al enfocar
      borderRadius: token('--radius-btn'),
      spacingUnit: '4px',
      focusBoxShadow: 'none',
      focusOutline: `2px solid ${token('--color-aqua') ?? 'currentColor'}`,
    },
    rules: {
      '.Input': { border: `1px solid ${linea}`, boxShadow: 'none', padding: '12px 16px' },
      '.Input:focus': { border: `1px solid ${token('--color-aqua')}` },
      '.Input--invalid': { border: `1px solid ${token('--color-coral')}`, boxShadow: 'none' },
      '.Label': { fontWeight: '500', fontSize: '14px', marginBottom: '6px' },
      '.Tab': { border: `1px solid ${linea}`, boxShadow: 'none' },
      '.Tab--selected': { border: `1px solid ${token('--color-aqua')}`, backgroundColor: token('--color-aqua-tint'), boxShadow: 'none' },
      '.Tab:focus': { boxShadow: 'none' },
      '.AccordionItem': { border: `1px solid ${linea}`, boxShadow: 'none', padding: '12px 16px' },
      '.AccordionItem--selected': { border: `1px solid ${token('--color-aqua')}`, backgroundColor: token('--color-aqua-tint') },
      '.Block': { border: `1px solid ${linea}`, boxShadow: 'none' },
      '.Error': { fontSize: '12px' },
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
        ? t('Your card was declined for insufficient funds. Try another card.')
        : t('Your card was declined. Try another card or use PayPal.')
    case 'expired_card':
      return t('That card has expired. Check the expiry date or try another card.')
    case 'incorrect_cvc':
      return t('The security code (CVC) is not correct.')
    case 'processing_error':
      return t('The bank could not process the card right now. Try again in a moment.')
    default:
      return error.message || t('The payment could not be completed.')
  }
}
