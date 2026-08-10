# Plan de correcciones v2 — HOME Y MENÚ PRINCIPAL

> Fuente: slides 3, 9, 20–23, 32–35 del PDF.
> Cruzado con: `app/src/pages/home.tsx`, `components/home/nav-tabs.tsx`,
> `components/home/dropdown-nosotros.tsx`, `components/home/dropdown-ayuda.tsx`,
> `components/home/reviews.tsx`, `components/home/faq.tsx`,
> `components/home/equipo-teaser.tsx`, `components/home/experiencia.tsx`,
> `components/ui/reels-sociales.tsx`, `data/home.ts`, `data/nosotros.ts`,
> `src/App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR — las 8 correcciones de la home

> 📞 La **§8 es nueva**: salió solo en la reunión del 07-24, no está en ningún
> slide. Y la reunión resolvió dos dudas abiertas de este plan: «Eventos» va en
> **plural** (era un typo del PDF) y **`/nosotros` desaparece** como página.

**Reestructurar (2)**
1. **Menú principal nuevo**, 6 tabs y otro reparto de sub-ítems (§1) — es el
   andamio de toda la tanda v2.
2. Reordenar: subir «Eventos especiales» por encima de las reseñas (§2).

**Quitar (2)**
3. Las reseñas bajan de **3 filas a 2** (§3).
4. **Fuera la FAQ de la home** (§4).

**Cambiar lo que ya existe (3)**
5. Los reels: **5 videos fijos**, no un feed dinámico (§5).
6. Equipo: en la home solo 3 + botón a la página del equipo; los filtros por
   departamento van en la página nueva (§6).
7. Destacar la **cocina flotante** como «la única de Punta Cana» (§7).

---

## §1 — Slide 20: el menú nuevo (haz esto primero)

**Cliente:** captura del nav actual (`Inicio · Tours ▾ · Eventos ▾ · Nosotros ▾ ·
Ayuda ▾`) y debajo, escrito a mano, *«Nuevo menu y orden»*:

```
Inicio · Nosotros · Tours · Evento · Sostenibilidad · Ayuda
           │                            │              │
   • Tripulación              • Sostenibilidad   • Preguntas Frecuentes
   • Instalaciones            • Fundación        • Guías de Punta Cana
   • Flota                                      • Gestionar mi Reserva
                                                • Contacto
                                                • Blog
```

**Estado en el repo:** 5 entradas (`nav-tabs.tsx:300-306`): Inicio + Tours ▾ +
Eventos ▾ + Nosotros ▾ + Ayuda ▾, con `NAV_NOSOTROS` (3 ítems: tripulación →
`/nosotros`, arrecife → `/sostenibilidad`, blog → `/blog`) y `NAV_AYUDA`
(4 ítems: FAQ, Guías, Contacto, Mi reserva).

**Qué cambia de verdad:**

| Cambio | Impacto |
|---|---|
| «Nosotros» pasa **antes** de Tours | reordenar un array |
| «Sostenibilidad» sale de Nosotros y **sube a tab propio** | tab nuevo + dropdown nuevo |
| «Blog» sale de Nosotros y **baja a Ayuda** | mover un ítem |
| Nosotros pasa a **3 destinos: Tripulación, Instalaciones, Flota** | **los 3 son páginas que no existen** (planes 04, 05, 06) |
| Ayuda pasa de 4 a **5 ítems** | su grid es de 2 columnas → 5 ítems dejan un hueco |
| «Eventos» pasa a llamarse **«Evento»**, en singular | ¿deliberado o typo? |

**Cómo lo aplicamos:**
- `NAV_NOSOTROS` se reescribe con los 3 destinos nuevos; `NAV_SOSTENIBILIDAD`
  nuevo (2 ítems); `NAV_AYUDA` gana Blog.
- El tab «Sostenibilidad» con solo 2 ítems no llena el panel de 624px
  (`w-notch-panel`). Hay precedente de decisión sobre esto: con 3 ítems en un
  grid de 2×2 Samuel decidió **dejar la celda vacía, sin inventar un destino
  para cuadrar la rejilla** (`dropdown-ayuda.tsx:4-7`, PLAN-v3 §12.3). Con 2
  ítems el hueco es la mitad del panel — o se usa una variante de panel estrecho
  para este tab, o Sostenibilidad va sin dropdown (link plano a
  `/sostenibilidad`) y «Fundación» se enlaza desde dentro de esa página.
  **Mi recomendación: link plano.** Un dropdown de 2 ítems no gana nada y añade
  un estado más al notch dinámico, que ya es la pieza más delicada del shell.
- El nav es un **notch dinámico que morphea de ancho al abrir cada panel**
  (`nav-tabs.tsx:136-165`) y ya tuvo un bug real por esto: *«un panel ancho
  puede taponar el logo/botón de al lado en 768–1024px»* (Aprendizajes de
  `hispaniola.md`). Pasar de 5 a **6 entradas** estrecha ese margen. Hay que
  re-verificar la geometría a 768/1024/1400, no solo en desktop grande.

### ⚠️ La colisión de rutas que hay que resolver aquí

`/fundaciones` **ya existe y no es de la fundación**: es la página interna de
tokens del proyecto (`pages/fundaciones.tsx`, sin Header ni Footer, la que
documenta la paleta para el traspaso a Figma; `App.tsx:60`). Si la página de la
Bávaro Reefs Foundation se monta en esa ruta, se pierde una herramienta del
proyecto.

> ✅ **DECIDIDO (Samuel, 2026-07-26): `/fundacion` en singular.** La página de la
> Bávaro Reefs Foundation va en **`/fundacion`**; la página interna de tokens se
> queda intacta en `/fundaciones`.
>
> Como las dos rutas se diferencian en una letra, hay que blindarlo en el mismo
> commit que las crea, o alguien las confunde:
> 1. Comentario en `App.tsx` **junto a las dos rutas**, cada uno apuntando a la
>    otra («⚠️ `/fundaciones` (plural) es la página interna de tokens, NO la
>    fundación — ver `/fundacion`»).
> 2. Comentario equivalente en la cabecera de `pages/fundaciones.tsx` y
>    `pages/fundacion.tsx`.
> 3. Entradas separadas y bien etiquetadas en `dev/dev-registry.ts`.
> 4. Nota en `CLAUDE.md`, que es lo que se lee al abrir el repo.
>
> Esto **deroga** la propuesta previa de mover la de tokens a `/dev/tokens`.
> Consecuencia para el plan 08: el bloque de la fundación (§3 de ese plan) deja
> de ser «sección con ancla en `/sostenibilidad`» y pasa a ser **su propia
> página** — hay que decidir si el contenido de fundación que hoy vive en
> `/sostenibilidad` se muda entero, o se queda un teaser con enlace (mismo
> patrón que la flota en `/nosotros`). **Recomiendo teaser + enlace**, igual que
> en el plan 04 §1, para no partir una página que ya funciona.

### 📞 REUNIÓN 07-24 — el menú, dictado de viva voz (26:43–27:03)

Miguel lo lee entero y coincide con el slide 20, con dos precisiones útiles:

> *«El menú: Inicio, Nosotros, Tours, Eventos, Sostenibilidad y Ayuda. Debajo de
> Nosotros: Tripulación, Instalaciones, [Flota]. Debajo de Sostenibilidad:
> Fundación. Y luego preguntas frecuentes, guías, contacto y el blog también.»*

1. **Dice «Eventos», en plural.** La duda del singular queda resuelta: **era un
   typo del PowerPoint.** El nav se queda como está el resto del sitio.
2. **Sostenibilidad tiene un solo sub-ítem: «Fundación».** No dos como dibujaba
   el slide. Eso refuerza la recomendación de este plan: **link plano no**, porque
   sí hay un hijo — pero un dropdown de un solo ítem tampoco. La salida limpia es
   que «Sostenibilidad» sea un enlace navegable **con** un desplegable de un ítem,
   o que Fundación cuelgue visualmente sin abrir panel. Hay que verlo en el notch,
   que es geometría delicada.

### ⚠️ 📞 Y una consecuencia grande: `/nosotros` desaparece (28:56–29:18)

Samuel lo pregunta y Miguel lo confirma:

> Samuel: *«¿la página nosotros ya no va a estar? Se va a dividir en tripulación,
> instalaciones y flota… no va a haber una página única de nosotros, sino estas
> tres cosas»* — Miguel: *«la página de nosotros, eso es»*.

**Eso cierra la duda nº 4 del índice** y cambia dos planes:
- **Plan 04 §1**: la recomendación de «dejar un teaser de flota en `/nosotros`»
  deja de tener sentido — no hay `/nosotros` donde dejarlo.
- **Plan 05**: `tripulacion-abordo.tsx` no se «retira de `/nosotros`», se muda.

**Pero queda un residuo que la reunión NO resolvió, y no es menor:** la sección
**«Nuestra historia»** (el timeline 2012→hoy con la cita de Omar,
`nuestra-historia.tsx`, slide 27) es contenido bueno y no encaja obviamente en
ninguna de las tres páginas nuevas. Tres salidas: (a) va a Flota, que es donde
la reunión hablaba de *«la foto, una frase… y esto 2022»* (28:46); (b) va a
Tripulación, que es la página de personas; (c) `/nosotros` sobrevive **solo** con
la historia, como página de marca sin entrada de menú. **Decisión de Samuel** —
y hay que tomarla antes de tocar el nav, porque condiciona a dónde apuntan los
enlaces.

⚠️ **Y hay que mirar el SEO al borrar `/nosotros`**: es una URL que existe, está
en el sitemap y probablemente indexada. Si se elimina hace falta un **redirect**
a la que herede su contenido, no un 404. Es exactamente el tipo de detalle que
se pierde en una reestructuración de menú.

**Archivos:** `data/home.ts`, `components/home/nav-tabs.tsx`,
`dropdown-nosotros.tsx`, `dropdown-ayuda.tsx`, dropdown nuevo,
`components/home/menu-movil.tsx` (**no olvidar el móvil**), `App.tsx`,
`components/home/footer.tsx` (repite la arquitectura), `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** medio — el notch es geometría delicada.
**Bloqueo:** los 3 destinos de «Nosotros» no existen. **Se puede hacer el nav
antes** y dejar los 3 enlaces apuntando a las anclas de `/nosotros` donde hoy
vive ese contenido, y repuntarlos cuando las páginas existan. Así el nav no
espera a 3 páginas.

---

## §2 — Slide 9: subir «Eventos especiales»

**Cliente:** collage de tres trozos de la home — las 4 cards de «Cada ocasión
merece su propio catamarán», la banda de espuma, y «Lo que dicen nuestros
viajeros» — con la nota *«Subir esta sección aquí»* y una flecha desde la
sección de eventos hasta el hueco **justo debajo de la espuma**.

**Estado en el repo:** el orden es
`… IncluyeCrucero → Reviews → EventosEspeciales → ReelsSociales → Contacto …`
(`pages/home.tsx:81-90`). La banda de espuma está en `IncluyeCrucero`, así que
«debajo de la espuma» = **justo antes de Reviews**.

Lectura: mover `EventosEspeciales` de después de Reviews a **antes** de Reviews.

Merece un comentario, porque esa posición ya se movió una vez: el 2026-07-17
Samuel la bajó de estar antes del footer a vivir *entre Reviews y Contacto*,
razonando que «separa el bloque de confianza (reseñas) del bloque de
conversión/cierre» (`pages/home.tsx:38-42`). El cliente pide medio paso más
arriba. **No rompe ese razonamiento** — Reviews sigue pegada a Contacto/cierre,
que era el punto. Se puede hacer.

**Cómo lo aplicamos:** mover una línea en `pages/home.tsx`. Verificar que el
fondo de `EventosEspeciales` no choque con el de `IncluyeCrucero` (hoy su vecino
es Reviews).

**Archivos:** `pages/home.tsx`.
**Esfuerzo:** trivial. **Riesgo:** bajo (fondos vecinos).
**Duda para Samuel:** el slide es un collage y la flecha es ambigua. Esta es la
única lectura que cuadra con el código, pero **conviene confirmarlo con Fernando
en una frase** antes de moverlo — es un cambio de 1 línea, pero el cliente ya
volvió sobre esta sección una vez.

---

## §3 — Slide 3: las reseñas, a 2 filas

**Cliente:** captura del muro de reseñas (3 filas × 4 cards) + *«Dejar en 2 filas»*.

**Estado en el repo:** `components/home/reviews.tsx:57` → `const FILAS = 3`, con
`COPIAS_EN_PISTA = 3` y una nota: *«el porqué de que sean 3 y no 2 está en
componentes.css (.reviews-muro-*)»*. Las 3 filas se eligieron para que «el
volumen se vea de un golpe» (`reviews.tsx:42`).

**Cómo lo aplicamos:** `FILAS = 2`. Es una constante, está aislada a propósito.

Dos cosas que hay que mirar al hacerlo, y que la constante sola no arregla:
1. Con 2 filas y las mismas reseñas, **cada fila lleva más cards** → la pista es
   más larga y el marquee tarda más en dar la vuelta. Las duraciones viven en
   `componentes.css` (`.reviews-muro-*`) y probablemente haya que reajustarlas o
   el muro se verá lento.
2. Los marquees congelados bajo `prefers-reduced-motion` pasan a
   `overflow-x: auto` y necesitan `scrollbar-width: none` — ya está arreglado
   (`3e3bd40`), pero **si se toca ese CSS hay que no romperlo**. Es el bug que el
   cliente reportó «en varios lugares» sin poder describir cómo reproducirlo.

**Y hay que decirle algo:** el cliente probablemente pide 2 filas porque 3 se
ven como demasiada altura de página, no porque sobren reseñas. Bajar a 2 filas
sin más **acorta la página**; si además se quiere conservar la sensación de
volumen, la alternativa es 2 filas + el contador («1.782 reseñas verificadas»,
que ya está en la barra de confianza de arriba) con más peso.

**Archivos:** `components/home/reviews.tsx`, `src/styles/componentes.css`.
**Esfuerzo:** trivial + ajuste de tiempos. **Riesgo:** bajo.
**Nota:** el mismo muro en versión ficha (`components/tour/opiniones-tour.tsx`)
**no** lo menciona el cliente. No tocarlo salvo que Samuel quiera coherencia.

---

## §4 — Slide 22: «quitar preguntas de la home»

**Cliente:** captura de la sección FAQ de la home (acordeón de 12 preguntas +
«Pregúntanos por WhatsApp») + *«quitar preguntas de la home»*.

**Estado en el repo:** `components/home/faq.tsx`, montado en `pages/home.tsx:88`.
Es **la única pieza de AlignUI que la home usa** — decisión explícita de Samuel
del 2026-07-17, registrada en `CLAUDE.md` y en `PLAN-ALIGNUI.md`: *«La home usa
únicamente el Accordion (sección FAQ)»*.

**Cómo lo aplicamos:** quitar `<Faq />` de `pages/home.tsx`. Y entonces hay 4
cadáveres que hay que resolver, no solo una línea:

1. **`FAQ_HOME` en `data/home.ts`** — lo consume también
   `schemaFaq(FAQ_HOME)` en el `<SchemaJsonLd>` de la home
   (`pages/home.tsx:76`). Eso es **SEO real**: el rich snippet de FAQ de Google.
   Quitar la sección visual no obliga a quitar el schema, **pero publicar datos
   estructurados de contenido que no está en la página va contra las directrices
   de Google** (los datos estructurados deben reflejar contenido visible). Así
   que el schema de FAQ también sale de la home — y con él, una fuente de tráfico.
   Vale la pena avisar al cliente de ese coste, y de que la mitigación es que
   `/faq` (que sí existe y sí tiene su schema) gane peso en el menú — cosa que
   el menú nuevo del §1 ya hace, subiéndola a la primera posición de Ayuda.
2. **AlignUI en la home queda sin uso.** Si `faq.tsx` es su único consumidor, la
   decisión documentada del 2026-07-17 deja de aplicar y hay que actualizar
   `CLAUDE.md` y `PLAN-ALIGNUI.md` en el mismo commit. No dejar la regla diciendo
   algo que ya no es verdad.
3. **`components/home/faq.tsx`** se borra (no se deja huérfano). El componente
   equivalente vive en `components/faq/categorias-faq.tsx` para la página `/faq`.
4. **El «Pregúntanos por WhatsApp»** que vive en esa sección: hay que comprobar
   que ese contacto no desaparece de la home. `components/home/contacto.tsx`
   (justo encima) ya lo tiene → probablemente no se pierde nada, pero hay que
   verificarlo, no asumirlo.

**Archivos:** `pages/home.tsx`, borrar `components/home/faq.tsx`, `data/home.ts`,
`dev/dev-registry.ts`, `CLAUDE.md`, `app/PLAN-ALIGNUI.md`.
**Esfuerzo:** trivial de ejecutar, medio de limpiar bien. **Riesgo:** bajo en
código, **medio en SEO**.
**Duda para Samuel:** ¿el schema de FAQ sale de la home también (correcto) o se
queda (arriesgado)? Y ¿avisamos al cliente del coste en SEO?

---

## §5 — Slide 21: «serán 5 videos fijos, no serán dinámicos»

**Cliente:** captura de la fila de reels (5 tarjetas verticales con badges de
Instagram/TikTok y botón de play) + esa frase.

**Estado en el repo:** `REELS` en `data/home.ts:1153` tiene exactamente **5
entradas**, y las 5 con `video: null` — hoy son fotos con un play encima. Cada
una lleva `red: 'instagram' | 'tiktok'`, y `REELS_HASHTAG = '#HispaniolaMoments'`.

**Qué está diciendo realmente:** no está pidiendo un número (ya son 5). Está
diciendo **«esto no es un feed de Instagram, son 5 videos nuestros»**. La pista
son los badges de red social y el hashtag: comunican «feed en vivo», que es una
promesa que nadie va a cumplir (no hay integración con la API de Instagram, ni
la habrá — sería backend, y eso está bloqueado por Derick).

**Cómo lo aplicamos:**
- Fuera el badge de red social de cada tarjeta y fuera el hashtag
  (`conHashtag` ya es una prop, así que en la home basta pasarla en `false` —
  en la ficha de tour ya va así, `tour.tsx:171`).
- El campo `red` de `REELS` queda sin uso → se elimina del tipo, no se deja
  colgando.
- El eyebrow/título de la sección deja de sugerir feed. Hoy la ficha usa
  «En video / Así se ve un día con nosotros», que es exactamente el tono
  correcto — reutilizarlo.
- Los 5 `video: null` se rellenan **cuando el cliente mande los 5 archivos**.
  Es la petición nº 5 de la lista de «pedir al cliente».

**Archivos:** `components/ui/reels-sociales.tsx`, `data/home.ts`,
`pages/home.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** trivial. **Riesgo:** ninguno.
**Nota:** si el cliente **quería** aspecto de red social (porque le da prueba
social gratis), esto va en dirección contraria. Merece una frase de confirmación,
aunque «no serán dinámicos» es bastante claro.

---

## §6 — Slide 23: el equipo, con filtros

**Cliente:** captura de «El equipo que te recibe» (3 cards: Omar, Lola, Eva) con
**6 botones dibujados encima** — `Operaciones Oficina`, `Operaciones Playa`,
`Marketing & Ventas`, `Equipo de Administración`, `Equipo de Cocina`,
`Fundación The Bavaro Reef` — y dos frases:
> *«Agregamos botones en sección de empleados para filtrar y mostrar cada
> empleado (Son cerca de 70)»*
> *«En la home dejaremos los 3 y un botón que les lleve a la url del equipo»*

**Estado en el repo:** `EQUIPO` en `data/nosotros.ts:126` tiene **5 personas**
(Omar, «Capitán», Lola, «Bióloga marina», Eva — dos de ellas son roles
genéricos, no personas). `equipo-teaser.tsx` pinta 3 en la home y ya tiene un
`<Link>` al final.

**Cómo lo aplicamos — esto se parte en dos, y solo una mitad es de la home:**
- **En la home:** 3 cards + un botón claro a la página del equipo. Está casi
  hecho (`equipo-teaser.tsx:276`); hay que revisar que el enlace apunte a la
  página nueva y que se lea como botón, no como link discreto.
- **Los 6 filtros y las ~70 personas** son la **página nueva de Tripulación** →
  ver plan **05**, donde el cliente ya la maquetó completa (slides 36–43) con
  los mismos 6 departamentos.

Así que del slide 23, para la home, el trabajo es pequeño. Lo grande vive en el
plan 05, **bloqueado por la plantilla real de empleados y sus fotos**.

**Archivos:** `components/home/equipo-teaser.tsx`, `data/nosotros.ts`.
**Esfuerzo:** trivial (la parte de la home). **Riesgo:** ninguno.

---

## §7 — Slide 32: la cocina flotante, más destacada

**Cliente:** captura de la sección «Un día de mar, cuidado al detalle» (bloque
«La única cocina flotante de Punta Cana» + las 3 paradas numeradas) con:
> *«Además destacar esta sección dado que ser la única cocina flotante de punta
> cana hay que destacarlo»*

Y aporta dos maquetas: **slide 33** (la misma sección en negro/oro, con mosaico
de fotos, carrusel «Míralo por dentro — fotos y video» y 3 cifras: «La única»,
«0%» comida recalentada, «7 platos») y **slide 34** (las 3 paradas rehechas como
«Un día de mar en 3 paradas», con las cards más grandes y chips de color).

**Estado en el repo:** la sección existe (`components/home/experiencia.tsx` +
`EXPERIENCIA_ABORDO` / `COCINA_FLOTANTE` en `data/nosotros.ts`) y ya dice «la
única empresa de excursiones de la República Dominicana con una cocina flotante
de verdad». El dato ya está — lo que pide es **jerarquía**, no contenido.

**Cómo lo aplicamos:** aquí hay una decisión de fondo. La maqueta del slide 33
pinta la cocina flotante **en la misma piel oscura/oro del Premium** del plan 01.
Eso es consistente (el argumento «única cocina flotante» es el que justifica el
precio Premium) y de paso rentabiliza los tokens `--color-premium-*`.

Pero **la home ya tiene una sección con recorrido de scroll y video protagonista
justo aquí** (`use-experiencia-scroll.ts`: el video crece a pantalla completa,
se mantiene y encoge — hecho en la 2ª vuelta de la v1 por petición del cliente).
Meter encima un bloque oscuro con mosaico + carrusel + 3 cifras es apilar dos
piezas de máximo protagonismo en el mismo sitio.

Propuesta: **subir la cocina flotante a bloque propio en piel premium
(slide 33), y NO rehacer las 3 paradas (slide 34)** — las 3 paradas de la maqueta
son las mismas que ya existen, solo con cards más grandes y colores de relleno
inventados; no aportan nada. Y el carrusel «Míralo por dentro» pide fotos de la
cocina que hoy no tenemos más que una.

**Y hay un solapamiento que conviene ver ahora:** el slide 47 (plan 06,
Instalaciones) pide una sección «Cocinas» con video vertical + 360°. Si la
cocina flotante se convierte en un bloque grande en la home **y** tiene su
sección en Instalaciones, se cuenta dos veces. Decidir qué cuenta cada una: la
home, el argumento de venta (única en Punta Cana); Instalaciones, las cocinas en
tierra (que es otra cosa: higiene, control de calidad antes de zarpar).

### 📞 REUNIÓN 07-24 — «un fondo diferente además» (31:28–31:49)

Miguel insiste en el argumento (31:28): *«destacar que somos la [única] cocina
flotante de Punta Cana, [que] no hay más»*, y añade una indicación de forma que
el PowerPoint no traía: **«un fondo diferente además»** (31:46).

Eso inclina la duda de abajo hacia **sí cambiar de piel**, no solo dar peso
tipográfico — y encaja con la piel `--color-premium-*` del plan 01, que es
justamente el argumento que sostiene el precio Premium. **Pero ojo con la
coherencia que acaba de fijarse en el plan 01 §14**: allí la reunión confinó lo
oscuro al widget de reserva. Si la cocina flotante de la home también va oscura,
el «modo premium» ya vive en dos sitios con lógicas distintas (uno es «producto
premium», otro es «argumento destacado»). **No es contradictorio, pero hay que
decidirlo a propósito**, no por inercia: o son el mismo lenguaje, o el fondo de
la home es simplemente *otro* fondo (más oscuro, sin el oro).

**Archivos:** `components/home/experiencia.tsx`, `data/nosotros.ts`,
`tokens.css`, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** medio — saturación de la zona.
**Duda para Samuel:** ¿el «fondo diferente» es la piel premium del plan 01, o un
fondo propio sin oro? Y ¿rehacemos las 3 paradas (slide 34) o se quedan?

---

## §8 — 📞 CORRECCIÓN NUEVA: las FAQ de cada servicio, a su página (27:33)

**No está en ningún slide.** Salió solo en la reunión:

> Miguel: *«y luego, en la página de cada servicio, las preguntas»* —
> Samuel: *«ok, dejarlo solamente allá, en la página dedicada a ese servicio»*.

**Qué pide:** que las preguntas frecuentes **específicas de un tour** dejen de
vivir en la FAQ general y se muden a la ficha de ese tour.

**Estado en el repo:** hay FAQ en tres sitios — la home (`components/home/faq.tsx`,
que el §4 de este plan quita), la página `/faq` (con filtros por categoría, hecha
en las correcciones v1) y **la ficha de tour, que ya tiene su propia sección FAQ**
(`pages/tour.tsx`). O sea: **el destino ya existe**, lo que falta es el reparto.

**Cómo lo aplicamos:** revisar las preguntas de `/faq` y separarlas en dos grupos:
- **Transversales** (pago, cancelación, qué llevar, política de lluvia, traslados)
  → se quedan en `/faq`.
- **De un servicio concreto** (¿el snorkel es apto para no nadadores? ¿el charter
  admite niños? ¿qué incluye el Premium?) → se mueven a `FICHAS[slug].faq`.

**Y ojo con el SEO, que aquí sí importa:** `/faq` tiene `schemaFaq` publicado. Si
las preguntas se mudan, **el schema se muda con ellas** — cada ficha de tour pasa
a publicar su propio bloque de FAQ estructurada. Eso no es una pérdida: **es una
mejora**, porque las preguntas quedan en la página que compite por esa búsqueda.
Es el mismo argumento que en §4 juega en contra y aquí juega a favor.

**Un aviso de alcance:** esto es un trabajo de **redacción y clasificación**, no
de código. El componente de FAQ de la ficha ya existe. Lo que cuesta es decidir,
pregunta por pregunta, dónde va — y eso no lo puede hacer nadie que no conozca el
producto. **Conviene que lo revise Samuel o Fernando**, no resolverlo a ojo.

**Archivos:** `data/tours.ts` (`FICHAS[].faq`), `data/home.ts` o el origen de
`/faq`, `components/faq/categorias-faq.tsx`, `components/seo/*`,
`dev/dev-registry.ts`.
**Esfuerzo:** bajo de código, **medio de criterio**. **Riesgo:** bajo.
**Duda para Samuel:** ¿quién decide el reparto pregunta a pregunta?

---

## Slide 35 — sin anotación

Captura del footer (el océano, con las 4 columnas, métodos de pago, idioma y
moneda). **No hay flecha ni texto.** Probablemente esté como contexto de la
slide anterior o sea un descarte. **No se toca nada** salvo que Fernando diga
qué quería ahí.

---

## Orden sugerido dentro de este plan

1. **§1 (menú)** — primero, es el andamio de la v2 entera. Resolver la colisión
   `/fundaciones` antes de escribir una línea.
2. **§4 (fuera la FAQ)** y **§3 (2 filas)** y **§2 (subir eventos)** — los tres
   baratos, la home queda más corta y ordenada de golpe.
3. **§5 (reels)** y **§6 (equipo, parte home)** — triviales.
4. **§7 (cocina flotante)** — al final, porque conviene que los tokens premium
   ya existan (plan 01 §2) y porque hay que decidir el reparto con el plan 06.
