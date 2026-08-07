import { Lock } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { formatoDinero } from '@/data/home'

// Sección 4 del funnel (Fase C, layout Viator): «Pago». El desglose completo
// del precio vive en la columna derecha (ResumenReserva), así que aquí solo
// va cómo funciona el pago + el CTA. El "Pagar depósito" del padre (reservar.tsx)
// guarda la reserva en localStorage y navega a /reservar/:slug/gracias —
// este componente solo dispara el callback, no sabe nada de la navegación.
export function PasoPago({
  deposito,
  saldo,
  fechaElegida,
  onPagar,
}: {
  deposito: number
  saldo: number
  /** Sin fecha no se puede pagar — ver el aviso de abajo. */
  fechaElegida: boolean
  onPagar: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        Confirma tu plaza pagando hoy solo el <strong className="font-semibold text-navy">depósito del 25%</strong>{' '}
        ({formatoDinero(deposito)}). El saldo de {formatoDinero(saldo)} lo pagas el día del tour — con un 5% de descuento
        si es en efectivo a bordo.
      </p>

      {/* Entrando directo a /book/:slug (sin pasar por el widget) la reserva
          llegaba hasta aquí SIN FECHA y el botón cobraba igual. 2026-08-07: el
          paso se bloquea y dice dónde se arregla — el calendario está a la
          derecha, en el resumen (en móvil, arriba del todo). */}
      {!fechaElegida ? (
        <p className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          Todavía no has elegido <strong className="text-navy">la fecha</strong>. Escógela en el resumen de tu reserva
          para poder confirmar.
        </p>
      ) : null}

      <FancyButton.Root variant="primary" className="w-full" disabled={!fechaElegida} onClick={onPagar}>
        Pagar depósito — {formatoDinero(deposito)}
      </FancyButton.Root>

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> Pago seguro · Cancela gratis hasta 7 días antes
      </p>
    </div>
  )
}
