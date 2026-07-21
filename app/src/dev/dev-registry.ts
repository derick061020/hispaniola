// ─────────────────────────────────────────────────────────────────────────────
//  [DEV-ONLY] Glosario Dev — registro central de lo construido.
//
//  Regla de trabajo (playbook dev-mode-glosario-prototipo del cerebro): cada
//  bloque nuevo, y cada estado interno (menú abierto, buscador expandido,
//  variante móvil…) que se construya, SE REGISTRA AQUÍ en el mismo commit que
//  lo crea, para poder abrirlo con un clic desde el overlay de Dev Mode.
//
//  El build tiene dos páginas reales: la home ("/") y la ficha de tour
//  ("/tours/:slug", una plantilla para los 4 productos). En la home, la
//  mayoría de "pantallas" de este registro no son rutas distintas sino BLOQUES
//  de esa página, navegables por query params `dev-*` que cada componente
//  consume con `useDevFlag`; en la ficha, las variantes SÍ son rutas (un slug
//  por producto). `/fundaciones` es una página aparte (swatches de tokens).
//
//  ⚠️ Nada de `src/dev/` se traslada a Figma. Es andamiaje del prototipo.
// ─────────────────────────────────────────────────────────────────────────────

export type DevStateKind = 'estado' | 'variante' | 'modal' | 'overlay'

export type DevState = {
  /** Nombre visible en el glosario, p. ej. "Menú Tours abierto". */
  label: string
  kind: DevStateKind
  /** URL que activa el estado: ruta + query params `dev-*`. */
  to: string
  note?: string
}

export type DevScreenStatus = 'done' | 'wip' | 'placeholder'

export type DevScreen = {
  title: string
  route: string
  status: DevScreenStatus
  description?: string
  states: DevState[]
}

export type DevSection = { title: string; screens: DevScreen[] }

export const devSections: DevSection[] = [
  {
    title: 'Fundaciones',
    screens: [
      {
        title: 'Tokens y type scale',
        route: '/fundaciones',
        status: 'done',
        description:
          'Swatches de paleta (Dirección B — Charter Premium) y escala tipográfica Lora + Inter, para validar fundaciones antes de construir bloques.',
        states: [],
      },
      {
        title: 'Sistema AlignUI',
        route: '/fundaciones#alignui',
        status: 'done',
        description:
          'Etapa A (PLAN-ALIGNUI.md): las piezas vendor de AlignUI Pro (copy-in de Synexia/referencia-alignui) con sus slots tematizados a la paleta Hispaniola vía styles/alignui.css — primary=coral, information=aqua, success=menta, faded=grises navy. Es el chrome de UI de las páginas internas (ficha de tour; el funnel cuando se desbloquee). La home usa ÚNICAMENTE el Accordion (sección FAQ, 2026-07-17, decisión de Samuel — ver «Home — Cierre» → «FAQ centrado (AlignUI)»); el resto de la home y el shell siguen sin AlignUI. En Figma, cada una mapea al componente equivalente del kit de Figma de AlignUI (licencia Pro) con estas variables.',
        states: [],
      },
    ],
  },
  {
    title: 'Home — Shell',
    screens: [
      {
        title: 'Header + Footer',
        route: '/',
        status: 'done',
        description:
          '"Inicio" (2026-07-17, pedido de Samuel): primer ítem del menú, en las 3 superficies de nav (TabsPrincipales en nav-tabs.tsx — sobreVideo + isla flotante; tabsConPaneles en header.tsx — variante solida; y MenuMovil) — link plano a "/", sin panel propio, mismo trato que llevaba "Guías" cuando era su propio tab. v3: el header vive DENTRO del box del hero (variante sobreVideo, transparente sobre el video), con la fila de logo/nav/Reservar capada a max-w-contenido (1400px — v3-F13, antes max-w-6xl/1152px). Topbar (WhatsApp + teléfono + idioma) aparte, ver «Topbar (contacto + idioma)» más abajo. v3-F8: los megamenús/dropdowns ya no son cards flotantes — el notch se EXPANDE (ancho y alto, animado) y los contiene, estilo Dynamic Island. v3-F9: Nosotros/Ayuda pasan de lista de links a grid de 2 columnas con chip de icono + descripción (antes el panel angosto flotaba centrado en la caja del notch, con aire muerto a los lados); "Contacto y WhatsApp" pasa a ser "Contacto", a la página /contacto del prototipo. v3-F13: el panel de Nosotros/Ayuda sube a 624px (antes 512px) — con el notch centrado y simétrico, eso solo cabe desde lg (1024px) sin tapar el logo/Reservar; entre md y lg va una variante compacta de 448px sin descripciones (chip + título). CTA Reservar, menú móvil con acordeón. v3-F15: el logo deja de ser el wordmark tipográfico "Hispaniola" y pasa a ser el LOGO REAL del cliente (langosta pirata + script), descargado de la web actual — revierte la decisión de direccion-visual.md §1, que lo había apartado de la UI por chocar con el posicionamiento premium. Va en dos variantes porque el lockup original tiene el texto en oscuro y es ilegible sobre el video: sobre el video, la versión reversed (langosta a color + texto blanco) que aporta Samuel; con el header sólido, el lockup original. 44px de alto en ambos casos.\n\nFOOTER «OCÉANO» (2026-07-17, pedido de Samuel): reemplaza al footer de 4 columnas sobre bg-navy a sangre — ahora las mismas 4 columnas (contenido intacto) viven SOBRE un océano turquesa Caribe, con una transición de espuma que disuelve el blanco de la sección anterior en el agua. Misma TÉCNICA de mask que .incluye-espuma (ver «Incluye del crucero» en «Home — Argumentos») pero ESTÁTICA: img (footer-oceano.webp) + overlay por token en vez de video, sin sticky ni GSAP — es el footer compartido con la ficha de tour y las landings de evento, no hay scroll-reveal que fundir tres veces. Assets PROPIOS (footer-oceano.webp + footer-espuma-mapa.webp, generados en Magnific — Samuel prohibió reutilizar los del incluye): el mapa de espuma se procesó en Python/PIL fuera del repo (curva de contraste + rampas de opacidad en los bordes + costura horizontal por corte ondulado, no cross-fade lineal — un blend liso dejaba "fantasma" borroso en textura de alta frecuencia como la espuma). El CTA canónico de cierre ("Tu día en el Caribe empieza aquí" + "Ver disponibilidad") ya NO vive en su propia sección: se FUNDE aquí, sobre el océano y encima de las columnas — "Ver disponibilidad" usa `to="/#tours"` (Boton con variante Link) porque el footer también vive en páginas sin ese ancla. --color-overlay-footer decide cuánto se oscurece el agua para que el texto blanco lea a AA (mismo método de medición que --color-overlay-incluye — ver ese token). Dirección de la col. 1 actualizada al dato canónico nuevo de Samuel (C. P.º del Sol, Punta Cana); WhatsApp de la col. 4 pasa a leer WHATSAPP_URL en vez de estar hardcodeado; "FAQ" y "Contacto" ahora son <Link> a /#faq y /#contacto (existen como secciones propias desde este mismo cambio).',
        states: [
          { label: 'Megamenú: Tours', kind: 'estado', to: '/?dev-mega=tours', note: 'Abre el notch expandido (v3-F8), no una card flotante. v3-F14.3: las cards se DESNUDAN (decisión de Samuel) — eran la TourCard del grid de la home encogida (marco, chip de audiencia, bloque de precio), así que el menú repetía tal cual la sección que vive media pantalla más abajo y mezclaba navegación con decisión de compra dentro de un panel que se cierra al salir el ratón. Ahora: foto grande (200×144), nombre y una línea de meta con el mismo idioma que la card del ticker («Desde US$ 99 · 4 h»; Isla Saona no tiene precio publicado → «Consultar»). Sin marco, sin chip y sin bloque de precio. El hover es el mismo que en Eventos (zoom de foto + título en aqua): los 2 megamenús hablan por fin el mismo lenguaje. 2026-07-17 (2ª vuelta, pedido de Samuel): se quita la salida "Ver los 4 tours →" al pie (el menú ya muestra los 4, no llevaba a ningún catálogo más grande) y el panel deja de tener un ancho en rem fijo por breakpoint — es `w-fit` (max-w-[92vw] de red de seguridad), autoajustado a Nº de columnas × --spacing-mega-card-ancho + gaps + padding. Numéricamente igual que antes (880px a 4 columnas, 448px a 2), pero ahora ese ancho SALE de la cuenta en vez de estar copiado a mano — la base que permitió a Eventos, con menos ítems, adaptarse sin tocar el ancho de card.' },
          { label: 'Megamenú: Eventos', kind: 'estado', to: '/?dev-mega=eventos', note: 'v3-F14 → rediseño 2026-07-17 (pedido de Samuel: "ya que los eventos los redujimos a 3, haz que tenga el mismo patrón de diseño que los tours, mismas cards que el mega menú de tours, quitamos ese box a la izquierda con eventos privados"). Se retira la foto editorial de la columna izquierda ("Eventos privados" + "Pedir cotización", galeria-charter-privado-4) y la lista con thumbnail de las ocasiones: con solo 3 ítems (LOS 3 EVENTOS de la web actual — OCASIONES en data/home.ts), el menú pasa a ser LA MISMA rejilla que MegaTours — misma card foto h-36 + nombre + meta, mismo ancho de card (--spacing-mega-card-ancho). 2ª vuelta (mismo día, Samuel: "quita ese footer... y que el ancho del megamenú se adapte para los 3, queda un espacio blanco raro, pero ojo no hagas que las cards sean más anchas"): se quita la salida "Ver los 3 eventos →" y `xl:grid-cols-4` pasa a `xl:grid-cols-3` — sin la 4ª celda vacía que dejaba compartir el ancho fijo de Tours (880px, calibrado para 4 columnas) sin compartir su Nº de columnas. El panel es `w-fit`: se autoajusta a 3 × --spacing-mega-card-ancho + gaps + padding (664px), sin tocar el ancho de card. Los 2 megamenús siguen siendo el mismo componente con datos distintos.' },
          { label: 'Dropdown: Nosotros', kind: 'estado', to: '/?dev-mega=nosotros', note: 'v3-F9: grid de 2 columnas, chip cuadrado gris + título + descripción (antes lista de links).' },
          { label: 'Dropdown: Ayuda', kind: 'estado', to: '/?dev-mega=ayuda', note: 'v3-F9: grid de 2 columnas — 3 ítems, el hueco de la 4ª celda se deja vacío a propósito.' },
          {
            label: 'Menú móvil abierto',
            kind: 'variante',
            to: '/?dev-movil=abierto',
            note: 'v3-F10: hoja (mismo margen/radio que el hero) sobre scrim, no pantalla completa. Bloquea el scroll del fondo, atrapa el foco y cierra con Escape o tocando el scrim. Ver mejor con el viewport en modo móvil.',
          },
        ],
      },
      {
        title: 'Topbar (contacto + idioma)',
        route: '/',
        status: 'done',
        description:
          '2026-07-17 (pedido de Samuel): banda delgada de contacto/idioma que la web actual lleva ARRIBA del header (WhatsApp, teléfono toll free, selector ES/EN) — retirada al construir v3 (el Header se mudó DENTRO del hero, transparente sobre el video, y ese fondo no aguantaba una barra sólida encima) y dejada como backlog de "botones flotantes". Vuelve, pero NO como esos botones: topbar.tsx vive en App.tsx, FUERA de <Routes> y en flujo normal (no fixed, a diferencia de la isla) — así queda con fondo blanco sólido, delgada, ANTES del margen/caja redondeada de cada hero (sm:pt-0 en home/hero.tsx e internas/hero-interna.tsx cancela el margen superior del hero SOLO desde sm — el móvil, sin topbar, conserva el margen original), en toda página que no sea /fundaciones (la página interna de validación de tokens, sin Header ni Footer tampoco). Sin borde inferior propio: el blanco de la barra se funde directo con el borde superior redondeado del hero, sin línea divisoria ni espaciado entre ambos. Texto pequeño y apagado (text-navy-soft, no protagonismo) a propósito: es utilidad, no jerarquía — el Header sigue siendo la fila que manda. Los teléfonos salen de CONTACTO (data/home.ts, la misma fuente que usa /contacto), no repetidos a mano. Selector ES/EN (ui/selector-idioma.tsx): toggle switch con banderas circulares SVG a mano (España — no RD, "se entiende mejor por los turistas" — y Estados Unidos) y un fondo que se desliza al lado activo; el lado inactivo suma su etiqueta de texto junto a la bandera (animada por max-width/opacity) para dejar claro que es un idioma A DONDE CAMBIAR, no decoración — puramente visual, el sitio no tiene i18n real todavía (Pendientes de PLAN-LANZAMIENTO.md). Topbar entero solo desde sm: en móvil no cabían los 3 bloques sin truncar y el header móvil ya carga logo + hamburguesa.',
        states: [],
      },
      {
        title: 'Isla flotante (nav fijo al scroll)',
        route: '/',
        status: 'done',
        description:
          '2026-07-17 (pedido de Samuel): al pasar el hero, aparece un nav FIJO — pero no el header de siempre vuelto position:fixed a ancho completo (no habría quedado bien), sino un cluster compacto tipo Dynamic Island (isla-flotante.tsx): 3 chips flotantes (logo · tabs · Reservar), centrados, shrink-to-fit, que NO abarca el ancho completo. Los tabs reusan NotchMenu (mismo morph de ancho/alto que el notch del header sobreVideo) con una variante `flotante`: sin las esquinas cóncavas (esas simulan un recorte en el borde del viewport — no tienen sentido flotando con margen) y con las 4 esquinas redondeadas (--radius-card-grande) en vez de solo las de abajo (ver .notch-caja--flotante en componentes.css). El Reservar usa el nuevo tamaño="sm" de Boton (rounded-full, antes solo existían md/lg). Aparece con un IntersectionObserver sobre el id="hero" compartido por el hero de la home y el de las internas (hero-interna.tsx) — sale cuando ese hero (con el header normal DENTRO, sobreVideo) deja de verse, para no duplicar el nav. Vive en App.tsx, fuera de cada página (comportamiento del shell, como ScrollAlNavegar): solo desktop (md:, en móvil ya hay CTA sticky + hoja de menú) y NO aparece en /tours/:slug, que ya tiene su propio chrome fijo (AnclasFicha, pegado a top-0, con --spacing-sticky-top calculado asumiendo que es el ÚNICO fijo) — dos navs fijos ahí competirían por la misma franja. Sí aparece en /eventos/:slug, que hoy no tiene ningún chrome fijo. El estado de apertura de tabs (useMenuDropdown) se extrajo del Header a lib/use-menu-dropdown.ts al sumar este 2º consumidor con el mismo comportamiento (clic fuera / Escape / cierre al navegar); los botones de tab también se extrajeron a home/nav-tabs.tsx (TabsPrincipales) para que Header y la isla compartan el mismo nav sin 2 copias.',
        states: [
          {
            label: 'Isla visible (forzada)',
            kind: 'estado',
            to: '/?dev-isla=abierta',
            note: 'Fuerza la isla visible sin tener que scrollear pasado el hero → frame limpio para Figma.',
          },
          {
            label: 'Isla con Tours abierto',
            kind: 'estado',
            to: '/?dev-isla=tours',
            note: 'Fuerza la isla visible Y el panel de Tours expandido dentro del NotchMenu flotante — el frame del morph a capturar.',
          },
        ],
      },
      {
        title: 'Hero inmersivo + ticker',
        route: '/',
        status: 'done',
        description:
          'v3: video de fondo (el mismo que usa el hero de la web original), contenido centrado y ticker horizontal en loop infinito con los 4 tours + las 6 ocasiones (sustituye a la baraja de v2). El ticker va a caballo sobre el borde inferior del hero (mitad sobre el video, mitad sobre la banda de premios). Su card tiene 2 VARIANTES: «tour» (precio desde, en navy semibold, + duración + aforo máx.) y «ocasión» (chip aqua «Evento privado», porque no hay precio publicado — se cotiza). v3-F11: la fila de rating (★★★★★ 4.9 + los 2 chips TripAdvisor/Viator) sube ARRIBA del título, en el slot donde vivía el eyebrow de localización (que se retira — el H1 ya dice "...de Punta Cana..."); los 4 stats (antes en su propia sección) bajan a vivir entre el subtítulo y el CTA. v3-F13: el hero mide ~78% del alto de pantalla en desktop (min-h-hero-alto, en svh — no vh/dvh), con el padding recortado para dejar ver la banda de premios sin scroll; el H1 pasa a 2 líneas (columna a max-w-5xl + text-balance); el stat "≤35%" se reescribe a "del aforo del barco" para no partir en 2 líneas; el CTA "Ver disponibilidad" crece (tamaño="lg", halo coral, icono) y los 2 checks bajan debajo del botón, en fila con divisoria e iconos SVG (antes texto "✓" en la misma fila que el botón). CTA sticky en móvil. v3-F16: las 3 insignias (antes fila de texto ★★★★★ 4.9 + 2 chips píldora) pasan a diseño de guirnalda de laurel — trazado de RatingBadge (Untitled UI, MIT, gratuito) portado a mano en components/ui/insignia-confianza.tsx con tokens propios (no se instaló la librería: cero dependencia de runtime para este componente — 2 SVG + Tailwind, cambiaba de sistema de tokens sin aportar nada). #1 TripAdvisor y Premios Viator muestran 5 estrellas como remate decorativo de "excelencia" (no citan una cifra propia); la única calificación real es 4.9, con relleno FRACCIONARIO en la 5ª estrella (clip-path al 90%, no 100% ni 0%).',
        states: [
          {
            label: 'Video congelado en el poster',
            kind: 'variante',
            to: '/?dev-hero=poster',
            note: 'Pausa el video de fondo en su primer frame → es EL FRAME que viaja a Figma (a Figma no va video, va el poster).',
          },
          {
            label: 'Destello del título',
            kind: 'variante',
            to: '/?dev-hero=poster',
            note: 'No es un estado aparte: el H1 lleva un reflejo de luz CONSTANTE (pedido de Samuel, «algo que dé personalidad, no cargado») que lo cruza cada 9s, como el sol sobre el agua. El texto se pinta con un gradiente recortado a la forma de las letras (background-clip: text) — la luz viaja POR DENTRO de la tipografía. La PAUSA entre destellos no sale de las keyframes (un selector de @keyframes no admite var()) sino del ancho del gradiente (--titulo-destello-escala: 800%): la banda de luz solo cae dentro de las letras una fracción del recorrido. Con prefers-reduced-motion el titular vuelve a ser blanco sólido. A Figma NO viaja animado: se captura el frame del destello a mitad de barrido.',
          },
          {
            label: 'Ticker pausado',
            kind: 'variante',
            to: '/?dev-ticker=pausado',
            note: 'Detiene la pista del ticker → frame limpio para Figma.',
          },
          {
            label: 'Ticker estático (reduced-motion)',
            kind: 'variante',
            to: '/?dev-ticker=estatico',
            note: 'Simula prefers-reduced-motion: sin loop, fila navegable a mano (overflow-x: auto).',
          },
          {
            label: 'Dock activo (hover)',
            kind: 'variante',
            to: '/?dev-dock=activo',
            note: 'Congela el hover "dock" (PLAN-v3.md §10) en su punto máximo sobre la 3ª card, sin depender de un puntero real → frame para Figma. Pausa la pista igual que ?dev-ticker=pausado.',
          },
          {
            label: 'CTA con catamarán zarpado (hover)',
            kind: 'variante',
            to: '/?dev-cta=hover',
            note: 'Congela el catamarán ZARPADO, sin puntero real → frame para Figma. Es el catamarán REAL del cliente (recorte de hero-catamaran-2.webp, espejado para navegar hacia la flecha), no una ilustración. Vive DENTRO del botón, en un hueco que NACE EN 0 y se EXPANDE al hover (v3-F14.1: antes quedaba siempre reservado, ~120px de vacío en reposo — el hueco es padding, no un flex item, o el gap del botón descuadraba el texto): sale de ABAJO (el casco se recorta en la línea de flotación — borde inferior del botón) y el mástil asoma por ARRIBA. Cabecea en bucle (±2°, pivotando en la línea de flotación) y una BANDADA de 5 gaviotas de trazo (ui/pajaros.tsx) aparece escalonada a su alrededor, en la franja de cielo entre el botón y los stats. Al pie del botón derivan 2 capas de olas en bucle infinito (constantes, sin hover). Barco, bandada y ensanchado solo existen con puntero fino; en táctil, nada.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Confianza y catálogo',
    screens: [
      {
        title: 'Banda de premios',
        route: '/',
        status: 'done',
        description:
          'v3-F11: esta sección ERA "Cinta de stats + premios" — las 4 cifras subieron al hero (ver «Hero inmersivo + ticker»), así que ahora es SOLO la banda de los 7 premios reales de la web actual (TripAdvisor #1, WeddingWire 2018-21, LTG Global 2021/22, Viator 2022/23/24, Luxury Travel Guide 2016), descargados de la web del cliente y no recreados. Al quedarse solos, los logos crecen (48px → 64px). Sustituyen a la antigua línea de texto "Reconocido en...". Van en gris + 72% de opacidad en reposo y recuperan su color real al pasar el ratón: son 5 familias cromáticas distintas y a todo color se leen como 7 objetos sueltos, no como una cinta (el guardarraíl de la dirección B: el color lo ponen las fotos, no los badges). v3-F13: max-w-contenido (antes max-w-6xl). El eyebrow "Reconocido por" se retira (los 7 badges ya dicen lo que son) y el padding superior pasa a --spacing-premios-aire: el ticker es `absolute` y cuelga media card DENTRO de este padding, así que el padding lo absorbe antes de dar aire — con un pt normal el hueco real salía negativo y las cards del ticker tocaban los logos. Hueco resultante: 48px en todas las resoluciones.',
        states: [],
      },
      {
        title: 'Eco-friendly (cintillo)',
        route: '/',
        status: 'done',
        description:
          'Sección nueva (2026-07-17, pedido de Samuel a partir de una foto de la web actual): esa web tiene un cintillo "ECO FRIENDLY [ícono] NO PLASTIC" como banda azul sólida a sangre, justo bajo los premios. Copiarla tal cual violaría el guardarraíl de la dirección B (direccion-visual.md §6: el color vive en las fotos, nunca en un fondo grande y plano) — Samuel, al ver 2 propuestas (línea sutil tipo eyebrow vs. fundirlo en la banda de Premios), eligió una 3ª: su PROPIA banda pero con "su nivel de protagonismo", ni un bloque azul sólido ni una línea que se pierde. 2ª vuelta (mismo día, Samuel: "usa la imagen ecofriendly original enmedio, haz que sea más delgado el banner y la imagen del centro sobresalga por arriba y por abajo, y que el background en vez de ser sólido sea linear-gradient transparente 25% verde 75% verde 100% transparente"): la insignia REAL del cliente (marca/eco-friendly-logo.png, descargada de la web actual) sustituye al ícono lucide genérico, a tamaño grande (80px móvil, 112px desktop) — más alta que el cintillo de color, que mide menos (36px/48px) y va centrado verticalmente en la misma caja: la insignia asoma por arriba y por abajo del color, como un sello sobre una cinta, sin overflow real hacia Premios/Experiencia. El fondo pasa de --color-menta sólido a un linear-gradient horizontal (transparente 0% → --color-menta 15%-85% → transparente 100%; el 2º stop subió de 75% a 85% y el 1er stop bajó de 25% a 15%, en 2 vueltas más el mismo día — tramo sólido asimétrico, ensanchado por los dos lados) — el color se concentra detrás de la insignia y se disuelve al blanco en los extremos, mismo idioma de gradiente-con-var() ya usado en mega-eventos.tsx. Copy sin cambios: "Eco-friendly" en inglés (footer); "Cero plástico a bordo" (stat del hero) a los lados de la insignia. Entre Premios y Experiencia — la misma posición relativa que en la web vieja; el cambio de fondo (ya no sólido, pero igual de presente en el tramo central) sigue haciendo de división entre las 2 secciones sin necesitar un border-b.',
        states: [],
      },
      {
        title: 'Experiencia (narrativa + video)',
        route: '/',
        status: 'done',
        description:
          'v3-F18 (pedido de Samuel): sección editorial NUEVA justo debajo de la banda de premios (que pierde su divider inferior para que fluyan como un bloque). A la izquierda, un párrafo GRANDE con palabras alternando gris (navy-sub) y negro (navy) para resaltar lo importante — SÍNTESIS del copy real de la web actual ("Punta Cana\'s most complete catamaran experience", 6 párrafos → 3 frases + cierre; pendiente reconciliar con datos.js). A la derecha, un COLLAGE de 3 fotos reales (vivero de coral, cocina a bordo, catamarán fondeado — ninguna repetida con la galería del cierre) con borde blanco fino (--spacing-foto-real-marco) y sombra realista en 2 capas (--shadow-foto-real: contacto + ambiente), esparcidas en diagonal con rotación irregular. v3-F18.2 (Samuel): fotos a la IZQUIERDA, texto a la DERECHA (en móvil el texto va primero, lg:order lo invierte), un CTA sutil «Ver disponibilidad →» en coral (estilo enlace, no botón sólido — el color de "Ver disponibilidad" sin competir con los CTA sólidos) al pie del texto → #tours, y menos aire abajo (pb-seccion-sm) para acercarla al grid de tours. El texto y las fotos ENTRAN escalonados al hacer scroll (GSAP ScrollTrigger, scrub — enganchado al scroll, NO sticky): el texto sube y aparece; las fotos ARRANCAN más grandes y separadas del montón (radial, en opacidad 0) y CONVERGEN a su sitio encogiendo. Las constantes salen de tokens (--exp-reveal-*, FUENTE del prototipo de Figma). A Figma NO viaja animado: se captura la sección asentada. v3-F18.1 (Samuel): se retira el eyebrow «La experiencia» (no aportaba), el texto sube a 32px (--text-narrativa) y las fotos quedan más grandes y stackeadas (más juntas). Antes las fotos subían pequeñas en bloque; ahora hacen el gesto de "montón que se arma". v3-F18.3 (Samuel): hover de GRUPO en las 3 fotos — al pasar el ratón por una, esa foto sube (--collage-foto-hover-alza), crece (--collage-foto-hover-escala) y rota hacia la izquierda (--collage-foto-hover-rotacion, pisa su --rot de reposo), mientras las OTRAS 2 se achican (--collage-foto-reposo-escala) y pierden color (grayscale). Pivote abajo-centro en las 3 (transform-origin: bottom center, como el barco del CTA del hero). CSS puro con `:has()` (`.collage:has(.collage-foto:hover)`) — reacción de grupo discreta, no una curva continua por distancia como el dock del ticker, no hace falta JS. Sustituye al hover anterior (solo "enderezar" a 0deg). v3-F21 (Samuel, 2026-07-16): la 2ª frase de la narrativa cambia — donde decía "rincones que las rutas de siempre no visitan" (vago: cualquier catamarán de Bávaro podría escribirlo) ahora nombra el arrecife de Cabeza de Toro y afirma que es uno de los 3 mayores proyectos de restauración de coral del país. Es el ÚNICO dato que solo vivía en la sección «Diferenciadores», eliminada en este mismo commit por redundante — se rescata aquí, en la línea que era la más débil, y encaja con la 1ª foto del collage (el vivero). El topónimo va en gris y solo el top-3 en `fuerte`, así la línea mantiene sus 2 segmentos resaltados y no rompe el ritmo gris/negro. Copy portado de datos.js, no inventado.\n\nCORRECCIONES v1 DEL CLIENTE (2026-07-20, correcciones-v1-cliente/planes/01-home.md slides 5 y 7). DOS cambios grandes en esta sección. (1) EL COLLAGE SE VA, ENTRA EL VIDEO: donde vivían las 3 fotos apiladas con su hover de grupo ahora va el video promocional del cliente — el MISMO que se auto-abría en el popup de bienvenida que el slide 2 manda eliminar («a Fernando le gusta mucho ese video»). El collage entero (.collage, .collage-foto, el hover con :has(), los tokens --collage-foto-* y EXPERIENCIA_FOTOS) se BORRÓ en el mismo commit: un token que nadie usa es una variable de Figma que miente. Para recuperarlo, `git revert` de ese commit. La referencia que puso el cliente (six2eight.com) incrusta el video en un mockup de portátil — eso NO se copió: es idioma de agencia SaaS, no de charter premium. El video hereda el passe-partout blanco + --shadow-foto-real + la rotación irregular que tenían las fotos, así que el gesto artesanal de la sección se mantiene. (2) EL TEXTO SE REVELA PALABRA A PALABRA (ref. del cliente: getblue.com), no ya frase a frase: cada palabra es un <span>.exp-palabra que GSAP enciende escalonado con scrub. El estado APAGADO (--exp-palabra-apagada) es el de reposo en CSS y no al revés — así, sin JS (reduced-motion, ?dev-exp=estatico, o si GSAP no engancha), el párrafo se ve ENTERO y legible, nunca a medio encender.',
        states: [
          {
            label: 'Sección asentada (sin reveal)',
            kind: 'variante',
            to: '/?dev-exp=estatico',
            note: 'Congela el reveal de scroll (GSAP) en su estado FINAL — texto completamente encendido (todas las palabras a opacidad plena) y el video ya asentado a su tamaño definitivo. Es EL frame que viaja a Figma (a Figma no va animado, igual que el ticker o el CTA del hero). Coincide con lo que ve quien tiene prefers-reduced-motion.',
          },
        ],
      },
      {
        title: 'Grid de tours',
        route: '/',
        status: 'done',
        description:
          'v3-F20 (pedido de Samuel, 2026-07-15): el escaparate pasa de 4 cards a los 3 productos con galería propia (Semi-Privado, Snorkel Lovers, Charter Privado — como la web original). Isla Saona sale del grid (no tiene galería, precio ni aforo); sigue viva en ticker, megamenú de Tours, footer y menú móvil. La FOTO se hace protagonista: cada card es ahora un CARRUSEL (ui/carrusel-imagenes.tsx) con 5 fotos reales de la galería del servicio que deslizan solas cada --carrusel-intervalo (4s) y, al hover, se PAUSAN y sacan flechas ‹/› para pasarlas a mano; los puntos van siempre visibles (nav en táctil). Debajo, anatomía de la ref. soft-UI: título + precio "desde", descripción (2 líneas), fila de meta con iconos lucide (rating, duración, aforo), chips de "incluye" (portados verbatim de datos.js) y CTA navy ancho "Ver tour". La card deja de ser un <a> (el carrusel mete botones, que no pueden anidarse en un enlace): es un <article> con "stretched link" en el CTA (after:inset-0) para que toda la card —salvo el carrusel, que va en z-20— navegue. Conserva el hover de GRUPO de v3-F17.2 (:has(): la card en hover crece/rota, las demás se apagan) y la sombra difusa. Con prefers-reduced-motion el auto-avance se apaga (WCAG 2.2.2); las flechas/puntos siguen.',
        states: [
          {
            label: 'Carruseles congelados (1ª foto)',
            kind: 'variante',
            to: '/?dev-tours=estatico',
            note: 'Apaga el auto-avance de los 3 carruseles y los deja en su primera foto → frame limpio para Figma (a Figma no va animado, igual que el ticker o el CTA del hero). Coincide con lo que ve quien tiene prefers-reduced-motion. Las flechas/puntos siguen funcionando a mano.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Argumentos',
    screens: [
      {
        title: 'Why-direct (banner de boletos que se recoge)',
        route: '/',
        status: 'done',
        description:
          'La comparación aquí-vs-portal hecha OBJETO — dos boletos con EL MISMO encabezado (Semi-Privado Premium · desde US$ 99, de data/home.ts): el del portal se acaba en el precio (ranuras vacías que se desvanecen — «El mismo tour. Nada más.»); el directo sigue sumando — los 4 beneficios + el reembolso como 5 líneas "impresas", sello «Reserva directa» estampado y código de barras (idéntico en ambos: es el mismo producto). v3 «banner que se recoge» (Samuel, 2026-07-15): la escena vive DENTRO de un banner con foto de playa de fondo (hero-catamaran-1) + overlay navy en gradiente (más oscuro a la izquierda, donde va el texto blanco). A la IZQUIERDA el título + descripción + CTA coral «Ver disponibilidad»; a la DERECHA los dos boletos, que SOBRESALEN del banner por arriba y por abajo. El banner arranca a SANGRE (100vw, más alto, esquinas rectas) y al scrollear hasta centrarse se CONTRAE a una caja compacta con esquinas redondeadas — GSAP anima max-width/border-radius/padding-block con scrub (use-why-direct-scroll.ts + tokens --spacing-banner-*); el estado COMPACTO es el natural/estático (el que viaja a Figma). v3.1 (misma sesión, feedback de Samuel): 4 ajustes. (1) El banner COMPACTO deja de acatar --container-contenido (excepción a propósito de esta sección) — ocupa TODO el ancho disponible, con solo 20px de aire lateral en móvil / 40px en desktop (--spacing-banner-margen-movil/-margen); el ancho SANGRE también se computa a mano en el hook (no se deja que GSAP lea max-width del CSS: con un calc(100% - X) de por medio, GSAP detecta mal la unidad y interpola en % en vez de px — bug real encontrado y corregido, verificado con los valores numéricos del tween en cada punto del scroll). (2) La escena de desktop vuelve al STACK: portal más chico (--spacing-boleto-ancho-banner-fondo, 256px vs. 368px del directo) y sin flex-1 que lo estire — se ve más bajo, natural; el directo lo tapa con un solape (--spacing-boleto-stack-solape, margin-left negativo) y el portal arranca más abajo (--spacing-boleto-stack-caida). (3) Se quita el link «Ver la comparación completa». (4) El corte de la perforación pasa a ser un CORTE REAL: `.boleto` (rotate + shadow, sin recortar) y `.boleto-superficie` (fondo/borde/contenido) son DOS capas — la superficie lleva un mask-image de dos radial-gradient (uno por borde lateral) con mask-composite:intersect, que perfora agujeros de verdad mostrando lo que hay DETRÁS del boleto (el banner, o el otro boleto si se solapan) en vez del círculo opaco anterior. La posición vertical del corte (--boleto-notch-y) la mide JS (boleto-reserva.tsx, offsetTop de .boleto-perforacion, ya en su sitio correcto por flujo normal) y la escribe como custom property — mismo reparto "JS mide, CSS pinta" que el dock del ticker y el notch del header. En móvil/tablet (no caben 2 boletos ni 2 columnas) el título va arriba y un toggle [En un portal | Aquí] alterna el CUERPO de un solo boleto — el encabezado idéntico hace que el precio NO se mueva al cambiar. ⚠️ La sección lleva z-index alto para tapar el catamarán de «Incluye», que asoma desde arriba de su sección y la invadiría. ⚠️ Microcopy nuevo pendiente de reconciliar con datos.js: «En un portal» / «Reservando directo» / «Aquí» y «El mismo tour. Nada más.».',
        states: [
          {
            label: 'Banner recogido (estado compacto)',
            kind: 'variante',
            to: '/?dev-direct=estatico',
            note: 'Congela la contracción del banner en su estado FINAL — la caja compacta con esquinas redondeadas, los boletos sobresaliendo. EL frame que viaja a Figma (a Figma no va animado); coincide con lo que ve quien tiene prefers-reduced-motion. El estado A SANGRE (100vw, esquinas rectas) solo existe en tránsito, mientras la sección entra por abajo.',
          },
          {
            label: 'Toggle móvil en «En un portal»',
            kind: 'variante',
            to: '/?dev-direct=portal',
            note: 'La variante portal del boleto con el toggle en su posición (además congela el banner compacto). Ver con el viewport en modo móvil — en desktop los dos boletos conviven a la misma altura, sin toggle.',
          },
        ],
      },
      {
        title: 'Incluye del crucero (editorial + barco que desciende)',
        route: '/',
        status: 'done',
        description:
          'v3-F19.2 (rediseño, pedido de Samuel 2026-07-15 sobre la ref. "WHAT\'S INCLUDED"): reemplaza por completo la 1ª versión (cards blancas, que Samuel rechazó). Ahora es editorial inmersiva — océano oscuro que se FUNDE con el blanco de la web arriba y abajo (Samuel pidió disolver el agua en el papel, ref. "olas rompiendo que se funden con el blanco"). La transición es ESPUMA REAL, no un degradado: Samuel rechazó 2026-07-16 el linear-gradient de la 1ª pasada ("pusiste un linear gradient, yo quiero algo más complejo") porque tenía un borde recto y matemático — en su referencia la espuma MISMA es la transición. Ahora .incluye-espuma es una capa del color --color-papel recortada por un mapa de alfa de espuma cenital (incluye-espuma-mapa.webp, Magnific): donde la espuma es densa tapa, donde se deshace en hilos y motas aparece el agua. Es máscara y no foto pegada para que el blanco salga del TOKEN y no del asset (una foto traería su propio blanco, con grano, y cantaría el parche). La banda mide --spacing-incluye-espuma (30rem/480px, no 8rem: es la escala propia de la espuma, ~4:1 a todo el ancho) y va reservada en el padding, así no pisa el texto. La banda de abajo va rotada 180°: como la toma es cenital no hay gravedad que delate la rotación, y así las dos orillas no se leen como espejo. La espuma está QUIETA — se probó derivando en bucle (mask-position, una longitud de tile exacta, como .cta-ola) y Samuel lo descartó 2026-07-16 a favor de que el movimiento lo ponga el AGUA con el scroll: espuma a la deriva + océano avanzando son dos movimientos compitiendo. El catamarán en vista cenital (PROA ABAJO, volteado en el archivo para que apunte en el sentido en que desciende) BAJANDO por el centro AL SCROLLEAR — recorrido CORTO (--incluye-barco-desde 0.1 → --incluye-barco-hasta 0.86): entra apenas asomando desde el fundido superior y se detiene apenas sumergiéndose en el inferior, sin recorrer toda la sección («el barco baja con nosotros») — y los 8 ítems como texto numerado editorial (01/ … 08/) directamente sobre el agua, SIN cajas, cascando en diagonal alternando lados junto al barco. Un gap blanco (--spacing-incluye-gap) lo separa del banner de Reserva directa (WhyDirect) de arriba. El texto va sobre el agua, así que el océano se oscurece fuerte (--color-overlay-incluye) para que el blanco lea a AA — el aqua/agua como fondo grande rompe el guardarraíl de la dirección B a propósito (decisión de Samuel, mismo trato inmersivo que el hero). Descenso + reveals enganchados al scroll (scrub, NO sticky), solo desktop; en móvil el barco abre la sección (estático) y los 8 ítems van en lista. EL AGUA AVANZA CON EL SCROLL (pedido de Samuel 2026-07-16, sustituye al autoplay en bucle): el video no se reproduce solo — su playhead se mapea al recorrido de la sección (--incluye-video-scrub), así que si nadie scrollea el agua está CONGELADA, y no hay reinicio que disimular porque no hay loop. Va además FIJO A LA VENTANA (position: sticky, 100svh, CSS puro — un pin con scrub iría con retraso y asomaría el navy por detrás). ⚠️ Ese sticky es lo que arregla la CALIDAD, que Samuel reportó mala: el video cubría la sección ENTERA (1585×3140, proporción 0.5) y object-cover lo ampliaba 2.91× recortando los lados — se veía una tira de 545px del original estirada a 1585, el 28% del frame (o sea, ~545p). Acotado a una ventana de 100svh la caja pasa a ~16:9, la forma real del video: 99% del frame a escala 0.83 (reducido = nítido). No era el códec. Assets GENERADOS EN MAGNIFIC (no stock): fondo = incluye-oceano-cenital.mp4, océano cenital turquesa Caribe (Seedance 2.0, 1920×1080, 5.04s/121 frames). ⚠️ RE-GENERADO 2026-07-16: Samuel reportó que "el barco va fluido y el océano apenas se mueve" y que "el océano se ve lejos para lo cerca que está el bote". Las dos cosas eran EL MISMO fallo de brief — la 1ª versión se pidió como "dron directamente arriba" con cameraMotion overhead, sin decir ALTURA ni pedir que el dron se MOVIERA. Salió un dron parado y altísimo: medido, el agua se desplazaba 1.0% del encuadre en 5s enteros (0.0±0.2 px/frame) — era una foto fija con temblor, no había nada que scrubbear; y las olas eran ~10× más pequeñas de lo que la escala del barco pide (el barco se pinta a 480px ≈ 13m de eslora ≈ 35px/m → el encuadre abarca ~45m, así que las crestas deben estar cada 5-10m). El brief nuevo fija las dos cosas: "dron a 35m, encuadre de ~45m, crestas cada 5-10m, el agua fluye sin parar en una dirección". Se generaron 3 candidatos (fpvDrone / truckRight / overhead) y se eligieron POR MEDICIÓN, no a ojo: overhead da 1.7px/frame con consistencia 1.00 (monótono, recorrido = neto = 42% del encuadre) y el mejor aspecto (turquesa profundo de mar abierto); truckRight movía más (90%) pero salía lavado y con pinta de bajío; fpvDrone se descartó porque recorría 57% pero solo 14% neto (consistencia 0.50 → va y viene, daría tirones al scrubbear). Lección: el fallo era el PROMPT, no el cameraMotion — el propio overhead de control ya se movía con el brief nuevo. Va RE-ENCODEADO para scrub: tal como sale de Seedance tiene UN SOLO keyframe (todo un GOP), así que buscar un instante obliga a decodificar desde el frame 0 y el scrub va a tirones. Ahora GOP=4 (31 keyframes, ≤3 frames por salto) a crf20 — se eligió frente a all-intra crf23 porque pesa menos Y tiene mejor calidad. No hace falta boomerang (la 1ª versión lo era, para tapar el corte del loop): con scrub, al subir se reproduce hacia atrás gratis. Con su poster incluye-oceano-poster.webp, que es lo único que se ve en móvil (el scrub es solo desktop; preload="none" evita bajar los 7.5MB ahí). Barco = incluye-barco-cenital.webp, recorte cenital transparente (Nano Banana Pro con referencia a las fotos reales del catamarán — hero-catamaran-2.webp + catamaran-recorte.webp — para mantener el mismo barco, + remove-background, luego volteado a proa abajo). Espuma = incluye-espuma-mapa.webp, mapa de alfa para la transición con el papel — se generó como foto CENITAL de espuma blanca sobre agua casi negra (Nano Banana 2), porque la luminancia de esa foto YA es el mapa que hace falta; luego se pasó a alfa con curva de contraste + rampas que fuerzan el borde exterior a 100% opaco (si no, se ve un velo gris de mar contra el papel) y el interior a 0. Reemplazan al video del hero y a catamaran-recorte.webp (vista 3/4) que se usaban como placeholder. ⚠️ RE-GENERADO 2026-07-16 (2ª vez, v6 = el actual): Samuel trajo una REFERENCIA de la textura que quiere (agua teal profunda, rizado denso y UNIFORME en todo el encuadre, sin espuma) y dos quejas: "se ve muy lejos" y "las olas van de lado — deberían ir de abajo hacia arriba, para que el barco avance y deje las olas atrás". Lo segundo es geometría: la PROA apunta abajo, así que el agua debe SUBIR en pantalla. La referencia se tradujo a números (densidad / uniformidad / %espuma, medir-textura.py del scratchpad) y por el camino cayó el culpable de fondo: --color-overlay-incluye estaba al 66% (11.6:1 de contraste cuando AA pide 4.5:1) y se comía 2/3 de la textura del agua — bajado a 30% (6.8:1 en el peor caso p99 = crestas iluminadas). El v6 se generó con el prompt ganador de textura ("hammered metal", teal) + ALTITUD BAJA explícita (~15m — el fix del "muy lejos") + cameraMotion moveUp (Seedance 2.0); salió con el agua bajando y se volteó con vflip en el re-encode (el agua cenital no delata el espejo): vertical puro (dx=0), 11% de recorrido, densidad 11.73 (el doble del v5), 0.04% espuma, sin intrusos. Pesa 10.8MB — la textura densa come bitrate (el "7.5MB" de arriba quedó atrás); si pesa demasiado se recorta crf o duración. ⚠️ v7 (2026-07-16, el asset ACTUAL): Samuel dio por bueno el agua ("me gusta el video") pero reportó 2 cosas — "no se está reproduciendo de manera fluida con scroll" y "el bote debe llegar un poco más abajo, como que se queda atrás llegando al final del scroll". NINGUNA era lo que parecía. (1) FLUIDEZ: no era el scrub ni el códec — medido con requestVideoFrameCallback, la maquinaria ya presentaba 58.5 fps reales al arrastrar, y el asset no iba y venía (consistencia 1.00). El cuello era la resolución TEMPORAL: 121 fotogramas (5.04s a 24fps) repartidos en los 2240px del sticky = 18.5px de scroll por fotograma, así que scrolleando a 400px/s el video corría a 21fps (los scrub buenos van a 2-5px/fotograma). No había fotogramas que enseñar. Arreglado interpolando el asset a 60fps (ffmpeg minterpolate mci+aobmc+vsbmc) → 298 fotogramas, 7.5px cada uno, 51.8 fotogramas DISTINTOS/s medidos a 400px/s. Salió GRATIS: mismo peso (10.8MB) y misma resolución (1920×1080) que el de 24fps, porque los fotogramas inventados son casi idénticos a sus vecinos y comprimen a nada — crf23 paga el resto y es indistinguible del crf20 anterior (medido: −0.3% de detalle en recorte 1:1 del mismo instante, densidad 11.53 vs 11.67). De regalo, la búsqueda bajó de 20.9ms a 14.6ms (a 60fps los fotogramas del GOP se parecen más y decodifican más barato). El nº de fps del asset es ahora un TOKEN (--incluye-video-fps) porque el hook lo necesita para saber cuánto es medio fotograma. (2) EL BARCO: el token --incluye-barco-hasta no era el culpable — el descenso corría por un RANGO de scroll distinto al del agua ("top bottom"→"bottom top", 4040px, contra los 2240px del sticky). Al pararse el agua el barco iba solo por el 78% de su recorrido y ya se había ido POR ARRIBA de la pantalla (medido: centro en -183px, 60px visibles de 486). Y como el barco va en coordenadas de la SECCIÓN y el agua fija a la VENTANA, lo que se ve es la RESTA de velocidades: con 4040px daba -0.41px/px (el barco SUBÍA por la pantalla adelantando al agua, que sube 0.079px/px — navegaba hacia su propia popa, justo al revés del efecto que se busca). Cuadrado el rango al del agua da +0.065px/px: el barco baja despacio mientras el mar le corre por debajo. Trayectoria medida: centro 314 → 490px, siempre visible entero, la proa entrando en la espuma de abajo. ⚠️ RESIDUO CONOCIDO: el banner de WhyDirect (arriba) se CONTRAE al scrollear, así que la sección sube ~112px respecto a donde ScrollTrigger cacheó sus marcas → el agua y el barco van un 5% por detrás del sticky de CSS (el agua se queda quieta los primeros ~112px y acaba al 95%). Barco y agua comparten rango, así que van sincronizados ENTRE SÍ y no se nota; si algún día molesta, el arreglo es refrescar ScrollTrigger con el layout ya asentado. ⚠️ v3-F19.3 (2026-07-16, Samuel: "quiero que mejoremos el diseño de lo que hay"): 3 cambios. (1) BARCO MÁS GRANDE: --spacing-incluye-barco-alto 30rem→36rem (480→576px; a ~0.54 de proporción son 309px de ancho, sigue holgado en el carril de 384), móvil 17→19rem. (2) TÍTULO: centrado en el carril del barco A PROPÓSITO (antes iba acotado a la izquierda justo para esquivarlo) — el catamarán le pasa literalmente por ENCIMA al scrollear (mismo z-index, el <img> va después en el DOM → pinta encima; las letras se leen a través de las redes del trampolín, translúcidas en el recorte). Tamaño propio --text-incluye-titulo (4.25rem/2.25rem — no reusa --text-h2: aquí el título es parte del PAISAJE, no un rótulo) y "efecto sobre el agua" con mix-blend-mode (--incluye-titulo-mezcla: screen) + color aqua-claro: elegido en A/B de captura contra overlay/soft-light/color-dodge/blanco — overlay y soft-light se APAGAN sobre agua oscura (su fórmula usa el fondo, y con fondo oscuro multiplica), screen solo aclara → letras luminosas con el rizado del video pasando por DENTRO, y como el agua avanza con el scroll el efecto se anima gratis. Sin text-shadow en el título (la sombra entraría en la mezcla). En Figma la mezcla es el blend mode de la capa de texto, 1:1. (3) ÍTEMS: muere el "01/" pequeño con slash (Samuel: "los números tienen un slash por alguna razón… no me convencen") → numeral FANTASMA: grande (--text-incluye-numero 4rem/2.75rem, weight 700), translúcido (aqua-claro rebajado al 40% con color-mix — sigue siendo el único acento de color), en su propia línea y con el título MONTADO encima por margen negativo (--spacing-incluye-numero-solape 1.75rem) — el solape es lo que los funde en una sola pieza tipográfica; aria-hidden (decoración). El aqua cierra así la historia del acento en la sección: eyebrow, numerales y título — todo lo que "toca el agua". ⚠️ v3-F19.4 (misma sesión, Samuel: "los textos de lo que incluye sea más grande, sobre todo el título y descripción, que sea bastante más grande"): título del ítem 22px→36px desktop (18px→24px móvil más discreto para no desbordar la columna estrecha), descripción 14px→19px desktop (17px móvil) — tokens propios (--text-incluye-item-titulo/-texto), NO reusan --text-h3 ni text-sm de Tailwind porque esos se comparten con cards de toda la web; subirlos ahí habría movido cosas que Samuel no pidió tocar. El numeral fantasma y su solape suben en la misma proporción (64px→72px, 28px→32px de solape) para que la pieza título+numeral siga leyéndose fundida y no se desequilibre con el título ahora mucho más grande. --spacing max-width de .incluye-item sube de 22rem a 28rem: a 22rem el título de 36px envolvía en líneas cortas y feas.',
        states: [
          {
            label: 'Sección asentada (sin scroll-reveal)',
            kind: 'variante',
            to: '/?dev-incluye=estatico',
            note: 'Congela la sección ENTERA, agua incluida: ítems visibles, barco a media sección (--barco-y: 0.45) y el océano en su poster (incluye-oceano-poster.webp). Es EL frame que viaja a Figma (a Figma no va ni animado ni en video). Coincide con lo que ve quien tiene prefers-reduced-motion. Ya no hace falta pausar el video a mano: desde que el agua avanza con el scroll en vez de reproducirse sola, sin GSAP enganchado se queda quieta por sí misma — por eso el antiguo ?dev-incluye=poster se eliminó (hacía exactamente esto mismo).',
          },
        ],
      },
      {
        title: 'Reviews',
        route: '/',
        status: 'done',
        description: 'v6: header centrado (eyebrow + h2 «4.9 de 5 en 1.782 reseñas» arriba de las 2 columnas). Layout 2 columnas en mismo alto (items-stretch): izquierda = video del cofundador con gradient overlay (from-navy/85 via-navy/40 to-transparent) + texto blanco abajo-izquierda con la frase atribuida. Placeholder = hero.mp4 (asset real de la marca — cuando llegue un video del cofundador hablando a cámara, se cambia solo el src). Derecha = carrusel STEP-based (NO ticker continuo): avanza 1 slot, espera 5s, avanza otro. Pista duplicada 2x + wrap invisible (setTimeout + doble rAF salta a posición 0 sin transition, reviews.tsx). Cada card de testimonio: caja gris (bg-papel-hueso, sin borde, sin sombra, **overflow-hidden** para recortar la comilla en el propio borde) con comilla decorativa de fondo (font-serif, **text-[28rem] (448px — más grande que la versión anterior de 21rem)**, text-navy/5, **top-right** con `right-8` = 32px del borde derecho, **margin negativo hacia arriba más suave: -top-4 / lg:-top-6** — la comilla ya no "asoma" tanto, vive más integrada al card, absolute, pointer-events-none + select-none + aria-hidden — no seleccionable, indica visualmente que es un quote sin competir con el texto), texto del testimonio arriba full-width con &ldquo;…&rdquo; inline, y bottom 3 sub-columnas (foto con iniciales en aqua-tint | nombre + plataforma/fecha | 5 estrellas con text-estrella a la derecha). El video llena toda la altura de su columna (mismo alto que el carrusel). El link "ver más" NO apunta a Viator (NOTAS["home-reviews"]) pero sí a TripAdvisor y Facebook. Constantes del carrusel en tokens.css: --reviews-step-intervalo (5s), --reviews-step-transicion (700ms), --reviews-card-alto (18rem), --reviews-step-gap (1.5rem).',
        states: [
          {
            label: 'Slider pausado',
            kind: 'variante',
            to: '/?dev-reviews=pausado',
            note: 'Congela la animación del slider → frame limpio para Figma. Misma mecánica que ?dev-ticker=pausado.',
          },
        ],
      },
    ],
  },
  {
    title: 'Home — Cierre',
    screens: [
      {
        title: 'Equipo (teaser)',
        route: '/',
        status: 'done',
        description:
          'CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slide 15: «agregar sección del equipo»). Sección NUEVA entre WhyDirect e IncluyeCrucero — la zona de «por qué nosotros»: justo después de argumentar por qué reservar directo, la home enseña CON QUIÉN estás hablando. Es un TEASER a propósito, no la sección completa: el equipo con nombre, la tripulación a bordo y la flota ya viven en /nosotros, y duplicar los 3 bloques dejaría dos sitios que corregir cada vez que el cliente cambie un cargo. Aquí van las 3 personas + un CTA a la página.\n\nEL DATO ES NUEVO Y VIENE DEL CLIENTE: hasta ahora el proyecto NO podía tener equipo nominal — data/nosotros.ts lo decía explícitamente («el cliente no ha dado esos datos; inventar un "Capitán José" sería fabricar contenido»). Las maquetas de estas correcciones traen por fin nombres y cargos (Omar fundador/director, Lola tour leader manager, Eva atención al viajero), así que el bloqueo se levanta. Fuente única: EQUIPO en data/nosotros.ts, que alimenta TAMBIÉN la card de persona de Contacto y el bloque de equipo de /nosotros.\n\n⚠️ PENDIENTE DE CONFIRMAR ANTES DE PUBLICAR: son personas reales y tanto los cargos como las quotes salieron de una maqueta hecha con IA, no de un documento del cliente. Y no hay retratos: se pintan iniciales en círculo (mismo placeholder honesto que las reseñas, que tampoco tienen foto de cliente por privacidad).',
        states: [],
      },
      {
        title: 'Reels sociales (Instagram + TikTok)',
        route: '/',
        status: 'wip',
        description:
          'CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slides 8-9: «sección instagram y tiktok»). Sección NUEVA entre EventosEspeciales y Contacto — la posición exacta que le da la maqueta del cliente. Carrusel horizontal de cards verticales 9:16 con scroll-snap (.reel-pista / .reel-card en componentes.css, tokens --spacing-reel-* / --reel-*).\n\nEL COMPONENTE ES COMPARTIDO: vive en components/ui/reels-sociales.tsx, no en home/, porque cubre DOS peticiones con una sola pieza — esta sección y la fila «Video Corporativo + Reel 1/2/3 Clientes» que planes/02-producto.md slide 6 pide en la ficha de tour. En Figma es UN componente con dos usos, no dos parecidos que haya que mantener sincronizados.\n\n⚠️ NO ES UN EMBED EN VIVO de Instagram/TikTok, y es deliberado: los widgets oficiales meten un script de terceros, imponen su propio look (que pelea con Charter Premium) y rompen el «cero librerías» de la home. Esto es un carrusel CURADO. Si el cliente quiere feed automático es otra decisión, con su coste visual.\n\n⚠️ STATUS WIP — FALTAN LOS ASSETS. Hoy cada reel se pinta con una FOTO REAL de las galerías del cliente haciendo de cartel y `video: null`; cuando lleguen los reels de verdad solo cambia el dato. NO se pintan contadores de vistas: la maqueta los traía («45,2 mil», «120 mil») pero se los inventó su IA, y no tenemos analítica de sus redes. Tampoco se copian los handles de terceros de la maqueta (@maria.travels, @carlos.rd): son cuentas de clientes que nadie ha verificado que existan ni que hayan dado permiso.',
        states: [],
      },
      {
        title: 'Prueba social (reserva reciente)',
        route: '/',
        status: 'wip',
        description:
          'CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slide 19: «agregar pruebas de compra», con la captura de un badge tipo "Last reservation: 50 minutes ago"). Aviso flotante abajo-izquierda que aparece tras 8s, dura 6s y rota entre tours. Cerrable (y al cerrar no vuelve en la sesión). Solo desktop: en móvil taparía el CTA sticky de reserva del hero.\n\n⚠️ STATUS WIP — SON DATOS DE EJEMPLO, Y EL AVISO LO DICE EN PANTALLA. No hay motor de reservas conectado (xpotours sigue pendiente del cliente), así que no existen reservas reales que mostrar. Inventarse un feed y presentarlo como real es justo lo que este proyecto no hace, y tratándose de un dato de VENTA sería además engañoso — por eso la card lleva un «Dato de ejemplo» visible. Cuando el motor esté conectado se cambia la fuente, se quita esa marca y el componente no se toca.\n\n⚠️ DECISIÓN ABIERTA PARA SAMUEL: el patrón de urgencia social es de manual de growth y la dirección del proyecto es «Charter Premium» — un hotel de lujo no te dice «¡3 personas están viendo esto!». Si el tono no encaja, se borra el componente y su línea en home.tsx; no tiene más dependencias.',
        states: [
          {
            label: 'Aviso visible',
            kind: 'overlay',
            to: '/?dev-prueba=visible',
            note: 'Fuerza el aviso montado y quieto, sin esperar los 8s del ciclo ni que se vaya a los 6s → frame limpio para Figma.',
          },
        ],
      },
      {
        title: 'Eventos especiales (acordeón de hover)',
        route: '/',
        status: 'done',
        description:
          '2026-07-17 (pedido de Samuel): sección NUEVA entre Reviews y Contacto — replica la vitrina de 4 boxes que la home actual (hispaniolaaquaticadventures.com/index.php) tiene al final de la página (Birthdays/Weddings/Anniversaries/Bachelor Experience, traducidos y condensados a data/home.ts → EVENTOS_ESPECIALES). 2ª vuelta (Samuel): pasa de ir justo antes del Footer a vivir aquí — separa mejor el bloque de confianza (reseñas) del bloque de conversión/cierre (contacto + FAQ + footer); de paso, las cards suben de 416px a 512px de alto ("un poco más altas"). Desde lg: fila flex a igual tamaño (--spacing-eventos-especiales-alto) con acordeón de HOVER (ref. visual de Samuel: paneles de destino tipo "London/Paris/New York" que se expanden) — al posar el ratón sobre un box, ESE crece (flex → --eventos-especiales-hover-flex) y los otros 3 se adelgazan (--eventos-especiales-reposo-flex) y su contenido (título/descripción/CTA) se desvanece a opacity 0. Mismo idioma `:has()` que .collage de Experiencia (hover de grupo), pero por ancho en vez de escala/rotación — ver componentes.css. Solo con puntero real (`hover:hover` + `pointer:fine`): en móvil/tablet es un grid 2×2 fijo, sin el juego de hover, con el contenido siempre visible (no hay hover persistente táctil). Bodas es la única con landing real (`Link` a /eventos/bodas); el resto va por EnlacePrototipo, igual que la ocasión genérica de OCASIONES. Fotos PROVISIONALES de la galería de charter-privado (mismo criterio que OCASIONES).',
        states: [],
      },
      {
        title: 'Contacto (mapa + formulario)',
        route: '/',
        status: 'done',
        description:
          'Sección nueva tras Reviews (2026-07-17, pedido de Samuel — ref. visual: sección de contacto de Lumoro, adaptada a tokens Hispaniola). Reemplaza a la galería photo-stack que vivía en «Galería + FAQ + cierre» (la galería completa sigue en prototipo/). Mapa a la izquierda (iframe de Google Maps SIN API key, coordenadas fijas 18.669740,-68.401262, esquinas --radius-card-grande, alto reservado en móvil vía --spacing-contacto-mapa-movil para evitar CLS) + formulario a la derecha (Nombre/Email/Mensaje, SOLO PROTOTIPO sin backend — mismo criterio que inicializarFormularioDemo del prototipo/app.js) + 4 cards de contacto debajo (WhatsApp/Teléfono/Email/Oficina, iconos lucide en círculo aqua-tint). Datos canónicos NUEVOS dados por Samuel 2026-07-17 (no existían en el prototipo): dirección "C. P.º del Sol, Punta Cana 23500, RD." y correo "info@catamarantourspuntacana.com"; el resto (WhatsApp, toll-free, horario, la advertencia "no vengas aquí") portado verbatim de renderContacto (prototipo/app.js:1693-1722). Todo centralizado en data/home.ts (CONTACTO).',
        states: [
          {
            label: 'Formulario enviado (demo)',
            kind: 'estado',
            to: '/?dev-contacto=enviado',
            note: 'Muestra la confirmación "Recibimos tu mensaje…" sin tener que enviar el form a mano → frame limpio para Figma.',
          },
        ],
      },
      {
        title: 'FAQ centrado (AlignUI)',
        route: '/',
        status: 'done',
        description:
          'Reemplaza el layout 2 columnas de «Galería + FAQ + cierre» (2026-07-17, pedido de Samuel): sin fotos, solo el acordeón centrado (ref. visual: FAQ de Praxa) — eyebrow + titular grande centrados, acordeón a max-w-3xl (768px), primera pregunta abierta. Primera pieza de AlignUI en la home (el Accordion — antes AlignUI vivía solo de la ficha de tour hacia dentro; CLAUDE.md actualizado con la excepción). Mismo componente y misma conducta que tour/faq-tour.tsx (single + collapsible, +/− del sistema). 6 preguntas curadas de FAQ_CATEGORIAS (prototipo/datos.js, 6 categorías/14 preguntas — una por categoría) + enlace "Ver todas las preguntas →" al prototipo. Datos en data/home.ts (FAQ_HOME).',
        states: [],
      },
    ],
  },
  {
    title: 'Ficha de tour',
    screens: [
      {
        title: 'Ficha de tour (plantilla)',
        route: '/tours/semi-privado',
        status: 'done',
        description:
          'La página donde se reserva (PLAN-TOURS.md). UNA plantilla data-driven para los 4 productos: el mismo layout, y el widget + las secciones que cada modo de `booking` puede sostener honestamente. En Figma es UNA página con frames de variante, no 4 diseños. `ScrollAlNavegar` (React Router no resetea el scroll al cambiar de ruta). Datos en data/tours.ts, portados verbatim de prototipo/datos.js — solo lo que home.ts no tiene ya. Anatomía: HERO compartido con la home (PLAN-INTERNAS-V2.md §C1, internas/hero-interna.tsx) — mismo box redondeado + Header variante `sobreVideo` sobre el video de marca (hero.mp4, el mismo de la home), COMPACTO; dentro, la cabecera (migaja, H1 en --text-h2, rating con estrellas fraccionales, chips por modo) en blanco, alineada al mismo max-w-contenido que el resto de la página (iteración 2026-07-17, 2ª vuelta — la 1ª versión de ese mismo día usaba padding plano y desalineaba el título contra el resto del contenido; Samuel: "no me gusta nada") · nav de anclas sticky, pegada al hero · sobre --color-fondo-ficha (§C2), cada bloque su propia card blanca (BLOQUE_FICHA) EXCEPTO el mosaico de fotos, que abre la columna sin envoltorio blanco (internas/galeria-mosaico.tsx: 2×2 de fotos reales del tour + lightbox, con la quote destacada flotando sobre la 1ª celda) — descripción + comparador anti-OTA + WIDGET STICKY · itinerario · incluye · menú · opiniones (§C3: resumen + MARQUEE infinito de reseñas, sin salida a ningún sitio — ni Viator ni ya TripAdvisor) · FAQ, ya a columna entera (§C4) · fuera del gris, «También te puede gustar» a ancho completo (§C4, internas/tambien-te-gusta.tsx: boxes grandes en fundido con el tour relacionado) · barra móvil fija. Los fixes de conversión que cablea (analisis/revision-wireframes.md): precio ancla SIEMPRE Light y Premium solo como delta «+US$ 15» (1.1, anti bait-and-switch) · franja anti-OTA bajo el widget, donde ocurre la comparación (1.6) · barra móvil (2.3). El widget es sticky junto a TODO el contenido, no solo junto a la descripción: en desktop no hay barra móvil, así que si se fuera, el visitante leería el menú y el itinerario —donde se convence— sin un CTA a la vista. Lo que NO se inventa: sin «quedan N» en los horarios (haría falta que el motor exponga el aforo), sin barras de distribución de reseñas (no existe el dato), y el mapa de la ruta del wireframe no tiene asset → foto real provisional. El funnel de reserva y el listado /tours NO son parte de este build: siguen bloqueados por la decisión del motor xpotours (pendiente del cliente). ⚠️ REDISEÑO del widget (2026-07-17, pedidos sueltos de Samuel en la misma sesión): (1) Personas pasa de Select a stepper "− N +" (CompactButton de AlignUI, componentes.tsx). (2) Precio del encabezado en una frase humana ("Desde US$ 99 por persona", estilo Viator) en vez de fragmentos ("US$ 99 /persona · desde"). (3) Toggle Light/Premium: se quita el eyebrow "Elige tu paquete" (se lee solo) y se rebaja su peso a un segmentado tipo iOS — thumb BLANCO puro (no relleno navy) sobre pista un punto más oscura (bg-linea), texto navy en el activo y atenuado en el inactivo; competía con la fila de horario. (4) Fecha deja de ser una tira de 14 chips con scroll horizontal: ahora es un calendario MENSUAL real (grid de 7 columnas, navegación de mes con flechas, calendario-widget.tsx) — y ese calendario, a su vez, deja de estar siempre visible y se colapsa a un campo compacto tipo input (mismo alto que Personas) que abre el grid en un POPOVER al tocarlo, para que el widget entero quepa en pantallas de laptop. (5) Horario pasa de Select a chips LIGEROS (tinte navy/10 + ring, no relleno navy) que aparecen SOLO tras elegir fecha (fade+slide corto) — deroga la decisión previa de dejarlos siempre visibles: aunque ficha.horarios no depende del día, el modelo mental de una reserva es fecha → hora, y mostrar la hora antes hacía que compitiera con la fecha y se leyera "roto" (feedback de Samuel). Revelarlos bajo el calendario ya elegido hace la secuencia obvia ("qué tocar primero") y baja el alto inicial. De la mano, la Fecha gana jerarquía de ENTRADA primaria: icono en aqua + anillo aqua suave de "empieza aquí" mientras está vacía (calendario-widget.tsx). (6) La caja del widget baja su padding propio (ya no comparte el p-6/sm:p-8 de BLOQUE_FICHA con itinerario/incluye/menú/opiniones/FAQ — esos 5 bloques de texto largo siguen igual). (7) Las 3 garantías del pie (depósito/cancelación/reembolso) pasan de lista vertical a un marquee horizontal infinito (mismo mecanismo que el de Opiniones) para bajar el alto. (8) Stepper de personas con feedback de click (2026-07-17, pedido de Samuel: "cuando se suma o resta como que no se nota, hay que agregarle sensación de interacción"): los botones −/+ escalan a 0.9 al apretar y se invierten a fondo navy/texto papel un instante (override via className, sin tocar el vendor AlignUI), y el número de personas PULSA al cambiar — key={personas} remonta el <span> y dispara .stepper-tick (componentes.css, 280ms ease-out: escala 1 → 1.18 → 1 + flash de color navy-sub → navy), con tabular-nums para que el ancho no salte al pasar de 9 a 10. Respeta prefers-reduced-motion. No se añade un state nuevo en el glosario: la animación es momentánea (~280ms) y solo se ve al hacer click, no es un frame congelable para Figma — el cambio queda documentado aquí para que se refleje en el traspaso del componente Stepper.',
        states: [
          {
            label: 'Hero compacto congelado',
            kind: 'estado',
            to: '/tours/semi-privado?dev-hero-interna=pausado',
            note: 'Congela el VIDEO en el poster (igual mecánica que ?dev-hero=poster en la home) — el frame que viaja a Figma (a Figma no va video, va el poster). El hero YA NO monta galería propia — el mosaico vive en el contenido, ver el estado "Galería abierta" más abajo.',
          },
          {
            label: 'Marquee de opiniones pausado',
            kind: 'estado',
            to: '/tours/semi-privado?dev-opiniones=pausado',
            note: 'PLAN-INTERNAS-V2.md §C3: congela la pista del marquee — el frame que viaja a Figma. El pool son las QUOTES reales de data/home.ts (las mismas 5 de la home); sin enlace de salida, ni a Viator ni ya a TripAdvisor.',
          },
          {
            label: '«También te puede gustar» — fundido congelado',
            kind: 'estado',
            to: '/tours/semi-privado?dev-tambien=pausado',
            note: 'PLAN-INTERNAS-V2.md §C4: sale de la FAQ (compartía columna con ella, pedido de Samuel de separarlas) y pasa a ser su propia sección a ancho completo, entre el gris de la ficha y el footer (internas/tambien-te-gusta.tsx) — boxes grandes de fotos reales del tour relacionado en fundido, con gradiente y nombre/meta encima. Congela el fundido en su 1ª foto por box, el frame que viaja a Figma.',
          },
          {
            label: 'Widget con fecha elegida',
            kind: 'estado',
            to: '/tours/semi-privado?dev-widget=fecha',
            note: 'T-F3: el widget con mañana elegido (nunca cae en uno de los 2 días agotados de ejemplo del calendario) → el CTA pasa de «Elige una fecha» (deshabilitado de verdad, no un botón gris que igual navega) a «Continuar — US$ 198» (2 personas × 99). Es el frame «widget lleno» de Figma y la prueba del cálculo. El precio ancla es SIEMPRE Light: anclar aquí en 99 y cobrar 114 en el paso 1 es el bait-and-switch que la revisión marcó como P1. El CTA no navega: el funnel sigue bloqueado por la decisión del motor xpotours.',
          },
          {
            label: 'Widget con paquete Premium elegido',
            kind: 'estado',
            to: '/tours/semi-privado?dev-widget=premium',
            note: 'Fase B (booking): el selector Light/Premium DENTRO del widget elige Premium → el precio de cabecera y el total del CTA saltan a la tarifa Premium (US$ 114/persona; 114 × 2 = US$ 228), y de paso elige mañana para que el CTA muestre el total. Sigue anclado en Light por defecto (abre en 99): Premium es un opt-in EXPLÍCITO, no un cambio a espaldas del visitante — se mantiene el guardarraíl anti bait-and-switch (§1.1). El «ahorra hasta 15%» junto al CTA son los descuentos reales (recurrente + anticipación + efectivo), mostrados SOBRE el precio de lista, no anclados en él.',
          },
          {
            label: 'Saona: sub-variante Catamarán',
            kind: 'estado',
            to: '/tours/isla-saona?dev-saona=catamaran',
            note: 'v3 (2026-07-17, Saona completo): el selector de sub-variante del widget cambia a Catamarán y se elige mañana (los tramos del catamarán son 1-30 pax grupo + 31-70 pax por persona). Es el frame de la opción con la tabla de tramos más distinta (los tramos por persona solo aparecen aquí, no en speedboat ni en fishing). Para los otros 2 sub-variantes (Speedboat, Fishing Town) no hace falta deep-link: el default es Speedboat (la más común) y los tramos son grupo-fijo hasta 9/10 pax, sin tramo por persona — visualmente muy parecidos.',
          },
          {
            label: 'Charter: Forever Teresa 30 pax',
            kind: 'estado',
            to: '/tours/charter-privado?dev-charter=forever-teresa',
            note: 'v3 (2026-07-17, charter completo): el selector de botes del widget cambia a Forever Teresa (catamarán grande, hasta 120 pax) y se eligen 30 personas + mañana. El cálculo usa el tramo 30-120 (US$ 75/pax = US$ 2.250) y muestra el frame del bote con mayor capacidad. La duración (3h/4h) y los horarios (9 AM o 3 PM) son los del Forever Teresa, distintos a los de Maite o GrandMa — el flag es la forma más rápida de ver el frame con 4 botes en el selector. La TablaPreciosCharter de la izquierda pinta la franja aqua-dark + pill «Seleccionado» en la fila de Forever Teresa (lift state up de la variante, 2026-07-17), y la cabecera del widget dice «US$ 75 por persona · 30 personas · tramo 30-120 pax».',
          },
          {
            label: 'Charter: Maite 8 pax (tramo grupo)',
            kind: 'estado',
            to: '/tours/charter-privado?dev-charter=maite-8',
            note: 'v3 (2026-07-17): Maite 8 personas cae en el tramo 1-8 «precio fijo de grupo» (US$ 625) — la cabecera del widget dice «US$ 625 por grupo» y el desglose es «Precio fijo de grupo · 8 personas · tramo 1-8 pax». Sirve para capturar el caso donde el precio NO multiplica por pax (es el único tramo no-por-persona de Maite, y el caso «para grupos chicos Maite es fijo»).',
          },
          {
            label: 'Charter: Maite 12 pax (tramo persona)',
            kind: 'estado',
            to: '/tours/charter-privado?dev-charter=maite-12',
            note: 'v3 (2026-07-17): Maite 12 personas cae en el tramo 9-19 «por persona» (US$ 99/pax) — la cabecera del widget dice «US$ 99 por persona» y el desglose es «US$ 99 × 12 personas · tramo 9-19 pax». El frame más común: bote pequeño, tramo medio, cálculo por persona × pax = total.',
          },
          {
            label: 'Charter: GrandMa 5 pax (tramo grupo)',
            kind: 'estado',
            to: '/tours/charter-privado?dev-charter=grandma-5',
            note: 'v3 (2026-07-17): GrandMa 5 personas cae en su único tramo 1-20 «precio fijo de grupo» (US$ 825) — la cabecera del widget dice «US$ 825 por grupo». Sirve para mostrar el caso de un bote con un solo tramo fijo, distinto a los demás (Santa Maria también es así, US$ 1.150 grupo).',
          },
          {
            label: 'Snorkel Lovers: familia 2 adultos + 1 niño',
            kind: 'estado',
            to: '/tours/snorkel-lovers?dev-snorkel=familia',
            note: 'v3 (2026-07-17, Snorkel Lovers tarifa dual): preconfigura 2 adultos + 1 niño + mañana para enseñar el frame del modelo dual (Adultos + Niños con icono Baby en la fila de niños). El CTA salta a 114×2 + 65×1 = US$ 343 — el total real con la tarifa dual. Sin el flag, el state es 2 adultos + 0 niños (pareja sin niños), que NO muestra la fila de Niños y por tanto no se ve el segundo stepper.',
          },
          {
            label: 'Calendario abierto (popover)',
            kind: 'overlay',
            to: '/tours/semi-privado?dev-widget=calendario',
            note: '2ª vuelta (2026-07-17, pedido de Samuel: reducir el alto del widget para que quepa en pantallas de laptop) — el campo "Fecha" se colapsó de un grid de días siempre visible a un input compacto (mismo trato que Personas: h-10, rounded-10) que abre este popover al tocarlo. Dentro, el MISMO grid mensual de antes (fondo blanco ahora que es una card flotante, no bg-papel-hueso: ya no comparte fila con el resto de campos del widget) con navegación de mes (‹ Julio 2026 ›), 3 meses de ventana de demo. Cierra solo, con Escape o clic fuera (calendario-widget.tsx) — elegir un día también cierra.',
          },
          {
            label: 'Checks del widget: ticker pausado',
            kind: 'estado',
            to: '/tours/semi-privado?dev-widget-checks=pausado',
            note: '2026-07-17, pedido de Samuel: "que estén en una fila, en un ticker infinito, para reducir el alto" — las 3 garantías (depósito 25%/cancelación/reembolso) pasan de lista vertical a un marquee horizontal en bucle (misma mecánica que el de Opiniones, pista duplicada 2x). Este flag congela la pista → frame limpio para Figma.',
          },
          {
            label: 'Galería abierta (lightbox)',
            kind: 'overlay',
            to: '/tours/semi-privado?dev-galeria=abierta',
            note: 'T-F2: el lightbox del mosaico de la columna de contenido (internas/galeria-mosaico.tsx) con la galería completa del tour (portada + galeriaCompleta). Hereda los 4 arreglos de UX de la hoja del menú móvil (scroll del fondo bloqueado guardando el valor previo, foco que entra y vuelve al disparador, Escape, click fuera) porque el problema es el mismo: un overlay modal sobre la página. Extra propio de galería: ← → pasan foto. Isla Saona NO tiene mosaico ni lightbox — no hay galería suya y no se rellena con fotos de otros tours.',
          },
          {
            label: 'Menú de anclas — activa: FAQ',
            kind: 'estado',
            to: '/tours/semi-privado?dev-anclas=ancla-faq',
            note: '2026-07-17 (pedido de Samuel): el sticky de la ficha gana un indicador deslizante — una sola barra bg-aqua-dark al pie del nav, que se anima al ancla activa con `transform: translateX(...)` + `width` (motion-safe, 300ms ease-out; con prefers-reduced-motion salta sin animar). El frame ?dev-anclas=ancla-faq congela FAQ como activa → captura limpia del indicador en su última posición. Otros ids válidos: ancla-itinerario, ancla-incluye, ancla-menu (solo en booking=completo, p. ej. /tours/charter-privado?dev-anclas=ancla-menu), ancla-opiniones — el scroll del visitante la sobreescribe en cuanto se mueva.',
          },
          {
            label: 'Menú de anclas — activa: Itinerario',
            kind: 'estado',
            to: '/tours/semi-privado?dev-anclas=ancla-itinerario',
            note: '2026-07-17: mismo flag, con la primera ancla forzada — el indicador aparece pegado al borde izquierdo del nav (mide lo mismo que el padding-x del contenedor + el offsetLeft del primer link), para verificar que el cálculo del `transform` no se desfasa al inicio.',
          },
          {
            label: 'Variante: charter (Charter Privado)',
            kind: 'variante',
            to: '/tours/charter-privado',
            note: 'v3 (2026-07-17, charter completo): booking: completo con 4 sub-variantes (Maite/GrandMa/Santa Maria/Forever Teresa), menú transversal de 7 platos + 1 add-on (lobster), tabla de precios por pax en cada bote. Antes era booking: cotizacion (sin precio, sin menú, sin widget de reserva). Sin flag: abre en Maite con 2 personas → cae en el tramo 1-8 «precio fijo de grupo» (US$ 625). Para los otros botes/tramos usar los flags dev-charter=* (maite-8, maite-12, grandma-5, forever-teresa).',
          },
          {
            label: 'Variante: consulta (Isla Saona)',
            kind: 'variante',
            to: '/tours/isla-saona',
            note: 'booking: consulta — el producto sin precio, capacidad ni galería confirmados. NO lleva chip de "Cancelación gratis": no se promete lo que no se puede sostener. Es la variante honesta; el dato sigue pendiente del cliente.',
          },
          {
            label: 'Variante: familias (Snorkel Lovers)',
            kind: 'variante',
            to: '/tours/snorkel-lovers',
            note: 'booking: completo, igual que Semi-Privado — cambia el copy (itinerario y FAQ adaptados a niños) y el precio ancla (US$ 98).',
          },
        ],
      },
    ],
  },
  {
    title: 'Reserva (funnel)',
    screens: [
      {
        title: 'Funnel de reserva (4 pasos)',
        route: '/reservar/semi-privado?paquete=light&personas=2',
        status: 'done',
        description:
          'Fase C: el funnel que el widget de la ficha abre al pulsar «Continuar». Shell propio y compacto (no el HeroInterna de marketing del resto de internas — un checkout se hace en una columna enfocada, sin megamenú ni video que inviten a salir): logo + «volver al tour» arriba, barra de pasos, y Atrás/Continuar abajo. La config viaja del widget en la URL (paquete · fecha · horario · personas) y se lee con useSearchParams. 4 pasos: (1) MENÚ por persona (cada comensal es un ACORDEÓN que se expande con CARDS de foto y elige su plato — el diferenciador «eliges tu plato» hecho pantalla; al clickar una card SOLO se marca el plato (check + ring aqua) y aparece al pie del acordeón un botón «Siguiente» que el visitante pulsa para confirmar y avanzar a la próxima persona, en vez del auto-advance previo que se sentía sin control — 2026-07-17, pedido de Samuel en la misma sesión: «que le des click a un menu y un boton en ese box se habilite y diga sigueinte y ahi si se salta al siguite tab, esto para confirmar y sientes que tu estas avanzando». La fila inferior también muestra «Seleccionado: <plato>» como confirmación explícita antes de pulsar), (2) RECOGIDA (hotel + habitación + notas), (3) CONTACTO (nombre/email/WhatsApp), (4) REVISAR + DEPÓSITO 25%. Solo para tours booking «completo» (semi-privado, snorkel-lovers); charter y Saona redirigen a su ficha. Precio de LISTA (mismo criterio anti bait-and-switch que el widget): total = tarifa del paquete × personas; depósito = 25%; saldo el día del tour (−5% en efectivo). FRONTERA: el botón «Pagar depósito» NO cobra — el motor xpotours sigue pendiente del cliente y el paso 4 lo dice con todas las letras (no se finge un cobro ni un «reserva confirmada»). noindex.',
        states: [
          {
            label: 'Variante Premium (3 personas)',
            kind: 'variante',
            to: '/reservar/semi-privado?paquete=premium&personas=3',
            note: 'La misma pantalla con la config Premium y 3 comensales: el paso 1 ofrece los 7 platos Premium y el precio/depósito reflejan la tarifa Premium. Los pasos 2-4 se ven avanzando con «Continuar» (el estado del flujo es local; no hay deep-link por paso todavía).',
          },
        ],
      },
    ],
  },
  {
    title: 'Landings de eventos',
    screens: [
      {
        title: 'Landing de evento (plantilla v2 — clon de ficha de tour)',
        route: '/eventos/party-boat',
        status: 'done',
        description:
          'UNA plantilla data-driven para las 2 ocasiones con landing propia (Bodas y Empresas/MICE — las `esLanding: true` de OCASIONES; «Eventos y party boat» va al formulario del hub, que sigue en el prototipo). En Figma es una página con frames de variante, no 2 diseños. Copy portado verbatim de renderBodas/renderEmpresas del prototipo (data/eventos.ts). Anatomía: HERO compartido con la home y la ficha de tour (PLAN-INTERNAS-V2.md §C5, internas/hero-interna.tsx) — mismo box redondeado + Header `sobreVideo` sobre el video de marca, COMPACTO; dentro, cabecera en blanco (migaja, eyebrow, H1 en --text-h2, lead, fila de confianza, CTAs), alineada al mismo max-w-contenido que el resto de la página · banda de cifras (solo empresas: pax/multi-barco/factura/seguro), ya en blanco, debajo del hero · mosaico de fotos reales de charter-privado (`evento.galeria`), ya como bloque del contenido, no incrustado en el hero (iteración 2026-07-17, 2ª vuelta — internas/galeria-mosaico.tsx, misma pieza que la ficha de tour, sin quote propia porque FichaEvento no la tiene) · formatos (3 cards foto+texto) · beneficios (mismo anatómico que IncluyeTour) + testimonio · banda de cierre navy (ancla del «Reservar» del header, #evento-cierre). Es página de PERSUASIÓN, no de conversión directa: el evento se cotiza (sin precio, sin widget, sin barra móvil) — el CTA de cotización es la frontera con el prototipo (EnlacePrototipo), igual que el funnel en la ficha. Lo que NO se pinta y por qué: la galería «Bodas reales» del prototipo (la única foto de boda real es la de la cabecera; rellenar con fotos de otros tours mentiría — mismo criterio que la galería vacía de Isla Saona) y los 6 logos «Han navegado con nosotros» de empresas (no hay logos reales de clientes). Fotos PROVISIONALES de la galería del charter privado, elegidas mirándolas (también las del hero); pendiente shooting de eventos (PLAN-v3.md §9). La home enlaza las 2 landings desde el megamenú de Eventos, el ticker del hero y el menú móvil (unión por `slug` en OCASIONES — el resto de ocasiones sigue por EnlacePrototipo).',
        states: [
          {
            label: 'Hero compacto congelado',
            kind: 'estado',
            to: '/eventos/bodas?dev-hero-interna=pausado',
            note: 'Congela el video en el poster — el frame que viaja a Figma. Mismo flag que la ficha de tour (internas/hero-interna.tsx es la misma pieza).',
          },
          {
            label: 'Galería abierta (lightbox)',
            kind: 'overlay',
            to: '/eventos/bodas?dev-galeria=abierta',
            note: 'El lightbox del mosaico de la columna de contenido (evento.galeria) — mismo flag y mismo componente (internas/galeria-mosaico.tsx) que la ficha de tour.',
          },
          {
            label: 'Formulario lleno',
            kind: 'estado',
            to: '/eventos/bodas?dev-widget-evento=lleno',
            note: 'Pre-rellena los 7 campos del widget (widget-evento.tsx) — frame de Figma con el form completo. El banner de descuento y los 3 checks de reassurance son los mismos del widget de tour.',
          },
          {
            label: 'FAQ abierto',
            kind: 'estado',
            to: '/eventos/bodas?dev-faq-evento=abierto',
            note: 'Expande el primer item del acordeón de FAQ al cargar (pages/evento.tsx) — frame de Figma con la FAQ en estado abierto.',
          },
          {
            label: 'Variante: Bodas',
            kind: 'variante',
            to: '/eventos/bodas',
            note: 'La misma plantilla con los datos de bodas: 13 fotos en el mosaico, slogan de quote sobre la foto principal ("May your Anchor be tight..."), tipo de evento FIJO a "Boda" (campo deshabilitado, no select — la URL ya lo predefine), 4 preguntas de FAQ, CTA principal "Pedir cotización de boda".',
          },
          {
            label: 'Variante: Empresas / MICE',
            kind: 'variante',
            to: '/eventos/empresas',
            note: 'La misma plantilla con los datos de empresas: 4 fotos en el mosaico (grid 2×2, no mosaico 3+4 por tener <7), banda de stats (única de esta variante), tipo de evento en select con 6 valores, 4 preguntas de FAQ, CTA principal "Solicitar propuesta" + CTA secundario "Pedir dossier corporativo (PDF)" → link a WhatsApp con mensaje pre-armado.',
          },
          {
            label: 'Página de gracias (post-envío)',
            kind: 'variante',
            to: '/eventos/bodas/gracias?reserva=COT-EVENTO-0000-0000',
            note: 'Pantalla de confirmación post-envío del formulario (pages/gracias-evento.tsx, 1 columna max-w-3xl). Lee la cotización de localStorage por ?reserva=…: check + "¡Recibimos tu solicitud, {nombre}!", código destacado, resumen del form enviado, timeline "qué sigue" (2 pasos: hoy / día antes del evento), CTA WhatsApp grande con el código pre-armado en el mensaje. Sin código en URL → redirect a /. La página se pinta con el código que se acaba de generar; este deep-link es solo ilustrativo (no hay una reserva demo como en /reservar/:slug/gracias).',
          },
        ],
      },
    ],
  },
  {
    title: 'Sostenibilidad',
    screens: [
      {
        title: 'Página de Sostenibilidad',
        route: '/sostenibilidad',
        status: 'done',
        description:
          'Página propia (2026-07-17, pedido de Samuel) que COMBINA las 2 páginas reales de la web actual: sustainability.php (intro + 3 pilares: conservación/áreas protegidas · comunidades/orfanato · operación y equipo, con los importes US$3.50/US$2.00 por huésped) y competitive-advantage.php (la frase + los 7 videos). Copy TRADUCIDO fiel del inglés (data/sostenibilidad.ts), mismo criterio que INCLUYE_CRUCERO. Adopta el HERO COMPARTIDO (PLAN-INTERNAS-V2.md, internas/hero-interna.tsx) con la home/ficha/eventos: mismo box redondeado + Header `sobreVideo` dentro; «Reservar» del header → /#tours (no se cotiza aquí). Foto de cabecera PROVISIONAL (la web vieja no tiene fotos de contenido) — pendiente fotos propias de la fundación.\n\nREDISEÑO 2026-07-17, 2ª vuelta (pedido de Samuel: "se ve muy feo ese montón de cajas... mejoralo que se vea más editorial, el texto de la descripción del hero está muy largo, puedes añadirle efecto de gsap"). 4 cambios: (1) Hero ACORTADO a una frase (data/sostenibilidad.ts §sub) — la declaración completa que tenía antes (Bávaro Reefs Foundation, "empoderar a nuestra gente", RD) no se pierde: se muda a §mision, un párrafo GRANDE (font-display, --text-narrativa — mismo tratamiento que Experiencia en la home) que ahora abre PilaresSostenibilidad. (2) Los 3 pilares dejan las cards sobre --color-papel-hueso (el "montón de cajas") por una LISTA EDITORIAL: numeral fantasma (.sost-numero — mismo truco que .incluye-numero de la home pero en versión clara, aqua muy rebajado sobre papel) con el título montado encima, separados por hairline (border-t/divide-y), sin fondo ni caja. El pilar «Operación» gana el detalle que faltaba del original ("a percentage is also allocated to our office and sales teams", ahora en el párrafo) y sus 2 cifras ($3.50/$2.00) se muestran como highlight tipográfico aparte (--text-h2, text-aqua-dark), no enterradas en el texto corrido — contenido verificado contra sustainability.php?lang=es. (3) Videos: se quita el ring-1 ring-linea de cada póster (las leía como 7 cajas idénticas). Se evaluó destacar el 1er video a doble ancho (bento asimétrico) pero varios pósters de este set son recortes verticales de YouTube Shorts con texto quemado en INGLÉS (6ixzXs68DPQ, ziUx_05VC-4, aMVg2cL3Z8o — pendiente real: pedir al cliente miniaturas en ES o recortes limpios); agrandar cualquiera de esos habría sido el defecto más visible de la sección, así que la rejilla se queda uniforme a propósito. (4) Cierre: tipografía más grande (--text-h2, antes --text-h3) como declaración final, no una card de meta más. Reveal de scroll NUEVO (use-sostenibilidad-reveal.ts): cada bloque `.sost-reveal` (misión, cada pilar, eyebrow/título/párrafo de videos, cada póster, el cierre) entra por su cuenta al cruzar el umbral — GSAP ScrollTrigger.batch, no un timeline scrub único (a diferencia de Experiencia/Incluye, esto es una lista larga de secciones apiladas, no una pieza fija con su propio ritmo). Un solo hook, llamado UNA VEZ desde la página (los `.sost-reveal` viven repartidos en 3 componentes hijos). Las constantes (--sost-reveal-*, --text-sost-numero*, --color-sost-numero) salen de tokens.css, FUENTE del prototipo de Figma — a Figma no viaja animado.',
        states: [
          {
            label: 'Video en modal (reproduciendo)',
            kind: 'modal',
            to: '/sostenibilidad?dev-video-sost=abierto',
            note: 'Abre el modal del 1er video sobre el Modal del sistema (Radix Dialog: scroll-lock, focus-trap, Escape). El iframe de YouTube (youtube-nocookie, autoplay) solo existe mientras el modal está abierto — nada de 7 embeds en segundo plano.',
          },
          {
            label: 'Sección asentada (sin reveal)',
            kind: 'variante',
            to: '/sostenibilidad?dev-sost=estatico',
            note: 'Congela el reveal de scroll (GSAP ScrollTrigger.batch) en su estado FINAL — misión, pilares, videos y cierre ya visibles, sin desplazamiento. Es EL frame que viaja a Figma (a Figma no va animado, igual que el ticker o el CTA del hero). Coincide con lo que ve quien tiene prefers-reduced-motion.',
          },
        ],
      },
    ],
  },
  {
    title: 'Páginas secundarias (Nosotros, Guías, Ayuda, Legal)',
    screens: [
      {
        title: 'Nosotros',
        route: '/nosotros',
        status: 'done',
        description:
          'REDISEÑO 2026-07-17 (pedido de Samuel: "hay que darle mucho amor y cariño a las páginas internas... la nuestra hay puras cajas, está horrible planteada"). Antes: hero + 2 bloques planos (chips de tripulación sin texto, 3 cards de flota genéricas) + cierre. Ahora, 5 bloques, portando el contenido REAL de about-hispaniola.php?lang=es que no vivía en ningún lugar del sitio (ver cabecera de data/nosotros.ts para el detalle completo de fuentes): (1) IntroNosotros — «Quiénes somos», bienvenida + diferenciador de grupos pequeños (barcos para 100+ pasajeros, pero reservan menos), texto+foto. (2) ExperienciaABordo — «Un día de mar en 3 paradas», el itinerario contado como historia (snorkel en el vivero de coral → playa desierta con coco-loco → piscina natural), 3 fotos reales con numeral 01/02/03 en aqua-dark (no la ficha oscura de --incluye-numero: esta página vive sobre papel, no sobre el océano del home). (3) CocinaFlotante — el diferenciador único ("la única empresa de excursiones de RD con cocina flotante"), su propia sección grande (mismo idioma que internas/tambien-te-gusta.tsx: foto real + gradiente + texto, sin Link). (4) TripulacionFlota — gana párrafo real de equipo (multilingüe, capacitado, seguridad) sobre los 4 chips de icono (siguen sin fotos/nombres propios — el cliente no los ha dado, inventarlos sería fabricar contenido); la FLOTA pasa de 3 cards genéricas (Catamarán A/B + cocina flotante, la versión simplificada de prototipo/datos.js) a los 6 CATAMARANES REALES CON NOMBRE PROPIO de la web actual (Santa María, Forever Teresa, Maite, GrandMa, Joker, Karaya) — 2ª vuelta del mismo rediseño, pedido explícito de Samuel: "mete toda la flota de barcos, todo el contenido que haya en la original lo metemos en la nueva". Cada barco es su propia fila foto+texto alternada (mismo anatómico que IntroNosotros) en flujo normal — sin fondo/sombra/radio, sin pin de CSS, sin hook de GSAP (la foto es la única que conserva su --radius-card-grande propio). 4ª vuelta (stacking con GSAP) y 5ª vuelta (mismo día, "quita los efectos de gsap de los barcos y haz que sean una sección estática normal, sin esos cards con sombra o borders") se cancelan mutuamente. Fotos de los 6 barcos + cocina/bar flotante DESCARGADAS de hispaniolaaquaticadventures.com/images/boats/ y /images/food/ (activos reales del cliente, mismo criterio que eco-friendly-logo.png), mapeadas a ojo contra las etiquetas de la galería real de la página. 3ª vuelta (Samuel: "no me gusta que los barcos se vean en cards, haz que cada barco sea una sección con el texto de un lado y el barco del otro, y vaya alternando el orden a medida que bajamos"): cada barco pasa de card de grid a fila foto+texto a ancho completo, alternando lado por índice (par/impar) vía `lg:order-*` — en móvil la foto siempre va primero. 4ª vuelta (mismo día, Samuel: "que estas secciones de barcos tengan el efecto de gsap de que vamos bajando con scroll y se van stackeando"): «stacking cards» — el PIN es CSS puro (.flota-barco, position: sticky; el orden de apilado sale gratis del orden del DOM, sin z-index a mano) porque un pin dirigido por JS (ScrollTrigger `pin:true`) va con retraso frente al compositor nativo (mismo criterio que el video de «Incluye»); GSAP (nosotros/use-flota-scroll.ts) solo anima el achicado (--flota-stack-escala, 0.92) y oscurecido (--flota-stack-opacidad, 0.5) de la card que va quedando tapada, enganchado al scroll de la SIGUIENTE. Cada barco vive en un envoltorio de --spacing-flota-barco-alto (90vh) que le da el "turno" de scroll antes de que el siguiente lo tape. Solo desktop (lg+, mismo criterio que .incluye-barco) — en móvil no hay sticky ni animación, las cards van en flujo normal. (5) ArrecifeTeaser — mención sin detalles + botón a Sostenibilidad, el límite de contenido con esa página se mantiene intacto (la donación/fundación no se duplica aquí). NAV_NOSOTROS.tripulacion.to sigue apuntando aquí. 5b/6ª vuelta (mismo día, 2 pedidos seguidos de Samuel: "ponle una imagen fundida de fondo para darle más diseño" → primero foto del vivero real, luego "usa otra imagen, usa una imagen de stock del océano Caribeño vista cenital" → /fotos/arrecife-fondo-cenital.webp, 2400x1200, crop 2/3 superior de la original para quedarnos solo con agua turquesa, con gradiente navy encima — la foto es decorativa, el texto ya cuenta el arrecife).',
        states: [],
      },
      {
        title: 'Guías (tips reales)',
        route: '/guias',
        status: 'done',
        description:
          'Mapea tips-for-punta-cana-snorkeling-and-sailing.php?lang=es de la web actual (HTML descargado y leído línea a línea 2026-07-17). UNA sección: TipsRapidos con las 4 preguntas evergreen — esnórquel/arrecife, vela, mar, mariscos — y enlaces reales a /sostenibilidad y /nosotros. Las otras 4 preguntas de esa página original (protocolos COVID-19: testeo, mascarilla, transporte privado) se dejaron fuera por obsoletas en un sitio relanzado en 2026, decisión de Samuel 2026-07-17.\n\nAntes la página tenía 2 bloques (TipsRapidos + ListaGuias, un índice de 5 artículos fantasma con "próximamente" al pie) — ListaGuias NO tenía contraparte en la web original y el "próximamente" sonaba raro en un sitio live. Samuel pidió quitarlo el 2026-07-17 ("la web original no dice nada de eso"). Sin ListaGuias, la página queda solo con TipsRapidos; cuando el cliente dé el copy real de futuros artículos, cada uno se monta como página aparte (mismo patrón que tours/eventos), no como tarjeta placeholder.\n\nREDISEÑO EDITORIAL 2026-07-17, mismo día que Sostenibilidad y misma queja de Samuel ("parece una página con solo cajas... más editorial, más creativa e interesante, usa animaciones GSAP de ser necesario"). Antes: 4 cards `bg-papel-hueso ring-1 ring-linea` apiladas. Ahora, mismo lenguaje que PilaresSostenibilidad (misma sesión): numeral fantasma (.guias-numero, aqua muy rebajado sobre papel — tokens propios, --text-guias-numero/--color-guias-numero, NO cruzados con los de Sostenibilidad) con la pregunta montada encima (margen negativo), separados por hairline (`divide-y`/`border-t`) en vez de fondo o caja. Cada fila es numeral+pregunta en una columna angosta junto a la respuesta (ya es prosa real y larga) en una columna ancha. Etiqueta+h2 propios (autocontenido, no depende de un wrapper en guias.tsx). Reveal de scroll (use-guias-reveal.ts): cada bloque `.guias-reveal` (eyebrow, h2 y los 4 artículos) entra por su cuenta al cruzar el umbral — GSAP ScrollTrigger.batch, igual mecanismo que use-sostenibilidad-reveal.ts (no timeline scrub: es una lista larga de bloques apilados, no una pieza fija). Un solo hook, llamado UNA VEZ desde la página.',
        states: [
          {
            label: 'Sección asentada (sin reveal)',
            kind: 'variante',
            to: '/guias?dev-guias=estatico',
            note: 'Congela el reveal de scroll (GSAP ScrollTrigger.batch) en su estado FINAL — los 4 tips ya visibles, sin desplazamiento. Es EL frame que viaja a Figma. Coincide con lo que ve quien tiene prefers-reduced-motion.',
          },
        ],
      },
      {
        title: 'FAQ standalone',
        route: '/faq',
        status: 'done',
        description:
          'Mapea frequently-asked-questions.php. Las 6 categorías / 14 preguntas completas de FAQ_CATEGORIAS (prototipo/datos.js), un Accordion AlignUI independiente por categoría (mismo vendor que home/faq.tsx y tour/faq-tour.tsx). Es la versión completa de la FAQ curada de la home (FAQ_HOME, 6 preguntas) — su "Ver todas las preguntas →" trae aquí. NAV_AYUDA.faq.to apunta aquí.',
        states: [],
      },
      {
        title: 'Agentes de viaje',
        route: '/agentes-de-viaje',
        status: 'done',
        description:
          'Mapea travel-agent-registration.php. Formulario de registro B2B (agencia, contacto, email, teléfono, mensaje) — SOLO PROTOTIPO (sin backend), mismo criterio que home/contacto.tsx. Sin comisiones ni condiciones de programa inventadas (no existen en ninguna fuente): el pitch solo usa hechos ya vetados en otra parte del sitio (factura fiscal RD/internacional, de la landing de Empresas/MICE). Enlazado desde el footer, no del menú principal (es B2B, el 99% del tráfico es turista — arquitectura-nueva.md §2).',
        states: [
          {
            label: 'Confirmación enviada',
            kind: 'estado',
            to: '/agentes-de-viaje?dev-agentes=enviado',
            note: 'Congela el mensaje de confirmación sin enviar el formulario a mano.',
          },
        ],
      },
      {
        title: 'Reserva directa (comparación)',
        route: '/reserva-directa',
        status: 'done',
        description:
          'NOTAS[\'reserva-directa\'] del prototipo + arquitectura-nueva.md §3: "el argumento no es un destino de menú" — página de SOPORTE de conversión, fuera del menú principal, enlazada desde tour/comparador-strip.tsx ("Ver comparación →") y el footer ("¿Por qué reservar directo?"). Reusa el MISMO BoletoReserva del banner why-direct de la home (2 variantes: portal/directo) pero lado a lado y ESTÁTICO — sin la animación de contracción por scroll ni el stack solapado del banner a sangre, para poder mandarla por WhatsApp y que se lea de un vistazo en móvil.',
        states: [],
      },
      {
        title: 'Contacto',
        route: '/contacto',
        status: 'done',
        description:
          'Mapea contact.php de la web actual (H1 "Contact Us" + subtítulo de ubicación + bloque teléfono/WhatsApp/email/oficina + formulario "Leave a Message"). Antes de esta página, "Contacto" del footer y del dropdown Ayuda del header (NAV_AYUDA) apuntaban a `/#contacto` (ancla de la home) — roto desde cualquier página que no fuera la home; NAV_AYUDA.contacto.to y el footer ahora apuntan aquí. Hero compartido (PLAN-INTERNAS-V2.md, internas/hero-interna.tsx) con fotos de charter-privado/hero-catamaran en fundido. El cuerpo REUSA home/contacto.tsx (mapa + formulario + 4 cards, ya existente desde el 2026-07-17) con `mostrarEncabezado={false}` — el H1 ya lo pinta CabeceraContacto, repetirlo sería el mismo titular dos veces. Dato NO portado a propósito: la dirección visible en contact.php ("Plaza Bibijagua, Punta Cana - Bavaro") difiere de CONTACTO.direccion ("C. P.º del Sol") — el propio contact.php se contradice consigo mismo (su JSON-LD usa C. P.º del Sol), así que se mantuvo el dato que Samuel dio directamente. El bloque legal "by Events & Entertainment Punta Cana LLC" (entidad de Miami, facturación) tampoco se portó — no es información de contacto al cliente.',
        states: [
          {
            label: 'Formulario enviado (demo)',
            kind: 'estado',
            to: '/contacto?dev-contacto=enviado',
            note: 'Mismo flag que la sección embebida de la home (home/contacto.tsx) — un solo componente, dos rutas.',
          },
        ],
      },
      {
        title: 'Legal (plantilla, 4 variantes)',
        route: '/legal/politica-de-cancelacion',
        status: 'done',
        description:
          'UNA plantilla data-driven (data/legal.ts) para las 4 páginas de PLAN-LANZAMIENTO.md Bloque F — la web actual no tiene NINGUNA (verificado en mapa-del-sitio.md). Política de cancelación tiene contenido REAL, compuesto de hechos ya vetados en el resto del sitio (depósito 25%, 5% cash, cancelación gratis ≥7 días, reembolso total por clima, cambio de menú ≤24h) — nada inventado. Privacidad/Términos/Cookies NO tienen fuente que portar: en vez de fabricar cláusulas legales vinculantes que nadie ha revisado, la página deja la ESTRUCTURA esperable con un aviso explícito ("borrador de estructura, no un documento vinculante — pendiente de un abogado"). ⚠️ Pendiente avisar a Samuel/Derick: estas 3 NO deben salir a producción tal cual. `noindex` en las 4.',
        states: [
          {
            label: 'Variante: Privacidad (placeholder)',
            kind: 'variante',
            to: '/legal/privacidad',
            note: 'contenidoReal: false — muestra el aviso de borrador de estructura.',
          },
          {
            label: 'Variante: Términos (placeholder)',
            kind: 'variante',
            to: '/legal/terminos',
            note: 'contenidoReal: false.',
          },
          {
            label: 'Variante: Cookies (placeholder)',
            kind: 'variante',
            to: '/legal/cookies',
            note: 'contenidoReal: false — el sitio hoy no usa cookies de analítica/publicidad (PLAN-LANZAMIENTO.md Bloque G, sin implementar).',
          },
        ],
      },
    ],
  },
]

export function devStats() {
  const screens = devSections.flatMap((s) => s.screens)
  const states = screens.flatMap((s) => s.states)
  return {
    total: screens.length,
    done: screens.filter((s) => s.status === 'done').length,
    wip: screens.filter((s) => s.status === 'wip').length,
    placeholder: screens.filter((s) => s.status === 'placeholder').length,
    states: states.length,
  }
}
