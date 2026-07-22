import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Alinea las cards del equipo al hacer scroll (pedido de Samuel, 2026-07-22):
// arrancan "en escalones" — cada una a un nivel distinto, como en la
// referencia que pasó — y a medida que se scrollea la sección todas SUBEN
// hasta quedar alineadas horizontalmente. Más vivo que una grilla estática
// de golpe. Enganchado al scroll (scrub, NO sticky) — mismo mecanismo que
// use-why-direct-scroll.ts (`.fromTo()`, ease:'none', el scroll ES la curva).
//
// El estado FINAL (alineadas, y:0) es el NATURAL del CSS; GSAP solo pinta el
// inicial (escalonado) con `.fromTo()`. Con reduced-motion o
// ?dev-equipo=estatico no se engancha nada — se ven directamente alineadas
// (el frame que viaja a Figma).
//
// Patrón "arco" de 3 NIVELES (2ª vuelta, 2026-07-22 — Samuel: "agrega 5
// personas, para que haya 3 niveles de altura"): el centro arranca el MÁS
// ALTO, las 2 de en medio un poco más abajo, y las 2 de los extremos las MÁS
// BAJAS — no una alternancia par/impar plana.
//
// El nivel se CALCULA por distancia al centro en vez de leerse de una lista
// fija (5ª vuelta, mismo día): la sección se reutiliza en /nosotros con 3
// cards en vez de 5 (allí se filtran los 2 placeholder — ver equipo-teaser.tsx)
// y una lista escrita a mano para 5 le daba [3,2,1]: una rampa descendente, no
// un arco. La fórmula da [3,2,1,2,3] con 5 y [2,1,2] con 3 — el mismo arco
// centrado sea cual sea el número de cards.
//
// TODOS LOS VALORES SON POSITIVOS = todas las cards arrancan POR DEBAJO de su
// sitio final y SUBEN (3ª vuelta, mismo día — Samuel: "el que está más alto
// en vez de subir también a acomodarse, ese baja; todos deberían estar más
// bajos para que todos suban a acomodarse al tope"). El patrón anterior
// ([1, 0.5, -1, 0.5, 1]) mezclaba signos: la del centro arrancaba ARRIBA de
// su fila y por tanto BAJABA mientras las otras subían — dos direcciones a la
// vez, que es justo lo que se veía mal. Ahora el arco se dibuja con la
// DISTANCIA que recorre cada una, no con el signo: el centro arranca solo 1
// nivel abajo (queda el más alto de los cinco) y los extremos 3 niveles (los
// más bajos), pero las cinco viajan en la misma dirección hasta y:0.
/** Niveles POR DEBAJO del sitio final: 1 en el centro, +1 por cada paso hacia los extremos. */
function nivelDeArco(i: number, total: number) {
  const centro = (total - 1) / 2
  return 1 + Math.round(Math.abs(i - centro))
}

export function useEquipoScroll(sectionRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const nivel = tokenAPx(cs, '--equipo-scroll-nivel', rootPx, 40)
    const scrub = parseFloat(cs.getPropertyValue('--equipo-scroll-scrub')) || 0.4

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll<HTMLElement>('.equipo-card')
      cards.forEach((card, i) => {
        const mult = nivelDeArco(i, cards.length)
        gsap.fromTo(
          card,
          { y: nivel * mult },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              // Cuanto MENOR es el %, más TARDE arranca: la sección ya está
              // más arriba en pantalla (o sea, más visible) cuando empieza a
              // moverse. 75% → 55% (2ª vuelta) → 10% (3ª vuelta, Samuel: "que
              // el efecto pase un poco después para que se vea más en pantalla
              // que están desfasadas y que con el scroll se alinea").
              //
              // El 10% NO es a ojo, sale de la geometría medida en el
              // navegador: entre el top de la sección y el top de las cards
              // hay ~332px (etiqueta + título + párrafo) y la card mide
              // ~333px. Para que la card MÁS BAJA (3 escalones = 120px) se
              // vea ENTERA en el instante en que arranca el efecto hace falta
              // 332 + 120 + 333 ≤ alto de viewport, o sea el top de la
              // sección por encima de ~13% de la pantalla. Con el 30% que
              // tenía la primera versión de esta vuelta las cards quedaban
              // asomando por el borde de abajo justo cuando había que
              // mirarlas — que es lo contrario de lo que pidió Samuel.
              trigger: section,
              start: 'top 10%',
              // -10% = por ENCIMA del borde superior del viewport. Con -30%
              // (primer intento de esta vuelta) la fila terminaba de alinearse
              // con la sección ya 270px fuera por arriba, o sea las cards a
              // 62px del borde: el remate ocurría pegado al techo de la
              // pantalla (Samuel: "está terminando muy arriba en pantalla").
              // Con -10% aterrizan hacia el centro del viewport (332-90 = 242
              // arriba, 575 abajo de 900), que es donde se mira.
              //
              // ⚠️ start y end se miden contra la MISMA referencia (el top de
              // la sección), así que el recorrido es literalmente su resta:
              // acercar el final acorta el viaje (40% → 20% de pantalla, de
              // ~360 a ~180px de scroll). Es el intercambio que hay: para
              // rematar más abajo Y con recorrido largo habría que arrancar
              // antes, y el arranque ya está donde Samuel lo quiere.
              end: 'top -10%',
              scrub,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }, section)

    // ⚠️ POR QUÉ ESTE ResizeObserver: ScrollTrigger traduce `start`/`end` a
    // posiciones ABSOLUTAS en píxeles una sola vez, al crearse, y solo las
    // recalcula en `load` y en `resize`. Pero la home va llena de imágenes
    // `loading="lazy"` que entran DESPUÉS de `load`, según se scrollea: cada
    // una que aparece por encima de esta sección la empuja hacia abajo, y las
    // posiciones cacheadas se quedan viejas — el efecto termina disparando
    // ANTES de lo configurado, cuando la sección todavía está baja en
    // pantalla. Medido con Playwright: con `top 30%` puesto, arrancaba de
    // hecho cerca de `top 55%`.
    //
    // Esa deriva es la causa REAL de que el efecto «pasara desapercibido»
    // (2 vueltas de Samuel seguidas). Subir el % solo compensaba el síntoma,
    // y de forma frágil: el desfase depende de cuántas imágenes hayan cargado
    // y cambia entre visitas.
    //
    // ScrollTrigger.refresh() es GLOBAL: recalcula todos los triggers de la
    // página, así que esto además endereza de paso los otros bloques
    // enganchados al scroll (why-direct, experiencia…), que sufren lo mismo.
    // Si algún día hay más de un sitio pidiendo refresco, esto debería subir
    // a un único observador de app en vez de vivir en este hook.
    let pendiente = 0
    const observador = new ResizeObserver(() => {
      window.clearTimeout(pendiente)
      // Debounce: al cargar varias imágenes de golpe llegan ráfagas de
      // cambios de altura, y refrescar en cada una es trabajo tirado.
      pendiente = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    observador.observe(document.documentElement)

    return () => {
      window.clearTimeout(pendiente)
      observador.disconnect()
      ctx.revert()
    }
  }, [sectionRef, activo])
}
