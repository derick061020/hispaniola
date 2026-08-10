# Plan 04 — Fichas de tour (`/tours/:slug` ×4)

> Fuente: `WEBSITE-TOURS.pdf` (22 págs): Semi-Privado (1–10), Snorkel Lovers
> (10–17), Charter Privados (17–20), Saona (21–22).
> Cruzado con: `data/tours.ts` (58 KB) y `components/tour/*`.
> Estado: propuesta para revisar con Samuel. No ejecutado.
> Los cambios de DISEÑO de las fichas (menús 3h/4h, tarifarios, banner
> premium, 15+, recomendaciones) están en el plan 02 (slides 71–78) — este
> plan es el COPY aprobado y los datos que trae.

## TL;DR

- **Semi-Privado**: chips del hero nuevos (fuera «Cancelación gratis»),
  descripción larga nueva, upsell +15 nuevo, menú («Your table comes with an
  ocean view»), why-direct de ficha, **itinerario nuevo con DOBLE salida
  (mañana/tarde)**, «What's Included» nuevo.
- **Snorkel Lovers**: descripción larga nueva (posicionamiento conservación),
  **itinerario propio distinto al del semi-privado** (¡orden de paradas
  diferente!), included propio.
- **Charter**: descripción nueva con **capacidades por barco** (⚡ conflicto
  con el repo), menús 4h/3h con nombre nuevo («Taste of Hispaniola»),
  claims de cocina, itinerario sin horas.
- **Saona**: descripción nueva, **renombres de variantes** (⚡ Fishing Town →
  «Speedboat Adventure»).

---

## §1 — Semi-Privado: chips del hero (pág. 1)

**Cliente:** «CANCELACION GRATIS FUERA ×» + los 4 chips nuevos:
«*Support Coral Restoration · *Exclusive underwater museum · *Limited
Participants · *Premium Lunch».

**Estado en el repo:** `cabecera-ficha.tsx` — chips actuales: Cancelación
gratis · Solo adultos · Distintivo de excelencia · Garantía del mejor precio.

**Cómo lo aplicamos:** reemplazo de la fila por los 4 nuevos + **«Ages 15+»**
(slide 71). «Solo adultos» del H1 se mantiene vía título nuevo (§2). ⚠️ La
«Garantía del mejor precio» y el «Distintivo» desaparecen de los chips — si
Samuel quiere conservar alguno, decidirlo aquí (la anotación solo tacha
explícitamente «Cancelación gratis», pero la lista nueva es cerrada).
**Duda para Samuel:** ¿los 4 chips nuevos aplican también a las otras fichas
o solo al semi-privado? (El doc los pone solo en semi-privado; snorkel no
trae chips propios.)
**Archivos:** `data/tours.ts`, `cabecera-ficha.tsx`.

## §2 — Semi-Privado: descripción larga (págs. 2–3)

**Cliente:** «The Ultimate Adults-Only Catamaran Tour in Punta Cana» + 5
párrafos aprobados (35% capacity, Cabeza de Toro, Underwater Museum, «more
than 50 coral restoration structures», «Los Arrecifes de Bávaro Ecological
Foundation», coco loco, Natural Pool, Floating Kitchen con Angus/lobster).

**Estado en el repo:** `descripcion-tour.tsx` + `data/tours.ts` («Un día de
mar en grupo pequeño», 3 párrafos con «Leer más»).

**Cómo lo aplicamos:** reemplazo del bloque completo (título + párrafos, el
«Leer más» se queda). Datos nuevos que quedan canónicos: **50+ estructuras de
restauración** (antes «top-3 de RD» — el claim top-3 desaparece de esta
descripción; ⚠️ sigue vivo en otros puntos del sitio: unificar en el barrido),
nombre de la fundación en su variante «Los Arrecifes de Bávaro Ecological
Foundation» (⚠️ índice petición 9: un solo nombre).
**Archivos:** `data/tours.ts`.
**Esfuerzo:** bajo.

## §3 — Semi-Privado: upsell, menú y why-direct (págs. 4–6)

**Cliente:**
- Upsell (comparador Light/Premium): «One unforgettable journey. One small
  upgrade. — The same catamaran, the same route and the same incredible
  destinations. Upgrade to Premium for just $15 more and enjoy a freshly
  prepared gourmet lunch, seven dishes to choose from and our signature
  Floating Kitchen experience.»
- Menú: «Your table comes with an ocean view — Select your favorite dish when
  you book. Our chefs prepare every meal fresh on board, turning lunch into
  one of the highlights of your day.»
- Why-direct de ficha: «Book Direct. Enjoy More. — Unlock exclusive savings
  and benefits available only when you book directly with Hispaniola.»

**Estado en el repo:** `comparador-premium.tsx` («La misma ruta, dos maneras
de vivirla»), `menu-tour.tsx` («Tu menú, a tu elección»), «Antes de reservar»
(`antes-de-reservar.tsx`, bloque RESERVANDO DIRECTO 15%).

**Cómo lo aplicamos:** los 3 títulos+subs se reemplazan. El interior del
comparador (listas ✓/✗) y del bloque 15% se traduce en la misma pasada
(traducción nuestra, no viene). El mismo copy de menú aparece para snorkel
(pág. 12) y el mismo «Book Direct. Enjoy More.» en pág. 13 → mismo texto en
ambas fichas (es contenido compartido: verificar dónde vive en data para
escribirlo UNA vez).
**Archivos:** `data/tours.ts`, `comparador-premium.tsx`, `menu-tour.tsx`,
`antes-de-reservar.tsx`.

## §4 — Semi-Privado: itinerario con DOBLE salida (pág. 8) ⚡

**Cliente:** «Itinerary — 4 Hours. Pickup time depends on your hotel
location…» y cada parada con **dos horas: «8:20 AM / 12:20 PM» hasta «1:15
PM / 5:15 PM»** — es decir, el tour tiene salida de MAÑANA y de TARDE y el
itinerario muestra ambas. Paradas: Hotel Pickup → Departure from Bávaro (Cabo
Engaño) → Snorkeling at the **Marine Park** (Underwater Museum, coral
restoration gardens) → Secret Beach & Coco Loco → Natural Pool & Floating
Kitchen → Return.

**Estado en el repo:** `itinerario.tsx` — timeline de una sola hora por
parada (8:05 → 13:00), datos en `data/tours.ts`.

**Cómo lo aplicamos:**
1. `data/tours.ts`: las paradas del semi-privado pasan a llevar `horaManana`/
   `horaTarde` (o un par en el mismo string, como el doc: «8:20 AM / 12:20
   PM»). Formato 12h AM/PM (sitio EN).
2. `itinerario.tsx` pinta el par — propuesta: toggle Morning/Afternoon o las
   dos en columna como el doc (más simple, fiel al aprobado). Empezar por lo
   fiel; iterar si Samuel quiere el toggle.
3. Los textos de parada se reemplazan por los aprobados. ⚠️ Concepto nuevo
   transversal: **«Marine Park»** — el vivero de coral pasa a llamarse así en
   TODO el sitio (coincide con la página nueva del plan 05 §6).
4. ⚠️ El itinerario actual arranca 8:05/zarpe 9:00; el nuevo 8:20/9:15. Datos
   aprobados → se toman.

**Archivos:** `data/tours.ts`, `itinerario.tsx`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §5 — Semi-Privado: What's Included (págs. 9–10)

**Cliente:** 8 ítems: Exclusive Marine Park Access · Foundation Conservation
Team · Floating Kitchen & Gourmet Lunch · Premium Open Bar · Round-Trip Hotel
Transportation · Wi-Fi On Board · Floating Bar at the Natural Pool ·
Complimentary Tour Photos.

**Estado en el repo:** `incluye-tour.tsx` + data.

**Cómo lo aplicamos:** reemplazo 1:1. El MISMO bloque se repite aprobado para
snorkel (págs. 16–17, idéntico) → contenido compartido en data (una vez).
⚠️ «Wi-Fi On Board» es ítem nuevo — verificar que es real (está en la web
actual del cliente como amenity; si no, preguntar).
**Archivos:** `data/tours.ts`, `incluye-tour.tsx`.

## §6 — Snorkel Lovers: descripción + itinerario PROPIO (págs. 11–15) ⚡

**Cliente:** «Discover the Caribbean Beneath the Surface» + 4 párrafos
(families/all ages, Marine Interpretation Center ANTES de embarcar, symbolic
coral planting a bordo, DOS puntos de snorkel, tortugas desde el catamarán,
Floating Kitchen premium menu) + cierre «Don't just discover the reef.
Become part of it's [sic] future.» + itinerario «Marine Park Journey — 4
Hours» con doble hora y este ORDEN: Hotel Pickup → Private Marina & Marine
Interpretation Center → **Natural Pool & Symbolic Coral Planting (primero)**
→ **Snorkeling at the Marine Park (después)** → Floating Kitchen → Return.

**Estado en el repo:** la ficha snorkel comparte estructura con semi-privado;
su itinerario actual es variante del mismo recorrido (playa desierta
incluida). El doc NO menciona playa desierta/coco-loco para snorkel.

**Cómo lo aplicamos:**
1. Descripción larga nueva (reemplazo).
2. Itinerario propio con el orden nuevo (Natural Pool primero) y sin playa
   desierta — es un RECORRIDO DISTINTO, no una traducción. ⚠️ Esto redefine
   el producto en la web; el doc es explícito y detallado, se porta tal cual.
3. «Marine Interpretation Center» = el «Coral Interpretation Center» de la
   home (pág. 4 de INICIO)?? El doc usa los dos nombres. ⚠️ Unificar: proponer
   **Marine Interpretation Center** (aparece en la parte más específica) y
   avisar al cliente del doble nombre (petición nueva → índice 9-bis).
4. Cierre: typo «it's» → «its».
5. Included: idéntico al semi-privado (§5).

**Archivos:** `data/tours.ts`, `itinerario.tsx` (reuso del doble-hora).
**Esfuerzo:** medio. **Riesgo:** bajo.

## §7 — Charter Privados: descripción con datos nuevos (págs. 17–19) ⚡

**Cliente:** «Your Private Caribbean Experience» + «Choose the catamaran that
best fits your group: **Maite – 4 hours · Up to 15 guests / GrandMa – 3
hours · Up to 50 / Santa Maria – 4 hours · Up to 45 / Forever Teresa – 3 or
4 hours · Up to 85**» + párrafos (marina privada, Cabeza de Toro, Marine
Park, Natural Pool) + **«Our 4-hour charters include our signature Floating
Kitchen… seven gourmet menu options… Fresh lobster is available as an
optional upgrade. / For 3-hour charters, we serve our popular Taste of
Hispaniola Menu, featuring freshly prepared grilled skewers (chicken, beef or
shrimp)…»** + cierre («Not sure which catamaran…our sales team will help») +
claims de cocina: Premium Ingredients · Live Show Cooking · Made from
Scratch · Cooked to Order · Dietary Friendly.

**Estado en el repo:** descripción del charter en `data/tours.ts` (líneas
~540: «Forever Teresa hasta 120 personas»), widget con Maite 4h·20pax /
GrandMa 3h·50 / Santa María 4h·45 / Forever Teresa 3h y 4h.

**Cómo lo aplicamos:**
1. Descripción nueva completa.
2. ⚡ **Capacidades**: Maite 15 (repo 20) y Forever Teresa 85 (repo 120) NO
   coinciden con el tarifario del repo (portado de la web del cliente, que ya
   era inconsistente consigo misma — precedente del «desde $55»). Esto toca
   TARIFAS (tramos del widget) si es verdad. **Propuesta: portar el copy con
   los números aprobados en la DESCRIPCIÓN, no tocar los tramos del
   tarifario hasta tener el tarifario escrito** (índice, petición 3), y
   dejar `// [conflicto-v3]` en data. Un tarifario que vende plazas 16–20 de
   un barco de 15 es un problema real — por eso la petición es urgente.
3. «Taste of Hispaniola Menu» = nombre canónico del menú 3h (slide 74,
   plan 02).
4. Claims de cocina (5): van al bloque de cocina de la ficha charter
   (`carta-charter.tsx` los tiene similares hoy: condimentos, parrilla,
   restricciones — reemplazo por los 5 aprobados).
5. Langosta: el copy dice «optional upgrade» en 4h — ⚡ contradicción con
   slide 73 (índice, petición 4). Ver plan 02.

**Archivos:** `data/tours.ts`, `carta-charter.tsx`.
**Esfuerzo:** medio. **Riesgo:** medio (por el conflicto de capacidades).

## §8 — Charter: itinerario sin horas (pág. 20)

**Cliente:** «QUITAR HORAS Y PONER DEBAJO DE PLAYA DESIERTA SOLO EN TOUR DE
4 HORAS».

**Estado en el repo:** itinerario del charter «3 o 4 horas» con horas fijas
(8:05…13:00).

**Cómo lo aplicamos:** las horas desaparecen (un charter privado zarpa cuando
el grupo quiere — tiene sentido); la parada «Playa desierta + coco-loco»
lleva nota «Only on 4-hour charters». `itinerario.tsx` ya debe soportar
paradas sin hora (verificar; si no, variante sin columna de hora).
**Archivos:** `data/tours.ts`, `itinerario.tsx`.
**Esfuerzo:** bajo.

## §9 — Saona: descripción + renombres (págs. 21–22) ⚡

**Cliente:** «A Day in Paradise» + párrafos (Catuano, Las Palmillas, Mano
Juan) + variantes: «**Private Speedboat** – the fastest and most exclusive
option, for up to 9 guests. / **Catamaran** – the classic Caribbean sailing
experience. / **Speedboat Adventure** – including stops at Mano Juan and
Playa Toro.» + «All options include a traditional Dominican buffet served on
the island and time to relax in the famous Natural Pool at Las Palmillas.»

**Estado en el repo:** descripción con las 3 variantes llamadas speedboat /
catamarán / **Fishing Town** (data/tours.ts ~839); el widget muestra
«Speedboat 25 pax · Fishing Town 25 pax · Catamarán 70 pax».

**Cómo lo aplicamos:**
1. Descripción nueva.
2. **Renombres**: Fishing Town → «Speedboat Adventure»; speedboat privado →
   «Private Speedboat». Afecta descripción, widget, tarifario, funnel y
   cualquier mención (grep por «Fishing Town»).
3. ⚡ Aforo del Private Speedboat: copy dice «up to 9»; el TARIFARIO del repo
   vende tramos hasta 25. La propia web del cliente ya tenía este doble dato.
   Mismo trato que §7.2: copy aprobado en descripción, tarifario intacto +
   `[conflicto-v3]` + preguntar.
4. El menú/buffet de Saona: slide 75 (plan 02). El add-on langosta se queda.

**Archivos:** `data/tours.ts`, `sub-variante-picker.tsx`, `widget-reserva.tsx`
(labels), `tabla-precios-charter.tsx` (labels).
**Esfuerzo:** medio. **Riesgo:** medio (renombre transversal).

## Orden de commits sugerido

1. Semi-privado completo (§§1–5) — incluye slides 71–72.
2. Snorkel Lovers (§6).
3. Charter: copy + menús 3h/4h + banner premium (§§7–8 + slides 73–74, 77).
4. Charter/Saona: tarifarios rediseñados (slides 76, 78).
5. Saona: copy + renombres + menú (§9 + slide 75).
