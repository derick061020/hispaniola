import { useState } from 'react'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Boton } from '@/components/ui/boton'
import { PilaFotos, type FotoPila } from '@/components/ui/pila-fotos'
import { Etiqueta } from '@/components/ui/etiqueta'

// Galería + FAQ + cierre — última sección de contenido de la home. La
// galería completa (23 fotos) y el listado completo de FAQ viven fuera de
// alcance de este build (prototipo/); aquí se muestra una curaduría real.
//
// v2: el grid plano de 4 fotos pasa al PHOTO-STACK (passe-partout blanco +
// sombra + rotación) — el efecto que Samuel señaló de la ref. Vacationeeze.
const FOTOS_PILA: FotoPila[] = [
  { foto: 'galeria-semi-privado-2', alt: 'Pareja brindando en el agua junto al catamarán' },
  { foto: 'galeria-charter-privado-4', alt: 'Catamarán fondeado frente a una playa de palmeras' },
  { foto: 'galeria-snorkel-lovers-4', alt: 'Familia almorzando a bordo' },
]
const TOTAL_FOTOS_GALERIA = 23
const FOTOS_OCULTAS = TOTAL_FOTOS_GALERIA - FOTOS_PILA.length

const FAQS = [
  { p: '¿Qué pasa si llueve el día de mi tour?', r: 'Reembolso total o cambio de fecha, sin costo.' },
  { p: '¿Puedo pagar solo el depósito?', r: 'Sí, confirmas con el 25% y pagas el resto el día del tour.' },
  { p: '¿Incluye recogida en mi hotel?', r: 'Sí, en todos los tours (excepto charters con punto de encuentro propio).' },
  { p: '¿Los niños pueden ir en todos los tours?', r: 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos.' },
]

export function GaleriaFaqCierre() {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <section className="bg-papel-hueso px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <Etiqueta>El día, en imágenes</Etiqueta>
            <PilaFotos fotos={FOTOS_PILA} className="mt-8" />
            <p className="mt-6 text-center text-sm">
              <EnlacePrototipo className="font-semibold text-aqua-dark hover:underline">
                Ver las {FOTOS_OCULTAS} fotos restantes →
              </EnlacePrototipo>
            </p>
          </div>

          <div>
            <Etiqueta>Preguntas frecuentes</Etiqueta>
            <div className="mt-4 flex flex-col divide-y divide-linea rounded-card bg-papel ring-1 ring-linea">
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
