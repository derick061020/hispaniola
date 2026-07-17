// Receta compartida del bloque de la ficha: cada sección de la columna
// izquierda (intro+comparador, itinerario, incluye, menú, opiniones, FAQ) y
// el widget de reserva comparten la MISMA card. Constante, no clase CSS: es
// puro Tailwind (bg/padding/radio/borde), nada que amerite CSS a medida — y
// evita que acaben con seis paddings distintos (el pedido de Samuel era justo
// que cada bloque se note separado y de sus vecinos).
//
// 2026-07-17 (2ª iteración de la ficha): el fondo de la columna vuelve a ser
// blanco (ya no --color-fondo-ficha gris), así que la separación deja de ser
// «card blanca sobre gris» y pasa a ser el BORDE gris (ring-linea) alrededor
// de cada bloque — sin sombra (pedido de Samuel: quitar el box-shadow, dejar
// solo el borde). El padding se mantiene.
export const BLOQUE_FICHA = 'rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8'
