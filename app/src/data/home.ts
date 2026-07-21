// Contenido de la home — portado de prototipo/datos.js (fuente canónica).
// Solo se incluyen los campos que la HOME usa; el resto de la ficha de tour
// (itinerario, incluye, FAQ propia…) no es parte de este build (ver PLAN.md).

import { WHATSAPP_URL } from '@/data/tours'

export type Tour = {
  slug: string
  nombre: string
  audienciaChip: string
  duracionCorta: string
  rating: number
  resenas: number
  /** null = sin tope publicado */
  maxPax: number | null
  /** null = sin precio fijo (se cotiza o se consulta) */
  precioLight: number | null
  /** Snorkel Lovers v3 (2026-07-17): tarifa infantil cuando el tour vende
   *  por adulto+niño (la web del cliente publica 2 precios separados solo
   *  para este tour familiar — US$ 114 adulto / US$ 65 niño). Ausente en
   *  el resto: el widget pinta 1 stepper «Personas» con `precioLight ×
   *  personas` (modelo clásico). Cuando está presente, el widget pinta 2
   *  steppers «Adultos» + «Niños» y calcula el total como
   *  `adultos × precioLight + niños × precioNino`. El Premium (+upgrade) se
   *  suma a AMBOS — el menú Premium es el mismo plato, no hay tarifa
   *  infantil diferenciada en la web. */
  precioNino?: number | null
  booking: 'completo' | 'cotizacion' | 'consulta'
  descripcionCorta: string
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  /** v3-F20 (§18): galería real del servicio (varios /fotos) para el carrusel
   *  de la card del grid. Solo la tienen los 3 productos del escaparate
   *  (semi-privado, snorkel-lovers, charter-privado); Isla Saona no tiene
   *  galería → se queda FUERA del grid (pero sigue en ticker/megamenú/footer/
   *  móvil, que solo usan `foto`). */
  galeria?: string[]
  /** v3-F20: 3 «incluye» cortos, chips de la card. Portados VERBATIM de los
   *  títulos de `incluye` de prototipo/datos.js (no inventados). */
  destacados?: string[]
}

export const TOURS: Tour[] = [
  {
    slug: 'semi-privado',
    nombre: 'Semi-Privado Premium',
    audienciaChip: 'Solo adultos',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    maxPax: 25,
    precioLight: 99,
    booking: 'completo',
    descripcionCorta:
      'Snorkel en vivero de coral con bióloga marina, playa desierta con coco-loco y comida hecha a bordo. Máximo 25 personas en un barco para 70.',
    foto: 'tour-semi-privado',
    galeria: [
      'galeria-semi-privado-1',
      'galeria-semi-privado-2',
      'galeria-semi-privado-3',
      'galeria-semi-privado-4',
      'galeria-semi-privado-5',
    ],
    destacados: ['Equipo de snorkel', 'Comida + bebidas', 'Bióloga marina'],
  },
  {
    slug: 'snorkel-lovers',
    nombre: 'Snorkel Lovers',
    audienciaChip: 'Todas las edades',
    duracionCorta: '4 h',
    rating: 4.9,
    resenas: 1782,
    // v3 (2026-07-17): el «Max. Capacity: 30» de la web del cliente + precio
    // tarifa dual Adulto US$ 114 / Niño US$ 65 (la web publica 2 tarifas
    // separadas solo para este tour familiar — el resto del catálogo es 1
    // precio por persona). El widget detecta `precioNino` y pinta 2 steppers
    // «Adultos» + «Niños» con icono Baby en el de niños.
    maxPax: 30,
    precioLight: 114,
    precioNino: 65,
    booking: 'completo',
    descripcionCorta:
      'La versión familiar del Semi-Privado: mismo vivero de coral, misma cocina flotante, para que niños y adultos disfruten juntos el día en el mar.',
    foto: 'tour-snorkel-lovers',
    galeria: [
      'galeria-snorkel-lovers-1',
      'galeria-snorkel-lovers-2',
      'galeria-snorkel-lovers-3',
      'galeria-snorkel-lovers-4',
      'galeria-snorkel-lovers-5',
    ],
    destacados: ['Equipo de snorkel', 'Comida + bebidas', 'Guía de snorkel'],
  },
  {
    slug: 'charter-privado',
    nombre: 'Charter Privado',
    audienciaChip: 'Grupo privado',
    duracionCorta: '3-4 h',
    rating: 4.9,
    resenas: 1782,
    maxPax: 120,
    // v3 (2026-07-17, charter completo): ancla "desde" — el precio público
    // más bajo de la tabla es US$ 75/pax (Forever Teresa 30-120 pax). El
    // widget pinta 4 sub-variantes (Maite, GrandMa, Santa Maria, Forever
    // Teresa) y el cálculo real se hace con la tabla de cada bote según
    // pax. booking pasa de 'cotizacion' a 'completo' (4 botes, no se
    // cotiza aparte — el cliente puede ver y calcular el precio en el
    // widget; el "a medida" del menú sí se coordina aparte).
    precioLight: 75,
    booking: 'completo',
    descripcionCorta:
      'El barco completo, solo para tu grupo. Elige uno de nuestros 4 botes (Maite, GrandMa, Santa Maria, Forever Teresa) según el tamaño y el plan.',
    foto: 'tour-charter-privado',
    galeria: [
      'galeria-charter-privado-1',
      'galeria-charter-privado-2',
      'galeria-charter-privado-3',
      'galeria-charter-privado-4',
      'galeria-charter-privado-5',
    ],
    destacados: ['Barco entero', 'Menú a medida', 'Coordinación dedicada'],
  },
  {
    slug: 'isla-saona',
    nombre: 'Isla Saona',
    // v3 (2026-07-17, petición de Samuel al reemerger como producto completo):
    // Saona deja de ser "pendiente de confirmar" y se publica con su contenido
    // real de la web del cliente. Pasa de booking 'consulta' a 'completo'
    // (3 sub-variantes: speedboat / fishing town / catamarán — ver
    // FICHAS['isla-saona'].subVariantes en data/tours.ts). precioLight es la
    // ancla "desde" en el widget: el speedboat para 6 pax son US$ 1.100 grupo,
    // ~US$ 184 por persona. Es un ancla visual (no un precio por persona real,
    // porque Saona se vende por GRUPO — el widget lo recalcula por tramo al
    // elegir variante y pax).
    audienciaChip: 'Día completo',
    duracionCorta: 'día completo',
    rating: 4.9,
    resenas: 1782,
    maxPax: 70,
    precioLight: 184,
    booking: 'completo',
    descripcionCorta:
      'Día completo navegando a Isla Saona: elige speedboat, catamarán o lancha con parada en Mano Juan. Piscina natural con estrellas gigantes y buffet en la isla.',
    foto: 'tour-isla-saona',
    galeria: [
      'galeria-isla-saona-1',
      'galeria-isla-saona-2',
      'galeria-isla-saona-3',
      'galeria-isla-saona-4',
      'galeria-isla-saona-5',
    ],
    destacados: ['Speedboat o catamarán', 'Piscina natural + buffet', 'Día completo'],
  },
]

export const bookingCta: Record<Tour['booking'], string> = {
  completo: 'Reservar',
  cotizacion: 'Cotizar',
  consulta: 'Consultar',
}

export type Plato = { id: string; nombre: string; desc: string; foto: string }

export const PLATOS: Plato[] = [
  { id: 'mariscos', nombre: 'Mariscos', desc: 'Langosta, pulpo, camarón', foto: 'plato-mariscos' },
  { id: 'carne', nombre: 'Carne', desc: 'Angus certificado', foto: 'plato-carne' },
  { id: 'surf-turf', nombre: 'Surf & Turf', desc: 'Langosta + Angus', foto: 'plato-surf-turf' },
  { id: 'vegetariano', nombre: 'Vegetariano', desc: 'Ceviche de zucchini', foto: 'plato-vegetariano' },
]

export type Ocasion = {
  tipo: string
  nombre: string
  meta: string
  /** landings propias (Bodas, MICE) vs. deep-link al formulario del hub de eventos */
  esLanding: boolean
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  /** slug de la landing real (/eventos/:slug) — solo las 2 con esLanding.
   *  «Eventos y party boat» (el ítem genérico) va al formulario del hub, que
   *  vive en el prototipo. */
  slug?: string
}

// LOS 3 EVENTOS de la web actual, en su mismo orden (decisión de Samuel
// 2026-07-17, mapa-del-sitio.md §"EVENTS & CELEBRATIONS"): la web vieja tiene
// SOLO 3 ítems de evento — «Events & Party Boat», «Pre-Post Wedding
// Celebrations» y «MICE» — así que la nueva no debe inventar más. Las 3
// tienen ahora landing propia (los 3 slugs en español son consistentes con el
// resto del sitio, ver PLAN-EVENTOS.md). Anteriormente el genérico
// «Eventos y party boat» iba al formulario del hub — ahora tiene su landing
// `/eventos/party-boat` (clone de ficha de tour con widget de cotización),
// que es lo que pidió Samuel el 2026-07-17.
//
// Bodas y MICE ya correspondían 1:1 al viejo y conservan su landing propia
// (migradas de la plantilla de "persuasión" a la nueva de "clon de tour").
//
// Fotos PROVISIONALES: no existe shooting propio de eventos, así que se
// reutilizan fotos reales de la galería de charter-privado que mejor encajan
// con cada ocasión. Pendiente pedirle al cliente fotos reales de eventos
// (ver app/PLAN-v3.md §9).
export const OCASIONES: Ocasion[] = [
  {
    tipo: 'eventos',
    nombre: 'Eventos y party boat',
    meta: 'Cumpleaños, aniversarios, despedidas y reuniones. Barco entero.',
    esLanding: true,
    foto: 'galeria-charter-privado-2',
    slug: 'party-boat',
  },
  {
    tipo: 'boda',
    nombre: 'Bodas y pre-boda',
    meta: 'Ceremonia, welcome party o despedida del grupo.',
    esLanding: true,
    foto: 'galeria-charter-privado-5',
    slug: 'bodas',
  },
  {
    tipo: 'mice',
    nombre: 'Corporativo / MICE',
    meta: 'Incentivos, team building, cierres de convención.',
    esLanding: true,
    foto: 'galeria-charter-privado-3',
    slug: 'empresas',
  },
]

export type EventoEspecial = {
  id: string
  nombre: string
  meta: string
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  /** solo Bodas tiene landing real (/eventos/:slug); el resto va a
   *  EnlacePrototipo, igual que la ocasión genérica de OCASIONES. */
  slug?: string
}

// Sección «Special Events» del final de la home actual (4 boxes: Birthdays,
// Weddings, Anniversaries, Bachelor Experience — hispaniolaaquaticadventures.com/
// index.php), traducida fiel y condensada a una línea por evento (mismo
// criterio de síntesis que OCASIONES/INCLUYE_CRUCERO). NO es lo mismo que
// OCASIONES: aquella son las 3 categorías del megamenú/hub de eventos; esta
// es la vitrina visual de 4 boxes que la home actual muestra al final de la
// página. Fotos PROVISIONALES (mismo criterio que OCASIONES): reutilizan la
// galería real de charter-privado, no hay shooting propio de eventos.
export const EVENTOS_ESPECIALES: EventoEspecial[] = [
  {
    id: 'cumpleanos',
    nombre: 'Cumpleaños',
    meta: 'Fiesta a bordo con familia y amigos — buena comida y barra libre nacional.',
    foto: 'galeria-charter-privado-2',
  },
  {
    id: 'bodas',
    nombre: 'Bodas',
    meta: 'El día más importante de tu vida, tan perfecto como un catamarán lo puede hacer.',
    foto: 'galeria-charter-privado-5',
    slug: 'bodas',
  },
  {
    id: 'aniversarios',
    nombre: 'Aniversarios',
    meta: 'Celebra tu próximo aniversario en el agua y hazlo un año inolvidable.',
    foto: 'galeria-charter-privado-3',
  },
  {
    id: 'despedidas',
    nombre: 'Despedidas de soltero/a',
    meta: 'Barra libre, gran comida y música — la escapada perfecta antes de la boda.',
    foto: 'galeria-charter-privado-6',
  },
]

export type IncluyeItem = { id: string; titulo: string; texto: string }

// Sección «Incluye» (v3-F19) — portado del bloque "...all our cruises include:"
// de la HOME de la web actual (9 ítems), traducido fiel. Se QUITA el 9º
// ("Service — Award winning VIP Service and for sure lots of fun") por
// decisión de Samuel (2026-07-15): con 8 la sección queda en 2 columnas
// parejas de 4 cards a cada lado del catamarán. Donde datos.js ya tenía
// vocabulario para el mismo concepto (coco-loco, cocina flotante, vivero de
// coral) se usa ese, no una segunda traducción. Los "($)" de la web actual
// (transporte, fotos HD) no se copian: ese matiz ya vive en `noIncluido` de
// cada tour (fotos HD US$ 20 · suplemento desde Casa de Campo).
// El icono se mapea por `id` en incluye-crucero.tsx (presentación, no
// contenido — así este archivo sigue sin importar React).
export const INCLUYE_CRUCERO: IncluyeItem[] = [
  { id: 'snorkel', titulo: 'Snorkel', texto: 'Experiencia increíble en un vivero de coral real. Todo el equipo incluido.' },
  { id: 'transporte', titulo: 'Transporte', texto: 'Ida y vuelta desde tu hotel, en bus cómodo con aire acondicionado.' },
  { id: 'entretenimiento', titulo: 'Entretenimiento a bordo', texto: 'Música, actividades y una tripulación cercana y con energía.' },
  { id: 'wifi', titulo: 'WiFi', texto: 'WiFi a bordo durante toda la excursión.' },
  { id: 'comida', titulo: 'Comida fresca', texto: 'Frutas, mini-croissants y mariscos recién hechos en la cocina flotante.' },
  { id: 'bebidas', titulo: 'Bebidas', texto: 'Cerveza nacional, ron añejo de 7 años, vodka, jugo de naranja y refrescos.' },
  { id: 'playa', titulo: 'Playa desierta', texto: 'Parada con coco-loco (el cóctel típico) y coco para comer.' },
  { id: 'fotos', titulo: 'Fotos', texto: 'De todo el tour, con GoPro también en el snorkel — se descargan de nuestro Facebook sin costo.' },
]

export function formatoDinero(n: number | null): string {
  if (n === null) return '—'
  return 'US$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export type ItemNav = {
  id: string
  nombre: string
  descripcion: string
  /** ruta real (Link SPA) — sin ella el ítem es placeholder del prototipo */
  to?: string
}

// Nosotros (PLAN-v3.md §12.2) — fuente: TRIPULACION (4 roles) + FLOTA (3
// entradas) del prototipo para el primer ítem. El segundo, "El arrecife que
// reconstruimos", ya NO cuenta la historia en el menú: es solo una MENCIÓN +
// botón a /sostenibilidad, donde vive toda la info (conservación, coral,
// tortugas, los 7 videos). Sostenibilidad tuvo brevemente su propio tab en el
// menú principal (2026-07-17); se revirtió el mismo día (Samuel: "quita
// sostenibilidad del menú principal, porque ya lo tenemos en nosotros como
// subtab") — este ítem es ahora su ÚNICA entrada en la navegación principal
// (desktop y móvil). El icono se mapea por `id` en item-menu.tsx (presentación,
// no contenido — así este archivo no importa React).
export const NAV_NOSOTROS: ItemNav[] = [
  {
    id: 'tripulacion',
    nombre: 'La tripulación y la flota',
    descripcion: 'Capitán, bióloga marina, chef a bordo y guía de snorkel. Dos catamaranes y la cocina flotante.',
    to: '/nosotros',
  },
  {
    id: 'arrecife',
    nombre: 'El arrecife que reconstruimos',
    descripcion: 'Mira la página de Sostenibilidad para toda la historia.',
    to: '/sostenibilidad',
  },
]

// Ayuda (PLAN-v3.md §12.2) — FAQ_CATEGORIAS del prototipo: 6 categorías, 14
// preguntas (contadas). "Contacto" (ya no "Contacto y WhatsApp", decisión de
// Samuel 2026-07-14) lleva a la página /contacto del prototipo — WhatsApp
// con horario, teléfono, email y formulario, no solo el enlace directo a
// WhatsApp que tenía antes.
// 4º ítem (2026-07-17, pedido de Samuel): "Guías" deja de ser su propio tab
// en el nav principal y entra aquí como subtab — rellena de paso la 4ª
// celda que antes se dejaba vacía a propósito (decisión de Samuel, ya no
// aplica con 4 ítems).
// 5º ítem (2026-07-17, pedido de Samuel): "Gestionar mi reserva" — entra
// a la página /mi-reserva donde el cliente edita su menú/recogida/contacto
// o paga el saldo. Es la pieza que faltaba para cerrar el ciclo post-
// checkout sin obligar al cliente a escribir por WhatsApp.
export const NAV_AYUDA: ItemNav[] = [
  {
    id: 'faq',
    nombre: 'Preguntas frecuentes',
    descripcion: '14 preguntas: reservas y pagos, qué llevar, comida, clima, niños.',
    to: '/faq',
  },
  {
    id: 'guias',
    nombre: 'Guías de Punta Cana',
    descripcion: '5 artículos: cómo elegir tour, qué llevar, mejor época para navegar.',
    to: '/guias',
  },
  {
    id: 'contacto',
    nombre: 'Contacto',
    descripcion: 'WhatsApp, teléfono y formulario. Respondemos en minutos, de 8:00 a 20:00.',
    to: '/contacto',
  },
  {
    id: 'mi-reserva',
    nombre: 'Gestionar mi reserva',
    descripcion: 'Edita tu menú, recogida o datos con tu código HSP-XXXX-NNNN.',
    to: '/mi-reserva',
  },
]

// Cinta de confianza — vivía enterrada en la ficha del wireframe (ver
// NOTAS['home-stats'] del prototipo). v3-F11: sube al hero, entre el
// subtítulo y el CTA (PLAN-v3.md §14).
export type Stat = { valor: string; label: string }
export const STATS: Stat[] = [
  { valor: '91.607', label: 'clientes felices' },
  { valor: '4.454', label: 'días navegados' },
  // v3-F13 (PLAN-v3.md §15.7): "de la capacidad del barco" (24 car.) partía en
  // 2 líneas contra los otros 3 labels — "aforo" ya es vocabulario del
  // proyecto (aforo máx. en las cards del ticker y en el megamenú de Tours),
  // no introduce una palabra nueva. El dato no cambia (≤35% de
  // NOTAS['home-stats']).
  { valor: '≤35%', label: 'del aforo del barco' },
  { valor: '0', label: 'plástico a bordo' },
]

export type Premio = {
  id: string
  /** Texto del premio — es el `alt` de la imagen: describe lo que el badge DICE,
   *  porque el badge es una imagen y su contenido no es texto seleccionable. */
  nombre: string
  /** nombre de archivo en /premios (sin extensión) */
  foto: string
  /** Dimensiones intrínsecas del webp — van al <img> para reservar el hueco y
   *  que la cinta no dé un salto de layout (CLS) al cargar los 7 logos. */
  ancho: number
  alto: number
}

// Los 7 premios reales de la web actual (imágenes descargadas de
// hispaniolaaquaticadventures.com/images/awards/, no stock ni recreaciones).
//
// La auditoría (analisis/auditoria-web-actual.md §"Señales de confianza") los
// marcó como ACTIVO DESAPROVECHADO: en la web actual viven frente al hero en
// imágenes pequeñas de baja resolución, sin números que los acompañen. Aquí
// suben a la cinta de stats, que es justo la sección de "demostrar" — los
// premios al lado de las cifras (91.607 clientes, 4.9★) se refuerzan entre sí.
//
// ⚠️ Siguen SIN enlaces verificables (la otra mitad de la crítica de la
// auditoría): no tenemos las URLs de los perfiles/premios y no se inventan.
// Pendiente pedírselas al cliente (ver app/PLAN-v3.md §9).
export const PREMIOS: Premio[] = [
  {
    id: 'tripadvisor',
    nombre: 'TripAdvisor — #1 en actividades acuáticas de Bávaro / Punta Cana durante más de 7 años',
    foto: 'premio-tripadvisor',
    ancho: 222,
    alto: 82,
  },
  {
    id: 'weddingwire',
    nombre: "WeddingWire — Couples' Choice Awards 2018-2021",
    foto: 'premio-weddingwire',
    ancho: 128,
    alto: 128,
  },
  {
    id: 'ltg',
    nombre: 'LTG Global Awards 2021/22 — Ganador: Aquatic Tour Operator of the Year, República Dominicana',
    foto: 'premio-ltg',
    ancho: 318,
    alto: 128,
  },
  // TripAdvisor y los Viator: nativo 82px / 109px de alto — no llegan a 128
  // (2× de --spacing-premio-alto), así que se exportan a su nativo y NO se
  // upscalean (PLAN-v3.md §14.4, Trampa №11). Pendiente pedirle al cliente
  // los assets en alta (§9).
  { id: 'viator-2022', nombre: 'Viator Experience Award 2022', foto: 'premio-viator-2022', ancho: 95, alto: 109 },
  { id: 'viator-2023', nombre: 'Viator Experience Award 2023', foto: 'premio-viator-2023', ancho: 95, alto: 109 },
  { id: 'viator-2024', nombre: 'Viator Experience Awards 2024', foto: 'premio-viator-2024', ancho: 95, alto: 109 },
  {
    id: 'luxury-travel-guide',
    nombre: 'Luxury Travel Guide — The Americas Awards 2016, Ganador: Tour Operator of the Year, Punta Cana',
    foto: 'premio-luxury-travel-guide',
    ancho: 387,
    alto: 128,
  },
]

// ─────────────────────────────────────────────────────────────────────────
// Sección "Experiencia" (bajo la banda de premios) — v3-F18, pedido de Samuel.
//
// El copy es una SÍNTESIS del bloque real de la web actual
// (hispaniolaaquaticadventures.com, "Punta Cana's most complete catamaran
// experience"): 6 párrafos en inglés condensados a 3 frases + un cierre, en
// español (el resto de la home ya es español). NO es copy inventado: es el
// mismo argumento del cliente, resumido.
// ⚠️ Pendiente reconciliar con datos.js (fuente canónica): este texto todavía
// no vive allí (ver CLAUDE.md — copy se porta de datos.js).
//
// v3-F21 (Samuel, 2026-07-16): esta sección ya no solo PROMETE el "no es un
// party boat" — ahora también lo PRUEBA. La prueba vivía en «Diferenciadores»,
// que se ELIMINÓ por redundante: sus 4 verdades ya se decían todas antes
// (coral → aquí + cards de tour + Incluye 01 + reseña de Jessica M.; cocina
// flotante → aquí + Incluye 05 + cards; ≤35% de aforo y 0 plástico → son STATS
// DEL HERO, literales). Además llegaba 3 secciones después de la promesa
// —cuando ToursGrid, WhyDirect e Incluye ya la habían cerrado— y repetía el
// número editorial gigante de IncluyeCrucero (01/…08/) justo debajo de él.
//
// Lo ÚNICO que no vivía en ninguna otra parte de la home era el top-3 de
// restauración de coral → se rescata AQUÍ, en la que era la línea más vaga
// ("rincones que las rutas de siempre no visitan", algo que cualquier catamarán
// de Bávaro podría escribir). Así la frase más débil pasa a cargar el dato más
// duro sin sumar scroll, y encaja con la 1ª foto del collage (el vivero).
// Portado de datos.js: "Arrecife de Cabeza de Toro: proyecto de restauración
// top-3 de RD". El topónimo va en GRIS a propósito — lo que resalta es la
// AFIRMACIÓN (top-3), no el nombre del sitio; así la línea conserva sus 2
// segmentos `fuerte` y no se rompe el ritmo gris/negro.
// ⚠️ La bióloga marina no se repite aquí: ya vive en el chip y la descripción
// de las cards de tour, y en la reseña de Jessica M.
// ⚠️ La auditoría (analisis/auditoria-web-actual.md §7) añade que el proyecto
// está "avalado por Ministerio de Medio Ambiente" — dato fuerte, pero NO está
// en datos.js y no se inventa. Pendiente confirmarlo con el cliente
// (app/PLAN-v3.md §9); si se confirma, su sitio natural es esta misma frase.
//
// Cada frase es un array de segmentos: `fuerte` = navy, resalta; si no, gris
// (navy-sub). El alternado gris/negro del "texto grande" es la referencia que
// aportó Samuel ("Who we are" de Journeo). Cada frase es un bloque para que el
// reveal de scroll (use-experiencia-scroll.ts) las escalone una a una.
export type SegmentoNarrativa = { t: string; fuerte?: boolean }

export const EXPERIENCIA_NARRATIVA: SegmentoNarrativa[][] = [
  [
    { t: 'No es solo un paseo en barco.', fuerte: true },
    { t: ' Es una experiencia caribeña ' },
    { t: 'cuidada al detalle.', fuerte: true },
  ],
  [
    { t: 'Navegamos al arrecife de Cabeza de Toro — uno de los ' },
    { t: '3 mayores proyectos de restauración de coral del país', fuerte: true },
    { t: ' — y comes lo que se ' },
    { t: 'cocina a bordo, recién hecho.', fuerte: true },
  ],
  [
    { t: 'Desde que llegas, ' },
    { t: 'te tratamos como familia', fuerte: true },
    { t: ' — nunca como un pasajero más.' },
  ],
]

export const EXPERIENCIA_KICKER = 'Sin costes ocultos. Sin barcos abarrotados.'

// El VIDEO de la sección Experiencia (correcciones v1 del cliente,
// 2026-07-20 — planes/01-home.md slide 7: «agregar efecto de video como este
// [six2eight.com] y poner el video del popup inicial aquí dado que a
// Fernando le gusta mucho ese video»).
//
// Sustituye al collage de 3 fotos reales que vivía aquí (EXPERIENCIA_FOTOS,
// con su hover de grupo en componentes.css). El collage entero se retiró en
// el mismo commit para no dejar cadáveres — si el cliente se arrepiente, se
// recupera con un `git revert` de ese commit.
//
// Es EL MISMO asset que el fondo del hero (/video/hero.mp4): el video
// promocional del cliente, el que hasta ahora se auto-abría en el popup de
// bienvenida que el slide 2 manda eliminar. Un asset, dos usos, cero popups.
// El poster es una foto real de la galería, no un frame inventado.
export type VideoExperiencia = { src: string; poster: string; alt: string }

export const EXPERIENCIA_VIDEO: VideoExperiencia = {
  src: '/video/hero.mp4',
  poster: '/fotos/galeria-snorkel-lovers-2.webp',
  alt: 'Un día a bordo de un catamarán de Hispaniola: navegación, snorkel y comida hecha al momento',
}

/** Card del ticker del hero. Son DOS especies, no una: el tour se compra (tiene
 *  precio, duración y aforo) y la ocasión se cotiza (no tiene precio publicado).
 *  La unión discriminada lo hace explícito → 2 variantes del componente Figma. */
export type TickerItem =
  | {
      tipo: 'tour'
      id: string
      nombre: string
      foto: string
      /** null = sin precio publicado (Isla Saona) */
      precioDesde: number | null
      duracion: string
      /** null = sin tope publicado */
      maxPax: number | null
    }
  | {
      tipo: 'ocasion'
      id: string
      nombre: string
      foto: string
      /** landing real (/eventos/:slug) — solo Bodas y MICE; el resto sigue
       *  en el prototipo (formulario del hub) */
      slug?: string
    }

export type TickerTour = Extract<TickerItem, { tipo: 'tour' }>

// Ticker del hero (v3): los 4 tours + las 6 ocasiones, todo lo que lleva a
// una ficha propia (PLAN-v3.md §7). Reemplaza a la baraja de v2.
export const TICKER_ITEMS: TickerItem[] = [
  ...TOURS.map(
    (t): TickerItem => ({
      tipo: 'tour',
      id: t.slug,
      nombre: t.nombre,
      foto: t.foto,
      precioDesde: t.precioLight,
      duracion: t.duracionCorta,
      maxPax: t.maxPax,
    }),
  ),
  ...OCASIONES.map(
    (o): TickerItem => ({ tipo: 'ocasion', id: o.tipo, nombre: o.nombre, foto: o.foto, slug: o.slug }),
  ),
]

// ─────────────────────────────────────────────────────────────────────────
// Sección «Reserva directa» (why-direct v2 — «dos boletos, mismo precio»,
// pedido de Samuel 2026-07-15).
//
// Copy portado de la v1 de la sección (que ya lo había portado del wireframe
// — ver NOTAS['home-why-direct'] del prototipo): los 4 beneficios + el
// reembolso, que SUBE del pie de la sección a 5ª línea del boleto directo.
// Los "iconos" de la v1 (25% / −5% / 🍽 / 💬) se retiran: la metáfora del
// boleto no los necesita.
export type BeneficioDirecto = { id: string; titulo: string; texto: string }

export const BENEFICIOS_DIRECTO: BeneficioDirecto[] = [
  { id: 'deposito', titulo: 'Confirma con 25%', texto: 'Paga el depósito hoy y el resto en efectivo el día del tour.' },
  { id: 'cash', titulo: 'Descuento en cash', texto: '5% extra si el saldo lo pagas en efectivo a bordo.' },
  { id: 'menu', titulo: 'Elige tu menú', texto: 'Langosta, Angus o vegetariano: solo reservando directo eliges plato por persona.' },
  { id: 'whatsapp', titulo: 'WhatsApp directo', texto: 'Hablas con el equipo del barco, no con un call center.' },
  { id: 'reembolso', titulo: 'Reembolso total', texto: 'Por mal clima o cancelando con 7 días.' },
]

// El tour que viaja impreso en los DOS boletos de la comparación: el buque
// insignia (Semi-Privado Premium). Mismo nombre y mismo precio en ambos a
// propósito — la tesis de la sección es que lo que cambia es lo que viene
// DESPUÉS del precio.
export const BOLETO_TOUR = TOURS[0]

// ─────────────────────────────────────────────────────────────────────────
// Sección «Reseñas verificadas» (v5, pedido de Samuel 2026-07-15): video
// del cofundador a la izquierda + 2 reseñas grandes a la derecha, en
// slider vertical auto-rotante. Las reseñas aquí son el bloque que demuestra
// la prueba social — el "link ver más" sigue SIN apuntar a Viator
// (NOTAS['home-reviews'] del prototipo): no regalar tráfico al canal que
// vende el mismo tour.
//
// El link "ver más" sí enlaza a TripAdvisor y Facebook, donde el cliente
// tiene presencia propia y verificable (la auditoría del sitio
// —analisis/auditoria-web-actual.md— los marcó como los 2 canales
// principales de prueba social del cliente).

export type Review = {
  id: string
  /** Línea superior: "Family from New York", "Honeymoon from London"... */
  lugar: string
  texto: string
  autor: string
  plataforma: 'TripAdvisor' | 'Viator' | 'Facebook' | 'Google'
  fecha: string
  estrellas: 5 // todas 5 por ahora — si entran <5, la estrella fraccional la
  //              pinta el componente como en la insignia de confianza
  //              (ui/insignia-confianza.tsx, mismo patrón).
}

// 5 reseñas: número pensado para el slider vertical (con 2 visibles a la vez
// el "salto" entre la última y la primera se ve natural — el contenido es
// distinto pero el ritmo se mantiene). Portadas del prototipo y de reseñas
// reales de la web actual (mismo pool que el cerebro ya tenía aprobado).
// ⚠️ Avatares: NO tenemos fotos de clientes (privacidad). El componente
// pinta iniciales en un círculo aqua-tint — placeholder honesto, no inventado.
export const QUOTES: Review[] = [
  {
    id: 'ny',
    lugar: 'Family from New York',
    texto:
      'El vivero de coral fue lo mejor del viaje — la bióloga nos explicó todo, y la comida a bordo, increíble.',
    autor: 'Jessica M.',
    plataforma: 'Viator',
    fecha: 'jun 2026',
    estrellas: 5,
  },
  {
    id: 'tx',
    lugar: 'Couple from Texas',
    texto:
      'Trato excelente, grupo pequeño como prometían — no como otros catamaranes llenos de gente. Parecía que el barco era solo nuestro.',
    autor: 'Carlos R.',
    plataforma: 'TripAdvisor',
    fecha: 'may 2026',
    estrellas: 5,
  },
  {
    id: 'cdmx',
    lugar: 'Family from Mexico City',
    texto:
      'Reservamos directo por WhatsApp y nos resolvieron todo en minutos. La recogida fue puntual y el barco impecable. Repetiríamos sin dudar.',
    autor: 'Ana P.',
    plataforma: 'Facebook',
    fecha: 'may 2026',
    estrellas: 5,
  },
  {
    id: 'lhr',
    lugar: 'Honeymoon from London',
    texto:
      'Un día perfecto de luna de miel. Snorkel privado, almuerzo romántico en una playa desierta, tripulación atenta. Vale cada euro.',
    autor: 'Sophie L.',
    plataforma: 'TripAdvisor',
    fecha: 'abr 2026',
    estrellas: 5,
  },
  {
    id: 'bcn',
    lugar: 'Family from Barcelona',
    texto:
      'Los niños disfrutaron muchísimo del snorkel con la bióloga marina. El equipo súper atento con ellos. Una experiencia para repetir.',
    autor: 'Marta V.',
    plataforma: 'Google',
    fecha: 'mar 2026',
    estrellas: 5,
  },
]

// ─────────────────────────────────────────────────────────────────────────
// Barra de confianza multi-plataforma (correcciones v1 del cliente,
// 2026-07-20 — planes/01-home.md slides 11-12: «agregar logo de google»,
// «intentar que sea lo más real posible»).
//
// ⚠️ LO QUE NO SE INVENTA. La maqueta que mandó el cliente pinta un rating
// POR PLATAFORMA (Google 4,9 · +900 reseñas / TripAdvisor 4,9 / Viator 4,8
// Premier). Esos números NO existen en ninguna fuente del proyecto — los
// generó la IA con la que el cliente hizo la maqueta. Aquí se pinta:
//   - el agregado REAL (4.9 sobre 1.782 reseñas — el mismo de todo el sitio), y
//   - de cada plataforma, solo la distinción que SÍ está documentada
//     (TripAdvisor #1 7 años y los premios Viator vienen de PREMIOS, que
//     salieron de la web real del cliente).
// Google entra sin cifra propia a propósito: tenemos reseñas suyas en QUOTES,
// pero no su recuento. Cuando el cliente dé los datos por plataforma (y las
// URLs de sus perfiles, pendientes desde PLAN-v3.md §9), se rellenan aquí y
// `url` deja de ser null → los logos pasan a ser enlaces verificables.
export type PlataformaResena = {
  id: 'google' | 'tripadvisor' | 'viator'
  nombre: string
  /** Distinción real y documentada. null = no tenemos dato publicable. */
  distincion: string | null
  /** Perfil público. null = pendiente del cliente, no se inventa. */
  url: string | null
}

export const PLATAFORMAS_RESENAS: PlataformaResena[] = [
  { id: 'google', nombre: 'Google', distincion: null, url: null },
  {
    id: 'tripadvisor',
    nombre: 'TripAdvisor',
    distincion: '#1 en actividades acuáticas 7 años',
    url: null,
  },
  { id: 'viator', nombre: 'Viator', distincion: 'Premios 2022 · 2023 · 2024', url: null },
]

/** Agregado real, el mismo número que usa el hero y el footer. */
export const RESENAS_AGREGADO = { rating: '4,9', total: 1782 }

export type Fundador = {
  /** Frase que aparece bajo el video (en blockquote con border-left coral). */
  frase: string
  nombre: string
  cargo: string
  /** Video a la izquierda. Placeholder: hero.mp4 (catamaran navegando, asset
   *  real del cliente). La referencia pide un video del cofundador hablando
   *  a cámara en primer plano — cuando llegue, se cambia solo este `src`. */
  videoSrc: string
  videoPoster: string
}

export const FUNDADOR: Fundador = {
  frase:
    'Cada huésped que sube a uno de nuestros barcos es parte de la familia. Esa es la diferencia.',
  // Pendiente nombre real del cofundador (de la marca: la marca langosta +
  // "Hispaniola" script). De momento un placeholder honesto, no inventado.
  nombre: 'Los cofundadores',
  cargo: 'Hispaniola Aquatic Adventures · Punta Cana, desde 2012',
  videoSrc: '/video/hero.mp4',
  videoPoster: '/fotos/hero-video-poster.webp',
}

// ─────────────────────────────────────────────────────────────────────────
// Sección «Contacto» (2026-07-17, pedido de Samuel) — mapa + formulario +
// 4 cards de contacto, tras Reviews (ref. visual: sección de contacto de
// Lumoro, adaptada a tokens Hispaniola).
//
// Copy portado VERBATIM de prototipo/app.js → renderContacto (líneas
// 1693-1722) e inicializarFormularioDemo, salvo dos datos que NO existían en
// el prototipo (el email de contacto no tenía dirección literal, y la
// dirección de oficina se actualiza) — ambos dados por Samuel el
// 2026-07-17: dirección "Oficina Hispaniola Aquatic Adventures, C. P.º del
// Sol, Punta Cana 23500, República Dominicana" (coordenadas 18.669740,
// -68.401262) y correo "info@catamarantourspuntacana.com".
export type ContactoCard = {
  id: 'whatsapp' | 'telefono' | 'email' | 'oficina'
  titulo: string
  dato: string
  href?: string
  /** Verbo de la acción (correcciones v1, slide 14): la maqueta pide que cada
   *  card diga qué pasa al tocarla, no solo el dato. */
  cta?: string
}

export const CONTACTO = {
  // eyebrow/lead: chrome de la cabecera de /contacto (HeroInterna), NO del
  // bloque embebido en la home — `titulo` ya hacía ese trabajo ahí y sigue
  // igual. Mapea contact.php de la web actual (H1 "Contact Us" / subtítulo
  // "Punta Cana - Bavaro, Dominican Republic"), con el copy adaptado al tono
  // de marca del resto del sitio en vez de portado literal.
  eyebrow: 'Contacto',
  lead: 'El equipo real del barco, no un call center — WhatsApp, teléfono o el formulario de abajo. Respondemos en menos de 24 h.',
  titulo: 'Hablas con nosotros, no con un call center',
  direccion: 'Oficina Hispaniola Aquatic Adventures, C. P.º del Sol, Punta Cana 23500, República Dominicana',
  email: 'info@catamarantourspuntacana.com',
  mapaEmbedUrl: 'https://www.google.com/maps?q=18.669740,-68.401262&z=16&output=embed',
  confirmacion: 'Recibimos tu mensaje — te respondemos en menos de 24 h (o antes por WhatsApp).',
  microcopy: '¿Ya tienes una reserva? Ten a mano tu código (HSP-XXXX-XXXX) y te ayudamos más rápido.',
  // Correcciones v1 del cliente (2026-07-20, planes/01-home.md slides 13-14:
  // «dale más cariño please»). La maqueta pone una card de persona real
  // arriba — es lo que hace que «hablas con nosotros, no con un call center»
  // deje de ser una promesa y tenga cara.
  //
  // ⚠️ La maqueta la firma una «María C.» que NO existe en ningún dato del
  // cliente: la inventó la IA de la maqueta. Usamos a EVA, que es quien el
  // propio cliente identifica como atención al viajero en las OTRAS dos
  // maquetas (home slide 15 y nosotros slide 2) — un solo nombre en todo el
  // sitio, y que además es suyo. La fuente es EQUIPO en data/nosotros.ts.
  persona: {
    idEquipo: 'eva',
    texto:
      'Detrás de cada reserva hay una persona real. Escríbenos y te respondemos nosotros mismos — no un robot ni un call center.',
    chips: ['Respondemos en minutos', 'Español e inglés', 'Equipo local'],
  },
  // Opciones del «¿Sobre qué?» del formulario. Salen de lo que el sitio
  // vende de verdad (tours, eventos privados, agentes) — no una lista genérica.
  asuntos: [
    'Reserva de un tour',
    'Evento privado o boda',
    'Cambiar una reserva que ya tengo',
    'Agencias y agentes de viaje',
    'Otra cosa',
  ],
  cards: [
    {
      id: 'whatsapp',
      titulo: 'WhatsApp',
      dato: '+1 829 305 2804',
      href: WHATSAPP_URL,
      cta: 'Chatear ahora',
    },
    {
      id: 'telefono',
      titulo: 'Teléfono',
      dato: '1-800-657-0016',
      href: 'tel:+18006570016',
      cta: 'Llamar',
    },
    {
      id: 'email',
      titulo: 'Email',
      dato: 'info@catamarantourspuntacana.com',
      href: 'mailto:info@catamarantourspuntacana.com',
      cta: 'Escribir',
    },
    {
      id: 'oficina',
      titulo: 'Oficina',
      dato: 'C. P.º del Sol, Punta Cana 23500, República Dominicana',
      href: 'https://maps.app.goo.gl/iuu1EGaNYGCjhreC7',
      cta: 'Ver en el mapa',
    },
  ] satisfies ContactoCard[],
}

// ─────────────────────────────────────────────────────────────────────────
// «Míranos en acción» — reels de Instagram y TikTok (correcciones v1 del
// cliente, 2026-07-20 — planes/01-home.md slides 8-9: «sección instagram y
// tiktok», con una maqueta de carrusel de reels verticales).
//
// ⚠️ LO QUE FALTA Y LO QUE NO SE INVENTA:
//  - NO tenemos los videos. Cada reel se pinta con una FOTO REAL de las
//    galerías del cliente como cartel (`foto`), y `video: null`. Cuando
//    lleguen los reels de verdad, se rellena `video` y la card los reproduce
//    en hover/click sin tocar el componente.
//  - NO se pintan contadores de vistas. La maqueta del cliente los trae
//    («45,2 mil», «120 mil»), pero se los inventó su IA: no tenemos analítica
//    de sus redes. Un número de vistas falso es exactamente el tipo de dato
//    que el proyecto no fabrica (misma regla que los ratings por plataforma).
//  - Los `handle` de terceros («@maria.travels», «@carlos.rd») de la maqueta
//    TAMPOCO se copian: son cuentas de clientes que nadie ha verificado que
//    existan ni que hayan dado permiso. Todos los reels van atribuidos a la
//    cuenta del cliente hasta que él diga lo contrario.
//
// El copy de los títulos SÍ describe lo que se ve en cada foto — no es
// contenido inventado, es el pie de una foto real.
export type Reel = {
  id: string
  titulo: string
  /** Cartel del reel: foto real de las galerías. */
  foto: string
  fotoAlt: string
  /** Video vertical del reel. null = pendiente del cliente. */
  video: string | null
  /** Red donde vive. Decide el icono de la card. */
  red: 'instagram' | 'tiktok'
}

export const REELS: Reel[] = [
  {
    id: 'martes-a-bordo',
    titulo: 'Un martes cualquiera a bordo',
    foto: 'galeria-charter-privado-2',
    fotoAlt: 'Grupo disfrutando en la cubierta del catamarán',
    video: null,
    red: 'instagram',
  },
  {
    id: 'piscina-natural',
    titulo: 'La piscina natural, desde el agua',
    foto: 'galeria-isla-saona-4',
    fotoAlt: 'Aguas turquesa poco profundas de la piscina natural',
    video: null,
    red: 'tiktok',
  },
  {
    id: 'cocina-flotante',
    titulo: 'Así se cocina en medio del mar',
    foto: 'cocina-flotante',
    fotoAlt: 'La tripulación cocinando a la parrilla en la cocina flotante',
    video: null,
    red: 'instagram',
  },
  {
    id: 'snorkel-coral',
    titulo: 'Snorkel en el vivero de coral',
    foto: 'galeria-semi-privado-1',
    fotoAlt: 'Huéspedes haciendo snorkel sobre el vivero de coral',
    video: null,
    red: 'tiktok',
  },
  {
    id: 'sunset',
    titulo: 'El sunset a vela, el favorito de las parejas',
    foto: 'flota-maite',
    fotoAlt: 'El velero Maite navegando con la vela desplegada al atardecer',
    video: null,
    red: 'instagram',
  },
]

/** Hashtag de la campaña de contenido generado por el cliente (maqueta). */
export const REELS_HASHTAG = '#HispaniolaMoments'

// ─────────────────────────────────────────────────────────────────────────
// Pie enriquecido (correcciones v1 del cliente, 2026-07-20 —
// planes/01-home.md slide 18). El cliente puso de referencia el footer de
// Civitatis: métodos de pago, badge de valoración, selector de idioma/moneda
// y redes.
//
// ⚠️ MEDIOS DE PAGO — PENDIENTE DE CONFIRMAR CON EL CLIENTE. Los únicos
// medios que el proyecto documenta hoy son el depósito del 25% online y el
// «paga en efectivo a bordo» (pages/mi-reserva.tsx). El resto son las redes
// de tarjeta que cualquier operador con cobro online acepta, puestas aquí
// para que el cliente las VEA y las corrija — no como afirmación cerrada.
// Se pintan como texto y no como logo de marca: no tenemos los SVG oficiales
// y un logo mal reproducido miente más que un nombre bien compuesto.
// NO PUBLICAR sin que Fernando confirme la lista.
export const MEDIOS_PAGO: string[] = [
  'Visa',
  'Mastercard',
  'American Express',
  'PayPal',
  'Efectivo a bordo',
]

// Redes del cliente. ⚠️ Las URLs reales NO están en ninguna fuente del
// proyecto (ni en prototipo/datos.js ni en la auditoría de la web actual) —
// misma situación que los perfiles de reseñas y los PREMIOS. Con `url: null`
// el componente pinta un EnlacePrototipo en vez de inventar un destino.
export type RedSocial = { id: string; nombre: string; url: string | null }

export const REDES: RedSocial[] = [
  { id: 'instagram', nombre: 'Instagram', url: null },
  { id: 'facebook', nombre: 'Facebook', url: null },
  { id: 'tiktok', nombre: 'TikTok', url: null },
  { id: 'youtube', nombre: 'YouTube', url: null },
]

// Monedas. Igual que el idioma (SelectorIdioma), es VISUAL: el sitio no tiene
// conversión real de divisa todavía. Los precios de todo el sitio están en
// USD, que es como los publica el cliente.
export const MONEDAS = ['USD', 'EUR', 'DOP'] as const

// ─────────────────────────────────────────────────────────────────────────
// FAQ de la home (2026-07-17) — reemplaza al layout de galería+FAQ en 2
// columnas (la galería photo-stack sale de la home; la galería completa
// sigue en prototipo/). Curaduría de 6 preguntas de FAQ_CATEGORIAS
// (prototipo/datos.js, 6 categorías / 14 preguntas) — una por categoría.
// Las 3 primeras ya vivían curadas en la sección anterior; #4 y #5 son
// verbatim nuevas de datos.js, #6 ya estaba curada.
export type FaqItem = { p: string; r: string }

export const FAQ_HOME: FaqItem[] = [
  { p: '¿Qué pasa si llueve el día de mi tour?', r: 'Reembolso total o cambio de fecha, sin costo.' },
  { p: '¿Puedo pagar solo el depósito?', r: 'Sí, confirmas con el 25% y pagas el resto el día del tour.' },
  {
    p: '¿Incluye recogida en mi hotel?',
    r: 'Sí, en todos los tours (excepto charters con punto de encuentro propio).',
  },
  {
    p: '¿Puedo elegir mi plato?',
    r: 'Sí, cada persona elige su plato al reservar: Mariscos, Carne, Surf & Turf o Vegetariano.',
  },
  {
    p: '¿Puedo ir si no sé nadar?',
    r: 'Sí, el snorkel es en aguas poco profundas y con chaleco salvavidas disponible.',
  },
  {
    p: '¿Los niños pueden ir en todos los tours?',
    r: 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos.',
  },
]
