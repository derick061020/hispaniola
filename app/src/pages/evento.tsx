import { useState } from 'react'
import { Check } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraEvento } from '@/components/evento/cabecera-evento'
import { WidgetEvento } from '@/components/evento/widget-evento'
import { CalculadoraEvento } from '@/components/evento/calculadora-evento'
import { QueOfrecemos } from '@/components/evento/que-ofrecemos'
import { IncluyeEvento } from '@/components/evento/incluye-evento'
import { PaquetesEvento } from '@/components/evento/paquetes-evento'
import { OtrasOcasiones } from '@/components/evento/otras-ocasiones'
import { BarraMovilEvento } from '@/components/evento/barra-movil-evento'
import { GaleriaMosaico } from '@/components/internas/galeria-mosaico'
import { VideoAcompanante } from '@/components/tour/video-acompanante'
import * as Accordion from '@/components/alignui/accordion'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { EVENTOS } from '@/data/eventos'
import { Meta } from '@/components/seo/meta'
import { useDevFlag } from '@/dev/use-dev-flag'
import { t } from '@/lib/i18n'

// Landings de eventos v2 (PLAN-EVENTOS.md) — UNA plantilla data-driven
// para las 3 landings con destino propio (party-boat, bodas, empresas),
// clon de la ficha de tour (`pages/tour.tsx`) con 2 diferencias:
//
//  1) El widget de la derecha es un FORMULARIO (no de reserva con precio) —
//     los eventos se cotizan, no se reservan. Vive en
//     `components/evento/widget-evento.tsx`.
//  2) La galería de abajo del hero es la `GaleriaMosaico` de la ficha de
//     tour (misma pieza, mismas reglas: ≥7 fotos → mosaico 3+4, <7 →
//     grid 2×2; lightbox con el componente de la ficha). Sobre la foto
//     principal NO va una quote flotante de reseña 5★ (la home ya
//     tiene prueba social), solo la foto.
//
// Anatomía (idéntica para las 3 landings — solo cambian los datos):
//   1. HeroInterna + CabeceraEvento (migaja, eyebrow, H1, sub, chips)
//   2. Banda de stats (solo empresas)
//   3. Mosaico de galería (GaleriaMosaico, compartido con la ficha)
//   4. Descripción larga (2 párrafos, en card con BLOQUE_FICHA)
//   5. Qué ofrecemos (3 cards de formato, QueOfrecemos)
//   6. Qué incluye (grid de items, IncluyeEvento)
//   7. FAQ (acordeón AlignUI — solo si hay preguntas)
//   8. Widget de cotización sticky a la derecha (WidgetEvento)
//   9. Otras ocasiones (mini-cards con los otros 2 eventos)
//  10. Footer
//
// El header "Reservar" del header apunta a `#evento-widget` (el ancla
// del widget en la página, mismo patrón que la ficha de tour apunta a
// `#ficha-widget`). El CTA primario del widget es el de cotización.

export function EventoPage() {
  const { slug } = useParams()
  const evento = slug ? EVENTOS[slug as keyof typeof EVENTOS] : undefined

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'acordeon-abierto' expande el primer item del FAQ al cargar (frame
  // "FAQ abierto" para Figma). 'cerrado' lo deja cerrado.
  const [acordeonAbierto, setAcordeonAbierto] = useState<string>('')
  useDevFlag('dev-faq-evento', (v) => {
    if (v === 'abierto' && evento?.faq[0]) setAcordeonAbierto(evento.faq[0].p)
    if (v === 'cerrado') setAcordeonAbierto('')
  })

  // [v2 2026-07-28, 2ª vuelta] EL PAQUETE ELEGIDO VIVE AQUÍ, no dentro del
  // widget: lo comparten la calculadora de reserva (columna derecha) y el
  // bloque de paquetes (columna izquierda), que se marca solo con el que esté
  // activo y también puede cambiarlo. Mismo patrón —y misma razón— que
  // `variante` en pages/tour.tsx, donde el bote elegido en el widget pinta la
  // fila de la tabla de precios del charter: dos piezas que hablan del mismo
  // dato no pueden tener cada una el suyo.
  // Arranca en el primero con precio (el Premium), igual que arrancaba el
  // useState que vivía dentro de la calculadora.
  //
  // ⚠️ [2026-08-24] SALVO EN MODO ESCAPARATE, donde arranca VACÍO. Pre-elegir
  // un paquete tiene sentido cuando hay una calculadora al lado que enseña SU
  // total; en MICE no la hay, así que la card del Premium salía marcada
  // «Selected» nada más cargar sin que nadie hubiera elegido nada y sin que
  // esa marca significara algo. Sin preselección, «Selected» vuelve a querer
  // decir «esto es lo que he elegido», y al pulsar se baja al formulario de
  // cotización, que es donde se sigue.
  const [paquete, setPaquete] = useState<string | null>(
    evento?.paquetes?.soloEscaparate
      ? null
      : (evento?.paquetes?.items.find((p) => p.precioBase !== null)?.id ?? null),
  )

  // Elegir desde la izquierda (las cards) tiene una diferencia con elegirlo
  // desde el widget: en móvil el widget está al final de la página, así que
  // marcar la card sin más dejaría el efecto fuera de pantalla. Por debajo de
  // lg se lleva al visitante al widget, que es donde ve el total cambiar; en
  // desktop no se toca el scroll (el widget es sticky y ya está a la vista).
  const elegirPaquete = (id: string) => {
    setPaquete(id)
    if (window.matchMedia('(min-width: 1024px)').matches) return
    document.getElementById('evento-widget')?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  // [dev-mode] ?dev-paquete=premium|package-i|package-ii|package-iii deja ese
  // paquete elegido al cargar — el frame de Figma con la selección puesta.
  // Antes este flag solo pintaba un borde coral en una card; ahora mueve el
  // estado de verdad, así que enseña también el widget con SU total.
  useDevFlag('dev-paquete', (v) => {
    if (evento?.paquetes?.items.some((p) => p.id === v)) setPaquete(v)
  })

  // Slug desconocido → a la home, como en la ficha de tour. Un 404
  // diseñado es otra pantalla (y otro plan): fingir una aquí sería
  // inventarse una página que nadie ha aprobado.
  if (!evento) return <Navigate to="/" replace />

  return (
    // [2026-08-21, auditoría móvil] pb reservado para BarraMovilEvento, con la
    // misma fórmula que la home y la ficha de tour: si el hueco no crece con
    // `env(safe-area-inset-bottom)`, en un iPhone con home indicator el final
    // de «Otras ocasiones» queda debajo de la barra. Se abre en `lg` porque es
    // ahí donde el widget de la columna derecha se vuelve sticky y releva a la
    // barra.
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Meta titulo={evento.titulo} descripcion={evento.sub} ruta={`/events/${slug}`} />

      {/* HeroInterna compartido con la home y la ficha de tour — mismo
          box redondeado, mismo video de marca, Header DENTRO del box
          (variante sobreVideo). El "Reservar" del header apunta a
          #evento-widget (ancla del widget en esta página). */}
      <HeroInterna ctaHref="#evento-widget">
        <CabeceraEvento evento={evento} />
      </HeroInterna>

      {/* Banda de stats (solo empresas) — sale de CabeceraEvento (mismo
          patrón que en la versión anterior): ya no compite con la foto
          del hero, queda en blanco justo debajo. Mismo lenguaje visual
          que `KpisTour` (4 cifras en grid 2×2 / 4×1). */}
      {evento.stats ? (
        <div className="mx-auto max-w-contenido px-5 pt-8 sm:px-10 sm:pt-10">
          <dl className="grid grid-cols-2 gap-6 rounded-card bg-papel-hueso p-6 sm:grid-cols-4">
            {evento.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-stat font-semibold text-navy">{s.valor}</span>
                  <span className="mt-1 block text-xs text-navy-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {/* Área de contenido — fondo blanco, mismo patrón que la ficha
          de tour. Las secciones viven en la columna izquierda con el
          widget sticky al lado. */}
      <div className="bg-papel">
        <div className="mx-auto max-w-contenido px-5 py-8 sm:px-10 sm:py-12">
            {/* En movil la columna de reservar va PRIMERO y el contenido
                despues: el visitante que llega a la ficha quiere el precio y el
                boton, no bajarse toda la galeria y el texto para encontrarlos.
                En escritorio no cambia nada — ahi son dos columnas de verdad y
                el widget es sticky al lado. */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
            <div className="order-2 flex flex-col gap-6 lg:order-1 lg:gap-8">
              {/* Mosaico de fotos — mismo componente que la ficha de
                  tour. 1ª celda: `evento.foto` (portada), el resto
                  viene de `galeriaCompleta`-equivalente. Aquí usamos
                  `evento.galeria` que ya incluye la portada. */}
              <GaleriaMosaico
                fotos={evento.galeria}
                etiqueta={evento.nombre}
                // [v2 2026-07-28, pedido de Samuel: «en los eventos también
                // debe estar el video vertical al lado del grid de imágenes»]
                // La columna 9:16 a la izquierda del mosaico deja de ser
                // exclusiva de la ficha de tour. No hay componente nuevo: es
                // la misma GaleriaMosaico, que ya aceptaba `video` — lo único
                // que faltaba era el dato (`videoGaleria` en data/eventos.ts).
                video={evento.videoGaleria}
                // [v2 2026-07-27, plan 01 §10] El slider de comida en la
                // primera celda va también aquí: el cliente dijo «en TODOS los
                // servicios» (reunión 07-24, 19:27), y las 3 landings de evento
                // son servicios.
                // [2026-08-21] Las fotos ya NO se derivan de los paquetes (eran
                // bodegones de plato sobre blanco): salen de `fotosMenu`, que
                // es la subcarpeta COMIDA que entregó el cliente para cada
                // evento — comida servida a bordo, no catálogo.
                fotosComida={evento.fotosMenu}
                // [2026-08-21] El clip del propio evento, como una celda más de
                // la rejilla. Ver `videoProducto` en data/eventos.ts.
                videoProducto={evento.videoProducto}
              />

              {/* [v2 2026-07-28, pedido de Samuel: «al estar el video vertical
                  al lado del grid también debe aparecer sticky/fijo abajo a la
                  izquierda como en los tours»] Mismo componente y mismo sitio
                  que en la ficha (tour/video-acompanante.tsx): se monta justo
                  después del mosaico porque su centinela mide desde aquí —
                  solo aparece cuando el video del mosaico ya salió de pantalla,
                  para no enseñar el mismo video dos veces. Va a la IZQUIERDA
                  porque la derecha es del widget, y no se pinta en móvil.
                  Se hereda también la salida pactada con el cliente: se puede
                  CERRAR y no vuelve en esa sesión. */}
              {evento.videoGaleria !== null ? (
                <VideoAcompanante
                  src={evento.videoGaleria}
                  poster={`/fotos/${evento.foto}.webp`}
                  etiqueta={evento.nombre}
                />
              ) : null}

              {/* Descripción larga — 2 párrafos en una card BLOQUE_FICHA
                  (misma receta que la ficha de tour, sin el H2 de
                  "Un día de mar" porque las landings de evento no
                  tienen una promesa unificada: el H1 del hero ya es
                  esa promesa). */}
              <div className={BLOQUE_FICHA}>
                <h2 className="font-display text-h3 font-semibold text-navy">
                  {/* MICE es sigla, no se minusculiza al bajar el resto del nombre */}
                  {t('About')}{' '}{evento.nombre.toLowerCase().replace(/\bmice\b/, 'MICE')}
                </h2>
                <div className="mt-3 space-y-3 text-sm text-navy-sub">
                  {evento.descripcionLarga.map((parrafo, i) => (
                    <p key={i}>{parrafo}</p>
                  ))}
                </div>
              </div>

              {/* [v3 2026-08-06, PowerPoint slide 80] La banda del barco
                  insignia. Va ENTRE la descripcion y «que ofrecemos»: el
                  argumento MICE del cliente es el barco, asi que se enseña
                  antes que los formatos de evento que caben en el. Solo la
                  trae corporativo. */}
              {/* [2026-08-24, Samuel: «en MICE los paquetes hay que subirlos, van
                  debajo de la sección que nombra al barco karaya»] LOS PAQUETES
                  CAMBIAN DE SITIO, PERO SOLO EN MICE.

                  La lectura anterior de la petición del cliente (UPDATES 08/22,
                  pág. 6: «agregar los paquetes debajo de KARAYA») se conformó con
                  que cayeran más abajo en la página —entre medias quedaban
                  «What we offer» y «What's included»— para no reordenar una
                  plantilla que comparten las tres landings. No era eso: «debajo
                  de Karaya» es PEGADO a Karaya.

                  La condición es `barcoInsignia` y no el slug: es el único dato
                  que tiene MICE y no tienen las otras dos (data/eventos.ts), y
                  además dice el porqué —los paquetes siguen al barco que los
                  sirve— en vez de codificar un nombre de landing. Bodas y party
                  boat no se enteran: los suyos se quedan donde estaban, tras
                  «What's included». */}
              {evento.barcoInsignia ? (
                <section className={BLOQUE_FICHA}>
                  <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-6">
                    <img
                      src={`/fotos/${evento.barcoInsignia.foto}.webp`}
                      alt={evento.barcoInsignia.fotoAlt}
                      loading="lazy"
                      className="h-56 w-full rounded-card object-cover lg:h-72"
                    />
                    <div>
                      <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua-dark">
                        {evento.barcoInsignia.titulo}
                      </p>
                      <h2 className="mt-1 font-display text-h3 font-semibold text-navy">
                        {evento.barcoInsignia.nombre}
                      </h2>
                      <p className="mt-2 text-navy-sub">{evento.barcoInsignia.texto}</p>
                      <ul className="mt-4 flex flex-col gap-2">
                        {evento.barcoInsignia.datos.map((dato) => (
                          <li key={dato} className="flex items-start gap-2.5 text-sm text-navy">
                            <Check className="mt-0.5 size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
                            {dato}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              ) : null}

              {/* Paquetes, sitio 1 de 2: pegados al barco insignia (MICE). */}
              {evento.barcoInsignia ? (
                <PaquetesEvento evento={evento} elegido={paquete} onElegir={elegirPaquete} />
              ) : null}

              <QueOfrecemos evento={evento} />
              <IncluyeEvento evento={evento} />

              {/* Paquetes, sitio 2 de 2: party-boat y bodas, que comparten el
                  mismo array (ver PAQUETES_COMIDA en data/eventos.ts). Misma
                  card soft-UI que el resto, con 4 cards (Premium destacado + 3
                  paquetes estándar). El componente ya se pinta SOLO si el
                  evento tiene `paquetes` en data; la condición de aquí es la
                  del SITIO, no la de si hay paquetes. */}
              {evento.barcoInsignia ? null : (
                <PaquetesEvento evento={evento} elegido={paquete} onElegir={elegirPaquete} />
              )}

              {/* FAQ — solo si hay preguntas. La web del cliente de
                  party boat NO tenía FAQ propia, así que su landing
                  no tiene esta sección. Mismo Accordion AlignUI
                  que la ficha de tour (portado en PLAN-ALIGNUI.md
                  A5). El `?dev-faq-evento=abierto` (línea arriba)
                  controla el estado inicial — los demás items se
                  gestionan con el click normal del acordeón. */}
              {evento.faq.length > 0 ? (
                <section id="ancla-faq" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
                  <TituloSeccion>{t('Frequently asked questions')}</TituloSeccion>
                  <Accordion.Root
                    type="single"
                    collapsible
                    value={acordeonAbierto}
                    onValueChange={setAcordeonAbierto}
                    className="mt-5 flex flex-col gap-3"
                  >
                    {evento.faq.map((q) => (
                      <Accordion.Item key={q.p} value={q.p}>
                        <Accordion.Header>
                          <Accordion.Trigger>
                            {q.p}
                            <Accordion.Arrow className="justify-self-end" />
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content>
                          <p>{q.r}</p>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </section>
              ) : null}
            </div>

            {/* Sticky bajo el header. Mismo offset que la ficha de
                tour (`--spacing-sticky-top`), derivado del alto del
                header sólido + anclas. */}
            {/* [v2 2026-07-27] Mismo tope de altura + scroll que la ficha de
                tour (ver el comentario largo allí): aquí el riesgo es mayor,
                porque desde esta tanda la columna lleva DOS piezas apiladas —
                la calculadora de reserva online y el formulario de cotización.
                Sin tope, el botón de enviar quedaría fuera de alcance. */}
            {/* `[&>*]:shrink-0` por la misma razón que en la ficha de tour (ver
                widget-reserva.tsx): con `flex-col` + `max-h`, flexbox comprime
                a los hijos antes de dejar que aparezca el scroll, y los CTA se
                aplastan perdiendo su padding. Aquí todavía no se notaba —las
                dos cards resisten por su contenido— pero el fallo es el mismo y
                aparecería en cuanto crezcan (más paquetes, formulario más
                largo). Se blinda ahora, no cuando se rompa. */}
            {/* [v2 2026-07-28] El ancla #evento-widget se muda AQUÍ desde la
                Caja de widget-evento.tsx: el «Reservar» del header tiene que
                caer en lo primero de la columna —la reserva online— y no en el
                formulario de cotización, que ahora además llega plegado. */}
            <div
              id="evento-widget"
              className="scroll-sutil order-1 flex scroll-mt-sticky-top flex-col gap-4 [&>*]:shrink-0 lg:order-2 lg:sticky lg:top-sticky-top lg:max-h-[calc(100svh-var(--spacing-sticky-top)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain"
            >
              {/* [v2 2026-07-27, plan 03 §1 — slides 14 y 15] «Agregar reserva
                  online y DEBAJO el formulario de cotización». El orden es
                  literal del cliente y además es el correcto: quien quiere un
                  party boat estándar de 20 personas no debería rellenar el
                  mismo formulario que quien organiza una boda de 120 con menú a
                  medida. Con la calculadora arriba, el caso simple se resuelve
                  solo y el formulario queda para lo que de verdad se cotiza. */}
              {/* [v3 2026-08-06, WEBSITE-EVENTOS pag. 5 + PowerPoint slide 79]
                  Los perks de bodas —novios gratis y brindis de champagne— van
                  DESTACADOS donde se decide, no perdidos en un parrafo.
                  [2026-08-07, Samuel: «que los avisos de los novios y la
                  champaña vayan dentro del widget, no aparte fuera»] Eran una
                  card de menta SUELTA encima de la calculadora, y eso los
                  dejaba como un cartel que se lee antes de empezar y se olvida.
                  Ahora bajan DENTRO —justo bajo el contador de invitados, que
                  es lo que dispara el regalo, y pegados al desglose que lo
                  descuenta—: se pasa el dato en vez de anunciarlo aparte. */}
              {/* [2026-08-24] LA RESERVA ONLINE YA NO CUELGA DE `paquetes` A
                  SECAS. Cuando MICE estrenó el bloque de paquetes (UPDATES
                  08/22, pág. 6) heredaba de rebote la calculadora con depósito
                  del 25%, que es justo lo que Samuel había decidido NO darle el
                  2026-07-28: un incentivo de 300 pax en convoy no tiene tarifa
                  cerrada. Con `soloEscaparate` la landing enseña los paquetes y
                  se queda en cotización. Ver el JSDoc del campo en
                  data/eventos.ts. */}
              {evento.paquetes && !evento.paquetes.soloEscaparate ? (
                <CalculadoraEvento
                  paquetes={evento.paquetes.items}
                  elegido={paquete}
                  onElegir={elegirPaquete}
                  slug={evento.slug}
                  perks={evento.perks}
                />
              ) : null}
              {/* [v2 2026-07-28] El formulario se PLIEGA solo cuando encima
                  tiene la reserva online — si no hay calculadora (MICE), el
                  formulario ES el widget y sería absurdo esconderlo. Ver el
                  porqué en widget-evento.tsx. */}
              {/* El formulario se pliega SOLO cuando encima tiene la reserva
                  online. En modo escaparate no hay nada que lo releve, así que
                  se queda desplegado: es el único camino de conversión que
                  tiene la landing corporativa. */}
              <WidgetEvento
                evento={evento}
                colapsable={Boolean(evento.paquetes && !evento.paquetes.soloEscaparate)}
                paqueteElegido={paquete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* «Otras ocasiones» — sale del grid, ancho completo, mismo
          patrón que «También te puede gustar» de la ficha de tour
          (PLAN-INTERNAS-V2.md §C4). Muestra los OTROS 2 eventos. */}
      <OtrasOcasiones slugActual={evento.slug} />

      <Footer />

      {/* CTA persistente en móvil — el equivalente de BarraMovilFicha en las
          fichas de tour. Va fuera del flujo, al final, por el mismo motivo que
          allí: es cromo de la página, no una sección más. */}
      <BarraMovilEvento evento={evento} />
    </div>
  )
}
