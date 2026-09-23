import { useEffect, useState } from 'react'
import { llamar } from '@/lib/api/cliente'
import { ARTICULOS, type Articulo, type CategoriaBlog } from '@/data/blog'

// LOS ARTÍCULOS QUE ESCRIBE EL EQUIPO, SIN TOCAR CÓDIGO.
//
// [2026-09-23, Raymond: «necesito una sección de Blog en la web, con acceso al
// administrador para poder crear, subir y publicar artículos directamente»]
//
// El blog ya existía, pero sus artículos viven escritos en `data/blog.ts`:
// publicar uno nuevo era editar código, compilar y desplegar. Ahora se
// escriben en Odoo y se leen por la misma API que ya sirve tours y precios.
//
// Los dos orígenes CONVIVEN a propósito: los 20 artículos escritos a mano
// siguen publicados tal cual —tienen cuerpo por bloques, índice y anclas— y
// los nuevos llegan con el cuerpo en HTML. Reescribir los viejos para meterlos
// en Odoo habría sido un trasvase de contenido aprobado sin que nadie lo pida.
//
// Si la API no contesta, la web enseña los de siempre: un blog a medias es
// mejor que un blog roto.

type PostApi = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string | null
  read_minutes: number
  cover_url: string | null
  cover_alt: string
  featured: boolean
  body_html?: string
}

function aArticulo(post: PostApi): Articulo {
  return {
    slug: post.slug,
    titulo: post.title,
    extracto: post.excerpt,
    categoria: post.category as CategoriaBlog,
    // El autor de Odoo es texto libre; los de casa referencian una ficha del
    // equipo. Se deja vacío para que la cabecera caiga en la firma de la casa.
    autorId: '',
    fecha: post.date ?? '',
    minutos: post.read_minutes || 1,
    foto: '',
    fotoUrl: post.cover_url ?? undefined,
    fotoAlt: post.cover_alt || post.title,
    destacado: post.featured,
    cuerpo: null,
    cuerpoHtml: post.body_html,
  }
}

/** Los de Odoo primero (lo recién publicado arriba) y después los de siempre. */
export function useArticulos(): { articulos: Articulo[]; cargando: boolean } {
  const [remotos, setRemotos] = useState<Articulo[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true
    llamar<{ posts: PostApi[] }>('/blog')
      .then((data) => {
        if (!vivo) return
        setRemotos((data.posts ?? []).map(aArticulo))
      })
      .catch(() => {
        // Silencio a propósito: el blog se sigue viendo con los de siempre.
      })
      .finally(() => vivo && setCargando(false))
    return () => {
      vivo = false
    }
  }, [])

  return { articulos: [...remotos, ...ARTICULOS], cargando }
}

/** Un artículo por slug, mire donde mire. Para la página del artículo. */
export function useArticulo(slug: string | undefined) {
  const [remoto, setRemoto] = useState<Articulo | null>(null)
  const [cargando, setCargando] = useState(true)
  const local = ARTICULOS.find((a) => a.slug === slug) ?? null

  useEffect(() => {
    let vivo = true
    if (!slug || local) {
      setCargando(false)
      return
    }
    llamar<{ post: PostApi }>(`/blog/${encodeURIComponent(slug)}`)
      .then((data) => vivo && setRemoto(aArticulo(data.post)))
      .catch(() => {})
      .finally(() => vivo && setCargando(false))
    return () => {
      vivo = false
    }
  }, [slug, local])

  return { articulo: local ?? remoto, cargando }
}
