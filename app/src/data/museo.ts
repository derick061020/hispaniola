import { traducible } from '@/lib/i18n'
import { FICHAS } from '@/data/tours'
import { TOURS } from '@/data/home'

// MUSEO SUBACUÁTICO (/underwater-museum) — página NUEVA, 2026-10-07.
//
// EL ENCARGO (reunión Raymond–Samuel del 2026-10-05, transcripción en
// Downloads «Estatus de la semana – Proyectos Web»): el museo abre el 1 de
// noviembre y /marine-park lo cuenta «muy informativo»; ahora hace falta una
// página que lo VENDA. Raymond trajo dos prototipos hechos por él con IA
// (carpeta «Ejemplo visual»):
//   · V1 — «la versión informativa»: ESTRUCTURA Y TEXTOS. Es la fuente de este
//     fichero, sección por sección y en su orden.
//   · V2 — «la B2»: EL DINAMISMO (burbujas, medidor de profundidad, tarjetas que
//     flotan, colores al pasar el cursor). Se rehace entero; de su copy no se
//     toma nada (sus tres puntos sobre la escultura se quitaron en la 2ª vuelta).
//
// ⚠️ LA INFORMACIÓN QUE MANDA ES LA DE LA CARPETA DEL CLIENTE (Samuel,
// 2026-10-07: «si en la v1 sale que está incluido con Coral Quest, esa es la
// información correcta»). Choca con /marine-park, que dice que al museo se
// entra con la pulsera de la Fundación — se queda anotado, NO se corrige aquí
// ni allí sin que lo pida el cliente.
//
// El V1 está en español y la web va en inglés (decisión de la misma reunión:
// «debe ser en inglés»). Lo de abajo es traducción fiel, sin añadir promesas.
// Donde el V2 contradice al V1 (horarios 8:20/12:20, «a partir de 4 años», «de
// quién es el museo»), gana el V1; los horarios ni se mencionan porque el V1
// no los da y la ficha de Coral Quest ya los tiene (9:00 AM / 1:00 PM).

const CORAL_QUEST = TOURS.find((t) => t.slug === 'coral-quest')
const FICHA_CQ = FICHAS['coral-quest']

/** Precios de Coral Quest leídos de los datos del tour, no escritos aquí. El
 *  V1 pinta 99 / 114: es `precioLight` y `precioLight + upgradePremium`. Si
 *  la tarifa cambia, esta página la sigue sola. */
export const PRECIO_MUSEO = {
  light: CORAL_QUEST?.precioLight ?? null,
  premium:
    CORAL_QUEST?.precioLight != null && FICHA_CQ?.upgradePremium != null
      ? CORAL_QUEST.precioLight + FICHA_CQ.upgradePremium
      : null,
}

/** Fecha de apertura (V1: «abre el 1 de noviembre de 2026»). La cuenta atrás
 *  del héroe la lee de aquí y se retira SOLA ese día: un «opens in 0 days»
 *  colgado en una página de venta es peor que no decir nada. */
export const APERTURA_MUSEO = '2026-11-01T00:00:00-04:00'

export const RUTA_CORAL_QUEST = '/tours/coral-quest'

/** Sustituye `{precio}` por el «desde» de Coral Quest en la divisa elegida. */
export function conPrecio(texto: string, formatear: (n: number | null) => string) {
  return texto.replace('{precio}', formatear(PRECIO_MUSEO.light))
}

export type ZonaMuseo = {
  /** id de la sección — también el ancla de los chips. */
  id: string
  /** Nombre corto para el chip y el medidor. */
  label: string
}

/** Las paradas del descenso, en orden de lectura. El MEDIDOR las recorre, los
 *  chips las enlazan y el fondo cambia de agua entre una y otra: si se
 *  reordena una sección, se reordena aquí y todo lo demás la sigue.
 *  Son los chips del V1 («Qué es · Lo que te llevas · Galería · Cómo se vive ·
 *  Ciencia · Reservar · Preguntas»). */
export const ZONAS_MUSEO: ZonaMuseo[] = traducible([
  { id: 'what-it-is', label: 'What it is' },
  { id: 'what-you-get', label: 'What you get' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'how-it-feels', label: 'How it feels' },
  { id: 'science', label: 'Science' },
  { id: 'book', label: 'Book' },
  { id: 'faq', label: 'FAQ' },
])

/** ⚠️ PROFUNDIDAD REAL DEL MUSEO: no la da ningún material del cliente. El
 *  medidor pinta metros SOLO si esto tiene un número; en `null` enseña las
 *  zonas sin cifra. Inventarla («−8 m») en una web de buceo es justo el dato
 *  que alguien comprueba. Pedida a Samuel el 2026-10-07. */
export const PROFUNDIDAD_MUSEO_M: number | null = null

export const MUSEO = traducible({
  meta: {
    titulo: 'Underwater Museum',
    descripcion:
      'Sculptures that work as a reef, inside our protected Marine Park in Bávaro. The Underwater Museum opens November 1, 2026, along the Coral Quest route.',
  },

  hero: {
    eyebrow: 'New in the Marine Park',
    titulo: 'A reef that began as a sculpture',
    lead: 'The Underwater Museum opens November 1, 2026, along the Coral Quest route.',
    ctaBajar: 'Dive into the museum',
    cuentaAtras: 'Opens in',
    dias: 'days',
    dia: 'day',
    foto: 'museo-hero',
    fotoAlt: 'A sculpture of a baseball batter standing on the white sand of the Marine Park, with sunbeams cutting through the water',
  },

  queEs: {
    eyebrow: 'The museum',
    titulo: 'Sculptures that work as a reef.',
    parrafos: [
      "They are sculptures submerged inside our Marine Park. They aren't there just for the photo: they're there for coral to colonize them. Over time, coral and other species cover them, as you can see in the images on this page.",
      "But a museum is more than a few sculptures: it's a way of seeing the reef.",
    ],
    intro: "When you visit the Underwater Museum, you're not just making a snorkel stop.",
    checks: [
      'You see sculptures already covered in marine life.',
      'You enter a park with controlled access.',
      "You learn with the Foundation's conservation team.",
      'You swim the route next to the coral restoration gardens.',
      'And you help the reef keep growing.',
    ],
    cierre:
      "Because the best souvenir isn't what you take home: it's knowing you helped protect the Caribbean.",
    foto: 'museo-lanzador',
    fotoAlt: 'A sculpture of a pitcher kneeling on the sand of the Marine Park',
  },

  llevas: {
    eyebrow: 'What you get',
    titulo: 'What you take with you',
    tarjetas: [
      {
        icono: 'acceso',
        titulo: 'Exclusive access to the Marine Park',
        texto: 'Snorkel in a park with controlled access, next to the museum, the coral gardens and the reef.',
      },
      {
        icono: 'incluido',
        titulo: 'Included in your tour',
        // `{precio}` lo rellena el componente con PRECIO_MUSEO.light, como en las
        // cifras: el precio no se escribe a mano en ningún texto.
        texto: 'The museum is part of Coral Quest, at no extra cost. From {precio} per person.',
      },
      {
        icono: 'ciencia',
        titulo: 'Science you can see',
        texto: "Sculptures already covered in marine life, and the Foundation's conservation team on board.",
      },
      {
        icono: 'ayuda',
        titulo: 'A visit that gives back',
        texto: "Part of every guest's contribution goes to protecting the Caribbean: coral, green sea turtles and education.",
      },
    ],
  },

  galeria: {
    numero: '01',
    eyebrow: 'Gallery',
    titulo: 'The sculptures',
    texto: 'Human figures on their bases, on the sandy floor of the Marine Park.',
    // [3ª vuelta] Sin el pie «Real photos of the museum…» del V1: Samuel lo
    // quitó («que las imágenes no digan que son reales»).
    ayuda: 'Drag or scroll to explore',
    // Los nombres los pone el propio cliente en /marine-park («a baseball
    // player, pitcher, Carnival Devil…») y el V2 («Figura de brazos
    // cruzados»). El lugar, el del V2: «Parque Marino, Bávaro».
    fotos: [
      { foto: 'museo-bateador', titulo: 'The batter', lugar: 'Marine Park, Bávaro', alt: 'Sculpture of a baseball batter holding his bat on the sandy floor' },
      { foto: 'museo-diablo', titulo: 'Carnival Devil', lugar: 'Marine Park, Bávaro', alt: 'Sculpture of a Dominican Carnival Devil with long horns standing on the sand' },
      { foto: 'museo-lanzador-lateral', titulo: 'The pitcher', lugar: 'Marine Park, Bávaro', alt: 'Sculpture of a baseball pitcher kneeling, seen from the side' },
      { foto: 'museo-brazos-cruzados', titulo: 'Figure with crossed arms', lugar: 'Marine Park, Bávaro', alt: 'Sculpture of a man in a cap with his arms crossed, under the surface' },
      { foto: 'museo-buzo-diablo', titulo: 'Up close', lugar: 'Marine Park, Bávaro', alt: 'A diver waving next to the Carnival Devil sculpture' },
      { foto: 'museo-figura-superficie', titulo: 'Under the surface', lugar: 'Marine Park, Bávaro', alt: 'A sculpture standing on its base with the water surface shining above' },
      { foto: 'museo-buzo-figura', titulo: 'To scale', lugar: 'Marine Park, Bávaro', alt: 'A diver pointing at a sculpture of a man in a cap' },
    ],
  },

  videos: {
    eyebrow: 'On video',
    titulo: 'See it with your own eyes',
    // Los tres títulos son los del V1. Los clips, los que el cliente apartó en
    // «PARA USAR» (el vivero) + la raya, que es la especie que mejor se ve.
    reels: [
      { video: 'museo-reel-arrecife', titulo: 'Where the reef grows back' },
      { video: 'museo-reel-especies', titulo: 'Species that make the museum home' },
      { video: 'museo-reel-ciencia', titulo: 'The science of restoration' },
    ],
  },

  ciencia: {
    eyebrow: 'Science & conservation',
    bloques: [
      {
        numero: '02',
        titulo: 'The coral that grows',
        texto:
          "An artificial reef isn't decoration. The sculptures give coral a firm surface to settle and grow on, and a place where fish and other species can shelter.",
        foto: 'museo-vivero-domo',
        fotoAlt: 'A coral nursery dome on the sand, its bars covered with growing coral fragments',
      },
      {
        numero: '03',
        titulo: 'The park where it lives',
        texto:
          'The Marine Park lies inside the Bávaro Reef Lagoon Ecological Recovery Area, 18.4 km², established by the Ministry of Environment under Resolution 0008/2024. Our team supports that recovery with nurseries, a lab and education.',
        foto: 'museo-vivero-arrecife',
        fotoAlt: 'A coral nursery structure next to a natural reef in the Marine Park',
        cta: 'Meet the Foundation',
        ctaHref: '/foundation',
      },
    ],
  },

  cifras: [
    { valor: 'Nov 1', unidad: '2026', texto: 'museum opening' },
    { valor: '18.4', unidad: 'km²', texto: 'ecological recovery area' },
    { valor: '4', unidad: 'h', texto: 'Coral Quest tour' },
    { valor: '{precio}', unidad: '', texto: 'from, per person' },
  ],

  reserva: {
    eyebrow: 'Book',
    titulo: 'Visit it with Coral Quest',
    texto:
      'The museum is part of the Coral Quest route, the marine conservation tour for all ages. Four hours, transportation from your hotel and a gourmet lunch on board.',
    porPersona: 'per person',
    // [3ª vuelta] La foto y los cuatro datos de la ficha. Los datos son el
    // propio texto del V1 partido en piezas («Cuatro horas, transporte desde tu
    // hotel y almuerzo gourmet a bordo»; «para todas las edades»): no se añade
    // nada que el cliente no haya dicho.
    tour: 'Coral Quest',
    datos: ['4 hours', 'Hotel pickup', 'Gourmet lunch on board', 'All ages'],
    foto: 'museo-buzo-diablo',
    fotoAlt: 'A diver waving next to the Carnival Devil sculpture of the Underwater Museum',
    opciones: [
      {
        id: 'light',
        nombre: 'Light',
        texto: 'Grilled chicken or fish, with potatoes and vegetables. Snorkeling in the Marine Park, with the museum.',
      },
      {
        id: 'premium',
        nombre: 'Premium',
        texto: 'A menu with lobster, certified Angus and Surf and Turf. Same boat, same route.',
      },
    ],
    garantias: [
      'Free cancellation up to 7 days before',
      'Full refund for bad weather',
      'Confirm with 25%',
    ],
    cta: 'See availability',
    nota: 'The museum opens November 1, 2026.',
  },

  faq: {
    eyebrow: 'Clear answers',
    titulo: 'Frequently asked questions about the museum',
    // Las respuestas son las del V1, que es el que manda. El V2 contestaba
    // distinto a dos de ellas («a partir de 4 años», «de quién es»).
    preguntas: [
      { p: 'When does the Underwater Museum open?', r: 'On November 1, 2026.' },
      {
        p: 'Is it included in the tour?',
        r: 'Yes. The visit and snorkeling at the Underwater Museum are fully part of the regular Coral Quest itinerary, at no extra cost.',
      },
      {
        p: 'From what age can you visit?',
        r: "It's an experience for the whole family. We have life vests and personal assistance for participants of all ages with basic floating skills.",
      },
      {
        p: 'How do I get there?',
        r: 'The tour includes round-trip ground transportation from the main hotels and resorts in Bávaro and Punta Cana straight to our boarding marina.',
      },
      {
        p: 'What should I bring?',
        r: 'Swimsuit, towel, a change of dry clothes and biodegradable, reef-safe sunscreen only. All professional snorkel gear is included on board.',
      },
      {
        p: 'Who owns the museum?',
        r: "The Underwater Museum is a protected heritage and ecological initiative, looked after by the Marine Conservation Foundation and supervised under Resolution 0008/2024 of the Ministry of Environment.",
      },
    ],
  },

  cierre: {
    titulo: 'Your Caribbean story starts here',
    texto: 'Every visit helps the reef keep growing.',
    cta: 'See availability',
    ctaFundacion: 'Meet the Foundation',
    subir: 'Back to the surface',
  },
})
