# PLAN — Lanzamiento (de "fuente para Figma" a frontend real)

## Contexto

`app/` se construyó bajo un principio explícito (`PLAN.md` §Principios no negociables,
punto 1): **"Todo es visual. Sin backend, sin lógica real."** Era correcto para el
objetivo original (diseño final → traspaso a Figma) y ese objetivo **se mantiene** —
el traspaso a Figma sigue siendo válido y se hace igual. Lo que cambia es que,
además, **este código pasa a ser el frontend real que Derick conecta a backend** y
lanza a producción.

Ese punto 1 de `PLAN.md` queda **superado por este documento** para todo trabajo de
aquí en adelante (igual que el punto sobre la ficha de tour quedó "derogado a medias"
por `PLAN-TOURS.md`). El resto de `PLAN.md` — tokens, un componente = un componente
Figma, cero hex sueltos, Dev Mode — **sigue en pie**: es infraestructura que sirve a
los dos objetivos a la vez, no solo a Figma.

## Qué se conserva tal cual (la base aguanta el pivote)

- **Tokens** (`src/styles/tokens.css`) — es CSS de producción real, no maqueta.
- **Arquitectura de componentes** (`ui/` reusable, una carpeta por página) — se
  mapea igual de bien a "componente conectado a datos" que a "componente de Figma".
- **AlignUI en internas** (`components/alignui/`) — sistema funcional real, con
  estados (disabled, focus, loading), no decorativo.
- Router, responsive, accesibilidad básica de lo que existe.

## Inventario del hueco (verificado en el código, no supuesto)

- **Cero llamadas a red en todo `src/`** — no hay `fetch`, `axios` ni ninguna
  variable `VITE_*` de API. Todo el contenido sale de `src/data/*.ts` estáticos.
- **Solo 4 rutas existen** (`App.tsx`): `/`, `/tours/:slug`, `/eventos/:slug`,
  `/fundaciones`. Sin ruta comodín/404.
- **21 archivos** usan `EnlacePrototipo` (`ui/enlace-prototipo.tsx`) — enlaces
  `href="#"` con `preventDefault()` que apuntan a páginas que solo existen en
  `prototipo/`. Es, literalmente, el checklist de páginas/rutas que faltan.
- **El widget de reserva** (`tour/widget-reserva.tsx`) pinta el CTA con su estado
  real (deshabilitado sin fecha, total calculado) pero **no navega** — el funnel
  de 4 pasos no existe en React.
- **El formulario de contacto** (`home/contacto.tsx`) es local-state puro, documentado
  en su propio comentario como "SOLO PROTOTIPO (sin backend)".
- **Cero SEO**: `index.html` solo tiene `charset`/`viewport`/`title` fijo — sin
  `description`, sin Open Graph/Twitter cards, sin canonical, sin favicon. No hay
  `robots.txt` ni `sitemap.xml` en `public/`. No hay ningún manejo de `<title>`/meta
  por ruta (todo el sitio comparte el mismo `<title>` fijo del `index.html`).
- **Es una SPA 100% client-side** (Vite + React Router, sin SSR/SSG/prerender).
- **Sin i18n**: el selector de idioma se retiró del topbar (nota del cerebro,
  2026-07-15) y quedó en backlog — es turismo en Punta Cana, el tráfico en inglés
  probablemente sea mayor que en español.
- **Sin páginas legales**: no hay política de privacidad, términos, política de
  cookies ni política de cancelación como página (solo aparece copy suelto).
- **Sin analítica/tracking** de ningún tipo (GA4, Meta Pixel, GTM).
- **Sin tests automatizados** — la verificación de cada fase fue manual con
  Playwright, no hay suite que corra en CI.
- **Sin favicon, manifest ni iconos** — `public/` no tiene ninguno.
- `src/dev/` y las líneas `[dev-mode]` están gateadas solo por
  `import.meta.env.DEV` — correcto para hoy, pero hay que verificar que el build
  de producción realmente las excluye antes de lanzar.

## Bloque 0 — Decisiones bloqueantes (no las decide este documento)

Nada de lo de abajo se puede planear en detalle sin esto. Idealmente se resuelven
con Derick/el cliente antes de o en paralelo a la Fase 1.

1. **Motor de reservas**: ¿Odoo confirmado? ¿Qué módulo (Sales/Rental/eCommerce/
   Website + un layer custom)? ¿Reemplaza a xpotours.net del todo o convive?
   Bloquea el Bloque A y B enteros.
2. **Pasarela de pago**: ¿la gestiona el propio Odoo o un gateway aparte? Punta
   Cana suele necesitar procesador local (Azul, CardNet) además de o en vez de
   Stripe. Bloquea el checkout del funnel.
3. **SSR/SSG vs. seguir SPA pura** — decisión arquitectónica que condiciona todo
   el Bloque E (ver ahí el detalle). Cuanto antes se decida, menos rehecho.
4. **Idiomas para el lanzamiento**: ¿solo ES, o ES+EN desde el día 1? Cambia el
   alcance real del Bloque H (hoy es "backlog", pero para un sitio de turismo
   internacional puede ser bloqueante de lanzamiento, no un nice-to-have).
5. **Hosting/dominio de destino** — condiciona CI/CD, variables de entorno y la
   viabilidad de SSR (algunos hosts de estático no lo soportan sin cambiar de
   proveedor).
6. **Alcance de páginas para v1**: ¿las ~15 páginas del sitio completas, o un
   subset mínimo viable (home, listado, ficha, funnel, políticas, contacto) con
   el resto (blog, agentes, MICE...) en una v1.1?

## Bloque A — Capa de datos y contrato con backend

- Definir con Derick el contrato de API por recurso (catálogo de tours, eventos,
  disponibilidad, precios, creación de reserva, estado de una reserva) — idealmente
  como tipos TypeScript compartidos, para que `src/data/*.ts` pase de ser la fuente
  a ser el *shape* de fallback/seed y los tipos (`Tour`, `FichaTour`, etc. ya
  existen y son un buen punto de partida para el contrato).
- Introducir una librería de fetching (recomendado: TanStack Query) con estados de
  carga/error/vacío consistentes — hoy ningún componente maneja ninguno de los tres.
- Config de entorno: `.env` con `VITE_API_URL` (o equivalente Odoo) por entorno
  (dev/staging/prod), documentado en `app/README.md`.
- Estado de sesión/carrito para el funnel (fecha/personas/upgrade elegidos deben
  sobrevivir entre los 4 pasos).

## Bloque B — Funnel de reserva (la pieza central que falta)

- Los 4 pasos + estado "sin disponibilidad" + "Mi reserva" ya están diseñados en
  `docs/proceso/wireframes/wireframes-completos.html` y validados en `prototipo/` — es puerto,
  no invención.
- El widget de la ficha (`widget-reserva.tsx`) ya calcula el total real
  (Light/Premium × personas) — es el punto de entrada natural al paso 1.
- Pantallas de confirmación (frontend) para lo que el backend resuelva por email/Odoo.
- Depende por completo del Bloque 0.1/0.2.

## Bloque C — Páginas y rutas faltantes

Usar los 21 usos de `EnlacePrototipo` como checklist literal de qué falta y
reemplazar cada uno por un `<Link>` real al construir su página. Pendientes según
la arquitectura de 15 páginas de los wireframes: listado `/tours`, sostenibilidad
(componentes y datos ya existen en `components/sostenibilidad/` y `data/
sostenibilidad.ts` — falta la página y la ruta), nosotros, reserva directa,
agentes, FAQ standalone, blog, "Mi reserva", sin-disponibilidad. Añadir también
una **ruta comodín 404** (`App.tsx` no tiene ninguna hoy).

## Bloque D — Formularios reales

- Contacto: conectar a un endpoint real (¿lead en Odoo CRM? ¿servicio de email?
  depende del Bloque 0.1) en vez de solo `setState`.
- Validación real (recomendado: `react-hook-form` + `zod`) en vez de solo
  `required` nativo.
- Protección anti-spam básica (honeypot como mínimo; reCAPTCHA si hace falta más).
- Cualquier formulario nuevo del funnel (datos del viajero, checkout).

## Bloque E — SEO

Esto es lo más grande que "se ignoró por pensarlo solo para Figma" — un archivo
Figma no necesita meta tags. Un sitio que compite por tráfico orgánico contra
Viator/OTAs sí, y es justo el ángulo que el propio research de conversión del
proyecto identificó como ventaja (reseñas 4.9★/1.782, #1 TripAdvisor 7 años,
comida a bordo) — hoy nada de eso está estructurado para buscadores.

- **Decisión arquitectónica primero (Bloque 0.3)**: hoy es una SPA 100%
  client-side. Google renderiza JS pero no siempre bien ni rápido, y una SPA pura
  no da control fino de `<title>`/meta por ruta sin trabajo extra. Opciones, de
  menor a mayor esfuerzo:
  1. Mantener Vite SPA + gestor de head por ruta (`react-helmet-async` o
     `@unhead/react`) + prerender de las rutas públicas en build
     (`vite-plugin-prerender` o similar) — cambio menor, resuelve la mayoría.
  2. Migrar a un framework con SSR/SSG nativo (Next.js, Remix, Astro con islands)
     — más trabajo de migración, mejor resultado y mejores Core Web Vitals de
     serie, más natural si el sitio va a tener blog/contenido que crece.
  Recomendación: valorar la opción 1 primero — es el 80% del beneficio con una
  fracción del costo, y no obliga a reescribir lo ya construido.
- **Meta tags por página**: title/description/canonical únicos por ruta (tour,
  evento, página estática) — hoy todas comparten el `<title>` fijo de `index.html`.
  Open Graph + Twitter cards (con imagen real por tour, no genérica) para que
  compartir un link en WhatsApp/redes se vea bien — alto impacto dado que el canal
  de venta actual es muy boca a boca / WhatsApp.
- **Datos estructurados (schema.org)**: `TouristTrip`/`Product` con
  `AggregateRating` en las fichas de tour (el 4.9★/1.782 reseñas es justo el tipo
  de dato que Google premia con rich snippets), `LocalBusiness`, `FAQPage` en la
  sección FAQ, `BreadcrumbList`.
- **`sitemap.xml` + `robots.txt`** — no existen, hay que generarlos (pueden
  generarse en build a partir de las rutas + slugs de `data/tours.ts`/`eventos.ts`).
- **Rendimiento / Core Web Vitals**: auditar carga de fuentes (3 familias
  `@fontsource` instaladas — Inter y Lora ya no se usan tras el cambio a Poppins,
  candidatas a eliminar del bundle), lazy-loading de imágenes (parcialmente hecho,
  falta auditoría completa), y el peso que suman GSAP/Radix al bundle inicial.
- **Alt text real**: auditar imágenes de contenido (fotos de tours, platos,
  galería) — hoy al menos una decorativa usa `alt=""` correctamente, pero falta
  confirmar que las de contenido tengan alt descriptivo, no solo las decorativas.
- **hreflang** si el Bloque H (idiomas) entra en el alcance de v1.

## Bloque F — Legal y políticas

- Página de política de privacidad, términos y condiciones, política de cookies,
  política de cancelación (el copy de cancelación ya existe suelto en varios
  componentes — falta la página formal enlazada desde el footer).
- Banner de consentimiento de cookies si se añade analítica/tracking (Bloque G) —
  requisito legal en varias jurisdicciones si hay tráfico UE, y buena práctica de
  todos modos.

## Bloque G — Analítica y tracking

- GA4 (o equivalente) + Meta Pixel si hay campañas pagas.
- Eventos de conversión sobre el funnel una vez exista (Bloque B) — es la parte
  que más le va a importar al negocio medir.

## Bloque H — Internacionalización

- Confirmar alcance real para el lanzamiento (Bloque 0.4). Si entra: librería de
  i18n (`react-i18next` o similar), extraer todo el copy hardcodeado de
  `data/*.ts` y componentes a diccionarios, rutas por idioma o detección de
  navegador + selector (el que se retiró del topbar en v3 puede volver como esa
  pieza funcional en vez de decorativa).

## Bloque I — Accesibilidad, estados de error, 404

- Ruta 404 real (falta hoy).
- Error boundaries de React para fallos de red una vez exista el Bloque A.
- Estados vacíos (sin resultados, sin disponibilidad) — ya diseñados en
  docs/proceso/wireframes/prototipo, faltan en React.
- Pase de accesibilidad más allá de lo verificado por fase (contraste, foco,
  lectores de pantalla) con una herramienta tipo axe.

## Bloque J — Limpieza de artefactos de la etapa "solo Figma"

- Confirmar que `npm run build` excluye de verdad `src/dev/` y las líneas
  `[dev-mode]` del bundle de producción (hoy dependen solo de
  `import.meta.env.DEV`; verificar el output real, no asumirlo).
- Decidir el destino de `prototipo/` (¿se retira del repo de producción, se deja
  como referencia histórica, se archiva?) una vez cada `EnlacePrototipo` tenga su
  página real (Bloque C).
- Reemplazar cada `EnlacePrototipo` por `<Link>` a medida que su página exista.

## Bloque K — Infra de lanzamiento

- Pipeline de CI/CD (build + lint + lo que se añada de tests) y entornos
  dev/staging/prod con sus variables (depende del Bloque 0.5).
- Tests automatizados mínimos — hoy es 100% verificación manual; al menos
  cubrir el cálculo de totales del funnel y los contratos de datos del Bloque A,
  que son los puntos donde un bug cuesta dinero real.
- Monitoreo de errores en producción (Sentry o similar) — no existe hoy.
- Favicon + manifest + iconos (touch icon, OG image default) — `public/` no
  tiene ninguno.
- Cabeceras de seguridad básicas (CSP, HSTS) según lo permita el hosting elegido.

## Fases sugeridas

- **Fase 0** — Resolver Bloque 0 (con Derick/cliente/Samuel). Nada del resto se
  planea en detalle fino sin esto.
- **Fase 1** — Fundaciones que NO dependen de backend ni de las decisiones de
  Odoo: SEO base (meta por ruta, sitemap, robots, structured data, favicon/
  manifest), páginas legales, ruta 404, limpieza/verificación del Bloque J. Se
  puede empezar ya, en paralelo a la Fase 0.
- **Fase 2** — Contrato + capa de datos (Bloque A), en paralelo a que Derick
  defina el lado Odoo.
- **Fase 3** — Funnel de reserva (Bloque B) — el bloque más grande, depende de
  que la Fase 2 esté andando.
- **Fase 4** — Resto de páginas faltantes (Bloque C) + formularios reales
  (Bloque D).
- **Fase 5** — i18n si se confirma para v1 (Bloque H).
- **Fase 6** — Analítica (Bloque G), infra de lanzamiento (Bloque K), QA
  integral, lanzamiento.

## Qué NO cambia de `PLAN.md`/`PLAN-ALIGNUI.md`

- Sigue sin inventarse copy/precios/datos: la fuente sigue siendo la web actual
  del cliente (verificada en vivo cuando algo no cuadra) y lo que apruebe Samuel/
  el cliente.
- Tokens primero, cero hex sueltos — se mantiene también en todo lo nuevo.
- El traspaso a Figma sigue siendo un entregable válido en paralelo, no se
  abandona por este plan.
