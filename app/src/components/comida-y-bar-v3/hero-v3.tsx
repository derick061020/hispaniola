import { ArrowDown } from 'lucide-react'
import { Header } from '@/components/home/header'
import { irAlAncla } from '@/components/ui/use-anclas-activa'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { Burbujas } from './burbujas'

// HÉROE de /food-and-bar — la CAJA del héroe del museo: empieza redondeada
// con el Header dentro y, al hacer scroll, se ancla y se expande hasta llenar
// la pantalla (use-museo-animaciones.ts, `data-museo-hero`).
//
// [2026-10-21, 2ª revisión de Samuel]
//   · FUERA EL TICKET («quemado, muy usado»). A la derecha, el COCO LOCO (la
//     bebida de la casa, servida en su coco) flotando con la ingravidez del
//     museo, con un halo de luz y burbujas subiendo. Se probó con un plato del
//     Premium al lado: sobre una foto que ya es de platos se leía pegado.
//     Solo en escritorio: en móvil la primera pantalla es del titular.
//   · EL AGUA YA NO PINTA AQUÍ: el mar se queda en el Open Bar. La foto es el
//     <img> de siempre.
//   · TRANSICIÓN A LA SECCIÓN DE ABAJO: «se ve una línea recta y seca». El
//     borde de abajo de la caja es ahora la ESPUMA del footer de la web (la
//     máscara `footer-espuma-mapa`), del blanco de la sección siguiente: la
//     foto «rompe» contra la página como una ola en la orilla, y deriva despacio.
//
// Textos: los aprobados (data/comida-y-bar.ts → hero).
const H = COMIDA_Y_BAR.hero
const C = COMIDA_Y_BAR_V3.heroComposicion

export function HeroV3() {
  return (
    <section id="hero" className="museo-hero" data-museo-hero>
      {/* [3ª revisión, Samuel] data-nav-oscuro: el sentinel que observa NavFlotante
            (nav-flotante.tsx) para pintar los tabs del header en BLANCO mientras
            pasan por encima de esta caja oscura, y en oscuro al llegar al fondo
            claro. Es lo que hacen home/hero.tsx y el Museo; v3 lo había perdido
            al sacar el agua de la columna entera. Va en la caja de la foto, no
            en la sección (su aire de alrededor es blanco). */}
      <div className="museo-hero-marco comida3-hero-marco" data-nav-oscuro>
        {/* [2026-10-22] srcset: en móvil no se sirve la de 1440 px. */}
        <img
          src={H.imagen.src}
          srcSet={`${H.imagen.src.replace('-1440', '-800')} 800w, ${H.imagen.src} 1440w`}
          sizes="100vw"
          alt={H.imagen.alt}
          fetchPriority="high"
          className="museo-hero-img"
        />
        <span aria-hidden="true" className="comida3-espuma comida3-espuma--hero" />
      </div>

      <div className="museo-hero-contenido">
        <div className="relative z-10 flex h-full flex-col">
          <Header variante="sobreVideo" />

          <div className="flex flex-1 flex-col justify-end pb-20 lg:pb-24">
            <div className="mx-auto grid w-full max-w-contenido items-end gap-10 px-5 sm:px-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              <div className="comida3-sombra-texto">
                <p className="museo-eyebrow" data-museo-entra>
                  {H.eyebrow}
                </p>
                <h1
                  className="mt-3 font-display text-museo-titular font-semibold text-balance text-museo-texto"
                  data-museo-entra
                >
                  <span className="titulo-subrayado">
                    {H.titulo}
                    <span className="titulo-ola" aria-hidden="true" />
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-museo-texto-suave" data-museo-entra>
                  {H.lead}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3" data-museo-entra>
                  <a href="#menus" onClick={(e) => irAlAncla(e, 'menus')} className="museo-boton-coral group">
                    {H.ctaMenus}
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                  </a>
                  <a href="#open-bar" onClick={(e) => irAlAncla(e, 'open-bar')} className="museo-boton-vidrio group">
                    {H.ctaBar}
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* El Coco Loco, con burbujas subiendo (solo escritorio). */}
              <div className="hidden lg:block" data-museo-entra>
                <div className="comida3-hero-bebida" data-museo-flotar>
                  <Burbujas cantidad={10} altura="var(--spacing-hero-bebida-v3)" className="inset-x-[26%] bottom-[40%] top-[-40%]" />
                  <img src={C.bebida.src} alt={C.bebida.alt} decoding="async" className="comida3-flota relative size-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
