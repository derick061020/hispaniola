import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraBlog } from '@/components/blog/cabecera-blog'
import { ListaArticulos } from '@/components/blog/lista-articulos'
import { Meta } from '@/components/seo/meta'

// Página BLOG (/blog) — NUEVA en las correcciones v1 del cliente
// (2026-07-20, planes/06-blog.md). Mismo hero compartido y mismo esqueleto
// que /guias, /faq y /nosotros: el blog es una página interna más.
//
// ⚠️ DECISIÓN DE ALCANCE PENDIENTE DE SAMUEL (ver el plan). Maquetar el
// índice es asumible; un blog CON artículos escritos es un proyecto de
// contenido aparte. Lo que hay aquí es: la estructura completa que pidió el
// cliente + UN artículo real (escrito con contenido que ya vivía en el
// proyecto) + el resto de títulos que él propuso, marcados «Próximamente».
//
// ⚠️ RELACIÓN CON /guias — SIN RESOLVER, y hay que resolverla. Las dos
// páginas tienen una categoría «Guías de Punta Cana» y el primer artículo de
// este blog cubre el mismo tema que el primer bloque de /guias. Hoy conviven
// sin canibalizarse porque el blog casi no tiene contenido, pero en cuanto
// se escriban los artículos habrá que decidir: ¿el blog absorbe /guias,
// /guias enlaza al blog, o cada uno cubre cosas distintas? Es también una
// decisión de SEO (dos páginas compitiendo por la misma búsqueda se hacen
// daño). Anotado en planes/06-blog.md.
export function BlogPage() {
  return (
    <div>
      <Meta
        titulo="Blog"
        descripcion="Guías honestas, historias del mar y consejos reales para tu viaje a Punta Cana, contados por quienes navegan esta costa desde 2012."
        ruta="/blog"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraBlog />
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <ListaArticulos />
      </div>

      <Footer />
    </div>
  )
}
