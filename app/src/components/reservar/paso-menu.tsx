import { UtensilsCrossed } from 'lucide-react'
import * as Select from '@/components/alignui/select'
import type { PlatoMenu } from '@/data/tours'

// Paso 1 del funnel (/reservar): cada persona elige su plato del paquete que
// vino elegido del widget. Es el diferenciador de reservar directo —«eliges tu
// plato por persona» (BENEFICIOS_DIRECTO de la home)— hecho pantalla. Prototipo
// de UX: la elección se guarda en el estado del funnel, no viaja a ningún motor
// (xpotours sigue bloqueado; la frontera es el depósito).
export function PasoMenu({
  platosDisponibles,
  seleccion,
  onCambio,
  nombrePaquete,
}: {
  platosDisponibles: PlatoMenu[]
  /** nombre del plato elegido por persona (índice = nº de persona - 1) */
  seleccion: string[]
  onCambio: (persona: number, plato: string) => void
  nombrePaquete: string
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">Elige el plato de cada persona</h2>
        <p className="mt-1 text-sm text-navy-sub">
          Menú {nombrePaquete} · cada plato se prepara al momento en la cocina flotante. Puedes cambiarlo hasta 48 h antes
          del tour.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {seleccion.map((elegido, i) => {
          const plato = platosDisponibles.find((p) => p.nombre === elegido)
          return (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-card bg-fondo-ficha p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:w-44 sm:shrink-0">
                {plato?.foto ? (
                  <img
                    src={`/fotos/${plato.foto}.webp`}
                    alt=""
                    aria-hidden="true"
                    className="size-12 shrink-0 rounded-btn object-cover"
                  />
                ) : (
                  <div className="grid size-12 shrink-0 place-items-center rounded-btn bg-aqua-tint text-aqua-dark">
                    <UtensilsCrossed className="size-5" aria-hidden="true" />
                  </div>
                )}
                <span className="font-display text-sm font-semibold text-navy">Persona {i + 1}</span>
              </div>

              <div className="flex-1">
                <Select.Root value={elegido} onValueChange={(v) => onCambio(i, v)}>
                  <Select.Trigger aria-label={`Plato de la persona ${i + 1}`}>
                    <Select.TriggerIcon as={UtensilsCrossed} />
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {platosDisponibles.map((p) => (
                      <Select.Item key={p.nombre} value={p.nombre}>
                        {p.nombre}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {plato?.desc ? <p className="mt-1.5 text-xs text-navy-soft">{plato.desc}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
