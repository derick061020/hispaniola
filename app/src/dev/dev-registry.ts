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
        title: 'Hero + buscador',
        route: '/',
        status: 'done',
        description:
          'Foto full-bleed real (aérea del catamarán) + buscador de disponibilidad (tour/fecha/personas). CTA sticky en móvil.',
        states: [
          {
            label: 'Buscador abierto (móvil)',
            kind: 'estado',
            to: '/?dev-buscador=abierto',
            note: 'Solo tiene efecto visual con el viewport en modo móvil (el toggle está oculto en desktop, donde el buscador ya está siempre visible).',
          },
        ],
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
