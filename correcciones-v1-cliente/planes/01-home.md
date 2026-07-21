# Plan de correcciones — HOME

> **Fuente:** `HOME - Ajustes web hispaniolaaquaticadventures.com.pdf` — 19 slides de
> contenido (p1 portada, p20-21 vacías).
> **Cruzado con:** `app/src/pages/home.tsx` y sus componentes en `src/components/home/`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Orden actual de la home (para ubicar cada corrección)

`home.tsx` monta, en este orden:
`ModalBienvenida` (popup) → `Hero` → `Premios` → `EcoFriendly` → `Experiencia` →
`ToursGrid` → `WhyDirect` → `IncluyeCrucero` → `Reviews` → `EventosEspeciales` →
`Contacto` → `Faq` → `Footer`.

---

## TL;DR — las 11 correcciones de la home

**Eliminar (1):**
1. El popup de bienvenida (`ModalBienvenida`).

**Mejorar lo que ya existe (6):**
2. Hero: video de fondo con la calidad de vanpraet.be + menú sticky que cambia al scroll.
3. Cintillo eco-friendly: rehacerlo, más moderno y mejor calidad.
4. Sección «No es solo un paseo en barco» (`Experiencia`): revelar el texto al scroll (getblue.com) y cambiar el collage de fotos por un **video** (six2eight.com) — el del popup, que a Fernando le encanta.
5. Reseñas (`Reviews`): logo de Google, barra multi-plataforma (Google/TripAdvisor/Viator), «reseña verificada», video-testimonios, botón **«Déjanos tu reseña»**, aprovechar los espacios en blanco.
6. Contacto (`Contacto`): «dale más cariño» — card de persona real + form con canal preferido + bloque «¿Ya tienes reserva?».
7. Footer: métodos de pago, badge de valoración, selector idioma/moneda, redes.

**Agregar secciones nuevas (4):**
8. Sección **Instagram + TikTok** («Míranos en acción») — carrusel de reels.
9. Sección de **videos** tipo letsplayfight.com — varios videos que colapsan en uno.
10. Sección de **equipo** («Las personas detrás de tu día en el mar»).
11. **Pruebas de compra** (social proof: «Última reserva hace 50 min»).

> Nota: mejora #2 (hero sticky) y el FAQ con efecto ya están **muy avanzados o
> planificados** en `PLAN-v3.md` (§4–§11 el hero/notch; el FAQ de la home usa el
> Accordion de AlignUI). Ver cada punto abajo.

---

## Slide por slide

### Slide 2 — Eliminar popup
**Cliente:** «Eliminar popup» (el modal de video que se auto-abre al entrar).
**Cómo lo aplicamos:** quitar `<ModalBienvenida />` de `home.tsx:65` y borrar
`modal-bienvenida.tsx` sin dejar cadáveres (su estado `dev-*` en el registry, su
entrada en el README). **Pero ojo:** el video del popup **no se tira** — se recicla
en la sección Experiencia (slide 7) y como fuente del hero. Es el mismo asset
(`youtube K65cchLFwRs`, ya documentado en `PLAN-v3.md §3`).
**Archivos:** `home.tsx`, borrar `components/home/modal-bienvenida.tsx`, `dev-registry.ts`.
**Esfuerzo:** trivial. **Riesgo:** ninguno.

### Slide 3 — Hero: calidad de video + menú sticky
**Cliente:**
- «Conseguir que el video tenga la misma calidad que el que aparece en esa web» →
  ref **vanpraet.be**.
- «Ver cómo quedan este tipo de menús… cambia de efecto cuando haces el scroll para
  que siempre esté visible» → refs **sentient.foundation, tunnelcraft.co.uk, apoha.com**.

**Estado en el repo:** el hero con video de fondo **ya está construido** (`PLAN-v3.md
§3–§5`): mp4 auto-hosteado, recortado y comprimido (≤6 MB), con poster y
reduced-motion. Y el header vive DENTRO del hero (`§4`) con el «notch dinámico»
(`§11`) tipo Dynamic Island.

**Cómo lo aplicamos:**
- **Calidad de video:** el techo de calidad hoy lo pone el presupuesto de peso
  (≤6 MB) y la fuente (YouTube 1080p re-comprimido). vanpraet.be se ve nítido porque
  usa un clip corto muy optimizado. Acciones: (a) subir el bitrate objetivo revisando
  `-crf` (de 26 → 23) y probar `scale=1920` si el peso aguanta con un clip de 10-15 s;
  (b) **pedir a Fernando el master del video en alta** (no el de YouTube) — es la
  única forma real de igualar vanpraet. Anotado en «Pide al cliente».
- **Menú sticky que reaparece al scroll:** hoy, integrado en el hero, el header **se
  va con el scroll** (decisión abierta §9.1 del PLAN-v3). Esto es exactamente lo que
  el cliente pide resolver. Propuesta: implementar el patrón **«header fantasma»** —
  una barra compacta que reaparece (slide-down + fade) al scrollear hacia arriba, o
  al pasar el hero. Es una decisión que ya estaba abierta esperando ver la v3 en
  pantalla; el cliente acaba de cerrarla: **la quiere**.

**Archivos:** `components/home/hero.tsx`, `header.tsx`, un nuevo
`use-header-fantasma.ts`, tokens en `tokens.css` (duración/altura de la barra),
`dev-registry.ts` (estado `?dev-header=fantasma`).
**Esfuerzo:** medio (el fantasma es un componente + hook nuevos). **Riesgo:** medio —
hay que no pelear con el notch dinámico ni el CTA sticky de móvil.
**Duda para Samuel:** ¿el fantasma muestra el notch completo o una versión mínima
(logo + Reservar + hamburguesa)? Las refs (sentient/apoha) usan una barra mínima.

### Slide 4 — Cintillo eco-friendly: rehacer
**Cliente:** «Rehacer con un formato más moderno y actual y mejor calidad» (sobre el
badge «ECO-FRIENDLY · CERO PLÁSTICO A BORDO»).
**Estado en el repo:** `eco-friendly.tsx` ya es un rediseño nuestro (cintillo delgado
con gradiente menta + insignia real del cliente sobresaliendo). Lo que se ve «viejo»
es la **insignia PNG** (`/marca/eco-friendly-logo.png`, descargada de la web actual —
baja resolución, estética de sello 2012).
**Cómo lo aplicamos:** el layout se mantiene; lo que se rehace es **el sello**.
Opciones: (a) recrear la insignia limpia en Magnific/SVG a nuestra paleta (una hoja +
gota, línea fina, aqua con cuentagotas); (b) volverlo tipográfico sin PNG (ícono
lucide `Leaf` + `Recycle` en aqua sobre el cintillo). Recomiendo (a) como SVG →
escala perfecta y es un futuro componente de Figma.
**Archivos:** `eco-friendly.tsx`, asset nuevo en `/marca/`, o token de ícono.
**Esfuerzo:** bajo-medio (el trabajo es el asset). **Riesgo:** bajo.

### Slide 5 — «No es solo un paseo en barco»: texto revelado al scroll
**Cliente:** «Agregar un formato de mostrarse esa frase según se hace scroll» → ref
**getblue.com** (texto que se revela palabra a palabra / línea a línea al scrollear).
**Estado en el repo:** `Experiencia` **ya tiene reveal al scroll** (`use-experiencia-scroll.ts`,
GSAP — texto y fotos entran escalonados). Pero es un fade+slide por línea, no el
efecto getblue (revelado tipográfico progresivo, tipo «karaoke» o máscara).
**Cómo lo aplicamos:** subir el reveal actual al estilo getblue — máscara de opacidad
que avanza con el scroll sobre el párrafo grande (cada segmento `fuerte`/normal ya
está troceado en `EXPERIENCIA_NARRATIVA`, así que el reveal por segmento es directo).
Mantener enganchado al scroll (no autoplay), respetar `prefers-reduced-motion`, y un
`?dev-exp=estatico` que ya existe para el frame de Figma.
**Archivos:** `use-experiencia-scroll.ts`, `experiencia.tsx`, `componentes.css`.
**Esfuerzo:** medio. **Riesgo:** bajo (ya hay infraestructura GSAP).

### Slide 7 — Experiencia: collage de fotos → video
**Cliente:** «Agregar efecto de video como este y poner el video del popup inicial
aquí dado que a Fernando le gusta mucho ese video» → ref **six2eight.com** (el laptop
con video incrustado).
**Estado en el repo:** `Experiencia` muestra hoy un **collage de 3 fotos** (POSICIONES
en `experiencia.tsx`, estilo photo-stack con borde y sombra).
**Cómo lo aplicamos:** reemplazar el collage por un **marco de video** (el mismo mp4
del ex-popup). Two options de «efecto»:
- (a) **Mockup device** tipo six2eight (el video dentro de un marco de laptop/tablet
  con sombra realista) — más literal a la ref.
- (b) **Marco flotante** con el mismo lenguaje de sombra del photo-stack actual (más
  coherente con nuestra dirección; el six2eight es muy «agencia SaaS»).
Recomiendo (b): reusa `.collage-foto` sombra/borde que ya está en `componentes.css`,
cambia `<img>` por `<video autoplay muted loop playsInline>`. Así el video hereda
nuestra estética y no la de six2eight.
**Consistencia:** este es **el mismo video** del hero y del ex-popup → un solo asset,
tres usos. Bien.
**Archivos:** `experiencia.tsx`, `data/home.ts` (cambiar `EXPERIENCIA_FOTOS` por un
campo de video o añadir uno), `componentes.css`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Duda para Samuel:** ¿mantenemos también
alguna foto o el bloque pasa a ser 100% video?

### Slide 6 — Grid de tours (sin cambios)
Screenshot de `ToursGrid` sin anotaciones. El cliente lo muestra como está = OK.
`PLAN-v3.md §17` ya lo rediseñó (cards «objeto suave»). **Sin acción.**

### Slides 8-9 — NUEVA sección: Instagram + TikTok («Míranos en acción»)
**Cliente:** placeholder «sección instagram y tiktok» + una maqueta IA:
- Eyebrow «REELS · INSTAGRAM · TIKTOK», H2 «Míranos en acción».
- Carrusel de **5 cards verticales tipo reel** (formato 9:16) con: handle
  (@maria.travels / Hispaniola / @carlos.rd), botón play, título y nº de vistas
  («45,2 mil»).
- Fila de botones: Instagram · TikTok · Facebook + contador «+38 mil».
- Cierre: «¿Navegaste con nosotros? Etiquétanos con **#HispaniolaMoments** y sal en
  nuestra web.»
**Ubicación propuesta:** entre `EventosEspeciales` y `Contacto` (donde el slide 8 la
sitúa, justo antes del mapa/contacto).
**Cómo lo aplicamos:**
- Componente nuevo `components/home/reels-sociales.tsx` — carrusel horizontal de cards
  9:16. **Reusar la mecánica del ticker del hero** (marquee CSS + pausa hover, o el
  step-carousel de Reviews) en vez de inventar. Nuestra estética: cards con foto real
  a sangre, overlay inferior con handle+vistas, botón play en aqua con cuentagotas.
- **Datos:** nuevo `REELS` en `data/home.ts` — necesitamos vídeos/thumbs y handles
  reales. Hoy **no los tenemos**. Provisional: thumbs de las galerías reales +
  handles reales de las redes del cliente; los contadores de vistas **no se inventan**
  (o se omiten, o se piden reales).
- **Integración real de feeds** (embeds en vivo de IG/TikTok) es una decisión aparte:
  los embeds oficiales rompen la estética y el «cero librerías» de la home. Propuesta:
  **carrusel curado** (nosotros elegimos los reels) con link a los perfiles, no un
  feed automático. Si el cliente quiere feed en vivo, es fase 2 con su coste visual.
**Archivos:** `reels-sociales.tsx` nuevo, `data/home.ts`, `home.tsx`, `dev-registry.ts`.
**Esfuerzo:** medio-alto. **Riesgo:** medio (depende de assets reales).
**Pide al cliente:** los reels que quiere mostrar (o permiso para curar), handles
oficiales, y si quiere vistas reales.

### Slide 10 — NUEVA sección: videos que colapsan en uno
**Cliente:** «Agregar sección de videos similares a esta» → ref **letsplayfight.com**
(«Videos en movimiento y que luego se quede en uno solo que potencie los catamaranes,
clientes felices, etc.»).
**Cómo lo aplicamos:** sección nueva con scroll-driven animation (GSAP, ya en el
stack): varios clips pequeños dispersos que, al scrollear, convergen y se funden en
un video protagonista a pantalla ancha. Es un efecto «wow» de gama alta — encaja con
Charter Premium. Contenido: catamaranes navegando + clientes felices (assets reales/
Magnific).
**Ubicación propuesta:** candidata a ir cerca de `IncluyeCrucero` o entre `WhyDirect`
e `IncluyeCrucero` (zona de storytelling), **no** amontonada con Reviews.
**⚠️ Riesgo de solape:** con esto + Reviews (video-testimonios) + Experiencia (video)
+ Reels, la home acumula **mucho video**. Hay que dosificar para no saturar ni
disparar el peso de página. Recomiendo decidir con Samuel cuáles de las secciones-video
sobreviven juntas.
**Archivos:** `videos-inmersivo.tsx` nuevo + hook GSAP, `data/home.ts`, `home.tsx`.
**Esfuerzo:** **alto** (animación compleja). **Riesgo:** alto (rendimiento + peso).
**Pide al cliente:** los clips en alta.

### Slides 11-12 — Reseñas: multi-plataforma + verificadas + «déjanos tu reseña»
**Cliente (anotaciones):** «agregar logo de Google», «intentar que sea lo más real
posible», «muchos espacios, ver si se puede aprovechar», «botón agregar reseña». Y la
maqueta IA muestra: barra de rating con **Google / TripAdvisor / Viator** (logos +
nota cada uno), 2 **video-testimonios** grandes, 3 cards con badge «Reseña verificada»
(cada una con su plataforma), botones «Ver las 1.782 reseñas» + **«Déjanos tu
reseña»**, y la nota «ideal: widget en vivo de Google/TripAdvisor».
**Estado en el repo:** `Reviews` ya tiene **video (izq) + carrusel de quotes (der)**.
Le faltan: logos de plataforma, badge verificada, la barra multi-plataforma, el botón
«déjanos tu reseña», y el 2º video-testimonio.
**Cómo lo aplicamos:**
- Añadir una **barra de confianza** arriba: 4,9 · logos Google/TripAdvisor/Viator con
  su rating. Los logos son marcas de terceros → SVG oficiales, tratados con respeto
  (grises, no coloridos a lo pincel). Es prueba social legítima.
- Badge **«Reseña verificada»** en cada card (dato real: son reseñas reales de
  `QUOTES` con su `plataforma`).
- Botón **«Déjanos tu reseña»** → link al perfil de Google/TripAdvisor del cliente
  (necesitamos las URLs — ya listadas como pendientes en `PLAN-v3.md §9.5`).
- «Aprovechar los espacios»: la maqueta llena el ancho con la barra + grid; nuestro
  layout 2-columnas deja aire — se puede pasar a barra full-width + grid de 3 debajo,
  como la maqueta, manteniendo nuestro estilo.
- **Widget en vivo (Google/TripAdvisor):** es lo «ideal» del cliente pero mete un
  script de terceros (rompe cero-librerías y la estética). Propuesta: **maqueta fiel
  con datos reales** ahora; widget en vivo como fase 2 opcional, avisando del coste
  visual. No inventamos reseñas ni ratings.
**Archivos:** `reviews.tsx`, `data/home.ts` (añadir `plataforma`/rating por fuente y
las URLs de perfil), logos SVG en `/marca/`, `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Pide al cliente:** URLs de sus perfiles
(Google/TripAdvisor/Viator) + los 2 video-testimonios reales.

### Slides 13-14 — Contacto: «dale más cariño»
**Cliente:** «dale más cariño please» + maqueta IA con: card de **persona real**
(«María C. · Atención al viajero · Punta Cana») con foto y chips (Respondemos en
minutos · Español e inglés · Equipo local) y CTA verde «Chatea con nosotros ahora»;
2 columnas «¿Prefieres que te escribamos?» (form con **canal preferido** y dropdown
«¿Sobre qué?») + «¿Ya tienes una reserva?» (input código HSP + Gestionar + mapa de
recogida); y las 4 tarjetas (WhatsApp/Teléfono/Email/Oficina) con **CTAs** («Chatear
ahora», «Llamar», «Escribir», «Ver en el mapa»).
**Estado en el repo:** `Contacto` = mapa iframe + form (Nombre/Email/Mensaje) + 4
cards sin CTA. Más plano que la maqueta.
**Cómo lo aplicamos (nuestra versión de «más cariño»):**
- Añadir la **card de persona real** arriba (rostro humano = confianza; encaja con
  «hablas con nosotros, no con un call center», que ya es el título). Foto real de
  alguien del equipo (pedir), o reusar a Lola/Eva del equipo (slide 15).
- Form: añadir **canal preferido** (WhatsApp/Email) y selector **«¿Sobre qué?»**
  (reserva / evento / duda). Sigue siendo prototipo sin backend (como hoy).
- Añadir el bloque **«¿Ya tienes una reserva?»** con input de código → enlaza a
  `/mi-reserva` (que ya existe, ver plan 07). Es coherencia de producto, no un mapa
  nuevo.
- Las 4 tarjetas ganan su **CTA** (ya tienen `href`; solo falta el texto-acción).
**Archivos:** `contacto.tsx`, `data/home.ts` (`CONTACTO` gana persona + opciones del
select + textos CTA), `dev-registry.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Pide al cliente:** foto + nombre real de la
persona de atención (o OK para usar a alguien del equipo).

### Slide 15 — NUEVA sección: equipo en la home
**Cliente:** «agregar sección del equipo» + maqueta IA: eyebrow «CONÓCENOS», H2 «Las
personas detrás de tu día en el mar», intro (gerencia española en PC desde 2012),
botón «Ver video del equipo · 30s», 3 cards (Omar Fundador/Director · Lola Tour Leader
Manager · Eva Sales Manager) con quote y CTA de contacto directo, + card «Y toda
nuestra tripulación a bordo».
**Estado en el repo:** este contenido **ya existe casi idéntico en la página
`/nosotros`** (`nosotros.tsx` → `tripulacion-flota.tsx`, y la maqueta de nosotros
slides 2-3 lo repite). Es decisión de arquitectura: ¿un teaser de equipo en la home
que enlaza a /nosotros, o duplicamos?
**Cómo lo aplicamos:** **teaser** en la home (3 cards + CTA «Conócenos» → /nosotros),
NO la sección completa (evitar duplicar). Reusar los datos de equipo de `data/nosotros.ts`.
Ubicación: cerca de `WhyDirect`/`Experiencia` (zona «por qué nosotros»).
**Archivos:** `equipo-teaser.tsx` nuevo, `home.tsx`, reusar `data/nosotros.ts`.
**Esfuerzo:** medio. **Riesgo:** bajo (contenido ya existe).
**Duda para Samuel:** ¿teaser en home + full en /nosotros, o el cliente quiere la
sección completa en la home? Recomiendo teaser.

### Slides 16-17 — FAQ con efecto
**Cliente:** «mira este efecto de mostrar las preguntas» → ref **six2eight.com**
(acordeón con animación, layout 2 columnas: intro a la izquierda + preguntas a la
derecha). Slide 17 = nuestro FAQ actual como referencia de lo que hay.
**Estado en el repo:** el FAQ de la home usa el **Accordion de AlignUI** (única pieza
AlignUI permitida en la home, decisión de Samuel 2026-07-17). Ya tiene apertura
animada.
**Cómo lo aplicamos:** subir el efecto de apertura al nivel six2eight (transición de
altura + fade del contenido más marcada) y evaluar el **layout 2 columnas** (intro/CTA
fijo a la izquierda, acordeón a la derecha) que hoy es 1 columna centrada. El Accordion
de AlignUI ya soporta la animación; es sobre todo layout + timing.
**Archivos:** `components/home/faq.tsx`, `alignui.css` (timing del accordion),
`componentes.css`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.
**Duda para Samuel:** ¿cambiamos a 2 columnas o mantenemos centrado? La ref es 2 col.

### Slide 18 — Footer enriquecido
**Cliente:** referencias (estilo Civitatis) sobre nuestro footer: **métodos de pago**
(Visa, Mastercard, PayPal, Amex, Apple Pay, G Pay, Klarna…), **badge de valoración**
(«9,1/10 · +X opiniones»), **selector de idioma y moneda**, iconos de **redes**.
**Estado en el repo:** `footer.tsx` ya tiene las 4 columnas + CTA océano + legal. Le
faltan esos 4 bloques.
**Cómo lo aplicamos:**
- **Métodos de pago:** fila de logos SVG en grises (prueba de seriedad). ⚠️ Solo los
  que el cliente **acepta de verdad** (no pintar Klarna si no existe) — pedir la lista
  real.
- **Badge de valoración:** ya tenemos «★ 4.9 · 1.782 reseñas · #1 TripAdvisor». Se
  puede elevar a un bloque más visible; no inventar el «9,1/10 Civitatis» salvo que
  el cliente esté en Civitatis con ese dato.
- **Selector idioma/moneda:** hoy el idioma/moneda vive en el `topbar` del header.
  Duplicarlo en el footer es patrón común (Civitatis). Es UI de prototipo (sin i18n
  real todavía) — dejar claro que es visual hasta que haya multi-idioma.
- **Redes:** iconos lucide a las redes reales del cliente.
**Archivos:** `footer.tsx`, `data/home.ts` (métodos de pago, redes), logos en `/marca/`.
**Esfuerzo:** medio. **Riesgo:** bajo. **Pide al cliente:** métodos de pago reales +
si opera multi-moneda/idioma de verdad.

### Slide 19 — Pruebas de compra (social proof)
**Cliente:** «agregar pruebas de compra» → badge tipo «⏱ Last reservation: 50 minutes
ago».
**Cómo lo aplicamos:** un **toast discreto** abajo-izquierda que aparece cada X
segundos con «Última reserva hace N min · [Tour]». ⚠️ **Honestidad:** sin backend no
hay reservas reales — un feed inventado es de dudoso gusto y puede sonar a truco. Dos
salidas: (a) marcarlo como prototipo y poblarlo con datos de ejemplo evidentes;
(b) esperar al motor de reservas (xpotours, pendiente del cliente) para datos reales.
Recomiendo **(a) como prototipo visual** ahora, con nota de que en producción se
alimenta del motor real. Discreto, cerrable, respeta reduced-motion.
**Archivos:** `prueba-social.tsx` nuevo, `home.tsx`, `data/home.ts`, `dev-registry.ts`.
**Esfuerzo:** bajo-medio. **Riesgo:** medio (percepción — decidir con Samuel si el
tono encaja con «Charter Premium» o si es demasiado «growth hack»).

---

## Riesgo transversal: SATURACIÓN DE VIDEO

Sumando las peticiones, la home pasaría a tener video en: hero, Experiencia,
Reels IG/TikTok, sección videos-colapso, y 2 video-testimonios en Reviews. **Son 5-6
zonas de video.** Riesgos: peso de página (LCP/CLS), batería móvil, y que el efecto
«wow» se diluya por repetición. **Recomendación:** priorizar hero + Experiencia +
Reviews (los que ya existen o son directos), y tratar Reels + videos-colapso como fase
2, decidiendo con Samuel cuál de los dos aporta más. No meter los 6 a la vez.

## Orden de ejecución sugerido

1. **Rápidas / limpieza:** eliminar popup (s2), CTAs en tarjetas de contacto (s13),
   badge verificada + botón reseña (s11).
2. **Mejoras de lo existente:** eco-friendly (s4), reveal getblue en Experiencia (s5),
   collage→video (s7), Reviews multi-plataforma (s11-12), Contacto con cariño (s13-14),
   Footer (s18).
3. **Header fantasma sticky** (s3) — cierra la decisión abierta del hero.
4. **Secciones nuevas de contenido existente:** equipo-teaser (s15).
5. **Secciones nuevas con assets pendientes:** Reels IG/TikTok (s8-9), pruebas de
   compra (s19).
6. **Efecto grande / fase 2:** videos-colapso letsplayfight (s10), calidad de video
   máster (s3), FAQ 2 columnas (s16).

## Pide al cliente (assets/decisiones que faltan)

- **Video máster en alta** (no el de YouTube) para el hero y Experiencia.
- **Reels reales** de IG/TikTok (o permiso para curar) + handles + si quiere vistas.
- **Clips en alta** para la sección videos-colapso.
- **URLs de perfiles** Google / TripAdvisor / Viator (para «déjanos tu reseña» y logos).
- **2 video-testimonios** reales de clientes.
- **Foto + nombre** de la persona de atención al viajero.
- **Métodos de pago** que acepta de verdad; si opera multi-moneda/idioma.
- **OK sobre tono** de las «pruebas de compra» (¿encaja con la marca premium?).
