import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { NOSOTROS } from '@/data/nosotros'

// Above the fold de Nosotros — children de HeroInterna (PLAN-INTERNAS-V2.md),
// mismo anatómico blanco-sobre-foto que Sostenibilidad y las landings de
// evento: migaja · eyebrow · H1 · sub. Sin CTA: es página de marca, no de
// conversión.
export function CabeceraNosotros() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Nosotros</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {NOSOTROS.eyebrow}
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {NOSOTROS.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{NOSOTROS.sub}</p>
    </div>
  )
}
