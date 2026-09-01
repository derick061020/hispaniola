import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, CreditCard, KeyRound, MapPin, Pencil, Ticket, Users, Utensils } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { fechaLarga } from '@/lib/fechas'
import { guardarReserva, type Reserva } from '@/lib/reservas'
import {
  actualizarReserva, buscarReserva as buscarReservaOdoo,
  buscarReservaPorContacto as buscarPorContacto,
} from '@/lib/api/api'
import { BotonCalendario } from '@/components/ui/boton-calendario'
import { PagoSaldo } from '@/components/mi-reserva/pago-saldo'
import { reservaDesdeOdoo } from '@/lib/api/desde-odoo'
import { ErrorApi } from '@/lib/api/cliente'
import { menuDeLaReserva } from '@/lib/menu-reserva'
import { formatoDinero } from '@/data/home'
import { Campo } from '@/components/ui/campo'
import { crudo, t, tp, traducible } from '@/lib/i18n'

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

// Lo GUARDADO es siempre el nombre canónico en inglés (así viaja a Odoo), y
// lo que hay que PINTAR es ese mismo plato en el idioma que se está leyendo.
// Por eso la búsqueda va contra `crudo(p).nombre` y lo que se devuelve es
// `p.nombre`, que sale ya traducido del bloque de datos.
function nombrePlato(id: string, menu: { nombre: string }[]) {
  const plato = menu.find((p) => crudo(p).nombre === id)
  return plato?.nombre ?? NOMBRES_PLATO[id] ?? id
}

// [v3 2026-08-06, slide 67] Los modos de acceso. El `id` viaja en la URL
// (`?modo=`) para que el cajón de la home (home/contacto.tsx) pueda mandar
// aquí a alguien que ya escribió su dato, con la pestaña correcta abierta.
//
// ── [2026-08-19] SE CAE LA PESTAÑA DEL CÓDIGO (decisión de Derick) ────────
// Eran tres y solo una funcionaba: «Email» y «Teléfono» no llamaban a ningún
// sitio —el `q` que escribían acababa yendo a Odoo COMO SI FUERA el código— y
// la única que servía, la del código, obligaba al cliente a ir a buscarlo al
// correo. Ahora entra con lo que se sabe de memoria.
//
// El código NO desaparece: sigue siendo la forma en que entran los enlaces de
// los vouchers ya enviados (`?codigo=HSP-…`, y ahí sí se pide el email como
// segunda prueba). Lo que desaparece es la pestaña que le pedía teclearlo.
const MODOS = traducible([
  { id: 'email', etiqueta: 'Email', campo: 'Booking email', placeholder: 'you@email.com' },
  { id: 'telefono', etiqueta: 'Phone', campo: 'Booking phone number', placeholder: '+1 829 000 0000' },
] as const)

type Modo = (typeof MODOS)[number]['id']

const AYUDA_MODO: Record<Modo, string> = traducible({
  email: 'The address you gave us when you booked.',
  telefono: 'The number you gave us when you booked, with or without the country code.',
})

export function MiReservaPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  // `codigo` es el parámetro histórico (enlaces ya compartidos); `q` es el
  // nuevo, que acompaña a `modo`. Cualquiera de los dos abre el DETALLE.
  // Tres nombres para lo mismo, y los tres tienen que valer: `q` es el de la
  // pantalla de busqueda, `codigo` el del area privada, y `code` el que llevan
  // los enlaces «gestiona tu reserva» de LOS TRECE correos (`manage_link` en
  // mail_sender.py). Ese ultimo no se leia: el cliente pulsaba el enlace de su
  // correo de confirmacion y aterrizaba en el buscador vacio, como si el
  // enlace no llevara nada.
  const consulta = params.get('q') ?? params.get('codigo') ?? params.get('code')
  const modoUrl = params.get('modo')
  const modoInicial: Modo = MODOS.some((m) => m.id === modoUrl) ? (modoUrl as Modo) : 'email'

  // 2 estados: INGRESO (input) o DETALLE. Sin dato en la URL siempre arranca
  // en INGRESO — ni siquiera se monta la página de detalle, que es la pesada.
  if (!consulta) {
    return (
      <PantallaIngreso
        modoInicial={modoInicial}
        onSubmit={(modo, valor) => navigate(`/my-booking?modo=${modo}&q=${encodeURIComponent(valor)}`)}
      />
    )
  }

  // Dos caminos distintos, y la diferencia importa:
  //   · con `modo` de contacto, el dato ES la credencial y Odoo resuelve la
  //     reserva de una vez (`/bookings/find`);
  //   · sin él, lo que llega es un CÓDIGO —los enlaces de los vouchers ya
  //     enviados— y ahí se sigue pidiendo el email como segunda prueba.
  if (modoUrl === 'email' || modoUrl === 'telefono') {
    return <ReservaPorContacto tipo={modoUrl} valor={consulta} />
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
        titulo={t('My booking')}
        descripcion={t('Manage your booking: change the menu, the pickup or your details, or pay the balance. Enter the email or phone you booked with.')}
        ruta="/my-booking"
      />
      <header className="border-b border-linea">
        <div className="mx-auto grid max-w-3xl grid-cols-3 items-center px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-aqua-dark hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('Back to home')}
          </Link>
          <Link to="/" aria-label={t('Inicio de Hispaniola Aquatic Adventures')} className="justify-self-center">
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
              {t('Manage your booking')}
            </h1>
            <p className="mt-3 text-sm text-navy-sub">
              {t('Enter with the email or the phone number you booked with. You’ll be able to see your itinerary, your pick-up time and make changes.')}
            </p>
          </div>

          {/* Toggle email / teléfono. Mismo lenguaje visual que el selector
              de paquete del widget de reserva (pista gris + thumb blanco). El
              thumb se mueve por ÍNDICE, no por comparación con un valor
              concreto: sirve igual con dos que con tres opciones, y así
              añadir una cuarta no volvería a tocar esta fórmula. */}
          <div
            role="group"
            aria-label={t('How you want to access your booking')}
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
              type={activo.id === 'email' ? 'email' : 'tel'}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={activo.placeholder}
              required
            />
            <p className="text-xs text-navy-soft">{AYUDA_MODO[modo]}</p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              {t('View my booking')}
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <p className="text-center text-xs text-navy-soft">{t('Your booking is private and secure.')}</p>
          </form>

          <div className="mt-6 border-t border-linea pt-5">
            <p className="text-center text-xs text-navy-soft">
              {t('Still cannot find it? Message us on')}{' '}
              <a
                href="https://wa.me/18293052804"
                target="_blank"
                rel="noopener"
                className="font-semibold text-aqua-dark hover:underline"
              >
                {t('WhatsApp')}
              </a>{' '}
              {t('and we’ll look it up.')}
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
// Puerta de acceso a la reserva: pide el email con el que se reservó y enseña
// el estado de la consulta. Vive aquí y no en `PantallaIngreso` a propósito —
// esa pantalla es de Samuel y su diseño de 3 modos (código / email / teléfono)
// se queda como está.
function PuertaDeAcceso({
  codigo,
  email,
  onEmail,
  onEnviar,
  cargando,
  error,
}: {
  codigo: string
  email: string
  onEmail: (v: string) => void
  onEnviar: () => void
  cargando: boolean
  error: string | null
}) {
  return (
    <div className="min-h-screen bg-papel">
      <Meta
        titulo={`My booking · ${codigo}`}
        descripcion={t('Check your Hispaniola Aquatic Adventures booking.')}
        ruta={`/my-booking?codigo=${codigo}`}
        indexable={false}
      />
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('Back to home')}
          </Link>
          <Link to="/" aria-label={t('Hispaniola Aquatic Adventures home')}>
            <Logo compacto />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('My booking')}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">{codigo}</h1>
        <p className="mt-3 text-sm text-navy-sub">
          {t('For your security, confirm the e-mail address you used when booking.')}
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            onEnviar()
          }}
        >
          <Campo
            etiqueta={t('Booking e-mail')}
            type="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder={t('you@email.com')}
            required
            autoComplete="email"
          />
          <FancyButton.Root
            type="submit"
            variant="primary"
            className="w-full"
            disabled={cargando || email.trim() === ''}
          >
            {cargando ? 'Checking…' : t('See my booking')}
          </FancyButton.Root>
        </form>

        {/* [2026-08-18] Quien viene a CAMBIAR algo tiene un camino mejor: el
            area privada, donde estan todas sus reservas y sus datos. Se ofrece
            aqui, no en vez de esto: consultar con el codigo sigue siendo lo
            mas rapido y no pide contraseña. */}
        <p className="mt-5 text-center text-sm text-navy-sub">
          {t('Booked more than once?')}{' '}
          <Link to="/account" className="font-semibold text-aqua-dark hover:underline">
            {t('Sign in to your account')}
          </Link>{' '}
          {t('to see them all.')}
        </p>

        {error ? (
          <p role="alert" className="mt-4 rounded-card border border-coral/30 bg-coral/5 p-4 text-sm text-navy-sub">
            {error}
          </p>
        ) : null}

        <p className="mt-6 text-xs leading-relaxed text-navy-soft">
          {t('Can’t find your booking? Write to us and we will look it up for you.')}
        </p>
      </main>
    </div>
  )
}

/** Resuelve la reserva con lo que el visitante escribió —su email o su
 *  teléfono— y la entrega ya montada a `DetalleReserva`.
 *
 *  ⚠️ Aquí NO hay segunda prueba: el dato tecleado es la credencial. Es la
 *  decisión de Derick del 2026-08-19 (el porqué, y lo que implica, está en el
 *  endpoint `/bookings/find` de hispaniola_web). El camino del código, el que
 *  usan los enlaces de los vouchers, sigue pidiendo el email aparte. */
function ReservaPorContacto({ tipo, valor }: { tipo: 'email' | 'telefono'; valor: string }) {
  const [datos, setDatos] = useState<{ reserva: Reserva; token: string; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    const ac = new AbortController()
    setError(null)
    buscarPorContacto(tipo === 'email' ? { email: valor } : { phone: valor }, ac.signal)
      .then(({ booking, token, total }) => {
        if (cancelado) return
        setDatos({ reserva: reservaDesdeOdoo(booking), token, total })
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError(
          e instanceof ErrorApi && e.codigo === 'booking_not_found'
            ? t('We could not find a booking with that. Check what you typed, or write to us.')
            : t('We could not reach our booking system. Please try again in a moment.'),
        )
      })
    return () => {
      cancelado = true
      ac.abort()
    }
  }, [tipo, valor])

  if (error) return <BusquedaFallida mensaje={error} />
  if (!datos) return <BuscandoReserva />

  return (
    <DetalleReserva
      codigoIngresado={datos.reserva.codigo}
      accesoInicial={{ reserva: datos.reserva, token: datos.token }}
      otrasReservas={datos.total}
    />
  )
}

/** Mientras Odoo contesta. Es una pantalla y no un spinner suelto porque la
 *  reserva llega de una llamada de red: en un móvil en el muelle eso puede ser
 *  un segundo largo, y una página en blanco se lee como «no funciona». */
function BuscandoReserva() {
  return (
    <div className="grid min-h-screen place-items-center bg-papel px-5">
      <p className="text-sm text-navy-sub">{t('Opening your booking…')}</p>
    </div>
  )
}

function BusquedaFallida({ mensaje }: { mensaje: string }) {
  return (
    <div className="min-h-screen bg-papel">
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('Back to home')}
          </Link>
          <Link to="/" aria-label={t('Hispaniola Aquatic Adventures home')}>
            <Logo compacto />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-14 sm:px-8">
        <p role="alert" className="rounded-card border border-coral/30 bg-coral/5 p-4 text-sm text-navy-sub">
          {mensaje}
        </p>
        <Link
          to="/my-booking"
          className="mt-5 inline-flex w-full items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          {t('Try again')}
        </Link>
        <p className="mt-6 text-xs leading-relaxed text-navy-soft">
          {t('Can’t find your booking? Write to us and we will look it up for you.')}
        </p>
      </main>
    </div>
  )
}

function DetalleReserva({
  codigoIngresado,
  accesoInicial,
  otrasReservas = 0,
}: {
  codigoIngresado: string
  /** Reserva YA resuelta (se llegó por email o por teléfono, no por código). */
  accesoInicial?: { reserva: Reserva; token: string }
  /** Cuántas reservas tiene esa persona en total, para avisar si hay más. */
  otrasReservas?: number
}) {
  // [2026-08-18] Si el email llega en la URL, la consulta se hace sola. Es el
  // camino desde el area privada: alli el cliente YA entro con su contraseña,
  // asi que volver a pedirle el correo seria pedirle dos veces lo mismo. Sigue
  // siendo el mismo backend y la misma comprobacion de siempre — el email no
  // se cree, se manda a Odoo y Odoo decide.
  const [paramsDetalle] = useSearchParams()
  const emailUrl = (paramsDetalle.get('email') ?? '').trim()
  // ── LA BÚSQUEDA YA ES REAL (2026-08-10, conexión con Odoo) ───────────────
  //
  // Esta pantalla no validaba nada y devolvía SIEMPRE la reserva demo, con un
  // banner avisándolo. Ahora pregunta a Odoo.
  //
  // Y pide el email además del código, a propósito: el código es
  // HSP-XXXX-NNNN, o sea ~81 millones de combinaciones que se pueden recorrer
  // con un bucle. Sin esa segunda prueba, cualquiera que acertara uno vería el
  // nombre, el teléfono y el hotel de un cliente. El backend además responde el
  // MISMO error con email equivocado que con código inexistente, para no
  // confirmar que ese código existe.
  const [reserva, setReserva] = useState<Reserva | null>(accesoInicial?.reserva ?? null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(emailUrl)
  const [emailEnviado, setEmailEnviado] = useState<string | null>(emailUrl || null)
  // [2026-08-18] El token que devuelve `lookup` SE GUARDA. Antes se tiraba, y
  // por eso todo lo de esta pantalla acababa en localStorage: sin él no se
  // puede ni cobrar el saldo ni escribir un cambio en Odoo.
  // [2026-09-01] EL TOKEN TAMBIEN PUEDE VENIR EN LA URL — es lo que hace que el
  // enlace de pago funcione de un clic.
  //
  // Derick pidio un enlace de pago para mandarle al cliente. Sin esto, ese
  // enlace le llevaba a la misma pantalla de siempre pidiendole su correo antes
  // de poder pagar; un enlace de pago que empieza pidiendo credenciales es un
  // enlace que la mitad de la gente abandona.
  //
  // No es un agujero: el token es el mismo que ya usaba la pantalla despues de
  // buscar por contacto, va por reserva, lo genera `secrets.token_urlsafe(32)`
  // y sigue siendo Odoo quien decide si vale. Lo unico que cambia es de donde
  // se lee. Por eso el enlace no se publica: se manda al cliente y punto.
  const [token, setToken] = useState<string | null>(
    accesoInicial?.token ?? (paramsDetalle.get('token') || null),
  )
  const [recargas, setRecargas] = useState(0)

  const codigo = codigoIngresado.toUpperCase()

  // Con `token` basta: es la llave que devuelve la búsqueda por contacto y la
  // única que sirve para recargar una reserva sin email (las que entran por
  // teléfono). Sin ninguna de las dos no hay nada que pedir.
  useEffect(() => {
    if (!emailEnviado && !token) return
    let cancelado = false
    const ac = new AbortController()
    setCargando(true)
    setError(null)
    buscarReservaOdoo(codigo, emailEnviado ?? '', ac.signal, token)
      .then(({ booking, token: acceso }) => {
        if (cancelado) return
        setToken(acceso)
        setReserva(reservaDesdeOdoo(booking))
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError(
          e instanceof ErrorApi && e.codigo === 'booking_not_found'
            ? t('We could not find that booking. Check the code and the e-mail you booked with.')
            : t('We could not reach our booking system. Please try again in a moment.'),
        )
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
      ac.abort()
    }
    // `token` fuera de las dependencias a propósito: la respuesta lo vuelve a
    // escribir y volver a lanzar la consulta con cada escritura sería un bucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo, emailEnviado, recargas])

  // Puerta de acceso: mientras no haya una reserva verificada, esta pantalla no
  // enseña datos de nadie.
  if (!reserva) {
    return (
      <PuertaDeAcceso
        codigo={codigo}
        email={email}
        onEmail={setEmail}
        onEnviar={() => setEmailEnviado(email.trim().toLowerCase())}
        cargando={cargando}
        error={error}
      />
    )
  }

  const reservaParaMostrar: Reserva = reserva

  // [2026-08-18] LOS CAMBIOS VAN A ODOO. Hasta hoy `guardar` llamaba solo a
  // `guardarReserva()`, o sea al localStorage de este navegador: el cliente
  // cambiaba su plato o su hotel, veía «guardado», y ni la cocina ni la
  // tripulación se enteraban nunca. `/checkout/:code/sync` no vale para esto
  // —rechaza los pedidos ya cerrados, que es lo que es una reserva pagada— así
  // que va por `/bookings/:code/update`, que además deja nota en la ficha.
  //
  // localStorage se mantiene, pero como CACHÉ: la copia buena es la que
  // devuelve Odoo, y es la que se pinta.
  const guardarEnOdoo = async (cambios: Parameters<typeof actualizarReserva>[2]) => {
    if (!token) throw new Error(t('This session expired. Look your booking up again.'))
    const { booking } = await actualizarReserva(codigo, token, cambios)
    const actualizada = reservaDesdeOdoo(booking)
    guardarReserva(actualizada)
    setReserva(actualizada)
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
            {t('Back to home')}
          </Link>
          <Link to="/" aria-label={t('Inicio de Hispaniola Aquatic Adventures')} className="justify-self-center">
            <Logo compacto />
          </Link>
          <Link
            to="/my-booking"
            className="inline-flex items-center gap-1.5 justify-self-end rounded-btn border border-linea bg-papel px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
          >
            <KeyRound className="size-3.5" aria-hidden="true" />
            {t('Look up another booking')}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {/* [2026-08-10] Fuera el banner de «estás viendo una reserva de
            ejemplo»: ya no es cierto. Lo que se pinta aquí abajo es la reserva
            real que devolvió Odoo. */}

        {/* [2026-08-19] Buscando por email o por teléfono solo se abre UNA
            reserva —la próxima que navega—, así que a quien tiene varias hay
            que decírselo: si no, se va creyendo que las demás se han perdido. */}
        {otrasReservas > 1 ? (
          <p className="mb-6 rounded-card border border-linea bg-papel-hueso p-4 text-sm text-navy-sub">
            {tp('You have {n} bookings with us. This is the next one.', { n: otrasReservas })}{' '}
            <Link to="/account" className="font-semibold text-aqua-dark hover:underline">
              {t('Sign in to your account')}
            </Link>{' '}
            {t('to see them all.')}
          </p>
        ) : null}

        {/* 1. CABECERA */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('My booking')}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">
              {reservaParaMostrar.codigo}
              <span className="text-navy-soft"> · {reservaParaMostrar.tour.nombre}</span>
            </h1>
            <p className="mt-1 text-sm text-navy-sub">
              {fechaLarga(reservaParaMostrar.fechaISO)} · {horario?.hora ?? '—'} · {reservaParaMostrar.personas}{' '}
              {t(reservaParaMostrar.personas === 1 ? 'guest' : 'guests')}
            </p>
          </div>
          {/* [2026-08-10] El chip decía «Demo» porque la reserva lo era.
              Ahora dice el estado REAL que devuelve Odoo. */}
          <span className="inline-flex items-center gap-1.5 rounded-chip bg-menta px-3 py-1.5 text-sm font-semibold text-menta-texto">
            <Check className="size-4" aria-hidden="true" />
            {t('Confirmed')}
          </span>
        </div>

        {/* 2. RESUMEN + PAGO DE SALDO */}
        <BloqueReserva
          reserva={reservaParaMostrar}
          token={token}
          onPagado={() => setRecargas((n) => n + 1)}
        />

        {/* Los tres bloques llevan `key` con lo que editan: al guardar, la
            copia buena vuelve de Odoo y el bloque se remonta con ella. Sin
            esto, el formulario conservaría el estado local de antes del envío y
            al reabrirlo enseñaría lo tecleado en vez de lo guardado. */}

        {/* 3. MENÚ POR PERSONA */}
        <BloqueMenu
          key={`menu-${reservaParaMostrar.platos.join('|')}`}
          reserva={reservaParaMostrar}
          guardar={guardarEnOdoo}
        />

        {/* 4. RECOGIDA */}
        <BloqueRecogida
          key={`recogida-${reservaParaMostrar.recogida.hotel}-${reservaParaMostrar.recogida.notas}`}
          reserva={reservaParaMostrar}
          guardar={guardarEnOdoo}
        />

        {/* 5. CONTACTO */}
        <BloqueContacto
          key={`contacto-${reservaParaMostrar.contacto.nombre}-${reservaParaMostrar.contacto.telefono}`}
          reserva={reservaParaMostrar}
          guardar={guardarEnOdoo}
        />

        {/* 6. FOOTER */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-linea pt-6 text-sm text-navy-soft">
          <p>{t('Something not right? Message us and we’ll fix it.')}</p>
          <a
            href={`https://wa.me/18293052804?text=${encodeURIComponent(`Hi! My booking is ${reservaParaMostrar.codigo} and I need some help.`)}`}
            target="_blank"
            rel="noopener"
            className="font-semibold text-aqua-dark hover:underline"
          >
            {t('WhatsApp +1-829-305-2804 →')}
          </a>
        </div>
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ────────────────────────────────────────────────────────────────────────

// `email` desapareció de las props (2026-08-27): lo pedía el .ics de Odoo para
// autorizar la descarga, y el botón del calendario ya no pasa por Odoo.
function BloqueReserva({
  reserva,
  token,
  onPagado,
}: {
  reserva: Reserva
  token: string | null
  onPagado: () => void
}) {
  return (
    <section className="mt-8 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CreditCard className="size-5 text-aqua" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-navy">{t('Your booking')}</h2>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <Fila label={t('Tour total')} valor={formatoDinero(reserva.total)} />
        <Fila label={t('Already paid')} valor={formatoDinero(reserva.deposito)} />
        {/* [2026-09-01] «Ya pagado US$ 171» junto a «Saldo pendiente US$ 581»
            eran dos cifras que se contradecian en el mismo recuadro, y encima
            la primera era falsa: no habia pagado nada. Ahora esta fila dice lo
            que se cobra AHORA —la inicial, si aun no ha pagado— y debajo, en
            pequeno, lo que quedara para el dia del tour. */}
        <div className="flex items-center justify-between border-t border-linea pt-3 text-sm">
          <dt className="font-medium text-navy">
            {reserva.saldoTotal && reserva.saldoTotal > reserva.saldo
              ? t('Due now')
              : t('Balance due')}
          </dt>
          <dd className="text-base font-semibold text-navy">{formatoDinero(reserva.saldo)}</dd>
        </div>
        {reserva.saldoTotal && reserva.saldoTotal > reserva.saldo ? (
          <p className="pt-1 text-right text-xs text-navy-soft">
            {t('The remaining')}{' '}
            {formatoDinero(reserva.saldoTotal - reserva.saldo)}{' '}
            {t('is paid on the day of the tour.')}
          </p>
        ) : null}
      </dl>
      {reserva.saldo > 0 ? (
        token ? (
          <PagoSaldo
            codigo={reserva.codigo}
            token={token}
            saldo={reserva.saldo}
            onPagado={onPagado}
          />
        ) : null
      ) : (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-chip bg-menta px-3 py-1.5 text-sm font-semibold text-menta-texto">
          <Check className="size-4" aria-hidden="true" />
          {t('Balance paid, nothing left to settle.')}
        </p>
      )}

      {/* «Añadir al calendario» con la fecha, las horas, el hotel y el código
          ya dentro, para Google, Apple, Outlook.com, Office 365 o un .ics. Sale
          de la MISMA reserva que esta pantalla está pintando, así que no puede
          desincronizarse, y es el MISMO componente que la pantalla de gracias:
          dos copias del mismo evento acaban divergiendo. Ver ui/boton-calendario. */}
      <BotonCalendario reserva={reserva} className="mt-4" />
    </section>
  )
}

// Guardar contra Odoo desde un bloque editable. Los tres bloques necesitan lo
// mismo —«guardando…», el error si falla y NO cerrar el formulario cuando no se
// pudo guardar— y repetirlo tres veces es la forma de que acaben divergiendo.
function useGuardado(guardar: (cambios: Parameters<typeof actualizarReserva>[2]) => Promise<void>) {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enviar = async (cambios: Parameters<typeof actualizarReserva>[2], alTerminar: () => void) => {
    setGuardando(true)
    setError(null)
    try {
      await guardar(cambios)
      alTerminar()
    } catch (e: unknown) {
      // El formulario se queda ABIERTO con lo tecleado dentro: cerrarlo aquí
      // perdería el cambio y encima daría a entender que se guardó.
      setError(
        e instanceof ErrorApi && e.codigo === 'too_late_to_change'
          ? t('Changes close 48 h before the tour. Message us and we’ll sort it out with you.')
          : t('We could not save that. Check your connection and try again.'),
      )
    } finally {
      setGuardando(false)
    }
  }

  return { guardando, error, enviar }
}

/** Botones «Guardar / Cancelar» + el error, iguales en los tres bloques. */
function AccionesEdicion({
  guardando,
  error,
  onGuardar,
  onCancelar,
  texto = t('Save'),
}: {
  guardando: boolean
  error: string | null
  onGuardar: () => void
  onCancelar: () => void
  texto?: string
}) {
  return (
    <>
      {error ? (
        <p role="alert" className="rounded-btn border border-coral/40 bg-coral/5 px-3 py-2 text-xs leading-relaxed text-navy-sub">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onGuardar}
          disabled={guardando}
          className="rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? 'Saving…' : texto}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="rounded-btn border border-linea bg-papel px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso disabled:opacity-50"
        >
          {t('Cancel')}
        </button>
      </div>
    </>
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
function BloqueMenu({
  reserva,
  guardar,
}: {
  reserva: Reserva
  guardar: (cambios: Parameters<typeof actualizarReserva>[2]) => Promise<void>
}) {
  const [edit, setEdit] = useState(false)
  const [platos, setPlatos] = useState(reserva.platos)
  const { guardando, error, enviar } = useGuardado(guardar)
  const menuReserva = menuDeLaReserva({
    ficha: reserva.ficha,
    paquete: reserva.paquete,
    variante: reserva.variante,
    personas: reserva.personas,
  })
  const menu = menuReserva?.platos ?? []
  const seElige = menuReserva?.modo === 'eleccion'

  // Los platos van POR COMENSAL y se manda el array entero, huecos incluidos:
  // el servidor descarta los vacíos, que es lo que quiere decir «este todavía
  // no lo ha elegido».
  const guardarCambios = () => void enviar({ dishes: platos }, () => setEdit(false))
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
            {menuReserva && !seElige ? menuReserva.titulo : t('Your menu')}
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
                {t('Guest')}{' '}{i + 1}
              </label>
              <select
                value={p}
                onChange={(e) => setPlatos((prev) => prev.map((x, j) => (i === j ? e.target.value : x)))}
                className="mt-1 w-full rounded-btn border border-linea bg-papel px-3 py-2 text-sm text-navy focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
              >
                <option value="">{t('Not chosen, we’ll confirm by email')}</option>
                {/* Mismo criterio que el paso de menú del funnel: el
                    `value` es el nombre canónico (sin traducir) porque es lo
                    que se guarda en Odoo; el texto de la opción, el traducido. */}
                {menu.map((plato) => (
                  <option key={crudo(plato).nombre} value={crudo(plato).nombre}>
                    {plato.nombre}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <AccionesEdicion
            guardando={guardando}
            error={error}
            onGuardar={guardarCambios}
            onCancelar={cancelar}
            texto={t('Save menu')}
          />
        </div>
      ) : seElige ? (
        <ul className="mt-4 space-y-1.5 text-sm">
          {reserva.platos.map((p, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="text-navy-soft">{t('Guest')}{' '}{i + 1}</span>
              {p ? (
                <span className="font-medium text-navy">{nombrePlato(p, menu)}</span>
              ) : (
                <span className="text-navy-soft">{t('Not chosen')}</span>
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

function BloqueRecogida({
  reserva,
  guardar,
}: {
  reserva: Reserva
  guardar: (cambios: Parameters<typeof actualizarReserva>[2]) => Promise<void>
}) {
  const [edit, setEdit] = useState(false)
  const [hotel, setHotel] = useState(reserva.recogida.hotel)
  const [notas, setNotas] = useState(reserva.recogida.notas)
  const { guardando, error, enviar } = useGuardado(guardar)

  const guardarCambios = () =>
    void enviar({ pickup: { hotel: hotel.trim(), notes: notas.trim() } }, () => setEdit(false))
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
          <h2 className="font-display text-lg font-semibold text-navy">{t('Pickup')}</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <Campo
            etiqueta={t('Hotel')}
            value={hotel}
            onChange={(e) => setHotel(e.target.value)}
            placeholder={t('Hotel name')}
            required
          />
          <Campo
            etiqueta={t('Notes')}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder={t('Room number, preferred time, etc.')}
          />
          <AccionesEdicion
            guardando={guardando}
            error={error}
            onGuardar={guardarCambios}
            onCancelar={cancelar}
          />
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

function BloqueContacto({
  reserva,
  guardar,
}: {
  reserva: Reserva
  guardar: (cambios: Parameters<typeof actualizarReserva>[2]) => Promise<void>
}) {
  const [edit, setEdit] = useState(false)
  const [contacto, setContacto] = useState({
    nombre: reserva.contacto.nombre,
    apellidos: reserva.contacto.apellidos,
    telefono: reserva.contacto.telefono,
  })
  const { guardando, error, enviar } = useGuardado(guardar)

  // El EMAIL no se edita aquí (2026-08-18). Es la credencial con la que se
  // entra a esta pantalla —código + email— y la dirección a la que fue el
  // voucher: dejar cambiarlo desde aquí sería dejar que alguien con el enlace
  // se quede la reserva y que el cliente de verdad pierda el acceso. Se cambia
  // escribiéndonos, que es lo que dice la nota de abajo.
  const guardarCambios = () =>
    void enviar(
      {
        contact: {
          first_name: contacto.nombre.trim(),
          last_name: contacto.apellidos.trim(),
          phone: contacto.telefono.trim(),
        },
      },
      () => setEdit(false),
    )
  const cancelar = () => {
    setContacto({
      nombre: reserva.contacto.nombre,
      apellidos: reserva.contacto.apellidos,
      telefono: reserva.contacto.telefono,
    })
    setEdit(false)
  }

  return (
    <section className="mt-6 rounded-card-grande border border-linea bg-papel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-aqua" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-navy">{t('Contact details')}</h2>
        </div>
        {!edit && <BotonEditar onClick={() => setEdit(true)} />}
      </div>

      {edit ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta={t('First name')} value={contacto.nombre} onChange={(e) => setContacto((c) => ({ ...c, nombre: e.target.value }))} required />
            <Campo etiqueta={t('Last name')} value={contacto.apellidos} onChange={(e) => setContacto((c) => ({ ...c, apellidos: e.target.value }))} />
            <Campo etiqueta={t('Phone')} type="tel" value={contacto.telefono} onChange={(e) => setContacto((c) => ({ ...c, telefono: e.target.value }))} />
          </div>
          <p className="text-xs text-navy-soft">
            {t('Your e-mail is how you get into this page and where the voucher went, so we don’t change it from here — message us and we’ll do it.')}
          </p>
          <AccionesEdicion
            guardando={guardando}
            error={error}
            onGuardar={guardarCambios}
            onCancelar={cancelar}
          />
        </div>
      ) : (
        <dl className="mt-4 space-y-1 text-sm">
          <Fila label={t('Name')} valor={`${reserva.contacto.nombre} ${reserva.contacto.apellidos}`.trim()} />
          <Fila label={t('Email')} valor={reserva.contacto.email} />
          <Fila label={t('Phone')} valor={reserva.contacto.telefono} />
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
      {t('Edit')}
    </button>
  )
}
