# Plan de correcciones — GUÍAS DE PUNTA CANA

> **Fuente:** `Guías de Punta Cana - Ajustes web hispaniolaaquaticadventures.com.pdf` —
> 3 slides de contenido (p4 vacía).
> **Cruzado con:** `app/src/pages/guias.tsx`, `src/components/guias/*`, `src/data/guias.ts`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Diagnóstico: sin correcciones explícitas

Las 3 slides son **screenshots de la página `/guias` tal cual está**, **sin ninguna
anotación de texto ni flecha**. El cliente la incluyó como referencia de lo que hay, no
para pedir cambios. Contenido mostrado (todo ya en el repo):
- Cabecera «Guías de Punta Cana / Lo que sabemos después de más de una década…».
- «Antes de reservar / Lo que más preguntan sobre esnórquel y navegación».
- 4 bloques Q&A (01 ¿Es Punta Cana buena para esnórquel? · 02 ¿Navegación a vela? ·
  03 ¿Condiciones seguras? · 04 ¿Buen lugar para mariscos?) con su stat destacado
  («≈100%», «50%», «Sin mareo», «Recién capturado») y CTAs.
- Cierre «Más guías en camino».

## Lo único accionable: los bloques de color son placeholders de imagen

En los 4 bloques Q&A, el recuadro grande de color (turquesa/naranja con el número 01-04)
es un **placeholder** — ahí debería ir una **foto real**. Es lo único «pendiente» que se
ve en las slides, aunque el cliente no lo anotó.

**Cómo lo aplicamos:**
- Rellenar los 4 placeholders con fotos reales que ilustren cada tema: snorkel en coral
  (01), catamarán de vela / Maite (02), mar en calma dentro del arrecife (03), mariscos
  en la cocina flotante (04). Usar fotos reales de la web / galerías existentes (mismo
  criterio del resto del sitio, jamás stock).
**Archivos:** `data/guias.ts` (campo foto por bloque, si no existe), `components/guias/*`.
**Esfuerzo:** bajo (el trabajo es elegir/optimizar fotos). **Riesgo:** ninguno.

## Recomendación

**Confirmar con Samuel / el cliente** que guías queda **aprobada** salvo por rellenar las
4 fotos. Si el cliente esperaba cambios y simplemente no los anotó, preguntarle. Con la
info actual, esta página **no necesita rediseño**, solo assets.

Nota: la maqueta de nuevas guías podría llegar vía el **Blog** (plan 06) — el blog del
cliente incluye categoría «Guías de Punta Cana» y artículos como «Punta Cana en 2026».
Es posible que el cliente quiera mover/expandir el contenido de guías hacia un blog. Ver
plan 06 y **aclarar la relación guías ↔ blog** con Samuel.

## Pide al cliente (assets/decisiones que faltan)

- **Confirmación** de que guías está OK (o qué esperaba cambiar).
- **4 fotos** para los bloques Q&A (o permiso para elegirlas de las galerías).
- **¿Guías y Blog conviven o se fusionan?** (ambos tienen «Guías de Punta Cana»).
