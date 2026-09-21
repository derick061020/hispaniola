import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Meta } from '@/components/seo/meta'
import { Logo } from '@/components/ui/logo'
import { Spinner } from '@/components/ui/spinner'
import { FormularioStripe, type EstadoFormularioStripe } from '@/components/pagos/formulario-stripe'
import { obtenerBarcoPropina, obtenerConfig, pagarPropina, confirmarPropina } from '@/lib/api/api'
import type { BarcoPropina, TripulanteBarco } from '@/lib/api/tipos'
import { formatoDinero } from '@/data/home'
import { t, tp } from '@/lib/i18n'

// PAGINA DEL QR DE PROPINAS.
//
// [2026-09-21, el cliente: «quiero qrs de pago para poder cobrar propinas,
// el monto es personalizable»] Un QR por barco (no uno por tripulante): se
// pega uno solo en la embarcacion y aqui el huesped elige a quien de la
// tripulacion se la da. `hispaniola_web` sirve el barco + su tripulacion por
// el slug de la URL (`/tips/:slug`) y crea el cobro con el mismo patron que
// el saldo desde «Mi reserva» — el importe y el empleado se VALIDAN en el
// servidor, nunca se cobra lo que diga el navegador a ciegas.
//
// SIN "NO REEMBOLSABLE" DE VERDAD. Un banco puede abrir un chargeback pase lo
// que diga esta pantalla. Lo unico que protege el efectivo ya entregado a la
// tripulacion es el plazo de espera antes de pagarlo (`hold_days` en Odoo) —
// aqui solo hace falta el texto de consentimiento, que es la evidencia que
// se manda si algun dia hay que disputar el chargeback.

const MONTOS_PRESET = [5, 10, 20]
const MONTO_MINIMO = 1
const MONTO_MAXIMO = 300

type Paso = 'cargando' | 'error' | 'formulario' | 'pagando' | 'gracias'

export function PropinaPage() {
  const { barco: slug = '' } = useParams()
  const [paso, setPaso] = useState<Paso>('cargando')
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [datos, setDatos] = useState<BarcoPropina | null>(null)
  const [clavePublicable, setClavePublicable] = useState('')

  const [empleado, setEmpleado] = useState<TripulanteBarco | null>(null)
  const [montoPreset, setMontoPreset] = useState<number | null>(MONTOS_PRESET[1])
  const [montoLibre, setMontoLibre] = useState('')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [consentido, setConsentido] = useState(false)

  const [errorPago, setErrorPago] = useState<string | null>(null)
  const [estadoStripe, setEstadoStripe] = useState<EstadoFormularioStripe | null>(null)
  const pagarConStripe = useRef<(() => void) | null>(null)
  const referenciaRef = useRef<string | null>(null)

  const monto = montoPreset ?? (Number(montoLibre) || 0)

  // ── Carga inicial: barco + tripulacion, y la publishable key de Stripe.
  useEffect(() => {
    if (!slug) return
    let vivo = true
    Promise.all([obtenerBarcoPropina(slug), obtenerConfig()])
      .then(([barco, config]) => {
        if (!vivo) return
        setDatos(barco)
        setEmpleado(barco.crew[0] ?? null)
        setClavePublicable(config.payments.stripe.publishable_key || '')
        setPaso('formulario')
      })
      .catch((e: unknown) => {
        if (!vivo) return
        setErrorCarga(
          e instanceof Error && e.message
            ? e.message
            : t('This tip page is not available right now.'),
        )
        setPaso('error')
      })
    return () => {
      vivo = false
    }
  }, [slug])

  // ── Cash App en movil se lleva el navegador y vuelve con `payment_intent`
  //    en la URL (lo añade Stripe solo al redirigir). Sin referencia propia
  //    que recuperar, se confirma por ese id directamente.
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search)
    const intentId = parametros.get('payment_intent')
    if (!intentId || !slug) return
    confirmarPropina(slug, { paymentIntentId: intentId })
      .then(() => setPaso('gracias'))
      .catch(() => {
        // Si esto falla el webhook cierra el estado igual; no hay nada que
        // enseñar aqui salvo dejar que el huesped reintente si quiere.
      })
  }, [slug])

  const consentText = useMemo(() => {
    if (!empleado || !datos) return ''
    return tp(
      'Voluntary tip to {name}, crew of {boat}. No goods or services are exchanged in return. Not refundable except as required by law.',
      { name: empleado.name, boat: datos.boat.name },
    )
  }, [empleado, datos])

  const listoParaPagar = !!empleado && monto >= MONTO_MINIMO && monto <= MONTO_MAXIMO
    && /\S+@\S+\.\S+/.test(correo) && consentido

  const procesando = !!estadoStripe?.procesando
  const completo = !!estadoStripe?.completo

  const pagado = async (paymentIntentId?: string) => {
    if (referenciaRef.current) {
      try {
        await confirmarPropina(slug, { reference: referenciaRef.current, paymentIntentId })
      } catch {
        // El cobro esta hecho; el webhook cierra el estado igual.
      }
    }
    setPaso('gracias')
  }

  const returnUrl = `${window.location.origin}/tip/${encodeURIComponent(slug)}`

  if (paso === 'cargando') {
    return (
      <div className="grid min-h-screen place-items-center bg-papel">
        <Spinner />
      </div>
    )
  }

  if (paso === 'error' || !datos) {
    return (
      <div className="grid min-h-screen place-items-center bg-papel px-5 text-center">
        <div>
          <p className="text-base text-navy-sub">{errorCarga}</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-coral">
            {t('Back to hispaniolaaquaticadventures.com')}
          </Link>
        </div>
      </div>
    )
  }

  if (paso === 'gracias') {
    return (
      <div className="min-h-screen bg-papel">
        <Meta
          titulo={`${t('Thank you!')} · ${datos.boat.name}`}
          descripcion={t('Tip sent to the crew.')}
          ruta={`/tip/${slug}`}
          indexable={false}
        />
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-12 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-menta text-menta-texto">
            <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-navy">
            {t('Thank you!')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-navy-sub">
            {tp('Your tip for {name} on {boat} is on its way. A receipt was sent to', {
              name: empleado?.name ?? '',
              boat: datos.boat.name,
            })}{' '}
            <span className="font-medium text-navy">{correo}</span>.
          </p>
          <Link to="/" className="mt-6 text-sm font-semibold text-coral">
            {t('Back to hispaniolaaquaticadventures.com')}
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`${t('Tip the crew')} · ${datos.boat.name}`}
        descripcion={tp('Send a tip to the crew of {boat}.', { boat: datos.boat.name })}
        ruta={`/tip/${slug}`}
        indexable={false}
      />
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-md items-center px-5 py-3">
          <Link to="/" aria-label={t('Inicio de Hispaniola Aquatic Adventures')}>
            <Logo compacto />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 py-10">
        <div className="text-center">
          <Heart className="mx-auto size-8 text-coral" aria-hidden="true" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-navy">
            {tp('Tip the crew of {boat}', { boat: datos.boat.name })}
          </h1>
          <p className="mt-2 text-sm text-navy-sub">
            {t('100% goes to your crew member. Thank you for the support!')}
          </p>
        </div>

        {/* Tripulacion */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
            {t('Who are you tipping?')}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {datos.crew.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setEmpleado(persona)}
                className={`rounded-btn border px-3 py-2.5 text-sm font-medium transition-colors ${
                  empleado?.id === persona.id
                    ? 'border-coral bg-coral/10 text-coral'
                    : 'border-linea bg-papel text-navy hover:bg-papel-hueso'
                }`}
              >
                {persona.name}
              </button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
            {t('Amount')}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {MONTOS_PRESET.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => {
                  setMontoPreset(valor)
                  setMontoLibre('')
                }}
                className={`rounded-btn border px-2 py-2.5 text-sm font-semibold transition-colors ${
                  montoPreset === valor
                    ? 'border-coral bg-coral/10 text-coral'
                    : 'border-linea bg-papel text-navy hover:bg-papel-hueso'
                }`}
              >
                {formatoDinero(valor)}
              </button>
            ))}
            <input
              type="number"
              inputMode="decimal"
              min={MONTO_MINIMO}
              max={MONTO_MAXIMO}
              placeholder={t('Other')}
              value={montoLibre}
              onChange={(e) => {
                setMontoLibre(e.target.value)
                setMontoPreset(null)
              }}
              className={`rounded-btn border px-2 py-2.5 text-center text-sm font-semibold text-navy outline-none transition-colors focus:border-coral ${
                montoPreset === null && montoLibre ? 'border-coral bg-coral/10' : 'border-linea bg-papel'
              }`}
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="mt-6 space-y-3">
          <div>
            <label htmlFor="propina-correo" className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
              {t('E-mail (for your receipt)')}
            </label>
            <input
              id="propina-correo"
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-btn border border-linea bg-papel px-3 py-2.5 text-sm text-navy outline-none focus:border-coral"
            />
          </div>
          <div>
            <label htmlFor="propina-nombre" className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
              {t('Your name (optional)')}
            </label>
            <input
              id="propina-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1.5 w-full rounded-btn border border-linea bg-papel px-3 py-2.5 text-sm text-navy outline-none focus:border-coral"
            />
          </div>
        </div>

        {/* Consentimiento */}
        <label className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-navy-sub">
          <input
            type="checkbox"
            checked={consentido}
            onChange={(e) => setConsentido(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-coral"
          />
          <span>{consentText}</span>
        </label>

        {/* Pago */}
        <div className="mt-5 rounded-card border border-linea bg-papel-hueso p-4">
          {listoParaPagar ? (
            <FormularioStripe
              clave={clavePublicable}
              importe={monto}
              moneda="usd"
              facturacion={{ nombre: nombre || correo, email: correo }}
              obtenerSecreto={async () => {
                const intento = await pagarPropina(slug, {
                  employeeId: empleado!.id,
                  amount: monto,
                  guestEmail: correo,
                  guestName: nombre || undefined,
                })
                referenciaRef.current = intento.reference
                return { client_secret: intento.client_secret, amount: intento.amount }
              }}
              returnUrl={returnUrl}
              onPagado={pagado}
              onError={setErrorPago}
              onEstado={setEstadoStripe}
              registraPagar={(fn) => { pagarConStripe.current = fn }}
            />
          ) : (
            <p className="text-xs text-navy-soft">
              {t('Choose who you are tipping, an amount and your e-mail to continue.')}
            </p>
          )}

          {errorPago ? (
            <p role="alert" className="mt-3 rounded-lg border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
              {errorPago} <strong className="text-navy">{t('Nothing was charged.')}</strong>
            </p>
          ) : null}

          {listoParaPagar ? (
            <button
              type="button"
              onClick={() => pagarConStripe.current?.()}
              disabled={procesando || !completo}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-btn bg-coral px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {procesando ? (
                <>
                  <Spinner /> {t('Processing…')}
                </>
              ) : (
                `${t('Send tip ·')} ${formatoDinero(monto)}`
              )}
            </button>
          ) : null}
        </div>
      </main>
    </div>
  )
}
