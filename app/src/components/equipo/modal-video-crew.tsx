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
//   · Al entrar en la página se abre EN GRANDE, en el centro, sobre un fondo
//     oscurecido y desenfocado. No arranca solo: espera un clic.
//   · Al cerrarlo NO desaparece. El mismo <video> —el mismo elemento, sin
//     desmontar— viaja al pie izquierdo y se queda pequeño, con el fondo ya
//     retirado. Si estaba reproduciéndose, sigue: no se pierde ni el minuto ni
//     el sonido.
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

/** Tope de ancho del estado grande. Por encima, un 16:9 se come la pantalla y
 *  los controles nativos quedan a un metro del centro. */
const ANCHO_MAXIMO = 1024
/** Ancho del estado acoplado. Lo justo para reconocer la escena sin tapar la
 *  página que hay detrás. */
const ANCHO_ACOPLADO = 288
/** Aire contra los bordes de la ventana, en los dos estados. */
const MARGEN = 20

type Estado = 'grande' | 'acoplado' | 'fuera'

export function ModalVideoCrew({ src, poster }: { src: string; poster: string }) {
  const [estado, setEstado] = useState<Estado>('grande')
  const [reproduciendo, setReproduciendo] = useState(false)
  const [ventana, setVentana] = useState<{ w: number; h: number } | null>(null)
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

  const acoplar = useCallback(() => setEstado('acoplado'), [])

  useEffect(() => {
    if (estado !== 'grande') return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') acoplar()
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [estado, acoplar])

  if (estado === 'fuera' || !ventana) return null

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
  const transform = grande
    ? `translate(${(ventana.w - ancho) / 2}px, ${(ventana.h - alto) / 2}px) scale(1)`
    : `translate(${MARGEN}px, ${ventana.h - alto * escala - MARGEN}px) scale(${escala})`

  return (
    <>
      {/* El fondo. No se desmonta al acoplar: se desvanece, porque montarlo y
          desmontarlo cortaría la transición del vídeo justo a la mitad.
          `pointer-events-none` cuando está acoplado para que no se coma los
          clics de la página. */}
      <div
        aria-hidden="true"
        onClick={acoplar}
        className={`fixed inset-0 z-50 bg-navy/70 backdrop-blur-md transition-opacity duration-500 ease-out ${
          grande ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role={grande ? 'dialog' : undefined}
        aria-modal={grande || undefined}
        aria-label="Video de la tripulación de Hispaniola"
        style={{ width: ancho, height: alto, transform, transformOrigin: '0 0' }}
        className="fixed left-0 top-0 z-50 overflow-hidden rounded-card-grande bg-navy shadow-card-flotante transition-transform duration-500 ease-out"
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
            aria-label="Volver a ver el video en grande"
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
              aria-label="Reproducir el video de la tripulación"
              aria-hidden={!grande}
              tabIndex={grande ? undefined : -1}
              className={`relative grid size-16 place-items-center rounded-full bg-white/90 text-navy shadow-card-flotante transition-transform duration-300 sm:size-20 ${
                grande ? 'pointer-events-auto hover:scale-110' : 'pointer-events-none'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping"
              />
              <Play className="relative size-7 translate-x-0.5 fill-current sm:size-8" />
            </button>
          </div>
        ) : null}

        {/* La equis. En grande ACOPLA (no cierra: el vídeo se queda abajo a la
            izquierda). Acoplado sí retira el reproductor del todo — si no, no
            habría forma de quitárselo de encima en toda la página. */}
        <button
          type="button"
          onClick={() => setEstado(grande ? 'acoplado' : 'fuera')}
          aria-label={grande ? 'Minimizar el video' : 'Cerrar el video'}
          // El botón viaja dentro de la caja, así que en el estado pequeño lo
          // encoge el mismo `scale` que al vídeo. Se compensa agrandándolo
          // cuando está acoplado para que siga siendo tocable.
          className={`absolute right-3 top-3 grid place-items-center rounded-full bg-navy/70 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-navy ${
            grande ? 'size-9' : 'size-20'
          }`}
        >
          <X className={grande ? 'size-4' : 'size-10'} />
        </button>
      </div>
    </>
  )
}
