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
import { DatosTour } from '@/components/tour/datos-tour'
import { GaleriaMosaico } from '@/components/internas/galeria-mosaico'
import { ReelsSociales } from '@/components/ui/reels-sociales'
import { ComparadorPremium } from '@/components/tour/comparador-premium'
import { BandaPremium } from '@/components/tour/banda-premium'
import { BandaModalidad } from '@/components/tour/banda-modalidad'
import { fotosComidaDe } from '@/data/tours'
import { VideoAcompanante } from '@/components/tour/video-acompanante'
import { AntesDeReservar } from '@/components/tour/antes-de-reservar'
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

  // v3 (2026-07-17, charter): la sub-variante (bote) vive en `tour.tsx` y
  // se pasa ABAJO a `WidgetReserva` y a `TablaPreciosCharter` — antes vivía
  // dentro del widget y la tabla de la izquierda nunca sabía cuál estaba
  // activo (la pasábamos con `activa={null}`, así que el highlight
  // "Seleccionado" nunca se pintaba). Con el state arriba, el cambio de
  // bote en el widget pinta simultáneamente la franja aqua de la fila
  // correspondiente en la tabla — coherencia entre el selector y la
  // referencia visual.
  const [variante, setVariante] = useState<string | null>(ficha?.subVariantes?.[0]?.id ?? null)
  // [v2 2026-07-27] Mismo patrón que `variante`, y por la misma razón: la
  // banda «estás en Premium» (§9) vive en la columna IZQUIERDA y tiene que
  // reaccionar a un selector que está en la derecha. Arranca en 'premium'
  // porque el widget abre así (ver el guardarraíl de widget-reserva.tsx).
  const [paquete, setPaquete] = useState<'light' | 'premium'>('premium')
  // [v2 2026-07-28] Tercer estado que sube del widget, mismo patrón y misma
  // razón que los dos de arriba: la tabla de precios vive en la columna
  // IZQUIERDA y llevaba desde julio con un texto que prometía reaccionar al
  // número de personas del widget sin poder hacerlo. Ver `onPersonasChange`
  // en widget-reserva.tsx.
  const [personas, setPersonas] = useState<number | null>(null)

  // Slug desconocido → a la home. Un 404 diseñado es otra pantalla (y otro
  // plan): fingir una aquí sería inventarse una página que nadie ha aprobado.
  //
  // [v2 2026-07-28] La guarda BAJA de la línea 52 a aquí, DESPUÉS de los tres
  // useState. Estaba por encima, y eso es una violación real de las reglas de
  // hooks: al navegar de un slug válido a uno inválido el componente cambiaba
  // de número de hooks y React revienta. No es teórico — el megamenú enlaza
  // entre fichas. Salía en oxlint desde antes; con el tercer estado de hoy
  // eran ya tres avisos sobre el mismo fallo, así que se arregla en vez de
  // acumular. `ficha?.` en el inicializador de `variante` es lo único que hizo
  // falta: ahora corre antes de saber si la ficha existe.
  if (!tour || !ficha) return <Navigate to="/" replace />

  // El H2 sale de renderFicha() del prototipo: la promesa se ajusta al
  // producto — no es la misma frase para un charter privado que para un
  // semi-privado de grupo pequeño.
  // [v3 2026-08-06] Si la ficha trae `promesa`, gana: es el título que el
  // cliente aprobó por escrito para SU producto («The Ultimate Adults-Only
  // Catamaran Tour in Punta Cana»). La derivación de abajo se queda como
  // fallback de las fichas que todavía no lo traen — y deja de ser el
  // mecanismo principal, que era adivinar un titular a partir de `audiencia`.
  const promesa =
    ficha.promesa ??
    (tour.booking === 'cotizacion'
      ? 'Un día de mar a tu medida'
      : ficha.audiencia === 'Solo adultos'
        ? 'Un día de mar en grupo pequeño'
        : 'Un día de mar')

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
      {/* [v3 2026-08-06, pedido de Samuel: «sigo viendo el Ages 15+ debajo en
          otra linea»] `anchoCompleto`: la caja de max-w-4xl del hero existe
          para que un TITULO no se lea a 1400px de ancho, y esa razon vale para
          el H1 pero no para una fila de insignias — con 896px, los 5 chips
          aprobados + el rating piden 964 y el ultimo caia solo a la segunda
          linea. Asi que la restriccion se muda DENTRO de CabeceraFicha, donde
          puede aplicarse solo al titulo. Las demas internas no se enteran: la
          prop es opt-in y solo la pasan esta ficha y /por-que-reservar. */}
      <HeroInterna ctaHref="#ficha-widget" anchoCompleto>
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
                // [v2 2026-07-27] Las fotos de plato de ESTE tour alimentan el
                // slider de la primera celda (§10). Se derivan de los menús
                // que la ficha ya declara — no hay una lista aparte que pueda
                // quedarse desincronizada del menú que se pinta abajo.
                fotosComida={fotosComidaDe(ficha)}
              />

              {/* [v2 2026-07-27, plan 01 §11] El video que ACOMPAÑA el scroll,
                  fijo abajo a la izquierda y expandible al clic. Se monta justo
                  después del mosaico porque su centinela mide desde aquí: solo
                  aparece cuando el video "de verdad" del mosaico ya salió de
                  pantalla, para no enseñar el mismo video dos veces.
                  ⚠️ [placeholder-v2] Reutiliza el video del mosaico. El
                  definitivo es «la persona responsable explicando el tour»
                  (reunión 07-24, 20:51) y hay que grabarlo, uno por tour. */}
              {ficha.videoGaleria !== null ? (
                <VideoAcompanante
                  src={ficha.videoGaleria}
                  poster={`/fotos/${tour.foto}.webp`}
                  etiqueta={tour.nombre}
                />
              ) : null}

              {/* Ficha técnica del tour, debajo del mosaico (Samuel
                  2026-07-22, ref. los «trip facts» de Viator). Sustituye a
                  los KPIs de empresa que vivían aquí — ver datos-tour.tsx
                  para el porqué del cambio de sujeto. */}
              <DatosTour tour={tour} ficha={ficha} />

              {/* [v2 2026-07-27] Banda «estás en Premium» (slide 6), en el
                  hueco exacto donde el cliente puso la flecha: entre la ficha
                  técnica y la descripción. Solo con el paquete en Premium —
                  es la contraparte de la caja de upsell del widget, así que
                  el visitante nunca ve las dos a la vez. */}
              {paquete === 'premium' && ficha.menuLight.length > 0 ? (
                <BandaPremium ficha={ficha} />
              ) : null}

              <div className={BLOQUE_FICHA}>
                <h2 className="font-display text-h3 font-semibold text-navy">{promesa}</h2>
                <DescripcionTour parrafos={ficha.descripcionLarga} corta={tour.descripcionCorta} />
              </div>

              {/* [v2 2026-07-27] EL MENÚ SUBE (slide 11: «hay que subirla y
                  ponerla justo ahí», con la flecha desde el bloque de menús
                  hasta encima del itinerario).
                  El cliente tiene razón y merece decírselo: el menú es el
                  diferenciador que ningún competidor tiene —cocina flotante,
                  plato a elección— y estaba tercero, después de dos bloques
                  (itinerario e incluye) que cualquier OTA también enseña.
                  Subirlo es una mejora de conversión, no un capricho.
                  ⚠️ El orden de anclas-ficha.tsx tiene que seguir a este o el
                  nav de anclas se desincroniza. */}
              {/* [v2 2026-07-27] El comparador va JUSTO ANTES del menú, que es
                  donde el cliente puso la flecha (slide 16). Prepara la lectura
                  del menú en vez de competir con él — que fue lo que motivó
                  quitar la comparativa anterior, fundida dentro del bloque. */}
              {tour.booking === 'completo' ? <ComparadorPremium tour={tour} ficha={ficha} /> : null}
              {tour.booking === 'completo' ? (
                <MenuTour tour={tour} ficha={ficha} variante={variante} personas={personas} />
              ) : null}

              {/* [v3 2026-08-06, slide 77] DEBAJO DE LOS MENUS, sitio que fijo
                  Samuel: el visitante ya ha visto lo que se sirve a bordo, o
                  sea que ya tiene el nivel de producto en la cabeza. Ofrecerle
                  la alternativa mas barata antes de eso seria regalar la
                  venta. Es una pieza APARTE de la banda «estas en Premium» de
                  arriba — ver el porque en banda-modalidad.tsx. */}
              <BandaModalidad ficha={ficha} />

              {/* [v2 2026-07-28, plan 01 §7] «Antes de reservar»: UN bloque con
                  todo lo del slide 2 —duración elegible, lo que ahorras, cómo
                  se cocina y los paquetes para grupos—. Sustituye a cuatro
                  parches que vivían repartidos por la página (pedido de Samuel:
                  «todo en un mismo bloque»); ver la cabecera de
                  antes-de-reservar.tsx para el reparto anterior.
                  VA JUSTO DEBAJO DEL MENÚ (Samuel, 2026-07-28). Antes colgaba de
                  la tabla de precios, con el argumento de que el visitante
                  acababa de ver una cifra; pegado al menú funciona mejor y por
                  una razón más fuerte: la carta es donde el charter se vende
                  (fotos de los platos, langosta), y ese es el momento de decir
                  cómo se cocina y cuánto se puede bajar el precio — no veinte
                  centímetros más abajo, después de dos bloques de logística. */}
              {tour.booking === 'completo' ? <AntesDeReservar tour={tour} ficha={ficha} /> : null}

              <Itinerario ficha={ficha} />
              <IncluyeTour ficha={ficha} />
              {/* v3 (2026-07-17, pedido de Samuel): tabla de precios por bote
                  para charter-privado (4 botes con sus tramos de pax).
                  Solo se pinta si la ficha tiene subVariantes. */}
              {tour.booking === 'completo' && ficha.subVariantes && ficha.subVariantes.length > 0 ? (
                <TablaPreciosCharter ficha={ficha} activa={variante} personas={personas} />
              ) : null}
              {/* Fila de videos (correcciones v1 del cliente, 2026-07-20 —
                  planes/02-producto.md slide 6: la maqueta pone aquí, entre
                  el menú y las opiniones, una fila de «Video Corporativo +
                  Reel 1/2/3 Clientes»).

                  Es EL MISMO componente que la sección «Míranos en acción» de
                  la home (components/ui/reels-sociales.tsx), no una pieza
                  paralela: en Figma será un componente con dos variantes. Los
                  datos y el estado de los assets son los mismos — ver REELS
                  en data/home.ts.

                  2026-07-22 (Samuel: «hay espaciados, padding, alineaciones
                  erradas y raras»): pasa a `variante="bloque"` y se envuelve
                  en BLOQUE_FICHA, como el resto de la columna. Antes se
                  colaba aquí una SECCIÓN de página completa —con su padding
                  de sección y su sangrado a los bordes de la ventana— dentro
                  de una columna de cards: de ahí las cards desalineadas 40px
                  respecto al título y el bloque de 932px de alto para 450px
                  de reels. El envoltorio lo pone la página (y no el
                  componente) para que `ui/reels-sociales.tsx` siga sin saber
                  nada de la ficha. `conHashtag={false}`: aquí no se invita a
                  irse a Instagram a media decisión de compra. */}
              <div className={BLOQUE_FICHA}>
                <ReelsSociales
                  variante="bloque"
                  conHashtag={false}
                  eyebrow="On video"
                  titulo="This is what a day with us looks like"
                  lead="Clips from on board and from our guests — the tour before the tour."
                />
              </div>

              <OpinionesTour tour={tour} />
              <FaqTour ficha={ficha} />
            </div>

            {/* Sticky bajo el header. El offset sale de --spacing-sticky-top,
                derivado del alto MEDIDO del header (Trampa №5: en esta página
                se apilan header > anclas > widget, y los tres tienen que
                derivar del mismo token o se desincronizan). */}
            {/* [v2 2026-07-27] TOPE DE ALTURA + SCROLL PROPIO.
                El widget ha crecido esta tanda (chips de urgencia, add-ons,
                aviso de salto de tramo, tramos de edad) y, siendo sticky, si
                pasa de la altura de la ventana su parte de abajo —donde está
                el CTA— queda INALCANZABLE: sticky no se puede scrollear más
                allá del viewport. Con un tope al ras de la pantalla y scroll
                interno, el CTA siempre se puede alcanzar.

                `svh` y NO `vh`/`dvh` — aprendizaje ya documentado del
                proyecto: `vh` en móvil es el viewport GRANDE (con la barra de
                URL escondida) y el widget mediría más que la pantalla real;
                `dvh` cambia mientras se hace scroll y haría bailar el tope.
                `svh` es la medida chica garantizada, sin saltos.

                Solo desde lg: en móvil el widget va en flujo normal, no es
                sticky, y limitarle el alto no arreglaría nada — allí el CTA lo
                cubre BarraMovilFicha.

                overscroll-contain: al llegar al final del widget, la rueda NO
                sigue arrastrando la página de detrás. */}
            {/* El tope de altura y el scroll YA NO viven aquí: se mudaron a la
                caja del propio widget (ver el comentario en widget-reserva.tsx).
                Con el overflow en este envoltorio, el `ring` de la caja —que se
                dibuja por fuera de su borde— quedaba recortado a los lados. */}
            <div className="lg:sticky lg:top-sticky-top">
              <WidgetReserva
                tour={tour}
                ficha={ficha}
                variante={variante}
                onVarianteChange={setVariante}
                onPaqueteChange={setPaquete}
                onPersonasChange={setPersonas}
              />
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
