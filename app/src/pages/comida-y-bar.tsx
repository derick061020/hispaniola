import { useRef } from 'react'
import { Footer } from '@/components/home/footer'
import { BarV3 } from '@/components/comida-y-bar-v3/bar-v3'
import { BarraReservaV3 } from '@/components/comida-y-bar-v3/barra-reserva-v3'
import { CierreV3 } from '@/components/comida-y-bar-v3/cierre-v3'
import { CocinaV3 } from '@/components/comida-y-bar-v3/cocina-v3'
import { EventosV3 } from '@/components/comida-y-bar-v3/eventos-v3'
import { HeroV3 } from '@/components/comida-y-bar-v3/hero-v3'
import { IndiceV3 } from '@/components/comida-y-bar-v3/indice-v3'
import { MenusV3 } from '@/components/comida-y-bar-v3/menus-v3'
import { NivelesV3 } from '@/components/comida-y-bar-v3/niveles-v3'
import { FondoProfundidad } from '@/components/museo/fondo-profundidad'
import { useDescenso } from '@/components/museo/use-descenso'
import { useMuseoAnimaciones } from '@/components/museo/use-museo-animaciones'
import { Meta } from '@/components/seo/meta'
import { COMIDA_Y_BAR, MOSTRAR_NIVELES_BAR_EVENTOS } from '@/data/comida-y-bar'

// FOOD & BAR (/food-and-bar). [2026-10-22, Samuel] La PROPUESTA 3 (2026-10-21)
// es ya la versión definitiva y ocupa /food-and-bar; las versiones anteriores
// (v1 y v2) y la ruta de pruebas se borraron. Los archivos conservan el sufijo «v3»
// (components/comida-y-bar-v3, data/comida-y-bar-v3.ts, styles/comida-y-bar-v3.css):
// es su historia, no una versión paralela. El porqué, en data/comida-y-bar-v3.ts.
//
// [2026-10-21, 2ª revisión de Samuel — elige la v3 como base] Cambia la
// arquitectura de la página:
//   · EL MAR SOLO DONDE TOCA. «Toda la página tiene el mar de fondo y no se
//     distinguen las secciones. Úsalo solo donde lo usa Party Boat: en el Open
//     Bar, desde su inicio hasta el final de lo de eventos privados». La
//     columna de agua del museo (`.museo` + FondoProfundidad + useDescenso)
//     envuelve SOLO el Open Bar y los niveles de barra de eventos. Entra y sale
//     con la espuma del footer de la web (comida-y-bar-v3.css). El shader no
//     pinta la foto del héroe (`foto={null}`) y se pausa fuera de pantalla.
//     Cocina, menús, menús de eventos y el cierre van en claro.
//   · UN SOLO MENÚ INTERNO: IndiceV3 (puntos laterales en escritorio, barra
//     abajo en móvil), con la ilustración de cada sección. Fuera el submenú de
//     chips.
//   · El héroe sigue siendo la caja del museo que se expande (ahora con su
//     <img>, sin shader), sin el ticket, y rompe contra la página con espuma.
//
// El movimiento sigue siendo use-museo-animaciones.ts sobre TODA la página
// (héroe, revelados, ingravidez); la profundidad, solo sobre el agua.
// Con `prefers-reduced-motion`, nada se mueve y todo se ve.
//
// SOMBRAS (4ª revisión, Samuel: «no me gustan; solo si tienen función»). Las
// jerarquías se hacen con contraste de fondo o con una línea fina. Las ÚNICAS
// que quedan, y por qué:
//   · carrete de fotos de la Floating Kitchen y fotos de las estaciones del bar
//     (`--shadow-comida3-portillo`, suave): son fotos sueltas que flotan;
//   · vasos del Open Bar, cócteles de los niveles, Coco Loco del héroe y el del
//     bar (`--shadow-comida3-flota`, suave): recortes que flotan sobre el agua
//     o la foto, y sin ella se funden con el fondo;
//   · sombra de TEXTO (`.comida3-sombra-texto`): legibilidad del blanco sobre la
//     foto del héroe y el agua. Función, no adorno.
// Todo lo demás (cards, medallones, Premium, índice, barra móvil, chips,
// botones, lupa) va sin sombra. Fuera de esta página, el header de la web
// (píldora del nav) conserva la suya: es global.
//
// SEO: un H1 (héroe), un H2 por bloque, H3 por menú/paquete/nivel (cada tarjeta de
// menú lleva su texto indexable y la foto con alt). [2026-10-22] Los menús son
// DOS bloques de 4 tarjetas comparables (tours y eventos): menus-v3.tsx,
// eventos-v3.tsx, tarjetas-v3.tsx.
// Indexable y en el sitemap. El entorno de revisión de Vercel pone su propio
// noindex por cabecera (ver el commit «entorno de revisión»), no esta página.
export function ComidaYBarPage() {
  const paginaRef = useRef<HTMLDivElement>(null)
  const aguaRef = useRef<HTMLDivElement>(null)
  // En el tramo de agua: de la 2ª parada (aún hay sol) a azul de mar abierto.
  // [2026-10-22] Tope bajado de 0,7 a 0,55: a la salida el agua llegaba a un azul
  // marino casi negro que, junto a la ola, se leía como «un fondo oscuro que no
  // es el mar» (Samuel).
  const descenso = useDescenso(aguaRef, 0.55, 0.3)
  useMuseoAnimaciones(paginaRef, descenso)

  return (
    <div ref={paginaRef} className="comida3">
      <Meta
        titulo={COMIDA_Y_BAR.meta.titulo}
        descripcion={COMIDA_Y_BAR.meta.descripcion}
        ruta="/food-and-bar"
      />
      <HeroV3 />
      <IndiceV3 />
      <BarraReservaV3 />
      <main>
        <CocinaV3 />
        <MenusV3 />
        <EventosV3 />
        {/* EL AGUA: Open Bar + niveles de barra de eventos. */}
        <div ref={aguaRef} className="museo comida3-agua relative" data-nav-oscuro>
          <FondoProfundidad descenso={descenso} foto={null} />
          <span aria-hidden="true" className="comida3-espuma comida3-espuma--entra comida3-espuma--agua" />
          <div className="comida3-agua-contenido relative z-10">
            <BarV3 />
            {MOSTRAR_NIVELES_BAR_EVENTOS ? <NivelesV3 /> : null}
          </div>
          <span aria-hidden="true" className="comida3-espuma comida3-espuma--sale comida3-espuma--agua" />
        </div>
        <CierreV3 />
      </main>
      <Footer />
    </div>
  )
}
