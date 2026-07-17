// Página FAQ standalone (/faq) — mapea frequently-asked-questions.php de la
// web actual. Contenido portado VERBATIM de prototipo/datos.js
// (FAQ_CATEGORIAS): 6 categorías, 14 preguntas, ninguna inventada. La home
// tiene su propia curaduría de 6 preguntas (FAQ_HOME, data/home.ts) con un
// enlace "Ver todas las preguntas →" que trae aquí — este archivo es la
// versión completa, no un duplicado.
export type PreguntaFaq = { p: string; r: string }
export type CategoriaFaq = { id: string; nombre: string; preguntas: PreguntaFaq[] }

export const FAQ_CATEGORIAS: CategoriaFaq[] = [
  {
    id: 'reservas',
    nombre: 'Reservas y pagos',
    preguntas: [
      {
        p: '¿Puedo pagar solo una parte ahora?',
        r: 'Sí. Confirmas con el 25% y pagas el resto el día del tour, en efectivo (con 5% de descuento) o con tarjeta desde Mi Reserva.',
      },
      {
        p: '¿Qué pasa si cancelo?',
        r: 'Cancelación gratis hasta 7 días antes del tour. Después de esa fecha aplica la política de cancelación.',
      },
      {
        p: '¿Puedo cambiar la fecha?',
        r: 'Sí, escríbenos por WhatsApp con tu código de reserva y te ayudamos a reprogramar.',
      },
      {
        p: '¿Cuánto efectivo debo llevar?',
        r: 'Si elegiste depósito del 25%, el saldo restante — con 5% de descuento si pagas en efectivo a bordo.',
      },
    ],
  },
  {
    id: 'antes',
    nombre: 'Antes del tour',
    preguntas: [
      {
        p: '¿A qué hora me recogen?',
        r: 'Te confirmamos la hora exacta de recogida por WhatsApp la tarde anterior a tu tour.',
      },
      {
        p: '¿Qué debo llevar?',
        r: 'Traje de baño, toalla, protector solar biodegradable y el efectivo del saldo si aplica.',
      },
    ],
  },
  {
    id: 'abordo',
    nombre: 'A bordo',
    preguntas: [
      { p: '¿Hay baño a bordo?', r: 'Sí, todos nuestros barcos tienen baño.' },
      {
        p: '¿Puedo ir si no sé nadar?',
        r: 'Sí, el snorkel es en aguas poco profundas y con chaleco salvavidas disponible.',
      },
    ],
  },
  {
    id: 'comida',
    nombre: 'Comida',
    preguntas: [
      {
        p: '¿Puedo elegir mi plato?',
        r: 'Sí, cada persona elige su plato al reservar: Mariscos, Carne, Surf & Turf o Vegetariano.',
      },
      { p: '¿Puedo cambiar mi plato después de reservar?', r: 'Sí, desde Mi Reserva, hasta 24 horas antes del tour.' },
    ],
  },
  {
    id: 'clima',
    nombre: 'Clima y cancelaciones',
    preguntas: [
      { p: '¿Y si llueve el día de mi tour?', r: 'Reembolso total o cambio de fecha, sin costo.' },
      {
        p: '¿Se cancela por mar picado?',
        r: 'Solo si las condiciones no son seguras — en ese caso, reembolso total o reprogramación.',
      },
    ],
  },
  {
    id: 'ninos',
    nombre: 'Niños y accesibilidad',
    preguntas: [
      {
        p: '¿Los niños pueden ir en todos los tours?',
        r: 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos (18+).',
      },
      { p: '¿Tienen chalecos infantiles?', r: 'Sí, todas las tallas disponibles.' },
    ],
  },
]

export const FAQ_HERO = {
  eyebrow: 'Ayuda',
  titulo: 'Preguntas frecuentes',
  sub: '14 preguntas sobre reservas, pagos, comida, clima y niños. Si no está aquí, escríbenos por WhatsApp.',
  galeria: ['galeria-semi-privado-2', 'hero-catamaran-2'],
}
