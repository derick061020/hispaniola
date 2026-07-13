# PLAN — Home en diseño final profesional (React → Figma)

Encargo: pasar la **home** del wireframe a **diseño visual final** construido en React,
pensado desde el primer commit para trasladarse después a Figma vía MCP. Es el mismo
proceso código-primero → Figma probado en Eventus y Synexia.

**Alcance: SOLO la home.** Las demás páginas siguen viviendo en el prototipo wireframe
(`prototipo/`). El traspaso a Figma tampoco es parte de este plan (fase posterior).

## Leer ANTES de ejecutar

1. `C:\Users\kevin\OneDrive\Desktop\Cerebro\playbooks\codigo-a-figma.md` — el flujo y
   sus reglas de oro (el código NUNCA se importa a Figma; tokens siempre).
2. `C:\Users\kevin\OneDrive\Desktop\Cerebro\playbooks\dev-mode-glosario-prototipo.md` —
   el Dev Mode que se monta en F0.
3. `analisis/direccion-visual.md` — dirección elegida por Samuel (2026-07-13):
   **B — Charter Premium** (blanco + navy `#0B2545` + aqua `#0E8C9C` + coral CTA
   `#EF5B44` + menta precios; Lora titulares + Inter UI; esquinas 10-12px, cards con
   sombra suave). Leer especialmente sus **guardarraíles** (§6): aqua con cuentagotas
   y la diferenciación anti-OTA cargada al contenido. Especimen:
   `analisis/direccion-visual.html`.
4. La sección home del wireframe (`wireframes/wireframes-completos.html`, sección 01)
   y su implementación navegable (`prototipo/app.js`, funciones `seccion*` +
   `prototipo/datos.js`) — estructura y contenido canónicos.

`codigo-a-figma-tecnico.md` NO se lee ahora: se carga entero cuando llegue el traspaso.

## Principios no negociables

1. **Todo es visual.** Sin backend, sin lógica real. Interacciones solo las que se ven:
   menús, hover, carrusel, estados del buscador simulados.
2. **Tokens primero.** Cada color, radio, spacing y estilo de texto vive en
   `src/styles/tokens.css` (`@theme` de Tailwind v4). **Cero hex ni px mágicos en
   componentes** — esos tokens serán las variables de Figma en el traspaso.
3. **Un componente React = un futuro componente Figma.** Botones, cards, badges,
   headings de sección… viven en `src/components/ui/` con nombre claro. Nada de
   repetir divs inline: si un patrón aparece 2 veces, es componente.
4. **Contenido aprobado, no inventado.** Copy, precios y datos se portan de
   `prototipo/datos.js` (fuente canónica). Lo que falta del cliente (Saona) se
   muestra como pendiente, igual que en el prototipo.
5. **Fotos reales de la web actual** (decisión de Samuel 2026-07-13). Nada de stock.
6. **Checkpoints con git tag** en cada hito visual (regla de Synexia) para poder
   volver atrás sin perder trabajo.
7. **Verificación Playwright por fase** antes de cada commit. Gotcha conocido:
   cambiar solo el hash/ruta en una pestaña ya abierta NO recarga los módulos
   editados — recargar la página completa o abrir pestaña nueva.

## Stack

- **Vite + React + TypeScript + Tailwind v4 + react-router** — replicado de
  Eventus/Synexia. La app vive en `app/` (este directorio).
- **Sin librerías de UI** (regla heredada de Synexia: todo componente propio).
  AlignUI no aplica aquí (es un design system de dashboards SaaS).
- **Fuentes vía @fontsource** (self-hosted, sin depender de red): **Lora**
  (titulares, serif) + **Inter** (UI/cuerpo), según la Dirección B.
- **Iconos: lucide-react** (en el traspaso se convierten en `Icon/<nombre>`).
- **Sin librerías de animación.** Transiciones CSS sutiles solamente; si algo anima,
  debe poder congelarse (cada estado alcanzable por deep-link `?dev-*`) porque en
  Figma será un frame estático.

## Estructura

```
app/
├── PLAN.md            ← este archivo
├── index.html / vite config / package.json
├── public/fotos/      ← assets reales extraídos (F1)
└── src/
    ├── styles/tokens.css      ← @theme: TODOS los tokens
    ├── data/home.ts           ← contenido portado de prototipo/datos.js
    ├── components/ui/         ← Button, TourCard, Badge, PriceTag, SectionHeading…
    ├── components/home/       ← un componente por sección (nombres abajo)
    ├── dev/                   ← Dev Mode portado de Synexia (ver F0)
    └── pages/home.tsx         ← compone las secciones
```

## Las secciones de la home (canon del wireframe/prototipo)

Mismos bloques y orden que `prototipo/app.js` — el diseño cambia la piel, no la
estructura ni el orden (ya validados en la revisión de conversión):

1. **Header** — topbar (WhatsApp + idiomas) + nav con megamenús Tours y Eventos,
   CTA Reservar. Versión móvil con hamburguesa + acordeón.
2. **Hero + buscador** (`seccionHero`) — foto full-bleed, claim, buscador de
   disponibilidad (tour / fecha / personas → CTA). La sección más importante.
3. **Barra de confianza** (`seccionStats`) — 4.9★ · 1.782 reseñas · #1 TripAdvisor
   7 años · desde 2012 · eco/sin plástico.
4. **Grid de tours** (`seccionTours`) — 4 TourCards con precio real, chip de
   audiencia, meta y CTA (Saona sin precio → "consultar").
5. **Why book direct** (`seccionWhyDirect`) — comparador directo vs OTA.
6. **Diferenciadores** (`seccionDiferenciadores`) — comida hecha a bordo (fotos
   reales de platos, activo único en el mercado), eco, semi-privado.
7. **Reviews** (`seccionReviews`) — prueba social sin linkear fuera.
8. **Banda de eventos** (`seccionEventosBanda`) — ocasiones (cumpleaños, bodas…)
   → deep-link al hub de eventos del prototipo.
9. **Galería + FAQ breve + cierre** (`seccionGaleriaFaqCierre`).
10. **Footer** — 4 columnas como el prototipo.

## Fases (commit por fase; verificar con Playwright antes de cada commit)

### F0 — Scaffold + fundaciones
- `npm create vite` (react-ts) en `app/`, Tailwind v4, react-router.
- `tokens.css` con la paleta/tipografía/radios/spacing de la Dirección B. Regla en
  comentario del propio archivo: el aqua es acento con cuentagotas, no fondo.
- Fuentes @fontsource instaladas y aplicadas a estilos de texto con nombre
  (display, h2, lead, body, eyebrow, meta…) — espejo de futuros text styles Figma.
- **Dev Mode portado de Synexia** (`C:/Users/kevin/OneDrive/Documentos/Claude
  Code/Synexia/app/src/dev/`: `dev-registry.ts`, `use-dev-flag.ts`, `dev-mode.tsx`
  — son genéricos salvo el import de navegación). Montado tras
  `import.meta.env.DEV`.
- Actualizar el `CLAUDE.md` del repo: reglas de tokens, Dev Mode obligatorio,
  `[dev-mode]` en líneas de producto, nada de `src/dev/` va a Figma.
- Página de muestra con los tokens (swatches + type scale) para validar fundaciones.
- Commit: `Home F0: scaffold React + tokens de dirección + Dev Mode`.

### F1 — Assets reales
- Extraer las fotos de la web actual (playbook `extraer-recursos-visuales`; URLs de
  páginas en `analisis/mapa-del-sitio.md`; incluir banners de tours
  `images/excursions/*/banners/`, `images/bg/`, galería "Memories" del index y
  TODAS las fotos de platos `images/food/`).
- Optimizar (máx ~1920px, WebP) a `public/fotos/`, con hoja de contacto
  (`fotos-contacto.html`) para que Samuel vete/apruebe la curación.
- Marca: wordmark tipográfico "Hispaniola" (NO rediseñar el logo langosta; puede
  aparecer pequeño como sello si la dirección lo pide).
- Commit: `Home F1: fotos reales extraídas y curadas`.

### F2 — Shell (header + footer)
- Header con megamenús Tours/Eventos (contenido del prototipo, piel nueva),
  topbar, CTA. Móvil: hamburguesa + panel.
- Footer completo. Links a páginas que no existen en la app → `#` con
  `title="(vive en el prototipo)"`.
- Estados Dev: `?dev-mega=tours|eventos`, `?dev-movil=abierto`.
- Commit + tag: `v0.1-shell`.

### F3 — Hero + buscador de disponibilidad
- La sección de mayor riesgo/valor: foto curada full-bleed con gradiente de
  legibilidad, claim, buscador (tour/fecha/personas) con dropdowns visuales
  simulados y estado móvil; sticky CTA móvil.
- Estados Dev: `?dev-buscador=abierto`, `?dev-hero=movil`.
- Commit + tag: `v0.2-hero`.

### F4 — Confianza + grid de tours
- Barra de stats + 4 TourCards (datos de `data/home.ts`).
- Commit: `Home F4: confianza + tours`.

### F5 — Why-direct + diferenciadores + reviews
- Comparador anti-OTA, bodegones de platos, reviews.
- Commit: `Home F5: why-direct + diferenciadores + reviews`.

### F6 — Eventos + galería + FAQ + cierre
- Commit + tag: `v0.3-home-completa`.

### F7 — Responsive + QA + pulido
- Pase completo a 390px (y 768px), estados hover/focus, jerarquía de espaciados.
- QA visual con Playwright: screenshot por sección a 1440 y 390, revisar de verdad
  (texto cortado, contrastes, solapes).
- `grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/` debe devolver 0 (todo en tokens).
- README de `app/` (cómo correr: `npm i && npm run dev`; qué es y qué no es).
- Commit + tag: `v1.0-home-diseno`.

## Qué NO hacer

- NO importar el HTML/JSX a Figma con Anima/html.to.design (regla de oro del playbook).
- NO añadir librerías de UI ni de animación.
- NO inventar copy, datos ni usar fotos stock.
- NO construir otras páginas (ni ficha ni booking — solo la home).
- NO tocar `prototipo/` ni `wireframes/` (siguen siendo la referencia del resto del sitio).
- NO valores sueltos: si un color/tamaño no existe como token, se añade el token primero.

## Criterios de éxito

- Al abrir `npm run dev`, la home se siente **web real de marca premium**, no wireframe
  — y Samuel puede validar cada sección en el navegador en segundos.
- Cero hex/valores mágicos fuera de `tokens.css`.
- Cada sección/estado alcanzable desde el botón Dev en ≤2 clics.
- La estructura de conversión del wireframe está íntegra (buscador, precios, why-direct,
  sticky CTA móvil).
- El archivo está listo para que el traspaso a Figma empiece directamente por
  fundaciones (tokens 1:1) sin refactor previo.
