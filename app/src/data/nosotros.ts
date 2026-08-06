// Página NOSOTROS (/nosotros) — mapea about-hispaniola.php de la web actual
// (Crew + Fleet; Foundation ya vive aparte, en /sostenibilidad desde que es
// tab propio — 2026-07-17).
//
// REDISEÑO 2026-07-17 (pedido de Samuel: "hay que darle mucho amor y cariño
// a las páginas internas... la nuestra hay puras cajas, está horrible
// planteada"): la página pasa de 3 bloques planos (chips sin texto + 3 cards
// de foto+nombre + caja de cierre) a portar el contenido REAL de
// about-hispaniola.php?lang=es — bienvenida, diferenciador de grupos
// pequeños, el itinerario contado como historia (3 paradas), la cocina
// flotante como diferenciador único, y AHORA (2ª vuelta, mismo día — Samuel:
// "empieza con el plan pero mete toda la flota de barcos, todo el contenido
// que haya en la original lo metemos en la nueva") los 6 CATAMARANES CON
// NOMBRE PROPIO de la flota real, no la versión simplificada
// (Catamarán A/B) que tenía prototipo/datos.js. Fotos de los 6 barcos + de
// la cocina/bar flotante DESCARGADAS de hispaniolaaquaticadventures.com
// (mismo criterio que eco-friendly-logo.png: activos reales del cliente, no
// genéricos) — mapeo verificado a ojo contra las etiquetas de la página real
// (galería "Nuestra Tripulación y Flota"):
//   flota-santa-maria.webp   ← images/boats/59.jpg
//   flota-forever-teresa.webp ← images/boats/71.jpg
//   flota-maite.webp         ← images/boats/maite.jpg
//   flota-grandma.webp       ← images/boats/222.jpg
//   flota-joker.webp         ← images/boats/joker.jpg
//   flota-karaya.webp        ← images/boats/karaya.jpg
//   cocina-flotante.webp     ← images/food/kitchen.jpg
//   cocina-flotante-plataforma.webp ← images/food/floating_kitchen.jpg
//   bar-flotante.webp        ← images/food/floating_bar.jpg
//
// La donación/fundación/arrecife NO se duplica aquí — sigue viviendo SOLO en
// /sostenibilidad; esta página solo menciona + enlaza (ArrecifeTeaser, sin
// cambios), mismo límite que ya existía.

// ─────────────────────────────────────────────────────────────────────────
// EL EQUIPO CON NOMBRE (correcciones v1 del cliente, 2026-07-20 —
// planes/03-nosotros.md slide 2 y planes/01-home.md slide 15).
//
// Hasta ahora esta página NO podía tener equipo nominal: el comentario de
// TRIPULACION (abajo) lo dice — «el cliente no ha dado esos datos; inventar
// un "Capitán José" sería fabricar contenido». Las maquetas que mandó el
// cliente SÍ traen los nombres y cargos, así que el bloqueo se levanta y
// estos datos vienen de él, no de nosotros.
//
// ⚠️ PENDIENTE DE CONFIRMAR con el cliente antes de publicar: son personas
// reales y los cargos salieron de una maqueta hecha con IA, no de un
// documento suyo. Las QUOTES de cada uno vienen de esa misma maqueta —
// suenan bien pero nadie las ha dicho: hay que validarlas o sustituirlas por
// frases reales. Mientras tanto se pintan porque el cliente las propuso él.
//
// ⚠️ FOTOS — PLACEHOLDER DE STOCK, NO SON OMAR/LOLA/EVA REALES (2026-07-22,
// pedido explícito de Samuel: "saca fotos de stock y recórtales el fondo",
// al rediseñar las cards de equipo-teaser.tsx con retrato grande + gradiente).
// Esto SE SALTA A PROPÓSITO la regla de CLAUDE.md "Fotos: reales de la web
// actual, no stock" — está bien documentado aquí para que no se pierda el
// porqué ni se confunda con contenido final:
//   1. Son 5 fotos de stock (Freepik, licencia free) con el fondo recortado
//      en Magnific (images_remove_background) — NO son fotos de las personas
//      reales que trabajan en Hispaniola.
//   2. Sirven para poder construir y evaluar el diseño de la card (retrato +
//      gradiente + hover) con algo que se vea como una persona real, en vez
//      de las iniciales en círculo de antes.
//   3. ANTES de publicar esto en producción hay que sustituir estos 5
//      archivos por fotos reales (pedido ya anotado en
//      correcciones-v1-cliente/EJECUTADO.md) — mostrar una cara de stock bajo
//      el nombre de una persona real y con cargo real sería publicar un
//      engaño, no un placeholder. Cambiar solo `foto` aquí — el componente no
//      se toca.
//   4. OJO con las 2 marcadas `placeholder: true` (Capitán / Bióloga marina):
//      ahí no basta con cambiar la foto — no hay ninguna persona detrás. O se
//      sustituye la entrada entera por alguien real que el cliente confirme, o
//      se borra. Ver el flag `placeholder` en el tipo, más abajo.
// Archivos: /public/fotos/equipo-{omar,lola,eva,capitan,biologa}.webp
// (recorte transparente, object-fit: cover en la card). La foto de Eva se RESUSTITUYÓ el mismo día
// (2ª vuelta, pedido de Samuel: "la de eva se ve mas lejos y se ve mas cuerpo
// completo, cosa que no deberia") — la primera elección quedaba de cuerpo
// entero y lejana; la actual es un plano de busto con los brazos cruzados,
// mismo encuadre que Omar y Lola.
//
// Esta es la ÚNICA fuente del equipo: la consumen /nosotros (bloque
// completo), la home (teaser, equipo-teaser.tsx) y la card de persona de la
// sección Contacto. Un solo sitio que corregir cuando el cliente confirme.
//
// 2ª vuelta (2026-07-22, pedido de Samuel): el teaser de la home pasa de 3 a
// 5 cards para poder tener 3 niveles de altura en el efecto de scroll (con 3
// cards solo hay sitio para 2: centro y extremos). Omar/Lola/Eva son las
// ÚNICAS personas confirmadas por el cliente (maqueta real, ver el comentario
// de arriba) — inventar 2 nombres/cargos/quotes nuevos habría sido fabricar
// personas que no existen. Las 2 de relleno NO son personas: reusan tal cual
// 2 de los 4 roles SIN nombre de TRIPULACION (abajo), que ya son contenido
// aprobado del cliente («Capitán», «Bióloga marina»). `desde` y `quote`
// quedan sin valor a propósito — no hay una fecha de contratación ni una
// frase personal que inventar para un rol genérico. Por eso ambos campos
// pasan a opcionales en el tipo. Cuando el cliente dé más gente con nombre,
// estas 2 entradas se quitan (o se reemplazan 1:1) — no son contenido final.
//
// 3ª vuelta (mismo día): esas 2 entradas RECIBEN FOTO (pedido de Samuel:
// "poner imágenes de personas también a los 2 que faltan") — antes caían al
// fallback de iniciales, que era lo que las delataba de un vistazo. Ahora que
// se ven igual que las reales hace falta un marcador EXPLÍCITO: el flag
// `placeholder`. Antes bastaba con mirar si tenían `desde`, pero ese campo ya
// no se pinta en el teaser (Samuel pidió quitar el año de la card), así que
// usarlo como discriminante sería un truco implícito y frágil — alguien que
// añada mañana una persona real sin año la vería desaparecer de /nosotros
// sin entender por qué.
export type MiembroEquipo = {
  id: string
  nombre: string
  rol: string
  /** Año de entrada — el «desde» que da veteranía. Se pinta en /nosotros, NO en el teaser de la home. undefined = sin dato. */
  desde?: string
  /** undefined = sin frase (no se inventa una personal para un rol sin nombre). */
  quote?: string
  /** [v3 2026-08-06] Historia larga, hoy solo del CEO (WEBSITE - NOSOTROS
   *  pag. 2). La `quote` es la frase de cabecera; esto es el relato. */
  bio?: string[]
  /** null = no tenemos retrato; se pintan iniciales. */
  foto: string | null
  /**
   * Monograma del fallback sin foto. Sin esto se pinta la INICIAL sola
   * (`nombre[0]`), que basta para un nombre de pila («Omar» → O) pero se
   * queda corto con nombre y apellidos o con una razón social. Lo estrenan
   * los tres de /fundacion (FS · MR · HAA), que van sin retrato a propósito
   * — ver el ⚠️ de data/fundacion.ts. Se ignora si hay `foto`.
   */
  iniciales?: string
  /**
   * true = NO es una persona real, es un rol de relleno para maquetar (ver el
   * comentario largo de arriba). Con foto de stock puesta ya no se distingue a
   * simple vista — este flag es lo único que lo dice. Se filtran en /nosotros;
   * hay que quitarlas o sustituirlas por gente real antes de publicar.
   */
  placeholder?: true
  /**
   * CTA propio de la card. `tipo` decide el destino real.
   * OPCIONAL desde el 2026-07-28: los tres de /fundacion no tienen adónde
   * mandar a nadie (no hay página por persona ni WhatsApp propio), y un
   * enlace de relleno que apunte a la misma página en la que ya estás es
   * ruido. Sin `cta` la card no pinta la fila del hover.
   */
  cta?: { label: string; tipo: 'whatsapp' | 'historia' }
}

export const EQUIPO: MiembroEquipo[] = [
  {
    id: 'omar',
    nombre: 'Omar',
    rol: 'Founder & CEO',
    // [v3 2026-08-06] 2010, no 2012: la timeline aprobada fecha el primer
    // barco —y con el, la empresa— en 2010.
    desde: '2010',
    // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 4] La frase APROBADA del CEO.
    // La anterior tambien era suya (de su web de 2012); esta la escribe ahora.
    quote:
      'I never wanted to build the biggest tour company. I wanted to build the one people would never forget. Happiness is a way of travel, not a destination.',
    // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 2] La historia del CEO, tal
    // como la escribe. Es lo que convierte la ficha en una persona: empezo de
    // capitan, ha hecho casi todos los puestos, y nombra a Jose —su
    // Operations Manager— contando que aprendio a nadar con el.
    // ⚠️ Jose aparece con nombre y cargo porque es dato del cliente, de su
    // propio documento. No se inventa nada alrededor.
    bio: [
      "I started this company as its very first captain. Over the years, I've worked in nearly every role—from leading tours at sea to building the team that now makes it all possible. Watching people grow alongside the company has been one of the greatest rewards. In fact, our Operations Manager, Jose, learned to swim with me years ago, and today he leads one of the most important departments in the company. He is my right wing man.",
      'No matter how much we grow, I believe the best leaders never stop learning, never stop listening, and never stop getting their feet wet.',
    ],
    foto: 'equipo-omar',
    cta: { label: 'Nuestra historia', tipo: 'historia' },
  },
  {
    id: 'capitan-placeholder',
    nombre: 'Capitán',
    rol: 'Tripulación a bordo',
    foto: 'equipo-capitan',
    placeholder: true,
    cta: { label: 'Nuestra historia', tipo: 'historia' },
  },
  {
    id: 'lola',
    nombre: 'Lola',
    rol: 'Tour Leader Manager',
    desde: '2015',
    quote: 'Llevo años enseñando este arrecife y todavía me emociona cada salida.',
    foto: 'equipo-lola',
    cta: { label: 'Escríbele a Lola', tipo: 'whatsapp' },
  },
  {
    id: 'biologa-placeholder',
    nombre: 'Bióloga marina',
    rol: 'Tripulación a bordo',
    foto: 'equipo-biologa',
    placeholder: true,
    cta: { label: 'Nuestra historia', tipo: 'historia' },
  },
  {
    id: 'eva',
    nombre: 'Eva',
    rol: 'Atención al viajero',
    desde: '2018',
    quote: 'Cuando escribes, te respondo yo. Nada de robots — te ayudo a armar tu día perfecto.',
    foto: 'equipo-eva',
    cta: { label: 'Chatea con Eva', tipo: 'whatsapp' },
  },
]

// ─────────────────────────────────────────────────────────────────────────
// LÍNEA DE TIEMPO de la flota (correcciones v1 — planes/03-nosotros.md
// slide 2: «De un barco a una flota de seis»).
//
// Los años salen de FLOTA (abajo), que a su vez los tomó verbatim de
// about-hispaniola.php. El único dato que NO estaba ahí es la fundación en
// 2012, que sí aparece en toda la web («Desde 2012») y en el footer.
//
// ⚠️ La maqueta del cliente dice «2012 · Nace Hispaniola con el primer
// barco», pero sus propias specs fechan el Santa María en 2013. Aquí se
// separan los dos hechos (2012 = nace la empresa, 2013 = primer catamarán
// propio) en vez de forzarlos en uno solo. CONFIRMAR con el cliente: si en
// 2012 ya operaban con otro barco, falta ese dato.
export type HitoFlota = { anio: string; titulo: string; texto?: string }

export const TIMELINE_FLOTA: HitoFlota[] = [
  // [v3 2026-08-06, WEBSITE - NOSOTROS pags. 5-7] LA TIMELINE COMPLETA, tal
  // como la escribe el cliente. Sustituye a los 5 hitos que habia, que se
  // dedujeron de about-hispaniola.php a falta de algo mejor.
  //
  // ⚡ ES ORO PARA ESTA PAGINA: nombra los DOCE barcos, y el repo solo conocia
  // seis. Tambien cierra el «desde 2012 vs 2010» — el cliente fecha el primer
  // barco en 2010, asi que el hito de 2012 que teniamos («nace Hispaniola»)
  // desaparece: no es que la empresa naciera dos anios despues del primer
  // barco, es que el 2012 salio de su propia web y el copy aprobado lo corrige.
  //
  // ⚠️ NO da fotos ni fichas de los 6 barcos nuevos (Teresa, Teresa 2, Parrot,
  // Goyita, Grandpa, Follow Your Dreams). El grid sigue con los 6 que tienen
  // material — un grid de 12 con la mitad en hueco seria peor que una timeline
  // que los nombra. Duda para Samuel, anotada en el plan 05 §3.
  { anio: '2010', titulo: 'The Dream Begins', texto: 'Arrival of Catamaran Teresa, the first vessel and the beginning of Hispaniola Aquatic Adventures.' },
  { anio: '2013', titulo: 'The First Expansion', texto: 'Santa María joins the fleet, proving that every successful season could become the next investment.' },
  { anio: '2015', titulo: 'Growing with Purpose', texto: "Forever Teresa arrives, followed by a second sailing catamaran and the company's first floating kitchen, elevating the onboard experience." },
  { anio: '2016', titulo: 'Maite Joins the Fleet', texto: 'Catamaran Maite is built, expanding our capacity and allowing us to create new experiences for more guests.' },
  { anio: '2017', titulo: 'Innovation at Sea', texto: 'Teresa 2 joins the fleet. Construction begins on Karaya, while Parrot joins the fleet and the original Teresa is transformed into a passenger boarding platform.' },
  { anio: '2018', titulo: 'Improving Every Detail', texto: 'Goyita is added to make boarding faster, safer, and more comfortable for every guest.' },
  { anio: '2020', titulo: 'Resilience', texto: 'Even during the pandemic, the fleet continues growing with the acquisition of Joker.' },
  { anio: '2021', titulo: 'A New Flagship', texto: "After nearly five years of construction, Karaya is delivered, becoming the company's signature vessel." },
  { anio: '2024', titulo: 'A New Generation', texto: 'Grandpa and Follow Your Dreams join the fleet, representing the next chapter of innovation and guest experience.' },
]

export type MiembroTripulacion = { rol: string; nota: string }

// TRIPULACION del prototipo — 4 roles, sin nombres propios (el cliente no ha
// dado esos datos; inventar un "Capitán José" sería fabricar contenido).
//
// `nota` (2026-07-22, maqueta de correcciones v1 slide 3): la maqueta pone una
// línea bajo cada rol en vez del chip pelado que teníamos. Las 4 frases son
// del cliente (su propia maqueta), no nuestras — describen la función, que es
// justo lo que el chip a secas no decía.
export const TRIPULACION: MiembroTripulacion[] = [
  { rol: 'Capitán', nota: 'Al timón en cada salida' },
  { rol: 'Bióloga marina', nota: 'Te enseña el arrecife' },
  { rol: 'Chef a bordo', nota: 'Cocina flotante en vivo' },
  { rol: 'Guía de snorkel', nota: 'Contigo en el agua' },
]

// Correcciones v1 (planes/03-nosotros.md slide 5): la maqueta del cliente
// pide capacidad visible, un «ideal para» y un CTA por barco.
//  - `capacidad` sale de las tablas REALES del charter (data/tours.ts) y de
//    las specs de about-hispaniola.php — NO de los «hasta 40 / hasta 80» de
//    la maqueta, que la IA se inventó y contradicen los tramos que ya
//    cobramos (p. ej. Maite factura hasta 20 pax, no 30).
//  - `idealPara` condensa lo que el propio `meta` ya dice, para poder pintarlo
//    como chip sin repetir el párrafo entero.
//  - `cta`: 'charter' → los 4 botes que se pueden reservar en el charter
//    llevan a esa ficha; 'evento' → Joker y Karaya se cotizan como evento.
//
// 2026-07-22 (rediseño fiel a la maqueta, slide 5): la flota vuelve a ser una
// REJILLA DE CARDS — y la card es la MISMA que la de tours de la home
// (home/tour-card.tsx), pedido explícito de Samuel («no inventes, usa el mismo
// diseño»). Esa anatomía pide los datos DESGLOSADOS, no un párrafo: chip sobre
// la foto, fila de meta con iconos, chip de «ideal para», descripción y CTA.
// Por eso `meta` (la prosa verbatim de about-hispaniola.php, que mezclaba
// tipo + eslora + año + para qué sirve en una sola frase) se PARTE en campos:
//   - `tipo`/`eslora`/`anio` → la fila de meta con iconos. Son literalmente
//     los datos que ya estaban dentro de `meta`, extraídos, no inventados.
//   - `descripcionCorta` → la misma frase original SIN esos datos (ya se
//     pintan aparte con icono; repetirlos sería el mismo dato dos veces).
//   - `chipFoto` → el chip sobre la foto, equivalente al `audienciaChip` de
//     Tour. Sale de `cta`, que ya distinguía charter de evento.
// `meta` se retira: no quedaba ni un sitio que lo pintase.
export type BarcoFlota = {
  nombre: string
  /** Ficha técnica desglosada — la fila de meta con iconos de la card. null = sin dato documentado. */
  tipo: string
  eslora: string | null
  anio: string | null
  descripcionCorta: string
  foto: string
  fotoAlt: string
  /** Chip sobre la foto — mismo sitio que el `audienciaChip` de la card de tour. */
  chipFoto: string
  /** null = no hay cifra documentada (no se inventa). */
  capacidad: string | null
  idealPara: string
  cta: 'charter' | 'evento'
}

// FLOTA — los 6 catamaranes reales con nombre propio de about-hispaniola.php
// (no la versión simplificada "Catamarán A/B" de prototipo/datos.js — 2ª
// vuelta de este mismo rediseño, pedido explícito de Samuel de portar TODO
// el contenido de la web original). Specs y años, verbatim de la fuente.
export const FLOTA: BarcoFlota[] = [
  {
    nombre: 'Santa María',
    tipo: 'Catamarán a motor',
    eslora: '41 pies',
    anio: '2013',
    descripcionCorta: 'Diseñado y construido especialmente para nuestra flota. Estable y cómodo para el tour clásico.',
    foto: 'flota-santa-maria',
    fotoAlt: 'Catamarán Santa María navegando con pasajeros a bordo',
    chipFoto: 'Tours compartidos',
    capacidad: 'Hasta 20',
    idealPara: 'Ideal para el tour clásico',
    cta: 'charter',
  },
  {
    nombre: 'Forever Teresa',
    tipo: 'Catamarán',
    eslora: '60 pies',
    anio: '2015',
    // Las descripciones van a `line-clamp-2` en la card (igual que en la de
    // tours): si no caben en dos líneas, el corte se lleva justo el final.
    descripcionCorta: 'Nuestro catamarán de mayor eslora, con espacio de sobra a bordo.',
    foto: 'flota-forever-teresa',
    fotoAlt: 'Catamarán Forever Teresa visto desde el aire',
    chipFoto: 'Grupos grandes',
    capacidad: 'Hasta 120',
    idealPara: 'Ideal para grupos grandes',
    cta: 'charter',
  },
  {
    nombre: 'Maite',
    tipo: 'Catamarán de vela',
    eslora: '39 pies',
    anio: '2016',
    descripcionCorta: 'El crucero a vela más moderno de Punta Cana / Bávaro. Romántico y tranquilo.',
    foto: 'flota-maite',
    fotoAlt: 'Catamarán de vela Maite navegando con la vela desplegada',
    chipFoto: 'Vela',
    capacidad: 'Hasta 20',
    idealPara: 'Ideal para parejas y sunset',
    cta: 'charter',
  },
  {
    nombre: 'GrandMa',
    tipo: 'Catamarán con tobogán',
    eslora: '40 pies',
    // La fuente no fecha el GrandMa (ni el Joker ni el Karaya): sin año, no se
    // pinta la casilla. Nada de rellenar un hueco con un año plausible.
    anio: null,
    descripcionCorta: 'Con tobogán a bordo — perfecto para grupos medianos, familias y planes divertidos.',
    foto: 'flota-grandma',
    fotoAlt: 'Catamarán GrandMa con pasajeros a bordo',
    chipFoto: 'Familias',
    capacidad: 'Hasta 20',
    idealPara: 'Ideal para familias y actividades',
    cta: 'charter',
  },
  {
    nombre: 'Joker',
    tipo: 'Lancha de 2 pisos',
    eslora: null,
    anio: null,
    descripcionCorta: 'Dos pisos, tobogán, bar y techo corredizo. Pensada para la fiesta de tu grupo.',
    foto: 'flota-joker',
    fotoAlt: 'Catamarán Joker con pasajeros en la cubierta superior',
    chipFoto: 'Eventos',
    // Joker no entra en las tablas del charter ni en las specs con una cifra
    // propia — se cotiza. No se le pone un «hasta N» inventado.
    capacidad: null,
    idealPara: 'Ideal para grupos privados',
    cta: 'evento',
  },
  {
    nombre: 'Karaya',
    tipo: 'Catamarán de eventos',
    eslora: '938 m² · 2 niveles',
    anio: null,
    descripcionCorta: 'El más grande del Caribe: el escenario para bodas y celebraciones.',
    foto: 'flota-karaya',
    fotoAlt: 'Karaya, el catamarán de eventos más grande del Caribe, con dos niveles',
    chipFoto: 'Eventos',
    capacidad: 'Hasta 350',
    idealPara: 'Ideal para grandes eventos y bodas',
    cta: 'evento',
  },
]

export const NOSOTROS = {
  eyebrow: 'Nosotros',
  titulo: 'La tripulación y la flota detrás de cada tour',
  sub: 'Dos catamaranes, una cocina flotante y un equipo que lleva desde 2012 navegando la costa de Punta Cana.',
  // PLAN-INTERNAS-V2.md: fotos del hero-interna en fundido.
  galeria: ['galeria-charter-privado-1', 'hero-catamaran-1', 'galeria-semi-privado-3'],

  // El equipo con nombre + la tripulación a bordo (maqueta de correcciones v1
  // slide 2 y 3). El bloque de personas reutiliza la sección de la home
  // (home/equipo-teaser.tsx, pedido de Samuel) — de ahí que su eyebrow y su
  // título vivan AQUÍ y no allí: la home tiene los suyos por defecto, esta
  // página le pasa estos.
  equipoEyebrow: 'El equipo',
  equipoTitulo: 'El equipo que te recibe',
  equipoTexto:
    'Gerencia española afincada en Punta Cana desde 2012, y un equipo que vive el mar contigo — el mismo que te va a atender cuando escribas.',

  tripulacionTitulo: 'Y nuestra tripulación dominicana a bordo',
  // Condensado de "Nuestro maravilloso equipo está altamente capacitado,
  // experimentado y garantizará la seguridad de todos los participantes...
  // Nuestro equipo multilingüe estará allí con usted en cada paso del
  // camino, asegurando su comodidad y bienestar."
  tripulacionTexto:
    'Multilingüe, altamente capacitada y pendiente de tu seguridad en cada paso — desde que subes a bordo hasta que vuelves a la orilla.',

  flotaEyebrow: 'The fleet',
  // Titular de la maqueta (slide 5). El eyebrow se queda con «La flota»: es la
  // etiqueta de sección, el titular ahora cuenta algo.
  // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 7] Titulo y texto APROBADOS del
  // grid de barcos.
  flotaTitulo: 'More Than Boats. Your Home at Sea.',
  // Condensado de "Nuestra flota consta de... catamaranes modernos... Están
  // bien mantenidos y siempre limpios."
  flotaTexto:
    "Every vessel in our fleet has its own personality, its own purpose, and thousands of unforgettable stories. We own, design, and maintain every boat ourselves, so every detail reflects the experience we want you to live. Explore each vessel through photos, 360° tours, videos, technical specifications, and onboard features before choosing the one that's perfect for you.",

  arrecifeTitulo: 'El arrecife que reconstruimos',
  arrecifeTexto:
    'Cada tour navega al vivero de coral de Cabeza de Toro, un proyecto de restauración top-3 del país que apoyamos a través de la Bávaro Reefs Foundation.',
  arrecifeCta: 'Ver toda la historia en Sostenibilidad',
  // Foto de fondo del banner de cierre. 6ª vuelta (2026-07-17, pedido de
  // Samuel: "usa otra imagen, usa una imagen de stock del océano Caribeño
  // vista cenital") — sustituimos la foto del vivero de coral real por una
  // cenital genérica de agua turquesa caribeña (stock, sin marca de agua).
  // El texto del banner YA cuenta el arrecife; el fondo solo ambienta mar.
  arrecifeFoto: 'arrecife-fondo-cenital',
  arrecifeFotoAlt: 'Vista cenital del océano Caribe con agua turquesa cristalina',
}

// ---------- Intro «Quiénes somos» (NUEVO, portado de about-hispaniola.php) ----------
// Condensa la bienvenida ("Bienvenido a nuestra familia de Hispaniola...") y
// el diferenciador de grupos pequeños ("nuestros catamaranes tienen
// capacidad para más de 100 pasajeros, pero preferimos garantizar espacio
// suficiente para que todos nuestros huéspedes se sientan importantes").
// [v3 2026-08-06, WEBSITE - NOSOTROS pag. 4] «QUITAR: BIENVENIDOS» y «QUITAR:
// GRUPOS PEQUEÑOS». Las dos frases que habia —la bienvenida a la familia y el
// diferenciador de aforo— salen, y su sitio lo ocupa el texto APROBADO, que
// dice otra cosa: que los barcos son PROPIOS y los mantiene su equipo.
export const INTRO_NOSOTROS = {
  eyebrow: 'Our fleet',
  titulo: 'Every boat has a purpose',
  parrafos: [
    "Unlike many tour operators, we don't rely on third-party boats. Every vessel in our fleet is our own, professionally maintained by our in-house team and continuously upgraded to meet the highest standards.",
    "Below, you'll find detailed specifications, onboard features, and technical fact sheets for each vessel, so you know exactly what to expect before you step aboard.",
  ],
  foto: 'galeria-charter-privado-4',
  fotoAlt: 'Catamarán fondeado frente a una playa de palmeras',
}

// ---------- La experiencia a bordo (NUEVO) — 3 paradas del tour ----------
// Portado de la narrativa del itinerario en about-hispaniola.php: vivero de
// coral → playa desierta con coco-loco → piscina natural + bar flotante.
//
// 2026-07-22 (rediseño fiel a la maqueta, slide 4): las 3 paradas dejan de ser
// la sección entera y pasan a ser el SEGUNDO tiempo de «La experiencia a
// bordo» — primero la cocina flotante (el diferenciador, que antes vivía
// suelto tres bloques más abajo) y después el itinerario. La sección estrena
// cabecera propia y un CTA de cierre, que es lo que la maqueta le pone.
export const EXPERIENCIA = {
  eyebrow: 'La experiencia a bordo',
  titulo: 'Un día de mar, cuidado al detalle',
  sub: 'Lo que vives con nosotros no lo vives en cualquier excursión.',
  cta: 'Vive este día — ver disponibilidad',
}

export type ParadaExperiencia = {
  numero: string
  titulo: string
  texto: string
  foto: string
  fotoAlt: string
  /** Chip de crédito bajo el texto. Solo la parada del vivero lo tiene — es la única con una fundación detrás. */
  chip?: string
}

export const EXPERIENCIA_ABORDO: ParadaExperiencia[] = [
  {
    numero: '01',
    titulo: 'Snorkel en el vivero de coral',
    texto:
      'Nuestra primera parada es un vivero coralino donde la Bávaro Reefs Foundation restaura el hábitat marino — nadarás rodeado de peces de colores en aguas transparentes.',
    foto: 'galeria-semi-privado-4',
    fotoAlt: 'Snorkel entre peces tropicales en el vivero de coral',
    chip: 'Restauración del arrecife · Bávaro Reefs Foundation',
  },
  {
    numero: '02',
    titulo: 'Playa desierta y coco-loco',
    texto: 'Desembarcamos en una playa desierta para cocos fríos recién abiertos y cóctel de coco — pide todos los que quieras.',
    foto: 'galeria-charter-privado-6',
    fotoAlt: 'Familia disfrutando cocos frescos en una playa desierta',
  },
  {
    numero: '03',
    titulo: 'Piscina natural',
    texto: 'El último destino: una piscina natural en medio del mar, con las mejores bebidas de nuestro bar flotante.',
    foto: 'bar-flotante',
    fotoAlt: 'Grupo disfrutando de bebidas en el bar flotante, en la piscina natural',
  },
]

// ---------- Cocina flotante (NUEVO) — el diferenciador único ----------
// "Hispaniola es la única empresa de excursiones en toda la República
// Dominicana que tiene una cocina flotante... mariscos (o comida marina) que
// harán que se te haga agua la boca."
//
// 2026-07-22: deja de ser una sección suelta con la foto a sangre y pasa a ser
// la card de apertura de «La experiencia a bordo» (maqueta slide 4) — foto a
// un lado, panel de texto al otro, con badge sobre la foto y 3 pruebas en
// lista. Los 3 `puntos` no añaden hechos nuevos: son el propio `texto`
// troceado en lo que se puede verificar de un vistazo.
// [v3 2026-08-06, WEBSITE - NOSOTROS pag. 8 + PowerPoint slide 69] La cocina
// flotante con el copy APROBADO. El cliente la reescribe entera y en clave
// SENSORIAL —la brisa, el olor, el sonido de la parrilla— donde antes habia
// una afirmacion de exclusividad. Es ademas la seccion que la slide 69 pide
// destacar («resaltar que es unica en Punta Cana»), y el copy nuevo lo hace
// mejor que el viejo: no lo dice, lo describe.
export const COCINA_FLOTANTE = {
  badge: 'Only in Punta Cana',
  eyebrow: 'Only with Hispaniola',
  titulo: 'More Than Lunch. A Memory You Can Taste.',
  texto:
    'Imagine the sea breeze on your face, the scent of fresh seafood and grilled meats filling the air. The aroma comes first. Then the sound of the grill. Moments later, your meal is served—freshly prepared just a few steps from your table, while you sail through the crystal-clear waters of Punta Cana.',
  // [v3] El segundo y el tercer parrafo aprobados. Antes esta seccion tenia un
  // solo bloque de texto; el copy nuevo trae tres, y el tercero es el que
  // remata («lunch isn't just another stop»).
  textoExtra: [
    'Choose from seven freshly grilled dishes, including premium meats, fresh seafood, and local specialties, all prepared live by our chefs in a true show-cooking experience. No reheated food. No buffet trays. Just fresh ingredients, authentic Caribbean flavors, and meals cooked the moment you order them.',
    "For us, lunch isn't just another stop on the tour—it's one of the moments our guests remember long after they return home.",
  ],
  puntos: [
    'Cooked fresh, served fresh',
    'Live show cooking',
    'Where great food brings everyone together',
  ],
  foto: 'cocina-flotante',
  fotoAlt: 'La tripulación preparando mariscos a la parrilla en la cocina flotante',
}
