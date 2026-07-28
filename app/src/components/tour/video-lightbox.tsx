import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as Modal from '@/components/alignui/modal'
import { useExpansionFlip, type RectOrigen } from '@/lib/use-expansion-flip'

// Reproductor a pantalla completa del video del mosaico (Samuel, 2026-07-22:
// «el video del grid, que al darle click se abra y se reproduzca»).
//
// Antes, la celda del video del mosaico abría el LIGHTBOX DE FOTOS: el
// visitante veía un video moviéndose, lo pulsaba esperando verlo, y le salía
// una foto fija. El cartel prometía una cosa y el clic daba otra.
//
// Es una pieza aparte de GaleriaLightbox y no una variante suya a propósito:
// comparten el andamiaje (Modal de AlignUI sobre navy/95) pero nada más — una
// galería es un carrusel con contador y flechas, un video es UN elemento con
// sus propios controles nativos. Meterlos en el mismo componente habría dado
// un archivo con dos mitades excluyentes. En Figma son dos frames del mismo
// overlay, no dos variantes de un componente.
//
// Sonido: el video del mosaico se reproduce MUDO como cartel animado; aquí
// arranca CON sonido, que es justo lo que el visitante fue a buscar al hacer
// clic. Los controles nativos (`controls`) en vez de unos propios: reproducir
// un video es el gesto más estandarizado de la web, y unos controles a medida
// solo tendrían que reimplementar barra, volumen y pantalla completa peor.
export function VideoLightbox({
  src,
  poster,
  etiqueta,
  onCerrar,
  origen = null,
}: {
  src: string
  /** Foto de portada — el mismo `poster` de la celda del mosaico. */
  poster: string
  /** Describe el video para lectores de pantalla (el nombre del tour). */
  etiqueta: string
  onCerrar: () => void
  /** [v2 2026-07-28] Rectángulo del elemento pulsado, para que el video parezca
   *  DESPEGAR de ahí. `null` = fundido normal. Ver lib/use-expansion-flip.ts. */
  origen?: RectOrigen | null
}) {
  const video = useRef<HTMLVideoElement>(null)
  const refExpansion = useExpansionFlip(origen)

  // Devolver el foco al disparador al cerrar — misma trampa (y mismo
  // arreglo) que en GaleriaLightbox: el Root se desmonta por render
  // condicional del padre, así que Radix no llega a restaurarlo y el foco
  // caía a BODY.
  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null
    return () => disparador?.focus()
  }, [])

  // autoPlay del atributo NO sirve aquí: con `controls` y sonido, los
  // navegadores bloquean la reproducción automática. Se pide a mano y, si el
  // navegador la rechaza, el video se queda en su poster con el play nativo
  // encima — el usuario lo arranca con un clic más. Nunca una pantalla negra.
  useEffect(() => {
    video.current?.play().catch(() => {})
  }, [])

  return (
    <Modal.Root open onOpenChange={(abierto) => (abierto ? undefined : onCerrar())}>
      <Modal.Content
        showClose={false}
        // [v2 2026-07-28] Más transparente y con desenfoque (pedido de Samuel).
        // `backdrop-blur-md` de Tailwind, NO CSS a mano: la cadena de build
        // auto-prefija y escribir `-webkit-backdrop-filter` a mano fue el bug
        // de producción del commit 29cebf4.
        overlayClassName="bg-black/55 p-0 backdrop-blur-md"
        className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-transparent shadow-none focus:outline-none"
        aria-describedby={undefined}
        // Clic en el FONDO cierra; el video para la propagación para que
        // tocar la barra de progreso no cierre el reproductor.
        onClick={onCerrar}
      >
        <Modal.Title className="sr-only">Video de {etiqueta}</Modal.Title>

        <div className="flex items-center justify-end px-5 py-4">
          <Modal.Close asChild>
            <CompactButton.Root
              variant="ghost"
              size="large"
              aria-label="Cerrar video"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <CompactButton.Icon as={X} />
            </CompactButton.Root>
          </Modal.Close>
        </div>

        <div className="flex flex-1 items-center justify-center px-2 pb-6 sm:px-5">
          <video
            ref={(el) => {
              video.current = el
              refExpansion(el)
            }}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            // ⚠️ La proporción de la caja se fija AL CARGAR LOS METADATOS, con
            // las dimensiones reales del archivo. Sin esto, un <video> con
            // `poster` adopta la proporción DEL PÓSTER: aquí el póster es la
            // foto de portada del tour (apaisada) y el visor pintaba la caja a
            // ratio 2.69 con contenido 1.78 — medido — así que el fotograma
            // salía con franjas y «enorme en horizontal», que es justo lo que
            // reportó Samuel. Con el ratio real, la caja se ajusta al archivo
            // sea vertical (los reels que vienen) o apaisado (el placeholder).
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (v.videoWidth > 0 && v.videoHeight > 0) {
                v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`
              }
            }}
            aria-label={`Video de ${etiqueta}`}
            onClick={(e) => e.stopPropagation()}
            // `object-contain` NO es decorativo: sin él la caja del <video> se
            // estiraba a la del contenedor flex y el fotograma salía deformado
            // — medido, el elemento quedaba en ratio 2.69 con contenido 1.78.
            // Con `h-auto`/`w-auto` la caja sigue la proporción real del
            // archivo, y el tope de ancho evita que un video apaisado se coma
            // el viewport de borde a borde (a uno vertical lo gobierna max-h).
            className="h-auto max-h-full w-auto max-w-[min(100%,56rem)] rounded-card object-contain"
          />
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
