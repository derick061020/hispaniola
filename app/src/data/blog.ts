import { traducible } from '@/lib/i18n'

// BLOG (/blog) — página NUEVA de las correcciones v1 del cliente
// (2026-07-20, planes/06-blog.md). No existía nada de esto en el proyecto.
//
// ⚠️ ALCANCE, Y POR QUÉ ES ASÍ. El cliente mandó la maqueta de un blog con
// artículo destacado, rejilla filtrable por categoría y newsletter. Eso es
// maquetable. Lo que NO es maquetable es el contenido: un blog son artículos
// escritos, y escribir posts de viaje inventándose datos sobre Punta Cana
// sería exactamente lo que este proyecto no hace.
//
// Solución: los TÍTULOS, categorías y extractos son propuestas de la misma
// naturaleza que las de la maqueta del cliente (Samuel pidió ampliarlas
// 2026-07-22 para que cada categoría tenga entre 3 y 5 tarjetas — "para que
// haya más contenido"), y el CUERPO de cada artículo solo está escrito para
// los que se pueden sostener con contenido REAL que ya vive en el proyecto —
// hoy uno: la guía de esnórquel, cuyo texto sale de TIPS_GUIAS (data/guias.ts),
// que a su vez viene de la web del cliente.
//
// El resto son `cuerpo: null` = "propuesto, sin escribir". Desde 2026-07-22
// TODAS las cards (destacadas y rejilla) enlazan igual a /blog/:slug con su
// botón «Leer el artículo» — ya no se distingue con un chip «Próximamente» ni
// se ocultan el enlace: la propia plantilla de artículo (pages/articulo.tsx)
// resuelve el caso `cuerpo: null` mostrando el mismo encabezado/portada con
// una nota honesta de "en redacción" en vez de fingir un cuerpo que no existe.
// Cuando se escriban, basta con rellenar `cuerpo` y la página se completa sola.
//
// Autores: los del EQUIPO real (data/nosotros.ts) — Omar, Lola y Blanka, los
// mismos nombres que el propio cliente dio en sus maquetas.

export type CategoriaBlog =
  | 'Punta Cana guides'
  | 'Travel tips'
  | 'Life on board'
  | 'Sustainability'
  | 'Things to do'

export const CATEGORIAS_BLOG: CategoriaBlog[] = traducible([
  'Punta Cana guides',
  'Travel tips',
  'Life on board',
  'Sustainability',
  'Things to do',
])

export type Articulo = {
  slug: string
  titulo: string
  extracto: string
  categoria: CategoriaBlog
  /** id de EQUIPO (data/nosotros.ts). */
  autorId: string
  fecha: string
  minutos: number
  /** Foto de portada, en /fotos (sin extensión). */
  foto: string
  fotoAlt: string
  /** Aparece en el carrusel de destacados del índice (al menos 4, pedido de
   *  Samuel 2026-07-22). No lo saca de la rejilla de abajo — un artículo
   *  destacado también se puede seguir navegando/filtrando por categoría ahí,
   *  igual que en cualquier blog con hero + listado. */
  destacado?: boolean
  /** Cuerpo del artículo. null = propuesto pero SIN ESCRIBIR (ver arriba). */
  cuerpo: BloqueArticulo[] | null
}

/** Bloque del cuerpo de un artículo (pages/articulo.tsx). Los 3 niveles de
 *  encabezado (correcciones v1, pedido de Samuel 2026-07-22: "distintos
 *  títulos en diferentes niveles h2, h3, h4") llevan `id` explícito, no
 *  generado por slugify del texto — son unos pocos artículos escritos a
 *  mano, así que el id explícito es más simple que una utilidad de slugify
 *  para evitar colisiones. El índice al principio del artículo
 *  (blog/indice-articulo.tsx) enlaza a esos mismos id vía ancla (#id). */
export type BloqueArticulo =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'h2'; id: string; texto: string }
  | { tipo: 'h3'; id: string; texto: string }
  | { tipo: 'h4'; id: string; texto: string }

export const ARTICULOS: Articulo[] = traducible([
  {
    slug: 'esnorquel-punta-cana-honesto',
    titulo: 'Is Punta Cana good for snorkeling? The honest answer',
    extracto:
      'For pure diving there are better spots in the Caribbean. For seeing turtles, few places beat it. Here’s why, with no marketing.',
    categoria: 'Punta Cana guides',
    autorId: 'omar',
    fecha: 'Jul 12, 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-1-v2',
    fotoAlt: 'Guests snorkeling over the coral nursery',
    destacado: true,
    // Único artículo con cuerpo: cada bloque sale de contenido REAL del
    // proyecto (TIPS_GUIAS en data/guias.ts, portado de la web del cliente,
    // + los datos de la fundación en data/sostenibilidad.ts). No hay ni una
    // afirmación nueva sobre Punta Cana escrita aquí — solo reorganizado en
    // secciones con encabezado (ampliación 2026-07-22, pedido de Samuel:
    // "artículo más largo con distintos títulos en diferentes niveles h2,
    // h3, h4") y con 2 preguntas de TIPS_GUIAS que el primer borrador no
    // usaba (vela/motor, marisco/cocina flotante) — mismo pool de contenido
    // vetado, solo que antes esta página no las incluía.
    cuerpo: [
      { tipo: 'h2', id: 'respuesta-corta', texto: 'The short answer' },
      {
        tipo: 'parrafo',
        texto:
          'Let’s be honest: the Dominican Republic (Punta Cana included) does not have the best diving areas in the Caribbean. If you have been to the Virgin Islands or to Turks and Caicos, the view will probably disappoint you a little. Many areas of the Atlantic coast have been damaged over the years by diving and fishing, and Catalina or Bayahibe, on the south coast facing the Caribbean Sea, have better visibility.',
      },
      { tipo: 'h2', id: 'lo-que-si-puedes-ver', texto: 'What you can see, almost guaranteed' },
      {
        tipo: 'parrafo',
        texto:
          'That said, there is something you can do here and in few other places: see turtles. On our tour there is an almost 100% chance of seeing them from the catamaran. It is not luck: artificial reefs have been planted and built since 2016 to restore the marine habitat, and the Ministry of the Environment has rated the project as one of the 3 largest coral gardening projects in the country.',
      },
      { tipo: 'h3', id: 'fundacion-bavaro-reefs', texto: 'The Bávaro Reefs Foundation, behind those turtles' },
      {
        tipo: 'parrafo',
        texto:
          'The foundation, founded and run by Hispaniola Aquatic Adventures, supports real environmental milestones with direct financial contributions and active collaboration: the creation and expansion of marine protected areas, the recovery and monitoring of the green turtle in the Dominican Republic, and coral restoration at Coral Garden, today one of the most effective reef restoration sites in the country.',
      },
      { tipo: 'h4', id: 'aporte-por-huesped', texto: 'A direct contribution from every guest' },
      {
        tipo: 'parrafo',
        texto:
          'It is not just brand talk: from every guest, US$ 2.00 goes directly to the foundation’s initiatives. Sailing with us funds, in practice, the very reef you are snorkeling over.',
      },
      { tipo: 'h2', id: 'seguridad-del-mar', texto: 'And what about safety at sea?' },
      {
        tipo: 'parrafo',
        texto:
          'It is the other question we get asked most. Many areas of Punta Cana and Bávaro, being on the Atlantic side, have choppy water because of the direction of the current. Our tour area is near Cabo Engaño, where the Caribbean Sea begins, and the route runs inside a reef lagoon. The coral barrier shelters the sailing, so the trip is calm and no seasickness pills are needed.',
      },
      { tipo: 'h2', id: 'vela-o-motor', texto: 'Sail or motor? What nobody tells you about the wind in Bávaro' },
      {
        tipo: 'parrafo',
        texto:
          'The tour area is inside the reef, which means shallow water. Because of that, and because of the wind direction, the catamaran runs on motor for at least 50% of the time. These are not ideal conditions for pure sailing, but the snorkeling, the length of the tour and the food prepared on board more than make up for the motored stretch.',
      },
      { tipo: 'h2', id: 'de-donde-sale-el-marisco', texto: 'Where the seafood you eat on board comes from' },
      {
        tipo: 'parrafo',
        texto:
          'Most restaurants and hotels keep their seafood frozen, because it is imported. On our tours it is caught fresh locally, and we season it with fresh herbs and olive oil right in front of you, in the floating kitchen.',
      },
      { tipo: 'h3', id: 'permisos-cocina-flotante', texto: 'A platform with every permit in order' },
      {
        tipo: 'parrafo',
        texto:
          'The floating kitchen holds every permit and exceeds the hygiene requirements of the Ministry of the Environment, the same regulations as any kitchen on land, not an improvised grill on deck.',
      },
      { tipo: 'h2', id: 'conclusion', texto: 'Conclusion' },
      {
        tipo: 'parrafo',
        texto:
          'If you are coming for the best diving in the Caribbean, Punta Cana is not your destination and we are not going to tell you otherwise. If you are coming for a calm day at sea, with turtles almost guaranteed and food made on board, here we are.',
      },
    ],
  },
  {
    slug: 'cinco-cosas-antes-de-un-catamaran',
    titulo: '5 things nobody tells you before a catamaran tour',
    extracto: 'What you really want to know to enjoy the day with no surprises.',
    categoria: 'Travel tips',
    autorId: 'eva',
    fecha: 'Jul 5, 2026',
    minutos: 6,
    foto: 'galeria-charter-privado-2',
    fotoAlt: 'Group enjoying the deck of a catamaran',
    cuerpo: null,
  },
  {
    slug: 'como-restauramos-el-arrecife',
    titulo: 'How we restore the Cabeza de Toro reef (and why it matters)',
    extracto:
      'Inside the coral project the Ministry ranks among the 3 largest in the country.',
    categoria: 'Sustainability',
    autorId: 'omar',
    fecha: 'Jun 28, 2026',
    minutos: 7,
    foto: 'arrecife-fondo-cenital-v2',
    fotoAlt: 'Overhead view of the Caribbean Sea with turquoise water',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'de-donde-sale-el-marisco',
    titulo: 'Where the seafood in your lunch on board comes from',
    extracto: 'The path from the sea to your plate: freshly caught and cooked in front of you.',
    categoria: 'Life on board',
    autorId: 'lola',
    fecha: 'Jun 20, 2026',
    minutos: 5,
    foto: 'cocina-flotante',
    fotoAlt: 'The crew cooking seafood in the floating kitchen',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'isla-saona-vs-piscina-natural',
    titulo: 'Saona Island vs. the Natural Pool: which one is for you?',
    extracto: 'We compare the two star experiences so you can pick yours.',
    categoria: 'Things to do',
    autorId: 'eva',
    fecha: 'Jun 14, 2026',
    minutos: 6,
    foto: 'galeria-isla-saona-4',
    fotoAlt: 'Shallow turquoise water at the natural pool',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'mejor-epoca-punta-cana',
    titulo: 'Best time to visit Punta Cana: month by month',
    extracto: 'Weather, prices and crowds: what to expect in each month of the year.',
    categoria: 'Punta Cana guides',
    autorId: 'lola',
    fecha: 'Jun 6, 2026',
    minutos: 9,
    foto: 'galeria-snorkel-lovers-2-v2',
    fotoAlt: 'Catamaran anchored over turquoise water',
    cuerpo: null,
  },
  {
    slug: 'que-llevar-a-un-catamaran',
    titulo: 'What to bring on a catamaran trip (the real list)',
    extracto: 'The short, honest list of what you do need, and what you don’t.',
    categoria: 'Travel tips',
    autorId: 'eva',
    fecha: 'May 30, 2026',
    minutos: 4,
    foto: 'galeria-charter-privado-6-v2',
    // [2026-08-20] «Family» ya no era cierto: la foto nueva son ocho adultos.
    fotoAlt: 'Group enjoying a deserted beach',
    cuerpo: null,
  },
  // ---- Ampliación 2026-07-22 (Samuel: "cada categoría entre 3 y 5 cards,
  // para que haya más contenido") — Guías de Punta Cana y Consejos de viaje
  // suben a 5, Vida a bordo/Sostenibilidad/Qué hacer suben a 3. Mismo criterio
  // que el resto: títulos propuestos, `cuerpo: null`, fotos REALES ya
  // existentes en /fotos (ninguna nueva generada para esto).
  {
    slug: 'isla-saona-catamaran-o-lancha',
    titulo: 'Saona Island by catamaran or by speedboat: the real differences',
    extracto: 'Two ways to reach the same island, with very different experiences. How they really differ.',
    categoria: 'Punta Cana guides',
    autorId: 'lola',
    fecha: 'May 24, 2026',
    minutos: 7,
    foto: 'galeria-isla-saona-6',
    fotoAlt: 'Speedboat and catamaran near the coast of Saona Island',
    cuerpo: null,
  },
  {
    slug: 'charter-privado-vs-compartido',
    titulo: 'Private Charter vs. shared tour: how to choose yours',
    extracto: 'Group, budget and how much you want the day to be yours: the questions that really decide it.',
    categoria: 'Punta Cana guides',
    autorId: 'omar',
    fecha: 'May 10, 2026',
    minutos: 6,
    foto: 'galeria-charter-privado-5',
    fotoAlt: 'Small group celebrating on board a private charter',
    cuerpo: null,
  },
  {
    slug: 'punta-cana-con-ninos',
    titulo: 'Punta Cana with kids: which tour suits each age',
    extracto: 'Not all tours are the same with little ones on board. A quick guide to choosing with no surprises.',
    categoria: 'Punta Cana guides',
    autorId: 'eva',
    fecha: 'Apr 26, 2026',
    minutos: 5,
    foto: 'galeria-charter-privado-3',
    fotoAlt: 'Family with children enjoying a catamaran tour',
    cuerpo: null,
  },
  {
    slug: 'como-no-marearte-en-catamaran',
    titulo: 'How not to get seasick on a catamaran tour',
    extracto: 'Simple tricks (and one you weren’t expecting) to enjoy the sea even with a delicate stomach.',
    categoria: 'Travel tips',
    autorId: 'eva',
    fecha: 'May 18, 2026',
    minutos: 4,
    foto: 'galeria-snorkel-lovers-5',
    fotoAlt: 'Guests enjoying the bow of the catamaran',
    cuerpo: null,
  },
  {
    slug: 'reservar-con-antelacion-o-al-momento',
    titulo: 'Booking in advance or at the last minute: which pays off more',
    extracto: 'Price, availability and room to maneuver: the pros and cons of each moment to book.',
    categoria: 'Travel tips',
    autorId: 'lola',
    fecha: 'May 3, 2026',
    minutos: 5,
    foto: 'tour-charter-privado-v2',
    fotoAlt: 'Hispaniola catamaran ready to set sail',
    cuerpo: null,
  },
  {
    slug: 'punta-cana-en-pareja-luna-de-miel',
    titulo: 'Punta Cana as a couple: our route for a honeymoon',
    extracto: 'How to put together a day at sea that feels tailor-made for two.',
    categoria: 'Travel tips',
    autorId: 'eva',
    fecha: 'Apr 19, 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-3',
    fotoAlt: 'Couple enjoying the sea view from the catamaran',
    cuerpo: null,
  },
  {
    slug: 'un-dia-en-la-vida-de-la-tripulacion',
    titulo: 'A day in the life of our crew',
    extracto: 'From sunrise until the last catamaran ties up: this is a normal day for the people who make the tour possible.',
    categoria: 'Life on board',
    autorId: 'lola',
    fecha: 'Apr 12, 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-5-v2',
    // [2026-08-20] El alt nunca describio esta foto (es la cocina flotante con
    // las bandejas emplatadas, no la preparacion del barco). La foto nueva es
    // la misma escena en alta, asi que se corrige el texto.
    fotoAlt: 'The crew plating the floating-kitchen lunch',
    cuerpo: null,
  },
  {
    slug: 'el-playlist-de-cada-tour',
    titulo: 'How we put together the playlist for every tour',
    extracto: 'The music is part of the experience too. Here’s how we choose it.',
    categoria: 'Life on board',
    autorId: 'lola',
    fecha: 'Mar 29, 2026',
    minutos: 4,
    foto: 'bar-flotante',
    fotoAlt: 'Floating bar next to the catamaran with background music',
    cuerpo: null,
  },
  {
    slug: 'plastico-cero-a-bordo',
    titulo: 'Zero plastic on board: how we did it',
    extracto: 'The concrete changes we made to get single-use plastic off our catamarans.',
    categoria: 'Sustainability',
    autorId: 'omar',
    fecha: 'Apr 5, 2026',
    minutos: 6,
    foto: 'cocina-flotante-plataforma',
    fotoAlt: 'Floating kitchen preparing food on board',
    cuerpo: null,
  },
  {
    slug: 'por-que-no-alimentamos-a-los-peces',
    titulo: 'Why we don’t feed the fish (even when guests ask)',
    extracto: 'A frequent question on board, and the ecological reason behind our “no”.',
    categoria: 'Sustainability',
    autorId: 'omar',
    fecha: 'Mar 15, 2026',
    minutos: 5,
    foto: 'galeria-snorkel-lovers-9-v2',
    fotoAlt: 'Guest snorkeling next to tropical fish',
    cuerpo: null,
  },
  {
    slug: 'snorkel-lovers-que-esperar',
    // [2026-08-12] Renombre del tour. El SLUG del artículo se queda: es una URL
    // del blog y el renombre no toca URLs (ver la tabla en data/home.ts).
    titulo: 'Coral Quest: what to expect from our most popular tour',
    extracto: 'What it includes, who it suits and what you’ll find underwater.',
    categoria: 'Things to do',
    autorId: 'eva',
    fecha: 'Mar 22, 2026',
    minutos: 6,
    foto: 'galeria-snorkel-lovers-11-v2',
    fotoAlt: 'Group snorkeling in turquoise water',
    cuerpo: null,
  },
  {
    slug: 'recuerdos-de-isla-saona-sin-dañar',
    titulo: 'What to take home from Saona Island without harming the ecosystem',
    extracto: 'Souvenir ideas that don’t involve taking a piece of the ecosystem home.',
    categoria: 'Things to do',
    autorId: 'lola',
    fecha: 'Mar 8, 2026',
    minutos: 5,
    foto: 'galeria-isla-saona-9',
    fotoAlt: 'Close-up of sand and shells on the shore of Saona Island',
    cuerpo: null,
  },
])

export const BLOG_HERO = traducible({
  eyebrow: 'Blog',
  titulo: 'The Caribbean, told by the people who sail it',
  sub: 'Honest guides, stories from the sea and real advice for your trip to Punta Cana. No empty marketing.',
  // Fotos del hero compartido (mismo patrón que el resto de internas).
  galeria: ['galeria-snorkel-lovers-2-v2', 'galeria-charter-privado-2', 'galeria-semi-privado-1-v2'],
})
