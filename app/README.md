# Hispaniola — Home en diseño final (React)

Diseño visual final de la home de Hispaniola Aquatic Adventures, construido en
React para trasladarse después a Figma vía MCP (mismo flujo que Eventus y
Synexia — ver playbook `codigo-a-figma` del cerebro). Ver el plan completo,
fase por fase, en [`PLAN.md`](./PLAN.md).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` (o el puerto que indique Vite). Requiere Node 18+.

- `npm run build` — build de producción (`dist/`).
- `npm run dev` — servidor de desarrollo con HMR.

## Qué es y qué no es

- **Es**: el diseño visual final de la **home únicamente**, con el copy y los
  datos exactos del wireframe/prototipo aprobado (`prototipo/`), fotos reales
  de la web actual (nada de stock ni IA), y la Dirección visual B — "Charter
  Premium" (`analisis/direccion-visual.md`).
- **No es**: el resto del sitio (eso sigue viviendo en `prototipo/`, la SPA
  vanilla navegable), ni el traspaso a Figma (fase posterior), ni código de
  producción para Derick — es la base visual desde la que se construye el
  archivo Figma.
- Los enlaces a páginas fuera de la home (ficha de tour, eventos, nosotros,
  FAQ…) no navegan — muestran un tooltip "Vive en el prototipo navegable" y
  apuntan a `prototipo/` como su referencia real.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + React Router. Sin librerías de
UI ni de animación (todo componente es propio). Iconos: `lucide-react`.
Fuentes self-hosted vía `@fontsource` (Lora + Inter).

## Estructura

```
app/
├── PLAN.md                 ← plan de ejecución por fases (F0-F7)
├── public/fotos/           ← 35 fotos reales extraídas de la web actual
└── src/
    ├── styles/tokens.css   ← TODOS los tokens (Tailwind v4 @theme)
    ├── data/home.ts        ← contenido (tours, platos, ocasiones), portado
    │                          de prototipo/datos.js
    ├── components/ui/      ← Boton, Logo, EnlacePrototipo
    ├── components/home/    ← una sección de la home por archivo
    ├── dev/                ← Dev Mode (glosario navegable, NO va a Figma)
    └── pages/
        ├── home.tsx        ← compone todas las secciones
        └── fundaciones.tsx ← swatches + type scale, para validar tokens
```

## Reglas de diseño (ver también `CLAUDE.md` del repo)

- **Cero valores mágicos**: todo color/tamaño/radio/sombra vive en
  `tokens.css`. Un `grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/ src/pages/`
  no debería encontrar nada fuera de `fundaciones.tsx` (esos hex son texto de
  documentación, no estilos) y `src/dev/` (tooling excluido del traspaso).
- **El aqua es acento con cuentagotas** — nunca fondo grande de sección (ver
  guardarraíles en `analisis/direccion-visual.md` §6).
- **Contenido real, nunca inventado**: precios, copy y fotos vienen del
  wireframe aprobado o de la web actual. Donde falta un dato real (precio de
  Isla Saona, foto de Surf & Turf en alta resolución) se omite o se marca
  como pendiente — no se rellena con placeholders creíbles.

## Dev Mode

Botón flotante **Dev** (esquina inferior derecha, o `Ctrl/⌘ + .`): glosario de
todos los bloques y estados de la home con deep-links (`?dev-mega=tours`,
`?dev-buscador=abierto`, etc.). Ver `src/dev/dev-registry.ts` para el
registro completo. Nada de `src/dev/` se traslada a Figma.

## Cómo pedir cambios

El contenido (precios, copy, tours) vive en `src/data/home.ts` — la mayoría
de cambios de texto no tocan los componentes. Para cambios de estructura o
una sección nueva, indica qué bloque del wireframe/prototipo quieres ajustar;
`prototipo/wireframes-completos.html` y `prototipo/app.js` siguen siendo la
referencia de contenido y orden aprobados.
