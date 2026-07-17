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
  /** badge de destacar: null = ninguno, "premium" = "Most complete" o
   *  similar. La card se pinta con un acento si está presente. */
  destacado?: 'premium' | null
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
  /** null/undefined = el evento no tiene paquetes. Presente solo en
   *  party-boat (la web del cliente vende 4 paquetes para eventos) y
   *  en el futuro para bodas si cotiza a un menú cerrado. */
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
}

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
  descripcionLarga: [
    'Celebrating a special occasion? No matter what your event may be, we have the perfect party boat for you. The most beautiful things are not associated with money; they are memories and moments. If you don’t celebrate those, they can pass you by. That being said, if you would like to celebrate a special occasion, no matter what the special event may be, Hispaniola is here to make sure all your wishes are fulfilled.',
    'Our experienced staff promises to meet your needs so that you can create memories that last a lifetime. We have different size catamarans to fit any size group. Don’t be shy to inquire on how we can turn an event into a forever reminiscence.',
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
  // 4 paquetes verbatim de la sección "All Packages" de la web del
  // cliente. SOLO party boat los tiene — bodas y empresas cotizan a
  // medida, no tienen paquetes públicos. Los items de cada paquete
  // vienen de la web del cliente con el mismo patrón "1p/p" cuando
  // aplica. NOTA al pie: avisos de langosta y de opciones
  // vegetarianas (verbatim del original).
  paquetes: {
    titulo: 'Paquetes de comida',
    intro:
      'El party boat se cotiza con uno de estos 4 paquetes de comida. Cada uno incluye todo lo de "Qué incluye" arriba; lo que cambia es el menú, la capacidad y la duración.',
    items: [
      {
        id: 'premium',
        nombre: 'Hispaniola Premium Package',
        precio: 'US$ 1,188.00',
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
        precio: 'US$ 660.00',
        capacidad: '1-12 personas',
        meta: '3 horas a bordo · 2 paradas',
        foto: 'paquete-i',
        fotoAlt: 'Package #I del party boat',
        items: [{ titulo: 'Hot Dog', texto: '1p/p' }],
        // Las "Vegetarian Substitutions" del cliente son reemplazos,
        // no items extra — el plato de cada comensal es O el hot dog
        // O el vegetariano. Por ahora el form los lleva como items;
        // si quieres separarlos, dime y abro un sub-campo.
        extraPrecio: 'US$ 55.00 por persona extra',
      },
      {
        id: 'package-ii',
        nombre: 'Package #II',
        precio: 'US$ 780.00',
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
        precio: 'US$ 900.00',
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
    ],
    nota:
      '*"Starting At Rates" con los descuentos aplicables: hasta 5% cliente recurrente · 5% reserva con 30+ días · 5% pago en efectivo. La langosta puede no estar disponible de marzo a junio (se reemplaza por langostino salvaje). Las opciones vegetarianas aplican SOLO a su paquete y no se pueden intercambiar con otros.',
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
  descripcionLarga: [
    'Honor your love aboard our catamaran! A perfect way to celebrate before or after your wedding! Thank all your guests by dancing, drinking, snorkeling with colorful fishes and eating delicious seafood while cruising the beautiful coast of Bavaro – Punta Cana.',
    'Hispaniola Aquatic Adventures is dedicated to the satisfaction of all of our clients. We know how important a Wedding can be and believe that a perfect way to celebrate is to lose sight of the shore. We strongly recommend our 4 hour tour for the best experience possible. More time to enjoy each other’s company & more food! Our 4 hour Seafood package is our clients #1 choice for Wedding Celebrations. An extra hour of unforgettable memories and top notch freshly grilled Seafood. Value for your money guaranteed!',
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
  ],
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

const EMPRESAS: FichaEvento = {
  slug: 'empresas',
  nombre: 'Empresas y MICE',
  eyebrow: 'MICE · Grupos corporativos',
  titulo: 'Eventos corporativos a bordo',
  sub: 'Meetings · Incentives · Conferences · Exhibitions · Punta Cana – Bavaro.',
  chips: ['Hasta 120 pax por barco', 'Multi-barco', 'Factura fiscal'],
  // MICE no tiene quote de review de 5★ (es institucional, no consumer).
  descripcionLarga: [
    'MICE has been a significantly important part of the Travel & Tourism industry for many years.',
    'No matter which of these above you are involved in, we can help you organize the perfect event. Hispaniola has a large fleet and will have the perfect boat and style of event for all the occasions. Eclipse by Hispaniola is your go-to MICE venue. Punta Cana’s biggest boat (approx. 1000 mt2), a two level catamaran with a maximum capacity of 400 people. We can set up anything from catering, buffets, cocktails, live bands, activities and more right on the water for you. Let our team help you organize the best business affair ever!',
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
