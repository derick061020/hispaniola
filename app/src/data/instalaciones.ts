// Página de Instalaciones (correcciones v2, plan 06) — 2026-07-27.
//
// El argumento de la página, en palabras del propio cliente: «Mucho más que una
// empresa de excursiones: un complejo completo en Punta Cana». Es una página de
// CREDIBILIDAD — enseña que detrás del tour hay laboratorio, museo, cocinas
// propias y oficinas. Cualquiera dice que restaura coral; tener laboratorio
// propio es verificable.
//
// ✅ EL COPY DE LAS 6 ZONAS ES REAL: lo escribió el cliente en su PowerPoint
// (slides 46-49). Es la parte más valiosa de esas slides y se usa tal cual.
// También son suyos los pies de los verticales («Así te recibimos», «Dentro
// del laboratorio», «La cocina en acción»…) y el copy de las bandas de CTA.
//
// ⚠️ LA MEDIA ES PLACEHOLDER. No hay ni una foto de las instalaciones en tierra
// en el repo. Decisión de Samuel (2026-07-27): la página se construye igual,
// con fotos y videos del propio repo, y se sustituyen cuando lleguen. Se
// marcan con `[placeholder-v2]`.
//
// [v2 2026-07-28, pedido de Samuel] DOS CAMBIOS QUE VIENEN DE AQUÍ:
//
//   1. FUERA EL AVISO DE «FOTOS DE EJEMPLO». Se pintaba una banda coral encima
//      de las zonas anunciando que las imágenes eran marcadores de posición, y
//      los `fotoAlt` decían literalmente «Placeholder — pendiente de la foto
//      real». Samuel: «eso se ve horrible y amateur, se sobreentiende que es
//      de ejemplo». El aviso al cliente va por fuera de la maqueta (ver la
//      lista de assets del plan 06), no impreso en la página. Los alt vuelven
//      a hacer su trabajo: DESCRIBIR lo que se ve en la foto, que además es
//      lo único honesto — cada alt de aquí cuenta la foto real que hay puesta,
//      sin atribuirla a una zona que no es.
//
//   2. CADA ZONA DEJA DE TENER *UNA* FOTO Y PASA A TENER UN MINI-BENTO
//      (slides 46-49): un vertical grande + dos celdas apiladas. Por eso los
//      campos `foto`/`fotoAlt` sueltos se sustituyen por `vertical` + `fotos[]`
//      — ver components/instalaciones/bento-zona.tsx.
//
// ⚠️ EL 360° NO SE FALSEA. Un botón «Ver en 360°» que abre una foto normal
// promete algo que no cumple — es justo el patrón que este proyecto ha evitado
// siempre. `tour360` va ausente hasta que exista el material: la celda del
// bento simplemente no se pinta y su sitio lo ocupa la 2ª foto, sin hueco
// muerto ni promesa falsa. En la reunión del 07-24 (29:48) el cliente los
// llamó «vídeo 360», lo que sugiere archivo de video y no foto equirectangular
// — pero sigue sin confirmarse si existen o hay que grabarlos.

/** Icono de la zona. La clave se resuelve a un icono en zonas-instalaciones.tsx. */
export type IconoZona = 'recibimiento' | 'museo' | 'biologia' | 'cocinas' | 'tienda' | 'oficinas'

export type FotoZona = {
  /** Nombre del archivo en /public/fotos, sin extensión. */
  src: string
  /** Describe LA FOTO QUE HAY, no la zona que representará algún día. */
  alt: string
}

export type VerticalZona = {
  /** [placeholder-v2] Video del repo. Los 6 verticales de verdad no existen. */
  video: string
  /** Póster del video: nombre en /public/fotos, sin extensión. */
  poster: string
  /** Pie de la card — copy del cliente (slides 46-49). */
  titulo: string
}

export type ZonaInstalacion = {
  id: string
  /** Etiqueta corta de la fila de chips (slide 46). */
  chip: string
  icono: IconoZona
  nombre: string
  /** Copy REAL del cliente. */
  descripcion: string
  /** Copy REAL del cliente. */
  bullets: string[]
  /** Celda grande del bento. */
  vertical: VerticalZona
  /** [placeholder-v2] Las 2 celdas apiladas del bento. */
  fotos: FotoZona[]
  /** Ausente a propósito: no existe el material. NO poner un placeholder aquí. */
  tour360?: string
}

export const INSTALACIONES = {
  eyebrow: 'Nuestras instalaciones',
  titulo: 'Conócenos por dentro',
  lead: 'Mucho más que una empresa de excursiones: un complejo completo en Punta Cana. Cocinas propias, laboratorio de biología marina, museo al aire libre, tienda y oficinas.',

  // Carril de verticales del slide 45 («Míralo en video · vertical»). Se
  // alimenta de las propias ZONAS (ver la derivación al final del archivo):
  // el carril y el bento enseñan EL MISMO video de cada zona, así que no hay
  // dos listas que mantener sincronizadas.
  videoEyebrow: 'En video',
  videoTitulo: 'Míralo por dentro',
  videoLead:
    'Un recorrido corto por cada zona del complejo, en vertical — como se ve desde el móvil.',

  seccionEyebrow: 'Un complejo, no solo un muelle',
  seccionTitulo: 'Todo lo que hay detrás de tu experiencia',
  seccionLead:
    'Cocinas propias, laboratorio de biología marina, museo al aire libre, tienda y oficinas. Recórrelo zona por zona, en video y en fotos.',
  /** Enlace discreto al pie de cada zona (slides 46-49). */
  zonaCta: 'Reserva tu tour',

  cierreEyebrow: 'Te esperamos en Punta Cana',
  cierreTitulo: 'Ven a conocernos en persona',
  cierreTexto:
    'Todo esto te espera antes y después de tu tour. Reserva tu día y descubre por qué somos mucho más que una excursión.',
  cierreCta: 'Reserva tu tour',
  // [v2 2026-07-28] Huéspedes en la orilla junto al catamarán: la llegada, que
  // es lo que promete el titular. Se eligió `events-5` primero (la cenital de la
  // flota fondeada decía mejor «el sitio») y hubo que descartarla — mide 368px
  // de ancho y bajo los overlays del banner se veía como un rectángulo navy
  // liso. Ver el aviso de tamaño en banda-instalaciones.tsx.
  //
  // Tampoco `footer-oceano`, que es la foto de mar más grande del proyecto: vive
  // dos bloques más abajo, en el propio footer, y las dos entrarían en cuadro de
  // una sola pasada.
  cierreFoto: 'hero-catamaran-1',
} as const

// Banda de CTA intercalada (slide 48). La maqueta pone TRES bandas a ancho
// completo entre las zonas — coral («¿Listo para vivir todo esto?»), verde
// («La cocina, el mar y la ciencia…») y navy («Ven a conocernos en persona»).
// Se quedan DOS: esta, a mitad de recorrido, y el cierre. Tres CTA idénticos
// en una página de 6 zonas es demasiado y los tres dicen lo mismo con distinto
// color de fondo; con dos, el descanso a mitad de página existe (que es lo que
// la maqueta busca) sin que la página se convierta en una escalera de botones.
// El copy es el de la banda verde, que es la única de las tres que dice algo
// propio de ESTA página en vez del genérico de reservar.
export const BANDA_INSTALACIONES = {
  /** Se intercala DESPUÉS de esta zona (a mitad de las 6). */
  trasZona: 'biologia',
  eyebrow: 'Todo en el mismo sitio',
  titulo: 'La cocina, el mar y la ciencia, en un solo día',
  texto: 'Ven a conocer el complejo en persona. Tu experiencia empieza aquí.',
  cta: 'Ver disponibilidad',
  /** Cenital de agua turquesa — el mar del que habla el titular. */
  foto: 'arrecife-fondo-cenital',
} as const

// ⚠️ [placeholder-v2] LOS VIDEOS DEL REPO, alternados entre las 6 zonas para
// que no se repita el mismo en dos zonas seguidas. Es el mismo trato que ya se
// da en data/tours.ts (`videoGaleria: '/video/hero.mp4'` en las 4 fichas): con
// los clips que hay, se reutilizan y se sustituyen cuando llegue el material.
//
// ⚠️ EL TERCER VIDEO DEL REPO (experiencia-presentadora.mp4) SE DESCARTA AQUÍ
// aunque encajaba de contenido en «Así te recibimos». Trae los SUBTÍTULOS
// INCRUSTADOS (vienen horneados desde el original de YouTube, no se pueden
// quitar sin re-editar — ver el comentario de EXPERIENCIA en data/home.ts), y
// recortado a 9:16 en la celda del bento esos subtítulos caen justo encima del
// pie de la card. En el popup de la home el video se ve entero y no molesta;
// aquí sí. No es un placeholder peor: es un placeholder que rompe la celda.
const V_OCEANO = { video: '/video/incluye-oceano-cenital.mp4', poster: 'incluye-oceano-poster' }
const V_CATAMARAN = { video: '/video/hero.mp4', poster: 'hero-video-poster' }

export const ZONAS: ZonaInstalacion[] = [
  {
    id: 'recibimiento',
    chip: 'Recibimiento',
    icono: 'recibimiento',
    nombre: 'Zona de recibimiento y presentación del tour',
    descripcion:
      'Te damos la bienvenida, hacemos el check-in y te explicamos el día antes de zarpar. Subes a bordo sabiendo exactamente qué te espera.',
    bullets: [
      'Bienvenida y check-in cómodo',
      'Explicación del tour antes de salir',
      'Zona de espera y baños',
    ],
    vertical: { ...V_CATAMARAN, titulo: 'Así te recibimos' },
    fotos: [
      // No `hero-catamaran-1` aunque sea la foto de llegada más clara del repo:
      // se la queda el banner de cierre de esta misma página (ver `cierreFoto`),
      // y a media pantalla de distancia se vería dos veces.
      {
        src: 'galeria-isla-saona-2',
        alt: 'Huéspedes embarcando en el catamarán desde la orilla',
      },
      {
        src: 'galeria-semi-privado-3',
        alt: 'Foto de grupo del pasaje al completo en la playa',
      },
    ],
  },
  {
    id: 'museo',
    chip: 'Museo',
    icono: 'museo',
    nombre: 'Museo exterior marino',
    descripcion:
      'Un museo al aire libre donde conocerás el ecosistema del arrecife y el trabajo de restauración de coral. Le da sentido a todo lo que verás bajo el agua.',
    bullets: [
      'Al aire libre, abierto a visitantes',
      'El ecosistema marino, explicado',
      'El proyecto de restauración de coral',
    ],
    vertical: { ...V_OCEANO, titulo: 'El museo marino' },
    fotos: [
      {
        src: 'galeria-snorkel-lovers-6',
        alt: 'Estructuras del vivero de coral bajo el agua, con una buceadora revisándolas',
      },
      {
        src: 'galeria-snorkel-lovers-10',
        alt: 'Un guía de Hispaniola explicando el vivero de coral a un grupo de niños',
      },
    ],
  },
  {
    id: 'biologia',
    chip: 'Departamento',
    icono: 'biologia',
    nombre: 'Departamento de biología',
    descripcion:
      'Nuestro laboratorio propio, donde los biólogos marinos cultivan coral y estudian el arrecife para la Fundación The Bávaro Reef. No es marketing: es trabajo real.',
    bullets: [
      'Laboratorio de cultivo de coral',
      'Biólogos marinos en plantilla',
      'Base de la Fundación The Bávaro Reef',
    ],
    vertical: { ...V_CATAMARAN, titulo: 'Dentro del laboratorio' },
    fotos: [
      {
        src: 'galeria-snorkel-lovers-9',
        alt: 'El equipo manipulando fragmentos de coral sobre la mesa de trabajo',
      },
      {
        src: 'galeria-semi-privado-1',
        alt: 'Visitantes alrededor del tanque de cultivo de coral',
      },
    ],
  },
  {
    id: 'cocinas',
    chip: 'Cocinas',
    icono: 'cocinas',
    nombre: 'Cocinas',
    descripcion:
      'Nuestras cocinas en tierra, donde preparamos y controlamos la calidad de todo lo que sube a bordo. De aquí sale lo que el chef cocina frente a ti.',
    bullets: [
      'Higiene y estándares certificados',
      'Producto fresco cada día',
      'Control de calidad antes de zarpar',
    ],
    vertical: { ...V_OCEANO, titulo: 'La cocina en acción' },
    fotos: [
      // ⚠️ NI cocina-flotante NI plato-mariscos, que eran los candidatos
      // obvios: la primera es la cocina A BORDO (otra cosa distinta de las
      // cocinas en tierra de esta zona) y encima ya protagoniza la franja
      // «Un día de mar» de esta misma página, así que se repetiría a dos
      // pantallas de distancia; el plato es un bodegón RECORTADO SOBRE BLANCO
      // y dentro de una celda del bento se lee como un hueco vacío, no como
      // una foto. Estas dos sí tienen fondo y cuentan preparación y servicio,
      // que es de lo que habla la zona.
      {
        src: 'mice-3',
        alt: 'Aperitivos preparados y alineados en la mesa de servicio antes de un evento',
      },
      {
        src: 'galeria-charter-privado-1',
        alt: 'Un miembro del equipo sirviendo el buffet a los huéspedes',
      },
    ],
  },
  {
    id: 'tienda',
    chip: 'Tienda',
    icono: 'tienda',
    nombre: 'Tienda de regalos',
    descripcion:
      'A la entrada del complejo, souvenirs, ropa y productos locales para que te lleves un pedacito de tu día en Hispaniola a casa.',
    bullets: [
      'Souvenirs y ropa de la marca',
      'Productos locales dominicanos',
      'A la entrada, fácil de visitar',
    ],
    vertical: { ...V_CATAMARAN, titulo: 'Un paseo por la tienda' },
    fotos: [
      {
        src: 'bar-flotante',
        alt: 'El bar flotante de Hispaniola con huéspedes alrededor',
      },
      {
        src: 'events-1',
        alt: 'Huéspedes brindando con cócteles de la casa dentro del agua',
      },
    ],
  },
  {
    id: 'oficinas',
    chip: 'Oficinas',
    icono: 'oficinas',
    nombre: 'Oficinas corporativas',
    descripcion:
      'El centro de operaciones desde donde coordinamos reservas, logística y equipo. Aquí trabaja la gente que te responde cuando escribes.',
    bullets: [
      'Coordinación de reservas y atención',
      'Logística y gestión del equipo',
      'El corazón administrativo de Hispaniola',
    ],
    vertical: { ...V_OCEANO, titulo: 'Un día en oficinas' },
    fotos: [
      {
        src: 'mice-2',
        alt: 'Personal de Hispaniola atendiendo a un grupo en el espacio cubierto del complejo',
      },
      {
        src: 'mice-1',
        alt: 'Equipo y huéspedes durante la preparación de un evento',
      },
    ],
  },
]

// El carril de verticales del slide 45, DERIVADO de las zonas: mismo video,
// mismo pie y misma foto de portada que la celda grande del bento de más
// abajo. Se deriva en vez de escribirse a mano para que no puedan divergir —
// el día que llegue el vertical real de una zona, se cambia en un solo sitio
// y el carril se entera solo.
//
// El póster de la card NO es el del video (`vertical.poster`) sino la 1ª foto
// de la zona: en el carril el video está parado (`preload: none`), así que lo
// que se ve es el póster, y los 3 videos del repo darían 3 portadas repetidas
// donde tiene que haber 6 zonas distintas. Es el mismo criterio que
// GaleriaMosaico, que usa `fotos[0]` como póster de su celda de video.
export const VERTICALES_INSTALACIONES = ZONAS.map((z) => ({
  id: z.id,
  titulo: z.vertical.titulo,
  foto: z.fotos[0]!.src,
  fotoAlt: z.fotos[0]!.alt,
  video: z.vertical.video,
}))
