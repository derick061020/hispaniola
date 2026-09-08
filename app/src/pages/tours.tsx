import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { ToursGrid } from '@/components/home/tours-grid'
import { Meta } from '@/components/seo/meta'
import { t } from '@/lib/i18n'

// Página /tours — el catálogo, y nada más.
//
// [2026-09-08, Derick: «crea una página /tours que muestre solo los tours, sin
// nada más» y, al ver la primera pasada, «no solo vas a poner las cards: pones
// el hero de las secciones internas, con su título, descripción, abajo los
// tours y listo»]
//
// Hasta hoy el único sitio donde se veían los cuatro tours juntos era la
// sección `#tours` de la home, a media página de scroll. `/tours` era solo un
// prefijo: existía `/tours/:slug` para cada ficha y nada en la raíz, así que
// quien recortaba la URL —o llegaba desde el buscador por «hispaniola tours»—
// caía en el 404. Ahora es una página de verdad, y sigue siendo una sola
// sección: hero compacto con el título y la descripción, la rejilla de tours,
// y el footer.
//
// Se reusan las piezas que ya existen en vez de escribir otras iguales: el
// hero compartido de las internas (`HeroInterna` + `CabeceraInterna`, el mismo
// de /fleet, /crew o /faq) y la MISMA `ToursGrid` de la home. Esto último es
// lo que importa de cara al futuro: publicar un tour nuevo, cambiar una foto o
// un precio sigue siendo un solo cambio en `data/home.ts` y aparece en los dos
// sitios a la vez. Una copia de la rejilla se habría quedado atrás al primer
// cambio.
//
// La rejilla entra con `sinCabecera`: su título y su subtítulo ya los dice el
// hero, dos dedos más arriba.
export function ToursPage() {
  return (
    <div>
      <Meta
        titulo={t('Our tours')}
        descripcion={t(
          'Shared tours and private charters designed for unforgettable Caribbean experiences.',
        )}
        ruta="/tours"
      />
      {/* El CTA del header apunta a la rejilla de ESTA página, no a la de la
          home: aquí el destino está justo debajo. */}
      <HeroInterna ctaHref="#tours">
        <CabeceraInterna
          eyebrow={t('Our tours')}
          titulo={t('Choose your Caribbean experience')}
          lead={t(
            'Shared tours and private charters designed for unforgettable Caribbean experiences.',
          )}
        />
      </HeroInterna>

      <ToursGrid sinCabecera />

      <Footer />
    </div>
  )
}
