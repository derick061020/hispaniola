import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Tour } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag' // [dev-mode]

// Nav de anclas de la ficha (wireframe A2). La ficha es larga y el visitante
// no llega con la misma pregunta: unos quieren la hora de recogida, otros el
// menú. Esto es el índice.
//
// Sticky al TOPE del viewport (top-0). Antes se pegaba a --spacing-header-alto
// asumiendo un header sólido persistente encima — pero desde que el header se
// mudó DENTRO del hero (variante sobreVideo, PLAN-INTERNAS-V2 §C1) ese header
// se va con el scroll y no queda nada arriba: pegarse a header-alto dejaba una
// banda blanca vacía de ~77px sobre la barra (regresión que Samuel cazó
// 2026-07-17). El widget se pega más abajo, con --spacing-sticky-top, que ya
// se recalculó para NO contar el header (solo esta fila + 1rem de aire).
//
// ⚠️ 2026-07-22: la ficha ahora TAMBIÉN muestra la píldora del nav flotante
// (antes se excluía y esta página se quedaba sin menú de sitio), y aun así
// esta fila sigue en `top-0`. Es una decisión de Samuel, no un descuido:
// «aquí me importa mucho más el menú interno de las secciones y debe estar
// totalmente arriba». La píldora, en esta página, NO se queda fija — se va
// con el hero (ver nav-flotante.tsx), así que el tope del viewport vuelve a
// ser de esta barra sola y no hay nada que apilar ni ningún offset que
// derivar.
//
// El ancla «Menú» solo existe en 'completo' (charter cotiza su menú a medida,
// Saona no tiene paquetes): un índice que apunta a una sección inexistente es
// peor que no tener índice.
//
// Estado activo por scroll (2026-07-17, pedido de Samuel — antes era la
// decisión abierta §13.8): resalta la sección en la que está el visitante. La
// línea de disparo es EXACTAMENTE donde aterriza una sección al hacer clic en
// su ancla — su `scroll-margin-top` (scroll-mt-sticky-top, el mismo token para
// todas). Atarla ahí y no al borde de la barra evita el desfase de 1: si la
// línea quedara por encima del punto de aterrizaje, la sección recién clicada
// no contaría como «cruzada» y se activaría la de arriba. Se recorre de arriba
// a abajo y gana la última sección cuyo tope ya cruzó esa línea; al final de
// la página gana la última (si no, las secciones cortas del pie nunca se
// activan). rAF para no recalcular en cada píxel. nav+aria-current, no Tabs.
//
// Indicador deslizante (2026-07-17, pedido de Samuel): una sola barra
// `bg-aqua-dark` al ras del texto de la activa (no al pie del nav — el `py-3.5`
// del link dejaría la línea ~14px suelta debajo de la palabra y se ve
// "desfasada"). Mide el TEXTO con `getBoundingClientRect()` (no el `<a>` con
// `offsetLeft`/`offsetWidth` — eso medía la caja, que incluye el `px-3` de
// 12px, y la línea quedaba más ancha que la palabra). `getBoundingClientRect`
// es más fiable que `offsetLeft` para esto: no se lia con el `offsetParent`
// del flex item (sería la `relative` interna, pero la geometría del `gap-1` +
// padding del contenedor puede desfasar la lectura). `useLayoutEffect` +
// `ResizeObserver` (mismo idioma que use-ticker-dock.ts). No se renderiza hasta
// el primer measure: si apareciera en `left:0/width:0` y la transición se
// disparara hacia la primera activa, la barra saldría DEL borde superior
// izquierdo. `left` y `width` animan con transition; `top` se setea directo
// (la posición vertical del texto no cambia al alternar entre tabs del
// mismo `text-sm` single-line). `motion-safe:` apaga la transición con
// prefers-reduced-motion.
export function AnclasFicha({ tour }: { tour: Tour }) {
  // [v2 2026-07-27] «Menú» sube al primer puesto para seguir el orden nuevo de
  // la página (pages/tour.tsx: el menú se movió por encima del itinerario,
  // slide 11). Este array TIENE que ir en el mismo orden que las secciones o
  // el resaltado de la pestaña activa al hacer scroll se desincroniza.
  const anclas = [
    ...(tour.booking === 'completo' ? [{ id: 'ancla-menu', label: 'Menú' }] : []),
    { id: 'ancla-itinerario', label: 'Itinerario' },
    { id: 'ancla-incluye', label: 'Incluye' },
    { id: 'ancla-opiniones', label: 'Opiniones' },
    { id: 'ancla-faq', label: 'FAQ' },
  ]

  const [activa, setActiva] = useState(anclas[0]?.id)
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const idsKey = anclas.map((a) => a.id).join()

  // [dev-mode] ?dev-anclas=<id> fuerza la activa al id pasado (p. ej.
  // `ancla-faq` para capturar la pestaña FAQ como activa en Figma) — el
  // scroll real del visitante la sobreescribe en cuanto se mueva.
  useDevFlag('dev-anclas', (v) => setActiva(v))

  useEffect(() => {
    const secciones = anclas
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => el !== null)
    if (secciones.length === 0) return

    // Punto de aterrizaje de una sección al saltar a su ancla (su
    // scroll-margin-top, igual para todas) + 2px de holgura para el redondeo
    // sub-píxel. La sección recién clicada queda con su tope justo en esta
    // línea, así que cuenta como «cruzada» y se activa ella, no la anterior.
    const linea = parseFloat(getComputedStyle(secciones[0]).scrollMarginTop) + 2

    let raf = 0
    const recalcular = () => {
      raf = 0
      let actual = secciones[0].id
      for (const sec of secciones) {
        if (sec.getBoundingClientRect().top <= linea) actual = sec.id
      }
      // Al fondo de la página, la última sección gana aunque su tope no haya
      // cruzado la línea (secciones cortas del pie no se alcanzarían nunca).
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        actual = secciones[secciones.length - 1].id
      }
      setActiva(actual)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(recalcular)
    }

    recalcular()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    // idsKey cambia con el modo de booking (aparece/desaparece «Menú»).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  // Mide la posición del TEXTO de la activa y la guarda como estado del
  // indicador. useLayoutEffect: se ejecuta antes del paint → la primera vez
  // la barra ya aparece en su sitio (sin "viaje" desde 0,0). ResizeObserver
  // (no solo `resize` del viewport): cubre reflows por fuentes tardías, por
  // la aparición de «Menú» al cambiar de booking, etc.
  useLayoutEffect(() => {
    const cont = navRef.current
    if (!cont) return
    const medir = () => {
      const linkEl = cont.querySelector<HTMLElement>(`[data-ancla="${activa}"]`)
      if (!linkEl) return
      const textEl = linkEl.querySelector<HTMLElement>('[data-ancla-label]') ?? linkEl
      const contRect = cont.getBoundingClientRect()
      const textRect = textEl.getBoundingClientRect()
      setIndicator({
        left: textRect.left - contRect.left,
        // 2px de aire bajo el texto (medido incluyendo descendentes) — la
        // línea es `h-0.5` (2px), así que el bloque total línea+gap mide
        // 4px desde la base del texto. Lo suficiente para que no se lea
        // como "subrayado" tipográfico (que tocaría la baseline).
        top: textRect.bottom - contRect.top + 2,
        width: textRect.width,
      })
      setMounted(true)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(cont)
    return () => ro.disconnect()
  }, [activa, anclas.length])

  // El salto va suave, pero con `scrollIntoView` y NO con
  // `html { scroll-behavior: smooth }`: ese es global y cambiaría también los
  // anclas de la home (#tours del hero y del header), que esta fase no toca.
  // `scroll-margin-top` (scroll-mt-sticky-top en cada sección) lo respeta
  // igual, así que el título no queda debajo del chrome sticky.
  const irA = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const destino = document.getElementById(id)
    if (!destino) return
    e.preventDefault()
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <nav
      aria-label="Secciones de esta página"
      className="sticky top-0 z-30 hidden border-b border-linea bg-papel/90 backdrop-blur-sm md:block"
    >
      <div
        ref={navRef}
        className="relative mx-auto flex max-w-contenido gap-1 px-5 sm:px-10"
      >
        {anclas.map((a) => {
          const esActiva = a.id === activa
          return (
            <a
              key={a.id}
              data-ancla={a.id}
              href={`#${a.id}`}
              onClick={(e) => irA(e, a.id)}
              aria-current={esActiva ? 'true' : undefined}
              className={`rounded-lg px-3 py-3.5 text-sm font-medium transition-colors ${
                esActiva
                  ? 'text-aqua-dark'
                  : 'text-navy-sub hover:bg-papel-hueso hover:text-navy'
              }`}
            >
              <span data-ancla-label>{a.label}</span>
            </a>
          )
        })}
        {mounted && (
          <span
            aria-hidden
            className="pointer-events-none absolute h-0.5 bg-aqua-dark motion-safe:transition-[left,width] motion-safe:duration-300 motion-safe:ease-out"
            style={{
              left: indicator.left,
              top: indicator.top,
              width: indicator.width,
            }}
          />
        )}
      </div>
    </nav>
  )
}
