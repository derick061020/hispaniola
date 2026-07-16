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
  /** v3-F20 (§18): galería real del servicio (varios /fotos) para el carrusel
   *  de la card del grid. Solo la tienen los 3 productos del escaparate
   *  (semi-privado, snorkel-lovers, charter-privado); Isla Saona no tiene
   *  galería → se queda FUERA del grid (pero sigue en ticker/megamenú/footer/
   *  móvil, que solo usan `foto`). */
  galeria?: string[]
  /** v3-F20: 3 «incluye» cortos, chips de la card. Portados VERBATIM de los
   *  títulos de `incluye` de prototipo/datos.js (no inventados). */
  destacados?: string[]
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
    galeria: [
      'galeria-semi-privado-1',
      'galeria-semi-privado-2',
      'galeria-semi-privado-3',
      'galeria-semi-privado-4',
      'galeria-semi-privado-5',
    ],
    destacados: ['Equipo de snorkel', 'Comida + bebidas', 'Bióloga marina'],
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
    galeria: [
      'galeria-snorkel-lovers-1',
      'galeria-snorkel-lovers-2',
      'galeria-snorkel-lovers-3',
      'galeria-snorkel-lovers-4',
      'galeria-snorkel-lovers-5',
    ],
    destacados: ['Equipo de snorkel', 'Comida + bebidas', 'Guía de snorkel'],
  },
  {
    slug: 'charter-privado',
    nombre: 'Charter Privado',
    audienciaChip: 'Grupo privado',
    duracionCorta: '3-4 h',
    rating: 4.9,
    resenas: 1782,
    maxPax: 120,
    precioLight: 75,
    booking: 'cotizacion',
    descripcionCorta:
      'El barco completo, solo para tu grupo: familia, amigos, o una celebración. Ruta y horario a tu medida, desde 10 personas.',
    foto: 'tour-charter-privado',
    galeria: [
      'galeria-charter-privado-1',
      'galeria-charter-privado-2',
      'galeria-charter-privado-3',
      'galeria-charter-privado-4',
      'galeria-charter-privado-5',
    ],
    destacados: ['Barco entero', 'Comida a medida', 'Coordinación dedicada'],
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

export type IncluyeItem = { id: string; titulo: string; texto: string }

// Sección «Incluye» (v3-F19) — portado del bloque "...all our cruises include:"
// de la HOME de la web actual (9 ítems), traducido fiel. Se QUITA el 9º
// ("Service — Award winning VIP Service and for sure lots of fun") por
// decisión de Samuel (2026-07-15): con 8 la sección queda en 2 columnas
// parejas de 4 cards a cada lado del catamarán. Donde datos.js ya tenía
// vocabulario para el mismo concepto (coco-loco, cocina flotante, vivero de
// coral) se usa ese, no una segunda traducción. Los "($)" de la web actual
// (transporte, fotos HD) no se copian: ese matiz ya vive en `noIncluido` de
// cada tour (fotos HD US$ 20 · suplemento desde Casa de Campo).
// El icono se mapea por `id` en incluye-crucero.tsx (presentación, no
// contenido — así este archivo sigue sin importar React).
export const INCLUYE_CRUCERO: IncluyeItem[] = [
  { id: 'snorkel', titulo: 'Snorkel', texto: 'Experiencia increíble en un vivero de coral real. Todo el equipo incluido.' },
  { id: 'transporte', titulo: 'Transporte', texto: 'Ida y vuelta desde tu hotel, en bus cómodo con aire acondicionado.' },
  { id: 'entretenimiento', titulo: 'Entretenimiento a bordo', texto: 'Música, actividades y una tripulación cercana y con energía.' },
  { id: 'wifi', titulo: 'WiFi', texto: 'WiFi a bordo durante toda la excursión.' },
  { id: 'comida', titulo: 'Comida fresca', texto: 'Frutas, mini-croissants y mariscos recién hechos en la cocina flotante.' },
  { id: 'bebidas', titulo: 'Bebidas', texto: 'Cerveza nacional, ron añejo de 7 años, vodka, jugo de naranja y refrescos.' },
  { id: 'playa', titulo: 'Playa desierta', texto: 'Parada con coco-loco (el cóctel típico) y coco para comer.' },
  { id: 'fotos', titulo: 'Fotos', texto: 'De todo el tour, con GoPro también en el snorkel — se descargan de nuestro Facebook sin costo.' },
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
  // v3-F13 (PLAN-v3.md §15.7): "de la capacidad del barco" (24 car.) partía en
  // 2 líneas contra los otros 3 labels — "aforo" ya es vocabulario del
  // proyecto (aforo máx. en las cards del ticker y en el megamenú de Tours),
  // no introduce una palabra nueva. El dato no cambia (≤35% de
  // NOTAS['home-stats']).
  { valor: '≤35%', label: 'del aforo del barco' },
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

// ─────────────────────────────────────────────────────────────────────────
// Sección "Experiencia" (bajo la banda de premios) — v3-F18, pedido de Samuel.
//
// El copy es una SÍNTESIS del bloque real de la web actual
// (hispaniolaaquaticadventures.com, "Punta Cana's most complete catamaran
// experience"): 6 párrafos en inglés condensados a 3 frases + un cierre, en
// español (el resto de la home ya es español). NO es copy inventado: es el
// mismo argumento del cliente, resumido.
// ⚠️ Pendiente reconciliar con datos.js (fuente canónica): este texto todavía
// no vive allí (ver CLAUDE.md — copy se porta de datos.js).
//
// v3-F21 (Samuel, 2026-07-16): esta sección ya no solo PROMETE el "no es un
// party boat" — ahora también lo PRUEBA. La prueba vivía en «Diferenciadores»,
// que se ELIMINÓ por redundante: sus 4 verdades ya se decían todas antes
// (coral → aquí + cards de tour + Incluye 01 + reseña de Jessica M.; cocina
// flotante → aquí + Incluye 05 + cards; ≤35% de aforo y 0 plástico → son STATS
// DEL HERO, literales). Además llegaba 3 secciones después de la promesa
// —cuando ToursGrid, WhyDirect e Incluye ya la habían cerrado— y repetía el
// número editorial gigante de IncluyeCrucero (01/…08/) justo debajo de él.
//
// Lo ÚNICO que no vivía en ninguna otra parte de la home era el top-3 de
// restauración de coral → se rescata AQUÍ, en la que era la línea más vaga
// ("rincones que las rutas de siempre no visitan", algo que cualquier catamarán
// de Bávaro podría escribir). Así la frase más débil pasa a cargar el dato más
// duro sin sumar scroll, y encaja con la 1ª foto del collage (el vivero).
// Portado de datos.js: "Arrecife de Cabeza de Toro: proyecto de restauración
// top-3 de RD". El topónimo va en GRIS a propósito — lo que resalta es la
// AFIRMACIÓN (top-3), no el nombre del sitio; así la línea conserva sus 2
// segmentos `fuerte` y no se rompe el ritmo gris/negro.
// ⚠️ La bióloga marina no se repite aquí: ya vive en el chip y la descripción
// de las cards de tour, y en la reseña de Jessica M.
// ⚠️ La auditoría (analisis/auditoria-web-actual.md §7) añade que el proyecto
// está "avalado por Ministerio de Medio Ambiente" — dato fuerte, pero NO está
// en datos.js y no se inventa. Pendiente confirmarlo con el cliente
// (app/PLAN-v3.md §9); si se confirma, su sitio natural es esta misma frase.
//
// Cada frase es un array de segmentos: `fuerte` = navy, resalta; si no, gris
// (navy-sub). El alternado gris/negro del "texto grande" es la referencia que
// aportó Samuel ("Who we are" de Journeo). Cada frase es un bloque para que el
// reveal de scroll (use-experiencia-scroll.ts) las escalone una a una.
export type SegmentoNarrativa = { t: string; fuerte?: boolean }

export const EXPERIENCIA_NARRATIVA: SegmentoNarrativa[][] = [
  [
    { t: 'No es solo un paseo en barco.', fuerte: true },
    { t: ' Es una experiencia caribeña ' },
    { t: 'cuidada al detalle.', fuerte: true },
  ],
  [
    { t: 'Navegamos al arrecife de Cabeza de Toro — uno de los ' },
    { t: '3 mayores proyectos de restauración de coral del país', fuerte: true },
    { t: ' — y comes lo que se ' },
    { t: 'cocina a bordo, recién hecho.', fuerte: true },
  ],
  [
    { t: 'Desde que llegas, ' },
    { t: 'te tratamos como familia', fuerte: true },
    { t: ' — nunca como un pasajero más.' },
  ],
]

export const EXPERIENCIA_KICKER = 'Sin costes ocultos. Sin barcos abarrotados.'

// Fotos REALES de la web actual (no stock). Las 3 cuentan el argumento: el
// vivero de coral (ahora nombrado en el copy: el arrecife de Cabeza de Toro),
// la cocina a bordo (langosta recién servida) y el catamarán fondeado (la
// navegación). Ninguna se repite con la galería del cierre. El ORDEN es el del
// reveal escalonado (fondo → frente).
export type FotoExperiencia = { foto: string; alt: string }

export const EXPERIENCIA_FOTOS: FotoExperiencia[] = [
  { foto: 'galeria-semi-privado-1', alt: 'Huéspedes frente al vivero de coral del proyecto de restauración' },
  { foto: 'galeria-charter-privado-1', alt: 'La tripulación sirviendo langosta recién hecha a bordo' },
  { foto: 'galeria-snorkel-lovers-2', alt: 'El catamarán de Hispaniola fondeado sobre agua turquesa' },
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

// ─────────────────────────────────────────────────────────────────────────
// Sección «Reserva directa» (why-direct v2 — «dos boletos, mismo precio»,
// pedido de Samuel 2026-07-15).
//
// Copy portado de la v1 de la sección (que ya lo había portado del wireframe
// — ver NOTAS['home-why-direct'] del prototipo): los 4 beneficios + el
// reembolso, que SUBE del pie de la sección a 5ª línea del boleto directo.
// Los "iconos" de la v1 (25% / −5% / 🍽 / 💬) se retiran: la metáfora del
// boleto no los necesita.
export type BeneficioDirecto = { id: string; titulo: string; texto: string }

export const BENEFICIOS_DIRECTO: BeneficioDirecto[] = [
  { id: 'deposito', titulo: 'Confirma con 25%', texto: 'Paga el depósito hoy y el resto en efectivo el día del tour.' },
  { id: 'cash', titulo: 'Descuento en cash', texto: '5% extra si el saldo lo pagas en efectivo a bordo.' },
  { id: 'menu', titulo: 'Elige tu menú', texto: 'Langosta, Angus o vegetariano: solo reservando directo eliges plato por persona.' },
  { id: 'whatsapp', titulo: 'WhatsApp directo', texto: 'Hablas con el equipo del barco, no con un call center.' },
  { id: 'reembolso', titulo: 'Reembolso total', texto: 'Por mal clima o cancelando con 7 días.' },
]

// El tour que viaja impreso en los DOS boletos de la comparación: el buque
// insignia (Semi-Privado Premium). Mismo nombre y mismo precio en ambos a
// propósito — la tesis de la sección es que lo que cambia es lo que viene
// DESPUÉS del precio.
export const BOLETO_TOUR = TOURS[0]

// ─────────────────────────────────────────────────────────────────────────
// Sección «Reseñas verificadas» (v5, pedido de Samuel 2026-07-15): video
// del cofundador a la izquierda + 2 reseñas grandes a la derecha, en
// slider vertical auto-rotante. Las reseñas aquí son el bloque que demuestra
// la prueba social — el "link ver más" sigue SIN apuntar a Viator
// (NOTAS['home-reviews'] del prototipo): no regalar tráfico al canal que
// vende el mismo tour.
//
// El link "ver más" sí enlaza a TripAdvisor y Facebook, donde el cliente
// tiene presencia propia y verificable (la auditoría del sitio
// —analisis/auditoria-web-actual.md— los marcó como los 2 canales
// principales de prueba social del cliente).

export type Review = {
  id: string
  /** Línea superior: "Family from New York", "Honeymoon from London"... */
  lugar: string
  texto: string
  autor: string
  plataforma: 'TripAdvisor' | 'Viator' | 'Facebook' | 'Google'
  fecha: string
  estrellas: 5 // todas 5 por ahora — si entran <5, la estrella fraccional la
  //              pinta el componente como en la insignia de confianza
  //              (ui/insignia-confianza.tsx, mismo patrón).
}

// 5 reseñas: número pensado para el slider vertical (con 2 visibles a la vez
// el "salto" entre la última y la primera se ve natural — el contenido es
// distinto pero el ritmo se mantiene). Portadas del prototipo y de reseñas
// reales de la web actual (mismo pool que el cerebro ya tenía aprobado).
// ⚠️ Avatares: NO tenemos fotos de clientes (privacidad). El componente
// pinta iniciales en un círculo aqua-tint — placeholder honesto, no inventado.
export const QUOTES: Review[] = [
  {
    id: 'ny',
    lugar: 'Family from New York',
    texto:
      'El vivero de coral fue lo mejor del viaje — la bióloga nos explicó todo, y la comida a bordo, increíble.',
    autor: 'Jessica M.',
    plataforma: 'Viator',
    fecha: 'jun 2026',
    estrellas: 5,
  },
  {
    id: 'tx',
    lugar: 'Couple from Texas',
    texto:
      'Trato excelente, grupo pequeño como prometían — no como otros catamaranes llenos de gente. Parecía que el barco era solo nuestro.',
    autor: 'Carlos R.',
    plataforma: 'TripAdvisor',
    fecha: 'may 2026',
    estrellas: 5,
  },
  {
    id: 'cdmx',
    lugar: 'Family from Mexico City',
    texto:
      'Reservamos directo por WhatsApp y nos resolvieron todo en minutos. La recogida fue puntual y el barco impecable. Repetiríamos sin dudar.',
    autor: 'Ana P.',
    plataforma: 'Facebook',
    fecha: 'may 2026',
    estrellas: 5,
  },
  {
    id: 'lhr',
    lugar: 'Honeymoon from London',
    texto:
      'Un día perfecto de luna de miel. Snorkel privado, almuerzo romántico en una playa desierta, tripulación atenta. Vale cada euro.',
    autor: 'Sophie L.',
    plataforma: 'TripAdvisor',
    fecha: 'abr 2026',
    estrellas: 5,
  },
  {
    id: 'bcn',
    lugar: 'Family from Barcelona',
    texto:
      'Los niños disfrutaron muchísimo del snorkel con la bióloga marina. El equipo súper atento con ellos. Una experiencia para repetir.',
    autor: 'Marta V.',
    plataforma: 'Google',
    fecha: 'mar 2026',
    estrellas: 5,
  },
]

export type Fundador = {
  /** Frase que aparece bajo el video (en blockquote con border-left coral). */
  frase: string
  nombre: string
  cargo: string
  /** Video a la izquierda. Placeholder: hero.mp4 (catamaran navegando, asset
   *  real del cliente). La referencia pide un video del cofundador hablando
   *  a cámara en primer plano — cuando llegue, se cambia solo este `src`. */
  videoSrc: string
  videoPoster: string
}

export const FUNDADOR: Fundador = {
  frase:
    'Cada huésped que sube a uno de nuestros barcos es parte de la familia. Esa es la diferencia.',
  // Pendiente nombre real del cofundador (de la marca: la marca langosta +
  // "Hispaniola" script). De momento un placeholder honesto, no inventado.
  nombre: 'Los cofundadores',
  cargo: 'Hispaniola Aquatic Adventures · Punta Cana, desde 2012',
  videoSrc: '/video/hero.mp4',
  videoPoster: '/fotos/hero-video-poster.webp',
}
