import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// APERTURA de la foto que abre /nosotros (2026-07-22, efecto elegido por
// Samuel: «card de vídeo que se abre»). El marco arranca como una rendija
// vertical y se ABRE hacia los lados (clip-path: inset lateral → 0) mientras
// la foto se desplaza por dentro con parallax. Es el golpe de entrada de la
// página: lo primero que se ve bajo el hero.
//
// ⚠️ La maqueta del cliente ponía aquí una card GRANDE de vídeo («Conócenos en
// 60 segundos»). Samuel la descartó — «no uses esta disposición» — así que la
// bienvenida conserva su reparto de texto + foto y es la FOTO la que hereda el
// gesto de apertura. El efecto no depende de que haya vídeo: engancha a
// `.nosotros-apertura` (el marco) y `.nosotros-apertura-medio` (lo que va
// dentro), así que si algún día llega el vídeo del cliente se cambia la
// etiqueta de dentro y esto sigue igual.
//
// DOS animaciones distintas sobre el mismo bloque, a propósito:
//   - la apertura NO lleva scrub (es un gesto de entrada; engancharla al
//     píxel obligaría a seguir scrolleando para ver la foto entera),
//   - el parallax SÍ (ahí el scroll ES la curva, mismo criterio que
//     use-why-direct-scroll.ts).
//
// Por qué la img va escalada (scale en el estado natural del JSX, no aquí):
// si se desplaza dentro del marco sin sobremedida, asoma el hueco por el
// borde contrario. El escalado vive en el className del componente para que
// el frame estático (sin GSAP) también encuadre bien.
export function useAperturaIntro(rootRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(root)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const duracion = parseFloat(cs.getPropertyValue('--nosotros-apertura-duracion')) || 1.1
    const rendija = cs.getPropertyValue('--nosotros-apertura-rendija').trim() || '22%'
    const parallax = tokenAPx(cs, '--nosotros-apertura-parallax', rootPx, 56)
    const scrub = tokenNum(cs, '--nosotros-apertura-scrub', 0.5)

    const ctx = gsap.context(() => {
      // Preocultar SINCRÓNICAMENTE (dentro del contexto, para que el revert lo
      // deshaga al activarse el flag de Dev Mode) — misma trampa del "flash de
      // un frame" que documenta use-sostenibilidad-reveal.ts: con `gsap.from()`
      // ScrollTrigger dispara onEnter en el RAF siguiente y el contenido
      // parpadea antes de animarse.
      gsap.set('.nosotros-apertura', { clipPath: `inset(0 ${rendija} 0 ${rendija})` })

      gsap.to('.nosotros-apertura', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: duracion,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      })

      // Parallax interno: la foto entra un poco baja y sube mientras la
      // sección cruza la pantalla. `ease:'none'` porque la curva la pone el
      // scroll, no GSAP.
      gsap.fromTo(
        '.nosotros-apertura-medio',
        { y: parallax / 2 },
        {
          y: -parallax / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
            invalidateOnRefresh: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [rootRef, activo])
}
