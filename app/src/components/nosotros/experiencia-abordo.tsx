import { Etiqueta } from '@/components/ui/etiqueta'
import { EXPERIENCIA_ABORDO } from '@/data/nosotros'

// «La experiencia a bordo» (2026-07-17, pedido de Samuel) — el itinerario de
// about-hispaniola.php?lang=es contado como historia, no como lista: vivero
// de coral → playa desierta con coco-loco → piscina natural. 3 fotos reales,
// una por parada, con el número a modo de paso (no la ficha de tokens
// oscuros de --incluye-numero — esta página vive sobre --color-papel, no
// sobre el océano del home; ver investigación en el plan de esta sesión).
export function ExperienciaABordo() {
  return (
    <section>
      <Etiqueta>La experiencia a bordo</Etiqueta>
      <h2 className="mt-3 font-display text-h2 font-semibold text-navy">Un día de mar en 3 paradas</h2>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {EXPERIENCIA_ABORDO.map((parada) => (
          <article key={parada.numero}>
            <div className="overflow-hidden rounded-card-grande">
              <img
                src={`/fotos/${parada.foto}.webp`}
                alt={parada.fotoAlt}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <p className="mt-4 text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua-dark">
              {parada.numero}
            </p>
            <h3 className="mt-1 font-display text-h3 font-semibold text-navy">{parada.titulo}</h3>
            <p className="mt-2 text-sm text-navy-sub">{parada.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
