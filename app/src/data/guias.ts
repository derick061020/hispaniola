// Página GUÍAS (/guias) — mapea tips-for-punta-cana-....php de la web actual:
// de página suelta a índice de blog (arquitectura-nueva.md §2, motor SEO que
// hoy no existe). Dos fuentes reales, ninguna inventada:
// 1) TIPS_GUIAS: contenido REAL de esa misma página vieja (versión ?lang=es,
//    HTML descargado y leído línea a línea 2026-07-17), las 4 preguntas
//    evergreen sobre esnórquel/arrecife, vela, mar y mariscos — limpiadas de
//    relleno y de un typo del original ("aceite de olive") pero sin cambiar
//    ningún hecho. Las otras 4 preguntas de esa página son protocolos
//    COVID-19 (testeo antes de viajar, mascarilla, transporte privado por la
//    pandemia): decisión de Samuel 2026-07-17, quedan FUERA por obsoletas en
//    un sitio relanzado en 2026.
// 2) GUIAS: portado VERBATIM de prototipo/datos.js — 5 títulos + resúmenes de
//    artículos futuros, ninguno con cuerpo todavía.
//
// ⚠️ GUIAS es solo índice — el prototipo únicamente tiene título + resumen +
// tiempo de lectura por artículo, no el cuerpo del texto. Redactar 5
// artículos completos sería inventar contenido que nadie ha escrito ni
// aprobado ("contenido jamás inventado", CLAUDE.md). Cuando el cliente/Samuel
// tenga el copy real de cada artículo, cada entrada gana su página propia
// (/guias/:slug) con la misma plantilla que tours/eventos.
export type TipGuia = {
  pregunta: string
  respuesta: string
  /** solo 2 de las 4 preguntas enlazan a una página interna real que amplía el tema */
  enlace?: { texto: string; to: string }
}

export const TIPS_GUIAS: TipGuia[] = [
  {
    pregunta: '¿Es Punta Cana una buena zona para hacer esnórquel?',
    respuesta:
      'En general, la República Dominicana —incluida Punta Cana— no tiene las mejores áreas para bucear del Caribe. Si has estado en las Islas Vírgenes o en Turcas y Caicos, es probable que la vista te decepcione un poco: muchas zonas de la costa atlántica se han visto dañadas con los años por el buceo y la pesca. Catalina o Bayahibe, en la costa sur frente al Mar Caribe, son mejores zonas para esnórquel. Aun así, en nuestro recorrido hay casi un 100% de posibilidades de ver tortugas desde el catamarán: la Fundación de Arrecifes Ecológicos de Bávaro —fundada y administrada por Hispaniola Aquatic Adventures— planta y construye arrecifes artificiales desde 2016 para restaurar el hábitat marino, y el Ministerio de Medio Ambiente ha calificado el proyecto como uno de los 3 mayores de jardinería de coral del país.',
    enlace: { texto: 'La fundación completa →', to: '/sostenibilidad' },
  },
  {
    pregunta: '¿Es la navegación a vela una opción en la zona de Bávaro?',
    respuesta:
      'El área del recorrido está dentro del arrecife, lo que significa aguas poco profundas. Por eso, y por la dirección del viento, el catamarán navega a motor durante al menos el 50% del tiempo. No son condiciones ideales para vela pura, pero el esnórquel, la duración del recorrido y la comida preparada a bordo compensan el tramo motorizado.',
  },
  {
    pregunta: '¿Las condiciones del mar en Punta Cana son seguras para el turismo acuático?',
    respuesta:
      'Muchas zonas de Punta Cana y Bávaro, al estar en el lado atlántico, tienen aguas turbulentas por la dirección de la corriente. Nuestra zona de tour está cerca de Cabo Engaño, donde empieza el Mar Caribe, y el recorrido se hace dentro de una laguna de arrecife: la navegación queda protegida por la barrera de coral, así que el viaje es tranquilo y no hacen falta pastillas para el mareo. Un plan seguro para toda la familia.',
  },
  {
    pregunta: '¿Punta Cana es un buen lugar para probar los mariscos?',
    respuesta:
      'La mayoría de restaurantes y hoteles mantienen su marisco congelado, porque es importado. En nuestros tours es recién capturado localmente, y lo sazonamos con hierbas frescas y aceite de oliva justo frente a ti, en la cocina flotante — la plataforma tiene todos los permisos y supera los requisitos de higiene del Ministerio de Medio Ambiente.',
    enlace: { texto: 'Conoce la cocina flotante →', to: '/nosotros' },
  },
]

export type Guia = {
  slug: string
  titulo: string
  resumen: string
  /** solo el artículo portado de la web actual trae tiempo de lectura */
  lectura?: string
  destacado?: boolean
}

export const GUIAS: Guia[] = [
  {
    slug: 'como-elegir-tour',
    titulo: 'Cómo elegir tour de catamarán en Punta Cana (y no acabar en un party boat de 200)',
    resumen: 'La guía honesta: qué preguntar, qué señales de alarma, qué está incluido de verdad.',
    lectura: '6 min de lectura',
    destacado: true,
  },
  {
    slug: 'que-llevar',
    titulo: 'Qué llevar a un tour de snorkel',
    resumen: 'Protector biodegradable, efectivo, y las 3 cosas que todos olvidan.',
  },
  {
    slug: 'mejor-epoca',
    titulo: 'Mejor época para navegar en Punta Cana',
    resumen: 'Mes a mes: mar, lluvia, veda de langosta.',
  },
  {
    slug: 'saona-o-cabeza-de-toro',
    titulo: 'Saona, Cabeza de Toro o piscina natural',
    resumen: 'Qué verás en cada una y cuál te conviene.',
  },
  {
    slug: 'snorkel-primera-vez',
    titulo: 'Snorkel por primera vez: no hace falta saber nadar',
    resumen: 'Cómo lo hacemos con principiantes.',
  },
]

export const GUIAS_HERO = {
  eyebrow: 'Guías',
  titulo: 'Guías de Punta Cana',
  sub: 'Lo que sabemos después de más de una década navegando esta costa — para que decidas con información real, no con marketing.',
  galeria: ['galeria-snorkel-lovers-4', 'galeria-semi-privado-2'],
}
