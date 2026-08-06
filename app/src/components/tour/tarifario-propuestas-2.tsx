import { useState } from 'react'
import { ChevronDown, Clock3, Rotate3d, Ship, Users } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { aforoDe, minimoDe, precioDeTramo, precioDesde, tramoDe } from '@/lib/tarifas'
import { Visor360 } from '@/components/flota/visor-360'
import type { SubVarianteTour } from '@/data/tours'

// ═══════════════════════════════════════════════════════════════════════════
// TARIFARIO — SEGUNDA TANDA: TRES PROPUESTAS PENSADAS DESDE CERO
// ═══════════════════════════════════════════════════════════════════════════
//
// Pedido de Samuel (2026-08-06): «genérame 3 versiones nuevas totalmente
// distintas, piensa desde 0, compara con otras compañías cómo lo hacen…
// puedes estructurar todo en la card, desde imagen, título, lista, todo».
//
// LO QUE TENÍAN EN COMÚN LAS CINCO ANTERIORES, y por eso esta tanda empieza
// de nuevo: todas respondían a «cómo enseño estos tramos». Ninguna se
// preguntaba si la sección tenía que ir de tramos. Y no tiene por qué:
//
// CÓMO LO HACE EL SECTOR
//   · Marketplaces de charter (GetMyBoat, Boatsetter, Sailo): el producto es
//     EL BARCO. Foto enorme, nombre, iconos de eslora/aforo/tripulación y UN
//     precio ancla («from $X»). El detalle tarifario se esconde detrás de un
//     enlace. Nadie enseña una tabla en la card.
//   · OTAs de excursión (Viator, GetYourGuide, Civitatis): foto, título,
//     valoración y «desde X por persona». El precio final se calcula al elegir
//     fecha y personas — jamás se publica una matriz.
//   · Aerolíneas y SaaS: cuando hay que ELEGIR entre variantes, la respuesta
//     no son cinco fichas seguidas sino UNA tabla comparativa con las
//     opciones en filas y lo que las diferencia en columnas.
//   · Tarifas escalonadas de verdad (paquetería, luz, peajes): cuando el
//     precio salta por tramos, se dibuja. Un gráfico de escalones enseña en
//     un vistazo lo que una tabla tarda tres párrafos en explicar.
//
// De ahí salen las tres, cada una copiando un patrón distinto y probado:
//   D · FICHA DE BARCO      — el barco como producto (marketplace de charter)
//   E · COMPARADOR          — una tabla para los 5, no 5 tablas (aerolínea)
//   F · ESCALERA DE PRECIO  — el tramo, dibujado (tarifa escalonada)
//
// ⚠️ Bloque TEMPORAL, igual que la primera tanda: cuando Samuel elija, este
// archivo y el de las opciones A–C+ desaparecen.

const CAJA = 'rounded-card-grande bg-fondo-ficha p-4 ring-1 ring-linea sm:p-5'

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-chip bg-navy px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
      {children}
    </span>
  )
}

/** El total real para N personas en un barco. `null` si no cabe. */
function totalPara(s: SubVarianteTour, n: number | null | undefined): number | null {
  if (n == null) return null
  const tramo = tramoDe(s.tabla, n)
  return tramo ? precioDeTramo(tramo, n) : null
}

// ── PROPUESTA D ────────────────────────────────────────────────────────────
// «FICHA DE BARCO» — el patrón de GetMyBoat / Boatsetter / Sailo.
//
// La inversión de fondo: hoy la card es una TABLA con una foto pequeña al
// lado. En todos los marketplaces de charter que venden esto mismo, la card es
// una FOTO con un precio debajo. El producto es el barco; la tarifa es letra
// pequeña que se consulta si te interesa, no el contenido principal.
//
// Estructura, de arriba abajo, que es el orden en que se decide:
//   1. La foto, a sangre y grande, con el 360º encima.
//   2. Nombre y las tres cosas que filtran (duración, aforo, tipo de tarifa).
//   3. UNA cifra: lo que paga TU grupo. Y debajo, en pequeño, de dónde sale.
//   4. El botón que elige este barco en el widget — la card deja de ser
//      informativa y pasa a ser accionable.
//   5. «How pricing works», plegado. Ahí vive todo lo que hoy está a la vista.
//
// Lo que gana: se ve el barco. Lo que arriesga: para comparar cinco barcos hay
// que scrollear cinco fotos grandes.
export function PropuestaD({
  s,
  personas,
  activa,
  onElegir,
}: {
  s: SubVarianteTour
  personas?: number | null
  activa?: string | null
  onElegir?: (id: string) => void
}) {
  const [abierta, setAbierta] = useState(false)
  const [visor, setVisor] = useState(false)
  const total = totalPara(s, personas)
  const tramo = personas ? tramoDe(s.tabla, personas) : null
  const esActivo = s.id === activa

  return (
    <div className={`overflow-hidden rounded-card-grande bg-papel ring-1 ${esActivo ? 'ring-2 ring-aqua-dark' : 'ring-linea'}`}>
      {s.foto ? (
        <div className="relative">
          <img
            src={`/fotos/${s.foto}.webp`}
            alt={`${s.nombre} navegando`}
            loading="lazy"
            className="h-48 w-full object-cover sm:h-56"
          />
          <span className="absolute left-3 top-3">
            <Etiqueta>Propuesta D · ficha de barco</Etiqueta>
          </span>
          <button
            type="button"
            onClick={() => setVisor(true)}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-chip bg-papel/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm backdrop-blur-sm transition hover:bg-papel"
          >
            <Rotate3d className="size-3.5" aria-hidden="true" />
            360º
          </button>
        </div>
      ) : null}

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold text-navy">{s.nombre}</h3>
        {/* Los tres datos que FILTRAN, como iconos y no como frase: es lo que
            hace un marketplace para que se comparen barcos de un vistazo. */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-sub">
          {s.duracion ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-aqua-dark" aria-hidden="true" />
              {s.duracion}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-aqua-dark" aria-hidden="true" />
            Up to {aforoDe(s.tabla)} guests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ship className="size-4 text-aqua-dark" aria-hidden="true" />
            Private, just your group
          </span>
        </div>

        {/* UNA cifra. La del visitante si la hay; si no, el ancla de entrada. */}
        <div className="mt-4 border-t border-linea pt-4">
          {total !== null && personas ? (
            <>
              <p className="text-sm text-navy-sub">Your {personas} guests</p>
              <p className="font-display text-4xl font-semibold leading-none text-navy">
                {formatoDinero(total)}
              </p>
              <p className="mt-1 text-sm text-navy-soft">
                {tramo?.tipo === 'grupo'
                  ? 'Flat price for the whole boat.'
                  : `${formatoDinero(tramo?.precio ?? 0)} per guest.`}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-navy-sub">From</p>
              <p className="font-display text-4xl font-semibold leading-none text-navy">
                {formatoDinero(precioDesde(s.tabla))}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onElegir?.(s.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              esActivo
                ? 'bg-aqua-tint text-aqua-dark ring-1 ring-aqua-dark'
                : 'bg-coral text-white hover:brightness-110'
            }`}
          >
            {esActivo ? 'Selected' : 'Choose this boat'}
          </button>
          <button
            type="button"
            onClick={() => setAbierta((v) => !v)}
            aria-expanded={abierta}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark transition-colors hover:text-aqua"
          >
            How pricing works
            <ChevronDown
              className={`size-4 transition-transform ${abierta ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {abierta ? (
          <ul className="mt-4 flex flex-col gap-2 rounded-card bg-papel-hueso p-4 text-sm">
            {s.tabla.map((t) => (
              <li key={`${t.desde}-${t.hasta}`} className="flex items-baseline justify-between gap-4">
                <span className="text-navy-sub">
                  {t.desde}–{t.hasta ?? aforoDe(s.tabla)} guests
                </span>
                <span className="font-semibold text-navy">
                  {formatoDinero(t.precio)}
                  <span className="ml-1 text-xs font-normal text-navy-soft">
                    {t.tipo === 'grupo' ? 'the whole boat' : 'per guest'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {visor && s.foto ? (
        <Visor360
          src="/video/hero.mp4"
          poster={`/fotos/${s.foto}.webp`}
          nombre={s.nombre}
          onCerrar={() => setVisor(false)}
        />
      ) : null}
    </div>
  )
}

// ── PROPUESTA E ────────────────────────────────────────────────────────────
// «COMPARADOR» — el patrón de las aerolíneas y de las páginas de planes.
//
// La pregunta que esta sección no estaba respondiendo. Un visitante que llega
// aquí no quiere entender el tarifario de Maite: quiere saber QUÉ BARCO le
// conviene. Y con cinco cards, cada una con su tabla, esa comparación la tiene
// que hacer él a mano, scrolleando y recordando cifras.
//
// Así que en vez de cinco tablas, UNA: los barcos en filas, y en columnas solo
// lo que los diferencia — duración, aforo y el precio YA CALCULADO para su
// grupo. Ordenados por precio, con el más barato que le sirve marcado. Los que
// no le caben salen en gris, con su motivo escrito.
//
// Es la propuesta que más cambia la sección: sustituye a las cinco cards en
// vez de rediseñarlas. Lo que arriesga: el barco deja de tener foto grande —
// se recupera con la miniatura y con la ficha de flota, a un clic.
export function PropuestaE({
  subVariantes,
  personas,
  activa,
  onElegir,
}: {
  subVariantes: SubVarianteTour[]
  personas?: number | null
  activa?: string | null
  onElegir?: (id: string) => void
}) {
  const pax = personas ?? null
  const filas = subVariantes
    .map((s) => {
      const total = totalPara(s, pax)
      const cabe = pax == null || (pax >= minimoDe(s.tabla) && pax <= aforoDe(s.tabla))
      return { s, total, cabe, referencia: precioDesde(s.tabla) }
    })
    // Ordenados por lo que de verdad se compara: lo que te cuesta a TI. Los
    // que no caben, al final — no se ocultan (saber por qué no te sirve un
    // barco también es información), pero dejan de competir por la vista.
    .sort((a, b) => {
      if (a.cabe !== b.cabe) return a.cabe ? -1 : 1
      return (a.total ?? a.referencia) - (b.total ?? b.referencia)
    })

  const mejor = filas.find((f) => f.cabe)

  return (
    <div className={CAJA}>
      <Etiqueta>Propuesta E · comparador</Etiqueta>
      <h3 className="mt-2 font-display text-h3 font-semibold text-navy">
        Which catamaran fits your group?
      </h3>
      <p className="mt-1 text-sm text-navy-sub">
        {pax
          ? `Prices below are the total for your ${pax} guests. Change the number in the booking widget and the list re-sorts.`
          : 'Choose the number of guests in the booking widget and every boat shows your total.'}
      </p>

      <div className="mt-4 overflow-hidden rounded-card ring-1 ring-linea">
        {filas.map(({ s, total, cabe }) => {
          const esActivo = s.id === activa
          const esMejor = mejor?.s.id === s.id && pax !== null
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => (cabe ? onElegir?.(s.id) : undefined)}
              disabled={!cabe}
              className={`flex w-full items-center gap-3 border-b border-linea px-3 py-3 text-left transition last:border-b-0 sm:px-4 ${
                esActivo ? 'bg-aqua-tint' : cabe ? 'bg-papel hover:bg-papel-hueso' : 'bg-papel-hueso'
              } ${cabe ? '' : 'opacity-55'}`}
            >
              {s.foto ? (
                <img
                  src={`/fotos/${s.foto}.webp`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-12 w-16 shrink-0 rounded object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-12 w-16 shrink-0 place-items-center rounded bg-aqua-tint text-aqua-dark"
                >
                  <Ship className="size-5" />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-semibold text-navy">{s.nombre}</span>
                  {esMejor ? (
                    <span className="rounded-full bg-menta px-2 py-0.5 text-[11px] font-semibold text-menta-texto">
                      Best price for {pax}
                    </span>
                  ) : null}
                  {esActivo ? (
                    <span className="rounded-full bg-aqua-dark px-2 py-0.5 text-[11px] font-semibold text-white">
                      Selected
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-navy-soft">
                  {s.duracion ? `${s.duracion} · ` : ''}up to {aforoDe(s.tabla)} guests
                  {!cabe ? ` · too ${pax && pax > aforoDe(s.tabla) ? 'many' : 'few'} guests` : ''}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block whitespace-nowrap font-display text-base font-semibold text-navy">
                  {total !== null ? formatoDinero(total) : `from ${formatoDinero(precioDesde(s.tabla))}`}
                </span>
                {total !== null ? (
                  <span className="block text-[11px] text-navy-soft">total</span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── PROPUESTA F ────────────────────────────────────────────────────────────
// «ESCALERA DE PRECIO» — el patrón de las tarifas escalonadas de verdad
// (paquetería, electricidad, peajes), que cuando el precio salta lo DIBUJAN.
//
// La apuesta: el problema de este tarifario no es de lectura, es de forma. El
// precio de Maite es literalmente una escalera —plano hasta 8, y a partir de
// ahí un peldaño por invitado— y ninguna de las versiones anteriores la
// enseña: todas la describen. Dibujada, la regla se entiende sin leer una
// palabra, y sobre todo se VE el salto del 8 al 9, que es donde se pierde la
// gente.
//
// Cada peldaño es un tamaño de grupo (o un rango, cuando el precio no cambia)
// y su altura es proporcional al total. El del visitante va marcado y con su
// cifra encima. Debajo, una sola frase con la regla.
//
// Lo que arriesga: es la más «gráfico» de las seis, y un gráfico mal leído
// confunde más que una lista. Por eso lleva el eje rotulado y la cifra escrita
// en los tres peldaños que importan (el primero, el tuyo y el último).
export function PropuestaF({ s, personas }: { s: SubVarianteTour; personas?: number | null }) {
  const min = minimoDe(s.tabla)
  const max = aforoDe(s.tabla)

  const peldanos: { desde: number; hasta: number; total: number }[] = []
  for (let n = min; n <= max; n++) {
    const tramo = tramoDe(s.tabla, n)
    if (!tramo) continue
    const total = precioDeTramo(tramo, n)
    const ultimo = peldanos[peldanos.length - 1]
    if (ultimo && ultimo.total === total && ultimo.hasta === n - 1) ultimo.hasta = n
    else peldanos.push({ desde: n, hasta: n, total })
  }
  const techo = Math.max(...peldanos.map((p) => p.total))
  const iTuyo = peldanos.findIndex((p) => personas != null && personas >= p.desde && personas <= p.hasta)

  return (
    <div className={CAJA}>
      <Etiqueta>Propuesta F · escalera de precio</Etiqueta>
      <h3 className="mt-2 font-display text-h3 font-semibold text-navy">{s.nombre}</h3>
      <p className="mt-1 text-sm text-navy-sub">
        {s.duracion ? `${s.duracion} · ` : ''}
        {s.capacidad}
      </p>

      {/* La escalera. Cada peldaño ocupa el ancho de su rango, así que el
          tramo plano de grupo se ve ANCHO y bajo, y los de por persona
          estrechos y subiendo — la forma cuenta la regla. */}
      <div className="mt-5 flex h-44 items-stretch gap-0.5" role="img" aria-label={`Price steps for ${s.nombre}`}>
        {peldanos.map((p, i) => {
          const esTuyo = i === iTuyo
          const ancho = ((p.hasta - p.desde + 1) / (max - min + 1)) * 100
          // ⚠️ Techo al 85% y `shrink-0` en la barra. Con el 100%, las
          // columnas que llevan rótulo (la primera, la tuya y la última) no
          // tenían sitio para las dos cosas y flex ENCOGÍA la barra: el
          // peldaño más caro salía más bajo que el anterior y el gráfico
          // mentía. Reservando el 15% para el rótulo, las ocho columnas miden
          // en la misma escala lleven texto o no.
          const alto = Math.max(10, Math.round((p.total / techo) * 85))
          const rotula = i === 0 || esTuyo || i === peldanos.length - 1
          return (
            // `h-full` en la columna: sin altura definida en el padre, el
            // `height: X%` del peldaño se resuelve contra `auto` y la barra
            // sale de 0px — el gráfico se veía vacío.
            <div
              key={`${p.desde}-${p.hasta}`}
              className="flex h-full flex-col justify-end"
              style={{ width: `${ancho}%` }}
            >
              {rotula ? (
                <span
                  className={`mb-1 block text-center text-[11px] font-semibold ${
                    esTuyo ? 'text-aqua-dark' : 'text-navy-soft'
                  }`}
                >
                  {formatoDinero(p.total)}
                </span>
              ) : null}
              <span
                className={`block shrink-0 rounded-t-sm ${esTuyo ? 'bg-aqua-dark' : 'bg-navy/25'}`}
                style={{ height: `${alto}%` }}
              />
            </div>
          )
        })}
      </div>

      {/* El eje, rotulado en los extremos y en el salto. Sin esto la escalera
          es decoración. */}
      <div className="mt-1 flex items-center justify-between border-t border-linea pt-1 text-[11px] text-navy-soft">
        <span>{min} guest</span>
        <span>{max} guests</span>
      </div>

      <p className="mt-4 rounded-card bg-papel-hueso px-4 py-3 text-sm text-navy-sub">
        {personas != null && iTuyo >= 0 ? (
          <>
            <strong className="font-semibold text-navy">
              Your {personas} {personas === 1 ? 'guest' : 'guests'}: {formatoDinero(peldanos[iTuyo].total)}
            </strong>
            . The first step is flat — the whole boat for the same price up to{' '}
            {peldanos[0].hasta} guests. After that, each guest adds their own seat.
          </>
        ) : (
          <>
            The first step is flat — the whole boat for the same price up to {peldanos[0].hasta}{' '}
            guests. After that, each guest adds their own seat.
          </>
        )}
      </p>
    </div>
  )
}
