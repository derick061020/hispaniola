import { Etiqueta } from '@/components/ui/etiqueta'
import type { Articulo } from '@/data/blog'
import type { MiembroEquipo } from '@/data/nosotros'

// Cabecera del artículo — children de HeroInterna (correcciones v1, pedido
// de Samuel 2026-07-22: el artículo pasa a abrir con el MISMO hero que el
// resto de internas, foto de portada en vez de video). Mismo anatómico
// blanco-sobre-foto que CabeceraBlog/CabeceraContacto — eyebrow · H1 · lead
// — más la fila de autor/fecha/lectura que antes vivía suelta en
// pages/articulo.tsx, ahora sobre la foto en vez de sobre papel. Sin migaja
// (retirada de TODOS los heros de internas el mismo día, pedido de Samuel).
export function CabeceraArticulo({ articulo, autor }: { articulo: Articulo; autor?: MiembroEquipo }) {
  return (
    <div>
      <Etiqueta sobreOscuro>{articulo.categoria}</Etiqueta>

      <h1 className="mt-3 max-w-3xl text-balance font-display text-h2 font-semibold text-white">
        {articulo.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{articulo.extracto}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full bg-white/15 text-xs font-semibold text-white"
        >
          {(autor?.nombre ?? 'H').slice(0, 1)}
        </span>
        <span className="font-medium text-white/90">{autor?.nombre ?? 'Hispaniola'}</span>
        {autor ? <span className="text-white/70">· {autor.rol}</span> : null}
        <span aria-hidden="true">·</span>
        <span>{articulo.fecha}</span>
        <span aria-hidden="true">·</span>
        <span>{articulo.minutos} min de lectura</span>
      </div>
    </div>
  )
}
