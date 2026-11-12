import { useId, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { CANAPES, CANAPES_TEXTOS, type FamiliaCanapes } from '@/data/eventos'
import { t } from '@/lib/i18n'

// LA CARTA DE LOS 28 CANAPÉS — [2026-11-12, encargo de Fernando vía Marketing:
// «las 28 variedades en cuatro categorías, con fotos si es posible y sin
// sobrecargar»].
//
// Va DEBAJO de las cuatro tarjetas de paquetes: las tarjetas dicen cuántos
// canapés lleva cada uno y esta carta dice cuáles hay para elegir. Los nombres
// son literales de «Seleccion CANAPES.docx» (data/eventos.ts → CANAPES).
//
// SIN SOBRECARGAR: una foto por FAMILIA (4), no una por canapé (28 fotos
// convertirían la página en un catálogo y además no existen: ver el
// comentario de CANAPES). Si una familia no tiene foto real, se pinta un hueco
// de diseño con su nombre, nunca stock ni IA.
//
// ESCRITORIO (≥ 64rem): las dos familias lado a lado, cada una con su columna
// caliente y su columna fría → cuatro columnas que se leen de un vistazo.
// MÓVIL Y TABLETA: un selector Classic | Premium; dentro, caliente y fría
// apiladas. 28 nombres seguidos en una columna de 390 px no se escanean.
const C = CANAPES_TEXTOS.carta

function Familia({ f }: { f: FamiliaCanapes }) {
  const premium = f.familia === 'premium'
  return (
    <article className="comida3-canapes-familia">
      <div className="comida3-canapes-foto">
        {f.foto ? (
          <img src={`${f.foto}.webp`} alt={t(f.fotoAlt)} loading="lazy" decoding="async" className="size-full object-cover" />
        ) : (
          // Hueco de diseño: sin foto real todavía (ver CANAPES).
          <div className={`comida3-canapes-hueco ${premium ? 'comida3-canapes-hueco--premium' : ''}`} aria-hidden="true">
            <span className="font-display text-2xl font-semibold">{t(f.nombre)}</span>
            <span className="mt-1 text-eyebrow font-semibold uppercase tracking-[0.14em]">
              {f.items.length} {t(C.variedades)}
            </span>
          </div>
        )}
      </div>
      <h4 className="mt-4 flex items-baseline justify-between gap-3 font-display text-xl font-semibold text-navy">
        {t(f.nombre)}
        <span className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
          {f.items.length} {t(C.variedades)}
        </span>
      </h4>
      <ul className="mt-3 grid gap-2 text-sm text-navy">
        {f.items.map((nombre) => (
          <li key={nombre} className="flex gap-2">
            <span className={`comida3-canapes-punto ${premium ? 'comida3-canapes-punto--premium' : ''}`} aria-hidden="true" />
            {t(nombre)}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function CartaCanapesV3() {
  const [activa, setActiva] = useState<'classic' | 'premium'>('classic')
  const base = useId()
  const familias = [
    { id: 'classic' as const, nombre: CANAPES_TEXTOS.tarjeta.classic },
    { id: 'premium' as const, nombre: CANAPES_TEXTOS.tarjeta.premium },
  ]

  return (
    <div id="bites" className="ancla-comida comida3-canapes mt-20 lg:mt-24">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16" data-museo-revelar>
        <div>
          <p className="comida3-eyebrow">{t(C.eyebrow)}</p>
          <h3 className="comida3-h2 mt-3">{t(C.titulo)}</h3>
          <p className="mt-4 text-lead text-navy-sub">{t(C.texto)}</p>
        </div>
        <ul className="grid gap-2.5 text-sm text-navy-sub">
          {C.reglas.map((r) => (
            <li key={r} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
              {t(r)}
            </li>
          ))}
        </ul>
      </div>

      {/* Selector de familia: solo móvil y tableta. */}
      <div role="tablist" aria-label={t(C.familias)} className="comida3-canapes-selector mt-10">
        {familias.map((fam) => (
          <button
            key={fam.id}
            type="button"
            role="tab"
            id={`${base}-tab-${fam.id}`}
            aria-controls={`${base}-panel-${fam.id}`}
            aria-selected={activa === fam.id}
            onClick={() => setActiva(fam.id)}
            className="comida3-canapes-pestana"
          >
            {fam.id === 'premium' ? <Sparkles className="size-4" aria-hidden="true" /> : null}
            {t(fam.nombre)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-8">
        {familias.map((fam) => (
          <section
            key={fam.id}
            id={`${base}-panel-${fam.id}`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${fam.id}`}
            className={`comida3-canapes-grupo ${fam.id === 'premium' ? 'comida3-canapes-grupo--premium' : ''} ${activa === fam.id ? 'grid' : 'hidden'} lg:grid`}
          >
            <p className="comida3-canapes-grupo-titulo">
              {fam.id === 'premium' ? <Sparkles className="size-4" aria-hidden="true" /> : null}
              {t(fam.nombre)}
            </p>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
              {CANAPES.filter((f) => f.familia === fam.id).map((f) => (
                <Familia key={f.id} f={f} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
