# Plan de correcciones v2 — SOSTENIBILIDAD / VENTAJAS COMPETITIVAS

> Fuente: slides 57–64 del PDF.
> Cruzado con: `pages/sostenibilidad.tsx`, `data/sostenibilidad.ts`,
> `components/sostenibilidad/*` (6 componentes), `App.tsx`.
> Estado: **EJECUTADO el 2026-07-28** (pedido de Samuel: «cambia el slug a
> ventaja-competitiva, mira los slides 57 al 64 e incluye lo que no hay»).
> Ver «Qué quedó hecho» al final del documento.

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

---

## Qué quedó hecho (2026-07-28)

| § | Trabajo | Estado |
|---|---|---|
| — | **Slug `/sostenibilidad` → `/ventaja-competitiva`** | ✅ 301 real en `netlify.toml` + `<Navigate>` en `App.tsx`; sitemap, menú, footer, `/flota`, `/por-que-reservar`, `/fundacion` y los deep-links del Dev Mode actualizados. El archivo de página se renombró a `pages/ventaja-competitiva.tsx`; los componentes y los datos se quedan en `sostenibilidad/` (el dominio del contenido no cambió) |
| §1 | Reencuadre a «ventaja competitiva» | ✅ ya venía del 07-27 (eyebrow del hero) |
| §2 | Los 7 chips de anclas (slide 58) | ✅ `ui/nav-anclas-chips.tsx`, en el ORDEN REAL de la página. El scroll-spy se extrajo de `tour/anclas-ficha.tsx` a `ui/use-anclas-activa.ts` y ahora lo comparten las dos barras. `NavFlotante` cede el tope del viewport en esta ruta (`cedeElTope`, antes `esFicha`) — mismo criterio que la ficha. **La advertencia del GSAP no se materializó**: verificado saltando a cada ancla, el recorrido del catamarán se recalcula bien. Sí hubo que subir la barra a `z-40`: el barco va en `z-30` y le pasaba por delante |
| §3 | Bloque de la fundación (slide 62) | ✅ `/fundacion` gana el bloque «LOS FUNDADORES» y los 3 hitos sobre hairline; el copy sale a `data/fundacion.ts`. En `/ventaja-competitiva` va como **teaser** (`sostenibilidad/fundacion-teaser.tsx`), no duplicado |
| §4 | Los 5 proyectos (slide 63) | ✅ ya venía del 07-27, en `/fundacion`. **Pendiente la deuda técnica**: el patrón editorial sigue copiado por 4ª vez, sin extraer a `ui/lista-editorial.tsx` |
| — | Hitos ambientales (slide 60) | ✅ los 3 logros salen de la prosa del pilar de conservación y se cuentan aparte, sobre hairlines dentro del paso del recorrido |
| §5 | CTA de cierre + membresías | ✅ el cierre se queda con un solo remate («Reserva y deja tu huella»); el 2º botón a la fundación se retira porque el teaser de justo encima ya lo lleva. Membresías → `/contacto`, opción (a) |
| — | Copy del cliente | ✅ videos: eyebrow y titular intercambiados («Lo que nos diferencia, en video» / «Míralo con tus propios ojos»); aportes: «De cada reserva» → «Por cada huésped» |

**De hairlines a superficies (Samuel, mismo día, en dos tiempos).** Primero:
*«no uses tantas líneas divisorias, al cliente no le gusta tanta línea»*. Se
retiran las divisorias de las 4 cifras de la banda de impacto (iban entre 2
hairlines + 3 verticales — 5 líneas para 4 datos), de los 3 hitos del teaser,
de los 3 hitos ambientales del pilar, y en `/fundacion` de los hitos y de las 3
filas de «Los fundadores».

Y acto seguido, al verlo: *«esos elementos se ven flotando sin más, las líneas
tenían su propósito, hay que reemplazarlas por otra forma que cumpla ese
propósito pero que no sea líneas»*. **Correcto — el propósito era AGRUPAR.**
Quien agrupa sin dibujar nada es una SUPERFICIE: `--color-papel-hueso`, plana,
sin borde ni sombra ni ring, que es lo que ya hace `equipo/franja-equipo.tsx`.
Se aplica el MISMO recurso a los cinco bloques, para que sea un solo device
reconocible y no cinco soluciones distintas. De paso, «Los fundadores» pierde
también el borde de su marco: la superficie ya agrupa.

⚠️ Esto **no reabre** lo que Samuel rechazó del mockup el 2026-07-22 («no me
gusta meter un box y dentro más boxes»): aquello era un box VERDE con dos boxes
anidados dentro. Esto es una superficie neutra, plana y sin nada anidado, y el
aqua sigue siendo solo el acento de las cifras — nunca el fondo (dirección B).

Y tercera vuelta: *«dale un fondo a cada uno de los puntos, no un fondo general
a los 3»*. Correcto — un fondo único volvía a leer los 3 hitos como una lista
corrida, que es el mismo defecto que tenían con hairlines. Una superficie por
hito dice que son tres datos independientes. Aplicado en el teaser y en
`/fundacion`.

Se conserva el patrón editorial de los 5 proyectos (numeral fantasma +
hairline): es el de la casa y lleva 4 usos aprobados; tocarlo cambiaría también
Nosotros, Sostenibilidad y Guías.

**El dinero sale a sección propia: «A dónde va tu aporte».** Samuel: *«lo de por
cada huésped e iniciativas a la fundación, como que no se entiende mucho el
dinero que se da, está raro; yo solo pondría en el cuadro gris los 4 puntos, y
eso del dinero hay que ubicarlo de mejor forma en otra parte»*.

El diagnóstico es exacto y el defecto no era el sitio: era que **faltaba la
mitad de la información**. Un importe suelto no dice de dónde sale ni en qué se
gasta, y leído como pie de la banda de impacto parecía un donativo simbólico.
La sección nueva (`sostenibilidad/aporte-sostenibilidad.tsx`) hace que cada
importe cuente las tres cosas que hacen falta: **cuánto** (la cifra, en aqua),
**por quién** (por huésped, no por reserva — una reserva de seis paga seis
veces) y **en qué** (el detalle), bajo un lead que aclara que la partida es
fija «y no de lo que sobre». Una superficie por importe: con los dos en la
misma volvían a leerse como «una cifra y otra cifra».

Va pegada **debajo** de las 4 cifras y no en cualquier otro sitio: las cifras
son el resultado y esto es el mecanismo que lo financia. Separarlos más los
desconectaría. La banda gris se queda solo con los 4 puntos.

**El tramo de la fundación se muda entero a `/ventaja-competitiva`
(2026-07-28, 4ª vuelta).** Samuel pidió tres cosas seguidas: la disposición del
slide 62 en el teaser (*«a la derecha pon los fundadores, y esos 3 puntos
actuales ponlos abajo antes del botón CTA»*), traer el slide 63 (*«parece que no
está, agrégalo pero no así con box, puede ser con una barra de progreso vertical
y van apareciendo los puntos»*) y traer el slide 64 (*«tampoco está, agrega que
son CTAs importantes para apoyar la fundación»*).

- **Teaser**: adopta el reparto del slide 62. Es mejor que el nuestro — los 3
  hitos son el remate del párrafo que acaba de mencionar 2016, el vivero y el
  Ministerio; «quién está detrás» es otra pregunta y merece su propia caja. Y
  el CTA cierra la columna, después de todo el argumento.
- **Los 5 proyectos**: `sostenibilidad/proyectos-sostenibilidad.tsx` +
  `use-progreso-proyectos.ts`. Barra vertical con scrub y marcadores que se
  encienden con la punta. **Un solo ScrollTrigger** gobierna las dos cosas: con
  uno por punto, el marcador se encendería desincronizado de la barra, que es
  justo lo que el efecto promete. Estado natural del JSX = recorrido hecho
  (reduced-motion, `?dev-sost=estatico` y el frame de Figma).
- **Membresías**: sobre superficie clara, no sobre la cenital con velo navy de
  la versión de `/fundacion` — aquí lleva pegado debajo el cierre, que usa ese
  mismo asset con ese mismo velo.

> ⚠️ **DUPLICACIÓN CONSCIENTE, y hay que decidirla.** Los slides 63 y 64 viven
> ahora en `/ventaja-competitiva` **y** en `/fundacion`. El copy no se duplica
> (los cuatro componentes leen `data/fundacion.ts`), pero el texto se ve en dos
> páginas. Esto deroga de facto el límite entre páginas que se fijó el
> 2026-07-26. Si molesta, la decisión es **cuál de las dos lo cuenta** — no
> retocar uno de los dos textos para «diferenciarlos», que es como se acaba con
> dos versiones que dicen cosas distintas.

**Quinta vuelta, mismo día — tres ajustes más:**

- **Fundadores con las cards de equipo.** *«Que los fundadores se vean
  reutilizando las cards de tripulación, tal vez haya que cambiar la
  disposición de la sección»*. Hay que cambiarla, sí: esas cards son retratos
  4:5 a sangre y tres no caben en una columna de 5/12. El teaser pasa a **dos
  tiempos** (institucional arriba, fundadores en fila abajo) y **reutiliza el
  componente** que `/fundacion` ya monta, no un markup parecido — así las dos
  páginas enseñan los mismos tres, y las fotos, cuando lleguen, entran en los
  dos sitios tocando un solo `foto: null`.
- **Barra centrada y en zigzag.** Cabecera centrada y, desde `lg`, el eje al
  medio con los frentes alternando lado (los de la izquierda alineados a la
  derecha, para que los dos lados *miren* al eje). En móvil el eje se queda a
  la izquierda: a 390px, dos columnas de texto son dos columnas de tres
  palabras.
- **Los 2 CTA como tabla de precios.** `membresias-sostenibilidad.tsx` y
  `cierre-sostenibilidad.tsx` **se retiran** y su contenido pasa a
  `cierre-doble.tsx`: dos tarjetas gemelas con rótulo, titular, texto, lista
  con checks y botón a ancho completo. `items-stretch` + `mt-auto` es lo que
  hace que los dos botones caigan a la misma altura pese a textos distintos —
  en una tabla de precios se compara en horizontal y, si los botones bailan,
  se rompe. La de reservar va destacada (foto + velo navy, el tratamiento del
  cierre que sustituye), como el «plan recomendado» de esa anatomía.
  > ⚠️ Los puntos con check **no son viñetas de relleno**: salen de datos que
  > ya existen (los importes por huésped, los hitos y dos de los cinco
  > frentes). Inventar viñetas para rellenar la forma sería lo contrario de lo
  > que sostiene una tabla de precios.

**Sexta vuelta — el teaser y el cierre de `/fundacion`:**

- **Los 3 hitos vuelven a la derecha** del teaser (*«queda más equilibrado»*).
  La 5ª vuelta los había bajado al pie del texto siguiendo el slide 62, pero
  eso fue cuando los fundadores ocupaban la derecha; al mudarse los fundadores
  a su propia fila, esa columna quedó vacía y todo el peso se apilaba a la
  izquierda.
- **El cierre de `/fundacion` pasa a ser el mismo bloque de dos tarjetas** que
  remata `/ventaja-competitiva` (*«ese está mejor»*) — el mismo componente con
  props `id`/`anclaClase`, no una copia. `MembresiasFundacion` se retira.
- **El barrido horizontal de `/fundacion`** absorbe «Arrecifes artificiales»
  como primera card, pasa a **cards de 100vw** y sale del contenedor para que
  el recorte caiga en los cantos de la ventana. Se saca de la columna en vez
  de sangrarlo con `100vw` + margen negativo: ese truco mete la barra de
  scroll en la cuenta y deja la página con scroll horizontal en Windows
  (verificado: `scrollWidth − clientWidth = 0`). El **contenido** de la card
  no crece con ella — con `max-w-contenido` el título se iba a una sola línea
  de lado a lado y quedaba un desierto hasta la foto, que no puede ampliarse
  sin verse blanda (los originales miden 368px de ancho).

Los **7 chips** pasan a ser 7 anclas locales y quedan verificados uno a uno:
los 7 existen, aterrizan bajo la barra y activan su propio chip. `NavAnclasChips`
avisa por consola en desarrollo si alguno apunta al vacío — un ancla rota no
rompe nada (el scroll-spy la ignora sin rechistar) y por eso se colaba sin que
nadie lo notara.

**Sigue pendiente y no depende de nosotros:**
- Fijar **un solo nombre** para la entidad (hoy cuatro en sus materiales).
- **Confirmar los dos cofundadores** antes de publicar sus nombres completos.
- **Contrastar las 4 cifras** de la banda de impacto contra las memorias reales.
- **Fotos propias de la fundación** (pendiente desde la v1) — por eso ni la
  página ni el teaser llevan imagen.
- **Niveles y precios de las membresías**, y la pasarela de cobro.

**Decisión abierta para Samuel:** los chips son solo desktop (`md:`), igual que
la barra de la ficha. En móvil no se pintan.
