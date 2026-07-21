import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Footer } from '@/components/home/footer'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Newsletter } from '@/components/blog/lista-articulos'
import { Meta } from '@/components/seo/meta'
import { ARTICULOS } from '@/data/blog'
import { EQUIPO } from '@/data/nosotros'
import { NoEncontradoPage } from '@/pages/no-encontrado'

// Página de artículo (/blog/:slug) — correcciones v1 del cliente
// (planes/06-blog.md). El «Leer el artículo» del índice necesitaba destino.
//
// A diferencia del resto de internas, esta NO usa HeroInterna: un artículo se
// abre con su titular y su foto, no con el hero de marca compartido — meter
// el video del catamarán encima de un texto de 6 minutos empujaría el
// contenido fuera del primer viewport sin aportar nada. La cabecera es la
// propia portada del artículo.
//
// Solo se renderiza si el artículo tiene `cuerpo`: los que están propuestos
// pero sin escribir no enlazan desde el índice, y si alguien llega a su URL a
// mano cae en el 404 en vez de ver una página vacía.
export function ArticuloPage() {
  const { slug } = useParams()
  const articulo = ARTICULOS.find((a) => a.slug === slug)

  if (!articulo || !articulo.cuerpo) return <NoEncontradoPage />

  const autor = EQUIPO.find((m) => m.id === articulo.autorId)
  const relacionados = ARTICULOS.filter((a) => a.slug !== articulo.slug && a.cuerpo).slice(0, 2)

  return (
    <div className="bg-papel">
      <Meta titulo={articulo.titulo} descripcion={articulo.extracto} ruta={`/blog/${articulo.slug}`} />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al blog
        </Link>

        <div className="mt-6">
          <Etiqueta>{articulo.categoria}</Etiqueta>
          <h1 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">
            {articulo.titulo}
          </h1>
          <p className="mt-4 text-lead text-navy-sub">{articulo.extracto}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-soft">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-aqua-tint text-xs font-semibold text-aqua-dark"
            >
              {(autor?.nombre ?? 'H').slice(0, 1)}
            </span>
            <span className="font-medium text-navy-sub">{autor?.nombre ?? 'Hispaniola'}</span>
            {autor ? <span className="text-navy-soft">· {autor.rol}</span> : null}
            <span aria-hidden="true">·</span>
            <span>{articulo.fecha}</span>
            <span aria-hidden="true">·</span>
            <span>{articulo.minutos} min de lectura</span>
          </div>
        </div>

        <img
          src={`/fotos/${articulo.foto}.webp`}
          alt={articulo.fotoAlt}
          className="mt-8 aspect-[16/9] w-full rounded-card-grande object-cover"
        />

        {/* Cuerpo. Párrafos sueltos, sin markdown: el contenido vive en
            data/blog.ts como array de strings — suficiente mientras haya un
            puñado de artículos. Si el blog crece, aquí es donde entraría
            markdown/MDX (decisión abierta en el plan). */}
        <div className="mt-10 flex flex-col gap-5">
          {articulo.cuerpo.map((parrafo, i) => (
            <p key={i} className="text-lead leading-relaxed text-navy-sub">
              {parrafo}
            </p>
          ))}
        </div>

        {/* Cierre: el artículo es contenido de marca, así que termina
            ofreciendo el producto del que habla — sin disfrazarlo de párrafo. */}
        <div className="mt-12 rounded-card-grande bg-papel-hueso p-6 text-center sm:p-8">
          <p className="font-display text-h3 font-semibold text-navy">
            ¿Quieres verlo con tus propios ojos?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-navy-sub">
            Nuestros tours salen cada día desde Punta Cana, en grupos pequeños.
          </p>
          <Boton to="/#tours" className="mt-5">
            Ver disponibilidad
          </Boton>
        </div>

        {relacionados.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-display text-h3 font-semibold text-navy">Sigue leyendo</h2>
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
                        {r.categoria} · {r.minutos} min
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

        <div className="mt-14">
          <Newsletter />
        </div>
      </article>

      <Footer />
    </div>
  )
}
