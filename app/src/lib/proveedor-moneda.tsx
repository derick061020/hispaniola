import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cargaTasas, escuchaMoneda, monedaActiva } from '@/lib/moneda'

/** Repinta el sitio entero cuando cambia la moneda.
 *
 *  Es el hermano de `ProveedorIdioma` y por el mismo motivo, que está contado
 *  largo allí: `formatoDinero()` no es un hook, se llama desde 25 ficheros y
 *  ninguno está suscrito a nada. Un re-render normal dejaría los precios que
 *  ya viven dentro de un `useMemo` o de un `useState` inicializado con el
 *  texto formateado, y la página saldría con la mitad de los importes en la
 *  moneda anterior — que es peor que no convertir.
 *
 *  Remontar es caro, pero ocurre cuando alguien pulsa el selector, no en cada
 *  scroll. Y hay que devolver a su sitio las dos cosas de siempre: el scroll
 *  (al desmontar el documento se queda sin alto y el navegador salta arriba) y
 *  ScrollTrigger (sus posiciones son píxeles calculados al crearse). */
export function ProveedorMoneda({ children }: { children: ReactNode }) {
  const scroll = useRef(0)
  const primeraVez = useRef(true)

  // El cambio del día se pide una vez al arrancar. Si falla, el sitio se queda
  // en dólares sin decir nada: una divisa caída no es un error del visitante.
  useEffect(() => {
    void cargaTasas()
  }, [])

  const suscribe = useCallback(
    (avisa: () => void) =>
      escuchaMoneda(() => {
        scroll.current = window.scrollY
        avisa()
      }),
    [],
  )

  const moneda = useSyncExternalStore(suscribe, monedaActiva, () => 'USD' as const)

  useLayoutEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false
      return
    }
    window.scrollTo(0, scroll.current)
    ScrollTrigger.refresh()
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => window.clearTimeout(id)
  }, [moneda])

  return <Fragment key={moneda}>{children}</Fragment>
}
