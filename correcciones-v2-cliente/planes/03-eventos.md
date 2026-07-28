# Plan de correcciones v2 — EVENTOS (las 3 landings)

> Fuente: slides 14, 15 del PDF.
> Cruzado con: `app/src/pages/evento.tsx`, `components/evento/widget-evento.tsx`,
> `components/internas/galeria-mosaico.tsx`, `data/eventos.ts`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR — 2 correcciones, aplicadas a los 3 servicios

El cliente lo dice explícito en el slide 15: *«Esto aplica a estos 3 servicios»*,
señalando `Eventos y party boat` · `Bodas y pre-boda` · `Corporativo / MICE`.
En el repo son `EVENTOS` con slugs `party-boat`, `bodas`, `empresas`
(`data/eventos.ts:67`) — coinciden 1:1, y las 3 comparten `pages/evento.tsx`,
así que **cada corrección se hace una vez y cae en las tres**.

1. **Añadir «reserva online» encima del formulario de cotización** (§1).
2. **Añadir un video vertical explicativo** al mosaico (§2).

---

## §1 — Slides 14 y 15: «Agregar reserva online y debajo el formulario de cotización»

**Cliente:** en el slide 14 dibuja una caja gris con el texto **«reserva online»**
tapando la cabecera del formulario de cotización. En el slide 15 lo repite y lo
explica al margen: *«Agregar reserva online y debajo el formulario de
cotización»*.

**Estado en el repo:** `WidgetEvento` es **solo cotización**. Sus campos son
Nombre, Email, WhatsApp, Tipo de evento, Fecha tentativa, Nº de personas,
«Cuéntanos más», y el CTA es **«Pedir cotización»** → `guardarCotizacion()` →
`/eventos/:slug/gracias`. No hay ninguna vía de reserva inmediata en las
landings de evento.

**Qué está pidiendo:** que un evento se pueda **reservar** (o al menos iniciar la
reserva) sin esperar una cotización por email. Hoy el flujo de evento es
100% asíncrono: pides presupuesto, alguien te contesta.

**Cómo lo aplicamos — y aquí hay un límite duro que hay que decirle:**

La reserva online real **está bloqueada**, y no por nosotros: el motor de pago y
el backend son de Derick/Odoo, y ese bloqueo es el mismo que tiene el funnel de
tours desde el principio (`app/PLAN-LANZAMIENTO.md`; el paso de pago de
`/reservar/:slug` lo dice explícitamente en pantalla y **no finge cobrar** —
guardarraíl del proyecto).

Pero eso no significa que no se pueda hacer nada. Hay tres niveles, de menos a
más, y el 2 es el que recomiendo:

**Nivel 1 — solo maquetar.** Un bloque «Reserva online» arriba con su CTA que no
navega (patrón `EnlacePrototipo`, ya usado en la ficha de tour). Enseña la
intención, cero funcionalidad. Barato pero le sabrá a poco.

**Nivel 2 (recomendado) — reserva online real para lo que SÍ es reservable.**
Los eventos con **precio cerrado** se pueden mandar al funnel que ya existe
(`/reservar/:slug`, 4 pasos, construido y funcionando como prototipo de UX). Hoy
`PaquetesEvento` ya pinta paquetes con precio (`data/eventos.ts`) — un evento con
paquete de precio fijo y aforo conocido no necesita cotización, necesita
disponibilidad. La estructura queda:

```
[ Reserva online ]      ← paquetes con precio cerrado → al funnel
   ── o ──
[ Pide tu cotización ]  ← el formulario actual, para lo a medida
```

Eso es exactamente lo que dibuja el cliente (uno encima del otro) y además
**arregla un problema de conversión real**: hoy quien quiere un party boat
estándar de 20 personas tiene que rellenar un formulario y esperar, igual que
quien quiere una boda de 120 con menú a medida. No son el mismo cliente.

**Nivel 3 — reserva online completa con pago.** Bloqueado por Derick/Odoo. No
depende de este plan.

**Qué NO hacer:** poner un botón que diga «Reservar ahora» y lleve a un
formulario de cotización. Es la promesa incumplida que el proyecto ha evitado
sistemáticamente.

### 📞 REUNIÓN 07-24 — nivel 2 confirmado, con tarifario (12:13–13:50)

La reunión confirma la dirección y aporta el dato que faltaba:

1. **Sí quiere reserva online en eventos.** Miguel, sin ambigüedad (12:53):
   *«también puede reservar online»*.
2. **El tarifario existe y es de precio cerrado** — que es justo lo que el
   nivel 2 necesitaba. Samuel lo lee de la web del cliente (13:05): *«los precios
   son desde **US$ 1.188 de 1 a 12 personas**, y luego cada persona adicional son
   **US$ 99**»*, y propone *«hacerlo tal cual como está el resto»*. Miguel no
   objeta.
   → **Eso contesta la duda «¿qué paquetes tienen precio cerrado y aforo fijo?»**:
   el Hispaniola Premium Package lo tiene. Es reservable sin cotizar.
3. **Los paquetes de comida son de esta página, no de la ficha de charter**
   (12:24): el botón «paquetes privados para grupos» del charter *«[lleva] a la
   pestaña de eventos y celebraciones»*. **El trabajo del plan 01 §8 se muda
   aquí** — el componente `paquetes-comida.tsx` se construye en este plan.

**La pregunta del depósito que abrió Miguel (13:37) ya tiene respuesta:**

> ✅ **DECIDIDO (Samuel, 2026-07-27): el depósito de eventos es el 25%**, el mismo
> que el de los tours. No hay porcentaje especial por ser evento privado.

Eso desbloquea el paso de pago del funnel de eventos: reutiliza la misma
constante y la misma lógica que `/reservar/:slug`, sin ramas nuevas. **Y sigue
sin cobrar de verdad** — el motor de pago sigue bloqueado por Derick/Odoo y el
paso 4 lo dice con todas las letras, igual que en tours. El guardarraíl de «no
fingir que cobra» no cambia.

**Archivos:** `components/evento/widget-evento.tsx`, `pages/evento.tsx`,
`components/evento/paquetes-comida.tsx` (**nuevo — viene del plan 01 §8**),
`data/eventos.ts`, `components/reservar/*` (el funnel tendría que aceptar un slug
de evento, hoy solo entiende tours), `lib/reservas.ts`, `dev/dev-registry.ts`.
**Esfuerzo:** **nivel 2 alto** (el funnel hoy no sabe de eventos) + medio por los
paquetes que hereda del plan 01.
**Riesgo:** medio — toca el funnel, que es la pieza más delicada.
**Bloqueo:** el **% de depósito de un evento**. Sin eso el paso de pago no se
puede maquetar ni siquiera como prototipo.

---

## §2 — Slide 15: «Agregar video vertical explicativo»

**Cliente:** caja gris a la izquierda del mosaico de fotos, en el sitio exacto
donde en la ficha de tour vive el video vertical.

**Estado en el repo:** `GaleriaMosaico` **ya admite** un video opcional 9:16 en
esa posición exacta — se construyó así el 2026-07-22 («el material de este tipo
se graba en vertical (reels)»). Y `galeria-mosaico.tsx:25-26` dice literalmente:
*«`video` es opcional para no tocar las landings de evento, que llaman a este
mismo componente sin video»*.

O sea: **el hueco está previsto y vacío desde hace días.** Rellenarlo es pasar
una prop.

**Cómo lo aplicamos:** campo `videoGaleria?: string` en el tipo de `EVENTOS`
(igual que `FichaTour` ya lo tiene) y pasarlo en `pages/evento.tsx:109`. Tres
líneas.

**Bloqueado por assets:** hacen falta **3 videos verticales**, uno por servicio
(party boat, bodas, MICE). «Explicativo» sugiere que quiere un video que cuente
cómo funciona el servicio, no un reel de ambiente — eso es producción nueva, no
material de archivo. Conviene confirmar cuál de las dos cosas quiere: un reel de
ambiente que probablemente ya tenga, o un explicativo que hay que grabar.

Si el cliente manda solo uno, se puede usar el mismo en las 3 landings y marcarlo
como provisional — pero no es lo ideal, porque una boda y un cierre de convención
no se venden con el mismo video.

**Archivos:** `data/eventos.ts`, `pages/evento.tsx`, `public/video/`,
`dev/dev-registry.ts`.
**Esfuerzo:** trivial (el componente existe). **Riesgo:** ninguno.
**Duda para Samuel:** ¿le pedimos 3 videos o 1? ¿Y son «explicativos» o de
ambiente?

---

## 📞 El slide 13 (paquetes de comida) es de ESTE plan — resuelto en la reunión

Los 4 paquetes de comida de grupo (**Hispaniola Premium Package US$ 1.188** ·
Package **#I US$ 660** · **#II US$ 780** · **#III US$ 900**) estaban tratados en
el plan 01 §8 porque el cliente los puso entre material de ficha de tour.

**La reunión los reasigna aquí** (12:24): el botón de la ficha de charter lleva
*«a la pestaña de eventos y celebraciones»*. Así que:

- **El componente se construye una sola vez, y vive en Eventos.**
  `components/evento/paquetes-evento.tsx` ya existe — hay que ver si se amplía o
  se hace uno nuevo para el layout que el cliente dibuja (el Premium destacado a
  lo ancho + los 3 numerados debajo en grid de 3).
- **La ficha de charter solo enlaza.** Nada de duplicar el bloque en las dos, que
  era la recomendación anterior.

### ✅ Tarifario extraído de la web original (2026-07-27)

Ver `correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md` §3. Lo esencial:

| Paquete | Base (1–12 pers.) | Persona extra | Duración | Paradas |
|---|---|---|---|---|
| **Hispaniola Premium** | US$ 1.188,00 | US$ 99,00 | 4 h | — |
| **Package #I** | US$ 660,00 | US$ 55,00 | 3 h | 2 |
| **Package #II** | US$ 780,00 | US$ 65,00 | 3 h | 2 |
| **Package #III** | US$ 900,00 | US$ 75,00 | 3 h | 2 |

**Party boat y bodas comparten tarifario exacto** — mismos 4 paquetes, mismos
precios. La única diferencia es que bodas añade **«Champagne toast»** a los
incluidos comunes. Eso permite **un solo array de paquetes** consumido por las dos
landings, con los incluidos como variación.

> 🔧 **Corrección:** este plan (y el 01 §8) decían «1–10 personas» para los
> Packages #I/#II/#III, leído del slide 13. **La web original dice 1–12 para los
> cuatro.** Vale la web.

**Este es el único sitio donde el modelo marginal aplica.** Los tours usan
sustitución de tramo (ver plan 01 §7-bis) — son dos motores distintos y no hay
que mezclarlos.

El documento del tarifario trae además **los menús completos de los 4 paquetes**
y sus **sustituciones vegetarianas** (acumulativas: #III incluye las de #II, que
incluye las de #I), literales de la web. Es contenido real, listo para portar.

**Un dato a verificar antes de publicarlo:** US$ 1.188 ÷ 12 personas = **US$ 99
por persona**, exactamente el mismo número que el Light del semi-privado *y* que
la tarifa de persona extra de ese mismo paquete. Puede ser casual, pero invita a
confusión en una página donde conviven los dos productos.

## 📞 Y el layout de los menús también aplica aquí

De la reunión (19:27): *«en **todos los servicios** tiene que ser una mini
galería de las fotos de la comida»* — «todos los servicios» incluye las 3
landings de evento, no solo las fichas de tour. La pieza está especificada en el
**plan 01 §10** (ancho completo, carrusel, 4→3 columnas) y se monta también aquí.
