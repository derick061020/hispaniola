/* ============================================================
   Hispaniola — Prototipo. Datos y contenido (copy exacto de
   wireframes/wireframes-completos.html). Ver prototipo/PLAN.md.
   Script clásico (NO type=module) — se abre con file://.
   ============================================================ */

// ---------- Tours (los 4 productos) ----------
var TOURS = {
  'semi-privado': {
    slug: 'semi-privado',
    nombre: 'Semi-Privado Premium',
    tituloLargo: 'Semi-Privado Premium — catamarán solo adultos',
    audiencia: 'Solo adultos',
    audienciaChip: 'Solo adultos',
    maxPax: 25,
    aforoBarco: 70,
    duracion: '4 horas',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 99,
    upgradePremium: 15,
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM', quedan: 9 },
      { hora: '1:00 PM', regreso: '5:00 PM', quedan: 17 }
    ],
    booking: 'completo',
    descripcionCorta: 'Snorkel en vivero de coral con bióloga marina, playa desierta con coco-loco y comida hecha a bordo en la cocina flotante. Máximo 25 personas en un barco para 70.',
    itinerario: [
      { hora: '8:05', titulo: 'Recogida en tu hotel', texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.' },
      { hora: '9:00', titulo: 'Zarpamos desde Bávaro', texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.' },
      { hora: '~9:45', titulo: 'Snorkel en el vivero de coral', texto: 'Arrecife de Cabeza de Toro: proyecto de restauración top-3 de RD, explicado por nuestra bióloga marina.' },
      { hora: '~11:00', titulo: 'Playa desierta + coco-loco', texto: 'Cóctel en coco real (con o sin alcohol).' },
      { hora: '~11:45', titulo: 'Piscina natural + comida a bordo', texto: 'Agua a 1,2 m — apto para principiantes. Tu plato, recién hecho en la cocina flotante.' },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' }
    ],
    incluye: [
      { titulo: 'Equipo de snorkel', texto: 'Sanitizado, todas las tallas.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida + bebidas', texto: 'Cocina flotante y barra.' },
      { titulo: 'Bióloga marina', texto: 'Guía del arrecife.' }
    ],
    noIncluido: 'No incluido: fotos HD originales (US$ 20 vía Dropbox) · suplemento de transporte desde Casa de Campo.',
    faqTour: [
      '¿Y si llueve? — reembolso o cambio de fecha',
      '¿Hay baño a bordo?',
      '¿Puedo ir si no sé nadar?',
      '¿Traigo efectivo? ¿cuánto?'
    ],
    tambienTeGusta: ['snorkel-lovers', 'charter-privado']
  },
  'snorkel-lovers': {
    slug: 'snorkel-lovers',
    nombre: 'Snorkel Lovers',
    tituloLargo: 'Snorkel Lovers — catamarán para toda la familia',
    audiencia: 'Familias',
    audienciaChip: 'Todas las edades',
    maxPax: 25,
    aforoBarco: 70,
    duracion: '4 horas',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 98,
    upgradePremium: 15,
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM', quedan: 6 },
      { hora: '1:00 PM', regreso: '5:00 PM', quedan: 3 }
    ],
    booking: 'completo',
    descripcionCorta: 'La versión familiar del Semi-Privado: mismo vivero de coral, misma cocina flotante, pensado para que niños y adultos disfruten juntos el día en el mar.',
    itinerario: [
      { hora: '8:05', titulo: 'Recogida en tu hotel', texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.' },
      { hora: '9:00', titulo: 'Zarpamos desde Bávaro', texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.' },
      { hora: '~9:45', titulo: 'Snorkel educativo en el vivero', texto: 'Guía adaptada para principiantes y niños, con chalecos para todas las tallas.' },
      { hora: '~11:00', titulo: 'Playa desierta + coco-loco', texto: 'Cóctel en coco real (sin alcohol para los niños).' },
      { hora: '~11:45', titulo: 'Piscina natural + comida a bordo', texto: 'Agua poco profunda, ideal para primeras veces en el mar.' },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' }
    ],
    incluye: [
      { titulo: 'Equipo de snorkel', texto: 'Todas las tallas, incluidas infantiles.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida + bebidas', texto: 'Cocina flotante y barra (sin alcohol para menores).' },
      { titulo: 'Guía de snorkel', texto: 'Explicación adaptada a todas las edades.' }
    ],
    noIncluido: 'No incluido: fotos HD originales (US$ 20 vía Dropbox) · suplemento de transporte desde Casa de Campo.',
    faqTour: [
      '¿Desde qué edad pueden ir los niños?',
      '¿Hay chalecos infantiles?',
      '¿Puedo ir si no sé nadar?',
      '¿Traigo efectivo? ¿cuánto?'
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado']
  },
  'charter-privado': {
    slug: 'charter-privado',
    nombre: 'Charter Privado',
    tituloLargo: 'Charter Privado — el barco entero para tu grupo',
    audiencia: 'Tu grupo',
    audienciaChip: 'Grupo privado',
    maxPax: 120,
    aforoBarco: 120,
    duracion: '3-4 horas',
    duracionCorta: '3-4 h',
    rating: 4.9,
    resenas: 1782,
    precioLight: 55,
    upgradePremium: 15,
    horarios: [
      { hora: 'A coordinar', regreso: '', quedan: null }
    ],
    booking: 'cotizacion',
    descripcionCorta: 'El barco completo, solo para tu grupo: familia, amigos, o una celebración. Ruta y horario a tu medida, desde 10 personas.',
    itinerario: [
      { hora: 'A coordinar', titulo: 'Recogida en tu hotel', texto: 'Se ajusta al horario que definamos juntos.' },
      { hora: '', titulo: 'Ruta a tu elección', texto: 'Snorkel, playa desierta y piscina natural — el mismo recorrido, a tu ritmo.' },
      { hora: '', titulo: 'Comida y barra a bordo', texto: 'Menú a medida desde la cocina flotante.' },
      { hora: '', titulo: 'Regreso al hotel', texto: '' }
    ],
    incluye: [
      { titulo: 'Barco entero', texto: 'Sin desconocidos a bordo, hasta 120 personas.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel.' },
      { titulo: 'Comida a medida', texto: 'Menú coordinado con tu grupo.' },
      { titulo: 'Coordinación dedicada', texto: 'Una persona de principio a fin.' }
    ],
    noIncluido: 'Precio final según nº de personas y menú elegido — se cotiza a medida.',
    faqTour: [
      '¿Cuál es el mínimo de personas?',
      '¿Puedo elegir la ruta?',
      '¿Aceptan pagos corporativos?',
      '¿Cómo funciona la cotización?'
    ],
    tambienTeGusta: ['semi-privado', 'snorkel-lovers']
  },
  'isla-saona': {
    slug: 'isla-saona',
    nombre: 'Isla Saona',
    tituloLargo: 'Isla Saona — día completo en catamarán privado',
    audiencia: 'Privado · día completo',
    audienciaChip: 'Día completo',
    maxPax: null,
    aforoBarco: null,
    duracion: 'Día completo',
    duracionCorta: 'día completo',
    rating: 4.9,
    resenas: 1782,
    precioLight: null,
    upgradePremium: null,
    horarios: [],
    booking: 'consulta',
    descripcionCorta: 'Día completo navegando a Isla Saona: playas de arena blanca, piscina natural y almuerzo típico dominicano. Precio y capacidad pendientes de confirmar.',
    itinerario: [
      { hora: '', titulo: 'Recogida en tu hotel', texto: 'Salida temprano — día completo.' },
      { hora: '', titulo: 'Navegación a Isla Saona', texto: 'Con paradas en piscina natural y playas vírgenes.' },
      { hora: '', titulo: 'Almuerzo típico', texto: 'En la propia isla.' },
      { hora: '', titulo: 'Regreso al hotel', texto: 'Al atardecer.' }
    ],
    incluye: [
      { titulo: 'Transporte ida y vuelta', texto: 'Desde tu hotel.' },
      { titulo: 'Almuerzo', texto: 'Comida típica dominicana en la isla.' },
      { titulo: 'Paradas de snorkel', texto: 'Piscina natural incluida.' }
    ],
    noIncluido: 'Precio, duración exacta y capacidad: PENDIENTE de confirmar con el cliente.',
    faqTour: [
      '¿Cuánto dura el tour completo?',
      '¿Qué incluye el almuerzo?',
      '¿Hay descuento para niños?',
      '¿Cuál es el precio?'
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado']
  }
};

var ORDEN_TOURS = ['semi-privado', 'snorkel-lovers', 'charter-privado', 'isla-saona'];

// ---------- Menú de paquetes (platos) ----------
var PLATOS = [
  { id: 'mariscos', nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón' },
  { id: 'carne', nombre: 'Carne', desc: 'Angus certificado' },
  { id: 'surf-turf', nombre: 'Surf & Turf', desc: 'Langosta + Angus' },
  { id: 'vegetariano', nombre: 'Vegetariano', desc: 'Ceviche de zucchini' }
];

// ---------- Hoteles (autocomplete fake, zona Bávaro) ----------
var HOTELES = [
  'Hard Rock Hotel — Bávaro',
  'Barceló Bávaro Palace',
  'Riu Republica',
  'Majestic Elegance Punta Cana',
  'Iberostar Selection Bávaro',
  'Melià Punta Cana Beach',
  'Occidental Caribe',
  'Grand Palladium Bávaro'
];

// ---------- Ocasiones de eventos (para el hub + megamenú) ----------
var OCASIONES = [
  { tipo: 'boda', nombre: 'Bodas y pre-boda', meta: 'Ceremonia, welcome party o despedida del grupo.', ruta: '#/eventos/bodas', esLanding: true },
  { tipo: 'mice', nombre: 'Corporativo / MICE', meta: 'Incentivos, team building, cierres de convención.', ruta: '#/eventos/empresas', esLanding: true },
  { tipo: 'cumpleanos', nombre: 'Cumpleaños', meta: 'Decoración, pastel y la playlist que elijas.', ruta: '#/eventos?tipo=cumpleanos', esLanding: false },
  { tipo: 'aniversario', nombre: 'Aniversarios', meta: 'Íntimo o con toda la familia.', ruta: '#/eventos?tipo=aniversario', esLanding: false },
  { tipo: 'despedida', nombre: 'Despedidas de soltero/a', meta: 'Barco entero, solo tu grupo.', ruta: '#/eventos?tipo=despedida', esLanding: false },
  { tipo: 'reunion', nombre: 'Reuniones familiares', meta: 'Multi-generación: niños y abuelos a bordo.', ruta: '#/eventos?tipo=reunion', esLanding: false }
];

var TIPO_EVENTO_LABEL = {
  boda: 'Boda', mice: 'Corporativo / MICE', cumpleanos: 'Cumpleaños',
  aniversario: 'Aniversario', despedida: 'Despedida de soltero/a', reunion: 'Reunión familiar', charter: 'Charter privado'
};

// ---------- FAQ (categorías + preguntas) ----------
var FAQ_CATEGORIAS = [
  {
    id: 'reservas', nombre: 'Reservas y pagos',
    preguntas: [
      { p: '¿Puedo pagar solo una parte ahora?', r: 'Sí. Confirmas con el 25% y pagas el resto el día del tour, en efectivo (con 5% de descuento) o con tarjeta desde Mi Reserva.' },
      { p: '¿Qué pasa si cancelo?', r: 'Cancelación gratis hasta 7 días antes del tour. Después de esa fecha aplica la política de cancelación.' },
      { p: '¿Puedo cambiar la fecha?', r: 'Sí, escríbenos por WhatsApp con tu código de reserva y te ayudamos a reprogramar.' },
      { p: '¿Cuánto efectivo debo llevar?', r: 'Si elegiste depósito del 25%, el saldo restante — con 5% de descuento si pagas en efectivo a bordo.' }
    ]
  },
  {
    id: 'antes', nombre: 'Antes del tour',
    preguntas: [
      { p: '¿A qué hora me recogen?', r: 'Te confirmamos la hora exacta de recogida por WhatsApp la tarde anterior a tu tour.' },
      { p: '¿Qué debo llevar?', r: 'Traje de baño, toalla, protector solar biodegradable y el efectivo del saldo si aplica.' }
    ]
  },
  {
    id: 'abordo', nombre: 'A bordo',
    preguntas: [
      { p: '¿Hay baño a bordo?', r: 'Sí, todos nuestros barcos tienen baño.' },
      { p: '¿Puedo ir si no sé nadar?', r: 'Sí, el snorkel es en aguas poco profundas y con chaleco salvavidas disponible.' }
    ]
  },
  {
    id: 'comida', nombre: 'Comida',
    preguntas: [
      { p: '¿Puedo elegir mi plato?', r: 'Sí, cada persona elige su plato al reservar: Mariscos, Carne, Surf & Turf o Vegetariano.' },
      { p: '¿Puedo cambiar mi plato después de reservar?', r: 'Sí, desde Mi Reserva, hasta 24 horas antes del tour.' }
    ]
  },
  {
    id: 'clima', nombre: 'Clima y cancelaciones',
    preguntas: [
      { p: '¿Y si llueve el día de mi tour?', r: 'Reembolso total o cambio de fecha, sin costo.' },
      { p: '¿Se cancela por mar picado?', r: 'Solo si las condiciones no son seguras — en ese caso, reembolso total o reprogramación.' }
    ]
  },
  {
    id: 'ninos', nombre: 'Niños y accesibilidad',
    preguntas: [
      { p: '¿Los niños pueden ir en todos los tours?', r: 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos (18+).' },
      { p: '¿Tienen chalecos infantiles?', r: 'Sí, todas las tallas disponibles.' }
    ]
  }
];

// ---------- Guías / Blog ----------
var GUIAS = [
  {
    destacado: true, slug: 'como-elegir-tour',
    titulo: 'Cómo elegir tour de catamarán en Punta Cana (y no acabar en un party boat de 200)',
    resumen: 'La guía honesta: qué preguntar, qué señales de alarma, qué está incluido de verdad.',
    lectura: '6 min de lectura'
  },
  { slug: 'que-llevar', titulo: 'Qué llevar a un tour de snorkel', resumen: 'Protector biodegradable, efectivo, y las 3 cosas que todos olvidan.' },
  { slug: 'mejor-epoca', titulo: 'Mejor época para navegar en Punta Cana', resumen: 'Mes a mes: mar, lluvia, veda de langosta.' },
  { slug: 'saona-o-cabeza-de-toro', titulo: 'Saona, Cabeza de Toro o piscina natural', resumen: 'Qué verás en cada una y cuál te conviene.' },
  { slug: 'snorkel-primera-vez', titulo: 'Snorkel por primera vez: no hace falta saber nadar', resumen: 'Cómo lo hacemos con principiantes.' }
];

// ---------- Tripulación y flota (Nosotros) ----------
var TRIPULACION = [
  { nombre: 'Capitán', rol: 'Capitán' },
  { nombre: 'Bióloga marina', rol: 'Bióloga marina' },
  { nombre: 'Chef a bordo', rol: 'Chef a bordo' },
  { nombre: 'Guía de snorkel', rol: 'Guía de snorkel' }
];
var FLOTA = [
  { nombre: 'Catamarán A', meta: 'Aforo 70 · Reservamos máx. 25 · 1 baño · WiFi · tobogán' },
  { nombre: 'Catamarán B', meta: 'Aforo 120 · Privados y eventos · 1 baño · cocina flotante' },
  { nombre: 'La cocina flotante', meta: 'Nuestra plataforma de cocina: comida recién hecha en medio del mar.' }
];

// ---------- Notas de diseño (modo notas — toggle 📝) ----------
var NOTAS = {
  'home-hero': {
    titulo: 'Hero — promesa + disponibilidad',
    texto: 'La promesa une los dos diferenciadores más fuertes (grupos pequeños + experiencia original). El buscador fecha+personas ES el CTA — patrón Civitatis: disponibilidad antes que datos personales.'
  },
  'home-megamenu-tours': {
    titulo: 'Megamenú TOURS — el escaparate',
    texto: 'Sí, megamenú: 4 productos con foto, audiencia, capacidad y precio. Es el camino al dinero — el escaparate acelera la decisión antes de entrar a una ficha. Agrupados por duración, como el turista piensa su agenda.'
  },
  'home-megamenu-eventos': {
    titulo: 'Megamenú EVENTOS — con una condición',
    texto: 'Megamenú, pero solo porque cada ítem hace algo real: 2 landings (Bodas, Empresas) + 6 ocasiones con deep-link al formulario ya preseleccionado. Sin ese deep-link serían decoración.'
  },
  'home-stats': {
    titulo: 'Cinta de datos',
    texto: 'Los stats que hoy están enterrados en la ficha (4.454 días, 91.607 clientes) suben a la home como cinta única.'
  },
  'home-tours': {
    titulo: 'Los 4 productos, de una',
    texto: 'Saona entra al catálogo visible con nombre propio. Precio "desde" consistente con la ficha. Precio de Saona: dato por confirmar con el cliente.'
  },
  'home-why-direct': {
    titulo: '"Why book direct" — el bloque que no existe',
    texto: 'Viator vende el mismo tour al mismo precio y la web propia no da ninguna razón visible para reservar directo. Este bloque es la respuesta.'
  },
  'home-reviews': {
    titulo: 'Prueba social con fuente (fix 1.2)',
    texto: 'El link "ver más reseñas" ya NO apunta a Viator — solo TripAdvisor y Facebook, para no regalar tráfico en plena decisión al canal que vende el mismo tour con Pay-Later y cupones.'
  },
  'tours-doble-funcion': {
    titulo: 'Doble función: /tours y disponibilidad (fix 1.3)',
    texto: 'Sin fecha = la página /tours (el listado que hoy no existe). Con fecha = resultados de disponibilidad, a donde lleva el buscador del hero, que antes no llevaba a ninguna parte.'
  },
  'ficha-widget': {
    titulo: 'El widget ES la página',
    texto: 'Widget sticky con el precio "desde" Light, consistente con el default del booking. El precio aparece en la primera pantalla — hoy está a 6 pantallas de scroll.'
  },
  'ficha-comparador': {
    titulo: 'Comparador anti-OTA dentro de la ficha (fix 1.6)',
    texto: 'Colocado exactamente donde ocurre la comparación real: quien duda entre reservar aquí o en Viator está mirando ESTE precio en ESTE momento.'
  },
  'ficha-menu': {
    titulo: 'Incluye + menú: el diferenciador estrella',
    texto: 'Fotos reales de platos, activo que ningún competidor tiene. Premium se lee como "+US$15" (delta), no como precio total.'
  },
  'booking-paso1': {
    titulo: 'Paso 1 — fix 1.1: sin bait-and-switch',
    texto: 'Light aparece marcado como "base" y se ve primero. Premium ya no es un segundo precio completo sino un delta explícito ("+US$15/pers"), y el resumen desglosa el upgrade línea por línea.'
  },
  'booking-sin-disponibilidad': {
    titulo: 'Estado sin disponibilidad (fix 1.5)',
    texto: 'Un mes lleno ya no termina en callejón sin salida: lista de espera por email + WhatsApp directo (a veces se abre un segundo barco).'
  },
  'booking-paso2': {
    titulo: 'Paso 2 — el paso que enamora',
    texto: 'La selección de menú pasa de modal rojo de error a tarjetas con foto por persona. El hotel se pide después del compromiso con la fecha.'
  },
  'booking-paso3': {
    titulo: 'Paso 3 — fix 1.7: pago exprés',
    texto: '4 campos + wallets (Apple Pay / Google Pay / PayPal) antes de la tarjeta. El depósito 25% sigue como opción por defecto con la cuenta hecha.'
  },
  'booking-gracias': {
    titulo: 'Paso 4 — gracias que trabaja',
    texto: 'No es un recibo: es la preparación del día. Timeline con el dato crítico en negrita — cuánto efectivo llevar.'
  },
  'mi-reserva': {
    titulo: 'Mi reserva (fix 1.4)',
    texto: 'Sostiene las promesas de "cambia tu menú" y "paga el saldo online" que el funnel ya hacía sin tener dónde cumplirlas. Sin cuenta ni contraseña — solo el código.'
  },
  'eventos-hub': {
    titulo: 'Eventos — el hub',
    texto: 'Bodas y MICE llevan a su landing propia; las otras 4 ocasiones abren el mismo formulario con el tipo pre-seleccionado.'
  },
  'reserva-directa': {
    titulo: 'Reserva directa — fuera del menú',
    texto: 'El argumento no es un destino. Vive como módulo en home + ficha + checkout, y como página de soporte solo para "ver comparación →" y el footer.'
  }
};

// ---------- Estado global de la reserva (en memoria, NO localStorage) ----------
var estadoReserva = {
  tour: null,
  fecha: null,      // 'YYYY-MM-DD'
  horarioIdx: null,
  personas: 2,
  paquete: 'light', // default LIGHT — anti bait-and-switch
  platos: [],       // un id de plato por persona
  hotel: null,
  horaRecogida: null,
  notaAdicional: '',
  pago: 'deposito', // 'deposito' | 'completo'
  datos: { nombre: '', apellido: '', email: '', telefono: '' },
  codigo: null,
  fechaConfirmada: null,
  comoNosConociste: null,
  mesCalendarioOffset: 0 // para navegar meses en el paso 1
};

var estadoBusquedaHero = { tourSlug: null, fecha: null, personas: 2 };

// ---------- Utilidades de datos ----------
function formatoDinero(n) {
  if (n === null || n === undefined) return '—';
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function generarCodigoReserva() {
  var hoy = new Date();
  var mm = String(hoy.getMonth() + 1).padStart(2, '0');
  var num = Math.floor(1000 + Math.random() * 8999);
  return 'HSP-' + mm + hoy.getDate() + '-' + num;
}
