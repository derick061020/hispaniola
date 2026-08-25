import * as FancyButton from '@/components/alignui/fancy-button'
import { t } from '@/lib/i18n'
import { formatoDinero } from '@/data/home'
import { type FichaEvento } from '@/data/eventos'

// Barra inferior fija de las landings de evento en móvil.
//
// [2026-08-21, auditoría móvil] POR QUÉ EXISTE: era el agujero más caro del
// flujo de venta. La home tiene su CTA persistente (home/hero.tsx) y la ficha
// de tour el suyo (tour/barra-movil-ficha.tsx), pero las 3 landings de evento
// no tenían NINGUNO — medido en un iPhone de 390px, el widget de reserva/
// cotización vive a ~7.000px de scroll dentro de una página de ~10.700px. Es
// decir: ocho pantallas de galería, descripción, formatos, incluidos y
// paquetes antes de encontrar el primer sitio donde se puede comprar, y ningún
// atajo por el camino. Quien se convencía a mitad de página no tenía dónde
// pulsar.
//
// Es deliberadamente la MISMA pieza que la ficha de tour (mismo alto, mismo
// borde, mismo FancyButton, mismo tratamiento de la zona segura del iPhone):
// el visitante que llega de /tours a /events no debería notar que cambia de
// plantilla. Lo único que cambia es qué dice el precio, porque un evento con
// paquetes y uno que solo se cotiza no venden lo mismo.
//
// pb-[max(...,env(safe-area-inset-bottom))]: mismo motivo que en las otras dos
// barras — sin esto, en un iPhone con home indicator el botón cae justo en la
// franja del gesto de swipe-to-home.
export function BarraMovilEvento({ evento }: { evento: FichaEvento }) {
  // El «desde» sale del paquete MÁS BARATO con precio, no del que esté elegido
  // arriba: es un ancla de escaparate, y el paquete activo puede ser el
  // Premium (US$ 1.188) mientras el Classic entra por 660. Prometer el caro
  // sería espantar; prometer el barato y cobrar el elegido es lo que ya hace
  // la ficha de tour con su `precioLight`.
  // ⚠️ [2026-08-24] EN MODO ESCAPARATE LA BARRA NO PROMETE RESERVA. Desde que
  // MICE enseña los paquetes (UPDATES 08/22, pág. 6) esta landing tiene
  // `paquetes` y, sin este guardia, la barra habría empezado a decir «from
  // US$ 660 · 25% to confirm · Book online» en una página donde no se puede
  // reservar nada y donde el depósito del 25% no existe. `soloEscaparate` cae
  // por tanto en la misma rama que un evento sin paquetes: cotización.
  const precios = (evento.paquetes?.soloEscaparate ? [] : (evento.paquetes?.items ?? []))
    .map((p) => p.precioBase)
    .filter((p): p is number => typeof p === 'number')
  const desde = precios.length > 0 ? Math.min(...precios) : null

  const irAlWidget = () =>
    document.getElementById('evento-widget')?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-linea bg-papel px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="min-w-0">
        {desde !== null ? (
          <>
            <p className="font-display text-base font-semibold text-navy">
              <span className="text-xs font-normal text-navy-soft">{t('from')} </span>
              {formatoDinero(desde)}
            </p>
            <p className="truncate text-xs text-navy-soft">{t('Up to 12 guests · 25% to confirm')}</p>
          </>
        ) : (
          <>
            {/* MICE no publica precio (se cotiza cada evento), así que el hueco
                del precio lo ocupa lo único concreto que sí se puede prometer:
                que la respuesta llega, y cuándo. `cierreMeta` ya es ese copy
                aprobado por landing — no se inventa uno nuevo aquí. */}
            <p className="font-display text-base font-semibold text-navy">{t('Free quote')}</p>
            <p className="truncate text-xs text-navy-soft">{evento.cierreMeta}</p>
          </>
        )}
      </div>

      <FancyButton.Root variant="primary" className="shrink-0" onClick={irAlWidget}>
        {desde !== null ? 'Book online' : evento.ctaPrincipal}
      </FancyButton.Root>
    </div>
  )
}
