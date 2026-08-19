import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TICKER_ITEMS, formatoDinero, type TickerItem, type TickerTour } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useTickerDock } from './use-ticker-dock'
import { t } from '@/lib/i18n'

// Ticker del hero (v3) — sustituye a la baraja de v2 (app/PLAN-v3.md §7).
// Los 4 tours + los 3 eventos desfilan en loop infinito por el pie del
// hero. Las cards de TOUR llevan a su ficha real (/tours/:slug); las de
// ocasión siguen en el prototipo. Hover "dock" (§10): las
// cards cercanas al puntero crecen sobre una curva continua — ver
// use-ticker-dock.ts.
//
// ⚠️ Para el traspaso a Figma (playbook animaciones-a-figma): loop infinito
// → componente interactivo (variante A: pista en x=0: variante B: pista en
// x=-50%) + Smart Animate Linear, duración = --ticker-duracion. El dock no
// tiene función continua en Figma: se congela en 3 variantes de escala
// (§10.7), muestreadas con ?dev-dock=activo.
export function TickerHero() {
  const [estadoDev, setEstadoDev] = useState<'pausado' | 'estatico' | null>(null)
  const [dockForzado, setDockForzado] = useState(false)
  // [dev-mode] ver src/dev/dev-registry.ts
  useDevFlag('dev-ticker', (v) => {
    if (v === 'pausado' || v === 'estatico') setEstadoDev(v)
  })
  useDevFlag('dev-dock', (v) => {
    if (v === 'activo') setDockForzado(true)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const tienePunteroFino = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  const estatico = estadoDev === 'estatico' || reducirMovimiento
  // Frame estático (pista congelada) para que el dock se pueda demostrar sin
  // depender de que el loop esté en marcha — igual que ?dev-ticker=pausado.
  const pistaPausada = estadoDev === 'pausado' || dockForzado

  const wrapperRef = useRef<HTMLDivElement>(null)
  // Trampa №4 (§10.3): sin dock en estático/reduced-motion/táctil — no hay
  // puntero real que seguir, o los centros de las cards cambian sin aviso.
  useTickerDock(wrapperRef, { activo: !estatico && (dockForzado || tienePunteroFino), forzado: dockForzado })

  return (
    <div ref={wrapperRef} className={`ticker-wrapper ${estatico ? 'ticker-wrapper--estatico' : ''}`}>
      <div className={`ticker-pista ${pistaPausada ? 'ticker-pista--pausada' : ''}`}>
        {TICKER_ITEMS.map((item) => (
          <TickerCard key={item.id} item={item} />
        ))}
        {/* Segunda copia para el loop del -50%: oculta a lectores de pantalla
            y sin tab-stops propios (PLAN-v3.md §7.3). Si es estático
            (reduced-motion o ?dev-ticker=estatico) no hace falta duplicar. */}
        {!estatico
          ? TICKER_ITEMS.map((item) => <TickerCard key={`dup-${item.id}`} item={item} oculto />)
          : null}
      </div>
    </div>
  )
}

function TickerCard({ item, oculto = false }: { item: TickerItem; oculto?: boolean }) {
  const clases =
    'ticker-card flex h-ticker-alto w-ticker-ancho shrink-0 items-center gap-3 rounded-card bg-papel p-2 pr-4 shadow-card'
  const contenido = (
    <>
      <img src={`/fotos/${item.foto}.webp`} alt="" className="aspect-square h-full shrink-0 rounded-lg object-cover" />
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-navy">{item.nombre}</p>
        {item.tipo === 'tour' ? <MetaTour item={item} /> : <ChipOcasion />}
      </div>
    </>
  )

  // Las especies del ticker no van al mismo sitio: el TOUR tiene ficha real
  // (/tours/:slug), y de las ocasiones, Bodas y MICE tienen ya su landing
  // (/eventos/:slug) — «Eventos y party boat» sigue en el prototipo (su destino
  // es el formulario del hub de eventos, fuera de este build). La unión
  // discriminada del dato lo decide sola.
  if (item.tipo === 'tour') {
    return (
      <Link to={`/tours/${item.id}`} className={clases} aria-hidden={oculto || undefined} tabIndex={oculto ? -1 : undefined}>
        {contenido}
      </Link>
    )
  }

  if (item.slug) {
    return (
      <Link
        to={`/events/${item.slug}`}
        className={clases}
        aria-hidden={oculto || undefined}
        tabIndex={oculto ? -1 : undefined}
      >
        {contenido}
      </Link>
    )
  }

  return (
    <EnlacePrototipo className={clases} aria-hidden={oculto || undefined} tabIndex={oculto ? -1 : undefined}>
      {contenido}
    </EnlacePrototipo>
  )
}

// El tour va liderado por el PRECIO (único dato de compra) en navy semibold;
// duración y aforo van detrás en soft. El aforo es el dato que de verdad
// distingue un tour de otro y además es la promesa de marca (la cinta de stats
// dice "≤35% de la capacidad del barco").
function MetaTour({ item }: { item: TickerTour }) {
  const secundarios = [item.duracion, item.maxPax !== null ? `max. ${item.maxPax}` : null].filter(
    (dato): dato is string => dato !== null,
  )
  // first-letter:uppercase — Isla Saona no tiene precio y arranca la línea con
  // su duración ("día completo"); el dato se queda tal cual está en datos.js y
  // la mayúscula la pone la presentación.
  return (
    <p className="mt-0.5 truncate text-xs text-navy-soft first-letter:uppercase">
      {item.precioDesde !== null ? (
        <>
          {t('From')}{' '}<span className="font-semibold text-navy">{formatoDinero(item.precioDesde)}</span> ·{' '}
        </>
      ) : null}
      {secundarios.join(' · ')}
    </p>
  )
}

// La ocasión no tiene precio publicado (todas se cotizan): en lugar de un dato
// inventado, un chip de CATEGORÍA en aqua — el único punto de color de la card,
// y el contraste que separa las dos especies de un vistazo en la pista (número
// fuerte = tour, chip aqua = ocasión). Que se repita en los 3 es correcto: un
// chip de categoría AGRUPA. Lo que no valdría es repetir una métrica por-card
// idéntica (los 4 tours comparten rating 4.9) fingiendo que informa de cada una.
function ChipOcasion() {
  return (
    <span className="mt-1 inline-flex rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-medium text-aqua-dark">
      {t('Private event')}
    </span>
  )
}
