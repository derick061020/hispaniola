import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { formatoDinero, type Tour } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'

// Barra inferior fija de la ficha en móvil (wireframe A5) — el CTA persistente
// que la home resolvió con su propio sticky (hero.tsx). Con la ficha entera de
// scroll por delante, el widget desaparece pronto: sin esto, el visitante que
// termina de leer el itinerario no tiene dónde reservar.
//
// Mismo idioma que el CTA sticky del hero: bg-papel + border-t hairline.
export function BarraMovilFicha({ tour }: { tour: Tour }) {
  const irAlWidget = () => document.getElementById('ficha-widget')?.scrollIntoView({ block: 'center' })

  const claseCta =
    'inline-flex shrink-0 items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark'

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-linea bg-papel px-5 py-3 md:hidden">
      <div className="min-w-0">
        <p className="font-display text-base font-semibold text-navy">
          {tour.precioLight !== null ? formatoDinero(tour.precioLight) : 'Consultar'}
          {tour.precioLight !== null ? <span className="text-xs font-normal text-navy-soft"> /pers</span> : null}
        </p>
        <p className="truncate text-xs text-navy-soft">
          ★ {tour.rating}
          {tour.booking !== 'consulta' ? ' · Cancela gratis' : ''}
        </p>
      </div>

      {tour.booking === 'completo' ? (
        <button type="button" onClick={irAlWidget} className={claseCta}>
          Elegir fecha
        </button>
      ) : tour.booking === 'cotizacion' ? (
        <EnlacePrototipo className={claseCta}>Cotizar</EnlacePrototipo>
      ) : (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={claseCta}>
          Consultar
        </a>
      )}
    </div>
  )
}
