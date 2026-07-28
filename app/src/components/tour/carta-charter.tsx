import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import { formatoDinero } from '@/data/home'
import type { MenuCharterTour } from '@/data/tours'

// LA CARTA DEL CHARTER — «El menú a medida».
//
// 2026-07-28, Samuel: «la sección de menú a medida me parece sumamente poco
// atractiva… esfuérzate, es importante para que las personas se enamoren y
// compren». Y era verdad: el charter enseñaba sus 7 platos como una lista de
// checks en dos columnas —el mismo tratamiento que «Qué incluye»— mientras el
// semi-privado, con los MISMOS platos de la MISMA cocina, los enseñaba con
// foto. El producto más caro del catálogo tenía la peor carta de la web.
//
// Lo que cambia y por qué:
//
//  1. FOTOS REALES en vez de viñetas. Las 4 que existen ya vivían en el repo
//     (las usa el menú Premium del semi-privado): mismo operador, misma cocina
//     flotante, mismos nombres y mismas descripciones. No se ilustra un plato
//     con la foto de otro. Es además lo que el cliente pide en el slide 4 («la
//     comida tiene que llamar la atención», «las fotos de los platos las
//     haremos de nuevo y en alta calidad»): cuando lleguen las nuevas, se
//     cambia el nombre del archivo y esta rejilla las luce sin tocar nada.
//
//  2. SEIS CELDAS IGUALES, 3×2. El Surf & Turf sigue abriendo la carta —es lo
//     primero que se lee— pero ya no por tamaño.
//     [2026-07-28, 2ª vuelta] Nació ocupando 2×2 y Samuel lo cortó: «tiene
//     mucho protagonismo». Tenía razón, y al ir a mirarlo apareció una razón
//     TÉCNICA que obliga igual: los bodegones del cliente miden 368×224 px.
//     Estirado a doble ancho, el Surf & Turf pedía ~550 px de foto (1.100 en
//     un retina) y se veía reventado — el mismo problema que el plan ya había
//     detectado para el slider del mosaico. A tres columnas cada celda mide
//     ~270 px y la foto va POR DEBAJO de su resolución nativa, que es donde
//     una foto se ve nítida.
//     La sexta celda no es relleno: es la mecánica de la carta (quién elige y
//     cuándo), que antes colgaba como un renglón suelto al pie. Puesta ahí,
//     cuadra la retícula y se lee dentro del mismo golpe de vista.
//
//  3. LAS 3 BROCHETAS, EN UNA CELDA. Son una familia dentro de la carta, no
//     tres platos sueltos, y agrupadas evitan tres huecos en la retícula.
//     ⚠️ Su foto es [placeholder-v2] — ver el comentario en data/tours.ts.
//
//  4. LA LANGOSTA, EN LÁMINA DE ORO. Es el único upsell del menú (US$ 30 por
//     persona al check-out) y ahora se ve como tal.
//     [2026-07-28, 2ª vuelta] Nació en la piel oscura del menú Premium y
//     Samuel la devolvió: «se ve solo negro y ya queda raro, tal vez hacerlo
//     dorado». El diagnóstico es correcto — esa piel está pensada para una
//     SUPERFICIE grande (un bloque de menú entero, con fotos y cifras que la
//     sostienen); en una franja de 80px el casi-negro se queda en un
//     rectángulo apagado y del oro solo sobrevive un hairline al 22%. Ahora es
//     un degradado de oro con tinta negra encima —pan de oro, no bloque
//     oscuro— y una langosta que se mueve al pasar el ratón.
//
//     [2026-07-28, 3ª vuelta] La langosta pasa de SVG dibujado a mano a FOTO
//     recortada: `/fotos/langosta.webp`. Samuel insistió («una imagen png que
//     obtengas de internet y le quites el fondo») y el resultado le da la
//     razón — una langosta real y roja sobre el oro vende comida; una silueta
//     vectorial, por bien dibujada que esté, parece un icono.
//     ⚠️ Es el ÚNICO asset del sitio que no es del cliente. Es CC0 (dominio
//     público) de Wikimedia Commons, recortada aquí con Python: segmentación
//     por dominancia de rojo y no por luminancia, porque el original está
//     sobre una bandeja BLANCA y un umbral de brillo se habría llevado por
//     delante las sombras y dejado el borde de la loza. Procedencia y licencia
//     quedan anotadas en `public/fotos/CREDITOS.md`; se sustituye por una foto
//     del cliente cambiando solo el archivo.
//
//  5. LAS FOTOS SE ABREN. Mismo lightbox y misma expansión desde el origen que
//     el mosaico de la ficha (GaleriaLightbox + useOrigenExpansion): quien se
//     queda mirando un plato puede verlo grande y pasar al siguiente. Es la
//     diferencia entre enseñar la comida y dejar que la miren.

/** Card de un plato con foto. Todas iguales — ver el punto 2 de la cabecera. */
function PlatoCarta({
  plato,
  titulo,
  pie,
  onAbrir,
}: {
  plato: { nombre: string; desc?: string; foto?: string }
  /** Sobrescribe el nombre del plato — lo usa la celda de brochetas, que
   *  rotula un GRUPO («A la parrilla, en brocheta») y no un plato suelto. */
  titulo?: string
  pie?: string
  onAbrir: (el: HTMLElement) => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => onAbrir(e.currentTarget)}
      className="group relative overflow-hidden rounded-card bg-papel-hueso text-left"
    >
      <img
        src={`/fotos/${plato.foto}.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="carta-foto size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Degradado desde abajo: el nombre va SOBRE la foto (una carta de
          restaurante, no una ficha de catálogo con pie de foto), y sin él
          quedaría ilegible en los platos claros.
          El `to-navy/10` de arriba no es decoración: los bodegones del cliente
          están tirados sobre fondo BLANCO, y sin un velo la mitad superior de
          cada card se va a blanco puro y las cinco se leen descoloridas. Es un
          velo MÍNIMO a propósito —la primera vuelta lo tenía al 25% en medio y
          apagaba la comida, que es justo lo que tiene que brillar—; el color
          del plato lo devuelve `.carta-foto` (componentes.css), no la falta de
          velo. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-navy/10"
      />
      <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="block font-display text-sm font-semibold text-white sm:text-base">
          {titulo ?? plato.nombre}
        </span>
        {pie ?? plato.desc ? (
          <span className="mt-0.5 block text-xs text-white/75">{pie ?? plato.desc}</span>
        ) : null}
      </span>
    </button>
  )
}

export function CartaCharter({ menu, etiqueta }: { menu: MenuCharterTour; etiqueta: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const origen = useOrigenExpansion()

  // Los 4 platos con foto propia, y aparte el grupo de brochetas — que es UNA
  // celda aunque sean tres platos. El `!p.brocheta` del primer filtro es lo que
  // evita que la foto provisional del grupo se cuele además como plato suelto.
  const conFoto = menu.platos.filter((p) => p.foto && !p.brocheta)
  const brochetas = menu.platos.filter((p) => p.brocheta)
  const fotoBrochetas = brochetas.find((b) => b.foto)?.foto

  // El lightbox recorre la carta en el mismo orden en que se ve, con la celda
  // de brochetas al final. Se construye de la misma lista que la rejilla, así
  // que no puede desincronizarse de los índices que se le pasan.
  const fotos = [...conFoto.map((p) => p.foto!), ...(fotoBrochetas ? [fotoBrochetas] : [])]

  return (
    <>
      {/* 6 celdas iguales: 2×3 en móvil, 3×2 desde lg. Ninguna lleva span, así
          que la retícula cuadra sola en las dos formas sin dejar huecos. */}
      <div className="carta-platos grid grid-cols-2 gap-2.5 lg:grid-cols-3">
        {conFoto.map((p, i) => (
          <PlatoCarta
            key={p.nombre}
            plato={p}
            onAbrir={(el) => {
              origen.abrirDesde(el)
              setLightbox(i)
            }}
          />
        ))}

        {/* Las brochetas, agrupadas en una celda: rotula la FAMILIA («A la
            parrilla, en brocheta») y lista las tres debajo. Misma card que un
            plato para que la retícula no tenga una celda de otra especie. */}
        {brochetas.length > 0 && fotoBrochetas ? (
          <PlatoCarta
            plato={{ nombre: 'A la parrilla, en brocheta', foto: fotoBrochetas }}
            titulo="A la parrilla, en brocheta"
            pie={brochetas.map((b) => b.nombre.replace(/^Brocheta de /, '')).join(' · ')}
            onAbrir={(el) => {
              origen.abrirDesde(el)
              setLightbox(conFoto.length)
            }}
          />
        ) : null}

        {/* SEXTA CELDA: la mecánica de la carta. No repite el «cada persona
            elige su plato» del lead de la sección —eso ya está dicho dos
            párrafos arriba— sino lo que ese lead no cuenta: cuándo se decide y
            dónde se cocina. Antes era un renglón suelto bajo el bloque; aquí
            cuadra la retícula y se lee de un vistazo con los platos. */}
        {/* overflow-hidden + line-clamp: es la única celda con párrafo, y en un
            390 se salía por abajo de su propia card (la retícula tiene alto
            fijo). Con las dos, el texto se corta limpio pase lo que pase con
            el ancho — nunca se derrama sobre el banner de la langosta. */}
        <div className="flex flex-col justify-between overflow-hidden rounded-card bg-aqua-tint p-3 sm:p-4">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-papel text-aqua-dark"
          >
            <UtensilsCrossed className="size-4" />
          </span>
          <span className="mt-3">
            <span className="block font-display text-sm font-semibold text-navy sm:text-base">
              Uno por persona
            </span>
            {/* SIN `block` junto a `line-clamp-3`: el clamp necesita
                `display:-webkit-box` y el `block` de Tailwind se lo pisaba —
                el recorte no se aplicaba y el párrafo se salía igual. */}
            <span className="mt-0.5 line-clamp-3 text-xs text-aqua-dark">
              Se coordinan antes de zarpar y se cocinan a bordo.
            </span>
          </span>
        </div>
      </div>

      {/* EL UPSELL, EN LÁMINA DE ORO. Antes era una card gris idéntica a la
          del buffet de Saona (el único extra de pago del menú se leía como una
          nota al pie) y después un rectángulo casi negro, que era peor: la
          piel del bloque Premium necesita superficie para respirar y aquí solo
          hay una franja.
          El degradado en diagonal —oro hundido → champán → oro— es lo que da
          la lectura de METAL en vez de relleno plano; la tinta va en
          --color-premium-fondo, como una carta impresa sobre pan de oro.
          `group`: el hover de TODA la franja mueve la langosta, no solo el de
          la langosta — es la franja entera la que responde. */}
      {menu.addOn ? (
        <div className="group relative mt-2.5 flex flex-col gap-3 overflow-hidden rounded-card bg-gradient-to-br from-premium-oro-oscuro via-premium-oro-claro to-premium-oro p-4 ring-1 ring-premium-oro-oscuro/40 sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:pr-44">
          {/* La langosta: decorativa, anclada al canto derecho y SANGRANDA
              (sale del marco por la derecha). Un emblema centrado y entero
              parecería un icono de lista; recortado por el borde parece un
              sello estampado en la lámina.
              Al hover se levanta y gira un punto — «que se mueva ligeramente»,
              no que salte. `motion-safe` la deja quieta para quien pidió menos
              movimiento; `pointer-events-none` evita que se coma clics.
              Se oculta por debajo de sm: en una franja estrecha se solaparía
              con el precio, que es el dato que no puede estorbarse.
              El `sm:pr-44` de la franja le RESERVA el sitio: la langosta cae
              justo donde iba el «US$ 30 por persona» y, aunque la cifra va
              montada por delante, se leía sobre un enredo de pinzas. El
              reservado tiene que cubrir lo que la imagen mete DENTRO del marco
              (ancho pintado menos lo que sangra por la derecha) — con pr-36 se
              quedaba corto por unos 25 px y una pinza seguía pisando la
              palabra «persona». */}
          <img
            src="/fotos/langosta.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute -right-6 top-1/2 hidden h-24 -translate-y-1/2 transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-[calc(50%+0.35rem)] motion-safe:group-hover:-rotate-6 sm:block"
          />

          {/* Icono y texto viajan juntos en su propia fila: en móvil la franja
              se apila (texto arriba, precio debajo) y sin este envoltorio el
              `flex-wrap` de la primera vuelta metía el precio AL LADO del
              párrafo, dejándolo en una columna de cuatro palabras de ancho. */}
          <div className="relative flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-premium-fondo/10 text-premium-fondo ring-1 ring-premium-fondo/15"
            >
              <Plus className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-premium-fondo">
                Súbele langosta premium
              </p>
              {menu.addOn.descripcion ? (
                <p className="mt-0.5 text-sm text-premium-fondo/70">{menu.addOn.descripcion}</p>
              ) : null}
            </div>
          </div>
          {/* relative: el precio se monta POR ENCIMA de la langosta, que pasa
              justo por detrás. Sin esto la cifra —el dato que decide— quedaría
              cruzada por una pinza. */}
          <p className="relative shrink-0 font-display text-lg font-semibold text-premium-fondo">
            {formatoDinero(menu.addOn.precio)}{' '}
            <span className="text-xs font-normal text-premium-fondo/60">por persona</span>
          </p>
        </div>
      ) : null}

      {lightbox !== null ? (
        <GaleriaLightbox
          fotos={fotos}
          indiceInicial={lightbox}
          etiqueta={`el menú de ${etiqueta}`}
          origen={origen.origen}
          onCerrar={() => setLightbox(null)}
        />
      ) : null}
    </>
  )
}
