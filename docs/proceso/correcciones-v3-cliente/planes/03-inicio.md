# Plan 03 — Home (`/`)

> Fuente: `WEBSITE - INICIO.pdf` (6 págs).
> Cruzado con: `pages/home.tsx` y los componentes de `components/home/`.
> Estado: propuesta para revisar con Samuel. No ejecutado.
> Todo el copy citado es el APROBADO por el cliente — se porta literal
> (corrigiendo solo typos evidentes, ver §7).

## TL;DR — la home en v3

- **Cambiar (copy EN)**: título del hero, párrafo del lead, las 4 cards de
  tours, sección why-direct (título + 7 checks nuevos), «Incluye» (8 ítems),
  contacto (títulos y estructura), equipo teaser, banda CTA final.
- **Eliminar (2)**: «Sin costes ocultos…» del hero; la sección **«Cada
  ocasión merece su propio catamarán»** (EventosEspeciales) entera.
- **+ del PowerPoint** (plan 02): premios a color, eco banner animado,
  mi-reserva por teléfono/email (el diseño de contacto NO se toca —
  aclarado por Samuel 2026-08-06).

## Pág. 1 — Hero

**Cliente:**
- TITLE CHANGE: **«Redefining the Caribbean Catamaran Experience — More than
  just a tour!»**
- CHANGE (lead): «This isn't just a day at sea—it's a carefully crafted
  Caribbean experience. From the moment you arrive, every detail has been
  thoughtfully designed to immerse you in the very best of Punta Cana, where
  marine conservation, exclusive access to our underwater museum,
  chef-prepared cuisine, spacious catamarans designed for comfort, and
  genuine Caribbean hospitality come together to create unforgettable
  memories.»
- REMOVE: «sin costos ocultos…» (la línea «Sin costes ocultos. Sin barcos
  abarrotados.»).

**Estado en el repo:** `components/home/hero.tsx` + `data/home.ts`. El H1
actual («Los catamaranes originales de Punta Cana, en grupos pequeños») lleva
las animaciones de palabras flotantes confinadas a 2 palabras (v3 del hero,
julio). El lead actual es el bloque «No es solo un paseo en barco…» con
palabras en bold. La línea «Sin costes…» va junto al CTA.

**Cómo lo aplicamos:**
1. H1 nuevo. ⚠️ Decisión de diseño: ¿qué 2 palabras heredan el flotado +
   subrayado ondulado? Propuesta: **«Caribbean Catamaran»** (el par que
   define, como «catamaranes originales» hoy). El copy es más largo que el
   actual — verificar el encaje a 390px.
2. Lead: el párrafo nuevo es UNO solo y largo; el actual son 3 con jerarquía
   de bolds. Propuesta: mantener el patrón visual (bolds en «carefully
   crafted Caribbean experience», «underwater museum», «chef-prepared
   cuisine»…) sin partir el texto aprobado.
3. Quitar la línea de reassurance junto al CTA (las 2 condiciones de reserva
   que quedaron del F18 NO son esto — solo se va «Sin costes ocultos. Sin
   barcos abarrotados.»).
4. Stats del hero (91.607/4.454/≤35%/0): se quedan, labels a EN + formato
   `91,607` (plan 01 §3).

**Archivos:** `data/home.ts`, `hero.tsx`.
**Esfuerzo:** medio. **Riesgo:** medio (tipografía/animación del H1).

## Pág. 2 — Grid de tours

**Cliente:** «CHOOSE YOUR CARIBBEAN EXPERIENCE: Shared tours and private
charters designed for unforgettable Caribbean experiences.» + descripciones
nuevas por card:
- **Semi-Privado**: «An intimate adults-only Caribbean experience featuring
  protected reef snorkeling, an exclusive underwater museum, a secluded
  beach, and chef-prepared cuisine from our floating kitchen.» (+ tagline
  «Limited guests. Adults only. Protected reefs, underwater museum, floating
  kitchen, and personalized service.»)
- **Snorkel Lovers**: «An all-ages experience where coral restoration,
  symbolic coral planting, an exclusive underwater museum, and protected
  reefs inspire unforgettable memories.» (+ tagline)
- **Charter Privado**: «Your boat. Your people. Private charters with
  catamarans for every group size, style, and budget.»
- **Isla Saona**: «Paradise made personal. White-sand beaches, turquoise
  waters, private charters, and unforgettable Saona Island experiences.»

**Estado en el repo:** `tours-grid.tsx` (título «Elige tu día en el Caribe»)
+ `tour-card.tsx` + `data/home.ts`/`data/tours.ts` (las cards leen resumen por
tour).

**Cómo lo aplicamos:** título + subtítulo nuevos; descripción de card por
tour. Cada texto trae DOS partes (descripción + tagline con asterisco) —
propuesta: descripción en la card, tagline como los chips existentes de la
card (mapear «Limited guests», «Adults only»… a chips). Precios «desde»
NO cambian aquí.
**Archivos:** `data/home.ts` / `data/tours.ts`, `tours-grid.tsx`.
**Esfuerzo:** bajo. **Riesgo:** bajo.

## Pág. 3 — Why direct

**Cliente:** «Book Direct. Experience More. / Everything the portals can't
offer» + 7 checks: Direct access to our local experts · Customize your
experience · Choose your preferred menu · Exclusive direct-booking perks ·
Priority assistance via WhatsApp · Flexible cancellation policy · Support
local marine conservation.

**Estado en el repo:** `why-direct.tsx` — «¿Por qué reservar aquí y no en un
portal?» con el duelo de boletos (comparativa portal vs directo) y su scroll.

**Cómo lo aplicamos:** título/subtítulo nuevos; los 7 checks sustituyen el
contenido del lado «directo». ⚠️ El diseño del duelo (portal vs directo) se
mantiene — el copy nuevo es una LISTA, no obliga a tirar la comparativa; los
7 checks son el lado Hispaniola. Los textos del lado «portal» se traducen en
la misma pasada (no vienen en el doc → traducción nuestra, marcada en el
commit).
**Archivos:** `data/home.ts` (o `data/por-que-reservar.ts` si comparte),
`why-direct.tsx`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.

## Págs. 4–5 — «Incluye» (8 ítems nuevos)

**Cliente:** CHANGE con la lista completa:
01 TRANSPORTATION (air-conditioned vans, pick-ups from no more than three
hotels — shared tours) · 02 CORAL INTERPRETATION CENTER · 03 ONBOARD
EXPERIENCE · 04 MARINE SANCTUARY · 05 NATURAL POOL · 06 FLOATING KITCHEN ·
07 OPEN BAR (Unlimited Presidente beer (local beer), premium aged rum, vodka,
tequila, tropical juices, refreshments, soft drinks (light and regular) and
bottled water) · 08 GO PRO MEMORIES (GoPro photos and videos uploaded to
Facebook for free download after your tour).

**Estado en el repo:** `incluye-crucero.tsx` («Todos nuestros cruceros
incluyen», numerales editoriales sobre el video con scroll scrub).

**Cómo lo aplicamos:** reemplazo 1:1 de los ítems (el formato editorial con
numerales se queda; son 8 — verificar cuántos hay hoy y ajustar el scroll si
cambia el nº de pasos). Datos nuevos que entran: «no more than three hotels»
y «Coral Interpretation Center» (concepto que la v3 usa en varios sitios —
mismo nombre SIEMPRE, ver plan 04).
**Archivos:** `data/home.ts`, `incluye-crucero.tsx`, `use-incluye-scroll.ts`
(si cambia el nº de pasos).
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.

## Pág. 5 (abajo) — REMOVE: «Cada ocasión merece su propio catamarán»

**Cliente:** «REMOVE:» seguido de la captura de la sección de eventos
especiales (4 boxes Cumpleaños/Bodas/Aniversarios/Despedidas).

**Estado en el repo:** `eventos-especiales.tsx`, montada en `home.tsx` entre
IncluyeCrucero y Reviews (la subió ahí la v2).

**Cómo lo aplicamos:** quitar la sección de la home (componente fuera de
`home.tsx`; el archivo se borra si nadie más lo usa — verificar). ⚠️ Se
pierde el puente home → eventos; mitigación: el mega-menú de Eventos sigue, y
el banner del charter (slide 77) enlaza a party boat. ⚠️ La captura del
REMOVE incluye también el arranque de Contacto, pero la pág. 6 EDITA contacto
→ el REMOVE es solo EventosEspeciales.
**Archivos:** `home.tsx`, `eventos-especiales.tsx` (borrar),
`dev-registry.ts`.
**Esfuerzo:** trivial. **Riesgo:** bajo.
**Duda para Samuel:** confirmar que el REMOVE es la sección entera (lectura
nuestra) y no solo «rehacerla».

## Pág. 6 — Contacto + equipo + CTA final

**Cliente:**
- «HABLA CON NOSOTROS → **SPEAK WITH LOCAL EXPERTS**», debajo: «Our local
  specialists work exclusively for Hispaniola Aquatic Adventures and are here
  to help you.»
- Card de Eva: **quitar el texto bajo Eva, solo poner «Fast response»**.
- «¿Prefieres que te escribamos?» → **«HOW CAN WE HELP YOU?»** + debajo: «We
  don't just answer questions, we help you choose the right experience for
  your group, budget, and travel style.»
- QUITAR: «¿Cómo prefieres que te contactemos?» (la fila de canales
  WhatsApp/Email/Teléfono).
- Equipo: «**MEET THE [TEAM] BEHIND YOUR CARIBBEAN ADVENTURE**: Based in
  Punta Cana since 2010, we're the local team behind every tour, dedicated to
  creating unforgettable Caribbean experiences.»
- «CAMBIAR TU DIA… PARA **READY FOR AN UNFORGETTABLE DAY?**» (la banda CTA
  «Tu día en el Caribe empieza aquí»).

**Estado en el repo:** `contacto.tsx` (29 KB: card de Eva + formulario con
selector de canal + cajón mi-reserva), `equipo-teaser.tsx` («Las personas
detrás de tu día en el mar» — dice «desde 2012»), banda CTA en `footer.tsx`.

**Cómo lo aplicamos:**
1. Títulos y subtítulos nuevos en `contacto.tsx`.
2. Card de Eva: fuera el párrafo «Detrás de cada reserva hay una persona
   real…» y el «Español e inglés · Equipo local» → chip/línea «Fast
   response» (mantener «Respondemos en minutos»? NO — «Fast response» lo
   sustituye; el pill verde actual ya es eso: se funde en uno).
3. Quitar la fila «¿Cómo prefieres que te contactemos?»: el formulario pierde
   el selector de canal → los campos quedan (Name, WhatsApp/Phone, Email,
   About, Message). ⚠️ El campo «¿Sobre qué?» y el resto del form se traducen
   aquí (no vienen en el doc → traducción nuestra).
4. Equipo teaser: título/sub nuevos. ⚠️ «since 2010» vs «desde 2012» del repo
   → 2010 (copy aprobado; ver índice, petición 8). El typo «MEET THE BEHIND»
   se corrige a «Meet the team behind…» (§7).
5. Banda CTA: «Ready for an unforgettable day?». ⚠️ /ventaja-competitiva pide
   OTRO texto para la misma banda (plan 07 §5) → la banda pasa a aceptar
   texto por página (prop en `footer.tsx` o composición), default el de home.
6. + slide 67 (plan 02): mi-reserva por teléfono/email — solo el cajón de
   búsqueda; el diseño de la card no se toca.

**Archivos:** `contacto.tsx`, `equipo-teaser.tsx`, `footer.tsx`,
`data/home.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §7 — Typos del copy aprobado (se corrigen al portar)

El copy del cliente trae erratas evidentes; se corrigen SIN cambiar el
mensaje (y se le avisa en la entrega):
- «MEET THE BEHIND YOUR CARRIBEAN ADVENTURE» → «Meet the Team Behind Your
  **Caribbean** Adventure».
- «softs drinks» → «soft drinks».
- Capitalización: los títulos en MAYÚSCULAS del doc se portan con la
  capitalización tipográfica del sitio (Title Case / sentence case según el
  componente), no en caps duros — el sitio ya tiene su sistema.

## Orden de commits sugerido para la home

1. Copy EN de hero + tours + why-direct + incluye (§§1–4).
2. Quitar EventosEspeciales (§5).
3. Contacto + equipo + CTA (§6) — incluye slide 67.
4. Slide 66 (premios a color + eco banner) — plan 02.
