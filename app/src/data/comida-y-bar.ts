// Página «Food & Bar» (/food-and-bar) — versión NUEVA, 2026-10-17.
//
// [2026-10-16, Marketing en «MARKETING WEB»] «Necesitamos trabajar con
// urgencia una nueva sección de Food & Bar para la web principal… tomar como
// referencia la de Hispaniola Party Boat (hispaniolapartyboat.com/food-and-bar)
// … NO copiarla, sino tomar su estructura… y adaptarla completamente al
// ecosistema visual y UX actual de Hispaniola». La primera versión la hizo
// Derick (rama `qa`, hispaniola.botizate.com/food-and-bar) y Marketing la
// rechazó: «no quedó a nivel visual y de experiencia de usuario como
// necesitamos». Esta la rehacemos nosotros desde cero sobre producción.
//
// LA REGLA QUE MÁS PESA DEL ENCARGO: «Mantener la información exactamente como
// esté aprobada. No agregar, cambiar ni asumir ingredientes, precios o
// inclusiones». Por eso aquí NO hay platos ni precios escritos a mano: los
// menús se LEEN de las fichas (`FICHAS` de data/tours.ts) y de eventos
// (`PAQUETES_COMIDA` / `BARRAS_EVENTO` de data/eventos.ts), que es lo que ya
// está publicado. Si un plato cambia en la ficha, cambia aquí solo.
//
// DE DÓNDE SALE CADA TEXTO DE ESTE ARCHIVO:
//   · Hero, lead → WEBSITE - INICIO pág. 4, «06- FLOATING KITCHEN».
//   · Título de la cocina → WEBSITE-TOURS pág. 2-3 (descripción del Caribbean
//     Escape: «…restaurant-quality cuisine in the middle of the Caribbean Sea»).
//   · Párrafo de la cocina → WEBSITE - NOSOTROS pág. 2-3, «KITCHEN OPERATIONS».
//   · Título y bajada de menús → WEBSITE-TOURS pág. 5 («Your table comes with an
//     ocean view» / «Select your favorite dish when you book…»).
//   · Open Bar → WEBSITE - INICIO pág. 4-5, «07- OPEN BAR», partido en piezas
//     para que se escanee (incluye «refreshments», que la versión de Derick se
//     había comido). La única marca nombrada es Presidente: no se añaden más.
//   · Floating Bar y Coco Loco → «What's Included» e itinerario aprobados
//     (WEBSITE-TOURS pág. 8-10).
// Lo único NUESTRO son las etiquetas cortas (eyebrows, «Choose one», «Served
// on», «Level»…): rotulan, no prometen nada.
//
// [2026-10-17, 2ª vuelta — Samuel: «poco visual, confusa y poco fluida»] Se
// rehace la página entera. Los TEXTOS no cambian (siguen siendo los
// aprobados); cambia cómo se enseñan:
//   · Las bebidas dejan los iconos y pasan a FOTOS RECORTADAS (WebP con
//     transparencia) generadas con Magnific — encargo de Samuel, trabajo de
//     Miguel. Proyecto «Hispaniola — Food & Bar (web)» en Magnific. Son
//     ILUSTRATIVAS: botellas sin etiqueta, ninguna marca.
//   · Los platos usan las MISMAS fotos reales de las fichas (plato-*.webp),
//     escaladas ×2 con Magnific Precision (modo foto, sin inventar detalle) y
//     recortadas: `/fotos/comida-bar/<foto>-recorte.webp`.
//
// ⚠️ PENDIENTE DE APROBACIÓN — no se publica en producción hasta que Marketing
// la apruebe en QA («DESARROLLO EN QA → REVISIÓN INTERNA → CORRECCIONES →
// APROBACIÓN FINAL → PRODUCCIÓN»).
import { traducible } from '@/lib/i18n'

export type FotoComida = {
  /** nombre del archivo en /fotos, sin extensión (lo que espera GaleriaLightbox) */
  id: string
  alt: string
}

/** Ruta del recorte (sin fondo) de una foto de plato de las fichas. */
export const recortePlato = (foto: string) => `/fotos/comida-bar/${foto}-recorte.webp`

export const COMIDA_Y_BAR = traducible({
  meta: {
    titulo: 'Food & Bar — Floating Kitchen and Open Bar',
    descripcion:
      // [2026-10-17, verificación] Sin «every tour» ni «on board»: Saona no lista
      // open bar y su buffet se sirve en la isla.
      'Our Floating Kitchen menus and open bar, tour by tour: gourmet dishes, the Premium Menu, and drinks served throughout the tour in Punta Cana.',
  },
  hero: {
    eyebrow: 'Floating Kitchen & Open Bar',
    titulo: 'Food & Bar',
    lead: 'An exclusive live cooking experience with fresh seafood and gourmet menu choices.',
    // [2026-10-17, QA r3] Versión de 1440 px (117 KB; el original de 1600 pesaba 188).
    imagen: {
      src: '/fotos/comida-bar/hero-comida-1440.webp',
      alt: 'Grilled lobster and skewers plated on deck, with the sea behind',
    },
    ctaMenus: 'See the menus',
    ctaBar: 'See the Open Bar',
  },
  cocina: {
    eyebrow: 'Floating Kitchen',
    titulo: 'Restaurant-quality cuisine in the middle of the Caribbean Sea.',
    texto:
      'From land to our floating kitchen and then your table on board, our professional chefs prepare fresh, high-quality dishes with passion and attention to every detail, making every meal part of the experience.',
    // [2026-10-17, verificación ronda 3] Fuera las de catering de eventos
    // (bandejas de buffet, sushi, canapés, brochetas de fruta): contradecían
    // «Never a reheated buffet» y enseñaban comida que ningún menú de tour
    // sirve. Quedan las de la parrilla y la cocina flotante.
    // Las fotos reales de cocina a bordo (las ev-corporate-menu-*; las de
    // party boat y bodas son las mismas con otro nombre) + las dos de la
    // cocina flotante. Las 5 primeras forman el mosaico; todas van al visor.
    fotos: [
      { id: 'ev-corporate-menu-1', alt: 'Grilled lobster, fish steak and calamari on a plate' },
      { id: 'cocina-flotante', alt: 'Our chefs with freshly grilled plates in the floating kitchen' },
      { id: 'ev-corporate-menu-11', alt: 'A tray of grilled lobster' },
      { id: 'ev-corporate-menu-16', alt: 'Grilled lobster and chicken skewers' },
      { id: 'cocina-flotante-plataforma', alt: 'The floating kitchen platform anchored at the natural pool' },
      { id: 'ev-corporate-menu-4', alt: 'Grilled lobster tails with skewers' },
      { id: 'ev-corporate-menu-3', alt: 'Grilled lobster with calamari and fish' },
    ] satisfies FotoComida[],
  },
  menus: {
    eyebrow: 'Menus',
    titulo: 'Your table comes with an ocean view',
    texto:
      'Select your favorite dish when you book. Our chefs prepare every meal fresh on board, turning lunch into one of the highlights of your day.',
    veda: '* Lobster is replaced with wild jumbo shrimp from March to June (closed season).',
    servidoEn: 'Served on',
  },
  eventos: {
    titulo: 'Private events have their own menus',
    texto: 'Party boats, weddings and corporate groups choose from four packages, priced for up to 12 guests.',
    cta: 'See event menus',
  },
  bar: {
    eyebrow: 'Open Bar',
    titulo: 'Premium Open Bar',
    texto: 'Beer, aged rum, vodka, tequila, juices, soft drinks and water throughout the tour.',
    // OJO: el «all our cruises include» de la home NO vale para Saona, cuya
    // ficha no lista open bar. Por eso no se dice «en todos los tours»: el
    // componente nombra los tours cuya ficha sí lo incluye.
    sello: 'Included on',
    grupos: [
      {
        id: 'licores',
        titulo: 'Beer & spirits',
        bebidas: [
          {
            id: 'cerveza',
            nombre: 'Presidente beer',
            nota: 'Unlimited · local beer',
            imagen: '/fotos/comida-bar/bebida-cerveza.webp',
          },
          { id: 'ron', nombre: 'Premium aged rum', imagen: '/fotos/comida-bar/bebida-ron.webp' },
          { id: 'vodka', nombre: 'Vodka', imagen: '/fotos/comida-bar/bebida-vodka.webp' },
          { id: 'tequila', nombre: 'Tequila', imagen: '/fotos/comida-bar/bebida-tequila.webp' },
        ],
      },
      {
        id: 'sin-alcohol',
        titulo: 'Soft & fresh',
        bebidas: [
          { id: 'jugos', nombre: 'Tropical juices', imagen: '/fotos/comida-bar/bebida-jugos.webp' },
          { id: 'refrescos', nombre: 'Refreshments', imagen: '/fotos/comida-bar/bebida-refrescos.webp' },
          {
            id: 'sodas',
            nombre: 'Soft drinks',
            nota: 'Light and regular',
            imagen: '/fotos/comida-bar/bebida-sodas.webp',
          },
          { id: 'agua', nombre: 'Bottled water', imagen: '/fotos/comida-bar/bebida-agua.webp' },
        ],
      },
    ],
    momentos: [
      {
        id: 'bar-flotante',
        titulo: 'Floating Bar at the Natural Pool',
        texto: "Enjoy drinks while relaxing in Punta Cana's crystal-clear natural pool.",
        imagen: { src: '/fotos/bar-flotante.webp', alt: 'Guests at the floating bar in the natural pool' },
        recorte: false,
        // Los dos con «Floating Bar at the Natural Pool» en su «incluye».
        tours: ['caribbean-escape', 'coral-quest'],
      },
      {
        id: 'coco-loco',
        titulo: 'Secret Beach & Coco Loco',
        texto:
          'Relax on a secluded beach while enjoying a freshly prepared Coco Loco served inside a real coconut, with or without alcohol.',
        // Ilustrativa (Magnific): sigue sin haber foto real del Coco Loco.
        imagen: { src: '/fotos/comida-bar/bebida-coco-loco.webp', alt: 'A Coco Loco served inside a fresh coconut' },
        recorte: true,
        // [2026-10-17, verificación] Solo el Caribbean Escape para en la playa
        // del Coco Loco: el Coral Quest la perdió (tours.ts, «DESAPARECE la
        // playa desierta con coco-loco»).
        tours: ['caribbean-escape'],
      },
    ],
  },
  niveles: {
    eyebrow: 'Private events',
    titulo: 'Open bar levels for private events',
    texto: 'Private events sail with the Caribbean bar included and can upgrade the whole group.',
    cta: 'Plan an event',
    nivel: 'Level',
    // La bebida de cada nivel es un cóctel que ESE nivel sirve según
    // BARRAS_EVENTO (Cuba Libre → Caribbean, Mojito → Plus/Premium, Caribbean
    // Mimosa → Signature). Ilustrativas, generadas con Magnific.
    bebidas: {
      caribbean: { src: '/fotos/comida-bar/bebida-cuba-libre.webp', alt: 'A Cuba Libre' },
      'caribbean-plus': { src: '/fotos/comida-bar/bebida-mojito.webp', alt: 'A Mojito' },
      signature: { src: '/fotos/comida-bar/bebida-mimosa.webp', alt: 'A Caribbean Mimosa' },
    } as Record<string, { src: string; alt: string }>,
  },
})

// [2026-10-16, Marketing a Derick: «Para el tema del bar por favor en QA, no
// activa en la página, hasta que lo aprobemos»] Interruptor del bloque de
// NIVELES de barra de eventos. [2026-10-17, Samuel] Marketing los quiere: se
// muestran. Si cambian de idea, se apaga aquí.
export const MOSTRAR_NIVELES_BAR_EVENTOS = true
