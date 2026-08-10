# Plan de correcciones — NOSOTROS

> **Fuente:** `nosotros - Ajustes web hispaniolaaquaticadventures.com.pdf` — 5 slides
> de contenido (p6 vacía).
> **Cruzado con:** `app/src/pages/nosotros.tsx`, `src/components/nosotros/*`,
> `src/data/nosotros.ts`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Contexto en el repo

`/nosotros` **ya fue rediseñada a fondo** el 2026-07-17 (Samuel: «hay puras cajas, está
horrible planteada»). Hoy monta: `CabeceraNosotros` (hero compartido) → `IntroNosotros`
(«Bienvenido a la familia Hispaniola») → `ExperienciaABordo` (3 paradas) →
`CocinaFlotante` → `TripulacionFlota` (4 roles sin nombre + 6 barcos reales) →
`ArrecifeTeaser`. Todo el contenido real de `about-hispaniola.php` ya está portado.

**Hallazgo clave:** la maqueta del cliente y la página actual **coinciden en casi todo**
(bienvenida, experiencia a bordo, cocina flotante, flota de 6). El cliente en la práctica
**valida** el rediseño. Lo que añade de nuevo es poco pero valioso.

## TL;DR — qué aporta la maqueta del cliente

1. **NUEVO — timeline histórico** «De un barco a una flota de seis» (2012 → hoy).
2. **NUEVO — nombres del equipo**: Omar (Fundador/Director), Lola (Tour Leader Manager),
   Eva (Sales Manager). → **desbloquea** la sección de equipo que estaba bloqueada por
   falta de datos.
3. Quote del fundador (Omar) como pieza destacada.
4. Reordenar/expandir hacia la estructura de la maqueta (validación del rediseño).

---

## Slide por slide

### Slide 1 — Bienvenida (ya existe)
**Cliente (maqueta IA):** «QUIÉNES SOMOS · Bienvenido a la familia Hispaniola» + video
«Un día con la familia Hispaniola · Conócenos en 60 segundos».
**Estado:** `IntroNosotros` ya tiene ese eyebrow, título y párrafos **idénticos**
(portados de la web real). Lo único nuevo: el **video de 60s** (hoy es una foto).
**Cómo lo aplicamos:** cambiar la foto de `IntroNosotros` por el video (reusar el asset
del hero/experiencia, o el «video del equipo» que pide la maqueta). Botón «Conócenos en
60s».
**Archivos:** `intro-nosotros.tsx`, `data/nosotros.ts`.
**Esfuerzo:** bajo. **Pide al cliente:** el video del equipo (60s).

### Slide 2 — NUEVO: historia con timeline + equipo con nombres
**Cliente (maqueta IA):**
- «NUESTRA HISTORIA · **De un barco a una flota de seis**» — quote de Omar (fundador):
  *«En 2012 empecé con un solo catamarán y una idea sencilla… trece años después somos
  una flota de seis barcos… seguimos tratándote como familia.»*
- **Timeline:** 2012 (nace con el primer barco) · 2013 (se construye el Santa María) ·
  2015 (llega el Forever Teresa) · 2016 (se incorpora el Maite) · Hoy (flota de 6).
- «**El equipo que te recibe**» — cards de Lola (Tour Leader Manager desde 2015), Eva
  (Atención al cliente desde 2018), Omar (Fundador/Director desde 2012) con quote y CTA
  («Escríbele a Lola», «Chatea con Eva», «Nuestra historia»).
**Estado en el repo:** **no hay timeline** y `TRIPULACION` tiene **4 roles SIN nombre**
(el comentario en `data/nosotros.ts:36` lo explica: el cliente no había dado nombres,
inventarlos sería fabricar contenido). **La maqueta ahora da esos nombres** → se puede
construir la sección de equipo real.
**Cómo lo aplicamos:**
- **Timeline** «De un barco a una flota de seis»: componente nuevo `historia-flota.tsx`
  con la línea de tiempo. Los años **ya existen** en `FLOTA` (Santa María 2013, Forever
  Teresa 2015, Maite 2016). Solo falta ordenar el relato y confirmar las fechas exactas
  (2012 fundación vs 2013 primer barco — la maqueta dice «2012 nace con el primer barco»
  pero los datos dicen Santa María 2013; **conciliar con el cliente**).
- **Equipo con nombres** (Omar/Lola/Eva): actualizar `TRIPULACION` → un nuevo tipo con
  `nombre`, `rol`, `desde`, `quote`, `cta`. ⚠️ Verificar los nombres/cargos con el
  cliente antes de publicarlos (son personas reales — no queremos un cargo mal puesto).
- La quote de Omar como bloque editorial destacado.
**Archivos:** `historia-flota.tsx` nuevo, `equipo-nosotros.tsx` nuevo (o ampliar
`tripulacion-flota.tsx`), `data/nosotros.ts` (timeline + equipo con nombres),
`dev-registry.ts`.
**Esfuerzo:** medio-alto. **Riesgo:** medio (datos de personas reales).
**Este mismo equipo** alimenta el teaser de equipo de la home (plan 01, slide 15) → una
sola fuente de datos.

### Slide 3 — Tripulación dominicana (ya existe)
**Cliente (maqueta IA):** «Y nuestra tripulación dominicana a bordo» — Capitán ·
Bióloga marina · Chef a bordo · Guía de snorkel.
**Estado:** **idéntico** a `TRIPULACION` actual (los 4 roles sin nombre). Ya está.
**Cómo lo aplicamos:** mantener. Se convierte en el «segundo nivel» del equipo (los
roles a bordo, sin nombre) bajo el equipo nominal (Omar/Lola/Eva) del slide 2. Encaja
con el «Y toda nuestra tripulación a bordo» de la maqueta.
**Archivos:** `tripulacion-flota.tsx` (ya existe).
**Esfuerzo:** nulo/bajo.

### Slide 4 — Experiencia a bordo (ya existe)
**Cliente (maqueta IA):** «LA EXPERIENCIA A BORDO · Un día de mar, cuidado al detalle» +
card «La única cocina flotante de Punta Cana» + 3 paradas (01 Snorkel en el vivero de
coral · 02 Playa desierta y coco-loco · 03 Piscina natural) + CTA «Vive este día».
**Estado:** **idéntico** a `ExperienciaABordo` + `CocinaFlotante` actuales (mismo copy,
mismas 3 paradas, misma cocina flotante). Ya está.
**Cómo lo aplicamos:** validar que el diseño actual está al nivel de la maqueta
(numeración 01/02/03, card de cocina destacada). Ajustes visuales menores si hace falta.
**Archivos:** `experiencia-abordo.tsx`, `cocina-flotante.tsx`.
**Esfuerzo:** nulo/bajo.

### Slide 5 — La flota (ya existe)
**Cliente (maqueta IA):** «LA FLOTA · Seis catamaranes, uno para cada plan» — 6 cards
(Santa María, Forever Teresa, Maite, GrandMa, Joker, Karaya) con capacidad, tipo, «Ideal
para…» y CTA («Ver tours con este barco» / «Cotizar para tu evento»).
**Estado:** `FLOTA` ya tiene **los 6 barcos reales** con specs verbatim de la web. La
maqueta añade dos cosas: **capacidad visible** («hasta 40/80/30…») y **«Ideal para…»**
+ **CTA por barco**.
**Cómo lo aplicamos:**
- Añadir a cada `BarcoFlota`: `capacidad` (hasta N), `idealPara` (texto corto), y CTA.
  Los datos de capacidad **ya existen** dispersos (Karaya 350, etc.) — consolidarlos.
- CTA «Ver tours con este barco» → enlaza a los tours que usan ese barco; «Cotizar para
  tu evento» → a eventos (Joker/Karaya son de eventos).
**Archivos:** `tripulacion-flota.tsx` (la parte de flota) o un `flota.tsx` propio,
`data/nosotros.ts` (ampliar `BarcoFlota`).
**Esfuerzo:** medio. **Riesgo:** bajo (datos ya existen).

---

## Estructura final propuesta para /nosotros

1. Hero (`CabeceraNosotros`) — ya existe.
2. Bienvenida + **video 60s** (`IntroNosotros`) — s1.
3. **NUEVO: Historia + timeline** «De un barco a una flota de seis» (quote de Omar) — s2.
4. **NUEVO: El equipo que te recibe** (Omar/Lola/Eva con nombre) — s2.
5. Tripulación dominicana a bordo (4 roles) — s3 (ya existe).
6. La experiencia a bordo (3 paradas) + cocina flotante — s4 (ya existe).
7. La flota: 6 catamaranes con capacidad/ideal/CTA — s5 (ampliar).
8. Arrecife teaser → sostenibilidad (`ArrecifeTeaser`) — ya existe.

## Orden de ejecución sugerido

1. **Confirmar datos con el cliente** (nombres/cargos del equipo, fechas del timeline) —
   bloquea el resto.
2. Ampliar `FLOTA` (capacidad + ideal + CTA) — s5, sin dependencias.
3. Timeline histórico — s2 (datos casi listos).
4. Sección de equipo con nombres — s2 (tras confirmar datos) → también alimenta home s15.
5. Video de bienvenida — s1 (tras recibir el asset).

## Pide al cliente (assets/decisiones que faltan)

- **Confirmar nombres, cargos y «desde» del equipo** (Omar/Lola/Eva — ¿correctos?).
- **Fechas exactas del timeline** (¿2012 o 2013 el primer barco? conciliar con specs).
- **Fotos reales** del equipo (Omar/Lola/Eva) — hoy la maqueta usa círculos de color.
- **Video del equipo (60s)** para la bienvenida.
- **Quotes reales** de cada persona (la maqueta las inventó — confirmar o sustituir).
