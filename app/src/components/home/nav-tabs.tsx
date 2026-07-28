import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { DropdownNosotros } from './dropdown-nosotros'
import { DropdownSostenibilidad } from './dropdown-sostenibilidad'
import { DropdownAyuda } from './dropdown-ayuda'
import type { MenuId } from './header'

// Entrada/salida del panel del mega-menú (2026-07-22, pedido de Samuel:
// "que los mega menú tengan una animación chula de entrada y salida,
// actualmente aparece y desaparece bruscamente"). GSAP, no @keyframes —
// mismo motivo que el logo/Reservar fundidos de NavFlotante (ver "GSAP, no
// @keyframes" en nav-flotante.tsx): un @keyframes solo anima el MONTAJE; el
// panel aparece Y desaparece por montaje/desmontaje de React condicional
// (`menuAbierto`), y un @keyframes no puede animar la salida (React quita
// el nodo antes de que la animación termine) — con GSAP, un tween de
// SALIDA (encoge + desvanece) recién desmonta en su `onComplete`. Sube +
// achica desde arriba (transform-origin: top center, ver el JSX): es de
// donde "cuelga" el panel, así que crece hacia abajo, no desde su centro.
const MEGA_DURACION_ENTRADA = 0.22
const MEGA_EASE_ENTRADA = 'back.out(1.2)' // overshoot sutil — vivo sin ser payaso, panel grande con fotos
const MEGA_DURACION_SALIDA = 0.16
const MEGA_EASE_SALIDA = 'power2.in' // sin rebote al irse, mismo criterio que la fusión de NavFlotante
const MEGA_Y_INICIAL = 8 // px — misma magnitud que .menu-hoja-entrada/.boleto-cuerpo-entrada (componentes.css)
const MEGA_ESCALA_INICIAL = 0.96

// Interpolación de los ítems DENTRO del panel (2026-07-22, mismo pedido:
// "que los elementos de dentro del megamenú también aparezcan con
// animación, con interpolación cada uno... rápido para no entorpecer la
// navegación pero para dar más viveza"). `[data-mega-item]` (item-menu.tsx,
// mega-tours.tsx, mega-eventos.tsx) marca cada card/fila SIN acoplar el
// contenido a esta animación por props — TabsConPaneles las busca con
// querySelectorAll una vez el panel ya está en el DOM y las anima con
// `stagger` (un solo tween, gsap reparte el delay entre todas). SOLO al
// ABRIR: al cambiar de tab con el panel ya abierto (Tours→Eventos) no
// hay remontaje del panel (mismo `useLayoutEffect`, deps sin cambiar) así
// que el contenido nuevo entra de golpe — repetir el stagger cada vez que
// se cambia de tab sería más lento de navegar, no más vivo. SIN stagger al
// SALIR: los ítems se van con el fade+encoje del panel entero (arriba) —
// escalonar también la salida sumaría tiempo justo cuando "rápido" importa
// más (cerrar para seguir navegando).
const MEGA_ITEM_DURACION = 0.16
const MEGA_ITEM_EASE = 'power1.out' // suave, sin rebote — el rebote ya lo tiene el panel; en 3-4 ítems a la vez se vería a "gelatina"
const MEGA_ITEM_Y_INICIAL = 6
const MEGA_ITEM_STAGGER = 0.035
const MEGA_ITEM_RETRASO = 0.03 // el panel arranca solo una fracción antes que sus ítems

// ── CAMBIO DE TAB CON EL PANEL YA ABIERTO ──────────────────────────────────
// [v2 2026-07-27, pedido de Samuel] Hasta ahora esto no estaba animado: el
// panel solo tenía entrada y salida, así que ir de Eventos a Ayuda cambiaba el
// contenido DE GOLPE (el comentario de MEGA_ITEM_* de arriba lo daba por bueno
// a propósito, para no entorpecer la navegación). Samuel pidió darle viveza:
// «que rebote mínimamente, se contraiga un poco y crezca y vuelva a estado
// normal, como quien toca un resorte», y que el contenido se EMPUJE según de
// qué lado esté el tab que tocas.
//
// Dos animaciones a la vez, ambas cortas:
//
// 1. RESORTE del panel — se contrae a MEGA_CAMBIO_ESCALA y vuelve a 1 con un
//    `back.out` alto, que sobrepasa el 1 y se asienta. Contraer→crecer→asentar
//    en un solo tween; una timeline de 3 pasos se sentiría lenta y aquí lo que
//    manda es que no estorbe.
//
// 2. EMPUJE direccional del contenido — la dirección sale de la POSICIÓN
//    RELATIVA de los tabs (ORDEN_TABS), no de un valor fijo: si el tab nuevo
//    está a la derecha del actual, el contenido viejo sale por la izquierda y
//    el nuevo entra desde la derecha; si está a la izquierda, al revés. Así el
//    gesto coincide con lo que el ojo espera al mirar la fila de tabs.
//
// Los dos arrancan a la vez (posición 0 de la timeline): son la misma
// interacción, no una secuencia.
const MEGA_CAMBIO_ESCALA = 0.97 // cuánto se contrae — apenas, es un guiño
const MEGA_CAMBIO_DURACION = 0.28 // el empuje
const MEGA_CAMBIO_EASE = 'power3.out' // sale rápido y frena, sensación de deslizamiento
const MEGA_CAMBIO_RESORTE_DURACION = 0.36 // el rebote dura algo más que el empuje: remata
const MEGA_CAMBIO_RESORTE_EASE = 'back.out(3)' // overshoot claro — es el "resorte"
const MEGA_CAMBIO_DESPLAZAMIENTO = 100 // % del ancho: empuje completo, un desplazamiento parcial se lee como "tembleque", no como empujar

// Orden VISUAL de los tabs, que es el que decide la dirección del empuje.
// ⚠️ Tiene que coincidir con el orden en que se pintan abajo (y con el del
// menú móvil): si divergen, el contenido entrará por el lado contrario al que
// el usuario acaba de tocar y la animación se sentirá "al revés" sin que sea
// obvio por qué.
const ORDEN_TABS: MenuId[] = ['nosotros', 'tours', 'eventos', 'sostenibilidad', 'ayuda']

/** +1 = el tab nuevo está a la DERECHA del actual (el contenido entra desde la
 *  derecha y el viejo sale por la izquierda). −1 = al revés. */
function direccionEntre(desde: MenuId, hasta: MenuId): 1 | -1 {
  return ORDEN_TABS.indexOf(hasta) > ORDEN_TABS.indexOf(desde) ? 1 : -1
}

// Sin color: el color depende de dónde vive el tab (ver las variantes
// abajo) — 'solida' (Header, fondo blanco sólido) necesita navy; 'flotante'
// (NavFlotante) necesita blanco o negro según qué haya DETRÁS del panel en
// ESE momento del scroll, no según si la píldora está "fija" o no.
//
// SOBRE OSCURO, no `fijo` (2026-07-22, corrige el diseño anterior — pedido
// de Samuel: "cuando tengo el menú fijo y el fondo es el resto del hero, o
// secciones de banner completas oscuras... me gustaría que ahí los textos
// fueran blancos"). Antes el color dependía de `fijo` (`!logoVisible`: ¿ya
// se scrolleó más allá del hero?) — funcionaba PARA el hero (arriba del
// todo, sin scrollear, panel transparente → blanco) pero se rompía en
// cuanto la página tenía OTRAS secciones oscuras más abajo (incluye-
// crucero.tsx, why-direct.tsx): una vez `fijo` (vidrio claro), el texto se
// quedaba negro SIEMPRE, aunque el panel pasara físicamente por encima de
// esas secciones oscuras — negro sobre negro, ilegible.
//
// `sobreOscuro` reemplaza a `fijo` por completo: NavFlotante lo calcula con
// un IntersectionObserver sobre TODO elemento `[data-nav-oscuro]` de la
// página (el hero — home/hero.tsx e internas/hero-interna.tsx — más
// incluye-crucero.tsx y why-direct.tsx; cualquier sección oscura futura solo
// necesita ese atributo para entrar en el sistema, sin tocar este archivo).
// Es true cuando CUALQUIERA de esos elementos está detrás de la franja
// donde vive el panel — sin importar si la píldora está en su estado
// transparente (sobre el hero, arriba del todo) o vidrio (scrolleada, sobre
// Incluye o Why Direct): las dos situaciones necesitan texto blanco por el
// mismo motivo (fondo oscuro detrás), y ahora comparten la misma señal.
//
// Negro puro (Tailwind `black`), no --color-navy — pedido explícito de
// Samuel ("los textos del tab deben ser negros"), a propósito distinto del
// navy de marca que usa 'solida': mismo trato que ya tiene `text-white` (un
// color base de Tailwind, no un tinte de marca, para el estado sobre fondo
// oscuro).
const base = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
export const claseLinkTab = `${base} text-navy hover:bg-papel-hueso`
const claseLinkTabFlotanteOscuro = `${base} text-white hover:bg-white/10`
const claseLinkTabFlotanteClaro = `${base} text-black hover:bg-black/10`
const claseAbiertoSolida = 'bg-papel-hueso'
const claseAbiertoFlotanteOscuro = 'bg-white/10'
const claseAbiertoFlotanteClaro = 'bg-black/10'

// Fábrica del botón de un tab — la misma pieza vive en los 2 consumidores de
// TabsConPaneles (Header 'solida' y NavFlotante 'flotante'): un botón, no 2
// implementaciones. `variante` decide el esquema de color (ver arriba);
// `sobreOscuro` solo importa dentro de 'flotante' (ver comentario arriba).
export function crearBotonTab(
  menuAbierto: MenuId | null,
  toggle: (id: MenuId) => void,
  variante: 'solida' | 'flotante' = 'solida',
  sobreOscuro = true,
) {
  const clase =
    variante === 'flotante' ? (sobreOscuro ? claseLinkTabFlotanteOscuro : claseLinkTabFlotanteClaro) : claseLinkTab
  const claseAbierto =
    variante === 'flotante' ? (sobreOscuro ? claseAbiertoFlotanteOscuro : claseAbiertoFlotanteClaro) : claseAbiertoSolida
  return (id: MenuId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={menuAbierto === id}
      className={`${clase} ${menuAbierto === id ? claseAbierto : ''}`}
    >
      {label}
    </button>
  )
}

// Menú de tabs con paneles colgados — un solo componente para los 2 sitios
// que lo necesitan (Header 'solida' y NavFlotante). Hasta 2026-07-21 (6ª
// vuelta) NavFlotante usaba un componente aparte (TabsPrincipales, sin
// paneles) porque su panel activo lo pintaba NotchMenu, fusionado dentro de
// una caja que se expandía (ancho y alto animados) para contenerlo — "estilo
// Dynamic Island". Pedido de Samuel: "cambiar la lógica de que el menú se
// adaptara al mega menú, ahora quiero que sea más convencional, el menú
// queda igual y simplemente se abre el mega menú que es un div separado del
// módulo" — exactamente el patrón que 'solida' ya usaba (cada botón envuelve
// su propio panel colgado, `absolute left-0/right-0 top-full`, sin afectar
// el tamaño del menú). NotchMenu y su morph (JS mide, CSS anima
// --notch-ancho/--notch-alto) se retiraron por completo — ver notch-menu.tsx
// en el historial de git si hace falta revisitar esa mecánica.
//
// w-max en el wrapper del panel (2026-07-21, 6ª vuelta): SIN esto, el panel
// medía el ancho de su botón (~78px), no el de su contenido — bug real y
// PREEXISTENTE en 'solida' (nunca se había verificado visualmente con
// Playwright hasta hoy), no algo que introdujera esta vuelta. Causa: un
// `absolute` con `left` fijado y `right: auto`, sin `width` propio, calcula
// su shrink-to-fit width contra el "available width" de su containing
// block — que aquí es el propio `.relative` del botón, mucho más angosto
// que MegaTours/etc. `width: max-content` (w-max) se salta ese cálculo y usa
// el ancho natural del contenido directamente. Confirmado forzando
// `style.width` en vivo (78px → 880px) antes de tocar el código.
//
// left-1/2 -translate-x-1/2 (CENTRADO, no left-0/right-0): una vez el panel
// mide su ancho real (arriba), Tours (880px) anclado con left-0 en 'solida'
// se salía 28px por la derecha del viewport a 1440px (medido con Playwright:
// scrollWidth 1468 vs clientWidth 1440 — scrollbar horizontal real en toda
// la página). Centrar reparte el ancho a los DOS lados en vez de mandarlo
// todo hacia uno.
//
// CENTRADO AL GRUPO, no al botón individual (2026-07-22, corrige el diseño
// de arriba — pedido de Samuel: "quisiera que los desplegables estuvieran
// centrados con respecto a los 5 tabs, no que esté alineado a su tab, así
// no van saltando de posición en x"). Hasta esta corrección, CADA tab tenía
// su propio `.relative` + su propio panel `absolute` — el panel centraba
// sobre SU botón, así que el centro cambiaba con el ancho del texto y la
// posición del tab (Tours, cerca del extremo izquierdo del grupo, deja el
// panel más a la izquierda que Ayuda, cerca del derecho) y el panel SALTABA
// en x según qué tab se abriera. Ahora hay un solo `.relative` que envuelve
// LOS 5 (Inicio + los 4 botones) y un solo panel `absolute` (el contenido
// cambia con `menuAbierto`, pero la posición no) — centrado siempre sobre el
// MISMO punto medio del grupo entero, sin importar cuál tab esté abierto.
//
// "Guías" ya NO es su propio tab (2026-07-17, pedido de Samuel) — vive como
// subtab dentro de Ayuda (NAV_AYUDA, data/home.ts → DropdownAyuda), que de
// paso rellena la 4ª celda de su grid que antes se dejaba vacía a propósito.
//
// "Inicio" (2026-07-17, pedido de Samuel): primer ítem del menú, link plano
// a "/" — no es un tab con panel (no hay menuAbierto que le corresponda), así
// que no pasa por crearBotonTab, mismo trato que llevaba "Guías" cuando era
// su propio tab.
//
// Fondo del panel: SIEMPRE sólido (2026-07-22, 10ª vuelta — pedido de
// Samuel: "haz que el mega menú siempre tenga fondo sólido"). Pasó por 2
// vueltas antes de llegar aquí: 7ª vuelta, 'flotante' colgaba `.panel-vidrio`
// (componentes.css) — el mismo vidrio blanco de la píldora, para que panel y
// píldora leyeran como una sola pieza; 9ª vuelta, ese vidrio se volvía
// sólido SOLO cuando `fijo` (la píldora scrolleada, posiblemente sobre una
// sección oscura) porque el contenido del panel (ItemMenu, MegaTours,
// MegaEventos) es SIEMPRE navy — no reacciona a `sobreOscuro` como los tabs
// — y ese navy leía débil contra un fondo translúcido con algo oscuro
// detrás. Esta vuelta quita la excepción: sólido también sobre el hero
// (antes el único caso con vidrio) — un panel que se abre y cierra por
// montaje/desmontaje de React ya se lee como una pieza aparte de la píldora
// pase lo que pase con su fondo, así que el vidrio no aportaba nada que el
// sólido no resolviera, y sí un riesgo de legibilidad menos con una sola
// regla. `.panel-vidrio` y su ajuste de contraste `.text-navy-soft` quedan
// retirados de componentes.css (sin consumidores); la prop `fijo` sale de
// esta función (ya no decide nada aquí) — sigue viva en NavFlotante para
// `.nav-pildora--vidrio`/`.nav-flotante-envoltorio--fijo`/`fusionMontada`,
// preguntas que no tienen nada que ver con el fondo del panel. 'solida'
// (404) no cambia: siempre estuvo en bg-papel.
//
// mt-3 (2026-07-22, mismo pedido de Samuel: "debería tener un gap entre tab
// de menú y desplegable mega-menú") — sube de mt-2 (8px): con el panel tan
// pegado a la píldora, el borde/sombra de los dos casi se tocaban y se leían
// como una sola masa en vez de dos piezas flotando por separado.
export function TabsConPaneles({
  menuAbierto,
  toggle,
  variante = 'solida',
  sobreOscuro = true,
}: {
  menuAbierto: MenuId | null
  toggle: (id: MenuId) => void
  variante?: 'solida' | 'flotante'
  sobreOscuro?: boolean
}) {
  const botonTab = crearBotonTab(menuAbierto, toggle, variante, sobreOscuro)
  const claseInicio =
    variante === 'flotante' ? (sobreOscuro ? claseLinkTabFlotanteOscuro : claseLinkTabFlotanteClaro) : claseLinkTab
  const clasePanel = 'absolute left-1/2 top-full mt-3 w-max -translate-x-1/2 rounded-card shadow-card bg-papel ring-1 ring-linea'

  const panelRef = useRef<HTMLDivElement>(null)
  const abierto = menuAbierto !== null
  // Independiente de `abierto`: decide si el panel sigue en el DOM. Se pone
  // en `true` en cuanto `abierto` pasa a true (montaje inmediato); vuelve a
  // `false` recién cuando el tween de SALIDA de gsap termina — mismo patrón
  // que `fusionMontada` en nav-flotante.tsx.
  const [panelMontado, setPanelMontado] = useState(false)
  // Qué CONTENIDO mostrar — separado de `menuAbierto` a propósito: al
  // cerrar, `menuAbierto` pasa a `null` de inmediato (así `aria-expanded` es
  // correcto ya mismo), pero el panel sigue montado un rato más mientras se
  // desvanece — sin esto, `panel` (de menuAbierto) se quedaría en `null` y
  // el panel se vería VACÍO durante la salida en vez de mostrar el último
  // contenido real encogiéndose.
  const [idMostrado, setIdMostrado] = useState<MenuId | null>(null)

  // [v2 2026-07-27] El tab que se está YENDO mientras dura el empuje, con la
  // dirección ya resuelta. Mientras existe, el panel pinta DOS contenidos: el
  // entrante en flujo (es quien manda el ancho del panel, que cambia según el
  // tab) y el saliente en `absolute`, deslizándose fuera. Al terminar el tween
  // se limpia y vuelve a haber uno solo.
  const [saliente, setSaliente] = useState<{ id: MenuId; dir: 1 | -1 } | null>(null)
  const cajaCambioRef = useRef<HTMLDivElement>(null)
  const entranteRef = useRef<HTMLDivElement>(null)
  const salienteRef = useRef<HTMLDivElement>(null)
  // Espejo de `idMostrado` en un ref: el efecto de abajo necesita el valor
  // ANTERIOR sin volver a dispararse cuando `idMostrado` cambia.
  const idMostradoRef = useRef<MenuId | null>(null)

  useEffect(() => {
    if (menuAbierto === null) return
    const anterior = idMostradoRef.current
    // Solo hay empuje si YA había un panel abierto con otro contenido. Abrir
    // desde cerrado sigue usando la animación de entrada de siempre.
    if (anterior !== null && anterior !== menuAbierto) {
      setSaliente({ id: anterior, dir: direccionEntre(anterior, menuAbierto) })
    }
    idMostradoRef.current = menuAbierto
    setIdMostrado(menuAbierto)
  }, [menuAbierto])

  // Al cerrar del todo se olvida el último tab: si no, reabrir el mismo menú
  // más tarde intentaría empujar desde un estado que ya no está en pantalla.
  useEffect(() => {
    if (!panelMontado) idMostradoRef.current = null
  }, [panelMontado])

  useLayoutEffect(() => {
    if (!saliente) return
    const entrante = entranteRef.current
    if (!entrante) {
      setSaliente(null)
      return
    }

    // Mismo criterio que el resto del sitio: sin animación, el cambio es
    // instantáneo. La navegación no depende del movimiento.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSaliente(null)
      return
    }

    const d = saliente.dir
    const tl = gsap.timeline({ onComplete: () => setSaliente(null) })

    // El contenido nuevo entra desde el lado del tab que se tocó…
    tl.fromTo(
      entrante,
      { xPercent: d * MEGA_CAMBIO_DESPLAZAMIENTO, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        duration: MEGA_CAMBIO_DURACION,
        ease: MEGA_CAMBIO_EASE,
      },
      0,
    )
    // …y empuja al viejo hacia el lado contrario, a la vez y a la misma
    // velocidad: si no fueran simultáneos se leería como dos animaciones
    // seguidas, no como un empujón.
    if (salienteRef.current) {
      tl.to(
        salienteRef.current,
        {
          xPercent: -d * MEGA_CAMBIO_DESPLAZAMIENTO,
          opacity: 0,
          duration: MEGA_CAMBIO_DURACION,
          ease: MEGA_CAMBIO_EASE,
        },
        0,
      )
    }
    // El resorte del panel entero, encima de todo lo anterior.
    if (panelRef.current) {
      tl.fromTo(
        panelRef.current,
        { scale: MEGA_CAMBIO_ESCALA },
        {
          scale: 1,
          duration: MEGA_CAMBIO_RESORTE_DURACION,
          ease: MEGA_CAMBIO_RESORTE_EASE,
        },
        0,
      )
    }

    return () => {
      tl.kill()
    }
  }, [saliente])

  useEffect(() => {
    if (abierto) setPanelMontado(true)
  }, [abierto])

  useLayoutEffect(() => {
    if (!panelMontado) return
    const el = panelRef.current
    if (!el) return

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (sinMovimiento) {
      gsap.set(el, { opacity: abierto ? 1 : 0, y: 0, scale: 1 })
      gsap.set(el.querySelectorAll('[data-mega-item]'), { opacity: 1, y: 0 })
      if (!abierto) setPanelMontado(false)
      return
    }

    if (abierto) {
      const tweenPanel = gsap.fromTo(
        el,
        { opacity: 0, y: -MEGA_Y_INICIAL, scale: MEGA_ESCALA_INICIAL },
        { opacity: 1, y: 0, scale: 1, duration: MEGA_DURACION_ENTRADA, ease: MEGA_EASE_ENTRADA },
      )
      const tweenItems = gsap.fromTo(
        el.querySelectorAll('[data-mega-item]'),
        { opacity: 0, y: MEGA_ITEM_Y_INICIAL },
        {
          opacity: 1,
          y: 0,
          duration: MEGA_ITEM_DURACION,
          ease: MEGA_ITEM_EASE,
          stagger: MEGA_ITEM_STAGGER,
          delay: MEGA_ITEM_RETRASO,
        },
      )
      return () => {
        tweenPanel.kill()
        tweenItems.kill()
      }
    }

    const tween = gsap.to(el, {
      opacity: 0,
      y: -MEGA_Y_INICIAL,
      scale: MEGA_ESCALA_INICIAL,
      duration: MEGA_DURACION_SALIDA,
      ease: MEGA_EASE_SALIDA,
      onComplete: () => setPanelMontado(false),
    })
    return () => {
      tween.kill()
    }
  }, [panelMontado, abierto])

  // Un solo slot de panel — el CONTENIDO sale de `idMostrado` (no
  // `menuAbierto` directo, ver el comentario arriba), la POSICIÓN no cambia
  // (ver el comentario "CENTRADO AL GRUPO" más arriba).
  // [v2 2026-07-27] Extraído a función porque durante el empuje hay que pintar
  // DOS contenidos a la vez (el que entra y el que sale).
  const contenidoDe = (id: MenuId | null) =>
    id === 'tours' ? (
      <MegaTours />
    ) : id === 'eventos' ? (
      <MegaEventos />
    ) : id === 'nosotros' ? (
      <DropdownNosotros />
    ) : id === 'sostenibilidad' ? (
      <DropdownSostenibilidad />
    ) : id === 'ayuda' ? (
      <DropdownAyuda />
    ) : null

  const panel = (
    // overflow-hidden: durante el empuje el contenido saliente se va FUERA de
    // la caja, y sin recorte se vería deslizarse por encima del hero. El radio
    // acompaña al del panel para que el recorte no cuadre las esquinas.
    <div ref={cajaCambioRef} className="relative overflow-hidden rounded-card">
      {/* El SALIENTE va en `absolute` a propósito: así no cuenta para el
          tamaño de la caja y es el entrante quien manda el ancho del panel
          (que cambia entre tabs — Tours es mucho más ancho que
          Sostenibilidad). Si contara, el panel se quedaría con el ancho del
          más grande de los dos durante toda la transición y daría un salto al
          terminar. `w-max` para que conserve SU ancho natural mientras sale,
          no el del entrante. */}
      {saliente ? (
        <div
          ref={salienteRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 w-max"
        >
          {contenidoDe(saliente.id)}
        </div>
      ) : null}
      <div ref={entranteRef}>{contenidoDe(idMostrado)}</div>
    </div>
  )

  return (
    <div className="relative flex items-center gap-1">
      <Link to="/" className={claseInicio}>
        Inicio
      </Link>
      {/* [v2 2026-07-27] Orden nuevo dictado por el cliente (reunión 07-24,
          26:43): Inicio · Nosotros · Tours · Eventos · Sostenibilidad · Ayuda.
          «Nosotros» pasa DELANTE de Tours y Sostenibilidad entra como tab
          propio — el nav pasa de 5 a 6 entradas. */}
      {botonTab('nosotros', 'Nosotros ▾')}
      {botonTab('tours', 'Tours ▾')}
      {botonTab('eventos', 'Eventos ▾')}
      {botonTab('sostenibilidad', 'Sostenibilidad ▾')}
      {botonTab('ayuda', 'Ayuda ▾')}
      {panelMontado ? (
        <div ref={panelRef} className={clasePanel} style={{ transformOrigin: 'top center' }}>
          {panel}
        </div>
      ) : null}
    </div>
  )
}
