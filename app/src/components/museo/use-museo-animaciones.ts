import { useLayoutEffect, type RefObject } from 'react'
import type { Descenso } from './use-descenso'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// TODO EL MOVIMIENTO DE /underwater-museum en un solo sitio (GSAP, como el
// resto de la web). Lo lee por atributos `data-museo-*` que ponen los
// componentes, así cada sección declara QUÉ se mueve y aquí se decide CÓMO.
//
//   data-museo-entra      → entrada escalonada del héroe al cargar.
//   data-museo-hero       → el héroe se ancla y su caja se expande a sangre.
//   data-museo-revelar    → aparece al entrar en pantalla (subiendo del fondo).
//   data-museo-flotar     → ingravidez continua, con periodo propio por pieza.
//   data-museo-parallax   → la foto se desliza dentro de su marco.
//   data-museo-contar     → la cifra cuenta desde cero.
//   data-museo-galeria-*  → el carril horizontal anclado (solo escritorio).
//
// Con `prefers-reduced-motion` no corre NADA: todo está visible y quieto de
// partida (los estados iniciales los pone GSAP, no el CSS), así que sin JS o
// sin movimiento la página se lee completa.

export function useMuseoAnimaciones(raizRef: RefObject<HTMLElement | null>, descenso: RefObject<Descenso>) {
  useLayoutEffect(() => {
    const raiz = raizRef.current
    if (!raiz) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const q = <T extends Element = HTMLElement>(sel: string) => Array.from(raiz.querySelectorAll<T>(sel))

    // matchMedia vive FUERA del context: ctx.revert() no lo deshace solo.
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      // ── Héroe: entrada ─────────────────────────────────────────────────
      gsap.from(q('[data-museo-entra]'), {
        autoAlpha: 0,
        y: 28,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
      })

      // ── Héroe: la caja se abre ──────────────────────────────────────────
      // [2ª vuelta, Samuel] El héroe arranca como en el resto del sitio —caja
      // redondeada con aire blanco alrededor— y al hacer scroll se ANCLA y se
      // expande hasta llenar la pantalla. Se anima UNA variable,
      // `--museo-cierre` (1 = caja, 0 = a sangre), de la que museo.css saca los
      // márgenes y el radio; el shader lee el rectángulo resultante y además
      // recibe la expansión para soltar el papel de alrededor y fundir el borde
      // de abajo con el agua.
      //
      // [3ª vuelta, Samuel: «se sube el hero; debería simplemente expandirse»]
      // La caja NO se mueve nunca, solo crece. Se ancla en el píxel 0, justo
      // donde está al cargar (antes se anclaba al tocar el borde de arriba y
      // primero subía entera los 28px del Topbar), y sus CUATRO bordes se
      // abren a la vez y en proporción con `--museo-cierre`: arriba gana
      // además lo que ocupaba el Topbar (`--museo-encima`, museo.css).
      const hero = raiz.querySelector<HTMLElement>('[data-museo-hero]')
      if (hero) {
        // Cuánto hay por encima del héroe (el Topbar en escritorio, 0 en móvil).
        const encima = Math.max(0, hero.getBoundingClientRect().top + window.scrollY)
        // La altura de la sección descuenta lo de ENCIMA medido, no un token:
        // si el Topbar cambia de alto, la caja sigue cuadrando abajo.
        hero.style.setProperty('--museo-encima', `${encima}px`)
        // [3ª vuelta, Samuel: «que sea más corto el recorrido para poder bajar
        // antes» y «tiembla un poco»] 35% de pantalla en vez de 65%, y
        // `scrub: 0.6` en vez de `true`: pegado al píxel, cada golpe de rueda
        // (≈100px) era un salto; con 0.6s de inercia el crecimiento se desliza.
        const anclaje = ScrollTrigger.create({ trigger: hero, start: 0, end: '+=35%', pin: true })
        gsap.fromTo(
          hero,
          { '--museo-cierre': 1 },
          {
            '--museo-cierre': 0,
            ease: 'none',
            scrollTrigger: {
              start: 0,
              end: () => anclaje.end,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
            onUpdate: () => {
              if (descenso.current) descenso.current.expansion = 1 - Number(gsap.getProperty(hero, '--museo-cierre'))
            },
          },
        )
      }

      // ── Revelado al entrar ──────────────────────────────────────────────
      const revelar = q('[data-museo-revelar]')
      gsap.set(revelar, { autoAlpha: 0, y: 36 })
      const aparecer = (lote: Element[]) =>
        gsap.to(lote, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true })
      ScrollTrigger.batch(revelar, {
        start: 'top 88%',
        once: true,
        onEnter: aparecer,
        // Si se llega SALTANDO (recarga a mitad de página, un ancla del
        // medidor), lo que queda por encima no «entra»: se pasa de largo. Sin
        // esto se quedaba invisible al volver a subir.
        onLeave: aparecer,
      })

      // ── Ingravidez ──────────────────────────────────────────────────────
      // Cada pieza con su periodo (3,4–5,2 s) y su desfase: si flotan a la vez
      // se leen como UN bloque que se mueve, que es lo que hacía la B2.
      const amplitud =
        parseFloat(getComputedStyle(raiz).getPropertyValue('--spacing-museo-flotar')) *
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 8
      q('[data-museo-flotar]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: -amplitud, rotation: -0.5 },
          {
            y: amplitud,
            rotation: 0.5,
            duration: 3.4 + ((i * 0.37) % 1.8),
            delay: -((i * 0.9) % 3),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
        )
      })

      // ── Paralaje de fotos ───────────────────────────────────────────────
      q('[data-museo-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -7, scale: 1.16 },
          {
            yPercent: 7,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      // ── Cifras que cuentan ──────────────────────────────────────────────
      q('[data-museo-contar]').forEach((el) => {
        const final = el.dataset.museoContar ?? '0'
        const decimales = final.includes('.') ? final.split('.')[1].length : 0
        const obj = { v: 0 }
        gsap.to(obj, {
          v: parseFloat(final),
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimales)
          },
        })
      })

      // ── Galería: carril anclado (escritorio) ────────────────────────────
      mm.add('(min-width: 64rem)', () => {
        const galeria = raiz.querySelector<HTMLElement>('[data-museo-galeria]')
        const viewport = raiz.querySelector<HTMLElement>('[data-museo-galeria-viewport]')
        const pista = raiz.querySelector<HTMLElement>('[data-museo-galeria-pista]')
        if (!galeria || !viewport || !pista) return
        const sobrante = () => Math.max(0, pista.scrollWidth - viewport.clientWidth)
        gsap.to(pista, {
          x: () => -sobrante(),
          ease: 'none',
          scrollTrigger: {
            trigger: galeria,
            start: 'top top',
            end: () => `+=${sobrante()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
      })
    }, raiz)

    // ── RECARGAR A MITAD DE PÁGINA ─────────────────────────────────────
    // [3ª vuelta, Samuel: «al recargar, en algún punto se buggea, no carga el
    // mar o carga todo a tropezones»] El navegador devolvía el scroll a su
    // sitio ANTES de que GSAP montara el anclaje del héroe (que añade un 35% de
    // pantalla de alto): todo se recolocaba de golpe y lo que quedaba por
    // encima no llegaba a revelarse. Ahora la restauración la hace la página:
    // se guarda la posición al salir, se mide todo (fuentes incluidas) y SOLO
    // ENTONCES se vuelve a ella, de una vez y sin animación.
    const CLAVE = 'haa_museo_scroll'
    const previa = 'scrollRestoration' in history ? history.scrollRestoration : null
    if (previa) history.scrollRestoration = 'manual'
    const guardar = () => {
      try {
        sessionStorage.setItem(CLAVE, String(window.scrollY))
      } catch {
        // almacenamiento bloqueado: se recarga arriba, que también vale
      }
    }
    window.addEventListener('pagehide', guardar)

    // La clave se borra DESPUÉS de restaurar, no al leerla: en desarrollo
    // StrictMode monta este efecto dos veces y el primer montaje (que se
    // cancela) se la llevaba antes de que el segundo pudiera usarla.
    let guardada = 0
    try {
      guardada = Number(sessionStorage.getItem(CLAVE)) || 0
    } catch {
      guardada = 0
    }
    let cancelado = false
    document.fonts.ready.then(() => {
      if (cancelado) return
      ScrollTrigger.refresh()
      if (guardada > 0) window.scrollTo({ top: guardada, behavior: 'instant' })
      try {
        sessionStorage.removeItem(CLAVE)
      } catch {
        // nada que limpiar
      }
    })

    // Las fotos cargan perezosas y cambian alturas: se re-mide al terminar.
    const refrescar = () => ScrollTrigger.refresh()
    window.addEventListener('load', refrescar)
    return () => {
      cancelado = true
      window.removeEventListener('load', refrescar)
      window.removeEventListener('pagehide', guardar)
      if (previa) history.scrollRestoration = previa
      mm.revert()
      ctx.revert()
    }
  }, [raizRef, descenso])
}
