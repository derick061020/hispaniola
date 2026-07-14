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
5. **Premios (v3-F9):** pedir al cliente (a) los assets en ALTA de TripAdvisor
   y Viator — los de su web no dan para 2× a 64px de display (§14.4) — y
   (b) las URLs verificables de cada premio/perfil, para hacer los badges
   clicables (la mitad pendiente de la crítica de la auditoría: «sin enlaces
   verificables»).

---

## §10 · V3-F7 — El hover «dock» del ticker

Estado: **implementado** (`use-ticker-dock.ts` + `componentes.css` + `tokens.css`).
Verificado con Playwright: geometría sin solapes (gaps de 16px intactos en
todo el barrido), sombra sin recorte a escala máxima, dock desactivado en
`?dev-ticker=estatico` (trampa №4), `pointerleave` limpia las 3 properties, y
sin overflow-x de página a 390px. Pendiente: QA visual final de Samuel.

### 10.0 Ya hecho — las dos variantes de card

La card del ticker dejó de ser una fila uniforme. Son **dos especies** y el tipo
`TickerItem` es ahora una unión discriminada (`tipo: 'tour' | 'ocasion'`) → 2
variantes del componente de Figma:

- **Tour:** `Desde **US$ 99** · 4 h · máx. 25`. El precio lidera en navy semibold
  (es el único dato de compra); duración y aforo van detrás en `navy-soft`. El
  **aforo** es el dato que de verdad distingue un tour de otro, y además es la
  promesa de marca (la cinta de stats dice «≤35% de la capacidad del barco»).
- **Ocasión:** chip `aqua-tint` / `aqua-dark` con «Evento privado» — no hay precio
  publicado (todas se cotizan) y no se inventa uno. Es el único punto de color de
  la card, y da el contraste que separa las dos especies de un vistazo en la
  pista: **número fuerte = tour, chip aqua = ocasión**.

⚠️ Se descartó el rating con estrellas: los 4 tours comparten `rating: 4.9` y
`resenas: 1782` en `datos.js`, y las ocasiones no tienen rating. Serían 4 cards
repitiendo el mismo 4.9 justo debajo del hero, que ya lo dice en grande. Un chip
de **categoría** que se repite está bien (agrupa); una **métrica por-card**
idéntica repetida miente. Es la diferencia que justifica una y descarta la otra.

El ancho de card pasó a `--spacing-ticker-ancho: 18rem` (uniforme, medido para
que quepa «Desde US$ 55 · 3-4 h · máx. 120» sin truncar). **El ancho uniforme es
un requisito del dock**, no una casualidad: la geometría de §10.2 asume `W` igual
para todas.

### 10.1 La idea — una función continua, no reglas de hermanos

Como el Dock de macOS. La escala de cada card **no** sale de reglas por hermano
(`+ .card`, `nth-child`…) sino de una **función continua de la distancia
horizontal entre el puntero y el centro de la card**. Eso es exactamente lo que
pidió Samuel («no solo los hermanos directos sino los siguientes también»): no
hay 2 anillos ni 3, hay una curva, y los anillos salen solos.

**Curva: NÚCLEO estrecho + HOMBRO ancho** — dos campanas coseno sumadas:

```
campana(d, r) = (1 + cos(π · d / r)) / 2     si d < r ;  0 si d ≥ r

forma(d) = peso · campana(d, Rnucleo) + (1 − peso) · campana(d, Rhombro)
escala(d) = 1 + (sMax − 1) · forma(d)
```

Con `d` = |puntero.x − centro.x|. Se usa **coseno** y no una rampa lineal porque
su derivada es **0 en los dos extremos**: las cards entran y salen de la zona de
influencia sin costura (con una rampa se ve el borde exacto donde el efecto
«empieza», y con un pico triangular se ve un codo en la card hovereada).

⚠️ **Una sola campana NO sirve — es el error que se cometió primero.** La campana
es *plana en el pico*, así que la vecina inmediata (que está a solo 1/3 del radio)
se llevaba el **75%** del crecimiento: el hover no mandaba, **empataba** con ella,
y el crecimiento de los hermanos se veía «demasiado fluido». Partir el crecimiento
en dos campanas resuelve las dos mitades del pedido a la vez:

- **Núcleo** (radio corto, se lleva `peso` del crecimiento): **muere antes de
  llegar a la vecina** → es lo que hace que el hover sea claramente el más grande.
- **Hombro** (radio largo, el resto): es lo que deja que la 2ª y la 3ª vecina
  sigan reaccionando, pero ya en sordina.

**Constantes** (`sMax` = 1.12, `Rhombro` = 3.5 pasos, `Rnucleo` = 1.27 pasos,
`peso` = 0.87; paso = ancho + gap = 288 + 16 = 304 px):

| distancia | escala | del crecimiento máx. |
|---|---|---|
| card hovereada | **1.120** | **100%** |
| vecina inmediata | 1.024 | 20% |
| 2ª vecina | 1.006 | 5% |
| 3ª vecina | 1.001 | 0.6% |
| 4ª en adelante | 1.000 | 0% |

Son las escalas que viajarán a Figma como variantes. `Rhombro` se dejó fijo desde
la primera pasada: como el núcleo no le llega nada a la 2ª/3ª vecina, es el único
parámetro que controla esas dos casillas, y tocar solo `peso` + `Rnucleo` basta
para afinar «cuánto manda el hover» sin descuadrar el resto de la cola.

⚠️ **`sMax` = 1.3 (probado primero) se descartó por exagerado.** Con texto y
precio dentro de la card, un dock al 130% real de macOS se lee caricaturesco,
no premium — el efecto tiene que sentirse como un matiz, no un salto.

### 10.2 El empuje — por qué no basta con escalar

Si solo se escala, la card hovereada crece `288 · 0.12 ≈ 35 px` y **se come a
sus vecinas** (les tapa foto y texto). En el Dock real los iconos se
**apartan**. Hay que desplazarlas.

Para las **20 cards del DOM** (las 10 reales + las 10 de la copia duplicada —
⚠️ se tratan como **un solo array plano**, si no la costura del loop se rompe),
con `W` = ancho de card, `c_i` = centro base y `P` = x del puntero:

```
d_i = |P − c_i|
s_i = escala(d_i)

// desplazamiento del centro de i si ancláramos en el extremo izquierdo:
D_i = Σ_{j<i} W·(s_j − 1)  +  W·(s_i − 1)/2

// crecimiento que queda a la IZQUIERDA del puntero (fracción incluida):
A   = Σ_j  W·(s_j − 1) · clamp01( (P − (c_j − W/2)) / W )

// traslación final de la card i:
t_i = D_i − A
```

`A` es el ancla: garantiza que **el punto bajo el cursor no se desliza**. Y es
**continuo en `P`** — por eso se usa la fracción y no «la card hovereada», que al
cruzar de una card a la siguiente daría un salto de toda la pista.

Se aplica con las propiedades **separadas** `translate` / `scale` (no `transform`),
que componen en el orden correcto y no pisan nada:

```css
.ticker-card {
  translate: var(--dock-x, 0px) 0;
  scale: var(--dock-escala, 1);
  transition: translate var(--ticker-dock-transicion) ease-out,
              scale     var(--ticker-dock-transicion) ease-out;
}
```

El JS escribe `--dock-x` y `--dock-escala` por card; al salir, los **borra** y la
misma `transition` las devuelve a casa solas. La `transition` corta (≈140 ms)
sobre valores que se reescriben en cada `pointermove` produce el «seguimiento
amortiguado» que hace que se sienta vivo y no rígido.

`z-index = round(s_i · 100)` en JS (con el empuje no se solapan, pero las sombras
sí, y la grande debe ir encima).

### 10.3 ⚠️ Las cuatro trampas

1. **La pausa del hover es LOAD-BEARING.** `.ticker-wrapper:hover .ticker-pista {
   animation-play-state: paused }` ya existe, y ahora el dock **depende** de ella:
   congela la pista → la geometría deja de moverse → los centros `c_i` se pueden
   medir **una sola vez** en `mouseenter` (con `getBoundingClientRect`, mejor
   dentro de un `requestAnimationFrame` para que la pausa ya haya aplicado) y
   luego solo se sigue el puntero. Si alguien quita esa pausa, hay que medir en
   cada frame. No tocarla sin saber esto.
2. **El aire vertical se queda corto.** `.ticker-wrapper` tiene `overflow: hidden`
   (lo pide el loop) y tenía `padding-block: 1.5rem` (24 px), calculado solo para
   la sombra en reposo. Una card en hover crece **y su sombra escala con ella**
   → **se recorta** si el padding no da margen. Subió a
   `--spacing-ticker-aire: 2.5rem` (40 px) y se renombró `--spacing-ticker-sombra`
   (ya no es solo para la sombra) — generoso a propósito: cubre tanto el `sMax`
   final (1.12, crecimiento pequeño) como el 1.3 que se probó primero y se
   descartó, sin tener que retocarlo si `sMax` vuelve a subir. El padding debe
   seguir siendo **simétrico**: el `translate-y-1/2` del hero centra el wrapper
   por su alto, así que con padding simétrico las cards siguen cayendo justo
   sobre la costura hero/stats.
3. **Texto borroso al escalar.** Si la card recibe capa de compositor
   (`will-change: transform`), el navegador rasteriza a 1× y luego amplía → texto
   borroso a 1.3×. **No poner `will-change`**; dejar que Chrome re-rasterice.
   Verificar la nitidez a escala máxima con `?dev-dock`; si aún se ve blando,
   bajar `sMax` antes que meter hacks.
4. **`estatico` no lleva dock.** Con `?dev-ticker=estatico` / reduced-motion el
   wrapper es `overflow-x: auto` y se scrollea a mano → los centros cambian sin
   `mouseenter`. El dock **no se engancha** en ese modo (ni con
   `prefers-reduced-motion: reduce`, ni en táctil: guardar con
   `matchMedia('(hover: hover)')`). Con `?dev-ticker=pausado` **sí** funciona —
   hace falta para el frame de Figma.

### 10.4 Tokens nuevos (`styles/tokens.css`)

Son la **fuente** del prototipo de Figma, como `--ticker-duracion`. Nada de
números a ojo en el hook:

```css
--ticker-dock-escala-max: 1.12;   /* escala de la card hovereada — sutil, no macOS real */
--ticker-dock-radio: 3.5;         /* HOMBRO: alcance total, EN PASOS de card */
--ticker-dock-radio-nucleo: 1.4;  /* NÚCLEO: alcance del pico, en pasos */
--ticker-dock-nucleo: 0.75;       /* fracción del crecimiento que se lleva el núcleo */
--ticker-dock-transicion: 140ms;  /* seguimiento amortiguado */
--spacing-ticker-aire: 2.5rem;    /* ⬅ renombra --spacing-ticker-sombra (24px → 40px) */
```

Los dos knobs para afinar el «feel»: **`--ticker-dock-nucleo` sube → el hover
manda más** (los hermanos se aplanan); **`--ticker-dock-radio` sube → la onda
llega más lejos** (más hermanos acompañan).

El radio se declara en **pasos de card** (no en px) para que siga siendo correcto
si cambia `--spacing-ticker-ancho`; el hook lo convierte:
`R_px = radio · (anchoCard + gap)`, leyendo ambos de `getComputedStyle`.

### 10.5 Archivos

- `styles/tokens.css` — los 4 tokens de arriba.
- `styles/componentes.css` — `translate`/`scale`/`transition` en `.ticker-card`;
  `padding-block` del wrapper → `--spacing-ticker-aire`. Comentar **por qué** es
  CSS a medida (misma convención que el resto del archivo).
- `components/home/use-ticker-dock.ts` — **nuevo**. El hook: `mouseenter` (medir),
  `pointermove` (`{ passive: true }`, throttle a un `rAF`), `mouseleave` (limpiar).
  20 cards × 2 custom props por frame: barato, no hace falta optimizar más.
- `components/home/ticker-hero.tsx` — `ref` en el wrapper + llamada al hook.
- `dev/dev-registry.ts` — el estado nuevo (§10.6), **en el mismo commit**.

### 10.6 Dev Mode (mismo commit — regla del proyecto)

`?dev-dock=activo` → simula el puntero en el centro de la 3ª card visible y deja
el dock **congelado** en su estado máximo. No es un capricho: es el **frame que
viaja a Figma** (un efecto continuo guiado por el puntero no se captura de otra
forma) y es cómo se verifica la trampa №3 (nitidez del texto). La línea que lo
lee va marcada `// [dev-mode]`. Se registra como estado de la screen «Hero
inmersivo + ticker».

### 10.7 Traspaso a Figma

Figma **no** tiene funciones continuas de distancia: el dock no se «traduce», se
**congela**. Según el playbook `animaciones-a-figma`:

- Card = componente con propiedad de variante `escala: 100 / 103 / 109 / 112` (los
  valores salen de la tabla de §10.1 — de los tokens, no del ojo).
- Del ticker se entregan **dos frames**: «reposo» (`?dev-ticker=pausado`) y «dock
  activo» (`?dev-dock=activo`), y una nota en el componente explicando que en
  código la escala es continua y que **estas 3 variantes son un muestreo de la
  curva**, no la curva.

### 10.8 Verificación (Playwright, antes de dar por cerrada la fase)

1. Barrer el puntero por la pista y comprobar que **ninguna** card se solapa con
   la vecina: `rect.left` de la card `i` ≥ `rect.right` de la `i−1` en todo el
   barrido. Es la prueba de que la fórmula de `A` está bien.
2. Al cruzar del centro de una card al de la siguiente, **la pista no salta**:
   la card más lejana (fuera del radio) no puede moverse más de ~1 px entre dos
   frames contiguos.
3. Con `?dev-dock=activo`: la sombra de la card grande **no está recortada** por
   el wrapper (comparar `rect` de la card escalada contra el del wrapper), y el
   texto se lee nítido.
4. La costura del loop sigue siendo invisible con el dock activo cerca del punto
   de empalme entre las dos copias.
5. Sin dock en móvil/táctil y con `prefers-reduced-motion: reduce`.

### 10.9 A sangre — el ticker toca el borde real de la pantalla

Pedido de Samuel viendo el resultado: si el ticker se recorta ANTES del borde
real de la pantalla, las cards parecen desaparecer contra una pared invisible en
vez de deslizarse fuera de ella. `<section id="hero">` tiene padding lateral
(`--spacing-hero-margen`) para el box redondeado, así que por defecto el ticker
hereda ese mismo inset.

⚠️ **Dos técnicas descartadas, en orden — las dos rompen exactamente donde no se
esperaba:**

1. `left-1/2` + `-translate-x-1/2` (el truco clásico de centrar un elemento
   ancho de sobra): `left: 50%` se resuelve contra el ancho del **containing
   block**, que aquí es `.rounded-hero` — ya angosto por el padding que se
   quiere ignorar. Resultado: queda descuadrado por el propio margen que
   intenta cancelar.
2. `w-screen` (`100vw`) + `margin-left: calc(50% - 50vw)` (el truco "full-bleed
   robusto", que sí es independiente del padre): en desktop, con scrollbar
   clásica (no overlay), `100vw` **incluye el ancho de la scrollbar** —
   ~15px más ancho que el área visible real (`100%` / `document.documentElement.
   clientWidth`). El ticker terminaba más ancho que la página → overflow-x de
   página. Es exactamente el riesgo que §7.3/§8 ya avisaban vigilar en este
   componente, y aquí se materializó.

**La que sí funciona:** en vez de perseguir el borde del viewport con `vw`,
cancelar el padding EXACTO que lo causó, con el mismo token que lo puso:

```css
inset-x: calc(var(--spacing-hero-margen) * -1);
/* sm: */ inset-x: calc(var(--spacing-hero-margen-sm) * -1);
```

Sin `vw`, sin transform, sin depender del ancho de la scrollbar — funciona para
cualquier ancho de scrollbar (0 en móvil/overlay, ~15-17px en desktop clásico)
porque nunca la mide: solo deshace el padding que el propio hero le puso.
Verificado con Playwright en 390px y 1440px: `wrapperLeft = 0`,
`wrapperRight` = ancho de página exacto, `scrollWidth === clientWidth` (cero
overflow-x) en los dos.

---

## §11 · V3-F8 — Notch dinámico: los menús viven DENTRO del notch

Estado: **planificado** (pedido de Samuel, 2026-07-14). **Experimental por
declaración explícita**: «esto quiero ver si funciona, pero puede que tengamos
que volver a esta versión si no me convence».

La idea en una frase: como la Dynamic Island de Apple, pero sobre nuestro notch
MacBook — al abrir Tours/Eventos/Nosotros/Ayuda, el panel deja de ser una card
flotante debajo del botón: **el notch entero se expande** (ancho y alto,
animado) y el contenido del menú se muestra dentro del notch expandido. Al
cerrar, se encoge de vuelta a la fila de tabs. Al cambiar de tab con otro
abierto, el notch **morfea de un tamaño al otro** sin pasar por cerrado.

### 11.0 Punto de retorno (obligatorio ANTES de tocar nada)

El notch estático actual (con el remate cóncavo tangente ya corregido) está
**sin commitear**. Primer paso de la fase: **pedir OK a Samuel** (instrucción
vigente 2026-07-14: él avisa cuándo se commitea) y hacer un commit del estado
actual + tag local `v3.1-notch-estatico`. Ese es el punto de vuelta:

```bash
git reset --hard v3.1-notch-estatico
```

**Sin ese commit no se empieza** — el experimento necesita una frontera limpia.
Toda la fase después es UN commit: `Hero v3-F8: notch dinámico (menús dentro
del notch)` — también pidiendo OK antes de hacerlo.

### 11.1 Anatomía nueva — tres capas, y por qué

Hoy el notch es un solo `<nav class="notch-menu">` con las esquinas dentro y
los paneles colgando `absolute` de cada botón. Pasa a **componente propio**
`src/components/home/notch-menu.tsx` (un componente React = un futuro
componente Figma; el notch con sus 5 variantes lo es de pleno derecho):

```tsx
// header.tsx (rama sobreVideo) — el wrapper centrado sube a z-30:
// expandido, el notch debe pintar por encima del contenido del hero
// y del ticker (z-20).
<div className="absolute left-1/2 top-0 z-30 hidden -translate-x-1/2 md:block">
  <NotchMenu abierto={menuAbierto} tabs={tabs} />
</div>
```

```tsx
// notch-menu.tsx — estructura interna:
<div className="relative w-max">                        {/* capa 1: marco */}
  <span className="notch-esquina notch-esquina--izquierda" aria-hidden="true" />
  <span className="notch-esquina notch-esquina--derecha" aria-hidden="true" />
  <nav ref={cajaRef}
       className="notch-caja flex flex-col items-center bg-papel shadow-card">
    <div ref={tabsRef}
         className="flex w-max items-center gap-1 whitespace-nowrap px-2 py-2">
      {tabs}                                            {/* capa 2: tabs */}
    </div>
    {abierto ? (
      <div key={abierto} ref={panelRef} className="notch-panel w-max">
        <PanelMenu id={abierto} />                      {/* capa 3: panel */}
      </div>
    ) : null}
  </nav>
</div>
```

**⚠️ Trampa №5 — `overflow: hidden` se comería las esquinas cóncavas.** La caja
que anima tamaño NECESITA `overflow: hidden` (si no, durante el morph el panel
se ve desbordando la caja pequeña). Pero `.notch-esquina` vive FUERA de la caja
(`right: 100%` / `left: 100%`) — como hija de la caja, el overflow la
recortaría. Por eso las esquinas son **hermanas** de la caja, dentro del marco
`relative w-max` que no recorta. El marco es shrink-to-fit alrededor de la
caja, así que su ancho sigue al ancho animado de la caja **en cada frame** y
las esquinas viajan pegadas a los bordes del notch durante el morph, gratis.

**Por qué `flex flex-col items-center` en la caja:** los tabs y el panel se
centran respecto a la caja. Como el wrapper está centrado en la página
(`left-1/2 -translate-x-1/2`, y el translate se resuelve contra el ancho
ACTUAL en cada frame), la caja crece simétrica alrededor de su centro fijo →
**los tabs no se mueven ni un píxel al abrir** (el detalle que vende el efecto:
la caja crece alrededor de unos tabs quietos). Además, centrado flex "unsafe"
(el default) hace que un panel más ancho que la caja a mitad de morph desborde
por los DOS lados por igual → el recorte del overflow es simétrico y el panel
se "revela" desde el centro.

`key={abierto}` en el panel: al cambiar de tab el panel se re-monta y la
animación de entrada (§11.2) se reproduce de nuevo.

La clase `.notch-menu` desaparece (su `border-radius` se muda a `.notch-caja`).

### 11.2 El morph — medir con JS, animar con CSS

`width`/`height` no se pueden transicionar hacia `auto`/`max-content` (el
`interpolate-size` de CSS es demasiado nuevo para fiarse). Patrón: **JS mide,
CSS anima** — el mismo reparto de papeles que el dock (§10): el JS solo escribe
custom properties, la transición vive en CSS.

En `notch-menu.tsx`, un `useLayoutEffect` sobre `[abierto]`:

```
ancho = max(tabsRef.offsetWidth, panelRef?.offsetWidth ?? 0)
alto  = tabsRef.offsetHeight + (panelRef?.offsetHeight ?? 0)
cajaRef.style.setProperty('--notch-ancho', `${ancho}px`)
cajaRef.style.setProperty('--notch-alto',  `${alto}px`)
```

y un `ResizeObserver` sobre tabs y panel que re-ejecuta la misma medición
(cubre resize del viewport — los megamenús miden `92vw` — y el reflow cuando
carga Poppins).

**⚠️ Trampa №6 — medir el tamaño intrínseco, no el recortado.** Para que
`offsetWidth` del panel dé su ancho REAL aunque la caja aún esté pequeña, el
panel lleva `w-max` (no se deja apretar por la caja; el overflow lo recorta
mientras tanto). Los megamenús ya traen ancho propio (`min(92vw, 880px)` /
`min(92vw, 620px)`), los dropdowns `w-60`/`w-56`.

**⚠️ Trampa №7 — sin flash en el primer paint.** `useLayoutEffect` corre ANTES
del primer paint: las properties ya están puestas cuando el navegador pinta →
ni se ve un notch a tamaño 0 ni se anima nada al cargar. Fallback en CSS por si
acaso: `width: var(--notch-ancho, max-content)`.

CSS (`componentes.css`, sección nueva documentando este porqué):

```css
.notch-caja {
  width: var(--notch-ancho, max-content);
  height: var(--notch-alto, auto);
  overflow: hidden;
  border-radius: 0 0 var(--radius-notch) var(--radius-notch);
  transition:
    width var(--notch-transicion) var(--notch-easing),
    height var(--notch-transicion) var(--notch-easing);
}

/* El contenido entra en fade cuando la caja ya va llegando (el delay evita
   ver el panel entero recortado a mitad de morph). Derivado del token con
   calc() — cero números nuevos. */
.notch-panel {
  animation: notch-panel-entrada calc(var(--notch-transicion) * 2 / 3) var(--notch-easing) both;
  animation-delay: calc(var(--notch-transicion) / 3);
}

@keyframes notch-panel-entrada {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .notch-caja { transition: none; }
  .notch-panel { animation: none; }
}
```

Sí, transicionar `width`/`height` provoca layout en cada frame — y aquí está
BIEN: es un solo elemento pequeño, es un prototipo, y la alternativa
(`transform: scale`) deformaría el contenido. No "optimizar" esto.

**El cierre es la versión simple a propósito:** al cerrar, el panel se
desmonta al instante y la caja blanca se encoge vacía (~300 ms). Se ve digno
porque la caja es blanca. Si a Samuel el cierre le parece brusco, el
refinamiento (mantener el panel montado con fade-out hasta `transitionend`) se
hace DESPUÉS, como retoque pedido — no de serie, que es donde nacen los bugs
de estados fantasma.

### 11.3 Los cuatro paneles, adaptados al notch

Regla general: **el notch ES el chrome ahora**. Los paneles pierden la card
flotante (`rounded-card bg-papel shadow-card ring-1 ring-linea` que hoy pone
`header.tsx`) — dentro del notch van a pelo, separados de los tabs por un
hairline `border-t border-linea` en `.notch-panel` (eco del `border-b` que el
header sólido siempre tuvo). Si en pantalla el hairline estorba, quitarlo es
una línea — decisión visual de Samuel.

- **`MegaTours` / `MegaEventos`:** sin cambios internos — su grid, fotos y
  anchos (`min(92vw, 880px)` / `min(92vw, 620px)`) ya funcionan como contenido
  del notch. El notch expandido a 880px es el estado más ancho del sistema.
- **Nosotros / Ayuda:** hoy son JSX inline en `header.tsx`. Se extraen a
  `src/components/home/dropdown-nosotros.tsx` y `dropdown-ayuda.tsx` (un
  componente = un futuro componente Figma), conservando SOLO el layout interno
  (`w-60`/`w-56`, `p-2`, `flex flex-col gap-0.5` y sus links) — el chrome se
  queda en el wrapper de la rama `solida`.
- **`PanelMenu`** (dentro de `notch-menu.tsx`): el mapa `MenuId → panel`. El
  tipo `MenuId` se exporta desde `header.tsx` y se consume con `import type`
  (sin ciclo en runtime).
- **La rama `solida` no muere:** conserva los paneles flotantes de siempre
  (ahora importando los dropdowns extraídos). Es la variante para futuros usos
  fuera del hero y no se toca su comportamiento.
- **A11y de paso:** los 4 botones trigger ganan
  `aria-expanded={menuAbierto === id}` (en ambas variantes). El cierre por
  Escape y click-fuera ya funciona y no se toca: el notch sigue viviendo
  dentro de `navRef`.

### 11.4 El detalle Apple: logo y «Reservar» se apartan

A 1024px de viewport, un notch de 880px deja ~72px por lado: **pisa el logo y
el botón Reservar**. En vez de encoger los megamenús, se copia el gesto de la
Dynamic Island (cuando se expande, los iconos de estado se desvanecen): con
cualquier menú abierto en `sobreVideo`, el logo y el grupo de la derecha pasan
a `opacity-0 pointer-events-none` con
`transition-opacity [transition-duration:var(--notch-transicion)]`, y vuelven
al cerrar. El menú abierto es transitorio y contiene sus propios caminos a la
reserva — no se pierde nada. (Si a Samuel no le gusta el fade, la alternativa
es capar el ancho de los megamenús; se decide viéndolo.)

### 11.5 Tokens nuevos (`styles/tokens.css`)

Fuente del prototipo de Figma, como `--ticker-duracion`:

```css
--notch-transicion: 300ms;                       /* morph ancho/alto del notch */
--notch-easing: cubic-bezier(0.32, 0.72, 0, 1);  /* arranque vivo, aterrizaje suave (curva estilo Apple) */
```

El fade de entrada del panel y el fade del logo/Reservar derivan de estos dos
con `calc()` — ningún número nuevo fuera de tokens.

### 11.6 Dev Mode (mismo commit — regla del proyecto)

Los deep-links `?dev-mega=tours|eventos|nosotros|ayuda` **ya existen y ahora
abren el notch expandido** (el estado llega por el mismo `setMenuAbierto`) —
son, sin tocarlos, los 4 frames de Figma del notch abierto. En
`dev-registry.ts`, mismo commit:

- Description de «Header + Footer»: los menús ya no son cards flotantes — el
  notch se expande y los contiene (estilo Dynamic Island).
- Nota en cada estado `dev-mega`: «abre el notch expandido (v3-F8)».

`/fundaciones`: añadir `--notch-transicion` / `--notch-easing` al párrafo de
Movimiento (junto a `--ticker-duracion` y los `--ticker-dock-*`).

### 11.7 Traspaso a Figma (anotar en `notch-menu.tsx` y README)

El notch es un **componente interactivo de 5 variantes**: `cerrado`, `tours`,
`eventos`, `nosotros`, `ayuda`. Transición entre variantes: Smart Animate,
duración = `--notch-transicion`, easing = curva custom con los 4 valores del
token. Nombres de capa idénticos entre variantes (regla Smart Animate): la
caja, la fila de tabs y el slot del panel conservan nombre; cambia solo el
contenido del slot. Las esquinas cóncavas van como vectores fijos fuera de la
caja. El fade del logo/Reservar se anota como parte de la misma transición.

### 11.8 Verificación (Playwright, antes de dar por cerrada la fase)

A 768 / 1024 / 1440 px:

1. **Los tabs no se mueven al abrir**: `getBoundingClientRect` del botón
   «Tours ▾» cerrado vs. abierto → idéntico (±1px). Es LA prueba del efecto.
2. Con cada `?dev-mega=…`: el panel completo queda dentro de la caja tras la
   transición (rect del panel ⊆ rect de la caja), las esquinas cóncavas se ven
   pegadas a los bordes del notch expandido, y nada recortado.
3. Morph directo tours → eventos (dos clicks): la caja pasa de 880 a 620 de
   ancho SIN pasar por el estado cerrado (capturas durante la transición — la
   captura es la fuente de verdad para movimiento, lección del cerebro).
4. Logo y Reservar: `opacity: 0` con menú abierto, vuelven al cerrar, y no
   interceptan clicks mientras están ocultos.
5. Escape y click-fuera cierran; click DENTRO del panel no cierra.
6. `prefers-reduced-motion: reduce` (con `emulateMedia`, no solo el dev-flag):
   abre/cierra instantáneo, sin transición ni fade.
7. 0 errores de consola (full reload antes de creer en uno — HMR stale), 0
   overflow-x de página, `tsc` y `npm run build` limpios, grep de valores
   mágicos fuera de `tokens.css`/`fundaciones.tsx`/`src/dev/`.
8. Móvil (390px): nada de esto aplica ni se cuela — el notch sigue `hidden`
   bajo `md:` y `MenuMovil` intacto.

### 11.9 Fuera de alcance de esta fase (no mezclar)

- Los pendientes previos del header/hero: fila del header con max-width
  (logo/Reservar muy a los extremos) y retipografiado del H1 (3 líneas) +
  lead (2 líneas). Son otra fase — no colarlos en este commit.
- Botones flotantes de WhatsApp/idioma (pendiente desde la retirada de la
  topbar).
- Abrir menús por hover: se mantiene el click. Cambiarlo es otra conversación.
- El refinamiento del cierre con fade-out (§11.2) — solo si Samuel lo pide
  tras verlo.

---

## §14 · V3-F11 — La pirámide de confianza sube un nivel: rating sobre el título, stats al hero, premios protagonistas

Estado: **planificado** (pedido de Samuel, 2026-07-14). **Escrito para ejecutarse
con Sonnet.**

⚠️ **Enfoque descartado por Samuel — no volver a intentarlo:** meter stats +
logos bajo el fold COMPACTANDO (titular del hero a 3 líneas para acortarlo,
márgenes de la banda de premios recortados). Se rechazó explícitamente: el hero
no se achica (al contrario: **Samuel planea hacerlo MÁS ALTO** después), y
apilar dos bloques comprimidos no es una solución, es una concesión. La
solución es estructural: cada señal de confianza sube un nivel de jerarquía y
la sección post-hero deja de ser una pila.

### 14.0 El pedido, traducido

| # | Pedido de Samuel | Traducción técnica |
|---|---|---|
| 1 | Quitar «PUNTA CANA · BÁVARO» | El eyebrow de localización desaparece. La localización NO se pierde: el H1 ya dice «…de Punta Cana…» (constancia, no optimización en silencio — decisión de Samuel 2026-07-14) |
| 2 | Las estrellas 4.9 + reseñas + los 2 chips (TripAdvisor 7 años, Premios Viator) suben ARRIBA del título, a donde estaba el eyebrow | La fila de confianza completa se muda tal cual (son chips de TEXTO y así se quedan — no se convierten en imágenes) al slot del eyebrow, encima del H1 |
| 3 | Donde estaba esa fila → los 4 stats | Los stats SUBEN AL HERO: fila blanca sobre el video, entre el subtítulo y el CTA, con las cifras a escala contenida (no compiten con el H1) |
| 4 | Donde estaban los stats → los logos de premios, más grandes | La sección post-hero pasa a ser SOLO la banda de premios: `stats.tsx` muere, nace `premios.tsx`, logos de 48px → 64px |

### 14.1 Antes / después

```
HOY                                   NUEVO
────────────────────────────────      ────────────────────────────────
PUNTA CANA · BÁVARO                   ★★★★★ 4.9 · 1.782 reseñas
H1                                      [#1 TripAdvisor · 7 años] [Premios Viator 22-24]
subtítulo                             H1  (intacto: max-w-xl, mismas líneas)
★★★★★ 4.9 · 1.782 reseñas + chips     subtítulo
CTA + bullets                         91.607 clientes · 4.454 días · ≤35% barco · 0 plástico
(ticker al pie)                       CTA + bullets
────────────────────────────────      (ticker al pie)
SECCIÓN: 4 cifras GIGANTES            ────────────────────────────────
  + border + RECONOCIDO POR           SECCIÓN: RECONOCIDO POR
  + 7 logos 48px                        + 7 logos 64px  ← y nada más
```

La lógica de la pirámide: el rating con sus 2 menciones (lo más condensado) va
arriba del todo; los números (la prueba en cifras) van sobre el video, junto al
CTA que deben empujar; los badges (la prueba visual, lo que MÁS le importa a
Samuel) se quedan con una sección entera para ellos solos, más grandes. Nada se
repite en dos sitios.

El hero crece ~50px de contenido con el cambio — **bien**: va en la dirección
del hero más alto que Samuel planea. Presupuesto del fold a 1080p (viewport
~950px): hero ~745 + padding de sección 64 + eyebrow 12 + gap 28 + logos 64 →
los logos acaban ≈ **913px** ✓. La banda de premios, al quedarse sola, cabe
bajo el hero incluso si éste crece otros ~35px.

### 14.2 F11-a — Los datos (`src/data/home.ts`)

`STATS` vive hardcodeado en `stats.tsx` y ahora lo necesita el hero → se muda a
`data/home.ts` (es contenido canónico: viene de `NOTAS['home-stats']` del
prototipo):

```ts
export type Stat = { valor: string; label: string }
export const STATS: Stat[] = [
  { valor: '91.607', label: 'clientes felices' },
  { valor: '4.454', label: 'días navegados' },
  { valor: '≤35%', label: 'de la capacidad del barco' },
  { valor: '0', label: 'plástico a bordo' },
]
```

Los textos NO se retocan (ni acortar labels «para que quepan»: el wrap está
previsto en 14.3).

### 14.3 F11-b — El hero (`hero.tsx` + `tokens.css`)

1. **Fuera el eyebrow** «Punta Cana · Bávaro» (el `<p className="text-eyebrow …">`).
2. **La fila de confianza sube** al slot del eyebrow: el bloque completo de
   `★★★★★` + `4.9 · 1.782 reseñas` + los 2 chips `bg-white/15` se mueve encima
   del H1 **sin tocar sus clases internas** (misma fila, otra posición). Pierde
   su `mt-6` (ahora es el primer elemento); el `mt-3` del H1 pasa a ser la
   separación fila→título (si respira poco, subir a `mt-4` — a ojo de Samuel).
3. **Los stats entran** donde estaba la fila: entre el subtítulo y el CTA.

```tsx
<div className="mt-6 flex flex-wrap items-start justify-center gap-x-10 gap-y-4">
  {STATS.map((s) => (
    <div key={s.label} className="text-center">
      <p className="font-display text-stat font-semibold text-white">{s.valor}</p>
      <p className="mx-auto mt-1 max-w-[16ch] text-xs text-white/80">{s.label}</p>
    </div>
  ))}
</div>
```

**⚠️ Trampa №8 — el token `--text-stat` cambia de valor, no de nombre.** La
cifra a 2.75rem era para una sección en blanco; dentro del hero competiría con
el H1 (3.5rem). El token pasa a `--text-stat: 1.5rem` (line-height 1.1 se
queda). Se conserva el NOMBRE porque sigue siendo «la cifra de stat» — en Figma
es el mismo text style con nuevo valor, no un style nuevo. Comentar el porqué
en `tokens.css` y actualizar la muestra de la type scale en `fundaciones.tsx`
(grep `text-stat` ahí). El uso `text-hero-movil` que `stats.tsx` le daba a las
cifras en móvil muere con la sección — verificar con grep que nada más lo
pierde.

**⚠️ Trampa №9 — contraste sobre video.** Los stats van en blanco sobre el
video con overlay del 45%. Verificar legibilidad contra el POSTER
(`?dev-hero=poster` — es el frame canónico, y es el frame que viaja a Figma).
Si falla, se ajusta `--color-overlay-hero` (el token), jamás un valor inline.

**⚠️ Trampa №10 — el CTA y el ticker deben seguir respirando.** El contenido
del hero gana una fila: el bloque del CTA baja y el ticker (absolute al pie,
`translate-y-1/2`) puede acercársele. Tras el cambio, medir: entre el bottom
del bloque CTA+bullets y el top de las cards del ticker deben quedar **≥ 24px**
a 1440px. Si no, subir el `pb-10` del bloque de contenido a `pb-14`/`pb-16`.

**Móvil (390px):** la fila de confianza arriba del título hará wrap a 2-3
líneas — se acepta de partida (wrap centrado, ya lo hace hoy) y se captura
screenshot para que Samuel juzgue si arriba pesa demasiado. Los stats harán
wrap a 2×2 solos (flex-wrap + `text-center`); verificar que ninguna cifra
queda huérfana en una fila de 3+1.

### 14.4 F11-c — La banda de premios (`stats.tsx` → `premios.tsx`)

- Renombrar archivo y componente: `stats.tsx` → **`premios.tsx`**, `Stats` →
  `Premios` (un componente = un futuro componente Figma, y este ya no es «la
  sección de stats»). `home.tsx`: `<Stats />` → `<Premios />` en el mismo sitio
  (el ticker sigue cayendo a caballo sobre una banda blanca — nada cambia ahí).
- El contenido queda: eyebrow «Reconocido por» + `<ul>` de los 7 logos. El
  `border-t` + `mt-12` + `pt-10` internos MUEREN (separaban logos de unas
  cifras que ya no están). El chrome de sección se queda:
  `border-b border-linea bg-papel px-5 py-seccion-sm sm:px-10`.
- **Logos más grandes:** `--spacing-premio-alto: 3rem → 4rem` (64px),
  `--spacing-premio-alto-movil: 2.5rem → 3rem` (48px). Los gaps de la fila
  suben en proporción (`gap-x-10 sm:gap-x-12`).

**⚠️ Trampa №11 — los assets hay que re-exportarlos, y algunos NO dan para 2×.**
Los webp actuales se exportaron a 96px de alto (2× del display de 48). A 64px
de display hacen falta 128px, así que se re-exportan desde los originales de la
web del cliente (`hispaniolaaquaticadventures.com/images/awards/`):

| webp | origen | nativo | exportar a |
|---|---|---|---|
| premio-tripadvisor | `ranking_en.png` | 222×82 | **nativo (82)** — no llega a 128, NO upscalear |
| premio-weddingwire | `wedding_wire2018-2021.png` | 250×250 | 128 de alto |
| premio-ltg | `LTG-Award-2021-2022.jpg` | 1147×461 | 128 de alto |
| premio-viator-2022/23/24 | `viator2022/3/4.png` | 95×109 | **nativo (109)** — no llega a 128, NO upscalear |
| premio-luxury-travel-guide | `award2016.jpg` | 734×243 | 128 de alto |

Regla: exportar a `min(nativo, 2×display)` — ampliar por encima del nativo solo
emborrona. Actualizar `ancho`/`alto` en `PREMIOS` (data/home.ts) con las
dimensiones nuevas de cada webp (reservan el hueco — CLS). TripAdvisor y los
Viator quedarán por debajo de 2×: limitación del material de origen, apuntada
en §9 para pedirle al cliente los assets en alta.

El tratamiento gris + color al hover (`.premio-logo`, decidido por Samuel) no
se toca.

### 14.5 Dev Mode (en el mismo commit de cada fase — regla del proyecto)

- Screen «Hero inmersivo + ticker»: description gana «fila de rating+premios
  ARRIBA del título (sustituye al eyebrow de localización), stats sobre el
  video entre subtítulo y CTA».
- Screen «Cinta de stats + premios» → renombrar a **«Banda de premios»**:
  description = solo los 7 logos, 64px, gris→color al hover; los stats ya no
  viven aquí sino en el hero.
- `/fundaciones`: actualizar la muestra de `--text-stat` (2.75rem → 1.5rem).

### 14.6 Traspaso a Figma

- El componente **Hero** gana dos filas nuevas (rating arriba, stats abajo) —
  mismas capas en todas las variantes (regla Smart Animate del ticker/§7.5 no
  se ve afectada: el ticker no cambia).
- **`premios.tsx`** = componente «Banda de premios»: 7 instancias de un
  componente `PremioLogo` con variante `reposo` (gris 72%) / `hover` (color).
- El text style **stat** cambia de valor (44 → 24) en las variables del
  traspaso — mismo nombre, anotar el cambio.

### 14.7 Verificación (Playwright, antes de dar por cerrada la fase)

A 390 / 768 / 1440 / 1920×950:

1. El hero muestra TODO su contenido nuevo sin recortes: fila de confianza
   arriba, H1 intacto (mismas líneas que hoy: el `max-w-xl` NO se toca), stats
   legibles, CTA con ≥24px de aire sobre las cards del ticker.
2. Contraste de los stats contra el poster (`?dev-hero=poster`) — captura para
   Samuel; si duda, se ajusta el token de overlay.
3. A 1920×950: la banda de premios entra completa bajo el hero (fin de los
   logos ≤ 950px — presupuesto de 14.1). A 1440×800 los premios pueden quedar
   parcialmente bajo el fold: se acepta (el rating y los stats ya están EN el
   hero, que es lo que Samuel pidió proteger).
4. Los 7 webp re-exportados cargan (0 × 404), nítidos a 64px en pantalla 2×
   (los que dan), y `ancho`/`alto` del data coinciden con el archivo real.
5. Móvil 390px: stats en 2×2 limpio, fila de confianza en wrap centrado
   (screenshot para Samuel), 0 overflow-x.
6. `grep -rn "STATS" app/src` → solo `data/home.ts` y `hero.tsx`;
   `grep -rn "stats" app/src/components` → 0 (el archivo ya no existe);
   0 errores de consola (full reload, no HMR), `tsc` y `npm run build` limpios.

---

## §12 · V3-F9 — El interior del notch (1): los dropdowns simples

Estado: **planificado** (pedido de Samuel, 2026-07-14, viendo la v3-F8 en
pantalla: «los tabs que tienen dropdown simple… se ve mal»). Primera de las dos
fases del **interior** del menú dinámico: aquí van Nosotros y Ayuda (los
dropdowns de texto plano). Los megamenús Tours/Eventos son la fase siguiente y
**no se tocan en ésta**.

### 12.0 El diagnóstico — no es el contenido, es el ancho

Medido con Playwright a 1440px, con el notch abierto:

| | ancho |
|---|---|
| fila de tabs (Tours…Ayuda) | **457 px** |
| panel «Nosotros» (`w-60`) | 240 px |
| panel «Ayuda» (`w-56`) | 224 px |

La caja del notch mide `max(tabs, panel)` (§11.2) → se queda en los **457 px de
los tabs**, y el panel, la mitad de ancho y centrado, deja ~110 px de blanco
muerto a cada lado. Eso es lo que se ve mal: no es que el contenido sea pobre,
es que **el panel no manda sobre la caja**. Es un problema que los megamenús no
tienen (880/620 px, mucho más anchos que los tabs) — por eso solo se nota en
estos dos.

De ahí las dos mitades del arreglo, en este orden:

1. El panel pasa a ser **más ancho que la fila de tabs**, para que la caja lo
   abrace y desaparezca el aire muerto.
2. Ese ancho hay que **llenarlo con algo que valga la pena** — de ahí el grid de
   2 columnas con icono + título + descripción que pide Samuel.

### 12.1 El patrón del ítem — chip cuadrado gris, no círculo aqua

Decisión de Samuel (2026-07-14): el icono va en un **cuadrado con radio y fondo
gris sutil**, no en el círculo aqua de `WhyDirect`. Se hereda de aquel patrón la
estructura (chip + título + descripción) pero no su color: el aqua se queda para
la home, y el menú se mantiene neutro.

```tsx
<EnlacePrototipo className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-papel-hueso">
  <span className="grid size-10 shrink-0 place-items-center rounded-btn bg-papel-hueso text-navy-soft
                   transition-colors group-hover:bg-papel group-hover:text-aqua-dark">
    <Icono className="size-5" />
  </span>
  <span className="min-w-0">
    <span className="block font-display text-sm font-semibold text-navy">{nombre}</span>
    <span className="mt-0.5 block text-xs text-navy-soft">{descripcion}</span>
  </span>
</EnlacePrototipo>
```

**El hover se invierte, y no es un capricho:** en reposo, chip **gris sobre fila
blanca**; al pasar el ratón, la fila se vuelve `papel-hueso` y el chip se va a
**blanco** (con el icono en aqua). Sin esa inversión el chip **desaparecería
dentro del hover** — los dos son `papel-hueso`, se fundirían en una sola mancha
gris. Es el único punto donde entra el aqua, y entra como acento de un icono de
20px: cuentagotas, dentro del guardarraíl (`direccion-visual.md` §6).

Radio del chip: `rounded-btn` (10px, `--radius-btn`) — el radio que ya tienen los
botones. No se inventa uno nuevo para esto.

Fondo `hover:bg-papel-hueso` en la fila (no la card con `ring` de MegaTours): son
**enlaces**, no productos. Con marco se leerían como 5 fichas de tour, que es
justo lo que no son.

**Iconos** (`lucide-react`, ya es dependencia; los 5 nombres verificados contra la
versión instalada, 1.24): `Users` (tripulación/flota), `Fish` (arrecife),
`CircleHelp` (FAQ), `MessageCircle` (contacto), `TicketCheck` (mi reserva).

### 12.2 Las descripciones — de dónde sale cada una

⚠️ **Ni una frase se inventa** (regla del proyecto). Cada descripción se deriva de
contenido que ya existe en `prototipo/datos.js`, y el comentario del código deja
la fuente por escrito:

| Ítem | Descripción | Fuente |
|---|---|---|
| La tripulación y la flota | «Capitán, bióloga marina, chef a bordo y guía de snorkel. Dos catamaranes y la cocina flotante.» | `TRIPULACION` (4 roles) + `FLOTA` (3 entradas) |
| El arrecife que reconstruimos | «El vivero de coral de Cabeza de Toro: proyecto de restauración top-3 del país.» | itinerario de `semi-privado`: «Arrecife de Cabeza de Toro: proyecto de restauración top-3 de RD» |
| Preguntas frecuentes | «14 preguntas: reservas y pagos, qué llevar, comida, clima, niños.» | `FAQ_CATEGORIAS` — 6 categorías, 14 preguntas (contadas) |
| Contacto | «WhatsApp, teléfono y formulario. Respondemos en minutos, de 8:00 a 20:00.» | página `/contacto` del prototipo (`renderContacto`): «Respondemos en minutos, 8:00-20:00 (GMT-4)» |
| Gestionar mi reserva | «Cambia tu menú o paga el saldo pendiente. Solo con tu código, sin cuenta.» | `NOTAS['mi-reserva']` |

⚠️ Ojo con la última: **no** decir «cambia tu fecha». El cambio de fecha, según la
FAQ, se hace **por WhatsApp**, no desde Mi Reserva (`FAQ_CATEGORIAS.reservas`) —
prometer eso en el menú sería una promesa que la página no sostiene, que es
exactamente el pecado que `NOTAS['mi-reserva']` dice haber venido a arreglar.

### 12.3 El grid de 2 columnas — y «Contacto» deja de ser un enlace a WhatsApp

Decisión de Samuel (2026-07-14): **2 columnas limpias, y el hueco no es
problema.** Nada de `col-span` ni de rellenos:

```
NOSOTROS                          AYUDA
┌──────────────┬──────────────┐   ┌──────────────────┬──────────────────┐
│ La tripulac. │ El arrecife  │   │ Preg. frecuentes │ Gestionar mi res.│
│ y la flota   │ que reconstr.│   ├──────────────────┼──────────────────┤
└──────────────┴──────────────┘   │ Contacto         │                  │
                                  └──────────────────┴──────────────────┘
```

**Y el cambio de fondo, que no es cosmético:** el ítem deja de ser «Contacto y
WhatsApp» (un `<a href="wa.me/…">` que sacaba al usuario de la web desde el
propio menú) y pasa a ser **«Contacto» → la página `/contacto`**, que ya existe
en el prototipo y tiene todo lo que hacía falta: WhatsApp con horario, teléfono
toll-free de EE.UU./Canadá, email, formulario y la dirección de la oficina (con
el aviso de que el día del tour te recogen en el hotel, que no vayas allí).

Es mejor menú: el usuario que abre «Ayuda» no siempre quiere WhatsApp — quiere
*una vía*. La página se las ofrece todas; el enlace directo solo ofrecía una, y
además rompía la sesión. El acceso de un toque a WhatsApp no se pierde: vuelve
como **botón flotante**, que ya estaba pendiente desde que se retiró la topbar.

⚠️ **Alternativa evaluada y descartada:** meter un 4º destino real para cuadrar la
rejilla. El prototipo tiene la página `/agentes` («Agentes de viaje»), sin usar
en el nav. Es **B2B** — no pinta nada en un menú de Ayuda dirigido al turista, y
el wireframe la dejó fuera del nav a propósito. Se queda fuera.

### 12.4 Tokens (`styles/tokens.css`)

```css
/* Ancho del panel de dropdown simple (Nosotros/Ayuda) dentro del notch.
   ⚠️ TIENE que ser mayor que la fila de tabs (457px medidos) o la caja se queda
   en el ancho de los tabs y el panel flota centrado con aire muerto a los
   lados — que es exactamente el bug que esta fase viene a arreglar (§12.0). */
--spacing-notch-panel: 32rem; /* 512px */
```

Un solo token: las 2 columnas salen de dividirlo, no de un segundo número.

### 12.5 Archivos

- `data/home.ts` — **nuevos exports `NAV_NOSOTROS` / `NAV_AYUDA`** (`{ id,
  nombre, descripcion }`). El contenido vive en los datos, como todo lo demás;
  el **icono se mapea en el componente** (`id → LucideIcon`), que es
  presentación, no contenido — y así `data/` no importa React.
- `components/home/item-menu.tsx` — **nuevo**. El ítem de §12.1 (chip + título +
  descripción). Sin variantes de ancho: las 2 columnas son todas iguales.
- `dropdown-nosotros.tsx` / `dropdown-ayuda.tsx` — de lista de links a grid de 2
  columnas de `ItemMenu`, con `w-notch-panel` y `p-4` (el padding de los
  megamenús, no el `p-2` de una lista). En Ayuda, el ítem de WhatsApp pasa a ser
  «Contacto» → `EnlacePrototipo` (la página `/contacto` vive en el prototipo);
  **desaparece el `<a href="wa.me/…">`** del menú.
- `menu-movil.tsx` — consume `NAV_NOSOTROS`/`NAV_AYUDA` en vez de repetir los
  links a mano (hoy son una **tercera copia** de los mismos textos). El acordeón
  **no cambia de aspecto en esta fase**: solo nombres, sin descripción (decisión
  de Samuel). Su rediseño es el §13, en commit aparte. ⚠️ Aquí también hay que
  cambiar «Contacto y WhatsApp» por «Contacto», o el móvil queda contradiciendo
  al desktop.
- `dev/dev-registry.ts` — §12.6.

**No se toca `notch-menu.tsx`:** el panel es un slot y esta fase solo cambia lo
que va dentro. Si el morph necesitara un ajuste para que esto entre, sería señal
de que la anatomía de §11.1 estaba mal — y no lo está.

### 12.6 Dev Mode (mismo commit — regla del proyecto)

**No hace falta ningún estado nuevo**: `?dev-mega=nosotros` y `?dev-mega=ayuda`
ya existen y ahora muestran el panel nuevo — son, tal cual, los 2 frames de
Figma. Solo se actualizan sus notas en el registry («panel de 2 columnas con
chip de icono + descripción»).

### 12.7 Traspaso a Figma

- `ItemMenu` = un componente, con un slot de icono (los 5 iconos, como
  componentes de icono sueltos) y **2 estados**: reposo (chip gris sobre blanco)
  y hover (fila gris, chip blanco, icono aqua) — la inversión de §12.1 hay que
  construirla en Figma como estado de hover del componente, no como dos
  componentes distintos.
- Nosotros y Ayuda son 2 de las 5 variantes del notch que §11.7 ya declaró: esta
  fase **no añade variantes**, rellena dos que estaban pobres.

### 12.8 Verificación (Playwright, antes de cerrar la fase)

1. **La caja abraza al panel** — la prueba de que §12.0 está resuelto: con
   `?dev-mega=nosotros` y `?dev-mega=ayuda`, el `rect` del panel ≈ el `rect` de
   la caja (misma anchura ±1px). Hoy sobran ~110px por lado; después, 0.
2. Los tabs **siguen sin moverse** al abrir (no romper §11.8.1 — la caja ahora
   crece también a lo ancho en estos dos menús, que antes no lo hacían).
3. Nada recortado por el `overflow:hidden` tras el morph, a 768 / 1024 / 1440. A
   768 el panel (512px) **no puede** tapar logo ni Reservar — comprobarlo: es el
   mismo riesgo que obligó a los megamenús a 2 columnas en F8.
4. Morph directo de un dropdown a un megamenú (nosotros → tours): la caja pasa de
   512 a 880 sin pasar por cerrado.
5. **El hover del ítem**: con el ratón encima, el chip NO se funde con la fila
   (los dos serían `papel-hueso` sin la inversión de §12.1). Se comprueba con
   captura, no leyendo estilos.
6. Móvil (390px): el acordeón de `MenuMovil` sigue igual tras consumir los datos
   compartidos — **es el punto donde un refactor de datos rompe sin avisar**.
7. 0 errores de consola, 0 overflow-x, `tsc` y `npm run build` limpios.

### 12.9 Decisiones cerradas y fuera de alcance

**Cerradas por Samuel (2026-07-14):**

- Grid de 2 columnas, **el hueco de Ayuda se queda vacío** — sin `col-span` ni
  cuarto ítem de relleno.
- «Contacto y WhatsApp» → **«Contacto»**, a la página `/contacto` (§12.3).
- Icono en **chip cuadrado gris**, no círculo aqua (§12.1).
- El número `+1 829 305 2804` **es el correcto** (confirmado) — pero ya no se
  muestra en el menú. Queda anotado aquí para los **botones flotantes**, que es
  donde volverá el acceso directo a WhatsApp.
- «Agentes de viaje» (`/agentes`): **fuera del menú**, es B2B.
- Móvil: **sin descripciones** en el acordeón.

**Fuera de alcance de esta fase:** los megamenús Tours/Eventos (fase siguiente),
el rediseño del menú móvil (§13, commit aparte), y los pendientes de siempre
(max-width de la fila del header, H1 a 3 líneas / lead a 2, botones flotantes).

---

## §13 · V3-F10 — El menú móvil como objeto

Estado: **planificado** (pedido de Samuel, 2026-07-14: «al igual que el hero, que
no llega a sangre, podemos hacer eso con el menú móvil, que se sienta como un
objeto que se despliega»). **Commit aparte de F9** — es otro componente y otro
riesgo.

### 13.1 El diagnóstico

`MenuMovil` es hoy un `fixed inset-0 bg-papel` — una **pantalla** que sustituye a
la página, no un objeto que se despliega sobre ella. Aparece y desaparece de
golpe (montaje/desmontaje seco, sin transición). Es lo único del sitio que
todavía va a sangre, justo ahora que el hero, el ticker y el notch construyen la
idea contraria: **cosas con margen, radio y borde que viven sobre el fondo**.

Y al auditarlo aparecen tres fallos de UX que no son estéticos:

1. **El fondo sigue scrolleando detrás** del menú abierto (no hay bloqueo del
   scroll del `body`). Se cierra el menú y la página está en otro sitio.
2. **`Escape` no cierra** (el desktop sí lo hace desde F8 — el móvil no).
3. **No hay foco atrapado**: con teclado (o lector de pantalla) se puede tabular
   fuera del menú abierto, hacia la página de detrás.

### 13.2 El objeto — mismo margen y mismo radio que el hero

El panel deja de ser pantalla completa y pasa a ser una **hoja** con el mismo
margen y el mismo radio del hero (los tokens ya existen: no se inventa nada):

```tsx
{/* Scrim: oscurece la página y cierra al tocarlo */}
<div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm md:hidden" onClick={onCerrar} />

{/* La hoja: margen + radio del hero → el mismo lenguaje que el resto del sitio */}
<div className="menu-hoja fixed inset-hero-margen z-50 flex flex-col overflow-hidden
                rounded-hero bg-papel shadow-hero md:hidden" role="dialog" aria-modal="true">
```

- Margen: `--spacing-hero-margen` (8px) — **el mismo del hero**, para que la hoja
  quede alineada con el borde del box de arriba. Es lo que hace que se lea como
  parte del mismo sistema y no como un modal genérico.
- Radio: `--radius-hero` (28px). Sombra: `--shadow-hero` (la que ya usa el hero).
- Scrim `bg-navy/40` + `backdrop-blur-sm`: la página se ve detrás, atenuada —
  que es lo que convierte al menú en **objeto encima** y no en pantalla nueva.

### 13.3 El despliegue — sale del header, como el notch

En desktop, los menús **salen del notch**. En móvil deben salir del mismo sitio:
el header. Por eso la hoja no entra desde abajo (patrón «bottom sheet», que aquí
mentiría sobre su origen) sino que **cae desde arriba**, con origen en el borde
superior:

```css
.menu-hoja {
  animation: menu-hoja-entrada var(--notch-transicion) var(--notch-easing);
  transform-origin: top center;
}

@keyframes menu-hoja-entrada {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .menu-hoja { animation: none; }
}
```

Reutiliza **los tokens del notch** (`--notch-transicion`, `--notch-easing`): la
misma familia de movimiento en las dos pantallas. Si un día se afina la curva del
notch, el móvil la hereda solo — que es precisamente para lo que se hicieron
tokens de movimiento.

### 13.4 Los tres fallos de UX (§13.1), arreglados

1. **Bloqueo de scroll**: `useEffect` mientras esté abierto →
   `document.body.style.overflow = 'hidden'`, restaurado en el cleanup.
   ⚠️ Guardar y restaurar el valor **previo**, no asumir `''` — el CTA sticky del
   hero y un futuro botón flotante pueden querer tocar lo mismo.
2. **Escape cierra**: mismo `keydown` que ya tiene el header (F8). Se puede
   copiar el patrón exacto de `header.tsx`.
3. **Foco**: `role="dialog"` + `aria-modal="true"` + foco al botón de cerrar al
   abrir, y devuelto al botón de hamburguesa al cerrar. Foco atrapado dentro de
   la hoja (un ciclo de `Tab` sencillo, sin librería).
4. **Cerrar tocando el scrim** (además de la X): es lo que la gente hace por
   instinto con un objeto.

### 13.5 Archivos

- `components/home/menu-movil.tsx` — scrim + hoja + los 4 arreglos de §13.4.
- `styles/componentes.css` — `.menu-hoja` (§13.3), con el porqué documentado.
- `dev/dev-registry.ts` — el estado `?dev-movil=abierto` **ya existe**; se
  actualiza su nota («hoja con el margen y el radio del hero, sobre scrim»).

**Sin tokens nuevos:** margen, radio, sombra, duración y easing salen todos de
tokens que ya existen. Si al verlo hiciera falta un margen propio para el móvil,
**se crea el token** (`--spacing-menu-margen`), nunca un valor suelto.

### 13.6 Verificación (Playwright, a 390px)

1. La hoja **no llega al borde**: hay `--spacing-hero-margen` por los 4 lados, y
   se ve el scrim alrededor.
2. Con el menú abierto, **el fondo no scrollea**: `window.scrollY` no cambia al
   hacer scroll sobre el scrim. Al cerrar, la página sigue donde estaba.
3. `Escape` cierra. Tocar el scrim cierra. Tocar dentro de la hoja **no** cierra.
4. El acordeón sigue funcionando (una sección abierta a la vez) y el CTA
   «Reservar ahora» sigue anclado abajo, dentro de la hoja.
5. `prefers-reduced-motion: reduce` (con `emulateMedia`): aparece sin animación.
6. La hoja **cabe**: con las 4 secciones y el CTA, a 390×844 no se corta el
   contenido — el cuerpo scrollea **dentro** de la hoja, no la página.
7. 0 errores de consola, 0 overflow-x, `tsc` y `build` limpios.

---

## §15 · V3-F13 — Aire: página ancha, hero a media pantalla, CTA con peso

> **Nota de numeración.** No hay «§ de F12»: la fase F12 (header capado a
> `max-w-6xl`, H1 a 3 líneas, lead a 2) se ejecutó al vuelo, sin sección de plan,
> y solo vive en comentarios de código. **Esta fase la revisa**: Samuel quiere la
> página **más ancha** (1400px, no 1152) y el H1 en **2 líneas** (no 3). Los
> comentarios `v3-F12` de `hero.tsx` y `tokens.css` que citan medidas viejas
> («a 896px envuelve en 3 líneas», «la fila se capa a max-w-6xl») **quedan
> mintiendo** — hay que reescribirlos, no dejarlos.

### 15.0 Punto de retorno

Esta fase **empieza con el árbol limpio**: F9 + F10 + F11 + F12 están sin
comitear. Se comitean primero (ese commit es el punto de retorno) y F13 arranca
encima. Si algo de esta fase no convence, `git revert` de un solo commit lo
devuelve todo.

### 15.1 El pedido, traducido

| # | Lo que pide Samuel | Lo que es, técnicamente |
|---|---|---|
| 1 | «El max-width del header y de toda la página, más amplio: ~1400px» | Un token de contenedor nuevo, aplicado en las 9 secciones + header |
| 2 | «El H1 en 2 líneas» | Ensanchar la columna del H1 (hoy 896px → 3 líneas) |
| 3 | «El notch de Nosotros/Ayuda a 624px» | `--spacing-notch-panel` 32rem → 39rem **+ variante compacta** (§15.4) |
| 4 | «El hero a ~78% del alto de pantalla, dejando ver los logos» | `min-height` en `svh` **+ presupuesto vertical** (§15.5) |
| 5 | «"de la capacidad del barco" sin salto de línea» | Reescribir el label y quitarle el clamp de `16ch` |
| 6 | «CTA más ancho y llamativo; los 2 checks debajo, en fila, con SVG y divisoria» | Variante `lg` de `Boton` + reordenar el bloque de CTA |

Los 6 son **independientes entre sí salvo 1↔3** (ensanchar la fila del header
cambia el sitio libre del notch — ver §15.4). Se pueden ejecutar en este orden.

### 15.2 Tokens nuevos (todos, de una vez)

En `tokens.css`, dentro de `@theme`:

```css
/* Ancho de contenido — el MISMO para el header y para todas las secciones:
   es la retícula de la página (en Figma, el layout grid). Sube de 72rem
   (max-w-6xl, el default de Tailwind que veníamos usando por inercia). */
--container-contenido: 87.5rem; /* 1400px */

/* Alto del hero (§15.5). svh, NO vh ni dvh — ver la trampa №2. */
--spacing-hero-alto: 78svh;

/* Panel de dropdown simple dentro del notch. 39rem, no 32: a 512px las 2
   columnas iban apretadas. ⚠️ Sigue teniendo que ser MAYOR que la fila de
   tabs (457px) — ver §12.4. */
--spacing-notch-panel: 39rem; /* 624px */
--spacing-notch-panel-compacto: 28rem; /* 448px — md–lg, ver §15.4 */

/* Halo del CTA principal. Es --color-coral al 35% (mismo patrón literal que
   --shadow-card, que lleva el navy a mano: no se puede meter una var() dentro
   de rgb()). Existe para que el botón despegue del video sin subirle el
   tamaño hasta lo hortera. */
--shadow-cta: 0 10px 30px rgb(239 91 68 / 35%);
```

`--container-*` es el namespace que alimenta a `max-w-*` en Tailwind v4 → el
token de arriba genera `max-w-contenido` solo. `--spacing-*` alimenta a
`min-h-*`/`w-*` → `min-h-hero-alto`, `w-notch-panel`, `w-notch-panel-compacto`.
**No inventar utilidades arbitrarias (`max-w-[1400px]`) para nada de esto**: son
variables de Figma, tienen que tener nombre.

### 15.3 Ancho de página: 1152 → 1400

Sustituir `max-w-6xl` por `max-w-contenido` en **10 sitios**: `header.tsx`,
`premios.tsx`, `tours-grid.tsx`, `why-direct.tsx`, `diferenciadores.tsx`,
`reviews.tsx`, `eventos-banda.tsx`, `galeria-faq-cierre.tsx` y `footer.tsx` (×2).

**No tocar** los `max-w-*` que no son la retícula de página: `dev/dev-mode.tsx`
(un modal), `pages/fundaciones.tsx` (una página de swatches) y los `max-w-*`
internos del hero (§15.6).

El padding lateral (`px-5 sm:px-10`) se queda como está: a 1400px de contenido
el aire de los lados lo pone ya el propio viewport.

⚠️ **Revisar a ojo** las 2 secciones donde ensanchar cambia proporciones, no solo
márgenes: `diferenciadores` (grid de 2 columnas → la foto se estira 124px más) y
`premios` (los 7 logos ya caben en 1 fila a 1152; a 1400 caben más holgados ✓,
el comentario del componente que justifica el `6xl` **hay que actualizarlo**).

### 15.4 El notch: 624px, y por qué eso obliga a una variante compacta

**Va como `width` del panel, no como `min-width` de la caja.** La caja del notch
mide `max(ancho de tabs, ancho del panel)` (`notch-menu.tsx`, el `useLayoutEffect`)
— si el panel mide 624px, la caja mide 624px. Un `min-width` en la caja haría lo
mismo por un camino más largo, y además rompería el estado cerrado (la caja
volvería a 624px con los tabs flotando dentro). Así que: `w-notch-panel` en
`dropdown-nosotros.tsx` y `dropdown-ayuda.tsx`, y el token hace el resto.

**El problema:** el notch está **centrado** y la caja crece **simétrica**. El
sitio libre a cada lado antes de tapar el logo o el botón «Reservar» es:

```
libre = anchoFila − 2 × (px-5 + max(ancho logo, ancho Reservar) + holgura)
      ≈ anchoFila − 312    (logo y Reservar miden ~112px los dos; holgura 24px)
```

| viewport | ancho de fila | libre para el notch | ¿caben 624px? |
|---|---|---|---|
| 768 (`md`) | 768 | ~456 px | **NO** — se come el logo |
| 900 | 900 | ~588 px | NO |
| 1024 (`lg`) | 1024 | ~712 px | **SÍ** |
| 1280 (`xl`) | 1280 | ~968 px | SÍ |
| ≥1400 | 1400 (capado) | ~1088 px | SÍ |

→ **El panel ancho arranca en `lg`, no en `md`.** Debajo de `lg` va
`w-notch-panel-compacto` (448px, el mismo ancho que ya usan los megamenús en ese
rango por esta misma razón). Y a 448px las 2 columnas **no tienen sitio para la
descripción** (cada celda daría ~160px de texto → 6 líneas): en `md`–`lg` la
descripción se oculta (`hidden lg:block` en `item-menu.tsx`), quedando chip +
título. Es la misma decisión que ya tomó Samuel para el móvil, aplicada a la
franja donde el ancho no da.

```tsx
// dropdown-nosotros.tsx / dropdown-ayuda.tsx
<div className="grid w-notch-panel-compacto grid-cols-2 gap-1 p-3 lg:w-notch-panel">
```

**Bonus que se cobra solo:** ensanchar la fila del header a 1400 devuelve sitio a
los megamenús. `MegaTours` bajó a `50rem` en F8 **porque la fila estaba capada a
1152**; con 968px libres a 1280 puede **volver a `55rem`** (880px, con 88px de
margen real). Restaurarlo y verificar. `MegaEventos` (38.75rem) se queda igual.

### 15.5 El alto del hero: 78%, y el presupuesto vertical

**`svh`, no `vh` ni `dvh`.** `vh` en móvil es el viewport GRANDE (barra de URL
escondida) → el hero mide más que la pantalla real y los logos nunca entran.
`dvh` cambia mientras scrolleas → el hero se reflowea y el ticker (que va a
caballo del borde) baila. `svh` es el viewport pequeño: la medida garantizada,
sin saltos. En desktop los tres valen lo mismo.

Va como **`min-height` en la caja del hero** (el div `.rounded-hero`), no en el
`<section>`: el `<section>` solo aporta el margen exterior. Y la caja pasa a ser
columna flex para que el aire sobrante se reparta:

```tsx
<div className="relative flex min-h-hero-alto flex-col rounded-hero">
  {/* capa de media: absolute, no participa del flex ✓ */}
  <div className="relative z-10 flex flex-1 flex-col">
    <Header variante="sobreVideo" />
    <div className="flex flex-1 flex-col justify-center px-4 pb-16 pt-8 ...">
```

**El presupuesto — esto es lo que hace o rompe el pedido.** «Que se vean los
logos» significa que, bajo el borde inferior del hero, todo esto tiene que caber
en el 22% restante:

| bajo el hero | px |
|---|---|
| mitad visible de la card del ticker (68px centrada en el borde) | 34 |
| `padding-top` de la sección de premios | 64 (hoy: `py-seccion-sm`) |
| eyebrow «Reconocido por» | ~14 |
| `mt-7` entre eyebrow y logos | 28 |
| alto de los logos | 64 |
| **total** | **204** |

Con eso, `hero + 12 (margen) + 204 ≤ alto de pantalla` → **el 78% solo cuadra en
pantallas de ≥982px de alto.** En un portátil de 1280×800 los logos se salen ~40px.
Dos ajustes lo arreglan sin tocar el 78%:

1. **Premios**: `py-seccion-sm` → `pt-8 pb-seccion-sm` (padding superior 64→32) y
   `mt-7` → `mt-4` entre eyebrow y logos. Total bajo el hero: **160px**.
2. **Hero**: bajar su padding superior (`pt-12 sm:pt-16 lg:pt-20` → `pt-8 sm:pt-10`).
   ⚠️ **Esto no es cosmético, es obligatorio**: `min-height` es un MÍNIMO — si el
   contenido natural mide más que el 78%, el hero crece y el 78% no existe. Con el
   H1 en 2 líneas (−67px) y el CTA reordenado, el contenido natural queda en
   ~606px, por debajo de los 624px que pide el 78% a 800px de alto → **manda el
   min-height, que es lo que Samuel pidió**. El aire que se quita del padding lo
   devuelve el `justify-center`.

**Criterio de aceptación** (medir, no mirar): a **1440×900** los logos se ven
**enteros** sin scroll; a **1280×800**, enteros o casi (≥80% de su alto). A
1366×768 se aceptan asomando. Si no sale, el ajuste va **en los paddings del
premio y del hero**, nunca bajando el 78% (es el número que pidió Samuel).

### 15.6 El H1 en 2 líneas

Hoy: columna de `max-w-4xl` (896px) + `--text-hero: 3.75rem` → **3 líneas**.
El titular son 58 caracteres; a 60px de Poppins semibold necesita ~1000–1100px de
caja para partirse en 2.

- Subir la columna del H1: `max-w-4xl` → **`max-w-5xl`** (1024px) y **medir**
  (`h1.offsetHeight / lineHeight`). Si siguen saliendo 3 líneas, subir a
  `max-w-6xl` (1152px). **Parar en la primera que dé 2** — no ensanchar «por si
  acaso»: cuanto más ancha la caja, más lejos queda el H1 de la lead y del CTA.
- Añadir **`text-balance`** al H1: con 2 líneas, `text-wrap: balance` las deja
  parejas en vez de dejar una línea larga y un rabo corto.
- La **lead** se queda en `max-w-xl` (2 líneas ✓, verificado en F12). Si al
  ensanchar el H1 se lee demasiado estrecha por contraste, subirla a `max-w-2xl`
  **solo si sigue dando 2 líneas**.
- **Móvil no cambia**: `--text-hero-movil` (2.25rem) y sus 4 líneas se quedan —
  a 390px las 2 líneas son físicamente imposibles (comprobado en F12 con todos
  los tamaños de 28 a 44px).

⚠️ **Para el traspaso a Figma**: `text-balance` no existe en Figma. Cuando se
lleve el H1, el salto de línea se hace **a mano** en el punto donde el navegador
lo dejó (anotarlo al preparar el frame).

### 15.7 El stat que se parte

`{ valor: '≤35%', label: 'de la capacidad del barco' }` se parte en 2 líneas
porque los 4 labels comparten un `max-w-[16ch]` y ese mide 24 caracteres.

- **Copy**: `de la capacidad del barco` → **`del aforo del barco`** (19 car.).
  «Aforo» ya es el vocabulario del proyecto (`aforo máx.` en las cards del ticker
  y en el megamenú de Tours), así que no introduce una palabra nueva: la reusa.
  El dato no cambia (sigue siendo el ≤35% de `NOTAS['home-stats']`).
- **Layout**: quitar `max-w-[16ch]` y poner `whitespace-nowrap` en el `<p>` del
  label. Con eso **los 4 labels pasan a una línea** (el más largo, 19 car. ≈
  114px a 12px), la fila de stats queda en una sola altura y el hero **recupera
  ~16px de presupuesto vertical** (§15.5, que van justos).
- Verificar a **390px** que la fila sigue envolviendo limpia (2×2) y no desborda.

Si Samuel prefiere conservar el copy original, `whitespace-nowrap` **solo** ya
resuelve el salto — pero el label largo desequilibra la fila. La recomendación es
el cambio de copy.

### 15.8 El CTA: peso al botón, los checks debajo

**Hoy** (`hero.tsx`): botón y checks van **en fila**, y los checks son un `<p>`
con el carácter `✓` y un `<br />`. Se pide: botón más ancho y llamativo, checks
**debajo**, **uno al lado del otro**, con **icono SVG real** y **divisoria**.

**1. `Boton` gana una variante de tamaño** (`ui/boton.tsx`) — no un botón nuevo:
es el mismo componente de Figma con una property `tamaño`.

```tsx
const clases = 'inline-flex items-center justify-center gap-2 rounded-btn bg-coral font-semibold text-white transition hover:bg-coral-dark'
const tamaños = {
  md: 'px-5 py-3 text-sm shadow-sm',
  lg: 'px-8 py-4 text-base shadow-cta hover:-translate-y-0.5', // CTA principal
}
```
- `gap-2` en la base: permite meter un icono como hijo sin tocar nada más.
- `shadow-cta` (§15.2) es el halo coral: es lo que lo hace saltar sobre el video
  sin recurrir a una animación de pulso (hortera, y hay que apagarla con
  `prefers-reduced-motion`).
- `hover:-translate-y-0.5`: el botón se levanta. Guardarraíl de movimiento en
  `componentes.css` si hace falta apagarlo con reduced-motion.
- **El resto de botones no cambia**: `md` sigue siendo el default (header
  «Reservar», CTA sticky móvil, «Reservar ahora» del menú móvil).

**2. El bloque del hero pasa a columna** (botón arriba, checks debajo):

```tsx
<div className="mt-8 flex flex-col items-center gap-4">
  <Boton href="#tours" tamaño="lg">
    Ver disponibilidad
    <ArrowRight className="size-5" aria-hidden="true" />
  </Boton>

  <div className="flex flex-col items-center gap-2 text-xs text-white/90 sm:flex-row sm:gap-4">
    <span className="flex items-center gap-1.5">
      <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
      Cancelación gratis hasta 7 días antes
    </span>
    <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
    <span className="flex items-center gap-1.5">
      <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
      Confirma con solo 25% de depósito
    </span>
  </div>
</div>
```

- Iconos de **lucide** (`Check`, `ArrowRight`) — la librería que ya usa el
  proyecto (`item-menu.tsx`, `menu-movil.tsx`), no un SVG suelto.
- La divisoria es un `<span>` de 1px, **no** `divide-x`: en móvil los checks se
  apilan y una divisoria vertical entre filas apiladas se ve rota. Por eso
  `hidden sm:block` — aparece solo cuando de verdad van uno al lado del otro.
- «Más ancho» sale del `px-8 py-4` + el texto y el icono; **no** se le pone un
  `min-width` a mano. Si al verlo Samuel lo quiere aún más ancho, ahí sí entra un
  token (`--spacing-cta-min`), nunca un `w-[280px]`.

### 15.9 Archivos y Dev Mode

| archivo | qué cambia |
|---|---|
| `styles/tokens.css` | 5 tokens nuevos/cambiados (§15.2) + reescribir el comentario `v3-F12` de `--text-hero` |
| `components/ui/boton.tsx` | variante `tamaño: 'md' \| 'lg'` |
| `components/home/hero.tsx` | `min-h-hero-alto` + flex, paddings, columna del H1, `text-balance`, bloque de CTA, label del stat |
| `components/home/header.tsx` | `max-w-6xl` → `max-w-contenido` |
| `components/home/item-menu.tsx` | descripción `hidden lg:block` |
| `dropdown-nosotros.tsx` / `dropdown-ayuda.tsx` | `w-notch-panel-compacto lg:w-notch-panel` |
| `components/home/mega-tours.tsx` | `xl:w-[min(92vw,55rem)]` (restaurado) + comentario nuevo |
| `components/home/premios.tsx` | `max-w-contenido`, `pt-8`, `mt-4` + comentario nuevo |
| `data/home.ts` | label del stat: `del aforo del barco` |
| `tours-grid` · `why-direct` · `diferenciadores` · `reviews` · `eventos-banda` · `galeria-faq-cierre` · `footer` | `max-w-6xl` → `max-w-contenido` |
| `dev/dev-registry.ts` | actualizar descripciones de «Header + Footer», «Hero» y «Banda de premios» |

**Sin estados nuevos de Dev Mode**: esta fase no añade interacciones, cambia
medidas de las que ya hay. Los `?dev-mega=*` y `?dev-movil=abierto` siguen valiendo.

### 15.10 Trampas

1. **`min-height` es un mínimo, no una altura.** Si el contenido natural del hero
   crece (una línea más de H1, un stat que envuelve), el 78% deja de cumplirse en
   silencio. Por eso §15.5 exige bajar el padding y §15.7 exige los labels en una
   línea: es lo que mantiene el contenido por debajo del techo.
2. **`vh` mata el pedido en móvil** (viewport grande = hero más alto que la
   pantalla → los logos nunca entran) y **`dvh` lo hace bailar** (reflow al
   scrollear, con el ticker a caballo del borde). `svh`.
3. **624px no caben a 768px.** El notch crece simétrico desde el centro: sin la
   variante compacta de §15.4, el panel se come el logo. Verificar SIEMPRE con el
   menú **abierto** — cerrado no se nota.
4. **Ensanchar la fila del header mueve el logo y el «Reservar» hacia afuera** →
   los megamenús ganan sitio (bien), pero la geometría que se verificó en F8 ya no
   vale: **hay que re-verificarla entera**.
5. **Los comentarios `v3-F12` mienten después de esta fase.** Citan «max-w-6xl» y
   «a 896px envuelve en 3 líneas». Reescribirlos o borrarlos: un comentario que
   documenta una medida que ya no existe es peor que no tener comentario.
6. **`shadow-cta` lleva el coral a mano** (`rgb(239 91 68 / 35%)`) porque no se
   puede meter `var(--color-coral)` dentro de `rgb()`. Si algún día cambia el
   coral, este token **no se entera solo** — dejarlo dicho en el comentario.

### 15.11 Verificación (Playwright)

**Anchos** (1440 y 1920):
1. Las 9 secciones y el header comparten borde izquierdo y derecho: el contenido
   mide 1400px y está centrado. 0 overflow-x.

**Notch** (con cada menú ABIERTO, a 768 / 1024 / 1280 / 1440):
2. Ni el logo ni el botón «Reservar» quedan tapados —
   `document.elementFromPoint()` sobre el logo devuelve el logo, no el panel.
3. Nosotros y Ayuda miden **624px** desde `lg`, y 448px (sin descripciones) entre
   `md` y `lg`. La caja del notch los abraza: **sin aire muerto a los lados**.
4. `MegaTours` a 55rem desde `xl`, sin tapar nada.

**Hero** (1440×900 · 1280×800 · 1366×768 · 390×844):
5. El hero mide **~78% del alto del viewport** en desktop (±2%).
6. **Los logos de premios se ven sin scrollear** a 1440×900 (enteros) y a
   1280×800 (≥80%). Captura de pantalla como prueba, no solo el número.
7. El H1 son **2 líneas** en desktop; la lead, **2**. Medido, no a ojo.
8. La fila de stats: **4 labels de una línea**, ninguno partido.
9. En móvil el hero no se corta ni deja hueco: el contenido manda (min-height
   inactivo) y el ticker sigue a caballo del borde.

**CTA**:
10. Botón grande con halo e icono; los 2 checks **debajo**, en fila con la
    divisoria a 1440; **apilados y sin divisoria** a 390.
11. `prefers-reduced-motion: reduce` (`emulateMedia`): el hover del botón no se
    desplaza.

**Cierre**: `tsc` limpio, `npm run build` limpio, 0 errores de consola.

