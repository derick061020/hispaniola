// Tipos del contrato con Odoo. Espejo exacto de lo que devuelve
// `hispaniola_web`; si aqui algo no cuadra con el backend, manda el backend.
//
// Convencion del repo del front: nombres de archivo y comentarios en espanol,
// UI en ingles. Los nombres de campo son los del JSON (ingles) a proposito: son
// contrato, no copy.

export type Moneda = 'USD'
export type Paquete = 'light' | 'premium'
export type BaseAddOn = 'person' | 'group'
export type ModeloPrecio = 'flat' | 'dual' | 'tiers' | 'marginal'
export type ModoReserva = 'full' | 'quote' | 'inquiry'
export type Turno = 'am' | 'pm'

/** Sobre comun de todas las respuestas. El `error` es un codigo ESTABLE:
 *  ramificar por el, nunca por el `message` (que es texto para humanos). */
export type RespuestaOk<T> = { ok: true; data: T } & Record<string, unknown>
export type RespuestaError = { ok: false; error: string; message: string } & Record<string, unknown>
export type Respuesta<T> = RespuestaOk<T> | RespuestaError

/** Hotel de recogida tal y como lo gestiona el back-office (`haa.hotel`).
 *  El funnel ofrece ESTOS y no una lista propia: un nombre escrito a mano no
 *  casa con ninguna ficha, y sin ficha no hay tabla de recogidas. */
export type Hotel = {
  id: number
  name: string
  zone: string
}

export type Tramo = {
  from: number
  to: number | null
  price: number
  kind: 'group' | 'person'
  note: string | null
  /** Suplemento POR PERSONA que acompaña a la tarifa de grupo — el «Extra
   *  Price» de Odoo. Solo viene relleno en los tramos `group`: cuando el precio
   *  pasa a ser por cabeza, el extra ya no se cobra. */
  extra_per_pax?: number | null
}

export type Horario = {
  departure: string
  back: string | null
  slot: Turno
}

export type Variante = {
  slug: string
  name: string
  description: string | null
  capacity_label: string | null
  duration_label: string | null
  /** Numerico a proposito: decidir la carta comparando el TEXTO ("3 hours")
   *  ya rompio una vez en el front. */
  duration_hours: number | null
  photo: string | null
  min_pax: number
  capacity: number | null
  tiers: Tramo[]
  schedules: Horario[]
}

export type AddOn = {
  slug: string
  label: string
  description: string | null
  note: string | null
  base: BaseAddOn
  price: number
  default_on: boolean
  /** Slugs de variante a las que aplica. Vacio = a todas. */
  only_variants: string[]
  /** Condicion por tamano de grupo. null = sin limite por ese lado. */
  min_pax?: number | null
  max_pax?: number | null
}

export type Tour = {
  slug: string
  id: number
  name: string
  short_description: string | null
  photo: string | null
  audience: string | null
  duration: string | null
  rating: number | null
  reviews: number | null
  zone: string | null
  booking_mode: ModoReserva
  pricing_model: ModeloPrecio
  max_pax: number | null
  adult_price: number | null
  child_price: number | null
  premium_upgrade: number | null
  deposit_pct: number
  infants_are_free: boolean
  min_days_ahead: number
  max_days_ahead: number | null
  schedules: Horario[]
  variants: Variante[]
  addons: AddOn[]
  tiers?: Tramo[]
  marginal?: { included_pax: number; extra_price: number }
  included?: string[]
  bring?: string[]
  terms?: { title: string; body: string }[]
}

export type Pax = {
  adults: number
  children?: number
  infants?: number
}

export type LineaPrecio = {
  label: string
  quantity: number
  unit_price: number
  amount: number
}

export type LineaAddOn = {
  slug: string
  label: string
  base: BaseAddOn
  unit_price: number
  quantity: number
  amount: number
}

export type DescuentoAplicado = {
  id: string
  label: string
  pct: number
  /** false = se propone pero no se aplica: nadie puede verificarlo sin cuentas
   *  (el caso de «ya he venido»). Lo confirma el equipo. */
  granted: boolean
}

/** El desglose que devuelve el servidor. **Es la unica autoridad de precio.**
 *  El front puede seguir calculando para pintar rapido, pero lo que se cobra
 *  y lo que se guarda en Odoo sale de aqui. */
export type Cotizacion = {
  ok: boolean
  currency: Moneda
  pricing_model: ModeloPrecio
  package: Paquete
  pax: { adults: number; children: number; infants: number; total: number; billable: number }
  variant: string | null
  tier: Tramo | null
  lines: LineaPrecio[]
  base: number
  addons: LineaAddOn[]
  addons_total: number
  subtotal: number
  discounts: DescuentoAplicado[]
  discount_pct: number
  discount_amount: number
  promo: { code: string; amount: number } | null
  total: number
  deposit_pct: number
  deposit: number
  balance: number
}

export type EstadoPedido =
  | 'draft'
  | 'abandoned'
  | 'pending_payment'
  | 'payment_failed'
  | 'paid'
  | 'confirmed'
  | 'cancelled'

export type Pedido = {
  code: string
  reference: string
  state: EstadoPedido
  step: string | null
  tour: string | null
  tour_name: string | null
  variant: string | null
  variant_name: string | null
  package: Paquete
  date: string | null
  schedule_index: number
  departure: string | null
  back: string | null
  pax: { adults: number; children: number; infants: number; total: number }
  contact: { first_name: string; last_name: string; email: string; phone: string; country: string }
  pickup: { hotel: string; room: string; notes: string; time: string }
  occasion: string | null
  occasion_note: string | null
  how_found: string | null
  dishes: { guest: number; dish: string }[]
  addons: string[]
  amounts: {
    currency: Moneda
    base: number
    addons: number
    discount: number
    total: number
    deposit: number
    balance: number
    paid: number
  }
  quote: Partial<Cotizacion>
  payment_status: string | null
  reservation_status: string | null
  created_at: string | null
  /** Solo lo devuelve `start`. Guardarlo: sin el no se puede seguir editando
   *  el checkout. */
  token?: string
}

export type Reserva = {
  code: string
  reservation_number: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: string
  tour: { slug: string | null; name: string; photo: string | null; duration: string | null; audience: string | null }
  variant: string | null
  package: Paquete | null
  date: string | null
  pickup_time: string | null
  pax: { adults: number; children: number; infants: number; total: number }
  dishes: { guest: number; dish: string }[]
  addons: { name: string; quantity: number; amount: number }[]
  pickup: { hotel: string; room: string }
  amounts: { currency: Moneda; total: number; deposit: number; balance: number; refunded: number }
  balance_due: string | null
  contact: { name: string; email: string; phone: string }
  created_at: string | null
  comment?: string
  payments?: IntentoPago[]
}

export type IntentoPago = {
  reference: string
  provider: 'stripe' | 'paypal' | 'manual'
  kind: 'deposit' | 'balance' | 'full'
  amount: number
  currency: Moneda
  state: string
  card: { brand: string | null; last4: string | null } | null
  error: string | null
  captured_at: string | null
}

export type IntencionPago = {
  provider: 'stripe' | 'paypal'
  payment_reference: string
  amount: number
  currency: Moneda
  kind: 'deposit' | 'balance' | 'full'
  /** Stripe */
  client_secret?: string
  publishable_key?: string
  /** PayPal */
  paypal_order_id?: string
  approve_url?: string
}

export type DiaDisponible = {
  date: string
  available: boolean
  slots: Record<Turno, {
    available: boolean
    reason: 'stop_sales' | 'not_enough_seats' | null
    seats_left: number | null
  }>
}

export type Disponibilidad = {
  tour: string
  variant: string | null
  capacity: number | null
  from: string
  to: string
  days: DiaDisponible[]
}

export type ConfigPublica = {
  currency: Moneda
  default_deposit_pct: number
  site_url: string
  payments: {
    stripe: { enabled: boolean; publishable_key: string; environment: 'test' | 'live' }
    paypal: { enabled: boolean; client_id: string; environment: 'sandbox' | 'live' }
  }
  discounts: { id: string; label: string; pct: number; auto: boolean }[]
  discount_cap_pct: number
}

/** Lo que se manda en cada `sync`. TODO es opcional: el guardado es parcial,
 *  asi que mandar solo `{contact: {email}}` no borra el nombre ya guardado. */
export type ParcheCheckout = {
  step?: 'start' | 'contact' | 'menu' | 'pickup' | 'payment'
  variant?: string | null
  package?: Paquete
  date?: string | null
  schedule_index?: number
  pax?: Partial<Pax>
  contact?: Partial<{
    first_name: string
    last_name: string
    email: string
    phone: string
    country: string
    language: string
  }>
  pickup?: Partial<{ hotel: string; room: string; notes: string; time: string }>
  occasion?: string | null
  occasion_note?: string
  how_found?: string
  note?: string
  promo_code?: string
  discounts?: string[]
  dishes?: (string | { guest: number; dish: string })[]
  addons?: string[]
  meta?: MetaOrigen
}

/** De donde viene la visita. Se guarda en el pedido para poder atribuir la
 *  venta: sin esto, «¿de donde salen las reservas?» no tiene respuesta. */
export type MetaOrigen = {
  url?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  language?: string
}
