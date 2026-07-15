import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Contracción al hacer scroll del banner de «Reserva directa» (v3, pedido de
// Samuel): el banner arranca a SANGRE (100vw, más alto, esquinas rectas) y al
// scrollear hasta centrarse en el viewport se CONTRAE a una caja compacta con
// esquinas redondeadas. Enganchado al scroll (scrub, NO sticky).
//
// El estado FINAL (compacto) es el NATURAL del CSS (.wd-banner en
// componentes.css); GSAP solo pinta el estado INICIAL (expandido) con
// `.from()` y lo interpola al scrollear. Con reduced-motion o ?dev-direct=*
// no se engancha nada → el banner se ve directamente compacto (el frame que
// viaja a Figma).
//
// ⚠️ Las constantes salen de TOKENS (--spacing-banner-*, --banner-scrub), no
// van "a ojo": son la FUENTE del prototipo de Figma (mismo trato que
// --ticker-* / --exp-reveal-*, playbook animaciones-a-figma).

export function useWhyDirectScroll(
  sectionRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  // useLayoutEffect (no useEffect): el estado inicial de `.from()` se pinta
  // ANTES del primer paint → sin flash del banner compacto que salta a ancho.
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !activo) return
    // La contracción es decoración: con reduced-motion el banner se queda en
    // su estado natural (compacto), ya legible.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const banner = section.querySelector<HTMLElement>('.wd-banner')
    if (!banner) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const pyExpandido = tokenAPx(cs, '--spacing-banner-py-expandido', rootPx, 112)
    const scrub = parseFloat(cs.getPropertyValue('--banner-scrub')) || 0.5

    // Ancho COMPACTO en px, calculado a mano — NO se deja que GSAP lo lea del
    // computed style de max-width (`calc(100% - Xrem)`): verificado en
    // navegador que GSAP detecta la UNIDAD de esta propiedad mirando su valor
    // CSS natural (que contiene un "%" dentro del calc) y la aplica a TODo el
    // tween — incluso pasándole números ya correctos en px, los escribía como
    // "1432%" en vez de "1432px". Forzar el string con "px" explícito en cada
    // valor (from y to) es lo único que elimina la ambigüedad de raíz.
    // Función (no string suelto): invalidateOnRefresh la re-evalúa en cada
    // resize — el margen cambia de responsive breakpoint (640px, igual que
    // el CSS) según el ancho del momento.
    const anchoCompacto = () => {
      const margenPx =
        window.innerWidth >= 640
          ? tokenAPx(cs, '--spacing-banner-margen', rootPx, 40)
          : tokenAPx(cs, '--spacing-banner-margen-movil', rootPx, 20)
      return `${window.innerWidth - margenPx * 2}px`
    }

    // context hace revert() en un solo paso (tween + ScrollTrigger + estilos
    // inline de GSAP) — clave con StrictMode, que monta/desmonta 2 veces.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        banner,
        { maxWidth: () => `${window.innerWidth}px`, borderRadius: 0, paddingTop: pyExpandido, paddingBottom: pyExpandido },
        {
          maxWidth: anchoCompacto,
          borderRadius: tokenAPx(cs, '--radius-banner', rootPx, 28),
          paddingTop: tokenAPx(cs, '--spacing-banner-py', rootPx, 56),
          paddingBottom: tokenAPx(cs, '--spacing-banner-py', rootPx, 56),
          ease: 'none', // el scroll ES la curva
          scrollTrigger: {
            trigger: section,
            start: 'top 88%', // apenas asoma por abajo → aún a sangre
            end: 'top 30%', // ya subió a estar "sobre ella" → compacto y quieto
            scrub,
            invalidateOnRefresh: true, // re-evalúa las funciones (ancho) en cada resize
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [sectionRef, activo])
}
