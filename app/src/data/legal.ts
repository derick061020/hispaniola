// Páginas legales (PLAN-LANZAMIENTO.md Bloque F) — la web actual NO tiene
// ninguna (verificado en mapa-del-sitio.md: las 17 páginas inventariadas no
// incluyen privacidad/términos/cookies). UNA plantilla data-driven
// (/legal/:slug), igual que tours/eventos: en Figma, una página con frames de
// variante.
//
// ⚠️ Política de cancelación: contenido REAL, compuesto a partir de hechos ya
// usados y vetados en el resto del sitio (FAQ_CATEGORIAS, BENEFICIOS_DIRECTO,
// FAQ de cada tour) — no se inventa ningún término nuevo.
//
// ⚠️ Privacidad / Términos / Cookies: aquí NO hay contenido real que portar —
// ninguna fuente (web actual, prototipo, datos.js) tiene este texto, y
// redactar cláusulas legales completas (responsabilidad, jurisdicción, RGPD…)
// sería fabricar un documento vinculante que nadie ha revisado. Se deja la
// ESTRUCTURA real (empresa, apartados esperables) con el cuerpo marcado
// honestamente como pendiente de un abogado — mismo principio que "contenido
// jamás inventado", aplicado a la categoría de copy con más riesgo real del
// sitio. Avisar a Samuel/Derick antes de lanzar con esto tal cual.
export type SeccionLegal = { titulo: string; texto: string }

export type DocumentoLegal = {
  slug: string
  nombre: string
  actualizado: string
  intro: string
  secciones: SeccionLegal[]
  /** true = el cuerpo es contenido real; false = placeholder pendiente de asesoría legal */
  contenidoReal: boolean
}

const PLACEHOLDER = 'To be drafted with legal counsel.'

export const LEGAL: Record<string, DocumentoLegal> = {
  'cancellation-policy': {
    slug: 'cancellation-policy',
    nombre: 'Cancellation Policy',
    actualizado: 'July 17, 2026',
    contenidoReal: true,
    intro:
      'These are the same terms you already see on every tour and in the frequently asked questions, gathered here on a single page.',
    secciones: [
      {
        titulo: 'Cancellation by you',
        texto:
          'Free cancellation up to 7 days before the tour date, with a full refund of the deposit. Cancellations within the 7 days before the tour are non-refundable, unless the date is rescheduled (subject to availability).',
      },
      {
        titulo: 'Cancellation due to weather',
        texto:
          'If the tour is canceled because of rain or rough seas (at the captain’s discretion, for safety), we offer a full refund or a date change at no cost — never the loss of the deposit.',
      },
      {
        titulo: 'Date changes',
        texto:
          'You can reschedule by messaging us on WhatsApp with your booking code. Subject to availability of the new time.',
      },
      {
        titulo: 'Deposit and balance',
        texto:
          'You confirm your booking with a 25% deposit. The balance is paid on the day of the tour: in cash (5% discount) or by card from My Booking.',
      },
      {
        titulo: 'Menu changes',
        texto: 'You can change the dish chosen for each guest from My Booking up to 24 hours before the tour.',
      },
    ],
  },
  privacy: {
    slug: 'privacy',
    nombre: 'Privacy Policy',
    actualizado: 'July 17, 2026',
    contenidoReal: false,
    intro:
      'Hispaniola Aquatic Adventures (Events & Entertainment Punta Cana LLC) respects your privacy. This page describes, in general terms, which sections this policy must cover before launch.',
    secciones: [
      { titulo: 'What data we collect', texto: PLACEHOLDER },
      { titulo: 'What we use it for', texto: PLACEHOLDER },
      { titulo: 'Who we share it with', texto: PLACEHOLDER },
      { titulo: 'Your rights', texto: PLACEHOLDER },
      { titulo: 'Contact', texto: PLACEHOLDER },
    ],
  },
  terms: {
    slug: 'terms',
    nombre: 'Terms and Conditions',
    actualizado: 'July 17, 2026',
    contenidoReal: false,
    intro: 'Conditions for using the site and for purchasing tours. Reference structure — pending legal drafting.',
    secciones: [
      { titulo: 'Acceptance of the terms', texto: PLACEHOLDER },
      { titulo: 'Bookings and payments', texto: PLACEHOLDER },
      { titulo: 'Liability and safety on board', texto: PLACEHOLDER },
      { titulo: 'Governing law and jurisdiction', texto: PLACEHOLDER },
    ],
  },
  cookies: {
    slug: 'cookies',
    nombre: 'Cookie Policy',
    actualizado: 'July 17, 2026',
    contenidoReal: false,
    intro:
      'Today the site uses no analytics or advertising cookies (PLAN-LANZAMIENTO.md Bloque G, not implemented yet). This page will be completed when that changes.',
    secciones: [
      { titulo: 'What cookies are', texto: PLACEHOLDER },
      { titulo: 'Cookies we use', texto: PLACEHOLDER },
      { titulo: 'How to disable them', texto: PLACEHOLDER },
    ],
  },
}
