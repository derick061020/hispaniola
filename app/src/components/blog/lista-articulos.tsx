import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Etiqueta } from '@/components/ui/etiqueta'
import { ARTICULOS, CATEGORIAS_BLOG, type Articulo, type CategoriaBlog } from '@/data/blog'
import { RESENAS_AGREGADO } from '@/data/home'
import { MetaArticulo, ChipCategoria, fundePapel } from './card-destacado'
import { CarruselDestacados } from './carrusel-destacados'

gsap.registerPlugin(Flip)

// Índice del blog (correcciones v1 del cliente, 2026-07-20 —
// planes/06-blog.md slides 1-3): carrusel de destacados + rejilla filtrable
// por categoría + newsletter. El carrusel (2026-07-22, pedido de Samuel:
// "al menos 4 cards") vive en carrusel-destacados.tsx; CardDestacado y sus
// piezas compartidas (MetaArticulo, ChipCategoria) viven en
// card-destacado.tsx — en su propio archivo para que CarruselDestacados
// pueda importar CardDestacado sin crear un ciclo con este archivo (que a su
// vez importa CarruselDestacados).
//
// ⚠️ ARTÍCULOS SIN ESCRIBIR: solo uno tiene cuerpo (ver data/blog.ts para el
// porqué). Desde 2026-07-22 (Samuel: "no importa que todas lleven al único
// template de single blog que tenemos creado de momento") TODAS las cards —
// rejilla y carrusel — enlazan igual a /blog/:slug con su botón «Leer el
// artículo»; ya no hay chip «Próximamente» ni cards sin enlace. La propia
// plantilla (pages/articulo.tsx) resuelve `cuerpo: null` con una nota honesta
// de "en redacción" en vez de fingir un cuerpo que no existe. Cuando se
// escriban, basta con rellenar `cuerpo` y la página se completa sola.
//
// El filtrado por categoría anima con GSAP Flip — mismo efecto que
// CategoriasFaq (components/faq/categorias-faq.tsx, pedido de Samuel:
// reusarlo aquí). Detalle de la mecánica en ListaArticulos, más abajo.

function CardArticulo({ articulo }: { articulo: Articulo }) {
  const contenido = (
    <>
      {/* p-2 (8px): la imagen ya NO va en sangre — mismo marco que
          CardDestacado, y por el mismo motivo cierra el radio anidado
          (24 = 16 + 8): el marco exterior del card es rounded-card-grande
          (24px), así que la imagen usa rounded-card (16px) en sus esquinas
          reales, no un radio propio suelto. Solo funde hacia abajo (esta
          card no cambia de layout en lg como la destacada), así que solo
          las esquinas de ABAJO se ponen a 0 — ver el porqué en CardDestacado. */}
      <div className="p-2">
        <div className="relative overflow-hidden rounded-t-card">
          <img
            src={`/fotos/${articulo.foto}.webp`}
            alt={articulo.fotoAlt}
            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: fundePapel('to bottom') }} />
        </div>
      </div>
      <div className="flex grow flex-col px-5 pb-5">
        <ChipCategoria categoria={articulo.categoria} />
        <h3 className="mt-3 text-balance font-display text-h3 font-semibold text-navy">
          {articulo.titulo}
        </h3>
        <p className="mt-2 grow text-sm text-navy-sub">{articulo.extracto}</p>
        <MetaArticulo articulo={articulo} />
        {/* Siempre visible — mismo criterio que CardDestacado: TODAS las
            cards enlazan a /blog/:slug, tenga cuerpo escrito o no (ver la
            nota arriba). w-full/justify-center en vez de inline-flex/self-
            start: pedido de Samuel de que el botón "abarque el 100%
            posible" del ancho de la card. */}
        <span className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-btn bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-coral-dark">
          Read the article
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </>
  )

  // articulo-card: marca para que el filtrado de ListaArticulos (GSAP Flip)
  // sepa qué elementos medir/animar — mismo patrón que .faq-categoria en
  // categorias-faq.tsx.
  const clases =
    'articulo-card group flex flex-col overflow-hidden rounded-card-grande bg-papel ring-1 ring-linea'

  return (
    <article className={clases}>
      <Link to={`/blog/${articulo.slug}`} className="flex grow flex-col">
        {contenido}
      </Link>
    </article>
  )
}

export function ListaArticulos() {
  const [activa, setActiva] = useState<CategoriaBlog | null>(null)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const flipEstadoRef = useRef<Flip.FlipState | null>(null)
  const alturaAntesRef = useRef<number | null>(null)

  // Destacados → el carrusel de arriba (al menos 4, pedido de Samuel). Ya NO
  // se sacan de la rejilla de abajo: un artículo destacado también se puede
  // seguir navegando/filtrando por categoría ahí, como en cualquier blog con
  // hero + listado — antes «destacado» excluía del resto porque solo había
  // uno; con varios, esconderlos también de la rejilla los dejaría solo
  // accesibles mientras el carrusel los tuviera activos.
  const destacados = ARTICULOS.filter((a) => a.destacado)
  const visibles = activa ? ARTICULOS.filter((a) => a.categoria === activa) : ARTICULOS

  // Filtrado animado con GSAP Flip — MISMO patrón que CategoriasFaq
  // (components/faq/categorias-faq.tsx, pedido de Samuel: reusar aquí el
  // mismo efecto). `elegir()` captura el estado ANTES de `setActiva` (el DOM
  // viejo); el useLayoutEffect de abajo corre YA con el DOM filtrado y anima
  // Flip.from de uno a otro. Ver ese archivo para el porqué de cada pieza
  // (el freeze/animate del alto del contenedor, el targets del set
  // COMPLETO para detectar entradas y salidas en los dos sentidos, etc.) —
  // no se repite aquí para no duplicar el mismo comentario dos veces.
  function elegir(id: CategoriaBlog | null) {
    if (contenedorRef.current) {
      flipEstadoRef.current = Flip.getState(contenedorRef.current.querySelectorAll<HTMLElement>('.articulo-card'))
      alturaAntesRef.current = contenedorRef.current.getBoundingClientRect().height
    }
    setActiva(id)
  }

  useLayoutEffect(() => {
    const estado = flipEstadoRef.current
    const contenedor = contenedorRef.current
    const alturaAntes = alturaAntesRef.current
    if (!estado || !contenedor) return
    flipEstadoRef.current = null
    alturaAntesRef.current = null

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const DURACION = 0.45
    const alturaDespues = contenedor.getBoundingClientRect().height

    Flip.from(estado, {
      targets: contenedor.querySelectorAll<HTMLElement>('.articulo-card'),
      duration: DURACION,
      ease: 'power2.inOut',
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3, delay: 0.12 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.22 }),
    })

    if (alturaAntes != null) {
      gsap.fromTo(
        contenedor,
        { height: alturaAntes, overflow: 'hidden' },
        {
          height: alturaDespues,
          duration: DURACION,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(contenedor, { height: 'auto', overflow: '' }),
        },
      )
    }
  }, [activa])

  return (
    <div className="flex flex-col gap-12">
      <CarruselDestacados articulos={destacados} />

      <div>
        {/* Filtros por categoría (slide 2). Mismo patrón que los chips de la
            página FAQ — un solo idioma de filtro en todo el sitio. */}
        <div
          role="group"
          aria-label="Filter articles by category"
          className="flex flex-wrap gap-2"
        >
          {[{ id: null as CategoriaBlog | null, nombre: 'All' }, ...CATEGORIAS_BLOG.map((c) => ({ id: c, nombre: c }))].map(
            (chip) => {
              const seleccionado = activa === chip.id
              return (
                <button
                  key={chip.nombre}
                  type="button"
                  onClick={() => elegir(chip.id)}
                  aria-pressed={seleccionado}
                  className={`rounded-chip px-4 py-2 text-sm font-medium transition-colors ${
                    seleccionado
                      ? 'bg-navy text-white'
                      : 'bg-papel text-navy-sub ring-1 ring-linea hover:bg-papel-hueso'
                  }`}
                >
                  {chip.nombre}
                </button>
              )
            },
          )}
        </div>

        <div ref={contenedorRef} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((a) => (
            <CardArticulo key={a.slug} articulo={a} />
          ))}
        </div>
      </div>

      <Newsletter />
    </div>
  )
}

// Newsletter (slide 3). SOLO PROTOTIPO, como el formulario de contacto: no
// hay servicio de email conectado (Mailchimp/Brevo es una decisión pendiente
// del cliente), así que el submit confirma en pantalla y no envía nada. El
// microcopy no promete lo que no hacemos.
//
// Rediseño (pedido de Samuel, referencias visuales): banner COMPACTO en dos
// columnas — texto + avatares a la izquierda, campo de email a la derecha
// (antes todo centrado y apilado, con mucho más alto). El total de reseñas
// (RESENAS_AGREGADO, el mismo agregado real de la home) da el "1.782+
// viajeros". El fondo es footer-oceano.webp (la foto real que ya usa el
// Footer) con el MISMO overlay (--color-overlay-footer, ya verificado a AA
// sobre este asset) más un fundido propio hacia bg-navy por la izquierda: la
// foto se ve texturizada a la derecha (donde no hay texto encima) y se
// disuelve en navy sólido bajo el título/párrafo/avatares, que necesitan el
// contraste más alto.
//
// Avatares del stack de abajo: fotos de stock (Freepik/Magnific), NO clientes
// reales — a diferencia de reviews.tsx (iniciales, placeholder honesto
// porque ahí SÍ se nombra a una reseña real con su cita), aquí Samuel pidió
// explícitamente caras en vez de iniciales, "así sean stock de momento". Por
// eso van aria-hidden + alt="": decorativas, sin atribuir la foto a ninguna
// reseña ni cliente concreto.
const AVATARES_NEWSLETTER = [
  'avatar-newsletter-1',
  'avatar-newsletter-2',
  'avatar-newsletter-3',
  'avatar-newsletter-4',
]

export function Newsletter() {
  const [enviado, setEnviado] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-card-grande bg-navy px-6 py-8 sm:px-10">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src="/fotos/footer-oceano.webp"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0" style={{ background: 'var(--color-overlay-footer)' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, var(--color-navy) 30%, transparent 85%)' }}
        />
      </div>

      <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-12">
        <div>
          <Etiqueta sobreOscuro>Newsletter</Etiqueta>
          <h2 className="mt-2 text-balance font-display text-h3 font-semibold text-white sm:text-h2">
            Don’t miss a thing
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
            Guides, stories from the sea and deals for your trip to Punta Cana. Straight to your
            inbox, no spam.
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex -space-x-2" aria-hidden="true">
              {AVATARES_NEWSLETTER.map((foto) => (
                <img
                  key={foto}
                  src={`/fotos/${foto}.webp`}
                  alt=""
                  loading="lazy"
                  className="size-7 shrink-0 rounded-full object-cover ring-2 ring-navy"
                />
              ))}
            </div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-white">
                {RESENAS_AGREGADO.total.toLocaleString('en-US')}+
              </span>{' '}
              travelers already trust us
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEnviado(true)
          }}
          className="w-full lg:w-[28rem]"
        >
          <label htmlFor="newsletter-email" className="text-xs font-medium text-white/70">
            Stay in the loop
          </label>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-btn border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-btn bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Subscribe
            </button>
          </div>
          {enviado ? (
            <p role="status" className="mt-2 text-xs font-medium text-aqua-claro">
              Thanks! We’ll write to you when we publish something worth reading.
            </p>
          ) : (
            <p className="mt-2 text-xs text-white/50">
              You agree to receive news from Hispaniola. You can unsubscribe whenever you want.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
