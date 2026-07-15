import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useIncluyeScroll } from '@/components/home/use-incluye-scroll'
import { INCLUYE_CRUCERO } from '@/data/home'

// Sección «Incluye» (rediseño v3-F19.2, pedido de Samuel 2026-07-15) —
// editorial inmersiva, ref. "WHAT'S INCLUDED" que aportó Samuel. Cambia por
// completo la 1ª versión (cards con fondo blanco + fundidos): ahora es un
// océano oscuro a sangre (corte limpio, SIN fundidos), el catamarán en vista
// cenital BAJANDO por el centro al hacer scroll (empieza fuera del océano, por
// arriba) y los 8 ítems como texto numerado (01/ … 08/) directamente sobre el
// agua, sin cajas — en diagonal alternando lados, «cascando» junto al barco.
//
// El descenso del barco y el reveal de los ítems (enganchados al scroll, NO
// sticky) viven en use-incluye-scroll.ts. Solo desktop; en móvil el barco es
// la pieza de apertura (estático, arriba) y los 8 ítems van en lista.
//
// ⚠️ Assets PROVISIONALES, pendientes de generar en Magnific (no se usa stock,
// regla del proyecto — ver PLAN-v3.md §9):
//   · Fondo: el MISMO video del hero, oscurecido fuerte con --color-overlay-
//     incluye para que el texto blanco lea. El pedido es un océano CENITAL azul
//     Caribe; cuando llegue, se cambia el <source> y baja el overlay.
//   · Barco: catamaran-recorte.webp (vista 3/4). El pedido es un recorte
//     CENITAL (vista desde el dron, directamente arriba); cuando llegue, se
//     cambia el `src` (y su ratio, vía el token de alto).
export function IncluyeCrucero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // [dev-mode] ?dev-incluye=estatico congela la sección en su estado FINAL
  // (ítems visibles, barco a media sección) → frame limpio para Figma, sin
  // GSAP enganchado. ?dev-incluye=poster además pausa el video en su poster.
  const [estatico, setEstatico] = useState(false)
  const [forzarPoster, setForzarPoster] = useState(false)
  useDevFlag('dev-incluye', (v) => {
    if (v === 'estatico') setEstatico(true)
    if (v === 'poster') {
      setEstatico(true) // el frame de Figma va siempre asentado
      setForzarPoster(true)
    }
  })
  useIncluyeScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (forzarPoster || reducirMovimiento) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [forzarPoster, reducirMovimiento])

  return (
    // overflow-x-clip: el barco corre por el centro y podría asomar de lado en
    // pantallas justas; clip evita scroll horizontal sin crear scroll container.
    // A sangre (sin px del contenedor de página): el océano llega a los bordes.
    <section
      ref={sectionRef}
      id="incluye"
      className="relative overflow-x-clip bg-navy py-seccion-sm sm:py-seccion"
    >
      {/* Océano — capa que RECORTA la media (overflow hidden). El barco vive
          FUERA de esta capa para poder asomar por encima del océano al arrancar
          el descenso (mismo reparto media/contenido que el hero). */}
      <div className="incluye-oceano" aria-hidden="true">
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          poster="/fotos/hero-video-poster.webp"
          autoPlay={!reducirMovimiento && !forzarPoster}
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'var(--color-overlay-incluye)' }} />
      </div>

      {/* Título — en desktop acotado a la izquierda (max-w) para que NUNCA
          cruce el carril central por donde baja el barco; queda apilado y
          editorial, como el "WHAT'S / INCLUDED" de la referencia. */}
      <div className="relative z-10 mx-auto w-full max-w-contenido px-5 text-center sm:px-10 lg:text-left">
        <Etiqueta sobreOscuro>A bordo</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-white lg:max-w-sm">
          Todos nuestros cruceros incluyen
        </h2>
      </div>

      {/* Barco cenital — pieza de apertura en móvil (en el flujo, tras el
          título); en desktop sale del flujo y DESCIENDE por el centro (la
          mecánica vive en componentes.css + use-incluye-scroll.ts). */}
      <img
        src="/fotos/catamaran-recorte.webp"
        alt="Catamarán de Hispaniola visto desde el aire, navegando en el mar del Caribe"
        width={276}
        height={360}
        loading="lazy"
        className="incluye-barco relative z-10 mt-8 h-incluye-barco-alto-movil w-auto lg:mt-0 lg:h-incluye-barco-alto"
        style={estatico ? ({ '--barco-y': 0.45 } as CSSProperties) : undefined} // [dev-mode] barco a media sección para el frame
      />

      {/* Ítems editoriales — móvil: lista simple (1 columna). Desktop: grid de
          3 columnas [1fr | carril del barco | 1fr]; cada ítem se coloca en su
          fila y lado con --col/--fila (ver componentes.css). */}
      <div
        className="relative z-10 mx-auto grid w-full max-w-contenido grid-cols-1 gap-y-incluye-fila-movil px-5 pt-12 sm:px-10 lg:grid-cols-[1fr_var(--spacing-incluye-lane)_1fr] lg:gap-y-incluye-fila lg:pt-16"
      >
        {INCLUYE_CRUCERO.map((item, i) => {
          const izquierda = i % 2 === 0
          return (
            <div
              key={item.id}
              className={`incluye-item ${izquierda ? 'incluye-item--izquierda' : 'incluye-item--derecha'}`}
              style={{ '--col': izquierda ? 1 : 3, '--fila': i + 1 } as CSSProperties}
            >
              <p className="incluye-numero text-lead">{String(i + 1).padStart(2, '0')}/</p>
              <p className="incluye-item-titulo mt-1 font-display text-h3 font-semibold text-white">
                {item.titulo}
              </p>
              <p className="incluye-item-texto mt-2 text-sm leading-relaxed text-white/75">
                {item.texto}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
