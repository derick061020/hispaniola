import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// El RECORRIDO del video de Experiencia (correcciones v1 del cliente,
// ref. six2eight.com: «agregar efecto de video como este»). Lo que pidió el
// cliente no es el marco (eso se resolvió en la 1ª vuelta, y se deshace en
// componentes.css) sino el GESTO: el video CRECE con el scroll hasta ocupar
// buena parte de la pantalla, se queda FIJO ahí un tramo, y luego ENCOGE y se
// desplaza a su posición final — la misma columna izquierda de siempre.
//
// 3 TRAMOS sobre el mismo scrub — CRECE → SE MANTIENE → ENCOGE:
//   1. CRECE: de "inicio" (asomándose por abajo, centrado en horizontal y un
//      poco más grande que su tamaño natural) a "grande".
//   2. SE MANTIENE: grande y quieto, CENTRADO DE VERDAD en la ventana.
//   3. ENCOGE: de "grande" a su sitio natural — transform 0/0/1, identidad —
//      mientras el texto de la derecha se revela con una ola de palabras.
//
// DÓNDE PINEA = DÓNDE TERMINA, y de ahí sale todo lo demás. El pin congela
// `.exp-etapa` con su techo a `origenY + --exp-etapa-dock-margen` (o sea,
// justo debajo del nav flotante más un respiro de lectura) y NO lo mueve en
// todo el recorrido — es lo que lo mantiene fijo en pantalla. Así que ESE es
// también el sitio donde la fila se queda al final: el tramo ENCOGE lleva el
// video a transform IDENTIDAD y ahí acaba, en su columna, alineado con el
// texto. Que el reposo final no lleve transform no es un detalle: cualquier
// desplazamiento permanente (la vuelta anterior dejaba la fila corrida ~600px
// hacia arriba) descuadra la posición VISUAL respecto de la posición de
// LAYOUT, y eso se ve como aire fantasma antes y después de la sección.
//
// EL "PEEK" (que el video se asome antes de centrarse) es entonces un
// desplazamiento del ARRANQUE, no del final: en progreso 0 el video se manda
// hacia abajo (--exp-etapa-inicio-top-vh sitúa su borde superior a esa
// fracción del alto de ventana) y CRECE lo trae al centro. Ese transform
// inicial se aplica TAMBIÉN antes de que el pin enganche —`medir()` llama a
// `aplicar()` desde el montaje— así que el video ya viene asomándose y
// centrado en horizontal mientras la sección entra con scroll normal, y al
// enganchar el pin el progreso sigue en 0: mismo transform, cero salto.
// Samuel: «ya se está asomando el video, ya por ahí debe empezar su animación
// de empezar a centrarse en pantalla» — no es un mask que se abre.
//
// SOLO DESKTOP (lg+, como --incluye-*): en móvil no hay aire para un
// recorrido a pantalla completa — ahí el video hace el reveal simple
// (--exp-video-movil-escala) y el TEXTO lo anima use-experiencia-scroll.ts
// (encendido palabra a palabra, correcciones v1 slide 5). En desktop ese hook
// se aparta y el texto entra aquí, con la ola de abajo.
//
// LA OLA DEL TEXTO (pedido de Samuel): cuando el video encoge a su columna,
// el párrafo de la derecha no aparece de golpe — cada palabra sube a su sitio
// desde un poco más abajo y desenfocada, escalonadas, «creando un efecto tipo
// ola» que se va "desblureando". Se monta como un timeline PAUSADO y se
// scrubea con `.progress()` desde el tramo ENCOGE, en vez de darle su propio
// ScrollTrigger: así la ola está atada al recorrido (empieza exactamente
// cuando el video arranca de vuelta a su columna) y no a una posición de
// scroll aparte que habría que mantener sincronizada a mano. Las palabras
// necesitan `display: inline-block` para poder trasladarse (los inline puros
// ignoran `transform`) — de eso se encarga componentes.css.
//
// POR QUÉ TRANSFORM Y NO position:fixed — el video se queda SIEMPRE dentro
// del grid: `transform` no afecta el layout, así que puede "salirse"
// visualmente de su columna y de la sección sin que nadie tenga que
// recalcular nada más alrededor. Lo único que sale del flujo normal es el
// CONTENEDOR del grid entero (`.exp-etapa`), que GSAP fija con `pin`
// mientras dura el recorrido — el resto de la página no se entera hasta que
// el pin termina (GSAP inserta su propio spacer, como siempre).
//
// LA MEDICIÓN: el tamaño/posición NATURAL del video (su sitio de siempre en
// el grid) se mide restando el rect de `.exp-etapa` al del video — ese
// offset NO depende de dónde esté scrolleada la página en el momento de medir
// (es la misma resta esté la sección arriba o abajo del viewport). Sumado a
// `pinTopY` (donde queda el techo pineado), predice exactamente dónde cae el
// video, en píxeles de ventana, en cuanto el pin esté activo. Los estados
// GRANDE e INICIO se calculan aparte, contra el viewport real (innerWidth/
// innerHeight): no son posiciones del grid, son "centrado en pantalla".
//
// ⚠️ Las fracciones/proporciones salen de TOKENS (tokens.css, bloque «VIDEO
// de Experiencia»), no van "a ojo" en el JS — mismo trato que --incluye-*
// (playbook animaciones-a-figma). A Figma NO viaja animado: el frame que
// viaja es el estado natural (?dev-exp=estatico / prefers-reduced-motion),
// donde el video ya está en su sitio final, sin transform, y el texto entero
// visible y enfocado.
export function useExperienciaVideoEtapa(
  sectionRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const etapa = section.querySelector<HTMLElement>('.exp-etapa')
    const video = section.querySelector<HTMLElement>('.exp-video')
    const texto = section.querySelector<HTMLElement>('.exp-texto')
    if (!etapa || !video) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

    // Borde inferior del nav flotante sitewide — el origen del reposo final
    // (y por tanto del `start` del pin). Se MIDE en vez de restar un pixel a
    // ojo porque su alto/posición ya cambian solos entre el estado "hero" y
    // "fijo". 0 de fallback si la página no lo monta (no debería pasar en
    // home, pero mejor que un `!` que reviente).
    function medirOrigenY(): number {
      const nav = document.querySelector<HTMLElement>('.nav-flotante-envoltorio')
      return nav ? nav.getBoundingClientRect().bottom : 0
    }

    const ctx = gsap.context(() => {
      const esEscritorio = window.matchMedia('(min-width: 1024px)').matches

      // MÓVIL/TABLET: sin recorrido — el reveal simple de siempre (arranca
      // más grande y se asienta), enganchado al scroll normal de la sección.
      // No hay sitio para pinear un video a pantalla completa en una columna
      // angosta, y el texto lo sigue animando use-experiencia-scroll.ts.
      if (!esEscritorio) {
        const escala = tokenNum(cs, '--exp-video-movil-escala', 1.14)
        gsap.from(video, {
          autoAlpha: 0,
          scale: escala,
          clearProps: 'scale',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'top 32%',
            scrub: tokenNum(cs, '--exp-reveal-scrub', 0.6),
          },
        })
        return
      }

      // DESKTOP: el recorrido completo, pineado.
      const recorridoVh = tokenNum(cs, '--exp-etapa-recorrido-vh', 2.6)
      const dockMargen = tokenAPx(cs, '--exp-etapa-dock-margen', rootPx, 128)
      const inicioTopVh = tokenNum(cs, '--exp-etapa-inicio-top-vh', 0.48)
      const inicioEscala = tokenNum(cs, '--exp-etapa-inicio-escala', 1.18)
      const crecerFraccion = tokenNum(cs, '--exp-etapa-crecer', 0.34)
      const mantenerFraccion = tokenNum(cs, '--exp-etapa-mantener', 0.26)
      const grandeVw = tokenNum(cs, '--exp-etapa-grande-vw', 0.76)
      const grandeMax = tokenAPx(cs, '--exp-etapa-grande-max', rootPx, 992)
      const grandeVh = tokenNum(cs, '--exp-etapa-grande-vh', 0.72)
      const scrub = tokenNum(cs, '--exp-etapa-scrub', 0.5)

      const crecerFin = crecerFraccion
      const mantenerFin = crecerFin + mantenerFraccion

      // LA OLA del texto — timeline pausado, scrubeado a mano desde el tramo
      // ENCOGE (ver `aplicar`). Al ser pausado, los segundos no son segundos:
      // solo importa la PROPORCIÓN entre duración y stagger, que es la que
      // define la forma de la ola (cuánto se solapan las palabras).
      // `.exp-palabra` son solo las palabras — los espacios van fuera del
      // span (ver experiencia.tsx), así que el stagger no gasta pasos en
      // huecos invisibles. `.exp-linea` (kicker + CTA) va detrás en el mismo
      // stagger: están después en el DOM, así que la ola sigue de largo.
      const olaY = tokenAPx(cs, '--exp-ola-y', rootPx, 20)
      const olaBlur = tokenAPx(cs, '--exp-ola-blur', rootPx, 8)
      const olaStagger = tokenNum(cs, '--exp-ola-stagger', 0.03)
      const olaDur = tokenNum(cs, '--exp-ola-dur', 0.55)
      const piezasTexto = gsap.utils.toArray<HTMLElement>('.exp-palabra, .exp-linea')
      const tlTexto = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      if (piezasTexto.length) {
        // `fromTo` y no `from`: el estado de reposo no tiene `filter`, y
        // GSAP interpolando hacia `none` no es fiable — el destino se declara
        // explícito como blur(0px). immediateRender (el de por sí en
        // fromTo/from) deja las palabras ocultas y desenfocadas desde el
        // montaje, antes del primer paint: nada de un frame de texto visible
        // que luego se esconde.
        tlTexto.fromTo(
          piezasTexto,
          { opacity: 0, y: olaY, filter: `blur(${olaBlur}px)` },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: olaDur, stagger: olaStagger },
        )
      }

      // MEDIR() solo se repite en resize (ScrollTrigger llama a onRefresh
      // también ahí); APLICAR() en cambio corre en cada frame de scroll y
      // solo LEE de `geo`, sin volver a tocar el DOM — el mismo reparto que
      // usa el dock del ticker (medir geometría aparte de aplicarla).
      let geo = { xInicio: 0, yInicio: 0, sInicio: 1, xGrande: 0, yGrande: 0, sGrande: 1 }

      function medir(self?: ScrollTrigger) {
        // Reset ANTES de medir: si no, el rect capturado incluiría el
        // transform del frame anterior y toda la geometría saldría mal (el
        // clásico error de medir un elemento que ya está animado).
        gsap.set(video, { x: 0, y: 0, scale: 1 })

        // clientWidth y no innerWidth: innerWidth INCLUYE la barra de scroll,
        // así que centrar contra su mitad deja el video corrido ~medio ancho
        // de barra hacia la derecha (se notaba: ~7px). El alto sí sale de
        // innerHeight, que es contra lo que mide ScrollTrigger el recorrido.
        const vw = document.documentElement.clientWidth
        const vh = window.innerHeight
        // pinTopY: dónde queda el techo de `.exp-etapa` mientras dura el pin
        // — MISMO valor que el `start` del ScrollTrigger de abajo — y por
        // tanto dónde se asienta la fila al final del recorrido.
        const pinTopY = medirOrigenY() + dockMargen
        const etapaRect = etapa!.getBoundingClientRect()
        const videoRect = video!.getBoundingClientRect()

        // Natural/REPOSO, en coordenadas de ventana YA PINEADA: sin scroll
        // horizontal `videoRect.left` ya vale tal cual; el `top` se resta
        // contra `.exp-etapa` (ese offset SÍ es estable con el scroll
        // vertical) y se suma a `pinTopY`.
        const naturalAncho = videoRect.width
        const naturalAlto = videoRect.height
        const naturalCentroX = videoRect.left + naturalAncho / 2
        const naturalCentroY = pinTopY + (videoRect.top - etapaRect.top) + naturalAlto / 2

        // GRANDE: centrado DE VERDAD en la ventana, en los dos ejes (pedido
        // de Samuel: antes se centraba solo en el área bajo el nav, así que
        // quedaba visiblemente bajo). 16:9, acotado por ancho Y por alto —
        // manda el que dé la caja más chica. El tope de alto (0.72) deja
        // ~14% de margen arriba y abajo, de sobra para no chocar con el nav.
        let grandeAncho = Math.min(vw * grandeVw, grandeMax)
        let grandeAlto = grandeAncho * (9 / 16)
        const grandeAltoTope = vh * grandeVh
        if (grandeAlto > grandeAltoTope) {
          grandeAlto = grandeAltoTope
          grandeAncho = grandeAlto * (16 / 9)
        }

        // INICIO: mismo centro horizontal que GRANDE (por eso crece desde el
        // centro y no en diagonal desde su columna), un poco más grande que
        // su tamaño natural, y con el borde de arriba abajo del todo — es lo
        // que lo deja "asomándose".
        const inicioAncho = Math.min(naturalAncho * inicioEscala, grandeAncho)
        const inicioAlto = inicioAncho * (9 / 16)

        geo = {
          xInicio: vw / 2 - naturalCentroX,
          yInicio: vh * inicioTopVh + inicioAlto / 2 - naturalCentroY,
          sInicio: inicioAncho / naturalAncho,
          xGrande: vw / 2 - naturalCentroX,
          yGrande: vh / 2 - naturalCentroY,
          sGrande: grandeAncho / naturalAncho,
        }

        aplicar(self ? self.progress : 0)
      }

      function aplicar(progreso: number) {
        let x: number
        let y: number
        let s: number
        let ola: number
        if (progreso <= crecerFin) {
          // Tramo 1 — CRECE: de inicio (asomándose, ya centrado en
          // horizontal) a grande. Como xInicio == xGrande, aquí el video no
          // se desplaza en horizontal: sube y crece desde el centro.
          const t = crecerFin > 0 ? progreso / crecerFin : 1
          x = gsap.utils.interpolate(geo.xInicio, geo.xGrande, t)
          y = gsap.utils.interpolate(geo.yInicio, geo.yGrande, t)
          s = gsap.utils.interpolate(geo.sInicio, geo.sGrande, t)
          ola = 0
        } else if (progreso <= mantenerFin) {
          // Tramo 2 — SE MANTIENE: grande y quieto, el texto sigue esperando.
          x = geo.xGrande
          y = geo.yGrande
          s = geo.sGrande
          ola = 0
        } else {
          // Tramo 3 — ENCOGE: de grande a su sitio natural (identidad) — y a
          // la par la ola del texto, que así entra justo cuando el video
          // libera la columna derecha.
          const t = mantenerFin < 1 ? (progreso - mantenerFin) / (1 - mantenerFin) : 1
          x = gsap.utils.interpolate(geo.xGrande, 0, t)
          y = gsap.utils.interpolate(geo.yGrande, 0, t)
          s = gsap.utils.interpolate(geo.sGrande, 1, t)
          ola = t
        }
        gsap.set(video, { x, y, scale: s })
        // Publica la escala aplicada para que los CONTROLES del vídeo puedan
        // deshacerla (.exp-video-controles en componentes.css). Viven dentro
        // del figure para seguirlo, pero un botón escalado ×2.6 en el tramo
        // grande sería enorme justo en el momento más lucido de la sección.
        video!.style.setProperty('--exp-video-escala', String(s))

        // EL TEXTO INVISIBLE SE COMÍA LOS CLICS (2026-07-22, Samuel: «no me
        // deja darle al botón de mute o pantalla completa, el texto invisible
        // es el que me intenta seleccionar»). Las palabras se apagan con
        // OPACITY, y opacity < 1 crea stacking context: el texto se sigue
        // pintando —y sobre todo se sigue pudiendo apuntar— por encima del
        // vídeo, porque va DESPUÉS en el orden del documento. Invisible no es
        // lo mismo que ausente: seguía capturando el puntero y poniendo el
        // cursor en modo selección sobre palabras que no se ven.
        //
        // Mientras el vídeo está agrandado tapa esa columna, así que ahí el
        // texto no debe recibir nada. En reposo (escala 1) se devuelve, que es
        // cuando el CTA de esa columna tiene que volver a ser clicable.
        if (texto) texto.style.pointerEvents = s > 1.001 ? 'none' : ''
        tlTexto.progress(ola)
      }

      const st = ScrollTrigger.create({
        trigger: etapa,
        start: () => `top ${medirOrigenY() + dockMargen}px`,
        end: () => `+=${window.innerHeight * recorridoVh}`,
        pin: true,
        scrub,
        invalidateOnRefresh: true,
        onRefresh: (self) => medir(self),
        onUpdate: (self) => aplicar(self.progress),
      })
      medir(st)
    }, section)

    return () => {
      // ctx.revert() solo deshace lo que puso GSAP; estas dos las escribe el
      // hook a mano, así que hay que retirarlas o el texto podría quedarse sin
      // poder recibir clics tras un desmontaje a mitad de recorrido.
      if (texto) texto.style.pointerEvents = ''
      video.style.removeProperty('--exp-video-escala')
      ctx.revert()
    }
  }, [sectionRef, activo])
}
