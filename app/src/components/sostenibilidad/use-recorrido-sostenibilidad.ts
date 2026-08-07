import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

// MotionPathPlugin era plugin de club (de pago) hasta GSAP 3.13; desde
// entonces viene en el paquete público y ya está en node_modules (gsap ^3.15)
// — cero dependencias nuevas, cero licencia que gestionar.
// (DrawSVGPlugin se usaba para dibujar la estela de progreso; se retiró en la
// 3ª vuelta, cuando la ruta pasó a ser gris fija y el progreso lo tomaron las
// fotos. Ya no se importa: era peso muerto en el bundle.)
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

type Punto = { x: number; y: number }

// Catmull-Rom → cúbicas de Bézier. Se necesita porque los puntos del recorrido
// se MIDEN (no se dibujan a mano): hay que unirlos con una curva suave que
// pase EXACTAMENTE por cada uno, y eso es justo lo que da Catmull-Rom
// (interpola los puntos; una Bézier normal solo los aproxima).
//
// ⚠️ Los brazos de control se escalan por la LONGITUD de cada tramo
// (`k = d2/(d1+d2)/3`) en vez de usar el 1/6 uniforme de la fórmula de
// manual. Con tramos de largo muy distinto —que es justo el caso aquí: los
// 64px de la entrada contra los ~480px que hay entre pilar y pilar— el 1/6
// uniforme le da al tramo corto un brazo de control más largo que el propio
// tramo, y la curva se pasa de largo y vuelve: sale un RIZO visible sobre el
// primer pilar (se vio en la primera captura). Escalado por longitud, cada
// brazo es proporcional a su tramo y el sobrepaso desaparece. En puntos
// equiespaciados k vale exactamente 1/6, o sea que no cambia el resto.
function trazado(pts: Punto[]): string {
  const primero = pts[0]
  if (!primero || pts.length < 2) return ''
  const dist = (a: Punto, b: Punto) => Math.hypot(b.x - a.x, b.y - a.y) || 1e-6
  const n = (v: number) => Math.round(v * 10) / 10

  let d = `M ${n(primero.x)} ${n(primero.y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    // Los extremos duplican su vecino: el trazo entra y sale recto en vez de
    // hacer un latigazo contra un punto que no existe.
    const p0 = pts[i - 1] ?? p1
    const p3 = pts[i + 2] ?? p2
    const k1 = dist(p1, p2) / (dist(p0, p1) + dist(p1, p2)) / 3
    const k2 = dist(p1, p2) / (dist(p1, p2) + dist(p2, p3)) / 3
    d += ` C ${n(p1.x + (p2.x - p0.x) * k1)} ${n(p1.y + (p2.y - p0.y) * k1)}`
    d += ` ${n(p2.x - (p3.x - p1.x) * k2)} ${n(p2.y - (p3.y - p1.y) * k2)}`
    d += ` ${n(p2.x)} ${n(p2.y)}`
  }
  return d
}

// EL RECORRIDO de los 3 pilares (2026-07-22, pedido de Samuel: "los 3 pasos,
// la idea es que lo transformemos como en recorrido con su progress bar que va
// avanzando, pero no lineal, sino curvo... y en vez de la flechita verde que
// sea el barquito que usamos de hover en el botón del hero del home").
//
// Reescrito en la 3ª vuelta (2026-07-22, Samuel: "que la línea siempre esté
// dotted gris, que lo que haga es cuando el progreso por cada una va
// apareciendo una imagen... y cuando pasa a la siguiente se quita la imagen
// pasada, así aseguramos que la línea no estorba al texto"). Dos piezas
// enganchadas al MISMO scrub, así que nunca se desincronizan:
//   · el BARCO recorre la ruta — MotionPath
//   · la FOTO del paso activo entra, y la anterior sale — solo una a la vez
// La ruta es gris punteada y QUIETA: ya no hay estela de progreso (antes se
// dibujaba con DrawSVG). Cruzando por encima del texto, una línea sólida de
// color competía con la lectura justo donde el ojo está leyendo; el progreso
// lo cuenta ahora la foto, que además aporta en vez de restar.
//
// ⚠️ El trazado NO son coordenadas escritas a mano en un viewBox fijo, que es
// lo obvio y lo frágil: los 3 pilares tienen textos de largo distinto, así que
// sus alturas cambian con el ancho de ventana, con la carga de la tipografía y
// con cualquier retoque de copy — una curva cableada se despegaría de las
// tarjetas en cuanto Samuel edite un párrafo. Aquí se MIDE la posición real de
// cada `[data-recorrido-punto]` y se une con Catmull-Rom, y se vuelve a medir
// en cada refresh de ScrollTrigger. El viewBox se sincroniza 1:1 con el
// contenedor en px, de modo que las coordenadas del SVG y las del DOM son la
// misma cosa.
//
// SOLO DESKTOP (lg+): en una columna estrecha no hay hueco lateral por donde
// serpentee la curva — en móvil los pilares se quedan en lista apilada y el
// trazo y el barco ni se pintan (`hidden lg:block`), así que tampoco se
// descarga ni se mide nada. El reparto por breakpoint y por reduced-motion lo
// hace `gsap.matchMedia()`, que revierte solo al cambiar de rango.
export function useRecorridoSostenibilidad(
  rootRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const svg = root.querySelector<SVGSVGElement>('.recorrido-trazo')
    const ruta = root.querySelector<SVGPathElement>('.recorrido-ruta')
    const barco = root.querySelector<HTMLElement>('.recorrido-barco')
    const fotos = gsap.utils.toArray<HTMLElement>('.recorrido-imagen', root)
    if (!svg || !ruta || !barco || fotos.length === 0) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const margen = tokenAPx(cs, '--spacing-recorrido-margen', rootPx, 64)
    const scrub = tokenNum(cs, '--recorrido-scrub', 0.6)
    const entrada = cs.getPropertyValue('--recorrido-entrada').trim() || 'top 72%'
    const salida = cs.getPropertyValue('--recorrido-salida').trim() || 'bottom 85%'
    const fotoDur = parseFloat(cs.getPropertyValue('--recorrido-imagen-duracion')) || 0.45
    const fotoY = tokenAPx(cs, '--recorrido-imagen-y', rootPx, 20)

    // EL RELEVO DE FOTOS. Manda el paso en el que va el recorrido: entra su
    // foto y sale la que estuviera. Se gobierna con UN solo progreso y no con
    // un ScrollTrigger por tarjeta (que sería lo obvio) por una razón
    // concreta: con un trigger por tarjeta, los rangos de dos pasos
    // consecutivos se solapan a poco que las tarjetas queden cerca, y acabas
    // con dos fotos a la vez — justo lo que Samuel pidió evitar ("cuando pasa
    // a la siguiente se quita la imagen pasada"). Con un progreso único, que
    // haya exactamente una activa es una garantía aritmética, no algo que
    // dependa del layout.
    //
    // `limites` son las fronteras entre pasos, y las calcula medir() a partir
    // de DÓNDE CAE CADA PILAR sobre la ruta (no en fracciones iguales): la
    // primera versión partía el progreso en tercios, que solo acierta si los
    // 3 pilares están repartidos a tercios exactos del scroll — deja de ser
    // cierto en cuanto un texto cambia de largo o se toca el rango del
    // trigger. Anclado al trazado, el relevo ocurre siempre en el punto medio
    // entre pilar y pilar, que es justo cuando el barco "deja atrás" uno.
    let limites: number[] = []
    // `activa` recuerda cuál está puesta para no relanzar el mismo tween en
    // cada frame del scrub (onUpdate dispara ~60 veces por segundo).
    let activa = -1
    const pasoDe = (progreso: number) => {
      for (let i = 0; i < limites.length; i++) if (progreso < limites[i]!) return i
      return limites.length - 1
    }

    // LAS FRONTERAS SE MIDEN EN EL ESPACIO DEL SCROLL, NO EN EL DEL TRAZADO
    // (2026-08-07). Antes salían de la LONGITUD DE PATH: se muestreaba la curva
    // buscando en qué fracción caía cada pilar y la frontera era el punto medio
    // entre dos. Y se comparaban contra `self.progress`, que es una fracción de
    // SCROLL — dos magnitudes distintas. Coinciden solo si la curva avanza en
    // vertical a ritmo constante, y no lo hace: el zigzag cruza el contenedor
    // de lado a lado, así que cada tramo gasta mucha más longitud de path que
    // de página. El resultado era que el relevo se adelantaba.
    //
    // Estaba latente desde el principio y saltó al entrar el copy aprobado del
    // cliente (2026-08-07): el pilar 1 pasó de ~500px a ~740px de alto y, a un
    // cuarto de su tarjeta, ya se veía la foto del pilar 2 — leías un texto
    // sobre áreas protegidas con la foto del siguiente punto al lado.
    //
    // Aquí se le pregunta al propio ScrollTrigger: `st.start`/`st.end` son las
    // posiciones de scroll absolutas del rango, así que convertir «la marca del
    // pilar cruza el centro de la ventana» a progreso es una regla de tres, sin
    // suponer nada sobre la forma de la curva. La frontera sigue siendo el punto
    // medio entre pilar y pilar, que es lo que se pidió («cuando pasa a la
    // siguiente se quita la imagen pasada»), pero medido donde se mira.
    const calcularLimites = (st: ScrollTrigger) => {
      const marcas = gsap.utils.toArray<HTMLElement>('[data-recorrido-punto]', root)
      const span = st.end - st.start
      if (marcas.length < 2 || span <= 0) return
      const progresoDe = (el: HTMLElement) => {
        const yDoc = el.getBoundingClientRect().top + window.scrollY
        return gsap.utils.clamp(0, 1, (yDoc - window.innerHeight / 2 - st.start) / span)
      }
      const puntos = marcas.map(progresoDe)
      limites = puntos.map((p, i) => (i === puntos.length - 1 ? 1 : (p + puntos[i + 1]!) / 2))
    }
    const mostrar = (i: number) => {
      if (i === activa) return
      activa = i
      fotos.forEach((foto, n) => {
        // overwrite: true — al scrollear rápido, el fundido de salida de una
        // foto puede pillar al de entrada a medias; sin esto se encolan y
        // quedan fotos a medio camino.
        gsap.to(foto, {
          autoAlpha: n === i ? 1 : 0,
          y: n === i ? 0 : fotoY,
          duration: fotoDur,
          ease: 'power2.out',
          overwrite: true,
        })
      })
    }

    // Mide los puntos y reescribe el `d` de la ruta.
    const medir = () => {
      const marcas = gsap.utils.toArray<HTMLElement>('[data-recorrido-punto]', root)
      if (marcas.length < 2) return
      const caja = root.getBoundingClientRect()
      if (!caja.width || !caja.height) return

      // getBoundingClientRect y no offsetTop: es más directo, PERO cuenta los
      // transforms de los ancestros. Por eso las tarjetas del recorrido NO
      // llevan `.sost-reveal` (el batch de use-sostenibilidad-reveal.ts las
      // desplazaría 24px en Y y el trazo se mediría contra una posición que
      // aún se está animando). Si algún día se les vuelve a poner un reveal,
      // hay que pasar a medir por offsetLeft/offsetTop, que son posiciones de
      // LAYOUT e ignoran los transforms.
      const pts: Punto[] = marcas.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2 - caja.left, y: r.top + r.height / 2 - caja.top }
      })

      // Proa y popa: el trazo asoma --spacing-recorrido-margen por encima del
      // primer punto y por debajo del último, así el barco ENTRA y SALE de
      // cuadro navegando en vez de aparecer clavado sobre el primer numeral.
      const primero = pts[0]!
      const ultimo = pts[pts.length - 1]!
      pts.unshift({ x: primero.x, y: primero.y - margen })
      pts.push({ x: ultimo.x, y: ultimo.y + margen })

      const d = trazado(pts)
      svg.setAttribute('viewBox', `0 0 ${caja.width} ${caja.height}`)
      ruta.setAttribute('d', d)
      // Aquí se muestreaba la curva (240 puntos) para saber en qué fracción de
      // PATH caía cada pilar y sacar de ahí las fronteras del relevo de fotos.
      // Se retira: esas fracciones se comparaban contra un progreso de SCROLL
      // y no son la misma magnitud — ver `calcularLimites`, que lo mide donde
      // toca y de paso ahorra el muestreo.
    }

    // Coloca el barco sobre el trazado. `align` al propio path + alignOrigin
    // centrado = el centro del barco cae sobre el punto. SIN autoRotate a
    // propósito: la flecha de la referencia gira para seguir la tangente, pero
    // un barco no — en los tramos verticales acabaría con el mástil apuntando
    // de lado, tumbado. Navega siempre adrizado y el gesto lo pone el cabeceo
    // en CSS (.recorrido-barco img).
    const enTrazo = (donde: number) => ({
      motionPath: {
        path: ruta,
        align: ruta,
        alignOrigin: [0.5, 0.5] as [number, number],
        start: donde,
        end: donde,
      },
    })

    // Frame ASENTADO — el que viaja a Figma (?dev-sost=estatico) y el que ve
    // quien pide prefers-reduced-motion: el barco atracado en el último pilar
    // y la foto de ESE paso puesta (la del último, no las 3: el frame tiene
    // que enseñar el estado real del componente, y el real es "una a la vez").
    // Nada enganchado al scroll.
    const asentar = () => {
      medir()
      gsap.set(barco, enTrazo(1))
      fotos.forEach((foto, n) => gsap.set(foto, { autoAlpha: n === fotos.length - 1 ? 1 : 0, y: 0 }))
      activa = fotos.length - 1
    }

    const navegar = () => {
      medir()

      // Estado inicial SÍNCRONO, antes del primer paint (el hook corre en
      // useLayoutEffect): sin esto se ve un fogonazo del barco en la esquina
      // 0,0 y de las 3 fotos a la vez antes de que ScrollTrigger imponga su
      // progreso en el siguiente frame. Es exactamente el fallo que documenta
      // use-sostenibilidad-reveal.ts. Las fotos parten OCULTAS porque su
      // estado natural en el CSS es visible (para que móvil y "sin JS" las
      // muestren en el flujo).
      gsap.set(barco, enTrazo(0))
      gsap.set(fotos, { autoAlpha: 0, y: fotoY })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: entrada,
            end: salida,
            scrub,
            // El trazado se remide en 'refreshInit' (más abajo), así que al
            // refrescar hay que reconstruir el tween contra el `d` NUEVO:
            // MotionPath cachea el path parseado al inicializarse.
            // invalidateOnRefresh lo obliga a releerlo.
            invalidateOnRefresh: true,
            // Las fronteras del relevo se recalculan en CADA refresh y no una
            // sola vez al montar: dependen de `st.start`/`st.end`, que es justo
            // lo que cambia al redimensionar, al asentar la tipografía o al
            // editar el copy (el ResizeObserver de más abajo dispara refresh).
            onRefresh: calcularLimites,
            // El relevo de fotos se engancha AQUÍ y no como un tween más de la
            // timeline: no es una interpolación (no hay nada que "ir
            // recorriendo"), es un cambio de estado discreto disparado por el
            // tramo en el que va el recorrido.
            // El guard de `limites` evita el único caso en que esto se pintaría
            // mal: un update antes del primer refresh dejaría `pasoDe` en -1 y
            // se apagarían LAS TRES fotos.
            onUpdate: (self) => {
              if (limites.length) mostrar(pasoDe(self.progress))
            },
          },
        })
        // ease 'none': la curva la pone el scroll, no el easing.
        .to(barco, { motionPath: { path: ruta, align: ruta, alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0)
    }

    // gsap.matchMedia revierte solo lo que creó al salir del rango, así que
    // cruzar el breakpoint (o cambiar la preferencia de movimiento del SO) no
    // deja tweens huérfanos sobre un SVG que ya no se pinta.
    const mm = gsap.matchMedia()
    if (activo) {
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: reduce)', asentar)
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', navegar)
    } else {
      // [dev-mode] ?dev-sost=estatico — asentado sea cual sea la preferencia.
      mm.add('(min-width: 1024px)', asentar)
    }

    // 'refreshInit' se dispara ANTES de que ScrollTrigger tome medidas y antes
    // del invalidate de los tweens — el orden correcto para reescribir el `d`.
    ScrollTrigger.addEventListener('refreshInit', medir)

    // ScrollTrigger ya refresca solo al redimensionar la ventana, pero el alto
    // del recorrido también cambia SIN que la ventana se mueva: al asentar la
    // tipografía, al reflowear un párrafo largo o si Samuel edita el copy en
    // caliente. El guard de tamaño evita el bucle (refresh → layout → el
    // observer vuelve a disparar).
    let ancho = 0
    let alto = 0
    const ro = new ResizeObserver(() => {
      const caja = root.getBoundingClientRect()
      if (Math.abs(caja.width - ancho) < 1 && Math.abs(caja.height - alto) < 1) return
      ancho = caja.width
      alto = caja.height
      ScrollTrigger.refresh()
    })
    ro.observe(root)

    return () => {
      ro.disconnect()
      ScrollTrigger.removeEventListener('refreshInit', medir)
      mm.revert()
    }
  }, [rootRef, activo])
}
