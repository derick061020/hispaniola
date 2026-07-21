import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraFicha } from '@/components/tour/cabecera-ficha'
import { WidgetReserva } from '@/components/tour/widget-reserva'
import { BarraMovilFicha } from '@/components/tour/barra-movil-ficha'
import { Itinerario } from '@/components/tour/itinerario'
import { IncluyeTour } from '@/components/tour/incluye-tour'
import { MenuTour } from '@/components/tour/menu-tour'
import { TablaPreciosCharter } from '@/components/tour/tabla-precios-charter'
import { OpinionesTour } from '@/components/tour/opiniones-tour'
import { FaqTour } from '@/components/tour/faq-tour'
import { AnclasFicha } from '@/components/tour/anclas-ficha'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { DescripcionTour } from '@/components/tour/descripcion-tour'
import { KpisTour } from '@/components/tour/kpis-tour'
import { GaleriaMosaico } from '@/components/internas/galeria-mosaico'
import { TambienTeGusta } from '@/components/internas/tambien-te-gusta'
import { TOURS } from '@/data/home'
import { FICHAS } from '@/data/tours'
import { Meta } from '@/components/seo/meta'
import { SchemaJsonLd } from '@/components/seo/schema-json-ld'
import { schemaTour, schemaFaq } from '@/lib/seo/schema'

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

  // v3 (2026-07-17, charter): la sub-variante (bote) vive en `tour.tsx` y
  // se pasa ABAJO a `WidgetReserva` y a `TablaPreciosCharter` — antes vivía
  // dentro del widget y la tabla de la izquierda nunca sabía cuál estaba
  // activo (la pasábamos con `activa={null}`, así que el highlight
  // "Seleccionado" nunca se pintaba). Con el state arriba, el cambio de
  // bote en el widget pinta simultáneamente la franja aqua de la fila
  // correspondiente en la tabla — coherencia entre el selector y la
  // referencia visual.
  const [variante, setVariante] = useState<string | null>(ficha.subVariantes?.[0]?.id ?? null)

  return (
    // pb-[calc(4rem+env(safe-area-inset-bottom))] (auditoría móvil 2026-07-17):
    // BarraMovilFicha ahora crece con la zona segura del iPhone — el padding
    // reservado aquí tiene que crecer igual o el final de la página queda
    // tapado en un iPhone con home indicator.
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Meta titulo={tour.nombre} descripcion={tour.descripcionCorta} ruta={`/tours/${tour.slug}`} />
      <SchemaJsonLd datos={schemaTour(tour, ficha)} />
      {ficha.faqTour.length > 0 ? <SchemaJsonLd datos={schemaFaq(ficha.faqTour)} /> : null}
      {/* PLAN-INTERNAS-V2.md §C1: el header ya no vive suelto en variante
          'solida' — se muda DENTRO del hero compartido con la home
          (HeroInterna, variante 'sobreVideo'), sobre el video de marca (el
          de la home). Iteración 2026-07-17, 2ª vuelta: el mosaico de fotos
          YA NO vive incrustado en el hero (esa 1ª iteración desalineaba el
          título contra el max-w-contenido del resto de la página, y el grid
          no pertenecía ahí) — se muda a la columna de contenido, ver más
          abajo. El CTA sigue apuntando al widget de esta página — en la
          home apunta al grid de tours (#tours), que aquí no existe. */}
      <HeroInterna ctaHref="#ficha-widget">
        <CabeceraFicha tour={tour} ficha={ficha} />
      </HeroInterna>
      <AnclasFicha tour={tour} />

      {/* El área de contenido es BLANCA (2026-07-17, 2ª iteración de la ficha
          — antes era --color-fondo-ficha gris). Cada bloque se separa del
          fondo y de sus vecinos por su BORDE gris (BLOQUE_FICHA: ring-linea,
          sin sombra), no por contraste card-blanca-sobre-gris. */}
      <div className="bg-papel">
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
              {/* Iteración 2026-07-17, 2ª vuelta: el mosaico se muda aquí
                  desde el hero — un bloque MÁS de esta columna (a su ancho,
                  no ancho completo), no una sección aparte por encima del
                  nav de anclas como en la v1 de PLAN-TOURS.md. Primero en la
                  columna: el visitante ve el producto antes de leer texto. */}
              <GaleriaMosaico
                fotos={[tour.foto, ...ficha.galeriaCompleta]}
                etiqueta={tour.nombre}
                video={ficha.videoGaleria}
              />

              {/* KPIs de confianza de la empresa, debajo del mosaico (pedido
                  de Samuel, ref. barra de datos de hellocaribetours). */}
              <KpisTour />

              <div className={BLOQUE_FICHA}>
                <h2 className="font-display text-h3 font-semibold text-navy">{promesa}</h2>
                <DescripcionTour parrafos={ficha.descripcionLarga} corta={tour.descripcionCorta} />
              </div>

              <Itinerario ficha={ficha} />
              <IncluyeTour ficha={ficha} />
              {tour.booking === 'completo' ? <MenuTour tour={tour} ficha={ficha} /> : null}
              {/* v3 (2026-07-17, pedido de Samuel): tabla de precios por bote
                  para charter-privado (4 botes con sus tramos de pax).
                  Solo se pinta si la ficha tiene subVariantes. */}
              {tour.booking === 'completo' && ficha.subVariantes && ficha.subVariantes.length > 0 ? (
                <TablaPreciosCharter ficha={ficha} activa={variante} />
              ) : null}
              {/* Fila de videos (correcciones v1 del cliente, 2026-07-20 —
                  planes/02-producto.md slide 6: la maqueta pone aquí, entre
                  el menú y las opiniones, una fila de «Video Corporativo +
                  Reel 1/2/3 Clientes»).

                  Es EL MISMO componente que la sección «Míranos en acción» de
                  la home (components/ui/reels-sociales.tsx), no una pieza
                  paralela: en Figma será un componente con dos usos. Aquí va
                  sin fondo propio (la ficha ya vive sobre gris) y con su
                  propio título. Los datos y el estado de los assets son los
                  mismos — ver REELS en data/home.ts. */}
              <ReelsSociales
                eyebrow="En video"
                titulo="Así se ve un día con nosotros"
                lead="Reels de a bordo y de nuestros clientes — el tour antes del tour."
                conFondo={false}
              />

              <OpinionesTour tour={tour} />
              <FaqTour ficha={ficha} />
            </div>

            {/* Sticky bajo el header. El offset sale de --spacing-sticky-top,
                derivado del alto MEDIDO del header (Trampa №5: en esta página
                se apilan header > anclas > widget, y los tres tienen que
                derivar del mismo token o se desincronizan). */}
            <div className="lg:sticky lg:top-sticky-top">
              <WidgetReserva tour={tour} ficha={ficha} variante={variante} onVarianteChange={setVariante} />
            </div>
          </div>
        </div>
      </div>

      {/* PLAN-INTERNAS-V2.md §C4: «También te puede gustar» sale del grid —
          ya no comparte columna con la FAQ — y pasa a ser su propia sección
          a ancho completo, sobre blanco, entre el gris de la ficha y el
          footer. */}
      <TambienTeGusta slugs={ficha.tambienTeGusta} />

      <Footer />
      <BarraMovilFicha tour={tour} />
    </div>
  )
}
