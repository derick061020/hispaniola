import { Etiqueta } from '@/components/ui/etiqueta'
import type { FichaTour } from '@/data/tours'
import type { Tour } from '@/data/home'

// Itinerario (wireframe A3): los 5 párrafos de prosa de la web actual se
// convierten en un timeline con horas. El turista escanea «a qué hora me
// recogen» sin leer un bloque de texto.
//
// ⚠️ La columna visual NO es el mapa de la ruta que pide el wireframe: ese
// asset no existe y no se inventa (decisión abierta, PLAN-TOURS.md §13.4 —
// pedirlo al cliente, encargarlo, o generarlo con Magnific bajo la dirección
// de Samuel). Mientras tanto va una foto real del tour (ver `fotoItinerario`
// en data/tours.ts). Isla Saona no tiene ninguna libre → timeline a ancho
// completo, sin hueco decorativo.

export function Itinerario({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  const pieDeFoto =
    tour.booking === 'cotizacion'
      ? 'Ruta a tu elección'
      : tour.slug === 'isla-saona'
        ? null
        : 'Costa Bávaro → Cabo Engaño'

  return (
    <section id="ancla-itinerario" className="scroll-mt-sticky-top">
      <div className={`grid gap-8 ${ficha.fotoItinerario ? 'lg:grid-cols-2' : ''} items-start`}>
        <div>
          <Etiqueta>Itinerario — {ficha.duracion}</Etiqueta>

          {/* El raíl es un border-left en la <ul>; cada hito pone su punto
              encima. Con `hora` vacía (charter y Saona coordinan a demanda) la
              fila no se rompe: la columna de hora simplemente queda vacía y el
              raíl sigue recto. */}
          <ul className="mt-5 flex flex-col gap-6 border-l border-linea pl-5">
            {ficha.itinerario.map((paso, i) => (
              <li key={i} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.5625rem] top-1.5 size-2.5 rounded-chip bg-aqua ring-4 ring-papel"
                />
                {paso.hora ? (
                  <span className="font-display text-xs font-semibold uppercase tracking-wide text-aqua-dark">
                    {paso.hora}
                  </span>
                ) : null}
                <h3 className="font-display text-base font-semibold text-navy">{paso.titulo}</h3>
                {paso.texto ? <p className="mt-1 text-sm text-navy-sub">{paso.texto}</p> : null}
              </li>
            ))}
          </ul>
        </div>

        {ficha.fotoItinerario ? (
          <figure className="overflow-hidden rounded-card-grande bg-papel-hueso">
            <img
              src={`/fotos/${ficha.fotoItinerario}.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-64 w-full object-cover sm:h-80 lg:h-full"
            />
            {pieDeFoto ? (
              <figcaption className="border-t border-linea bg-papel px-4 py-2.5 text-xs text-navy-soft">
                {pieDeFoto}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </section>
  )
}
