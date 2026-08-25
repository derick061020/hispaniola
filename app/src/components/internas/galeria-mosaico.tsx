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
  videoProducto = null,
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
  /** [2026-08-21, pedido de Samuel] EL VIDEO DEL PRODUCTO, 16:9, DENTRO DE LA
   *  REJILLA. Es distinto de `video`: aquel es la columna 9:16 de al lado (hoy
   *  un placeholder, mañana alguien explicando cómo reservar) y este es el clip
   *  que el cliente grabó del propio evento. Samuel: «el vídeo siempre tiene
   *  que salir en el grid, no puede estar oculto de último». Ocupa la primera
   *  celda libre —la 0, o la 1 si la 0 se la lleva el slider de comida— y abre
   *  la MISMA galería que las fotos, en su diapositiva 0, para que además se
   *  llegue a él pasando fotos. */
  videoProducto?: { src: string; poster: string } | null
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

  // ⚠️ `visibles` y `restantes` se calculan sobre las PIEZAS, no sobre las
  // fotos: desde que el slider de comida y el video del producto ocupan celda,
  // la rejilla puede tener 7 huecos con solo 5 fotos dentro. El «+N» sigue
  // contando FOTOS, que es lo que el visitante espera encontrar al pulsarlo.
  const totalPiezas =
    fotos.length + ((fotosComida?.length ?? 0) >= 2 ? 1 : 0) + (videoProducto ? 1 : 0)
  const amplio = totalPiezas >= 7
  const visibles = amplio ? 7 : Math.min(4, totalPiezas)

  // [v2] Con fotos de menú, la celda 0 se sustituye por el slider. El resto de
  // índices NO se desplazan: el slider abre el lightbox en la 0 igual que
  // haría la foto que reemplaza, así que la numeración del lightbox sigue
  // cuadrando con `fotos`.
  const hayComida = (fotosComida?.length ?? 0) >= 2

  // Las PIEZAS de la rejilla, en orden. Antes eran los índices de `fotos` a
  // secas; ahora delante puede haber hasta dos piezas que no son fotos (el
  // slider de comida y el video del producto), así que se enumeran y cada una
  // sabe a qué diapositiva del visor abre.
  //  · comida  -> abre el visor en el conjunto de comida
  //  · video   -> abre el visor de la galería en su diapositiva 0
  //  · foto i  -> abre en `i + 1` si hay video delante, en `i` si no
  const desfase = videoProducto ? 1 : 0
  const piezas: ({ tipo: 'comida' } | { tipo: 'video' } | { tipo: 'foto'; i: number })[] = [
    ...(hayComida ? [{ tipo: 'comida' } as const] : []),
    ...(videoProducto ? [{ tipo: 'video' } as const] : []),
    ...fotos.map((_, i) => ({ tipo: 'foto', i }) as const),
  ]

  const fotosVisibles = piezas.slice(0, visibles).filter((p) => p.tipo === 'foto').length
  const restantes = fotos.length - fotosVisibles

  const celda = (indice: number, span: string) => {
    const pieza = piezas[indice]
    if (!pieza) return null

    if (pieza.tipo === 'comida') {
      return (
        <div key="slider-comida" className={`${span} h-full overflow-hidden`}>
          <SliderComida
            fotos={fotosComida!}
            etiqueta={etiqueta}
            onAbrir={(el, indiceComida) => {
              foto.abrirDesde(el)
              setConjunto('comida')
              // Abre EN EL PLATO que se estaba viendo, no en el primero: el
              // slider va rotando solo, asi que empezar en el 0 seria saltar
              // a una foto distinta de la que el visitante acaba de pulsar.
              setLightbox(indiceComida)
            }}
          />
        </div>
      )
    }

    if (pieza.tipo === 'video') {
      return (
        <button
          key="video-producto"
          type="button"
          onClick={(e) => {
            foto.abrirDesde(e.currentTarget)
            setConjunto('galeria')
            // Diapositiva 0 de la MISMA galeria: desde ahi se pasa a las fotos
            // con las flechas, y desde cualquier foto se vuelve al video.
            setLightbox(0)
          }}
          aria-label={`Watch the ${etiqueta} video`}
          className={`group relative overflow-hidden bg-navy ${span}`}
        >
          {/* Bucle mudo = cartel animado. Los navegadores no autoreproducen
              con sonido, asi que la pildora de abajo dice que el clic lo trae. */}
          <video
            src={videoProducto!.src}
            poster={videoProducto!.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/70 to-transparent"
          />
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <span className="grid size-12 place-items-center rounded-full bg-white/25 text-white ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="size-5 translate-x-px fill-current" />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-2 pb-2 text-xs font-medium text-white"
          >
            <Volume2 className="size-3.5 shrink-0" />
            {t('Watch with sound')}
          </span>
        </button>
      )
    }

    const esUltima = indice === visibles - 1
    return (
      <button
        key={fotos[pieza.i]}
        type="button"
        onClick={(e) => {
          foto.abrirDesde(e.currentTarget)
          setConjunto('galeria')
          setLightbox(pieza.i + desfase)
        }}
        // [v3 F8 - QA 2026-08-07] La foto es DECORATIVA (alt vacio + aria-hidden:
        // describir una a una las 8 fotos de un mosaico es ruido para quien usa
        // lector de pantalla), pero eso dejaba al BOTON sin nombre accesible -
        // se anunciaba solo como «boton». El nombre va aqui, y dice lo que el
        // boton HACE, no lo que la foto muestra.
        aria-label={`Open photo ${pieza.i + 1} of ${fotos.length} in the gallery`}
        className={`group relative overflow-hidden bg-papel-hueso ${span}`}
      >
        <img
          src={`/fotos/${fotos[pieza.i]}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {esUltima && restantes > 0 ? (
          <span className="absolute inset-0 grid place-items-center bg-overlay-foto text-sm font-semibold text-white">
+{restantes} {t('photos')}
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
          // El video solo viaja al conjunto GENERAL: la galería del menú son
          // platos, y meterle el video del evento sería prometer una cosa y
          // dar otra (el mismo motivo por el que los dos conjuntos existen).
          video={conjunto === 'comida' ? null : videoProducto}
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
