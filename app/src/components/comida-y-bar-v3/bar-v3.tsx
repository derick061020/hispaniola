import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { TOURS } from '@/data/home'
import { Burbujas } from './burbujas'
import { pegaUltima } from './tarjetas-v3'

// 03 · OPEN BAR — «02 · Open Bar» de Party Boat (azul océano, burbujas, los
// vasos recortados que flotan), dentro del agua del museo.
//
//   · LA BARRA: las ocho bebidas recortadas (Magnific, ilustrativas, sin
//     marcas — las de la 2ª vuelta) de pie, cada una con su columna de
//     BURBUJAS subiendo por detrás (las de la landing de agentes) y flotando
//     con la ingravidez del museo. Con alcohol / sin alcohol, en dos grupos.
//   · LOS DOS MOMENTOS del itinerario (Floating Bar, Coco Loco) como las
//     ESTACIONES del tour de Bávaro Reef: foto en portillo de canto blanco a un
//     lado, texto al otro, alternando.
//
// Textos: los aprobados (data/comida-y-bar.ts → bar; WEBSITE - INICIO pág. 4-5
// y WEBSITE-TOURS pág. 8-10). «Included on» nombra solo los tours cuya ficha
// lista el open bar (Saona no; el charter, pendiente del cliente).
const B = COMIDA_Y_BAR.bar
const V = COMIDA_Y_BAR_V3.bar
// Títulos de los dos grupos de bebidas (los de data/comida-y-bar.ts, «Beer & spirits» y «Soft & fresh», son de la
// versión anterior y no dicen lo que Samuel pidió: con y sin alcohol).
const G = V.grupos
export const TOURS_CON_BAR = ['caribbean-escape', 'coral-quest']
const nombre = (slug: string) => TOURS.find((x) => x.slug === slug)?.nombre ?? slug

export function BarV3() {
  return (
    <section id="open-bar" className="ancla-comida relative pb-28 pt-20 lg:pt-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="comida3-sombra-texto mx-auto max-w-3xl text-center" data-museo-revelar>
          <p className="museo-eyebrow">
            {V.numero} · {B.eyebrow}
          </p>
          <h2 className="museo-h2 mt-3">{pegaUltima(B.titulo)}</h2>
          <p className="mt-4 text-lg text-museo-texto-suave">{B.texto}</p>
          <p className="mt-6 text-eyebrow font-semibold uppercase tracking-[0.14em] text-museo-texto-tenue">{B.sello}</p>
          <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
            {TOURS_CON_BAR.map((slug) => (
              <li key={slug}>
                <Link
                  to={`/tours/${slug}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-chip border border-museo-borde bg-museo-vidrio px-3.5 text-xs font-semibold text-museo-texto backdrop-blur-md transition-colors hover:border-museo-luz hover:text-museo-luz"
                >
                  <Check className="size-3.5 text-museo-luz" aria-hidden="true" />
                  {nombre(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* La barra */}
        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-10">
          {B.grupos.map((g) => (
            <div key={g.id} className="comida3-grupo-bebidas" data-museo-revelar>
              {/* [2026-10-22, Samuel] Cada grupo en su box sutil (vidrio de baja
                  opacidad, sin sombra) y con un título que diga lo que es. */}
              <h3 className="text-center font-display text-xl font-semibold text-museo-texto">
                {G[g.id] ?? g.titulo}
              </h3>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
                {g.bebidas.map((b) => (
                  <li key={b.id} className="flex flex-col items-center text-center">
                    <div className="relative flex h-bebida-v3 w-full items-end justify-center">
                      <span aria-hidden="true" className="comida3-halo-bebida" />
                      <Burbujas cantidad={3} altura="var(--spacing-bebida-v3)" className="inset-x-[20%] bottom-[30%] top-0" />
                      <img
                        src={b.imagen}
                        alt={b.nombre}
                        loading="lazy"
                        decoding="async"
                        data-museo-flotar
                        className="comida3-flota relative max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span aria-hidden="true" className="estante-comida mt-1 h-1.5 w-3/4 rounded-full opacity-80 blur-[2px]" />
                    <p className="mt-3 text-sm font-semibold leading-tight text-museo-texto">{pegaUltima(b.nombre)}</p>
                    {b.nota ? <p className="mt-0.5 text-xs leading-tight text-museo-texto-suave">{pegaUltima(b.nota)}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Los dos momentos, como las estaciones de Bávaro Reef */}
        <div className="mt-24 grid gap-16 lg:gap-20">
          {B.momentos.map((m, i) => (
            <article
              key={m.id}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
              data-museo-revelar
            >
              <div className={`flex ${i % 2 ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                {m.recorte ? (
                  <div className="comida3-portillo comida3-portillo--grande comida3-portillo--recorte">
                    <Burbujas cantidad={6} altura="100%" className="inset-0" />
                    <img src={m.imagen.src} alt={m.imagen.alt} loading="lazy" decoding="async" data-museo-flotar />
                  </div>
                ) : (
                  <div className="comida3-portillo comida3-portillo--grande" style={{ ['--giro' as string]: '-2deg' }}>
                    <img src={m.imagen.src} alt={m.imagen.alt} loading="lazy" decoding="async" />
                  </div>
                )}
              </div>
              <div className={`comida3-sombra-texto max-w-md text-center md:text-left ${i % 2 ? 'md:justify-self-end md:text-right' : ''}`}>
                <p className="inline-block rounded-chip bg-coral px-3 py-1 text-xs font-semibold text-white">
                  {m.tours.map(nombre).join(' · ')}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-museo-texto sm:text-3xl">{m.titulo}</h3>
                <p className="mt-3 text-museo-texto-suave">{m.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
