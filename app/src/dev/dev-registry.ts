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
          'Topbar (WhatsApp + idiomas), nav con megamenús Tours/Eventos, dropdowns Nosotros/Ayuda, CTA Reservar, menú móvil con acordeón, y footer de 4 columnas.',
        states: [
          { label: 'Megamenú: Tours', kind: 'estado', to: '/?dev-mega=tours' },
          { label: 'Megamenú: Eventos', kind: 'estado', to: '/?dev-mega=eventos' },
          { label: 'Dropdown: Nosotros', kind: 'estado', to: '/?dev-mega=nosotros' },
          { label: 'Dropdown: Ayuda', kind: 'estado', to: '/?dev-mega=ayuda' },
          { label: 'Menú móvil abierto', kind: 'variante', to: '/?dev-movil=abierto', note: 'Ver mejor con el viewport en modo móvil.' },
        ],
      },
      {
        title: 'Hero + baraja de tours',
        route: '/',
        status: 'done',
        description:
          'v2: hero en contenedor redondeado (ya no a sangre) y baraja de los 4 tours en rotación, que sustituye al buscador de disponibilidad. Cada card es un producto con precio y CTA. CTA sticky en móvil.',
        states: [
          {
            label: 'Baraja: Semi-Privado',
            kind: 'estado',
            to: '/?dev-baraja=semi-privado',
            note: 'Congela esa card como activa y DETIENE el auto-avance → frame limpio para Figma.',
          },
          { label: 'Baraja: Snorkel Lovers', kind: 'estado', to: '/?dev-baraja=snorkel-lovers' },
          { label: 'Baraja: Charter Privado', kind: 'estado', to: '/?dev-baraja=charter-privado' },
          { label: 'Baraja: Isla Saona', kind: 'estado', to: '/?dev-baraja=isla-saona' },
          {
            label: 'Baraja estática (reduced-motion)',
            kind: 'variante',
            to: '/?dev-baraja=estatica',
            note: 'Simula prefers-reduced-motion: sin auto-avance, la baraja solo responde a clic.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Confianza y catálogo',
    screens: [
      {
        title: 'Cinta de stats',
        route: '/',
        status: 'done',
        description: '4 cifras (clientes, días navegados, % de capacidad, plástico) + reconocimiento en TripAdvisor/Viator/WeddingWire/LTG.',
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
