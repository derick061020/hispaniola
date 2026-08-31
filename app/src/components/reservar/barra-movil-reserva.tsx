import * as FancyButton from '@/components/alignui/fancy-button'
import { t } from '@/lib/i18n'
import { Spinner } from '@/components/ui/spinner'
import { formatoDinero } from '@/data/home'

// Barra inferior fija del funnel de reserva en móvil.
//
// [2026-08-21, auditoría móvil] POR QUÉ EXISTE. En móvil la tarjeta del
// resumen va la primera (el `order-first` de reservar.tsx, puesto para que
// nadie rellene el formulario sin ver qué compra) — pero no es sticky, así que
// en cuanto se baja al paso 1 desaparece y ya no vuelve. Medido: desde que se
// empieza a escribir el nombre hasta que se pulsa «pagar» no hay UN SOLO píxel
// de pantalla que diga cuánto cuesta ni cuánto se cobra hoy. En un checkout,
// perder el precio de vista es la forma más barata de perder la venta.
//
// Hace dos cosas a la vez, que es justo lo que hacen los checkouts móviles que
// funcionan (Booking, Viator):
//
//  1. DEJA EL PRECIO A LA VISTA — y el que importa hoy: el depósito. El total
//     va debajo, en pequeño, porque es el que se paga el día del tour.
//  2. LLEVA LA ACCIÓN DEL PASO ACTIVO. En móvil el `Continuar` de cada
//     sección y el «Pay deposit» de PasoPago se ESCONDEN (`max-lg:hidden` en
//     reservar.tsx): el botón vive aquí y solo aquí. Con los dos a la vez
//     habría dos botones idénticos en pantalla, y el de dentro del acordeón
//     queda fuera de alcance en cuanto la sección crece — el paso de contacto
//     mide 1.100px con las píldoras de celebración desplegadas.
//
// El botón deshabilitado NO se oculta: que se vea apagado es lo que dice que
// todavía falta algo por rellenar. Ocultarlo dejaría la barra sin acción y
// parecería rota.
//
// pb-[max(...,env(safe-area-inset-bottom))]: mismo motivo que en las otras
// barras del sitio — la franja del gesto de swipe-to-home del iPhone.
export function BarraMovilReserva({
  deposito,
  total,
  texto,
  habilitado,
  cargando = false,
  onAccion,
}: {
  deposito: number
  total: number
  /** Copy del CTA del paso activo (cambia en el paso del menú y en el de pago). */
  texto: string
  habilitado: boolean
  /** Cobro en curso: rueda de carga y botón bloqueado hasta que Stripe conteste. */
  cargando?: boolean
  onAccion: () => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-linea bg-papel px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-card lg:hidden">
      <div className="min-w-0">
        <p className="text-xs text-navy-soft">{t('You pay today')}</p>
        <p className="font-display text-base font-semibold text-navy">
          {formatoDinero(deposito)}
          <span className="ml-1.5 text-xs font-normal text-navy-soft">{t('of')} {formatoDinero(total)}</span>
        </p>
      </div>

      <FancyButton.Root
        variant="primary"
        className="h-11 shrink-0"
        disabled={!habilitado || cargando}
        onClick={onAccion}
      >
        {cargando ? (
          // En móvil esta barra es el ÚNICO botón de pagar (el de dentro del
          // paso lleva `max-lg:hidden`), así que es aquí donde tiene que verse
          // que el cobro está en marcha. Y bloqueado: sin esto se vuelve a
          // pulsar a los dos segundos creyendo que no ha hecho nada.
          <span className="inline-flex items-center gap-2">
            <Spinner /> {t('Processing…')}
          </span>
        ) : (
          texto
        )}
      </FancyButton.Root>
    </div>
  )
}
