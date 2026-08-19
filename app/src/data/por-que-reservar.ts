import { TOURS, STATS, RESENAS_AGREGADO } from './home'
import { numero, t, traducible } from '@/lib/i18n'

// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /por-que-reservar — la página que el cliente pidió detrás de
//  su insignia amarilla «¿POR QUÉ RESERVAR CON NOSOTROS? PRESIONE AQUÍ»
//  (correcciones v2, slides 50-56 del PDF; plan en
//  docs/proceso/correcciones-v2-cliente/planes/07-por-que-reservar.md).
//
//  SUSTITUYE a la vieja /reserva-directa, que eran 30 líneas de hero + dos
//  boletos y se retiró entera (2026-07-28, Samuel: «está horrible»).
//
//  ⚠️ NO ES UNA PÁGINA PARA RETENER. El cliente fue explícito en la reunión
//  del 07-24 (33:30): «no es tampoco para que la gente se vaya mucho ahí, pero
//  sí que, si lo pinchan, que sepan por qué», y remató (33:52): «sobre todo
//  que haya mucho botón que vaya a la pestaña de Tours». Por eso cada bloque
//  cierra con su propia salida a /#tours y el contenido está pensado para
//  ESCANEARSE (fotos + cifras + tabla), no para leerse de corrido.
// ─────────────────────────────────────────────────────────────────────────────

/** El precio que la página defiende. Sale del catálogo (Snorkel Lovers, la
 *  tarifa adulto que también publica Viator), no de una constante suelta: si
 *  mañana cambia el precio del tour, cambia aquí y en el desglose a la vez. */
export const PRECIO_TODO_INCLUIDO =
  TOURS.find((t) => t.slug === 'snorkel-lovers')?.precioLight ?? 114

export type Kpi = { valor: string; label: string }

// Los 4 KPIs del hero (slide 52). El 3º no está aquí: es el SELLO real de
// TripAdvisor (ui/sello-tripadvisor.tsx), que ya dice «#1 en TripAdvisor · 7
// años seguidos» con la imagen del premio — una cifra de texto al lado del
// sello real sería decir lo mismo dos veces y con menos fuerza.
//
// ⚠️ CIFRAS: la maqueta del cliente pone 302.997 clientes / 4.466 días. El
// repo dice 91.607 / 4.454 (STATS, data/home.ts). No es un descuido de
// ninguno de los dos: la web actual del cliente SE CONTRADICE A SÍ MISMA
// desde la auditoría del 2026-07-13 — «90.498 clientes / 1.336 días» en el
// encabezado de why-book-with-us.php y «301.661 / 4.456» en el párrafo de
// debajo. Su maqueta tomó el par grande; el repo, el chico.
// Se pintan las de STATS a propósito: son las MISMAS que la home, así que en
// todo el sitio hay UNA sola verdad. Poner 302.997 aquí mientras la home dice
// 91.607 sería peor que cualquiera de las dos por separado. Si Fernando
// confirma las grandes, se cambian en STATS y se propagan solas.
// [2026-08-19] Los tres van con GETTER, no con valor. Este módulo se evalúa
// UNA vez, al importarse, y tanto `STATS` como el formato del número dependen
// del idioma que se esté leyendo: resueltos aquí se congelarían en el idioma
// con el que se cargó la página y cambiar al otro no movería estas tres cifras.
// Con getter se resuelven en cada lectura, que es cuando se pintan.
export const KPIS: Kpi[] = traducible([
  {
    get valor() { return STATS[0].valor },
    get label() { return STATS[0].label },
  },
  {
    get valor() { return STATS[1].valor },
    get label() { return STATS[1].label },
  },
  // useGrouping: 'always' — el español pone el separador de millares a partir
  // de 5 cifras (minimumGroupingDigits = 2), así que sin esto 1782 se pinta
  // «1782» y el resto del sitio dice «1.782» (footer, flota, reseñas).
  {
    valor: RESENAS_AGREGADO.rating,
    get label() {
      return `${numero(RESENAS_AGREGADO.total, { useGrouping: 'always' })} ${t('reviews')}`
    },
  },
])

export type ConceptoSuelto = {
  id: string
  nombre: string
  /** qué es, en 3-5 palabras — para que el precio no vaya desnudo */
  nota: string
  /** lo que costaría contratarlo por separado, en US$ */
  importe: number
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  fotoAlt: string
}

// «Lo que pagarías suelto» (slide 53) — la mejor idea del PowerPoint del
// cliente, y la que cierra un hueco que la auditoría detectó el PRIMER día del
// proyecto (2026-07-11): «Viator vende el mismo tour al mismo precio → falta
// bloque why book direct». El sitio llevaba desde entonces diciendo «reserva
// directo» sin demostrar NUNCA en dinero por qué.
//
// ⚠️ SON PRECIOS DE REFERENCIA DEL MERCADO, NO FACTURAS NUESTRAS, y la letra
// pequeña del bloque lo dice: si alguien audita el «almuerzo de mariscos US$
// 50» y le parece generoso, el argumento entero se vuelve en contra. Una cifra
// con su origen declarado es más creíble que una cifra desnuda. Pendiente de
// que Fernando confirme que cada importe es defendible.
//
// La suma NO se escribe: se calcula en el componente. Si mañana cambia un
// concepto, el total y el ahorro se recalculan solos y no pueden contradecir
// a la lista de arriba.
export const CONCEPTOS_SUELTOS: ConceptoSuelto[] = traducible([
  {
    id: 'charter',
    nombre: '4-hour charter',
    nota: 'Boat, crew, drinks and appetizers',
    importe: 75,
    foto: 'hero-catamaran-1',
    fotoAlt: 'Hispaniola catamaran sailing off the coast of Bávaro',
  },
  {
    id: 'snorkel',
    nombre: 'Snorkeling trip',
    nota: 'Gear, guide and a stop at the reef',
    importe: 30,
    foto: 'galeria-semi-privado-4',
    fotoAlt: 'Guest snorkeling among sergeant major fish over the reef',
  },
  {
    id: 'almuerzo',
    nombre: 'Seafood lunch',
    nota: 'Cooked on board, in the floating kitchen',
    importe: 50,
    foto: 'plato-mariscos',
    fotoAlt: 'Seafood plate (lobster, octopus and shrimp) freshly made on board',
  },
  {
    id: 'bebidas',
    nombre: 'Name-brand drinks',
    nota: 'Aged rum, local beer, soft drinks',
    importe: 10,
    foto: 'bar-flotante',
    fotoAlt: 'The catamaran bar during drink service',
  },
  {
    id: 'coco-loco',
    nombre: 'Coco Loco on the beach',
    nota: 'The local cocktail, at the beach stop',
    importe: 5,
    foto: 'galeria-charter-privado-4',
    fotoAlt: 'The catamaran anchored off a palm-lined beach',
  },
  {
    id: 'fotos',
    nombre: 'Tour photos',
    nota: 'All day long, GoPro included on the snorkel stop',
    importe: 20,
    foto: 'galeria-snorkel-lovers-9',
    fotoAlt: 'Family on deck during a tour activity',
  },
])

export type FilaCaraACara = {
  concepto: string
  nosotros: string
  otros: string
  /** Foto REAL de lo nuestro, cuando la hay. Sin ella la fila va sólo con
   *  texto — y no pasa nada: cuatro de las seis la tienen, que es suficiente
   *  para que el bloque se vea, y rellenar las otras dos con una foto que no
   *  es de eso sería peor que dejarlas sin foto.
   *  ⚠️ La columna «otros tours» NO lleva foto NUNCA. No tenemos fotos de la
   *  competencia y no se inventan: ese lado es un hueco rayado a propósito. */
  foto?: string
  fotoAlt?: string
}

// Tabla «Nosotros vs. los otros tours» (slide 54), con UNA corrección: la fila
// «cocina a bordo» venía VACÍA en las dos columnas de su maqueta. Es un
// descuido de la IA con la que la hizo, y justo ahí está el argumento más
// fuerte que tiene la empresa — la única cocina flotante de Punta Cana. Se
// rellena, no se copia el hueco.
export const CARA_A_CARA: FilaCaraACara[] = traducible([
  {
    concepto: 'Seafood',
    nosotros: 'Fresh, caught that day',
    otros: 'Frozen',
    foto: 'plato-mariscos',
    fotoAlt: 'Seafood plate (lobster, octopus and shrimp) freshly made on board',
  },
  {
    concepto: 'Drinks',
    nosotros: 'Name-brand, never watered down',
    otros: 'Watered down',
    foto: 'bar-flotante',
    fotoAlt: 'The catamaran bar during drink service',
  },
  {
    concepto: 'Cooking on board',
    nosotros: 'The only floating kitchen in Punta Cana',
    otros: 'Reheated food',
    foto: 'cocina-flotante',
    fotoAlt: 'The floating kitchen grill in action',
  },
  {
    concepto: 'Tour photos',
    nosotros: 'Included, snorkeling shots too',
    otros: 'Charged separately',
    foto: 'galeria-snorkel-lovers-9',
    fotoAlt: 'Family on deck during a tour activity',
  },
  // Las dos sin foto van al final a propósito: así el bloque ABRE con cuatro
  // duelos que se ven y remata con dos que se leen, en vez de intercalar
  // huecos entre las fotos y parecer que faltan imágenes.
  { concepto: 'Hotel transfer', nosotros: 'Air-conditioned bus', otros: 'Open-air vehicle' },
  { concepto: 'Booking', nosotros: 'Direct with the owner', otros: 'Through a middleman' },
])

export type GrupoRazones = {
  id: string
  titulo: string
  /** el titular del grupo — lo que se lee cuando NO se leen las razones */
  resumen: string
  razones: string[]
  /** nombre de archivo en /fotos (sin extensión). Sin foto = tile tipográfico. */
  foto?: string
  fotoAlt?: string
}

// Las 19 razones del slide 55 — las 19, porque el cliente las quiere todas,
// pero AGRUPADAS en 5 bloques temáticos con foto en vez de un muro de 19 cards
// iguales.
//
// Por qué agrupadas, que no es capricho: en la v3 se ELIMINÓ la sección
// «Diferenciadores» de la home con este razonamiento (pages/home.tsx): «sus 4
// verdades ya se decían todas antes y su número editorial gigante repetía el
// de IncluyeCrucero justo encima». Y del diagnóstico del hero cargado salió el
// principio general: «un hero cargado casi siempre es N lenguajes de confianza
// compitiendo → una prueba por trabajo». 19 cards seguidas es exactamente eso
// en formato lista: nadie las lee, se ven como una pared y se saltan. Además
// varias se solapaban en su propia maqueta («la mejor ubicación» y «en el
// centro de la zona hotelera» son la misma; «sin mareos» es consecuencia de la
// ubicación).
export const RAZONES: GrupoRazones[] = traducible([
  {
    id: 'comida',
    titulo: 'The food',
    resumen: 'The only floating kitchen in Punta Cana, cooking while you sail.',
    foto: 'cocina-flotante',
    fotoAlt: 'The floating kitchen grill in action',
    razones: [
      'Fresh seafood, never frozen',
      'Name-brand drinks only, never watered down',
      'Certified cooking platform',
      'Cooked on board, not reheated',
    ],
  },
  {
    id: 'barco',
    titulo: 'The boat',
    resumen: 'Our own catamarans, room to spare and everything in order.',
    foto: 'flota-forever-teresa',
    fotoAlt: 'The catamaran Forever Teresa from the Hispaniola fleet',
    razones: [
      'Truly semi-private: 25 people max on a boat built for 70',
      'Clean, well-maintained boats',
      'Boarding platform: easy to get in and out of the water',
      'Clean restrooms on board',
      'No seasickness, good for the whole family',
    ],
  },
  {
    id: 'ubicacion',
    titulo: 'The location',
    resumen: 'In the middle of the hotel zone, with the reef a step away.',
    foto: 'galeria-snorkel-lovers-3',
    fotoAlt: 'Structures of the Cabeza de Toro coral nursery surrounded by fish',
    razones: [
      'In the middle of the hotel zone',
      'Transfers in an air-conditioned bus',
      'Snorkeling at a real coral nursery, not just any spot',
    ],
  },
  {
    id: 'reserva',
    titulo: 'The price and the booking',
    resumen: 'You talk to the owner. There’s no commission to pay in between.',
    razones: [
      'Book direct with the owner',
      'Tour photos included',
      'Half-day trip: your afternoon stays free',
    ],
  },
  {
    id: 'personas',
    titulo: 'People and the planet',
    resumen: 'A legal company, a well-paid crew and a reef that keeps growing.',
    // Foto REAL de huéspedes en el agua junto al catamarán. Aquí NO sirve
    // equipo-capitan (el retrato de la tripulación): es un recorte de estudio
    // sobre fondo liso, y en una cabecera de card a sangre se lee como un
    // pegote de stock justo en el bloque que habla de las personas.
    foto: 'galeria-semi-privado-6',
    fotoAlt: 'Group of guests in the water next to the Hispaniola catamaran',
    razones: [
      'Legal and insured, with every license',
      'Respectful of the environment',
      'Fair pay for our staff',
      'Multilingual team',
    ],
  },
])

/** Las 19 se cuentan, no se escriben — si mañana se añade o se quita una, el
 *  titular de la sección no se queda mintiendo. */
export const TOTAL_RAZONES = RAZONES.reduce((s, g) => s + g.razones.length, 0)

// El cierre del slide 56. «Cabeza de Toro» (el repo) y «Cabo Engaño» (la
// maqueta) conviven en el propio texto del cliente —«Cabeza de Toro, un parque
// natural en las aguas cristalinas del Cabo Engaño»— y así se mantienen: el
// arrecife es Cabeza de Toro, la punta es Cabo Engaño.
//
// El argumento de la ubicación como VENTAJA competitiva no estaba dicho en
// ninguna parte del sitio, y «no pierdes hora y media en bus» es una objeción
// real de comprador que hoy no contesta nadie.
export const UBICACION = traducible({
  eyebrow: 'Location, location, location',
  titulo: 'The best spot on the coast, with no endless drives',
  texto:
    'We take you to Cabeza de Toro, a natural park in the crystal-clear waters of Cabo Engaño: the best reef in the area for snorkeling. And we leave from the middle of the hotel zone, so your day starts when you step on board.',
  /** El dato que hace de titular visual del bloque. */
  cifra: '1½ h',
  cifraLabel: 'of bus time you don’t lose before you start',
  claves: [
    'Inside the reef: calm water, no seasickness',
    'Good sea conditions all year round',
    'Minutes from your hotel, not across the island',
  ],
  foto: 'arrecife-fondo-cenital',
  fotoAlt: 'Aerial view of the Cabeza de Toro reef with the turquoise water of Cabo Engaño',
} as const)

export const CIERRE = traducible({
  eyebrow: 'Ready?',
  titulo: 'See you on the beach',
  texto:
    'Book direct with us and get all of this for a fair price. No middlemen, no surprises. Just the best day at sea in Punta Cana.',
  letraPequena: 'Legal, insured company · every tourism license in Punta Cana-Bávaro',
  foto: 'hero-catamaran-2',
  fotoAlt: 'Hispaniola catamaran at sunset off the coast of Punta Cana',
} as const)
