import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { nombreTour, type MenuComida } from '@/components/comida-y-bar/menus-datos'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { t } from '@/lib/i18n'

// LAS PIEZAS COMUNES DE LAS TARJETAS COMPARABLES (menús de tours y menús de
// eventos).
//
// [2026-10-22, Samuel, tras releer el encargo de Marketing] Marketing no pidió
// los platos uno a uno: pidió que CADA MENÚ tenga «una fotografía clara,
// nombre y contenido correspondiente», que se distingan fácilmente y que se
// puedan comparar sin leer demasiado, como los paquetes de Party Boat. Por eso
// los dos bloques son 4 tarjetas IGUALES: misma altura de foto y las mismas
// cuatro zonas (foto · nombre · qué incluye · dónde se sirve / precio).
//
// CÓMO SE ALINEAN: la rejilla (`.comida3-tm-rejilla`) define las cuatro filas y
// cada tarjeta es un SUBGRID de ellas (comida-y-bar-v3.css). Así la zona «qué
// incluye» de las cuatro tarjetas mide lo que mide la más larga y el pie queda
// a la misma altura, sin fijar alturas a mano.
//
// MÓVIL: carrusel deslizable (scroll-snap) con la siguiente tarjeta asomando.
// Apiladas, cuatro tarjetas con listas son una columna interminable en la que
// no se puede comparar; en carrusel, cada una cabe en pantalla y el borde de la
// siguiente avisa de que hay más. Mismo subgrid: también alinean entre sí.

/** Rótulo diminuto de zona («Includes», «Served on»). */
export function RotuloZona({ children, oscuro = false }: { children: ReactNode; oscuro?: boolean }) {
  return (
    <p
      className={`text-eyebrow font-semibold uppercase tracking-[0.14em] ${oscuro ? 'text-sobre-navy-suave' : 'text-navy-soft'}`}
    >
      {children}
    </p>
  )
}

/** Pega la última palabra a la anterior con un espacio no separable: ni
 *  «Menu» ni «Package» se quedan solas en la última línea de un título. */
export const pegaUltima = (texto: string) => texto.replace(/ (?=[^ ]+$)/, ' ')

/** La rejilla de cuatro tarjetas (carrusel en móvil, 2×2 en tableta, 4×1).
 *  En móvil lleva la pista «Swipe to see more», como los niveles de barra. */
export function RejillaTarjetas({ children, etiqueta }: { children: ReactNode; etiqueta: string }) {
  return (
    <>
      <ul className="comida3-tm-rejilla" tabIndex={0} aria-label={etiqueta}>
        {children}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-navy-sub sm:hidden">
        {t('Swipe to see more')}
        <MoveRight className="size-4" aria-hidden="true" />
      </p>
    </>
  )
}

type PropsTarjeta = {
  id?: string
  foto: { src: string; alt: string; ajuste?: 'cover' | 'contain' }
  /** Cinta sobre la foto (el «Most complete» del Turtle). */
  cinta?: ReactNode
  /** Zona 2: el nombre (y, en eventos, el precio). */
  nombre: ReactNode
  /** Zona 3: qué incluye. */
  incluye: ReactNode
  /** Zona 4: dónde se sirve / el pie. */
  pie: ReactNode
  destacada?: boolean
}

/** Una tarjeta: cuatro zonas, subgrid de la rejilla. */
export function TarjetaV3({ id, foto, cinta, nombre, incluye, pie, destacada = false }: PropsTarjeta) {
  return (
    <li id={id} className={`comida3-tm ancla-comida ${destacada ? 'comida3-turtle comida3-tm--destacada' : ''}`}>
      <div className="comida3-tm-foto">
        <img
          src={foto.src}
          alt={foto.alt}
          loading="lazy"
          decoding="async"
          className={foto.ajuste === 'contain' ? 'comida3-tm-foto-contiene' : 'size-full object-cover'}
        />
        {cinta ? <div className="absolute left-3 top-3">{cinta}</div> : null}
      </div>
      <div className="px-5 pt-4 sm:px-6 sm:pt-5">{nombre}</div>
      <div className="px-5 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">{incluye}</div>
      <div className={`border-t px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 ${destacada ? 'border-white/15' : 'border-linea'}`}>{pie}</div>
    </li>
  )
}

/** Los chips «Served on»: un enlace a cada tour, con su estado (Included,
 *  Upgrade, 3-hour menu…). Todo sale de menus-datos.ts. */
export function ChipsTours({ tours }: { tours: MenuComida['tours'] }) {
  return (
    <div>
      <RotuloZona>{COMIDA_Y_BAR.menus.servidoEn}</RotuloZona>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {tours.map((x) => (
          <li key={`${x.slug}-${x.nota}`}>
            <Link
              to={`/tours/${x.slug}`}
              className="inline-flex min-h-9 flex-wrap items-center gap-x-1.5 rounded-chip border border-linea px-3 py-1 text-left text-xs font-semibold leading-tight text-navy transition-colors hover:border-aqua hover:text-aqua-dark"
            >
              {nombreTour(x.slug)}
              {x.nota ? <span className="whitespace-nowrap font-medium text-aqua-dark">· {x.nota}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
