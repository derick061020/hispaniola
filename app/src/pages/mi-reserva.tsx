import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ChevronRight, CreditCard, MapPin, Pencil, Ticket, Users, Utensils } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { fechaLarga } from '@/lib/fechas'
import { guardarReserva, reservaDemo, type Reserva } from '@/lib/reservas'
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

export function MiReservaPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const codigo = params.get('codigo')

  // 2 estados: INGRESO (input) o DETALLE (la demo). Sin `?codigo=…` en
  // la URL siempre arranca en INGRESO — ni siquiera se monta la página
  // de detalle, que es la parte pesada.
  if (!codigo) {
    return <PantallaIngreso onSubmit={(c) => navigate(`/mi-reserva?codigo=${encodeURIComponent(c)}`)} />
  }

  return <DetalleReserva codigoIngresado={codigo} />
}

// Pantalla 1 — ingreso de código. Una sola columna centrada (max-w-md),
// el mismo lenguaje visual que la pantalla /gracias (mismo Logo +
// "Volver al inicio" arriba, max-w-3xl para el main). El input pide el
// código en formato libre (HSP-XXXX-NNNN) — sin validación de formato
// (a día de hoy cualquier cosa funciona; cuando se conecte el backend
// se valida y se muestra error). El submit navega a `?codigo=…`; el
// resto de la lógica vive en DetalleReserva.
function PantallaIngreso({ onSubmit }: { onSubmit: (codigo: string) => void }) {
  const [valor, setValor] = useState('')
  // CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/07-mi-reserva.md): la
  // maqueta añade un toggle «Con código / Con email» — poder recuperar la
  // reserva con el email con que se reservó, no solo con el código.
  //
  // ⚠️ Sin backend, el acceso por email NO puede validar nada (no hay a quién
  // preguntar), exactamente igual que hoy pasa con el código: la pantalla de
  // detalle muestra SIEMPRE la reserva de ejemplo. Se construye el toggle
  // porque es la estructura que el cliente quiere ver y porque cuando llegue
  // el motor solo hay que cambiar lo que pasa en el submit — pero no se finge
  // una búsqueda que no existe.
  const [modo, setModo] = useState<'codigo' | 'email'>('codigo')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const limpio = valor.trim()
    if (!limpio) return
    onSubmit(limpio)
  }
  return (
    <div className="min-h-screen bg-papel-hueso">
      <Meta
        titulo="Mi reserva"
        descripcion="Gestiona tu reserva: cambia el menú, la recogida o los datos, o paga el saldo. Introduce tu código HSP-XXXX-NNNN."
        ruta="/mi-reserva"
      />
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures">
            <Logo compacto />
          </Link>
          <Link to="/" className="text-sm font-semibold text-aqua-dark hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </header>
      {/* La maqueta del cliente presenta esta pantalla como una card blanca
          sobre fondo gris — un poco más «producto» que el papel plano que
          tenía. Mismo contenido, solo el envoltorio. */}
      <main className="bg-papel-hueso px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-md rounded-card-grande bg-papel p-6 shadow-card ring-1 ring-linea sm:p-8">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
              <Ticket className="size-7" aria-hidden="true" strokeWidth={2} />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-navy sm:text-3xl">
              Gestiona tu reserva
            </h1>
            <p className="mt-3 text-sm text-navy-sub">
              Accede con el código de tu reserva o con el email con el que reservaste. Podrás ver tu
              itinerario, la hora de recogida y hacer cambios.
            </p>
          </div>

          {/* Toggle código / email. Mismo lenguaje visual que el selector de
              paquete del widget de reserva (pista gris + thumb blanco). */}
          <div
            role="group"
            aria-label="Cómo quieres acceder"
            className="relative mt-6 grid grid-cols-2 gap-1 rounded-full bg-linea p-1"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: modo === 'email' ? 'translateX(calc(100% + 0.25rem))' : 'translateX(0)' }}
            />
            {(['codigo', 'email'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setModo(m)
                  setValor('')
                }}
                aria-pressed={modo === m}
                className={`relative z-10 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  modo === m ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
                }`}
              >
                {m === 'codigo' ? 'Con código' : 'Con email'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Sin autoFocus (auditoría móvil 2026-07-17): en móvil dispara el
                teclado apenas carga la página — quien llega desde un link de
                WhatsApp/email ni ve el título antes de que el teclado se coma
                medio viewport. El usuario toca el campo cuando quiere escribir. */}
            {modo === 'codigo' ? (
              <Campo
                etiqueta="Código de reserva"
                value={valor}
                onChange={(e) => setValor(e.target.value.toUpperCase())}
                placeholder="HSP-XXXX-NNNN"
                required
              />
            ) : (
              <Campo
                etiqueta="Email de la reserva"
                type="email"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            )}
            <p className="text-xs text-navy-soft">
              {modo === 'codigo'
                ? 'Búscalo en el email de confirmación de Hispaniola — empieza por HSP.'
                : 'Te enviaremos un enlace de acceso al correo con el que hiciste la reserva.'}
            </p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Ver mi reserva
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <p className="text-center text-xs text-navy-soft">Tu reserva es privada y segura.</p>
          </form>

          <div className="mt-6 border-t border-linea pt-5">
            <p className="text-center text-xs text-navy-soft">
              ¿Sigues sin encontrarla? Escríbenos por{' '}
              <a
                href="https://wa.me/18293052804"
                target="_blank"
                rel="noopener"
                className="font-semibold text-aqua-dark hover:underline"
              >
                WhatsApp
              </a>{' '}
              y la buscamos.
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
        titulo={`Mi reserva · ${reservaParaMostrar.codigo}`}
        descripcion={`Gestiona tu reserva ${reservaParaMostrar.codigo} de ${reservaParaMostrar.tour.nombre} para ${reservaParaMostrar.personas} personas el ${fechaLarga(reservaParaMostrar.fechaISO)}.`}
        ruta={`/mi-reserva?codigo=${reservaParaMostrar.codigo}`}
        indexable={false}
      />

      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" aria-label="Inicio de Hispaniola Aquatic Adventures">
            <Logo compacto />
          </Link>
          {/* 2026-07-17: link "Usar otro código" — para volver a la pantalla
              de ingreso y meter otro código. Va a la izquierda de "Volver
              al inicio" porque esa es la acción típica cuando se prueba
              con varios códigos o se equivoca uno. */}
          <div className="flex items-center gap-4">
            <Link
              to="/mi-reserva"
              className="text-sm font-semibold text-aqua-dark hover:underline"
            >
              Usar otro código
            </Link>
            <Link to="/" className="text-sm font-semibold text-aqua-dark hover:underline">
              ← Volver al inicio
            </Link>
          </div>
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
          Estás viendo una <strong className="font-semibold text-navy">reserva de ejemplo</strong>.
          Cuando hagas una reserva real, esta pantalla mostrará la tuya con tus datos. Los cambios
          que hagas aquí se guardan en tu navegador, no en nuestro sistema.
        </div>

        {/* 1. CABECERA */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">Mi reserva</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">
              {reservaParaMostrar.codigo}
              <span className="text-navy-soft"> · {reservaParaMostrar.tour.nombre}</span>
            </h1>
            <p className="mt-1 text-sm text-navy-sub">
              {fechaLarga(reservaParaMostrar.fechaISO)} · {horario?.hora ?? '—'} · {reservaParaMostrar.personas}{' '}
              {reservaParaMostrar.personas === 1 ? 'persona' : 'personas'}
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
          <p>¿Algo no encaja? Escríbenos y lo arreglamos.</p>
          <a
            href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hola! Tengo la reserva ${reservaParaMostrar.codigo} y necesito ayuda.`)}`}
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

  return (
    <section className="mt-8 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CreditCard className="size-5 text-aqua" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-navy">Tu reserva</h2>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <Fila label="Total del tour" valor={formatoDinero(reserva.total)} />
        <Fila label="Ya pagado" valor={formatoDinero(reserva.deposito)} />
        <div className="flex items-center justify-between border-t border-linea pt-3 text-sm">
          <dt className="font-medium text-navy">Saldo pendiente</dt>
          <dd className="text-base font-semibold text-navy">{formatoDinero(reserva.saldo)}</dd>
        </div>
      </dl>
      {reserva.saldo > 0 && !pagado && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPagado(true)}
            className="w-full rounded-btn bg-coral px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
          >
            Pagar saldo online — {formatoDinero(reserva.saldo)}
          </button>
          <p className="mt-2 text-center text-xs text-navy-soft">
            O paga en efectivo a bordo — no hace falta hacer nada aquí.
          </p>
        </div>
      )}
      {pagado && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-chip bg-menta px-3 py-1.5 text-sm font-semibold text-menta-texto">
          <Check className="size-4" aria-hidden="true" />
          Saldo pagado — no queda nada pendiente.
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

function BloqueMenu({ reserva, guardar }: { reserva: Reserva; guardar: (r: Reserva) => void }) {
  const [edit, setEdit] = useState(false)
  const [platos, setPlatos] = useState(reserva.platos)
  const menu = reserva.paquete === 'premium' ? reserva.ficha.menuPremium : reserva.ficha.menuLight

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
          <h2 className="font-display text-lg font-semibold text-navy">Tu menú</h2>
        </div>
        {!edit && (
          <BotonEditar onClick={() => setEdit(true)} />
        )}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          {platos.map((p, i) => (
            <div key={i}>
              <label className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
                Persona {i + 1}
              </label>
              <select
                value={p}
                onChange={(e) => setPlatos((prev) => prev.map((x, j) => (i === j ? e.target.value : x)))}
                className="mt-1 w-full rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
              >
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
              Guardar menú
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <ul className="mt-4 space-y-1.5 text-sm">
          {reserva.platos.map((p, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="text-navy-soft">Persona {i + 1}</span>
              <span className="font-medium text-navy">{nombrePlato(p, menu)}</span>
            </li>
          ))}
        </ul>
      )}
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
          <h2 className="font-display text-lg font-semibold text-navy">Recogida</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <Campo
            etiqueta="Hotel"
            value={hotel}
            onChange={(e) => setHotel(e.target.value)}
            placeholder="Nombre del hotel"
            required
          />
          <Campo
            etiqueta="Notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Habitación, hora preferida, etc."
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={guardarCambios}
              className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancelar
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
          <h2 className="font-display text-lg font-semibold text-navy">Datos de contacto</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="Nombre" value={contacto.nombre} onChange={(e) => setContacto((c) => ({ ...c, nombre: e.target.value }))} required />
            <Campo etiqueta="Apellidos" value={contacto.apellidos} onChange={(e) => setContacto((c) => ({ ...c, apellidos: e.target.value }))} />
            <Campo etiqueta="Email" type="email" value={contacto.email} onChange={(e) => setContacto((c) => ({ ...c, email: e.target.value }))} required />
            <Campo etiqueta="Teléfono" type="tel" value={contacto.telefono} onChange={(e) => setContacto((c) => ({ ...c, telefono: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={guardarCambios}
              className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <dl className="mt-4 space-y-1 text-sm">
          <Fila label="Nombre" valor={`${reserva.contacto.nombre} ${reserva.contacto.apellidos}`.trim()} />
          <Fila label="Email" valor={reserva.contacto.email} />
          <Fila label="Teléfono" valor={reserva.contacto.telefono} />
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
      Editar
    </button>
  )
}
