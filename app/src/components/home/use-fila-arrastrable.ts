import { useRef, useState } from 'react'

// Arrastre horizontal de una fila del muro de reseñas (home/reviews.tsx,
// pedido de Samuel 2026-07-22: «se pausa al hacer hover y se puede
// draggear»).
//
// EL PROBLEMA: el desfile es una @keyframes de CSS y el arrastre es una
// posición arbitraria del usuario. Los dos quieren escribir el transform de
// la misma caja, y el que escriba último gana — en la práctica, la animación
// pisa el arrastre en el frame siguiente y el dedo no mueve nada.
//
// LA SOLUCIÓN: dos capas apiladas (ver el bloque .reviews-muro-* de
// componentes.css). La animación vive en la pista; este hook solo escribe el
// translate de su PADRE, vía la custom property --reviews-arrastre. El
// navegador suma los dos transforms, así que la fila retoma el desfile desde
// donde la soltó el dedo, sin recalcular nada.
//
// Se escribe en el nodo (style.setProperty) y no en un estado de React: un
// arrastre son ~60 escrituras por segundo y cada una costaría un render de
// las 18 cards de la fila. Mismo reparto "JS mide, CSS pinta" que el dock del
// ticker (use-ticker-dock.ts).

type Opciones = {
  /** Cuántas veces se repite el grupo de cards dentro de la pista. Es el
   *  divisor para saber cuánto mide UNA copia, que es el módulo del
   *  arrastre. */
  copias: number
  /** false con prefers-reduced-motion: ahí la fila pasa a scroll nativo
   *  (overflow-x: auto) y un arrastre propio pelearía con él. */
  activo: boolean
}

export function useFilaArrastrable({ copias, activo }: Opciones) {
  const arrastreRef = useRef<HTMLDivElement>(null)
  const [arrastrando, setArrastrando] = useState(false)
  /** clientX donde empezó el gesto. null = no hay gesto en curso. */
  const inicioRef = useRef<number | null>(null)
  /** Offset acumulado al empezar ESTE gesto (los arrastres se suman). */
  const offsetPrevioRef = useRef(0)
  const offsetRef = useRef(0)

  function alBajar(e: React.PointerEvent<HTMLElement>) {
    if (!activo) return
    // Captura: si el dedo se sale de la fila a media pasada, los eventos
    // siguen llegando aquí en vez de perderse en el elemento de al lado.
    e.currentTarget.setPointerCapture(e.pointerId)
    inicioRef.current = e.clientX
    offsetPrevioRef.current = offsetRef.current
    setArrastrando(true)
  }

  function alMover(e: React.PointerEvent<HTMLElement>) {
    if (inicioRef.current === null) return
    const pista = arrastreRef.current?.firstElementChild as HTMLElement | null
    const anchoCopia = pista ? pista.offsetWidth / copias : 0
    if (!anchoCopia) return

    const bruto = offsetPrevioRef.current + (e.clientX - inicioRef.current)
    // Normalizado a (-anchoCopia, 0]. Sin esto, arrastrar mucho rato en la
    // misma dirección saca la pista fuera del tramo que cubren las copias y
    // aparece un hueco vacío. Como todas las copias son idénticas, mover la
    // pista exactamente una copia es visualmente no mover nada — así que el
    // módulo es invisible y el arrastre se siente infinito.
    // El doble módulo es porque el % de JS conserva el signo del dividendo:
    // con un solo `% anchoCopia` los valores positivos se quedarían fuera
    // del rango.
    offsetRef.current = ((bruto % anchoCopia) - anchoCopia) % anchoCopia
    arrastreRef.current?.style.setProperty('--reviews-arrastre', `${offsetRef.current}px`)
  }

  function alSoltar() {
    if (inicioRef.current === null) return
    inicioRef.current = null
    setArrastrando(false)
  }

  return {
    /** Va en la capa del arrastre (.reviews-muro-arrastre). */
    arrastreRef,
    /** Para pausar el desfile y cambiar el cursor mientras dura el gesto. */
    arrastrando,
    /** Van en la fila entera (.reviews-muro-fila), no en cada card: se puede
     *  agarrar por cualquier punto, incluido el hueco entre dos cards. */
    manejadores: {
      onPointerDown: alBajar,
      onPointerMove: alMover,
      onPointerUp: alSoltar,
      onPointerCancel: alSoltar,
    },
  }
}
