import { NAV_SOSTENIBILIDAD } from '@/data/home'
import { ItemMenu } from './item-menu'

// Dropdown "Sostenibilidad" (correcciones v2, plan 02 §1 — 2026-07-27).
// Sostenibilidad sube a tab propio del nav principal por pedido del cliente
// en la reunión del 07-24; hasta ahora era un sub-ítem de «Nosotros».
//
// Solo 2 ítems, así que NO se reutiliza el grid de 2 columnas de
// DropdownNosotros/DropdownAyuda: con 2 celdas en una rejilla de 2 columnas
// el panel de 624px queda con una sola fila muy ancha y media pantalla de
// aire. Aquí va en UNA columna y con el panel compacto — el panel se ajusta
// al contenido en vez de que el contenido se estire para llenar el panel.
//
// Mismo criterio que Samuel ya fijó para la 4ª celda de Ayuda: no se inventa
// un destino para cuadrar la rejilla, se ajusta la rejilla.
export function DropdownSostenibilidad() {
  return (
    <div className="grid w-notch-panel-compacto grid-cols-1 gap-1 p-3">
      {NAV_SOSTENIBILIDAD.map((item) => (
        <ItemMenu key={item.id} item={item} />
      ))}
    </div>
  )
}
