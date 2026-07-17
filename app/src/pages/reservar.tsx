import { useState, type ReactNode } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { PasoMenu } from '@/components/reservar/paso-menu'
import { PasoRecogida } from '@/components/reservar/paso-recogida'
import { PasoContacto } from '@/components/reservar/paso-contacto'
import { PasoPago } from '@/components/reservar/paso-pago'
import { ResumenReserva } from '@/components/reservar/resumen-reserva'
import type { DatosContacto, DatosRecogida, Paquete } from '@/components/reservar/tipos'
import { TOURS, type Tour } from '@/data/home'
import { FICHAS, type FichaTour } from '@/data/tours'
import { DIAS_CORTOS, MESES_CORTOS, parseFechaISO } from '@/lib/fechas'

// Funnel de reserva (/reservar/:slug, Fase C). El widget de la ficha es el
// CONFIGURADOR (paquete · fecha · hora · personas); «Continuar» abre aquí, con
// esa config en la URL. La FRONTERA del build es el depósito: el motor de
// reservas (xpotours) sigue pendiente de decisión del cliente, así que se
// construye como PROTOTIPO de UX y el «pagar» no cobra (lo dice el paso 4).
//
// LAYOUT estilo Viator (2026-07-17, pedido de Samuel, con su checkout como
// referencia): dos columnas — a la IZQUIERDA las secciones que se van
// rellenando (acordeón: la activa expandida, las hechas colapsadas con su
// resumen + «Editar», las pendientes en gris), a la DERECHA la tarjeta STICKY de
// «qué estás comprando» (ResumenReserva). Shell PROPIO y MÍNIMO (no el
// HeroInterna de marketing ni el header/megamenú del sitio — como Viator, solo
// el logo arriba): un checkout se hace en una columna enfocada, sin nada que
// invite a salir a mitad de la reserva. Lo que NO se copia de Viator: su
// urgencia inventada (contador de plaza, «reservado 5+ veces») — ver
// ResumenReserva. `noindex`: es una pantalla de flujo, no contenido de Google.

const PASOS = ['Tu menú', 'Recogida', 'Contacto', 'Pago']

function fechaLegible(iso: string | null): string {
  if (!iso) return 'Fecha por confirmar'
  const d = parseFechaISO(iso)
  return `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`
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

  const cambiarPlato = (persona: number, plato: string) =>
    setPlatos((prev) => prev.map((p, i) => (i === persona ? plato : p)))

  const estadoDe = (i: number): EstadoSeccion => (i < paso ? 'done' : i === paso ? 'activo' : 'pendiente')

  return (
    <div className="flex min-h-screen flex-col bg-papel">
      <Meta
        titulo={`Reservar — ${tour.nombre}`}
        descripcion={`Configura tu ${tour.nombre}: elige el menú de cada persona, la recogida y confirma con solo el 25% de depósito.`}
        ruta={`/reservar/${tour.slug}`}
        indexable={false}
      />

      {/* Header MÍNIMO estilo Viator: solo el logo (a la home) + volver al tour.
          Sin el Header/megamenú del sitio: en un checkout no se ofrecen salidas. */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-6">
          <h1 className="font-display text-h2 font-semibold text-navy">Completa tu reserva</h1>
          <p className="mt-1 text-sm text-navy-soft">
            {tour.nombre} · {fechaTxt} · {personas === 1 ? '1 persona' : `${personas} personas`}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)] lg:gap-8">
          {/* IZQUIERDA: secciones que se rellenan (acordeón) */}
          <div className="flex flex-col gap-4">
            <SeccionPaso
              numero={1}
              titulo={PASOS[0]}
              estado={estadoDe(0)}
              onEditar={() => setPaso(0)}
              resumen={
                <ul className="flex flex-col gap-0.5">
                  {platos.map((p, i) => (
                    <li key={i}>
                      <span className="text-navy-soft">Persona {i + 1}:</span>{' '}
                      <span className="font-medium text-navy">{p || '—'}</span>
                    </li>
                  ))}
                </ul>
              }
            >
              <PasoMenu
                platosDisponibles={platosPaquete}
                seleccion={platos}
                onCambio={cambiarPlato}
                nombrePaquete={nombrePaquete}
              />
              <Continuar habilitado={platos.every((p) => p)} onClick={() => setPaso(1)} />
            </SeccionPaso>

            <SeccionPaso
              numero={2}
              titulo={PASOS[1]}
              estado={estadoDe(1)}
              onEditar={() => setPaso(1)}
              resumen={
                <p>
                  <span className="font-medium text-navy">{recogida.hotel || '—'}</span>
                  {recogida.habitacion ? ` · Hab. ${recogida.habitacion}` : ''}
                </p>
              }
            >
              <PasoRecogida
                datos={recogida}
                onCambio={(parcial) => setRecogida((r) => ({ ...r, ...parcial }))}
                horaSalida={horario?.hora ?? null}
              />
              <Continuar habilitado={recogida.hotel.trim() !== ''} onClick={() => setPaso(2)} />
            </SeccionPaso>

            <SeccionPaso
              numero={3}
              titulo={PASOS[2]}
              estado={estadoDe(2)}
              onEditar={() => setPaso(2)}
              resumen={
                <p>
                  <span className="font-medium text-navy">{contacto.nombre || '—'}</span>
                  {contacto.email ? ` · ${contacto.email}` : ''}
                  {contacto.telefono ? ` · ${contacto.telefono}` : ''}
                </p>
              }
            >
              <PasoContacto datos={contacto} onCambio={(parcial) => setContacto((c) => ({ ...c, ...parcial }))} />
              <Continuar
                habilitado={contacto.nombre.trim() !== '' && contacto.email.trim() !== ''}
                onClick={() => setPaso(3)}
              />
            </SeccionPaso>

            <SeccionPaso numero={4} titulo={PASOS[3]} estado={estadoDe(3)}>
              <PasoPago deposito={deposito} saldo={saldo} frontera={frontera} onPagar={() => setFrontera(true)} />
            </SeccionPaso>
          </div>

          {/* DERECHA: «qué estás comprando», sticky */}
          <div className="lg:sticky lg:top-6">
            <ResumenReserva
              tour={tour}
              fechaTxt={fechaTxt}
              horarioTxt={horarioTxt}
              nombrePaquete={nombrePaquete}
              personas={personas}
              total={total}
              deposito={deposito}
              saldo={saldo}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · Reserva directa segura · Cancela gratis hasta 7 días antes
      </footer>
    </div>
  )
}

type EstadoSeccion = 'done' | 'activo' | 'pendiente'

// Una sección del acordeón (columna izquierda). Activa = formulario expandido;
// hecha = colapsada con su resumen + «Editar»; pendiente = cabecera en gris.
function SeccionPaso({
  numero,
  titulo,
  estado,
  onEditar,
  resumen,
  children,
}: {
  numero: number
  titulo: string
  estado: EstadoSeccion
  onEditar?: () => void
  resumen?: ReactNode
  children?: ReactNode
}) {
  return (
    <section
      className={`overflow-hidden rounded-card-grande border bg-papel ${
        estado === 'activo' ? 'border-linea-fuerte' : 'border-linea'
      }`}
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
              estado === 'pendiente' ? 'bg-papel-hueso text-navy-soft ring-1 ring-linea' : 'bg-navy text-white'
            }`}
          >
            {estado === 'done' ? <Check className="size-4" aria-hidden="true" /> : numero}
          </span>
          <h2
            className={`font-display text-lg font-semibold ${estado === 'pendiente' ? 'text-navy-soft' : 'text-navy'}`}
          >
            {titulo}
          </h2>
        </div>
        {estado === 'done' && onEditar ? (
          <button
            type="button"
            onClick={onEditar}
            className="shrink-0 text-sm font-medium text-aqua-dark transition-colors hover:text-aqua"
          >
            Editar
          </button>
        ) : null}
      </header>

      {estado === 'activo' ? <div className="border-t border-linea px-5 py-5 sm:px-6">{children}</div> : null}
      {estado === 'done' && resumen ? (
        <div className="border-t border-linea px-5 py-4 text-sm text-navy-sub sm:px-6">{resumen}</div>
      ) : null}
    </section>
  )
}

function Continuar({ habilitado, onClick }: { habilitado: boolean; onClick: () => void }) {
  return (
    <div className="mt-5">
      <FancyButton.Root variant="primary" disabled={!habilitado} onClick={onClick}>
        Continuar
      </FancyButton.Root>
    </div>
  )
}
