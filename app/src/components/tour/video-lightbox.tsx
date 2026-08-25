import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as Modal from '@/components/alignui/modal'
import { useExpansionFlip, type RectOrigen } from '@/lib/use-expansion-flip'
import { t } from '@/lib/i18n'

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
  apaisado = false,
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
  /** El archivo es 16:9. Sin esto la caja hereda la proporción de la celda de
   *  la que sale y, si esa celda es 9:16 (el carril de verticales), el
   *  `object-cover` se comería los lados del clip. Con `apaisado` la caja se
   *  fija en 16:9 y el fotograma la rellena entero. */
  apaisado?: boolean
}) {
  const video = useRef<HTMLVideoElement>(null)
  const refExpansion = useExpansionFlip(origen)

  // Proporción del ENCUADRE, tomada de la celda que se pulsó. Ver el comentario
  // largo junto al <video>: es lo que hace que expandir sea un zoom y no un
  // cambio de formato. Se descartan medidas degeneradas (una celda de alto 0
  // daría una división por cero y una caja imposible).
  const aspecto = apaisado
    ? '16 / 9'
    : origen && origen.width > 0 && origen.height > 0
      ? `${origen.width} / ${origen.height}`
      : null

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
        <Modal.Title className="sr-only">{t('Video of')}{' '}{etiqueta}</Modal.Title>

        <div className="flex items-center justify-end px-5 py-4">
          <Modal.Close asChild>
            <CompactButton.Root
              variant="ghost"
              size="large"
              aria-label={t('Close video')}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <CompactButton.Icon as={X} />
            </CompactButton.Root>
          </Modal.Close>
        </div>

        {/* ⚠️ `min-h-0` NO es opcional: es la trampa clásica de flexbox. Un
            flex item trae `min-height: auto`, así que NO puede encogerse por
            debajo de su contenido — y un video 9:16 con 896px de ancho pide
            1593px de alto, con lo que este contenedor CRECÍA hasta 1617px y
            `max-h-full` del video se resolvía contra esa altura inflada en vez
            de contra la ventana. Medido: el video se salía de un viewport de
            900px. Con `min-h-0` el contenedor sí se acota y el video se ajusta.
            Verificado simulando un archivo 9:16 real. */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-5">
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
            // ⚠️ LA PROPORCIÓN LA MANDA LA CELDA DE ORIGEN, NO EL ARCHIVO.
            //
            // Primero se probó al revés —fijar el ratio real del archivo al
            // cargar los metadatos— y era peor: la celda del mosaico es una
            // COLUMNA 9:16 (formato reel, decisión de layout del 07-22), pero
            // el placeholder que hay hoy es 1600×900. Medido: se pulsaba una
            // tira vertical de 198×352 y se abría un video apaisado de 896×504.
            // Pulsar algo vertical y que se abra algo horizontal es justo el
            // «se sigue viendo raro» que reportó Samuel — y ninguna transición,
            // por suave que sea, arregla un cambio de formato a mitad de gesto.
            //
            // Con la proporción de la celda, el visor enseña EL MISMO ENCUADRE
            // que la miniatura, solo que grande: la expansión se lee como un
            // zoom y no como un salto a otro contenido. `object-cover` recorta
            // igual que recortaba la celda.
            //
            // Cuando llegue el reel 9:16 de verdad esto NO RECORTA NADA: cover
            // y contain coinciden cuando las proporciones coinciden. O sea que
            // el placeholder se ve bien hoy y el archivo final se verá entero
            // mañana, sin tocar este archivo.
            //
            // Sin `origen` (deep-link del Dev Mode, que abre sin celda) se cae
            // al ratio real del archivo, que es lo único que se sabe entonces.
            style={aspecto ? { aspectRatio: aspecto } : undefined}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (!aspecto && v.videoWidth > 0 && v.videoHeight > 0) {
                v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`
              }
            }}
            aria-label={`Video de ${etiqueta}`}
            onClick={(e) => e.stopPropagation()}
            // `object-cover` (no `contain`): la caja ya tiene la proporción
            // del encuadre de la celda, así que el fotograma la RELLENA
            // recortando lo que sobra — exactamente lo que hacía la miniatura.
            // Con `contain` volverían las franjas negras y el video se vería
            // pequeño en medio de una caja vertical.
            // `h-auto`/`w-auto` dejan que la caja la derive el aspect-ratio, y
            // el tope de ancho evita que un encuadre apaisado se coma el
            // viewport de borde a borde (a uno vertical lo gobierna max-h).
            className="h-auto max-h-full w-auto max-w-[min(100%,56rem)] rounded-card object-cover"
          />
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
