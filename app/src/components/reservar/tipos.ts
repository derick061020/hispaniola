import type { IdiomaCliente } from '@/lib/idioma'
// Tipos compartidos del funnel de reserva (/reservar/:slug, Fase C). Viven
// aparte para que los pasos y la página los importen sin ciclos (la página
// importa los pasos; los pasos importan solo estos tipos).

export type Paquete = 'light' | 'premium'

export type DatosRecogida = { hotel: string; notas: string }

// `idioma` decide en que lengua le escribe Odoo (los once correos existen en
// espanol y en ingles). Arranca en el del navegador y el cliente puede
// cambiarlo — ver `lib/idioma.ts`.
export type DatosContacto = {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  idioma: IdiomaCliente
}

// «¿Celebras algo especial?» — dato OPCIONAL del paso de contacto (2026-08-07,
// pedido de Samuel). No es marketing: la pantalla de gracias ya invitaba a
// contarlo por WhatsApp DESPUÉS de pagar, y para entonces la mitad de la gente
// ya cerró la pestaña. Preguntarlo mientras rellena sus datos cuesta un clic y
// le llega a la tripulación con días de antelación.
//
// Los ids son estables (viajan a la reserva guardada); las etiquetas son copy.
export type Ocasion = 'cumpleanos' | 'aniversario' | 'luna-de-miel' | 'pedida' | 'ninguna'

export const OCASIONES: { id: Ocasion; etiqueta: string }[] = [
  { id: 'cumpleanos', etiqueta: 'Birthday' },
  { id: 'aniversario', etiqueta: 'Anniversary' },
  { id: 'luna-de-miel', etiqueta: 'Honeymoon' },
  { id: 'pedida', etiqueta: 'Proposal' },
  { id: 'ninguna', etiqueta: 'Nothing in particular' },
]

export type DatosCelebracion = { ocasion: Ocasion | null; nota: string }

export function etiquetaOcasion(id: Ocasion | null | undefined): string | null {
  if (!id || id === 'ninguna') return null
  return OCASIONES.find((o) => o.id === id)?.etiqueta ?? null
}
