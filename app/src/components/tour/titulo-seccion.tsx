import type { ReactNode } from 'react'

// Título de sección de la ficha (2026-07-17, Samuel: "los títulos de las
// secciones tienen muy poca fuerza, mira los de Viator"). Reemplaza el eyebrow
// de 12px en aqua (Etiqueta) por un titular con peso: navy, semibold,
// --text-h3 (22px). Da jerarquía clara a cada bloque (Itinerario, Qué incluye,
// Tu menú…), como los títulos de sección de Viator.
export function TituloSeccion({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-h3 font-semibold text-navy">{children}</h2>
}
