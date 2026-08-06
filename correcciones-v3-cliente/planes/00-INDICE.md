# Correcciones v3 del cliente — índice de planes

> Fuentes (6 + 1):
> - `power-point-v3.pdf` — **17 slides** que CONTINÚAN la numeración del v2
>   (el v2 acabó en 65 → estas son las **slides 66–82**; la reunión lo confirma:
>   «en la 66», «las siguientes a 68»). Cambios de diseño/estructura/jerarquía.
> - `WEBSITE - INICIO.pdf` (6 págs), `WEBSITE-TOURS.pdf` (22), `WEBSITE -
>   NOSOTROS.pdf` (17), `WEBSITE-EVENTOS.pdf` (7), `WEBSITE-SOSTENIBILIDAD.pdf`
>   (13) — **copy aprobado EN INGLÉS** por el cliente + eliminaciones (secciones
>   tachadas en rojo).
> - `meeting-power-point-v3.pdf` — reunión Miguel ↔ Samuel del **2026-07-31**
>   (32 min; los primeros ~11 min son de OTRO proyecto). Aclara la mayoría de
>   slides del PowerPoint. Marcado como **📞 REUNIÓN 07-31** en los planes.
>
> Leídas renderizando a PNG con PyMuPDF a 110 dpi + extracción de texto embebido
> (playbook `correcciones-cliente-visual` §1).
> Cruzado con: el código real en `staging` = `master` (commit `df7283c`).
> Estado: **propuesta para iterar con Samuel. NADA EJECUTADO.**

## Qué es esta tanda

Dos encargos distintos que conviene no mezclar:

1. **El PowerPoint (slides 66–82)** — cambios de diseño, jerarquía y
   estructura: efectos «eco», menús del charter por duración (3h/4h) y por
   tamaño de grupo (≤20 / 21+), banner premium del charter, rediseño de los
   tarifarios, secciones nuevas (Karaya en corporativo, mensaje de novios
   gratis en bodas), y varios «quitar esto». Es el trabajo creativo con
   enfoque en conversión/UX. → **plan 02**.
2. **Los 5 WEBSITE** — reemplazo de textos por **copy aprobado en inglés** +
   eliminación de secciones redundantes. Traen implícito **EL cambio grande de
   la tanda: el idioma principal del sitio pasa a INGLÉS** (español pasa a
   secundario; el toggle se invierte). → **plan 01** (transversal) + planes
   03–07 (por página).

**Decisión ya tomada (Samuel, 2026-08-06): «i18n preparado, EN ahora»** — se
centraliza/conserva el ES como diccionario futuro, todo el sitio pasa a inglés,
el toggle se invierte (EN primero y activo) pero sigue siendo visual. El
cableado real del ES es una fase posterior, fuera de esta tanda.

## Tabla de planes

| # | Plan | Fuente | Peso |
|---|---|---|---|
| 01 | [Idioma: inglés principal](01-idioma-ingles.md) | los 5 WEBSITE + barrido | **ALTO** — toca TODOS los archivos con texto |
| 02 | [PowerPoint v3 (slides 66–82)](02-power-point.md) | power-point-v3 + reunión | **ALTO** — diseño/estructura, ficha charter |
| 03 | [Home](03-inicio.md) | WEBSITE - INICIO | MEDIO |
| 04 | [Fichas de tour](04-tours.md) | WEBSITE-TOURS | **ALTO** — 4 fichas, itinerarios nuevos |
| 05 | [Nosotros: equipo, flota, instalaciones, Marine Park](05-nosotros.md) | WEBSITE - NOSOTROS | **ALTO** — incluye página NUEVA |
| 06 | [Eventos](06-eventos.md) | WEBSITE-EVENTOS | MEDIO |
| 07 | [Sostenibilidad / fundación](07-sostenibilidad.md) | WEBSITE-SOSTENIBILIDAD | MEDIO |

## Cómo se leyeron las anotaciones (taxonomía del playbook)

| Tipo | Qué es | Dónde abunda |
|---|---|---|
| **1. Flecha + texto** | «Agregar aquí de 15 años en adelante», «quitar esto de flota» | PowerPoint |
| **2. Bloque CHANGE:/REMOVE:/QUITAR:** | Copy nuevo aprobado (casi todo EN) bajo la captura de la sección que sustituye | los 5 WEBSITE |
| **3. Tachado en rojo (X)** | Sección entera que se elimina | WEBSITE (flota, instalaciones) |
| **4. Maqueta de cajas grises** | Estructura propuesta (menú 3h) — se toma la ESTRUCTURA, nunca la estética | PowerPoint slide 74 |

## Los 4 choques de fondo (leer antes que cualquier plan)

### 1. El idioma toca TODO, y el orden de ejecución importa

Si se traduce primero y se reestructura después (o al revés) por separado, se
paga dos veces. La propuesta de fases de abajo hace **ambas cosas por página en
la misma pasada** y deja el barrido exhaustivo de español residual para el
final, cuando ya nada se mueve.

### 2. Rutas en español en un sitio en inglés — ✅ DECIDIDO: slugs en inglés

**Samuel, 2026-08-06: las rutas pasan a inglés**, con 301 desde las viejas.
Las 20+ rutas eran slugs en español (`/tours/...`, `/flota`, `/tripulacion`,
`/instalaciones`, `/fundacion`, `/ventaja-competitiva`, `/por-que-reservar`,
`/reservar/...`). Onda expansiva: App.tsx, menús, footer, sitemap, redirects
en `netlify.toml` + `vercel.json`. Mapa completo en el plan 01 §4.

### 3. Contradicciones internas entre las propias fuentes

Las más gordas (cada plan las detalla):

- **Langosta**: slide 73 dice «la langosta solo va en Saona» (quitar el add-on
  del menú 4h del charter), pero el copy aprobado de WEBSITE-TOURS dice del
  charter 4h «Fresh lobster is available as an optional upgrade». ⚡
- **Capacidades del charter**: WEBSITE-TOURS dice Maite hasta 15 y Forever
  Teresa hasta 85; el repo (portado del tarifario v2) dice Maite 20 y FT
  hasta 120. El tarifario escrito del charter sigue sin llegar (pendiente #11
  de la v2). ⚡
- **Karaya**: la slide 80 dice «catamarán más grande del Caribe, +200
  personas» y lo llama «Eclipse» (¿ruido de transcripción?); WEBSITE-EVENTOS
  dice «Karaya Punta Cana by Hispaniola, ~1.000 m², up to 300 guests». ⚡
- **Año de fundación de la empresa**: el copy nuevo dice «since 2010» y la
  línea de tiempo de flota arranca en 2010 con la llegada de Teresa; el repo
  dice «desde 2012» (auditado de la web actual). El copy aprobado gana → se
  cambia a 2010, pero se le pregunta al cliente porque su propia web decía
  otra cosa.
- **Aporte por huésped**: el copy nuevo dice **US$ 4.50** (equipo) + US$ 2.00
  (conservación); el repo tiene US$ 3.50 + 2.00 (portado de la web actual).
  El copy aprobado gana → 4.50.
- **CTA de cierre**: INICIO pide «Ready for an unforgettable day?» y
  SOSTENIBILIDAD pide «Your Caribbean story starts here» para la MISMA banda
  visual pre-footer → la banda pasa a ser configurable por página.

### 4. «No inventar datos» sigue vigente — con los huecos de siempre

Miguel dijo en la reunión que va a grabar/recopilar fotos y videos (menú de
brochetas, porción por persona, cómo se sirve, videos de instalaciones, fotos
de Karaya). Hasta que lleguen: **placeholder evidente, marcado
`[placeholder-v3]`** (mismo grep-único que la v2 con `[placeholder-v2]`).
Los nombres «bonitos» para los paquetes de eventos (slide 82) son labels de
marketing, no datos — se proponen en el plan 06 y **los aprueba el cliente**
antes de publicar.

## Orden de ejecución propuesto (fases = commits)

> `staging` = rama de ejecución (ya decidido). `master` queda como punto de
> retorno. Commit-base con los planes antes de tocar producto + **tag
> `v3-pre-en`** para conservar el sitio completo en español (es el
> «diccionario» del futuro cableado ES).

| Fase | Qué | Planes |
|---|---|---|
| F0 | Commit-base + tag `v3-pre-en` + decisión de rutas | 01 |
| F1 | Infra de idioma: toggle invertido (EN activo), `<html lang="en">`, formato de números/fechas EN, banda CTA configurable | 01 |
| F2 | Home: copy EN + quitar secciones + slides 66–67 (premios a color, eco banner, contacto, mi-reserva búsqueda) | 03 + 02 |
| F3 | Fichas de tour: copy EN (semi-privado, snorkel, charter, saona) + slides 71–78 (menús 3h/4h, banner premium, tarifarios, qué llevar) | 04 + 02 |
| F4 | Eventos: copy EN + slides 79–80, 82 (bodas, Karaya, nombres de paquetes) | 06 + 02 |
| F5 | Nosotros: equipo + flota (slides 68–70) + instalaciones + **página nueva Marine Park** | 05 + 02 |
| F6 | Sostenibilidad/fundación: copy EN + slide 81 (timeline dinámica) | 07 + 02 |
| F7 | Barrido exhaustivo de español residual (metodología en plan 01 §5) — funnel, mi-reserva, FAQ, blog, legal, 404, formularios, SEO metas | 01 |
| F8 | QA: build real (`tsc -b` + `npm run build && preview`), responsive, rutas, consola, grep `[placeholder-v3]` | — |

## Decisiones tomadas (Samuel, 2026-08-06)

| Tema | Decisión |
|---|---|
| **Slugs de rutas** | **Inglés**, con 301 desde los ES (plan 01 §4) |
| **Páginas legales** | **Se traducen** las 4 (privacidad/términos/cookies/cancelación) |
| **Reseñas/testimonios** | **En inglés** — se usan reseñas REALES que ya están en inglés (Viator/TripAdvisor/Facebook), no se traducen las españolas |
| **Alcance del idioma** | «absolutamente toda la web» (instrucción original) → **el blog también se traduce**, no se oculta |
| **Modo de i18n** | «i18n preparado, EN ahora»: tag `v3-pre-en` conserva el ES como diccionario; el toggle se invierte pero sigue visual |
| **Rama** | `staging` (igual que la v2); `master` es el punto de retorno |

## Lo que sigue abierto (se ejecuta con supuesto, marcado en el código)

1. **La contradicción de la langosta** (slide 73 «solo en Saona» vs copy
   aprobado «optional upgrade» en charter 4h). **Supuesto de ejecución: se
   sigue el slide** (anotación directa sobre nuestra página, más específica)
   → el add-on sale del menú 4h del charter y se queda en Saona. Marcado
   `[conflicto-v3]`; revertir es una línea si el cliente dice lo contrario.
2. **Nombres de los paquetes de eventos**: se implementan Classic /
   Signature / Grand (+ Premium) — pendientes de OK del cliente (plan 06 §4).
3. **Capacidades del charter y del speedboat de Saona** (Maite 15 vs 20, FT
   85 vs 120, speedboat 9 vs 25): el copy aprobado va en la DESCRIPCIÓN; los
   tramos del tarifario NO se tocan hasta tener el tarifario escrito.
   Marcado `[conflicto-v3]`.
4. **Grid de flota**: se mantiene con los 6 barcos reales; la timeline nueva
   nombra los 12. No se inventan fichas de los 6 que faltan.
5. **¿Sigue en pie el 15 de agosto?** Si sí, el orden F0→F8 ya prioriza lo
   que ve el comprador (F2–F4) antes que las internas (F5–F6).

## Pedir al cliente (consolidado)

1. **Fotos del menú de brochetas** (slide 74): foto grande del menú completo,
   foto de la porción por persona y 2 de cómo se sirve. Miguel dijo que las
   pasa — sin ellas el bloque nuevo va con placeholder.
2. **Texto de «Recomendaciones adicionales»** (slide 72): la reunión solo dio
   ejemplos (crema solar, llevar dólares). Hace falta la lista real.
3. **Tarifario del charter POR ESCRITO** (pendiente desde v2): resuelve Maite
   15 vs 20 y Forever Teresa 85 vs 120, y los tramos.
4. **Langosta**: ¿add-on en charter 4h (como dice su copy aprobado) o solo en
   Saona (como dice su slide 73)?
5. **Karaya**: confirmar nombre público («Eclipse» no aparece en ningún otro
   material), capacidad (200+ vs 300) y fotos buenas (Samuel mencionó que las
   hay en el material de Trafic Experience).
6. **Edad mínima 15**: confirmar por escrito que el semi-privado pasa de
   «solo adultos» a «15 años en adelante» y si aplica a algún otro tour.
7. **Videos 360 de la flota** (slide 78) y **videos verticales de
   instalaciones**: ¿existen ya o se graban?
8. **Confirmar «since 2010»** (su web decía 2012 en secciones que auditamos).
9. **Nombre de la fundación**: el copy v3 usa mayoritariamente «Bávaro Reefs
   Foundation», pero también «The Bávaro Reef Foundation» (tienda) y «Los
   Arrecifes de Bávaro Ecological Foundation» (tours). Elegir UNO.
10. **La cifra de empleados**: el copy aprobado dice «more than 70» —
    coincide con lo decidido en v2. OK, solo confirmar que sigue.
