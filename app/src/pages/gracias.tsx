import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Calendar, Check, Download, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { etiquetaOcasion } from '@/components/reservar/tipos'
import { sumarDias, fechaLarga } from '@/lib/fechas'
import { buscarReserva, type Reserva } from '@/lib/reservas'
import { menuDeLaReserva } from '@/lib/menu-reserva'
import { dispararConfetti } from '@/lib/celebracion'
import { formatoDinero } from '@/data/home'

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

const ORIGENES = ['Google', 'Instagram', 'TikTok', 'Word of mouth', 'Other']

export function GraciasPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const codigo = params.get('codigo')

  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [origen, setOrigen] = useState<string | null>(null)

  useEffect(() => {
    if (!codigo) {
      navigate('/', { replace: true })
      return
    }
    const r = buscarReserva(codigo)
    if (!r || r.slug !== slug) {
      navigate('/', { replace: true })
      return
    }
    setReserva(r)
    setOrigen(r.comoNosConociste ?? null)
  }, [codigo, slug, navigate])

  // Celebración one-shot al confirmar la reserva. Deps []: se dispara
  // una sola vez al montar la página, no en cada re-render ni al
  // volver a la misma pantalla. canvas-confetti monta su propio canvas
  // position:fixed con pointer-events:none — el copy debajo sigue
  // siendo clickable.
  useEffect(() => {
    if (reserva) dispararConfetti()
  }, [reserva])

  if (!reserva) return null

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
  // [2026-09-01] CÓMO SE PAGÓ. Hasta hoy solo había un camino (depósito del 25%
  // + saldo a bordo) y esta pantalla lo daba por hecho: prometía un recibo del
  // depósito y ofrecía el 5% de efectivo SOBRE el saldo. Con el método elegible
  // en el checkout, las dos cosas se vuelven falsas en el camino de efectivo —
  // no hay depósito que recibir, y el 5% YA está descontado del total, así que
  // volver a restarlo aquí sería prometer un precio que nadie va a cobrar.
  // Las reservas guardadas antes del cambio no traen el campo: se leen como
  // 'tarjeta', que es lo que eran.
  const pagoEnEfectivo = reserva.metodoPago === 'efectivo'
  // Solo se usa en el camino de tarjeta, donde el saldo sigue sin descontar.
  const saldoEnEfectivo = Math.round(reserva.saldo * 0.95)
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
      ? 'To be confirmed by email'
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
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures">
            <Logo compacto />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        {/* 1. HERO — check + nombre + mensaje */}
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-menta text-menta-texto">
            <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-navy sm:text-4xl">
            See you on board, {reserva.contacto.nombre}!
          </h1>
          <p className="mt-3 text-base text-navy-sub sm:text-lg">
            Your booking is confirmed. We’re sending the voucher to{' '}
            <span className="font-medium text-navy">{reserva.contacto.email}</span> and on WhatsApp.
          </p>
        </div>

        {/* 2. CÓDIGO — destacado */}
        <div className="mt-8 flex flex-col items-center gap-2 rounded-card-grande border-2 border-linea-fuerte bg-papel-hueso px-6 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">Your booking code</p>
          <p className="font-mono text-2xl font-semibold tracking-wider text-navy sm:text-3xl">
            {reserva.codigo}
          </p>
          <p className="text-xs text-navy-soft">You’ll need it to manage your booking, or on WhatsApp.</p>
        </div>

        {/* 3. CTAs — voucher / calendario / WhatsApp */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <Download className="size-4" aria-hidden="true" />
            PDF voucher
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <Calendar className="size-4" aria-hidden="true" />
            Add to calendar
          </button>
          <a
            href="https://wa.me/18293052804"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Save WhatsApp
          </a>
        </div>

        <p className="mt-3 text-center text-sm">
          <Link
            to={`/my-booking?codigo=${reserva.codigo}`}
            className="font-semibold text-aqua-dark hover:underline"
          >
            Manage my booking →
          </Link>
        </p>

        {/* 4. TIMELINE «Qué sigue» */}
        <section className="mt-12">
          <p className="font-display text-lg font-semibold text-navy">What happens next</p>
          <ol className="mt-4 space-y-4">
            <PasoTimeline
              numero={1}
              cuando="Today"
              descripcion={
                <>
                  {pagoEnEfectivo ? (
                    <>
                      You get your voucher by email and on WhatsApp. Nothing has been charged: you
                      pay in cash on the day.
                    </>
                  ) : (
                    <>
                      You get the voucher + the receipt for your{' '}
                      <strong className="font-semibold text-navy">
                        {formatoDinero(reserva.deposito)}
                      </strong>{' '}
                      deposit by email and on WhatsApp.
                    </>
                  )}
                  {/* La promesa que sostiene el «puedes elegirlo luego» del
                      funnel: si quedó menú sin decidir, aquí se dice cuándo
                      llega el correo que lo resuelve. */}
                  {faltanPlatos ? (
                    <>
                      {' '}
                      In that same email you pick the meals you left undecided, or you do it from{' '}
                      <strong className="font-semibold text-navy">My booking</strong>, up to 48 h before.
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
                  We confirm your pickup on WhatsApp at{' '}
                  <strong className="font-semibold text-navy">{reserva.recogida.hotel || 'your hotel'}</strong>
                  {reserva.recogida.notas ? `, ${reserva.recogida.notas}` : ''}.
                </>
              }
            />
            <PasoTimeline
              numero={3}
              cuando={fechaLarga(reserva.fechaISO)}
              descripcion={
                <>
                  Bring a swimsuit, a towel and biodegradable sunscreen.{' '}
                  {pagoEnEfectivo ? (
                    <>
                      You pay{' '}
                      <strong className="font-semibold text-navy">
                        {formatoDinero(reserva.saldo)}
                      </strong>{' '}
                      in cash on board — the 5% discount is already in that amount.
                    </>
                  ) : (
                    <>
                      You pay the balance of{' '}
                      <strong className="font-semibold text-navy">
                        {formatoDinero(reserva.saldo)}
                      </strong>{' '}
                      on board. In cash it comes to{' '}
                      <strong className="font-semibold text-navy">
                        {formatoDinero(saldoEnEfectivo)}
                      </strong>{' '}
                      with the 5% discount.
                    </>
                  )}
                </>
              }
            />
          </ol>
        </section>

        {/* 5. RESUMEN */}
        <section className="mt-10 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">Your booking</p>
          <p className="mt-1 font-display text-lg font-semibold text-navy">{reserva.tour.nombre}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <FilaResumen label="Date" valor={fechaLarga(reserva.fechaISO)} />
            <FilaResumen
              label="Schedule"
              valor={horario ? `${horario.hora}${horario.regreso ? ` · back at ${horario.regreso}` : ''}` : '—'}
            />
            {/* El nombre del menú solo acompaña al nº de personas cuando hay
                elección («3 · Premium»): ahí la fila «Menu» lista platos y no
                dice de qué carta salen. Con buffet la fila de abajo ya se
                llama igual, y repetirlo dos veces seguidas se lee como un
                error. */}
            <FilaResumen
              label="Guests"
              valor={`${reserva.personas}${seEligeMenu && menu ? ` · ${menu.etiqueta}` : ''}`}
            />
            {/* Desde 2026-08-07 se puede reservar sin elegir plato: los huecos
                se dicen, no se pintan como una lista con comas vacías. Y desde
                la 2ª vuelta del mismo día, con buffet la fila nombra el menú
                («Island buffet») en vez de prometer un correo que no existe. */}
            <FilaResumen label="Menu" valor={resumenMenu} />
            <FilaResumen label="Pickup" valor={reserva.recogida.hotel || '—'} />
            <div className="!mt-3 flex items-center justify-between border-t border-linea pt-3 text-sm">
              <span className="text-navy-soft">
                {pagoEnEfectivo ? 'Paid today' : 'Already paid (deposit)'}
              </span>
              <span className="font-semibold text-navy">{formatoDinero(reserva.deposito)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-soft">
                {pagoEnEfectivo ? 'To pay on board (cash, −5% applied)' : 'Balance on board (cash, −5%)'}
              </span>
              <span className="font-semibold text-navy">
                {formatoDinero(pagoEnEfectivo ? reserva.saldo : saldoEnEfectivo)}
              </span>
            </div>
          </dl>
          <Link
            to={`/my-booking?codigo=${reserva.codigo}`}
            className="mt-4 inline-block text-sm font-semibold text-aqua-dark hover:underline"
          >
            {seEligeMenu ? 'Change the menu or the pickup' : 'Change your pickup'} →
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
                  Noted: {celebra.toLowerCase()}
                </p>
                <p className="mt-1 text-sm text-navy-sub">
                  {reserva.celebracion?.nota
                    ? `“${reserva.celebracion.nota}”. The crew will know before we set sail. `
                    : 'The crew will know before we set sail. '}
                  If you want something specific (cake, decorations), we’ll arrange it here.
                </p>
                <a
                  href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! I’m ${reserva.contacto.nombre}, my booking is ${reserva.codigo} and I’d like to organize something for a ${celebra.toLowerCase()} 🎉`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-sm font-semibold text-aqua-dark hover:underline"
                >
                  Arrange it on WhatsApp →
                </a>
              </div>
            ) : (
              <div>
                <p className="font-display text-base font-semibold text-navy">Celebrating something?</p>
                <p className="mt-1 text-sm text-navy-sub">
                  Birthday, anniversary, proposal… tell us on WhatsApp and we’ll set it up on board.
                </p>
                <a
                  href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! I’m ${reserva.contacto.nombre}, my booking is ${reserva.codigo} and I’d like to talk about a special celebration 🎉`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-sm font-semibold text-aqua-dark hover:underline"
                >
                  Message us on WhatsApp →
                </a>
              </div>
            )}
          </div>
        </section>

        {/* 7. Tracking — ¿cómo nos encontraste? */}
        <section className="mt-10 border-t border-linea pt-6">
          <p className="text-sm text-navy-soft">Just curious: how did you find us?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORIGENES.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOrigen(o)}
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
            <p className="mt-3 text-sm text-aqua-dark">Thank you! It helps us improve.</p>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · Questions? WhatsApp +1-829-305-2804
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
