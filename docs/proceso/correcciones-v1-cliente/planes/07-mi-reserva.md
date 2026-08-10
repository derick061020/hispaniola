# Plan de correcciones — GESTIONAR MI RESERVA

> **Fuente:** `GESTIONAR MI RESERVA - Ajustes web hispaniolaaquaticadventures.com.pdf` —
> 1 slide.
> **Cruzado con:** `app/src/pages/mi-reserva.tsx`.
> **Estado:** propuesta para revisar con Samuel. No ejecutado.

## Diagnóstico: ya está casi hecho

La maqueta del cliente coincide **casi exactamente** con lo que `mi-reserva.tsx` **ya
implementa** (rediseñado el 2026-07-17 por pedido del propio Samuel). El cliente en la
práctica **valida** la pantalla de ingreso de código. Diferencias mínimas.

## Lo que muestra la maqueta vs. lo que hay

| Elemento de la maqueta | ¿Ya existe? |
|---|---|
| «Gestiona tu reserva» + icono | ✅ Sí (`PantallaIngreso`) |
| Texto explicativo | ✅ Sí |
| Input «Código de reserva» HSP-XXXX-XXXX | ✅ Sí |
| Botón «Ver mi reserva» | ✅ Sí (literal) |
| «Búscalo en el email de confirmación… empieza por HSP» | ✅ Sí (variante del copy) |
| «Tu reserva es privada y segura» | ➖ Parcial (hay copy similar) |
| «¿Sigues sin encontrarla? Escríbenos por WhatsApp y la buscamos» | ✅ Sí (fallback WhatsApp) |
| **Toggle «Con código / Con email»** | ❌ **No** — solo hay acceso por código |
| Layout como card centrada sobre fondo gris | ➖ Parcial (centrado, pero fondo `bg-papel` no gris) |

## Las 2 únicas correcciones reales

### 1. Acceso «Con email» (además de por código)
**Cliente:** toggle **«Con código / Con email»** — permitir recuperar la reserva también
con el email con que se reservó.
**Cómo lo aplicamos:** añadir el toggle y un segundo input (email). ⚠️ Sin backend, el
acceso por email **no puede validar** de verdad (no hay a quién consultar). Igual que el
código hoy («con cualquier código funciona» → muestra la demo), el email haría lo mismo.
Propuesta: implementar el **toggle + input visual** ahora (coherencia con la maqueta),
con la misma lógica demo, y dejar la validación real para cuando llegue el motor de
reservas. Confirmar con Samuel si quiere el toggle ya o esperar al backend.
**Archivos:** `mi-reserva.tsx` (`PantallaIngreso`).
**Esfuerzo:** bajo. **Riesgo:** bajo.

### 2. Pulido visual (card sobre fondo)
**Cliente:** la maqueta presenta la pantalla como una **card blanca centrada sobre un
fondo gris suave**, un poco más «producto» que el fondo plano actual.
**Cómo lo aplicamos:** envolver `PantallaIngreso` en una card (`bg-papel` + `ring-linea`
+ sombra suave) sobre un fondo `bg-papel-hueso`. Cambio puramente estético, tokens
existentes.
**Archivos:** `mi-reserva.tsx`.
**Esfuerzo:** trivial. **Riesgo:** ninguno.

## Nota

La pantalla de **detalle** (la reserva de ejemplo con menú/recogida/contacto editables,
pago de saldo) **no aparece en la maqueta del cliente** pero ya está construida y es más
completa que nada de lo que pide. No tocar salvo pulido.

## Orden de ejecución sugerido

1. Pulido visual de la card (trivial).
2. Toggle «Con código / Con email» — si Samuel lo quiere ya (visual) o lo aparca al backend.

## Pide al cliente (decisiones que faltan)

- **¿Acceso por email ya (visual) o esperamos al motor de reservas** para hacerlo de
  verdad? (hoy no hay backend que valide ni código ni email).
