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
  /** Ruta absoluta desde la raíz, p. ej. '/tours/semi-private-premium'. */
  ruta: string
  /** false = noindex,nofollow (páginas internas tipo /fundaciones). */
  indexable?: boolean
}

const NOMBRE_SITIO = 'Hispaniola Aquatic Adventures'

export function Meta({ titulo, descripcion, ruta, indexable = true }: Props) {
  const url = `${window.location.origin}${ruta}`

  return (
    <>
      <title>{`${titulo} · ${NOMBRE_SITIO}`}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      {indexable ? null : <meta name="robots" content="noindex, nofollow" />}
    </>
  )
}
