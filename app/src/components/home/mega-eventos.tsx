import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { OCASIONES, WEBS_GRUPO, type Ocasion } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { t } from '@/lib/i18n'

// Megamenú Eventos — mismo patrón que MegaTours (2026-07-17, pedido de
// Samuel: "ya que los eventos los redujimos a 3, haz que tenga el mismo
// patrón de diseño que los tours, mismas cards que el mega menú de tours,
// quitamos ese box a la izquierda con eventos privados"). Con solo 3
// ocasiones (LOS 3 EVENTOS de la web actual), la foto editorial de la
// columna izquierda ("Eventos privados" + "Pedir cotización") ya no aporta
// nada que las propias cards no digan — se retira, y el menú pasa a ser
// SOLO la rejilla de cards: foto grande, nombre, una línea de meta.
//
// 2ª vuelta (mismo día, Samuel: "quita ese footer... y ya que son 3, que el
// ancho del megamenú se adapte para los 3, queda un espacio blanco raro,
// pero ojo no hagas que las cards sean más anchas"): se quita la salida "Ver
// los N eventos →" (con solo 3 cards mostrando ya el total, no llevaba a un
// catálogo más grande) y `xl:grid-cols-4` pasa a `xl:grid-cols-3` — 3
// columnas para 3 ítems, sin celda vacía.
//
// 3ª vuelta (2026-10-22, Samuel tras hablar con Raymond): se SUMAN las 4
// webs de party boat del grupo (WEBS_GRUPO) — los 3 eventos se quedan —, en
// dos filas rotuladas. Primera versión: las 7 iguales (foto 200px, nombre,
// una línea) y la fila de 3 repartida de borde a borde.
//
// 4ª vuelta (2026-10-23, feedback de Samuel sobre esa versión):
//   · «Los 3 eventos privados deben DESTACAR más»: el hueco enorme entre las
//     3 cards repartidas se va. Ahora son 3 columnas FLUIDAS que llenan el
//     ancho con el mismo gap (16px) que abajo — la foto crece de 200 a ~272px
//     y de h-36 a h-44, y el nombre sube a text-base.
//   · «Los party boats no deben sentirse igual de importantes ni la misma
//     cosa»: llevan a OTRAS webs. Pasan a una FRANJA al pie del panel con
//     fondo plano distinto (papel-hueso, a sangre, sin caja ni sombra: el
//     contraste lo da el fondo) y cada web es una FILA: miniatura cuadrada de
//     56px con nombre + ↗ + descripción al lado, en tipografía menor. El
//     rótulo pasa a «Other experiences from our group»: dice lo que son —
//     marcas hermanas, no un apartado más de Hispaniola.
//     Por qué esta y no solo «imagen más pequeña»: con mini-cards (misma forma
//     que arriba pero menores) se siguen leyendo como «más de lo mismo, en
//     pequeño»; la fila con miniatura cambia la FORMA además del tamaño, y la
//     franja de fondo las separa como un bloque aparte — tres señales a la
//     vez (forma, tamaño, fondo) sin añadir cajas ni sombras.
//     La otra opción (mini-cards de 4 columnas con foto apaisada pequeña)
//     queda lista: VARIANTE_GRUPO más abajo; en dev se ve con `?grupo=mini`.
// El panel ya no sale de `w-fit`: lo fija --spacing-mega-eventos-ancho
// (880px, el mismo que tenía y que MegaTours).

/** Card de un evento propio (enlace interno). La comparten el megamenú y la
 *  hoja móvil (menu-movil.tsx). */
// `compacto` (2026-10-23, Samuel): la sub-vista móvil de Eventos usa una
// rejilla de 2 columnas para ahorrar scroll — foto baja, título text-sm.
export function CardOcasion({
  o,
  alto = 'h-52',
  compacto = false,
}: {
  o: Ocasion
  alto?: 'h-52' | 'h-44' | 'h-36' | 'h-32' | 'h-28' | 'h-24'
  compacto?: boolean
}) {
  // El zoom vive en el contenedor con overflow-hidden, no en el <img>
  // suelto — mismo motivo que MegaTours.
  const contenido = (
    <>
      <span className={`block ${alto} overflow-hidden rounded-card bg-papel-hueso`}>
        <img
          src={`/fotos/${o.foto}.webp`}
          alt=""
          aria-hidden="true"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span
        className={`mt-2 block font-display font-semibold leading-tight text-navy transition-colors group-hover:text-aqua-dark ${compacto ? 'text-sm' : 'text-base'}`}
      >
        {o.nombre}
      </span>
      <span className={`block text-xs text-navy-soft ${compacto ? 'mt-0.5' : 'mt-1'}`}>{o.meta}</span>
    </>
  )
  // Bodas y MICE llevan a su landing real; «Eventos y party boat» sigue en el
  // prototipo (formulario del hub) — misma unión por `slug` de siempre.
  // data-mega-item: ver el comentario en item-menu.tsx — marcador que
  // TabsConPaneles (nav-tabs.tsx) anima con stagger al abrir.
  if (o.slug) {
    return (
      <Link to={`/events/${o.slug}`} className="group block" data-mega-item>
        {contenido}
      </Link>
    )
  }
  return (
    <EnlacePrototipo className="group block" data-mega-item>
      {contenido}
    </EnlacePrototipo>
  )
}

// [dev-mode] Variante de la franja de webs del grupo. 'filas' es la elegida;
// 'mini' es la alternativa que Samuel puede pedir: en `npm run dev` se
// previsualiza añadiendo `?grupo=mini` a la URL (en el build no existe).
// Para fijarla en producción, cambiar el valor por defecto de abajo.
type VarianteGrupo = 'filas' | 'mini'
const VARIANTE_GRUPO: VarianteGrupo =
  import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('grupo') === 'mini' // [dev-mode]
    ? 'mini'
    : 'filas'

function NombreExterno({ nombre }: { nombre: string }) {
  return (
    <span className="flex items-start gap-1 font-display text-sm font-semibold leading-tight text-navy transition-colors group-hover:text-aqua-dark">
      {nombre}
      <ArrowUpRight aria-hidden="true" className="mt-px size-3.5 shrink-0 text-navy-soft transition-colors group-hover:text-aqua-dark" />
      <span className="sr-only">{t('(opens in a new tab)')}</span>
    </span>
  )
}

/** Franja de las webs del grupo (enlaces externos). La comparten el megamenú
 *  y la hoja móvil; `className` pone los márgenes negativos que la llevan a
 *  sangre en cada contenedor. */
export function FranjaWebsGrupo({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-papel-hueso ${className}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">
        {t('Other experiences from our group')}
      </p>
      {VARIANTE_GRUPO === 'mini' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WEBS_GRUPO.map((w) => (
            <a key={w.id} href={w.url} target="_blank" rel="noopener" className="group block" data-mega-item>
              <span className="block h-20 overflow-hidden rounded-card bg-papel">
                <img
                  src={`/fotos/${w.foto}.webp`}
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-1.5 block">
                <NombreExterno nombre={w.nombre} />
              </span>
              <span className="mt-0.5 block text-xs text-navy-soft">{w.meta}</span>
            </a>
          ))}
        </div>
      ) : (
        // gap-x-4 = el mismo gap de la fila de eventos, así las dos columnas
        // de filas caen alineadas con la rejilla de arriba. El hover es un
        // cambio de FONDO (al papel del panel), no una sombra.
        <div className="-mx-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          {WEBS_GRUPO.map((w) => (
            <a
              key={w.id}
              href={w.url}
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-papel"
              data-mega-item
            >
              <span className="size-14 shrink-0 overflow-hidden rounded-lg bg-papel">
                <img src={`/fotos/${w.foto}.webp`} alt="" aria-hidden="true" className="size-full object-cover" />
              </span>
              <span className="min-w-0">
                <NombreExterno nombre={w.nombre} />
                <span className="mt-0.5 block text-xs text-navy-soft">{w.meta}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function MegaEventos() {
  return (
    <div className="w-mega-eventos-ancho max-w-[92vw]">
      <div className="p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('Private events')}</p>
        <div className="grid grid-cols-3 gap-4">
          {OCASIONES.map((o) => (
            <CardOcasion key={o.tipo} o={o} />
          ))}
        </div>
      </div>
      <FranjaWebsGrupo className="px-4 pt-3 pb-3" />
    </div>
  )
}
