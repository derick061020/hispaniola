# HAA-LEG-002 · Lo que tiene que cambiar en Odoo y en el pago

Rama `politicas-y-equipo` · 2026-10-30. Regla de Samuel: **solo se cambia lo que el PDF exige o
contradice; lo que el PDF no menciona se queda como está en `backend-odoo`.** El PDF
(`HAA-LEG-002_Politicas_y_Condiciones_del_Cliente.pdf`) está en esta misma carpeta.

Lo que se queda igual a propósito, porque el PDF no lo contradice: el depósito del 25 % (cabe en
«entre el 20 % y el 25 %, según se indique al reservar»), el 5 % por pagar el saldo en efectivo, los
descuentos de cliente que repite y de 30 días, y la forma de cobrar el saldo.

## Lo que exige el PDF

### 1. No confirmar ninguna reserva sin depósito (§6)

> «Para confirmar la reserva se paga un depósito de entre el 20 % y el 25 % del total.»

El efectivo es **solo del saldo**, nunca del depósito.

**Web: hecho en esta rama.** El cobro de la web nunca distinguió el efectivo: `paso-pago.tsx`
(`lanzar` → Stripe con `importe={deposito}` o PayPal) cobra siempre el `amounts.deposit` que
devuelve Odoo, y no hay ningún camino que confirme una reserva nueva sin pagar. Si falla la pasarela,
la reserva queda guardada como pendiente y el equipo llama. Lo que se contradecía eran los textos, y
ya están corregidos:
- el botón de la barra móvil decía «Confirm booking» con la casilla de efectivo; ahora dice
  «Pay deposit · US$ X» siempre (`reservar.tsx`);
- la barra móvil enseñaba «Total, in cash · on the day»; ahora enseña siempre lo que se paga hoy,
  el depósito (`barra-movil-reserva.tsx`);
- `desglosePago` (`tarifas.ts`) y los comentarios de `lib/reservas.ts` decían «efectivo = 0 hoy»;
  ahora cobran el depósito y aplican el 5 % sobre el saldo.

**Servidor: comprobado en `/quote` de producción** (coral-quest, 2 adultos, 15-12-2026):

| `discounts` | total | depósito | saldo | `cash_discount` |
|---|---|---|---|---|
| `[]` | 188,10 | 47,03 (25 %) | 141,07 | 0 |
| `['efectivo']` | 181,05 | **47,03 (25 %)** | 134,02 | 7,05 (5 % del saldo) |

**Qué te queda a ti:** confirmar que `POST /checkout/:code/pay` crea el intento de cobro por ese
mismo depósito también con `['efectivo']` (nunca por 0), y que `POST /checkout/:code/confirm` (y el
webhook) no pasa a confirmada ninguna reserva sin el depósito cobrado. Desde la web no lo puedo
comprobar sin crear un pedido real. Si el servidor tuviera algún camino de «confirmar sin pagar»
(reservas antiguas guardadas con `deposito: 0`), hay que cerrarlo.

### 2. Edades: «los niños pagan a partir de los 4 años; los menores de 4 no pagan» (§6)

La web ya pide **bebés 0-3, niños 4-12 y adultos 13-99** (`pasajeros-popover.tsx`; antes 0-2 y
3-12). Odoo solo recibe recuentos (`pax: { adults, children, infants }`), así que hay que comprobar
en Odoo que **`infants` = menores de 4** y **`children` = 4-12** en todo lo que use edades:
`infants_are_free` y `child_price` (`GET /catalog`, `app/src/lib/api/tipos.ts:97-100`), los correos,
el parte de embarque y cualquier regla que convierta edades en categorías.

### 3. Cancelación: con 7 días o más, «se reembolsa el importe pagado» (§1)

`POST /bookings/:code/cancel` (`app/src/lib/api/api.ts:297`): con **7 días o más** se devuelve
**todo lo pagado**, no solo el depósito; con **menos de 7 días**, nada. Antes la web decía
«reembolso íntegro del depósito».

### 4. Casillas de aceptación al reservar (anexo, págs. 5-6)

**Web: hecho en esta rama** (Samuel decidió que las casillas las hacemos nosotros). En el último
paso del checkout, justo antes del botón de pagar, una debajo de otra y con el mismo estilo
(`app/src/components/reservar/casillas-aceptacion.tsx`, montadas en `paso-pago.tsx`):

1. «He leído y acepto los Términos y Condiciones, la Política de Cancelación y Reembolsos, la
   Política de Privacidad y el Relevo de Responsabilidad y Asunción de Riesgos, en nombre propio y de
   todas las personas de esta reserva.» con asterisco rojo, sin marcar al cargar. Enlaces en pestaña
   nueva a `/legal/terms`, `/legal/cancellation-policy` y `/legal/privacy`. **El Relevo HAA-LEG-001
   va sin enlace** porque no nos ha llegado (TODO en el código: cuando llegue, página `/legal/release`
   y su ruta en `DOCUMENTOS`).
2. «Autorizo a Hispaniola Aquatic Adventures y a Bávaro Reefs Group a usar en redes sociales, web y
   publicidad las fotos y videos de la excursión en los que aparezcamos yo y los menores de mi
   reserva.» Sin asterisco ni enlaces, nunca premarcada.

Sin la casilla 1 no sale ninguna llamada a `/pay`: ni desde el botón, ni desde la barra móvil, ni con
PayPal, ni con los wallets de Stripe (Apple/Google Pay y Link no abren la hoja). Al intentarlo, la
casilla se marca en rojo con «Debe aceptar los Términos y Condiciones para continuar.» (anunciado a
lectores de pantalla y con el foco en la casilla). Texto en español literal del PDF; el inglés es
nuestro y lo revisa Marketing (`TRADUCCION-EN-PARA-REVISAR.md`). Prueba: `app/qa/qa_casillas.mjs`
(Odoo simulado, 1440 y 390 px, EN y ES).

**Lo que llega a Odoo — campo nuevo `legal_acceptance`** en `POST /checkout/:code/sync`:

```json
{
  "legal_acceptance": {
    "accepted_at": "2026-10-29T18:32:05.120Z",
    "version": "HAA-LEG-002 · 29 de octubre de 2026",
    "channel": "web",
    "image_consent": false
  }
}
```

| Clave | Tipo | Qué es (apartado D del anexo) |
|---|---|---|
| `accepted_at` | texto ISO 8601, **UTC** | Fecha y hora de aceptación: el momento en que marcó la casilla 1, antes de pagar. Para enseñarla, pásala a hora de Punta Cana (UTC-4). |
| `version` | texto | Versión aceptada. Hoy siempre `HAA-LEG-002 · 29 de octubre de 2026` (`app/src/lib/aceptacion-legal.ts`). |
| `channel` | `"web"` | Canal. Desde la web siempre `web`; «Enlace de pago» y «Firma a bordo» los pone Odoo. |
| `image_consent` | booleano | Autoriza imagen: `true` = Sí, `false` = No. |

Cómo viaja:
- En un `sync` **propio**, solo con `legal_acceptance` (y el `meta` de siempre), justo **después**
  del `sync` del formulario y **antes** de `POST /checkout/:code/pay`. Si el pago falla y se
  reintenta, se vuelve a mandar (mismo contenido, o hora nueva si desmarcó y volvió a marcar).
- Es **opcional**: si tu `sync` todavía no lo conoce, la web no se rompe. Si lo ignora, el pago sigue
  igual; si respondiera error, la web lo calla y sigue cobrando (por eso va aparte: no se lleva por
  delante el guardado del contacto y la fecha).
- Solo se manda si la casilla 1 está marcada, y sin ella no hay cobro, así que **toda reserva pagada
  en la web llega con `legal_acceptance`**.

**Qué te queda a ti:** solo **guardarlo y mostrarlo en la reserva** — los cuatro datos del apartado D
(fecha y hora, versión, canal, autoriza imagen Sí/No), visibles en la ficha de la reserva para que
Redes pueda mirar «Autoriza imagen» antes de publicar (apartado E), y que se pueda cambiar a «No» si el
cliente lo pide después. Si el pedido ya tiene una aceptación, la última manda.

**Enlaces de pago** (apartado C.6): si la página del enlace no admite casillas, el mensaje que lo
acompaña dice «Al pagar, acepta nuestros Términos y Condiciones, la Política de Privacidad y el
Relevo de Responsabilidad», con los enlaces; el relevo y la autorización de imagen se firman a bordo.
En esos casos el canal es «Enlace de pago» o «Firma a bordo» y lo rellena el equipo en Odoo.

### 5. Enlazar la Política de Cancelación desde el correo de confirmación (anexo, C.5)

> «…la de cancelación también desde la ficha de cada excursión y el correo de confirmación de la reserva.»

El correo de confirmación debe enlazar a
`https://hispaniolaaquaticadventures.com/legal/cancellation-policy`. Las plantillas salen de
`mails/contenido.py` (este repo) y las sube Odoo: cuando las toquemos, hay que volver a subirlas.

## Opcional: el PDF no lo exige

- `deposit_pct` de cada tour (`GET /catalog`; hoy 25 en todos, `app/src/data/catalogo-odoo.generado.ts`):
  solo hay que tocarlo si algún tour va a ir al 20 %.
- Pago online del saldo (`POST /bookings/:code/pay-balance`, `api.ts:215`): el PDF dice «antes del
  inicio, por los medios que indique el Operador». El efectivo a bordo antes de salir ya lo cumple.
