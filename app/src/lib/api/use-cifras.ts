import { useEffect, useState } from 'react'
import { STATS } from '@/data/home'

// [2026-09-30, el cliente: «queremos que estos números se vayan
// retroalimentando del sistema de reserva y actualizando solo»]
//
// Las cuatro cifras del hero estaban escritas a mano desde que Miguel las dio,
// y se quedaron quietas mientras la empresa seguía navegando. Las dos primeras
// —clientes y días navegados— ya las puede contar Odoo, así que las pide al
// servidor; el aforo y el plástico NO son contables y se quedan como están.
//
// Se cuentan distinto a propósito, y lo pidió así Derick («los clientes
// increméntalos, y los días congélalos y que vayan aumentando»):
//
//   · Clientes: los pasajeros que Odoo tiene desde 2014 (343.374 hoy) más los
//     15.000 que Miguel estimó para los años sin registro. Sube con cada
//     salida: hoy sale 358.374, siete mil más de los que anunciaba la web.
//   · Días: se congela el 5.454 publicado y se le suman solo los días nuevos.
//     Contándolos desde cero Odoo diría 5.211, y la web anunciaría haber
//     navegado 243 días MENOS que ayer.
//
// Lo de siempre en este proyecto: la cifra escrita se pinta mientras la
// respuesta viaja y es la red si Odoo no contesta. Un hero sin números se ve
// roto; un hero con los de ayer, no.

/** Una sola petición por sesión: el hero se monta en cada visita a la home. */
let cache: { guests: number; days: number } | null = null
let enVuelo: Promise<{ guests: number; days: number } | null> | null = null

const BASE = `${import.meta.env?.VITE_API_URL ?? 'http://localhost:8069'}/api/web/v1`

async function pedir(): Promise<{ guests: number; days: number } | null> {
  try {
    const res = await fetch(`${BASE}/stats`, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = await res.json()
    const d = json?.data ?? json
    const guests = Number(d?.guests)
    const days = Number(d?.days_at_sea)
    // Un cero o un NaN no son una cifra: son un fallo. Con la red puesta, se
    // prefiere el número de ayer antes que anunciar «0 clientes felices».
    if (!Number.isFinite(guests) || !Number.isFinite(days) || guests <= 0 || days <= 0) {
      return null
    }
    return { guests, days }
  } catch {
    return null
  }
}

/** Las cuatro cifras del hero, con las dos primeras al día. */
export function useCifras() {
  const [vivas, setVivas] = useState(cache)

  useEffect(() => {
    if (cache) return
    let sigo = true
    enVuelo ??= pedir().finally(() => {
      enVuelo = null
    })
    enVuelo.then((datos) => {
      if (!datos) return
      cache = datos
      if (sigo) setVivas(datos)
    })
    return () => {
      sigo = false
    }
  }, [])

  if (!vivas) return STATS
  // El separador de miles lo pone el idioma que se está leyendo, igual que
  // hace el resto del sitio (en español es el punto).
  const miles = (n: number) => n.toLocaleString('en-US')
  return STATS.map((s) =>
    s.label === 'happy guests'
      ? { ...s, valor: miles(vivas.guests) }
      : s.label === 'days at sea'
        ? { ...s, valor: miles(vivas.days) }
        : s,
  )
}
