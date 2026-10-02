import { EVENTOS_ORDEN } from '@/data/eventos'
import { CardEvento } from './card-evento'
import { Etiqueta } from '@/components/ui/etiqueta'
import { t } from '@/lib/i18n'

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
//
// `conCabecera` (2026-10-02, /tours-and-events): el espejo, al revés, del
// `sinCabecera` de `ToursGrid`. En /events el título lo pone el hero y aquí
// sobraría; en la página combinada el hero habla de las DOS cosas, así que
// cada rejilla necesita el suyo — con el mismo patrón centrado (Etiqueta +
// H2 + lead) que la de tours, para que las dos secciones se lean como
// hermanas. Opt-in: /events no pasa la prop y se ve igual que siempre.
// Los textos son los del hero de /events, no copy nuevo.
export function EventosGrid({ conCabecera = false }: { conCabecera?: boolean } = {}) {
  return (
    <section id="events" className="scroll-mt-20 px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        {conCabecera ? (
          <div className="text-center">
            <Etiqueta>{t('Private events')}</Etiqueta>
            <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{t('Celebrate on board')}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lead text-navy-sub">
              {t('Party boats, weddings and corporate charters: the whole catamaran for your group, on the Caribbean.')}
            </p>
          </div>
        ) : null}

        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${conCabecera ? 'mt-8' : ''}`}>
          {EVENTOS_ORDEN.map((evento) => (
            <CardEvento key={evento.slug} evento={evento} alto="h-80 sm:h-96" />
          ))}
        </div>
      </div>
    </section>
  )
}
