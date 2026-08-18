import { useEffect, useState } from 'react'
import { cotizar, type PeticionCotizacion } from '@/lib/api/api'

// [2026-08-18] EL PRECIO DE LA FICHA TAMBIÉN LO PONE ODOO.
//
// Hasta hoy había DOS motores de precio: la ficha calculaba con
// `calcularTotalTour()` en el navegador y el checkout pedía el suyo a Odoo. Con
// eso, el número que convence en la ficha y el que se cobra en el checkout no
// tenían por qué coincidir, y el desvío que el README marcaba en rojo podía
// volver por la puerta de atrás en cuanto el catálogo de Odoo se moviera un
// dólar respecto a `data/tours.ts`.
//
// El motor local NO se borra: es lo que se pinta mientras la respuesta viaja y
// lo que sostiene la ficha si Odoo no contesta. Una ficha sin precio no vende
// nada, así que la caída se degrada al cálculo de siempre en vez de dejar un
// hueco — pero en cuanto Odoo contesta, manda Odoo.
//
// El debounce es de 400 ms porque el stepper de personas dispara un cambio por
// clic: sin él, subir de 2 a 30 personas en el charter son 28 peticiones.

const ESPERA_MS = 400

export type Cotizacion = {
  /** Total con add-ons incluidos. `null` = todavía manda el cálculo local. */
  total: number | null
  deposito: number | null
  cargando: boolean
}

export function useCotizacion(peticion: PeticionCotizacion | null): Cotizacion {
  const [estado, setEstado] = useState<Cotizacion>({
    total: null, deposito: null, cargando: false,
  })

  // La petición se serializa para comparar por VALOR: el objeto se construye
  // en cada render del widget y usarlo como dependencia dispararía un efecto
  // por render.
  const clave = peticion ? JSON.stringify(peticion) : null

  useEffect(() => {
    if (!clave) {
      setEstado({ total: null, deposito: null, cargando: false })
      return
    }
    const abortador = new AbortController()
    setEstado((s) => ({ ...s, cargando: true }))

    const temporizador = setTimeout(() => {
      cotizar(JSON.parse(clave) as PeticionCotizacion, abortador.signal)
        .then((c) => {
          setEstado({ total: c.total, deposito: c.deposit, cargando: false })
        })
        .catch((error: unknown) => {
          if ((error as Error)?.name === 'AbortError') return
          // Se vuelve al cálculo local en silencio: el visitante no tiene que
          // enterarse de que el servidor de precios está caído, tiene que ver
          // un precio. El que se cobra de verdad lo confirma el checkout.
          setEstado({ total: null, deposito: null, cargando: false })
        })
    }, ESPERA_MS)

    return () => {
      clearTimeout(temporizador)
      abortador.abort()
    }
  }, [clave])

  return estado
}
