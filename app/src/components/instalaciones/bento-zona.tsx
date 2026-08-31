import { useState, type CSSProperties } from 'react'
import { t, tp } from '@/lib/i18n'
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

// [2026-08-24, Samuel sobre el Operations Center: «como todas las imágenes y
// videos son horizontales haz un bento de 4, para que todo entre horizontal»]
// EL BENTO DE 4 CELDAS, para las zonas marcadas `todoApaisado`.
//
//     ┌──────────────────┬──────────┐
//     │      VIDEO       │   foto   │
//     ├──────────────────┼──────────┤
//     │      foto        │   foto   │
//     └──────────────────┴──────────┘
//
// El bento de 3 nace de tener un 9:16 que enseñar, y `videoApaisado` ya fue un
// primer parche para las zonas cuyo CLIP es 16:9: el video bajaba a una celda
// apilada y el hueco vertical lo tapaba una foto recortada. En el Operations
// Center ese parche se quedó corto, porque ahí no es solo el clip — las tres
// fotos de la carpeta son 3:2 apaisadas. La celda 9:16 estaba enseñando el
// único recorte imposible de la zona: una sala vacía cortada a lo alto.
//
// Sin material vertical, la respuesta no es rellenar el hueco mejor: es no
// tenerlo. Las 4 celdas salen de repartir la MISMA caja (mismo alto que las
// otras zonas, que es lo que mantiene el bento a ras con su columna de texto)
// en 2×2, y ninguna baja de 1:1 — la más estrecha queda en ~1.1:1 y la más
// ancha en ~1.95:1, así que las fotos 3:2 y el clip 16:9 entran recortando por
// donde sobra y no por donde está la sala.
//
// La ASIMETRÍA se mantiene por el mismo motivo que en el bento de 3 (si no,
// son cuatro rectángulos iguales y deja de ser un bento) y se espeja igual:
// la columna ancha se va al MARGEN EXTERIOR de la página y el escalón de las
// filas se invierte, así el zigzag de la sección se sigue dibujando.
// [2026-08-24, 2ª vuelta de Samuel: «aun se achican un poco, se puede mantener
// el aspect ratio de las imagenes? con el que vienen, solo para este bento 05»]
// AQUI MANDA EL MATERIAL, NO LA CELDA.
//
// La primera versión del bento de 4 repartía la caja en 2×2 con fracciones
// elegidas a mano (1.3fr/1fr × 1.15fr/0.85fr) y metía las fotos ahí con
// object-cover. Ya no cortaba a lo alto, que era el problema gordo, pero seguía
// cortando: celdas de 1.16:1 y 2.03:1 para fotos de 1.5:1. Se comía los lados.
//
// No hace falta, porque esta zona tiene el material MAS uniforme de la página:
// las tres fotos vienen en 3:2 y el clip en 16:9 exacto. Asi que las celdas
// dejan de ser un molde y pasan a ser el resultado.
//
// LA MECANICA es la de una galería justificada, y sale de una sola regla: en
// una fila flex donde cada celda lleva su `aspect-ratio` y crece con
// `flex-grow = esa misma proporcion` (con `flex-basis: 0`), TODAS las celdas de
// la fila acaban con el mismo alto y ninguna se deforma. El ancho se reparte
// solo, el hueco se descuenta solo, y el alto de cada fila lo dicta el ancho
// disponible:
//
//     ┌────────────────────┬──────────────┐   fila 1: 16/9 + 3/2
//     │     VIDEO 16:9     │   foto 3:2   │   → alto = (ancho - hueco) / 3.28
//     ├──────────────────┬─┴──────────────┤
//     │    foto 3:2      │   foto 3:2     │   fila 2: 3/2 + 3/2
//     └──────────────────┴────────────────┘   → alto = (ancho - hueco) / 3
//
// Y de ahi sale, gratis, lo que antes se buscaba a mano: las dos filas NO miden
// lo mismo de alto y la linea vertical de la fila de arriba no cae donde la de
// abajo. Sigue siendo un bento, pero la asimetría ya no es una decision
// arbitraria — es la forma que tienen las fotos.
//
// ⚠️ ESTE ES EL UNICO BENTO SIN ALTO FIJO. No lleva `h-bento-zona-alto` porque
// el alto es consecuencia del ancho; a 1440px da ~406px contra los 416px de sus
// hermanas, diferencia invisible con la fila centrada (`items-center`). Si
// alguien vuelve a poner un alto aqui, las fotos se recortan otra vez.
const CRECE_16_9 = { flexGrow: 16 / 9, flexBasis: 0 } as CSSProperties
const CRECE_3_2 = { flexGrow: 3 / 2, flexBasis: 0 } as CSSProperties

export function BentoZona({ zona, espejo = false }: { zona: ZonaInstalacion; espejo?: boolean }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [verVideo, setVerVideo] = useState(false)
  // El rectángulo de la celda pulsada, para que el visor DESPEGUE de ahí en
  // vez de aparecer en el centro — ver lib/use-expansion-flip.ts.
  const foto = useOrigenExpansion()
  const video = useOrigenExpansion()

  // TODAS las fotos de la zona, en el orden en que las recorre el visor: la
  // vertical primero (cuando la zona tiene el video apaisado), después las que
  // se pintan en el bento y al final las que SOLO viven en el visor.
  // ⚠️ Los índices que se pasan a `setLightbox` son índices DE ESTA lista, no
  // de `zona.fotos`: con `videoApaisado` las dos se desplazan una posición.
  // ⚠️ Con `todoApaisado` la vertical NO entra: ya no pinta celda, y en el
  // visor sería el mismo rincón que su versión apaisada, la misma sala dos
  // veces. Ahí los índices de `todas` son directamente los de `zona.fotos`.
  const todas = [
    ...(zona.videoApaisado && zona.fotoVertical && !zona.todoApaisado
      ? [zona.fotoVertical]
      : []),
    ...zona.fotos,
    ...(zona.fotosExtra ?? []),
  ]
  const fotos = todas.map((f) => f.src)
  // Cuántas hay de más que las que se ven. El cliente (2026-08-21): «me
  // gustaría que se haga referencia a que hay más». De ahí el «+N».
  const deMas = zona.fotosExtra?.length ?? 0

  const celdaFoto = (indice: number, contador = false, clases = '', estilo?: CSSProperties) => {
    const f = todas[indice]
    if (!f) return null
    const avisa = contador && deMas > 0
    return (
      <button
        key={f.src}
        type="button"
        onClick={(e) => {
          foto.abrirDesde(e.currentTarget)
          setLightbox(indice)
        }}
        aria-label={
          avisa
            ? `Open all ${todas.length} photos of the ${zona.nombre}`
            : tp('Open photo {n} of {total} of the {zona}', { n: indice + 1, total: todas.length, zona: zona.nombre })
        }
        style={estilo}
        className={`group relative min-h-0 overflow-hidden rounded-card bg-papel-hueso ${clases}`}
      >
        <img
          src={`/fotos/${f.src}.webp`}
          alt={f.alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {avisa ? (
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 rounded-chip bg-navy/70 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
          >
            +{deMas}
          </span>
        ) : null}
      </button>
    )
  }

  // El botón del video. Vive en la celda 9:16 cuando el clip es vertical y en
  // una celda apilada cuando es 16:9 (`videoApaisado`) — es el MISMO contenido
  // en las dos, solo cambia de hueco, así que se escribe una vez.
  const celdaVideo = (clases: string, estilo?: CSSProperties) => (
    <button
      type="button"
      onClick={(e) => {
        video.abrirDesde(e.currentTarget)
        setVerVideo(true)
      }}
      aria-label={`Watch the video: ${zona.vertical.titulo}`}
      style={estilo}
      className={`group relative overflow-hidden bg-navy ${clases}`}
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
          {t('Watch with sound')}
        </span>
        <span className="text-sm font-semibold text-white">{zona.vertical.titulo}</span>
      </span>
    </button>
  )

  // La celda 9:16. Con el video apaisado la ocupa la foto vertical de la zona,
  // que es el índice 0 de `todas`.
  const celdaGrande = () => {
    const clases = 'aspect-[9/16] h-full shrink-0 rounded-card-grande'
    if (!zona.videoApaisado || !zona.fotoVertical) return celdaVideo(clases)
    return (
      <button
        type="button"
        onClick={(e) => {
          foto.abrirDesde(e.currentTarget)
          setLightbox(0)
        }}
        aria-label={tp('Open photo {n} of {total} of the {zona}', { n: 1, total: todas.length, zona: zona.nombre })}
        className={`group relative overflow-hidden bg-papel-hueso ${clases}`}
      >
        <img
          src={`/fotos/${zona.fotoVertical.src}.webp`}
          alt={zona.fotoVertical.alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>
    )
  }

  // Las filas se leen al revés cuando el bento abre a la derecha, así el video
  // —la celda más ancha— se va al MARGEN EXTERIOR de la página igual que el
  // vertical en el bento de 3.
  const fila = `flex gap-bento-hueco ${espejo ? 'flex-row-reverse' : ''}`

  const bento = zona.todoApaisado ? (
    <div className="flex flex-col gap-bento-hueco">
      <div className={fila}>
        {/* El video va con la foto y no solo en su fila: a lo ancho del bento
            un 16:9 mediría ~350px de alto y dejaría las tres fotos en una
            tira de 137px. */}
        {celdaVideo('aspect-video min-w-0 rounded-card-grande', CRECE_16_9)}
        {celdaFoto(0, false, 'aspect-[3/2] min-w-0', CRECE_3_2)}
      </div>
      <div className={fila}>
        {celdaFoto(1, false, 'aspect-[3/2] min-w-0', CRECE_3_2)}
        {/* El «+N» sigue colgando de la última celda por si la zona vuelve a
            tener `fotosExtra`; hoy el Operations Center las enseña todas. */}
        {celdaFoto(2, true, 'aspect-[3/2] min-w-0', CRECE_3_2)}
      </div>
    </div>
  ) : (
    /* La FILA manda el alto y las tres celdas lo copian (h-full / min-h-0),
       así el bento tiene un solo alto que gobernar en cada breakpoint. */
    <div
      className={`flex h-bento-zona-alto-movil gap-bento-hueco lg:h-bento-zona-alto ${
        espejo ? 'flex-row-reverse' : ''
      }`}
    >
      {celdaGrande()}

      <div
        className="grid min-w-0 flex-1 gap-bento-hueco"
        style={espejo ? FILAS_ESPEJO : FILAS_NORMAL}
      >
        {/* Con el video apaisado la primera celda apilada ES el video: ya es
            horizontal, así que el clip entra sin recortarse. La foto vertical
            de la zona se ha ido arriba, a la celda 9:16. */}
        {zona.videoApaisado ? celdaVideo('min-h-0 rounded-card') : celdaFoto(0)}
        {/* La celda del 360°. Ausencia silenciosa mientras no haya material:
            la ocupa la última foto visible de la zona, que además es la que
            lleva el «+N» cuando hay más en el visor. */}
        {zona.tour360 ? (
          <a
            href={zona.tour360}
            className="group relative grid min-h-0 place-items-center overflow-hidden rounded-card bg-navy text-white"
          >
            <span className="rounded-chip bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              {t('Explore in 360°')}
            </span>
          </a>
        ) : (
          // Siempre el índice 1: sin video apaisado es `fotos[1]`, y con él
          // es `fotos[0]`, porque la vertical ocupa el 0 de `todas`.
          celdaFoto(1, true)
        )}
      </div>
    </div>
  )

  return (
    <>
      {bento}

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
          apaisado={zona.videoApaisado}
          onCerrar={() => setVerVideo(false)}
        />
      ) : null}
    </>
  )
}
