import { useState } from 'react'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Boton } from '@/components/ui/boton'

// Galería + FAQ + cierre — última sección de contenido de la home. La
// galería completa (23 fotos) y el listado completo de FAQ viven fuera de
// alcance de este build (prototipo/); aquí se muestra una curaduría real.
const FOTOS_GRID = ['galeria-semi-privado-2', 'galeria-charter-privado-4', 'galeria-snorkel-lovers-4']
const FOTO_MAS_GALERIA = 'galeria-semi-privado-5'
const FOTOS_OCULTAS = 23 - FOTOS_GRID.length - 1

const FAQS = [
  { p: '¿Qué pasa si llueve el día de mi tour?', r: 'Reembolso total o cambio de fecha, sin costo.' },
  { p: '¿Puedo pagar solo el depósito?', r: 'Sí, confirmas con el 25% y pagas el resto el día del tour.' },
  { p: '¿Incluye recogida en mi hotel?', r: 'Sí, en todos los tours (excepto charters con punto de encuentro propio).' },
  { p: '¿Los niños pueden ir en todos los tours?', r: 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos.' },
]

export function GaleriaFaqCierre() {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <section className="bg-papel-hueso px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">El día, en imágenes</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {FOTOS_GRID.map((f) => (
                <div key={f} className="h-28 overflow-hidden rounded-lg sm:h-36">
                  <img src={`/fotos/${f}.webp`} alt="" className="size-full object-cover" />
                </div>
              ))}
              <EnlacePrototipo className="group relative h-28 overflow-hidden rounded-lg sm:h-36">
                <img src={`/fotos/${FOTO_MAS_GALERIA}.webp`} alt="" className="size-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/60 text-sm font-semibold text-white transition-colors group-hover:bg-navy/70">
                  +{FOTOS_OCULTAS} fotos
                </div>
              </EnlacePrototipo>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Preguntas frecuentes</p>
            <div className="mt-3 flex flex-col divide-y divide-linea rounded-card bg-papel ring-1 ring-linea">
              {FAQS.map((f, i) => (
                <div key={f.p}>
                  <button
                    type="button"
                    onClick={() => setAbierta((a) => (a === i ? null : i))}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-navy"
                  >
                    {f.p}
                    <span className="shrink-0 text-navy-soft">{abierta === i ? '−' : '+'}</span>
                  </button>
                  {abierta === i ? <p className="px-4 pb-3.5 text-sm text-navy-soft">{f.r}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm">
              <EnlacePrototipo className="font-semibold text-aqua-dark hover:underline">
                Ver todas las preguntas →
              </EnlacePrototipo>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-h2 font-semibold text-navy">Tu día en el Caribe empieza aquí</h2>
          <Boton href="#tours">Ver disponibilidad</Boton>
        </div>
      </div>
    </section>
  )
}
