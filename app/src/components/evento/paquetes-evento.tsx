import { useState } from 'react'
import { Check, Sparkles, Package } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { FichaEvento, PaqueteEvento } from '@/data/eventos'

// "Paquetes" de las landings de evento (PLAN-EVENTOS.md §3) — solo
// presente en party-boat (la web del cliente vende 4 paquetes para
// eventos). Misma estructura que el comparador de paquetes de la
// ficha de tour (`menu-tour.tsx`) pero sin el toggle Light/Premium —
// cada paquete es INDEPENDIENTE, no un upgrade de otro.
//
// Layout (2026-07-28, pedido de Samuel: «el Hispaniola Premium Package debe
// abarcar el ancho completo posible, y las otras 3 una al lado de la otra»):
//  - El paquete DESTACADO ocupa una fila entera para él, en formato
//    horizontal (foto a la izquierda, contenido a la derecha), y los
//    demás van debajo en una fila de 3.
//  - Es jerarquía, no capricho de rejilla: el 2×2 anterior daba a los 4
//    paquetes exactamente el mismo peso, y el Premium es el que la casa
//    quiere vender (y el único que el badge llama «el más completo»).
//    Ahora la página lo dice con el ESPACIO, que es el argumento que se
//    lee sin leer. De paso, el Premium es el que más items tiene (7): en
//    una card estrecha era una lista larguísima y en la ancha caben en 2
//    columnas.
//  - Historial: la versión anterior era 1 col en móvil y 2×2 desde lg
//    (Samuel 2026-07-17, «estan muy apretados, ponlos en un grid de 2
//    columnas» — venían de 4 columnas con fotos diminutas). El trío de
//    abajo no vuelve a aquel apretón: sus cards son más CORTAS que las de
//    entonces (foto 3:2 y no 4:3, precio y capacidad en una línea), así
//    que a 1/3 de la columna respiran.
//  - En móvil, todo apilado a 1 columna (incluido el destacado, que pierde
//    el formato horizontal): a 390px una foto lateral dejaría el texto en
//    un canal de 160px.
//  - Cada card: foto (si tiene) + nombre + precio + capacidad + items
//    con check + extra de precio. El Premium lleva un badge "Most
//    complete" y un acento aqua en el borde (mismo lenguaje que la
//    card "recomendado" de la ficha de tour, pero en lugar del coral
//    usa aqua — el coral está reservado para el CTA del widget).
//  - La card "premium" se pinta primero, con un fondo `bg-aqua-tint`
//    sutil para destacar.
//  - El click en una card NO navega a otro lado — el form sigue
//    siendo la única acción. La card es informativa: el visitante
//    LEE los 4 paquetes, luego rellena el form mencionando el que
//    quiere en el campo "mensaje".
//
// Si en el futuro se quiere que el form incluya el paquete
// seleccionado como campo separado, este componente ya pasa el id
// del paquete por hover/focus — solo hay que levantar el estado al
// padre (pages/evento.tsx) y añadir un hidden input al widget.

function Card({ paquete, ancha = false }: { paquete: PaqueteEvento; ancha?: boolean }) {
  const esPremium = paquete.destacado === 'premium'
  return (
    <article
      className={[
        // h-full: la card ocupa toda la altura de su fila del grid
        // (Tailwind grid strechea los hijos por defecto, pero el
        // h-full lo hace explícito para que el `flex-1` del ul de
        // items empuje el footer al fondo en CUALQUIER cantidad
        // de items — pedido de Samuel 2026-07-17).
        'flex h-full flex-col overflow-hidden rounded-card ring-1',
        // La variante ancha se vuelve HORIZONTAL a partir de sm: foto a un
        // lado, contenido al otro. Debajo de sm sigue siendo la card de
        // siempre (foto arriba), como las otras 3.
        ancha ? 'sm:flex-row' : '',
        esPremium ? 'ring-2 ring-aqua bg-aqua-tint/40' : 'ring-linea',
        // Sin sombras (Samuel: "que no tenga sombras las cajas").
        // Antes: hover:shadow-card. Ahora: sin transition-shadow
        // tampoco, para que no se note el cambio al quitarlo.
      ].join(' ')}
    >
      {/* Foto (si tiene) o placeholder.
          El recorte cambia con la variante: la ancha no fija proporción a
          partir de sm —se estira al alto de la card, que lo manda el
          texto—, y la compacta usa 3:2 en vez de 4:3 para no comerse media
          card cuando solo mide un tercio de la columna. */}
      {paquete.foto ? (
        <div
          className={
            ancha
              ? 'aspect-[3/2] overflow-hidden bg-papel-hueso sm:aspect-auto sm:w-2/5 sm:shrink-0'
              : 'aspect-[3/2] overflow-hidden bg-papel-hueso'
          }
        >
          <img
            src={`/fotos/${paquete.foto}.webp`}
            alt={paquete.fotoAlt}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div
          className={[
            'flex aspect-[3/2] items-center justify-center bg-papel-hueso',
            ancha ? 'sm:aspect-auto sm:w-2/5 sm:shrink-0' : '',
          ].join(' ')}
        >
          <Package className="size-12 text-navy-soft" aria-hidden="true" />
        </div>
      )}

      <div className={`flex flex-1 flex-col p-5 ${ancha ? 'sm:p-6' : ''}`}>
        {esPremium ? (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-semibold text-aqua-dark">
            <Sparkles className="size-3" aria-hidden="true" />
            El más completo
          </span>
        ) : null}

        <h3 className={`font-display font-semibold text-navy ${ancha ? 'text-h3' : 'text-base'}`}>
          {paquete.nombre}
        </h3>

        <p
          className={`mt-1 font-display font-semibold text-navy ${ancha ? 'text-2xl' : 'text-xl'}`}
        >
          {paquete.precio}
        </p>
        <p className="text-xs text-navy-soft">
          {paquete.capacidad} · {paquete.meta}
        </p>

        {/* Items con check. `flex-1` empuja el footer (extraPrecio)
            al fondo de la card, sin importar cuántos items tenga
            el paquete — los 3 paquetes de la fila de abajo quedan
            con su footer en el mismo Y.
            En la card ancha la lista pasa a 2 columnas desde sm: el
            Premium tiene 7 items y en una sola columna a ancho completo
            sería una lista larga con medio metro de aire a la derecha. */}
        {paquete.items.length > 0 ? (
          <ul
            className={`mt-4 flex-1 space-y-2 ${
              ancha ? 'sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 sm:space-y-0' : ''
            }`}
          >
            {paquete.items.map((it) => (
              <li key={it.titulo} className="flex items-start gap-2 text-sm text-navy-sub">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-menta-texto"
                  aria-hidden="true"
                />
                <span>
                  {it.titulo}
                  {it.texto ? <span className="text-navy-soft"> · {it.texto}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 flex-1 text-sm italic text-navy-soft">
            Menú detallado al confirmar — escríbenos por WhatsApp y te lo pasamos.
          </p>
        )}

        {paquete.extraPrecio ? (
          <p className="mt-auto border-t border-linea pt-3 text-xs text-navy-soft">
            {paquete.extraPrecio}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function PaquetesEvento({ evento }: { evento: FichaEvento }) {
  const paquetes = evento.paquetes
  if (!paquetes || paquetes.items.length === 0) return null

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'package-i' / 'package-ii' / 'package-iii' / 'premium' añade un
  // borde más grueso a la card correspondiente (frame de Figma con
  // un paquete destacado). No se usa en producción.
  const [destacado, setDestacado] = useState<string | null>(null)
  useDevFlag('dev-paquete', (v) => {
    if (['premium', 'package-i', 'package-ii', 'package-iii'].includes(v)) {
      setDestacado(v)
    }
  })

  return (
    <section id="ancla-paquetes" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{paquetes.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{paquetes.intro}</p>

      {/* El destacado va SOLO en su fila; el resto, uno al lado del otro.
          `destacados` sale del dato (`destacado: 'premium'`), no de la
          posición en el array: si mañana el cliente marca otro paquete como
          el suyo, la maqueta le sigue sin tocar este archivo. Si ningún
          paquete está marcado, `resto` los tiene a todos y la sección cae a
          la fila de N — no queda un hueco. */}
      <div className="mt-5 flex flex-col gap-4">
        {paquetes.items
          .filter((p) => p.destacado)
          .map((p) => (
            <div
              key={p.id}
              className={destacado === p.id ? 'ring-2 ring-coral ring-offset-2 rounded-card' : ''}
            >
              <Card paquete={p} ancha />
            </div>
          ))}

        {/* sm:grid-cols-3 y no lg: a 640px los 3 ya caben (≈190px cada uno,
            con la foto en 3:2 y el precio en su línea). En la columna de la
            ficha en desktop rondan los 220px. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {paquetes.items
            .filter((p) => !p.destacado)
            .map((p) => (
              <div
                key={p.id}
                className={destacado === p.id ? 'ring-2 ring-coral ring-offset-2 rounded-card' : ''}
              >
                <Card paquete={p} />
              </div>
            ))}
        </div>
      </div>

      {paquetes.nota ? (
        <p className="mt-5 border-t border-linea pt-4 text-xs text-navy-soft">
          {paquetes.nota}
        </p>
      ) : null}
    </section>
  )
}
