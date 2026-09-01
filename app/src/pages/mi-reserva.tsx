import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, CreditCard, KeyRound, MapPin, Pencil, Ticket, Users, Utensils } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { fechaLarga } from '@/lib/fechas'
import { guardarReserva, reservaDemo, type Reserva } from '@/lib/reservas'
import { menuDeLaReserva } from '@/lib/menu-reserva'
import { formatoDinero } from '@/data/home'
import { Campo } from '@/components/ui/campo'

// «Mi reserva» — vista de la reserva ya pagada con edición local (2026-07-17,
// pedido de Pedro). El usuario pidió que las ediciones se guarden en
// local (localStorage) para ser "más fieles al prototipo" — la página
// queda usable sin backend.
//
// FLUJO (2 estados):
//   1. INGRESO — sin `?codigo=…` en la URL, la página muestra un input
//      centrado que pide el código HSP-XXXX-NNNN. Submit navega a
//      `?codigo=…` y la página pasa al estado DETALLE. (2026-07-17,
//      pedido de Samuel: "primero debería ser una pantalla para poner
//      un código, y luego de poner el código que te muestre la pantalla
//      de ejemplo".)
//   2. DETALLE — con código en la URL, la página muestra la reserva
//      DE EJEMPLO del prototipo SIEMPRE (mismo comportamiento aunque el
//      código exista en localStorage — el "de momento" de Samuel:
//      "con cualquier código funcione". Cuando llegue el backend, este
//      fallback desaparece y se carga la reserva real del cliente).
//      En la cabecera hay un link "Usar otro código" para volver a
//      INGRESO y meter otro código.
//
// LAYOUT del estado DETALLE (1 columna, max-w-3xl):
//   1. Cabecera: código + tour + fecha + chip «Demo».
//   2. Bloque «Tu reserva» (resumen + botón «Pagar saldo online»).
//   3. Bloque «Tu menú» (platos por persona, editables).
//   4. Bloque «Recogida» (hotel + notas, editables).
//   5. Bloque «Datos de contacto» (editables).
//   6. Footer: link a contacto + WhatsApp.
//
// EDICIÓN: cada bloque tiene un botón «Editar» que lo abre en modo
// form. «Guardar» persiste en localStorage (vía guardarReserva).
// «Cancelar» revierte sin guardar.

const NOMBRES_PLATO: Record<string, string> = {
  // Mapeo legacy por si el id guardado no es el nombre (registros viejos en
  // localStorage). El funnel actual guarda `plato.nombre` directamente, así
  // que el lookup principal va por el menú del paquete.
  'surf-turf': 'Surf & Turf', 'ceviche-peruano': 'Ceviche peruano', 'vegano-gourmet': 'Vegano gourmet',
  wagyu: 'Wagyu', langosta: 'Langosta', mariscos: 'Mariscos', carne: 'Carne', vegetariano: 'Vegetariano',
}

function nombrePlato(id: string, menu: { nombre: string }[]) {
  return menu.find((p) => p.nombre === id)?.nombre ?? NOMBRES_PLATO[id] ?? id
}

// [v3 2026-08-06, slide 67] Los 3 modos de acceso. El `id` viaja en la URL
// (`?modo=`) para que el cajón de la home (home/contacto.tsx) pueda mandar
// aquí a alguien que ya escribió su dato, con la pestaña correcta abierta.
const MODOS = [
  { id: 'codigo', etiqueta: 'Booking code', campo: 'Booking code', placeholder: 'HSP-XXXX-NNNN' },
  { id: 'email', etiqueta: 'Email', campo: 'Booking email', placeholder: 'you@email.com' },
  { id: 'telefono', etiqueta: 'Phone', campo: 'Booking phone number', placeholder: '+1 829 000 0000' },
] as const

type Modo = (typeof MODOS)[number]['id']

const AYUDA_MODO: Record<Modo, string> = {
  codigo: 'Find it in your Hispaniola confirmation email. It starts with HSP.',
  email: "We'll send an access link to the email you booked with.",
  telefono: "We'll text an access link to the number you booked with.",
}

export function MiReservaPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  // `codigo` es el parámetro histórico (enlaces ya compartidos); `q` es el
  // nuevo, que acompaña a `modo`. Cualquiera de los dos abre el DETALLE.
  const consulta = params.get('q') ?? params.get('codigo')
  const modoUrl = params.get('modo')
  const modoInicial: Modo = MODOS.some((m) => m.id === modoUrl) ? (modoUrl as Modo) : 'codigo'

  // 2 estados: INGRESO (input) o DETALLE (la demo). Sin dato en la URL
  // siempre arranca en INGRESO — ni siquiera se monta la página de detalle,
  // que es la parte pesada.
  if (!consulta) {
    return (
      <PantallaIngreso
        modoInicial={modoInicial}
        onSubmit={(modo, valor) => navigate(`/my-booking?modo=${modo}&q=${encodeURIComponent(valor)}`)}
      />
    )
  }

  return <DetalleReserva codigoIngresado={consulta} />
}

// Pantalla 1 — ingreso de código. Una sola columna centrada (max-w-md),
// el mismo lenguaje visual que la pantalla /gracias (mismo Logo +
// "Volver al inicio" arriba, max-w-3xl para el main). El input pide el
// código en formato libre (HSP-XXXX-NNNN) — sin validación de formato
// (a día de hoy cualquier cosa funciona; cuando se conecte el backend
// se valida y se muestra error). El submit navega a `?codigo=…`; el
// resto de la lógica vive en DetalleReserva.
function PantallaIngreso({
  modoInicial,
  onSubmit,
}: {
  modoInicial: Modo
  onSubmit: (modo: Modo, valor: string) => void
}) {
  const [valor, setValor] = useState('')
  // CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/07-mi-reserva.md): la
  // maqueta añade un toggle «Con código / Con email» — poder recuperar la
  // reserva con el email con que se reservó, no solo con el código.
  //
  // [v3 2026-08-06, slide 67 + reunión 07-31 14:31] Entra el TERCER modo,
  // teléfono: «que el cliente pueda buscar por reserva, por email y por
  // teléfono». El toggle pasa de 2 a 3 columnas.
  //
  // ⚠️ Sin backend, ninguno de los tres puede validar nada (no hay a quién
  // preguntar): la pantalla de detalle muestra SIEMPRE la reserva de ejemplo.
  // Se construye porque es la estructura que el cliente quiere ver y porque
  // cuando llegue el motor solo hay que cambiar lo que pasa en el submit —
  // pero no se finge una búsqueda que no existe.
  const [modo, setModo] = useState<Modo>(modoInicial)
  const activo = MODOS.find((m) => m.id === modo) ?? MODOS[0]
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const limpio = valor.trim()
    if (!limpio) return
    onSubmit(modo, limpio)
  }
  return (
    <div className="min-h-screen bg-papel-hueso">
      <Meta
        titulo="My booking"
        descripcion="Manage your booking: change the menu, the pickup or your details, or pay the balance. Enter your HSP-XXXX-NNNN code."
        ruta="/my-booking"
      />
      <header className="border-b border-linea">
        <div className="mx-auto grid max-w-3xl grid-cols-3 items-center px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-aqua-dark hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures" className="justify-self-center">
            <Logo compacto />
          </Link>
          <div aria-hidden="true" className="justify-self-end" />
        </div>
      </header>
      {/* La maqueta del cliente presenta esta pantalla como una card blanca
          sobre fondo gris — un poco más «producto» que el papel plano que
          tenía. Mismo contenido, solo el envoltorio. */}
      <main className="bg-papel-hueso px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-md rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
              <Ticket className="size-7" aria-hidden="true" strokeWidth={2} />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-navy sm:text-3xl">
              Manage your booking
            </h1>
            <p className="mt-3 text-sm text-navy-sub">
              Access it with your booking code, or with the email or phone number you booked with.
              You&rsquo;ll be able to see your itinerary, your pick-up time and make changes.
            </p>
          </div>

          {/* Toggle código / email / teléfono. Mismo lenguaje visual que el
              selector de paquete del widget de reserva (pista gris + thumb
              blanco). El thumb se mueve por ÍNDICE, no por comparación con un
              valor concreto: con 3 opciones ya no vale un booleano, y así
              añadir una cuarta no volvería a tocar esta fórmula. */}
          <div
            role="group"
            aria-label="How you want to access your booking"
            className="relative mt-6 grid grid-cols-3 gap-1 rounded-full bg-linea p-1"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(33.333%-0.4167rem)] rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(calc(${MODOS.findIndex((m) => m.id === modo)} * (100% + 0.25rem)))`,
              }}
            />
            {MODOS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModo(m.id)
                  setValor('')
                }}
                aria-pressed={modo === m.id}
                className={`relative z-10 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  modo === m.id ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
                }`}
              >
                {m.etiqueta}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Sin autoFocus (auditoría móvil 2026-07-17): en móvil dispara el
                teclado apenas carga la página — quien llega desde un link de
                WhatsApp/email ni ve el título antes de que el teclado se coma
                medio viewport. El usuario toca el campo cuando quiere escribir. */}
            <Campo
              // `key` remonta el input al cambiar de modo: sin él, React
              // reutiliza el mismo nodo y el navegador conserva el estado de
              // validación del type anterior (un email a medio escribir deja
              // el campo en :invalid al pasar a teléfono).
              key={activo.id}
              etiqueta={activo.campo}
              type={activo.id === 'email' ? 'email' : activo.id === 'telefono' ? 'tel' : undefined}
              value={valor}
              // Solo el código se pasa a mayúsculas: así se emite. Hacerlo con
              // un email o un teléfono no aporta y en el email molesta.
              onChange={(e) => setValor(activo.id === 'codigo' ? e.target.value.toUpperCase() : e.target.value)}
              placeholder={activo.placeholder}
              required
            />
            <p className="text-xs text-navy-soft">{AYUDA_MODO[modo]}</p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              View my booking
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <p className="text-center text-xs text-navy-soft">Your booking is private and secure.</p>
          </form>

          <div className="mt-6 border-t border-linea pt-5">
            <p className="text-center text-xs text-navy-soft">
              Still cannot find it? Message us on{' '}
              <a
                href="https://wa.me/18293052804"
                target="_blank"
                rel="noopener"
                className="font-semibold text-aqua-dark hover:underline"
              >
                WhatsApp
              </a>{' '}
              and we’ll look it up.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// Pantalla 2 — detalle. La reserva que se pinta es SIEMPRE la demo del
// prototipo (independiente de si el código existe en localStorage o
// no) — "de momento" de Samuel, hasta que se conecte el backend. El
// estado "Demo" se muestra en el chip de la cabecera y en el banner
// para que el visitante entienda que no es su reserva real.
//
// Recibe `codigoIngresado` solo para mostrarlo en la cabecera (en vez
// del HSP-0000-0001 de la demo) — la lógica interna de la página
// sigue operando sobre la demo, no sobre el código.
function DetalleReserva({ codigoIngresado }: { codigoIngresado: string }) {
  const [reserva, setReserva] = useState<Reserva>(() => reservaDemo())
  // `codigo` se pinta en la cabecera — el de la URL, no el de la demo
  // (HSP-0000-0001). Así el cliente ve "su" código en la pantalla y
  // entiende que la demo es lo que vería con ese código, no otro.
  const reservaParaMostrar: Reserva = { ...reserva, codigo: codigoIngresado.toUpperCase() }

  const guardar = (nueva: Reserva) => {
    guardarReserva(nueva)
    setReserva(nueva)
  }

  const horario = reservaParaMostrar.ficha.horarios[reservaParaMostrar.horarioIdx]

  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`My booking · ${reservaParaMostrar.codigo}`}
        descripcion={`Gestiona tu reserva ${reservaParaMostrar.codigo} de ${reservaParaMostrar.tour.nombre} para ${reservaParaMostrar.personas} personas el ${fechaLarga(reservaParaMostrar.fechaISO)}.`}
        ruta={`/my-booking?codigo=${reservaParaMostrar.codigo}`}
        indexable={false}
      />

      <header className="border-b border-linea">
        <div className="mx-auto grid max-w-3xl grid-cols-3 items-center px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-aqua-dark hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures" className="justify-self-center">
            <Logo compacto />
          </Link>
          <Link
            to="/my-booking"
            className="inline-flex items-center gap-1.5 justify-self-end rounded-btn border border-linea bg-papel px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
          >
            <KeyRound className="size-3.5" aria-hidden="true" />
            Use another code
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Banner demo — siempre presente (2026-07-17). Antes se pintaba
            solo cuando el código no estaba en localStorage; ahora SIEMPRE
            porque la página siempre muestra la demo ("con cualquier código
            funcione"). El texto se simplificó: ya no menciona "cuando
            completes una reserva real" porque la idea es que el cliente
            entienda que esta vista es el preview, no su reserva real. */}
        <div className="mb-6 rounded-card border border-coral/30 bg-coral/5 p-4 text-sm text-navy-sub">
          You are looking at a <strong className="font-semibold text-navy">sample booking</strong>.
          When you make a real booking, this screen will show yours with your details. Any changes
          you make here are saved in your browser, not in our system.
        </div>

        {/* 1. CABECERA */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">My booking</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">
              {reservaParaMostrar.codigo}
              <span className="text-navy-soft"> · {reservaParaMostrar.tour.nombre}</span>
            </h1>
            <p className="mt-1 text-sm text-navy-sub">
              {fechaLarga(reservaParaMostrar.fechaISO)} · {horario?.hora ?? '—'} · {reservaParaMostrar.personas}{' '}
              {reservaParaMostrar.personas === 1 ? 'guest' : 'guests'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-chip bg-menta px-3 py-1.5 text-sm font-semibold text-menta-texto">
            <Check className="size-4" aria-hidden="true" />
            Demo
          </span>
        </div>

        {/* 2. RESUMEN + PAGO DE SALDO */}
        <BloqueReserva reserva={reservaParaMostrar} />

        {/* 3. MENÚ POR PERSONA */}
        <BloqueMenu reserva={reservaParaMostrar} guardar={guardar} />

        {/* 4. RECOGIDA */}
        <BloqueRecogida reserva={reservaParaMostrar} guardar={guardar} />

        {/* 5. CONTACTO */}
        <BloqueContacto reserva={reservaParaMostrar} guardar={guardar} />

        {/* 6. FOOTER */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-linea pt-6 text-sm text-navy-soft">
          <p>Something not right? Message us and we’ll fix it.</p>
          <a
            href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! My booking is ${reservaParaMostrar.codigo} and I need some help.`)}`}
            target="_blank"
            rel="noopener"
            className="font-semibold text-aqua-dark hover:underline"
          >
            WhatsApp +1-829-305-2804 →
          </a>
        </div>
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ────────────────────────────────────────────────────────────────────────

function BloqueReserva({ reserva }: { reserva: Reserva }) {
  const [pagado, setPagado] = useState(false)
  // [2026-09-01] Reserva pagada íntegramente en efectivo: no hay depósito
  // cobrado y el 5% ya está dentro del total. Ofrecerle «pagar el saldo online»
  // sería empujarle a perder el descuento que acaba de elegir — así que esa
  // reserva no ve el botón, ve la instrucción de lo que tiene que llevar.
  const pagoEnEfectivo = reserva.metodoPago === 'efectivo'

  return (
    <section className="mt-8 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CreditCard className="size-5 text-aqua" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-navy">Your booking</h2>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <Fila label="Tour total" valor={formatoDinero(reserva.total)} />
        <Fila
          label={pagoEnEfectivo ? 'Paid so far' : 'Already paid'}
          valor={formatoDinero(reserva.deposito)}
        />
        <div className="flex items-center justify-between border-t border-linea pt-3 text-sm">
          <dt className="font-medium text-navy">
            {pagoEnEfectivo ? 'To pay in cash on board' : 'Balance due'}
          </dt>
          <dd className="text-base font-semibold text-navy">{formatoDinero(reserva.saldo)}</dd>
        </div>
      </dl>
      {pagoEnEfectivo ? (
        <p className="mt-4 rounded-lg bg-menta px-3.5 py-2.5 text-xs leading-relaxed text-menta-texto">
          You chose to pay in cash, so the 5% discount is already in the amount above. Bring it on
          the day and there’s nothing to do here.
        </p>
      ) : reserva.saldo > 0 && !pagado ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPagado(true)}
            className="w-full rounded-btn bg-coral px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
          >
            Pay the balance online · {formatoDinero(reserva.saldo)}
          </button>
          <p className="mt-2 text-center text-xs text-navy-soft">
            Or pay in cash on board, nothing to do here.
          </p>
        </div>
      ) : null}
      {pagado && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-chip bg-menta px-3 py-1.5 text-sm font-semibold text-menta-texto">
          <Check className="size-4" aria-hidden="true" />
          Balance paid, nothing left to settle.
        </p>
      )}
    </section>
  )
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-navy-soft">{label}</dt>
      <dd className="text-navy">{valor}</dd>
    </div>
  )
}

// [2026-08-07] El bloque resuelve el menú con la misma regla que el checkout
// (lib/menu-reserva.ts) en vez de leer siempre menuLight/menuPremium. En Saona
// y en el charter esos dos arrays están vacíos: el select de «editar» salía sin
// una sola opción y la lista decía «Guest 1 · Not chosen» para siempre, de una
// comida que nunca se elige. Con buffet este bloque cambia de trabajo — enseña
// lo que se sirve y no ofrece editar nada.
function BloqueMenu({ reserva, guardar }: { reserva: Reserva; guardar: (r: Reserva) => void }) {
  const [edit, setEdit] = useState(false)
  const [platos, setPlatos] = useState(reserva.platos)
  const menuReserva = menuDeLaReserva({
    ficha: reserva.ficha,
    paquete: reserva.paquete,
    variante: reserva.variante,
    personas: reserva.personas,
  })
  const menu = menuReserva?.platos ?? []
  const seElige = menuReserva?.modo === 'eleccion'

  const guardarCambios = () => {
    guardar({ ...reserva, platos })
    setEdit(false)
  }
  const cancelar = () => {
    setPlatos(reserva.platos)
    setEdit(false)
  }

  return (
    <section className="mt-6 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="size-5 text-aqua" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-navy">
            {menuReserva && !seElige ? menuReserva.titulo : 'Your menu'}
          </h2>
        </div>
        {/* Solo se edita lo que se elige: con buffet no hay «Editar». */}
        {seElige && !edit ? <BotonEditar onClick={() => setEdit(true)} /> : null}
      </div>

      {/* 2026-08-07: el funnel ya permite reservar sin elegir plato, así que
          ESTA pantalla es donde se completa. Dos consecuencias: el select
          arranca con una opción vacía («Sin elegir») en vez de mentir con el
          primer plato de la carta, y la lista de abajo dice qué falta. */}
      {edit ? (
        <div className="mt-4 space-y-3">
          {platos.map((p, i) => (
            <div key={i}>
              <label className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
                Guest {i + 1}
              </label>
              <select
                value={p}
                onChange={(e) => setPlatos((prev) => prev.map((x, j) => (i === j ? e.target.value : x)))}
                className="mt-1 w-full rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
              >
                <option value="">Not chosen, we’ll confirm by email</option>
                {menu.map((plato) => (
                  <option key={plato.nombre} value={plato.nombre}>
                    {plato.nombre}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={guardarCambios}
              className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Save menu
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : seElige ? (
        <ul className="mt-4 space-y-1.5 text-sm">
          {reserva.platos.map((p, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="text-navy-soft">Guest {i + 1}</span>
              {p ? (
                <span className="font-medium text-navy">{nombrePlato(p, menu)}</span>
              ) : (
                <span className="text-navy-soft">Not chosen</span>
              )}
            </li>
          ))}
        </ul>
      ) : menuReserva ? (
        // Buffet: no hay plato por persona que listar ni que cambiar. Lo que
        // sí hay que enseñar es qué se sirve — es parte de lo ya pagado.
        <>
          {menuReserva.texto ? <p className="mt-2 text-sm text-navy-sub">{menuReserva.texto}</p> : null}
          <ul className="mt-3 space-y-1.5 text-sm">
            {menuReserva.platos.map((plato) => (
              <li key={plato.nombre} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-menta-texto" aria-hidden="true" />
                <span>
                  <span className="text-navy">{plato.nombre}</span>
                  {plato.desc ? <span className="text-navy-soft"> · {plato.desc}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}

function BloqueRecogida({ reserva, guardar }: { reserva: Reserva; guardar: (r: Reserva) => void }) {
  const [edit, setEdit] = useState(false)
  const [hotel, setHotel] = useState(reserva.recogida.hotel)
  const [notas, setNotas] = useState(reserva.recogida.notas)

  const guardarCambios = () => {
    guardar({ ...reserva, recogida: { hotel: hotel.trim(), notas: notas.trim() } })
    setEdit(false)
  }
  const cancelar = () => {
    setHotel(reserva.recogida.hotel)
    setNotas(reserva.recogida.notas)
    setEdit(false)
  }

  return (
    <section className="mt-6 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-aqua" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-navy">Pickup</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <Campo
            etiqueta="Hotel"
            value={hotel}
            onChange={(e) => setHotel(e.target.value)}
            placeholder="Hotel name"
            required
          />
          <Campo
            etiqueta="Notes"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Room number, preferred time, etc."
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={guardarCambios}
              className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-1 text-sm">
          <p className="font-medium text-navy">{reserva.recogida.hotel || '—'}</p>
          {reserva.recogida.notas && <p className="text-navy-soft">{reserva.recogida.notas}</p>}
        </div>
      )}
    </section>
  )
}

function BloqueContacto({ reserva, guardar }: { reserva: Reserva; guardar: (r: Reserva) => void }) {
  const [edit, setEdit] = useState(false)
  const [contacto, setContacto] = useState({
    nombre: reserva.contacto.nombre,
    apellidos: reserva.contacto.apellidos,
    email: reserva.contacto.email,
    telefono: reserva.contacto.telefono,
  })

  const guardarCambios = () => {
    guardar({ ...reserva, contacto: { ...contacto, nombre: contacto.nombre.trim(), apellidos: contacto.apellidos.trim() } })
    setEdit(false)
  }
  const cancelar = () => {
    setContacto({
      nombre: reserva.contacto.nombre,
      apellidos: reserva.contacto.apellidos,
      email: reserva.contacto.email,
      telefono: reserva.contacto.telefono,
    })
    setEdit(false)
  }

  return (
    <section className="mt-6 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-aqua" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-navy">Contact details</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="First name" value={contacto.nombre} onChange={(e) => setContacto((c) => ({ ...c, nombre: e.target.value }))} required />
            <Campo etiqueta="Last name" value={contacto.apellidos} onChange={(e) => setContacto((c) => ({ ...c, apellidos: e.target.value }))} />
            <Campo etiqueta="Email" type="email" value={contacto.email} onChange={(e) => setContacto((c) => ({ ...c, email: e.target.value }))} required />
            <Campo etiqueta="Phone" type="tel" value={contacto.telefono} onChange={(e) => setContacto((c) => ({ ...c, telefono: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={guardarCambios}
              className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <dl className="mt-4 space-y-1 text-sm">
          <Fila label="Name" valor={`${reserva.contacto.nombre} ${reserva.contacto.apellidos}`.trim()} />
          <Fila label="Email" valor={reserva.contacto.email} />
          <Fila label="Phone" valor={reserva.contacto.telefono} />
        </dl>
      )}
    </section>
  )
}

function BotonEditar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-btn border border-linea bg-papel px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      Edit
    </button>
  )
}
