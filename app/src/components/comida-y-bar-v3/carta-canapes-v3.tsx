import { useId, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { CANAPES, CANAPES_TEXTOS, PAQUETES_COMIDA, cortoPaqueteComida, type FamiliaCanapes } from '@/data/eventos'
import { t } from '@/lib/i18n'

// LA CARTA DE LOS 28 CANAPÉS — [2026-11-12, encargo de Fernando vía Marketing:
// «las 28 variedades en cuatro categorías, con fotos si es posible y sin
// sobrecargar»].
//
// Va DEBAJO de las cuatro tarjetas de paquetes: las tarjetas dicen cuántos
// canapés lleva cada uno y esta carta dice cuáles hay para elegir. Los nombres
// son literales de «Seleccion CANAPES.docx» (data/eventos.ts → CANAPES).
//
// SIN SOBRECARGAR: una foto por LISTA (4), no una por canapé (28 fotos
// convertirían la página en un catálogo y además no existen: ver el
// comentario de CANAPES). Si una lista no tiene foto real, se pinta un hueco
// de diseño con su nombre, nunca stock ni IA.
//
// ESCRITORIO (≥ 64rem): las dos familias lado a lado, cada una con su columna
// caliente y su columna fría → cuatro columnas que se leen de un vistazo.
// MÓVIL Y TABLETA: un selector Classic | Premium; dentro, caliente y fría
// apiladas. 28 nombres seguidos en una columna de 390 px no se escanean.
//
// [2026-11-12, 2ª vuelta, Samuel: «que se entienda mucho mejor cuáles 2
// familias son las básicas y cuáles 2 las Premium… qué paquete da acceso a
// qué nivel»] Tres cosas, con UN código de color (Classic = aqua, Premium =
// navy y oro) que también usan las cajas «Or bites» de las tarjetas:
//   1. La tabla «What each package includes»: paquete × familia, de un vistazo.
//   2. Cada familia lleva su pastilla, sus dos listas («Hot Classic + Cold
//      Classic») y en qué paquetes entra («Included in Breeze, Tide and Turtle»).
//   3. Cada lista repite la pastilla de su familia sobre la foto.
// Todo sale de PAQUETES_COMIDA (`bocados`): si cambia un paquete, cambia aquí.
const C = CANAPES_TEXTOS.carta
const PAQUETES = [...PAQUETES_COMIDA].sort((a, b) => (a.precioBase ?? 0) - (b.precioBase ?? 0))

type IdFamilia = 'classic' | 'premium'

/** «Breeze, Tide and Turtle»: los paquetes que incluyen una familia. */
function incluidaEn(familia: IdFamilia) {
  const nombres = PAQUETES.filter((p) => (p.bocados?.[familia] ?? 0) > 0).map((p) => t(cortoPaqueteComida(p)))
  if (nombres.length < 2) return nombres.join('')
  return `${nombres.slice(0, -1).join(', ')} ${t(C.y)} ${nombres[nombres.length - 1]}`
}

/** La pastilla de familia (la misma que en las cajas «Or bites»). */
function Pastilla({ familia }: { familia: IdFamilia }) {
  return (
    <span className={`comida3-familia comida3-familia--${familia}`}>
      {familia === 'premium' ? <Sparkles className="size-3" aria-hidden="true" /> : null}
      {t(CANAPES_TEXTOS.tarjeta[familia])}
    </span>
  )
}

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
        <div className="absolute left-3 top-3">
          <Pastilla familia={f.familia} />
        </div>
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

/** Paquete × familia. Celda vacía = «—» (con texto para lectores). */
function TablaAcceso() {
  const A = C.acceso
  const celda = (n: number, familia: IdFamilia) =>
    n > 0 ? (
      <span className={`comida3-acceso-n comida3-acceso-n--${familia}`}>{n}</span>
    ) : (
      <span className="text-navy-soft">
        <span aria-hidden="true">—</span>
        <span className="sr-only">{t(CANAPES_TEXTOS.tarjeta.noIncluida)}</span>
      </span>
    )
  return (
    <div className="comida3-acceso">
      <table className="w-full text-left text-sm">
        <caption className="comida3-acceso-titulo">{t(A.titulo)}</caption>
        <thead>
          <tr>
            <th scope="col" className="comida3-acceso-th">{t(A.paquete)}</th>
            <th scope="col" className="comida3-acceso-th text-center">
              <Pastilla familia="classic" />
            </th>
            <th scope="col" className="comida3-acceso-th text-center">
              <Pastilla familia="premium" />
            </th>
            <th scope="col" className="comida3-acceso-th text-right">{t(A.total)}</th>
          </tr>
        </thead>
        <tbody>
          {PAQUETES.map((p) => {
            const b = p.bocados
            const total = (b?.classic ?? 0) + (b?.premium ?? 0)
            return (
              <tr key={p.id} className="border-t border-linea">
                <th scope="row" className="py-3 pr-2 font-display text-base font-semibold text-navy">
                  {t(cortoPaqueteComida(p))}
                  {b?.nivel ? <span className="block font-sans text-xs font-medium text-navy-soft sm:ml-2 sm:inline">{t(b.nivel)}</span> : null}
                </th>
                <td className="py-3 text-center">{celda(b?.classic ?? 0, 'classic')}</td>
                <td className="py-3 text-center">{celda(b?.premium ?? 0, 'premium')}</td>
                <td className="py-3 text-right text-navy">
                  {total > 0 ? (
                    <span className="font-semibold">{total}</span>
                  ) : (
                    <span className="text-xs text-navy-soft">{t(A.soloAlmuerzo)}</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function CartaCanapesV3() {
  const [activa, setActiva] = useState<IdFamilia>('classic')
  const base = useId()
  const familias: IdFamilia[] = ['classic', 'premium']

  return (
    <div id="bites" className="ancla-comida comida3-canapes mt-20 lg:mt-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-16" data-museo-revelar>
        <div>
          <p className="comida3-eyebrow">{t(C.eyebrow)}</p>
          <h3 className="comida3-h2 mt-3">{t(C.titulo)}</h3>
          <p className="mt-4 text-lead text-navy-sub">{t(C.texto)}</p>
          <ul className="mt-6 grid gap-2.5 text-sm text-navy-sub">
            {C.reglas.map((r) => (
              <li key={r} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
                {t(r)}
              </li>
            ))}
          </ul>
        </div>
        <TablaAcceso />
      </div>

      {/* Selector de familia: solo móvil y tableta. */}
      <div role="tablist" aria-label={t(C.familias)} className="comida3-canapes-selector mt-12">
        {familias.map((fam) => (
          <button
            key={fam}
            type="button"
            role="tab"
            id={`${base}-tab-${fam}`}
            aria-controls={`${base}-panel-${fam}`}
            aria-selected={activa === fam}
            onClick={() => setActiva(fam)}
            className="comida3-canapes-pestana"
          >
            {fam === 'premium' ? <Sparkles className="size-4" aria-hidden="true" /> : null}
            {t(CANAPES_TEXTOS.tarjeta[fam])}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-8">
        {familias.map((fam) => {
          const listas = CANAPES.filter((f) => f.familia === fam)
          return (
            <section
              key={fam}
              id={`${base}-panel-${fam}`}
              role="tabpanel"
              aria-labelledby={`${base}-tab-${fam}`}
              className={`comida3-canapes-grupo comida3-canapes-grupo--${fam} ${activa === fam ? 'grid' : 'hidden'} lg:grid`}
            >
              <header>
                <Pastilla familia={fam} />
                <p className="mt-3 font-display text-xl font-semibold text-navy">
                  {t(C.composicion).replace('{caliente}', t(listas[0].nombre)).replace('{fria}', t(listas[1].nombre))}
                </p>
                <p className="mt-1 text-sm text-navy-sub">{t(C.incluidoEn).replace('{paquetes}', incluidaEn(fam))}</p>
              </header>
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
                {listas.map((f) => (
                  <Familia key={f.id} f={f} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
