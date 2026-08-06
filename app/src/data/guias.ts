// Página GUÍAS (/guias) — fuente única: TIPS_GUIAS, contenido REAL portado de
// tips-for-punta-cana-snorkeling-and-sailing.php?lang=es de la web actual
// (HTML descargado y leído línea a línea 2026-07-17). Son las 4 preguntas
// evergreen sobre esnórquel/arrecife, vela, mar y mariscos — limpiadas de
// relleno y de un typo del original ("aceite de olive") pero sin cambiar
// ningún hecho. Las otras 4 preguntas de esa página son protocolos COVID-19
// (testeo antes de viajar, mascarilla, transporte privado por la pandemia):
// decisión de Samuel 2026-07-17, quedan FUERA por obsoletas en un sitio
// relanzado en 2026.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-22, "Guías de Punta Cana - Ajustes web"
// .pdf en correcciones-v1-cliente/). El cliente entregó una maqueta: cada
// guía es una FILA con su foto al lado (foto/texto que ALTERNAN de lado), un
// eyebrow de categoría, la pregunta, una frase-resumen en negrita (`lead`),
// el cuerpo, un dato destacado (`stat`) y sus CTAs, cerrando con un bloque
// "Más guías en camino". El copy de esta versión (leads condensados, textos
// de stat y etiquetas de CTA) viene de ESA maqueta aprobada por el cliente —
// no inventado. Los `foto` son fotos reales del proyecto; los CTA apuntan a
// páginas reales (ficha del Snorkel Lovers, flota con el Maite en /nosotros,
// /#tours, cocina flotante en /nosotros). Antes de esto la página era una
// lista editorial de numeral+pregunta+respuesta sin fotos (rediseño
// 2026-07-17), que a su vez había sustituido a 4 cards apiladas.
export type StatGuia = {
  /** cifra o palabra destacada — p. ej. "≈100%", "50%", "Sin mareo" */
  valor: string
  /** glosa breve del dato */
  texto: string
}

export type CtaGuia = { texto: string; to: string }

export type TipGuia = {
  /** eyebrow de categoría de esta guía (Esnórquel, Seguridad…) */
  categoria: string
  pregunta: string
  /** frase-resumen en negrita, el gancho de la maqueta del cliente */
  lead: string
  /** cuerpo — prosa real portada de la web del cliente */
  respuesta: string
  /** id de foto real en /public/fotos (sin extensión) */
  foto: string
  fotoAlt: string
  /** pie editorial que va sobre la foto (nombre del barco / lugar) */
  fotoPie: string
  stat: StatGuia
  /** CTA principal (coral) — a una página real */
  ctaPrimario: CtaGuia
  /** enlace secundario opcional (texto) */
  ctaEnlace?: CtaGuia
}

export const TIPS_GUIAS: TipGuia[] = [
  {
    categoria: 'Esnórquel',
    pregunta: '¿Es Punta Cana una buena zona para hacer esnórquel?',
    lead: 'Para bucear puro, hay mejores sitios en el Caribe. Pero para ver tortugas, pocos lo superan.',
    respuesta:
      'Seamos honestos: muchas zonas de la costa atlántica se dañaron con los años, y Catalina o Bayahibe, en la costa sur, tienen mejor visibilidad. Aun así, en nuestro recorrido hay casi un 100% de posibilidades de ver tortugas desde el catamarán, gracias a los arrecifes artificiales que plantamos desde 2016 con la Fundación de Arrecifes Ecológicos de Bávaro — un proyecto que el Ministerio de Medio Ambiente califica entre los 3 mayores de jardinería de coral del país.',
    foto: 'galeria-snorkel-lovers-4',
    fotoAlt: 'Snorkelistas nadando sobre el arrecife junto al catamarán en Cabeza de Toro',
    fotoPie: 'Snorkel Lovers · arrecife de Cabeza de Toro',
    stat: { valor: '≈100%', texto: 'de nuestros recorridos ven tortugas · proyecto Top 3 de coral del país' },
    ctaPrimario: { texto: 'Ver el Snorkel Lovers', to: '/tours/snorkel-lovers' },
    ctaEnlace: { texto: 'La fundación completa', to: '/foundation' },
  },
  {
    categoria: 'Navegación a vela',
    pregunta: '¿Es la navegación a vela una opción en la zona de Bávaro?',
    lead: 'No es vela pura — navegamos a motor buena parte del recorrido. Y aun así, compensa.',
    respuesta:
      'La ruta va dentro del arrecife, en aguas poco profundas, y con la dirección del viento el catamarán usa motor al menos la mitad del tiempo. No son condiciones ideales para vela pura, pero el esnórquel, la duración del recorrido y la comida recién hecha a bordo compensan de sobra el tramo motorizado.',
    foto: 'flota-maite',
    fotoAlt: 'El velero Maite navegando con la vela desplegada al atardecer',
    fotoPie: 'Maite · el velero de nuestra flota',
    stat: { valor: '50%', texto: 'del trayecto a motor, por el viento y las aguas poco profundas' },
    ctaPrimario: { texto: 'Ver el Maite, nuestro velero', to: '/nosotros' },
  },
  {
    categoria: 'Seguridad',
    pregunta: '¿Las condiciones del mar en Punta Cana son seguras para el turismo acuático?',
    lead: 'Sí, muy seguro. El recorrido va dentro de una laguna protegida por el arrecife.',
    respuesta:
      'El lado atlántico de Punta Cana tiene aguas movidas, pero nuestra zona está cerca de Cabo Engaño, donde empieza el Mar Caribe. La barrera de coral protege la navegación, así que el viaje es tranquilo y no hacen falta pastillas para el mareo. Un plan seguro para toda la familia.',
    foto: 'hero-catamaran-2',
    fotoAlt: 'Catamarán navegando en aguas tranquilas dentro de la laguna del arrecife',
    fotoPie: 'Aguas protegidas cerca de Cabo Engaño',
    stat: { valor: 'Sin mareo', texto: 'aguas protegidas por la barrera de coral · plan familiar' },
    ctaPrimario: { texto: 'Ver nuestros tours', to: '/#tours' },
  },
  {
    categoria: 'Gastronomía',
    pregunta: '¿Punta Cana es un buen lugar para probar los mariscos?',
    lead: 'Sí — y de los pocos sitios con marisco recién capturado, no congelado.',
    respuesta:
      'La mayoría de hoteles y restaurantes usan marisco congelado e importado. El nuestro es capturado localmente y lo sazonamos con hierbas frescas y aceite de oliva justo frente a ti, en la cocina flotante — con todos los permisos y por encima de los requisitos de higiene del Ministerio de Medio Ambiente.',
    foto: 'plato-coctel-mariscos',
    fotoAlt: 'Cóctel de mariscos recién preparado a bordo en la cocina flotante',
    fotoPie: 'Marisco local, sazonado frente a ti',
    stat: { valor: 'Recién capturado', texto: 'local, no congelado ni importado · cocinado frente a ti' },
    ctaPrimario: { texto: 'Conoce la cocina flotante', to: '/nosotros' },
  },
]

// Bloque de cierre — "Más guías en camino" (maqueta del cliente, correcciones
// v1). El numeral "05" fantasma insinúa que la serie sigue.
export const GUIAS_CIERRE = {
  titulo: 'Más guías en camino',
  texto:
    'Seguimos respondiendo lo que de verdad importa antes de reservar: mejor época para viajar, qué llevar, ir con niños y más.',
  cta: { texto: 'See availability', to: '/#tours' },
}

export const GUIAS_HERO = {
  eyebrow: 'Guías',
  titulo: 'Guías de Punta Cana',
  sub: 'Lo que sabemos después de más de una década navegando esta costa — para que decidas con información real, no con marketing.',
  galeria: ['galeria-snorkel-lovers-4', 'galeria-semi-privado-2'],
}
