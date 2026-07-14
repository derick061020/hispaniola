import { NAV_NOSOTROS } from '@/data/home'
import { ItemMenu } from './item-menu'

// Dropdown "Nosotros" (PLAN-v3.md §12) — grid de 2 columnas de ItemMenu, con
// w-notch-panel (512px, mayor que la fila de tabs) para que la caja del
// notch lo abrace en vez de flotar centrado con aire muerto a los lados.
// 2 ítems → 2 columnas × 1 fila, encaja solo.
export function DropdownNosotros() {
  return (
    <div className="grid w-notch-panel grid-cols-2 gap-1 p-3">
      {NAV_NOSOTROS.map((item) => (
        <ItemMenu key={item.id} item={item} />
      ))}
    </div>
  )
}
