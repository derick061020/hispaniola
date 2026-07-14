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
  /** null = sin tope publicado */
  maxPax: number | null
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
    maxPax: 25,
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
    maxPax: 25,
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
    maxPax: 120,
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
    maxPax: null,
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
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
}

// Fotos PROVISIONALES: no existe shooting propio de eventos (bodas,
// cumpleaños...), así que se reutilizan fotos reales de la galería de
// charter-privado que mejor encajan con cada ocasión. Pendiente pedirle al
// cliente fotos reales de eventos (ver app/PLAN-v3.md §9).
export const OCASIONES: Ocasion[] = [
  {
    tipo: 'boda',
    nombre: 'Bodas y pre-boda',
    meta: 'Ceremonia, welcome party o despedida del grupo.',
    esLanding: true,
    foto: 'galeria-charter-privado-5',
  },
  {
    tipo: 'mice',
    nombre: 'Corporativo / MICE',
    meta: 'Incentivos, team building, cierres de convención.',
    esLanding: true,
    foto: 'galeria-charter-privado-3',
  },
  {
    tipo: 'cumpleanos',
    nombre: 'Cumpleaños',
    meta: 'Decoración, pastel y la playlist que elijas.',
    esLanding: false,
    foto: 'galeria-charter-privado-1',
  },
  {
    tipo: 'aniversario',
    nombre: 'Aniversarios',
    meta: 'Íntimo o con toda la familia.',
    esLanding: false,
    foto: 'galeria-charter-privado-7',
  },
  {
    tipo: 'despedida',
    nombre: 'Despedidas de soltero/a',
    meta: 'Barco entero, solo tu grupo.',
    esLanding: false,
    foto: 'galeria-charter-privado-2',
  },
  {
    tipo: 'reunion',
    nombre: 'Reuniones familiares',
    meta: 'Multi-generación: niños y abuelos a bordo.',
    esLanding: false,
    foto: 'galeria-charter-privado-6',
  },
]

export function formatoDinero(n: number | null): string {
  if (n === null) return '—'
  return 'US$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export type ItemNav = { id: string; nombre: string; descripcion: string }

// Nosotros (PLAN-v3.md §12.2) — fuente: TRIPULACION (4 roles) + FLOTA (3
// entradas) del prototipo para el primer ítem; el itinerario de semi-privado
// ("Arrecife de Cabeza de Toro: proyecto de restauración top-3 de RD") para
// el segundo. El icono se mapea por `id` en item-menu.tsx (presentación, no
// contenido — así este archivo no importa React).
export const NAV_NOSOTROS: ItemNav[] = [
  {
    id: 'tripulacion',
    nombre: 'La tripulación y la flota',
    descripcion: 'Capitán, bióloga marina, chef a bordo y guía de snorkel. Dos catamaranes y la cocina flotante.',
  },
  {
    id: 'arrecife',
    nombre: 'El arrecife que reconstruimos',
    descripcion: 'El vivero de coral de Cabeza de Toro: proyecto de restauración top-3 del país.',
  },
]

// Ayuda (PLAN-v3.md §12.2) — FAQ_CATEGORIAS del prototipo: 6 categorías, 14
// preguntas (contadas). NOTAS['mi-reserva'] para el segundo ítem. "Contacto"
// (ya no "Contacto y WhatsApp", decisión de Samuel 2026-07-14) lleva a la
// página /contacto del prototipo — WhatsApp con horario, teléfono, email y
// formulario, no solo el enlace directo a WhatsApp que tenía antes.
// ⚠️ El grid de 2 columnas deja un hueco en la 4ª celda con estos 3 ítems —
// decisión de Samuel: se queda vacío, sin `col-span` ni relleno inventado.
export const NAV_AYUDA: ItemNav[] = [
  {
    id: 'faq',
    nombre: 'Preguntas frecuentes',
    descripcion: '14 preguntas: reservas y pagos, qué llevar, comida, clima, niños.',
  },
  {
    id: 'reserva',
    nombre: 'Gestionar mi reserva',
    descripcion: 'Cambia tu menú o paga el saldo pendiente. Solo con tu código, sin cuenta.',
  },
  {
    id: 'contacto',
    nombre: 'Contacto',
    descripcion: 'WhatsApp, teléfono y formulario. Respondemos en minutos, de 8:00 a 20:00.',
  },
]

// Cinta de confianza — vivía enterrada en la ficha del wireframe (ver
// NOTAS['home-stats'] del prototipo). v3-F11: sube al hero, entre el
// subtítulo y el CTA (PLAN-v3.md §14).
export type Stat = { valor: string; label: string }
export const STATS: Stat[] = [
  { valor: '91.607', label: 'clientes felices' },
  { valor: '4.454', label: 'días navegados' },
  { valor: '≤35%', label: 'de la capacidad del barco' },
  { valor: '0', label: 'plástico a bordo' },
]

export type Premio = {
  id: string
  /** Texto del premio — es el `alt` de la imagen: describe lo que el badge DICE,
   *  porque el badge es una imagen y su contenido no es texto seleccionable. */
  nombre: string
  /** nombre de archivo en /premios (sin extensión) */
  foto: string
  /** Dimensiones intrínsecas del webp — van al <img> para reservar el hueco y
   *  que la cinta no dé un salto de layout (CLS) al cargar los 7 logos. */
  ancho: number
  alto: number
}

// Los 7 premios reales de la web actual (imágenes descargadas de
// hispaniolaaquaticadventures.com/images/awards/, no stock ni recreaciones).
//
// La auditoría (analisis/auditoria-web-actual.md §"Señales de confianza") los
// marcó como ACTIVO DESAPROVECHADO: en la web actual viven frente al hero en
// imágenes pequeñas de baja resolución, sin números que los acompañen. Aquí
// suben a la cinta de stats, que es justo la sección de "demostrar" — los
// premios al lado de las cifras (91.607 clientes, 4.9★) se refuerzan entre sí.
//
// ⚠️ Siguen SIN enlaces verificables (la otra mitad de la crítica de la
// auditoría): no tenemos las URLs de los perfiles/premios y no se inventan.
// Pendiente pedírselas al cliente (ver app/PLAN-v3.md §9).
export const PREMIOS: Premio[] = [
  {
    id: 'tripadvisor',
    nombre: 'TripAdvisor — #1 en actividades acuáticas de Bávaro / Punta Cana durante más de 7 años',
    foto: 'premio-tripadvisor',
    ancho: 222,
    alto: 82,
  },
  {
    id: 'weddingwire',
    nombre: "WeddingWire — Couples' Choice Awards 2018-2021",
    foto: 'premio-weddingwire',
    ancho: 128,
    alto: 128,
  },
  {
    id: 'ltg',
    nombre: 'LTG Global Awards 2021/22 — Ganador: Aquatic Tour Operator of the Year, República Dominicana',
    foto: 'premio-ltg',
    ancho: 318,
    alto: 128,
  },
  // TripAdvisor y los Viator: nativo 82px / 109px de alto — no llegan a 128
  // (2× de --spacing-premio-alto), así que se exportan a su nativo y NO se
  // upscalean (PLAN-v3.md §14.4, Trampa №11). Pendiente pedirle al cliente
  // los assets en alta (§9).
  { id: 'viator-2022', nombre: 'Viator Experience Award 2022', foto: 'premio-viator-2022', ancho: 95, alto: 109 },
  { id: 'viator-2023', nombre: 'Viator Experience Award 2023', foto: 'premio-viator-2023', ancho: 95, alto: 109 },
  { id: 'viator-2024', nombre: 'Viator Experience Awards 2024', foto: 'premio-viator-2024', ancho: 95, alto: 109 },
  {
    id: 'luxury-travel-guide',
    nombre: 'Luxury Travel Guide — The Americas Awards 2016, Ganador: Tour Operator of the Year, Punta Cana',
    foto: 'premio-luxury-travel-guide',
    ancho: 387,
    alto: 128,
  },
]

/** Card del ticker del hero. Son DOS especies, no una: el tour se compra (tiene
 *  precio, duración y aforo) y la ocasión se cotiza (no tiene precio publicado).
 *  La unión discriminada lo hace explícito → 2 variantes del componente Figma. */
export type TickerItem =
  | {
      tipo: 'tour'
      id: string
      nombre: string
      foto: string
      /** null = sin precio publicado (Isla Saona) */
      precioDesde: number | null
      duracion: string
      /** null = sin tope publicado */
      maxPax: number | null
    }
  | { tipo: 'ocasion'; id: string; nombre: string; foto: string }

export type TickerTour = Extract<TickerItem, { tipo: 'tour' }>

// Ticker del hero (v3): los 4 tours + las 6 ocasiones, todo lo que lleva a
// una ficha propia (PLAN-v3.md §7). Reemplaza a la baraja de v2.
export const TICKER_ITEMS: TickerItem[] = [
  ...TOURS.map(
    (t): TickerItem => ({
      tipo: 'tour',
      id: t.slug,
      nombre: t.nombre,
      foto: t.foto,
      precioDesde: t.precioLight,
      duracion: t.duracionCorta,
      maxPax: t.maxPax,
    }),
  ),
  ...OCASIONES.map((o): TickerItem => ({ tipo: 'ocasion', id: o.tipo, nombre: o.nombre, foto: o.foto })),
]
