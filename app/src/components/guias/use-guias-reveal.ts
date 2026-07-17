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
// El estado FINAL (opacity 1, sin desplazamiento) es el natural del JSX.
// Antes se animaba con `gsap.from({ autoAlpha: 0, y })`: en teoría el
// `immediateRender:true` por defecto pinta el inicial antes del paint, pero
// ScrollTrigger dispara `onEnter` en el SIGUIENTE RAF, así que entre el
// `gsap.from()` y el `onEnter` quedaba un frame de contenido en opacidad 0
// que se leía como "flash" — el contenido aparecía un instante, se ocultaba
// y luego subía. Se sustituye por `gsap.set()` SINCRÓNICO (oculta al
// instante en el useLayoutEffect, antes del primer paint) + `gsap.to()` al
// estado natural. Sin esto, el bug se ve en cada navegación a la página. Con
// reduced-motion o el flag estático no se engancha nada — la página se ve
// directamente asentada (el frame que viaja a Figma).
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

    // Preocultar SINCRÓNICAMENTE antes del primer paint. `useLayoutEffect` corre
    // tras el commit pero antes del paint, así que esto tapa el flash sin
    // parpadeo visible. El set VA DENTRO del `gsap.context()` (no suelto) para
    // que el `ctx.revert()` del cleanup lo desaga cuando cambia el flag
    // `?dev-guias=estatico`: useDevFlag corre en useEffect, DESPUÉS del primer
    // render (donde `activo: true` aplicó el set), así que si el set vive
    // fuera del contexto, los elementos quedan en opacity:0 al activarse el
    // flag y el frame de Figma sale en blanco. Con el set dentro del
    // contexto, el revert borra el set y deja el estado natural visible.
    const ctx = gsap.context(() => {
      gsap.set('.guias-reveal', { autoAlpha: 0, y })
      ScrollTrigger.batch('.guias-reveal', {
        start: 'top 85%',
        once: true,
        interval: 0.1,
        batchMax: 3,
        onEnter: (elementos) =>
          gsap.to(elementos, { autoAlpha: 1, y: 0, duration: duracion, stagger, ease: 'power2.out' }),
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
