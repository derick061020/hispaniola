import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { RiMastercardFill, RiPaypalFill, RiVisaFill } from '@remixicon/react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Campo } from '@/components/ui/campo'
import { obtenerConfig } from '@/lib/api/api'
import { cargarStripe, estiloCampoTarjeta, type CampoTarjeta } from '@/lib/pagos/stripe'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

// Sección 4 del funnel (Fase C, layout Viator): «Pago». El desglose completo
// del precio vive en la columna derecha (ResumenReserva), así que aquí solo van
// los medios de pago + el CTA.
//
// [2026-08-14] LOS MISMOS MEDIOS QUE ECLIPSE. Hasta hoy este paso era un botón
// suelto: `reservar.tsx` creaba el intento de cobro en Stripe y navegaba a
// «Gracias» sin llegar a cobrar nunca (el PaymentIntent se quedaba en
// `requires_payment_method`). Ahora hay lo mismo que en `form_checkout.html`
// del checkout de Eclipse, que es la referencia:
//
//   · TARJETA — Stripe Elements. El número NUNCA pasa por nuestro código: vive
//     en un iframe de js.stripe.com y lo que viaja es un id de intento.
//   · PAYPAL  — redirección a PayPal y vuelta a /book/:slug/thank-you, donde se
//     captura. Mismo patrón que Eclipse (allí con la URL clásica de webscr;
//     aquí con Orders v2, que es lo que sirve `hispaniola_web`).
//
// Qué medios se ENSEÑAN lo decide Odoo, no este archivo: `GET /config` publica
// `payments.stripe.enabled` / `payments.paypal.enabled`, que son true cuando el
// equipo ha puesto las claves. Sin claves no se pinta un método que va a fallar.

export type MetodoPago = 'card' | 'paypal'

export type DatosPago = {
  metodo: MetodoPago
  /** El elemento de Stripe, para que el padre remate el cobro. Solo en tarjeta. */
  tarjeta: CampoTarjeta | null
  /** Nombre del titular, tal y como está impreso en la tarjeta. */
  titular: string
  clavePublicable: string
}

type Medios = { tarjeta: boolean; paypal: boolean }

export function PasoPago({
  deposito,
  saldo,
  pedidoListo,
  fechaElegida,
  onPagar,
  registraLanzar,
  procesando = false,
  error = null,
}: {
  deposito: number
  saldo: number
  /** Sin fecha no se puede pagar — ver el aviso de abajo. */
  fechaElegida: boolean
  /** [2026-08-18] false = el pedido no existe en Odoo (backend caído, catálogo
   *  sin sembrar, CORS mal puesto). Sin pedido NO hay importe que cobrar: lo
   *  pone el servidor. Antes esto no se miraba y el botón lanzaba un cobro que
   *  no podía salir bien, con un mensaje genérico como única pista. */
  pedidoListo: boolean
  onPagar: (datos: DatosPago) => void
  /** [2026-08-25, al integrar la barra móvil de Samuel] Publica hacia arriba el
   *  disparador del cobro.
   *
   *  En móvil el botón de pagar vive en `BarraMovilReserva`, fuera de este
   *  componente — pero los datos que necesita el cobro (método elegido y el
   *  elemento de tarjeta de Stripe) viven AQUÍ dentro. La barra no puede
   *  llamar a `onPagar` directamente: lo haría sin tarjeta. Así que este paso
   *  registra su propio `lanzar` y la barra tira de él, que es exactamente lo
   *  mismo que pulsar el botón de dentro. */
  registraLanzar?: (lanzar: () => void) => void
  /** [2026-08-10] El pago dejó de ser instantáneo: viaja a Odoo y a la
   *  pasarela. Sin esto se puede pulsar dos veces. */
  procesando?: boolean
  /** Mensaje si el cobro no se pudo iniciar o la tarjeta se rechazó. La reserva
   *  NO se pierde: sigue registrada como pendiente en el CRM. */
  error?: string | null
}) {
  // ── Qué pasarelas hay configuradas en Odoo ──────────────────────────────
  const [medios, setMedios] = useState<Medios | null>(null)
  const [clave, setClave] = useState('')
  const [metodo, setMetodo] = useState<MetodoPago>('card')

  useEffect(() => {
    const abortador = new AbortController()
    obtenerConfig(abortador.signal)
      .then((config) => {
        const disponibles: Medios = {
          tarjeta: config.payments.stripe.enabled && !!config.payments.stripe.publishable_key,
          paypal: config.payments.paypal.enabled,
        }
        setMedios(disponibles)
        setClave(config.payments.stripe.publishable_key)
        // Con Stripe apagado y PayPal encendido, el método por defecto es
        // PayPal: nadie tiene que elegir lo único que hay.
        if (!disponibles.tarjeta && disponibles.paypal) setMetodo('paypal')
      })
      .catch(() => {
        // Odoo caído o CORS mal puesto. No se inventan medios de pago: se
        // enseña el aviso de abajo y la reserva sigue guardada como pendiente.
        setMedios({ tarjeta: false, paypal: false })
      })
    return () => abortador.abort()
  }, [])

  // ── Campo de tarjeta ────────────────────────────────────────────────────
  const contenedor = useRef<HTMLDivElement | null>(null)
  const elemento = useRef<CampoTarjeta | null>(null)
  const [titular, setTitular] = useState('')
  const [tarjetaCompleta, setTarjetaCompleta] = useState(false)
  const [errorTarjeta, setErrorTarjeta] = useState<string | null>(null)
  const [errorSdk, setErrorSdk] = useState<string | null>(null)

  useEffect(() => {
    if (!pedidoListo || metodo !== 'card' || !clave || !medios?.tarjeta) return
    let vivo = true

    cargarStripe(clave)
      .then((stripe) => {
        if (!vivo || !contenedor.current) return
        const campo = stripe.elements({ locale: 'en' }).create('card', {
          style: estiloCampoTarjeta(),
          // El CP no se pide: Stripe solo lo usa para la comprobación AVS de
          // tarjetas de EE. UU. y aquí el cliente es turista internacional —
          // un campo más que falla para lo que rara vez aporta.
          hidePostalCode: true,
        })
        campo.on('change', (e) => {
          setTarjetaCompleta(e.complete)
          setErrorTarjeta(e.error?.message ?? null)
        })
        campo.mount(contenedor.current)
        elemento.current = campo
        setErrorSdk(null)
      })
      .catch(() => {
        if (!vivo) return
        // Casi siempre un bloqueador de anuncios: js.stripe.com está en varias
        // listas. Se dice qué hacer en vez de dejar un hueco vacío.
        setErrorSdk(t('We could not load the card form. Disable your ad blocker or pay with PayPal.'))
      })

    return () => {
      vivo = false
      elemento.current?.destroy()
      elemento.current = null
      setTarjetaCompleta(false)
      setErrorTarjeta(null)
    }
  }, [pedidoListo, metodo, clave, medios?.tarjeta])

  // ── Estado del CTA ──────────────────────────────────────────────────────
  const sinPasarela = medios !== null && !medios.tarjeta && !medios.paypal
  const tarjetaLista = tarjetaCompleta && titular.trim() !== '' && elemento.current !== null
  const puedePagar =
    pedidoListo &&
    fechaElegida &&
    !procesando &&
    medios !== null &&
    !sinPasarela &&
    (metodo === 'paypal' ? medios.paypal : tarjetaLista)

  const lanzar = () =>
    onPagar({ metodo, tarjeta: elemento.current, titular: titular.trim(), clavePublicable: clave })

  // La barra móvil dispara ESTE `lanzar`, no `onPagar`: así el cobro sale con
  // el método y la tarjeta que se acaban de rellenar aquí dentro. Se vuelve a
  // publicar cuando cambia algo de lo que lee, o la barra se quedaría con una
  // versión vieja (el método elegido antes de cambiarlo, por ejemplo).
  const publicar = registraLanzar
  useEffect(() => {
    publicar?.(lanzar)
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-navy-sub">
        {t('Confirm your spot by paying only the')}{' '}<strong className="font-semibold text-navy">{t('25% deposit')}</strong> {t('today')}{' '}
        ({formatoDinero(deposito)}{t('). You pay the remaining')}{' '}{formatoDinero(saldo)} {t('on the day of the tour, with a 5% discount if you pay cash on board.')}
      </p>

      {/* Entrando directo a /book/:slug (sin pasar por el widget) la reserva
          llegaba hasta aquí SIN FECHA y el botón cobraba igual. 2026-08-07: el
          paso se bloquea y dice dónde se arregla — el calendario está a la
          derecha, en el resumen (en móvil, arriba del todo). */}
      {!fechaElegida ? (
        <p className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {t('You haven’t chosen')}{' '}<strong className="text-navy">{t('the date')}</strong> {t('yet. Pick it in your booking summary so you can confirm.')}
        </p>
      ) : null}

      {!pedidoListo ? (
        // Sin pedido en Odoo no se pinta ni un método de pago: enseñar el campo
        // de tarjeta aquí sería invitar a teclear un número para un cobro que
        // no puede salir. El aviso de arriba (reservar.tsx) dice qué hacer.
        <p role="status" className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {t('We can’t take the payment right now — our booking system is not answering. Everything you filled in is still on this page: try again in a moment, or')}{' '}
          <a className="font-semibold text-aqua-dark underline" href="https://wa.me/18293052804" target="_blank" rel="noopener">
            {t('book it with us on WhatsApp')}
          </a>.
        </p>
      ) : medios === null ? (
        <p className="text-xs text-navy-soft">{t('Loading payment methods…')}</p>
      ) : sinPasarela ? (
        // Ni Stripe ni PayPal configurados (o Odoo no responde). Se dice la
        // verdad: la reserva existe, lo que no se puede es cobrar ahora.
        <p role="status" className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {t('Online payment is temporarily unavailable.')}{' '}<strong className="text-navy">{t('Your booking is saved')}</strong> {t('— our team will call you to confirm it and take the deposit.')}
        </p>
      ) : (
        <fieldset className="flex flex-col gap-2" disabled={procesando}>
          <legend className="sr-only">{t('Payment method')}</legend>

          {medios.tarjeta ? (
            <OpcionPago
              id="card"
              seleccionado={metodo === 'card'}
              onElegir={() => setMetodo('card')}
              etiqueta={t('Credit or debit card')}
              marcas={
                <>
                  <RiVisaFill className="size-6 text-navy-soft" aria-hidden="true" />
                  <RiMastercardFill className="size-6 text-navy-soft" aria-hidden="true" />
                </>
              }
            >
              <Campo
                etiqueta={t('Name on card')}
                autoComplete="cc-name"
                placeholder={t('As printed on the card')}
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
              />
              <div className="mt-3">
                <span className="text-sm font-medium text-navy">{t('Card details')}</span>
                {/* El iframe de Stripe se monta AQUÍ. El recuadro y el foco son
                    nuestros (mismas clases que `Campo`); dentro no pintamos
                    nada. */}
                <div
                  ref={contenedor}
                  className="mt-1.5 w-full rounded-btn bg-papel px-4 py-3 ring-1 ring-linea focus-within:ring-2 focus-within:ring-aqua"
                />
                {errorTarjeta || errorSdk ? (
                  <p role="alert" className="mt-1.5 text-xs text-coral">
                    {errorTarjeta ?? errorSdk}
                  </p>
                ) : null}
              </div>
            </OpcionPago>
          ) : null}

          {medios.paypal ? (
            <OpcionPago
              id="paypal"
              seleccionado={metodo === 'paypal'}
              onElegir={() => setMetodo('paypal')}
              etiqueta={t('PayPal')}
              marcas={<RiPaypalFill className="size-6 text-navy-soft" aria-hidden="true" />}
            >
              <p className="text-xs leading-relaxed text-navy-sub">
                {t('You’ll be taken to PayPal to approve the payment and brought straight back here.')}
              </p>
            </OpcionPago>
          ) : null}
        </fieldset>
      )}

      {/* [2026-08-21, auditoría móvil] En móvil este botón se esconde: la
          acción del paso vive en la barra fija de abajo, con el importe al
          lado. Se esconde el BOTÓN, no la pasarela — los métodos de pago y el
          campo de tarjeta siguen aquí, que es donde se rellenan. */}
      <FancyButton.Root variant="primary" className="w-full max-lg:hidden" disabled={!puedePagar} onClick={lanzar}>
        {procesando
          ? 'Processing…'
          : metodo === 'paypal'
            ? `Continue with PayPal · ${formatoDinero(deposito)}`
            : `Pay deposit · ${formatoDinero(deposito)}`}
      </FancyButton.Root>

      {error ? (
        <p role="alert" className="rounded-lg border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {error} <strong className="text-navy">{t('Your booking is saved')}</strong> {t('— you can try again, or our team will contact you to complete it.')}
        </p>
      ) : null}

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> {t('Secure payment · Free cancellation up to 7 days before')}
      </p>
    </div>
  )
}

// Una opción de pago: radio REAL (no un botón con estado en React) para que el
// teclado la recorra con las flechas y funcione como un grupo de verdad —
// mismo criterio que el segmentado de «canal preferido» en la home.
function OpcionPago({
  id,
  seleccionado,
  onElegir,
  etiqueta,
  marcas,
  children,
}: {
  id: MetodoPago
  seleccionado: boolean
  onElegir: () => void
  etiqueta: string
  marcas: ReactNode
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-card border px-4 py-3 transition-colors ${
        seleccionado ? 'border-aqua bg-aqua-tint/40' : 'border-linea bg-papel'
      }`}
    >
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="radio"
          name="metodo-pago"
          value={id}
          checked={seleccionado}
          onChange={onElegir}
          className="size-4 accent-aqua"
        />
        <span className="flex-1 text-sm font-medium text-navy">{etiqueta}</span>
        <span className="flex items-center gap-1.5">{marcas}</span>
      </label>
      {/* El detalle solo se monta cuando la opción está elegida: el campo de
          tarjeta de Stripe es un iframe y no se tiene dos rondando ocultos. */}
      {seleccionado ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}
