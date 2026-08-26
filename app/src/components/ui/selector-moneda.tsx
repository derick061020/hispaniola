import { useSyncExternalStore } from 'react'
import { ChevronDown } from 'lucide-react'
import { t } from '@/lib/i18n'
import {
  escuchaMoneda,
  fijaMoneda,
  hayTasa,
  instantaneaMoneda,
  monedaActiva,
  MONEDAS_DISPONIBLES,
  SIMBOLO,
  type Moneda,
} from '@/lib/moneda'

// [2026-08-26, reportado por el cliente: «el cambio de monedas en el checkout
// no funciona»] Y no funcionaba: la cabecera del checkout pintaba un <button>
// con la palabra «USD» y un chevron que no abría nada —lo decía su propio
// comentario— mientras el selector de verdad vivía solo en el pie, que en el
// funnel de pago no se pinta. Desde fuera parecia un desplegable roto.
//
// Ahora hay UN selector y se usa en los dos sitios. Es un <select> nativo a
// propósito: en móvil abre la rueda del sistema, se maneja con el teclado y no
// hay que mantener un dropdown propio para tres opciones. El chevron se dibuja
// aparte porque `appearance-none` se lleva por delante el del navegador.
//
// Una divisa sin cambio del día sale deshabilitada en vez de mentir con un
// precio inventado; es el mismo criterio que `lib/moneda.ts`.

type Tono = 'claro' | 'oscuro'

const ESTILO: Record<Tono, { caja: string; texto: string; chevron: string }> = {
  // Cabecera del checkout: sobre papel, discreto, como el resto del header.
  claro: {
    caja: 'text-navy-sub transition-colors hover:text-navy',
    texto: 'text-sm font-medium text-current',
    chevron: 'right-0 text-current',
  },
  // Pie de página: sobre navy, con la misma caja que tenía el <select> viejo.
  oscuro: {
    caja: 'rounded-btn border border-white/20 bg-white/10 px-3 py-2 focus-within:ring-2 focus-within:ring-white/30',
    texto: 'text-sm text-white',
    chevron: 'right-2 text-white/60',
  },
}

export function SelectorMoneda({
  tono = 'claro',
  className = '',
  id = 'selector-moneda',
}: {
  tono?: Tono
  className?: string
  id?: string
}) {
  // La instantánea lleva contador además de la moneda: cuando llegan las tasas
  // del día la moneda sigue siendo la misma y, sin él, React se ahorraría el
  // repintado y las opciones se quedarían deshabilitadas para siempre.
  useSyncExternalStore(escuchaMoneda, instantaneaMoneda, () => 'USD|0')
  const moneda = monedaActiva()
  const estilo = ESTILO[tono]

  return (
    <div className={`relative inline-flex items-center ${estilo.caja} ${className}`}>
      <select
        id={id}
        value={moneda}
        onChange={(e) => fijaMoneda(e.target.value as Moneda)}
        aria-label={t('Currency')}
        className={`cursor-pointer appearance-none bg-transparent pr-5 focus:outline-none ${estilo.texto}`}
      >
        {MONEDAS_DISPONIBLES.map((m) => (
          <option key={m} value={m} disabled={!hayTasa(m)} className="text-navy">
            {SIMBOLO[m]} {m}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute size-4 ${estilo.chevron}`}
        aria-hidden="true"
      />
    </div>
  )
}
