import { useEffect, useRef, useState } from 'react'
import {
  aparienciaStripe,
  cargarStripe,
  mensajeDeError,
  type ElementoExpress,
  type ElementoPago,
  type Elements,
  type Stripe,
} from '@/lib/pagos/stripe'
import { idiomaUI, t } from '@/lib/i18n'
import { Spinner } from '@/components/ui/spinner'

// EL FORMULARIO DE PAGO DE STRIPE — Express Checkout arriba, Payment Element
// debajo. Lo comparten el depósito del funnel (PasoPago) y el saldo desde «Mi
// reserva» (PagoSaldo): un solo sitio donde vive la integración.
//
// [2026-09-14, pedido del cliente] «Apple Pay, Google Pay, Link, Cash App Pay;
// que Stripe muestre automáticamente los métodos compatibles según el
// dispositivo y el cliente; que un usuario de iPhone vea Apple Pay sin teclear
// su tarjeta; con nuestra imagen de marca y el menor número de pasos,
// especialmente en móvil.»
//
// Cómo se consigue cada cosa:
//
//   · EXPRESS CHECKOUT ELEMENT: los botones de Apple Pay / Google Pay / Link.
//     Stripe decide cuáles pintar según el navegador (Apple Pay solo en Safari
//     con una tarjeta en Wallet, Google Pay solo si Chrome tiene una guardada…)
//     y avisa en `ready` con `availablePaymentMethods`; si no hay ninguno, el
//     bloque entero desaparece. Es la vía de UN TOQUE: el visitante no teclea
//     nada, la hoja del sistema ya trae tarjeta, nombre y correo.
//
//   · PAYMENT ELEMENT: tarjeta, Link y Cash App Pay (y lo que la cuenta active
//     mañana en el Dashboard, sin tocar código). Un acordeón con los métodos
//     que la cuenta tiene encendidos y valen para este importe/moneda/país.
//     Apple/Google Pay se le quitan (`wallets: never`) porque ya están arriba.
//
//   · IMAGEN DE MARCA: `aparienciaStripe()` (lib/pagos/stripe.ts) pasa los
//     tokens del sitio al iframe: aqua, coral, navy, hairlines y el radio de
//     los botones.
//
//   · MENOS PASOS: nombre, teléfono y país NO se vuelven a pedir — ya están
//     en el paso de contacto y viajan en `billing_details`. Lo único que el
//     Payment Element enseña además de la tarjeta es el correo, prellenado,
//     porque es lo que hace funcionar Link (reconoce al cliente y le ofrece
//     pagar con su tarjeta guardada tras un código).
//
// INTENTO DIFERIDO. Los Elements se crean con `mode: 'payment'` + importe, sin
// PaymentIntent. El intento se crea en Odoo SOLO al confirmar (`obtenerSecreto`),
// que es exactamente cuando se crea hoy: así el importe lo sigue poniendo el
// servidor y no hace falta un PaymentIntent vivo que actualizar cada vez que
// el visitante cambia de paquete o de personas. Para el saldo, donde el
// intento ya existe al abrir, se pasa `clientSecret` y listo.
//
// EL CIERRE es `confirmPayment` con `redirect: 'if_required'`: tarjeta, Apple
// Pay, Google Pay y Link se resuelven aquí mismo; Cash App Pay en móvil abre
// la app y vuelve por `returnUrl`, y la pantalla de destino remata con Odoo
// (`payment_intent` en la URL). Por eso `antesDeConfirmar` guarda la copia
// local ANTES: si el navegador se va, al volver hay algo que pintar.

export type FacturacionStripe = {
  nombre: string
  email?: string
  telefono?: string
  /** ISO-2. Es lo único de la dirección que se manda: no se pide más. */
  pais?: string
}

export type EstadoFormularioStripe = {
  /** El Payment Element está relleno y validado: se puede pulsar «Pagar». */
  completo: boolean
  procesando: boolean
  /** Hay botones de wallet en pantalla (Apple Pay, Google Pay o Link). */
  expressDisponible: boolean
  /** Ya cargó (o falló) — para no enseñar el botón antes de tiempo. */
  listo: boolean
}

export function FormularioStripe({
  clave,
  importe,
  moneda = 'usd',
  clientSecret,
  facturacion,
  obtenerSecreto,
  returnUrl,
  antesDeConfirmar,
  onPagado,
  onError,
  onEstado,
  registraPagar,
  desactivado = false,
}: {
  clave: string
  /** Lo que se va a cobrar, en la moneda de cobro (USD): lo enseñan las hojas
   *  de Apple/Google Pay. Solo se usa sin `clientSecret`. */
  importe: number
  moneda?: string
  /** Si el intento ya existe (saldo), su secreto. Si no, intento diferido. */
  clientSecret?: string
  facturacion: FacturacionStripe
  /** Crea el intento en el servidor (o devuelve el que hay) y su importe. */
  obtenerSecreto: () => Promise<{ client_secret?: string; amount?: number }>
  /** A dónde vuelve el navegador si el método exige salir (Cash App móvil). */
  returnUrl: string
  antesDeConfirmar?: () => void
  onPagado: (paymentIntentId?: string) => void | Promise<void>
  onError: (mensaje: string) => void
  onEstado?: (estado: EstadoFormularioStripe) => void
  /** Publica el disparador del cobro, para el botón de fuera (y la barra móvil). */
  registraPagar?: (pagar: () => void) => void
  desactivado?: boolean
}) {
  const nodoExpress = useRef<HTMLDivElement | null>(null)
  const nodoPago = useRef<HTMLDivElement | null>(null)
  const stripeRef = useRef<Stripe | null>(null)
  const elementsRef = useRef<Elements | null>(null)
  const expressRef = useRef<ElementoExpress | null>(null)
  const pagoRef = useRef<ElementoPago | null>(null)
  const procesandoRef = useRef(false)

  const [estado, setEstado] = useState<EstadoFormularioStripe>({
    completo: false,
    procesando: false,
    expressDisponible: false,
    listo: false,
  })
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const actualiza = (parcial: Partial<EstadoFormularioStripe>) =>
    setEstado((previo) => ({ ...previo, ...parcial }))

  // Las props que lee el cobro cambian (importe, contacto) pero los elementos
  // se montan una vez: se leen por ref para que el handler vea lo último.
  const ultimo = useRef({ importe, facturacion, obtenerSecreto, returnUrl, antesDeConfirmar, onPagado, onError })
  ultimo.current = { importe, facturacion, obtenerSecreto, returnUrl, antesDeConfirmar, onPagado, onError }

  useEffect(() => {
    onEstado?.(estado)
    // `onEstado` cambia en cada render del padre; solo importa el estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado])

  // ── El cobro ────────────────────────────────────────────────────────────
  const confirmar = async (via: 'boton' | 'express', evento?: { paymentFailed(o?: { reason?: 'fail' }): void }) => {
    const stripe = stripeRef.current
    const elements = elementsRef.current
    if (!stripe || !elements || procesandoRef.current) return
    procesandoRef.current = true
    actualiza({ procesando: true })
    const falla = (mensaje: string) => {
      evento?.paymentFailed({ reason: 'fail' })
      ultimo.current.onError(mensaje)
      procesandoRef.current = false
      actualiza({ procesando: false })
    }

    try {
      // 1. Lo tecleado, validado por Stripe antes de molestar al servidor.
      const { error: invalido } = await elements.submit()
      if (invalido) return falla(invalido.message || t('Check the payment details and try again.'))

      // 2. Copia local por si el método se lleva el navegador a otra parte.
      ultimo.current.antesDeConfirmar?.()

      // 3. El intento, con el importe que decide Odoo.
      const intento = await ultimo.current.obtenerSecreto()
      const secreto = clientSecret ?? intento.client_secret
      if (!secreto) return falla(t('Stripe did not return a payment secret.'))

      // El importe que enseñó la hoja de Apple/Google Pay tiene que ser el que
      // se cobra: si el servidor dice otro, no se cobra a ciegas.
      if (!clientSecret && intento.amount != null) {
        const enMenores = Math.round(intento.amount * 100)
        if (enMenores !== Math.round(ultimo.current.importe * 100)) {
          if (via === 'express') return falla(t('The amount changed while you were paying. Please review it and try again.'))
          elements.update({ amount: enMenores })
        }
      }

      // 4. Confirmar. Con wallet, los datos de facturación vienen de la hoja
      //    del sistema; con el formulario, los del paso de contacto.
      //
      //    ⚠️ [2026-09-18] ESTOS TRES DATOS SON OBLIGATORIOS AQUÍ. Al ocultar
      //    los campos de facturación (`fields.billingDetails: never`, para no
      //    volver a pedir lo que ya se tecleó) Stripe EXIGE que se manden al
      //    confirmar: si falta uno, no llega ni a intentar el cobro y devuelve
      //    un error de integración que el visitante lee como «no se pudo
      //    completar el pago». Pasaba en «Mi reserva», donde no se mandaba el
      //    país. Por eso los tres llevan respaldo y ninguno viaja vacío.
      //
      //    Del domicilio no viaja NADA: lo recoge el propio Payment Element
      //    (`fields.billingDetails.address: 'auto'`), y lo que Stripe recoge
      //    no se le manda desde aquí.
      const { nombre, email, telefono } = ultimo.current.facturacion
      const confirmParams: Record<string, unknown> = { return_url: ultimo.current.returnUrl }
      if (via === 'boton') {
        confirmParams.payment_method_data = {
          billing_details: {
            name: nombre?.trim() || email?.trim() || 'Guest',
            ...(telefono?.trim() ? { phone: telefono.trim() } : {}),
          },
        }
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        ...(clientSecret ? {} : { clientSecret: secreto }),
        confirmParams,
        redirect: 'if_required',
      })
      if (error) return falla(mensajeDeError(error))

      // Si hubo redirección no se llega aquí: remata la pantalla de vuelta.
      await ultimo.current.onPagado(paymentIntent?.id)
    } catch (e) {
      falla(e instanceof Error && e.message ? e.message : t('The payment could not be completed.'))
      return
    }
    procesandoRef.current = false
    actualiza({ procesando: false })
  }

  const confirmarRef = useRef(confirmar)
  confirmarRef.current = confirmar

  useEffect(() => {
    registraPagar?.(() => void confirmarRef.current('boton'))
  })

  // ── Montaje ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!clave) return
    let vivo = true
    setErrorCarga(null)
    actualiza({ listo: false, completo: false, expressDisponible: false })

    cargarStripe(clave)
      .then((stripe) => {
        if (!vivo || !nodoPago.current) return
        stripeRef.current = stripe

        const base = {
          appearance: aparienciaStripe(),
          locale: idiomaUI(),
        }
        const elements = clientSecret
          ? stripe.elements({ ...base, clientSecret })
          : stripe.elements({
              ...base,
              mode: 'payment',
              amount: Math.round(importe * 100),
              currency: moneda,
            })
        elementsRef.current = elements

        // Express Checkout: Apple Pay / Google Pay / Link en un toque.
        if (nodoExpress.current) {
          const express = elements.create('expressCheckout', {
            buttonType: { applePay: 'book', googlePay: 'book' },
            buttonHeight: 48,
            // Dos filas: en móvil Stripe pinta una columna, y con una sola
            // fila el segundo wallet (Link, tras Apple Pay) se escondía en
            // «See more». Apilados se ven los dos sin un toque más.
            layout: { maxColumns: 2, maxRows: 2, overflow: 'auto' },
            paymentMethods: { applePay: 'always', googlePay: 'always', link: 'auto', amazonPay: 'never', paypal: 'never' },
          })
          express.on('ready', ({ availablePaymentMethods }) => {
            if (!vivo) return
            const hay = !!availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean)
            actualiza({ expressDisponible: hay })
          })
          express.on('click', (e) => {
            // Síncrono, o Apple Pay no abre la hoja. El nombre del negocio es
            // lo que el cliente ve en el título de la hoja del sistema.
            e.resolve({ business: { name: 'Hispaniola Aquatic Adventures' } })
          })
          express.on('confirm', (e) => {
            void confirmarRef.current('express', e)
          })
          express.on('loaderror', () => {
            if (vivo) actualiza({ expressDisponible: false })
          })
          express.mount(nodoExpress.current)
          expressRef.current = express
        }

        // Payment Element: tarjeta, Link, Cash App… lo que la cuenta tenga.
        const pago = elements.create('payment', {
          layout: { type: 'accordion', defaultCollapsed: false, radios: true, spacedAccordionItems: true },
          wallets: { applePay: 'never', googlePay: 'never' },
          business: { name: 'Hispaniola Aquatic Adventures' },
          defaultValues: {
            billingDetails: {
              name: facturacion.nombre || undefined,
              email: facturacion.email || undefined,
              phone: facturacion.telefono || undefined,
              address: facturacion.pais ? { country: facturacion.pais } : undefined,
            },
          },
          // El correo sí se enseña (prellenado): es lo que hace funcionar Link.
          // El teléfono solo se oculta si lo tenemos: si no, que lo pida
          // Stripe — es preferible un campo más que un cobro que no arranca.
          //
          // ⚠️ [2026-09-18, Derick probando en botizate] LA DIRECCIÓN LA
          // RECOGE STRIPE, no nosotros.
          //
          // La regla de Stripe es dura: CADA campo que se marca «never» hay
          // que mandárselo al confirmar. Se intentó ocultar el domicilio
          // entero y pidió `postal_code`; se ocultó campo a campo dejando
          // solo el postal y entonces pidió `state`, y detrás vendrían
          // `line1` y `city`. Ninguno de esos datos se pide en el checkout ni
          // se puede inventar —el postal es el que usa la comprobación AVS
          // del banco—, así que la única salida honesta es dejar que los pida
          // el propio formulario: con 'auto' enseña lo justo para la tarjeta
          // (país y código postal) y nada más. Con Apple Pay o Google Pay ni
          // eso: esos datos los da la hoja del sistema.
          //
          // El nombre y el teléfono SÍ se ocultan, porque esos sí los tenemos
          // del paso de contacto y viajan en `billing_details`.
          fields: {
            billingDetails: {
              name: 'never',
              phone: facturacion.telefono ? 'never' : 'auto',
              address: 'auto',
            },
          },
        })
        pago.on('change', (e) => {
          if (vivo) actualiza({ completo: e.complete })
        })
        pago.on('ready', () => {
          if (vivo) actualiza({ listo: true })
        })
        pago.on('loaderror', (e) => {
          if (!vivo) return
          setErrorCarga(e.error?.message || t('We could not load the payment form. Disable your ad blocker or pay with PayPal.'))
          actualiza({ listo: true })
        })
        pago.mount(nodoPago.current)
        pagoRef.current = pago
      })
      .catch(() => {
        if (!vivo) return
        // Casi siempre un bloqueador de anuncios: js.stripe.com está en varias
        // listas. Se dice qué hacer en vez de dejar un hueco vacío.
        setErrorCarga(t('We could not load the payment form. Disable your ad blocker or pay with PayPal.'))
        actualiza({ listo: true })
      })

    return () => {
      vivo = false
      expressRef.current?.destroy()
      pagoRef.current?.destroy()
      expressRef.current = null
      pagoRef.current = null
      elementsRef.current = null
    }
    // Se monta una vez por clave/secreto: el importe y el contacto se
    // actualizan aparte, sin remontar los iframes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, clientSecret])

  // Cambia el importe (personas, paquete): las hojas de wallet tienen que
  // enseñar el nuevo. Solo en intento diferido; con secreto manda el intento.
  useEffect(() => {
    if (clientSecret || !elementsRef.current) return
    elementsRef.current.update({ amount: Math.round(importe * 100) })
  }, [importe, clientSecret])

  return (
    <div className={desactivado ? 'pointer-events-none opacity-60' : ''} aria-busy={estado.procesando}>
      {/* Wallets. El hueco no ocupa nada hasta que Stripe confirma que hay
          alguno: así en un ordenador sin Apple/Google Pay no queda un espacio
          en blanco ni un separador que no separa nada. */}
      <div className={estado.expressDisponible ? 'mb-4' : 'hidden'}>
        <div ref={nodoExpress} />
        <div className="mt-4 flex items-center gap-3 text-xs text-navy-soft" aria-hidden="true">
          <span className="h-px flex-1 bg-linea" />
          {t('or pay another way')}
          <span className="h-px flex-1 bg-linea" />
        </div>
      </div>

      {!estado.listo && !errorCarga ? (
        <p className="flex items-center gap-1.5 text-xs text-navy-soft">
          <Spinner /> {t('Loading payment methods…')}
        </p>
      ) : null}
      <div ref={nodoPago} />
      {errorCarga ? (
        <p role="alert" className="mt-1.5 text-xs text-coral">
          {errorCarga}
        </p>
      ) : null}
    </div>
  )
}
