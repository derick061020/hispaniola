# Benchmark de competencia — Hispaniola

> 2026-07-11. Navegado en vivo: Civitatis (ficha completa + widget), Viator (categoría
> Punta Cana + la propia ficha de Hispaniola), Klook (búsqueda), Coastline Catamarans y
> panorama de operadores directos. Capturas en `audit/comp-*.jpeg`.
> Complementa el research previo del cerebro ([[hispaniola-referencias]]: GetYourGuide,
> The Moorings, Black Tomato, Aman, Sunreef).

---

## 1. Civitatis — el patrón de ficha de actividad a copiar

Página analizada: "Saona Island Boat Trip" (US$77). Captura `comp-civitatis-01/02`.

**Anatomía de la ficha (arriba → abajo):**

1. Breadcrumb (RD → Punta Cana → Day trips) — orientación + SEO.
2. **H1 + fila de confianza inmediata**: rating (8/10) + nº reviews (link) + badge
   "Free cancellation" + badge "Hotel pickup". Todo above the fold.
3. **Precio grande arriba-derecha (US$ 77) + CTA "See availability"** — visible siempre
   (se repite en navbar sticky al hacer scroll).
4. Mosaico de fotos 5-up con **quote de review real superpuesta** y "See more photos (33)".
5. Navbar de anclas: Description | Details | Cancellations | Reviews.
6. Descripción corta + "View complete description" (colapsada — lo contrario al muro de
   texto de Hispaniola).
7. **Widget de reserva en sidebar sticky**: calendario con días disponibles resaltados y
   agotados tachados → hora (07:30) → "People" → botón gigante "Book". Cero datos
   personales antes de ver disponibilidad.
8. "More Information": duración, idioma, **lista "Included" con bullets** — escaneable.
9. Asistente IA embebido ("I know almost everything about this activity, ask me").

**Lecciones para el rediseño:**
- Disponibilidad primero, identidad después. El calendario ES la página.
- Cancelación gratis como badge de primer nivel, no como párrafo de términos.
- Reviews integradas (quote sobre las fotos + sección propia + link desde el rating).
- Descripción colapsada: la prosa existe pero no bloquea la decisión.

## 2. Viator — la ficha del PROPIO producto de Hispaniola

Página: "Punta Cana Adults-Only Snorkel tour with Premium Seafood Lunch" (d794-87267P1)
— es el Semi-Private de Hispaniola listado por ellos mismos. Captura `comp-viator-02`.

**Cómo vende Viator el MISMO producto:**
- Título orientado a beneficio ("Adults-Only… Premium Seafood Lunch"), no a marca.
- **4.9★ · 1.782 reviews · "Recommended by 98% of travelers"** en la primera línea.
- "Lowest Price Guarantee" + **from $114.00 per person** (fecha y 2 viajeros
  pre-seleccionados, hora en dropdown) + "Check Availability".
- Urgencia CREÍBLE y con datos: "High Interest — Booked 4 times today" y "Book ahead! On
  average, this is booked 26 days in advance".
- **Free cancellation (hasta 24h)** + **Reserve Now and Pay Later** destacados junto al CTA.
- Fila de metadatos: 4 hours · Pickup offered · Mobile ticket · Offered in English +2.
- Sección "Why travelers loved this" con quotes.
- Hasta un modal de cupón (10% off next experience) — agresivos en captura.

**El insight estratégico más importante del análisis:**
> Viator vende el tour al MISMO precio que la web propia ($114). Hoy un turista que
> compara no tiene NINGUNA razón visible para reservar directo. Las ventajas reales de
> reservar directo (depósito 25%, 5% cash, elección de menú, WhatsApp) existen pero la
> web no las presenta como comparación "Book direct vs OTA". El rediseño debe tener un
> bloque explícito de "Why book direct" con beneficios concretos, no genéricos.

Además: Viator = "prices from $45" y 300+ resultados en la categoría catamarán Punta
Cana. Competir por precio es imposible; hay que competir por diferenciación (premium,
grupos chicos, eco, comida) — que es exactamente el inventario de activos que Hispaniola
ya tiene.

## 3. Klook — patrones de tarjeta

Inventario débil en Punta Cana (2 resultados reales; el resto ruido de otras ciudades).
Patrón de tarjeta útil de todas formas: categoría • ciudad, título, y **badges operativos
al frente: "Book now for today/tomorrow", "Free cancellation", "Instant confirmation",
duración, "English guided", "Private tour"**. La reserva inmediata ("hoy/mañana") como
primera promesa es un patrón fuerte para un mercado de turistas ya en destino.

## 4. Competencia directa (webs propias de operadores en Punta Cana)

- **Coastline Catamarans** (coastlinecatamarans.com): home de UNA pantalla, 4 links
  gigantes (Gallery/Contact/Excursions/**Book Direct**), estética amateur pero mensaje
  "Book Direct" prominente. Captura `comp-coastline-home.jpeg`.
- **catamaranspuntacana.com**: booking con calendario y confirmación instantánea, foco
  Saona. **boattripspuntacana.com**: privados/lujo, cancelación 100% hasta 24h.
  **yachtcharterspuntacana.com**: charters privados desde $650. **puntacanatours.com**:
  agregador local multi-tour.
- Ninguno visitado/detectado tiene una web de nivel OTA. **El listón del mercado directo
  es bajo**: una web con estándar Civitatis/GetYourGuide + la prueba social de Hispaniola
  sería inmediatamente la mejor del segmento en Punta Cana.

## 5. Síntesis: qué debe hacer el rediseño (mapa de decisiones para Figma)

### Jerarquía de home
1. Hero: promesa + búsqueda/CTA de disponibilidad + fila de confianza (4.9★ · 1.782
   reviews · #1 TripAdvisor 7 años · premios como logos limpios).
2. **Las 4 tarjetas de producto** (Semi-Private Adults · Snorkel Familias · Privado ·
   Saona) con: foto, rating, duración, capacidad máx, "free cancellation", precio desde,
   CTA directo a SU ficha. Nombres únicos — resolver el doble "Private Tours".
3. Bloque "Why book direct" (25% depósito, 5% cash, menú a elección, WhatsApp, reembolso
   por clima) — la conversación contra Viator.
4. Diferenciadores como historia visual corta: coral + bióloga marina, cocina flotante,
   ≤35% capacidad, eco/no-plastic (íconos + 1 línea, no párrafos).
5. Eventos (bodas/cumpleaños/MICE) como segunda línea de negocio clara.

### Ficha de tour (plantilla única)
- Above the fold: H1 beneficio + rating/reviews + badges (Free cancellation · Hotel
  pickup · Adults only/Familias) + precio desde + **widget sticky de disponibilidad**
  (calendario → horario → personas → CTA).
- Mosaico de fotos con quote de review; galería con lightbox (no grid infinito).
- Itinerario visual de 3 paradas (timeline con mapa), "Included" en bullets, menú con
  fotos de platos (mantener — es único), comparación Premium vs Light lado a lado,
  reviews reales, FAQ del tour, política de cancelación en claro.
- Los dos precios ($114/$99) sin la aritmética confusa de "starting at": un precio bases
  y los descuentos como incentivos etiquetados en el checkout ("paga en cash y ahorra 5%").

### Flujo de reserva objetivo (independiente de si se mantiene xpotours)
1. Fecha + personas (+ horario) → disponibilidad instantánea. SIN datos del viaje.
2. Extras contextuales: elección de menú como paso bonito (fotos de platos, no alerta
   roja), hotel/pick-up DESPUÉS de elegir el tour (con la hora de recogida como feedback).
3. Datos de contacto mínimos + resumen visual persistente (foto, fecha, hora, pax, total,
   depósito 25% como opción destacada).
4. Pago Stripe + confirmación instantánea + voucher.
   Referral/"how did you hear" fuera del funnel (al email post-compra, si acaso).
- Indicador de pasos, mobile-first, mismo dominio visual que el sitio (aunque siga siendo
  iframe, re-skin obligatorio).

### Urgencia/confianza bien hecha (sustituir lo fake)
- "Booked X times today" / "se reserva con ~26 días de antelación" (datos reales del
  motor) en vez de "last reservation: 21 seconds ago".
- Capacidad limitada real: "solo quedan N plazas para el martes" si el motor lo sabe.

### Dirección visual (conectar con el research previo)
- Paleta y fotografía: azul/verde caribe premium — referencia Sunreef/Black Tomato/Aman
  del research inicial ([[hispaniola-referencias]]), no parque temático.
- El logo langosta-pirata es decisión del cliente, pero el rediseño debería proponer un
  tratamiento (versión monocroma/sello) que no sabotee el tono premium.
- Tipografía: serif elegante para display + sans limpia para UI (patrón Aman/Black
  Tomato) o sans dual-weight; nada de scripts decorativos actuales.

---

## Fuentes

- [Civitatis — Saona Island Boat Trip](https://www.civitatis.com/en/punta-cana/isla-saona-cruise/)
- [Viator — categoría Catamaran Cruises Punta Cana](https://www.viator.com/Punta-Cana-tours/Catamaran-Cruises/d794-g3-c32016)
- [Viator — ficha del tour de Hispaniola](https://www.viator.com/tours/Punta-Cana/Adults-only-Small-group-snorkel-catamaran-tour-lobster-included-1-trip-advisor-5years-in-a-row/d794-87267P1)
- [Klook — búsqueda punta cana catamaran](https://www.klook.com/en-US/search/result/?query=punta%20cana%20catamaran)
- [Coastline Catamarans](https://coastlinecatamarans.com/) · [Catamarans Punta Cana](https://catamaranspuntacana.com/) · [Boat Trips Punta Cana](https://boattripspuntacana.com/) · [Yacht Charters Punta Cana](https://yachtcharterspuntacana.com/catamarans) · [Punta Cana Tours](https://puntacanatours.com/catamaran-sailing/)
