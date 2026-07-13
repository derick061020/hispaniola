# Mapa del sitio actual — hispaniolaaquaticadventures.com

> 2026-07-13. Extraído del DOM real del sitio (no del menú móvil, que aplana la jerarquía).
> Incluye la estructura verdadera padre/hijo, las páginas huérfanas y los links rotos.

---

## 1. Menú principal — 6 ítems de primer nivel

El menú de escritorio aparece a partir de **1170px de ancho**. Por debajo (tablet/móvil)
se sustituye por la hamburguesa "MENU" del plugin *meanmenu*, que **aplana toda la
jerarquía a una sola lista** (simula el anidamiento con guiones: "- Our Crew").

Los ítems marcados `#` no son links: solo abren su desplegable.

```
1. HOME  → index.php

2. ABOUT US  (#, desplegable)
   ├── About Us          → about-hispaniola.php
   ├── Our Crew          → about-hispaniola.php#OurCrew
   ├── Our Fleet         → about-hispaniola.php#OurCrew      ⚠️ ancla equivocada (apunta a Crew)
   └── Our Foundation    → about-hispaniola.php#OurFoundation

3. CATAMARAN EXPERIENCES  (#, MEGAMENÚ de 2 columnas)
   │
   ├── [Columna 1] "Punta Cana Half Day Snorkel"   ← encabezado, NO clickeable
   │   ├── Premium Semiprivate-Adults  → semi-private-snorkeling-catamaran-excursion-puntacana.php
   │   ├── Snorkel Lovers - ALL AGES   → educational-snorkeling-for-snorkel-lovers.php
   │   ├── (Sustainability Experience) → sustainability-experience.php   💀 COMENTADO en el código + da 404
   │   └── Private Tours               → private-catamaran-snorkeling-excursion-puntacana.php
   │
   └── [Columna 2] "Saona Island Full Day"         ← encabezado, NO clickeable
       └── Private Tours               → private-saona-island-excursion.php   ⚠️ mismo nombre que el de arriba

4. EVENTS & CELEBRATIONS  (#, desplegable)
   ├── Events & Party Boat             → events-party-boat-puntacana.php
   ├── PRE-POST WEDDING CELEBRATIONS   → weddings.php
   └── MICE                            → mice.php

5. SUSTAINABILITY  (#, desplegable)
   ├── Sustainability                  → sustainability.php
   └── Competitive Advantage           → competitive-advantage.php   (stub de 1 frase)

6. CONTACT US  (#, desplegable)
   ├── Contact Us                      → contact.php
   ├── Travel Agents                   → travel-agent-registration.php
   ├── TIPS for Punta Cana             → tips-for-punta-cana-snorkeling-and-sailing.php
   └── FAQ's                           → frequently-asked-questions.php
```

### ⚠️ Diferencia grave entre el menú de escritorio y el móvil

| | Escritorio (≥1170px) | Móvil / tablet (<1170px) |
|---|---|---|
| Ítems de 1er nivel | 6 | 21 (todo aplanado) |
| **Online Booking** | ❌ **NO EXISTE en el menú** | ✅ sí aparece |
| Jerarquía | Real (desplegables + megamenú) | Simulada con guiones "-" |

**El escritorio no tiene ningún ítem de menú que lleve a reservar.** Sólo se llega al
booking por: el botón "Check Availability" del hero, el "Click Here" del footer, o los
CTA dentro de cada ficha de tour. En móvil sí hay ítem "Online Booking".

---

## 2. Páginas fuera del menú (huérfanas)

| Página | Estado | Cómo se llega |
|---|---|---|
| `why-book-with-us.php` | ✅ Existe y tiene contenido real | **Sólo** desde el badge naranja "WHY BOOK WITH US?" del hero. No está en el menú de ninguna versión. |
| `webres.php` (booking) | ✅ Existe | Hero, footer, fichas de tour, y menú móvil. **No en menú escritorio.** |
| `References/BookingGuide-en.pdf` | ✅ Existe | Modal de video que se autoabre en la home. |

---

## 3. Links rotos (404) que están vivos en la home

| Link | Nº de veces | Dónde |
|---|---|---|
| `feature.html` | **9** | Los 9 iconos de "…all our cruises include": Snorkeling, Transportation, On-Board Enterainment *(sic)*, WiFi, Fresh Food, Drinks, Deserted Beach, Photos, Service. **Todos son clickeables y todos llevan a un 404.** |
| `pevents-party-boat-puntacana.php` | 1 | Imagen de una tarjeta de la sección Events (typo: "p**e**vents" en vez de "events"). |
| `sustainability-experience.php` | 0 (comentado) | Comentado en el HTML del megamenú — un **5º tour que existió o iba a existir** y hoy da 404. Vale la pena preguntarle al cliente qué pasó con él. |

---

## 4. Inventario completo de páginas reales (17)

Ordenadas por rol en el negocio:

**Producto / conversión (6)**
1. `index.php` — Home
2. `semi-private-snorkeling-catamaran-excursion-puntacana.php` — Tour 1: Semi-Private (adultos)
3. `educational-snorkeling-for-snorkel-lovers.php` — Tour 2: Snorkel Lovers (familias)
4. `private-catamaran-snorkeling-excursion-puntacana.php` — Tour 3: Privado medio día
5. `private-saona-island-excursion.php` — Tour 4: Privado Saona día completo
6. `webres.php` — Motor de reservas (iframe a xpotours.net)

**Eventos (3)**
7. `events-party-boat-puntacana.php` — Eventos y party boat
8. `weddings.php` — Bodas
9. `mice.php` — Corporativo

**Argumento de venta (2)**
10. `why-book-with-us.php` — Reserva directa *(huérfana del menú)*
11. `competitive-advantage.php` — Stub de 1 frase sobre videos de la fundación

**Marca / contenido (3)**
12. `about-hispaniola.php` — Nosotros (Crew + Fleet + Foundation, 3 anclas)
13. `sustainability.php` — Sostenibilidad
14. `tips-for-punta-cana-snorkeling-and-sailing.php` — Tips

**Soporte (3)**
15. `contact.php` — Contacto
16. `frequently-asked-questions.php` — FAQ
17. `travel-agent-registration.php` — Registro de agentes

---

## 5. Lo que este mapa revela para el rediseño

1. **El escritorio no tiene ítem de reserva en el menú.** El camino más directo a convertir
   no existe en la navegación principal. (En el rediseño propuesto: botón "Reservar"
   persistente en el header.)

2. **Dos ítems se llaman igual: "Private Tours" × 2.** El megamenú los distingue solo por
   la columna en la que están ("Half Day" vs "Saona Full Day"), y en el menú móvil
   aplanado quedan literalmente idénticos y consecutivos — imposible saber cuál es cuál.

3. **Los 4 tours están escondidos tras un padre no clickeable** ("Catamaran Experiences").
   No hay una página de listado de tours: o entras al megamenú, o los ves en la home.

4. **9 links rotos visibles** en el bloque de "qué incluye" de la home, más 1 en Events.
   Nadie los ha tocado en años — señal de que la web no tiene mantenimiento activo.

5. **Un 5º tour comentado** (`sustainability-experience.php`) sugiere que hubo un producto
   de "experiencia de sostenibilidad" que se desactivó. Dado que la restauración de coral
   es su mayor diferenciador, **vale la pena preguntar por qué se quitó.**

6. **`why-book-with-us.php` es el mejor argumento de venta del negocio** ("we only sell
   directly = best services & excellent rates") y sólo se llega por un sticker naranja en
   el hero. No está en el menú.
