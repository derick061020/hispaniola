import { useId, useState } from 'react'
import { Sparkles } from 'lucide-react'
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
//
// [2026-11-13, 5ª vuelta, Samuel] La caja Premium deja el navy y toma la piel
// de las cards premium de tours (la tarjeta de reserva «Premium US$ 114 /
// Light US$ 99»): `.premium-card` (casi negro con luz de oro), oro PLANO en
// los textos y oro DEGRADADO solo en la etiqueta (`.premium-metal`) y el
// título (`.premium-cifra`). Mismas clases y tokens, ninguno nuevo.
//
// [2026-11-12, 3ª vuelta, Samuel: «demasiado sutil»] Cada familia va DENTRO DE
// SU CAJA: Classic en el tinte aqua (claro, fresco, de marca) y Premium en
// navy con oro, la piel del Turtle. En móvil el selector sigue mandando: enseña
// una caja u otra, y su pestaña activa toma el color de su caja.
//
// [2026-11-12, 4ª vuelta, Samuel: «todo el bloque superior… y ese bloque a la
// derecha me confunde»] Fuera la tabla «What each package includes»: repetía
// lo que ya dicen las cajas «Or bites» de las tarjetas y el «Included in…» de
// cada familia, y sus subtítulos Standard/Premium/VIP chocaban con la familia
// Premium (el Tide salía como «Premium»). Arriba queda UN título y UNA frase;
// las tres reglas bajan a una línea de letra pequeña bajo las cajas.
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
function Pastilla({ familia, metal = false }: { familia: IdFamilia; metal?: boolean }) {
  // [2026-11-13] Dentro de la caja Premium, la etiqueta es de oro DEGRADADO
  // (`.premium-metal`, la del badge de las cards premium de tours).
  return (
    <span className={`comida3-familia ${metal ? 'comida3-familia--metal premium-metal' : `comida3-familia--${familia}`}`}>
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
          <Pastilla familia={f.familia} metal={premium} />
        </div>
      </div>
      {/* [2026-11-13] Dentro de la caja Premium (piel de las cards premium de
          tours): títulos en oro PLANO, nombres en --color-premium-texto y lo
          secundario en --color-premium-texto-suave (AA sobre el casi negro). */}
      <h4
        className={`mt-4 flex items-baseline justify-between gap-3 font-display text-xl font-semibold ${premium ? 'text-premium-oro' : 'text-navy'}`}
      >
        {t(f.nombre)}
        <span
          className={`shrink-0 whitespace-nowrap text-eyebrow font-semibold uppercase tracking-[0.14em] ${premium ? 'text-premium-texto-suave' : 'text-navy-sub'}`}
        >
          {f.items.length} {t(C.variedades)}
        </span>
      </h4>
      <ul className={`mt-3 grid gap-2 text-sm ${premium ? 'text-premium-texto' : 'text-navy'}`}>
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

/** `columna` [2026-11-13]: para las páginas de evento, donde el formulario
 *  de la derecha deja una columna de ~760 px. Las dos cajas van APILADAS (cada
 *  una con sus dos listas lado a lado) y la cabecera baja a la escala de la
 *  ficha (allí el título de sección es el h2 de «paquetes»). */
export function CartaCanapesV3({ columna = false }: { columna?: boolean }) {
  const [activa, setActiva] = useState<IdFamilia>('classic')
  const base = useId()
  const familias: IdFamilia[] = ['classic', 'premium']

  return (
    <div id="bites" className={`ancla-comida comida3-canapes ${columna ? 'mt-12 scroll-mt-sticky-top' : 'mt-20 lg:mt-24'}`}>
      {/* [2026-11-13, Samuel] El título va en UNA línea en escritorio: contenedor ancho y sin corte desde lg. */}
      <div className="max-w-4xl" data-museo-revelar>
        <p className="comida3-eyebrow">{t(C.eyebrow)}</p>
        <h3 className={columna ? 'mt-2 font-display text-h3 font-semibold text-navy' : 'comida3-h2 mt-3 lg:whitespace-nowrap'}>{t(C.titulo)}</h3>
        <p className={columna ? 'mt-2 text-sm text-navy-sub' : 'mt-4 text-lead text-navy-sub'}>{t(C.texto)}</p>
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
            className={`comida3-canapes-pestana comida3-canapes-pestana--${fam}`}
          >
            {fam === 'premium' ? <Sparkles className="size-4" aria-hidden="true" /> : null}
            {t(CANAPES_TEXTOS.tarjeta[fam])}
          </button>
        ))}
      </div>

      <div className={`mt-6 grid ${columna ? 'gap-6' : 'gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-8'}`}>
        {familias.map((fam) => {
          const listas = CANAPES.filter((f) => f.familia === fam)
          return (
            <section
              key={fam}
              id={`${base}-panel-${fam}`}
              role="tabpanel"
              aria-labelledby={`${base}-tab-${fam}`}
              className={`comida3-canapes-grupo comida3-canapes-grupo--${fam} ${fam === 'premium' ? 'premium-card' : ''} ${activa === fam ? 'grid' : 'hidden'} lg:grid`}
            >
              <header>
                <Pastilla familia={fam} metal={fam === 'premium'} />
                {/* El título de la caja Premium, en oro DEGRADADO (`.premium-cifra`, el
                    de las cifras de las cards premium de tours). */}
                <p className={`mt-3 font-display text-2xl font-semibold ${fam === 'premium' ? 'premium-cifra' : 'text-navy'}`}>
                  {t(C.composicion).replace('{caliente}', t(listas[0].nombre)).replace('{fria}', t(listas[1].nombre))}
                </p>
                <p className={`mt-1 text-sm ${fam === 'premium' ? 'text-premium-texto-suave' : 'text-navy-sub'}`}>
                  {t(C.incluidoEn).replace('{paquetes}', incluidaEn(fam))}
                </p>
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

      {/* Las tres reglas, como letra pequeña (antes, viñetas arriba). */}
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-navy-soft">
        {C.reglas.map((r) => t(r)).join(' · ')}
      </p>
    </div>
  )
}
