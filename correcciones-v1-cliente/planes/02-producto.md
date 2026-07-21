# Plan de correcciones — PRODUCTO (ficha de tour)

> **Fuente:** `PRODUCTO - Ajustes web hispaniolaaquaticadventures.com.pdf` — 6 slides
> de contenido (p1 portada, p7-15 vacías).
> **Cruzado con:** `app/src/pages/tour.tsx` y `src/components/tour/*`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Contexto en el repo

La ficha (`/tours/:slug`) ya está muy trabajada (AlignUI, `PLAN-TOURS.md`,
`PLAN-INTERNAS-V2.md`). Componentes relevantes:
`cabecera-ficha.tsx`, `galeria-lightbox.tsx`, `widget-reserva.tsx`, `kpis-tour.tsx`,
`opiniones-tour.tsx`, `descripcion-tour.tsx`, `menu-tour.tsx`, `incluye-tour.tsx`,
`itinerario.tsx`, `faq-tour.tsx`. El hero de la ficha es compartido
(`internas/hero-interna.tsx` + `galeria-mosaico.tsx`).

## TL;DR — las 5 correcciones de la ficha

1. **Cabecera:** imagen de máxima calidad + agregar **«Distintivo de excelencia»**
   (badge estilo Viator/TripAdvisor).
2. **Galería:** agregar un **video** al mosaico.
3. **Widget de reserva:** el ticker de checks «se ve raro» (corregir) + agregar
   **elementos de aceleración de venta** (urgencia, descuento tachado, escasez, «paga
   después», reseña verificada, lista de deseos).
4. **Opiniones:** mejorar el formato → **barra de distribución de estrellas** + grid.
5. **Videos:** agregar fila de **Video Corporativo + 3 Reels de Clientes**.

---

## Slide por slide

### Slide 2 — Cabecera: calidad + distintivo de excelencia
**Cliente:**
- Flecha amarilla al hero: «imagen máxima calidad».
- Flecha al badge junto al título: «Distintivo de excelencia» → ref **viator.com**
  (`.../Dominican-Republic/Full-Access/...`).
**Estado en el repo:** `cabecera-ficha.tsx` monta breadcrumb + H1 + `Estrellas` +
chips `StatusBadge` (Cancelación gratis / audiencia / duración / recogida), todo sobre
la foto del hero de la ficha. **No hay** un badge de «distintivo de excelencia».
**Cómo lo aplicamos:**
- **Máxima calidad:** auditar la foto de cabecera del tour — servir en alta (webp
  calidad ~85, 2×), verificar que `galeria-mosaico`/`hero-interna` no la estén
  sub-escalando. Es sobre todo asegurar el asset y el `srcset`.
- **Distintivo de excelencia:** un `StatusBadge` más (o pieza propia) tipo «★
  Distintivo de excelencia 2024» al estilo Viator/TripAdvisor. ⚠️ Es una **afirmación
  de marca**: solo si el cliente **tiene** ese distintivo (Travelers' Choice, etc.).
  Ya está pedido en `PLAN-v3.md §9.5` (assets en alta de TripAdvisor/Viator + URLs
  verificables). Enlazarlo al perfil real. No inventar el premio.
**Archivos:** `cabecera-ficha.tsx`, `data/tours.ts` (campo `distintivo`), asset en
`/marca/`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo. **Pide al cliente:** ¿qué distintivo
concreto tiene y su URL/logo en alta?

### Slide 3 — Galería: agregar video + widget «se ve raro»
**Cliente:**
- «agregar un video» dentro del mosaico de galería.
- Flecha al ticker de checks del widget («Confirma con 25% de depósito / Cancela
  gratis…»): **«Eso se ve raro»**.
**Estado en el repo:**
- Galería = `galeria-lightbox.tsx` (+ mosaico del hero) — solo fotos.
- El ticker de checks es `ChecksTicker` (`ui/checks-ticker.tsx`), usado por
  `widget-reserva.tsx:745` — es un marquee horizontal infinito de una línea. Ese es el
  que el cliente ve «raro».
**Cómo lo aplicamos:**
- **Video en galería:** añadir un tile de video en el mosaico (primer tile o uno
  destacado con botón play → abre en el lightbox como `<video>`). Reusar el asset del
  hero/experiencia. Dato nuevo en `data/tours.ts` (`galeria` gana un item tipo video).
- **«Eso se ve raro»:** el ChecksTicker en un espacio tan estrecho (dentro del widget)
  se lee inquieto. Opciones: (a) **congelarlo** — pasar de marquee a 3 líneas
  estáticas con check verde (más sobrio, premium); (b) reducir velocidad/ opacizar
  bordes. Samuel ya lo había puesto en ticker por pedido propio («reducir el alto»),
  así que **esto es un cambio de opinión del cliente** — confirmar con Samuel antes de
  revertir. Recomiendo (a): en el widget, checks estáticos; el ticker se queda solo
  donde hay ancho (si aplica).
**Archivos:** `galeria-lightbox.tsx`, `data/tours.ts`, `widget-reserva.tsx` /
`ui/checks-ticker.tsx`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Choca con:** decisión previa de Samuel (el
ticker fue pedido suyo) → confirmar.

### Slide 4 — Widget: elementos de aceleración de venta
**Cliente:** «Agregar los elementos de aceleración de venta» + maqueta IA con:
- Badge **«Lo más reservado · 4.9 · 1782 reseñas»**.
- **Urgencia:** «Acaba el 09 de agosto».
- **Descuento tachado:** «−18% US$ 99 · Antes US$ 120».
- «Descuentos para niños».
- **Escasez:** «Pocas fechas con disponibilidad este mes».
- Botón «Reservar mi plaza».
- «Cancelación gratuita hasta 24h», «Reserva ahora, paga después — asegura con 25%».
- «Garantía del mejor precio · Pago seguro».
- **Reseña verificada** incrustada.
- **Prueba de comportamiento:** «Reserva con antelación · De media, se reserva con 17
  días de antelación».
- **«Agregar a la lista de deseos» · Compartir**.
- «¿Tienes preguntas sobre reservas? [tel] · Chatear ahora».
**Estado en el repo:** `widget-reserva.tsx` ya es muy completo (precio, Light/Premium,
sub-variantes, calendario, stepper, «ahorra hasta 15%», checks, CTA deshabilitado sin
fecha). Le faltan casi todos los **aceleradores** de arriba.
**Cómo lo aplicamos (con criterio — no todo acelerador es honesto):**
- ✅ **Badge «Lo más reservado»** — si es cierto para ese tour (semi-privado sí).
- ✅ **«Reserva ahora, paga después (25%)»** — ya es real (el depósito del 25% existe).
  Solo hace falta comunicarlo mejor.
- ✅ **«Cancelación gratuita» / «Garantía mejor precio» / «Pago seguro»** — reales,
  ya viven en la ficha; acercarlos al CTA.
- ✅ **Reseña verificada incrustada** — real (`QUOTES`).
- ✅ **Lista de deseos + Compartir** — UI útil (share es nativo; wishlist en
  localStorage como el resto del prototipo).
- ⚠️ **Urgencia «acaba el 09 de agosto» / descuento −18% / «pocas fechas»** — son
  aceleradores que **requieren ser verdad**. Sin motor de reservas no hay disponibilidad
  real ni promo real. **Riesgo de bait-and-switch** — justo el guardarraíl que
  `widget-reserva.tsx` documenta (anti «anclar en 99 y cobrar 114»). Propuesta: NO
  pintar urgencia/escasez inventada. Si el cliente corre una promo real, se muestra con
  su fecha real; si no, se omite. El descuento tachado solo si el precio de lista real
  es mayor.
- ✅ **«De media se reserva con 17 días»** — dato de comportamiento; si es real, es
  oro. Pedir el dato.
**Archivos:** `widget-reserva.tsx`, `data/tours.ts` (flags de promo/urgencia por tour,
`masReservado`, `antelacionMedia`), `dev-registry.ts` (estados nuevos), posible
`ui/wishlist.ts`.
**Esfuerzo:** **alto** (es el componente más sensible del sitio). **Riesgo:** alto —
toca la superficie de conversión y el guardarraíl de precio. **Decidir con Samuel**
cuáles aceleradores entran (los honestos sí; los inventados no).

### Slide 5 — Opiniones: barra de distribución + grid
**Cliente:** «mejorar formato de reseñas» + maqueta IA: «Opiniones de viajeros» con
**barra de distribución** (5★ 92%, 4★ 6%, 3★ 1%, 2★ 1%, 1★ 0%) + **grid** de cards
(Simona, Javier R., Ana L., Marco G.) + «Ver las 1.782 opiniones».
**Estado en el repo:** `opiniones-tour.tsx` = rating + **marquee horizontal** de
`QUOTES`. Y su comentario **ya anticipa esto** (§13.5): *«Sin barras de distribución…
ese dato no existe en ninguna fuente… cuando el cliente dé el dato real, tienen su
sitio hecho.»* El cliente acaba de pedirlas → **hay que pedirle el dato real de
distribución**.
**Cómo lo aplicamos:**
- Añadir la **barra de distribución** (5→1★ con %). ⚠️ **No inventar los %** — pedir
  el desglose real de Google/TripAdvisor. Sin él, no se pinta (o se pinta con el dato
  real cuando llegue).
- Evaluar pasar de marquee a **grid** (la maqueta usa grid 2×2). El marquee fue
  decisión de Samuel (`PLAN-INTERNAS-V2.md`); el cliente prefiere grid → confirmar.
  Se puede: barra a la izquierda + grid a la derecha (como la maqueta).
- Mantener **cero enlaces de salida** (regla firme: no mandar a TripAdvisor/Viator
  desde la ficha, para no perder la conversión). El «Ver las 1.782 opiniones» abre un
  modal/expansión interna, no sale del sitio.
**Archivos:** `opiniones-tour.tsx`, `data/home.ts` o `data/tours.ts` (distribución +
más `QUOTES` reales), `componentes.css`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Pide al cliente:** desglose real de estrellas
+ más reseñas reales (el pool actual es corto).

### Slide 6 — NUEVA fila de videos en la ficha
**Cliente:** placeholders «Video Corporativo · Reel 1 Clientes · Reel 2 Clientes ·
Reel 3 Clientes» — una fila de 4 videos, debajo del menú de platos y antes/entre las
opiniones.
**Cómo lo aplicamos:** sección nueva en la ficha `videos-tour.tsx` — 1 video
corporativo destacado + 3 reels de clientes (9:16). Misma pieza conceptual que los
Reels de la home (plan 01, slides 8-9) → **reusar** el componente de reels para no
mantener dos. Estética nuestra (no la maqueta IA).
**Ubicación:** tras `menu-tour` / antes de `opiniones-tour` (donde la maqueta lo pone).
**Archivos:** `videos-tour.tsx` nuevo (o reuso de `reels-sociales`), `tour.tsx`,
`data/tours.ts`, `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo (si reusa el componente de reels).
**Pide al cliente:** el video corporativo + 3 reels de clientes reales.

---

## Nota de coherencia con la home

Varias correcciones de la ficha son **la misma pieza** que en la home:
- Reels de clientes (ficha s6) = Reels IG/TikTok (home s8-9) → **un componente**.
- Reseñas mejoradas (ficha s5) ≈ Reviews multi-plataforma (home s11-12) → **compartir
  datos y sub-piezas** (badge verificada, barra de distribución, card de reseña).
- Distintivo de excelencia (ficha s2) = logos de plataforma (home s11) → **mismos
  assets** en `/marca/`.
Planificar juntas ahorra trabajo y mantiene consistencia Figma.

## Orden de ejecución sugerido

1. **Rápidas/honestas:** distintivo de excelencia (s2, si hay asset), reseña verificada
   + «paga después» + garantías cerca del CTA (s4, lo real), video en galería (s3).
2. **Formato reseñas** (s5) — cuando llegue el dato de distribución.
3. **Fila de videos** (s6) — cuando lleguen los reels (comparte componente con home).
4. **Aceleradores sensibles** (s4 urgencia/escasez/descuento) — solo con datos reales
   y decisión explícita de Samuel.
5. **Ticker «raro»** (s3) — confirmar con Samuel antes de revertir su decisión previa.

## Pide al cliente (assets/decisiones que faltan)

- **Distintivo/premio concreto** de la ficha + logo/URL en alta.
- **Desglose real de estrellas** (5★..1★ en %) por plataforma.
- **Más reseñas reales** (el pool `QUOTES` es corto para un marquee/grid).
- **Video corporativo + 3 reels de clientes**.
- **¿Hay promo/urgencia real?** (fechas, % de descuento, «pocas plazas») — si no, no se
  inventan.
- **Dato de antelación media** de reserva (si lo tienen del histórico).
