import type { Tour } from '@/data/home'
import { bookingCta, formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Card de tour — reusada en la banda de "Nuestros tours". La ficha de cada
// tour vive en prototipo/ (fuera de alcance), así que la card entera es un
// EnlacePrototipo; el "Ver tour" es solo la afordancia visual del CTA.
export function TourCard({ tour }: { tour: Tour }) {
  return (
    <EnlacePrototipo className="group flex flex-col overflow-hidden rounded-card bg-papel shadow-card ring-1 ring-linea transition-shadow hover:shadow-hero">
      <div className="relative h-44 overflow-hidden bg-papel-hueso">
        <img
          src={`/fotos/${tour.foto}.webp`}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2.5 left-2.5 rounded-chip bg-navy/85 px-2.5 py-1 text-xs font-medium text-white">
          {tour.audienciaChip}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="font-display text-lg font-semibold text-navy">{tour.nombre}</p>
        <p className="text-sm text-navy-soft">
          ★ {tour.rating} ({tour.resenas.toLocaleString('en-US')}) · {tour.duracionCorta}
          {tour.maxPax ? ` · máx. ${tour.maxPax}` : ''}
        </p>
        <p className="text-xs text-menta-texto">✓ Cancelación gratis</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-navy-soft">{tour.precioLight !== null ? 'desde' : ''}</p>
            <p className="font-display text-precio font-semibold text-navy">
              {tour.precioLight !== null ? formatoDinero(tour.precioLight) : bookingCta[tour.booking]}
            </p>
          </div>
          <span className="rounded-btn border border-aqua px-3 py-1.5 text-xs font-semibold text-aqua-dark">
            Ver tour
          </span>
        </div>
      </div>
    </EnlacePrototipo>
  )
}
