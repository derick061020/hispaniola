// ─────────────────────────────────────────────────────────────────────────────
//  [DEV-ONLY] Glosario Dev — registro central de lo construido en la home.
//
//  Regla de trabajo (playbook dev-mode-glosario-prototipo del cerebro): cada
//  bloque nuevo, y cada estado interno (menú abierto, buscador expandido,
//  variante móvil…) que se construya, SE REGISTRA AQUÍ en el mismo commit que
//  lo crea, para poder abrirlo con un clic desde el overlay de Dev Mode.
//
//  La home es una sola página ("/"): la mayoría de "pantallas" de este
//  registro no son rutas distintas sino BLOQUES de esa página, navegables por
//  query params `dev-*` que cada componente consume con `useDevFlag`. La
//  ruta `/fundaciones` sí es una página real aparte (swatches de tokens).
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
          'v3: el header vive DENTRO del box del hero (variante sobreVideo, transparente sobre el video), con la fila de logo/nav/Reservar capada a max-w-contenido (1400px — v3-F13, antes max-w-6xl/1152px). Sin topbar (WhatsApp + idioma se resuelven aparte con botones flotantes — pendiente). v3-F8: los megamenús/dropdowns ya no son cards flotantes — el notch se EXPANDE (ancho y alto, animado) y los contiene, estilo Dynamic Island. v3-F9: Nosotros/Ayuda pasan de lista de links a grid de 2 columnas con chip de icono + descripción (antes el panel angosto flotaba centrado en la caja del notch, con aire muerto a los lados); "Contacto y WhatsApp" pasa a ser "Contacto", a la página /contacto del prototipo. v3-F13: el panel de Nosotros/Ayuda sube a 624px (antes 512px) — con el notch centrado y simétrico, eso solo cabe desde lg (1024px) sin tapar el logo/Reservar; entre md y lg va una variante compacta de 448px sin descripciones (chip + título). CTA Reservar, menú móvil con acordeón, y footer de 4 columnas. v3-F15: el logo deja de ser el wordmark tipográfico "Hispaniola" y pasa a ser el LOGO REAL del cliente (langosta pirata + script), descargado de la web actual — revierte la decisión de direccion-visual.md §1, que lo había apartado de la UI por chocar con el posicionamiento premium. Va en dos variantes porque el lockup original tiene el texto en oscuro y es ilegible sobre el video: sobre el video, la versión reversed (langosta a color + texto blanco) que aporta Samuel; con el header sólido, el lockup original. 44px de alto en ambos casos.',
        states: [
          { label: 'Megamenú: Tours', kind: 'estado', to: '/?dev-mega=tours', note: 'Abre el notch expandido (v3-F8), no una card flotante. v3-F14.3: las cards se DESNUDAN (decisión de Samuel) — eran la TourCard del grid de la home encogida (marco, chip de audiencia, bloque de precio), así que el menú repetía tal cual la sección que vive media pantalla más abajo y mezclaba navegación con decisión de compra dentro de un panel que se cierra al salir el ratón. Ahora: foto grande (200×144), nombre y una línea de meta con el mismo idioma que la card del ticker («Desde US$ 99 · 4 h»; Isla Saona no tiene precio publicado → «Consultar»). Sin marco, sin chip y sin bloque de precio, + salida "Ver los 4 tours →" al catálogo. El hover es el mismo que en Eventos (zoom de foto + título en aqua): los 2 megamenús hablan por fin el mismo lenguaje.' },
          { label: 'Megamenú: Eventos', kind: 'estado', to: '/?dev-mega=eventos', note: 'v3-F14: foto editorial (galeria-charter-privado-4, con gradiente + "Pedir cotización") en la columna izquierda desde xl + lista de las 6 ocasiones con thumbnail a la derecha — antes 2 landings en cards y 4 ocasiones en texto plano con una divisoria vertical (el único megamenú sin una sola imagen). Entre md y xl la foto se oculta y queda solo la lista. v3-F14.2: el panel crece a lo ANCHO para dejar de crecer a lo ALTO (880px, el mismo ancho que el megamenú de Tours; antes 640px): las 6 ocasiones pasan a 2 columnas × 3 filas y el menú baja de ~430px a 281px de alto. La foto, que ocupa el alto de la lista, deja de ser un rectángulo de pie y queda casi cuadrada (277×248). Los thumbnails suben de 48 a 64px. El gradiente de la foto se recalculó (--color-overlay-foto): con la foto baja, el texto caía sobre las palmeras iluminadas y el casco blanco del barco. v3-F14.3: el hover de cada ocasión se hace notorio — la foto hace zoom (1.10, dentro de un marco con overflow-hidden para no comerse el gap con el texto) y el título pasa a aqua, además del fondo gris de la fila.' },
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
        title: 'Experiencia (narrativa + collage)',
        route: '/',
        status: 'done',
        description:
          'v3-F18 (pedido de Samuel): sección editorial NUEVA justo debajo de la banda de premios (que pierde su divider inferior para que fluyan como un bloque). A la izquierda, un párrafo GRANDE con palabras alternando gris (navy-sub) y negro (navy) para resaltar lo importante — SÍNTESIS del copy real de la web actual ("Punta Cana\'s most complete catamaran experience", 6 párrafos → 3 frases + cierre; pendiente reconciliar con datos.js). A la derecha, un COLLAGE de 3 fotos reales (vivero de coral, cocina a bordo, catamarán fondeado — ninguna repetida con Diferenciadores ni la galería) con borde blanco fino (--spacing-foto-real-marco) y sombra realista en 2 capas (--shadow-foto-real: contacto + ambiente), esparcidas en diagonal con rotación irregular. v3-F18.2 (Samuel): fotos a la IZQUIERDA, texto a la DERECHA (en móvil el texto va primero, lg:order lo invierte), un CTA sutil «Ver disponibilidad →» en coral (estilo enlace, no botón sólido — el color de "Ver disponibilidad" sin competir con los CTA sólidos) al pie del texto → #tours, y menos aire abajo (pb-seccion-sm) para acercarla al grid de tours. El texto y las fotos ENTRAN escalonados al hacer scroll (GSAP ScrollTrigger, scrub — enganchado al scroll, NO sticky): el texto sube y aparece; las fotos ARRANCAN más grandes y separadas del montón (radial, en opacidad 0) y CONVERGEN a su sitio encogiendo. Las constantes salen de tokens (--exp-reveal-*, FUENTE del prototipo de Figma). A Figma NO viaja animado: se captura la sección asentada. v3-F18.1 (Samuel): se retira el eyebrow «La experiencia» (no aportaba), el texto sube a 32px (--text-narrativa) y las fotos quedan más grandes y stackeadas (más juntas). Antes las fotos subían pequeñas en bloque; ahora hacen el gesto de "montón que se arma". v3-F18.3 (Samuel): hover de GRUPO en las 3 fotos — al pasar el ratón por una, esa foto sube (--collage-foto-hover-alza), crece (--collage-foto-hover-escala) y rota hacia la izquierda (--collage-foto-hover-rotacion, pisa su --rot de reposo), mientras las OTRAS 2 se achican (--collage-foto-reposo-escala) y pierden color (grayscale). Pivote abajo-centro en las 3 (transform-origin: bottom center, como el barco del CTA del hero). CSS puro con `:has()` (`.collage:has(.collage-foto:hover)`) — reacción de grupo discreta, no una curva continua por distancia como el dock del ticker, no hace falta JS. Sustituye al hover anterior (solo "enderezar" a 0deg).',
        states: [
          {
            label: 'Sección asentada (sin reveal)',
            kind: 'variante',
            to: '/?dev-exp=estatico',
            note: 'Congela el reveal de scroll (GSAP) en su estado FINAL — texto y las 3 fotos ya visibles, del tamaño y en el sitio definitivos (las fotos, juntas y stackeadas; no grandes ni separadas). Es EL frame que viaja a Figma (a Figma no va animado, igual que el ticker o el CTA del hero). Coincide con lo que ve quien tiene prefers-reduced-motion.',
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
          'v3-F19.2 (rediseño, pedido de Samuel 2026-07-15 sobre la ref. "WHAT\'S INCLUDED"): reemplaza por completo la 1ª versión (cards blancas + fundidos, que Samuel rechazó). Ahora es editorial inmersiva — océano oscuro A SANGRE (corte limpio arriba y abajo, SIN fundidos), el catamarán en vista cenital BAJANDO por el centro AL SCROLLEAR (empieza fuera del océano, por arriba, y desciende mientras aparecen los ítems — «el barco baja con nosotros»), y los 8 ítems como texto numerado editorial (01/ … 08/) directamente sobre el agua, SIN cajas, cascando en diagonal alternando lados junto al barco. El texto va sobre el agua, así que el océano se oscurece fuerte (--color-overlay-incluye) para que el blanco lea a AA — el aqua/agua como fondo grande rompe el guardarraíl de la dirección B a propósito (decisión de Samuel, mismo trato inmersivo que el hero). Descenso + reveals enganchados al scroll (scrub, NO sticky), solo desktop; en móvil el barco abre la sección (estático) y los 8 ítems van en lista. ⚠️ Assets PROVISIONALES pendientes de GENERAR EN MAGNIFIC (no stock): el fondo es el MISMO video del hero oscurecido (pedido: océano CENITAL azul Caribe) y el barco es catamaran-recorte.webp en vista 3/4 (pedido: recorte CENITAL desde el dron). Ambos se cambian con un swap de src cuando lleguen.',
        states: [
          {
            label: 'Sección asentada (sin scroll-reveal)',
            kind: 'variante',
            to: '/?dev-incluye=estatico',
            note: 'Congela el descenso y los reveals en su estado FINAL: ítems visibles y barco a media sección (--barco-y: 0.45). Es EL frame que viaja a Figma (a Figma no va animado, igual que el ticker o la Experiencia). Coincide con lo que ve quien tiene prefers-reduced-motion.',
          },
          {
            label: 'Video congelado en el poster',
            kind: 'variante',
            to: '/?dev-incluye=poster',
            note: 'Como =estatico pero además pausa el video del océano en su poster (el mismo del hero) → frame 100% quieto para Figma (a Figma no va video).',
          },
        ],
      },
      {
        title: 'Diferenciadores',
        route: '/',
        status: 'done',
        description: '"No es otro party boat": coral vivo, cocina flotante, media capacidad, cero plástico. Foto real de coral/snorkel.',
        states: [],
      },
      {
        title: 'Reviews',
        route: '/',
        status: 'done',
        description: 'v6: header centrado (eyebrow + h2 «4.9 de 5 en 1.782 reseñas» arriba de las 2 columnas). Layout 2 columnas en mismo alto (items-stretch): izquierda = video del cofundador con gradient overlay (from-navy/85 via-navy/40 to-transparent) + texto blanco abajo-izquierda con la frase atribuida. Placeholder = hero.mp4 (asset real de la marca — cuando llegue un video del cofundador hablando a cámara, se cambia solo el src). Derecha = carrusel STEP-based (NO ticker continuo): avanza 1 slot, espera 5s, avanza otro. Pista duplicada 2x + wrap invisible (setTimeout + doble rAF salta a posición 0 sin transition, reviews.tsx). Cada card de testimonio: caja gris (bg-papel-hueso, sin borde, sin sombra) con comilla decorativa de fondo (font-serif, text-[10rem], text-navy/10, top-left, absolute, pointer-events-none + select-none + aria-hidden — no seleccionable, indica visualmente que es un quote sin competir con el texto), texto del testimonio arriba full-width con &ldquo;…&rdquo; inline, y bottom 3 sub-columnas (foto con iniciales en aqua-tint | nombre + plataforma/fecha | 5 estrellas con text-estrella a la derecha). El video llena toda la altura de su columna (mismo alto que el carrusel). El link "ver más" NO apunta a Viator (NOTAS["home-reviews"]) pero sí a TripAdvisor y Facebook. Constantes del carrusel en tokens.css: --reviews-step-intervalo (5s), --reviews-step-transicion (700ms), --reviews-card-alto (18rem), --reviews-step-gap (1.5rem).',
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
        title: 'Galería + FAQ + cierre',
        route: '/',
        status: 'done',
        description: 'Curaduría de 4 fotos reales (+19 más), acordeón de 4 FAQ (primera abierta) y CTA final "Ver disponibilidad".',
        states: [],
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
