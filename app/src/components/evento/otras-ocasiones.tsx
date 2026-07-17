import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FotosFundido } from '@/components/ui/fotos-fundido'
import { EVENTOS } from '@/data/eventos'

// "Otras ocasiones" (PLAN-EVENTOS.md) — mini-cards con los OTROS 2
// eventos del catálogo. Misma estructura que `tambien-te-gusta.tsx`
// (la sección de la ficha de tour que enseña 2 tours relacionados),
// pero apuntando a `EVENTOS` en vez de `TOURS`. Sale del grid principal
// de la landing y se vuelve su propia sección a ancho completo entre
// el área de contenido y el footer — mismo principio que
// PLAN-INTERNAS-V2.md §C4 ("También te puede gustar" no comparte
// columna con la FAQ, vive ancho completo).
//
// La card usa `FotoPrincipal` (la pieza compartida con la home) con
// hover-zoom, gradiente inferior y nombre+meta encima. El link es
// `<Link>` real a la otra landing — la primera navegación interna
// entre las 3 landings de eventos (era EnlacePrototipo en la versión
// anterior, antes de que las 3 tuvieran landing propia).

export function OtrasOcasiones({ slugActual }: { slugActual: string }) {
  const otras = Object.values(EVENTOS).filter((e) => e.slug !== slugActual)
  if (otras.length === 0) return null

  return (
    <section className="mx-auto max-w-contenido px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <Etiqueta>Otras ocasiones</Etiqueta>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {otras.map((e) => (
          <Link
            key={e.slug}
            to={`/eventos/${e.slug}`}
            className="group relative flex h-tambien-alto items-end overflow-hidden rounded-card-grande"
          >
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
              <FotosFundido
                fotos={[e.foto]}
                etiqueta={e.nombre}
                className="absolute inset-0 size-full"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
            <div className="relative z-10 p-5 text-white sm:p-6">
              <p className="font-display text-lg font-semibold sm:text-xl">{e.nombre}</p>
              <p className="mt-1 text-sm text-white/85">{e.eyebrow}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
