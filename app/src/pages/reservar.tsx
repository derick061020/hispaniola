import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { PasoMenu } from '@/components/reservar/paso-menu'
import { PasoRecogida } from '@/components/reservar/paso-recogida'
import { PasoContacto } from '@/components/reservar/paso-contacto'
import { PasoResumen } from '@/components/reservar/paso-resumen'
import type { DatosContacto, DatosRecogida, Paquete } from '@/components/reservar/tipos'
import { TOURS, type Tour } from '@/data/home'
import { FICHAS, type FichaTour } from '@/data/tours'
import { DIAS_CORTOS, parseFechaISO } from '@/lib/fechas'

// Funnel de reserva (/reservar/:slug, Fase C). El widget de la ficha es el
// CONFIGURADOR (paquete · fecha · hora · personas); «Continuar» abre aquí, con
// esa config en la URL. 4 pasos: menú por persona → recogida → contacto →
// revisar + depósito 25%. La FRONTERA del build es el depósito: el motor de
// reservas (xpotours) sigue pendiente de decisión del cliente, así que se
// construye como PROTOTIPO de UX y el «pagar» no cobra (lo dice el paso 4).
//
// `noindex`: es una pantalla de flujo, no contenido que buscar en Google.
// Shell PROPIO y compacto (no el HeroInterna de marketing del resto de
// internas): un checkout se hace en una columna enfocada, sin megamenú ni
// video que inviten a salir a mitad de la reserva.

const PASOS = ['Menú', 'Recogida', 'Contacto', 'Pago']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function fechaLegible(iso: string | null): string {
  if (!iso) return 'Fecha por confirmar'
  const d = parseFechaISO(iso)
  return `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`
}

export function ReservarPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const tour = TOURS.find((t) => t.slug === slug)
  const ficha = slug ? FICHAS[slug] : undefined

  // El funnel solo existe para tours 'completo' (se venden por fecha+paquete).
  // Charter cotiza y Saona consulta → de vuelta a su ficha (o a la home).
  if (!tour || !ficha || tour.booking !== 'completo' || tour.precioLight === null) {
    return <Navigate to={slug ? `/tours/${slug}` : '/'} replace />
  }

  // Config que trae el widget en la URL; defaults sensatos si se entra directo.
  const paquete: Paquete = params.get('paquete') === 'premium' ? 'premium' : 'light'
  const horarioIdx = Number(params.get('horario')) || 0
  const fechaISO = params.get('fecha')
  const maxPax = tour.maxPax ?? 8
  const personas = Math.min(Math.max(Number(params.get('personas')) || 2, 1), maxPax)

  return (
    <FlujoReserva
      tour={tour}
      ficha={ficha}
      precioLight={tour.precioLight}
      paquete={paquete}
      personas={personas}
      horarioIdx={horarioIdx}
      fechaISO={fechaISO}
    />
  )
}

// El estado del flujo vive aquí (no en ReservarPage) para que sus hooks nunca
// queden detrás del early-return del guard: ReservarPage garantiza tour/ficha
// válidos antes de montar este componente.
function FlujoReserva({
  tour,
  ficha,
  precioLight,
  paquete,
  personas,
  horarioIdx,
  fechaISO,
}: {
  tour: Tour
  ficha: FichaTour
  precioLight: number
  paquete: Paquete
  personas: number
  horarioIdx: number
  fechaISO: string | null
}) {
  const platosPaquete = paquete === 'premium' ? ficha.menuPremium : ficha.menuLight
  const nombrePaquete = paquete === 'premium' ? 'Premium' : 'Light'
  const horario = ficha.horarios[horarioIdx] ?? ficha.horarios[0]
  const precioPersona =
    paquete === 'premium' && ficha.upgradePremium !== null ? precioLight + ficha.upgradePremium : precioLight
  const total = precioPersona * personas
  const deposito = Math.round(total * 0.25)
  const saldo = total - deposito

  const [paso, setPaso] = useState(0)
  const [platos, setPlatos] = useState<string[]>(() =>
    Array.from({ length: personas }, () => platosPaquete[0]?.nombre ?? ''),
  )
  const [recogida, setRecogida] = useState<DatosRecogida>({ hotel: '', habitacion: '', notas: '' })
  const [contacto, setContacto] = useState<DatosContacto>({ nombre: '', email: '', telefono: '' })
  const [frontera, setFrontera] = useState(false)

  const fechaTxt = fechaLegible(fechaISO)
  const horarioTxt = horario ? `${horario.hora}${horario.regreso ? ` — regreso ${horario.regreso}` : ''}` : '—'
  const esUltimo = paso === PASOS.length - 1

  const puedeAvanzar =
    paso === 0
      ? platos.every((p) => p)
      : paso === 1
        ? recogida.hotel.trim() !== ''
        : paso === 2
          ? contacto.nombre.trim() !== '' && contacto.email.trim() !== ''
          : true

  const cambiarPlato = (persona: number, plato: string) =>
    setPlatos((prev) => prev.map((p, i) => (i === persona ? plato : p)))

  return (
    <div className="flex min-h-screen flex-col bg-papel">
      <Meta
        titulo={`Reservar — ${tour.nombre}`}
        descripcion={`Configura tu ${tour.nombre}: elige el menú de cada persona, la recogida y confirma con solo el 25% de depósito.`}
        ruta={`/reservar/${tour.slug}`}
        indexable={false}
      />
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-contenido items-center justify-between px-5 py-3 sm:px-10">
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures">
            <Logo compacto />
          </Link>
          <Link
            to={`/tours/${tour.slug}`}
            className="flex items-center gap-1.5 text-sm font-medium text-navy-sub transition-colors hover:text-navy"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al tour
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-6">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">Reservar</p>
          <h1 className="mt-1 font-display text-h2 font-semibold text-navy">{tour.nombre}</h1>
          <p className="mt-1 text-sm text-navy-soft">
            {fechaTxt} · {horarioTxt} · {personas === 1 ? '1 persona' : `${personas} personas`}
          </p>
        </div>

        <BarraPasos paso={paso} />

        <div className="mt-8">
          {paso === 0 ? (
            <PasoMenu
              platosDisponibles={platosPaquete}
              seleccion={platos}
              onCambio={cambiarPlato}
              nombrePaquete={nombrePaquete}
            />
          ) : paso === 1 ? (
            <PasoRecogida
              datos={recogida}
              onCambio={(parcial) => setRecogida((r) => ({ ...r, ...parcial }))}
              horaSalida={horario?.hora ?? null}
            />
          ) : paso === 2 ? (
            <PasoContacto datos={contacto} onCambio={(parcial) => setContacto((c) => ({ ...c, ...parcial }))} />
          ) : (
            <PasoResumen
              tituloTour={tour.nombre}
              fechaTxt={fechaTxt}
              horarioTxt={horarioTxt}
              nombrePaquete={nombrePaquete}
              personas={personas}
              seleccion={platos}
              recogida={recogida}
              contacto={contacto}
              precioPersona={precioPersona}
              total={total}
              deposito={deposito}
              saldo={saldo}
              frontera={frontera}
              onPagar={() => setFrontera(true)}
            />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-linea pt-5">
          {paso > 0 ? (
            <button
              type="button"
              onClick={() => {
                setFrontera(false)
                setPaso(paso - 1)
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-sub transition-colors hover:text-navy"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Atrás
            </button>
          ) : (
            <span />
          )}
          {!esUltimo ? (
            <FancyButton.Root variant="primary" disabled={!puedeAvanzar} onClick={() => setPaso(paso + 1)}>
              Continuar
            </FancyButton.Root>
          ) : (
            <span />
          )}
        </div>
      </main>

      <footer className="border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · Reserva directa segura · Cancela gratis hasta 7 días antes
      </footer>
    </div>
  )
}

function BarraPasos({ paso }: { paso: number }) {
  return (
    <ol className="flex items-center">
      {PASOS.map((label, i) => {
        const hecho = i < paso
        const actual = i === paso
        return (
          <li key={label} className="flex items-center last:flex-none [&:not(:last-child)]:flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  hecho || actual ? 'bg-navy text-white' : 'bg-papel-hueso text-navy-soft ring-1 ring-linea'
                }`}
              >
                {hecho ? <Check className="size-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:inline ${actual ? 'text-navy' : 'text-navy-soft'}`}>
                {label}
              </span>
            </div>
            {i < PASOS.length - 1 ? (
              <span className={`mx-2 h-px flex-1 ${hecho ? 'bg-navy' : 'bg-linea'}`} aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
