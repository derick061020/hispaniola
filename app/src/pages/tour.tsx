import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraFicha } from '@/components/tour/cabecera-ficha'
import { GaleriaMosaico } from '@/components/tour/galeria-mosaico'
import { WidgetReserva } from '@/components/tour/widget-reserva'
import { ComparadorStrip } from '@/components/tour/comparador-strip'
import { BarraMovilFicha } from '@/components/tour/barra-movil-ficha'
import { Itinerario } from '@/components/tour/itinerario'
import { IncluyeTour } from '@/components/tour/incluye-tour'
import { MenuTour } from '@/components/tour/menu-tour'
import { OpinionesTour } from '@/components/tour/opiniones-tour'
import { FaqTour } from '@/components/tour/faq-tour'
import { AnclasFicha } from '@/components/tour/anclas-ficha'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TOURS } from '@/data/home'
import { FICHAS } from '@/data/tours'

// Ficha de tour — UNA plantilla para los 4 productos (PLAN-TOURS.md).
// Es la página de conversión del sitio: aquí el visitante tiene el precio
// delante, compara contra Viator y decide.
//
// Las 3 variantes NO son 3 diseños: son el mismo layout con el widget y las
// secciones que cada modo de `booking` puede sostener honestamente
// (`completo` / `cotizacion` / `consulta`). En Figma, una página con frames de
// variante — no 4 páginas.
//
// El funnel de reserva (4 pasos) NO es parte de este build: sigue bloqueado
// por la decisión del motor xpotours (reemplazar / re-skinear), pendiente del
// cliente. El CTA del widget es la frontera — se pinta con su estado real
// pero no navega (EnlacePrototipo).
export function TourPage() {
  const { slug } = useParams()
  const tour = TOURS.find((t) => t.slug === slug)
  const ficha = slug ? FICHAS[slug] : undefined

  // Slug desconocido → a la home. Un 404 diseñado es otra pantalla (y otro
  // plan): fingir una aquí sería inventarse una página que nadie ha aprobado.
  if (!tour || !ficha) return <Navigate to="/" replace />

  // El H2 sale de renderFicha() del prototipo: la promesa se ajusta al
  // producto — no es la misma frase para un charter privado que para un
  // semi-privado de grupo pequeño.
  const promesa =
    tour.booking === 'cotizacion'
      ? 'Un día de mar a tu medida'
      : ficha.audiencia === 'Solo adultos'
        ? 'Un día de mar en grupo pequeño'
        : 'Un día de mar'

  return (
    <div className="pb-16 md:pb-0">
      {/* PLAN-INTERNAS-V2.md §C1: el header ya no vive suelto en variante
          'solida' — se muda DENTRO del hero compartido con la home
          (HeroInterna, variante 'sobreVideo'), sobre las fotos reales del
          tour en vez del video. El CTA sigue apuntando al widget de esta
          página — en la home apunta al grid de tours (#tours), que aquí no
          existe. */}
      <HeroInterna fotos={[tour.foto, ...ficha.galeriaCompleta]} etiqueta={tour.nombre} ctaHref="#ficha-widget">
        <CabeceraFicha tour={tour} ficha={ficha} />
      </HeroInterna>
      <GaleriaMosaico tour={tour} ficha={ficha} />
      <AnclasFicha tour={tour} />

      {/* PLAN-INTERNAS-V2.md §C2: el área de contenido pasa a
          --color-fondo-ficha (gris frío, NO el hueso cálido de
          --color-papel-hueso — ver el token) y cada sección de abajo se
          separa de ese fondo Y de sus vecinas como su propia card blanca
          (BLOQUE_FICHA) — el pedido de Samuel de "separar mejor los
          elementos del fondo y entre ellos". */}
      <div className="bg-fondo-ficha">
        {/* TODAS las secciones viven en la columna izquierda, con el widget
            sticky al lado — no a ancho completo debajo del widget. Es una
            decisión de conversión, no de layout: en desktop no hay barra
            móvil, así que con el widget fuera de la columna el visitante
            leería el itinerario y el menú (justo donde se convence) SIN un
            CTA a la vista. «El widget ES la página» (wireframe A2) significa
            exactamente esto, y es lo que hacen Viator/GetYourGuide/Civitatis,
            contra quienes se compara este producto. */}
        <div className="mx-auto max-w-contenido px-5 py-8 sm:px-10 sm:py-12">
          {/* grid-cols-1 en móvil NO es redundante: sin él, el track implícito
              se dimensiona por el min-content de sus hijos y la fila de 14
              chips del widget (694px + padding) ensanchaba la página entera a
              754px en un viewport de 390 (overflow-x en toda la ficha — bug
              preexistente de T-F3, cazado en el QA móvil de la etapa A).
              minmax(0,1fr) del grid-cols-1 de Tailwind es lo que permite al
              scroll interno de los chips hacer su trabajo. */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
            <div className="flex flex-col gap-6 lg:gap-8">
              <div className={`${BLOQUE_FICHA} flex flex-col gap-6`}>
                <div>
                  <h2 className="font-display text-h3 font-semibold text-navy">{promesa}</h2>
                  <p className="mt-2 max-w-2xl text-lead text-navy-sub">{tour.descripcionCorta}</p>
                </div>

                {/* Solo en 'completo': es el único modo con precio publicado
                    que los portales también venden — sin precio no hay
                    comparación que hacer. */}
                {tour.booking === 'completo' ? <ComparadorStrip /> : null}
              </div>

              <Itinerario tour={tour} ficha={ficha} />
              <IncluyeTour ficha={ficha} />
              {tour.booking === 'completo' ? <MenuTour tour={tour} ficha={ficha} /> : null}
              <OpinionesTour tour={tour} ficha={ficha} />
              <FaqTour ficha={ficha} />
            </div>

            {/* Sticky bajo el header. El offset sale de --spacing-sticky-top,
                derivado del alto MEDIDO del header (Trampa №5: en esta página
                se apilan header > anclas > widget, y los tres tienen que
                derivar del mismo token o se desincronizan). */}
            <div className="lg:sticky lg:top-sticky-top">
              <WidgetReserva tour={tour} ficha={ficha} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BarraMovilFicha tour={tour} />
    </div>
  )
}
