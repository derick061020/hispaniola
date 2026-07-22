import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// LA LÍNEA DE TIEMPO SE TRAZA (2026-07-22, efecto elegido por Samuel). El riel
// de «De un barco a una flota de seis» se dibuja de izquierda a derecha
// enganchado al scroll, y cada hito (punto coral + año + titular) hace pop
// justo cuando el trazo lo alcanza. Es el efecto natural de una línea de
// tiempo: el gesto CUENTA lo que dice el contenido — 2012 → hoy.
//
// Dos mecánicas distintas en el mismo timeline, y es a propósito:
//   - EL TRAZO va con scrub: es un recorrido, el scroll es literalmente la
//     posición en el tiempo. Sube y baja con el usuario sin verse raro.
//   - LOS POPS no: van con `once` por hito. Un punto que crece y decrece según
//     el usuario sube y baja se lee como un fallo de render, no como un
//     efecto. Se disparan desde el propio ScrollTrigger del riel con
//     `onUpdate` comparando el progreso contra la posición del hito, en vez de
//     con un trigger por elemento — así el pop está SINCRONIZADO con el trazo
//     (que es la gracia) y no con dónde cae cada punto en la pantalla.
//
// El riel se dibuja con `scaleX` sobre un elemento con `transform-origin:left`
// (no con `width`): la anchura dispara layout en cada frame de scroll, la
// transformada no.
//
// El estado FINAL (riel completo, hitos a tamaño) es el NATURAL del JSX. Con
// reduced-motion o ?dev-nosotros=estatico no se engancha nada.
export function useTimelineHistoria(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(root)
    const scrub = tokenNum(cs, '--nosotros-timeline-scrub', 0.6)
    const pop = parseFloat(cs.getPropertyValue('--nosotros-timeline-pop')) || 0.45
    const escala = tokenNum(cs, '--nosotros-timeline-pop-escala', 0.6)

    const ctx = gsap.context(() => {
      const hitos = gsap.utils.toArray<HTMLElement>('.timeline-hito')
      if (hitos.length === 0) return

      // ⚠️ El trigger es el BLOQUE de la línea, no `root`: los 3 efectos de la
      // página comparten el mismo ref (el contenedor de todo el contenido), y
      // usarlo aquí engancharía el recorrido al scroll de la página entera —
      // la línea tardaría media página en dibujarse y los últimos hitos no se
      // encenderían nunca. Si el gancho no está, mejor no animar que animar
      // mal: se devuelve sin tocar nada y todo queda en su estado natural.
      const bloque = root.querySelector<HTMLElement>('.nosotros-timeline')
      if (!bloque) return

      gsap.set('.timeline-riel-progreso', { scaleX: 0 })
      gsap.set(hitos, { autoAlpha: 0 })
      gsap.set('.timeline-punto', { scale: escala })

      // Cada hito se enciende cuando el trazo pasa por su sitio. El primero a
      // 0 (arranca ya encendido, si no la línea nace de la nada) y el resto
      // repartidos hasta el final del recorrido.
      const disparado = hitos.map(() => false)
      const umbral = (i: number) => i / hitos.length

      const encender = (i: number) => {
        if (disparado[i]) return
        disparado[i] = true
        const hito = hitos[i]
        gsap.to(hito, { autoAlpha: 1, duration: pop, ease: 'power2.out' })
        gsap.to(hito.querySelector('.timeline-punto'), {
          scale: 1,
          duration: pop,
          ease: 'back.out(2.4)',
        })
      }

      gsap.to('.timeline-riel-progreso', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: bloque,
          // Arranca con la línea ya dentro de pantalla y termina antes de que
          // se vaya por arriba: el recorrido completo ocurre mientras se está
          // mirando, no a medio salir. El bloque mide poco (~100px), así que
          // casi todo el viaje lo pone la distancia entre los dos umbrales
          // (40% de la pantalla) — con márgenes más estrechos el trazo se
          // completaba de golpe en un par de ruedas de scroll.
          start: 'top 85%',
          end: 'bottom 45%',
          scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            hitos.forEach((_, i) => {
              if (self.progress >= umbral(i)) encender(i)
            })
          },
          // Si se entra a la página con la sección ya pasada (recarga a media
          // altura, enlace con ancla), el onUpdate puede no llegar a correr:
          // esto deja todo encendido en vez de una línea de huecos invisibles.
          onRefresh: (self) => {
            if (self.progress >= 1) hitos.forEach((_, i) => encender(i))
          },
        },
      })
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
