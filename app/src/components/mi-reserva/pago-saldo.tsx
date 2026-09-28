import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { RiMastercardFill, RiPaypalFill, RiVisaFill } from '@remixicon/react'
import { confirmarPago, obtenerConfig, pagarSaldo } from '@/lib/api/api'
import { FormularioStripe, type EstadoFormularioStripe, type FacturacionStripe } from '@/components/pagos/formulario-stripe'
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
// [2026-09-28] YA NO ES SOLO TARJETA: PAYPAL TAMBIÉN COBRA EL SALDO.
// Lo que faltaba no era el cobro —el endpoint ya sabía crear la orden— sino la
// pantalla de retorno: PayPal se lleva el navegador y vuelve. Vuelve AQUÍ, a
// `/my-booking?code=…&acceso=…&pp=1`, y `mi-reserva.tsx` captura la orden.
// El token de la reserva viaja como `acceso` y no como `token` porque PayPal
// añade su propio `token=<id de la orden>` de vuelta, y con los dos con el
// mismo nombre no hay forma de saber cuál es cuál.
//
// La opción solo se enseña si Odoo dice que PayPal está encendido para ESTE
// dominio (`/config` → `payments.paypal.enabled`), que es la misma puerta que
// usa el funnel.
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
  /** Nombre, correo, teléfono y país de la reserva: no se vuelven a pedir,
   *  pero Stripe los exige al confirmar (ver `formulario-stripe.tsx`). */
  facturacion: FacturacionStripe
  /** El saldo ya está cobrado: la pantalla recarga la reserva desde Odoo. */
  onPagado: () => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [medios, setMedios] = useState<{ tarjeta: boolean; paypal: boolean } | null>(null)
  const [metodo, setMetodo] = useState<'card' | 'paypal'>('card')
  const [yendoAPaypal, setYendoAPaypal] = useState(false)
  const [preparando, setPreparando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intento, setIntento] = useState<{ secreto: string; clave: string } | null>(null)
  const [estadoStripe, setEstadoStripe] = useState<EstadoFormularioStripe | null>(null)
  const pagarConStripe = useRef<(() => void) | null>(null)

  // Qué pasarelas hay encendidas. Se pregunta al abrir, no al montar: quien no
  // va a pagar el saldo online no tiene por qué provocar una llamada.
  useEffect(() => {
    if (!abierto) return
    const abortador = new AbortController()
    obtenerConfig(abortador.signal)
      .then((config) => {
        const disponibles = {
          tarjeta: config.payments.stripe.enabled && !!config.payments.stripe.publishable_key,
          paypal: config.payments.paypal.enabled,
        }
        setMedios(disponibles)
        // Con la tarjeta apagada y PayPal encendido, no hay nada que elegir.
        if (!disponibles.tarjeta && disponibles.paypal) setMetodo('paypal')
      })
      .catch(() => {
        // Si la config no llega, se sigue con tarjeta: es lo que había antes de
        // que existiera PayPal aquí, y el intento de Stripe dirá lo suyo.
        setMedios({ tarjeta: true, paypal: false })
      })
    return () => abortador.abort()
  }, [abierto])

  // El intento de cobro se crea al ABRIR el formulario, no al pulsar «Pay».
  // Así el formulario ya está montado y validado cuando el visitante decide,
  // y un fallo de configuración (Stripe apagado) se ve antes de teclear nada.
  useEffect(() => {
    if (!abierto || metodo !== 'card' || medios?.tarjeta === false) return
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
  }, [abierto, codigo, token, metodo, medios?.tarjeta])

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

  // PayPal cobra FUERA del sitio: aquí solo se pide la orden y se sale. El
  // importe lo sigue poniendo Odoo, y la vuelta la monta el backend con el
  // código y el token de esta reserva. Si algo falla, no se ha movido un dólar.
  const irAPaypal = async () => {
    setError(null)
    setYendoAPaypal(true)
    try {
      const respuesta = await pagarSaldo(codigo, token, 'paypal')
      if (!respuesta.approve_url) throw new Error(t('PayPal did not return an approval link.'))
      window.location.href = respuesta.approve_url
    } catch (e: unknown) {
      setYendoAPaypal(false)
      setError(
        e instanceof Error && e.message
          ? e.message
          : t('We could not open PayPal. Try again in a moment.'),
      )
    }
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
          {medios?.paypal ? (
            <RiPaypalFill className="size-6 text-navy-soft" aria-hidden="true" />
          ) : null}
        </span>
      </div>

      {/* El selector solo aparece si de verdad hay dos formas de pagar. Con
          una sola, elegir es una pregunta que no lleva a ningún sitio. */}
      {medios?.tarjeta && medios.paypal ? (
        <fieldset className="mt-3 grid grid-cols-2 gap-2">
          <legend className="sr-only">{t('Payment method')}</legend>
          <MetodoSaldo
            id="card"
            seleccionado={metodo === 'card'}
            onElegir={() => setMetodo('card')}
            etiqueta={t('Card')}
          />
          <MetodoSaldo
            id="paypal"
            seleccionado={metodo === 'paypal'}
            onElegir={() => setMetodo('paypal')}
            etiqueta={t('PayPal')}
          />
        </fieldset>
      ) : null}

      <div className="mt-3">
        {metodo === 'paypal' ? (
          <p className="text-xs leading-relaxed text-navy-sub">
            {t('You’ll be taken to PayPal to approve the payment and brought straight back here.')}
          </p>
        ) : (
          <>
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
          </>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {error} <strong className="text-navy">{t('Nothing was charged')}</strong> {t('— your booking is untouched.')}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => (metodo === 'paypal' ? irAPaypal() : pagarConStripe.current?.())}
          disabled={
            metodo === 'paypal'
              ? yendoAPaypal
              : procesando || preparando || !completa
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {procesando || yendoAPaypal ? (
            <>
              <Spinner /> {yendoAPaypal ? t('Taking you to PayPal…') : t('Processing…')}
            </>
          ) : metodo === 'paypal' ? (
            `${t('Pay with PayPal')} · ${formatoDinero(saldo)}`
          ) : (
            `${t('Pay')} ${formatoDinero(saldo)}`
          )}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          disabled={procesando || yendoAPaypal}
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

/** Una opción del selector. Es la hermana pequeña de `OpcionPago` del funnel:
 *  aquí no hay formulario dentro de cada opción, solo la etiqueta. */
function MetodoSaldo({
  id,
  seleccionado,
  onElegir,
  etiqueta,
}: {
  id: 'card' | 'paypal'
  seleccionado: boolean
  onElegir: () => void
  etiqueta: string
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-card border px-3 py-2 transition-colors ${
        seleccionado ? 'border-aqua bg-aqua-tint/40' : 'border-linea bg-papel'
      }`}
    >
      <input
        type="radio"
        name="metodo-saldo"
        value={id}
        checked={seleccionado}
        onChange={onElegir}
        className="size-4 accent-aqua"
      />
      <span className="text-sm font-medium text-navy">{etiqueta}</span>
    </label>
  )
}
