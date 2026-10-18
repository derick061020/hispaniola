// Página «Food & Bar» (/food-and-bar).
//
// [2026-10-16, pedido del cliente vía Derick: «una nueva sección de Food & Bar
// para la web principal… tomar como referencia la de Hispaniola Party Boat…
// adaptarla completamente al ecosistema visual de Hispaniola… No agregar,
// cambiar ni asumir ingredientes, precios o inclusiones»]
//
// DE DÓNDE SALE CADA TEXTO (regla del proyecto: el contenido se porta, no se
// inventa):
//   · Floating Kitchen y Open Bar → WEBSITE - INICIO pág. 4-5 (06- y 07-) y
//     el «What's Included» de WEBSITE-TOURS pág. 9-10. Son las MISMAS cadenas
//     que ya pinta la web, así que ya tienen su español en es.ts.
//   · Los cinco sellos de la cocina → WEBSITE-TOURS pág. 17-19, vía
//     `FICHAS['private-charter'].menuCharter.cocina`.
//   · Los platos → se LEEN de FICHAS (data/tours.ts), no se copian: si un
//     plato cambia en la ficha del tour, cambia aquí solo.
//   · Coco Loco y Floating Bar → itinerario aprobado (WEBSITE-TOURS pág. 8 y 9).
//   · Los niveles de barra de eventos → BARRAS_EVENTO (data/eventos.ts), que
//     ya está publicado en /events.
// Lo único NUESTRO son los títulos cortos de sección y las etiquetas de «en
// qué tour se sirve», que salen de cómo está montada cada ficha.
//
// ⚠️ PENDIENTE DE APROBACIÓN — rama `qa`, servida en hispaniola.botizate.com.
// No se publica en producción hasta que el cliente la apruebe.
//
// ⚠️ LO QUE SE DEJA FUERA A PROPÓSITO:
//   · «Tropical fruit» del buffet de Saona: está en la ficha, pero no en el
//     tarifario del cliente.
//   · La descripción del Kid's Meal: se leyó de la foto y sigue pendiente de
//     que Fernando la confirme (ver tours.ts). Sale solo el nombre.
//   · La langosta en el charter: Samuel la quitó el 2026-09-01 (solo Saona).
import { traducible } from '@/lib/i18n'

export const COMIDA_Y_BAR = traducible({
  meta: {
    titulo: 'Food & Bar',
    descripcion:
      'Our Floating Kitchen and open bar: gourmet menus freshly prepared on board, and drinks served throughout the tour.',
  },
  hero: {
    eyebrow: 'Floating Kitchen & Open Bar',
    titulo: 'Food & Bar',
    // WEBSITE - INICIO pág. 4, «06- FLOATING KITCHEN».
    lead: 'An exclusive live cooking experience with fresh seafood and gourmet menu choices.',
    imagen: { src: '/fotos/ev-corporate-menu-15.webp', alt: 'Grilled lobster and skewers served on deck' },
    // Cifras del hero, todas de contenido aprobado: los 7 platos (WEBSITE-
    // TOURS pág. 4 y 17), la barra libre (INICIO pág. 4-5) y los 3 niveles
    // de barra de eventos (tarifario).
    cifras: [
      { valor: '7', texto: 'gourmet dishes to choose from' },
      { valor: 'Live', texto: 'show cooking in the Floating Kitchen' },
      { valor: '3', texto: 'open bar levels for events' },
    ],
  },
  // Accesos rápidos bajo el hero: que en el móvil se vea de entrada que hay
  // dos mitades y se pueda saltar a la que interesa.
  anclas: [
    { id: 'menus', nombre: 'Menus' },
    { id: 'open-bar', nombre: 'Open Bar' },
  ],
  cocina: {
    eyebrow: 'Floating Kitchen',
    titulo: 'Freshly prepared on board. Never a reheated buffet.',
    // WEBSITE - NOSOTROS pág. 2-3, «KITCHEN OPERATIONS», verbatim (ya tiene
    // su español en es.ts).
    texto:
      'From land to our floating kitchen and then your table on board, our professional chefs prepare fresh, high-quality dishes with passion and attention to every detail, making every meal part of the experience.',
    imagen: { src: '/fotos/cocina-flotante.webp', alt: 'Our chefs with freshly grilled plates in the floating kitchen' },
    imagenPlataforma: { src: '/fotos/cocina-flotante-plataforma.webp', alt: 'The floating kitchen platform anchored at the natural pool' },
  },
  // Galería: 8 fotos reales de la cocina (las ev-corporate-menu-*, 1600 px).
  galeria: [
    { src: '/fotos/ev-corporate-menu-1.webp', alt: 'Grilled lobster, fish steak and calamari on a plate' },
    { src: '/fotos/ev-corporate-menu-4.webp', alt: 'Grilled lobster tails with skewers' },
    { src: '/fotos/ev-corporate-menu-11.webp', alt: 'A tray of grilled lobster' },
    { src: '/fotos/ev-corporate-menu-7.webp', alt: 'Sushi rolls and canapés' },
    { src: '/fotos/ev-corporate-menu-9.webp', alt: 'Fresh fruit skewers' },
    { src: '/fotos/ev-corporate-menu-13.webp', alt: 'A guest being served at the buffet on deck' },
    { src: '/fotos/ev-corporate-menu-16.webp', alt: 'Grilled lobster and chicken skewers' },
    { src: '/fotos/ev-corporate-menu-8.webp', alt: 'Chef preparing appetizers on board' },
    { src: '/fotos/ev-corporate-menu-3.webp', alt: 'Grilled lobster, fish and calamari plated on board' },
  ],
  menus: {
    eyebrow: 'Menus',
    titulo: 'What’s on the table',
    // Texto aprobado de WEBSITE-TOURS pág. 5 y 12.
    texto:
      'Select your favorite dish when you book. Our chefs prepare every meal fresh on board, turning lunch into one of the highlights of your day.',
    premiumTitulo: 'Premium Menu',
    premiumDonde: 'Semi-Private Premium · Snorkel Lovers · 4-hour private charters (up to 20 guests)',
    otrosTitulo: 'Other menus',
    ninos: 'Kids · Snorkel Lovers',
  },
  bar: {
    eyebrow: 'Open Bar',
    titulo: 'Premium Open Bar',
    // WEBSITE-TOURS pág. 9-10, «What's Included».
    texto: 'Beer, aged rum, vodka, tequila, juices, soft drinks and water throughout the tour.',
    // WEBSITE - INICIO pág. 4-5, «07- OPEN BAR», partido en piezas para que se
    // escanee. Sin marcas que el cliente no haya nombrado: la única es
    // Presidente.
    bebidas: [
      { id: 'cerveza', nombre: 'Presidente beer', nota: 'Unlimited · local beer' },
      { id: 'ron', nombre: 'Premium aged rum' },
      { id: 'vodka', nombre: 'Vodka' },
      { id: 'tequila', nombre: 'Tequila' },
      { id: 'jugos', nombre: 'Tropical juices' },
      { id: 'refrescos', nombre: 'Soft drinks', nota: 'Light and regular' },
      { id: 'agua', nombre: 'Bottled water' },
    ],
    momentos: [
      {
        id: 'bar-flotante',
        // WEBSITE-TOURS pág. 9-10.
        titulo: 'Floating Bar at the Natural Pool',
        texto: "Enjoy drinks while relaxing in Punta Cana's crystal-clear natural pool.",
        imagen: { src: '/fotos/bar-flotante.webp', alt: 'Guests at the floating bar in the natural pool' },
      },
      {
        id: 'coco-loco',
        // WEBSITE-TOURS pág. 8, itinerario del semi-privado.
        titulo: 'Secret Beach & Coco Loco',
        texto: 'Relax on a secluded beach while enjoying a freshly prepared Coco Loco served inside a real coconut, with or without alcohol.',
        imagen: null,
      },
    ],
    eventosTitulo: 'Open bar levels for private events',
    eventosTexto:
      'Party boats, weddings and corporate events sail with our Caribbean open bar included, and can upgrade it for the whole group.',
    eventosCta: 'See events',
  },
})

// [2026-10-18] Los tres niveles de barra de eventos EN LISTAS, como los
// presenta Party Boat («The bottles», «Cocktails»…). Es el MISMO contenido que
// `BARRAS_EVENTO` (data/eventos.ts, tarifario del cliente del 2026-10-08),
// solo partido en piezas para que se compare de un vistazo. Nada añadido: el
// Rompón y las marcas del Caribbean que lista la web de Party Boat NO están en
// el tarifario de Hispaniola y no se ponen.
export const NIVELES_BAR = traducible([
  {
    id: 'caribbean',
    grupos: [
      { titulo: 'Bottles', items: ['Dominican rum', 'Vodka', 'Tequila', 'Whisky'] },
      { titulo: 'Beer', items: ['Presidente beer'] },
      { titulo: 'Cocktails', items: ['Cuba Libre', 'Screwdriver', 'Whisky & Coke', 'Tequila Sunrise'] },
    ],
  },
  {
    id: 'caribbean-plus',
    grupos: [
      { titulo: 'Bottles', items: ['Everything in Caribbean'] },
      { titulo: 'Wine', items: ['White wine'] },
      { titulo: 'Cocktails', items: ['Mojito', 'Piña Colada', 'Margarita', 'Tequila Sunrise', 'Hispaniola Tropical Punch'] },
    ],
  },
  {
    id: 'signature',
    grupos: [
      { titulo: 'Bottles', items: ['Brugal Extra Viejo', 'Absolut', 'José Cuervo', 'Johnnie Walker'] },
      { titulo: 'Wine', items: ['Red wine', 'White wine', 'Prosecco'] },
      { titulo: 'Welcome drink', items: ['Caribbean Mimosa the moment you step on board'] },
    ],
  },
])

// [2026-10-16, cliente: «Para el tema del bar por favor en QA, no activa en la
// página, hasta que lo aprobemos»] Interruptor del bloque de niveles de barra
// de eventos dentro de esta página. En QA va encendido para que lo revisen; si
// no lo aprueban, se apaga aquí y la sección de Open Bar queda solo con la
// barra de los tours.
export const MOSTRAR_NIVELES_BAR_EVENTOS = true
