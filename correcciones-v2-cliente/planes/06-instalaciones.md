# Plan de correcciones v2 — PÁGINA NUEVA: INSTALACIONES

> Fuente: slides 44–49 del PDF.
> Cruzado con: `components/ui/reels-sociales.tsx`,
> `components/internas/galeria-mosaico.tsx`, `components/tour/video-lightbox.tsx`,
> `components/faq/categorias-faq.tsx`, `data/nosotros.ts` (`COCINA_FLOTANTE`),
> `pages/sostenibilidad.tsx`, `App.tsx`.
> Estado: propuesta para revisar con Samuel. No ejecutado.

## TL;DR

> 📞 **La reunión del 07-24 apenas tocó esta página.** Cuando llegan a ella,
> Samuel dice *«instalaciones, la veremos después»* (29:18) y siguen. El único
> apunte relacionado es que **el laboratorio de biología marina se menciona como
> un área real de la empresa** al enumerar los departamentos del equipo (32:15),
> lo que respalda el copy de la zona «Departamento de biología».
>
> Que sea la página de la que menos se habló, siendo la más bloqueada por assets,
> **refuerza la recomendación de dejarla para el final** — y, con la fecha del
> 15 de agosto encima (ver el índice), probablemente **fuera de esta entrega**.

Slide 44: **«nueva pagina de Instalaciones»**. Slides 45–49 la maquetan.

El argumento de la página, en su propio copy: *«Mucho más que una empresa de
excursiones: un complejo completo en Punta Cana»* y *«Un complejo, no solo un
muelle»*. Es una página de credibilidad: enseña que detrás del tour hay
laboratorio, museo, cocinas propias y oficinas.

1. Hero oscuro + **carril de videos verticales** (§1).
2. **6 zonas** con filtros, cada una con video vertical + foto + **360°** (§2).
3. **3 bandas de CTA** intercaladas (§3).

**Es la página más bloqueada de las cinco: no hay ni una sola foto de las
instalaciones en tierra en el repo.** Cero. Y pide 6 videos verticales + 6 tours
360°.

---

## §1 — Slide 45: hero + carril de videos verticales

**Cliente:** hero en degradado verde-oscuro con eyebrow **«NUESTRAS
INSTALACIONES»**, H1 **«Conócenos por dentro»**, lead *«Mucho más que una empresa
de excursiones: un complejo completo en Punta Cana. Míralo en video, en 360 y en
fotos.»* Debajo, sobre fondo casi negro, **«Míralo en video · vertical»** con
6 tarjetas verticales arrastrables («desliza»): *La cocina en acción*, *Dentro
del laboratorio*, *Así te recibimos*, *El museo marino*, *Cultivo de coral*,
*Un día en el complejo*.

**Estado en el repo:** el carril de videos verticales arrastrables **ya existe
como componente**: `components/ui/reels-sociales.tsx`, con
`use-fila-arrastrable.ts` y su variante `"bloque"`. Se usa en la home y en la
ficha de tour. Aquí se reutiliza con otros datos y ya está.

**Cómo lo aplicamos:** ruta `/instalaciones`, `pages/instalaciones.tsx` con
`HeroInterna` + `ReelsSociales` alimentado de un array nuevo.

⚠️ **Sobre el hero oscuro:** la maqueta lo pinta en verde oscuro degradado. Todas
las internas del sitio comparten `HeroInterna` (box redondeado + fotos reales en
crossfade + header `sobreVideo` dentro) — es una decisión de
`PLAN-INTERNAS-V2.md` que da coherencia a las 15 páginas. **No conviene romperla
para una página.** Con fotos reales del complejo, `HeroInterna` da mejor
resultado que un degradado plano; el degradado de la maqueta está ahí porque la
IA no tenía fotos, no porque sea una elección de diseño. Mismo criterio que en
la v1: de las maquetas se toma la estructura, no la estética.

**Archivos:** `pages/instalaciones.tsx` (nuevo), `App.tsx`,
`data/instalaciones.ts` (nuevo), `components/ui/reels-sociales.tsx`,
`data/home.ts` (nav + footer), `dev/dev-registry.ts`.
**Esfuerzo:** bajo (componentes reutilizados). **Riesgo:** bajo.
**Bloqueo:** **6 videos verticales que no existen.**

---

## §2 — Slides 46–49: las 6 zonas

**Cliente:** sección **«Todo lo que hay detrás de tu experiencia»**, lead
*«Cocinas propias, laboratorio de biología marina, museo al aire libre, tienda y
oficinas. Recórrelo — con fotos, video vertical y 360 en cada espacio.»* + fila
de 6 chips de filtro: `Zona` · `Museo` · `Departamento` · `Cocinas` · `Tienda` ·
`Oficinas`. Luego un bloque por zona, alternando lado, con **3 celdas de media**
(vertical + foto + 360°), 3 bullets y un enlace «Reserva tu tour».

Las 6 zonas, con el copy que él escribió:

| Zona | Descripción | Bullets |
|---|---|---|
| **Zona de recibimiento y presentación del tour** | «Te damos la bienvenida, hacemos el check-in y te explicamos el día antes de zarpar. Subes a bordo sabiendo exactamente qué te espera.» | bienvenida y check-in cómodo · explicación del tour antes de salir · zona de espera y baños |
| **Museo exterior marino** | «Un museo al aire libre donde conocerás el ecosistema del arrecife y el trabajo de restauración de coral. Le da sentido a todo lo que verás bajo el agua.» | al aire libre, abierto a visitantes · el ecosistema marino, explicado · el proyecto de restauración de coral |
| **Departamento de biología** | «Nuestro laboratorio propio, donde los biólogos marinos cultivan coral y estudian el arrecife para la Fundación The Bávaro Reef. No es marketing: es trabajo real.» | laboratorio de cultivo de coral · biólogos marinos en plantilla · base de la Fundación The Bávaro Reef |
| **Cocinas** | «Nuestras cocinas en tierra, donde preparamos y controlamos la calidad de todo lo que sube a bordo. De aquí sale lo que el chef cocina frente a ti.» | higiene y estándares certificados · producto fresco cada día · control de calidad antes de zarpar |
| **Tienda de regalos** | «A la entrada del complejo, souvenirs, ropa y productos locales para que te lleves un pedacito de tu día en Hispaniola a casa.» | souvenirs y ropa de la marca · productos locales dominicanos · a la entrada, fácil de visitar |
| **Oficinas corporativas** | «El centro de operaciones desde donde coordinamos reservas, logística y equipo. Aquí trabaja la gente que te responde cuando escribes.» | coordinación de reservas y atención · logística y gestión del equipo · el corazón administrativo de Hispaniola |

**Este copy es bueno y es del cliente — se usa tal cual.** Es la parte más
valiosa de estas 6 slides: son 6 argumentos de credibilidad bien escritos que no
existen en ninguna parte del sitio.

**Estado en el repo:** nada de esto existe. Lo más cercano es `COCINA_FLOTANTE`
en `data/nosotros.ts`, que habla de la cocina **a bordo** — que es otra cosa
distinta de las cocinas en tierra de esta página (ver el solapamiento al final).

**Cómo lo aplicamos:**
- Patrón **zigzag alternando lado** — ya resuelto en el proyecto:
  `components/sostenibilidad/recorrido-sostenibilidad.tsx`. Reutilizar ese
  lenguaje, no inventar otro layout.
- **Filtros**: mismo patrón que `categorias-faq.tsx` y que el plan 05 §1.
- **Las 3 celdas de media por zona** (vertical + foto + 360°): la composición
  vertical-grande-a-la-izquierda + apilados-a-la-derecha es exactamente lo que
  `GaleriaMosaico` ya hace en la ficha de tour. Se puede adaptar.
- **El 360°** es el mismo problema abierto del plan 04 §3, aquí multiplicado por
  6. Sin saber el formato no se puede planificar. Y sin `tour360`, la celda
  simplemente no se pinta — 2 celdas en vez de 3, sin hueco muerto.

**Archivos:** `pages/instalaciones.tsx`, `data/instalaciones.ts`,
`components/instalaciones/*` (nuevos), `dev/dev-registry.ts`.
**Esfuerzo:** medio (con los patrones existentes). **Riesgo:** bajo.
**Bloqueo:** **18 assets de media** (6 verticales + 6 fotos + 6 tours 360°) de
los cuales tenemos **cero**.

---

## §3 — Slides 47, 48, 49: las bandas de CTA

**Cliente:** intercala tres bandas de ancho completo entre las zonas:
- Coral: **«¿Listo para vivir todo esto?»** / *«Reserva tu día ahora — con solo
  el depósito y cancelación gratis.»* / botón «Reservar mi tour».
- Verde: **«La cocina, el mar y la ciencia, en un solo día»** / *«Ven a conocer
  el complejo en persona. Tu experiencia empieza aquí.»* / «Ver disponibilidad».
- Navy: **«Ven a conocernos en persona»** / *«Todo esto te espera antes y después
  de tu tour. Reserva tu día y descubre por qué somos mucho más que una
  excursión.»* / «Reserva tu tour».

Más, en cada zona, un enlace «Reserva tu tour».

**Estado en el repo:** el patrón de banda de cierre existe
(`components/sostenibilidad/cierre-sostenibilidad.tsx`, `eco-friendly.tsx`).

**Cómo lo aplicamos:** una sola de esas bandas, no tres. **Tres CTA idénticos en
una página de 6 secciones es demasiado**, y los tres dicen lo mismo con distinto
color de fondo. Además el copy de las tres es reciclable: la mejor es la tercera
(«Ven a conocernos en persona» + «mucho más que una excursión») porque remata el
argumento de la página en vez de repetir el genérico de reservar.

Propuesta: **una banda a mitad de página** (tras la 3ª zona) y **el cierre al
final**. Los enlaces «Reserva tu tour» dentro de cada zona sí se quedan — son
discretos y no compiten.

Y ojo con un detalle de la maqueta: en los slides 47 y 49 aparece un **botón
coral flotante «Reservar tu tour» pegado a la esquina**, además de la banda. Eso
es un CTA sticky. La home y la ficha ya tienen su barra móvil sticky
(`barra-movil-ficha.tsx`, el CTA sticky del hero) — **si esta página añade otro,
hay que asegurarse de que no se apilan dos**. Recomendación: en esta página no,
es una página de marca, no de conversión.

**Archivos:** `components/instalaciones/*`, `dev/dev-registry.ts`.
**Esfuerzo:** bajo. **Riesgo:** bajo.
**Duda para Samuel:** ¿una banda + cierre (mi propuesta) o las tres que pide?

---

## El solapamiento que hay que resolver antes de construir

Tres cosas de esta página **ya se cuentan en otro sitio**, y si no se decide el
reparto, el sitio se repite:

| Contenido | Ya vive en | Esta página lo quiere como |
|---|---|---|
| Cocina | Home §7 del plan 02 («la única cocina flotante de Punta Cana», bloque destacado) | «Cocinas» en tierra: higiene, control de calidad |
| Laboratorio / cultivo de coral | `/sostenibilidad` (`RecorridoSostenibilidad`, `ImpactoSostenibilidad`) y plan 08 | «Departamento de biología» |
| Museo marino / restauración | `/sostenibilidad` + `arrecife-teaser.tsx` | «Museo exterior marino» |

**Reparto propuesto:**
- **Home**: el argumento de venta (cocina flotante única — es lo que justifica el
  precio Premium).
- **`/sostenibilidad`**: el **proyecto** (qué se restaura, cuánto, con quién).
- **`/instalaciones`**: el **lugar físico** (que existe un laboratorio, que se
  puede visitar, que hay un museo abierto). Es un ángulo genuinamente distinto y
  el que da credibilidad: cualquiera dice que restaura coral; tener laboratorio
  propio es verificable.

Con ese reparto las tres páginas se refuerzan en vez de repetirse, y cada una
enlaza a las otras dos. **Sin ese reparto, se escribe tres veces lo mismo.**

---

## Resumen: qué se puede hacer ya

| Trabajo | ¿Bloqueado? |
|---|---|
| Estructura, hero, filtros, zigzag de 6 zonas | **no — se puede hoy** |
| El copy de las 6 zonas | **no — lo escribió el cliente** |
| Bandas de CTA | **no** |
| 6 videos verticales | **sí** |
| 6 fotos de las zonas | **sí — no hay ni una** |
| 6 tours 360° | **sí — no sabemos si existen** |
| Reparto de contenido con home y sostenibilidad | **no — decisión de Samuel** |

> ✅ **DECISIÓN (Samuel, 2026-07-27): esta página SE CONSTRUYE.** Deroga la
> recomendación anterior de posponerla.

**Cómo se rellenan las 18 celdas de media que no tenemos**, por la escalera del
índice:

| Celda | Con qué se construye ahora |
|---|---|
| Foto de cada zona | **Fotos repetidas** del repo (`public/fotos/`), rotando para que no se repita la misma dos veces seguidas |
| Video vertical de cada zona | **Los verticales que ya existen** (los de la ficha de tour / reels), reutilizados |
| 360° de cada zona | **No se pinta.** Es un campo opcional y su ausencia ya está prevista: 2 celdas en vez de 3, sin hueco muerto |

El **copy de las 6 zonas es real y bueno** (lo escribió el cliente), así que la
página no es un molde vacío: es una página con texto definitivo y fotos
provisionales. Eso **sí** se puede presentar.

**Sobre el 360°:** no forzarlo con un placeholder. Un botón «Ver en 360°» que
abre una foto normal es peor que no tenerlo — promete algo que no cumple, y es
justo el patrón que este proyecto ha evitado siempre. Ausencia silenciosa hasta
que llegue el material (ver plan 04 §3, donde la reunión dio una pista sobre el
formato).

**Y sigue valiendo la pena mandarle la lista de los 18 assets** con los nombres
de las 6 zonas que él mismo escribió — ahora no para desbloquear, sino para que
el contenido real llegue mientras se desarrolla. Es un pedido concreto, muy
distinto de «mándame fotos de las instalaciones».
