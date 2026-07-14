import { useState } from 'react'
import { TICKER_ITEMS, type TickerItem } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { useDevFlag } from '@/dev/use-dev-flag'

// Ticker del hero (v3) — sustituye a la baraja de v2 (app/PLAN-v3.md §7).
// Los 4 tours + las 6 ocasiones desfilan en loop infinito por el pie del
// hero; cada card lleva a su ficha (EnlacePrototipo).
//
// ⚠️ Para el traspaso a Figma (playbook animaciones-a-figma): loop infinito
// → componente interactivo (variante A: pista en x=0: variante B: pista en
// x=-50%) + Smart Animate Linear, duración = --ticker-duracion.
export function TickerHero() {
  const [estadoDev, setEstadoDev] = useState<'pausado' | 'estatico' | null>(null)
  // [dev-mode] ver src/dev/dev-registry.ts
  useDevFlag('dev-ticker', (v) => {
    if (v === 'pausado' || v === 'estatico') setEstadoDev(v)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const estatico = estadoDev === 'estatico' || reducirMovimiento

  return (
    <div className={`ticker-wrapper ${estatico ? 'ticker-wrapper--estatico' : ''}`}>
      <div className={`ticker-pista ${estadoDev === 'pausado' ? 'ticker-pista--pausada' : ''}`}>
        {TICKER_ITEMS.map((item) => (
          <TickerCard key={item.id} item={item} />
        ))}
        {/* Segunda copia para el loop del -50%: oculta a lectores de pantalla
            y sin tab-stops propios (PLAN-v3.md §7.3). Si es estático
            (reduced-motion o ?dev-ticker=estatico) no hace falta duplicar. */}
        {!estatico
          ? TICKER_ITEMS.map((item) => <TickerCard key={`dup-${item.id}`} item={item} oculto />)
          : null}
      </div>
    </div>
  )
}

function TickerCard({ item, oculto = false }: { item: TickerItem; oculto?: boolean }) {
  return (
    <EnlacePrototipo
      className="ticker-card flex h-ticker-alto w-60 shrink-0 items-center gap-3 rounded-card bg-papel p-2 pr-4 shadow-card"
      aria-hidden={oculto || undefined}
      tabIndex={oculto ? -1 : undefined}
    >
      <img src={`/fotos/${item.foto}.webp`} alt="" className="aspect-square h-full shrink-0 rounded-lg object-cover" />
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-navy">{item.nombre}</p>
        <p className="truncate text-xs text-navy-soft">{item.meta}</p>
      </div>
    </EnlacePrototipo>
  )
}
