import { useEffect, useState } from 'react'
import { obtenerDisponibilidad } from '@/lib/api/api'
import { hoyISO, sumarDias } from '@/lib/fechas'

// [2026-08-18] LOS DÍAS AGOTADOS SALEN DE ODOO.
//
// El calendario los inventaba: `[sumarDias(hoy, 3), sumarDias(hoy, 10)]`, dos
// fechas fijas e iguales para los cuatro tours. O sea que se podía bloquear un
// día libre —perdiendo la venta— y vender uno lleno, y el choque real solo
// aparecía al pagar, con un `409 sold_out` y la tarjeta ya puesta.
//
// `/availability` cruza las tres fuentes que hacen falta y que solo existen en
// Odoo: la ventana de reserva del tour, los bloqueos de venta que el equipo
// gestiona desde el back-office y el aforo ya vendido para ese barco.
//
// SI LA PETICIÓN FALLA NO SE BLOQUEA NADA. Es deliberado: con el backend caído,
// un calendario que marca todo agotado no vende nada, mientras que uno que deja
// elegir termina en el paso de pago —que sí comprueba el aforo de verdad, y ahí
// sí bloquea—. Mejor una reserva que el equipo confirma a mano que una venta
// que no llega a empezar.

const DIAS_VENTANA = 120

export type Disponibilidad = {
  /** Días sin plazas, en ISO. Vacío mientras carga o si Odoo no contesta. */
  agotados: Set<string>
  cargando: boolean
  /** false = no se pudo consultar. El calendario deja elegir igualmente. */
  consultada: boolean
  /**
   * El primer día que se puede reservar, tal y como lo dice Odoo.
   *
   * [2026-10-01, Rossanna: «no debiera la página dejarte reservar para el
   * mismo día, y menos para el tour de esta mañana, que obvio ya pasó»]
   *
   * A las 11:08 de la mañana la web vendía la salida de las 9:00 de ESE día.
   * Odoo no tenía la culpa: `/availability` respeta `min_days_ahead` y ya
   * devolvía los días DESDE MAÑANA. El fallo estaba aquí — el calendario solo
   * bloqueaba los días que la respuesta marcaba agotados, y los que la
   * respuesta NO MENCIONABA los daba por buenos. «No te lo ofrezco» se leía
   * como «está libre».
   */
  primerDia: string | null
}

export function useDisponibilidad(
  tour: string | null,
  variante?: string | null,
  pax?: number,
): Disponibilidad {
  const [estado, setEstado] = useState<Disponibilidad>({
    agotados: new Set(),
    cargando: !!tour,
    consultada: false,
    primerDia: null,
  })

  useEffect(() => {
    if (!tour) {
      setEstado({ agotados: new Set(), cargando: false, consultada: false, primerDia: null })
      return
    }
    const abortador = new AbortController()
    setEstado((s) => ({ ...s, cargando: true }))

    const desde = hoyISO()
    obtenerDisponibilidad(
      { tour, variante, desde, hasta: sumarDias(desde, DIAS_VENTANA), pax },
      abortador.signal,
    )
      .then((respuesta) => {
        setEstado({
          agotados: new Set(respuesta.days.filter((d) => !d.available).map((d) => d.date)),
          cargando: false,
          consultada: true,
          primerDia: respuesta.from || null,
        })
      })
      .catch((error: unknown) => {
        if ((error as Error)?.name === 'AbortError') return
        setEstado({ agotados: new Set(), cargando: false, consultada: false, primerDia: null })
      })

    return () => abortador.abort()
    // `pax` entra en las dependencias a propósito: subir el grupo puede dejar
    // sin sitio días que antes cabían.
  }, [tour, variante, pax])

  return estado
}
