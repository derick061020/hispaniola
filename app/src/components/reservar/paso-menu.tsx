import { useState } from 'react'
import { Check, ChevronDown, UtensilsCrossed } from 'lucide-react'
import type { PlatoMenu } from '@/data/tours'

// Paso 1 del funnel: cada persona elige su plato del paquete que vino del widget.
// Es el diferenciador de reservar directo —«eliges tu plato por persona»— hecho
// pantalla.
//
// 2026-07-17 (feedback de Samuel: el Select era "poco ilustrativo"): cada
// persona es un ACORDEÓN propio que se expande/colapsa, y dentro elige entre las
// mismas CARDS con foto que la sección de menú de la ficha (no un desplegable).
// Al elegir, esa persona se colapsa mostrando «Listo · <plato>» y se abre la
// siguiente sin elegir; se puede reabrir para cambiarlo. Prototipo de UX: la
// elección vive en el estado del funnel, no viaja a ningún motor (xpotours
// bloqueado; la frontera es el depósito).
export function PasoMenu({
  platosDisponibles,
  seleccion,
  onCambio,
  nombrePaquete,
}: {
  platosDisponibles: PlatoMenu[]
  /** nombre del plato elegido por persona (índice = nº de persona - 1); '' = sin elegir */
  seleccion: string[]
  onCambio: (persona: number, plato: string) => void
  nombrePaquete: string
}) {
  // Qué persona está expandida eligiendo. Abre en la primera (la 1ª sin plato).
  const [expandida, setExpandida] = useState(0)

  const elegir = (persona: number, plato: string) => {
    onCambio(persona, plato)
    // Colapsa esta persona y abre la siguiente que aún no ha elegido (o cierra
    // todo si ya no queda ninguna). `seleccion` está «vieja» aquí, pero la
    // persona actual se excluye con i !== persona, así que el cálculo es correcto.
    const siguiente = seleccion.findIndex((p, i) => i !== persona && !p)
    setExpandida(siguiente)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        Menú {nombrePaquete} · cada persona elige su plato, recién hecho a bordo en la cocina flotante. Puedes cambiarlo
        hasta 48 h antes del tour.
      </p>

      <div className="flex flex-col gap-3">
        {seleccion.map((elegido, i) => {
          const abierta = expandida === i
          return (
            <div key={i} className="overflow-hidden rounded-card border border-linea bg-papel">
              <button
                type="button"
                onClick={() => setExpandida(abierta ? -1 : i)}
                aria-expanded={abierta}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      elegido ? 'bg-navy text-white' : 'bg-papel-hueso text-navy-soft ring-1 ring-linea'
                    }`}
                  >
                    {elegido ? <Check className="size-4" aria-hidden="true" /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-navy">Persona {i + 1}</p>
                    {elegido ? (
                      <p className="truncate text-xs font-medium text-menta-texto">Listo · {elegido}</p>
                    ) : (
                      <p className="text-xs text-navy-soft">Elige tu plato</p>
                    )}
                  </div>
                </div>
                {elegido && !abierta ? (
                  <span className="shrink-0 text-sm font-medium text-aqua-dark">Cambiar</span>
                ) : (
                  <ChevronDown
                    className={`size-5 shrink-0 text-navy-soft transition-transform ${abierta ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                )}
              </button>

              {abierta ? (
                <div className="border-t border-linea p-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {platosDisponibles.map((plato) => {
                      const activo = elegido === plato.nombre
                      return (
                        <button
                          key={plato.nombre}
                          type="button"
                          onClick={() => elegir(i, plato.nombre)}
                          aria-pressed={activo}
                          className={`overflow-hidden rounded-card text-left transition ${
                            activo ? 'ring-2 ring-aqua' : 'ring-1 ring-linea hover:ring-linea-fuerte'
                          }`}
                        >
                          <div className="relative">
                            {plato.foto ? (
                              <img
                                src={`/fotos/${plato.foto}.webp`}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                className="h-24 w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-24 w-full place-items-center bg-aqua-tint text-aqua-dark">
                                <UtensilsCrossed className="size-6" aria-hidden="true" />
                              </div>
                            )}
                            {activo ? (
                              <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-aqua text-white">
                                <Check className="size-4" aria-hidden="true" />
                              </span>
                            ) : null}
                          </div>
                          <div className="bg-papel p-2.5">
                            <p className="font-display text-sm font-semibold text-navy">{plato.nombre}</p>
                            {plato.desc ? <p className="mt-0.5 text-xs text-navy-soft">{plato.desc}</p> : null}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
