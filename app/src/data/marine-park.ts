// MARINE PARK — la página NUEVA de las correcciones v3 (plan 05 §6,
// WEBSITE - NOSOTROS págs. 16–17).
//
// El cliente entrega una página entera escrita: héroe, cuatro bloques
// numerados y la pulsera de la fundación. No existía en el sitio — su
// contenido vivía repartido entre /instalaciones (la zona «Museo exterior
// marino», que en esta misma tanda SALE de ahí) y el discurso de coral de
// /fundacion y /ventaja-competitiva.
//
// ⚠️ POR QUÉ NO ES UNA DUPLICACIÓN. Las tres páginas hablan de coral y
// tortugas, y la división que el propio copy aprobado respeta es:
//   · Marine Park          → EL LUGAR. Lo que visitas y ves bajo el agua.
//   · /fundacion           → LA ORGANIZACIÓN. Quién lo hace y con qué dinero.
//   · /ventaja-competitiva → EL ARGUMENTO. Por qué eso te conviene a ti.
// Se enlazan entre ellas en vez de repetirse. Esta página además ALIVIA el
// solapamiento que la v2 dejó abierto: en cuanto exista, /ventaja-competitiva
// puede dejar de contar el detalle del museo.
//
// ⚠️ FOTOS: todas son REALES y ya estaban en el repo — las del vivero de coral
// y del museo que usaba la zona de /instalaciones, más las submarinas de la
// galería de Snorkel Lovers. No hay ninguna inventada ni de stock. Lo que
// falta son fotos específicas de las esculturas (el pelotero, el Diablo
// Cojuelo, la mesa de dominó): esas están pedidas, y hasta que lleguen el
// bloque del museo se ilustra con el arrecife y el vivero, que es lo que
// rodea al museo.

export type BloqueMarinePark = {
  /** Numeral editorial («01», «02»…). El héroe y la pulsera no lo llevan. */
  numero?: string
  titulo: string
  /** El claim corto que el cliente pone bajo cada número. */
  claim: string
  parrafos: string[]
  /** Los ✔ del documento. Ausente donde el cliente no los puso. */
  checks?: string[]
  foto: string
  fotoAlt: string
}

export const MARINE_PARK = {
  eyebrow: 'Marine Park',
  titulo: 'Where Every Adventure Gives Back',
  // El cliente remata el titular con ⭐⭐⭐. Es una marca de ÉNFASIS suya en el
  // documento (usa la misma en /instalaciones), no parte del copy: se respeta
  // el texto y el énfasis lo pone la tipografía, no tres emojis en un H1.
  lead: "The Caribbean isn't just where we work—it's our home. Every coral we restore, every turtle we protect, and every reef we help recover is part of our commitment to preserving Punta Cana for future generations. When you visit our Marine Park, you become part of that mission.",
  heroFoto: 'arrecife-fondo-cenital',
  heroFotoAlt: 'El arrecife visto desde el aire, con el agua turquesa sobre las estructuras de coral',

  bloques: [
    {
      numero: '01',
      titulo: 'Underwater Museum',
      claim: 'More Than Art. A Living Reef.',
      parrafos: [
        "Discover one of Punta Cana's most unique underwater attractions. Dominican-inspired sculptures—including a baseball player, pitcher, Carnival Devil, musicians, and a traditional domino table—blend culture with marine conservation beneath the sea.",
        'Surrounding the museum are more than 70 artificial reef structures designed to restore coral ecosystems, provide shelter for marine life, and create new habitats where fish can thrive.',
      ],
      checks: [
        'Dominican cultural sculptures',
        'More than 70 reef restoration structures',
        'Coral gardening & marine habitat creation',
      ],
      foto: 'galeria-snorkel-lovers-6',
      fotoAlt: 'Estructuras del vivero de coral bajo el agua, con una buceadora revisándolas',
    },
    {
      titulo: 'Foundation Bracelet',
      claim: 'Your Ticket Protects the Ocean',
      parrafos: [
        'Access to the Underwater Museum is included through a Foundation conservation bracelet. Every bracelet directly supports the operation of The Bávaro Reef Foundation and contributes to the protection, restoration, and monitoring of Punta Cana’s marine ecosystems.',
        "Your visit doesn't just create memories—it helps create a healthier ocean.",
      ],
      foto: 'galeria-snorkel-lovers-10',
      fotoAlt: 'Un guía de Hispaniola explicando el vivero de coral a un grupo de niños',
    },
    {
      numero: '02',
      titulo: 'Coral Restoration',
      claim: "Growing Tomorrow's Reefs Today",
      parrafos: [
        'Our marine biologists cultivate corals year-round using scientifically managed nurseries before transplanting them onto restoration sites throughout the Marine Park. Every new colony strengthens the reef and creates new habitat for marine life.',
      ],
      checks: ['Coral nurseries', 'Reef restoration projects', 'Long-term scientific monitoring'],
      foto: 'galeria-snorkel-lovers-9',
      fotoAlt: 'El equipo manipulando fragmentos de coral sobre la mesa de trabajo',
    },
    {
      numero: '03',
      titulo: 'Green Sea Turtle Conservation',
      claim: "Protecting One of the Dominican Republic's Greatest Success Stories",
      parrafos: [
        "Years of conservation work have helped establish one of the country's most important Green Sea Turtle populations. Through habitat protection, education, and continuous monitoring, we're helping ensure future generations can experience these incredible animals in the wild.",
      ],
      foto: 'galeria-snorkel-lovers-4',
      fotoAlt: 'Peces de colores sobre el arrecife en la parada de snorkel',
    },
    {
      numero: '04',
      titulo: 'Artificial Reefs',
      claim: 'Building New Homes Beneath the Sea',
      parrafos: [
        'Our artificial reefs create shelter for juvenile fish, increase biodiversity, and strengthen marine ecosystems. Today, these restoration sites have become some of the richest underwater habitats in the entire reef system, attracting an extraordinary variety of marine life.',
      ],
      checks: ['Fish nursery habitats', 'Increased biodiversity', 'Healthier coral ecosystems'],
      foto: 'galeria-snorkel-lovers-2',
      fotoAlt: 'Buceadora sobre el arrecife durante la parada de snorkel',
    },
  ] satisfies BloqueMarinePark[],
}
