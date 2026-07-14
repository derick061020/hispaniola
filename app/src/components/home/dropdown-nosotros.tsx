import { NAV_NOSOTROS } from '@/data/home'
import { ItemMenu } from './item-menu'

// Dropdown "Nosotros" (PLAN-v3.md §12) — grid de 2 columnas de ItemMenu, con
// w-notch-panel (624px, mayor que la fila de tabs) para que la caja del
// notch lo abrace en vez de flotar centrado con aire muerto a los lados.
// 2 ítems → 2 columnas × 1 fila, encaja solo.
//
// v3-F13 (PLAN-v3.md §15.4): el notch está centrado y crece simétrico — a
// 624px se come el logo/Reservar por debajo de `lg` (1024px, el punto donde
// el sitio libre alcanza). Entre md y lg va la variante compacta (448px,
// mismo ancho que ya usan los megamenús en ese rango por esta misma razón).
export function DropdownNosotros() {
  return (
    <div className="grid w-notch-panel-compacto grid-cols-2 gap-1 p-3 lg:w-notch-panel">
      {NAV_NOSOTROS.map((item) => (
        <ItemMenu key={item.id} item={item} />
      ))}
    </div>
  )
}
