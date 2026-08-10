# docs/ — historia del proyecto

**Nada de esta carpeta se despliega ni entra en el build.** Es el rastro de cómo se
decidió lo que hay en `app/`. Para el estado actual del producto, el
[README de la raíz](../README.md).

Se conserva porque en este proyecto **el porqué de cada decisión es el activo**: casi
todo lo que parece raro en el código tiene aquí (o en un comentario) su motivo, con
fecha y con quién lo pidió.

---

## Qué mirar según lo que necesites

| Si necesitas… | Ve a |
|---|---|
| Entender por qué el sitio está estructurado así | [`proceso/analisis/arquitectura-nueva.md`](proceso/analisis/arquitectura-nueva.md) · [`mapa-del-sitio.md`](proceso/analisis/mapa-del-sitio.md) |
| Saber de dónde salen los precios | [`proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md`](proceso/correcciones-v2-cliente/TARIFARIO-WEB-ORIGINAL.md) ← **fuente canónica** |
| El plan del paso a inglés y lo que quedó pendiente | [`proceso/correcciones-v3-cliente/planes/01-idioma-ingles.md`](proceso/correcciones-v3-cliente/planes/01-idioma-ingles.md) ← **léelo antes de tocar i18n** |
| Reglas de diseño (colores, tokens, cuándo usar aqua) | [`proceso/analisis/direccion-visual.md`](proceso/analisis/direccion-visual.md) |
| Por qué el widget hace lo que hace | [`proceso/analisis/revision-wireframes.md`](proceso/analisis/revision-wireframes.md) |
| Qué pidió el cliente y en qué tanda | `proceso/correcciones-v{1,2,3}-cliente/planes/00-INDICE.md` |

## Contenido

| Carpeta | Qué es |
|---|---|
| [`proceso/analisis/`](proceso/analisis/) | Research previo: auditoría de la web antigua, benchmark de competencia, dirección visual, mapa del sitio, revisión de wireframes. |
| [`proceso/wireframes/`](proceso/wireframes/) | El wireframe completo aprobado, en un solo HTML. |
| [`proceso/audit/`](proceso/audit/) | 19 capturas de la web antigua y de la competencia. Las citan los `.md` de `analisis/`. |
| [`proceso/correcciones-v1-cliente/`](proceso/correcciones-v1-cliente/) | 1ª tanda de correcciones: 8 PDF + 9 planes + `EJECUTADO.md`. |
| [`proceso/correcciones-v2-cliente/`](proceso/correcciones-v2-cliente/) | 2ª tanda: 2 PDF + 9 planes + **el tarifario canónico**. |
| [`proceso/correcciones-v3-cliente/`](proceso/correcciones-v3-cliente/) | 3ª tanda: 7 PDF + 8 planes. Incluye el paso a inglés y el copy aprobado (`WEBSITE-*`). |

---

## ⚠️ Dos trampas al leer esto

**1. Los 25 planes dicen «Estado: No ejecutado» y están todos ejecutados.**
Es la convención del repo: el plan es una foto congelada del momento en que se escribió,
y el registro de ejecución va aparte (`EJECUTADO.md` en la tanda v1). No los tomes como
backlog pendiente. Además, algunos se ejecutaron y luego se superaron: el tarifario del
plan v2 acabó en la «propuesta D», que no es lo que ese plan describe.

**2. Hay documentos que el código ya desmiente.** Los más engañosos:

- `analisis/arquitectura-nueva.md` dice que `/competitive-advantage` se absorbió en
  Sostenibilidad. Es al revés: `/sostenibilidad` redirige a `/competitive-advantage`.
  Todo el árbol que dibuja ese documento está además en español, y las rutas hoy son en inglés.
- `app/PLAN-LANZAMIENTO.md` (fuera de esta carpeta) sigue siendo el backlog útil,
  **pero su sección «Inventario del hueco» es falsa**: dice «cero SEO», «sin favicon»,
  «sin páginas legales» y las tres cosas existen.
- Varios documentos mandan hacer `git checkout minimax`. **Esa rama ya no existe.**
  Los puntos de retorno son los tags (`v3-pre-en`, `v2-internas`, `v1.1-ficha-alignui`…).
