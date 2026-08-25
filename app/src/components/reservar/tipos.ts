import type { IdiomaCliente } from '@/lib/idioma'
import { componTelefono, PREFIJO_POR_DEFECTO } from '@/lib/telefono'
import { traducible } from '@/lib/i18n'
// Tipos compartidos del funnel de reserva (/reservar/:slug, Fase C). Viven
// aparte para que los pasos y la página los importen sin ciclos (la página
// importa los pasos; los pasos importan solo estos tipos).

export type Paquete = 'light' | 'premium'

export type DatosRecogida = { hotel: string; notas: string }

// `idioma` decide en que lengua le escribe Odoo (los once correos existen en
// espanol y en ingles). Arranca en el del navegador y el cliente puede
// cambiarlo — ver `lib/idioma.ts`.
//
// [2026-08-25] `telefono` guarda SOLO el numero local; el pais va aparte en
// `prefijo` (un id ISO, no el codigo: +1 lo comparten EE.UU., Canada y RD).
// Lo que viaja a Odoo es siempre el compuesto — `telefonoDe()`, nunca
// `datos.telefono` a secas, o se manda un numero sin prefijo.
export type DatosContacto = {
  nombre: string
  apellidos: string
  email: string
  prefijo: string
  telefono: string
  idioma: IdiomaCliente
}

export const PREFIJO_INICIAL = PREFIJO_POR_DEFECTO

/** El telefono tal y como se guarda en la reserva: «+34 612345678». */
export function telefonoDe(contacto: Pick<DatosContacto, 'prefijo' | 'telefono'>): string {
  return componTelefono(contacto.prefijo, contacto.telefono)
}

// «¿Celebras algo especial?» — dato OPCIONAL del paso de contacto (2026-08-07,
// pedido de Samuel). No es marketing: la pantalla de gracias ya invitaba a
// contarlo por WhatsApp DESPUÉS de pagar, y para entonces la mitad de la gente
// ya cerró la pestaña. Preguntarlo mientras rellena sus datos cuesta un clic y
// le llega a la tripulación con días de antelación.
//
// Los ids son estables (viajan a la reserva guardada); las etiquetas son copy.
export type Ocasion = 'cumpleanos' | 'aniversario' | 'luna-de-miel' | 'pedida' | 'ninguna'

export const OCASIONES: { id: Ocasion; etiqueta: string }[] = traducible([
  { id: 'cumpleanos', etiqueta: 'Birthday' },
  { id: 'aniversario', etiqueta: 'Anniversary' },
  { id: 'luna-de-miel', etiqueta: 'Honeymoon' },
  { id: 'pedida', etiqueta: 'Proposal' },
  { id: 'ninguna', etiqueta: 'Nothing in particular' },
])

export type DatosCelebracion = { ocasion: Ocasion | null; nota: string }

export function etiquetaOcasion(id: Ocasion | null | undefined): string | null {
  if (!id || id === 'ninguna') return null
  return OCASIONES.find((o) => o.id === id)?.etiqueta ?? null
}
