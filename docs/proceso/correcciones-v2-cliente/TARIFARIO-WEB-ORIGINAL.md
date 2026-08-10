# Tarifario extraído de la web original — fuente canónica de precios v2

> Extraído el **2026-07-27** de hispaniolaaquaticadventures.com (`?lang=en`).
> **Método (doble verificación, como pidió Samuel):**
> 1. `curl` del HTML crudo de las 4 páginas → texto plano → extracción de cifras.
> 2. Render en Chrome + capturas de las tablas de tarifas → contraste visual fila a fila.
> 3. Donde existe, cotejo contra el **JSON-LD** (`application/ld+json`) embebido.
>
> Las tres vías coinciden en todo lo que sigue. **Donde no coinciden, está marcado.**

## ⚠️ Lo primero: el modelo de precio NO es el que asumía el plan

El plan 01 §7-bis daba por hecho un modelo **marginal/acumulativo** (base + incremento
por persona extra). **Es incorrecto para tours.** La web original usa
**sustitución de tramo**:

> Según en qué tramo caiga el **total** de personas, se aplica **ese** tramo y
> **solo** ese. Un tramo es de una de estas dos naturalezas:
> - **`per Group`** → precio **plano**, no se multiplica por personas.
> - **`per Person`** → precio **× TODAS las personas**, no solo las que exceden.

Ejemplo real (Maite): 8 personas → **US$ 625** (plano). 9 personas → **9 × 99 =
US$ 891**. La persona nº 9 no cuesta 99: hace saltar toda la reserva a otro tramo.

**El modelo marginal SÍ es el correcto para los EVENTOS** (party boat y bodas),
que sí son «base fija 1–12 + tanto por persona extra». Son dos motores distintos
y el widget tiene que soportar los dos.

---

## 1. Charter privado — `private-catamaran-snorkeling-excursion-puntacana.php`

**5 tarifas** (4 barcos, y el Forever Teresa con dos duraciones).

### Private Cruise Maite — aprox. 4 h · «from US$ 599.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 8 | per Group | US$ 625.00 | **+ US$ 25.00 p/persona (comida)** |
| 9 – 20 | per Person | US$ 99.00 | — |

Horarios: 09:00–13:00 · 14:00–18:00
Almuerzo: *Premium menu, 1 plato por persona: Seafood, meat, Surf & Turf o vegetariano.*

### Private Cruise GrandMa — aprox. 3 h · «from US$ 825.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 12 | per Group | US$ 900.00 | — |
| 13 – 50 | per Person | US$ 75.00 | — |

Horarios: 09:00–11:55 · 15:00–18:00
Almuerzo: *Menu 3 hours plated hasta 20 pax; chicken, beef y shrimp skewers de 21 pax en adelante.*

### Private Cruise Santa Maria — aprox. 4 h · «from US$ 1,150.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 13 | per Group | US$ 1,000.00 | **+ US$ 25.00 p/persona (comida)** |
| 14 – 45 | per Person | US$ 99.00 | — |

Horarios: 09:00–12:55 · 14:00–18:00
Almuerzo: *Menu premium plated hasta 20 pax; menu premium skewers de 21 pax en adelante.*

### Private Cruise Forever Teresa — **3 h** · «from US$ 1,750.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 18 | per Group | US$ 1,600.00 | — |
| 19 – 25 | per Person | US$ 85.00 | — |
| 26 – 29 | per Group | US$ 2,225.00 | — |
| 30 – 120 | per Person | US$ 75.00 | — |

Horarios: 09:00–12:00 · 15:00–18:00
Almuerzo: *Menu 3 hours plated hasta 20 pax; menu package #3 skewers de 21 pax en adelante.*

### Private Cruise Forever Teresa — **4 h** · «from US$ 1,825.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 18 | per Group | US$ 1,600.00 | **+ US$ 25.00 p/persona (comida)** |
| 19 – 25 | per Person | US$ 110.00 | — |
| 26 – 28 | per Group | US$ 2,775.00 | **+ US$ 25.00 p/persona (comida)** |
| 29 – 120 | per Person | US$ 99.00 | — |

Horarios: 09:00–12:55 · 14:00–18:00
Almuerzo: *Menu premium plated hasta 20 pax; menu premium skewers de 26 pax en adelante.*

**Nota al pie de la página:** *«Please note that Lobster may not be available during
the months of March till June, from which we will replace the option by wild prawn.»*
→ Es un dato honesto y concreto que hoy no está en el sitio nuevo. Merece portarse.

---

## 2. Saona — `private-saona-island-excursion.php`

**3 tarifas.** Confirma lo dicho en la reunión: **no hay menú a elegir, es buffet.**

> *«Lunch: Buffet consists of pasta salad with tomato and cucumber dressing,
> spaghetti with lobster, chicken, pork chops and…»*
> *«Optional add-on during check-out: **Lobster 30$US per person**»*

⚠️ Ojo: el add-on de langosta aparece aquí como **opcional y por persona**, no como
«×todas las personas del barco» que se entendió en la reunión (08:14). **La web
manda** — pero conviene confirmarlo, porque cambia el cálculo.

### Saona by Speed Boat — aprox. 8 h · «from US$ 855.00»
| Tramo | Tipo | Precio |
|---|---|---|
| 1 – 6 | per Group | US$ 1,100.00 |
| 7 | per Group | US$ 1,160.00 |
| 8 | per Group | US$ 1,220.00 |
| 9 | per Group | US$ 1,280.00 |
| 10 | per Group | US$ 1,340.00 |
| 11 – 25 | per Person | US$ 130.00 |

Horario: 09:30–16:00 · Ruta: Saona (Catuano) & Starfish Cay (Palmilla)

### Saona & Fishing Town — aprox. 8 h · «from US$ 945.00»
| Tramo | Tipo | Precio |
|---|---|---|
| 1 – 6 | per Group | US$ 1,200.00 |
| 7 | per Group | US$ 1,270.00 |
| 8 | per Group | US$ 1,340.00 |
| 9 | per Group | US$ 1,410.00 |
| 10 | per Group | US$ 1,450.00 |
| 11 – 25 | per Person | US$ 140.00 |

Horario: 09:00–17:00 · Ruta: Mano Juan Fishing Town, Playa Toro

### Saona by Catamaran — aprox. 8 h · «from US$ 1,755.00»
| Tramo | Tipo | Precio | Suplemento |
|---|---|---|---|
| 1 – 30 | per Group | US$ 1,950.00 | **+ US$ 45.00 p/persona (comida)** |
| 31 – 70 | per Person | US$ 105.00 | — |

Horario: 09:00–15:00

---

## 2-bis. Snorkel Lovers y Semi-privado — precio por persona

Los dos únicos productos **sin tramos**: precio plano por cabeza.

### Snorkel Lovers — `educational-snorkeling-for-snorkel-lovers.php`
*«Educational Snorkeling Lovers»* · **All ages welcome** · aprox. **4 h** ·
capacidad máx. **30** · *starting at US$ 103.00*

| Concepto | Precio |
|---|---|
| **Adults** | **US$ 114.00** |
| **Kids** | **US$ 65.00** |

**Un solo menú** («Hispaniola Menu»), sin Light/Premium:
Seafood · Meat · Surf & Turf · Vegetarian · Lasagna Chicken Breast ·
Lasagna Vegetarian · Seafood Cocktail · **Kid's Meal**

⚠️ **Dos correcciones a lo que se dedujo en la reunión:**
1. **No existe «niño premium a US$ 80».** Este tour no tiene Light/Premium — hay
   una sola tarifa de niño, **65**. El «+15 al niño» del meet (03:40) no tiene
   respaldo en la web.
2. **No hay tramos de edad ni bebés gratis en la web.** Solo dos categorías,
   *Adults* y *Kids*. Lo de «1–3 años no pagan» viene solo de la reunión → hay
   que confirmarlo con Fernando antes de programarlo.

### Semi-privado — `semi-private-snorkeling-catamaran-excursion-puntacana.php`

| Paquete | Precio | *Starting at* |
|---|---|---|
| **Hispaniola Premium Package** | **US$ 114.00** | *US$ 103.00* |
| **Hispaniola Light Package** | **US$ 99.00** | *US$ 84.00* |

- **Premium:** Seafood · Meat · Surf & Turf · Vegetarian · Lasagna Vegetarian ·
  Lasagna Chicken Breast · Seafood Cocktail
- **Light:** Chicken · Fish — *«grilled chicken breast o grilled fish filete,
  ambos con papas fritas y vegetales»*
- Los dos: *«podrás elegir el plato de cada pasajero durante la reserva online»*

✅ **Los 99 / 114 del repo son correctos**, y el **+US$ 15** del plan 01 §1 se
sostiene. Los 103 / 84 son «starting at» tras descuentos, igual que los «from
us$» del charter — **no se usan**.

### 🍔 El «Kid's Meal»: resuelto con la foto de su propia web

La web lo lista como una tarjeta más del menú, **sin descripción** (en su HTML
todas las descripciones de plato están comentadas). Pero **sí tiene foto propia**:
`images/food/kids_meal_new.jpg` (769×368, alt *«Punta Cana Kids Meal»*).

**Lo que se ve en la foto:** nuggets/tiras de pollo empanadas · hamburguesa ·
papas fritas · salchicha en rodajas · kétchup aparte.

Coincide con lo que Samuel recordaba en la reunión (11:00): *«una hamburguesa con
otras cosas»*. Es material del propio cliente, no inventado — pero **la redacción
del plato hay que confirmarla con Fernando**, porque describir comida a partir de
una foto es una lectura, no un dato declarado.

### 📸 Fotos de plato disponibles

> 🔧 **Corrección (2026-07-27).** En una versión anterior de este documento
> puse que estas fotos venían a **769×368** y que eran «más grandes que los
> thumbnails que el proyecto ya tenía». **Era falso**: lo medí con un lector de
> cabeceras JPEG escrito a mano que devolvía el alto y el ancho cambiados.
> Medidas de verdad (con PIL):
>
> - **13 de las 15 están a 368×224** — exactamente los thumbnails que el
>   proyecto ya tenía anotados como único material disponible. **No hay mejora.**
> - Solo `chicken.png` y `fish.png` están en alta (**740×519**).
>
> Es decir: **el plan 01 §3 y §10 siguen bloqueados por las fotos nuevas en
> alta**, y el §10 (galería de comida a ancho completo) es el que más lo sufre
> — a 368×224 una tira a ancho completo se ve reventada. La petición de fotos
> nuevas al cliente sigue siendo prioritaria, no opcional.

15 imágenes en `images/food/`:

`chicken.png` (740×519) · `fish.png` (740×519) · `kids_meal_new.jpg` ·
`lasagna-vegetarian.jpg` · `lasagna-with-chicken.jpg` · `meat-menu-3hours.jpg` ·
`meat-new.jpg` · `premium-skewers-new.jpg` · `seafood-cocktail.jpg` ·
`seafood-menu-3hours.jpg` · `seafood-new.jpg` · `skewers.jpg` ·
`surf-turf-new.jpg` · `vegi-new.jpg` · `floating_kitchen.jpg`

### Add-ons extra encontrados en el semi-privado

- **Álbum completo en alta por Dropbox: US$ 20 _por grupo_** *(«totally
  optional»)* — el único add-on por grupo y no por persona.
- **Fotógrafo profesional**: se puede añadir al paquete avisando con antelación.
  Sin precio publicado.

### 🐛 Un enlace roto en su web

`family-snorkeling-catamaran-excursion-puntacana.php` está enlazado **desde el
menú de todas las páginas** y devuelve **404**. No es cosa nuestra, pero conviene
avisar a Fernando.

---

## 3. Eventos — party boat y bodas (**tarifario idéntico**)

`events-party-boat-puntacana.php` y `weddings.php` tienen **exactamente los mismos
4 paquetes y los mismos precios**. La única diferencia es que bodas añade
**«Champagne toast»** a los incluidos comunes.

**Aquí sí es modelo marginal:** precio fijo de grupo 1–12 + tanto por persona extra.

| Paquete | Base (1–12 pers.) | Persona extra | Duración | Paradas |
|---|---|---|---|---|
| **Hispaniola Premium Package** | US$ 1,188.00 | US$ 99.00 | 4 h | — |
| **Package #I** | US$ 660.00 | US$ 55.00 | 3 h | 2 |
| **Package #II** | US$ 780.00 | US$ 65.00 | 3 h | 2 |
| **Package #III** | US$ 900.00 | US$ 75.00 | 3 h | 2 |

> 🔧 **Corrección al plan 01 §8:** decía «1–10 personas» para los Packages #I/#II/#III
> (leído del slide 13). La web original dice **1–12 para los cuatro**. Vale la web.

### Menús por paquete (literal de la web)

**Incluido en todos:** Transportation · Private Check-In Lobby · Floating Kitchen ·
Snorkeling Equipment · Photos (Facebook) · Underwater Photos (Facebook) · Wifi & AUX
port · Music & Dance · National Open Bar · Mamajuana Shots · Fruit Skewers (1p/p) ·
Mini Turkey & Cheese Croissant (1p/p) *(+ Champagne toast solo en bodas)*

| Paquete | Platos |
|---|---|
| **Premium** | Chicken Skewer (1p/p) · Beef Skewer (1p/p) · Shrimp Skewer (1p/p) · Shrimp Tempura (1p/p) · Fish Sticks · French Fries · **Lobster** |
| **#I** | Hot Dog (1p/p) |
| **#II** | Hot Dog (1p/p) · Chicken Skewer (1p/p) · Beef Skewer (1p/p) · French Fries |
| **#III** | Chicken Skewer (1p/p) · Beef Skewer (1p/p) · Shrimp Skewer (1p/p) · Shrimp Tempura (1p/p) · Fish Sticks · French Fries |

**Sustituciones vegetarianas** (acumulativas por paquete):
- **#I:** Cheese Croissant · Fruit Skewer
- **#II:** las de #I + Carrot & Cheese Quipé · Yuca & Cheese Ball
- **#III:** las de #II + Caprese Skewer · Quinoa Salad with Vegetables

---

## 4. 🚨 Las tres anomalías que hay que resolver ANTES de programar el motor

### A. No sabemos si el suplemento de comida entra en el total

**El precio que la tabla imprime es el de la fila, sin sumar nada.** Para el
Forever Teresa 4 h, 26–28 personas es **US$ 2.775** — eso es lo que dice la web y
es el dato. Lo que **no** dice la web es si el renglón pegado debajo
(`+ 25.00 US$ per person for meal`) se suma siempre, o es un extra que se elige.

Las dos lecturas son defendibles y **cada una arregla un problema y crea otro**,
así que no se puede deducir cuál es — hay que preguntarlo:

**Lectura A — el suplemento es obligatorio** (el precio de grupo cubre el barco,
la comida se cobra por cabeza):

| pax | Cálculo | Total | Δ |
|---|---|---|---|
| 18 | 1.600 + (25×18) | 2.050 | — |
| 19 | 19 × 110 | 2.090 | +40 ✅ suave |
| 25 | 25 × 110 | 2.750 | — |
| 26 | 2.775 + (25×26) | 3.425 | +675 |
| 28 | 2.775 + (25×28) | 3.475 | — |
| 29 | 29 × 99 | 2.871 | **−604 ❌ más gente, menos precio** |

**Lectura B — el suplemento es opcional y no entra en el total base:**

| pax | Cálculo | Total | Δ |
|---|---|---|---|
| 18 | 1.600 plano | 1.600 | — |
| 19 | 19 × 110 | 2.090 | **+490 ❌ por UNA persona** |
| 25 | 25 × 110 | 2.750 | — |
| 26 | 2.775 plano | 2.775 | +25 ✅ |
| 28 | 2.775 plano | 2.775 | — |
| 29 | 29 × 99 | 2.871 | +96 ✅ monótono |

Mismo dilema en **Saona by Catamaran** (suplemento de US$ 45): con lectura A,
30 pax = 1.950 + 1.350 = **3.300** y 31 pax = 31 × 105 = **3.255** → reversión de
−45. Con lectura B, 30 pax = 1.950 y 31 = 3.255, monótono pero con un salto de
+1.305 por una persona.

> ✅ **DECIDIDO (Samuel, 2026-07-27): el +25 / +45 es una COMIDA OPCIONAL.**
> No entra en el precio base. Se modela como add-on (`comidaOpcional`), se pinta
> como línea aparte en el desglose y solo suma si el usuario la elige. Es la
> **lectura B** de las tablas de arriba.

**Y esa decisión arregla todas las anomalías de precio.** Verificado tramo a
tramo: con la comida fuera del base, **las 8 tarifas quedan monótonas** — nunca
sale más barato contratar a más gente. Antes había dos reversiones (Forever
Teresa 4 h y Saona Catamaran); con lectura B desaparecen las dos.

### ⚠️ Efecto secundario a tener en cuenta en el widget: el «escalón»

Esto **no** es un choque entre productos — cada tarifa vive en su propio producto
y no se pisan. Es un efecto que le pasa **a cada tarifa por separado**, por cómo
funciona la sustitución de tramo.

**Qué ve el usuario.** Está en la ficha del **charter privado**, con el barco
*Forever Teresa (4 h)* elegido, y sube el contador de personas:

```
18 personas  →  US$ 1.600      (tramo 1–18, precio de grupo, plano)
19 personas  →  US$ 2.090      (tramo 19–25, per person: 19 × 110)
```

Una persona más y el total sube **US$ 490**. No es un error: al pasar de 18 a 19
la reserva deja de pagar «el barco» y pasa a pagar «por cabeza», y eso reprecia
a las 19, no solo a la nueva.

Lo mismo, aparte y sin relación, dentro de **Isla Saona** con la opción
*Catamarán*: de 30 a 31 personas el total va de **US$ 1.950 a US$ 3.255** —
**+1.305** por una persona.

**Por qué importa:** el visitante que sube el contador ve el precio casi doblarse
de golpe. Sin una explicación al lado, se lee como un fallo del widget y se
abandona la reserva. Miguel ya dio en la reunión (07:06) el argumento que lo
justifica: **a partir de cierto número hay que llevar más tripulación por
normativa**. Basta con decirlo en el momento del salto.

**Y una oportunidad, de paso:** con 19 personas, el *Santa María* sale a
19 × 99 = **US$ 1.881** — más barato que el *Forever Teresa 4 h*. Como el charter
ya tiene selector de barco, el widget puede **mostrar el precio de cada barco para
el número de personas elegido** en vez de obligar a probarlos uno a uno. Eso
convierte el escalón en una ayuda para elegir en vez de en una sorpresa.

### B. Los «from US$ …» no se derivan de sus propias tablas

| Barco | «from» | Tramo más barato real | ¿Cuadra? |
|---|---|---|---|
| Maite | 599.00 | 625.00 (grupo) | ❌ el «from» es **menor** |
| GrandMa | 825.00 | 900.00 (grupo) | ❌ menor |
| Santa Maria | **1.150.00** | **1.000.00** (grupo) | ❌ el «from» es **MAYOR** que su propio precio |
| Forever Teresa 3 h | 1.750.00 | 1.600.00 | ❌ mayor |
| Forever Teresa 4 h | 1.825.00 | 1.600.00 | ❌ mayor |

La nota dice que los «from» son *«after all applicable discounts: up to 5% repeat
guests | 5% early booking | 5% cash»*, pero **ninguno cuadra** aplicando esos
descuentos. Y Santa María es el caso claro: anuncia «desde 1.150» cuando su propio
tramo de grupo es 1.000.

→ **Decisión tomada para construir: los «from» NO se usan.** El precio de entrada
que muestre el sitio nuevo se **calcula desde el tarifario** (el mínimo real de la
tabla), no se copia. Es el mismo criterio que ya salvó el caso «desde $55» del
charter, que en realidad eran $75.

→ **PREGUNTA 2: ¿de dónde salen los «from»?** Si son cifras heredadas sin
fundamento, mejor saberlo antes de heredarlas nosotros.

### C. Los add-ons: resueltos

> ✅ **DECIDIDO (Samuel, 2026-07-27).** Los dos extras —**langosta US$ 30** y
> **comida opcional US$ 25 / 45**— funcionan igual:
> - **Precio por persona**, pero
> - **UI = un solo check**, fácil de pulsar y atractivo. Al marcarlo, suma
>   `tarifa × nº de personas` de la reserva. No hay selección comensal a comensal.
> - **Se tratan como UPSELL**, no como letra pequeña: es superficie de venta, con
>   el peso visual que eso merece.

> ✅ **AÑADIDO (Samuel, 2026-07-27): el álbum de fotos en alta también es upsell.**
> **US$ 20 por GRUPO** (no por persona) — es el único add-on de precio fijo.
> Condición explícita de Samuel: *«no debería estar siempre presente; debe
> mostrarse de forma llamativa en su momento, pero no invasiva»*.

```ts
type AddOn = {
  id: 'langosta' | 'comida' | 'album-fotos'
  etiqueta: string
  base: 'persona' | 'grupo'   // persona = × nº de personas · grupo = precio fijo
  precio: number
}
```

### Cuándo aparece cada add-on

No son la misma clase de venta y no deben aparecer en el mismo momento:

| Add-on | Qué es | Cuándo mostrarlo |
|---|---|---|
| **Langosta** · **Comida opcional** | Configuran la experiencia — el visitante los está decidiendo mientras arma su reserva | **En el widget, junto al resto de la configuración.** Son parte de «qué estoy comprando» |
| **Álbum de fotos** | Es un recuerdo, no parte del día. Se compra por emoción **después** de haber decidido ir | **Solo cuando la reserva ya está completa** (fecha + horario + personas elegidos), justo encima del CTA |

**Por qué el álbum no puede estar siempre visible:** mientras el visitante todavía
está formando el precio —subiendo el contador de personas, comparando barcos— un
extra de US$ 20 **compite con la decisión principal** y engorda un total que aún se
está evaluando. Aparecido al final, cuando la persona ya decidió ir, US$ 20 sobre
una reserva de varios cientos es un sí fácil. Es la posición clásica de *order
bump*, y encaja literalmente con el «en su momento» que pidió Samuel.

**Tres reglas para que no sea invasivo:**
1. **Nunca premarcado.** Un extra premarcado es un cargo que el usuario no pidió —
   patrón oscuro, y este proyecto los ha evitado sistemáticamente (mismo criterio
   que el anti bait-and-switch).
2. **Aparece una vez, con transición suave, y se puede descartar.** Si se descarta,
   no vuelve en esa sesión. Reaparece más adelante en el paso de pago del funnel,
   que es su segunda oportunidad natural.
3. **Precio fijo, dicho como tal**: «US$ 20 para todo el grupo». En un grupo de 20
   personas eso es US$ 1 por cabeza — el argumento se vende solo si se enseña así.

### ✅ DECISIÓN (Samuel, 2026-07-27): el álbum va en LOS SEIS productos

Aunque la web original solo lo ofrece en 2 (ver tabla abajo), **la política real
del negocio es uniforme**: las mejores fotos se suben gratis a su Facebook como
obsequio, y el **álbum completo en máxima calidad son US$ 20 por grupo**. Las
otras 4 páginas simplemente no lo tienen escrito.

→ El add-on se monta en **los 6**. Lo que está mal es la web del cliente, y
conviene que Fernando la unifique.

⚠️ **Pero el copy del charter tiene que ser distinto igual**, porque esa página
promete hoy *«**todas** las fotos… gratis»*. Ahí lo que se vende es **la máxima
calidad**, no «el álbum completo» — si no, contradecimos lo que ellos mismos
prometen en su propia web.

### ✅ DECISIÓN (Samuel, 2026-07-27): premarcado + mensaje al desmarcar

- **Aparece premarcado** (`porDefecto: true`).
- **Al desmarcarlo**, un mensaje que apela al recuerdo antes de confirmar.

**Copy propuesto para ese mensaje** (apelando a la emoción sin culpar — un tono
demasiado punitivo choca con «Charter Premium» y acaba en reseña):
> **«¿Seguro? Estas fotos no se repiten.»**
> *Las mejores quedan en nuestro Facebook, gratis. El álbum completo en máxima
> calidad —todas, sin recortar— son US$ 20 para todo el grupo.*
> `[ Quedármelo ]` · `[ No, gracias ]`

**Implementación: detrás de un flag, no cableado.**
```ts
// data/tours.ts o config
ALBUM_UPSELL = { porDefecto: true, mensajeAlDesmarcar: true }
```
Que sean dos booleanos y no código repartido por el widget importa por lo de
abajo: si algún día hay que desactivarlo, es una línea y no una refactorización.

> 🚩 **RIESGO REGISTRADO — decisión informada de Samuel, no un descuido.**
> Un extra de pago **premarcado** contraviene la Directiva 2011/83/UE art. 22, que
> exige consentimiento **expreso** para todo pago adicional y da al consumidor
> **derecho al reembolso** cuando el consentimiento se infiere de una casilla que
> hay que desmarcar. Es la norma por la que se sancionó a varias aerolíneas por el
> seguro de viaje premarcado. Punta Cana recibe mucho turismo europeo y **el cobro
> será real** en cuanto Odoo esté conectado, así que la exposición no es teórica:
> reembolsos y contracargos, cada uno más caro que los US$ 20.
> **Conviene que Fernando lo sepa antes de publicar.** Si algún día hay que
> corregirlo, la mitigación estándar es premarcar solo fuera de la UE — pero eso
> exige geolocalización, que hoy el sitio no tiene. Por eso el flag.

### El álbum en la web original solo aparece en 2 de los 6

Comprobado página a página (2026-07-27). Contexto de por qué se extiende a todos:

| Producto | Fotos gratis | Álbum Dropbox US$ 20 | Fotógrafo pro |
|---|---|---|---|
| **Semi-privado** | «los mejores momentos» → Facebook | ✅ **sí** | ✅ sí |
| **Charter privado** | «**todas** las fotos» → Facebook | ✅ **sí** | ❌ |
| **Snorkel Lovers** | «los mejores momentos» → Facebook | ❌ no | ❌ |
| **Party boat** | Photos + **Underwater Photos** → Facebook | ❌ no | ❌ |
| **Bodas** | Photos + **Underwater Photos** → Facebook | ❌ no | ❌ |
| **Saona** | ❌ **no se mencionan** | ❌ no | ❌ |

**El copy no puede ser el mismo en todos, porque no regalan lo mismo:**

| | Gratis | De pago (US$ 20 / grupo) |
|---|---|---|
| **Charter privado** | **todas** las fotos → Facebook | **solo la máxima calidad** |
| **Los otros 5** | *los mejores momentos* → Facebook | **el álbum completo, en máxima calidad** |

En el charter, vender «el álbum completo» sería **falso**: ya lo dan gratis. Ahí
lo único que se vende es la calidad del archivo. Por eso el texto del add-on es
un campo por producto, no una constante.

**Dos huecos que hay que preguntar, no rellenar:**
1. **Saona no menciona fotos en ninguna parte.** ¿No las incluye —es un producto
   operado distinto, full day desde Bayahíbe— o es un olvido de su web? No darlo
   por incluido ni por excluido.
2. **Party boat y bodas incluyen fotos subacuáticas** y ningún otro producto las
   lista. Es un incluido diferencial que hoy no está en nuestras landings de
   evento — conviene portarlo, y de paso confirmar si también aplica a los tours.

### ⚠️ El choque que hay que resolver en el copy

**Las fotos ya están incluidas gratis**, y eso el sitio lo usa como argumento de
venta. Literal de la web original:

> *«Photos: As a little thank you for choosing us, we'll upload the best moments
> from your tour to our Facebook Fan Page — completely free of charge.»*

Y el plan 07 lo cuenta **dos veces** como diferencial: es una de las «19 razones
para elegirnos» (*«fotos incluidas gratis»*) y aparece en el desglose de valor
justamente valorada en **US$ 20** — el mismo número que ahora queremos cobrar.

Vender un álbum de US$ 20 sin cuidar la redacción **contradice nuestro propio
diferencial** y se lee como que las fotos gratis eran mentira. La distinción real,
y hay que decirla explícita:

| Gratis (incluido) | De pago (US$ 20 / grupo) |
|---|---|
| **Los mejores momentos**, subidos a su página de Facebook | **El álbum completo**, en **resolución original**, por Dropbox |

El upsell tiene que apoyarse en «completo y en alta», nunca en «tus fotos». Si el
copy insinúa que sin pagar no hay fotos, rompemos un argumento que usamos en dos
páginas para ganar US$ 20.

*(Existe además un cuarto extra sin precio publicado: **añadir un fotógrafo
profesional**, avisando con antelación. Sin tarifa no se puede vender online —
como mucho, mencionarlo como servicio a consultar.)*

⚠️ **Recordar la nota real de la web** al pintar la langosta: *«Lobster may not be
available during the months of March till June, from which we will replace the
option by wild prawn.»* Es un dato honesto del cliente y evita una queja
previsible — se porta tal cual.

### D. Los tramos de edad: solo en Snorkel

> ✅ **DECIDIDO (Samuel, 2026-07-27).**
>
> | Producto | Modelo de personas |
> |---|---|
> | **Snorkel Lovers** | **Único con selector de edades**: adultos · niños 1–3 · niños 4–7 |
> | **Semi-privado** | Solo adultos — **no admite niños** |
> | **Charter privado** | Solo «personas». Una plaza es una plaza, sin edad |
> | **Saona** | Igual: solo «personas» |
> | **Eventos** (party boat, bodas) | Igual: solo «personas» |
>
> **Los bebés (1–3) no suman** al conteo. En los productos por tramo la edad ni
> siquiera se pregunta, así que la cuestión solo existe en Snorkel.

Eso **simplifica bastante el widget**: el array de tramos de edad deja de ser algo
general y pasa a ser una propiedad de un solo tour. Los demás mantienen un stepper
único de «personas», que es lo que ya tienen hoy.

### E. Los descuentos: se muestran y se calculan

> ✅ **DECIDIDO (Samuel, 2026-07-27): los tres descuentos deben MENCIONARSE y
> FUNCIONAR.** No es letra pequeña, es argumento de reserva directa.
>
> | Descuento | Condición |
> |---|---|
> | **5%** | Cliente recurrente — que ya haya comprado antes |
> | **5%** | Reserva con **30 días** o más de antelación |
> | **5%** | Pago en **efectivo** |
>
> El chip que el widget ya pinta hoy («reservando directo ahorras hasta 15%») pasa
> por fin a estar respaldado por un cálculo real.

**Dos detalles de implementación que hay que zanjar al construirlo:**

1. **¿15% o 14,26%?** Tres 5% se pueden aplicar **sumados** (precio × 0,85) o
   **encadenados** (precio × 0,95³ = ×0,857). La diferencia en un charter de
   US$ 2.000 son US$ 14. El chip promete «hasta 15%», así que **sumados** es lo
   coherente con lo que ya se anuncia — pero conviene confirmarlo, porque es la
   clase de detalle que luego discute contabilidad.
2. **«Cliente recurrente» no se puede verificar solo.** El sitio no tiene cuentas
   ni login (y no las tendrá antes del 15 de agosto). Así que ese 5% solo puede
   ser: (a) una casilla que el usuario marca por honor, (b) un código que se le
   manda al cliente que repite, o (c) algo que aplica el equipo al confirmar, no
   la web. **Recomiendo (c) o (b)** — una casilla libre de «ya he venido» se marca
   sola y regala 5% a todo el mundo. Se muestra el descuento como existente, pero
   no se auto-aplica.

Lo de **efectivo** tiene el mismo matiz pero es más fácil: se aplica al elegir esa
forma de pago, y el prototipo ya lo hacía (`cash −5%`).

---

## 5. Cómo queda el modelo de datos

```ts
type Tramo = {
  desde: number
  hasta: number
  tipo: 'grupo' | 'persona'      // grupo = plano · persona = × todas las personas
  precio: number
  comidaOpcional?: number        // US$ por persona — ADD-ON, no entra en el base
}

type Tarifa = {
  id: string                     // 'maite-4h', 'forever-teresa-3h', …
  barco: string
  duracionHoras: number
  horarios: string[]
  almuerzo: string
  tramos: Tramo[]
  maxPax: number                 // = hasta del último tramo
}
```

Y para eventos, que es otro motor:

```ts
type PaqueteEvento = {
  id: string
  nombre: string
  base: number                   // 1–12 personas
  incluyeHasta: number           // 12
  porPersonaExtra: number
  duracionHoras: number
  paradas?: number
  platos: string[]
  sustitucionesVeg: string[]
}
```

**Regla de oro:** la tabla que se pinta en pantalla se **genera desde `tramos`**.
Nunca se escribe aparte — si se escriben por separado, se desincronizan y el
widget acaba cobrando algo distinto de lo que anuncia.

## 6. Casos de prueba obligatorios (fronteras de tramo)

Verificar el motor contra estos, calculados a mano. **Sin suplemento de comida**
hasta que se resuelva la pregunta 1:

| Tarifa | Pax | Esperado | Por qué |
|---|---|---|---|
| Forever Teresa 4 h | 26 · 28 | 2.775,00 | precio **plano** de la fila 26–28, sin suplemento |
| Maite 4 h | 8 | 625,00 | último del tramo grupo |
| Maite 4 h | 9 | 891,00 | primer pax del tramo persona (9 × 99) |
| GrandMa | 12 / 13 | 900,00 / 975,00 | frontera |
| Santa Maria | 13 / 14 | 1.000,00 / 1.386,00 | frontera |
| Forever Teresa 3 h | 18 / 19 | 1.600,00 / 1.615,00 | frontera 1 |
| Forever Teresa 3 h | 25 / 26 | 2.125,00 / 2.225,00 | frontera 2 (vuelve a grupo) |
| Forever Teresa 3 h | 29 / 30 | 2.225,00 / 2.250,00 | frontera 3 |
| Saona Speed Boat | 10 / 11 | 1.340,00 / 1.430,00 | frontera |
| Party boat Premium | 12 / 13 | 1.188,00 / 1.287,00 | marginal, no sustitución |
| Party boat #I | 12 / 20 | 660,00 / 1.100,00 | 660 + (8 × 55) |

El caso **Forever Teresa 3 h con 26 personas** es el más valioso de todos: es el
único que vuelve de un tramo `per Person` a uno `per Group`, y un motor mal escrito
lo calcula como 26 × 85 = 2.210 en vez de 2.225.
