import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Mail, UtensilsCrossed } from 'lucide-react'
import type { PlatoMenu } from '@/data/tours'

// Paso 1 del funnel: cada persona elige su plato del paquete que vino del widget.
// Es el diferenciador de reservar directo —«eliges tu plato por persona»— hecho
// pantalla.
//
// 2026-07-17 (feedback de Samuel: el Select era "poco ilustrativo"): cada
// persona es un ACORDEÓN propio que se expande/colapsa, y dentro elige entre las
// mismas CARDS con foto que la sección de menú de la ficha (no un desplegable).
// 2026-07-17 (2ª vuelta, pedido de Samuel: el click en una card auto-avanzaba a
// la siguiente persona sin confirmar y se sentía sin control): ahora el click
// SOLO marca el plato (check + ring aqua) y aparece un botón «Siguiente» al pie
// del acordeón, deshabilitado mientras no haya plato, que es el que confirma y
// avanza. Esto le devuelve al visitante la sensación de estar conduciendo el
// flujo paso a paso. La fila inferior también muestra «Seleccionado: <plato>»
// como confirmación explícita antes de pulsar. Prototipo de UX: la elección
// vive en el estado del funnel, no viaja a ningún motor (xpotours bloqueado; la
// frontera es el depósito).
//
// 2026-08-07 (pedido de Samuel): elegir plato DEJA DE SER OBLIGATORIO para
// reservar. «Por si no tienes claro algún plato, que esto no sea una fricción».
// Es un menú de comida elegido con semanas de antelación y a veces con gente
// que ni siquiera está en la habitación: obligar a decidirlo en la pantalla del
// pago es pedir una decisión menor en el peor momento posible. Como de todas
// formas se manda un correo confirmando las comidas, la salida honesta es
// decirlo aquí y dejar seguir. Lo que NO se hace es esconder el paso: quien lo
// tiene claro elige ahora y ve sus platos en el resumen.
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

  // Solo marca el plato en el state. NO avanza — el avance lo decide el visitante
  // con el botón «Siguiente» (más control y sensación de progreso, 2026-07-17).
  const elegir = (persona: number, plato: string) => {
    onCambio(persona, plato)
  }

  // Confirma y pasa a la siguiente persona sin plato (o cierra todas si ya
  // eligieron). `seleccion` aún contiene el plato actual, así que se excluye
  // con i !== persona para encontrar la próxima pendiente.
  const avanzar = (persona: number) => {
    const siguiente = seleccion.findIndex((p, i) => i !== persona && !p)
    setExpandida(siguiente)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        {nombrePaquete} menu · each person picks their dish, cooked fresh on board in the floating kitchen. You can
        change it up to 48 h before the tour.
      </p>

      {/* La salida sin fricción, ARRIBA y no escondida al pie: quien no lo tiene
          claro tiene que verla ANTES de empezar a abrir acordeones. */}
      <p className="flex items-start gap-2.5 rounded-card border border-linea bg-papel-hueso px-4 py-3 text-sm text-navy-sub">
        <Mail className="mt-0.5 size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-navy">You don’t have to decide now.</strong> We’ll email you to confirm
          the meals — you can choose there, or from “My booking”, up to 48 h before the tour.
        </span>
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
                    <p className="font-display text-sm font-semibold text-navy">Person {i + 1}</p>
                    {elegido ? (
                      <p className="truncate text-xs font-medium text-menta-texto">Done · {elegido}</p>
                    ) : (
                      <p className="text-xs text-navy-soft">Choose your dish (optional)</p>
                    )}
                  </div>
                </div>
                {elegido && !abierta ? (
                  <span className="shrink-0 text-sm font-medium text-aqua-dark">Change</span>
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

                  {/* Fila de confirmación + avance: aísla el botón del grid para
                      que se lea como un paso explícito (no otro botón de card) y
                      muestra al visitante QUÉ plato lleva antes de pulsar
                      «Siguiente» — refuerza la sensación de control. 2026-07-17. */}
                  {/* 2026-08-07: el botón ya NO se deshabilita sin plato — cambia
                      de trabajo. Con plato confirma y avanza («Siguiente»); sin
                      plato avanza igual y lo dice («Lo decido luego»), que es la
                      salida sin fricción hecha botón en vez de un callejón. */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-linea pt-4">
                    <p className="text-xs text-navy-soft">
                      {elegido ? (
                        <>
                          Selected: <span className="font-semibold text-navy">{elegido}</span>
                        </>
                      ) : (
                        'Not chosen yet — we’ll confirm it by email'
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => avanzar(i)}
                      className="inline-flex items-center justify-center gap-2 rounded-btn border-2 border-aqua-dark bg-white px-4 py-2.5 text-sm font-semibold text-aqua-dark transition hover:bg-aqua-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
                    >
                      {elegido ? 'Next' : 'I’ll decide later'}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
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
