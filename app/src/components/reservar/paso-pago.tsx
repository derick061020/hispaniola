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
  onPagar,
}: {
  deposito: number
  saldo: number
  onPagar: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        Confirma tu plaza pagando hoy solo el <strong className="font-semibold text-navy">depósito del 25%</strong>{' '}
        ({formatoDinero(deposito)}). El saldo de {formatoDinero(saldo)} lo pagas el día del tour — con un 5% de descuento
        si es en efectivo a bordo.
      </p>

      <FancyButton.Root variant="primary" className="w-full" onClick={onPagar}>
        Pagar depósito — {formatoDinero(deposito)}
      </FancyButton.Root>

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> Pago seguro · Cancela gratis hasta 7 días antes
      </p>
    </div>
  )
}
