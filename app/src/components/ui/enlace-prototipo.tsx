import type { AnchorHTMLAttributes } from 'react'
import { t } from '@/lib/i18n'

// Enlace a una página que existe en prototipo/ (el wireframe navegable) pero
// no en este build, que cubre la home + las fichas de tour (/tours/:slug —
// ver app/PLAN-TOURS.md).
//
// Lo que sigue viviendo solo en el prototipo, y por qué: el funnel de reserva
// (4 pasos) y el listado /tours están bloqueados por la decisión del motor
// xpotours (reemplazar / re-skinear), pendiente del cliente; eventos, nosotros,
// guías y las páginas de soporte son otro plan.
//
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
      title={t('Lives in the clickable prototype (prototipo/), not part of this build')}
      onClick={(e) => e.preventDefault()}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}
