import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll de la sección "Experiencia" (pedido de Samuel): a
// medida que la sección entra en pantalla, el texto se ANIMA — no es sticky,
// va enganchado al scroll (scrub).
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slides 5 y 7):
//   - El texto ya no se revela por FRASE sino PALABRA A PALABRA (ref. que
//     puso el cliente: getblue.com). Cada palabra pasa de --exp-palabra-apagada
//     a opacidad plena conforme baja el scroll, como si el párrafo se fuera
//     escribiendo. Se anima `opacity` y NO `autoAlpha`: autoAlpha mete
//     visibility:hidden, y con ~80 palabras eso da un párrafo que aparece de
//     la nada en vez de encenderse desde su estado apagado.
//   - El collage de 3 fotos se sustituyó por un video (.exp-video). En su 2ª
//     vuelta (2026-07-22, ref. six2eight.com) el video se independizó de
//     este hook: ahora tiene su propio recorrido pineado en
//     use-experiencia-video-etapa.ts (SOLO desktop; en móvil ese mismo hook
//     hace el reveal simple de escala que antes vivía aquí). Este archivo ya
//     no toca `.exp-video` en absoluto.
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

    // En DESKTOP el texto NO se anima aquí (2026-07-22, la ola del texto):
    // se lo queda use-experiencia-video-etapa.ts, que es quien pinea la
    // sección. Allí las palabras suben desde abajo desenfocadas, escalonadas,
    // justo cuando el video encoge y libera la columna — y eso tiene que ir
    // atado al PROGRESO del recorrido, no a una posición de scroll propia
    // (durante el pin la sección no se mueve, así que un trigger aparte no
    // tendría contra qué avanzar). Dos animaciones sobre `.exp-palabra` se
    // pelearían por `opacity`, así que este hook se aparta: aquí queda el
    // encendido palabra a palabra de móvil/tablet, donde no hay recorrido.
    if (window.matchMedia('(min-width: 1024px)').matches) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--exp-reveal-y', rootPx, 28)
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
    }, section)

    return () => ctx.revert()
  }, [sectionRef, activo])
}
