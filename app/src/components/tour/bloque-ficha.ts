// PLAN-INTERNAS-V2.md §C2 — receta compartida del "bloque sobre gris": cada
// sección de la columna izquierda (intro+comparador, itinerario, incluye,
// menú, opiniones, FAQ) y el widget de reserva se separan de
// --color-fondo-ficha con la MISMA card blanca. Constante, no clase CSS: es
// puro Tailwind (bg/padding/radio/sombra), nada que amerite CSS a medida —
// y evita que acaben con seis paddings distintos (el pedido de Samuel era
// justo que cada bloque se note separado del fondo y de sus vecinos).
export const BLOQUE_FICHA = 'rounded-card-grande bg-papel p-6 shadow-card ring-1 ring-linea sm:p-8'
