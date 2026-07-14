import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Dropdown "Nosotros" — layout interno (ancho, columna, links). El chrome
// (card blanca + sombra) lo pone cada variante del header por su cuenta:
// wrapper flotante en 'solida', el notch mismo en 'sobreVideo' (PLAN-v3.md §11.3).
export function DropdownNosotros() {
  return (
    <div className="flex w-60 flex-col gap-0.5 p-2">
      <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
        La tripulación y la flota
      </EnlacePrototipo>
      <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
        El arrecife que reconstruimos
      </EnlacePrototipo>
    </div>
  )
}
