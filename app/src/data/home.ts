// Contenido de la home — portado de prototipo/datos.js (fuente canónica).
// Solo se incluyen los campos que la HOME usa; el resto de la ficha de tour
// (itinerario, incluye, FAQ propia…) no es parte de este build (ver PLAN.md).

export type Tour = {
  slug: string
  nombre: string
  audienciaChip: string
  duracionCorta: string
  rating: number
  resenas: number
  /** null = sin precio fijo (se cotiza o se consulta) */
  precioLight: number | null
  booking: 'completo' | 'cotizacion' | 'consulta'
  descripcionCorta: string
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
}

export const TOURS: Tour[] = [
  {
    slug: 'semi-privado',
    nombre: 'Semi-Privado Premium',
    audienciaChip: 'Solo adultos',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 99,
    booking: 'completo',
    descripcionCorta:
      'Snorkel en vivero de coral con bióloga marina, playa desierta con coco-loco y comida hecha a bordo. Máximo 25 personas en un barco para 70.',
    foto: 'tour-semi-privado',
  },
  {
    slug: 'snorkel-lovers',
    nombre: 'Snorkel Lovers',
    audienciaChip: 'Todas las edades',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 98,
    booking: 'completo',
    descripcionCorta:
      'La versión familiar del Semi-Privado: mismo vivero de coral, misma cocina flotante, para que niños y adultos disfruten juntos el día en el mar.',
    foto: 'tour-snorkel-lovers',
  },
  {
    slug: 'charter-privado',
    nombre: 'Charter Privado',
    audienciaChip: 'Grupo privado',
    duracionCorta: '3-4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 55,
    booking: 'cotizacion',
    descripcionCorta:
      'El barco completo, solo para tu grupo: familia, amigos, o una celebración. Ruta y horario a tu medida, desde 10 personas.',
    foto: 'tour-charter-privado',
  },
  {
    slug: 'isla-saona',
    nombre: 'Isla Saona',
    audienciaChip: 'Privado',
    duracionCorta: 'día completo',
    rating: 4.9,
    resenas: 1782,
    precioLight: null,
    booking: 'consulta',
    descripcionCorta:
      'Día completo navegando a Isla Saona: playas de arena blanca, piscina natural y almuerzo típico dominicano. Precio y capacidad pendientes de confirmar.',
    foto: 'tour-isla-saona',
  },
]

export const bookingCta: Record<Tour['booking'], string> = {
  completo: 'Reservar',
  cotizacion: 'Cotizar',
  consulta: 'Consultar',
}

export type Plato = { id: string; nombre: string; desc: string; foto: string }

export const PLATOS: Plato[] = [
  { id: 'mariscos', nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
  { id: 'carne', nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
  { id: 'surf-turf', nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
  { id: 'vegetariano', nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
]

export type Ocasion = {
  tipo: string
  nombre: string
  meta: string
  /** landings propias (Bodas, MICE) vs. deep-link al formulario del hub de eventos */
  esLanding: boolean
}

export const OCASIONES: Ocasion[] = [
  { tipo: 'boda', nombre: 'Bodas y pre-boda', meta: 'Ceremonia, welcome party o despedida del grupo.', esLanding: true },
  { tipo: 'mice', nombre: 'Corporativo / MICE', meta: 'Incentivos, team building, cierres de convención.', esLanding: true },
  { tipo: 'cumpleanos', nombre: 'Cumpleaños', meta: 'Decoración, pastel y la playlist que elijas.', esLanding: false },
  { tipo: 'aniversario', nombre: 'Aniversarios', meta: 'Íntimo o con toda la familia.', esLanding: false },
  { tipo: 'despedida', nombre: 'Despedidas de soltero/a', meta: 'Barco entero, solo tu grupo.', esLanding: false },
  { tipo: 'reunion', nombre: 'Reuniones familiares', meta: 'Multi-generación: niños y abuelos a bordo.', esLanding: false },
]

export function formatoDinero(n: number | null): string {
  if (n === null) return '—'
  return 'US$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
