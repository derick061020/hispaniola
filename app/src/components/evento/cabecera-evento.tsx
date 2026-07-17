import { Link } from 'react-router-dom'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Estrellas } from '@/components/ui/estrellas'
import type { FichaEvento } from '@/data/eventos'

// Above the fold de la landing de evento (renderBodas/renderEmpresas del
// prototipo): migaja, eyebrow, H1, sub, la fila de confianza (bodas: el
// Couples' Choice de WeddingWire — el premio EXACTO para esta audiencia) y
// los CTA, con la foto real al lado.
//
// Los CTA van por EnlacePrototipo: el destino real es el formulario del hub
// de eventos (#/eventos?tipo=…), que vive en el prototipo — misma frontera
// que el CTA del widget de la ficha de tour. El dossier PDF de empresas
// tampoco existe como asset: en el prototipo era un botón demo con toast.

export function CabeceraEvento({ evento }: { evento: FichaEvento }) {
  return (
    <div className="mx-auto max-w-contenido px-5 pt-6 sm:px-10">
      {/* Migaja: "Eventos" es el hub (formulario + ocasiones), que sigue en
          el prototipo — de ahí EnlacePrototipo, como "Tours" en la ficha. */}
      <nav aria-label="Migaja de pan" className="text-xs text-navy-soft">
        <Link to="/" className="hover:text-navy">
          Inicio
        </Link>
        <span className="px-1.5 text-linea-fuerte">/</span>
        <EnlacePrototipo className="hover:text-navy">Eventos</EnlacePrototipo>
        <span className="px-1.5 text-linea-fuerte">/</span>
        <span className="text-navy-sub">{evento.nombre}</span>
      </nav>

      <div className="mt-5 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Etiqueta>{evento.eyebrow}</Etiqueta>

          {/* --text-h2, igual que el H1 de la ficha de tour: manda por
              jerarquía, no por tamaño — --text-hero es solo del hero. */}
          <h1 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">{evento.titulo}</h1>

          <p className="mt-4 max-w-2xl text-lead text-navy-sub">{evento.sub}</p>

          {/* div, no <p>: Estrellas renderiza un <div> y un div dentro de un
              párrafo es HTML inválido (React lo rompe en dos y lo reporta en
              consola — encontrado en la verificación). */}
          {evento.trust ? (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Estrellas calificacion={5} />
              <strong className="font-semibold text-navy">{evento.trust}</strong>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <EnlacePrototipo className="inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark">
              {evento.ctaPrincipal}
            </EnlacePrototipo>
            {evento.ctaSecundaria ? (
              <EnlacePrototipo className="inline-flex items-center justify-center rounded-btn bg-papel-hueso px-5 py-3 text-sm font-semibold text-navy ring-1 ring-linea transition hover:bg-papel hover:ring-linea-fuerte">
                {evento.ctaSecundaria}
              </EnlacePrototipo>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-card">
          <img
            src={`/fotos/${evento.foto}.webp`}
            alt={evento.fotoAlt}
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
          />
        </div>
      </div>

      {/* Banda de cifras (solo empresas) — la tabla-stats del prototipo: lo
          primero que un organizador comprueba antes de leer nada más. */}
      {evento.stats ? (
        <dl className="mt-10 grid grid-cols-2 gap-6 rounded-card bg-papel-hueso p-6 sm:grid-cols-4">
          {evento.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-stat font-semibold text-navy">{s.valor}</span>
                <span className="mt-1 block text-xs text-navy-soft">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}
