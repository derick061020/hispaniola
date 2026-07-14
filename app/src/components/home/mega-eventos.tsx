import { OCASIONES } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Megamenú Eventos — con una condición: cada ítem hace algo real en el
// prototipo (2 landings propias + 4 ocasiones con deep-link preseleccionado).
// Aquí ese destino no existe (fuera de alcance), así que todo es
// EnlacePrototipo — pero el contenido/orden se conserva intacto.
export function MegaEventos() {
  const landings = OCASIONES.filter((o) => o.esLanding)
  const resto = OCASIONES.filter((o) => !o.esLanding)

  return (
    // Mismo ajuste que MegaTours: angosto entre md y xl para no tapar el
    // logo/Reservar del notch centrado; el ancho completo (620px) solo desde
    // xl, donde ya hay margen de sobra a los lados.
    <div className="grid w-[min(92vw,28rem)] grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_1.2fr] xl:w-[min(92vw,38.75rem)]">
      <div className="flex flex-col gap-2">
        {landings.map((o) => (
          <EnlacePrototipo
            key={o.tipo}
            className="rounded-card bg-papel-hueso p-3 ring-1 ring-linea transition-colors hover:ring-aqua/50"
          >
            <p className="font-display text-sm font-semibold text-navy">{o.nombre}</p>
            <p className="mt-0.5 text-xs text-navy-soft">{o.meta}</p>
          </EnlacePrototipo>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 border-l border-linea pl-4">
        {resto.map((o) => (
          <EnlacePrototipo key={o.tipo} className="rounded-lg px-2 py-1.5 hover:bg-papel-hueso">
            <p className="text-sm font-medium text-navy">{o.nombre}</p>
            <p className="text-xs text-navy-soft">{o.meta}</p>
          </EnlacePrototipo>
        ))}
      </div>
    </div>
  )
}
