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

**Constantes** (`sMax` = 1.12, `Rhombro` = 3.5 pasos, `Rnucleo` = 1.4 pasos,
`peso` = 0.75; paso = ancho + gap = 288 + 16 = 304 px):

| distancia | escala | del crecimiento máx. |
|---|---|---|
| card hovereada | **1.120** | **100%** |
| vecina inmediata | 1.041 | 34% |
| 2ª vecina | 1.012 | 10% |
| 3ª vecina | 1.002 | 1% |
| 4ª en adelante | 1.000 | 0% |

Son las escalas que viajarán a Figma como variantes.

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

- Card = componente con propiedad de variante `escala: 100 / 122 / 130` (los
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
