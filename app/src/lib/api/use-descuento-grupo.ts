import { useEffect, useState } from 'react'
import { obtenerConfig } from '@/lib/api/api'
import { DESCUENTO_GRUPO, type DescuentoGrupo } from '@/lib/tarifas'

/** [2026-09-03] EL DESCUENTO POR GRUPO, TAL Y COMO ESTÁ EN ODOO.
 *
 *  Derick: «hay un descuento en la web que dice Groups of 7+ get a group
 *  discount; esto debe estar correctamente conectado con el group discount del
 *  sistema, porque en realidad son 6, y si cambio el número debe reflejarse en
 *  la web, lo mismo si lo elimino».
 *
 *  Antes el banner llevaba el umbral escrito a mano en `lib/tarifas.ts`. La
 *  regla de verdad es la oferta `kind: 'group'` del catálogo de Special
 *  Offers, que es la que aplica el CRM y la que cobra `/quote` — la web
 *  anunciaba 7 y el motor descontaba desde 6.
 *
 *  Tres estados, y los tres importan:
 *   · `undefined` → todavía no se sabe. Se pinta el respaldo, que hoy coincide
 *     con lo configurado: un banner que parpadea con otro número sería peor.
 *   · un objeto    → la regla de Odoo. Manda.
 *   · `null`       → Odoo contestó y NO hay descuento de grupo (se desactivó o
 *     se borró). El banner desaparece, que es la otra mitad del pedido.
 *
 *  Una sola petición por pestaña, compartida: la caché guarda también la
 *  promesa EN VUELO, así que el widget y el checkout montándose a la vez no
 *  disparan dos llamadas. Mismo patrón que `use-catalogo.ts`. */
let cache: DescuentoGrupo | null | undefined
let enVuelo: Promise<DescuentoGrupo | null> | null = null

function pedir(): Promise<DescuentoGrupo | null> {
  return obtenerConfig().then((config) => {
    const grupo = (config.discounts ?? []).find((d) => d.kind === 'group')
    // Sin `min_pax` la regla no dice desde cuándo aplica: se trata como si no
    // estuviera, en vez de inventarle un umbral.
    if (!grupo || !grupo.min_pax) return null
    return { desdePersonas: grupo.min_pax, porcentaje: grupo.pct ?? null }
  })
}

export function useDescuentoGrupo(): DescuentoGrupo | null | undefined {
  const [regla, setRegla] = useState<DescuentoGrupo | null | undefined>(cache)

  useEffect(() => {
    if (cache !== undefined) {
      setRegla(cache)
      return
    }
    let vivo = true
    enVuelo ??= pedir()
    enVuelo
      .then((r) => {
        cache = r
        if (vivo) setRegla(r)
      })
      .catch(() => {
        // Odoo no contesta: se deja el respaldo. Quitar el banner porque falló
        // una petición sería esconder un descuento que sí existe.
        enVuelo = null
        if (vivo) setRegla(DESCUENTO_GRUPO)
      })
    return () => {
      vivo = false
    }
  }, [])

  return regla
}
