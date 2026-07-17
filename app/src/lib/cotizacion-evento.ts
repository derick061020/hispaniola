// «Cotización de evento» — la pantalla post-envío del formulario de las
// 3 landings de eventos. Misma mecánica que `lib/reservas.ts` (reservas
// de tour) pero con el shape de un formulario de cotización: no tiene
// horario, no tiene paquete, no tiene platos. Es lo que se guarda
// cuando el visitante envía el widget-evento.tsx.
//
// ⚠️ Sin backend real (PLAN-LANZAMIENTO.md Bloque 0.1/0.2): las
// cotizaciones viven en localStorage. Cuando llegue Odoo/xpotours,
// este archivo es el ÚNICO punto que cambia para hacer el POST real.

const STORAGE_KEY = 'hsp:cotizaciones-evento:v1'

export type CotizacionEvento = {
  /** id único: 'COT-EVENTO-XXXX-NNNN' */
  codigo: string
  /** slug de la landing que la generó */
  slug: 'party-boat' | 'bodas' | 'empresas'
  /** ISO 'YYYY-MM-DD' del momento del envío */
  fechaISO: string
  contacto: {
    nombre: string
    email: string
    whatsapp: string
  }
  tipoEvento: string
  /** fecha tentativa: '' si no eligió */
  fecha: string
  personas: number
  mensaje: string
}

export type NuevaCotizacion = Omit<CotizacionEvento, 'codigo' | 'fechaISO'>

// Mismo formato que reservas.ts (HSP-DDMM-NNNN) pero con prefijo COT
// para que sea evidente en el storage que NO es una reserva real.
function generarCodigo(): string {
  const ahora = new Date()
  const dd = String(ahora.getDate()).padStart(2, '0')
  const mm = String(ahora.getMonth() + 1).padStart(2, '0')
  const num = Math.floor(1000 + Math.random() * 8999)
  return `COT-EVENTO-${mm}${dd}-${num}`
}

function leer(): CotizacionEvento[] {
  if (typeof window === 'undefined') return []
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY)
    if (!bruto) return []
    const parsed = JSON.parse(bruto)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function escribir(todas: CotizacionEvento[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todas))
  } catch {
    // localStorage lleno o deshabilitado — silencioso: la UX no se
    // rompe, simplemente no persistirá (la pantalla de gracias ya se
    // pintó, el form ya se envió en la memoria del componente).
  }
}

/** Añade una cotización y devuelve la cotización guardada (con código
 *  generado y fechaISO). */
export function guardarCotizacion(nueva: NuevaCotizacion): CotizacionEvento {
  const cotizacion: CotizacionEvento = {
    ...nueva,
    codigo: generarCodigo(),
    fechaISO: new Date().toISOString().slice(0, 10),
  }
  const todas = leer()
  todas.push(cotizacion)
  escribir(todas)
  return cotizacion
}

export function buscarCotizacion(codigo: string): CotizacionEvento | null {
  return leer().find((c) => c.codigo === codigo) ?? null
}
