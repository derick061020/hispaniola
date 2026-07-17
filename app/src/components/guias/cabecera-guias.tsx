import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { GUIAS_HERO } from '@/data/guias'

export function CabeceraGuias() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Guías</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {GUIAS_HERO.eyebrow}
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {GUIAS_HERO.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{GUIAS_HERO.sub}</p>
    </div>
  )
}
