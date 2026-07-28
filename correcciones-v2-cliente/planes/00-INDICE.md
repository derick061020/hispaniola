# Correcciones v2 del cliente — índice de planes

> Fuente 1: `correcciones-v2-cliente/Presentación  CAMBIOS  2.0.pdf` — **65 diapositivas**
> Leídas renderizando a PNG con PyMuPDF a 110 dpi (playbook `correcciones-cliente-visual` §1).
> Fuente 2: `correcciones-v2-cliente/meet-sobre-correcciones-v2.pdf` — **transcripción
> de la reunión Miguel ↔ Samuel del 2026-07-24** (43 min), donde Miguel va explicando
> el PowerPoint diapositiva por diapositiva. **Resuelve la mayoría de las dudas
> abiertas del plan original** — ver «Lo que aclaró la reunión» abajo.
> Cruzado con: el código real de `app/` en `master` (commit `3e3bd40`).
> Estado: **propuesta para revisar con Samuel. NADA EJECUTADO.**
>
> ⚠️ Las aclaraciones de la reunión van marcadas **📞 REUNIÓN 07-24** dentro de cada
> plan, para no confundir lo que dice el PowerPoint con lo que se habló de viva voz.
> La transcripción es automática y **tiene ruido** (palabras mal transcritas, frases
> cortadas): donde el sentido es claro se toma; donde no, se marca como duda.

## ⏰ La fecha límite cambia la prioridad de todo

De la reunión (38:29): **la web tiene que estar lista el 15 de agosto**, y el
**30 de agosto** es el tope para que el programador tenga **15 días de pruebas de
compra/pago**. Hoy es 2026-07-27 → **quedan 19 días**.

Eso hace inviable ejecutar los 8 planes completos. La recomendación de orden del
final de este índice deja de ser una sugerencia y pasa a ser un **recorte**: hay
que decidir con Samuel qué entra antes del 15 y qué se queda fuera. Las dos
páginas 100% bloqueadas por assets (Tripulación, Instalaciones) son las
candidatas obvias a quedar fuera.

Miguel también pidió (36:08) **avisar ya a Eric/Derick** para que empiece a mirar
la web y vea qué necesita para conectar el sistema, en paralelo — no al final.

## Qué es esta tanda y en qué se diferencia de la v1

La v1 (2026-07-20→22) fue una tanda **por páginas existentes**: 8 PDFs, uno por
página del sitio, con anotaciones sobre lo ya construido. Se ejecutó completa
(`correcciones-v1-cliente/EJECUTADO.md`).

La v2 es **otra bestia**: un solo PowerPoint de 65 slides donde el peso no está
en la home —solo 6 slides la tocan— sino en:

1. **La ficha de tour**, con una petición de fondo que cambia su modelo de
   negocio visual: hacer que el salto Light → Premium se **note** (paleta oscura
   tipo lujo, upsell explícito, Premium por defecto).
2. **Cinco páginas que NO existen**: Flota, Tripulación, Instalaciones,
   «Por qué reservar con nosotros» y la ampliación de Sostenibilidad como
   *ventajas competitivas*. Son ~35 de las 65 slides.
3. **Una reestructuración del menú principal** que reordena todo el sitio.

Es decir: **la v2 es más un encargo de construcción que una tanda de arreglos.**
Eso cambia cómo hay que presupuestarla y en qué orden ejecutarla — ver
«Lo que este plan NO decide» al final.

## Cómo se leyeron las anotaciones (taxonomía del playbook)

| Tipo | Qué es | Cuántas slides |
|---|---|---|
| **1. Flecha + texto** | El cliente dice explícitamente qué quiere | ~20 |
| **2. Página de referencia** | Link a la web actual con «falta esto» | 2 (slides 2, 50) |
| **3. Estructura generada con IA** | Maqueta hecha por él, se toma la ESTRUCTURA (y los datos reales), nunca la estética ni las métricas | ~35 |

⚠️ **Novedad respecto a la v1**: las maquetas de IA de esta tanda están hechas
**imitando nuestra propia dirección visual** (Poppins, navy/aqua/coral, cards
con hairline). Se reconocen porque los iconos y las fotos salen como
**rectángulos grises o degradados planos**. Eso las hace más útiles como
estructura, pero **sigue aplicando la regla de oro**: los degradados de relleno,
los tonos oro/negro inventados y las cifras que aparecen ahí no son diseño
aprobado ni datos verificados.

## Tabla de planes

| # | Plan | Slides | Peso del cambio |
|---|---|---|---|
| 01 | [Ficha de tour — Light/Premium y menús](01-ficha-tour.md) | 1–8, 10–13, 16–19 | **ALTO** — toca el widget de conversión |
| 02 | [Home y menú principal](02-home.md) | 3, 9, 20–23, 32–35 | MEDIO |
| 03 | [Eventos — reserva online](03-eventos.md) | 14, 15 | MEDIO |
| 04 | [Página nueva: Flota](04-flota.md) | 24–31 | **ALTO** — página nueva + 12 barcos |
| 05 | [Página nueva: Tripulación](05-tripulacion.md) | 36–43 | **ALTO** — página nueva + ~37 personas |
| 06 | [Página nueva: Instalaciones](06-instalaciones.md) | 44–49 | **ALTO** — página nueva + 360° |
| 07 | [Página nueva: Por qué reservar con nosotros](07-por-que-reservar.md) | 50–56 | MEDIO — amplía `/reserva-directa` |
| 08 | [Sostenibilidad como ventaja competitiva](08-sostenibilidad-ventajas.md) | 57–64 | MEDIO — amplía `/sostenibilidad` |

Slide 65 está en blanco. Slides 9 y 35 son capturas sin anotación clara — ver
las dudas en sus planes.

## 📞 Lo que aclaró la reunión del 2026-07-24

La transcripción cambia el plan más de lo que parece. Lo importante, ordenado por
impacto:

| # | Aclaración | Efecto |
|---|---|---|
| 1 | **`/nosotros` desaparece como página.** «No va a haber una página única de nosotros, sino estas tres cosas» (29:02) — se parte en Tripulación · Instalaciones · Flota | Cierra la duda abierta nº 4 de «lo que este plan NO decide». Cambia planes 02, 04, 05 |
| 2 | **Tarifas de niño completas**: 1–3 años **gratis**, 4–7 **US$ 65** (light) y **US$ 80** (premium, +15). Aplica a **snorkel, Saona y privado — el semi-privado NO admite niños** | Desbloquea plan 01 §5 y §6 casi por completo |
| 3 | **El menú de niños que falta está en la web actual del cliente** — «lo estoy viendo en su página actual y no lo veo [en la nuestra]» (10:44): una hamburguesa con acompañantes | Deja de estar bloqueado: se extrae de la web en vivo, no se pide |
| 4 | **La piel oscura premium es SOLO la columna derecha (el widget)**, no la ficha entera — «de toda la página, lo de la derecha… es demasiado» (25:06) | Recorta el alcance del plan 01 §14 |
| 5 | **El «129» tiene una función concreta**: al ir Premium por defecto ya no se puede decir «+15», así que el precio tachado lo sustituye (17:19) | Cambia el plan 01 §4 — pero sigue necesitando verificación |
| 6 | **Saona no tiene menú a elegir: la comida es buffet** (09:29) | No se le pone selector de menú |
| 7 | **El add-on de langosta son US$ 30 × TODAS las personas del barco** (08:14, confirmado) | Regla de cálculo real para el funnel |
| 8 | **Forever Teresa: 1–18 pax = US$ 1.600 · 19–25 = US$ 85/pax · 26–29 = US$ 2.225 + US$ 75/pax extra.** El motivo de los tramos son **normativas de tripulación mínima** (07:06) | Dato nuevo + un argumento de copy que no teníamos |
| 9 | **Los «paquetes privados para grupos» del charter llevan a Eventos**, no son un bloque de la ficha (12:24) | Resuelve la duda de ubicación del plan 01 §8 |
| 10 | **El video sticky va abajo a la izquierda y se expande al clic**; la derecha se reserva al widget. El contenido **no se estrecha** — el video ocupa el blanco sobrante (22:04–23:10) | Resuelve la duda del plan 01 §11 |
| 11 | **El video es de «la persona responsable explicando el tour»** (20:51), no un reel de ambiente | Asset nuevo que hay que grabar |
| 12 | **Mini galería de fotos de comida en TODOS los servicios**, a ancho completo y de 4 a 3 columnas (19:27, 24:29) | Resuelve la duda (a)/(b) del plan 01 §10 |
| 13 | **Las FAQ de cada servicio se mueven a la página de ese servicio** (27:33) | **Corrección nueva**, no estaba en ningún plan → plan 02 §8 |
| 14 | **Los eventos sí se reservan online**, con el tarifario de paquetes (US$ 1.188 / 1–12 pax, +US$ 99 por persona extra) (13:05) | Confirma el nivel 2 del plan 03 §1 |
| 15 | **Los 360° de la flota los llama «vídeo 360»** (29:48) | Pista fuerte sobre el formato — ver plan 04 §3 |
| 16 | **La página «por qué reservar» debe empujar a Tours con muchos botones** y no retener («no es para que la gente se vaya mucho ahí», 33:30) | Cambia el enfoque del plan 07 |

**Lo que la reunión NO aclaró** (sigue pendiente de Fernando): si son 37 o 70
empleados, las fotos y frases del equipo, las fotos de instalaciones, los 6 barcos
que faltan, las cifras contradictorias de clientes/días, y si el 129 fue un precio
de lista real.

## Los 3 choques de fondo (leer antes que cualquier plan)

### 1. «Premium por defecto» va contra un guardarraíl documentado

Slide 4: *«poner aquí por defecto el premium»*.

`components/tour/widget-reserva.tsx:20-24` dice literalmente que el precio
**abre siempre en Light** y que Premium es *opt-in explícito*, y lo justifica
como **anti bait-and-switch** — fue una de las 7 correcciones P1 de la revisión
crítica de conversión de los wireframes (`analisis/revision-wireframes.md`).

Abrir en Premium significa que el visitante ve US$ 114 donde la card del grid,
el ticker del hero y el SEO dicen «desde US$ 99». Es exactamente el patrón que
esa revisión eliminó.

Había una salida que daba al cliente lo que pedía sin romper el guardarraíl
(mantener Light como ancla, Premium dominando solo la vista) — pero Samuel
decidió el 2026-07-27 ir por lo literal: el cliente insistió explícitamente en
que Premium vaya por defecto, así que el guardarraíl se levanta a propósito.
Ver la decisión revertida en plan 01 §1.

### 2. Cinco páginas nuevas necesitan datos y assets que no tenemos

> 🔁 **Desactivado como bloqueo (07-27).** Esta tabla sigue siendo el inventario
> correcto de lo que falta, pero **ya no impide construir**: los huecos se
> rellenan con la escalera de contenido de arriba. Léela como «lista de lo que
> hay que sustituir después», no como «lo que hay que esperar».

| Página | Lo que el cliente promete | Lo que existe en el repo |
|---|---|---|
| Flota | **12 embarcaciones**, cada una con galería + **360°** + ficha técnica | `FLOTA` en `data/nosotros.ts`: **6 barcos**, 1 foto cada uno, sin 360° |
| Tripulación | **~70 empleados** (su maqueta pinta 37) en 6 departamentos, con retrato y frase | `EQUIPO`: **5 personas**, `TRIPULACION`: 4 roles genéricos sin nombre |
| Instalaciones | 6 zonas, cada una con **video vertical + 360° + foto** | Ninguna foto de instalaciones en tierra |

Sin esos assets las páginas se **construyen igual**, con huecos marcados. La
regla que se sostuvo toda la v1 se afina, no se deroga: **placeholder evidente
sí, dato falso verosímil no.** Ni un nombre de empleado inventado que parezca
real, ni una eslora plausible, ni un botón de 360° que abra una foto normal.
Lorem ipsum y fotos repetidas, en cambio, se ven a la legua — que es justo lo que
los hace seguros.

### 3. Había una colisión de rutas — ya resuelta

El menú nuevo (slide 20) pide **«Fundación»** bajo Sostenibilidad. Pero
`/fundaciones` **ya está ocupada**: es la página interna de tokens del proyecto
(`pages/fundaciones.tsx`, sin Header ni Footer, la que documenta la paleta para
el traspaso a Figma).

> ✅ **DECIDIDO (Samuel, 2026-07-26): la fundación va en `/fundacion`**
> (singular); la de tokens se queda en `/fundaciones`. Como se diferencian en una
> letra, el commit que las cree tiene que dejar avisos cruzados en `App.tsx`, en
> las dos páginas, en `dev-registry.ts` y en `CLAUDE.md` — ver plan 02 §1.

## Decisiones ya tomadas

| Tema | Decisión | Dónde |
|---|---|---|
| «Premium por defecto» del slide 4 | ~~Opción B~~ → **Opción A** (07-27): literal, widget abre en Premium; ancla se queda en US$ 99 en el resto del sitio | plan 01 §1 |
| Ruta de la fundación | **`/fundacion`** singular, con avisos cruzados | plan 02 §1, plan 08 §3 |
| **Alcance** | **(07-27) Se construyen las 8 páginas**, con la escalera de contenido de arriba. Nada se pospone | este índice |
| **Depósito de eventos** | **(07-27) 25%**, el mismo que los tours | plan 03 §1 |
| **Nº de empleados** | **(07-27) Se desarrolla bajo el paraguas de 70.** El número exacto se afina después | plan 05 |
| **Tarifario** | **(07-27) La lógica tiene que FUNCIONAR**, no solo estar anotada: al cruzar un tramo, el precio cambia para las plazas nuevas | plan 01 §7-bis |
| Rama de ejecución | **`staging`** — `master` se queda intacta como punto de retorno | — |

## Lo que este plan NO decide

- **Orden y prioridad.** Los 8 planes no están ordenados por importancia. Con 5
  páginas nuevas de por medio, esto son varias sesiones; hay que elegir por
  dónde. Recomendación en la última sección de este índice.
- **Si «Premium por defecto» se hace literal o con la alternativa del plan 01.**
- **Si las páginas nuevas se entregan con huecos** (placeholder honesto,
  marcado, listo para rellenar) o **se posponen hasta tener los assets.** Se
  puede hacer distinto por página: Flota tiene 6 de 12 barcos reales (se puede
  lanzar a medias), Instalaciones tiene 0 fotos (no). **Con la fecha del 15 de
  agosto encima, esta decisión es ahora la más urgente de las tres.**
- ~~**Qué pasa con `/nosotros`.**~~ → 📞 **RESUELTO en la reunión (29:02):** la
  página `/nosotros` **desaparece**. Su contenido se parte en las tres páginas
  nuevas. Queda un residuo por decidir (plan 02 §7): **dónde vive «Nuestra
  historia»** (el timeline 2012→hoy con la cita de Omar), que hoy es una sección
  de `/nosotros` y que la reunión no asignó a ninguna de las tres.
- ~~**Los 3 paquetes de comida del slide 13.**~~ → 📞 **RESUELTO (12:24):** el
  botón «paquetes privados para grupos» de la ficha de charter **enlaza a la
  pestaña de Eventos y celebraciones**. Los paquetes viven en **Eventos**; la
  ficha de charter solo enlaza. Ver plan 01 §8 y plan 03 §1.
- **La colisión `/fundaciones`.**

## Pedir al cliente (consolidado)

> 📞 La reunión del 07-24 **contestó cuatro de estas** (menú de niños, tarifas de
> niño, tramos del Forever Teresa, ubicación de los paquetes de comida). Las que
> quedan están abajo, con las nuevas que la propia reunión abrió.

1. **Fotos de los 12 barcos** + ficha técnica de los 6 que faltan (eslora,
   capacidad, año, tipo). Los 6 actuales están en `data/nosotros.ts`.
2. **Los 360°**: en la reunión Miguel los llama **«vídeo 360»** (29:48), lo que
   sugiere video y no foto equirectangular — pero sigue sin confirmarse si
   **existen ya** o hay que grabarlos. Aparecen en Flota **y** en Instalaciones,
   12+ veces. Es el asset que más se repite en toda la tanda.
3. **Plantilla de empleados real**: nombre, rol, departamento y foto de las ~70
   personas. Su maqueta lista 37 nombres — hay que confirmar cuáles son reales
   y conseguir los retratos. **Sin foto ni consentimiento no se publica nadie.**
4. **Fotos de las instalaciones en tierra**: zona de recibimiento, museo marino,
   laboratorio de biología, cocinas, tienda, oficinas.
5. **Los 5 videos verticales fijos** de la home (slide 21) y los verticales de
   Instalaciones. Hoy `REELS` tiene `video: null` en los 5.
6. **Fotos nuevas de los platos**, en alta, «como hicimos en dinner» (slide 4).
   Es la petición que desbloquea el corazón del plan 01.
7. **El «precio anterior era de 129»** (slide 5): ¿129 es un precio de lista
   real y verificable? Un precio tachado que no existió es publicidad engañosa,
   y en este proyecto ya hay precedente de la web del cliente contradiciéndose
   a sí misma (ver Aprendizajes de `hispaniola.md`).
   📞 **La reunión explicó para qué lo quiere** (17:19): con Premium por defecto
   ya no cabe decir «+US$ 15», así que el tachado ocupa ese papel — *«jugando con
   ese sesgo de que por 15 dólares más tiene premium»* (17:40). Es decir: sabe que
   es una palanca psicológica. **Eso hace la pregunta más necesaria, no menos** —
   un tachado inventado es exactamente el tipo de dato que la v1 dejó sin pintar.
8. **Contrastar las 4 cifras de impacto** de `/sostenibilidad` (12.000+ corales,
   350 tortugas, 5.000 m², 200+ niños) contra las memorias reales de la
   fundación. Ya estaban marcadas como pendientes en el código; la página va a
   crecer alrededor de ellas (plan 08).
   *(Los US$ 3,50 / US$ 2,00 por huésped del slide 61 **no** hay que pedirlos:
   son dato real del cliente, ya portados de `sustainability.php`.)*
9. **Los dos cofundadores de la fundación** (slide 62): confirmar «Fernando
   Sánchez Fernández» y «Manuel Alejandro Redondo», y **qué nombre se usa**
   para la entidad — hoy conviven cuatro («Fundación Ecológica Arrecifes de
   Bávaro», «Bávaro Reefs Foundation», «Fundación The Bávaro Reef», «Fundación»).
10. **Zanjar las cifras de empresa**: la maqueta del slide 52 dice **302.997
    clientes / 4.466 días**; el repo dice **91.607 / 4.454**. La web del cliente
    ya se contradecía a sí misma en esto desde la auditoría del 2026-07-13.
    Bloquea el plan 07.

### Nuevas, que abrió la propia reunión

11. **El tramo 9–20 del charter privado normal.** La transcripción está rota justo
    ahí (05:33–06:18): se entiende «4 horas, 1–8 personas un precio; de 9 a 20,
    adicional de 100 dólares… y sale 599». No cuadra con la tabla actual del repo.
    **Hay que pedir el tarifario del charter escrito**, no reconstruirlo de una
    transcripción automática. Bloquea el plan 01 §7.
12. **El depósito de los eventos**: lo preguntó Miguel, no nosotros (13:37 —
    *«¿cuál es el importe que le vamos a pedir en cada uno de los pasos?»*).
    Samuel contestó que de momento se guía por los menús. Queda abierto y hay que
    devolvérselo resuelto. Plan 03 §1.
13. **El video del responsable explicando el tour** (20:51): ¿existe, o hay que
    grabarlo? Es el asset del plan 01 §11 y sin él la corrección no se ve.
14. **Confirmar el tope de edad de niño.** En la reunión Miguel no lo recordaba y
    Samuel propuso «¿será 7?» → *«pues sí»* (01:32). Eso es una suposición
    aceptada por cortesía, no un dato. **Hay que confirmarlo por escrito**, junto
    con si el tramo 1–3 gratis aplica a los tres tours o solo a alguno.
15. **La carta infantil completa**: la reunión dice que está en la web actual
    («una hamburguesa con otras cosas»). Se extrae de ahí — pero conviene que
    Fernando confirme que **esa sigue siendo la carta vigente**, porque este
    proyecto ya tiene precedente de la web del cliente estando desactualizada
    (el «desde $55» del charter que en realidad eran $75).

## Un hallazgo que cambia el tamaño de la tanda

De las 5 «páginas nuevas», **dos ya existen**:

- **«Por qué reservar con nosotros»** (slides 50–56) es `/reserva-directa`, que
  ya tiene incluso el `<title>` «¿Por qué reservar directo?» — pero está casi
  vacía (30 líneas). No hay que crearla, hay que llenarla.
- **«Ventajas competitivas»** (slides 57–64) es `/sostenibilidad`, y de sus 8
  slides **el 70% ya está construido**: los 7 videos existen en el mismo orden,
  los 3 pilares, los US$ 3,50/2,00 por huésped, el texto de cierre. Su maqueta
  de IA probablemente partió de nuestra propia página.

Así que las páginas realmente nuevas son **tres** (Flota, Tripulación,
Instalaciones), y de esas, **Flota es la que menos cuesta** porque su grid de
6 barcos ya está hecho y solo hay que mudarlo de `/nosotros` a su propia ruta.

Dicho de otro modo: **la v2 parece más grande de lo que es.** Lo que de verdad
cuesta no es el código — son los assets (fotos de 6 barcos, 37 retratos, 18
piezas de media de instalaciones, 5 videos de la home, fotos nuevas de platos) y
las **10 respuestas del cliente** de la lista de arriba.

## ✅ DECISIÓN DE ALCANCE (Samuel, 2026-07-27): se construye TODO

**Se desarrollan las 8 páginas, incluidas Tripulación e Instalaciones.** Nada
queda fuera de la entrega — todo tiene que poder presentarse. Esto **deroga** el
recorte que este índice proponía antes (dejar fuera los planes 05 y 06 por estar
bloqueados por assets).

El razonamiento de Samuel: el objetivo del 15 de agosto es **presentar el sitio
completo**; afinar el contenido real es trabajo de los días siguientes, no un
prerrequisito para construir. Un molde vacío que se puede enseñar y rellenar vale
más que una página que no existe.

### La escalera de contenido (en este orden, siempre)

Ante cualquier hueco de contenido o de assets:

| # | Fuente | Cuándo |
|---|---|---|
| 1 | **La web original del cliente, en vivo** | Siempre que el dato exista ahí. Es la fuente de verdad — incluidos precios, tramos y menús |
| 2 | **Assets repetidos como placeholder** | Fotos y videos que no tenemos: se reutiliza material existente del repo |
| 3 | **Lorem ipsum** | Solo si no hay nada ni en el repo ni en la web original |

⚠️ **La regla que sigue en pie, y que esta decisión NO deroga:** no se inventa
contenido que *parezca real*. Lorem ipsum es seguro precisamente porque nadie lo
confunde con contenido definitivo; una foto repetida se detecta a simple vista.
Lo que sigue prohibido es lo del medio: **datos verosímiles pero falsos** — un
nombre de empleado con su frase en primera persona, una eslora plausible, un
rating inventado. Eso no es placeholder, es contenido falso que nadie va a
detectar a tiempo. Ver el caso concreto en el plan 05 §3.

**Convención de marcado:** todo placeholder se marca en el código con un
comentario `// [placeholder-v2]` + qué falta + de dónde vendrá el dato real. Eso
permite un grep único antes de publicar y evita que algo se cuele por olvido.

### Consecuencia para «pedir al cliente»

La lista de 15 peticiones **deja de ser bloqueante**. Sigue siendo la lista de lo
que hay que conseguir para rematar, pero **ninguna detiene la construcción**. Se
manda igual, en paralelo, para que el contenido real vaya llegando mientras se
desarrolla.

## Recomendación de orden (para discutir)

1. **Plan 02 (menú + home)** primero. Es el andamio: define las rutas que las
   páginas nuevas van a ocupar, y resuelve la colisión `/fundaciones`. Barato y
   desbloquea todo lo demás.
2. **Plan 01 (ficha de tour)**. Es donde está el dinero y donde el cliente ha
   insistido más («Fernando me insistió»). No depende de assets nuevos salvo
   las fotos de platos, y se puede hacer con las actuales.
3. **Plan 07 y 08** (por qué reservar + sostenibilidad). Amplían páginas que ya
   existen con contenido que ya tenemos casi todo. Buen ratio esfuerzo/entrega.
4. **Plan 04 (Flota)**. 6 de 12 barcos son reales — se puede entregar la página
   completa y añadir los 6 restantes cuando lleguen.
5. **Plan 03 (Eventos)**. Pequeño pero toca el widget de cotización.
6. **Planes 05 y 06** (Tripulación, Instalaciones) al final: son las dos que
   están **100% bloqueadas por assets**. Construirlas antes de tener las fotos
   es construir un molde vacío.
