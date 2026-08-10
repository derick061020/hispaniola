# Plan 01 — Idioma: inglés principal, español secundario

> Fuente: decisión del cliente transmitida por Samuel (2026-08-06) + el copy
> aprobado EN de los 5 WEBSITE (que cubre ~60% del texto visible del sitio).
> Cruzado con: todo `app/src/` — hoy **cero i18n**: el texto vive hardcodeado
> en `data/*.ts` (16 archivos, ~330 KB) y en los componentes.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## Decisión marco (ya tomada)

**«i18n preparado, EN ahora»**: todo el sitio pasa a inglés; el ES no se
cablea todavía pero se conserva como diccionario futuro; el toggle se invierte.

## 1. Cómo se conserva el español (el «diccionario»)

- **Tag `v3-pre-en`** sobre el último commit antes de tocar texto. El sitio
  ES completo queda congelado ahí — es la fuente para extraer el diccionario
  cuando se cablee el i18n real (diff por archivo, las claves/estructura de
  `data/*.ts` no cambian, solo los valores).
- **Regla de estructura**: al traducir un `data/*.ts` NO se renombran claves,
  no se reordena, no se fusionan entradas. Un `git diff v3-pre-en -- data/x.ts`
  tiene que leerse como «mismo esqueleto, valores en EN». Donde un plan (02–07)
  además reestructura una sección, la reestructura es un commit SEPARADO del
  de traducción — para que el diff de idioma siga siendo limpio.
- NO se crea runtime de i18n (ni contexto, ni hook `t()`, ni JSON de
  mensajes): sería infraestructura muerta hasta la fase ES y es exactamente el
  tipo de token-que-nadie-usa que este proyecto ya aprendió a no crear.

## 2. El toggle de idioma se invierte

`components/ui/selector-idioma.tsx` — hoy: `ES | EN`, ES activo por defecto
(`useState<Idioma>('ES')`, línea 91), bandera de España primero.

- Orden visual pasa a **EN | ES**, con **EN activo por defecto**.
- Sigue puramente visual (documentado en el propio componente, líneas 37-38).
- El thumb deslizante y el grid de 2 columnas iguales ya soportan la
  inversión — es cambiar el orden de los botones y el estado inicial.
- `topbar.tsx` no cambia (solo monta el selector).

## 3. Infra que cambia con el idioma (F1)

| Qué | Dónde | Cambio |
|---|---|---|
| `<html lang="es">` | `app/index.html` | → `lang="en"` |
| Meta título/descr. por ruta | `components/seo/meta.tsx` + cada página | Se traducen EN LA FASE DE SU PÁGINA, no aparte |
| `schema.org` (Organization, FAQ, etc.) | `lib/seo/schema.ts` | `inLanguage`, textos → EN |
| Formato de números | transversal | `91.607` → `91,607` · `1.782 reseñas` → `1,782 reviews` — ⚠️ hay cifras formateadas a mano en data y en componentes; entra en el barrido §5 |
| Fechas | mi-reserva, blog, calendario del widget | `es-DO`/`es-ES` de `toLocaleDateString`/nombres de mes → `en-US` |
| Moneda | ya es `US$` en todo el sitio | sin cambio |
| `aria-label`/`sr-only`/`alt` | transversal | entran en el barrido §5 |
| Título del documento y 404 | `no-encontrado.tsx` | EN |

## 4. ✅ DECIDIDO: slugs de rutas en inglés (Samuel, 2026-08-06)

Hoy: `/tours/:slug` (slugs ES: `semi-privado-premium`…), `/eventos/:slug`,
`/reservar/:slug`, `/mi-reserva`, `/flota`, `/tripulacion`, `/instalaciones`,
`/fundacion`, `/ventaja-competitiva`, `/por-que-reservar`, `/faq`, `/blog`,
`/agentes-de-viaje`, `/trabaja-con-nosotros`, `/contacto`, `/legal/:slug`.

**Mapa de rutas (ES → EN)** — con `<Navigate replace>` en `App.tsx` para la
SPA y 301 reales en `netlify.toml` + `vercel.json` (el `<Navigate>` solo no
basta: un 200 al index deja que Google siga viendo la vieja como página
propia — misma lección que `/sostenibilidad → /ventaja-competitiva`):

| ES (301 →) | EN |
|---|---|
| `/tours/:slug` | `/tours/:slug` (slugs de tour también, ver abajo) |
| `/reservar/:slug` · `/reservar/:slug/gracias` | `/book/:slug` · `/book/:slug/thank-you` |
| `/mi-reserva` | `/my-booking` |
| `/eventos/:slug` · `/eventos/:slug/gracias` | `/events/:slug` · `/events/:slug/thank-you` |
| `/ventaja-competitiva` (+ `/sostenibilidad`) | `/competitive-advantage` |
| `/tripulacion` (+ `/nosotros`) | `/crew` |
| `/instalaciones` | `/facilities` |
| `/flota` | `/fleet` |
| `/fundacion` | `/foundation` |
| — (nueva, plan 05 §6) | `/marine-park` |
| `/guias` | `/guides` |
| `/faq` | `/faq` (igual) |
| `/blog` · `/blog/:slug` | `/blog` · `/blog/:slug` (igual) |
| `/agentes-de-viaje` | `/travel-agents` |
| `/trabaja-con-nosotros` | `/careers` |
| `/por-que-reservar` (+ `/reserva-directa`) | `/why-book-direct` |
| `/contacto` | `/contact` |
| `/legal/:slug` | `/legal/:slug` (slugs traducidos) |
| `/tripulacion-barco` | **se borra** (era la comparativa temporal, decisión pendiente de la v2 — se aprovecha esta pasada) |
| `/fundaciones` (tokens, interna) | **se queda igual** — deja de chocar con `/fundacion` porque la pública pasa a `/foundation` |

**Slugs de contenido** (`data/*.ts`, cada uno con su 301):
- Tours: `semi-privado-premium` → `semi-private-premium`, `snorkel-lovers`
  (igual), `charter-privado` → `private-charter`, `isla-saona` →
  `saona-island`.
- Eventos: `party-boat` (igual), `bodas` → `weddings`, `corporativo` →
  `corporate`.
- Legal: `privacidad` → `privacy`, `terminos` → `terms`, `cookies` (igual),
  `cancelacion` → `cancellation`.
- Blog: los 4 slugs de artículo se traducen con su título.

⚠️ Al tocar slugs hay que revisar **todos los enlaces internos** (megamenús,
footer, CTAs, deep-links `?tipo=`/`?dev-*`, sitemap, `schema.ts`) y el
`dev-registry.ts` (sus rutas por bloque).

## 5. El barrido exhaustivo de español residual (F7, al final)

Los 5 WEBSITE cubren mucho copy de home/tours/nosotros/eventos/sostenibilidad,
pero **nada** de: funnel `/reservar` (4 pasos + validaciones), `/mi-reserva`
(27 KB de UI), FAQ (`data/faq.ts`), blog completo, legales, 404, `/gracias`,
formularios (labels, placeholders, errores), `/agentes-de-viaje`,
`/trabaja-con-nosotros`, `/guias`, tooltips de insignias, chips de urgencia,
copy del widget (68 KB), microcopy de botones. Todo eso se traduce en F7 con
esta metodología:

1. **Grep de caracteres**: `[áéíóúñÁÉÍÓÚÑ¿¡]` sobre `src/` — excluyendo
   `src/dev/` (interno, NO se traduce), `src/components/alignui/` (vendor) y
   comentarios de código (los comentarios se QUEDAN en español: son
   documentación interna del proyecto, no UI).
2. **Grep de palabras señuelo** que no llevan tilde: `\b(el|la|los|las|de|que|
   con|para|desde|hasta|reserva|persona|barco)\b` en strings JSX/TS.
3. **Pasada visual por las 24 rutas** (desktop + 390px), incluyendo estados:
   funnel completo, mi-reserva con y sin código, 404, formularios con error,
   calendario abierto, lightbox, menú móvil.
4. **Checklist por ruta** en el commit de F7 (misma mecánica que el QA v1/v2).

⚠️ Trampas conocidas del barrido:
- Texto en **assets**: si alguna imagen lleva texto ES quemado, se anota (no
  se puede traducir por código).
- `datos.js` del prototipo NO se toca (es el prototipo histórico, no producto).
- `dev-registry.ts` y el Glosario Dev se quedan en ES (herramienta interna).
- Validación nativa del navegador (`required`, `type=email`) emite mensajes en
  el idioma del navegador del usuario — no es nuestro, no se toca.

## 6. Qué documento WEBSITE cubre qué archivo (mapa para F2–F6)

| Doc | Página(s) | Archivos principales |
|---|---|---|
| INICIO | `/` | `data/home.ts`, `hero.tsx`, `tours-grid.tsx`/`tour-card.tsx`, `why-direct.tsx`, `incluye-crucero.tsx`, `contacto.tsx`, `equipo-teaser.tsx`, `eventos-especiales.tsx` (se ELIMINA), `footer.tsx` (banda CTA) |
| TOURS | `/tours/:slug` ×4 | `data/tours.ts`, `cabecera-ficha.tsx`, `descripcion-tour.tsx`, `itinerario.tsx`, `incluye-tour.tsx`, `menu-tour.tsx`, `carta-charter.tsx`, `comparador-premium.tsx`, `antes-de-reservar.tsx` |
| NOSOTROS | `/tripulacion`, `/flota`, `/instalaciones`, **Marine Park (nueva)** | `data/equipo.ts`, `data/flota.ts`, `data/nosotros.ts`, `data/instalaciones.ts`, `familia-hispaniola.tsx`, `zonas-instalaciones.tsx`, dropdown-nosotros |
| EVENTOS | `/eventos/:slug` ×3 | `data/eventos.ts`, `cabecera-evento.tsx`, `paquetes-evento.tsx`, `widget-evento.tsx` |
| SOSTENIBILIDAD | `/ventaja-competitiva`, `/fundacion` | `data/sostenibilidad.ts`, `data/fundacion.ts` |

## Esfuerzo / riesgo

**Esfuerzo:** alto (es la corrección más transversal que ha pedido el cliente).
**Riesgo:** medio — el riesgo real no es romper lógica (los diffs son de
strings) sino DEJAR español residual en estados poco visitados. Por eso el
barrido F7 es una fase propia con checklist, no un «al final lo repasamos».

## 7. ✅ Decisiones cerradas (Samuel, 2026-08-06)

1. **Slugs de rutas** → inglés (§4).
2. **Blog** → se traduce (la instrucción original dice «absolutamente toda la
   web»). Son 4 artículos largos: es el bloque de texto más grande del
   barrido F7, se hace en su propio commit.
3. **Legales** → se traducen las 4.
4. **Reseñas/testimonios** → **en inglés, reales**: se sustituyen las citas
   en español por reseñas que YA existen en inglés en Viator/TripAdvisor/
   Facebook de Hispaniola. No se traduce a un cliente real (una reseña
   traducida deja de ser textual), no se inventa ninguna.
   ⚠️ Requiere ir a buscarlas a las plataformas: mientras no estén
   verificadas una a una, las que falten quedan `[placeholder-v3]` con la
   reseña ES actual y nota, en vez de una traducción falsa.
