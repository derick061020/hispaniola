import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { RiMastercardFill, RiVisaFill } from '@remixicon/react'
import { confirmarPago, pagarSaldo } from '@/lib/api/api'
import { FormularioStripe, type EstadoFormularioStripe } from '@/components/pagos/formulario-stripe'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'
import { Spinner } from '@/components/ui/spinner'

// [2026-08-18] COBRO DEL SALDO DESDE «MI RESERVA».
//
// Lo que había aquí era `onClick={() => setPagado(true)}`: el botón pintaba
// «Balance paid, nothing left to settle» sin mover un dólar, así que el cliente
// se iba creyendo que había pagado y a bordo se le volvía a cobrar. El endpoint
// (`POST /bookings/:code/pay-balance`) y su función de cliente (`pagarSaldo`)
// llevaban escritos desde el 2026-08-10 sin que nadie los llamara.
//
// El camino es el MISMO que el del depósito en el funnel, y a propósito: se
// crea el intento en el servidor (el importe lo pone Odoo, nunca este archivo),
// se confirma con Stripe.js —el número de la tarjeta vive en su iframe— y se le
// avisa a Odoo, que vuelve a preguntarle a Stripe en vez de fiarse del
// navegador. Si ese último aviso falla, el webhook cierra el estado igual.
//
// Solo tarjeta: PayPal necesita salir del sitio y volver, y aquí no hay una
// pantalla de retorno donde capturar. Quien quiera pagar con PayPal lo hace a
// bordo o por WhatsApp, que es lo que dice el pie del bloque.
//
// [2026-09-14, pedido del cliente: Apple Pay / Google Pay / Link / Cash App]
// El Card Element se sustituye por el formulario de Stripe compartido
// (components/pagos/formulario-stripe.tsx), el mismo del funnel. Aquí el
// intento YA existe al abrir, así que se le pasa `clientSecret` y el importe
// lo manda el intento. Cash App en móvil puede salir y volver: vuelve a esta
// misma pantalla con `payment_intent` en la URL, y `mi-reserva.tsx` remata.
export function PagoSaldo({
  codigo,
  token,
  saldo,
  facturacion,
  onPagado,
}: {
  codigo: string
  token: string
  saldo: number
  /** Nombre, correo y teléfono de la reserva: no se vuelven a pedir. */
  facturacion: { nombre: string; email?: string; telefono?: string }
  /** El saldo ya está cobrado: la pantalla recarga la reserva desde Odoo. */
  onPagado: () => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [preparando, setPreparando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intento, setIntento] = useState<{ secreto: string; clave: string } | null>(null)
  const [estadoStripe, setEstadoStripe] = useState<EstadoFormularioStripe | null>(null)
  const pagarConStripe = useRef<(() => void) | null>(null)

  // El intento de cobro se crea al ABRIR el formulario, no al pulsar «Pay».
  // Así el formulario ya está montado y validado cuando el visitante decide,
  // y un fallo de configuración (Stripe apagado) se ve antes de teclear nada.
  useEffect(() => {
    if (!abierto) return
    let vivo = true
    setPreparando(true)
    setError(null)
    setIntento(null)

    pagarSaldo(codigo, token)
      .then((respuesta) => {
        if (!vivo) return
        if (!respuesta.client_secret) throw new Error(t('Stripe did not return a payment secret.'))
        setIntento({ secreto: respuesta.client_secret, clave: respuesta.publishable_key || '' })
      })
      .catch((e: unknown) => {
        if (!vivo) return
        setError(
          e instanceof Error && e.message
            ? e.message
            : t('We could not open the payment form. Try again in a moment.'),
        )
      })
      .finally(() => {
        if (vivo) setPreparando(false)
      })

    return () => {
      vivo = false
    }
  }, [abierto, codigo, token])

  const procesando = !!estadoStripe?.procesando
  const completa = !!estadoStripe?.completo

  const pagado = async (paymentIntentId?: string) => {
    try {
      await confirmarPago(codigo, token, { paymentIntentId })
    } catch {
      // El cobro está hecho; el estado real llega por webhook.
    }
    onPagado()
  }

  // Si Cash App se lleva el navegador, vuelve a ESTA reserva. `token` va en la
  // URL porque es la llave con la que la pantalla recarga sin pedir el correo.
  const returnUrl = `${window.location.origin}/my-booking?code=${encodeURIComponent(codigo)}&token=${encodeURIComponent(token)}`

  if (!abierto) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="w-full rounded-btn bg-coral px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          {t('Pay the balance online ·')}{' '}{formatoDinero(saldo)}
        </button>
        <p className="mt-2 text-center text-xs text-navy-soft">
          {t('Or pay in cash on board — you save 5% and there’s nothing to do here.')}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-card border border-linea bg-papel-hueso p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-navy">{t('Pay')}{' '}{formatoDinero(saldo)}</p>
        <span className="flex items-center gap-1.5">
          <RiVisaFill className="size-6 text-navy-soft" aria-hidden="true" />
          <RiMastercardFill className="size-6 text-navy-soft" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3">
        {preparando ? (
          <p className="flex items-center gap-1.5 text-xs text-navy-soft">
            <Spinner /> {t('Preparing the payment…')}
          </p>
        ) : null}
        {intento ? (
          <FormularioStripe
            clave={intento.clave}
            clientSecret={intento.secreto}
            importe={saldo}
            facturacion={facturacion}
            obtenerSecreto={async () => ({ client_secret: intento.secreto })}
            returnUrl={returnUrl}
            onPagado={pagado}
            onError={setError}
            onEstado={setEstadoStripe}
            registraPagar={(fn) => { pagarConStripe.current = fn }}
          />
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {error} <strong className="text-navy">{t('Nothing was charged')}</strong> {t('— your booking is untouched.')}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => pagarConStripe.current?.()}
          disabled={procesando || preparando || !completa}
          className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {procesando ? (
            <>
              <Spinner /> {t('Processing…')}
            </>
          ) : (
            `${t('Pay')} ${formatoDinero(saldo)}`
          )}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          disabled={procesando}
          className="rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso disabled:opacity-50"
        >
          {t('Cancel')}
        </button>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" />
        {t('Your card details never touch our servers.')}
      </p>
    </div>
  )
}
