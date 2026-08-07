import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// La entrada de cada uno de los 6 proyectos de la timeline de
// /ventaja-competitiva — v3 2026-08-07, Samuel: «que las animaciones de
// aparición de los textos e imágenes sea más creativo, y además que vaya con el
// scroll, es decir, si me vuelvo para atrás se vuelvan a ocultar».
//
// POR QUÉ UN HOOK NUEVO Y NO RETOCAR EL REVEAL DE LA PÁGINA. `.sost-reveal`
// (use-sostenibilidad-reveal.ts) es un fundido de UN DISPARO: `once: true`, sin
// scrub, y eso no es un descuido —es lo que quiere una página larga de bloques
// apilados, donde reproducir la entrada cada vez que el lector sube y baja
// marearía—. Lo que pide Samuel es lo contrario y solo para estos 12 bloques,
// así que se sacan de esa clase y se gobiernan aquí. El resto de la página
// (misión, pilares, videos, cierre, y la propia cabecera de esta sección) sigue
// con el reveal de siempre.
//
// EL GESTO. Cada fila se abre DESDE EL EJE hacia su lado: el texto y la foto
// nacen pegados a la barra y viajan hacia fuera mientras aparecen, así que la
// barra vertical deja de ser solo un medidor de avance y parece emitir los
// proyectos. El texto además no entra como un bloque: sus cuatro líneas
// —rótulo, título, claim y párrafo— se descubren en cascada, y como el timeline
// va con scrub esa cascada no es tiempo sino DISTANCIA (el bloque se lee
// escribiéndose a medida que sube). La foto suma lo que solo puede hacer una
// foto: un BARRIDO que la descubre desde el lado del eje hacia fuera, en la
// misma dirección en la que viaja, mientras se asienta de un 112% a su tamaño.
//
// ⚠️ EL SENTIDO DEL GESTO NO ES DECORATIVO, ES LO QUE LO HACE SEGURO. Todo
// empieza MÁS CERCA DEL CENTRO de lo que acaba, así que ningún bloque puede
// empujar el ancho de la página mientras entra. Al revés —naciendo hacia
// fuera— el desplazamiento se sumaría al canto de la rejilla y en el tramo
// estrecho de lg aparecería scroll horizontal en cada entrada.
//
// ⚠️ EN MÓVIL EL VIAJE ES SOLO VERTICAL. Ahí el eje vive en el canto izquierdo
// y los dos bloques caen a su derecha, así que «desde el eje» significaría
// entrar desde fuera de la pantalla por la izquierda — justo el caso que el
// párrafo anterior evita. Se queda el fundido + la subida + el barrido de la
// foto, que no dependen del ancho. El reparto lo hace `gsap.matchMedia()`, que
// además revierte solo lo suyo al cruzar el breakpoint.
//
// EL ESTADO NATURAL DEL JSX ES «YA ENTRADO» y este hook aplica el inicial al
// montarse, igual que el resto de la página: con reduced-motion, con
// ?dev-sost=estatico o si falla el JS, los 6 proyectos se ven asentados —y ese
// es además EL frame que viaja a Figma, donde no hay scroll que scrubear.
//
// NO INTERFIERE CON LA BARRA DE PROGRESO (use-progreso-proyectos.ts) aunque
// ahora los bloques se muevan todo el rato: los marcadores son HERMANOS de
// estos nodos, no hijos, así que su `getBoundingClientRect()` no hereda estos
// transforms; y el alto de la lista, que la barra mide en cada frame, es de
// layout y los transforms no lo tocan. Esa es la misma razón por la que el
// marcador vivía ya fuera de `.sost-reveal`.
export function useEntradaProyectos(
  rootRef: RefObject<HTMLElement | null>,
  { activo }: { activo: boolean },
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const x = tokenAPx(cs, '--proyecto-entrada-x', rootPx, 48)
    const y = tokenAPx(cs, '--proyecto-entrada-y', rootPx, 16)
    const escala = tokenNum(cs, '--proyecto-entrada-escala', 1.12)
    const stagger = tokenNum(cs, '--proyecto-entrada-stagger', 0.12)
    const scrub = tokenNum(cs, '--proyecto-entrada-scrub', 0.5)
    const inicio = cs.getPropertyValue('--proyecto-entrada-inicio').trim() || 'top 88%'
    const fin = cs.getPropertyValue('--proyecto-entrada-fin').trim() || 'top 52%'

    // `desdeElEje` es lo único que cambia entre breakpoints: en lg cada bloque
    // arranca desplazado hacia la barra; por debajo, solo sube.
    const montar = (desdeElEje: boolean) => {
      gsap.utils.toArray<HTMLElement>('[data-proyecto-fila]', root).forEach((fila) => {
        const texto = fila.querySelector<HTMLElement>('[data-proyecto-texto]')
        const caja = fila.querySelector<HTMLElement>('[data-proyecto-foto]')
        const foto = caja?.querySelector<HTMLElement>('img')
        if (!texto || !caja || !foto) return

        // `data-lado` lo escribe el JSX y dice de qué lado del eje cae EL
        // TEXTO (la foto va siempre enfrente). Se lee del dato en vez de
        // medirlo con getBoundingClientRect a propósito: medir aquí ataría el
        // gesto a la posición que los bloques tuvieran en el primer layout,
        // que es justo el momento en que este hook los está desplazando.
        const textoALaDerecha = fila.dataset.lado === 'derecha'
        const signo = textoALaDerecha ? -1 : 1 // hacia el eje = hacia el centro
        const dxTexto = desdeElEje ? signo * x : 0
        const dxFoto = desdeElEje ? -signo * x : 0

        // El barrido descubre la foto desde el lado del eje hacia fuera, o sea
        // en el mismo sentido en el que la caja viaja: el corte va delante y la
        // imagen lo persigue. `inset(0 100% 0 0)` deja fuera todo menos el
        // canto izquierdo (se abre hacia la derecha) y `inset(0 0 0 100%)` lo
        // contrario. En móvil no hay dos lados: siempre de izquierda a derecha.
        const abreHaciaLaDerecha = !desdeElEje || !textoALaDerecha
        const clipCerrado = abreHaciaLaDerecha ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'

        const tl = gsap.timeline({
          scrollTrigger: { trigger: fila, start: inicio, end: fin, scrub },
        })

        // Los tres tweens arrancan en 0 (el mismo gesto, no tres seguidos). El
        // stagger del texto es lo único que reparte, y hace que el bloque acabe
        // de asentarse un pelo después de la foto — el orden en que se leen.
        tl.fromTo(
          Array.from(texto.children),
          { autoAlpha: 0, x: dxTexto, y },
          { autoAlpha: 1, x: 0, y: 0, stagger, ease: 'power2.out' },
          0,
        )
          .fromTo(
            caja,
            { autoAlpha: 0, x: dxFoto, y },
            { autoAlpha: 1, x: 0, y: 0, ease: 'power2.out' },
            0,
          )
          .fromTo(
            foto,
            { clipPath: clipCerrado, scale: escala },
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'power2.out' },
            0,
          )
      })
    }

    // Con reduced-motion no se registra NADA: el estado natural del JSX ya es
    // el asentado, así que la sección se ve entera y quieta.
    const mm = gsap.matchMedia()
    mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => montar(true))
    mm.add('(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)', () => montar(false))

    return () => mm.revert()
  }, [rootRef, activo])
}
