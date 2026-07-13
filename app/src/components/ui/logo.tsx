// Wordmark tipográfico — el logo langosta del cliente NO se rediseña sin
// encargo (ver analisis/direccion-visual.md §1); este es el activo de marca
// dominante para el header del rediseño.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-xl font-semibold tracking-tight text-navy ${className}`}>
      Hispaniola
    </span>
  )
}
