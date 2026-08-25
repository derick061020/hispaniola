// «Cotización de evento» — la pantalla post-envío del formulario de las
// 3 landings de eventos. Misma mecánica que `lib/reservas.ts` (reservas
// de tour) pero con el shape de un formulario de cotización: no tiene
// horario, no tiene paquete, no tiene platos. Es lo que se guarda
// cuando el visitante envía el widget-evento.tsx.
//
// [2026-08-10] YA HAY BACKEND. Este archivo era, según su propia cabecera, «el
// ÚNICO punto que cambia para hacer el POST real», y eso es exactamente lo que
// se ha hecho: `guardarCotizacion` ahora manda la petición a Odoo
// (`haa.event.quote`) y el código que devuelve es el de Odoo, no uno inventado
// en el navegador.
//
// localStorage se queda, pero cambia de papel: era el almacén y ahora es solo
// CACHÉ para que `/events/:slug/thank-you` pinte sin volver a pedir nada. La
// copia buena está en el CRM, que es donde el equipo la ve y la gestiona con
// estados (nueva → contactada → cotizada → ganada/perdida).

import { enviarCotizacionEvento } from '@/lib/api/api'

const STORAGE_KEY = 'hsp:cotizaciones-evento:v1'

export type CotizacionEvento = {
  /** id único: 'COT-EVENTO-XXXX-NNNN' */
  codigo: string
  /** slug de la landing que la generó */
  slug: 'party-boat' | 'weddings' | 'corporate'
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
  /** [2026-08-25] Paquete marcado en la landing. Opcional porque MICE no
   *  tiene paquetes y porque las cotizaciones guardadas antes de hoy no lo
   *  llevan. */
  paquete?: string
}

export type NuevaCotizacion = Omit<CotizacionEvento, 'codigo' | 'fechaISO'>

// Código de emergencia. Ya NO es el camino normal —el código lo asigna Odoo con
// su secuencia, que es la única que puede garantizar que no se repita— pero
// hace falta cuando la petición falla: sin él la pantalla de gracias no tiene
// nada que enseñar. Lleva el sufijo `-LOCAL` a propósito, para que si alguien
// llama al negocio con ese código se sepa al instante que esa cotización no
// llegó al CRM y hay que buscarla en el correo.
function generarCodigoLocal(): string {
  const ahora = new Date()
  const dd = String(ahora.getDate()).padStart(2, '0')
  const mm = String(ahora.getMonth() + 1).padStart(2, '0')
  const num = Math.floor(1000 + Math.random() * 8999)
  return `COT-EVENTO-${mm}${dd}-${num}-LOCAL`
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

/** Manda la cotización a Odoo y devuelve la guardada, con el código que asignó
 *  el CRM.
 *
 *  Es `async` desde 2026-08-10: antes escribía en localStorage y devolvía al
 *  instante, y por eso el equipo no llegaba a ver ni una sola de estas
 *  peticiones. Quien la llame tiene que esperarla y enseñar el error si falla —
 *  decirle a alguien «pronto nos pondremos en contacto» cuando su mensaje no ha
 *  salido del navegador es la peor versión posible de esta pantalla.
 *
 *  Si el envío falla, `error` viene relleno: la cotización se guarda igual en
 *  local (con código `-LOCAL`) para no perder lo que escribió, pero la UI debe
 *  tratarlo como fallo, no como éxito. */
export async function guardarCotizacion(
  nueva: NuevaCotizacion,
): Promise<CotizacionEvento & { error?: string }> {
  const fechaISO = new Date().toISOString().slice(0, 10)
  let codigo: string
  let error: string | undefined

  try {
    const respuesta = await enviarCotizacionEvento({
      slug: nueva.slug,
      contacto: {
        nombre: nueva.contacto.nombre,
        email: nueva.contacto.email,
        whatsapp: nueva.contacto.whatsapp,
      },
      tipoEvento: nueva.tipoEvento,
      paquete: nueva.paquete,
      // El campo es opcional en el form («fecha tentativa»); '' no es una fecha
      // y Odoo la rechazaría.
      fecha: nueva.fecha || undefined,
      personas: nueva.personas,
      mensaje: nueva.mensaje,
    })
    codigo = respuesta.code
  } catch (e) {
    codigo = generarCodigoLocal()
    error = e instanceof Error ? e.message : 'No se pudo enviar la cotización.'
  }

  const cotizacion: CotizacionEvento = { ...nueva, codigo, fechaISO }
  const todas = leer()
  todas.push(cotizacion)
  escribir(todas)
  return error ? { ...cotizacion, error } : cotizacion
}

export function buscarCotizacion(codigo: string): CotizacionEvento | null {
  return leer().find((c) => c.codigo === codigo) ?? null
}
