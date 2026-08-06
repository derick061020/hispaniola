import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { NavAnclasChips } from '@/components/ui/nav-anclas-chips'
import { CabeceraSostenibilidad } from '@/components/sostenibilidad/cabecera-sostenibilidad'
import { IntroSostenibilidad } from '@/components/sostenibilidad/intro-sostenibilidad'
import { RecorridoSostenibilidad } from '@/components/sostenibilidad/recorrido-sostenibilidad'
import { ImpactoSostenibilidad } from '@/components/sostenibilidad/impacto-sostenibilidad'
import { AporteSostenibilidad } from '@/components/sostenibilidad/aporte-sostenibilidad'
import { VideosSostenibilidad } from '@/components/sostenibilidad/videos-sostenibilidad'
import { FundacionTeaser } from '@/components/sostenibilidad/fundacion-teaser'
import { ProyectosSostenibilidad } from '@/components/sostenibilidad/proyectos-sostenibilidad'
import { CierreDoble } from '@/components/sostenibilidad/cierre-doble'
import { Meta } from '@/components/seo/meta'
import { ANCLAS_VENTAJA, SOSTENIBILIDAD } from '@/data/sostenibilidad'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useSostenibilidadReveal } from '@/components/sostenibilidad/use-sostenibilidad-reveal'

// Página VENTAJA COMPETITIVA (/ventaja-competitiva) — combina las 2 páginas
// reales de la web actual: sustainability.php (intro + 3 pilares + cierre) y
// competitive-advantage.php (la frase + los 7 videos), tal como preveía la
// arquitectura (arquitectura-nueva.md: Competitive Advantage se absorbe aquí).
//
// ⚠️ LA RUTA ERA `/sostenibilidad` HASTA EL 2026-07-28. El cliente titula su
// slide 57 «nueva pagina de ventajas competitivas» y Samuel le preguntó en la
// reunión del 07-24 qué la diferenciaba de sostenibilidad: «básicamente [lo
// mismo]» (34:17). O sea, NO es una página nueva — es ESTA, reencuadrada: lo
// que era una página que informa pasa a ser la que VENDE el argumento que el
// propio cliente considera su ventaja («tu reserva sostiene a nuestra gente y
// al mar», 34:23). El slug sigue al encuadre; `/sostenibilidad` queda como
// 301 (App.tsx y netlify.toml) porque es URL indexada y enlazada desde fuera.
//
// Los COMPONENTES y los DATOS se quedan en `sostenibilidad/` a propósito: el
// dominio del contenido sigue siendo la sostenibilidad (el menú del cliente
// mantiene ese tab, slide 20), lo que cambió es cómo se vende. Renombrar 8
// componentes y una constante que consumen blog/guías/flota no compra nada.
//
// Orden del contenido: misión + video → EL RECORRIDO de los 3 pilares (zigzag
// con la curva y el catamarán) → banda de impacto (las 4 cifras) → A DÓNDE VA
// TU APORTE (los 2 importes por huésped) → los 7 videos → teaser de la
// fundación → los 5 proyectos → membresías → cierre. La banda de impacto va
// justo DESPUÉS del recorrido a propósito (3ª vuelta, 2026-07-22): los
// pilares cuentan QUÉ se hace y las cifras rematan CUÁNTO — separarlas con
// los videos en medio rompía el remate. El aporte va pegado a las cifras
// porque es el mecanismo que las financia: resultado → de dónde sale. Y los
// tres últimos bloques son el tramo de la fundación, en el orden de los
// slides 62-64: quién es → en qué trabaja → cómo apoyarla.
//
// Ese orden es también el de los 7 chips (ANCLAS_VENTAJA) — y no por
// casualidad: un índice que no sigue el orden de lectura desincroniza el
// resaltado al scrollear.
//
// ⚠️ [v2 2026-07-28] Los slides 63 (los 5 proyectos) y 64 (membresías) se
// traen AQUÍ además de a /fundacion, por pedido de Samuel. El copy no se
// duplica —los dos sitios leen data/fundacion.ts— pero el TEXTO sí se ve en
// dos páginas. Si eso acaba molestando, la decisión es cuál de las dos lo
// cuenta, no retocar uno de los dos textos para «diferenciarlos».
//
// PLAN-INTERNAS-V2.md (2026-07-17, Samuel): adopta el HERO COMPARTIDO con la
// home, la ficha de tour y las landings de evento (internas/hero-interna.tsx)
// — mismo box redondeado + Header `sobreVideo` dentro, con las fotos reales
// del arrecife en fundido en vez de una imagen fija al lado. "Reservar" del
// header no tiene ancla propia aquí → lleva al grid de tours de la home.
export function VentajaCompetitivaPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-sost=estatico congela el reveal de scroll en su estado
  // FINAL (todos los bloques ya visibles) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la página se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-sost', (v) => {
    if (v === 'estatico') setEstatico(true)
  })
  useSostenibilidadReveal(contenidoRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <div>
      <Meta
        titulo={SOSTENIBILIDAD.titulo}
        descripcion="Restauración de arrecifes de coral, apoyo a comunidades locales y operación responsable — la Bávaro Reefs Foundation detrás de cada tour."
        ruta="/competitive-advantage"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraSostenibilidad />
      </HeroInterna>

      {/* Los 7 chips del slide 58. FUERA del contenedor de contenido: la barra
          sangra a todo el ancho (igual que la de la ficha de tour) y no debe
          heredar el reveal de GSAP del bloque de abajo — un índice que aparece
          con fade al scrollear llega tarde a su único trabajo. */}
      <NavAnclasChips anclas={ANCLAS_VENTAJA} />

      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <IntroSostenibilidad />

          {/* [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pags. 1-2] LA HISTORIA DE
              LAS TORTUGAS Y LA LETANIA. El copy aprobado trae dos piezas que
              no cabian en el bloque de mision y que no pueden ir en parrafo
              corrido:
                · La historia es EL argumento diferencial del cliente —
                  documentaron colisiones con tortugas verdes y con eso
                  impulsaron un area marina protegida que hoy gestionan con el
                  Ministerio de Medio Ambiente—. Es lo que Miguel resumio como
                  «por aqui nadie hace nada de eso». Va sobre fondo propio,
                  con la foto del arrecife, para que se lea como el hecho que
                  es y no como un parrafo mas.
                · La letania son cinco frases que empiezan igual («You're
                  helping…»). Escritas seguidas se pierden; en lista, cada una
                  es un golpe. */}
          <section className="grid gap-6 rounded-card-grande bg-fondo-ficha p-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-8">
            <p className="text-lead text-navy-sub">{SOSTENIBILIDAD.historia}</p>
            <img
              src="/fotos/arrecife-fondo-cenital.webp"
              alt="El área marina protegida vista desde el aire"
              loading="lazy"
              className="h-56 w-full rounded-card object-cover lg:h-72"
            />
          </section>

          <section className="text-center">
            <p className="font-display text-h3 font-semibold text-navy">
              {SOSTENIBILIDAD.letaniaIntro}
            </p>
            <ul className="mx-auto mt-6 flex max-w-2xl flex-col gap-3">
              {SOSTENIBILIDAD.letania.map((linea) => (
                <li key={linea} className="text-lead text-navy-sub">
                  {linea}
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-6 max-w-2xl font-display text-lg font-medium text-navy">
              {SOSTENIBILIDAD.letaniaCierre}
            </p>
          </section>
          <RecorridoSostenibilidad activo={!estatico} /> {/* [dev-mode] gate */}
          <ImpactoSostenibilidad />
          <AporteSostenibilidad />
          <VideosSostenibilidad />
          <FundacionTeaser />
          <ProyectosSostenibilidad activo={!estatico} /> {/* [dev-mode] gate */}
          <CierreDoble />
        </div>
      </div>

      {/* [v3 2026-08-06, WEBSITE-SOSTENIBILIDAD pag. 13] «YOUR CARIBBEAN
          STORY STARTS HERE» — el cliente pide OTRO texto para la misma banda
          de cierre que la home. Por eso el footer lo acepta por prop desde F2:
          esta es la pagina que lo estrena. */}
      <Footer cta="Your Caribbean story starts here" />
    </div>
  )
}
