import { Check } from 'lucide-react'
import { MUSEO } from '@/data/museo'

// 01 · QUÉ ES — el texto del V1 a la izquierda y una escultura a la derecha.
//
// [2ª vuelta, Samuel: «los hotspots, yo diría de quitarlos, no aportan mucho»]
// Fuera los tres puntos de la B2 que había sobre la foto. La foto se queda sola,
// con su marco y su pie.

export function QueEsMuseo() {
  const q = MUSEO.queEs

  return (
    <section id="what-it-is" className="museo-seccion">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="museo-eyebrow" data-museo-revelar>
            {q.eyebrow}
          </p>
          <h2 className="museo-h2 mt-3" data-museo-revelar>
            {q.titulo}
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-lg text-museo-texto-suave">
            {q.parrafos.map((p) => (
              <p key={p.slice(0, 32)} data-museo-revelar>
                {p}
              </p>
            ))}
          </div>

          <p className="mt-8 font-medium text-museo-texto" data-museo-revelar>
            {q.intro}
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {q.checks.map((c) => (
              <li key={c} className="flex items-start gap-3 text-museo-texto-suave" data-museo-revelar>
                <span className="museo-check" aria-hidden="true">
                  <Check className="size-3.5" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <blockquote className="museo-cita mt-8" data-museo-revelar>
            {q.cierre}
          </blockquote>
        </div>

        <figure className="relative" data-museo-revelar>
          <div className="museo-marco relative overflow-hidden">
            <img
              src={`/fotos/${q.foto}.webp`}
              alt={q.fotoAlt}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[55%_50%]"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}
