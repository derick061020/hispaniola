import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// CASCADAS de entrada de /nosotros (2026-07-22, dos de los efectos elegidos
// por Samuel): las 3 paradas del itinerario y las 6 cards de la flota entran
// escalonadas al cruzar el umbral. Misma receta que
// use-sostenibilidad-reveal.ts (batch + `once`, sin scrub — un bloque que ya
// pasó de largo no tiene sentido engancharlo al píxel), con UNA diferencia:
//
//   `.nosotros-cascada-diagonal` (la flota) entra además desplazada en
//   HORIZONTAL según su columna. Ese desfase lateral es lo que dibuja la
//   diagonal: la card de la 1ª columna llega de más a la izquierda que la de
//   la 3ª, así la fila no aterriza plana. La columna NO se cuenta con el
//   índice (`i % 3`) porque las columnas del grid cambian con el breakpoint
//   (1 / 2 / 3): se MIDE la posición real (`offsetLeft`) contra la primera
//   card, así en móvil —una sola columna— el desfase es 0 solo y la cascada
//   queda vertical, que es la única lectura que tiene sentido ahí.
//
// Un solo hook llamado desde la página, no uno por sección: los dos grupos
// viven en componentes distintos pero para cuando esto corre ya están todos
// montados bajo `rootRef` — mismo criterio que Sostenibilidad.
//
// El estado FINAL (x/y 0, opacidad 1) es el NATURAL del JSX. Con
// reduced-motion o ?dev-nosotros=estatico no se engancha nada.
export function useCascadaNosotros(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--nosotros-cascada-y', rootPx, 40)
    const x = tokenAPx(cs, '--nosotros-cascada-x', rootPx, 20)
    const duracion = parseFloat(cs.getPropertyValue('--nosotros-cascada-duracion')) || 0.7
    const stagger = tokenNum(cs, '--nosotros-cascada-stagger', 0.1)

    const ctx = gsap.context(() => {
      // Cuántas COLUMNAS a la derecha está cada card respecto a la primera de
      // su grid — medido, no supuesto (ver el comentario de arriba). Se lee
      // una sola vez, en el set inicial: a partir de ahí GSAP ya tiene el
      // valor y no vuelve a tocar el layout.
      const columna = (el: HTMLElement) => {
        const primera = el.parentElement?.firstElementChild as HTMLElement | null
        if (!primera || primera === el) return 0
        const ancho = el.offsetWidth || 1
        return Math.round((el.offsetLeft - primera.offsetLeft) / ancho)
      }

      const entrar = (selector: string, diagonal: boolean) => {
        const items = gsap.utils.toArray<HTMLElement>(selector)
        if (items.length === 0) return
        // Preocultar SINCRÓNICAMENTE y dentro del contexto — misma trampa del
        // "flash de un frame" que documenta use-sostenibilidad-reveal.ts.
        items.forEach((el) => gsap.set(el, { autoAlpha: 0, y, x: diagonal ? x * columna(el) : 0 }))
        ScrollTrigger.batch(items, {
          start: 'top 85%',
          once: true,
          interval: 0.1,
          batchMax: 3,
          onEnter: (elementos) =>
            gsap.to(elementos, { autoAlpha: 1, x: 0, y: 0, duration: duracion, stagger, ease: 'power2.out' }),
        })
      }

      entrar('.nosotros-cascada', false)
      entrar('.nosotros-cascada-diagonal', true)
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
