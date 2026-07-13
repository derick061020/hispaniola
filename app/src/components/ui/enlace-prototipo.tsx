import type { AnchorHTMLAttributes } from 'react'

// Enlace a una página que existe en prototipo/ (el wireframe navegable) pero
// no en este build — que solo cubre la home (ver app/PLAN.md "Qué NO hacer").
// No navega: el propósito es mostrar el contenido real en su lugar (nav,
// megamenú, footer) sin fingir una ruta que no existe todavía en React.
export function EnlacePrototipo({
  children,
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="#"
      title="Vive en el prototipo navegable (prototipo/) — no es parte de este build"
      onClick={(e) => e.preventDefault()}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}
