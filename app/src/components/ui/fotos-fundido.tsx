import { useEffect, useState } from 'react'

// Crossfade reusable (PLAN-INTERNAS-V2.md §C1) — fondo del hero de las
// páginas internas (en vez del video del hero de la home) y de los boxes de
// «También te puede gustar» (§C4): las fotos REALES del tour/evento
// fundiéndose una en otra. Componente NUEVO a propósito — no una tercera
// rama dentro de ui/carrusel-imagenes.tsx (compartido con la home, con su
// propia mecánica de deslizado + flechas + puntos que aquí no aplican):
// mezclar un modo fade "de conveniencia" ahí arriesgaba la garantía de home
// intacta por un `if`. Un componente React = un componente de Figma.
//
// Decorativa (las fotos no son contenido que un lector de pantalla necesite
// describir una por una — el `aria-label` del wrapper ya dice qué es).
// Con prefers-reduced-motion NO avanza sola (WCAG 2.2.2, mismo trato que
// ui/carrusel-imagenes.tsx). Con 0-1 fotos es estática (el caso Isla Saona:
// `galeriaCompleta: []` → una sola foto de portada, sin fundido que animar).

// Lee un token de tiempo del :root (--x: 4s | 400ms). Mismo helper que
// ui/carrusel-imagenes.tsx y home/reviews.tsx — no se extrae a un módulo
// compartido por 3 usos de 6 líneas cada uno.
function leerMs(nombre: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  const n = parseFloat(bruto)
  if (Number.isNaN(n)) return fallback
  return bruto.endsWith('ms') ? n : n * 1000
}

export function FotosFundido({
  fotos,
  etiqueta,
  activa = true,
  className = '',
}: {
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (p. ej. el nombre del tour) */
  etiqueta: string
  /** [dev-mode] false congela el fundido en su 1ª foto (frame para Figma) */
  activa?: boolean
  className?: string
}) {
  const [indice, setIndice] = useState(0)
  const n = fotos.length

  useEffect(() => {
    if (!activa || n <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndice((i) => (i + 1) % n), leerMs('--fundido-intervalo', 4500))
    return () => window.clearInterval(id)
  }, [activa, n])

  if (n === 0) return null

  return (
    <div className={`relative overflow-hidden bg-papel-hueso ${className}`} role="img" aria-label={etiqueta}>
      {fotos.map((foto, i) => (
        <img
          key={foto}
          src={`/fotos/${foto}.webp`}
          alt=""
          aria-hidden="true"
          // Solo la 1ª foto es eager: es la que se ve al pintar. El resto va
          // lazy — el navegador las trae en segundo plano (están en el
          // viewport del hero, así que arrancan casi de inmediato) y así
          // ninguna funde a gris por llegar tarde a su turno.
          loading={i === 0 ? 'eager' : 'lazy'}
          className="fundido-foto absolute inset-0 size-full object-cover"
          style={{ opacity: i === indice ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
