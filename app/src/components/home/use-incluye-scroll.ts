import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Todo lo que se mueve en la sección «Incluye» (rediseño v3-F19.2, pedido de
// Samuel), enganchado al scroll con scrub — la sección entera responde a la
// rueda y no se mueve sola:
//   · EL AGUA avanza: el playhead del video se mapea al recorrido de la sección
//     (Samuel 2026-07-16, sustituye al autoplay en bucle). Si nadie scrollea, el
//     agua está congelada. El video en sí va FIJO a la ventana con `position:
//     sticky` desde CSS — el pin NO se hace aquí, con scrub iría con retraso.
//   · EL BARCO baja por el centro (empieza fuera del océano, por encima) —
//     «el barco baja con nosotros», NO sticky/pin.
//   · CADA ÍTEM aparece (fade + subida) al entrar.
//
// ⚠️ Las constantes salen de TOKENS (tokens.css, bloque «Incluye»), no van "a
// ojo": son la FUENTE del prototipo de Figma (mismo trato que --ticker-* /
// --exp-* , playbook animaciones-a-figma). A Figma NO viaja animado — se
// captura la sección asentada (ver ?dev-incluye=estatico).
//
// SOLO DESKTOP (lg+): en móvil el barco es la pieza de apertura (estático,
// arriba) y los ítems van en lista — el «down-the-middle» no cabe en una
// columna estrecha. El hook no engancha nada por debajo de 1024px.

export function useIncluyeScroll(
  sectionRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  // useLayoutEffect: el estado inicial de `.from()` (ítems ocultos) se pinta
  // ANTES del primer paint → sin flash de los ítems visibles que luego se
  // esconden.
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // El translate del barco (componentes.css) convierte la fracción --barco-y
    // a px con --incluye-alto-px: hay que mantenerlo sincronizado con el alto
    // real de la sección (cambia con el ancho de ventana). Se mide SIEMPRE —
    // también en estático/reduced-motion, donde no hay scroll pero el barco
    // igual usa este valor para colocarse (--barco-y inline). Fuera del gate.
    const setAlto = () => section.style.setProperty('--incluye-alto-px', `${section.offsetHeight}px`)
    setAlto()
    const ro = new ResizeObserver(setAlto)
    ro.observe(section)

    // El descenso + reveals son decoración enganchada al scroll: solo desktop,
    // con movimiento permitido y sin el flag estático (frame de Figma). Si no,
    // se sale dejando solo el ResizeObserver (la sección se ve asentada).
    const enganchar =
      activo &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(min-width: 1024px)').matches
    if (!enganchar) return () => ro.disconnect()

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const desde = tokenNum(cs, '--incluye-barco-desde', -0.15)
    const hasta = tokenNum(cs, '--incluye-barco-hasta', 1.05)
    const scrubBarco = tokenNum(cs, '--incluye-barco-scrub', 0.5)
    const scrubVideo = tokenNum(cs, '--incluye-video-scrub', 0.3)
    const tramoVideo = tokenNum(cs, '--incluye-video-tramo', 1)
    const itemY = tokenAPx(cs, '--incluye-item-y', rootPx, 24)
    const scrubItem = tokenNum(cs, '--incluye-item-scrub', 0.5)

    // EL AGUA AVANZA CON EL SCROLL (pedido de Samuel 2026-07-16): el video no se
    // reproduce solo — su playhead se mapea al recorrido de la sección. Si nadie
    // scrollea, el agua está congelada; y no hay reinicio que disimular (por eso
    // el asset no es un loop: al subir el scroll, el scrub lo reproduce hacia
    // atrás gratis).
    //
    // El rango es EL DEL STICKY del video ('top top' → 'bottom bottom', ver
    // componentes.css): exactamente el tramo en que el agua está fija en la
    // ventana, así el playhead 0→duración cuadra con el scroll que hay que hacer
    // para cruzar la sección.
    //
    // El PIN no se hace aquí: lo hace `position: sticky` en CSS. Con scrub iría
    // con retraso y asomaría el navy de la sección por detrás.
    //
    // Se carga aquí y no en el JSX (preload="none") para que el video solo se
    // descargue cuando de verdad se va a enganchar: en móvil, con reduced-motion
    // o en el frame de Figma, el <video> se queda en su poster y no baja los 7MB.
    const video = section.querySelector<HTMLVideoElement>('video')
    let objetivo = 0
    let buscando = false

    // ⚠️ NO se escribe currentTime en cada frame, aunque sea lo obvio: buscar en
    // un <video> tarda ~14ms (medido), y escribir currentTime mientras hay una
    // búsqueda en vuelo la ABORTA y empieza otra. A 60fps eso es inanición pura
    // — ninguna llega a completarse mientras arrastras, y el video parece
    // congelado hasta que sueltas y por fin termina la última (justo el fallo
    // que reportó Samuel 2026-07-16: "si deslizo el scrollbar el video ni se
    // mueve, actualiza cuando me paro").
    //
    // Así que el scroll solo APUNTA el objetivo y aquí se busca de una en una,
    // encadenando: al terminar una búsqueda se lanza la siguiente hacia el
    // objetivo más reciente. El video va siempre al día sin ahogarse, y el ritmo
    // lo marca lo que el decodificador puede dar (~72 búsquedas/s > 60fps).
    const buscar = () => {
      if (!video || buscando) return
      if (video.readyState < 1 || !Number.isFinite(video.duration)) return
      // --incluye-video-tramo acota qué porción del video cubre la sección: es
      // el dial de velocidad del agua (ver tokens.css).
      const t = objetivo * video.duration * tramoVideo
      // menos de medio frame de diferencia no se vería: no gastar una búsqueda
      if (Math.abs(video.currentTime - t) < 1 / 48) return
      buscando = true
      video.currentTime = t
    }
    const alBuscar = () => {
      buscando = false
      buscar() // encadena hacia donde esté el objetivo AHORA
    }
    video?.addEventListener('seeked', alBuscar)

    const ctx = gsap.context(() => {
      if (video) {
        video.preload = 'auto'
        video.load()
        const cabeza = { t: 0 }
        gsap.to(cabeza, {
          t: 1,
          ease: 'none', // el scroll ES la curva
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: scrubVideo,
            invalidateOnRefresh: true,
          },
          // Solo se APUNTA el objetivo; quien decide cuándo buscar es buscar().
          onUpdate: () => {
            objetivo = cabeza.t
            buscar()
          },
        })
      }

      const barco = section.querySelector<HTMLElement>('.incluye-barco')
      if (barco) {
        gsap.fromTo(
          barco,
          { '--barco-y': desde },
          {
            '--barco-y': hasta,
            ease: 'none', // el scroll ES la curva
            scrollTrigger: {
              trigger: section,
              start: 'top bottom', // entra cuando el borde superior toca el fondo de la pantalla
              end: 'bottom top', // sale cuando el borde inferior toca el techo
              scrub: scrubBarco,
              invalidateOnRefresh: true,
              onRefresh: setAlto,
            },
          },
        )
      }

      // Cada ítem: fade + subida al entrar, enganchado al scroll (scrub corto)
      // → aparece "tal como el barco pasa por su altura". El estado FINAL
      // (visible, sin desplazamiento) es el natural del JSX; GSAP solo pinta el
      // inicial y lo interpola.
      const items = gsap.utils.toArray<HTMLElement>('.incluye-item', section)
      for (const el of items) {
        gsap.from(el, {
          autoAlpha: 0,
          y: itemY,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 60%',
            scrub: scrubItem,
          },
        })
      }
    }, section)

    return () => {
      ro.disconnect()
      video?.removeEventListener('seeked', alBuscar)
      ctx.revert()
    }
  }, [sectionRef, activo])
}
