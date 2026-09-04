import { llamar, llamarSobre, enviarBaliza } from './cliente'
import { idiomaDelNavegador } from '@/lib/idioma'
import type {
  ConfigPublica, Cotizacion, Disponibilidad, Hotel, IntencionPago, ParcheCheckout,
  Paquete, Pax, Pedido, Reserva, Tour,
} from './tipos'

// Superficie completa de la API. Una funcion por endpoint, sin logica de UI.
// Los hooks de React (`use-checkout.ts`) se apoyan en esto.

// ── Catalogo ───────────────────────────────────────────────────────────────

export function obtenerConfig(signal?: AbortSignal) {
  return llamar<ConfigPublica>('/config', { signal })
}

export function obtenerCatalogo(signal?: AbortSignal) {
  return llamar<{ tours: Tour[] }>('/catalog', { signal }).then((d) => d.tours)
}

export function obtenerTour(slug: string, signal?: AbortSignal) {
  return llamar<Tour>(`/tours/${encodeURIComponent(slug)}`, { signal })
}

/** Hoteles de recogida. La lista viva la tiene Odoo: quien da de alta un
 *  hotel en el back-office lo ve aparecer en el funnel sin desplegar el front.
 *  `data/hoteles.ts` es la instantanea que se pinta mientras esto viaja. */
export function obtenerHoteles(signal?: AbortSignal) {
  return llamar<{ hotels: Hotel[] }>('/hotels', { signal }).then((d) => d.hotels)
}

export function obtenerDisponibilidad(
  params: { tour: string; variante?: string | null; desde?: string; hasta?: string; pax?: number },
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams({ tour: params.tour })
  if (params.variante) qs.set('variant', params.variante)
  if (params.desde) qs.set('from', params.desde)
  if (params.hasta) qs.set('to', params.hasta)
  if (params.pax) qs.set('pax', String(params.pax))
  return llamar<Disponibilidad>(`/availability?${qs.toString()}`, { signal })
}

// ── Tarifas ────────────────────────────────────────────────────────────────

export type PeticionCotizacion = {
  tour: string
  variante?: string | null
  pax: Pax
  paquete?: Paquete
  /** Los niños al menú Premium de adulto. El servidor cobra el mismo salto que
   *  al adulto por cada uno, en su propia línea del desglose. */
  ninosPremium?: boolean
  addons?: string[]
  descuentos?: string[]
  promo?: string
  fecha?: string | null
}

/** Precio autoritativo. Llamar a esto en vez de recalcular en el front es lo
 *  que cierra el desvio que documenta el README del front: el checkout cobraba
 *  `(precioLight + upgrade) x personas` para los cuatro tours, y en el charter
 *  de 30 pax eso eran US$ 5.520 contra los US$ 1.950 reales de la tabla. */
export function cotizar(peticion: PeticionCotizacion, signal?: AbortSignal) {
  return llamar<Cotizacion>('/quote', {
    metodo: 'POST',
    signal,
    cuerpo: {
      tour: peticion.tour,
      variant: peticion.variante ?? null,
      pax: peticion.pax,
      package: peticion.paquete ?? 'light',
      children_premium: peticion.ninosPremium ?? false,
      addons: peticion.addons ?? [],
      discounts: peticion.descuentos ?? [],
      promo_code: peticion.promo,
      date: peticion.fecha ?? null,
    },
  })
}

// ── Checkout ───────────────────────────────────────────────────────────────

export type InicioCheckout = {
  tour: string
  variante?: string | null
  paquete?: Paquete
  ninosPremium?: boolean
  pax?: Pax
  fecha?: string | null
  scheduleIndex?: number
  /** Extras elegidos en la ficha. Odoo descarta los que ese barco no ofrece. */
  addons?: string[]
  /** Los descuentos que el visitante ha elegido (hoy solo «efectivo»). Se
   *  manda SIEMPRE, vacio incluido: el pedido se reutiliza entre visitas y sin
   *  esto arrastraba el efectivo de una sesion anterior. */
  descuentos?: string[]
}

/** Abre el pedido. **Llamar al ENTRAR en /book/:slug, no al pagar.**
 *
 *  Es lo que cumple el requisito del proyecto: desde este momento la reserva
 *  existe en Odoo en estado *Pending*. Si el visitante se va, si la tarjeta
 *  falla o si nunca vuelve, el registro sigue ahi.
 *
 *  `idempotencia` evita que recargar la pestana cree un pedido nuevo: pasar
 *  siempre la misma clave por sesion de checkout. */
export function abrirCheckout(inicio: InicioCheckout, idempotencia?: string) {
  return llamar<Pedido>('/checkout/start', {
    metodo: 'POST',
    idempotencia,
    cuerpo: {
      tour: inicio.tour,
      variant: inicio.variante ?? null,
      package: inicio.paquete ?? 'light',
      children_premium: inicio.ninosPremium ?? false,
      pax: inicio.pax ?? { adults: 2 },
      date: inicio.fecha ?? null,
      schedule_index: inicio.scheduleIndex ?? 0,
      addons: inicio.addons ?? [],
      // [2026-09-01, Derick: «el porcentaje del efectivo todavia no le habia
      // dado click»] El pedido se reutiliza entre visitas, y si en una sesion
      // anterior se marco «pago en efectivo» el servidor seguia aplicandolo
      // aunque la casilla saliera desmarcada. Se manda siempre el estado
      // actual —vacio incluido— para que el pedido diga lo mismo que la
      // pantalla.
      discounts: inicio.descuentos ?? [],
      step: 'start',
      meta: metaOrigen(),
    },
  })
}

/** Guardado parcial. Se puede llamar en cada paso o con un debounce: es
 *  idempotente y hace merge, no reemplazo. */
export async function sincronizarCheckout(
  codigo: string,
  token: string,
  parche: ParcheCheckout,
): Promise<{ pedido: Pedido; aforoOk: boolean }> {
  // `capacity_ok` viaja FUERA de `data` (ver `llamarSobre`), asi que aqui se
  // usa el sobre entero. Es un aviso, no un bloqueo: el corte de verdad lo
  // hace `/pay` con un 409.
  const sobre = await llamarSobre<Pedido>(`/checkout/${encodeURIComponent(codigo)}/sync`, {
    metodo: 'POST',
    token,
    cuerpo: { ...parche, meta: parche.meta ?? metaOrigen() },
  })
  return { pedido: sobre.data, aforoOk: sobre.capacity_ok !== false }
}

export function leerCheckout(codigo: string, token: string, signal?: AbortSignal) {
  return llamar<Pedido>(`/checkout/${encodeURIComponent(codigo)}`, { token, signal })
}

/** Aviso de salida. No borra nada: solo marca el pedido como abandonado para
 *  que el equipo sepa a quien llamar. */
export function abandonarCheckout(codigo: string, token: string, motivo = 'left the checkout') {
  enviarBaliza(`/checkout/${encodeURIComponent(codigo)}/abandon`, { reason: motivo }, token)
}

// ── Pagos ──────────────────────────────────────────────────────────────────

export function crearPago(
  codigo: string,
  token: string,
  opciones: { proveedor?: 'stripe' | 'paypal'; tipo?: 'deposit' | 'full' } = {},
) {
  return llamar<IntencionPago>(`/checkout/${encodeURIComponent(codigo)}/pay`, {
    metodo: 'POST',
    token,
    idempotencia: `${codigo}-${opciones.tipo ?? 'deposit'}`,
    cuerpo: { provider: opciones.proveedor ?? 'stripe', kind: opciones.tipo ?? 'deposit' },
  })
}

/** Confirmacion tras el pago. El backend NO se fia del navegador: vuelve a
 *  preguntarle a la pasarela. El webhook es la fuente autoritativa, pero puede
 *  tardar; esto permite pintar la pantalla de gracias ya correcta. */
export function confirmarPago(
  codigo: string,
  token: string,
  ids: { paymentIntentId?: string; paypalOrderId?: string } = {},
) {
  return llamar<{ code: string; state: string; payment: unknown; reservation: Reserva | null }>(
    `/checkout/${encodeURIComponent(codigo)}/confirm`,
    {
      metodo: 'POST',
      token,
      cuerpo: {
        payment_intent_id: ids.paymentIntentId,
        paypal_order_id: ids.paypalOrderId,
      },
    },
  )
}

export function pagarSaldo(codigo: string, token: string) {
  return llamar<IntencionPago>(`/bookings/${encodeURIComponent(codigo)}/pay-balance`, {
    metodo: 'POST',
    token,
    cuerpo: {},
  })
}

// ── Mi reserva ─────────────────────────────────────────────────────────────

/** Consulta por codigo + email.
 *
 *  El codigo por si solo NO basta a proposito: sin esa segunda prueba,
 *  cualquiera que adivinara un HSP-XXXX-NNNN veria el nombre, el telefono y el
 *  hotel de un cliente. La pantalla actual del front no valida nada y siempre
 *  devuelve la reserva demo. */
export function buscarReserva(
  codigo: string,
  email: string,
  signal?: AbortSignal,
  token?: string | null,
) {
  return llamar<{ booking: Reserva; token: string }>('/bookings/lookup', {
    metodo: 'POST',
    signal,
    // El `token` es la otra llave que acepta el backend, y la unica que sirve
    // cuando se llego aqui por telefono: esa reserva puede no tener email con
    // el que comprobar nada, y sin llave no habria forma de RECARGARLA
    // despues de pagar el saldo.
    cuerpo: {
      code: codigo.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      ...(token ? { token } : {}),
    },
  })
}

/** Busca la reserva SOLO con el email o SOLO con el telefono.
 *
 *  ⚠️ Sin segunda prueba: el dato que se teclea ES la credencial. Es una
 *  decision explicita del cliente (2026-08-19) para que nadie tenga que ir a
 *  buscar su codigo al correo; lo que implica esta escrito en el endpoint
 *  (`/bookings/find` en hispaniola_web). `buscarReserva` de aqui arriba, la de
 *  los enlaces del voucher, sigue exigiendo codigo + email.
 *
 *  Devuelve UNA reserva —la proxima que navega— y cuantas tiene esa persona,
 *  para poder mandarla al area privada si son varias. */
export function buscarReservaPorContacto(
  contacto: { email: string } | { phone: string },
  signal?: AbortSignal,
) {
  return llamar<{ booking: Reserva; token: string; total: number }>('/bookings/find', {
    metodo: 'POST',
    signal,
    cuerpo: 'email' in contacto
      ? { email: contacto.email.trim().toLowerCase() }
      : { phone: contacto.phone.trim() },
  })
}

/** Cambios del cliente sobre una reserva YA EMITIDA (menu y recogida).
 *
 *  No vale `/checkout/:code/sync` para esto: ese endpoint rechaza los pedidos
 *  cerrados con `order_closed`, que es justo lo que es una reserva pagada. Va
 *  contra el pedido igualmente —es la fuente— y Odoo vuelca el cambio a la
 *  reserva, que es lo que ve la tripulacion. */
export function actualizarReserva(
  codigo: string,
  token: string,
  cambios: {
    dishes?: string[]
    pickup?: { hotel?: string; room?: string; notes?: string }
    /** Nombre y teléfono. El EMAIL no se puede cambiar por aquí: es la
     *  credencial con la que se entra a «Mi reserva». */
    contact?: { first_name?: string; last_name?: string; phone?: string }
  },
) {
  return llamar<{ booking: Reserva; changed: string[] }>(
    `/bookings/${encodeURIComponent(codigo)}/update`,
    { metodo: 'POST', token, cuerpo: cambios },
  )
}

export function cancelarReserva(codigo: string, opciones: { email?: string; token?: string; motivo?: string }) {
  return llamar<{ booking: Reserva; status: 'cancelled' | 'requested'; message?: string }>(
    `/bookings/${encodeURIComponent(codigo)}/cancel`,
    {
      metodo: 'POST',
      token: opciones.token ?? null,
      cuerpo: { email: opciones.email, reason: opciones.motivo },
    },
  )
}

/** URL del .ics. Es lo unico de la lista de pendientes del front que se
 *  resuelve sin pasarela. */
export function urlCalendario(codigo: string, opciones: { email?: string; token?: string } = {}) {
  const qs = new URLSearchParams()
  if (opciones.email) qs.set('email', opciones.email)
  if (opciones.token) qs.set('token', opciones.token)
  const cola = qs.toString()
  return `${import.meta.env?.VITE_API_URL ?? 'http://localhost:8069'}` +
    `/api/web/v1/bookings/${encodeURIComponent(codigo)}/calendar.ics${cola ? `?${cola}` : ''}`
}

// ── Formularios ────────────────────────────────────────────────────────────

export type CotizacionEvento = {
  slug: 'party-boat' | 'weddings' | 'corporate'
  contacto: { nombre: string; email?: string; whatsapp?: string }
  tipoEvento?: string
  fecha?: string
  personas?: number
  mensaje?: string
  /** Nombre del paquete que el visitante dejó marcado en la landing. */
  paquete?: string
  /** Honeypot: campo oculto que ningun humano rellena. */
  honeypot?: string
}

export function enviarCotizacionEvento(datos: CotizacionEvento) {
  return llamar<{ code: string; state: string }>('/event-quotes', {
    metodo: 'POST',
    cuerpo: {
      slug: datos.slug,
      contact: {
        name: datos.contacto.nombre,
        email: datos.contacto.email,
        whatsapp: datos.contacto.whatsapp,
      },
      event_type: datos.tipoEvento,
      // [2026-08-25] `package` lo esperaba Odoo desde el primer día
      // (`package_name` en `haa.event.quote`) y el front no lo mandaba nunca:
      // la solicitud llegaba al equipo sin decir qué paquete había marcado el
      // visitante, que es la mitad de lo que hace falta para cotizarle.
      package: datos.paquete,
      date: datos.fecha,
      guests: datos.personas,
      message: datos.mensaje,
      website: datos.honeypot,
      meta: metaOrigen(),
    },
  })
}

export type TipoFormulario =
  | 'contact' | 'agents' | 'careers' | 'newsletter' | 'comment' | 'how_found' | 'review' | 'other'

export function enviarFormulario(tipo: TipoFormulario, datos: Record<string, unknown>) {
  return llamar<{ received: boolean }>('/leads', {
    metodo: 'POST',
    cuerpo: { kind: tipo, ...datos, meta: metaOrigen() },
  })
}

export function suscribirNewsletter(email: string, honeypot?: string) {
  return llamar<{ received: boolean }>('/newsletter', {
    metodo: 'POST',
    cuerpo: { email, website: honeypot, meta: metaOrigen() },
  })
}

// ── Utilidades ─────────────────────────────────────────────────────────────

/** De donde viene la visita. Sin esto, «¿de donde salen las reservas?» no
 *  tiene respuesta en Odoo. */
export function metaOrigen() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    url: window.location.href,
    referrer: document.referrer || undefined,
    utm_source: params.get('utm_source') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    // El idioma REAL del visitante, no el `lang` del <html> (que es fijo:
    // el sitio está en inglés). Es lo que decide en qué lengua recibe sus
    // correos si no elige otra cosa en el paso de contacto.
    language: idiomaDelNavegador(),
  }
}

export { ErrorApi } from './cliente'
export type * from './tipos'
