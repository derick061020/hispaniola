import { useEffect, useRef } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Declaración de misión — el bloque que ABRE el contenido de la página (el
// copy largo que en su día se recortó del hero, ver data/sostenibilidad.ts
// §mision). Vivía dentro de PilaresSostenibilidad como un párrafo grande a
// todo el ancho; sale a componente propio el 2026-07-22 (Samuel: "el texto
// que está al principio en grande redúcele un poco el tamaño y a la derecha
// agrégale un video") porque ya no es "el encabezado de los pilares" sino una
// pieza de dos columnas con su propia media.
//
// Dos cambios que van juntos y no por separado: el texto baja de
// --text-narrativa (32px) a --text-sost-mision (26px) PORQUE ahora comparte
// fila con el video — a 32px en una columna de 7/12 la medida se iba a ~28
// caracteres por línea. Reducir sin el video, o meter el video sin reducir,
// habría dejado la sección peor que antes.
//
// El video es el del hero de la home (/video/hero.mp4): el catamarán sobre el
// arrecife, 3.8MB — el más liviano de los tres del proyecto y, para quien
// llega desde la home, ya cacheado. Alternativa si se quiere algo menos
// reconocible: /video/incluye-oceano-cenital.mp4 (cenital del arrecife, pero
// 10.3MB). Con las fotos propias de la fundación pendientes (PLAN-v3.md §9),
// esto es material real del cliente, no stock.
export function IntroSostenibilidad() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // preload="none" + carga por IntersectionObserver: mismo criterio que el
  // agua del "Incluye" (use-incluye-scroll.ts) — este video vive BAJO el
  // pliegue, así que no se descargan 3.8MB compitiendo con el hero y los 7
  // pósters de la sección de videos por el ancho de banda de la primera
  // pantalla. Con prefers-reduced-motion se queda en el póster y no descarga
  // nada: el frame quieto ya cuenta lo mismo.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return
        if (entrada.isIntersecting) {
          if (video.preload === 'none') {
            video.preload = 'auto'
            video.load()
          }
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.misionEyebrow}</Etiqueta>
        {/* text-pretty y no text-balance (que es lo que tenía a todo ancho):
            balance reparte líneas parejas y está pensado para titulares de
            2-3 líneas — en una columna estrecha con 5 renglones el navegador
            lo ignora a partir del límite y, donde lo aplica, deja la medida
            irregular. pretty solo evita el huérfano final, que es el defecto
            real de un párrafo en columna. */}
        <p className="sost-reveal mt-4 text-pretty font-display text-sost-mision-movil font-medium text-navy sm:text-sost-mision">
          {SOSTENIBILIDAD.mision}
        </p>
      </div>

      <div className="sost-reveal lg:col-span-5">
        {/* rounded-card en el propio <video> además del contenedor: misma
            trampa que documenta el hero de la home — el vídeo es un elemento
            reemplazado con capa de composición propia y varios navegadores
            ignoran el overflow-hidden del ancestro, asomando cuadrado por las
            esquinas. */}
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-card object-cover"
          poster="/fotos/hero-video-poster.webp"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
