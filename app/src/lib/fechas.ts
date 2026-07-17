// Fechas en español — portado de prototipo/datos.js (fuente canónica), que las
// resuelve a mano y NO con toLocaleDateString por dos razones que siguen
// valiendo aquí: el resultado de `Intl` varía entre navegadores y versiones de
// ICU ('lun' vs 'lun.'), y parsear un ISO con `new Date('2026-07-22')` lo
// interpreta como UTC → en GMT-4 (Punta Cana) el día se corre uno hacia atrás.
// Construir la fecha con sus 3 partes evita el corrimiento.

export const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

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

export function diaCorto(iso: string): string {
  return DIAS_CORTOS[parseFechaISO(iso).getDay()]
}

export function numeroDeDia(iso: string): number {
  return parseFechaISO(iso).getDate()
}
