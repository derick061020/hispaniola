import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Barra de progreso vertical de los 6 frentes de la fundación en
// /ventaja-competitiva (slide 63) — 2026-07-28, pedido de Samuel: «no así con
// box, puede ser con una barra de progreso vertical y van apareciendo los
// puntos».
//
// UN SOLO ScrollTrigger con scrub gobierna las dos cosas —el largo de la
// barra y qué marcadores están encendidos— y no un trigger por punto. Es la
// misma lección que dejó escrita use-recorrido-sostenibilidad.ts: con un
// trigger por elemento, los rangos de dos items contiguos se solapan en cuanto
// quedan cerca y se ven dos estados a la vez. Aquí además sería peor, porque
// el marcador tiene que ir sincronizado AL PÍXEL con la punta de la barra: si
// se encendiera por su cuenta, se vería encenderse antes o después de que la
// barra lo alcance, que es justo lo que el efecto promete.
//
// La línea de disparo (65% del viewport) es la misma para el inicio y el
// final del rango: la barra avanza a la par que el bloque cruza esa línea, así
// que la punta cae siempre donde está mirando el lector, ni arriba del todo ni
// pegada al pie.
//
// El estado NATURAL del JSX es «todo recorrido» (barra entera, los 6
// marcadores encendidos) y este hook lo apaga al montarse para luego
// animarlo. Al revés —natural apagado— con reduced-motion, con el flag
// ?dev-sost=estatico o si falla el JS, la sección se quedaría en gris con la
// barra vacía. Y de paso ese estado final es EL frame que viaja a Figma.
export function useProgresoProyectos(
  rootRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const barra = root.querySelector<HTMLElement>('[data-progreso-barra]')
    const lista = root.querySelector<HTMLElement>('[data-progreso-lista]')
    const puntos = Array.from(root.querySelectorAll<HTMLElement>('[data-progreso-punto]'))
    if (!barra || !lista || puntos.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(barra, { scaleY: 0, transformOrigin: 'top center' })
      puntos.forEach((p) => {
        p.dataset.activo = 'false'
      })

      ScrollTrigger.create({
        trigger: lista,
        start: 'top 65%',
        end: 'bottom 65%',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(barra, { scaleY: self.progress })
          // Medido contra la lista y no con offsetTop: cada marcador es
          // `absolute` dentro de su `li` (que es `relative`), así que su
          // offsetParent es el li y offsetTop daría la distancia al li, no al
          // origen de la barra. Son 6 elementos por frame, sale gratis.
          const topLista = lista.getBoundingClientRect().top
          const recorrido = lista.offsetHeight * self.progress
          puntos.forEach((p) => {
            const y = p.getBoundingClientRect().top - topLista
            p.dataset.activo = String(y <= recorrido + 1)
          })
        },
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
