# Plan de correcciones — PREGUNTAS FRECUENTES (página /faq)

> **Fuente:** `preguntas frecuentes - Ajustes web hispaniolaaquaticadventures.com.pdf` —
> 1 slide.
> **Cruzado con:** `app/src/pages/faq.tsx`, `src/components/faq/*`, `src/data/faq.ts`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Diagnóstico: la página ya existe y coincide con la maqueta

La slide es la maqueta IA de la página `/faq` **standalone**, que **ya existe** en el
repo (`faq.tsx` → `CabeceraFaq` + `CategoriasFaq`, mapea `frequently-asked-questions.php`).
La estructura de la maqueta coincide con lo construido.

**Ojo — no confundir dos FAQ distintos:**
- **FAQ de la home** (`components/home/faq.tsx`) — curado, acordeón AlignUI, con «Ver
  todas las preguntas →». Sus correcciones (efecto six2eight, 2 columnas) están en el
  **plan 01 (HOME), slides 16-17**.
- **Página FAQ `/faq`** (`components/faq/*`) — el listado completo categorizado. **Es la
  de este plan.**

## Lo que muestra la maqueta vs. lo que hay

**Maqueta IA:** «Preguntas frecuentes / 14 respuestas sobre reservas, pagos, comida,
clima y niños. ¿No está aquí? Escríbenos por WhatsApp…» + **filtros por categoría**
(Reservas y pagos · Antes del tour · A bordo · Comida · Clima y cancelaciones · Niños y
accesibilidad) + preguntas **agrupadas en columnas por categoría** + card verde «¿Tu
duda no está aquí? Pregúntanos por WhatsApp».

**Estado en el repo:** `CategoriasFaq` ya organiza las preguntas por categoría, y el
copy de la cabecera menciona las 14 preguntas. La card de WhatsApp de cierre ya existe
(se ve en la home). La estructura es la misma.

## Correcciones reales: pocas, de validación/pulido

La maqueta **no trae anotaciones** — es la estructura que el cliente aprueba. Acciones:

1. **Validar paridad con la maqueta:**
   - ¿Las categorías del repo coinciden con las 6 de la maqueta? (Reservas y pagos,
     Antes del tour, A bordo, Comida, Clima y cancelaciones, Niños y accesibilidad).
   - ¿El layout es de **columnas por categoría** (como la maqueta) o una lista lineal?
     Si es lineal, evaluar pasar a columnas agrupadas.
   - ¿Están las 14 preguntas? Verificar el conteo real en `data/faq.ts`.
2. **Filtros por categoría interactivos:** la maqueta muestra chips de filtro arriba
   (Reservas y pagos / Antes del tour / …). Si hoy son solo encabezados, añadir el
   **filtrado por chip** (client-side).
3. **Coherencia de efecto con la home:** si en la home el FAQ gana el efecto six2eight
   (plan 01), aplicar el mismo lenguaje de apertura aquí para que las dos superficies
   FAQ se sientan iguales.

**Archivos:** `components/faq/categorias-faq.tsx`, `cabecera-faq.tsx`, `data/faq.ts`.
**Esfuerzo:** bajo-medio. **Riesgo:** bajo.

## Recomendación

Página **prácticamente aprobada**. El trabajo es: (1) confirmar que las categorías y el
conteo coinciden con la maqueta, (2) añadir el filtrado por chip si falta, (3) alinear el
efecto de apertura con el FAQ de la home. **No necesita rediseño.**

## Pide al cliente (decisiones que faltan)

- **Confirmar las 6 categorías y el set de 14 preguntas** (¿alguna nueva pregunta que
  quiera añadir?).
- Nada de assets — esta página es solo texto.
