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

/**
 * Un importe por huésped de la sección «A dónde va tu aporte». Son 4 campos y
 * no 2 a propósito: con solo cifra + etiqueta (como estaba hasta el
 * 2026-07-28) no se entendía ni por quién se paga ni en qué se gasta.
 */
export type AporteSost = {
  valor: string
  /** «por huésped» — el matiz que lo separa de «por reserva» */
  unidad: string
  destino: string
  detalle: string
}

export type PilarSost = {
  /** ancla estable para deep-links / migaja interna */
  id: string
  titulo: string
  texto: string
  /**
   * Sub-hitos con nombre propio dentro del paso (slide 60 del cliente). Solo
   * el pilar de conservación los tiene: su párrafo enumeraba tres logros en
   * prosa corrida y la maqueta los separa, con razón — «áreas marinas
   * protegidas», «tortugas verdes» y «restauración de coral» son tres cosas
   * distintas y verificables, no una lista dentro de una frase.
   */
  hitos?: { titulo: string; texto: string }[]
  /** foto de apoyo del paso en el recorrido (nombre en /public/fotos, sin extensión) */
  foto: string
  fotoAlt: string
}

/**
 * Los 7 chips de secciones de /ventaja-competitiva (slide 58 del cliente,
 * plan 08 §2). En el ORDEN REAL de la página, no en el de la maqueta — ver
 * ui/nav-anclas-chips.tsx para el porqué.
 *
 * ⚠️ Cada `id` tiene que existir como `id` de una sección de ESTA página. Si
 * se renombra uno, el chip deja de llevar a ninguna parte (no rompe nada: el
 * scroll-spy ignora los ids inexistentes, que es justo lo que lo hace fácil
 * de no notar). El componente los verifica en desarrollo — ver el aviso de
 * consola en ui/nav-anclas-chips.tsx.
 *
 * [v2 2026-07-28] «Proyectos» y «Membresías» eran enlaces a /fundacion; pasan
 * a anclas LOCALES porque los slides 63 y 64 ya viven también en esta página
 * (Samuel: «la info del slide 63 parece que no está… y el slide 64 tampoco»).
 * Los 7 chips son ahora 7 secciones de aquí, en el orden real de lectura.
 */
export const ANCLAS_VENTAJA = [
  { id: 'conservacion', label: 'Conservation' },
  { id: 'comunidades', label: 'Community' },
  { id: 'ancla-impacto', label: 'Impact per guest' },
  { id: 'ancla-videos', label: 'On video' },
  { id: 'ancla-fundacion', label: 'The foundation' },
  { id: 'ancla-proyectos', label: 'Projects' },
  { id: 'ancla-membresias', label: 'Memberships' },
]

export type VideoSost = {
  /** id de YouTube — también el nombre del póster en /video/sostenibilidad */
  id: string
  titulo: string
}

// Los 7 videos de competitive-advantage.php, en su mismo orden. El póster de
// cada uno se descargó de YouTube a /public/video/sostenibilidad/{id}.jpg (sin
// hotlink externo); el embed solo se carga al abrir el modal.
export const VIDEOS_SOSTENIBILIDAD: VideoSost[] = [
  { id: '6ixzXs68DPQ', titulo: 'Coral restoration laboratory and museum' },
  { id: 'r0XFksQSfrU', titulo: 'Our floating kitchen' },
  { id: 'ziUx_05VC-4', titulo: 'Where the food begins' },
  { id: 'KdGvJqdeaC0', titulo: 'Snorkeling on the coral reef' },
  { id: 'sjyNxW6iNIs', titulo: 'Restoring the coral reefs' },
  { id: 'GXA4y8JQ2v8', titulo: 'Protecting sea turtles' },
  { id: 'aMVg2cL3Z8o', titulo: 'Manatee watching' },
]

export const SOSTENIBILIDAD = {
  // [v2 2026-07-27, plan 08 §1] REENCUADRE, no página nueva. El slide 57 dice
  // «nueva pagina de ventajas competitivas», pero Samuel se lo preguntó al
  // cliente en la reunión del 07-24 («¿qué diferencia hay con el anterior?») y
  // la respuesta fue: «básicamente [lo mismo]» (34:17). Así que NO hay ruta
  // nueva — se reencuadra esta.
  //
  // Curiosamente el repo ya sabía esto: data/sostenibilidad.ts documenta que
  // la página fusiona sustainability.php Y competitive-advantage.php, y el
  // bloque de videos ya llevaba `videosEyebrow: 'Nuestra ventaja competitiva'`.
  // La idea estaba enterrada en una sección; ahora encuadra la página.
  eyebrow: 'Our competitive advantage',
  titulo: 'Your booking supports our people and the sea',
  // Hero corto a propósito (rediseño 2026-07-17, pedido de Samuel: "el texto
  // de la descripción del hero está muy largo") — la declaración completa
  // (Bávaro Reefs Foundation, "empoderar a nuestra gente", RD) no se pierde:
  // se muda a `mision`, el bloque editorial que abre la página. Desde
  // 2026-07-22 ese bloque vive en IntroSostenibilidad, a dos columnas con un
  // video al lado (y por eso baja de tamaño: --text-sost-mision).
  sub: 'It’s not an add-on: it’s the foundation of how we operate, at sea and on land.',
  // [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pags. 1-2] La mision APROBADA.
  // Sustituye a una declaracion de principios de tres lineas por LA HISTORIA
  // que la sostiene: documentaron colisiones de barcos con tortugas verdes en
  // peligro y con eso impulsaron la proteccion de uno de los ecosistemas
  // costeros mas importantes del pais, hoy gestionado con el Ministerio de
  // Medio Ambiente y con guardaparques propios.
  //
  // Es EL argumento diferencial del cliente y es exactamente lo que Miguel
  // dijo en la reunion del 07-31: «es la unica empresa que se apoya en la
  // parte sostenible, por aqui nadie hace nada de eso». Por eso no va en un
  // parrafo corrido: la historia se separa (`historia`) y la letania de cinco
  // lineas (`letania`) es un momento editorial propio.
  misionEyebrow: 'Our mission',
  misionTitulo: 'Every journey you take helps protect the Caribbean you came to discover.',
  mision:
    'At Hispaniola Aquatic Adventures, we believe tourism should leave places better than it found them. Every guest who joins us helps restore coral reefs, protect marine wildlife, support local communities and fund long-term conservation through the Bávaro Reefs Foundation.',
  misionPuente: 'But our commitment goes far beyond reef restoration.',
  historia:
    "Over the past few years, our team has led one of the Dominican Republic's most impactful marine conservation initiatives. After documenting repeated boat collisions with endangered green sea turtles, we helped drive the protection of one of the country's most important coastal ecosystems. Today, that protected marine area is actively managed through a collaboration between our Foundation and the Ministry of Environment, with dedicated park rangers working every day to safeguard its future.",
  letaniaIntro: "When you sail with us, you're not simply booking a tour.",
  letania: [
    "You're helping restore coral reefs.",
    "You're protecting endangered wildlife.",
    "You're supporting environmental education.",
    "You're creating opportunities for local families.",
    "And you're proving that tourism can become one of nature's greatest allies.",
  ],
  letaniaCierre:
    "Because the greatest souvenir isn't what you take home. It's knowing you helped preserve the Caribbean for everyone who comes after you.",
  // PLAN-INTERNAS-V2.md: fotos del hero-interna (fundido, no foto fija) — las
  // mismas 3 del arrecife/vivero de coral que ya usa la home en Experiencia,
  // reales y ya curadas, no nuevas.
  galeria: ['galeria-snorkel-lovers-3', 'galeria-semi-privado-1', 'galeria-snorkel-lovers-6'],
  fotoAlt: 'Snorkeling over the coral reef the foundation restores',

  pilaresTitulo: 'How we make it happen',
  // ⚠️ FOTOS DE APOYO del recorrido (2026-07-22, 3ª vuelta): una por paso, va
  // apareciendo según avanza el recorrido. Todas son fotos REALES del cliente
  // (galerías de los tours), ninguna de stock — ojo con las `equipo-*.webp`,
  // que SÍ son stock de estudio y por eso no se usan aquí.
  // Ninguna repite las 3 del hero de esta misma página (ver `galeria` arriba).
  pilares: [
    {
      id: 'conservacion',
      titulo: 'Conservation and protected areas',
      // [v2 2026-07-28, slide 60] El párrafo enumeraba los 3 logros en prosa
      // corrida; ahora los presenta y cada uno se cuenta aparte, en `hitos`.
      // Es la estructura de su maqueta y es mejor: son tres cosas distintas
      // y verificables, no una coma dentro de una frase larga.
      texto: 'Through direct financial contributions and active collaboration, we support the Bávaro Reefs Foundation in real environmental milestones that protect the sea for future generations.',
      hitos: [
        {
          titulo: 'Marine protected areas',
          texto: 'Creating and expanding protected areas, safeguarding vital habitats for future generations.',
        },
        {
          titulo: 'Green sea turtle recovery',
          texto: 'Significant progress in the recovery and monitoring of their populations in the Dominican Republic.',
        },
        {
          titulo: 'Coral restoration',
          texto: 'Successful initiatives at Coral Garden, today one of the most effective reef restoration areas in the country.',
        },
      ],
      // La foto MÁS literal de todo el proyecto para este pilar: una estructura
      // de vivero de coral con su placa de Hispaniola, lista para sembrar.
      foto: 'galeria-snorkel-lovers-15',
      fotoAlt: 'A Hispaniola coral nursery structure ready to be planted on the reef',
    },
    {
      id: 'comunidades',
      titulo: 'Direct support for local communities',
      texto: 'Sustainability is also about caring for people. Beyond environmental action, we actively support a local orphanage, contributing to the well-being and development of vulnerable children in our community. For us, protecting the environment and social responsibility go hand in hand.',
      // ⚠️ PROVISIONAL — decisión consciente de Samuel (2026-07-22): NO existe
      // ni una foto del orfanato ni de la acción comunitaria en todo el
      // proyecto, así que esta ilustra "personas", no lo que dice el texto.
      // Es EL pendiente de contenido de esta página: pedir al cliente fotos
      // propias de la fundación (mismo pendiente que la foto de cabecera).
      // Sustituir en cuanto lleguen — no hace falta tocar código, solo este
      // par de campos.
      foto: 'galeria-snorkel-lovers-12',
      fotoAlt: 'Two people snorkeling together over the reef',
    },
    {
      id: 'operacion',
      titulo: 'Responsible operations and valuing our team',
      // Detalle portado del original (sustainability.php: "a percentage is
      // also allocated to our office and sales teams") — faltaba en la 1ª
      // versión de este copy; los montos exactos ($3.50/$2.00) se muestran
      // aparte, en `stats`.
      texto: 'Sustainability starts from within: we invest in our team with fair pay, continuous training and high safety standards, so that every experience reflects our mission. An additional percentage goes to our office and sales teams, the foundation of flawless service on every booking.',
      // Tripulación REAL uniformada trabajando en el bar flotante. Se descartó
      // cocina-flotante.webp (también real y también del equipo) porque el
      // primer plano son dos turistas sin camiseta haciendo el payaso: lee
      // como fiesta, no como "salario justo, formación y estándares de
      // seguridad", que es lo que dice el párrafo.
      foto: 'bar-flotante',
      fotoAlt: 'Hispaniola crew running the floating bar out at sea',
    },
  ] satisfies PilarSost[],

  // ---------- Banda de impacto (2026-07-22, pedido de Samuel) ----------
  // ⚠️ PROCEDENCIA DE LAS CIFRAS: las 4 de `impacto` (corales, tortugas, m² de
  // arrecife, niños) NO salen de sustainability.php — la página vieja cuenta
  // los hitos en prosa, sin números. Vienen del MOCKUP que aportó Samuel el
  // 2026-07-22 ("además de eso debemos agregar estos datos"), o sea son dato
  // del cliente y se transcriben tal cual, sin redondear ni maquillar — mismo
  // trato que los US$ 3.50 / 2.00. Quedan pendientes de contrastar contra las
  // memorias reales de la Bávaro Reefs Foundation antes de publicar (mismo
  // pendiente que las fotos propias de la fundación, app/PLAN-v3.md §9).
  impactoEyebrow: 'Our impact',
  impactoTitulo: 'Your booking leaves a real mark',
  impacto: [
    { valor: '12.000+', label: 'corals planted' },
    { valor: '350', label: 'green sea turtles monitored' },
    { valor: '5.000 m²', label: 'of reef under restoration' },
    { valor: '200+', label: 'children supported' },
  ] satisfies StatSost[],
  // Los 2 aportes por huésped VIVÍAN dentro del pilar "operación" (como
  // `stats`); suben aquí porque son la BISAGRA de la banda: explican de dónde
  // salen las 4 cifras de arriba. Dejarlos en los dos sitios los duplicaba.
  // ---------- A dónde va tu aporte (slide 61) ----------
  // [v2 2026-07-28, 2ª vuelta, pedido de Samuel: «lo de por cada huésped e
  // iniciativas a la fundación, como que no se entiende mucho el dinero que
  // se da, está raro; yo solo pondría en el cuadro gris los 4 puntos, y eso
  // del dinero hay que ubicarlo de mejor forma en otra parte»]
  //
  // Los 2 importes vivían como PIE de la banda de impacto: dos cifras en una
  // fila, con un rótulo lateral, sin decir de dónde salen ni para qué. Tenía
  // razón — así se leían como una nota al margen, no como el mecanismo.
  // Ahora son SECCIÓN PROPIA (sostenibilidad/aporte-sostenibilidad.tsx),
  // justo debajo de las cifras, y cada importe dice las tres cosas que hacen
  // falta para entenderlo: cuánto, por quién (por huésped, no por reserva) y
  // en qué se gasta. El «de forma fija, no de lo que sobre» del lead es lo
  // que separa esto de un donativo simbólico, que es como sonaba antes.
  //
  // El detalle del equipo NO repite el del pilar «Operación responsable»: allí
  // se cuenta la política (salario justo, formación, seguridad), aquí a qué
  // partida va el dinero, con el vocabulario del propio cliente.
  // [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pags. 5 y 12] Copy APROBADO.
  // ⚡ EL APORTE AL EQUIPO SUBE: US$ 3.50 -> US$ 4.50. El 3.50 se porto de su
  // web vieja; el copy nuevo dice 4.50 en dos sitios distintos del mismo
  // documento, asi que manda el aprobado. El de conservacion no cambia (2.00).
  aporteEyebrow: 'Responsible operations',
  aporteTitulo: 'Where Your Contribution Creates Impact',
  aporteLead:
    "Every contribution is fixed per guest—not based on what's left over. Sustainability starts from within, so part of every booking is already assigned before you step on board.",
  aportes: [
    {
      valor: 'US$ 4.50',
      unidad: 'per guest',
      destino: 'Investing in Our People',
      detalle:
        'Fair compensation, continuous training, performance incentives, workplace safety and the operational teams that make every experience seamless—from reservation to return.',
    },
    {
      valor: 'US$ 2.00',
      unidad: 'per guest',
      destino: 'Protecting the Caribbean',
      detalle:
        'Coral restoration, green sea turtle monitoring and the conservation projects led by the Bávaro Reefs Foundation—because lasting sustainability begins long before we set sail.',
    },
  ] satisfies AporteSost[],

  // [v2 2026-07-28, slide 59] Eyebrow y titular se INTERCAMBIAN de papel. El
  // eyebrow decía «Nuestra ventaja competitiva», que desde el reencuadre (§1)
  // es el eyebrow del HERO — repetirlo a media página lo gastaba. El cliente
  // ya trae la solución en su maqueta: el rótulo pasa a ser «Lo que nos
  // diferencia, en video» (lo que era el titular) y el titular, su
  // «Míralo con tus propios ojos», que además invita en vez de describir.
  videosEyebrow: 'What sets us apart, on video',
  videosTitulo: 'See it with your own eyes',
  videosTexto: 'A series of short videos showing the key factors that set us apart from other companies offering similar services in the area.',

  // ---------- Cierre: las 2 tarjetas de CTA (slide 64) ----------
  // [v2 2026-07-28, 5ª vuelta, Samuel: «los 2 banners CTA que estén uno al
  // lado del otro y sean similares a cards de precios; por supuesto no tienen
  // precios, pero estéticamente sean de ese estilo»]
  //
  // El slide 64 son dos bandas apiladas (la verde de membresías y la navy de
  // «Arrecifes más sanos…»). Pasan a dos tarjetas gemelas en paralelo, con la
  // anatomía de una tabla de precios: rótulo, titular, texto, lista de
  // puntos y un botón a ancho completo abajo. La de reservar va destacada
  // (oscura, sobre la foto), como el «plan recomendado» de esa anatomía.
  //
  // ⚠️ LOS PUNTOS NO SON INVENTADOS. Son datos que ya viven en el proyecto:
  // los dos importes por huésped (`aportes`, portados de sustainability.php),
  // el reconocimiento del tercer vivero y el convenio con Medio Ambiente
  // (`FUNDACION.hitos`, slide 62) y dos de los cinco frentes reales de la
  // fundación (`FUNDACION.frentes`, slide 63). Una tabla de precios se
  // sostiene con lo que de verdad incluye — inventar viñetas para rellenar la
  // forma sería exactamente lo contrario.
  //
  // El eyebrow y el titular adoptan los del cliente (su slide separa
  // «DEJANDO UNA HUELLA POSITIVA» de «Arrecifes más sanos, comunidades más
  // fuertes»), y el texto se acorta al suyo: el nuestro decía lo mismo en 55
  // palabras y, junto a la tarjeta de membresías, desequilibraba la pareja.
  cierreEyebrow: 'Leaving a positive mark',
  cierreTitulo: 'Healthier reefs, stronger communities',
  cierreTexto: 'Every company leaves a mark where it operates. We want ours to be a positive one: from marine conservation to community work, ethical operations and the development of our team. Booking with us means adding to a more sustainable future for the Dominican Republic.',
  cierrePuntos: [
    'US$ 4.50 invested in our operational and guest experience teams',
    'US$ 2.00 per guest to the foundation’s initiatives',
    'Third most important coral nursery in the country',
  ],
  membresiasPuntos: [
    'Coral restoration and artificial reefs',
    'Environmental education with schools and the community',
    'Agreement with the Ministry of Environment',
  ],
  // Foto de fondo del cierre (2026-07-17, pedido de Samuel: "ponle el mismo
  // background de fondo del mar que tiene el banner de nosotros"). Mismo
  // asset que /nosotros (ArrecifeTeaser) y el mismo idioma visual — foto
  // cenital turquesa + gradiente navy encima, texto blanco a la izquierda.
  // Sin CTA: el "Ver disponibilidad" canónico vive en el Footer Océano,
  // justo debajo — duplicarlo aquí serían dos botones pegados.
  cierreFoto: 'arrecife-fondo-cenital',
}
