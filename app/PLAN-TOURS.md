# PLAN-TOURS — La ficha de tour: la página donde se reserva

Primera página del sitio después de la home. Es la **plantilla de ficha de tour**
(`/tours/:slug`, una plantilla data-driven para los 4 productos) — la página de
conversión: aquí el visitante tiene el precio delante, compara contra Viator y
decide. Todo el research de conversión del proyecto apunta a esta pantalla.

> **Escrito para ejecutarse con Opus.** Cada fase termina en un commit que deja
> la app funcionando. Las reglas de siempre aplican íntegras (CLAUDE.md del
> repo): todo pasa por tokens, cero valores mágicos, contenido de
> `prototipo/datos.js` (y del prototipo, su implementación canónica), fotos
> reales (jamás stock ni IA sin OK de Samuel), Dev Mode en el mismo commit,
> nada de `src/dev/` ni líneas `[dev-mode]` va a Figma, y el código nunca se
> importa a Figma.

---

## §0 · Las fuentes (leer ANTES de escribir una línea)

| Fuente | Qué aporta | Autoridad |
|---|---|---|
| `wireframes/wireframes-completos.html` — **Parte 2** (anclas `#ficha`, notas A1–A5) | La estructura aprobada de la página y el racional de cada bloque | Estructura |
| `prototipo/app.js` — `renderFicha()` y auxiliares (líneas ~560–780) | La **implementación canónica**: qué chips van por modo de booking, las 3 variantes del widget, el copy exacto que evolucionó después del wireframe | **Manda sobre el wireframe** donde difieren (es posterior y revisado) |
| `prototipo/datos.js` — `TOURS` completo (itinerario, incluye, faqTour…), `PLATOS` | El contenido. **Ni una frase se inventa** | Copy |
| `analisis/revision-wireframes.md` | Los fixes de conversión P1 que esta página DEBE respetar (§2 de este plan) | Conversión |
| `app/src/` (home actual) | La piel: tokens, componentes reusables, patrones ya resueltos | Visual |
| `analisis/direccion-visual.md` §6 | Guardarraíles de la dirección B (aqua con cuentagotas, el color lo ponen las fotos) | Visual |

⚠️ Donde wireframe y prototipo difieren, **gana el prototipo**. Ejemplos ya
detectados: el chip «WiFi a bordo» del wireframe no existe en el prototipo (WiFi
vive en la sección Incluye de la home); la tabla del menú dice «4 platos», no
«6»; las barras de distribución de reseñas (92% 5★…) del wireframe **no** están
en el prototipo porque el dato real no existe — no se pintan (ver §9).

---

## §1 · Alcance — qué se construye y qué NO

**Se construye:** la ruta real `/tours/:slug` en `app/` (React), una sola
plantilla que renderiza los 4 tours según su modo de `booking`
(`completo` / `cotizacion` / `consulta`), con el diseño final del sistema
actual (v3): Poppins, tokens, cards soft-UI, eyebrows minimal.

**NO se construye (frontera dura del build):**

- **El funnel de booking (4 pasos).** Está bloqueado por la decisión del motor
  (xpotours: reemplazar / re-skinear — pendiente del cliente, ver nota del
  cerebro). El CTA «Continuar» del widget es la frontera: se pinta con su
  estado real pero no navega (patrón `EnlacePrototipo`).
- **El listado `/tours`** (doble función listado/disponibilidad, wireframe
  Parte 1.5). Depende del mismo motor. Los breadcrumbs y «Ver todos los
  tours» siguen siendo `EnlacePrototipo`.
- **Mi Reserva, resultados de disponibilidad, 404 diseñado.** Un slug
  desconocido hace `<Navigate to="/" replace />` y ya.

⚠️ `app/PLAN.md` §«Qué NO hacer» dice «NO construir otras páginas (ni ficha ni
booking — solo la home)». **Este plan deroga la mitad de esa línea**: en F6 se
actualiza a «solo home + ficha de tour; el booking sigue fuera». No dejarla
mintiendo.

---

## §2 · Los fixes de conversión — el porqué de cada pieza

Esta página existe para convertir. Cada fix del research tiene su sitio y **no
es opcional**:

| Fix (revision-wireframes.md) | Dónde vive en esta página |
|---|---|
| 1.1 — sin bait-and-switch | El precio ancla del widget es **Light** (`precioLight`, «desde US$ 99»). Premium aparece SOLO como delta «+US$ 15» en la tabla del menú. Jamás un segundo precio completo |
| 1.2 — cero fuga a Viator | El link de reseñas dice **solo «TripAdvisor»**. Citar a Viator como fuente en texto está bien; un link de salida a Viator, JAMÁS |
| 1.6 — comparador donde se compara | Franja anti-OTA bajo el widget: «Mismo precio que en Viator o Civitatis — aquí con depósito del 25%…» + «Ver comparación →» |
| 2.3 — CTA persistente en móvil | Barra inferior fija propia de la ficha (precio + rating + CTA por modo) |
| A2 — «el widget ES la página» | El precio «desde» visible en el primer viewport, widget sticky en desktop |
| 2.7 — urgencia solo con dato real | Los «quedan N» de horarios NO se pintan en la ficha (son del paso 1 del funnel, y dependen del motor). El select de horario muestra solo hora + regreso |

---

## §3 · Punto de retorno

El working tree tiene trabajo sin comitear (rama `minimax`: rediseño de
IncluyeCrucero con video real, Diferenciadores eliminado…). Regla vigente
(2026-07-14): **Samuel avisa cuándo se comitea**.

**T-F0 (obligatorio antes de tocar nada):** pedir OK a Samuel, comitear el
estado actual, y tag local `pre-ficha-tour`. Ese es el punto de vuelta:

```bash
git reset --hard pre-ficha-tour
```

Sin ese commit no se empieza. Al cerrar el plan se etiqueta `v1.0-ficha-tour`.

---

## §4 · Anatomía de la página

```
┌───────────────────────────────────────────────────────────────┐
│ Header variante="solida" (sticky)          ← PRIMER USO REAL  │
├───────────────────────────────────────────────────────────────┤
│ Inicio / Tours / Semi-Privado Premium                          │
│ H1: Semi-Privado Premium — catamarán solo adultos              │
│ ★★★★★ 4.9 · 1,782 reseñas  [✓ Cancelación gratis]             │
│ [Solo adultos] [4 horas] [Recogida en hotel]                   │
├───────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┬──────────┬──────────┐              │
│ │ FOTO PRINCIPAL          │  foto    │  foto    │  MOSAICO     │
│ │ "quote de reseña"       ├──────────┼──────────┤              │
│ │                         │  foto    │ Ver las  │              │
│ │                         │          │ N fotos→ │              │
│ └─────────────────────────┴──────────┴──────────┘              │
├───────────────────────────────────────────────────────────────┤
│ [Itinerario · Incluye · Menú · Opiniones · FAQ]  ← anclas      │
│                                                    sticky      │
│ ┌──────────────────────────────┐  ┌─────────────────────┐      │
│ │ H2 «Un día de mar…»          │  │ WIDGET (sticky)     │      │
│ │ descripcionCorta             │  │ US$ 99 /pers desde  │      │
│ └──────────────────────────────┘  │ [14 chips de día]   │      │
│ ┌──────────────────────────────┐  │ Horario ▾ Personas ▾│      │
│ │ COMPARADOR anti-OTA (strip)  │  │ [Continuar — US$…]  │      │
│ └──────────────────────────────┘  │ ✓✓✓ (3 checks)      │      │
│                                   └─────────────────────┘      │
│ ITINERARIO (timeline + columna visual)                         │
│ QUÉ INCLUYE (4 cards) + noIncluido                              │
│ TU MENÚ (4 platos con foto + tabla Light/Premium)  ← completo  │
│ OPINIONES (4.9 grande + quote destacada) — solo TripAdvisor    │
│ FAQ DEL TOUR (acordeón, 1ª abierta) · TAMBIÉN TE PUEDE GUSTAR  │
│ Footer                                                          │
├───────────────────────────────────────────────────────────────┤
│ [US$ 99 /pers · ★4.9 · Cancela gratis]  [Elegir fecha]         │
│  ↑ barra móvil fija (md:hidden)                                 │
└───────────────────────────────────────────────────────────────┘
```

**Las 3 variantes de la plantilla** (el mismo layout, cambia el widget y qué
secciones existen — lógica calcada de `renderFicha`):

| | `completo` (semi-privado, snorkel-lovers) | `cotizacion` (charter-privado) | `consulta` (isla-saona) |
|---|---|---|---|
| Widget | fecha + horario + personas + CTA dinámico + 3 checks | precio desde + texto de cotización + «Pedir cotización» + WhatsApp | «US$ —» + «pendiente de confirmar» + WhatsApp |
| Chip «✓ Cancelación gratis» | sí | sí | **no** |
| Chip «Recogida en hotel» | sí | no | no |
| Comparador anti-OTA | sí | no | no |
| Sección Menú (+ ancla) | sí | no | no |
| H2 de descripción | «Un día de mar en grupo pequeño» (solo adultos) / «Un día de mar» | «Un día de mar a tu medida» | «Un día de mar» |
| Galería | mosaico 5 | mosaico 5 | **foto única** (no hay galería de Saona — Trampa №4) |
| CTA barra móvil | «Elegir fecha» (scroll al widget) | «Cotizar» | «Consultar» (WhatsApp) |

---

## §5 · Los datos — `src/data/tours.ts` (nuevo)

`data/home.ts` ya tiene el `Tour` de la home (nombre, precio, chips, galería de
5 portadas). La ficha necesita el resto. **No se duplica ni un campo**: el
archivo nuevo contiene SOLO lo que la home no tiene, y la página los une por
slug.

```ts
import type { Tour } from './home'   // solo el tipo; TOURS se importa en la página

export type PasoItinerario = { hora: string; titulo: string; texto: string }
export type Horario = { hora: string; regreso: string }
export type FichaTour = {
  tituloLargo: string
  audiencia: string
  duracion: string          // '4 horas' — la larga, no duracionCorta
  horarios: Horario[]       // sin `quedan` — ver §2, fix 2.7
  upgradePremium: number | null
  /** TODAS las fotos reales del tour (la galería de home.ts son las 5 portadas
   *  del carrusel del grid). Saona: [] — no existe galería, no se inventa. */
  galeriaCompleta: string[]
  /** Quote sobre la foto principal — portada de primeraResenaTour() de
   *  prototipo/app.js (implementación canónica). */
  quoteDestacada: string
  itinerario: PasoItinerario[]
  incluye: { titulo: string; texto: string }[]
  noIncluido: string
  faqTour: { p: string; r: string }[]
  tambienTeGusta: string[]  // slugs
}
export const FICHAS: Record<string, FichaTour> = { /* verbatim de datos.js */ }
```

- Portar **verbatim** de `prototipo/datos.js` (itinerario con sus `~`, textos
  con sus matices por tour, `noIncluido` incluidos los «PENDIENTE de confirmar»
  de Saona — son copy honesto, no placeholder a esconder).
- `galeriaCompleta`: contar los archivos reales de `app/public/fotos/`
  (`galeria-semi-privado-1..7`, `galeria-snorkel-lovers-1..9`,
  `galeria-charter-privado-1..7`). El «Ver las N fotos» sale de
  `galeriaCompleta.length + 1` (la portada `foto` de home.ts va primera en el
  lightbox) — **jamás un número hardcodeado** (el «33» del wireframe era
  placeholder).
- `formatoDinero` se importa de `data/home.ts` — no se duplica.
- Números con `toLocaleString('en-US')` («1,782») — la convención que ya usa
  toda la app.

---

## §6 · Orden de fases

| Fase | Entregable | Commit |
|---|---|---|
| T-F0 | Working tree consolidado (con OK de Samuel) + tag `pre-ficha-tour` | el commit de consolidación |
| T-F1 | `data/tours.ts` + ruta `/tours/:slug` + ScrollToTop + cabecera (header sólido, breadcrumb, H1, rating, chips) + footer | `Ficha T-F1: ruta, datos y cabecera` |
| T-F2 | Mosaico de galería + lightbox «Ver las N fotos» + variante Saona | `Ficha T-F2: galería (mosaico + lightbox)` |
| T-F3 | Widget de reserva (3 variantes + estados) + comparador anti-OTA + barra móvil fija | `Ficha T-F3: widget de reserva, comparador y barra móvil` |
| T-F4 | Itinerario + Incluye + Menú | `Ficha T-F4: itinerario, incluye y menú` |
| T-F5 | Opiniones + FAQ + «También te puede gustar» + nav de anclas sticky | `Ficha T-F5: opiniones, FAQ y anclas` |
| T-F6 | Enlaces reales desde la home + QA integral + docs + tag `v1.0-ficha-tour` | `Ficha T-F6: enlaces reales + QA + cierre` |

El widget va en F3 (no en F1) a propósito: es la pieza con más decisiones y
merece un commit limpio propio, con la página ya de pie alrededor.

Componentes nuevos en **`src/components/tour/`** (carpeta nueva — una por
página, como `home/`). Un componente React = un futuro componente Figma.
**Antes de crear cualquier pieza, grep por si ya existe**: `ui/etiqueta`,
`ui/boton` (tamaños md/lg), `ui/carrusel-imagenes`, `ui/insignia-confianza`,
el acordeón de `galeria-faq-cierre.tsx` — la home ya resolvió mucho de esto.

---

## §7 · T-F1 — Ruta, datos y cabecera

**Ruta.** `App.tsx`: `<Route path="/tours/:slug" element={<TourPage />} />`.
Slug desconocido → `<Navigate to="/" replace />`. Página en
`src/pages/tour.tsx`: une `TOURS.find(t => t.slug === slug)` + `FICHAS[slug]`
y reparte props a las secciones.

**⚠️ Trampa №1 — ScrollToTop no existe porque nunca hizo falta.** La app era
una sola página; React Router **no** resetea el scroll al navegar. Sin
arreglo, entrar a la ficha desde el footer de la home aterriza con el scroll
al fondo. Componente mínimo (`useLocation` + `window.scrollTo(0, 0)` en
effect) montado en `App.tsx`. Va en esta fase aunque los links reales lleguen
en F6 — se verifica navegando a mano.

**⚠️ Trampa №2 — el header `solida` está sin estrenar.** Existe desde v3-F8
(«la rama solida no muere») pero **ningún uso real la ha verificado** desde
entonces: sticky `top-0 z-40 bg-papel`, border-b, logo oscuro (el lockup real
`logo.png`, no el blanco), paneles flotantes clásicos (no el notch). Al
montarla: abrir los 4 menús, el móvil, y comprobar que el logo es el oscuro.
Lo que se encuentre roto se arregla en este commit (es parte de estrenarla).
El notch NO se porta a páginas interiores en este plan — decisión abierta §12.

**Cabecera de la ficha** (`components/tour/cabecera-ficha.tsx`):

- Breadcrumb «Inicio / Tours / {nombre}»: Inicio = `<Link to="/">`, Tours =
  `EnlacePrototipo` (el listado vive solo en el prototipo), nombre = texto.
- H1 = `tituloLargo`. Debajo, la fila de confianza: estrellas (mirar
  `ui/insignia-confianza.tsx` antes de pintar estrellas nuevas), «**4.9** ·
  1,782 reseñas», y los chips según la tabla de §4. Chips = `rounded-chip` +
  tokens existentes; el de cancelación en verde `menta`/`menta-texto` (ya hay
  precedente en la TourCard de la home).
- Footer: el de la home tal cual (`components/home/footer.tsx`).
- La página envuelve en `pb-16 md:pb-0` (hueco para la barra móvil de F3 —
  mismo patrón que `pages/home.tsx`).

**Dev Mode (mismo commit):** registrar screen «Ficha de tour (plantilla)» en
`dev-registry.ts` con ruta `/tours/semi-privado` y description que liste las 4
rutas como variantes (semi-privado = canónica, snorkel-lovers = familias,
charter-privado = cotización, isla-saona = consulta).

**Verificación:** las 4 rutas cargan sin errores de consola; slug falso
redirige a `/`; header sticky al scrollear; menús del header abren y cierran;
390/768/1440 sin overflow-x.

---

## §8 · T-F2 — La galería: mosaico + lightbox

**Mosaico** (`components/tour/galeria-mosaico.tsx`), desde `md`:

- Grid: foto principal (2×2, ~60% del ancho) + 4 celdas. Principal =
  `tour.foto` (la portada del producto); celdas = `galeriaCompleta[0..2]`; la
  4ª celda es el tile «Ver las N fotos →» (foto `galeriaCompleta[3]` con
  overlay — reusar `--color-overlay-foto`). Altura del mosaico con token nuevo
  `--spacing-mosaico-alto` (propuesta: `28rem`; a ojo de Samuel después).
  Radios: `rounded-card-grande` en el contorno (la estética soft-UI de la
  TourCard), fotos `object-cover`.
- **Quote flotante** sobre la foto principal (abajo-izquierda, card
  esmerilada `bg-papel/90 backdrop-blur-sm` — el mismo esmerilado del chip de
  audiencia de TourCard): `quoteDestacada` + «★★★★★». Es el patrón A1 del
  wireframe (prueba social ANTES de scrollear).
- **Móvil:** el mosaico colapsa a un carrusel — **reusar
  `ui/carrusel-imagenes.tsx`** (ya tiene flechas, puntos, reduced-motion
  resuelto). Auto-avance apagado aquí (es una galería que se hojea, no un
  escaparate — pasar el intervalo como off si el componente lo permite, o
  añadirle esa prop).

**Lightbox** (`components/tour/galeria-lightbox.tsx`): overlay a pantalla
completa con la galería completa (portada + `galeriaCompleta`), navegación
‹ › + contador «3 / 8», cierre con X, Escape y click en el fondo.
**Copiar los 4 arreglos del menú móvil** (PLAN-v3 §13.4, ya resueltos en
`menu-movil.tsx`): scroll-lock guardando el valor previo de
`body.style.overflow`, Escape, foco al abrir/devolver al cerrar,
click-fuera cierra. Fondo `bg-navy/90` (opacidad de utilidad sobre token,
precedente `bg-white/15`).

**⚠️ Trampa №3 — el tile de video NO va (por ahora).** El wireframe pinta una
celda «Video ▶». Existe asset real (`/video/hero.mp4`, del cliente), pero
meter video en el lightbox añade un reproductor y sus estados. Se deja como
decisión abierta (§12); el mosaico sale con 5 celdas de foto. No «mejorarlo»
por iniciativa.

**⚠️ Trampa №4 — Isla Saona no tiene galería.** `galeriaCompleta: []`. Su
cabecera muestra **una sola foto grande** (`tour-isla-saona.webp`, con la
quote flotante), sin tile de «Ver las N fotos» ni lightbox. Es la variante
honesta — no rellenar con fotos de otros tours (las galerías son POR
SERVICIO; mezclar barcos/planes en la ficha de Saona mentiría sobre el
producto).

**Dev Mode (mismo commit):** `?dev-galeria=abierta` — monta el lightbox
abierto en la foto 1 (el frame de Figma del lightbox). Línea marcada
`// [dev-mode]`. Registrar el estado en la screen de F1.

**Verificación:** mosaico a 1440 (5 celdas, radios, quote legible sobre la
foto — captura); N del tile = nº real de fotos; lightbox: Escape/click-fuera/
X cierran, el fondo no scrollea con él abierto y el scroll vuelve donde
estaba; móvil 390: carrusel funciona; Saona: foto única sin tile; 0 × 404 de
imágenes (`naturalWidth > 0`).

---

## §9 · T-F3 — El widget de reserva (el corazón), el comparador y la barra móvil

### 9.1 El widget (`components/tour/widget-reserva.tsx`)

Card `rounded-card-grande bg-papel shadow-card ring-1 ring-linea p-5` (el
lenguaje soft-UI de la TourCard — la «decisión de compra como objeto», misma
tesis que la sub-card de precio del grid). En desktop vive en la columna
derecha del grid principal:

```
lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]  ·  gap-8  ·  items-start
```

y es **sticky** (`lg:sticky`, top = `--spacing-sticky-top`, ver tokens §9.4).
En móvil va en flujo, después de la descripción.

**Variante `completo`** (estado local del componente):

1. Precio: `US$ 99` grande (`text-precio font-display`) + «/persona · desde»
   en `navy-soft`. El ancla Light, SIEMPRE (fix 1.1).
2. «Elige una fecha» (label eyebrow) + **fila de 14 chips de día**
   scrolleable (`hoy` … `hoy+13`, generados con `Date` nativo): día de semana
   corto arriba, número abajo. Dos días deshabilitados fijos (`hoy+3`,
   `hoy+10`, como el prototipo) — son el estado «agotado» que Figma necesita.
   Chip seleccionado = fondo navy, texto blanco.
3. Selects de **Horario** («9:00 AM — regreso 1:00 PM», de `horarios`) y
   **Personas** (1–6, default 2). Sin «quedan N» (§2, fix 2.7).
4. **CTA dinámico**: sin fecha → `disabled`, texto «Elige una fecha» (gris
   sobre `papel-hueso`, `cursor-not-allowed`); con fecha → coral
   (`Boton tamaño="lg"` a todo el ancho o sus mismas clases), texto
   «Continuar — US$ {precioLight × personas}». **No navega** (frontera del
   build): title del `EnlacePrototipo` explicando que el funnel vive en el
   prototipo.
5. Los 3 checks (copy exacto del prototipo): «✓ Confirma con 25% de depósito ·
   ✓ Cancela gratis hasta 7 días antes · ✓ Reembolso total por mal clima» —
   `text-xs`, apilados.

**Variante `cotizacion`** (charter-privado): precio «US$ 75 /persona · desde»,
párrafo «Este tour se cotiza a tu medida según nº de personas y menú — hasta
120 personas.», CTA primario «Pedir cotización» (`EnlacePrototipo` — el hub de
eventos vive en el prototipo) + botón secundario «WhatsApp directo» → **link
real** `https://wa.me/18293052804` (número confirmado, PLAN-v3 §12.9), con
`target="_blank" rel="noopener"`.

**Variante `consulta`** (isla-saona): «US$ —» + «**Precio pendiente de
confirmar con el cliente.** Duración y capacidad también están por definir.»
(copy canónico — es la verdad, no se maquilla) + CTA «Consultar por WhatsApp»
(link real).

### 9.2 El comparador anti-OTA (`components/tour/comparador-strip.tsx`)

Solo `completo`. Franja bajo el grid descripción+widget, a todo el ancho de la
columna de contenido: fondo `aqua-tint`, borde `aqua-dark` sutil — es de los
poquísimos usos legítimos del aqua como fondo (guardarraíl §6: aquí es un
**badge funcional de argumento**, no decoración; el precedente es el chip de
ocasión del ticker). Copy exacto:

> Mismo precio que en Viator o Civitatis — aquí con **depósito del 25%**,
> menú a elección y WhatsApp directo. — [Ver comparación →]

«Ver comparación →» = `EnlacePrototipo` (la página `/reserva-directa` vive en
el prototipo).

### 9.3 La barra móvil fija (`components/tour/barra-movil-ficha.tsx`)

`fixed inset-x-0 bottom-0 z-30 md:hidden`, fondo `bg-papel`, `border-t
border-linea` (mirar el CTA sticky de `hero.tsx` ~línea 284 y hablar el mismo
idioma). Izquierda: precio (`formatoDinero` o «Consultar») + «★ 4.9 · Cancela
gratis» (sin la parte de cancela en `consulta`). Derecha: el CTA por modo
(§4): «Elegir fecha» hace scroll suave al widget (`scrollIntoView`); «Cotizar»
= `EnlacePrototipo`; «Consultar» = WhatsApp real.

### 9.4 Tokens nuevos (`styles/tokens.css`)

```css
/* Ficha de tour (PLAN-TOURS.md §9) */
--spacing-ficha-widget: 24rem;  /* 384px — columna del widget en desktop */
/* Offset de los sticky de la ficha: alto real del header sólido + aire.
   ⚠️ MEDIR el header con getBoundingClientRect antes de fijarlo — no adivinar. */
--spacing-sticky-top: 5rem;     /* provisional: ajustar al medir */
--spacing-mosaico-alto: 28rem;  /* alto del mosaico de galería en desktop */
```

**⚠️ Trampa №5 — tres stickies apilados.** En esta página conviven el header
(`sticky top-0 z-40`), la nav de anclas (F5, sticky debajo del header) y el
widget (sticky debajo de ambas). Los offsets se derivan **del mismo token**
(`--spacing-sticky-top` y un `calc()` cuando F5 añada las anclas — precedente
`--spacing-premios-aire`), no de tres números sueltos que se desincronicen.
z-index: header 40 > anclas (30) > widget (auto). Verificar que el megamenú
del header abre POR ENCIMA del widget sticky.

**⚠️ Trampa №6 — el estado disabled también es un frame.** El CTA «Elige una
fecha» deshabilitado es una variante del componente Figma. No resolverlo con
`opacity` a pelo: colores de tokens (`papel-hueso` + `navy-soft`).

### 9.5 Dev Mode (mismo commit)

`?dev-widget=fecha` — fija fecha = primer día disponible, horario 9:00 AM,
2 personas → CTA activo «Continuar — US$ 198». Es el frame «widget lleno» de
Figma y la prueba del cálculo dinámico. Registrar en la screen de la ficha.

### 9.6 Verificación

Widget sticky acompaña el scroll a 1440 sin pisar footer (probar hasta el
final de la página); con `?dev-widget=fecha` el total es 198 (semi-privado) /
196 (snorkel-lovers); cambiar personas recalcula; sin fecha el CTA está
`disabled` real (no clickeable); charter y saona muestran su variante y los
links de WhatsApp abren wa.me correcto; barra móvil visible a 390 con su CTA
por modo, y «Elegir fecha» scrollea al widget; el megamenú abre por encima
del widget; 0 overflow-x.

---

## §10 · T-F4 — Itinerario, Incluye y Menú

### 10.1 Itinerario (`components/tour/itinerario.tsx`)

Grid 2 columnas desde `lg` (timeline | columna visual), `items-start`.

- **Timeline**: hora en `font-display font-semibold text-navy` a la
  izquierda, punto + línea vertical (`border-linea`) como raíl, título h4 +
  texto. Las horas con `~` van tal cual (es el copy: «~9:45»). En charter y
  Saona muchas horas van vacías — el raíl aguanta filas sin hora (probar).
- **Columna visual**: el mapa de la ruta del wireframe **no tiene asset** y no
  se inventa (ni SVG a ojo ni IA sin OK — §12). Provisional: una foto real
  del tour que no esté ya en el mosaico (elegir MIRANDO las fotos restantes de
  `galeriaCompleta`), `rounded-card-grande`, con un pie «Costa Bávaro → Cabo
  Engaño» solo si el tour es de esa ruta (semi-privado/snorkel: sí; charter:
  «Ruta a tu elección»; Saona: sin pie). Comentario en el componente: *mapa
  pendiente de asset — decisión abierta con Samuel*.

### 10.2 Qué incluye (`components/tour/incluye-tour.tsx`)

Eyebrow minimal «Qué incluye» + grid de 4 cards (2×2 en móvil):
`rounded-card ring-1 ring-linea p-4`, título semibold + texto `navy-soft`.
Sin iconos inventados: si se quieren, mapear por título con lucide (ya es
dependencia) — pero solo si suma; las cards de texto ya funcionan en la home.
Debajo, `noIncluido` en `text-xs text-navy-soft` (es la letra pequeña honesta
— la auditoría celebró que exista).

### 10.3 Tu menú (`components/tour/menu-tour.tsx`) — solo `completo`

El diferenciador estrella (A4): **fotos reales de platos que ningún
competidor tiene** (`plato-mariscos/carne/surf-turf/vegetariano.webp`, ya en
`/fotos`).

- Eyebrow «Tu menú, a tu elección» + lead: «Cada persona elige su plato al
  reservar. Recién hecho a bordo, no buffet recalentado.»
- Grid de 4 cards de plato: foto arriba (`object-cover`), nombre + desc.
  ⚠️ Los webp de Surf & Turf y Vegetariano son thumbnails 368×224 (limitación
  documentada) — no estirarlos más de su nativo.
- **Tabla Light/Premium** (copy exacto del prototipo, delta framing — fix 1.1):
  columnas «Light — US$ 99» / «Premium — **+US$ 15**»; filas «Menú» («Pollo o
  pescado a la parrilla» / «4 platos: mariscos, carne, surf & turf,
  vegetariano») y «Todo lo demás» («✓ idéntico» / «✓ idéntico»). Nota al pie:
  «* Langosta se sustituye por langostino salvaje de marzo a junio (veda).»
  En móvil la tabla debe caber sin overflow (2 columnas estrechas o apilada).
  Existen además `plato-chicken-bodegon.webp` y `plato-fish-bodegon.webp` (el
  menú Light) por si Samuel quiere columna Light con foto — anotado en §12,
  no hacerlo de serie.

**Verificación:** timeline con horas vacías no rompe el raíl; los 4 platos
cargan; el precio de la tabla sale de `precioLight`/`upgradePremium` (no
strings fijos — snorkel-lovers dice US$ 98); charter/Saona NO tienen la
sección; móvil sin overflow-x.

---

## §11 · T-F5 — Opiniones, FAQ, relacionados y la nav de anclas

### 11.1 Opiniones (`components/tour/opiniones-tour.tsx`)

- Izquierda: «4.9» gigante (`font-display`, escala tipo `--text-stat` original
  — si hace falta tamaño nuevo, token) + «/ 5» + «1,782 reseñas verificadas»
  + «Ver en TripAdvisor →» (link a `https://www.tripadvisor.com` — genérico
  hasta tener la URL real del perfil, ya pedida en PLAN-v3 §9; **jamás
  Viator**, fix 1.2).
- Derecha: card con la `quoteDestacada` ampliada (el prototipo le añade
  « Volveríamos sin dudarlo.») + «★★★★★ · Cliente verificado · jun 2026».
- **Sin barras de distribución** (92% 5★…): el dato real no existe (§0).

### 11.2 FAQ del tour + relacionados (`components/tour/faq-tour.tsx`, `tambien-gusta.tsx`)

- Acordeón con las 4 `faqTour`, **primera abierta** (= frame de Figma sin
  flag). La home ya tiene un acordeón en `galeria-faq-cierre.tsx`
  (`useState` de índice): si el visual es el mismo, **extraerlo a
  `ui/acordeon.tsx`** y que ambos lo consuman (verificando que la home no
  cambia ni un píxel — captura antes/después); si la ficha pide otro aspecto,
  componente propio y se anota por qué. `aria-expanded` en los triggers.
- «También te puede gustar»: 2 mini-cards (`tambienTeGusta`) — foto pequeña,
  nombre, «{audiencia} · desde US$ 98 /pers» (o «Consultar») — **`<Link>`
  real a la otra ficha** (ambas existen desde F1; es la primera navegación
  interna real y la prueba viva de ScrollToTop).

### 11.3 La nav de anclas (`components/tour/anclas-ficha.tsx`)

Fila sticky bajo el header (`sticky z-30`, top = `--spacing-sticky-top` — ver
Trampa №5), `bg-papel/90 backdrop-blur-sm border-b border-linea`: links
Itinerario · Incluye · Menú (solo `completo`) · Opiniones · FAQ, a anclas
`id` de cada sección con `scroll-margin-top` = token `calc()` (header + anclas
+ aire). Scroll suave (`scroll-smooth` en la página o `scrollIntoView`).
Estado activo por sección visible: **no en esta fase** (refinamiento §12 —
no meter un IntersectionObserver de serie).

**Verificación:** click en cada ancla deja el heading VISIBLE bajo los
stickies (medir, no mirar: `getBoundingClientRect().top` ≥ offset); en
charter/Saona no existe el ancla Menú; acordeón abre/cierra con aria
correcto; los links de relacionados navegan y aterrizan arriba (ScrollToTop);
la home sigue intacta si se extrajo el acordeón.

---

## §12 · T-F6 — Los enlaces reales, QA integral y cierre

### 12.1 La home se conecta (el momento «el sitio existe»)

Sustituir `EnlacePrototipo` por `<Link to={'/tours/' + slug}>` **solo donde el
destino es una ficha de tour**:

| Archivo | Qué cambia |
|---|---|
| `home/tour-card.tsx` | el stretched-link del CTA «Ver tour» |
| `home/ticker-hero.tsx` | las cards de TIPO `tour` (las de `ocasion` siguen `EnlacePrototipo`) |
| `home/mega-tours.tsx` | los 4 ítems (la salida «Ver los N tours →» sigue `EnlacePrototipo` — el listado no existe) |
| `home/footer.tsx` | la columna TOURS (Eventos sigue prototipo) |
| `home/menu-movil.tsx` | los links de tours del acordeón |

**⚠️ Trampa №7 — el menú móvil tiene que CERRARSE al navegar.** Un `<Link>`
dentro de `MenuMovil` navega sin desmontar el overlay: quedaría la hoja
abierta sobre la ficha (y el scroll-lock del body activo — aunque su cleanup
al desmontar lo restaura, no confiarse). `onClick` que llame a `onCerrar`
además de navegar. Verificarlo explícitamente.

**⚠️ Trampa №8 — el ticker con links reales.** Las cards del ticker se
duplican (copia `aria-hidden` con `tabIndex={-1}`) y el dock/marquee hacen
hover-pausa: comprobar que el click en una card de la copia duplicada también
navega, y que navegar y VOLVER a la home no deja el ticker/GSAP en estado
raro (montar/desmontar limpio de los hooks de scroll de la home —
`use-incluye-scroll`, `use-experiencia-scroll` — al ir y volver; es la
primera vez que la home se desmonta).

Actualizar el comentario de `ui/enlace-prototipo.tsx` («solo cubre la home» →
«home + fichas de tour») y el title.

### 12.2 QA integral (Playwright)

En las 4 rutas + `/` + `/fundaciones`, a **390 / 768 / 1440** (y 1920×950 en
la canónica):

1. 0 errores de consola (full reload antes de creer en uno — HMR stale), 0
   overflow-x de página en todas.
2. Flujo real: home → click en TourCard → ficha arriba del todo → «También te
   puede gustar» → otra ficha → logo → home. Todo navega, todo aterriza
   arriba.
3. Widget: sticky, estados (vacío/`?dev-widget=fecha`), totales correctos,
   variantes de charter/Saona, WhatsApp real abre wa.me.
4. Galería: mosaico, lightbox (Escape, scroll-lock, foco), N correcto por
   tour, carrusel móvil, Saona con foto única.
5. Anclas con offset correcto; acordeón; barra móvil por modo.
6. Menús del header sólido por encima de todo lo sticky; menú móvil cierra al
   navegar (Trampa №7).
7. `grep` de valores mágicos (hex/px sueltos) fuera de `tokens.css`,
   `fundaciones.tsx` y `src/dev/`; `tsc` limpio; `npm run build` limpio.
8. La home no cambió visualmente salvo los links (capturas de las secciones
   tocadas antes/después).

### 12.3 Docs del cierre

- `app/PLAN.md` §«Qué NO hacer»: actualizar la línea de «solo la home» (§1).
- `app/README.md`: sección de rutas + «lo que hay que saber» de la ficha.
- `dev-registry.ts`: descriptions finales de la screen de la ficha con todos
  sus estados.
- **Proponer** (no hacer en silencio) actualización de la nota del cerebro
  `proyectos/hispaniola.md`: la ficha existe en React, qué fixes de conversión
  incorpora, y que el funnel sigue bloqueado por la decisión del motor.
- Tag: `git tag v1.0-ficha-tour`.

### 12.4 Traspaso a Figma (anotar en componentes y README, no ejecutar aquí)

- La ficha es **una plantilla**: en Figma, UNA página «Ficha de tour» con las
  variantes por modo de booking como frames (semi-privado 1440 + 390 =
  canónicos; charter y Saona = frames de variante). No 4 diseños.
- `WidgetReserva` = componente con propiedad `modo: completo / cotizacion /
  consulta` y, en completo, estados `sin-fecha / con-fecha`
  (`?dev-widget=fecha` congela el segundo).
- Componentes: chip de meta, chip de día (reposo/seleccionado/agotado), paso
  de timeline, card de incluye, card de plato, fila de tabla, acordeón
  (cerrado/abierto), mini-card de relacionado, barra móvil (3 modos),
  lightbox (`?dev-galeria=abierta`).
- Los deep-links `?dev-*` de la ficha son los frames; nada de `src/dev/` viaja.

---

## §13 · Decisiones abiertas para Samuel (no resolver en este plan)

1. **¿El notch en páginas interiores?** La ficha estrena el header sólido
   clásico. Si Samuel quiere el notch también aquí, es una fase propia (el
   notch hoy está acoplado a la rama `sobreVideo`).
2. **Mini-calendario vs. chips de 14 días** en el widget. El plan sigue al
   prototipo (chips). El calendario completo pertenece al paso 1 del funnel.
3. **Tile de video en el mosaico** — el asset existe (`hero.mp4`). Requiere
   reproductor en el lightbox.
4. **El mapa de la ruta** (A3): pedir asset al cliente, encargar un mapa
   estilizado, o generarlo con Magnific bajo su dirección (como los assets de
   IncluyeCrucero). Mientras: foto real provisional.
5. **Distribución de reseñas** (92% 5★): necesita el dato real
   (TripAdvisor/motor). Sin dato, no se pinta.
6. **URL real del perfil de TripAdvisor** (hoy el link es genérico) — ya
   estaba pedida en PLAN-v3 §9 junto a los assets de premios en alta.
7. **Columna Light con foto** en la tabla del menú (los bodegones de pollo y
   pescado existen en `/fotos`).
8. **Estado activo en la nav de anclas** (resaltar la sección visible):
   refinamiento con IntersectionObserver si lo pide al verlo.
9. **`/tours` (listado/disponibilidad)** y el **funnel de booking**: los
   siguientes planes, cuando el cliente decida qué pasa con xpotours.
