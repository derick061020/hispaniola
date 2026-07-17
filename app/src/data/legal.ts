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

const PLACEHOLDER = 'Pendiente de redacción con asesoría legal.'

export const LEGAL: Record<string, DocumentoLegal> = {
  'politica-de-cancelacion': {
    slug: 'politica-de-cancelacion',
    nombre: 'Política de cancelación',
    actualizado: '17 de julio de 2026',
    contenidoReal: true,
    intro:
      'Estos son los mismos términos que ya ves en cada tour y en la sección de preguntas frecuentes, reunidos aquí en una sola página.',
    secciones: [
      {
        titulo: 'Cancelación por tu parte',
        texto:
          'Cancelación gratuita hasta 7 días antes de la fecha del tour, con reembolso total del depósito. Cancelaciones dentro de los 7 días previos no son reembolsables, salvo que se reprograme la fecha (sujeto a disponibilidad).',
      },
      {
        titulo: 'Cancelación por clima',
        texto:
          'Si el tour se cancela por lluvia o mar picado (a criterio del capitán, por seguridad), ofrecemos reembolso total o cambio de fecha sin costo — nunca la pérdida del depósito.',
      },
      {
        titulo: 'Cambios de fecha',
        texto:
          'Puedes reprogramar escribiéndonos por WhatsApp con tu código de reserva. Sujeto a disponibilidad del nuevo horario.',
      },
      {
        titulo: 'Depósito y saldo',
        texto:
          'Confirmas tu reserva con un depósito del 25%. El saldo se paga el día del tour: en efectivo (5% de descuento) o con tarjeta desde Mi Reserva.',
      },
      {
        titulo: 'Cambios de menú',
        texto: 'Puedes cambiar el plato elegido por persona desde Mi Reserva hasta 24 horas antes del tour.',
      },
    ],
  },
  privacidad: {
    slug: 'privacidad',
    nombre: 'Política de privacidad',
    actualizado: '17 de julio de 2026',
    contenidoReal: false,
    intro:
      'Hispaniola Aquatic Adventures (Events & Entertainment Punta Cana LLC) respeta tu privacidad. Esta página describe, en términos generales, qué apartados debe cubrir esta política antes del lanzamiento.',
    secciones: [
      { titulo: 'Qué datos recopilamos', texto: PLACEHOLDER },
      { titulo: 'Para qué los usamos', texto: PLACEHOLDER },
      { titulo: 'Con quién los compartimos', texto: PLACEHOLDER },
      { titulo: 'Tus derechos', texto: PLACEHOLDER },
      { titulo: 'Contacto', texto: PLACEHOLDER },
    ],
  },
  terminos: {
    slug: 'terminos',
    nombre: 'Términos y condiciones',
    actualizado: '17 de julio de 2026',
    contenidoReal: false,
    intro: 'Condiciones de uso del sitio y de compra de tours. Estructura de referencia — pendiente de redacción legal.',
    secciones: [
      { titulo: 'Aceptación de los términos', texto: PLACEHOLDER },
      { titulo: 'Reservas y pagos', texto: PLACEHOLDER },
      { titulo: 'Responsabilidad y seguridad a bordo', texto: PLACEHOLDER },
      { titulo: 'Ley aplicable y jurisdicción', texto: PLACEHOLDER },
    ],
  },
  cookies: {
    slug: 'cookies',
    nombre: 'Política de cookies',
    actualizado: '17 de julio de 2026',
    contenidoReal: false,
    intro:
      'Hoy el sitio no usa cookies de analítica ni publicidad (PLAN-LANZAMIENTO.md Bloque G, sin implementar aún). Esta página se completa cuando eso cambie.',
    secciones: [
      { titulo: 'Qué son las cookies', texto: PLACEHOLDER },
      { titulo: 'Cookies que usamos', texto: PLACEHOLDER },
      { titulo: 'Cómo desactivarlas', texto: PLACEHOLDER },
    ],
  },
}
