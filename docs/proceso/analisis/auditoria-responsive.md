# Auditoría responsive + conversión — Hispaniola

Auditoría en navegador real (Playwright) del build React (`app/`), rama `minimax`.
Breakpoints: **390** (móvil), **768** (tablet), **1024** (rango medio), **1440** (desktop base).
Fecha: 2026-07-17.

Severidad: 🔴 rompe / bloquea · 🟠 notorio / afecta conversión · 🟡 pulido · 🟢 bien.

**Actualización 2026-07-17/18**: arrancados los arreglos tras la auditoría. Estado de cada hallazgo marcado abajo (✅ hecho / ⏭️ descartado con motivo / pendiente).

---

## Resumen ejecutivo

**Veredicto general**: el sitio está **muy bien construido en responsive**. Se auditaron ~20 vistas en 375/768/1024/1440 y **cero tienen overflow horizontal de página**. El template de ficha de tour, el funnel de reserva y las páginas de contenido son sólidos y consistentes. Solo había **una rotura real de layout** (la sección de eventos de la home en móvil), ya corregida.

### Prioridad 1 — arreglar
1. ✅ **HECHO** — 🔴 **Home · sección de eventos "Cada ocasión merece su propio catamarán"** se rompía en móvil (<~640px): las 4 cards se encogían a 72px y el texto se recortaba. `.eventos-especiales-fila { display:flex }` vivía sin media query en `componentes.css` y ganaba siempre a la utilidad `grid` del JSX (misma especificidad, este archivo carga después de Tailwind). Fix: el `display:flex` + el `flex:1 1 0%` del hover-acordeón ahora van dentro de `@media (min-width: 64rem)` — grid 2×2 real en móvil/tablet, acordeón de hover intacto desde `lg`. Verificado en ambos extremos (375 y 1440, con hover real).
2. ✅ **HECHO** — 🟠 **Landings de evento (bodas, empresas, party-boat) · sección "Sobre …" en inglés**. Traducidas las 3 (`data/eventos.ts`), mismos hechos/promesas, sin inventar nada nuevo. De paso, el heading "Sobre empresas y mice" ya no minusculiza la sigla (`evento.tsx`): "Sobre empresas y MICE".

### Prioridad 2 — pulir (responsive)
3. ⏭️ **Descartado** — Marquee de "checks" del widget: es una animación `linear infinite` continua (igual mecanismo que el ticker del hero) — mi captura solo congeló un instante al azar; en uso real el texto pasa completo sin quedar cortado. Cambiarlo a texto estático iría además contra el pedido explícito de Samuel de que fuera "el mismo ticker que en tours". No se tocó.
4. ✅ **Parcial** — Selector de 4 botes (charter) a <sm: ajustado padding/`leading-tight` en `sub-variante-picker.tsx` para ganar algo de aire. "Santa Maria"/"Forever Teresa" siguen envolviendo a 2 líneas en 390px — es el límite físico de 4 etiquetas largas en un segmented control; degradarlo a dropdown/scroll cambiaría el patrón de interacción y no se hizo sin luz verde de Samuel.
5. ⏭️ **Descartado** — Espaciado vertical entre secciones en móvil: el token `--spacing-seccion` tiene un comentario explícito de Samuel ("v2: sube de 5rem — el 'aire' de la ref. Journeo") — es una decisión de diseño deliberada (sensación premium), no un descuido. No se tocó.
6. **Pendiente** — Hero de la home pesado en móvil: ya estaba en el pendiente "aligerar el hero" del cerebro: decisión de Samuel pendiente, fuera de esta tanda.
7. **Pendiente** — Contenido con reveal por scroll (sostenibilidad/guías) dependiente de JS: funciona, pero el default sin-JS no es visible. Cambio más grande (afecta el patrón `ScrollTrigger.batch` de 3+ páginas) — no se tocó en esta pasada.
8. ✅ **HECHO** — 404 sin header/nav: ahora monta `<Header />` (variante sólida — logo, Tours/Eventos/Nosotros/Ayuda, Reservar, hamburguesa en móvil). Verificado que el menú móvil abre y funciona.

### Notas de contenido/datos (no responsive, pero para "profesional")
- **Pendiente** — Video del modal de bienvenida con texto en inglés: es un asset (mp4 de YouTube) del cliente, no un fix de código.
- ✅ **HECHO** — Charter Maite: tramo redundante **"20–20 pax"** fusionado con el de "9–19" (mismo precio US$99/persona) → ahora un solo tramo "9–20 pax". `data/tours.ts`.
- ⏭️ **Descartado** — Saona "mínimo 6 personas" con stepper en 2: es intencional (comentario explícito en `widget-reserva.tsx`) — el aviso contextual es la UX querida, el usuario sube el stepper a mano. No es un bug.
- ✅ **HECHO** — `mi-reserva`: "código de 14 caracteres" → "código de 13 caracteres" (HSP-XXXX-NNNN son 13).
- ✅ **HECHO** — Heading "Sobre empresas y mice" → "Sobre empresas y MICE" (ver ítem 2).

El detalle vista por vista de la auditoría original está abajo (sin editar, es el estado ANTES de los arreglos).

---

## Fase 1 — Home (`/`)

### 🔴 Eventos "Cada ocasión merece su propio catamarán" — se rompe en MÓVIL (<~640px)
- **Componente**: `home/mega-eventos.tsx` + `styles/componentes.css:1470` (`.eventos-especiales-fila`).
- **Qué pasa**: la fila usa `.eventos-especiales-fila { display:flex }` con items `flex:1 1 0%` — es un acordeón que se expande al `hover` (media `(hover:hover)`), pensado SOLO para desktop. El markup trae la clase Tailwind `grid grid-cols-2` pero el `display:flex` del CSS la anula en todos los anchos.
- **Verificado**: a **375px** las 4 cards colapsan a **72px** cada una y todo el texto se recorta ("Cump…", "Más inform…", descripciones cortadas). A **768px** ya se ven bien (~155px, texto completo). El corte está por debajo de ~640.
- **Impacto conversión**: una de las líneas de negocio (eventos/bodas/empresas) queda ilegible en móvil — el grueso del tráfico turista. Alto.
- **Fix propuesto**: por debajo del punto donde 4 cards dejan de caber, romper el flex a stack vertical (o 2×2 real / carrusel swipeable). Reservar el `display:flex` + expand-on-hover para `md:`/`lg:` + `(hover:hover)`. (Nota secundaria: en tablet táctil el expand-on-hover no dispara, pero como en reposo el texto se ve completo, no es bloqueante.)

### 🟡 Hero pesado en móvil (ya diagnosticado en el cerebro)
- H1 de 6 líneas + subtítulo + 4 stats + CTA + 2 líneas de reassurance ocupan >1 viewport y medio antes de terminar el hero; el CTA "Ver disponibilidad" cae muy abajo. Mitigado por la barra sticky inferior que repite el CTA. Coincide con el pendiente "aligerar el hero" ya registrado.

### 🟡 Espaciado vertical entre secciones muy amplio en móvil
- Entre tours→why-direct, opiniones→eventos, etc. hay bloques grandes de blanco. En móvil se siente como huecos muertos y alarga mucho el scroll. Candidato a reducir `py-seccion` en `<sm`.

### 🟢 Bien
- **Header / notch-nav + megamenús**: cabe sin colisión a **768 y 1024**. Los paneles (Nosotros 2 ítems, Tours 2×2 con thumbnails — el más ancho) abren centrados bajo el notch y quedan libres del logo (izq.) y del botón Reservar (der.). El riesgo histórico de colisión del panel a ~800px ya no aplica en la implementación actual. Al hacer scroll el topbar se retira y aparece la isla flotante (esperado).
- Hero legible en 375/768/1024, logo/hamburguesa correctos, subrayado ondulado OK.
- Grid de tours: cards excelentes (chip audiencia, galería con dots, precio "desde", rating, chips incluye, CTA full-width). Sin overflow.
- Why-direct con toggle "En un portal / Aquí" + card comparativa: bien.
- "Incluye": barco cenital + lista numerada editorial (01/02/03) reveal por scroll: bien (el "vacío" en captura desktop es artefacto del scroll-reveal, no bug).
- Opiniones: reseñas apiladas, prueba social clara.
- Contacto: mapa embebido interactivo + formulario full-width legible. FAQ: acordeón limpio, tap targets grandes. Footer: columnas apilan bien; la barra sticky no oculta contenido (el `pb-16` reserva espacio).
- Sin overflow horizontal de página (el ticker sobresale a propósito dentro de contenedor recortado).

### Notas de conversión (no responsive)
- **Modal de bienvenida** (`modal-bienvenida.tsx`): autoplay muted 1×/sesión con el video de YouTube del cliente. El diálogo es responsive-OK. El video en sí tiene texto en **inglés** quemado ("…memorable or safe experiences") sobre una web con default ES — decisión de contenido del cliente, pero conviene revisarlo (primer impacto al entrar).

---

## Fase 2 — Fichas de tour

### `/tours/semi-privado` (buque insignia)
- 🟢 **Móvil (375)**: sin overflow. Hero excelente (breadcrumb, título, rating, badges, mosaico de fotos con "+1 fotos", barra sticky inferior con precio+rating+CTA persistente). Descripción, itinerario, incluye, qué llevar: bien. Menú por paquete: platos 2-up con foto legibles (Light US$99 / Premium +US$15). Widget de reserva inline: toggle Light/Premium + Fecha + Personas (steppers) + "ahorra hasta 15%" + CTA que se habilita al elegir fecha. Opiniones (marquee) + FAQ (acordeón) + "también te puede gustar": bien.
- 🟢 **1024**: layout 2 columnas correcto — contenido izq. + widget sticky der. + scroll-spy nav arriba. El paso a 1 columna es en `lg`, así que a 768 sigue en 1 columna con el widget abajo (OK, mitigado por la barra sticky).
- 🟡 **Marquee de checks dentro del widget**: en ancho angosto (~370px) el loop muestra palabras cortadas al congelarse ("ma con 25%…", "7 día"). Considerar 2 items de texto estático en vez de marquee ahí.

### `/tours/charter-privado` (tabla de precios + selector 4 botes)
- 🟢 **Móvil (375)**: sin overflow. **La tabla de precios por barco (`tabla-precios-charter.tsx`) renderiza bien** — tabla de 2 columnas (Personas | Precio) que cabe y envuelve la celda de precio ("US$ 625 grupo + US$ 25 por persona…"). Las 4 cards de barco (Maite/GrandMa/Santa Maria/Forever Teresa) apilan legibles.
- 🟡 **Selector de 4 botes en el widget** (`sub-variante-picker.tsx`): a 375px los 4 segmentos miden ~85px y "Santa Maria" / "Forever Teresa" envuelven a 2 líneas dentro del segmento. Legible pero apretado (es el caso más justo: 4 opciones en el ancho más chico). Considerar, solo <sm, degradar a dropdown o scroll horizontal del segmented. La card de preview con foto del bote: buen detalle.
- **Nota de datos (no responsive)**: el tramo **"20–20 pax"** de Maite se ve como error de contenido (rango de 20 a 20). Revisar en `data/tours.ts`.

### `/tours/snorkel-lovers` (precio dual adulto/niño)
- 🟢 **Móvil (375)**: widget de precio dual bien resuelto — dos steppers apilados (Adultos 2 / Niños 0) + contador de aforo "2 / 30". Sin overflow. Resto igual al template.

### `/tours/isla-saona` (selector 3 botes)
- 🟢 **Móvil (375)**: selector de 3 botes (Speedboat/Fishing Town/Catamarán) encaja sin envolver (~110px c/u, más holgado que los 4 de charter). Sin overflow. Template correcto.
- **Nota de UX (no responsive)**: dice "Speedboat requiere mínimo 6 personas" pero el default del stepper es 2 (por debajo del mínimo). Alinear el default con el mínimo del bote.

**Conclusión Fase 2**: el template de ficha es sólido y consistente en las 4 variantes; cero overflow horizontal; el layout 2-columnas (contenido + widget sticky) entra en `lg`. Pendientes son pulidos (marquee del widget, selector de 4 botes <sm) y notas de datos, no roturas.

---

## Fase 3 — Flujo de reserva (`/reservar/:slug` + gracias)

- 🟢 **Móvil (375)**: sin overflow. El funnel de 4 pasos funciona completo y bien:
  1. **Contacto** (Nombre, Apellidos, Correo + confirmar, WhatsApp) — formulario full-width, helper text claro, "Continuar" se habilita al validar.
  2. **Tu menú** — cada comensal es un acordeón (Persona 1/2), expande a platos 2-up con foto, "Selecciona un plato…" + "Siguiente →". Al elegir marca check + "Seleccionado: <plato>", pasos completados colapsan con "Cambiar/Editar". Excelente UX en móvil.
  3. **Recogida** — hotel + notas opcionales, texto claro.
  4. **Pago** — depósito 25% (US$ 50) + saldo el día del tour, CTA "Pagar depósito — US$ 50" prominente, "Pago seguro · Cancela gratis".
  - La tarjeta-resumen ("qué estás comprando") apila debajo de los pasos en móvil (en desktop es rail sticky). Estándar de checkout móvil.
- 🟢 **Gracias** (`/reservar/:slug/gracias`): confirmación personalizada ("¡Nos vemos a bordo, Juan!"), código de reserva destacado, acciones (Voucher PDF / calendario / WhatsApp / gestionar), timeline "Qué sigue", resumen completo, upsell "¿Celebráis algo?" y mini-survey "¿cómo nos encontraste?". Todo apila y legible.
- 🟢 **1024**: layout Viator de 2 columnas correcto — pasos izq. (Nombre/Apellidos 2-up) + resumen sticky der. + "Reserva con confianza". Header mínimo (logo + USD), sin megamenú (bien, checkout enfocado).
- **Nota (no responsive)**: el paso Pago simula la reserva completa (genera código, va a /gracias). La "frontera honesta" que describía el dev-registry (no finge cobro) parece haber evolucionado a confirmación simulada — decisión de producto para el preview, OK. La fecha se rellena sola ("vie 17 julio") aunque no se eligiera — revisar el default de fecha.

**Conclusión Fase 3**: el funnel es la superficie de conversión más pulida del sitio; cero problemas responsive en 375/1024.

---

## Fase 4 — Landings de evento (`/eventos/:slug`)

### `/eventos/bodas`
- 🟢 **Móvil (375)**: sin overflow. Todo apila bien — hero con mosaico + badges, "Tres momentos, un barco" (3 cards apiladas), "Qué incluye" (lista con iconos), FAQ (acordeón), "Pedir cotización de boda" (formulario full-width: nombre, email, WhatsApp, tipo evento, fecha, nº personas, mensaje), "Otras ocasiones" (2 cards). Footer OK.
- 🟠 **CONTENIDO EN INGLÉS (no responsive, pero afecta profesionalismo)**: la sección **"Sobre bodas"** está entera en inglés ("Honor your love aboard our catamaran!… Value for your money guaranteed!"). Copy portado verbatim del sitio del cliente sin traducir. Rompe la coherencia ES de la web. **Alto para "quede profesional"**, aunque no sea un bug de layout.
- 🟢 **1024**: layout 2-columnas correcto — contenido izq. ("Tres momentos" 3-up + "Qué incluye" 2-up) + formulario de cotización sticky der.

### `/eventos/empresas` y `/eventos/party-boat`
- 🟢 **Móvil (375)**: sin overflow, mismo template que bodas (apila bien).
- 🟠 **Mismo problema de copy en inglés**: empresas → "MICE has been a significantly important part of the Travel & Tourism industry…"; party-boat → "Celebrating a special occasion? No matter what your event may be…". **Los 3 landings de evento tienen la sección "Sobre" sin traducir.** (Menor: el heading "Sobre empresas y **mice**" en minúsculas — debería ser "MICE").

### `/eventos/:slug/gracias`
- 🟢 **Móvil**: guard correcto (sin envío redirige a home). Tras enviar cotización: confirmación personalizada ("¡Recibimos tu solicitud, María!"), código de solicitud, resumen, timeline "Qué sigue", WhatsApp CTA, "hacer otra consulta". Apila y legible.

**Conclusión Fase 4**: landings de evento responsive-sólidos (cero overflow, 375 y 1024 OK). El hallazgo real es de contenido: **las 3 secciones "Sobre" en inglés**.

---

## Fase 5 — Nosotros + Sostenibilidad

### `/nosotros`
- 🟢 **Móvil (375)**: sin overflow. Patrón editorial numerado ("Un día de mar en 3 paradas": 01/02/03 con fotos alternadas), cocina flotante (sección oscura), "La tripulación" en grid 2×2 (Capitán/Bióloga/Chef/Guía) limpio, "La flota" (6 botes en cards apiladas con foto+texto), cierre arrecife. Todo apila y legible.

### `/sostenibilidad`
- 🟢 **Móvil (375)**: sin overflow. Contenido correcto al scrollear: intro → "Cómo lo hacemos realidad" (secciones numeradas 01/02/03) → videos → cierre. El **cierre "Dejar una huella positiva"** (cambio de Samuel: foto cenital + gradiente navy + texto blanco) renderiza bien y legible.
- 🟡 **Consideración de robustez (afecta a las páginas con patrón editorial: sostenibilidad, y potencialmente nosotros/guías)**: sus secciones usan reveal por scroll (`sost-reveal` con ScrollTrigger, opacity:0 inicial). Verificado que **se revelan bien al scrollear** para un usuario real — NO es un bug funcional. Pero una captura estática (o un crawler que no scrollea) las ve en blanco: el contenido depende de que JS/GSAP corra. Recomendable que el estado por defecto sin JS sea visible (progressive enhancement) para SEO y resiliencia. (En `/nosotros` el contenido sí aparecía en captura estática — comportamiento no idéntico entre páginas, conviene unificar.)

**Conclusión Fase 5**: ambas responsive-sólidas, cero overflow. Sin roturas; la única nota es la dependencia de JS para revelar contenido en sostenibilidad.

---

## Fase 6 — Guías, FAQ, Reserva directa, Agentes, Contacto

- 🟢 **`/faq`**: sin overflow en móvil. **Verificado el cambio pedido (`max-w-3xl`)**: en desktop (1440) el acordeón queda a ancho de lectura cómodo (~768px) y centrado, con márgenes amplios — justo lo pedido para una sección solo-texto. Acordeón por categorías (Reservas y pagos, Antes del tour…) limpio.
- 🟢 **`/guias`**: sin overflow. Patrón editorial numerado (tips 01-04 + lista de guías). Mismo reveal por scroll que sostenibilidad (fullPage estático se ve incompleto; verificado que revela bien al scrollear).
- 🟢 **`/reserva-directa`**: sin overflow. Comparación portal vs. directo en 2 cards apiladas (motivo de ticket, lista de beneficios con checks, sello "RESERVA DIRECTA") + CTA. Buen device de conversión.
- 🟢 **`/agentes-de-viaje`**: sin overflow. Formulario B2B (agencia/DMC, contacto, email, teléfono, mensaje) full-width.
- 🟢 **`/contacto`**: sin overflow. Mapa embebido + formulario + tarjetas de contacto apiladas (WhatsApp/teléfono/email/oficina).

**Conclusión Fase 6**: las 5 páginas responsive-sólidas, cero overflow, formularios full-width. FAQ con el ancho ya corregido.

---

## Fase 7 — Legal + 404

- 🟢 **`/legal/:slug`** (política de cancelación): sin overflow, hero + texto legal legible en móvil. Mismo template para privacidad/términos/cookies.
- 🟢 **404** (`*`): centrada, "404 · No encontramos esta página · Volver al inicio". Sin overflow.
- 🟡 **404 sin header/nav** (conversión menor): deja al usuario sin más salida que "Volver al inicio". Considerar mantener el header o añadir enlaces a Tours para recuperar tráfico perdido.
