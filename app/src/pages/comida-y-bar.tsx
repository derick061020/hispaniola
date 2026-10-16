import { Link } from 'react-router-dom'
import {
  Award,
  Beer,
  ChefHat,
  CookingPot,
  CupSoda,
  Flame,
  GlassWater,
  Martini,
  Palmtree,
  Salad,
  Sparkles,
  Wine,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Footer } from '@/components/home/footer'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Meta } from '@/components/seo/meta'
import { COMIDA_Y_BAR, MOSTRAR_NIVELES_BAR_EVENTOS } from '@/data/comida-y-bar'
import { BARRAS_EVENTO } from '@/data/eventos'
import { FICHAS } from '@/data/tours'
import { t } from '@/lib/i18n'

// Página «Food & Bar» — el porqué y las fuentes de cada texto, en
// data/comida-y-bar.ts.
//
// ESTRUCTURA tomada de la Food & Bar de Party Boat (intro → galería → menús →
// open bar), pero con las piezas de ESTA web: HeroInterna + Footer, tokens,
// rounded-card, ring-linea, coral solo en CTA/precio y aqua con cuentagotas.
// El bloque de Open Bar va sobre navy para que se distinga de la comida sin
// inventar una paleta nueva (el navy ya es el del footer).
//
// MÓVIL PRIMERO: nada de tablas. Las cartas se apilan, la galería es un carril
// con scroll-snap que deja ver media foto de la siguiente (así se nota que hay
// más) y todas las imágenes bajo el hero van con loading="lazy".
//
// SEO: un H1 (el del hero), H2 por sección y H3 por menú/bebida. Los platos son
// TEXTO, no están dentro de las fotos, y cada foto lleva su alt.

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

// Kid's Meal: solo el nombre (ver data/comida-y-bar.ts).
const KIDS = FICHAS['coral-quest'].menuPremium?.find((p) => p.soloNinos)

type OtroMenu = {
  id: string
  titulo: string
  donde: string
  texto?: string
  items: string[]
  foto?: { src: string; alt: string }
  extra?: string
}

function otrosMenus(): OtroMenu[] {
  const tresHoras = carta('3h')
  const buffetPinchos = carta('21+')
  return [
    {
      id: 'light',
      titulo: t('Light Menu'),
      donde: t('Semi-Private Light · Snorkel Lovers Light'),
      items: (ESCAPE.menuLight ?? []).map((p) => (p.desc ? `${p.nombre} · ${p.desc}` : p.nombre)),
      foto: { src: '/fotos/plato-fish-bodegon.webp', alt: t('Grilled fish fillet with potatoes and vegetables') },
    },
    {
      id: '3h',
      titulo: tresHoras?.titulo ?? '',
      donde: t('3-hour private charters'),
      texto: tresHoras?.texto,
      items: (tresHoras?.platos ?? []).map((p) => p.nombre),
      // La misma foto que usa la carta de 3 h en la ficha del charter: las de
      // eventos con brochetas llevan langosta, y la langosta no va en el
      // charter. ⚠️ Pendiente la foto real de las brochetas (Miguel).
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
        .map((p) => (p.desc ? `${p.nombre} · ${p.desc}` : p.nombre)),
      foto: { src: '/fotos/ev-corporate-menu-14.webp', alt: t('Grilled lobster on the buffet') },
      extra: SAONA.menuBuffet?.addOn
        ? `${SAONA.menuBuffet.addOn.nombre}: +US$ ${SAONA.menuBuffet.addOn.precio} ${t('per person')}`
        : undefined,
    },
  ]
}

function Eyebrow({ children, claro = false }: { children: string; claro?: boolean }) {
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-[0.2em] ${claro ? 'text-aqua-claro' : 'text-aqua-dark'}`}
    >
      {children}
    </p>
  )
}

export function ComidaYBarPage() {
  const platos = (ESCAPE.menuPremium ?? []).filter((p) => !p.soloNinos)
  const cocina = CHARTER.menuCharter?.cocina ?? []

  return (
    <div>
      <Meta titulo={C.meta.titulo} descripcion={C.meta.descripcion} ruta="/food-and-bar" />
      <HeroInterna ctaHref="/tours" imagen={C.hero.imagen}>
        <CabeceraInterna eyebrow={C.hero.eyebrow} titulo={C.hero.titulo} lead={C.hero.lead} />
        <nav aria-label={t('On this page')} className="mt-6 flex flex-wrap gap-2">
          {C.anclas.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
            >
              {a.nombre}
            </a>
          ))}
        </nav>
      </HeroInterna>

      {/* ── 1 · Floating Kitchen ─────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-contenido gap-8 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:items-center lg:py-16">
        <div>
          <Eyebrow>{C.cocina.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">
            {C.cocina.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-sub">{C.cocina.texto}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {cocina.map((c) => {
              const Icono = ICONO_COCINA[c.id] ?? Sparkles
              return (
                <li key={c.id} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                    <Icono className="size-4" aria-hidden="true" />
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
        <div className="grid grid-cols-2 gap-3">
          <img
            src={C.cocina.imagen.src}
            alt={C.cocina.imagen.alt}
            loading="lazy"
            decoding="async"
            className="col-span-2 aspect-[4/3] w-full rounded-card object-cover"
          />
          <img
            src={C.cocina.imagenPlataforma.src}
            alt={C.cocina.imagenPlataforma.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-card object-cover"
          />
          <img
            src="/fotos/ev-corporate-menu-3.webp"
            alt={t('Grilled lobster, fish and calamari plated on board')}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-card object-cover"
          />
        </div>
      </section>

      {/* Carril de fotos: scroll-snap, sin librería. El ancho de cada foto deja
          asomar la siguiente en móvil — esa media foto es la pista de que hay
          más, sin flechas ni puntos. */}
      <div className="pb-4">
        <ul
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:px-10 [scrollbar-width:thin]"
          aria-label={t('Photos from our floating kitchen')}
        >
          {C.galeria.map((f) => (
            <li key={f.src} className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[24%]">
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-card object-cover"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ── 2 · Menús ─────────────────────────────────────────────────────── */}
      <section id="menus" className="mx-auto max-w-contenido scroll-mt-sticky-top px-5 py-12 sm:px-10 lg:py-16">
        <Eyebrow>{C.menus.eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{C.menus.titulo}</h2>
        <p className="mt-3 max-w-2xl text-base text-navy-sub">{C.menus.texto}</p>

        {/* El Premium, grande: es el que más tours sirven y el que tiene foto
            de cada plato. */}
        <div className="mt-8 rounded-card bg-papel-hueso p-5 ring-1 ring-linea sm:p-6">
          <h3 className="font-display text-h3 font-semibold text-navy">{C.menus.premiumTitulo}</h3>
          <p className="mt-1 text-sm text-navy-soft">{C.menus.premiumDonde}</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {platos.map((p) => (
              <li key={p.nombre} className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
                {p.foto ? (
                  <img
                    src={`/fotos/${p.foto}.webp`}
                    alt={p.nombre}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <div className="p-3">
                  <p className="text-sm font-semibold text-navy">{p.nombre}</p>
                  {p.desc ? <p className="text-xs text-navy-sub">{p.desc}</p> : null}
                </div>
              </li>
            ))}
            {KIDS ? (
              <li className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
                {KIDS.foto ? (
                  <img
                    src={`/fotos/${KIDS.foto}.webp`}
                    alt={KIDS.nombre}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <div className="p-3">
                  <p className="text-sm font-semibold text-navy">{KIDS.nombre}</p>
                  <p className="text-xs text-navy-sub">{C.menus.ninos}</p>
                </div>
              </li>
            ) : null}
          </ul>
        </div>

        <h3 className="mt-10 font-display text-h3 font-semibold text-navy">{C.menus.otrosTitulo}</h3>
        {/* En móvil, carril deslizable (asoma la siguiente card); desde sm,
            rejilla. Apiladas, las cuatro hacían una columna de 2.000 px. */}
        <ul className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {otrosMenus().map((m) => (
            <li
              key={m.id}
              className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-card ring-1 ring-linea sm:w-auto"
            >
              {m.foto ? (
                <img
                  src={m.foto.src}
                  alt={m.foto.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-4">
                <h4 className="font-display text-base font-semibold text-navy">{m.titulo}</h4>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-aqua-dark">{m.donde}</p>
                {m.texto ? <p className="mt-2 text-sm text-navy-sub">{m.texto}</p> : null}
                {m.items.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm text-navy">
                    {m.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden="true" className="text-aqua">•</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {m.extra ? <p className="mt-3 text-sm font-semibold text-coral">{m.extra}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3 · Open Bar ──────────────────────────────────────────────────── */}
      <section id="open-bar" className="scroll-mt-sticky-top bg-navy">
        <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
          <Eyebrow claro>{C.bar.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-h2 font-semibold text-white">{C.bar.titulo}</h2>
          <p className="mt-3 max-w-2xl text-base text-white/80">{C.bar.texto}</p>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {C.bar.bebidas.map((b) => {
              const Icono = ICONO_BEBIDA[b.id] ?? GlassWater
              return (
                <li key={b.id} className="rounded-card bg-white/5 p-4 ring-1 ring-white/10">
                  <Icono className="size-5 text-aqua-claro" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-semibold text-white">{b.nombre}</h3>
                  {b.nota ? <p className="text-xs text-white/60">{b.nota}</p> : null}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {C.bar.momentos.map((m) => (
              <article key={m.id} className="overflow-hidden rounded-card bg-white/5 ring-1 ring-white/10">
                {m.imagen ? (
                  <img
                    src={m.imagen.src}
                    alt={m.imagen.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[16/9] place-items-center bg-white/5">
                    <Palmtree className="size-12 text-aqua-claro" aria-hidden="true" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-white">{m.titulo}</h3>
                  <p className="mt-2 text-sm text-white/75">{m.texto}</p>
                </div>
              </article>
            ))}
          </div>

          {MOSTRAR_NIVELES_BAR_EVENTOS ? (
            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="font-display text-h3 font-semibold text-white">{C.bar.eventosTitulo}</h3>
              <p className="mt-2 max-w-2xl text-sm text-white/75">{C.bar.eventosTexto}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                {BARRAS_EVENTO.map((b) => (
                  <li
                    key={b.id}
                    className={[
                      'flex flex-col rounded-card p-5',
                      b.destacado ? 'bg-white/10 ring-1 ring-aqua-claro' : 'bg-white/5 ring-1 ring-white/10',
                    ].join(' ')}
                  >
                    {/* El nombre del nivel es una marca: no se traduce («Caribe»). */}
                    <h4 className="font-display text-base font-semibold text-white">{b.nombre}</h4>
                    {/* «Included» suelto ya está en el diccionario como «Qué
                        incluye» (un encabezado): aquí es un precio. */}
                    <p className="mt-2 font-display text-h3 font-semibold text-coral">
                      {b.precio === 'Included' ? t('Included in every package') : b.precio}
                    </p>
                    {b.precio === 'Included' ? null : (
                      <p className="text-xs uppercase tracking-wide text-white/60">{t(b.precioNota)}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{t(b.texto)}</p>
                  </li>
                ))}
              </ul>
              <Link
                to="/events"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-aqua-tint"
              >
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
