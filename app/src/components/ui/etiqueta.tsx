// Etiqueta de sección ("eyebrow") — v2: en píldora, el recurso que usa la ref.
// Journeo para presentar cada bloque ("• Who we are?"). Sustituye al texto en
// caps suelto que usaba la v1.
//
// `sobreOscuro` la invierte para cuando va sobre navy o sobre foto.
export function Etiqueta({
  children,
  sobreOscuro = false,
  className = '',
}: {
  children: React.ReactNode
  sobreOscuro?: boolean
  className?: string
}) {
  const tono = sobreOscuro
    ? 'bg-white/15 text-white ring-white/25 backdrop-blur-sm'
    : 'bg-aqua-tint text-aqua-dark ring-aqua/15'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-chip px-3 py-1.5 text-eyebrow font-semibold uppercase tracking-[0.12em] ring-1 ring-inset ${tono} ${className}`}
    >
      <span aria-hidden className="size-1 rounded-chip bg-current opacity-60" />
      {children}
    </span>
  )
}
