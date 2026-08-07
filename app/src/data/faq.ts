// Página FAQ standalone (/faq) — mapea frequently-asked-questions.php de la
// web actual. Contenido portado VERBATIM de prototipo/datos.js
// (FAQ_CATEGORIAS): 6 categorías, 14 preguntas, ninguna inventada. La home
// tiene su propia curaduría (FAQ_HOME, data/home.ts) con un enlace "Ver todas
// las preguntas →" que trae aquí — este archivo es la versión completa, no un
// duplicado.
//
// 2026-07-22: 17 preguntas. Las 3 nuevas (tarjeta/pago en el hotel, dónde y a
// qué hora es la salida, embarazadas y personas mayores) llegaron con la
// maqueta de la FAQ de la home ampliada a 12 — se replican aquí para que
// «ver todas» siga siendo un SUPERCONJUNTO de la home y no al revés. Su
// procedencia (y el ⚠️ pendiente de la de embarazadas, que no tiene política
// del cliente detrás) está documentada en FAQ_HOME, data/home.ts.
export type PreguntaFaq = { p: string; r: string }
export type CategoriaFaq = { id: string; nombre: string; preguntas: PreguntaFaq[] }

export const FAQ_CATEGORIAS: CategoriaFaq[] = [
  {
    id: 'reservas',
    nombre: 'Bookings & payments',
    preguntas: [
      {
        p: 'Can I pay only part of it now?',
        r: 'Yes. You confirm with 25% and pay the rest on the day of the tour, in cash (with a 5% discount) or by card from My Booking.',
      },
      {
        p: 'What happens if I cancel?',
        r: 'Free cancellation up to 7 days before the tour. After that date, the cancellation policy applies.',
      },
      {
        p: 'Can I change the date?',
        r: 'Yes, message us on WhatsApp with your booking code and we’ll help you reschedule.',
      },
      {
        p: 'How much cash should I bring?',
        r: 'If you chose the 25% deposit, the remaining balance — with a 5% discount if you pay in cash on board.',
      },
      {
        p: 'Do you accept cards? Can I pay at the hotel?',
        r: 'We accept Visa, Mastercard, American Express and PayPal from My Booking. You can also pay the balance on the day of the tour, in cash, with a 5% discount.',
      },
    ],
  },
  {
    id: 'antes',
    nombre: 'Before the tour',
    preguntas: [
      {
        p: 'What time will you pick me up?',
        r: 'We confirm the exact pickup time by WhatsApp the afternoon before your tour.',
      },
      {
        p: 'What should I bring?',
        r: 'Swimsuit, towel, biodegradable sunscreen and the cash for the balance if it applies.',
      },
      {
        p: 'Where and at what time does the tour depart?',
        r: 'We confirm the exact pickup time by WhatsApp the afternoon before your tour. Except on charters with their own meeting point, we pick you up at your hotel.',
      },
    ],
  },
  {
    id: 'abordo',
    nombre: 'On board',
    preguntas: [
      { p: 'Is there a restroom on board?', r: 'Yes, every one of our boats has a restroom.' },
      {
        p: 'Can I come if I cannot swim?',
        r: 'Yes — the snorkeling is in shallow water and life jackets are available.',
      },
    ],
  },
  {
    id: 'comida',
    nombre: 'Food',
    preguntas: [
      {
        p: 'Can I choose my dish?',
        r: 'Yes, each guest chooses their dish when booking: Seafood, Meat, Surf & Turf or Vegetarian.',
      },
      { p: 'Can I change my dish after booking?', r: 'Yes, from My Booking, up to 24 hours before the tour.' },
    ],
  },
  {
    id: 'clima',
    nombre: 'Weather & cancellations',
    preguntas: [
      { p: 'What if it rains on the day of my tour?', r: 'Full refund or a date change, at no cost.' },
      {
        p: 'Do you cancel for rough seas?',
        r: 'Only if conditions are not safe — in that case, a full refund or a reschedule.',
      },
    ],
  },
  {
    id: 'ninos',
    nombre: 'Children & accessibility',
    preguntas: [
      {
        p: 'Can children come on every tour?',
        r: 'On Snorkel Lovers yes; Semi-Private Premium is adults only (18+).',
      },
      { p: 'Do you have child life jackets?', r: 'Yes, in every size.' },
      {
        p: 'Is it suitable for pregnant women or older guests?',
        r: 'It depends on the tour and on how the sea is that day. Message us on WhatsApp before booking and we’ll tell you which one suits you.',
      },
    ],
  },
]

export const FAQ_HERO = {
  eyebrow: 'Help',
  titulo: 'Frequently asked questions',
  sub: '17 questions about bookings, payments, food, weather and children. If it’s not here, message us on WhatsApp.',
  galeria: ['galeria-semi-privado-2', 'hero-catamaran-2'],
}
