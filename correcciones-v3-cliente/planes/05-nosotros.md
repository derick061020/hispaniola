# Plan 05 — Nosotros: equipo, flota, instalaciones + página NUEVA «Marine Park»

> Fuente: `WEBSITE - NOSOTROS.pdf` (17 págs): megamenú (1), equipo (1–3),
> flota (3–9), instalaciones (10–15), **Marine Park (16–17, página nueva)**.
> Cruzado con: `pages/tripulacion.tsx`, `pages/flota.tsx`,
> `pages/instalaciones.tsx`, `data/equipo.ts`, `data/flota.ts`,
> `data/nosotros.ts`, `data/instalaciones.ts`, `dropdown-nosotros.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR

- El megamenú «Nosotros» pasa de 3 entradas a **4**: Crew · Facilities ·
  **Marine Park (nueva)** · Fleet.
- **/tripulacion**: copy EN nuevo (héroe, 6 departamentos con textos
  aprobados, CEO con historia y frase).
- **/flota**: copy EN nuevo (héroe, «cada barco tiene un propósito»,
  bienvenida sin «BIENVENIDOS» ni «GRUPOS PEQUEÑOS», frase del CEO,
  **timeline 2010–2024 completa con los 12 barcos nombrados**, cocina
  flotante) + los quitar del plan 02 (3 paradas, cero plástico).
- **/instalaciones**: copy EN nuevo (héroe, «TAP TO EXPLORE», 5 zonas
  renombradas) y se ELIMINAN el museo marino (pasa a Marine Park) y la banda
  «La cocina, el mar y la ciencia».
- **Página NUEVA: Marine Park** (museo subacuático, pulsera de la fundación,
  restauración de coral, tortugas, arrecifes artificiales).

---

## §1 — Megamenú Nosotros: 4 entradas

**Cliente (pág. 1):** descripciones para CREW, FACILITIES, **MARINE PARK**
(«Explore our protected marine area featuring an underwater museum, coral
restoration, artificial reefs, and marine conservation projects») y FLEET.

**Estado en el repo:** `dropdown-nosotros.tsx` — 3 entradas (Tripulación,
Instalaciones, Flota) con descripciones cortas.

**Cómo lo aplicamos:** añadir Marine Park (ruta nueva, §6) con su descripción
aprobada; las otras 3 descripciones se reemplazan por las EN. Verificar
también `menu-movil.tsx` y el footer (columnas de enlaces).
**Archivos:** `dropdown-nosotros.tsx`, `menu-movil.tsx`, `footer.tsx`,
`App.tsx`.
**Esfuerzo:** bajo.

## §2 — /tripulacion: equipo con textos aprobados (págs. 1–3)

**Cliente:**
- Héroe: «NUESTRO EQUIPO → THE PEOPLE BEHIND THE SCENES»; sub: «LAS PERSONAS
  DETRÁS DE CADA TOUR → MORE THAN A CREW, A TEAM DEDICATED TO YOU»; «UN
  EQUIPO REPARTIDO… → More than 70 passionate professionals across six
  specialized departments…»; debajo: «ONE COMPANY, SIX DEPARTMENTS AND ONE
  SHARED PASSION».
- **CEO** (texto largo aprobado): historia del primer capitán, Jose el
  Operations Manager que aprendió a nadar con él, «He is my right wing man»,
  y el credo «the best leaders never stop learning…».
- Textos por departamento: SALES & MARKETING · OFFICE OPERATIONS · MARINE
  OPERATIONS · KITCHEN OPERATIONS · **BAVARO REEFS FOUNDATION** ·
  ADMINISTRATION (6, cada uno con su párrafo aprobado).

**Estado en el repo:** `pages/tripulacion.tsx` + `data/equipo.ts` — grid por
departamentos (v2, bajo el paraguas de 70 empleados), franja, muro.

**Cómo lo aplicamos:**
1. Héroe y subtítulos → EN aprobado.
2. Los 6 departamentos del repo se mapean a los 6 del doc (verificar 1:1;
   si el repo tiene otros nombres/nº, se reorganizan a los 6 aprobados).
3. El texto del CEO entra en el bloque del fundador. ⚠️ El texto menciona a
   **Jose (Operations Manager)** con nombre — es dato del cliente (su doc),
   se porta. ⚠️ El repo llama al fundador **Omar**; el texto nuevo no lo
   nombra. Se mantiene Omar como nombre + el texto nuevo como cita/bio.
   Confirmar que conviven (¿el CEO es Omar? — el doc no lo contradice).
4. Retratos: siguen los placeholders/fotos reales existentes; nada nuevo.

**Archivos:** `data/equipo.ts`, `tripulacion.tsx` y componentes de equipo.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §3 — /flota: copy nuevo + timeline 2010–2024 con los 12 barcos ⚡

**Cliente (págs. 3–7):**
- Héroe: «LOS BARCOS QUE HACEN EL DÍA → THE FLEET THAT BRINGS EVERY
  ADVENTURE TO LIFE»; quitar la frase de debajo y poner «Every boat has a
  purpose. Each vessel in our fleet has been carefully selected and
  customized for the experience.»
- QUITAR: «BIENVENIDOS» (la sección «Bienvenido a la familia Hispaniola» tal
  cual — el texto nuevo la reemplaza): «Unlike many tour operators, we don't
  rely on third-party boats…» + «Below, you'll find detailed specifications…».
- QUITAR: «GRUPOS PEQUEÑOS» (la card «Grupos pequeños, espacio de verdad»).
- **FRASE DEL CEO**: «I never wanted to build the biggest tour company. I
  wanted to build the one people would never forget. Happiness is a way of
  travel not a destination.»
- CHANGE: «SINCE 2010, FLEET CONSISTING OF 12» + intro nueva («Our journey
  began in 2010 with a single boat…») + **timeline completa**: 2010 Teresa →
  2013 Santa María → 2015 Forever Teresa + 2º catamarán de vela + primera
  cocina flotante → 2016 Maite → 2017 Teresa 2, arranca la construcción de
  Karaya, llega Parrot, Teresa original pasa a plataforma de embarque → 2018
  Goyita → 2020 Joker → 2021 Karaya entregada (flagship) → 2024 Grandpa +
  Follow Your Dreams.
- CHANGE (grid): «More Than Boats. Your Home at Sea.» + párrafo (fotos, 360°,
  videos, specs).

**Estado en el repo:** `familia-hispaniola.tsx` (presentación + dueño +
recorrido de años, absorbe la cita), `flota-grid.tsx`, `data/flota.ts` (53 KB,
**6 barcos**), `data/nosotros.ts`.

**Cómo lo aplicamos:**
1. Héroe/lead nuevos; fuera «Bienvenidos» y la card «grupos pequeños»; el
   párrafo «Unlike many tour operators…» toma su lugar.
2. Cita del CEO → la frase nueva (sustituye a «Empecé con un solo barco…»).
   ⚠️ La cita vieja era literal del cliente (2012); la nueva es suya también.
3. **Timeline**: reemplaza el recorrido actual. ⚡ ORO PARA FLOTA: nombra los
   **12 barcos** (Teresa, Santa María, Forever Teresa, 2º velero [¿GrandMa?],
   Maite, Teresa 2, Karaya, Parrot, Goyita, Joker, Grandpa, Follow Your
   Dreams) — la v2 pedía 12 y solo había 6. Esto NO da fotos ni fichas
   técnicas de los 6 nuevos: el grid puede listar los 12 con los 6 completos
   y 6 en `[placeholder-v3]` (foto pendiente, specs pendientes) o seguir con
   6 hasta tener assets. **Duda para Samuel: ¿grid de 12 con huecos honestos
   o grid de 6 + timeline que nombra 12?**
4. «SINCE 2010»: cambia el «desde 2012» global (ver índice, petición 8).
5. Grid: título/sub EN nuevos.
6. + plan 02: slides 68 (cards más modernas), 69 (cocina destacada), 70
   (quitar 3 paradas y cero plástico).

**Archivos:** `familia-hispaniola.tsx`, `data/flota.ts`, `data/nosotros.ts`,
`flota.tsx`.
**Esfuerzo:** ALTO (timeline + decisión de grid). **Riesgo:** medio.

## §4 — /flota: cocina flotante (pág. 8)

**Cliente:** «More Than Lunch. A Memory You Can Taste. ⭐» + 3 párrafos
sensoriales aprobados + claims «COOKED FRESH, SERVED FRESH · LIVE SHOW
COOKING · WHERE GREAT FOOD BRINGS EVERYONE TOGETHER».

**Estado en el repo:** `cocina-y-paradas.tsx` («La única cocina flotante de
Punta Cana») — misma sección que la slide 69 pide destacar.

**Cómo lo aplicamos:** copy nuevo + jerarquía subida (plan 02 slide 69), en
una sola pasada. Las 3 fotos con caption ya existen.
**Archivos:** `cocina-y-paradas.tsx`, `data/nosotros.ts`.
**Esfuerzo:** medio (con el rediseño incluido).

## §5 — /instalaciones: copy nuevo + 2 secciones fuera (págs. 10–15)

**Cliente:**
- Héroe: «More Than a Marina. The Heart of Hispaniola. ⭐⭐⭐» + subtítulo
  aprobado (operations center, biology lab, coral museum…).
- Videos: «TAP TO EXPLORE — One tap. One minute. A complete look behind the
  scenes…» (sobre «Míralo por dentro»).
- Intro zonas: «DREAM IT. ARRIVE. LIVE IT — Before the boat leaves the
  shore, your unforgettable experience has already begun…»
- **5 zonas** con copy completo aprobado: 01 Guest Welcome Center · 02
  Marine Biology Center · 03 Professional Culinary Center · 04 Foundation
  Store · 05 Operations Center (cada una con claim, párrafo y 3 checks).
- **Tachado en rojo (pág. 15)**: la banda CTA «La cocina, el mar y la
  ciencia, en un solo día» y la zona «02 Museo exterior marino» → FUERA
  (el museo se va a Marine Park).

**Estado en el repo:** `pages/instalaciones.tsx`,
`zonas-instalaciones.tsx`/`bento-zona.tsx`, `data/instalaciones.ts` (6 zonas
hoy, museo incluido), `banda-instalaciones.tsx`.

**Cómo lo aplicamos:**
1. Héroe/copys nuevos.
2. Zonas: de 6 a **5** (sale el museo — su contenido NO se pierde: se muda a
   la página Marine Park §6). Renombres al mapeo aprobado (recibimiento →
   Guest Welcome Center, laboratorio → Marine Biology Center, cocinas →
   Professional Culinary Center, tienda → Foundation Store, oficinas →
   Operations Center).
3. Quitar la banda «La cocina, el mar y la ciencia» (`banda-instalaciones`?
   — verificar cuál es el componente exacto de esa CTA).
4. Los videos verticales siguen `[placeholder-v3]` (Miguel va a grabar; la
   reunión menciona video de cocina y del museo).

**Archivos:** `data/instalaciones.ts`, `zonas-instalaciones.tsx`,
`instalaciones.tsx`, `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo.

## §6 — Página NUEVA: Marine Park (págs. 16–17) ⚡

**Cliente:** página completa aprobada:
- Héroe: «Where Every Adventure Gives Back ⭐⭐⭐» + párrafo misión.
- **01 Underwater Museum** — «More Than Art. A Living Reef.» (esculturas
  dominicanas: pelotero, pitcher, Diablo Cojuelo, músicos, mesa de dominó;
  70+ estructuras de arrecife artificial; 3 checks).
- **Foundation Bracelet** — «Your Ticket Protects the Ocean» (la pulsera de
  conservación da acceso al museo y financia la fundación).
- **02 Coral Restoration** — viveros, transplante, monitoreo (3 checks).
- **03 Green Sea Turtle Conservation** — una de las poblaciones más
  importantes del país.
- **04 Artificial Reefs** — «Building New Homes Beneath the Sea» (3 checks).

**Estado en el repo:** NO existe. El contenido del museo hoy vive en
/instalaciones (sale de ahí, §5) y parte del discurso de coral en
/ventaja-competitiva y /fundacion.

**Cómo lo aplicamos:**
1. Ruta nueva: **`/marine-park`** si se aprueban slugs EN (plan 01 §4);
   si no, `/parque-marino`. Alta en `App.tsx`, megamenú (§1), footer,
   sitemap.
2. Construcción con las piezas existentes del proyecto (HeroInterna +
   patrón editorial numeral fantasma + hairlines — el patrón ya estándar de
   internas), fotos reales del museo/coral que ya están en el repo
   (`galeria` del museo, fotos de sostenibilidad). El video del museo existe
   (estaba en la zona del museo de instalaciones).
3. ⚠️ Solapamiento consciente con /fundacion y /ventaja-competitiva (coral,
   tortugas): Marine Park es EL LUGAR (la experiencia visitable), fundación
   es LA ORGANIZACIÓN, ventaja-competitiva es EL ARGUMENTO de venta. El copy
   aprobado ya respeta esa división; enlazar entre las tres en vez de
   repetir. (Registrado además como la misma decisión abierta de duplicación
   de la v2 — esta página la ALIVIA si /ventaja-competitiva deja de contar
   el detalle del museo.)
4. Dev Mode: bloques nuevos al registry en el mismo commit.

**Archivos:** `pages/marine-park.tsx` (nueva), `data/` (archivo nuevo o
sección en `sostenibilidad.ts`), `App.tsx`, `dropdown-nosotros.tsx`,
`footer.tsx`, `dev-registry.ts`, sitemap.
**Esfuerzo:** ALTO (página nueva, aunque con piezas hechas).
**Riesgo:** bajo.

## Orden de commits sugerido

1. §1 + §6 — la ruta y el menú primero (andamio), página Marine Park.
2. §5 — instalaciones (que le CEDE el museo a Marine Park).
3. §3 + §4 — flota completa (copy + timeline + slides 68–70 del plan 02).
4. §2 — tripulación.
