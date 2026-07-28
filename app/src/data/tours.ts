// Contenido de la FICHA de tour — portado de prototipo/datos.js (fuente
// canónica) y de prototipo/app.js (renderFicha, la implementación canónica:
// donde el wireframe y el prototipo difieren, manda el prototipo — ver
// app/PLAN-TOURS.md §0).
//
// Este archivo contiene SOLO lo que `data/home.ts` no tiene ya. Nada se
// duplica: la página une `TOURS` (nombre, precio, rating, chip, foto de
// portada) con `FICHAS` por slug. Si un campo vive en home.ts, se lee de allí.

import type { AddOn } from '@/lib/tarifas'

export type PasoItinerario = { hora: string; titulo: string; texto: string }

/** Horario publicado del tour. SIN `quedan N` a propósito: el aforo restante
 *  depende de que el motor (xpotours) lo exponga por API — decisión pendiente
 *  del cliente. Prometer "quedan 9" sin dato real es urgencia inventada
 *  (analisis/revision-wireframes.md §2.7). El dato vive en el paso 1 del
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
  addOn?: { nombre: string; precio: number; descripcion?: string }
}

/** Menú transversal del charter (los 7 platos + 1 add-on de langosta).
 *  Cuando `ficha` tiene `menuCharter`, MenuTour pinta una lista con los
 *  7 platos + un card de add-on. El menú NO cambia al cambiar de bote
 *  — es transversal a los 4 botes (Maite, GrandMa, Santa Maria, Forever
 *  Teresa). Charter es el único caso actual. */
export type MenuCharterTour = {
  platos: { nombre: string; desc?: string }[]
  addOn?: { nombre: string; precio: number; descripcion?: string }
}

export type FichaTour = {
  tituloLargo: string
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
  incluye: BeneficioIncluido[]
  /** «También incluye»: el resto de lo que trae el tour más allá de los 4
   *  titulares (WiFi, aperitivos, barra flotante…). Portado de la web. */
  incluyeExtra?: string[]
  noIncluido: string
  /** Qué llevar (traje de baño, cámara, toalla, protector, efectivo). Portado
   *  de la web. [] si no aplica (Saona, sin datos). */
  queLlevar: string[]
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
  /** [v2 2026-07-27] Extras opcionales que el widget vende como UPSELL.
   *  Portados del tarifario real (TARIFARIO-WEB-ORIGINAL.md §4-C). El texto
   *  del álbum de fotos cambia por producto a propósito: en charter ya
   *  regalan «todas» las fotos, así que ahí solo se vende la máxima calidad
   *  — prometer «el álbum completo» sería falso. */
  addOns?: AddOn[]
}

export const FICHAS: Record<string, FichaTour> = {
  'semi-privado': {
    tituloLargo: 'Semi-Privado Premium — catamarán solo adultos',
    audiencia: 'Solo adultos',
    duracion: '4 horas',
    descripcionLarga: [
      'Una excursión semi-privada solo para adultos: navegamos a no más del 35% de la capacidad del barco, para que el servicio sea personalizado y te sientas un VIP — no un número en un tour masivo.',
      'Zarpamos desde Bávaro y navegamos por la costa hasta Cabo Engaño, donde empieza el mar Caribe. En el arrecife de Cabeza de Toro, nuestra bióloga marina te explica el proyecto de jardinería de coral —uno de los 3 más grandes de República Dominicana—, creado en 2016 por la Fundación Ecológica Los Arrecifes de Bávaro.',
      'Después, una playa desierta con coco-loco (con o sin alcohol) y una piscina natural de aguas poco profundas con estructuras de arrecife artificial, ideal para principiantes. La comida se prepara al momento en nuestra cocina flotante — nada de buffet recalentado.',
    ],
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM' },
      { hora: '1:00 PM', regreso: '5:00 PM' },
    ],
    upgradePremium: 15,
    // Menú POR PAQUETE, portado de la web aprobada. Light: 2 platos a la
    // parrilla. Premium: 7 platos — los 4 con foto real (plato-*) + 3 de solo
    // texto (lasañas y cóctel, sin asset en /fotos).
    menuLight: [
      { nombre: 'Pechuga de pollo a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-chicken-bodegon' },
      { nombre: 'Filete de pescado a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: [
      { nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
      { nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
      { nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
      { nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
      { nombre: 'Lasaña vegetariana', foto: 'plato-lasagna-vegetariana' },
      { nombre: 'Lasaña con pechuga de pollo', foto: 'plato-lasagna-pollo' },
      { nombre: 'Cóctel de mariscos', foto: 'plato-coctel-mariscos' },
    ],
    galeriaCompleta: [
      'galeria-semi-privado-1',
      'galeria-semi-privado-2',
      'galeria-semi-privado-3',
      'galeria-semi-privado-4',
      'galeria-semi-privado-5',
      'galeria-semi-privado-6',
      'galeria-semi-privado-7',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'El coral fue lo mejor del viaje — la bióloga nos explicó todo.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bávaro',
        texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.',
      },
      {
        hora: '~9:45',
        titulo: 'Snorkel en el vivero de coral',
        texto:
          'Arrecife de Cabeza de Toro: proyecto de restauración top-3 de RD, explicado por nuestra bióloga marina.',
      },
      { hora: '~11:00', titulo: 'Playa desierta + coco-loco', texto: 'Cóctel en coco real (con o sin alcohol).' },
      {
        hora: '~11:45',
        titulo: 'Piscina natural + comida a bordo',
        texto: 'Agua a 1,2 m — apto para principiantes. Tu plato, recién hecho en la cocina flotante.',
      },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Snorkel en el vivero de coral', texto: 'Equipo sanitizado (todas las tallas) + guía en el arrecife de Cabeza de Toro.' },
      { titulo: 'Transporte ida y vuelta', texto: 'Vehículo con AC, desde tu hotel.' },
      { titulo: 'Comida + barra libre', texto: 'Cocina flotante; cerveza, ron añejo, vodka, jugos, refrescos y agua.' },
      { titulo: 'Bióloga marina', texto: 'Te explica el proyecto de restauración del coral.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Aperitivos: croissants de fruta, pavo y queso',
      'Barra flotante «Coyote» en la piscina natural',
      'Fotos gratis subidas a Facebook',
    ],
    noIncluido:
      'No incluido: álbum de fotos HD (US$ 20/grupo vía Dropbox) · fotógrafo profesional (con aviso previo, costo extra) · suplemento de transporte desde Casa de Campo.',
    queLlevar: ['Traje de baño', 'Toalla', 'Protector solar biodegradable', 'Cámara', 'Efectivo (si pagas el saldo a bordo)'],
    faqTour: [
      { p: '¿Y si llueve?', r: 'Reembolso total o cambio de fecha, sin costo.' },
      { p: '¿Hay baño a bordo?', r: 'Sí, todos nuestros barcos tienen baño.' },
      { p: '¿Puedo ir si no sé nadar?', r: 'Sí, el snorkel es en aguas poco profundas y con chaleco disponible.' },
      {
        p: '¿Traigo efectivo? ¿cuánto?',
        r: 'Solo si eliges pagar el depósito del 25% — el saldo restante, con 5% de descuento si es en efectivo.',
      },
    ],
    tambienTeGusta: ['snorkel-lovers', 'charter-privado'],
    // [v2 2026-07-27] Las 4 ventajas del comparador (slide 17) y de la caja de
    // upsell del widget (slide 5). Salen de menuPremium/incluye de esta misma
    // ficha: langosta y Angus están en los platos Premium, la variedad de 7 vs
    // 2 es aritmética de los propios arrays, y las fotos incluidas están en la
    // web original. Nada inventado.
    ventajasPremium: [
      'Langosta, Angus certificado y Surf & Turf en el plato',
      '7 platos a elegir en vez de 2',
      'Opciones vegetarianas y cóctel de mariscos',
      'Las fotos del tour, incluidas',
    ],
    // [v2] Upsells del semi-privado. El álbum es el único que la web original
    // documenta aquí literalmente («the full album via Dropbox for just $20
    // per group»). Aquí SÍ se puede decir «álbum completo»: lo gratis son
    // «los mejores momentos», no todas las fotos.
    addOns: [
      {
        id: 'album-fotos',
        etiqueta: 'El álbum completo, en máxima calidad',
        descripcion:
          'El álbum entero del día, en resolución original y sin recortar, por US$ 20 para todo el grupo.',
        base: 'grupo',
        precio: 20,
        porDefecto: true,
      },
    ],
  },

  'snorkel-lovers': {
    tituloLargo: 'Snorkel Lovers — catamarán para toda la familia',
    audiencia: 'Familias',
    duracion: '4 horas',
    descripcionLarga: [
      'Snorkel Lovers es la versión para familias del Semi-Privado: el mismo catamarán, el mismo arrecife de Cabeza de Toro con el proyecto de restauración top-3 de República Dominicana, y la misma cocina flotante — pero con un ritmo pensado para que los niños disfruten sin apuro.',
      'La bióloga marina adapta la explicación del vivero de coral al nivel de cada edad: los más pequeños descubren los peces de colores, los más grandes entienden el trabajo de restauración. En el agua, los chalecos infantiles son obligatorios y se ajustan a todas las tallas — incluso si nadie del grupo sabe nadar, el snorkel es en aguas poco profundas (1,2 m) y la piscina natural de estructuras de arrecife artificial.',
      'El menú es el mismo de la casa, con o sin alcohol a elección: cerveza, ron añejo y vodka para los adultos, jugos y refrescos para los niños. La langosta del menú Premium se sustituye por langostino salvaje de marzo a junio (veda).',
    ],
    horarios: [
      { hora: '9:00 AM', regreso: '1:00 PM' },
      { hora: '1:00 PM', regreso: '5:00 PM' },
    ],
    // v3 (2026-07-17, pedido de Samuel: «quitar la opción de premium/light,
    // dejar los 8 menús»): la web del cliente NO publica Premium para
    // snorkel-lovers — solo Adulto 114 / Niño 65 como tarifa única. El
    // menúLight queda VACÍO a propósito (no se borra del modelo: el widget
    // y MenuTour lo detectan y ocultan la opción). El menúPremium pasa a
    // ser EL menú del tour (sin nombre "Premium", renombrado a "Tu menú"
    // en MenuTour cuando no hay menuLight). Para semi-privado, en cambio,
    // sigue con menuLight + menuPremium (la web sí publica el upgrade).
    upgradePremium: null,
    // dejar los 8 menús»): la web del cliente NO publica Premium para
    // snorkel-lovers — solo Adulto 114 / Niño 65 como tarifa única. El
    // menúLight queda VACÍO a propósito (no se borra del modelo: el widget
    // y MenuTour lo detectan y ocultan la opción). El menúPremium pasa a
    // ser EL menú del tour (sin nombre "Premium", renombrado a "Tu menú"
    // en MenuTour cuando no hay menuLight). Para semi-privado, en cambio,
    // sigue con menuLight + menuPremium (la web sí publica el upgrade).
    // v3 fix (2026-07-17, pedido de Samuel): el refactor a "solo Adulto
    // 114 / Niño 65" deja menuLight vacio A PROPOSITO, pero el widget
    // y el funnel de la ficha AUN no estan actualizados a ese modelo
    // (siguen aceptando y mostrando paquete=light). Hasta que se
    // termine el refactor, restaurar menuLight para que el paso 2
    // del funnel de snorkel-lovers tenga platos que mostrar cuando
    // el usuario entra con ?paquete=light.
    menuLight: [
      { nombre: 'Pechuga de pollo a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-chicken-bodegon' },
      { nombre: 'Filete de pescado a la parrilla', desc: 'Con papas y vegetales', foto: 'plato-fish-bodegon' },
    ],
    menuPremium: [
      { nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
      { nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
      { nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
      { nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
      { nombre: 'Lasaña vegetariana', foto: 'plato-lasagna-vegetariana' },
      { nombre: 'Lasaña con pechuga de pollo', foto: 'plato-lasagna-pollo' },
      { nombre: 'Cóctel de mariscos', foto: 'plato-coctel-mariscos' },
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
        desc: 'Hamburguesa, tiras de pollo, salchicha y papas fritas',
        foto: 'plato-kids-meal',
        soloNinos: true,
      },
    ],
    // v3 (2026-07-17, web del cliente): 18 fotos reales de la excursión
    // familiar (la web tenía `images/excursions/educational/{4,5,7,8,10,11,
    // 13,14,16,17,20,21,22,23,24,25,26,27}.jpg`). Antes 9 — faltaban las
    // 9 últimas. Descargadas y reencodeadas a WEBP quality 85 (~50-170 KB).
    galeriaCompleta: [
      'galeria-snorkel-lovers-1',
      'galeria-snorkel-lovers-2',
      'galeria-snorkel-lovers-3',
      'galeria-snorkel-lovers-4',
      'galeria-snorkel-lovers-5',
      'galeria-snorkel-lovers-6',
      'galeria-snorkel-lovers-7',
      'galeria-snorkel-lovers-8',
      'galeria-snorkel-lovers-9',
      'galeria-snorkel-lovers-10',
      'galeria-snorkel-lovers-11',
      'galeria-snorkel-lovers-12',
      'galeria-snorkel-lovers-13',
      'galeria-snorkel-lovers-14',
      'galeria-snorkel-lovers-15',
      'galeria-snorkel-lovers-16',
      'galeria-snorkel-lovers-17',
      'galeria-snorkel-lovers-18',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'Perfecto para ir con los niños, todos se sintieron seguros.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bávaro',
        texto: 'Check-in en instalaciones privadas y navegación por la costa hasta Cabo Engaño.',
      },
      {
        hora: '~9:45',
        titulo: 'Snorkel educativo en el vivero',
        texto: 'Guía adaptada para principiantes y niños, con chalecos para todas las tallas.',
      },
      {
        hora: '~11:00',
        titulo: 'Playa desierta + coco-loco',
        texto: 'Cóctel en coco real (sin alcohol para los niños).',
      },
      {
        hora: '~11:45',
        titulo: 'Piscina natural + comida a bordo',
        texto: 'Agua poco profunda, ideal para primeras veces en el mar.',
      },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Equipo de snorkel', texto: 'Todas las tallas, incluidas infantiles.' },
      { titulo: 'Transporte ida y vuelta', texto: 'Vehículo con AC, desde tu hotel.' },
      { titulo: 'Comida + barra libre', texto: 'Cocina flotante; jugos y refrescos para todos, sin alcohol para menores.' },
      { titulo: 'Guía de snorkel', texto: 'Explicación adaptada a todas las edades.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Aperitivos: croissants de fruta, pavo y queso',
      'Barra flotante «Coyote» en la piscina natural',
      'Fotos gratis subidas a Facebook',
    ],
    noIncluido:
      'No incluido: álbum de fotos HD (US$ 20/grupo vía Dropbox) · fotógrafo profesional (con aviso previo, costo extra) · suplemento de transporte desde Casa de Campo.',
    queLlevar: ['Traje de baño', 'Toalla', 'Protector solar biodegradable', 'Cámara', 'Efectivo (si pagas el saldo a bordo)'],
    faqTour: [
      {
        p: '¿Desde qué edad pueden ir los niños?',
        r: 'No hay edad mínima — llevamos chalecos de todas las tallas, incluidas infantiles.',
      },
      { p: '¿Hay chalecos infantiles?', r: 'Sí, para todas las edades y tamaños.' },
      { p: '¿Puedo ir si no sé nadar?', r: 'Sí, el snorkel es en aguas poco profundas y con chaleco disponible.' },
      {
        p: '¿Traigo efectivo? ¿cuánto?',
        r: 'Solo si eliges pagar el depósito del 25% — el saldo restante, con 5% de descuento si es en efectivo.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado'],
    // [v2] Snorkel Lovers. La web original NO ofrece aquí el álbum, pero
    // Samuel decidió el 07-27 extenderlo a los 6 productos: la política del
    // negocio es uniforme y son sus otras páginas las que no lo tienen escrito.
    addOns: [
      {
        id: 'album-fotos',
        etiqueta: 'El álbum completo, en máxima calidad',
        descripcion:
          'El álbum entero del día, en resolución original y sin recortar, por US$ 20 para todo el grupo.',
        base: 'grupo',
        precio: 20,
        porDefecto: true,
      },
    ],
  },

  'charter-privado': {
    tituloLargo: 'Charter Privado — el barco entero para tu grupo',
    audiencia: 'Tu grupo',
    duracion: '3-4 horas',
    descripcionLarga: [
      'El Charter Privado es el barco entero para tu grupo — familia, amigos, empresa o celebración. Eliges uno de nuestros 4 botes según el tamaño del grupo y el plan: Maite (4h, hasta 20 pax), GrandMa (3h, hasta 20 pax), Santa Maria (4h, hasta 20 pax, o más con skewers) o Forever Teresa (3h o 4h, hasta 120 pax).',
      'La ruta es la misma que los otros tours: navegación desde Bávaro hasta Cabeza de Toro, snorkel en el vivero de coral del proyecto top-3 de RD, parada en la playa desierta con coco-loco y comida a bordo de la cocina flotante. Lo que cambia es el barco (capacidad y tarifa según pax) y el menú, que coordinamos contigo: 7 platos a elegir (seafood, meat, surf & turf, vegetarian, chicken/beef/shrimp skewers) y langosta premium como add-on opcional al check-out.',
      'Para grupos grandes (más de 20 pax), Forever Teresa es la opción: hasta 120 personas con un servicio tipo buffet en cubierta. La coordinación se hace con una persona dedicada, de principio a fin — sin sobresaltos.',
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
        descripcion: 'Crucero íntimo 4h · hasta 20 pax',
        capacidad: '8-20 personas',
        duracion: '4 horas',
        foto: 'flota-maite',
        horarios: [
          { hora: '9:00 AM', regreso: '1:00 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        tabla: [
          { desde: 1, hasta: 8, precio: 625, tipo: 'grupo', extra: '+ US$ 25 por persona para comida y transporte' },
          { desde: 9, hasta: 20, precio: 99, tipo: 'persona' },
        ],
      },
      {
        id: 'grandma',
        nombre: 'GrandMa',
        descripcion: 'Crucero ágil 3h · hasta 20 pax',
        capacidad: 'Hasta 50 personas',
        duracion: '3 horas',
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
        descripcion: 'Crucero premium 4h · hasta 20 pax',
        capacidad: 'Hasta 45 personas (plated hasta 20, skewers desde 21)',
        duracion: '4 horas',
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
          { desde: 1, hasta: 13, precio: 1000, tipo: 'grupo', extra: '+ US$ 25 por persona para comida y transporte' },
          { desde: 14, hasta: 45, precio: 99, tipo: 'persona' },
        ],
      },
      {
        id: 'forever-teresa',
        nombre: 'Forever Teresa',
        descripcion: 'Catamarán grande 3h/4h · hasta 120 pax',
        capacidad: '1-120 personas (precios por tramo)',
        duracion: '3 horas (también 4h, consultar)',
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
        descripcion: 'Catamarán grande 4h · hasta 120 pax',
        capacidad: '1-120 personas (precios por tramo)',
        duracion: '4 horas',
        foto: 'flota-forever-teresa',
        horarios: [
          { hora: '9:00 AM', regreso: '12:55 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        tabla: [
          { desde: 1, hasta: 18, precio: 1600, tipo: 'grupo', extra: '+ US$ 25 por persona para comida y transporte' },
          { desde: 19, hasta: 25, precio: 110, tipo: 'persona' },
          { desde: 26, hasta: 28, precio: 2775, tipo: 'grupo', extra: '+ US$ 25 por persona para comida y transporte' },
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
      platos: [
        { nombre: 'Seafood', desc: 'Langosta, pulpo, camarón' },
        { nombre: 'Meat', desc: 'Angus certificado' },
        { nombre: 'Surf & Turf', desc: 'Langosta + Angus' },
        { nombre: 'Vegetarian', desc: 'Ceviche de zucchini' },
        { nombre: 'Chicken Skewers' },
        { nombre: 'Beef Skewers' },
        { nombre: 'Shrimp Skewers' },
      ],
      addOn: {
        nombre: 'Lobster premium',
        precio: 30,
        descripcion: 'Disponible al hacer check-out, US$ 30 por persona',
      },
    },
    galeriaCompleta: [
      'galeria-charter-privado-1',
      'galeria-charter-privado-2',
      'galeria-charter-privado-3',
      'galeria-charter-privado-4',
      'galeria-charter-privado-5',
      'galeria-charter-privado-6',
      'galeria-charter-privado-7',
    ],
    videoGaleria: '/video/hero.mp4',
    quoteDestacada: 'Coordinaron todo a nuestra medida, el barco entero para la familia.',
    itinerario: [
      { hora: '8:05', titulo: 'Recogida en tu hotel', texto: 'Transporte con AC. La hora exacta según tu hotel y el horario del bote.' },
      { hora: '9:00', titulo: 'Zarpamos desde Bávaro', texto: 'Check-in en el muelle y navegación por la costa hasta Cabeza de Toro.' },
      { hora: '~9:45', titulo: 'Snorkel en el vivero de coral', texto: 'El proyecto top-3 de RD, guiado por nuestra bióloga marina.' },
      { hora: '~11:00', titulo: 'Playa desierta + coco-loco', texto: 'Cóctel en coco real, para y fotos.' },
      { hora: '~11:45', titulo: 'Piscina natural + comida a bordo', texto: 'Tu plato a medida, recién hecho en la cocina flotante.' },
      { hora: '13:00', titulo: 'Regreso y traslado al hotel', texto: '' },
    ],
    incluye: [
      { titulo: 'Barco entero', texto: 'Sin desconocidos a bordo — el barco es solo para tu grupo.' },
      { titulo: 'Transporte ida y vuelta', texto: 'AC, desde tu hotel (Bávaro / Punta Cana).' },
      { titulo: 'Comida a medida', texto: '7 platos a elegir entre seafood, meat, surf & turf, vegetarian y skewers.' },
      { titulo: 'Coordinación dedicada', texto: 'Una persona de principio a fin — sin sobresaltos.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Equipo de snorkel (todas las tallas)',
      'Bióloga marina como guía en el arrecife',
      'Fotos gratis subidas a Facebook',
    ],
    noIncluido:
      'No incluido: langosta premium (US$ 30 pax, add-on opcional al check-out) · transporte desde Casa de Campo (suplemento) · fotógrafo profesional (con aviso previo, costo extra).',
    queLlevar: [
      'Traje de baño',
      'Toalla',
      'Protector solar biodegradable',
      'Cámara',
      'Efectivo (para el add-on de langosta o propinas)',
    ],
    faqTour: [
      { p: '¿Cuántas personas caben en cada bote?', r: 'Maite 8-20 pax · GrandMa hasta 20 pax · Santa Maria hasta 20 pax (más con skewers) · Forever Teresa hasta 120 pax.' },
      { p: '¿Cuál es el mínimo de personas?', r: 'Maite parte de 1 pax (la tarifa de US$ 625 cubre hasta 8). Los demás no tienen mínimo formal — consulta por WhatsApp para grupos de menos de 6 pax.' },
      { p: '¿Puedo elegir el menú?', r: 'Sí — coordinamos los 7 platos contigo (seafood, meat, surf & turf, vegetarian, chicken/beef/shrimp skewers). Langosta premium como add-on opcional.' },
      { p: '¿Aceptan pagos corporativos?', r: 'Sí, ver la página de Empresas y MICE para facturación formal.' },
      { p: '¿Y si llueve?', r: 'Reembolso total o cambio de fecha, sin costo.' },
    ],
    tambienTeGusta: ['semi-privado', 'snorkel-lovers'],
    // [v2] Charter privado. OJO con el texto del álbum: la web original de
    // este tour promete que «TODAS las fotos» se suben gratis a Facebook, así
    // que aquí NO se puede vender «el álbum completo» — solo la máxima
    // calidad. Si no, contradice lo que ellos mismos prometen.
    addOns: [
      {
        id: 'album-fotos',
        etiqueta: 'Tus fotos en máxima calidad',
        descripcion:
          'Los archivos originales, sin comprimir y en máxima resolución, por US$ 20 para todo el grupo.',
        base: 'grupo',
        precio: 20,
        porDefecto: true,
      },
    ],
  },

  'isla-saona': {
    tituloLargo: 'Isla Saona — día completo, elige tu bote',
    audiencia: 'Día completo',
    duracion: 'Día completo (8 horas)',
    descripcionLarga: [
      'Isla Saona es la excursión estrella del Caribe Dominicano: playas de arena blanca, aguas turquesas y una piscina natural donde te rodean estrellas gigantes. Zarpamos temprano desde Bayahibe y pasamos el día entero entre Catuano, Las Palmillas y (en la variante Fishing Town) el pueblo de pescadores de Mano Juan.',
      'Eliges CÓMO llegar: en speedboat privado (la forma más rápida y exclusiva, hasta 9 personas), en catamarán (la experiencia clásica, hasta 70) o en lancha rápida con parada en el pueblo de pescadores de Mano Juan y Playa Toro. Las tres variantes incluyen el buffet típico en la isla y la piscina natural de Las Palmillas con estrellas gigantes.',
      'El día cierra con regreso por la costa al atardecer. Es la única excursión full-day del catálogo — todo el resto son medios días.',
    ],
    horarios: [{ hora: '9:00 AM', regreso: '4:00 PM' }],
    // Sin Light/Premium (Saona se diferencia por BOTE, no por menú). El widget
    // detecta `subVariantes` y pinta un segmented control de botes en vez del
    // toggle clásico. `menuBuffet` cambia el formato del bloque de menú.
    upgradePremium: null,
    subVariantes: [
      {
        id: 'speedboat',
        nombre: 'Speedboat',
        descripcion: 'La forma más rápida y exclusiva',
        capacidad: 'Hasta 10 personas (+US$ 130 por persona desde 11, hasta 25)',
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
          { desde: 10, hasta: 10, precio: 1340, tipo: 'grupo' },
          { desde: 11, hasta: 25, precio: 130, tipo: 'persona' },
        ],
      },
      {
        id: 'fishing',
        nombre: 'Fishing Town',
        descripcion: 'Con parada en Mano Juan y Playa Toro',
        capacidad: 'Hasta 10 personas (+US$ 140 por persona desde 11, hasta 25)',
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
        nombre: 'Catamarán',
        descripcion: 'La experiencia clásica, hasta 70 personas',
        capacidad: '1-70 personas',
        tabla: [
          {
            desde: 1,
            hasta: 30,
            precio: 1950,
            tipo: 'grupo',
            extra: '+ US$ 45 por persona para comida y transporte',
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
        { nombre: 'Pasta salad', desc: 'Con tomate, pepino y vinagreta' },
        { nombre: 'Spaghetti con langosta' },
        { nombre: 'Pollo a la parrilla' },
        { nombre: 'Chuletas de cerdo' },
        { nombre: 'Frutas tropicales' },
      ],
      addOn: {
        nombre: 'Langosta premium',
        precio: 30,
        descripcion: 'Disponible al hacer check-out, US$ 30 por persona',
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
    quoteDestacada: 'La piscina natural con las estrellas gigantes fue lo mejor — y el buffet en la playa, increíble.',
    itinerario: [
      {
        hora: '8:05',
        titulo: 'Recogida en tu hotel',
        texto: 'Transporte con AC desde Bávaro / Punta Cana. La hora exacta según tu hotel — se confirma al reservar.',
      },
      {
        hora: '9:00',
        titulo: 'Zarpamos desde Bayahibe',
        texto: 'Check-in en el muelle. Sale tu variante elegida: speedboat, lancha rápida o catamarán.',
      },
      {
        hora: '~10:30',
        titulo: 'Piscina natural de Las Palmillas',
        texto: 'Aguas turquesas poco profundas donde nadas con estrellas gigantes. Snack en el agua.',
      },
      {
        hora: '~12:00',
        titulo: 'Almuerzo buffet en Catuano',
        texto: 'En Isla Saona (playa de Catuano): pasta, spaghetti con langosta, pollo, chuletas y frutas.',
      },
      {
        hora: '~14:00',
        titulo: 'Tiempo en la playa',
        texto: 'Relax bajo cocoteros, hamacas y camas balinesas. La variante Fishing Town añade Mano Juan y Playa Toro.',
      },
      {
        hora: '16:00',
        titulo: 'Regreso y traslado al hotel',
        texto: 'Navegación de vuelta por la costa, llegada al hotel al atardecer.',
      },
    ],
    incluye: [
      { titulo: 'Transporte ida y vuelta', texto: 'Recogida en tu hotel con AC, desde Bávaro / Punta Cana.' },
      { titulo: 'Bote completo', texto: 'Speedboat, lancha rápida o catamarán, según la variante que elijas.' },
      { titulo: 'Almuerzo buffet', texto: 'En la isla: pasta, spaghetti con langosta, pollo, chuletas y frutas.' },
      { titulo: 'Piscina natural', texto: 'Parada en Las Palmillas con estrellas gigantes, snack en el agua.' },
    ],
    incluyeExtra: [
      'WiFi a bordo',
      'Equipo de snorkel',
      'Guía bilingüe durante toda la excursión',
    ],
    noIncluido:
      'No incluido: langosta premium (US$ 30 pax, add-on opcional al check-out) · fotógrafo profesional (con aviso previo, costo extra) · transporte desde Casa de Campo (suplemento).',
    queLlevar: [
      'Traje de baño',
      'Toalla',
      'Protector solar biodegradable',
      'Cámara',
      'Efectivo (para el add-on de langosta o propinas)',
    ],
    faqTour: [
      { p: '¿Cuánto dura el día completo?', r: '8 horas: salida 9:00 AM, regreso a tu hotel ~5:00 PM.' },
      {
        p: '¿Cuál es la diferencia entre las 3 variantes?',
        r: 'Speedboat es la más rápida y exclusiva (6-9 pax). Fishing Town añade parada en Mano Juan y Playa Toro. Catamarán es la opción clásica para grupos grandes (hasta 70 pax).',
      },
      { p: '¿Puedo añadir langosta premium?', r: 'Sí, al hacer check-out: US$ 30 por persona.' },
      {
        p: '¿Y si llueve?',
        r: 'Reembolso total o cambio de fecha, sin costo.',
      },
      {
        p: '¿Desde qué edad pueden ir los niños?',
        r: 'No hay edad mínima — llevamos chalecos de todas las tallas en speedboat y catamarán.',
      },
    ],
    tambienTeGusta: ['semi-privado', 'charter-privado'],
    // [v2] Saona. La langosta SÍ está documentada en su web para los 3 botes
    // («Optional add-on during check-out: Lobster 30$US per person») y es el
    // único add-on por PERSONA: se marca una vez y multiplica por todo el
    // grupo (confirmado por el cliente en la reunión del 07-24).
    // La nota de marzo-junio es literal de su web — dato honesto que evita
    // una queja previsible, así que se porta tal cual.
    addOns: [
      {
        id: 'langosta',
        etiqueta: 'Súbele langosta a todo el grupo',
        descripcion:
          'Langosta para cada persona a bordo, además del buffet. Se añade al reservar.',
        base: 'persona',
        precio: 30,
        nota: 'De marzo a junio la langosta puede no estar disponible; en ese caso se sustituye por camarón gigante.',
      },
      {
        id: 'album-fotos',
        etiqueta: 'El álbum completo, en máxima calidad',
        descripcion:
          'El álbum entero del día, en resolución original y sin recortar, por US$ 20 para todo el grupo.',
        base: 'grupo',
        precio: 20,
        porDefecto: true,
      },
    ],
  },
}

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
  const platos = [...ficha.menuPremium, ...ficha.menuLight, ...(ficha.menuCharter?.platos ?? [])]
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
