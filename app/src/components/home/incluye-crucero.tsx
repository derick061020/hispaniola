import { useRef, useState, type CSSProperties } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useIncluyeScroll } from '@/components/home/use-incluye-scroll'
import { INCLUYE_CRUCERO } from '@/data/home'

// Sección «Incluye» (rediseño v3-F19.2, pedido de Samuel 2026-07-15) —
// editorial inmersiva, ref. "WHAT'S INCLUDED" que aportó Samuel. Cambia por
// completo la 1ª versión (cards con fondo blanco): un océano oscuro que se
// FUNDE con el blanco de la web arriba y abajo mediante bandas de ESPUMA real
// (Samuel 2026-07-16: el linear-gradient de la 1ª pasada era "un borde recto",
// pidió que la espuma misma fuera la transición), el catamarán cenital (proa abajo)
// BAJANDO por el centro al hacer scroll y los 8 ítems como texto numerado
// (01/ … 08/) directamente sobre el agua, sin cajas — en diagonal alternando
// lados, «cascando» junto al barco.
//
// El descenso del barco y el reveal de los ítems (enganchados al scroll, NO
// sticky) viven en use-incluye-scroll.ts. Solo desktop; en móvil el barco es
// la pieza de apertura (estático, arriba) y los 8 ítems van en lista.
//
// Assets generados en Magnific (no stock, regla del proyecto — ver
// PLAN-v3.md §9), con referencia a las fotos REALES del catamarán de
// Hispaniola (hero-catamaran-2.webp + catamaran-recorte.webp) para mantener
// el mismo barco — casco gemelo blanco, redes de proa, toldo de la cabina:
//   · Fondo: incluye-oceano-cenital.mp4 — océano CENITAL turquesa Caribe
//     (Seedance 2.0). El brief lleva ALTURA y MOVIMIENTO explícitos ("dron a
//     35m, encuadre de ~45m, crestas cada 5-10m, el agua fluye sin parar"):
//     la 1ª versión solo decía "dron directamente arriba" y salió un dron
//     PARADO y altísimo — el agua se movía un 1% en 5s (nada que scrubbear) y
//     las olas eran ~10× más chicas de lo que pide la escala del barco. Los
//     45m no van a ojo: el barco se pinta a 480px ≈ 13m de eslora ≈ 35px/m.
//   · Barco: incluye-barco-cenital.webp — recorte CENITAL con fondo
//     transparente (Nano Banana Pro + remove-background), volteado en el
//     archivo a PROA ABAJO para que apunte en el sentido en que desciende. Su
//     proporción real (~0.54, mucho más alargada que la vista 3/4 anterior)
//     es la de un catamarán visto desde arriba: más angosto que
//     --spacing-incluye-lane, así que le sobra aire a los lados — ok.
//   · Espuma: incluye-espuma-mapa.webp — mapa de ALFA para la transición con
//     el papel (ver .incluye-espuma). Truco: se pidió una foto cenital de
//     espuma blanca sobre agua casi negra, porque la luminancia de esa foto
//     YA es el mapa — no hubo que fingir un degradado.
export function IncluyeCrucero() {
  const sectionRef = useRef<HTMLElement>(null)

  // [dev-mode] ?dev-incluye=estatico congela la sección en su estado FINAL
  // (ítems visibles, barco a media sección) → frame limpio para Figma, sin
  // GSAP enganchado. Como el agua ya NO se reproduce sola (avanza con el
  // scroll), sin GSAP el video se queda en su poster: el flag congela la
  // sección entera, agua incluida, sin tener que pausar nada a mano.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-incluye', (v) => {
    if (v === 'estatico') setEstatico(true)
  })
  useIncluyeScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    // overflow-x-clip: el barco corre por el centro y podría asomar de lado en
    // pantallas justas; clip evita scroll horizontal sin crear scroll container.
    // A sangre (sin px del contenedor de página): el océano llega a los bordes.
    <section
      ref={sectionRef}
      id="incluye"
      // data-nav-oscuro (2026-07-22): sentinel que observa NavFlotante para
      // pintar el texto de los tabs en blanco al pasar por esta sección —
      // ver el comentario en home/hero.tsx. Aquí SÍ va en el <section>
      // entero (a diferencia del hero/wd-banner): bg-navy cubre toda la
      // caja, padding incluido, sin zona transparente que dé falso positivo.
      // mt-* : gap blanco que separa el océano del banner de Reserva directa.
      // pt/pb con --spacing-incluye-espuma incluido: reserva sitio para las
      // bandas de espuma arriba/abajo, así el texto blanco nunca cae sobre la
      // espuma blanca. Tokens, no valores a ojo (van a Figma).
      data-nav-oscuro
      className="relative mt-incluye-gap-movil overflow-x-clip bg-navy pb-[calc(var(--spacing-seccion-sm)+var(--spacing-incluye-espuma-movil))] pt-[calc(var(--spacing-seccion-sm)+var(--spacing-incluye-espuma-movil))] sm:mt-incluye-gap sm:pb-[calc(var(--spacing-seccion)+var(--spacing-incluye-espuma))] sm:pt-[calc(var(--spacing-seccion)+var(--spacing-incluye-espuma))]"
    >
      {/* Océano — el barco vive FUERA de esta capa para poder asomar por encima
          del agua al arrancar el descenso (mismo reparto media/contenido que el
          hero).

          El video va FIJO A LA VENTANA (sticky, 100svh — ver componentes.css) y
          AVANZA CON EL SCROLL, no solo: sin autoPlay ni loop, su playhead lo
          mueve use-incluye-scroll.ts. Si nadie scrollea, el agua está congelada;
          y no hay reinicio que disimular, porque no hay bucle (pedido de Samuel,
          2026-07-16). Acotarlo a una ventana es además lo que arregla que no se
          viera HD — el porqué, en componentes.css.

          preload="none" a propósito: el scrub es solo desktop, así que en móvil
          (y con reduced-motion, y con ?dev-incluye=estatico) el <video> se queda
          en su poster y NO descarga los 7.5MB. El hook lo pasa a "auto" y lo
          carga solo cuando de verdad va a engancharlo. */}
      <div className="incluye-oceano" aria-hidden="true">
        <video poster="/fotos/incluye-oceano-poster.webp" muted playsInline preload="none">
          <source src="/video/incluye-oceano-cenital.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'var(--color-overlay-incluye)' }} />
      </div>

      {/* Espuma arriba y abajo: el océano se DISUELVE en el papel (pedido de
          Samuel, ref. "olas rompiendo que se funden con el blanco"). No es un
          degradado — es una capa de papel recortada por un mapa de alfa de
          espuma real; la mecánica y el porqué, en componentes.css.

          ⚠️ Van FUERA de .incluye-oceano a propósito, aunque tapen su media:
          dentro, su overflow:hidden las recortaba justo en el borde de la
          sección, y ese recorte redondea el subpíxel distinto a como el
          navegador pinta los fondos — dejaba 1px de mar oscuro asomando contra
          el papel (medido en captura; ver --incluye-espuma-sangrado). Fuera del
          recorte sellan el borde a blanco puro. */}
      <div className="incluye-espuma incluye-espuma--top" />
      <div className="incluye-espuma incluye-espuma--bottom" />

      {/* Título — CENTRADO y GRANDE, tendido sobre el agua (v3-F19.3, Samuel:
          "al centro, más grande, que el barco le pase por encima"; antes iba
          acotado a la izquierda justo para esquivar el carril del barco — ahora
          lo ocupa a propósito y el catamarán navega por encima del texto al
          scrollear). La mezcla con el agua vive en .incluye-titulo. */}
      <div className="relative z-10 mx-auto w-full max-w-contenido px-5 text-center sm:px-10">
        <Etiqueta sobreOscuro>A bordo</Etiqueta>
        <h2 className="incluye-titulo mx-auto mt-4 max-w-4xl font-display text-incluye-titulo-movil font-semibold text-aqua-claro lg:text-incluye-titulo">
          Todos nuestros cruceros incluyen
        </h2>
      </div>

      {/* Barco cenital — pieza de apertura en móvil (en el flujo, tras el
          título); en desktop sale del flujo y DESCIENDE por el centro (la
          mecánica vive en componentes.css + use-incluye-scroll.ts). */}
      <img
        src="/fotos/incluye-barco-cenital.webp"
        alt="Catamarán de Hispaniola visto desde el aire, navegando en el mar del Caribe"
        width={964}
        height={1798}
        loading="lazy"
        className="incluye-barco relative z-10 mt-8 h-incluye-barco-alto-movil w-auto lg:mt-0 lg:h-incluye-barco-alto"
        style={estatico ? ({ '--barco-y': 0.45 } as CSSProperties) : undefined} // [dev-mode] barco a media sección para el frame
      />

      {/* Ítems editoriales — móvil: lista simple (1 columna). Desktop: grid de
          3 columnas [1fr | carril del barco | 1fr]; cada ítem se coloca en su
          fila y lado con --col/--fila (ver componentes.css). */}
      <div
        className="relative z-10 mx-auto grid w-full max-w-contenido grid-cols-1 gap-y-incluye-fila-movil px-5 pt-12 sm:px-10 lg:grid-cols-[1fr_var(--spacing-incluye-lane)_1fr] lg:gap-y-incluye-fila lg:pt-16"
      >
        {INCLUYE_CRUCERO.map((item, i) => {
          const izquierda = i % 2 === 0
          return (
            <div
              key={item.id}
              className={`incluye-item ${izquierda ? 'incluye-item--izquierda' : 'incluye-item--derecha'}`}
              style={{ '--col': izquierda ? 1 : 3, '--fila': i + 1 } as CSSProperties}
            >
              {/* Numeral fantasma (v3-F19.3): grande y translúcido, sin el
                  slash que Samuel rechazó; el título se le monta encima
                  (.incluye-item-titulo, margen negativo). aria-hidden: para el
                  lector de pantalla el orden ya lo da el DOM — el numeral es
                  decoración tipográfica. */}
              <p className="incluye-numero" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="incluye-item-titulo font-display text-incluye-item-titulo-movil font-semibold text-white lg:text-incluye-item-titulo">
                {item.titulo}
              </p>
              <p className="incluye-item-texto mt-3 text-incluye-item-texto-movil text-white/75 lg:text-incluye-item-texto">
                {item.texto}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
