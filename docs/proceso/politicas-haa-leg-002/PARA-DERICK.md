# HAA-LEG-002 · Lo que tiene que cambiar en Odoo y en el pago

Rama `politicas-y-equipo` · 2026-10-30 · decisión de Samuel: **la web dice lo que dice el PDF HAA-LEG-002**
(`HAA-LEG-002_Politicas_y_Condiciones_del_Cliente.pdf`, en esta misma carpeta).

El frontend ya está alineado (textos y lógica del navegador). Lo de esta lista **no se tocó** porque
vive en Odoo (`hispaniola_web`, `/api/web/v1/…`) o en el cobro real. Mientras no se haga, la web y
el cobro pueden decir cosas distintas en los puntos marcados con 🔴.

## 1. Depósito: entre el 20 % y el 25 % «según se indique al reservar»

- 🟡 **`deposit_pct` de cada tour** (`GET /catalog`, `GET /tours/:slug`; campo en
  `app/src/lib/api/tipos.ts:99`). Hoy vale **25 en todos** (`app/src/data/catalogo-odoo.generado.ts:27,
  66, 105, 375, 578, 663, 748`). Si algún tour tiene que ir al 20 %, se cambia en el producto de Odoo:
  la web ya lo lee de ahí y pinta ese número en la ficha (widget), en el checkout y en la estimación.
- 🟡 `default_deposit_pct` de `GET /config` (`tipos.ts:310`): mismo criterio.
- Después de cambiarlo: `npm run sync:tarifas` para que la foto del catálogo (lo que se usa si Odoo
  no contesta) diga lo mismo.

## 2. Saldo: «antes del inicio de la excursión, por los medios que indique el Operador»

- 🟡 `POST /bookings/:code/pay-balance` (`app/src/lib/api/api.ts:215`): comprobar que deja pagar el
  saldo online hasta la hora de salida (no solo «el día del tour») y que los correos dicen «antes
  del inicio».

## 3. Efectivo: fuera el 5 %

La web ya no pide el descuento (la casilla «I’ll pay the balance in cash on board» desapareció y
`/checkout/:code/sync` se manda siempre con `discounts: []`; si un pedido guardado lo trae, la web
se lo quita). En Odoo sigue existiendo:

- 🔴 **Oferta `efectivo`** (kind `cash`) en `GET /config → discounts`: desactivarla, para que
  `POST /quote` y `POST /checkout/:code/sync` no la concedan aunque alguien la pida a mano.
- 🔴 **`cash_discount`** en la respuesta de cotización/pedido (`tipos.ts:163-165`): debe quedar en 0.
- 🔴 **Pago todo en efectivo sin depósito**: el camino «método `efectivo`, hoy no se cobra nada» que
  aceptaba `/checkout/:code/confirm` ya no lo usa la web. El PDF dice que la reserva se confirma con
  depósito: cerrarlo también en el servidor.
- 🟡 Las reservas ya hechas con el 5 % se respetan (Gracias y Mi reserva siguen explicándolo para
  esas reservas, y solo para esas).
- 🟡 Ofertas «Returning guests 5 %» y «Booking 30+ days ahead 5 %»: el PDF tampoco las menciona. La
  web las sigue mostrando (tope «save up to 10 %», antes 15 %) hasta que Marketing decida.

## 4. Edades: «los niños pagan a partir de los 4 años; los menores de 4 no pagan»

La web ya pide bebés **0-3**, niños **4-12** y adultos **13-99** (selector de pasajeros,
`app/src/components/tour/pasajeros-popover.tsx`). Odoo recibe solo los recuentos
(`pax: { adults, children, infants }`), así que:

- 🔴 Comprobar en Odoo que **`infants` = menores de 4** y **`children` = 4-12** en todo lo que use
  edades: `infants_are_free` (`tipos.ts:100`), `child_price` (`tipos.ts:97`), el texto de los
  correos, el parte de embarque y cualquier regla que convierta edades en categorías.

## 5. Cancelaciones y no presentación (cláusulas 1-3 y 7)

- 🔴 `POST /bookings/:code/cancel` (`api.ts:297`): con **7 días o más** se reembolsa **el importe
  pagado** (no solo el depósito); con **menos de 7 días**, nada. Comprobar que el servidor aplica eso.
- 🟡 No presentarse (o llegar tras 5 min en compartidas / 15 min en privadas): el Operador retiene el
  depósito, salvo justificante médico. Es operativa, pero si Odoo marca estados de reserva, que exista.
- 🟡 Cancelación por mal tiempo o por el Operador: primero reprogramar, si no se puede, reembolso
  total. La web ya lo dice así en FAQ, fichas y checkout.

## 6. Casillas de aceptación al reservar (anexo del PDF, págs. 5-6) — tarea tuya

En el último paso del checkout (`app/src/components/reservar/paso-pago.tsx`, justo antes del botón
de pagar), una debajo de otra, mismo tamaño y estilo:

1. **Obligatoria**, con asterisco rojo al final y sin marcar al cargar: «He leído y acepto los
   Términos y Condiciones, la Política de Cancelación y Reembolsos, la Política de Privacidad y el
   Relevo de Responsabilidad y Asunción de Riesgos, en nombre propio y de todas las personas de esta
   reserva.» Cada documento enlaza a su página en pestaña nueva (`/legal/terms`,
   `/legal/cancellation-policy`, `/legal/privacy`; el Relevo HAA-LEG-001 todavía no tiene página
   porque no nos ha llegado). Sin marcarla no se puede pagar: al pulsar «Pagar» se resalta en rojo con
   «Debe aceptar los Términos y Condiciones para continuar.»
2. **Opcional**, sin asterisco, nunca premarcada, sin enlaces: «Autorizo a Hispaniola Aquatic
   Adventures y a Bávaro Reefs Group a usar en redes sociales, web y publicidad las fotos y videos
   de la excursión en los que aparezcamos yo y los menores de mi reserva.»

No se escriben las palabras «obligatorio» ni «opcional». Las dos frases necesitan versión inglesa
(la web sale en inglés por defecto): que la revise Marketing junto con
`TRADUCCION-EN-PARA-REVISAR.md`.

**Qué guarda Odoo en cada reserva** (anexo, apartado D), por ejemplo en `/checkout/:code/confirm`:

| Campo | Ejemplo |
|---|---|
| Fecha y hora de aceptación | 29/10/2026 14:32 |
| Versión aceptada | HAA-LEG-002 · 29 de octubre de 2026 |
| Canal | Web / Enlace de pago / Firma a bordo |
| Autoriza imagen | Sí / No |

**Enlaces de pago** (apartado C.6): si la página del enlace no permite casillas, el mensaje que lo
acompaña dice: «Al pagar, acepta nuestros Términos y Condiciones, la Política de Privacidad y el
Relevo de Responsabilidad», con los enlaces; el relevo y la autorización de imagen se firman a bordo.

## 7. Correos

Las plantillas salen de `mails/contenido.py` (este repo) y las sube Odoo. Todavía hablan de 25 % fijo,
«el día del tour» y el 5 % en efectivo: líneas 34-64 (datos de ejemplo), 394, 417, 533-551 (nota
y FAQ de efectivo), 707-725 (preheader y desglose del correo de carrito abandonado), 768 y 785.
Se reescriben de nuestro lado en otra tarea; luego hay que regenerar (`mails/construir.py`) y volver
a subirlas a Odoo. El PDF pide además enlazar la Política de Cancelación desde el correo de confirmación.
