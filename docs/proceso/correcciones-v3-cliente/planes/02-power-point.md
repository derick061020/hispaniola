# Plan 02 — PowerPoint v3 (slides 66–82): diseño, estructura y jerarquía

> Fuente: `power-point-v3.pdf` (17 págs = slides 66–82, continúa la numeración
> del v2) + `meeting-power-point-v3.pdf` (reunión 07-31, aclara casi todas).
> Cruzado con: el código real en `staging` (`df7283c`).
> Estado: propuesta para revisar con Samuel. No ejecutado.
>
> Este es el plan «creativo»: donde el cliente pide efectos, jerarquía y
> reestructuras. La regla de lectura de maquetas aplica entera: estructura sí,
> estética de la maqueta no — la dirección visual sigue siendo la nuestra.

## TL;DR — 17 slides en 6 grupos

- **«Efecto eco»** (66, 67, 68): premios a color y banner eco con animación
  constante (66); en contacto (67) y flota (68) **NO se toca el diseño** —
  la 67 es solo la búsqueda de reserva por teléfono/email y la 68 es añadir
  un **badge eco animado** a las cards (aclarado por Samuel, 2026-08-06).
- **Ficha de tour** (71, 72, 73, 74, 75, 76, 77, 78): edad 15+, popup de
  recomendaciones, **menús por duración y tamaño de grupo** (el corazón de la
  tanda), banner premium del charter, tarifarios rediseñados.
- **Quitar** (70): «Un día de mar en 3 paradas» fuera de /flota (+ el banner
  cero-plástico, tachado en WEBSITE-NOSOTROS).
- **Destacar** (69): la cocina flotante como única de Punta Cana.
- **Eventos** (79, 80, 82): novios gratis en bodas, sección Karaya en
  corporativo, nombres de paquetes.
- **Fundación** (81): timeline «En qué trabaja la fundación» más dinámica.

---

## Slide 66 — Premios a máximo color + banner eco con vida

**Cliente:** «Estos logos deben verse en máximo color» + «Esta sección
[eco-friendly] que tenga algún efecto eco y que el diseño sea más moderno».
**📞 REUNIÓN 07-31 (12:46–14:25):** «efecto eco» NO es literal: «mejor hagas
un efecto o algo así chulo... como has hecho con el tema del barquito»; sobre
el banner: hoy «tiene una animación de entrada pero luego se queda quieto» →
quiere **animación constante**, «sutil, un poquito más modernito». Motivo de
negocio: «es la única empresa que se apoya en la parte sostenible, por aquí
nadie hace nada de eso».

**Estado en el repo:**
- `components/home/premios.tsx` — los 7 logos usan clase `premio-logo`
  (componentes.css); verificar si aplica grayscale/opacidad y quitarlo.
  ⚠️ Los assets `public/premios/*.webp` se extrajeron de la web actual — si
  alguno es gris EN ORIGEN, ese logo necesita asset nuevo (pedir o re-extraer
  a color de la web viva). No se recolorea un PNG gris a mano.
- `components/home/eco-friendly.tsx` + `use-eco-friendly-reveal.ts` — el
  cintillo con sello dibujado: hoy reveal de entrada (una vez) y quieto.

**Cómo lo aplicamos:**
1. Premios: a color pleno. Si el conjunto queda ruidoso (7 logos de marcas
   distintas contra papel), la mitigación es de composición (tamaño/aire), no
   volver al gris — el cliente fue explícito.
2. Banner eco: mantener el reveal de entrada + añadir un **loop sutil
   permanente** con materia del tema (mismo espíritu que el CTA-mar: olas/
   hoja que respira/trazo del sello que recorre). En CSS puro, tokens
   `--eco-*` para delays/curvas (regla de [[animaciones-a-figma]]), y
   congelado bajo `prefers-reduced-motion`.
3. Rediseño «más moderno» del cintillo: subir la factura del material (el
   degradado/hairlines del sistema, no rellenos planos — ver el aprendizaje
   «IA slop» del 07-28).

**Archivos:** `premios.tsx`, `componentes.css`, `eco-friendly.tsx`,
`use-eco-friendly-reveal.ts`, `tokens.css`, `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## Slide 67 — Mi Reserva busca por teléfono y email (SIN rediseño de contacto)

**Cliente:** flecha al cajón «¿Ya tienes una reserva?»: «agregar búsqueda
también por teléfono y por email».
**📞 REUNIÓN 07-31 (14:31):** «que el cliente pueda buscar por reserva, por
[email] y por teléfono».
**✅ ACLARADO (Samuel, 2026-08-06):** el diseño de la sección de contacto
**NO se toca** — de esta slide solo se ejecuta la búsqueda. (Los cambios de
COPY de contacto siguen viniendo de WEBSITE-INICIO, plan 03 §6 — son texto,
no rediseño.)

**Estado en el repo:**
- El cajón vive en `components/home/contacto.tsx` (29 KB).
- `/mi-reserva` (`pages/mi-reserva.tsx`) ya tiene toggle **código | email**
  (líneas 77–191). Falta el tercer modo: **teléfono**.

**Cómo lo aplicamos:**
1. `mi-reserva.tsx`: el toggle de 2 pasa a **3 modos** (Booking code | Email |
   Phone). Sin backend sigue siendo la misma demo honesta: el modo email ya
   documenta que no puede validar nada real (comentario líneas 83+); el de
   teléfono hereda ese trato.
2. El cajón de `contacto.tsx` («Gestionar →») no necesita 3 inputs: mantiene
   el input único y el placeholder pasa a decir que acepta código, email o
   teléfono; el destino `/mi-reserva` resuelve el tipo (un valor con `@` es
   email, solo dígitos/+ es teléfono, resto código).

**Archivos:** `pages/mi-reserva.tsx`, `components/home/contacto.tsx`,
`dev-registry.ts`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.

## Slide 68 — Badge eco ANIMADO en las cards de flota (SIN rediseño)

**Cliente:** anotación «efecto/más moderno» sobre «Una embarcación para cada
plan» (el grid de barcos de /flota).
**📞 REUNIÓN 07-31 (15:40–16:17):** «estos logos que tengamos en la ficha:
embarcación sostenible» → Samuel: «como un sello, una estampa ahí de eco…
más llamativos, claro, que resalte». (El resumen de la reunión lo recoge
como «añadir sello eco».) Miguel además: «ahora voy al cliente y me grabo
bien con vídeos» — los videos reales por barco vienen de camino.
**✅ ACLARADO (Samuel, 2026-08-06):** el diseño de las cards **está bien y NO
se modifica** — lo que se pide es **agregar un badge eco animado, chulo**, a
las cards.

**Estado en el repo:** `components/flota/barco-card.tsx` + `flota-grid.tsx` —
las cards ya tienen video por defecto, mini-galería, 360º y ficha técnica en
modal (iteración v2 del 07-28). No llevan ningún distintivo eco.

**Cómo lo aplicamos:**
1. **Badge «Embarcación sostenible»** (EN: «Sustainable vessel» / «Eco
   certified» — copy final en la pasada EN) como sello/estampa sobre la card
   — mismo espíritu de pieza-con-vida que el sello de TripAdvisor de la
   ficha (corona giratoria + destello): un sello redondo con animación
   constante SUTIL en CSS puro (p. ej. la hoja/trazo que respira o un halo
   que recorre), tokens `--eco-badge-*` para delays/curvas
   ([[animaciones-a-figma]]), congelado bajo `prefers-reduced-motion`.
2. Posición: esquina de la media de la card (donde no pelee con el chip de
   categoría ni el «Ver en 360°»). Reutilizable: el mismo sello puede servir
   en la ficha de tour si el cliente lo pide después.
3. Nada más se toca en la card. Los huecos de video se rellenan cuando
   Miguel traiga el material (`[placeholder-v3]`).

**Archivos:** componente nuevo `ui/sello-eco.tsx` (o dentro de flota/),
`barco-card.tsx` (montarlo), `componentes.css`, `tokens.css`,
`dev-registry.ts`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.

## Slide 69 — Destacar la cocina flotante («única en Punta Cana»)

**Cliente:** «destacar sección, casi es la única cocina de Punta Cana, hay
que resaltarlo».

**Estado en el repo:** `components/flota/cocina-y-paradas.tsx` — la sección
«La única cocina flotante de Punta Cana» ya existe en /flota (se montó oscura
a sangre y Samuel la devolvió a sección normal el 07-28 — NO volver a eso).

**Cómo lo aplicamos:** subir jerarquía sin volver al bloque negro: badge
«Único en Punta Cana» más protagonista, la foto/video con más presencia, y
un acento de material premium contenido EN LA CARD (la lección «lo premium es
la card, no el contenedor»). ⚠️ Además esta sección PIERDE a su vecina «3
paradas» (slide 70) — el rediseño debe funcionar sola.
⚠️ WEBSITE-NOSOTROS trae copy EN nuevo para esta sección («More Than Lunch. A
Memory You Can Taste») — plan 05 §4; ejecutar juntos.
**Archivos:** `cocina-y-paradas.tsx`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## Slide 70 — Quitar «Un día de mar en 3 paradas» de /flota

**Cliente:** «quitar esto de la sección de flota».
**Refuerzo:** WEBSITE-NOSOTROS pág. 9 tacha en rojo TAMBIÉN el banner «Ni una
botella de plástico sube a nuestros barcos».

**Estado en el repo:** ambas viven en `pages/flota.tsx`: las «3 paradas»
dentro de `cocina-y-paradas.tsx` (segunda mitad del componente) y el banner
en `banner-cero-plastico.tsx` (el cierre de la página, con CTA a
sostenibilidad).

**Cómo lo aplicamos:**
1. Quitar el bloque de 3 paradas de `cocina-y-paradas.tsx` (el componente
   pasa a ser solo «cocina» — renombrarlo o dejar alias comentado).
2. Quitar `<BannerCeroPlastico />` de flota. ⚠️ Se pierde el único enlace
   interno de /flota → /ventaja-competitiva; el cierre de página queda en la
   cocina. Componente y CSS: eliminarlos del todo (sin cadáveres) salvo que
   Samuel quiera reusar el banner en otra página.
3. `dev-registry.ts`: retirar las entradas de los bloques eliminados.

**Archivos:** `pages/flota.tsx`, `cocina-y-paradas.tsx`,
`banner-cero-plastico.tsx` (borrar), `dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.
**Duda para Samuel:** ¿el cierre de /flota queda en la cocina o quieres otro
CTA de cierre (p. ej. a /tours)?

## Slide 71 — Semi-privado: «de 15 años en adelante»

**Cliente:** flecha a la fila de chips del hero de la ficha Semi-Privado:
«Agregar aquí de 15 años en adelante».
**📞 REUNIÓN 07-31 (18:35):** «agregar un campo que sea de 15... los niños de
15 en adelante» (resumen de la reunión: «mínimo 15 años»).

**Estado en el repo:** `components/tour/cabecera-ficha.tsx` — chips del hero
(«Cancelación gratis · Solo adultos · Distintivo de excelencia · Garantía del
mejor precio»). ⚠️ WEBSITE-TOURS pág. 1 pide QUITAR «Cancelación gratis» y da
4 chips nuevos (plan 04 §1) — este badge se integra en esa reestructura.

**Cómo lo aplicamos:** chip «Ages 15+» en la fila nueva de chips. ⚠️ Tensión
de copy: el H1 dice «solo adultos» / el copy EN nuevo dice «Adults-Only» —
15+ no es «adults only» en sentido estricto. Propuesta: mantener «Adults-Only»
como posicionamiento y el chip «Ages 15+» como la regla concreta (es como lo
maneja el sector). Confirmar con el cliente (índice, petición 6).
**Archivos:** `data/tours.ts` (chips por ficha), `cabecera-ficha.tsx`.
**Esfuerzo:** trivial (dentro del rediseño de chips del plan 04).

## Slide 72 — «Qué llevar»: botón «Recomendaciones adicionales»

**Cliente:** «Agregar botón con popup o similar que diga “Recomendaciones
adicionales”» sobre la card «Qué llevar».
**📞 REUNIÓN 07-31 (18:47):** «un botoncito ahí o algo sutil... un texto...
donde se recomienda llevar crema para la piel..., mejor [llevar dólares]...».

**Estado en el repo:** la card «Qué llevar» vive en
`components/tour/datos-tour.tsx` / bloque de la ficha (5 ítems con icono).
Hay `Modal` de AlignUI disponible (`components/alignui/modal.tsx`).

**Cómo lo aplicamos:** botón discreto (ghost, esquina de la card) que abre un
Modal/Popover AlignUI con la lista de recomendaciones. **El texto real no
existe** — la reunión solo dio ejemplos. Se monta con 3–4 recomendaciones
extraídas de lo dicho (crema solar biodegradable, efectivo en dólares para
propinas/add-on, ropa de cambio) marcadas `[placeholder-v3]`, y se pide la
lista definitiva (índice, petición 2). NO se inventan recomendaciones médicas
ni de seguridad.
**Archivos:** `datos-tour.tsx`, `data/tours.ts`, `dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.

## Slides 73 + 74 — Los menús del charter por duración y tamaño de grupo ⚡

**El cambio más gordo del PowerPoint.**

**Cliente (slide 73, «menu 4h»):** al menú a medida del charter: «(Hasta 20
Personas)» junto al título; «Estos platos son hasta 20 personas. De 21 en
adelante es un buffet de pinchos»; «la langosta solo va en Saona» (flecha al
banner dorado del add-on).
**Cliente (slide 74, «menu 3h»):** maqueta de cajas: «El menú a medida — Más
de 21 personas [duda, ver abajo]» con: foto del menú premium de brochetas
(logo «Nuevo»), «Cantidad por persona», y 2 recuadros «¿Cómo se sirve?».
**📞 REUNIÓN 07-31 (19:21–22:15):** la regla completa:
- **Tours de 4 horas** (todos los barcos): menú de platos actual **hasta 20
  personas**; de **21 en adelante → buffet de pinchos**.
- **Tours de 3 horas**: se quita el menú actual y va el **menú de brochetas**
  con «foto total del menú con la brocheta», «foto de la porción de cada
  persona» y «dos fotos de cómo se sirve» — «una foto grande y dos pequeñas
  al lado que se pueden ampliar», similar a las fotos que ya tiene el charter.
- Las fotos las pasa Miguel («me pasará una buena» de la parrilla/porción).
**Y WEBSITE-TOURS (pág. 17) lo nombra:** «For 3-hour charters, we serve our
popular **Taste of Hispaniola Menu**, featuring freshly prepared grilled
skewers (chicken, beef or shrimp)...» — sin mención de nº de personas.

**Estado en el repo:**
- `components/tour/carta-charter.tsx` — la carta del charter ya distingue
  platos vs brochetas (`brocheta: true`, `data/tours.ts` líneas 727-729) pero
  como UNA carta única, sin lógica por duración ni por pax.
- El widget del charter ya sabe la duración por barco (Maite 4h, GrandMa 3h,
  Santa María 4h, Forever Teresa 3h/4h — `sub-variante-picker.tsx`).
- Santa María ya dice «plated hasta 20, skewers desde 21» en su línea de
  widget (¡la regla pax ya existía a medias ahí!).

**Cómo lo aplicamos:**
1. `data/tours.ts`: el menú del charter se parte en DOS estructuras: `menu4h`
   (7 platos, «Up to 20 guests»; nota «21+ → pincho buffet») y `menu3h`
   (**Taste of Hispaniola Menu**, brochetas pollo/res/camarón + foto grande +
   porción + 2 de servicio, badge «New»).
2. `carta-charter.tsx` pinta el menú según la **duración del barco
   seleccionado en el widget** (estado compartido ya existente): Maite/Santa
   María/FT-4h → menu4h; GrandMa/FT-3h → menu3h. Con el selector sin tocar,
   default al menú 4h con tabs visibles («4-hour menu / 3-hour menu») para
   que ambos sean descubribles — la maqueta del cliente los muestra como
   bloques separados, la reunión habla de «organizarlo».
3. Regla 21+: nota visible en el menú 4h («For groups of 21+, served as a
   pincho buffet») — NO un menú fantasma con platos inventados del buffet:
   hasta tener la carta real del buffet de pinchos, es una nota, no un menú.
4. Langosta: **quitar el banner dorado del add-on del menú del charter** (se
   queda solo en Saona) — ⚠️ CONTRADICE el copy aprobado de WEBSITE-TOURS
   («Fresh lobster is available as an optional upgrade» en charter 4h).
   **Bloqueado por la respuesta del cliente** (índice, petición 4). Hasta
   entonces: se implementa lo del slide (quitar), que es lo más reciente…
   **o se deja como está** — decisión de Samuel.
5. Las 3 fotos nuevas: `[placeholder-v3]` con las fotos de brochetas
   existentes (`plato-chicken-bodegon`) hasta que Miguel pase las reales.
6. La «duda del 21+» del slide 74: el título de la maqueta dice «Más de 21
   personas» pero la reunión y el copy aprobado dicen que el menú 3h es ese
   para TODOS. Samuel mismo lo recapituló así en la reunión («en los de tres
   horas es este»). **Propuesta: menú 3h único para todas las cantidades**;
   la línea «Más de 21» se ignora como residuo de la conversación. Confirmar.

**Archivos:** `data/tours.ts`, `carta-charter.tsx`, `menu-tour.tsx`,
`widget-reserva.tsx` (si la duración no está expuesta donde hace falta),
`dev-registry.ts`.
**Esfuerzo:** ALTO. **Riesgo:** medio (toca la ficha que convierte).

## Slide 75 — Menú de Saona: foto + mejor diseño

**Cliente:** «agregar foto, mejorar diseño en general» sobre «El menú del
día / Buffet en Isla Saona».
**Estado en el repo:** `menuBuffet` en `data/tours.ts` (líneas 903+) — lista
de checks SIN fotos (los `PlatoBuffet` no tienen campo foto, comentado ahí
mismo: la comida del buffet no se ha fotografiado).
**Cómo lo aplicamos:** rediseño del bloque buffet (de lista plana a bloque
con foto protagonista + platos). Foto: usar las fotos reales de comida que ya
hay en el repo como ambiente `[placeholder-v3]`, pedir fotos del buffet real.
El add-on langosta de Saona SE QUEDA (slide 73: «la langosta solo va en
Saona»).
**Archivos:** `menu-tour.tsx` (rama buffet), `data/tours.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## Slides 76 + 78 — Tarifarios: menos tabla, más imagen

**Cliente (76, Saona):** «agregar foto, mejorar diseño en general» sobre las
tablas Speedboat/Fishing Town/Catamarán. **(78, charter):** «agregar foto
ampliada y video 360, mejorar diseño en general potenciando más las
imágenes».
**📞 REUNIÓN 07-31 (22:15–23:12):** «no le gustó… es mucho texto», «las
tablas son raras»; Samuel propuso y Miguel aceptó: **mostrar solo el tramo en
el que estás** («que no te muestre todo de una vez sino que te vaya mostrando
en lo que estás… de 1 a 6 tanto, de 7 en adelante tanto»).

**Estado en el repo:** `components/tour/tabla-precios-charter.tsx` (24 KB) —
las tablas por barco con todos los tramos visibles y barras de progreso.
El widget ya resalta el tramo activo según pax.

**Cómo lo aplicamos:**
1. **Progressive disclosure**: por barco, mostrar grande SOLO el tramo que
   aplica al nº de personas del widget (foto del barco + precio del tramo,
   protagonista); el resto de tramos, colapsados («See all rates» /
   acordeón). La tabla completa no desaparece — se pliega.
2. Foto ampliada del barco en la card del tarifario (assets ya existen en
   flota) + botón **«View in 360°»** que abre el visor existente
   (`components/flota/visor-360.tsx`) ⚠️ hoy los 360 son placeholder — botón
   solo si hay asset (regla: nada de botones 360 que abren una foto).
3. Mismo patrón para Saona (3 variantes) y charter (4 barcos): un solo
   componente rediseñado, no dos forks.

**Archivos:** `tabla-precios-charter.tsx` (rediseño mayor), `data/tours.ts`
(fotos por barco/variante), `visor-360.tsx`.
**Esfuerzo:** ALTO. **Riesgo:** medio (es la zona de decisión de compra;
verificar que el tramo resaltado sigue sincronizado con el widget).

## Slide 77 — Banner «Charter en modalidad Premium» + puente a eventos

**Cliente:** «agregar sección con este texto: “En ésta sección ofrecemos
nuestros Charter privado en modalidad Premium que es el más vendido”» +
botón «Consultar modalidades más económicas» → URL de eventos/party-boat.
**📞 REUNIÓN 07-31 (23:12–26:41):** el racional: el charter que se muestra ES
la versión premium; los precios «más económicos» viven en Eventos/Party Boat.
⚠️ Samuel ya avisó en la reunión de la incoherencia: hoy el charter más
barato (Maite $625) es MÁS barato que el party boat más barato ($660) — «me
parece más caro incluso»; Miguel: van a reestructurar precios y añadir barcos
nuevos a la flota.

**Cómo lo aplicamos:**
1. Banda/sección corta en la ficha del charter (encima del menú o del
   tarifario): copy EN («This is our Private Charter in Premium mode — our
   best seller») + CTA secundario «Looking for more budget-friendly
   options?» → `/eventos/party-boat` (link interno, NO la URL absoluta de
   vercel del slide).
2. Material premium contenido (banda dorada del sistema ya existente:
   `banda-premium.tsx` es el molde natural).
3. ⚠️ La promesa «más económicas» hoy es FALSA con los precios actuales. Se
   implementa la sección pero el copy del CTA evita prometer precio («See
   Party Boat options») **hasta que el cliente reestructure precios** — o se
   deja la promesa literal si Samuel prefiere ser fiel al slide. Decisión.
**Archivos:** `data/tours.ts` (ficha charter), componente nuevo o
`banda-premium.tsx` parametrizada, `dev-registry.ts`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo (con el copy prudente).

## Slide 79 — Bodas: mensaje destacado

**Cliente:** «Agregar mensaje destacado: • Pareja de novio GRATIS • Brindis
de Champagne Incluido» (flecha al widget de reserva de bodas).
**📞 REUNIÓN 07-31 (27:56):** con 14 invitados, los novios no pagan — «coges
12 y te diga 12 más los dos novios»; «poner un bocadillo».
**WEBSITE-EVENTOS (pág. 5):** versión aprobada EN: «🥂 Complimentary Bride &
Groom with groups of 14 guests or more · 🍾 Complimentary Champagne Toast for
all wedding groups».

**Cómo lo aplicamos:** ver plan 06 §3 (copy + regla en la calculadora del
widget de bodas + bocadillo «12 + the happy couple»). Aquí solo se registra
que la slide y el doc COINCIDEN (14+). **Esfuerzo:** medio (toca
`widget-evento.tsx`/`calculadora-evento.tsx`).

## Slide 80 — Corporativo: sección Karaya («el catamarán más grande del Caribe»)

**Cliente:** «agregar aquí sección con el catamarán más grande de eclipse
[sic]: • catamarán más grande del caribe • capacidad para más de 200
personas • cocina a bordo» (en la página de corporativo/MICE, junto a
«Formatos»).
**📞 REUNIÓN 07-31 (28:41–29:22):** «un banner… con una fotografía del barco…
“también disponemos en la flota del catamarán más grande del Caribe”»; sobre
fotos: las buenas están en el material de Trafic Experience (hay video, fotos
regulares).
**WEBSITE-EVENTOS (pág. 3):** «Karaya Punta Cana by Hispaniola… nearly 1,000
m²… up to 300 guests».

**Cómo lo aplicamos:** ver plan 06 §4. ⚠️ Contradicciones nombre («Eclipse»)
y aforo (200+ vs 300) → petición 5 del índice. Se construye con el dato del
copy aprobado (Karaya, 300) y `[placeholder-v3]` en la foto.

## Slide 81 — «En qué trabaja la fundación»: más dinámica

**Cliente:** «esta sección hacerla más dinámica, mucho texto y no tiene
imágenes ni efectos» (la timeline vertical de proyectos).
**📞 REUNIÓN 07-31 (30:16–30:41):** «hacerla con fotos y algún efecto…
una foto de un coral, una tortuga… él es muy didáctico»; Samuel: «mantengo la
línea de tiempo, solo agregarle imágenes» → aceptado.

**Estado en el repo:** los «frentes» viven en
`components/fundacion/frentes-fundacion.tsx` (barrido horizontal con snap en
/fundacion) y `components/sostenibilidad/proyectos-sostenibilidad.tsx`
(timeline vertical en /ventaja-competitiva) — ambos leen `data/fundacion.ts`.
La captura del slide es la **timeline vertical de /ventaja-competitiva**.

**Cómo lo aplicamos:** ver plan 07 §3 — foto por proyecto (coral, tortuga,
limpieza, pescadores, educación) + reveal por scroll (el patrón
`ScrollTrigger.batch` ya estandarizado). ⚠️ El copy de los 6 proyectos también
cambia (WEBSITE-SOSTENIBILIDAD) — misma pasada. Fotos: hay reales de coral/
tortuga en el repo; las que falten, `[placeholder-v3]`.

## Slide 82 — Nombres para los paquetes de eventos

**Cliente:** «cambiar estos asteriscos» (los tabs «Premium · #I · #II ·
#III» del widget de reserva de party boat/bodas).
**📞 REUNIÓN 07-31 (31:29–32:01):** los paquetes no tienen nombre real
(«se llaman paquete 1, 2, 3»); Miguel: «un circuito o algo así, estéticamente
más bonito».

**Estado en el repo:** `data/eventos.ts` — los 4 paquetes comparten shape con
`id`/abreviatura (`#I`…), usados en `widget-evento.tsx` y
`paquetes-evento.tsx`.

**Cómo lo aplicamos:** ver plan 06 §5 — propuesta de nombres derivados del
CONTENIDO real de cada paquete (menú/duración), no inventando atributos:
p. ej. Premium → «Premium», #I → «Classic», #II → «Sunset», #III → «Deluxe»
(la propuesta final en el plan 06, para que el cliente elija/apruebe).
**Esfuerzo:** bajo. **Riesgo:** ninguno técnico; el nombre lo aprueba el
cliente antes de publicar.

---

## Resumen de esfuerzo del plan 02

| Grupo | Slides | Esfuerzo |
|---|---|---|
| Ficha charter: menús + tarifarios | 73, 74, 76, 78 | **ALTO** (el corazón) |
| Premios a color + eco banner + badge eco + cocina destacada | 66, 68, 69 | medio |
| Mi Reserva por teléfono/email | 67 | bajo-medio |
| Quitar de flota | 70 | bajo |
| Ficha: 15+, recomendaciones, banner premium | 71, 72, 77 | bajo-medio |
| Eventos (bodas, Karaya, nombres) | 79, 80, 82 | medio (en plan 06) |
| Fundación dinámica | 81 | medio (en plan 07) |
