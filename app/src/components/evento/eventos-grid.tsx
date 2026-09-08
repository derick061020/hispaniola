import { EVENTOS_ORDEN } from '@/data/eventos'
import { CardEvento } from './card-evento'

// La rejilla con las tres ocasiones — party boat, bodas y corporativo.
//
// [2026-09-08, Derick: «lo mismo para eventos /events»] La hermana de
// `ToursGrid` para la página /events: mismas cards que ya se usan al pie de
// cada landing, aquí las tres y más altas, porque son el contenido de la
// página y no una nota al pie.
//
// Sale de `EVENTOS_ORDEN` y no de `Object.values(EVENTOS)`: ese array existe
// precisamente para fijar el orden con el que se enseñan las tres landings, y
// el orden de un objeto no es algo en lo que apoyarse.
//
// Tres columnas en desktop para tres ocasiones, sin celda vacía — el mismo
// criterio que ya siguió el megamenú de eventos cuando pasaron de cuatro a
// tres.
export function EventosGrid() {
  return (
    <section id="events" className="scroll-mt-20 px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTOS_ORDEN.map((evento) => (
            <CardEvento key={evento.slug} evento={evento} alto="h-80 sm:h-96" />
          ))}
        </div>
      </div>
    </section>
  )
}
