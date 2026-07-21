import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOG_HERO } from '@/data/blog'

// Cabecera del blog — mismo patrón exacto que CabeceraGuias / CabeceraFaq:
// migaja + eyebrow + H1 + subtítulo, montada dentro del HeroInterna
// compartido (PLAN-INTERNAS-V2.md). El blog es una interna más, no un
// microsite con su propio chrome.
export function CabeceraBlog() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Blog</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {BLOG_HERO.eyebrow}
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {BLOG_HERO.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{BLOG_HERO.sub}</p>
    </div>
  )
}
