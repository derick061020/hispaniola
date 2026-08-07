import { Check, Plus } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import type { AddOnDeMenu } from '@/data/tours'

// LA FRANJA DE LA LANGOSTA — el único extra de pago del menú, en lámina de oro.
//
// Nace extrayendo la franja que vivía dentro de carta-charter.tsx (el bloque de
// menú del charter privado) por dos peticiones de Samuel del 2026-08-07:
//
//  1. QUE SE PUEDA CLICAR. «Tiene un icono de + , da la sensación de que se
//     puede clickear y actualmente no se puede.» Tenía razón y era el peor de
//     los dos mundos: la pieza más llamativa de la página prometía una acción
//     que no existía, y el único sitio donde el extra se podía marcar era el
//     panel de add-ons del widget —que además está escondido hasta que hay
//     fecha elegida—. Ahora la franja ES el control: marca y desmarca el
//     add-on `langosta` de la reserva, y se pinta según su estado.
//
//  2. QUE SAONA TENGA LA MISMA. Su bloque de menú anunciaba la langosta en una
//     card gris dentro de la columna de platos («ponlo dorado también igual que
//     el de charter privado y que igual sea clickeable»). En vez de copiar el
//     estilo, las dos pasan a ser ESTE componente: mismo oro, mismo gesto,
//     mismo comportamiento. Un componente React = un futuro componente Figma.
//
// El vínculo con el widget NO se adivina aquí: lo declara `addOnId` en los
// datos (ver AddOnDeMenu en data/tours.ts). Sin `addOnId` —o cuando el add-on
// no aplica al barco activo, como la langosta en los charters de 3 h— la franja
// se pinta EXACTAMENTE como antes, informativa y sin botón. Es lo honesto: en
// un barco de 3 h la cocina no puede servirla, así que ofrecerla sería vender
// algo que no existe.
//
// Por qué el oro y no la piel oscura del Premium: la piel oscura necesita
// SUPERFICIE para respirar (un bloque de menú entero, con fotos y cifras que la
// sostienen); en una franja de 80 px el casi-negro se queda en un rectángulo
// apagado. El degradado en diagonal —oro hundido → champán → oro— es lo que da
// la lectura de METAL en vez de relleno plano, y la tinta va en
// --color-premium-fondo (casi negro): sobre oro, el navy tira a morado.

export function BannerLangosta({
  addOn,
  activo,
  onAlternar,
  notaNoElegible,
  className = '',
}: {
  addOn: AddOnDeMenu
  /** Si está puesto en la reserva. `undefined` = la franja no es elegible aquí. */
  activo?: boolean
  /** Ausente = franja informativa (sin botón), el comportamiento de siempre. */
  onAlternar?: () => void
  /** Por qué no se puede añadir ahora mismo (ej. la langosta pide un barco de
   *  4 h). Sustituye a la descripción cuando la franja no es elegible. */
  notaNoElegible?: string
  className?: string
}) {
  const elegible = onAlternar !== undefined

  const contenido = (
    <>
      {/* La langosta: decorativa, anclada al canto derecho y SANGRANDA (sale
          del marco por la derecha). Un emblema centrado y entero parecería un
          icono de lista; recortado por el borde parece un sello estampado en la
          lámina.
          Al hover se levanta y gira un punto — «que se mueva ligeramente», no
          que salte. `motion-safe` la deja quieta para quien pidió menos
          movimiento; `pointer-events-none` evita que se coma clics (ahora que
          la franja ES un botón, eso importa de verdad).
          Se oculta por debajo de sm: en una franja estrecha se solaparía con el
          precio, que es el dato que no puede estorbarse. El `sm:pr-44` de la
          franja le RESERVA el sitio — el reservado tiene que cubrir lo que la
          imagen mete DENTRO del marco (ancho pintado menos lo que sangra por la
          derecha); con pr-36 se quedaba corto por unos 25 px y una pinza seguía
          pisando la palabra «person». */}
      <img
        src="/fotos/langosta.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -right-6 top-1/2 hidden h-24 -translate-y-1/2 transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-[calc(50%+0.35rem)] motion-safe:group-hover:-rotate-6 sm:block"
      />

      {/* Icono y texto viajan juntos en su propia fila: en móvil la franja se
          apila (texto arriba, precio debajo) y sin este envoltorio el
          `flex-wrap` metía el precio AL LADO del párrafo, dejándolo en una
          columna de cuatro palabras de ancho. */}
      <div className="relative flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        {/* EL DISCO SOLO EXISTE SI HAY ALGO QUE PULSAR. Cuando la franja es
            informativa —la langosta en un charter de 3 h— el «+» desaparece en
            vez de quedarse decorando: ese icono prometiendo una acción que no
            existe es exactamente la queja que abrió este trabajo, y repetirla
            en otro estado sería no haber entendido nada.
            Puesto, el disco se INVIERTE: tinta llena con el visto en oro. Es el
            mismo salto que hace una casilla al marcarse, no un color nuevo —
            desde lejos se ve si la langosta está dentro o no. */}
        {elegible ? (
          <span
            aria-hidden="true"
            className={`grid size-10 shrink-0 place-items-center rounded-full transition ${
              activo
                ? 'bg-premium-fondo text-premium-oro'
                : 'bg-premium-fondo/10 text-premium-fondo ring-1 ring-premium-fondo/15'
            }`}
          >
            {activo ? <Check className="size-5" strokeWidth={3} /> : <Plus className="size-5" />}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-premium-fondo">
            {activo
              ? `${addOn.nombre} added`
              : elegible
                ? `Add ${addOn.nombre.toLowerCase()}`
                : addOn.nombre}
          </p>
          {/* Puesto, el hueco de la descripción explica cómo quitarlo. Es la
              única pista de que el gesto es reversible, y va justo donde el
              visitante ya está mirando. Y si no es elegible, dice POR QUÉ: sin
              eso la franja sería un cartel mudo. */}
          {activo ? (
            <p className="mt-0.5 text-sm text-premium-fondo/70">
              It is on your booking. Click again to remove it.
            </p>
          ) : !elegible && notaNoElegible ? (
            <p className="mt-0.5 text-sm text-premium-fondo/70">{notaNoElegible}</p>
          ) : addOn.descripcion ? (
            <p className="mt-0.5 text-sm text-premium-fondo/70">{addOn.descripcion}</p>
          ) : null}
        </div>
      </div>

      {/* relative: el precio se monta POR ENCIMA de la langosta, que pasa justo
          por detrás. Sin esto la cifra —el dato que decide— quedaría cruzada
          por una pinza. */}
      <p className="relative shrink-0 font-display text-lg font-semibold text-premium-fondo">
        {formatoDinero(addOn.precio)}{' '}
        <span className="text-xs font-normal text-premium-fondo/60">per person</span>
      </p>
    </>
  )

  // El anillo se elige, no se superpone: `ring-1` y `ring-2` escriben la misma
  // custom property, así que ponerlas las dos en la cadena de clases deja al
  // orden del CSS decidir cuál gana. Puesto, el filo pasa a tinta para que la
  // franja se lea seleccionada también en un pantallazo en blanco y negro.
  const piel = `group relative flex flex-col gap-3 overflow-hidden rounded-card bg-gradient-to-br from-premium-oro-oscuro via-premium-oro-claro to-premium-oro p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:pr-44 ${
    activo ? 'ring-2 ring-premium-fondo/45' : 'ring-1 ring-premium-oro-oscuro/40'
  } ${className}`

  if (!elegible) {
    return <div className={piel}>{contenido}</div>
  }

  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-pressed={activo}
      className={`${piel} w-full text-left transition hover:brightness-[1.04]`}
    >
      {contenido}
    </button>
  )
}
