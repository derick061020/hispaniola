# Plan de correcciones v2 — SOSTENIBILIDAD / VENTAJAS COMPETITIVAS

> Fuente: slides 57–64 del PDF.
> Cruzado con: `pages/sostenibilidad.tsx`, `data/sostenibilidad.ts`,
> `components/sostenibilidad/*` (6 componentes), `App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR — el 70% de esto ya está construido

El slide 57 dice **«nueva pagina de ventajas competitivas»** y debajo, más
pequeño, **«Sostenibilidad / ventajas competitivas»**.

**No es una página nueva.** Es `/sostenibilidad`, que ya existe con 6 componentes
y 157 líneas de datos. Y cuando se cruzan los slides 58–64 con `data/sostenibilidad.ts`,
la coincidencia es casi total — hasta el punto de que **su maqueta de IA
probablemente partió de nuestra propia página**:

| Slide | Qué pinta | Estado en el repo |
|---|---|---|
| 58 | Hero «La sostenibilidad en el centro de nuestra misión» + «Una huella positiva en cada lugar donde operamos» | **existe literal** (`SOSTENIBILIDAD.titulo`, `mision`) |
| 59 | «Míralo con tus propios ojos» — 7 videos | **existen los 7, en el mismo orden** (`VIDEOS_SOSTENIBILIDAD`) |
| 60 | «Hitos ambientales reales» — áreas marinas protegidas / tortugas verdes / restauración de coral | **existe** (pilar `conservacion`) |
| 61 | «Tu reserva sostiene a nuestra gente y al mar» — **US$ 3,50** + **US$ 2,00** por huésped | **existe** (`aportes`) |
| 61 | «Sostenibilidad también es cuidar a las personas» — orfanato | **existe** (pilar `comunidades`) |
| 62 | **Fundación Ecológica Arrecifes de Bávaro** + los 2 cofundadores + 2016 + 3er vivero del país | **NUEVO** |
| 63 | **«Cuidar los arrecifes empieza con las personas»** — 5 proyectos numerados | **NUEVO** |
| 64 | **«Conoce nuestras membresías»** + «Quiero apoyar la fundación» | **NUEVO** |
| 58 | Fila de **7 chips de filtro** | **NUEVO** |

Así que el trabajo real son **4 cosas**, no 8 slides. Y una reformulación de
encuadre (§1).

---

## §1 — Slide 57: el encuadre — «ventaja competitiva», no solo «sostenibilidad»

**Cliente:** el eyebrow de su hero dice **«NUESTRA VENTAJA COMPETITIVA»** donde
el nuestro dice «Sostenibilidad», y titula la slide *«nueva pagina de ventajas
competitivas»*.

**Estado en el repo:** curiosamente, **el repo ya sabe esto**. `data/sostenibilidad.ts`
documenta que la página fusiona `sustainability.php` **y**
`competitive-advantage.php` de la web real, y el bloque de los 7 videos ya lleva
`videosEyebrow: 'Nuestra ventaja competitiva'`. La idea ya está — enterrada en
una sección, no en el encuadre de la página.

**Qué está pidiendo realmente:** que la sostenibilidad **se venda** en vez de
solo informarse. Hoy la página está declarada explícitamente como *«página de
MARCA (informa), no de conversión: sin widget ni cotización»*
(`pages/sostenibilidad.tsx:29-31`).

**Cómo lo aplicamos:** cambiar el eyebrow del hero a «Nuestra ventaja
competitiva» es una línea. Lo que cuesta es la consecuencia: si es ventaja
competitiva, la página necesita un cierre que **convierta**, no solo que emocione.
Su slide 64 lo trae ya («Reserva y deja tu huella»).

### 📞 REUNIÓN 07-24 — confirma que NO es una página nueva (33:52–35:10)

Samuel hace la pregunta directa al llegar al slide 57 (34:14): *«¿pero qué
diferencia hay [con] el anterior [sostenibilidad]?»* — y Miguel contesta
(34:17): *«**básicamente** [lo mismo]»*.

**Eso zanja el TL;DR de este plan**: «ventajas competitivas» no es una página, es
un **reencuadre** de `/sostenibilidad`. No hay ruta nueva que crear.

Y confirma cuál es el ángulo, con sus propias palabras (34:23):

> *«**Tu reserva sostiene a nuestra gente y al mar**… que se destinan… dinero
> para donar.»*

Es literalmente el titular que ya existe en el repo para el bloque de `aportes`
(los US$ 3,50 + US$ 2,00 por huésped). O sea: **el argumento que el cliente
considera su ventaja competitiva ya está escrito en nuestra página** — lo que
falta es que deje de ser una banda a media página y pase a ser **el encuadre**.
Eso es exactamente lo que §1 propone, y ahora está confirmado de viva voz.

**Duda de nombre y ruta:** el menú nuevo (slide 20) mantiene el tab
**«Sostenibilidad»** con sub-ítems «Sostenibilidad» y «Fundación». Es decir: el
cliente **no** quiere renombrar la ruta, quiere reencuadrar el mensaje. Así que
`/sostenibilidad` se queda. Bien — no hay que romper URLs ni SEO.

**Archivos:** `data/sostenibilidad.ts`, `components/sostenibilidad/cabecera-sostenibilidad.tsx`.
**Esfuerzo:** trivial. **Riesgo:** ninguno.

---

## §2 — Slide 58: los 7 chips de filtro

**Cliente:** bajo el hero, fila de chips: `En video` · `Conservación` ·
`Impacto por huésped` · `Comunidad` · `La fundación` · `Proyectos` · `Membresías`.

**Estado en el repo:** la página es un scroll lineal de 5 bloques
(`IntroSostenibilidad` → `RecorridoSostenibilidad` → `ImpactoSostenibilidad` →
`VideosSostenibilidad` → `CierreSostenibilidad`), con un **recorrido animado con
GSAP** (la curva, la estela y el catamarán) que atraviesa los 3 pilares.

**Cómo lo aplicamos:** son **anclas**, no filtros — el cliente los dibuja como
chips pero cada uno corresponde a una sección que existe (o existirá con §3, §4,
§5). Un nav de anclas es exactamente lo que ya hace `components/tour/anclas-ficha.tsx`
en la ficha de tour. Reutilizar ese componente, no dibujar otro.

⚠️ **Cuidado con el recorrido GSAP.** `use-recorrido-sostenibilidad.ts` anima el
avance del catamarán en función del scroll. Un nav de anclas que **salta** a
media página deja esa animación en un estado intermedio raro. Hay que verificarlo
saltando a cada ancla, no solo haciendo scroll normal. Es el tipo de bug que solo
aparece si se prueba a propósito.

Y hay que decidir: si son **anclas**, el orden de las secciones tiene que
coincidir con el orden de los chips. El cliente los ordena `En video` primero,
pero en el repo los videos van cuartos. O se reordena la página, o los chips van
en el orden real. **Recomiendo el orden real** — el recorrido de los 3 pilares
está pensado como narrativa (`pages/sostenibilidad.tsx:20-24`: *«los pilares
cuentan QUÉ se hace y las cifras rematan CUÁNTO — separarlas con los videos en
medio rompía el remate»*). Ese razonamiento sigue valiendo.

**Archivos:** `pages/sostenibilidad.tsx`, `components/tour/anclas-ficha.tsx`
(generalizar), `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** medio (interacción con GSAP).

---

## §3 — Slide 62: la fundación, con nombre y fundadores

**Cliente:** bloque **«NUESTRA FUNDACIÓN — Fundación Ecológica Arrecifes de
Bávaro»**:
> *«Nace de la pasión compartida por el medio ambiente de **Fernando Sánchez
> Fernández** y **Manuel Alejandro Redondo**, con el respaldo de Hispaniola
> Aquatic Adventures, cuya operación en Playa Bávaro fue testigo del deterioro de
> los ecosistemas marinos por el crecimiento del turismo.*
> *Ante la alarmante pérdida de arrecifes, en **2016** se inició un ambicioso
> proyecto de restauración coralina y construcción de arrecifes artificiales, en
> colaboración con el Ministerio de Medio Ambiente — hoy reconocido como el
> **tercer vivero de coral más importante del país**.»*

+ 3 chips (`2016` inicio del proyecto · `3er` vivero de coral del país ·
`Aliados` Ministerio de Medio Ambiente) + tarjeta «LOS FUNDADORES» con los dos
nombres y «Hispaniola Aquatic Adventures — empresa que respalda la fundación».

**Estado en el repo:** **contenido nuevo y valioso.** El repo habla de la
«Bávaro Reefs Foundation» pero nunca dice quién la fundó, cuándo, ni con quién
colabora. Y la web nueva menciona un *«proyecto de restauración top-3 del país»*
(`arrecife-teaser.tsx`) sin explicar de dónde sale ese top-3 — **este texto es
justo la explicación que falta.**

Un detalle de vocabulario: el nombre oficial es **«Fundación Ecológica Arrecifes
de Bávaro»**, mientras el sitio usa «Bávaro Reefs Foundation» y el menú nuevo
dice «Fundación», y el plan 05 vio «Fundación The Bávaro Reef» como departamento.
**Son cuatro nombres para la misma entidad.** Hay que fijar uno y usarlo en todas
partes. Recomendación: el nombre legal en español para el bloque institucional, y
un solo alias corto para el resto del sitio.

**Y una nota que hay que mirar de frente:** el cofundador se llama **Fernando
Sánchez Fernández** — y «Fernando» es el nombre del cliente que manda estas
correcciones (`hispaniola.md`: *«el cliente (Fernando)»*). Muy probablemente es
la misma persona. Eso hace el dato fiable, pero conviene confirmarlo antes de
publicar el nombre completo de alguien.

**¿Sección o página propia?**

> ✅ **DECIDIDO (Samuel, 2026-07-26): página propia en `/fundacion`** (singular —
> `/fundaciones` sigue siendo la página interna de tokens; ver el aviso en el
> plan 02 §1).
>
> Eso cambia este §3: el bloque no es una sección más de `/sostenibilidad`, es
> **la cabecera de una página nueva** que además absorbe el chip «La fundación»
> del §2. Queda por decidir cuánto se muda: recomiendo que `/fundacion` se lleve
> el bloque institucional (§3) + los 5 proyectos (§4) + las membresías (§5), y
> que `/sostenibilidad` se quede con la misión, el recorrido de los 3 pilares, la
> banda de impacto y los 7 videos, más un **teaser con enlace** a `/fundacion`
> — mismo patrón que la flota en `/nosotros` (plan 04 §1). Así ninguna de las dos
> queda coja y no se duplica copy.

**Archivos:** `data/sostenibilidad.ts`,
`components/sostenibilidad/fundacion.tsx` (nuevo), `pages/sostenibilidad.tsx`,
`dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo. **Bloqueo:** confirmar los dos nombres.

---

## §4 — Slide 63: los 5 proyectos

**Cliente:** **«PROYECTOS SOSTENIBLES — Cuidar los arrecifes empieza con las
personas»**, lead *«Impulsamos acciones que conectan a la comunidad con la
conservación: educación, voluntariado y experiencias reales que transforman
conciencia en impacto.»* Card destacada arriba (**Arrecifes artificiales** —
*«Crear las condiciones ecológicas necesarias para la restauración y el
desarrollo de arrecifes coralinos, a través de la vigilancia y protección
ambiental»*) + 5 numeradas:

1. **Restaurar la cobertura viva de coral** — «Rescate de fragmentos de
   oportunidad, trasplante desde viveros y siembra por fragmentación in-situ en
   puntos importantes.»
2. **Aumentar especies clave** — «Recuperar poblaciones ecológicamente
   importantes: peces loro, langostas, capitanes, pargos y otras.»
3. **Saneamiento del área** — «Programa de limpieza de Bávaro/Punta Cana con
   jornadas de recolección de residuos sólidos.»
4. **Alternativas para pescadores** — «Métodos de pesca sustentables que
   resuelven conflictos comunitarios y los integran a la conservación.»
5. **Fomentar el ecoturismo** — «Actividades y campañas de educación ambiental con
   clientes, centros educativos y comerciantes de la zona.»

**Estado en el repo:** **nuevo, y es el mejor contenido de todo el PowerPoint.**
Es específico, verificable y suena a memoria real de una fundación, no a
marketing. «Peces loro, langostas, capitanes, pargos» no lo escribe una IA
genérica — eso lo escribe alguien que trabaja ahí.

**Cómo lo aplicamos:** aquí el proyecto tiene un patrón **exacto** ya resuelto y
repetido 3 veces (Nosotros → Sostenibilidad → Guías, todas el 2026-07-17), y está
documentado en los Aprendizajes de `hispaniola.md` como la cura del olor a
«editorial de listas apiladas»:

> numeral fantasma (número grande, translúcido, `color-mix(in srgb,
> var(--color-aqua) 14%, transparent)`) con el título montado encima por margen
> negativo, separado por hairline (`divide-y`/`border-t`, cero fondo ni `ring`), y
> reveal por `ScrollTrigger.batch` (fade+subida, `once:true`, SIN scrub).

La maqueta del cliente pinta exactamente eso: **cards con el número grande en
gris a la izquierda**. Su maqueta las pone como cards con `ring`, que es
precisamente el «olor a rediseñar» que Samuel ha señalado tres veces. Se usa el
patrón de la casa, no el de la maqueta.

Y de paso: la nota de Aprendizajes decía *«candidato real a extraerse como
snippet/patrón documentado la próxima vez que aparezca — sería la 4ª»*.
**Esta es la 4ª.** Toca extraerlo a un componente compartido en vez de copiarlo
por cuarta vez. Buen momento, y es exactamente lo que ese apunte pedía.

**Archivos:** `data/sostenibilidad.ts`,
`components/ui/lista-editorial.tsx` (**nuevo — el patrón extraído**),
refactor de `sostenibilidad/`, `nosotros/`, `guias/` para consumirlo,
`components/sostenibilidad/proyectos.tsx` (nuevo), `dev/dev-registry.ts`.
**Esfuerzo:** medio (el refactor es lo que suma, y merece la pena).
**Riesgo:** bajo — el refactor toca 3 páginas ya entregadas, hay que verificarlas.
**Bloqueo:** ninguno. **Esto se puede hacer hoy.**

---

## §5 — Slide 64: membresías y el cierre

**Cliente:** dos bandas.
- Verde: **«Conoce nuestras membresías»** / *«Cada aporte cuenta. Al unirte,
  apoyas iniciativas que protegen nuestros ecosistemas y educan a futuras
  generaciones.»* / botón **«Quiero apoyar la fundación»**.
- Navy: **«DEJANDO UNA HUELLA POSITIVA — Arrecifes más sanos, comunidades más
  fuertes»** + el texto de cierre + botón **«Reserva y deja tu huella»**.

**Estado en el repo:** la segunda banda **ya existe** —
`CierreSostenibilidad` con `cierreTitulo: 'Dejar una huella positiva'` y el
`cierreTexto` casi palabra por palabra. Lo único que le falta es el **CTA**, y
eso fue deliberado (`data/sostenibilidad.ts`: *«Sin CTA: el "Ver disponibilidad"
canónico vive en el Footer Océano, justo debajo — duplicarlo aquí serían dos
botones pegados»*).

Con el encuadre nuevo de «ventaja competitiva» (§1) ese razonamiento cambia: si
la página **vende**, necesita su propio remate. «Reserva y deja tu huella» es
mejor copy que el genérico del footer y no es el mismo mensaje. **Se añade.**

**Las membresías son lo nuevo, y hay un límite:** un botón «Quiero apoyar la
fundación» tiene que llevar a algún sitio. Hoy no hay:
- ni página de membresías con niveles y precios,
- ni forma de cobrar (mismo bloqueo Derick/Odoo que el resto de pagos),
- ni datos de qué son esas membresías.

Opciones: (a) el botón lleva a `/contacto` con un asunto precargado — funciona hoy,
es honesto y recoge interés real; (b) sección con los niveles de membresía si el
cliente los define, y el pago cuando haya pasarela; (c) no ponerlo todavía.

**Recomiendo (a)**: cero promesas incumplidas, cero inventos, y el cliente
empieza a recibir gente interesada desde el primer día. Cuando haya niveles y
pasarela, se sustituye.

**Archivos:** `components/sostenibilidad/membresias.tsx` (nuevo),
`components/sostenibilidad/cierre-sostenibilidad.tsx`, `data/sostenibilidad.ts`,
`dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.
**Duda para Samuel:** (a), (b) o (c). Y si (b): **¿qué niveles de membresía hay,
con qué precio y qué recibe cada uno?**

---

## Corrección a la lista de «pedir al cliente» del índice

Al cruzar con el código apareció algo que conviene registrar: **las cifras de
US$ 3,50 y US$ 2,00 por huésped (slide 61) NO son inventadas por la IA** — están
en `data/sostenibilidad.ts` desde antes, portadas literales de
`sustainability.php`, con esta nota: *«son un dato del cliente, no se inventan ni
redondean»*. Su maqueta las leyó de nuestra página o de la suya.

Las que **sí** siguen pendientes de contrastar son las 4 de la banda de impacto
(12.000+ corales, 350 tortugas, 5.000 m², 200+ niños), que vienen de un mockup
que aportó Samuel el 2026-07-22 y ya están marcadas en el código como
*«pendientes de contrastar contra las memorias reales de la Bávaro Reefs
Foundation antes de publicar»*. **Este plan es el momento de contrastarlas**,
porque la página va a crecer justo alrededor de ellas.

---

## Resumen: qué se puede hacer ya

| Trabajo | ¿Bloqueado? |
|---|---|
| Reencuadre a «ventaja competitiva» (§1) | **no — 1 línea** |
| Nav de anclas (§2) | **no** — verificar con GSAP |
| Los 5 proyectos (§4) | **no — el mejor contenido de la tanda** |
| Extraer el patrón editorial a componente (§4) | **no — y toca hacerlo** |
| CTA de cierre (§5) | **no** |
| Bloque de la fundación (§3) | casi — confirmar los 2 nombres |
| Membresías (§5) | sí — no existen niveles ni pasarela |
| Fotos propias de la fundación | **sí — pendiente desde la v1** |
| Contrastar las 4 cifras de impacto | **sí — y urge** |

**Este plan es el más rentable de los ocho**: casi todo se puede hacer sin
esperar nada, el contenido nuevo es excelente, y de paso salda una deuda técnica
que el propio proyecto se había apuntado (el patrón editorial, 4ª aparición).
