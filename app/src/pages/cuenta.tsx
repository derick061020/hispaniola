import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, KeyRound, LogOut, Mail, ShieldCheck, Users } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Campo } from '@/components/ui/campo'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { ErrorApi } from '@/lib/api/cliente'
import { fechaLarga } from '@/lib/fechas'
import { formatoDinero } from '@/data/home'
import { IDIOMAS } from '@/lib/idioma'
import {
  cambiarPassword, cerrarSesion, entrar, guardarPerfil, guardarSesion, leerCuenta,
  pedirPassword, sesionGuardada, type PerfilCuenta, type ReservaDeCuenta,
} from '@/lib/api/cuenta'

// «Mi cuenta» — el área privada del cliente.
//
// [2026-08-18] Nace de una regla del negocio: CONSULTAR una reserva puede
// hacerse con el código y el email (así funciona «My booking», y así viene en
// los correos), pero CAMBIAR datos pide algo que solo tiene el cliente. Esa
// contraseña se la mandamos por correo en cuanto reserva — no hay registro que
// rellenar, porque nadie se hace una cuenta para ir en catamarán.
//
// La pantalla tiene dos estados y ninguno más: fuera (una card con el acceso)
// y dentro (reservas, datos y contraseña). Se pinta con la misma card sobre
// `papel-hueso` que «My booking», para que el cliente sienta que es el mismo
// sitio y no otro producto.

const ESTADOS: Record<string, { etiqueta: string; clase: string }> = {
  confirmed: { etiqueta: 'Confirmed', clase: 'bg-aqua-tint text-aqua-dark' },
  pending: { etiqueta: 'Pending', clase: 'bg-linea text-navy-sub' },
  cancelled: { etiqueta: 'Cancelled', clase: 'bg-coral/10 text-coral' },
}

export function CuentaPage() {
  const [sesion, setSesion] = useState(sesionGuardada)
  const [perfil, setPerfil] = useState<PerfilCuenta | null>(null)
  const [reservas, setReservas] = useState<ReservaDeCuenta[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Sesión guardada: se recupera al abrir ───────────────────────────────
  const cargar = useCallback((token: string) => {
    setCargando(true)
    leerCuenta(token)
      .then((d) => {
        setPerfil(d.profile)
        setReservas(d.bookings)
        setError(null)
      })
      .catch((e: unknown) => {
        // Token caducado o revocado: se sale sin drama y se pide entrar otra vez.
        if (e instanceof ErrorApi && e.status === 401) {
          cerrarSesion()
          setSesion(null)
        } else {
          setError('No hemos podido cargar tu cuenta. Prueba otra vez en un momento.')
        }
      })
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    if (sesion?.token) cargar(sesion.token)
  }, [sesion?.token, cargar])

  function salir() {
    cerrarSesion()
    setSesion(null)
    setPerfil(null)
    setReservas([])
  }

  return (
    <>
      <Meta
        titulo="My account · Hispaniola Aquatic Adventures"
        descripcion="Sign in to see your bookings, choose your menu and update your details."
        ruta="/account"
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
          <Link to="/" aria-label="Hispaniola Aquatic Adventures" className="justify-self-center">
            <Logo compacto />
          </Link>
          <div aria-hidden="true" className="justify-self-end">
            {perfil ? (
              <button
                type="button"
                onClick={salir}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-sub hover:text-navy"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="min-h-[70vh] bg-papel-hueso px-5 py-12 sm:px-8 sm:py-16">
        {!sesion || !perfil ? (
          <Acceso
            cargando={cargando}
            onEntrar={(token, email, datos) => {
              guardarSesion({ token, email })
              setSesion({ token, email })
              setPerfil(datos.profile)
              setReservas(datos.bookings)
            }}
          />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                Hello, {perfil.first_name || 'there'}
              </h1>
              <p className="mt-2 text-sm text-navy-sub">
                Here are your bookings and your details. Changes save straight to our system — the crew sees
                them right away.
              </p>
            </div>

            {error ? (
              <p role="alert" className="rounded-card border border-coral/30 bg-coral/5 p-4 text-sm text-navy-sub">
                {error}
              </p>
            ) : null}

            <Reservas reservas={reservas} perfilEmail={perfil.email} />
            <DatosPersonales
              perfil={perfil}
              token={sesion.token}
              onGuardado={(p) => setPerfil(p)}
            />
            <CambiarClave
              token={sesion.token}
              onNuevoToken={(token) => {
                guardarSesion({ token, email: perfil.email })
                setSesion({ token, email: perfil.email })
              }}
            />
          </div>
        )}
      </main>
    </>
  )
}

// ── Fuera: entrar o pedir contraseña ───────────────────────────────────────
function Acceso({
  cargando,
  onEntrar,
}: {
  cargando: boolean
  onEntrar: (
    token: string,
    email: string,
    datos: { profile: PerfilCuenta; bookings: ReservaDeCuenta[] },
  ) => void
}) {
  const [modo, setModo] = useState<'entrar' | 'olvidada'>('entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setAviso(null)
    setEnviando(true)
    try {
      if (modo === 'entrar') {
        const d = await entrar(email.trim(), password)
        onEntrar(d.token, email.trim(), { profile: d.profile, bookings: d.bookings })
      } else {
        await pedirPassword(email.trim())
        setAviso('If that address has a booking with us, a new password is on its way to it.')
        setModo('entrar')
        setPassword('')
      }
    } catch (err: unknown) {
      setError(
        err instanceof ErrorApi && err.codigo === 'bad_credentials'
          ? 'That email or password is not right. If you lost it, ask for a new one below.'
          : 'Something went wrong on our side. Try again in a moment.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
          <KeyRound className="size-7" aria-hidden="true" strokeWidth={2} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-navy sm:text-3xl">
          {modo === 'entrar' ? 'Your bookings' : 'Get a new password'}
        </h1>
        <p className="mt-3 text-sm text-navy-sub">
          {modo === 'entrar' ? (
            <>
              Sign in with the email you booked with and the password we sent you when you booked. No account
              to create — it&rsquo;s already there.
            </>
          ) : (
            <>Tell us the email you booked with and we&rsquo;ll send a new password to it.</>
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Campo
          etiqueta="Email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {modo === 'entrar' ? (
          <Campo
            etiqueta="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : null}
        <FancyButton.Root
          type="submit"
          variant="primary"
          className="w-full"
          disabled={enviando || cargando || email.trim() === ''}
        >
          {enviando ? 'One moment…' : modo === 'entrar' ? 'Sign in' : 'Send me a password'}
        </FancyButton.Root>
      </form>

      {error ? (
        <p role="alert" className="mt-4 rounded-card border border-coral/30 bg-coral/5 p-4 text-sm text-navy-sub">
          {error}
        </p>
      ) : null}
      {aviso ? (
        <p className="mt-4 rounded-card border border-aqua/30 bg-aqua-tint/50 p-4 text-sm text-navy-sub">{aviso}</p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setModo(modo === 'entrar' ? 'olvidada' : 'entrar')
          setError(null)
        }}
        className="mt-5 w-full text-center text-sm font-semibold text-aqua-dark hover:underline"
      >
        {modo === 'entrar' ? 'I lost my password' : 'I have my password'}
      </button>

      <p className="mt-6 border-t border-linea pt-5 text-center text-xs text-navy-soft">
        Just want to look at a booking?{' '}
        <Link to="/my-booking" className="font-semibold text-aqua-dark hover:underline">
          Open it with your booking code
        </Link>
        .
      </p>
    </div>
  )
}

// ── Dentro: sus reservas ───────────────────────────────────────────────────
function Reservas({ reservas, perfilEmail }: { reservas: ReservaDeCuenta[]; perfilEmail: string }) {
  if (!reservas.length) {
    return (
      <section className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
        <h2 className="font-display text-lg font-semibold text-navy">Your bookings</h2>
        <p className="mt-2 text-sm text-navy-sub">
          Nothing here yet. When you book, it shows up on this screen.
        </p>
      </section>
    )
  }
  return (
    <section className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
      <h2 className="font-display text-lg font-semibold text-navy">Your bookings</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {reservas.map((r) => {
          const estado = ESTADOS[r.status] ?? ESTADOS.pending
          return (
            <li key={r.code} className="rounded-card border border-linea p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-navy">{r.tour.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy-sub">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4" aria-hidden="true" />
                      {r.date ? fechaLarga(r.date) : 'Date to be set'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4" aria-hidden="true" />
                      {r.pax.total}
                    </span>
                    <span className="font-mono text-xs text-navy-soft">{r.code}</span>
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estado.clase}`}>
                  {estado.etiqueta}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-linea pt-3">
                <span className="text-sm text-navy-sub">
                  {formatoDinero(r.amounts.total)}
                  {r.amounts.balance > 0 ? (
                    <span className="text-navy-soft"> · {formatoDinero(r.amounts.balance)} on the day</span>
                  ) : null}
                </span>
                {r.status !== 'cancelled' ? (
                  <Link
                    // El email va en el enlace para que no se lo pidan otra
                    // vez: ya entró con su contraseña hace un momento.
                    to={`/my-booking?codigo=${encodeURIComponent(r.code)}&email=${encodeURIComponent(perfilEmail)}`}
                    className="text-sm font-semibold text-aqua-dark hover:underline"
                  >
                    Menu, pickup and changes &rarr;
                  </Link>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ── Dentro: sus datos ──────────────────────────────────────────────────────
function DatosPersonales({
  perfil,
  token,
  onGuardado,
}: {
  perfil: PerfilCuenta
  token: string
  onGuardado: (p: PerfilCuenta) => void
}) {
  const [datos, setDatos] = useState(perfil)
  const [guardando, setGuardando] = useState(false)
  const [hecho, setHecho] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setHecho(false)
    setError(null)
    try {
      const d = await guardarPerfil(token, {
        first_name: datos.first_name,
        last_name: datos.last_name,
        phone: datos.phone,
        country: datos.country,
        language: datos.language,
        marketing_opt_out: datos.marketing_opt_out,
      })
      onGuardado(d.profile)
      setHecho(true)
    } catch {
      setError('We could not save that. Try again in a moment.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
      <h2 className="font-display text-lg font-semibold text-navy">Your details</h2>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="First name"
            autoComplete="given-name"
            value={datos.first_name}
            onChange={(e) => setDatos({ ...datos, first_name: e.target.value })}
          />
          <Campo
            etiqueta="Last name"
            autoComplete="family-name"
            value={datos.last_name}
            onChange={(e) => setDatos({ ...datos, last_name: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="WhatsApp / phone"
            type="tel"
            autoComplete="tel"
            value={datos.phone}
            onChange={(e) => setDatos({ ...datos, phone: e.target.value })}
          />
          <Campo
            etiqueta="Country"
            autoComplete="country-name"
            value={datos.country}
            onChange={(e) => setDatos({ ...datos, country: e.target.value })}
          />
        </div>

        {/* El email NO se edita aquí: es con lo que se entra y la dirección a
            la que fueron el voucher y todos los avisos. Cambiarlo lo hace el
            equipo, que puede comprobar quién lo pide. */}
        <div>
          <span className="text-sm font-medium text-navy">Email</span>
          <p className="mt-1.5 flex items-center gap-2 rounded-input border border-linea bg-papel-hueso px-3 py-2.5 text-sm text-navy-sub">
            <Mail className="size-4 shrink-0 text-navy-soft" aria-hidden="true" />
            {datos.email}
          </p>
          <p className="mt-1.5 text-xs text-navy-soft">
            This is how you sign in and where your booking emails go. To change it, write to us and we&rsquo;ll
            do it for you.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Language for your emails</span>
          <select
            className="h-11 w-full rounded-input border border-linea bg-white px-3 text-sm text-navy outline-none transition-colors focus-visible:border-aqua focus-visible:ring-2 focus-visible:ring-aqua/30"
            value={datos.language}
            onChange={(e) => setDatos({ ...datos, language: e.target.value })}
          >
            {IDIOMAS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-start gap-3 rounded-card border border-linea bg-papel-hueso p-4">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-linea text-aqua focus-visible:ring-2 focus-visible:ring-aqua/30"
            checked={!datos.marketing_opt_out}
            onChange={(e) => setDatos({ ...datos, marketing_opt_out: !e.target.checked })}
          />
          <span className="text-sm text-navy-sub">
            Send me the &ldquo;how was your day&rdquo; email and the occasional offer.
            <span className="mt-0.5 block text-xs text-navy-soft">
              Emails about your own booking — confirmation, changes, cancellation — always arrive.
            </span>
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <FancyButton.Root type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Saving…' : 'Save changes'}
          </FancyButton.Root>
          {hecho ? <span className="text-sm font-semibold text-aqua-dark">Saved</span> : null}
          {error ? <span className="text-sm text-coral">{error}</span> : null}
        </div>
      </form>
    </section>
  )
}

// ── Dentro: su contraseña ──────────────────────────────────────────────────
function CambiarClave({ token, onNuevoToken }: { token: string; onNuevoToken: (t: string) => void }) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [hecho, setHecho] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setHecho(false)
    setError(null)
    try {
      const d = await cambiarPassword(token, actual, nueva)
      onNuevoToken(d.token)
      setActual('')
      setNueva('')
      setHecho(true)
    } catch (err: unknown) {
      setError(
        err instanceof ErrorApi && err.codigo === 'bad_credentials'
          ? 'That current password is not right.'
          : err instanceof ErrorApi && err.codigo === 'weak_password'
            ? 'Use at least 8 characters.'
            : 'We could not change it. Try again in a moment.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
        <ShieldCheck className="size-5 text-aqua-dark" aria-hidden="true" />
        Password
      </h2>
      <p className="mt-2 text-sm text-navy-sub">
        Change the one we emailed you for one you remember. Nobody from Hispaniola will ever ask you for it.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Current password"
            type="password"
            autoComplete="current-password"
            required
            value={actual}
            onChange={(e) => setActual(e.target.value)}
          />
          <Campo
            etiqueta="New password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FancyButton.Root type="submit" variant="basic" disabled={guardando || nueva.length < 8}>
            {guardando ? 'Changing…' : 'Change password'}
          </FancyButton.Root>
          {hecho ? <span className="text-sm font-semibold text-aqua-dark">Done</span> : null}
          {error ? <span className="text-sm text-coral">{error}</span> : null}
        </div>
      </form>
    </section>
  )
}
