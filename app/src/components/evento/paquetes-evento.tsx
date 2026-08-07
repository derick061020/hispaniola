import type { CSSProperties } from 'react'
import { Check, Minus, Sparkles, Package } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento, PaqueteEvento } from '@/data/eventos'

// "Paquetes" de las landings de evento (PLAN-EVENTOS.md §3) — presente en
// party-boat y en bodas, que comparten el MISMO array de 4 paquetes
// (`PAQUETES_COMIDA` en data/eventos.ts: la web del cliente publica el
// tarifario idéntico en las dos). MICE no los tiene: se cotiza a medida.
// Cada paquete es INDEPENDIENTE, no un upgrade de otro.
//
// ── QUÉ CONFUNDÍA Y CÓMO SE ARREGLA (2026-07-28, 2ª vuelta) ───────────────
// Samuel: «está bastante mejor, pero aún parece que confunde un poco; debe
// ser lo más sencillo de entender». Diagnóstico de las tres cosas que
// confundían, porque el layout ya estaba bien y el problema era otro:
//
//  1) CADA CARD LISTABA COSAS DISTINTAS. #I tenía 1 línea y el Premium 7, así
//     que comparar obligaba a leer 4 listas y recordarlas. Y no hay escalera
//     que valga: #III NO es «#II y algo más» —pierde el hot dog—, así que
//     tampoco se podía resumir con un «todo lo anterior +…» sin mentir.
//     → Ahora los 4 paquetes enseñan LOS MISMOS 8 platos EN EL MISMO ORDEN,
//       con ✓ lo que entra y — lo que no. Es una tabla comparativa, pero
//       dibujada dentro de las cards: se compara moviendo el ojo en
//       horizontal, sin tabla que en móvil haya que scrollear de lado. De
//       paso desaparece el hueco raro de #I: el vacío pasa a ser información.
//       El orden de los platos NO es el del dato: es el de aparición ordenando
//       los paquetes de más barato a más caro, así que la lista se lee como
//       lo que suma cada escalón.
//  2) EL PRECIO ESTABA A MEDIAS. Se leía «US$ 660.00» grande y el «+US$ 55
//     por persona extra» abajo del todo, en gris, separado por toda la card.
//     Con grupos de 20-40 personas (el caso típico) el precio de verdad es
//     otro, así que el número grande se leía como el total.
//     → El precio ahora va con su condición pegada: «hasta 12 personas ·
//       +US$ 55 por persona extra», debajo mismo. Y el TOTAL real sigue
//       calculándose en el widget, que es donde se pone el nº de invitados.
//  3) LAS CARDS NO HACÍAN NADA. Se leían 4 paquetes y la acción estaba en
//     otro sitio (el widget), sin relación visible entre lo que se lee y lo
//     que se reserva.
//     → Cada card tiene su botón «Elegir» y queda MARCADA cuando es la
//       elegida, en sincronía con el selector del widget: se elige aquí y el
//       widget cambia (y su Total con él), o se elige allí y aquí se marca.
//       El estado vive en pages/evento.tsx, igual que `variante` en la ficha
//       de tour gobierna a la vez el widget y la tabla de precios del charter
//       — mismo patrón, misma razón: dos piezas que hablan del mismo dato no
//       pueden tener cada una el suyo.
//
// ⚠️ VOLVER ATRÁS: la versión anterior (mismo layout, pero cada card con solo
// sus propios items, el extra de precio al pie y sin selección) está en el
// commit 78e9a67 — `git checkout 78e9a67 -- app/src/components/evento/paquetes-evento.tsx`.
// Lo que NO cambia en esta vuelta es el layout que Samuel aprobó: el
// destacado a fila completa en horizontal y los otros 3 al lado.
//
// Layout (2026-07-28, pedido de Samuel: «el Hispaniola Premium Package debe
// abarcar el ancho completo posible, y las otras 3 una al lado de la otra»):
//  - El paquete DESTACADO ocupa una fila entera para él, en formato
//    horizontal (foto a la izquierda, contenido a la derecha), y los
//    demás van debajo en una fila de 3.
//  - Es jerarquía, no capricho de rejilla: el 2×2 anterior daba a los 4
//    paquetes exactamente el mismo peso, y el Premium es el que la casa
//    quiere vender (y el único que el badge llama «el más completo»).
//  - Historial: 4 columnas con fotos diminutas → 2×2 desde lg (Samuel
//    2026-07-17, «estan muy apretados») → esto.
//  - En móvil, todo apilado a 1 columna (incluido el destacado, que pierde
//    el formato horizontal): a 390px una foto lateral dejaría el texto en
//    un canal de 160px.
//  - El acento aqua (ring-2) ya NO significa «premium» sino «elegido» — el
//    mismo idioma que el selector del widget. El Premium se distingue por su
//    badge y su fondo `bg-aqua-tint/40`, que no se pisan con la selección.

/** Los platos que aparecen en ALGÚN paquete, en orden de escalón: se recorren
 *  los paquetes de más barato a más caro y se van añadiendo los que no
 *  estaban. Así la columna de platos se lee como la progresión de la oferta
 *  (hot dog → pollo/res/papas → camarón/tempura/fish sticks → langosta) en
 *  vez del orden en que el cliente los escribió en cada paquete. */
function platosDe(items: PaqueteEvento[]): string[] {
  const porPrecio = [...items].sort(
    (a, b) => (a.precioBase ?? Number.POSITIVE_INFINITY) - (b.precioBase ?? Number.POSITIVE_INFINITY),
  )
  const platos: string[] = []
  for (const paquete of porPrecio) {
    for (const item of paquete.items) {
      if (!platos.includes(item.titulo)) platos.push(item.titulo)
    }
  }
  return platos
}

function Card({
  paquete,
  platos,
  ancha = false,
  elegido,
  onElegir,
}: {
  paquete: PaqueteEvento
  /** la MISMA lista para las 4 cards — ver el porqué arriba */
  platos: string[]
  ancha?: boolean
  elegido: boolean
  onElegir: () => void
}) {
  const esPremium = paquete.destacado === 'premium'
  // El precio completo en una línea: la cifra grande sin su condición al lado
  // es la que se leía como total.
  const incluidas = paquete.incluyeHasta ?? null

  return (
    <article
      className={[
        // h-full: la card ocupa toda la altura de su fila del grid, para que
        // el `flex-1` de la lista empuje el botón al fondo y los 3 de la fila
        // queden con el botón en el mismo Y.
        'flex h-full flex-col overflow-hidden rounded-card transition',
        // La variante ancha se vuelve HORIZONTAL a partir de sm: foto a un
        // lado, contenido al otro. Debajo de sm sigue siendo la card de
        // siempre (foto arriba), como las otras 3.
        ancha ? 'sm:flex-row' : '',
        // ring-2 aqua = ELEGIDO (mismo idioma que el selector del widget).
        // Sin elegir, hairline gris. El Premium aporta lo suyo con el fondo.
        elegido ? 'ring-2 ring-aqua' : 'ring-1 ring-linea',
        esPremium ? 'bg-aqua-tint/40' : '',
        // Sin sombras (Samuel: "que no tenga sombras las cajas").
      ].join(' ')}
    >
      {/* Foto (si tiene) o placeholder. El recorte cambia con la variante: la
          ancha no fija proporción a partir de sm —se estira al alto de la
          card—, y la compacta usa 3:2 para no comerse media card cuando solo
          mide un tercio de la columna. */}
      {paquete.foto ? (
        <div
          className={[
            'aspect-[3/2] overflow-hidden bg-papel-hueso',
            ancha ? 'sm:aspect-auto sm:w-2/5 sm:shrink-0' : '',
          ].join(' ')}
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
            Most complete
          </span>
        ) : null}

        <h3 className={`font-display font-semibold text-navy ${ancha ? 'text-h3' : 'text-base'}`}>
          {paquete.nombre}
        </h3>

        <p className={`mt-1 font-display font-semibold text-navy ${ancha ? 'text-2xl' : 'text-xl'}`}>
          {paquete.precio}
        </p>
        {/* El precio y su condición, juntos. `extraPrecio` es texto del
            cliente ("US$ 99.00 por persona extra") — se pinta tal cual. */}
        <p className="text-xs text-navy-soft">
          {incluidas !== null ? `Up to ${incluidas} guests` : paquete.capacidad}
          {paquete.extraPrecio ? <> · +{paquete.extraPrecio}</> : null}
        </p>
        <p className="mt-0.5 text-xs text-navy-soft">{paquete.meta}</p>

        {/* LOS MISMOS PLATOS EN LAS 4 CARDS. `flex-1` empuja el botón al
            fondo. Si el paquete no publica menú (no es el caso hoy, pero
            bodas podría), se dice en vez de pintar 8 rayas. */}
        {paquete.items.length > 0 ? (
          <ul
            className={`mt-4 flex-1 space-y-1.5 ${
              // grid-flow-col + tantas filas como la mitad de los platos: las
              // 2 columnas de la card ancha se llenan HACIA ABAJO y no en
              // zigzag. Con el relleno por filas (el de por defecto) el orden
              // de los platos quedaba 1-2 / 3-4 en horizontal y dejaba de
              // coincidir con la columna vertical de las otras 3 cards —
              // justo lo que hace comparable la lista.
              ancha ? 'sm:grid sm:grid-flow-col sm:gap-x-6 sm:gap-y-1.5 sm:space-y-0' : ''
            }`}
            style={
              ancha
                ? ({ gridTemplateRows: `repeat(${Math.ceil(platos.length / 2)}, auto)` } as CSSProperties)
                : undefined
            }
          >
            {platos.map((plato) => {
              const item = paquete.items.find((i) => i.titulo === plato)
              return (
                <li
                  key={plato}
                  className={`flex items-start gap-2 text-sm ${
                    item ? 'text-navy-sub' : 'text-navy-soft/60'
                  }`}
                >
                  {item ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-menta-texto" aria-hidden="true" />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {/* Para lectores de pantalla el icono no dice nada: la
                        palabra sí. */}
                    <span className="sr-only">{item ? 'Included: ' : 'Not included: '}</span>
                    {plato}
                    {item?.texto ? <span className="text-navy-soft"> · {item.texto}</span> : null}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-4 flex-1 text-sm italic text-navy-soft">
            Full menu on confirmation. Message us on WhatsApp and we’ll send it over.
          </p>
        )}

        {/* LA CARD YA HACE ALGO. El botón elige el paquete en el widget de
            reserva; si ya es el elegido, lo dice y deja de ser pulsable
            (repetir la acción no hace nada y un botón que no hace nada
            miente). `aria-pressed` para que el estado no sea solo color. */}
        <button
          type="button"
          onClick={onElegir}
          aria-pressed={elegido}
          className={`mt-4 w-full rounded-btn px-4 py-2.5 text-sm font-semibold transition ${
            elegido
              ? 'cursor-default bg-aqua-tint text-aqua-dark'
              : 'bg-papel text-navy ring-1 ring-linea hover:bg-papel-hueso'
          }`}
        >
          {elegido ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check className="size-4" aria-hidden="true" />
              Selected
            </span>
          ) : (
            'Choose this package'
          )}
        </button>
      </div>
    </article>
  )
}

export function PaquetesEvento({
  evento,
  elegido,
  onElegir,
}: {
  evento: FichaEvento
  /** id del paquete activo en el widget de reserva (pages/evento.tsx) */
  elegido: string | null
  onElegir: (id: string) => void
}) {
  const paquetes = evento.paquetes
  if (!paquetes || paquetes.items.length === 0) return null

  const platos = platosDe(paquetes.items)

  // El destacado va SOLO en su fila; el resto, uno al lado del otro. Sale del
  // DATO (`destacado: 'premium'`), no de la posición en el array: si mañana el
  // cliente marca otro paquete, la maqueta le sigue sin tocar este archivo. Si
  // ninguno está marcado, `resto` los tiene a todos y la sección cae a la fila
  // de N — no queda un hueco.
  const destacados = paquetes.items.filter((p) => p.destacado)
  const resto = paquetes.items.filter((p) => !p.destacado)

  return (
    <section id="ancla-paquetes" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{paquetes.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{paquetes.intro}</p>
      {/* [2026-08-07, pedido de Samuel] SE RETIRA LA LÍNEA DE INSTRUCCIÓN que
          iba aquí («Los N llevan lo mismo a bordo, todo lo de "What's
          Included" arriba…»). Repetía lo que la sección de «Incluye» ya dice
          dos bloques más arriba y lo que las propias cards enseñan de un
          vistazo. Afecta a las DOS landings que pintan este bloque (party boat
          y bodas): es el mismo componente. */}

      <div className="mt-5 flex flex-col gap-4">
        {destacados.map((p) => (
          <Card
            key={p.id}
            paquete={p}
            platos={platos}
            ancha
            elegido={p.id === elegido}
            onElegir={() => onElegir(p.id)}
          />
        ))}

        {/* sm:grid-cols-3 y no lg: a 640px los 3 ya caben (≈190px cada uno).
            En la columna de la ficha en desktop rondan los 220px. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {resto.map((p) => (
            <Card
              key={p.id}
              paquete={p}
              platos={platos}
              elegido={p.id === elegido}
              onElegir={() => onElegir(p.id)}
            />
          ))}
        </div>
      </div>

      {paquetes.nota ? (
        <p className="mt-5 border-t border-linea pt-4 text-xs text-navy-soft">{paquetes.nota}</p>
      ) : null}
    </section>
  )
}
