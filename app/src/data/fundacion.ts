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
// ✅ RESUELTO EL NOMBRE (2026-08-07). Aquí decía que convivían CUATRO en sus
// materiales —«Fundación Ecológica Arrecifes de Bávaro», «Bávaro Reefs
// Foundation», «Fundación The Bávaro Reef» y «Fundación» a secas— y que había
// que fijar uno. El copy v3 lo fija él: BÁVARO REEFS FOUNDATION, y lo usa así
// en los tres documentos nuevos (es también el nombre del departamento en
// /crew). Se adopta ese en toda la web.
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
  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 6] El nombre que el cliente
  // usa ahora en todos sus documentos — ver el ✅ de la cabecera. Lo pintan el
  // teaser de /competitive-advantage (como titular) y el hero de /foundation
  // (como eyebrow), así que el cambio entra en los dos sitios de una vez.
  nombreLegal: 'Bávaro Reefs Foundation',

  // Titular de la página. Es la frase del propio cliente (slide 63): sube al
  // hero porque resume la fundación entera en siete palabras, y así la
  // sección de proyectos deja de repetirla como su h2 (antes el mismo texto
  // salía DOS veces en la misma página, a dos pantallas de distancia).
  lema: 'Caring for the reefs starts with people',
  heroTexto:
    'Coral restoration and artificial reefs at Playa Bávaro since 2016, alongside the Ministry of Environment.',

  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 7: «Los datos de la derecha»]
  // Los CUATRO datos aprobados, en su orden. Sustituyen a los 3 que había
  // (2016 · 3rd coral nursery · Partners), que decían lo mismo con menos:
  //   · «3rd coral nursery in the country» SALE. No está en el copy nuevo y no
  //     es un detalle menor — era un puesto en un ranking. Su sitio lo ocupa
  //     «one of the leading coral restoration programs», que es como lo cuenta
  //     él ahora. Si el 3er puesto sigue siendo cierto, es dato suyo y vuelve.
  //   · Entran el ÁREA MARINA PROTEGIDA y las TORTUGAS VERDES, que son los dos
  //     hechos que la página lleva contando desde arriba y que aquí no tenían
  //     ficha.
  // Los dos últimos vienen como frase corrida en el documento («One of the
  // Dominican Republic's leading coral restoration programs»); se parten en
  // sujeto + afirmación para que entren en la misma anatomía que los otros dos,
  // que él SÍ escribe partidos. No se recorta ni se sube ningún claim: «one of
  // the leading» sigue diciendo «one of the leading».
  hitos: [
    { cifra: '2016', texto: 'Foundation established' },
    { cifra: 'Protected marine area', texto: 'working alongside the Ministry of Environment' },
    { cifra: 'Coral restoration', texto: "one of the Dominican Republic's leading programs" },
    { cifra: 'Green sea turtles', texto: 'largest population in the Dominican Republic' },
  ],

  // LA HISTORIA, EN TRES TIEMPOS. Antes eran dos párrafos de ~60 palabras
  // seguidos: toda la información estaba, pero había que leérselos enteros
  // para sacar los tres momentos que de verdad cuentan (el problema, la
  // decisión, el resultado). Aquí es el MISMO texto troceado en esos tres
  // tiempos, con la foto de cada uno — sin un dato nuevo ni uno perdido.
  cronologiaEyebrow: 'How it started',
  cronologia: [
    {
      marca: 'Before',
      titulo: 'The reef was being lost',
      texto:
        'Our daily operation at Playa Bávaro witnessed the decline of marine ecosystems as tourism grew.',
      foto: 'galeria-snorkel-lovers-1',
      fotoAlt: 'Coral on the reef bed at Playa Bávaro',
    },
    {
      marca: '2016',
      titulo: 'Restoration begins',
      texto:
        'A coral restoration and artificial reef building project, in collaboration with the Ministry of Environment.',
      foto: 'galeria-snorkel-lovers-13',
      fotoAlt: 'Coral fragments growing on the nursery structures, with a fish among them',
    },
    {
      marca: 'Today',
      titulo: 'Third nursery in the country',
      texto:
        'The project is recognized as the third most important coral nursery in the Dominican Republic.',
      foto: 'galeria-snorkel-lovers-3',
      fotoAlt: 'Artificial reef structures covered in fish underwater',
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
  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 8] Titular y párrafo
  // APROBADOS. Dicen lo mismo que la redacción de la casa («dos personas y la
  // empresa cuya operación diaria vio el problema») con dos ganancias: el
  // titular deja de contar cuántos son —que ya lo dicen las tres cards de
  // debajo— y nombra POR QUÉ están ahí, y el párrafo cierra con los cuatro
  // frentes de la fundación (ciencia, educación, comunidad y gestión a largo
  // plazo), que es lo que la conecta con la sección de proyectos.
  // El eyebrow se queda: sigue presentando exactamente lo que viene.
  // La raya larga del original («initiatives—bringing together…») pasa a coma.
  fundadoresEyebrow: 'Who’s behind it',
  fundadoresTitulo: 'Built by people who refused to look away.',
  fundadoresIntro:
    "The Bávaro Reefs Foundation was born from the shared vision of marine conservationists and Hispaniola Aquatic Adventures. What began as a commitment to protect the reefs where we operate has grown into one of the Dominican Republic's leading marine conservation initiatives, bringing together science, education, community engagement and long-term environmental stewardship.",
  fundadores: [
    {
      id: 'fernando',
      nombre: 'Fernando Sánchez Fernández',
      rol: 'Co-founder',
      iniciales: 'FS',
      foto: null,
    },
    {
      id: 'manuel',
      nombre: 'Manuel Alejandro Redondo',
      rol: 'Co-founder',
      iniciales: 'MR',
      foto: null,
    },
    {
      id: 'hispaniola',
      nombre: 'Hispaniola Aquatic Adventures',
      rol: 'Company backing the foundation',
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
    eyebrow: 'The flagship project',
    titulo: 'Artificial Reefs',
    texto:
      'Creating the ecological conditions needed for the restoration and growth of coral reefs, through environmental monitoring and protection.',
    fotos: [
      {
        src: 'galeria-snorkel-lovers-4',
        alt: 'Artificial reef blocks on the seabed, surrounded by fish',
      },
      {
        src: 'galeria-snorkel-lovers-18',
        alt: 'A sea turtle swimming over the Bávaro reef',
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
      // [2026-08-21] Foto REAL de la fundación. El cliente nombró cada
      // archivo con la sección a la que va; antes cada frente tomaba prestado
      // un tile de la galería de Coral Quest.
      foto: 'fundacion-coral',
      fotoAlt: 'Staghorn coral growing on the nursery structures',
    },
    {
      clave: 'Biodiversity',
      titulo: 'Restoring Marine Biodiversity',
      claim: 'A healthy reef needs abundant marine life.',
      texto:
        'Our restoration strategy goes beyond corals by increasing fish populations, protecting key species and rebuilding the ecological balance that allows reefs to flourish naturally.',
      // [2026-08-21] `RESTORING MARINE.jpg`, que es como el cliente llamó al
      // archivo de esta sección. El 20 lo puse por error en «Working with
      // Local Fishermen» —sale un pescador lanzando la atarraya— y Samuel lo
      // recolocó: el nombre del archivo manda.
      foto: 'fundacion-biodiversidad',
      fotoAlt: 'A local fisherman casting his net over the reef',
    },
    {
      clave: 'Clean-ups',
      titulo: 'Cleaner Oceans',
      claim: 'Healthy ecosystems begin with clean waters.',
      texto:
        'Regular coastal and underwater clean-up campaigns remove marine debris, improve habitat quality and protect the ecosystems that support marine life.',
      // [2026-08-20] Foto REAL de la campana, de la entrega del cliente. Antes
      // se apoyaba en un hueco de galeria cuyo alt hablaba de un grupo en la
      // orilla: no ensenaba ni una bolsa de basura.
      foto: 'fundacion-limpieza',
      fotoAlt: 'Volunteers with the bags of debris collected during a beach clean-up',
      contexto: true,
    },
    {
      clave: 'Fishermen',
      titulo: 'Working with Local Fishermen',
      claim: 'Conservation succeeds when communities succeed.',
      texto:
        'We work alongside local fishermen, promoting sustainable practices and creating opportunities that align livelihoods with long-term marine conservation.',
      // [2026-08-23, 2ª entrega del cliente] POR FIN LA FOTO DE ESTA SECCIÓN.
      // Historia corta de este hueco: el 20 se le puso el pescador de
      // `RESTORING MARINE.jpg` y Samuel lo devolvió a biodiversidad el 21,
      // porque ese archivo es de allí; el hueco se quedó con la de snorkel
      // que tenía —sin un solo pescador dentro, bajo el titular «Working with
      // Local Fishermen»—, a la espera de material.
      // Ahora el cliente manda `WORKING WITH LOCAL FISHERMEN.jpg`, nombrado
      // con el título exacto de la sección, que es la convención de toda su
      // carpeta. Es la foto institucional del acuerdo: la comunidad pesquera
      // con la Armada y el equipo, en el centro de interpretación.
      foto: 'fundacion-pescadores',
      fotoAlt:
        'The Hispaniola team with local fishermen, the Navy and authorities at the marine interpretation centre',
      contexto: true,
    },
    {
      clave: 'Education',
      titulo: 'Environmental Education & Ecotourism',
      claim: 'Protecting what people learn to value.',
      texto:
        'Every visitor, student and local resident becomes part of our mission through educational experiences that inspire long-term stewardship of the Caribbean.',
      // [2026-08-21] Foto REAL, del archivo que el cliente nombró con esta
      // misma sección.
      foto: 'fundacion-educacion',
      fotoAlt: 'A Hispaniola guide explaining the coral nursery to a visiting group',
    },
    {
      clave: 'Protected area',
      titulo: 'Marine Protected Area Management',
      claim: 'Turning protection into action.',
      texto:
        'Working alongside the Ministry of Environment, we help manage the protected marine area where we operate through monitoring, scientific data collection and on-the-water conservation efforts.',
      // [2026-08-21] Foto REAL, `MARINE PROTECTED AREA MANAGEMENT.jpg`. Antes
      // tiraba de la textura de fondo de los banners, que es agua sin sujeto.
      foto: 'fundacion-area-protegida',
      fotoAlt: 'A sea turtle over the reef of the protected marine area',
      contexto: true,
    },
  ],

  // Slide 64, banda verde. El botón lleva a /contacto y no a una página de
  // membresías porque esa página no existe: no hay niveles definidos, ni
  // precios, ni pasarela de cobro (mismo bloqueo Odoo que el resto de pagos).
  // Recoger interés real desde el primer día es preferible a prometer un
  // flujo que no está.
  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 12: «Tarjeta izquierda»]
  // Titular, párrafo y botón APROBADOS. De paso caen las DOS ÚLTIMAS cadenas
  // en español de este bloque («Membresías» / «Conoce nuestras membresías»),
  // que se le escaparon al barrido de F7 porque el resto de la tarjeta sí
  // estaba en inglés.
  //
  // ⚠️ EL BLOQUE YA NO HABLA DE MEMBRESÍAS. El copy nuevo pide apoyar a la
  // fundación —sin niveles ni cuotas—, que además es lo único que el sitio
  // puede sostener hoy (no hay producto de membresía: ni precios, ni pasarela).
  // El eyebrow se traduce y se queda en «Memberships» porque es lo que dice el
  // chip de la barra de anclas y el ancla `#membresias`; si esto se queda así,
  // conviene renombrar los tres a la vez.
  membresiasEyebrow: 'Memberships',
  membresiasTitulo: 'Become Part of the Change',
  membresiasTexto:
    "Every contribution helps expand coral restoration, protect endangered wildlife, support environmental education and strengthen one of the Dominican Republic's most impactful marine conservation initiatives.",
  membresiasCta: 'Support the Foundation',

  // ---------- Copy exclusivo del TEASER en /ventaja-competitiva ----------
  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pags. 6-7] Copy APROBADO, literal.
  // El teaser dejaba la fundación en una sola frase de contexto («Behind every
  // tour there is a foundation with a name of its own…»), escrita por nosotros
  // para presentarla sin repetir su página. El cliente escribe ahora esas
  // líneas, y son mejores porque no la presentan: la explican — por qué existe
  // (2016, «if our business depends on the ocean…»), qué la separa de un
  // lavado de cara (el credo de dos líneas) y qué ha conseguido con el
  // Ministerio.
  //
  // ⚠️ ESTE COPY ES EL DEL HERO DE /foundation EN EL DOCUMENTO. Se monta aquí
  // porque es lo que Samuel pidió (2026-08-07) y porque el teaser es el único
  // sitio donde hoy se pinta. Cuando /foundation adopte su hero v3, los dos
  // bloques se van a mirar de frente: o el teaser se queda con el claim + el
  // credo (que es lo que engancha) o la página cambia de entrada. Decidirlo
  // entonces, no duplicarlo.
  teaserEyebrow: 'Our foundation',
  teaserClaim: 'Protecting the place that has given us everything.',
  teaserTexto: [
    'Founded in 2016, the Bávaro Reefs Foundation was created with a simple belief: if our business depends on the ocean, we have a responsibility to protect it.',
    "Working alongside the Dominican Republic's Ministry of Environment, we've helped restore coral reefs, protect one of the country's most important green sea turtle habitats and contribute to the conservation of the protected marine area where we operate today. Every guest who sails with us helps make this work possible.",
  ],
  // El credo, entre los dos párrafos: dos frases que se contestan y que en
  // párrafo corrido se perderían. Es la misma figura que la letanía de esta
  // página («You're helping…»), así que se pinta con su mismo recurso.
  teaserCredo: [
    "We didn't create a foundation to support our business.",
    'We built a business that could support conservation.',
  ],
  teaserCta: 'Meet the Foundation',
} as const
