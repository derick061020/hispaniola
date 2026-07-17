import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'

export function CabeceraAgentes() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Agentes de viaje</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        Agentes de viaje
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        Registra tu agencia o DMC
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        Coordinamos directo contigo: disponibilidad real, factura fiscal (RD e internacional) y respuesta por
        WhatsApp, no un call center.
      </p>
    </div>
  )
}
