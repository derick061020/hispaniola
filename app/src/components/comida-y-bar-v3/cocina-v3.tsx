import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { Award, ChefHat, ChevronLeft, ChevronRight, CookingPot, Expand, Flame, Salad } from 'lucide-react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { FICHAS } from '@/data/tours'
import { t } from '@/lib/i18n'

// 01 · FLOATING KITCHEN — «This is what comes out of the kitchen» de Party
// Boat: un CARRETE horizontal de fotos reales que se abren en el visor, justo
// después del héroe y antes de leer nada más.
//
// [2026-10-21, 2ª revisión de Samuel] «El mar solo donde toca»: esta sección pasa a fondo claro de Hispaniola (el agua se queda en el Open Bar y los niveles de barra).
//
// Las fotos se visten como los «portillos» del tour de Bávaro Reef
// (`.brt-port`: canto blanco grueso, esquinas redondas, sombra honda, la foto
// se acerca al pasar), cada una con su leve giro, como fotos sueltas sobre el
// agua. El carrete es scroll nativo con snap (en móvil se arrastra; en
// escritorio, además, flechas).
//
// Texto y sellos: los aprobados (data/comida-y-bar.ts → cocina; los cinco
// sellos de la cocina, de la ficha del charter, WEBSITE-TOURS pág. 18-19).
const C = COMIDA_Y_BAR.cocina
const V = COMIDA_Y_BAR_V3.cocina

const ICONO_COCINA: Record<string, ComponentType<{ className?: string }>> = {
  ingredientes: Award,
  'show-cooking': ChefHat,
  'desde-cero': CookingPot,
  'al-momento': Flame,
  dietas: Salad,
}

// Versión ligera de cada foto (la de 720 px si existe). El visor carga el original.
const miniatura = (id: string) =>
  id.startsWith('ev-corporate-menu') ? `/fotos/comida-bar/${id}-720.webp` : `/fotos/${id}.webp`

export function CocinaV3() {
  const sellos = FICHAS['private-charter'].menuCharter?.cocina ?? []
  const [abierta, setAbierta] = useState<number | null>(null)
  const carrilRef = useRef<HTMLUListElement>(null)
  // [2026-10-22, revisión] Las flechas se apagan en los extremos del carrete.
  const [extremo, setExtremo] = useState({ inicio: true, fin: false })
  const medir = useCallback(() => {
    const c = carrilRef.current
    if (!c) return
    setExtremo({ inicio: c.scrollLeft <= 2, fin: c.scrollLeft + c.clientWidth >= c.scrollWidth - 2 })
  }, [])
  useEffect(() => {
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [medir])

  const mover = (sentido: 1 | -1) => {
    const carril = carrilRef.current
    if (!carril) return
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    carril.scrollBy({ left: sentido * carril.clientWidth * 0.8, behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <section id="floating-kitchen" className="ancla-comida relative bg-papel pb-20 pt-12 sm:pt-16 lg:pb-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10" data-museo-revelar>
          <div className="lg:col-span-7">
            <p className="comida3-eyebrow">
              {V.numero} · {C.eyebrow}
            </p>
            <h2 className="comida3-h2 mt-3">{C.titulo}</h2>
          </div>
          <p className="text-lead text-navy-sub lg:col-span-5">{C.texto}</p>
        </div>

        {sellos.length ? (
          <ul
            className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
            data-museo-revelar
          >
            {sellos.map((s) => {
              const Icono = ICONO_COCINA[s.id] ?? ChefHat
              return (
                <li
                  key={s.id}
                  title={s.texto}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-chip border border-transparent bg-aqua-tint px-4 text-sm font-semibold text-navy"
                >
                  <Icono className="size-4 text-aqua-dark"aria-hidden="true" />
                  {s.titulo}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      {/* El carrete: a sangre por la derecha, como el de Party Boat. */}
      <div className="relative mt-10" data-museo-revelar>
        <ul
          ref={carrilRef}
          onScroll={medir}
          className="comida3-carrete flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-6 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {C.fotos.map((f, i) => (
            <li key={f.id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setAbierta(i)}
                aria-label={`${t('Open photo')}: ${f.alt}`}
                className="comida3-portillo group"
                style={{ ['--giro' as string]: `${[-2.5, 1.8, -1.2, 2.4, -1.8, 1.2, -2][i % 7]}deg` }}
              >
                <img src={miniatura(f.id)} alt={f.alt} loading="lazy" decoding="async" />
                <span className="comida3-portillo-lupa" aria-hidden="true">
                  <Expand className="size-4" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-2 flex max-w-contenido items-center justify-between gap-4 px-5 sm:px-10">
          <p className="text-sm text-navy-soft">
            {V.pista}
          </p>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => mover(-1)} disabled={extremo.inicio} aria-label={t('Previous photos')} className="comida3-flecha-clara">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => mover(1)} disabled={extremo.fin} aria-label={t('Next photos')} className="comida3-flecha-clara">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {abierta !== null ? (
        <GaleriaLightbox
          fotos={C.fotos.map((f) => f.id)}
          indiceInicial={abierta}
          etiqueta={t('Food & Bar')}
          alts={C.fotos.map((f) => f.alt)}
          onCerrar={() => setAbierta(null)}
        />
      ) : null}
    </section>
  )
}
