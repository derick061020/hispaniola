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
        Confirm your spot by paying only the <strong className="font-semibold text-navy">25% deposit</strong> today{' '}
        ({formatoDinero(deposito)}). You pay the remaining {formatoDinero(saldo)} on the day of the tour, with a 5%
        discount if you pay cash on board.
      </p>

      {/* Entrando directo a /book/:slug (sin pasar por el widget) la reserva
          llegaba hasta aquí SIN FECHA y el botón cobraba igual. 2026-08-07: el
          paso se bloquea y dice dónde se arregla — el calendario está a la
          derecha, en el resumen (en móvil, arriba del todo). */}
      {!fechaElegida ? (
        <p className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          You haven’t chosen <strong className="text-navy">the date</strong> yet. Pick it in your booking summary so you
          can confirm.
        </p>
      ) : null}

      {/* [2026-08-21, auditoría móvil] `max-lg:hidden` — igual que el
          «Continuar» de los otros pasos: en móvil el botón de pagar vive en
          BarraMovilReserva, fija abajo y con el importe del depósito al lado.
          Lo que SÍ se queda visible en móvil es lo de alrededor: el aviso de
          que falta la fecha y la línea de pago seguro, que es la reassurance
          copy del instante de pagar. */}
      <FancyButton.Root
        variant="primary"
        className="w-full max-lg:hidden"
        disabled={!fechaElegida}
        onClick={onPagar}
      >
        Pay deposit · {formatoDinero(deposito)}
      </FancyButton.Root>

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> Secure payment · Free cancellation up to 7 days before
      </p>
    </div>
  )
}
