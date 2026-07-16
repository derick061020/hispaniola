import * as FancyButton from '@/components/alignui/fancy-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { formatoDinero, type Tour } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'

// Barra inferior fija de la ficha en móvil (wireframe A5) — el CTA persistente
// que la home resolvió con su propio sticky (hero.tsx). Con la ficha entera de
// scroll por delante, el widget desaparece pronto: sin esto, el visitante que
// termina de leer el itinerario no tiene dónde reservar.
//
// Mismo idioma que el CTA sticky del hero: bg-papel + border-t hairline.
// Etapa A: el CTA es el mismo FancyButton primary del widget — un solo
// lenguaje de botón de acción en toda la ficha (PLAN-ALIGNUI.md).
export function BarraMovilFicha({ tour }: { tour: Tour }) {
  const irAlWidget = () => document.getElementById('ficha-widget')?.scrollIntoView({ block: 'center' })

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
        <FancyButton.Root variant="primary" className="shrink-0" onClick={irAlWidget}>
          Elegir fecha
        </FancyButton.Root>
      ) : tour.booking === 'cotizacion' ? (
        <FancyButton.Root variant="primary" className="shrink-0" asChild>
          <EnlacePrototipo>Cotizar</EnlacePrototipo>
        </FancyButton.Root>
      ) : (
        <FancyButton.Root variant="primary" className="shrink-0" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            Consultar
          </a>
        </FancyButton.Root>
      )}
    </div>
  )
}
