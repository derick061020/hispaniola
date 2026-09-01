import { useEffect, useRef, type RefObject } from 'react'

/** Retrasa la descarga de un vídeo hasta que de verdad hace falta.
 *
 *  [2026-09-01] Derick: «revisa el tiempo de carga de la web, no me está
 *  pasando las pruebas de velocidad».
 *
 *  Medido contra el sitio publicado, en móvil: la home descargaba **6,2 MB**,
 *  de los cuales **26 MB de vídeo pedido** entre los dos reproductores. `autoPlay`
 *  hace que el navegador se traiga el fichero ENTERO aunque el elemento diga
 *  `preload="metadata"`: el atributo solo manda mientras nadie pide reproducir.
 *
 *  Y el peor era el de la presentadora —8,9 MB, minuto y medio— que vive MUY por
 *  debajo del pliegue. Una prueba de velocidad nunca llega hasta él; solo paga
 *  su descarga.
 *
 *  Dos momentos, según dónde esté el vídeo:
 *
 *    'tras-carga' — para el del hero, que sí se ve de entrada. El vídeo entra
 *      cuando la página ya ha pintado, así que deja de competir por el ancho de
 *      banda con lo que decide la nota (el LCP). Hasta entonces se ve su
 *      `poster`, que pesa 48 KB.
 *
 *    'visible'    — para todo lo que está más abajo. No se descarga hasta que
 *      asoma por la pantalla.
 *
 *  El `src` NO va en el JSX: si estuviera, el navegador empezaría a bajarlo
 *  antes de que este hook pueda decir nada. Se pone aquí, y por eso hace falta.
 */
export function useVideoDiferido(
  ref: RefObject<HTMLVideoElement | null>,
  src: string,
  cuando: 'visible' | 'tras-carga' = 'visible',
) {
  const puesto = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video || puesto.current) return

    const pon = () => {
      if (puesto.current || !ref.current) return
      puesto.current = true
      ref.current.src = src
      // `autoPlay` ya no dispara solo: el elemento nació sin `src`. Se pide la
      // reproducción a mano y se ignora el rechazo — algunos navegadores la
      // niegan si el usuario no ha interactuado, y entonces se queda el poster,
      // que es exactamente lo que debe pasar.
      if (ref.current.autoplay) {
        void ref.current.play().catch(() => {})
      }
    }

    if (cuando === 'tras-carga') {
      if (document.readyState === 'complete') {
        // Un respiro tras el load: que el hilo principal termine lo suyo antes
        // de arrancar una descarga de megas.
        const t = window.setTimeout(pon, 300)
        return () => window.clearTimeout(t)
      }
      const alCargar = () => window.setTimeout(pon, 300)
      window.addEventListener('load', alCargar, { once: true })
      return () => window.removeEventListener('load', alCargar)
    }

    // 'visible': 200px antes de asomar, para que llegue con algo de margen.
    //
    // ⚠️ No basta con `isIntersecting`. El bloque de la experiencia va PINEADO
    // con GSAP, y al montarse la sección pasa un instante por posición fija:
    // el observador lo daba por visible y se bajaban los 5,5 MB sin que nadie
    // hubiera bajado la página (medido: el vídeo estaba a 2.136 px del borde,
    // con una ventana de 844, y se pedía igual a los 669 ms).
    //
    // Asi que se confirma con la posición REAL antes de descargar. Un
    // rectángulo no miente aunque el observador se despiste.
    const cerca = () => {
      const el = ref.current
      if (!el) return false
      const r = el.getBoundingClientRect()
      const alto = window.innerHeight || 0
      return r.top < alto + 200 && r.bottom > -200
    }

    const revisa = () => {
      if (cerca()) {
        pon()
        limpia()
      }
    }

    const observador = new IntersectionObserver(revisa, { rootMargin: '200px' })
    observador.observe(video)
    // El scroll es la red por si el observador no llega a disparar (pasa cuando
    // GSAP mueve el elemento sin que cambie su interseccion).
    window.addEventListener('scroll', revisa, { passive: true })
    const limpia = () => {
      observador.disconnect()
      window.removeEventListener('scroll', revisa)
    }
    return limpia
  }, [ref, src, cuando])
}
