import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Dropdown "Ayuda" — layout interno (ancho, columna, links). El chrome
// (card blanca + sombra) lo pone cada variante del header por su cuenta:
// wrapper flotante en 'solida', el notch mismo en 'sobreVideo' (PLAN-v3.md §11.3).
export function DropdownAyuda() {
  return (
    <div className="flex w-56 flex-col gap-0.5 p-2">
      <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
        Preguntas frecuentes
      </EnlacePrototipo>
      <a
        href="https://wa.me/18293052804"
        target="_blank"
        rel="noopener"
        className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
      >
        Contacto y WhatsApp
      </a>
      <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
        Gestionar mi reserva
      </EnlacePrototipo>
    </div>
  )
}
