import { useEffect, useRef, useState } from 'react'
import { X, Maximize2 } from 'lucide-react'
import { VideoLightbox } from '@/components/tour/video-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import { t } from '@/lib/i18n'

// Video que acompaña el scroll de la ficha (correcciones v2, plan 01 §11 —
// slide 10: «esto que vaya bajando según el cliente hace scroll»).
//
// Qué video es: en la reunión del 07-24 (20:51) el cliente lo describió como
// «la persona responsable de explicar el tour… un mini vídeo de qué va la
// vaina». Es material que hay que GRABAR, uno por tour.
// ⚠️ [placeholder-v2] Hasta que llegue, se reutiliza un video del repo. Se
// sustituye cambiando `videoAcompanante` en data/tours.ts.
//
// DÓNDE VA Y POR QUÉ: abajo a la IZQUIERDA. Lo propuso Samuel en la reunión
// (23:10) con el argumento correcto: «a la derecha está lo de reservar,
// entonces eso tiene que quedar ahí solo». La columna derecha es del widget y
// no se comparte. Al hacer clic se expande — también pedido suyo.
//
// El contenido NO se estrecha para hacerle sitio (22:04: «que no se reduzca el
// contenido, porque ya está apretado, sino que se posicione a la izquierda,
// porque queda un espacio sobrante»): es `fixed`, así que vive fuera del flujo
// y ocupa el margen que ya sobraba.
//
// ⚠️ RIESGO ASUMIDO, CON REVERSIÓN PACTADA. El propio cliente levantó la duda
// (23:40: «me están despistando con un vídeo, por muy bueno que sea») y se
// acordó probarlo y quitarlo si molesta. Por eso: (a) se puede CERRAR y no
// vuelve en esa sesión, (b) vive en su propio componente, así que retirarlo es
// borrar una línea de tour.tsx, no desmontar el mosaico.
//
// Solo desde lg: en móvil ya hay una barra fija de reserva (barra-movil-ficha)
// y dos piezas flotantes se pelearían por la misma esquina.

export function VideoAcompanante({
  src,
  poster,
  etiqueta,
}: {
  src: string
  /** Misma foto de portada que usa la celda del mosaico. */
  poster: string
  etiqueta: string
}) {
  const [visible, setVisible] = useState(false)
  const [cerrado, setCerrado] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const expansion = useOrigenExpansion()
  const centinela = useRef<HTMLDivElement>(null)

  // Aparece cuando el mosaico (donde vive el video "de verdad") ha salido de
  // pantalla: mientras se ve el original, un segundo player sería el mismo
  // video dos veces. El cliente dibujó justo eso en su slide —el video
  // duplicado— pero estaba representando el MOVIMIENTO, no dos videos.
  useEffect(() => {
    const el = centinela.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entrada]) => setVisible(!entrada.isIntersecting && entrada.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // [dev-mode] ?dev-video-acompanante=visible fuerza el estado para Figma:
  // sin esto habría que capturarlo a mitad de scroll.
  useDevFlag('dev-video-acompanante', (v) => {
    if (v === 'visible') {
      setVisible(true)
      setCerrado(false)
    }
  })

  const mostrar = visible && !cerrado

  return (
    <>
      {/* Centinela: se coloca donde termina el mosaico. Sin alto propio, no
          altera el layout. */}
      <div ref={centinela} aria-hidden="true" className="h-px w-full" />

      <div
        className={`fixed bottom-5 left-5 z-40 hidden transition-all duration-300 motion-reduce:transition-none lg:block ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="group relative aspect-[9/16] w-40 overflow-hidden rounded-card-grande bg-navy shadow-lg ring-1 ring-white/10">
          <video
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="size-full object-cover"
          />

          <button
            type="button"
            onClick={(e) => {
              // Expande DESDE el mini player, no desde el centro.
              expansion.abrirDesde(e.currentTarget.parentElement as HTMLElement)
              setExpandido(true)
            }}
            aria-label={`Ver el video de ${etiqueta} en grande`}
            className="absolute inset-0 grid place-items-center bg-navy/0 transition-colors group-hover:bg-navy/35"
          >
            <Maximize2
              className="size-6 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </button>

          {/* Cerrar: la salida pactada con el cliente por si el video despista.
              Arriba a la derecha y siempre visible — un cierre que hay que
              descubrir no es un cierre. */}
          <button
            type="button"
            onClick={() => setCerrado(true)}
            aria-label={t('Close the video')}
            className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-navy/70 text-white transition hover:bg-navy"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {expandido ? (
        <VideoLightbox
          src={src}
          poster={poster}
          etiqueta={etiqueta}
          origen={expansion.origen}
          onCerrar={() => setExpandido(false)}
        />
      ) : null}
    </>
  )
}
