import { useEffect, useState } from 'react'
import { obtenerConfig } from '@/lib/api/api'
import {
  DESCUENTO_GRUPO,
  TOURS_CON_DESCUENTO_GRUPO,
  type DescuentoGrupo,
} from '@/lib/tarifas'

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
 *  [2026-09-07] Y AHORA SE PREGUNTA POR TOUR. Derick: «los group discount son
 *  solo para los compartidos, o sea Coral Quest y Caribbean en la web,
 *  porfavor, quitalo en el resto». En Odoo la oferta pasó de «todos los tours»
 *  a esos dos, así que la pregunta «¿hay descuento de grupo?» ya no tiene una
 *  sola respuesta para todo el sitio: se hace con el slug del tour que se está
 *  mirando (`/config?tour=…`) y en el charter o en Saona contesta `null`.
 *
 *  Una sola petición por tour y pestaña, compartida: la caché guarda también la
 *  promesa EN VUELO, así que el widget y el checkout montándose a la vez no
 *  disparan dos llamadas. Mismo patrón que `use-catalogo.ts`. */
const cache = new Map<string, DescuentoGrupo | null>()
const enVuelo = new Map<string, Promise<DescuentoGrupo | null>>()

function pedir(slug: string): Promise<DescuentoGrupo | null> {
  return obtenerConfig(undefined, slug || null).then((config) => {
    const grupo = (config.discounts ?? []).find((d) => d.kind === 'group')
    // Sin `min_pax` la regla no dice desde cuándo aplica: se trata como si no
    // estuviera, en vez de inventarle un umbral.
    if (!grupo || !grupo.min_pax) return null
    return { desdePersonas: grupo.min_pax, porcentaje: grupo.pct ?? null }
  })
}

/** El respaldo cuando Odoo no contesta. NO es el mismo para todos los tours:
 *  ver `TOURS_CON_DESCUENTO_GRUPO`. Sin slug —nadie debería llamar así, pero
 *  el parámetro es opcional— se responde que no hay, porque anunciar el
 *  descuento sin saber en qué tour es exactamente lo que se acaba de quitar. */
function respaldo(slug: string): DescuentoGrupo | null {
  return TOURS_CON_DESCUENTO_GRUPO.includes(slug) ? DESCUENTO_GRUPO : null
}

export function useDescuentoGrupo(slug?: string): DescuentoGrupo | null | undefined {
  const clave = slug ?? ''
  const [regla, setRegla] = useState<DescuentoGrupo | null | undefined>(() =>
    cache.has(clave) ? cache.get(clave) : undefined,
  )

  useEffect(() => {
    if (cache.has(clave)) {
      setRegla(cache.get(clave))
      return
    }
    let vivo = true
    let promesa = enVuelo.get(clave)
    if (!promesa) {
      promesa = pedir(clave)
      enVuelo.set(clave, promesa)
    }
    promesa
      .then((r) => {
        cache.set(clave, r)
        if (vivo) setRegla(r)
      })
      .catch(() => {
        // Odoo no contesta: se deja el respaldo de ESE tour. Quitar el banner
        // porque falló una petición sería esconder un descuento que sí existe;
        // pintarlo donde ya no lo hay sería prometer lo que no se cobra.
        enVuelo.delete(clave)
        if (vivo) setRegla(respaldo(clave))
      })
    return () => {
      vivo = false
    }
  }, [clave])

  return regla
}
