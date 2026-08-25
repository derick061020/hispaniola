import { useState } from 'react'
import { ChevronDown, Clock3, Rotate3d, Ship, Users } from 'lucide-react'
import type { FichaTour, SubVarianteTour, TramoPrecio } from '@/data/tours'
import { formatoDinero } from '@/data/home'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { aforoDe, precioDeTramo, precioDesde, tramoDe } from '@/lib/tarifas'
import { Visor360 } from '@/components/flota/visor-360'
import { t, tp } from '@/lib/i18n'

// EL TARIFARIO POR BARCO — «Price list by boat».
//
// ═══════════════════════════════════════════════════════════════════════════
// [v3 2026-08-06] LA CARD ES AHORA UNA FICHA DE BARCO, NO UNA TABLA
// ═══════════════════════════════════════════════════════════════════════════
//
// Historia corta, porque explica por qué esta sección no se parece a lo que
// era. El cliente no entendió el tarifario («es un señor mayor y la versión
// anterior lo confundió muchísimo», Samuel 2026-08-06), así que se montaron
// SEIS propuestas para elegir —tres iteraciones sobre los tramos (A, B, C) más
// sus híbridos, y tres pensadas desde cero copiando a otros sectores (D, E,
// F)—. Samuel eligió la D.
//
// LA D INVIERTE LA JERARQUÍA. Antes esto era una TABLA con una miniatura al
// lado; ahora es una FOTO con un precio debajo, que es como venden esto mismo
// todos los marketplaces de charter (GetMyBoat, Boatsetter, Sailo) y todas las
// OTA de excursión (Viator, GetYourGuide). El producto es el BARCO; la tarifa
// es letra pequeña que se consulta si te interesa. El orden de la card es el
// orden en que se decide:
//
//   1. La foto, grande, con el 360º encima.
//   2. Nombre y los tres datos que filtran (duración, aforo, privacidad).
//   3. UNA cifra: lo que paga TU grupo, ya calculada. Nunca el precio unitario
//      en grande — ese es el cómo, no el cuánto.
//   4. El botón que ELIGE ese barco en el widget: la card deja de ser
//      informativa y pasa a ser accionable.
//   5. «How pricing works», plegado. Ahí vive la tabla de tramos entera, que
//      es lo que antes estaba todo a la vista.
//
// [2026-08-06, 2ª vuelta de Samuel] La foto NO va a sangre: lleva aire
// alrededor y radio en las CUATRO esquinas. Con la foto pegada a los cantos,
// la card se leía como una foto con una tira de texto debajo; con el aire, se
// lee como una card — es el mismo criterio que él ya aplicó a las cards de
// plato del menú el 07-28 («la foto deja de ir a sangre, el aire es lo que la
// convierte en objeto»), así que las dos piezas riman.
//
// Lo comparte Isla Saona, que también tiene subVariantes. ⚠️ Sus tres botes NO
// tienen foto propia: la galería de Saona es del DESTINO (playa, buffet,
// piscina natural), no de las embarcaciones, y ponerle a «Private Speedboat»
// una foto de catamarán sería mentir sobre el producto. Mientras no lleguen,
// esas tres cards pintan el hueco como hueco — marco discontinuo con el icono
// de barco— en vez de fingir una imagen. Pedidas al cliente.

/** Etiqueta del tramo en el eje de personas. `hasta: null` = sin tope. */
function rangoTramo(tramo: TramoPrecio, aforo: number): string {
  const hasta = tramo.hasta ?? aforo
  if (hasta === tramo.desde) return tp('{n} guests', { n: tramo.desde })
  return tp('{desde}–{hasta} guests', { desde: tramo.desde, hasta })
}

export function TablaPreciosCharter({
  ficha,
  activa,
  personas,
  onElegir,
}: {
  ficha: FichaTour
  activa: string | null
  /** [v3 2026-08-06] Selector de barco. La card de la D no es informativa: su
   *  CTA elige el barco, y el widget y esta sección comparten el mismo estado
   *  en tour.tsx. Opcional — sin el prop, el botón no se pinta. */
  onElegir?: (id: string) => void
  /** Personas elegidas en el widget. Es lo que convierte el «desde» en el
   *  total real del grupo. `null` mientras el widget no haya reportado. */
  personas?: number | null
}) {
  if (!ficha.subVariantes || ficha.subVariantes.length === 0) return null

  return (
    <section id="ancla-precios" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{t('Price list by boat')}</TituloSeccion>

      {/* [v3] La leyenda de dos viñetas —«flat rate» vs «per person»— se
          retira de aquí. Explicaba una tabla que ya no está a la vista, y
          arrancar la sección con dos reglas de tarificación es exactamente lo
          que confundía al cliente. Cada card lo explica dentro de «How pricing
          works», donde solo lo lee quien lo quiere leer. */}
      {/* [v3 2026-08-07] Sin tope de ancho (ver comparador-premium.tsx). */}
      <p className="mt-3 text-sm text-navy-sub">
        {personas
          ? tp(
              personas === 1
                ? 'Every price below is the total for your {n} guest. Change the number in the booking widget and they all follow.'
                : 'Every price below is the total for your {n} guests. Change the number in the booking widget and they all follow.',
              { n: personas },
            )
          : t('Choose the number of guests in the booking widget and every boat shows your total.')}
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {ficha.subVariantes.map((s) => (
          <CardBarco key={s.id} s={s} activa={activa} personas={personas} onElegir={onElegir} />
        ))}
      </div>

      <p className="mt-4 text-xs text-navy-soft">
        {t('* Premium lobster is an optional add-on at checkout (US$ 30 per person). * Prices may vary with season and availability. Confirm with the team when you book.')}
      </p>
    </section>
  )
}

function CardBarco({
  s,
  activa,
  personas,
  onElegir,
}: {
  s: SubVarianteTour
  activa: string | null
  personas?: number | null
  onElegir?: (id: string) => void
}) {
  const [abierta, setAbierta] = useState(false)
  const [visor360, setVisor360] = useState(false)

  const esActivo = s.id === activa
  const aforo = aforoDe(s.tabla)
  const tramo = personas ? tramoDe(s.tabla, personas) : null
  const total = tramo && personas ? precioDeTramo(tramo, personas) : null

  return (
    <div
      className={`rounded-card-grande bg-papel p-2 transition-all ${
        esActivo ? 'ring-2 ring-aqua-dark' : 'ring-1 ring-linea'
      }`}
    >
      {/* LA FOTO, con su aire y su radio propio en las 4 esquinas (2ª vuelta
          de Samuel). El `p-2` de la card es ese aire; el radio va en la propia
          imagen y no en un contenedor con overflow, que es lo que hacía que
          solo las de arriba parecieran redondeadas. */}
      <div className="relative">
        {s.foto ? (
          <img
            src={`/fotos/${s.foto}.webp`}
            alt={`${s.nombre} navegando`}
            loading="lazy"
            className="h-48 w-full rounded-card object-cover sm:h-56"
          />
        ) : (
          // Sin foto propia (las 3 variantes de Saona): hueco EVIDENTE, no una
          // imagen prestada. Ver el aviso de la cabecera del archivo.
          <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-linea-fuerte bg-papel-hueso sm:h-56">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-papel text-navy-soft ring-1 ring-linea"
            >
              <Ship className="size-5" />
            </span>
            <span className="text-xs text-navy-soft">{t('Photo coming soon')}</span>
          </div>
        )}

        {s.foto ? (
          <button
            type="button"
            onClick={() => setVisor360(true)}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-chip bg-papel/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm backdrop-blur-sm transition hover:bg-papel"
          >
            <Rotate3d className="size-3.5" aria-hidden="true" />
            360º
            <span className="sr-only">{t(', view')}{' '}{s.nombre} {t('in 360 degrees')}</span>
          </button>
        ) : null}

        {esActivo ? (
          <span className="absolute left-3 top-3 rounded-full bg-aqua-dark px-2.5 py-1 text-xs font-semibold text-white">
            {t('Selected')}
          </span>
        ) : null}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-display text-xl font-semibold text-navy">{s.nombre}</h3>

        {/* Los tres datos que FILTRAN, como iconos y no como frase: es lo que
            permite comparar barcos de un vistazo sin leer un párrafo. */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-sub">
          {s.duracion ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-aqua-dark" aria-hidden="true" />
              {s.duracion}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-aqua-dark" aria-hidden="true" />
            {t('Up to')}{' '}{aforo} {t('guests')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ship className="size-4 text-aqua-dark" aria-hidden="true" />
            {t('Private, just your group')}
          </span>
        </div>

        {/* UNA cifra, y que sea SIEMPRE un total que se paga. Con el widget sin
            tocar todavía no hay grupo, así que se enseña el ancla de entrada. */}
        <div className="mt-4 border-t border-linea pt-4">
          {total !== null && personas ? (
            <>
              <p className="text-sm text-navy-sub">
                {tp(personas === 1 ? 'Your {n} guest' : 'Your {n} guests', { n: personas })}
              </p>
              <p className="font-display text-4xl font-semibold leading-none text-navy">
                {formatoDinero(total)}
              </p>
              <p className="mt-1 text-sm text-navy-soft">
                {tramo?.tipo === 'grupo'
                  ? t('Flat price for the whole boat.')
                  : `${formatoDinero(tramo?.precio ?? 0)} per guest.`}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-navy-sub">{t('From')}</p>
              <p className="font-display text-4xl font-semibold leading-none text-navy">
                {formatoDinero(precioDesde(s.tabla))}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {onElegir ? (
            <button
              type="button"
              onClick={() => onElegir(s.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                esActivo
                  ? 'bg-aqua-tint text-aqua-dark ring-1 ring-aqua-dark'
                  : 'bg-coral text-white hover:brightness-110'
              }`}
            >
              {esActivo ? t('Selected') : t('Choose this boat')}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setAbierta((v) => !v)}
            aria-expanded={abierta}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark transition-colors hover:text-aqua"
          >
            {t('How pricing works')}
            <ChevronDown
              className={`size-4 transition-transform ${abierta ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* LA TABLA DE TRAMOS, plegada. Es todo lo que antes estaba a la vista:
            el rango de personas, el precio y de qué tipo es. El tramo del
            grupo del visitante va marcado, para que quien la abra encuentre
            el suyo sin buscarlo. */}
        {abierta ? (
          <ul className="mt-4 flex flex-col gap-2 rounded-card bg-papel-hueso p-4 text-sm">
            {s.tabla.map((fila) => {
              // [2026-08-25, Samuel: «lo de "tu grupo" debe aparecer solo en el
              // rango de personas en el que entras, y solo en el barco que
              // seleccionas»] Aquí ponía `tramo === tramo`, que es siempre
              // cierto: el parámetro del map se llamaba igual que el tramo
              // calculado arriba y lo tapaba, así que la comparación era
              // consigo mismo. Resultado: la etiqueta y la negrita salían en
              // TODAS las filas y en TODOS los barcos, que es justo lo
              // contrario de lo que la etiqueta promete.
              //
              // Ahora se compara contra el tramo real del grupo (`tramo`, de
              // `tramoDe`) y solo se marca en el barco elegido: en otro barco
              // ese rango no es «tu grupo», es el rango que te tocaría si te
              // cambiaras.
              const aplica = esActivo && fila === tramo
              return (
                <li
                  key={`${fila.desde}-${fila.hasta ?? 'max'}`}
                  className={`flex items-baseline justify-between gap-4 ${
                    aplica ? 'font-semibold text-navy' : 'text-navy-sub'
                  }`}
                >
                  <span>
                    {rangoTramo(fila, aforo)}
                    {aplica ? (
                      <span className="ml-2 rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                        {t('your group')}
                      </span>
                    ) : null}
                  </span>
                  <span className="whitespace-nowrap">
                    {formatoDinero(fila.precio)}
                    <span className="ml-1 text-xs font-normal text-navy-soft">
                      {fila.tipo === 'grupo' ? t('the whole boat') : t('per guest')}
                    </span>
                  </span>
                </li>
              )
            })}
            {/* El extra de comida opcional, si el tramo lo trae. Va aquí y no
                pegado al precio: es algo que PUEDES añadir, no un recargo. */}
            {s.tabla.some((tramo) => tramo.extra) ? (
              <li className="mt-1 border-t border-linea pt-2 text-xs text-navy-soft">
                {s.tabla.find((tramo) => tramo.extra)?.extra}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {visor360 && s.foto ? (
        <Visor360
          src="/video/hero.mp4"
          poster={`/fotos/${s.foto}.webp`}
          nombre={s.nombre}
          onCerrar={() => setVisor360(false)}
        />
      ) : null}
    </div>
  )
}
