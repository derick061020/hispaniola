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
    tituloLargo: 'Isla Saona — día completo en catamarán privado',
    audiencia: 'Privado · día completo',
    duracion: 'Día completo',
    horarios: [],
    upgradePremium: null,
    // Sin paquetes ni datos confirmados (pendiente del cliente).
    menuLight: [],
    menuPremium: [],
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
    queLlevar: [],
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
