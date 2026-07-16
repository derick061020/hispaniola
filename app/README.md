# Hispaniola — Diseño final en React (home + ficha de tour)

Diseño visual final de Hispaniola Aquatic Adventures, construido en React para
trasladarse después a Figma vía MCP (mismo flujo que Eventus y Synexia — ver
playbook `codigo-a-figma` del cerebro).

**Dos páginas reales**: la home (`/`) y la **ficha de tour** (`/tours/:slug`).

- [`PLAN.md`](./PLAN.md) — cómo se construyó la home (v1, tag `v1.0-home-diseno`).
- [`PLAN-v2.md`](./PLAN-v2.md) — dirección «Boutique luminoso» (tag
  `v2.0-home-boutique`). Photo-stack, más aire y Poppins en toda la web.
- [`PLAN-v3.md`](./PLAN-v3.md) — la home actual: hero «inmersivo» (tag
  `v3.0-hero-inmersivo`). Header integrado en el hero, video de fondo,
  contenido centrado y un ticker horizontal (sustituye a la baraja de v2).
- [`PLAN-TOURS.md`](./PLAN-TOURS.md) — **la ficha de tour** (tag
  `v1.0-ficha-tour`): la página donde se reserva.

## Lo que hay que saber de la ficha de tour (`/tours/:slug`)

- **Es UNA plantilla, no 4 diseños.** El mismo layout para los 4 productos; lo
  que cambia es el widget y qué secciones puede sostener cada modo de
  `booking`: `completo` (Semi-Privado, Snorkel Lovers) · `cotizacion` (Charter)
  · `consulta` (Isla Saona). En Figma: una página con frames de variante.
- **El widget ES la página** (wireframe A2): sticky junto a TODO el contenido,
  no solo junto a la descripción. En desktop no hay barra móvil — si el widget
  se fuera, el visitante leería el menú y el itinerario (donde se convence) sin
  un CTA a la vista.
- **Los 4 fixes de conversión que cablea** (`analisis/revision-wireframes.md`):
  el precio ancla es siempre Light y Premium solo aparece como delta «+US$ 15»
  (1.1, anti bait-and-switch) · las reseñas enlazan **solo a TripAdvisor**,
  jamás a Viator (1.2) · la franja anti-OTA va bajo el widget, donde ocurre la
  comparación (1.6) · barra inferior fija en móvil (2.3).
- **Lo que NO se inventa**: Isla Saona no tiene precio, capacidad ni galería
  confirmados → su ficha lo dice, no lleva chip de «cancelación gratis» y
  muestra foto única. Los horarios no llevan «quedan N» (haría falta que el
  motor exponga el aforo). No hay barras de distribución de reseñas (no existe
  el dato). El mapa de la ruta del wireframe **no tiene asset** → foto real
  provisional (ver `§13` del plan: decisiones abiertas).
- **El funnel de reserva (4 pasos) y el listado `/tours` NO están construidos**:
  dependen de la decisión del motor xpotours, pendiente del cliente. El CTA
  «Continuar» se pinta con su estado real (deshabilitado sin fecha, con el
  total al elegirla) pero no navega.
- Estados de Dev Mode: `?dev-widget=fecha` (widget lleno, el frame de Figma) y
  `?dev-galeria=abierta` (lightbox).

## Lo que hay que saber de la v3

- **El header vive DENTRO del box del hero** (antes era una barra hermana
  sticky): variante transparente sobre el video, y por eso deja de ser
  sticky en desktop. El box del hero ya NO lleva `overflow-hidden` — el
  recorte de la media vive en una capa interna propia, para que los
  megamenús (absolute) no queden recortados.
- **El fondo del hero es un video**, no una foto: el mismo que usa
  `hispaniolaaquaticadventures.com` en su hero real (no el popup de la
  presentadora que se auto-abre en la home actual — ver PLAN-v3.md §1).
  Recortado a 16.5s, mudo, en loop. `?dev-hero=poster` lo congela en el
  primer frame — **ese poster es el frame que viaja a Figma** (a Figma no va
  video).
- **El contenido del hero va centrado** (título, párrafo, CTA), ya no en dos
  columnas.
- **La baraja de v2 se retiró por completo** y la sustituye un **ticker
  horizontal en loop infinito** al pie del hero: los 4 tours + las 6
  ocasiones (bodas, MICE, cumpleaños, aniversarios, despedidas, reuniones),
  cada card enlaza a su ficha y conserva el precio. Fotos de las ocasiones:
  **provisionales** (reutilizadas de la galería real de charter-privado; no
  existe shooting propio de eventos — ver `src/data/home.ts`).
  - `?dev-ticker=pausado` detiene la pista → frame limpio para Figma.
  - `?dev-ticker=estatico` simula `prefers-reduced-motion`: sin loop, fila
    navegable a mano.
  - El ticker es un **loop infinito** → en Figma va como *componente
    interactivo* (variante pista-en-0 / pista-en--50%) con Smart Animate
    Linear, no como cadena de frames (playbook [[animaciones-a-figma]]). La
    duración sale del token `--ticker-duracion`, no "a ojo".

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` (o el puerto que indique Vite). Requiere Node 18+.

- `npm run build` — build de producción (`dist/`).
- `npm run dev` — servidor de desarrollo con HMR.

## Qué es y qué no es

- **Es**: el diseño visual final de la **home + la ficha de tour**, con el copy
  y los datos exactos del wireframe/prototipo aprobado (`prototipo/`), fotos
  reales de la web actual (nada de stock ni IA), y la Dirección visual B —
  "Charter Premium" (`analisis/direccion-visual.md`).
- **No es**: el resto del sitio (eso sigue viviendo en `prototipo/`, la SPA
  vanilla navegable), ni el traspaso a Figma (fase posterior), ni código de
  producción para Derick — es la base visual desde la que se construye el
  archivo Figma.
- Los enlaces a páginas que **aún** no existen en React (funnel de reserva,
  listado `/tours`, eventos, nosotros, FAQ…) no navegan — muestran un tooltip
  "Vive en el prototipo navegable" y apuntan a `prototipo/` como su referencia
  real. Los que **sí** navegan: los 4 tours, desde la TourCard, el ticker, el
  megamenú, el footer y el menú móvil.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + React Router. Sin librerías de
UI ni de animación (todo componente es propio; el ticker es un `@keyframes`
CSS con la pista duplicada, la pausa al hover es CSS puro). Iconos:
`lucide-react`. Fuente self-hosted vía `@fontsource`: **Poppins**, en
titulares y cuerpo.

## Estructura

```
app/
├── PLAN.md                  ← plan de ejecución v1 (F0-F7)
├── PLAN-v2.md                ← plan v2 «Boutique luminoso»
├── PLAN-v3.md                ← plan v3 «Hero inmersivo» (la home actual)
├── PLAN-TOURS.md             ← plan de la ficha de tour
├── public/fotos/            ← fotos reales extraídas de la web actual
├── public/video/hero.mp4    ← video de fondo del hero (asset del cliente)
└── src/
    ├── styles/tokens.css      ← TODOS los tokens (Tailwind v4 @theme)
    ├── styles/componentes.css ← CSS a medida (hover del photo-stack, loop
    │                             del ticker; ahí está explicado el porqué)
    ├── data/home.ts           ← contenido (tours, platos, ocasiones, ticker),
    │                             portado de prototipo/datos.js
    ├── data/tours.ts          ← contenido de la FICHA (itinerario, incluye,
    │                             FAQ, galería), portado de datos.js. Solo lo
    │                             que home.ts no tiene ya — cero duplicados
    ├── lib/                   ← comportamiento sin pintura: scroll al navegar
    │                             (React Router no lo resetea) y fechas ES
    ├── components/ui/         ← reusables: Boton, Logo, Etiqueta, Estrellas,
    │                             Acordeon, CarruselImagenes, PilaFotos…
    ├── components/home/       ← una sección de la home por archivo (+ TickerHero)
    ├── components/tour/       ← una sección de la ficha por archivo
    ├── dev/                   ← Dev Mode (glosario navegable, NO va a Figma)
    └── pages/
        ├── home.tsx           ← compone todas las secciones
        ├── tour.tsx           ← la plantilla de ficha (/tours/:slug)
        └── fundaciones.tsx    ← swatches + type scale, para validar tokens
```

## Reglas de diseño (ver también `CLAUDE.md` del repo)

- **Cero valores mágicos**: todo color/tamaño/radio/sombra vive en
  `tokens.css`. Un `grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/ src/pages/`
  no debería encontrar nada fuera de `fundaciones.tsx` (esos hex son texto de
  documentación, no estilos) y `src/dev/` (tooling excluido del traspaso).
- **El aqua es acento con cuentagotas** — nunca fondo grande de sección (ver
  guardarraíles en `analisis/direccion-visual.md` §6).
- **Contenido real, nunca inventado**: precios, copy y fotos vienen del
  wireframe aprobado o de la web actual. Donde falta un dato real (precio de
  Isla Saona, foto de Surf & Turf en alta resolución) se omite o se marca
  como pendiente — no se rellena con placeholders creíbles.

## Dev Mode

Botón flotante **Dev** (esquina inferior derecha, o `Ctrl/⌘ + .`): glosario de
todos los bloques y estados de la home con deep-links (`?dev-mega=tours`,
`?dev-buscador=abierto`, etc.). Ver `src/dev/dev-registry.ts` para el
registro completo. Nada de `src/dev/` se traslada a Figma.

## Cómo pedir cambios

El contenido (precios, copy, tours) vive en `src/data/home.ts` — la mayoría
de cambios de texto no tocan los componentes. Para cambios de estructura o
una sección nueva, indica qué bloque del wireframe/prototipo quieres ajustar;
`prototipo/wireframes-completos.html` y `prototipo/app.js` siguen siendo la
referencia de contenido y orden aprobados.
