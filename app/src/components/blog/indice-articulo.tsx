import { Etiqueta } from '@/components/ui/etiqueta'
import type { BloqueArticulo } from '@/data/blog'

// Índice del artículo (correcciones v1, pedido de Samuel 2026-07-22: "que al
// principio haya index con link a los títulos de las secciones"). Enlaza a
// los `id` de los bloques h2/h3 del cuerpo (h4 se queda fuera del índice —
// demasiado granular para una tabla de contenido, igual que en cualquier
// blog editorial). Solo se pinta si el artículo tiene al menos un
// encabezado — el resto de artículos (`cuerpo: null` o sin headings) no
// muestran nada.
//
// REDISEÑO (2ª vuelta, correcciones v1 — pedido de Samuel: "me parece feo,
// el título tiene el mismo peso que los títulos del artículo, se ve raro").
// La 1ª versión rotulaba la caja con "En este artículo" en
// `font-semibold text-navy` — EXACTO el mismo peso/color que los propios
// h2/h3/h4 del cuerpo (font-display font-semibold text-navy, ver
// pages/articulo.tsx), así que el rótulo se leía como un encabezado más de
// la página en vez de una etiqueta de navegación. Ahora usa Etiqueta (el
// mismo eyebrow — mayúsculas, tracked, aqua-dark — que todo el resto del
// sitio), y los propios links dejan `font-display`/`text-navy` semibold por
// texto normal (sans, `text-navy-sub`/`text-navy-soft`, como máximo
// `font-medium` en el nivel 2): visualmente quedan como una lista de
// enlaces, nunca como títulos compitiendo con los reales. El raíl vertical
// (`border-l`) + el borde propio de cada link (`-ml-px`, transparente →
// aqua-dark al hover) da la sensación de tabla de contenido editorial sin
// caer en cards ni números.
type ItemIndice = { id: string; texto: string; nivel: 2 | 3 }

function itemsIndice(bloques: BloqueArticulo[]): ItemIndice[] {
  return bloques
    .filter((b): b is Extract<BloqueArticulo, { tipo: 'h2' | 'h3' }> => b.tipo === 'h2' || b.tipo === 'h3')
    .map((b) => ({ id: b.id, texto: b.texto, nivel: b.tipo === 'h2' ? 2 : 3 }))
}

export function IndiceArticulo({ bloques }: { bloques: BloqueArticulo[] }) {
  const items = itemsIndice(bloques)
  if (items.length === 0) return null

  return (
    <nav aria-label="Índice del artículo" className="rounded-card-grande bg-papel-hueso p-5 ring-1 ring-linea sm:p-6">
      <Etiqueta>En este artículo</Etiqueta>
      <ul className="mt-3 flex flex-col border-l border-linea">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 border-transparent py-1.5 text-sm transition-colors hover:border-aqua-dark hover:text-aqua-dark ${
                item.nivel === 3 ? 'pl-8 text-navy-soft' : 'pl-4 font-medium text-navy-sub'
              }`}
            >
              {item.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
