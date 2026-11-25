import { Link } from 'react-router-dom'
import { ArrowRight, MoveRight, Sparkles } from 'lucide-react'
import { brilloAlMover } from '@/components/museo/brillo-cursor'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { BARRAS_EVENTO } from '@/data/eventos'
import { t } from '@/lib/i18n'
import { Burbujas } from './burbujas'

// LOS NIVELES DE OPEN BAR DE EVENTOS — las tres cards de cristal de Party Boat
// (Caribbean · Premium · Signature), cada una con SU vaso recortado saliendo
// por encima del canto y burbujas subiendo detrás. Aquí las cards son el
// vidrio del museo (`.museo-tarjeta`, halo del cursor); la Signature, con el
// canto dorado de la piel premium.
//
// Nombre, precio, unidad y texto: BARRAS_EVENTO (lo que publica /events). El
// cóctel de cada card es uno que ESE nivel sirve (data/comida-y-bar.ts →
// niveles.bebidas). Sin rótulo en la Signature: ni «Full bar» ni «Most
// complete» tienen fuente para las barras (verificación de la 2ª vuelta).
//
// BARRAS_EVENTO no es `traducible()`: cada texto pasa por t() aquí.
//
// Móvil: carril deslizable con la siguiente card asomando.
const N = COMIDA_Y_BAR.niveles

export function NivelesV3() {
  return (
    <section id="event-bars" className="ancla-comida relative pb-28 pt-20 lg:pt-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="comida3-sombra-texto flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-museo-revelar>
          <div className="max-w-2xl">
            <p className="museo-eyebrow">{N.eyebrow}</p>
            <h2 className="museo-h2 mt-3">{N.titulo}</h2>
            <p className="mt-4 text-lg text-museo-texto-suave">{N.texto}</p>
          </div>
          <Link to="/events#onboard" className="museo-boton-vidrio group shrink-0 self-start md:self-auto">
            {t('See event bars')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <ol className="mx-auto mt-8 flex max-w-contenido snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 pt-nivel-bebida-sobresale [scrollbar-width:none] sm:px-10 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {BARRAS_EVENTO.map((b, i) => {
          const bebida = N.bebidas[b.id]
          const firma = b.id === 'signature'
          return (
            <li key={b.id} className="w-[82%] shrink-0 snap-start scroll-ml-5 sm:w-[55%] md:w-[45%] lg:w-auto" data-museo-revelar>
              <article
                className={`museo-tarjeta comida3-nivel relative flex h-full flex-col text-center ${firma ? 'comida3-nivel--firma' : ''}`}
                onPointerMove={brilloAlMover}
                onPointerDown={brilloAlMover}
              >
                {bebida ? (
                  <div className="comida3-nivel-vaso">
                    <Burbujas cantidad={4} altura="var(--spacing-nivel-bebida)" className="inset-x-[25%] inset-y-0" />
                    <img
                      src={bebida.src}
                      alt={bebida.alt}
                      loading="lazy"
                      decoding="async"
                      data-museo-flotar
                      className="comida3-flota relative mx-auto h-full object-contain"
                    />
                  </div>
                ) : null}
                <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-museo-texto-tenue">
                  <span className="flex gap-1" aria-hidden="true">
                    {BARRAS_EVENTO.map((_, j) => (
                      <span key={j} className={`h-1.5 w-5 rounded-full ${j <= i ? 'bg-museo-luz' : 'bg-museo-borde'}`} />
                    ))}
                  </span>
                  {N.nivel} {i + 1}
                  {b.destacado ? <Sparkles className="size-4 text-premium-oro" aria-hidden="true" /> : null}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-museo-texto">{t(b.nombre)}</h3>
                <p className={`mt-1 font-display text-4xl font-semibold ${firma ? 'text-premium-oro' : 'text-museo-luz'}`}>
                  {t(b.precio)}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-museo-texto-tenue">{t(b.precioNota)}</p>
                <p className="mt-5 border-t border-dashed border-museo-borde pt-5 text-sm leading-relaxed text-museo-texto-suave">
                  {t(b.texto)}
                </p>
              </article>
            </li>
          )
        })}
      </ol>
      <p className="mx-auto mt-2 flex max-w-contenido items-center gap-1.5 px-5 text-xs font-medium text-museo-texto-suave sm:px-10 lg:hidden">
        {t('Swipe to see more')}
        <MoveRight className="size-4" aria-hidden="true" />
      </p>
    </section>
  )
}
