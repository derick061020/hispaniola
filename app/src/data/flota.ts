import type { LucideIcon } from 'lucide-react'
import {
  Compass,
  Gauge,
  Leaf,
  Ruler,
  ShieldCheck,
  Ship,
  UtensilsCrossed,
  Users,
  Wind,
  Zap,
} from 'lucide-react'
import { FLOTA, TIMELINE_FLOTA, type BarcoFlota } from './nosotros'

/** Barcos que tiene la flota DE VERDAD. Dato del cliente: «SINCE 2010, FLEET
 *  CONSISTING OF 12» (WEBSITE - NOSOTROS pag. 4), y su timeline aprobada los
 *  nombra uno a uno.
 *
 *  ⚠️ NO es `FLOTA.length`, y esa es toda la gracia de que exista esta
 *  constante. `FLOTA` son los barcos con FICHA COMPLETA (foto, specs, galería,
 *  360º) — hoy 6. Derivar de ahí el titular de la empresa hacía que la web
 *  dijera «Fleet of 6» por no tener assets de los otros 6, que es un dato
 *  falso por un motivo de maquetación. Cuando entren los 6 que faltan al
 *  array, este número no cambia: ya es 12. */
export const BARCOS_FLOTA = 12

// ─────────────────────────────────────────────────────────────────────────
// PÁGINA FLOTA (/flota) — contenido propio de la página.
//
// [v2 2026-07-28, iteración de Samuel sobre las 10 slides del PDF que hablan
// de esta página] Hasta hoy /flota era el grid de 6 cards heredado de
// /nosotros + la línea de tiempo + el banner de arrecife. Del PDF solo estaba
// aplicado el «sale a página propia». Esta iteración aplica el resto:
//
//   1. La PRESENTACIÓN de la familia Hispaniola con la estructura del slide
//      26 (texto + destacado + cita del dueño + CTA a un lado, media al otro,
//      banda de KPIs debajo) y, pegado a ella, el RECORRIDO DE AÑOS.
//   2. La CARD DE BARCO del slide 28: media grande con VIDEO por defecto,
//      mini-galería debajo, «Ver en 360º» arriba a la derecha, specs, y un
//      botón secundario que abre la FICHA TÉCNICA COMPLETA en modal.
//   3. El banner de cierre enfocado a CERO PLÁSTICO (slide 30).
//   4. La cocina flotante + las 3 paradas en clave PREMIUM (slides 32-34).
//
// Por qué un archivo nuevo y no más líneas en `data/nosotros.ts`: ese archivo
// nació como «la página /nosotros» y hoy alimenta a media web (EQUIPO lo usan
// la home, el blog y contacto). Lo que se añade aquí es EXCLUSIVO de /flota.
// Lo que ya existe —FLOTA, TIMELINE_FLOTA, COCINA_FLOTANTE, EXPERIENCIA_ABORDO—
// se IMPORTA, no se copia: el copy de la cocina flotante y de las 3 paradas
// tiene que decir lo mismo aquí que en /instalaciones.
// ─────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════
// §1 — LA FAMILIA HISPANIOLA (estructura del slide 26)
// ═════════════════════════════════════════════════════════════════════════
//
// El slide 26 es una captura de la vieja /nosotros que el cliente usa como
// modelo: eyebrow + titular + párrafo + caja de destacado + cita del fundador
// con avatar + CTA a la izquierda; media grande con badge de TripAdvisor y
// una card anidada a la derecha; y una banda de 4 KPIs cerrando abajo.
//
// ⚠️ DUPLICACIÓN A RESOLVER CON SAMUEL: «Bienvenido a la familia Hispaniola»
// (INTRO_NOSOTROS en data/nosotros.ts) se pinta HOY en /tripulacion, vía
// nosotros/intro-nosotros.tsx. Esta versión es más completa (dueño +
// recorrido + KPIs) y está pedida explícitamente para /flota, pero el mismo
// saludo no puede vivir en dos páginas. Hay que decidir cuál se queda: o
// /tripulacion pierde su intro, o esta cambia de titular. No se toca
// /tripulacion en esta iteración porque no estaba en el encargo.
export const FAMILIA_FLOTA = {
  // [v3 2026-08-06, WEBSITE - NOSOTROS pag. 4] «QUITAR: BIENVENIDOS» y
  // «QUITAR: GRUPOS PEQUEÑOS». Las dos piezas salen y su sitio lo ocupa el
  // texto APROBADO, que dice otra cosa y mas fuerte: los barcos son PROPIOS y
  // los mantiene su equipo, no se revenden salidas de terceros.
  // ⚠️ El diferenciador de aforo no se pierde del sitio: sigue vivo en la home
  // (stat «≤35% del aforo») y en la ficha del semi-privado, que es donde de
  // verdad decide una compra.
  eyebrow: 'Our fleet',
  titulo: 'Every boat has a purpose',
  parrafos: [
    "Each vessel in our fleet has been carefully selected and customized for the experience. Unlike many tour operators, we don't rely on third-party boats: every vessel is our own, professionally maintained by our in-house team and continuously upgraded to meet the highest standards.",
    "Below, you'll find detailed specifications, onboard features, and technical fact sheets for each vessel, so you know exactly what to expect before you step aboard.",
  ],
  // [v3 2026-08-07, pedido de Samuel] SIN CAJA DE DESTACADO. Aquí vivió
  // «Since 2010, a fleet of 12» + el párrafo del viaje, que ocupó el hueco de
  // la caja «Grupos pequeños» que el cliente tachó. Sale por repetición: sus
  // dos datos —el año y el tamaño de la flota— son literalmente dos de los
  // cuatro KPIs de la banda que va justo debajo, y el párrafo es el mismo que
  // presenta el recorrido de años. Decirlo tres veces en una pantalla y media
  // no lo hace más cierto.
  // El párrafo NO se pierde: es `recorridoTexto`, que es donde el cliente lo
  // pone (pág. 5, como intro de la timeline).
  cta: { label: 'Meet the crew', to: '/crew' },

  // ── Media del lado derecho ──────────────────────────────────────────────
  // El slide pone una foto grande con el badge de TripAdvisor flotando arriba
  // y una card más pequeña anidada abajo a la derecha («Nuestros huéspedes»).
  foto: 'galeria-charter-privado-4',
  fotoAlt: 'Hispaniola catamaran anchored off a palm-lined beach',
  fotoAnidada: 'galeria-semi-privado-3',
  fotoAnidadaAlt: 'Guests enjoying a day on board with the crew',
  fotoAnidadaPie: 'Our guests',

  // ── El dueño ────────────────────────────────────────────────────────────
  // El slide 27 (y la reunión del 07-24, 28:46: «la foto de él, una frase que
  // va a hacer él, y esto 2022») pide que la historia se cuente con la cara y
  // la voz del fundador. La cita y el retrato salen de EQUIPO (data/nosotros)
  // — fuente única: si Omar cambia su frase, cambia en la home también.
  //
  // ⚠️ El retrato de Omar sigue siendo STOCK recortado, no es él (ver el
  // aviso largo en data/nosotros.ts). Sustituir antes de publicar.
  duenoRolLargo: 'founder and director of Hispaniola',

  // ── El recorrido de años ────────────────────────────────────────────────
  recorridoEyebrow: 'The journey',
  // El titular NO lleva la cifra dentro («de seis») como el de /nosotros: en
  // cuanto entren los 6 barcos que faltan, un número escrito a mano en un
  // titular es justo lo que se queda obsoleto sin que nadie lo note.
  recorridoTitulo: 'From one boat to a fleet',
  // [v3 2026-08-07, WEBSITE - NOSOTROS pag. 5] La intro APROBADA de la
  // timeline, literal y completa (la caja de destacado solo traía las tres
  // primeras frases; la cuarta —«Today, our fleet is the result of…»— es la
  // que cierra el recorrido, y aquí sí tiene sitio).
  // Sustituye a la redacción v2, que abría con «We started in 2012» — un año
  // que la propia timeline aprobada contradice: el primer barco es de 2010.
  recorridoTexto:
    'Our journey began in 2010 with a single boat and one clear vision: to create unforgettable experiences at sea. Every new vessel was made possible by the success of the one before it, allowing us to grow step by step without ever compromising quality. Today, our fleet is the result of years of hard work, reinvestment, and an unwavering commitment to excellence.',

  // ── Banda de KPIs ───────────────────────────────────────────────────────
  // [v3 2026-08-07, pedido de Samuel] ESTA BANDA SE QUEDA CON LOS DOS DATOS DE
  // LA CAJA QUE SALE: «Since 2010» y «Fleet of 12». Es su sitio — la caja los
  // decía en prosa a dos dedos de una banda que existe para decir cifras.
  //   · 2012 → 2010: lo dice el cliente («SINCE 2010, FLEET CONSISTING OF 12»,
  //     pág. 5) y lo confirma su timeline, que fecha el primer barco (Teresa)
  //     en 2010. El «desde 2012» venía de la web vieja.
  //   · La cifra sigue SIN escribirse a mano, solo que ahora se lee de
  //     `BARCOS_FLOTA` (la flota real) y no de `FLOTA.length` (los barcos con
  //     ficha completa, hoy 6) — ver la constante y su porqué arriba.
  kpis: [
    { cifra: 'Since 2010', label: 'sailing this coast' },
    { cifra: '4.9', label: '1,782 verified reviews' },
    { cifra: `Fleet of ${BARCOS_FLOTA}`, label: 'boats we own' },
    { cifra: 'The only', label: 'floating kitchen in Punta Cana' },
  ],
}

// La línea de tiempo de /flota. Es TIMELINE_FLOTA (data/nosotros.ts) con el
// hito «Hoy» reescrito para que su cifra se CUENTE en vez de estar escrita a
// mano — el mismo motivo que el KPI de arriba. No se corrige en el origen
// porque allí `TIMELINE_FLOTA` se declara ANTES que `FLOTA` y leer la
// longitud desde ahí reventaría en la zona muerta temporal del módulo.
// [v3 2026-08-06] La timeline aprobada termina en 2024 y no lleva hito «Hoy»,
// asi que ya no hay nada que derivar de FLOTA.length — se pasa tal cual.
export const RECORRIDO_FLOTA = TIMELINE_FLOTA

// ═════════════════════════════════════════════════════════════════════════
// §2 — LA MEDIA DE CADA BARCO (slide 28)
// ═════════════════════════════════════════════════════════════════════════
//
// La maqueta del cliente dibuja, dentro de la card: foto grande con chip y
// botón «Ver en 360º», contador «1 / 4», etiqueta de encuadre («Exterior») y
// una tira de 5 miniaturas. La reunión del 07-24 (29:48) precisó que la
// primera pieza es un VÍDEO: «de cada uno, pero en un vídeo 360» — Samuel lo
// resumió como «un vídeo 360 y luego una galería de fotos abajo, y una ficha
// técnica».
//
// Así que el orden es fijo y significa algo: **el índice 0 es SIEMPRE el
// vídeo** y arranca activo. Lo primero que se ve de un barco es el barco
// moviéndose, no una foto quieta.
//
// ⚠️ VÍDEO REPETIDO A PROPÓSITO (pedido de Samuel: «usa un video repetido»).
// Los 6 barcos comparten `/video/hero.mp4` — el catamarán de marca, 3,8 MB,
// el más liviano del proyecto y ya cacheado para quien llega desde la home.
// NO es contenido final: cada barco necesita el suyo. Mientras tanto es la
// forma honesta de maquetar (un vídeo genérico de nuestra propia flota), y
// evita las 6 descargas distintas que tendría la versión real.
export type MediaBarco =
  | { tipo: 'video'; src: string; poster: string; etiqueta: string; alt: string }
  | { tipo: 'foto'; foto: string; etiqueta: string; alt: string }

// Cabecera de la rejilla.
//
// [v3 2026-08-07, WEBSITE - NOSOTROS pag. 7: «CHANGE:»] Titular y párrafo
// APROBADOS, literales. Sustituyen a la redacción de la casa («A boat for
// every plan» + «All of them ours, well maintained…»), que decía lo mismo con
// otras palabras: los barcos son propios, se cuidan, y cada uno trae vídeo,
// galería y ficha. El copy del cliente lo dice mejor en dos sitios —«its own
// personality, its own purpose» le pone carácter a la rejilla, y enumera las
// cinco piezas de media que la card de verdad tiene (fotos, 360º, vídeo,
// specs, equipamiento)— así que no hay nada que salvar del anterior.
//
// El titular va en Title Case porque así lo escribe él; es el mismo caso que
// «More Than Lunch. A Memory You Can Taste.» de la cocina flotante.
export const REJILLA_FLOTA = {
  eyebrow: 'The fleet',
  titulo: 'More Than Boats. Your Home at Sea.',
  texto:
    "Every vessel in our fleet has its own personality, its own purpose, and thousands of unforgettable stories. We own, design, and maintain every boat ourselves, so every detail reflects the experience we want you to live. Explore each vessel through photos, 360° tours, videos, technical specifications, and onboard features before choosing the one that's perfect for you.",
}

const VIDEO_BARCO = {
  tipo: 'video',
  src: '/video/hero.mp4',
  poster: '/fotos/hero-video-poster.webp',
  etiqueta: 'Tour on board',
} as const

/** Las fotos que acompañan al vídeo, con su etiqueta de encuadre. */
function galeriaDe(barco: BarcoFlota, extras: Array<[foto: string, etiqueta: string, alt: string]>): MediaBarco[] {
  return [
    { ...VIDEO_BARCO, alt: `Video tour of the ${barco.nombre}` },
    { tipo: 'foto', foto: barco.foto, etiqueta: 'Exterior', alt: barco.fotoAlt },
    ...extras.map(([foto, etiqueta, alt]): MediaBarco => ({ tipo: 'foto', foto, etiqueta, alt })),
  ]
}

// Las fotos de apoyo son REPETIDAS del repo (galerías de tours + cocina/bar
// flotante), igual que los 6 barcos que faltan reutilizan foto según la
// decisión del 2026-07-27 (plan 04 §2). Cada barco lleva un juego distinto
// para que la tira no se lea idéntica seis veces, pero ninguna de estas fotos
// es de ESE barco concreto. Reemplazar cuando lleguen las reales.
//
// ⚠️ CADA ETIQUETA Y CADA `alt` SE VERIFICARON ABRIENDO EL ARCHIVO, uno por
// uno. No es celo excesivo: el primer montaje los escribió deduciéndolos del
// NOMBRE del archivo y salieron tres etiquetas falsas —
// `galeria-semi-privado-1` no es el trampolín de proa sino el tanque del
// vivero de coral, `galeria-charter-privado-2` no es la zona de sombra sino
// el grupo con cocos en la playa, y `events-6` no es el segundo nivel sino
// un plano submarino del arrecife. Un `alt` que describe otra foto es una
// mentira para quien navega con lector de pantalla, y una etiqueta de
// encuadre equivocada lo es para todo el mundo. Si mañana se cambia un
// archivo, hay que volver a mirarlo.
export const MEDIA_FLOTA: Record<string, MediaBarco[]> = Object.fromEntries(
  FLOTA.map((barco, i) => {
    const juegos: Array<Array<[string, string, string]>> = [
      [
        ['galeria-charter-privado-3', 'Deck and dining', 'Upper deck with guests eating at tables under the canopy'],
        ['cocina-flotante', 'Floating kitchen', 'The chef and two guests behind the counter, with trays of freshly cooked seafood and meat'],
        ['galeria-charter-privado-7', 'In the water', 'Group swimming next to the anchored catamaran'],
      ],
      [
        ['events-8', 'Service on board', 'Buffet served on deck during a trip'],
        ['galeria-charter-privado-5', 'On board', 'Group toasting on the catamaran deck'],
        ['galeria-isla-saona-3', 'At anchor', 'The catamaran anchored over shallow turquoise water'],
      ],
      [
        ['galeria-snorkel-lovers-4', 'The snorkeling stop', 'Colorful fish over the reef at the snorkeling stop'],
        ['galeria-semi-privado-2', 'On board', 'Two guests sitting on the rail with their drinks'],
        ['galeria-isla-saona-7', 'Lunch on the beach', 'Long table with lunch served under the palm trees'],
      ],
      [
        ['galeria-semi-privado-6', 'The slide', 'Group in the water next to the catamaran, with the slide out'],
        ['galeria-charter-privado-2', 'Secluded beach', 'Group with freshly opened coconuts on the beach, catamaran in the background'],
        ['galeria-snorkel-lovers-9', 'On deck', 'Guests getting their gear ready on the aft deck'],
      ],
      [
        ['events-3', 'Floating bar', 'The floating bar with guests around it, standing in the water'],
        ['galeria-charter-privado-5', 'On board', 'Group toasting on the boat’s deck'],
        ['bar-flotante', 'Bar in the water', 'The floating bar during drinks service'],
      ],
      [
        ['events-8', 'Service on board', 'Buffet served on deck during a celebration'],
        ['galeria-charter-privado-3', 'Deck and dining', 'Upper deck with the tables set under the canopy'],
        ['galeria-isla-saona-3', 'At anchor', 'The boat anchored over shallow turquoise water'],
      ],
    ]
    return [barco.nombre, galeriaDe(barco, juegos[i % juegos.length])]
  }),
)

// ── El 360º ──────────────────────────────────────────────────────────────
// El plan 04 §3 dejó dicho: «el botón "Ver en 360º" no se pinta si el barco
// no tiene tour360 — ausencia silenciosa, no un botón que no hace nada». Esa
// regla SIGUE EN PIE para producción y por eso el flag existe.
//
// Hoy se pinta en los 6 porque Samuel lo pidió expresamente para maquetar
// («debe haber un botón arriba a la derecha de ver en 360 grados»), y el
// visor deja CLARÍSIMO en pantalla que lo que se abre es material de ejemplo
// —una etiqueta sobre el propio reproductor, no una nota al pie— para que
// nadie lo confunda con un recorrido real. En cuanto lleguen los archivos,
// esto pasa a ser un campo por barco y los que no lo tengan pierden el botón.
// El gancho técnico ya está puesto: la card solo pinta el botón si el barco
// tiene una pieza de vídeo en `MEDIA_FLOTA` (ver flota/barco-card.tsx).

// ═════════════════════════════════════════════════════════════════════════
// §3 — LA FICHA TÉCNICA COMPLETA (el modal del botón secundario)
// ═════════════════════════════════════════════════════════════════════════
//
// Pedido de Samuel: «investiga qué tipo de información puede ir aquí realista
// y diagrámala y jerarquízala como si fuera la info final, que esté bien
// explicada, bien técnica, para alguien que le interesa este tipo de cosas».
//
// La ficha sigue el orden en que un armador (o un charter broker) describe un
// barco, que además es el orden en que le importa a quien pregunta:
//
//   1. Identificación y registro  → ¿qué barco es y con qué papeles navega?
//   2. Dimensiones y arquitectura → ¿cuánto mide y de qué está hecho?
//   3. Capacidad y distribución   → ¿cuánta gente y cómo se reparte?
//   4. Propulsión y rendimiento   → ¿qué lo mueve y a qué velocidad?
//   4b. Aparejo y vela            → solo los veleros
//   5. Sistemas de a bordo        → agua, electricidad, residuos
//   6. Navegación y comunicaciones→ con qué se gobierna y cómo se pide ayuda
//   7. Seguridad                  → el bloque que de verdad diferencia
//   8. Cocina, barra y confort    → nuestro diferenciador, en clave técnica
//   9. Sostenibilidad a bordo     → cero plástico, residuos, fondeo
//
// ⚠️ PROCEDENCIA DE LOS DATOS — la regla de la casa no se rompe:
//   · `origen: 'verificado'` = el dato sale de about-hispaniola.php (eslora,
//     año, tipo, capacidad) o de una política real ya publicada (cero
//     plástico, aportación a la fundación). Se marca con un punto en el modal.
//   · el resto son DATOS DE EJEMPLO, avisados con un cartel arriba del modal.
//   · `valor: null` = no hay dato en ninguna fuente y NO se inventa (el Joker
//     no tiene eslora publicada; ahí la fila dice «pendiente», no un número
//     verosímil). Es la misma regla que ya protege `anio` en data/nosotros.ts.
export type FilaSpec = {
  label: string
  /** null = no hay dato documentado. NO se rellena con un valor plausible. */
  valor: string | null
  /** Lo que hace la ficha «bien explicada»: qué significa el dato para quien va a bordo. */
  nota?: string
  /**
   * 'verificado' = dato real del armador (about-hispaniola.php) o política ya
   * publicada. Sin este campo, es dato de ejemplo.
   *
   * ⚠️ YA NO SE PINTA (2026-07-28, Samuel: «quita de la ficha lo que dice que
   * son datos de ejemplo»). El modal llevaba un cartel arriba explicando la
   * procedencia y un punto aqua por fila; los dos se retiran — mismo criterio
   * que el aviso del visor de 360º: la maqueta enseña la página, no sus
   * andamios.
   *
   * El campo SE QUEDA a propósito y no es código muerto: es la única marca de
   * qué se puede publicar tal cual y qué hay que sustituir cuando lleguen las
   * specs reales de cada barco. Perderlo obligaría a rehacer esa criba a mano
   * sobre 60 filas × 12 embarcaciones.
   */
  origen?: 'verificado'
}

export type GrupoSpec = {
  id: string
  titulo: string
  /**
   * El mismo bloque, en una sola palabra, para el índice lateral del modal
   * (2026-07-28, Samuel: «me parece un poco confuso el menú lateral, vamos a
   * intentar simplificarlo»). Con el título largo, 6 de los 9 ítems partían en
   * dos líneas y el índice se leía como un segundo cuerpo de texto en vez de
   * como una lista de saltos.
   */
  tituloCorto: string
  icono: LucideIcon
  /** Una línea que explica de qué va el bloque antes de soltar la tabla. */
  intro: string
  filas: FilaSpec[]
}

/** Lo que varía de un barco a otro. Todo dato de ejemplo salvo lo marcado. */
type PerfilTecnico = {
  casco: string
  astillero: string
  refit: string
  cubiertaUtil: string
  manga: string
  calado: string
  desplazamiento: string
  pasajerosCertificados: string | null
  tripulacion: string
  aseos: string
  motores: string
  potencia: string
  /**
   * La MISMA potencia de `potencia`, pero en número — los caballos TOTALES
   * (los dos motores sumados). Existe para poder DIBUJARLA: la ficha técnica
   * la pinta como una barra de progreso con el catamarán navegando hasta su
   * marca (ver `potenciaDe` más abajo y flota/barra-potencia.tsx).
   *
   * Se declara aparte en vez de sacarlo de la cadena con una expresión
   * regular —que es como se resolvió primero para el titular— porque un dato
   * que gobierna un elemento visual no puede depender de que nadie cambie
   * nunca el formato del texto. El día que alguien escriba «480 CV» o «2x240
   * hp», la regex devuelve null y la barra se queda en cero sin avisar.
   */
  potenciaHp: number
  transmision: string
  crucero: string
  maxima: string
  combustible: string
  autonomia: string
  generador: string
  aguaDulce: string
  sombra: string
  /** Solo veleros. */
  vela?: { aparejo: string; superficie: string; mayor: string; foque: string; mastil: string }
  /** Equipamiento propio de este barco, además del común de la flota. */
  extras: string[]
}

const PERFILES: Record<string, PerfilTecnico> = {
  'Santa María': {
    casco: 'Twin fiberglass hulls, laminated, with structural reinforcement where the hulls meet',
    astillero: 'Custom-built for Hispaniola Aquatic Adventures',
    refit: '2022: engines, deck upholstery and electrical system',
    cubiertaUtil: '68 m² of usable deck',
    manga: '6.4 m (21 ft)',
    calado: '0.95 m',
    desplazamiento: '9.8 t light · 12.4 t fully loaded',
    pasajerosCertificados: '40 passengers',
    tripulacion: '4 (skipper, deckhand, chef and snorkeling guide)',
    aseos: '1 marine head with sink',
    motores: '2 × Yanmar 4LHA-STP, inboard diesel',
    potencia: '2 × 240 hp (480 hp total)',
    potenciaHp: 480,
    transmision: 'Shaft drive with 3-blade nickel-bronze propellers',
    crucero: '12 knots',
    maxima: '18 knots',
    combustible: '2 × 400 L',
    autonomia: '180 nautical miles at cruising speed',
    generador: 'Onan 5 kW, sound-insulated',
    aguaDulce: '380 L + pressure pump and stern shower',
    sombra: '34 m² of hard top over the main deck',
    extras: ['4-step swim ladder at the stern', 'Tensioned-net trampoline at the bow'],
  },
  'Forever Teresa': {
    casco: 'Twin fiberglass hulls with a continuous two-level deck',
    astillero: 'Custom-built for Hispaniola Aquatic Adventures',
    refit: '2023: upper deck, bar and sound system',
    cubiertaUtil: '145 m² of usable deck across two levels',
    manga: '9.1 m (30 ft)',
    calado: '1.20 m',
    desplazamiento: '26 t light · 34 t fully loaded',
    pasajerosCertificados: '150 passengers',
    tripulacion: '8 (skipper, 2 deckhands, 2 kitchen crew, bartender and 2 guides)',
    aseos: '3 marine heads with sink',
    motores: '2 × Cummins QSB 6.7, inboard diesel',
    potencia: '2 × 380 hp (760 hp total)',
    potenciaHp: 760,
    transmision: 'Shaft drive with 4-blade propellers and hydraulic steering',
    crucero: '11 knots',
    maxima: '16 knots',
    combustible: '2 × 900 L',
    autonomia: '220 nautical miles at cruising speed',
    generador: '2 × Onan 11 kW, sound-insulated (one as backup)',
    aguaDulce: '1,200 L + 60 L/h watermaker',
    sombra: '90 m² of shade across the two levels',
    extras: [
      '6 m service bar with two under-counter fridges',
      'Dance floor on the upper deck',
      'Two independent swim ladders',
    ],
  },
  Maite: {
    casco: 'Twin fiberglass hulls with PVC sandwich core, sailing-cruiser design',
    astillero: 'European shipyard: production sailing cruiser, adapted for day trips',
    refit: '2021: full sail wardrobe, standing rigging and navigation electronics',
    cubiertaUtil: '52 m² of usable deck',
    manga: '6.8 m (22 ft)',
    calado: '1.15 m',
    desplazamiento: '8.2 t light · 10.1 t fully loaded',
    pasajerosCertificados: '30 passengers',
    tripulacion: '3 (skipper, deckhand and guide)',
    aseos: '2 marine heads, one per hull',
    motores: '2 × Yanmar 3YM30, inboard diesel (auxiliary)',
    potencia: '2 × 29 hp (58 hp total)',
    potenciaHp: 58,
    transmision: 'Saildrive with 2-blade folding propellers',
    crucero: '7 knots under engine · 8-9 knots under sail in 15 knots of wind',
    maxima: '9 knots under engine',
    combustible: '2 × 200 L',
    autonomia: '240 nautical miles under engine; unlimited under sail',
    generador: 'No generator, 400 Ah lithium battery bank with solar panels',
    aguaDulce: '400 L + stern shower',
    sombra: '18 m² bimini over the cockpit',
    vela: {
      aparejo: '9/10 fractional sloop with genoa furler',
      superficie: '92 m² of upwind sail area',
      mayor: '48 m² semi-batten mainsail with three reef points',
      foque: '44 m² genoa on a furler; 110 m² gennaker for downwind',
      mastil: '18 m anodized aluminum mast above deck',
    },
    extras: ['Bow trampolines on both sides', 'Silent anchorage: engines off during the stop'],
  },
  GrandMa: {
    casco: 'Twin fiberglass hulls, open deck with a slide built into the stern',
    astillero: 'Custom-built for Hispaniola Aquatic Adventures',
    refit: '2024: slide, upholstery and engine overhaul',
    cubiertaUtil: '61 m² of usable deck',
    manga: '6.2 m (20 ft)',
    calado: '0.90 m',
    desplazamiento: '9.1 t light · 11.5 t fully loaded',
    pasajerosCertificados: '35 passengers',
    tripulacion: '4 (skipper, deckhand, chef and snorkeling guide)',
    aseos: '1 marine head with sink',
    motores: '2 × Yanmar 4JH110, inboard diesel',
    potencia: '2 × 110 hp (220 hp total)',
    potenciaHp: 220,
    transmision: 'Shaft drive with 3-blade propellers',
    crucero: '10 knots',
    maxima: '15 knots',
    combustible: '2 × 350 L',
    autonomia: '160 nautical miles at cruising speed',
    generador: 'Onan 5 kW, sound-insulated',
    aguaDulce: '350 L + stern shower',
    sombra: '30 m² of canopy over the main deck',
    extras: [
      '4.5 m stern slide draining onto the swim platform',
      'Kids’ play area enclosed with perimeter netting',
    ],
  },
  Joker: {
    casco: 'Planing fiberglass hull with a two-story superstructure and sliding roof',
    astillero: 'Custom-built for Hispaniola Aquatic Adventures',
    refit: '2023: sliding roof, sound system and upper bar',
    cubiertaUtil: '78 m² across two floors',
    manga: '5.6 m (18 ft)',
    calado: '0.80 m',
    desplazamiento: '7.4 t light · 9.2 t fully loaded',
    // El Joker no tiene capacidad publicada en la fuente (se cotiza como
    // evento). No se inventa un «hasta N» certificado a partir de la nada.
    pasajerosCertificados: null,
    tripulacion: '4 (skipper, deckhand, bartender and host)',
    aseos: '1 marine head with sink',
    motores: '2 × Suzuki DF300, gasoline outboards',
    potencia: '2 × 300 hp (600 hp total)',
    potenciaHp: 600,
    transmision: 'Outboards with 4-blade stainless steel propellers',
    crucero: '18 knots',
    maxima: '32 knots',
    combustible: '2 × 450 L',
    autonomia: '140 nautical miles at cruising speed',
    generador: 'Honda 3.5 kW, sound-insulated',
    aguaDulce: '250 L + stern shower',
    sombra: '24 m² sliding roof over the upper floor',
    extras: [
      'Side slide from the upper floor',
      'Lit bar with fridge and ice machine',
      'Sound system with 4 independent zones',
    ],
  },
  Karaya: {
    casco: 'Two-level catamaran platform in steel and aluminum, built for static events and bay cruising',
    astillero: 'Custom-built, the largest event vessel in the Caribbean',
    refit: '2024: service kitchen, stage lighting and railings',
    cubiertaUtil: '938 m² of total area across two levels',
    manga: '18 m (59 ft)',
    calado: '1.40 m',
    desplazamiento: '120 t light · 165 t fully loaded',
    pasajerosCertificados: '400 passengers',
    tripulacion: '14 (skipper, 3 deckhands, 6 kitchen and floor crew, 2 technicians and 2 security)',
    aseos: '6 restrooms, two of them accessible',
    motores: '2 × Caterpillar C7.1, inboard diesel',
    potencia: '2 × 300 hp (600 hp total)',
    potenciaHp: 600,
    transmision: 'Shaft drive with ducted propellers and bow thruster',
    crucero: '7 knots',
    maxima: '10 knots',
    combustible: '2 × 1,500 L',
    autonomia: '200 nautical miles at cruising speed',
    generador: '2 × 40 kW, sound-insulated, with automatic switchover',
    aguaDulce: '4,000 L + 150 L/h watermaker',
    sombra: '320 m² covered across the two levels',
    extras: [
      'Service kitchen with cold room and blast chiller',
      '40 m² stage with DMX lighting',
      '1.20 m wide boarding ramp, wheelchair accessible',
      'Redundant generator set for the event service',
    ],
  },
}

// Lo que es IGUAL en toda la flota — política de empresa, no spec de barco.
// Vive una sola vez para que corregirlo sea corregirlo en los 6 (y luego 12).
const REGISTRO_COMUN: FilaSpec[] = [
  {
    label: 'Flag and home port',
    valor: 'Dominican Republic · Cabeza de Toro, Punta Cana',
    nota: 'We depart from our own dock, not a rented marina.',
  },
  {
    label: 'Registration',
    valor: 'Registered with the Dominican Port Authority',
    nota: 'Listed in the national register of commercial passenger vessels.',
  },
  {
    label: 'Certificate of seaworthiness',
    valor: 'Current, annual inspection by the Dominican Republic Navy',
    nota: 'Without a valid certificate the vessel cannot take passengers on board. It is renewed every year.',
  },
  {
    label: 'Passenger transport license',
    valor: 'Current, for commercial sea excursions',
  },
  {
    label: 'Call sign / MMSI',
    valor: 'Assigned, provided in the charter paperwork',
    nota: 'The boat’s radio ID: it is what gets transmitted when calling for assistance over VHF.',
  },
]

const NAVEGACION_COMUN: FilaSpec[] = [
  {
    label: 'Charts and plotter',
    valor: 'Multifunction plotter with Navionics charts of the Caribbean',
    nota: 'The tour route is stored as a fixed track: we always sail the same marked channel.',
  },
  {
    label: 'Depth sounder',
    valor: 'Echo sounder with minimum-depth alarm',
    nota: 'It warns before we reach shallow water. That protects the reef as much as the hull.',
  },
  { label: 'Radio', valor: 'Fixed VHF with DSC + 2 handhelds, permanent watch on channel 16' },
  { label: 'AIS', valor: 'Class B transponder, the boat is seen and sees the traffic around it' },
  { label: 'Compass', valor: 'Lit binnacle magnetic compass' },
  { label: 'Navigation lights', valor: 'LED, compliant with the international collision regulations (COLREG)' },
  { label: 'Anchor and ground tackle', valor: 'Electric windlass with 50 m of calibrated chain' },
]

const SEGURIDAD_COMUN = (capacidad: string | null): FilaSpec[] => [
  {
    label: 'Life jackets',
    valor: capacidad
      ? `Certified for 100% of passengers (${capacidad.toLowerCase()}), with child sizes on top`
      : 'Certified for 100% of passengers, with child sizes on top',
    nota: 'Child sizes are not counted within the adult total: they are extra, not instead of.',
  },
  { label: 'Life rings', valor: '2 rings with floating line and self-igniting light' },
  {
    label: 'Life raft',
    valor: 'Self-inflating raft with capacity for everyone on board, serviced annually at a certified workshop',
  },
  { label: 'Fire extinguishers', valor: 'Portable extinguishers by zone + fixed system in the engine room' },
  {
    label: 'First aid kit and oxygen',
    valor: 'On-board first aid kit + emergency oxygen unit',
    nota: 'Oxygen is the standard among dive operators (DAN) and is not required on excursions: we carry it anyway.',
  },
  { label: 'Distress signals', valor: 'In-date flares and smoke signals' },
  { label: 'Bilge pumps', valor: 'Automatic pumps per compartment with bilge alarm at the helm' },
  {
    label: 'Crew certification',
    valor: 'Licensed skipper; deck crew trained in first aid and CPR',
    nota: 'We run man-overboard and abandon-ship drills with the crew every season.',
  },
  {
    label: 'Insurance',
    valor: 'Current passenger liability policy',
    nota: 'It covers every person on board for the whole excursion, not just the sailing part.',
  },
]

const SOSTENIBILIDAD_COMUN: FilaSpec[] = [
  {
    label: 'Single-use plastic',
    valor: 'Zero on board',
    origen: 'verificado',
    nota: 'Reusable plates and glasses, glass bottles and plant-based straws. It has been house policy since our first boat.',
  },
  {
    label: 'Waste',
    valor: 'Sorted on board; everything comes back ashore at the end of the day',
    nota: 'Nothing goes overboard, not even food scraps: they disrupt the reef’s wildlife.',
  },
  {
    label: 'Black and gray water',
    valor: 'Holding tank, discharged in port',
    nota: 'Never emptied at the anchorage or over the coral nursery.',
  },
  {
    label: 'Anchoring',
    valor: 'Fixed mooring at the tour stops, the anchor never touches coral',
    nota: 'A dragging anchor is the fastest damage an excursion boat can do.',
  },
  {
    label: 'Antifouling paint',
    valor: 'Low-leaching, free of organotin compounds',
  },
  {
    label: 'Contribution per guest',
    // [v3 2026-08-06] 4,50 y no 3,50: lo fija el copy aprobado de
    // sostenibilidad, que da el dato dos veces.
    valor: 'US$ 4.50 + US$ 2.00 per person to the Bávaro Reefs Foundation',
    origen: 'verificado',
    nota: 'It goes from the tour price to the coral nursery and the community projects. Details under Sustainability.',
  },
]

/**
 * Construye la ficha técnica completa de un barco.
 *
 * Los datos REALES (`origen: 'verificado'`) se leen del propio `BarcoFlota`,
 * que a su vez los tomó verbatim de about-hispaniola.php — así la ficha no
 * puede desincronizarse de la fila de meta de la card: son el mismo dato
 * pintado dos veces, no dos copias.
 */
export function fichaTecnicaDe(barco: BarcoFlota): GrupoSpec[] {
  const p = PERFILES[barco.nombre]
  if (!p) return []

  const grupos: GrupoSpec[] = [
    {
      id: 'identificacion',
      titulo: 'Identification and registration',
      tituloCorto: 'Identification',
      icono: Ship,
      intro: 'Exactly which vessel this is and what paperwork she sails under. It is the first thing anyone who knows boats looks at.',
      filas: [
        { label: 'Name', valor: barco.nombre, origen: 'verificado' },
        { label: 'Type', valor: barco.tipo, origen: 'verificado' },
        {
          label: 'Year built',
          valor: barco.anio,
          origen: barco.anio ? 'verificado' : undefined,
          nota: barco.anio ? undefined : 'The owner’s records do not date this vessel. Pending confirmation.',
        },
        { label: 'Shipyard', valor: p.astillero },
        { label: 'Last major refit', valor: p.refit, nota: 'Refit: the deep overhaul that renews systems, not routine maintenance.' },
        ...REGISTRO_COMUN,
      ],
    },
    {
      id: 'dimensiones',
      titulo: 'Dimensions and architecture',
      tituloCorto: 'Dimensions',
      icono: Ruler,
      intro: 'How big she is and what she is made of. Beam (the width) decides how much deck you actually walk on, far more than length.',
      filas: [
        {
          label: 'Length overall',
          valor: barco.eslora,
          origen: barco.eslora ? 'verificado' : undefined,
          nota: barco.eslora
            ? 'Measured bow to stern, transom included.'
            : 'The owner’s records do not publish a length for this vessel. Pending confirmation.',
        },
        { label: 'Maximum beam', valor: p.manga, nota: 'The width at its widest point: on a catamaran that is what gives you stability and space.' },
        { label: 'Draft', valor: p.calado, nota: 'How deep she sits. Shallow draft = she can get close to the beach and to the natural pool.' },
        { label: 'Displacement', valor: p.desplazamiento, nota: 'Weight empty, and with passengers, luggage, water and fuel.' },
        { label: 'Hull material', valor: p.casco },
        { label: 'Usable deck', valor: p.cubiertaUtil, nota: 'The area you can walk on, not counting the crew’s working space.' },
        { label: 'Shaded area', valor: p.sombra, nota: 'In the Caribbean this is not a luxury: it is what makes the middle of the day bearable.' },
      ],
    },
    {
      id: 'capacidad',
      titulo: 'Capacity and layout',
      tituloCorto: 'Capacity',
      icono: Users,
      intro: 'How many people fit, how many we actually take on board and how they spread out. The two figures do not match, and that is on purpose.',
      filas: [
        {
          label: 'Certified passengers',
          valor: p.pasajerosCertificados,
          nota: p.pasajerosCertificados
            ? 'The legal maximum authorized by the certificate of seaworthiness.'
            : 'This vessel is quoted as an event and has no published maximum. Pending confirmation.',
        },
        {
          label: 'Passengers we take on board',
          valor: barco.capacidad,
          origen: barco.capacidad ? 'verificado' : undefined,
          nota: barco.capacidad
            ? 'Our real cap, below the certified one: we would rather sell fewer seats and have room to spare.'
            : 'Quoted per group. Write to us with your number of guests.',
        },
        { label: 'Crew', valor: p.tripulacion },
        { label: 'Restrooms', valor: p.aseos },
        { label: 'Best for', valor: barco.idealPara, origen: 'verificado' },
      ],
    },
    {
      id: 'propulsion',
      titulo: 'Propulsion and performance',
      tituloCorto: 'Propulsion',
      icono: Gauge,
      intro: 'What moves her and how fast. On a day trip, speed matters less than range and fuel use.',
      filas: [
        { label: 'Engines', valor: p.motores },
        { label: 'Power', valor: p.potencia },
        { label: 'Transmission', valor: p.transmision },
        { label: 'Cruising speed', valor: p.crucero, nota: 'The speed we actually sail on the tour route.' },
        { label: 'Top speed', valor: p.maxima },
        { label: 'Fuel', valor: p.combustible },
        { label: 'Range', valor: p.autonomia, nota: 'A day trip uses a tiny fraction of that margin.' },
      ],
    },
  ]

  if (p.vela) {
    grupos.push({
      id: 'vela',
      titulo: 'Rig and sails',
      tituloCorto: 'Sails',
      icono: Wind,
      intro: 'The only one in the fleet that truly sails: with steady wind the engines go off and the trip is made in silence.',
      filas: [
        { label: 'Rig', valor: p.vela.aparejo },
        { label: 'Sail area', valor: p.vela.superficie },
        { label: 'Mainsail', valor: p.vela.mayor },
        { label: 'Jib / genoa', valor: p.vela.foque },
        { label: 'Mast', valor: p.vela.mastil },
      ],
    })
  }

  grupos.push(
    {
      id: 'sistemas',
      titulo: 'Onboard systems',
      tituloCorto: 'Systems',
      icono: Zap,
      intro: 'Water, power and waste. This is what decides whether, three hours in, there is still cold water, ice and a working restroom.',
      filas: [
        { label: 'Generator', valor: p.generador },
        { label: 'Electrical system', valor: '12 V for navigation services + 110 V through an inverter for onboard service' },
        { label: 'Fresh water', valor: p.aguaDulce },
        { label: 'Black water', valor: 'Holding tank, discharged in port', nota: 'See the sustainability block: it is never discharged in the swimming area.' },
        { label: 'Lighting', valor: 'Low-consumption LED on deck, courtesy lights and marked walkways' },
        { label: 'Boat-specific equipment', valor: p.extras.join(' · ') },
      ],
    },
    {
      id: 'navegacion',
      titulo: 'Navigation and communications',
      tituloCorto: 'Navigation',
      icono: Compass,
      intro: 'What she is steered with and how help is called. All of it redundant: if one piece of equipment fails, another does its job.',
      filas: NAVEGACION_COMUN,
    },
    {
      id: 'seguridad',
      titulo: 'Safety',
      tituloCorto: 'Safety',
      icono: ShieldCheck,
      intro: 'The block almost nobody shows, and the one that really separates an owner-operator from a middleman. It is all checked before every season.',
      filas: SEGURIDAD_COMUN(barco.capacidad),
    },
    {
      id: 'cocina',
      titulo: 'Kitchen, bar and comfort',
      tituloCorto: 'Kitchen and comfort',
      icono: UtensilsCrossed,
      intro: 'We are the only excursion company in the country with a floating kitchen. In technical terms, this is what that means.',
      filas: [
        {
          label: 'Floating kitchen',
          valor: 'Gas grill with extraction and stainless steel countertop',
          origen: 'verificado',
          nota: 'Cooking happens while we sail, in front of the guests. Nothing on board is reheated.',
        },
        { label: 'Refrigeration', valor: 'Compressor fridges + a separate ice chest for drinks' },
        { label: 'Bar', valor: 'Service bar with sink and pressurized water' },
        { label: 'Sound', valor: 'Marine system with Bluetooth and waterproof speakers by zone' },
        { label: 'Shower', valor: 'Fresh-water stern shower for when you come out of the water' },
        {
          label: 'Snorkeling gear',
          valor: 'Masks and snorkels by size, fins and flotation vests',
          nota: 'Disinfected between trips. You can bring your own if you prefer.',
        },
        { label: 'Boarding', valor: 'Boarding from our own dock with a gangway and crew on hand' },
      ],
    },
    {
      id: 'sostenibilidad',
      titulo: 'Sustainability on board',
      tituloCorto: 'Sustainability',
      icono: Leaf,
      intro: 'Not a statement of intent: these are equipment and operating decisions you can check on the boat itself.',
      filas: SOSTENIBILIDAD_COMUN,
    },
  )

  return grupos
}

// [v2 2026-07-28] Aquí vivió `titularesTecnicos`, que devolvía las 4 cifras de
// cabecera del modal (eslora · pasaje · año · potencia). Se retira en dos
// pasos y por dos motivos distintos, que conviene no confundir:
//
//   1. La POTENCIA se salió de la rejilla porque en una casilla de 180px la
//      cadena se cortaba a media palabra («2 × 240 hp (480 hp …») y una cifra
//      truncada no informa de nada. Ahora es la barra navegable (`potenciaDe`),
//      donde además deja de ser un número suelto: dice cuánto es ESO comparado
//      con el resto de la flota.
//   2. Las otras tres se cayeron enteras (Samuel: «preferiría incluso solo la
//      barra y ya»). No se pierde nada: eslora, pasaje y año son las primeras
//      filas de Identificación, Dimensiones y Capacidad, dos pantallazos más
//      abajo en la misma ficha. Estaban dichas dos veces.

/** El caballaje total más alto de la flota — el final del recorrido de la barra. */
const POTENCIA_MAXIMA_FLOTA = Math.max(...Object.values(PERFILES).map((p) => p.potenciaHp))

/**
 * La potencia de un barco lista para dibujarse (flota/barra-potencia.tsx).
 *
 * LA ESCALA ES LA FLOTA, NO UN MÁXIMO INVENTADO. Se podría normalizar contra
 * un tope redondo (1.000 hp) y quedaría más «limpio», pero no significaría
 * nada: 480 sobre 1.000 es una cifra arbitraria. Sobre los 760 hp del Forever
 * Teresa —el más potente que tenemos— la barra contesta la única pregunta que
 * alguien se hace mirándola: *¿este barco es de los fuertes o de los
 * tranquilos?* Y se recalibra sola cuando entre un barco más potente.
 */
export function potenciaDe(barco: BarcoFlota) {
  const p = PERFILES[barco.nombre]
  if (!p) return null
  return {
    hp: p.potenciaHp,
    /** El desglose por motor, tal cual va en el bloque de propulsión. */
    detalle: p.motores,
    maximo: POTENCIA_MAXIMA_FLOTA,
    /** 0-1. El barco de la punta se dibuja sobre esta fracción del recorrido. */
    fraccion: p.potenciaHp / POTENCIA_MAXIMA_FLOTA,
  }
}

// [v2 2026-07-28] `FICHA_TECNICA_AVISO` se retira (Samuel: «quita de la ficha
// lo que dice que son datos de ejemplo»). Era el cartel que encabezaba el
// modal explicando la procedencia y la leyenda del punto de «verificado».
//
// ⚠️ Lo que se ha quitado es el CARTEL, no la regla: las specs de ejemplo
// siguen marcadas en el dato (`origen`, arriba) y los huecos sin fuente
// siguen diciendo «Pendiente» en vez de inventarse un número. Antes de
// publicar hay que sustituirlas por las reales — la criba está hecha en el
// código, no en pantalla.

// ═════════════════════════════════════════════════════════════════════════
// §4 — BANNER «CERO PLÁSTICO» (slide 30)
// ═════════════════════════════════════════════════════════════════════════
//
// El cliente puso la flecha sobre el banner de cierre («El arrecife que
// reconstruimos») con la nota «banner enfocado a 0 plastico». Samuel confirma
// la lectura: en esta página el banner CAMBIA de mensaje — el texto y la foto
// van sobre cero plástico, no sobre coral.
//
// Por qué aquí funciona y en /sostenibilidad no haría falta: en una página
// que enseña las embarcaciones una a una, «cero plástico a bordo» es un
// argumento SOBRE LOS BARCOS. El coral es sobre el destino, y ya tiene su
// propia página (el enlace del CTA sigue llevando allí, así no se pierde el
// tráfico interno que daba el banner anterior).
//
// ⚠️ CONTENIDO PENDIENTE (plan 04 §4): «cero plástico» era hasta hoy una
// cifra sin desarrollar. Las tres sustituciones concretas de abajo son la
// lectura razonable de lo que ya dice la web (vajilla reutilizable, cristal),
// pero hay que CONFIRMARLAS con el cliente antes de publicar — si en realidad
// las botellas son de aluminio, el banner estaría mintiendo en el detalle.
export const CERO_PLASTICO = {
  eyebrow: 'Zero plastic on board',
  titulo: 'Not one plastic bottle comes aboard our boats',
  texto:
    'It is not a campaign: it is how they are equipped. Every boat in the fleet leaves the dock without single-use plastic, and everything generated on board comes back ashore with us.',
  puntos: [
    { titulo: 'Glass and steel', texto: 'Glass bottles and steel pitchers at the bar, instead of small plastic bottles.' },
    { titulo: 'Reusable tableware', texto: 'Plates, glasses and cutlery that get washed and come back, trip after trip.' },
    { titulo: 'Plant-based straws', texto: 'And not a single plastic bag in the floating kitchen.' },
  ],
  cta: 'See the rest of our commitment',
  ctaHref: '/competitive-advantage',
  // Foto de fondo: agua turquesa limpia vista desde el aire — la misma
  // familia de imagen que ya usa el banner de arrecife, porque el mensaje
  // («el mar que devolvemos como lo encontramos») es el que pide mar limpio,
  // no una foto de residuos. Es decorativa: el texto ya lo cuenta todo.
  foto: 'arrecife-fondo-cenital',
}

// ═════════════════════════════════════════════════════════════════════════
// §5 — LA COCINA FLOTANTE Y LAS 3 PARADAS (slides 32-34)
// ═════════════════════════════════════════════════════════════════════════
//
// Slide 32, nota del cliente: «Además destacar esta sección dado que ser la
// única cocina flotante de Punta Cana hay que destacarlo». Slide 33 es la
// maqueta de Samuel de esa misma sección, y el slide 34 son las 3 paradas.
//
// ⚠️ SE PROBÓ EN OSCURO Y SE RETIRÓ (2026-07-28). La maqueta del slide 33 va
// en tema oscuro y el primer montaje la siguió, con la familia de tokens
// --color-premium-* (fondo casi negro, acentos en oro). Samuel lo descartó al
// verlo montado: «quita todo ese tema oscuro, sigamos con los colores y la
// estética clara en esas secciones, el cambio es demasiado brusco».
//
// Y tenía razón por una cosa que en la slide suelta no se ve: en la maqueta,
// ese bloque está solo; en la página real llega después de la presentación, la
// rejilla de 6 barcos y sus fichas, todo sobre papel. Una banda casi negra a
// sangre en medio de eso no se lee como «lujo», se lee como haber aterrizado
// en otra web. La sección vuelve al lenguaje claro de la casa.
//
// ⚠️ Y CON ELLO SE CAYERON LOS PATRONES DE RELLENO que arrastraba (Samuel:
// «no uses patrones tan de IA […] muchas cosas se ven IA slop genérica»).
// Los cuatro señalados y qué se hizo con cada uno:
//   · la RAYITA antes del eyebrow → fuera; se usa `ui/etiqueta.tsx`, que es el
//     eyebrow del sitio desde v3-F17.1 y es solo texto.
//   · los BULLETS en círculo de los 3 puntos → fuera. Los 3 puntos no
//     desaparecen: pasan a ser el PIE DE LAS 3 FOTOS que los demuestran. Una
//     afirmación pegada a la foto que la prueba pesa más que la misma
//     afirmación con un punto al lado.
//   · la LÍNEA DIVISORIA + frase pequeña centrada que abría la banda → fuera
//     entera. No decía nada que el titular no dijera.
//   · las 3 CIFRAS separadas por líneas verticales → fuera la fila. «La única
//     cocina flotante» era el H2 repetido en formato de cifra, que es
//     literalmente el patrón que hay que evitar; lo que sí aportaban las otras
//     dos (0% recalentado, 7 platos) se absorbió en un párrafo redactado aquí
//     — que también se ha retirado (2026-08-07), porque el copy aprobado ya
//     daba las dos cifras. Ver la nota en `COCINA_Y_PARADAS`, más abajo.
// Se retira también la tira «Míralo por dentro»: con las 3 fotos-prueba y las
// 3 paradas, era una cuarta fila de fotos en la misma sección.
//
// El COPY no se inventa: `COCINA_FLOTANTE` y `EXPERIENCIA_ABORDO` se importan
// de data/nosotros.ts en el componente. Aquí solo vive lo que este formato
// añade — y `momentos`, que sale de la propia maqueta del cliente (slide 34:
// «PRIMERA PARADA · AL MEDIODÍA · PARA CERRAR»).
export const COCINA_Y_PARADAS = {
  // ⚠️ AQUÍ VIVÍA `detalle` Y SE RETIRA (2026-08-07, Samuel: «quítala»). Era el
  // párrafo que absorbía las dos cifras del slide 33 como prosa —«Seven dishes
  // to choose from, grilled while you sail. Zero reheated food…»—, y era copy
  // REDACTADO AQUÍ, no aprobado por el cliente: justo lo que prohíbe la regla
  // de tres líneas más arriba en este mismo bloque.
  //
  // No se pierde nada al quitarlo. Los dos datos ya los dice, con palabras
  // aprobadas, `COCINA_FLOTANTE.textoExtra[0]` de data/nosotros.ts («Choose
  // from seven freshly grilled dishes… No reheated food. No buffet trays.»),
  // que la banda pinta JUSTO ENCIMA de donde estaba este párrafo. Era la misma
  // afirmación contada dos veces seguidas, una de ellas sin aprobar.
  //
  // Si algún día hace falta rematar ese bloque, la frase sale del copy
  // aprobado — no se vuelve a redactar aquí.

  // LAS 3 PRUEBAS. Cada afirmación de `COCINA_FLOTANTE.puntos` va emparejada
  // con la foto que la demuestra — de ahí que el orden importe y no se pueda
  // barajar. Pies y alts verificados abriendo cada archivo, igual que
  // MEDIA_FLOTA.
  pruebas: [
    // «A la parrilla, recién hecho» → la barcaza-cocina con las parrillas a
    // la vista. ⚠️ El orden es el de `COCINA_FLOTANTE.puntos` y NO se puede
    // barajar: en el primer montaje estas dos estaban al revés y «Chef
    // cocinando a bordo» quedaba sobre la foto de la plataforma VACÍA, sin
    // ningún chef. Una afirmación sobre la foto que no la muestra es peor que
    // la misma afirmación suelta.
    {
      foto: 'cocina-flotante-plataforma',
      alt: 'The floating kitchen platform, grills set up, seen from the water',
    },
    // «Chef cocinando a bordo» → el chef, en su encimera.
    {
      foto: 'cocina-flotante',
      alt: 'The chef and two guests behind the counter, with trays of freshly cooked seafood and meat',
    },
    // «Mariscos y carnes frescos» → el bufé servido.
    {
      foto: 'events-8',
      alt: 'Seafood and meat buffet served on deck during a trip',
    },
  ],

  // La foto que acompaña al bloque de texto: huéspedes comiendo a bordo. No es
  // de la cocina —esa va abajo, en las pruebas— sino del RESULTADO, que es lo
  // que el visitante se está imaginando mientras lee el párrafo.
  foto: 'galeria-charter-privado-3',
  fotoAlt: 'Guests eating at tables on the upper deck, under the canopy',

  cta: { label: 'Experience the floating kitchen', to: '/#tours' },

  paradasEyebrow: 'The day’s route',
  paradasTitulo: 'A day at sea in 3 stops',
  paradasSub:
    'This is not a one-spot tour: it is a route designed so each stop adds something. Nature, beach and downtime, in that order.',
  // Copy del cliente (slide 34). Sustituye al numeral en círculo sobre la foto
  // que llevaba la versión anterior: «Primera parada» dice lo mismo que un
  // «01» y además dice CUÁNDO, que es la información que se estaba perdiendo.
  momentos: ['First stop', 'At midday', 'To finish'],
}
