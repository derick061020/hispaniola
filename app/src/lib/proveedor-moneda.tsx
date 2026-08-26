import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
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

  // [2026-08-26] EN EL CHECKOUT NO SE REMONTA.
  //
  // Desde hoy la moneda también se puede cambiar dentro del funnel de pago, y
  // remontar allí sería peor que no convertir: el formulario vive en `useState`
  // —fecha, personas, plato de cada comensal, contacto— y volvería a empezar de
  // cero a media reserva. La página del checkout se suscribe ella misma a la
  // moneda (ver `pages/reservar.tsx`) y ninguno de sus importes está memoizado,
  // así que con repintarse le basta. El resto del sitio sí necesita el remonte,
  // que es de lo que va este proveedor.
  const enCheckout = /^\/(book|reservar)\//.test(useLocation().pathname)
  const clave = enCheckout ? 'checkout' : moneda

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

  return <Fragment key={clave}>{children}</Fragment>
}
