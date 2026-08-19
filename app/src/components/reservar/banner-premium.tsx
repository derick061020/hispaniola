import { useState } from 'react'
import { Check, ChevronDown, Crown } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

// Banner de upgrade a Premium DENTRO del checkout (2026-08-07, pedido de
// Samuel: «un banner arriba del widget en el booking que pregunte si quieres
// mejorar a premium por solo la diferencia»).
//
// Por qué existe: hasta ahora, quien entraba al funnel con Light no tenía
// ninguna manera de subir a Premium — había que volver a la ficha y
// reconfigurar la reserva entera. Son US$ 15 por persona y es el upsell que el
// sitio empuja en todas partes MENOS donde ya está la tarjeta de pago.
//
// PLEGABLE, no descartable con una «x» (Samuel dudó entre las dos y se queda
// la segunda): una «x» lo mata para siempre y quien la pulsa sin leer pierde la
// oferta; plegado sigue ahí, en una línea, y se vuelve a abrir. Por defecto
// abierto — el argumento son las 4 ventajas, no el titular.
//
// Es LA MISMA PIEZA que la caja de upsell del widget de la ficha: mismos tokens
// premium (fondo, oro, texto) y el mismo botón `.premium-thumb`, que es el
// dorado 3D del selector. En Figma es un componente con dos usos, no dos cajas
// doradas parecidas. Y consume el MISMO array `ventajasPremium` de la ficha,
// así que no pueden desincronizarse.
export function BannerPremium({
  upgrade,
  personas,
  totalActual,
  ventajas,
  onCambiar,
}: {
  /** Sobrecoste por persona del Premium. */
  upgrade: number
  personas: number
  /** Total con el paquete Light, para poder enseñar el salto completo. */
  totalActual: number
  ventajas: string[]
  onCambiar: () => void
}) {
  const [abierto, setAbierto] = useState(true)
  const diferencia = upgrade * personas

  return (
    <div className="mb-4 overflow-hidden rounded-card bg-premium-fondo">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <Crown className="mt-0.5 size-5 shrink-0 text-premium-oro" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-premium-oro">
            {t('Upgrade to Premium for')}{' '}{formatoDinero(upgrade)} {t('per person?')}
          </span>
          {/* Plegado, el banner tiene que seguir diciendo QUÉ se gana o es una
              línea muerta que nadie vuelve a abrir — y lo dice con las propias
              ventajas del tour, no con un claim escrito aparte que mañana se
              desincroniza. Abierto sobra: la lista está tres píxeles más abajo. */}
          {!abierto ? (
            <span className="mt-0.5 block truncate text-xs text-premium-texto">
              {ventajas.slice(0, 2).join(' · ')}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`mt-0.5 size-5 shrink-0 text-premium-oro transition-transform ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {abierto ? (
        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-1.5">
            {ventajas.map((v) => (
              <li key={v} className="flex items-start gap-2 text-xs text-premium-texto">
                <Check className="mt-0.5 size-3.5 shrink-0 text-premium-oro" strokeWidth={3} aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>

          {/* El salto completo, en dinero y para ESTE grupo — no un «+US$ 15»
              suelto que en un grupo de 4 se queda corto por cuatro. */}
          <p className="mt-3 text-xs text-premium-texto">
            {t('Your total would go from')}{' '}<span className="font-semibold">{formatoDinero(totalActual)}</span> {t('to')}{' '}
            <span className="font-semibold">{formatoDinero(totalActual + diferencia)}</span> (+
            {formatoDinero(diferencia)}).
          </p>

          <button
            type="button"
            onClick={onCambiar}
            className="premium-thumb mt-3 w-full rounded-full px-4 py-2 text-xs font-bold text-premium-fondo transition hover:brightness-110"
          >
            {t('Switch to Premium')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
