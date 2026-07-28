# Créditos y licencias de `/fotos`

Casi todo lo que hay en esta carpeta son **fotos reales de Hispaniola Aquatic
Adventures**, portadas de su web actual: no llevan crédito de terceros ni
licencia externa. Este archivo existe para los **pocos assets que NO son
suyos**, para que nadie tenga que adivinar de dónde salieron ni si se pueden
usar comercialmente.

Regla del proyecto: nada de stock salvo excepción justificada y anotada aquí.

| Archivo | Origen | Licencia | Notas |
|---|---|---|---|
| `langosta.webp` | [StickPNG — «Lobster Top»](https://www.stickpng.com/img/animals/sea-animals/lobster-top) (elegida por Samuel, 2026-07-28) | ⚠️ **Sin verificar — ver el aviso de abajo** | El PNG ya venía con transparencia: no hubo que recortar fondo. Aquí solo se **desflecó** (el recorte de origen deja un anillo semitransparente con blanco del fondo, que sobre el dorado del banner dibujaba un halo) y se **giró 90°** para que quede horizontal con las pinzas hacia el texto. Decorativa: adorna el banner de upsell de langosta de la ficha de charter (`tour/carta-charter.tsx`). |

## ⚠️ Aviso sobre la langosta

**StickPNG no es un banco con licencia clara.** Agrega imágenes de terceros y
no publica, para cada archivo, quién es el autor ni bajo qué términos cede el
uso; buena parte de su catálogo se etiqueta como «free for personal use», que
**no cubre la web comercial de un cliente**. Nadie está reclamando nada hoy,
pero el riesgo existe y es del cliente, no nuestro.

Dos salidas limpias, por orden de preferencia:

1. **Foto propia.** Que Fernando fotografíe una langosta suya a bordo sobre
   fondo liso. Es lo que más encaja con la regla del proyecto (fotos reales,
   nada de stock) y además sería SU producto.
2. **Volver a la CC0.** Antes de esta hubo una alternativa en dominio público
   real: [«20120114Hummer1.jpg» de Wikimedia Commons](https://commons.wikimedia.org/wiki/File:20120114Hummer1.jpg),
   **CC0 1.0** — uso comercial libre y sin atribución obligatoria. Se recortó
   con un script (segmentación por dominancia de rojo, no por luminancia,
   porque el original está sobre una bandeja blanca). Es algo peor de recorte
   que la de StickPNG, pero legalmente no tiene discusión.

En los tres casos el cambio es **solo el archivo**: el componente lo referencia
por nombre y no hay nada más que tocar.
