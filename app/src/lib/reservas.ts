import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'
import type { DatosContacto, DatosRecogida, Paquete } from '@/components/reservar/tipos'

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
  ficha: Pick<FichaTour, 'menuLight' | 'menuPremium' | 'horarios' | 'upgradePremium'>
  paquete: Paquete
  personas: number
  horarioIdx: number
  fechaISO: string
  platos: string[]
  recogida: DatosRecogida
  contacto: Omit<DatosContacto, 'emailConfirm'>
  total: number
  deposito: number
  saldo: number
  fechaCreacionISO: string
  comoNosConociste?: string
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
export function leerReservas(): Reserva[] {
  if (typeof window === 'undefined') return []
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY)
    if (!bruto) return []
    const parsed = JSON.parse(bruto)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Persiste la lista de reservas (sobrescribe).
export function escribirReservas(reservas: Reserva[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas))
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
      nombre: 'Semi-Privado Premium',
      audienciaChip: 'Solo adultos',
      duracionCorta: '4 h',
      maxPax: 25,
      precioLight: 99,
    },
    ficha: {
      menuLight: [
        { nombre: 'Pechuga de pollo a la parrilla' },
        { nombre: 'Filete de pescado a la parrilla' },
      ],
      menuPremium: [
        { nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón' },
        { nombre: 'Carne', desc: 'Angus certificado' },
        { nombre: 'Surf & Turf', desc: 'Langosta + Angus' },
        { nombre: 'Vegetariano', desc: 'Ceviche de zucchini' },
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
      notas: 'Habitación 1245, lobby a las 8:30',
    },
    contacto: {
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
