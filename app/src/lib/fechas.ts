// Fechas en español — portado de prototipo/datos.js (fuente canónica), que las
// resuelve a mano y NO con toLocaleDateString por dos razones que siguen
// valiendo aquí: el resultado de `Intl` varía entre navegadores y versiones de
// ICU ('lun' vs 'lun.'), y parsear un ISO con `new Date('2026-07-22')` lo
// interpreta como UTC → en GMT-4 (Punta Cana) el día se corre uno hacia atrás.
// Construir la fecha con sus 3 partes evita el corrimiento.

export const DIAS_CORTOS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MESES_CORTOS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MESES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function fechaAISO(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function parseFechaISO(iso: string): Date {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export function hoyISO(): string {
  return fechaAISO(new Date())
}

export function sumarDias(iso: string, n: number): string {
  const d = parseFechaISO(iso)
  d.setDate(d.getDate() + n)
  return fechaAISO(d)
}

export function fechaLarga(iso: string): string {
  const d = parseFechaISO(iso)
  return `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`
}

export function diaCorto(iso: string): string {
  return DIAS_CORTOS[parseFechaISO(iso).getDay()]
}

export function numeroDeDia(iso: string): number {
  return parseFechaISO(iso).getDate()
}

// Para el grid mensual del calendario (calendario-widget.tsx): en qué columna
// (0=domingo, igual que DIAS_CORTOS) cae el día 1, y cuántos días tiene el mes.
export function primerDiaSemana(anio: number, mes: number): number {
  return new Date(anio, mes, 1).getDay()
}

export function diasEnMes(anio: number, mes: number): number {
  return new Date(anio, mes + 1, 0).getDate()
}
