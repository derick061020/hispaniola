import { Link } from 'react-router-dom'
import { NOSOTROS } from '@/data/nosotros'

// Mención sin detalles + botón a Sostenibilidad (2026-07-17, decisión de
// Samuel): desde que Sostenibilidad es tab propio, Nosotros no vuelve a
// contar la historia del arrecife — solo la menciona y manda para allá.
// Mismo criterio que el ítem "El arrecife que reconstruimos" del dropdown
// Nosotros del header (data/home.ts → NAV_NOSOTROS).
export function ArrecifeTeaser() {
  return (
    <section className="rounded-card bg-navy p-8 sm:p-10">
      <h2 className="max-w-2xl font-display text-h3 font-semibold text-white">{NOSOTROS.arrecifeTitulo}</h2>
      <p className="mt-3 max-w-2xl text-lead text-white/80">{NOSOTROS.arrecifeTexto}</p>
      <Link
        to="/sostenibilidad"
        className="mt-6 inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark"
      >
        {NOSOTROS.arrecifeCta}
      </Link>
    </section>
  )
}
