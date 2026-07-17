import { useState } from 'react'
import { Play, X } from 'lucide-react'
import * as Modal from '@/components/alignui/modal'
import * as CompactButton from '@/components/alignui/compact-button'
import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD, VIDEOS_SOSTENIBILIDAD, type VideoSost } from '@/data/sostenibilidad'
import { useDevFlag } from '@/dev/use-dev-flag'

// Los 7 videos de competitive-advantage.php. Cada tarjeta es el póster real
// (descargado de YouTube a /video/sostenibilidad, sin hotlink) + un botón play
// coral propio; al pulsarla, el embed de YouTube se carga DENTRO de un modal
// (Modal del sistema = Radix Dialog: scroll-lock, focus-trap y Escape salen del
// primitive — mismo patrón que GaleriaLightbox). El iframe solo existe mientras
// el modal está abierto: nada de 7 embeds cargando en segundo plano.
//
// Rediseño 2026-07-17 (pedido de Samuel, "más editorial"): se quita el
// ring-1 ring-linea de cada póster — era lo que las leía como 7 cajas
// idénticas; sin borde, cada póster respira solo. ⚠️ Se evaluó destacar el 1er
// video a doble ancho (bento asimétrico), pero varios pósters de este set son
// recortes verticales de YouTube Shorts con textos quemados en INGLÉS
// (6ixzXs68DPQ, ziUx_05VC-4, aMVg2cL3Z8o — pendiente real: pedir al cliente
// las miniaturas en ES o recortes limpios) — agrandar cualquiera de esos
// habría sido el defecto más visible de la sección, así que la rejilla se
// queda UNIFORME a propósito. Reveal de scroll compartido con el resto de la
// página, ver use-sostenibilidad-reveal.ts.
export function VideosSostenibilidad() {
  const [activo, setActivo] = useState<VideoSost | null>(null)

  // [dev-mode] deep-link del Glosario Dev — abre el modal con el 1er video.
  useDevFlag('dev-video-sost', (v) => {
    if (v === 'abierto') setActivo(VIDEOS_SOSTENIBILIDAD[0])
  })

  return (
    <section>
      <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.videosEyebrow}</Etiqueta>
      <h2 className="sost-reveal mt-2 font-display text-h2 font-semibold text-navy">{SOSTENIBILIDAD.videosTitulo}</h2>
      <p className="sost-reveal mt-3 max-w-2xl text-lead text-navy-sub">{SOSTENIBILIDAD.videosTexto}</p>

      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS_SOSTENIBILIDAD.map((video) => (
          <li key={video.id} className="sost-reveal">
            <VideoCard video={video} onPlay={() => setActivo(video)} />
          </li>
        ))}
      </ul>

      {activo ? <VideoModal video={activo} onCerrar={() => setActivo(null)} /> : null}
    </section>
  )
}

function VideoCard({ video, onPlay }: { video: VideoSost; onPlay: () => void }) {
  return (
    <button type="button" onClick={onPlay} className="group block w-full text-left">
      {/* El zoom vive en un contenedor overflow-hidden (no en el <img> suelto),
          igual que TourCard y los megamenús: el hover de un póster es un zoom.
          Sin ring/borde — el póster respira solo, sin leerse como una caja. */}
      <span className="relative block aspect-video overflow-hidden rounded-card bg-navy">
        <img
          src={`/video/sostenibilidad/${video.id}.jpg`}
          alt=""
          aria-hidden="true"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-coral text-white shadow-cta transition group-hover:bg-coral-dark">
            {/* translate-x: centrado óptico del triángulo dentro del círculo */}
            <Play className="size-6 translate-x-0.5 fill-current" />
          </span>
        </span>
      </span>
      <span className="mt-3 block font-display text-base font-semibold text-navy transition-colors group-hover:text-aqua-dark">
        {video.titulo}
      </span>
    </button>
  )
}

function VideoModal({ video, onCerrar }: { video: VideoSost; onCerrar: () => void }) {
  return (
    <Modal.Root open onOpenChange={(abierto) => (abierto ? undefined : onCerrar())}>
      <Modal.Content
        showClose={false}
        // De la card de 400px del vendor a un contenedor 16:9 navy: la pila de
        // conflictos de className la resuelve tailwind-merge (cnExt del vendor).
        className="w-full max-w-4xl overflow-hidden rounded-card bg-navy p-0"
        aria-describedby={undefined}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <Modal.Title className="truncate text-sm font-medium text-white">{video.titulo}</Modal.Title>
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

        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full border-0"
          />
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
