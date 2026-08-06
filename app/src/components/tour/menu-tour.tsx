import { Check, UtensilsCrossed, Plus } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { CartaCharter } from '@/components/tour/carta-charter'
import { formatoDinero, type Tour } from '@/data/home'
import type { FichaTour, PlatoBuffet, PlatoMenu } from '@/data/tours'

// «Tu menú, a tu elección» (wireframe A4) — el diferenciador estrella: fotos
// reales de los platos, un activo que ningún competidor tiene. Solo en
// 'completo': charter cotiza su menú a medida.
//   - Si la ficha tiene menuBuffet (Saona, v3 2026-07-17): formato buffet
//     con lista de platos + add-on opcional. Misma cabecera y misma nota de
//     langosta al pie, sin comparador Light/Premium (Saona no se vende por
//     menú — se vende por BOTE, vía subVariantes en el widget).
//   - Si no: el modelo clásico con comparador Light/Premium.
//
// 2026-07-17 (2ª pasada, feedback de Samuel: "el apartado de los menús me
// parece rarísimo"): antes eran 4 fotos sueltas + 2 listas de texto. Se
// reorganizó POR PAQUETE — un bloque Light y un bloque Premium, cada uno con
// TODOS sus platos como cards con foto.
//
// 2026-07-17 (Fase B): la COMPARACIÓN de paquetes se FUNDE aquí (decisión de
// Samuel — en vez de una sección aparte, que solaparía con este menú). Arriba,
// un comparador de 2 columnas Light vs Premium (precio de lista + nº de platos
// + «todo el tour incluido»), con el mismo tratamiento LIGERO que la barra de
// KPIs (hairlines sobre blanco, no una card gris más); debajo, los platos de
// cada paquete con foto. El mensaje clave: el tour es idéntico, lo ÚNICO que
// cambia es el menú.
// ⚠️ La versión ANTERIOR de esta caja (sin comparador, con precio + conteo en
// la cabecera de cada bloque) queda guardada en el commit c23249a por si Samuel
// quiere volver: `git checkout c23249a -- app/src/components/tour/menu-tour.tsx`.
//
// ⚠️ Premium se lee con su tarifa de lista (US$ 114) y el delta «+US$ 15» como
// apoyo — mismo idioma que el widget de Fase B (precio de lista, no anclado en
// el descuento).

// [v2 2026-07-27] DE 4 COLUMNAS A 3 (reunión 07-24, 24:29 — Samuel: «en vez de
// que sean cuatro columnas que sean tres, para que la comida sea más grande»,
// y Miguel justo antes: «la comida tiene que llamar la atención»). Con menos
// columnas cada foto ocupa más ancho, que es exactamente lo que el cliente
// pedía. Sube también el alto de la foto (h-28 → h-36) para que la card no
// quede desproporcionada al ensancharse.
const GRID_PLATOS = 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'

function PlatoCard({ plato, piel = 'claro' }: { plato: PlatoMenu; piel?: 'claro' | 'premium' }) {
  const oscuro = piel === 'premium'
  return (
    // [v2 2026-07-28, pedido de Samuel: «que lo que esté dorado sea la card como
    // tal, no el contenedor padre»] En premium, LA CARD es la pieza oscura y
    // dorada: trae su propio fondo profundo, su luz y su hairline de oro
    // (`.premium-card`). Antes el color lo ponía el contenedor y estas cards
    // solo se teñían por dentro, así que el oro no marcaba nada — sobre un
    // bloque entero en negro, lo oscuro deja de significar «premium».
    // `ring` solo en la piel clara: `.premium-card` ya dibuja su filo con un
    // inset, y superponer los dos daba un doble borde a contraluz.
    // [v2 2026-07-28, pedido de Samuel] Cuatro cambios sobre la card de plato:
    //  · `p-2` — la foto deja de ir a sangre. Con la imagen pegada a los cuatro
    //    lados, la card no se leía como una card sino como una foto con una
    //    tira de texto debajo; el aire es lo que la convierte en objeto.
    //  · La foto lleva AHORA SU PROPIO radio en las 4 esquinas. Antes las de
    //    abajo eran rectas y solo las de arriba parecían redondeadas, porque el
    //    redondeo lo ponía el `overflow-hidden` del contenedor. Ese recorte ya
    //    no hace falta y se retira: nada sobresale.
    //  · Sombra en las dos pieles. La clara la pone `shadow-card` (el token del
    //    sistema); la premium ya la trae dentro de `.premium-card`.
    //  · Borde dorado en la premium.
    <figure
      className={`relative rounded-card p-2 ${
        oscuro
          ? 'premium-card border border-premium-oro/55'
          : 'bg-papel shadow-card ring-1 ring-linea'
      }`}
    >
      {plato.foto ? (
        <img
          src={`/fotos/${plato.foto}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-36 w-full rounded-lg object-cover"
        />
      ) : (
        // [v2] El fallback también cambia de piel: sobre el bloque oscuro, el
        // aqua-tint claro se leía como un agujero blanco justo en los platos
        // estrella del Premium (Surf & Turf y Vegetariano, que siguen sin foto
        // en alta).
        <div
          className={`grid h-36 w-full place-items-center rounded-lg ${
            oscuro ? 'bg-premium-fondo text-premium-oro' : 'bg-aqua-tint text-aqua-dark'
          }`}
        >
          <UtensilsCrossed className="size-6" aria-hidden="true" />
        </div>
      )}
      {/* [v2] El Kid's Meal vive DENTRO del menú (así está en la web original,
          como una tarjeta más), no en una carta aparte. El chip es lo que lo
          distingue sin sacarlo de su sitio. */}
      {plato.soloNinos ? (
        <span className="absolute left-3.5 top-3.5 rounded-full bg-navy px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Niños
        </span>
      ) : null}
      <figcaption className="px-1.5 pb-1 pt-2.5">
        <p
          className={`font-display text-sm font-semibold ${
            oscuro ? 'text-premium-texto' : 'text-navy'
          }`}
        >
          {plato.nombre}
        </p>
        {plato.desc ? (
          <p className={`mt-0.5 text-xs ${oscuro ? 'text-premium-texto-suave' : 'text-navy-soft'}`}>
            {plato.desc}
          </p>
        ) : null}
      </figcaption>
    </figure>
  )
}

// Un bloque de platos por paquete. Fondo gris clarito y SIN borde (2026-07-17,
// Samuel): antes era card blanca con borde igual que el bloque padre — se
// confundían. La cabecera lleva el NOMBRE del menú y, en columna a la
// derecha, el precio (US$ X para Light, +US$ Y para Premium, sin precio
// para el menú Niños — incluido en la tarifa de niño). Es el idioma que
// Samuel pidió el 2026-07-17: «quita la comparativa, y deja que cada
// menú diga su precio (Light = US$ 99, Premium = +US$ 15)» — fija el
// anti bait-and-switch sin necesitar la tabla comparativa de Fase B.
/** [v2 2026-07-27] Texto de las celdas fantasma del menú Light — las casillas
 *  en línea discontinua que enseñan lo que ese paquete NO trae (slide 19).
 *
 *  Se DERIVAN de los propios arrays: cuántos platos de más tiene el Premium y
 *  cuáles son los dos primeros que se pierde. Nada hardcodeado, así que si
 *  cambian los menús el texto sigue siendo verdad. */
function fantasmasLight(ficha: FichaTour): string[] {
  const diferencia = ficha.menuPremium.length - ficha.menuLight.length
  if (diferencia <= 0) return []
  const estrellas = ficha.menuPremium
    .slice(0, 2)
    .map((p) => p.nombre)
    .join(', ')
  const celdas = [`${estrellas} y ${diferencia - 2} platos más, en el Premium`]
  const hayVeg = ficha.menuPremium.some((p) => /vegetarian/i.test(p.nombre))
  if (hayVeg) celdas.push('Opciones vegetarianas, en el Premium')
  return celdas
}

// [v2 2026-07-27] `piel` decide claro u oscuro (slide 4: «el Premium que tenga
// colores como negros, como de lujo… debe notarse SOBRE TODO en las fotos del
// menú, que es donde está la diferencia», y slides 18/19 con las dos maquetas).
// El bloque Premium va en modo oscuro/oro y el Light se queda claro — el
// contraste entre los dos ES el mensaje.
function PaqueteMenu({
  nombre,
  precio,
  platos,
  piel = 'claro',
  fantasmas,
  badge,
}: {
  nombre: string
  precio?: string
  platos: PlatoMenu[]
  piel?: 'claro' | 'premium'
  /** Celdas vacías que enseñan lo que NO trae este paquete. */
  fantasmas?: string[]
  badge?: string
}) {
  const oscuro = piel === 'premium'
  return (
    // [v2 2026-07-28] El CONTENEDOR ya no cambia de piel: gris claro del sitio
    // en los dos paquetes. El slab negro que envolvía al Premium se comía la
    // sección entera —y con 7 platos en rejilla de 3 dejaba un hueco negro
    // enorme abajo— además de aplanar las cards, que quedaban dentro de algo
    // del mismo color. Quien viste de premium ahora es cada card.
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-linea pb-3">
        <h3 className="flex items-center gap-2.5 font-display text-h3 font-semibold text-navy">
          Menú {nombre}
          {/* Mismo metal que el badge del comparador y el thumb del selector:
              una sola pieza de oro en todo el sistema. */}
          {badge ? (
            <span className="premium-metal rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-premium-fondo">
              {badge}
            </span>
          ) : null}
        </h3>
        {precio ? (
          <span
            // El precio del Premium se queda en oro —oscuro, para que lea sobre
            // gris claro— porque es el único sitio de la cabecera donde el
            // acento sigue aportando: marca el «+US$ 15» frente al total Light.
            className={`shrink-0 font-display text-lg font-semibold ${
              oscuro ? 'text-premium-oro-oscuro' : 'text-navy'
            }`}
          >
            {precio}
          </span>
        ) : null}
      </div>
      <div className={`grid gap-3 ${GRID_PLATOS}`}>
        {platos.map((p) => (
          <PlatoCard key={p.nombre} plato={p} piel={piel} />
        ))}
        {/* CELDAS FANTASMA (slide 19). Es la mejor idea de todo el PowerPoint
            del cliente: en el menú Light, celdas en línea discontinua que
            dicen lo que te estás perdiendo. Enseña el upsell sin mentir y sin
            ocultar nada — y se GENERA del propio dato, no se escribe a mano. */}
        {fantasmas?.map((f) => (
          <div
            key={f}
            className="flex items-center justify-center rounded-card border border-dashed border-linea-fuerte p-4 text-center text-xs font-medium text-navy-soft"
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}

// Bloque BUFFET (v3 2026-07-17, Saona): una lista de platos servidos en la
// propia isla + el add-on opcional de langosta premium. Sin cards con foto
// (la comida del buffet no se ha fotografiado) y sin comparador Light/Premium
// (Saona no se vende por menú — se vende por BOTE).
function MenuBuffet({ platos, addOn }: { platos: PlatoBuffet[]; addOn?: { nombre: string; precio: number; descripcion?: string } }) {
  return (
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <h3 className="mb-4 border-b border-linea pb-3 font-display text-h3 font-semibold text-navy">
        Buffet en Isla Saona
      </h3>
      <ul className="flex flex-col gap-2.5">
        {platos.map((p) => (
          <li key={p.nombre} className="flex items-start gap-2.5 text-sm text-navy">
            <Check className="mt-0.5 size-4 shrink-0 text-menta-texto" aria-hidden="true" />
            <span>
              <span className="font-semibold">{p.nombre}</span>
              {p.desc ? <span className="text-navy-soft"> · {p.desc}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      {addOn ? (
        <div className="mt-4 flex items-center gap-3 rounded-card border border-linea bg-papel p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
            <Plus className="size-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">
              {addOn.nombre} · {formatoDinero(addOn.precio)}{' '}
              <span className="text-xs font-normal text-navy-soft">por persona</span>
            </p>
            {addOn.descripcion ? <p className="mt-0.5 text-xs text-navy-soft">{addOn.descripcion}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

// [v2 2026-07-28] El bloque CHARTER ya no vive aquí: era una lista de checks
// en dos columnas —el mismo tratamiento que «Qué incluye»— para el producto
// más caro del catálogo, mientras el semi-privado enseñaba LOS MISMOS platos
// con foto. Samuel: «me parece sumamente poco atractiva… es importante para
// que las personas se enamoren y compren». Ahora es una CARTA con fotos
// reales y retícula asimétrica: tour/carta-charter.tsx.
//
// Las notas de cocina (condimentos · parrilla en la cocina flotante ·
// restricciones dietéticas sin contaminación cruzada) también pasaron por
// aquí y se mudaron a «Antes de reservar» (antes-de-reservar.tsx), donde el
// slide 2 del cliente vive entero y en un solo bloque.

export function MenuTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  // v3 (2026-07-17, Saona): si la ficha tiene menuBuffet, pintamos formato
  // buffet + add-on en vez del comparador Light/Premium clásico. Saona no
  // se vende por menú, se vende por BOTE (subVariantes en el widget) — el
  // menú es el mismo en las 3 sub-variantes.
  const esBuffet = ficha.menuBuffet !== undefined
  // v3 (2026-07-17, charter-privado): si la ficha tiene menuCharter,
  // pintamos el menú transversal (7 platos + 1 add-on). Misma idea que el
  // buffet de Saona — formato distinto al Light/Premium clásico.
  const esCharter = ficha.menuCharter !== undefined

  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      {/* [v3 2026-08-06, WEBSITE-TOURS pág. 5] Título y bajada APROBADOS para
          el menú por paquete («Your table comes with an ocean view»), que es
          el caso del semi-privado y de Snorkel Lovers — el mismo copy aparece
          en las dos fichas del documento, así que se escribe UNA vez aquí y
          no dos en data. Los otros dos formatos (buffet de Saona, menú a
          medida del charter) siguen en español hasta su commit de F3. */}
      <TituloSeccion>
        {esBuffet ? 'El menú del día' : esCharter ? 'El menú a medida' : 'Your table comes with an ocean view'}
      </TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        {esBuffet
          ? 'Buffet típico dominicano servido en la propia isla, con parada en la piscina natural antes y después.'
          : esCharter
            ? 'Cada persona elige su plato al reservar, recién hecho a bordo — no buffet recalentado.'
            : 'Select your favorite dish when you book. Our chefs prepare every meal fresh on board, turning lunch into one of the highlights of your day.'}
      </p>

      {esBuffet ? (
        <div className="mt-4">
          <MenuBuffet platos={ficha.menuBuffet!.platos} addOn={ficha.menuBuffet!.addOn} />
        </div>
      ) : ficha.menuCharter ? (
        // v3 (2026-07-17, charter completo): los 7 platos transversales + 1
        // add-on de langosta premium. El menú es el mismo en los 4 botes — lo
        // que cambia es el BARCO (selector en el widget, tabla de precios por
        // pax). [v2 2026-07-28] Ya no es una lista con checks envuelta en una
        // caja gris con su propio h3: la carta ocupa el bloque entero, y el
        // título de la sección (arriba) es el único que hay. Ese h3 repetía
        // «El menú a medida» dos veces con 40px de diferencia.
        <div className="mt-4">
          <CartaCharter menu={ficha.menuCharter} etiqueta={tour.nombre} />
        </div>
      ) : (
        // v3 (2026-07-17, pedido de Samuel): se QUITA el comparador de
        // paquetes y se QUITA la opción Light/Premium del widget. El menú
        // único pinta los 7 platos del Premium (Snorkel Lovers) o 2 Light
        // + 7 Premium (Semi-privado). Si `menuLight` está VACÍO, no se
        // pinta el bloque Light y el bloque Premium se renombra a "Tu menú"
        // (sin la coletilla "Premium" — no hay diferenciador al que
        // contraponerse).
        <div className="mt-4 flex flex-col gap-4">
          {/* [v2 2026-07-27] PREMIUM PRIMERO. El cliente quiere que el salto a
              Premium se note, y el orden es parte de eso: el bloque oscuro
              abre la sección y el Light queda debajo como la alternativa
              sobria. El Light NO se castiga —sigue siendo el precio ancla del
              sitio— pero deja de ser lo primero que se lee. */}
          <PaqueteMenu
            // v3 (2026-07-17, pedido de Samuel): el nombre del menú único de
            // snorkel-lovers pasa a ser "Hispaniola" (sin coletilla "Tu menú"
            // que se leía redundante con el "Menú " que prepende el
            // componente). El bloque se pinta "Menú Hispaniola" — más
            // natural, y refuerza la marca del operador.
            nombre={ficha.menuLight.length > 0 ? 'Premium' : 'Hispaniola'}
            precio={
              ficha.menuLight.length > 0 && ficha.upgradePremium !== null
                ? `+${formatoDinero(ficha.upgradePremium)}`
                : tour.precioLight !== null
                  ? formatoDinero(tour.precioLight)
                  : undefined
            }
            platos={ficha.menuPremium}
            // Solo va oscuro cuando HAY comparación que hacer. En Snorkel
            // Lovers, que tiene menú único, un bloque negro no diría nada —
            // no hay Light contra el que contrastar.
            piel={ficha.menuLight.length > 0 ? 'premium' : 'claro'}
            badge={ficha.menuLight.length > 0 ? 'El más elegido' : undefined}
          />
          {ficha.menuLight.length > 0 ? (
            <PaqueteMenu
              nombre="Light"
              precio={tour.precioLight !== null ? formatoDinero(tour.precioLight) : undefined}
              platos={ficha.menuLight}
              // Las celdas fantasma se GENERAN del dato: tantas como platos de
              // diferencia haya entre los dos menús, con un tope de 2 para que
              // no llenen la rejilla de huecos. Si mañana cambia el número de
              // platos, esto se ajusta solo.
              fantasmas={fantasmasLight(ficha)}
            />
          ) : null}
        </div>
      )}

      <p className="mt-3 text-xs text-navy-soft">
        * Langosta se sustituye por langostino salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
