# Hispaniola — Home en diseño final (React)

Diseño visual final de la home de Hispaniola Aquatic Adventures, construido en
React para trasladarse después a Figma vía MCP (mismo flujo que Eventus y
Synexia — ver playbook `codigo-a-figma` del cerebro).

- [`PLAN.md`](./PLAN.md) — cómo se construyó la home (v1, tag `v1.0-home-diseno`).
- [`PLAN-v2.md`](./PLAN-v2.md) — **la versión actual**: dirección «Boutique
  luminoso» (tag `v2.0-home-boutique`). Hero con baraja de tours en rotación,
  photo-stack, más aire y Poppins en toda la web.

## Lo que hay que saber de la v2

- **El hero ya no lleva buscador de disponibilidad**: lo sustituye una **baraja
  de los 4 tours** que rota sola cada 4s (la activa está al frente; al avanzar
  sube, encoge y se va al final de la cola). Cada card es un producto real con
  precio y CTA — es decir, la baraja *asume* el papel de camino a la reserva
  que tenía el buscador. Se conservan el CTA primario, el sticky de móvil y el
  grid de tours debajo.
- **Congelar la baraja** (imprescindible para el traspaso a Figma): `?dev-baraja=semi-privado`
  · `=snorkel-lovers` · `=charter-privado` · `=isla-saona` · `=estatica`.
  Cada deep-link fija esa card como activa **y detiene el auto-avance**.
- La baraja es un **loop infinito** → en Figma va como *componente interactivo*
  con una variante por card, no como cadena de frames (playbook
  [[animaciones-a-figma]]). Los delays salen de los tokens `--baraja-*`, no
  "a ojo": si cambias el token, cambia el prototipo de Figma.

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
UI ni de animación (todo componente es propio; la baraja son transiciones CSS
+ un `setInterval`). Iconos: `lucide-react`. Fuente self-hosted vía
`@fontsource`: **Poppins**, en titulares y cuerpo.

## Estructura

```
app/
├── PLAN.md                 ← plan de ejecución por fases (F0-F7)
├── public/fotos/           ← 35 fotos reales extraídas de la web actual
└── src/
    ├── styles/tokens.css      ← TODOS los tokens (Tailwind v4 @theme)
    ├── styles/componentes.css ← CSS a medida (el hover del photo-stack; ahí
    │                             está explicado por qué no son utilidades)
    ├── data/home.ts           ← contenido (tours, platos, ocasiones), portado
    │                             de prototipo/datos.js
    ├── components/ui/         ← Boton, Logo, Etiqueta, PilaFotos, EnlacePrototipo
    ├── components/home/       ← una sección de la home por archivo (+ BarajaHero)
    ├── dev/                   ← Dev Mode (glosario navegable, NO va a Figma)
    └── pages/
        ├── home.tsx           ← compone todas las secciones
        └── fundaciones.tsx    ← swatches + type scale, para validar tokens
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
