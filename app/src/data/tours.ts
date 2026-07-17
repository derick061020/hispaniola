// Contenido de la FICHA de tour — portado de prototipo/datos.js (fuente
// canónica) y de prototipo/app.js (renderFicha, la implementación canónica:
// donde el wireframe y el prototipo difieren, manda el prototipo — ver
// app/PLAN-TOURS.md §0).
//
// Este archivo contiene SOLO lo que `data/home.ts` no tiene ya. Nada se
// duplica: la página une `TOURS` (nombre, precio, rating, chip, foto de
// portada) con `FICHAS` por slug. Si un campo vive en home.ts, se lee de allí.

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
export type PlatoMenu = { nombre: string; desc?: string; foto?: string }

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
          { desde: 9, hasta: 19, precio: 99, tipo: 'persona' },
          { desde: 20, hasta: 20, precio: 99, tipo: 'persona' },
        ],
      },
      {
        id: 'grandma',
        nombre: 'GrandMa',
        descripcion: 'Crucero ágil 3h · hasta 20 pax',
        capacidad: 'Hasta 20 personas',
        duracion: '3 horas',
        foto: 'flota-grandma',
        horarios: [
          { hora: '9:00 AM', regreso: '11:55 AM' },
          { hora: '12:00 PM', regreso: '2:55 PM' },
          { hora: '3:00 PM', regreso: '6:00 PM' },
        ],
        tabla: [
          { desde: 1, hasta: 20, precio: 825, tipo: 'grupo' },
        ],
      },
      {
        id: 'santa-maria',
        nombre: 'Santa Maria',
        descripcion: 'Crucero premium 4h · hasta 20 pax',
        capacidad: 'Hasta 20 personas (plated) o más con skewers',
        duracion: '4 horas',
        foto: 'flota-santa-maria',
        horarios: [
          { hora: '9:00 AM', regreso: '12:55 PM' },
          { hora: '2:00 PM', regreso: '6:00 PM' },
        ],
        tabla: [
          { desde: 1, hasta: 20, precio: 1150, tipo: 'grupo' },
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
        tabla: [
          { desde: 1, hasta: 18, precio: 1750, tipo: 'grupo' },
          { desde: 19, hasta: 25, precio: 85, tipo: 'persona' },
          { desde: 26, hasta: 29, precio: 2225, tipo: 'grupo' },
          { desde: 30, hasta: 120, precio: 75, tipo: 'persona' },
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
        capacidad: '6-9 personas (+US$ 130 pax adicional hasta 25)',
        tabla: [
          { desde: 6, hasta: 6, precio: 1100, tipo: 'grupo' },
          { desde: 7, hasta: 7, precio: 1160, tipo: 'grupo' },
          { desde: 8, hasta: 8, precio: 1220, tipo: 'grupo' },
          { desde: 9, hasta: 9, precio: 1340, tipo: 'grupo' },
          { desde: 10, hasta: 25, precio: 130, tipo: 'persona' },
        ],
      },
      {
        id: 'fishing',
        nombre: 'Fishing Town',
        descripcion: 'Con parada en Mano Juan y Playa Toro',
        capacidad: '6-10 personas (+US$ 140 pax adicional hasta 25)',
        tabla: [
          { desde: 6, hasta: 6, precio: 1200, tipo: 'grupo' },
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
  },
}

/** WhatsApp del negocio. Número confirmado (PLAN-v3.md §12.9) — es el único
 *  enlace externo REAL de la ficha: el resto de destinos (funnel, listado,
 *  reserva-directa) viven en prototipo/ y van por EnlacePrototipo. */
export const WHATSAPP_URL = 'https://wa.me/18293052804'

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
