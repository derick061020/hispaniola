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
          'v3: el header vive DENTRO del box del hero (variante sobreVideo, transparente sobre el video), con la fila de logo/nav/Reservar capada a max-w-contenido (1400px — v3-F13, antes max-w-6xl/1152px). Sin topbar (WhatsApp + idioma se resuelven aparte con botones flotantes — pendiente). v3-F8: los megamenús/dropdowns ya no son cards flotantes — el notch se EXPANDE (ancho y alto, animado) y los contiene, estilo Dynamic Island. v3-F9: Nosotros/Ayuda pasan de lista de links a grid de 2 columnas con chip de icono + descripción (antes el panel angosto flotaba centrado en la caja del notch, con aire muerto a los lados); "Contacto y WhatsApp" pasa a ser "Contacto", a la página /contacto del prototipo. v3-F13: el panel de Nosotros/Ayuda sube a 624px (antes 512px) — con el notch centrado y simétrico, eso solo cabe desde lg (1024px) sin tapar el logo/Reservar; entre md y lg va una variante compacta de 448px sin descripciones (chip + título). CTA Reservar, menú móvil con acordeón, y footer de 4 columnas.',
        states: [
          { label: 'Megamenú: Tours', kind: 'estado', to: '/?dev-mega=tours', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Megamenú: Eventos', kind: 'estado', to: '/?dev-mega=eventos', note: 'Abre el notch expandido (v3-F8), no una card flotante.' },
          { label: 'Dropdown: Nosotros', kind: 'estado', to: '/?dev-mega=nosotros', note: 'v3-F9: grid de 2 columnas, chip cuadrado gris + título + descripción (antes lista de links).' },
          { label: 'Dropdown: Ayuda', kind: 'estado', to: '/?dev-mega=ayuda', note: 'v3-F9: grid de 2 columnas — 3 ítems, el hueco de la 4ª celda se deja vacío a propósito.' },
          {
            label: 'Menú móvil abierto',
            kind: 'variante',
            to: '/?dev-movil=abierto',
            note: 'v3-F10: hoja (mismo margen/radio que el hero) sobre scrim, no pantalla completa. Bloquea el scroll del fondo, atrapa el foco y cierra con Escape o tocando el scrim. Ver mejor con el viewport en modo móvil.',
          },
        ],
      },
      {
        title: 'Hero inmersivo + ticker',
        route: '/',
        status: 'done',
        description:
          'v3: video de fondo (el mismo que usa el hero de la web original), contenido centrado y ticker horizontal en loop infinito con los 4 tours + las 6 ocasiones (sustituye a la baraja de v2). El ticker va a caballo sobre el borde inferior del hero (mitad sobre el video, mitad sobre la banda de premios). Su card tiene 2 VARIANTES: «tour» (precio desde, en navy semibold, + duración + aforo máx.) y «ocasión» (chip aqua «Evento privado», porque no hay precio publicado — se cotiza). v3-F11: la fila de rating (★★★★★ 4.9 + los 2 chips TripAdvisor/Viator) sube ARRIBA del título, en el slot donde vivía el eyebrow de localización (que se retira — el H1 ya dice "...de Punta Cana..."); los 4 stats (antes en su propia sección) bajan a vivir entre el subtítulo y el CTA. v3-F13: el hero mide ~78% del alto de pantalla en desktop (min-h-hero-alto, en svh — no vh/dvh), con el padding recortado para dejar ver la banda de premios sin scroll; el H1 pasa a 2 líneas (columna a max-w-5xl + text-balance); el stat "≤35%" se reescribe a "del aforo del barco" para no partir en 2 líneas; el CTA "Ver disponibilidad" crece (tamaño="lg", halo coral, icono) y los 2 checks bajan debajo del botón, en fila con divisoria e iconos SVG (antes texto "✓" en la misma fila que el botón). CTA sticky en móvil.',
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
          {
            label: 'CTA con catamarán (hover)',
            kind: 'variante',
            to: '/?dev-cta=hover',
            note: 'Congela el catamarán del CTA fuera del botón, sin puntero real → frame para Figma. Es el catamarán REAL del cliente (recorte de hero-catamaran-2.webp, espejado para navegar hacia la flecha), no una ilustración. Vive por DETRÁS del botón: el fondo coral es la puerta por la que sale.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Confianza y catálogo',
    screens: [
      {
        title: 'Banda de premios',
        route: '/',
        status: 'done',
        description:
          'v3-F11: esta sección ERA "Cinta de stats + premios" — las 4 cifras subieron al hero (ver «Hero inmersivo + ticker»), así que ahora es SOLO la banda de los 7 premios reales de la web actual (TripAdvisor #1, WeddingWire 2018-21, LTG Global 2021/22, Viator 2022/23/24, Luxury Travel Guide 2016), descargados de la web del cliente y no recreados. Al quedarse solos, los logos crecen (48px → 64px). Sustituyen a la antigua línea de texto "Reconocido en...". Van en gris + 72% de opacidad en reposo y recuperan su color real al pasar el ratón: son 5 familias cromáticas distintas y a todo color se leen como 7 objetos sueltos, no como una cinta (el guardarraíl de la dirección B: el color lo ponen las fotos, no los badges). v3-F13: max-w-contenido (antes max-w-6xl). El eyebrow "Reconocido por" se retira (los 7 badges ya dicen lo que son) y el padding superior pasa a --spacing-premios-aire: el ticker es `absolute` y cuelga media card DENTRO de este padding, así que el padding lo absorbe antes de dar aire — con un pt normal el hueco real salía negativo y las cards del ticker tocaban los logos. Hueco resultante: 48px en todas las resoluciones.',
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
