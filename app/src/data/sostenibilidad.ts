import { traducible } from '@/lib/i18n'

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
  /**
   * [v3 2026-08-07] Pasa de una frase a UNA LISTA DE PÁRRAFOS: el copy
   * aprobado da al aporte de conservación dos, y el segundo no es una coletilla
   * del primero (uno enumera en qué se gasta, el otro explica que el importe es
   * fijo). Juntarlos en un párrafo de seis líneas dentro de una card los
   * escondía.
   */
  detalle: string[]
}

export type PilarSost = {
  /** ancla estable para deep-links / migaja interna */
  id: string
  titulo: string
  /**
   * [v3 2026-08-07] La línea que VENDE el pilar, antes de su párrafo
   * («Conservation succeeds when people become part of it»). Es del cliente y
   * no todos los pilares la traen. Mismo campo, mismo papel y mismo trato
   * visual que el `claim` de las zonas de /facilities.
   */
  claim?: string
  texto: string
  /**
   * Sub-hitos con nombre propio dentro del paso (slide 60 del cliente). Solo
   * el pilar de conservación los tiene: su párrafo enumeraba tres logros en
   * prosa corrida y la maqueta los separa, con razón — «áreas marinas
   * protegidas», «tortugas verdes» y «restauración de coral» son tres cosas
   * distintas y verificables, no una lista dentro de una frase.
   * [v3 2026-08-07] Cada uno estrena su propio `claim`: el copy aprobado da a
   * los tres una frase-titular además del párrafo.
   */
  hitos?: { titulo: string; claim?: string; texto: string }[]
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
export const ANCLAS_VENTAJA = traducible([
  { id: 'conservacion', label: 'Conservation' },
  { id: 'comunidades', label: 'Community' },
  { id: 'ancla-impacto', label: 'Impact per guest' },
  { id: 'ancla-videos', label: 'On video' },
  { id: 'ancla-fundacion', label: 'The foundation' },
  { id: 'ancla-proyectos', label: 'Projects' },
  { id: 'ancla-membresias', label: 'Memberships' },
])

export type VideoSost = {
  /** id de YouTube — también el nombre del póster en /video/sostenibilidad */
  id: string
  titulo: string
}

// Los 7 videos de competitive-advantage.php, en su mismo orden. El póster de
// cada uno se descargó de YouTube a /public/video/sostenibilidad/{id}.jpg (sin
// hotlink externo); el embed solo se carga al abrir el modal.
export const VIDEOS_SOSTENIBILIDAD: VideoSost[] = traducible([
  { id: '6ixzXs68DPQ', titulo: 'Coral restoration laboratory and museum' },
  { id: 'r0XFksQSfrU', titulo: 'Our floating kitchen' },
  { id: 'ziUx_05VC-4', titulo: 'Where the food begins' },
  { id: 'KdGvJqdeaC0', titulo: 'Snorkeling on the coral reef' },
  { id: 'sjyNxW6iNIs', titulo: 'Restoring the coral reefs' },
  { id: 'GXA4y8JQ2v8', titulo: 'Protecting sea turtles' },
  { id: 'aMVg2cL3Z8o', titulo: 'Manatee watching' },
])

export const SOSTENIBILIDAD = traducible({
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
      // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pags. 3-4: «CHANGE:»] EL PILAR
      // ENTERO ES COPY APROBADO, literal: el titular, la entradilla y los tres
      // hitos con su frase-titular y su párrafo.
      //
      // La ESTRUCTURA que ya tenía (pilar + 3 hitos con nombre propio) resulta
      // ser exactamente la del documento —él numera 01/02/03 dentro del punto
      // 1—, así que no hay que reorganizar nada: cada hito estrena `claim` y
      // sus párrafos de una línea pasan a ser los suyos, que cuentan el CÓMO
      // (el Ministerio de Medio Ambiente, la microfragmentación, el
      // seguimiento de las tortugas) en vez de afirmar el QUÉ.
      //
      // Titulares en caja baja, como el resto de esta página: el cliente
      // escribe este en versales y el del punto 2 en Title Case, o sea no hay
      // señal de estilo que respetar — y son tres epígrafes de una misma lista.
      titulo: 'Conservation & protected areas',
      texto:
        'Every conservation project we lead has one shared purpose: protecting the ecosystems that make Punta Cana extraordinary. Together with our guests, scientists and environmental authorities, we restore reefs, protect endangered wildlife and create measurable impact that will benefit the Caribbean for generations to come.',
      hitos: [
        {
          titulo: 'Marine protected areas',
          claim: 'Protecting an ecosystem is the greatest form of conservation.',
          texto:
            "Our conservation work helped support the creation of a protected marine area, now managed in collaboration with the Dominican Republic's Ministry of Environment. Together, we're implementing long-term actions that safeguard one of Punta Cana's most valuable coastal ecosystems.",
        },
        {
          titulo: 'Green sea turtle conservation',
          claim: "Protecting one of the country's most important sea turtle habitats.",
          texto:
            "The reefs where we operate are home to one of the Dominican Republic's largest populations of endangered green sea turtles. Through monitoring, education and active protection, we work every day to make these waters a safer place for future generations.",
        },
        {
          titulo: 'Coral reef restoration',
          claim: 'Rebuilding reefs, one coral at a time.',
          // ⚠️ SE PIERDE «Coral Garden» con nombre propio, que era el dato más
          // verificable del hito viejo. No está en el copy nuevo y no se
          // rescata por libre: si el cliente lo quiere, es una frase suya.
          texto:
            'From coral nurseries and laboratory propagation to microfragmentation and outplanting, we use science-based restoration techniques to help damaged reefs recover and create healthier marine habitats.',
        },
      ],
      // La foto MÁS literal de todo el proyecto para este pilar: una estructura
      // de vivero de coral con su placa de Hispaniola, lista para sembrar.
      foto: 'galeria-snorkel-lovers-15',
      fotoAlt: 'A Hispaniola coral nursery structure ready to be planted on the reef',
    },
    {
      id: 'comunidades',
      // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 4: «CHANGE:»] Copy
      // APROBADO. El pilar cambia de tema, no solo de redacción: de «apoyamos
      // un orfanato» pasa a EDUCACIÓN AMBIENTAL — comunidades, colegios,
      // autoridades y los miles de visitantes de cada año, con el tour como
      // vehículo.
      //
      // ⚠️ SE CAE EL ORFANATO, y con él el único contenido social concreto de
      // la web. Venía de sustainability.php (es del cliente, no inventado) y
      // NO sobrevive en ninguna otra página — solo queda su rastro en la cifra
      // «200+ children supported» de la banda de impacto, que ahora no tiene
      // quien la explique. El cliente lo tacha él mismo, así que se aplica;
      // pero si quiere conservarlo, hay que decidirle un sitio.
      titulo: 'Community & environmental education',
      claim: 'Conservation succeeds when people become part of it.',
      // El punto final es NUESTRO: el cliente cierra el párrafo sin puntuar.
      texto:
        'We work alongside local communities, schools, authorities and thousands of visitors every year, transforming every tour into an opportunity to inspire environmental awareness and create lasting change.',
      // ⚠️ PROVISIONAL — decisión consciente de Samuel (2026-07-22): NO existe
      // ni una foto de la acción comunitaria en todo el proyecto, así que esta
      // ilustra "personas", no lo que dice el texto. Con el copy nuevo encaja
      // algo mejor (dos personas haciendo snorkel = el visitante que se lleva
      // la conciencia ambiental), pero sigue sin ser lo que el párrafo cuenta:
      // ni comunidad, ni colegios, ni charla.
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
      // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 4: «CHANGE:»] El párrafo
      // APROBADO. El cliente solo manda el texto —este punto no lleva titular
      // nuevo—, así que el epígrafe se queda como estaba.
      // Dice lo mismo que la versión portada de sustainability.php (salario
      // justo, formación, seguridad) y añade lo que faltaba: los incentivos
      // por desempeño y el porqué («by taking care of our people first»).
      // ⚠️ Se cae el detalle de que una parte va a los equipos de oficina y
      // ventas. No se pierde de la página: es exactamente lo que desglosa el
      // aporte de US$ 4.50 por huésped, unas secciones más abajo, y con las
      // palabras del propio cliente.
      texto:
        'Exceptional experiences begin with exceptional people. We invest in fair compensation, continuous training, performance incentives and a culture where every team member feels valued. By taking care of our people first, we create better experiences for our guests and a stronger future for our community.',
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
  // [v3 2026-08-07] EL LEAD VUELVE AL QUE ESCRIBE EL CLIENTE (pág. 5). El que
  // había empezaba por «Every contribution is fixed per guest, not based on
  // what's left over», que es la frase con la que él CIERRA la card de los
  // US$ 2.00 (pág. 6): la pasada anterior repartió sus frases entre lead y
  // cards, y al bajar esa frase a su card —que es donde va— el lead la habría
  // repetido palabra por palabra tres centímetros más arriba.
  aporteLead:
    'Every guest who joins us contributes directly to both people and nature. A fixed portion of every reservation is invested in our team and the conservation projects led by the Bávaro Reefs Foundation, because lasting sustainability begins long before we set sail.',
  aportes: [
    {
      valor: 'US$ 4.50',
      unidad: 'per guest',
      destino: 'Investing in Our People',
      detalle: [
        'Fair compensation, continuous training, performance incentives, workplace safety and the operational teams that make every experience seamless, from reservation to return.',
      ],
    },
    {
      valor: 'US$ 2.00',
      unidad: 'per guest',
      destino: 'Protecting the Caribbean',
      // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 6] Los DOS párrafos
      // aprobados de esta card, literales. El primero sustituye al resumen que
      // había («coral restoration, green sea turtle monitoring…»): dice lo
      // mismo y añade lo que faltaba — educación ambiental, áreas protegidas e
      // iniciativas con la comunidad, que son los otros tres frentes de la
      // fundación. El segundo es el que blinda el dato: el aporte es FIJO por
      // huésped, no lo que sobre.
      // Las rayas largas del original («fixed per guest—not based on what's
      // left over—ensuring…») pasan a comas, que es lo que se está haciendo en
      // todo el copy de esta tanda.
      detalle: [
        'Coral reef restoration, green sea turtle conservation, environmental education, protected marine areas and community initiatives through the Bávaro Reefs Foundation.',
        "Every contribution is fixed per guest, not based on what's left over, ensuring continuous investment in both our people and the protection of Punta Cana's marine ecosystems.",
      ],
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
  // [v3 2026-08-07, WEBSITE-SOSTENIBILIDAD pag. 12: «Tarjeta derecha»] Las dos
  // tarjetas pasan a ser copy APROBADO de cabo a rabo — titular, párrafos,
  // checks y botón. La ANATOMÍA no cambia (el cliente la escribe exactamente
  // así: titular, texto, tres ✔ y botón), solo el texto.
  // ⚠️ El tercer check ya no dice «Third most important coral nursery in the
  // country»: el cliente cambia ese puesto en un ranking por «one of the
  // leading», igual que hizo en los datos de la fundación. Los dos importes
  // siguen siendo los mismos y siguen cuadrando con la sección «Where Your
  // Contribution Creates Impact» de más arriba.
  cierreEyebrow: 'Leaving a positive mark',
  cierreTitulo: 'Healthier Reefs. Stronger Communities.',
  cierreTexto: [
    "The Caribbean has given us everything. That's why every guest helps us give something back.",
    "Each reservation directly invests in our people, supports the Bávaro Reefs Foundation and protects the marine ecosystems that make Punta Cana extraordinary. Together, we're proving that tourism can become a force for conservation.",
  ],
  cierrePuntos: [
    'US$ 4.50 invested in our operational and guest experience teams',
    'US$ 2.00 invested in marine conservation through the Bávaro Reefs Foundation',
    "Supporting one of the Dominican Republic's leading coral restoration programs",
  ],
  // El botón vivía ESCRITO A MANO en cierre-doble.tsx («Book and leave your
  // mark»), que era el único copy del bloque fuera de data/. Baja aquí con el
  // texto aprobado. Es largo para un botón —es una frase de dos tiempos— pero
  // el botón ocupa el ancho de la tarjeta y aguanta; en móvil parte en dos
  // líneas, que es lo que hace su propia maqueta.
  cierreCta: 'Book Your Experience. Leave a Positive Legacy.',
  // [v3 2026-08-07, pag. 12: «Tarjeta izquierda»] Los tres checks aprobados.
  // Son los mismos tres frentes que ya listaba, con las palabras del cliente:
  // el segundo dice ahora «schools and local communities» y el tercero deja de
  // ser «un convenio» para ser lo que ese convenio produce, proyectos.
  membresiasPuntos: [
    'Coral reef restoration and artificial reefs',
    'Environmental education for schools and local communities',
    'Marine conservation projects developed with the Ministry of Environment',
  ],
  // Foto de fondo del cierre (2026-07-17, pedido de Samuel: "ponle el mismo
  // background de fondo del mar que tiene el banner de nosotros"). Mismo
  // asset que /nosotros (ArrecifeTeaser) y el mismo idioma visual — foto
  // cenital turquesa + gradiente navy encima, texto blanco a la izquierda.
  // Sin CTA: el "Ver disponibilidad" canónico vive en el Footer Océano,
  // justo debajo — duplicarlo aquí serían dos botones pegados.
  cierreFoto: 'arrecife-fondo-cenital',
})
