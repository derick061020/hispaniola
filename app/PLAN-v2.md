# PLAN v2 — Home «Boutique luminoso» (re-skin sobre la home ya construida)

Segunda iteración visual de la home, a partir de 4 referencias que pasó Samuel el
2026-07-13. **No se rehace nada desde cero**: se conserva el scaffold React, los datos,
las 35 fotos reales, el Dev Mode y el *sistema* de tokens. Lo que cambia es la **piel**
(forma, ritmo, aire) y se añaden **dos mecanismos nuevos** que Samuel pidió por nombre:
el hero con cards apiladas en rotación, y el "photo-stack" tipo polaroid.

La v1 queda recuperable en el tag **`v1.0-home-diseno`** — se puede comparar o volver en
cualquier momento. Esta v2 se construye encima, en el mismo `app/`.

## Leer ANTES de ejecutar

1. `app/PLAN.md` — cómo se construyó la v1 (estructura, principios, qué NO hacer).
   **Todos sus principios siguen vigentes**: tokens primero, contenido no inventado,
   fotos reales, un componente React = un futuro componente Figma, Dev Mode obligatorio.
2. `analisis/direccion-visual.md` §7 — el registro de este cambio de dirección.
3. `C:\Users\kevin\OneDrive\Desktop\Cerebro\playbooks\animaciones-a-figma.md` — **nuevo
   en esta fase**: la rotación de cards es una animación en loop y hay que construirla
   sabiendo que después va a Figma (loops = componentes interactivos; cada estado debe
   poder congelarse como frame estático). Leer antes de F1.

---

## 1. Las referencias (lo que Samuel dijo, literal)

Las 4 imágenes viven en el chat del 2026-07-13. **Antes de ejecutar, guardarlas en
`analisis/referencias-visuales/v2/`** (no pude escribirlas a disco desde el chat).

| # | Referencia | Qué dijo Samuel | Qué extraemos |
|---|---|---|---|
| 1 | **Journeo** (travel, claro y redondeado) | "me gusta la estética general" | Hero como **contenedor redondeado grande** (no full-bleed a sangre), mucho aire, nav en píldora centrada, chips/pills de filtro, stats grandes, cards de destino redondeadas. Base clara, acentos oscuros. |
| 2 | **Vacationeeze** (editorial boutique) | "me gusta la estética general **y la segunda sección con esas imágenes con un efecto como que tienen un borde blanco y sombra**" | Serif editorial en titulares, hero como **card oscura redondeada**, tira de logos "featured & awarded", y sobre todo el **photo-stack**: 3 fotos con passe-partout blanco + sombra, ligeramente rotadas y solapadas. |
| 3 | **Wanderlust** (naranja, más genérico) | "me gusta también, pero no tanto como las 2 primeras" | Poco. Solo confirma el patrón de grid de productos con precio "desde". **No copiar su look** (naranja, collage, iconitos). |
| 4 | **ExploreX** (teal + serif gigante) | "**no me gusta mucho la estética general**, me gusta **solo** que en el hero tiene esas cards stackeadas" | **Únicamente** el mecanismo de cards apiladas en el hero. Nada de su paleta ni su tipografía. |

**Síntesis de la dirección v2 — «Boutique luminoso»**: la base comercial-premium que ya
tenemos (navy + aqua + coral) pero **más aire, más redondez y más editorial** —
tomando la luminosidad y el redondeo de (1), el refinamiento serif y el photo-stack de
(2), y el hero de cards apiladas de (4).

**Lo que NO cambia**: la paleta (navy/aqua/coral/menta), la tipografía (Lora + Inter),
el contenido, el orden de las secciones y la lógica de conversión. Esto es un cambio de
**forma**, no de marca ni de estrategia. Si al ver el resultado Samuel quiere además
suavizar el coral o virar la base a un blanco más cálido, se trata como ajuste aparte
(está anotado en "Decisiones abiertas").

---

## 2. El hero: de buscador a cards apiladas

Samuel: *"quitar el tab buscador de disponibilidad y poner eventos stackeados que vayan
pasando con una animación de que la anterior se pone más grande y se pone activa, y la
que estaba activa hace una animación de que sube y se va para atrás de la cola, y así
sucesivamente"*.

### 2.1 Aviso de conversión (leer antes de borrar el buscador)

El buscador del hero **no era decorativo**: era el CTA principal del wireframe aprobado
(`NOTAS['home-hero']`: *"el buscador fecha+personas ES el CTA — patrón Civitatis:
disponibilidad antes que datos personales"*). Quitarlo sin más deja el hero sin camino
al dinero.

**Se quita igual (es lo que pidió Samuel), pero la baraja tiene que asumir ese trabajo.**
Por eso las cards apiladas **no son un carrusel decorativo**: cada card es un producto
real, clicable, con su precio y su CTA. El hero pasa de "busca disponibilidad" a
"mira lo que vendemos → entra al producto", que es un patrón de conversión igual de
válido (y el que usan las referencias 1, 2 y 4). Se conserva además:

- El **CTA primario** del hero ("Ver disponibilidad" → `#tours`).
- El **CTA sticky móvil** (ya existe).
- El **grid de los 4 tours** justo debajo, con sus precios.

Con eso el camino a reserva sigue estando en la primera pantalla y a un clic.

### 2.2 Qué muestran las cards

**Recomendación: los 4 tours** (Semi-Privado $99, Snorkel Lovers $98, Charter Privado
$55, Isla Saona "Consultar"). Son el producto que genera la reserva y ya tienen foto,
chip de audiencia, duración, rating y precio en `data/home.ts`.

Samuel dijo "eventos", que puede leerse como los tipos de evento (bodas, cumpleaños,
MICE…). **Está en "Decisiones abiertas"** — las cards se alimentan de un array en
`data/home.ts`, así que cambiar de tours a eventos (o a una mezcla) es cambiar una
constante, no reescribir el componente. Si no hay respuesta, se ejecuta con tours.

### 2.3 Mecánica exacta de la animación

Componente nuevo: `src/components/home/baraja-hero.tsx`.

- **Escenario** de altura fija (≈380px desktop / ≈300px móvil). Las N cards se
  posicionan `absolute`, centradas, y se les asigna una **profundidad** (0 = activa al
  frente; 1, 2, 3 = detrás, asomando hacia arriba).
- **Estilo por profundidad** (la baraja se abanica *hacia arriba*, que es lo que hace que
  "subir y ponerse al final de la cola" se lea natural):

  | Profundidad | transform | opacidad | z-index |
  |---|---|---|---|
  | 0 (activa) | `scale(1) translateY(0)` | 1 | alto |
  | 1 | `scale(.93) translateY(-18px)` | .60 | −1 |
  | 2 | `scale(.86) translateY(-34px)` | .35 | −2 |
  | ≥3 | `scale(.80) translateY(-46px)` | 0 | −3 |

- **Estado**: un array `orden` con los slugs. La card activa es `orden[0]`. Avanzar =
  `orden = [...orden.slice(1), orden[0]]` — la que estaba al frente pasa al final de la
  cola. Al cambiar su profundidad de 0 al máximo, la transición CSS la hace **subir,
  encoger y desvanecerse hacia atrás** exactamente como pidió Samuel. La siguiente pasa
  de profundidad 1 a 0 → **baja y se agranda hasta activa**.
- **Transición**: `transform .6s cubic-bezier(.4,0,.2,1), opacity .6s`. Auto-avance cada
  **4000ms** con `setInterval` (limpiar en `useEffect` cleanup).
- **Interacción**: clic en una card de atrás → la trae al frente (rota `orden` hasta que
  esa card sea la primera). Hover sobre el escenario → **pausa** el auto-avance.
- **Accesibilidad**: si `prefers-reduced-motion: reduce`, **no hay auto-avance** — se
  muestra la baraja estática con la primera card activa y los controles siguen
  funcionando por clic.
- **Contenido de la card**: foto real, chip de audiencia, nombre, duración, rating,
  precio "desde" (o "Consultar" en Saona) y CTA. Cada card entera es un
  `EnlacePrototipo` (la ficha de tour vive en `prototipo/`).

### 2.4 Estados Dev (obligatorio — cada estado será un frame en Figma)

Registrar en `dev-registry.ts`:

- `?dev-baraja=semi-privado` · `=snorkel-lovers` · `=charter-privado` · `=isla-saona`
  → congela esa card como activa (**y detiene el auto-avance**, para poder capturar el
  frame limpio).
- `?dev-baraja=estatica` → simula `prefers-reduced-motion` (sin auto-avance).

> **Nota para el traspaso a Figma** (no se ejecuta ahora): esto es un **loop infinito**
> → según [[animaciones-a-figma]] se construye como *componente interactivo* con una
> variante por card activa + Smart Animate, no como timeline. Por eso **cada estado
> activo tiene que verse completo y bonito por sí solo**: si una card solo funciona "en
> movimiento", el frame estático de Figma queda roto.

---

## 3. El photo-stack (lo que Samuel señaló de la ref. 2)

Componente nuevo y **reutilizable**: `src/components/ui/pila-fotos.tsx`.

- Recibe un array de fotos reales (3–4) de `public/fotos/`.
- Cada foto va dentro de un **passe-partout blanco** (fondo blanco + padding ~10px,
  radio pequeño) con **sombra marcada** y una **rotación leve** alternada
  (p. ej. `[-5°, 3°, -2°]`), **solapándose** entre sí.
- **Hover**: la foto se endereza (`rotate(0)`), sube un poco y pasa al frente.
- **Móvil**: menos solape y rotaciones más suaves (o scroll horizontal) — que no se
  corten fotos ni desborde el ancho.
- Tokens nuevos: `--shadow-polaroid`, `--radius-foto`, `--matte-blanco`.

**Dónde se usa**: en la sección "El día, en imágenes" (hoy es un grid de 4 fotos plano)
y como candidato para el bloque de diferenciadores. Se construye como componente de
`ui/` precisamente para poder colocarlo en más de un sitio sin duplicar.

---

## 4. Tokens nuevos (F0)

Todo lo visual sigue pasando por `src/styles/tokens.css` (regla intocable — estos tokens
son las variables de Figma). Se **añaden**, no se reemplazan:

```
--radius-hero: 1.75rem;     /* contenedor redondeado del hero (refs 1 y 2) */
--radius-foto: 0.375rem;    /* foto dentro del passe-partout */
--shadow-polaroid: 0 14px 34px rgb(11 37 69 / 18%);
--shadow-baraja: 0 18px 44px rgb(11 37 69 / 22%);   /* card activa de la baraja */
--spacing-seccion: 7rem;    /* SUBE de 5rem → 7rem: el "aire" de la ref 1 */
--text-hero: 3.5rem;        /* SUBE de 3rem: titular editorial con más presencia */
```

Los dos últimos **modifican** valores existentes → hay que barrer las 9 secciones en el
navegador después de tocarlos, no solo el hero.

---

## 5. Fases (commit por fase, verificación Playwright antes de cada commit)

### V2-F0 — Fundaciones v2
- Añadir los tokens de §4 a `tokens.css`.
- Actualizar `/fundaciones` con los nuevos radios/sombras (que se puedan validar de un vistazo).
- Verificar que subir `--spacing-seccion` y `--text-hero` no rompe ninguna sección.
- Commit: `Home v2-F0: tokens de la direccion boutique luminoso`.

### V2-F1 — Hero: baraja de cards ⭐ (la pieza central)
- Leer [[animaciones-a-figma]] **antes** de escribir código.
- Quitar el buscador del hero. Mantener: eyebrow, titular, subtítulo, trust row, CTA
  primario y la meta de cancelación/depósito.
- Hero dentro de **contenedor redondeado** (`--radius-hero`) con margen lateral, no a
  sangre (refs 1 y 2).
- Construir `baraja-hero.tsx` con la mecánica exacta de §2.3.
- Registrar los 5 estados Dev de §2.4.
- Verificar: auto-avance, clic-para-traer-al-frente, pausa en hover, reduced-motion,
  y que **cada estado congelado se vea completo**.
- Commit + tag: `v2.1-hero-baraja`.

### V2-F2 — Photo-stack
- `ui/pila-fotos.tsx` según §3, con fotos reales ya curadas.
- Sustituir el grid plano de "El día, en imágenes".
- Verificar hover, y móvil (que no desborde).
- Commit + tag: `v2.2-photo-stack`.

### V2-F3 — Pase editorial sobre el resto de secciones
Aplicar el lenguaje nuevo (redondez, aire, jerarquía serif) a lo que ya existe:
- Cards de tour, why-direct, diferenciadores, reviews, banda de eventos: radios,
  sombras y espaciados coherentes con el hero.
- Ritmo vertical con el nuevo `--spacing-seccion`.
- Chips/pills de la ref. 1 donde aporten (eyebrows de sección).
- **No tocar el contenido ni el orden.**
- Commit: `Home v2-F3: pase editorial sobre secciones existentes`.

### V2-F4 — Responsive + QA + cierre
- Barrido a 390 / 768 / 1440: la baraja y el photo-stack son lo que más riesgo tiene de
  romperse en móvil.
- `prefers-reduced-motion` verificado de verdad (emulación en Playwright).
- `grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/ src/pages/` → 0 hits nuevos.
- Build de producción limpio, 0 errores de consola.
- Actualizar `app/README.md` (secciones nuevas + cómo congelar la baraja).
- Commit + tag: `v2.0-home-boutique`.

---

## 6. Qué NO hacer

- **NO** rehacer la home desde cero: es un re-skin sobre lo construido.
- **NO** copiar la piel de la ref. 3 (naranja/collage) ni la de la ref. 4 (teal/serif
  gigante) — de la 4 solo se toma **el mecanismo** de la baraja.
- **NO** cambiar la paleta, la tipografía, el copy, los datos ni el orden de secciones
  (eso es otra conversación — ver Decisiones abiertas).
- **NO** meter una librería de animación (Framer Motion etc.): CSS transitions + un
  `setInterval`. La regla de "sin librerías" sigue en pie, y además una animación con
  librería es más difícil de traducir a Figma.
- **NO** dejar la baraja como única vía a la reserva: el CTA primario, el sticky móvil y
  el grid de tours se quedan.

## 7. Criterios de éxito

- La home se siente **más cara y más aireada** que la v1, sin haber tocado marca ni copy.
- La baraja del hero rota sola, se puede pilotar con clic, respeta reduced-motion, y
  **cualquiera de sus estados congelado se ve como un frame terminado** (listo para Figma).
- El photo-stack se lee como el de la ref. 2 (passe-partout + sombra + rotación) y no se
  rompe en móvil.
- Cero valores sueltos fuera de `tokens.css`.
- `v1.0-home-diseno` sigue intacto para comparar.

## 8. Decisiones abiertas (Samuel decide al revisar este plan)

1. **¿Qué muestran las cards de la baraja?** → Recomendación: **los 4 tours** (son el
   camino al dinero y ya tienen todos los datos). Alternativa: los tipos de evento
   (bodas, cumpleaños, MICE…). Es un array en `data/home.ts`, se cambia en un minuto.
2. **¿Se toca el coral?** El coral `#EF5B44` es bastante fuerte para un look editorial.
   La v2 **no lo toca** por defecto. Si al ver F1 canta demasiado, se sustituye por navy
   en los CTA secundarios y se deja el coral solo para "Reservar".
3. **¿Base blanca o cálida?** Las refs 1 (blanco) y 2 (crema) difieren. La v2 mantiene el
   **blanco** actual. Virar a crema es un token (`--color-papel`) pero repinta el sitio
   entero — mejor decidirlo viendo F1 en pantalla.
