import type { Reserva } from '@/lib/reservas'
import { t } from '@/lib/i18n'

// «Añadir al calendario» (2026-08-27, pedido de Samuel: «que sea funcional,
// que te lleve a google calendar a agendar el evento»; y acto seguido, «mejor
// contempla dichos calendarios entonces, que sea lo más general posible»).
//
// Antes el botón apuntaba al .ics que sirve Odoo
// (`GET /bookings/<code>/calendar.ics`). Ese endpoint sigue existiendo y lo
// sigue usando el correo de confirmación (`mail_sender.py` → `calendar_link`),
// pero como botón de una pantalla web tenía dos problemas: se va del sitio a
// otro dominio para descargar un archivo —en el móvil eso acaba a menudo en un
// fichero suelto en Descargas que nadie abre— y exige que la reserva ya esté en
// Odoo con el email de contacto coincidiendo (`_authorised`), así que en cuanto
// algo de eso falla el visitante recibe un «not found» justo después de pagar.
//
// Ahora el evento se arma AQUÍ, con la reserva que la pantalla ya está
// pintando. No hay segunda consulta que pueda contestar otra cosa, no hay
// autorización que pueda fallar, y el mismo evento sale por las cuatro salidas:
// Google, Outlook.com, Office 365 y un .ics para Apple Calendar y todo lo
// demás. Ninguna depende del backend.
//
// El .ics se genera en el navegador y viaja en un `data:` URI dentro de un
// `<a download>`: sin fetch, sin blob que limpiar y sin depender de que Odoo
// conteste. Cabe de sobra —el evento no llega a 1 KB— y lo entienden Apple
// Calendar, Outlook de escritorio, Thunderbird y el resto.

/** Punta Cana no cambia la hora en ningún momento del año: la República
 *  Dominicana suprimió el horario de verano en 2000 y está en UTC-4 fijo.
 *  Este es el ÚNICO sitio donde ese -4 está escrito: `enUTC()` lo usa para
 *  convertir la hora del tour en un instante absoluto, que es lo que entienden
 *  el .ics y Outlook. Google no lo necesita — se le manda la hora local y el
 *  nombre de la zona, y la sitúa él. */
const ZONA = 'America/Santo_Domingo'
const OFFSET_MINUTOS = -4 * 60

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

/** El tour, ya resuelto: qué se llama, cuándo empieza y acaba, dónde y qué hay
 *  que saber. Todas las salidas parten de aquí, así que no pueden decir cosas
 *  distintas — que es exactamente lo que pasaba cuando el botón preguntaba a
 *  Odoo y la pantalla leía la copia local. */
export type EventoCalendario = {
  titulo: string
  lugar: string
  detalles: string
  /** Día del tour, «YYYY-MM-DD». Es lo único seguro cuando no hay hora. */
  diaISO: string
  /** Minutos desde medianoche, hora de Punta Cana. `null` = día completo. */
  salida: number | null
  regreso: number
}

export function eventoDeReserva(reserva: Reserva): EventoCalendario {
  const horario = reserva.ficha.horarios[reserva.horarioIdx]
  const salida = minutosDelDia(horario?.hora)
  const vuelta = minutosDelDia(horario?.regreso)
  const hotel = reserva.recogida.hotel.trim()

  return {
    titulo: `${reserva.tour.nombre} — Hispaniola Aquatic Adventures`,
    // El mismo respaldo que pone el .ics de Odoo cuando la reserva aún no
    // tiene hotel: un evento sin sitio no le dice nada a quien lo abre una
    // semana después.
    lugar: hotel || 'Punta Cana, Dominican Republic',
    detalles: [
      `${t('Your booking code')}: ${reserva.codigo}`,
      `${reserva.personas} ${t('guests')}`,
      hotel
        ? `${t('Pickup')}: ${hotel}${reserva.recogida.notas ? ` (${reserva.recogida.notas})` : ''}`
        : '',
      typeof window === 'undefined'
        ? ''
        : `${t('Manage my booking →')} ${window.location.origin}/my-booking?codigo=${reserva.codigo}`,
    ]
      .filter(Boolean)
      .join('\n'),
    diaISO: reserva.fechaISO,
    salida,
    regreso:
      salida === null ? 0
        // Un regreso anterior a la salida solo puede ser del día siguiente.
      : vuelta === null ? salida + HORAS_POR_DEFECTO * 60
      : vuelta <= salida ? vuelta + 24 * 60
      : vuelta,
  }
}

/** El instante absoluto de una hora de Punta Cana. Se construye con `Date.UTC`
 *  y el offset fijo: pasar por el constructor local usaría la zona del
 *  visitante, que casi nunca es la del tour — alguien reservando desde Madrid
 *  se llevaría el evento seis horas movido. */
function enUTC(diaISO: string, minutos: number): Date {
  const [a, m, d] = diaISO.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d, 0, minutos - OFFSET_MINUTOS))
}

const p2 = (n: number) => String(n).padStart(2, '0')

/** «20260827T130000Z» — el sello UTC que piden el .ics y Outlook. */
function selloUTC(fecha: Date): string {
  return (
    `${fecha.getUTCFullYear()}${p2(fecha.getUTCMonth() + 1)}${p2(fecha.getUTCDate())}` +
    `T${p2(fecha.getUTCHours())}${p2(fecha.getUTCMinutes())}00Z`
  )
}

/** «20260827» — el día, sumando `sumar` si hace falta. Los eventos de día
 *  completo se cierran con el día SIGUIENTE, tanto en iCalendar como en la
 *  plantilla de Google. */
function selloDia(diaISO: string, sumar = 0): string {
  const [a, m, d] = diaISO.split('-').map(Number)
  const fecha = new Date(Date.UTC(a, m - 1, d + sumar))
  return `${fecha.getUTCFullYear()}${p2(fecha.getUTCMonth() + 1)}${p2(fecha.getUTCDate())}`
}

/** «20260827T090000» — hora local del tour, SIN zona. Solo para Google, que la
 *  sitúa con el `ctz` que va aparte. */
function selloLocal(diaISO: string, minutos: number): string {
  const [a, m, d] = diaISO.split('-').map(Number)
  // Por UTC aunque la hora sea local: es solo aritmética de calendario (que un
  // regreso a las 00:30 caiga en el día siguiente) y `Date.UTC` la hace sin
  // meter de por medio la zona del visitante.
  const f = new Date(Date.UTC(a, m - 1, d, 0, minutos))
  return (
    `${f.getUTCFullYear()}${p2(f.getUTCMonth() + 1)}${p2(f.getUTCDate())}` +
    `T${p2(f.getUTCHours())}${p2(f.getUTCMinutes())}00`
  )
}

// ── Google ────────────────────────────────────────────────────────────────
export function urlGoogleCalendar(evento: EventoCalendario): string {
  const qs = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.titulo,
    dates:
      evento.salida === null
        ? `${selloDia(evento.diaISO)}/${selloDia(evento.diaISO, 1)}`
        : `${selloLocal(evento.diaISO, evento.salida)}/${selloLocal(evento.diaISO, evento.regreso)}`,
    ctz: ZONA,
    details: evento.detalles,
    location: evento.lugar,
  })
  return `https://calendar.google.com/calendar/render?${qs.toString()}`
}

// ── Outlook ───────────────────────────────────────────────────────────────
// Dos dominios para el mismo formulario y no son intercambiables: `live` es la
// cuenta personal de Outlook.com/Hotmail y `office` la del trabajo o el
// colegio. Entrar por el que no toca deja al cliente en un login que no puede
// pasar, así que se ofrecen los dos y elige él.
export type SaborOutlook = 'live' | 'office'

export function urlOutlook(evento: EventoCalendario, sabor: SaborOutlook): string {
  const dominio = sabor === 'live' ? 'outlook.live.com' : 'outlook.office.com'
  const qs = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: evento.titulo,
    body: evento.detalles,
    location: evento.lugar,
    ...(evento.salida === null
      ? {
          allday: 'true',
          startdt: evento.diaISO,
          enddt: evento.diaISO,
        }
      : {
          // En UTC (`…Z`) a propósito: sin zona, Outlook lo lee en la del
          // visitante y el tour se movería de hora.
          startdt: enUTC(evento.diaISO, evento.salida).toISOString(),
          enddt: enUTC(evento.diaISO, evento.regreso).toISOString(),
        }),
  })
  return `https://${dominio}/calendar/0/deeplink/compose?${qs.toString()}`
}

// ── iCalendar (.ics) ──────────────────────────────────────────────────────
/** Escapado de RFC 5545: la coma y el punto y coma separan campos, así que
 *  dentro de un texto van con barra. Mismo criterio que `_ics_escape` en el
 *  controlador de Odoo. */
function escapaICS(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/** RFC 5545 §3.1: ninguna línea pasa de 75 octetos, y la continuación empieza
 *  por un espacio. La descripción del tour se pasa de largo con facilidad —el
 *  hotel, las notas y el enlace a «Mi reserva» van en una sola línea— y hay
 *  clientes estrictos que descartan el evento entero al encontrarla. Se corta
 *  contando BYTES, no caracteres: partir una «ó» por la mitad deja el fichero
 *  ilegible. */
function pliega(linea: string): string {
  const bytes = new TextEncoder().encode(linea)
  if (bytes.length <= 75) return linea
  const trozos: string[] = []
  let inicio = 0
  while (inicio < bytes.length) {
    // 75 el primero; los siguientes 74, que el espacio de continuación cuenta.
    let fin = Math.min(inicio + (trozos.length === 0 ? 75 : 74), bytes.length)
    // No cortar en mitad de un carácter: los bytes de continuación UTF-8
    // empiezan por 10xxxxxx, así que se retrocede hasta el inicio de uno.
    while (fin < bytes.length && (bytes[fin] & 0xc0) === 0x80) fin--
    trozos.push(new TextDecoder().decode(bytes.slice(inicio, fin)))
    inicio = fin
  }
  return trozos.join('\r\n ')
}

export function contenidoICS(evento: EventoCalendario, codigo: string): string {
  const cuando =
    evento.salida === null
      ? [
          // VALUE=DATE es lo que marca un evento de día completo; el fin es el
          // día siguiente, igual que en la plantilla de Google.
          `DTSTART;VALUE=DATE:${selloDia(evento.diaISO)}`,
          `DTEND;VALUE=DATE:${selloDia(evento.diaISO, 1)}`,
        ]
      : [
          `DTSTART:${selloUTC(enUTC(evento.diaISO, evento.salida))}`,
          `DTEND:${selloUTC(enUTC(evento.diaISO, evento.regreso))}`,
        ]

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hispaniola Aquatic Adventures//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${codigo}@hispaniolaaquatic.com`,
    // DTSTAMP es «cuándo se escribió esta copia del evento», no cuándo es el
    // tour: la hora del navegador vale y es la que se espera aquí.
    `DTSTAMP:${selloUTC(new Date())}`,
    ...cuando,
    pliega(`SUMMARY:${escapaICS(evento.titulo)}`),
    pliega(`LOCATION:${escapaICS(evento.lugar)}`),
    pliega(`DESCRIPTION:${escapaICS(evento.detalles)}`),
    'END:VEVENT',
    'END:VCALENDAR',
    '',
    // CRLF, no \n: lo pide el RFC y hay clientes viejos que se plantan sin él.
  ].join('\r\n')
}

/** El .ics listo para colgar de un `<a download>`. */
export function urlDescargaICS(evento: EventoCalendario, codigo: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(contenidoICS(evento, codigo))}`
}
