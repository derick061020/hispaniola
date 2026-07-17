import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { CONTACTO } from '@/data/home'

// Above the fold de /contacto — children de HeroInterna (PLAN-INTERNAS-V2.md),
// mismo anatómico blanco-sobre-foto que Nosotros y Sostenibilidad: migaja ·
// eyebrow · H1 · lead. Mapea contact.php de la web actual (H1 "Contact Us").
export function CabeceraContacto() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Contacto</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {CONTACTO.eyebrow}
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{CONTACTO.titulo}</h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{CONTACTO.lead}</p>
    </div>
  )
}
