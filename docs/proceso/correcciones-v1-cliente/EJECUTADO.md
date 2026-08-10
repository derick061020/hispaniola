# Correcciones v1 — qué se ejecutó (rama `staging`)

> **Fecha:** 2026-07-20/21 · **Rama:** `staging` · **Base:** commit `6982e14`
> **Comparar todo lo hecho:** `git diff 6982e14..staging -- app/src`
> **Volver atrás del todo:** `git checkout minimax`

`minimax` se queda intacta para comparar. El primer commit de `staging`
(`6982e14`) contiene **tu WIP sin commitear** (la auditoría responsive) para no
perderlo — todo lo que viene después es la ejecución de los planes.

## Commits

| Commit | Qué trae |
|---|---|
| `6982e14` | **base** — tu WIP responsive + los planes |
| `c8fd246` | HOME 1/3 — fuera popup, reseñas multi-plataforma, contacto, footer |
| `a0b6745` | HOME 2/3 — equipo, video en Experiencia, reveal palabra a palabra, sello eco |
| `41f25ef` | HOME 3/3 — reels, prueba social, Dev Mode |
| `19196f1` | PRODUCTO — distintivo, video en galería, widget, opiniones |
| `1518fc0` | NOSOTROS — timeline, equipo con nombre, flota ampliada |
| `31cbcb9` | INTERNAS — mi-reserva, FAQ con filtros |
| `ff24a82` | BLOG — página nueva |
| `c759dcb` | QA — arreglos encontrados en navegador |

---

## ⚠️ LO PRIMERO QUE DEBES MIRAR

### 1. Decisiones tuyas que he revertido a petición del cliente
Las tres tienen vuelta atrás fácil y están comentadas en el código:

- **El collage de 3 fotos de Experiencia → video.** El cliente lo pide
  explícitamente (slide 7). He **borrado** el collage entero (`.collage`,
  `.collage-foto`, el hover de grupo con `:has()`, los tokens
  `--collage-foto-*` y `EXPERIENCIA_FOTOS`) para no dejar cadáveres, que es la
  regla del proyecto. Era trabajo tuyo de 3 iteraciones (v3-F18.1/2/3).
  **Recuperarlo:** `git revert a0b6745`.
- **El ticker de checks del widget → estático.** Fernando lo señaló con una
  flecha: «Eso se ve raro». `ChecksTicker` sigue existiendo intacto (lo usa el
  widget de evento); volver es cambiar una línea.
- **El marquee de opiniones de la ficha → grid.** El cliente lo pide (slide 5).
  El CSS `.opiniones-marquee-*` sigue ahí porque lo usa la home.

### 2. Lo que el cliente pidió y NO he pintado (a propósito)
Todo esto son datos que **no existen** y que habría que inventar. Están
comentados en el código con el porqué, y listos para rellenar en cuanto lleguen:

- **Ratings por plataforma** (Google 4,9 · +900 reseñas / Viator 4,8 Premier).
  Los inventó la IA del cliente. Se pinta el agregado real (4,9 · 1.782) y solo
  las distinciones documentadas.
- **Barras de distribución de estrellas** (5★ 92%, 4★ 6%…). Inventadas. Sería
  estadística falsa sobre satisfacción de clientes reales.
- **Aceleradores de urgencia del widget**: «Lo más reservado», «Acaba el 09 de
  agosto», «−18% antes US$ 120», «Pocas fechas con disponibilidad». Sin motor
  de reservas no sabemos nada de eso, y es justo el bait-and-switch contra el
  que el propio `widget-reserva.tsx` lleva avisando desde que se escribió.
- **Vistas de los reels** («45,2 mil») y **handles de terceros**
  (@maria.travels, @carlos.rd — cuentas de clientes sin verificar ni permiso).
- **Capacidades de la flota de la maqueta** («hasta 40/80/30»): contradicen los
  tramos que ya cobramos. He usado las reales de las tablas del charter.

### 3. Decisión abierta de tono: las «pruebas de compra»
Está hecho (slide 19) pero **el patrón de urgencia social choca con Charter
Premium** — un hotel de lujo no te dice «¡3 personas están viendo esto!».
Además, sin backend son datos de ejemplo y la card lo dice en pantalla («Dato
de ejemplo»). Si no te convence: borra `prueba-social.tsx` y su línea en
`home.tsx`; no tiene más dependencias.

### 4. Riesgo que señalé en el plan y sigue vigente: saturación de video
La home tiene ahora video en hero, Experiencia, reels y los testimonios de
Reviews. **No he construido** la sección de videos-que-colapsan tipo
letsplayfight (slide 10): era la de mayor esfuerzo y riesgo de peso, y con las
otras cuatro ya montadas creo que sobra. Queda pendiente de tu decisión.

---

## Bug que encontré verificando (y por qué casi se cuela)

La ficha de tour **entera** reventaba (pantalla en blanco en los 4 tours) por un
import que faltaba. Ni `tsc` ni el build lo detectaron porque
**`npx tsc --noEmit` en este repo no comprueba nada**: el `tsconfig.json` raíz
tiene `"files": []` y solo referencias. El comando bueno es **`tsc -b`**, que es
el que corre `npm run build`. Lo dejo escrito aquí porque es una trampa que
volverá a morder.

---

## Estado de verificación

- `tsc -b --force` → exit 0.
- `npm run build` → OK.
- Navegador a **1440px y 390px**: home, ficha, nosotros, blog, artículo, faq,
  mi-reserva. Cero errores de consola, cero overflow-x, reels a sangre en móvil,
  prueba social oculta en móvil (no tapa el CTA sticky).
- Las 11 rutas responden 200.
- Cero hex y cero valores mágicos en lo nuevo.
- `oxlint`: 3 errores `rules-of-hooks` (`tour.tsx`, `paquetes-evento.tsx`) que
  **ya existían en la base** — verificado, no los he tocado.

## Lo que hay que pedirle al cliente

Video máster en alta · reels reales · URLs de sus perfiles (Google, TripAdvisor,
Viator y redes) · desglose real de estrellas · fotos del equipo · **confirmar
nombres y cargos de Omar/Lola/Eva y sus quotes** (salieron de la maqueta IA) ·
lista real de métodos de pago · si hay promo real · el vectorial de su sello
eco-friendly si quiere conservarlo · y decidir **blog vs. /guias** (ambos tienen
«Guías de Punta Cana» y competirían en SEO).
