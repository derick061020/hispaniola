import { Etiqueta } from '@/components/ui/etiqueta'
import { FAQ_HERO } from '@/data/faq'

// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraFaq() {
  return (
    <div>
      <Etiqueta sobreOscuro>{FAQ_HERO.eyebrow}</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{FAQ_HERO.titulo}</h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{FAQ_HERO.sub}</p>
    </div>
  )
}
