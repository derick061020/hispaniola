import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Header } from '@/components/home/header'
import { irAlAncla } from '@/components/ui/use-anclas-activa'
import { formatoDinero } from '@/data/home'
import { APERTURA_MUSEO, MUSEO, PRECIO_MUSEO, RUTA_CORAL_QUEST, ZONAS_MUSEO } from '@/data/museo'
import { dosCifras, useCuentaAtras } from './use-cuenta-atras'

// HÉROE — copy del V1. «Rompe la superficie».
//
// [2ª vuelta, Samuel] EMPIEZA COMO TODOS LOS HÉROES DEL SITIO y termina como
// esta página: una CAJA redondeada con aire blanco alrededor (los mismos
// márgenes y el mismo radio que HeroInterna y la home) y el Header encima, con
// su logo, su menú y su «Book Now». Al hacer scroll el héroe se ancla y la
// caja se EXPANDE hasta ocupar toda la pantalla (use-museo-animaciones.ts).
//
// Tener el Header aquí no es estética: es lo que hace funcionar el nav
// flotante. NavFlotante mira el logo con id="logo-hero" y, cuando sale de
// vista, se convierte en la píldora compacta con blur, logo y «Book Now».
//
// LA FOTO NO LA PINTA EL <img>: la pinta el shader del agua (shader-agua.ts),
// que lee el rectángulo de `data-museo-hero-marco` en cada fotograma. Así las
// ondas la deforman y su borde de abajo se funde con el agua sin corte. El
// <img> es el RESPALDO (sin WebGL 2, con movimiento reducido o mientras la
// foto llega a la GPU).
//
// [2026-10-07, Marketing tras ver la preview — «10/10, solo pequeños cambios»]
//   · LA FOTO: el buzo saludando junto al Diablo Cojuelo (MEJORADAS/IMG_5757),
//     la que marcaron en la galería («cambiaremos esta imagen… agregamos
//     esta»). Antes era el bateador con los rayos de sol.
//   · COMPRA MÁS VISIBLE: «Book Coral Quest» en coral, con el «desde» dentro
//     del propio botón — el precio es lo que convierte el botón en oferta. El
//     «Dive into the museum» queda al lado, en vidrio, como secundario.
//   · APERTURA CON PROTAGONISMO: la fecha y un CONTADOR al segundo, en una
//     pieza propia a la derecha del titular (debajo en móvil). Sustituye al
//     «Opens in 25 days» del eyebrow, que se quedaba pequeño.

export function HeroMuseo() {
  const h = MUSEO.hero
  const cuenta = useCuentaAtras(APERTURA_MUSEO)
  const primera = ZONAS_MUSEO[0].id

  const unidades = [
    { valor: cuenta.dias, etiqueta: h.unidades.dias },
    { valor: cuenta.horas, etiqueta: h.unidades.horas },
    { valor: cuenta.minutos, etiqueta: h.unidades.minutos },
    { valor: cuenta.segundos, etiqueta: h.unidades.segundos },
  ]

  return (
    <section id="hero" className="museo-hero" data-museo-hero>
      {/* [3ª vuelta] La CAJA y el CONTENIDO van separados. La caja es solo la
          foto y es lo único que crece; el Header y el texto van en su propia
          capa, quieta, con los márgenes de la caja inicial. Cuando el Header
          iba dentro de la caja, el logo y «Book now» se movían con su borde
          mientras los tabs (que son de NavFlotante, otra capa) se quedaban
          quietos: se descuadraban (Samuel, con captura). */}
      <div className="museo-hero-marco" data-museo-hero-marco>
        <img src={`/fotos/${h.foto}.webp`} alt={h.fotoAlt} fetchPriority="high" className="museo-hero-img" />
      </div>

      <div className="museo-hero-contenido">
        <div className="relative z-10 flex h-full flex-col">
          <Header variante="sobreVideo" ctaHref={RUTA_CORAL_QUEST} />

          <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
            <div
              className="mx-auto grid w-full max-w-contenido items-end gap-8 px-5 sm:px-10 lg:grid-cols-[1fr_auto] lg:gap-12"
              data-museo-hero-texto
            >
              <div>
                <p className="museo-eyebrow" data-museo-entra>
                  {h.eyebrow}
                </p>
                <h1
                  className="mt-3 max-w-4xl font-display text-museo-titular font-semibold text-balance text-museo-texto"
                  data-museo-entra
                >
                  {h.titulo}
                </h1>
                <p className="mt-5 max-w-xl text-lg text-museo-texto-suave" data-museo-entra>
                  {h.lead}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3" data-museo-entra>
                  <Link to={RUTA_CORAL_QUEST} className="museo-boton-coral museo-boton-grande group">
                    {h.ctaReserva}
                    <span className="museo-boton-precio">
                      {h.desde} {formatoDinero(PRECIO_MUSEO.light)}
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <a href={`#${primera}`} onClick={(e) => irAlAncla(e, primera)} className="museo-boton-vidrio group">
                    {h.ctaBajar}
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {cuenta.terminada ? null : (
                <div className="museo-apertura" data-museo-entra role="timer" aria-live="off">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-museo-luz uppercase">
                    <span aria-hidden="true" className="museo-pulso" />
                    {h.apertura}
                  </p>
                  <p className="mt-1 font-display text-h3 font-semibold text-museo-texto">{h.fechaApertura}</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {unidades.map((u) => (
                      <div key={u.etiqueta} className="museo-apertura-unidad">
                        <span className="font-display text-museo-cifra-reloj font-semibold leading-none text-museo-texto tabular-nums">
                          {dosCifras(u.valor)}
                        </span>
                        <span className="mt-1.5 text-museo-etiqueta font-semibold tracking-widest text-museo-texto-tenue uppercase">
                          {u.etiqueta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
