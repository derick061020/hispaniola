import { useState } from 'react'
import { TOURS } from '@/data/home'
import { Etiqueta } from '@/components/ui/etiqueta'
import { TourCard } from './tour-card'
import { useDevFlag } from '@/dev/use-dev-flag'

// El escaparate: 4 productos con galería propia (semi-privado, snorkel-lovers,
// charter-privado, isla-saona). v3 (2026-07-17): Saona deja de ser
// "pendiente de confirmar" y se publica con contenido real de la web del
// cliente (3 sub-variantes speedboat/fishing/catamarán, galería de 11 fotos,
// itinerario real, menú buffet) — entra al escaparate como un producto más.
// Sigue viva en el ticker, el megamenú, el footer y el menú móvil (que
// solo leen `TOURS`, no este filtro), y ahora también aquí.
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
            componentes.css) — v3-F17.2.
            v3 (2026-07-17, con Saona): 4 cards en vez de 3 → rejilla 2×2 en
            tablet/desktop y 4×1 en xl (antes era 3×1 en lg, que con 4 cards
            dejaba 1ª fila 3 + 2ª fila 1 card suelta, feo). En xl la fila de
            4 funciona porque la TourCard ya tenía tamaño cómodo para grids
            de 3 — el ancho por card se reduce un poco, sigue legible. */}
        <div className="tours-cards mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {TOURS_ESCAPARATE.map((t) => (
            <TourCard key={t.slug} tour={t} autoAvance={!estatico} /> // [dev-mode] gate
          ))}
        </div>
      </div>
    </section>
  )
}
