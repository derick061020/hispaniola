# Prototipo navegable — Hispaniola

Versión clickeable de los wireframes (`docs/proceso/wireframes/wireframes-completos.html`): mismo
contenido y estructura, pero navegable de punta a punta en vez de ser un documento de
referencia. Estética wireframe intacta (grises, placeholders) — el diseño visual sigue
siendo trabajo de Figma.

## Cómo abrirlo

Doble click en `index.html`. Es una SPA vanilla (HTML/CSS/JS clásico, sin build, sin
dependencias) — funciona directo desde `file://`, no hace falta servidor.

> Nota de desarrollo: si vas a editar el código y probarlo en un navegador normal,
> ten en cuenta que **cambiar solo el hash** (`#/tours` → `#/tour/x`) en una pestaña que
> ya tenía la página abierta *antes* de tu edición no vuelve a cargar `app.js` — es
> navegación "same-document". Para ver un cambio reciente, recarga la página completa
> (F5) o ábrela en una pestaña nueva.

## Qué se puede hacer

- Reservar un tour de punta a punta: ficha → elegir fecha/hora/personas/paquete →
  elegir menú y hotel → pagar → pantalla de gracias → Mi Reserva.
- Chocar con un mes agotado (botón `›` del calendario, paso 1) y salir por la lista de
  espera o WhatsApp.
- Pedir cotización de un evento desde el megamenú (el formulario llega con el tipo de
  evento ya elegido).
- Recorrer las 15 páginas del sitio (home, 4 tours, eventos, bodas, empresas, nosotros,
  sostenibilidad, guías, FAQ, contacto, agentes, reserva directa) sin ningún link roto.
- Activar el botón **📝 notas** (esquina inferior izquierda) para ver el racional de
  diseño de cada bloque clave — mismo contenido que las notas del wireframe anotado.

## Qué es y qué no es

- **Es**: el sitio nuevo navegable, con el copy y los datos exactos del wireframe.
- **No es**: el diseño visual final (eso es Figma), ni código de producción, ni tiene
  pagos o envíos reales — todo lo que "se enviaría" (formularios, wallets, voucher PDF)
  muestra un estado de éxito simulado con un aviso claro.
- Los precios/capacidad de Isla Saona y el % de comisión de agentes se muestran como
  pendientes porque son datos reales que aún faltan del cliente — no se inventaron.

## Estructura

```
prototipo/
├── index.html    ← esqueleto: header, <main id="app">, footer, badge, drawer de notas
├── estilos.css   ← tokens (mismos que el wireframe) + todos los componentes del sitio
├── datos.js      ← contenido: tours, platos, ocasiones, FAQ, guías, notas de diseño
└── app.js        ← router (hash, con :params y ?query) + una función render por página
```

No usa `<template>` de HTML: cada página es una función `renderX()` que arma un string
de HTML (con los datos de `datos.js`) y lo asigna a `#app`. Las interacciones se
enganchan después de cada render; los cambios de estado simplemente vuelven a llamar a
la función de la página actual (re-render completo) — es el patrón más simple y
confiable en vanilla JS sin librería, y aquí el costo de rendimiento es irrelevante.

## Cómo pedir cambios

Todo el contenido (precios, textos, preguntas de FAQ, artículos del blog) vive en
`datos.js` — la mayoría de cambios de copy no tocan `app.js`. Para cambios de
estructura o de una página nueva, dile a Claude Code qué pantalla del wireframe o del
prototipo quieres ajustar; el archivo `docs/proceso/wireframes/wireframes-completos.html` sigue
siendo la referencia anotada de por qué cada bloque está donde está.

## Decisiones de alcance (F7)

- El resumen de la reserva en móvil se muestra como bloque estático debajo del
  formulario (no colapsable) — más simple que la idea original del wireframe y
  igual de funcional para un prototipo de iteración rápida.
- Los pines de notas de los megamenús (Tours/Eventos) viven en el botón del menú,
  no dentro del propio desplegable — evita que la nota dependa de tener el menú abierto.
