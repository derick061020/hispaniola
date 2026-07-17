import { Link } from 'react-router-dom'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Estrellas } from '@/components/ui/estrellas'
import type { FichaEvento } from '@/data/eventos'

// Above the fold de la landing de evento (renderBodas/renderEmpresas del
// prototipo): migaja, eyebrow, H1, sub, la fila de confianza (bodas: el
// Couples' Choice de WeddingWire — el premio EXACTO para esta audiencia) y
// los CTA.
//
// PLAN-INTERNAS-V2.md (§C5): deja de tener su propio contenedor + columna de
// foto — se disuelve en el `children` de HeroInterna (mismo hero compartido
// con la ficha de tour, PLAN-INTERNAS-V2.md §C1), sobre las fotos reales del
// evento en fundido en vez de una imagen fija al lado. Los colores pasan a
// blanco: H1/sub/migaja directos (esta migaja es propia, no la de AlignUI —
// nunca necesitó el wrapper .migaja-sobre-foto de la ficha), Etiqueta con
// `sobreOscuro`. La banda de cifras (solo empresas) sale de aquí y vive
// debajo, en blanco (pages/evento.tsx) — no compite con la foto.
//
// Los CTA van por EnlacePrototipo: el destino real es el formulario del hub
// de eventos (#/eventos?tipo=…), que vive en el prototipo — misma frontera
// que el CTA del widget de la ficha de tour. El dossier PDF de empresas
// tampoco existe como asset: en el prototipo era un botón demo con toast.

export function CabeceraEvento({ evento }: { evento: FichaEvento }) {
  return (
    <div>
      {/* Migaja: "Eventos" es el hub (formulario + ocasiones), que sigue en
          el prototipo — de ahí EnlacePrototipo, como "Tours" en la ficha. */}
      <nav aria-label="Migaja de pan" className="text-xs text-white/70">
        <Link to="/" className="hover:text-white">
          Inicio
        </Link>
        <span className="px-1.5 text-white/40">/</span>
        <EnlacePrototipo className="hover:text-white">Eventos</EnlacePrototipo>
        <span className="px-1.5 text-white/40">/</span>
        <span className="text-white/90">{evento.nombre}</span>
      </nav>

      <Etiqueta sobreOscuro className="mt-4">
        {evento.eyebrow}
      </Etiqueta>

      {/* --text-h2, igual que el H1 de la ficha de tour: manda por
          jerarquía, no por tamaño — --text-hero es solo del hero de la
          home. */}
      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{evento.titulo}</h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{evento.sub}</p>

      {evento.trust ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Estrellas calificacion={5} sobreOscuro />
          <strong className="font-semibold text-white">{evento.trust}</strong>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <EnlacePrototipo className="inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark">
          {evento.ctaPrincipal}
        </EnlacePrototipo>
        {evento.ctaSecundaria ? (
          <EnlacePrototipo className="inline-flex items-center justify-center rounded-btn bg-papel/90 px-5 py-3 text-sm font-semibold text-navy backdrop-blur-sm transition hover:bg-papel">
            {evento.ctaSecundaria}
          </EnlacePrototipo>
        ) : null}
      </div>
    </div>
  )
}
