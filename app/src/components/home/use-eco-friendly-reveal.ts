import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tokenAPx, tokenNum } from '@/lib/lee-tokens'

gsap.registerPlugin(ScrollTrigger)

// Reveal al hacer scroll del cintillo Eco-friendly (CORRECCIONES v1 DEL
// CLIENTE, planes/01-home.md slide 4: "rehacer con un formato más moderno y
// actual" — el layout y el copy no cambian, el sello YA es un rediseño propio
// (ver eco-friendly.tsx); lo que se pule aquí es la animación).
//
// A diferencia de Experiencia/Incluye (timeline scrub, engancha al pixel de
// scroll) esto es un disparo ÚNICO al entrar en pantalla — mismo mecanismo
// que use-sostenibilidad-reveal.ts / use-guias-reveal.ts: el cintillo es
// angosto y se cruza rápido, no tiene sentido scrubearlo pixel a pixel.
//
// El sello, además, se DIBUJA: sus 3 trazos de línea (contorno de la hoja,
// nervadura, venillas — los `<path className="eco-sello-trazo">` de
// SelloEco) arrancan con stroke-dashoffset = su propia longitud (invisibles)
// y GSAP los lleva a 0, como un boceto completándose.
//
// ⚠️ 2ª vuelta (pedido de Samuel: "se siente que pasa desapercibido porque el
// stroke se parece al color de la hoja") — el orden importa más que el
// color. La 1ª versión hacía POP el disco + anillo + relleno translúcido
// (.eco-sello-fondo) ANTES/A LA VEZ que el trazo se dibujaba: para cuando el
// ojo procesaba la línea, el relleno ya llevaba un rato mostrando la MISMA
// silueta de hoja, así que el trazo no aportaba información nueva — dibujar
// un contorno sobre una forma que ya se ve completa no se lee como "dibujo".
// Ahora el trazo se dibuja SOLO, sobre nada (máximo contraste posible, no
// compite con ningún relleno) — y el color entra DESPUÉS, de golpe con
// rebote (back.out), como si el boceto se llenara de tinta de una vez. Dos
// beats en vez de uno: línea → color, no los dos a la vez. El texto
// (.eco-reveal) sube con fade en paralelo al trazo, mismo gesto que el resto
// de reveals del proyecto.
//
// El estado FINAL (todo visible, trazos completos) es el NATURAL del JSX —
// GSAP solo pinta el inicial con `gsap.set()` SINCRÓNICO antes del primer
// paint (mismo motivo que sostenibilidad/guías: sin esto, entre el .from() y
// el onEnter de ScrollTrigger queda un frame de flash, aquí más visible
// todavía por lo rápido que se cruza esta franja al scrollear). Con
// reduced-motion o ?dev-eco=estatico no se engancha nada — el cintillo se ve
// directamente asentado (el frame que viaja a Figma).
//
// ⚠️ Las constantes salen de TOKENS (--eco-reveal-*/--eco-sello-dibujo-*,
// tokens.css), no van "a ojo": son la FUENTE del prototipo de Figma (playbook
// animaciones-a-figma).
export function useEcoFriendlyReveal(sectionRef: RefObject<HTMLElement | null>, { activo }: { activo: boolean }) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !activo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cs = getComputedStyle(section)
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const y = tokenAPx(cs, '--eco-reveal-y', rootPx, 16)
    const duracion = parseFloat(cs.getPropertyValue('--eco-reveal-duracion')) || 0.5
    const stagger = tokenNum(cs, '--eco-reveal-stagger', 0.08)
    const dibujoDuracion = parseFloat(cs.getPropertyValue('--eco-sello-dibujo-duracion')) || 0.9
    const dibujoRetraso = parseFloat(cs.getPropertyValue('--eco-sello-dibujo-retraso')) || 0.2

    const ctx = gsap.context(() => {
      const trazos = section.querySelectorAll<SVGPathElement>('.eco-sello-trazo')
      // getTotalLength() es la técnica estándar de "dibujado" SVG: dasharray
      // = la longitud real del trazo, dashoffset = esa misma longitud deja el
      // único segmento "on" del patrón desplazado fuera del path (invisible);
      // animar dashoffset a 0 lo va revelando desde el inicio del trazo.
      const longitudes = Array.from(trazos).map((trazo) => trazo.getTotalLength())

      gsap.set('.eco-reveal', { autoAlpha: 0, y })
      gsap.set('.eco-sello-fondo', { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' })
      trazos.forEach((trazo, i) =>
        gsap.set(trazo, { strokeDasharray: longitudes[i], strokeDashoffset: longitudes[i] }),
      )

      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to('.eco-reveal', { autoAlpha: 1, y: 0, duration: duracion, stagger, ease: 'power2.out' })
          // El trazo se dibuja PRIMERO, solo, sin nada detrás — así que
          // arranca en t=0 (sin delay: cuanto antes se vea la línea moverse,
          // más clara la lectura de "esto se está dibujando").
          trazos.forEach((trazo) =>
            gsap.to(trazo, { strokeDashoffset: 0, duration: dibujoDuracion, ease: 'power1.inOut' }),
          )
          // El color entra DESPUÉS de que el trazo termina (delay =
          // dibujoDuracion + una pausa corta de suspenso), con rebote — el
          // "pop" es ahora el remate de la animación, no un fondo discreto.
          gsap.to('.eco-sello-fondo', {
            autoAlpha: 1,
            scale: 1,
            duration: duracion,
            delay: dibujoDuracion + dibujoRetraso,
            ease: 'back.out(1.7)',
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [sectionRef, activo])
}
