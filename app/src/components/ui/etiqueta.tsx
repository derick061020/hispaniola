// Etiqueta de sección ("eyebrow") — v3-F17.1 (PLAN-v3.md §17.10, pedido de
// Samuel al ver el eyebrow minimal de "Nuestros tours"): todos los eyebrows
// del sitio pasan a este tratamiento — solo el texto, sin píldora ni punto.
// Reemplaza por completo la versión en píldora de v2 (ref. Journeo,
// "• Who we are?"): cero llamadas la usan ya, así que se retira en vez de
// dejarla como variante muerta.
//
// `sobreOscuro` decide el color: aqua-dark sobre papel (aqua puro falla AA a
// 12px, ~4.0:1 contra ~5.9:1 de aqua-dark) o aqua-claro sobre navy/foto
// (aqua-dark se hunde contra el navy — hace falta el pálido para leerse).
export function Etiqueta({
  children,
  sobreOscuro = false,
  className = '',
}: {
  children: React.ReactNode
  sobreOscuro?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-block text-eyebrow font-semibold uppercase tracking-[0.12em] ${sobreOscuro ? 'text-aqua-claro' : 'text-aqua-dark'} ${className}`}
    >
      {children}
    </span>
  )
}
