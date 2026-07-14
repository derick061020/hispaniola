import { useEffect, useRef, type RefObject } from 'react'

// Hover "dock" del ticker (PLAN-v3.md §10) — como el Dock de macOS: la escala
// de cada card es una función CONTINUA de la distancia horizontal
// puntero↔centro (campana coseno, no reglas por hermano tipo `+ .card` o
// `nth-child`), así que los "anillos" de reacción salen solos de la curva.
// El JS solo escribe 2 custom properties por card (--dock-x, --dock-escala);
// la transición y el "muelle" viven en CSS (componentes.css) — aquí no hay
// más que geometría.
//
// ⚠️ Trampa №1 (§10.3.1): la pausa por :hover del wrapper es LOAD-BEARING. La
// pista se congela al entrar, así que los centros de las cards se miden UNA
// SOLA VEZ (dentro de un rAF, para que la pausa ya haya aplicado) y no se
// vuelven a medir en cada pointermove.

type OpcionesDock = {
  /** false en estático/reduced-motion/táctil (§10.3.4): el dock no se engancha. */
  activo: boolean
  /** [dev-mode] ?dev-dock=activo — congela el dock en su punto máximo sobre la
   *  3ª card, sin depender de un puntero real. Ver dev-registry.ts. */
  forzado?: boolean
}

type Geometria = {
  cards: HTMLElement[]
  centros: number[]
  ancho: number
  radio: number
  radioNucleo: number
  pesoNucleo: number
  escalaMax: number
}

// Campana coseno de soporte compacto: 1 en d=0, 0 en d=r, y derivada 0 en
// AMBOS extremos → las cards entran y salen de la zona sin costura visible.
function campana(distancia: number, radio: number): number {
  if (radio <= 0 || distancia >= radio) return 0
  return (1 + Math.cos((Math.PI * distancia) / radio)) / 2
}

// La curva del dock = NÚCLEO estrecho + HOMBRO ancho (PLAN-v3.md §10.1).
//
// ⚠️ Una sola campana no sirve, y es el error que se cometió primero: es plana
// en el pico, así que la vecina inmediata —que está a solo 1/3 del radio— se
// llevaba el 75% del crecimiento y el hover NO mandaba, empataba con ella.
// Partiendo el crecimiento en dos campanas se consigue lo que se busca:
//   · núcleo (radio corto, se lleva --ticker-dock-nucleo del crecimiento)
//     → muere antes de llegar a la vecina: es lo que hace que el hover sea
//       claramente el más grande.
//   · hombro (radio largo, el resto del crecimiento) → es lo que deja que la
//     2ª y la 3ª vecina sigan reaccionando, pero ya en sordina.
function factorEscala(
  distancia: number,
  radio: number,
  radioNucleo: number,
  pesoNucleo: number,
  escalaMax: number,
): number {
  const forma = pesoNucleo * campana(distancia, radioNucleo) + (1 - pesoNucleo) * campana(distancia, radio)
  return 1 + (escalaMax - 1) * forma
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

function medirGeometria(wrapper: HTMLElement): Geometria | null {
  const cards = Array.from(wrapper.querySelectorAll<HTMLElement>('.ticker-card'))
  if (cards.length === 0) return null

  const anchoCard = cards[0].getBoundingClientRect().width
  const gap = parseFloat(getComputedStyle(cards[0]).marginRight) || 0
  const paso = anchoCard + gap

  const cs = getComputedStyle(wrapper)
  const escalaMax = parseFloat(cs.getPropertyValue('--ticker-dock-escala-max')) || 1
  const radioPasos = parseFloat(cs.getPropertyValue('--ticker-dock-radio')) || 0
  const radioNucleoPasos = parseFloat(cs.getPropertyValue('--ticker-dock-radio-nucleo')) || 0
  const pesoNucleo = parseFloat(cs.getPropertyValue('--ticker-dock-nucleo')) || 0

  const centros = cards.map((card) => {
    const r = card.getBoundingClientRect()
    return r.left + r.width / 2
  })

  return {
    cards,
    centros,
    ancho: anchoCard,
    radio: radioPasos * paso,
    radioNucleo: radioNucleoPasos * paso,
    pesoNucleo,
    escalaMax,
  }
}

// Geometría del empuje (PLAN-v3.md §10.2): cada card que crece empuja a las
// de su derecha por el total de su crecimiento (D_i); `ancla` resta la
// fracción de ese crecimiento que "ya pasó" a la izquierda del puntero, para
// que el punto bajo el cursor no se deslice al cruzar de una card a otra.
function aplicarDock(geo: Geometria, puntero: number) {
  const { cards, centros, ancho, radio, radioNucleo, pesoNucleo, escalaMax } = geo
  const escalas = centros.map((centro) =>
    factorEscala(Math.abs(puntero - centro), radio, radioNucleo, pesoNucleo, escalaMax),
  )

  let ancla = 0
  for (let j = 0; j < cards.length; j++) {
    const crecimiento = ancho * (escalas[j] - 1)
    const fraccionIzquierda = clamp01((puntero - (centros[j] - ancho / 2)) / ancho)
    ancla += crecimiento * fraccionIzquierda
  }

  let acumulado = 0
  for (let i = 0; i < cards.length; i++) {
    const crecimiento = ancho * (escalas[i] - 1)
    const traslacion = acumulado + crecimiento / 2 - ancla
    cards[i].style.setProperty('--dock-x', `${traslacion}px`)
    cards[i].style.setProperty('--dock-escala', `${escalas[i]}`)
    // La card grande debe pintar encima de sus vecinas (el empuje evita que
    // se solapen, pero la sombra sí se monta).
    cards[i].style.zIndex = `${Math.round(escalas[i] * 100)}`
    acumulado += crecimiento
  }
}

function limpiarDock(cards: HTMLElement[]) {
  for (const card of cards) {
    card.style.removeProperty('--dock-x')
    card.style.removeProperty('--dock-escala')
    card.style.zIndex = ''
  }
}

export function useTickerDock(wrapperRef: RefObject<HTMLDivElement | null>, { activo, forzado = false }: OpcionesDock) {
  const geometriaRef = useRef<Geometria | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !activo) return

    let rafMedicion: number | null = null
    let rafMovimiento: number | null = null

    // [dev-mode] ?dev-dock=activo (dev-registry.ts): frame estático para
    // Figma — sin puntero real, congelado sobre la 3ª card (índice 2).
    if (forzado) {
      rafMedicion = requestAnimationFrame(() => {
        const geo = medirGeometria(wrapper)
        geometriaRef.current = geo
        if (geo && geo.centros[2] !== undefined) aplicarDock(geo, geo.centros[2])
      })
      return () => {
        if (rafMedicion !== null) cancelAnimationFrame(rafMedicion)
        if (geometriaRef.current) limpiarDock(geometriaRef.current.cards)
        geometriaRef.current = null
      }
    }

    const alEntrar = (e: PointerEvent) => {
      const clientX = e.clientX
      rafMedicion = requestAnimationFrame(() => {
        const geo = medirGeometria(wrapper)
        geometriaRef.current = geo
        if (geo) aplicarDock(geo, clientX)
      })
    }

    const alMover = (e: PointerEvent) => {
      if (!geometriaRef.current) return
      const clientX = e.clientX
      if (rafMovimiento !== null) cancelAnimationFrame(rafMovimiento)
      rafMovimiento = requestAnimationFrame(() => {
        rafMovimiento = null
        if (geometriaRef.current) aplicarDock(geometriaRef.current, clientX)
      })
    }

    const alSalir = () => {
      if (rafMovimiento !== null) {
        cancelAnimationFrame(rafMovimiento)
        rafMovimiento = null
      }
      if (geometriaRef.current) limpiarDock(geometriaRef.current.cards)
      geometriaRef.current = null
    }

    wrapper.addEventListener('pointerenter', alEntrar)
    wrapper.addEventListener('pointermove', alMover, { passive: true })
    wrapper.addEventListener('pointerleave', alSalir)

    return () => {
      wrapper.removeEventListener('pointerenter', alEntrar)
      wrapper.removeEventListener('pointermove', alMover)
      wrapper.removeEventListener('pointerleave', alSalir)
      if (rafMedicion !== null) cancelAnimationFrame(rafMedicion)
      if (rafMovimiento !== null) cancelAnimationFrame(rafMovimiento)
      if (geometriaRef.current) limpiarDock(geometriaRef.current.cards)
      geometriaRef.current = null
    }
  }, [wrapperRef, activo, forzado])
}
