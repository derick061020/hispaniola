import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { EQUIPO } from '@/data/nosotros'
import type { Articulo, CategoriaBlog } from '@/data/blog'

// CardDestacado y sus piezas — en su propio archivo (y no en lista-articulos.tsx,
// donde vivían antes) para que carrusel-destacados.tsx pueda importar
// CardDestacado SIN crear un ciclo: lista-articulos.tsx importa
// CarruselDestacados, así que CarruselDestacados no puede a su vez depender
// de lista-articulos.tsx. MetaArticulo/ChipCategoria se exportan también
// porque CardArticulo (lista-articulos.tsx) las reusa igual.

function autorDe(id: string): string {
  return EQUIPO.find((m) => m.id === id)?.nombre ?? 'Hispaniola'
}

// Fundido imagen→papel con curva, no un linear-gradient de 2 stops (Samuel,
// 2026-07-22: "se ve na ligera línea entre el fade y el blanco que corta la
// sensación de transición"). Un gradiente lineal de "transparent X%, color
// 100%" interpola la opacidad a TASA CONSTANTE — el ojo no es sensible al
// color en sí, sino al cambio brusco en esa tasa justo en los dos extremos
// (arranca de golpe en X%, para en seco en 100%), y eso se lee como un canto
// duro aunque los valores sean continuos. Es el mismo problema que resuelven
// los generadores de "easing gradients": más stops intermedios que aproximan
// una curva ease-in-out (arranca y remata suave, el cambio se concentra en
// el medio) en vez de un único tramo recto. color-mix (no rgba): mezcla
// contra el --color-papel real del token, sea cual sea, en vez de fijar un
// blanco a fuego.
export function fundePapel(direccion: 'to bottom' | 'to right'): string {
  return (
    `linear-gradient(${direccion}, ` +
    'transparent 0%, transparent 48%, ' +
    'color-mix(in srgb, var(--color-papel) 15%, transparent) 60%, ' +
    'color-mix(in srgb, var(--color-papel) 40%, transparent) 72%, ' +
    'color-mix(in srgb, var(--color-papel) 70%, transparent) 84%, ' +
    'color-mix(in srgb, var(--color-papel) 90%, transparent) 93%, ' +
    'var(--color-papel) 100%)'
  )
}

export function MetaArticulo({ articulo }: { articulo: Articulo }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-navy-soft">
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-full bg-aqua-tint text-[0.625rem] font-semibold text-aqua-dark"
      >
        {autorDe(articulo.autorId).slice(0, 1)}
      </span>
      <span className="font-medium text-navy-sub">{autorDe(articulo.autorId)}</span>
      <span aria-hidden="true">·</span>
      <span>{articulo.fecha}</span>
      <span aria-hidden="true">·</span>
      <span>{articulo.minutos} min</span>
    </p>
  )
}

export function ChipCategoria({ categoria }: { categoria: CategoriaBlog }) {
  // self-start: sin esto, dentro de un padre flex-col (CardArticulo) el
  // span se estira al 100% del ancho (stretch es el default del eje
  // transversal en flex-col) y el chip se pinta como una barra completa en
  // vez de una píldora — bug reportado por Samuel. Inocuo en la fila de
  // CardDestacado (flex-row, items-center): ahí todos los chips miden el
  // mismo alto, así que alinear a 'start' en vez de 'center' no mueve nada.
  return (
    <span className="self-start rounded-chip bg-aqua-tint px-3 py-1 text-xs font-medium text-aqua-dark">
      {categoria}
    </span>
  )
}

// Reusada tal cual por CarruselDestacados (carrusel-destacados.tsx) para
// cada slide — el activo se ve exactamente igual que antes (mismo tamaño,
// mismo componente), el carrusel solo la envuelve y la escala/mueve.
export function CardDestacado({ articulo }: { articulo: Articulo }) {
  const contenido = (
    <>
      {/* Radio anidado: el marco exterior es rounded-card-grande (24px) con
          p-2 (8px) de aire → el radio de la imagen en sus esquinas REALES
          tiene que ser 24-8=16px (rounded-card), no 24px como antes — con el
          mismo radio que el marco pero MÁS DENTRO, las curvas no son
          concéntricas y se ve una esquina de más (bug que reportó Samuel).
          En las esquinas del lado que funde a blanco no hay esquina que
          anidar: se ponen a 0 (rectas), porque el fundido ya es un
          degradado RECTANGULAR — una curva ahí cortaría una esquina que el
          degradado todavía no había terminado de emblanquecer, dejando un
          arco visible contra el papel. Apilado (móvil/tablet) el lado que
          funde es abajo → esquinas de abajo a 0; en lg pasa a lado a lado y
          el lado que funde es la derecha → esquinas de la derecha a 0. */}
      {/* -mb-px/lg:-mr-px: pisa 1px el gap con la columna de texto (Samuel,
          2026-07-22, con capturas: "se sigue viendo la línea en medio"). No
          era el fundido — era una costura de subpíxel entre esta celda del
          grid y la de al lado (el navegador redondea el ancho de cada
          columna de forma independiente y a veces no coincide con el píxel
          exacto), visible como una línea fina del color de la FOTO (no del
          fundido) justo en el borde. Solaparla 1px de más no se nota como
          espaciado pero tapa la costura sea cual sea el redondeo. */}
      {/* SIN overflow-hidden aquí (2ª línea reportada por Samuel, con
          captura): overflow-hidden + border-radius + una transform en el
          hijo (el zoom de la foto al hover) es la combinación que en Chrome
          deja una costura de antialiasing en el canto del recorte — una
          línea fina y constante, no la de subpíxel de arriba. El radio se
          recorta en la propia <img> (radio anidado explicado arriba): un
          elemento reemplazado se recorta a su propio border-radius sin
          necesidad de overflow-hidden en el padre. Como ya no hay overflow
          que recorte un exceso, el zoom de hover de la imagen se retira (si
          la imagen creciera, se saldría del marco) — el hover pasa a la
          card entera (ver `clases` más abajo). */}
      <div className="relative -mb-px lg:mb-0 lg:h-full lg:-mr-px">
        <img
          src={`/fotos/${articulo.foto}.webp`}
          alt={articulo.fotoAlt}
          className="h-56 w-full rounded-t-card object-cover sm:h-72 lg:h-full lg:rounded-tr-none lg:rounded-bl-card"
          loading="lazy"
          // draggable=false: el "fantasma" nativo de arrastrar una <img> (el
          // navegador la deja soltar como si fuera un archivo) pelea con el
          // drag a mano del carrusel (CarruselDestacados) — sin esto, empezar
          // el gesto justo sobre la foto dispara el drag nativo en vez del
          // nuestro.
          draggable={false}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden"
          style={{ background: fundePapel('to bottom') }}
        />
        {/* lg:-mr-px: el mismo bleed de 1px que el wrapper (arriba), pero
            aplicado también aquí — el fundido es un hijo `absolute inset-0`
            y en teoría hereda el ancho ya sangrado del padre, pero el
            navegador redondea la caja absoluta por su cuenta y a veces no
            coincide con el redondeo del padre (Samuel, viendo el hot-reload
            en vivo: seguía asomando una línea de subpíxel en el fundido
            mismo). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden lg:-mr-px lg:block"
          style={{ background: fundePapel('to right') }}
        />
      </div>
      {/* pr-14: aire extra a la derecha — las flechas del carrusel
          (CarruselDestacados) son botones absolutos anclados al borde
          derecho de la card activa; sin este margen, la última línea del
          extracto puede quedar debajo del botón. */}
      <div className="flex flex-col justify-center pr-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-chip bg-navy px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
          <ChipCategoria categoria={articulo.categoria} />
        </div>
        <h3 className="mt-4 text-balance font-display text-h2 font-semibold text-navy">
          {articulo.titulo}
        </h3>
        <p className="mt-3 text-lead text-navy-sub">{articulo.extracto}</p>
        <MetaArticulo articulo={articulo} />
        {/* Siempre visible — desde 2026-07-22 TODAS las cards enlazan a
            /blog/:slug (pedido de Samuel: "no importa que todas lleven al
            único template de single blog que tenemos creado de momento"). La
            plantilla (pages/articulo.tsx) resuelve `cuerpo: null` con su
            propia nota honesta, así que ya no hace falta distinguir aquí. */}
        <span className="mt-5 inline-flex items-center gap-1.5 self-start rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-coral-dark">
          Read the article
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </>
  )

  // p-2 (8px), no responsive: es el que hace cerrar la cuenta del radio
  // anidado de arriba (24 = 16 + 8) en los DOS breakpoints a la vez — subirlo
  // en lg (como el p-4 de antes) rompería la cuenta ahí sin un segundo radio
  // calculado aparte.
  // h-full: dentro de CarruselDestacados cada slide es un flex item y por
  // default se ESTIRA (align-items: stretch) al alto del más alto de los 4 —
  // sin esto, una card con menos texto se quedaría más baja que su propio
  // slot ya estirado (hueco vacío abajo, no roto pero descuidado). Inocuo
  // fuera del carrusel: si algún día se usa suelta, h-full sin un padre de
  // alto definido no hace nada.
  // Hover: encoge un poco (0.975), no el lift+shadow de TourCard (pedido de
  // Samuel, 2ª vuelta) — el zoom de la foto (retirado arriba) tampoco vuelve,
  // el efecto vive solo en la card entera.
  const clases =
    'group grid h-full grid-cols-1 gap-4 rounded-card-grande bg-papel p-2 ring-1 ring-linea transition motion-safe:hover:scale-[0.975] lg:grid-cols-2 lg:gap-6'

  return (
    <Link to={`/blog/${articulo.slug}`} className={clases}>
      {contenido}
    </Link>
  )
}
