import { useState, type CSSProperties } from 'react'
import { Play, Volume2 } from 'lucide-react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { VideoLightbox } from '@/components/tour/video-lightbox'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import type { ZonaInstalacion } from '@/data/instalaciones'

// El MINI-BENTO de media de cada zona de /instalaciones (correcciones v2,
// slides 46-49, pedido de Samuel 2026-07-28: «no es solo un recurso, sino que
// es como un mini bento de imágenes y videos que se alternan»).
//
// La versión anterior de la página daba a cada zona UNA foto 4:3 y ya. La
// maqueta del cliente da tres celdas por zona, y no en una rejilla plana:
//
//     ┌──────────┬───────────┐
//     │          │  foto     │   ← celda apilada, la más baja
//     │ VERTICAL ├───────────┤
//     │   9:16   │  360° /   │   ← celda apilada, la más alta
//     └──────────┴───────────┘
//
// El vertical grande a un lado y dos celdas apiladas al otro. Es la MISMA
// composición que internas/galeria-mosaico.tsx ya resolvió en la ficha de tour
// (video vertical que empuja la rejilla), y por eso se copia su mecánica en
// vez de inventar otra:
//   · El ANCHO del vertical no se fija: sale de su aspect-ratio 9:16 contra
//     el alto de la fila (--spacing-bento-zona-alto). Así el formato vertical
//     queda intacto a cualquier alto y nunca hay que cuadrar dos números.
//   · Las dos celdas apiladas se quedan con lo que sobra (`flex-1`) y se
//     reparten el alto en 0.85fr / 1.15fr — la asimetría es lo que hace que
//     esto se lea como un bento y no como dos rectángulos iguales.
//
// LA TERCERA CELDA ES LA DEL 360°, Y HOY NO EXISTE. Sin `tour360` no se pinta
// un botón muerto ni un «Ver en 360°» que abra una foto normal: su sitio lo
// ocupa la 2ª foto de la zona, así que el bento sigue teniendo sus 3 celdas y
// no queda hueco. El día que llegue el material, la celda cambia de contenido
// y el layout no se entera.
//
// Nada de esto lleva etiquetas de maqueta («Foto», «VERTICAL», «360°» como
// texto suelto): Samuel, 2026-07-28 — «quita todo lo que diga texto o imágenes
// de ejemplo, eso se ve horrible y amateur». Los únicos rótulos que quedan son
// los que informan de verdad: el pie del vertical (que es copy del cliente) y
// la píldora «Ver con sonido», que dice qué gana el clic sobre un video que ya
// se está moviendo mudo.

// [v2 2026-07-28, 2ª vuelta, Samuel: «tal vez puedas darle algo más creativo,
// que se vea que no está 100 por 100 copiada del pdf»] EL BENTO SE ESPEJA.
//
// La maqueta dibuja las seis zonas con el MISMO bento —vertical siempre a la
// izquierda, celda baja arriba y alta abajo— y solo mueve el bloque entero de
// lado. Al montarlo así, el vertical quedaba pegado al centro de la página en
// las zonas impares y el conjunto se leía como el mismo módulo copiado seis
// veces. Con `espejo` cambian DOS cosas a la vez, y las dos van atadas al lado
// en que cae el bento:
//
//   · el vertical se va al MARGEN EXTERIOR de la página (izquierda cuando el
//     bento abre a la izquierda, derecha cuando abre a la derecha), así el
//     zigzag se dibuja de verdad en vez de repetirse;
//   · el ESCALÓN de las dos celdas apiladas se invierte (0.85/1.15 ↔
//     1.15/0.85), así el perfil del bento sube y baja al scrollear en lugar de
//     repetir la misma silueta.
//
// Las fracciones van en `style` y no en una clase arbitraria por el mismo
// motivo que en galeria-mosaico.tsx: son proporciones de grid, no un valor del
// sistema de diseño.
const FILAS_NORMAL = { gridTemplateRows: '0.85fr 1.15fr' } as CSSProperties
const FILAS_ESPEJO = { gridTemplateRows: '1.15fr 0.85fr' } as CSSProperties

export function BentoZona({ zona, espejo = false }: { zona: ZonaInstalacion; espejo?: boolean }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [verVideo, setVerVideo] = useState(false)
  // El rectángulo de la celda pulsada, para que el visor DESPEGUE de ahí en
  // vez de aparecer en el centro — ver lib/use-expansion-flip.ts.
  const foto = useOrigenExpansion()
  const video = useOrigenExpansion()

  const fotos = zona.fotos.map((f) => f.src)

  const celdaFoto = (indice: number) => {
    const f = zona.fotos[indice]
    if (!f) return null
    return (
      <button
        key={f.src}
        type="button"
        onClick={(e) => {
          foto.abrirDesde(e.currentTarget)
          setLightbox(indice)
        }}
        // [2026-08-18] El nombre accesible dice la ACCIÓN, no solo la foto. El
        // `alt` de la imagen de dentro ya nombraba el botón para un lector de
        // pantalla, pero describe lo que se ve, no que al pulsar se abre el
        // visor — y el barrido de QA lo contaba como botón sin nombre. Con
        // esto, «Open photo: …» dice las dos cosas.
        aria-label={`Open photo: ${f.alt}`}
        className="group relative min-h-0 overflow-hidden rounded-card bg-papel-hueso"
      >
        <img
          src={`/fotos/${f.src}.webp`}
          alt={f.alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>
    )
  }

  return (
    <>
      {/* La FILA manda el alto y las tres celdas lo copian (h-full / min-h-0),
          así el bento tiene un solo alto que gobernar en cada breakpoint. */}
      <div
        className={`flex h-bento-zona-alto-movil gap-bento-hueco lg:h-bento-zona-alto ${
          espejo ? 'flex-row-reverse' : ''
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            video.abrirDesde(e.currentTarget)
            setVerVideo(true)
          }}
          aria-label={`Ver el video: ${zona.vertical.titulo}`}
          className="group relative aspect-[9/16] h-full shrink-0 overflow-hidden rounded-card-grande bg-navy"
        >
          {/* Bucle mudo = cartel animado (los navegadores no autoreproducen
              con sonido). El póster evita que el hueco esté vacío mientras
              carga. */}
          <video
            src={zona.vertical.video}
            poster={`/fotos/${zona.vertical.poster}.webp`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Degradado al pie: sin él ni el título ni la píldora leen sobre
              fotogramas que cambian. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy/80 to-transparent"
          />
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <span className="grid size-12 place-items-center rounded-full bg-white/25 text-white ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="size-5 translate-x-px fill-current" />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 text-left">
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/80">
              <Volume2 className="size-3.5 shrink-0" aria-hidden="true" />
              Ver con sonido
            </span>
            <span className="text-sm font-semibold text-white">{zona.vertical.titulo}</span>
          </span>
        </button>

        <div
          className="grid min-w-0 flex-1 gap-bento-hueco"
          style={espejo ? FILAS_ESPEJO : FILAS_NORMAL}
        >
          {celdaFoto(0)}
          {/* La celda del 360°. Ausencia silenciosa mientras no haya material:
              la ocupa la 2ª foto de la zona. */}
          {zona.tour360 ? (
            <a
              href={zona.tour360}
              className="group relative grid min-h-0 place-items-center overflow-hidden rounded-card bg-navy text-white"
            >
              <span className="rounded-chip bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                Recorre en 360°
              </span>
            </a>
          ) : (
            celdaFoto(1)
          )}
        </div>
      </div>

      {lightbox !== null ? (
        <GaleriaLightbox
          fotos={fotos}
          indiceInicial={lightbox}
          etiqueta={zona.nombre}
          origen={foto.origen}
          onCerrar={() => setLightbox(null)}
        />
      ) : null}

      {verVideo ? (
        <VideoLightbox
          src={zona.vertical.video}
          poster={`/fotos/${zona.vertical.poster}.webp`}
          etiqueta={zona.vertical.titulo}
          origen={video.origen}
          onCerrar={() => setVerVideo(false)}
        />
      ) : null}
    </>
  )
}
