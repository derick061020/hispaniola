# Plan 06 — Eventos (`/eventos/party-boat`, `/eventos/bodas`, corporativo)

> Fuente: `WEBSITE-EVENTOS.pdf` (7 págs): party boat (1–2), corporate/MICE
> (3–4), bodas (5–7).
> Cruzado con: `data/eventos.ts` (36 KB), `pages/evento.tsx`,
> `components/evento/*`.
> Estado: propuesta para revisar con Samuel. No ejecutado.
> Los cambios de la slide 79 (novios), 80 (Karaya) y 82 (nombres de paquetes)
> del plan 02 aterrizan aquí.

## §1 — Party Boat: copy nuevo (págs. 1–2)

**Cliente:**
- Héroe/intro: «Private Events & Party Boats — Celebrate Life's Best Moments
  at Sea. Some celebrations deserve more than an ordinary venue…»
- «Sobre eventos y party boat» → párrafos aprobados (birthday, wedding,
  anniversary, family reunion, corporate, bachelor/ette, graduation…;
  «every private charter is designed around you»; el día completo descrito;
  compromiso de servicio).
- Intro de paquetes: «Choose from one of our four all-inclusive party boat
  packages. Each package includes the full onboard experience listed in
  What's Included above. The only differences are the menu, tour duration,
  and price. All meals are freshly prepared and served buffet style on
  board… your total price will be calculated automatically based on the size
  of your group.»

**Estado en el repo:** `cabecera-evento.tsx` + `data/eventos.ts` («Sobre
eventos y party boat», bloque de 4 paquetes con widget).

**Cómo lo aplicamos:** reemplazo directo de héroe, sobre-nosotros e intro de
paquetes. El claim «price calculated automatically» ya es verdad en el widget
(modelo marginal). ⚠️ «buffet style» — el copy nuevo describe la comida de
party boat como buffet: coincide con la regla 21+ de la reunión (grupos
grandes → buffet), no requiere cambio de datos de menú aquí.
**Archivos:** `data/eventos.ts`.
**Esfuerzo:** bajo.

## §2 — Corporate/MICE: copy nuevo + sección Karaya (págs. 3–4 + slide 80)

**Cliente:**
- «About Corporate Events & MICE» — párrafos aprobados. Dato central: «Our
  flagship MICE venue, **Karaya Punta Cana by Hispaniola**… nearly **1,000
  m²** of event space and a capacity of up to **300 guests**…» + cierre
  «When business meets paradise, extraordinary events happen.»
- Slide 80: sección/banner con foto del barco: «catamarán más grande del
  Caribe · +200 personas · cocina a bordo».
- Pág. 4 trae «????» bajo la card «Lo que un organizador necesita saber» —
  anotación ilegible/incompleta.

**Estado en el repo:** landing corporativo en `data/eventos.ts` (formatos
Incentivo/Team building/Cierre de convención, card del organizador, form
«Solicitar propuesta»).

**Cómo lo aplicamos:**
1. «About» nuevo con los datos de Karaya (nombre, 1.000 m², 300).
2. **Sección/banner Karaya** (slide 80): banda con foto + 3 bullets. Copy
   propuesta (derivado de ambas fuentes): «Meet Karaya — the largest
   catamaran in the Caribbean. Nearly 1,000 m² of event space, up to 300
   guests, full kitchen on board.» ⚡ Conflictos a confirmar (índice,
   petición 5): «Eclipse» (¿otro barco o ruido de transcripción?), 200 vs
   300. Se construye con el dato del copy aprobado (300) — si «más de 200» es
   el que quieren, es compatible («up to 300» ⊃ «200+»), pero el superlativo
   «largest in the Caribbean» es un claim fuerte: va tal cual porque lo pide
   el cliente dos veces, con nota en la entrega.
   Foto: las buenas están en material de Trafic Experience según la reunión →
   `[placeholder-v3]` con la foto de Karaya existente en flota hasta que
   lleguen.
3. «????»: se marca como **duda al cliente** — no se toca la card del
   organizador (no hay instrucción legible).

**Archivos:** `data/eventos.ts`, `evento.tsx` (si la banda es bloque nuevo),
`dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §3 — Bodas: copy nuevo + novios gratis (págs. 5–7 + slide 79)

**Cliente:**
- «Wedding Celebrations at Sea» — párrafos aprobados (pre/post boda,
  recomendación del 4-hour Private Charter…).
- **Exclusive Wedding Perks**: «🥂 Complimentary Bride & Groom with groups of
  14 guests or more · 🍾 Complimentary Champagne Toast for all wedding
  groups» + cierre «Celebrate your love. Thank your guests…».
- «Wedding Packages» — intro aprobada de los 4 paquetes (mismo esquema que
  party boat) repitiendo la regla de novios gratis y el brindis.
- Slide 79: ese mensaje como **destacado junto al widget**; reunión: el
  contador debe leerse «12 + los dos novios».

**Estado en el repo:** landing bodas en `data/eventos.ts` (misma estructura
de paquetes que party boat, «los mismos 4 paquetes a los mismos precios»),
`widget-evento.tsx` + `calculadora-evento.tsx` (modelo marginal por
invitados).

**Cómo lo aplicamos:**
1. Copy nuevo completo (sobre, perks, intro de paquetes).
2. **Mensaje destacado** junto al widget de bodas (banda pequeña con los 2
   perks — molde de nota premium existente).
3. **Regla en la calculadora (solo bodas)**: con `invitados >= 14`, la pareja
   no suma — UI: bocadillo/nota «14 guests = 12 paying + the happy couple,
   on us» (la mecánica exacta: el contador cuenta INVITADOS TOTALES y el
   precio descuenta 2 a partir de 14 — fiel a «coges 12 y te diga 12 más los
   dos novios»). ⚠️ Definir el borde: ¿13 invitados = 13 pagan? Según el
   copy, sí (perk desde 14). Nota clara en la UI para no parecer error.
4. El brindis: línea en «qué incluye» de cada paquete de bodas (no inventa
   dato: aprobado).

**Archivos:** `data/eventos.ts`, `widget-evento.tsx`,
`calculadora-evento.tsx`, `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** medio (lógica de precio — probar los bordes
13/14/15 y el resumen del funnel).

## §4 — Los 4 paquetes: nombres nuevos (slide 82)

**Cliente:** «cambiar estos asteriscos» (tabs «Premium · #I · #II · #III»).
**📞 REUNIÓN 07-31:** no tienen nombre real; «un circuito o algo así,
estéticamente más bonito».

**Estado en el repo:** `data/eventos.ts` — PaqueteEvento con id + abreviatura
(#I/#II/#III), tabs en `widget-evento.tsx`, cards en `paquetes-evento.tsx`.

**Cómo lo aplicamos:** nombres descriptivos derivados del CONTENIDO real de
cada paquete (menú/duración — sin inventar atributos que no tienen).
**Propuesta a aprobar por el cliente** (previa verificación del contenido
exacto de cada uno en `data/eventos.ts` al ejecutar):

| Hoy | Propuesta EN | Racional |
|---|---|---|
| Premium | **Premium** (se queda) | ya es el ancla |
| #I | **Classic** | el base |
| #II | **Signature** | el intermedio con menú más rico |
| #III | **Grand** | el mayor |

Alternativa temática marina si el cliente la prefiere: Coral · Lagoon ·
Horizon · Sunset. ⚠️ Los nombres NO se publican sin OK del cliente — hasta
entonces pueden entrar como `Package I/II/III` (EN neutro, mejor que «#I»).
**Archivos:** `data/eventos.ts` (labels), `widget-evento.tsx`,
`paquetes-evento.tsx`.
**Esfuerzo:** bajo.

## Dudas para Samuel (consolidadas del plan)

1. El «????» de la pág. 4 — ¿le preguntas a Miguel qué quería ahí?
2. Nombres de paquetes: ¿propuesta A (Classic/Signature/Grand), B (marina), o
   neutro hasta que el cliente conteste?
3. La regla de novios (13 vs 14 invitados) — confirmar el borde con el
   cliente al pasar la lista de peticiones.
4. El depósito de eventos quedó en 25% (decisión v2). El copy nuevo no lo
   toca — se mantiene. Solo verificar que el texto EN del widget lo diga.
