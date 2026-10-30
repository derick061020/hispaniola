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

El efectivo tiene que ser **solo del saldo**, nunca del depósito. Hoy el frontend se contradice y
hay que saber qué hace el servidor:

- `app/src/components/reservar/resumen-reserva.tsx:522-528` y `paso-pago.tsx:290` dicen que con
  efectivo el depósito **se sigue cobrando con tarjeta** (según el comentario, el servidor cotiza
  `deposit: 47.03` con `['efectivo']`).
- En cambio, `app/src/pages/reservar.tsx:677-679` (botón «Confirm booking» en vez de «Pay deposit»),
  `app/src/components/reservar/barra-movil-reserva.tsx:58-68` («Total, in cash», hoy 0) y el
  comentario de `reservar.tsx:601` («una reserva en efectivo llega SIN depósito cobrado») dan a
  entender que se confirma sin cobrar nada.

**Qué hacer:** que `POST /checkout/:code/confirm` (y `/pay`) no confirme ningún pedido sin el
depósito cobrado, también con `discounts: ['efectivo']`. Si el servidor ya lo hace, avísanos y
corregimos esos dos textos del frontend para que digan «Pay deposit».

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
