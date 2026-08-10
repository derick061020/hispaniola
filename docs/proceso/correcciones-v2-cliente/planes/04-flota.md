# Plan de correcciones v2 — PÁGINA NUEVA: FLOTA

> Fuente: slides 24–31 del PDF.
> Cruzado con: `data/nosotros.ts` (`FLOTA`, `BarcoFlota`),
> `components/nosotros/flota-grid.tsx`, `components/nosotros/barco-card.tsx`,
> `components/nosotros/arrecife-teaser.tsx`, `pages/nosotros.tsx`, `App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR

El slide 24 dice solo **«nueva página de flota»**. Los slides 25–27 son capturas
de la `/nosotros` actual (contexto de dónde sale el contenido), y los slides
28–31 traen lo concreto:

1. **La flota sale de `/nosotros` y pasa a página propia** (§1).
2. **De 6 a 12 embarcaciones** — *«Ahí pondremos 12 embarcaciones en total»* (§2).
3. **Cada barco gana una «tarjeta de barco (plantilla)»** con galería, 360°,
   specs y ficha técnica completa (§3).
4. **Un banner enfocado a «0 plástico»** dentro de la página (§4).

Lo bueno: **el 70% del trabajo de componentes ya está hecho.** Lo caro: los
assets de 6 barcos nuevos y los 360°.

---

## §1 — Slides 24, 28: la flota, página propia

**Cliente:** *«nueva pagina de flota»* + *«Esto va en la nueva pagina de flota»*
(flecha al grid de 6 barcos que hoy vive en `/nosotros`).

**Estado en el repo:** la flota es una **sección** de `/nosotros`:
`FlotaGrid` (`components/nosotros/flota-grid.tsx`) pinta `FLOTA` con
`BarcoCard` — 6 cards con foto, chip, descripción, fila de meta
(eslora · capacidad · año), 2 chips de «ideal para» y CTA («Ver tours con este
barco» o «Cotizar para tu evento»). Es exactamente lo que el cliente fotografía
en los slides 29 y 31.

**Cómo lo aplicamos:** ruta `/flota`, página nueva `pages/flota.tsx` con el hero
compartido (`HeroInterna`, el mismo patrón que todas las internas desde
`PLAN-INTERNAS-V2.md`) + `FlotaGrid` reutilizado **tal cual**, sin duplicar.

`FlotaGrid` no sabe nada de `/nosotros` — solo consume `FLOTA`. Se puede montar
en la página nueva sin tocarlo.

### 📞 REUNIÓN 07-24 — la duda del teaser se cae: no hay `/nosotros` (28:56–29:18)

Este plan preguntaba si la flota se queda como teaser en `/nosotros`. **La
pregunta ya no aplica**: en la reunión Miguel confirmó que `/nosotros`
**desaparece** y se parte en Tripulación · Instalaciones · Flota (ver plan 02 §1).
Samuel lo dice y Miguel lo ratifica: *«no va a haber una página única de nosotros,
sino estas tres cosas»*.

Así que la flota **se muda entera** a `/flota`. No hay teaser porque no hay
página de origen. `FlotaGrid` se monta tal cual en la ruta nueva.

**Lo que sí hay que decidir es el residuo:** `/nosotros` tiene además hero,
intro («Bienvenido a la familia Hispaniola»), KPIs y **la sección de historia con
timeline**. La reunión, hablando de esta página, menciona *«la foto de él, una
frase que va a hacer él, y esto 2022»* (28:46) — lo que sugiere que **parte de la
historia se va con la flota**. Pero no es concluyente. Ver plan 02 §1, donde
queda planteado como decisión de Samuel.

⚠️ **Y el redirect:** si `/nosotros` deja de existir, hace falta redirigirla, no
devolver 404. Es una URL indexada.

**Archivos:** `pages/flota.tsx` (nuevo), `App.tsx`,
`components/nosotros/flota-grid.tsx`, `pages/nosotros.tsx`,
`components/seo/meta.tsx`, `data/home.ts` (nav + footer), `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.

---

## §2 — Slide 28: de 6 a 12 embarcaciones

**Cliente:** *«Ahí pondremos 12 embarcaciones en total»*.

**Estado en el repo:** `FLOTA` tiene **6**: Santa María, Forever Teresa, Maite,
GrandMa, Joker, Karaya. Vienen de `about-hispaniola.php` de la web real, con
specs **verbatim** — y con los huecos honestos marcados: `anio: null` en GrandMa,
Joker y Karaya, `eslora: null` y `capacidad: null` en Joker, con este comentario
en el código:

> *La fuente no fecha el GrandMa (ni el Joker ni el Karaya): sin año, no se pinta
> la casilla. **Nada de rellenar un hueco con un año plausible.***

Ese es el estándar que hay que mantener con los 6 nuevos.

**Cómo lo aplicamos:** son 6 entradas más en `FLOTA`. El tipo `BarcoFlota` ya
tiene todo lo necesario y ya tolera nulos, así que **el código no cambia** —
solo los datos.

**Bloqueado por el cliente, y es un bloqueo grande.** Por cada barco nuevo hacen
falta: nombre, tipo, eslora, año, capacidad, descripción corta, **foto** y para
qué es ideal. La foto es lo crítico: las 6 actuales son `flota-*.webp` extraídas
de la web real; los 6 nuevos no están en ninguna parte.

Además hay una cifra que se cae en cascada: **«Flota de 6 catamaranes»** aparece
como KPI en `/nosotros` (slide 26 del propio PDF lo fotografía: *«Flota de 6 ·
catamaranes propios»*) y **«De un barco a una flota de seis»** es el titular de
la sección de historia (`nuestra-historia.tsx`, slide 27). Al pasar a 12 hay que
actualizar los dos — y el titular de la historia hay que reescribirlo, no solo
cambiarle el número.

⚠️ Y hay que preguntarle una cosa incómoda: **¿son 12 embarcaciones propias o
incluye barcos de terceros?** El sitio dice «catamaranes propios» y «Somos el
propietario, no un intermediario» (slide 52) — si de las 12 algunas son
subcontratadas, ese argumento se debilita justo en la página nueva de «por qué
reservar directo» (plan 07). Vale la pena aclararlo antes de publicar 12.

> ✅ **DECISIÓN (2026-07-27): se pintan los 12**, no 6. Los 6 que faltan se
> construyen con la escalera de contenido:
> - **Specs (eslora, capacidad, año, tipo)**: se extraen de la **web original**,
>   que lista la flota. Es la fuente de verdad y hay que agotarla antes de nada.
> - **Fotos**: **repetidas** de los 6 barcos que sí tenemos, rotando.
> - **Lo que no esté en ninguna parte**: lorem ipsum en la descripción, y `null`
>   en los campos numéricos —que el tipo `BarcoFlota` ya tolera y que hacen que
>   la casilla simplemente no se pinte.
>
> ⚠️ **Excepción que se mantiene:** una eslora o un año inventados **no** son
> lorem ipsum — son datos falsos verosímiles, y `data/nosotros.ts` ya tiene el
> comentario que lo prohíbe (*«nada de rellenar un hueco con un año plausible»*).
> Si el dato no está en la web original, el campo va vacío. Un barco con 2 specs
> se ve bien; un barco con una eslora inventada es un problema que nadie detecta.

Y sigue en pie la pregunta incómoda de arriba (**¿12 propias o incluye
terceros?**), que ahora importa más, no menos: si se van a pintar 12 barcos, el
argumento «catamaranes propios / somos el propietario» del plan 07 se apoya en
ellos. **No bloquea la construcción**, pero hay que preguntarlo antes de
publicar.

**Archivos:** `data/nosotros.ts`, `public/fotos/`,
`components/nosotros/nuestra-historia.tsx`, KPIs (hoy dicen «flota de 6»).
**Esfuerzo:** trivial de código, medio de extracción (la web original).
**Riesgo:** bajo técnicamente; **medio de mensaje** (propias vs. terceros).

---

## §3 — Slide 28: la «tarjeta de barco (plantilla)»

**Cliente:** a la derecha del slide dibuja una maqueta titulada **«LA FLOTA —
Tarjeta de barco (plantilla)»**, con el subtítulo *«Una mini-ficha por
embarcación: galería, 360º, specs y ficha técnica»*. La maqueta tiene:
- Foto grande con chip «Tours compartidos» y botón **«Ver en 360º»**.
- Contador «1 / 4» y etiqueta «Exterior».
- **Tira de 5 miniaturas**, la última con el icono **360º**.
- Nombre + descripción.
- 3 chips de specs (`41 pies` · `Hasta 20` · `2013`).
- 2 chips de «ideal para».
- Botón **«Ver ficha técnica completa»**.
- CTA **«Ver tours con este barco»**.

**Estado en el repo:** `BarcoCard` ya tiene foto + chip + descripción + specs +
chips de ideal-para + CTA. Le faltan exactamente 3 cosas: **galería
multi-foto**, **360°** y **ficha técnica completa**.

**Cómo lo aplicamos:**
- **Galería:** ya existe `components/ui/carrusel-imagenes.tsx`, y
  `components/tour/galeria-lightbox.tsx` para el visor. No hay que inventar nada:
  `BarcoFlota.foto: string` pasa a `fotos: string[]` y la card monta el carrusel.
  Las etiquetas por foto («Exterior») son un campo más.
- **Ficha técnica completa:** un panel desplegable con los campos que ya
  existen + los que falten. El acordeón de AlignUI ya está en el proyecto y
  **las internas sí pueden usar AlignUI** (`CLAUDE.md`) — usar ese, no dibujar
  un desplegable nuevo.
- **360°: esto es lo que no tenemos ni sabemos si existe.** Puede ser un tour
  Matterport (iframe), una foto equirectangular (necesita un visor tipo
  Pannellum/Photo Sphere — sería la **primera dependencia externa de runtime del
  proyecto**, que hoy no tiene ninguna librería de UI salvo el copy-in de
  AlignUI), o simplemente un video de recorrido. **Cada una de las tres se
  implementa distinto.** No se puede planificar sin saberlo.

  Mientras no se sepa: el botón «Ver en 360º» y la miniatura con el icono **no
  se pintan** si el barco no tiene `tour360`. Campo opcional, ausencia silenciosa
  — no un botón que no hace nada.

### 📞 REUNIÓN 07-24 — pista fuerte sobre el formato del 360° (29:41–30:20)

Miguel describe la estructura por barco (29:48): *«de cada uno, pero en un
**vídeo 360**»*. Samuel lo confirma en voz alta: *«un vídeo 360 y luego una
galería de fotos abajo, y una ficha técnica»* — Miguel añade que la ficha es
*«un [spec] de la embarcación»* (30:06).

**La palabra es «vídeo», no «tour virtual» ni «Matterport».** Eso apunta a un
**archivo de video**, no a una foto equirectangular con visor — lo que sería la
mejor noticia posible: un video 360 se puede servir como un `<video>` normal (si
es un recorrido grabado) sin añadir **ninguna dependencia externa de runtime**,
que era el riesgo que este § señalaba.

**No es concluyente**, porque «vídeo 360» también puede significar un mp4
equirectangular, que **sí** necesita visor. Pero acota la pregunta: en vez de
«¿en qué formato están?», ahora es **«¿es un recorrido grabado o un equirectangular
que hay que poder arrastrar?»** — mucho más fácil de contestar para el cliente, y
la respuesta decide si hay dependencia nueva o no.

Sigue sin saberse **si ya existen o hay que grabarlos**. Con 12 barcos + 6 zonas
de instalaciones, son 18 piezas: si hay que producirlas, no llegan al 15 de agosto.

**Archivos:** `components/nosotros/barco-card.tsx`, `data/nosotros.ts`,
`components/ui/carrusel-imagenes.tsx`, `components/alignui/accordion`,
`dev/dev-registry.ts` (una entrada por estado: card cerrada, galería abierta,
ficha técnica desplegada, 360° abierto).
**Esfuerzo:** medio (galería + ficha) · **desconocido** (360°).
**Riesgo:** el 360° puede meter una dependencia externa. **Preguntar antes** —
con la pregunta ya afinada arriba.

---

## §4 — Slide 30: banner «0 plástico»

**Cliente:** flecha al banner **«El arrecife que reconstruimos»** (fondo de mar,
texto sobre la restauración de coral en Cabeza de Toro y la Bávaro Reefs
Foundation, CTA «Ver toda la historia en Sostenibilidad») con la nota:
*«banner enfocado a 0 plastico»*.

**Estado en el repo:** ese banner es `components/nosotros/arrecife-teaser.tsx`,
44 líneas, y habla de **coral**. El «0 plástico» vive en otro sitio: es el
cintillo `EcoFriendly` de la home (`components/home/eco-friendly.tsx`, con reveal
y sello dibujado — hecho en la 2ª vuelta de la v1) y una de las 4 stats del hero
(`STATS`: «0 · plástico a bordo»).

**Qué está pidiendo — dos lecturas:**
- (a) **Cambiar** el mensaje de este banner de coral a 0 plástico.
- (b) **Añadir** un segundo banner de 0 plástico en la página de flota.

Mi lectura es **(b), y con sentido**: en una página que enseña 12 barcos, «cero
plástico a bordo» es un argumento **sobre los barcos**, mientras que la
restauración de coral es sobre el destino. Son dos mensajes distintos y los dos
caben. Cambiar el de coral por el de plástico perdería el enlace a Sostenibilidad,
que es tráfico interno útil.

**Cómo lo aplicamos:** reutilizar `EcoFriendly` (el cintillo con el sello ya
dibujado) en `/flota`, en variante de banner en vez de franja de sección — mismo
criterio con el que `ReelsSociales` tiene variante `"bloque"` para la ficha. Cero
componentes nuevos, cero assets nuevos.

**Bloqueado por contenido:** «0 plástico» hoy es una cifra sin desarrollar. Si en
esta página va a ser un banner con peso, conviene tener **una frase concreta**:
qué se sustituyó (¿botellas de cristal? ¿vasos reutilizables? ¿pajitas?). Sin eso
es un eslogan. El cliente lo puede contestar en una línea.

**Archivos:** `components/home/eco-friendly.tsx` (añadir variante),
`pages/flota.tsx`, `data/home.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** ninguno.
**Duda para Samuel:** ¿(a) o (b)? Y ¿qué dice exactamente el banner?

---

## Slides 25, 26, 27, 29, 31 — capturas de contexto

- **25, 26:** el hero y la intro de `/nosotros` («La tripulación y la flota
  detrás de cada tour», «Bienvenido a la familia Hispaniola»). Sin anotación.
  Contexto de de dónde sale el contenido que se reparte.
- **27:** la historia con timeline (2012 → hoy) y la cita de Omar. Sin anotación.
  **Ojo:** su último hito dice «Hoy — Flota de 6 catamaranes» → hay que
  actualizarlo con §2.
- **29, 31:** el grid de 6 barcos, una vez completo y una vez las 3 primeras
  cards. Sin anotación propia — son el «esto» del slide 28.

**Nada que hacer en estas 5 salvo lo que arrastra §2.**

---

## Resumen: qué se puede hacer ya

| Trabajo | ¿Bloqueado? |
|---|---|
| Crear `/flota` con el grid actual de 6 barcos | **no — se puede hoy** |
| Dejar teaser en `/nosotros` + enlace | **no** |
| Banner 0 plástico | casi (falta la frase concreta) |
| Galería multi-foto por barco | sí — faltan fotos adicionales |
| Ficha técnica desplegable | parcial — con los datos actuales sale a medias |
| Los 6 barcos nuevos | **sí — fotos y specs** |
| 360° | **sí — no sabemos ni si existen** |

Es decir: **se puede entregar `/flota` funcionando esta semana** con lo que hay,
y crecerla en cuanto lleguen los assets. Eso es mejor que esperar.
