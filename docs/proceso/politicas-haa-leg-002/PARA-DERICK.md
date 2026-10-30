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

En el último paso del checkout (`app/src/components/reservar/paso-pago.tsx`, justo antes del botón
de pagar), una debajo de otra, mismo tamaño y estilo, sin las palabras «obligatorio» ni «opcional»:

1. **Obligatoria**, con asterisco rojo al final, sin marcar al cargar: «He leído y acepto los
   Términos y Condiciones, la Política de Cancelación y Reembolsos, la Política de Privacidad y el
   Relevo de Responsabilidad y Asunción de Riesgos, en nombre propio y de todas las personas de esta
   reserva.» Cada documento enlaza a su página en pestaña nueva (`/legal/terms`,
   `/legal/cancellation-policy`, `/legal/privacy`; el Relevo HAA-LEG-001 aún no tiene página porque
   no nos ha llegado). Sin marcarla no se paga: al pulsar «Pagar» se resalta en rojo con «Debe
   aceptar los Términos y Condiciones para continuar.»
2. **Opcional**, sin asterisco, nunca premarcada y sin enlaces: «Autorizo a Hispaniola Aquatic
   Adventures y a Bávaro Reefs Group a usar en redes sociales, web y publicidad las fotos y videos de
   la excursión en los que aparezcamos yo y los menores de mi reserva.»

Las dos frases necesitan versión en inglés (la web sale en inglés por defecto), que tiene que revisar
Marketing junto con `TRADUCCION-EN-PARA-REVISAR.md`.

**Qué guarda Odoo en cada reserva** (apartado D), por ejemplo al confirmar:

| Campo | Ejemplo |
|---|---|
| Fecha y hora de aceptación | 29/10/2026 14:32 |
| Versión aceptada | HAA-LEG-002 · 29 de octubre de 2026 |
| Canal | Web / Enlace de pago / Firma a bordo |
| Autoriza imagen | Sí / No |

**Enlaces de pago** (apartado C.6): si la página del enlace no admite casillas, el mensaje que lo
acompaña dice «Al pagar, acepta nuestros Términos y Condiciones, la Política de Privacidad y el
Relevo de Responsabilidad», con los enlaces; el relevo y la autorización de imagen se firman a bordo.

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
