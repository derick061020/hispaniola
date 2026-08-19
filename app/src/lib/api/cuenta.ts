import { llamar } from '@/lib/api/cliente'
import type { Reserva } from '@/lib/api/tipos'

/** [2026-08-18] EL ÁREA PRIVADA DEL CLIENTE.
 *
 *  «My booking» deja ver una reserva con el código y el email. Eso vale para
 *  CONSULTAR —el código va en los correos y se reenvía sin drama—, pero no
 *  para cambiar datos: para eso se pide algo que solo tiene el cliente, y esa
 *  es la contraseña que recibe cuando reserva.
 *
 *  La sesión se guarda en `localStorage` porque tiene que sobrevivir a cerrar
 *  la pestaña: el turista abre su reserva desde el móvil, en el hotel, días
 *  después de reservar. El token caduca solo a los 8 días — lo comprueba el
 *  servidor, aquí no se decide nada de seguridad. */
const CLAVE = 'hispaniola.cuenta'

export type PerfilCuenta = {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  language: string
  marketing_opt_out: boolean
}

/** Una reserva vista desde el área privada: la de siempre más su token, que es
 *  lo que permite editarla con los endpoints de reserva ya existentes. */
export type ReservaDeCuenta = Reserva & { token?: string }

type Sesion = { token: string; email: string }

export function sesionGuardada(): Sesion | null {
  try {
    const crudo = localStorage.getItem(CLAVE)
    return crudo ? (JSON.parse(crudo) as Sesion) : null
  } catch {
    return null
  }
}

export function guardarSesion(sesion: Sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion))
  } catch {
    /* Modo privado de Safari: se sigue con la sesión en memoria. */
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    /* idem */
  }
}

export function entrar(email: string, password: string) {
  return llamar<{ token: string; profile: PerfilCuenta; bookings: ReservaDeCuenta[] }>(
    '/account/login',
    { metodo: 'POST', cuerpo: { email, password } },
  )
}

/** Pide una contraseña nueva. Responde lo mismo exista o no la dirección: el
 *  servidor no confirma quién ha reservado aquí. */
export function pedirPassword(email: string) {
  return llamar<{ sent: boolean }>('/account/forgot', { metodo: 'POST', cuerpo: { email } })
}

export function leerCuenta(tokenCuenta: string, signal?: AbortSignal) {
  return llamar<{ profile: PerfilCuenta; bookings: ReservaDeCuenta[] }>('/account', {
    tokenCuenta,
    signal,
  })
}

export function guardarPerfil(tokenCuenta: string, cambios: Partial<PerfilCuenta>) {
  return llamar<{ profile: PerfilCuenta }>('/account', {
    metodo: 'PATCH',
    cuerpo: cambios,
    tokenCuenta,
  })
}

export function cambiarPassword(tokenCuenta: string, actual: string, nueva: string) {
  return llamar<{ token: string }>('/account/password', {
    metodo: 'POST',
    cuerpo: { current: actual, new: nueva },
    tokenCuenta,
  })
}
