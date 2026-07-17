import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FAQ_HERO } from '@/data/faq'

export function CabeceraFaq() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">FAQ</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {FAQ_HERO.eyebrow}
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{FAQ_HERO.titulo}</h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{FAQ_HERO.sub}</p>
    </div>
  )
}
