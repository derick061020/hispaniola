import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { etiquetaOcasion } from '@/components/reservar/tipos'
import { sumarDias, fechaLarga } from '@/lib/fechas'
import { buscarReserva, type Reserva } from '@/lib/reservas'
import { menuDeLaReserva } from '@/lib/menu-reserva'
import { dispararConfetti } from '@/lib/celebracion'
import { confirmarPago, enviarFormulario, leerCheckout } from '@/lib/api/api'
import { BotonCalendario } from '@/components/ui/boton-calendario'
import { olvidarSesionCheckout, sesionCheckoutGuardada } from '@/lib/api/use-checkout'
import { formatoDinero } from '@/data/home'
import { t, traducible } from '@/lib/i18n'

// «¡Nos vemos a bordo!» — pantalla post-checkout (2026-07-17, pedido de
// Pedro). Se muestra DESPUÉS de que el funnel de reserva completa el
// "pago" (en el prototipo, también en este build, el pago es simulado —
// la frontera con Odoo/xpotours sigue pendiente, ver PLAN-LANZAMIENTO
// Bloque 0.1/0.2).
//
// LAYOUT (1 sola columna, max-w-3xl, todo centrado — es una pantalla
// de confirmación, no un checkout):
//   1. Check grande + «¡Nos vemos a bordo, {nombre}!»
//   2. Código de reserva destacado (HSP-XXXX-NNNN)
//   3. 3 CTAs: Voucher PDF · Añadir al calendario · Guardar WhatsApp
//   4. Link «Gestionar mi reserva →» a /mi-reserva?codigo=…
//   5. Timeline «Qué sigue» (3 pasos: hoy / día antes / día del tour)
//   6. Resumen completo de la reserva
//   7. Callout «¿Celebráis algo?» → WhatsApp
//   8. Chips «¿Cómo nos encontraste?» → tracking en localStorage
//
// DATOS: la reserva se guarda en localStorage al completar el pago
// (reservar.tsx → paso-pago → guardarReserva). Esta página la lee por
// código (query param ?codigo=…). Sin código, redirige a /.

const ORIGENES = traducible(['Google', 'Instagram', 'TikTok', 'Word of mouth', 'Other'])

export function GraciasPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const codigo = params.get('codigo')

  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [origen, setOrigen] = useState<string | null>(null)
  // [2026-08-18] true = hay código pero no hay copia local de la reserva. Antes
  // esto era un `navigate('/')`: volver de PayPal en otro navegador, abrir el
  // enlace en el móvil o tener el almacenamiento limpio echaba a la home a
  // alguien que acababa de pagar. La reserva existe en Odoo; lo que falta aquí
  // es la caché, así que se enseña el código y el camino para verla entera.
  const [sinCopiaLocal, setSinCopiaLocal] = useState(false)

  useEffect(() => {
    if (!codigo) {
      navigate('/', { replace: true })
      return
    }
    const r = buscarReserva(codigo)
    if (!r || r.slug !== slug) {
      setSinCopiaLocal(true)
      return
    }
    setReserva(r)
    setOrigen(r.comoNosConociste ?? null)
  }, [codigo, slug, navigate])

  // ── Vuelta de PayPal ────────────────────────────────────────────────────
  // [2026-08-14] Con PayPal el navegador SE VA del sitio, así que el cobro no
  // se puede rematar en el funnel: se remata aquí. PayPal devuelve al
  // `return_url` que arma `hispaniola_web` (…/thank-you?codigo=…) y le añade
  // `token`, que es el id de su orden. Ese id es lo que Odoo necesita para
  // capturar el dinero — sin esta llamada la orden se queda aprobada pero sin
  // cobrar, y caduca a las 3 horas.
  //
  // Si algo falla NO se echa al visitante de la pantalla: la reserva existe en
  // Odoo desde que abrió el checkout, y el webhook de PayPal cierra el estado
  // por su cuenta. Solo se avisa.
  // [2026-08-18] LO PAGADO SE PREGUNTA, NO SE SUPONE.
  //
  // Esta pantalla pintaba «Already paid (deposit) US$ 62» leyendo la copia
  // LOCAL del navegador, que guarda lo que costaba la reserva — no lo que se
  // llego a cobrar. Asi que quien abandonaba en la pasarela, o pagaba con una
  // tarjeta rechazada, veia igualmente su deposito como cobrado. Un cliente
  // que cree que ya pago y aparece en el muelle sin haber pagado es un
  // problema del muelle, y de los peores.
  //
  // Ahora se lee del pedido en Odoo (`amounts.paid` y su estado). Sin sesion
  // —volver de PayPal en otro navegador— no se afirma nada: se pinta el
  // importe como pendiente, que es lo unico seguro.
  const [cobro, setCobro] = useState<{ pagado: number; estado: string } | null>(null)
  const [recargas, setRecargas] = useState(0)

  useEffect(() => {
    const sesion = sesionCheckoutGuardada()
    if (!codigo || !sesion || sesion.codigo !== codigo) return
    let vivo = true
    leerCheckout(codigo, sesion.token)
      .then((pedido) => {
        if (vivo) setCobro({ pagado: pedido.amounts.paid, estado: pedido.state })
      })
      .catch(() => {
        /* Silencio: sin dato no se afirma que este pagado. */
      })
    return () => {
      vivo = false
    }
  }, [codigo, recargas])

  const ordenPaypal = params.get('token')
  const [capturando, setCapturando] = useState(false)
  const [avisoPago, setAvisoPago] = useState<string | null>(null)

  useEffect(() => {
    if (!ordenPaypal || !codigo) return
    const sesion = sesionCheckoutGuardada()
    // Sin la sesión no hay token de reserva y la API no autoriza la captura.
    // Pasa si vuelve en otro navegador o tras limpiar el almacenamiento.
    if (!sesion || sesion.codigo !== codigo) {
      setAvisoPago(t('We could not confirm the PayPal payment from this browser. Our team will check it and email you.'))
      return
    }
    let vivo = true
    setCapturando(true)
    confirmarPago(codigo, sesion.token, { paypalOrderId: ordenPaypal })
      .then((resultado) => {
        if (!vivo) return
        // Se vuelve a preguntar por el cobro ANTES de olvidar la sesión: la
        // captura de PayPal acaba de cambiar el estado del pedido.
        setRecargas((n) => n + 1)
        olvidarSesionCheckout()
        if (!['paid', 'confirmed'].includes(resultado.state)) {
          setAvisoPago(t('PayPal is still processing the payment. We’ll email you as soon as it clears.'))
        }
      })
      .catch(() => {
        if (!vivo) return
        setAvisoPago(t('We could not confirm the PayPal payment right now. Our team will check it and email you.'))
      })
      .finally(() => {
        if (vivo) setCapturando(false)
      })
    return () => {
      vivo = false
    }
  }, [ordenPaypal, codigo])

  // «¿Cómo nos encontraste?» — la respuesta VIAJA (2026-08-18). Estos chips
  // cambiaban un color y ya: ni al CRM ni a localStorage, pese a lo que decía
  // la cabecera de este archivo. Es la única pregunta de atribución que el
  // sitio hace, y sin ella «¿de dónde salen las reservas?» no tiene respuesta.
  // Se manda sin bloquear ni avisar de un fallo: quien acaba de pagar no tiene
  // que enterarse de un problema con una encuesta opcional.
  const elegirOrigen = (valor: string) => {
    setOrigen(valor)
    void enviarFormulario('how_found', {
      name: `${reserva?.contacto.nombre ?? ''} ${reserva?.contacto.apellidos ?? ''}`.trim(),
      email: reserva?.contacto.email,
      booking_code: reserva?.codigo,
      answer: valor,
    }).catch(() => {})
  }

  // Celebración one-shot al confirmar la reserva. Deps []: se dispara
  // una sola vez al montar la página, no en cada re-render ni al
  // volver a la misma pantalla. canvas-confetti monta su propio canvas
  // position:fixed con pointer-events:none — el copy debajo sigue
  // siendo clickable.
  useEffect(() => {
    if (reserva) dispararConfetti()
  }, [reserva])

  if (!reserva) {
    if (!sinCopiaLocal || !codigo) return null
    return (
      <div className="min-h-screen bg-papel">
        <Meta
          titulo={`Booking ${codigo}`}
          descripcion={`Your booking ${codigo} is saved. Look it up in My booking with your code and e-mail.`}
          ruta={`/book/${slug}/thank-you`}
          indexable={false}
        />
        <header className="border-b border-linea">
          <div className="mx-auto flex max-w-3xl items-center px-5 py-3 sm:px-8">
            <Link to="/" aria-label={t('Inicio de Hispaniola Aquatic Adventures')}>
              <Logo compacto />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-menta text-menta-texto">
            <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-navy">{t('Your booking is in.')}</h1>
          <p className="mt-3 text-base text-navy-sub">
            {avisoPago
              ? avisoPago
              : 'We don’t have the details on this device, but the booking is saved under this code and the voucher is on its way to your e-mail.'}
          </p>
          <div className="mt-8 flex flex-col items-center gap-2 rounded-card-grande border-2 border-linea-fuerte bg-papel-hueso px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('Your booking code')}</p>
            <p className="font-mono text-2xl font-semibold tracking-wider text-navy sm:text-3xl">{codigo}</p>
          </div>
          <p className="mt-6 text-sm">
            <Link to={`/my-booking?codigo=${codigo}`} className="font-semibold text-aqua-dark hover:underline">
              {t('See it in My booking (code + e-mail) →')}
            </Link>
          </p>
        </main>
      </div>
    )
  }

  // Ocasión que el visitante contó en el funnel, si la contó (2026-08-07).
  const celebra = etiquetaOcasion(reserva.celebracion?.ocasion)
  // El menú de ESTA reserva, con la MISMA regla que el checkout (2026-08-07,
  // lib/menu-reserva.ts): Light/Premium, la carta del charter que toca por
  // barco y aforo, o el buffet. Antes esta pantalla leía siempre
  // menuLight/menuPremium y en Saona y el charter esos arrays están vacíos:
  // salía «Menu: to be confirmed by email» para una comida que no se elige.
  const menu = menuDeLaReserva({
    ficha: reserva.ficha,
    paquete: reserva.paquete,
    variante: reserva.variante,
    personas: reserva.personas,
  })
  const seEligeMenu = menu?.modo === 'eleccion'
  // Platos realmente elegidos: el funnel ya deja reservar sin decidirlos.
  const platosElegidos = reserva.platos.filter(Boolean)
  const faltanPlatos = seEligeMenu && platosElegidos.length < reserva.platos.length
  const totalCon5Pct = Math.round(reserva.saldo * 0.95)
  const horario = reserva.ficha.horarios[reserva.horarioIdx]
  // sumarDias ya devuelve ISO string (formato 'YYYY-MM-DD'), listo para fechaLarga.
  const fechaRecordatorioISO = sumarDias(reserva.fechaISO, -1)

  // Mapea el id guardado en reserva.platos al nombre del plato del menú que
  // aplica. Como el funnel guarda `plato.nombre` directamente, el id suele ser
  // ya el nombre — pero confirmamos contra la carta por si el shape cambia.
  const nombrePlato = (id: string) => menu?.platos.find((p) => p.nombre === id)?.nombre ?? id

  // Qué se escribe en la fila «Menu» del resumen. Tres casos, y ninguno miente:
  // se eligió todo, falta parte (llega por correo) o no se elige (buffet).
  const resumenMenu = !seEligeMenu
    ? (menu?.titulo ?? '—')
    : platosElegidos.length === 0
      ? t('To be confirmed by email')
      : faltanPlatos
        ? `${platosElegidos.map(nombrePlato).join(', ')} · the rest, by email`
        : platosElegidos.map(nombrePlato).join(', ')

  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`See you on board! · Booking ${reserva.codigo}`}
        descripcion={`Your booking ${reserva.codigo} is confirmed. ${reserva.tour.nombre} for ${reserva.personas} guests on ${fechaLarga(reserva.fechaISO)}.`}
        ruta={`/book/${reserva.slug}/thank-you`}
        indexable={false}
      />

      {/* Header mínimo — mismo patrón que el funnel de reserva (no
          invitamos a salir a mitad de una pantalla crítica). */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-3 sm:px-8">
          <Link to="/" aria-label={t('Inicio de Hispaniola Aquatic Adventures')}>
            <Logo compacto />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Estado del cobro de PayPal, si se vuelve de allí. Va ARRIBA del
            todo: es lo único de esta pantalla que puede no estar cerrado. */}
        {capturando ? (
          <p role="status" className="mb-6 rounded-lg border border-linea bg-papel-hueso px-4 py-3 text-sm text-navy-sub">
            {t('Confirming your PayPal payment…')}
          </p>
        ) : avisoPago ? (
          <p role="alert" className="mb-6 rounded-lg border border-coral/40 bg-coral/5 px-4 py-3 text-sm leading-relaxed text-navy-sub">
            {avisoPago} <strong className="text-navy">{t('Your booking is saved')}</strong> {t('under the code below.')}
          </p>
        ) : null}

        {/* 1. HERO — check + nombre + mensaje */}
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-menta text-menta-texto">
            <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-navy sm:text-4xl">
            {t('See you on board,')}{' '}{reserva.contacto.nombre}!
          </h1>
          <p className="mt-3 text-base text-navy-sub sm:text-lg">
            {t('Your booking is confirmed. We’re sending the voucher to')}{' '}
            <span className="font-medium text-navy">{reserva.contacto.email}</span> {t('and on WhatsApp.')}
          </p>
        </div>

        {/* 2. CÓDIGO — destacado */}
        <div className="mt-8 flex flex-col items-center gap-2 rounded-card-grande border-2 border-linea-fuerte bg-papel-hueso px-6 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('Your booking code')}</p>
          <p className="font-mono text-2xl font-semibold tracking-wider text-navy sm:text-3xl">
            {reserva.codigo}
          </p>
          <p className="text-xs text-navy-soft">{t('You’ll need it to manage your booking, or on WhatsApp.')}</p>
        </div>

        {/* 3. CTAs — voucher / calendario / WhatsApp */}
        {/* [2026-08-18] Fuera «PDF voucher». Era un <button> sin onClick: no
            descargaba nada y no hay endpoint público que lo sirva (el voucher
            en PDF existe en Odoo, pero solo se adjunta al correo). El correo ya
            se promete tres líneas más arriba, así que el botón sobraba y solo
            podía decepcionar. «Add to calendar» sí es real ahora: el .ics lo
            sirve Odoo con la fecha, la recogida y el hotel dentro. */}
        {/* [2026-08-27] Y desde hoy no descarga un .ics de Odoo: el botón
            despliega las cinco salidas (Google, Apple, Outlook.com, Office 365
            y un .ics para el resto) con el evento ya relleno —fecha, hora de
            salida y de regreso, hotel y código—. El evento se arma en el
            navegador con ESTA reserva, así que no puede decir algo distinto de
            lo que se está leyendo. Ver lib/calendario.ts. */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <BotonCalendario reserva={reserva} />
          <a
            href="https://wa.me/18293052804"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {t('Save WhatsApp')}
          </a>
        </div>

        <p className="mt-3 text-center text-sm">
          <Link
            to={`/my-booking?codigo=${reserva.codigo}`}
            className="font-semibold text-aqua-dark hover:underline"
          >
            {t('Manage my booking →')}
          </Link>
        </p>

        {/* 4. TIMELINE «Qué sigue» */}
        <section className="mt-12">
          <p className="font-display text-lg font-semibold text-navy">{t('What happens next')}</p>
          <ol className="mt-4 space-y-4">
            <PasoTimeline
              numero={1}
              cuando={t('Today')}
              descripcion={
                <>
                  {t('You get the voucher + the receipt for your')}{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(reserva.deposito)}</strong>{' '}
                  {t('deposit by email and on WhatsApp.')}
                  {/* La promesa que sostiene el «puedes elegirlo luego» del
                      funnel: si quedó menú sin decidir, aquí se dice cuándo
                      llega el correo que lo resuelve. */}
                  {faltanPlatos ? (
                    <>
                      {' '}
                      {t('In that same email you pick the meals you left undecided, or you do it from')}{' '}
                      <strong className="font-semibold text-navy">{t('My booking')}</strong>{t(', up to 48 h before.')}
                    </>
                  ) : null}
                </>
              }
            />
            <PasoTimeline
              numero={2}
              cuando={`${fechaLarga(fechaRecordatorioISO)} (the day before), in the afternoon`}
              descripcion={
                <>
                  {t('We confirm your pickup on WhatsApp at')}{' '}
                  <strong className="font-semibold text-navy">{reserva.recogida.hotel || t('your hotel')}</strong>
                  {reserva.recogida.notas ? `, ${reserva.recogida.notas}` : ''}.
                </>
              }
            />
            <PasoTimeline
              numero={3}
              cuando={fechaLarga(reserva.fechaISO)}
              descripcion={
                <>
                  {t('Bring a swimsuit, a towel and biodegradable sunscreen. You pay the balance of')}{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(reserva.saldo)}</strong> {t('on board. In cash it comes to')}{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(totalCon5Pct)}</strong> {t('with the 5% discount.')}
                </>
              }
            />
          </ol>
        </section>

        {/* 5. RESUMEN */}
        <section className="mt-10 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('Your booking')}</p>
          <p className="mt-1 font-display text-lg font-semibold text-navy">{reserva.tour.nombre}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <FilaResumen label={t('Date')} valor={fechaLarga(reserva.fechaISO)} />
            <FilaResumen
              label={t('Schedule')}
              valor={horario ? `${horario.hora}${horario.regreso ? ` · back at ${horario.regreso}` : ''}` : '—'}
            />
            {/* El nombre del menú solo acompaña al nº de personas cuando hay
                elección («3 · Premium»): ahí la fila «Menu» lista platos y no
                dice de qué carta salen. Con buffet la fila de abajo ya se
                llama igual, y repetirlo dos veces seguidas se lee como un
                error. */}
            <FilaResumen
              label={t('Guests')}
              valor={`${reserva.personas}${seEligeMenu && menu ? ` · ${menu.etiqueta}` : ''}`}
            />
            {/* Desde 2026-08-07 se puede reservar sin elegir plato: los huecos
                se dicen, no se pintan como una lista con comas vacías. Y desde
                la 2ª vuelta del mismo día, con buffet la fila nombra el menú
                («Island buffet») en vez de prometer un correo que no existe. */}
            <FilaResumen label={t('Menu')} valor={resumenMenu} />
            <FilaResumen label={t('Pickup')} valor={reserva.recogida.hotel || '—'} />
            <div className="!mt-3 flex items-center justify-between border-t border-linea pt-3 text-sm">
              <span className="text-navy-soft">{cobro && cobro.pagado > 0 ? t('Already paid (deposit)') : t('Deposit — pending')}</span>
              <span className="font-semibold text-navy">
                {formatoDinero(cobro && cobro.pagado > 0 ? cobro.pagado : reserva.deposito)}
              </span>
            </div>
            {cobro && cobro.pagado <= 0 ? (
              <p className="!mt-1 text-xs text-navy-soft">
                {t('We haven’t received the deposit yet. Your spot is held and you can pay it any time from')}{' '}
                <Link to={`/my-booking?codigo=${reserva.codigo}`} className="font-semibold text-aqua-dark hover:underline">
                  {t('My booking')}
                </Link>
                .
              </p>
            ) : null}
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-soft">{t('Balance on board (cash, −5%)')}</span>
              <span className="font-semibold text-navy">{formatoDinero(totalCon5Pct)}</span>
            </div>
          </dl>
          <Link
            to={`/my-booking?codigo=${reserva.codigo}`}
            className="mt-4 inline-block text-sm font-semibold text-aqua-dark hover:underline"
          >
            {seEligeMenu ? t('Change the menu or the pickup') : t('Change your pickup')} →
          </Link>
        </section>

        {/* 6. ¿Celebráis algo? — dos versiones. Si el visitante YA lo dijo en el
            funnel (2026-08-07, la pregunta se adelantó al paso de contacto), esta
            tarjeta deja de preguntar y ACUSA RECIBO: preguntar dos veces lo mismo
            hace dudar de que la primera respuesta llegara a alguien. El CTA de
            WhatsApp se queda en los dos casos, pero cambia de trabajo — allí se
            afina lo concreto (tarta, decoración). */}
        <section className="mt-6 rounded-card border border-linea bg-papel-hueso p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 shrink-0 text-coral" aria-hidden="true" />
            {celebra ? (
              <div>
                <p className="font-display text-base font-semibold text-navy">
                  {t('Noted:')}{' '}{celebra.toLowerCase()}
                </p>
                <p className="mt-1 text-sm text-navy-sub">
                  {reserva.celebracion?.nota
                    ? `“${reserva.celebracion.nota}”. The crew will know before we set sail. `
                    : 'The crew will know before we set sail. '}
                  {t('If you want something specific (cake, decorations), we’ll arrange it here.')}
                </p>
                <a
                  href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! I’m ${reserva.contacto.nombre}, my booking is ${reserva.codigo} and I’d like to organize something for a ${celebra.toLowerCase()} 🎉`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-sm font-semibold text-aqua-dark hover:underline"
                >
                  {t('Arrange it on WhatsApp →')}
                </a>
              </div>
            ) : (
              <div>
                <p className="font-display text-base font-semibold text-navy">{t('Celebrating something?')}</p>
                <p className="mt-1 text-sm text-navy-sub">
                  {t('Birthday, anniversary, proposal… tell us on WhatsApp and we’ll set it up on board.')}
                </p>
                <a
                  href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! I’m ${reserva.contacto.nombre}, my booking is ${reserva.codigo} and I’d like to talk about a special celebration 🎉`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-sm font-semibold text-aqua-dark hover:underline"
                >
                  {t('Message us on WhatsApp →')}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* 7. Tracking — ¿cómo nos encontraste? */}
        <section className="mt-10 border-t border-linea pt-6">
          <p className="text-sm text-navy-soft">{t('Just curious: how did you find us?')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORIGENES.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => elegirOrigen(o)}
                className={`rounded-chip border px-3 py-1.5 text-sm font-medium transition-colors ${
                  origen === o
                    ? 'border-aqua bg-aqua-tint text-aqua-dark'
                    : 'border-linea bg-papel text-navy-sub hover:border-navy-soft hover:text-navy'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          {origen && (
            <p className="mt-3 text-sm text-aqua-dark">{t('Thank you! It helps us improve.')}</p>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-linea py-6 text-center text-xs text-navy-soft">
        {t('Hispaniola Aquatic Adventures · Questions? WhatsApp +1-829-305-2804')}
      </footer>
    </div>
  )
}

function PasoTimeline({
  numero,
  cuando,
  descripcion,
}: {
  numero: number
  cuando: string
  descripcion: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-aqua-tint text-sm font-semibold text-aqua-dark">
        {numero}
      </span>
      <div className="pt-1">
        <p className="text-sm font-semibold text-navy">{cuando}</p>
        <p className="mt-1 text-sm text-navy-sub">{descripcion}</p>
      </div>
    </li>
  )
}

function FilaResumen({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-navy-soft">{label}</dt>
      <dd className="text-navy">{valor}</dd>
    </div>
  )
}
