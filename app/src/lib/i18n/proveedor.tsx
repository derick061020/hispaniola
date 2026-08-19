import { Fragment, useCallback, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { escuchaIdioma, idiomaUI } from './nucleo'

/** Repinta el sitio entero cuando cambia el idioma.
 *
 *  ── POR QUÉ REMONTA EN VEZ DE RE-RENDERIZAR ──────────────────────────────
 *  `t()` es una función normal, no un hook: se llama desde cientos de sitios
 *  —componentes, pero también los datos envueltos de `data/*.ts`— y ninguno
 *  está suscrito a nada. Un re-render normal no bastaría: cualquier `useMemo`,
 *  `useState` inicializado con texto o efecto de GSAP que ya hubiera guardado
 *  una cadena en inglés se quedaría con ella, y la página saldría a medio
 *  traducir. Eso es peor que no traducir.
 *
 *  Cambiar la `key` desmonta y vuelve a montar TODO, así que no queda ni un
 *  resto del idioma anterior. Es caro —del orden de un cambio de página—, pero
 *  ocurre cuando alguien pulsa el selector, no en cada scroll.
 *
 *  Dos cosas hay que devolver a su sitio después del remonte:
 *
 *  * **El scroll.** Al desmontar, el documento se queda sin alto y el navegador
 *    salta arriba. Quien cambia de idioma leyendo el itinerario a media página
 *    espera seguir ahí, no volver al hero.
 *  * **ScrollTrigger.** Sus posiciones son píxeles absolutos calculados al
 *    crearse (ver `lib/refresca-scrolltrigger.ts`); tras el remonte los
 *    triggers son nuevos pero el alto del documento todavía está asentándose,
 *    y sin un refresco los efectos de scroll disparan donde no toca. */
export function ProveedorIdioma({ children }: { children: ReactNode }) {
  const scroll = useRef(0)
  const primeraVez = useRef(true)

  const suscribe = useCallback(
    (avisa: () => void) =>
      escuchaIdioma(() => {
        // Se anota ANTES de que React tire el árbol: después ya no hay altura
        // de documento de la que leer una posición válida.
        scroll.current = window.scrollY
        avisa()
      }),
    [],
  )

  const idioma = useSyncExternalStore(suscribe, idiomaUI, () => 'en' as const)

  useLayoutEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false
      return
    }
    window.scrollTo(0, scroll.current)
    // Dos vueltas: la inmediata endereza lo que ya está pintado, y la diferida
    // recoge las imágenes que entran justo después del remonte.
    ScrollTrigger.refresh()
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => window.clearTimeout(id)
  }, [idioma])

  return <Fragment key={idioma}>{children}</Fragment>
}
