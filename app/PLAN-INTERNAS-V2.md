# PLAN — Internas v2: hero homogéneo + ficha por bloques

Decisión de Samuel (2026-07-17, conversación con referencia a
hellocaribetours.com — página que él mismo hizo). **No se copia esa web**: se
toman 3 ideas de estructura (hero con media arriba, contenido en bloques
separados del fondo, reseñas como flujo) y el resto son iteraciones originales.
Ejecuta Sonnet 5, por fases con commit cada una y verificación Playwright antes
de cada commit — mismo método que PLAN-ALIGNUI.md.

**Objetivo en una frase:** que la ficha de tour (y la landing de evento) se
sientan de la MISMA web que la home — mismo header, mismo lenguaje de hero —
y que el contenido de la ficha se lea por bloques, no como un chorro sobre
blanco.

## Decisiones cerradas con Samuel (AskUserQuestion, 2026-07-17)

1. **Hero-galería + mosaico**: el hero de la ficha es estilo home (box
   redondeado con margen, header `sobreVideo` dentro, overlay) pero **compacto**,
   y su fondo son **las fotos del propio tour pasando solas en loop** — el
   equivalente al video del hero de la home, sin video. El mosaico de fotos
   actual **se queda** debajo, en blanco, como entrada al lightbox (la
   referencia hace lo mismo: video arriba Y galería después — no es redundante,
   son dos trabajos: ambientar vs. inspeccionar).
2. **Alcance = tours + eventos**: la landing de evento adopta el mismo hero en
   la fase final de este plan, con su propia galería.

## Reglas que este plan NO deroga

- **Todo pasa por tokens** — los valores nuevos (gris de fondo, alto del hero
  compacto, tiempos de fade/marquee) nacen como tokens en `tokens.css` ANTES
  de usarse. Serán variables de Figma.
- **Contenido jamás inventado** — ni una reseña redactada por el modelo, ni
  fotos stock, ni datos que `prototipo/datos.js` no tenga. Donde falte
  contenido real, se deja el hueco honesto y se anota en §Decisiones abiertas.
- **La home no se toca** — `components/home/*` y las piezas `ui/` compartidas
  (`boton`, `acordeon`, `etiqueta`, `enlace-prototipo`, `carrusel-imagenes`)
  quedan intactas. La garantía se VERIFICA con `git diff --name-only` en QA,
  no se confía. (`Header` se reusa tal cual — ya tiene la variante
  `sobreVideo` y el prop `ctaHref`; no necesita cambios.)
- **AlignUI sigue siendo el chrome de la ficha** (Select, FancyButton, Modal,
  StatusBadge, Accordion, Breadcrumb). Las piezas nuevas de este plan (hero,
  marquee de opiniones, boxes de relacionados) son **editoriales/de marca**,
  no chrome → se construyen propias con tokens Hispaniola, como itinerario o
  incluye. El vendor no se edita: cualquier ajuste sobre foto va por
  `className`/wrappers.
- **Dev Mode obligatorio** — cada animación nueva recibe su flag para congelar
  el frame que viaja a Figma, registrado en `dev-registry.ts` en el MISMO
  commit (líneas de producto marcadas `// [dev-mode]`).

## Punto de partida

La rama `minimax` tiene trabajo en curso sin commitear (IncluyeCrucero de la
home + la landing de evento nueva). **Ese trabajo se cierra/commitea ANTES de
la fase C0** — este plan no lo pisa ni lo mezcla en sus commits.

---

## Anatomía final de la ficha de tour

```
┌──────────────────────────────────────────────┐
│ [Header sobreVideo]                          │  HERO COMPACTO (nuevo)
│   migaja (blanca, translúcida)               │  fondo: fotos del tour en
│   H1 · ★4.9 · 1.782 reseñas · chips          │  crossfade infinito + overlay
└──────────────────────────────────────────────┘
──── blanco ────
[ mosaico de fotos → lightbox ]                   (se queda como está)
[ anclas sticky ]                                 (se quedan)
──── gris (--color-fondo-ficha) ────
┌─────────────────────────────┐  ┌────────────┐
│ card: promesa + descripción │  │ widget     │  cada bloque = card blanca
│       + comparador          │  │ (card      │  (padding + radios) sobre
├─────────────────────────────┤  │  blanca,   │  el gris — se separan del
│ card: Itinerario            │  │  sticky)   │  fondo y entre ellos
├─────────────────────────────┤  └────────────┘
│ card: Incluye               │
├─────────────────────────────┤
│ card: Menú (solo completo)  │
├─────────────────────────────┤
│ card: Opiniones — marquee ∞ │   ← sin link a TripAdvisor
├─────────────────────────────┤
│ card: FAQ (columna entera)  │   ← ya sin «También te puede gustar» al lado
└─────────────────────────────┘
──── sección propia, a ancho completo ────
[ También te puede gustar: boxes grandes de     ]
[ imagen en crossfade + texto encima            ]
──── footer ────
```

## Tokens nuevos (fase C1, antes de cualquier componente)

| Token | Valor propuesto | Para qué |
|---|---|---|
| `--color-fondo-ficha` | gris frío derivado del navy (≈ navy al 4–5% sobre blanco; afinar en QA visual contra `--color-papel` de las cards) | el fondo grisáceo del área de contenido. NO reusar `--color-papel-hueso`: es hueso cálido y el contraste card-blanca-sobre-él casi no se lee |
| `--spacing-hero-interna-alto` | ≈ `34rem` de `min-height` (más bajo que los `84svh` del home a propósito; afinar en QA) | hero compacto: presenta y cede el paso al blanco enseguida |
| `--fundido-intervalo` | `4.5s` | cadencia del crossfade (hero y boxes de relacionados) |
| `--fundido-transicion` | `900ms` | duración del fade entre fotos |
| `--opiniones-marquee-duracion` | `45s` | una vuelta completa del marquee de reseñas |
| `--spacing-tambien-alto` | ≈ `24rem` | alto de los boxes de «También te puede gustar» |

Los tiempos van en tokens porque son la FUENTE del prototipo de Figma
(playbook `animaciones-a-figma`), igual que `--carrusel-intervalo` y los
`--reviews-step-*` existentes.

## Piezas nuevas

### `ui/fotos-fundido.tsx` — crossfade reusable

Fotos apiladas (`absolute inset-0`), la activa con opacidad 1, transición de
opacidad con `--fundido-transicion`, avance con `--fundido-intervalo`.
Decorativa (`aria-hidden`, las fotos no son contenido). Con
`prefers-reduced-motion` NO avanza (WCAG 2.2.2, igual que el carrusel).
Prop `activa?: boolean` para congelarla ([dev-mode]). Solo la primera foto va
`eager`; la siguiente se precarga antes de cada fade para que nunca funda a
gris. **Pieza NUEVA a propósito** — extender `ui/carrusel-imagenes` (compartida
con la home) con un modo fade arriesga la garantía de home intacta por un
`if` de conveniencia. Un componente React = un componente Figma.

### `internas/hero-interna.tsx` — el hero compartido de las páginas internas

Carpeta nueva `src/components/internas/` (piezas compartidas entre ficha y
landings internas — no es home, no es ui/ genérico). Reproduce el lenguaje del
hero de la home: box `rounded-hero` con los mismos márgenes
(`--spacing-hero-margen*`), media recortada en capa interna propia (la trampa
del `overflow-hidden` de PLAN-v3.md §4: el box NO lo lleva, o recorta los
megamenús), `Header variante="sobreVideo"` dentro, overlay `--color-overlay-hero`.
Diferencias vs. home: `min-h` = `--spacing-hero-interna-alto`, media =
`<FotosFundido>` (con 0–1 fotos: foto única estática — el caso Isla Saona,
`galeriaCompleta: []`, sin inventar relleno), contenido alineado a la
izquierda (es una ficha, no un manifiesto — el centrado es del home) y SIN
ticker. Props: `fotos`, `ctaHref`, `children` (cada página pone su migaja,
H1 y meta). El H1 mantiene `--text-h2`: manda por jerarquía, no por tamaño —
`--text-hero` sigue siendo exclusivo del hero de la home.

### Sobre foto, dentro del hero

- **Migaja**: el `Breadcrumb` AlignUI ajustado por `className` a blanco
  translúcido (vendor intacto).
- **Rating**: `Estrellas` + texto en blanco.
- **Chips**: siguen siendo `StatusBadge`, sobre esmerilado si el QA de
  contraste lo pide (`bg-papel/85 backdrop-blur` — el patrón de la TourCard),
  vía wrapper/`className`, nunca editando el vendor.

## Fases

### C0 — checkpoint
Tag `pre-internas-v2`. Este plan commiteado. WIP previo de `minimax` ya
cerrado (ver §Punto de partida).

### C1 — tokens + `fotos-fundido` + `hero-interna` + estreno en la ficha
`tokens.css` primero. `CabeceraFicha` se disuelve: migaja/H1/rating/chips
pasan a ser el `children` del hero (el archivo puede quedar como el bloque de
contenido del hero o retirarse — lo que deje el árbol más claro). El hero usa
`[tour.foto, ...ficha.galeriaCompleta]`. Mosaico y anclas quedan como están.
Dev: `?dev-hero-interna=pausado` (frame Figma). QA: contraste del H1/migaja
sobre las fotos reales de los 4 tours, Saona con foto única, 390px, megamenús
desplegando por encima del hero.

### C2 — fondo gris + bloques como cards
El wrapper del grid de dos columnas pasa a `--color-fondo-ficha`. Cada sección
de la columna izquierda (intro+comparador, itinerario, incluye, menú,
opiniones, FAQ) y el widget pasan a card blanca: `bg-papel`, radio
`rounded-card-grande`, padding consistente (token existente o clase compartida
— NO seis paddings distintos). Si el widget ya trae ring/sombra propios, se
armoniza para que sobre gris lea como el resto de cards. Ojo: las anclas
sticky quedan sobre la frontera blanco→gris — verificar su legibilidad en
ambos fondos. QA: los bloques se separan del fondo y entre sí (el objetivo de
Samuel), `scroll-mt` de las anclas sigue aterrizando bien, 390px sin
overflow-x.

### C3 — opiniones: marquee infinito, sin TripAdvisor
`OpinionesTour` se rehace: fuera el link «Ver en TripAdvisor →» (pedido
explícito de Samuel — y el ⚠️ anti-Viator del archivo actual sigue vigente:
CERO enlaces de salida en plena decisión). Se queda el resumen (4.9 / 5 +
reseñas verificadas) como cabecera del bloque, y debajo un **marquee
horizontal continuo** de cards de reseña — mecánica del TickerHero (pista
duplicada, animación CSS con `--opiniones-marquee-duracion`, pausa en hover,
estático con reduced-motion), dentro de la card blanca del bloque.
**Contenido**: el pool son las `QUOTES` reales de `data/home.ts` — se extraen
a un módulo común si hace falta, SIN tocar cómo la home las consume. No se
redacta ni una reseña nueva; si el loop se siente corto, más reseñas reales
van en §Decisiones abiertas. Cards propias de `tour/` (no se extrae la
ReviewCard de la home: compartirla acopla la home a esta iteración).
Dev: `?dev-opiniones=pausado`. QA: marquee sin saltos en el wrap, hover pausa,
reduced-motion, 390px.

### C4 — FAQ a columna entera + «También te puede gustar» como sección propia
`FaqTour` pierde el grid de dos medias columnas: el acordeón ocupa el ancho
de la columna, dentro de su card. Los relacionados salen del archivo y nacen
como `internas/tambien-te-gusta.tsx`: sección a ancho completo (fuera del
grid, entre el área gris y el footer), un box grande por tour relacionado
(fila de 2–3 en desktop, apilados en móvil, `--spacing-tambien-alto`), cada
box = `<FotosFundido>` con fotos de ESE tour + gradiente inferior + texto
encima (nombre, audiencia, precio-desde o CTA de su modo `booking`) + `<Link>`
a su ficha. Los boxes son «prácticamente solo imagen» — el texto es rótulo,
no párrafo. Dev: `?dev-tambien=pausado`. QA: navegación ficha→ficha
(ScrollAlNavegar sigue), hover/focus visibles, 390px.

### C5 — la landing de evento adopta el hero
`CabeceraEvento` migra a `hero-interna`: migaja/eyebrow/H1/sub/trust/CTAs
como children sobre su galería. `FichaEvento` gana `galeria: string[]` —
**solo fotos reales existentes** en `/fotos` (las de la web actual); si un
evento no tiene más que su foto de portada, foto única estática (mismo
trato honesto que Saona), sin rellenar con fotos de tours. La banda de stats
de empresas queda debajo, en blanco. Los CTA coral funcionan sobre foto
(ya viven sobre foto en la home). QA: ambas landings (bodas/empresas), foto
única vs. galería, 390px.

### C6 — QA integral + docs + tag `v2-internas`
1. `git diff --name-only pre-internas-v2` — NADA de `components/home/` ni de
   las `ui/` compartidas listadas arriba (si `QUOTES` se movió de módulo,
   `data/home.ts` puede aparecer: verificar que la home renderiza idéntica).
2. `tsc` + `npm run build` limpios; 0 errores de consola en `/`, las 4 fichas
   y las 2 landings de evento (recarga completa, no HMR).
3. Grep de hex en `components/tour/`, `components/internas/` y `ui/` → 0
   (exclusiones de siempre: `alignui/`, `alignui.css`, `dev/`).
4. Deep-links dev: los 4 existentes + los 3 nuevos (`dev-hero-interna`,
   `dev-opiniones`, `dev-tambien`).
5. Flujo de conversión intacto: widget sticky a la vista junto a cada bloque,
   CTA deshabilitado sin fecha, totales, agotados, barra móvil, CERO enlaces
   a Viator y ya CERO a TripAdvisor.
6. `prefers-reduced-motion`: nada se mueve solo (fundidos, marquee).
7. Responsive 390px en todas las páginas tocadas, sin overflow-x.
8. Actualizar `dev-registry`/docs y PROPONER a Samuel la actualización de la
   nota del cerebro (`proyectos/hispaniola.md`) y del playbook si aparece un
   patrón nuevo — no hacerlo en silencio.

## Estado final

**Etapa cerrada** (tag `v2-internas`). Las 4 fichas de tour y las 2 landings
de evento comparten ya el mismo hero que la home (`internas/hero-interna.tsx`
+ `ui/fotos-fundido.tsx`), el contenido de la ficha vive en bloques
(`BLOQUE_FICHA`) sobre `--color-fondo-ficha`, las opiniones son un marquee
infinito sin salida a TripAdvisor ni Viator, y «También te puede gustar» es
su propia sección de boxes en fundido (`internas/tambien-te-gusta.tsx`).

QA (C6) verificado con Playwright y con los commits aislados
quirúrgicamente de trabajo paralelo de Samuel en el mismo working tree (ver
nota de sesión más abajo): `git diff --name-only pre-internas-v2` no toca
`components/home/` ni las `ui/` compartidas · `tsc`/`build` limpios en
aislamiento (working tree solo con estos commits, sin el WIP paralelo) · 0
hex en el código nuevo · 0 enlaces a Viator/TripAdvisor · los 7 deep-links
dev funcionan (4 preexistentes + `dev-hero-interna`, `dev-opiniones`,
`dev-tambien`) · `prefers-reduced-motion` respetado (fundidos + marquee) ·
390px sin overflow-x en las 6 páginas tocadas.

**Nota de sesión**: la ejecución (C0-C6, Sonnet 5) coincidió con trabajo
en vivo de Samuel en el mismo working tree (footer «océano», Contacto/FAQ de
la home con AlignUI, SEO, sostenibilidad, favicons…). Cada commit de este
plan se aisló reconstruyendo el archivo desde el HEAD anterior + solo los
cambios propios de esa fase (vía `git hash-object`/`update-index`, sin tocar
el working tree), para no arrastrar ni pisar ese trabajo. No hubo pérdida de
datos; el WIP de Samuel sigue sin commitear, tal como él lo dejó.

## Decisiones abiertas para Samuel

1. **Más reseñas reales**: el pool actual son las QUOTES de la home. Para que
   el marquee no se sienta repetido harían falta ~8–12 reseñas reales (texto +
   autor + plataforma + fecha, p. ej. de TripAdvisor). Pedirlas, no inventarlas.
2. **Fotos de galería de eventos**: ¿existen fotos reales de bodas/empresas
   más allá de la portada? Sin ellas, C5 sale con foto única (correcto pero
   menos vivo).
3. **El gris exacto** de `--color-fondo-ficha` y el alto exacto del hero
   compacto: los valores propuestos son punto de partida — se afinan mirando,
   con Samuel, no por número.
4. **Reparto hero ↔ mosaico de fotos**: si tras verlo en vivo el mosaico se
   siente redundante con el hero-galería, la alternativa ya discutida es
   retirarlo y abrir el lightbox desde el hero — decisión pospuesta a verlo.
