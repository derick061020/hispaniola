# PLAN — AlignUI en las páginas internas (etapa A)

Decisión de Samuel (2026-07-16): las **páginas internas** adoptan **AlignUI** como
base de componentes para una UI más pro — breadcrumbs, inputs, modales, selects,
botones… «todo lo que se pueda». Esto **deroga dos reglas** escritas:

- ~~«Sin librerías de UI»~~ (PLAN.md §Stack) — derogada **solo para internas**.
- ~~«AlignUI no aplica aquí»~~ (PLAN.md §Stack) — derogada con el mismo alcance.

**Alcance confirmado con Samuel (AskUserQuestion, 2026-07-16):**

1. **Solo lo que existe hoy**: la base AlignUI + reemplazo integral en la **ficha
   de tour**. El funnel de reserva, el listado `/tours` y los eventos siguen
   bloqueados por la decisión del motor xpotours — cuando se desbloqueen, se
   construyen YA sobre esta base.
2. **La home y el shell compartido quedan intactos**: header, megamenús, menú
   móvil, footer y toda sección de la home no se tocan. AlignUI vive de la ficha
   hacia dentro. Un componente compartido con la home solo puede cambiar si el
   resultado es **visualmente idéntico** en la home (y en esta etapa: ninguno).

## Fuentes

- **Componentes Pro (local)**: `C:\Users\kevin\OneDrive\Documentos\Claude Code\
  Synexia\referencia-alignui\{finance,hr,marketing}\components\ui\` — 43 piezas.
  `finance/` es la fuente primaria (la que Synexia ya validó).
- **Documentación pública**: alignui.com (para piezas que los templates no
  traen, p. ej. Accordion).
- **Patrones ya aprendidos** (cerebro, `proyectos/synexia-health.md`): copy-in,
  personalizar sin tocar el vendor, reusar recetas para superficies nuevas.

## Por qué NO se copia la adaptación de Synexia tal cual

Synexia está en **Tailwind v3 + React 18** (config JS con `theme.colors` +
`globals.css` con vars HSL). Hispaniola es **Tailwind v4 + React 19** (`@theme`
CSS-first). La capa de tokens se **porta** a sintaxis v4, no se copia.

## Arquitectura del copy-in

```
src/
├── components/alignui/   ← piezas vendor (button, select, modal, badge…).
│                            NO se editan salvo: rutas de import y nada más.
│                            Cabecera de cada archivo: origen + qué se cambió.
├── lib/alignui/          ← utils del vendor: cn.ts (twMerge extendido),
│                            tv.ts, polymorphic.ts, recursive-clone-children.tsx,
│                            use-tab-observer.ts
└── styles/alignui.css    ← la capa @theme: slots AlignUI → tokens Hispaniola
```

**Regla de tokens (sigue viva, intacta):** los slots de AlignUI
(`--color-bg-weak-50`, `--text-label-sm`, `--radius-10`…) se definen en
`alignui.css` **apuntando a los tokens Hispaniola existentes** (`var(--color-*)`),
nunca a valores nuevos sueltos. Si un slot necesita un valor que Hispaniola no
tiene, primero se añade el token a `tokens.css` (o se documenta el porqué de una
excepción). En el traspaso, esta capa mapea 1:1 a las **variables de la librería
Figma de AlignUI** (la licencia Pro incluye el kit de Figma) — tematizada con la
paleta Hispaniola. Un componente AlignUI en código = el componente equivalente
del kit AlignUI en Figma.

### Mapa de slots (los que usan las piezas copiadas)

| Slot AlignUI | Token Hispaniola | Nota |
|---|---|---|
| `bg-white-0` | `--color-papel` | |
| `bg-weak-50` | `--color-papel-hueso` | |
| `bg-soft-200` | `--color-linea` | |
| `bg-sub-300` | `--color-linea-fuerte` | |
| `bg-surface-800` / `bg-strong-950` | `--color-navy` | |
| `text-strong-950` | `--color-navy` | |
| `text-sub-600` | `--color-navy-sub` | |
| `text-soft-400` | `--color-navy-soft` | |
| `text-disabled-300` | `--color-linea-fuerte` | mismo rol cromático que el neutral-300 de AlignUI (#cbd2dc ≈ #c3ced4); no se inventa un gris nuevo |
| `text-white-0` / `stroke-white-0` / `static-white` | `--color-papel` | |
| `stroke-strong-950` / `static-black` | `--color-navy` | el «negro» de Hispaniola ES el navy |
| `stroke-sub-300` | `--color-linea-fuerte` | |
| `stroke-soft-200` | `--color-linea` | |
| `primary-base` | `--color-coral` | primary = ACCIÓN (CTA); el aqua sigue siendo acento de marca, no de botón |
| `primary-dark` / `primary-darker` | `--color-coral-dark` | Hispaniola no tiene tercer escalón; mismo valor documentado |
| `primary-alpha-*` | `color-mix(coral N%, transparent)` | |
| `information-*` / `verified-*` | familia `--color-aqua*` | badges informativos |
| `success-*` | `--color-menta-texto` / `--color-menta` | |
| `faded-*` | grises navy (`navy-sub`/`navy-soft`/`linea`/`papel-hueso`) | |
| `overlay` | `--color-overlay-foto` | |
| `radius-10` | `--radius-btn` | ¡ya son 10px los dos! |
| `radius-20` | 1.25rem (= `--radius-notch`) | mismo valor; se documenta en el propio slot |
| texts `label-*`/`paragraph-*`/`subheading-*` | valores AlignUI literales | son la ESCALA del sistema AlignUI (Figma kit); no se fuerzan sobre --text-h2/lead |
| shadows `regular-*`/`fancy-buttons-*`/focus | valores AlignUI, colores via tokens | |

La tipografía NO se toca: las piezas heredan **Poppins** del body (AlignUI no
fija font-family en los componentes).

## Dependencias nuevas (todas del vendor, ninguna de animación)

`@radix-ui/react-select`, `@radix-ui/react-scroll-area`, `@radix-ui/react-dialog`,
`@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@remixicon/react` (SOLO dentro
del vendor; el código propio sigue con lucide), `clsx`, `tailwind-merge`,
`tailwind-variants`, `merge-refs`. **Sin framer-motion** — verificado pieza a
pieza antes de este plan: ninguna de las copiadas lo usa.

## Inventario de reemplazo en la ficha (`src/components/tour/`)

| Pieza actual | Sustituto AlignUI | Nota |
|---|---|---|
| selects nativos horario/personas (widget) | **Select** (Radix) | estados focus/abierto/hover pro; el salto de calidad más visible |
| CTA «Continuar — US$ N» / «Pedir cotización» | **FancyButton** primary | la receta con relieve; coral vía `primary-base` |
| CTA WhatsApp | **FancyButton** neutral (navy) | |
| CTA deshabilitado «Elige una fecha» | **FancyButton** disabled | estado real `disabled`, como ahora |
| chips cabecera (Cancelación gratis, Recogida…) | **StatusBadge** | |
| meta de rating (4.9 · N reseñas) | queda | Estrellas es pieza de marca |
| breadcrumb | queda (restyle fino si acaso) | AlignUI Pro local NO trae breadcrumb |
| chips de 14 fechas (widget) | quedan | son diseño de conversión propio; no hay pieza equivalente |
| lightbox (portal a mano) | **Modal** (Radix Dialog) + **CompactButton** | focus-trap/scroll-lock/Escape de Radix; flechas y contador propios se conservan (con su fix `min-w-0 flex-1`) |
| «Ver las N fotos →», «Ver comparación →» | **LinkButton** | |
| anclas de sección (sticky) | **TabMenuHorizontal** | la mecánica scroll (irA, scroll-mt) se conserva; cambia la piel |
| acordeón FAQ (`ui/acordeon`) | **Accordion** SI las docs públicas dan la pieza portable; si no, queda | los templates Pro no lo traen; la home conserva `ui/acordeon` INTACTO en cualquier caso |
| barra móvil fija | su CTA pasa a **FancyButton**; el resto queda | |
| comparador-strip | queda (LinkButton dentro) | es franja de conversión propia |
| itinerario / incluye / menú / opiniones | quedan; badges puntuales si aportan | son contenido editorial, no chrome de UI |

**Lo que NO se toca:** `ui/boton`, `ui/acordeon`, `ui/etiqueta`,
`ui/enlace-prototipo`, `ui/carrusel-imagenes` (compartidos con la home),
`home/*`, `header`, `footer`, `menu-movil`.

## Fases (commit por fase; verificación Playwright antes de cada commit)

- **A0** — checkpoint: tag `pre-alignui`; registrar estado del árbol (trabajo
  paralelo de IncluyeCrucero sigue sin comitear y sin tocar).
- **A1** — infraestructura: deps + `lib/alignui/` + `styles/alignui.css` +
  copy-in de las piezas + smoke-test en una ruta dev (`?dev-alignui`) que
  renderice cada pieza. Registro en dev-registry (mismo commit).
- **A2** — widget de reserva: Select ×2, FancyButton ×3 estados, barra móvil.
- **A3** — lightbox sobre Modal + LinkButton en galería.
- **A4** — cabecera (chips → StatusBadge) + anclas → TabMenuHorizontal +
  comparador (LinkButton).
- **A5** — FAQ (Accordion si es portable) + repaso de piezas menores.
- **A6** — QA final + docs + tag `v1.1-ficha-alignui`.

## Criterios de QA (A6, y por fase lo que aplique)

1. `git diff --name-only pre-alignui` **no contiene** ningún archivo de
   `components/home/`, ni `ui/boton|acordeon|etiqueta|enlace-prototipo|
   carrusel-imagenes` — la garantía dura de «home intacta».
2. Home espot-check en navegador (computed styles del CTA hero, acordeón FAQ,
   header): idénticos a antes.
3. `tsc` + `npm run build` limpios; 0 errores de consola en `/` y en las 4
   fichas (con recarga completa, no HMR).
4. Los deep-links dev existentes siguen: `?dev-widget=fecha`,
   `?dev-galeria=abierta`, `?dev-mega=tours`, `?dev-movil=abierto`.
5. Flujo de conversión intacto: CTA deshabilitado sin fecha → total correcto al
   elegir (Light × personas), agotados no clicables, sin enlaces a Viator.
6. Responsive 390px: widget, selects abiertos, modal, barra móvil.
7. `grep` de hex en `src/components/tour/` sigue dando 0; los hex del vendor
   viven SOLO en `alignui.css` (documentados) y en `components/alignui/` (que
   es capa de tokens del sistema AlignUI, excluida del grep con el mismo
   estatus que `src/dev/`).

## Decisiones abiertas para Samuel

1. **Breadcrumb**: ¿portar el de las docs públicas (si es copiable) o dejar el
   nuestro con restyle? Hoy: queda el nuestro.
2. **Chips de fecha del widget**: ¿migrarlos a una receta AlignUI (Tag/
   SegmentedControl) o mantener el diseño propio de conversión? Hoy: quedan.
3. **El resto del sitio interno** (funnel, listado, eventos): esta base queda
   lista para construirlos encima cuando se desbloquee el motor.
