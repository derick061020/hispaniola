import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { EventosGrid } from '@/components/evento/eventos-grid'
import { Meta } from '@/components/seo/meta'
import { t } from '@/lib/i18n'

// Página /events — las tres ocasiones, y nada más.
//
// [2026-09-08, Derick: «lo mismo para eventos /events»] La gemela de /tours,
// y por el mismo motivo: `/events` era solo un prefijo —había
// `/events/:slug` para cada landing y nada en la raíz—, así que recortar la
// URL caía en el 404. Los tres eventos solo se veían juntos en el megamenú
// (que se cierra al mover el ratón) y al pie de cada landing, y ahí siempre
// faltaba el que se estaba mirando.
//
// Misma estructura que /tours: hero compacto de las internas con el título y
// la descripción, la rejilla debajo, y el footer.
export function EventsPage() {
  return (
    <div>
      <Meta
        titulo={t('Private events & party boats')}
        descripcion={t(
          'Party boats, weddings and corporate charters: the whole catamaran for your group, on the Caribbean.',
        )}
        ruta="/events"
      />
      <HeroInterna ctaHref="#events">
        <CabeceraInterna
          eyebrow={t('Private events')}
          titulo={t('Celebrate on board')}
          lead={t(
            'Party boats, weddings and corporate charters: the whole catamaran for your group, on the Caribbean.',
          )}
        />
      </HeroInterna>

      <EventosGrid />

      <Footer />
    </div>
  )
}
