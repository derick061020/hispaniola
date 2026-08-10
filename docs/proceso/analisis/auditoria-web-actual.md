# Auditoría UX/UI — hispaniolaaquaticadventures.com

> Auditoría hecha el 2026-07-11 navegando el sitio real (desktop 1366px y móvil 390px)
> con Playwright. Capturas en `audit/`. Objetivo: base para el rediseño completo en Figma
> orientado a conversión (reserva de catamaranes).

---

## 1. Radiografía técnica

| Aspecto | Estado actual |
|---|---|
| Stack | PHP a mano + jQuery. Menú con plugin "meanmenu" (2013). Lazy-load de imágenes al scroll. |
| Booking | **Motor externo `xpotours.net` embebido en iframe cross-origin** (`xpotours.net/Hispaniola/excursion-booking.php`). Mismo desarrollador que la web (Web Macon Intl). |
| Empresa | Events & Entertainment Punta Cana LLC (también dueña de catamarantourspuntacana.com). |
| Idiomas | ES / EN vía `?lang=`. |
| Pagos | Stripe (checkout con tarjeta), PayPal mencionado en términos. |
| Consola | 3-5 errores JS en cada página. |
| SEO | Titles sobrecargados de keywords ("Catamaran Tour Snorkeling Excursion Punta Cana - Bavaro"). El booking en iframe = contenido invisible para Google. |

**Implicación para el rediseño:** la web y el checkout son dos productos distintos. Hay que
decidir temprano con Derick si el motor xpotours se puede reemplazar, re-skinear, o si el
rediseño debe convivir con el iframe (peor opción — limita todo el funnel).

---

## 2. Arquitectura de información

> **Corregido 2026-07-13.** La versión inicial de esta sección decía que el menú estaba
> "escondido tras hamburguesa incluso en desktop". Era un error de método: las primeras
> capturas se tomaron con un viewport de 914px, por debajo del breakpoint de 1170px, así
> que salía el menú móvil. **A partir de 1170px sí hay un megamenú de escritorio con 6
> ítems.** El mapa completo y verificado del sitio está en `mapa-del-sitio.md`.

Menú de escritorio (≥1170px), 6 ítems de primer nivel:

- **Home**
- **About Us** ▾ (Our Crew / Our Fleet / Our Foundation)
- **Catamaran Experiences** ▾ (megamenú de 2 columnas: "Punta Cana Half Day Snorkel" con
  3 tours, y "Saona Island Full Day" con 1)
- **Events & Celebrations** ▾ (Events & Party Boat / Weddings / MICE)
- **Sustainability** ▾ (Sustainability / Competitive Advantage)
- **Contact Us** ▾ (Contact / Travel Agents / TIPS / FAQ's)

Por debajo de 1170px, el plugin *meanmenu* lo sustituye por una hamburguesa que **aplana
toda la jerarquía** a 21 ítems planos (simula el anidamiento con guiones "- Our Crew").

### Problemas

1. **En escritorio NO hay ningún ítem de menú que lleve a reservar.** "Online Booking"
   existe en el menú móvil pero no en el de escritorio: al booking solo se llega por el
   botón del hero, el footer, o los CTA de las fichas.
2. **Dos ítems se llaman igual ("Private Tours") y llevan a páginas distintas**:
   `private-catamaran-snorkeling-excursion-puntacana.php` y
   `private-saona-island-excursion.php`. En el megamenú los distingue solo la columna;
   en el menú móvil aplanado quedan **idénticos y consecutivos**. El producto Isla Saona
   además no aparece en las tarjetas de la home (solo hay 3).
3. **El click al botón MENU lo intercepta el selector de idiomas** (bug real reproducido
   en anchos <1170px: `mobile-languages` tapa el área táctil — Playwright no pudo clickarlo).
4. **Los 4 tours cuelgan de un padre no clickeable** ("Catamaran Experiences"): no existe
   una página de listado de tours. O abres el megamenú, o los ves en la home.
5. **Un 5º tour está comentado en el código** del megamenú (`sustainability-experience.php`,
   hoy 404). Siendo el coral su mayor diferenciador, conviene preguntar al cliente qué pasó.
6. **9 links rotos visibles en la home**: los 9 iconos de "all our cruises include" apuntan
   a `feature.html` (404). Más 1 en Events (`pevents-...` con typo). Señal de que la web
   lleva años sin mantenimiento.
7. Catálogo real: 4 tours + eventos (bodas, cumpleaños, aniversarios, despedidas, MICE).
   La home solo enseña 3 tarjetas de tours y 4 de eventos, sin jerarquía de negocio.
8. Páginas de contenido (Tips, FAQ, Sustainability, Competitive Advantage) desconectadas
   del funnel — nada te devuelve a reservar.

---

## 3. Home (desktop y móvil)

Capturas: `audit/home-desktop-full2.jpeg`, `audit/home-mobile-full.jpeg`.

### Bloqueos de entrada

- **Modal de video de YouTube que se abre solo** al aterrizar ("THIS VIDEO IS FOR YOU")
  con banner de descarga de un PDF ("Quick Guide for Excursion Shopping"). Bloquea el
  hero en desktop Y en móvil. Primera impresión = interrupción.
- Widget flotante "Facebook Rating 5.0 — 611 reviews" abajo-izquierda en TODAS las
  páginas, tapando contenido.
- Notificación "Last reservation: X minutes ago" que cambia con cada carga (35 min →
  21 segundos → 1 minuto). Como patrón de urgencia es de credibilidad dudosa y se ve fake.

### Hero

- Titular OK conceptualmente ("The Original Punta Cana Catamaran Cruises") pero
  tipografía sin jerarquía moderna.
- **Badge estrella naranja "WHY BOOK WITH US? CLICK HERE"** — estética de 2005, compite
  con el CTA real.
- CTA único "CHECK AVAILABILITY" → manda al booking genérico (sin contexto de producto).
- Logo: langosta pirata caricaturesca. Choca frontalmente con el posicionamiento premium
  que el propio copy reclama ("carefully crafted Caribbean experience").

### Cuerpo

- **Muro de texto de 7 párrafos** antes de cualquier elemento accionable. El contenido es
  bueno (grupos reducidos, cocina flotante, restauración de coral, sin plásticos) pero
  está enterrado en prosa.
- Iconos de "all our cruises include" (snorkel, transporte, comida fresca, wifi, fotos…)
  — la sección correcta, ejecución plana.
- **Solo 3 tarjetas de producto**: Semi-Private (adults only, from $98), Snorkel Lovers
  (families, from $98), Private Tours (from $55). Diseño aceptable (badge, precio,
  duración, capacidad, baños) pero:
  - **Precios inconsistentes con la ficha**: la home dice "from $98" y la ficha
    Semi-Private vende Light a $99 / "starting at $84 tras descuentos" y Premium a $114.
  - Botón hover duplicado ("MORE DETAILS" aparece dos veces superpuesto — bug CSS).
  - Falta Saona, falta rating, falta "free cancellation".
- Banner "YOUR NEXT ADVENTURE AWAITS... Contact us directly = Best services & Excellent
  Rates" — texto blanco sobre foto clara, casi ilegible. Y es LA frase de venta directa.
- Barra de 5 bloques de colores de redes sociales a mitad de página = ruido visual; en
  el booking además **tapa contenido del formulario** (bug de z-index/overlap).
- Móvil: la home mide **11.208px de alto** (~13 pantallas). Las tarjetas de tours
  aparecen pasado el 40% del scroll.

### Señales de confianza (activo desaprovechado)

Frente al hero hay una barra de premios real y potente: TripAdvisor "#1 water activity
in Bavaro/Punta Cana +7 años", WeddingWire Couples' Choice 2018-2021, Luxury Travel Guide
Award, Viator Experience Awards 2022/2023/2024. Todo en imágenes pequeñas de baja
resolución, sin números ("4.9", "1.782 reviews") ni enlaces verificables.

---

## 4. Ficha de tour (Semi-Private, la principal)

Captura: `audit/tour-semiprivate-full.jpeg`.

Estructura actual: hero con H1 → banner eco → stats (Limited Capacity / 4.454 days
sailed / 91.607 happy clients) → 5 párrafos → "What's included" → paquete Premium (fotos
de platos, "starting at $103", precio $114, CTA) → banner "4 hours" → paquete Light
($84/$99, CTA) → galería "Memories" (decenas de fotos pequeñas) → formulario "Request
your quote" (de eventos) → logos de pago → footer.

### Problemas de conversión

1. **El precio aparece tras ~6 pantallas de scroll.** Ninguna ancla, ningún widget sticky.
2. **Aritmética de precios confusa**: "Starting at US$103" junto a "US$114" — el $103
   resulta de apilar descuentos condicionales (5% repeat + 5% early 30d + 5% cash). El
   turista no hace esa cuenta; percibe dos precios contradictorios.
3. Dos paquetes (Premium/Light) presentados como bloques independientes con secciones
   duplicadas ("What to bring" ×2) en vez de una comparación lado a lado.
4. **Cero reviews en la página** — teniendo 4.9★ y 1.782 reviews en Viator y #1 en
   TripAdvisor. Ni widget, ni quotes, ni estrellas.
5. No hay: itinerario visual (timeline de las 3 paradas), mapa, FAQ del tour, política de
   cancelación visible, sección "qué esperar", disponibilidad inline.
6. El formulario "Request your quote" es de EVENTOS (birthday, wedding…) y está plantado
   en la ficha de un tour regular — confunde el job-to-be-done de la página.
7. Los horarios (9am-1pm / 1pm-5pm) están enterrados en el párrafo 5.
8. Lo BUENO a conservar: fotos reales de los platos (nadie más en el mercado las tiene),
   stats de trayectoria, la elección de menú como diferenciador, wifi a bordo.

---

## 5. Flujo de booking (webres.php → iframe xpotours)

Capturas: `audit/booking-01-form.jpeg` (inicial), `booking-02-availability.jpeg`
(disponibilidad), `booking-03-slot-selected.jpeg` (modal de menús), `booking-04-summary-total.jpeg`,
`booking-mobile-full.jpeg`.

### Flujo actual, paso a paso (reproducido completo)

1. Llegas a un **formulario monolítico en columna estrecha** (~500px) dentro del iframe.
2. Te pide, ANTES de enseñarte nada: hotel (autocomplete — al elegirlo muestra hora de
   pick-up, eso está bien resuelto), **fecha de llegada Y salida de tus vacaciones**,
   nº de habitación, participantes, promo code y "How did you hear about us?" (dropdown
   de 13 opciones de marketing interno **en medio del checkout**).
3. Botón "Check Availability" → tablas por día (una tabla HTML por fecha de tu estancia)
   con radios de horario (9:00 AM / 1:00 PM) y "Average per Person US$ 114.00".
4. Al elegir horario salta **modal rojo de alerta "Missing Menu's: 2"** (error ortográfico
   incluido) para asignar plato a cada pasajero (Seafood/Meat/Surf&Turf/Vegetarian/
   Lasagna). El concepto (elegir menú) es un diferenciador buenísimo; la ejecución
   (alerta roja de error + spinners numéricos) lo convierte en fricción.
5. El resumen actualiza: Total $228, **Deposit $57 (25%)** — puedes confirmar pagando
   solo el 25% y el resto en efectivo el día del tour, con 5% extra de descuento si el
   resto es cash. **Este es el mejor argumento de reserva directa del negocio y está
   presentado como un checkbox con letra pequeña.**
6. Datos personales: nombre, ciudad, país (select de ~190 opciones), email, teléfono con
   formato forzado xxx-xxx-xxxx, comentario.
7. Checkbox de términos (los términos en sí son buenos: reembolso total 7 días antes,
   reembolso por mal clima) + "CHECK-OUT with Credit Card — Powered by Stripe".

### Diagnóstico

- **El orden está invertido respecto a todo el mercado**: las OTAs piden fecha + personas
  y te enseñan disponibilidad al instante; aquí te piden tu itinerario de viaje completo,
  hotel y hasta cómo los conociste antes de mostrarte un horario.
- Sin indicador de pasos, sin barra de progreso, todo en una página que se re-renderiza.
- La barra de redes sociales del sitio **tapa físicamente el formulario y el modal de
  menús** (bug reproducido en desktop y móvil).
- Iframe cross-origin: sin deep-links a un tour+fecha, analytics partido en dos dominios,
  imposible de indexar, y estilos incoherentes con el sitio.
- En móvil la misma columna con fuentes minúsculas; enormes espacios muertos.
- Trust en el checkout casi nulo: no hay resumen visual del tour (foto, fecha elegida en
  grande), ni sellos de cancelación, ni reviews, solo el logo de Stripe al fondo.

---

## 6. Bugs y quick-wins encontrados (independientes del rediseño)

| # | Bug | Dónde |
|---|---|---|
| 1 | Selector de idiomas intercepta el click del botón MENU | Header, todas las páginas |
| 2 | Barra social tapa contenido del formulario de booking y el modal de menús | webres.php |
| 3 | Doble botón "MORE DETAILS" superpuesto en hover de tarjetas | Home |
| 4 | Modal de video se auto-abre en cada visita (sin cookie de "ya visto") | Home |
| 5 | "Missing Menu's" — apóstrofe incorrecto, y patrón de alerta-error para un paso normal | Booking |
| 6 | Precios home ($98) vs ficha ($84-114) inconsistentes | Home + fichas |
| 7 | 3-5 errores de consola JS por página | Global |
| 8 | Banner "YOUR NEXT ADVENTURE AWAITS" ilegible (blanco sobre claro) | Home |
| 9 | "Last reservation: 21 seconds ago" — urgencia no creíble | Global |
| 10 | Estadísticas contradictorias en la misma página: "90.498 Happy Clients, 1.336 days sailing" en el encabezado vs "301.661 happy clients... 4.456 days of sailing" en el párrafo de abajo | why-book-with-us.php |
| 11 | `competitive-advantage.php` es un stub de una sola frase ("videos que muestran la Bávaro Reefs Foundation") sin los videos ni contenido real, anidado sin necesidad bajo Sustainability | competitive-advantage.php |

---

## 7. Activos reales del negocio (lo que el rediseño debe amplificar)

1. **Prueba social de élite**: 4.9★ con 1.782 reviews y "Recommended by 98%" en Viator,
   #1 TripAdvisor en actividad acuática +7 años, premios Viator 2022-2024, WeddingWire,
   611 reviews 5.0 en Facebook, 91.607 clientes, 4.454 días navegados.
2. **Diferenciadores operativos**: barcos a ≤35% de capacidad, proyecto propio de
   restauración de coral (top-3 de RD, avalado por Ministerio de Medio Ambiente) con
   bióloga marina a bordo, "floating kitchen" con elección de menú por pasajero (con
   fotos reales de los platos), eco/no-plastic, wifi a bordo, adults-only vs familias.
3. **Ventajas de reserva directa ya existentes pero mudas**: depósito del 25% (resto en
   efectivo el día del tour), 5% descuento cash, 5% repeat, 5% early-booking, elección
   de menú online, reembolso total 7 días antes y por mal clima, WhatsApp directo.
4. Contenido fotográfico y de video abundante (galerías reales, canal de YouTube).

> **La tesis del rediseño**: no hay que inventar argumentos de venta — hay que rescatar
> los que ya existen del muro de texto y ponerlos en la jerarquía visual correcta, con
> un flujo de reserva al estándar OTA. Ver `benchmark-competencia.md`.
