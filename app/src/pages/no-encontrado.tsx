import { Meta } from '@/components/seo/meta'
import { Boton } from '@/components/ui/boton'
import { Header } from '@/components/home/header'
import { t } from '@/lib/i18n'

// Ruta comodín — App.tsx no tenía ninguna (PLAN-LANZAMIENTO.md Bloque I): una
// URL desconocida no debe devolver una pantalla en blanco ni un 200 mentiroso
// al crawler. `noindex` porque una 404 no es contenido que valga indexar.
//
// Header (auditoría responsive 2026-07-17): la página no tenía NINGÚN nav —
// sin `id="hero"` tampoco activa NavFlotante, así que un usuario perdido
// quedaba sin más salida que "Volver al inicio". El Header 'solida' (mismo
// que el resto del sitio fuera de la home/ficha) da logo + Tours/Eventos/
// Nosotros/Ayuda + Reservar en desktop, y el menú hamburguesa completo en
// móvil — recupera tráfico en vez de solo devolverlo a "/".
export function NoEncontradoPage() {
  return (
    <div>
      <Meta titulo={t('Page not found')} descripcion={t('The page you’re looking for doesn’t exist.')} ruta="/404" indexable={false} />
      {/* [2026-08-24, barrido de enlaces] `ctaHref` EXPLICITO. Sin el, Header
          cae en su default `#tours`, que es un ancla de la HOME — y esta
          pagina no la tiene. Resultado: el boton coral «Book now» de la 404,
          justo donde el visitante ya se ha perdido una vez, no hacia nada.
          `/#tours` es lo que pasan las 18 internas via HeroInterna. */}
      <Header ctaHref="/#tours" />
      <div className="grid min-h-[70svh] place-items-center px-5 text-center">
        <div>
          {/* [v3 F8 · QA 2026-08-07] El «404» pasa de <p> a <h1>: era la única
              página del sitio sin encabezado de nivel 1, así que un lector de
              pantalla la abría sin título y el esquema del documento empezaba
              en h2. Mismos estilos, solo cambia la etiqueta. */}
          <h1 className="font-display text-h2 font-semibold text-navy">404</h1>
          <p className="mt-2 text-lead text-navy-sub">{t('We couldn’t find this page.')}</p>
          <Boton href="/" className="mt-6">
            {t('Back to home')}
          </Boton>
        </div>
      </div>
    </div>
  )
}
