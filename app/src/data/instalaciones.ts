import { traducible } from '@/lib/i18n'
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
// También son suyos el copy de las bandas de CTA y —hasta la ronda del 08/22—
// los pies de los verticales.
//
// ⚠️ [2026-08-24, UPDATES 08/22 del cliente, pág. 4] LOS 5 PIES SON OTROS. El
// cliente los reescribe enteros y los da literales: «Your adventure starts
// here» (recepción), «Bringing corals back to life» (laboratorio), «Caribbean
// flavors in action» (cocina), «Take paradise home» (tienda) y «Making it all
// happen» (oficina). Siguen siendo copy suyo, solo que de esta ronda y no del
// PowerPoint de las slides 46-49.
//
// Dos cosas que cambian de naturaleza y conviene tener presentes:
//   · Con esto se cae «Así te recibimos», que era el ÚNICO texto en ESPAÑOL
//     que quedaba visible en una web íntegramente en inglés (salía dos veces
//     por página: en la card del carril y en la celda del bento). Los otros
//     cuatro ya se habían traducido en su momento y éste se quedó atrás.
//   · Los pies nuevos son AFIRMACIONES DE MARCA, no descripciones de lo que se
//     ve en el clip, que es lo que hacían los viejos («A walk through the
//     shop»). Con cuatro de los cinco vídeos ya reales no molesta; en la
//     tienda, cuyo vídeo sigue siendo el catamarán de relleno, «Take paradise
//     home» promete una tienda que el clip todavía no enseña.
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
  /** [v3 2026-08-06] El claim corto que el cliente pone bajo cada numero
   *  («Your Vacation Starts Before You Board»). Antes no existia: sus zonas
   *  tenian nombre y parrafo, y el claim es lo que las vende. */
  claim?: string
  /** Copy REAL del cliente. */
  descripcion: string
  /** [v3 2026-08-06] Frase de cierre tras los checks, en tres de las cinco
   *  zonas («Real conservation. Real scientists. Real impact.»). */
  cierre?: string
  /** Copy REAL del cliente. */
  bullets: string[]
  /** Celda grande del bento. */
  vertical: VerticalZona
  /** El clip de la zona es 16:9 y no 9:16. Cuando es true el bento INTERCAMBIA
   *  sitios: el video baja a una celda apilada (que ya es apaisada) y el hueco
   *  9:16 lo ocupa `fotoVertical`. Recortar un 16:9 a vertical se comia los
   *  lados de la sala. Pedido de Samuel, 2026-08-21. */
  videoApaisado?: boolean
  /** La foto que ocupa el hueco 9:16 cuando `videoApaisado`. Con
   *  `todoApaisado` ese hueco ya no existe en el bento y esta foto sobrevive
   *  SOLO como cartel de la card del carril de verticales, que sigue siendo
   *  9:16 (ver VERTICALES_INSTALACIONES al pie). */
  fotoVertical?: FotoZona
  /** TODO el material de la zona es apaisado —las fotos de la carpeta y el
   *  clip— asi que el bento pasa de 3 celdas a 4 y ninguna es vertical. Pedido
   *  de Samuel, 2026-08-24, sobre el Operations Center: «como todas las
   *  imagenes y videos son horizontales haz un bento de 4, para que todo entre
   *  horizontal». Implica `videoApaisado`; ver bento-zona.tsx. */
  todoApaisado?: boolean
  /** Las celdas apiladas del bento. Con `videoApaisado` solo hay UNA, porque la
   *  otra se la queda el video. */
  fotos: FotoZona[]
  /** Fotos de la carpeta que NO se pintan en el bento y solo aparecen al abrir
   *  el lightbox. El cliente (2026-08-21): «las que tengan mas de dos, al darle
   *  clic que ahi si esten todas las demas para que se puedan ver». La celda
   *  avisa de cuantas hay con un «+N». */
  fotosExtra?: FotoZona[]
  /** Ausente a propósito: no existe el material. NO poner un placeholder aquí. */
  tour360?: string
}

export const INSTALACIONES = traducible({
  // [v3 2026-08-06, WEBSITE - NOSOTROS pags. 10-11] Copy APROBADO, literal.
  // El cliente remata el titular con ⭐⭐⭐: es su marca de enfasis en el
  // documento, no parte del texto — el enfasis lo pone la tipografia.
  eyebrow: 'Our facilities',
  titulo: 'More Than a Marina. The Heart of Hispaniola.',
  lead: 'Before you step aboard, there is a complete operations center designed to deliver exceptional experiences. From our private guest facilities and professional kitchens to our marine biology laboratory, coral museum, administrative offices, and logistics center, every detail is managed under one roof.',

  // Carril de verticales del slide 45 («Míralo en video · vertical»). Se
  // alimenta de las propias ZONAS (ver la derivación al final del archivo):
  // el carril y el bento enseñan EL MISMO video de cada zona, así que no hay
  // dos listas que mantener sincronizadas.
  videoEyebrow: 'Tap to explore',
  videoTitulo: 'One tap. One minute.',
  videoLead: 'A complete look behind the scenes of Hispaniola Aquatic Adventures.',

  seccionEyebrow: 'A complex, not just a dock',
  // [v3 2026-08-07, WEBSITE - NOSOTROS pag. 11] Titular y bajada APROBADOS.
  // Sustituyen a la redacción de la casa («Everything behind your experience»
  // + el inventario de zonas), que hacía de índice de lo que venía; el copy
  // del cliente dice algo mejor en ese sitio — que la experiencia EMPIEZA
  // antes de embarcar, que es justo el argumento de tener esta página.
  // El inventario no se pierde: cada zona se presenta con su nombre y su copy
  // real unas líneas más abajo, y el `lead` del hero ya lo enumera entero.
  //
  // El cliente lo escribe en versales (DREAM IT. ARRIVE. LIVE IT), que en sus
  // documentos es marca de énfasis y no de estilo — mismo criterio que con
  // «THE PEOPLE BEHIND THE SCENES» en /crew, que se pinta en caja baja. El
  // punto final es NUESTRO: sus tres tiempos van con punto y dejar el último
  // sin él se lee como una errata, no como una decisión.
  seccionTitulo: 'Dream it. Arrive. Live it.',
  seccionLead:
    'Before the boat leaves the shore, your unforgettable experience has already begun. Every space has been designed to welcome you, inspire you, and prepare you for an unforgettable day.',
  /** Enlace discreto al pie de cada zona (slides 46-49). */
  zonaCta: 'Book your tour',

  cierreEyebrow: 'Te esperamos en Punta Cana',
  cierreTitulo: 'Ven a conocernos en persona',
  cierreTexto:
    'All of this is waiting for you before and after your tour. Book your day and see why we are far more than an excursion.',
  cierreCta: 'Book your tour',
  // [v2 2026-07-28] Huéspedes en la orilla junto al catamarán: la llegada, que
  // es lo que promete el titular. Se eligió `events-5` primero (la cenital de la
  // flota fondeada decía mejor «el sitio») y hubo que descartarla — mide 368px
  // de ancho y bajo los overlays del banner se veía como un rectángulo navy
  // liso. Ver el aviso de tamaño en banda-instalaciones.tsx.
  //
  // Tampoco `footer-oceano`, que es la foto de mar más grande del proyecto: vive
  // dos bloques más abajo, en el propio footer, y las dos entrarían en cuadro de
  // una sola pasada.
  cierreFoto: 'hero-catamaran-1-v2',
} as const)

// Banda de CTA intercalada (slide 48). La maqueta pone TRES bandas a ancho
// completo entre las zonas — coral («¿Listo para vivir todo esto?»), verde
// («La cocina, el mar y la ciencia…») y navy («Ven a conocernos en persona»).
// Se quedan DOS: esta, a mitad de recorrido, y el cierre. Tres CTA idénticos
// en una página de 6 zonas es demasiado y los tres dicen lo mismo con distinto
// color de fondo; con dos, el descanso a mitad de página existe (que es lo que
// la maqueta busca) sin que la página se convierta en una escalera de botones.
// El copy es el de la banda verde, que es la única de las tres que dice algo
// propio de ESTA página en vez del genérico de reservar.
// [v3 2026-08-06, WEBSITE - NOSOTROS pag. 15] LA BANDA CTA «La cocina, el mar
// y la ciencia, en un solo dia» SE RETIRA: el cliente la tacha en rojo. Con
// ella se va tambien su intercalado a mitad de las zonas. El componente que la
// pintaba sigue existiendo y se usa en otras paginas; aqui deja de invocarse.

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
// [2026-08-20] LLEGARON LOS VERTICALES DE VERDAD. El cliente entrega un video
// propio para cuatro de las cinco zonas, asi que se acaba el reparto de clips
// prestados que describe el comentario de arriba. Cada zona usa AHORA el suyo.
// La tienda (FOUNDATION STORE) sigue con placeholder: su carpeta llegó vacia,
// marcada PENDIENTE por el propio cliente.
//
// ⚠️ Dos de los cuatro (recibimiento y oficinas) venian en 16:9 horizontal, no
// en 9:16. Se recortan al centro para caber en la celda vertical del bento, asi
// que pierden los laterales del encuadre original.
const V_CATAMARAN = { video: '/video/hero.mp4', poster: 'hero-video-poster' }
const V_RECIBIMIENTO = { video: '/video/instalaciones/recibimiento.mp4', poster: 'instalacion-recibimiento-poster' }
const V_BIOLOGIA = { video: '/video/instalaciones/biologia.mp4', poster: 'instalacion-biologia-poster' }
const V_COCINAS = { video: '/video/instalaciones/cocinas.mp4', poster: 'instalacion-cocinas-poster' }
const V_OFICINAS = { video: '/video/instalaciones/oficinas.mp4', poster: 'instalacion-oficinas-poster' }

export const ZONAS: ZonaInstalacion[] = traducible([
  {
    id: 'recibimiento',
    chip: 'Welcome',
    icono: 'recibimiento',
    nombre: 'Guest Welcome Center',
    claim: 'Your Vacation Starts Before You Board',
    descripcion:
      "From the moment you arrive, you'll feel the difference. Relax in our private waiting areas, enjoy clean restrooms, and meet our team as we guide you through the day's adventure with maps, safety information, and local tips. By the time you step aboard, you'll know exactly what awaits you.",
    bullets: [
      'Private guest lounge',
      'Comfortable waiting areas & restrooms',
      'Tour briefing before departure',
    ],
    // ⚠️ ZONA DE VIDEO APAISADO — ver `videoApaisado` en el tipo.
    videoApaisado: true,
    vertical: { ...V_RECIBIMIENTO, titulo: 'Your adventure starts here' },
    fotoVertical: {
      src: 'instalacion-recibimiento-vertical',
      alt: 'Inside the Guest Welcome Center: long wooden counters, stools and the reef information panels',
    },
    fotos: [
      // No `hero-catamaran-1` aunque sea la foto de llegada más clara del repo:
      // se la queda el banner de cierre de esta misma página (ver `cierreFoto`),
      // y a media pantalla de distancia se vería dos veces.
      {
        src: 'instalacion-recibimiento-1',
        alt: 'The wooden Guest Welcome Center, with a crew member getting the check-in desk ready',
      },
    ],
  },
  // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 15] AQUI VIVIA «Museo exterior
  // marino». El cliente lo tacha de esta pagina y le da una PROPIA
  // (/marine-park, plan 05 §6): el museo es lo que se visita bajo el agua y
  // esta pagina es el complejo en tierra. Su contenido no se pierde, se muda
  // entero — incluidas sus dos fotos, que ahora ilustran alli el bloque «01
  // Underwater Museum». Lo que se queda aqui es el laboratorio, que es otra
  // cosa: el sitio donde se cultiva el coral.
  {
    id: 'biologia',
    chip: 'Science',
    icono: 'biologia',
    nombre: 'Marine Biology Center',
    claim: 'Where Science Meets Conservation',
    descripcion:
      "This isn't a display. It's a working marine biology center. Visit our coral laboratory, explore our open-air underwater museum, and discover how our team restores coral reefs and protects Punta Cana's marine life. Before entering the sea, you'll understand exactly what you're about to explore.",
    bullets: [
      'Live coral nursery',
      'Marine biologists on site',
      'Interactive coral museum',
    ],
    cierre: 'Real conservation. Real scientists. Real impact.',
    vertical: { ...V_BIOLOGIA, titulo: 'Bringing corals back to life' },
    fotos: [
      {
        src: 'galeria-snorkel-lovers-9-v2',
        alt: 'The team handling coral fragments on the work bench',
      },
      {
        src: 'instalacion-biologia-1',
        alt: 'The coral growing tanks at the Marine Biology Center, under the Bávaro Reefs mural',
      },
    ],
  },
  {
    id: 'cocinas',
    chip: 'Kitchen',
    icono: 'cocinas',
    nombre: 'Professional Culinary Center',
    claim: 'Fresh Starts Here',
    descripcion:
      'Every meal begins in our professional land-based kitchen, where fresh ingredients are carefully selected, stored, and prepared under strict quality standards before reaching our floating kitchen. From our cold storage to the grill on board, every dish follows one promise: fresh food, prepared the right way.',
    bullets: [
      'Professional preparation kitchen',
      'Large cold-storage facilities',
      'Daily quality control',
    ],
    vertical: { ...V_COCINAS, titulo: 'Caribbean flavors in action' },
    fotos: [
      // ⚠️ NI cocina-flotante NI plato-mariscos, que eran los candidatos
      // obvios: la primera es la cocina A BORDO (otra cosa distinta de las
      // cocinas en tierra de esta zona) y encima protagonizaba la franja
      // «Un día de mar», que estaba en esta misma página hasta que se retiró
      // (2026-08-07); el plato es un bodegón RECORTADO SOBRE BLANCO
      // y dentro de una celda del bento se lee como un hueco vacío, no como
      // una foto. Estas dos sí tienen fondo y cuentan preparación y servicio,
      // que es de lo que habla la zona.
      {
        src: 'instalacion-cocinas-1',
        alt: 'The Culinary Center kitchen, with the cold room and the prep shelves',
      },
      {
        src: 'instalacion-cocinas-2',
        alt: 'The stainless steel prep counter and the grill at the Culinary Center',
      },
    ],
    fotosExtra: [
      {
        src: 'instalacion-cocinas-3',
        alt: 'The dry store of the Culinary Center, with the fridges and the stacked crockery',
      },
      {
        src: 'instalacion-cocinas-4',
        alt: 'The convection oven at the Culinary Center',
      },
    ],
  },
  {
    id: 'tienda',
    chip: 'Store',
    icono: 'tienda',
    nombre: 'Foundation Store',
    claim: 'Take Home Something That Gives Back',
    descripcion:
      'More than a gift shop, every purchase directly supports The Bávaro Reef Foundation. Take home locally inspired products and meaningful souvenirs while helping protect the coral reefs and marine life that made your day unforgettable.',
    bullets: [
      'Official Foundation merchandise',
      'Local handcrafted products',
      'Every purchase supports conservation',
    ],
    cierre: 'Your souvenir helps protect the ocean you came to enjoy.',
    vertical: { ...V_CATAMARAN, titulo: 'Take paradise home' },
    fotos: [
      {
        src: 'bar-flotante',
        alt: 'The Hispaniola floating bar with guests around it',
      },
      {
        src: 'events-1',
        alt: 'Guests toasting with house cocktails in the water',
      },
    ],
  },
  {
    id: 'oficinas',
    chip: 'Operations',
    icono: 'oficinas',
    nombre: 'Operations Center',
    claim: 'The Engine Behind Every Tour',
    descripcion:
      'Behind every unforgettable experience is a team making thousands of decisions every day. Reservations, guest support, logistics, operations, sales, and conservation all work together from our headquarters to ensure your day runs seamlessly from start to finish.',
    bullets: [
      'Guest services & reservations',
      'Operations and logistics',
      'Sales & Foundation offices',
    ],
    cierre: 'What you experience as a perfect day is the result of hundreds of details working together behind the scenes.',
    // ⚠️ ZONA DE VIDEO APAISADO — mismo caso que el recibimiento. Samuel solo
    // señaló el welcome center, pero el clip del Operations Center también es
    // 16:9 y el motivo para intercambiar es idéntico.
    videoApaisado: true,
    vertical: { ...V_OFICINAS, titulo: 'Making it all happen' },
    // [2026-08-23, 2ª entrega del cliente] SE REPARTE LA ZONA DE NUEVO.
    // Petición literal: «cambiar foto, no achicar ni colocar vertical», con la
    // flecha sobre la celda alta. Y además borró de su carpeta
    // `IMG_8815-HDR.jpg`, que era justo la foto que ocupaba esa celda — con la
    // regla de siempre (en la web solo lo que está en la carpeta), tenía que
    // salir igualmente.
    //
    // De las tres fotos que quedan en OPERATON CENTER, solo UNA tiene gente:
    // `IMG_8994-HDR` (la oficina con las tres compañeras trabajando). Las otras
    // dos son la sala vacía. Así que la que tiene gente se lleva la celda
    // ANCHA, donde se ve apaisada y entera —que es lo que pedía el cliente—, y
    // la celda alta 9:16 la ocupa un rincón vacío recortado en vertical:
    // recortar una sala sin nadie no cuesta nada, recortar la foto con las tres
    // personas sí.
    //
    //
    // [2026-08-24, Samuel: «como todas las imágenes y videos son horizontales
    // haz un bento de 4, para que todo entre horizontal»] EL REPARTO DE ARRIBA
    // SE DESHACE. Era correcto salvo en una cosa: daba por buena la celda 9:16.
    // Y esta zona no tiene NADA vertical que meter ahí — las tres fotos de la
    // carpeta son 3:2 apaisadas y el clip es 16:9. Lo que se veía en esa celda
    // era el resultado de recortar una sala a la fuerza: un aire
    // acondicionado, un perchero y una estantería, sin oficina y sin nadie.
    //
    // Con `todoApaisado` el bento pasa a 4 celdas y cada pieza entra en su
    // formato: el clip, las tres fotos, y ya no hay `fotosExtra` porque no
    // queda ninguna escondida (de ahí que desaparezca el «+1»).
    // `instalacion-oficinas-2` VUELVE —es 8812 apaisada, la 4ª celda— y
    // `fotoVertical` se queda SOLO como cartel de la card del carril, que
    // sigue siendo 9:16.
    todoApaisado: true,
    fotoVertical: {
      src: 'instalacion-oficinas-vertical',
      alt: 'A corner of the Operations Center with the shelving and the notice board',
    },
    fotos: [
      {
        src: 'instalacion-oficinas-4',
        alt: 'The office team at their desks in the Operations Center',
      },
      {
        src: 'instalacion-oficinas-2',
        alt: 'A workstation in the Operations Center, with the planning board and the shelving',
      },
      {
        src: 'instalacion-oficinas-3',
        alt: 'The briefing room of the Operations Center, with the planning boards',
      },
    ],
  },
])

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
  // Con `videoApaisado` el cartel es la foto VERTICAL de la zona: la card del
  // carril es 9:16 y una apaisada se recortaría por los lados.
  foto: (z.fotoVertical ?? z.fotos[0]!).src,
  fotoAlt: (z.fotoVertical ?? z.fotos[0]!).alt,
  video: z.vertical.video,
  // Se propaga para que el reproductor abra en 16:9 y no herede el 9:16 de la
  // card, que recortaría el clip por los lados.
  apaisado: z.videoApaisado ?? false,
}))
