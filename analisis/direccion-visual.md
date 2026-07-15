# Dirección visual — home en diseño final (React → Figma)

Fecha: 2026-07-13. Fase nueva: pasar la home de wireframe a **diseño final profesional
en React**, para luego trasladarla a Figma vía MCP (mismo proceso que Eventus y
Synexia — ver playbooks `codigo-a-figma` y `codigo-a-figma-tecnico` del cerebro).

Este documento deriva la dirección visual a partir de referencias **visitadas en vivo**
hoy (capturas en `analisis/referencias-visuales/`). Regla heredada de Synexia:
**extraer patrón, no piel** — de cada referencia se toma la estructura y el recurso,
nunca sus colores/tipografías tal cual.

El especimen visual comparativo (paletas, tipografía, botones y una card de tour real
en las dos direcciones) está en **`analisis/direccion-visual.html`** — abrir con doble
click (las fotos son de la web actual, hace falta internet).

---

## 1. Qué se extrajo de cada referencia

### Sailing Collective (sailingcollective.com) — editorial de lujo puro

- Hero full-bleed con foto cinematográfica y **serif display en blanco** encima;
  eyebrow en caps con letterspacing ("YOUR FLOATING HOTEL AWAITS").
- Nav mínima: logotipo serif centrado, 3 links en caps pequeñas, un CTA con borde.
- Tríptico de cards-foto con texto centrado sobre la imagen + **botón ghost con borde
  fino** ("BOOK GROUP JOURNEY").
- Lujo = espacio negativo, poca UI, fotografía con gradación tonal (no saturada).
- ⚠️ Límite: **cero mecánica de conversión** — sin precios, sin disponibilidad, todo
  es "inquire". Sirve la piel, NO la mecánica. Hispaniola vende un producto de $99
  con fecha y hora: necesita book-now, no inquire.

### The Moorings (moorings.com) — charter premium comercial

- Hero de agua turquesa real con el **buscador de disponibilidad dentro del hero**
  (destino / fecha / noches / pax + CTA rojo "SEARCH") → valida 1:1 el hero buscador
  que ya está en nuestro wireframe.
- **Buscador sticky** que persiste al pie al scrollear (nuestro wireframe usa CTA
  sticky en móvil — mismo principio).
- Cards blancas: foto arriba + badge de región sobre la foto + **título serif navy** +
  meta con iconos (barco, fecha, noches) + **panel de precio con fondo tintado**
  (precio tachado + precio grande en verde). Patrón directamente aplicable a
  nuestras cards de tour.
- Serif clásica en titulares + sans neutra en UI; navy + rojo como acentos.
- ⚠️ Límite: el conjunto se siente **corporativo/OTA-premium**, no boutique. Es
  eficaz pero no memorable.

### Black Tomato (blacktomato.com) — editorial audaz de viajes de lujo

- Display **condensada en caps** para titulares ("THE LUXURY TRAVEL EXPERTS") +
  subtítulo en caps pequeñas letterspaced → jerarquía sin tamaño gigante.
- **Un solo acento fuerte** (pink) reservado exclusivamente al CTA principal
  ("ENQUIRE NOW"); todo lo demás blanco/negro sobre foto.
- Tabs con subrayado del acento para segmentar ("BY TRAVELLER / MOST POPULAR…").
- Cards retrato altas con label caps centrado sobre la foto (FAMILY / COUPLES /
  GROUPS) — patrón útil para la banda de eventos/ocasiones de la home.
- Botones sólidos negros, esquinas rectas.

### Web actual de Hispaniola (hispaniolaaquaticadventures.com)

- Material fotográfico real utilizable: banners 1920px de catamarán/agua turquesa
  (`images/bg/bg-catamaran.jpg`, `images/excursions/*/banners/`), y las **fotos
  reales de los platos** (`images/food/*.png`) que ningún competidor tiene
  (hallazgo de la auditoría). Decisión de Samuel 2026-07-13: **el diseño usa las
  fotos reales de la web actual**, no stock.
- La paleta de la marca actual (azules saturados, amarillos, barra de redes de 5
  colores) **no se hereda en la UI**: la auditoría ya señaló que choca con el
  posicionamiento premium adults-only y precios sobre mercado.
- **El logo sí se hereda** (decisión de Samuel, 2026-07-14, revierte el criterio
  original de este documento). El lockup real del cliente — langosta pirata +
  "Hispaniola" script — se usa tal cual en el header; no se rediseña. El wordmark
  tipográfico que el rediseño usaba como marca dominante queda descartado.
  - Assets en `app/public/marca/`: `logo.png` (lockup original, texto oscuro) y
    `logo-hispaniola-white.png` (variante reversed que aporta Samuel — langosta a
    color + texto blanco), necesaria porque sobre el video del hero el texto
    oscuro del lockup original es ilegible.
  - El resto de la piel (marfil, navy, coral con cuentagotas) **no cambia**: el
    logo es el único punto donde entra la marca caricaturesca, y por eso el resto
    de la UI tiene que seguir sosteniendo el tono premium.

## 2. Restricción transversal (aplica a ambas direcciones)

Las fotos reales son **brillantes y turquesas** (sol del Caribe, agua saturada).
La UI no debe competir con ellas en saturación: **base neutra, el color lo ponen
las fotos**, y un único acento de UI usado con cuentagotas (misma lógica que el
"violeta con cuentagotas" de Synexia). Además, la estructura de conversión del
wireframe aprobado (buscador en hero, precios visibles, why-direct, prueba social,
sticky CTA móvil) **no se toca en ninguna dirección: es la mecánica; aquí solo se
decide la piel**.

---

## 3. Dirección A — «Boutique del Caribe» (editorial)

**Concepto**: el catamarán boutique de Punta Cana. Se lee como marca de hospitality
premium (Sailing Collective / Black Tomato), no como agencia de excursiones. La
diferenciación es la estrategia: el benchmark mostró que los competidores directos
parecen OTAs baratas — parecerse a ellos es regalar la ventaja.

- **Paleta**: marfil cálido de base (`#F6F2EA`), tinta azul-noche para texto y
  bloques (`#132630`), arena para superficies suaves (`#E9E1D2`), **coral langosta
  refinado** (`#E4573D`) como único acento de UI (CTAs y poco más), agua desaturada
  (`#8FB8BE`) solo para detalles menores.
- **Tipografía**: serif display con carácter (Fraunces o similar) para titulares +
  sans neutra (Inter) para UI/cuerpo; eyebrows en caps letterspaced (+0.18em).
- **Forma**: esquinas casi rectas (2–4px), bordes hairline, sin sombras (regla que
  ya usamos en Eventus: la profundidad se logra con solape y fondo tintado).
- **Foto**: full-bleed grande con gradiente de legibilidad; curación estricta (pocas
  fotos, las mejores); las fotos de platos como bodegones protagonistas.
- **Riesgo y mitigación**: (1) si la foto no acompaña, el look se cae → fase de
  curación de assets en el plan; (2) "editorial" suele esconder el booking → aquí NO:
  la mecánica del wireframe se mantiene íntegra, solo cambia la piel.

## 4. Dirección B — «Charter Premium» (comercial-premium)

**Concepto**: The Moorings caribeño. Premium pero abiertamente transaccional:
el usuario entiende en 1 segundo que aquí se reserva un barco.

- **Paleta**: blanco de base, navy profundo (`#0B2545`) para texto y footer,
  **aqua** (`#0E8C9C`) como color primario de marca en UI, coral (`#EF5B44`) para
  CTAs de reserva, menta suave (`#E7F5EF`) para paneles de precio.
- **Tipografía**: serif clásica legible (Lora o similar) en titulares + Inter en UI.
- **Forma**: cards blancas con esquinas 10–12px y sombra suave, badges sobre foto,
  paneles de precio tintados con tachado + precio grande.
- **Riesgo**: se parece más al patrón OTA (Viator/Civitatis venden lo mismo al mismo
  precio — el parecido invita a comparar); el aqua de UI compite con el turquesa de
  las fotos reales.

## 5. Recomendación

**Dirección A**, con toda la mecánica de conversión del wireframe. Razones:

1. **Diferenciación**: los competidores directos y las OTAs ya ocupan el look B;
   A hace que comparar Hispaniola con Viator se sienta como comparar un hotel
   boutique con un agregador.
2. **Posicionamiento**: producto semi-privado adults-only con precio sobre mercado
   ($99–114) — el diseño tiene que justificar ese delta; editorial lo hace.
3. **Marca**: el coral langosta refinado reconcilia el activo existente (logo) con
   un look serio, sin rediseñar el logo.
4. El riesgo clásico de "editorial no convierte" está neutralizado porque la
   estructura de conversión ya está resuelta y aprobada en el wireframe.

## 6. Decisión

**Dirección elegida por Samuel (2026-07-13): B — Charter Premium**, viendo el
especimen comparativo. (La recomendación era A; queda registrado que se optó por el
look comercial-premium con pleno conocimiento de ambas.)

**Guardarraíles para ejecutar B** (mitigan sus dos riesgos conocidos):

1. **El aqua se usa con cuentagotas** (marca, links, badges — no fondos grandes):
   la base dominante es blanco + navy, y el color de saturación lo ponen las fotos.
   Evita que la UI compita con el turquesa real del agua.
2. **Anti-OTA por contenido, no por piel**: como el look B se parece más al patrón
   OTA, el bloque why-book-direct, las fotos de platos propias y la prueba social
   (#1 TripAdvisor) cargan con la diferenciación — no recortarlos ni suavizarlos.

## 7. Iteración v2 — «Boutique luminoso» (2026-07-13, misma tarde)

Con la home v1 ya construida y vista en el navegador (tag `v1.0-home-diseno`), Samuel
pasó **4 referencias nuevas** y pidió un plan para evolucionarla. La dirección no se
tira: la B "Charter Premium" se mantiene como base (paleta, tipografía, contenido,
orden de secciones), pero la **forma** se vuelve más aireada, más redondeada y más
editorial.

Lo que dijo, por referencia:

- **Journeo** (claro, redondeado): le gusta la estética general → hero como contenedor
  redondeado con mucho aire, no a sangre.
- **Vacationeeze** (editorial boutique): le gusta la estética general **y en concreto**
  las fotos con **borde blanco + sombra** (passe-partout tipo polaroid, rotadas y
  solapadas) → se convierte en componente reutilizable.
- **Wanderlust**: le gusta, pero menos que las dos primeras → no se copia su piel.
- **ExploreX**: **no** le gusta la estética, **solo** las cards apiladas del hero → se
  toma únicamente el mecanismo: quitar el buscador de disponibilidad y poner una baraja
  de cards que rota (la activa se agranda al frente; la que estaba activa sube, encoge y
  se va al final de la cola).

⚠️ **Consecuencia de conversión registrada**: quitar el buscador del hero elimina el CTA
principal del wireframe aprobado (`NOTAS['home-hero']`: *disponibilidad antes que datos
personales*, patrón Civitatis). Se acepta porque la baraja **asume ese papel**: cada card
es un producto real, clicable, con precio y CTA, y se conservan el CTA primario del hero,
el sticky de móvil y el grid de tours inmediatamente debajo. No se pierde el camino a la
reserva; cambia de "buscar" a "mirar el producto y entrar".

Plan de ejecución: **`app/PLAN-v2.md`** (5 fases, commit por fase). Introduce la primera
animación del proyecto → al traspasar a Figma habrá que leer [[animaciones-a-figma]]
(loop infinito = componente interactivo, cada estado congelable como frame).

---

Referencias en vivo (2026-07-13): sailingcollective.com · moorings.com ·
blacktomato.com · hispaniolaaquaticadventures.com. Capturas:
`analisis/referencias-visuales/ref-*.jpeg`.

Referencias v2 (2026-07-13, pasadas por Samuel en el chat): Journeo · Vacationeeze ·
Wanderlust · ExploreX. **Pendiente**: guardarlas en
`analisis/referencias-visuales/v2/` (llegaron pegadas en el chat, no como archivos).

## 8. Iteración v3 — «Hero inmersivo» (2026-07-14)

Con la v2 vista en el navegador, Samuel pidió iterar solo header + hero: integrar el
header en el box del hero, usar como fondo **el video real del hero** de la web
actual (no una foto), reducir el margen del hero con los extremos del body, centrar
el contenido (título, párrafo, botones) y sustituir la baraja vertical de v2 por un
**ticker horizontal** con los 4 tours + las 6 ocasiones de eventos, en loop infinito
al pie del hero.

**El video**: la web actual usa `mb.YTPlayer` (jQuery) para poner un YouTube como
fondo del hero — el ID activo es `0q360IlZaX0` (los anteriores están comentados en
el HTML como versiones reemplazadas en 2020). Esto es distinto del popup que se
auto-abre en la home (`K65cchLFwRs`, una presentadora con subtítulos incrustados en
todo el metraje — se investigó primero por error y se descartó: sin tramo limpio
utilizable). YouTube solo entrega ambos videos a 360p en cualquier cliente
(limitación SABR vigente en 2026, no del video en sí). Del video de fondo real se
recortaron 16.5s limpios (23.5s-40s): catamaranes anclados → navegando en formación
→ toma cercana con estela → snorkel desde arriba → arrecife con peces. Mudo,
comprimido a 3.8 MB.

⚠️ **Consecuencia de conversión registrada (continúa la cadena de v2)**: el ticker
es más pequeño que la baraja (sin botón de CTA propio por card), así que cada card
**conserva el precio** y enlaza a su ficha — sigue sin perderse el camino a la
reserva. Se conservan intactos el CTA primario centrado, el CTA sticky de móvil y el
grid de tours debajo. La baraja de v2 se retira del todo (componente y tokens).

Plan de ejecución: **`app/PLAN-v3.md`** (6 fases, commit por fase, tag
`v3.0-hero-inmersivo`). El ticker es la segunda animación del proyecto → mismo
tratamiento que la baraja en el traspaso a Figma ([[animaciones-a-figma]]): loop
infinito = componente interactivo, congelable como frame vía `?dev-ticker=pausado` /
`?dev-hero=poster`.

Decisiones abiertas para cuando se vea en pantalla (PLAN-v3.md §9): si el header
necesita un estado "sticky fantasma" en desktop (al integrarse en el hero deja de
serlo), y las de siempre desde v2 (intensidad del coral, base blanca vs. crema).
