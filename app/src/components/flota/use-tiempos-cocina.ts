import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenNum } from '@/lib/lee-tokens'
import { refrescaScrollTriggerAlCrecer } from '@/lib/refresca-scrolltrigger'

gsap.registerPlugin(ScrollTrigger)

// EL MECANISMO DE LA COCINA FLOTANTE (/flota, 2026-08-07): el párrafo aprobado
// se ENCIENDE por tiempos mientras la sección cruza la pantalla, y la foto
// clavada al lado cambia con cada tiempo.
//
// POR QUÉ ESTE GESTO Y NO OTRO. El copy del cliente ya viene con una secuencia
// dentro —«The aroma comes first. Then the sound of the grill. Moments later,
// your meal is served»—: son tres momentos en orden, no tres frases sueltas.
// El mecanismo no le añade un gesto decorativo a un texto; hace visible una
// estructura que el texto ya tenía. Esa es la diferencia entre esto y las 5
// propuestas de color que se descartaron el mismo día.
//
// ⚠️ UN SOLO TRIGGER SOBRE LA SECCIÓN, NO UNO POR FRASE. La primera versión
// puso un ScrollTrigger en cada tiempo y NO FUNCIONABA — medido: saltaba del 1
// al 3 y el 2 no se encendía nunca. El motivo es que los tres tiempos son
// `<span>` INLINE dentro del mismo párrafo: sus cajas miden lo que ocupan sus
// líneas (el 2º, «Then the sound of the grill.», es media línea) y las tres se
// reparten ~250px de alto total. A cualquier umbral razonable los tres rangos
// entran casi a la vez y gana el último que dispara. Un texto corrido no puede
// dar tres estados de scroll: la distancia la tiene que poner la SECCIÓN.
//
// Así que el recorrido es el de la sección entera y se reparte en tres tramos
// iguales. Cada tiempo se lleva ~un tercio del viaje, que a 1440px son ~370px
// de scroll — suficiente para leer la frase antes de que cambie.
//
// ⚠️ NO PINEA. La home ya tiene un recorrido pineado a pantalla completa (el
// vídeo de Experiencia) y es su firma; repetir el pin aquí sería a la vez un
// calco y un peaje de scroll en una página que ya carga 6 vídeos. La foto se
// queda quieta con `position: sticky` —CSS puro, sin secuestrar el scroll— y lo
// único que hace GSAP es decir QUÉ tiempo está activo.
//
// ⚠️ SIN SCRUB, y con el índice filtrado. El scrub sirve cuando algo recorre un
// rango de forma continua (la barra de potencia, el trazado de la línea de
// tiempo); aquí el estado es DISCRETO —o estás en el aroma, o en la parrilla, o
// en el plato—, así que `onUpdate` calcula el tramo y solo avisa cuando CAMBIA.
// Sin ese filtro se llamaría a React en cada frame de scroll.
//
// EL ESTADO SE PUBLICA EN EL DOM, no en clases condicionales: el componente
// escribe `data-activo` y el CSS describe los dos extremos (componentes.css).
// Así el hook no conoce ni un color ni una duración — viven en tokens, que son
// la FUENTE del prototipo de Figma (playbook animaciones-a-figma).
export function useTiemposCocina(
  rootRef: RefObject<HTMLElement | null>,
  { activo, total, onActivo }: { activo: boolean; total: number; onActivo: (indice: number) => void },
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo || total < 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const cs = getComputedStyle(root)
      // Dónde ARRANCA el reparto: con la sección ya bien dentro de la pantalla,
      // no asomando por abajo.
      const entra = tokenNum(cs, '--cocina-tiempo-entrada', 0.72)
      // Y CUÁNTO DURA, en pantallas de scroll.
      //
      // ⚠️ EL RECORRIDO NO SE DEDUCE DEL ALTO DE LA SECCIÓN («bottom 45%»),
      // QUE FUE LA PRIMERA VERSIÓN Y NO FUNCIONABA. Medido con Playwright: los
      // tres tramos salían de ~640px en vez de los ~350 que predecía el alto
      // real (779px), o sea que ScrollTrigger estaba repartiendo contra una
      // sección de ~1.570px — y seguía haciéndolo DESPUÉS de un refresco
      // forzado, así que no era medir tarde. Un `end` que depende del alto de
      // un bloque que contiene una foto sticky es un número que no se puede
      // predecir ni sostener.
      //
      // Con `+=` el recorrido es EXACTAMENTE el que decide el token, cada
      // tiempo se lleva un tercio de él y el reparto no cambia porque el copy
      // crezca o la foto cambie de proporción. Es el mismo patrón que usa el
      // recorrido del vídeo de Experiencia en la home.
      //
      // 1.05 pantallas está calibrado para que los tres tiempos ocurran
      // MIENTRAS la sección se ve: al terminar, su pie sigue medio metro por
      // encima del borde inferior. Más largo y el tercer tiempo se enciende
      // cuando ya no hay nada que mirar.
      const recorrido = tokenNum(cs, '--cocina-tiempo-recorrido', 1.05)

      let ultimo = -1
      ScrollTrigger.create({
        trigger: root,
        start: `top ${entra * 100}%`,
        end: () => `+=${window.innerHeight * recorrido}`,
        // Re-evalúa los umbrales en cada refresco. Va de la mano del
        // observador de abajo: sin él, el reparto en tres tramos se hace
        // contra un alto de página viejo (ver el bug medido que documenta
        // lib/refresca-scrolltrigger.ts).
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // clamp: en `progress === 1` exacto, floor daría `total` (un índice
          // que no existe) y el último tiempo se apagaría al final del viaje.
          const i = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total)))
          if (i === ultimo) return
          ultimo = i
          onActivo(i)
        },
      })
    }, root)

    // ⚠️ IMPRESCINDIBLE AQUÍ, no es una precaución. /flota carga 6 cards de
    // barco CON VÍDEO Y GALERÍA por encima de esta sección, todas lazy: sin
    // esto, ScrollTrigger reparte los tres tramos contra la altura de página
    // que había al montar. Medido antes de ponerlo: el 2º tiempo se llevaba
    // ~1.100px de scroll y el 1º apenas 200.
    const dejaDeRefrescar = refrescaScrollTriggerAlCrecer()

    return () => {
      dejaDeRefrescar()
      ctx.revert()
    }
  }, [rootRef, activo, total, onActivo])
}
