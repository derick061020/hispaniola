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
      {/* El fondo pasa de blanco a --color-fondo-ficha (el gris frío que ya
          usan las páginas internas) a la altura del propio hero, no en un
          punto arbitrario más abajo: así el gris ya está "puesto" antes de
          llegar al contenido y no hay una línea dura entre el hero y la
          rejilla de artículos. Blanco hasta la mitad del hero, degradado
          suave de ahí al final — pedido de Samuel con referencia visual. */}
      <div
        style={{
          background:
            'linear-gradient(to bottom, var(--color-papel) 0%, var(--color-papel) 50%, var(--color-fondo-ficha) 100%)',
        }}
      >
        <HeroInterna ctaHref="/#tours">
          <CabeceraBlog />
        </HeroInterna>
      </div>

      <div className="bg-fondo-ficha">
        <div className="mx-auto max-w-contenido px-5 pt-12 sm:px-10 lg:pt-16">
          <ListaArticulos />
        </div>
        {/* Footer/.footer-espuma (footer.tsx) da por hecho que justo ENCIMA
            hay --color-papel (así se ve en el resto del sitio, todo blanco
            hasta el footer) — la espuma es blanca y funde contra eso. Esta
            página rompe ese supuesto: el fondo justo antes del footer es
            --color-fondo-ficha (gris), no papel, así que la espuma quedaba
            recortada en seco contra el gris. En vez de tocar el Footer
            compartido (rompería el resto de páginas, que sí son blancas),
            esta franja SOLO existe aquí: sustituye al py-12/lg:py-16 de
            abajo (mismo alto exacto, h-12/lg:h-16) y funde el gris al papel
            antes de llegar al footer. */}
        <div
          aria-hidden="true"
          className="h-12 lg:h-16"
          style={{ background: 'linear-gradient(to top, var(--color-papel) 0%, transparent 100%)' }}
        />
      </div>

      <Footer />
    </div>
  )
}
