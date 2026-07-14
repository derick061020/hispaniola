import { TOURS, bookingCta, formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Megamenú Tours — el escaparate: 4 productos con foto, audiencia y precio,
// camino directo al dinero (ver NOTAS['home-megamenu-tours'] del prototipo).
// Cada card es EnlacePrototipo: la ficha de tour vive en prototipo/, no aquí.
export function MegaTours() {
  return (
    // Ancho responsivo, no solo "min(92vw, …)": entre md y xl el notch
    // centrado no tiene sitio para 880px sin tapar el logo/Reservar (verificado
    // con Playwright a 768-1024px) — en ese rango va a 2 columnas y más angosto;
    // desde xl (1280px) hay margen de sobra y vuelve a 4 columnas a 880px.
    <div className="grid w-[min(92vw,28rem)] grid-cols-2 gap-3 p-4 xl:w-[min(92vw,55rem)] xl:grid-cols-4">
      {TOURS.map((t) => (
        <EnlacePrototipo
          key={t.slug}
          className="group flex flex-col overflow-hidden rounded-card ring-1 ring-linea transition-colors hover:ring-aqua/50"
        >
          <div className="relative h-24 overflow-hidden bg-papel-hueso">
            <img
              src={`/fotos/${t.foto}.webp`}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-1.5 left-1.5 rounded-chip bg-navy/85 px-2 py-0.5 text-[10px] font-medium text-white">
              {t.audienciaChip}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-2.5">
            <p className="font-display text-sm font-semibold leading-tight text-navy">{t.nombre}</p>
            <p className="text-xs text-navy-soft">{t.duracionCorta}</p>
            <p className="mt-auto text-xs font-semibold text-menta-texto">
              {t.precioLight !== null ? `Desde ${formatoDinero(t.precioLight)}` : bookingCta[t.booking]}
            </p>
          </div>
        </EnlacePrototipo>
      ))}
    </div>
  )
}
