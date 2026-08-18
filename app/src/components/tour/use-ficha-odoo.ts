import { useEffect, useState } from 'react'
import { obtenerTour } from '@/lib/api/api'
import type { Tour as TourOdoo } from '@/lib/api/tipos'

/** [2026-08-18] El tour tal y como lo publica Odoo (precios, tramos, aforo,
 *  horarios y add-ons). `null` mientras carga o si el servidor no contesta —
 *  y en ese caso la ficha se pinta con sus datos estáticos, que es lo que
 *  decide `fusionarFicha`.
 *
 *  Es una llamada por ficha y se cachea en memoria: entrar y salir de un tour
 *  no vuelve a preguntar. La caché muere con la pestaña, así que un cambio de
 *  precio en Odoo se ve en la siguiente visita, no hace falta desplegar. */
const cache = new Map<string, TourOdoo>()

export function useFichaOdoo(slug: string | undefined): TourOdoo | null {
  const [tour, setTour] = useState<TourOdoo | null>(() => (slug ? (cache.get(slug) ?? null) : null))

  useEffect(() => {
    if (!slug) {
      setTour(null)
      return
    }
    const enCache = cache.get(slug)
    if (enCache) {
      setTour(enCache)
      return
    }
    const abortador = new AbortController()
    obtenerTour(slug, abortador.signal)
      .then((datos) => {
        cache.set(slug, datos)
        setTour(datos)
      })
      .catch((error: unknown) => {
        if ((error as Error)?.name === 'AbortError') return
        // Silencio a propósito: la ficha ya sabe pintarse sin Odoo.
        setTour(null)
      })
    return () => abortador.abort()
  }, [slug])

  return tour
}
