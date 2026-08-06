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
// ✅ RESUELTO EL 2026-07-28 (2ª vuelta) — el aviso que vivía aquí decía que
// «no hay ni una foto propia de la fundación en todo el proyecto». SÍ LAS
// HAY, y llevaban meses dentro: la galería de Snorkel Lovers trae el VIVERO
// DE CORAL real (fragmentos creciendo en las estructuras), los ARRECIFES
// ARTIFICIALES con peces encima, a los huéspedes manipulando bastidores en
// cubierta, al guía explicándoselo a un grupo de niños y la visita a los
// tanques de cultivo. data/instalaciones.ts ya las describía así una por una
// («Estructuras del vivero de coral bajo el agua…»). O sea: la única página
// del sitio sin una sola imagen de la fundación era la que HABLA de la
// fundación. Por eso este archivo pasa de dos párrafos corridos a contenido
// con foto: `cronologia`, `destacado.fotos` y `frentes[].foto`.
//
// ⚠️ Lo que sigue sin existir: fotos de las JORNADAS DE LIMPIEZA y del
// trabajo con PESCADORES (frentes 03 y 04). Como esos dos frentes ahora son
// card grande con foto obligatoria, llevan la imagen del ÁREA (la playa que
// se limpia, el banco de peces que se protege) marcada con `contexto: true`
// — ver el aviso sobre ese flag más abajo. No hay ningún pie que dé por
// hecho lo que la foto no enseña.

export const FUNDACION = {
  nombreLegal: 'Fundación Ecológica Arrecifes de Bávaro',

  // Titular de la página. Es la frase del propio cliente (slide 63): sube al
  // hero porque resume la fundación entera en siete palabras, y así la
  // sección de proyectos deja de repetirla como su h2 (antes el mismo texto
  // salía DOS veces en la misma página, a dos pantallas de distancia).
  lema: 'Cuidar los arrecifes empieza con las personas',
  heroTexto:
    'Restauración coralina y arrecifes artificiales en Playa Bávaro desde 2016, junto al Ministerio de Medio Ambiente.',

  hitos: [
    { cifra: '2016', texto: 'inicio del proyecto' },
    { cifra: '3er', texto: 'vivero de coral del país' },
    { cifra: 'Aliados', texto: 'Ministerio de Medio Ambiente' },
  ],

  // LA HISTORIA, EN TRES TIEMPOS. Antes eran dos párrafos de ~60 palabras
  // seguidos: toda la información estaba, pero había que leérselos enteros
  // para sacar los tres momentos que de verdad cuentan (el problema, la
  // decisión, el resultado). Aquí es el MISMO texto troceado en esos tres
  // tiempos, con la foto de cada uno — sin un dato nuevo ni uno perdido.
  cronologiaEyebrow: 'Cómo empezó',
  cronologia: [
    {
      marca: 'Antes',
      titulo: 'El arrecife se estaba perdiendo',
      texto:
        'La operación diaria en Playa Bávaro fue testigo del deterioro de los ecosistemas marinos por el crecimiento del turismo.',
      foto: 'galeria-snorkel-lovers-1',
      fotoAlt: 'Coral sobre el fondo del arrecife de Playa Bávaro',
    },
    {
      marca: '2016',
      titulo: 'Arranca la restauración',
      texto:
        'Un proyecto de restauración coralina y construcción de arrecifes artificiales, en colaboración con el Ministerio de Medio Ambiente.',
      foto: 'galeria-snorkel-lovers-13',
      fotoAlt: 'Fragmentos de coral creciendo en las estructuras del vivero, con un pez entre ellos',
    },
    {
      marca: 'Hoy',
      titulo: 'Tercer vivero del país',
      texto:
        'El proyecto está reconocido como el tercer vivero de coral más importante de República Dominicana.',
      foto: 'galeria-snorkel-lovers-3',
      fotoAlt: 'Estructuras de arrecife artificial cubiertas de peces bajo el agua',
    },
  ],

  // Slide 62, tarjeta «LOS FUNDADORES». La empresa va en la misma lista que
  // las dos personas porque así lo dice su maqueta y porque es exacto: la
  // fundación la sostienen tres partes, dos personas y una empresa.
  //
  // [2ª vuelta 2026-07-28, Samuel: «haz esa sección reutilizando las cards de
  // equipo, para mostrar a los 3 que están detrás»] Estos tres se mapean a
  // `MiembroEquipo` y se pintan con home/equipo-teaser.tsx — el mismo
  // componente que ya se reutiliza en /nosotros. Por eso llevan `id`, `rol` y
  // `foto`, que es el contrato de esa card.
  //
  // ⚠️ `foto: null` EN LOS TRES, a propósito. No hay retrato de ninguno de
  // los dos cofundadores, y las caras de /fotos/equipo-*.webp son STOCK
  // recortado (así está avisado en data/nosotros.ts): ponerle una cara de
  // stock a una persona real CON NOMBRE Y APELLIDOS no es maquetar, es
  // inventarle un retrato a alguien que existe. La card cae sola a su
  // fallback de monograma (`iniciales`) hasta que el cliente mande fotos —
  // ese día es cambiar `null` por el nombre del archivo y nada más.
  fundadoresEyebrow: 'Quién está detrás',
  fundadoresTitulo: 'Tres firmas sostienen la fundación',
  fundadoresIntro:
    'Nace de la pasión compartida por el medio ambiente de dos personas, con el respaldo de la empresa cuya operación fue testigo del problema.',
  fundadores: [
    {
      id: 'fernando',
      nombre: 'Fernando Sánchez Fernández',
      rol: 'Cofundador',
      iniciales: 'FS',
      foto: null,
    },
    {
      id: 'manuel',
      nombre: 'Manuel Alejandro Redondo',
      rol: 'Cofundador',
      iniciales: 'MR',
      foto: null,
    },
    {
      id: 'hispaniola',
      nombre: 'Hispaniola Aquatic Adventures',
      rol: 'Empresa que respalda la fundación',
      iniciales: 'HAA',
      foto: null,
    },
  ],

  // [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pag. 9] Cabecera APROBADA. La
  // frase que abre es la tesis entera de la fundacion y no estaba: «no se mide
  // por cuantos corales plantamos, sino por los ecosistemas que devolvemos a
  // la vida».
  proyectosEyebrow: 'Our projects',
  proyectosTitulo:
    "Real conservation isn't measured by the number of corals we plant. It's measured by the ecosystems we help bring back to life.",
  proyectosLead: 'Healthy reefs need more than coral. They need an entire ecosystem to thrive.',

  // El proyecto insignia. Sigue siendo el bloque navy de siempre, pero ahora
  // con las dos fotos que lo prueban: sin ellas, «arrecifes artificiales» es
  // una idea abstracta; con ellas se ve lo que es — bloques sumergidos que a
  // los meses están tapados de peces.
  destacado: {
    eyebrow: 'El proyecto insignia',
    titulo: 'Arrecifes artificiales',
    texto:
      'Crear las condiciones ecológicas necesarias para la restauración y el desarrollo de arrecifes coralinos, a través de la vigilancia y protección ambiental.',
    fotos: [
      {
        src: 'galeria-snorkel-lovers-4',
        alt: 'Bloques de arrecife artificial sobre el fondo, rodeados de peces',
      },
      {
        src: 'galeria-snorkel-lovers-18',
        alt: 'Una tortuga marina nadando sobre el arrecife de Bávaro',
      },
    ],
  },

  // Los 5 frentes de trabajo (slide 63) — el mejor contenido de toda la
  // tanda: específicos y verificables («peces loro, langostas, capitanes,
  // pargos» no lo escribe una IA genérica).
  //
  // `clave` es NUEVO y no añade información: es la etiqueta de una palabra
  // con la que se escanea el bloque sin leerse los cinco títulos enteros.
  // Quien tiene prisa lee cinco palabras; quien no, se lee el resto.
  //
  // [2ª vuelta 2026-07-28, Samuel: «lo de en qué trabaja la fundación hay que
  // hacer más llamativa esta sección, puede ser que cada cosa en la que
  // trabaje la fundación sea una card grande y que se desplacen
  // horizontalmente con GSAP»] Los cinco pasan a card grande con texto a la
  // izquierda y FOTO A LA DERECHA, así que ahora los cinco necesitan imagen.
  //
  // ⚠️ `contexto: true` marca las dos fotos que NO son prueba de lo que dice
  // el frente, sino del ÁREA donde ocurre. No existe ni una foto de las
  // jornadas de limpieza ni del trabajo con pescadores; lo que sí existe es
  // la playa que se limpia y el banco de peces que se protege. El flag no
  // pinta nada: está para que, cuando el cliente mande material real de esos
  // dos programas, se vea de un vistazo cuáles hay que sustituir — y para que
  // nadie escriba un pie que dé por hecho lo que la foto no enseña.
  // [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pags. 9-10 + PowerPoint slide 81]
  // LOS SEIS PROYECTOS con el copy APROBADO. Eran cinco: el cliente añade uno
  // NUEVO —«06 Marine Protected Area Management»— que es justo el que faltaba
  // para cerrar la historia de las tortugas de /ventaja-competitiva: el area
  // protegida existe, y ademas la gestionan ellos con el Ministerio.
  //
  // Cada proyecto gana ademas su CLAIM (la linea corta bajo el titulo, «A
  // healthy reef needs abundant marine life»), que es lo que el cliente usa
  // para explicar por que importa cada uno.
  //
  // ⚠️ Las fotos NO se tocan: las cinco que habia estaban elegidas una a una y
  // dos llevan `contexto: true` porque enseñan el AREA y no el programa. El
  // proyecto nuevo hereda la foto del arrecife cenital, que es el area
  // protegida de la que habla — y queda marcado igual.
  frentes: [
    {
      clave: 'Coral',
      titulo: 'Coral Reef Restoration',
      claim: 'Restoring the foundation of marine life.',
      texto:
        'We rescue coral fragments, grow them in our nurseries and laboratories, and transplant them using advanced restoration techniques to rebuild healthy reefs.',
      foto: 'galeria-snorkel-lovers-6',
      fotoAlt: 'Estructuras del vivero de coral bajo el agua, con una buceadora revisándolas',
    },
    {
      clave: 'Biodiversity',
      titulo: 'Restoring Marine Biodiversity',
      claim: 'A healthy reef needs abundant marine life.',
      texto:
        'Our restoration strategy goes beyond corals by increasing fish populations, protecting key species and rebuilding the ecological balance that allows reefs to flourish naturally.',
      foto: 'galeria-snorkel-lovers-5',
      fotoAlt: 'Peces nadando sobre un coral cerebro en el arrecife de Bávaro',
    },
    {
      clave: 'Clean-ups',
      titulo: 'Cleaner Oceans',
      claim: 'Healthy ecosystems begin with clean waters.',
      texto:
        'Regular coastal and underwater clean-up campaigns remove marine debris, improve habitat quality and protect the ecosystems that support marine life.',
      foto: 'galeria-semi-privado-3',
      fotoAlt: 'Un grupo numeroso en la orilla de la playa de Bávaro',
      contexto: true,
    },
    {
      clave: 'Fishermen',
      titulo: 'Working with Local Fishermen',
      claim: 'Conservation succeeds when communities succeed.',
      texto:
        'We work alongside local fishermen, promoting sustainable practices and creating opportunities that align livelihoods with long-term marine conservation.',
      foto: 'galeria-semi-privado-4',
      fotoAlt: 'Banco de peces sargento sobre el arrecife, junto a una nadadora',
      contexto: true,
    },
    {
      clave: 'Education',
      titulo: 'Environmental Education & Ecotourism',
      claim: 'Protecting what people learn to value.',
      texto:
        'Every visitor, student and local resident becomes part of our mission through educational experiences that inspire long-term stewardship of the Caribbean.',
      foto: 'galeria-snorkel-lovers-10',
      fotoAlt: 'Un guía de Hispaniola explicando el vivero de coral a un grupo de niños',
    },
    {
      clave: 'Protected area',
      titulo: 'Marine Protected Area Management',
      claim: 'Turning protection into action.',
      texto:
        'Working alongside the Ministry of Environment, we help manage the protected marine area where we operate through monitoring, scientific data collection and on-the-water conservation efforts.',
      foto: 'arrecife-fondo-cenital',
      fotoAlt: 'El área marina protegida vista desde el aire',
      contexto: true,
    },
  ],

  // Slide 64, banda verde. El botón lleva a /contacto y no a una página de
  // membresías porque esa página no existe: no hay niveles definidos, ni
  // precios, ni pasarela de cobro (mismo bloqueo Odoo que el resto de pagos).
  // Recoger interés real desde el primer día es preferible a prometer un
  // flujo que no está.
  membresiasEyebrow: 'Membresías',
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
