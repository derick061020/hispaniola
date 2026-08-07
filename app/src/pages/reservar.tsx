import { useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { PasoMenu } from '@/components/reservar/paso-menu'
import { PasoRecogida } from '@/components/reservar/paso-recogida'
import { BannerPremium } from '@/components/reservar/banner-premium'
import { PasoContacto } from '@/components/reservar/paso-contacto'
import { PasoPago } from '@/components/reservar/paso-pago'
import { ResumenReserva } from '@/components/reservar/resumen-reserva'
import { etiquetaOcasion, type DatosCelebracion, type DatosContacto, type DatosRecogida, type Paquete } from '@/components/reservar/tipos'
import { MAX_PERSONAS_DEFAULT } from '@/components/tour/widget-reserva'
import { TOURS, type Tour } from '@/data/home'
import { FICHAS, type FichaTour } from '@/data/tours'
import { guardarReserva, generarCodigoReserva, type Reserva } from '@/lib/reservas'

// Funnel de reserva (/reservar/:slug, Fase C). El widget de la ficha es el
// CONFIGURADOR (paquete · fecha · hora · personas); «Continuar» abre aquí, con
// esa config en la URL. La FRONTERA del build es el depósito: el motor de
// reservas (xpotours) sigue pendiente de decisión del cliente, así que se
// construye como PROTOTIPO de UX y el «pagar» no cobra (lo dice el paso 4).
//
// LAYOUT estilo Viator (2026-07-17, pedido de Samuel): 2 zonas — a la IZQUIERDA
// (blanca) las secciones que se rellenan en acordeón (la activa expandida, las
// hechas colapsadas con resumen + «Editar», las pendientes en gris; SeccionPaso
// abajo), a la DERECHA la tarjeta «qué estás comprando». TODA la zona derecha es
// GRIS a sangre hasta el borde del viewport y a altura completa (no solo un box
// alrededor de la card) — ver el ::after de la celda derecha. Header MÍNIMO (solo
// logo + selector de moneda, sin Header/megamenú del sitio ni topbar de
// contacto/idioma — todo eso invita a salir a mitad de un checkout). Lo que NO se
// copia de Viator: su urgencia inventada (contador de plaza, «reservado 5+
// veces»), prohibida por revision-wireframes.md §2.7. `noindex`.

// Orden de las secciones (2026-07-17, Samuel): contacto primero, luego el menú.
const PASOS = ['Contact', 'Your menu', 'Pickup', 'Payment']

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
  // Desde 2026-08-07 la URL es solo el VALOR INICIAL: fecha y personas se
  // pueden cambiar ya dentro del funnel (ResumenReserva), sin volver a la ficha.
  const paquete: Paquete = params.get('paquete') === 'premium' ? 'premium' : 'light'
  const horarioIdx = Number(params.get('horario')) || 0
  const fechaISO = params.get('fecha')
  // Mismo tope que el stepper del widget de la ficha (ver MAX_PERSONAS_DEFAULT):
  // tours duales (Snorkel Lovers, con precio de niño) llegan al maxPax del tour;
  // el resto se queda en 6 — un grupo mayor se arma con el charter, no aquí.
  const maxPersonas = tour.precioNino != null ? (tour.maxPax ?? MAX_PERSONAS_DEFAULT) : MAX_PERSONAS_DEFAULT
  const personas = Math.min(Math.max(Number(params.get('personas')) || 2, 1), maxPersonas)

  return (
    <FlujoReserva
      tour={tour}
      ficha={ficha}
      precioLight={tour.precioLight}
      paqueteInicial={paquete}
      personasIniciales={personas}
      maxPersonas={maxPersonas}
      horarioInicial={horarioIdx}
      fechaInicialISO={fechaISO}
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
  paqueteInicial,
  personasIniciales,
  maxPersonas,
  horarioInicial,
  fechaInicialISO,
}: {
  tour: Tour
  ficha: FichaTour
  precioLight: number
  paqueteInicial: Paquete
  personasIniciales: number
  maxPersonas: number
  horarioInicial: number
  fechaInicialISO: string | null
}) {
  const navigate = useNavigate()

  const [paso, setPaso] = useState(0)
  // El PAQUETE también es estado desde 2026-08-07: el banner de upsell lo cambia
  // sin salir del checkout (antes había que volver a la ficha).
  const [paquete, setPaquete] = useState<Paquete>(paqueteInicial)
  const platosPaquete = paquete === 'premium' ? ficha.menuPremium : ficha.menuLight
  const nombrePaquete = paquete === 'premium' ? 'Premium' : 'Light'
  const [horarioIdx, setHorarioIdx] = useState(horarioInicial)
  const horario = ficha.horarios[horarioIdx] ?? ficha.horarios[0]
  // Fecha y personas son ESTADO desde 2026-08-07 (antes: props de solo lectura
  // leídas de la URL). Cambiarlas aquí evita el viaje de vuelta a la ficha —y,
  // en el caso de la fecha, cierra un agujero: entrando directo a /book/:slug
  // se podía completar el flujo entero sin haber elegido día.
  const [personas, setPersonas] = useState(personasIniciales)
  const [fechaISO, setFechaISO] = useState<string | null>(fechaInicialISO)
  // Empieza SIN plato elegido (2026-07-17, Samuel): cada persona lo escoge
  // activamente en su card. «Continuar» del paso 1 se habilita al elegir todos.
  const [platos, setPlatos] = useState<string[]>(() => Array.from({ length: personasIniciales }, () => ''))
  const [recogida, setRecogida] = useState<DatosRecogida>({ hotel: '', notas: '' })
  const [contacto, setContacto] = useState<DatosContacto>({
    nombre: '',
    apellidos: '',
    email: '',
    emailConfirm: '',
    telefono: '',
  })
  const [celebracion, setCelebracion] = useState<DatosCelebracion>({ ocasion: null, nota: '' })

  const upgrade = paquete === 'premium' && ficha.upgradePremium !== null ? ficha.upgradePremium : 0
  const total = (precioLight + upgrade) * personas
  const deposito = Math.round(total * 0.25)
  const saldo = total - deposito

  // Cambiar el nº de personas re-dimensiona la lista de platos conservando los
  // ya elegidos. Si el grupo CRECE y el paso del menú ya estaba cerrado, el
  // flujo vuelve a él: el comensal nuevo no tiene plato y salir a pagar con un
  // menú incompleto sería una reserva que la cocina no puede preparar.
  const cambiarPersonas = (n: number) => {
    setPersonas(n)
    setPlatos((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ''))
    if (n > personas && paso > 1) setPaso(1)
  }

  // Subir a Premium desde el banner. Los platos elegidos se BORRAN porque las
  // dos cartas no comparten platos: conservarlos dejaría en la reserva nombres
  // que ya no existen en el menú que se va a cocinar. No devuelve al paso del
  // menú a la fuerza —desde 2026-08-07 elegir plato es opcional— pero el
  // resumen de ese paso vuelve a decir «Por confirmar» y el aviso del correo
  // sigue en pie, así que el visitante ve que hay algo que puede reelegir.
  const subirAPremium = () => {
    setPaquete('premium')
    setPlatos((prev) => prev.map(() => ''))
  }

  // "Pagar" — persiste la reserva en localStorage y navega a la pantalla
  // de confirmación. No hay backend todavía (PLAN-LANZAMIENTO Bloque A),
  // así que la "reserva" vive en el navegador del cliente hasta que se
  // conecte Odoo/xpotours. Cuando exista backend, este handler será
  // `onClick={async () => await api.createReserva(reserva)}` y la nav
  // se hace con el codigo que devuelva el server.
  const handlePagar = () => {
    const codigo = generarCodigoReserva()
    const reserva: Reserva = {
      codigo,
      slug: tour.slug,
      tour: {
        nombre: tour.nombre,
        audienciaChip: tour.audienciaChip,
        duracionCorta: tour.duracionCorta,
        maxPax: tour.maxPax,
        precioLight: tour.precioLight,
      },
      ficha: {
        menuLight: ficha.menuLight,
        menuPremium: ficha.menuPremium,
        horarios: ficha.horarios,
        upgradePremium: ficha.upgradePremium,
      },
      paquete,
      personas,
      horarioIdx,
      fechaISO: fechaISO ?? new Date().toISOString().slice(0, 10),
      platos,
      recogida: { hotel: recogida.hotel.trim(), notas: recogida.notas.trim() },
      contacto: {
        nombre: contacto.nombre.trim(),
        apellidos: contacto.apellidos.trim(),
        email: contacto.email.trim(),
        telefono: contacto.telefono.trim(),
      },
      // Solo viaja si hay algo que celebrar: `ninguna` es una respuesta válida
      // en pantalla, pero guardarla no aporta nada a la tripulación.
      ...(celebracion.ocasion && celebracion.ocasion !== 'ninguna'
        ? { celebracion: { ocasion: celebracion.ocasion, nota: celebracion.nota.trim() } }
        : {}),
      total,
      deposito,
      saldo,
      fechaCreacionISO: new Date().toISOString(),
    }
    guardarReserva(reserva)
    navigate(`/book/${tour.slug}/thank-you?codigo=${codigo}`)
  }

  // La FECHA ya la pinta el propio campo de calendario del resumen (con su hora
  // de salida), así que esta línea solo añade lo que allí no cabe: el regreso.
  const horarioTxt = horario
    ? `Departure ${horario.hora}${horario.regreso ? ` · back at ${horario.regreso}` : ''}`
    : 'Schedule to be confirmed'

  const cambiarPlato = (persona: number, plato: string) =>
    setPlatos((prev) => prev.map((p, i) => (i === persona ? plato : p)))

  const estadoDe = (i: number): EstadoSeccion => (i < paso ? 'done' : i === paso ? 'activo' : 'pendiente')

  return (
    // overflow-x-clip: recorta el ::after w-screen de la zona gris sin volverse
    // contenedor de scroll (a diferencia de overflow-hidden), así el sticky de
    // la derecha sigue funcionando.
    <div className="flex min-h-screen flex-col overflow-x-clip bg-papel">
      <Meta
        titulo={`Book — ${tour.nombre}`}
        descripcion={`Set up your ${tour.nombre}: pick each guest’s dish, the pickup and confirm with just a 25% deposit.`}
        ruta={`/book/${tour.slug}`}
        indexable={false}
      />

      {/* Header MÍNIMO estilo Viator: logo (a la home) + selector de moneda. */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" aria-label="Hispaniola Aquatic Adventures home">
            <Logo compacto />
          </Link>
          {/* Selector de moneda visual (Samuel) — como el «USD» de Viator. Los
              precios del sitio son todos en US$; decorativo, igual que el
              SelectorIdioma del topbar (sin conversión real todavía). */}
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-navy-sub transition-colors hover:text-navy"
          >
            USD
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Grid de 2 zonas. Sin `items-start`: las celdas se ESTIRAN a la misma
            altura (la del formulario, más largo), así el gris de la derecha
            llega hasta abajo. La celda derecha lleva bg gris + un ::after que lo
            extiende w-screen hasta el borde del viewport (recortado por el
            overflow-x-clip de arriba) — «todo el lado derecho gris», no un box. */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
          {/* IZQUIERDA (blanca): cabecera + secciones */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <h1 className="sr-only">Complete your booking — {tour.nombre}</h1>

            <div className="flex flex-col gap-4">
              <SeccionPaso
                numero={1}
                titulo={PASOS[0]}
                estado={estadoDe(0)}
                onEditar={() => setPaso(0)}
                resumen={
                  <>
                    <p>
                      <span className="font-medium text-navy">
                        {[contacto.nombre, contacto.apellidos].filter(Boolean).join(' ') || '—'}
                      </span>
                      {contacto.email ? ` · ${contacto.email}` : ''}
                      {contacto.telefono ? ` · ${contacto.telefono}` : ''}
                    </p>
                    {etiquetaOcasion(celebracion.ocasion) ? (
                      <p className="mt-0.5 text-coral">
                        {etiquetaOcasion(celebracion.ocasion)}
                        {celebracion.nota.trim() ? ` · ${celebracion.nota.trim()}` : ''}
                      </p>
                    ) : null}
                  </>
                }
              >
                <PasoContacto
                  datos={contacto}
                  onCambio={(parcial) => setContacto((c) => ({ ...c, ...parcial }))}
                  celebracion={celebracion}
                  onCambioCelebracion={(parcial) => setCelebracion((c) => ({ ...c, ...parcial }))}
                />
                <Continuar
                  habilitado={
                    contacto.nombre.trim() !== '' &&
                    contacto.email.trim() !== '' &&
                    contacto.email === contacto.emailConfirm
                  }
                  onClick={() => setPaso(1)}
                />
              </SeccionPaso>

              <SeccionPaso
                numero={2}
                titulo={PASOS[1]}
                estado={estadoDe(1)}
                onEditar={() => setPaso(1)}
                resumen={
                  <ul className="flex flex-col gap-0.5">
                    {platos.map((p, i) => (
                      <li key={i}>
                        <span className="text-navy-soft">Persona {i + 1}:</span>{' '}
                        {p ? (
                          <span className="font-medium text-navy">{p}</span>
                        ) : (
                          <span className="text-navy-soft">to be confirmed by email</span>
                        )}
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
                {/* Siempre habilitado (2026-08-07): el menú dejó de ser un
                    requisito para reservar. El botón cambia de texto para que
                    nadie avance creyendo que ya eligió. */}
                <Continuar
                  habilitado
                  texto={platos.every((p) => p) ? 'Continue' : 'Continue and pick the menu later'}
                  onClick={() => setPaso(2)}
                />
              </SeccionPaso>

              <SeccionPaso
                numero={3}
                titulo={PASOS[2]}
                estado={estadoDe(2)}
                onEditar={() => setPaso(2)}
                resumen={
                  <p>
                    <span className="font-medium text-navy">{recogida.hotel || '—'}</span>
                  </p>
                }
              >
                <PasoRecogida
                  datos={recogida}
                  onCambio={(parcial) => setRecogida((r) => ({ ...r, ...parcial }))}
                  horaSalida={horario?.hora ?? null}
                />
                <Continuar habilitado={recogida.hotel.trim() !== ''} onClick={() => setPaso(3)} />
              </SeccionPaso>

              <SeccionPaso numero={4} titulo={PASOS[3]} estado={estadoDe(3)}>
                <PasoPago
                  deposito={deposito}
                  saldo={saldo}
                  fechaElegida={fechaISO !== null}
                  onPagar={handlePagar}
                />
              </SeccionPaso>
            </div>
          </div>

          {/* DERECHA: zona GRIS a sangre (bg + ::after w-screen), altura completa.
              En MÓVIL va PRIMERA (order-first): ahí no hay dos columnas, y con la
              tarjeta al final el visitante rellenaba el formulario entero sin ver
              qué compra, cuánto paga hoy ni el stepper de personas que ahora vive
              dentro. En desktop no cambia nada (lg:order-none). */}
          <div className="relative order-first bg-fondo-ficha px-5 py-8 sm:px-8 sm:py-10 lg:order-none lg:after:absolute lg:after:inset-y-0 lg:after:left-full lg:after:w-screen lg:after:bg-fondo-ficha lg:after:content-['']">
            <div className="lg:sticky lg:top-6">
              {/* Banner de upgrade ARRIBA de la tarjeta (2026-08-07, pedido de
                  Samuel). Solo con Light elegido y solo si el tour publica
                  upgrade y ventajas — en Premium desaparece porque ya no hay
                  nada que ofrecer, igual que la caja del widget de la ficha. */}
              {paquete === 'light' && ficha.upgradePremium !== null && ficha.ventajasPremium?.length ? (
                <BannerPremium
                  upgrade={ficha.upgradePremium}
                  personas={personas}
                  totalActual={total}
                  ventajas={ficha.ventajasPremium}
                  onCambiar={subirAPremium}
                />
              ) : null}
              <ResumenReserva
                tour={tour}
                fechaISO={fechaISO}
                onFecha={setFechaISO}
                horarios={ficha.horarios}
                horarioIdx={horarioIdx}
                onHorario={setHorarioIdx}
                horarioTxt={horarioTxt}
                horaSalida={horario?.hora ?? null}
                nombrePaquete={nombrePaquete}
                personas={personas}
                minPersonas={1}
                maxPersonas={maxPersonas}
                onPersonas={cambiarPersonas}
                precioBase={precioLight}
                upgrade={upgrade}
                total={total}
                deposito={deposito}
                saldo={saldo}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · Secure direct booking · Free cancellation up to 7 days before
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
            Edit
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

function Continuar({
  habilitado,
  texto = 'Continue',
  onClick,
}: {
  habilitado: boolean
  /** Texto del botón; el paso del menú lo cambia cuando se avanza sin elegir. */
  texto?: string
  onClick: () => void
}) {
  return (
    <div className="mt-5">
      <FancyButton.Root variant="primary" disabled={!habilitado} onClick={onClick}>
        {texto}
      </FancyButton.Root>
    </div>
  )
}
