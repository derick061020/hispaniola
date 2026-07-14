// ─────────────────────────────────────────────────────────────────────────────
//  [DEV-ONLY] Glosario Dev — registro central de lo construido en la home.
//
//  Regla de trabajo (playbook dev-mode-glosario-prototipo del cerebro): cada
//  bloque nuevo, y cada estado interno (menú abierto, buscador expandido,
//  variante móvil…) que se construya, SE REGISTRA AQUÍ en el mismo commit que
//  lo crea, para poder abrirlo con un clic desde el overlay de Dev Mode.
//
//  La home es una sola página ("/"): la mayoría de "pantallas" de este
//  registro no son rutas distintas sino BLOQUES de esa página, navegables por
//  query params `dev-*` que cada componente consume con `useDevFlag`. La
//  ruta `/fundaciones` sí es una página real aparte (swatches de tokens).
//
//  ⚠️ Nada de `src/dev/` se traslada a Figma. Es andamiaje del prototipo.
// ─────────────────────────────────────────────────────────────────────────────

export type DevStateKind = 'estado' | 'variante' | 'modal' | 'overlay'

export type DevState = {
  /** Nombre visible en el glosario, p. ej. "Menú Tours abierto". */
  label: string
  kind: DevStateKind
  /** URL que activa el estado: ruta + query params `dev-*`. */
  to: string
  note?: string
}

export type DevScreenStatus = 'done' | 'wip' | 'placeholder'

export type DevScreen = {
  title: string
  route: string
  status: DevScreenStatus
  description?: string
  states: DevState[]
}

export type DevSection = { title: string; screens: DevScreen[] }

export const devSections: DevSection[] = [
  {
    title: 'Fundaciones',
    screens: [
      {
        title: 'Tokens y type scale',
        route: '/fundaciones',
        status: 'done',
        description:
          'Swatches de paleta (Dirección B — Charter Premium) y escala tipográfica Lora + Inter, para validar fundaciones antes de construir bloques.',
        states: [],
      },
    ],
  },
  {
    title: 'Home — Shell',
    screens: [
      {
        title: 'Header + Footer',
        route: '/',
        status: 'done',
        description:
          'v3: el header vive DENTRO del box del hero (variante sobreVideo, transparente sobre el video). Sin topbar (WhatsApp + idioma se resuelven aparte con botones flotantes — pendiente). v3-F8: los megamenús/dropdowns ya no son cards flotantes — el notch se EXPANDE (ancho y alto, animado) y los contiene, estilo Dynamic Island. CTA Reservar, menú móvil con acordeón, y footer de 4 columnas.',
        states: [
          { label: 'Megamenú: Tours', kind: 'estado', to: '/?dev-mega=tours', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Megamenú: Eventos', kind: 'estado', to: '/?dev-mega=eventos', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Dropdown: Nosotros', kind: 'estado', to: '/?dev-mega=nosotros', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Dropdown: Ayuda', kind: 'estado', to: '/?dev-mega=ayuda', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Menú móvil abierto', kind: 'variante', to: '/?dev-movil=abierto', note: 'Ver mejor con el viewport en modo móvil.' },
        ],
      },
      {
        title: 'Hero inmersivo + ticker',
        route: '/',
        status: 'done',
        description:
          'v3: video de fondo (el mismo que usa el hero de la web original), contenido centrado y ticker horizontal en loop infinito con los 4 tours + las 6 ocasiones (sustituye a la baraja de v2). El ticker va a caballo sobre el borde inferior del hero (mitad sobre el video, mitad sobre la cinta de stats). Su card tiene 2 VARIANTES: «tour» (precio desde, en navy semibold, + duración + aforo máx.) y «ocasión» (chip aqua «Evento privado», porque no hay precio publicado — se cotiza). CTA sticky en móvil.',
        states: [
          {
            label: 'Video congelado en el poster',
            kind: 'variante',
            to: '/?dev-hero=poster',
            note: 'Pausa el video de fondo en su primer frame → es EL FRAME que viaja a Figma (a Figma no va video, va el poster).',
          },
          {
            label: 'Ticker pausado',
            kind: 'variante',
            to: '/?dev-ticker=pausado',
            note: 'Detiene la pista del ticker → frame limpio para Figma.',
          },
          {
            label: 'Ticker estático (reduced-motion)',
            kind: 'variante',
            to: '/?dev-ticker=estatico',
            note: 'Simula prefers-reduced-motion: sin loop, fila navegable a mano (overflow-x: auto).',
          },
          {
            label: 'Dock activo (hover)',
            kind: 'variante',
            to: '/?dev-dock=activo',
            note: 'Congela el hover "dock" (PLAN-v3.md §10) en su punto máximo sobre la 3ª card, sin depender de un puntero real → frame para Figma. Pausa la pista igual que ?dev-ticker=pausado.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Confianza y catálogo',
    screens: [
      {
        title: 'Cinta de stats + premios',
        route: '/',
        status: 'done',
        description:
          '4 cifras (clientes, días navegados, % de capacidad, plástico) + la CINTA DE PREMIOS: los 7 badges reales de la web actual (TripAdvisor #1, WeddingWire 2018-21, LTG Global 2021/22, Viator 2022/23/24, Luxury Travel Guide 2016), descargados de la web del cliente y no recreados. Sustituyen a la antigua línea de texto "Reconocido en...". Van en gris + 55% de opacidad en reposo y recuperan su color real al pasar el ratón: son 5 familias cromáticas distintas y a todo color se leen como 7 objetos sueltos, no como una cinta (el guardarraíl de la dirección B: el color lo ponen las fotos, no los badges).',
        states: [],
      },
      {
        title: 'Grid de tours',
        route: '/',
        status: 'done',
        description: 'Los 4 productos (incluida Isla Saona) con foto, chip de audiencia, rating, precio o CTA de cotización/consulta.',
        states: [],
      },
    ],
  },
  {
    title: 'Home — Argumentos',
    screens: [
      {
        title: 'Why-direct',
        route: '/',
        status: 'done',
        description: '4 beneficios de reservar directo (depósito 25%, -5% cash, elegir menú, WhatsApp directo) + link a la comparación completa.',
        states: [],
      },
      {
        title: 'Diferenciadores',
        route: '/',
        status: 'done',
        description: '"No es otro party boat": coral vivo, cocina flotante, media capacidad, cero plástico. Foto real de coral/snorkel.',
        states: [],
      },
      {
        title: 'Reviews',
        route: '/',
        status: 'done',
        description: '3 reseñas verificadas + link a TripAdvisor/Facebook (nunca a Viator, ver nota en el componente).',
        states: [],
      },
    ],
  },
  {
    title: 'Home — Cierre',
    screens: [
      {
        title: 'Banda de eventos',
        route: '/',
        status: 'done',
        description: 'CTA de eventos privados (bodas, cumpleaños, team-building) sobre card navy.',
        states: [],
      },
      {
        title: 'Galería + FAQ + cierre',
        route: '/',
        status: 'done',
        description: 'Curaduría de 4 fotos reales (+19 más), acordeón de 4 FAQ (primera abierta) y CTA final "Ver disponibilidad".',
        states: [],
      },
    ],
  },
]

export function devStats() {
  const screens = devSections.flatMap((s) => s.screens)
  const states = screens.flatMap((s) => s.states)
  return {
    total: screens.length,
    done: screens.filter((s) => s.status === 'done').length,
    wip: screens.filter((s) => s.status === 'wip').length,
    placeholder: screens.filter((s) => s.status === 'placeholder').length,
    states: states.length,
  }
}
