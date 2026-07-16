import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Vive en lib/ y NO en components/ a propósito: no pinta nada (devuelve null) y
// por tanto no es un futuro componente de Figma — es comportamiento de routing.
//
// React Router NO resetea el scroll al navegar (a diferencia de una navegación
// nativa del navegador). Hasta la ficha de tour daba igual: la app era una sola
// página. Ahora, entrar a /tours/:slug desde el footer de la home aterrizaría
// con el scroll al fondo — ver PLAN-TOURS.md §7, Trampa №1.
//
// Hash-aware: con `/#tours` o `/tours/x#ancla-menu` scrollea al elemento en vez
// de al principio. El scroll suave lo pone `scroll-behavior` desde el CSS
// (respeta prefers-reduced-motion por sí solo); aquí no se fuerza.
export function ScrollAlNavegar() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // El elemento del hash puede no existir aún en el primer paint tras un
      // cambio de ruta — se reintenta en el frame siguiente antes de rendirse.
      const irAlAncla = () => {
        const destino = document.querySelector(hash)
        if (destino) {
          destino.scrollIntoView()
          return true
        }
        return false
      }
      if (irAlAncla()) return
      const frame = requestAnimationFrame(irAlAncla)
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
