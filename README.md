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

**No hay una sola llamada de red en todo `app/src`.** Ni `fetch`, ni cliente HTTP, ni variables
de entorno (los 3 hits de `import.meta.env` son `.DEV`, para el Dev Mode). No existe `.env`
ni `.env.example`. Tampoco hay estados de carga, error o vacío en ningún componente: nunca ha
habido nada asíncrono. **Esa capa hay que introducirla, no sustituirla.**

Todo se persiste en tres claves de `localStorage`:

| Clave | Dónde |
|---|---|
| `hsp:reservas:v1` | [`lib/reservas.ts`](app/src/lib/reservas.ts) |
| `hsp:cotizaciones-evento:v1` | [`lib/cotizacion-evento.ts`](app/src/lib/cotizacion-evento.ts) |
| `hispaniola:deseos` | lista de deseos del widget |

### El contrato

[`lib/reservas.ts`](app/src/lib/reservas.ts) se autodeclara el shape que la API tendrá que
respetar. El tipo `Reserva` guarda una **copia denormalizada** del catálogo dentro de cada reserva
(`tour`, `ficha`) para que la pantalla de confirmación siga funcionando sin red.

**Le faltan tres cosas que Odoo va a necesitar:** add-ons/extras, desglose adultos/niños/bebés
(hoy solo hay `personas: number`) y estado + datos de pago.

### Nueve puntos que fingen backend

1. **Pago del depósito** — `pages/reservar.tsx`: genera un código, escribe en localStorage y navega. No hay formulario de tarjeta.
2. **Pago del saldo** — `pages/mi-reserva.tsx`: `setPagado(true)`, no persiste.
3. **Reservas** → `lib/reservas.ts`.
4. **Cotizaciones de evento** → `lib/cotizacion-evento.ts` (su cabecera marca el único punto que cambia para hacer el POST real).
5. **Búsqueda por código** — `mi-reserva.tsx`: no valida nada y **siempre devuelve la reserva demo**. Hay banner avisando.
6. **Voucher PDF** — botón sin `onClick`.
7. **Añadir al calendario** — botón sin `onClick`. Es lo único de la lista que se resuelve sin backend (un `.ics`).
8. **Email / WhatsApp** — no existe nada, aunque la pantalla de gracias diga «We're sending the voucher…».
9. **Disponibilidad** — `calendario-widget.tsx`: las fechas agotadas están hardcodeadas y ningún horario publica aforo.

Además, **siete formularios** hacen `preventDefault()` + mensaje de éxito sin enviar nada
(contacto ×2, agentes, careers, newsletter, comentarios, «cómo nos encontraste»). Sin captcha,
sin honeypot, sin validación más allá del `required` nativo.

### Precios: cuatro modelos incompatibles

1. **Sustitución de tramo** (charter y Saona): el nº de pax elige **un** tramo y se aplica ese y solo ese — plano si es `grupo`, × todas las personas si es `persona`.
2. **Tarifa dual** (Snorkel Lovers): adulto 114 / niño 65.
3. **Light + upgrade × personas** (Semi-Private Premium).
4. **Marginal** (eventos): base fija hasta 12 pax + extra por persona.

Depósito 25% · saldo el día del tour · −5% pagando en efectivo.
Fuente canónica de tarifas: [`docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`](docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md).

---

## 🔴 Lo primero: el checkout cobra distinto que la ficha

[`pages/reservar.tsx`](app/src/pages/reservar.tsx) calcula
`total = (precioLight + upgrade) * personas` y **no llama a `calcularTotalTour()`**
([`data/tours.ts`](app/src/data/tours.ts)), que es lo que sí usa el widget de la ficha. Los cuatro
tours son `booking: 'completo'`, así que los cuatro pasan por ahí. Los `precioLight` del charter
(75) y de Saona (184) son anclas «desde», **no tarifas por cabeza**:

| Caso | Ficha (tramo real) | Checkout | Desvío |
|---|---|---|---|
| Saona · Catamarán 30 pax | US$ 1.950 | US$ 5.520 | **+3.570** |
| Saona · Speedboat 2 pax *(default del funnel)* | US$ 1.100 | US$ 368 | **−732** |
| Charter · Forever Teresa 10 pax | US$ 1.600 | US$ 750 | **−850** |

El resumen **imprime la fórmula falsa** («Tour fare US$ 184 × 30»), y ese número es el que iría a
Odoo. El QA del funnel no lo cazó porque solo prueba `semi-private-premium`, el único tour cuya
fórmula sí es correcta.

**Se ha dejado sin arreglar a propósito:** cambia importes en pantalla y hay que decidir si el
cálculo se queda en el front o pasa al backend. Es la primera decisión del proyecto.

Relacionado: el checkout **tira los add-ons y el desglose por rol**. El widget manda
`adultos`/`ninos`/`bebes` en la URL y `reservar.tsx` no los lee; no hay ninguna clave de add-ons.
Resultado: el álbum de US$ 20 y la langosta de US$ 30/pax desaparecen entre dos pantallas, y los
bebés que la tripulación necesita para los chalecos no se guardan en ningún sitio.

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

### ⚠️ Precondición: hay lógica que decide por el texto visible

Y **ya está rota**. `incluye-evento.tsx` elige iconos comparando substrings en español mientras
`data/eventos.ts` ya está en inglés → varios ítems de «What's Included» caen al icono genérico.
Más grave: [`lib/menu-reserva.ts`](app/src/lib/menu-reserva.ts) decide **qué carta del charter se
muestra** con `duracionBarco?.startsWith('3')`, en la ficha y en el checkout. Eso no se arregla
con un campo `icono`: necesita un `duracionHoras` numérico.

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
un add-on de US$ 20: hoy es inocuo porque no llega al checkout, deja de serlo cuando Odoo cobre.

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
