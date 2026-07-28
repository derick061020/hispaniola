import { useEffect, useState } from 'react'

// Scroll-spy compartido por los DOS navs de anclas del proyecto: la barra de
// pestañas de la ficha de tour (tour/anclas-ficha.tsx) y la fila de chips de
// /ventaja-competitiva (ui/nav-anclas-chips.tsx, correcciones v2 plan 08 §2).
// Se extrae aquí el 2026-07-28 al aparecer el segundo consumidor — la lógica
// es idéntica, lo que cambia entre los dos es solo la piel (pestañas con
// indicador deslizante vs. chips) y eso se queda en cada componente.
//
// Cómo decide cuál está activa (2026-07-17, pedido de Samuel): la línea de
// disparo es EXACTAMENTE donde aterriza una sección al hacer clic en su ancla
// — su `scroll-margin-top`. Atarla ahí y no al borde de la barra evita el
// desfase de 1: si la línea quedara por encima del punto de aterrizaje, la
// sección recién clicada no contaría como «cruzada» y se activaría la de
// arriba. Se recorre de arriba a abajo y gana la última sección cuyo tope ya
// cruzó esa línea; al final de la página gana la última (si no, las secciones
// cortas del pie nunca se activan). rAF para no recalcular en cada píxel.
//
// Los ids que NO existen en el DOM se ignoran sin ruido: la fila de chips
// mezcla anclas de esta página con enlaces a /fundacion (proyectos,
// membresías), y esos últimos simplemente nunca se activan.
export function useAnclasActiva(ids: string[]) {
  const [activa, setActiva] = useState<string | undefined>(ids[0])
  const idsKey = ids.join()

  useEffect(() => {
    const secciones = idsKey
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (secciones.length === 0) return

    // Punto de aterrizaje de una sección al saltar a su ancla (su
    // scroll-margin-top) + 2px de holgura para el redondeo sub-píxel.
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
  }, [idsKey])

  return [activa, setActiva] as const
}

// El salto va suave, pero con `scrollIntoView` y NO con
// `html { scroll-behavior: smooth }`: ese es global y cambiaría también los
// anclas de la home (#tours del hero y del header). `scroll-margin-top` (en
// cada sección) lo respeta igual, así que el título no queda debajo del
// chrome sticky.
export function irAlAncla(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const destino = document.getElementById(id)
  if (!destino) return
  e.preventDefault()
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto' })
}
