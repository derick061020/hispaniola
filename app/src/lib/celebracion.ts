import confetti from 'canvas-confetti'

// Celebración con confeti al cargar la página de gracias (2026-07-17,
// pedido de Samuel). Excepción consciente a la regla «solo GSAP» — la
// librería es canvas-confetti (~7 KB gzipped, sin dependencias, vanilla
// JS). Se documenta en el commit del cambio.
//
// COLORES: leídos de los tokens Hispaniola en runtime (no hex mágicos) —
// la página entera ya pasa por tokens.css, el confeti no puede ser la
// excepción. Si la marca cambia de paleta, el confeti se actualiza
// solo. Si getComputedStyle falla (SSR, navegador sin CSSOM), cae a
// los hex del token directamente — sin render roto, solo sin el efecto
// dinámico de tokens.
//
// MOTION: respeta `prefers-reduced-motion: reduce` — el confeti es
// decorativo, no informativo, y los usuarios con vestibular disorders
// merecen llegar a su pantalla de confirmación sin sobresaltos.

// Devuelve el valor de una CSS custom property del :root, con fallback
// al hex literal del token. La fallback es solo defensiva (no debería
// dispararse en runtime normal — los tokens.css están cargados antes
// de que se monte la página).
function token(nombre: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  return v || fallback
}

// Paleta Hispaniola para el confeti. Cuatro colores — más se vuelve
// «anarcocromía» y se pierde la identidad de marca. El `navy` queda
// fuera a propósito: es un azul muy oscuro y se confunde con la
// sombra del papel; mejor reservarlo para tipografía.
function coloresHispaniola(): string[] {
  return [
    token('--color-aqua-dark', '#0b6f7c'),
    token('--color-coral', '#ef5b44'),
    token('--color-menta-texto', '#0c7a5e'),
    token('--color-aqua-claro', '#a9e5ee'),
  ]
}

// Dispara una celebración de confeti. Patrón clásico: dos cañones a
// izquierda y derecha (~0.8s de ráfagas) seguidos de un «big bang»
// central — más vistoso que un único burst, y la duración se siente
// como una transición natural al copy de «¡Nos vemos a bordo!» que
// ya está pintado en pantalla.
//
// Se llama desde un useEffect con [] deps → una sola vez al montar
// la página. Si el usuario navega fuera y vuelve, no se vuelve a
// disparar (es una celebración, no un loop).
export function dispararConfetti(): void {
  // Respetar reduced-motion. canvas-confetti usa canvas 2D con
  // animaciones a 60 fps; para usuarios con vestibular disorders
  // es mejor un check explícito que el silencio del navegador.
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const colores = coloresHispaniola()
  const fin = Date.now() + 800

  // Cañones laterales: ~16 frames a 60 fps disparando desde x:0 y
  // x:1 hacia el centro. El `angle: 60/120` apunta los confetis hacia
  // el medio de la pantalla.
  const canon = (() => {
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colores,
        startVelocity: 55,
        ticks: 200,
        scalar: 0.9,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colores,
        startVelocity: 55,
        ticks: 200,
        scalar: 0.9,
      })
      if (Date.now() < fin) requestAnimationFrame(frame)
    }
    return frame
  })()
  canon()

  // Big bang central un instante después — el remate. Más partículas,
  // un poco más alto en pantalla (y: 0.5) para que se vea «salir del
  // check» que ya está pintado. Sin él la celebración queda floja.
  window.setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.5 },
      colors: colores,
      ticks: 250,
      scalar: 1,
    })
  }, 250)
}
