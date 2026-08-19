import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Footer } from '@/components/home/footer'
import { Boton } from '@/components/ui/boton'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraArticulo } from '@/components/blog/cabecera-articulo'
import { CompartirArticulo } from '@/components/blog/compartir-articulo'
import { IndiceArticulo } from '@/components/blog/indice-articulo'
import { ComentariosArticulo } from '@/components/blog/comentarios-articulo'
import { Newsletter } from '@/components/blog/lista-articulos'
import { Meta } from '@/components/seo/meta'
import { ARTICULOS } from '@/data/blog'
import { EQUIPO } from '@/data/nosotros'
import { NoEncontradoPage } from '@/pages/no-encontrado'
import { t } from '@/lib/i18n'

// Página de artículo (/blog/:slug) — correcciones v1 del cliente
// (planes/06-blog.md). El «Leer el artículo» del índice necesitaba destino.
//
// Hero compartido (correcciones v1, pedido de Samuel 2026-07-22): esta página
// PASA a usar HeroInterna, como el resto de internas — la 1ª versión no lo
// usaba (razonamiento: meter el video del catamarán encima de un texto de 6
// minutos empujaría el contenido fuera del primer viewport). Se resuelve
// distinto: HeroInterna gana la prop `imagen` (ver ese archivo) y aquí se le
// pasa la portada del propio artículo en vez del video de marca — el hero es
// el mismo lenguaje visual del resto del sitio, pero la foto SÍ es del
// artículo, no genérica.
//
// ANCHOS (2ª vuelta, mismo día — "al contenido de texto si le vas a reducir
// el ancho máximo, pero solo texto y al CTA, todo lo demás mantiene ancho
// por defecto de la página"): el `<article>` en sí mide max-w-contenido, el
// mismo ancho que el resto del sitio (antes max-w-3xl, reducido, propio de
// esta página) — la newsletter vive a ESE ancho completo (banner compartido
// con el blog, mismo criterio que en lista-articulos.tsx). Índice + cuerpo +
// CTA de cierre se anidan en su propio `mx-auto max-w-3xl`, la medida de
// lectura cómoda de siempre.
//
// «Sigue leyendo» y comentarios (4ª vuelta, correcciones v1, pedido de
// Samuel: "que los comentarios y el sigue leyendo tenga el mismo ancho que
// el texto del artículo") SALEN de ese criterio de la 2ª vuelta — antes
// vivían al ancho completo del `<article>`; ahora comparten el mismo
// `max-w-3xl` que el cuerpo de texto, cada uno en su propio wrapper (no
// dentro del div del cuerpo/índice/CTA, que ya cerró) para no arrastrar
// el mismo ancho a la newsletter.
//
// SIN «Volver al blog» / COMPARTIR ARRIBA (3ª vuelta, correcciones v1,
// pedido de Samuel: "quita el botón de volver al blog, que los botones de
// compartir estén en ese mismo lugar a la derecha pero arriba dentro del
// hero"): la fila que vivía aquí (Volver a la izquierda, Compartir a la
// derecha, sobre papel) desaparece — Compartir se muda a HeroInterna (prop
// `arriba`, sobreOscuro), en el mismo lado derecho pero DENTRO del hero,
// bajo el nav. Sin botón de volver: el breadcrumb ya se retiró de todos los
// heros de internas (ver cabecera-articulo.tsx) y no se repone aquí.
//
// CUERPO CON ENCABEZADOS (2ª vuelta, mismo día — "crea artículo más largo
// con distintos títulos en diferentes niveles h2, h3, h4 y que al principio
// haya index"): `cuerpo` pasa de `string[]` (párrafos sueltos) a
// `BloqueArticulo[]` (data/blog.ts) — un array de bloques tipados
// (parrafo/h2/h3/h4, estos últimos con `id` para anclar el índice). Sigue
// sin markdown: suficiente mientras haya un puñado de artículos escritos a
// mano. IndiceArticulo (blog/indice-articulo.tsx) escanea esos mismos
// bloques y arma el índice solo — no hay una 2ª fuente de verdad para los
// títulos de sección.
//
// Solo cae en 404 si el slug no existe. Desde 2026-07-22 (Samuel: "no importa
// que todas lleven al único template de single blog que tenemos creado de
// momento") TODAS las cards del índice enlazan aquí, tengan `cuerpo` escrito
// o no — antes solo los artículos con cuerpo enlazaban y el resto quedaba sin
// destino. Con `cuerpo: null` esta página se pinta igual (título, portada,
// meta) pero cambia el bloque central por una nota honesta de "en
// redacción" en vez de fingir un texto que no existe.
export function ArticuloPage() {
  const { slug } = useParams()
  const articulo = ARTICULOS.find((a) => a.slug === slug)

  if (!articulo) return <NoEncontradoPage />

  const autor = EQUIPO.find((m) => m.id === articulo.autorId)
  const relacionados = ARTICULOS.filter((a) => a.slug !== articulo.slug).slice(0, 2)

  return (
    <div className="bg-papel">
      <Meta titulo={articulo.titulo} descripcion={articulo.extracto} ruta={`/blog/${articulo.slug}`} />

      <HeroInterna
        ctaHref="/#tours"
        imagen={{ src: `/fotos/${articulo.foto}.webp`, alt: articulo.fotoAlt }}
        pie={<CompartirArticulo articulo={articulo} sobreOscuro />}
      >
        <CabeceraArticulo articulo={articulo} autor={autor} />
      </HeroInterna>

      <article className="mx-auto max-w-contenido px-5 py-12 sm:px-10 sm:py-16">
        {/* Medida de lectura cómoda (max-w-3xl) SOLO para índice + cuerpo +
            CTA — el resto del artículo («Sigue leyendo», comentarios,
            newsletter) vive al ancho completo del `<article>`. */}
        <div className="mx-auto max-w-3xl">
          {/* Índice. Solo se pinta si el cuerpo tiene encabezados (h2/h3) —
              null en el resto de artículos, que no lo necesitan. Sin margen
              propio: es el primer bloque bajo el hero, el py-12/py-16 del
              `<article>` ya da el aire de sobra (antes el mt-10 compensaba la
              fila Volver/Compartir que vivía aquí — ya no existe, ver arriba). */}
          {articulo.cuerpo ? <IndiceArticulo bloques={articulo.cuerpo} /> : null}

          {/* Cuerpo. Bloques tipados (párrafo/h2/h3/h4) — el contenido vive en
              data/blog.ts, ver BloqueArticulo. Sin markdown: suficiente
              mientras haya un puñado de artículos escritos a mano. Sin cuerpo
              escrito (`cuerpo: null`) no se inventa texto — nota honesta en su
              lugar, mismo criterio que el resto del proyecto con contenido
              pendiente. `scroll-mt-28` en los encabezados: que el salto del
              índice no los deje pegados al borde superior del viewport. */}
          {articulo.cuerpo ? (
            <div className="mt-8 flex flex-col gap-4">
              {articulo.cuerpo.map((bloque, i) => {
                switch (bloque.tipo) {
                  case 'h2':
                    return (
                      <h2
                        key={i}
                        id={bloque.id}
                        className={`scroll-mt-28 font-display text-h3 font-semibold text-navy ${i === 0 ? '' : 'mt-4'}`}
                      >
                        {bloque.texto}
                      </h2>
                    )
                  case 'h3':
                    return (
                      <h3
                        key={i}
                        id={bloque.id}
                        className="scroll-mt-28 font-display text-lg font-semibold text-navy"
                      >
                        {bloque.texto}
                      </h3>
                    )
                  case 'h4':
                    return (
                      <h4
                        key={i}
                        id={bloque.id}
                        className="scroll-mt-28 font-display text-base font-semibold text-navy"
                      >
                        {bloque.texto}
                      </h4>
                    )
                  default:
                    return (
                      <p key={i} className="text-lead leading-relaxed text-navy-sub">
                        {bloque.texto}
                      </p>
                    )
                }
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-card-grande bg-papel-hueso p-6 text-center sm:p-8">
              <p className="text-lead text-navy-sub">
                {t('We’re still finishing this article. Come back soon to read it in full.')}
              </p>
            </div>
          )}

          {/* Cierre: el artículo es contenido de marca, así que termina
              ofreciendo el producto del que habla — sin disfrazarlo de párrafo. */}
          <div className="mt-12 rounded-card-grande bg-papel-hueso p-6 text-center sm:p-8">
            <p className="font-display text-h3 font-semibold text-navy">
              {t('Want to see it with your own eyes?')}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-sub">
              {t('Our tours leave from Punta Cana every day, in small groups.')}
            </p>
            <Boton to="/#tours" className="mt-5">
              {t('See availability')}
            </Boton>
          </div>
        </div>

        {relacionados.length > 0 ? (
          <div className="mx-auto mt-14 max-w-3xl">
            <h2 className="font-display text-h3 font-semibold text-navy">{t('Keep reading')}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/blog/${r.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-card p-4 ring-1 ring-linea transition-colors hover:bg-papel-hueso"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-navy">{r.titulo}</span>
                      <span className="mt-0.5 block text-xs text-navy-soft">
                        {r.categoria} · {r.minutos} {t('min')}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-navy-soft transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mx-auto mt-14 max-w-3xl">
          <ComentariosArticulo slug={articulo.slug} />
        </div>

        <div className="mt-14">
          <Newsletter />
        </div>
      </article>

      <Footer />
    </div>
  )
}
