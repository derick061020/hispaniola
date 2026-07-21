# Plan de correcciones — BLOG (página NUEVA)

> **Fuente:** `blog - Ajustes web hispaniolaaquaticadventures.com.pdf` — 3 slides.
> **Cruzado con:** el repo — **no existe `blog.tsx` ni `/blog`**. Es una página nueva.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Diagnóstico: página completamente nueva

El cliente propone (maqueta IA) un **blog** que hoy **no existe** en el proyecto. Toda
la slide es estructura nueva. Hay que decidir con Samuel si entra en el alcance de esta
tanda o es una fase posterior — un blog implica también un **modelo de contenido**
(¿markdown? ¿CMS? ¿datos estáticos?) y **artículos reales escritos**, que son bastante
trabajo más allá del maquetado.

## TL;DR — qué propone el cliente

Una sección de blog «El Caribe, contado por quienes lo navegan» con:
1. **Artículo destacado** (hero del blog).
2. **Grid de artículos** con **filtros por categoría**.
3. **Newsletter** («No te pierdas nada»).
4. (Implícito) **página de artículo individual** para leer cada post.

---

## Slide por slide

### Slide 1 — Cabecera + destacado
**Cliente (maqueta IA):**
- «BLOG · El Caribe, contado por quienes lo navegan / Guías honestas, historias del mar
  y consejos reales para tu viaje a Punta Cana. Sin marketing vacío.»
- Artículo **destacado**: «Punta Cana en 2026: la guía honesta de cuándo ir, qué ver y
  qué evitar» — Omar · 12 jul 2026 · 8 min · categoría «Guías de Punta Cana».
**Cómo lo aplicamos:**
- Página nueva `/blog` con el **hero interno compartido** (`HeroInterna`, mismo patrón
  que nosotros/guías/sostenibilidad) → coherencia inmediata con las internas.
- Card de destacado grande (foto + categoría + título + extracto + autor/fecha/lectura +
  «Leer el artículo»). Estética nuestra (Charter Premium), no la de la maqueta.
**Archivos:** `pages/blog.tsx`, `components/blog/cabecera-blog.tsx`,
`components/blog/articulo-destacado.tsx`, `data/blog.ts`, ruta en el router.

### Slide 2 — Grid con filtros por categoría
**Cliente (maqueta IA):** filtros (Todos · Guías de Punta Cana · Consejos de viaje ·
Vida a bordo · Sostenibilidad · Qué hacer) + grid de 6 cards (categoría, título,
extracto, autor, tiempo de lectura).
**Cómo lo aplicamos:**
- Componente `lista-articulos.tsx` con filtro por categoría (client-side, los artículos
  son datos estáticos). Card reusable `card-articulo.tsx`.
- **Categorías** como dato tipado. Reusar el lenguaje de chips/etiquetas ya existente
  (`ui/etiqueta.tsx`).
**Archivos:** `components/blog/lista-articulos.tsx`, `card-articulo.tsx`, `data/blog.ts`.

### Slide 3 — Más artículos + newsletter
**Cliente (maqueta IA):** más cards + bloque «No te pierdas nada» (input email +
Suscribirme + «Puedes darte de baja cuando quieras»).
**Cómo lo aplicamos:**
- Bloque newsletter reutilizable (mismo criterio prototipo-sin-backend que el form de
  contacto). ⚠️ Necesita un servicio real (Mailchimp/Brevo) para funcionar → de momento
  visual, avisar que la captura real es fase posterior.
**Archivos:** `components/blog/newsletter.tsx` (o reusar en footer), `data/blog.ts`.

### Página de artículo individual (implícita, necesaria)
El «Leer el artículo» necesita destino. `/blog/:slug` con layout de lectura (título,
meta, cuerpo, autor, artículos relacionados). Es donde vive el **contenido real** —
requiere los artículos escritos.
**Archivos:** `pages/articulo.tsx`, `components/blog/articulo.tsx`, contenido en `data/blog.ts`.

---

## Decisiones de arquitectura para Samuel

1. **¿Blog en esta tanda o fase posterior?** Maquetar el índice es asumible; el blog
   **con artículos reales** es un proyecto de contenido. Recomiendo: **maquetar índice +
   artículo con 1-2 posts reales** ahora, y el resto de artículos como pipeline de
   contenido aparte.
2. **Modelo de contenido:** para un sitio estático (Vite/React), lo más simple es
   **markdown/MDX o datos en `data/blog.ts`**. Sin CMS por ahora (coherente con el resto
   del prototipo). Decidir si el cliente escribirá los posts o los redacta Samuel.
3. **Relación Blog ↔ Guías** (ver plan 04): ambos tienen «Guías de Punta Cana». ¿El blog
   **absorbe** guías, guías **enlaza** al blog, o conviven con contenidos distintos?
   **Aclarar antes de construir** para no duplicar ni canibalizar SEO.
4. **Autores:** los posts van firmados por Omar/Lola/Eva (mismos nombres que equipo,
   plan 03) → reusar la fuente de datos del equipo.
5. **SEO:** un blog es sobre todo una jugada de SEO. Si se hace, hacerlo con `Meta` +
   schema Article bien puestos (ya hay infra `components/seo/`).

## Orden de ejecución sugerido

1. **Decidir alcance** (índice-solo vs índice+artículos) y modelo de contenido — bloquea todo.
2. Ruta `/blog` + hero + destacado + grid con filtros (maquetado con datos de ejemplo
   claramente marcados).
3. Página `/blog/:slug` de lectura.
4. Newsletter (visual; real cuando haya servicio de email).
5. Redacción de artículos reales (pipeline de contenido, con el cliente/Samuel).

## Pide al cliente (assets/decisiones que faltan)

- **¿Blog sí, y con qué alcance?** (¿cuántos artículos al lanzamiento?).
- **Quién escribe** los artículos (cliente / Samuel / redactor).
- **Relación con Guías** (fusionar / enlazar / separar).
- **Servicio de newsletter** (si quiere captura real de emails).
- **Fotos de portada** de los artículos.
