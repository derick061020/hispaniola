import { Check, X } from 'lucide-react'
import { formatoDinero, type Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Comparador Light vs Premium (correcciones v2, plan 01 §2 — slides 16 y 17).
//
// El cliente puso la flecha en un hueco concreto: DESPUÉS de «qué llevar» y
// ANTES del bloque de menú. Es el sitio correcto — prepara la lectura del
// menú, que es donde vive la diferencia real entre los dos paquetes.
//
// ⚠️ Esta comparación EXISTIÓ y se quitó. En la Fase B estaba fundida dentro
// del bloque de menú y Samuel pidió retirarla el 2026-07-17 («quita la
// comparativa y deja que cada menú diga su precio»). Vuelve como SECCIÓN
// PROPIA, que es lo que el cliente dibuja — así no se repite el error que
// motivó quitarla: no compite con el menú, lo introduce.
//
// Es el primer bloque del sitio en modo oscuro/oro. Usa los tokens
// --color-premium-* (styles/tokens.css), que son un MODO DE PRODUCTO y no una
// paleta de marca: viven solo donde se vende Premium.
//
// Los 4 diferenciales salen de `ficha.ventajasPremium`, el MISMO array que
// consume la caja de upsell del widget — si fueran dos listas acabarían
// diciendo cosas distintas.

export function ComparadorPremium({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  const ventajas = ficha.ventajasPremium
  const upgrade = ficha.upgradePremium
  const precioLight = tour.precioLight

  // Sin las tres piezas no hay comparación que hacer. Ausencia silenciosa: el
  // charter y Saona no venden por paquetes y aquí no pintan nada.
  if (!ventajas || ventajas.length === 0 || upgrade === null || precioLight === null) return null

  return (
    <section
      id="ancla-comparador"
      className="overflow-hidden rounded-card bg-premium-fondo p-6 sm:p-10"
    >
      <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-premium-oro">
        Light o Premium
      </p>
      <h2 className="mt-3 font-display text-h3 font-semibold text-premium-texto">
        La misma ruta, dos maneras de vivirla
      </h2>
      <p className="mt-3 max-w-xl text-premium-texto-suave">
        Mismo barco, mismo itinerario, mismas paradas. Lo que cambia es lo que te sirven a bordo.
      </p>

      {/* La píldora del delta: el argumento entero cabe en una frase. */}
      <p className="mt-5 inline-flex rounded-full bg-premium-oro-suave px-4 py-1.5 text-sm font-semibold text-premium-oro">
        Toda la diferencia son {formatoDinero(upgrade)} por persona
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* PREMIUM primero y destacado: es lo que el cliente quiere que domine
            la vista. Que domine la VISTA no es lo mismo que dominar el precio
            — el ancla del sitio sigue siendo el Light. */}
        <div className="rounded-card border border-premium-borde bg-premium-superficie p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-premium-texto">Premium</h3>
            <span className="rounded-full bg-premium-oro px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-premium-fondo">
              La más elegida
            </span>
          </div>
          <p className="mt-1 font-display text-2xl font-semibold text-premium-oro">
            {formatoDinero(precioLight + upgrade)}
            <span className="ml-1 text-sm font-normal text-premium-texto-suave">por persona</span>
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {ventajas.map((v) => (
              <li key={v} className="flex items-start gap-2.5 text-sm text-premium-texto">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-premium-oro"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* LIGHT: sobrio, pero NO castigado. Es un producto que se vende, no el
            «malo» de la comparación — y además es el precio que ancla todo el
            sitio. Las mismas 4 líneas tachadas bajo «no incluye» dicen lo que
            te pierdes sin llamar mala a la opción barata. */}
        <div className="rounded-card border border-premium-borde/60 p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-premium-texto">Light</h3>
          </div>
          <p className="mt-1 font-display text-2xl font-semibold text-premium-texto">
            {formatoDinero(precioLight)}
            <span className="ml-1 text-sm font-normal text-premium-texto-suave">por persona</span>
          </p>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-premium-texto-suave">
            No incluye
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {ventajas.map((v) => (
              <li
                key={v}
                className="flex items-start gap-2.5 text-sm text-premium-texto-suave line-through decoration-premium-texto-suave/40"
              >
                <X className="mt-0.5 size-4 shrink-0 no-underline" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
