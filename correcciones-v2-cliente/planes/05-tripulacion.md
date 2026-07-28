# Plan de correcciones v2 — PÁGINA NUEVA: TRIPULACIÓN / EQUIPO

> Fuente: slides 36–43 del PDF (+ slide 23, tratado en el plan 02 §6).
> Cruzado con: `data/nosotros.ts` (`EQUIPO`, `MiembroEquipo`, `TRIPULACION`),
> `components/home/equipo-teaser.tsx`,
> `components/nosotros/tripulacion-abordo.tsx`, `pages/nosotros.tsx`, `App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR

El slide 36 dice **«nueva página de tripulacion»** y los slides 37–43 la traen
maquetada completa. El cliente ha hecho aquí el trabajo más detallado de todo el
PowerPoint: **6 departamentos, 37 personas con nombre, rol y frase.**

1. Página nueva con **hero + 4 KPIs + filtros por departamento** (§1).
2. **6 departamentos** con su descripción y su contador (§2).
3. **~37 personas** (dice «cerca de 70») con retrato, rol, frase y marca de
   «Responsable» (§3).
4. Cierre **«¿Quieres remar con nosotros?» → Ver vacantes** (§4).

> ✅ **DECISIÓN (Samuel, 2026-07-27): esta página SE CONSTRUYE**, no se pospone.
> Y se desarrolla **bajo el paraguas de 70 empleados** — el número exacto se
> afina después. Los huecos se rellenan con la escalera de contenido del índice:
> web original → assets repetidos → lorem ipsum.
>
> Eso resuelve la contradicción 37 vs 70 **a efectos de construcción**: la
> estructura se dimensiona para 70 (paginación, filtros, rendimiento del grid),
> y los contadores de los chips se calculan del array, no se escriben a mano —
> así el día que el número real sea otro, la página se ajusta sola.

**Sigue siendo la página más delicada de la tanda**, pero ya no por estar
bloqueada: por ser la única cuyo contenido son **personas identificables**.
Ver §3, donde la escalera de contenido tiene una excepción que sí importa.

---

## §1 — Slide 37: la estructura de la página

**Cliente:** su maqueta abre con hero oscuro:
- Eyebrow **«NUESTRO EQUIPO»**, H1 **«Las personas detrás de cada tour»**.
- Lead: *«Gerencia española afincada en Punta Cana desde 2012 y un gran equipo
  dominicano que vive el mar contigo — repartido en seis departamentos que hacen
  posible tu día perfecto.»*
- 4 KPIs: **`~37` personas en el equipo** · **`6 departamentos` de oficina al
  mar** · **`Desde 2012` creciendo juntos** · **`RD + España` equipo local y
  gerencia**.
- Fila de **7 chips de filtro**: `Todos 37` · `Operaciones Oficina 6` ·
  `Operaciones Playa 11` · `Marketing & Ventas 5` · `Equipo de Administración 4` ·
  `Equipo de Cocina 6` · `Fundación The Bávaro Reef 5`.
- Debajo, un bloque por departamento con su nombre, contador y descripción.

**Estado en el repo:** no existe. Lo que hay:
- `EQUIPO` (`data/nosotros.ts:126`): **5 entradas**, y dos de ellas no son
  personas sino roles genéricos («Capitán», «Bióloga marina»).
- `TRIPULACION` (`:204`): 4 roles con nota, sin nombres — Capitán, Bióloga
  marina, Chef a bordo, Guía de snorkel.
- `equipo-teaser.tsx` en la home pinta 3 de los 5.
- `tripulacion-abordo.tsx` en `/nosotros` pinta los 4 roles.

**Cómo lo aplicamos:** ruta `/equipo` (o `/tripulacion`, ver la duda de nombre
abajo), `pages/equipo.tsx` con `HeroInterna` como el resto de las internas +
`KPIs` + filtros + secciones por departamento.

Los **filtros** son un patrón que el proyecto ya resolvió dos veces:
`components/faq/categorias-faq.tsx` (correcciones v1: FAQ con filtros) y
`components/sostenibilidad/*`. Reutilizar ese lenguaje visual — chips con
contador, «Todos» primero — no inventar otro.

⚠️ **El lead de la maqueta lleva un dato nuevo**: *«Gerencia española afincada en
Punta Cana desde 2012»*. Eso no está en ninguna parte del repo. Es plausible
(el fundador es Omar y la fundación la crean Fernando Sánchez Fernández y Manuel
Alejandro Redondo, slide 62) pero **es una afirmación sobre la empresa que tiene
que confirmar el cliente**, no un dato que se copie de una maqueta.

**Duda de nombre de ruta:** el menú nuevo (slide 20) dice **«Tripulación»**, pero
la página incluye contabilidad, RRHH, marketing y la fundación — gente que no es
tripulación. La maqueta misma se titula «NUESTRO EQUIPO». Recomendación:
**ruta `/equipo`, etiqueta de menú «Tripulación»** si el cliente la quiere así,
o mejor convencerle de «Equipo». Es más honesto y es lo que su propio H1 dice.

**Archivos:** `pages/equipo.tsx` (nuevo), `App.tsx`, `data/nosotros.ts`,
`components/equipo/*` (nuevos), `data/home.ts` (nav + footer),
`components/seo/meta.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** medio (la estructura). **Riesgo:** bajo.

---

## §2 — Slides 37–42: los 6 departamentos

Del PDF salen los 6 con su descripción textual, que el cliente escribió:

| Departamento | Nº | Descripción (de la maqueta) |
|---|---|---|
| Operaciones Oficina | 6 | «Coordinan tu reserva y te responden cuando escribes.» |
| Operaciones Playa | 11 | «La tripulación que te recibe, guía y cuida en cada salida.» |
| Marketing & Ventas | 5 | «Te ayudan a encontrar y armar tu experiencia perfecta.» |
| Equipo de Administración | 4 | «Hacen que todo funcione detrás de cámaras.» |
| Equipo de Cocina | 6 | «El equipo de la cocina flotante, a bordo y en tierra.» |
| Fundación The Bávaro Reef | 5 | «Restauran el arrecife y cuidan el mar que navegamos.» |

Suman **37**, no 70. El cliente dice «son cerca de 70» en el slide 23 pero su
propia maqueta lista 37. **Hay que aclarar cuál es el número**: si son 70, faltan
33 personas por documentar y la página va a ser larguísima; si son 37, hay que
corregir la frase.

Estas 6 descripciones **sí se usan tal cual**: las escribió el cliente, son sobre
su propia empresa, y están bien escritas.

**Nota de arquitectura:** «Fundación The Bávaro Reef» como departamento choca un
poco con que la fundación sea *«una organización sin fines de lucro»* separada
(slide 62). Si es una entidad aparte, sus 5 personas no son empleados de
Hispaniola. Es un matiz legal que conviene no pisar: se puede pintar como
sección con un encabezado que aclare la relación («el equipo de la fundación que
respaldamos») en vez de como un departamento más de la plantilla.

---

## §3 — Slides 37–42: las 37 personas

**Cliente:** su maqueta trae, por persona: **rol** (en eyebrow), **retrato**
(rectángulo gris vacío), **frase en primera persona** y **nombre**. La primera
persona de cada departamento lleva un badge rojo **«Responsable»**. Omar lleva
además un enlace **«Nuestra historia»**.

Los 37 nombres, por departamento:
- **Oficina (6):** Eva (Atención al viajero, responsable), Carla (Coordinación de
  reservas), Daniel (Atención al cliente), Yamile (Atención al cliente), Rosa
  (Coordinación de reservas), Pedro (Soporte y recepción).
- **Playa (11):** Lola (Tour Leader Manager, responsable), Rafael (Capitán),
  Miguel (Capitán), José (Capitán), Ana (Guía de snorkel), Luis (Guía de
  snorkel), Carmen (Guía de snorkel), Wilson (Tripulación) — **la maqueta solo
  pinta 8 de los 11**.
- **Marketing & Ventas (5):** Marta (Gerente de ventas, responsable), Sergio
  (Ejecutivo de ventas), Paula (Ejecutiva de ventas), Andrés (Marketing), Lucía
  (Community & contenido).
- **Administración (4):** Omar (Fundador y director, responsable), Isabel
  (Administración), Ramón (Contabilidad), Teresa (Recursos humanos).
- **Cocina (6):** Antonio (Chef ejecutivo, responsable), Manuel (Chef a bordo),
  Sofía (Chef a bordo), Julio (Ayudante de cocina), Nuria (Ayudante de cocina),
  Héctor (Logística de alimentos).
- **Fundación (5):** Valentina (Bióloga marina · dirección, responsable), Marcos
  (Biólogo marino), Laura (Restauración de coral), Iván (Restauración de coral),
  Gabriela (Coordinación de proyectos).

### 📞 REUNIÓN 07-24 — el formato por persona, confirmado (28:02–28:17, 32:02–32:18)

Miguel describe la card sin que nadie se lo pregunte (28:02):

> *«Pepito Pérez, pues, el capitán, con 15 años de experiencia navegando en Punta
> Cana, bla bla bla — **una frase**.»*

Tres cosas que confirma:
1. **Nombre + rol + años de experiencia + una frase** es el formato querido. Los
   años de experiencia son un campo que la maqueta del PDF no traía y que hay que
   añadir a `MiembroEquipo`.
2. **La frase es intencional**, no un relleno de la IA. Eso no cambia el
   guardarraíl de abajo —siguen sin poder inventarse— pero sí confirma que
   **vale la pena que Fernando las recoja de verdad**, porque el cliente las
   quiere y la página las necesita.
3. **Los filtros** (32:02): *«cuántas personas son, departamentos, desde cuándo,
   filtrar»* → confirma los chips, y añade **«desde cuándo»** como criterio, o sea
   **antigüedad**. Otro campo (`desde: número de año`) que no estaba en la maqueta.

También confirma **las vacantes** (32:18): *«aquí poder ver las vacantes, poder
trabajar con ellos»* — ver §4, donde eso choca con lo que hoy ofrece
`/trabaja-con-nosotros`.

Y **confirma el número grande sin corregirlo**: Samuel dice *«ahí vamos a agregar
los 70 empleados»* (27:57) y Miguel no lo desmiente. Sigue en pie la
contradicción 37 (su maqueta) vs 70 (lo que dicen los dos) — **la reunión no la
resolvió**, solo la repitió.

**Cómo lo aplicamos:** `MiembroEquipo` se amplía con `departamento`,
`responsable?: boolean`, `frase?: string`, **`experiencia?: number`** y
**`desde?: number`** (los dos campos nuevos que salieron en la reunión).
`EQUIPO` pasa de 5 a N entradas.
Componente `components/equipo/card-persona.tsx` reutilizando el lenguaje de
`equipo-teaser.tsx` (que ya tiene retrato + rol + hover y un fallback con la
inicial cuando no hay foto, `equipo-teaser.tsx:98`).

Ese **fallback de la inicial es clave aquí**: permite publicar la página con
nombres y roles reales **antes** de tener los 37 retratos, sin que se vea roto.
Es la salida decente al bloqueo.

### ⚠️ Los tres avisos de esta sección

### 📌 Cómo aplica aquí la escalera de contenido del 07-27

La regla de Samuel (web original → assets repetidos → lorem ipsum) **resuelve
esta sección sola**, y en la dirección segura. Aplicada persona a persona:

| Dato | Fuente que le toca |
|---|---|
| **Retratos** | Assets repetidos: se rota entre las fotos de equipo que ya hay en el repo, o el fallback de la inicial que `equipo-teaser.tsx` ya tiene |
| **Nombres y roles** | Web original si están; si no, **placeholder evidente** (ver abajo) |
| **Frases en primera persona** | No están en la web original ni en ninguna parte → **lorem ipsum** |
| **Departamentos y sus descripciones** | ✅ Reales — las escribió el cliente |
| **Años de experiencia / antigüedad** | Lorem ipsum numérico (o campo vacío) hasta tener el dato |

**Que las frases caigan en lorem ipsum es la respuesta correcta, y sale de la
propia regla de Samuel** — no de una objeción de este plan. Es lo que evita el
único escenario de verdad peligroso: publicar *«Al timón, mi trabajo es que
disfrutes tranquilo»* firmado por «Rafael, Capitán» cuando Rafael no ha dicho eso
—ni existe necesariamente—. Un lorem ipsum nadie lo confunde; una frase
verosímil con nombre y cara sí, y se queda para siempre.

**Sobre los 37 nombres de la maqueta:** son de la IA del cliente, **no de la web
original**, así que por la escalera les toca placeholder. Dos formas de hacerlo
sin que parezcan reales:
- (a) Nombres genéricos evidentes: «Nombre Apellido», «Tripulante 04».
- (b) Los 37 de la maqueta **pero marcados en pantalla** mientras dure el
  placeholder (una cinta «contenido de ejemplo» sobre el grid).

**Recomiendo (a)** para presentar: se ve igual de completo, se entiende al
instante que es un molde, y no hay ningún camino por el que un nombre falso acabe
publicado como real. Si Samuel prefiere que la presentación se vea más «viva»,
(b) funciona **siempre que la cinta exista de verdad** y no dependa de acordarse.

---

**1. Los nombres son de personas reales; las frases probablemente no.** El
playbook `correcciones-cliente-visual` §2.3 dice que de una maqueta de IA se
toman los datos genuinos «(p. ej. nombres de empleados que el cliente escribió
él mismo)». Los nombres, sí. Pero las **frases en primera persona** («*Al timón,
mi trabajo es que disfrutes tranquilo*», «*El snorkel es más bonito cuando
alguien te lo enseña bien*») son testimonios puestos en boca de personas
concretas. Si las escribió una IA, **estamos publicando declaraciones que Rafael
y Carmen nunca hicieron, con su nombre debajo.** Están bien escritas y suenan
verosímiles, y eso es exactamente el problema.

Es el mismo guardarraíl que en la v1 dejó sin pintar los ratings inventados y
los contadores de urgencia, pero **más serio**, porque aquí hay personas
identificables. Propuesta: se pintan **nombre + rol** (dato verificable) y las
frases quedan **comentadas en el código**, listas para cuando cada persona diga
la suya de verdad. Recogerlas es un día de trabajo del cliente y la página gana
muchísimo — pero tienen que ser suyas.

**2. Retratos = consentimiento.** Publicar la foto de 37 empleados en una web
comercial necesita permiso de cada uno. No es una decisión de diseño; hay que
avisar al cliente por escrito. La página se puede lanzar con iniciales.

**3. Hay una incoherencia que se arrastra desde antes.** `EQUIPO` hoy contiene
«Capitán» y «Bióloga marina» como si fueran nombres. En la maqueta esos puestos
tienen nombre real (Rafael/Miguel/José, Valentina/Marcos). Al construir esta
página hay que limpiar `EQUIPO` — no dejar dos modelos conviviendo, uno con
nombres y otro con roles-como-nombre.

**Archivos:** `data/nosotros.ts`, `components/equipo/*`,
`components/home/equipo-teaser.tsx` (lee el mismo `EQUIPO`),
`components/nosotros/tripulacion-abordo.tsx` (se queda sin sentido si el equipo
real está en su página → probablemente se retira), `public/fotos/equipo/`.
**Esfuerzo:** bajo de código, **alto de contenido**.
**Riesgo:** **alto de contenido** — nombres reales, frases posiblemente
inventadas, fotos sin consentimiento documentado.
**Duda para Samuel:** ¿pintamos las frases de la maqueta o las dejamos
comentadas? (Mi recomendación clara: comentadas, y pedirle a Fernando que se las
recoja al equipo — es más trabajo para él pero es lo único publicable.)

---

## §4 — Slide 43: «¿Quieres remar con nosotros?»

**Cliente:** card de cierre centrada, con icono, título **«¿Quieres remar con
nosotros?»**, lead *«Siempre buscamos gente que ame el mar y el trato de verdad
con las personas. Si es lo tuyo, cuéntanos quién eres.»* y botón **«Ver
vacantes»**.

**Estado en el repo:** **ya existe la página de destino.**
`/trabaja-con-nosotros` se creó en las correcciones v1 (`App.tsx:52-55`), con
`cabecera-trabaja.tsx` + `formulario-trabaja.tsx` y perfiles vía `?perfil=`
(proveedor / creador de contenido / afiliado).

**Cómo lo aplicamos:** la card es un cierre de sección que enlaza a
`/trabaja-con-nosotros`. Trivial.

Un detalle: el botón dice **«Ver vacantes»**, y `/trabaja-con-nosotros` hoy no
lista vacantes — es un formulario abierto con 3 perfiles, ninguno de los cuales
es «empleado». Dos salidas: cambiar el texto del botón a algo que la página
cumpla («Cuéntanos quién eres», que además es la frase que él mismo escribió), o
añadir un 4º perfil «trabajar en el equipo». **Recomiendo lo primero**: un botón
«Ver vacantes» que no lleva a vacantes es la clase de promesa pequeña que este
proyecto ha evitado sistemáticamente.

**Archivos:** `components/equipo/cierre-equipo.tsx` (nuevo),
`components/trabaja/*` si se añade el perfil, `dev/dev-registry.ts`.
**Esfuerzo:** trivial. **Riesgo:** ninguno.
**Duda para Samuel:** ¿hay vacantes reales que listar, o cambiamos el texto?

---

## Resumen: qué se puede hacer ya

> Con la decisión del 07-27, **nada de esto bloquea**. La columna pasa a ser
> «con qué se construye ahora» y «qué hay que sustituir después».

| Trabajo | Se construye con | A sustituir |
|---|---|---|
| Página, hero, KPIs, filtros, 6 secciones | contenido real | — |
| Las 6 descripciones de departamento | ✅ reales, del cliente | — |
| Estructura dimensionada a **70 personas** | contadores derivados del array | el número real |
| Nombres + roles | placeholder evidente (§3) | plantilla real |
| Retratos | fotos repetidas / inicial | 70 retratos + consentimiento |
| Frases en primera persona | **lorem ipsum** | frases recogidas de verdad |
| Años de experiencia / antigüedad | vacío o lorem numérico | dato real |
| Cierre «remar con nosotros» | real, enlaza a `/trabaja-con-nosotros` | el texto del botón (§4) |
| Limpiar `EQUIPO` de roles-como-nombre | — | **hay que hacerlo igual** |

**Lo único que hay que no perder de vista:** cuando lleguen los 70 retratos hará
falta **consentimiento** de cada persona para publicar su foto en una web
comercial. No es una decisión de diseño y no se resuelve en código — conviene
avisar a Fernando por escrito ahora, mientras se construye, para que no sea una
sorpresa el día que toque sustituir los placeholders.
