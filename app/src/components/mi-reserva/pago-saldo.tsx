import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { RiMastercardFill, RiVisaFill } from '@remixicon/react'
import { Campo } from '@/components/ui/campo'
import { confirmarPago, pagarSaldo } from '@/lib/api/api'
import { cargarStripe, estiloCampoTarjeta, mensajeDeError, type CampoTarjeta } from '@/lib/pagos/stripe'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

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
export function PagoSaldo({
  codigo,
  token,
  saldo,
  onPagado,
}: {
  codigo: string
  token: string
  saldo: number
  /** El saldo ya está cobrado: la pantalla recarga la reserva desde Odoo. */
  onPagado: () => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [preparando, setPreparando] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [titular, setTitular] = useState('')
  const [completa, setCompleta] = useState(false)

  const contenedor = useRef<HTMLDivElement | null>(null)
  const elemento = useRef<CampoTarjeta | null>(null)
  const secreto = useRef<string | null>(null)
  const claveStripe = useRef<string>('')

  // El intento de cobro se crea al ABRIR el formulario, no al pulsar «Pay».
  // Así el campo de la tarjeta ya está montado y validado cuando el visitante
  // decide, y un fallo de configuración (Stripe apagado) se ve antes de teclear
  // un número de tarjeta.
  useEffect(() => {
    if (!abierto) return
    let vivo = true
    setPreparando(true)
    setError(null)

    pagarSaldo(codigo, token)
      .then(async (intento) => {
        if (!vivo) return
        if (!intento.client_secret) throw new Error(t('Stripe did not return a payment secret.'))
        secreto.current = intento.client_secret
        claveStripe.current = intento.publishable_key || ''
        const stripe = await cargarStripe(claveStripe.current)
        if (!vivo || !contenedor.current) return
        const campo = stripe.elements({ locale: 'en' }).create('card', {
          style: estiloCampoTarjeta(),
          hidePostalCode: true,
        })
        campo.on('change', (e) => {
          setCompleta(e.complete)
          setError(e.error?.message ?? null)
        })
        campo.mount(contenedor.current)
        elemento.current = campo
      })
      .catch((e: unknown) => {
        if (!vivo) return
        setError(
          e instanceof Error && e.message
            ? e.message
            : t('We could not open the card form. Try again in a moment.'),
        )
      })
      .finally(() => {
        if (vivo) setPreparando(false)
      })

    return () => {
      vivo = false
      elemento.current?.destroy()
      elemento.current = null
      secreto.current = null
      setCompleta(false)
    }
  }, [abierto, codigo, token])

  const pagar = async () => {
    if (procesando || !secreto.current || !elemento.current) return
    setProcesando(true)
    setError(null)
    try {
      const stripe = await cargarStripe(claveStripe.current)
      const { error: fallo, paymentIntent } = await stripe.confirmCardPayment(secreto.current, {
        payment_method: { card: elemento.current, billing_details: { name: titular.trim() } },
      })
      if (fallo) throw new Error(mensajeDeError(fallo))
      try {
        await confirmarPago(codigo, token, { paymentIntentId: paymentIntent?.id })
      } catch {
        // El cobro está hecho; el estado real llega por webhook.
      }
      onPagado()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('The payment could not be completed.'))
      setProcesando(false)
    }
  }

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
        <p className="text-sm font-semibold text-navy">{t('Pay')}{' '}{formatoDinero(saldo)} {t('by card')}</p>
        <span className="flex items-center gap-1.5">
          <RiVisaFill className="size-6 text-navy-soft" aria-hidden="true" />
          <RiMastercardFill className="size-6 text-navy-soft" aria-hidden="true" />
        </span>
      </div>

      <fieldset className="mt-3 flex flex-col gap-3" disabled={procesando}>
        <legend className="sr-only">{t('Card details')}</legend>
        <Campo
          etiqueta={t('Name on card')}
          autoComplete="cc-name"
          placeholder={t('As printed on the card')}
          value={titular}
          onChange={(e) => setTitular(e.target.value)}
        />
        <div>
          <span className="text-sm font-medium text-navy">{t('Card details')}</span>
          {/* El iframe de Stripe se monta aquí: el recuadro es nuestro, lo de
              dentro es suyo. */}
          <div
            ref={contenedor}
            className="mt-1.5 w-full rounded-btn bg-papel px-4 py-3 ring-1 ring-linea focus-within:ring-2 focus-within:ring-aqua"
          />
          {preparando ? <p className="mt-1.5 text-xs text-navy-soft">{t('Preparing the payment…')}</p> : null}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {error} <strong className="text-navy">{t('Nothing was charged')}</strong> {t('— your booking is untouched.')}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pagar}
          disabled={procesando || preparando || !completa || titular.trim() === ''}
          className="flex-1 rounded-btn bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {procesando ? 'Processing…' : `Pay ${formatoDinero(saldo)}`}
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
