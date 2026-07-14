# PLAN v3 — Hero inmersivo: header integrado, video de fondo, contenido centrado y ticker

Iteración sobre la v2 «Boutique luminoso», **solo header + hero** (pedido de Samuel,
2026-07-14). El resto de la home no se toca en esta versión.

> **Escrito para ejecutarse con Sonnet.** Cada fase termina en un commit que deja
> la app funcionando. Las reglas de siempre aplican íntegras (CLAUDE.md del repo):
> todo pasa por tokens, cero valores mágicos, contenido de `prototipo/datos.js`,
> fotos reales (jamás stock), Dev Mode en el mismo commit, nada de `src/dev/` ni
> líneas `[dev-mode]` va a Figma, y el código nunca se importa a Figma.

---

## §0 · Punto de retorno

**El estado actual es el tag `v2.0-home-boutique` (commit `027a045`, pusheado).**
Si esta iteración no convence, se vuelve con:

```bash
git checkout master && git reset --hard v2.0-home-boutique
```

No hace falta crear nada: el tag ya existe y está en el remoto. Al cerrar la v3 se
etiqueta `v3.0-hero-inmersivo`.

---

## §1 · Qué cambia (el pedido, traducido)

| # | Pedido de Samuel | Traducción técnica |
|---|---|---|
| 1 | Header integrado en el box del hero | El header deja de ser una barra sticky independiente y se monta **dentro** del contenedor redondeado del hero, transparente sobre el video (F2) |
| 2 | La imagen del hero pasa a ser **el video de la web original** | El video es un YouTube (`youtube.com/watch?v=K65cchLFwRs`, el del modal que se auto-abre en la home actual). Para fondo de hero **no** se usa iframe: se auto-hostea un mp4 recortado, sin audio y comprimido (F1) |
| 3 | Reducir el padding entre hero y extremos del body | Nuevo token de margen del hero, más fino que el `px-4/px-6` actual (F4) |
| 4 | Centrar la información del hero (título, párrafo, botones) | El grid de 2 columnas desaparece; una sola columna centrada (F4) |
| 5 | Quitar la baraja; en su lugar un **ticker horizontal infinito** de cards delgadas en la parte inferior del hero, con **todos los tours y eventos**, cada una enlazando a su página | Nuevo `TickerHero`: marquee CSS con 4 tours + 6 ocasiones = 10 cards. Borrado completo de la baraja y sus tokens (F5) |

### ⚠️ Nota de conversión (dejar constancia, no "optimizar" en silencio)

La cadena viene de lejos: el buscador de disponibilidad era el CTA primario del
wireframe → en v2 lo sustituyó la baraja (aceptable porque cada card era un
producto con precio y CTA) → en v3 la baraja se sustituye por el ticker. Las
cards del ticker son más pequeñas (sin botón de CTA propio), así que **deben
conservar el precio** ("desde US$ 99") y navegar a su ficha. Se conservan
intactos: el CTA primario «Ver disponibilidad» (ahora centrado), el CTA sticky
de móvil y el grid de tours. Esto se anota en `analisis/direccion-visual.md`
(nuevo §8) durante F6.

---

## §2 · Orden de fases

El video va **primero** porque es la fase con más riesgo de bloqueo externo
(descarga de YouTube): si falla, Samuel puede conseguir el mp4 por otra vía
mientras el resto avanza con la foto actual de placeholder.

| Fase | Entregable | Commit |
|---|---|---|
| V3-F1 | `app/public/video/hero.mp4` + poster | `Hero v3-F1: video de fondo (asset)` |
| V3-F2 | Header dentro del box del hero, variante sobre-video | `Hero v3-F2: header integrado en el hero` |
| V3-F3 | `<video>` de fondo en el hero + reduced-motion + `?dev-hero=poster` | `Hero v3-F3: video de fondo en el hero` |
| V3-F4 | Margen fino + contenido centrado | `Hero v3-F4: margen fino y contenido centrado` |
| V3-F5 | Ticker de tours+eventos; baraja borrada del todo | `Hero v3-F5: ticker de tours y eventos (adiós baraja)` |
| V3-F6 | QA integral + docs + tag `v3.0-hero-inmersivo` | `Hero v3-F6: QA + cierre` |

---

## §3 · V3-F1 — El video (asset)

**Fuente:** `https://www.youtube.com/watch?v=K65cchLFwRs` — es el video promocional
del propio cliente (el que la web actual abre en un modal al aterrizar). Material
propio del cliente para el rediseño de su propia web.

**Tooling:** `ffmpeg` ya está instalado (8.1.2). `yt-dlp` NO está — instalarlo
primero: `winget install yt-dlp.yt-dlp` (o `pip install yt-dlp` si winget falla).

**Pasos (trabajar en el scratchpad, al repo solo llegan los ficheros finales):**

1. Descargar solo video, máx. 1080p:
   `yt-dlp -f "bv*[height<=1080][ext=mp4]" <url> -o hero-fuente.mp4`
2. **MIRAR el video antes de cortar** — extraer un contact-sheet de frames
   (`ffmpeg -i hero-fuente.mp4 -vf fps=1/3 frames_%03d.jpg`) y revisarlos con la
   herramienta Read. Es un video promocional: puede tener rótulos, logos o texto
   quemado. Elegir un segmento de **15–30 s** de navegación/agua limpia, SIN
   texto quemado y cuyo primer y último plano no choquen al reiniciar el loop.
3. Cortar, silenciar y comprimir:
   ```bash
   ffmpeg -ss <inicio> -to <fin> -i hero-fuente.mp4 -an \
     -vf "scale=1600:-2,fps=30" -c:v libx264 -crf 26 -preset slow \
     -movflags +faststart -pix_fmt yuv420p hero.mp4
   ```
   **Presupuesto: ≤ 6 MB.** Si pesa más: `-crf 28` y/o `scale=1280:-2`.
4. Poster = **primer frame del recorte** (no otra foto: si el poster no coincide
   con el frame 0, hay un salto visible al arrancar el video):
   `ffmpeg -i hero.mp4 -frames:v 1 poster.png` → convertir a
   `app/public/fotos/hero-video-poster.webp` (con `cwebp` o ffmpeg, calidad ~80).
5. Destinos: `app/public/video/hero.mp4` + `app/public/fotos/hero-video-poster.webp`.

**Si la descarga falla** (throttling, age-gate…): NO incrustar un iframe de
YouTube como fondo, jamás. Dejar la foto actual, marcar la fase como bloqueada,
avisar a Samuel para que exporte el mp4 original, y seguir con F2–F5 (el hero
funciona igual con foto; el `<video>` de F3 se deja preparado con el poster).

---

## §4 · V3-F2 — Header integrado en el box del hero

**Composición.** Hoy `pages/home.tsx` monta `<Header />` y `<Hero />` como
hermanos. Pasa a: `home.tsx` ya no monta `Header`; `hero.tsx` lo renderiza como
primera fila **dentro** del box redondeado.

**⚠️ Trampa №1 — `overflow-hidden` vs. megamenús.** El box del hero hoy es
`overflow-hidden rounded-hero` para recortar la imagen. Si el header vive dentro,
sus megamenús/dropdowns (posicionados `absolute`) **quedarían recortados por el
box**. Estructura obligatoria:

```
<section id="hero" (margen fino, F4)>
  <div class="relative rounded-hero">            ← SIN overflow-hidden
    <div class="absolute inset-0 overflow-hidden rounded-hero">
      <video …>                                   ← el recorte vive AQUÍ
      <div (overlay)>
    </div>
    <div class="relative z-10">                   ← header + contenido + ticker
      <Header variante="sobreVideo" />
      … contenido centrado (F4) …
      <TickerHero /> (F5)
    </div>
  </div>
</section>
```

**Variante del header.** `header.tsx` recibe `variante?: 'solida' | 'sobreVideo'`
(default `'solida'`, para no romper otros usos futuros):

- `sobreVideo`: sin `sticky top-0 z-40 bg-papel` y sin `border-b border-linea` en
  la fila de nav. Links de nav: `text-white`, hover `hover:bg-white/10` (mismo
  precedente de opacidades sobre foto que ya usa el hero v2: `bg-white/15`).
  Estado abierto del trigger: `bg-white/15`.
- Topbar (WhatsApp + idiomas): `bg-navy/70 backdrop-blur-sm` en vez de `bg-navy`
  sólido (deja respirar el video). El texto ya es blanco.
- Los paneles de megamenú/dropdown NO cambian: siguen siendo cards `bg-papel`
  con sombra — sobre el video funcionan y son el mismo componente que iría a
  Figma. `MenuMovil` tampoco cambia (es un overlay `fixed` a pantalla completa).
- El botón «Reservar» coral no cambia.

**Logo.** `ui/logo.tsx` tiene `text-navy` fijo. Añadir prop
`sobreOscuro?: boolean` → `text-white`. (Mismo patrón que ya usa `Etiqueta`.)

**Sticky.** Integrado en el hero, el header **deja de ser sticky** y se va con el
scroll. El acceso persistente a reserva en móvil lo cubre el CTA sticky que ya
existe. En desktop queda sin barra persistente — **decisión abierta §9** (no
inventar un header flotante en esta versión).

**Dev Mode.** `dev-mega` y `dev-movil` siguen funcionando sin cambios (la lógica
del componente no se toca). Actualizar la *description* de la screen
«Header + Footer» del registry para decir que el header vive dentro del hero.

---

## §5 · V3-F3 — El video como fondo del hero

En `hero.tsx`, sustituir el `<img>` por:

```tsx
<video
  className="absolute inset-0 size-full object-cover"
  src="/video/hero.mp4"
  poster="/fotos/hero-video-poster.webp"
  autoPlay muted loop playsInline preload="metadata"
/>
```

- **Overlay:** el gradiente lateral de v2 (texto a la izquierda) ya no vale — el
  contenido va centrado. Pasar a overlay uniforme `bg-overlay-hero` + un
  gradiente vertical inferior (de `--color-overlay-hero` a transparente, de
  abajo hacia arriba) para asentar el ticker. Solo tokens existentes; si el
  contraste del titular falla en QA, se ajusta **el token**, no un valor inline.
- **`prefers-reduced-motion: reduce`** → no autoplay (se ve el poster). Mismo
  patrón `matchMedia` que usaba la baraja.
- **`?dev-hero=poster`** (nuevo estado Dev, mismo commit): fuerza pausa + poster.
  Es el **frame que viaja a Figma** — a Figma no va video, va el poster
  (anotarlo en el comentario del componente y en el README).
- ⚠️ Recordatorio v1: `?dev-hero=movil` NO existe y no debe volver — forzar
  ancho móvil con un contenedor no funciona (los breakpoints de Tailwind
  resuelven contra el viewport real).

---

## §6 · V3-F4 — Margen fino + contenido centrado

**Margen.** Hoy: `px-4 pt-4 sm:px-6 sm:pt-6` (16/24 px). Nuevos tokens:

```css
--spacing-hero-margen: 0.5rem;     /* 8px — móvil */
--spacing-hero-margen-sm: 0.75rem; /* 12px — desktop */
```

Aplicados como `px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-hero-margen-sm`.
El hero queda casi a sangre pero conserva el radio (pedido №3).

**Contenido centrado.** Desaparece el grid `lg:grid-cols-[1.1fr_auto]`. Una
columna: `mx-auto max-w-3xl text-center`, con eyebrow, H1, lead, fila de
confianza (`justify-center`) y CTA + meta de cancelación centrados. El copy no
cambia ni una coma (es el del wireframe aprobado). El bloque central usa los
tokens de ritmo existentes (`py-seccion-sm sm:py-seccion`) — **no crear un token
de altura mínima salvo que en QA a 1440px el hero se vea achatado**; si hace
falta, se crea `--spacing-hero-min` como token, nunca un `min-h-[…]` suelto.

---

## §7 · V3-F5 — El ticker (y el entierro de la baraja)

### 7.1 Datos — `src/data/home.ts`

- Añadir `foto: string` al tipo `Ocasion`. Las 6 ocasiones no tienen foto propia
  (no existe shooting de eventos): elegir **mirando las fotos** (Read sobre
  `app/public/fotos/`, o `analisis/fotos-contacto.html`) entre las galerías
  existentes — las `galeria-charter-privado-*` (7) son las candidatas naturales
  (grupos/celebración a bordo). Dejar comentario en `home.ts`: *fotos
  provisionales de galería real; pendiente shooting de eventos — avisar a
  Samuel*. Jamás stock ni IA.
- Nuevo derivado exportado `TICKER_ITEMS` (los 10): tours →
  `{ id: slug, nombre, meta: 'desde US$ 99 · 4 h' (con formatoDinero; Isla
  Saona sin precio → usar duracionCorta + 'Consultar'), foto }`; ocasiones →
  `{ id: tipo, nombre, meta: 'Evento privado', foto }`.

### 7.2 Componente — `src/components/home/ticker-hero.tsx`

Cards delgadas horizontales: foto cuadrada a la izquierda (llena la altura),
nombre + meta en dos líneas, `flex items-center gap-3 rounded-card bg-papel
p-2 pr-4 shadow-card`. Cada card es un `EnlacePrototipo` (las fichas viven en
`prototipo/`; ya acepta cualquier prop de `<a>`).

Tokens nuevos (los tres primeros son **la fuente del prototipo de Figma**,
playbook `animaciones-a-figma` — mismo estatus que tenían los `--baraja-*`):

```css
--ticker-duracion: 45s;            /* una vuelta completa de la pista */
--spacing-ticker-alto: 4.25rem;    /* 68px — altura de card */
--spacing-ticker-gap: 1rem;        /* separación entre cards */
```

### 7.3 Marquee — CSS en `styles/componentes.css`

Como el hover del photo-stack: esto es CSS a medida, no utilidades (documentar
el porqué en el propio CSS). Mecánica del loop perfecto:

- La pista renderiza la lista **DOS veces**; la segunda copia lleva
  `aria-hidden="true"` y sus enlaces `tabIndex={-1}` (que no duplique tab-stops).
- `.ticker-pista { display:flex; width:max-content; animation: ticker-desfile
  var(--ticker-duracion) linear infinite; }` y
  `@keyframes ticker-desfile { to { translate: -50% 0; } }`.
- ⚠️ **Trampa №2 — el gap rompe el −50%:** si la separación se pone como `gap`
  en la pista, `-50%` no cae exactamente al inicio de la segunda copia (sobra
  medio gap y el loop "salta"). La separación va como `margin-right:
  var(--spacing-ticker-gap)` **en cada card**, y la pista sin gap.
- Wrapper del ticker: `overflow-hidden` (⚠️ candidato №1 a overflow-x de página
  en QA) + fundido en los bordes con `mask-image: linear-gradient(90deg,
  transparent, black 5%, black 95%, transparent)`.
- Hover sobre el wrapper → `animation-play-state: paused` (se puede leer/clicar).
- `prefers-reduced-motion: reduce` → sin animación, `overflow-x: auto` (la fila
  sigue siendo navegable a mano).

### 7.4 Dev Mode (mismo commit)

- `?dev-ticker=pausado` — congela la animación → **frame limpio para Figma**.
- `?dev-ticker=estatico` — simula reduced-motion (fila estática scrolleable).
- Registrar en `dev-registry.ts`; la screen «Hero + baraja de tours» pasa a
  «Hero inmersivo + ticker» con estados: poster, ticker pausado, ticker estático.

### 7.5 Traspaso a Figma (anotar en el componente y README)

Loop infinito → **componente interactivo**: variante A (pista en x = 0) y
variante B (pista en x = −ancho de una copia), *After delay 1ms* + Smart Animate
**Linear** con duración = `--ticker-duracion`, y vuelta a A. Los nombres de capa
idénticos entre variantes (regla Smart Animate).

### 7.6 Entierro de la baraja — sin cadáveres

Lección v2 escrita en el cerebro: **un token que nadie usa es una variable de
Figma que miente**. Borrar TODO en el mismo commit:

- `src/components/home/baraja-hero.tsx` (y su import/uso en `hero.tsx`).
- Tokens: `--baraja-intervalo`, `--baraja-transicion`, `--baraja-easing`,
  `--spacing-baraja-*` (4), `--shadow-baraja`.
- Estados `dev-baraja` del registry.
- `fundaciones.tsx`: la card «Baraja (activa)» del bloque Forma y sombra →
  sustituir por una muestra del ticker; el párrafo de «Movimiento» pasa de
  `--baraja-*` a `--ticker-duracion`.
- `README.md`: los bullets de la baraja → los del ticker/video.
- **Verificación:** `grep -rn -i "baraja" app/src app/README.md` → 0 resultados.
  (En `PLAN-v2.md` y docs históricos sí queda — son historia, no se reescriben.)

---

## §8 · V3-F6 — QA integral + cierre

Con Playwright, en `/` y `/fundaciones`, a **390 / 768 / 1440 px**:

1. 0 errores de consola; 0 overflow-x de página (vigilar el ticker).
2. Video: `readyState ≥ 2` y `!paused`; con `?dev-hero=poster` → pausado/poster.
3. Ticker en movimiento: **dos capturas separadas ~2 s y compararlas** — lección
   del cerebro: encadenar `getComputedStyle` en bucle da lecturas basura; para
   movimiento y hover, la captura es la fuente de verdad. Hover pausa: capturas
   con y sin ratón encima. Playwright no puede hacer hover sobre elementos en
   movimiento («element is not stable») → para clicar/inspeccionar usar
   `?dev-ticker=pausado`.
4. Megamenús abiertos DENTRO del hero (`?dev-mega=tours`, `?dev-mega=eventos`):
   no recortados por el box, legibles sobre el video, por encima del ticker.
5. Menú móvil (`?dev-movil=abierto` a 390px) y CTA sticky móvil intactos.
6. Titular centrado legible sobre el video en los 3 anchos (si falla contraste →
   ajustar token de overlay).
7. Contra-runtime: si aparece un error que el código no explica, **full reload**
   antes de creer en él (HMR de Vite sirve módulos stale; pasó en v1).
8. `grep` de valores mágicos (hex/px sueltos) fuera de `tokens.css`,
   `fundaciones.tsx` (texto documental) y `src/dev/`; `tsc` limpio;
   `npm run build` limpio; peso de `public/video/` ≤ 6 MB.

**Docs del cierre:**

- `analisis/direccion-visual.md` → nuevo §8 (v3): qué se cambió, la nota de
  conversión de §1, y que el video es el asset del cliente auto-hosteado.
- `dev-registry.ts`: de paso corregir la description de «Tokens y type scale»,
  que aún dice «Lora + Inter» (misma clase de mentira que ya corregimos en
  `/fundaciones`).
- `README.md` de `app/`: sección «Lo que hay que saber» actualizada a v3.
- **Proponer** (no hacer en silencio) la actualización de la nota del cerebro
  `proyectos/hispaniola.md`: decisión hero v3, la cadena de conversión
  buscador→baraja→ticker, y que el poster es el frame de Figma.
- Tag: `git tag v3.0-hero-inmersivo && git push --tags`.

---

## §9 · Decisiones abiertas para Samuel (no resolver en esta versión)

1. **Header sticky en desktop:** integrado en el hero, el header se va con el
   scroll. ¿Hace falta una barra que reaparezca al scrollear (patrón "header
   fantasma")? Se decide viendo la v3 en pantalla.
2. **Segmento del video:** el ejecutor elige 15–30 s limpios; Samuel valida el
   corte en pantalla (los timestamps quedan apuntados en el commit de F1).
3. **Fotos de las ocasiones en el ticker:** provisionales de la galería real —
   ¿pedimos al cliente fotos de eventos reales (bodas/cumpleaños a bordo)?
4. Siguen abiertas de v2: intensidad del coral `#EF5B44` y base blanca vs. crema.
