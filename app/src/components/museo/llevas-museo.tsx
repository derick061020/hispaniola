import { BadgeCheck, HeartHandshake, Microscope, Ticket, type LucideIcon } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { MUSEO, conPrecio } from '@/data/museo'
import { brilloAlMover } from './brillo-cursor'

// LO QUE TE LLEVAS — las cuatro tarjetas del V1 con el dinamismo de la B2:
//   · FLOTAN (Raymond: «ves como que flotan las tarjetitas»). En la B2 las
//     cuatro subían y bajaban a la vez, como un bloque; aquí cada una lleva su
//     propio periodo y desfase (use-museo-animaciones.ts), que es lo que hace
//     que se lean como cosas suspendidas en agua y no como un efecto.
//   · COLOR AL PASAR EL CURSOR («hay como unos colores que se ven»): un halo
//     aqua que SIGUE al puntero dentro de la tarjeta (museo.css, `--mx/--my`),
//     no un cambio de fondo plano. En táctil, el halo aparece donde se toca.

const ICONOS: Record<string, LucideIcon> = {
  acceso: BadgeCheck,
  incluido: Ticket,
  ciencia: Microscope,
  ayuda: HeartHandshake,
}

export function LlevasMuseo() {
  const l = MUSEO.llevas
  return (
    <section id="what-you-get" className="museo-seccion">
      <p className="museo-eyebrow text-center" data-museo-revelar>
        {l.eyebrow}
      </p>
      <h2 className="museo-h2 mt-3 text-center" data-museo-revelar>
        {l.titulo}
      </h2>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {l.tarjetas.map((c) => {
          const Icono = ICONOS[c.icono] ?? BadgeCheck
          return (
            <li key={c.titulo} data-museo-revelar>
              <article className="museo-tarjeta h-full" data-museo-flotar onPointerMove={brilloAlMover} onPointerDown={brilloAlMover}>
                <span className="museo-icono" aria-hidden="true">
                  <Icono className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-h3 font-semibold text-museo-texto">{c.titulo}</h3>
                <p className="mt-2 text-museo-texto-suave">{conPrecio(c.texto, formatoDinero)}</p>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
