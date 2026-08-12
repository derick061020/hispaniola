// Página GUÍAS (/guias) — fuente única: TIPS_GUIAS, contenido REAL portado de
// tips-for-punta-cana-snorkeling-and-sailing.php?lang=es de la web actual
// (HTML descargado y leído línea a línea 2026-07-17). Son las 4 preguntas
// evergreen sobre esnórquel/arrecife, vela, mar y mariscos — limpiadas de
// relleno y de un typo del original ("aceite de olive") pero sin cambiar
// ningún hecho. Las otras 4 preguntas de esa página son protocolos COVID-19
// (testeo antes de viajar, mascarilla, transporte privado por la pandemia):
// decisión de Samuel 2026-07-17, quedan FUERA por obsoletas en un sitio
// relanzado en 2026.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-22, "Guías de Punta Cana - Ajustes web"
// .pdf en docs/proceso/correcciones-v1-cliente/). El cliente entregó una maqueta: cada
// guía es una FILA con su foto al lado (foto/texto que ALTERNAN de lado), un
// eyebrow de categoría, la pregunta, una frase-resumen en negrita (`lead`),
// el cuerpo, un dato destacado (`stat`) y sus CTAs, cerrando con un bloque
// "Más guías en camino". El copy de esta versión (leads condensados, textos
// de stat y etiquetas de CTA) viene de ESA maqueta aprobada por el cliente —
// no inventado. Los `foto` son fotos reales del proyecto; los CTA apuntan a
// páginas reales (ficha del Snorkel Lovers, flota con el Maite en /nosotros,
// /#tours, cocina flotante en /nosotros). Antes de esto la página era una
// lista editorial de numeral+pregunta+respuesta sin fotos (rediseño
// 2026-07-17), que a su vez había sustituido a 4 cards apiladas.
export type StatGuia = {
  /** cifra o palabra destacada — p. ej. "≈100%", "50%", "Sin mareo" */
  valor: string
  /** glosa breve del dato */
  texto: string
}

export type CtaGuia = { texto: string; to: string }

export type TipGuia = {
  /** eyebrow de categoría de esta guía (Esnórquel, Seguridad…) */
  categoria: string
  pregunta: string
  /** frase-resumen en negrita, el gancho de la maqueta del cliente */
  lead: string
  /** cuerpo — prosa real portada de la web del cliente */
  respuesta: string
  /** id de foto real en /public/fotos (sin extensión) */
  foto: string
  fotoAlt: string
  /** pie editorial que va sobre la foto (nombre del barco / lugar) */
  fotoPie: string
  stat: StatGuia
  /** CTA principal (coral) — a una página real */
  ctaPrimario: CtaGuia
  /** enlace secundario opcional (texto) */
  ctaEnlace?: CtaGuia
}

export const TIPS_GUIAS: TipGuia[] = [
  {
    categoria: 'Snorkeling',
    pregunta: 'Is Punta Cana a good area for snorkeling?',
    lead: 'For pure diving, there are better spots in the Caribbean. But for seeing turtles, few beat it.',
    respuesta:
      'Let’s be honest: much of the Atlantic coast has been damaged over the years, and Catalina or Bayahibe, on the south coast, have better visibility. Even so, on our route there’s an almost 100% chance of seeing turtles from the catamaran, thanks to the artificial reefs we’ve been planting since 2016 with the Fundación de Arrecifes Ecológicos de Bávaro, a project the Ministry of the Environment ranks among the 3 largest coral gardening efforts in the country.',
    foto: 'galeria-snorkel-lovers-4',
    fotoAlt: 'Snorkelers swimming over the reef next to the catamaran in Cabeza de Toro',
    fotoPie: 'Coral Quest · Cabeza de Toro reef',
    stat: { valor: '≈100%', texto: 'of our trips see turtles · Top 3 coral project in the country' },
    // ⚠️ El `to` conserva el slug viejo a propósito: el renombre del 2026-08-12
    // no toca URLs (ver la tabla en data/home.ts).
    ctaPrimario: { texto: 'See Coral Quest', to: '/tours/snorkel-lovers' },
    ctaEnlace: { texto: 'The full foundation story', to: '/foundation' },
  },
  {
    categoria: 'Sailing',
    pregunta: 'Is sailing an option in the Bávaro area?',
    lead: 'It isn’t pure sailing. We run on engine for a good part of the route. And even so, it pays off.',
    respuesta:
      'The route runs inside the reef, in shallow water, and with the wind direction the catamaran uses the engine at least half the time. Not ideal conditions for pure sailing, but the snorkeling, the length of the trip and the food cooked fresh on board more than make up for the motoring stretch.',
    foto: 'flota-maite',
    fotoAlt: 'The sailboat Maite sailing with the sail up at sunset',
    fotoPie: 'Maite · the sailboat in our fleet',
    stat: { valor: '50%', texto: 'of the trip under engine, because of the wind and the shallow water' },
    ctaPrimario: { texto: 'See the Maite, our sailboat', to: '/nosotros' },
  },
  {
    categoria: 'Safety',
    pregunta: 'Are the sea conditions in Punta Cana safe for water tourism?',
    lead: 'Yes, very safe. The route runs inside a lagoon protected by the reef.',
    respuesta:
      'The Atlantic side of Punta Cana has rough water, but our area is close to Cabo Engaño, where the Caribbean Sea begins. The coral barrier protects the sailing, so the ride is calm and you don’t need seasickness pills. A safe plan for the whole family.',
    foto: 'hero-catamaran-2',
    fotoAlt: 'Catamaran sailing in calm water inside the reef lagoon',
    fotoPie: 'Protected water near Cabo Engaño',
    stat: { valor: 'No seasickness', texto: 'water protected by the coral barrier · family plan' },
    ctaPrimario: { texto: 'See our tours', to: '/#tours' },
  },
  {
    categoria: 'Food',
    pregunta: 'Is Punta Cana a good place to try seafood?',
    lead: 'Yes, and one of the few places with freshly caught seafood, not frozen.',
    respuesta:
      'Most hotels and restaurants use frozen, imported seafood. Ours is caught locally and we season it with fresh herbs and olive oil right in front of you, in the floating kitchen, fully permitted and above the hygiene requirements of the Ministry of the Environment.',
    foto: 'plato-coctel-mariscos',
    fotoAlt: 'Seafood cocktail freshly prepared on board in the floating kitchen',
    fotoPie: 'Local seafood, seasoned in front of you',
    stat: { valor: 'Freshly caught', texto: 'local, not frozen or imported · cooked in front of you' },
    ctaPrimario: { texto: 'Meet the floating kitchen', to: '/nosotros' },
  },
]

// Bloque de cierre — "Más guías en camino" (maqueta del cliente, correcciones
// v1). El numeral "05" fantasma insinúa que la serie sigue.
export const GUIAS_CIERRE = {
  titulo: 'More guides on the way',
  texto:
    'We keep answering what really matters before you book: the best time to travel, what to bring, going with kids and more.',
  cta: { texto: 'See availability', to: '/#tours' },
}

export const GUIAS_HERO = {
  eyebrow: 'Guides',
  titulo: 'Punta Cana guides',
  sub: 'What we know after more than a decade sailing this coast, so you can decide with real information, not marketing.',
  galeria: ['galeria-snorkel-lovers-4', 'galeria-semi-privado-2'],
}
