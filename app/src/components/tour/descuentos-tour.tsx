import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { DESCUENTOS, DESCUENTO_MAXIMO } from '@/lib/tarifas'

// Bloque de descuentos (correcciones v2, plan 01 §7 — slide 2).
//
// El cliente pegó la URL de su ficha de charter y escribió «falta eso»,
// señalando entre otras cosas la línea de tarifas y descuentos: «hasta 5% para
// clientes habituales · 5% por 30 días de reserva anticipada · 5% de descuento
// en efectivo».
//
// ⚠️ ESTO ES UN ARREGLO DE HONESTIDAD, NO SOLO UN AÑADIDO. El chip del widget
// lleva desde la Fase B prometiendo «reservando directo ahorras hasta 15%» sin
// que en NINGUNA parte del sitio se explicara de dónde sale ese 15%. Este
// bloque es esa explicación. Samuel confirmó el 2026-07-27 que los tres son
// acumulables y que suman 15% plano (no encadenados).
//
// El «cliente que repite» se MUESTRA pero no se auto-aplica: el sitio no tiene
// cuentas ni login, así que no puede verificar que alguien ya haya comprado, y
// una casilla libre de «ya he venido» la marcaría todo el mundo. Lo aplica el
// equipo al confirmar. Esa distinción se dice en pantalla, no se esconde.
export function DescuentosTour() {
  return (
    <section id="ancla-descuentos" className={BLOQUE_FICHA}>
      <TituloSeccion>Cómo pagar menos por el mismo día</TituloSeccion>
      <p className="mt-2 max-w-2xl text-navy-sub">
        Los tres descuentos se acumulan: reservando directo puedes ahorrar hasta un{' '}
        <strong className="text-navy">{DESCUENTO_MAXIMO}%</strong> sobre la tarifa de lista.
      </p>

      <ul className="mt-6 divide-y divide-linea border-t border-linea">
        {DESCUENTOS.map((d) => (
          <li key={d.id} className="flex items-baseline gap-4 py-4">
            <span className="w-14 shrink-0 font-display text-2xl font-semibold text-aqua">
              {d.porcentaje}%
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-navy">{d.etiqueta}</span>
              {!d.autoAplicable ? (
                <span className="mt-0.5 block text-sm text-navy-soft">
                  Lo aplicamos al confirmar tu reserva — dinos que ya has navegado con nosotros.
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
