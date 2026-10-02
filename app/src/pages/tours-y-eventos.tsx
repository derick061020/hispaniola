import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { ToursGrid } from '@/components/home/tours-grid'
import { EventosGrid } from '@/components/evento/eventos-grid'
import { BarraSeccionesMovil } from '@/components/tours-y-eventos/barra-secciones-movil'
import { Meta } from '@/components/seo/meta'
import { SchemaJsonLd } from '@/components/seo/schema-json-ld'
import { schemaListado } from '@/lib/seo/schema'
import { EVENTOS_ORDEN } from '@/data/eventos'
import { TOURS_ESCAPARATE } from '@/data/home'
import { t } from '@/lib/i18n'

// Página /tours-and-events — todo lo que se vende, en una sola página.
//
// [2026-10-02, Samuel, pedido de marketing] «Una página dedicada donde se
// puedan ver los tours y eventos … que se muestren los dos tipos de servicios
// al mismo tiempo, no que haya como un tab que oculte y muestre el otro». Es
// la página a la que apuntar campañas y enlaces que no quieren elegir de
// antemano entre un tour y un evento. /tours y /events siguen existiendo:
// cada una es la respuesta corta a su búsqueda; esta es la larga.
//
// ── LA URL ───────────────────────────────────────────────────────────────
// `/tours-and-events`, pedida por marketing «con estructura lógica y
// optimizada para SEO». En inglés como el resto de rutas (v3, plan 01 §4),
// con las dos palabras clave enteras y separadas por guiones (Google lee el
// guion como espacio; `tours-events` o `toursandevents` pierden la frase), y
// en la raíz, no colgando de /tours ni de /events: no es hija de ninguna de
// las dos.
//
// ── LA ESTRUCTURA ────────────────────────────────────────────────────────
// La de /tours y /events, cosida: hero compacto de las internas, y debajo
// las MISMAS dos rejillas (`ToursGrid`, `EventosGrid`), no copias. Un tour
// nuevo, una foto o un precio cambian en `data/` y salen a la vez en la home,
// /tours, /events y aquí. Cada rejilla trae su propia cabecera (H2), porque
// el hero habla de las dos cosas y no puede titular ninguna: un H1 para la
// página y un H2 por sección es además la jerarquía que espera el buscador.
//
// En móvil, `BarraSeccionesMovil`: el índice fijo abajo que marca en qué
// sección estás y salta a la otra. El `pb` de este envoltorio le reserva el
// hueco, al mismo breakpoint en que se esconde (`md`), para que el final del
// footer no quede debajo de la barra. 5rem y no los 4rem de la ficha: el
// segmentado mide 77 px (12 + 4 + 44 de área táctil + 4 + 12 + el borde), y
// con 4.5rem el final del footer quedaba 5 px por debajo — medido.
//
// ⚠️ PENDIENTE DE APROBAR: el eyebrow, el H1, el lead y la meta description
// del hero son copy NUEVO (redactado el 2026-10-02 para esta página, no sale
// de los PDF WEBSITE-*). Las cabeceras de las dos secciones sí son textos ya
// publicados en /tours y /events. Que marketing lo revise antes de dar por
// cerrada la página.
export function ToursYEventosPage() {
  const secciones = [
    { id: 'tours', etiqueta: t('Tours'), total: TOURS_ESCAPARATE.length },
    { id: 'events', etiqueta: t('Events'), total: EVENTOS_ORDEN.length },
  ]

  return (
    <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <Meta
        titulo={t('Tours & events in Punta Cana')}
        descripcion={t(
          'Shared tours, private charters, party boats, weddings and corporate events on the Caribbean, all in one place. Book direct from Punta Cana.',
        )}
        ruta="/tours-and-events"
      />
      <SchemaJsonLd
        datos={schemaListado(t('Tours & events in Punta Cana'), [
          ...TOURS_ESCAPARATE.map((tour) => ({ nombre: tour.nombre, ruta: `/tours/${tour.slug}` })),
          ...EVENTOS_ORDEN.map((evento) => ({ nombre: evento.nombre, ruta: `/events/${evento.slug}` })),
        ])}
      />

      <HeroInterna ctaHref="#tours">
        <CabeceraInterna
          eyebrow={t('Tours & events')}
          titulo={t('Tours and events in Punta Cana')}
          lead={t(
            'Shared tours, private charters and celebrations on board: every way to live the Caribbean with us, on one page.',
          )}
        />
      </HeroInterna>

      {/* `compacta` en las dos: el aire entre hero, tours y eventos es el de
          un solo catálogo, no el de tres secciones sueltas (Samuel,
          2026-10-02). El detalle, en la cabecera de cada rejilla. */}
      <ToursGrid compacta />
      <EventosGrid conCabecera compacta />

      <Footer />

      <BarraSeccionesMovil secciones={secciones} />
    </div>
  )
}
