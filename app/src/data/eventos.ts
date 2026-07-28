// Contenido de las 3 LANDINGS de eventos v2 (PLAN-EVENTOS.md) — portado
// VERBATIM de las 3 URLs de la web actual del cliente:
//
//   - /events-party-boat-puntacana.php?lang=en  → party-boat
//   - /weddings.php?lang=en                    → bodas
//   - /mice.php?lang=en                        → empresas
//
// Las landings son CLONES de la ficha de tour (mismo hero, mismo grid de
// fotos, mismas secciones reusables) con un formulario en el widget de la
// derecha (porque los eventos se cotizan, no se reservan). Misma filosofía
// que la ficha: UNA plantilla data-driven para los 3 productos. En Figma
// será UNA página con 3 frames de variante, no 3 diseños.
//
// ⚠️ Copy portado de la web del cliente. NO se inventa nada. Lo que no
// estaba en la web del cliente se OMITE (no se rellena con fotos de otros
// tours, mismo criterio honesto que la galería vacía de Isla Saona).
//
// ⚠️ Fotos: las de las 3 landings se descargan de la web del cliente
// (assets reales, no stock) y se guardan en /public/fotos/ con nombre
// `events-N`, `weddings-N`, `mice-N`. Pendiente confirmar con el cliente
// fotos propias de eventos (PLAN-v3.md §9); mientras tanto, son las
// originales del cliente.

export type FormatoEvento = {
  titulo: string
  texto: string
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  fotoAlt: string
}

export type BeneficioEvento = { titulo: string; texto: string }

export type PaqueteEvento = {
  /** id estable, kebab-case. Se usa en `?dev-paquete=I` para
   *  pre-seleccionar un paquete en el form (Figma frame). */
  id: string
  nombre: string
  /** [v2 2026-07-28] Etiqueta corta para el segmented del widget de reserva
   *  online (evento/calculadora-evento.tsx): ahí cada pestaña mide ~85px y
   *  «Hispaniola Premium Package» no cabe ni a 12px. El nombre completo se
   *  sigue leyendo entero en la card de preview justo debajo y en el bloque
   *  de paquetes de la página, así que la abreviatura nunca aparece sola. */
  nombreCorto: string
  /** ej: "US$ 660.00" — "Starting at" según la web del cliente */
  precio: string
  /** ej: "1-12 Person" o "1-120 personas" */
  capacidad: string
  /** ej: "2 stops" o "4 hours" — metadata corta del paquete */
  meta: string
  /** nombre de archivo en /fotos (sin extensión) — foto del plato
   *  representativo del paquete. `null` = sin foto (mismo trato que
   *  la galería vacía de Isla Saona). */
  foto: string | null
  fotoAlt: string
  /** items del paquete con check. Mismo shape que BeneficioEvento
   *  para reusar el lenguaje visual de IncluyeEvento. */
  items: BeneficioEvento[]
  /** extra de precio, ej: "US$ 99.00 per extra person" — texto libre
   *  bajo los items. null = no aplica. */
  extraPrecio?: string
  /** [v2 2026-07-27] Los mismos precios que `precio`/`extraPrecio`, pero como
   *  NÚMEROS, para poder calcular. Los de texto se quedan porque son el
   *  formato exacto de la web del cliente y se pintan tal cual en la card.
   *  null = paquete sin precio publicado (no reservable online).
   *
   *  ⚠️ MODELO MARGINAL: base fija hasta `incluyeHasta` personas, y a partir
   *  de ahí `porPersonaExtra` por cabeza. Es el ÚNICO producto que funciona
   *  así — los tours usan sustitución de tramo (ver lib/tarifas.ts). */
  precioBase?: number | null
  incluyeHasta?: number
  porPersonaExtra?: number | null
  /** badge de destacar: null = ninguno, "premium" = "Most complete" o
   *  similar. La card se pinta con un acento si está presente. */
  destacado?: 'premium' | null
}

/** [v2 2026-07-27] Total de un paquete de evento — MODELO MARGINAL:
 *  base fija hasta `incluyeHasta` + tanto por cada persona a partir de ahí.
 *
 *  Ej. real (Hispaniola Premium): 12 personas = US$ 1.188; 13 = 1.188 + 99.
 *
 *  ⚠️ NO es el mismo motor que los tours. Charter y Saona usan SUSTITUCIÓN de
 *  tramo (el tramo que contiene al total se aplica entero) — está en
 *  lib/tarifas.ts. Son dos modelos y el sitio necesita los dos; mezclarlos
 *  cobra mal. Ver correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md.
 *
 *  Devuelve null si el paquete no tiene precio publicado. */
export function totalPaqueteEvento(p: PaqueteEvento, personas: number): number | null {
  if (p.precioBase === null || p.precioBase === undefined) return null
  const incluidas = p.incluyeHasta ?? 12
  const extras = Math.max(0, personas - incluidas)
  return p.precioBase + extras * (p.porPersonaExtra ?? 0)
}

export type StatEvento = { valor: string; label: string }

export type PreguntaEvento = { p: string; r: string }

export type FichaEvento = {
  /** slug de la ruta: /eventos/:slug */
  slug: 'party-boat' | 'bodas' | 'empresas'
  /** último tramo de la migaja: Inicio / Eventos / {nombre} */
  nombre: string
  eyebrow: string
  titulo: string
  sub: string
  /** chips de confianza del hero (mismo lenguaje que la ficha de tour) */
  chips: string[]
  /** null = no tiene quote sobre la foto principal del mosaico */
  quotePrincipal?: string
  /** null = no tiene stats (solo empresas tiene) */
  stats?: StatEvento[]
  /** descripcionLarga en párrafos (mismo shape que FichaTour) */
  descripcionLarga: string[]
  /** lista de tipos de evento que aparecen en el select del widget */
  tiposEvento: string[]
  /** index del tipo preseleccionado — solo bodas/empresas tienen uno fijo.
   *  party-boat: -1 (el usuario elige). */
  tipoFijo: number
  /** titulo + cards de "Qué ofrecemos" — ej: Ceremonia/Welcome/Despedida */
  formatosTitulo: string
  formatos: FormatoEvento[]
  /** titulo + cards de "Qué incluye" */
  incluyeTitulo: string
  incluye: BeneficioEvento[]
  /** null/undefined = el evento no tiene paquetes. Presente en party-boat
   *  y en BODAS: las dos landings de la web del cliente venden LOS MISMOS
   *  4 paquetes a LOS MISMOS precios (TARIFARIO-WEB-ORIGINAL.md §3), así
   *  que `items` apunta al mismo array compartido (`PAQUETES_COMIDA`) y
   *  lo único propio de cada landing es el `titulo`/`intro`.
   *  MICE no los tiene: los eventos corporativos se cotizan a medida —
   *  su widget sigue siendo solo el formulario. */
  paquetes?: {
    titulo: string
    /** copy introductorio bajo el titulo */
    intro: string
    items: PaqueteEvento[]
    /** nota al pie del bloque de paquetes (ej: "Lobster puede no estar
     *  disponible de marzo a junio") */
    nota?: string
  }
  /** foto principal del mosaico (la portada) */
  foto: string
  fotoAlt: string
  /** TODAS las fotos de la galería en /fotos (sin extensión). La `foto`
   *  va primera en el mosaico + lightbox. */
  galeria: string[]
  /** [v2 2026-07-28, pedido de Samuel: «en los eventos también debe estar el
   *  video vertical al lado del grid de imágenes»] Ruta del video en /video.
   *  Mismo campo y mismo papel que `videoGaleria` en FichaTour: la columna
   *  9:16 a la izquierda del mosaico (internas/galeria-mosaico.tsx). null =
   *  mosaico solo de fotos.
   *  ⚠️ [placeholder-v2] Los 3 apuntan al video de marca hasta que el cliente
   *  grabe uno por ocasión (una boda no se vende con el mismo clip que un
   *  party boat) — misma deuda que ya arrastran los 4 tours. */
  videoGaleria: string | null
  /** faq del acordeón */
  faq: PreguntaEvento[]
  /** meta que se muestra en la página de gracias ("Pronto nos pondremos
   *  en contacto en menos de 24 h") */
  cierreMeta: string
  /** título H2 de la banda-cta navy del cierre de la landing
   *  (cierre-evento.tsx). Si la banda quiere un claim distinto del H1
   *  de la landing (ej: "Hablemos de vuestra boda" en lugar de
   *  "Vuestra boda, en el mar"), va aquí. */
  cierreTitulo: string
  /** texto del botón principal de la banda-cta del cierre. Suele ser
   *  el mismo que `ctaPrincipal` del widget, pero se separa por si en
   *  el futuro la banda quiere un copy distinto (ej: "Empezar"). */
  cierreCta: string
  /** muestra el botón secundario de WhatsApp en la banda-cta. Solo
   *  bodas lo lleva — el cliente bodas suele preferir escribir por
   *  WhatsApp antes que rellenar un formulario (el party boat y los
   *  eventos corporativos prefieren el formulario). */
  cierreWhatsapp: boolean
  /** CTA principal del widget ("Pedir cotización de boda") */
  ctaPrincipal: string
  /** CTA secundario opcional del widget (ej: "Dossier corporativo PDF") */
  ctaSecundaria?: string
  /** [v2 2026-07-28] Copy de la línea tras la que se PLIEGA el formulario
   *  de cotización — solo se ve en las landings con paquetes (party boat,
   *  bodas), donde el widget lleva arriba la reserva online y el
   *  formulario queda para lo que no cabe en un paquete. Es copy por
   *  ocasión: en party boat el caso a cotizar es «no encaja en un
   *  paquete»; en una boda, la ceremonia y el montaje. Ver
   *  components/evento/widget-evento.tsx. */
  cotizacionPlegada?: { titulo: string; sub: string }
}

// ────────────────────────────────────────────────────────────────────
// LOS 4 PAQUETES DE COMIDA — compartidos por party boat y bodas
// ────────────────────────────────────────────────────────────────────
//
// `events-party-boat-puntacana.php` y `weddings.php` publican EXACTAMENTE
// los mismos 4 paquetes con los mismos precios y los mismos menús
// (verificado en correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md §3, y
// así lo pedía ya el plan 03-eventos.md: «un solo array de paquetes
// consumido por las dos landings»). La ÚNICA diferencia entre las dos
// ocasiones es que bodas suma «Champagne toast» a los incluidos comunes
// — y eso vive en el `incluye` de bodas, no en los paquetes.
//
// Por eso es UN array y no dos copias: un cambio de precio del cliente se
// edita en un sitio. Dos copias se desincronizan el día que suba el
// Premium y alguien actualice solo party boat.
//
// Los items de cada paquete vienen de la web del cliente con el mismo
// patrón "1p/p" cuando aplica.
const PAQUETES_COMIDA: PaqueteEvento[] = [
  {
    id: 'premium',
    nombre: 'Hispaniola Premium Package',
    nombreCorto: 'Premium',
    precio: 'US$ 1,188.00',
    precioBase: 1188,
    incluyeHasta: 12,
    porPersonaExtra: 99,
    capacidad: '1-12 personas',
    meta: '4 horas a bordo',
    foto: 'paquete-premium',
    fotoAlt: 'Hispaniola Premium Package — langosta, brochetas y fries en plato blanco',
    items: [
      { titulo: 'Chicken Skewer', texto: '1p/p' },
      { titulo: 'Beef Skewer', texto: '1p/p' },
      { titulo: 'Shrimp Skewer', texto: '1p/p' },
      { titulo: 'Shrimp Tempura', texto: '1 p/p' },
      { titulo: 'Fish Sticks', texto: '' },
      { titulo: 'French Fries', texto: '' },
      { titulo: 'Lobster', texto: '' },
    ],
    extraPrecio: 'US$ 99.00 por persona extra',
    destacado: 'premium',
  },
  {
    id: 'package-i',
    nombre: 'Package #I',
    nombreCorto: '#I',
    precio: 'US$ 660.00',
    precioBase: 660,
    incluyeHasta: 12,
    porPersonaExtra: 55,
    capacidad: '1-12 personas',
    meta: '3 horas a bordo · 2 paradas',
    foto: 'paquete-i',
    fotoAlt: 'Package #I del party boat',
    items: [{ titulo: 'Hot Dog', texto: '1p/p' }],
    // Las "Vegetarian Substitutions" del cliente son reemplazos, no items
    // extra — el plato de cada comensal es O el hot dog O el vegetariano.
    // Por ahora el form los lleva como items; si quieres separarlos, dime
    // y abro un sub-campo.
    extraPrecio: 'US$ 55.00 por persona extra',
  },
  {
    id: 'package-ii',
    nombre: 'Package #II',
    nombreCorto: '#II',
    precio: 'US$ 780.00',
    precioBase: 780,
    incluyeHasta: 12,
    porPersonaExtra: 65,
    capacidad: '1-12 personas',
    meta: '3 horas a bordo · 2 paradas',
    foto: 'paquete-ii',
    fotoAlt: 'Package #II del party boat',
    items: [
      { titulo: 'Hot Dog', texto: '1p/p' },
      { titulo: 'Chicken Skewer', texto: '1p/p' },
      { titulo: 'Beef Skewer', texto: '1p/p' },
      { titulo: 'French Fries', texto: '' },
    ],
    extraPrecio: 'US$ 65.00 por persona extra',
  },
  {
    id: 'package-iii',
    nombre: 'Package #III',
    nombreCorto: '#III',
    precio: 'US$ 900.00',
    precioBase: 900,
    incluyeHasta: 12,
    porPersonaExtra: 75,
    capacidad: '1-12 personas',
    meta: '3 horas a bordo · 2 paradas',
    foto: 'paquete-iii',
    fotoAlt: 'Package #III del party boat',
    items: [
      { titulo: 'Chicken Skewer', texto: '1p/p' },
      { titulo: 'Beef Skewer', texto: '1p/p' },
      { titulo: 'Shrimp Skewer', texto: '1p/p' },
      { titulo: 'Shrimp Tempura', texto: '1 p/p' },
      { titulo: 'Fish Sticks', texto: '' },
      { titulo: 'French Fries', texto: '' },
    ],
    extraPrecio: 'US$ 75.00 por persona extra',
  },
]

/** Nota al pie del bloque de paquetes — verbatim del original, y también
 *  compartida: los descuentos, el aviso de langosta y la regla de las
 *  sustituciones vegetarianas son del tarifario, no de la ocasión. */
const NOTA_PAQUETES =
  '*"Starting At Rates" con los descuentos aplicables: hasta 5% cliente recurrente · 5% reserva con 30+ días · 5% pago en efectivo. La langosta puede no estar disponible de marzo a junio (se reemplaza por langostino salvaje). Las opciones vegetarianas aplican SOLO a su paquete y no se pueden intercambiar con otros.'

// ────────────────────────────────────────────────────────────────────
// 1) PARTY BOAT — /events-party-boat-puntacana.php
// ────────────────────────────────────────────────────────────────────
//
// Copy portado del bloque "Start Description" + la lista de eventos que
// se cubren. El H1 "Events & Celebrations" de la web se reescribe a "Tu
// evento en el Caribe, a bordo" para hablar el mismo idioma de la home
// (el "events & celebrations" genérico del cliente es de catálogo, no
// conversacional). La lista de tipos del select se saca verbatim de la
// sección "LIST OF ALL EVENTS WE CATER TO:".

const PARTY_BOAT: FichaEvento = {
  slug: 'party-boat',
  nombre: 'Eventos y party boat',
  eyebrow: 'Eventos privados a bordo',
  titulo: 'Tu evento en el Caribe, a bordo',
  sub: 'Catamarán privado en Punta Cana — Bávaro · 10 a 120 personas · comida hecha a bordo y barra libre.',
  // Mismo lenguaje que los chips de ficha: meta del producto (no
  // reassurance, eso lo lleva la home). 3 chips: capacidad, duración
  // típica, "ruta a tu medida" (porque el party boat no tiene ruta fija).
  chips: ['10 a 120 personas', 'Ruta a tu medida', 'WiFi a bordo'],
  // Traducido del original en inglés de la web del cliente (auditoría
  // responsive 2026-07-17: la sección quedaba en inglés sobre una web con
  // default ES). Mismos hechos y promesas, sin añadir ni quitar nada.
  descripcionLarga: [
    '¿Celebras una ocasión especial? Sea cual sea tu evento, tenemos el party boat perfecto para ti. Lo más bonito no tiene que ver con el dinero, sino con los recuerdos y los momentos — si no los celebras, se te pueden pasar de largo. Si quieres celebrar algo especial, sea lo que sea, en Hispaniola nos aseguramos de que se cumplan todos tus deseos.',
    'Nuestro equipo, con años de experiencia, se compromete a cubrir tus necesidades para que crees recuerdos que duren toda la vida. Tenemos catamaranes de distintos tamaños para cualquier grupo. No dudes en preguntarnos cómo convertimos un evento en un recuerdo para siempre.',
  ],
  // 9 tipos verbatim de la web del cliente + "Otro" para los casos que
  // no encajan. El widget pinta este array como <option>s.
  tiposEvento: [
    'Cumpleaños',
    'Bachelor / Bachelorette',
    'Reunión familiar',
    'Aniversario',
    'Renovación de votos / Pre-post boda',
    'Propuesta',
    'Corporativo',
    'Spring break',
    'Graduación',
    'Otro',
  ],
  tipoFijo: -1, // party boat: el visitante elige
  formatosTitulo: 'Cualquier ocasión, a bordo',
  formatos: [
    {
      titulo: 'Cumpleaños',
      texto: 'Fiesta con familia y amigos — buena comida y barra libre nacional.',
      foto: 'events-2',
      fotoAlt: 'Grupo celebrando a bordo del catamarán, cócteles en mano',
    },
    {
      titulo: 'Bachelor / Bachelorette',
      texto: 'Despedida de soltero/a con música, barra libre y vista al Caribe.',
      foto: 'events-3',
      fotoAlt: 'Grupo de despedida celebrando a bordo del catamarán',
    },
    {
      titulo: 'Corporativo',
      texto: 'Team building, incentive, lanzamiento o cierre de convención.',
      foto: 'events-4',
      fotoAlt: 'Grupo corporativo cenando a bordo del catamarán',
    },
  ],
  incluyeTitulo: 'Qué incluye',
  // 12 ítems verbatim de la sección "All Packages Include" de la web
  // del cliente. La versión v1 de la landing tenía solo 6 (los más
  // "turísticos"); esta v2 suma los 6 que el cliente lista
  // explícitamente: transporte, check-in privado, floating kitchen,
  // fotos submarinas, barra nacional, mamajuana shots, etc. — todo
  // lo que ya está en el precio del party boat.
  incluye: [
    { titulo: 'Transporte', texto: 'Ida y vuelta desde tu hotel, en bus con AC.' },
    { titulo: 'Private Check-In Lobby', texto: 'Recepción privada en nuestras instalaciones antes de zarpar.' },
    { titulo: 'Floating Kitchen', texto: 'Cocina flotante para comida recién hecha a bordo.' },
    { titulo: 'Snorkeling Equipment', texto: 'Equipo sanitizado, todas las tallas.' },
    { titulo: 'Photos (Facebook)', texto: 'Subimos las del tour a nuestro Facebook — gratis.' },
    { titulo: 'Underwater Photos (Facebook)', texto: 'También del snorkel, en nuestro Facebook.' },
    { titulo: 'WiFi & AUX port', texto: 'WiFi a bordo y puerto AUX para tu música.' },
    { titulo: 'Music & Dance', texto: 'Equipo de sonido y crew con energía.' },
    { titulo: 'National Open Bar', texto: 'Cerveza nacional, ron, vodka, jugos y refrescos.' },
    { titulo: 'Mamajuana Shots', texto: 'La bebida típica de RD, en shots de cortesía.' },
    { titulo: 'Fruit Skewers', texto: 'Brochetas de fruta fresca (1p/p).' },
    { titulo: 'Mini Turkey & Cheese Croissant', texto: 'Aperitivo de pavo y queso (1p/p).' },
  ],
  // Los 4 paquetes de la sección "All Packages" de la web del cliente —
  // el array compartido con bodas (ver PAQUETES_COMIDA arriba: las dos
  // landings del cliente publican los mismos 4 a los mismos precios).
  // Lo propio de esta landing es el titulo y el intro.
  paquetes: {
    titulo: 'Paquetes de comida',
    // El intro dice para QUÉ son en esta ocasión; lo que tienen en común y
    // en qué se diferencian lo dice la línea de instrucción del propio
    // bloque (paquetes-evento.tsx), que es la misma para las dos landings.
    // Antes se decía dos veces seguidas.
    intro: 'El party boat se reserva con uno de estos 4 paquetes de comida.',
    items: PAQUETES_COMIDA,
    nota: NOTA_PAQUETES,
  },
  // Foto de portada (la 1ª del mosaico). Sin quote sobre la foto: el
  // party boat no tiene un review de 5★ "famoso" que destaque.
  foto: 'events-1',
  fotoAlt: 'Cubierta del catamarán preparada para una celebración con luces y decoración',
  // 8 fotos de la galería original del cliente. La 1ª (`events-1`) es
  // la portada — el mosaico la pone primera.
  galeria: [
    'events-1',
    'events-2',
    'events-3',
    'events-4',
    'events-5',
    'events-6',
    'events-7',
    'events-8',
  ],
  videoGaleria: '/video/hero.mp4',
  // FAQ de la ficha de party boat de la web del cliente. La web NO
  // traía una FAQ propia — se OMITE, no se inventa. El widget pide
  // los detalles por formulario, que es más honesto que inventar
  // respuestas a preguntas que nadie ha hecho.
  faq: [],
  cierreMeta: 'Te respondemos en menos de 24 h con tu cotización',
  cierreTitulo: '¿Listo para tu party boat?',
  cierreCta: 'Pedir cotización',
  cierreWhatsapp: false,
  ctaPrincipal: 'Pedir cotización',
  cotizacionPlegada: {
    titulo: '¿Tu evento no encaja en un paquete?',
    sub: 'Bodas, grupos grandes o menú a medida — te cotizamos gratis en 24 h.',
  },
}

// ────────────────────────────────────────────────────────────────────
// 2) BODAS — /weddings.php
// ────────────────────────────────────────────────────────────────────
//
// Copy portado de los bloques "Start Description" + "WHAT WE OFFER" +
// "What is included" + los 3 reviews de la web. El H1 "Weddings" se
// reescribe a "Vuestra boda, en el mar" — el wireframe aprobado usa
// la promesa en lenguaje directo, no la palabra suelta. Trust heredado
// verbatim: "Couples' Choice WeddingWire 2018-2021" (este dato es
// público, está en su sitio). El slogan ("May your Anchor be tight...")
// se MUESTRA como quotePrincipal sobre la foto principal del mosaico —
// es poesía, no una review con rating, y le da personalidad al hero
// sin meter el bloque de reviews que ya tiene la home.

const BODAS: FichaEvento = {
  slug: 'bodas',
  nombre: 'Bodas',
  eyebrow: 'Bodas, pre-boda y post-boda',
  titulo: 'Vuestra boda, en el mar',
  sub: 'Bodas y pre-post wedding celebrations en catamarán privado · Punta Cana – Bavaro.',
  chips: ['Hasta 120 invitados', 'Hasta 6 horas', 'Coordinadora dedicada'],
  // Slogan de la web del cliente. Va como quote sobre la foto del
  // mosaico — mismo lenguaje de quote destacada que la ficha de tour.
  quotePrincipal:
    '“May your Anchor be tight, your cork be loose, your rum be spiced, and your compass be true.”',
  // Traducido del original en inglés de la web del cliente (auditoría
  // responsive 2026-07-17: la sección quedaba en inglés sobre una web con
  // default ES). Mismos hechos y promesas, sin añadir ni quitar nada.
  descripcionLarga: [
    '¡Honra tu amor a bordo de nuestro catamarán! Una forma perfecta de celebrar antes o después de tu boda: agradece a tus invitados bailando, brindando, haciendo esnórquel entre peces de colores y comiendo un delicioso marisco mientras navegan la hermosa costa de Bávaro – Punta Cana.',
    'En Hispaniola Aquatic Adventures nos dedicamos a la satisfacción de todos nuestros clientes. Sabemos lo importante que es una boda y creemos que la forma perfecta de celebrarla es perder de vista la orilla. Recomendamos nuestro tour de 4 horas para la mejor experiencia posible — más tiempo para disfrutar de la compañía del otro y más comida. Nuestro paquete de mariscos de 4 horas es la opción #1 de nuestros clientes para celebraciones de boda: una hora extra de recuerdos inolvidables y marisco recién hecho a la parrilla. ¡El valor de tu dinero, garantizado!',
  ],
  // En bodas, el tipo es SIEMPRE "Boda" — la landing misma lo
  // predefinine. El widget no pregunta tipo: lo muestra como un chip de
  // info, no como select. Por eso tipoFijo = 0 (apunta a "Boda") y
  // tiposEvento tiene un solo elemento.
  tiposEvento: ['Boda'],
  tipoFijo: 0,
  formatosTitulo: 'Tres momentos, un barco',
  // "What we offer" de la web del cliente, traducido y condensado. La
  // web tenía 4 cards (Ceremony, Welcome Party, Rehearsal Dinner, After
  // Wedding Day) — se unifican en 3: Ceremonia, Welcome, Despedida. La
  // 4ª ("Rehearsal dinner") cae dentro de "Welcome party" (la cena de
  // ensayo es la Welcome del grupo).
  formatos: [
    {
      titulo: 'Ceremonia a bordo',
      texto: 'Íntima, hasta 40 invitados. Decoración, oficiante y brindis.',
      // Sin foto de ceremonia: va el barco fondeado frente a la playa
      // de palmeras (escenario de la ceremonia, sin fingir una que no
      // hay). Mismo criterio que el resto del proyecto (data/eventos.ts
      // versión anterior).
      foto: 'weddings-4',
      fotoAlt: 'El catamarán fondeado frente a una playa de palmeras',
    },
    {
      titulo: 'Welcome party',
      texto: 'Rompe el hielo entre las dos familias el día antes.',
      foto: 'weddings-1',
      fotoAlt: 'La tripulación sirviendo bandejas a los invitados a bordo',
    },
    {
      titulo: 'Despedida del grupo',
      texto: 'El último día, todos juntos, sin protocolo.',
      foto: 'weddings-2',
      fotoAlt: 'Grupo de amigos brindando en la playa, el catamarán detrás',
    },
  ],
  incluyeTitulo: 'Qué incluye',
  // 7 ítems — el "What is included" de la web del cliente. Se traducen
  // y se adaptan al lenguaje de la ficha de tour (texto corto, sin
  // sub-línea en los secundarios).
  incluye: [
    { titulo: 'Snorkel', texto: 'Equipo incluido y aguas poco profundas — apto para todos los niveles.' },
    { titulo: 'Música', texto: 'Equipo de sonido a bordo y playlist a medida.' },
    { titulo: 'Barra flotante', texto: 'Cócteles del chef y barra libre nacional.' },
    { titulo: 'Playa desierta', texto: 'Parada privada con coco-loco.' },
    { titulo: 'Fotos', texto: 'De todo el evento, subidas a nuestro Facebook — gratis.' },
    { titulo: 'Comida', texto: 'Recién hecha en nuestra cocina flotante — menú a medida.' },
    { titulo: 'Coordinadora', texto: 'Una persona vuestra de principio a fin.' },
    // 8º ítem, y es EL dato que separa bodas de party boat: las dos
    // ocasiones comparten los 4 paquetes y los mismos incluidos comunes,
    // y bodas suma el brindis (TARIFARIO-WEB-ORIGINAL.md §3: «+ Champagne
    // toast solo en bodas»). Va aquí y no dentro de un paquete porque en
    // la web del cliente entra en TODOS.
    { titulo: 'Champagne toast', texto: 'Brindis con todos los invitados — solo en bodas.' },
  ],
  // MISMOS 4 PAQUETES QUE PARTY BOAT, mismo array (PAQUETES_COMIDA):
  // `weddings.php` publica el tarifario idéntico —mismos precios, mismos
  // menús, misma base 1-12 + persona extra— y así lo pedía el plan
  // 03-eventos.md. Con esto la landing de bodas gana lo mismo que ganó
  // party boat: el bloque de paquetes en la columna izquierda y la
  // reserva online (calculadora) encima del formulario, sin tocar
  // pages/evento.tsx — las dos piezas se pintan solas cuando el evento
  // tiene `paquetes`.
  paquetes: {
    titulo: 'Paquetes de comida',
    intro:
      'La comida de la boda sale de estos 4 paquetes — el mismo tarifario que el resto de eventos a bordo, con el brindis de champagne incluido.',
    items: PAQUETES_COMIDA,
    nota: NOTA_PAQUETES,
  },
  // La única foto de boda real del repo: la novia a bordo con su
  // grupo. ES LA PORTADA — la 1ª del mosaico. Las 12 siguientes son la
  // galería del cliente.
  foto: 'weddings-5',
  fotoAlt: 'Novia celebrando a bordo del catamarán con su grupo de invitados',
  galeria: [
    'weddings-5',
    'weddings-1',
    'weddings-2',
    'weddings-3',
    'weddings-4',
    'weddings-6',
    'weddings-7',
    'weddings-8',
    'weddings-9',
    'weddings-10',
    'weddings-11',
    'weddings-12',
    'weddings-13',
  ],
  videoGaleria: '/video/hero.mp4',
  // FAQ de bodas — las 3 preguntas de la web del cliente + 1
  // pregunta sobre el Dress code (la más común, sale de la práctica
  // de coordinar con novios).
  faq: [
    {
      p: '¿Y si llueve el día de la boda?',
      r: 'Reembolso total o cambio de fecha, sin costo.',
    },
    {
      p: '¿Cuántos invitados pueden venir a bordo?',
      r: 'Hasta 120 personas — con dos niveles de cubierta para la ceremonia y el banquete.',
    },
    {
      p: '¿Pueden traer su propio wedding planner?',
      r: 'Sí — trabajamos con los wedding planners de la zona y nos coordinamos con el vuestro sin problema.',
    },
    {
      p: '¿Hay dress code?',
      r: 'Recomendamos ropa cómoda y zapatos que se puedan mojar (se baja a la playa desierta en una parada).',
    },
  ],
  cierreMeta: 'Te respondemos en menos de 24 h con tu cotización',
  cierreTitulo: 'Hablemos de vuestra boda',
  cierreCta: 'Pedir cotización de boda',
  cierreWhatsapp: true,
  ctaPrincipal: 'Pedir cotización de boda',
  // En party boat lo que se cotiza es «lo que no cabe en un paquete»; en
  // una boda, lo que hay ALREDEDOR de la comida (ceremonia, montaje,
  // coordinación), que es justo lo que ningún paquete cierra.
  cotizacionPlegada: {
    titulo: '¿Vuestra boda necesita más que un paquete?',
    sub: 'Ceremonia a bordo, decoración o menú a medida — os cotizamos gratis en 24 h.',
  },
}

// ────────────────────────────────────────────────────────────────────
// 3) MICE — /mice.php
// ────────────────────────────────────────────────────────────────────
//
// Copy portado de los bloques "Start Description" + la banda de stats
// del prototipo. La web del cliente usaba el título en 4 colores (M /
// I / C / E); aquí se sustituye por "Eventos corporativos a bordo" — el
// acrónimo "MICE" ya se ve en la migaja y en el eyebrow, no hace
// falta repetirlo en el H1. Las 4 stats (pax por barco / multi-barco
// / factura / seguro) se portan VERBATIM del data/eventos.ts versión
// anterior (ya homologadas con el cliente, según el comentario previo).
//
// La web tenía 2 links externos (snorkel & party business activity /
// corporate programs & activities) — se OMITE: el primero apunta a
// /events-party-boat-puntacana.php (la landing misma) y el segundo a
// karayapuntacana.com (un sitio externo, no verificado). El usuario
// corporativo que quiera el snorkel activity ya está en la landing de
// party boat; el segundo link se omite por no tener URL aprobada.
//
// ⚠️ SIN `paquetes` A PROPÓSITO (Samuel, 2026-07-28: «en MICE sí deja el
// formulario como está»). Party boat y bodas ganan reserva online porque
// tienen tarifario público de precio cerrado; un incentivo de 300 pax en
// convoy multi-barco no lo tiene y no lo puede tener. Sin `paquetes`, la
// página no pinta el bloque de paquetes ni la calculadora, y el formulario
// se queda desplegado —es el widget entero— exactamente como hasta ahora.

const EMPRESAS: FichaEvento = {
  slug: 'empresas',
  nombre: 'Empresas y MICE',
  eyebrow: 'MICE · Grupos corporativos',
  titulo: 'Eventos corporativos a bordo',
  sub: 'Meetings · Incentives · Conferences · Exhibitions · Punta Cana – Bavaro.',
  chips: ['Hasta 120 pax por barco', 'Multi-barco', 'Factura fiscal'],
  // MICE no tiene quote de review de 5★ (es institucional, no consumer).
  // Traducido del original en inglés de la web del cliente (auditoría
  // responsive 2026-07-17: la sección quedaba en inglés sobre una web con
  // default ES). Mismos hechos y promesas, sin añadir ni quitar nada.
  descripcionLarga: [
    'El segmento MICE lleva años siendo una parte muy importante de la industria de viajes y turismo.',
    'Sea cual sea el tipo de evento que tengas en mente, te ayudamos a organizarlo perfecto. Hispaniola cuenta con una flota amplia y tendrá el barco y el estilo de evento ideal para cada ocasión. Eclipse by Hispaniola es tu sede MICE de referencia: el barco más grande de Punta Cana (~1.000 m²), un catamarán de dos niveles con capacidad máxima para 400 personas. Montamos desde catering, buffets y cócteles hasta bandas en vivo, actividades y mucho más, directamente sobre el agua. Deja que nuestro equipo te ayude a organizar el mejor evento corporativo.',
  ],
  tiposEvento: [
    'Incentivo',
    'Team building',
    'Cierre de convención',
    'Convención anual',
    'Lanzamiento',
    'Otro',
  ],
  tipoFijo: -1, // empresas: el visitante elige
  formatosTitulo: 'Formatos',
  formatos: [
    {
      titulo: 'Incentivo',
      texto: 'El premio del año para el equipo comercial.',
      foto: 'mice-1',
      fotoAlt: 'Grupo celebrando el cierre de un incentivo a bordo',
    },
    {
      titulo: 'Team building',
      texto: 'Regata, retos de snorkel, dinámicas a bordo.',
      foto: 'mice-2',
      fotoAlt: 'Grupo haciendo team building en cubierta',
    },
    {
      titulo: 'Cierre de convención',
      texto: 'Cóctel de despedida navegando al atardecer.',
      foto: 'mice-3',
      fotoAlt: 'Cóctel corporativo a bordo al atardecer',
    },
  ],
  incluyeTitulo: 'Lo que un organizador necesita saber',
  // 4 ítems — el "lo que un organizador corporativo necesita saber" de
  // la versión anterior de data/eventos.ts (ya estaba aprobada y
  // homologada con el cliente).
  incluye: [
    { titulo: 'Capacidad y flota', texto: 'Nº de barcos, aforo real por embarcación, multi-barco para grupos grandes.' },
    { titulo: 'Plan B por clima', texto: 'Política de reprogramación por escrito.' },
    { titulo: 'Logística', texto: 'Traslados desde los hoteles sede, horarios cerrados.' },
    { titulo: 'Facturación', texto: 'Condiciones de pago corporativas y factura formal.' },
  ],
  // Foto de portada: la cubierta llena de grupos sentados comiendo.
  foto: 'mice-3',
  fotoAlt: 'La cubierta del catamarán con varios grupos comiendo en sus mesas',
  // 4 fotos de la galería original del cliente.
  galeria: ['mice-3', 'mice-1', 'mice-2', 'mice-4'],
  videoGaleria: '/video/hero.mp4',
  // FAQ corporativa — 4 preguntas operativas, las que un DMC
  // (destination management company) o un head de eventos hace
  // primero. Copiadas del data/eventos.ts versión anterior.
  faq: [
    {
      p: '¿Cuál es la capacidad máxima por barco?',
      r: '120 personas por barco. Para grupos mayores operamos multi-barco en convoy.',
    },
    {
      p: '¿Trabajan con nuestro DMC o agencia?',
      r: 'Sí — tenemos tarifa neta para DMC y facturamos en RD o internacionalmente.',
    },
    {
      p: '¿Cuál es la política de cancelación?',
      r: 'Cancelación gratis hasta 7 días antes. Plan B por mal clima por escrito.',
    },
    {
      p: '¿Pueden manejar varios idiomas en cubierta?',
      r: 'Sí — tripulación bilingüe (ES/EN), y coordinamos con guías en otros idiomas bajo pedido.',
    },
  ],
  cierreMeta: 'Te contactamos en menos de 24 h con tu propuesta',
  cierreTitulo: 'Planifica tu evento corporativo',
  cierreCta: 'Solicitar propuesta',
  cierreWhatsapp: false,
  ctaPrincipal: 'Solicitar propuesta',
  // La web del cliente tenía "Dossier corporativo (PDF)" como CTA
  // secundario — el PDF no existe como asset. Se pinta igual (es
  // promesa de contacto, no de descarga) y la página de gracias
  // cierra el ciclo ofreciendo el dossier por WhatsApp si el cliente
  // lo pide.
  ctaSecundaria: 'Pedir dossier corporativo (PDF)',
}

export const EVENTOS: Record<FichaEvento['slug'], FichaEvento> = {
  'party-boat': PARTY_BOAT,
  bodas: BODAS,
  empresas: EMPRESAS,
}

/** Lista ordenada de las 3 landings — para el selector de "Otras
 *  ocasiones" de cada evento y para el megamenú de Eventos. */
export const EVENTOS_ORDEN: FichaEvento[] = [PARTY_BOAT, BODAS, EMPRESAS]

/** WhatsApp del negocio. Mismo número que ficha de tour. */
export const WHATSAPP_URL = 'https://wa.me/18293052804'
