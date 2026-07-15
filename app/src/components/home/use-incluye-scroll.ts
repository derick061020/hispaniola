import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Descenso del catamarán cenital de la sección «Incluye» (rediseño v3-F19.2,
// pedido de Samuel): a medida que la sección cruza la pantalla, el barco BAJA
// por el centro (empieza fuera del océano, por encima) y cada ítem editorial
// aparece (fade + subida) al entrar. Todo enganchado al scroll (scrub), NO
// sticky/pin — «el barco baja con nosotros».
//
// ⚠️ Las constantes salen de TOKENS (tokens.css, bloque «Incluye»), no van "a
// ojo": son la FUENTE del prototipo de Figma (mismo trato que --ticker-* /
// --exp-* , playbook animaciones-a-figma). A Figma NO viaja animado — se
// captura la sección asentada (ver ?dev-incluye=estatico).
//
// SOLO DESKTOP (lg+): en móvil el barco es la pieza de apertura (estático,
// arriba) y los ítems van en lista — el «down-the-middle» no cabe en una
// columna estrecha. El hook no engancha nada por debajo de 1024px.

export function useIncluyeScroll(
  sectionRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  // useLayoutEffect: el estado inicial de `.from()` (ítems ocultos) se pinta
  // ANTES del primer paint → sin flash de los ítems visibles que luego se
  // esconden.
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // El translate del barco (componentes.css) convierte la fracción --barco-y
    // a px con --incluye-alto-px: hay que mantenerlo sincronizado con el alto
    // real de la sección (cambia con el ancho de ventana). Se mide SIEMPRE —
    // también en estático/reduced-motion, donde no hay scroll pero el barco
    // igual usa este valor para colocarse (--barco-y inline). Fuera del gate.
    const setAlto = () => section.style.setProperty('--incluye-alto-px', `${section.offsetHeight}px`)
    setAlto()
    const ro = new ResizeObserver(setAlto)
    ro.observe(section)

    // El descenso + reveals son decoración enganchada al scroll: solo desktop,
    // con movimiento permitido y sin el flag estático (frame de Figma). Si no,
    // se sale dejando solo el ResizeObserver (la sección se ve asentada).
    const enganchar =
      activo &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(min-width: 1024px)').matches
    if (!enganchar) return () => ro.disconnect()

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const desde = tokenNum(cs, '--incluye-barco-desde', -0.15)
    const hasta = tokenNum(cs, '--incluye-barco-hasta', 1.05)
    const scrubBarco = tokenNum(cs, '--incluye-barco-scrub', 0.5)
    const itemY = tokenAPx(cs, '--incluye-item-y', rootPx, 24)
    const scrubItem = tokenNum(cs, '--incluye-item-scrub', 0.5)

    const ctx = gsap.context(() => {
      const barco = section.querySelector<HTMLElement>('.incluye-barco')
      if (barco) {
        gsap.fromTo(
          barco,
          { '--barco-y': desde },
          {
            '--barco-y': hasta,
            ease: 'none', // el scroll ES la curva
            scrollTrigger: {
              trigger: section,
              start: 'top bottom', // entra cuando el borde superior toca el fondo de la pantalla
              end: 'bottom top', // sale cuando el borde inferior toca el techo
              scrub: scrubBarco,
              invalidateOnRefresh: true,
              onRefresh: setAlto,
            },
          },
        )
      }

      // Cada ítem: fade + subida al entrar, enganchado al scroll (scrub corto)
      // → aparece "tal como el barco pasa por su altura". El estado FINAL
      // (visible, sin desplazamiento) es el natural del JSX; GSAP solo pinta el
      // inicial y lo interpola.
      const items = gsap.utils.toArray<HTMLElement>('.incluye-item', section)
      for (const el of items) {
        gsap.from(el, {
          autoAlpha: 0,
          y: itemY,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 60%',
            scrub: scrubItem,
          },
        })
      }
    }, section)

    return () => {
      ro.disconnect()
      ctx.revert()
    }
  }, [sectionRef, activo])
}
