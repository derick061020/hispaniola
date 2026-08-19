import { useState, type CSSProperties } from 'react'
import { Play, Volume2 } from 'lucide-react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import { SliderComida } from '@/components/internas/slider-comida'
import { VideoLightbox } from '@/components/tour/video-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'
import { t } from '@/lib/i18n'

// Mosaico de fotos reales del tour/evento — vive DENTRO del contenido, no en
// el hero (2026-07-17: la iteración que lo incrustó en el hero desalineaba el
// título y no pertenecía ahí; se muda a la columna de contenido de la ficha,
// como un bloque más). Sin envoltorio blanco: es la galería, abre la columna.
//
// Layout (pedido de Samuel): 3 fotos arriba (fila más alta) + 4 abajo (fila
// más baja), y la última de abajo lleva el overlay «+N fotos» cuando quedan
// más en el lightbox. Rejilla de 12 columnas: arriba 3×col-span-4, abajo
// 4×col-span-3 — las dos filas llenan el ancho aunque tengan distinto nº de
// celdas. Necesita ≥7 fotos; con menos (los eventos traen 4) cae a un 2×2,
// nunca deja un hueco vacío.
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/02-producto.md slide 3:
// «agregar un video»). El mosaico admite un video opcional que ocupa la
// PRIMERA celda (la grande de arriba a la izquierda), reproduciéndose en
// bucle y sin sonido como cartel animado. Al pulsarlo abre el lightbox en la
// primera foto, igual que cualquier otra celda — el lightbox sigue siendo
// solo de fotos, que es lo que sabe mostrar.
//
// `video` es opcional para no tocar las landings de evento, que llaman a
// este mismo componente sin video.
//
// 2026-07-22 (Samuel): «el video del grid, que al darle click se abra y se
// reproduzca». La celda del video ya no abre el lightbox de FOTOS —
// arrancaba un video mudo como cartel y al pulsarlo aparecía una foto fija,
// que es prometer una cosa y dar otra. Ahora abre VideoLightbox, con
// controles y sonido. Las celdas de foto siguen abriendo la galería.
//
// 2026-07-22, 2ª vuelta (Samuel): el video SALE de la rejilla y pasa a ser
// una COLUMNA VERTICAL 9:16 a la izquierda, que empuja la rejilla a la
// derecha. El motivo es de formato, no de composición: el material de este
// tipo se graba en vertical (reels), y metido en una celda apaisada del
// mosaico solo se veía la franja central recortada — se perdía justo lo que
// hace vertical a un vertical. Ahora la celda tiene la proporción del
// archivo y no recorta nada.
//   · El ancho de la columna lo fija el aspect-ratio contra el alto de la
//     fila, no un valor propio: video y rejilla comparten alto y quedan a
//     ras por arriba y por abajo, sin cuadrar dos números a mano.
//   · La rejilla recupera su celda 0 como FOTO. Los índices vuelven a ser
//     los de `fotos`, así que el lightbox abre en la que se pulsó sin
//     desfase.
//   · En móvil la fila se rompe y el video va encima, centrado y a alto
//     acotado (--spacing-galeria-video-alto-movil): a ancho completo un 9:16
//     mediría ~690px de alto y empujaría la ficha entera fuera de pantalla.
//
// [v2 2026-07-27] La PRIMERA celda de la rejilla puede ser un SLIDER DE COMIDA
// (plan 01 §10, slide 7 — el cliente rodeó esa celda y escribió «mini galería
// de fotos del menú»). No es una tira a ancho completo: es la misma celda, con
// el mismo tamaño y estética, pero pasando en bucle todos los platos del menú
// de ese tour/evento, con flechas al hover. Ver slider-comida.tsx.
export function GaleriaMosaico({
  fotos,
  etiqueta,
  video = null,
  fotosComida,
}: {
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (el nombre del tour/evento) */
  etiqueta: string
  /** Ruta del video (en /video). null = mosaico solo de fotos, como siempre. */
  video?: string | null
  /** [v2] Fotos de plato del menú de ESTE tour/evento. Con 2 o más, la
   *  primera celda pasa a ser el slider. Sin ellas, el mosaico es el de
   *  siempre — las landings sin menú no cambian. */
  fotosComida?: string[]
}) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  // [v2 2026-07-28] QUÉ conjunto muestra el lightbox. Bug que reportó Samuel:
  // al pulsar el slider de comida se abría la galería GENERAL del tour, así
  // que no aparecían los platos ni se podían pasar — el visor prometía una
  // cosa (venías de las fotos del menú) y daba otra.
  const [conjunto, setConjunto] = useState<'galeria' | 'comida'>('galeria')
  const [verVideo, setVerVideo] = useState(false)
  // [v2 2026-07-28] Origen de la expansión: el rectángulo de la celda o del
  // video que se pulsó, para que el visor DESPEGUE de ahí en vez de aparecer
  // en el centro. Ver lib/use-expansion-flip.ts.
  const foto = useOrigenExpansion()
  const video360 = useOrigenExpansion()

  // [dev-mode] ?dev-galeria=abierta — ver src/dev/dev-registry.ts
  useDevFlag('dev-galeria', (v) => setLightbox(v === 'abierta' ? 0 : null))
  // [dev-mode] ?dev-galeria-video=abierto — el frame del reproductor.
  useDevFlag('dev-galeria-video', (v) => setVerVideo(v === 'abierto'))

  if (fotos.length <= 1) return null

  const amplio = fotos.length >= 7
  const visibles = amplio ? 7 : Math.min(4, fotos.length)
  const restantes = fotos.length - visibles

  // [v2] Con fotos de menú, la celda 0 se sustituye por el slider. El resto de
  // índices NO se desplazan: el slider abre el lightbox en la 0 igual que
  // haría la foto que reemplaza, así que la numeración del lightbox sigue
  // cuadrando con `fotos`.
  const hayComida = (fotosComida?.length ?? 0) >= 2

  const celda = (indice: number, span: string) => {
    if (indice === 0 && hayComida) {
      return (
        <div key="slider-comida" className={`${span} h-full overflow-hidden`}>
          <SliderComida
            fotos={fotosComida!}
            etiqueta={etiqueta}
            onAbrir={(el, indiceComida) => {
              foto.abrirDesde(el)
              setConjunto('comida')
              // Abre EN EL PLATO que se estaba viendo, no en el primero: el
              // slider va rotando solo, así que empezar en el 0 sería saltar
              // a una foto distinta de la que el visitante acaba de pulsar.
              setLightbox(indiceComida)
            }}
          />
        </div>
      )
    }
    const esUltima = indice === visibles - 1
    return (
      <button
        key={fotos[indice]}
        type="button"
        onClick={(e) => {
          foto.abrirDesde(e.currentTarget)
          setConjunto('galeria')
          setLightbox(indice)
        }}
        // [v3 F8 · QA 2026-08-07] La foto es DECORATIVA (alt vacío + aria-hidden:
        // describir una a una las 8 fotos de un mosaico es ruido para quien usa
        // lector de pantalla), pero eso dejaba al BOTÓN sin nombre accesible —
        // se anunciaba solo como «botón». El nombre va aquí, y dice lo que el
        // botón HACE, no lo que la foto muestra.
        aria-label={`Open photo ${indice + 1} of ${fotos.length} in the gallery`}
        className={`group relative overflow-hidden bg-papel-hueso ${span}`}
      >
        <img
          src={`/fotos/${fotos[indice]}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {esUltima && restantes > 0 ? (
          <span className="absolute inset-0 grid place-items-center bg-overlay-foto text-sm font-semibold text-white">
            +{restantes} {t('photos →')}
          </span>
        ) : null}
      </button>
    )
  }

  const rejilla = amplio ? (
    // Fila superior 1.35fr, inferior 1fr → arriba «un poco más altas».
    // min-w-0 + flex-1: dentro de la fila con el video, la rejilla se queda
    // con el ancho sobrante en vez de imponer el min-content de sus 4 celdas
    // de abajo (que empujaría el video fuera de la columna).
    <div
      className="grid h-72 min-w-0 flex-1 grid-cols-12 gap-1.5 overflow-hidden rounded-card-grande sm:h-full"
      style={{ gridTemplateRows: '1.35fr 1fr' } as CSSProperties}
    >
      {[0, 1, 2].map((i) => celda(i, 'col-span-4'))}
      {[3, 4, 5, 6].map((i) => celda(i, 'col-span-3'))}
    </div>
  ) : (
    <div className="grid h-56 min-w-0 flex-1 grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-card-grande sm:h-full">
      {Array.from({ length: visibles }, (_, i) => celda(i, ''))}
    </div>
  )

  return (
    <>
      {/* La FILA (video + rejilla) es quien lleva el alto a partir de sm:, y
          los dos hijos lo copian con h-full — así el bloque tiene un solo
          alto que gobernar. En móvil la fila no tiene alto: se apila y cada
          pieza usa el suyo. */}
      <div className="flex flex-col gap-2 sm:h-80 sm:flex-row sm:gap-1.5 lg:h-galeria-ficha-alto">
        {video !== null ? (
          <button
            type="button"
            onClick={(e) => {
              video360.abrirDesde(e.currentTarget)
              setVerVideo(true)
            }}
            aria-label={`Watch the video of ${etiqueta}`}
            className="group relative aspect-[9/16] h-galeria-video-alto-movil w-auto shrink-0 self-center overflow-hidden rounded-card-grande bg-papel-hueso sm:h-full sm:self-auto"
          >
            {/* Bucle mudo = cartel animado. El poster es la foto de portada:
                el hueco nunca está vacío mientras carga, y quien tenga datos
                limitados ve una imagen en vez de un rectángulo. */}
            <video
              src={video}
              poster={`/fotos/${fotos[0]}.webp`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Degradado al pie: sin él la píldora de «Ver con sonido» flota
                sobre fotogramas que cambian y a veces se queda ilegible. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/70 to-transparent"
            />
            {/* El play, centrado: es el botón, no una etiqueta de «esto es un
                video». Crece al hover con la celda. */}
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-white/25 text-white ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="size-6 translate-x-px fill-current" />
              </span>
            </span>
            {/* El cartel va mudo por obligación (los navegadores no
                autoreproducen con sonido). La píldora dice qué gana el clic
                — si no, un video que ya se está moviendo no parece
                pulsable. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-3 pb-3 text-xs font-medium text-white"
            >
              <Volume2 className="size-3.5 shrink-0" />
              {t('Watch with sound')}
            </span>
          </button>
        ) : null}

        {rejilla}
      </div>

      {lightbox !== null ? (
        <GaleriaLightbox
          fotos={conjunto === 'comida' ? fotosComida! : fotos}
          indiceInicial={lightbox}
          etiqueta={conjunto === 'comida' ? `the ${etiqueta} menu` : etiqueta}
          origen={foto.origen}
          onCerrar={() => setLightbox(null)}
        />
      ) : null}

      {verVideo && video !== null ? (
        <VideoLightbox
          src={video}
          poster={`/fotos/${fotos[0]}.webp`}
          etiqueta={etiqueta}
          origen={video360.origen}
          onCerrar={() => setVerVideo(false)}
        />
      ) : null}
    </>
  )
}
