import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Calendar, Check, Download, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { sumarDias, fechaLarga } from '@/lib/fechas'
import { buscarReserva, type Reserva } from '@/lib/reservas'
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

const ORIGENES = ['Google', 'Instagram', 'TikTok', 'Recomendación', 'Otro']

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

  const totalCon5Pct = Math.round(reserva.saldo * 0.95)
  const horario = reserva.ficha.horarios[reserva.horarioIdx]
  // sumarDias ya devuelve ISO string (formato 'YYYY-MM-DD'), listo para fechaLarga.
  const fechaRecordatorioISO = sumarDias(reserva.fechaISO, -1)

  // Mapea el id guardado en reserva.platos al nombre del plato del menú
  // del paquete. Como el funnel guarda `plato.nombre` directamente, el id
  // suele ser ya el nombre — pero confirmamos buscando en el menú del
  // paquete por si en el futuro el shape cambia.
  const nombrePlato = (id: string) => {
    const menu = reserva.paquete === 'premium' ? reserva.ficha.menuPremium : reserva.ficha.menuLight
    return menu.find((p) => p.nombre === id)?.nombre ?? id
  }

  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`¡Nos vemos a bordo! · Reserva ${reserva.codigo}`}
        descripcion={`Tu reserva ${reserva.codigo} está confirmada. ${reserva.tour.nombre} para ${reserva.personas} personas el ${fechaLarga(reserva.fechaISO)}.`}
        ruta={`/reservar/${reserva.slug}/gracias`}
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
            ¡Nos vemos a bordo, {reserva.contacto.nombre}!
          </h1>
          <p className="mt-3 text-base text-navy-sub sm:text-lg">
            Tu reserva está confirmada. Te enviamos el voucher a{' '}
            <span className="font-medium text-navy">{reserva.contacto.email}</span> y por WhatsApp.
          </p>
        </div>

        {/* 2. CÓDIGO — destacado */}
        <div className="mt-8 flex flex-col items-center gap-2 rounded-card-grande border-2 border-linea-fuerte bg-papel-hueso px-6 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">Tu código de reserva</p>
          <p className="font-mono text-2xl font-semibold tracking-wider text-navy sm:text-3xl">
            {reserva.codigo}
          </p>
          <p className="text-xs text-navy-soft">Lo necesitarás para gestionar la reserva o en WhatsApp.</p>
        </div>

        {/* 3. CTAs — voucher / calendario / WhatsApp */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <Download className="size-4" aria-hidden="true" />
            Voucher PDF
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <Calendar className="size-4" aria-hidden="true" />
            Añadir al calendario
          </button>
          <a
            href="https://wa.me/18293052804"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Guardar WhatsApp
          </a>
        </div>

        <p className="mt-3 text-center text-sm">
          <Link
            to={`/mi-reserva?codigo=${reserva.codigo}`}
            className="font-semibold text-aqua-dark hover:underline"
          >
            Gestionar mi reserva →
          </Link>
        </p>

        {/* 4. TIMELINE «Qué sigue» */}
        <section className="mt-12">
          <p className="font-display text-lg font-semibold text-navy">Qué sigue</p>
          <ol className="mt-4 space-y-4">
            <PasoTimeline
              numero={1}
              cuando="Hoy"
              descripcion={
                <>
                  Recibes el voucher + el recibo del depósito de{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(reserva.deposito)}</strong>{' '}
                  a tu email y por WhatsApp.
                </>
              }
            />
            <PasoTimeline
              numero={2}
              cuando={`${fechaLarga(fechaRecordatorioISO)} (día antes), por la tarde`}
              descripcion={
                <>
                  Te confirmamos por WhatsApp la recogida en{' '}
                  <strong className="font-semibold text-navy">{reserva.recogida.hotel || 'tu hotel'}</strong>
                  {reserva.recogida.notas ? `, ${reserva.recogida.notas}` : ''}.
                </>
              }
            />
            <PasoTimeline
              numero={3}
              cuando={fechaLarga(reserva.fechaISO)}
              descripcion={
                <>
                  Trae traje de baño, toalla y protector biodegradable. El saldo de{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(reserva.saldo)}</strong> lo pagas
                  a bordo — en efectivo te quedan{' '}
                  <strong className="font-semibold text-navy">{formatoDinero(totalCon5Pct)}</strong> con el 5% de
                  descuento.
                </>
              }
            />
          </ol>
        </section>

        {/* 5. RESUMEN */}
        <section className="mt-10 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">Tu reserva</p>
          <p className="mt-1 font-display text-lg font-semibold text-navy">{reserva.tour.nombre}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <FilaResumen label="Fecha" valor={fechaLarga(reserva.fechaISO)} />
            <FilaResumen
              label="Horario"
              valor={horario ? `${horario.hora}${horario.regreso ? ` — regreso ${horario.regreso}` : ''}` : '—'}
            />
            <FilaResumen
              label="Personas"
              valor={`${reserva.personas} · ${reserva.paquete === 'premium' ? 'Premium' : 'Light'}`}
            />
            <FilaResumen
              label="Menú"
              valor={reserva.platos.map((p) => nombrePlato(p)).join(', ')}
            />
            <FilaResumen label="Recogida" valor={reserva.recogida.hotel || '—'} />
            <div className="!mt-3 flex items-center justify-between border-t border-linea pt-3 text-sm">
              <span className="text-navy-soft">Ya pagado (depósito)</span>
              <span className="font-semibold text-navy">{formatoDinero(reserva.deposito)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-soft">Saldo a bordo (efectivo, −5%)</span>
              <span className="font-semibold text-navy">{formatoDinero(totalCon5Pct)}</span>
            </div>
          </dl>
          <Link
            to={`/mi-reserva?codigo=${reserva.codigo}`}
            className="mt-4 inline-block text-sm font-semibold text-aqua-dark hover:underline"
          >
            Cambiar el menú o la recogida →
          </Link>
        </section>

        {/* 6. ¿Celebráis algo? */}
        <section className="mt-6 rounded-card border border-linea bg-papel-hueso p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 shrink-0 text-coral" aria-hidden="true" />
            <div>
              <p className="font-display text-base font-semibold text-navy">¿Celebráis algo?</p>
              <p className="mt-1 text-sm text-navy-sub">
                Cumpleaños, aniversario, pedida… cuéntanoslo por WhatsApp y lo preparamos a bordo.
              </p>
              <a
                href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hola! Soy ${reserva.contacto.nombre}, tengo la reserva ${reserva.codigo} y quería hablaros de una celebración especial 🎉`)}`}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-block text-sm font-semibold text-aqua-dark hover:underline"
              >
                Escribirnos por WhatsApp →
              </a>
            </div>
          </div>
        </section>

        {/* 7. Tracking — ¿cómo nos encontraste? */}
        <section className="mt-10 border-t border-linea pt-6">
          <p className="text-sm text-navy-soft">Por curiosidad: ¿cómo nos encontraste?</p>
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
            <p className="mt-3 text-sm text-aqua-dark">¡Gracias! Nos ayuda a mejorar.</p>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · ¿Dudas? WhatsApp +1-829-305-2804
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
