# PLAN — Landings de eventos v2 (clon de ficha de tour + widget formulario)

Pedido de Samuel (2026-07-17): las 3 landings de eventos de la web actual
(`/events-party-boat-puntacana.php`, `/weddings.php`, `/mice.php`) se rehacen
con la **misma estructura que la ficha de tour** — hero, header sticky, grid
de imágenes, todo igual — y lo único que cambia es el **widget de la derecha**:
un **formulario de cotización** en vez de reserva con precio. Al enviarlo,
**página de gracias** con el resumen del form + "pronto nos pondremos en
contacto" + CTA WhatsApp.

## §0 · Decisiones (cerradas con Samuel, AskUserQuestion 2026-07-17)

1. **Reemplazar** la plantilla actual de `pages/evento.tsx` (que era de
   "persuasión" — sin widget, sin precio, cierre navy) por la nueva "clon de
   tour" + widget formulario. Las 2 landings actuales (Bodas, Empresas) se
   migran. Los 4 componentes viejos de evento se borran.
2. **3 slugs en español** (consistente con el resto del sitio):
   `/eventos/party-boat` · `/eventos/bodas` · `/eventos/empresas`. El
   "Eventos y party boat" genérico de OCASIONES (que iba al hub) deja de
   existir como ítem suelto — el party-boat pasa a ser landing propia.
3. **Submit del form** = SOLO página de gracias
   (`/eventos/:slug/gracias?reserva=XXX`). Sin WhatsApp directo ni mailto —
   WhatsApp vive como CTA en la página de gracias (no se sale del sitio al
   enviar el form). La reserva se guarda en localStorage con un id
   generado, misma mecánica que `lib/reservas.ts` para reservas de tour.
4. **Secciones reusadas caso por caso** — analizar el contenido de cada URL
   vieja y adaptarlo. Las 2 landings con paquetes de comida (party-boat,
   weddings) tienen contenido rico; MICE tiene menos. Decisión de Samuel
   explícita ("analiza bien todo el contenido que trae cada una").
5. **Tipo de evento en el widget, lista por landing** (no única):
   - `party-boat`: cumpleaños, bachelor/bachelorette, reuniones, aniversarios,
     renovación de votos / pre-post boda, propuesta, corporativo, spring
     break, graduación, otro.
   - `bodas`: solo "Boda" (placeholder fijo + nota "decidimos juntos").
   - `empresas`: incentive, team building, cierre de convención, convención
     anual, lanzamiento, otro.

## §1 · Contenido portado (verbatim de las 3 URLs del cliente)

Las 3 URLs del cliente son la fuente de contenido (no el prototipo — la
versión prototipo de los eventos quedó atrás con la decisión de rehacer).

### Party Boat (`/events-party-boat-puntacana.php`)
- H1: "Events & Celebrations" → versión final "Tu evento en el Caribe, a
  bordo" (más en el tono del resto de la home).
- Eyebrow: "Eventos privados a bordo"
- Sub: "Punta Cana · Catamarán privado"
- Trust: WIFI ONBOARD badge
- Lista de eventos cubiertos: BIRTHDAYS, BACHELOR/BACHELORETTE, REUNIONS,
  ANNIVERSARIES, VOW RENEWAL & PRE-POST WEDDING CELEBRATIONS, PROPOSALS,
  CORPORATE, SPRING BREAK, GRADUATION.
- Descripción larga: el párrafo "Celebrating a special occasion… memories that
  last a lifetime" + la lista de tipos.
- 8 fotos: `events/1.jpg` a `events/8.jpg` (galería original).
- 3 fotos cocina flotante (reusar `floating_kitchen.jpg`, `kitchen.jpg`,
  `floating_bar.jpg` del repo de la home).
- Form: el del cliente (first_name, last_name, email, phone, event_type,
  event_date, pax, message).

### Weddings (`/weddings.php`)
- H1: "Weddings" → versión final "Vuestra boda, en el mar".
- Eyebrow: "Bodas y pre-boda"
- Sub: "Bodas, pre-boda y post-boda en catamarán privado · Punta Cana /
  Bavaro".
- Trust: "Couples' Choice WeddingWire 2018-2021" + slogan ("May your Anchor
  be tight…").
- Descripción larga: el párrafo "Honor your love aboard our catamaran…" + el
  texto del 4 hour tour.
- Quotes: 3 reviews "It doesn't get any better" / "Absolute best" / "Best
  ever" (de la web vieja).
- **What we offer**: Ceremonia a bordo · Welcome party · Despedida del
  grupo (3 cards).
- **What is included**: 6-7 cards (snorkel equipment, music, floating bar,
  beach stop, photos, food, drinks).
- 13 fotos: `weddings/1.jpg` a `weddings/13.jpg`.
- Floating kitchen: 3 fotos (reusar).
- Form: event_type fijo "Wedding" (el prototipo lo hacía así).

### MICE (`/mice.php`)
- H1: "MICE" (con las 4 letras cada una en color) → versión final "Eventos
  corporativos a bordo" (más directo).
- Eyebrow: "MICE · Grupos corporativos"
- Sub: "Meetings · Incentives · Conferences · Exhibitions".
- 5 estrellas doradas.
- Stats (4): pax por barco / multi-barco / factura fiscal / seguro.
- Descripción larga: el párrafo "MICE has been a significantly important
  part of the Travel & Tourism industry…".
- 2 links externos: snorkel & party business activity (a party-boat) /
  corporate programs & activities (a karaya, sitio externo).
- 4 fotos: `mice/1.jpg` a `mice/4.jpg`.
- Floating kitchen: 3 fotos (reusar).
- Platform text: "Get ON and OFF our Catamarans…" + foto de la plataforma.
- Form: event_type con valores "Incentive", "Team building", "Convención
  anual", "Cierre de convención", "Lanzamiento", "Otro".

## §2 · Composición de la nueva plantilla (por evento)

```
┌───────────────────────────────────────────────────────────────┐
│ HeroInterna (compartido con ficha de tour, video de marca)    │
│ CabeceraEvento: migaja, eyebrow, H1, sub, chips de confianza  │
├───────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┬──────────┬──────────┐              │
│ │ FOTO PRINCIPAL          │  foto    │  foto    │  MOSAICO     │
│ │ (con quote si weddings) │ ├──────────┼──────────┤             │
│ │                         │  foto    │ Ver las  │              │
│ │                         │          │ N fotos→ │              │
│ └─────────────────────────┴──────────┴──────────┘              │
├───────────────────────────────────────────────────────────────┤
│ [Qué ofrecemos · Qué incluye · FAQ] ← anclas sticky          │
│ ┌──────────────────────────────┐  ┌─────────────────────┐      │
│ │ H2 «{promesa del evento}»    │  │ WIDGET (sticky)     │      │
│ │ descripcionLarga             │  │ FORMULARIO:         │      │
│ │                              │  │ · nombre            │      │
│ │ [Qué ofrecemos]              │  │ · email             │      │
│ │ [cards: 3 cards formato]     │  │ · whatsapp          │      │
│ │                              │  │ · tipo de evento    │      │
│ │ [Qué incluye]                │  │ · fecha tentativa   │      │
│ │ [cards: N items]             │  │ · nº de personas    │      │
│ │                              │  │ · mensaje           │      │
│ │ [FAQ acordeón]               │  │ [Enviar →]          │      │
│ │                              │  │ (link a WA)         │      │
│ └──────────────────────────────┘  └─────────────────────┘      │
├───────────────────────────────────────────────────────────────┤
│ «Otras ocasiones» (mini-cards con los otros 2 eventos)         │
│ Footer                                                         │
└───────────────────────────────────────────────────────────────┘
```

## §3 · Componentes

### Crear

- `components/evento/cabecera-evento.tsx` — clon de `tour/cabecera-ficha.tsx`
  (eyebrow + H1 + sub + chips de confianza sobre el hero). Misma pieza
  AlignUI (Breadcrumb, StatusBadge, Estrellas).
- `components/evento/widget-evento.tsx` — el formulario. Card con los 7
  campos + CTA "Enviar". `FancyButton` AlignUI (mismo chrome que el widget
  de tour). CTA secundario: WhatsApp directo (mismo trato que el widget de
  tour en `booking: 'cotizacion'`).
- `components/evento/que-ofrecemos.tsx` — grid de 3 cards (Ceremonia,
  Welcome, Despedida para bodas; Incentive, Team building, Cierre para
  empresas; mix para party-boat). Reusa el lenguaje de `IncluyeTour`
  (icono + texto).
- `components/evento/incluye-evento.tsx` — grid de cards icono+texto
  (snorkel, music, floating bar, beach, photos, food, drinks). Reusa
  lenguaje de `IncluyeTour`. Lista específica por evento.
- `components/evento/otras-ocasiones.tsx` — mini-cards con los OTROS 2
  eventos del catálogo. Estructura similar a `tambien-te-gusta.tsx` pero
  apuntando a `EVENTOS` en vez de `TOURS`.
- `pages/gracias-evento.tsx` — pantalla post-envío del formulario. Mismo
  layout que `gracias.tsx` (1 columna, max-w-3xl) pero adaptado a eventos:
  check + "Recibimos tu solicitud", resumen del form (nombre, tipo de
  evento, fecha, personas), "Pronto nos pondremos en contacto", CTA
  WhatsApp grande, botón "Hacer otra consulta" (→ vuelve a la landing).
- `lib/cotizacion-evento.ts` — guardar / leer cotizaciones de evento en
  localStorage. Misma mecánica que `lib/reservas.ts` pero con shape
  `CotizacionEvento` (sin horario, sin paquete, sin platos).

### Reusar (sin tocar)

- `components/internas/hero-interna.tsx`
- `components/internas/galeria-mosaico.tsx`
- `components/tour/galeria-lightbox.tsx`
- `components/tour/bloque-ficha.ts`
- `components/tour/titulo-seccion.tsx`
- `components/ui/etiqueta.tsx`
- `components/home/footer.tsx`
- `components/seo/meta.tsx`
- `components/seo/schema-json-ld.tsx`
- `components/alignui/fancy-button` (CTA coral)
- `components/alignui/status-badge` (chips)
- `components/alignui/breadcrumb` (migaja)
- `components/alignui/compact-button` (stepper de personas)
- `components/alignui/input` y `select` (campos del form — si se portan a
  Hispaniola; si no, HTML nativo con tokens).

### Borrar

- `components/evento/cabecera-evento.tsx` (versión vieja — reemplazado por
  el nuevo).
- `components/evento/formatos-evento.tsx` (versión vieja — reusado por el
  nuevo `que-ofrecemos.tsx` que es genérico para los 3 eventos).
- `components/evento/incluye-evento.tsx` (versión vieja — reemplazado).
- `components/evento/cierre-evento.tsx` (versión vieja — el cierre ahora es
  la página de gracias).

## §4 · Datos — `data/eventos.ts` (nuevo)

```ts
export type FormatoEvento = {
  titulo: string
  texto: string
  foto: string
  fotoAlt: string
}
export type BeneficioEvento = { titulo: string; texto: string }
export type StatEvento = { valor: string; label: string }
export type PreguntaEvento = { p: string; r: string }
export type CotizacionEvento = { /* shape del localStorage */ }

export type FichaEvento = {
  slug: string                  // 'party-boat' | 'bodas' | 'empresas'
  nombre: string                // 'Eventos y party boat' | 'Bodas' | 'Empresas'
  eyebrow: string
  titulo: string
  sub: string
  /** chips del hero */
  chips: string[]
  /** null = no tiene quote sobre la foto principal */
  quotePrincipal?: string
  /** null = no tiene stats (solo empresas tiene) */
  stats?: StatEvento[]
  /** descripcionLarga en párrafos */
  descripcionLarga: string[]
  /** lista de tipos de evento que se eligen en el select del widget */
  tiposEvento: string[]
  /** index del tipo preseleccionado (-1 = ninguno, ej bodas) */
  tipoFijo?: number
  /** titulo + items de "Qué ofrecemos" */
  formatosTitulo: string
  formatos: FormatoEvento[]
  /** titulo + items de "Qué incluye" */
  incluyeTitulo: string
  incluye: BeneficioEvento[]
  /** fotos en /fotos (sin extensión) — ya existen, SE USAN TAL CUAL */
  galeria: string[]
  faq: PreguntaEvento[]
  /** fotos del hero (la portada principal) */
  foto: string
  fotoAlt: string
  /** mensaje que se muestra en la página de gracias */
  cierreMeta: string
  /** CTA del widget */
  ctaPrincipal: string
  ctaSecundaria?: string
}
```

`EVENTOS`: record de 3 fichas, una por landing. **No se inventa copy**:
portado verbatim de las 3 URLs del cliente.

## §5 · Fases (commit por fase; verificación con Playwright)

| Fase | Entregable | Commit |
|---|---|---|
| E0 | Este plan comiteado (sin tocar los cambios sin commitear de Samuel) | `Eventos E0: plan` |
| E1 | `data/eventos.ts` reescrito + `party-boat` en `data/home.ts` OCASIONES | `Eventos E1: datos` |
| E2 | Fotos de las 3 landings descargadas de la web del cliente y metidas en `/public/fotos/` como `events-*`, `weddings-*`, `mice-*` (webp optimizado) | `Eventos E2: assets reales` |
| E3 | Componentes: cabecera-evento, widget-evento, que-ofrecemos, incluye-evento, otras-ocasiones. Borrar los 4 viejos de `components/evento/` | `Eventos E3: componentes` |
| E4 | `pages/evento.tsx` reescrito (clon de tour + widget) | `Eventos E4: página` |
| E5 | `lib/cotizacion-evento.ts` + `pages/gracias-evento.tsx` + ruta en `App.tsx` | `Eventos E5: gracias` |
| E6 | Dev Mode registrado en `dev-registry.ts` + tag `v1.0-eventos-clon-tour` + commit final con TODO (cambios de Samuel primero, luego los míos, en orden) | `Eventos E6: dev mode + tag` |
| E7 | QA: 3 viewports (390/768/1440), 0 errores de consola, submit del form → gracias, navegación entre las 3 landings | (sin commit) |

## §6 · Lo que NO se hace

- **No** se importan las 3 landings de la web vieja con Anima — siguen
  siendo el mismo principio del proyecto: el código NUNCA va a Figma
  (playbook `codigo-a-figma`). El traspaso a Figma, cuando llegue, se hace
  con las piezas del nuevo clon, igual que la ficha de tour.
- **No** se borran los cambios sin commitear de Saona
  (`package.json`, `widget-reserva.tsx`). El commit final los incluye con
  un mensaje descriptivo, en orden: primero el de Saona, después los míos.
- **No** se añade lógica de envío real (sin backend — la frontera con Odoo
  sigue pendiente, `PLAN-LANZAMIENTO.md` Bloque 0.1/0.2). El submit guarda
  en localStorage y muestra la pantalla de gracias.
- **No** se meten fotos stock ni de IA: las de las 3 URLs del cliente son
  la fuente; si alguna no está disponible, se omite y se documenta.
- **No** se incluye la Opiniones/reseñas con rating en las landings de
  evento: la home ya tiene prueba social (`QUOTES`), y las landings son de
  cotización, no de venta.

## §7 · Criterios de éxito

- Las 3 landings cargan con la misma estructura visual que la ficha de tour
  (mismo hero, mismo grid, mismas secciones reusables).
- El widget de la derecha es un formulario con 7 campos (nombre, email,
  WhatsApp, tipo, fecha, personas, mensaje), con validación nativa.
- El submit guarda en localStorage y redirige a `/eventos/:slug/gracias`
  con el resumen del form y el CTA WhatsApp.
- Las 3 landings son rutas reales: `/eventos/party-boat`,
  `/eventos/bodas`, `/eventos/empresas`. La home (megamenú Eventos + ticker
  + sección Special Events) enlaza a las 3.
- Cero hex/valores mágicos fuera de tokens; cero errores de consola;
  responsive a 390/768/1440; 0 × 404 de imágenes.
- Cada landing es una variante del MISMO layout (no 3 diseños) — en Figma
  será UNA página con 3 frames de variante, mismo principio que la ficha
  de tour.
