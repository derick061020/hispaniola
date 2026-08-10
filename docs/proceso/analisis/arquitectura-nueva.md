# Arquitectura de la nueva web — mapeo 17 páginas + menú propuesto

> 2026-07-13. Responde a dos preguntas: (1) ¿las 17 páginas actuales están todas
> contempladas en los wireframes? (2) ¿cómo queda el menú nuevo?

---

## 1. Mapeo: las 17 páginas actuales → dónde viven en la nueva web

**Sí, las 17 están contempladas.** Ninguna se pierde. Pero no todas siguen siendo una
página: cuatro se colapsan en una plantilla, una se absorbe y una deja de ser página
para convertirse en módulo.

| # | Página actual | En la nueva web | Wireframe |
|---|---|---|---|
| 1 | `index.php` | **Home** (rehecha) | Parte 1 |
| 2 | `semi-private-...php` | Ficha de tour · Semi-Privado | Parte 2 (plantilla) |
| 3 | `educational-snorkeling-...php` | Ficha de tour · Snorkel Lovers | Parte 2 (plantilla) |
| 4 | `private-catamaran-...php` | Ficha de tour · Charter Privado | Parte 2 (plantilla) |
| 5 | `private-saona-...php` | Ficha de tour · Isla Saona | Parte 2 (plantilla) |
| 6 | `webres.php` | **Flujo de booking** (4 pasos) | Parte 3 |
| 7 | `events-party-boat-...php` | **Eventos** (hub) | Parte 4 · E1 |
| 8 | `weddings.php` | **Bodas** | Parte 4 · E2 |
| 9 | `mice.php` | **Empresas / MICE** | Parte 4 · E3 |
| 10 | `about-hispaniola.php` | **Nosotros** (tripulación + flota + fundación) | Parte 4 · E4 |
| 11 | `why-book-with-us.php` | → **módulo reutilizable** + página de soporte (ver §3) | Parte 4 · E5 |
| 12 | `competitive-advantage.php` | → **absorbida** en Sostenibilidad (era un stub de 1 frase) | Parte 4 · S1 |
| 13 | `sustainability.php` | **Sostenibilidad** | Parte 4 · S1 |
| 14 | `contact.php` | **Contacto** | Parte 4 · S2 |
| 15 | `travel-agent-registration.php` | **Agentes de viaje** | Parte 4 · S3 |
| 16 | `frequently-asked-questions.php` | **FAQ** | Parte 4 · S4 |
| 17 | `tips-for-punta-cana-...php` | → primer artículo de **Guías** (blog) | Parte 4 · S5 |

### Pantallas NUEVAS que no existían en la web actual

| Pantalla | Por qué | Wireframe |
|---|---|---|
| Resultados de disponibilidad | El buscador del hero no tenía a dónde llevar | Parte 1.5 |
| Mi reserva | Sostiene "cambia tu menú" y "paga el saldo online" | Parte 3 |
| Estado sin disponibilidad | Temporada alta terminaba en callejón sin salida | Parte 3 · B1b |
| Guías (índice del blog) | Motor SEO — hoy no hay captación orgánica | Parte 4 · S5 |

### Hueco real detectado al hacer este mapeo

**Falta una página de listado de tours (`/tours`).** Hoy tampoco existe (los 4 tours
cuelgan de un padre no clickeable, "Catamaran Experiences"), y en los wireframes tampoco
la dibujamos: la pantalla de "Resultados de disponibilidad" está filtrada por fecha.

**Solución sin diseñar nada nuevo:** esa misma pantalla es `/tours` cuando no hay fecha
elegida. Sin fecha muestra los 4 tours con su precio y rating; al elegir fecha, los mismos
4 con horarios disponibles. Un solo componente, dos estados. Además le da a Google una
página real que indexar para "catamaran tours punta cana" — que hoy no existe.

---

## 2. Menú propuesto

Principios: **5 ítems + un botón de reservar.** Todo lo que no sea una decisión de compra
o de confianza baja al footer. El escritorio, por fin, tiene un camino a reservar
(el menú actual **no tiene ninguno** — "Online Booking" solo existe en el móvil).

```
┌─ BARRA SUPERIOR (utility) ────────────────────────────────────────┐
│  💬 WhatsApp +1-829-305-2804 · ☎ 1-800-657-0016        ES │ EN   │
└───────────────────────────────────────────────────────────────────┘

┌─ MENÚ PRINCIPAL ──────────────────────────────────────────────────┐
│  [LOGO]   TOURS ▾   EVENTOS ▾   NOSOTROS ▾   GUÍAS   AYUDA ▾      │
│                                                    [ RESERVAR ]   │
└───────────────────────────────────────────────────────────────────┘

1. TOURS ▾  → /tours          ★ MEGAMENÚ (escaparate con foto + precio)
   ┌──────────────────────────────────────────────────────────────┐
   │ MEDIO DÍA · 4 h                          DÍA COMPLETO        │
   │ [img] Semi-Privado Premium               [img] Isla Saona    │
   │       solo adultos · máx 25 · desde $99        desde $—      │
   │ [img] Snorkel Lovers                                         │
   │       familias · máx 25 · desde $98                          │
   │ [img] Charter Privado                                        │
   │       tu grupo · hasta 120 · desde $55                       │
   ├──────────────────────────────────────────────────────────────┤
   │ ¿No sabes cuál? Compara los 4 →      Ver todos los tours →   │
   └──────────────────────────────────────────────────────────────┘

2. EVENTOS ▾  → /eventos      ★ MEGAMENÚ (con deep-link al form)
   ┌──────────────────────────────────────────────────────────────┐
   │ CELEBRACIONES          CORPORATIVO         Barco entero      │
   │ [img] Bodas y pre-boda [img] Empresas/MICE  10-120 personas  │
   │  ↳ landing propia       ↳ landing propia    desde $55/pers   │
   │ Cumpleaños*            Incentivos*          ★ WeddingWire    │
   │ Aniversarios*          Team building*        2018-2021       │
   │ Despedidas*            Cierre convención*                    │
   │ Reuniones familiares*  ⬇ Dossier PDF       [Pedir cotización]│
   └──────────────────────────────────────────────────────────────┘
   * = deep-link a /eventos?tipo=X → el formulario llega con la
     ocasión YA preseleccionada. Sin eso, listarlas sería decoración.

3. NOSOTROS ▾                                 → /nosotros (clickeable)
   ├── La tripulación y la flota              → /nosotros
   └── El arrecife que reconstruimos          → /sostenibilidad

4. GUÍAS                                      → /guias   (sin desplegable)

5. AYUDA ▾                                    → /faq (clickeable)
   ├── Preguntas frecuentes                   → /faq
   ├── Contacto y WhatsApp                    → /contacto
   └── Gestionar mi reserva                   → /mi-reserva

[ RESERVAR ]  ← botón destacado, siempre visible (sticky)   → /reservar
```

### ¿Cuáles llevan megamenú y cuáles no?

**Criterio: la forma del menú sigue a la forma del contenido.** Forzar megamenús donde no
hay contenido se ve vacío; negarlos donde sí lo hay desperdicia el mejor espacio de la web.

| Ítem | Formato | Por qué |
|---|---|---|
| **Tours** | ★ **Megamenú** | 4 productos con foto, audiencia, capacidad y precio. Es el **camino al dinero**: el escaparate acelera la decisión antes de entrar a una ficha. Agrupados por duración (medio día / día completo), que es como el turista piensa su agenda. |
| **Eventos** | ★ **Megamenú** | 2 landings reales + 6 ocasiones que **deep-linkean al hub con el formulario preseleccionado**. Sin ese deep-link serían decoración; con él, dan "scent" (quien busca "cumpleaños en barco" ve la palabra exacta) y ahorran un paso. Tercera columna = resumen comercial + CTA. |
| Nosotros | Desplegable simple | Solo 2 destinos (tripulación/flota · sostenibilidad). |
| Guías | Sin desplegable | Es una página. |
| Ayuda | Desplegable simple | 3 destinos (FAQ · Contacto · Mi reserva). |

### Cambios clave respecto al menú actual

| Ahora | Nueva versión | Por qué |
|---|---|---|
| Padres no clickeables ("Catamaran Experiences") | **Todos los padres llevan a una página** | Un desplegable que no lleva a ningún sitio es un callejón |
| "Private Tours" × 2 (idénticos) | 4 tours con **nombre único** | En el menú móvil hoy son indistinguibles |
| Sin acceso a reservar en escritorio | **Botón RESERVAR** persistente | El camino a la conversión no puede faltar en el menú |
| "Sustainability" como ítem de 1er nivel | Bajo **Nosotros** | Es una historia de marca, no una categoría de navegación |
| "Competitive Advantage" | Eliminado (absorbido) | Era un stub de una frase |
| "Travel Agents" en el menú | Al **footer** | Es B2B: el 99% del tráfico es turista |
| "TIPS for Punta Cana" | **Guías** (blog) | De página suelta a motor SEO |
| "Contact Us" como padre de FAQ/Tips/Agentes | **Ayuda** ▾ | Agrupa por intención ("necesito ayuda"), no por casualidad |

### Footer — donde viven las páginas de soporte

```
TOURS              EMPRESA               RESERVAS              AYUDA
Semi-Privado       Nosotros              Reservar ahora        FAQ
Snorkel Lovers     Sostenibilidad        Mi reserva            Contacto
Charter Privado    Guías Punta Cana      ¿Por qué reservar     WhatsApp
Isla Saona         Agentes de viaje       directo? ← aquí      Política de
Eventos                                  Política de           cancelación
                                          cancelación
```

---

## 3. El caso de `why-book-with-us` — tienes razón

**Tu instinto es correcto: no debe ser una página del menú.** Nadie navega a un menú
buscando "por qué reservar con ustedes". Es un **argumento**, no un destino — y los
argumentos funcionan donde ocurre la duda, no en una página que hay que ir a buscar.

**Cómo queda entonces:** deja de ser una página de menú y se convierte en un **módulo
reutilizable** que aparece exactamente en los tres puntos donde el visitante está
comparando con Viator:

1. **En la home** — bloque de 4 beneficios (depósito 25%, 5% cash, menú a elección,
   WhatsApp directo). Ya está en el wireframe (Home §05).
2. **En la ficha de tour** — franja de una línea bajo el widget de reserva:
   *"Mismo precio que en Viator o Civitatis — aquí con depósito del 25%, menú a elección
   y WhatsApp directo."* Ya está en el wireframe (Ficha A2). **Este es el punto más
   importante**: es donde el turista tiene el precio delante y está decidiendo.
3. **En el checkout** — el depósito del 25% presentado como opción por defecto con la
   cuenta hecha. Ya está (Booking B3).

**¿Y la tabla comparativa completa?** Sigue existiendo como página (`/reserva-directa`),
pero **fuera del menú principal**: se llega desde los módulos de arriba ("ver comparación
→") y desde el footer. Es una *página de soporte de conversión*, igual que la política de
cancelación: existe porque alguien la necesita en un momento concreto, no porque merezca
un slot en la navegación.

Razones para mantenerla como página y no como modal:
- Se puede **mandar por WhatsApp** cuando alguien pregunta "¿por qué contigo y no por
  Viator?" — el equipo la va a usar a diario.
- Tiene valor SEO real ("reservar directo catamarán punta cana").
- La tabla es larga; embutirla en un modal la hace ilegible en móvil.

---

## 4. Resumen de la nueva arquitectura

**De 17 páginas a 15**, más 4 pantallas nuevas de producto:

**En el menú (9 páginas):**
Home · Tours (listado) · Ficha de tour ×4 *(1 plantilla)* · Eventos · Bodas · Empresas ·
Nosotros · Sostenibilidad · Guías · FAQ · Contacto

**Fuera del menú, en footer o enlazadas desde módulos (3):**
Reserva directa · Agentes de viaje · Política de cancelación

**Flujo de compra (3 pantallas):**
Booking (4 pasos) · Mi reserva · Resultados de disponibilidad

**Eliminada (1):**
`competitive-advantage.php` — stub de una frase, absorbido en Sostenibilidad.
