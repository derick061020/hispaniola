// Contenido de la FICHA de tour — portado de prototipo/datos.js (fuente
// canónica) y de prototipo/app.js (renderFicha, la implementación canónica:
// donde el wireframe y el prototipo difieren, manda el prototipo — ver
// app/PLAN-TOURS.md §0).
//
// Este archivo contiene SOLO lo que `data/home.ts` no tiene ya. Nada se
// duplica: la página une `TOURS` (nombre, precio, rating, chip, foto de
// portada) con `FICHAS` por slug. Si un campo vive en home.ts, se lee de allí.

import type { AddOn } from '@/lib/tarifas'
import { traducible } from '@/lib/i18n'

export type PasoItinerario = {
  hora: string
  titulo: string
  texto: string
  /** [v3 2026-08-06, WEBSITE-TOURS pág. 20] Condición de la parada, cuando no
   *  la hacen todas las variantes del tour: «Only on 4-hour charters». Va
   *  como chip, no dentro del texto, porque es una EXCEPCIÓN y tiene que
   *  leerse antes que la descripción, no al final de ella. */
  nota?: string
}

/** Horario publicado del tour. SIN `quedan N` a propósito: el aforo restante
 *  depende de que el motor (xpotours) lo exponga por API — decisión pendiente
 *  del cliente. Prometer "quedan 9" sin dato real es urgencia inventada
 *  (docs/proceso/analisis/revision-wireframes.md §2.7). El dato vive en el paso 1 del
 *  funnel, que no es parte de este build. */
export type Horario = { hora: string; regreso: string }

export type BeneficioIncluido = { titulo: string; texto: string }
export type PreguntaTour = { p: string; r: string }

/** Un plato del menú de un paquete. `foto` solo la tienen los 4 platos
 *  fotografiados en /fotos (plato-*); el resto son de texto (no hay asset). */
export type PlatoMenu = {
  nombre: string
  desc?: string
  foto?: string
  /** [v2] Plato del menú infantil. Se pinta con chip «Niños» para que se
   *  distinga sin sacarlo del menú — en la web original es una opción más
   *  dentro del mismo menú, no una carta aparte. */
  soloNinos?: boolean
}

/** Un tramo de la tabla de precios de una sub-variante (Saona). Coincide 1:1
 *  con las filas del esquema viejo (Saona web: «6 pax — US$ 1.100 /grupo»,
 *  «7 pax — US$ 1.160 /grupo», «10+ pax — US$ 130 /persona»).
 *  - `desde` y `hasta` son inclusivos. `hasta: null` = sin tope superior.
 *  - `tipo: 'grupo'` → `precio` es el TOTAL del grupo (sin multiplicar).
 *  - `tipo: 'persona'` → `precio` es por persona; se multiplica por `personas`.
 *  - `extra` es texto complementario (ej: «+ 45 US$ por persona para comida»). */
export type TramoPrecio = {
  desde: number
  hasta: number | null
  precio: number
  tipo: 'grupo' | 'persona'
  extra?: string
}

/** Una sub-variante seleccionable en el widget (Saona: Speedboat/Fishing/
 *  Catamarán; Charter: Maite/GrandMa/Santa Maria/Forever Teresa). El
 *  widget pinta un segmented control con estas y recalcula el total al
 *  cambiar — un Light/Premium pero a nivel de BOTE/MODALIDAD en vez de a
 *  nivel de menú. `capacidad` es la línea de meta del toggle (ej: «6-9
 *  personas»). `foto` (en /fotos) y `horarios` se muestran cuando la
 *  sub-variante los tiene (Saona no usa ninguno; Charter usa ambos). */
export type SubVarianteTour = {
  id: string
  nombre: string
  descripcion: string
  capacidad: string
  tabla: TramoPrecio[]
  /** Foto del bote/modalidad, en /fotos (sin extensión). Opcional —
   *    sin foto, el widget pinta solo el nombre. */
  foto?: string
  /** Horarios publicados de esta sub-variante. Si está vacío, se usan los
   *    horarios globales de la ficha (`ficha.horarios`). */
  horarios?: Horario[]
  /** Duración info de la sub-variante (ej: «3-4 horas»). NO se elige
   *    — es solo info, según pedido de Samuel el 2026-07-17 (charter).
   *    El cálculo del precio usa solo la tabla de tramos. */
  duracion?: string
  /** [2026-08-18] Las horas, como NÚMERO. Existe porque qué carta del charter
   *  se come lo decidía `duracion.startsWith('3')`, o sea leyendo el texto que
   *  se pinta en pantalla: se rompía con «3.5 hours» y, sobre todo, con el
   *  multi-idioma —el día que esa etiqueta se traduzca («3 horas» sigue
   *  funcionando por casualidad, «drei Stunden» no) todos los grupos caerían
   *  en la carta de 4 h—. La lógica de producto no puede colgar de un rótulo.
   *  Si falta, `cartaCharterDe` vuelve a leer `duracion` como antes. */
  duracionHoras?: number
}

/** Plato del menú BUFFET (Saona) — distinto del PlatoMenu de los paquetes
 *  Light/Premium: no tiene `foto` (la comida del buffet no se ha fotografiado
 *  todavía — se documenta por escrito) y se pinta como lista, no como card. */
export type PlatoBuffet = { nombre: string; desc?: string }

/** Menú de un día completo con buffet + add-on opcional. Cuando `ficha`
 *  tiene `menuBuffet`, el componente MenuTour pinta este formato en vez del
 *  comparador Light/Premium (Saona es el único caso actual). */
export type MenuBuffetTour = {
  platos: PlatoBuffet[]
  /** Add-on al hacer check-out (ej: langosta premium). */
  addOn?: AddOnDeMenu
}

/** El extra de pago que anuncia un bloque de menú (la franja dorada de la
 *  langosta). Es la CARA de un `AddOn` del widget, no otro producto.
 *
 *  [2026-08-07, pedido de Samuel: «que el banner de add premium lobster sirva
 *  para seleccionarlo en el widget»] `addOnId` es lo que ata las dos piezas: la
 *  franja marca ESE add-on de `ficha.addOns` y refleja si está puesto. Sin el
 *  campo la franja es solo informativa —el estado anterior— y el componente lo
 *  pinta sin botón. Se declara aquí, en los datos, y no adivinando por nombre o
 *  por precio desde el componente: si mañana hay un segundo extra de menú, el
 *  vínculo sigue siendo explícito. */
export type AddOnDeMenu = {
  nombre: string
  precio: number
  descripcion?: string
  /** id del add-on de `ficha.addOns` que marca esta franja. */
  addOnId?: string
}

/** Menú transversal del charter (los 7 platos + 1 add-on de langosta).
 *  Cuando `ficha` tiene `menuCharter`, MenuTour pinta una lista con los
 *  7 platos + un card de add-on. El menú NO cambia al cambiar de bote
 *  — es transversal a los 4 botes (Maite, GrandMa, Santa Maria, Forever
 *  Teresa). Charter es el único caso actual. */
/** [v3 2026-08-06, PowerPoint slides 73-74 + reunion 07-31 19:21-22:15] Una
 *  de las dos cartas del charter. Hasta la v3 habia UNA sola con los 7 platos
 *  mezclados; el cliente las separa por DURACION del barco, que es lo que de
 *  verdad decide que se puede cocinar a bordo. */
export type CartaCharter = {
  /** A que caso pertenece esta carta. '4h' y '3h' son duraciones de barco y
   *  la pestana activa se elige con el barco del widget; '21+' es una regla de
   *  AFORO que se cruza con las dos (de 21 personas en adelante el menu pasa a
   *  buffet de pinchos, navegues 3 o 4 horas), asi que esa se elige con el
   *  contador de personas. */
  id: '4h' | '3h' | '21+'
  pestana: string
  titulo: string
  texto?: string
  /** Regla de aforo que cambia el SERVICIO sin cambiar de carta (el «de 21
   *  personas en adelante, buffet de pinchos» del menu de 4 h). Va como aviso,
   *  no como segunda carta: la del buffet no existe todavia por escrito y no
   *  se inventan platos. */
  nota?: string
  /** A cuantas personas aplica esta carta. Nace con la regla del tarifario que
   *  el cliente confirma en la slide 73: emplatado hasta 20, buffet de pinchos
   *  de 21 en adelante. */
  aforo?: string
  platos: { nombre: string; desc?: string; foto?: string; brocheta?: boolean }[]
  addOn?: AddOnDeMenu
  /** [v3 2026-08-06, maqueta de la slide 74] Carta que NO se presenta como
   *  rejilla de platos sino como BENTO de fotos: una grande del menu completo
   *  y, al lado, la porcion por persona y dos de como se sirve. Es el formato
   *  que dibujo el cliente para el buffet de pinchos, y tiene sentido: en un
   *  buffet no eliges plato, asi que lo que hay que enseñar es la mesa, la
   *  racion y el servicio — no siete cards iguales.
   *  ⚠️ `foto` ausente = hueco marcado [placeholder-v3]: Miguel se comprometio
   *  a pasarlas (indice de planes, peticion 1) y hasta entonces la celda se
   *  pinta como tal, no se rellena con una foto de otro plato. */
  bento?: { id: string; titulo: string; texto?: string; foto?: string; tamano?: 'grande' | 'ancho' }[]
}

export type MenuCharterTour = {
  /** [v3] Las dos cartas (4 h y 3 h). `foto` y `brocheta` en los platos son de
   *  la v2: la carta del charter dejo de ser una lista con checks y paso a ser
   *  una rejilla de fotos reales (tour/carta-charter.tsx). Las fotos son las
   *  MISMAS que ya usa el menu Premium del semi-privado —mismo operador, misma
   *  cocina flotante, mismos platos con la misma descripcion—, asi que no se
   *  esta ilustrando un plato con la foto de otro. */
  cartas: CartaCharter[]
  /** [v2 2026-07-28, plan 01 §7 — slide 2] Como se cocina a bordo, portado de
   *  la ficha real del charter. [v3 2026-08-06] Son los 5 claims APROBADOS
   *  (WEBSITE-TOURS pags. 18-19).
   *  `id` en vez de icono: este archivo no importa React ni lucide — el icono
   *  se mapea en antes-de-reservar.tsx (presentacion, no contenido). */
  cocina?: { id: string; titulo: string; texto: string }[]
}

export type FichaTour = {
  tituloLargo: string
  /** [v3 2026-08-06] Título del bloque de descripción, con el copy APROBADO
   *  por el cliente (WEBSITE-TOURS: «The Ultimate Adults-Only Catamaran Tour
   *  in Punta Cana», «Discover the Caribbean Beneath the Surface»…). Hasta la
   *  v3 este H2 se DERIVABA de `audiencia` en pages/tour.tsx («Un día de mar
   *  en grupo pequeño»); ahora que el cliente lo escribe por ficha, la
   *  derivación se queda solo como fallback de las que aún no lo traen. */
  promesa?: string
  /** [v3 2026-08-06, WEBSITE-TOURS pág. 1 + slide 71] Los chips del hero de
   *  ESTA ficha, con el copy aprobado. Cuando está, sustituye a la fila
   *  genérica (cancelación · audiencia · distintivo · garantía) de
   *  cabecera-ficha.tsx. El cliente solo los dio para el semi-privado y su
   *  lista es CERRADA: tachó «Cancelación gratis» y no menciona el distintivo
   *  ni la garantía del mejor precio, así que en esa ficha desaparecen.
   *  ⚠️ Pendiente de Samuel: ¿los mismos 4 chips valen para las otras 3
   *  fichas? (plan 04 §1). Mientras tanto, las que no lo traen conservan la
   *  fila de siempre. */
  chipsHero?: string[]
  audiencia: string
  /** La duración larga ('4 horas'); la corta ('4 h') vive en home.ts. */
  duracion: string
  /** Descripción larga en párrafos, para el bloque de intro con «leer más»
   *  (2026-07-17: portada de la web aprobada, que es más rica que la frase
   *  corta de home.ts). Opcional: si falta, la intro usa solo descripcionCorta. */
  descripcionLarga?: string[]
  horarios: Horario[]
  /** null = este tour no tiene upgrade de menú (no se vende por paquetes). */
  upgradePremium: number | null
  /** Menú POR PAQUETE (2026-07-17, portado de la web aprobada — antes el build
   *  usaba 4 platos compartidos). Light = 2 platos a la parrilla; Premium = 7
   *  platos (los 4 con foto real + 3 de solo texto). [] en los tours que no
   *  venden menú por paquete (charter cotiza a medida, Saona sin definir);
   *  MenuTour solo se pinta en booking 'completo', así que esos [] no se ven. */
  menuLight: PlatoMenu[]
  menuPremium: PlatoMenu[]
  /** TODAS las fotos reales del tour, en /fotos (sin extensión). La `galeria`
   *  de home.ts son solo las 5 portadas del carrusel del grid; ésta es el
   *  material completo para el mosaico y el lightbox.
   *  ⚠️ Isla Saona: [] — no existe galería suya y no se rellena con fotos de
   *  otros tours (mentiría sobre el producto). Su ficha muestra foto única. */
  galeriaCompleta: string[]
  /** Video del tour para el mosaico de galería (correcciones v1 del cliente,
   *  2026-07-20 — planes/02-producto.md slide 3: «agregar un video»). Ruta en
   *  /video. `null` = este tour no tiene video propio todavía y la galería se
   *  queda solo con fotos. Hoy los 4 apuntan al promocional de marca
   *  (hero.mp4), que es el único video real que hay; cuando el cliente mande
   *  clips POR TOUR se cambia aquí y la ficha no se toca. */
  videoGaleria: string | null
  /** Quote sobre la foto principal del mosaico — portada de primeraResenaTour()
   *  de prototipo/app.js. Prueba social ANTES de scrollear (wireframe A1). */
  quoteDestacada: string
  itinerario: PasoItinerario[]
  /** [v3 2026-08-06, WEBSITE-TOURS pág. 14] El itinerario deja de llamarse
   *  igual en todas las fichas: el cliente titula el de Snorkel Lovers
   *  «Marine Park Journey — 4 Hours». Sin este campo se usa «Itinerary», que
   *  es como titula los demás. La duración se le añade siempre detrás. */
  itinerarioTitulo?: string
  /** [v3 2026-08-06, WEBSITE-TOURS pág. 8] Línea bajo el título del
   *  itinerario («Pickup time depends on your hotel location…»). Nace con el
   *  itinerario de DOBLE SALIDA: en cuanto una parada muestra dos horas hay
   *  que explicar de qué son, y la hora de recogida deja de ser un dato fijo. */
  itinerarioNota?: string
  incluye: BeneficioIncluido[]
  /** «También incluye»: el resto de lo que trae el tour más allá de los 4
   *  titulares (WiFi, aperitivos, barra flotante…). Portado de la web. */
  incluyeExtra?: string[]
  noIncluido: string
  /** Qué llevar (traje de baño, cámara, toalla, protector, efectivo). Portado
   *  de la web. [] si no aplica (Saona, sin datos). */
  queLlevar: string[]
  /** [v3 2026-08-06, PowerPoint slide 72 + reunión 07-31 18:47] Lo que el
   *  cliente llama «Recomendaciones adicionales»: consejos que NO son objetos
   *  que meter en la mochila, así que no caben en `queLlevar` — van detrás de
   *  un botón discreto en esa misma card.
   *  ⚠️ [placeholder-v3] El texto real NO existe todavía: la reunión solo dio
   *  dos ejemplos sueltos (crema para la piel, mejor llevar dólares). Lo de
   *  aquí es esa transcripción, no una lista redactada por nosotros — y NO se
   *  añaden recomendaciones médicas ni de seguridad inventadas. Pedida al
   *  cliente (índice de planes, petición 2). */
  recomendaciones?: string[]
  faqTour: PreguntaTour[]
  /** slugs de TOURS (data/home.ts) */
  tambienTeGusta: string[]
  /** Tours con sub-variantes seleccionables en el widget (Saona: Speedboat /
   *  Fishing Town / Catamarán). Cuando está presente, el widget pinta un
   *  segmented control de sub-variantes EN VEZ del toggle Light/Premium y
   *  calcula el total con `calcularTotalTour()`. Ausente en los tours que
   *  usan el toggle clásico (semi-privado, snorkel-lovers) o que no tienen
   *  paquetes (charter, consulta). */
  subVariantes?: SubVarianteTour[]
  /** Cuando está presente, el bloque de menú pinta formato BUFFET + ADD-ON
   *  (Saona) en vez del comparador Light/Premium clásico. Saona es el único
   *  caso actual. */
  menuBuffet?: MenuBuffetTour
  /** Cuando está presente, el bloque de menú pinta los 7 platos + 1 add-on
   *  transversales del charter (lista simple, no buffet ni Light/Premium).
   *  Charter es el único caso actual. */
  menuCharter?: MenuCharterTour
  /** [v2 2026-07-27] Las 4 cosas concretas que se ganan al pasar a Premium.
   *  Un solo array consumido por el COMPARADOR (comparador-premium.tsx) y por
   *  la caja de upsell del widget, a propósito: si hubiera dos listas
   *  acabarían diciendo cosas distintas.
   *  Son ventajas REALES sacadas de `incluye`/`menuPremium` de esta misma
   *  ficha — no se inventa ninguna. */
  ventajasPremium?: string[]
  /** [v2 2026-07-28] El widget de esta ficha abre SIEMPRE en piel premium
   *  (oscura con terminaciones doradas), haya o no toggle Light/Premium.
   *
   *  Pedido de Samuel: «Isla Saona y Charter Privado, que el widget sea tema
   *  oscuro, porque esos 2 servicios son premium de base». Y encaja con cómo
   *  están construidos: los dos se venden por sub-variantes (barco/tarifario),
   *  o sea que NO tienen toggle Light/Premium — no hay un Light contra el que
   *  contrastar porque no existe versión Light del producto. La piel oscura
   *  deja de ser el estado «has subido a Premium» y pasa a ser lo que ES el
   *  servicio.
   *
   *  ⚠️ Es SOLO la piel del widget. No toca precios, ni `upgradePremium`, ni
   *  el comparador, ni la banda «estás en Premium» de la página (esos siguen
   *  colgando de `menuLight`/`upgradePremium`, que en estos dos no existen). */
  widgetPremiumDeBase?: true
  /** [v3 2026-08-06, PowerPoint slide 77 + reunion 07-31 23:12-26:41] Banda
   *  que avisa de que lo que se esta viendo es la MODALIDAD premium del
   *  producto, con puente a donde viven las opciones de entrada.
   *
   *  El cliente: «en esta seccion ofrecemos nuestros Charter privado en
   *  modalidad Premium que es el mas vendido» + un boton a eventos/party boat.
   *
   *  ⚠️ El CTA promete precio («more affordable options») y HOY ESO NO CUADRA:
   *  el charter mas barato (Maite, US$ 625) sale por debajo del party boat mas
   *  barato (US$ 660). Lo detecto Samuel en la misma reunion («me parece mas
   *  caro incluso») y Miguel respondio que van a reestructurar precios y sumar
   *  barcos. Se porta el texto del slide por decision de Samuel (2026-08-06);
   *  la promesa se vuelve verdad en cuanto reestructuren, y si no, cambiarla
   *  es esta linea. */
  bandaModalidad?: { eyebrow: string; texto: string; cta: { texto: string; a: string } }
  /** [v2 2026-07-27] Extras opcionales que el widget vende como UPSELL.
   *  Portados del tarifario real (TARIFARIO-WEB-ORIGINAL.md §4-C). El texto
   *  del álbum de fotos cambia por producto a propósito: en charter ya
   *  regalan «todas» las fotos, así que ahí solo se vende la máxima calidad
   *  — prometer «el álbum completo» sería falso. */
  addOns?: AddOn[]
}

// [v3 2026-08-06, WEBSITE-TOURS págs. 9–10 y 16–17] Los 8 ítems APROBADOS de
// «What´s Included». El cliente los repite IDÉNTICOS en el semi-privado y en
// Snorkel Lovers —los dos hacen el mismo recorrido con el mismo barco—, así
// que se escriben UNA vez. Si en el futuro divergen, se copia la constante en
// la ficha que cambie; duplicarlos ahora solo garantizaría que se separen
// solos en la próxima corrección.
const INCLUYE_MARINE_PARK: BeneficioIncluido[] = [
  {
    titulo: 'Exclusive Marine Park Access',
    texto:
      'Snorkel in our protected Marine Park featuring the Underwater Museum, coral restoration gardens and artificial reefs.',
  },
  {
    titulo: 'Foundation Conservation Team',
    texto:
      'Learn about our coral restoration project from the team of the Los Arrecifes de Bávaro Ecological Foundation.',
  },
  { titulo: 'Floating Kitchen & Gourmet Lunch', texto: 'Freshly prepared on board. Never a reheated buffet.' },
  {
    titulo: 'Premium Open Bar',
    texto: 'Beer, aged rum, vodka, tequila, juices, soft drinks and water throughout the tour.',
  },
  { titulo: 'Round-Trip Hotel Transportation', texto: 'Air-conditioned transportation from your hotel.' },
  { titulo: 'Wi-Fi On Board', texto: 'Stay connected throughout your experience.' },
  {
    titulo: 'Floating Bar at the Natural Pool',
    texto: "Enjoy drinks while relaxing in Punta Cana's crystal-clear natural pool.",
  },
  { titulo: 'Complimentary Tour Photos', texto: 'Go PRO photos uploaded after your tour to our Facebook page.' },
]

// Traducción NUESTRA (el cliente no da estos dos bloques): son datos reales
// portados del tarifario y de la web, solo cambian de idioma. Compartidos por
// las dos fichas del Marine Park por el mismo motivo que los 8 ítems.
const NO_INCLUIDO_MARINE_PARK =
  'Not included: transportation surcharge from Casa de Campo.'

const QUE_LLEVAR_MARINE_PARK = [
  'Swimsuit',
  'Towel',
  'Reef-safe sunscreen',
  'Camera',
  'Cash (if you pay the balance on board)',
]

// [v3 2026-08-06, PowerPoint slide 72] ⚠️ [placeholder-v3]: transcripción de
// los dos ejemplos que dio Miguel en la reunión del 07-31, no una lista
// redactada. La definitiva está pedida (índice de planes, petición 2).
const RECOMENDACIONES_V3 = [
  'Bring reef-safe sunscreen and skin cream. The sun on the water is stronger than it feels. [placeholder-v3]',
  'Cash in US dollars is the easiest way to pay for tips and any on-board add-on. [placeholder-v3]',
]

// [v3 2026-08-06] Los 7 platos del menu Premium de la casa. Estaban escritos
// dos veces (semi-privado y snorkel) y ahora los pide tambien la carta de 4 h
// del charter: es LA MISMA cocina flotante sirviendo lo mismo, asi que se
// escriben una vez. Snorkel le anade encima su Kid's Meal.
// [v3 2026-08-06] Nombres en ingles. No es una traduccion nueva: son los que
// usa el copy aprobado del charter para describir esta misma carta («seafood,
// certified Angus beef, Surf & Turf, vegetarian dishes»). Los 7 los sirven las
// tres fichas, asi que se traducen una vez.
const MENU_PREMIUM_CASA: PlatoMenu[] = [
  { nombre: 'Seafood', desc: 'Lobster, octopus, shrimp', foto: 'plato-mariscos' },
  { nombre: 'Meat', desc: 'Certified Angus beef', foto: 'plato-carne' },
  { nombre: 'Surf & Turf', desc: 'Lobster + Angus beef', foto: 'plato-surf-turf' },
  { nombre: 'Vegetarian', desc: 'Zucchini ceviche', foto: 'plato-vegetariano' },
  { nombre: 'Vegetarian lasagna', foto: 'plato-lasagna-vegetariana' },
  { nombre: 'Chicken lasagna', foto: 'plato-lasagna-pollo' },
  { nombre: 'Seafood cocktail', foto: 'plato-coctel-mariscos' },
]

export const FICHAS: Record<string, FichaTour> = traducible({
  'semi-private-premium': {
    // [2026-08-12, Samuel] EL NOMBRE NUEVO, LITERAL. Sustituye a
    // «Semi-Private Premium · adults-only catamaran», que era construcción
    // nuestra (nombre del producto + coletilla). Éste lo da el cliente entero
    // y por eso ocupa el H1 tal cual, con su «(15+)» incluido. El corto
    // —«Caribbean Escape»— vive en TOURS de data/home.ts; ahí está la tabla
    // que traduce los dos nombres viejos.
    tituloLargo: 'Caribbean Escape: An Adults-Only Ocean Experience (15+)',
    // [v3 2026-08-06, WEBSITE-TOURS pág. 2] Título APROBADO del bloque de
    // descripción, literal. Convive con el H1 del hero, que sigue siendo el
    // NOMBRE del producto (el que usan el ticker, el grid y el megamenú): uno
    // dice qué compras, el otro por qué.
    promesa: 'The Ultimate Adults-Only Catamaran Tour in Punta Cana',
    // [v3 2026-08-06, WEBSITE-TOURS pág. 1 + slide 71] Los 4 chips aprobados
    // (el cliente tachó «Cancelación gratis») + «Ages 15+», que es la regla
    // concreta que pidió en la reunión («los niños de 15 en adelante»).
    // ⚠️ TENSIÓN DE COPY, anotada en el plan 02: la ficha se sigue vendiendo
    // como «Adults-Only» y 15+ no es adults-only en sentido estricto. Se
    // mantienen los dos porque así lo maneja el sector —posicionamiento
    // arriba, regla concreta en el chip— y está pedido por escrito al cliente
    // (índice de planes, petición 6).
    chipsHero: [
      'Support Coral Restoration',
      'Exclusive Underwater Museum',
      'Limited Participants',
      'Premium Lunch',
      'Ages 15+',
    ],
    audiencia: 'Adults only',
    // «4 hours», no «4 horas»: este string se compone dentro del título del
    // itinerario aprobado («Itinerary — 4 Hours») y de la ficha técnica. Las
    // otras 3 fichas lo pasan a inglés en su propio commit de F3.
    duracion: '4 hours',
    // [v3 2026-08-06, WEBSITE-TOURS págs. 2–3] Los 5 párrafos APROBADOS,
    // literales. Sustituyen a los 3 que había (portados de la web vieja).
    // ⚠️ Dos datos cambian de valor canónico y hay que respetarlos al barrer
    // el resto del sitio:
    //   · «more than 50 coral restoration structures» — el claim «top-3 de
    //     RD» desaparece de esta descripción. Sigue vivo en la home
    //     (Experiencia) y en otros puntos: unificar en el barrido F7, no aquí.
    //   · La fundación se llama «Los Arrecifes de Bávaro Ecological
    //     Foundation» en este documento y «Bávaro Reefs Foundation» en otros
    //     del mismo cliente. Se porta el nombre de ESTE doc y se pide elegir
    //     uno (índice de planes, petición 9).
    descripcionLarga: [
      "Experience a premium small-group catamaran tour in Punta Cana, designed for travelers who value comfort, exceptional service and unforgettable experiences. With no more than 35% of the catamaran's capacity, you'll enjoy plenty of personal space, the best spots on board and attentive, personalized service throughout the day.",
      "Departing from Bávaro, we cruise along the breathtaking coastline to the protected reef of Cabeza de Toro, one of the Caribbean's most remarkable marine conservation areas. Here you'll experience some of the best snorkeling in Punta Cana, exploring an exclusive Underwater Museum, artificial reefs that attract tropical marine life and more than 50 coral restoration structures developed by the Los Arrecifes de Bávaro Ecological Foundation.",
      "This is far more than a snorkeling stop, it's an opportunity to discover a living coral restoration project while swimming through one of Punta Cana's healthiest reef ecosystems.",
      'The adventure continues at a secluded beach where you can relax with a freshly prepared Coco Loco, followed by a visit to the famous Natural Pool of Punta Cana, featuring shallow, crystal-clear waters and artificial reefs that make snorkeling enjoyable for both beginners and experienced swimmers.',
      'To complete the experience, our signature Floating Kitchen serves an unforgettable gourmet lunch prepared fresh on board. Enjoy certified Angus beef, fresh lobster, premium seafood and show cooking, replacing the typical buffet with restaurant-quality cuisine in the middle of the Caribbean Sea.',
      "More than just another Punta Cana catamaran excursion, this is an experience where nature, marine conservation, gourmet dining and personalized service come together to create memories you'll never forget.",
    ],
    // [v3 2026-08-06, WEBSITE-TOURS pág. 8] Las horas del itinerario aprobado
    // mandan: zarpe 9:15 / 13:15 y regreso 13:15 / 17:15 (antes 9:00→13:00 y
    // 13:00→17:00). Son los mismos dos turnos de siempre, corridos 15 minutos.
    horarios: [
      { hora: '9:15 AM', regreso: '1:15 PM' },
      { hora: '1:15 PM', regreso: '5:15 PM' },
    ],
    upgradePremium: 15,
    // Menú POR PAQUETE, portado de la web aprobada. Light: 2 platos a la
    // parrilla. Premium: 7 platos — los 4 con foto real (plato-*) + 3 de solo
    // texto (lasañas y cóctel, sin asset en /fotos).
    menuLight: [
      { nombre: 'Grilled chicken breast', desc: 'With potatoes and vegetables', foto: 'plato-chicken-bodegon' },
      { nombre: 'Grilled fish fillet', desc: 'With potatoes and vegetables', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: MENU_PREMIUM_CASA,
    // [2026-08-21] LAS 11 FOTOS DE TOURS/CARIBBEAN SCAPE, y solo esas. Samuel: «solamente
    // que estén en el grid de imágenes las que están en la carpeta; si teníamos
    // fotos de antes, quítalas». Las `galeria-semi-privado-*` de antes salen de aquí; siguen
    // vivas en las páginas que también las usaban.
    // El orden es EDITORIAL: las primeras son las que se ven sin abrir el visor.
    galeriaCompleta: [
      'tour-escape-5',
      'tour-escape-1',
      'tour-escape-11',
      'tour-escape-10',
      'tour-escape-7',
      'tour-escape-3',
      'tour-escape-8',
      'tour-escape-9',
      'tour-escape-2',
      'tour-escape-4',
      'tour-escape-6',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'The coral was the highlight of the trip. The biologist explained everything to us.',
    // [v3 2026-08-06, WEBSITE-TOURS pág. 8] Itinerario APROBADO, con DOBLE
    // SALIDA: cada parada trae la hora del turno de mañana y la del de tarde
    // («8:20 AM / 12:20 PM»), tal como lo escribió el cliente. Hasta ahora la
    // ficha enseñaba una sola columna de horas y los dos turnos vivían solo en
    // `horarios`, dentro del widget — quien no abría el calendario no sabía
    // que había salida de tarde.
    // ⚠️ Cambio de nombre transversal: el «vivero de coral» pasa a ser el
    // MARINE PARK en todo el sitio (coincide con la página nueva del plan 05
    // §6). Aquí ya entra; el resto de menciones, en su fase.
    itinerarioNota: 'Pickup time depends on your hotel location. Exact time will be confirmed after your reservation.',
    itinerario: [
      {
        hora: '8:20 AM / 12:20 PM',
        titulo: 'Hotel Pickup',
        texto:
          "Air-conditioned transportation. Your exact pickup time will be confirmed according to your hotel's location.",
      },
      {
        hora: '9:15 AM / 1:15 PM',
        titulo: 'Departure from Bávaro',
        texto:
          "Check in at our private marina before cruising along Punta Cana's spectacular coastline toward Cabo Engaño.",
      },
      {
        hora: '10:00 AM / 2:00 PM',
        titulo: 'Snorkeling at the Marine Park',
        texto:
          'Explore our exclusive Marine Park, home to the Underwater Museum, coral restoration gardens and artificial reefs that attract abundant tropical marine life.',
      },
      {
        hora: '11:15 AM / 3:15 PM',
        titulo: 'Secret Beach & Coco Loco',
        texto:
          'Relax on a secluded beach while enjoying a freshly prepared Coco Loco served inside a real coconut, with or without alcohol.',
      },
      {
        hora: '12:00 PM / 4:00 PM',
        titulo: 'Natural Pool & Floating Kitchen',
        texto:
          "Swim in Punta Cana's famous crystal-clear natural pool before enjoying your freshly prepared gourmet lunch from our signature Floating Kitchen. No buffets. Every meal is cooked fresh on board.",
      },
      {
        hora: '1:15 PM / 5:15 PM',
        titulo: 'Return to the Marina & Hotel Transfer',
        texto: 'Cruise back to our private marina before your comfortable transfer to your hotel.',
      },
    ],
    // [v3 2026-08-06, WEBSITE-TOURS págs. 9–10] Los 8 ítems APROBADOS de
    // «What´s Included», literales. Sustituyen a los 4 + 4 que había (4
    // titulares con texto + 4 sueltos en `incluyeExtra`): el cliente los da
    // todos con título y descripción, así que `incluyeExtra` desaparece de
    // esta ficha y los 8 pesan igual, que es como él los presenta.
    // ⚠️ «Wi-Fi On Board» ya se prometía (estaba en incluyeExtra) — el dato no
    // es nuevo, solo sube de categoría.
    incluye: INCLUYE_MARINE_PARK,
    noIncluido: NO_INCLUIDO_MARINE_PARK,
    queLlevar: QUE_LLEVAR_MARINE_PARK,
    recomendaciones: RECOMENDACIONES_V3,
    faqTour: [
      { p: 'What if it rains?', r: 'Full refund or a date change, at no cost.' },
      { p: 'Is there a restroom on board?', r: 'Yes, every one of our boats has a restroom.' },
      { p: 'Can I come if I cannot swim?', r: 'Yes, the snorkeling is in shallow water and life jackets are available.' },
      {
        p: 'Should I bring cash? How much?',
        r: 'Only if you choose to pay the 25% deposit, the balance gets a 5% discount when paid in cash.',
      },
    ],
    tambienTeGusta: ['coral', 'private-charter'],
    // [v2 2026-07-27] Las 4 ventajas del comparador (slide 17) y de la caja de
    // upsell del widget (slide 5). Salen de menuPremium/incluye de esta misma
    // ficha: langosta y Angus están en los platos Premium, la variedad de 7 vs
    // 2 es aritmética de los propios arrays, y las fotos incluidas están en la
    // web original. Nada inventado.
    // [v3 2026-08-06] Traducción nuestra (el cliente no da esta lista): son
    // las 4 ventajas reales sacadas de menuPremium/incluye de esta misma
    // ficha, solo cambian de idioma. Las lee el comparador Y la caja de
    // upsell del widget.
    ventajasPremium: [
      'Lobster, certified Angus beef and Surf & Turf on your plate',
      '7 dishes to choose from instead of 2',
      'Vegetarian options and seafood cocktail',
      'Your tour photos, included',
    ],
    // [v2] Upsells del semi-privado. El álbum es el único que la web original
    // documenta aquí literalmente («the full album via Dropbox for just $20
    // per group»). Aquí SÍ se puede decir «álbum completo»: lo gratis son
    // «los mejores momentos», no todas las fotos.
    addOns: [
    ],
  },

  coral: {
    // [2026-08-12, Samuel] El nombre nuevo, literal — ver el gemelo del
    // semi-privado y la tabla de renombres en data/home.ts.
    tituloLargo: 'Coral Quest: A Marine Conservation Experience (All Ages)',
    // [v3 2026-08-06, WEBSITE-TOURS pág. 11] Título APROBADO del bloque de
    // descripción.
    promesa: 'Discover the Caribbean Beneath the Surface',
    audiencia: 'Families',
    duracion: '4 hours',
    // [v3 2026-08-06, WEBSITE-TOURS págs. 11–12] Los 7 párrafos APROBADOS,
    // literales. No es una traducción de los 3 que había: es OTRO
    // posicionamiento. Los viejos vendían «la versión familiar del
    // semi-privado» (mismo recorrido, ritmo más tranquilo, chalecos
    // infantiles); el copy nuevo vende una experiencia de CONSERVACIÓN con su
    // propio recorrido —centro de interpretación antes de embarcar, siembra
    // simbólica de coral a bordo, DOS puntos de snorkel— y ni menciona a los
    // niños salvo en «all ages». El cambio es del cliente y va entero.
    // ⚠️ Typo del documento corregido al portar (plan 03 §7): «Become part of
    // it's future» → «its».
    // ⚠️ «Marine Interpretation Center» aquí vs «Coral Interpretation Center»
    // en la home (WEBSITE - INICIO pág. 4): el mismo cliente usa los dos
    // nombres para el mismo sitio. Se porta el de este documento, que es el
    // que lo describe en detalle, y se le pide elegir uno.
    descripcionLarga: [
      // ⚠️ [2026-08-12] SEGUNDO retoque al copy aprobado de este párrafo: el
      // documento abre con «Snorkel Lovers is more than a catamaran tour» y el
      // producto ya no se llama así. Se sustituye el nombre y nada más — el
      // resto es literal. Cuando llegue copy v4, este párrafo es el primero que
      // hay que contrastar.
      "Coral Quest is more than a catamaran tour, it's an immersive marine conservation experience designed for families, ocean lovers and curious explorers of all ages.",
      "Departing from Bávaro, you'll sail to our exclusive Marine Park, where you'll snorkel among vibrant coral reefs, tropical fish, artificial reefs and the Underwater Museum, all within one of the Dominican Republic's leading coral restoration projects.",
      "Before boarding, you'll visit our Marine Interpretation Center, where our Foundation team will introduce you to the reef ecosystem, explain how coral restoration works and show how these projects are helping protect Punta Cana's marine life for future generations.",
      "On board, you'll take part in a symbolic coral planting activity, becoming part of the restoration effort and creating a meaningful connection with the ocean you'll soon explore.",
      'The experience continues with two incredible snorkeling locations. First, the protected reef inside our Marine Park. Then, the crystal-clear Natural Pool, where our artificial reefs attract colorful marine life and provide an ideal second snorkeling experience for both beginners and experienced swimmers. Keep your eyes on the horizon as well. Sea turtles are frequently spotted from the catamaran during the journey.',
      'To complete the day, enjoy our signature Floating Kitchen, where every meal is freshly prepared on board using premium ingredients. Choose from our Premium Menu featuring certified Angus beef, fresh lobster, Surf & Turf and other gourmet options, while relaxing with our open bar in the heart of the Caribbean.',
      "This isn't simply a snorkeling excursion. It's an opportunity to explore, learn, contribute and experience one of the most unique marine conservation projects in Punta Cana. Don't just discover the reef. Become part of its future.",
    ],
    // Mismos dos turnos, corridos 15 min para casar con el itinerario
    // aprobado (igual que el semi-privado).
    horarios: [
      { hora: '9:15 AM', regreso: '1:15 PM' },
      { hora: '1:15 PM', regreso: '5:15 PM' },
    ],
    // ── LIGHT / PREMIUM, DE VUELTA (2026-07-28, pedido de Samuel: «al tour
    // snorkel también ponle selector Premium/Light, igual que semi-privado,
    // Premium por defecto») ──────────────────────────────────────────────
    //
    // HISTORIA, porque este campo ha ido y venido: el 2026-07-17 Samuel pidió
    // «quitar la opción de premium/light, dejar los 8 menús» — la web del
    // cliente publica para snorkel-lovers una tarifa única (Adulto 114 /
    // Niño 65) y no anuncia upgrade. Se puso `upgradePremium: null` y el
    // toggle desapareció. `menuLight` volvió poco después (el funnel
    // necesitaba platos que enseñar si alguien entraba con `?paquete=light`),
    // así que hoy la ficha ya tiene los DOS menús: 2 platos a la parrilla y
    // los 8 de la carta grande. Lo único que faltaba para volver a tener el
    // selector era el precio del salto.
    //
    // ⚠️⚠️ LOS 15 DÓLARES SON UN SUPUESTO, NO UN DATO. El tarifario del
    // cliente no publica upgrade para este tour; 15 es el upgrade REAL de
    // semi-privado, que es el mismo barco, la misma cocina y los mismos 8
    // platos. Es la única referencia que existe en el proyecto y por eso se
    // usa — pero HAY QUE CONFIRMARLO CON FERNANDO antes de publicar. Si el
    // número cambia, se cambia aquí y ya: el widget, el comparador, la banda
    // «estás en Premium» y el funnel lo leen todos de este campo.
    //
    // Al ser tarifa dual, el upgrade se suma POR PERSONA a las dos tarifas
    // (adulto 114→129, niño 65→80) — ver `calcularTotalTour()`.
    upgradePremium: 15,
    // v3 fix (2026-07-17, pedido de Samuel): el refactor a "solo Adulto
    // 114 / Niño 65" dejó menuLight vacío A PROPÓSITO, pero el widget
    // y el funnel de la ficha AÚN no estaban actualizados a ese modelo
    // (seguían aceptando y mostrando paquete=light). Hasta que se
    // terminara el refactor, se restauró menuLight para que el paso 2
    // del funnel de snorkel-lovers tuviera platos que mostrar cuando
    // el usuario entrara con ?paquete=light. Desde el 07-28 ya no es un
    // parche: es la mitad Light del comparador, otra vez.
    menuLight: [
      { nombre: 'Grilled chicken breast', desc: 'With potatoes and vegetables', foto: 'plato-chicken-bodegon' },
      { nombre: 'Grilled fish fillet', desc: 'With potatoes and vegetables', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: [
      ...MENU_PREMIUM_CASA,
      // [v2 2026-07-27] KID'S MEAL — la corrección del slide 1 («falta agregar
      // el menú de niños»), que el cliente puso PRIMERA en su PowerPoint.
      //
      // NO es un menú aparte: en la web original es una tarjeta más dentro del
      // mismo «Hispaniola Menu», al lado de Seafood/Meat/Surf & Turf. Por eso
      // entra aquí como un plato con `soloNinos` en vez de como un tercer
      // PaqueteMenu — bastante más barato de lo que el plan estimaba.
      //
      // La FOTO es real, descargada de su web (images/food/kids_meal_new.jpg).
      // Su HTML tiene TODAS las descripciones de plato comentadas, así que la
      // web no dice qué lleva — la descripción de abajo se LEE DE LA FOTO, y
      // coincide con lo que Samuel recordaba en la reunión (11:00: «una
      // hamburguesa con otras cosas»).
      // ⚠️ Describir comida a partir de una foto es una lectura, no un dato
      // declarado: la redacción está pendiente de que Fernando la confirme.
      {
        nombre: "Kid's Meal",
        desc: 'Burger, chicken strips, sausage and fries',
        foto: 'plato-kids-meal',
        soloNinos: true,
      },
    ],
    // [2026-07-28] Las 4 ventajas del salto a Premium, que estrena este tour
    // al recuperar el selector. Mismo criterio que las de semi-privado: se
    // SACAN de los arrays de esta misma ficha y no se inventa ninguna —
    // langosta, Angus y Surf & Turf están en `menuPremium`; el 8 contra 2 es
    // aritmética de los dos arrays; el vegetariano y el cóctel también están.
    //
    // La cuarta es la que NO tiene semi-privado y aquí sí toca: el Kid's Meal
    // vive en `menuPremium`, así que en Light no hay plato infantil. Es el
    // argumento más honesto que existe para este tour en concreto, que es el
    // familiar de la casa.
    //
    // ⚠️ No se menciona «las fotos incluidas» (la 4ª de semi-privado): aquí
    // el álbum es un add-on de pago, no algo que traiga el Premium.
    // [v3 2026-08-06] Traducción nuestra: mismas 4 ventajas, sacadas de los
    // arrays de esta ficha, solo cambian de idioma.
    ventajasPremium: [
      'Lobster, certified Angus beef and Surf & Turf on your plate',
      '8 dishes to choose from instead of 2',
      'Vegetarian options and seafood cocktail',
      "Kid's Meal for the little ones",
    ],
    // v3 (2026-07-17, web del cliente): 18 fotos reales de la excursión
    // familiar (la web tenía `images/excursions/educational/{4,5,7,8,10,11,
    // 13,14,16,17,20,21,22,23,24,25,26,27}.jpg`). Antes 9 — faltaban las
    // 9 últimas. Descargadas y reencodeadas a WEBP quality 85 (~50-170 KB).
    // [2026-08-21] LAS 12 FOTOS DE TOURS/CORAL QUEST, y solo esas. Samuel: «solamente
    // que estén en el grid de imágenes las que están en la carpeta; si teníamos
    // fotos de antes, quítalas». Las `galeria-snorkel-lovers-*` de antes salen de aquí; siguen
    // vivas en las páginas que también las usaban.
    // El orden es EDITORIAL: las primeras son las que se ven sin abrir el visor.
    galeriaCompleta: [
      'tour-coral-9',
      'tour-coral-5',
      'tour-coral-7',
      'tour-coral-10',
      'tour-coral-8',
      'tour-coral-1',
      'tour-coral-3',
      'tour-coral-6',
      'tour-coral-12',
      'tour-coral-4',
      'tour-coral-11',
      'tour-coral-2',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'Perfect for going with kids. Everyone felt safe.',
    itinerarioTitulo: 'Marine Park Journey',
    itinerarioNota:
      'Hotel pickup time depends on your location. Your exact pickup time will be confirmed after your reservation.',
    // [v3 2026-08-06, WEBSITE-TOURS pags. 14-15] Itinerario APROBADO. NO es
    // el del semi-privado traducido: es OTRO recorrido y el cliente lo
    // detalla parada a parada.
    //   - Aparece una parada nueva ANTES de embarcar: el Marine Interpretation
    //     Center, con el equipo de la fundacion.
    //   - Se invierte el orden del agua: primero la PISCINA NATURAL (con la
    //     siembra simbolica de coral) y despues el snorkel en el Marine Park.
    //   - DESAPARECE la playa desierta con coco-loco, que si sigue en el
    //     semi-privado. El documento no la menciona para este tour.
    // Es una redefinicion del producto en la web, no una traduccion, y por eso
    // se porta tal cual y se deja dicho aqui.
    itinerario: [
      {
        hora: '8:20 AM / 12:20 PM',
        titulo: 'Hotel Pickup',
        texto: 'Comfortable air-conditioned transportation from your hotel.',
      },
      {
        hora: '9:15 AM / 1:15 PM',
        titulo: 'Private Marina & Marine Interpretation Center',
        texto:
          "Check in at our private marina before visiting our Marine Interpretation Center, where you'll meet our Foundation Conservation Team and discover how we're restoring and protecting Punta Cana's coral reefs through one of the Dominican Republic's leading marine conservation projects.",
      },
      {
        hora: '10:00 AM / 2:00 PM',
        titulo: 'Natural Pool & Symbolic Coral Planting',
        texto:
          'Take part in a symbolic coral planting activity, then enjoy your first snorkeling experience in the crystal-clear Natural Pool, surrounded by our artificial reefs designed to attract tropical marine life.',
      },
      {
        hora: '10:45 AM / 2:45 PM',
        titulo: 'Snorkeling at the Marine Park',
        texto:
          'Explore our protected Marine Park, home to the Underwater Museum, coral restoration gardens and thriving reef ecosystems. Keep an eye out for sea turtles, which are frequently spotted during this part of the journey.',
      },
      {
        hora: '11:45 AM / 3:45 PM',
        titulo: 'Floating Kitchen & Gourmet Lunch',
        texto:
          'Return on board to enjoy a freshly prepared gourmet lunch from our signature Floating Kitchen, featuring premium ingredients and restaurant-quality cuisine in the middle of the Caribbean.',
      },
      {
        hora: '1:15 PM / 5:15 PM',
        titulo: 'Return to the Marina & Hotel Transfer',
        texto: 'Cruise back to our private marina before your comfortable transfer to your hotel.',
      },
    ],
    // Los 8 items aprobados son IDENTICOS a los del semi-privado en el
    // documento del cliente (pags. 16-17 = 9-10) -> constante compartida.
    incluye: INCLUYE_MARINE_PARK,
    // [v3 2026-08-07, pedido de Samuel] SIN «professional photographer (on
    // request, extra cost)». Por eso esta ficha deja de usar
    // NO_INCLUIDO_MARINE_PARK y escribe su propia línea: el resto es idéntico
    // —si se toca una, hay que mirar la otra—, pero el fotógrafo no se anuncia
    // aquí. Mismo cambio en Saona.
    noIncluido:
      'Not included: transportation surcharge from Casa de Campo.',
    queLlevar: QUE_LLEVAR_MARINE_PARK,
    recomendaciones: RECOMENDACIONES_V3,
    faqTour: [
      {
        p: 'What is the minimum age for children?',
        r: 'There is no minimum age. The snorkeling is in shallow water and we carry life jackets in every size.',
      },
      { p: 'Are there child life jackets?', r: 'Yes, for every age and size.' },
      { p: 'Can I come if I cannot swim?', r: 'Yes, the snorkeling is in shallow water and life jackets are available.' },
      {
        p: 'Should I bring cash? How much?',
        r: 'Only if you choose to pay the 25% deposit, the balance gets a 5% discount when paid in cash.',
      },
    ],
    tambienTeGusta: ['semi-private-premium', 'private-charter'],
    // [v2] Snorkel Lovers. La web original NO ofrece aquí el álbum, pero
    // Samuel decidió el 07-27 extenderlo a los 6 productos: la política del
    // negocio es uniforme y son sus otras páginas las que no lo tienen escrito.
    addOns: [
    ],
  },

  'private-charter': {
    // [2026-07-28] Widget en piel oscura SIEMPRE — ver `widgetPremiumDeBase`
    // en el tipo. Alquilar el barco entero para tu grupo no tiene versión
    // Light: aquí la piel premium no anuncia un upgrade, describe el producto.
    widgetPremiumDeBase: true,
    bandaModalidad: {
      // [v3 2026-08-06] Texto LITERAL del slide 77, traducido y sin adornar:
      // «En ésta sección ofrecemos nuestros Charter privado en modalidad
      // Premium que es el más vendido» + el boton «Consultar modalidades más
      // económicas». Samuel pidio expresamente que fuera lo que dice el slide.
      eyebrow: 'Premium mode',
      texto:
        'In this section we offer our Private Charter in Premium mode, which is our best seller.',
      // [2026-08-24, barrido de enlaces] La ruta era `/eventos/party-boat`, en
      // espanol: se quedo sin traducir en el cambio de rutas a ingles de v3.
      // Funcionaba de milagro —App.tsx la redirige— pero cobrando un salto de
      // mas, y es el unico enlace del sitio que seguia hablando en espanol.
      cta: { texto: 'See more affordable options', a: '/events/party-boat' },
    },
    tituloLargo: 'Private Charter · the whole catamaran for your group',
    // [v3 2026-08-06, WEBSITE-TOURS pag. 17] Titulo APROBADO del bloque de
    // descripcion.
    promesa: 'Your Private Caribbean Experience',
    audiencia: 'Your group',
    duracion: '3 or 4 hours',
    // [v3 2026-08-06, WEBSITE-TOURS pags. 17-18] Los parrafos APROBADOS,
    // literales, incluida la lista de barcos con sus capacidades.
    //
    // ⚡ DECISION DE SAMUEL (2026-08-06): «los 5 documentos WEBSITE estan
    // totalmente aprobados; si lo dice ahi, ese es el que nos quedamos». Eso
    // resuelve el conflicto de capacidades que el plan dejaba abierto: las
    // cifras de aqui MANDAN sobre el tarifario portado de la web vieja, y por
    // eso los tramos de `subVariantes` se recortan a ellas (Maite 20 -> 15,
    // Forever Teresa 120 -> 85). Ver el comentario de cada barco.
    descripcionLarga: [
      "Whether you're celebrating with family, friends or colleagues, our Private Catamaran Charters give you the freedom to enjoy Punta Cana your way.",
      // [v3 2026-08-07, pedido de Samuel: «este texto tal cual»] LA LISTA DE
      // BARCOS, que faltaba. Se había omitido porque el selector del widget ya
      // enseña los cuatro con sus horas y su aforo; pero el documento la pone
      // en la descripción, y ahí hace algo que el widget no: se lee sin tocar
      // nada y sobrevive al móvil, donde el widget queda a pantallas de
      // distancia. Cada barco es su propia línea —así lo escribe él— y el
      // bloque de descripción las separa como párrafos cortos.
      // ⚠️ ESTAS CIFRAS Y LAS DE `subVariantes` SON EL MISMO DATO ESCRITO DOS
      // VECES. Es la excepción, no la regla: el copy es del cliente y va
      // literal. Si cambia un aforo, hay que tocar los dos sitios — y el
      // segundo manda en lo que se cobra.
      'Choose the catamaran that best fits your group:',
      'Maite – 4 hours · Up to 15 guests',
      'GrandMa – 3 hours · Up to 50 guests',
      'Santa Maria – 4 hours · Up to 45 guests',
      'Forever Teresa – 3 or 4 hours · Up to 85 guests',
      "Departing from our private marina in Bávaro, you'll cruise along Punta Cana's spectacular coastline toward Cabeza de Toro, where you'll discover our exclusive Marine Park. Snorkel among the Underwater Museum, coral restoration gardens and artificial reefs before relaxing in the famous crystal-clear Natural Pool.",
      'Our 4-hour charters include our signature Floating Kitchen, where every meal is freshly prepared on board. Guests can choose from seven gourmet menu options, including seafood, certified Angus beef, Surf & Turf, vegetarian dishes and more. Fresh lobster is available as an optional upgrade.',
      'For 3-hour charters, we serve our popular Taste of Hispaniola Menu, featuring freshly prepared grilled skewers with your choice of chicken, beef or shrimp, accompanied by sides and our open bar.',
      "Every private charter is tailored to your group. Whether you're planning a birthday, family gathering, corporate event or celebration, our team will help you choose the perfect catamaran, route and menu for an unforgettable day at sea.",
      'Not sure which catamaran is right for your group? Our sales team will be happy to help you choose the perfect option.',
    ],
    // v3 (2026-07-17, charter completo): el charter tiene 4 botes con
    // precios distintos según pax. Cada bote tiene 2 horarios (Maite,
    // Santa Maria) o 3 (GrandMa, Forever Teresa 3h). Los precios vienen
    // verbatim del schema.org de la web del cliente (JSON-LD verificado).
    // Las fotos están en /fotos (flota-*).
    //
    // Maite: 4h, 2 horarios, 2 tramos. Para 8 pax, US$ 625 por grupo
    // (+ US$ 25/pax meal/transport). Para 20 pax, US$ 99 por persona.
    //
    // GrandMa: 3h, 3 horarios, 1 tramo fijo de 20 pax. US$ 825 grupo.
    //
    // Santa Maria: 4h, 2 horarios, 1 tramo fijo de 20 pax. US$ 1.150
    // grupo. El web dice "plated options for up to 20 pax and premium
    // skewers for groups of 21 pax and more" — el precio para 21+ se
    // coordina aparte.
    //
    // Forever Teresa: 3h/4h (info, no se elige), 2 horarios. Tramos
    // por pax desde 1-18 hasta 30-120. El widget usa los precios de 3h
    // (los más comunes); 4h se menciona en la descripción.
    horarios: [],
    upgradePremium: null,
    subVariantes: [
      {
        id: 'maite',
        nombre: 'Maite',
        descripcion: 'Intimate cruise · 4h · up to 15 guests',
        // ⚡ 15, no 20 (WEBSITE-TOURS pag. 17). El 20 venia del tarifario de
        // su propia web y era el techo del tramo por persona.
        capacidad: 'Up to 15 guests',
        duracion: '4 hours',
        duracionHoras: 4,
        foto: 'flota-maite',
        horarios: [
          { hora: '9:00 AM', regreso: '1:00 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        // [tarifa-v2 · corregido 2026-07-28, lo cazó Samuel: «el +25 eso solo
        // para comida, ¿no?»] Sí, y de ahí salen dos correcciones:
        //  1) EL TEXTO DECÍA DE MÁS. Ponía «para comida y transporte»; el
        //     tarifario extraído de la web dice literalmente «+ US$ 25.00
        //     p/persona (comida)» — el transporte no aparece en ninguna de las
        //     5 tarifas (TARIFARIO-WEB-ORIGINAL.md §1). Se quita.
        //  2) NO ES UN RECARGO, ES OPCIONAL. Decisión de Samuel del 2026-07-27,
        //     escrita en el TARIFARIO §B: «el +25 / +45 es una COMIDA OPCIONAL,
        //     no entra en el precio base, se modela como add-on y solo suma si
        //     el usuario la elige». Pintarlo como un «+» pegado al precio del
        //     tramo lo leía como obligatorio, que es justo lo contrario.
        // ⚠️ PENDIENTE (no es un olvido de este cambio, es deuda anterior): el
        // add-on `comida` NO existe todavía en `addOns` de la ficha, así que el
        // widget no permite elegirlo — hoy solo se ANUNCIA aquí. Antes de
        // cablearlo hay que resolver dos cosas con el cliente, porque el
        // modelo actual de AddOn no da para las dos: (a) el importe cambia por
        // BARCO (25 en charter, 45 en el catamarán de Saona) y los add-ons hoy
        // son de la ficha entera, no de la sub-variante; y (b) el tarifario
        // solo lo lista en los tramos de GRUPO — falta confirmar si en los
        // tramos por persona la comida ya va incluida en la tarifa por cabeza.
        tabla: [
          { desde: 1, hasta: 8, precio: 625, tipo: 'grupo', extra: 'Optional meal: + US$ 25 per person' },
          // ⚡ El tramo se recorta a 15: con el aforo aprobado, las plazas
          // 16-20 que vendia esta tabla no existen.
          // [2026-08-31] ALINEADO CON ODOO. Derick: «todo con la config de
          // Odoo». Esta tabla es la que se PINTA cuando el backend no contesta
          // (y la que imprime la ficha); el precio que se cobra sale del
          // servidor. Tenerlas distintas era anunciar una cosa y cobrar otra.
          { desde: 9, hasta: 20, precio: 99, tipo: 'persona' },
        ],
      },
      {
        id: 'grandma',
        nombre: 'GrandMa',
        // ⚠️ Decia «hasta 20 pax» y era un ERROR NUESTRO, no del cliente: el
        // 20 del tarifario es el corte del MENU («plated hasta 20 pax; skewers
        // de 21 en adelante»), no el aforo del barco. Su propia `capacidad` y
        // su tabla ya decian 50, y el copy aprobado tambien.
        descripcion: 'Agile cruise · 3h · up to 50 guests',
        capacidad: 'Up to 50 guests',
        duracion: '3 hours',
        duracionHoras: 3,
        foto: 'flota-grandma',
        horarios: [
          { hora: '9:00 AM', regreso: '11:55 AM' },
          { hora: '12:00 PM', regreso: '2:55 PM' },
          { hora: '3:00 PM', regreso: '6:00 PM' },
        ],
        // [tarifa-v2] Corregido 2026-07-27 contra la web original. Antes:
        // `1-20 grupo 825` — 825 es el «from us$» (precio de escaparate tras
        // descuentos), NO una tarifa. La tabla real tiene dos tramos.
        tabla: [
          { desde: 1, hasta: 12, precio: 900, tipo: 'grupo' },
          { desde: 13, hasta: 50, precio: 75, tipo: 'persona' },
        ],
      },
      {
        id: 'santa-maria',
        nombre: 'Santa Maria',
        // ⚠️ Mismo error que GrandMa: el 20 era el corte del menu emplatado,
        // no el aforo. Copy aprobado y tarifario coinciden en 45.
        descripcion: 'Premium cruise · 4h · up to 45 guests',
        capacidad: 'Up to 45 guests (plated up to 20, skewers from 21)',
        duracion: '4 hours',
        duracionHoras: 4,
        foto: 'flota-santa-maria',
        horarios: [
          { hora: '9:00 AM', regreso: '12:55 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        // [tarifa-v2] Corregido 2026-07-27: 1150 era el «from us$», no la
        // tarifa. Ojo — en Santa Maria el «from» (1150) era MAYOR que su
        // propio precio de grupo real (1000): la web del cliente anuncia un
        // «desde» más caro que su tarifa. Otro motivo para no usar los «from».
        tabla: [
          { desde: 1, hasta: 13, precio: 1000, tipo: 'grupo', extra: 'Optional meal: + US$ 25 per person' },
          { desde: 14, hasta: 45, precio: 99, tipo: 'persona' },
        ],
      },
      {
        id: 'forever-teresa',
        // [v2 2026-07-28] «Forever Teresa» → «Forever Teresa · 3h», y la
        // duración pierde el «(también 4h, consultar)». Las dos cosas son
        // resto de cuando este barco tenía una sola entrada: desde que existe
        // la fila de 4h justo debajo, un rótulo pelado y un «consultar» que
        // remite a la opción de al lado solo confunden — parecían dos barcos
        // distintos, uno de ellos con asterisco.
        nombre: 'Forever Teresa · 3h',
        // ⚡ 85, no 120 (WEBSITE-TOURS pag. 17). Mismo caso que Maite.
        descripcion: 'Large catamaran · 3h · up to 85 guests',
        capacidad: 'Up to 85 guests (tiered pricing)',
        duracion: '3 hours',
        duracionHoras: 3,
        foto: 'flota-forever-teresa',
        horarios: [
          { hora: '9:00 AM', regreso: '12:00 PM' },
          { hora: '3:00 PM', regreso: '6:00 PM' },
        ],
        // [tarifa-v2] Corregido 2026-07-27: el primer tramo era 1750 («from
        // us$»); la tarifa real de grupo es 1600. Los otros 3 tramos ya
        // estaban bien. Esta es la variante de 3h — la de 4h vive abajo.
        tabla: [
          { desde: 1, hasta: 18, precio: 1600, tipo: 'grupo' },
          { desde: 19, hasta: 25, precio: 85, tipo: 'persona' },
          { desde: 26, hasta: 29, precio: 2225, tipo: 'grupo' },
          // [2026-08-31] ALINEADO CON ODOO. Derick: «todo con la config de
          // Odoo». Esta tabla es la que se PINTA cuando el backend no contesta
          // (y la que imprime la ficha); el precio que se cobra sale del
          // servidor. Tenerlas distintas era anunciar una cosa y cobrar otra.
          { desde: 30, hasta: 120, precio: 75, tipo: 'persona' },
        ],
      },
      {
        // [tarifa-v2] NUEVA (2026-07-27): el Forever Teresa se vende en DOS
        // duraciones con tarifarios distintos, no solo 3h. La web original
        // los lista como dos bloques de precios separados bajo el mismo
        // barco. Antes el repo solo tenía la de 3h.
        id: 'forever-teresa-4h',
        nombre: 'Forever Teresa · 4h',
        descripcion: 'Large catamaran · 4h · up to 85 guests',
        capacidad: 'Up to 85 guests (tiered pricing)',
        duracion: '4 hours',
        duracionHoras: 4,
        foto: 'flota-forever-teresa',
        horarios: [
          { hora: '9:00 AM', regreso: '12:55 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        tabla: [
          { desde: 1, hasta: 18, precio: 1600, tipo: 'grupo', extra: 'Optional meal: + US$ 25 per person' },
          { desde: 19, hasta: 25, precio: 110, tipo: 'persona' },
          { desde: 26, hasta: 28, precio: 2775, tipo: 'grupo', extra: 'Optional meal: + US$ 25 per person' },
          // [2026-08-31] ALINEADO CON ODOO. Derick: «todo con la config de
          // Odoo». Esta tabla es la que se PINTA cuando el backend no contesta
          // (y la que imprime la ficha); el precio que se cobra sale del
          // servidor. Tenerlas distintas era anunciar una cosa y cobrar otra.
          { desde: 29, hasta: 120, precio: 99, tipo: 'persona' },
        ],
      },
    ],
    // v3 (2026-07-17, charter): el charter ahora se vende con paquetes
    // (4 botes con tabla de precios) — antes era booking 'cotizacion'
    // sin menuLight ni menuPremium. Mantengo los 2 campos vacíos por
    // compatibilidad con el modelo (no se usan en el widget porque
    // menuLight.length === 0 → no se pinta el toggle Light/Premium).
    menuLight: [],
    menuPremium: [],
    // El menú de charter es transversal a los 4 botes: 7 platos + 1
    // add-on (lobster premium). Se pinta en MenuTour como un caso
    // nuevo (menuCharter) porque es transversal a las sub-variantes.
    menuCharter: {
      // [v3 2026-08-06, slides 73-74 + reunion 07-31 19:21-22:15] EL CAMBIO
      // MAS GORDO DEL POWERPOINT: el menu deja de ser uno solo y se parte por
      // DURACION del barco, que es lo que decide que se puede cocinar a bordo.
      // La regla completa la dio Miguel en la reunion y el copy aprobado la
      // confirma (WEBSITE-TOURS pag. 17):
      //   · 4 horas -> carta de platos, uno por persona. De 21 personas en
      //     adelante el MISMO menu se sirve como buffet de pinchos.
      //   · 3 horas -> Taste of Hispaniola Menu (brochetas), para cualquier
      //     numero de personas.
      // ⚠️ La maqueta de la slide 74 rotulaba el menu de 3 h como «Mas de 21
      // personas», pero la reunion y el copy aprobado dicen que en los de 3
      // horas es ese para TODOS («en los de tres horas es este», dijo Samuel
      // recapitulando). Se ignora esa linea como residuo de la conversacion.
      cartas: [
        {
          id: '4h',
          pestana: '4-hour menu',
          titulo: 'Choose your dish',
          texto:
            'Guests can choose from seven gourmet menu options, freshly prepared on board in our signature Floating Kitchen.',
          // La regla de las 21 personas va como AVISO, no como una tercera
          // carta: la del buffet de pinchos no existe por escrito todavia y
          // este proyecto no inventa platos. Cuando llegue, es una carta mas.
          aforo: 'Up to 20 guests',
          nota: 'From 21 guests the menu changes. See the skewer buffet.',
          // Son los 7 platos Premium de la casa — los mismos que el copy
          // aprobado describe («seafood, certified Angus beef, Surf & Turf,
          // vegetarian dishes and more») y los mismos que ya sirven el
          // semi-privado y Snorkel Lovers. Antes esta carta tenia 4 platos + 3
          // brochetas: las brochetas se MUDAN al menu de 3 h, que es donde el
          // cliente las pone, y sin ellas la carta se quedaba en 4 — no en los
          // «seven» que promete su propio texto.
          platos: MENU_PREMIUM_CASA,
          // [2026-08-07] `addOnId` conecta esta franja con el add-on 'langosta'
          // de `addOns` (abajo): la franja del menú ya no solo lo anuncia, lo
          // MARCA en el widget. El precio no se repite en la descripción — la
          // franja lo pinta a su derecha.
          addOn: {
            nombre: 'Premium lobster',
            precio: 30,
            descripcion: 'Add fresh lobster to your dish, grilled on board.',
            addOnId: 'langosta',
          },
        },
        {
          id: '3h',
          pestana: '3-hour menu',
          aforo: 'Up to 20 guests',
          nota: 'From 21 guests the menu changes. See the skewer buffet.',
          titulo: 'Taste of Hispaniola Menu',
          // Nombre canonico del menu de 3 h, de WEBSITE-TOURS pag. 17.
          texto:
            'Freshly prepared grilled skewers with your choice of chicken, beef or shrimp, accompanied by sides and our open bar.',
          // ⚠️ [placeholder-v3] Las 3 brochetas comparten la foto de la
          // pechuga a la parrilla (plato-chicken-bodegon): es real, de esta
          // misma cocina, pero es pollo a la parrilla y no una brocheta.
          // Miguel se comprometio en la reunion a pasar la foto del menu
          // completo, la de la porcion por persona y dos de como se sirve
          // (indice de planes, peticion 1); con ellas este bloque crece a la
          // maqueta que dibujo en la slide 74 (una grande + dos pequenas).
          platos: [
            { nombre: 'Chicken skewer', foto: 'plato-chicken-bodegon', brocheta: true },
            { nombre: 'Beef skewer', brocheta: true },
            { nombre: 'Shrimp skewer', brocheta: true },
          ],
        },
        {
          // [v3 2026-08-06, maqueta de la slide 74 + decision de Samuel] La
          // maqueta del cliente se titula literalmente «Mas de 21 personas», y
          // Samuel confirma la lectura: el buffet de pinchos NO es el menu de
          // 3 h, es su propio menu y aplica a las DOS duraciones. Coincide con
          // el tarifario, que repite la misma regla barco a barco («plated
          // hasta 20 pax; skewers de 21 pax en adelante») tanto en los de 3 h
          // como en los de 4 h.
          id: '21+',
          pestana: 'Groups of 21+',
          aforo: 'From 21 guests',
          titulo: 'Skewer buffet',
          // Sin sello «New» (Samuel, 2026-08-07). El cliente lo dibuja en su
          // maqueta de la slide 74, pero en la fila de pestanas no marcaba una
          // novedad sino la carta que te toca por aforo — y esa ya la elige el
          // widget solo. Con el sello fuera, ninguna de las 3 cartas lleva
          // distintivo: las tres son igual de vigentes y lo que las separa es
          // la regla (duracion o numero de personas), no la antiguedad.
          texto:
            'From 21 guests, on both 3-hour and 4-hour charters, the menu is served as a skewer buffet: chicken, beef and shrimp, freshly grilled on board and served for the whole group.',
          // Sin rejilla de platos: en un buffet no se elige plato por persona,
          // asi que la carta no tiene nada que listar. Lo que hay que enseñar
          // es la mesa, la racion y el servicio — el bento de abajo.
          platos: [],
          bento: [
            {
              id: 'menu-completo',
              titulo: 'The full skewer buffet',
              texto: 'Chicken, beef and shrimp, grilled to order on board.',
              tamano: 'grande',
            },
            {
              id: 'porcion',
              titulo: 'Portion per guest',
              texto: 'What each guest gets served.',
              tamano: 'ancho',
            },
            // Dos tomas del MISMO asunto (el cliente dibujo dos recuadros de
            // «¿como se sirve?»), numeradas para que no parezca una celda
            // repetida por error.
            { id: 'servicio-1', titulo: 'How it is served (1)' },
            { id: 'servicio-2', titulo: 'How it is served (2)' },
          ],
        },
      ],
      cocina: [
        // [v3 2026-08-06, WEBSITE-TOURS pags. 18-19] Los 5 claims APROBADOS,
        // literales. Sustituyen a los 3 que habia (condimentos, parrilla,
        // dietas), que eran nuestro resumen de la ficha real. El diferencial
        // mas fuerte —los platos con restricciones se asan POR SEPARADO— no se
        // pierde: el cliente lo mantiene en «Dietary Friendly».
        {
          id: 'ingredientes',
          titulo: 'Premium Ingredients',
          texto: 'Certified Angus beef, fresh lobster and premium seafood selected daily.',
        },
        {
          id: 'show-cooking',
          titulo: 'Live Show Cooking',
          texto: 'Watch our chefs prepare your meal in the Floating Kitchen.',
        },
        {
          id: 'desde-cero',
          titulo: 'Made from Scratch',
          texto: 'Homemade sauces, seasonings and marinades. Never industrial mixes.',
        },
        {
          id: 'al-momento',
          titulo: 'Cooked to Order',
          texto: 'Every meal is grilled fresh on board, never reheated.',
        },
        {
          id: 'dietas',
          titulo: 'Dietary Friendly',
          texto: 'Vegetarian, vegan and allergy-friendly meals prepared separately.',
        },
      ],
    },
    // [2026-08-21] LAS FOTOS DE TOURS/PRIVATE CHARTER, y solo esas. Samuel: «solamente
    // que estén en el grid de imágenes las que están en la carpeta; si teníamos
    // fotos de antes, quítalas». Las `galeria-charter-privado-*` de antes salen de aquí; siguen
    // vivas en las páginas que también las usaban.
    // El orden es EDITORIAL: las primeras son las que se ven sin abrir el visor.
    // [2026-08-23, 2ª entrega] 10 → 12: entran las dos de `PRIVATE CHARTER/AGREGAR`.
    // Van en 4ª y 8ª posición y no al final, porque el final de esta lista es lo
    // que solo se ve abriendo el visor y las dos son de las mejores del grupo:
    // la mesa montada a bordo y el grupo en la proa.
    // ⚠️ `tour-charter-11` es BYTE A BYTE la misma imagen que `ev-weddings-6`
    // (mismo md5; el cliente puso `_MG_9277.jpg` en las carpetas de bodas y de
    // charter a la vez). Sale, por tanto, en /events/weddings y aquí. Tiene
    // sentido —una boda a bordo de un charter privado es las dos cosas— pero
    // queda anotado por si algún día molesta verla repetida.
    galeriaCompleta: [
      'tour-charter-8',
      'tour-charter-6',
      'tour-charter-5',
      'tour-charter-12',
      'tour-charter-1',
      'tour-charter-2',
      'tour-charter-3',
      'tour-charter-11',
      'tour-charter-9',
      'tour-charter-4',
      'tour-charter-7',
      'tour-charter-10',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'They tailored everything for us, the whole boat just for the family.',
    // [v3 2026-08-06, WEBSITE-TOURS pag. 20: «QUITAR HORAS Y PONER DEBAJO DE
    // PLAYA DESIERTA SOLO EN TOUR DE 4 HORAS»] Las horas desaparecen — un
    // charter privado zarpa cuando quiere el grupo, y publicarlas fijas
    // contradecia el producto. `itinerario.tsx` ya soporta paradas sin hora:
    // la columna se queda vacia y el rail sigue recto.
    itinerario: [
      {
        hora: '',
        titulo: 'Hotel Pickup',
        texto: 'Air-conditioned transportation. The exact time depends on your hotel and the boat you choose.',
      },
      {
        hora: '',
        titulo: 'Departure from Bávaro',
        texto: "Check in at our private marina before cruising along Punta Cana's coastline toward Cabeza de Toro.",
      },
      {
        hora: '',
        titulo: 'Snorkeling at the Marine Park',
        texto:
          'Explore the Underwater Museum, coral restoration gardens and artificial reefs of our exclusive Marine Park.',
      },
      {
        hora: '',
        titulo: 'Secret Beach & Coco Loco',
        texto: 'Relax on a secluded beach with a freshly prepared Coco Loco served inside a real coconut.',
        nota: 'Only on 4-hour charters',
      },
      {
        hora: '',
        titulo: 'Natural Pool & Floating Kitchen',
        texto: "Swim in Punta Cana's crystal-clear natural pool while your meal is grilled fresh on board.",
      },
      {
        hora: '',
        titulo: 'Return to the Marina & Hotel Transfer',
        texto: 'Cruise back to our private marina before your transfer to your hotel.',
      },
    ],
    incluye: [
      { titulo: 'The whole boat', texto: 'No strangers on board. The boat is yours alone.' },
      { titulo: 'Round-trip transportation', texto: 'Air-conditioned, from your hotel (Bávaro / Punta Cana).' },
      { titulo: 'Food your way', texto: '7 dishes to choose from: seafood, meat, surf & turf, vegetarian and skewers.' },
      { titulo: 'A dedicated coordinator', texto: 'One person from start to finish, no surprises.' },
    ],
    incluyeExtra: [
      'WiFi on board',
      'Snorkeling gear (every size)',
      'Marine biologist as your guide on the reef',
      'Free photos uploaded to Facebook',
    ],
    noIncluido:
      'Not included: transportation from Casa de Campo (surcharge). Optional add-on at checkout: premium lobster (US$ 30/person).',
    queLlevar: [
      'Swimsuit',
      'Towel',
      'Biodegradable sunscreen',
      'Camera',
      'Cash (for the lobster add-on or tips)',
    ],
    faqTour: [
      // [v3 2026-08-06] Capacidades segun el copy aprobado (WEBSITE-TOURS
      // pag. 17). Antes decia «Maite 8-20 · GrandMa 20 · Santa Maria 20 ·
      // Forever Teresa 120»: los dos primeros por el tarifario viejo, los dos
      // del medio por confundir el corte del menu emplatado con el aforo.
      {
        p: 'How many guests fit on each catamaran?',
        r: 'Maite up to 15 · GrandMa up to 50 · Santa Maria up to 45 · Forever Teresa up to 85.',
      },
      { p: 'Is there a minimum number of guests?', r: 'Maite starts at 1 guest (the US$ 625 rate covers up to 8). The others have no formal minimum. Ask us on WhatsApp for groups under 6.' },
      { p: 'Can I choose the menu?', r: 'Yes, we agree the seven dishes with you (seafood, meat, Surf & Turf, vegetarian and the chicken, beef or shrimp skewers). Premium lobster is an optional add-on.' },
      { p: 'Do you accept corporate payments?', r: 'Yes, see the Corporate & MICE page for formal invoicing.' },
      { p: 'What if it rains?', r: 'Full refund or a date change, at no cost.' },
    ],
    tambienTeGusta: ['semi-private-premium', 'coral'],
    // [v2] Charter privado. OJO con el texto del álbum: la web original de
    // este tour promete que «TODAS las fotos» se suben gratis a Facebook, así
    // que aquí NO se puede vender «el álbum completo» — solo la máxima
    // calidad. Si no, contradice lo que ellos mismos prometen.
    addOns: [
      // [v3 2026-08-06, WEBSITE-TOURS pág. 17: «Fresh lobster is available as
      // an optional upgrade»] ⚡ DECISIÓN DE SAMUEL: el documento WEBSITE gana
      // sobre la slide 73 del PowerPoint («la langosta solo va en Saona»),
      // porque los 5 WEBSITE están totalmente aprobados. Y no se queda en
      // texto: el cliente pidió expresamente que el upsell se pueda elegir en
      // el widget.
      //
      // Solo en los barcos de 4 h — son los que navegan con la cocina
      // flotante; los de 3 h llevan el Taste of Hispaniola (brochetas), así
      // que ofrecerla ahí sería vender algo que no se puede servir.
      //
      // Precio y nota de veda: los mismos que la langosta de Saona (US$ 30 por
      // persona, sustitución por camarón gigante de marzo a junio). Es el
      // mismo producto de la misma cocina, no un precio inventado para aquí.
      {
        id: 'langosta',
        etiqueta: 'Fresh lobster upgrade',
        descripcion: 'Add fresh lobster to your dish, freshly grilled on board. US$ 30 per person.',
        base: 'persona',
        precio: 30,
        soloSubVariantes: ['maite', 'santa-maria', 'forever-teresa-4h'],
        nota: 'From March to June lobster may be unavailable; in that case it is replaced with jumbo shrimp.',
      },
    ],
  },

  'saona-island': {
    // [2026-07-28] Widget en piel oscura SIEMPRE — ver `widgetPremiumDeBase`
    // en el tipo. Saona se vende eligiendo bote (speedboat / fishing town /
    // catamarán), no eligiendo menú: no hay Light contra el que contrastar, y
    // el día completo a la isla es el producto caro de la casa.
    widgetPremiumDeBase: true,
    tituloLargo: 'Saona Island · full day, choose your boat',
    // [v3 2026-08-06, WEBSITE-TOURS pag. 21] Titulo APROBADO del bloque de
    // descripcion.
    promesa: 'A Day in Paradise',
    audiencia: 'Full day',
    duracion: 'Full day (8 hours)',
    // [v3 2026-08-06, WEBSITE-TOURS pags. 21-22] Los parrafos APROBADOS,
    // literales, con la lista de variantes que trae el propio texto.
    //
    // ⚡ RENOMBRES que salen de aqui y hay que perseguir por todo el sitio:
    //   · «Fishing Town»  -> «Speedboat Adventure»
    //   · «Speedboat»     -> «Private Speedboat»
    // Ojo: el copy sigue llamando «Fishing Town itinerary» al recorrido que
    // pasa por Mano Juan — o sea que Fishing Town deja de ser el nombre del
    // PRODUCTO y pasa a ser el del ITINERARIO. Se respeta tal cual.
    descripcionLarga: [
      "Saona Island is one of the Dominican Republic's most iconic destinations, famous for its powder-white beaches, crystal-clear turquoise waters and breathtaking Natural Pool, where giant starfish can often be seen resting on the sandy bottom.",
      "Departing from Bayahibe, you'll spend the day exploring the island's most beautiful locations, including Catuano, Las Palmillas and, on our Fishing Town itinerary, the charming fishing village of Mano Juan.",
      'Choose the experience that best suits your group: Private Speedboat, the fastest and most exclusive option, for up to 9 guests. Catamaran, the classic Caribbean sailing experience. Speedboat Adventure, including stops at Mano Juan and Playa Toro.',
      'All options include a traditional Dominican buffet served on the island and time to relax in the famous Natural Pool at Las Palmillas.',
      'As the day comes to an end, enjoy a scenic cruise back along the Caribbean coastline before returning to your hotel.',
    ],
    horarios: [{ hora: '9:00 AM', regreso: '4:00 PM' }],
    // Sin Light/Premium (Saona se diferencia por BOTE, no por menú). El widget
    // detecta `subVariantes` y pinta un segmented control de botes en vez del
    // toggle clásico. `menuBuffet` cambia el formato del bloque de menú.
    upgradePremium: null,
    subVariantes: [
      {
        id: 'speedboat',
        // ⚡ [v3 2026-08-06, WEBSITE-TOURS pag. 21 + decision de Samuel: «los 5
        // documentos WEBSITE estan totalmente aprobados»] Renombre y recorte:
        // «Speedboat» -> «Private Speedboat», y el aforo baja de 25 a 9.
        // Es el recorte mas grande de la tanda: la tabla vendia un tramo por
        // persona de 11 a 25 que, con el aforo aprobado, no existe. Se corta
        // en 9 — el ultimo tramo de grupo que el tarifario define (US$ 1.280).
        // Las plazas 10 a 25 salen del widget.
        nombre: 'Private Speedboat',
        descripcion: 'The fastest, most exclusive way',
        capacidad: 'Up to 9 guests',
        tabla: [
          // [tarifa-v2] Corregido 2026-07-27 contra la web original. Tenía
          // TRES errores: (a) empezaba en `desde: 6`, así que 1-5 personas no
          // encontraban tramo y el total salía null; (b) el tramo de 9 decía
          // 1340 cuando son 1280 — 1340 es el de 10, que faltaba entero;
          // (c) el salto a per-persona era en 10 y es en 11.
          { desde: 1, hasta: 6, precio: 1100, tipo: 'grupo' },
          { desde: 7, hasta: 7, precio: 1160, tipo: 'grupo' },
          { desde: 8, hasta: 8, precio: 1220, tipo: 'grupo' },
          { desde: 9, hasta: 9, precio: 1280, tipo: 'grupo' },
          // [2026-08-31] ALINEADO CON ODOO. Derick: «todo con la config de
          // Odoo». Esta tabla es la que se PINTA cuando el backend no contesta
          // (y la que imprime la ficha); el precio que se cobra sale del
          // servidor. Tenerlas distintas era anunciar una cosa y cobrar otra.
          // Vuelven los tramos de 10 y de 11-25, que el tarifario si
          // tiene. OJO: aqui habia una nota que decia que por encima de 9
          // personas este barco «ya no se vende (aforo aprobado)». Si ese tope
          // sigue vigente, el sitio donde ponerlo es Odoo —quitando esos dos
          // tramos del tarifario y bajando el max-pax—, no aqui: de lo
          // contrario la web anuncia 9 y el servidor cobra 25.
          { desde: 10, hasta: 10, precio: 1340, tipo: 'grupo' },
          { desde: 11, hasta: 25, precio: 130, tipo: 'persona' },
        ],
      },
      {
        id: 'fishing',
        // ⚡ [v3 2026-08-06, WEBSITE-TOURS pag. 22] «Fishing Town» ->
        // «Speedboat Adventure». Ojo al matiz: el copy aprobado sigue llamando
        // «Fishing Town itinerary» al RECORRIDO que pasa por Mano Juan — lo
        // que cambia es el nombre del producto, no el del itinerario.
        // El `id` se queda en 'fishing': es una clave interna que viaja en la
        // URL del funnel y en reservas ya emitidas; renombrarla romperia
        // enlaces sin ganar nada.
        // ⚠️ Su aforo NO se toca: el copy aprobado solo da cifra para el
        // Private Speedboat. Los tramos siguen como los publica el tarifario.
        nombre: 'Speedboat Adventure',
        descripcion: 'With a stop at Mano Juan and Playa Toro',
        capacidad: 'Up to 10 guests (+US$ 140 per person from 11 up to 25)',
        tabla: [
          // [tarifa-v2] Corregido 2026-07-27: empezaba en `desde: 6` → 1-5
          // personas no encontraban tramo y el total salía null.
          { desde: 1, hasta: 6, precio: 1200, tipo: 'grupo' },
          { desde: 7, hasta: 7, precio: 1270, tipo: 'grupo' },
          { desde: 8, hasta: 8, precio: 1340, tipo: 'grupo' },
          { desde: 9, hasta: 9, precio: 1410, tipo: 'grupo' },
          { desde: 10, hasta: 10, precio: 1450, tipo: 'grupo' },
          { desde: 11, hasta: 25, precio: 140, tipo: 'persona' },
        ],
      },
      {
        id: 'catamaran',
        nombre: 'Catamaran',
        descripcion: 'The classic Caribbean sailing experience',
        capacidad: 'Up to 70 guests',
        tabla: [
          {
            desde: 1,
            hasta: 30,
            precio: 1950,
            tipo: 'grupo',
            extra: 'Optional meal: + US$ 45 per person',
          },
          { desde: 31, hasta: 70, precio: 105, tipo: 'persona' },
        ],
      },
    ],
    menuLight: [],
    menuPremium: [],
    // Formato buffet: 5 platos en la isla + add-on langosta al check-out.
    menuBuffet: {
      platos: [
        { nombre: 'Pasta salad', desc: 'With tomato, cucumber and vinaigrette' },
        { nombre: 'Lobster spaghetti' },
        { nombre: 'Grilled chicken' },
        { nombre: 'Pork chops' },
        { nombre: 'Tropical fruit' },
      ],
      // [2026-08-07] Igual que en el charter: `addOnId` ata la franja al add-on
      // 'langosta' del widget. La descripción decía «Added at checkout» y eso ya
      // no es verdad —se puede añadir aquí mismo—, así que cambia.
      addOn: {
        nombre: 'Premium lobster',
        precio: 30,
        descripcion: 'Lobster for everyone on board, on top of the buffet.',
        addOnId: 'langosta',
      },
    },
    // Galería de 11 fotos reales de la web del cliente
    // (images/excursions/saona-island-private/1..11.jpg, descargadas a
    // public/fotos/galeria-isla-saona-1..11.webp). La portada
    // (tour-isla-saona.webp) es la misma #1 — patrón actual: la 1ª celda del
    // mosaico es siempre la portada, igual que en los otros tours.
    galeriaCompleta: [
      'galeria-isla-saona-1',
      'galeria-isla-saona-2',
      'galeria-isla-saona-3',
      'galeria-isla-saona-4',
      'galeria-isla-saona-5',
      'galeria-isla-saona-6',
      'galeria-isla-saona-7',
      'galeria-isla-saona-8',
      'galeria-isla-saona-9',
      'galeria-isla-saona-10',
      'galeria-isla-saona-11',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'The Natural Pool with the giant starfish was the best part, and the buffet on the beach, incredible.',
    // [v3 2026-08-06] Traduccion NUESTRA: el documento del cliente no trae
    // itinerario de Saona, asi que se porta el que habia. Lo unico que cambia
    // ademas del idioma es el nombre de la variante que pasa por Mano Juan,
    // por el renombre aprobado.
    itinerario: [
      {
        hora: '8:05 AM',
        titulo: 'Hotel Pickup',
        texto:
          'Air-conditioned transportation from Bávaro / Punta Cana. Your exact time depends on your hotel and is confirmed after booking.',
      },
      {
        hora: '9:00 AM',
        titulo: 'Departure from Bayahibe',
        texto: 'Check in at the pier. Your chosen boat sets off: speedboat or catamaran.',
      },
      {
        hora: '~10:30 AM',
        titulo: 'Natural Pool at Las Palmillas',
        texto: 'Shallow turquoise water where you swim among giant starfish. Snack served in the water.',
      },
      {
        hora: '~12:00 PM',
        titulo: 'Buffet lunch at Catuano',
        texto:
          'On Saona Island (Catuano beach): pasta, lobster spaghetti, grilled chicken, pork chops and tropical fruit.',
      },
      {
        hora: '~2:00 PM',
        titulo: 'Beach time',
        texto:
          'Relax under the palm trees, in hammocks and Balinese beds. The Speedboat Adventure adds Mano Juan and Playa Toro.',
      },
      {
        hora: '4:00 PM',
        titulo: 'Return & hotel transfer',
        texto: 'Cruise back along the coast, arriving at your hotel at sunset.',
      },
    ],
    incluye: [
      { titulo: 'Round-Trip Transportation', texto: 'Air-conditioned pickup at your hotel, from Bávaro / Punta Cana.' },
      { titulo: 'The whole boat', texto: 'Speedboat or catamaran, depending on the option you choose.' },
      {
        titulo: 'Buffet lunch',
        texto: 'On the island: pasta, lobster spaghetti, grilled chicken, pork chops and tropical fruit.',
      },
      { titulo: 'Natural Pool', texto: 'Stop at Las Palmillas with giant starfish and a snack in the water.' },
    ],
    incluyeExtra: ['Wi-Fi on board', 'Snorkeling gear', 'Bilingual guide throughout the day'],
    // [v3 2026-08-07, pedido de Samuel] SIN «professional photographer (on
    // request, extra cost)», igual que en snorkel-lovers.
    noIncluido:
      'Not included: transportation from Casa de Campo (surcharge). Optional add-on at checkout: premium lobster (US$ 30/person).',
    queLlevar: [
      'Swimsuit',
      'Towel',
      'Reef-safe sunscreen',
      'Camera',
      'Cash (for the lobster add-on or tips)',
    ],
    recomendaciones: RECOMENDACIONES_V3,
    faqTour: [
      { p: 'How long is the full day?', r: '8 hours: departure at 9:00 AM, back at your hotel around 5:00 PM.' },
      {
        p: 'What is the difference between the three options?',
        r: 'The Private Speedboat is the fastest and most exclusive (up to 9 guests). The Speedboat Adventure adds stops at Mano Juan and Playa Toro. The Catamaran is the classic option for large groups (up to 70 guests).',
      },
      { p: 'Can I add premium lobster?', r: 'Yes, at checkout: US$ 30 per person.' },
      { p: 'What if it rains?', r: 'Full refund or a date change, at no cost.' },
      {
        p: 'Is there a minimum age for children?',
        r: 'No minimum age. We carry life jackets in every size on both the speedboat and the catamaran.',
      },
    ],
    tambienTeGusta: ['semi-private-premium', 'private-charter'],
    // [v2] Saona. La langosta SÍ está documentada en su web para los 3 botes
    // («Optional add-on during check-out: Lobster 30$US per person») y es el
    // único add-on por PERSONA: se marca una vez y multiplica por todo el
    // grupo (confirmado por el cliente en la reunión del 07-24).
    // La nota de marzo-junio es literal de su web — dato honesto que evita
    // una queja previsible, así que se porta tal cual.
    addOns: [
      {
        id: 'langosta',
        etiqueta: 'Add lobster for the whole group',
        descripcion:
          'Lobster for every person on board, on top of the buffet. Added when you book.',
        base: 'persona',
        precio: 30,
        nota: 'From March to June lobster may be unavailable; if so it is replaced with jumbo shrimp.',
      },
    ],
  },
})

/** WhatsApp del negocio. Número confirmado (PLAN-v3.md §12.9) — es el único
 *  enlace externo REAL de la ficha: el resto de destinos (funnel, listado,
 *  reserva-directa) viven en prototipo/ y van por EnlacePrototipo. */
export const WHATSAPP_URL = 'https://wa.me/18293052804'

/** [v2 2026-07-27] Todas las fotos de plato de una ficha, para el slider de la
 *  primera celda del mosaico (plan 01 §10 — «mini galería de fotos del menú»).
 *
 *  Se DERIVAN de los menús que la ficha ya declara (Light + Premium, o el menú
 *  del charter) en vez de mantener una lista aparte: si mañana cambia un plato,
 *  el slider y el bloque de menú siguen contando lo mismo. Se deduplica porque
 *  un plato puede repetirse entre paquetes.
 *
 *  Saona devuelve [] a propósito: su menú es BUFFET y no tiene platos con foto
 *  (`PlatoBuffet` ni siquiera tiene el campo). Sin fotos, el mosaico se pinta
 *  como siempre. */
export function fotosComidaDe(ficha: FichaTour): string[] {
  const platos = [
    ...ficha.menuPremium,
    ...ficha.menuLight,
    ...(ficha.menuCharter?.cartas.flatMap((c) => c.platos) ?? []),
  ]
  const fotos = platos
    .map((p) => ('foto' in p ? p.foto : undefined))
    .filter((f): f is string => typeof f === 'string')
  return Array.from(new Set(fotos))
}

/** Resuelve el precio total del tour. Funciona para los 3 modelos:
 *  - SubVariantes (Saona, v3 2026-07-17): busca el tramo que contiene
 *    `personas` en la tabla de la sub-variante; tramo 'grupo' es el total,
 *    'persona' se multiplica.
 *  - Tarifa dual (Snorkel Lovers, v3 2026-07-17): `adultos × precioLight +
 *    niños × precioNino` (+ upgrade si Premium en ambos casos — el menú
 *    Premium es el mismo para adultos y niños). Pasa por el objeto
 *    `rol` { adultos, ninos }.
 *  - Light/Premium clásico (semi-privado): `precioLight × personas`
 *    (+ upgrade si Premium).
 *  Devuelve `null` cuando no hay forma de calcularlo (charter cotiza a
 *  medida; consulta no tiene precio). El widget usa esto para pintar el
 *  precio del CTA y para mandar el total correcto al funnel. */
export function calcularTotalTour(
  ficha: FichaTour,
  varianteId: string | null,
  personas: number,
  precioLight: number | null,
  precioNino: number | null | undefined,
  paquete: 'light' | 'premium',
  rol?: { adultos: number; ninos: number },
): number | null {
  // SubVariantes: tramo por pax total (no por rol).
  if (ficha.subVariantes && ficha.subVariantes.length > 0) {
    const v = varianteId
      ? ficha.subVariantes.find((s) => s.id === varianteId) ?? ficha.subVariantes[0]
      : ficha.subVariantes[0]
    const t = v.tabla.find(
      (tr) => tr.desde <= personas && (tr.hasta === null || tr.hasta >= personas),
    )
    if (!t) return null
    return t.tipo === 'grupo' ? t.precio : t.precio * personas
  }
  if (precioLight === null) return null
  // Tarifa dual (Snorkel Lovers): adultos + niños × su tarifa.
  if (rol && precioNino !== null && precioNino !== undefined) {
    const upgrade = paquete === 'premium' ? ficha.upgradePremium ?? 0 : 0
    return (precioLight + upgrade) * rol.adultos + (precioNino + upgrade) * rol.ninos
  }
  // Light/Premium clásico.
  const upgrade = paquete === 'premium' ? ficha.upgradePremium ?? 0 : 0
  return (precioLight + upgrade) * personas
}
