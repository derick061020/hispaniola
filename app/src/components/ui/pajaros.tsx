import type { CSSProperties } from 'react'

// Bandada decorativa del CTA «mar» (pedido de Samuel, 2026-07-14) — las
// gaviotas de ilustración de toda la vida: dos arcos, trazo, sin relleno.
// Mismo lenguaje que los iconos de lucide que usa el resto del sitio, así que
// no introducen un estilo nuevo.
//
// ⚠️ NO viven dentro de .cta-barco-ventana: esa ventana lleva overflow:hidden
// para cortar el casco en la línea de flotación, y se comería a cualquier
// pájaro que volase alto. Van en su propia capa, sin recorte, en la franja de
// cielo justo ENCIMA del botón (ver .cta-pajaros en componentes.css).
//
// ⚠️ vector-effect="non-scaling-stroke": sin esto, el grosor del trazo se
// escala con el pájaro (va en unidades del viewBox), así que el más pequeño
// (--s: 0.55) renderizaba su línea a 0,8px y se leía como una mota de polvo,
// no como un pájaro. Con non-scaling-stroke los 5 comparten el MISMO grosor
// en pantalla, que es lo que hace que se lean como una bandada y no como
// suciedad en el video.
//
// Posiciones en % del contenedor, no en px: la bandada se coloca RELATIVA al
// barco, así que si mañana cambia --spacing-cta-barco-hueco, se recoloca sola.
// Valores fuera de 0–100% a propósito: vuelan también por fuera del botón,
// nada los recorta.
type Pajaro = { x: string; y: string; escala: number; retraso: string }

const BANDADA: Pajaro[] = [
  { x: '2%', y: '46%', escala: 1, retraso: '0ms' },
  { x: '30%', y: '10%', escala: 0.75, retraso: '90ms' },
  { x: '64%', y: '54%', escala: 0.9, retraso: '180ms' },
  { x: '88%', y: '18%', escala: 0.6, retraso: '260ms' },
  { x: '-16%', y: '8%', escala: 0.55, retraso: '340ms' },
]

export function Pajaros({ className = '' }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {BANDADA.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 20 8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="cta-pajaro"
          style={{ '--x': p.x, '--y': p.y, '--s': p.escala, '--d': p.retraso } as CSSProperties}
        >
          <path d="M1 6.5Q5.5 1 10 5.5Q14.5 1 19 6.5" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </span>
  )
}
