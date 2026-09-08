import { Link } from 'react-router-dom'
import { FotosFundido } from '@/components/ui/fotos-fundido'
import type { FichaEvento } from '@/data/eventos'

// La card de un evento: foto a sangre con hover-zoom, gradiente al pie y el
// nombre + eyebrow encima.
//
// [2026-09-08] Vivía dentro de `otras-ocasiones.tsx` y ahora la necesitan dos
// sitios: esa sección (los OTROS 2 eventos, al pie de cada landing) y la
// rejilla de /events (los 3). Sacarla aquí es lo que evita el copia-pega:
// cuando cambie el tratamiento de la foto o el gradiente, cambia en los dos.
//
// `alto` es la única diferencia real entre los dos usos: al pie de una landing
// las cards son una nota a pie de página y van bajas (`h-tambien-alto`, el
// mismo token que "También te puede gustar" de la ficha de tour); en /events
// son el contenido de la página y piden más aire.
export function CardEvento({
  evento,
  alto = 'h-tambien-alto',
}: {
  evento: FichaEvento
  alto?: string
}) {
  return (
    <Link
      to={`/events/${evento.slug}`}
      className={`group relative flex items-end overflow-hidden rounded-card-grande ${alto}`}
    >
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
        <FotosFundido
          fotos={[evento.foto]}
          etiqueta={evento.nombre}
          className="absolute inset-0 size-full"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
      <div className="relative z-10 p-5 text-white sm:p-6">
        <p className="font-display text-lg font-semibold sm:text-xl">{evento.nombre}</p>
        <p className="mt-1 text-sm text-white/85">{evento.eyebrow}</p>
      </div>
    </Link>
  )
}
