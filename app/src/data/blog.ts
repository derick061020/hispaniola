// BLOG (/blog) — página NUEVA de las correcciones v1 del cliente
// (2026-07-20, planes/06-blog.md). No existía nada de esto en el proyecto.
//
// ⚠️ ALCANCE, Y POR QUÉ ES ASÍ. El cliente mandó la maqueta de un blog con
// artículo destacado, rejilla filtrable por categoría y newsletter. Eso es
// maquetable. Lo que NO es maquetable es el contenido: un blog son artículos
// escritos, y escribir 7 posts de viaje inventándose datos sobre Punta Cana
// sería exactamente lo que este proyecto no hace.
//
// Solución: los TÍTULOS, categorías y extractos son los de la maqueta del
// cliente (los propuso él), y el CUERPO de cada artículo solo está escrito
// para los que se pueden sostener con contenido REAL que ya vive en el
// proyecto — hoy uno: la guía de esnórquel, cuyo texto sale de TIPS_GUIAS
// (data/guias.ts), que a su vez viene de la web del cliente.
//
// El resto son `cuerpo: null` = "propuesto, sin escribir". La página los
// pinta con su card pero marcados como próximamente, en vez de fingir un
// enlace a un artículo vacío. Así el cliente ve la estructura completa que
// pidió y a la vez ve exactamente qué falta por escribir.
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
  /** Destacado del índice. Solo uno debería tenerlo. */
  destacado?: boolean
  /** Párrafos del artículo. null = propuesto pero SIN ESCRIBIR (ver arriba). */
  cuerpo: string[] | null
}

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
    // Único artículo con cuerpo: cada párrafo sale de contenido REAL del
    // proyecto (TIPS_GUIAS en data/guias.ts, portado de la web del cliente).
    // No hay ni una afirmación nueva sobre Punta Cana escrita aquí.
    cuerpo: [
      'Seamos honestos: la República Dominicana —incluida Punta Cana— no tiene las mejores áreas para bucear del Caribe. Si has estado en las Islas Vírgenes o en Turcas y Caicos, es probable que la vista te decepcione un poco. Muchas zonas de la costa atlántica se han visto dañadas con los años por el buceo y la pesca, y Catalina o Bayahibe, en la costa sur frente al Mar Caribe, tienen mejor visibilidad.',
      'Dicho eso, hay algo que aquí sí puedes hacer y en pocos sitios más: ver tortugas. En nuestro recorrido hay casi un 100% de posibilidades de verlas desde el catamarán. No es suerte: la Fundación de Arrecifes Ecológicos de Bávaro —fundada y administrada por Hispaniola Aquatic Adventures— planta y construye arrecifes artificiales desde 2016 para restaurar el hábitat marino. El Ministerio de Medio Ambiente ha calificado el proyecto como uno de los 3 mayores de jardinería de coral del país.',
      'Sobre la seguridad, que es la otra pregunta que más nos hacen: muchas zonas de Punta Cana y Bávaro, al estar en el lado atlántico, tienen aguas movidas por la dirección de la corriente. Nuestra zona de tour está cerca de Cabo Engaño, donde empieza el Mar Caribe, y el recorrido va dentro de una laguna de arrecife. La barrera de coral protege la navegación, así que el viaje es tranquilo y no hacen falta pastillas para el mareo.',
      'Conclusión: si vienes buscando el mejor buceo del Caribe, Punta Cana no es tu destino y no te vamos a decir lo contrario. Si vienes buscando un día de mar tranquilo, con tortugas casi garantizadas y comida hecha a bordo, aquí estamos.',
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
]

export const BLOG_HERO = {
  eyebrow: 'Blog',
  titulo: 'El Caribe, contado por quienes lo navegan',
  sub: 'Guías honestas, historias del mar y consejos reales para tu viaje a Punta Cana. Sin marketing vacío.',
  // Fotos del hero compartido (mismo patrón que el resto de internas).
  galeria: ['galeria-snorkel-lovers-2', 'galeria-charter-privado-2', 'galeria-semi-privado-1'],
}
