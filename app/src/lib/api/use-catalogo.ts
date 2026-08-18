import { useEffect, useState } from 'react'
import { obtenerCatalogo } from '@/lib/api/api'
import type { Tour as TourOdoo } from '@/lib/api/tipos'

/** [2026-08-18] EL CATÁLOGO PUBLICADO, TAL Y COMO LO VE ODOO.
 *
 *  Lo usan las tarjetas de tours (home, menú móvil y pie) para dos cosas: no
 *  anunciar un tour que el equipo ha despublicado, y enseñar el «desde US$»
 *  real en vez del que quedó escrito en `data/home.ts`.
 *
 *  Una sola petición por pestaña, compartida por todos los componentes que
 *  pregunten: la caché guarda también la promesa EN VUELO, así que tres
 *  tarjetas montándose a la vez no disparan tres llamadas.
 *
 *  `null` mientras carga o si Odoo no contesta. En ese caso se pinta la lista
 *  estática entera — una home sin tours no vende nada, y el precio de verdad
 *  lo pone el servidor en el checkout de todas formas. */
let cache: TourOdoo[] | null = null
let enVuelo: Promise<TourOdoo[]> | null = null

export function useCatalogo(): TourOdoo[] | null {
  const [catalogo, setCatalogo] = useState<TourOdoo[] | null>(cache)

  useEffect(() => {
    if (cache) {
      setCatalogo(cache)
      return
    }
    let vivo = true
    enVuelo ??= obtenerCatalogo()
    enVuelo
      .then((tours) => {
        cache = tours
        if (vivo) setCatalogo(tours)
      })
      .catch(() => {
        // Silencio a propósito: quien llama ya sabe pintarse sin catálogo.
        enVuelo = null
        if (vivo) setCatalogo(null)
      })
    return () => {
      vivo = false
    }
  }, [])

  return catalogo
}
