import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll de la sección "Experiencia" (pedido de Samuel): a
// medida que la sección entra en pantalla, el texto y la media se ANIMAN —
// no es sticky, va enganchado al scroll (scrub).
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slides 5 y 7):
//   - El texto ya no se revela por FRASE sino PALABRA A PALABRA (ref. que
//     puso el cliente: getblue.com). Cada palabra pasa de --exp-palabra-apagada
//     a opacidad plena conforme baja el scroll, como si el párrafo se fuera
//     escribiendo. Se anima `opacity` y NO `autoAlpha`: autoAlpha mete
//     visibility:hidden, y con ~80 palabras eso da un párrafo que aparece de
//     la nada en vez de encenderse desde su estado apagado.
//   - El collage de 3 fotos se sustituyó por un video (.exp-video), que entra
//     con el mismo gesto que tenían las fotos (arranca más grande y se asienta)
//     pero sin el vector radial, que solo tenía sentido con un montón de 3.
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
    const videoEscala = tokenNum(cs, '--exp-reveal-foto-escala', 1.14)
    const stagger = tokenNum(cs, '--exp-reveal-stagger', 0.12)
    const scrub = tokenNum(cs, '--exp-reveal-scrub', 0.6)
    const palabraApagada = tokenNum(cs, '--exp-palabra-apagada', 0.18)
    const palabraStagger = tokenNum(cs, '--exp-palabra-stagger', 0.055)

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

      // El texto se ENCIENDE palabra a palabra (correcciones v1, slide 5).
      // `opacity` y no `autoAlpha`: las palabras ya son visibles en su estado
      // apagado (--exp-palabra-apagada, en componentes.css) y lo que anima es
      // el paso a opacidad plena — con autoAlpha (visibility:hidden) el
      // párrafo aparecería de la nada en vez de encenderse.
      tl.from('.exp-palabra', {
        opacity: palabraApagada,
        stagger: palabraStagger,
      })

      // El kicker y el CTA suben como antes: son 2 líneas sueltas, no párrafo
      // corrido, y el efecto palabra a palabra ahí no aporta. Conservan la
      // clase .exp-linea; los párrafos de la narrativa ya NO la llevan (sus
      // palabras se animan por .exp-palabra), así que este selector no
      // necesita excluirlos.
      tl.from('.exp-linea', { autoAlpha: 0, y, stagger }, '<')

      // El video entra con el mismo gesto que tenían las fotos: arranca más
      // grande y se asienta. Sin vector radial (era para un montón de 3) ni
      // clearProps de x/y (ya no hay hover de grupo que pisar) — pero sí de
      // `scale`, que el CSS del marco no toca y conviene devolver limpio.
      tl.from('.exp-video', { autoAlpha: 0, scale: videoEscala, clearProps: 'scale' }, '<')
    }, section)

    return () => ctx.revert()
  }, [sectionRef, activo])
}
