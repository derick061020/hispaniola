// Página LA FUNDACIÓN (/fundacion) — correcciones v2 del cliente, plan 08
// §3-§5 (slides 62-64 de «Presentación CAMBIOS 2.0.pdf»).
//
// El contenido es REAL y NUEVO del cliente: los dos cofundadores, 2016, el
// convenio con el Ministerio de Medio Ambiente y el reconocimiento como
// tercer vivero de coral del país. Eso explica de dónde sale el «proyecto
// top-3 del país» que arrecife-teaser.tsx ya afirmaba sin justificar.
//
// [v2 2026-07-28] Estos datos VIVÍAN dentro de pages/fundacion.tsx. Salen a
// data/ porque ahora tienen DOS consumidores: la página y el teaser de
// /ventaja-competitiva (sostenibilidad/fundacion-teaser.tsx) — el mismo
// patrón de límite entre páginas que la flota en /nosotros: una página cuenta
// la historia completa, la otra la menciona y enlaza, y el copy no se duplica
// a mano en dos sitios.
//
// ⚠️ Pendiente de confirmar con el cliente: el NOMBRE de la entidad. Hoy
// conviven CUATRO en sus materiales — «Fundación Ecológica Arrecifes de
// Bávaro», «Bávaro Reefs Foundation», «Fundación The Bávaro Reef» y
// «Fundación» a secas. Aquí se usa el nombre legal en español para el bloque
// institucional; hay que fijar un alias corto para el resto del sitio.
//
// ⚠️ Pendiente: confirmar los nombres de los dos cofundadores antes de
// publicarlos. «Fernando Sánchez Fernández» es muy probablemente el mismo
// Fernando que manda estas correcciones, pero publicar el nombre completo de
// una persona real pide una confirmación explícita.
//
// ⚠️ Pendiente desde la v1: no hay ni una foto propia de la fundación en todo
// el proyecto (ni del vivero, ni de las jornadas de limpieza, ni del
// orfanato). Por eso ni esta página ni el teaser llevan imagen — antes que
// ilustrar con una foto de snorkel que no cuenta lo que dice el texto.

export const FUNDACION = {
  nombreLegal: 'Fundación Ecológica Arrecifes de Bávaro',
  historia: [
    'Nace de la pasión compartida por el medio ambiente de Fernando Sánchez Fernández y Manuel Alejandro Redondo, con el respaldo de Hispaniola Aquatic Adventures, cuya operación en Playa Bávaro fue testigo del deterioro de los ecosistemas marinos por el crecimiento del turismo.',
    'Ante la alarmante pérdida de arrecifes, en 2016 se inició un ambicioso proyecto de restauración coralina y construcción de arrecifes artificiales, en colaboración con el Ministerio de Medio Ambiente — hoy reconocido como el tercer vivero de coral más importante del país.',
  ],
  hitos: [
    { cifra: '2016', texto: 'inicio del proyecto' },
    { cifra: '3er', texto: 'vivero de coral del país' },
    { cifra: 'Aliados', texto: 'Ministerio de Medio Ambiente' },
  ],
  // Slide 62, tarjeta «LOS FUNDADORES». La empresa va en la misma lista que
  // las dos personas porque así lo dice su maqueta y porque es exacto: la
  // fundación la sostienen tres partes, dos personas y una empresa.
  fundadores: [
    { nombre: 'Fernando Sánchez Fernández', rol: 'Cofundador' },
    { nombre: 'Manuel Alejandro Redondo', rol: 'Cofundador' },
    { nombre: 'Hispaniola Aquatic Adventures', rol: 'Empresa que respalda la fundación' },
  ],

  proyectosEyebrow: 'Proyectos sostenibles',
  proyectosTitulo: 'Cuidar los arrecifes empieza con las personas',
  proyectosLead:
    'Impulsamos acciones que conectan a la comunidad con la conservación: educación, voluntariado y experiencias reales que transforman conciencia en impacto.',
  proyectoDestacado: {
    titulo: 'Arrecifes artificiales',
    texto:
      'Crear las condiciones ecológicas necesarias para la restauración y el desarrollo de arrecifes coralinos, a través de la vigilancia y protección ambiental.',
  },
  proyectos: [
    {
      titulo: 'Restaurar la cobertura viva de coral',
      texto:
        'Rescate de fragmentos de oportunidad, trasplante desde viveros y siembra por fragmentación in-situ en puntos importantes.',
    },
    {
      titulo: 'Aumentar especies clave',
      texto:
        'Recuperar poblaciones ecológicamente importantes: peces loro, langostas, capitanes, pargos y otras.',
    },
    {
      titulo: 'Saneamiento del área',
      texto:
        'Programa de limpieza de Bávaro/Punta Cana con jornadas de recolección de residuos sólidos.',
    },
    {
      titulo: 'Alternativas para pescadores',
      texto:
        'Métodos de pesca sustentables que resuelven conflictos comunitarios y los integran a la conservación.',
    },
    {
      titulo: 'Fomentar el ecoturismo',
      texto:
        'Actividades y campañas de educación ambiental con clientes, centros educativos y comerciantes de la zona.',
    },
  ],

  // Slide 64, banda verde. El botón lleva a /contacto y no a una página de
  // membresías porque esa página no existe: no hay niveles definidos, ni
  // precios, ni pasarela de cobro (mismo bloqueo Odoo que el resto de pagos).
  // Recoger interés real desde el primer día es preferible a prometer un
  // flujo que no está.
  membresiasTitulo: 'Conoce nuestras membresías',
  membresiasTexto:
    'Cada aporte cuenta. Al unirte, apoyas iniciativas que protegen nuestros ecosistemas y educan a futuras generaciones.',
  membresiasCta: 'Quiero apoyar la fundación',

  // ---------- Copy exclusivo del TEASER en /ventaja-competitiva ----------
  // Slide 62 condensado a un bloque. No repite la historia entera: da el
  // nombre, quién está detrás y los 3 hitos, y manda a la página.
  teaserEyebrow: 'Nuestra fundación',
  teaserTexto:
    'Detrás de cada tour hay una fundación con nombre propio: la que en 2016 arrancó la restauración coralina en Playa Bávaro junto al Ministerio de Medio Ambiente, hoy el tercer vivero de coral más importante del país.',
  teaserCta: 'Conoce la Fundación',
} as const
