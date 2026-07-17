import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { CircleHelp, Compass, Fish, MessageCircle, TicketCheck, Users } from 'lucide-react'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import type { ItemNav } from '@/data/home'

const ICONOS: Record<string, ComponentType<{ className?: string }>> = {
  tripulacion: Users,
  arrecife: Fish,
  faq: CircleHelp,
  reserva: TicketCheck,
  guias: Compass,
  contacto: MessageCircle,
}

// Ítem del notch dinámico (PLAN-v3.md §12.1) — icono + título + descripción,
// para los dropdowns "simples" (Nosotros/Ayuda): antes eran solo una lista de
// links, y el panel (240/224px) no mandaba sobre la fila de tabs (457px) —
// la caja del notch se quedaba en el ancho de los tabs y el panel flotaba
// centrado con aire muerto a los lados (§12.0).
//
// El chip es un CUADRADO gris (decisión de Samuel, 2026-07-14) — no el
// círculo aqua de WhyDirect. El hover se INVIERTE (chip gris → blanco, fila
// blanca → gris) a propósito: si el chip se quedara gris dentro del hover
// (también gris), los dos se fundirían en una sola mancha y el chip
// "desaparecería" bajo el ratón.
//
// v3-F13 (PLAN-v3.md §15.4): entre md y lg el panel va en su variante
// compacta (448px, sin sitio para 2 columnas con descripción — cada celda
// daría ~160px, 6 líneas de texto). La descripción se oculta ahí (`hidden
// lg:block`), quedando chip + título — misma decisión que ya tomó Samuel
// para el móvil, aplicada a la franja donde el ancho tampoco da.
export function ItemMenu({ item }: { item: ItemNav }) {
  const Icono = ICONOS[item.id]
  const clases = 'group flex gap-3 rounded-lg p-3 transition-colors hover:bg-papel-hueso'
  const contenido = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-btn bg-papel-hueso text-navy-soft transition-colors group-hover:bg-papel group-hover:text-aqua-dark">
        <Icono className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold text-navy">{item.nombre}</span>
        <span className="mt-0.5 hidden text-xs text-navy-soft lg:block">{item.descripcion}</span>
      </span>
    </>
  )

  // Con `to` es página real (Link SPA — hoy solo "El arrecife…" → /sostenibilidad);
  // sin él sigue siendo placeholder del prototipo. Misma unión por dato que las
  // ocasiones del megamenú.
  if (item.to) {
    return (
      <Link to={item.to} className={clases}>
        {contenido}
      </Link>
    )
  }
  return <EnlacePrototipo className={clases}>{contenido}</EnlacePrototipo>
}
