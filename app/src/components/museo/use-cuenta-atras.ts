import { useEffect, useState } from 'react'

export type CuentaAtras = { dias: number; horas: number; minutos: number; segundos: number; terminada: boolean }

function calcular(fecha: string): CuentaAtras {
  const ms = Math.max(0, new Date(fecha).getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    dias: Math.floor(s / 86_400),
    horas: Math.floor((s % 86_400) / 3_600),
    minutos: Math.floor((s % 3_600) / 60),
    segundos: s % 60,
    terminada: ms === 0,
  }
}

/** La cuenta atrás hasta la apertura del museo, al segundo.
 *
 *  [2026-10-07, Marketing tras ver la preview: «incluir un contador regresivo
 *  hasta la fecha de apertura, ubicado en un lugar visible»] La comparten el
 *  héroe y la barra de reserva fija. Se calcula en el cliente (es una SPA: no
 *  hay HTML estático que se quede con la cifra de ayer) y, cuando llega la
 *  fecha, `terminada` pasa a true y quien la pinta la retira: un «0 days» en
 *  una página de venta es peor que no decir nada. */
export function useCuentaAtras(fecha: string): CuentaAtras {
  const [c, setC] = useState(() => calcular(fecha))
  useEffect(() => {
    const id = window.setInterval(() => setC(calcular(fecha)), 1000)
    return () => window.clearInterval(id)
  }, [fecha])
  return c
}

export const dosCifras = (n: number) => String(n).padStart(2, '0')
