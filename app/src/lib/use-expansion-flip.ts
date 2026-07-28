import { useCallback, useState } from 'react'
import gsap from 'gsap'

// Expansión tipo «shared element» para lightboxes (correcciones v2,
// 2026-07-28 — pedido de Samuel: «que el elemento que toque tenga una
// animación y sea que se mueve y se pone expandido, no como que aparezca un
// elemento duplicado»).
//
// TÉCNICA: FLIP (First · Last · Invert · Play).
//   1. FIRST — al pulsar, se mide el rectángulo del elemento de origen
//      (la celda del mosaico, la card del reel…).
//   2. LAST  — el lightbox monta su media ya en su posición final.
//   3. INVERT— se le aplica al vuelo la transformada que lo devuelve
//      EXACTAMENTE encima del origen (escala + desplazamiento).
//   4. PLAY  — se anima esa transformada hasta la identidad.
// El resultado es que el elemento parece despegar de donde estaba en vez de
// aparecer de la nada en el centro.
//
// POR QUÉ FLIP Y NO ANIMAR width/height: animar caja obliga al navegador a
// recalcular layout en cada fotograma (reflow) y en una foto grande eso se
// nota. `transform` y `opacity` viven en el compositor — mismo criterio que
// el resto de animaciones del proyecto.
//
// POR QUÉ NO `View Transitions API`: hoy no la soporta Safari de forma
// estable, y este sitio es turismo — la mitad del tráfico es iPhone. Un
// efecto que se cae justo en la mitad del público no es un efecto.
//
// Al CERRAR se invierte el camino: vuelve al rectángulo de origen. Si el
// origen ya no está en pantalla (el usuario hizo scroll con el lightbox
// abierto), se hace un fundido normal — devolverlo a un sitio que no se ve
// haría que la imagen «huyera» hacia un punto arbitrario.

export type RectOrigen = { top: number; left: number; width: number; height: number }

/** Mide un elemento para usarlo como origen de la expansión. */
export function medirOrigen(el: HTMLElement | null): RectOrigen | null {
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

const DURACION_ENTRADA = 0.42
const EASE_ENTRADA = 'power3.out'

/**
 * Devuelve un CALLBACK REF para el nodo de media del visor. Al adjuntarse el
 * nodo, arranca la expansión desde `origen`.
 *
 * ⚠️ ES UN CALLBACK REF Y NO UN `useEffect` SOBRE UN RefObject, Y ESO IMPORTA:
 * el contenido del lightbox vive en un PORTAL de Radix, que lo monta un tick
 * DESPUÉS de que corran los efectos del componente. Con la primera versión
 * (useEffect + ref.current) el efecto encontraba siempre `null` y la animación
 * no ocurría nunca — verificado instrumentando el hook, salía «SIN NODO» en
 * cada apertura. Un callback ref se ejecuta EXACTAMENTE cuando React adjunta
 * el nodo, así que no hay carrera que perder.
 */
export function useExpansionFlip(origen: RectOrigen | null) {
  return useCallback(
    (el: HTMLElement | null) => {
      if (!el) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Sin origen (o con reduced-motion) no hay FLIP: fundido corto y ya.
      if (!origen || reduce) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.2 })
        return
      }

      const lanzar = () => {
        // ⚠️ DOS GUARDAS QUE PARECEN PARANOIA Y NO LO SON:
        //
        // 1. Solo una vez por nodo. Un callback ref puede volver a dispararse
        //    si el componente re-renderiza, y una segunda pasada mediría el
        //    elemento CON la transformada de la primera todavía puesta.
        // 2. Limpiar la transformada ANTES de medir. `getBoundingClientRect()`
        //    devuelve la caja YA TRANSFORMADA, así que medir a media animación
        //    da un destino casi idéntico al origen → escala ≈ 1 y la expansión
        //    se convierte en un desplazamiento de 3px.
        //
        // Esto no es teórico: fue exactamente el fallo de la primera versión.
        // Verificado grabando el `transform` fotograma a fotograma, salía
        // `matrix(1, 0, 0, 1, -5.3, 3.3)` — sin escala y sin recorrido.
        if (el.dataset.flipHecho === '1') return
        gsap.set(el, { clearProps: 'transform,clipPath' })
        const destino = el.getBoundingClientRect()
        // Sin tamaño no se puede calcular la transformada; se espera al load.
        if (destino.width === 0 || destino.height === 0) return
        el.dataset.flipHecho = '1'

        // INVERT: la transformada que lleva el destino encima del origen.
        // ESCALA UNIFORME, no una por eje. Escalar X e Y por separado encaja
        // el destino en la caja del origen al píxel, pero DEFORMA cuando las
        // proporciones no coinciden — y aquí casi nunca coinciden: la celda
        // del mosaico es apaisada, el visor muestra la foto entera; el mini
        // player es 9:16 y el video puede ser 16:9. Samuel lo describió como
        // «al expandir se pone enorme en horizontal y se ve raro»: eso era el
        // estirón de un fotograma vertical hacia una caja apaisada.
        //
        // Se usa el MAYOR de los dos factores a propósito: así el elemento
        // arranca CUBRIENDO la caja de origen (como hacía el `object-cover`
        // de la miniatura) en vez de quedarse dentro con aire alrededor. La
        // lectura es «esto ya estaba ahí, recortado, y ahora se abre».
        const escala = Math.max(origen.width / destino.width, origen.height / destino.height)
        const dx = origen.left + origen.width / 2 - (destino.left + destino.width / 2)
        const dy = origen.top + origen.height / 2 - (destino.top + destino.height / 2)

        // RECORTE ANIMADO — la mitad que faltaba, y la que hacía que la
        // expansión se viera «rara» cuando origen y destino no comparten
        // proporción.
        //
        // La escala `max` hace que el elemento CUBRA la caja de origen, pero
        // cubrir significa que lo que sobra ASOMA por fuera de ella. Medido con
        // el video: celda de 198×352 (9:16) y archivo de 1600×900 (16:9) → la
        // escala sale 0.698 y el video arranca midiendo 625×352 encima de una
        // celda de 198px de ancho. Desde el primer fotograma sobresalía más del
        // triple por los lados: no parecía que la celda se abriera, parecía que
        // aparecía otro elemento distinto y luego se acomodaba.
        //
        // En la celda ese sobrante NO se ve, porque la miniatura lo recorta con
        // `object-cover`. Así que la animación replica ese recorte: arranca
        // ocultando exactamente lo mismo que ocultaba la celda y lo va abriendo
        // hasta enseñar el fotograma entero. Eso es lo que convierte el efecto
        // en «la celda crece» en vez de «algo aparece encima».
        //
        // Los insets van en coordenadas LOCALES del elemento (clip-path se
        // aplica antes que transform), de ahí el /escala.
        const recorteX = Math.max(0, (destino.width - origen.width / escala) / 2)
        const recorteY = Math.max(0, (destino.height - origen.height / escala) / 2)
        // El radio se lee del propio elemento para que el recorte tenga las
        // mismas esquinas redondeadas que la caja; si no, durante el vuelo se
        // verían esquinas en pico sobre una celda redondeada.
        const radio = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
        const clipInicial = `inset(${recorteY}px ${recorteX}px round ${radio}px)`
        const clipFinal = `inset(0px 0px round ${radio}px)`

        gsap.fromTo(
          el,
          { x: dx, y: dy, scale: escala, opacity: 0.65, clipPath: clipInicial },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            clipPath: clipFinal,
            duration: DURACION_ENTRADA,
            ease: EASE_ENTRADA,
            // Se limpia al terminar: una transformada convierte al nodo en
            // containing block de sus descendientes `fixed`, y un `clip-path`
            // residual —aunque sea `inset(0)`— recorta lo que asome (los
            // controles nativos del video se pintan dentro de la caja, pero
            // no hay razón para dejar puesto un recorte que ya no recorta).
            onComplete: () => gsap.set(el, { clearProps: 'transform,clipPath' }),
          },
        )
      }

      const media = el as HTMLImageElement & HTMLVideoElement
      const esImg = media.tagName === 'IMG'
      const esVideo = media.tagName === 'VIDEO'
      const listo = (esImg && media.complete) || (esVideo && media.readyState >= 1) || (!esImg && !esVideo)

      if (listo) {
        lanzar()
        return
      }
      // Oculto mientras carga: si asomara en su sitio final antes de empezar,
      // sería justo el «aparece de la nada» que esto viene a evitar.
      gsap.set(el, { opacity: 0 })
      media.addEventListener(esVideo ? 'loadedmetadata' : 'load', lanzar, { once: true })
      media.addEventListener('error', () => gsap.set(el, { opacity: 1 }), { once: true })
    },
    [origen],
  )
}

/**
 * Estado del origen + helpers, para que cada consumidor no repita el
 * `useState` y la medición.
 */
export function useOrigenExpansion() {
  const [origen, setOrigen] = useState<RectOrigen | null>(null)

  const abrirDesde = useCallback((el: HTMLElement | null) => {
    setOrigen(medirOrigen(el))
  }, [])

  const limpiar = useCallback(() => setOrigen(null), [])

  return { origen, abrirDesde, limpiar }
}
