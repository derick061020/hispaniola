import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { buscarCotizacion, type CotizacionEvento } from '@/lib/cotizacion-evento'
import { fechaLarga, sumarDias } from '@/lib/fechas'
import { EVENTOS } from '@/data/eventos'

// «¡Recibimos tu solicitud!» — pantalla post-envío del formulario de las
// landings de eventos (PLAN-EVENTOS.md E5). Se muestra DESPUÉS de que
// el widget-evento.tsx guarda la cotización en localStorage y navega
// aquí con `?reserva=XXX` (el código generado).
//
// LAYOUT (1 sola columna, max-w-3xl, todo centrado — es una pantalla
// de confirmación, no un checkout, mismo patrón que gracias.tsx de
// reservas):
//   1. Check grande + «¡Recibimos tu solicitud, {nombre}!»
//   2. Código de cotización destacado
//   3. Resumen del formulario enviado (lo que eligió)
//   4. Timeline «Qué sigue» (2 pasos: hoy / día del evento)
//   5. CTA WhatsApp grande (en TODAS las landings de evento, no solo
//      bodas como en el prototipo)
//   6. Link «Hacer otra consulta» → vuelve a la landing
//
// DATOS: la cotización se guarda en localStorage al enviar el form
// (widget-evento.tsx → handleSubmit → guardarCotizacion). Esta página
// la lee por código (query param ?reserva=…). Sin código, redirige
// al inicio (no hay reserva demo para eventos como sí hay para tours).

export function GraciasEventoPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const codigo = params.get('reserva')

  const [cotizacion, setCotizacion] = useState<CotizacionEvento | null>(null)

  useEffect(() => {
    if (!codigo || !slug) {
      navigate('/', { replace: true })
      return
    }
    const c = buscarCotizacion(codigo)
    // La cotización SIEMPRE existe (la acabamos de guardar en el form),
    // pero validamos que sea del slug correcto (anti-trampa manual de URL).
    if (!c || c.slug !== slug) {
      navigate('/', { replace: true })
      return
    }
    setCotizacion(c)
  }, [codigo, slug, navigate])

  if (!cotizacion) return null

  const evento = EVENTOS[cotizacion.slug]
  const nombreCorto = cotizacion.contacto.nombre.split(' ')[0]
  // Mismo patrón que gracias.tsx: el "día antes" del evento, si eligió
  // fecha tentativa. Si no eligió fecha, la línea del timeline solo
  // dice "te confirmamos por WhatsApp la fecha".
  const fechaRecordatorioISO = cotizacion.fecha ? sumarDias(cotizacion.fecha, -1) : null

  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`We got your request! · ${codigo}`}
        descripcion={`Your request ${codigo} has been received. We’ll get back to you within 24 h.`}
        ruta={`/events/${slug}/thank-you`}
        indexable={false}
      />

      {/* Header mínimo — mismo patrón que gracias.tsx (no invitamos a
          salir a mitad de una pantalla crítica). Logo centrado (2026-07-17,
          pedido de Samuel): las 2 páginas de gracias son de confirmación,
          no de exploración — el header no compite por atención, solo ancla
          la marca. */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-5 py-3 sm:px-8">
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
            We got your request, {nombreCorto}!
          </h1>
          <p className="mt-3 text-base text-navy-sub sm:text-lg">
            {evento.cierreMeta}. We’ll reach out on WhatsApp or by email with the quote.
          </p>
        </div>

        {/* 2. CÓDIGO — destacado */}
        <div className="mt-8 flex flex-col items-center gap-2 rounded-card-grande border-2 border-linea-fuerte bg-papel-hueso px-6 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
            Your request code
          </p>
          <p className="font-mono text-xl font-semibold tracking-wider text-navy sm:text-2xl">
            {codigo}
          </p>
          <p className="text-xs text-navy-soft">
            You’ll need it if you write to us on WhatsApp or by email.
          </p>
        </div>

        {/* 3. RESUMEN del formulario enviado */}
        <section className="mt-8 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
            Your request
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-navy">
            {evento.nombre}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <FilaResumen label="Name" valor={cotizacion.contacto.nombre} />
            <FilaResumen label="Email" valor={cotizacion.contacto.email} />
            <FilaResumen label="WhatsApp" valor={cotizacion.contacto.whatsapp} />
            <FilaResumen label="Event type" valor={cotizacion.tipoEvento} />
            <FilaResumen
              label="Tentative date"
              valor={cotizacion.fecha ? fechaLarga(cotizacion.fecha) : 'To be arranged'}
            />
            <FilaResumen
              label="Number of guests"
              valor={`${cotizacion.personas} ${cotizacion.personas === 1 ? 'guest' : 'guests'}`}
            />
            {cotizacion.mensaje ? (
              <FilaResumen label="Message" valor={cotizacion.mensaje} />
            ) : null}
          </dl>
        </section>

        {/* 4. TIMELINE «Qué sigue» */}
        <section className="mt-10">
          <p className="font-display text-lg font-semibold text-navy">What happens next</p>
          <ol className="mt-4 space-y-4">
            <PasoTimeline
              numero={1}
              cuando="Today"
              descripcion={
                <>
                  We confirm by email that your request arrived. The detailed quote
                  reaches you within 24 h.
                </>
              }
            />
            <PasoTimeline
              numero={2}
              cuando={
                fechaRecordatorioISO
                  ? `${fechaLarga(fechaRecordatorioISO)} (the day before the event)`
                  : 'Once you confirm the date'
              }
              descripcion={
                <>
                  We reach out on WhatsApp to settle the last details: exact boarding
                  time, menu, pickup and logistics.
                </>
              }
            />
          </ol>
        </section>

        {/* 5. CTA WHATSAPP — grande, el canal principal de eventos. */}
        <section className="mt-10 rounded-card-grande border border-linea bg-papel-hueso p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="size-6 shrink-0 text-menta-texto" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-display text-lg font-semibold text-navy">Want to get ahead?</p>
              <p className="mt-1 text-sm text-navy-sub">
                Message us on WhatsApp with your request code and we’ll reply right away.
              </p>
              <a
                href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! I’m ${cotizacion.contacto.nombre}, I sent a ${evento.nombre.toLowerCase()} request with code ${codigo}.`)}`}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-2 rounded-btn bg-menta-texto px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-menta-texto/90"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Open WhatsApp with your code
              </a>
            </div>
          </div>
        </section>

        {/* 6. CELEBRACIÓN — callout (mismo idioma que gracias.tsx de
            reservas, para eventos aplica a bodas, despedidas, etc.). */}
        {/* ⚠️ Los términos que descartan el callout tienen que ser LOS DE
            `tiposEvento` en data/eventos.ts, que desde F7 están en inglés: con
            los de antes («corporativo», «incentivo», «convención»,
            «lanzamiento») el filtro no casaba con nada y a un lanzamiento de
            producto se le ofrecía tarta. */}
        {cotizacion.tipoEvento !== 'Other' &&
        !cotizacion.tipoEvento.toLowerCase().includes('corporate') &&
        !cotizacion.tipoEvento.toLowerCase().includes('incentive') &&
        !cotizacion.tipoEvento.toLowerCase().includes('team building') &&
        !cotizacion.tipoEvento.toLowerCase().includes('convention') &&
        !cotizacion.tipoEvento.toLowerCase().includes('product launch') ? (
          <section className="mt-6 rounded-card border border-linea bg-papel-hueso p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 shrink-0 text-coral" aria-hidden="true" />
              <div>
                <p className="font-display text-base font-semibold text-navy">Celebrating something?</p>
                <p className="mt-1 text-sm text-navy-sub">
                  If it is a special occasion, tell us on WhatsApp: decorations, cake,
                  surprises on board. We’ll take care of it.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* 7. LINK «Hacer otra consulta» — vuelve a la landing. */}
        <p className="mt-10 text-center">
          <Link
            to={`/events/${slug}`}
            className="font-semibold text-aqua-dark hover:underline"
          >
            ← Send another {evento.nombre.toLowerCase()} inquiry
          </Link>
        </p>
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
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-navy-soft">{label}</dt>
      <dd className="text-right text-navy">{valor}</dd>
    </div>
  )
}
