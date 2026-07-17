# Hispaniola

Rediseño en Figma de la web de Hispaniola Aquatic Adventures. Samuel diseña, Derick desarrolla.
El diseño final de la home se construye primero en React (`app/`, ver `app/PLAN.md`) y
luego se traslada a Figma vía MCP — mismo flujo probado en Eventus/Synexia.

## Reglas del proyecto React (`app/`)

- **Todo pasa por tokens** (`app/src/styles/tokens.css`, `@theme` de Tailwind v4). Cero
  hex o valores mágicos en componentes — esos tokens serán las variables de Figma en
  el traspaso. Si un color/tamaño/radio no existe como token, se añade el token primero.
- **Dirección visual = B "Charter Premium"** (`analisis/direccion-visual.md`). El aqua
  es acento con cuentagotas (marca/links/badges), nunca fondo grande de sección.
- **Un componente React = un futuro componente Figma**: nombres claros en
  `src/components/ui/` (piezas reusables) y `src/components/home/` (una por sección).
- **AlignUI en las páginas internas** (desde 2026-07-16, `app/PLAN-ALIGNUI.md`):
  la ficha de tour y el resto de páginas internas usan el design system AlignUI
  (copy-in del vendor en `src/components/alignui/` + `src/lib/alignui/`), tematizado
  a la paleta Hispaniola en `src/styles/alignui.css`. **La home y el shell NO lo
  usan** — AlignUI vive de la ficha hacia dentro. Esto deroga «sin librerías de UI»
  solo para internas. `src/components/alignui/` y `src/styles/alignui.css` son la
  capa de tokens del sistema AlignUI: sus hex/valores están ahí a propósito y se
  excluyen del grep de «cero hex», igual que `src/dev/`. Las piezas vendor NO se
  editan a mano — se personalizan por `className`/wrappers. En Figma mapean al kit
  de Figma de AlignUI (licencia Pro), no a componentes dibujados desde cero.
- **Dev Mode obligatorio**: cada bloque/estado nuevo se registra en
  `app/src/dev/dev-registry.ts` en el mismo commit que lo crea. Las líneas que el Dev
  Mode obliga a tocar en componentes de producto se marcan `// [dev-mode]`.
- **Nada de `src/dev/` (ni líneas `[dev-mode]`) va a Figma** — se excluyen al preparar
  el traspaso (ver playbook `dev-mode-glosario-prototipo` del cerebro).
- **El código NUNCA se importa a Figma** con Anima/html.to.design (regla de oro del
  playbook `codigo-a-figma`) — el traspaso se construye a mano con componentes reales.
- Contenido/copy/precios se portan de `prototipo/datos.js` (fuente canónica), nunca
  se inventan. Fotos: reales de la web actual, no stock.

## Cerebro del dueño (Samuel)

Samuel mantiene playbooks reutilizables en
`C:\Users\kevin\OneDrive\Desktop\Cerebro\playbooks\` (índice: `playbooks-moc.md`).
- Antes de tareas de diseño→código, código→Figma, o patrones WordPress/Oxygen,
  lee el playbook correspondiente.
- El estado y las decisiones de este proyecto viven en
  `C:\Users\kevin\OneDrive\Desktop\Cerebro\proyectos\hispaniola.md`.
- Al descubrir un patrón nuevo, resolver algo difícil o cerrar una etapa,
  PROPÓN actualizar el playbook o la nota del proyecto (no lo hagas en silencio).
