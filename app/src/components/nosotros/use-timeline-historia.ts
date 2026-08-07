import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { refrescaScrollTriggerAlCrecer } from '@/lib/refresca-scrolltrigger'

gsap.registerPlugin(ScrollTrigger)

// LA LÍNEA DE TIEMPO DE /flota — barrido HORIZONTAL con el bloque pinchado.
//
// ── POR QUÉ ACABÓ SIENDO ESTO (tres vueltas en el mismo día, 2026-08-07) ──
// Punto de partida, Samuel: «hay muchos más años pero solo hay una línea
// progresiva de 3 puntos, debería pasar por todos los años». Era un bug de
// arrastre: la timeline pasó de 5 hitos en UNA fila a 9 en TRES (rejilla de 3
// columnas) y el riel siguió siendo una única línea absoluta pegada arriba —
// medido, cruzaba solo la primera fila y encima la sobrepasaba 166px, porque su
// `w-4/5` estaba calibrado para cuando el 5º punto caía justo al 80%.
//
//   1ª — carril horizontal + panel del año activo. Descartada: «no me gusta que
//        solo se vea una a la vez».
//   2ª — timeline vertical con los 9 textos a la vez. Descartada: «no lo quiero
//        vertical».
//   3ª — ESTA, y la pidió él: «puede ser scroll fijo con gsap pero vayan pasando
//        en horizontal el scroll».
//
// Resuelve las tres condiciones a la vez, que es lo que ninguna de las otras
// hacía: la línea pasa por los 9 años (es una sola pista continua), se ven
// VARIOS a la vez (~4 por pantalla, no uno) y no es vertical.
//
// ── REPARTO DE TAREAS ────────────────────────────────────────────────────
// Copia deliberada de la receta de fundacion/use-frentes-horizontal.ts, que ya
// resolvió esto mismo para el barrido de la fundación:
//   · EL PIN ES CSS PURO (`position: sticky` en el viewport), no `pin: true`.
//     Un pin dirigido por JS va con retraso frente al compositor nativo y se
//     nota como un tirón en el primer frame de cada dirección.
//   · EL ALTO DEL ESCENARIO ES LA DURACIÓN. Un sticky se despega cuando su
//     contenedor termina, así que «cuánto dura el barrido» se escribe como
//     altura. Se deriva del NÚMERO de hitos, no del `scrollWidth`: así el
//     recorrido es predecible y no cambia porque un párrafo crezca.
//   · GSAP solo mueve la pista y dibuja el riel.
//
// ⚠️ NO SE GENERALIZÓ EL HOOK DE LA FUNDACIÓN, se copió la receta. Aquél está
// aprobado y funcionando, sus cards ocupan 100vw (una a la vez, que aquí es
// justo lo descartado) y trae entradas/retiradas por card que aquí sobran. Un
// hook común habría que parametrizarlo en cuatro sitios para dos usos. Si
// aparece un TERCER barrido horizontal, entonces sí toca extraerlo — mismo
// criterio que se siguió con lib/refresca-scrolltrigger.ts.
//
// ⚠️ SIN SNAP, a diferencia de la fundación. Allí una card es una pantalla y
// quedarse a medias entre dos es un error visible; aquí caben ~4 hitos a la vez
// y el barrido es una LÍNEA que se recorre — pararse entre 2015 y 2016 es una
// posición perfectamente legítima. El snap además pelearía con la lectura: cada
// vez que soltases la rueda te movería el texto que estás leyendo.
//
// NO SE ENGANCHA NADA por debajo de lg, con reduced-motion o con
// ?dev-flota=estatico. Y no hace falta variante: el JSX SIN el hook ya es la
// lista vertical de siempre con los 9 hitos visibles (el `sticky`, el
// `overflow` y la fila son utilidades `lg:`) — que es además el frame que viaja
// a Figma, porque a Figma no va el barrido.
export function useTimelineHistoria(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (!window.matchMedia('(min-width: 64rem)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // El escenario es el bloque cuyo ALTO marca la duración; el viewport es lo
    // que se queda pinchado. Si el gancho no está, mejor no animar que animar
    // mal: se devuelve sin tocar nada y queda la lista natural.
    const escenario = root.querySelector<HTMLElement>('.nosotros-timeline')
    const viewport = escenario?.querySelector<HTMLElement>('[data-timeline-viewport]')
    // El CLIP no es el viewport: el viewport es la escena pinchada entera
    // (titular incluido) y el clip es solo la ventana por la que asoma la
    // pista. La distancia que hay que recorrer se mide contra el clip.
    const clip = escenario?.querySelector<HTMLElement>('[data-timeline-clip]')
    const pista = escenario?.querySelector<HTMLElement>('[data-timeline-pista]')
    if (!escenario || !viewport || !clip || !pista) return

    const hitos = Array.from(pista.querySelectorAll<HTMLElement>('.timeline-hito'))
    const tramos = hitos.length - 1
    if (tramos < 1) return

    const cs = getComputedStyle(escenario)
    const pop = parseFloat(cs.getPropertyValue('--nosotros-timeline-pop')) || 0.45
    const escala = parseFloat(cs.getPropertyValue('--nosotros-timeline-pop-escala')) || 0.6
    const factor = parseFloat(cs.getPropertyValue('--timeline-recorrido-factor')) || 1.15

    /** Lo que le falta a la pista para enseñar su último hito. */
    const sobrante = () => Math.max(0, pista.scrollWidth - clip.clientWidth)

    /**
     * Escribe el alto del escenario y devuelve el recorrido de scroll.
     *
     * ⚠️ EL RECORRIDO SALE DE LA DISTANCIA REAL, no del número de hitos —
     * justo al revés que la fundación, que lo cuenta por cards y lo documenta
     * como una virtud. Allí lo es: cada paso tiene que dejar UNA card centrada,
     * así que el precio por paso debe ser fijo. Aquí no hay pasos ni snap; lo
     * único que pasa es que una pista se recorre entera, y contarlo por hitos
     * daba un precio absurdo — medido: 3.600px de scroll para mover 1.848px de
     * pista, o sea el doble de peaje que de recorrido.
     * Contra la distancia, además, se adapta solo: en un monitor ancho caben
     * más años a la vez, queda menos que recorrer y el bloque se suelta antes.
     */
    const medir = () => {
      const recorrido = Math.round(sobrante() * factor)
      const alto = Math.round(viewport.offsetHeight + recorrido)
      // La guarda no es un ahorro: sin ella, escribir el alto dispara el
      // ResizeObserver global (lib/refresca-scrolltrigger.ts) → refresh →
      // medir → escribir… en bucle. Solo se toca el DOM si el número cambia.
      if (Math.abs(escenario.offsetHeight - alto) > 1) escenario.style.height = `${alto}px`
      return recorrido
    }
    medir()

    const ctx = gsap.context(() => {
      gsap.set('.timeline-punto', { scale: escala })
      gsap.set('.timeline-tramo', { scaleX: 0 })

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
        },
      })

      // EL DESPLAZAMIENTO, en un solo tween de duración `tramos`: la pista se
      // arrastra justo lo que le sobra, ni un píxel más. No se reparte en
      // tramos —como sí hace la fundación— porque allí cada paso tiene que
      // dejar UNA card centrada; aquí la pista solo tiene que recorrerse
      // entera, y un único tween lineal es lo que hace que la velocidad del
      // barrido sea constante de principio a fin.
      linea.to(pista, { x: () => -sobrante(), ease: 'none', duration: tramos }, 0)

      // EL RIEL SE DIBUJA A LA VEZ, tramo a tramo. Cada segmento coral crece de
      // su punto al siguiente durante exactamente el tramo en que ese trozo de
      // pista cruza la pantalla, así que la línea nace debajo del año que estás
      // mirando y no por delante ni por detrás.
      hitos.forEach((hito, i) => {
        const tramo = hito.querySelector<HTMLElement>('.timeline-tramo')
        if (tramo && i < tramos) linea.to(tramo, { scaleX: 1, ease: 'none', duration: 1 }, i)
        // El punto hace pop justo cuando el riel lo alcanza. Fuera de la
        // timeline scrubeada (con `.call`, no con `.to`) porque un pop que se
        // deshace al scrollear hacia arriba se lee como un fallo de render, no
        // como un efecto — mismo criterio que tenía la versión anterior.
        linea.call(
          () => {
            gsap.to(hito.querySelector('.timeline-punto'), {
              scale: 1,
              duration: pop,
              ease: 'back.out(2.4)',
              overwrite: true,
            })
          },
          undefined,
          Math.max(0, i - 0.15),
        )
      })
    }, escenario)

    // /flota carga 6 cards de barco con vídeo POR ENCIMA de este bloque, todas
    // lazy: sin esto, ScrollTrigger fija el `start` del pin contra una altura de
    // página que va a cambiar debajo (ver el bug medido en el helper).
    const dejaDeRefrescar = refrescaScrollTriggerAlCrecer()

    return () => {
      dejaDeRefrescar()
      ctx.revert()
      escenario.style.height = ''
    }
  }, [rootRef, activo])
}
