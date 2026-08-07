import { useEffect, useRef } from 'react'
import { Rotate3d, X } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as Modal from '@/components/alignui/modal'

// «VER EN 360º» — el botón de la esquina de la card (slide 28).
//
// ⚠️ LO QUE ESTO ES Y LO QUE NO ES.
//
// El material 360 no existe todavía. El plan 04 §3 dejó escrito el criterio
// de producción: «el botón "Ver en 360º" no se pinta si el barco no tiene
// tour360 — ausencia silenciosa, no un botón que no hace nada», porque un
// botón que promete un recorrido y abre una foto normal es exactamente el
// patrón que este proyecto evita.
//
// Samuel pidió el botón para poder maquetar la card completa. Hasta el
// 2026-07-28 el visor lo advertía EN PANTALLA, con una etiqueta encima del
// reproductor («Recorrido de ejemplo — el vídeo 360º real está en
// producción»). ESA ETIQUETA SE RETIRA por pedido suyo: «quita cualquier
// aviso de contenido de ejemplo, se ve cutre, se sobreentiende» — mismo
// criterio que en /instalaciones y /tripulacion. La maqueta enseña la página,
// no sus andamios.
//
// ⚠️ El criterio de PRODUCCIÓN no cambia con esto, y es lo que hay que
// respetar cuando esta página se monte de verdad: sin `tour360` real, el botón
// NO SE PINTA (ausencia silenciosa). Lo que se ha quitado es el cartel de la
// maqueta, no la regla.
//
// Cuando lleguen los archivos hay dos caminos, y la reunión del 07-24 (29:48,
// «de cada uno, pero en un vídeo 360») apunta al primero:
//   (a) recorrido GRABADO → se sirve con este mismo `<video>`, sin ninguna
//       dependencia nueva. Este componente ya vale tal cual.
//   (b) equirectangular ARRASTRABLE → necesita visor (Pannellum/Photo Sphere)
//       y sería la primera dependencia externa de runtime del proyecto.
// La pregunta al cliente está afinada en el plan; hasta que conteste, esto no
// se puede cerrar.
export function Visor360({
  src,
  poster,
  nombre,
  onCerrar,
}: {
  src: string
  poster: string
  /** Nombre del barco — encabeza el visor y describe el vídeo. */
  nombre: string
  onCerrar: () => void
}) {
  const video = useRef<HTMLVideoElement>(null)

  // Devolver el foco al disparador al cerrar: el Root se desmonta por render
  // condicional del padre y Radix no llega a restaurarlo (misma trampa que en
  // galeria-lightbox.tsx / video-lightbox.tsx).
  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null
    return () => disparador?.focus()
  }, [])

  // `autoPlay` como atributo no basta con `controls` y sonido: los
  // navegadores lo bloquean. Se pide a mano y, si lo rechazan, el vídeo se
  // queda en su póster con el play nativo encima. Nunca una pantalla negra.
  useEffect(() => {
    video.current?.play().catch(() => {})
  }, [])

  return (
    <Modal.Root open onOpenChange={(abierto) => (abierto ? undefined : onCerrar())}>
      <Modal.Content
        showClose={false}
        overlayClassName="bg-navy/60 p-0 backdrop-blur-md"
        className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-transparent shadow-none focus:outline-none"
        aria-describedby={undefined}
        onClick={onCerrar}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2 text-white">
            <Rotate3d className="size-5 shrink-0" aria-hidden="true" />
            <Modal.Title className="truncate font-display text-lead font-semibold text-white">
              {nombre} en 360º
            </Modal.Title>
          </div>
          <Modal.Close asChild>
            <CompactButton.Root
              variant="ghost"
              size="large"
              aria-label="Close the 360º viewer"
              className="shrink-0 text-white hover:bg-white/10 hover:text-white"
            >
              <CompactButton.Icon as={X} />
            </CompactButton.Root>
          </Modal.Close>
        </div>

        {/* `min-h-0`: la trampa clásica de flexbox — sin ella el contenedor
            crece hasta el alto natural del vídeo y `max-h-full` se resuelve
            contra esa altura inflada en vez de contra la ventana. Está
            documentada en video-lightbox.tsx con la medida que la delató. */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-2 pb-8 sm:px-5">
          <div className="relative flex min-h-0 w-full max-w-5xl items-center justify-center">
            <video
              ref={video}
              src={src}
              poster={poster}
              controls
              loop
              playsInline
              preload="metadata"
              aria-label={`Recorrido en 360º del ${nombre}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full w-full rounded-card object-cover"
            />
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
