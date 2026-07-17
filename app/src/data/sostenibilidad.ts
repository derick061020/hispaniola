// Página SOSTENIBILIDAD — combina las 2 páginas reales de la web actual
// (decisión de arquitectura, arquitectura-nueva.md §"Competitive Advantage":
// era un stub que se absorbe en Sostenibilidad). Copy portado y TRADUCIDO FIEL
// (mismo criterio que INCLUYE_CRUCERO en data/home.ts — el original está en
// inglés):
//   · hispaniolaaquaticadventures.com/sustainability.php   → intro + 3 pilares + cierre
//   · hispaniolaaquaticadventures.com/competitive-advantage.php → la frase + los 7 videos
//
// Los importes por huésped (US$ 3.50 / US$ 2.00) se portan tal cual del
// original — son un dato del cliente, no se inventan ni redondean.
//
// ⚠️ Foto de cabecera PROVISIONAL: la página vieja no tiene fotos de contenido
// (solo logo/iconos). Se usa una foto real de snorkel en el arrecife (la
// galería del Snorkel Lovers ES ese arrecife) — el coral, las tortugas y los
// manatíes los aportan los 7 videos. Pendiente pedir al cliente fotos propias
// de la fundación (mismo pendiente que eventos, app/PLAN-v3.md §9).

export type StatSost = {
  valor: string
  label: string
}

export type PilarSost = {
  /** ancla estable para deep-links / migaja interna */
  id: string
  titulo: string
  texto: string
  /** cifras destacadas del pilar (solo "operación") — se muestran aparte del párrafo, como highlight editorial */
  stats?: StatSost[]
}

export type VideoSost = {
  /** id de YouTube — también el nombre del póster en /video/sostenibilidad */
  id: string
  titulo: string
}

// Los 7 videos de competitive-advantage.php, en su mismo orden. El póster de
// cada uno se descargó de YouTube a /public/video/sostenibilidad/{id}.jpg (sin
// hotlink externo); el embed solo se carga al abrir el modal.
export const VIDEOS_SOSTENIBILIDAD: VideoSost[] = [
  { id: '6ixzXs68DPQ', titulo: 'Laboratorio y museo de restauración de coral' },
  { id: 'r0XFksQSfrU', titulo: 'Nuestra cocina flotante' },
  { id: 'ziUx_05VC-4', titulo: 'Donde empieza la comida' },
  { id: 'KdGvJqdeaC0', titulo: 'Snorkel en el arrecife de coral' },
  { id: 'sjyNxW6iNIs', titulo: 'Restaurando los arrecifes de coral' },
  { id: 'GXA4y8JQ2v8', titulo: 'Protegiendo las tortugas marinas' },
  { id: 'aMVg2cL3Z8o', titulo: 'Avistamiento de manatíes' },
]

export const SOSTENIBILIDAD = {
  eyebrow: 'Sostenibilidad',
  titulo: 'La sostenibilidad en el centro de nuestra misión',
  // Hero corto a propósito (rediseño 2026-07-17, pedido de Samuel: "el texto
  // de la descripción del hero está muy largo") — la declaración completa
  // (Bávaro Reefs Foundation, "empoderar a nuestra gente", RD) no se pierde:
  // se muda a `mision`, el bloque editorial grande que abre PilaresSostenibilidad.
  sub: 'No es un añadido: es la base de cómo operamos, en el mar y en tierra.',
  misionEyebrow: 'Nuestra misión',
  mision: 'En Hispaniola Aquatic Adventures protegemos los ecosistemas de los que dependemos, empoderamos a nuestra gente y dejamos una huella positiva en cada lugar donde operamos — a través de la Bávaro Reefs Foundation, la organización sin fines de lucro que sostiene esta misión en la República Dominicana.',
  // PLAN-INTERNAS-V2.md: fotos del hero-interna (fundido, no foto fija) — las
  // mismas 3 del arrecife/vivero de coral que ya usa la home en Experiencia,
  // reales y ya curadas, no nuevas.
  galeria: ['galeria-snorkel-lovers-3', 'galeria-semi-privado-1', 'galeria-snorkel-lovers-6'],
  fotoAlt: 'Buceo de snorkel sobre el arrecife de coral que la fundación restaura',

  pilaresTitulo: 'Cómo lo hacemos realidad',
  pilares: [
    {
      id: 'conservacion',
      titulo: 'Conservación y áreas protegidas',
      texto: 'Con aportes económicos directos y colaboración activa, apoyamos a la Bávaro Reefs Foundation en hitos ambientales reales: la creación y ampliación de áreas marinas protegidas, la recuperación y el monitoreo de la tortuga verde en la República Dominicana, y la restauración de coral en Coral Garden, hoy uno de los sitios de restauración de arrecife más efectivos del país.',
    },
    {
      id: 'comunidades',
      titulo: 'Apoyo directo a las comunidades',
      texto: 'Sostenibilidad también es cuidar a las personas. Más allá de la acción ambiental, apoyamos de forma activa a un orfanato local, contribuyendo al bienestar y desarrollo de niños vulnerables de nuestra comunidad. Para nosotros, la protección del medioambiente y la responsabilidad social van de la mano.',
    },
    {
      id: 'operacion',
      titulo: 'Operación responsable y valor del equipo',
      // Detalle portado del original (sustainability.php: "a percentage is
      // also allocated to our office and sales teams") — faltaba en la 1ª
      // versión de este copy; los montos exactos ($3.50/$2.00) se muestran
      // aparte, en `stats`.
      texto: 'La sostenibilidad empieza por dentro: invertimos en nuestro equipo con salario justo, formación continua y altos estándares de seguridad, para que cada experiencia refleje nuestra misión. Un porcentaje adicional se destina a los equipos de oficina y ventas, la base de un servicio impecable en cada reserva.',
      stats: [
        { valor: 'US$ 3.50', label: 'por huésped, directo a nuestro equipo operativo' },
        { valor: 'US$ 2.00', label: 'por huésped, a las iniciativas de la fundación' },
      ],
    },
  ] satisfies PilarSost[],

  videosEyebrow: 'Nuestra ventaja competitiva',
  videosTitulo: 'Lo que nos diferencia, en video',
  videosTexto: 'Una serie de videos cortos que muestran los factores clave que nos distinguen de otras empresas que ofrecen servicios similares en la zona.',

  cierreTitulo: 'Dejar una huella positiva',
  cierreTexto: 'Todo negocio deja una huella allí donde opera. La nuestra queremos que sea positiva: de la conservación marina y el trabajo comunitario a la operación ética y el desarrollo de nuestro equipo. A través de la Bávaro Reefs Foundation contribuimos no solo a experiencias inolvidables en el mar, sino a arrecifes más sanos, comunidades más fuertes y un futuro más sostenible para la República Dominicana.',
  // Foto de fondo del cierre (2026-07-17, pedido de Samuel: "ponle el mismo
  // background de fondo del mar que tiene el banner de nosotros"). Mismo
  // asset que /nosotros (ArrecifeTeaser) y el mismo idioma visual — foto
  // cenital turquesa + gradiente navy encima, texto blanco a la izquierda.
  // Sin CTA: el "Ver disponibilidad" canónico vive en el Footer Océano,
  // justo debajo — duplicarlo aquí serían dos botones pegados.
  cierreFoto: 'arrecife-fondo-cenital',
}
