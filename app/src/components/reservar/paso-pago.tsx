import { Lock } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { formatoDinero } from '@/data/home'

// Sección 4 del funnel (Fase C, layout Viator): «Pago». El desglose completo del
// precio vive en la columna derecha (ResumenReserva), así que aquí solo va cómo
// funciona el pago + el CTA. FRONTERA del build: «Pagar depósito» NO cobra — el
// motor xpotours sigue pendiente del cliente. Se dice con todas las letras en
// vez de fingir un cobro o una confirmación que no ha ocurrido (misma honestidad
// que EnlacePrototipo y el resto del build).
export function PasoPago({
  deposito,
  saldo,
  frontera,
  onPagar,
}: {
  deposito: number
  saldo: number
  frontera: boolean
  onPagar: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        Confirma tu plaza pagando hoy solo el <strong className="font-semibold text-navy">depósito del 25%</strong> (
        {formatoDinero(deposito)}). El saldo de {formatoDinero(saldo)} lo pagas el día del tour — con un 5% de descuento
        si es en efectivo a bordo.
      </p>

      {frontera ? (
        <div className="flex items-start gap-3 rounded-card bg-menta p-4 text-sm text-menta-texto">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Hasta aquí llega el prototipo. Aquí se conectaría la pasarela para cobrar el depósito de{' '}
            <strong className="font-semibold">{formatoDinero(deposito)}</strong> — el motor de reservas (xpotours) está
            pendiente de decisión del cliente, así que no se procesa ningún cobro real.
          </p>
        </div>
      ) : (
        <FancyButton.Root variant="primary" className="w-full" onClick={onPagar}>
          Pagar depósito — {formatoDinero(deposito)}
        </FancyButton.Root>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> Pago seguro · Cancela gratis hasta 7 días antes
      </p>
    </div>
  )
}
