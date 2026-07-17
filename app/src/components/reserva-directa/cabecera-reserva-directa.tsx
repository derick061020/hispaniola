import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'

export function CabeceraReservaDirecta() {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">Reserva directa</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        Reserva directa
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        Mismo tour, mismo precio. Lo que cambia es lo que viene después.
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        En un portal como Viator o Civitatis pagas exactamente lo mismo. Reservando aquí, directo, te llevas esto
        además.
      </p>
    </div>
  )
}
