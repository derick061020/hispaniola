import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Above the fold de Sostenibilidad — se disuelve en el `children` de
// HeroInterna (PLAN-INTERNAS-V2.md §C1/C5, mismo hero compartido con la home,
// la ficha de tour y las landings de evento), sobre las fotos reales del
// arrecife en fundido en vez de una imagen fija al lado. Sin CTA: esta
// página informa, no cotiza — mismo criterio que antes de adoptar el hero.
// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraSostenibilidad() {
  return (
    <div>
      <Etiqueta sobreOscuro>{SOSTENIBILIDAD.eyebrow}</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {SOSTENIBILIDAD.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{SOSTENIBILIDAD.sub}</p>
    </div>
  )
}
