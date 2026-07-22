import { Etiqueta } from '@/components/ui/etiqueta'
import { GUIAS_HERO } from '@/data/guias'

// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraGuias() {
  return (
    <div>
      <Etiqueta sobreOscuro>{GUIAS_HERO.eyebrow}</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {GUIAS_HERO.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{GUIAS_HERO.sub}</p>
    </div>
  )
}
