import { TOURS, STATS, RESENAS_AGREGADO } from './home'

// ─────────────────────────────────────────────────────────────────────────────
//  Contenido de /por-que-reservar — la página que el cliente pidió detrás de
//  su insignia amarilla «¿POR QUÉ RESERVAR CON NOSOTROS? PRESIONE AQUÍ»
//  (correcciones v2, slides 50-56 del PDF; plan en
//  correcciones-v2-cliente/planes/07-por-que-reservar.md).
//
//  SUSTITUYE a la vieja /reserva-directa, que eran 30 líneas de hero + dos
//  boletos y se retiró entera (2026-07-28, Samuel: «está horrible»).
//
//  ⚠️ NO ES UNA PÁGINA PARA RETENER. El cliente fue explícito en la reunión
//  del 07-24 (33:30): «no es tampoco para que la gente se vaya mucho ahí, pero
//  sí que, si lo pinchan, que sepan por qué», y remató (33:52): «sobre todo
//  que haya mucho botón que vaya a la pestaña de Tours». Por eso cada bloque
//  cierra con su propia salida a /#tours y el contenido está pensado para
//  ESCANEARSE (fotos + cifras + tabla), no para leerse de corrido.
// ─────────────────────────────────────────────────────────────────────────────

/** El precio que la página defiende. Sale del catálogo (Snorkel Lovers, la
 *  tarifa adulto que también publica Viator), no de una constante suelta: si
 *  mañana cambia el precio del tour, cambia aquí y en el desglose a la vez. */
export const PRECIO_TODO_INCLUIDO =
  TOURS.find((t) => t.slug === 'snorkel-lovers')?.precioLight ?? 114

export type Kpi = { valor: string; label: string }

// Los 4 KPIs del hero (slide 52). El 3º no está aquí: es el SELLO real de
// TripAdvisor (ui/sello-tripadvisor.tsx), que ya dice «#1 en TripAdvisor · 7
// años seguidos» con la imagen del premio — una cifra de texto al lado del
// sello real sería decir lo mismo dos veces y con menos fuerza.
//
// ⚠️ CIFRAS: la maqueta del cliente pone 302.997 clientes / 4.466 días. El
// repo dice 91.607 / 4.454 (STATS, data/home.ts). No es un descuido de
// ninguno de los dos: la web actual del cliente SE CONTRADICE A SÍ MISMA
// desde la auditoría del 2026-07-13 — «90.498 clientes / 1.336 días» en el
// encabezado de why-book-with-us.php y «301.661 / 4.456» en el párrafo de
// debajo. Su maqueta tomó el par grande; el repo, el chico.
// Se pintan las de STATS a propósito: son las MISMAS que la home, así que en
// todo el sitio hay UNA sola verdad. Poner 302.997 aquí mientras la home dice
// 91.607 sería peor que cualquiera de las dos por separado. Si Fernando
// confirma las grandes, se cambian en STATS y se propagan solas.
export const KPIS: Kpi[] = [
  { valor: STATS[0].valor, label: STATS[0].label },
  { valor: STATS[1].valor, label: STATS[1].label },
  // useGrouping: 'always' — el español pone el separador de millares a partir
  // de 5 cifras (minimumGroupingDigits = 2), así que sin esto 1782 se pinta
  // «1782» y el resto del sitio dice «1.782» (footer, flota, reseñas).
  {
    valor: RESENAS_AGREGADO.rating,
    label: `${RESENAS_AGREGADO.total.toLocaleString('es-ES', { useGrouping: 'always' })} reseñas`,
  },
]

export type ConceptoSuelto = {
  id: string
  nombre: string
  /** qué es, en 3-5 palabras — para que el precio no vaya desnudo */
  nota: string
  /** lo que costaría contratarlo por separado, en US$ */
  importe: number
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  fotoAlt: string
}

// «Lo que pagarías suelto» (slide 53) — la mejor idea del PowerPoint del
// cliente, y la que cierra un hueco que la auditoría detectó el PRIMER día del
// proyecto (2026-07-11): «Viator vende el mismo tour al mismo precio → falta
// bloque why book direct». El sitio llevaba desde entonces diciendo «reserva
// directo» sin demostrar NUNCA en dinero por qué.
//
// ⚠️ SON PRECIOS DE REFERENCIA DEL MERCADO, NO FACTURAS NUESTRAS, y la letra
// pequeña del bloque lo dice: si alguien audita el «almuerzo de mariscos US$
// 50» y le parece generoso, el argumento entero se vuelve en contra. Una cifra
// con su origen declarado es más creíble que una cifra desnuda. Pendiente de
// que Fernando confirme que cada importe es defendible.
//
// La suma NO se escribe: se calcula en el componente. Si mañana cambia un
// concepto, el total y el ahorro se recalculan solos y no pueden contradecir
// a la lista de arriba.
export const CONCEPTOS_SUELTOS: ConceptoSuelto[] = [
  {
    id: 'charter',
    nombre: 'Charter de 4 h',
    nota: 'Barco, tripulación, bebidas y picadera',
    importe: 75,
    foto: 'hero-catamaran-1',
    fotoAlt: 'Catamarán de Hispaniola navegando frente a la costa de Bávaro',
  },
  {
    id: 'snorkel',
    nombre: 'Salida de snorkel',
    nota: 'Equipo, guía y parada en el arrecife',
    importe: 30,
    foto: 'galeria-semi-privado-4',
    fotoAlt: 'Huésped haciendo snorkel entre peces sargento sobre el arrecife',
  },
  {
    id: 'almuerzo',
    nombre: 'Almuerzo de mariscos',
    nota: 'Hecho a bordo, en la cocina flotante',
    importe: 50,
    foto: 'plato-mariscos',
    fotoAlt: 'Plato de mariscos —langosta, pulpo y camarón— recién hecho a bordo',
  },
  {
    id: 'bebidas',
    nombre: 'Bebidas de marca',
    nota: 'Ron añejo, cerveza nacional, refrescos',
    importe: 10,
    foto: 'bar-flotante',
    fotoAlt: 'La barra del catamarán durante el servicio de bebidas',
  },
  {
    id: 'coco-loco',
    nombre: 'Coco Loco en la playa',
    nota: 'El cóctel típico, en la parada de playa',
    importe: 5,
    foto: 'galeria-charter-privado-4',
    fotoAlt: 'El catamarán fondeado frente a una playa de palmeras',
  },
  {
    id: 'fotos',
    nombre: 'Fotos del tour',
    nota: 'Todo el día, GoPro incluida en el snorkel',
    importe: 20,
    foto: 'galeria-snorkel-lovers-9',
    fotoAlt: 'Familia en cubierta durante una actividad del tour',
  },
]

export type FilaCaraACara = {
  concepto: string
  nosotros: string
  otros: string
  /** Foto REAL de lo nuestro, cuando la hay. Sin ella la fila va sólo con
   *  texto — y no pasa nada: cuatro de las seis la tienen, que es suficiente
   *  para que el bloque se vea, y rellenar las otras dos con una foto que no
   *  es de eso sería peor que dejarlas sin foto.
   *  ⚠️ La columna «otros tours» NO lleva foto NUNCA. No tenemos fotos de la
   *  competencia y no se inventan: ese lado es un hueco rayado a propósito. */
  foto?: string
  fotoAlt?: string
}

// Tabla «Nosotros vs. los otros tours» (slide 54), con UNA corrección: la fila
// «cocina a bordo» venía VACÍA en las dos columnas de su maqueta. Es un
// descuido de la IA con la que la hizo, y justo ahí está el argumento más
// fuerte que tiene la empresa — la única cocina flotante de Punta Cana. Se
// rellena, no se copia el hueco.
export const CARA_A_CARA: FilaCaraACara[] = [
  {
    concepto: 'Mariscos',
    nosotros: 'Frescos del día',
    otros: 'Congelados',
    foto: 'plato-mariscos',
    fotoAlt: 'Plato de mariscos —langosta, pulpo y camarón— recién hecho a bordo',
  },
  {
    concepto: 'Bebidas',
    nosotros: 'De marca, sin diluir',
    otros: 'Diluidas',
    foto: 'bar-flotante',
    fotoAlt: 'La barra del catamarán durante el servicio de bebidas',
  },
  {
    concepto: 'Cocina a bordo',
    nosotros: 'La única cocina flotante de Punta Cana',
    otros: 'Comida recalentada',
    foto: 'cocina-flotante',
    fotoAlt: 'La parrilla de la cocina flotante en funcionamiento',
  },
  {
    concepto: 'Fotos del tour',
    nosotros: 'Incluidas, también las del snorkel',
    otros: 'Se cobran aparte',
    foto: 'galeria-snorkel-lovers-9',
    fotoAlt: 'Familia en cubierta durante una actividad del tour',
  },
  // Las dos sin foto van al final a propósito: así el bloque ABRE con cuatro
  // duelos que se ven y remata con dos que se leen, en vez de intercalar
  // huecos entre las fotos y parecer que faltan imágenes.
  { concepto: 'Traslado al hotel', nosotros: 'Bus con aire acondicionado', otros: 'Vehículo abierto' },
  { concepto: 'Reserva', nosotros: 'Directa con el propietario', otros: 'Por intermediario' },
]

export type GrupoRazones = {
  id: string
  titulo: string
  /** el titular del grupo — lo que se lee cuando NO se leen las razones */
  resumen: string
  razones: string[]
  /** nombre de archivo en /fotos (sin extensión). Sin foto = tile tipográfico. */
  foto?: string
  fotoAlt?: string
}

// Las 19 razones del slide 55 — las 19, porque el cliente las quiere todas,
// pero AGRUPADAS en 5 bloques temáticos con foto en vez de un muro de 19 cards
// iguales.
//
// Por qué agrupadas, que no es capricho: en la v3 se ELIMINÓ la sección
// «Diferenciadores» de la home con este razonamiento (pages/home.tsx): «sus 4
// verdades ya se decían todas antes y su número editorial gigante repetía el
// de IncluyeCrucero justo encima». Y del diagnóstico del hero cargado salió el
// principio general: «un hero cargado casi siempre es N lenguajes de confianza
// compitiendo → una prueba por trabajo». 19 cards seguidas es exactamente eso
// en formato lista: nadie las lee, se ven como una pared y se saltan. Además
// varias se solapaban en su propia maqueta («la mejor ubicación» y «en el
// centro de la zona hotelera» son la misma; «sin mareos» es consecuencia de la
// ubicación).
export const RAZONES: GrupoRazones[] = [
  {
    id: 'comida',
    titulo: 'La comida',
    resumen: 'La única cocina flotante de Punta Cana, cocinando mientras navegas.',
    foto: 'cocina-flotante',
    fotoAlt: 'La parrilla de la cocina flotante en funcionamiento',
    razones: [
      'Mariscos frescos, nunca congelados',
      'Solo bebidas de marca, sin diluir',
      'Plataforma de cocina certificada',
      'Se cocina a bordo, no se recalienta',
    ],
  },
  {
    id: 'barco',
    titulo: 'El barco',
    resumen: 'Catamaranes propios, con sitio de sobra y todo en regla.',
    foto: 'flota-forever-teresa',
    fotoAlt: 'El catamarán Forever Teresa de la flota de Hispaniola',
    razones: [
      'Semi-privado de verdad: máximo 25 en un barco para 70',
      'Barcos limpios y bien mantenidos',
      'Plataforma de acceso: fácil subir y bajar',
      'Baños limpios a bordo',
      'Sin mareos, apto para toda la familia',
    ],
  },
  {
    id: 'ubicacion',
    titulo: 'La ubicación',
    resumen: 'En el centro de la zona hotelera, con el arrecife a un paso.',
    foto: 'galeria-snorkel-lovers-3',
    fotoAlt: 'Estructuras del vivero de coral de Cabeza de Toro rodeadas de peces',
    razones: [
      'En el centro de la zona hotelera',
      'Traslados en bus con aire acondicionado',
      'Snorkel en un vivero de coral real, no en cualquier punto',
    ],
  },
  {
    id: 'reserva',
    titulo: 'El precio y la reserva',
    resumen: 'Hablas con el propietario. No hay comisión que pagar en medio.',
    razones: [
      'Reserva directa con el propietario',
      'Fotos del tour incluidas',
      'Excursión de medio día: te queda la tarde libre',
    ],
  },
  {
    id: 'personas',
    titulo: 'Las personas y el planeta',
    resumen: 'Empresa legal, tripulación bien pagada y un arrecife que crece.',
    // Foto REAL de huéspedes en el agua junto al catamarán. Aquí NO sirve
    // equipo-capitan (el retrato de la tripulación): es un recorte de estudio
    // sobre fondo liso, y en una cabecera de card a sangre se lee como un
    // pegote de stock justo en el bloque que habla de las personas.
    foto: 'galeria-semi-privado-6',
    fotoAlt: 'Grupo de huéspedes en el agua junto al catamarán de Hispaniola',
    razones: [
      'Legal y asegurada, con todas las licencias',
      'Respetuosos con el medio ambiente',
      'Salario justo a nuestro personal',
      'Equipo multilingüe',
    ],
  },
]

/** Las 19 se cuentan, no se escriben — si mañana se añade o se quita una, el
 *  titular de la sección no se queda mintiendo. */
export const TOTAL_RAZONES = RAZONES.reduce((s, g) => s + g.razones.length, 0)

// El cierre del slide 56. «Cabeza de Toro» (el repo) y «Cabo Engaño» (la
// maqueta) conviven en el propio texto del cliente —«Cabeza de Toro, un parque
// natural en las aguas cristalinas del Cabo Engaño»— y así se mantienen: el
// arrecife es Cabeza de Toro, la punta es Cabo Engaño.
//
// El argumento de la ubicación como VENTAJA competitiva no estaba dicho en
// ninguna parte del sitio, y «no pierdes hora y media en bus» es una objeción
// real de comprador que hoy no contesta nadie.
export const UBICACION = {
  eyebrow: 'Ubicación, ubicación, ubicación',
  titulo: 'El mejor punto de la costa — sin viajes eternos',
  texto:
    'Te llevamos a Cabeza de Toro, un parque natural en las aguas cristalinas del Cabo Engaño: el mejor arrecife de la zona para hacer snorkel. Y salimos del centro de la zona hotelera, así que el día empieza cuando subes al barco.',
  /** El dato que hace de titular visual del bloque. */
  cifra: '1½ h',
  cifraLabel: 'de bus que no pierdes antes de empezar',
  claves: [
    'Dentro del arrecife: aguas tranquilas, sin mareos',
    'Buen mar todo el año',
    'A minutos de tu hotel, no al otro lado de la isla',
  ],
  foto: 'arrecife-fondo-cenital',
  fotoAlt: 'Vista aérea del arrecife de Cabeza de Toro con el agua turquesa del Cabo Engaño',
} as const

export const CIERRE = {
  eyebrow: '¿Listo?',
  titulo: 'Nos vemos en la playa',
  texto:
    'Reserva directo con nosotros y recibe todo esto por un precio justo. Sin intermediarios, sin sorpresas — solo el mejor día en el mar de Punta Cana.',
  letraPequena: 'Empresa legal y asegurada · todas las licencias turísticas de Punta Cana-Bávaro',
  foto: 'hero-catamaran-2',
  fotoAlt: 'Catamarán de Hispaniola al atardecer frente a la costa de Punta Cana',
} as const
