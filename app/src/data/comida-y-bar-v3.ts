// Food & Bar — PROPUESTA 3 (2026-10-21), definitiva desde 2026-10-22: ocupa /food-and-bar.
//
// [2026-10-21, Samuel] «No me gusta la versión actual. No la borres: se queda
// en /food-and-bar para comparar. Haz una propuesta nueva en otra ruta». Lo que
// pide:
//   1. Los estilos de Hispaniola que le gustan —la página del Museo, el tour
//      educativo de Bávaro Reef y la landing de agentes— y sobre todo los
//      efectos de estar BAJO EL AGUA (cáusticas, burbujas, ondas, profundidad,
//      transiciones de scroll). Reutilizados, no reinventados.
//   2. Que se parezca mucho a la página que hicieron ellos, más divertida:
//      hispaniolapartyboat.com/food-and-bar. De ahí sale la ESTRUCTURA y el
//      carácter: héroe con un ticket de papel inclinado y su sello [quitado en
//      la 2ª revisión], carrete de
//      fotos «lo que sale de la cocina», menús en cards con foto circular que
//      asoma por arriba, la card premium en oscuro, «Good to know», open bar
//      con el vaso recortado sobresaliendo de cada card, y un cierre para
//      decidir.
//
// LOS TEXTOS SIGUEN SIENDO LOS APROBADOS: todo lo que promete algo se LEE de
// data/comida-y-bar.ts (que dice de qué PDF sale cada frase), de las fichas
// (FICHAS) y de eventos (PAQUETES_COMIDA, BARRAS_EVENTO). Los titulares de la
// web de Party Boat NO se copian: son de otra marca y prometen cosas («is
// ours», «served on board») que aquí no valen para todos los tours (el buffet
// de Saona se sirve en la isla). Aquí solo hay RÓTULOS cortos nuestros, que
// nombran sin prometer.
//
// [2026-10-22] Samuel la eligió: ocupa /food-and-bar (sitemap y vercel.json
// incluidos). Las v1/v2 y la ruta -v3 se borraron.
import { traducible } from '@/lib/i18n'

export const COMIDA_Y_BAR_V3 = traducible({
  // [2026-10-21, 2ª revisión de Samuel] UN SOLO menú interno (IndiceV3): los
  // puntos laterales (escritorio) o la barra de abajo (móvil). Cada sección
  // lleva su ilustración (Magnific, GPT 2.5 con fondo transparente, proyecto
  // «Hispaniola — Food & Bar (web)», mismo prompt de estilo para las seis:
  // «3D clay-style icon… Caribbean palette of turquoise, coral red and warm
  // sand»). Son decorativas: el nombre de la sección va en texto al lado.
  // [3ª revisión] `corta`: el nombre breve que rotula el punto activo del
  // índice lateral (el largo, `label`, sale al pasar el ratón).
  anclas: [
    { id: 'floating-kitchen', label: 'Floating Kitchen', corta: 'Kitchen', ilustracion: '/fotos/comida-bar/ilus-cocina.webp' },
    { id: 'menus', label: 'Menus', corta: 'Menus', ilustracion: '/fotos/comida-bar/ilus-menus.webp' },
    { id: 'event-menus', label: 'Event menus', corta: 'Events', ilustracion: '/fotos/comida-bar/ilus-eventos.webp' },
    { id: 'open-bar', label: 'Open Bar', corta: 'Open Bar', ilustracion: '/fotos/comida-bar/ilus-bar.webp' },
    { id: 'event-bars', label: 'Event bars', corta: 'Bars', ilustracion: '/fotos/comida-bar/ilus-barras.webp' },
    { id: 'your-tour', label: 'Your tour', corta: 'Tours', ilustracion: '/fotos/comida-bar/ilus-tour.webp' },
  ],
  indice: {
    titulo: 'On this page',
    abrir: 'Open the section menu',
    cerrar: 'Close the section menu',
  },
  // [2ª revisión: «el ticket no me gusta nada, lo veo quemado»] Fuera el
  // ticket. En su lugar, el Coco Loco (la bebida de la casa, servida en coco)
  // con burbujas subiendo: un recorte que ya había, sin rótulos ni cifras.
  heroComposicion: {
    bebida: { src: '/fotos/comida-bar/bebida-coco-loco.webp', alt: 'A Coco Loco served inside a fresh coconut' },
  },
  cocina: {
    numero: '01',
    pista: 'Tap any photo to open it.',
  },
  menus: {
    numero: '02',
    eyebrow: 'Tour menus',
    // [2026-10-22] El desplegable del Premium dentro de su tarjeta.
    verTodos: 'See all {n} dishes',
    verMenos: 'Show fewer',
  },
  eventos: {
    // El badge que /events ya le pone al Premium (Turtle) Package.
    destacado: 'Most complete',
    // [2026-10-22, revisión] Alt que DESCRIBE la foto (el de PAQUETES_COMIDA
    // decía «Party boat Starfish Package»). Solo la v3; /events no cambia.
    fotoAlt: {
      premium: 'Premium (Turtle) Package: lobster, skewers and fries on a white plate',
      'package-i': 'A hot dog and a fruit skewer on a white plate',
      'package-ii': 'A hot dog, chicken and beef skewers and french fries on a white plate',
      'package-iii': 'Chicken, beef and shrimp skewers with shrimp tempura and french fries on a white plate',
    } as Record<string, string>,
  },
  bar: {
    numero: '03',
    // [2026-10-22] Títulos de los dos grupos de bebidas, por id de grupo.
    grupos: { licores: 'With alcohol', 'sin-alcohol': 'Alcohol-free' } as Record<string, string>,
  },
  cierre: {
    eyebrow: 'Your tour',
    titulo: 'Pick your tour',
    verTour: 'See the tour',
    verBarras: 'See event bars',
    reservar: 'Book your tour',
    planear: 'Plan an event',
    todos: 'See all tours',
    subir: 'Back to the surface',
  },
})
