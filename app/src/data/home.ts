// Contenido de la home — portado de prototipo/datos.js (fuente canónica).
// Solo se incluyen los campos que la HOME usa; el resto de la ficha de tour
// (itinerario, incluye, FAQ propia…) no es parte de este build (ver PLAN.md).

import { WHATSAPP_URL } from '@/data/tours'

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
  /** Snorkel Lovers v3 (2026-07-17): tarifa infantil cuando el tour vende
   *  por adulto+niño (la web del cliente publica 2 precios separados solo
   *  para este tour familiar — US$ 114 adulto / US$ 65 niño). Ausente en
   *  el resto: el widget pinta 1 stepper «Personas» con `precioLight ×
   *  personas` (modelo clásico). Cuando está presente, el widget pinta 2
   *  steppers «Adultos» + «Niños» y calcula el total como
   *  `adultos × precioLight + niños × precioNino`. El Premium (+upgrade) se
   *  suma a AMBOS — el menú Premium es el mismo plato, no hay tarifa
   *  infantil diferenciada en la web. */
  precioNino?: number | null
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
    slug: 'semi-private-premium',
    nombre: 'Semi-Private Premium',
    audienciaChip: 'Adults only',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    maxPax: 25,
    precioLight: 99,
    booking: 'completo',
    // [v3 2026-08-06] Copy APROBADO por el cliente (WEBSITE - INICIO, pág. 2).
    descripcionCorta:
      'An intimate adults-only Caribbean experience featuring protected reef snorkeling, an exclusive underwater museum, a secluded beach, and chef-prepared cuisine from our floating kitchen.',
    foto: 'tour-semi-privado',
    galeria: [
      'galeria-semi-privado-1',
      'galeria-semi-privado-2',
      'galeria-semi-privado-3',
      'galeria-semi-privado-4',
      'galeria-semi-privado-5',
    ],
    // Los chips salen de la «tagline» que el cliente puso tras el asterisco
    // en el mismo copy aprobado: «Limited guests. Adults only. Protected
    // reefs, underwater museum, floating kitchen, and personalized service.»
    destacados: ['Limited guests', 'Underwater museum', 'Floating kitchen'],
  },
  {
    slug: 'snorkel-lovers',
    nombre: 'Snorkel Lovers',
    audienciaChip: 'All ages',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    // v3 (2026-07-17): el «Max. Capacity: 30» de la web del cliente + precio
    // tarifa dual Adulto US$ 114 / Niño US$ 65 (la web publica 2 tarifas
    // separadas solo para este tour familiar — el resto del catálogo es 1
    // precio por persona). El widget detecta `precioNino` y pinta 2 steppers
    // «Adultos» + «Niños» con icono Baby en el de niños.
    maxPax: 30,
    precioLight: 114,
    precioNino: 65,
    booking: 'completo',
    // [v3] Copy APROBADO (WEBSITE - INICIO, pág. 2).
    descripcionCorta:
      'An all-ages experience where coral restoration, symbolic coral planting, an exclusive underwater museum, and protected reefs inspire unforgettable memories.',
    foto: 'tour-snorkel-lovers',
    galeria: [
      'galeria-snorkel-lovers-1',
      'galeria-snorkel-lovers-2',
      'galeria-snorkel-lovers-3',
      'galeria-snorkel-lovers-4',
      'galeria-snorkel-lovers-5',
    ],
    // Tagline del cliente: «Limited guests exploring coral restoration, our
    // underwater museum, protected reefs, and crystal-clear waters.»
    destacados: ['Coral restoration', 'Underwater museum', 'Protected reefs'],
  },
  {
    slug: 'private-charter',
    nombre: 'Private Charter',
    audienciaChip: 'Private group',
    // [v2 2026-07-28, plan 01 §7 — slide 2] «3-4 h» → «3 o 4 h», por el mismo
    // motivo que `duracion` en data/tours.ts: la duración se elige con el
    // barco, no es un rango aproximado.
    duracionCorta: '3 or 4 h',
    rating: 4.9,
    resenas: 1782,
    // [v3 2026-08-06] 85, no 120: el copy aprobado (WEBSITE-TOURS pag. 17)
    // fija el aforo del Forever Teresa, que es el barco grande del charter y
    // el que marca el maximo de la ficha. Alimenta la card del grid y el
    // ticker («max. 85»).
    maxPax: 85,
    // v3 (2026-07-17, charter completo): ancla "desde" — el precio público
    // más bajo de la tabla es US$ 75/pax (Forever Teresa 30-85 pax). El
    // widget pinta 4 sub-variantes (Maite, GrandMa, Santa Maria, Forever
    // Teresa) y el cálculo real se hace con la tabla de cada bote según
    // pax. booking pasa de 'cotizacion' a 'completo' (4 botes, no se
    // cotiza aparte — el cliente puede ver y calcular el precio en el
    // widget; el "a medida" del menú sí se coordina aparte).
    precioLight: 75,
    booking: 'completo',
    // [v3] Copy APROBADO (WEBSITE - INICIO, pág. 2).
    descripcionCorta:
      'Your boat. Your people. Private charters with catamarans for every group size, style, and budget.',
    foto: 'tour-charter-privado',
    galeria: [
      'galeria-charter-privado-1',
      'galeria-charter-privado-2',
      'galeria-charter-privado-3',
      'galeria-charter-privado-4',
      'galeria-charter-privado-5',
    ],
    destacados: ['Whole boat', 'Menu your way', 'Dedicated coordinator'],
  },
  {
    slug: 'saona-island',
    nombre: 'Saona Island',
    // v3 (2026-07-17, petición de Samuel al reemerger como producto completo):
    // Saona deja de ser "pendiente de confirmar" y se publica con su contenido
    // real de la web del cliente. Pasa de booking 'consulta' a 'completo'
    // (3 sub-variantes: speedboat / fishing town / catamarán — ver
    // FICHAS['saona-island'].subVariantes en data/tours.ts). precioLight es la
    // ancla "desde" en el widget: el speedboat para 6 pax son US$ 1.100 grupo,
    // ~US$ 184 por persona. Es un ancla visual (no un precio por persona real,
    // porque Saona se vende por GRUPO — el widget lo recalcula por tramo al
    // elegir variante y pax).
    audienciaChip: 'Full day',
    duracionCorta: 'full day',
    rating: 4.9,
    resenas: 1782,
    maxPax: 70,
    precioLight: 184,
    booking: 'completo',
    // [v3] Copy APROBADO (WEBSITE - INICIO, pág. 2).
    descripcionCorta:
      'Paradise made personal. White-sand beaches, turquoise waters, private charters, and unforgettable Saona Island experiences.',
    foto: 'tour-isla-saona',
    galeria: [
      'galeria-isla-saona-1',
      'galeria-isla-saona-2',
      'galeria-isla-saona-3',
      'galeria-isla-saona-4',
      'galeria-isla-saona-5',
    ],
    destacados: ['Speedboat or catamaran', 'Natural pool + buffet', 'Full day'],
  },
]

export const bookingCta: Record<Tour['booking'], string> = {
  completo: 'Book now',
  cotizacion: 'Get a quote',
  consulta: 'Enquire',
}

export type Plato = { id: string; nombre: string; desc: string; foto: string }

export const PLATOS: Plato[] = [
  { id: 'mariscos', nombre: 'Seafood', desc: 'Lobster, octopus, shrimp', foto: 'plato-mariscos' },
  { id: 'carne', nombre: 'Beef', desc: 'Certified Angus', foto: 'plato-carne' },
  { id: 'surf-turf', nombre: 'Surf & Turf', desc: 'Lobster + Angus', foto: 'plato-surf-turf' },
  { id: 'vegetariano', nombre: 'Vegetarian', desc: 'Zucchini ceviche', foto: 'plato-vegetariano' },
]

export type Ocasion = {
  tipo: string
  nombre: string
  meta: string
  /** landings propias (Bodas, MICE) vs. deep-link al formulario del hub de eventos */
  esLanding: boolean
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  /** slug de la landing real (/eventos/:slug) — solo las 2 con esLanding.
   *  «Eventos y party boat» (el ítem genérico) va al formulario del hub, que
   *  vive en el prototipo. */
  slug?: string
}

// LOS 3 EVENTOS de la web actual, en su mismo orden (decisión de Samuel
// 2026-07-17, mapa-del-sitio.md §"EVENTS & CELEBRATIONS"): la web vieja tiene
// SOLO 3 ítems de evento — «Events & Party Boat», «Pre-Post Wedding
// Celebrations» y «MICE» — así que la nueva no debe inventar más. Las 3
// tienen ahora landing propia (los 3 slugs en español son consistentes con el
// resto del sitio, ver PLAN-EVENTOS.md). Anteriormente el genérico
// «Eventos y party boat» iba al formulario del hub — ahora tiene su landing
// `/events/party-boat` (clone de ficha de tour con widget de cotización),
// que es lo que pidió Samuel el 2026-07-17.
//
// Bodas y MICE ya correspondían 1:1 al viejo y conservan su landing propia
// (migradas de la plantilla de "persuasión" a la nueva de "clon de tour").
//
// Fotos PROVISIONALES: no existe shooting propio de eventos, así que se
// reutilizan fotos reales de la galería de charter-privado que mejor encajan
// con cada ocasión. Pendiente pedirle al cliente fotos reales de eventos
// (ver app/PLAN-v3.md §9).
export const OCASIONES: Ocasion[] = [
  {
    tipo: 'eventos',
    nombre: 'Events & party boat',
    meta: 'Birthdays, anniversaries, bachelor parties and reunions. The whole boat.',
    esLanding: true,
    foto: 'galeria-charter-privado-2',
    slug: 'party-boat',
  },
  {
    tipo: 'boda',
    nombre: 'Weddings & pre-wedding',
    meta: 'Ceremony, welcome party or a send-off for the group.',
    esLanding: true,
    foto: 'galeria-charter-privado-5',
    slug: 'weddings',
  },
  {
    tipo: 'mice',
    nombre: 'Corporate / MICE',
    meta: 'Incentives, team building, convention closings.',
    esLanding: true,
    foto: 'galeria-charter-privado-3',
    slug: 'corporate',
  },
]

// [v3 2026-08-06] Aqui vivian `EventoEspecial` y `EVENTOS_ESPECIALES` (la
// vitrina de 4 boxes Cumpleanos/Bodas/Aniversarios/Despedidas del final de
// la home). El cliente pidio ELIMINAR esa seccion (WEBSITE - INICIO pag. 5,
// «REMOVE:»), y su unico consumidor era home/eventos-especiales.tsx, que se
// borra con ella. Contenido completo en el tag `v3-pre-en`.

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
// [v3 2026-08-06, WEBSITE - INICIO págs. 4-5] Los 8 ítems APROBADOS por el
// cliente, en SU orden y con SU numeración (01 Transportation … 08 GoPro).
// Reemplazan a los 8 anteriores: siguen siendo 8, así que la composición de
// 2 columnas de 4 a cada lado del catamarán no cambia.
//
// ⚠️ Dos ítems que estaban y ya no: «Entretenimiento a bordo» y «Playa
// desierta» — el cliente los sustituye por «Coral Interpretation Center» y
// «Marine Sanctuary». La playa sigue contada en el itinerario de cada ficha.
// Los `id` se mantienen en español donde el concepto es el mismo: son claves
// internas (orden y `key` de React), no texto visible.
export const INCLUYE_CRUCERO: IncluyeItem[] = [
  {
    id: 'transporte',
    titulo: 'Transportation',
    texto: 'Air-conditioned vans with pick-ups from no more than three hotels (shared tours).',
  },
  {
    id: 'coral',
    titulo: 'Coral Interpretation Center',
    texto: 'Discover the fascinating world of corals and how we help restore Caribbean reefs.',
  },
  {
    id: 'entretenimiento',
    titulo: 'Onboard Experience',
    texto: 'Our experienced crew keeps the atmosphere fun, relaxed, and unforgettable.',
  },
  {
    id: 'snorkel',
    titulo: 'Marine Sanctuary',
    texto: 'Experience snorkeling in a protected reef with an underwater museum and coral restoration.',
  },
  {
    id: 'piscina',
    titulo: 'Natural Pool',
    texto: 'Relax in crystal-clear shallow waters and discover our artificial reef snorkeling area.',
  },
  {
    id: 'comida',
    titulo: 'Floating Kitchen',
    texto: 'An exclusive live cooking experience with fresh seafood and gourmet menu choices.',
  },
  {
    id: 'bebidas',
    titulo: 'Open Bar',
    texto:
      'Unlimited Presidente beer (local beer), premium aged rum, vodka, tequila, tropical juices, refreshments, soft drinks (light and regular) and bottled water.',
  },
  {
    id: 'fotos',
    titulo: 'GoPro Memories',
    texto: 'GoPro photos and videos uploaded to Facebook for free download after your tour.',
  },
]

export function formatoDinero(n: number | null): string {
  if (n === null) return '—'
  return 'US$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export type ItemNav = {
  id: string
  nombre: string
  descripcion: string
  /** ruta real (Link SPA) — sin ella el ítem es placeholder del prototipo */
  to?: string
}

// Nosotros (PLAN-v3.md §12.2) — fuente: TRIPULACION (4 roles) + FLOTA (3
// entradas) del prototipo para el primer ítem. El segundo, "El arrecife que
// reconstruimos", ya NO cuenta la historia en el menú: es solo una MENCIÓN +
// botón a /sostenibilidad, donde vive toda la info (conservación, coral,
// tortugas, los 7 videos). Sostenibilidad tuvo brevemente su propio tab en el
// menú principal (2026-07-17); se revirtió el mismo día (Samuel: "quita
// sostenibilidad del menú principal, porque ya lo tenemos en nosotros como
// subtab") — este ítem es ahora su ÚNICA entrada en la navegación principal
// (desktop y móvil). El icono se mapea por `id` en item-menu.tsx (presentación,
// no contenido — así este archivo no importa React).
// [v2 2026-07-27] REESCRITO por las correcciones v2 (plan 02 §1). El cliente
// dictó el menú nuevo en la reunión del 07-24 (26:43): «Inicio, Nosotros,
// Tours, Eventos, Sostenibilidad y Ayuda. Debajo de Nosotros: tripulación,
// instalaciones, flota. Debajo de sostenibilidad: fundación. Y luego preguntas
// frecuentes, guías, contacto y el blog».
//
// Cambios respecto a la v1:
//  - «Nosotros» pasa a agrupar las TRES páginas nuevas. `/nosotros` como
//    página única DESAPARECE (confirmado en la reunión, 29:02) y redirige a
//    /tripulacion — ver App.tsx.
//  - «El arrecife» sale de aquí: Sostenibilidad sube a tab propio.
//  - «Blog» sale de aquí y baja a Ayuda.
export const NAV_NOSOTROS: ItemNav[] = [
  {
    id: 'tripulacion',
    nombre: 'Crew',
    descripcion: 'The passionate people behind every unforgettable Caribbean experience.',
    to: '/crew',
  },
  {
    id: 'instalaciones',
    nombre: 'Facilities',
    descripcion: 'More than a marina: our headquarters include a marine museum, biology lab, floating kitchens, workshops, and guest facilities.',
    to: '/facilities',
  },
  {
    // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 1 + plan 05 §1] El megamenu pasa
    // de 3 entradas a 4: el cliente da la descripcion de MARINE PARK junto a
    // las otras tres, o sea que para el la pagina ya existe.
    id: 'marine-park',
    nombre: 'Marine Park',
    descripcion:
      'Explore our protected marine area featuring an underwater museum, coral restoration, artificial reefs, and marine conservation projects.',
    to: '/marine-park',
  },
  {
    id: 'flota',
    nombre: 'Fleet',
    descripcion: 'Discover our modern catamarans for shared tours, private charters, and every group size.',
    to: '/fleet',
  },
]

// [v2 2026-07-27] Sostenibilidad sube a tab propio del nav principal, con un
// único sub-ítem: la Fundación (reunión 07-24, 26:50).
//
// ⚠️ La ruta es `/foundation` en SINGULAR. `/fundaciones` (plural) YA EXISTE y
// es otra cosa: la página interna de tokens del proyecto. Se diferencian en
// una letra — ver los avisos cruzados en App.tsx y en las dos páginas.
export const NAV_SOSTENIBILIDAD: ItemNav[] = [
  {
    id: 'sostenibilidad',
    nombre: 'Our competitive advantage',
    descripcion: 'Reefs, turtles and community: what your booking sustains, in numbers.',
    to: '/competitive-advantage',
  },
  {
    id: 'fundacion',
    nombre: 'The Foundation',
    descripcion: 'Bávaro Reefs Foundation: one of the leading coral restoration projects in the country.',
    to: '/foundation',
  },
]

// Ayuda (PLAN-v3.md §12.2) — FAQ_CATEGORIAS del prototipo: 6 categorías, 14
// preguntas (contadas). "Contacto" (ya no "Contacto y WhatsApp", decisión de
// Samuel 2026-07-14) lleva a la página /contacto del prototipo — WhatsApp
// con horario, teléfono, email y formulario, no solo el enlace directo a
// WhatsApp que tenía antes.
// 4º ítem (2026-07-17, pedido de Samuel): "Guías" deja de ser su propio tab
// en el nav principal y entra aquí como subtab — rellena de paso la 4ª
// celda que antes se dejaba vacía a propósito (decisión de Samuel, ya no
// aplica con 4 ítems).
// 5º ítem (2026-07-17, pedido de Samuel): "Gestionar mi reserva" — entra
// a la página /mi-reserva donde el cliente edita su menú/recogida/contacto
// o paga el saldo. Es la pieza que faltaba para cerrar el ciclo post-
// checkout sin obligar al cliente a escribir por WhatsApp.
export const NAV_AYUDA: ItemNav[] = [
  {
    id: 'faq',
    nombre: 'FAQ',
    descripcion: '14 questions: bookings and payments, what to bring, food, weather, children.',
    to: '/faq',
  },
  {
    id: 'guias',
    nombre: 'Punta Cana guides',
    descripcion: '5 articles: how to choose a tour, what to bring, the best time to sail.',
    to: '/guides',
  },
  {
    id: 'contacto',
    nombre: 'Contact',
    descripcion: 'WhatsApp, phone and form. We answer in minutes, from 8:00 to 20:00.',
    to: '/contact',
  },
  {
    id: 'mi-reserva',
    nombre: 'Manage my booking',
    descripcion: 'Edit your menu, pickup or details with your HSP-XXXX-NNNN code.',
    to: '/my-booking',
  },
  // [v2 2026-07-27] Blog baja aquí desde «Nosotros» (reunión 07-24, 27:00:
  // «...contacto y el blog también»). Deja Ayuda en 5 ítems — su grid de 2
  // columnas queda con una celda libre, que es el mismo criterio que Samuel
  // ya aplicó antes: no se inventa un destino para cuadrar la rejilla.
  {
    id: 'blog',
    nombre: 'Blog',
    descripcion: 'Honest guides, stories from the sea and real advice for your trip.',
    to: '/blog',
  },
]

// Cinta de confianza — vivía enterrada en la ficha del wireframe (ver
// NOTAS['home-stats'] del prototipo). v3-F11: sube al hero, entre el
// subtítulo y el CTA (PLAN-v3.md §14).
export type Stat = { valor: string; label: string }
// [v3 2026-08-06] Labels en inglés y separador de miles con COMA — en un
// sitio en inglés «91.607» se lee como noventa y uno con seiscientos siete.
export const STATS: Stat[] = [
  { valor: '91,607', label: 'happy guests' },
  { valor: '4,454', label: 'days at sea' },
  // v3-F13 (PLAN-v3.md §15.7): "de la capacidad del barco" (24 car.) partía en
  // 2 líneas contra los otros 3 labels — "aforo" ya es vocabulario del
  // proyecto (aforo máx. en las cards del ticker y en el megamenú de Tours),
  // no introduce una palabra nueva. El dato no cambia (≤35% de
  // NOTAS['home-stats']).
  { valor: '≤35%', label: 'of boat capacity' },
  { valor: '0', label: 'plastic on board' },
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
  /** Cómo está construido el asset, no cómo queremos que se vea: 'macizo' = el
   *  badge es un rectángulo de color de borde a borde (bloque navy del LTG,
   *  cuadrados verdes de Viator, marco amarillo de WeddingWire); 'aire' = es
   *  un logotipo sobre blanco (TripAdvisor, Luxury Travel Guide).
   *  [v3 2026-08-06, slide 66] Desde que los logos van a todo color, esta
   *  distinción decide la altura ÓPTICA (--premio-escala-*): a la misma
   *  altura en píxeles un macizo pesa el doble que uno de aire, y ese
   *  desequilibrio —no el color— es lo que rompía la fila. */
  fondo: 'macizo' | 'aire'
}

// Los 7 premios reales de la web actual (imágenes descargadas de
// hispaniolaaquaticadventures.com/images/awards/, no stock ni recreaciones).
//
// La auditoría (docs/proceso/analisis/auditoria-web-actual.md §"Señales de confianza") los
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
    nombre: 'TripAdvisor, #1 water activity in Bávaro / Punta Cana for more than 7 years',
    foto: 'premio-tripadvisor',
    ancho: 222,
    alto: 82,
    fondo: 'aire',
  },
  {
    id: 'weddingwire',
    nombre: "WeddingWire, Couples' Choice Awards 2018-2021",
    foto: 'premio-weddingwire',
    ancho: 128,
    alto: 128,
    fondo: 'macizo',
  },
  {
    id: 'ltg',
    nombre: 'LTG Global Awards 2021/22, Winner: Aquatic Tour Operator of the Year, Dominican Republic',
    foto: 'premio-ltg',
    ancho: 318,
    alto: 128,
    fondo: 'macizo',
  },
  // TripAdvisor y los Viator: nativo 82px / 109px de alto — no llegan a 128
  // (2× de --spacing-premio-alto), así que se exportan a su nativo y NO se
  // upscalean (PLAN-v3.md §14.4, Trampa №11). Pendiente pedirle al cliente
  // los assets en alta (§9).
  {
    id: 'viator-2022',
    nombre: 'Viator Experience Award 2022',
    foto: 'premio-viator-2022',
    ancho: 95,
    alto: 109,
    fondo: 'macizo',
  },
  {
    id: 'viator-2023',
    nombre: 'Viator Experience Award 2023',
    foto: 'premio-viator-2023',
    ancho: 95,
    alto: 109,
    fondo: 'macizo',
  },
  {
    id: 'viator-2024',
    nombre: 'Viator Experience Awards 2024',
    foto: 'premio-viator-2024',
    ancho: 95,
    alto: 109,
    fondo: 'macizo',
  },
  {
    id: 'luxury-travel-guide',
    nombre: 'Luxury Travel Guide, The Americas Awards 2016, Winner: Tour Operator of the Year, Punta Cana',
    foto: 'premio-luxury-travel-guide',
    ancho: 387,
    alto: 128,
    fondo: 'aire',
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
// ⚠️ La auditoría (docs/proceso/analisis/auditoria-web-actual.md §7) añade que el proyecto
// está "avalado por Ministerio de Medio Ambiente" — dato fuerte, pero NO está
// en datos.js y no se inventa. Pendiente confirmarlo con el cliente
// (app/PLAN-v3.md §9); si se confirma, su sitio natural es esta misma frase.
//
// Cada frase es un array de segmentos: `fuerte` = navy, resalta; si no, gris
// (navy-sub). El alternado gris/negro del "texto grande" es la referencia que
// aportó Samuel ("Who we are" de Journeo). Cada frase es un bloque para que el
// reveal de scroll (use-experiencia-scroll.ts) las escalone una a una.
export type SegmentoNarrativa = { t: string; fuerte?: boolean }

// [v3 2026-08-06, WEBSITE - INICIO pág. 1] Copy APROBADO por el cliente. El
// original era UN párrafo largo; se reparte en los mismos 3 tramos que ya
// usaba la narrativa (el componente anima tramo a tramo) SIN cortar ni
// reescribir ninguna frase — solo se elige dónde cae el salto. Los `fuerte`
// marcan lo que la sección quiere que quede: qué es (experiencia cuidada),
// qué la hace única (conservación, museo, cocina del chef) y con qué se
// queda el visitante (recuerdos).
//
// [2026-08-07, Samuel] FUERA LA RAYA. «This isn't just a day at sea — it's
// a…» llevaba un guion largo, y el guion largo entre cláusulas es hoy el tic
// que delata texto de IA («esas líneas son muy IA»). Se sustituye por PUNTO
// y frase nueva: el contraste («no es X, es Y») no depende de la raya, y en
// dos frases cortas pega más fuerte que en una con inciso. No se reescribe
// nada más del copy aprobado — solo cambia el signo.
// El SALTO del tramo 2 se mueve además de «…comfort,» a «…Punta Cana,»:
// cortaba en mitad de la enumeración (museo, cocina, catamaranes | y
// hospitalidad) y dejaba un tramo largo seguido de uno de dos renglones.
// Ahora rompe en la junta natural de la frase, justo antes de «where», y los
// dos bloques quedan parejos.
export const EXPERIENCIA_NARRATIVA: SegmentoNarrativa[][] = [
  [
    { t: "This isn't just a day at sea.", fuerte: true },
    { t: " It's a " },
    { t: 'carefully crafted Caribbean experience.', fuerte: true },
  ],
  [
    { t: 'From the moment you arrive, every detail has been thoughtfully designed to immerse you in the very best of Punta Cana,' },
  ],
  [
    { t: 'where ' },
    { t: 'marine conservation', fuerte: true },
    { t: ', exclusive access to our ' },
    { t: 'underwater museum', fuerte: true },
    { t: ', ' },
    { t: 'chef-prepared cuisine', fuerte: true },
    { t: ', spacious catamarans designed for comfort, and genuine Caribbean hospitality come together to create ' },
    { t: 'unforgettable memories.', fuerte: true },
  ],
]

// [v3 2026-08-06] «Sin costes ocultos. Sin barcos abarrotados.» se ELIMINA —
// WEBSITE - INICIO pág. 1: «* REMOVE: sin costos ocultos…». La constante
// desaparece con su consumidor (experiencia.tsx) para no dejar un token
// muerto: si el cliente lo quiere de vuelta, está en el tag `v3-pre-en`.

// El VIDEO de la sección Experiencia (correcciones v1 del cliente,
// 2026-07-20 — planes/01-home.md slide 7: «agregar efecto de video como este
// [six2eight.com] y poner el video del popup inicial aquí dado que a
// Fernando le gusta mucho ese video»).
//
// Sustituye al collage de 3 fotos reales que vivía aquí (EXPERIENCIA_FOTOS,
// con su hover de grupo en componentes.css). El collage entero se retiró en
// el mismo commit para no dejar cadáveres — si el cliente se arrepiente, se
// recupera con un `git revert` de ese commit.
//
// CORRECCIÓN (2026-07-22): la 1ª vuelta asumió que era EL MISMO asset que el
// fondo del hero (/video/hero.mp4) — Samuel aclaró que NO: el video del popup
// es uno distinto, de YouTube (id K65cchLFwRs, canal propio del cliente), con
// la presentadora hablando a cámara — confirmado también en
// docs/proceso/analisis/direccion-visual.md §del hero (ahí se descartó ESE MISMO id para
// el fondo del hero por llevar subtítulos incrustados en todo el metraje sin
// tramo limpio; aquí sí es el uso correcto, es justamente el video del popup).
// Se extrajo con yt-dlp (contenido propio del cliente, mismo trato que
// hero.mp4/incluye-oceano-cenital.mp4 — no hay stock ni assets inventados) a
// /video/experiencia-presentadora.mp4. Los subtítulos quedan incrustados
// (vienen "horneados" en el video de origen, no se pueden quitar sin
// re-editar) — al hacer loop se reinician de golpe; aceptado por Samuel como
// costo del video real vs. no tener video. El poster es un frame real del
// propio clip (ffmpeg, sin CTA tipo "click the link" que no aplica fuera de
// YouTube), no una foto de la galería ni un frame inventado.
export type VideoExperiencia = { src: string; poster: string; alt: string }

export const EXPERIENCIA_VIDEO: VideoExperiencia = {
  src: '/video/experiencia-presentadora.mp4',
  poster: '/fotos/experiencia-presentadora-poster.webp',
  alt: 'Hispaniola host explaining how to choose the right excursion in Punta Cana',
}

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
  | {
      tipo: 'ocasion'
      id: string
      nombre: string
      foto: string
      /** landing real (/eventos/:slug) — solo Bodas y MICE; el resto sigue
       *  en el prototipo (formulario del hub) */
      slug?: string
    }

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
  ...OCASIONES.map(
    (o): TickerItem => ({ tipo: 'ocasion', id: o.tipo, nombre: o.nombre, foto: o.foto, slug: o.slug }),
  ),
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
export type BeneficioDirecto = { id: string; titulo: string }

// [v3 2026-08-06, WEBSITE - INICIO pág. 3] Los 7 beneficios APROBADOS por el
// cliente sustituyen a los 5 anteriores. Van LITERALES y SOLOS: el cliente
// entregó una lista de checks, sin explicación debajo, y el boleto imprime
// exactamente eso.
// ⚠️ Se probó acompañar cada titular con una frase de apoyo (heredada de los
// 5 beneficios de v2) y el boleto crecía tanto de alto que rompía el stack
// del banner — el objeto dejaba de leerse como boleto. La lista escueta ES
// el formato: una línea por check, sin `texto`. Si algún día vuelve el texto
// de apoyo, hay que rehacer la escena (anchos y sobresalir del banner), no
// solo añadir el campo.
export const BENEFICIOS_DIRECTO: BeneficioDirecto[] = [
  { id: 'expertos', titulo: 'Direct access to our local experts' },
  { id: 'personalizar', titulo: 'Customize your experience' },
  { id: 'menu', titulo: 'Choose your preferred menu' },
  { id: 'perks', titulo: 'Exclusive direct-booking perks' },
  { id: 'whatsapp', titulo: 'Priority assistance via WhatsApp' },
  { id: 'cancelacion', titulo: 'Flexible cancellation policy' },
  { id: 'conservacion', titulo: 'Support local marine conservation' },
]

// El tour que viaja impreso en los DOS boletos de la comparación: el buque
// insignia (Semi-Privado Premium). Mismo nombre y mismo precio en ambos a
// propósito — la tesis de la sección es que lo que cambia es lo que viene
// DESPUÉS del precio.
export const BOLETO_TOUR = TOURS[0]

// ─────────────────────────────────────────────────────────────────────────
// Sección «Reseñas verificadas». Las reseñas aquí son el bloque que demuestra
// la prueba social — el "link ver más" sigue SIN apuntar a Viator
// (NOTAS['home-reviews'] del prototipo): no regalar tráfico al canal que
// vende el mismo tour.
//
// El link "ver más" sí enlaza a TripAdvisor y Facebook, donde el cliente
// tiene presencia propia y verificable (la auditoría del sitio
// —docs/proceso/analisis/auditoria-web-actual.md— los marcó como los 2 canales
// principales de prueba social del cliente).
//
// v7 (2026-07-22, pedido de Samuel sobre la maqueta del cliente): la sección
// pasa de «1 video + slider vertical de 2 quotes» a MURO de reseñas —
// 2 video-testimonios arriba + 3 filas de cards en marquee infinito. Eso
// obliga a tres cosas en los datos, y las tres están abajo:
//   1. un pool mucho más grande de reseñas (QUOTES solo tenía 5),
//   2. rating POR plataforma en la barra de confianza, y
//   3. los 2 video-testimonios como dato (antes había un solo FUNDADOR).

export type Review = {
  id: string
  /** Quién es y de dónde nos visitó: "Familia de Nueva York", "Luna de miel
   *  desde Londres"… Se pinta como línea meta bajo el nombre. */
  lugar: string
  texto: string
  autor: string
  plataforma: 'TripAdvisor' | 'Viator' | 'Facebook' | 'Google'
  fecha: string
  estrellas: 5 // todas 5 por ahora — si entran <5, la estrella fraccional la
  //              pinta el componente como en la insignia de confianza
  //              (ui/insignia-confianza.tsx, mismo patrón).
}

// LAS 5 REALES. Portadas del prototipo y de reseñas reales de la web actual
// (mismo pool que el cerebro ya tenía aprobado). Este array es el que usan la
// ficha de tour (opiniones-tour.tsx) y el widget de reserva: ahí NO puede
// entrar relleno — una reseña junto al precio, en el momento de decidir,
// tiene que ser de verdad.
// ⚠️ Avatares: NO tenemos fotos de clientes (privacidad). El componente
// pinta iniciales en un círculo aqua-tint — placeholder honesto, no inventado.
export const QUOTES: Review[] = [
  {
    id: 'ny',
    lugar: 'Family from New York',
    texto:
      'The coral nursery was the best part of the trip. The biologist explained everything to us, and the food on board was incredible.',
    autor: 'Jessica M.',
    plataforma: 'Viator',
    fecha: 'Jun 2026',
    estrellas: 5,
  },
  {
    id: 'tx',
    lugar: 'Couple from Texas',
    texto:
      'Excellent service, a small group just as promised, not like other catamarans packed with people. It felt like the boat was ours alone.',
    autor: 'Carlos R.',
    plataforma: 'TripAdvisor',
    fecha: 'May 2026',
    estrellas: 5,
  },
  {
    id: 'cdmx',
    lugar: 'Family from Mexico City',
    texto:
      'We booked direct on WhatsApp and they sorted everything out in minutes. The pick-up was on time and the boat spotless. We’d do it again without hesitating.',
    autor: 'Ana P.',
    plataforma: 'Facebook',
    fecha: 'May 2026',
    estrellas: 5,
  },
  {
    id: 'lhr',
    lugar: 'Honeymoon from London',
    texto:
      'A perfect honeymoon day. Private snorkeling, a romantic lunch on a deserted beach, an attentive crew. Worth every euro.',
    autor: 'Sophie L.',
    plataforma: 'TripAdvisor',
    fecha: 'Apr 2026',
    estrellas: 5,
  },
  {
    id: 'bcn',
    lugar: 'Family from Barcelona',
    texto:
      'The kids absolutely loved snorkeling with the marine biologist. The team was so attentive with them. An experience worth repeating.',
    autor: 'Marta V.',
    plataforma: 'Google',
    fecha: 'Mar 2026',
    estrellas: 5,
  },
]

// ⚠️⚠️ RELLENO — HAY QUE SUSTITUIRLO POR RESEÑAS REALES ANTES DE PUBLICAR ⚠️⚠️
//
// Estas 13 NO son reseñas de clientes: están escritas para poder construir y
// evaluar el MURO de 3 filas en marquee (decisión de Samuel 2026-07-22, al
// elegir ese diseño sabiendo que solo teníamos 5 reseñas reales). Con 5, las
// 3 filas repetían la misma cara tres veces en pantalla y el diseño no se
// podía juzgar.
//
// Van APARTE de QUOTES a propósito, no mezcladas: así el relleno no puede
// colarse en la ficha de tour ni en el widget de reserva (que importan
// QUOTES), que es donde una reseña falsa haría daño de verdad — al lado del
// precio, en el momento de decidir. Solo el muro de la home consume la mezcla
// (RESENAS_MURO, abajo).
//
// Mismo criterio que las fotos de stock del equipo (data/nosotros.ts): se
// salta la regla de CLAUDE.md «contenido real, nunca inventado» de forma
// consciente, marcada y temporal, para que el diseño se pueda ver. Cuando el
// cliente exporte sus reseñas de Google/TripAdvisor/Viator, este array se
// borra entero y RESENAS_MURO pasa a ser QUOTES.
export const QUOTES_RELLENO: Review[] = [
  {
    id: 'r-mia',
    lugar: 'Family from Miami',
    texto:
      'They picked us up at the hotel right on time and we came back with the kids asleep from so much swimming. A perfect day.',
    autor: 'Laura G.',
    plataforma: 'Google',
    fecha: 'Jun 2026',
    estrellas: 5,
  },
  {
    id: 'r-tor',
    lugar: 'Couple from Toronto',
    texto:
      'We booked the private catamaran for our anniversary. The crew had the boat decorated for us without us even asking.',
    autor: 'Daniel & Erin',
    plataforma: 'TripAdvisor',
    fecha: 'Jun 2026',
    estrellas: 5,
  },
  {
    id: 'r-mad',
    lugar: 'Group of friends from Madrid',
    texto:
      'There were twelve of us and we never felt like a number. Music, natural pool and lobster on board. We’re definitely coming back.',
    autor: 'Javier S.',
    plataforma: 'Viator',
    fecha: 'May 2026',
    estrellas: 5,
  },
  {
    id: 'r-chi',
    lugar: 'Family from Chicago',
    texto:
      'My mother is 71 and she got into the water with no trouble: the crew kept an eye on her the whole time.',
    autor: 'Michelle T.',
    plataforma: 'Google',
    fecha: 'May 2026',
    estrellas: 5,
  },
  {
    id: 'r-bog',
    lugar: 'Couple from Bogotá',
    texto:
      'The natural pool at Saona is on another level. And lunch was way above what we expected from a tour.',
    autor: 'Andrés M.',
    plataforma: 'TripAdvisor',
    fecha: 'May 2026',
    estrellas: 5,
  },
  {
    id: 'r-bos',
    lugar: 'Honeymoon from Boston',
    texto:
      'They moved our date because of rain without arguing or charging a thing. That detail is worth more than any discount.',
    autor: 'Nicole R.',
    plataforma: 'Google',
    fecha: 'Apr 2026',
    estrellas: 5,
  },
  {
    id: 'r-buenosaires',
    lugar: 'Family from Buenos Aires',
    texto:
      'We booked direct on WhatsApp and it came out cheaper than through the hotel agency. Zero middlemen.',
    autor: 'Gustavo P.',
    plataforma: 'Facebook',
    fecha: 'Apr 2026',
    estrellas: 5,
  },
  {
    id: 'r-par',
    lugar: 'Couple from Paris',
    texto:
      'The team speaks Spanish and English, and made themselves understood in French. They explained every stop on the route.',
    autor: 'Camille D.',
    plataforma: 'TripAdvisor',
    fecha: 'Apr 2026',
    estrellas: 5,
  },
  {
    id: 'r-sto',
    lugar: 'Work group from Santo Domingo',
    texto:
      'We organized our company team-building on board. Everything ran on time and the team took care of absolutely everything.',
    autor: 'Rosanna C.',
    plataforma: 'Google',
    fecha: 'Mar 2026',
    estrellas: 5,
  },
  {
    id: 'r-den',
    lugar: 'Family from Denver',
    texto:
      'Spotless boat, life vests for the kids and ice until the very end. You can tell the boat is theirs and they look after it.',
    autor: 'Brian K.',
    plataforma: 'Viator',
    fecha: 'Mar 2026',
    estrellas: 5,
  },
  {
    id: 'r-mil',
    lugar: 'Couple from Milan',
    texto:
      'We each chose our menu when booking: lobster for me, vegetarian for her. No other agency allowed that.',
    autor: 'Elena F.',
    plataforma: 'TripAdvisor',
    fecha: 'Feb 2026',
    estrellas: 5,
  },
  {
    id: 'r-hou',
    lugar: 'Family from Houston',
    texto:
      'We left early and avoided the crowd of other catamarans. We were almost alone at the first stop.',
    autor: 'Sarah W.',
    plataforma: 'Google',
    fecha: 'Feb 2026',
    estrellas: 5,
  },
  {
    id: 'r-lim',
    lugar: 'Family from Lima',
    texto:
      'They explained the coral nursery to us and the kids helped plant. They talked about it all week afterwards.',
    autor: 'Patricia N.',
    plataforma: 'Facebook',
    fecha: 'Jan 2026',
    estrellas: 5,
  },
]

// El pool del muro de la home: reales primero, relleno después. El componente
// lo reparte en 3 filas (reviews.tsx) — el orden de aquí decide qué reseña
// cae en qué fila, así que las 5 reales quedan repartidas entre las tres y no
// amontonadas en la primera.
export const RESENAS_MURO: Review[] = QUOTES.flatMap((real, i) => [
  real,
  ...QUOTES_RELLENO.slice(i * 3, i * 3 + 3),
])

// ─────────────────────────────────────────────────────────────────────────
// Barra de confianza multi-plataforma (correcciones v1 del cliente,
// 2026-07-20 — planes/01-home.md slides 11-12: «agregar logo de google»,
// «intentar que sea lo más real posible»).
//
// ⚠️ LOS RATINGS POR PLATAFORMA SON DEL CLIENTE, NO NUESTROS. Hasta
// 2026-07-22 esta barra pintaba SOLO el agregado real (4,9 / 1.782) porque
// las cifras por plataforma de la maqueta (Google 4,9 · +900 reseñas /
// TripAdvisor 4,9 / Viator 4,8 Premier) no existen en ninguna fuente del
// proyecto: las generó la IA con la que el cliente hizo esa maqueta.
//
// Samuel decide ese día pintarlas igualmente, con dos condiciones que son las
// que hacen que esto no sea inventarse un dato: (a) las cifras salen del PDF
// que mandó el CLIENTE sobre su propio negocio —es su afirmación, no
// nuestra— y (b) quedan marcadas aquí como `porConfirmar` para pedírselas
// por escrito antes de publicar. Si el cliente las desmiente, se bajan a null
// y la barra vuelve a enseñar solo el agregado.
//
// Las `distincion` NO vienen de esa maqueta: son las documentadas de verdad
// (TripAdvisor #1 7 años y los premios Viator salen de PREMIOS, que se sacó
// de la web real del cliente). Google no tiene distinción propia, así que
// enseña su recuento.
//
// Las URLs de perfil siguen pendientes desde PLAN-v3.md §9: cuando lleguen,
// `url` deja de ser null → cada plataforma pasa a ser un enlace verificable.
export type PlataformaResena = {
  id: 'google' | 'tripadvisor' | 'viator'
  nombre: string
  /** Nota media en esa plataforma, en formato es-ES ("4,9"). */
  rating: string
  /** Valor numérico del mismo rating — es el que rellena las estrellas
   *  fraccionales (4,8 → la 5ª estrella al 80%). */
  ratingNumero: number
  /** Segunda línea: distinción documentada o recuento de la plataforma. */
  distincion: string
  /** true mientras el dato venga de la maqueta del cliente y no de un
   *  documento suyo. Lo lee el Dev Mode / el traspaso, no la UI. */
  porConfirmar: boolean
  /** Perfil público. null = pendiente del cliente, no se inventa. */
  url: string | null
}

export const PLATAFORMAS_RESENAS: PlataformaResena[] = [
  {
    id: 'google',
    nombre: 'Google',
    rating: '4.9',
    ratingNumero: 4.9,
    distincion: 'More than 900 reviews',
    porConfirmar: true,
    url: null,
  },
  {
    id: 'tripadvisor',
    nombre: 'TripAdvisor',
    rating: '4.9',
    ratingNumero: 4.9,
    distincion: '#1 in water activities for 7 years',
    porConfirmar: true,
    url: null,
  },
  {
    id: 'viator',
    nombre: 'Viator',
    rating: '4.8',
    ratingNumero: 4.8,
    distincion: 'Premier · awards 2022 · 2023 · 2024',
    porConfirmar: true,
    url: null,
  },
]

/** Agregado real, el mismo número que usa el hero y el footer. */
export const RESENAS_AGREGADO = { rating: '4.9', total: 1782 }

// Los 2 VIDEO-TESTIMONIOS de la cabecera de la sección (2026-07-22).
// Sustituyen al antiguo `FUNDADOR` —un solo video, con la frase de los
// cofundadores— porque la maqueta del cliente y el pedido de Samuel piden
// dos, y que sean RESEÑAS DE CLIENTES, no un mensaje de la marca: la sección
// entera va de gente que ya vino.
//
// Frases, nombres y procedencia: de la maqueta del PDF del cliente (slides
// 11-12), igual que los ratings por plataforma de arriba — dato suyo sobre su
// propio negocio, pendiente de confirmar por escrito.
//
// ⚠️ LOS VIDEOS SON PLACEHOLDER, y aquí no hay matiz: son clips de MARCA
// (el catamarán navegando y la presentadora de la sección Experiencia), no
// clientes hablando a cámara. Están para poder montar y evaluar el bloque —
// «2 video-testimonios reales» lleva pedido al cliente desde
// docs/proceso/correcciones-v1-cliente/planes/01-home.md. Cuando lleguen, se cambia solo
// el `videoSrc`/`videoPoster` de cada uno.
export type VideoTestimonio = {
  id: string
  /** La frase que se lee dentro de la caja del video. */
  frase: string
  /** Quién o quiénes son y de dónde nos visitaron — línea pequeña y sutil
   *  bajo la frase. */
  quienes: string
  procedencia: string
  plataforma: Review['plataforma']
  videoSrc: string
  videoPoster: string
}

export const VIDEO_TESTIMONIOS: VideoTestimonio[] = [
  {
    id: 'aniversario',
    frase: 'We celebrated our anniversary and it was magical.',
    quienes: 'Marisol & Pedro',
    procedencia: 'visited us from Santo Domingo',
    plataforma: 'Google',
    videoSrc: '/video/hero.mp4',
    videoPoster: '/fotos/hero-video-poster.webp',
  },
  {
    id: 'amigos',
    frase: 'A group of friends, zero stress. We’d do it again without thinking twice.',
    quienes: 'Emily & friends',
    procedencia: 'visited us from Chicago',
    plataforma: 'TripAdvisor',
    videoSrc: '/video/experiencia-presentadora.mp4',
    videoPoster: '/fotos/experiencia-presentadora-poster.webp',
  },
]

// ─────────────────────────────────────────────────────────────────────────
// Sección «Contacto» (2026-07-17, pedido de Samuel) — mapa + formulario +
// 4 cards de contacto, tras Reviews (ref. visual: sección de contacto de
// Lumoro, adaptada a tokens Hispaniola).
//
// Copy portado VERBATIM de prototipo/app.js → renderContacto (líneas
// 1693-1722) e inicializarFormularioDemo, salvo dos datos que NO existían en
// el prototipo (el email de contacto no tenía dirección literal, y la
// dirección de oficina se actualiza) — ambos dados por Samuel el
// 2026-07-17: dirección "Oficina Hispaniola Aquatic Adventures, C. P.º del
// Sol, Punta Cana 23500, República Dominicana" (coordenadas 18.669740,
// -68.401262) y correo "info@catamarantourspuntacana.com".
export type ContactoCard = {
  id: 'whatsapp' | 'telefono' | 'email' | 'oficina'
  titulo: string
  dato: string
  href?: string
  /** Verbo de la acción (correcciones v1, slide 14): la maqueta pide que cada
   *  card diga qué pasa al tocarla, no solo el dato. */
  cta?: string
}

export const CONTACTO = {
  // eyebrow/lead: chrome de la cabecera de /contacto (HeroInterna), NO del
  // bloque embebido en la home — `titulo` ya hacía ese trabajo ahí y sigue
  // igual. Mapea contact.php de la web actual (H1 "Contact Us" / subtítulo
  // "Punta Cana - Bavaro, Dominican Republic"), con el copy adaptado al tono
  // de marca del resto del sitio en vez de portado literal.
  // [v3 2026-08-06, WEBSITE - INICIO pág. 6] Título y bajada APROBADOS:
  // «HABLA CON NOSOTROS → SPEAK WITH LOCAL EXPERTS» + «Our local specialists
  // work exclusively for Hispaniola Aquatic Adventures and are here to help
  // you.»
  eyebrow: 'Contact',
  lead: 'Our local specialists work exclusively for Hispaniola Aquatic Adventures and are here to help you.',
  titulo: 'Speak with local experts',
  direccion: 'Hispaniola Aquatic Adventures office, C. P.º del Sol, Punta Cana 23500, Dominican Republic',
  email: 'info@catamarantourspuntacana.com',
  mapaEmbedUrl: 'https://www.google.com/maps?q=18.669740,-68.401262&z=16&output=embed',
  confirmacion: 'We got your message. We reply within 24 hours (sooner on WhatsApp).',
  microcopy: 'Already booked? Have your code handy (HSP-XXXX-XXXX) and we can help you faster.',
  // Correcciones v1 del cliente (2026-07-20, planes/01-home.md slides 13-14:
  // «dale más cariño please»). La maqueta pone una card de persona real
  // arriba — es lo que hace que «hablas con nosotros, no con un call center»
  // deje de ser una promesa y tenga cara.
  //
  // ⚠️ La maqueta la firma una «María C.» que NO existe en ningún dato del
  // cliente: la inventó la IA de la maqueta. Usamos a EVA, que es quien el
  // propio cliente identifica como atención al viajero en las OTRAS dos
  // maquetas (home slide 15 y nosotros slide 2) — un solo nombre en todo el
  // sitio, y que además es suyo. La fuente es EQUIPO en data/nosotros.ts.
  //
  // [v3 2026-08-06, WEBSITE - INICIO pág. 6] «QUITAR LA PARTE DEBAJO DE EVA,
  // SOLO PONER FAST RESPONSE»: fuera el párrafo y los 3 chips; queda un único
  // distintivo. `texto` pasa a null (el componente lo omite) en vez de
  // borrarse del tipo — la card sigue admitiendo un párrafo si el cliente lo
  // quiere de vuelta en otra página.
  persona: {
    idEquipo: 'eva',
    texto: null,
    chips: ['Fast response'],
  },
  // CANAL PREFERIDO del formulario. Las correcciones v1 (slide 13) ya lo
  // pedían y el comentario de contacto.tsx lo daba por hecho, pero nunca se
  // llegó a construir — el formulario solo tenía el «¿Sobre qué?». Se añade
  // con el rediseño del 2026-07-22.
  //
  // Los ids coinciden a propósito con los de `cards`: el mismo icono sirve
  // para la fila de contacto y para el chip del canal, sin una segunda tabla
  // de iconos que mantener sincronizada.
  //
  // [v3 2026-08-06] «QUITAR: ¿Cómo prefieres que te contactemos?» — la fila
  // de canales sale del formulario. Se conserva la lista porque los MISMOS
  // ids alimentan los iconos de las 4 cards de contacto de abajo; lo que
  // desaparece es el selector, no el dato.
  canales: [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'email', label: 'Email' },
    { id: 'telefono', label: 'Phone' },
  ] satisfies { id: ContactoCard['id']; label: string }[],
  // Opciones del «¿Sobre qué?» del formulario. Salen de lo que el sitio
  // vende de verdad (tours, eventos privados, agentes) — no una lista genérica.
  asuntos: [
    'Booking a tour',
    'Private event or wedding',
    'Changing a booking I already have',
    'Travel agencies and agents',
    'Something else',
  ],
  cards: [
    {
      id: 'whatsapp',
      titulo: 'WhatsApp',
      dato: '+1 829 305 2804',
      href: WHATSAPP_URL,
      // [v3 2026-08-07, pedido de Samuel] «Chat now» a secas no decía a DÓNDE
      // llevaba: el icono de marca lo insinuaba, pero el verbo no. Nombrar el
      // canal en el propio botón es lo que hace que se entienda sin mirar el
      // icono — y es el patrón del botón oficial de WhatsApp.
      cta: 'Chat now on WhatsApp',
    },
    {
      id: 'telefono',
      titulo: 'Phone',
      dato: '1-800-657-0016',
      href: 'tel:+18006570016',
      cta: 'Call us',
    },
    {
      id: 'email',
      titulo: 'Email',
      dato: 'info@catamarantourspuntacana.com',
      href: 'mailto:info@catamarantourspuntacana.com',
      cta: 'Write to us',
    },
    {
      id: 'oficina',
      titulo: 'Office',
      dato: 'C. P.º del Sol, Punta Cana 23500, Dominican Republic',
      href: 'https://maps.app.goo.gl/iuu1EGaNYGCjhreC7',
      cta: 'View on the map',
    },
  ] satisfies ContactoCard[],
}

// ─────────────────────────────────────────────────────────────────────────
// «Míranos en acción» — reels de Instagram y TikTok (correcciones v1 del
// cliente, 2026-07-20 — planes/01-home.md slides 8-9: «sección instagram y
// tiktok», con una maqueta de carrusel de reels verticales).
//
// ⚠️ LO QUE FALTA Y LO QUE NO SE INVENTA:
//  - NO tenemos los videos. Cada reel se pinta con una FOTO REAL de las
//    galerías del cliente como cartel (`foto`), y `video: null`. Cuando
//    lleguen los reels de verdad, se rellena `video` y la card los reproduce
//    en hover/click sin tocar el componente.
//  - NO se pintan contadores de vistas. La maqueta del cliente los trae
//    («45,2 mil», «120 mil»), pero se los inventó su IA: no tenemos analítica
//    de sus redes. Un número de vistas falso es exactamente el tipo de dato
//    que el proyecto no fabrica (misma regla que los ratings por plataforma).
//  - Los `handle` de terceros («@maria.travels», «@carlos.rd») de la maqueta
//    TAMPOCO se copian: son cuentas de clientes que nadie ha verificado que
//    existan ni que hayan dado permiso. Todos los reels van atribuidos a la
//    cuenta del cliente hasta que él diga lo contrario.
//
// El copy de los títulos SÍ describe lo que se ve en cada foto — no es
// contenido inventado, es el pie de una foto real.
export type Reel = {
  id: string
  titulo: string
  /** Cartel del reel: foto real de las galerías. */
  foto: string
  fotoAlt: string
  /** Video vertical del reel. null = pendiente del cliente. */
  video: string | null
  /** Red donde vive. Sin consumidores desde que se retiró el badge de red
   *  (v2 2026-07-27, ver reels-sociales.tsx) — opcional para que otros
   *  carriles que reutilizan el componente (el de /instalaciones, que no son
   *  reels de redes sino los verticales de las zonas) no tengan que inventarse
   *  una red a la que esos videos no pertenecen. */
  red?: 'instagram' | 'tiktok'
}

export const REELS: Reel[] = [
  {
    id: 'martes-a-bordo',
    titulo: 'Just another Tuesday on board',
    foto: 'galeria-charter-privado-2',
    fotoAlt: 'Group enjoying the catamaran deck',
    video: null,
    red: 'instagram',
  },
  {
    id: 'piscina-natural',
    titulo: 'The natural pool, from the water',
    foto: 'galeria-isla-saona-4',
    fotoAlt: 'Shallow turquoise water of the natural pool',
    video: null,
    red: 'tiktok',
  },
  {
    id: 'cocina-flotante',
    titulo: 'This is how we cook in the middle of the sea',
    foto: 'cocina-flotante',
    fotoAlt: 'The crew grilling in the floating kitchen',
    video: null,
    red: 'instagram',
  },
  {
    id: 'snorkel-coral',
    titulo: 'Snorkeling over the coral nursery',
    foto: 'galeria-semi-privado-1',
    fotoAlt: 'Guests snorkeling over the coral nursery',
    video: null,
    red: 'tiktok',
  },
  {
    id: 'sunset',
    titulo: 'Sunset under sail, the couples’ favorite',
    foto: 'flota-maite',
    fotoAlt: 'The sailing catamaran Maite under full sail at sunset',
    video: null,
    red: 'instagram',
  },
]

/** Hashtag de la campaña de contenido generado por el cliente (maqueta). */
export const REELS_HASHTAG = '#HispaniolaMoments'

// ─────────────────────────────────────────────────────────────────────────
// Pie enriquecido (correcciones v1 del cliente, 2026-07-20 —
// planes/01-home.md slide 18). El cliente puso de referencia el footer de
// Civitatis: métodos de pago, badge de valoración, selector de idioma/moneda
// y redes.
//
// ⚠️ MEDIOS DE PAGO — PENDIENTE DE CONFIRMAR CON EL CLIENTE. Los únicos
// medios que el proyecto documenta hoy son el depósito del 25% online y el
// «paga en efectivo a bordo» (pages/mi-reserva.tsx). El resto son las redes
// de tarjeta que cualquier operador con cobro online acepta, puestas aquí
// para que el cliente las VEA y las corrija — no como afirmación cerrada.
// NO PUBLICAR sin que Fernando confirme la lista.
//
// 2026-07-22 (pedido de Samuel: "en vez de que diga mastercard, visa, paypal
// en unos chips… que estén todos los logos en armonía dentro de sus cajitas
// para darle homogeneidad"): dejan de ser strings sueltos y pasan a
// `{ id, nombre, marca }` — `marca` es lo que se PINTA dentro de la cajita.
// El porqué de las dos formas de marca vive en ui/marcas-pago.tsx; en corto:
// `glifo` cuando existe un logo real en la familia de iconos que ya usa el
// proyecto (Remix), `texto` cuando no — y ahí se compone el nombre en vez de
// dibujar un logo de memoria (la razón original por la que esto era texto:
// un logo mal reproducido miente más que un nombre bien compuesto).
// «Efectivo a bordo» SALE de esta lista y baja al pie de la banda, como
// frase. Dos razones, y la segunda pesa más que la primera: (1) no es una
// marca — dibujarlo obliga a un pictograma genérico, y probado con el
// billete de Remix a 18px la caja se leía como una CÁMARA de fotos, no como
// dinero; (2) una fila que se pide homogénea aguanta wordmarks y logos
// mezclados, pero no un icono conceptual entre logos de marca: es el eslabón
// que delata que las cajas no son todas lo mismo. El dato no se pierde — es
// el único medio de pago que el proyecto tiene CONFIRMADO (pages/mi-reserva),
// así que pasa a la línea de debajo, que ya hablaba del saldo del día del
// tour.
export type MedioPago = {
  id: string
  /** Nombre accesible — es el `title` de la cajita y su texto para lectores. */
  nombre: string
  marca: { tipo: 'glifo'; glifo: 'visa' | 'mastercard' | 'paypal' } | { tipo: 'texto'; texto: string }
}

export const MEDIOS_PAGO: MedioPago[] = [
  { id: 'visa', nombre: 'Visa', marca: { tipo: 'glifo', glifo: 'visa' } },
  { id: 'mastercard', nombre: 'Mastercard', marca: { tipo: 'glifo', glifo: 'mastercard' } },
  { id: 'amex', nombre: 'American Express', marca: { tipo: 'texto', texto: 'AMEX' } },
  { id: 'paypal', nombre: 'PayPal', marca: { tipo: 'glifo', glifo: 'paypal' } },
]

// Redes del cliente. ⚠️ Las URLs reales NO están en ninguna fuente del
// proyecto (ni en prototipo/datos.js ni en la auditoría de la web actual) —
// misma situación que los perfiles de reseñas y los PREMIOS. Con `url: null`
// el componente pinta un EnlacePrototipo en vez de inventar un destino.
export type RedSocial = { id: string; nombre: string; url: string | null }

export const REDES: RedSocial[] = [
  { id: 'instagram', nombre: 'Instagram', url: null },
  { id: 'facebook', nombre: 'Facebook', url: null },
  { id: 'tiktok', nombre: 'TikTok', url: null },
  { id: 'youtube', nombre: 'YouTube', url: null },
]

// Monedas. Igual que el idioma (SelectorIdioma), es VISUAL: el sitio no tiene
// conversión real de divisa todavía. Los precios de todo el sitio están en
// USD, que es como los publica el cliente.
export const MONEDAS = ['USD', 'EUR', 'DOP'] as const

// ─────────────────────────────────────────────────────────────────────────
// FAQ de la home (2026-07-17) — reemplaza al layout de galería+FAQ en 2
// columnas (la galería photo-stack sale de la home; la galería completa
// sigue en prototipo/). Curaduría de FAQ_CATEGORIAS (prototipo/datos.js) —
// arrancó con 6 preguntas, una por categoría.
//
// AMPLIADA A 12 (2026-07-22, pedido de Samuel con maqueta): la home deja de
// ser un aperitivo de 6 y pasa a cubrir las 12 dudas que de verdad frenan la
// reserva — en el layout de 2 columnas la lista larga es lo que le da cuerpo
// a la columna derecha. Orden = el de la maqueta (clima → pagos → logística →
// comida → a bordo → accesibilidad), no el de las categorías.
//
// PROCEDENCIA DE LAS RESPUESTAS (regla del proyecto: el contenido se porta,
// no se inventa). 9 son verbatim/recompuestas de FAQ_CATEGORIAS y MEDIOS_PAGO.
// Las 3 preguntas NUEVAS de la maqueta que no tenían respuesta en ninguna
// fuente se resuelven así:
//   · «¿Dónde y a qué hora es la salida?» → se compone de dos hechos que sí
//     son canónicos (hora confirmada por WhatsApp la tarde anterior +
//     recogida en hotel salvo charters).
//   · «¿Aceptan tarjeta…?» → tarjeta/efectivo salen de la FAQ de reservas y
//     las marcas de MEDIOS_PAGO. Lo de pagar «en el hotel» se traduce a «el
//     día del tour», que es el hecho que sí tenemos.
//   · ⚠️ «¿Es apto para embarazadas o personas mayores?» → NO hay política
//     del cliente sobre esto en ninguna fuente. En vez de inventarse una
//     (es una respuesta de seguridad, la peor para improvisar), la respuesta
//     deriva a WhatsApp. PENDIENTE de confirmar con el cliente.
export type FaqItem = { p: string; r: string }

export const FAQ_HOME: FaqItem[] = [
  {
    p: 'What happens if it rains on the day of my tour?',
    r: 'Full refund or a date change, at no cost. We only cancel if conditions are not safe.',
  },
  {
    p: 'Can I cancel my booking?',
    r: 'Free cancellation up to 7 days before the tour. After that, the cancellation policy applies.',
  },
  {
    p: 'Can I pay just the deposit?',
    r: 'Yes, you confirm with 25% and pay the rest on the day of the tour.',
  },
  {
    p: '¿Incluye recogida en mi hotel?',
    r: 'Yes, on every tour (except charters with their own meeting point).',
  },
  {
    p: 'Where and what time do we depart?',
    r: 'We confirm the exact pickup time by WhatsApp the afternoon before your tour. Except on charters with their own meeting point, we pick you up at your hotel.',
  },
  {
    p: '¿Puedo elegir mi plato?',
    r: 'Yes, each person picks their dish when booking: Seafood, Meat, Surf & Turf or Vegetarian. You can change it from My Booking up to 24 hours before.',
  },
  { p: '¿Hay baño a bordo?', r: 'Sí, todos nuestros barcos tienen baño.' },
  {
    p: 'What should I bring?',
    r: 'Swimsuit, towel, biodegradable sunscreen and cash for the balance if it applies.',
  },
  {
    p: 'Can I come if I cannot swim?',
    r: 'Yes, the snorkeling is in shallow water and life jackets are available.',
  },
  {
    p: 'Is it suitable for pregnant women or older guests?',
    r: 'It depends on the tour and on the sea that day. Write to us on WhatsApp before booking and we’ll tell you which one suits you.',
  },
  {
    p: 'Can children join every tour?',
    r: 'On Snorkel Lovers, yes; Semi-Private Premium is adults only (18+). We carry child life jackets in every size.',
  },
  {
    p: 'Do you take cards? Can I pay at the hotel?',
    r: 'We accept Visa, Mastercard, American Express and PayPal from My Booking. You can also pay the balance on the day of the tour, in cash, with a 5% discount.',
  },
]
