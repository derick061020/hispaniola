import { NAV_NOSOTROS } from '@/data/home'
import { ItemMenu } from './item-menu'

// Dropdown "Nosotros" (PLAN-v3.md §12) — grid de 2 columnas de ItemMenu,
// ancho fijo w-notch-panel (624px) como div propio colgado de su botón
// (nav-tabs.tsx) — no relacionado con ningún contenedor que lo "abrace"
// (ese acoplamiento existía con NotchMenu, retirado 2026-07-21 6ª vuelta).
// 3 ítems (tripulación, arrecife, blog) → 2 columnas × 2 filas (1 celda
// vacía), la 3ª entrada (blog) es de 2026-07-20, correcciones v1 del cliente.
//
// v3-F13 (PLAN-v3.md §15.4): variante compacta (448px) entre md y lg, mismo
// ancho que ya usan los megamenús en ese rango por la misma razón (menos
// sitio libre en el viewport a ese breakpoint).
export function DropdownNosotros() {
  return (
    <div className="grid w-notch-panel-compacto grid-cols-2 gap-1 p-3 lg:w-notch-panel">
      {NAV_NOSOTROS.map((item) => (
        <ItemMenu key={item.id} item={item} />
      ))}
    </div>
  )
}
