import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { Meta } from '@/components/seo/meta'
import { MARINE_PARK } from '@/data/marine-park'

// MARINE PARK — página NUEVA de las correcciones v3 (plan 05 §6,
// WEBSITE - NOSOTROS págs. 16–17).
//
// El cliente entrega la página entera escrita: héroe, cuatro bloques
// numerados y la pulsera de la fundación. Lo que aporta al sitio es un LUGAR
// visitable — hasta ahora el museo submarino vivía como una zona más de
// /instalaciones (de donde sale en esta misma tanda) y el coral se contaba
// desde la fundación, que es la organización, no el sitio.
//
// LA ESTRUCTURA NO SE INVENTA: es el patrón editorial que las internas de este
// proyecto ya usan —numeral fantasma + par foto/texto alternando lado— para
// que en Figma esta página sea una composición de componentes existentes y no
// una plantilla nueva. Lo único propio es el bloque de la pulsera, que va sin
// numeral a propósito: no es una parada del parque, es cómo se entra.
//
// ⚠️ Fotos REALES del repo (vivero, museo, arrecife). Faltan las de las
// esculturas —el pelotero, el Diablo Cojuelo, la mesa de dominó—, que son lo
// más vendible de la página: pedidas al cliente. Ver data/marine-park.ts.
export function MarineParkPage() {
  return (
    <div>
      <Meta
        titulo="Marine Park"
        descripcion="Our protected marine area in Punta Cana: an underwater museum, coral restoration, green sea turtles and artificial reefs."
        ruta="/marine-park"
      />
      <HeroInterna
        ctaHref="/#tours"
        imagen={{ src: `/fotos/${MARINE_PARK.heroFoto}.webp`, alt: MARINE_PARK.heroFotoAlt }}
      >
        <CabeceraInterna
          eyebrow={MARINE_PARK.eyebrow}
          titulo={MARINE_PARK.titulo}
          lead={MARINE_PARK.lead}
        />
      </HeroInterna>

      <div className="mx-auto flex max-w-contenido flex-col gap-12 px-5 py-12 sm:px-10 lg:gap-16 lg:py-16">
        {MARINE_PARK.bloques.map((b, i) => (
          <section
            key={b.titulo}
            // Alternan lado: par a la izquierda, impar a la derecha. Es lo que
            // impide que cinco bloques seguidos se lean como una lista.
            className={`grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10 ${
              i % 2 === 1 ? '' : 'lg:[&>figure]:order-2'
            }`}
          >
            <figure className="overflow-hidden rounded-card-grande">
              <img
                src={`/fotos/${b.foto}.webp`}
                alt={b.fotoAlt}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </figure>

            <div className="relative">
              {/* El numeral fantasma del sistema: grande, aqua muy pálido y
                  DETRÁS del título, que se monta encima. Mismo tratamiento que
                  en sostenibilidad y guías. */}
              {b.numero ? (
                <span
                  aria-hidden="true"
                  className="block font-display text-6xl font-semibold leading-none text-aqua-claro/50 sm:text-7xl"
                >
                  {b.numero}
                </span>
              ) : null}
              <h2
                className={`font-display text-h2 font-semibold text-navy ${b.numero ? '-mt-4' : ''}`}
              >
                {b.titulo}
              </h2>
              {/* [2026-09-01, UPDATES 09/01] El aviso de que esto TODAVÍA NO
                  ABRE. Va aquí —entre el título y el claim— y no dentro del H2:
                  metido en el titular alargaría un `text-h2` hasta partirlo en
                  dos líneas en móvil, y además el dato no es parte del nombre
                  del sitio, es su estado.
                  Se pinta con sus PARÉNTESIS, que es como lo pidió el cliente, y
                  en coral: es el color con el que este sitio dice «atención a
                  esto», y el único punto de la página donde se usa. Con el aqua
                  del claim justo debajo se distinguen a la primera. */}
              {b.lanzamiento ? (
                <p className="mt-1 text-sm font-semibold text-coral">({b.lanzamiento})</p>
              ) : null}
              <p className="mt-1 font-display text-lg font-semibold text-aqua-dark">{b.claim}</p>

              <div className="mt-4 flex flex-col gap-3">
                {b.parrafos.map((p) => (
                  <p key={p.slice(0, 40)} className="text-navy-sub">
                    {p}
                  </p>
                ))}
              </div>

              {b.checks?.length ? (
                <ul className="mt-5 flex flex-col gap-2 border-t border-linea pt-4">
                  {b.checks.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-navy">
                      <Check className="mt-0.5 size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}

        {/* El puente a las otras dos páginas del mismo tema. Existe para que la
            división no haya que deducirla: aquí está el LUGAR, en la fundación
            la ORGANIZACIÓN. Sin este enlace, las dos se leen como la misma
            página contada dos veces — que es justo el riesgo que el plan
            señalaba. */}
        <p className="text-navy-sub">
          The work behind this park is run by our own foundation.{' '}
          <Link
            to="/foundation"
            className="font-semibold text-aqua-dark underline underline-offset-4 hover:text-aqua"
          >
            See what the Bávaro Reefs Foundation does
          </Link>
          .
        </p>
      </div>

      <Footer />
    </div>
  )
}
