import { Clock3, Flame, Leaf, Soup, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { DESCUENTOS, DESCUENTO_MAXIMO } from '@/lib/tarifas'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// «Antes de reservar» — UN SOLO BLOQUE con todo lo del slide 2 (plan 01 §7).
//
// 2026-07-28, pedido de Samuel: «todo esto está repartido en distintas
// secciones del contenido… que no esté disperso, que esté todo en un mismo
// bloque, como en la referencia». Y tiene razón: la corrección del cliente era
// UNA captura de media página de su web —duración, paquetes para grupos,
// descuentos y cómo se cocina—, y al aplicarla pieza por pieza se había
// desparramado en cuatro sitios distintos de la ficha:
//   · la duración «3 o 4 horas»  → encabezado de la tabla de precios
//   · cómo se cocina             → al pie del bloque de menú
//   · los descuentos 5+5+5       → sección propia (descuentos-tour.tsx)
//   · paquetes para grupos       → sección suelta dentro de pages/tour.tsx
// Los cuatro sitios se retiran y viven aquí. En Figma esto es UN componente,
// no cuatro parches repartidos por la página.
//
// El DISEÑO no copia la referencia (esa es la estética de la web vieja: banda
// negra a rayas, caja naranja, letra pequeña centrada). La composición es
// propia y de arriba abajo: franja de duración → los dos paneles que deciden
// la compra (lo que ahorras · cómo se cocina) → banda navy de cierre para el
// grupo grande. Dos superficies claras enmarcadas por dos franjas, para que se
// lea como una sola pieza y no como cuatro cards apiladas.
//
// ⚠️ SE PINTA EN LOS 4 TOURS 'completo', no solo en charter, y las piezas se
// encienden por DATO (¿hay duraciones distintas por bote? ¿hay notas de
// cocina? ¿hay enlace a grupos?). El motivo es el de siempre: el chip del
// widget promete «ahorras hasta 15%» en TODAS las fichas, así que la
// explicación de ese 15% tiene que existir en todas. En semi-privado y
// snorkel-lovers este bloque es solo el panel de descuentos.

const ICONO_COCINA: Record<string, LucideIcon> = {
  condimentos: Soup,
  parrilla: Flame,
  dietas: Leaf,
}

const ETIQUETA = 'text-eyebrow font-semibold uppercase tracking-wide'

export function AntesDeReservar({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  const cocina = ficha.menuCharter?.cocina ?? []

  // «Cruceros privados de 3 o 4 horas», la banda que encabezaba la ficha real
  // del charter. Se DERIVA en vez de escribirse: solo tiene sentido cuando los
  // botes declaran duraciones distintas —es decir, cuando la duración se ELIGE
  // con el barco—. Isla Saona también tiene sub-variantes, pero las tres son el
  // día completo y no declaran duración, así que allí no se pinta.
  const duraciones = new Set(
    (ficha.subVariantes ?? []).map((s) => s.duracion).filter((d): d is string => Boolean(d)),
  )
  const hayDuracionElegible = duraciones.size > 1

  // El enlace a los paquetes de grupo es de charter y solo de charter: en la
  // web original ese botón vive en SU ficha y lleva a Eventos (confirmado por
  // el cliente en la reunión, 12:24). Se ata al slug, que es el dato que lo
  // hace verdad, y no a `booking`.
  const conGrupos = tour.slug === 'private-charter'

  return (
    <section id="ancla-antes-de-reservar" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Antes de reservar</TituloSeccion>
      <p className="mt-2 max-w-2xl text-navy-sub">
        Lo que conviene saber del barco, de la cocina y del precio — junto y sin letra pequeña.
      </p>

      {/* FRANJA DE DURACIÓN. Va arriba del todo porque es lo primero que
          decide el visitante de un charter: cuántas horas quiere navegar. */}
      {hayDuracionElegible ? (
        <div className="mt-6 flex items-center gap-3 rounded-card bg-papel-hueso px-4 py-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark"
          >
            <Clock3 className="size-4" />
          </span>
          <p className="text-sm text-navy-sub">
            <strong className="font-semibold text-navy">
              Cruceros privados de {ficha.duracion}
            </strong>{' '}
            — la duración va con el barco que elijas.
          </p>
        </div>
      ) : null}

      {/* LOS DOS PANELES. En lg van lado a lado y a la misma altura
          (items-stretch por defecto en grid): lo que ahorras a la izquierda,
          cómo se cocina a la derecha. Si el tour no trae notas de cocina
          (semi-privado, snorkel-lovers), el de descuentos ocupa el ancho
          completo en vez de quedarse a media caja con un hueco al lado. */}
      <div className={`mt-4 grid gap-4 ${cocina.length > 0 ? 'lg:grid-cols-2' : ''}`}>
        {/* ── LO QUE AHORRAS ──────────────────────────────────────────────
            Fondo MENTA, que es el idioma de ahorro que el sitio ya tiene: el
            mismo par menta/menta-texto del chip «ahorras hasta 15%» que está
            pegado al CTA del widget. Deliberadamente NO se usa la piel premium
            (oscuro/oro): ese lenguaje está reservado al menú Premium, que es
            el diferenciador que el cliente quiere que salte a la vista
            (slide 4) — un segundo bloque negro en la misma página se lo comería.

            ⚠️ ARREGLO DE HONESTIDAD, no un adorno. El chip del widget lleva
            desde la Fase B prometiendo un 15% que ninguna otra parte del sitio
            explicaba. Esto es esa explicación, y por eso los porcentajes salen
            de DESCUENTOS (lib/tarifas.ts) —el mismo array que aplica el
            descuento al cobrar— en vez de escribirse a mano. */}
        <div className="flex flex-col rounded-card-grande bg-menta p-5 sm:p-6">
          <p className={`${ETIQUETA} text-menta-texto`}>Reservando directo</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-[2.75rem] font-semibold leading-none text-menta-texto">
              {DESCUENTO_MAXIMO}%
            </span>
            <span className="text-sm text-navy-sub">de descuento máximo</span>
          </p>
          <p className="mt-2 text-sm text-navy-sub">
            Los tres se <strong className="font-semibold text-navy">suman</strong>: si cumples los
            tres, pagas un {DESCUENTO_MAXIMO}% menos sobre la tarifa de lista.
          </p>

          <ul className="mt-5 flex flex-col gap-3 border-t border-menta-texto/15 pt-4">
            {DESCUENTOS.map((d) => (
              <li key={d.id} className="flex items-baseline gap-3">
                <span className="w-9 shrink-0 font-display text-lg font-semibold text-menta-texto">
                  {d.porcentaje}%
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-navy">{d.etiqueta}</span>
                  {/* El «cliente que repite» se MUESTRA pero no se auto-aplica:
                      el sitio no tiene cuentas ni login, así que no puede
                      verificar que alguien haya comprado antes, y una casilla
                      libre de «ya he venido» la marcaría todo el mundo. Lo
                      aplica el equipo al confirmar, y eso se dice en pantalla
                      en vez de esconderse. */}
                  {!d.autoAplicable ? (
                    <span className="mt-0.5 block text-xs text-navy-soft">
                      Lo aplicamos al confirmar — dinos que ya has navegado con nosotros.
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CÓMO SE COCINA ──────────────────────────────────────────────
            De las 4 piezas del slide 2, la única que no existía en ninguna
            parte del sitio nuevo. La tercera nota es la que vale: parrilla
            separada para evitar contaminación cruzada responde una pregunta
            con la que se pierden reservas (alergias, celiaquía, vegetarianos)
            y ningún competidor de Punta Cana la publica. */}
        {cocina.length > 0 ? (
          <div className="flex flex-col rounded-card-grande bg-fondo-ficha p-5 sm:p-6">
            <p className={`${ETIQUETA} text-navy-soft`}>Cómo se cocina</p>
            <ul className="mt-4 flex flex-col gap-4">
              {cocina.map((c) => {
                const Icono = ICONO_COCINA[c.id] ?? Soup
                return (
                  <li key={c.id} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark"
                    >
                      <Icono className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy">{c.titulo}</span>
                      <span className="mt-0.5 block text-sm text-navy-soft">{c.texto}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {/* ── BANDA DE CIERRE: GRUPO GRANDE ───────────────────────────────
          Cierra el bloque en navy —el mismo idioma que la banda de cierre de
          las landings de evento— porque es la única salida del bloque: un
          enlace que se lleva al visitante a otra página. Los 4 paquetes de
          comida (1.188 / 660 / 780 / 900) NO se duplican aquí: viven en
          Eventos, y este botón solo enlaza, igual que en la web original. */}
      {conGrupos ? (
        <div className="mt-4 flex flex-col gap-4 rounded-card-grande bg-navy p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-aqua-claro"
            >
              <Users className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-white">
                ¿Vienen en grupo grande?
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                Para celebraciones, bodas y eventos de empresa tenemos paquetes cerrados con menú,
                barra libre y el barco entero para ustedes.
              </p>
            </div>
          </div>
          <Link
            to="/events/party-boat"
            className="shrink-0 self-start rounded-full bg-coral px-6 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110 sm:self-auto"
          >
            Ver los paquetes para grupos
          </Link>
        </div>
      ) : null}
    </section>
  )
}
