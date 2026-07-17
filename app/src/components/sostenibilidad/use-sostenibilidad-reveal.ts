import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll de la página Sostenibilidad (rediseño 2026-07-17,
// pedido de Samuel: "puedes añadirle efecto de gsap de ser necesario, haz
// algo cool creativo"). A diferencia de Experiencia/Incluye (una pieza FIJA
// con su propio timeline scrub), esta página es una lista larga de bloques
// apilados (misión, cada pilar, cada video, el cierre) — así que cada
// `.sost-reveal` entra POR SU CUENTA al cruzar el umbral, vía
// ScrollTrigger.batch (fade + subida, sin scrub: no tiene sentido enganchar
// al pixel de scroll un bloque que ya pasó de largo). Un solo hook, llamado
// una vez desde la página, porque los `.sost-reveal` viven repartidos en 3
// componentes hijos (Pilares/Videos/Cierre) — para cuando este efecto
// corre ya están todos montados en el DOM bajo `rootRef`.
//
// El estado FINAL (opacity 1, sin desplazamiento) es el natural del JSX;
// GSAP solo pinta el INICIAL con `.from()`. Con reduced-motion o el flag
// estático no se engancha nada — la página se ve directamente asentada (el
// frame que viaja a Figma).
export function useSostenibilidadReveal(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--sost-reveal-y', rootPx, 24)
    const duracion = parseFloat(cs.getPropertyValue('--sost-reveal-duracion')) || 0.6
    const stagger = tokenNum(cs, '--sost-reveal-stagger', 0.1)

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.sost-reveal', {
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
