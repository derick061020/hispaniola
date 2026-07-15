import { useState } from 'react'
import { TOURS } from '@/data/home'
import { Etiqueta } from '@/components/ui/etiqueta'
import { TourCard } from './tour-card'
import { useDevFlag } from '@/dev/use-dev-flag'

// El escaparate: solo los 3 productos con galería propia (semi-privado,
// snorkel-lovers, charter-privado — como la web original). Isla Saona no tiene
// galería y se queda FUERA del grid (v3-F20, decisión de Samuel); sigue viva en
// el ticker, el megamenú de Tours, el footer y el menú móvil, que solo usan su
// `foto` única.
const TOURS_ESCAPARATE = TOURS.filter((t) => t.galeria && t.galeria.length > 0)

export function ToursGrid() {
  // [dev-mode] ?dev-tours=estatico congela los carruseles en su 1ª foto (sin
  // auto-avance) → frame limpio para Figma. Ver dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-tours', (v) => setEstatico(v === 'estatico')) // [dev-mode]

  return (
    <section id="tours" className="scroll-mt-20 px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <Etiqueta>Nuestros tours</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">Elige tu día en el Caribe</h2>

        {/* tours-cards: activa el hover de GRUPO de las cards (:has(), ver
            componentes.css) — v3-F17.2. */}
        <div className="tours-cards mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOURS_ESCAPARATE.map((t) => (
            <TourCard key={t.slug} tour={t} autoAvance={!estatico} /> // [dev-mode] gate
          ))}
        </div>
      </div>
    </section>
  )
}
