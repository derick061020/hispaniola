import { TOURS } from '@/data/home'
import { TourCard } from './tour-card'

// Los 4 productos, de una — Saona entra al catálogo visible con nombre
// propio (ver NOTAS['home-tours'] del prototipo).
export function ToursGrid() {
  return (
    <section id="tours" className="scroll-mt-20 px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Nuestros tours</p>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">Elige tu día en el Caribe</h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOURS.map((t) => (
            <TourCard key={t.slug} tour={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
