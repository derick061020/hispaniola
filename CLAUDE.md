# Hispaniola

Web de Hispaniola Aquatic Adventures. **Samuel diseña y dirige; Derick desarrolla.**
Parte del trabajo de Miguel (sueldo semanal), no freelance.

## Dónde está el proyecto hoy (2026-08-10)

El repo empezó como fuente para un rediseño en Figma. **Hoy `app/` es el frontend real
de producción**: 25 páginas, 33 rutas, en inglés, desplegado en Vercel. Ya no es una
maqueta. El traspaso a Figma **sigue declarado vivo en paralelo** (`app/PLAN-LANZAMIENTO.md`)
— si va a cerrarse, preguntar a Samuel; no deducirlo.

**El proyecto está en HANDOFF a desarrollo.** Derick recoge dos encargos:
conectar el motor de reservas (Odoo / sustituir xpotours) y terminar el multi-idioma.

👉 **Antes de cualquier tarea, lee [`README.md`](README.md)** — es el estado real
verificado: stack, cómo arrancar, rutas, la frontera con el backend, el mapa del
idioma y los datos que no están confirmados por el cliente. Este archivo son solo
las reglas de trabajo.

## Estructura

| Dónde | Qué |
|---|---|
| `app/` | **El producto.** Todo lo que se despliega. |
| `docs/proceso/` | Historia: research, wireframes, capturas, las 3 tandas de correcciones del cliente. Índice en [`docs/README.md`](docs/README.md). No se despliega. |
| `prototipo/` | SPA vanilla navegable. Fuente canónica de copy general. No entra en el build. |

## Reglas del proyecto React (`app/`)

- **Todo pasa por tokens** (`app/src/styles/tokens.css`, `@theme` de Tailwind v4). Cero
  hex o valores mágicos en componentes — esos tokens serán las variables de Figma en
  el traspaso. Si un color/tamaño/radio no existe como token, se añade el token primero.
  Antes de crear uno, comprobar que no existe ya con otro nombre.
- **Dirección visual = B "Charter Premium"** (`docs/proceso/analisis/direccion-visual.md`).
  El aqua es acento con cuentagotas (marca/links/badges), nunca fondo grande de sección.
- **Un componente React = un futuro componente Figma**: nombres claros en
  `src/components/ui/` (piezas reusables) y por sección en el resto.
- **AlignUI en las páginas internas** (`app/PLAN-ALIGNUI.md`): copy-in del vendor en
  `src/components/alignui/` + `src/lib/alignui/`, tematizado en `src/styles/alignui.css`.
  Esto deroga «sin librerías de UI» solo para internas. Los hex de esas dos carpetas
  están ahí a propósito y se excluyen del grep de «cero hex», igual que `src/dev/`.
  Las piezas vendor NO se editan a mano — se personalizan por `className`/wrappers.
- **Dev Mode**: cada bloque/estado nuevo se registra en `app/src/dev/dev-registry.ts`
  en el mismo commit que lo crea; las líneas que obliga a tocar en componentes de
  producto se marcan `// [dev-mode]`. ⚠️ Esta regla es del **flujo de diseño**:
  mantener el registro no es tarea de desarrollo.
- **Nada de `src/dev/` (ni líneas `[dev-mode]`) va a Figma.**
- **El código NUNCA se importa a Figma** con Anima/html.to.design (regla de oro del
  playbook `codigo-a-figma`) — el traspaso se construye a mano con componentes reales.
- **Contenido/copy/precios nunca se inventan.** Copy general: `prototipo/datos.js`.
  Precios: `docs/proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md` (canónico).
  Copy v3 aprobado: los PDF `WEBSITE-*` de `docs/proceso/correcciones-v3-cliente/`.
  Fotos: reales del cliente, no stock. Lo que falta se deja marcado, no se rellena.
- **Los comentarios en español son la documentación del proyecto.** Explican el porqué
  con fecha y quién lo pidió. No se borran ni se resumen. Marcadores: `⚠️`, `[vN]`.
  El código y la UI van en inglés; nombres de archivo y comentarios, en español.

## Trampas que cuestan tiempo (verificadas)

- **`npx tsc --noEmit` no comprueba NADA.** El `tsconfig.json` de `app/` es
  `{"files": [], "references": […]}`. Usar `npm run typecheck` (= `tsc -b`).
  Ya dejó pasar un import roto que tumbó las 4 fichas de tour.
- **Los redirects no se ven en `npm run dev`** — ahí gana el router de la SPA.
  Se prueban con `npm run build && npm run preview`.
- **Los scripts de `app/qa/` siempre "pasan"**: ninguno devuelve exit ≠ 0. Hay que
  leer la salida.
- **Deploy = Vercel** con Root Directory `app`. `app/vercel.json` es la única config
  (el `netlify.toml` se borró el 2026-08-10). Una ruta nueva se toca en
  `App.tsx` + `public/sitemap.xml` + `vercel.json`, en el mismo commit.
- ✅ **RESUELTO (2026-08-18): el precio lo pone Odoo, y solo Odoo.** Había dos
  motores —la ficha calculaba en el navegador con `calcularTotalTour()` y el
  checkout usaba `precioLight × personas`, con desvíos de hasta +3.570 USD—.
  Ahora los dos preguntan al servidor (`/quote` en la ficha vía
  `use-cotizacion.ts`, `/checkout/sync` en el funnel). El cálculo local se queda
  como lo que se pinta mientras la respuesta viaja y como red si Odoo no
  contesta; en ese caso el total sale rotulado como estimación, no como precio.
- ✅ **RESUELTO (2026-08-18): la lógica de producto ya no lee el texto visible.**
  La carta del charter sale de `subVariante.duracionHoras` (un número) y no de
  `duracion.startsWith('3')`, que se rompía con «3.5 hours» y habría mandado a
  todos los grupos a la carta de 4 h en cuanto esa etiqueta se tradujera.
- ⚠️ **Lo que NO se puede arreglar desde el código**: el Odoo de producción
  tiene que tener el catálogo sembrado (`scripts/seed_catalog.py`) y los
  dominios reales en `cors_origins`. Sin eso el funnel no crea la reserva —
  ahora al menos lo dice en pantalla en vez de fallar al pulsar «Pay».

## Trabajo en paralelo

Samuel edita este mismo árbol mientras corren sesiones de agente. **Si `git status`
muestra más cambios de los que hiciste tú, asume edición concurrente**: no hagas
`git add` de un archivo compartido que mezcle su WIP con el tuyo — reconstruye tu
versión con `git show HEAD:<path>` + tus ediciones, y stagea con `hash-object` +
`update-index --cacheinfo`. Commitea **sin pathspec**. Nunca `git stash`.
Avísale una vez y sigue trabajando.

## Cerebro del dueño (Samuel)

Playbooks reutilizables en `C:\Users\kevin\OneDrive\Desktop\Cerebro\playbooks\`
(índice: `playbooks-moc.md`).
- Antes de tareas de diseño→código, código→Figma, o patrones WordPress/Oxygen,
  lee el playbook correspondiente.
- El estado y las decisiones de este proyecto viven en
  `C:\Users\kevin\OneDrive\Desktop\Cerebro\proyectos\hispaniola.md`.
- Al descubrir un patrón nuevo, resolver algo difícil o cerrar una etapa,
  PROPÓN actualizar el playbook o la nota del proyecto (no lo hagas en silencio).
