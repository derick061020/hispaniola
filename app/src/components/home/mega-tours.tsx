import { Link } from 'react-router-dom'
import { TOURS, bookingCta, formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Megamenú Tours — el escaparate: los 4 productos, camino directo al dinero
// (ver NOTAS['home-megamenu-tours'] del prototipo). Cada tour lleva a su ficha
// real (/tours/:slug); la salida "Ver los N tours" sigue en el prototipo — el
// listado depende del motor de reservas, como el funnel.
//
// v3-F14.3 (decisión de Samuel, 2026-07-14): las cards se DESNUDAN. Antes eran
// la TourCard de la sección "Nuestros tours" encogida — mismo anatómico (marco,
// chip de audiencia, precio en su bloque). Tres problemas: (1) las mismas 4
// cards reaparecen media pantalla más abajo, en el grid, así que el menú no
// aportaba nada nuevo y se leía como un trozo de página pegado al header;
// (2) un menú es superficie de NAVEGACIÓN y una card es superficie de DECISIÓN
// —precio, chip, marco— y decidir dentro de un panel que se cierra al salir el
// ratón es pedirle al usuario que se comprometa contra reloj; (3) a 200px por
// card ni la foto vendía ni el texto dejaba comparar.
//
// Ahora: foto grande, nombre y una línea de meta. Sin marco, sin chip y sin
// bloque de precio — el precio se queda como TEXTO (en un operador de tours sí
// ayuda en el menú: responde "¿me lo puedo permitir?" antes del clic), con el
// mismo idioma que la card del ticker («Desde US$ 99 · 4 h»). El hover es el
// mismo que el megamenú de Eventos (zoom de foto + título en aqua): los dos
// menús hablan por fin el mismo lenguaje.
export function MegaTours() {
  return (
    // Ancho responsivo, no solo "min(92vw, …)": entre md y xl el notch
    // centrado no tiene sitio para un megamenú ancho sin tapar el logo/Reservar
    // — en ese rango va a 2 columnas y más angosto. Desde xl (1280px) vuelve a
    // 4 columnas.
    // v3-F13 (PLAN-v3.md §15.4): 55rem restaurado — con la fila del header
    // ensanchada a max-w-contenido (1400px, antes max-w-6xl/1152px) el margen
    // libre a cada lado del notch vuelve a crecer con el viewport; a 1280px
    // sobran ~968px, de sobra para 880px (55rem) con margen real.
    <div className="w-[min(92vw,28rem)] p-4 xl:w-[min(92vw,55rem)]">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {TOURS.map((t) => (
          <Link key={t.slug} to={`/tours/${t.slug}`} className="group block">
            {/* El zoom vive en el contenedor con overflow-hidden, no en el
                <img>: escalar la imagen suelta crecería su caja y empujaría al
                texto de debajo. */}
            <span className="block h-36 overflow-hidden rounded-card bg-papel-hueso">
              <img
                src={`/fotos/${t.foto}.webp`}
                alt=""
                aria-hidden="true"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="mt-2 block font-display text-sm font-semibold leading-tight text-navy transition-colors group-hover:text-aqua-dark">
              {t.nombre}
            </span>
            <span className="mt-0.5 block text-xs text-navy-soft">
              {t.precioLight !== null ? (
                <>
                  Desde <span className="font-semibold text-navy">{formatoDinero(t.precioLight)}</span> ·{' '}
                </>
              ) : (
                // Isla Saona no tiene precio publicado (datos.js): en vez de
                // inventarlo, el menú dice cómo se pide — "Consultar".
                <>{bookingCta[t.booking]} · </>
              )}
              {t.duracionCorta}
            </span>
          </Link>
        ))}
      </div>

      {/* La salida al catálogo completo: el menú deja de intentar ser el grid,
          así que tiene que llevar a él. TOURS.length, no un "4" a mano — si
          entra un quinto tour, el texto no miente. */}
      <div className="mt-4 flex justify-end border-t border-linea pt-3">
        <EnlacePrototipo className="text-sm font-semibold text-aqua-dark hover:underline">
          Ver los {TOURS.length} tours →
        </EnlacePrototipo>
      </div>
    </div>
  )
}
