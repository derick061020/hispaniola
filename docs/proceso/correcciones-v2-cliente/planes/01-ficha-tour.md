# Plan de correcciones v2 — FICHA DE TOUR

> Fuente: slides 1–8, 10–13, 16–19 del PDF (16 slides — el bloque más grande)
> **+ la transcripción de la reunión del 2026-07-24**, que es donde de verdad se
> explica este plan: casi la mitad de los 43 minutos van sobre la ficha de tour.
> Las aclaraciones de viva voz van marcadas **📞 REUNIÓN 07-24** con su minuto.
> Cruzado con: `app/src/pages/tour.tsx`, `components/tour/widget-reserva.tsx`,
> `components/tour/menu-tour.tsx`, `components/tour/datos-tour.tsx`,
> `components/tour/cabecera-ficha.tsx`, `components/internas/galeria-mosaico.tsx`,
> `data/tours.ts`, `data/home.ts`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR — las 13 correcciones de la ficha

**El hilo conductor**, dicho por el cliente en el slide 4:
> «En general hay que destacar mucho el cambio entre Light y Premium. El Premium
> que tenga colores como negros, como de lujo. Sobre todo debe notarse en las
> fotos del menú, dado que es ahí donde está la diferencia. Fernando me insistió
> que necesita que el usuario vea claramente las diferencias del menú y por eso
> el precio diferente.»

Todo lo demás son detalles alrededor de eso.

**Cambiar el modelo de la ficha (4)**
1. Premium por defecto en el widget — **choca con un guardarraíl**, ver §1.
2. Sección nueva de comparación Light vs Premium con paleta oscura/lujo (§2).
3. El menú Premium pintado en oscuro; el Light en claro (§3).
4. Upsell explícito a Premium dentro del widget (§4).

**Añadir lo que falta (4)**
5. **Menú de niños** — no existe (§5).
6. Segmentar personas: adultos / niño 1–3 / niño 4–7 (§6).
7. Charter privado: le falta todo el bloque «Cruceros privados de 3 y 4 horas»
   de la web real (§7).
8. Los 3 paquetes de comida de grupo (§8).

**Pulir lo que ya existe (5)**
9. Mini banner «estás en la versión Premium» (§9).
10. Mini galería de fotos del menú dentro del mosaico (§10).
11. El video vertical del mosaico, sticky al hacer scroll (§11).
12. Subir el bloque de menú, justo tras la descripción (§12).
13. Destacar más el «#1 en TripAdvisor · 7 años» y quitar las «rayitas
    separadoras» de la ficha técnica (§13).

Y una transversal: **el charter privado es solo Premium** → toda su ficha en
paleta premium (§14).

---

## §1 — Slide 4: «poner aquí por defecto el premium»

**Cliente:** flecha al toggle `Light US$ 99 | Premium US$ 114` del widget.

**Estado en el repo:** existe y funciona, abre en Light por decisión
documentada. `widget-reserva.tsx:20-24`:

> ⚠️ El precio ABRE SIEMPRE en Light (`precioLight`), nunca en Premium: la card
> del grid, el ticker y el SEO dicen «desde US$ 99» […] es un opt-in EXPLÍCITO
> del visitante, con Light por defecto, así que se mantiene el **anti
> bait-and-switch**.

Ese guardarraíl no es una preferencia estética: salió de las 7 correcciones P1
de `analisis/revision-wireframes.md` («default Light + Premium como upgrade
+$15 — elimina bait-and-switch»).

El toggle solo se pinta si el tour tiene Light (`ficha.menuLight.length > 0`)
→ hoy **solo Semi-privado**. Snorkel Lovers no lo tiene (Samuel lo quitó el
2026-07-17), Saona usa selector de bote, Charter usa tabla de precios.

**Cómo lo aplicamos — dos caminos, decide Samuel:**

**Opción A (literal).** `useState<'light'|'premium'>('premium')`. Un cambio de
una palabra. Consecuencias reales, no teóricas: la ficha abre con US$ 114
mientras el grid de tours, el ticker del hero, el megamenú y el `<meta>` de SEO
siguen diciendo «desde US$ 99». Para que sea honesto hay que subir el ancla a
114 en **todos** esos sitios — y eso sube el precio de entrada del producto
estrella un 15% de cara al buscador.

**Opción B (recomendada) — «Premium domina la vista, Light domina el precio».**
Le da al cliente lo que pide de verdad (que el usuario *vea la diferencia*) sin
tocar el ancla:
- El toggle deja de ser dos pestañas simétricas y pasa a **dos tarjetas
  apiladas**, como en la propia maqueta del cliente del slide 5: Premium arriba,
  más grande, con badge «Lo que más eligen», su bloque de 4 ventajas y su CTA
  propio; Light debajo, sobrio.
- `Desde US$ 99` se mantiene como precio de cabecera, con la línea
  «Versión Light — lo esencial del día de mar» debajo (esa línea **está en la
  maqueta del cliente**, slide 5: él mismo la dibujó así).
- Un clic en la tarjeta Premium cambia cabecera y total, como ya hace hoy.

La opción B es literalmente la maqueta del slide 5. **El propio cliente dibujó
Light como precio de entrada** — la petición «por defecto el premium» del slide
4 y su maqueta del slide 5 se contradicen entre sí. Vale la pena enseñarle las
dos slides juntas.

**Archivos:** `components/tour/widget-reserva.tsx`.
**Esfuerzo:** medio. **Riesgo:** bajo.

### 📞 REUNIÓN 07-24 — la mecánica exacta que quiere (15:36–17:44)

Esto es lo más valioso del transcript: no pide «Premium por defecto» a secas,
pide **una mecánica de dos estados** que el PowerPoint no explicaba.

| Estado del selector | Qué muestra Premium | Qué muestra Light |
|---|---|---|
| **Light seleccionado** | **«+US$ 15»** en pequeño (el salto, no el total) | US$ 99 destacado |
| **Premium seleccionado** (por defecto) | **US$ 114**, el precio real | US$ 99 |

Miguel lo dice así (15:36): *«en la [versión] light destacamos 99 por persona, y
en la Premium viene el texto en grande [y] es 15 dólares en pequeñito»*. Y Samuel
lo confirma (17:30): *«cuando alguien presione light, que el de premium ponga
"+15"; cuando presionen premium, que ponga el precio que es, 114»*.

Miguel remata la intención sin rodeos (17:40): *«jugando con ese sesgo de que por
15 dólares más tiene premium»*.

**Dos consecuencias prácticas:**
1. El «+US$ 15» **ya existe en el proyecto**, pero en el bloque de menú de la
   columna izquierda. Samuel lo dice en la reunión (15:46): *«yo lo hice así en el
   lado izquierdo… sería ponerlo igual en el selector derecho»*. O sea: **no hay
   que diseñar nada nuevo, hay que replicar en el widget lo que ya está hecho en
   el menú.** Eso baja el esfuerzo de §1 de «medio» a **bajo**.
2. Con Premium por defecto, el «+15» se queda sin sitio en el estado inicial —
   y **ese es el hueco que el «129» tachado viene a llenar** (ver §4).

> 🔁 **REVERTIDO (Samuel, 2026-07-27): opción A, literal.** El widget abre en
> Premium (`useState<'light'|'premium'>('premium')`). **El ancla se queda en
> US$ 99** en el grid, el ticker, el megamenú y el SEO — no se sube a 114.
> Decisión explícita del cliente, tomada sabiendo la consecuencia: el visitante
> que entra por «desde US$ 99» llega a la ficha con **US$ 114 preseleccionado**,
> que es el mismo patrón que la corrección P1 de `analisis/revision-wireframes.md`
> §1.1 eliminó en 2026-07-11. Esta vez es deliberado, no un descuido — Fernando
> insistió explícitamente en que Premium vaya por defecto.
> El comentario guardarraíl de `widget-reserva.tsx:20-29` **se reescribe** (no se
> borra el historial): pasa de «el precio abre siempre en Light, nunca en
> Premium» a documentar que abre en Premium por pedido explícito del cliente,
> con el ancla de US$ 99 sin tocar en el resto del sitio — y deja constancia de
> que esto reabre el patrón bait-and-switch a propósito, para que una futura
> vuelta no intente "corregirlo" de nuevo sin saber que fue a propósito.

---

## §2 — Slides 16, 17: sección nueva de comparación Light vs Premium

**Cliente:** slide 16, flecha a un hueco entre «Qué llevar» y «Tu menú, a tu
elección»: *«agregar aquí una sección como la que viene en la siguiente
diapo»*. Slide 17 es la maqueta: fondo casi negro, oro, serif en los titulares,
título **«La misma ruta, dos maneras de vivirla»**, subtítulo «Mismo barco,
mismo itinerario, mismas paradas. Lo que cambia son cuatro cosas», píldora
«Toda la diferencia son US$ 15 por persona», y dos tarjetas: Premium (badge
«LA MÁS ELEGIDA», 4 ventajas en positivo) y Light (las mismas 4 tachadas, bajo
el epígrafe «NO INCLUYE»).

**Estado en el repo:** este comparador **existió y se quitó**. `menu-tour.tsx:21-30`:
la comparación Light/Premium se fundió dentro del menú en la Fase B, y el
2026-07-17 Samuel pidió quitarla («quita la comparativa y deja que cada menú
diga su precio»). La versión anterior está guardada:
`git checkout c23249a -- app/src/components/tour/menu-tour.tsx`.

**Cómo lo aplicamos:** vuelve, pero **como sección propia** (que es lo que el
cliente dibuja) y no fundida en el menú — así no se repite el error que motivó
quitarla. Componente nuevo `components/tour/comparador-premium.tsx`, colocado
donde el cliente pone la flecha: **después de «Qué llevar», antes de «Tu menú»**
— es el sitio correcto porque prepara la lectura del menú, que es donde vive la
diferencia real.

Sobre la estética oscura: **es la primera vez en este proyecto que se justifica
un bloque oscuro con oro.** No hay tokens para eso. Habría que crear una familia
`--color-premium-*` (fondo, superficie, borde, texto, acento oro) en
`tokens.css` antes de escribir el componente — regla del proyecto: si un color
no existe como token, se añade el token primero. Y hay que decidir si ese oro
entra en la paleta del proyecto o es un **modo** local del producto Premium.
Mi lectura: es un **modo**, no un color de marca — vive solo donde se vende
Premium (este comparador, el bloque de menú Premium, la ficha de charter), y no
se cuela en el resto del sitio. Eso lo mantiene compatible con «B Charter
Premium» y con el aqua a cuentagotas.

Los 4 diferenciales de la maqueta **son reales, ya están en el repo** (barra
libre con marcas importadas, langosta y camarón en el almuerzo, zona preferente
a la sombra, fotos del tour incluidas) — salen de `FICHAS['semi-privado']`. No
hay que inventar nada.

**Archivos:** `components/tour/comparador-premium.tsx` (nuevo),
`src/styles/tokens.css`, `pages/tour.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** medio-alto. **Riesgo:** medio — introduce una paleta nueva.
**Duda para Samuel:** ¿el oro/negro entra como **modo Premium** local (mi
recomendación) o como paleta nueva del sistema? Afecta al traspaso a Figma:
un modo = un set de variables aparte, no una redefinición de las existentes.
📞 **La reunión refuerza «modo local»**: al confinar la piel oscura al widget y
al comparador (ver §14), el oro/negro nunca toca el resto del sitio. Es un modo
de producto, no un color de marca — y con eso el traspaso a Figma es un set de
variables aparte, sin tocar las existentes.

---

## §3 — Slides 4, 18, 19: los menús, en dos pieles

**Cliente:** *«sobre todo debe notarse en las fotos del menú, dado que es ahí
donde está la diferencia»* + *«las fotos de los platos las haremos de nuevo y
en alta calidad, como hicimos en dinner»* + *«el formato que se parezca al de
la siguiente diapo»*. Slides 18 y 19 son las maquetas: **Menú Premium sobre
negro con oro** («7 platos a elegir», «+US$ 15», badge «EL MÁS ELEGIDO», chip
«EL MÁS PEDIDO» sobre Surf & Turf, chips «VEG» en los vegetarianos) y **Menú
Light sobre claro** («2 platos a elegir», US$ 99, y —el detalle bueno— **dos
celdas fantasma en línea discontinua** que dicen «Langosta, Angus y 5 platos
más en el Premium» / «Opciones vegetarianas en el Premium»).

**Estado en el repo:** `menu-tour.tsx` ya pinta **un bloque por paquete** con
todos sus platos en cards con foto, y ya lleva el precio en la cabecera de cada
bloque (Light `US$ 99`, Premium `+US$ 15`). La estructura pedida **ya está
hecha**; lo que falta es (a) la piel oscura del Premium, (b) los chips «el más
pedido» / «veg», (c) las celdas fantasma del Light, (d) el CTA al pie de cada
bloque.

Esa idea de las **celdas fantasma es la mejor de todo el PowerPoint**: enseña lo
que te pierdes sin mentir y sin ocultar nada. Es honesta y vende — merece
implementarse tal cual.

**Cómo lo aplicamos:** `PaqueteMenu` recibe una prop `piel: 'claro' | 'premium'`
y usa los tokens `--color-premium-*` de §2. `PlatoCard` gana `destacado?: boolean`
(→ chip «El más pedido») y `veg?: boolean`, ambos como campos nuevos y
**opcionales** en `PlatoMenu` (`data/tours.ts`) — así los otros tours no cambian.
Las celdas fantasma se generan del propio dato: si `menuLight.length > 0`, se
pintan `menuPremium.length - menuLight.length` huecos con el resumen. Nada
hardcodeado.

**Las fotos nuevas de los platos son la dependencia crítica.** Hoy Surf & Turf y
Vegetariano no tienen foto en alta (solo thumbnails 368×224, ver Pendientes de
`hispaniola.md`) — el fallback de `PlatoCard` pinta un icono. Sobre fondo negro
ese fallback hay que rehacerlo o el bloque Premium se ve roto justo en su plato
estrella. Con las fotos nuevas, este apartado es el que más rendimiento da de
toda la tanda.

**Archivos:** `components/tour/menu-tour.tsx`, `data/tours.ts`,
`src/styles/tokens.css`, `public/fotos/` (assets del cliente), `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo (con las fotos) / medio (sin ellas).
**Duda para Samuel:** ¿esperamos las fotos nuevas o construimos con las
actuales y se sustituyen? Se puede construir ya: los nombres de archivo no
cambian.

---

## §4 — Slide 5: upsell a Premium dentro del widget

**Cliente:** su maqueta pinta, dentro del widget y bajo las dos tarjetas, una
caja cálida: **«Con Premium sumas 4 cosas por US$ 15»** + las 4 ventajas + botón
**«Cambiar a Premium»**. Anotaciones: *«Agregar algo así como un upsell para que
el usuario escoja la versión premium»* y *«solo en este caso agregar que el
precio anterior era de 129»*.

**Estado en el repo:** el widget tiene el chip «Reservando directo ahorras hasta
15%» y el «ahorra hasta 15%» anclado en el precio de LISTA, pero **no hay caja
de upsell**. El bloque de menú sí tiene una barra parecida
(«¿Prefieres langosta, Angus o una opción vegetariana? Súbelo por +US$ 15»,
slide 19) — el patrón ya existe en el proyecto, solo hay que llevarlo al widget.

**Cómo lo aplicamos:** la caja de upsell se pinta **solo cuando `paquete ===
'light'`** y desaparece al cambiar a Premium (donde la sustituye el mini banner
de §9). Las 4 ventajas salen de un campo nuevo `ventajasPremium: string[]` en
`data/tours.ts` — **el mismo array que consume el comparador de §2**, para que
no haya dos listas que puedan desincronizarse.

### 📞 REUNIÓN 07-24 — para qué sirve el «129» (16:55–17:44)

El PowerPoint decía solo *«solo en este caso agregar que el precio anterior era
de 129»*, sin explicar por qué. La reunión lo explica, y es una razón
**estructural**, no decorativa:

Con Premium por defecto, el widget ya no puede decir «+US$ 15» en el estado
inicial (el «+15» solo tiene sentido leyéndolo desde Light). Samuel lo plantea
así (17:14): *«si el premium está por defecto, no podemos poner "+15" y ya»*.
Miguel responde (17:19): *«claro… era de 129»*. **El tachado es el sustituto del
"+15" cuando Premium arranca seleccionado** — es lo que le da al precio de
US$ 114 un punto de referencia contra el que parecer barato.

**Qué NO cambia con esta aclaración:** que 129 siga sin estar verificado. Al
contrario — ahora sabemos que el cliente lo quiere **precisamente por su efecto
psicológico** (*«jugando con ese sesgo»*, 17:40), lo cual es exactamente el
escenario en el que un tachado falso deja de ser un descuido y pasa a ser
publicidad engañosa deliberada.

**Cómo lo dejamos:** el tachado **no se pinta hasta que Fernando confirme por
escrito que 129 fue una tarifa de lista real**. Se deja comentado en el código
con el motivo y la línea lista para descomentar, exactamente como se hizo con los
ratings por plataforma en la v1. Este proyecto ya tiene precedente de la web del
cliente contradiciéndose sola (el «desde $55» del charter que en realidad eran
$75 — Aprendizajes de `hispaniola.md`).

**Si Fernando no puede confirmarlo**, hay una salida que da el mismo efecto sin
inventar nada: mostrar **«Light US$ 99 · +US$ 15»** junto al precio de Premium
también en el estado por defecto. El punto de referencia lo pone el propio Light,
que sí es un precio real. Vale la pena proponérselo.

**Archivos:** `components/tour/widget-reserva.tsx`, `data/tours.ts`,
`dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo (técnico) / **alto de contenido** (el 129).
**Acción:** preguntar a Fernando por el 129, con la alternativa ya preparada.

---

## §5 — Slide 1: «falta agregar el menú de niños»

**Cliente:** slide en blanco con esa única frase. Es la primera del PDF, así
que probablemente sea de lo que más le importa.

**Estado en el repo:** **no existe.** Hay tarifa de niño (`precioNino: 65` en
Snorkel Lovers, `widget-reserva.tsx` pinta el stepper dual Adultos/Niños) y hay
un comentario en `menu-tour.tsx:66` que menciona «el menú Niños — incluido en la
tarifa de niño»… pero el menú en sí **nunca se construyó**. Hay tarifa sin carta.

### 📞 REUNIÓN 07-24 — esto pasa de «bloqueado» a «se puede hacer ya» (00:33–04:40, 09:56–11:29)

La reunión contesta las tres preguntas que bloqueaban esta sección:

**1. Qué tour es.** No es genérico: es **Snorkel Lovers**. Miguel (10:44):
*«falta el menú de niños, que lo estoy viendo en su página actual y no lo veo
[en la nuestra]»*. Samuel lo localiza (11:00): *«en el de snorkel… recuerdo haber
visto un menucito, una hamburguesa con otras cosas»*. Miguel confirma (11:29):
*«pero así, comida niños»*.
→ **El contenido existe en la web en vivo del cliente.** No hay que pedirlo: se
extrae, igual que se portó el resto del contenido real. Sigue valiendo la regla
de la casa: **contrastar contra la web en vivo, no contra `prototipo/datos.js`**,
que ya demostró estar desactualizado (el «desde $55» del charter).

**2. Qué cuesta.** Miguel (03:40): *«el niño Premium son 15 dólares más; el light
le cuesta [65]»*. Samuel lo cierra (03:59): *«el menú de niños vale 65; por 15
más tienes el premium»*.

| Tramo | Light | Premium |
|---|---|---|
| Niño **1–3 años** | **gratis** — «los niños de uno a tres años no pagan» (01:58) | gratis |
| Niño **4–7 años** *(tope por confirmar)* | **US$ 65** | **US$ 80** |
| Adulto | US$ 99 | US$ 114 |

El `precioNino: 65` que ya está en el repo **era correcto** — lo que faltaba era
saber que es la tarifa *Light* y que existe una *Premium* de 80.

**3. En qué tours va.** Miguel (04:40) y Samuel (04:00): **snorkel, charter
privado y Saona**. El **semi-privado NO admite niños** — Samuel lo pregunta
explícitamente (*«ese no acepta niños, ese solo adultos»*) y Miguel responde
*«correcto»* (03:09). Eso es un dato de negocio que el repo no tenía.

⚠️ **Y una excepción que hay que respetar: Saona no lleva menú a elegir.**
Samuel (09:29): *«la información de la web anterior dice que la comida se sirve
tipo buffet»* → (09:56) *«como es tipo buffet, no pides nada, simplemente vas y
agarras lo que quieras»*. Miguel no lo contradice. **A Saona no se le pone
selector de menú** — ni de adulto ni de niño. Se describe el buffet y ya.

### ✅ RESUELTO al extraer la web (2026-07-27) — ver `TARIFARIO-WEB-ORIGINAL.md` §2-bis

**El «Kid's Meal» existe en la web original**, en Snorkel Lovers, como una tarjeta
más del menú junto a Seafood / Meat / Surf & Turf / Vegetarian / las dos lasañas /
Seafood Cocktail. **No es un menú aparte: es una opción más del menú único.**
Eso cambia cómo se implementa.

**No tiene descripción** —en su HTML todas las descripciones de plato están
comentadas— pero **sí tiene foto propia**: `images/food/kids_meal_new.jpg`
(769×368). En la foto se ven **nuggets de pollo, hamburguesa, papas fritas,
salchicha en rodajas y kétchup**, que es exactamente lo que Samuel recordaba
(11:00: *«una hamburguesa con otras cosas»*).

⚠️ **Dos correcciones a lo que este plan daba por hecho:**
1. **No hay «niño premium a US$ 80».** Snorkel Lovers no tiene Light/Premium:
   es **Adults US$ 114 · Kids US$ 65**, y punto. El «+15 al niño» de la reunión
   no tiene respaldo en la web.
2. **La web no conoce tramos de edad ni bebés gratis.** Solo *Adults* y *Kids*.
   Lo de «1–3 no pagan» sale solo de la reunión → confirmarlo antes de programarlo.

**Cómo lo aplicamos (corregido):** no hace falta `menuNinos?: PlatoMenu[]` ni un
tercer `PaqueteMenu`. Basta con **añadir «Kid's Meal» como un plato más** del menú
de Snorkel Lovers en `data/tours.ts`, con su foto real y una marca `soloNinos: true`
para poder distinguirlo visualmente (chip «Niños», igual que el chip «VEG» del §3).
Es bastante más barato de lo que este plan estimaba.

**Lo único que queda pendiente:** la **redacción** del plato. Describir comida a
partir de una foto es una lectura, no un dato declarado — se escribe provisional y
se confirma con Fernando.

**Archivos:** `data/tours.ts`, `components/tour/menu-tour.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** trivial (el componente ya existe). **Riesgo:** ninguno.
**Bloqueo restante:** solo **confirmar el tope de edad**. En la reunión Miguel no
lo recordaba y aceptó el «¿será 7?» que propuso Samuel (01:28–01:34) — eso es una
suposición aceptada por cortesía, no un dato. Y confirmar que la carta de la web
actual sigue vigente.

---

## §6 — Slide 5: «segmentar adultos, niño de 1 a 3, niño de 4 a (7)»

**Cliente:** flecha al stepper «2 personas» del widget.

**Estado en el repo:** el stepper dual Adultos/Niños **ya existe** pero solo en
Snorkel Lovers (`esDual`, activado por `precioNino`). El cliente lo pide sobre
la captura del **Semi-privado**, que hoy tiene un stepper único.

Lo nuevo es que son **tres tramos**, no dos: adultos, niño 1–3 y niño 4–7. Eso
implica que hay **dos tarifas de niño distintas** y probablemente que 1–3 años
sea gratis o casi. El «(7)» entre paréntesis sugiere que ni él está seguro del
tope.

**Cómo lo aplicamos:** generalizar `esDual` a un array `tarifas` en
`data/home.ts`:
```ts
tarifas?: { id: string; label: string; precio: number; edades?: string }[]
```
El widget itera el array y pinta N steppers en vez de tener ramas `esDual` /
clásico. Esto **simplifica** el widget (hoy tiene dos caminos paralelos, ver
`widget-reserva.tsx:361-396`), no lo complica — buen refactor con excusa.
La suma sigue tapada por `maxPax`, y el query string al funnel pasa de
`?adultos=N&ninos=M` a `?<id>=N` por tramo.

### 📞 REUNIÓN 07-24 — desbloqueado (ver la tabla de §5)

Los precios ya no faltan: **1–3 gratis · 4–7 a US$ 65 (light) / US$ 80 (premium)
· adulto US$ 99 / US$ 114**. Y ya sabemos que el tramo de niños **solo aplica a
snorkel, Saona y charter privado** — el semi-privado es solo adultos, así que ahí
el stepper se queda como está (uno solo).

Un matiz de implementación que la tabla trae consigo: **el tramo 1–3 es gratis,
pero cuenta para el aforo.** Tres bebés en un barco de 20 ocupan tres plazas
aunque paguen cero. El array de `tarifas` necesita entonces distinguir
`precio: 0` de «no cuenta», y `maxPax` tiene que sumar **todos** los tramos, no
solo los que pagan. Es el tipo de detalle que se escapa y luego sobrevende un
barco.

**Y otra regla de cálculo que salió en la reunión** (08:14, sobre el charter y
Saona): el **add-on de langosta son US$ 30 por persona multiplicado por TODAS
las personas del barco**, no por las que lo quieran. Samuel lo verifica en voz
alta (*«si se le da check y son 10 personas, es 30 por 10»*) y Miguel responde
*«correcto»*. Eso es un check único a nivel de reserva, no una elección por
comensal — y cambia cómo se modela en el funnel.

**Archivos:** `data/home.ts`, `components/tour/widget-reserva.tsx`,
`components/reservar/*` (el funnel lee la cantidad), `lib/reservas.ts`.
**Esfuerzo:** alto (toca el cálculo del total y el funnel). **Riesgo:** medio —
es la aritmética del precio, hay que verificarla contra ejemplos.
**Bloqueo restante:** solo el **tope de edad** (7 aceptado por cortesía, sin
confirmar) y si el tramo 1–3 gratis aplica a los tres tours o solo a alguno.

---

## §7 — Slide 2: al charter privado le falta media página de la web real

**Cliente:** pega la URL
`hispaniolaaquaticadventures.com/private-catamaran-snorkeling-excursion-puntacana.php?lang=es`
y dice *«falta eso en charter privado»*, con la captura de:
- Banda **«🕐 Cruceros privados de 3 y 4 horas»**.
- Caja **«Descubre nuestros Paquetes Privados para Grupos»** + CTA «HAZ CLIC AQUÍ».
- Línea de **tarifas y descuentos**: «TARIFAS DESDE — después de todos los
  descuentos aplicables · Hasta 5% para clientes habituales · 5% por 30 días de
  reserva anticipada · 5% de descuento en efectivo».
- Nota: **«Nuestros condimentos son seleccionados a mano y se elaboran desde
  cero. Nuestra comida de primera clase se asa a la parrilla en nuestra cocina
  flotante… Podemos adaptarnos a las restricciones dietéticas de cualquier tipo
  y nuestra comida se asa a la parrilla por separado para evitar la
  contaminación cruzada.»**

**Estado en el repo:** de las 4 piezas, **ninguna está en la ficha de charter**.
Los descuentos 5+5+5 existían como duda abierta en la v1 (Pendientes de
`hispaniola.md`: *«¿descuentos 5+5+5 acumulables y tope?»* — se marcó resuelta
pero no se pintó en la ficha). El «3 y 4 horas» sí está, pero enterrado en
`ficha.duracion` («3-4 horas (aprox.)»).

**Cómo lo aplicamos:**
- **«Cruceros privados de 3 y 4 horas»**: se convierte en eyebrow del hero de
  la ficha de charter, no en una banda a rayas negras (esa banda es la estética
  de la web vieja, no se copia).
- **Paquetes privados para grupos**: es el slide 13 → ver §8.
- **Descuentos 5+5+5**: bloque nuevo en la ficha, con la letra pequeña **que la
  web del cliente no tiene**: ¿son acumulables? ¿hay tope? Sin esa respuesta se
  pinta como «hasta 15% combinables» y eso ya lo dice el chip del widget
  («Reservando directo ahorras hasta 15%») — o sea que **el chip ya promete el
  15% sin explicarlo en ningún sitio**. Este bloque es la explicación que falta.
  Es un arreglo de honestidad, no solo un añadido.
- **La nota de la comida**: va al bloque «El menú a medida» de `MenuCharter`,
  literal. La parte de **contaminación cruzada y restricciones dietéticas** es
  un diferencial fuerte y no está dicho en ninguna parte del sitio nuevo.

### 📞 REUNIÓN 07-24 — tarifas nuevas y el porqué de los tramos (05:28–07:55)

**a) El botón «paquetes privados para grupos» lleva a Eventos, no a un bloque.**
Miguel (12:24): *«a la pestaña de eventos y celebraciones»*; Samuel lo confirma
viéndolo (*«lleva a event party»*). Eso **resuelve la duda de ubicación del §8**
— ver allí.

**b) Forever Teresa: los tramos que faltaban.** Samuel los lee en voz alta y
Miguel no corrige (06:18):

| Tramo | Precio |
|---|---|
| 1–18 personas | **US$ 1.600** |
| 19–25 personas | **US$ 85** por persona |
| 26–29 personas | **US$ 2.225** + **US$ 75** por persona adicional |

Es el único barco con esta estructura: los demás van a un solo precio de grupo.
Samuel lo dice explícito (07:24): *«el único que tiene más planes es el Forever
Teresa»*, y además tiene variante de **3 h y de 4 h**.

**c) El argumento de copy que no teníamos.** Miguel explica *por qué* el precio
salta por tramos (07:06): **normativas que exigen más tripulación** — *«marino y
por [seguridad], aunque no hagan nada tiene que estar»*. Eso convierte una tabla
de precios que parece arbitraria en una decisión justificada. **Merece una línea
en la ficha**, no dejarlo como letra pequeña: explica el salto y refuerza el
«legal y asegurada» del plan 07.

**d) Saona va por tramos de persona** (07:59): 1–6, luego 7, 8, 9, 10… cada uno
con su precio. Estructura distinta a la del charter.

⚠️ **e) El charter privado NORMAL no se pudo reconstruir.** La transcripción se
rompe justo ahí (05:33–06:18): se entiende «4 horas, 1–8 personas un precio; de
9 a 20… adicional de 100 dólares… y sale 599», y no cuadra con la tabla del repo.
**No se toca la tabla del charter normal con esto** — hay que pedir el tarifario
escrito. Reconstruir precios de una transcripción automática es exactamente cómo
se cuelan errores de datos, y este proyecto ya tiene un precedente caro.

**Archivos:** `data/tours.ts` (`FICHAS['charter-privado']`), `data/home.ts`,
`components/tour/menu-tour.tsx`, componente nuevo
`components/tour/descuentos-tour.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo (código) / **alto de datos** (las tarifas).
**Duda para Samuel:** los 5+5+5, **¿acumulables hasta 15% o excluyentes?** El
chip del widget ya dice «hasta 15%», así que si son excluyentes el chip está
mintiendo hoy. **No lo aclaró la reunión.**

---

## §7-bis — ⚙️ EL TARIFARIO TIENE QUE FUNCIONAR, no solo estar anotado

> ✅ **DECISIÓN (Samuel, 2026-07-27).** Esta sección es nueva y es **la más
> importante de todo el plan 01** en esfuerzo de ingeniería. Textual:
> *«no solo debe estar anotado sino que la lógica del widget debe funcionar: que
> a medida que se llega a un tramo nuevo de cantidad de puestos, el precio cambie
> para esos puestos nuevos. El tarifario es muy importante.»*

### Qué hay hoy y por qué no alcanza

- `calcularTotalTour()` (`data/tours.ts`) resuelve el caso simple:
  `precio × personas` (+ niños, + upgrade Premium). Es **lineal**.
- `TablaPreciosCharter` es **puramente presentacional**: pinta una tabla de
  precios escrita a mano. **No alimenta ningún cálculo.**
- Resultado: hoy la tabla y el total del widget son **dos verdades separadas**
  que nadie garantiza que coincidan. Con tramos reales, eso se rompe enseguida.

### ⚠️ El modelo real — CORREGIDO tras extraer la web (2026-07-27)

> Esta sección decía «modelo marginal/acumulativo». **Era incorrecto.** Al extraer
> el tarifario real (ver `correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`, con
> HTML + render + JSON-LD contrastados) resulta que **hay DOS modelos distintos**,
> y el widget tiene que soportar los dos.

**Modelo A — tours (charter y Saona): SUSTITUCIÓN de tramo.**
Según en qué tramo caiga el **total** de personas se aplica **ese y solo ese**
tramo, que es de una de dos naturalezas:
- **`per Group`** → precio **plano**, no se multiplica.
- **`per Person`** → precio **× TODAS las personas**, no solo las que exceden.

Ejemplo real (Maite): 8 pax → **US$ 625** plano. 9 pax → **9 × 99 = US$ 891**.
La persona nº 9 no «cuesta 99»: hace saltar **toda la reserva** a otro tramo.

Y el Forever Teresa 3 h demuestra que un tramo `per Person` puede volver a uno
`per Group`: 25 pax → 25 × 85 = 2.125 · **26 pax → 2.225 plano** · 30 pax → 30 × 75.
El descuadre de los «US$ 30» que este plan sospechaba **no existía**: 2.225 es una
tarifa de grupo independiente, no la continuación de una suma.

**Modelo B — eventos (party boat y bodas): MARGINAL.**
Ahí sí es base fija + extra por persona: `1.188` para 1–12 personas, `+99` por cada
persona a partir de la 13. Es el modelo que este plan asumía para todo.

### La estructura de datos

```ts
type Tramo = {
  desde: number
  hasta: number
  tipo: 'grupo' | 'persona'   // grupo = plano · persona = × todas las personas
  precio: number
  suplementoComida?: number   // US$ por persona, solo en tramos 'grupo'
}
```

Un tour declara `tramos: Tramo[]` y **el mismo array alimenta las dos cosas**:
el cálculo del total y la tabla que se pinta en pantalla.

**Ese es el punto arquitectónico que hay que no perder:** la tabla de precios se
**genera desde el tarifario**, nunca se escribe aparte. Si se escriben por
separado, se desincronizan — y una tabla que dice un precio distinto del que
cobra el widget es el peor bug posible en una página de reserva.

### Qué más entra en el mismo cálculo

- **Tramos de edad** (§5, §6): adultos, niños 1–3 (US$ 0 **pero ocupan plaza**) y
  4–7. El aforo suma **todos** los tramos; el precio, solo los que pagan.
- **Add-on de langosta**: US$ 30 **× todas las personas del barco** (reunión
  08:14, confirmado). Es un check único a nivel de reserva, no una elección por
  comensal.
- **Paquete Light/Premium**: el +US$ 15 por persona de §1.
- **Descuentos 5+5+5** (§7): pendientes de saber si acumulan.

### Cómo lo verificamos (no negociable)

El proyecto ya tiene el precedente correcto: la calculadora del prototipo se
verificó **contra un ejemplo concreto** (2 personas + Premium = $198 + $30 = $228,
depósito $57, saldo $171, cash −5% = $162). Aquí hay que hacer lo mismo, con
**un caso por frontera de tramo**: 18 y 19 personas, 25 y 26, 29. Las fronteras
son donde vive el bug clásico del *off-by-one* (¿la persona 19 paga tarifa vieja
o nueva?), y no se detecta mirando la pantalla — hay que calcularlo a mano y
comparar.

**Archivos:** `lib/tarifas.ts` (**nuevo — el motor**), `data/tours.ts`,
`data/eventos.ts`, `components/tour/widget-reserva.tsx`,
`components/tour/tabla-precios-charter.tsx` (pasa a derivarse del tarifario),
`components/reservar/*`, `lib/reservas.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** **alto** — es la pieza de ingeniería más grande de la tanda.
**Riesgo:** **alto** — es dinero. Un error aquí cobra de menos o de más.
**Fuente de datos:** ✅ **YA EXTRAÍDO** →
`correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`. Contiene las **5 tarifas del
charter** (4 barcos, el Forever Teresa con 3 h y 4 h), las **3 de Saona**, y los
**4 paquetes de evento** con sus menús y sustituciones vegetarianas — todo
contrastado por HTML crudo + render en Chrome + JSON-LD.

### 🚨 Tres cosas que hay que preguntar antes de programar el motor

El detalle está en el documento del tarifario; el resumen:

1. **¿El «+US$ 25 por persona para comida» es obligatorio u opcional?**
   Si es obligatorio, hay dos tarifas donde **contratar más gente sale más
   barato** (Forever Teresa 4 h: 28 pax = US$ 3.475 vs 29 pax = US$ 2.871). Es un
   agujero de precio real. **Bloqueante para el motor.**
2. **Los «from US$ …» no se derivan de sus propias tablas** — Santa María anuncia
   «desde 1.150» cuando su tramo de grupo es 1.000. **Decisión ya tomada: no se
   copian; el precio de entrada se calcula del tarifario.**
3. **El add-on de langosta, ¿por persona o por barco?** La web dice «per person»;
   la reunión lo modeló como un check que multiplica por todo el grupo.

**Casos de prueba obligatorios:** están listados en el documento del tarifario,
uno por frontera de tramo. El más valioso es **Forever Teresa 3 h con 26
personas** — es el único que vuelve de `per Person` a `per Group`, y un motor mal
escrito lo calcula como 26 × 85 = 2.210 en vez de 2.225.

---

## §8 — Slide 13: los 3 (4) paquetes de comida de grupo

**Cliente:** captura de la web real (`Paquetes de comida`) con 4 paquetes:
**Hispaniola Premium Package US$ 1.188,00** (1–12 personas · 4 horas a bordo ·
Chicken Skewer, Beef Skewer, Shrimp Skewer, Shrimp Tempura, Fish Sticks, French
Fries, Lobster · US$ 99 por persona extra), **Package #I US$ 660,00** (1–10
pers · 3 h · 2 comidas: Hot Dog), **Package #II US$ 780,00** (1–10 pers · 3 h ·
3 comidas), **Package #III US$ 900,00** (1–10 pers · 3 h · 3 comidas). A la
derecha dibuja un layout: caja ancha «Hispaniola Premium Package» arriba y
**3 cajas iguales debajo (1, 2, 3)**.

**Estado en el repo:** no existe. `MenuCharter` pinta 7 platos + add-on de
langosta, pero **no hay paquetes cerrados con precio de grupo**. La
`TablaPreciosCharter` es de precios por bote/pax, no de comida.

**Cómo lo aplicamos:** componente nuevo `components/tour/paquetes-comida.tsx`
con exactamente el layout que él dibuja: el Premium destacado a lo ancho
(piel `premium` de §2 — encaja perfecto, es el paquete de lujo) + los 3
numerados debajo en grid de 3. Datos nuevos en `data/tours.ts`.

Ojo al dato: **US$ 1.188 / 12 personas = US$ 99 por persona**, el mismo número
que el Light del semi-privado. Coincidencia útil de comprobar con el cliente
antes de publicarlo, porque invita a confusión.

### 📞 REUNIÓN 07-24 — resuelto: los paquetes viven en EVENTOS (12:13–13:37)

La duda de ubicación se cierra. Samuel describe el botón de la web real y
pregunta a dónde lleva; Miguel contesta (12:24): **«a la pestaña de eventos y
celebraciones»**. Samuel lo verifica en vivo: *«lleva a event party… ahí sí, sus
paquetes y tal»*.

**Conclusión: los paquetes de comida son contenido de Eventos.** La ficha de
charter privado **solo lleva un enlace** («Descubre nuestros paquetes privados
para grupos →») que apunta a `/eventos/party-boat`. No se duplica el bloque en
las dos, que era la opción (c) que este plan recomendaba antes.

Eso **simplifica** el trabajo: el componente `paquetes-comida.tsx` se construye
una sola vez y se monta solo en las landings de evento → el trabajo se muda al
**plan 03**, y aquí queda un enlace.

Y trae un dato de tarifa que el plan 03 necesitaba (13:05): Samuel resume que los
precios de evento son **«desde US$ 1.188 de 1 a 12 personas, y cada persona
adicional son US$ 99»**, y propone hacerlo *«tal cual como está el resto»*.
Miguel dice que **sí se puede reservar online** (12:53) — ver plan 03 §1.

**Archivos:** solo el enlace en `data/tours.ts` (`FICHAS['charter-privado']`) y
`pages/tour.tsx`. El componente y los datos se van al plan 03.
**Esfuerzo:** trivial aquí (medio en el plan 03). **Riesgo:** bajo.

---

## §9 — Slide 6: mini banner «estás en la versión Premium»

**Cliente:** flecha a una barra gris vacía entre la ficha técnica y el bloque
«Un día de mar en grupo pequeño»: *«Poner un mini banner donde agreguemos un
mensaje que refuerce que el usuario está en la versión Premium»*.

**Estado en el repo:** ese hueco no existe — hoy `DatosTour` y el bloque de
descripción son consecutivos.

**Cómo lo aplicamos:** banda fina que se pinta **solo cuando el widget está en
Premium** (`paquete === 'premium'`), en la piel premium, con el texto de lo que
acaba de desbloquear. Es la contraparte del upsell de §4: uno aparece cuando el
otro desaparece — el visitante nunca ve los dos.

**Detalle técnico real:** hoy `paquete` es state **interno** de
`widget-reserva.tsx`; para que una banda de la columna izquierda reaccione, hay
que subirlo a `pages/tour.tsx` — exactamente el mismo movimiento que ya se hizo
con `variante` (el bote del charter) el 2026-07-17 y por la misma razón. Hay
precedente, es el patrón de la casa.

**Archivos:** `pages/tour.tsx`, `components/tour/widget-reserva.tsx`,
componente nuevo `components/tour/banda-premium.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

---

## §10 — Slide 7: mini galería de fotos del menú

**Cliente:** círculo amarillo sobre una foto del mosaico + *«Mini galería de
fotos del menú»*.

**Estado en el repo:** el mosaico (`GaleriaMosaico`) mezcla fotos de todo:
paisaje, gente, snorkel, y **una bandeja de comida** suelta entre ellas. No hay
agrupación por tema.

### 📞 REUNIÓN 07-24 — resuelto, y es más grande de lo que parecía (19:27–19:57, 24:18–24:47)

No es (a) ni (b) exactamente: es **una mini galería de fotos de comida propia,
en TODOS los servicios**. Miguel (19:27): *«importante: en todos los servicios
tiene que ser una mini galería de… las fotos de la comida»*. Y aclara el reparto
(19:50): *«el resto son fotos normales, o fotos y vídeos»* — es decir, el mosaico
sigue siendo mixto y **la comida se saca aparte, en su propia pieza**.

Samuel añade dos detalles de forma:
- (19:31) **«quitar ese espacio blanco, que abarque todo»** → la pieza va a
  **ancho completo**, no encajada en una celda del mosaico.
- (19:57) **«como imágenes de la comida pasando»** → es un **carrusel/marquee**,
  no una rejilla estática. El proyecto ya tiene el patrón resuelto
  (`use-fila-arrastrable.ts` + los marquees existentes) — se reutiliza, con el
  cuidado ya conocido de `prefers-reduced-motion` + `scrollbar-width: none`
  (el bug que el cliente reportó y se arregló en `3e3bd40`).

**Y una corrección de rejilla que va junto** (24:29): la sección de fotos de
comida pasa de **4 columnas a 3**, *«para que la comida sea más grande»*.
Miguel lo había pedido antes (24:18) en el mismo sentido: *«la comida, por
supuesto, va a ser mejor… hacer este contenedor un poquito más atractivo»*.

**Cómo lo aplicamos:** deja de ser «trivial si ya se hizo §3». Es una pieza
propia, a ancho completo, en las 4 fichas + las 3 landings de evento. Se apoya
en §3 para los datos (las fotos de plato ya vienen de `menuLight`/`menuPremium`)
pero es un componente aparte.

**Archivos:** `components/tour/galeria-comida.tsx` (nuevo),
`components/tour/menu-tour.tsx` (4→3 columnas), `pages/tour.tsx`,
`pages/evento.tsx`, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.
**Dependencia:** son **las mismas fotos nuevas de plato** de §3 — si llegan en
alta, esta pieza es de las que más lucen; con los thumbnails de 368×224 actuales,
una galería a ancho completo las va a reventar. **Esta sección es la que hace
urgente el pedido de fotos.**

---

## §11 — Slide 10: el video vertical, sticky al hacer scroll

**Cliente:** dos flechas. *«Esto que vaya bajando según el cliente hace scroll»*
(al video vertical 9:16 del mosaico) y *«Concentrar aquí todo el contenido en
ese espacio»* (a la columna de contenido).

Nótese que su captura tiene **el video duplicado** — arriba en el mosaico y otra
vez más abajo, superpuesto al texto. Está dibujando el *movimiento*, no dos
videos: el video baja acompañando el scroll.

**Estado en el repo:** el video es la columna vertical 9:16 a la izquierda del
mosaico (2026-07-22, 2ª vuelta) y **es estático**. Ya hay precedente de
recorrido de scroll en el proyecto: `use-experiencia-scroll.ts` (el video de la
home que crece a pantalla completa y encoge) — hecho en la 2ª vuelta de la v1
por una petición idéntica en espíritu.

**Cómo lo aplicamos:** `position: sticky` con `top` = `--spacing-sticky-top`
sobre la columna del video, acotado al alto del bloque de contenido. El widget
de la derecha ya es sticky con ese mismo token, así que **el video de la
izquierda y el widget de la derecha bajarían sincronizados** — visualmente
correcto y sale gratis.

⚠️ **Riesgo real, avisado ya en la v1:** *«saturación de video si cada sección de
la página termina llevando su propio clip»* (`EJECUTADO.md`). Un video sticky
en movimiento permanente durante toda la lectura de la ficha compite con el
widget de reserva, que es el objetivo de la página. Sugerencia: que el video
sticky **pare** (o se reduzca a miniatura) al llegar al bloque de menú, donde el
contenido pasa a ser el protagonista.

### 📞 REUNIÓN 07-24 — resuelto entero, incluida la segunda flecha (20:35–23:45)

**a) Qué video es.** No es material de archivo: Miguel (20:51) dice que *«va a
estar la persona responsable de explicar el tour… es como un mini vídeo de qué va
la vaina»*. **Es un asset que hay que grabar**, uno por tour. Sin él la
corrección no se ve — va a la lista de pedidos.

**b) Dónde y cómo se mueve.** Samuel lo propone y Miguel lo acepta (22:55–23:10):
**fijo abajo a la izquierda**, acompañando el scroll, **y se expande al hacer
clic**. El razonamiento de Samuel (23:10) es el correcto y conviene conservarlo:
*«a la derecha está lo de reservar, entonces eso tiene que quedar ahí solo»* —
**la columna derecha es del widget y no se comparte.** Miguel lo describe como
*«un vídeo que te va acompañando… permanente»* (22:46).

**c) La segunda flecha («concentrar el contenido») queda aclarada, y NO es lo que
parecía.** Samuel lo dice explícito (22:04): *«lo que se puede hacer es que **no**
se reduzca el contenido, porque ya está apretado, sino que [el video] se posicione
a la izquierda, porque queda un espacio sobrante»*. Es decir: **no hay que
estrechar la columna de contenido** — el video ocupa el blanco que ya sobra a la
izquierda. Eso descarta la lectura de «menos aire / bloques más juntos» que este
plan había supuesto.

**d) El riesgo de saturación lo levantó el propio cliente.** Miguel (23:40):
*«me están despistando con un vídeo, por muy bueno que sea»*. Samuel acordó la
salida (23:45): **se hace, se le enseña, y si despista se quita** y el video se
queda fijo donde está hoy. O sea: la duda que este plan dejaba abierta ya tiene
respuesta pactada — **se prueba completo, con reversión acordada de antemano**.
Conviene commitearlo aparte para poder revertirlo limpio.

**Archivos:** `components/internas/galeria-mosaico.tsx`, `tokens.css`,
hook nuevo, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** medio (saturación) — **mitigado**: reversión
pactada con el cliente.
**Bloqueo:** los videos del responsable explicando cada tour.

---

## §12 — Slide 11: subir el bloque de menú

**Cliente:** flecha desde el bloque de menús (Light + Premium con fotos) hasta
justo **encima de «Itinerario — 4 horas»**: *«Hay que subirla y ponerla justo
ahí»*.

**Estado en el repo:** el orden actual en `tour.tsx:120-179` es
mosaico → ficha técnica → descripción → **Itinerario → Incluye → Menú** → tabla →
reels → opiniones → FAQ.

El cliente lo quiere: mosaico → ficha técnica → descripción → **Menú** →
Itinerario → …

**Cómo lo aplicamos:** mover una línea. Es literalmente reordenar dos JSX.

**Vale la pena decirle que tiene razón:** el menú es el diferenciador que
ningún competidor tiene (cocina flotante, plato a elección) y hoy está tercero
en la lista, después de dos bloques que cualquier OTA también tiene. Subirlo es
una mejora de conversión, no un capricho.

**Conflicto a resolver:** el slide 16 pide meter el **comparador Premium** (§2)
justo antes del menú, y el slide 11 pide subir el menú antes del itinerario.
Combinando ambos, el orden final sería:
mosaico → ficha técnica → descripción → **comparador Premium** → **Menú** →
Itinerario → Incluye → tabla → reels → opiniones → FAQ.
Eso deja «Qué llevar» (que en el slide 16 estaba encima del comparador) sin sitio
claro — hoy vive dentro de `IncluyeTour`. Funciona, pero conviene confirmarlo.

**Archivos:** `pages/tour.tsx`, `components/tour/anclas-ficha.tsx` (el nav de
anclas tiene que seguir el mismo orden o se desincroniza).
**Esfuerzo:** trivial. **Riesgo:** bajo — pero **no olvidar `anclas-ficha.tsx`**.

---

## §13 — Slide 8: el premio, más grande; las rayitas, fuera

**Cliente:** dos cosas en una slide.
1. Sobre el eyebrow «🏅 #1 EN TRIPADVISOR · 7 AÑOS»: *«Destacar mucho más ese
   mensaje, es un logro que hay que destacar»*.
2. Sobre la fila de ficha técnica: *«Muchas rayitas separadoras, eliminarlas o
   con algún fondo tipo glasforissmo»* [glassmorphism].

**Estado en el repo:**
1. Ese eyebrow **subió ahí el 2026-07-22 por petición de Samuel**
   (`cabecera-ficha.tsx:33-46`: «lo de #1 en TripAdvisor ponlo arriba del
   título, no al final del hero»). O sea: el cliente está pidiendo **más** de lo
   que Samuel ya hizo — es 2ª vuelta sobre algo entregado, no una petición
   nueva.
2. `datos-tour.tsx` usa «rejilla de columnas iguales con hairline entre ellas»
   (4 columnas separadas por líneas verticales) + `border-t`/`border-b`. En la
   captura del cliente eso son 5 líneas en una franja de 60px de alto. **Tiene
   razón: se ve rayado.**

**Cómo lo aplicamos:**
1. El eyebrow pasa de texto pequeño con icono a **insignia con peso real**:
   fondo propio, tipografía mayor, el laurel de verdad. Ya existe
   `ui/insignia-confianza.tsx` — reutilizar antes de dibujar otra cosa. Sin
   pasarse: es el hero, y hay diagnóstico documentado de «hero cargado» en
   `hispaniola.md`. Si esta insignia crece, **algo de al lado tiene que
   encogerse** — probablemente las dos insignias con tooltip.
2. Quitar los hairlines verticales y darle a la fila **un fondo continuo** —
   glass sobre el hero, o simplemente `bg-fondo-ficha` con radio. Recomendación:
   **fondo sólido suave, no glass.** El glass en esta base de código tiene
   historial: `29cebf4` («el minificador se comía backdrop-filter»), un bug que
   solo se veía en producción. Meter glass nuevo es reabrir esa puerta a cambio
   de nada — el problema del cliente son las líneas, no la falta de
   transparencia. Si Samuel quiere glass igualmente: **no escribir el
   `-webkit-` a mano** (ver Aprendizajes).

**Archivos:** `components/tour/cabecera-ficha.tsx`,
`components/tour/datos-tour.tsx`, `components/ui/insignia-confianza.tsx`.
**Esfuerzo:** trivial · trivial. **Riesgo:** ninguno · bajo.
**Duda para Samuel:** ¿fondo sólido (recomendado) o glass?

---

## §14 — Slide 12: «este tour solo es premium, hay que ver colores premium»

**Cliente:** recuadro amarillo sobre la ficha de **charter privado** (US$ 625
por grupo, selector Maite/GrandMa/Santa María/Forever Teresa).

**Estado en el repo:** el charter no tiene Light/Premium — tiene selector de
bote y tabla de precios por pax. Su piel es la misma de los otros tours.

**Cómo lo aplicamos:** con los tokens `--color-premium-*` de §2 ya creados,
esto es aplicar la piel a los bloques de la ficha de charter: cabecera, tabla de
precios, menú a medida, paquetes de comida de §8. Un flag `esPremium: true` en
`FICHAS['charter-privado']` que las secciones leen.

### 📞 REUNIÓN 07-24 — el alcance se recorta bastante (14:03–14:50, 25:03–25:16)

Samuel hizo en la reunión exactamente la pregunta que este plan dejaba abierta
(14:03): *«cuando te refieres a que el premium tenga colores como negros de lujo,
¿te refieres solamente al selector o a toda la página? Si es como cargarla
mucho»*.

Respuesta de Miguel (14:45): *«él quiere mucho contraste [en] el premium»* — y
Samuel aterriza (14:50): *«el selector, que cuando está en Premium se vea un
colorcito diferente»*.

Y más adelante, sobre el charter, se cierra del todo (25:03–25:16). Samuel:
*«¿aquí serían los colores solamente lo de la derecha?»* → Miguel: *«no, no…
siempre [lo] derecho»* → Samuel: *«de toda la página, lo de la derecha. Sí, [toda
la página] es demasiado»*.

> ✅ **La piel oscura/lujo es la COLUMNA DERECHA — el widget de reserva.**
> No la ficha entera, ni la cabecera, ni la tabla de precios, ni el itinerario.
> Eso **deroga** la propuesta de este §14 («cabecera + tabla + menú + paquetes»).

**Lo que SÍ sigue siendo oscuro, porque el cliente lo dibujó así y lo confirmó
de viva voz:**
- El **comparador Light vs Premium** (§2) — Samuel (26:40): *«los light que estén
  clarito y lo premium que esté oscuro»*, Miguel: *«sí»*.
- El **bloque de menú Premium** (§3) — slides 18/19, sin contradicción en la
  reunión.
- El **widget** cuando está en Premium (§1) — que es el núcleo de la petición.

**Qué queda entonces de §14:** el charter privado **no** se repinta entero. Lo que
aplica es lo mismo que a los demás tours: su widget en piel premium. La frase del
slide 12 («este tour solo es premium») se resuelve en el **copy** —decir que el
charter no tiene versión Light, que ya es premium por definición— no en la piel
de la página.

Esto **baja el riesgo de este apartado de «medio» a bajo** y elimina la duda del
desbordamiento: el modo premium no puede desbordarse si vive en una sola columna.

**Archivos:** `components/tour/widget-reserva.tsx`, `data/tours.ts`,
`tokens.css`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo (antes medio). **Riesgo:** bajo (antes medio).

---

## Resumen de dependencias

| § | Depende de | Bloqueado por el cliente |
|---|---|---|
| 1 | — | **no** — decidido (opción A) + mecánica aclarada en la reunión |
| 2, 3 | tokens `--color-premium-*` | fotos de platos en alta (§3) |
| 4 | §2 (comparte el array de ventajas) | **el «129»** — sigue sin verificar |
| 5 | — | ~~la carta infantil~~ → **casi no**: está en la web del cliente; falta confirmar el tope de edad |
| 6 | §5 (las tarifas) | solo el **tope de edad** (7 sin confirmar) |
| 7 | — | **sí — el tarifario del charter normal por escrito** + ¿5+5+5 acumulables? |
| 8 | — | **se muda al plan 03** (los paquetes viven en Eventos) |
| 9 | §1 (subir `paquete` a la página) | no |
| 10 | §3 | **fotos de platos en alta** — a ancho completo se nota mucho más |
| 11 | — | **sí — los videos del responsable explicando cada tour** |
| 12 | §2 (decidir el orden final) | no |
| 13 | — | no |
| 14 | §1 | **no** — reducido a «el widget en piel premium» |

**Se puede empezar hoy sin preguntar nada al cliente:** §12, §13, §9, §14,
§1 completo (la mecánica ya está aclarada), §2 y §3 con las fotos actuales, y
**§5/§6 en cuanto se extraiga la carta infantil de la web en vivo**. Eso ya es
el corazón de la corrección — y con la reunión es bastante más de lo que era.

## 📞 Lo que la reunión añadió y no estaba en ningún §

- **Saona no lleva selector de menú** — la comida es buffet (09:29). Afecta a
  §3 y §5: esa ficha se describe distinto.
- **El add-on de langosta multiplica por todas las personas del barco**
  (US$ 30 × pax, 08:14). Regla de cálculo para el funnel, no para la ficha.
- **El semi-privado no admite niños** (03:09). Dato de negocio que el repo no
  tenía y que decide dónde se pinta el stepper de tramos.
- **Los tramos de precio del charter se justifican por normativa de tripulación
  mínima** (07:06). Es copy, y bueno.
