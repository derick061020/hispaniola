import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { Header } from '@/components/home/header'
import { irAlAncla } from '@/components/ui/use-anclas-activa'
import { APERTURA_MUSEO, MUSEO, RUTA_CORAL_QUEST, ZONAS_MUSEO } from '@/data/museo'

// HÉROE — copy del V1. «Rompe la superficie».
//
// [2ª vuelta, Samuel] EMPIEZA COMO TODOS LOS HÉROES DEL SITIO y termina como
// esta página: una CAJA redondeada con aire blanco alrededor (los mismos
// márgenes y el mismo radio que HeroInterna y la home) y el Header DENTRO, con
// su logo, su menú y su «Book Now». Al hacer scroll el héroe se ancla y la
// caja se EXPANDE hasta ocupar toda la pantalla (use-museo-animaciones.ts);
// entonces sí, ya estás dentro del agua. Es la transición entre «una página
// más de la web» y el diseño distinto de esta, y de paso el Topbar blanco de
// arriba vuelve a tener sentido: queda sobre papel, como en el resto.
//
// Tener el Header aquí no es estética: es lo que hace funcionar el nav
// flotante. NavFlotante mira el logo con id="logo-hero" y, cuando sale de
// vista, se convierte en la píldora compacta con blur, logo y «Book Now». Sin
// Header no había logo que mirar y el nav se quedaba a medias, ilegible sobre
// el agua clara.
//
// LA FOTO NO LA PINTA EL <img>: la pinta el shader del agua (shader-agua.ts),
// que lee el rectángulo de `data-museo-hero-marco` en cada fotograma. Así las
// ondas del agua la deforman, y su borde de abajo se funde con el agua sin
// corte. El <img> se queda como RESPALDO: se ve si no hay WebGL 2 o con
// movimiento reducido, y lo esconde museo.css en cuanto el canvas está listo.
//
// LA CUENTA ATRÁS sale de APERTURA_MUSEO y desaparece sola cuando llega el día.

function diasHasta(fecha: string) {
  const ms = new Date(fecha).getTime() - Date.now()
  return Math.ceil(ms / 86_400_000)
}

export function HeroMuseo() {
  const h = MUSEO.hero
  const [dias, setDias] = useState(() => diasHasta(APERTURA_MUSEO))

  useEffect(() => {
    const id = window.setInterval(() => setDias(diasHasta(APERTURA_MUSEO)), 60 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [])

  const primera = ZONAS_MUSEO[0].id

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

          <div className="flex flex-1 flex-col justify-end pb-14 lg:pb-20">
            <div className="mx-auto w-full max-w-contenido px-5 sm:px-10" data-museo-hero-texto>
              {/* [3ª vuelta, Samuel: «el badge parece un botón»] La cuenta atrás
                  ya no es una píldora de vidrio (el mismo material que el
                  botón de al lado): es TEXTO en la línea del eyebrow, separado
                  por un filete, con el punto que late. Se lee como dato, no se
                  intenta pulsar. */}
              <p className="museo-eyebrow flex flex-wrap items-center gap-x-4 gap-y-2" data-museo-entra>
                <span>{h.eyebrow}</span>
                {dias > 0 ? (
                  <span className="museo-cuenta">
                    <span aria-hidden="true" className="museo-pulso" />
                    {h.cuentaAtras} {dias} {dias === 1 ? h.dia : h.dias}
                  </span>
                ) : null}
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
                <a href={`#${primera}`} onClick={(e) => irAlAncla(e, primera)} className="museo-boton-vidrio group">
                  {h.ctaBajar}
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
