import { useRef } from 'react'
import { Footer } from '@/components/home/footer'
import { Meta } from '@/components/seo/meta'
import { FondoProfundidad } from '@/components/museo/fondo-profundidad'
import { MedidorProfundidad } from '@/components/museo/medidor-profundidad'
import { HeroMuseo } from '@/components/museo/hero-museo'
import { QueEsMuseo } from '@/components/museo/que-es-museo'
import { LlevasMuseo } from '@/components/museo/llevas-museo'
import { GaleriaMuseo } from '@/components/museo/galeria-museo'
import { VideosMuseo } from '@/components/museo/videos-museo'
import { CienciaMuseo } from '@/components/museo/ciencia-museo'
import { ReservaMuseo } from '@/components/museo/reserva-museo'
import { FaqMuseo } from '@/components/museo/faq-museo'
import { CierreMuseo } from '@/components/museo/cierre-museo'
import { useDescenso } from '@/components/museo/use-descenso'
import { useMuseoAnimaciones } from '@/components/museo/use-museo-animaciones'
import { MUSEO } from '@/data/museo'

// MUSEO SUBACUÁTICO (/underwater-museum) — página NUEVA, 2026-10-07.
//
// Encargo de Raymond (reunión 2026-10-05): la versión COMERCIAL del museo, que
// abre el 1 de noviembre. Estructura y textos del V1 de su carpeta; el
// dinamismo, de la B2, rehecho («nosotros podemos hacer algo mucho mejor»,
// Samuel). El porqué de cada dato está en data/museo.ts.
//
// LA URL VA EN INGLÉS aunque Raymond dijo «/museo»: Samuel, 2026-10-07, «hay
// que seguir la nomenclatura que tenemos». En el menú vive dentro de
// Sostenibilidad (data/home.ts → NAV_SOSTENIBILIDAD), no en el nav principal —
// también decisión de la reunión: «no queda visible de buenas a primeras».
//
// EL CONCEPTO: la página es una COLUMNA DE AGUA. Al bajar, el agua se oscurece
// de turquesa a navy, las cáusticas y los rayos de sol se apagan, aparecen
// partículas en suspensión, y un medidor a la derecha dice en qué parada vas.
// Tres capas apiladas en el mismo contenedor:
//   1. el agua (FondoProfundidad, WebGL + degradado de respaldo)  — sticky
//   2. el HUD (MedidorProfundidad)                                — sticky
//   3. el contenido, por encima, con fondos transparentes
// Las dos primeras son `sticky` con margen negativo (museo.css): se quedan
// pegadas mientras dura la columna y se van con ella al llegar el footer.
//
// `data-nav-oscuro` en la columna: el nav flotante se pinta en su versión
// clara mientras pasa por encima del agua.

export function MuseoSubacuaticoPage() {
  const columnaRef = useRef<HTMLDivElement>(null)
  const descenso = useDescenso(columnaRef)
  useMuseoAnimaciones(columnaRef, descenso)

  return (
    <div>
      <Meta
        titulo={MUSEO.meta.titulo}
        descripcion={MUSEO.meta.descripcion}
        ruta="/underwater-museum"
      />
      <div ref={columnaRef} className="museo relative" data-nav-oscuro>
        <FondoProfundidad descenso={descenso} />
        <div className="museo-hud">
          <MedidorProfundidad descenso={descenso} />
        </div>

        <main className="relative z-10">
          <HeroMuseo />
          <QueEsMuseo />
          <LlevasMuseo />
          <GaleriaMuseo />
          <VideosMuseo />
          <CienciaMuseo />
          <ReservaMuseo />
          <FaqMuseo />
          <CierreMuseo />
        </main>
      </div>
      {/* La espuma del footer es un bloque del color del PAPEL recortado con la
          forma de la ola: en el resto de páginas es el blanco de la página que
          se mete en el océano. Aquí encima no hay papel sino abismo, y salía
          una franja blanca. `.museo-pie` (museo.css) la tiñe de abismo. */}
      <div className="museo-pie">
        <Footer />
      </div>
    </div>
  )
}
