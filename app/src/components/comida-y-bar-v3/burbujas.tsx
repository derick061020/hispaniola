// BURBUJAS EN CSS — portadas de la landing de agentes (landing-advisors-
// hispaniola-b2b: `BajoElAgua.tsx`, `data/burbujas.ts` y `.burbuja` de su
// index.css), sin cambiar el mecanismo: cada burbuja es un <span> con su
// columna, tamaño, duración y desfase en variables CSS, y UNA sola animación
// (`comida3-burbuja-sube`, comida-y-bar-v3.css) que solo toca transform y
// opacity — no repinta nada, va en la capa de composición.
//
// [2026-10-21, /food-and-bar] Aquí no llenan una sección: suben en
// columnas cortas DETRÁS de las bebidas del Open Bar (la «chispa» del vaso) y
// del cierre. El agua de fondo (shader del museo) ya pone sus propias
// burbujas lejanas; estas son las de primer plano.
//
// Lista FIJA, no aleatoria: el HTML del servidor y el del cliente coinciden y
// cada recarga se ve igual. Con `prefers-reduced-motion` no se pintan (CSS).
//
// [QA 2026-10-21: 91 burbujas animándose a la vez, long tasks de 600 ms a
// 1440] Menos por columna, y cada grupo se PAUSA fuera de pantalla
// (IntersectionObserver → `data-quieta`, comida-y-bar-v3.css).
import { useEffect, useRef } from 'react'

type Burbuja = { x: string; s: string; d: string; w: string }

// Doce de la lista de la landing, re-escaladas a una columna estrecha.
const COLUMNA: Burbuja[] = [
  { x: '18%', s: '6px', d: '6.9s', w: '-0.7s' },
  { x: '34%', s: '4px', d: '6.2s', w: '-2.4s' },
  { x: '58%', s: '10px', d: '7.1s', w: '-1.0s' },
  { x: '72%', s: '5px', d: '5.9s', w: '-3.3s' },
  { x: '44%', s: '8px', d: '7.6s', w: '-4.8s' },
  { x: '26%', s: '4px', d: '6.6s', w: '-5.6s' },
  { x: '64%', s: '6px', d: '8.2s', w: '-6.1s' },
  { x: '50%', s: '12px', d: '8.8s', w: '-2.9s' },
  { x: '80%', s: '4px', d: '6.4s', w: '-4.2s' },
  { x: '12%', s: '8px', d: '7.9s', w: '-7.0s' },
  { x: '40%', s: '5px', d: '5.6s', w: '-1.6s' },
  { x: '86%', s: '7px', d: '7.3s', w: '-5.1s' },
]

type Props = {
  /** Cuántas de la lista (de 1 a 12). */
  cantidad?: number
  /** Cuánto suben, en unidades CSS (por defecto, el alto del contenedor). */
  altura?: string
  className?: string
}

export function Burbujas({ cantidad = 8, altura = '100%', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const vigia = new IntersectionObserver(([e]) => el.toggleAttribute('data-quieta', !e.isIntersecting), {
      rootMargin: '100px',
    })
    vigia.observe(el)
    return () => vigia.disconnect()
  }, [])
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`comida3-burbujas pointer-events-none absolute ${className}`}
      style={{ ['--comida3-subida' as string]: altura }}
    >
      {COLUMNA.slice(0, cantidad).map((b, i) => (
        <span
          key={i}
          className="comida3-burbuja"
          style={{ ['--x' as string]: b.x, ['--s' as string]: b.s, ['--d' as string]: b.d, ['--w' as string]: b.w }}
        />
      ))}
    </span>
  )
}
