# Plan 07 — Sostenibilidad (`/ventaja-competitiva`) y Fundación (`/fundacion`)

> Fuente: `WEBSITE-SOSTENIBILIDAD.pdf` (13 págs): ventaja competitiva (1–2),
> fundación dentro de ventaja-competitiva y /fundacion (3–12), CTA final (13).
> Cruzado con: `data/sostenibilidad.ts`, `data/fundacion.ts`,
> `pages/ventaja-competitiva.tsx`, `pages/fundacion.tsx` y componentes.
> Estado: propuesta para revisar con Samuel. No ejecutado.
> La slide 81 del plan 02 (timeline dinámica) aterriza aquí (§3).

## TL;DR

- **Misión nueva** con una historia REAL potente (las colisiones con
  tortugas → área marina protegida con el Ministerio de Medio Ambiente).
- Los bloques de la fundación se reescriben (conservación/áreas protegidas,
  educación, inversión en el equipo).
- **El aporte por huésped SUBE: US$ 3.50 → US$ 4.50** (equipo) + US$ 2.00
  (conservación) — dato aprobado.
- Los **6 proyectos** de la fundación con copy nuevo (uno NUEVO: gestión del
  área marina protegida) + fotos y efectos (slide 81).
- Tarjetas de cierre y CTA final nuevos.

## §1 — Misión (pág. 1–2)

**Cliente:** «Our Mission — Every journey you take helps protect the
Caribbean you came to discover…» + párrafos aprobados. La pieza nueva:
«After documenting repeated boat collisions with endangered green sea
turtles, we helped drive the protection of one of the country's most
important coastal ecosystems. Today, that protected marine area is actively
managed through a collaboration between our Foundation and the Ministry of
Environment, with dedicated park rangers…» + la letanía «You're helping
restore coral reefs. / You're protecting endangered wildlife. / …» + cierre
«Because the greatest souvenir isn't what you take home…».

**Estado en el repo:** `intro-sostenibilidad.tsx` («Nuestra misión» corta).

**Cómo lo aplicamos:** reemplazo; la letanía de 5 líneas es un momento
editorial — usar el patrón de reveal por línea ya existente en el proyecto.
La historia de las tortugas es EL argumento diferencial (es exactamente lo
que Miguel dijo en la reunión: «nadie hace nada de eso») — merece jerarquía,
no párrafo corrido: proponer destacarla como bloque con foto de tortuga real
(hay en el repo).
**Archivos:** `data/sostenibilidad.ts`, `intro-sostenibilidad.tsx`.
**Esfuerzo:** medio.

## §2 — Bloques de la fundación (págs. 3–8)

**Cliente (todos con copy aprobado completo):**
1. «**1. CONSERVATION & PROTECTED AREAS**» + intro + 3 sub-bloques:
   01 Marine Protected Areas · 02 Green Sea Turtle Conservation · 03 Coral
   Reef Restoration (cada uno con claim + párrafo).
2. «**2. Community & Environmental Education**» — párrafo aprobado.
3. Bloque de personas: «Exceptional experiences begin with exceptional
   people. We invest in fair compensation, continuous training…».
4. «**Where Your Contribution Creates Impact**» — la banda del aporte:
   «**US$ 4.50 per guest — Investing in Our People**» + «**US$ 2.00 per
   guest — Protecting the Caribbean**» + «Every contribution is fixed per
   guest—not based on what's left over…».
5. «**Bávaro Reefs Foundation** — Protecting the place that has given us
   everything. Founded in 2016…» + «We didn't create a foundation to support
   our business. We built a business that could support conservation.» +
   párrafo del Ministerio. + «Los datos de la derecha»: 2016 Foundation
   established · Protected Marine Area · Working alongside the Ministry of
   Environment · One of the DR's leading coral restoration programs ·
   Largest population of green sea turtles in the DR.
6. «Built by people who refused to look away.» — el bloque de origen
   (fundadores).

**Estado en el repo:** `recorrido-sostenibilidad.tsx` (los 7 chips/anclas +
secciones), `impacto-sostenibilidad.tsx`/`aporte-sostenibilidad.tsx` (la
banda US$ 3.50/2.00 con las «tres preguntas» del 07-28),
`fundacion-teaser.tsx`, `data/fundacion.ts` (cronología, fundadores).

**Cómo lo aplicamos:**
1. Reemplazo de copy por sección, manteniendo la estructura de anclas
   existente (los chips se re-etiquetan EN).
2. **Aporte: 3.50 → 4.50.** Dato aprobado por el cliente; se actualiza en
   TODOS los puntos donde aparezca (grep «3,50/3.50»). La lección de las
   «tres preguntas» (cuánto/por quién/en qué) se conserva — el copy nuevo ya
   la trae resuelta («fixed per guest—not based on what's left over»).
3. «Founded in 2016» — coincide con el repo (cronología 2016) ✓.
4. Los «datos de la derecha» (5 bullets) → la columna/aside del bloque
   fundación.
5. Fundadores: el copy nuevo NO trae nombres → los nombres siguen sin
   publicarse (pendiente v2 que sigue: confirmar cofundadores). «Built by
   people who refused to look away» encaja como título del bloque actual de
   fundadores sin nombres propios.
6. ⚠️ Claims fuertes nuevos: «Largest population of green sea turtles in the
   DR», «one of the DR's leading coral restoration programs» — son del copy
   aprobado del cliente: se portan tal cual (la responsabilidad del claim es
   suya; se lista en la entrega igual que los ratings inventados de la v1
   PERO aquí sí hay aprobación explícita → se pinta).

**Archivos:** `data/sostenibilidad.ts`, `data/fundacion.ts`,
`recorrido-sostenibilidad.tsx`, `aporte-sostenibilidad.tsx`,
`impacto-sostenibilidad.tsx`, `fundacion-teaser.tsx`.
**Esfuerzo:** medio-alto (mucho texto distribuido). **Riesgo:** bajo.

## §3 — Los 6 proyectos + timeline dinámica (págs. 9–10 + slide 81)

**Cliente:** intro nueva («Real conservation isn't measured by the number of
corals we plant…») + los 6 con copy aprobado:
01 Coral Reef Restoration · 02 **Restoring Marine Biodiversity** (el doc
anota: «Mucho más potente que simplemente “Aumentar especies clave”» — es
comentario del cliente, NO copy) · 03 Cleaner Oceans · 04 Working with Local
Fishermen · 05 Environmental Education & Ecotourism · 06 **Marine Protected
Area Management** (nuevo).
**Slide 81 + 📞 reunión:** más dinámica, mantener timeline, añadir fotos
(coral, tortuga) y efecto.

**Estado en el repo:** HOY SON 5 proyectos en `data/fundacion.ts`,
consumidos por DOS vistas: `proyectos-sostenibilidad.tsx` (timeline vertical
en /ventaja-competitiva — la de la captura del slide) y
`frentes-fundacion.tsx` (barrido horizontal con snap en /fundacion).

**Cómo lo aplicamos:**
1. `data/fundacion.ts`: 5 → **6** proyectos con el copy EN aprobado (ambas
   vistas lo heredan gratis — es el pago de compartir data).
2. Timeline vertical: foto real por proyecto (coral ✓, tortuga ✓, limpieza ✓
   — hay material en el repo; pescadores/educación → verificar, si no
   `[placeholder-v3]`) + reveal `ScrollTrigger.batch` (patrón estándar).
3. Barrido horizontal de /fundacion: gana la 6ª card; verificar que el snap
   soporta N+1 (el hook `use-frentes-horizontal.ts` es genérico).
4. ⚠️ La decisión abierta de la v2 (duplicación /ventaja-competitiva vs
   /fundacion de proyectos y membresías) SIGUE ABIERTA — esta tanda la roza:
   si Samuel decide que solo una página los cuenta, mejor decidirlo ANTES de
   retocar ambas vistas. Recomendación: /fundacion cuenta los proyectos en
   detalle; /ventaja-competitiva los resume y enlaza (y el slide 81 pide
   dinamismo justo en la vista de /ventaja-competitiva — un resumen visual
   con fotos ES eso).

**Archivos:** `data/fundacion.ts`, `proyectos-sostenibilidad.tsx`,
`frentes-fundacion.tsx`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §4 — Tarjetas de cierre (págs. 11–12)

**Cliente:** tarjeta izquierda «Become Part of the Change» (3 checks +
botón «Support the Foundation») y derecha «Healthier Reefs. Stronger
Communities.» (párrafo + 3 checks con los US$ 4.50/2.00 + botón «Book Your
Experience. Leave a Positive Legacy.»).

**Estado en el repo:** `cierre-doble.tsx` — el bloque de dos tarjetas que
/ventaja-competitiva y /fundacion COMPARTEN.

**Cómo lo aplicamos:** reemplazo de copy 1:1 (estructura idéntica: dos
tarjetas, checks, botón cada una). El botón «Support the Foundation» sigue
llevando a /contacto mientras no existan las membresías (pendiente v2, sin
cambio).
**Archivos:** `cierre-doble.tsx` o su data.
**Esfuerzo:** bajo.

## §5 — CTA final (pág. 13)

**Cliente:** la banda pre-footer «Tu día en el Caribe empieza aquí» →
«**YOUR CARIBBEAN STORY STARTS HERE**».

⚠️ INICIO pide «Ready for an unforgettable day?» para la misma banda (plan
03 §6). → La banda del footer acepta texto por página (prop); home usa el
suyo, /ventaja-competitiva (¿y /fundacion? — propuesta: sí, mismo texto de
sostenibilidad) usa este.
**Archivos:** `footer.tsx` + páginas.
**Esfuerzo:** bajo.

## Dudas para Samuel

1. ¿Cerramos aquí la duplicación v2 (§3.4) con la división propuesta
   (detalle en /fundacion, resumen dinámico en /ventaja-competitiva)?
2. El texto del CTA de /fundacion: ¿hereda «Your Caribbean story starts
   here» o mantiene otro?
3. Los claims superlativos del §2.6: ¿los pintamos tal cual (aprobados) o
   les pides al cliente el respaldo antes? Mi lectura: van (son su copy),
   listados en la entrega.
