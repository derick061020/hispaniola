// Página NOSOTROS (/nosotros) — mapea about-hispaniola.php de la web actual
// (Crew + Fleet; Foundation ya vive aparte, en /sostenibilidad desde que es
// tab propio — 2026-07-17).
//
// REDISEÑO 2026-07-17 (pedido de Samuel: "hay que darle mucho amor y cariño
// a las páginas internas... la nuestra hay puras cajas, está horrible
// planteada"): la página pasa de 3 bloques planos (chips sin texto + 3 cards
// de foto+nombre + caja de cierre) a portar el contenido REAL de
// about-hispaniola.php?lang=es — bienvenida, diferenciador de grupos
// pequeños, el itinerario contado como historia (3 paradas), la cocina
// flotante como diferenciador único, y AHORA (2ª vuelta, mismo día — Samuel:
// "empieza con el plan pero mete toda la flota de barcos, todo el contenido
// que haya en la original lo metemos en la nueva") los 6 CATAMARANES CON
// NOMBRE PROPIO de la flota real, no la versión simplificada
// (Catamarán A/B) que tenía prototipo/datos.js. Fotos de los 6 barcos + de
// la cocina/bar flotante DESCARGADAS de hispaniolaaquaticadventures.com
// (mismo criterio que eco-friendly-logo.png: activos reales del cliente, no
// genéricos) — mapeo verificado a ojo contra las etiquetas de la página real
// (galería "Nuestra Tripulación y Flota"):
//   flota-santa-maria.webp   ← images/boats/59.jpg
//   flota-forever-teresa.webp ← images/boats/71.jpg
//   flota-maite.webp         ← images/boats/maite.jpg
//   flota-grandma.webp       ← images/boats/222.jpg
//   flota-joker.webp         ← images/boats/joker.jpg
//   flota-karaya.webp        ← images/boats/karaya.jpg
//   cocina-flotante.webp     ← images/food/kitchen.jpg
//   cocina-flotante-plataforma.webp ← images/food/floating_kitchen.jpg
//   bar-flotante.webp        ← images/food/floating_bar.jpg
//
// La donación/fundación/arrecife NO se duplica aquí — sigue viviendo SOLO en
// /sostenibilidad; esta página solo menciona + enlaza (ArrecifeTeaser, sin
// cambios), mismo límite que ya existía.

export type MiembroTripulacion = { rol: string }

// TRIPULACION del prototipo — 4 roles, sin nombres propios (el cliente no ha
// dado esos datos; inventar un "Capitán José" sería fabricar contenido).
export const TRIPULACION: MiembroTripulacion[] = [
  { rol: 'Capitán' },
  { rol: 'Bióloga marina' },
  { rol: 'Chef a bordo' },
  { rol: 'Guía de snorkel' },
]

export type BarcoFlota = { nombre: string; meta: string; foto: string; fotoAlt: string }

// FLOTA — los 6 catamaranes reales con nombre propio de about-hispaniola.php
// (no la versión simplificada "Catamarán A/B" de prototipo/datos.js — 2ª
// vuelta de este mismo rediseño, pedido explícito de Samuel de portar TODO
// el contenido de la web original). Specs y años, verbatim de la fuente.
export const FLOTA: BarcoFlota[] = [
  {
    nombre: 'Santa María',
    meta: 'Catamarán de 41 pies propulsado a motor, diseñado y construido en 2013 especialmente para nuestra flota.',
    foto: 'flota-santa-maria',
    fotoAlt: 'Catamarán Santa María navegando con pasajeros a bordo',
  },
  {
    nombre: 'Forever Teresa',
    meta: 'Catamarán de 60 pies, lanzado en 2015 bajo las mismas rigurosas especificaciones de nuestra compañía.',
    foto: 'flota-forever-teresa',
    fotoAlt: 'Catamarán Forever Teresa visto desde el aire',
  },
  {
    nombre: 'Maite',
    meta: 'Catamarán de vela de 39 pies, incorporado en 2016 — el crucero a vela más moderno de Punta Cana / Bávaro.',
    foto: 'flota-maite',
    fotoAlt: 'Catamarán de vela Maite navegando con la vela desplegada',
  },
  {
    nombre: 'GrandMa',
    meta: 'Catamarán de 40 pies con tobogán — perfecto para grupos medianos, eventos privados y actividades.',
    foto: 'flota-grandma',
    fotoAlt: 'Catamarán GrandMa con pasajeros a bordo',
  },
  {
    nombre: 'Joker',
    meta: 'Lancha de dos pisos con tobogán, bar y techo corredizo — pensada para grupos privados.',
    foto: 'flota-joker',
    fotoAlt: 'Catamarán Joker con pasajeros en la cubierta superior',
  },
  {
    nombre: 'Karaya',
    meta: 'El catamarán más grande del Caribe para eventos: hasta 350 personas en 938 m² repartidos en 2 niveles.',
    foto: 'flota-karaya',
    fotoAlt: 'Karaya, el catamarán de eventos más grande del Caribe, con dos niveles',
  },
]

export const NOSOTROS = {
  eyebrow: 'Nosotros',
  titulo: 'La tripulación y la flota detrás de cada tour',
  sub: 'Dos catamaranes, una cocina flotante y un equipo que lleva desde 2012 navegando la costa de Punta Cana.',
  // PLAN-INTERNAS-V2.md: fotos del hero-interna en fundido.
  galeria: ['galeria-charter-privado-1', 'hero-catamaran-1', 'galeria-semi-privado-3'],

  tripulacionTitulo: 'La tripulación',
  // Condensado de "Nuestro maravilloso equipo está altamente capacitado,
  // experimentado y garantizará la seguridad de todos los participantes...
  // Nuestro equipo multilingüe estará allí con usted en cada paso del
  // camino, asegurando su comodidad y bienestar."
  tripulacionTexto:
    'Nuestro equipo es multilingüe, está altamente capacitado y vela por tu seguridad en cada paso — desde que subes a bordo hasta que vuelves a la orilla.',

  flotaTitulo: 'La flota',
  // Condensado de "Nuestra flota consta de... catamaranes modernos... Están
  // bien mantenidos y siempre limpios."
  flotaTexto:
    'Catamaranes bien mantenidos y siempre impecables — cuidamos cada detalle para que tu tour se sienta especial, no en serie.',

  arrecifeTitulo: 'El arrecife que reconstruimos',
  arrecifeTexto:
    'Cada tour navega al vivero de coral de Cabeza de Toro, un proyecto de restauración top-3 del país que apoyamos a través de la Bávaro Reefs Foundation.',
  arrecifeCta: 'Ver toda la historia en Sostenibilidad',
  // Foto de fondo del banner de cierre. 6ª vuelta (2026-07-17, pedido de
  // Samuel: "usa otra imagen, usa una imagen de stock del océano Caribeño
  // vista cenital") — sustituimos la foto del vivero de coral real por una
  // cenital genérica de agua turquesa caribeña (stock, sin marca de agua).
  // El texto del banner YA cuenta el arrecife; el fondo solo ambienta mar.
  arrecifeFoto: 'arrecife-fondo-cenital',
  arrecifeFotoAlt: 'Vista cenital del océano Caribe con agua turquesa cristalina',
}

// ---------- Intro «Quiénes somos» (NUEVO, portado de about-hispaniola.php) ----------
// Condensa la bienvenida ("Bienvenido a nuestra familia de Hispaniola...") y
// el diferenciador de grupos pequeños ("nuestros catamaranes tienen
// capacidad para más de 100 pasajeros, pero preferimos garantizar espacio
// suficiente para que todos nuestros huéspedes se sientan importantes").
export const INTRO_NOSOTROS = {
  eyebrow: 'Quiénes somos',
  titulo: 'Bienvenido a la familia Hispaniola',
  parrafos: [
    'Te damos la bienvenida a ti y a los tuyos para disfrutar el calor caribeño y la brisa del mar a bordo de uno de nuestros catamaranes.',
    'Nuestros barcos tienen capacidad para más de 100 pasajeros — pero preferimos reservar solo una parte. Que cada huésped tenga espacio de verdad, no que quepan todos los que caben.',
  ],
  foto: 'galeria-charter-privado-4',
  fotoAlt: 'Catamarán fondeado frente a una playa de palmeras',
}

// ---------- La experiencia a bordo (NUEVO) — 3 paradas del tour ----------
// Portado de la narrativa del itinerario en about-hispaniola.php: vivero de
// coral → playa desierta con coco-loco → piscina natural + bar flotante.
export type ParadaExperiencia = {
  numero: string
  titulo: string
  texto: string
  foto: string
  fotoAlt: string
}

export const EXPERIENCIA_ABORDO: ParadaExperiencia[] = [
  {
    numero: '01',
    titulo: 'Snorkel en el vivero de coral',
    texto:
      'Nuestra primera parada es un vivero coralino donde la Bávaro Reefs Foundation restaura el hábitat marino — nadarás rodeado de peces de colores en aguas transparentes.',
    foto: 'galeria-semi-privado-4',
    fotoAlt: 'Snorkel entre peces tropicales en el vivero de coral',
  },
  {
    numero: '02',
    titulo: 'Playa desierta y coco-loco',
    texto: 'Desembarcamos en una playa desierta para cocos fríos recién abiertos y cóctel de coco — pide todos los que quieras.',
    foto: 'galeria-charter-privado-6',
    fotoAlt: 'Familia disfrutando cocos frescos en una playa desierta',
  },
  {
    numero: '03',
    titulo: 'Piscina natural',
    texto: 'El último destino: una piscina natural en medio del mar, con las mejores bebidas de nuestro bar flotante.',
    foto: 'bar-flotante',
    fotoAlt: 'Grupo disfrutando de bebidas en el bar flotante, en la piscina natural',
  },
]

// ---------- Cocina flotante (NUEVO) — el diferenciador único ----------
// "Hispaniola es la única empresa de excursiones en toda la República
// Dominicana que tiene una cocina flotante... mariscos (o comida marina) que
// harán que se te haga agua la boca."
export const COCINA_FLOTANTE = {
  titulo: 'La única cocina flotante de Punta Cana',
  texto:
    'Hispaniola es la única empresa de excursiones de la República Dominicana con una cocina flotante de verdad: mariscos y carnes a la parrilla, frente a tus ojos, mientras navegas.',
  foto: 'cocina-flotante',
  fotoAlt: 'La tripulación preparando mariscos a la parrilla en la cocina flotante',
}
