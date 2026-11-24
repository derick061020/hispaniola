import { useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  BANDERAS_FOD,
  BUENO_SABER_FOD,
  PACKS_FOD,
  WHATSAPP_FOD,
  WHATSAPP_FOD_TEXTO,
  type FiestaOnDeck,
} from '@/data/fiesta-on-deck'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

// Las secciones de las landings de Fiesta on Deck (2026-11-24). Mismo orden
// que las referencias de Marketing; cada una conserva su titular, su copy y
// sus fotos. Las mejoras son de presentación: menos barras de navegación,
// tarjetas que se leen de un vistazo, el formulario de reserva en una sola
// pantalla en vez de cuatro pasos, y todo dentro de la web de Hispaniola.

/** Cabecera de sección: eyebrow en mono + titular partido en dos (el
 *  segundo trozo en hueco o marcado) + intro a la derecha. */
export function CabeceraFod({
  eyebrow,
  linea1,
  linea2,
  estilo2 = 'acento',
  intro,
  id,
}: {
  eyebrow: string
  linea1: string
  linea2?: string
  estilo2?: 'acento' | 'contorno' | 'marcado'
  intro?: ReactNode
  id?: string
}) {
  return (
    <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-fod-acento">
          {eyebrow}
          <span aria-hidden="true" className="h-0.5 w-16 bg-fod-acento" />
        </p>
        <h2 id={id} className="mt-4 text-fod-h2">
          <span className="fod-display block">{linea1}</span>
          {linea2 ? (
            <span
              className={`fod-display ${
                estilo2 === 'contorno'
                  ? 'fod-contorno block'
                  : estilo2 === 'marcado'
                    ? 'fod-marcado mt-2'
                    : 'block text-fod-acento'
              }`}
            >
              {linea2}
            </span>
          ) : null}
        </h2>
      </div>
      {intro ? <div className="text-sm text-fod-humo sm:text-base">{intro}</div> : null}
    </div>
  )
}

function Seccion({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 bg-fod-fondo py-16 text-fod-texto sm:py-24 ${className}`}>
      <div className="mx-auto max-w-contenido px-5 sm:px-10">{children}</div>
    </section>
  )
}

// ── Cinta ───────────────────────────────────────────────────────────────

/** La cinta inclinada que cruza la página (Afro: lemas; Latin: países con
 *  bandera; las dos: los ritmos). Se repite el contenido para el bucle. */
export function CintaFod({ items, banderas = false, invertida = false }: { items: string[]; banderas?: boolean; invertida?: boolean }) {
  const lista = banderas ? BANDERAS_FOD.map((b) => ({ texto: t(b.nombre), codigo: b.codigo })) : items.map((i) => ({ texto: t(i), codigo: '' }))
  const fila = (copia: number) =>
    lista.map((x, i) => (
      <span key={`${copia}-${i}`} className="flex items-center gap-4 px-4" aria-hidden={copia > 0 ? 'true' : undefined}>
        {x.codigo ? (
          <img src={`/fotos/fiesta-on-deck/banderas/${x.codigo}.svg`} alt="" className="h-5 w-auto border border-fod-fondo" />
        ) : null}
        <span className="fod-display text-xl sm:text-2xl">{x.texto}</span>
        <span aria-hidden="true" className="text-xl">✷</span>
      </span>
    ))
  return (
    <div
      className={`fod-cinta relative z-10 -my-2 border-y-2 border-fod-fondo py-3 ${
        invertida ? 'rotate-1 bg-fod-acento-3 text-fod-sobre-acento' : '-rotate-1 bg-fod-acento text-fod-sobre-acento'
      }`}
    >
      <div className="fod-cinta__pista">
        {fila(0)}
        {fila(1)}
      </div>
    </div>
  )
}

// ── Cuatro cosas ─────────────────────────────────────────────────────────

export function CuatroFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  return (
    <Seccion id="fod-vibe">
      <CabeceraFod eyebrow={t('How the day is built')} linea1={t('Four things.')} linea2={t('One is you.')} intro={fiesta.cuatroIntro} />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fiesta.cuatro.map((c, i) => (
          <li
            key={c.titulo}
            className={`border-2 p-6 ${
              i === 3 ? 'fod-pegatina border-fod-texto' : 'border-fod-linea bg-fod-panel'
            }`}
          >
            <span className={`fod-display block text-5xl ${i === 3 ? '' : 'text-fod-acento'}`}>0{i + 1}</span>
            <h3 className="mt-4 font-fod text-lg font-extrabold uppercase">{c.titulo}</h3>
            <p className={`mt-2 text-sm ${i === 3 ? '' : 'text-fod-humo'}`}>{c.texto}</p>
          </li>
        ))}
      </ol>
    </Seccion>
  )
}

// ── El sonido ────────────────────────────────────────────────────────────

export function SonidoFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const s = fiesta.sonido
  // El titular se parte por la primera palabra: «Press / play.», «Sube / el volumen.»
  const [primera, ...resto] = s.titulo.split(' ')
  return (
    <Seccion id="fod-sonido">
      <CabeceraFod eyebrow={t('The sound')} linea1={primera} linea2={resto.join(' ')} estilo2="contorno" intro={s.intro} />
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <ol>
          {s.estilos.map((e, i) => (
            <li key={e} className="flex items-baseline gap-5 border-b-2 border-fod-linea py-4">
              <span className="font-mono text-xs text-fod-humo">0{i + 1}</span>
              <span className="fod-display text-3xl sm:text-6xl">{e}</span>
              <span aria-hidden="true" className="ml-auto hidden font-mono text-fod-acento sm:inline">ılı</span>
            </li>
          ))}
        </ol>
        <div>
          <img
            src={`/fotos/fiesta-on-deck/${s.foto.foto}.webp`}
            alt={s.foto.alt}
            loading="lazy"
            className="fod-marco aspect-[4/5] w-full rotate-2 object-cover"
          />
          <p className="mt-8 border-2 border-dashed border-fod-acento p-4 text-sm text-fod-humo">
            <strong className="text-fod-acento">{t('Or your playlist.')}</strong> {s.tuLista}
          </p>
        </div>
      </div>
    </Seccion>
  )
}

// ── La comida ────────────────────────────────────────────────────────────

export function ComidaFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const c = fiesta.comida
  const palabras = c.titulo.split(' ')
  const ultima = palabras.pop() ?? ''
  return (
    <Seccion id="fod-comida">
      <CabeceraFod eyebrow={t('The food package')} linea1={palabras.join(' ')} linea2={ultima} intro={c.intro} />
      <div className="mt-12 grid overflow-hidden border-2 border-fod-texto bg-fod-panel lg:grid-cols-2">
        <figure className="relative">
          <img
            src={`/fotos/fiesta-on-deck/${c.foto.foto}.webp`}
            alt={c.foto.alt}
            loading="lazy"
            className="h-full min-h-72 w-full object-cover"
          />
          <figcaption className="absolute bottom-3 left-3 bg-fod-fondo/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-fod-humo">
            {t('Illustrative image · real plating may vary')}
          </figcaption>
        </figure>
        <div className="p-6 sm:p-10">
          <p className="font-fod text-lg font-bold italic text-fod-acento">{c.manuscrito ?? t('On the menu')}</p>
          <h3 className="fod-display mt-1 text-fod-h3">{t('Five plates')}</h3>
          <ol className="mt-6">
            {c.platos.map((p, i) => (
              <li key={p} className="flex items-baseline gap-4 border-b border-fod-linea py-3">
                <span className="font-mono text-xs text-fod-acento">0{i + 1}</span>
                <span className="font-fod text-base font-extrabold uppercase">{p}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-4">
            <img
              src="/fotos/fiesta-on-deck/03-comida.webp"
              alt={t('Food served on a real Hispaniola charter')}
              loading="lazy"
              className="size-16 shrink-0 border-2 border-fod-acento object-cover"
            />
            <p className="text-sm text-fod-humo">
              {t('Served on deck during the charter. Allergies or a vegetarian in the group? Tell us when you book.')}
            </p>
          </div>
          <a href="#fod-reserva" className="fod-boton mt-6">
            {t('Build with the Food package')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </Seccion>
  )
}

// ── Banderas (solo Latin) ───────────────────────────────────────────────

export function BanderasFod({ elegidas, onCambiar }: { elegidas: string[]; onCambiar: (c: string[]) => void }) {
  const alternar = (c: string) => onCambiar(elegidas.includes(c) ? elegidas.filter((x) => x !== c) : [...elegidas, c])
  const nombres = elegidas.map((c) => t(BANDERAS_FOD.find((b) => b.codigo === c)?.nombre ?? c))
  return (
    <Seccion id="fod-banderas">
      <CabeceraFod
        eyebrow={t('Represent')}
        linea1={t('Where is')}
        linea2={t('your crew from?')}
        estilo2="marcado"
        intro={t('Tap every flag in your group. They go into your booking so our crew knows who is on board and the mix leans toward your countries.')}
      />
      <div role="group" aria-label={t('Flags of your crew')} className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {BANDERAS_FOD.map((b) => {
          const on = elegidas.includes(b.codigo)
          return (
            <button
              key={b.codigo}
              type="button"
              aria-pressed={on}
              onClick={() => alternar(b.codigo)}
              className={`flex flex-col items-center gap-2 border-2 p-3 transition-transform hover:-translate-y-0.5 ${
                on ? 'fod-sombra-2 border-fod-acento bg-fod-panel' : 'border-fod-linea'
              }`}
            >
              <img src={`/fotos/fiesta-on-deck/banderas/${b.codigo}.svg`} alt="" className="h-8 w-auto" />
              <span className="text-center font-fod text-[0.65rem] font-bold uppercase leading-tight">
                {on ? '✓ ' : ''}
                {t(b.nombre)}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-5 text-fod-humo" aria-live="polite">
        {nombres.length ? (
          <>
            <b className="text-fod-acento">
              {nombres.length} {nombres.length > 1 ? t('flags on board:') : t('flag on board:')}
            </b>{' '}
            {nombres.join(' · ')}. ¡Wepa!
          </>
        ) : (
          t('No flags yet. Tap yours.')
        )}
      </p>
    </Seccion>
  )
}

// ── Celebration Packs ────────────────────────────────────────────────────

export function CelebraFod({ packActual }: { packActual: number }) {
  const [visto, setVisto] = useState<number | null>(null)
  const mostrado = visto ?? Math.max(packActual, 1)
  const pack = PACKS_FOD[mostrado - 1]
  return (
    <Seccion id="fod-celebra">
      <CabeceraFod
        eyebrow={t('Included with bigger parties')}
        linea1={t('Celebrate')}
        linea2={t('bigger.')}
        estilo2="marcado"
        intro={t('The bigger your party, the more comes with it, at no extra cost. The cart unlocks your Celebration Pack as your total grows.')}
      />
      <div className="fod-sombra mt-12 border-2 border-fod-texto bg-fod-panel">
        <div role="tablist" aria-label={t('Celebration packs')} className="grid grid-cols-3 border-b-2 border-fod-texto">
          {PACKS_FOD.map((p) => {
            const sel = p.n === mostrado
            return (
              <button
                key={p.n}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => setVisto(p.n)}
                className={`border-r-2 border-fod-texto px-2 py-4 text-center last:border-r-0 ${sel ? 'bg-fod-acento text-fod-sobre-acento' : ''}`}
              >
                <b className="fod-display block whitespace-nowrap text-base sm:text-3xl">{formatoDinero(p.desde)}</b>
                <small className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wider">
                  {t('Pack')} {p.n}
                  {p.n === 3 ? ' · VIP' : ''}
                </small>
                {packActual >= p.n ? (
                  <i className="mt-1 block font-mono text-[0.6rem] not-italic">
                    {packActual === p.n ? t('✓ In your party') : t('✓ Included')}
                  </i>
                ) : null}
              </button>
            )
          })}
        </div>
        <div role="tabpanel" className="grid gap-6 p-6 sm:p-8 md:grid-cols-[16rem_minmax(0,1fr)]">
          <div>
            <span className="fod-pegatina inline-block px-2 py-0.5 font-mono text-[0.65rem] uppercase">{t(pack.rotulo)}</span>
            <p className="fod-display mt-3 whitespace-nowrap text-4xl text-fod-acento lg:text-5xl">{formatoDinero(pack.desde)}</p>
            <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-wider text-fod-humo">{t('Party total, before discounts')}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-fod-humo">{t(pack.titulo)}</p>
            {pack.items.length ? (
              <ul className="mt-3 space-y-2">
                {pack.items.map((i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fod-acento" />
                    {t(i)}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {pack.opciones.map((o, i) => (
                  <span key={o} className="flex items-center gap-2">
                    {i > 0 ? <em className="font-mono text-xs text-fod-humo">{t('or')}</em> : null}
                    <span className="border-2 border-fod-acento px-3 py-1.5 text-sm font-semibold">{t(o)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-xs text-fod-humo">
        {t('Change the package or the guests in Build your party and the pack updates by itself.')}
      </p>
    </Seccion>
  )
}

// ── Galería ──────────────────────────────────────────────────────────────

export function GaleriaFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const g = fiesta.galeria
  // Rejilla editorial sin huecos: la 1.ª ocupa 2×2 (la aérea / el grupo
  // grande, la que más dice), la 5.ª dos filas y la 7.ª dos columnas. Son 12
  // celdas justas en 4 columnas (escritorio) y en 2 (móvil), con flujo denso.
  const span = (i: number) => (i === 0 ? 'col-span-2 row-span-2' : i === 4 ? 'row-span-2' : i === 6 ? 'col-span-2' : '')
  return (
    <Seccion id="fod-galeria">
      <CabeceraFod
        eyebrow={t('Real charters · no models')}
        linea1={t('This is')}
        linea2={t('the deck.')}
        estilo2="contorno"
        intro={
          <>
            {t('Every photo here comes from real groups on our boats in Punta Cana. Follow more days like these on')}{' '}
            <a
              href={`https://www.instagram.com/${g.instagram}/`}
              target="_blank"
              rel="noopener"
              className="font-semibold text-fod-acento underline"
            >
              @{g.instagram}
            </a>
            .
          </>
        }
      />
      <div className="mt-12 grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4">
        {g.fotos.map((f, i) => (
          <figure
            key={f.foto}
            className={`relative overflow-hidden border-2 border-fod-texto ${span(i)}`}
          >
            <img
              src={`/fotos/fiesta-on-deck/${f.foto}.webp`}
              alt={f.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {f.rotulo ? (
              <figcaption className="fod-pegatina absolute bottom-2 left-2 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase">
                {f.rotulo}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </Seccion>
  )
}

// ── Un día real (solo Afro) ──────────────────────────────────────────────

export function DiaRealFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const d = fiesta.diaReal
  if (!d) return null
  return (
    <Seccion id="fod-dia-real">
      <div className="grid items-center gap-10 md:grid-cols-[20rem_minmax(0,1fr)]">
        <video
          className="fod-marco mx-auto aspect-[9/16] w-64 -rotate-2 bg-fod-panel object-cover md:w-full"
          src={d.video}
          poster={d.cartel}
          controls
          playsInline
          preload="none"
        />
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-fod-acento">
            {d.fecha}
            <span aria-hidden="true" className="h-0.5 w-16 bg-fod-acento" />
          </p>
          {/* Se parte por palabras y no por claves sueltas: en español el orden
              cambia («Mira un día real.»), así que la última palabra —la que va
              marcada— es otra. */}
          {(() => {
            const w = t('Watch a real day.').split(' ')
            return (
              <h2 className="mt-4 text-fod-h2">
                <span className="fod-display block">{w.slice(0, 2).join(' ')}</span>
                <span className="fod-display block">{w.slice(2, -1).join(' ')}</span>
                <span className="fod-display fod-marcado mt-2">{w[w.length - 1]}</span>
              </h2>
            )
          })()}
          <p className="mt-6 max-w-md text-fod-humo">{d.texto}</p>
          <a href="#fod-reserva" className="fod-boton mt-6">
            {t('I want this day')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </Seccion>
  )
}

// ── Habla como local (solo Latin) ───────────────────────────────────────

export function JergaFod({ fiesta }: { fiesta: FiestaOnDeck }) {
  const [vistas, setVistas] = useState<string[]>([])
  if (!fiesta.jerga) return null
  return (
    <Seccion id="fod-jerga">
      <CabeceraFod
        eyebrow={t('Speak deck · a 60-second course')}
        linea1="Habla como"
        linea2="local."
        estilo2="marcado"
        intro={t('Eight words you will hear on board before the first stop. Tap the ones you already know.')}
      />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fiesta.jerga.map((j, i) => {
          const on = vistas.includes(j.palabra)
          const sombra = ['fod-sombra-2', 'fod-sombra', 'fod-sombra-3', 'fod-sombra-4'][i % 4]
          return (
            <button
              key={j.palabra}
              type="button"
              aria-pressed={on}
              onClick={() => setVistas(on ? vistas.filter((v) => v !== j.palabra) : [...vistas, j.palabra])}
              className={`${sombra} flex min-h-36 flex-col justify-between gap-3 border-2 p-5 text-left transition-colors ${
                on ? 'border-fod-acento bg-fod-acento text-fod-sobre-acento' : 'border-fod-texto bg-fod-panel'
              }`}
            >
              <b className={`font-fod text-3xl font-black italic ${on ? '' : 'text-fod-acento'}`}>{j.palabra}</b>
              <span className={`text-sm ${on ? '' : 'text-fod-humo'}`}>{j.significado}</span>
            </button>
          )
        })}
      </div>
    </Seccion>
  )
}

// ── Bueno saber ──────────────────────────────────────────────────────────

export function BuenoSaberFod() {
  return (
    <Seccion id="fod-saber">
      <CabeceraFod
        eyebrow={t('Before you book')}
        linea1={t('Good to')}
        linea2={t('know.')}
        intro={
          <>
            {t('The short version of our policies. Full text on the')}{' '}
            <a href="/legal/cancellation-policy" className="font-semibold text-fod-acento underline">
              {t('cancellation policy')}
            </a>{' '}
            {t('page.')}
          </>
        }
      />
      <div className="mt-12 grid gap-px border-2 border-fod-linea bg-fod-linea sm:grid-cols-2 lg:grid-cols-3">
        {BUENO_SABER_FOD.map((b) => (
          <div key={b.titulo} className="bg-fod-fondo p-6">
            <h3 className="font-fod text-lg font-extrabold uppercase text-fod-acento">{b.titulo}</h3>
            <p className="mt-2 text-sm text-fod-humo">{b.texto}</p>
          </div>
        ))}
      </div>
    </Seccion>
  )
}

// ── Cierre ───────────────────────────────────────────────────────────────

export function CierreFod({ fiesta, desde }: { fiesta: FiestaOnDeck; desde: number }) {
  return (
    <section className="fod-pegatina py-16 sm:py-20">
      <div className="mx-auto flex max-w-contenido flex-col gap-8 px-5 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-fod text-lg font-bold italic">{fiesta.cierre.manuscrito}</p>
          <h2 className="mt-2 text-fod-h2">
            <span className="fod-display block">{fiesta.cierre.titulo[0]}</span>
            <span className="fod-display block">{fiesta.cierre.titulo[1]}</span>
          </h2>
          <p className="mt-4 font-mono text-sm">
            {t('Questions first?')}{' '}
            <a href={`https://wa.me/${WHATSAPP_FOD}`} target="_blank" rel="noopener" className="font-bold underline">
              WhatsApp · {WHATSAPP_FOD_TEXTO}
            </a>
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="font-mono text-xs uppercase tracking-wider">
            {t('Your party from')} {formatoDinero(desde)}
          </span>
          <a href="#fod-reserva" className="fod-boton fod-boton--hueco">
            {t('Build your party')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
