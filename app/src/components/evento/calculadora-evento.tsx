import { useState } from 'react'
import { Minus, Plus, Users } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as FancyButton from '@/components/alignui/fancy-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { formatoDinero } from '@/data/home'
import { totalPaqueteEvento, type PaqueteEvento } from '@/data/eventos'

// Reserva online de eventos (correcciones v2, plan 03 §1 — slides 14 y 15:
// «agregar reserva online y debajo el formulario de cotización»).
//
// Hasta ahora las 3 landings de evento eran 100% asíncronas: pedías
// presupuesto y alguien te contestaba. Eso trataba igual a quien quiere un
// party boat estándar de 20 personas que a quien organiza una boda de 120 con
// menú a medida — y no son el mismo cliente.
//
// El cliente confirmó en la reunión del 07-24 (12:53) que sí quiere reserva
// online, y el tarifario que lo permite ya existe y es de PRECIO CERRADO:
// US$ 1.188 para 1-12 personas + US$ 99 por cada persona extra (Samuel lo leyó
// en voz alta a las 13:05 y propuso «hacerlo tal cual como está el resto»).
//
// ⚠️ MODELO MARGINAL, no sustitución de tramo. Los eventos son el único
// producto que funciona así: base fija hasta 12 y luego un tanto por cabeza.
// Los tours (charter, Saona) usan sustitución — ver lib/tarifas.ts. No
// mezclar los dos.
//
// FRONTERA DEL BUILD: igual que en tours, esto NO cobra. El depósito es el 25%
// (decisión de Samuel, 2026-07-27 — el mismo que los tours, sin porcentaje
// especial por ser evento) y el paso de pago lo dirá con todas las letras
// cuando el funnel acepte slugs de evento. Mientras tanto, el CTA es
// EnlacePrototipo: enseña el estado real sin fingir que reserva.

const DEPOSITO = 0.25

export function CalculadoraEvento({ paquetes }: { paquetes: PaqueteEvento[] }) {
  const conPrecio = paquetes.filter((p) => p.precioBase !== null)
  const [elegido, setElegido] = useState(conPrecio[0]?.id ?? '')
  const [personas, setPersonas] = useState(12)

  if (conPrecio.length === 0) return null

  const paquete = conPrecio.find((p) => p.id === elegido) ?? conPrecio[0]
  const total = totalPaqueteEvento(paquete, personas)
  const incluidas = paquete.incluyeHasta ?? 12
  const extras = Math.max(0, personas - incluidas)

  return (
    <div className="flex flex-col gap-4 rounded-card-grande bg-papel p-4 ring-1 ring-linea sm:p-5">
      <div>
        <p className="font-display text-lg font-semibold text-navy">Reserva online</p>
        <p className="mt-0.5 text-sm text-navy-sub">
          Paquetes con precio cerrado — sin esperar cotización.
        </p>
      </div>

      {/* Elegir paquete. Los 4 tienen precio publicado, así que los 4 son
          reservables directo; lo que necesita cotización es lo que se sale de
          estos paquetes (menú a medida, aforos grandes), y para eso está el
          formulario de abajo. */}
      <div className="flex flex-col gap-1.5">
        {conPrecio.map((p) => {
          const activo = p.id === paquete.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setElegido(p.id)}
              aria-pressed={activo}
              className={`flex items-baseline justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                activo ? 'border-aqua bg-aqua/5' : 'border-linea hover:bg-papel-hueso'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-navy">{p.nombre}</span>
                <span className="block text-xs text-navy-soft">{p.meta}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-navy">{p.precio}</span>
            </button>
          )
        })}
      </div>

      {/* Personas. Arranca en 12 (el tope del precio base) a propósito: es el
          número donde el paquete rinde más, y así el primer total que ve el
          visitante es el de la tarifa cerrada, sin extras. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub">Personas</span>
        <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
          <span className="flex items-center gap-2 text-paragraph-sm">
            <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
            <span className="text-navy-sub">Invitados</span>
          </span>
          <div className="flex items-center gap-2">
            <span
              key={personas}
              aria-live="polite"
              className="stepper-tick min-w-[2rem] text-center font-semibold tabular-nums text-navy"
            >
              {personas}
            </span>
            <div className="flex items-center gap-1">
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Quitar un invitado"
                disabled={personas <= 1}
                onClick={() => setPersonas((n) => Math.max(1, n - 1))}
                className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Minus} />
              </CompactButton.Root>
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Añadir un invitado"
                onClick={() => setPersonas((n) => n + 1)}
                className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Plus} />
              </CompactButton.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose. Se enseña SIEMPRE, no solo cuando hay extras: que el
          visitante vea de dónde sale el total es la mitad del argumento de
          reservar directo. */}
      {total !== null ? (
        <div className="flex flex-col gap-1.5 border-t border-linea pt-3 text-sm">
          <div className="flex justify-between text-navy-sub">
            <span>Paquete (hasta {incluidas} personas)</span>
            <span className="tabular-nums">{formatoDinero(paquete.precioBase!)}</span>
          </div>
          {extras > 0 ? (
            <div className="flex justify-between text-navy-sub">
              <span>
                {extras} {extras === 1 ? 'persona extra' : 'personas extra'} ×{' '}
                {formatoDinero(paquete.porPersonaExtra ?? 0)}
              </span>
              <span className="tabular-nums">
                {formatoDinero(extras * (paquete.porPersonaExtra ?? 0))}
              </span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between border-t border-linea pt-2 font-display text-lg font-semibold text-navy">
            <span>Total</span>
            <span className="tabular-nums">{formatoDinero(total)}</span>
          </div>
          <p className="text-xs text-navy-soft">
            Reservas con el {DEPOSITO * 100}% ({formatoDinero(Math.round(total * DEPOSITO))}) y pagas
            el resto el día del evento.
          </p>
        </div>
      ) : null}

      <EnlacePrototipo>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <span>Reservar este paquete</span>
        </FancyButton.Root>
      </EnlacePrototipo>
    </div>
  )
}
