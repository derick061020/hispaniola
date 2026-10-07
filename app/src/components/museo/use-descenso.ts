import { useEffect, useRef, type RefObject } from 'react'

/** Estado del descenso, compartido SIN pasar por React: lo leen el shader en
 *  cada fotograma y el medidor, y re-renderizar la página 60 veces por segundo
 *  para moverlos sería absurdo. */
export type Descenso = {
  /** 0 = superficie, 1 = lo más hondo. NO es el progreso del scroll: ver la
   *  curva de abajo. */
  prof: number
  /** scroll en pantallas desde el inicio de la página. */
  scroll: number
  /** 0 = el héroe es una caja con aire alrededor, 1 = ya está a sangre. Lo
   *  escribe GSAP (use-museo-animaciones.ts) mientras el héroe se expande. */
  expansion: number
}

/** Hasta dónde se vuelve a subir al final. Ver «LA SUBIDA» abajo. */
const PROF_FINAL = 0.16

// El progreso se mide sobre la COLUMNA DE AGUA (el contenedor de la página),
// no sobre el documento: el footer va debajo y no es agua.
//
// LA SUBIDA (2ª vuelta, Samuel: «hay que mejorar la transición entre el final
// de la página, las olas y el footer; el fondo es negro y no se ve bien»). La
// profundidad ya no crece hasta el final: llega al fondo en las preguntas y en
// el cierre VUELVE A SUBIR hasta aguas someras (PROF_FINAL). Así la espuma del
// footer rompe sobre agua turquesa —la orilla— y no sobre un abismo casi
// negro; y el «Back to the surface» del cierre deja de ser solo un botón: el
// agua ya está subiendo cuando lo lees. El punto de giro lo marca la sección
// con `data-museo-ascenso`.
//
// Además de dejarlo en la ref, se escribe como `--museo-prof` en el
// contenedor: lo que pueda resolverse en CSS (el degradado de respaldo, la
// aguja del medidor) se resuelve en CSS, sin JS por fotograma.
export function useDescenso(columnaRef: RefObject<HTMLElement | null>) {
  const estado = useRef<Descenso>({ prof: 0, scroll: 0, expansion: 0 })

  useEffect(() => {
    const columna = columnaRef.current
    if (!columna) return
    let pendiente = false

    const medir = () => {
      pendiente = false
      const caja = columna.getBoundingClientRect()
      const vh = window.innerHeight
      const recorrido = Math.max(1, caja.height - vh)
      const p = Math.min(1, Math.max(0, -caja.top / recorrido))

      // Dónde empieza la subida, en el mismo progreso 0–1: cuando la sección
      // de cierre asoma por media pantalla.
      const giroEl = columna.querySelector<HTMLElement>('[data-museo-ascenso]')
      const giro = giroEl
        ? Math.min(0.98, Math.max(0.5, (giroEl.getBoundingClientRect().top - caja.top - vh * 0.6) / recorrido))
        : 1
      const prof = p <= giro ? p / giro : 1 - ((p - giro) / (1 - giro)) * (1 - PROF_FINAL)

      estado.current.prof = prof
      estado.current.scroll = -caja.top / vh
      columna.style.setProperty('--museo-prof', prof.toFixed(4))
    }
    const alScroll = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [columnaRef])

  return estado
}
