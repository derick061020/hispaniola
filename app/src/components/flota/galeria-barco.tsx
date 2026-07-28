import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Rotate3d } from 'lucide-react'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { MediaBarco } from '@/data/flota'

// EL VISOR DE LA CARD DE BARCO (slide 28 del PDF v2 + reunión del 07-24).
//
// La maqueta del cliente dibuja, dentro de la card: media grande con chip y
// botón «Ver en 360º» arriba, contador «1 / 4» y etiqueta de encuadre abajo, y
// una tira de miniaturas debajo. La reunión precisó el orden: primero un
// VÍDEO del barco, después la galería de fotos.
//
// Pedido de Samuel, literal: «que sea principalmente y por defecto un video
// del barco […] y abajo una mini galería y que se vea que está activo el
// video; luego si haces hover en la imagen grande que aparezcan flechas para
// desplazarte, o también puedes moverte haciendo click en la imagen a la que
// quieres ir».
//
// De ahí salen las cuatro reglas de esta pieza:
//
//   1. EL ÍNDICE 0 ES EL VÍDEO Y ARRANCA ACTIVO. No es una foto más que
//      resulta ser un vídeo: es el estado por defecto de la card, y la
//      miniatura correspondiente nace marcada para que se vea de dónde
//      viene lo que se está reproduciendo.
//   2. LAS FLECHAS APARECEN AL HOVER, no están siempre. Seis cards con dos
//      flechas fijas cada una son doce controles compitiendo en la rejilla.
//      ⚠️ En táctil no hay hover: por debajo de `sm` van SIEMPRE visibles.
//      Esconder la única navegación secuencial en móvil sería perderla.
//   3. LAS MINIATURAS SON NAVEGACIÓN DIRECTA. Con 5 piezas, llegar a la
//      última son 4 clics a ciegas con flechas; con la tira es uno y además
//      se ve a dónde vas.
//   4. EL VÍDEO NO SE DESCARGA HASTA QUE HACE FALTA. `preload="none"` +
//      IntersectionObserver: seis cards con seis vídeos arrancando a la vez
//      al cargar la página es medio megabyte por card y seis decodificaciones
//      simultáneas. Se reproduce solo mientras la card está en pantalla, y se
//      pausa al salir.
//
// Con `prefers-reduced-motion` el vídeo NO arranca solo (criterio WCAG 2.2.2,
// el mismo que ya aplican el carrusel de la TourCard y el fundido de las
// internas): se queda en su póster con un botón de play encima. Ese es además
// el frame que viaja a Figma.
export function GaleriaBarco({
  media,
  nombre,
  chip,
  onAbrir360,
  primera = false,
}: {
  media: MediaBarco[]
  /** Nombre del barco — se usa en las etiquetas accesibles. */
  nombre: string
  /** El chip que flota sobre la media («Tours compartidos», «Eventos»…). */
  chip: string
  /** Sin handler, el botón de 360º no se pinta (ausencia silenciosa). */
  onAbrir360?: () => void
  /** [dev-mode] true solo en la 1ª card de la rejilla: es la que responde a
   *  los deep-links del Glosario Dev, para que un flag no dispare seis veces. */
  primera?: boolean
}) {
  const [indice, setIndice] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // [dev-mode] ?dev-galeria-barco=foto pasa la 1ª card a la 2ª pieza (una
  // FOTO) — el frame de Figma del estado «galería» de la card, que por
  // defecto arranca siempre en el vídeo. Ver dev-registry.ts.
  useDevFlag('dev-galeria-barco', (v) => { // [dev-mode]
    if (primera && v === 'foto') setIndice(1) // [dev-mode]
  }) // [dev-mode]

  const n = media.length
  const actual = media[indice]
  const ir = (i: number) => setIndice(((i % n) + n) % n)

  // Reproducir SOLO en pantalla. El observador vive sobre el contenedor y no
  // sobre el <video> a propósito: el vídeo solo existe en el DOM cuando su
  // pieza está activa, así que un observador atado a él se desmontaría cada
  // vez que el visitante mira una foto y habría que volver a montarlo.
  useEffect(() => {
    const caja = contenedorRef.current
    if (!caja) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entrada]) => {
        const v = videoRef.current
        if (!v) return
        if (entrada.isIntersecting) {
          // `catch` obligatorio: si el navegador rechaza la reproducción
          // automática, el vídeo se queda en su póster — nunca una caja negra.
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(caja)
    return () => io.disconnect()
  }, [indice])

  return (
    <div ref={contenedorRef} className="flex flex-col gap-2">
      {/* ── LA PIEZA GRANDE ────────────────────────────────────────────── */}
      {/* `group/media`: las flechas escuchan el hover de ESTA caja, no el de
          la card entera — pasar el ratón por el título no debe encender unos
          controles que están a 300px de ahí. */}
      <div className="group/media relative aspect-[16/10] overflow-hidden rounded-card bg-navy">
        {actual.tipo === 'video' ? (
          <video
            ref={videoRef}
            src={actual.src}
            poster={actual.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={actual.alt}
            className="size-full object-cover"
          />
        ) : (
          <img
            src={`/fotos/${actual.foto}.webp`}
            alt={actual.alt}
            loading="lazy"
            className="size-full object-cover"
          />
        )}

        {/* Velo inferior: sin él, la etiqueta y el contador quedan a merced de
            lo que haya en ese trozo de foto (una cresta de espuma se come el
            texto blanco). Solo abajo — arriba ya hay dos píldoras opacas. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-navy/75 to-transparent"
        />

        <span className="pointer-events-none absolute left-3 top-3 rounded-chip bg-papel/90 px-3 py-1 text-xs font-medium text-navy shadow-sm backdrop-blur-sm">
          {chip}
        </span>

        {onAbrir360 ? (
          <button
            type="button"
            onClick={onAbrir360}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-chip bg-papel/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm backdrop-blur-sm transition hover:bg-papel"
          >
            <Rotate3d className="size-3.5" aria-hidden="true" />
            Ver en 360º
            <span className="sr-only"> — {nombre}</span>
          </button>
        ) : null}

        <span className="pointer-events-none absolute bottom-3 left-3 text-xs font-medium text-white/90">
          {actual.etiqueta}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-chip bg-navy/60 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          {indice + 1} / {n}
        </span>

        {/* Flechas. `max-sm:opacity-100` es la excepción táctil de la regla 2. */}
        {n > 1 ? (
          <>
            <button
              type="button"
              onClick={() => ir(indice - 1)}
              aria-label={`Ver la pieza anterior de ${nombre}`}
              className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-chip bg-papel/85 text-navy opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-papel focus-visible:opacity-100 group-hover/media:opacity-100 max-sm:opacity-100"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => ir(indice + 1)}
              aria-label={`Ver la pieza siguiente de ${nombre}`}
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-chip bg-papel/85 text-navy opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-papel focus-visible:opacity-100 group-hover/media:opacity-100 max-sm:opacity-100"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {/* ── LA MINI-GALERÍA ───────────────────────────────────────────────
          La miniatura ACTIVA se marca con anillo aqua + opacidad plena; el
          resto quedan atenuadas. La del vídeo lleva además el triángulo de
          play SIEMPRE (activa o no): es lo que dice «esta pieza se mueve» sin
          tener que reproducirla, y por eso al cargar la card se ve de un
          vistazo que lo grande que se está viendo es el vídeo.

          BORDE, no `ring`: es la misma trampa que documenta el lightbox de la
          ficha — un ring se pinta por fuera de la caja y el contenedor lo
          recortaría. El borde transparente va también en las inactivas para
          que cambiar de pieza no mueva las miniaturas de sitio. */}
      <div className="flex gap-2">
        {media.map((pieza, i) => (
          <button
            key={pieza.tipo === 'video' ? `video-${i}` : pieza.foto}
            type="button"
            onClick={() => ir(i)}
            aria-label={
              pieza.tipo === 'video'
                ? `Ver el vídeo de ${nombre}`
                : `Ver la foto «${pieza.etiqueta}» de ${nombre}`
            }
            aria-current={i === indice}
            className={`relative aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-btn border-2 transition ${
              i === indice ? 'border-aqua opacity-100' : 'border-transparent opacity-55 hover:opacity-90'
            }`}
          >
            <img
              src={pieza.tipo === 'video' ? pieza.poster : `/fotos/${pieza.foto}.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="size-full object-cover"
            />
            {pieza.tipo === 'video' ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-navy/35"
              >
                <Play className="size-4 fill-white text-white" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
