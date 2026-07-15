import { ArrowRight, Clock, Star, Users } from 'lucide-react'
import type { Tour } from '@/data/home'
import { formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { CarruselImagenes } from '@/components/ui/carrusel-imagenes'

// Card de tour — el escaparate de "Nuestros tours". La ficha vive en prototipo/
// (fuera de alcance), así que el CTA "Ver tour" es un EnlacePrototipo.
//
// v3-F20 (PLAN-v3.md §18, pedido de Samuel): las cards se rediseñan con la FOTO
// de protagonista — un CARRUSEL con la galería real del servicio que desliza
// solo y, al hover, se pausa y saca flechas para pasarlo a mano (ui/
// carrusel-imagenes.tsx). Debajo, la anatomía de la ref. soft-UI: título +
// precio, descripción, fila de meta con iconos (rating/duración/aforo), chips
// de "incluye" y un CTA oscuro ancho.
//
// ⚠️ La card ya NO es un <a> (como en §17): el carrusel mete botones (flechas/
// puntos) y anidar botones dentro de un <a> es HTML inválido. En su lugar es un
// <article> y el CTA usa "stretched link" (after:inset-0) para que TODA la card
// —salvo el carrusel— navegue al tour. El carrusel va en z-20 (por encima del
// overlay del stretched link, que va en z-10) para que su hover/flechas/puntos
// reciban el puntero.
//
// v3-F17.2 sigue vivo: las clases `tour-card` (aquí) + `.tours-cards` (en
// tours-grid.tsx) enganchan el hover de GRUPO por `:has()` (componentes.css) —
// al pasar por una, crece/rota y las demás se apagan.
export function TourCard({ tour, autoAvance = true }: { tour: Tour; autoAvance?: boolean }) {
  const galeria = tour.galeria ?? [tour.foto]

  return (
    <article className="tour-card group relative flex flex-col overflow-hidden rounded-card-grande bg-papel shadow-card ring-1 ring-linea transition motion-safe:hover:-translate-y-1 hover:shadow-card-flotante">
      <div className="relative z-20 h-64">
        <CarruselImagenes imagenes={galeria} etiqueta={tour.nombre} autoAvance={autoAvance} className="h-full" />
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-chip bg-papel/90 px-3 py-1 text-xs font-medium text-navy shadow-sm backdrop-blur-sm">
          {tour.audienciaChip}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-h3 font-semibold text-navy">{tour.nombre}</h3>
          {tour.precioLight !== null && (
            <p className="shrink-0 text-right leading-none">
              <span className="mb-0.5 block text-xs text-navy-soft">desde</span>
              <span className="font-display text-precio font-semibold text-navy">{formatoDinero(tour.precioLight)}</span>
            </p>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-navy-sub">{tour.descripcionCorta}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-soft">
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-estrella text-estrella" aria-hidden="true" />
            {tour.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {tour.duracionCorta}
          </span>
          {tour.maxPax && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              máx. {tour.maxPax}
            </span>
          )}
        </div>

        {tour.destacados && (
          <div className="flex flex-wrap gap-1.5">
            {tour.destacados.map((d) => (
              <span
                key={d}
                className="rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* CTA — "stretched link" (after:inset-0): toda la card navega, salvo
            el carrusel (z-20, encima del overlay z-10). Sin cambio de color en
            :hover — con el stretched link, hover en cualquier parte de la card
            dispararía el :hover del ancla y "lavaría" el botón; el feedback lo
            da el lift/sombra de la card. La flecha sí se corre un pelo. */}
        <div className="mt-auto pt-3">
          <EnlacePrototipo className="group/cta flex w-full items-center justify-center gap-2 rounded-chip bg-navy px-4 py-3 text-sm font-semibold text-white shadow-boton-relieve after:absolute after:inset-0 after:z-10">
            Ver tour
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EnlacePrototipo>
        </div>
      </div>
    </article>
  )
}
