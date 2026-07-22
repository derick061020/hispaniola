import { Etiqueta } from '@/components/ui/etiqueta'
import type { DocumentoLegal } from '@/data/legal'

// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraLegal({ doc }: { doc: DocumentoLegal }) {
  return (
    <div>
      <Etiqueta sobreOscuro>Legal</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{doc.nombre}</h1>

      <p className="mt-4 text-sm text-white/70">Última actualización: {doc.actualizado}</p>
    </div>
  )
}
