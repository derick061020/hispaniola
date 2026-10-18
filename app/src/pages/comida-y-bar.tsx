import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Beer,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  CupSoda,
  Flame,
  GlassWater,
  Martini,
  Palmtree,
  Salad,
  Sparkles,
  Wine,
  X,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Footer } from '@/components/home/footer'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Meta } from '@/components/seo/meta'
import { COMIDA_Y_BAR, MOSTRAR_NIVELES_BAR_EVENTOS, NIVELES_BAR } from '@/data/comida-y-bar'
import { BARRAS_EVENTO } from '@/data/eventos'
import { FICHAS } from '@/data/tours'
import { t } from '@/lib/i18n'

// Página «Food & Bar» — el porqué y las fuentes de cada texto, en
// data/comida-y-bar.ts.
//
// [2026-10-18, v2, Marketing: «debe ir integrado, pero resaltado, tal como lo
// mostré en el ejemplo, con su nuevo menú y el Open Bar, mostrando todo… no
// quedó a nivel visual y de experiencia de usuario como necesitamos»]
//   · INTEGRADO Y RESALTADO: pestaña propia en el menú principal (nav-tabs y
//     menú móvil), como en Party Boat, no escondida dentro de «Nosotros».
//   · MOSTRANDO TODO, COMO LA REFERENCIA: hero con cifras, galería en rejilla
//     con visor, cada menú en una tarjeta grande (foto + qué lleva + dónde se
//     sirve) y los niveles de barra en tarjetas paralelas con las mismas
//     cabeceras («Bottles», «Wine», «Cocktails») para compararlos sin leer.
//   · CON EL SISTEMA DE HISPANIOLA: HeroInterna + Footer, tokens, rounded-card,
//     coral solo en precio/CTA. El Open Bar va sobre navy (el del footer) para
//     distinguirse de la comida sin inventar una paleta.
//
// MÓVIL PRIMERO: nada de tablas; las tarjetas se apilan, la rejilla de fotos
// pasa a 2 columnas y el visor se maneja con flechas, toques o Esc.
// SEO: un H1 (hero), H2 por bloque, H3 por menú/nivel; los platos son texto.

const C = COMIDA_Y_BAR

const ICONO_COCINA: Record<string, ComponentType<{ className?: string }>> = {
  ingredientes: Award,
  'show-cooking': ChefHat,
  'desde-cero': CookingPot,
  'al-momento': Flame,
  dietas: Salad,
}

const ICONO_BEBIDA: Record<string, ComponentType<{ className?: string }>> = {
  cerveza: Beer,
  ron: Wine,
  vodka: Martini,
  tequila: Martini,
  jugos: CupSoda,
  refrescos: CupSoda,
  agua: GlassWater,
}

const ESCAPE = FICHAS['caribbean-escape']
const CHARTER = FICHAS['private-charter']
const SAONA = FICHAS['saona-island']
const carta = (id: '3h' | '21+') => CHARTER.menuCharter?.cartas.find((c) => c.id === id)
const KIDS = FICHAS['coral-quest'].menuPremium?.find((p) => p.soloNinos)

type Menu = {
  id: string
  titulo: string
  donde: string
  texto?: string
  items: { nombre: string; desc?: string }[]
  foto: { src: string; alt: string }
  extra?: string
  platosConFoto?: boolean
}

function menus(): Menu[] {
  const tresHoras = carta('3h')
  const buffetPinchos = carta('21+')
  const premium = (ESCAPE.menuPremium ?? []).filter((p) => !p.soloNinos)
  return [
    {
      id: 'premium',
      titulo: C.menus.premiumTitulo,
      donde: C.menus.premiumDonde,
      // WEBSITE-TOURS pág. 17, el copy aprobado de la carta de 7 platos.
      texto: CHARTER.menuCharter?.cartas.find((c) => c.id === '4h')?.texto,
      items: premium.map((p) => ({ nombre: p.nombre, desc: p.desc })),
      foto: { src: '/fotos/ev-corporate-menu-1.webp', alt: t('Grilled lobster, fish steak and calamari on a plate') },
      platosConFoto: true,
    },
    {
      id: 'light',
      titulo: t('Light Menu'),
      donde: t('Semi-Private Light · Snorkel Lovers Light'),
      items: (ESCAPE.menuLight ?? []).map((p) => ({ nombre: p.nombre, desc: p.desc })),
      foto: { src: '/fotos/plato-fish-bodegon.webp', alt: t('Grilled fish fillet with potatoes and vegetables') },
    },
    {
      id: '3h',
      titulo: tresHoras?.titulo ?? '',
      donde: t('3-hour private charters'),
      texto: tresHoras?.texto,
      items: (tresHoras?.platos ?? []).map((p) => ({ nombre: p.nombre })),
      // ⚠️ Pendiente la foto real de las brochetas (Miguel). Las de eventos
      // llevan langosta, que no va en el charter.
      foto: { src: '/fotos/plato-chicken-bodegon.webp', alt: t('Grilled chicken breast') },
    },
    {
      id: '21+',
      titulo: buffetPinchos?.titulo ?? '',
      donde: t('Private charters · groups of 20+'),
      texto: buffetPinchos?.texto,
      items: [],
      foto: { src: '/fotos/ev-corporate-menu-12.webp', alt: t('Guests serving themselves at the buffet on deck') },
    },
    {
      id: 'saona',
      titulo: t('Beach buffet'),
      donde: t('Saona Island · served on the island'),
      // Sin «Tropical fruit»: no está en el tarifario del cliente.
      items: (SAONA.menuBuffet?.platos ?? [])
        .filter((p) => p.nombre !== 'Tropical fruit' && p.nombre !== t('Tropical fruit'))
        .map((p) => ({ nombre: p.nombre, desc: p.desc })),
      foto: { src: '/fotos/ev-corporate-menu-14.webp', alt: t('Grilled lobster on the buffet') },
      extra: SAONA.menuBuffet?.addOn
        ? `${SAONA.menuBuffet.addOn.nombre}: +US$ ${SAONA.menuBuffet.addOn.precio} ${t('per person')}`
        : undefined,
    },
  ]
}

function Eyebrow({ children, claro = false }: { children: string; claro?: boolean }) {
  return (
    <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${claro ? 'text-aqua-claro' : 'text-aqua-dark'}`}>
      {children}
    </p>
  )
}

// Visor de la galería: sin librería. Flechas del teclado, Esc y los botones.
function Visor({ fotos, indice, onCerrar, onIr }: {
  fotos: { src: string; alt: string }[]
  indice: number
  onCerrar: () => void
  onIr: (i: number) => void
}) {
  const ir = useCallback((d: number) => onIr((indice + d + fotos.length) % fotos.length), [indice, fotos.length, onIr])
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [ir, onCerrar])
  const f = fotos[indice]
  return (
    <div role="dialog" aria-modal="true" aria-label={f.alt}
         className="fixed inset-0 z-50 grid place-items-center bg-navy/90 p-4" onClick={onCerrar}>
      <img src={f.src} alt={f.alt} className="max-h-[80vh] max-w-full rounded-card object-contain"
           onClick={(e) => e.stopPropagation()} />
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-white/85">{f.alt}</p>
      <button type="button" aria-label={t('Close')} onClick={onCerrar}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
        <X className="size-5" aria-hidden="true" />
      </button>
      <button type="button" aria-label={t('Previous')} onClick={(e) => { e.stopPropagation(); ir(-1) }}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button type="button" aria-label={t('Next')} onClick={(e) => { e.stopPropagation(); ir(1) }}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ComidaYBarPage() {
  const premium = (ESCAPE.menuPremium ?? []).filter((p) => !p.soloNinos)
  const cocina = CHARTER.menuCharter?.cocina ?? []
  const [visor, setVisor] = useState<number | null>(null)

  return (
    <div>
      <Meta titulo={C.meta.titulo} descripcion={C.meta.descripcion} ruta="/food-and-bar" />
      <HeroInterna ctaHref="/tours" imagen={C.hero.imagen}>
        <CabeceraInterna eyebrow={C.hero.eyebrow} titulo={C.hero.titulo} lead={C.hero.lead} />
        <nav aria-label={t('On this page')} className="mt-6 flex flex-wrap gap-2">
          {C.anclas.map((a, i) => (
            <a key={a.id} href={`#${a.id}`}
               className={i === 0
                 ? 'rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-dark'
                 : 'rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/25'}>
              {a.id === 'menus' ? t('See the menus') : t('See the Open Bar')}
            </a>
          ))}
        </nav>
        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
          {C.hero.cifras.map((c) => (
            <div key={c.texto} className="rounded-card bg-white/10 px-3 py-3 ring-1 ring-white/20 backdrop-blur-sm">
              <dt className="sr-only">{c.texto}</dt>
              <dd>
                <span className="block font-display text-2xl font-semibold text-white sm:text-3xl">{c.valor}</span>
                <span className="mt-0.5 block text-xs leading-snug text-white/80">{c.texto}</span>
              </dd>
            </div>
          ))}
        </dl>
      </HeroInterna>

      {/* ── 1 · Floating Kitchen ─────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-contenido gap-10 px-5 py-14 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
        <div className="relative">
          <img src={C.cocina.imagen.src} alt={C.cocina.imagen.alt} loading="lazy" decoding="async"
               className="aspect-[4/3] w-full rounded-card object-cover shadow-card" />
          <img src={C.cocina.imagenPlataforma.src} alt={C.cocina.imagenPlataforma.alt} loading="lazy" decoding="async"
               className="absolute -bottom-6 -right-2 hidden aspect-[4/3] w-2/5 rounded-card object-cover ring-4 ring-papel shadow-card sm:block" />
        </div>
        <div>
          <Eyebrow>{C.cocina.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">{C.cocina.titulo}</h2>
          <p className="mt-4 text-base leading-relaxed text-navy-sub">{C.cocina.texto}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {cocina.map((c) => {
              const Icono = ICONO_COCINA[c.id] ?? Sparkles
              return (
                <li key={c.id} className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                    <Icono className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{c.titulo}</h3>
                    <p className="text-sm text-navy-sub">{c.texto}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Galería en rejilla con visor: lo que sale de la cocina. */}
      <section aria-labelledby="galeria-titulo" className="bg-papel-hueso py-12 lg:py-16">
        <div className="mx-auto max-w-contenido px-5 sm:px-10">
          <h2 id="galeria-titulo" className="font-display text-h3 font-semibold text-navy">
            {t('Straight from the Floating Kitchen')}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {C.galeria.map((f, i) => (
              <li key={f.src} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <button type="button" onClick={() => setVisor(i)}
                        className="group block h-full w-full overflow-hidden rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua">
                  <img src={f.src} alt={f.alt} loading="lazy" decoding="async"
                       className="h-full w-full object-cover transition duration-300 group-hover:scale-105 aspect-[4/3]" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {visor !== null ? <Visor fotos={C.galeria} indice={visor} onCerrar={() => setVisor(null)} onIr={setVisor} /> : null}

      {/* ── 2 · Menús ─────────────────────────────────────────────────────── */}
      <section id="menus" className="mx-auto max-w-contenido scroll-mt-sticky-top px-5 py-14 sm:px-10 lg:py-20">
        <Eyebrow>{C.menus.eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{C.menus.titulo}</h2>
        <p className="mt-3 max-w-2xl text-base text-navy-sub">{C.menus.texto}</p>

        <div className="mt-10 space-y-8">
          {menus().map((m, i) => (
            <article key={m.id}
                     className="grid overflow-hidden rounded-card bg-papel ring-1 ring-linea shadow-card lg:grid-cols-2">
              <img src={m.foto.src} alt={m.foto.alt} loading="lazy" decoding="async"
                   className={`aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full lg:max-h-[460px] lg:min-h-[340px] ${i % 2 ? 'lg:order-2' : ''}`} />
              <div className="flex flex-col p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">{m.donde}</p>
                <h3 className="mt-2 font-display text-h3 font-semibold text-navy">{m.titulo}</h3>
                {m.texto ? <p className="mt-2 text-sm leading-relaxed text-navy-sub">{m.texto}</p> : null}
                {m.platosConFoto ? (
                  <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {premium.map((p) => (
                      <li key={p.nombre}>
                        {p.foto ? (
                          <img src={`/fotos/${p.foto}.webp`} alt={p.nombre} loading="lazy" decoding="async"
                               className="aspect-square w-full rounded-card bg-papel-hueso object-cover" />
                        ) : null}
                        <p className="mt-1.5 text-xs font-semibold text-navy">{p.nombre}</p>
                        {p.desc ? <p className="text-[11px] leading-snug text-navy-soft">{p.desc}</p> : null}
                      </li>
                    ))}
                    {KIDS ? (
                      <li>
                        {KIDS.foto ? (
                          <img src={`/fotos/${KIDS.foto}.webp`} alt={KIDS.nombre} loading="lazy" decoding="async"
                               className="aspect-square w-full rounded-card bg-papel-hueso object-cover" />
                        ) : null}
                        <p className="mt-1.5 text-xs font-semibold text-navy">{KIDS.nombre}</p>
                        <p className="text-[11px] leading-snug text-navy-soft">{C.menus.ninos}</p>
                      </li>
                    ) : null}
                  </ul>
                ) : m.items.length ? (
                  <ul className="mt-5 divide-y divide-linea rounded-card ring-1 ring-linea">
                    {m.items.map((it) => (
                      <li key={it.nombre} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                        <span className="text-sm font-semibold text-navy">{it.nombre}</span>
                        {it.desc ? <span className="text-right text-xs text-navy-sub">{it.desc}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {m.extra ? <p className="mt-4 text-sm font-semibold text-coral">{m.extra}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 3 · Open Bar ──────────────────────────────────────────────────── */}
      <section id="open-bar" className="scroll-mt-sticky-top bg-navy">
        <div className="mx-auto max-w-contenido px-5 py-14 sm:px-10 lg:py-20">
          <Eyebrow claro>{C.bar.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-h2 font-semibold text-white">{C.bar.titulo}</h2>
          <p className="mt-3 max-w-2xl text-base text-white/80">{C.bar.texto}</p>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {C.bar.bebidas.map((b) => {
              const Icono = ICONO_BEBIDA[b.id] ?? GlassWater
              return (
                <li key={b.id} className="rounded-card bg-white/5 p-4 ring-1 ring-white/10">
                  <Icono className="size-6 text-aqua-claro" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-semibold text-white">{b.nombre}</h3>
                  {b.nota ? <p className="text-xs text-white/60">{b.nota}</p> : null}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {C.bar.momentos.map((m) => (
              <article key={m.id} className="relative overflow-hidden rounded-card ring-1 ring-white/10">
                {m.imagen ? (
                  <img src={m.imagen.src} alt={m.imagen.alt} loading="lazy" decoding="async"
                       className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="grid h-28 place-items-center bg-white/5 sm:h-40">
                    <Palmtree className="size-12 text-aqua-claro" aria-hidden="true" />
                  </div>
                )}
                <div className={m.imagen
                  ? 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/80 to-transparent p-5 pt-16'
                  : 'p-5'}>
                  <h3 className="font-display text-base font-semibold text-white">{m.titulo}</h3>
                  <p className="mt-1 text-sm text-white/80">{m.texto}</p>
                </div>
              </article>
            ))}
          </div>

          {MOSTRAR_NIVELES_BAR_EVENTOS ? (
            <div className="mt-14 border-t border-white/10 pt-12">
              <h3 className="font-display text-h3 font-semibold text-white">{C.bar.eventosTitulo}</h3>
              <p className="mt-2 max-w-2xl text-sm text-white/75">{C.bar.eventosTexto}</p>
              <ul className="mt-6 grid gap-4 lg:grid-cols-3">
                {BARRAS_EVENTO.map((b) => {
                  const nivel = NIVELES_BAR.find((n) => n.id === b.id)
                  return (
                    <li key={b.id}
                        className={['flex flex-col rounded-card p-6',
                          b.destacado ? 'bg-white text-navy ring-2 ring-aqua-claro' : 'bg-white/5 ring-1 ring-white/10'].join(' ')}>
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className={`font-display text-lg font-semibold ${b.destacado ? 'text-navy' : 'text-white'}`}>{b.nombre}</h4>
                        {b.destacado ? (
                          <span className="rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-semibold text-aqua-dark">{t('Top shelf')}</span>
                        ) : null}
                      </div>
                      <p className="mt-2 font-display text-h3 font-semibold text-coral">
                        {b.precio === 'Included' ? t('Included in every package') : b.precio}
                        {b.precio === 'Included' ? null : (
                          <span className={`ml-1 text-xs font-medium uppercase tracking-wide ${b.destacado ? 'text-navy-soft' : 'text-white/60'}`}>
                            {t(b.precioNota)}
                          </span>
                        )}
                      </p>
                      <div className="mt-4 space-y-4">
                        {nivel?.grupos.map((g) => (
                          <div key={g.titulo}>
                            <p className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${b.destacado ? 'text-aqua-dark' : 'text-aqua-claro'}`}>{g.titulo}</p>
                            <ul className="mt-1.5 flex flex-wrap gap-1.5">
                              {g.items.map((it) => (
                                <li key={it}
                                    className={`rounded-full px-2.5 py-1 text-xs ${b.destacado ? 'bg-papel-hueso text-navy ring-1 ring-linea' : 'bg-white/10 text-white'}`}>
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Link to="/events"
                    className="mt-8 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark">
                {C.bar.eventosCta}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  )
}
