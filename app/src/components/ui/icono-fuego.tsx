// Llama animada del chip «Lo más reservado» (Samuel, 2026-07-22: «un icono
// svg de fuego que tenga animación constante tipo lottie»).
//
// POR QUÉ NO ES UN LOTTIE DE VERDAD: un Lottie son ~30 KB de runtime
// (lottie-web) + un JSON de keyframes que nadie de este equipo puede editar
// sin After Effects, para animar un icono de 16px. Aquí la animación es
// CSS —dos keyframes sobre dos paths— y sale del mismo sitio que el resto
// del movimiento del sitio (componentes.css). «Tipo lottie» describe el
// RESULTADO que pedía Samuel (un icono que respira solo, en bucle, sin
// hover), y eso es exactamente lo que hace.
//
// Anatomía: la silueta es el path de Flame de lucide —el mismo set de iconos
// que usa todo el sitio, así que no desentona— relleno en vez de trazado, y
// dentro una COPIA a escala que hace de núcleo, en el amarillo cálido de la
// paleta. Dos capas es lo mínimo para que un fuego parezca fuego: una sola
// silueta latiendo se lee como un corazón, no como una llama. Cada capa va
// a su propio ritmo (1.8s la envolvente, 1.1s el núcleo) — los dos tiempos
// son primos entre sí a propósito, así el bucle combinado tarda en repetirse
// y el parpadeo nunca se siente metronómico.
//
// El escalado del núcleo va en el atributo `transform` del <g> (estático) y
// la animación en la clase CSS del <path> (dinámica): si los dos vivieran en
// la misma capa, la animación pisaría el escalado y el núcleo saldría del
// tamaño de la silueta.
export function IconoFuego({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icono-fuego ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="icono-fuego__silueta"
        fill="currentColor"
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
      <g transform="translate(12 21) scale(0.5) translate(-12 -21)">
        <path
          className="icono-fuego__nucleo"
          fill="var(--color-fuego-nucleo)"
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        />
      </g>
    </svg>
  )
}
