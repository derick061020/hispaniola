// Contenido de la FICHA de tour — portado de prototipo/datos.js (fuente
// canónica) y de prototipo/app.js (renderFicha, la implementación canónica:
// donde el wireframe y el prototipo difieren, manda el prototipo — ver
// app/PLAN-TOURS.md §0).
//
// Este archivo contiene SOLO lo que `data/home.ts` no tiene ya. Nada se
// duplica: la página une `TOURS` (nombre, precio, rating, chip, foto de
// portada) con `FICHAS` por slug. Si un campo vive en home.ts, se lee de allí.

export type PasoItinerario = { hora: string; titulo: string; texto: string }

/** Horario publicado del tour. SIN `quedan N` a propósito: el aforo restante
 *  depende de que el motor (xpotours) lo exponga por API — decisión pendiente
 *  del cliente. Prometer "quedan 9" sin dato real es urgencia inventada
 *  (analisis/revision-wireframes.md §2.7). El dato vive en el paso 1 del
 *  funnel, que no es parte de este build. */
export type Horario = { hora: string; regreso: string }

export type BeneficioIncluido = { titulo: string; texto: string }
export type PreguntaTour = { p: string; r: string }

/** Un plato del menú de un paquete. `foto` solo la tienen los 4 platos
 *  fotografiados en /fotos (plato-*); el resto son de texto (no hay asset). */
export type PlatoMenu = { nombre: string; desc?: string; foto?: string }

/** Un tramo de la tabla de precios de una sub-variante (Saona). Coincide 1:1
 *  con las filas del esquema viejo (Saona web: «6 pax — US$ 1.100 /grupo»,
 *  «7 pax — US$ 1.160 /grupo», «10+ pax — US$ 130 /persona»).
 *  - `desde` y `hasta` son inclusivos. `hasta: null` = sin tope superior.
 *  - `tipo: 'grupo'` → `precio` es el TOTAL del grupo (sin multiplicar).
 *  - `tipo: 'persona'` → `precio` es por persona; se multiplica por `personas`.
 *  - `extra` es texto complementario (ej: «+ 45 US$ por persona para comida»). */
export type TramoPrecio = {
  desde: number
  hasta: number | null
  precio: number
  tipo: 'grupo' | 'persona'
  extra?: string
}

/** Una sub-variante seleccionable en el widget (Saona: Speedboat, Fishing
 *  Town, Catamarán). El widget pinta un segmented control con estas y
 *  recalcula el total al cambiar — un Light/Premium pero a nivel de BOTE en
 *  vez de a nivel de menú. `capacidad` es la línea de meta del toggle
 *  (ej: «6-9 personas (+US$ 130 pax extra hasta 25)»). */
export type SubVarianteTour = {
  id: string
  nombre: string
  descripcion: string
  capacidad: string
  tabla: TramoPrecio[]
}

/** Plato del menú BUFFET (Saona) — distinto del PlatoMenu de los paquetes
 *  Light/Premium: no tiene `foto` (la comida del buffet no se ha fotografiado
 *  todavía — se documenta por escrito) y se pinta como lista, no como card. */
export type PlatoBuffet = { nombre: string; desc?: string }

/** Menú de un día completo con buffet + add-on opcional. Cuando `ficha`
 *  tiene `menuBuffet`, el componente MenuTour pinta este formato en vez del
 *  comparador Light/Premium (Saona es el único caso actual). */
export type MenuBuffetTour = {
  platos: PlatoBuffet[]
  /** Add-on al hacer check-out (ej: langosta premium). */
  addOn?: { nombre: string; precio: number; descripcion?: string }
}

export type FichaTour = {
  tituloLargo: string
  audiencia: string
  /** La duración larga ('4 horas'); la corta ('4 h') vive en home.ts. */
  duracion: string
  /** Descripción larga en párrafos, para el bloque de intro con «leer más»
   *  (2026-07-17: portada de la web aprobada, que es más rica que la frase
   *  corta de home.ts). Opcional: si falta, la intro usa solo descripcionCorta. */
  descripcionLarga?: string[]
  horarios: Horario[]
  /** null = este tour no tiene upgrade de menú (no se vende por paquetes). */
  upgradePremium: number | null
  /** Menú POR PAQUETE (2026-07-17, portado de la web aprobada — antes el build
   *  usaba 4 platos compartidos). Light = 2 platos a la parrilla; Premium = 7
   *  platos (los 4 con foto real + 3 de solo texto). [] en los tours que no
   *  venden menú por paquete (charter cotiza a medida, Saona sin definir);
   *  MenuTour solo se pinta en booking 'completo', así que esos [] no se ven. */
  menuLight: PlatoMenu[]
  menuPremium: PlatoMenu[]
  /** TODAS las fotos reales del tour, en /fotos (sin extensión). La `galeria`
   *  de home.ts son solo las 5 portadas del carrusel del grid; ésta es el
   *  material completo para el mosaico y el lightbox.
   *  ⚠️ Isla Saona: [] — no existe galería suya y no se rellena con fotos de
   *  otros tours (mentiría sobre el producto). Su ficha muestra foto única. */
  galeriaCompleta: string[]
  /** Quote sobre la foto principal del mosaico — portada de primeraResenaTour()
   *  de prototipo/app.js. Prueba social ANTES de scrollear (wireframe A1). */
  quoteDestacada: string
  itinerario: PasoItinerario[]
  incluye: BeneficioIncluido[]
  /** «También incluye»: el resto de lo que trae el tour más allá de los 4
   *  titulares (WiFi, aperitivos, barra flotante…). Portado de la web. */
  incluyeExtra?: string[]
  noIncluido: string
  /** Qué llevar (traje de baño, cámara, toalla, protector, efectivo). Portado
   *  de la web. [] si no aplica (Saona, sin datos). */
  queLlevar: string[]
  faqTour: PreguntaTour[]
  /** slugs de TOURS (data/home.ts) */
  tambienTeGusta: string[]
  /** Tours con sub-variantes seleccionables en el widget (Saona: Speedboat /
   *  Fishing Town / Catamarán). Cuando está presente, el widget pinta un
   *  segmented control de sub-variantes EN VEZ del toggle Light/Premium y
   *  calcula el total con `calcularTotalTour()`. Ausente en los tours que
   *  usan el toggle clásico (semi-privado, snorkel-lovers) o que no tienen
   *  paquetes (charter, consulta). */
  subVariantes?: SubVarianteTour[]
  /** Cuando está presente, el bloque de menú pinta formato BUFFET + ADD-ON
   *  (Saona) en vez del comparador Light/Premium clásico. Saona es el único
   *  caso actual. */
  menuBuffet?: MenuBuffetTour
}

export const FICHAS: Record<string, FichaTour> = {
  'semi-privado': {
    tituloLargo: 'Semi-Privado Premium — catamarán solo adultos',
    audiencia: 'Solo adultos',
    duracion: '4 horas',
    descripcionLarga: [
      'Una excursión semi-privada solo para adultos: navegamos a no más del 35% de la capacidad del barco, para que el servicio sea personalizado y te sientas un VIP — no un número en un tour masivo.',
      'Zarpamos desde Bávaro y navegamos por la costa hasta Cabo Engaño, donde empieza el mar Caribe. En el arrecife de Cabeza de Toro, nuestra bióloga marina te explica el proyecto de jardinería de coral —uno de los 3 más grandes de República Dominicana—, creado en 2016 por la Fundación Ecológica Los Arrecifes de Bávaro.',
      'Después, una playa desierta con coco-loco (con o sin alcohol) y una piscina natural de aguas poco profundas con estructuras de arrecife artificial, ideal para principiantes. La comida se prepara al momento en nuestra cocina flotante — nada de buffet recalentado.',
    ],
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM' },
      { hora: '1:00 PM', regreso: '5:00 PM' },
    ],
    upgradePremium: 15,
    // Menú POR PAQUETE, portado de la web aprobada. Light: 2 platos a la
    // parrilla. Premium: 7 platos — los 4 con foto real (plato-*) + 3 de solo
    // texto (lasañas y cóctel, sin asset en /fotos).
    menuLight: [
      { nombre: 'Pechuga de pollo a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-chicken-bodegon' },
      { nombre: 'Filete de pescado a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: [
      { nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
      { nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
      { nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
      { nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
      { nombre: 'Lasaña vegetariana', foto: 'plato-lasagna-vegetariana' },
      { nombre: 'Lasaña con pechuga de pollo', foto: 'plato-lasagna-pollo' },
      { nombre: 'Cóctel de mariscos', foto: 'plato-coctel-mariscos' },
    ],
    galeriaCompleta: [
      'galeria-semi-privado-1',
      'galeria-semi-privado-2',
      'galeria-semi-privado-3',
      'galeria-semi-privado-4',
      'galeria-semi-privado-5',
      'galeria-semi-privado-6',
      'galeria-semi-privado-7',
    ],
    quoteDestacada: 'El coral fue lo mejor del viaje — la bióloga nos explicó todo.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bávaro',
        texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.',
      },
      {
        hora: '~9:45',
        titulo: 'Snorkel en el vivero de coral',
        texto:
          'Arrecife de Cabeza de Toro: proyecto de restauración top-3 de RD, explicado por nuestra bióloga marina.',
      },
      { hora: '~11:00', titulo: 'Playa desierta + coco-loco', texto: 'Cóctel en coco real (con o sin alcohol).' },
      {
        hora: '~11:45',
        titulo: 'Piscina natural + comida a bordo',
        texto: 'Agua a 1,2 m — apto para principiantes. Tu plato, recién hecho en la cocina flotante.',
      },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Snorkel en el vivero de coral', texto: 'Equipo sanitizado (todas las tallas) + guía en el arrecife de Cabeza de Toro.' },
      { titulo: 'Transporte ida y vuelta', texto: 'Vehículo con AC, desde tu hotel.' },
      { titulo: 'Comida + barra libre', texto: 'Cocina flotante; cerveza, ron añejo, vodka, jugos, refrescos y agua.' },
      { titulo: 'Bióloga marina', texto: 'Te explica el proyecto de restauración del coral.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Aperitivos: croissants de fruta, pavo y queso',
      'Barra flotante «Coyote» en la piscina natural',
      'Fotos gratis subidas a Facebook',
    ],
    noIncluido:
      'No incluido: álbum de fotos HD (US$ 20/grupo vía Dropbox) · fotógrafo profesional (con aviso previo, costo extra) · suplemento de transporte desde Casa de Campo.',
    queLlevar: ['Traje de baño', 'Toalla', 'Protector solar biodegradable', 'Cámara', 'Efectivo (si pagas el saldo a bordo)'],
    faqTour: [
      { p: '¿Y si llueve?', r: 'Reembolso total o cambio de fecha, sin costo.' },
      { p: '¿Hay baño a bordo?', r: 'Sí, todos nuestros barcos tienen baño.' },
      { p: '¿Puedo ir si no sé nadar?', r: 'Sí, el snorkel es en aguas poco profundas y con chaleco disponible.' },
      {
        p: '¿Traigo efectivo? ¿cuánto?',
        r: 'Solo si eliges pagar el depósito del 25% — el saldo restante, con 5% de descuento si es en efectivo.',
      },
    ],
    tambienTeGusta: ['snorkel-lovers', 'charter-privado'],
  },

  'snorkel-lovers': {
    tituloLargo: 'Snorkel Lovers — catamarán para toda la familia',
    audiencia: 'Familias',
    duracion: '4 horas',
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM' },
      { hora: '1:00 PM', regreso: '5:00 PM' },
    ],
    upgradePremium: 15,
    // Misma cocina/operación que Semi-Privado (mismo catamarán y menú); el
    // marco cambia (familias, sin alcohol para menores), no los platos.
    menuLight: [
      { nombre: 'Pechuga de pollo a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-chicken-bodegon' },
      { nombre: 'Filete de pescado a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: [
      { nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
      { nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
      { nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
      { nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
      { nombre: 'Lasaña vegetariana', foto: 'plato-lasagna-vegetariana' },
      { nombre: 'Lasaña con pechuga de pollo', foto: 'plato-lasagna-pollo' },
      { nombre: 'Cóctel de mariscos', foto: 'plato-coctel-mariscos' },
    ],
    galeriaCompleta: [
      'galeria-snorkel-lovers-1',
      'galeria-snorkel-lovers-2',
      'galeria-snorkel-lovers-3',
      'galeria-snorkel-lovers-4',
      'galeria-snorkel-lovers-5',
      'galeria-snorkel-lovers-6',
      'galeria-snorkel-lovers-7',
      'galeria-snorkel-lovers-8',
      'galeria-snorkel-lovers-9',
    ],
    quoteDestacada: 'Perfecto para ir con los niños, todos se sintieron seguros.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bávaro',
        texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.',
      },
      {
        hora: '~9:45',
        titulo: 'Snorkel educativo en el vivero',
        texto: 'Guía adaptada para principiantes y niños, con chalecos para todas las tallas.',
      },
      {
        hora: '~11:00',
        titulo: 'Playa desierta + coco-loco',
        texto: 'Cóctel en coco real (sin alcohol para los niños).',
      },
      {
        hora: '~11:45',
        titulo: 'Piscina natural + comida a bordo',
        texto: 'Agua poco profunda, ideal para primeras veces en el mar.',
      },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Equipo de snorkel', texto: 'Todas las tallas, incluidas infantiles.' },
      { titulo: 'Transporte ida y vuelta', texto: 'Vehículo con AC, desde tu hotel.' },
      { titulo: 'Comida + barra libre', texto: 'Cocina flotante; jugos y refrescos para todos, sin alcohol para menores.' },
      { titulo: 'Guía de snorkel', texto: 'Explicación adaptada a todas las edades.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Aperitivos: croissants de fruta, pavo y queso',
      'Barra flotante «Coyote» en la piscina natural',
      'Fotos gratis subidas a Facebook',
    ],
    noIncluido:
      'No incluido: álbum de fotos HD (US$ 20/grupo vía Dropbox) · fotógrafo profesional (con aviso previo, costo extra) · suplemento de transporte desde Casa de Campo.',
    queLlevar: ['Traje de baño', 'Toalla', 'Protector solar biodegradable', 'Cámara', 'Efectivo (si pagas el saldo a bordo)'],
    faqTour: [
      {
        p: '¿Desde qué edad pueden ir los niños?',
        r: 'No hay edad mínima — llevamos chalecos de todas las tallas, incluidas infantiles.',
      },
      { p: '¿Hay chalecos infantiles?', r: 'Sí, para todas las edades y tamaños.' },
      { p: '¿Puedo ir si no sé nadar?', r: 'Sí, el snorkel es en aguas poco profundas y con chaleco disponible.' },
      {
        p: '¿Traigo efectivo? ¿cuánto?',
        r: 'Solo si eliges pagar el depósito del 25% — el saldo restante, con 5% de descuento si es en efectivo.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado'],
  },

  'charter-privado': {
    tituloLargo: 'Charter Privado — el barco entero para tu grupo',
    audiencia: 'Tu grupo',
    duracion: '3-4 horas',
    horarios: [{ hora: 'A coordinar', regreso: '' }],
    upgradePremium: 15,
    // Charter cotiza el menú a medida (booking 'cotizacion' no pinta MenuTour):
    // sin listas fijas de paquete.
    menuLight: [],
    menuPremium: [],
    galeriaCompleta: [
      'galeria-charter-privado-1',
      'galeria-charter-privado-2',
      'galeria-charter-privado-3',
      'galeria-charter-privado-4',
      'galeria-charter-privado-5',
      'galeria-charter-privado-6',
      'galeria-charter-privado-7',
    ],
    quoteDestacada: 'Coordinaron todo a nuestra medida, el barco entero para la familia.',
    itinerario: [
      { hora: 'A coordinar', titulo: 'Recogida en tu hotel', texto: 'Se ajusta al horario que definamos juntos.' },
      {
        hora: '',
        titulo: 'Ruta a tu elección',
        texto: 'Snorkel, playa desierta y piscina natural — el mismo recorrido, a tu ritmo.',
      },
      { hora: '', titulo: 'Comida y barra a bordo', texto: 'Menú a medida desde la cocina flotante.' },
      { hora: '', titulo: 'Regreso al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Barco entero', texto: 'Sin desconocidos a bordo, hasta 120 personas.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida a medida', texto: 'Menú coordinado con tu grupo.' },
      { titulo: 'Coordinación dedicada', texto: 'Una persona de principio a fin.' },
    ],
    noIncluido: 'Precio final según nº de personas y menú elegido — se cotiza a medida.',
    queLlevar: ['Traje de baño', 'Toalla', 'Protector solar biodegradable', 'Cámara'],
    faqTour: [
      {
        p: '¿Cuál es el mínimo de personas?',
        r: 'Dato pendiente de confirmar con el cliente — escríbenos por WhatsApp y te respondemos al instante.',
      },
      { p: '¿Puedo elegir la ruta?', r: 'Sí, la coordinamos contigo según lo que quiera ver tu grupo.' },
      { p: '¿Aceptan pagos corporativos?', r: 'Sí, ver la página de Empresas y MICE para facturación formal.' },
      {
        p: '¿Cómo funciona la cotización?',
        r: 'Nos cuentas tu grupo y fecha, y te respondemos en menos de 24 h con precio final.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'snorkel-lovers'],
  },

  'isla-saona': {
    tituloLargo: 'Isla Saona — día completo, elige tu bote',
    audiencia: 'Día completo',
    duracion: 'Día completo (8 horas)',
    descripcionLarga: [
      'Isla Saona es la excursión estrella del Caribe Dominicano: playas de arena blanca, aguas turquesas y una piscina natural donde te rodean estrellas gigantes. Zarpamos temprano desde Bayahibe y pasamos el día entero entre Catuano, Las Palmillas y (en la variante Fishing Town) el pueblo de pescadores de Mano Juan.',
      'Eliges CÓMO llegar: en speedboat privado (la forma más rápida y exclusiva, hasta 9 personas), en catamarán (la experiencia clásica, hasta 70) o en lancha rápida con parada en el pueblo de pescadores de Mano Juan y Playa Toro. Las tres variantes incluyen el buffet típico en la isla y la piscina natural de Las Palmillas con estrellas gigantes.',
      'El día cierra con regreso por la costa al atardecer. Es la única excursión full-day del catálogo — todo el resto son medios días.',
    ],
    horarios: [{ hora: '9:00 AM', regreso: '4:00 PM' }],
    // Sin Light/Premium (Saona se diferencia por BOTE, no por menú). El widget
    // detecta `subVariantes` y pinta un segmented control de botes en vez del
    // toggle clásico. `menuBuffet` cambia el formato del bloque de menú.
    upgradePremium: null,
    subVariantes: [
      {
        id: 'speedboat',
        nombre: 'Speedboat',
        descripcion: 'La forma más rápida y exclusiva',
        capacidad: '6-9 personas (+US$ 130 pax adicional hasta 25)',
        tabla: [
          { desde: 6, hasta: 6, precio: 1100, tipo: 'grupo' },
          { desde: 7, hasta: 7, precio: 1160, tipo: 'grupo' },
          { desde: 8, hasta: 8, precio: 1220, tipo: 'grupo' },
          { desde: 9, hasta: 9, precio: 1340, tipo: 'grupo' },
          { desde: 10, hasta: 25, precio: 130, tipo: 'persona' },
        ],
      },
      {
        id: 'fishing',
        nombre: 'Fishing Town',
        descripcion: 'Con parada en Mano Juan y Playa Toro',
        capacidad: '6-10 personas (+US$ 140 pax adicional hasta 25)',
        tabla: [
          { desde: 6, hasta: 6, precio: 1200, tipo: 'grupo' },
          { desde: 7, hasta: 7, precio: 1270, tipo: 'grupo' },
          { desde: 8, hasta: 8, precio: 1340, tipo: 'grupo' },
          { desde: 9, hasta: 9, precio: 1410, tipo: 'grupo' },
          { desde: 10, hasta: 10, precio: 1450, tipo: 'grupo' },
          { desde: 11, hasta: 25, precio: 140, tipo: 'persona' },
        ],
      },
      {
        id: 'catamaran',
        nombre: 'Catamarán',
        descripcion: 'La experiencia clásica, hasta 70 personas',
        capacidad: '1-70 personas',
        tabla: [
          {
            desde: 1,
            hasta: 30,
            precio: 1950,
            tipo: 'grupo',
            extra: '+ US$ 45 por persona para comida y transporte',
          },
          { desde: 31, hasta: 70, precio: 105, tipo: 'persona' },
        ],
      },
    ],
    menuLight: [],
    menuPremium: [],
    // Formato buffet: 5 platos en la isla + add-on langosta al check-out.
    menuBuffet: {
      platos: [
        { nombre: 'Pasta salad', desc: 'Con tomate, pepino y vinagreta' },
        { nombre: 'Spaghetti con langosta' },
        { nombre: 'Pollo a la parrilla' },
        { nombre: 'Chuletas de cerdo' },
        { nombre: 'Frutas tropicales' },
      ],
      addOn: {
        nombre: 'Langosta premium',
        precio: 30,
        descripcion: 'Disponible al hacer check-out, US$ 30 por persona',
      },
    },
    // Galería de 11 fotos reales de la web del cliente
    // (images/excursions/saona-island-private/1..11.jpg, descargadas a
    // public/fotos/galeria-isla-saona-1..11.webp). La portada
    // (tour-isla-saona.webp) es la misma #1 — patrón actual: la 1ª celda del
    // mosaico es siempre la portada, igual que en los otros tours.
    galeriaCompleta: [
      'galeria-isla-saona-1',
      'galeria-isla-saona-2',
      'galeria-isla-saona-3',
      'galeria-isla-saona-4',
      'galeria-isla-saona-5',
      'galeria-isla-saona-6',
      'galeria-isla-saona-7',
      'galeria-isla-saona-8',
      'galeria-isla-saona-9',
      'galeria-isla-saona-10',
      'galeria-isla-saona-11',
    ],
    quoteDestacada: 'La piscina natural con las estrellas gigantes fue lo mejor — y el buffet en la playa, increíble.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC desde Bávaro / Punta Cana. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bayahibe',
        texto: 'Check-in en el muelle. Sale tu variante elegida: speedboat, lancha rápida o catamarán.',
      },
      {
        hora: '~10:30',
        titulo: 'Piscina natural de Las Palmillas',
        texto: 'Aguas turquesas poco profundas donde nadas con estrellas gigantes. Snack en el agua.',
      },
      {
        hora: '~12:00',
        titulo: 'Almuerzo buffet en Catuano',
        texto: 'En Isla Saona (playa de Catuano): pasta, spaghetti con langosta, pollo, chuletas y frutas.',
      },
      {
        hora: '~14:00',
        titulo: 'Tiempo en la playa',
        texto: 'Relax bajo cocoteros, hamacas y camas balinesas. La variante Fishing Town añade Mano Juan y Playa Toro.',
      },
      {
        hora: '16:00',
        titulo: 'Regreso y traslado al hotel',
        texto: 'Navegación de vuelta por la costa, llegada al hotel al atardecer.',
      },
    ],
    incluye: [
      { titulo: 'Transporte ida y vuelta', texto: 'Recogida en tu hotel con AC, desde Bávaro / Punta Cana.' },
      { titulo: 'Bote completo', texto: 'Speedboat, lancha rápida o catamarán, según la variante que elijas.' },
      { titulo: 'Almuerzo buffet', texto: 'En la isla: pasta, spaghetti con langosta, pollo, chuletas y frutas.' },
      { titulo: 'Piscina natural', texto: 'Parada en Las Palmillas con estrellas gigantes, snack en el agua.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Equipo de snorkel',
      'Guía bilingüe durante toda la excursión',
    ],
    noIncluido:
      'No incluido: langosta premium (US$ 30 pax, add-on opcional al check-out) · fotógrafo profesional (con aviso previo, costo extra) · transporte desde Casa de Campo (suplemento).',
    queLlevar: [
      'Traje de baño',
      'Toalla',
      'Protector solar biodegradable',
      'Cámara',
      'Efectivo (para el add-on de langosta o propinas)',
    ],
    faqTour: [
      { p: '¿Cuánto dura el día completo?', r: '8 horas: salida 9:00 AM, regreso a tu hotel ~5:00 PM.' },
      {
        p: '¿Cuál es la diferencia entre las 3 variantes?',
        r: 'Speedboat es la más rápida y exclusiva (6-9 pax). Fishing Town añade parada en Mano Juan y Playa Toro. Catamarán es la opción clásica para grupos grandes (hasta 70 pax).',
      },
      { p: '¿Puedo añadir langosta premium?', r: 'Sí, al hacer check-out: US$ 30 por persona.' },
      {
        p: '¿Y si llueve?',
        r: 'Reembolso total o cambio de fecha, sin costo.',
      },
      {
        p: '¿Desde qué edad pueden ir los niños?',
        r: 'No hay edad mínima — llevamos chalecos de todas las tallas en speedboat y catamarán.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado'],
  },
}

/** WhatsApp del negocio. Número confirmado (PLAN-v3.md §12.9) — es el único
 *  enlace externo REAL de la ficha: el resto de destinos (funnel, listado,
 *  reserva-directa) viven en prototipo/ y van por EnlacePrototipo. */
export const WHATSAPP_URL = 'https://wa.me/18293052804'

/** Resuelve el precio total del tour para una variante y nº de personas
 *  dados. Funciona para los 2 modelos:
 *  - Sin subVariantes (semi-privado, snorkel-lovers): `precioLight × personas`.
 *  - Con subVariantes (Saona): busca el tramo que contiene `personas` dentro
 *    de la tabla de la variante; el tramo tipo 'grupo' ya es el total, el
 *    tipo 'persona' se multiplica por `personas`.
 *  Devuelve `null` cuando no hay forma de calcularlo (charter-privado cotiza
 *  a medida; consulta no tiene precio). El widget usa esto para pintar el
 *  precio del CTA y para mandar el total correcto al funnel. */
export function calcularTotalTour(
  ficha: FichaTour,
  varianteId: string | null,
  personas: number,
  precioLight: number | null,
): number | null {
  if (ficha.subVariantes && ficha.subVariantes.length > 0) {
    const v = varianteId
      ? ficha.subVariantes.find((s) => s.id === varianteId) ?? ficha.subVariantes[0]
      : ficha.subVariantes[0]
    const t = v.tabla.find(
      (tr) => tr.desde <= personas && (tr.hasta === null || tr.hasta >= personas),
    )
    if (!t) return null
    return t.tipo === 'grupo' ? t.precio : t.precio * personas
  }
  if (precioLight === null) return null
  return precioLight * personas
}
