import { NAV_AYUDA } from '@/data/home'
import { ItemMenu } from './item-menu'

// Dropdown "Ayuda" (PLAN-v3.md §12) — grid de 2 columnas de ItemMenu. 3
// ítems dejan un hueco en la 4ª celda: decisión de Samuel (2026-07-14), se
// queda vacío — sin `col-span` ni un destino inventado para cuadrar la
// rejilla (§12.3).
export function DropdownAyuda() {
  return (
    <div className="grid w-notch-panel grid-cols-2 gap-1 p-3">
      {NAV_AYUDA.map((item) => (
        <ItemMenu key={item.id} item={item} />
      ))}
    </div>
  )
}
