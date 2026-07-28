import { useState } from 'react'
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
import { GaleriaMosaico } from '@/components/internas/galeria-mosaico'
import { VideoAcompanante } from '@/components/tour/video-acompanante'
import * as Accordion from '@/components/alignui/accordion'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { EVENTOS } from '@/data/eventos'
import { Meta } from '@/components/seo/meta'
import { useDevFlag } from '@/dev/use-dev-flag'

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

  // Slug desconocido → a la home, como en la ficha de tour. Un 404
  // diseñado es otra pantalla (y otro plan): fingir una aquí sería
  // inventarse una página que nadie ha aprobado.
  if (!evento) return <Navigate to="/" replace />

  return (
    <div>
      <Meta titulo={evento.titulo} descripcion={evento.sub} ruta={`/eventos/${slug}`} />

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
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
            <div className="flex flex-col gap-6 lg:gap-8">
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
                // son servicios. Las fotos salen de los paquetes de este
                // evento, no de una lista aparte.
                fotosComida={(evento.paquetes?.items ?? [])
                  .map((p) => p.foto)
                  .filter((f): f is string => f !== null)}
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
                  Sobre {evento.nombre.toLowerCase().replace(/\bmice\b/, 'MICE')}
                </h2>
                <div className="mt-3 space-y-3 text-sm text-navy-sub">
                  {evento.descripcionLarga.map((parrafo, i) => (
                    <p key={i}>{parrafo}</p>
                  ))}
                </div>
              </div>

              <QueOfrecemos evento={evento} />
              <IncluyeEvento evento={evento} />

              {/* Paquetes (solo party-boat). Misma card soft-UI que el
                  resto, con 4 cards (Premium destacado + 3 paquetes
                  estándar). Se pinta SOLO si el evento tiene `paquetes`
                  en data. */}
              <PaquetesEvento evento={evento} />

              {/* FAQ — solo si hay preguntas. La web del cliente de
                  party boat NO tenía FAQ propia, así que su landing
                  no tiene esta sección. Mismo Accordion AlignUI
                  que la ficha de tour (portado en PLAN-ALIGNUI.md
                  A5). El `?dev-faq-evento=abierto` (línea arriba)
                  controla el estado inicial — los demás items se
                  gestionan con el click normal del acordeón. */}
              {evento.faq.length > 0 ? (
                <section id="ancla-faq" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
                  <TituloSeccion>Preguntas frecuentes</TituloSeccion>
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
              className="scroll-sutil flex scroll-mt-sticky-top flex-col gap-4 [&>*]:shrink-0 lg:sticky lg:top-sticky-top lg:max-h-[calc(100svh-var(--spacing-sticky-top)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain"
            >
              {/* [v2 2026-07-27, plan 03 §1 — slides 14 y 15] «Agregar reserva
                  online y DEBAJO el formulario de cotización». El orden es
                  literal del cliente y además es el correcto: quien quiere un
                  party boat estándar de 20 personas no debería rellenar el
                  mismo formulario que quien organiza una boda de 120 con menú a
                  medida. Con la calculadora arriba, el caso simple se resuelve
                  solo y el formulario queda para lo que de verdad se cotiza. */}
              {evento.paquetes ? <CalculadoraEvento paquetes={evento.paquetes.items} /> : null}
              {/* [v2 2026-07-28] El formulario se PLIEGA solo cuando encima
                  tiene la reserva online — si no hay calculadora (bodas,
                  empresas), el formulario ES el widget y sería absurdo
                  esconderlo. Ver el porqué en widget-evento.tsx. */}
              <WidgetEvento evento={evento} colapsable={Boolean(evento.paquetes)} />
            </div>
          </div>
        </div>
      </div>

      {/* «Otras ocasiones» — sale del grid, ancho completo, mismo
          patrón que «También te puede gustar» de la ficha de tour
          (PLAN-INTERNAS-V2.md §C4). Muestra los OTROS 2 eventos. */}
      <OtrasOcasiones slugActual={evento.slug} />

      <Footer />
    </div>
  )
}
