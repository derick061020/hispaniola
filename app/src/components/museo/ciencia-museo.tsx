import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { MUSEO, conPrecio } from '@/data/museo'

// 02 · EL CORAL QUE CRECE + 03 · EL PARQUE DONDE ESTÁ — y la banda de cifras.
//
// Los dos bloques numerados del V1, con el par foto/texto alternando lado que
// ya usan /marine-park y las internas: en Figma son la misma composición, no
// una plantilla nueva. Las fotos son los domos del vivero (MEJORADAS).
//
// LAS CIFRAS son las cuatro del V1. Las numéricas cuentan desde cero al
// aparecer (`data-museo-contar`, use-museo-animaciones.ts); la fecha no, que
// «Nov 0» contando hasta «Nov 1» no significa nada.
//
// ⚠️ 18.4 km² y la Resolución 0008/2024 son datos del V1 del cliente, y es la
// primera vez que entran en el repo. No hay otra fuente que los respalde.

export function CienciaMuseo() {
  const c = MUSEO.ciencia
  return (
    <section id="science" className="museo-seccion">
      <p className="museo-eyebrow" data-museo-revelar>
        {c.eyebrow}
      </p>

      <div className="mt-8 flex flex-col gap-16 lg:gap-24">
        {c.bloques.map((b, i) => (
          <article
            key={b.numero}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>figure]:order-2' : ''}`}
          >
            <figure className="museo-marco overflow-hidden" data-museo-revelar>
              <img
                src={`/fotos/${b.foto}.webp`}
                alt={b.fotoAlt}
                loading="lazy"
                className="museo-parallax aspect-[4/3] w-full object-cover"
                data-museo-parallax
              />
            </figure>
            <div>
              <p className="museo-numero" aria-hidden="true" data-museo-revelar>
                {b.numero}
              </p>
              <h2 className="museo-h2 -mt-3" data-museo-revelar>
                {b.titulo}
              </h2>
              <p className="mt-5 text-lg text-museo-texto-suave" data-museo-revelar>
                {b.texto}
              </p>
              {'cta' in b && b.cta ? (
                <Link to={b.ctaHref} className="museo-enlace mt-6 inline-flex items-center gap-2" data-museo-revelar>
                  {b.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <dl className="museo-cifras mt-20 lg:mt-24">
        {MUSEO.cifras.map((cifra) => ({ ...cifra, valor: conPrecio(cifra.valor, formatoDinero) })).map((f) => (
          <div key={f.texto} className="museo-cifra" data-museo-revelar>
            <dt className="order-2 mt-2 text-sm text-museo-texto-suave">{f.texto}</dt>
            <dd className="order-1 font-display text-museo-cifra font-semibold leading-none text-museo-texto">
              <span data-museo-contar={/^\d+(\.\d+)?$/.test(f.valor) ? f.valor : undefined}>{f.valor}</span>
              {f.unidad ? <span className="ml-1.5 text-h3 text-museo-texto-suave">{f.unidad}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
