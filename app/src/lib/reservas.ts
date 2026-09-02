import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'
import type { DatosCelebracion, DatosContacto, DatosRecogida, Paquete } from '@/components/reservar/tipos'
import { crudo, traducible } from '@/lib/i18n'
import type { MetodoPago } from '@/lib/tarifas'

// Capa de datos de la reserva completada. Como el proyecto no tiene
// backend (Bloque A del PLAN-LANZAMIENTO), la reserva vive en
// localStorage del navegador y se consulta por código. Cuando se
// conecte Odoo/xpotours, este módulo será el shape que el contrato
// de API tiene que respetar — los tipos (Reserva, ReservaDemo) son la
// fuente de verdad.

export type Reserva = {
  codigo: string
  slug: string
  tour: Pick<Tour, 'nombre' | 'audienciaChip' | 'duracionCorta' | 'maxPax' | 'precioLight'>
  /** [2026-08-07] Se guardan también `menuBuffet`, `menuCharter` y
   *  `subVariantes` (los tres opcionales): son lo que el resolutor de menú
   *  (lib/menu-reserva.ts) necesita para contestar lo mismo en «Gracias» y en
   *  «Mi reserva» que en el checkout. Sin ellos, esas pantallas volvían a
   *  `menuLight`/`menuPremium` —vacíos en Saona y en el charter— y ofrecían
   *  «cambiar el menú» de un menú que no existe. */
  ficha: Pick<FichaTour, 'menuLight' | 'menuPremium' | 'horarios' | 'upgradePremium'> &
    Partial<Pick<FichaTour, 'menuBuffet' | 'menuCharter' | 'subVariantes'>>
  paquete: Paquete
  /** Sub-variante elegida (el BARCO en el charter, la modalidad en Saona).
   *  Decide qué carta se come — ver `cartaCharterDe`. */
  variante?: string
  personas: number
  horarioIdx: number
  fechaISO: string
  /** Plato por persona. VACÍO cuando el menú no se elige (buffet): no es que
   *  falten por decidir, es que no hay nada que decidir. */
  platos: string[]
  recogida: DatosRecogida
  /** [2026-08-25] Sin `prefijo`: la reserva guardada lleva UN telefono ya
   *  compuesto («+34 612345678»), que es lo que pinta «Mi reserva» y lo que
   *  Odoo devuelve. La particion en pais + numero es del formulario, no del
   *  dato guardado — ver `telefonoDe()` en components/reservar/tipos.ts. */
  contacto: Omit<DatosContacto, 'prefijo'>
  /** [2026-09-01] Cómo se paga: 'efectivo' (todo el día del tour, con el 5% de
   *  descuento y SIN cobro hoy) o 'tarjeta' (depósito del 25% y el resto luego).
   *  Opcional para no invalidar las reservas ya guardadas en localStorage de
   *  antes de este cambio; sin el campo se leen como 'tarjeta', que es lo que
   *  eran. Cuando exista backend, este campo es parte del contrato: una reserva
   *  en efectivo llega sin depósito cobrado y el equipo tiene que saberlo. */
  metodoPago?: MetodoPago
  /** Lo que rebajó pagar en efectivo. 0 o ausente con tarjeta. */
  descuentoEfectivo?: number
  /** El importe final, YA con el descuento de efectivo si lo hubo. */
  total: number
  /** Lo que se cobra al reservar. 0 pagando en efectivo. */
  deposito: number
  saldo: number
  /** Todo lo que queda por pagar, si es mas que lo que se cobra ahora. */
  saldoTotal?: number
  /** El desglose del precio, descuentos incluidos. */
  desglose?: { key: string; label: string; amount: number; detail: string | null }[]
  fechaCreacionISO: string
  comoNosConociste?: string
  /** «¿Celebras algo especial?» del paso de contacto (2026-08-07). Opcional
   *  de verdad: solo existe si el visitante eligió una ocasión. */
  celebracion?: DatosCelebracion
}

const STORAGE_KEY = 'hsp:reservas:v1'

// Genera el código de reserva en el formato que usa el prototipo
// (HSP-XXXX-NNNN). No es criptográficamente seguro — solo único
// "suficiente" para un identificador visible al cliente mientras no
// haya backend.
export function generarCodigoReserva(): string {
  const a = Math.floor(Math.random() * 9000) + 1000 // 4 dígitos
  const b = Math.floor(Math.random() * 9000) + 1000 // 4 dígitos
  return `HSP-${a}-${b}`
}

// Lee TODAS las reservas guardadas en localStorage. Si la clave
// no existe o el JSON está corrupto, devuelve [] (no lanza).
//
// [2026-08-19] Sale envuelto en `traducible()`. Lo GUARDADO es siempre el
// inglés canónico —el que entiende Odoo, ver `crudo()` en lib/i18n— y esa es
// la copia que sobrevive en el navegador; lo que se PINTA de ella tiene que
// seguir el idioma que se esté leyendo ahora, que puede no ser el de la
// tarde en que se hizo la reserva.
export function leerReservas(): Reserva[] {
  if (typeof window === 'undefined') return []
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY)
    if (!bruto) return []
    const parsed = JSON.parse(bruto)
    return Array.isArray(parsed) ? traducible(parsed as Reserva[]) : []
  } catch {
    return []
  }
}

// Persiste la lista de reservas (sobrescribe).
export function escribirReservas(reservas: Reserva[]): void {
  if (typeof window === 'undefined') return
  try {
    // `crudo()` antes de serializar: si se guardara lo traducido, una reserva
    // hecha en español dejaría en el navegador «Marisco» donde el resto del
    // sistema (y Odoo) escriben «Seafood», y al volver en inglés seguiría
    // saliendo en español.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(crudo(reservas)))
  } catch {
    // localStorage lleno o deshabilitado — silencioso: la UX no se rompe,
    // la reserva no se guarda y se advierte al cliente de guardar el email.
  }
}

// Añade una reserva (o actualiza si ya existe por código). Devuelve
// la reserva guardada.
export function guardarReserva(reserva: Reserva): Reserva {
  const todas = leerReservas()
  const idx = todas.findIndex((r) => r.codigo === reserva.codigo)
  if (idx >= 0) {
    todas[idx] = reserva
  } else {
    todas.unshift(reserva)
  }
  escribirReservas(todas)
  return reserva
}

// Busca una reserva por código. Devuelve null si no existe.
export function buscarReserva(codigo: string): Reserva | null {
  return leerReservas().find((r) => r.codigo === codigo) ?? null
}

// Reserva de ejemplo (la que usaba el prototipo en prototipo/app.js
// → RESERVA_DEMO). Se muestra en /mi-reserva/:codigo cuando el código
// no existe en localStorage — para que la página nunca esté vacía y
// se pueda previsualizar sin completar una reserva real.
//
// ⚠️ DEMO: el copy del prototipo dice "Estás viendo una reserva de
// ejemplo — cuando completes una reserva real, esta pantalla mostrará
// la tuya." Misma honestidad que el resto del build.
export function reservaDemo(): Reserva {
  return {
    codigo: 'HSP-0000-0001',
    slug: 'semi-private-premium',
    tour: {
      nombre: 'Caribbean Escape',
      audienciaChip: 'Adults only',
      duracionCorta: '4 h',
      maxPax: 25,
      precioLight: 99,
    },
    ficha: {
      menuLight: [
        { nombre: 'Grilled chicken breast' },
        { nombre: 'Grilled fish fillet' },
      ],
      menuPremium: [
        { nombre: 'Seafood', desc: 'Lobster, octopus, shrimp' },
        { nombre: 'Meat', desc: 'Certified Angus beef' },
        { nombre: 'Surf & Turf', desc: 'Lobster + Angus beef' },
        { nombre: 'Vegetarian', desc: 'Zucchini ceviche' },
      ],
      horarios: [
        { hora: '9:00 AM', regreso: '1:00 PM' },
        { hora: '1:00 PM', regreso: '5:00 PM' },
      ],
      upgradePremium: 15,
    },
    paquete: 'premium',
    personas: 2,
    horarioIdx: 0,
    fechaISO: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    platos: ['langosta', 'wagyu'],
    recogida: {
      hotel: 'Hotel Barceló Bávaro Palace',
      notas: 'Room 1245, lobby at 8:30',
    },
    contacto: {
      idioma: 'spanish',
      nombre: 'María',
      apellidos: 'González',
      email: 'maria@example.com',
      telefono: '+1 829 555 0100',
    },
    total: 228,
    deposito: 57,
    saldo: 171,
    fechaCreacionISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
}
