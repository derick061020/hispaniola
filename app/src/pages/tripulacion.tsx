import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { GridEquipo } from '@/components/equipo/grid-equipo'
import { Meta } from '@/components/seo/meta'
import { EQUIPO_PAGINA, TOTAL_EQUIPO, DEPARTAMENTOS } from '@/data/equipo'

// Página Tripulación / Equipo (/tripulacion) — correcciones v2, plan 05.
//
// La ruta se llama /tripulacion porque es la etiqueta que el cliente pidió en
// el menú (reunión 07-24, 26:50), aunque la página incluye contabilidad, RRHH,
// marketing y la fundación — gente que no es tripulación. El H1 dice «las
// personas detrás de cada tour», que es más honesto que «tripulación» y es lo
// que su propia maqueta titulaba.
//
// ⚠️ PÁGINA DE MOLDE: los nombres, retratos y frases son placeholders. Ver la
// cabecera de data/equipo.ts. El aviso también se pinta EN PANTALLA (GridEquipo)
// mientras dure — no basta con un comentario en el código.
export function TripulacionPage() {
  return (
    <div>
      <Meta
        titulo="Tripulación"
        descripcion="Las personas detrás de cada tour de Hispaniola Aquatic Adventures: capitanes, guías, cocina, biología marina, oficina y la fundación."
        ruta="/tripulacion"
      />
      <HeroInterna ctaHref="/#tours">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            {EQUIPO_PAGINA.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            {EQUIPO_PAGINA.titulo}
          </h1>
          <p className="mt-4 text-lg text-white/85">{EQUIPO_PAGINA.lead}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="font-display text-2xl font-semibold text-white">{TOTAL_EQUIPO}</p>
              <p className="text-sm text-white/70">personas en el equipo</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">
                {DEPARTAMENTOS.length}
              </p>
              <p className="text-sm text-white/70">departamentos</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">2012</p>
              <p className="text-sm text-white/70">creciendo juntos</p>
            </div>
          </div>
        </div>
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <GridEquipo />
      </div>

      <Footer />
    </div>
  )
}
