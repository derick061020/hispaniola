import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ⚠️ POR QUÉ EXISTE ESTO: ScrollTrigger traduce `start`/`end` a posiciones
// ABSOLUTAS en píxeles una sola vez, al crearse, y solo las recalcula en `load`
// y en `resize`. Pero el sitio va lleno de imágenes `loading="lazy"` que entran
// DESPUÉS de `load`, según se scrollea: cada una que aparece POR ENCIMA de una
// sección enganchada al scroll la empuja hacia abajo, y las posiciones
// cacheadas se quedan viejas — el efecto termina disparando antes de lo
// configurado, o repartiendo mal un recorrido de varios tramos.
//
// Esa deriva no es teórica, es la causa REAL de dos bugs ya vistos:
//   · home/use-equipo-scroll.ts — el efecto «pasaba desapercibido» (2 vueltas
//     de Samuel seguidas). Medido con Playwright: con `top 30%` puesto,
//     arrancaba de hecho cerca de `top 55%`. Subir el % compensaba el síntoma
//     y de forma frágil: el desfase depende de cuántas imágenes hayan cargado
//     y cambia entre visitas.
//   · flota/use-tiempos-cocina.ts — los tres tiempos de la cocina flotante se
//     repartían mal el recorrido: medido, el 2º se llevaba ~1.100px de scroll y
//     el 1º apenas 200, porque las 6 cards de barco de arriba cargan sus fotos
//     mientras bajas.
//
// El código vivía dentro de use-equipo-scroll.ts con la nota «si algún día hay
// más de un sitio pidiendo refresco, esto debería subir a un único observador».
// Ese día es hoy (2026-08-07): lo pide también la cocina flotante, así que sube
// aquí en vez de copiarse.
//
// ScrollTrigger.refresh() es GLOBAL —recalcula todos los triggers de la
// página—, así que da igual quién lo pida: endereza de paso el resto de bloques
// enganchados al scroll, que sufren lo mismo. Por eso los observadores se
// CUENTAN en vez de montarse uno por consumidor: dos secciones en la misma
// página no necesitan dos ResizeObserver sobre el mismo <html> disparando el
// mismo refresco global.
let consumidores = 0
let observador: ResizeObserver | null = null
let pendiente = 0

/**
 * Mantiene las posiciones de ScrollTrigger al día mientras el alto del
 * documento siga cambiando (imágenes lazy que entran después de `load`).
 *
 * @returns la función de limpieza, para devolverla tal cual desde el efecto.
 */
export function refrescaScrollTriggerAlCrecer(): () => void {
  consumidores += 1
  if (!observador) {
    observador = new ResizeObserver(() => {
      window.clearTimeout(pendiente)
      // Debounce: al cargar varias imágenes de golpe llegan ráfagas de cambios
      // de altura, y refrescar en cada una es trabajo tirado.
      pendiente = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    observador.observe(document.documentElement)
  }

  return () => {
    consumidores -= 1
    if (consumidores > 0) return
    window.clearTimeout(pendiente)
    observador?.disconnect()
    observador = null
  }
}
