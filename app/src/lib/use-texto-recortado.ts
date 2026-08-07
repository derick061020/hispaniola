import { useCallback, useLayoutEffect, useState } from 'react'

// ¿Un texto necesita más de N líneas para caber?
//
// La pregunta parece trivial y no lo es: no se puede responder contando
// caracteres, porque el corte depende del ancho REAL de la caja (la rejilla de
// tours pasa por 1, 2 y 4 columnas) y de la fuente que esté cargada en ese
// momento. Sirve para que un botón de «desplegar» aparezca solo donde hace
// falta: de las 4 descripciones del escaparate hay anchos en los que alguna
// entra entera en 2 líneas y ahí el botón sobraría.
//
// ⚠️ Se mide contra la ALTURA DE LÍNEA, no contra `clientHeight`. La versión
// obvia —`scrollHeight > clientHeight`, "el contenido no cabe en su caja"— solo
// dice la verdad mientras el clamp está puesto: en cuanto el texto se despliega
// la caja crece hasta el contenido y la comparación da `false`, o sea "ya no
// hace falta botón" justo cuando hace falta el de volver a plegar. Comparar con
// `alturaLinea * (lineas + 0.5)` responde lo mismo pero es independiente del
// estado, porque `scrollHeight` es el alto del texto COMPLETO en los dos casos
// (el clamp recorta con overflow, no cambia el contenido). El medio renglón de
// margen absorbe el redondeo sub-píxel del zoom del navegador.

/**
 * @param lineas líneas visibles cuando está plegado. Debe coincidir con el
 *   `line-clamp-N` del elemento — Tailwind necesita la clase literal, así que
 *   el número va en los dos sitios y hay que moverlos juntos.
 * @returns `ref` para el elemento del clamp y si el texto no cabe en `lineas`.
 */
export function useTextoRecortado(lineas: number) {
  const [nodo, setNodo] = useState<HTMLElement | null>(null)
  const [recortado, setRecortado] = useState(false)

  useLayoutEffect(() => {
    if (!nodo) return

    let vivo = true
    const mide = () => {
      if (!vivo) return
      const alturaLinea = parseFloat(getComputedStyle(nodo).lineHeight)
      // `line-height: normal` no da un número: sin altura de línea fiable no
      // se inventa una medida, se deja el texto plegado sin botón.
      if (!Number.isFinite(alturaLinea)) return
      setRecortado(nodo.scrollHeight > alturaLinea * (lineas + 0.5))
    }
    mide()

    // El ancho del contenedor cambia con el viewport y con los saltos de la
    // rejilla; cada cambio puede meter o sacar una línea.
    const observador = new ResizeObserver(mide)
    observador.observe(nodo)

    // Y hace falta ADEMÁS esperar a la webfont: mientras está plegado la caja
    // mide siempre N líneas, así que cuando Poppins sustituye a la fuente de
    // sistema el texto reparte distinto pero la caja no se mueve — el observer
    // no dispara y la medida se quedaría con la del fallback, que parte por
    // otro sitio.
    document.fonts.ready.then(mide)

    return () => {
      vivo = false
      observador.disconnect()
    }
  }, [nodo, lineas])

  return { ref: useCallback((el: HTMLElement | null) => setNodo(el), []), recortado }
}
