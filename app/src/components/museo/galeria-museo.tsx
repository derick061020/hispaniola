import { MUSEO } from '@/data/museo'
import { brilloAlMover } from './brillo-cursor'

// 01 · LAS ESCULTURAS — galería en carril horizontal.
//
// En escritorio el carril se ANCLA y el scroll vertical lo desplaza de lado
// (use-museo-animaciones.ts): es la única sección que se recorre «nadando de
// lado», y eso hace de pausa en el descenso — se mira el museo antes de seguir
// bajando. En móvil y con movimiento reducido es un carril normal con
// scroll-snap: anclar en pantallas pequeñas atrapa al usuario.
//
// Fotos: las de MEJORADAS (las reales del museo). Siete y no doce: las otras
// cinco son la misma escultura desde otro ángulo, o el vivero, que tiene su
// propia sección en «Science».

export function GaleriaMuseo() {
  const g = MUSEO.galeria
  return (
    <section id="gallery" className="museo-galeria relative" data-museo-galeria>
      <div className="museo-galeria-escena" data-museo-galeria-escena>
        <div className="mx-auto w-full max-w-contenido px-5 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="museo-numero" aria-hidden="true" data-museo-revelar>
                {g.numero}
              </p>
              <p className="museo-eyebrow -mt-3" data-museo-revelar>
                {g.eyebrow}
              </p>
              <h2 className="museo-h2 mt-3" data-museo-revelar>
                {g.titulo}
              </h2>
              <p className="mt-3 max-w-xl text-lg text-museo-texto-suave" data-museo-revelar>
                {g.texto}
              </p>
            </div>
            <p className="text-sm text-museo-texto-tenue" data-museo-revelar>
              {g.ayuda}
            </p>
          </div>
        </div>

        <div className="museo-galeria-viewport mt-10" data-museo-galeria-viewport>
          <ul className="museo-galeria-pista" data-museo-galeria-pista>
            {g.fotos.map((f, i) => (
              <li key={f.foto} className="museo-galeria-item">
                <figure className="museo-tarjeta museo-tarjeta--foto h-full" onPointerMove={brilloAlMover}>
                  <div className="overflow-hidden rounded-card-grande">
                    <img
                      src={`/fotos/${f.foto}.webp`}
                      alt={f.alt}
                      loading="lazy"
                      className="museo-galeria-foto aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <figcaption className="px-1 pb-1 pt-4">
                    <span className="text-xs font-semibold tracking-widest text-museo-texto-tenue uppercase">
                      {String(i + 1).padStart(2, '0')} — {f.lugar}
                    </span>
                    <span className="mt-1 block font-display text-h3 font-semibold text-museo-texto">{f.titulo}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
