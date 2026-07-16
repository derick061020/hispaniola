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

export type FichaTour = {
  tituloLargo: string
  audiencia: string
  /** La duración larga ('4 horas'); la corta ('4 h') vive en home.ts. */
  duracion: string
  horarios: Horario[]
  /** null = este tour no tiene upgrade de menú (no se vende por paquetes). */
  upgradePremium: number | null
  /** TODAS las fotos reales del tour, en /fotos (sin extensión). La `galeria`
   *  de home.ts son solo las 5 portadas del carrusel del grid; ésta es el
   *  material completo para el mosaico y el lightbox.
   *  ⚠️ Isla Saona: [] — no existe galería suya y no se rellena con fotos de
   *  otros tours (mentiría sobre el producto). Su ficha muestra foto única. */
  galeriaCompleta: string[]
  /** Quote sobre la foto principal del mosaico — portada de primeraResenaTour()
   *  de prototipo/app.js. Prueba social ANTES de scrollear (wireframe A1). */
  quoteDestacada: string
  /** Columna visual del itinerario (T-F4). El wireframe (A3) pide ahí un MAPA
   *  de la ruta, y ese asset NO existe — no se inventa (ni un SVG a ojo ni una
   *  ilustración generada sin el OK de Samuel); es decisión abierta
   *  (PLAN-TOURS.md §13.4). Mientras tanto va una foto real del tour, elegida
   *  MIRÁNDOLAS y de entre las que el mosaico NO usa (que son las 4 primeras de
   *  `galeriaCompleta` + la portada), para no repetir foto en la misma página.
   *  Va como campo propio y no como «galeriaCompleta[4]» a propósito: así
   *  reordenar la galería no hace colisionar en silencio el mosaico con esta.
   *  undefined = sin columna visual (Isla Saona: no tiene galería). */
  fotoItinerario?: string
  itinerario: PasoItinerario[]
  incluye: BeneficioIncluido[]
  noIncluido: string
  faqTour: PreguntaTour[]
  /** slugs de TOURS (data/home.ts) */
  tambienTeGusta: string[]
}

export const FICHAS: Record<string, FichaTour> = {
  'semi-privado': {
    tituloLargo: 'Semi-Privado Premium — catamarán solo adultos',
    audiencia: 'Solo adultos',
    duracion: '4 horas',
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM' },
      { hora: '1:00 PM', regreso: '5:00 PM' },
    ],
    upgradePremium: 15,
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
    // El catamarán fondeado con el grupo en el agua: es la parada de «piscina
    // natural» que el propio itinerario describe.
    fotoItinerario: 'galeria-semi-privado-6',
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
      { titulo: 'Equipo de snorkel', texto: 'Sanitizado, todas las tallas.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida + bebidas', texto: 'Cocina flotante y barra.' },
      { titulo: 'Bióloga marina', texto: 'Guía del arrecife.' },
    ],
    noIncluido:
      'No incluido: fotos HD originales (US$ 20 vía Dropbox) · suplemento de transporte desde Casa de Campo.',
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
    // Una snorkelista sobre las estructuras del vivero de coral: es
    // literalmente el «vivero» que nombra el itinerario, no una foto de agua
    // cualquiera.
    fotoItinerario: 'galeria-snorkel-lovers-7',
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
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida + bebidas', texto: 'Cocina flotante y barra (sin alcohol para menores).' },
      { titulo: 'Guía de snorkel', texto: 'Explicación adaptada a todas las edades.' },
    ],
    noIncluido:
      'No incluido: fotos HD originales (US$ 20 vía Dropbox) · suplemento de transporte desde Casa de Campo.',
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
    // El grupo entero en el agua con SU barco al fondo: es la promesa del
    // charter («sin desconocidos a bordo»), no una parada concreta — este tour
    // no tiene ruta fija.
    fotoItinerario: 'galeria-charter-privado-7',
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
    tituloLargo: 'Isla Saona — día completo en catamarán privado',
    audiencia: 'Privado · día completo',
    duracion: 'Día completo',
    horarios: [],
    upgradePremium: null,
    // Sin galería propia: la web actual no tiene fotos de este tour. No se
    // rellena con fotos de los otros (son barcos y planes distintos) — la ficha
    // muestra su foto de portada sola. Es la misma honestidad que el resto de
    // la ficha de Saona, cuyo precio y capacidad siguen "por confirmar".
    galeriaCompleta: [],
    quoteDestacada: 'Playas increíbles, la comida en la isla estuvo deliciosa.',
    // Sin foto de itinerario: su única foto es la portada, y repetirla aquí
    // llenaría el hueco sin aportar nada. El timeline va a ancho completo.
    itinerario: [
      { hora: '', titulo: 'Recogida en tu hotel', texto: 'Salida temprano — día completo.' },
      {
        hora: '',
        titulo: 'Navegación a Isla Saona',
        texto: 'Con paradas en piscina natural y playas vírgenes.',
      },
      { hora: '', titulo: 'Almuerzo típico', texto: 'En la propia isla.' },
      { hora: '', titulo: 'Regreso al hotel', texto: 'Al atardecer.' },
    ],
    incluye: [
      { titulo: 'Transporte ida y vuelta', texto: 'Desde tu hotel.' },
      { titulo: 'Almuerzo', texto: 'Comida típica dominicana en la isla.' },
      { titulo: 'Paradas de snorkel', texto: 'Piscina natural incluida.' },
    ],
    noIncluido: 'Precio, duración exacta y capacidad: PENDIENTE de confirmar con el cliente.',
    faqTour: [
      { p: '¿Cuánto dura el tour completo?', r: 'Dato pendiente de confirmar con el cliente.' },
      { p: '¿Qué incluye el almuerzo?', r: 'Comida típica dominicana servida en la propia isla.' },
      { p: '¿Hay descuento para niños?', r: 'Dato pendiente de confirmar con el cliente.' },
      {
        p: '¿Cuál es el precio?',
        r: 'Aún no está definido — escríbenos por WhatsApp y te damos el precio actualizado.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado'],
  },
}

/** WhatsApp del negocio. Número confirmado (PLAN-v3.md §12.9) — es el único
 *  enlace externo REAL de la ficha: el resto de destinos (funnel, listado,
 *  reserva-directa) viven en prototipo/ y van por EnlacePrototipo. */
export const WHATSAPP_URL = 'https://wa.me/18293052804'
