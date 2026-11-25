import { SEO_POR_RUTA } from '@/data/seo'
import { idiomaUI } from '@/lib/i18n'

// Meta tags por ruta — sin librería (react-helmet no hace falta): React 19
// renderiza <title>/<meta>/<link> en cualquier punto del árbol y los eleva
// solo al <head> automáticamente (dedup de <title> incluido).
//
// ⚠️ Límite conocido, documentado en PLAN-LANZAMIENTO.md Bloque E: esto es una
// SPA 100% client-side, sin SSR/prerender. Sirve perfecto para el <title> de
// la pestaña y para crawlers que ejecutan JS (Googlebot). Los scrapers de
// vista previa social que NO ejecutan JS (WhatsApp, Facebook, muchos more)
// solo ven los OG/Twitter tags ESTÁTICOS de index.html — que son genéricos de
// home, no los de esta página — hasta que se resuelva la decisión de
// SSR/prerender (Bloque 0.3). Por eso este componente NO repite og:*/twitter:*
// (evita duplicarlos contra los estáticos): solo title/description/canonical,
// que sí llegan limpios a quien ejecuta JS.
type Props = {
  titulo: string
  descripcion: string
  /** Ruta absoluta desde la raíz, p. ej. '/tours/caribbean-escape'. */
  ruta: string
  /** false = noindex,nofollow (páginas internas tipo /fundaciones). */
  indexable?: boolean
}

const NOMBRE_SITIO = 'Hispaniola Aquatic Adventures'

export function Meta({ titulo, descripcion, ruta, indexable = true }: Props) {
  const url = `${window.location.origin}${ruta}`
  // [2026-10-23, Marketing, SEO punto 3] Las rutas con texto de buscador
  // escrito por Marketing lo usan tal cual (ya incluye la marca donde cabe).
  // Solo en inglés: es la web que lee Google.
  const seo = idiomaUI() === 'en' ? SEO_POR_RUTA[ruta] : undefined
  const tituloFinal = seo ? seo.titulo : `${titulo} · ${NOMBRE_SITIO}`

  return (
    <>
      <title>{tituloFinal}</title>
      <meta name="description" content={seo ? seo.descripcion : descripcion} />
      <link rel="canonical" href={url} />
      {indexable ? null : <meta name="robots" content="noindex, nofollow" />}
    </>
  )
}
