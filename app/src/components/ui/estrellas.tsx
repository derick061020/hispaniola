import { useId } from 'react'

// Fila de 5 estrellas con relleno fraccional. Extraída de
// `insignia-confianza.tsx` (v3-F16, portada de RatingBadge de Untitled UI) al
// construir la ficha de tour, que necesita las mismas estrellas pero sobre
// PAPEL, no sobre el video del hero. En vez de duplicar el trazado SVG —el
// pecado que convertiría un componente de Figma en dos— el original ahora
// consume éste.
//
// `sobreOscuro` decide el color de la estrella VACÍA (la llena es siempre
// --color-estrella): blanco translúcido sobre el video del hero; línea gris
// sobre papel, donde el blanco sería invisible. Misma convención de prop que
// Etiqueta y Logo.

/** Progreso de relleno (0-100) de la estrella N-ésima para una calificación
 *  fraccionaria (4.9 → la 5ª estrella se llena al 90%, no al 100% ni al 0%). */
function progresoEstrella(posicion: number, calificacion: number) {
  const diff = Math.min(Math.max(calificacion, 0), 5) - posicion
  if (diff >= 1) return 100
  if (diff <= 0) return 0
  return Math.round(diff * 100)
}

const TRAZADO_ESTRELLA =
  'M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z'

function EstrellaCalificacion({ progreso, sobreOscuro }: { progreso: number; sobreOscuro: boolean }) {
  const id = useId()
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 shrink-0">
      <path d={TRAZADO_ESTRELLA} fill="currentColor" className={sobreOscuro ? 'text-white/25' : 'text-linea-fuerte'} />
      <g clipPath={`url(#estrella-${id})`}>
        <path d={TRAZADO_ESTRELLA} fill="currentColor" className="text-estrella" />
      </g>
      <defs>
        <clipPath id={`estrella-${id}`}>
          <rect width={`${progreso}%`} height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function Estrellas({
  calificacion,
  sobreOscuro = false,
  className = '',
}: {
  /** 0-5, admite decimales — la última estrella se rellena a fracción. */
  calificacion: number
  sobreOscuro?: boolean
  className?: string
}) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <EstrellaCalificacion key={i} progreso={progresoEstrella(i, calificacion)} sobreOscuro={sobreOscuro} />
      ))}
    </div>
  )
}
