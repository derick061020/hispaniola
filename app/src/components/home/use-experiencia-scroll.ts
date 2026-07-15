import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll de la sección "Experiencia" (pedido de Samuel): a
// medida que la sección entra en pantalla, el texto (frase a frase) y las 3
// fotos del collage se ANIMAN — no es sticky, va enganchado al scroll (scrub).
//
// ⚠️ Las constantes salen de TOKENS (tokens.css, bloque "Experiencia"), no van
// "a ojo" en el JS: son la FUENTE del prototipo de Figma (mismo trato que
// --ticker-* / --cta-*, playbook animaciones-a-figma). A Figma NO viaja
// animado — se captura la sección asentada (ver ?dev-exp=estatico).
//
// El estado FINAL (opacity 1, sin desplazamiento) es el estado natural del
// JSX; GSAP solo pinta el estado INICIAL con `.from()` y lo interpola al
// scrollear. Con reduced-motion o el flag estático no se engancha nada, así
// que la sección se ve directamente asentada.

export function useExperienciaScroll(
  sectionRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  // useLayoutEffect (no useEffect): el estado inicial de `.from()` se pinta
  // ANTES del primer paint → nada de flash de la sección visible que luego se
  // esconde.
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !activo) return
    // El reveal es decoración: con reduced-motion no se engancha (la sección
    // se queda en su estado natural, ya visible).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--exp-reveal-y', rootPx, 28)
    const fotoEscala = tokenNum(cs, '--exp-reveal-foto-escala', 1.14)
    const separacion = tokenAPx(cs, '--exp-reveal-foto-separacion', rootPx, 32)
    const stagger = tokenNum(cs, '--exp-reveal-stagger', 0.12)
    const scrub = tokenNum(cs, '--exp-reveal-scrub', 0.6)

    // Vector RADIAL de cada foto = de dónde ARRANCA (apartada del centro del
    // montón). Se mide en el sitio FINAL de la foto (posición absoluta ya
    // aplicada): el hook no sabe las posiciones —las decide el componente—, así
    // que las deduce de la geometría y la animación se adapta sola si cambian.
    const collage = section.querySelector<HTMLElement>('.collage')
    const figs = gsap.utils.toArray<HTMLElement>('.collage-foto', section)
    const outward = new Map<HTMLElement, { x: number; y: number }>()
    if (collage) {
      const c = collage.getBoundingClientRect()
      const cx = c.left + c.width / 2
      const cy = c.top + c.height / 2
      for (const el of figs) {
        const r = el.getBoundingClientRect()
        const dx = r.left + r.width / 2 - cx
        const dy = r.top + r.height / 2 - cy
        const len = Math.hypot(dx, dy) || 1
        outward.set(el, { x: (dx / len) * separacion, y: (dy / len) * separacion })
      }
    }

    // context scopea los selectores DENTRO de la sección y hace revert() en un
    // solo paso (limpia el timeline, el ScrollTrigger y los estilos inline que
    // GSAP dejó) — clave con StrictMode, que monta/desmonta el efecto 2 veces.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' }, // el scroll ES la curva; sin easing propio
        scrollTrigger: {
          trigger: section,
          start: 'top 78%', // arranca cuando el borde superior cruza el 78% del alto de pantalla
          end: 'top 32%', // termina asentado bastante antes de salir → no queda a medias
          scrub,
        },
      })

      // Las fotos arrancan grandes (scale > 1) y separadas (x/y radial), en
      // opacidad 0, y CONVERGEN a su estado final (transform natural). `rotate`
      // vive en CSS (longhand aparte de `transform`), así que el giro del
      // collage no se pisa con este scale/translate.
      tl.from('.exp-linea', { autoAlpha: 0, y, stagger }).from(
        figs,
        {
          autoAlpha: 0,
          scale: fotoEscala,
          x: (_i, el) => outward.get(el as HTMLElement)?.x ?? 0,
          y: (_i, el) => outward.get(el as HTMLElement)?.y ?? 0,
          stagger,
          // GSAP escribe x/y/scale como `translate`/`scale` INLINE (no en
          // `transform`) — inline gana por especificidad a CUALQUIER regla de
          // CSS, incluido el hover de grupo del collage (componentes.css,
          // `.collage-foto:hover`). clearProps quita esas 3 propiedades del
          // style inline en cuanto el tween se asienta (progress 1), y el CSS
          // vuelve a mandar — si se scrollea hacia atrás, GSAP las reescribe
          // solo mientras vuelve a animar.
          clearProps: 'x,y,scale',
        },
        '<',
      )
    }, section)

    return () => ctx.revert()
  }, [sectionRef, activo])
}
