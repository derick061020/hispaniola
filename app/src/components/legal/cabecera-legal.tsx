import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import type { DocumentoLegal } from '@/data/legal'

export function CabeceraLegal({ doc }: { doc: DocumentoLegal }) {
  return (
    <div>
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">{doc.nombre}</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        Legal
      </Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{doc.nombre}</h1>

      <p className="mt-4 text-sm text-white/70">Última actualización: {doc.actualizado}</p>
    </div>
  )
}
