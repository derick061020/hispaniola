import type { Reserva } from '@/lib/reservas'
import { t } from '@/lib/i18n'

// «Añadir al calendario» → Google Calendar (2026-08-27, pedido de Samuel:
// «que sea funcional, que te lleve a google calendar a agendar el evento»).
//
// Antes el botón apuntaba al .ics que sirve Odoo
// (`GET /bookings/<code>/calendar.ics`). Ese endpoint sigue existiendo y lo
// sigue usando el correo de confirmación (`mail_sender.py` → `calendar_link`),
// pero como botón de una pantalla web tenía dos problemas: se va del sitio a
// otro dominio para descargar un archivo —en el móvil eso acaba a menudo en un
// fichero suelto en Descargas que nadie abre— y exige que la reserva ya esté en
// Odoo con el email de contacto que coincida (`_authorised`), así que en cuanto
// algo de eso falla el visitante recibe un «not found» en vez de un evento.
//
// La plantilla de Google no necesita nada de eso: es una URL, se abre en una
// pestaña con el evento ya relleno y el cliente solo pulsa «Guardar». Y los
// datos salen de la reserva que esta misma pantalla está pintando, así que no
// pueden desincronizarse con lo que el visitante está leyendo.
//
// ⚠️ Esto es SOLO Google. Quien use Apple Calendar u Outlook se queda sin
// botón — el .ics de Odoo es lo que les serviría, y sigue vivo en el correo.
// Si hace falta cubrirlos desde la web, lo que toca es un menú con las dos
// salidas, no cambiar esta.

/** Punta Cana no cambia la hora en todo el año (UTC-4 siempre). Se manda la
 *  hora LOCAL + `ctz` y es Google quien la sitúa: convertirla a UTC aquí
 *  significaría escribir el -4 a mano y equivocarse el día que Google decida
 *  que la zona del visitante manda. */
const ZONA = 'America/Santo_Domingo'

/** Cuánto dura el tour cuando el horario elegido no dice a qué hora se vuelve.
 *  Cuatro horas es lo que asume también el .ics de Odoo (`controllers/
 *  booking.py`), y coincidir con él importa: son el mismo evento. */
const HORAS_POR_DEFECTO = 4

/** «9:00 AM» → 540 (minutos desde medianoche). `null` si no se entiende, y
 *  entonces el evento se crea de día completo en vez de inventarse una hora.
 *  Acepta también «14:30» por si un horario llega en 24 h desde Odoo. */
export function minutosDelDia(hora: string | undefined): number | null {
  if (!hora) return null
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*$/i.exec(hora)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2] ?? 0)
  if (h > 23 || min > 59) return null
  const sufijo = m[3]?.toUpperCase()
  if (sufijo) {
    if (h < 1 || h > 12) return null
    // 12:30 AM es medianoche y 12:30 PM es mediodía — el 12 es el que rompe
    // la regla de «+12 si es PM», así que se normaliza a 0 primero.
    h = h % 12
    if (sufijo === 'PM') h += 12
  }
  return h * 60 + min
}

function selloFecha(fechaISO: string, minutos: number): string {
  const [a, mes, d] = fechaISO.split('-').map(Number)
  // Se construye con las 3 partes y se deja que Date normalice el desbordamiento
  // (un regreso a las 00:30 empuja al día siguiente él solo). Fecha local, no
  // UTC: `new Date('2026-08-27')` se lee como UTC y en GMT-4 retrocede un día
  // — la misma trampa que documenta lib/fechas.ts.
  const fecha = new Date(a, mes - 1, d, 0, minutos)
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}` +
    `T${p(fecha.getHours())}${p(fecha.getMinutes())}00`
  )
}

function selloDia(fechaISO: string, sumar = 0): string {
  const [a, mes, d] = fechaISO.split('-').map(Number)
  const fecha = new Date(a, mes - 1, d + sumar)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}`
}

/** El evento tal y como lo va a ver el cliente en su calendario. Se saca
 *  entero de la reserva que la pantalla ya tiene delante. */
export function urlGoogleCalendar(reserva: Reserva): string {
  const horario = reserva.ficha.horarios[reserva.horarioIdx]
  const salida = minutosDelDia(horario?.hora)
  const regreso = minutosDelDia(horario?.regreso)

  const fechas =
    salida === null
      ? // Sin hora fiable, día completo. Google pide el día SIGUIENTE como
        // fin en los eventos de día completo.
        `${selloDia(reserva.fechaISO)}/${selloDia(reserva.fechaISO, 1)}`
      : `${selloFecha(reserva.fechaISO, salida)}/` +
        `${selloFecha(
          reserva.fechaISO,
          // Un regreso anterior a la salida solo puede ser del día siguiente.
          regreso === null ? salida + HORAS_POR_DEFECTO * 60
          : regreso <= salida ? regreso + 24 * 60
          : regreso,
        )}`

  const hotel = reserva.recogida.hotel.trim()
  const detalles = [
    `${t('Your booking code')}: ${reserva.codigo}`,
    `${reserva.personas} ${t('guests')}`,
    hotel ? `${t('Pickup')}: ${hotel}${reserva.recogida.notas ? ` (${reserva.recogida.notas})` : ''}` : '',
    typeof window === 'undefined'
      ? ''
      : `${t('Manage my booking →')} ${window.location.origin}/my-booking?codigo=${reserva.codigo}`,
  ]
    .filter(Boolean)
    .join('\n')

  const qs = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${reserva.tour.nombre} — Hispaniola Aquatic Adventures`,
    dates: fechas,
    ctz: ZONA,
    details: detalles,
    // El mismo respaldo que pone el .ics cuando la reserva aún no tiene hotel:
    // un evento sin sitio no le dice nada a quien lo abre una semana después.
    location: hotel || 'Punta Cana, Dominican Republic',
  })
  return `https://calendar.google.com/calendar/render?${qs.toString()}`
}
