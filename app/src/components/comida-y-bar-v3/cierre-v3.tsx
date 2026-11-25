import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, GlassWater, UtensilsCrossed } from 'lucide-react'
import { duracionTour, menusComida, nombreTour, SLUGS_TOUR } from '@/components/comida-y-bar/menus-datos'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { t } from '@/lib/i18n'
import { TOURS_CON_BAR } from './bar-v3'

// CIERRE — el «Tell us the group…» de Party Boat (un último bloque para
// decidir) con el «Back to the surface» del museo.
//
// Para decidir hace falta saber QUÉ LLEVA CADA TOUR: cuatro cards, una por
// tour, con los menús que sirve y si su ficha lista el open bar. Es la
// pregunta que la 1ª vuelta intentó contestar desde el tour; aquí se contesta
// AL FINAL, cuando ya se han visto los menús, y en una línea por tour. Todo se
// deriva del mismo modelo (menus-datos.ts), nada a mano.
//
// `data-museo-ascenso`: desde aquí el agua vuelve a subir (use-descenso.ts),
// así la espuma del footer rompe sobre turquesa.
//
// [2026-10-21, 2ª revisión de Samuel] «El mar solo donde toca»: esta sección pasa a fondo claro de Hispaniola (el agua se queda en el Open Bar y los niveles de barra).
// Por eso se quitan `data-museo-ascenso` y las burbujas.
const C = COMIDA_Y_BAR_V3.cierre

export function CierreV3() {
  const menus = menusComida()
  const subir = () => {
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <section id="your-tour" className="ancla-comida relative bg-papel pb-28 pt-20 lg:pt-28">
      <div className="relative mx-auto max-w-contenido px-5 sm:px-10">
        <div className="text-center" data-museo-revelar>
          <p className="comida3-eyebrow">{C.eyebrow}</p>
          <h2 className="comida3-h2 mx-auto mt-3 max-w-3xl font-display font-semibold text-balance">
            {C.titulo}
          </h2>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SLUGS_TOUR.map((slug) => {
            const suyos = menus.filter((m) => m.tours.some((x) => x.slug === slug))
            return (
              <li key={slug} data-museo-revelar>
                <Link
                  to={`/tours/${slug}`}
                  className="comida3-card group flex h-full flex-col"
                >
                  <h3 className="font-display text-xl font-semibold text-navy">{nombreTour(slug)}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy-soft">
                    {duracionTour(slug)}
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm">
                    {suyos.map((m) => {
                      const nota = m.tours.find((x) => x.slug === slug)?.nota
                      return (
                        <li key={m.id} className="flex items-start gap-2 text-navy">
                          <UtensilsCrossed className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden="true" />
                          <span>
                            <span className="font-semibold">{m.titulo}</span>
                            {nota ? <span className="whitespace-nowrap text-navy-sub"> · {nota}</span> : null}
                          </span>
                        </li>
                      )
                    })}
                    {TOURS_CON_BAR.includes(slug) ? (
                      <li className="flex items-start gap-2 font-semibold text-navy">
                        <GlassWater className="mt-0.5 size-4 shrink-0 text-aqua"aria-hidden="true" />
                        {COMIDA_Y_BAR.bar.titulo}
                      </li>
                    ) : null}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-aqua-dark">
                    {C.verTour}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-12 flex flex-wrap justify-center gap-3" data-museo-revelar>
          <Link to="/tours" className="museo-boton-coral">
            {C.todos}
          </Link>
          <Link to="/events" className="comida3-boton-claro">
            {t('Plan an event')}
          </Link>
        </div>
        <div className="mt-14 text-center">
          <button type="button" onClick={subir} className="comida3-subir">
            <ArrowUp className="size-4" aria-hidden="true" />
            {C.subir}
          </button>
        </div>
      </div>
    </section>
  )
}
