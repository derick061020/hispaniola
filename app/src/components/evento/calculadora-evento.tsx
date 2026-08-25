import { useState } from 'react'
import { Minus, Package, Plus, Users } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Link } from 'react-router-dom'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { esEventoReservable, slugOdooDePaquete } from '@/data/eventos-reservables'
import { NumeroEditable } from '@/components/ui/numero-editable'
import { formatoDinero } from '@/data/home'
import {
  NOVIOS_GRATIS_DESDE,
  personasQuePagan,
  totalPaqueteEvento,
  type PaqueteEvento,
} from '@/data/eventos'
import { t } from '@/lib/i18n'

// Reserva online de eventos (correcciones v2, plan 03 §1 — slides 14 y 15:
// «agregar reserva online y debajo el formulario de cotización»).
//
// Hasta ahora las 3 landings de evento eran 100% asíncronas: pedías
// presupuesto y alguien te contestaba. Eso trataba igual a quien quiere un
// party boat estándar de 20 personas que a quien organiza una boda de 120 con
// menú a medida — y no son el mismo cliente.
//
// El cliente confirmó en la reunión del 07-24 (12:53) que sí quiere reserva
// online, y el tarifario que lo permite ya existe y es de PRECIO CERRADO:
// US$ 1.188 para 1-12 personas + US$ 99 por cada persona extra (Samuel lo leyó
// en voz alta a las 13:05 y propuso «hacerlo tal cual como está el resto»).
//
// ⚠️ MODELO MARGINAL, no sustitución de tramo. Los eventos son el único
// producto que funciona así: base fija hasta 12 y luego un tanto por cabeza.
// Los tours (charter, Saona) usan sustitución — ver lib/tarifas.ts. No
// mezclar los dos.
//
// [2026-08-25] YA COBRA. El depósito sigue siendo el 25% (decisión de Samuel,
// 2026-07-27 — el mismo que los tours, sin porcentaje especial por ser
// evento), pero el CTA dejó de ser `EnlacePrototipo` y entra al funnel de
// verdad: party boat y bodas se reservan y se pagan como un tour.
//
// Lo que faltaba no era el botón: era que Odoo supiera cuánto vale cada
// paquete. Los cuatro están sembrados allí como variantes con su base y su
// extra por invitado, así que el precio que se cobra sale del servidor. Este
// total de aquí sigue siendo el que se pinta mientras se configura —y tiene
// que dar lo mismo—, pero no es el que se cobra.

const DEPOSITO = 0.25

export function CalculadoraEvento({
  paquetes,
  elegido,
  onElegir,
  slug,
  perks,
}: {
  paquetes: PaqueteEvento[]
  /** [2026-08-07, Samuel: «que los avisos de los novios y la champaña vayan
   *  dentro del widget, no aparte fuera»] Las ventajas exclusivas de la landing
   *  (hoy solo bodas). Vivían en una card suelta encima de la calculadora, en
   *  pages/evento.tsx; entran aquí para que se lean CON el precio que las
   *  aplica, no antes de empezar a configurarlo. */
  perks?: { icono: string; texto: string }[]
  /** [v3 2026-08-06] La landing. Solo bodas aplica el perk de los novios
   *  gratis (WEBSITE-EVENTOS pag. 5), y el precio lo decide `data/eventos.ts`
   *  — aqui solo se pasa el dato para que el total del widget sea el mismo
   *  que cobrara el funnel. */
  slug?: 'party-boat' | 'weddings' | 'corporate'
  /** [v2 2026-07-28, 2ª vuelta] El paquete elegido SUBE a pages/evento.tsx:
   *  el bloque de paquetes de la columna izquierda marca el mismo que está
   *  activo aquí, y se puede elegir desde cualquiera de los dos. Mismo patrón
   *  que `variante` en la ficha de tour, que gobierna a la vez el widget y la
   *  tabla de precios del charter — dos piezas que hablan del mismo dato no
   *  pueden tener cada una el suyo. */
  elegido: string | null
  onElegir: (id: string) => void
}) {
  const conPrecio = paquetes.filter((p) => p.precioBase !== null)
  const [personas, setPersonas] = useState(12)

  if (conPrecio.length === 0) return null

  const idx = Math.max(
    0,
    conPrecio.findIndex((p) => p.id === elegido),
  )
  const paquete = conPrecio[idx]
  // Solo party boat y bodas se pagan online; MICE no tiene precio cerrado y
  // se queda en cotización — ahí el CTA sigue siendo el del prototipo.
  const varianteOdoo = esEventoReservable(slug) ? slugOdooDePaquete(paquete.id) : null
  const total = totalPaqueteEvento(paquete, personas, slug)
  const incluidas = paquete.incluyeHasta ?? 12
  const pagan = personasQuePagan(personas, slug)
  const extras = Math.max(0, pagan - incluidas)
  // [v3 2026-08-06, slide 79] ¿Se esta aplicando el regalo de los novios? Es
  // lo que hay que DECIR en pantalla: sin la linea, el total baja al pasar de
  // 13 a 14 invitados y parece un fallo de la calculadora.
  const novios = slug === 'weddings' && personas >= NOVIOS_GRATIS_DESDE

  return (
    // `widget-marco` (sombra INSET de 1px) y no `ring-1 ring-linea`, por el
    // mismo motivo que ya documenta widget-reserva.tsx: el ring de Tailwind se
    // pinta POR FUERA del borde, así que el contenedor de scroll de la columna
    // (lg:overflow-y-auto en pages/evento.tsx) lo recortaba a izquierda y
    // derecha — el borde se veía a trozos. Una sombra inset se dibuja DENTRO
    // de la caja y no hay overflow que pueda comérsela.
    <div className="flex flex-col gap-4 rounded-card-grande bg-papel p-4 widget-marco sm:p-5">
      <div>
        <p className="font-display text-lg font-semibold text-navy">{t('Book online')}</p>
        {/* Una línea, no dos (2026-07-28): cada línea que se ahorra aquí es
            una línea que la card de «¿tu evento no encaja?» gana para entrar
            sin scroll en una ventana de portátil. */}
        <p className="mt-0.5 text-sm text-navy-sub">{t('Fixed price, no waiting for a quote.')}</p>
      </div>

      {/* ── ELEGIR PAQUETE ───────────────────────────────────────────────
          Los 4 tienen precio publicado, así que los 4 son reservables
          directo; lo que necesita cotización es lo que se sale de estos
          paquetes (menú a medida, aforos grandes), y para eso está el
          formulario de abajo.

          [v2 2026-07-28, Samuel: «los paquetes, en vez de estar uno debajo
          del otro, se ven poco atractivos»] Eran 4 filas apiladas de nombre +
          precio: una lista de precios, no un menú de comida. Ahora son un
          SEGMENTED + una card de preview del paquete activo, que es
          exactamente el patrón que este proyecto ya resolvió para los 4 botes
          del charter (tour/sub-variante-picker.tsx) — mismo problema (elegir
          entre 4 cosas dentro de un widget angosto) y misma solución, así que
          en Figma es un componente con dos usos y no dos piezas parecidas.
          Gana en tres cosas a la vez:
            · APETITO — entra la foto del plato, que es lo que se vende. Un
              «US$ 780.00» en una fila gris no da hambre.
            · ALTURA — de ~242px a ~130px. Eso es lo que permite que la card
              «¿tu evento no encaja?» entre sin scroll (ver el porqué en
              widget-evento.tsx).
            · COMPARAR — al saltar de pestaña, el Total de abajo cambia en el
              sitio. Antes había 4 precios de lista a la vista pero ninguno
              era el TUYO (dependen del nº de invitados); ahora el número que
              se compara es el que se va a pagar.
          La etiqueta de la pestaña es `nombreCorto` (data/eventos.ts): a ~85px
          por pestaña, «Hispaniola Premium Package» no cabe ni a 12px. El
          nombre completo lo pinta la card de preview justo debajo, así que la
          abreviatura nunca aparece sola. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub" id="calc-label-paquete">
          {t('Package')}
        </span>
        <div
          role="tablist"
          aria-labelledby="calc-label-paquete"
          className="relative grid gap-1 rounded-full bg-linea p-1"
          style={{ gridTemplateColumns: `repeat(${conPrecio.length}, minmax(0, 1fr))` }}
        >
          {/* Thumb deslizante. La fórmula del ancho y del translateX es la
              MISMA que la del picker de botes, y la de allí está verificada a
              mano para N=2/3/4 — no se re-deriva aquí: contenedor con p-1
              (4px) y gap-1 (4px), así que una columna mide
              (100% - 8px - (N-1)*4px)/N y saltar idx columnas es
              idx × (100% + 4px), donde el 100% es UN ancho de thumb. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={{
              width: `calc((100% - 8px - ${(conPrecio.length - 1) * 4}px) / ${conPrecio.length})`,
              transform: idx > 0 ? `translateX(calc(${idx} * (100% + 4px)))` : 'translateX(0)',
            }}
          />
          {conPrecio.map((p) => {
            const activo = p.id === paquete.id
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => onElegir(p.id)}
                className={`relative z-10 flex items-center justify-center rounded-full px-0.5 py-2 text-center text-xs font-semibold leading-tight transition-colors sm:px-1 sm:text-sm ${
                  activo ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
                }`}
              >
                {p.nombreCorto}
              </button>
            )
          })}
        </div>

        {/* Preview del paquete activo: foto del plato + nombre completo +
            los primeros platos del menú. El PRECIO no se repite aquí a
            propósito — está 60px más abajo en el desglose, con su total
            real; ponerlo dos veces en la misma tarjeta es ruido. */}
        <div className="mt-2 flex items-center gap-3 rounded-card bg-papel-hueso p-2">
          {paquete.foto ? (
            <img
              src={`/fotos/${paquete.foto}.webp`}
              alt={paquete.fotoAlt}
              loading="lazy"
              className="size-14 shrink-0 rounded-btn object-cover"
            />
          ) : (
            <span className="grid size-14 shrink-0 place-items-center rounded-btn bg-linea">
              <Package className="size-6 text-navy-soft" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{paquete.nombre}</p>
            <p className="truncate text-xs text-navy-soft">
              {paquete.capacidad} · {paquete.meta}
            </p>
            {paquete.items.length > 0 ? (
              <p className="truncate text-xs text-navy-sub">
                {/* Dos y no tres: al tercero ya no le queda ancho y se
                    cortaba a mitad de palabra («Shrimp Sk…»), que es peor
                    que no ponerlo. El menú completo está en la sección de
                    paquetes de la izquierda. */}
                {paquete.items
                  .slice(0, 2)
                  .map((it) => it.titulo)
                  .join(' · ')}
                {paquete.items.length > 2 ? ` +${paquete.items.length - 2}` : ''}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Personas. Arranca en 12 (el tope del precio base) a propósito: es el
          número donde el paquete rinde más, y así el primer total que ve el
          visitante es el de la tarifa cerrada, sin extras. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub">{t('Guests')}</span>
        {/* [2026-08-07, Samuel] MISMO ORDEN que el stepper de la ficha de tour y
            que el del widget de evento: el número va pegado al icono y hace
            frase con él («12 guests»), con los −/+ solos a la derecha. Aquí
            estaba al revés —icono + «Invitados» a la izquierda y el número
            suelto junto a los botones—, así que de los cinco steppers del sitio
            este era el único que se leía distinto. Ahora los cinco son la misma
            pieza, que es lo que tiene que llegar a Figma. */}
        <div
          role="group"
          aria-label={t('Number of guests')}
          className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5"
        >
          <span className="flex items-center gap-1 text-paragraph-sm text-text-strong-950">
            <Users className="mr-1 size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
            {/* Sin tope: el tarifario de eventos es marginal (base hasta 12 +
                US$ 99 por cabeza) y no publica aforo máximo — igual que el
                botón «+», que tampoco se deshabilita nunca. El único freno es
                el de 4 dígitos del propio campo. */}
            <NumeroEditable
              valor={personas}
              min={1}
              max={Number.POSITIVE_INFINITY}
              onCambio={setPersonas}
              etiqueta={t('Number of guests')}
              className="tabular-nums"
            />
            {t(personas === 1 ? 'guest' : 'guests')}
          </span>
          <div className="flex items-center gap-1">
            <CompactButton.Root
              type="button"
              variant="stroke"
              fullRadius
              aria-label={t('Remove one guest')}
              disabled={personas <= 1}
              onClick={() => setPersonas((n) => Math.max(1, n - 1))}
              className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
            >
              <CompactButton.Icon as={Minus} />
            </CompactButton.Root>
            <CompactButton.Root
              type="button"
              variant="stroke"
              fullRadius
              aria-label={t('Add one guest')}
              onClick={() => setPersonas((n) => n + 1)}
              className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
            >
              <CompactButton.Icon as={Plus} />
            </CompactButton.Root>
          </div>
        </div>
      </div>

      {/* LOS PERKS DE LA LANDING (hoy solo bodas: novios gratis desde 14 y
          brindis de champagne). Van AQUÍ, entre el contador y el desglose, y no
          en una card aparte encima del widget (Samuel, 2026-08-07). El sitio no
          es cosmético: el primero de los dos es una regla que depende del número
          de invitados que se acaba de teclear arriba, y su efecto se cobra en la
          línea «Bride & Groom sail free» del desglose de abajo. Entre las dos
          cosas, el aviso se lee como parte de la cuenta.
          Menta y no oro: es un regalo incluido, el mismo idioma de ahorro que
          el sitio ya usa para lo que no se paga (el chip de descuento del
          widget de tours, la línea de novios del desglose). El oro está
          reservado para lo que SUMA al total. */}
      {/* [2026-08-07, 2ª vuelta — Samuel: «los textos de los perks un poco más
          pequeños»] Bajan de text-sm a text-xs. Dentro del widget ya no son el
          titular que eran cuando vivían en su propia card: son una nota al pie
          de la cuenta, y a 14px pesaban lo mismo que el desglose que hay justo
          debajo. `leading-relaxed` porque las dos frases ocupan dos renglones
          y a 12px sin aire se apelmazan. El emoji baja con ellos —a 16px sobre
          texto de 12 quedaba enorme— pero se queda un punto por encima
          (text-sm): es la marca que hace la lista escaneable. */}
      {perks?.length ? (
        <div className="flex flex-col gap-1.5 rounded-card bg-menta p-3">
          {perks.map((perk) => (
            <p
              key={perk.texto}
              className="flex items-start gap-2 text-xs leading-relaxed text-navy"
            >
              <span aria-hidden="true" className="text-sm leading-relaxed">
                {perk.icono}
              </span>
              <span className="font-medium">{perk.texto}</span>
            </p>
          ))}
        </div>
      ) : null}

      {/* Desglose. Se enseña SIEMPRE, no solo cuando hay extras: que el
          visitante vea de dónde sale el total es la mitad del argumento de
          reservar directo. */}
      {total !== null ? (
        <div className="flex flex-col gap-1.5 border-t border-linea pt-3 text-sm">
          <div className="flex justify-between text-navy-sub">
            <span>{t('Package (up to')}{' '}{incluidas} {t('guests)')}</span>
            <span className="tabular-nums">{formatoDinero(paquete.precioBase!)}</span>
          </div>
          {extras > 0 ? (
            <div className="flex justify-between text-navy-sub">
              <span>
                {extras} {extras === 1 ? t('extra guest') : t('extra guests')} ×{' '}
                {formatoDinero(paquete.porPersonaExtra ?? 0)}
              </span>
              <span className="tabular-nums">
                {formatoDinero(extras * (paquete.porPersonaExtra ?? 0))}
              </span>
            </div>
          ) : null}
          {/* [v3 2026-08-06, slide 79] La linea que evita que el total parezca
              un error: al pasar de 13 a 14 invitados el precio BAJA, porque
              los dos ultimos son los novios y no pagan. Se dice como linea de
              descuento del desglose, en el idioma de ahorro del sitio. */}
          {novios ? (
            <div className="flex justify-between font-medium text-menta-texto">
              <span>{t('Bride & Groom sail free')}</span>
              <span className="tabular-nums">
                −{formatoDinero(2 * (paquete.porPersonaExtra ?? 0))}
              </span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between border-t border-linea pt-2 font-display text-lg font-semibold text-navy">
            <span>{t('Total')}</span>
            <span className="tabular-nums">{formatoDinero(total)}</span>
          </div>
          <p className="text-xs text-navy-soft">
            {t('You book with')}{' '}{DEPOSITO * 100}% ({formatoDinero(Math.round(total * DEPOSITO))}{t(') and pay the rest on the day of the event.')}
          </p>
        </div>
      ) : null}

      {/* El paquete viaja como `variante` —que es lo que Odoo cotiza— y el
          número de invitados como `personas`. El funnel no recalcula: abre el
          pedido con esto y le pregunta el precio al servidor. */}
      {varianteOdoo ? (
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <Link to={`/book/${slug}?variante=${varianteOdoo}&personas=${personas}`}>
            {t('Book this package')}
          </Link>
        </FancyButton.Root>
      ) : (
        <EnlacePrototipo>
          <FancyButton.Root variant="primary" className="w-full" asChild>
            <span>{t('Book this package')}</span>
          </FancyButton.Root>
        </EnlacePrototipo>
      )}
    </div>
  )
}
