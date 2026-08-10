# Revisión crítica de los wireframes — áreas de mejora para conversión

> 2026-07-11. Auto-auditoría de los 3 documentos de wireframes (home, ficha+booking,
> 11 páginas restantes) con la misma lente que usamos contra la web actual: ¿qué frena
> aquí a alguien que quiere reservar? Prioridades: **P1** = toca directamente la tasa de
> reserva · **P2** = mejora medible · **P3** = pulido.

---

## 1. Hallazgos P1 — corregir antes de Figma

### 1.1 Bait-and-switch de paquete en el paso 1 del booking

La tarjeta de la home y el widget de la ficha anclan "**desde US$ 99**", pero en el
paso 1 del booking el paquete preseleccionado es **Premium a $114** (con chip
"popular"). El usuario que entró por el 99 siente que el precio subió solo — el mismo
patrón de desconfianza que criticamos en la web actual ("starting at $103 vs $114").

**Corrección:** preseleccionar **Light ($99, coincide con el ancla)** y presentar
Premium como *upgrade* con framing de diferencia, no de precio total:
"**+US$ 15** → langosta, Angus, surf & turf". El upgrade framing convierte mejor que
la elección paralela y elimina la sensación de trampa.

### 1.2 Los links de reseñas mandan tráfico a Viator = fuga al canal competidor

La ficha (A5) y la home (07) enlazan "Ver en TripAdvisor · **Viator**". Viator vende
EL MISMO producto con Reserve-Now-Pay-Later y cupones del 10% — mandar ahí a alguien
en plena decisión es regalarle la venta al canal que queremos desintermediar.

**Corrección:** reseñas **embebidas en la página** (widget o 10-20 curadas con "ver
más" on-page). Link externo solo a TripAdvisor (neutral, no vende) y solo al final de
la sección de reseñas. **Nunca linkear la ficha de Viator.**

### 1.3 El widget multi-tour de la home no tiene pantalla de resultados

El hero permite "Todos los tours ▾ + fecha + personas → Ver disponibilidad"… y ese
estado no está wireframeado. ¿Qué ve el usuario al enviar?

**Corrección — elegir una:**
- (a) Pantalla de **resultados de disponibilidad**: "mar 22 jul · 2 personas" con los
  4 tours, su precio y horarios libres ese día (patrón buscador de hotel). Más potente:
  convierte la fecha —que el turista SÍ sabe— en el eje de decisión.
- (b) MVP: el selector de tour es obligatorio y el CTA entra directo al paso 1 del
  booking de ese tour; "Todos los tours" desaparece.
La (a) es mejor para conversión; la (b) es más barata. Decidir ahora, porque cambia
el hero.

### 1.4 "Cambia el menú hasta 24 h antes" promete una pantalla que no existe

La pantalla de gracias (B4) ofrece "Cambia el menú hasta el 21 jul →" y el paso 2
tranquiliza con "puedes cambiarlo hasta 24 h antes". No hay wireframe de **"Mi
reserva"** (ver/editar menú, ver saldo, pagar el resto online, descargar voucher,
política de cambios). Sin esa pantalla la promesa es humo — y esa promesa es
precisamente la que baja la ansiedad de decidir el plato en el paso 2.

**Corrección:** wireframe de "Mi reserva" accesible desde el voucher (link con token,
sin crear cuenta). Es además donde vive "pagar el saldo online" — hoy solo mencionado.

### 1.5 No hay estado "sin disponibilidad" en el calendario

Si el mes está lleno (temporada alta) o el día elegido no tiene plazas, el flujo actual
termina en un callejón. Civitatis tiene "Are your preferred dates unavailable?" por algo.

**Corrección:** estado vacío con dos salidas: "Avísame si se libera" (email/WhatsApp)
y "Escríbenos — a veces abrimos un segundo barco" (que además es verdad operativa
en grupos). Cada callejón sin salida con una puerta = reservas recuperadas.

### 1.6 El comparador de canales no está donde están los comparadores

La tabla "Reservando aquí vs portal" vive en `/reserva-directa` y en la home. Pero el
visitante que compara con Viator **aterriza en la ficha del tour** (viene de Google o
de la propia Viator investigando al operador). La ficha solo tiene el microcopy del
widget.

**Corrección:** strip de una línea en la ficha, bajo el widget:
"Mismo precio que en los portales — aquí con depósito del 25%, menú a elección y
WhatsApp directo. → ver comparación". Barato y colocado exactamente donde ocurre la
comparación.

### 1.7 Sin pago exprés (Apple Pay / Google Pay)

El paso 3 solo muestra tarjeta. Para un turista en móvil (mayoría del tráfico), los
wallets son one-tap y Stripe los da casi gratis: es de las palancas de conversión de
checkout más documentadas.

**Corrección:** fila de **checkout exprés (Apple Pay / Google Pay / PayPal)** encima
del formulario de tarjeta en B3. Con wallet, además, nombre y email llegan del propio
wallet → el paso 3 puede quedar en 2 campos.

---

## 2. Hallazgos P2 — mejoras medibles

### 2.1 Navegación entre pasos sin definir
No hay "← Volver" ni edición desde el resumen lateral. Si en el paso 3 quieres cambiar
la fecha, ¿pierdes el menú elegido? **Corrección:** cada línea del resumen es un link
que vuelve a su paso conservando el estado; "volver" nunca borra nada.

### 2.2 Falta el escape hatch de WhatsApp dentro del funnel
El negocio vive de WhatsApp y el funnel no lo ofrece. Un turista atascado (tarjeta
rechazada, duda de hotel) abandona. **Corrección:** línea discreta en el pie de los
pasos 2-3: "¿Prefieres que te lo reservemos por WhatsApp?". Discreta — que rescate,
no que distraiga.

### 2.3 La home móvil no tiene CTA persistente
La ficha tiene barra inferior fija; la home no definió la suya. Con 10 secciones de
scroll, el CTA del hero desaparece pronto. **Corrección:** barra fija en home móvil
("Ver tours · desde US$ 55") que aparece tras pasar el hero.

### 2.4 El paquete quizá no pertenece al paso 1
Paso 1 móvil = calendario + horarios + personas + paquete: largo. El paquete es en
realidad una decisión de comida → su casa natural es el paso 2, junto a los platos
(eliges nivel y luego plato, una sola conversación mental). Contra: el total del
resumen queda "desde" hasta el paso 2. **Recomendación:** mover paquete al paso 2 y
mostrar en paso 1 "desde $99/pers"; probar con usuarios reales si genera dudas.

### 2.5 Garantía de mejor precio — gratis y no la usamos
Hispaniola controla su precio en todos los canales → "Si lo encuentras más barato en
un portal, lo igualamos y te damos 5% extra" es una promesa sin riesgo que Viator SÍ
muestra ("Lowest Price Guarantee") vendiendo lo mismo. Añadirla a `/reserva-directa`,
ficha y FAQ.

### 2.6 El descuento de repetidor no trabaja en la pantalla de gracias
B4 hace upsell de celebraciones, pero el 5% repeat-guest existe y no se usa:
"¿Otro día de mar esta semana? Tu segunda salida tiene 5% — mira Saona". Cross-sell
del catálogo con un incentivo que ya es política de la casa.

### 2.7 Urgencia "quedan 9" depende de un dato que quizá no exista
Todo el sistema de urgencia honesta (plazas restantes, "se reserva con ~26 días")
depende de que el motor exponga aforo restante vía API. Si xpotours no lo da, el
elemento muere en diseño. **Atarlo explícitamente a la decisión del motor** (ya en
pendientes) — y diseñar la variante sin dato (solo "disponible / últimas plazas /
completo").

### 2.8 Números inventados en los wireframes que son compromisos operativos
Escribí como placeholder cosas que el cliente debe aprobar porque son promesas:
- "Respuesta en **menos de 24 h**" (eventos) y "**48 h**" (agentes)
- "Cambia el menú hasta **24 h antes**"
- Ceremonia a bordo "hasta **40 invitados**"
- Recogida "**8:05 AM**" (ejemplo — varía por hotel, ojo en Figma con presentarlo como fijo)
- Mínimo de personas del charter privado ($55/pers ¿desde cuántas?)
Si el cliente no puede sostener una, se ajusta el wireframe — no lanzar promesas rotas.

---

## 3. Hallazgos P3 — pulido

- **Formato de moneda inconsistente**: "US$ 28,50" (coma) vs "US$ 57.00" (punto).
  Definir convención por idioma (ES: coma · EN: punto) y sistematizarla en Figma.
- **Moneda única**: todo en US$. Para el mercado europeo (TUI/Bayahibe aparece como
  referral en el motor actual) valorar al menos el equivalente € informativo.
- **"Sin crear cuenta"**: es cierto en todo el flujo pero no se dice. Una línea en el
  paso 3 ("reservas como invitado, sin cuenta ni contraseña") quita una fricción mental.
- **Tarjetas de home**: definir que toda la tarjeta es clickeable, no solo "Ver tour".
- **Checkout sin nav**: confirmar en Figma que los pasos 1-3 quitan la navegación del
  sitio (solo logo + pasos + candado); el logo vuelve a la ficha conservando estado.
- **Página de voucher**: existe en el flujo actual ("print your voucher") y en el nuevo
  mapa no tiene casa. Puede ser la misma pantalla "Mi reserva" (1.4).
- **404 y error de pago**: estados menores sin wireframe; con definir el patrón en
  Figma basta (mensaje + salida a WhatsApp).
- **`/reserva-directa` en el menú**: decidir su slot en la nav (propuesta: ítem propio
  "Reserva directa" — es la página-argumento, merece estar visible).

---

## 4. Inventario de pantallas faltantes (salen de esta revisión)

| Pantalla | Prioridad | Origen |
|---|---|---|
| Resultados de disponibilidad multi-tour (o simplificar el widget del hero) | P1 | 1.3 |
| "Mi reserva" (editar menú, pagar saldo, voucher) | P1 | 1.4 |
| Estado sin disponibilidad + lista de espera | P1 | 1.5 |
| Variante de urgencia sin dato de aforo | P2 | 2.7 |
| Error de pago / 404 (patrón, no página) | P3 | §3 |

## 5. Top 5 — si solo se corrigen cinco cosas antes de Figma

1. **Default Light $99 + Premium como upgrade "+$15"** (1.1) — elimina el bait-and-switch.
2. **Reseñas embebidas; jamás linkear Viator desde la ficha** (1.2) — cierra la fuga.
3. **Wallets (Apple/Google Pay) como checkout exprés en el paso 3** (1.7) — la palanca
   de checkout móvil más rentable.
4. **Pantalla "Mi reserva"** (1.4) — sostiene las promesas del funnel y aloja el pago
   del saldo online.
5. **Strip comparador en la ficha + estado sin disponibilidad** (1.6 + 1.5) — captura
   al comparador y al que llegó tarde.

> Nada de esto invalida la estructura: los tres documentos aguantan la revisión. Son
> correcciones de borde exactamente del tipo que conviene atrapar en wireframe, donde
> cambiar cuesta minutos y no horas de Figma.
