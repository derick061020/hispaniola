# Hispaniola Aquatic Adventures — web

Frontend del sitio nuevo de Hispaniola Aquatic Adventures. **React + Vite + TypeScript, SPA
100% cliente, en inglés, sin backend.** Diseñado por Samuel; se entrega a desarrollo para
conectar el motor de reservas y terminar el multi-idioma.

> **Todo el producto vive en [`app/`](app/).** El resto de carpetas es material de apoyo.

> 👥 **Somos dos trabajando a la vez sobre este código.** Antes de tu primer commit, lee
> [`CONTRIBUTING.md`](CONTRIBUTING.md): ramas, quién es dueño de qué archivos, y las tres
> cosas que ya costaron trabajo perdido aquí.

---

## Arrancar

```bash
git clone <repo>
cd hispaniola/app     # ← el proyecto está aquí, no en la raíz
npm ci
npm run dev           # http://localhost:5173
```

**Node ≥ 20.19** (lo exige `vite@8`). Hay `.nvmrc` con la versión probada (24).

| Script | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | `tsc -b && vite build` → `app/dist` |
| `npm run typecheck` | solo tipos |
| `npm run lint` | oxlint |
| `npm run preview` | sirve `dist` **como en producción** — usar esto para probar redirects |
| `npm run qa:rutas` | recorre 35 rutas en desktop y móvil buscando errores de consola, 4xx/5xx, `<title>`, `<h1>`, overflow, imágenes sin `alt` |
| `npm run qa:funnel` · `qa:a11y` | pasadas de QA sobre el checkout y accesibilidad |

⚠️ **`npx tsc --noEmit` no comprueba nada.** `app/tsconfig.json` es `{"files": [], "references": […]}`,
así que sale exit 0 al instante sin mirar un solo archivo. El comando real es **`tsc -b`**
(= `npm run typecheck`). Ya costó un bug que dejó las 4 fichas de tour en blanco sin que ni el
build ni `tsc` lo cazaran.

⚠️ **Los scripts de `qa/` siempre "pasan":** ninguno devuelve exit ≠ 0. Hay que **leer la salida**.
Necesitan `npm run dev` levantado en el 5173 y, la primera vez, `npx playwright install chromium`.

Estado verificado el 2026-08-10: `typecheck` ✅ · `lint` ✅ (15 warnings preexistentes) · `build` ✅.

---

## Stack

React 19.2 · React Router 7.18 · **Vite 8.1 (Rolldown)** · TypeScript 6.0 · **Tailwind 4.3 vía
`@tailwindcss/vite`** · GSAP 3.15 · Radix UI · lucide-react · oxlint · Playwright (solo QA).

Dos cosas que sorprenden si vienes de un setup clásico:

- **No hay `tailwind.config.js`.** La configuración vive en `@theme` dentro de
  [`app/src/styles/tokens.css`](app/src/styles/tokens.css). Todo el diseño pasa por tokens: no hay
  hex sueltos en componentes (salvo en `src/components/alignui/`, que es vendor copy-in).
- **No hay tests, ni CI, ni `.env`.** No existe `.github/`. Ver «La frontera con el backend».

---

## Estructura

| Carpeta | Qué es |
|---|---|
| **`app/`** | **El producto.** 259 archivos en `src/` (~53.000 líneas). |
| `prototipo/` | SPA vanilla navegable, sin build (se abre con doble clic). **No entra en el build.** Es fuente canónica de copy según `CLAUDE.md`. |
| `docs/proceso/` | Historia del proyecto: research, wireframes, capturas y las 3 tandas de correcciones del cliente con sus planes. **Nada de aquí se despliega.** |
| `CLAUDE.md` | Reglas del proyecto para agentes de IA. Contexto útil, no es documentación de producto. |

Dentro de `app/src/`: `components/` (24 subcarpetas, una por sección) · `pages/` (25) ·
`data/` (17 archivos, ~428 KB — **aquí vive casi todo el contenido**) · `lib/` · `styles/` · `dev/`.

Convenciones: **nombres de archivo y comentarios en español**, UI en inglés · kebab-case ·
un archivo por sección · hooks `use-*.ts` junto al componente que los usa · imports con alias `@/` ·
sin archivos barril.

> **Los comentarios en español son la documentación real del proyecto** (~20.000 líneas). Explican
> *por qué* está hecho así, con fecha y quién lo pidió. Antes de cambiar algo que parece raro,
> lee el comentario de encima: suele estar el motivo. Marcadores: `⚠️` (aviso), `[vN]` (versión).

---

## Despliegue

**Vercel**, con **Root Directory = `app`** en el panel. La configuración versionada es
[`app/vercel.json`](app/vercel.json): build, redirects 301 y cache de `/assets/*`.

Añadir una ruta obliga a tocar **tres sitios en el mismo commit**:
`app/src/App.tsx` + `app/public/sitemap.xml` + `app/vercel.json`.

⚠️ Los redirects **no se ven en `npm run dev`** (ahí gana el router de la SPA). Para probarlos:
`npm run build && npm run preview`, o un deploy preview.

---

## Rutas

33 elementos `<Route>` en [`app/src/App.tsx`](app/src/App.tsx) (28 con path literal + las
redirecciones ES→EN generadas desde `REDIRECCIONES_ES_EN`).

**Indexables:** `/` · `/tours/:slug` (4) · `/events/:slug` (3) · `/competitive-advantage` ·
`/crew` · `/facilities` · `/marine-park` · `/fleet` · `/foundation` · `/guides` · `/faq` ·
`/blog` · `/blog/:slug` (19) · `/travel-agents` · `/careers` · `/why-book-direct` · `/contact`

**Noindex:** `/book/:slug` · `/book/:slug/thank-you` · `/my-booking` ·
`/events/:slug/thank-you` · `/legal/:slug` · `/fundaciones` (página interna de tokens) · `*` (404)

**No existe** el listado `/tours` — solo la ficha `/tours/:slug`.

SEO ya construido: `components/seo/meta.tsx` (title/description/canonical/noindex por ruta),
`lib/seo/schema.ts` (JSON-LD), `robots.txt`, `sitemap.xml` (**a mano**), manifest e iconos.
Límite conocido: SPA sin SSR → los scrapers que no ejecutan JS (WhatsApp, Facebook) ven siempre
el Open Graph de la home.

---

## La frontera con el backend

**Actualizado el 2026-08-18.** Esta sección decía que no había «una sola llamada de red en todo
`app/src`». Ya no es cierto: el front habla con Odoo (módulo `hispaniola_web`) a través de
[`lib/api/`](app/src/lib/api/), y la mayoría de los puntos que fingían backend están conectados.

Una sola variable de entorno: `VITE_API_URL` (ver [`app/.env.example`](app/.env.example)).
El cliente HTTP centraliza timeout, reintentos, `ErrorApi` tipado y el desempaquetado del
sobre `{ok, data}` — los estados de carga y error se añaden una vez, no componente a componente.

### Qué está conectado

| Momento | Endpoint | Estado |
|---|---|---|
| Catálogo de tours | `data/home.ts` + `data/tours.ts` | **local a propósito** — menús, fotos y copy son de Samuel, no de Odoo |
| Días disponibles | `GET /availability` | conectado ([`use-disponibilidad.ts`](app/src/components/tour/use-disponibilidad.ts)) |
| Precio de la ficha | `POST /quote` | conectado ([`use-cotizacion.ts`](app/src/components/tour/use-cotizacion.ts)) |
| Alta de la reserva | `POST /checkout/start` | **al ENTRAR en `/book/:slug`**, no al pagar |
| Cada paso del funnel | `POST /checkout/:code/sync` | conectado, con debounce |
| Salida sin terminar | `POST /checkout/:code/abandon` | `sendBeacon` en `pagehide` |
| Cobro del depósito | `POST /checkout/:code/pay` + Stripe.js / PayPal | conectado |
| Confirmación del cobro | `POST /checkout/:code/confirm` | conectado (el webhook es la fuente autoritativa) |
| Consulta de reserva | `POST /bookings/lookup` | conectado — pide código **y** email |
| Cobro del saldo | `POST /bookings/:code/pay-balance` | conectado ([`pago-saldo.tsx`](app/src/components/mi-reserva/pago-saldo.tsx)) |
| Cambios post-venta | `POST /bookings/:code/update` | conectado — menú, recogida, nombre y teléfono |
| Añadir al calendario | `GET /bookings/:code/calendar.ics` | conectado |
| Cotización de evento | `POST /event-quotes` | conectado |
| Contacto · agentes · empleo · comentarios | `POST /leads` | conectado |
| «¿Cómo nos encontraste?» | `POST /leads` (`how_found`) | conectado |

`localStorage` sigue ahí pero **cambió de papel**: era el almacén y ahora es caché para pintar
sin esperar a la red. La copia buena vive en Odoo.

| Clave | Para qué |
|---|---|
| `hsp:checkout:v1` | la sesión de checkout (código + token), para retomarla al recargar y capturar el pago al volver de PayPal |
| `hsp:reservas:v1` | caché de la reserva pagada, para que «Gracias» pinte al instante |
| `hsp:cotizaciones-evento:v1` | caché de la cotización de evento |
| `hispaniola:deseos` | lista de deseos del widget |

### Lo que sigue sin backend

- **Voucher PDF**: no hay endpoint público. Existe en Odoo pero solo se adjunta al correo, así
  que el botón se quitó de «Gracias» en vez de dejarlo sin `onClick`.
- **Cancelar desde «Mi reserva»**: el endpoint existe (`POST /bookings/:code/cancel`, con
  revisión manual si hay dinero de por medio) pero no hay interfaz. Hoy se pide por WhatsApp.
- **Cambiar fecha, personas o barco después de pagar**: deliberado. Mueve precio y aforo, y eso
  no lo decide un formulario — se pide al equipo.
- **Newsletter**: `POST /newsletter` está listo, pero el sitio no tiene formulario de suscripción.
- **Idioma y moneda**: los dos selectores siguen siendo decorativos (ver más abajo).

### Precios: cuatro modelos incompatibles

1. **Sustitución de tramo** (charter y Saona): el nº de pax elige **un** tramo y se aplica ese y solo ese — plano si es `grupo`, × todas las personas si es `persona`.
2. **Tarifa dual** (Snorkel Lovers): adulto 114 / niño 65.
3. **Light + upgrade × personas** (Semi-Private Premium).
4. **Marginal** (eventos): base fija hasta 12 pax + extra por persona.

Depósito 25% · saldo el día del tour · −5% pagando en efectivo.
Fuente canónica de tarifas: [`docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`](docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md).
Los cuatro están implementados **en el servidor** (`services/pricing.py` del módulo), que es la
única autoridad de precio. El motor local (`calcularTotalTour()`) se conserva para pintar
mientras la respuesta viaja y como red si Odoo no contesta; en ese caso el total sale rotulado
como estimación.

---

## ✅ Resuelto: el checkout ya no cobra distinto que la ficha

Aquí había un aviso en rojo: `pages/reservar.tsx` calculaba
`total = (precioLight + upgrade) * personas` y no llamaba a `calcularTotalTour()`, con desvíos
de hasta **+3.570 USD** en Saona con 30 pax. Los `precioLight` del charter (75) y de Saona (184)
son anclas «desde», no tarifas por cabeza.

**La decisión fue pasar el cálculo al servidor.** Ficha y checkout preguntan los dos a Odoo, así
que no hay dos fórmulas que puedan desincronizarse: hay una. El desglose que pinta el resumen
también viene del servidor (`quote.lines`), así que ya no imprime una fórmula que no existe.

El checkout tampoco tira ya los add-ons ni el desglose por rol: `adultos`/`ninos`/`bebes` viajan
desde el widget hasta el CRM, que es lo que la tripulación necesita para los chalecos y lo que
hace que Snorkel Lovers cobre la tarifa de niño.

---

## ⚠️ Lo que hay que configurar en Odoo (no se arregla desde el código)

Comprobado contra producción el 2026-08-18:

1. **El catálogo está vacío.** `GET /health` devuelve `published_tours: 0` y `/catalog` una lista
   vacía, así que `/checkout/start` contesta `tour_not_found` para los cuatro tours y **ninguna
   reserva llega al CRM**. Se arregla ejecutando `scripts/seed_catalog.py` del módulo con
   `odoo shell` contra la base de producción (es idempotente y no toca reservas).
2. **CORS admite un solo origen** (`hispaniola.botizate.com`). Cualquier otro dominio —el
   definitivo, las previews de Vercel, local— recibe respuesta y el navegador la descarta. Se
   añaden en *Ajustes › Hispaniola Web › Allowed origins*.
3. **`site_url`** apunta a `hispaniola.botizate.com`. Es el que construye la URL de vuelta de
   PayPal: si el dominio bueno es otro, hay que cambiarlo ahí.
4. **PayPal está apagado** (`payments.paypal.enabled: false`) y Stripe está en `live`. Hoy solo
   hay tarjeta; el paso de pago se adapta solo y no pinta un método que iba a fallar.

Mientras 1 y 2 sigan así, el funnel **lo dice en pantalla** (banda de aviso arriba, paso de pago
bloqueado, total rotulado como estimación) en vez de dejar rellenar todo y fallar al pulsar
«Pay». Verificable con `npm run qa:degradado`.

---

## El idioma

**Hoy el sitio es monolingüe en inglés.** `index.html` tiene `lang="en"` fijo.

- **No hay librería de i18n**, ni contexto, ni `t()`, ni diccionarios, ni detección de idioma.
- El selector (`components/ui/selector-idioma.tsx`) es **decorativo**: un `useState` sin efectos.
  Se monta **dos veces con estado independiente** (topbar y footer). Al cablearlo, subir el estado
  a un provider **por encima de `<Routes>`** — el Topbar se monta fuera de `<Routes>`.
- El selector **no existe** en `/book/*`, `/my-booking`, el 404 ni por debajo de 640px.
- **Dónde vive el copy:** 17 archivos en `src/data/` **más ~550-650 cadenas hardcodeadas** en
  ~112-115 componentes. También hay copy en `lib/fechas.ts` (nombres de día y mes a mano, sin
  punto de inyección de locale — el comentario explica por qué se evita `Intl`), `lib/reservas.ts`,
  `lib/menu-reserva.ts` y `lib/seo/schema.ts`.
- **El español está en git, no perdido:** el tag `v3-pre-en` congela el sitio antes de la
  traducción. Ocho archivos de `data/` se recuperan 1:1 con `git diff v3-pre-en HEAD -- <archivo>`
  (blog, comentarios, faq, guias, por-que-reservar, trabaja, legal, equipo). Otros son parciales, y
  `tours.ts` y `marine-park.ts` **no son recuperables**: su inglés es copy nuevo aprobado por el
  cliente que nunca existió en español.
  **No renombrar ni reordenar claves de `data/*.ts` antes de extraer el español**, o se pierde esa propiedad.

### ✅ Resuelto (2026-08-18): la lógica de producto ya no lee el texto visible

[`lib/menu-reserva.ts`](app/src/lib/menu-reserva.ts) decidía **qué carta del charter se muestra**
—en la ficha y en el checkout— con `duracionBarco?.startsWith('3')`. Ahora lo decide
`subVariante.duracionHoras`, un número del dato. El texto se mira solo como último recurso, por si
a algún barco nuevo no le han puesto el número. Sin esto, traducir la etiqueta «3 hours» habría
mandado a todos los grupos a la carta de 4 h.

Queda el caso menor: `incluye-evento.tsx` elige iconos comparando substrings en español mientras
`data/eventos.ts` ya está en inglés → varios ítems de «What's Included» caen al icono genérico.
Es cosmético (un icono, no un menú) y se arregla con un campo `icono` en el dato.

También sin preparar: cero `hreflang`, `meta.tsx` no acepta idioma, sitemap sin alternates. Y las
18 reglas 301 ES→EN ya desplegadas condicionan cualquier esquema de rutas por idioma.

---

## Avisos

**Dev Mode** — botón flotante abajo a la derecha o `Ctrl/⌘ + .`, **solo en `npm run dev`**. Es una
herramienta del flujo de diseño (catálogo de bloques y estados para el traspaso a Figma).
El registro `src/dev/dev-registry.ts` **no llega al bundle**, pero el hook `useDevFlag` **sí**: hay
~44 query params `dev-*` activos en el sitio desplegado (`/?dev-hero=poster`…) y el hook reescribe
la URL con `replace`. Conviene saberlo antes de depurar un callback de pasarela.
Los `// [dev-mode]` en componentes marcan líneas que existen por esa herramienta.
**Mantener `dev-registry.ts` no es tarea de desarrollo.**

**Datos que parecen definitivos y no lo son** — el proyecto los marca, pero hay que buscarlos:

- 13 de las 18 reseñas de la home son de relleno (`QUOTES_RELLENO`, con aviso de borrarlas antes de publicar).
- Los ~70 miembros de `/crew` se generan en código con nombres «Name Surname 01» y lorem ipsum.
- Los retratos del equipo destacado son **fotos de stock bajo nombres de personas reales**.
- `privacy`, `terms` y `cookies`: «To be drafted with legal counsel.»
- Los 13 comentarios del blog están fabricados.
- El `upgradePremium: 15` de Snorkel Lovers es **un supuesto**, no un dato del cliente.
- Datos de urgencia del widget: inventados (`chips-urgencia.tsx`).
- ⚠️ **`public/fotos/langosta.webp` es el único asset que no es del cliente** y su licencia no cubre
  uso comercial. Ver [`app/public/fotos/CREDITOS.md`](app/public/fotos/CREDITOS.md): hay dos salidas documentadas.
- El dominio está **asumido**, no confirmado: aparece hardcodeado en `robots.txt`, `sitemap.xml` y los OG.

**Pendiente de decisión de Samuel** — `/crew-boat` es una página de comparación que se autodescribe
como borrable, y hoy es contenido duplicado **indexable**. Los 19 slugs del blog siguen en español
(uno con ñ) pese a que `App.tsx` afirma lo contrario. Y `ALBUM_UPSELL.porDefecto = true` premarca
un add-on de US$ 20: 🔴 **ya no es inocuo** — desde el 2026-08-18 los add-ons viajan a la
cotización y al checkout, así que ese extra se cobra salvo que el visitante lo desmarque.
Contraviene la Directiva 2011/83/UE art. 22 (consentimiento expreso para todo pago adicional).
Está aislado en un booleano —en el front y en `seed_catalog.py`— para poder apagarlo en una línea.

**Rendimiento** — un único chunk de 1,2 MB (380 kB gzip): no hay ni un `React.lazy`. `public/`
pesa 31 MB, de los que **24 MB son 3 vídeos** (uno es el fondo del hero y entra en el LCP).

**Documentos históricos** — `app/PLAN-LANZAMIENTO.md` es el backlog de referencia, **pero su
sección «Inventario del hueco» es falsa** (dice «cero SEO», «sin favicon», «sin páginas legales»:
las tres cosas existen). Los 25 planes de `docs/proceso/correcciones-v*/` dicen «Estado: No
ejecutado» y **están todos ejecutados** — es la convención del repo: el plan es una foto congelada.

---

## Ramas

`master` y `staging` van sincronizadas. Los puntos de retorno son los tags: `v3-pre-en` (el sitio
en español), `v4.0-home-iteracion`, `v2-internas`, `v1.1-ficha-alignui`.
La rama `minimax` que citan varios documentos **ya no existe**.
