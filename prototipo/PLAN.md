# PLAN — Prototipo navegable de los wireframes

> Escrito 2026-07-13 (Fable 5) para ser ejecutado por Sonnet. Convierte los wireframes
> estáticos (`docs/proceso/wireframes/wireframes-completos.html`) en un **sitio navegable** donde se
> puede recorrer el funnel completo de reserva y sentir el uso real.
> Decisiones ya tomadas con Samuel: **uso local (doble click, sin servidor)** ·
> **toggle de notas de diseño** · **páginas de soporte completas**.

---

## 0. Objetivo y principios

- **Qué es:** el sitio nuevo de Hispaniola en estética wireframe (grises, placeholders),
  navegable de punta a punta: home → tours → ficha → booking de 4 pasos → gracias →
  mi reserva, más eventos y todas las páginas de soporte.
- **Qué NO es:** no es el diseño visual (eso lo hace Samuel a mano en Figma), no es
  código de producción, no lleva imágenes reales ni pagos reales.
- **Principio rector:** velocidad de iteración. Cada decisión técnica se subordina a
  "Samuel pide un cambio → se edita un archivo → F5".
- La fuente de verdad del contenido/copy es `docs/proceso/wireframes/wireframes-completos.html`
  (leerlo ANTES de construir cada página) y la arquitectura es
  `docs/proceso/analisis/arquitectura-nueva.md` (menú, jerarquía, qué página vive dónde).

## 1. Restricciones técnicas (no negociables)

El prototipo se abre con **doble click** (`file://`). Eso implica:

1. **Scripts clásicos, jamás `type="module"`** — los ES modules fallan por CORS en
   `file://`.
2. **Nada de `fetch()` a archivos locales** — mismo motivo. Todos los datos van inline
   en un `.js`.
3. **Cero dependencias externas** — sin CDNs, sin frameworks, sin fuentes web. Vanilla
   HTML/CSS/JS. (Además así queda publicable como artifact en el futuro si hace falta.)
4. **SPA con router por hash** (`#/home`, `#/tour/semi-privado`…) — es lo único que
   permite navegación multi-página + estado compartido del booking en `file://` sin
   servidor y sin riesgo de localStorage.
5. Imágenes = los placeholders CSS del wireframe (caja gris con diagonales). Nada de
   archivos de imagen.
6. Responsive real: desktop (≥1000px) y móvil (390px) — el turista reserva desde el
   teléfono.

## 2. Estructura de archivos

```
prototipo/
├── PLAN.md          ← este archivo
├── index.html       ← estructura: header, <main id="app">, footer, templates de página
├── estilos.css      ← tokens del wireframe (copiarlos de wireframes-completos.html) + componentes
├── datos.js         ← TOURS, PLATOS, EVENTOS, FAQ, GUIAS, NOTAS (todo el contenido)
└── app.js           ← router, estado, render de páginas, interacciones, modo notas
```

- Cada "página" es un `<template id="pagina-X">` en `index.html`. El router clona el
  template en `#app` y llama a su función de inicialización en `app.js`.
- Lo dinámico (tarjetas de tours, platos, pasos del booking, FAQ) se genera desde
  `datos.js` para no duplicar HTML.
- **Convención de nombres en español** (coherente con el resto del proyecto):
  `renderFicha()`, `estadoReserva`, `irA('/tours')`.

## 3. Datos (`datos.js`)

```js
const TOURS = {
  'semi-privado': {
    nombre: 'Semi-Privado Premium', audiencia: 'Solo adultos', maxPax: 25,
    duracion: '4 horas', rating: 4.9, resenas: 1782,
    precioLight: 99, upgradePremium: 15,      // Premium = 99+15 = 114
    horarios: ['9:00 AM', '1:00 PM'],
    booking: 'completo',
    // itinerario, incluye, menú, faq: copiar textos de la Parte 2 del wireframe
  },
  'snorkel-lovers': { /* familias, desde 98, upgrade +15, booking completo */ },
  'charter-privado': {
    /* desde 55/pers, hasta 120, booking: 'cotizacion' → su CTA lleva a
       #/eventos?tipo=charter con el form preseleccionado */
  },
  'isla-saona': {
    /* precio: null → la UI muestra "US$ —" y el CTA es "Consultar por WhatsApp";
       booking: 'consulta'. Refleja el dato REAL pendiente del cliente. */
  }
};
const PLATOS = [ /* Mariscos, Carne, Surf & Turf, Vegetariano, con descripciones */ ];
const OCASIONES = [ /* bodas, empresas, cumpleanos, aniversarios, despedidas, reuniones */ ];
const FAQ = [ /* categorías y preguntas del wireframe S4 */ ];
const NOTAS = { /* ver §7 — racional de diseño por página */ };
```

Precios y textos: usar EXACTAMENTE los del wireframe (p. ej. la cuenta del ejemplo:
2 × $99 + upgrade $30 = $228, depósito $57, saldo $171, cash −5% = $162).

## 4. Router y estado (`app.js`)

**Rutas** (hash):

| Ruta | Página |
|---|---|
| `#/` | Home |
| `#/tours` | Listado (sin fecha) / resultados (si hay fecha en el estado) |
| `#/tour/:slug` | Ficha (4 tours, misma plantilla, data-driven) |
| `#/reservar/:slug/1..3` | Booking pasos 1-3 |
| `#/reservar/:slug/gracias` | Paso 4 |
| `#/mi-reserva` | Gestión post-compra (usa la reserva del estado; si no hay, demo) |
| `#/eventos` · `#/eventos?tipo=X` | Hub (deep-link preselecciona el form) |
| `#/eventos/bodas` · `#/eventos/empresas` | Landings |
| `#/nosotros` · `#/sostenibilidad` | Marca |
| `#/guias` | Índice del blog |
| `#/faq` · `#/contacto` · `#/agentes` · `#/reserva-directa` | Soporte |
| `#/404` | Cualquier ruta desconocida |

**Estado global** (objeto en memoria, NO localStorage — cada sesión empieza limpia):

```js
const estadoReserva = {
  tour: null, fecha: null, horario: null, personas: 2,
  paquete: 'light',                 // default LIGHT — decisión anti bait-and-switch
  platos: [],                       // uno por persona
  hotel: null, horaRecogida: null,
  pago: 'deposito',                 // 25% por defecto
  datos: { nombre: '', email: '' },
  codigo: null,                     // se genera en el paso 3: HSP-XXXX-NNNN
};
```

Los totales se calculan SIEMPRE desde una única función `calcularTotales()` (subtotal,
upgrade, total, depósito 25%, saldo, saldo cash −5%) — nunca números a mano en el HTML.

## 5. Componentes compartidos

1. **Header** — 5 ítems + botón RESERVAR (→ `#/tours`). Megamenús de Tours (escaparate
   4 tarjetas con precio, agrupadas medio día/día completo) y Eventos (3 columnas:
   celebraciones, corporativo, resumen comercial + CTA), según wireframe 01b/01c.
   Desplegables simples para Nosotros y Ayuda. En móvil: hamburguesa full-screen con
   acordeones + botón RESERVAR siempre visible.
2. **Footer** — 4 columnas del wireframe §10 (con "¿Por qué reservar directo?" y
   "Agentes" que solo viven aquí).
3. **Resumen de reserva** (sidebar del booking) — se re-renderiza desde el estado en
   cada paso; en móvil va colapsado arriba, expandible.
4. **Barra móvil fija** de la ficha (precio + "Elegir fecha").
5. **Chips/toast** "wireframe" — pequeño badge fijo abajo-izquierda: "PROTOTIPO ·
   wireframe navegable · [📝 notas]".

## 6. Interacciones que hacen que se sienta real

**Home:** buscador del hero (tour ▾ / fecha / personas) → guarda en estado → `#/tours`.
Megamenús funcionales. FAQ en acordeón. Todos los CTA llevan a su ruta real.

**/tours:** dos estados — sin fecha (listado con precios/rating, chip "elige fecha para
ver horarios") y con fecha (horarios libres por tour, "quedan N" simulado, Saona "sin
cupo" ese día como en el wireframe D1). Barra "editar búsqueda".

**Ficha:** widget con mini-calendario (14 días generados desde "hoy" real, un par
marcados agotados), selector de horario y personas; el CTA muestra el total calculado y
entra al paso 1 con todo pre-cargado. Franja comparadora anti-OTA (→ `#/reserva-directa`).
Anclas sticky (Itinerario · Incluye · Menú · Opiniones · FAQ). Galería = placeholders
con contador. En Saona: CTA "Consultar por WhatsApp" (precio pendiente). En Charter:
CTA → `#/eventos?tipo=charter`.

**Booking:**
- Paso 1: calendario del mes real (hoy en adelante; días pasados off; 2-3 días agotados
  fijos para demo) con precio/día; slots con "quedan 9/17"; stepper de personas
  (máx. del tour; adults-only muestra la nota de redirección a Snorkel Lovers); paquete
  con **Light preseleccionado** y Premium como "+US$ 15/pers".
  **Estado sin disponibilidad**: botón "‹ ›" al mes siguiente muestra el mes completo
  agotado con las dos salidas (email + WhatsApp) — wireframe B1b.
- Paso 2: platos por persona (tarjetas con selección, tantas filas como `personas`);
  hotel con autocomplete fake (lista de 8 hoteles reales de Bávaro; al elegir → muestra
  hora de recogida); textarea opcional.
- Paso 3: 4 campos; fila de pago exprés ( Pay / G Pay / PayPal — botones fake que
  saltan directo a gracias); opción depósito 25% vs pago completo con la cuenta hecha
  desde `calcularTotales()`; checkbox de términos obligatorio; el botón dice
  "Confirmar reserva — pagar US$ XX" con el monto real.
- Validación inline en cada paso (nunca modal de error). El indicador de pasos permite
  **volver a pasos anteriores conservando todo**. Las líneas del resumen son clickeables
  y llevan a su paso.
- Gracias: nombre real del formulario, código generado, timeline con fechas calculadas
  (recordatorio = día anterior a la fecha elegida), efectivo exacto a llevar, CTA a
  `#/mi-reserva`, y "¿cómo nos encontraste?" como chips clickeables (guardan y agradecen).

**Mi reserva:** muestra la reserva del estado (o una demo si entras directo); cambiar
platos re-abre el selector; "pagar saldo online" simula pago y actualiza el saldo a 0;
cancelar/cambiar fecha = "se abre WhatsApp con tu código" (alert estilizado, no alert()).

**Eventos:** el hub lee `?tipo=` del hash y preselecciona el select del formulario
(scroll suave al form). Enviar cualquier formulario del prototipo → estado "enviado"
inline con promesa de respuesta (24h), nunca envío real.

**Soporte:** FAQ con buscador que filtra en vivo + acordeones por categoría; contacto
con selector "¿sobre qué?"; agentes/sostenibilidad/guías/reserva-directa completas según
wireframe. `#/reserva-directa` con la tabla comparativa.

## 7. Modo notas (toggle 📝)

- Botón "📝 notas" en el badge de PROTOTIPO. Activa `body.modo-notas`.
- En cada página, los bloques clave llevan `data-nota="clave"`. Con el modo activo,
  aparece un **pin numerado** en la esquina del bloque; click → panel lateral (drawer)
  con el racional de esa decisión, tomado del wireframe anotado.
- Las notas viven en `NOTAS` (datos.js), ~4-6 por página principal, 1-2 por página de
  soporte. Copiar los textos de las notas laterales del wireframe (resumidos).
- Con el modo apagado (default): cero rastro visual.

## 8. Fases de construcción (ejecutar EN ORDEN, commit por fase)

Cada fase termina con verificación en Playwright (abrir `file://…/prototipo/index.html`,
recorrer lo construido, capturar pantalla, revisar consola sin errores) ANTES de
committear. Mensajes de commit: `Prototipo F<n>: <qué>`.

- **F0 — Esqueleto.** Archivos, tokens CSS copiados del wireframe, router hash con 404,
  header/footer estáticos (sin megamenús aún), home con hero+cards (links muertos ok),
  badge PROTOTIPO. ✔ Navegar entre home y 404.
- **F1 — Datos + navegación real.** `datos.js` completo, megamenús desktop, menú móvil,
  `/tours` con sus dos estados, buscador del hero conectado. ✔ Home → buscar → tours
  con fecha; megamenús abren y navegan.
- **F2 — Ficha data-driven.** Plantilla completa (Parte 2 del wireframe) para los 4
  tours con sus 3 variantes de CTA (completo/cotización/consulta). Barra móvil. ✔ Las
  4 fichas renderizan con sus datos y anclas.
- **F3 — Booking.** Pasos 1-3 con estado, cálculos, validación, volver-sin-perder,
  sin-disponibilidad. ✔ e2e: elegir fecha/hora/pax/paquete → platos+hotel → pago →
  los totales cuadran ($228/$57/$162 en el caso ejemplo).
- **F4 — Gracias + Mi reserva.** ✔ e2e del funnel entero terminando en mi-reserva,
  cambiar plato y pagar saldo funcionan.
- **F5 — Eventos + marca.** Hub con deep-link `?tipo=`, bodas, empresas, nosotros,
  sostenibilidad. ✔ Megamenú eventos → cumpleaños → form preseleccionado.
- **F6 — Soporte.** FAQ con buscador, contacto, agentes, guías, reserva-directa. ✔ Todos
  los links del footer y del menú Ayuda resuelven (cero rutas rotas).
- **F7 — Modo notas + responsive + cierre.** Pins y drawer, pasada completa a 390px
  (menú móvil, resumen colapsable, barra fija), pasada de consola limpia, README corto
  en `prototipo/` (cómo abrirlo, cómo pedir cambios). ✔ e2e desktop + móvil completo.

Al cerrar F7: actualizar la nota del proyecto en el cerebro
(`C:\Users\kevin\OneDrive\Desktop\Cerebro\proyectos\hispaniola.md`) y push.

## 9. Qué NO hacer

- No frameworks, no build, no npm, no TypeScript, no ES modules, no fetch, no CDN.
- No inventar copy nuevo: el que está en los wireframes. Si falta algo, placeholder
  gris + comentario `<!-- COPY PENDIENTE -->`.
- No inventar el precio de Saona ni el mínimo de pax del charter (datos pendientes del
  cliente — mostrarlos como pendientes, igual que en los wireframes).
- No tocar `docs/proceso/wireframes/wireframes-completos.html` (sigue siendo el documento anotado de
  referencia) ni los análisis.
- No `alert()`/`confirm()` nativos — siempre UI propia.
- No urgencia fake: los "quedan N" del prototipo son datos demo fijos y el modo notas
  lo aclara.

## 10. Criterio de éxito

Samuel abre `prototipo/index.html` con doble click y puede: reservar el Semi-Privado de
punta a punta con totales correctos, chocar con el mes agotado y salir por la lista de
espera, pedir cotización de un cumpleaños desde el megamenú con el form preseleccionado,
gestionar su reserva, y recorrer las 15 páginas sin encontrar un solo link muerto —
en desktop y en móvil, con la estética wireframe intacta y las notas de diseño a un
click cuando las necesite.
