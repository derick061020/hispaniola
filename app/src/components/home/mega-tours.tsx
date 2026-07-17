import { Link } from 'react-router-dom'
import { TOURS, bookingCta, formatoDinero } from '@/data/home'

// Megamenú Tours — el escaparate: los 4 productos, camino directo al dinero
// (ver NOTAS['home-megamenu-tours'] del prototipo). Cada tour lleva a su ficha
// real (/tours/:slug). Sin salida "Ver los N tours →" al pie (2026-07-17,
// pedido de Samuel): el menú YA muestra los 4 productos completos, así que
// ese link no llevaba a ningún catálogo más grande — era un paso muerto.
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
    // Ancho AUTOAJUSTADO (2026-07-17, pedido de Samuel): ya no un rem fijo
    // por breakpoint — el panel es `w-fit`, así que mide exactamente lo que
    // ocupan sus columnas (--spacing-mega-card-ancho × Nº de columnas + gaps
    // + padding), con un tope de 92vw como red de seguridad en viewports
    // angostos. Entre md y xl, 2 columnas (2×200px = 448px, igual que antes);
    // desde xl (1280px), 4 columnas (880px, el mismo ancho de siempre — pura
    // coincidencia matemática con el 55rem que tenía antes a mano, porque el
    // valor salía de esta misma cuenta).
    <div className="w-fit max-w-[92vw] p-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {TOURS.map((t) => (
          <Link key={t.slug} to={`/tours/${t.slug}`} className="group block w-mega-card-ancho">
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
    </div>
  )
}
