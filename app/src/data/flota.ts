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
  // [v3] La caja «Grupos pequeños, espacio de verdad» se retira (tachada por
  // el cliente). En su lugar, el dato que su propia timeline convierte en
  // argumento: doce barcos construidos uno a uno desde 2010.
  destacado: {
    titulo: 'Since 2010, a fleet of 12',
    texto:
      'Our journey began in 2010 with a single boat and one clear vision: to create unforgettable experiences at sea. Every new vessel was made possible by the success of the one before it, allowing us to grow step by step without ever compromising quality.',
  },
  cta: { label: 'Conoce a la tripulación', to: '/crew' },

  // ── Media del lado derecho ──────────────────────────────────────────────
  // El slide pone una foto grande con el badge de TripAdvisor flotando arriba
  // y una card más pequeña anidada abajo a la derecha («Nuestros huéspedes»).
  foto: 'galeria-charter-privado-4',
  fotoAlt: 'Catamarán de Hispaniola fondeado frente a una playa de palmeras',
  fotoAnidada: 'galeria-semi-privado-3',
  fotoAnidadaAlt: 'Huéspedes disfrutando de un día a bordo con la tripulación',
  fotoAnidadaPie: 'Nuestros huéspedes',

  // ── El dueño ────────────────────────────────────────────────────────────
  // El slide 27 (y la reunión del 07-24, 28:46: «la foto de él, una frase que
  // va a hacer él, y esto 2022») pide que la historia se cuente con la cara y
  // la voz del fundador. La cita y el retrato salen de EQUIPO (data/nosotros)
  // — fuente única: si Omar cambia su frase, cambia en la home también.
  //
  // ⚠️ El retrato de Omar sigue siendo STOCK recortado, no es él (ver el
  // aviso largo en data/nosotros.ts). Sustituir antes de publicar.
  duenoRolLargo: 'fundador y director de Hispaniola',

  // ── El recorrido de años ────────────────────────────────────────────────
  recorridoEyebrow: 'El recorrido',
  // El titular NO lleva la cifra dentro («de seis») como el de /nosotros: en
  // cuanto entren los 6 barcos que faltan, un número escrito a mano en un
  // titular es justo lo que se queda obsoleto sin que nadie lo note.
  recorridoTitulo: 'De un barco a una flota',
  recorridoTexto:
    'Empezamos en 2012 con una sola embarcación. Cada barco que se sumó después se eligió por lo que le faltaba al anterior — más eslora, vela, tobogán, dos niveles — y no por tener uno más.',

  // ── Banda de KPIs ───────────────────────────────────────────────────────
  // ⚠️ La cifra de la flota NO se escribe: se CUENTA sobre FLOTA. El plan 04
  // §2 avisa de que «Flota de 6» aparece a mano en varios sitios y hay que
  // cambiarlos todos al pasar a 12; aquí eso no puede pasar.
  kpis: [
    { cifra: 'Desde 2012', label: 'navegando esta costa' },
    { cifra: '4,9', label: '1.782 reseñas verificadas' },
    { cifra: `Flota de ${FLOTA.length}`, label: 'embarcaciones propias' },
    { cifra: 'Única', label: 'cocina flotante en Punta Cana' },
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

// Cabecera de la rejilla. El titular de /nosotros decía «Seis catamaranes,
// uno para cada plan» — con la cifra dentro y con «catamaranes», que ya no es
// exacto (el Joker es una lancha y el Karaya una plataforma de eventos). Este
// no envejece al pasar a 12 ni miente sobre el tipo de casco.
export const REJILLA_FLOTA = {
  eyebrow: 'La flota',
  titulo: 'Una embarcación para cada plan',
  texto:
    'Todas propias, bien mantenidas y siempre impecables — cuidamos cada detalle para que tu tour se sienta especial, no en serie. De cada una tienes su vídeo, su galería y la ficha técnica completa.',
}

const VIDEO_BARCO = {
  tipo: 'video',
  src: '/video/hero.mp4',
  poster: '/fotos/hero-video-poster.webp',
  etiqueta: 'Recorrido a bordo',
} as const

/** Las fotos que acompañan al vídeo, con su etiqueta de encuadre. */
function galeriaDe(barco: BarcoFlota, extras: Array<[foto: string, etiqueta: string, alt: string]>): MediaBarco[] {
  return [
    { ...VIDEO_BARCO, alt: `Recorrido en vídeo por el ${barco.nombre}` },
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
        ['galeria-charter-privado-3', 'Cubierta y comedor', 'Cubierta superior con los huéspedes comiendo en mesas bajo el toldo'],
        ['cocina-flotante', 'Cocina flotante', 'El chef y dos huéspedes tras la encimera, con las bandejas de mariscos y carnes recién hechos'],
        ['galeria-charter-privado-7', 'En el agua', 'Grupo bañándose junto al catamarán fondeado'],
      ],
      [
        ['events-8', 'Servicio a bordo', 'Bufé servido en la cubierta durante una salida'],
        ['galeria-charter-privado-5', 'A bordo', 'Grupo brindando en la cubierta del catamarán'],
        ['galeria-isla-saona-3', 'Fondeado', 'El catamarán fondeado sobre agua turquesa poco profunda'],
      ],
      [
        ['galeria-snorkel-lovers-4', 'La parada de snorkel', 'Peces de colores sobre el arrecife en la parada de snorkel'],
        ['galeria-semi-privado-2', 'A bordo', 'Dos huéspedes sentados en la borda con sus bebidas'],
        ['galeria-isla-saona-7', 'Almuerzo en la playa', 'Mesa larga con el almuerzo servido bajo las palmeras'],
      ],
      [
        ['galeria-semi-privado-6', 'El tobogán', 'Grupo en el agua junto al catamarán, con el tobogán desplegado'],
        ['galeria-charter-privado-2', 'Playa desierta', 'Grupo con cocos recién abiertos en la playa, con el catamarán al fondo'],
        ['galeria-snorkel-lovers-9', 'En cubierta', 'Huéspedes preparando el equipo en la cubierta de popa'],
      ],
      [
        ['events-3', 'Bar flotante', 'El bar flotante con huéspedes alrededor, de pie en el agua'],
        ['galeria-charter-privado-5', 'A bordo', 'Grupo brindando en la cubierta de la embarcación'],
        ['bar-flotante', 'Barra en el agua', 'La barra flotante durante el servicio de bebidas'],
      ],
      [
        ['events-8', 'Servicio a bordo', 'Bufé servido en la cubierta durante una celebración'],
        ['galeria-charter-privado-3', 'Cubierta y comedor', 'Cubierta superior con las mesas montadas bajo el toldo'],
        ['galeria-isla-saona-3', 'Fondeado', 'La embarcación fondeada sobre agua turquesa poco profunda'],
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
    casco: 'Doble casco en fibra de vidrio laminada con refuerzo estructural en la unión de cascos',
    astillero: 'Construcción a medida para Hispaniola Aquatic Adventures',
    refit: '2022 — motores, tapicería de cubierta y sistema eléctrico',
    cubiertaUtil: '68 m² de cubierta útil',
    manga: '6,4 m (21 pies)',
    calado: '0,95 m',
    desplazamiento: '9,8 t en rosca · 12,4 t a plena carga',
    pasajerosCertificados: '40 pasajeros',
    tripulacion: '4 (patrón, marinero, chef y guía de snorkel)',
    aseos: '1 aseo marino con lavabo',
    motores: '2 × Yanmar 4LHA-STP, diésel intraborda',
    potencia: '2 × 240 hp (480 hp totales)',
    potenciaHp: 480,
    transmision: 'Línea de ejes con hélices de 3 palas en bronce-níquel',
    crucero: '12 nudos',
    maxima: '18 nudos',
    combustible: '2 × 400 L',
    autonomia: '180 millas náuticas a velocidad de crucero',
    generador: 'Onan 5 kW insonorizado',
    aguaDulce: '380 L + grupo de presión y ducha de popa',
    sombra: '34 m² de toldo rígido sobre la cubierta principal',
    extras: ['Escalera de baño de 4 peldaños en popa', 'Trampolín de proa de red tensada'],
  },
  'Forever Teresa': {
    casco: 'Doble casco en fibra de vidrio con cubierta corrida de dos alturas',
    astillero: 'Construcción a medida para Hispaniola Aquatic Adventures',
    refit: '2023 — cubierta superior, barra y equipo de sonido',
    cubiertaUtil: '145 m² de cubierta útil repartidos en dos niveles',
    manga: '9,1 m (30 pies)',
    calado: '1,20 m',
    desplazamiento: '26 t en rosca · 34 t a plena carga',
    pasajerosCertificados: '150 pasajeros',
    tripulacion: '8 (patrón, 2 marineros, 2 de cocina, barman y 2 guías)',
    aseos: '3 aseos marinos con lavabo',
    motores: '2 × Cummins QSB 6.7, diésel intraborda',
    potencia: '2 × 380 hp (760 hp totales)',
    potenciaHp: 760,
    transmision: 'Línea de ejes con hélices de 4 palas y timones hidráulicos',
    crucero: '11 nudos',
    maxima: '16 nudos',
    combustible: '2 × 900 L',
    autonomia: '220 millas náuticas a velocidad de crucero',
    generador: '2 × Onan 11 kW insonorizados (uno de respaldo)',
    aguaDulce: '1.200 L + potabilizadora de 60 L/h',
    sombra: '90 m² de toldo entre los dos niveles',
    extras: [
      'Barra de servicio de 6 m con dos neveras bajo mostrador',
      'Pista de baile en cubierta superior',
      'Dos escaleras de baño independientes',
    ],
  },
  Maite: {
    casco: 'Doble casco en fibra de vidrio con sándwich de PVC, diseño de crucero de vela',
    astillero: 'Astillero europeo — crucero a vela de serie, adaptado a excursión',
    refit: '2021 — velamen completo, jarcia firme y electrónica de navegación',
    cubiertaUtil: '52 m² de cubierta útil',
    manga: '6,8 m (22 pies)',
    calado: '1,15 m',
    desplazamiento: '8,2 t en rosca · 10,1 t a plena carga',
    pasajerosCertificados: '30 pasajeros',
    tripulacion: '3 (patrón, marinero y guía)',
    aseos: '2 aseos marinos, uno por casco',
    motores: '2 × Yanmar 3YM30, diésel intraborda (auxiliares)',
    potencia: '2 × 29 hp (58 hp totales)',
    potenciaHp: 58,
    transmision: 'Saildrive con hélices abatibles de 2 palas',
    crucero: '7 nudos a motor · 8-9 nudos a vela con viento de 15 nudos',
    maxima: '9 nudos a motor',
    combustible: '2 × 200 L',
    autonomia: '240 millas náuticas a motor; ilimitada a vela',
    generador: 'Sin generador — banco de baterías de litio de 400 Ah con placas solares',
    aguaDulce: '400 L + ducha de popa',
    sombra: '18 m² de bimini sobre la bañera',
    vela: {
      aparejo: 'Sloop fraccionado 9/10 con enrollador de génova',
      superficie: '92 m² de superficie vélica al ceñir',
      mayor: 'Mayor semi-rodada de 48 m² con tres fajas de rizos',
      foque: 'Génova de 44 m² sobre enrollador; gennaker de 110 m² para portantes',
      mastil: 'Mástil de aluminio anodizado de 18 m sobre cubierta',
    },
    extras: ['Trampolines de proa a ambos lados', 'Fondeadero silencioso: motores apagados durante la parada'],
  },
  GrandMa: {
    casco: 'Doble casco en fibra de vidrio, cubierta abierta con tobogán integrado en popa',
    astillero: 'Construcción a medida para Hispaniola Aquatic Adventures',
    refit: '2024 — tobogán, tapicería y renovación de motores',
    cubiertaUtil: '61 m² de cubierta útil',
    manga: '6,2 m (20 pies)',
    calado: '0,90 m',
    desplazamiento: '9,1 t en rosca · 11,5 t a plena carga',
    pasajerosCertificados: '35 pasajeros',
    tripulacion: '4 (patrón, marinero, chef y guía de snorkel)',
    aseos: '1 aseo marino con lavabo',
    motores: '2 × Yanmar 4JH110, diésel intraborda',
    potencia: '2 × 110 hp (220 hp totales)',
    potenciaHp: 220,
    transmision: 'Línea de ejes con hélices de 3 palas',
    crucero: '10 nudos',
    maxima: '15 nudos',
    combustible: '2 × 350 L',
    autonomia: '160 millas náuticas a velocidad de crucero',
    generador: 'Onan 5 kW insonorizado',
    aguaDulce: '350 L + ducha de popa',
    sombra: '30 m² de toldo sobre la cubierta principal',
    extras: [
      'Tobogán de popa de 4,5 m con desagüe a la plataforma de baño',
      'Zona de juego infantil delimitada con red perimetral',
    ],
  },
  Joker: {
    casco: 'Casco planeador en fibra de vidrio con superestructura de dos pisos y techo corredizo',
    astillero: 'Construcción a medida para Hispaniola Aquatic Adventures',
    refit: '2023 — techo corredizo, sonido y barra superior',
    cubiertaUtil: '78 m² repartidos en dos pisos',
    manga: '5,6 m (18 pies)',
    calado: '0,80 m',
    desplazamiento: '7,4 t en rosca · 9,2 t a plena carga',
    // El Joker no tiene capacidad publicada en la fuente (se cotiza como
    // evento). No se inventa un «hasta N» certificado a partir de la nada.
    pasajerosCertificados: null,
    tripulacion: '4 (patrón, marinero, barman y anfitrión)',
    aseos: '1 aseo marino con lavabo',
    motores: '2 × Suzuki DF300, gasolina fueraborda',
    potencia: '2 × 300 hp (600 hp totales)',
    potenciaHp: 600,
    transmision: 'Fueraborda con hélices de acero inoxidable de 4 palas',
    crucero: '18 nudos',
    maxima: '32 nudos',
    combustible: '2 × 450 L',
    autonomia: '140 millas náuticas a velocidad de crucero',
    generador: 'Honda 3,5 kW insonorizado',
    aguaDulce: '250 L + ducha de popa',
    sombra: 'Techo corredizo de 24 m² sobre el piso superior',
    extras: [
      'Tobogán lateral desde el piso superior',
      'Barra iluminada con nevera y máquina de hielo',
      'Equipo de sonido de 4 zonas independientes',
    ],
  },
  Karaya: {
    casco: 'Plataforma catamarán de dos niveles en acero y aluminio, pensada para evento estático y navegación de bahía',
    astillero: 'Construcción a medida — la mayor embarcación de eventos del Caribe',
    refit: '2024 — cocina de servicio, iluminación escénica y barandillas',
    cubiertaUtil: '938 m² de superficie total en dos niveles',
    manga: '18 m (59 pies)',
    calado: '1,40 m',
    desplazamiento: '120 t en rosca · 165 t a plena carga',
    pasajerosCertificados: '400 pasajeros',
    tripulacion: '14 (patrón, 3 marineros, 6 de cocina y sala, 2 técnicos y 2 de seguridad)',
    aseos: '6 aseos, dos de ellos adaptados',
    motores: '2 × Caterpillar C7.1, diésel intraborda',
    potencia: '2 × 300 hp (600 hp totales)',
    potenciaHp: 600,
    transmision: 'Línea de ejes con hélices en tobera y propulsor de proa',
    crucero: '7 nudos',
    maxima: '10 nudos',
    combustible: '2 × 1.500 L',
    autonomia: '200 millas náuticas a velocidad de crucero',
    generador: '2 × 40 kW insonorizados, con conmutación automática',
    aguaDulce: '4.000 L + potabilizadora de 150 L/h',
    sombra: '320 m² cubiertos entre los dos niveles',
    extras: [
      'Cocina de servicio con cámara fría y abatidor',
      'Escenario de 40 m² con iluminación DMX',
      'Pasarela de embarque de 1,20 m de ancho, apta para silla de ruedas',
      'Grupo electrógeno redundante para el servicio del evento',
    ],
  },
}

// Lo que es IGUAL en toda la flota — política de empresa, no spec de barco.
// Vive una sola vez para que corregirlo sea corregirlo en los 6 (y luego 12).
const REGISTRO_COMUN: FilaSpec[] = [
  {
    label: 'Bandera y puerto base',
    valor: 'República Dominicana · Cabeza de Toro, Punta Cana',
    nota: 'Salidas desde nuestro propio muelle, no desde una marina alquilada.',
  },
  {
    label: 'Registro',
    valor: 'Matriculada en la Autoridad Portuaria Dominicana',
    nota: 'Inscripción en el registro nacional de embarcaciones comerciales de pasaje.',
  },
  {
    label: 'Certificado de navegabilidad',
    valor: 'Vigente — inspección anual de la Armada de República Dominicana',
    nota: 'Sin certificado en vigor la embarcación no puede embarcar pasaje. Se renueva cada año.',
  },
  {
    label: 'Licencia de transporte de pasajeros',
    valor: 'Vigente para excursión marítima comercial',
  },
  {
    label: 'Distintivo de llamada / MMSI',
    valor: 'Asignado — se facilita en la documentación del charter',
    nota: 'Identificador de radio del barco: es lo que se transmite al pedir asistencia por VHF.',
  },
]

const NAVEGACION_COMUN: FilaSpec[] = [
  {
    label: 'Cartografía y plotter',
    valor: 'Plotter multifunción con cartografía Navionics del Caribe',
    nota: 'La ruta del tour está grabada como derrota fija: se navega siempre por el mismo canal balizado.',
  },
  {
    label: 'Sonda',
    valor: 'Ecosonda con alarma de profundidad mínima',
    nota: 'Avisa antes de entrar en sonda corta — es lo que protege al arrecife tanto como al casco.',
  },
  { label: 'Radio', valor: 'VHF fijo con DSC + 2 portátiles, escucha permanente en canal 16' },
  { label: 'AIS', valor: 'Transpondedor clase B — el barco se ve y ve al tráfico de la zona' },
  { label: 'Compás', valor: 'Compás magnético de bitácora con iluminación' },
  { label: 'Luces de navegación', valor: 'LED conformes al reglamento internacional de abordajes (COLREG)' },
  { label: 'Ancla y fondeo', valor: 'Molinete eléctrico con 50 m de cadena calibrada' },
]

const SEGURIDAD_COMUN = (capacidad: string | null): FilaSpec[] => [
  {
    label: 'Chalecos salvavidas',
    valor: capacidad
      ? `Homologados para el 100% del pasaje (${capacidad.toLowerCase()}), con tallas infantiles aparte`
      : 'Homologados para el 100% del pasaje, con tallas infantiles aparte',
    nota: 'Las tallas infantiles no se cuentan dentro del total de adultos: van además, no en lugar de.',
  },
  { label: 'Aros salvavidas', valor: '2 aros con rabiza flotante y luz de encendido automático' },
  {
    label: 'Balsa salvavidas',
    valor: 'Balsa autoinflable con capacidad para todo el pasaje, revisión anual en taller homologado',
  },
  { label: 'Extintores', valor: 'Extintores portátiles por zona + sistema fijo en sala de máquinas' },
  {
    label: 'Botiquín y oxígeno',
    valor: 'Botiquín de a bordo + equipo de oxígeno de emergencia',
    nota: 'El oxígeno es el estándar de los operadores de buceo (DAN) y no es obligatorio en excursión: lo llevamos igual.',
  },
  { label: 'Señales de socorro', valor: 'Bengalas y señales fumígenas en vigor' },
  { label: 'Achique', valor: 'Bombas automáticas por compartimento con alarma de sentina en el puente' },
  {
    label: 'Titulación de la tripulación',
    valor: 'Patrón titulado, marinería con formación en primeros auxilios y RCP',
    nota: 'Se hace simulacro de hombre al agua y de abandono con la tripulación cada temporada.',
  },
  {
    label: 'Seguro',
    valor: 'Póliza de responsabilidad civil de pasaje en vigor',
    nota: 'Cubre a cada persona a bordo durante toda la excursión, no solo la navegación.',
  },
]

const SOSTENIBILIDAD_COMUN: FilaSpec[] = [
  {
    label: 'Plástico de un solo uso',
    valor: 'Cero a bordo',
    origen: 'verificado',
    nota: 'Vajilla y vasos reutilizables, botellas de cristal y pajitas de material vegetal. Es la política de la casa desde el primer barco.',
  },
  {
    label: 'Residuos',
    valor: 'Separación a bordo; todo baja a tierra al final del día',
    nota: 'Nada se tira por la borda, tampoco restos de comida: alteran la fauna del arrecife.',
  },
  {
    label: 'Aguas negras y grises',
    valor: 'Tanque de retención con descarga en puerto',
    nota: 'Nunca se vacía en la zona de fondeo ni sobre el vivero de coral.',
  },
  {
    label: 'Fondeo',
    valor: 'Muerto fijo en las paradas del tour — el ancla no toca el coral',
    nota: 'Un ancla arrastrando es el daño más rápido que puede hacer un barco de excursión.',
  },
  {
    label: 'Pintura de fondos',
    valor: 'Patente de baja lixiviación, libre de compuestos organoestánnicos',
  },
  {
    label: 'Aportación por huésped',
    valor: 'US$ 3,50 + US$ 2,00 por persona a la Bávaro Reefs Foundation',
    origen: 'verificado',
    nota: 'Va del precio del tour al vivero de coral y a los proyectos con la comunidad. Detalle en Sostenibilidad.',
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
      titulo: 'Identificación y registro',
      tituloCorto: 'Identificación',
      icono: Ship,
      intro: 'Qué embarcación es exactamente y con qué papeles navega. Es lo primero que mira cualquiera que sepa de barcos.',
      filas: [
        { label: 'Nombre', valor: barco.nombre, origen: 'verificado' },
        { label: 'Tipo', valor: barco.tipo, origen: 'verificado' },
        {
          label: 'Año de construcción',
          valor: barco.anio,
          origen: barco.anio ? 'verificado' : undefined,
          nota: barco.anio ? undefined : 'La ficha del armador no fecha esta embarcación. Pendiente de confirmar.',
        },
        { label: 'Astillero', valor: p.astillero },
        { label: 'Última gran revisión', valor: p.refit, nota: 'Refit: la revisión profunda que renueva sistemas, no el mantenimiento de rutina.' },
        ...REGISTRO_COMUN,
      ],
    },
    {
      id: 'dimensiones',
      titulo: 'Dimensiones y arquitectura',
      tituloCorto: 'Dimensiones',
      icono: Ruler,
      intro: 'Cuánto mide y de qué está hecha. La manga (el ancho) es lo que de verdad decide cuánta cubierta pisas, más que la eslora.',
      filas: [
        {
          label: 'Eslora total',
          valor: barco.eslora,
          origen: barco.eslora ? 'verificado' : undefined,
          nota: barco.eslora
            ? 'Medida de proa a popa, incluido el espejo.'
            : 'La ficha del armador no publica eslora para esta embarcación. Pendiente de confirmar.',
        },
        { label: 'Manga máxima', valor: p.manga, nota: 'El ancho en su punto mayor: en un catamarán es lo que da la estabilidad y el espacio.' },
        { label: 'Calado', valor: p.calado, nota: 'Lo que hunde bajo el agua. Poco calado = puede acercarse a la playa y a la piscina natural.' },
        { label: 'Desplazamiento', valor: p.desplazamiento, nota: 'Peso en vacío y con pasaje, equipaje, agua y combustible.' },
        { label: 'Material del casco', valor: p.casco },
        { label: 'Cubierta útil', valor: p.cubiertaUtil, nota: 'La superficie que puedes pisar, sin contar la zona de maniobra de la tripulación.' },
        { label: 'Superficie de sombra', valor: p.sombra, nota: 'En el Caribe esto no es un lujo: es lo que hace llevaderas las horas centrales.' },
      ],
    },
    {
      id: 'capacidad',
      titulo: 'Capacidad y distribución',
      tituloCorto: 'Capacidad',
      icono: Users,
      intro: 'Cuánta gente cabe, cuánta embarcamos de verdad y cómo se reparte a bordo. Las dos cifras no coinciden y es a propósito.',
      filas: [
        {
          label: 'Pasajeros certificados',
          valor: p.pasajerosCertificados,
          nota: p.pasajerosCertificados
            ? 'El máximo legal que autoriza el certificado de navegabilidad.'
            : 'Esta embarcación se cotiza como evento y no tiene un máximo publicado. Pendiente de confirmar.',
        },
        {
          label: 'Pasajeros que embarcamos',
          valor: barco.capacidad,
          origen: barco.capacidad ? 'verificado' : undefined,
          nota: barco.capacidad
            ? 'Nuestro tope real, por debajo del certificado: preferimos vender menos plazas y que sobre sitio.'
            : 'Se cotiza por grupo. Escríbenos con el número de personas.',
        },
        { label: 'Tripulación', valor: p.tripulacion },
        { label: 'Aseos', valor: p.aseos },
        { label: 'Ideal para', valor: barco.idealPara, origen: 'verificado' },
      ],
    },
    {
      id: 'propulsion',
      titulo: 'Propulsión y rendimiento',
      tituloCorto: 'Propulsión',
      icono: Gauge,
      intro: 'Qué la mueve y a qué ritmo. En una excursión de día la velocidad importa menos que la autonomía y el consumo.',
      filas: [
        { label: 'Motores', valor: p.motores },
        { label: 'Potencia', valor: p.potencia },
        { label: 'Transmisión', valor: p.transmision },
        { label: 'Velocidad de crucero', valor: p.crucero, nota: 'La que se navega de verdad en el trayecto del tour.' },
        { label: 'Velocidad máxima', valor: p.maxima },
        { label: 'Combustible', valor: p.combustible },
        { label: 'Autonomía', valor: p.autonomia, nota: 'La salida del día usa una fracción mínima de este margen.' },
      ],
    },
  ]

  if (p.vela) {
    grupos.push({
      id: 'vela',
      titulo: 'Aparejo y vela',
      tituloCorto: 'Vela',
      icono: Wind,
      intro: 'El único de la flota que navega de verdad a vela: con viento estable se apagan los motores y el trayecto se hace en silencio.',
      filas: [
        { label: 'Aparejo', valor: p.vela.aparejo },
        { label: 'Superficie vélica', valor: p.vela.superficie },
        { label: 'Mayor', valor: p.vela.mayor },
        { label: 'Foque / génova', valor: p.vela.foque },
        { label: 'Mástil', valor: p.vela.mastil },
      ],
    })
  }

  grupos.push(
    {
      id: 'sistemas',
      titulo: 'Sistemas de a bordo',
      tituloCorto: 'Sistemas',
      icono: Zap,
      intro: 'Agua, corriente y residuos. Es lo que decide si a las tres horas de salida sigue habiendo agua fría, hielo y un baño que funcione.',
      filas: [
        { label: 'Generador', valor: p.generador },
        { label: 'Instalación eléctrica', valor: '12 V para servicios de navegación + 110 V con inversor para el servicio a bordo' },
        { label: 'Agua dulce', valor: p.aguaDulce },
        { label: 'Aguas negras', valor: 'Tanque de retención con descarga en puerto', nota: 'Ver el bloque de sostenibilidad: nunca se descarga en la zona de baño.' },
        { label: 'Iluminación', valor: 'LED de bajo consumo en cubierta, cortesía y balizamiento de accesos' },
        { label: 'Equipamiento propio', valor: p.extras.join(' · ') },
      ],
    },
    {
      id: 'navegacion',
      titulo: 'Navegación y comunicaciones',
      tituloCorto: 'Navegación',
      icono: Compass,
      intro: 'Con qué se gobierna y cómo se pide ayuda. Todo redundante: si falla un equipo, hay otro que hace su trabajo.',
      filas: NAVEGACION_COMUN,
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad',
      tituloCorto: 'Seguridad',
      icono: ShieldCheck,
      intro: 'El bloque que casi nadie enseña y el que de verdad separa a un operador propio de un intermediario. Todo se revisa antes de cada temporada.',
      filas: SEGURIDAD_COMUN(barco.capacidad),
    },
    {
      id: 'cocina',
      titulo: 'Cocina, barra y confort',
      tituloCorto: 'Cocina y confort',
      icono: UtensilsCrossed,
      intro: 'Somos la única empresa de excursiones del país con cocina flotante. En términos técnicos, esto es lo que eso significa.',
      filas: [
        {
          label: 'Cocina flotante',
          valor: 'Parrilla de gas con extracción y encimera de acero inoxidable',
          origen: 'verificado',
          nota: 'Se cocina durante la navegación, frente al pasaje. No hay comida recalentada a bordo.',
        },
        { label: 'Frío', valor: 'Neveras de compresor + arcón de hielo independiente para bebidas' },
        { label: 'Barra', valor: 'Barra de servicio con fregadero y agua a presión' },
        { label: 'Sonido', valor: 'Equipo marino con Bluetooth y altavoces estancos por zona' },
        { label: 'Baño', valor: 'Ducha de agua dulce en popa al salir del agua' },
        {
          label: 'Equipo de snorkel',
          valor: 'Máscaras y tubos por talla, aletas y chalecos de flotación',
          nota: 'Se desinfecta entre salidas. Puedes traer el tuyo si lo prefieres.',
        },
        { label: 'Acceso a bordo', valor: 'Embarque desde muelle propio con pasarela y tripulación de apoyo' },
      ],
    },
    {
      id: 'sostenibilidad',
      titulo: 'Sostenibilidad a bordo',
      tituloCorto: 'Sostenibilidad',
      icono: Leaf,
      intro: 'No es una declaración de intenciones: son decisiones de equipamiento y de operación que se pueden comprobar en el barco.',
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
  eyebrow: 'Cero plástico a bordo',
  titulo: 'Ni una botella de plástico sube a nuestros barcos',
  texto:
    'No es una campaña: es cómo están equipados. Cada embarcación de la flota sale del muelle sin plástico de un solo uso, y todo lo que se genera a bordo vuelve a tierra con nosotros.',
  puntos: [
    { titulo: 'Cristal y acero', texto: 'Botellas de cristal y jarras de acero en la barra, en lugar de botellines.' },
    { titulo: 'Vajilla reutilizable', texto: 'Platos, vasos y cubiertos que se lavan y vuelven, servicio tras servicio.' },
    { titulo: 'Pajitas vegetales', texto: 'Y ninguna bolsa de plástico en la cocina flotante.' },
  ],
  cta: 'Ver el resto de nuestro compromiso',
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
//     dos (0% recalentado, 7 platos) se absorbe en el párrafo.
// Se retira también la tira «Míralo por dentro»: con las 3 fotos-prueba y las
// 3 paradas, era una cuarta fila de fotos en la misma sección.
//
// El COPY no se inventa: `COCINA_FLOTANTE` y `EXPERIENCIA_ABORDO` se importan
// de data/nosotros.ts en el componente. Aquí solo vive lo que este formato
// añade — y `momentos`, que sale de la propia maqueta del cliente (slide 34:
// «PRIMERA PARADA · AL MEDIODÍA · PARA CERRAR»).
export const COCINA_Y_PARADAS = {
  // El párrafo que absorbe las dos cifras útiles del slide 33 (0% recalentado
  // y 7 platos). Va como prosa y no como fila de stats: son dos datos, y dos
  // datos no necesitan una banda propia con separadores.
  detalle:
    'Siete platos a elegir, cocinados a la parrilla mientras navegas. Cero comida recalentada: lo que llega a tu plato se ha hecho a bordo, a unos metros de donde estás sentado.',

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
      alt: 'La plataforma de la cocina flotante, con las parrillas montadas, vista desde el agua',
    },
    // «Chef cocinando a bordo» → el chef, en su encimera.
    {
      foto: 'cocina-flotante',
      alt: 'El chef y dos huéspedes tras la encimera, con las bandejas de mariscos y carnes recién hechos',
    },
    // «Mariscos y carnes frescos» → el bufé servido.
    {
      foto: 'events-8',
      alt: 'Bufé de mariscos y carnes servido en la cubierta durante una salida',
    },
  ],

  // La foto que acompaña al bloque de texto: huéspedes comiendo a bordo. No es
  // de la cocina —esa va abajo, en las pruebas— sino del RESULTADO, que es lo
  // que el visitante se está imaginando mientras lee el párrafo.
  foto: 'galeria-charter-privado-3',
  fotoAlt: 'Huéspedes comiendo en mesas sobre la cubierta superior, bajo el toldo',

  cta: { label: 'Vive la cocina flotante', to: '/#tours' },

  paradasEyebrow: 'El recorrido del día',
  paradasTitulo: 'Un día de mar en 3 paradas',
  paradasSub:
    'No es un tour de un solo sitio: es un recorrido pensado para que cada parada sume — naturaleza, playa y descanso, en ese orden.',
  // Copy del cliente (slide 34). Sustituye al numeral en círculo sobre la foto
  // que llevaba la versión anterior: «Primera parada» dice lo mismo que un
  // «01» y además dice CUÁNDO, que es la información que se estaba perdiendo.
  momentos: ['Primera parada', 'Al mediodía', 'Para cerrar'],
}
