import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/home/header'
import { CHIPS_FOD, FIESTAS_ON_DECK, SLUGS_FOD, type FiestaOnDeck } from '@/data/fiesta-on-deck'
import { t } from '@/lib/i18n'

// Hero de Fiesta on Deck (2026-11-24). Lo que se conserva de la referencia de
// Marketing: el manuscrito encima, «FIESTA» lleno + «ON DECK» hueco + la
// experiencia en un bloque de acento girado, el lead, dos CTA y el vídeo
// vertical en un marco inclinado con su pegatina.
//
// Lo que se MEJORA, que era lo que pedía el Sr. Fernando:
//  · El header es el de Hispaniola (mismo menú que el resto de la web): la
//    landing deja de ser una página suelta con su propia barra.
//  · El «Operated by Hispaniola» y el cambio Afro ⇄ Latin, que en la
//    referencia vivían en dos barras de navegación apiladas, pasan a una sola
//    fila bajo el header — una barra menos antes del titular.
//  · Los seis datos de confianza (privado, 3 h, 2 paradas, decoración, recogida,
//    impuestos) se leen como fila de chips en vez de una tira de texto.
export function HeroFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause()
    else v.play().catch(() => {})
  }, [fiesta.slug])

  return (
    <section id="hero" className="bg-fod-fondo text-fod-texto" data-nav-oscuro>
      <Header
        variante="sobreVideo"
        ctaHref="#fod-reserva"
        marca={{ src: '/fotos/fiesta-on-deck/fiesta-on-deck.webp', alt: 'Fiesta on Deck Punta Cana' }}
      />

      <div className="mx-auto max-w-contenido px-5 pb-12 pt-4 sm:px-10 sm:pb-16">
        {/* Marca + operador + cambio de experiencia */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y-2 border-fod-linea py-3">
          {/* [2026-11-25, Sr. Fernando] El logo de Fiesta on Deck (grande) y el de
              Hispaniola (pequeño, a su derecha) están ya en el header: aquí queda
              el texto «Operated by» como aclaración y el cambio Afro ⇄ Latin. */}
          <span className="text-xs uppercase tracking-wide text-fod-humo">{t('Operated by')} Hispaniola Aquatic Adventures</span>
          <nav aria-label={t('Fiesta on Deck experiences')} className="flex gap-2">
            {SLUGS_FOD.map((slug) => {
              const f = FIESTAS_ON_DECK[slug]
              const activa = slug === fiesta.slug
              return (
                <Link
                  key={slug}
                  to={`/events/${slug}`}
                  aria-current={activa ? 'page' : undefined}
                  className={`border-2 px-3 py-1.5 font-fod text-xs font-extrabold uppercase tracking-wide transition-colors ${
                    activa
                      ? 'border-fod-acento bg-fod-acento text-fod-sobre-acento'
                      : 'border-fod-linea text-fod-texto hover:border-fod-acento'
                  }`}
                >
                  {f.nombre}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="font-fod text-lg font-bold italic text-fod-acento">{fiesta.manuscrito}</p>
            <h1 className="mt-3">
              <span className="fod-display block text-fod-display text-fod-acento">Fiesta</span>
              <span className="fod-display fod-contorno block text-fod-display">On Deck</span>
              <span className="fod-display fod-marcado mt-3 text-fod-h2">{fiesta.nombre}.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-fod-humo sm:text-lg">{fiesta.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#fod-reserva" className="fod-boton">
                {t('Build your party')} <span aria-hidden="true">→</span>
              </a>
              <a href={fiesta.ctaSecundario.ancla} className="fod-boton fod-boton--hueco">
                {fiesta.ctaSecundario.texto}
              </a>
            </div>
          </div>

          {/* Vídeo vertical en marco inclinado. En móvil va debajo y más
              estrecho: el titular manda. */}
          <div className="relative mx-auto w-56 rotate-2 sm:w-64 lg:w-full">
            <video
              ref={videoRef}
              className="fod-marco aspect-[9/16] w-full bg-fod-panel object-cover"
              poster={fiesta.heroCartel}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
            >
              <source src={fiesta.heroVideo} type="video/mp4" />
            </video>
            <span className="fod-pegatina absolute -left-4 top-6 -rotate-6 border-2 border-fod-texto px-3 py-1 font-fod text-xs font-extrabold uppercase">
              ● {fiesta.pegatinaHero}
            </span>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {CHIPS_FOD.map((c) => (
            <li
              key={c}
              className="border-2 border-fod-linea px-3 py-1.5 font-fod text-xs font-bold uppercase tracking-wide text-fod-texto"
            >
              {t(c)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
