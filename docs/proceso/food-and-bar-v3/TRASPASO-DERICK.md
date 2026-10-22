# Traspaso a Derick — Nueva sección Food & Bar (`/food-and-bar`)

Aprobada por Samuel el 2026-10-22. La vista previa de Vercel hizo de QA, así que no hace falta subir nada a botizate.
Derick revisa el PR y lo pasa a producción él mismo. Rama del PR: `food-and-bar-pr`, **desde `backend-odoo`
(d0d5a5b)**, que es lo que sirve hoy hispaniolaaquaticadventures.com (el `index-sRLlkd59.js` del sitio en vivo es el de
`derick/build`, construido desde d0d5a5b).

Vista previa aprobada (noindex, sin backend de producción):
https://hispaniola-food-and-bar-preview-samuelurbis-projects.vercel.app/food-and-bar

## Qué añade
Una página nueva, **`/food-and-bar`**: Floating Kitchen (carrete de fotos con visor), menús de los tours en 4 tarjetas
comparables (Light, Premium, Taste of Hispaniola + buffet de brochetas, Buffet de la playa), menús de eventos en 4 tarjetas
(Starfish, Breeze, Tide, Premium/Turtle), Open Bar (con el tramo de agua del Museo) y niveles de barra de eventos, y un
cierre «Pick your tour». Índice lateral (escritorio) o barra inferior compacta (móvil) y CTA fijo con dos botones
(«Book your tour» → `/tours`, «Plan an event» → `/events`). ES/EN con el diccionario de siempre.
Todo el contenido sale de datos ya aprobados (`FICHAS`, `PAQUETES_COMIDA`, `BARRAS_EVENTO`); nada inventado.

## Archivos (80 en el diff: 35 de código/datos, 44 imágenes y este documento)
**Nuevos — la página y sus piezas**
- `app/src/pages/comida-y-bar.tsx` — la página (`ComidaYBarPage`).
- `app/src/components/comida-y-bar-v3/*` (11 archivos: héroe, cocina, menús, tarjetas, eventos, bar, niveles, cierre, índice,
  barra de reserva, burbujas). El sufijo `-v3` es historia del diseño, no una versión paralela.
- `app/src/components/comida-y-bar/menus-datos.ts` — modelo de los menús (lee de `FICHAS`).
- `app/src/data/comida-y-bar.ts`, `app/src/data/comida-y-bar-v3.ts` — textos aprobados y rótulos.
- `app/src/styles/comida-y-bar.css`, `app/src/styles/comida-y-bar-v3.css` — estilos de la página.

**Modificados (solo lo imprescindible)**
- `app/src/App.tsx` — ruta `/food-and-bar` y la entrada `['/comida-y-bar', '/food-and-bar']` en `REDIRECCIONES_ES_EN`.
- `app/vercel.json` — redirect 301 `/comida-y-bar` → `/food-and-bar`. Nada más.
- `app/scripts/genera-sitemap.mjs` y `app/public/sitemap.xml` — la URL `/food-and-bar` (1 bloque `<url>`; el resto, intacto).
- `app/src/data/home.ts` — ítem «Food & Bar» en el menú «About us» (`NAV_NOSOTROS`) y enlaces «See the menus» / «See the Open
  Bar» en los ítems Floating Kitchen y Open Bar del bloque «Incluye» de la home.
- `app/src/components/home/footer.tsx` — enlace «Food & Bar» en el footer.
- `app/src/components/home/incluye-crucero.tsx` — pinta el `enlace` opcional de esos ítems.
- `app/src/components/home/item-menu.tsx` — icono del ítem del menú.
- `app/src/components/ui/aviso-museo.tsx`, `aviso-party-boat.tsx` — el aviso flotante calla en `/food-and-bar` (como en el Museo).
- `app/src/index.css` — 2 `@import` de los estilos nuevos. `app/src/styles/tokens.css` — solo **añade** tokens `--*-comida3-*`.
- `app/src/lib/i18n/es.ts` — solo cadenas nuevas (Derick había añadido una línea al final en d0d5a5b: se conserva).
- **Compartidos, con la prop nueva OPCIONAL y comportamiento por defecto idéntico:**
  `museo/fondo-profundidad.tsx` (`foto`, `null` = agua sin foto; la pausa fuera de pantalla solo se activa con `foto={null}`),
  `museo/use-descenso.ts` (`profMax`, `profMin`; por defecto `1` y `0` = igual que antes),
  `tour/galeria-lightbox.tsx` (`alts` opcional; las etiquetas fijas en español pasan por `t()`),
  `internas/hero-interna.tsx` (`fetchPriority="high"` en la imagen del héroe, que es el LCP),
  `data/eventos.ts` (solo `export` de `NOTA_PAQUETES`).

**Imágenes** — 44 `.webp` en `app/public/fotos/comida-bar/`, **1,8 MB en total** (la mayor, 118 KB). Fotos reales del cliente
(escaladas con Magnific Precision), recortes de platos, 6 ilustraciones del índice y las bebidas del Open Bar (ilustrativas,
sin marca). El héroe lleva `srcset` (800 w / 1440 w).

## Rutas y redirects
- Nueva: `/food-and-bar` (indexable; title, description y canonical propios; en el sitemap).
- `/comida-y-bar` → 301 → `/food-and-bar` (en `vercel.json`; y en `REDIRECCIONES_ES_EN` para el router).
- No existe ninguna otra ruta nueva ni `/food-and-bar-v3`.

## Enlaces nuevos
Menú «About us» → «Food & Bar»; footer (columna «Company») → «Food & Bar»; home, bloque «Incluye»: Floating Kitchen →
`/food-and-bar#menus`, Open Bar → `/food-and-bar#open-bar`.

## Qué NO toca
Odoo, checkout, reservas, pagos (Stripe), analítica (GTM/gtag/Clarity siguen como están en `index.html`), variables de entorno
(`.env*`), `vercel.json` aparte del redirect, `robots.txt`, ni ninguna otra página. El texto del open bar del charter se
queda como estaba (pendiente del cliente).

## Cómo probarlo
```
cd app
npm ci
npm run build && npm run preview      # los redirects solo se ven aquí, no en `npm run dev`
```
Revisar: `/food-and-bar` (1440 y 390), `/comida-y-bar` (debe redirigir), el menú «About us» → Food & Bar, el footer, y en la home
los dos enlaces del bloque «Incluye». Comprobar que home, una ficha de tour, `/events`, `/underwater-museum` y `/fleet` siguen igual.

## Comprobaciones hechas (en esta rama, sobre `backend-odoo` d0d5a5b)
- `npm run typecheck` ✅ · `npm run build` ✅ (tsc + vite + sitemap + htaccess).
- `npm run lint`: 0 errores nuestros. Hay **2 errores que ya existían** en `components/tour/widget-reserva.tsx` (hooks
  condicionales, código de Derick que no se toca) y 3 avisos `only-export-components` en archivos nuevos.
- `npm run qa:rutas` (preview local, las 35 rutas del script, escritorio y móvil): solo aparece el CORS esperado de `localhost` contra el Odoo
  de producción; nada más.
- Comparación contra producción en vivo (home, ficha Caribbean Escape, /events, Museo, /fleet; 1440 y 390): el texto y los
  enlaces son idénticos salvo lo intencionado (enlace «Food & Bar» en el menú/footer y los dos de la home; contadores y
  «Booked N min ago», que cambian solos). El alto de cada página sube 28 px (la fila nueva del footer). Diferencia de píxeles
  en la primera pantalla: 0–0,8 % (la ficha de tour a 1440 llega a 3,4 %: fotograma distinto del vídeo del héroe).
- `/food-and-bar`: indexable (sin `noindex`), `<title>`, description, canonical (usa el origen: el dominio de producción) y
  GTM/gtag/Clarity cargan como en el resto. `og:*` son los estáticos de `index.html`, iguales en todas las páginas del sitio.
- `entrega.mjs` contra el preview local: ✅ og:url, og:image, robots+sitemap (44 URL), indexable, GTM, enlaces de la portada (32 sin
  romper), privacidad. ❌ solo los propios de un servidor local: SSL/http→https y canonical `localhost`, el «404 falso» de la
  SPA (igual que hoy en producción) y la consola con el CORS de `localhost`.
- Revisión de secretos (sin gitleaks: grep de claves/tokens/credenciales en el diff y `.env*`): nada.

## Conflictos al ponerla al día
Solo uno: `app/src/lib/i18n/es.ts` (las dos partes añadían líneas al final). Se conservaron **las dos**: la de Derick («Your
email (for the payment receipt)») y el bloque de Food & Bar. Ningún otro archivo de los 4 commits de Derick desde el 16/10
(checkout, mi-reserva, atribución, Stripe) coincide con los nuestros.

## Cómo volver atrás
Revertir el merge del PR (`git revert -m 1 <merge>`). No hay migraciones ni cambios de datos: la ruta, los enlaces y el
redirect desaparecen con el revert.
