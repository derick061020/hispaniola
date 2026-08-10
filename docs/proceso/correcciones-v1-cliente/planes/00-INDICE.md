# Correcciones v1 del cliente — Índice de planes

> **Qué es esto.** El cliente (Fernando) envió una tanda de correcciones en Google
> Slides (un slide = una página de la web). Están exportadas a PDF en
> `correcciones-v1-cliente/*.pdf`. Este directorio traduce cada PDF a un **plan de
> ejecución** cruzado con el código real del repo (`app/`).
>
> **Leído y planificado:** 2026-07-20. **Estado:** propuesta para revisar con
> Samuel. **Nada se ha ejecutado todavía** — la idea es leer estos planes, ajustarlos
> juntos, y recién entonces implementarlos fase por fase.

## Cómo leer los PDFs (para la próxima tanda)

El visor de PDF del agente necesita poppler (no instalado en esta máquina). La vía
que funcionó: renderizar cada página a PNG con **PyMuPDF** (`fitz`, ya instalado) a
110 dpi y leer las imágenes. Script en el scratchpad de la sesión; si hace falta
repetirlo, es `fitz.open(pdf)` → `page.get_pixmap(dpi=110)` → `pix.save(png)`.

## Los tres tipos de corrección que manda el cliente

1. **Anotaciones con flecha + texto** — dicen explícitamente qué quiere («rehacer con
   formato más moderno», «dale más cariño», «agregar pruebas de compra»).
2. **Páginas de referencia** — un link (vanpraet.be, six2eight.com, letsplayfight.com,
   getblue.com…) + una nota de qué copiar de ahí (un efecto, una calidad de video).
3. **Estructuras generadas con IA** — el cliente pegó maquetas hechas por él con una
   IA. **No copiamos su estética** (gradientes planos, cards genéricas): tomamos la
   ESTRUCTURA / los bloques que propone y los rehacemos con **nuestra dirección
   visual** (Charter Premium, tokens, aqua con cuentagotas). Esto es lo que Samuel
   pidió: «mejorarlos con esa estructura que generó con la IA el cliente pero con
   nuestro estilo de diseño».

## Índice

| # | Plan | PDF origen | Peso del cambio |
|---|---|---|---|
| 1 | [01-home.md](01-home.md) | HOME (19 slides) | **Alto** — 3 secciones nuevas + 6 mejoras + 2 eliminaciones |
| 2 | [02-producto.md](02-producto.md) | PRODUCTO (6 slides) | **Alto** — widget con aceleradores de venta + reseñas + videos |
| 3 | [03-nosotros.md](03-nosotros.md) | nosotros (5 slides) | **Medio-alto** — reestructura con timeline + flota |
| 4 | [04-guias.md](04-guias.md) | Guías de Punta Cana (3 slides) | **Bajo** — sin anotaciones; solo fotos por rellenar |
| 5 | [05-sostenibilidad.md](05-sostenibilidad.md) | sostenibilidad (3 slides) | **Bajo** — sin anotaciones; videos por rellenar |
| 6 | [06-blog.md](06-blog.md) | blog (3 slides) | **Alto** — página NUEVA (no existe en el repo) |
| 7 | [07-mi-reserva.md](07-mi-reserva.md) | GESTIONAR MI RESERVA (1 slide) | **Bajo** — ya casi hecho; solo pulido + acceso por email |
| 8 | [08-faq.md](08-faq.md) | preguntas frecuentes (1 slide) | **Bajo-medio** — la página `/faq` ya existe; validar estructura |

## Lo que este plan NO decide (queda para Samuel)

- **Prioridad y orden** entre secciones. Propongo uno en cada plan, pero es tu
  llamada.
- **Qué correcciones aceptamos tal cual y cuáles empujamos hacia atrás.** Algunas
  piden datos que no tenemos (barras de distribución de reseñas, videos de clientes,
  fotos de eventos reales, widget de reseñas en vivo). Cada plan marca esos huecos.
- **Assets que faltan del cliente** — listados al final de cada plan bajo «Pide al
  cliente».

## Reglas del proyecto que todos los planes respetan

(De `CLAUDE.md` y el cerebro — se repiten en cada plan donde muerden.)

- **Todo pasa por tokens.** Cero hex/valores mágicos en componentes; si un color/
  tamaño no existe como token, se crea el token primero (será variable de Figma).
- **Dirección B «Charter Premium».** El aqua es acento con cuentagotas — nunca fondo
  grande de sección. Las maquetas del cliente usan gradientes planos de borde a
  borde: **eso NO se copia**, se traduce a nuestro sistema.
- **Un componente React = un futuro componente Figma.** Nombres claros, una pieza por
  sección.
- **AlignUI de la ficha hacia dentro** (páginas internas). La home solo usa el
  Accordion (FAQ). No meter AlignUI en secciones nuevas de la home.
- **Dev Mode obligatorio:** cada bloque/estado nuevo se registra en
  `dev/dev-registry.ts` en el mismo commit, con sus `?dev-*` deep-links (son los
  frames que viajan a Figma).
- **Contenido real:** copy y precios de `prototipo/datos.js`; fotos reales de la web
  actual o Magnific, jamás stock ni IA presentada como foto real.
- **El código nunca se importa a Figma.** El traspaso se construye a mano.
- **Edición concurrente:** Samuel escribe en el repo en paralelo. Al commitear por
  fases, aislar los cambios sin pisar su WIP (hash-object/update-index, nunca
  `git stash`) — ver la nota del cerebro `feedback-concurrent-editing-git-isolation`.
