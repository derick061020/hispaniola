import { Link } from 'react-router-dom'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Cierre — la 5ª sección de sustainability.php ("Leaving a Positive Footprint").
// 2026-07-17 (Samuel): adoptó el mismo idioma visual que el ArrecifeTeaser
// de /nosotros — foto cenital turquesa + gradiente navy encima + texto blanco
// a la izquierda. Mismo asset (/fotos/arrecife-fondo-cenital.webp), mismo
// `rounded-card` y misma técnica de capa (img absolute + gradiente absolute
// + contenido relative). Refuerza la metáfora: "dejar una huella" sobre un
// mar Caribeño real. Sin CTA: el "Ver disponibilidad" canónico vive en el
// Footer Océano, justo debajo — duplicarlo aquí serían dos botones pegados.
// Tipografía grande (text-h2) — declaración final, no una card de meta más.
export function CierreSostenibilidad() {
  return (
    <section className="sost-reveal relative overflow-hidden rounded-card p-8 sm:p-12">
      <img
        src={`/fotos/${SOSTENIBILIDAD.cierreFoto}.webp`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/35" />
      <div className="relative">
        <h2 className="max-w-2xl text-balance font-display text-h2 font-semibold text-white">
          {SOSTENIBILIDAD.cierreTitulo}
        </h2>
        <p className="mt-4 max-w-2xl text-lead text-white/85">{SOSTENIBILIDAD.cierreTexto}</p>

        {/* [v2 2026-07-27, plan 08 §5] Este cierre no tenía CTA a propósito:
            «el "Ver disponibilidad" canónico vive en el Footer Océano, justo
            debajo — duplicarlo serían dos botones pegados». Con el reencuadre
            a VENTAJA COMPETITIVA (§1) ese razonamiento cambia: si la página
            vende en vez de solo informar, necesita su propio remate, y
            «Reserva y deja tu huella» no es el mismo mensaje que el genérico
            del footer.
            El segundo botón lleva a /fundacion — la página nueva donde vive
            todo lo institucional (fundadores, 2016, los 5 proyectos), para no
            duplicar ese contenido aquí. */}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/#tours"
            className="inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Reserva y deja tu huella
          </Link>
          <Link
            to="/fundacion"
            className="inline-flex rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Conoce la Fundación
          </Link>
        </div>
      </div>
    </section>
  )
}
