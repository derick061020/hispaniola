// BLOG (/blog) — página NUEVA de las correcciones v1 del cliente
// (2026-07-20, planes/06-blog.md). No existía nada de esto en el proyecto.
//
// ⚠️ ALCANCE, Y POR QUÉ ES ASÍ. El cliente mandó la maqueta de un blog con
// artículo destacado, rejilla filtrable por categoría y newsletter. Eso es
// maquetable. Lo que NO es maquetable es el contenido: un blog son artículos
// escritos, y escribir posts de viaje inventándose datos sobre Punta Cana
// sería exactamente lo que este proyecto no hace.
//
// Solución: los TÍTULOS, categorías y extractos son propuestas de la misma
// naturaleza que las de la maqueta del cliente (Samuel pidió ampliarlas
// 2026-07-22 para que cada categoría tenga entre 3 y 5 tarjetas — "para que
// haya más contenido"), y el CUERPO de cada artículo solo está escrito para
// los que se pueden sostener con contenido REAL que ya vive en el proyecto —
// hoy uno: la guía de esnórquel, cuyo texto sale de TIPS_GUIAS (data/guias.ts),
// que a su vez viene de la web del cliente.
//
// El resto son `cuerpo: null` = "propuesto, sin escribir". Desde 2026-07-22
// TODAS las cards (destacadas y rejilla) enlazan igual a /blog/:slug con su
// botón «Leer el artículo» — ya no se distingue con un chip «Próximamente» ni
// se ocultan el enlace: la propia plantilla de artículo (pages/articulo.tsx)
// resuelve el caso `cuerpo: null` mostrando el mismo encabezado/portada con
// una nota honesta de "en redacción" en vez de fingir un cuerpo que no existe.
// Cuando se escriban, basta con rellenar `cuerpo` y la página se completa sola.
//
// Autores: los del EQUIPO real (data/nosotros.ts) — Omar, Lola y Eva, los
// mismos nombres que el propio cliente dio en sus maquetas.

export type CategoriaBlog =
  | 'Guías de Punta Cana'
  | 'Consejos de viaje'
  | 'Vida a bordo'
  | 'Sostenibilidad'
  | 'Qué hacer'

export const CATEGORIAS_BLOG: CategoriaBlog[] = [
  'Guías de Punta Cana',
  'Consejos de viaje',
  'Vida a bordo',
  'Sostenibilidad',
  'Qué hacer',
]

export type Articulo = {
  slug: string
  titulo: string
  extracto: string
  categoria: CategoriaBlog
  /** id de EQUIPO (data/nosotros.ts). */
  autorId: string
  fecha: string
  minutos: number
  /** Foto de portada, en /fotos (sin extensión). */
  foto: string
  fotoAlt: string
  /** Aparece en el carrusel de destacados del índice (al menos 4, pedido de
   *  Samuel 2026-07-22). No lo saca de la rejilla de abajo — un artículo
   *  destacado también se puede seguir navegando/filtrando por categoría ahí,
   *  igual que en cualquier blog con hero + listado. */
  destacado?: boolean
  /** Cuerpo del artículo. null = propuesto pero SIN ESCRIBIR (ver arriba). */
  cuerpo: BloqueArticulo[] | null
}

/** Bloque del cuerpo de un artículo (pages/articulo.tsx). Los 3 niveles de
 *  encabezado (correcciones v1, pedido de Samuel 2026-07-22: "distintos
 *  títulos en diferentes niveles h2, h3, h4") llevan `id` explícito, no
 *  generado por slugify del texto — son unos pocos artículos escritos a
 *  mano, así que el id explícito es más simple que una utilidad de slugify
 *  para evitar colisiones. El índice al principio del artículo
 *  (blog/indice-articulo.tsx) enlaza a esos mismos id vía ancla (#id). */
export type BloqueArticulo =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'h2'; id: string; texto: string }
  | { tipo: 'h3'; id: string; texto: string }
  | { tipo: 'h4'; id: string; texto: string }

export const ARTICULOS: Articulo[] = [
  {
    slug: 'esnorquel-punta-cana-honesto',
    titulo: '¿Es Punta Cana buena para hacer esnórquel? La respuesta honesta',
    extracto:
      'Para bucear puro hay mejores sitios en el Caribe. Para ver tortugas, pocos lo superan. Te contamos por qué, sin marketing.',
    categoria: 'Guías de Punta Cana',
    autorId: 'omar',
    fecha: '12 jul 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-1',
    fotoAlt: 'Huéspedes haciendo snorkel sobre el vivero de coral',
    destacado: true,
    // Único artículo con cuerpo: cada bloque sale de contenido REAL del
    // proyecto (TIPS_GUIAS en data/guias.ts, portado de la web del cliente,
    // + los datos de la fundación en data/sostenibilidad.ts). No hay ni una
    // afirmación nueva sobre Punta Cana escrita aquí — solo reorganizado en
    // secciones con encabezado (ampliación 2026-07-22, pedido de Samuel:
    // "artículo más largo con distintos títulos en diferentes niveles h2,
    // h3, h4") y con 2 preguntas de TIPS_GUIAS que el primer borrador no
    // usaba (vela/motor, marisco/cocina flotante) — mismo pool de contenido
    // vetado, solo que antes esta página no las incluía.
    cuerpo: [
      { tipo: 'h2', id: 'respuesta-corta', texto: 'La respuesta corta' },
      {
        tipo: 'parrafo',
        texto:
          'Seamos honestos: la República Dominicana —incluida Punta Cana— no tiene las mejores áreas para bucear del Caribe. Si has estado en las Islas Vírgenes o en Turcas y Caicos, es probable que la vista te decepcione un poco. Muchas zonas de la costa atlántica se han visto dañadas con los años por el buceo y la pesca, y Catalina o Bayahibe, en la costa sur frente al Mar Caribe, tienen mejor visibilidad.',
      },
      { tipo: 'h2', id: 'lo-que-si-puedes-ver', texto: 'Lo que sí puedes ver, casi garantizado' },
      {
        tipo: 'parrafo',
        texto:
          'Dicho eso, hay algo que aquí sí puedes hacer y en pocos sitios más: ver tortugas. En nuestro recorrido hay casi un 100% de posibilidades de verlas desde el catamarán. No es suerte: se plantan y construyen arrecifes artificiales desde 2016 para restaurar el hábitat marino, y el Ministerio de Medio Ambiente ha calificado el proyecto como uno de los 3 mayores de jardinería de coral del país.',
      },
      { tipo: 'h3', id: 'fundacion-bavaro-reefs', texto: 'La Bávaro Reefs Foundation, detrás de esas tortugas' },
      {
        tipo: 'parrafo',
        texto:
          'La fundación —fundada y administrada por Hispaniola Aquatic Adventures— apoya con aportes económicos directos y colaboración activa hitos ambientales reales: la creación y ampliación de áreas marinas protegidas, la recuperación y el monitoreo de la tortuga verde en la República Dominicana, y la restauración de coral en Coral Garden, hoy uno de los sitios de restauración de arrecife más efectivos del país.',
      },
      { tipo: 'h4', id: 'aporte-por-huesped', texto: 'Un aporte directo por cada huésped' },
      {
        tipo: 'parrafo',
        texto:
          'No es solo un discurso de marca: de cada huésped, US$ 2.00 se destinan directamente a las iniciativas de la fundación. Navegar con nosotros financia, en la práctica, el mismo arrecife por el que estás haciendo esnórquel.',
      },
      { tipo: 'h2', id: 'seguridad-del-mar', texto: '¿Y la seguridad del mar?' },
      {
        tipo: 'parrafo',
        texto:
          'Es la otra pregunta que más nos hacen. Muchas zonas de Punta Cana y Bávaro, al estar en el lado atlántico, tienen aguas movidas por la dirección de la corriente. Nuestra zona de tour está cerca de Cabo Engaño, donde empieza el Mar Caribe, y el recorrido va dentro de una laguna de arrecife. La barrera de coral protege la navegación, así que el viaje es tranquilo y no hacen falta pastillas para el mareo.',
      },
      { tipo: 'h2', id: 'vela-o-motor', texto: '¿Vela o motor? Lo que nadie te cuenta del viento en Bávaro' },
      {
        tipo: 'parrafo',
        texto:
          'El área del recorrido está dentro del arrecife, lo que significa aguas poco profundas. Por eso, y por la dirección del viento, el catamarán navega a motor durante al menos el 50% del tiempo. No son condiciones ideales para vela pura, pero el esnórquel, la duración del recorrido y la comida preparada a bordo compensan de sobra el tramo motorizado.',
      },
      { tipo: 'h2', id: 'de-donde-sale-el-marisco', texto: 'De dónde sale el marisco que vas a comer a bordo' },
      {
        tipo: 'parrafo',
        texto:
          'La mayoría de restaurantes y hoteles mantienen su marisco congelado, porque es importado. En nuestros tours es recién capturado localmente, y lo sazonamos con hierbas frescas y aceite de oliva justo frente a ti, en la cocina flotante.',
      },
      { tipo: 'h3', id: 'permisos-cocina-flotante', texto: 'Una plataforma con todos los permisos en regla' },
      {
        tipo: 'parrafo',
        texto:
          'La cocina flotante tiene todos los permisos y supera los requisitos de higiene del Ministerio de Medio Ambiente — la misma normativa que cualquier cocina en tierra, no una parrilla improvisada en cubierta.',
      },
      { tipo: 'h2', id: 'conclusion', texto: 'Conclusión' },
      {
        tipo: 'parrafo',
        texto:
          'Si vienes buscando el mejor buceo del Caribe, Punta Cana no es tu destino y no te vamos a decir lo contrario. Si vienes buscando un día de mar tranquilo, con tortugas casi garantizadas y comida hecha a bordo, aquí estamos.',
      },
    ],
  },
  {
    slug: 'cinco-cosas-antes-de-un-catamaran',
    titulo: '5 cosas que nadie te cuenta antes de un tour en catamarán',
    extracto: 'Lo que de verdad conviene saber para disfrutar el día sin sorpresas.',
    categoria: 'Consejos de viaje',
    autorId: 'eva',
    fecha: '5 jul 2026',
    minutos: 6,
    foto: 'galeria-charter-privado-2',
    fotoAlt: 'Grupo disfrutando en la cubierta de un catamarán',
    cuerpo: null,
  },
  {
    slug: 'como-restauramos-el-arrecife',
    titulo: 'Cómo restauramos el arrecife de Cabeza de Toro (y por qué importa)',
    extracto:
      'Dentro del proyecto de coral que el Ministerio califica entre los 3 mayores del país.',
    categoria: 'Sostenibilidad',
    autorId: 'omar',
    fecha: '28 jun 2026',
    minutos: 7,
    foto: 'arrecife-fondo-cenital',
    fotoAlt: 'Vista cenital del océano Caribe con agua turquesa',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'de-donde-sale-el-marisco',
    titulo: 'De dónde sale el marisco de tu almuerzo a bordo',
    extracto: 'El camino del mar a tu plato: recién capturado y cocinado frente a ti.',
    categoria: 'Vida a bordo',
    autorId: 'lola',
    fecha: '20 jun 2026',
    minutos: 5,
    foto: 'cocina-flotante',
    fotoAlt: 'La tripulación cocinando marisco en la cocina flotante',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'isla-saona-vs-piscina-natural',
    titulo: 'Isla Saona vs. Piscina Natural: ¿cuál es para ti?',
    extracto: 'Comparamos las dos experiencias estrella para que elijas la tuya.',
    categoria: 'Qué hacer',
    autorId: 'eva',
    fecha: '14 jun 2026',
    minutos: 6,
    foto: 'galeria-isla-saona-4',
    fotoAlt: 'Aguas turquesa poco profundas de la piscina natural',
    destacado: true,
    cuerpo: null,
  },
  {
    slug: 'mejor-epoca-punta-cana',
    titulo: 'Mejor época para visitar Punta Cana: mes a mes',
    extracto: 'Clima, precios y multitudes: qué esperar en cada mes del año.',
    categoria: 'Guías de Punta Cana',
    autorId: 'lola',
    fecha: '6 jun 2026',
    minutos: 9,
    foto: 'galeria-snorkel-lovers-2',
    fotoAlt: 'Catamarán fondeado sobre agua turquesa',
    cuerpo: null,
  },
  {
    slug: 'que-llevar-a-un-catamaran',
    titulo: 'Qué llevar a una excursión en catamarán (lista real)',
    extracto: 'La lista corta y honesta de lo que sí necesitas — y lo que no.',
    categoria: 'Consejos de viaje',
    autorId: 'eva',
    fecha: '30 may 2026',
    minutos: 4,
    foto: 'galeria-charter-privado-6',
    fotoAlt: 'Familia disfrutando en una playa desierta',
    cuerpo: null,
  },
  // ---- Ampliación 2026-07-22 (Samuel: "cada categoría entre 3 y 5 cards,
  // para que haya más contenido") — Guías de Punta Cana y Consejos de viaje
  // suben a 5, Vida a bordo/Sostenibilidad/Qué hacer suben a 3. Mismo criterio
  // que el resto: títulos propuestos, `cuerpo: null`, fotos REALES ya
  // existentes en /fotos (ninguna nueva generada para esto).
  {
    slug: 'isla-saona-catamaran-o-lancha',
    titulo: 'Isla Saona en catamarán o en lancha rápida: las diferencias reales',
    extracto: 'Dos formas de llegar a la misma isla, con experiencias muy distintas. En qué se diferencian de verdad.',
    categoria: 'Guías de Punta Cana',
    autorId: 'lola',
    fecha: '24 may 2026',
    minutos: 7,
    foto: 'galeria-isla-saona-6',
    fotoAlt: 'Lancha y catamarán cerca de la costa de Isla Saona',
    cuerpo: null,
  },
  {
    slug: 'charter-privado-vs-compartido',
    titulo: 'Charter privado vs. tour compartido: cómo elegir el tuyo',
    extracto: 'Grupo, presupuesto y qué tan tuyo quieres que sea el día: las preguntas que de verdad deciden.',
    categoria: 'Guías de Punta Cana',
    autorId: 'omar',
    fecha: '10 may 2026',
    minutos: 6,
    foto: 'galeria-charter-privado-5',
    fotoAlt: 'Grupo pequeño celebrando a bordo de un charter privado',
    cuerpo: null,
  },
  {
    slug: 'punta-cana-con-ninos',
    titulo: 'Punta Cana con niños: qué tour conviene según la edad',
    extracto: 'No todos los tours son iguales con peques a bordo. Guía rápida para elegir sin sorpresas.',
    categoria: 'Guías de Punta Cana',
    autorId: 'eva',
    fecha: '26 abr 2026',
    minutos: 5,
    foto: 'galeria-charter-privado-3',
    fotoAlt: 'Familia con niños disfrutando de un tour en catamarán',
    cuerpo: null,
  },
  {
    slug: 'como-no-marearte-en-catamaran',
    titulo: 'Cómo no marearte en un tour en catamarán',
    extracto: 'Trucos sencillos (y alguno que no esperabas) para disfrutar el mar aunque el estómago sea delicado.',
    categoria: 'Consejos de viaje',
    autorId: 'eva',
    fecha: '18 may 2026',
    minutos: 4,
    foto: 'galeria-snorkel-lovers-5',
    fotoAlt: 'Huéspedes disfrutando en la proa del catamarán',
    cuerpo: null,
  },
  {
    slug: 'reservar-con-antelacion-o-al-momento',
    titulo: 'Reservar con antelación o de último momento: qué conviene más',
    extracto: 'Precio, disponibilidad y margen de maniobra: pros y contras de cada momento para reservar.',
    categoria: 'Consejos de viaje',
    autorId: 'lola',
    fecha: '3 may 2026',
    minutos: 5,
    foto: 'tour-charter-privado',
    fotoAlt: 'Catamarán Hispaniola listo para zarpar',
    cuerpo: null,
  },
  {
    slug: 'punta-cana-en-pareja-luna-de-miel',
    titulo: 'Punta Cana en pareja: nuestra ruta para una luna de miel',
    extracto: 'Cómo armar un día en el mar que se sienta hecho a medida para dos.',
    categoria: 'Consejos de viaje',
    autorId: 'eva',
    fecha: '19 abr 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-3',
    fotoAlt: 'Pareja disfrutando de la vista al mar desde el catamarán',
    cuerpo: null,
  },
  {
    slug: 'un-dia-en-la-vida-de-la-tripulacion',
    titulo: 'Un día en la vida de nuestra tripulación',
    extracto: 'Desde que sale el sol hasta que amarra el último catamarán: así es un día normal para quienes hacen posible el tour.',
    categoria: 'Vida a bordo',
    autorId: 'lola',
    fecha: '12 abr 2026',
    minutos: 6,
    foto: 'galeria-semi-privado-5',
    fotoAlt: 'Tripulación preparando el catamarán antes de zarpar',
    cuerpo: null,
  },
  {
    slug: 'el-playlist-de-cada-tour',
    titulo: 'Así armamos el playlist de cada tour',
    extracto: 'La música también es parte de la experiencia. Te contamos cómo la elegimos.',
    categoria: 'Vida a bordo',
    autorId: 'lola',
    fecha: '29 mar 2026',
    minutos: 4,
    foto: 'bar-flotante',
    fotoAlt: 'Bar flotante junto al catamarán con música de ambiente',
    cuerpo: null,
  },
  {
    slug: 'plastico-cero-a-bordo',
    titulo: 'Plástico cero a bordo: cómo lo logramos',
    extracto: 'Los cambios concretos que hicimos para sacar el plástico de un solo uso de nuestros catamaranes.',
    categoria: 'Sostenibilidad',
    autorId: 'omar',
    fecha: '5 abr 2026',
    minutos: 6,
    foto: 'cocina-flotante-plataforma',
    fotoAlt: 'Cocina flotante preparando comida a bordo',
    cuerpo: null,
  },
  {
    slug: 'por-que-no-alimentamos-a-los-peces',
    titulo: 'Por qué no alimentamos a los peces (aunque lo pidan los huéspedes)',
    extracto: 'Una pregunta frecuente a bordo, y la razón ecológica detrás de nuestro "no".',
    categoria: 'Sostenibilidad',
    autorId: 'omar',
    fecha: '15 mar 2026',
    minutos: 5,
    foto: 'galeria-snorkel-lovers-9',
    fotoAlt: 'Huésped haciendo snorkel junto a peces tropicales',
    cuerpo: null,
  },
  {
    slug: 'snorkel-lovers-que-esperar',
    titulo: 'Snorkel Lovers: qué esperar de nuestro tour más popular',
    extracto: 'Qué incluye, a quién le encaja y qué te vas a encontrar bajo el agua.',
    categoria: 'Qué hacer',
    autorId: 'eva',
    fecha: '22 mar 2026',
    minutos: 6,
    foto: 'galeria-snorkel-lovers-11',
    fotoAlt: 'Grupo haciendo snorkel en aguas turquesas',
    cuerpo: null,
  },
  {
    slug: 'recuerdos-de-isla-saona-sin-dañar',
    titulo: 'Qué llevarte de recuerdo de Isla Saona sin dañar el ecosistema',
    extracto: 'Ideas de recuerdo que no implican llevarte un pedazo del ecosistema a casa.',
    categoria: 'Qué hacer',
    autorId: 'lola',
    fecha: '8 mar 2026',
    minutos: 5,
    foto: 'galeria-isla-saona-9',
    fotoAlt: 'Detalle de arena y conchas en la orilla de Isla Saona',
    cuerpo: null,
  },
]

export const BLOG_HERO = {
  eyebrow: 'Blog',
  titulo: 'El Caribe, contado por quienes lo navegan',
  sub: 'Guías honestas, historias del mar y consejos reales para tu viaje a Punta Cana. Sin marketing vacío.',
  // Fotos del hero compartido (mismo patrón que el resto de internas).
  galeria: ['galeria-snorkel-lovers-2', 'galeria-charter-privado-2', 'galeria-semi-privado-1'],
}
