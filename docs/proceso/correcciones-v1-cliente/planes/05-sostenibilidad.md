# Plan de correcciones — SOSTENIBILIDAD

> **Fuente:** `sostenibilidad - Ajustes web hispaniolaaquaticadventures.com.pdf` — 3 slides.
> **Cruzado con:** `app/src/pages/sostenibilidad.tsx`, `src/components/sostenibilidad/*`,
> `src/data/sostenibilidad.ts`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Diagnóstico: sin correcciones explícitas

Las 3 slides son **screenshots de la página `/sostenibilidad` tal cual está**, **sin
anotaciones**. Contenido mostrado (todo ya en el repo):
- Cabecera «La sostenibilidad en el centro de nuestra misión».
- «Nuestra misión / Una huella positiva, dentro y fuera del agua» + video «Cómo
  restauramos el arrecife» + «Tres frentes, un mismo compromiso» (01 Conservación ·
  02 Comunidades · 03 Operación responsable).
- «Nuestro impacto / Tu reserva deja huella real» — KPIs (12.000+ corales, 350 tortugas,
  5000 m², 200+ niños) + desglose de aportes (US$3,50 equipo / US$2,00 fundación).
- «Lo que nos diferencia, en video / Míralo con tus propios ojos» — grid de 6 videos +
  cierre «Deja una huella positiva».

## Lo único accionable: los 6 videos son placeholders

El grid «Míralo con tus propios ojos» tiene **6 recuadros de color con botón play** =
**placeholders de video**. Temas ya definidos: Laboratorio de restauración de coral ·
Nuestra cocina flotante · De dónde sale tu comida · Snorkel en el arrecife de coral ·
Protegemos las tortugas marinas · Avistamiento de manatíes.

**Cómo lo aplicamos:**
- Rellenar los 6 placeholders con los videos reales cuando el cliente los entregue. La
  estructura (grid, títulos, botón play, lightbox) ya está construida — es solo cargar
  los `src`.
**Archivos:** `data/sostenibilidad.ts` (los `src` de video), `videos-sostenibilidad.tsx`.
**Esfuerzo:** bajo (el trabajo es el asset). **Riesgo:** ninguno.

## Verificar: los KPIs deben ser reales

Los números de impacto (12.000+ corales, 350 tortugas, 5000 m², 200+ niños, US$3,50 /
US$2,00) son afirmaciones fuertes de marca. **Confirmar con el cliente que son reales**
antes de darlos por buenos en producción. Si vienen de la web actual, están OK; si los
generó la maqueta, hay que validarlos.

## Recomendación

**Confirmar con Samuel / el cliente** que sostenibilidad queda **aprobada** salvo por
rellenar los 6 videos y validar los KPIs. **No necesita rediseño** con la info actual.

## Pide al cliente (assets/decisiones que faltan)

- **6 videos** del grid «Míralo con tus propios ojos» (o el video «Cómo restauramos el
  arrecife» de la misión, si aún no está).
- **Validación de los KPIs** de impacto (¿números reales y actuales?).
- **Confirmación** de que la página está OK (o qué esperaba cambiar).
