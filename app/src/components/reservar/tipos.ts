// Tipos compartidos del funnel de reserva (/reservar/:slug, Fase C). Viven
// aparte para que los pasos y la página los importen sin ciclos (la página
// importa los pasos; los pasos importan solo estos tipos).

export type Paquete = 'light' | 'premium'

export type DatosRecogida = { hotel: string; notas: string }

export type DatosContacto = { nombre: string; apellidos: string; email: string; emailConfirm: string; telefono: string }

// «¿Celebras algo especial?» — dato OPCIONAL del paso de contacto (2026-08-07,
// pedido de Samuel). No es marketing: la pantalla de gracias ya invitaba a
// contarlo por WhatsApp DESPUÉS de pagar, y para entonces la mitad de la gente
// ya cerró la pestaña. Preguntarlo mientras rellena sus datos cuesta un clic y
// le llega a la tripulación con días de antelación.
//
// Los ids son estables (viajan a la reserva guardada); las etiquetas son copy.
export type Ocasion = 'cumpleanos' | 'aniversario' | 'luna-de-miel' | 'pedida' | 'ninguna'

export const OCASIONES: { id: Ocasion; etiqueta: string }[] = [
  { id: 'cumpleanos', etiqueta: 'Cumpleaños' },
  { id: 'aniversario', etiqueta: 'Aniversario' },
  { id: 'luna-de-miel', etiqueta: 'Luna de miel' },
  { id: 'pedida', etiqueta: 'Pedida de mano' },
  { id: 'ninguna', etiqueta: 'Nada en particular' },
]

export type DatosCelebracion = { ocasion: Ocasion | null; nota: string }

export function etiquetaOcasion(id: Ocasion | null | undefined): string | null {
  if (!id || id === 'ninguna') return null
  return OCASIONES.find((o) => o.id === id)?.etiqueta ?? null
}
