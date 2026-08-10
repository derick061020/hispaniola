# Plan de correcciones v2 — PÁGINA NUEVA: POR QUÉ RESERVAR CON NOSOTROS

> Fuente: slides 50–56 del PDF.
> Cruzado con: `pages/reserva-directa.tsx`,
> `components/reserva-directa/comparacion.tsx`,
> `components/reserva-directa/cabecera-reserva-directa.tsx`,
> `components/home/boleto-reserva.tsx`, `components/home/why-direct.tsx`,
> `components/tour/comparador-strip.tsx`, `components/home/premios.tsx`,
> `data/home.ts` (`STATS`), `App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR — no es una página nueva: es una página existente que hay que llenar

**Cliente:** slides 50 y 51: la insignia amarilla **«¿POR QUÉ RESERVAR CON
NOSOTROS? PRESIONE AQUÍ»** (un asset de la web actual, superpuesto al hero de
eventos) con la nota *«Pagina nueva dedicada al contenido de si hacen clic en
ese logo»*. Slides 52–56: la maqueta de esa página.

**Estado en el repo: la página YA EXISTE.** `/reserva-directa`
(`pages/reserva-directa.tsx`), con `<Meta titulo="¿Por qué reservar directo?">`
— literalmente el mismo título. Pero está **casi vacía**: hero + dos boletos
comparativos (`BoletoReserva` variante `portal` vs `directo`) + un botón. Son
30 líneas de página y 26 de componente.

Y hay una nota en el código que explica por qué está así
(`comparacion.tsx:4-7`): *«el argumento no es un destino [de menú] — vive como
módulo en home + ficha + checkout, y como página de soporte solo para "ver
comparación →" y el footer»*.

**El cliente está pidiendo revertir esa decisión**: quiere que sí sea un destino
con contenido propio, porque en su web actual la insignia amarilla es un enlace
destacado que la gente pulsa. Es razonable — y su maqueta es buena.

Las 5 secciones que pide:
1. Hero con **4 KPIs** y CTA (§1).
2. **Desglose «lo que pagarías suelto» vs nuestro precio** (§2) ← la mejor idea.
3. Tabla **«Nosotros vs. los otros tours»** (§3).
4. **«19 razones para elegirnos»** (§4).
5. Cierre con ubicación (§5).

---

## §1 — Slide 52: el hero

**Cliente:** fondo navy, eyebrow **«POR QUÉ RESERVAR CON NOSOTROS»**, H1
**«Reserva directo. Recibe más.»**, lead *«Somos el **propietario**, no un
intermediario. Eso significa mejor servicio y mejor precio — sin comisiones que
se coman tu experiencia.»* + 4 KPIs (**302.997** clientes felices · **4466** días
navegando · **#1** en TripAdvisor · **4,9** 1.782 reseñas) + CTA «Reservar mi
tour» + letra pequeña «Cancela gratis · Reserva ahora, paga después».

**Estado en el repo:** `CabeceraReservaDirecta` (20 líneas) ya es el hero, dentro
de `HeroInterna`. Los KPIs no están en esta página pero sí existen: `STATS` en
`data/home.ts`.

### ⚠️ Aquí hay un problema de datos serio

Los KPIs de la maqueta **no cuadran con los del repo**:

| Dato | Maqueta del cliente | `STATS` en el repo |
|---|---|---|
| clientes | **302.997** | **91.607** |
| días navegando | **4466** | **4.454** |

Y esto **no es nuevo**: en la auditoría del 2026-07-13 ya se encontró que
`why-book-with-us.php` de la web del cliente **se contradice a sí misma** —
«90.498 clientes / 1.336 días» en el encabezado y «301.661 / 4.456» en el
párrafo (registrado en Pendientes de `hispaniola.md`). Es decir: el cliente tiene
**dos pares de cifras incompatibles en la misma página desde antes**, y su
maqueta ha tomado el par grande, mientras el repo tomó el chico.

302.997 clientes en 4.466 días = **68 clientes al día, todos los días, 12 años
seguidos**. Con barcos de 20 pax, eso son 3-4 salidas llenas diarias sin fallar
un día. Es posible si se cuentan todos los barcos y todos los productos, pero
**la diferencia de 3,3× entre las dos cifras significa que una de las dos está
mal, y hay que saber cuál antes de ponerla en una página cuyo argumento entero es
la confianza.**

Poner 302.997 en una página nueva mientras la home dice 91.607 es peor que
cualquiera de las dos por separado. **Esto hay que preguntarlo antes de
construir nada aquí.**

**Cómo lo aplicamos:** el hero se amplía con la fila de KPIs (patrón ya resuelto
en `components/home/premios.tsx`), con **una sola** fuente de cifras: `STATS`.
Si el cliente confirma las grandes, se actualiza `STATS` y cambian en todo el
sitio a la vez — no dos verdades.

### 📌 Con la política del 07-27, esto tampoco bloquea — pero con un matiz

La escalera dice «lo que esté en la web original, se extrae de ahí». **Aquí la
web original da las dos cifras a la vez** — es el caso raro en que la fuente de
verdad se contradice a sí misma, detectado ya en la auditoría del 2026-07-13.

**Regla para construir:** se usa **`STATS` tal como está en el repo** (91.607 /
4.454), que ya se extrajo de la web original en su día. **No se sube a las cifras
grandes de la maqueta** sin confirmación: cambiarlas afectaría a la home, al hero
y al SEO a la vez, y multiplicar por 3,3 los clientes de una empresa es
exactamente el tipo de cambio que no se hace «provisionalmente».

Así la página se construye hoy, con **una sola verdad en todo el sitio**, y si
Fernando confirma las grandes se cambia en `STATS` y se propaga sola. Lo que **no**
se hace es pintar 302.997 aquí mientras la home dice 91.607 — eso es peor que
cualquiera de las dos.

**Archivos:** `components/reserva-directa/cabecera-reserva-directa.tsx`,
`data/home.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo para construir; **alto para publicar** hasta
que Fernando zanje las cifras.

---

## §2 — Slide 53: «lo que pagarías suelto» — la mejor idea del PowerPoint

**Cliente:** sección **«No somos los más baratos. Pero recibes exactamente lo que
pagas.»** con una tarjeta de desglose:

| Concepto | Suelto |
|---|---|
| Charter 4 h (bebidas + picadera) | US$ 75 |
| Semi-privado | US$ 30 |
| Almuerzo de mariscos | US$ 50 |
| Bebidas de marca | US$ 10 |
| Coco Loco | US$ 5 |
| Fotos del tour | US$ 20 |
| **Precio suelto** | **~~US$ 190~~** |
| **Nuestro precio · todo incluido** | **US$ 114** |
| | *Reservando directo te ahorras US$ 76* |

**Estado en el repo:** no existe. Lo más cercano es `BoletoReserva`, que compara
«portal» vs «directo» en condiciones (depósito, menú, WhatsApp, reembolso) pero
**no desglosa el valor en dinero**.

**Por qué esta sección vale la pena de verdad:** es la respuesta al hallazgo
central de la auditoría de competencia — *«Viator vende el mismo tour al mismo
precio ($114) → falta bloque "why book direct"»* (`hispaniola.md`, 2026-07-11).
El sitio lleva desde el principio con ese hueco: se dice «reserva directo» pero
nunca se demuestra **en dinero** por qué. Esta tarjeta lo demuestra. Y encaja con
el posicionamiento premium («no somos los más baratos») en vez de pelear por
precio.

**Cómo lo aplicamos:** componente nuevo `desglose-valor.tsx` con los conceptos
en `data/home.ts`. La suma se calcula en código, no se escribe a mano — si un
concepto cambia, el total y el ahorro se recalculan solos. La aritmética de la
maqueta cuadra: 75+30+50+10+5+20 = 190; 190−114 = 76. ✔

**Un aviso de honestidad:** los 6 importes «sueltos» son **precios de referencia
del mercado**, no facturas. Si alguien los audita y descubre que el «almuerzo de
mariscos US$ 50» es generoso, el argumento se vuelve en contra. Conviene: (a) que
Fernando confirme que cada importe es defendible, y (b) una línea de letra
pequeña del tipo «precios de referencia de servicios equivalentes en la zona» —
que además es más creíble que una cifra desnuda.

**Archivos:** `components/reserva-directa/desglose-valor.tsx` (nuevo),
`data/home.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** medio (defensibilidad de los importes).
**Duda para Samuel:** ¿los 6 importes son defendibles? ¿Y esta tarjeta va también
en la ficha de tour, donde se decide la compra? (Yo la pondría en las dos.)

---

## §3 — Slide 54: tabla «Nosotros vs. los otros tours»

**Cliente:** tabla de 3 columnas (concepto · Hispaniola · Otros tours):
mariscos *frescos del día* vs *congelados* · bebidas de marca *sin diluir* vs
*diluidas* · traslado *bus con A/C* vs *vehículo abierto* · **cocina a bordo**
(fila vacía en las dos columnas de su maqueta) · fotos del tour *incluidas* vs
*cobradas aparte* · reserva *directa con el dueño* vs *intermediario*.
Debajo, banda coral: **«Cada día que lo piensas, se llenan plazas»** + «Ver
disponibilidad».

**Estado en el repo:** el patrón de comparación existe (`BoletoReserva` y
`comparador-strip.tsx` en la ficha), pero no como tabla concepto-a-concepto.

**Cómo lo aplicamos:** tabla real (`<table>`, accesible, con scroll horizontal
propio en móvil — regla del proyecto: el contenido ancho hace scroll dentro de su
contenedor, la página no). Datos en `data/home.ts`.

**Dos avisos:**

1. **La fila «cocina a bordo» está vacía en su propia maqueta.** Es un descuido
   de la IA, y da igual: el valor lo pone «✔ única cocina flotante de Punta Cana»
   vs «✘ comida recalentada» — que es el argumento más fuerte que tiene la
   empresa. Hay que rellenarla, no copiarla vacía.

2. **La banda «Cada día que lo piensas, se llenan plazas» es un patrón de
   urgencia**, y este proyecto ya tuvo esta discusión: en la v1 se implementaron
   patrones de urgencia y quedaron marcados como **duda de tono abierta** contra
   el posicionamiento premium (`EJECUTADO.md`, punto 3). Además `PruebaSocial` en
   la home ya hace algo así y está marcado como *«datos de EJEMPLO»*.
   Aquí es más suave que «solo quedan 2 fechas» (no afirma un número, así que no
   miente) pero apretar urgencia justo en la página cuyo argumento es «no somos
   los más baratos, somos los que te tratan bien» es contradictorio. Sugerencia:
   sustituir por el cierre del slide 56 («Nos vemos en la playa»), que dice lo
   mismo en el registro correcto.

**Archivos:** `components/reserva-directa/tabla-comparativa.tsx` (nuevo),
`data/home.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo (técnico) / medio (tono de la urgencia).
**Duda para Samuel:** ¿mantenemos la banda de urgencia o la cambiamos?

---

## §4 — Slide 55: «19 razones para elegirnos»

**Cliente:** grid de 19 cards, eyebrow «TODO LO QUE INCLUYE RESERVAR CON
NOSOTROS», lead *«No es marketing — es lo que vive cada uno de nuestros
huéspedes.»* Las 19: mariscos frescos nunca congelados · solo bebidas de marca ·
plataforma de cocina certificada · semi-privado de verdad · barcos limpios y bien
mantenidos · fácil subir y bajar · baños limpios a bordo · la mejor ubicación ·
sin mareos para toda la familia · en el centro de la zona hotelera · traslados en
bus con A/C · snorkel en vivero de coral · fotos incluidas gratis · legal y
asegurada · respetuoso con el medio ambiente · salario justo a nuestro personal ·
equipo multilingüe · excursión de medio día · reserva directa con el dueño.
Cierra con banda verde **«Todo esto, por US$ 114 - todo incluido»**.

**Estado en el repo:** disperso. `INCLUYE_CRUCERO` (home), `FICHAS[].incluye`
(ficha), `STATS`, `EcoFriendly`, `why-direct.tsx` — cada trozo dicho en un sitio.
Casi todas las 19 razones ya están escritas en alguna parte.

**Cómo lo aplicamos:** grid de 19 en `data/home.ts`.

**Pero hay que decirle algo sobre esto, porque tiene un precedente directo:** en
la v3 se **eliminó** la sección «Diferenciadores» de la home con este razonamiento
(`pages/home.tsx:22-29`): *«sus 4 verdades ya se decían todas antes […] y su
número editorial gigante repetía el de IncluyeCrucero justo encima»*. Y en el
diagnóstico del hero cargado quedó el principio general: *«un hero cargado casi
siempre es N lenguajes de "confianza" compitiendo + el mismo mensaje repetido →
una prueba por trabajo»*.

**19 cards seguidas es exactamente eso, en formato lista.** Nadie lee 19 razones;
se ven como un muro y se saltan. Y varias se solapan («la mejor ubicación» / «en
el centro de la zona hotelera» son la misma; «sin mareos» es consecuencia de la
ubicación).

Dos formas de hacerlo bien:
- **(a) Agrupar** en 5-6 bloques temáticos (Comida · Barco y comodidad ·
  Ubicación · Precio y reserva · Personas y planeta), cada uno con sus razones
  dentro. Se conservan las 19 (el cliente las quiere todas) pero se pueden leer.
- **(b) Las 19 tal cual**, en grid denso, aceptando que es un muro de refuerzo
  que se escanea, no se lee.

**Recomiendo (a).** Es más trabajo de redacción y ninguno de código, y le da al
cliente sus 19 razones sin la pared. La página ya tiene 4 secciones de argumento
antes de esta.

**Archivos:** `components/reserva-directa/razones.tsx` (nuevo), `data/home.ts`,
`dev/dev-registry.ts`.
**Esfuerzo:** bajo (b) / medio (a, por la redacción).
**Riesgo:** bajo. **Duda para Samuel:** ¿(a) agrupadas o (b) las 19 seguidas?

---

## §5 — Slide 56: el cierre

**Cliente:** tres piezas. Banda verde reusando el copy de cierre de
sostenibilidad («Dejar una huella positiva»). Bloque **«UBICACIÓN, UBICACIÓN,
UBICACIÓN — El mejor punto de la costa, sin viajes eternos»**: *«Te llevamos a
Cabeza de Toro, un parque natural en las aguas cristalinas del Cabo Engaño […]
Y estamos en el centro de la zona hotelera, así que no pierdes 1½ h en bus antes
de empezar.»* Y cierre navy **«Nos vemos en la playa»** + «Reservar mi tour» +
letra pequeña «Legal y asegurada · todas las licencias turísticas de Punta
Cana-Bávaro».

**Estado en el repo:** «Cabeza de Toro» y el vivero de coral se mencionan
(`arrecife-teaser.tsx`, `EXPERIENCIA_ABORDO`) pero **el argumento de ubicación
como ventaja competitiva no está dicho en ninguna parte**. Es contenido nuevo y
bueno: «no pierdes hora y media en bus» es una objeción real de comprador que hoy
nadie contesta.

Ojo: la maqueta dice «Cabo Engaño» y el repo dice «Cabeza de Toro» — en su propio
texto conviven los dos («Cabeza de Toro, un parque natural en las aguas
cristalinas del Cabo Engaño»). Coherente, pero hay que fijar el vocabulario.

**Cómo lo aplicamos:**
- El bloque de ubicación: zigzag imagen+texto, patrón de
  `recorrido-sostenibilidad.tsx`. Necesita **una foto o dron de Cabeza de Toro**
  (su maqueta la pide explícitamente: «Foto/dron: Cabeza de Toro · Cabo Engaño»).
  Puede que sirva una del archivo existente.
- La banda verde de «huella positiva» **no se repite aquí** — es literalmente el
  `cierreTexto` de `/sostenibilidad`. Se enlaza a esa página en vez de copiar el
  párrafo. Duplicar copy entre dos páginas es malo para SEO y peor de mantener.
- «Nos vemos en la playa» como cierre: sí, y sustituye a la banda de urgencia
  del §3.
- «Legal y asegurada · todas las licencias turísticas»: contenido nuevo y fácil.
  Confirmar que es verdad y se puede afirmar.

**Archivos:** `components/reserva-directa/ubicacion.tsx` (nuevo),
`components/reserva-directa/cierre.tsx` (nuevo), `data/home.ts`,
`public/fotos/`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.
**Duda para Samuel:** ¿tenemos una foto aérea de Cabeza de Toro o se pide?

---

## 📞 REUNIÓN 07-24 — el propósito de la página cambia el diseño (32:42–34:14)

Tres cosas que reencuadran este plan entero:

**1. La insignia tiene que LEERSE como botón.** Samuel lo dice él mismo (32:58):
*«yo [le pongo] iconitos, porque no parece un botón — o sea, es un botón, pero
me costó a mí entender que es un botón»*. Miguel está de acuerdo. Es decir: el
problema del asset original no es solo estético, **es de affordance**. Al portar
su *función* (que es lo que este plan recomienda, no copiar el sello amarillo)
hay que asegurarse de que se vea clicable — con icono, no solo con color.

**2. No es una página para retener, es una página de paso.** Miguel (33:30):
*«pues un poco la justificación… **no es tampoco para que la gente se vaya mucho
ahí**, pero sí que, si lo pinchan, que sepan por qué»*. Y remata (33:52):
**«sobre todo que vaya directamente, que haya mucho botón que vaya a la pestaña
de Tours»**.

> Eso cambia el criterio de §4 (las 19 razones). Una página que **no** quiere
> retener no debería abrir con un muro de 19 cards. Refuerza mi recomendación
> **(a) agrupadas** — y aún más: probablemente lo correcto es **agrupar y
> resumir**, con CTAs a Tours intercalados cada sección, no al final.

**3. Y por lo mismo, la banda de urgencia del §3 pierde el argumento en contra.**
Este plan proponía quitarla por chocar con el posicionamiento premium. Sigue
siendo verdad — pero el cliente pide explícitamente **muchos botones hacia
Tours**, así que lo que hay que multiplicar son los **CTA**, no la urgencia. Se
puede darle lo que pide (más salidas a Tours) sin meter presión falsa: la banda
se sustituye por un CTA limpio, repetido, sin contador ni escasez inventada.
**Eso satisface la petición literal y el guardarraíl a la vez.**

---

## La decisión de arquitectura que hay que tomar primero

Esta página crece de 30 líneas a ~6 secciones. Eso choca con la nota de
`comparacion.tsx` («el argumento no es un destino de menú, vive como módulo»).

Tres consecuencias que hay que resolver **antes** de escribir código:

1. **¿Entra en el menú?** El menú nuevo del slide 20 **no la lista**. Hoy se
   llega desde el footer y desde «Ver comparación →» de la ficha. Si el cliente
   quiere que la gente la encuentre (que es lo que la insignia amarilla hace en su
   web), necesita entrada — probablemente en «Ayuda» o como enlace destacado en
   la ficha de tour. **Merece preguntárselo: la insignia amarilla en su web está
   en el hero, no en un menú.** Quizá lo que quiere es reproducir esa insignia.
2. **¿Se solapa con `why-direct.tsx` de la home?** La home ya tiene su módulo de
   «por qué directo» con los dos boletos. Con la página llena, el módulo de la
   home debería quedarse como **teaser** («Ver las 19 razones →») en vez de
   contar la mitad del argumento. Si no, se dice dos veces.
3. **¿Y la insignia amarilla?** El asset original («¿POR QUÉ RESERVAR CON
   NOSOTROS? PRESIONE AQUÍ», sello amarillo sobre foto) es de la estética de la
   web vieja y choca de frente con «B Charter Premium». **No se copia el asset**
   — se copia su **función**: un enlace visible y persistente a esta página desde
   el hero o desde la ficha. Mismo criterio que con el resto de assets de la web
   vieja.

**Duda para Samuel:** las tres.

---

## Resumen: qué se puede hacer ya

| Trabajo | ¿Bloqueado? |
|---|---|
| Tabla «nosotros vs. otros» (§3) | **no** |
| Las 19 razones (§4) | **no** (decidir agrupadas o no) |
| Bloque de ubicación (§5) | casi — falta la foto de Cabeza de Toro |
| Cierre + licencias (§5) | **no** — confirmar que se puede afirmar |
| Hero con KPIs (§1) | **sí — hay que zanjar 91.607 vs 302.997** |
| Desglose de valor (§2) | casi — confirmar los 6 importes |

**Esta es la página con mejor ratio de la tanda:** casi todo se puede construir
ya, el contenido es casi todo texto (que el cliente ya escribió), y cierra un
hueco que la auditoría detectó el primer día. **Recomiendo hacerla pronto**, en
cuanto se aclaren las cifras.
