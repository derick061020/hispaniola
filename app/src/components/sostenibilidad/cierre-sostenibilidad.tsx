import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Cierre — la 5ª sección de sustainability.php ("Leaving a Positive Footprint"),
// en la banda navy que ya usan las landings de evento (mismo patrón que
// evento/cierre-evento.tsx). Sin CTA: el "Ver disponibilidad" canónico vive en
// el Footer Océano, justo debajo — duplicarlo aquí serían dos botones pegados.
// Rediseño 2026-07-17: tipografía más grande (text-h2, antes text-h3) — como
// declaración final de la página, no una card de meta más.
export function CierreSostenibilidad() {
  return (
    <section className="sost-reveal rounded-card bg-navy p-8 sm:p-12">
      <h2 className="max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        {SOSTENIBILIDAD.cierreTitulo}
      </h2>
      <p className="mt-4 max-w-2xl text-lead text-white/80">{SOSTENIBILIDAD.cierreTexto}</p>
    </section>
  )
}
