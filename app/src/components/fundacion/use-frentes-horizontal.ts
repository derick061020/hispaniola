import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// BARRIDO HORIZONTAL de la fundación: el proyecto insignia + los 5 frentes.
//
// 2026-07-28, 2ª vuelta (Samuel: «que el scroll no sea así fluido sino que
// vaya como por pasos, y los textos, imágenes, etc. aparezcan con animaciones
// chulas de GSAP, y cuando pasen al otro slide horizontal tengan animación de
// retirada también, para siempre quedar centradas en los sliders horizontales
// y no quedar en lugares en medio teniendo el scroll libre»).
//
// La 1ª versión era UN tween lineal de `x` con scrub: el dedo mandaba, así que
// lo normal era acabar parado con dos medias cards en pantalla. Ahora la
// timeline está hecha DE PASOS —un tramo de duración 1 por transición— y
// ScrollTrigger SNAP acomoda al paso más cercano en cuanto sueltas. Nunca se
// queda a medias.
//
// REPARTO DE TAREAS — el mismo que el stacking de la flota y el vídeo de
// «Incluye»: EL PIN ES CSS PURO (`position: sticky` en el viewport), GSAP solo
// mueve la pista. Un pin dirigido por JS (`pin: true`) va con retraso frente
// al compositor nativo y se nota como un tirón en el primer frame de cada
// dirección; sticky lo resuelve el navegador.
//
// EL ALTO ES LA DURACIÓN. Un sticky se despega cuando su contenedor se acaba,
// así que el «cuánto dura» el barrido se escribe como altura del escenario.
// Con pasos ya no depende de `scrollWidth` sino del NÚMERO de cards, que es lo
// que hace el recorrido predecible: --spacing-fund-paso de scroll por
// transición, ni más ni menos.
//
// POR QUÉ CADA PASO CALCULA SU PROPIA `x` Y NO UNA FRACCIÓN DEL TOTAL: cada
// card se centra midiendo su `offsetLeft` real contra el ancho del viewport.
// Con una fracción uniforme solo caería centrada si todas midieran
// exactamente lo mismo — cierto hoy (100vw), falso en cuanto una card cambie
// de ancho o el gap se toque. El `clamp` al sobrante evita que el último paso
// se pase de largo y deje una franja vacía a la derecha.
//
// ENTRADA Y RETIRADA. El contenido de cada card (los `[data-frente-anim]`)
// entra en la SEGUNDA MITAD del tramo con el que llega y se retira en la
// primera mitad del tramo con el que se va. Van en la MISMA timeline que el
// desplazamiento —no en triggers propios— para que no puedan desincronizarse:
// en el punto de snap, la entrada está completa y la retirada no ha empezado.
// La primera card no tiene entrada (ya se ve al llegar al bloque) y la última
// no tiene retirada (es donde acaba el barrido).
//
// NO SE ENGANCHA NADA por debajo de lg, con reduced-motion o con
// ?dev-frentes=estatico. Y no hace falta ninguna variante: el JSX SIN el hook
// ya es la lista vertical de siempre con todo visible (el `sticky`, el
// `overflow` y la fila son utilidades `lg:`), que es además el frame que
// viaja a Figma.
export function useFrentesHorizontal(
  escenarioRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  useLayoutEffect(() => {
    const escenario = escenarioRef.current
    if (!escenario || !activo) return
    if (!window.matchMedia('(min-width: 64rem)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const viewport = escenario.querySelector<HTMLElement>('[data-frentes-viewport]')
    const pista = escenario.querySelector<HTMLElement>('[data-frentes-pista]')
    const barra = escenario.querySelector<HTMLElement>('[data-frentes-barra]')
    if (!viewport || !pista) return

    const cards = Array.from(pista.querySelectorAll<HTMLElement>('[data-frente-card]'))
    const tramos = cards.length - 1
    if (tramos < 1) return

    // ⚠️ El token es un NÚMERO de pantallas, no `80vh`: getComputedStyle
    // devuelve las custom properties sin resolver («80vh», literal), así que
    // una unidad relativa al viewport no sobrevive al viaje a JS. Se midió: el
    // recorrido salía 0 y el barrido no se movía.
    const pantallas =
      parseFloat(getComputedStyle(escenario).getPropertyValue('--fund-paso-pantallas')) || 0.8
    /** Cuánto scroll cuesta pasar de una card a la siguiente. */
    const paso = () => window.innerHeight * pantallas

    /** Lo que le falta a la pista para enseñar su última card. */
    const sobrante = () => Math.max(0, pista.scrollWidth - viewport.clientWidth)

    /** `x` que deja centrada la card `i`, sin pasarse del final de la pista. */
    const xDe = (i: number) => {
      const card = cards[i]
      const centrado = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2
      return -Math.min(Math.max(centrado, 0), sobrante())
    }

    /** Escribe el alto del escenario y devuelve el recorrido de scroll. */
    const medir = () => {
      const recorrido = paso() * tramos
      const alto = Math.round(viewport.offsetHeight + recorrido)
      // La guarda del `if` no es un ahorro: sin ella, escribir el alto dispara
      // el ResizeObserver global (use-equipo-scroll.ts) → refresh → medir →
      // escribir… en bucle. Solo se toca el DOM cuando el número cambia.
      if (Math.abs(escenario.offsetHeight - alto) > 1) escenario.style.height = `${alto}px`
      return recorrido
    }
    medir()

    const ctx = gsap.context(() => {
      const linea = gsap.timeline({
        scrollTrigger: {
          trigger: escenario,
          start: 'top top',
          end: () => `+=${medir()}`,
          scrub: 0.4,
          invalidateOnRefresh: true,
          // Antes de que ScrollTrigger tome medidas, el escenario tiene que
          // tener ya su alto definitivo — si no, calcularía el final contra el
          // alto viejo y el barrido terminaría antes o después de tiempo.
          onRefreshInit: medir,
          // EL SNAP — lo que impide quedarse con dos medias cards en
          // pantalla. Los múltiplos de 1/tramos son exactamente las
          // posiciones en las que una card queda centrada, porque la timeline
          // dura 1 por tramo. Se escribe como FUNCIÓN y no como el número
          // `1 / tramos` (que ScrollTrigger también acepta) porque así queda
          // dicho de dónde sale el redondeo, que es lo único que hay que
          // entender aquí.
          // `delay` corto: acomodar en cuanto el dedo para, no un rato
          // después. `directional: false` para que respete el punto más
          // cercano aunque se venga de rebote.
          // ⚠️ Verificado con la RUEDA, no con `window.scrollTo`: un scroll
          // programático instantáneo pelea con el tween de snap y da lecturas
          // falsas (saltaba a los extremos). Con rueda, cada parada deja una
          // card centrada y solo su contenido visible.
          snap: {
            snapTo: (valor) => Math.round(valor * tramos) / tramos,
            duration: { min: 0.2, max: 0.5 },
            delay: 0.06,
            ease: 'power2.inOut',
            directional: false,
          },
        },
      })

      cards.forEach((card, i) => {
        const partes = card.querySelectorAll<HTMLElement>('[data-frente-anim]')

        // El desplazamiento del tramo que TRAE a esta card. `ease` propio (no
        // 'none'): con scrub, una curva suave hace que el arrastre arranque y
        // aterrice con peso en vez de con el tirón lineal de antes.
        if (i > 0) {
          linea.to(pista, { x: () => xDe(i), ease: 'power2.inOut', duration: 1 }, i - 1)
        }

        if (partes.length === 0) return

        // ENTRADA en la segunda mitad del tramo de llegada. La card 0 no la
        // tiene: ya está en pantalla cuando el bloque se pincha.
        if (i > 0) {
          linea.set(partes, { autoAlpha: 0, y: 44 }, 0)
          linea.to(
            partes,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
            i - 0.5,
          )
        }

        // RETIRADA en la primera mitad del tramo de salida — hacia ARRIBA, en
        // contra del barrido: si se fuera hacia el mismo lado que la pista,
        // el movimiento se sumaría al desplazamiento y no se leería como que
        // el contenido se retira, sino como que va más rápido.
        if (i < tramos) {
          linea.to(
            partes,
            { autoAlpha: 0, y: -44, duration: 0.45, stagger: 0.05, ease: 'power2.in' },
            i + 0.3,
          )
        }
      })

      // La barra de progreso va en la MISMA timeline, no en un trigger propio:
      // así no puede desincronizarse del barrido ni en un refresh.
      if (barra) linea.fromTo(barra, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tramos }, 0)
    }, escenario)

    return () => {
      ctx.revert()
      escenario.style.height = ''
    }
  }, [escenarioRef, activo])
}
