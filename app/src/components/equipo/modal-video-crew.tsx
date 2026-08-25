import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

// EL VÍDEO DE LA TRIPULACIÓN, QUE NO SE CIERRA: SE ACOPLA.
//
// Pedido de Samuel (2026-08-21). El cliente entregó un vídeo de 3 minutos del
// equipo («hispaniola staff-HD.mp4») y en /crew no había ningún hueco donde
// meterlo: la página son retratos y una rejilla, y un reproductor de 16:9
// incrustado entre dos departamentos no lo ve nadie. Así que se presenta como
// lo que es, una pieza de bienvenida, y se comporta como el mini-reproductor
// de YouTube:
//
//   · NO salta al cargar. Asoma cuando se ha scrolleado un poco (Samuel,
//     2026-08-21: «el modal me parece muy invasivo, que aparezca al hacer un
//     poco de scroll»). Entonces se abre EN GRANDE, en el centro, sobre un
//     fondo oscurecido y desenfocado. No arranca solo: espera un clic.
//   · Al cerrarlo NO desaparece. El mismo <video> —el mismo elemento, sin
//     desmontar— viaja al pie izquierdo y se queda pequeño, con el fondo ya
//     retirado. Se PAUSA al hacerlo (Samuel, 2026-08-21): un vídeo con voz
//     sonando desde una miniatura mientras se lee la página es ruido, no
//     compañía. El minuto no se pierde, así que al volver sigue donde estaba.
//   · Al pulsar el pequeño vuelve al centro. Ida y vuelta las veces que haga
//     falta.
//
// ⚠️ POR QUÉ TODO EL MOVIMIENTO ES UN SOLO `transform` Y NO width/top/left.
// Los dos estados son 16:9, así que uno es el otro a escala. Eso permite dejar
// la caja SIEMPRE con el tamaño del estado grande y mover y encoger con un
// único `translate(...) scale(...)` y `transform-origin: 0 0`. Ventajas, y son
// el motivo de hacerlo así:
//   · El navegador compone la animación en la GPU. Animar `width`/`height`
//     obliga a re-maquetar cada fotograma y el vídeo tirita mientras viaja.
//   · No hay que transicionar de `top: 50%` a `bottom: 20px`, que CSS
//     directamente no sabe interpolar (`auto` no es un número).
//   · El <video> nunca cambia de tamaño de caja, así que no se re-negocia el
//     layout del reproductor ni parpadean los controles nativos.
// El precio es tener que saber el tamaño del viewport en JS. De ahí el
// `useEffect` con el listener de resize.
//
// ⚠️ LA ENTRADA TAMBIÉN VA EN ESE MISMO `transform`, y por eso hay que
// compensar el origen. Con `transform-origin: 0 0`, escalar al 92% encoge la
// caja hacia su esquina superior izquierda: el video se iría al rincón en vez
// de crecer donde está. La compensación es media caja de lo que falta
// —`ancho * (1 - escala) / 2`— y es lo que hace que crezca desde su CENTRO.
// Ver `centrado()`.

/** Tope de ancho del estado grande. Por encima, un 16:9 se come la pantalla y
 *  los controles nativos quedan a un metro del centro. */
const ANCHO_MAXIMO = 1024
/** Ancho del estado acoplado. Lo justo para reconocer la escena sin tapar la
 *  página que hay detrás. */
const ANCHO_ACOPLADO = 192
/** Aire contra los bordes de la ventana, en los dos estados. */
const MARGEN = 20
/** Cuánto hay que bajar para que asome, en pantallas. Medio viewport es «un
 *  poco de scroll»: el hero de /crew ya se ha ido, has empezado a leer, y el
 *  video llega como algo que se ofrece en vez de como una puerta que se cruza
 *  antes de ver nada. */
const DISPARO = 0.5
/** De cuánto arranca la entrada. El 92% se nota sin llamar la atención; por
 *  debajo del 85% el gesto empieza a leerse como un pop-up. */
const ESCALA_ENTRADA = 0.92
/** Y cuánto sube al colocarse. Muy poco a propósito: el movimiento lo lleva la
 *  escala, esto solo le da dirección. */
const DERIVA_ENTRADA = 24

type Estado = 'oculto' | 'grande' | 'acoplado' | 'fuera'

export function ModalVideoCrew({ src, poster }: { src: string; poster: string }) {
  const [estado, setEstado] = useState<Estado>('oculto')
  const [reproduciendo, setReproduciendo] = useState(false)
  const [ventana, setVentana] = useState<{ w: number; h: number } | null>(null)
  // DOS banderas para la entrada, y las dos hacen falta:
  //  · `colocado` es el interruptor de la animación. Se enciende un fotograma
  //    DESPUÉS de montar (de ahí el doble rAF) para que el navegador llegue a
  //    pintar el estado inicial; encendiéndolo en el mismo commit no habría dos
  //    valores entre los que transicionar y el video aparecería ya puesto.
  //  · `presentado` dice si la entrada ya terminó, y solo sirve para elegir
  //    duración: mientras dura, manda la lenta; después, la del viaje.
  const [colocado, setColocado] = useState(false)
  const [presentado, setPresentado] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  // El tamaño de la ventana es un dato de render, así que se mide antes de
  // pintar (no en un useEffect normal, que dejaría un primer fotograma con la
  // caja en 0 y un salto visible).
  useEffect(() => {
    const medir = () => setVentana({ w: window.innerWidth, h: window.innerHeight })
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // EL DISPARO. Se mira el scroll en vez de observar un elemento porque lo que
  // manda es «cuánto has bajado», no «qué bloque has alcanzado»: un
  // IntersectionObserver ataría el video a una sección concreta de la página y
  // se rompería el día que esa sección se mueva. Se comprueba también al
  // montar, por si se llega con la página ya scrolleada (un enlace con #ancla,
  // o volver atrás en el historial).
  useEffect(() => {
    if (estado !== 'oculto') return
    const mirar = () => {
      if (window.scrollY > window.innerHeight * DISPARO) setEstado('grande')
    }
    mirar()
    window.addEventListener('scroll', mirar, { passive: true })
    return () => window.removeEventListener('scroll', mirar)
  }, [estado])

  // Doble rAF: el primero deja que React pinte el estado inicial (pequeño y
  // transparente) y el segundo enciende la transición hacia el final.
  useEffect(() => {
    if (estado !== 'grande' || colocado) return
    let dos = 0
    const uno = requestAnimationFrame(() => {
      dos = requestAnimationFrame(() => setColocado(true))
    })
    return () => {
      cancelAnimationFrame(uno)
      cancelAnimationFrame(dos)
    }
  }, [estado, colocado])

  // Cuando la entrada acaba, el componente pasa a su duración de viaje. El
  // número sale del token, no de aquí, para que no puedan divergir.
  useEffect(() => {
    if (!colocado || presentado) return
    const ms = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--crew-video-entrada-duracion',
      ),
      10,
    )
    const t = setTimeout(() => setPresentado(true), Number.isFinite(ms) ? ms : 720)
    return () => clearTimeout(t)
  }, [colocado, presentado])

  // Con el vídeo en grande la página de detrás no debe moverse: es un modal.
  // Acoplado sí se puede scrollear, que es justamente para lo que sirve.
  useEffect(() => {
    if (estado !== 'grande') return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [estado])

  // Acoplar PAUSA. Lo pidió Samuel el 2026-08-21 y es lo correcto: la voz en
  // off de un vídeo de tres minutos saliendo de una miniatura de 192px,
  // mientras alguien lee la página, se busca de dónde viene para apagarla. El
  // `currentTime` no se toca, así que al volver al centro sigue donde estaba.
  const acoplar = useCallback(() => {
    video.current?.pause()
    setEstado('acoplado')
  }, [])

  useEffect(() => {
    if (estado !== 'grande') return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') acoplar()
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [estado, acoplar])

  if (estado === 'oculto' || estado === 'fuera' || !ventana) return null

  // La caja mide SIEMPRE lo que mide el estado grande; el pequeño es esta
  // misma caja a escala. El ancho se acota por los tres lados: el tope, el
  // ancho de la ventana y —esto es lo que se olvida— el ALTO de la ventana,
  // porque en un móvil apaisado lo que falta es altura, no anchura.
  const ancho = Math.min(
    ANCHO_MAXIMO,
    ventana.w - MARGEN * 2,
    ((ventana.h - MARGEN * 2) * 16) / 9,
  )
  const alto = (ancho * 9) / 16
  const escala = Math.min(1, ANCHO_ACOPLADO / ancho)

  const grande = estado === 'grande'
  // Mientras no se haya colocado, el video está en su posición de salida: un
  // punto más pequeño y un pelín más abajo.
  const asomando = grande && !colocado
  const escalaVista = asomando ? ESCALA_ENTRADA : 1
  /** Dónde cae la esquina superior izquierda para que la caja quede CENTRADA
   *  aun estando escalada. Ver el aviso de la cabecera. */
  const centrado = (libre: number, lado: number) => libre / 2 + (lado * (1 - escalaVista)) / 2
  // La equis y el disco de play viven DENTRO de la caja, así que el `scale` los
  // encoge con ella: a escala 0,19 una equis de 36px aterriza en 7. Se les da
  // el tamaño dividido por la escala para que caigan en pantalla con los
  // píxeles que se piden aquí, que son los que hacen falta para poder tocarlos.
  const compensado = (enPantalla: number) =>
    grande ? undefined : Math.round(enPantalla / escala)

  const transform = grande
    ? `translate(${centrado(ventana.w - ancho, ancho)}px, ${
        centrado(ventana.h - alto, alto) + (asomando ? DERIVA_ENTRADA : 0)
      }px) scale(${escalaVista})`
    : `translate(${MARGEN}px, ${ventana.h - alto * escala - MARGEN}px) scale(${escala})`

  // La entrada es lenta porque presenta; el viaje centro <-> esquina es más
  // corto porque solo mueve. Ver los tokens --crew-video-*.
  const ritmo = {
    transitionDuration: presentado
      ? 'var(--crew-video-viaje-duracion)'
      : 'var(--crew-video-entrada-duracion)',
    transitionTimingFunction: 'var(--crew-video-easing)',
  }

  return (
    <>
      {/* El fondo. No se desmonta al acoplar: se desvanece, porque montarlo y
          desmontarlo cortaría la transición del vídeo justo a la mitad.
          `pointer-events-none` cuando está acoplado para que no se coma los
          clics de la página. */}
      <div
        aria-hidden="true"
        onClick={acoplar}
        style={ritmo}
        className={`fixed inset-0 z-50 bg-navy/70 backdrop-blur-md motion-safe:transition-opacity ${
          grande && colocado ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role={grande ? 'dialog' : undefined}
        aria-modal={grande || undefined}
        aria-label="Hispaniola crew video"
        style={{
          width: ancho,
          height: alto,
          transform,
          transformOrigin: '0 0',
          opacity: asomando ? 0 : 1,
          ...ritmo,
        }}
        className="fixed left-0 top-0 z-50 overflow-hidden rounded-card-grande bg-navy shadow-card-flotante motion-safe:transition-[transform,opacity]"
      >
        <video
          ref={video}
          src={src}
          poster={poster}
          playsInline
          // `preload="none"`: son 3 minutos en HD y el modal se abre en cada
          // visita. Sin esto, entrar en /crew se descargaría el vídeo entero
          // aunque nadie lo mire.
          preload="none"
          // Los controles nativos solo en grande. Acoplado miden menos que un
          // dedo y encima roban el clic que sirve para volver al centro.
          controls={grande}
          controlsList="nodownload"
          onPlay={() => setReproduciendo(true)}
          // Con esto vuelve el botón de play propio cuando alguien pausa desde
          // la barra nativa, que es lo que pidió Samuel.
          onPause={() => setReproduciendo(false)}
          onEnded={() => setReproduciendo(false)}
          className="size-full object-cover"
        />

        {/* Acoplado, el vídeo entero es el botón de volver al centro. */}
        {!grande ? (
          <button
            type="button"
            onClick={() => setEstado('grande')}
            aria-label="Expand the video again"
            className="absolute inset-0 cursor-zoom-in"
          />
        ) : null}

        {/* EL PLAY PROPIO. Se pinta mientras el vídeo no corre, encima de todo
            menos de la barra de controles nativa (de ahí el `bottom-12` del
            contenedor: sin él, en grande el botón cae justo sobre la barra y
            no se puede tocar la línea de tiempo). El anillo que late es un
            `animate-ping` detrás del disco, no en él: latiendo el propio disco,
            el icono también escalaría y se lee como un glitch. */}
        {!reproduciendo ? (
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 grid place-items-center ${
              grande ? 'bottom-12' : 'bottom-0'
            }`}
          >
            {/* ⚠️ ACOPLADO EL DISCO NO ES PULSABLE, y es a propósito. Ahí el
                clic tiene que devolver el vídeo al centro, no arrancarlo, y
                este botón se comía justo el centro del cuadradito: al pinchar
                el mini-reproductor sonaba en vez de volver. Sigue pintándose
                —es lo que dice «esto es un vídeo»— pero deja pasar el clic al
                botón de expandir que hay debajo. */}
            <button
              type="button"
              onClick={() => video.current?.play()}
              aria-label="Play the crew video"
              aria-hidden={!grande}
              tabIndex={grande ? undefined : -1}
              style={{ width: compensado(36), height: compensado(36) }}
              className={`relative grid place-items-center rounded-full bg-white/90 text-navy shadow-card-flotante transition-transform duration-300 ${
                grande
                  ? 'pointer-events-auto size-16 hover:scale-110 sm:size-20'
                  : 'pointer-events-none'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping"
              />
              <Play
                style={{ width: compensado(15), height: compensado(15) }}
                className={`relative translate-x-0.5 fill-current ${
                  grande ? 'size-7 sm:size-8' : ''
                }`}
              />
            </button>
          </div>
        ) : null}

        {/* La equis. En grande ACOPLA (no cierra: el vídeo se queda abajo a la
            izquierda). Acoplado sí retira el reproductor del todo — si no, no
            habría forma de quitárselo de encima en toda la página. */}
        <button
          type="button"
          onClick={() => (grande ? acoplar() : setEstado('fuera'))}
          aria-label={grande ? 'Minimize the video' : 'Close the video'}
          style={{
            width: compensado(28),
            height: compensado(28),
            right: compensado(8),
            top: compensado(8),
          }}
          className={`absolute grid place-items-center rounded-full bg-navy/70 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-navy ${
            grande ? 'right-3 top-3 size-9' : ''
          }`}
        >
          <X style={{ width: compensado(15), height: compensado(15) }} className={grande ? 'size-4' : ''} />
        </button>
      </div>
    </>
  )
}
