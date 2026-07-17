import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll de /guias (rediseño editorial 2026-07-17, pedido de
// Samuel: "parece una página con solo cajas... más editorial, más creativa e
// interesante"). Mismo mecanismo que use-sostenibilidad-reveal.ts (mismo día,
// mismo síntoma resuelto ahí primero): Tips y Guías son listas largas de
// bloques apilados, no una pieza fija con su propio ritmo — así que cada
// `.guias-reveal` entra POR SU CUENTA al cruzar el umbral, vía
// ScrollTrigger.batch (fade + subida, sin scrub). Un solo hook, llamado una
// vez desde la página, porque los `.guias-reveal` viven repartidos en 2
// componentes hijos (TipsRapidos/ListaGuias).
//
// El estado FINAL (opacity 1, sin desplazamiento) es el natural del JSX;
// GSAP solo pinta el INICIAL con `.from()`. Con reduced-motion o el flag
// estático no se engancha nada — la página se ve directamente asentada (el
// frame que viaja a Figma).
export function useGuiasReveal(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--guias-reveal-y', rootPx, 24)
    const duracion = parseFloat(cs.getPropertyValue('--guias-reveal-duracion')) || 0.6
    const stagger = tokenNum(cs, '--guias-reveal-stagger', 0.1)

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.guias-reveal', {
        start: 'top 85%',
        once: true,
        interval: 0.1,
        batchMax: 3,
        onEnter: (elementos) =>
          gsap.from(elementos, { autoAlpha: 0, y, duration: duracion, stagger, ease: 'power2.out' }),
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
