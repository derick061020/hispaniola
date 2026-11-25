import { traducible } from '@/lib/i18n'
import { BARRAS_EVENTO, type BarraEvento } from '@/data/eventos'

// ────────────────────────────────────────────────────────────────────
// FIESTA ON DECK — las dos experiencias de la nueva marca de party boat
// ────────────────────────────────────────────────────────────────────
//
// [2026-11-24, Sr. Fernando en «Hispaniola Gerencia», tras reunirse con
// Miguel] «Hemos decidido lanzar una nueva marca llamada Fiesta on Deck, con
// dos experiencias diferenciadas: Afro Party Boat y Latin Party». Marketing
// mandó dos landings de referencia, hechas en WordPress:
//   https://hispaniolapartyboat.com/fiesta-on-deck-afro-caribbean/
//   https://hispaniolapartyboat.com/fiesta-on-deck-latin-party/
// con tres instrucciones: (1) mejorar diseño y presentación MANTENIENDO su
// línea visual; (2) que vivan DENTRO de la web de Hispaniola, no como páginas
// de otra web; (3) en el menú Events van estas dos donde estaba Traffic Light.
//
// TODO EL COPY, LOS PRECIOS Y LAS FOTOS DE ESTE ARCHIVO SALEN DE ESAS DOS
// PÁGINAS (24/11, el HTML va embebido en base64 dentro de un iframe; se
// decodificó y se copió literal). Nada se ha inventado. Lo que la referencia
// no dice se deja marcado con ⚠️.
//
// Precio: las dos experiencias venden los MISMOS dos paquetes, y son los del
// tarifario de eventos que ya existe — Snacks = el Starfish/Classic (US$ 660
// hasta 12 + US$ 55 por invitado extra) y Food = el Tide/Grand (US$ 900 + 75).
// Su propio script lo dice: `tour: "party-boat"`, `variants: { snacks:
// "classic", food: "grand" }`. Lo único distinto es el MENÚ del paquete Food
// (Afro Caribbean Classic / Latin Party Menu), y por eso todavía no se cobra
// online: ver `RESERVA_POR_WHATSAPP` más abajo.

export type MarcaFod = 'afro' | 'latin'

export type PaqueteFod = {
  id: 'snacks' | 'food'
  /** rótulo pequeño de la card: «Light bites» / «Full plate» */
  etiqueta: string
  numero: string
  nombre: string
  precioBase: number
  porPersonaExtra: number
  incluye: string[]
}

export type FotoFod = { foto: string; alt: string; rotulo?: string }

export type FiestaOnDeck = {
  marca: MarcaFod
  slug: string
  /** nombre corto de la experiencia (switcher, menú, migaja) */
  nombre: string
  metaTitulo: string
  metaDescripcion: string
  /** frase manuscrita sobre el H1 */
  manuscrito: string
  lead: string
  ctaSecundario: { texto: string; ancla: string }
  /** foto del hero (vertical, en marco inclinado) y su vídeo en bucle */
  heroVideo: string
  heroCartel: string
  pegatinaHero: string
  /** cinta que cruza la página bajo el hero */
  cinta: string[]
  cuatroIntro: string
  cuatro: { titulo: string; texto: string }[]
  sonido: {
    titulo: string
    intro: string
    estilos: string[]
    foto: FotoFod
    tuLista: string
  }
  comida: {
    titulo: string
    intro: string
    manuscrito?: string
    platos: string[]
    foto: FotoFod
  }
  galeria: { instagram: string; fotos: FotoFod[] }
  /** solo Afro: el reel «Watch a real day» */
  diaReal?: { fecha: string; video: string; cartel: string; texto: string }
  /** solo Latin: «Habla como local» */
  jerga?: { palabra: string; significado: string }[]
  cierre: { manuscrito: string; titulo: [string, string] }
  /** texto de «Both include… the X playlist» */
  playlist: string
  menuPaqueteFood: string
}

// ── Lo que es común a las dos (verbatim en las dos referencias) ──────────

export const CHIPS_FOD = [
  '100% private',
  '3 hours on board',
  '2 stops',
  'Celebration decor from US$1,100',
  'Hotel pick-up included',
  'Taxes included',
]

export const PAX_INCLUIDOS_FOD = 12
export const PAX_MAX_FOD = 120
/** Depósito que fija la fecha — «Pay 25% now. The rest is paid on the day». */
export const DEPOSITO_FOD = 0.25
/** Tope de descuentos acumulados en su calculadora (`CAP = 0.15`). */
export const TOPE_DESCUENTO_FOD = 0.15

export const DESCUENTOS_FOD = {
  anticipada: { dias: 30, pct: 0.05, texto: 'Booking 30+ days ahead' },
  efectivo: { pct: 0.05, texto: 'Balance in cash' },
  repetidor: { pct: 0.05, texto: 'Returning guest' },
}

/** Los Celebration Packs: se desbloquean por el total ANTES de descuentos
 *  (su script: `>= 1100` → 1, `> 4500` → 2, `> 6500` → 3). */
export const PACKS_FOD = [
  {
    n: 1,
    desde: 1100,
    rotulo: 'From this value',
    titulo: 'Included',
    items: [
      'Flowers on the rails',
      'Decorative palm trees on the catamaran',
      'Banner: Happy Birthday, Happy Anniversary or Just Married',
      'Toast with house sparkling wine, 1 bottle per 10 guests',
    ],
    eligir: 0,
    opciones: [] as string[],
  },
  {
    n: 2,
    desde: 4500,
    rotulo: 'Over this value',
    titulo: 'Everything in Pack 1, plus choose one',
    items: [],
    eligir: 1,
    opciones: ['DJ on board', 'Two bites (canapés)'],
  },
  {
    n: 3,
    desde: 6500,
    rotulo: 'Over this value',
    titulo: 'Everything in Pack 1, plus choose two',
    items: [],
    eligir: 2,
    opciones: ['DJ on board', 'Champagne toast upgrade · 1 better bottle per 6 guests', 'Two bites (canapés)'],
  },
]

export function packDe(totalBruto: number): number {
  if (totalBruto > 6500) return 3
  if (totalBruto > 4500) return 2
  if (totalBruto >= 1100) return 1
  return 0
}

export const OCASIONES_FOD = [
  'Birthday',
  'Squad trip',
  'Family reunion',
  'Bachelor / bachelorette',
  'Engagement',
  'Company outing',
  'Just because',
]

export const PANCARTAS_FOD = ['Happy Birthday', 'Happy Anniversary', 'Just Married']

export const BUENO_SABER_FOD = [
  { titulo: '25% locks your date', texto: 'The deposit confirms the booking. The balance is paid on the day, in cash or by card.' },
  { titulo: 'Free cancellation', texto: 'Cancel 7 or more days before departure and we refund what you paid.' },
  { titulo: 'Bad weather', texto: 'If sea conditions cancel the day, you reschedule at no cost or get a full refund.' },
  { titulo: 'Pick-up included', texto: 'We collect your group at the hotel and take you back. Taxes are included in the price.' },
  {
    titulo: 'Celebration packs',
    texto: 'From US$1,100: flowers, palm trees, a banner and a toast. Bigger parties add a DJ, bites or champagne. Bring your cake; no balloons.',
  },
  { titulo: 'Bigger crew?', texto: 'Up to 120 guests. We assign the right boat for your group size, same prices.' },
]

/** [2026-11-24] CÓMO SE RESERVA, Y POR QUÉ ASÍ.
 *
 *  Las dos referencias tienen el pago con Stripe preparado pero APAGADO: su
 *  `FOD_CONFIG.mode` es `"whatsapp"` («envía el pedido»), y el modo `"odoo"`
 *  lleva la nota «IT: crear variantes Latin en Odoo». Hoy la venta real entra
 *  por WhatsApp, y aquí se hace igual: la calculadora arma el pedido entero
 *  (paquete, fecha, invitados, extras, banderas) y lo manda al WhatsApp de
 *  reservas.
 *
 *  ⚠️ PENDIENTE (Miguel / Odoo): el funnel de la web (/book/party-boat) YA
 *  cobra el 25 % del Classic y del Grand. Mandar aquí el paquete Food por ese
 *  camino reservaría el menú del Tide (brochetas, tempura, fish sticks) en vez
 *  del Afro Caribbean Classic o el Latin Party Menu, y la cocina prepararía
 *  otra cosa. Cuando existan en Odoo las variantes con esos menús, basta con
 *  cambiar el botón por un <Link> a `/book/party-boat?variante=…`. */
export const RESERVA_POR_WHATSAPP = true

export const WHATSAPP_FOD = '18293052804'
export const WHATSAPP_FOD_TEXTO = '+1 (829) 305-2804'

export function paquetesFod(menuFood: string): PaqueteFod[] {
  return [
    {
      id: 'snacks',
      etiqueta: 'Light bites',
      numero: 'Package 01',
      nombre: 'Snacks',
      precioBase: 660,
      porPersonaExtra: 55,
      incluye: [
        'Fruit skewers',
        'Ham & cheese croissants',
        'Celebration decor from US$1,100',
        'Private boat · 3 h · 2 stops',
        'Hotel pick-up and drop-off',
      ],
    },
    {
      id: 'food',
      etiqueta: 'Full plate',
      numero: 'Package 02',
      nombre: 'Food',
      precioBase: 900,
      porPersonaExtra: 75,
      incluye: [
        menuFood,
        'Celebration decor from US$1,100',
        'Private boat · 3 h · 2 stops',
        'Hotel pick-up and drop-off',
      ],
    },
  ]
}

// ── Afro Caribbean ───────────────────────────────────────────────────────

const AFRO: FiestaOnDeck = {
  marca: 'afro',
  slug: 'fiesta-on-deck-afro',
  nombre: 'Afro Caribbean',
  metaTitulo: 'Fiesta on Deck Afro Caribbean · Private party boat in Punta Cana',
  metaDescripcion:
    'Fiesta on Deck Afro Caribbean: a private party boat in Punta Cana with Afrobeats, Hip-Hop, R&B and Dancehall, Afro Caribbean food on deck and hotel pick-up included. Operated by Hispaniola Aquatic Adventures.',
  manuscrito: 'Punta Cana · private party boat',
  lead: 'A private boat in Punta Cana for you and your crew. Afrobeats, Hip-Hop, R&B and Dancehall on the speakers, Afro Caribbean food on deck, the Caribbean all around. Nobody else on board.',
  ctaSecundario: { texto: 'Watch a real day', ancla: '#fod-dia-real' },
  heroVideo: '/video/fiesta-on-deck/hero-loop.mp4',
  heroCartel: '/fotos/fiesta-on-deck/hero-poster.webp',
  pegatinaHero: 'On deck',
  cinta: ['Your crew', 'Your deck', 'Your playlist', 'Afro Caribbean food', 'Private boat', 'Punta Cana'],
  cuatroIntro:
    'We bring the boat, the sound and the food. You bring the people. That is the whole formula, and it works for birthdays, reunions, squad trips and the trip everyone finally made it to.',
  cuatro: [
    { titulo: 'The whole boat', texto: 'One group per departure. No shared deck, no strangers in your photos.' },
    { titulo: 'The sound', texto: 'Afrobeats, Hip-Hop, R&B and Dancehall from the moment you step on board.' },
    { titulo: 'The food', texto: 'Snacks or the full Afro Caribbean Classic menu, served on deck.' },
    {
      titulo: 'You & your crew',
      texto: 'The inside jokes and the reason you flew here. From US$1,100, we decorate the deck for your celebration.',
    },
  ],
  sonido: {
    titulo: 'Press play.',
    intro: 'Four styles carry the Afro Caribbean party. Tell us your favorite artists when you book and we build the day around them.',
    estilos: ['Afrobeats', 'Hip-Hop', 'R&B', 'Dancehall'],
    foto: { foto: 'n07-baile-cubierta', alt: 'Guests dancing on the deck of a Hispaniola party boat' },
    tuLista:
      'It is your private party: bring your own mix and we play it on deck. Want Amapiano at sunset or old-school R&B for your parents? Add it when you build your party.',
  },
  comida: {
    titulo: 'Afro Caribbean Classic.',
    intro: 'Five plates made for a party: easy to grab between songs, big enough to keep the crew going until the last stop.',
    platos: ['Jamaican jerk chicken wings', 'Mini hamburgers', 'Mini beef empanadas', 'French fries', 'Beef skewers'],
    foto: {
      foto: 'menu-afro-ilustrativa',
      alt: 'Jerk chicken wings, mini burgers, beef empanadas, fries and beef skewers',
    },
  },
  galeria: {
    instagram: 'afropartyboat',
    fotos: [
      { foto: '02-dron-cenital', alt: 'Aerial view of a full party boat on turquoise water', rotulo: 'From above' },
      { foto: 'n01-amigas', alt: 'Two friends smiling on deck' },
      { foto: 'n03-tres-amigos', alt: 'Three friends posing on the boat', rotulo: 'The crew' },
      { foto: 'n05-cocos', alt: 'Guests with fresh coconuts on deck' },
      { foto: 'dec-n01-grupo-celebrando', alt: 'A group celebrating on the bow', rotulo: 'Celebrating' },
      { foto: 'n08-cocos-ron', alt: 'Rum poured into a coconut' },
      { foto: 'n02-proa-desde-arriba', alt: 'Group on the bow with turquoise water behind', rotulo: 'Golden water' },
    ],
  },
  diaReal: {
    fecha: 'October 30, 2026 · real group',
    video: '/video/fiesta-on-deck/reel-afro.mp4',
    cartel: '/fotos/fiesta-on-deck/reel-poster.webp',
    texto: 'One group, one boat, one afternoon in Punta Cana. Turn the sound on: that is how it sounds on deck.',
  },
  cierre: { manuscrito: 'Ready when you are', titulo: ['Your crew.', 'Your deck.'] },
  playlist: 'the Afro Caribbean playlist',
  menuPaqueteFood: 'Afro Caribbean Classic menu, 5 plates',
}

// ── Latin Party ──────────────────────────────────────────────────────────

const LATIN: FiestaOnDeck = {
  marca: 'latin',
  slug: 'fiesta-on-deck-latin',
  nombre: 'Latin Party',
  metaTitulo: 'Fiesta on Deck Latin Party · Private party boat in Punta Cana',
  metaDescripcion:
    'Fiesta on Deck Latin Party: a private party boat in Punta Cana with reggaetón, dembow, bachata and merengue, Latin food on deck and hotel pick-up included. Operated by Hispaniola Aquatic Adventures.',
  manuscrito: '¡Que suene la fiesta!',
  lead: 'A private boat in Punta Cana for you and your crew. Reggaetón, dembow, bachata and merengue on the speakers, empanadas and yuca on deck, and every flag of your group on board. Nobody else on the boat.',
  ctaSecundario: { texto: 'Pick your flag', ancla: '#fod-banderas' },
  heroVideo: '/video/fiesta-on-deck/hero-latin.mp4',
  heroCartel: '/fotos/fiesta-on-deck/hero-latin.webp',
  pegatinaHero: 'En vivo',
  // La cinta de la Latin son los nombres de los países (con su bandera).
  cinta: [],
  cuatroIntro:
    'We bring the boat, the music and the food. You bring the people and the flags. It works for birthdays, despedidas, family reunions and the trip the whole group chat finally agreed on.',
  cuatro: [
    { titulo: 'The whole boat', texto: 'One group per departure. No shared deck, no strangers in your photos.' },
    { titulo: 'The sound', texto: 'Reggaetón, dembow, bachata and merengue from the moment you step on board.' },
    { titulo: 'The food', texto: 'Snacks or the full Latin Party menu, served on deck.' },
    {
      titulo: 'You & your crew',
      texto: 'The inside jokes and the reason you flew here. From US$1,100, we decorate the deck for your celebration.',
    },
  ],
  sonido: {
    titulo: 'Sube el volumen.',
    intro: 'Four rhythms carry the Latin Party. Tell us your favorite artists when you book and we build the day around them.',
    estilos: ['Reggaetón', 'Dembow', 'Bachata', 'Merengue'],
    foto: { foto: 'B-0028', alt: 'Friends celebrating with their arms up on a Hispaniola party boat' },
    tuLista:
      'It is your private party: bring your own mix and we play it on deck. Salsa for the tíos, cumbia for the cousins? Add it when you build your party.',
  },
  comida: {
    titulo: 'Latin Party Menu.',
    intro: 'Five plates straight from the Latin party table: easy to grab between songs, made to keep the crew dancing until the last stop.',
    manuscrito: '¡Buen provecho!',
    platos: ['Mini chicken & cheese empanadas', 'Chicken skewers', 'Mini quesadillas', 'Shrimp-stuffed yuca', 'Fried yuca'],
    foto: {
      foto: 'menu-latin-ilustrativa',
      alt: 'Chicken and cheese empanadas, chicken skewers, quesadillas, shrimp-stuffed yuca and fried yuca',
    },
  },
  galeria: {
    instagram: 'hispaniolapartyboat',
    fotos: [
      { foto: 'B-0022', alt: 'A big group celebrating on the bow of a party boat', rotulo: '¡Tremendo coro!' },
      { foto: 'B-0003', alt: 'Friends in cowboy hats on the bow' },
      { foto: 'B-0011', alt: 'A guest smiling in a hat on board', rotulo: 'Despedida' },
      { foto: 'B-0033', alt: 'Friends in hats with coconuts' },
      { foto: 'B-0002', alt: 'A group with their arms up on the bow', rotulo: 'Arms up' },
      { foto: 'B-0006', alt: 'Bachelorette group in cowboy hats' },
      { foto: 'B-0073', alt: 'A large group celebrating over turquoise water', rotulo: 'Agua de Saona' },
    ],
  },
  jerga: [
    { palabra: '¡Wepa!', significado: "Yes! Let's go! The cheer when your song comes on." },
    { palabra: '¡Dale!', significado: 'Go for it. Turn it up. Pour another one.' },
    { palabra: '¿Qué lo que?', significado: 'Dominican for "what\'s up?". Answer: "¡Tranquilo!"' },
    { palabra: 'Coro', significado: 'Dominican for a hangout with friends. "Tremendo coro" = an amazing party.' },
    { palabra: 'Vacilón', significado: 'A really good time. What this boat is for.' },
    { palabra: 'Perreo', significado: 'The reggaetón dance. No lessons needed.' },
    { palabra: 'Jevi', significado: 'Dominican for "cool". The view from the bow is jevi.' },
    { palabra: "Pa'lante", significado: 'Forward. Keep going. Next stop!' },
  ],
  cierre: { manuscrito: '¡Dale, que esto se prende!', titulo: ['Your crew.', 'Your flag.'] },
  playlist: 'the Latin Party playlist',
  menuPaqueteFood: 'Latin Party menu, 5 plates',
}

/** Las 19 banderas de la referencia Latin, en su orden. El SVG de cada una
 *  está en /fotos/fiesta-on-deck/banderas/<código>.svg — dibujado con las
 *  mismas formas y colores que su script (se portó a mano, no se ejecutó). */
export const BANDERAS_FOD: { codigo: string; nombre: string }[] = [
  { codigo: 'do', nombre: 'Dominican Republic' },
  { codigo: 'pr', nombre: 'Puerto Rico' },
  { codigo: 'mx', nombre: 'Mexico' },
  { codigo: 'co', nombre: 'Colombia' },
  { codigo: 've', nombre: 'Venezuela' },
  { codigo: 'cu', nombre: 'Cuba' },
  { codigo: 'ar', nombre: 'Argentina' },
  { codigo: 'pe', nombre: 'Peru' },
  { codigo: 'cl', nombre: 'Chile' },
  { codigo: 'ec', nombre: 'Ecuador' },
  { codigo: 'pa', nombre: 'Panama' },
  { codigo: 'cr', nombre: 'Costa Rica' },
  { codigo: 'hn', nombre: 'Honduras' },
  { codigo: 'gt', nombre: 'Guatemala' },
  { codigo: 'sv', nombre: 'El Salvador' },
  { codigo: 'ni', nombre: 'Nicaragua' },
  { codigo: 'uy', nombre: 'Uruguay' },
  { codigo: 'py', nombre: 'Paraguay' },
  { codigo: 'bo', nombre: 'Bolivia' },
]

export const FIESTAS_ON_DECK: Record<string, FiestaOnDeck> = traducible({
  'fiesta-on-deck-afro': AFRO,
  'fiesta-on-deck-latin': LATIN,
})

export const SLUGS_FOD = ['fiesta-on-deck-afro', 'fiesta-on-deck-latin'] as const

// LA CARTA DE CÓCTELES DE CADA TEMÁTICO.
//
// [2026-11-25, Sr. Fernando, Gerencia 15:01: «habría unos cambios en la
// coctelería de los party boats temáticos»] Los niveles, los precios y las
// botellas son los de siempre (BARRAS_EVENTO: Included / +15 / +30). Lo que
// cambia es la lista de cócteles y el trago de bienvenida de Signature:
// Afro va centrada en el ron, con inspiración jamaicana, y Latin en los
// clásicos latinos con sello dominicano. Las listas son literales de su
// documento.
const CARTA_FOD: Record<MarcaFod, { intro: string; cocteles: Record<string, string[]>; bienvenida: string }> = {
  afro: {
    intro: 'A rum-led menu with Jamaican inspiration: the Caribbean Rum Punch opens it, and the Sorrel & Ginger Rum Punch, with hibiscus and ginger, is the star.',
    cocteles: {
      caribbean: ['Caribbean Rum Punch', 'Cuba Libre', 'Pineapple & Vodka', 'Whisky & Coke'],
      'caribbean-plus': ['Sorrel & Ginger Rum Punch', 'Caribbean Rum Punch', 'Rum & Ginger', 'Grapefruit Rum Fizz', 'Piña Colada'],
      signature: ['Sorrel & Ginger Rum Punch', 'Aged Rum Punch', 'Rum & Ginger', 'Grapefruit Rum Fizz', 'Piña Colada'],
    },
    bienvenida: 'A Hibiscus & Ginger Fizz with prosecco the moment you step on board',
  },
  latin: {
    intro: 'Latin classics with a Dominican touch: the Paloma opens the menu, and passion fruit (chinola) ties the two upper levels together.',
    cocteles: {
      caribbean: ['Paloma', 'Cuba Libre', 'Tequila Sunrise', 'Whisky & Coke'],
      'caribbean-plus': ['Chinola Mojito', 'Classic Mojito', 'Margarita', 'Paloma', 'Piña Colada'],
      signature: ['Chinola Mojito', 'Tamarind Margarita', 'Paloma', 'Piña Colada', 'Dominican Chinola Daiquiri'],
    },
    bienvenida: 'A Chinola Mimosa with prosecco the moment you step on board',
  },
}

/** Las tres barras de evento con la carta de cócteles del temático. */
export function barrasFod(marca: MarcaFod): BarraEvento[] {
  const carta = CARTA_FOD[marca]
  return BARRAS_EVENTO.map((b) => ({
    ...b,
    cocteles: carta.cocteles[b.id] ?? b.cocteles,
    bienvenida: b.bienvenida ? carta.bienvenida : undefined,
  }))
}

export const introCartaFod = (marca: MarcaFod) => CARTA_FOD[marca].intro
