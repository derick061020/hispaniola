/** El halo de color que sigue al cursor dentro de una tarjeta (museo.css lee
 *  `--mx/--my`). Va en onPointerMove y onPointerDown: en táctil no hay «mover»
 *  sin tocar, así que el halo aparece donde cae el dedo. */
export function brilloAlMover(e: React.PointerEvent<HTMLElement>) {
  const caja = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - caja.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - caja.top}px`)
}
