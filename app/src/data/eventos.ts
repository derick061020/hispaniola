// Contenido de las LANDINGS de eventos — portado de prototipo/app.js
// (renderBodas / renderEmpresas, la implementación canónica) y de
// prototipo/datos.js (OCASIONES). Solo Bodas y Empresas/MICE tienen landing
// propia (`esLanding: true` en datos.js); las otras 4 ocasiones van al
// formulario del hub de eventos, que sigue en el prototipo (depende del
// formulario de cotización, fuera de este build — como el funnel).
//
// UNA plantilla para las 2 landings (pages/evento.tsx), igual que la ficha
// de tour: en Figma es una página con frames de variante, no 2 diseños.
//
// ⚠️ Fotos PROVISIONALES: no existe shooting propio de eventos (misma nota
// que OCASIONES en data/home.ts) — se eligieron MIRÁNDOLAS de la galería real
// del charter privado (el producto que un evento de verdad compra). La de
// bodas es la única foto de boda real del repo (novia a bordo). Pendiente
// pedir al cliente fotos de eventos reales (app/PLAN-v3.md §9).

export type FormatoEvento = {
  titulo: string
  texto: string
  /** nombre de archivo en /fotos (sin extensión) */
  foto: string
  fotoAlt: string
}

export type BeneficioEvento = { titulo: string; texto: string }

export type StatEvento = { valor: string; label: string }

export type QuoteEvento = {
  texto: string
  /** atribución: "★★★★★ · WeddingWire" / "Directora de RRHH · Empresa regional" */
  meta: string
  /** bodas cita una reseña 5★; la de empresas es institucional, sin estrellas */
  estrellas: boolean
}

export type FichaEvento = {
  /** último tramo de la migaja: Inicio / Eventos / {nombre} */
  nombre: string
  eyebrow: string
  titulo: string
  sub: string
  /** fila de confianza bajo el sub (solo bodas: Couples' Choice) */
  trust?: string
  ctaPrincipal: string
  /** acción secundaria del hero (solo empresas: el dossier PDF, que no existe
   *  como asset — se pinta como EnlacePrototipo, igual que en el prototipo
   *  era un botón demo) */
  ctaSecundaria?: string
  foto: string
  fotoAlt: string
  /** banda de cifras bajo la cabecera (solo empresas) */
  stats?: StatEvento[]
  formatosTitulo: string
  formatos: FormatoEvento[]
  incluyeTitulo: string
  incluye: BeneficioEvento[]
  /** letra pequeña honesta bajo los beneficios (bodas: wedding planners) */
  incluyeNota?: string
  quote: QuoteEvento
  cierreTitulo: string
  cierreMeta: string
  cierreCta: string
  /** el prototipo solo pone WhatsApp en el cierre de bodas */
  cierreWhatsapp: boolean
}

export const EVENTOS: Record<string, FichaEvento> = {
  bodas: {
    nombre: 'Bodas',
    eyebrow: 'Bodas y celebraciones nupciales',
    titulo: 'Vuestro "sí" con el Caribe de fondo',
    sub: 'Ceremonia a bordo, welcome party para los invitados que llegan, o la despedida del grupo el último día. El barco es vuestro.',
    trust: "Couples' Choice WeddingWire 2018-2021",
    ctaPrincipal: 'Pedir cotización de boda',
    // La única foto de boda real del repo: la novia brindando a bordo con su
    // grupo — la misma que OCASIONES ya curó para "Bodas y pre-boda".
    foto: 'galeria-charter-privado-5',
    fotoAlt: 'Novia celebrando a bordo del catamarán con su grupo de invitados',
    formatosTitulo: 'Tres momentos, tres formatos',
    formatos: [
      {
        titulo: 'Ceremonia a bordo',
        texto: 'Íntima, hasta 40 invitados. Decoración, oficiante y brindis.',
        // No hay foto de ceremonia: va el barco fondeado frente a la playa de
        // palmeras — el ESCENARIO de la ceremonia, sin fingir una que no hay.
        foto: 'galeria-charter-privado-4',
        fotoAlt: 'El catamarán fondeado frente a una playa de palmeras',
      },
      {
        titulo: 'Welcome party',
        texto: 'Rompe el hielo entre las dos familias el día antes.',
        foto: 'galeria-charter-privado-1',
        fotoAlt: 'La tripulación sirviendo bandejas de langosta a los invitados a bordo',
      },
      {
        titulo: 'Despedida del grupo',
        texto: 'El último día, todos juntos, sin protocolo.',
        foto: 'galeria-charter-privado-2',
        fotoAlt: 'Grupo de amigos brindando con cocos en la playa, el catamarán detrás',
      },
    ],
    incluyeTitulo: 'Qué incluye',
    incluye: [
      { titulo: 'Barco privado', texto: 'Hasta 120 personas.' },
      { titulo: 'Menú a medida', texto: 'Con la novia/novio, no de catálogo.' },
      { titulo: 'Decoración', texto: 'Flores, arco, telas — coordinado.' },
      { titulo: 'Fotografía', texto: 'Fotógrafo a bordo (opcional).' },
      { titulo: 'Barra abierta', texto: 'Cóctel de bienvenida en coco.' },
      { titulo: 'Coordinadora', texto: 'Una persona vuestra de principio a fin.' },
    ],
    incluyeNota: 'Trabajamos con los wedding planners de la zona. ¿Ya tenéis uno? Nos coordinamos con él.',
    quote: {
      texto: 'El equipo hizo que todo fluyera — nuestros invitados no paraban de hablar del atardecer.',
      meta: 'WeddingWire',
      estrellas: true,
    },
    cierreTitulo: 'Contadnos vuestra fecha',
    cierreMeta: 'Respuesta en menos de 24 h · Sin compromiso',
    cierreCta: 'Pedir cotización',
    cierreWhatsapp: true,
  },

  empresas: {
    nombre: 'Empresas',
    eyebrow: 'MICE · Grupos corporativos',
    titulo: 'La actividad que sí recuerdan de la convención',
    sub: 'Incentivos, team building y cierres de evento en catamarán privado. Coordinación con tu DMC o directamente contigo.',
    ctaPrincipal: 'Solicitar propuesta',
    ctaSecundaria: '⬇ Dossier corporativo (PDF)',
    // La cubierta llena de grupos sentados comiendo: la foto que mejor lee
    // "capacidad + grupo organizado" de toda la galería.
    foto: 'galeria-charter-privado-3',
    fotoAlt: 'La cubierta del catamarán con varios grupos comiendo en sus mesas',
    // ⚠️ "Multi-barco" está en la lista de datos a confirmar con el cliente
    // (cerebro, Pendientes) — se porta tal cual del prototipo (canónico) y se
    // ajustará si el cliente lo desmiente.
    stats: [
      { valor: '120', label: 'pax por barco' },
      { valor: 'Multi-barco', label: 'para grupos mayores' },
      { valor: 'Factura', label: 'fiscal RD / internacional' },
      { valor: 'Seguro', label: 'y permisos al día' },
    ],
    formatosTitulo: 'Formatos',
    formatos: [
      {
        titulo: 'Incentivo',
        texto: 'El premio del año para el equipo comercial.',
        foto: 'galeria-charter-privado-2',
        fotoAlt: 'Grupo celebrando con cocos en la playa, el catamarán fondeado detrás',
      },
      {
        titulo: 'Team building',
        texto: 'Regata, retos de snorkel, dinámicas a bordo.',
        foto: 'galeria-charter-privado-7',
        fotoAlt: 'El grupo entero metido en el agua turquesa frente al barco',
      },
      {
        titulo: 'Cierre de convención',
        texto: 'Cóctel de despedida navegando al atardecer.',
        foto: 'galeria-charter-privado-1',
        fotoAlt: 'La tripulación sirviendo comida y bebida a los asistentes a bordo',
      },
    ],
    incluyeTitulo: 'Lo que un organizador necesita saber',
    incluye: [
      { titulo: 'Capacidad y flota', texto: 'Nº de barcos, aforo real por embarcación.' },
      { titulo: 'Plan B por clima', texto: 'Política de reprogramación por escrito.' },
      { titulo: 'Logística', texto: 'Traslados desde los hoteles sede, horarios cerrados.' },
      { titulo: 'Facturación', texto: 'Condiciones de pago corporativas y factura formal.' },
    ],
    quote: {
      texto: 'El equipo se adaptó a nuestra agenda corporativa sin fricciones.',
      meta: 'Directora de RRHH · Empresa regional',
      estrellas: false,
    },
    cierreTitulo: 'Solicita tu propuesta',
    // Del mensaje de confirmación del formulario MICE del prototipo.
    cierreMeta: 'Te contactamos en menos de 24 h con tu propuesta',
    cierreCta: 'Solicitar propuesta',
    cierreWhatsapp: false,
  },
}
