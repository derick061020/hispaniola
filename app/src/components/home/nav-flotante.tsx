import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { TabsConPaneles } from './nav-tabs'
import { useMenuDropdown } from '@/lib/use-menu-dropdown'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { MenuId } from './header'

// Nav flotante — panel de vidrio (2026-07-21, pedido de Samuel). Reemplaza
// dos piezas separadas que se veían distintas entre sí:
//   1. El notch cortado en el bisel del hero (Header variante="sobreVideo"):
//      vivía DENTRO de cada hero, con logo a un lado y el CTA "Reservar" al
//      otro, fondo blanco sólido, esquinas cóncavas.
//   2. La isla flotante tipo Dynamic Island (isla-flotante.tsx, ya borrado):
//      aparecía recién al pasar el hero (IntersectionObserver), logo fundido
//      en la píldora + Reservar como píldora aparte, también fondo sólido.
//
// Samuel: "haremos uno similar [a como está el fijo hoy] pero que sea tanto
// para estar en el hero y luego baje al hacer scroll, que sea el MISMO para
// ambas situaciones" — un panel, SIEMPRE visible desde que carga la página
// (no una aparición al pasar el hero). Fondo "vidrio" en vez de blanco sólido
// — ver el porqué (investigación de librerías, soporte de navegadores) en el
// comentario de --color-vidrio, tokens.css.
//
// GATING POR PRESENCIA DE #hero, NO POR SCROLL. La versión anterior usaba un
// IntersectionObserver para saber cuándo el hero salía de vista y recién ahí
// aparecer — eso es justo lo que Samuel pidió quitar (la aparición tardía
// del panel ENTERO). Pero el CRITERIO de qué páginas lo muestran no cambia:
// antes, una página sin id="hero" nunca activaba el observer y la isla no
// aparecía NUNCA ahí (protección implícita, no una exclusión explícita) —
// 404, gracias,
// gracias-evento, fundaciones y el funnel de reserva son así. Si este panel
// se mostrara SIEMPRE sin importar la página, aparecería de golpe en esas
// pantallas (que hoy no lo tienen a propósito: menos distracción en un
// checkout, o directamente "no es contenido del sitio" en /fundaciones). Por
// eso se conserva la misma comprobación —¿existe un #hero en esta página?—
// pero ya no como observer de scroll: solo se mira UNA VEZ al montar (o al
// cambiar de ruta), y si existe, el panel se muestra de inmediato.
//
// LOGO + RESERVAR FUNDIDOS AL SCROLLEAR (2026-07-21, 2ª vuelta — pedido de
// Samuel: "en el hero, en el header sí se debe ver el logo y el botón de
// reserva... esos no se pondrán fijo al hacer scroll... tengo la idea de que
// el elemento de menú le aparezca ahí dentro el logo a la izquierda y el
// botón de reserva a la derecha... cuando vuelva a estar visible el logo y
// botón de reserva [reales] se ocultan estos fijos que están dentro del
// menú"). El logo+CTA "reales" siguen viviendo en Header (variante
// sobreVideo), en flujo normal — NO fijos, se van con el scroll igual que el
// resto del hero. Este panel observa ese logo real (id="logo-hero", puesto
// por Header) con un 2º IntersectionObserver, independiente del gating de
// arriba: mientras es visible (estamos arriba del todo), el panel muestra
// SOLO tabs, igual que antes; en cuanto sale de vista, el panel funde su
// propia versión compacta de logo + Reservar a los lados de los tabs, sin
// desmontarse ni cambiar de posición — mismo panel, más contenido. Al volver
// a subir y el logo real reaparece, se ocultan de nuevo. `logoVisible`
// arranca en `true` (el estado por defecto al cargar cualquier página con
// hero es "arriba del todo, logo real visible").
//
// TEXTO BLANCO / VIDRIO OSCURO (pedido de Samuel, mismo mensaje): con el
// panel siempre visible sobre fondos variados, texto blanco necesita relleno
// oscuro detrás — ver --color-vidrio en tokens.css (antes blanco, ahora
// tinte navy translúcido) y nav-tabs.tsx (variante 'flotante' de los tabs).
//
// FONDO CONDICIONAL (2026-07-21, 3ª vuelta — pedido de Samuel: "por defecto
// sin fondo... y ya luego al hacer scroll si se activa el fondo del menú").
// El vidrio de arriba deja de ser incondicional: `fondo` (prop de NotchMenu)
// es true cuando `!logoVisible` (se scrolleó más allá del hero) O cuando hay
// un menú abierto (`menuAbierto !== null`) — un dropdown como MegaTours no
// trae su propio fondo opaco, así que sin el segundo caso, abrir "Tours"
// arriba del todo (antes de scrollear) mostraría un panel transparente e
// ilegible sobre el video. En reposo (sin scroll, sin menú abierto), los
// tabs quedan flotando directo sobre el video — el contraste ahí lo da el
// scrim propio del hero (--color-scrim-nav, home/hero.tsx e
// internas/hero-interna.tsx), no este panel.
//
// ANIMACIÓN DE ENTRADA (mismo pedido: "el logo y botón aparecen muy brusco,
// mejora la animación y que mantenga su border-radius redondo"): el fondo
// (::before en componentes.css) transiciona su opacity, así que aparece/
// desaparece suave en los dos sentidos sin tocar el layout — el
// border-radius de .nav-pildora es incondicional (nunca se activa/
// desactiva), así que la forma nunca se ve "cuadrada" a mitad de camino.
// Logo y Reservar llevan la clase `notch-fusion-entrada` (fade + scale, con
// el mismo delay que ya usa el panel del mega-menú) en vez de aparecer de
// golpe con el simple mount de React.
//
// 3ª VUELTA (mismo día — 3 pedidos de Samuel sobre esta misma pieza):
//   1. "No veo centrado el menú de tabs con respecto a logo y botón" — medido
//      con Playwright: la posición horizontal ya caía centrada (~0.3px de
//      diferencia), el desbalance real era de ALTURA — Reservar (tamaño="sm")
//      medía 52px contra 36px de los tabs y el logo, y se leía como un botón
//      ajeno asomando por encima del resto de la fila. Corregido en
//      ui/boton.tsx (sm: py-4 → py-2) en vez de aquí.
//   2. "El logo aparecería creciendo desde la derecha y el botón creciendo
//      desde la izquierda" — antes escalaban desde su propio centro (crecían
//      hacia los 2 lados). Ahora cada uno ancla su transform-origin en el
//      borde que TOCA los tabs (`.notch-fusion-entrada--logo`/`--reservar`,
//      componentes.css), como si emergieran del centro del panel hacia
//      afuera, en vez de inflarse en el sitio.
//   3. "El menú fijo no tenga el azul corporativo, quiero que sea un negro
//      neutro" + "la transición... se siente tosca, ponle cariño" — ver
//      --color-vidrio (ahora R=G=B, sin matiz) y --notch-fondo-transicion/
//      --notch-fondo-easing (tokens.css): el fundido del fondo ya no
//      comparte la curva "con rebote" del morph de ancho — tiene la suya,
//      más larga y sin rebote, pensada para un fade, no para una forma que
//      cambia de tamaño.
//
// GSAP, no @keyframes (2026-07-21, 4ª vuelta — pedido de Samuel: "mete gsap
// y usalo porque más adelante lo usaremos para otros elementos"). El punto 2
// de arriba (dirección) seguía usando un @keyframes CSS disparado por el
// simple mount/unmount de React — funciona para la ENTRADA, pero un
// @keyframes no puede animar un unmount (React quita el nodo del DOM antes
// de que la animación termine) y, si el scroll tiembla justo en el umbral y
// `logoVisible` cambia varias veces seguidas, cada remontaje REINICIA la
// animación desde 0 en vez de revertir suave desde donde iba. gsap resuelve
// las dos cosas: `fusionMontada` (no `logoVisible` directo) decide si el par
// está en el DOM, y un tween de SALIDA (encoge + desvanece) recién desmonta
// en su `onComplete` — la primera vez que este par tiene una salida animada,
// no solo una entrada. Matar el tween anterior en el cleanup del efecto
// (`tween.kill()`) es lo que lo hace interrumpible: si `logoVisible` cambia
// de nuevo a mitad de camino, el siguiente tween arranca desde el valor
// ACTUAL de opacity/scale, no desde el extremo.
//
// SIN MORPH (2026-07-21, 6ª vuelta — pedido de Samuel: "cambiar la lógica
// que teníamos de que el menú se adaptara al mega menú, ahora quiero que sea
// más convencional, el menú queda igual y simplemente se abre el mega menú
// que es un div separado del módulo"). Hasta esta vuelta, el panel activo
// (MegaTours/MegaEventos/DropdownNosotros/DropdownAyuda) vivía DENTRO de la
// misma caja que los tabs — NotchMenu medía su tamaño (JS) y animaba el
// ancho/alto de la caja entera (CSS) para "absorberlo", estilo Dynamic
// Island. ADIÓS a NotchMenu: ahora el nav es un `<nav>` de tamaño FIJO
// (.nav-pildora, componentes.css — el mismo tratamiento de vidrio de
// siempre, ya no anima width/height) y cada dropdown es un div `absolute`
// COLGADO de su propio botón (TabsConPaneles, nav-tabs.tsx) — el mismo
// patrón que Header 'solida' ya usaba en la 404. Por eso `fondo` (más abajo)
// vuelve a depender solo de `!logoVisible`: cada dropdown trae su propio
// fondo opaco (`bg-papel`), ya no necesita que la píldora se ponga vidrio
// detrás para leerse.
//
// VIDRIO BLANCO (2026-07-22, 7ª vuelta — pedido de Samuel: "probemos... el
// vidrio del menú fijo sea blanco 40%, la saturación de fondo sea 200%...
// el texto de los tabs se pone en negro, y por ende el mega menú el fondo
// lo pones vidrio blanco también"). Revierte el vidrio oscuro de la 3ª
// vuelta — ver --color-vidrio en tokens.css para el detalle completo.
// (El texto pasó a depender de `fijo={!logoVisible}` en esta vuelta — la 8ª,
// justo abajo, lo reemplaza por completo por `sobreOscuro`: ver por qué.)
//
// SOBRE OSCURO, no `fijo` (2026-07-22, 8ª vuelta — pedido de Samuel: "cuando
// tengo el menú fijo y el fondo es el resto del hero, o secciones de banner
// completas oscuras... me gustaría que ahí los textos fueran blancos").
// `fijo={!logoVisible}` (7ª vuelta) hacía negro el texto en cuanto se
// scrolleaba más allá del hero — funcionaba para EL HERO (arriba del todo,
// panel transparente → blanco necesario) pero se rompía en cuanto la página
// tenía OTRAS secciones oscuras más abajo (incluye-crucero.tsx,
// why-direct.tsx): una vez `fijo`, el texto se quedaba negro SIEMPRE, así el
// panel pasara físicamente por encima de esas secciones — negro sobre
// fondo oscuro, ilegible.
//
// `sobreOscuro` reemplaza a `fijo`: un IntersectionObserver observa TODO
// elemento `[data-nav-oscuro]` de la página (marcador puesto a mano en cada
// sección que de verdad es oscura — hoy: la caja del video en home/hero.tsx
// e internas/hero-interna.tsx, el `<section>` completo de incluye-
// crucero.tsx, y `.wd-banner` en why-direct.tsx; una sección oscura futura
// solo necesita ese atributo, sin tocar este archivo) con un `rootMargin`
// que recorta el viewport a una franja angosta arriba (~100px, donde vive
// el panel en sus 2 estados de `top`) — así un target solo "intersecta"
// cuando de verdad pasa DETRÁS de esa franja, no por estar simplemente
// visible en cualquier parte de la pantalla. `sobreOscuro` es true si
// CUALQUIERA de esos elementos intersecta esa franja en un momento dado.
//
// Reemplaza a `fijo` en TabsConPaneles (nav-tabs.tsx: `sobreOscuro` decide
// blanco/negro, ya no `!logoVisible`) Y en el logo compacto (`<Logo
// sobreOscuro={sobreOscuro} />`, antes fijo en la variante navy — sobre
// Incluye/Why Direct necesitaba volver a blanco por el mismo motivo).
// Reservar SÍ sigue sin cambios: botón coral sólido, su texto blanco no
// depende de ningún fondo detrás.
//
// `fijo`/`!logoVisible` NO desaparece del todo: sigue siendo la señal
// correcta para .nav-pildora--vidrio y .nav-flotante-envoltorio--fijo (¿ya
// se scrolleó más allá del hero?, una pregunta distinta de "¿hay algo
// oscuro detrás AHORA?") y para `fusionMontada` (¿el logo real de Header
// sigue a la vista?). Solo el COLOR DEL TEXTO se movió a la nueva señal.
//
// Solo desktop (md:): en móvil ya hay CTA sticky al pie (hero.tsx) + hoja de
// menú (MenuMovil) — un panel flotante ahí competiría por la misma franja
// que el pulgar necesita para scrollear.
//
// Exclusiones explícitas (igual que antes, defensivas por si un dev-flag
// forzara la visibilidad):
//   - /reservar/:slug y /mi-reserva: checkout / gestión de reserva — nada de
//     contacto/nav compitiendo con el flujo (pedido de Samuel, 2026-07-17).
//
// ⚠️ /tours/:slug YA NO ESTÁ EXCLUIDA, pero AHÍ EL PANEL NO SE QUEDA FIJO
// (2026-07-22, dos mensajes de Samuel el mismo día).
//
// 1º — «el menú no se está viendo en el hero y tampoco fijo». La ficha era la
// única página con hero que se quedaba SIN menú de sitio: su Header va en
// variante 'sobreVideo', que a propósito solo pinta logo + Reservar porque
// los tabs los pone este panel — y este panel la excluía. Resultado: logo,
// botón, y ninguna manera de ir a Tours o Eventos desde la página que más
// tráfico recibe.
//
// 2º — «aquí haz que el menú fijo no se ponga fijo, aquí me importa mucho más
// el menú interno de las secciones y debe estar totalmente arriba». El primer
// intento apilaba las dos barras (panel arriba, fila de anclas debajo) y eso
// es justo lo que Samuel no quiere: en una ficha larga, la barra que se usa
// mientras se lee es la de SECCIONES, y compartir la franja de arriba con el
// menú de sitio le quitaba a la que importa tanto sitio como prioridad.
//
// La resolución es `cedeElTope` (se llamaba `esFicha` hasta el 2026-07-28,
// cuando /ventaja-competitiva estrenó su propia fila de anclas y pasó a ser
// el segundo caso): el panel se pinta igual sobre el hero —mismo
// sitio, mismos tabs, misma página que cualquier otra— pero en flujo, no
// fijo: se va con el hero y le devuelve el tope del viewport a AnclasFicha,
// que vuelve a `top-0`. La fusión logo + Reservar tampoco se monta aquí: su
// razón de ser es «el logo real ya no se ve, hay que reponerlo en el panel»,
// y si el panel se va con el logo real, no hay nada que reponer.
// gsap (2026-07-21): duración/ease propios de este par, no ligados a los
// tokens CSS del morph de ancho (--notch-transicion) — son mundos distintos
// (JS vs. custom properties) y esta pieza ya no depende de esos tokens.
const FUSION_DURACION_ENTRADA = 0.32
const FUSION_RETRASO_ENTRADA = 0.1
const FUSION_EASE_ENTRADA = 'back.out(1.7)' // mismo espíritu que --notch-easing: arranque vivo, aterrizaje suave
const FUSION_DURACION_SALIDA = 0.22
const FUSION_EASE_SALIDA = 'power2.in' // acelera al desaparecer, sin rebote — no hace falta "vivo" al irse
const FUSION_ESCALA_INICIAL = 0.7

export function NavFlotante() {
  const { pathname } = useLocation()
  const [tieneHero, setTieneHero] = useState(false)
  const [logoVisible, setLogoVisible] = useState(true)
  // Independiente de `logoVisible`: decide si el par sigue en el DOM. Se
  // pone en `true` en cuanto `logoVisible` pasa a false (montaje inmediato);
  // vuelve a `false` recién cuando el tween de SALIDA de gsap termina (ver
  // el useLayoutEffect de abajo) — no en el mismo instante que `logoVisible`
  // vuelve a true, que es lo que pasaba con el @keyframes anterior.
  const [fusionMontada, setFusionMontada] = useState(false)
  // Arranca en `true` — mismo motivo que `logoVisible`: toda página con hero
  // carga arriba del todo, sobre fondo oscuro. Ver "SOBRE OSCURO" arriba.
  const [sobreOscuro, setSobreOscuro] = useState(true)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const botonRef = useRef<HTMLAnchorElement>(null)
  const { menuAbierto, setMenuAbierto, toggle, navRef } = useMenuDropdown()

  // [dev-mode] ?dev-mega=tours (o eventos/nosotros/ayuda) fuerza ese dropdown
  // abierto. Mismo flag que ya usaba el header (dev-registry.ts): un solo
  // mecanismo de captura, no dos.
  useDevFlag('dev-mega', (v) => setMenuAbierto(v as MenuId))

  // [dev-mode] ?dev-nav=fundido fuerza el estado "logo real fuera de vista"
  // sin tener que scrollear (ver dev-registry.ts, «Nav flotante (vidrio)»).
  // `forzadoRef` bloquea el efecto
  // de abajo: sin esto, el IntersectionObserver se auto-dispara al montarse
  // con el estado REAL (normalmente "visible", si no se ha scrolleado) y
  // pisaría este valor forzado en el mismo frame.
  const forzadoRef = useRef(false)
  useDevFlag('dev-nav', (v) => {
    forzadoRef.current = true
    setLogoVisible(v !== 'fundido')
  })

  useEffect(() => {
    setTieneHero(!!document.getElementById('hero'))
  }, [pathname])

  // [v2 2026-07-28] RESET AL CAMBIAR DE RUTA. Bug real reportado por Samuel:
  // yendo de una ficha (con scroll bajado) a la home se veían DOS logos y DOS
  // botones «Reservar» — los del hero de la página nueva y, encima, los
  // fundidos del nav fijo.
  //
  // Causa: `IntersectionObserver` entrega su PRIMER callback de forma
  // ASÍNCRONA. Al navegar, el observer se vuelve a crear sobre el nuevo
  // `#logo-hero`, pero hasta que dispara pasan uno o más frames — y durante
  // ese hueco sobreviven `logoVisible: false` y `fusionMontada: true` de la
  // página anterior, que es justo lo que pinta el par fundido.
  //
  // El reset es optimista y seguro: `ScrollAlNavegar` deja la página nueva
  // arriba del todo, así que «el logo del hero está visible» es cierto en
  // cuanto se navega. Si por lo que fuera no lo estuviera, el observer lo
  // corrige en el mismo frame siguiente.
  //
  // useLayoutEffect y no useEffect: corre ANTES del pintado, así que el
  // usuario no llega a ver ni un fotograma con los dos pares.
  useLayoutEffect(() => {
    if (forzadoRef.current) return
    setLogoVisible(true)
    setFusionMontada(false)
  }, [pathname])

  useEffect(() => {
    if (forzadoRef.current) return
    const logoEl = document.getElementById('logo-hero')
    if (!logoEl) {
      setLogoVisible(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => setLogoVisible(entry.isIntersecting))
    io.observe(logoEl)
    return () => io.disconnect()
  }, [pathname, tieneHero])

  // sobreOscuro — ver el comentario "SOBRE OSCURO" de cabecera. Un solo
  // observer para TODOS los `[data-nav-oscuro]` de la página: cada target
  // solo entrega callbacks cuando SU PROPIO estado cambia, así que el Map
  // acumula el último estado conocido de cada uno y `sobreOscuro` es el OR
  // de todos — no hace falta un observer por sección.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-oscuro]'))
    if (targets.length === 0) {
      setSobreOscuro(false)
      return
    }
    // rootMargin negativo abajo: recorta el viewport a una franja angosta
    // arriba (~100px) — ahí es donde vive el panel en sus 2 estados de
    // `top` (2.75rem/44px sin scrollear, 1rem/16px fijo, +52px de alto).
    // Un target solo "intersecta" cuando de verdad pasa DETRÁS de esa
    // franja, no por estar simplemente visible en cualquier parte de la
    // pantalla.
    const estados = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => estados.set(entry.target, entry.isIntersecting))
        setSobreOscuro(Array.from(estados.values()).some(Boolean))
      },
      { rootMargin: `0px 0px -${Math.max(window.innerHeight - 100, 0)}px 0px` },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname, tieneHero])

  // Monta el par en cuanto el logo real sale de vista — el useLayoutEffect
  // de abajo anima la entrada una vez que los nodos ya existen en el DOM.
  useEffect(() => {
    if (!logoVisible) setFusionMontada(true)
  }, [logoVisible])

  // El tween de gsap en sí — entrada Y salida, ver el comentario "GSAP, no
  // @keyframes" más arriba.
  useLayoutEffect(() => {
    if (!fusionMontada) return
    const targets = [logoRef.current, botonRef.current].filter((el): el is HTMLAnchorElement => el !== null)
    if (targets.length === 0) return

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (sinMovimiento) {
      gsap.set(targets, { opacity: logoVisible ? 0 : 1, scale: 1 })
      if (logoVisible) setFusionMontada(false)
      return
    }

    if (!logoVisible) {
      const tween = gsap.fromTo(
        targets,
        { opacity: 0, scale: FUSION_ESCALA_INICIAL },
        {
          opacity: 1,
          scale: 1,
          duration: FUSION_DURACION_ENTRADA,
          delay: FUSION_RETRASO_ENTRADA,
          ease: FUSION_EASE_ENTRADA,
        },
      )
      return () => {
        tween.kill()
      }
    }

    // Saliendo: encoge + desvanece (transform/opacity, no afecta layout) y
    // RECIÉN AHÍ desmonta (onComplete) — para cuando React de verdad quita
    // estos nodos del flujo (y .nav-pildora, sin ancho fijo, se angosta de
    // golpe), el contenido ya es visualmente casi invisible — el salto de
    // ancho no se nota porque no hay nada visible ahí para "saltar".
    const tween = gsap.to(targets, {
      opacity: 0,
      scale: FUSION_ESCALA_INICIAL,
      duration: FUSION_DURACION_SALIDA,
      ease: FUSION_EASE_SALIDA,
      onComplete: () => setFusionMontada(false),
    })
    return () => {
      tween.kill()
    }
  }, [fusionMontada, logoVisible])

  if (!tieneHero || pathname.startsWith('/reservar/') || pathname === '/mi-reserva') return null

  // La ficha de tour muestra el panel pero NO lo fija — ver el bloque de
  // arriba. Todo lo que depende de «ya scrolleamos más allá del hero»
  // (posición fija, vidrio, fusión logo + Reservar) se apaga de una vez
  // aquí, en una sola señal, en vez de repetir la condición en cada sitio.
  //
  // [v2 2026-07-28] Se llamaba `esFicha` y ahora se llama `cedeElTope`: la
  // ficha dejó de ser el único caso. /ventaja-competitiva estrena su propia
  // fila de anclas sticky (ui/nav-anclas-chips.tsx, slide 58 del cliente) y
  // le aplica el MISMO criterio que Samuel fijó para la ficha el 2026-07-22
  // («aquí me importa mucho más el menú interno de las secciones y debe
  // estar totalmente arriba»): en una página larga que se lee de arriba
  // abajo, la barra que se usa es la de SECCIONES, así que el menú de sitio
  // se va con el hero en vez de pelear por la misma franja.
  const cedeElTope = pathname.startsWith('/tours/') || pathname === '/ventaja-competitiva'
  const fijo = !logoVisible && !cedeElTope

  return (
    // nav-flotante-envoltorio (componentes.css): top por defecto despeja el
    // Topbar (WhatsApp + teléfono + idioma), que vive ENCIMA en flujo normal
    // — con 16px los dos se solapan (ver --spacing-nav-flotante-top,
    // tokens.css). --fijo (activo con !logoVisible, 2026-07-21 5ª vuelta)
    // sube el panel a 16px una vez el Topbar ya scrolleó fuera de vista —
    // sin esto, el panel se quedaba con el mismo aire de arriba pensado
    // para un Topbar que ya no está en pantalla (Samuel: "está quedando muy
    // abajo... que no estorbe").
    <div
      className={`nav-flotante-envoltorio pointer-events-none inset-x-0 z-50 hidden justify-center md:flex ${
        cedeElTope ? 'nav-flotante-envoltorio--en-flujo absolute' : 'fixed'
      } ${fijo ? 'nav-flotante-envoltorio--fijo' : ''}`}
    >
      <div ref={navRef} className="pointer-events-auto">
        {/* .nav-pildora: tamaño FIJO (a diferencia del extinto NotchMenu, no
            anima width/height) — el vidrio depende solo de !logoVisible.
            --vidrio-oscuro (8ª vuelta) se suma cuando ADEMÁS sobreOscuro:
            mismo vidrio, receta oscura (ver tokens.css, "VIDRIO OSCURO
            ADAPTATIVO"). Los dropdowns (TabsConPaneles) traen su propio
            fondo — SIEMPRE sólido (ver nav-tabs.tsx, "Fondo del panel:
            SIEMPRE sólido") — y no necesitan que la píldora se ponga vidrio
            detrás para leerse. */}
        <nav
          className={`nav-pildora flex items-center gap-1 px-2 py-2 ${fijo ? 'nav-pildora--vidrio' : ''} ${fijo && sobreOscuro ? 'nav-pildora--vidrio-oscuro' : ''}`}
        >
          {fusionMontada && !cedeElTope ? (
            <Link
              ref={logoRef}
              to="/"
              aria-label="Hispaniola Aquatic Adventures — inicio"
              className="mr-1 shrink-0"
              style={{ transformOrigin: 'right center' }}
            >
              {/* sobreOscuro={sobreOscuro} (2026-07-22, 8ª vuelta): antes
                  fijo en la variante navy (7ª vuelta) razonando que este
                  logo solo aparece con la píldora ya en su estado "vidrio
                  blanco" — cierto para el hero, falso en cuanto el panel
                  pasa por Incluye/Why Direct (fondo oscuro otra vez, wordmark
                  navy invisible). Misma señal que los tabs (nav-tabs.tsx). */}
              <Logo compacto sobreOscuro={sobreOscuro} />
            </Link>
          ) : null}
          <TabsConPaneles menuAbierto={menuAbierto} toggle={toggle} variante="flotante" sobreOscuro={sobreOscuro} />
          {fusionMontada && !cedeElTope ? (
            <Boton
              ref={botonRef}
              to="/#tours"
              tamaño="sm"
              className="ml-1 shrink-0"
              style={{ transformOrigin: 'left center' }}
            >
              Reservar
            </Boton>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
