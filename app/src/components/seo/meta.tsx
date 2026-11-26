import { useEffect } from 'react'
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
  /** [2026-11-26, Sr. Fernando] Imagen principal de la página (ruta desde la
   *  raíz, p. ej. '/fotos/party-boat-punta-cana.webp') y su texto alternativo.
   *  Se declara como og:image y como `primaryImageOfPage` (schema.org WebPage):
   *  es lo que Google mira para elegir la miniatura del resultado. */
  imagen?: string
  imagenAlt?: string
}

const NOMBRE_SITIO = 'Hispaniola Aquatic Adventures'

export function Meta({ titulo, descripcion, ruta, indexable = true, imagen, imagenAlt }: Props) {
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
      {imagen ? (
        <>
          <OgImagen src={`${window.location.origin}${imagen}`} alt={imagenAlt} />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              url,
              name: tituloFinal,
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: `${window.location.origin}${imagen}`,
                ...(imagenAlt ? { caption: imagenAlt } : {}),
              },
            })}
          </script>
        </>
      ) : null}
    </>
  )
}

/** El og:image ESTÁTICO de index.html (el de la home) se SUSTITUYE en vez de
 *  añadir un segundo: con dos, los lectores se quedan con el primero, que era
 *  el genérico. Al salir de la página se restaura. */
function OgImagen({ src, alt }: { src: string; alt?: string }) {
  useEffect(() => {
    const tag = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    const previo = tag?.content
    let creado: HTMLMetaElement | null = null
    if (tag) tag.content = src
    else {
      creado = document.createElement('meta')
      creado.setAttribute('property', 'og:image')
      creado.content = src
      document.head.appendChild(creado)
    }
    let altTag = document.head.querySelector<HTMLMetaElement>('meta[property="og:image:alt"]')
    const altPrevio = altTag?.content
    let altCreado = false
    if (alt) {
      if (!altTag) {
        altTag = document.createElement('meta')
        altTag.setAttribute('property', 'og:image:alt')
        document.head.appendChild(altTag)
        altCreado = true
      }
      altTag.content = alt
    }
    return () => {
      if (creado) creado.remove()
      else if (tag && previo !== undefined) tag.content = previo
      if (altCreado) altTag?.remove()
      else if (altTag && altPrevio !== undefined) altTag.content = altPrevio
    }
  }, [src, alt])
  return null
}
