import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOG_HERO } from '@/data/blog'

// Cabecera del blog — mismo patrón exacto que CabeceraGuias / CabeceraFaq:
// eyebrow + H1 + subtítulo, montada dentro del HeroInterna compartido
// (PLAN-INTERNAS-V2.md). El blog es una interna más, no un microsite con su
// propio chrome. Sin migaja (retirada de todos los heros de internas,
// 2026-07-22, pedido de Samuel).
export function CabeceraBlog() {
  return (
    <div>
      <Etiqueta sobreOscuro>{BLOG_HERO.eyebrow}</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {BLOG_HERO.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{BLOG_HERO.sub}</p>
    </div>
  )
}
