import type { AceptacionLegal } from '@/lib/api/tipos'

// [2026-10-30, Samuel: «las casillas de aceptación las hacemos nosotros»]
// Anexo del PDF HAA-LEG-002 (págs. 5-6), apartado D: Odoo guarda en cada
// reserva la fecha y hora de aceptación, la versión aceptada, el canal y si
// autoriza el uso de su imagen. Aquí vive lo que el checkout recuerda de las
// dos casillas y cómo se convierte en el campo que viaja a Odoo.
//
// La versión es el pie del PDF, literal y en español aunque la web se lea en
// inglés: es la referencia del documento firmado, no copy de la interfaz.
// Cuando llegue una versión nueva de las políticas, se cambia AQUÍ.
export const VERSION_POLITICAS = 'HAA-LEG-002 · 29 de octubre de 2026'

/** Lo que el visitante ha marcado en el último paso del checkout. */
export type EstadoAceptacion = {
  /** Casilla 1 (Términos, Cancelación, Privacidad y Relevo). Sin ella no se paga. */
  aceptaTerminos: boolean
  /** Momento en que marcó la casilla 1 (ISO, UTC). Es la prueba de que aceptó
   *  ANTES de pagar: se toma al marcar, no al cobrar. */
  aceptadoEn: string | null
  /** Casilla 2 (fotos y video). Nunca viene marcada de antemano. */
  autorizaImagen: boolean
}

export const ACEPTACION_INICIAL: EstadoAceptacion = {
  aceptaTerminos: false,
  aceptadoEn: null,
  autorizaImagen: false,
}

/** El campo `legal_acceptance` del `sync`. Sin la casilla 1 no hay nada que mandar. */
export function aceptacionParaOdoo(estado: EstadoAceptacion): AceptacionLegal | null {
  if (!estado.aceptaTerminos || !estado.aceptadoEn) return null
  return {
    accepted_at: estado.aceptadoEn,
    version: VERSION_POLITICAS,
    channel: 'web',
    image_consent: estado.autorizaImagen,
  }
}
