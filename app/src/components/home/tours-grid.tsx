import { TOURS } from '@/data/home'
import { Etiqueta } from '@/components/ui/etiqueta'
import { TourCard } from './tour-card'

// Los 4 productos, de una — Saona entra al catálogo visible con nombre
// propio (ver NOTAS['home-tours'] del prototipo).
export function ToursGrid() {
  return (
    <section id="tours" className="scroll-mt-20 px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <Etiqueta>Nuestros tours</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">Elige tu día en el Caribe</h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOURS.map((t) => (
            <TourCard key={t.slug} tour={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
