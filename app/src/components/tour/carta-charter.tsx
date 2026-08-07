import { useState } from 'react'
import { Image as ImageIcon, Users, UtensilsCrossed } from 'lucide-react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { BannerLangosta } from '@/components/tour/banner-langosta'
import { estadoDeFranja, type SeleccionAddOns } from '@/lib/tarifas'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import type { CartaCharter as CartaCharterDatos } from '@/data/tours'

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

// [v3 2026-08-06, maqueta de la slide 74] EL BENTO DEL BUFFET DE PINCHOS.
//
// El cliente dibujo esta carta distinta al resto y tiene razon: en un buffet no
// se elige plato, asi que una rejilla de siete cards iguales no dice nada. Lo
// que hay que enseñar es la MESA (foto grande del menu completo), la RACION
// («cantidad por persona», que es la duda real de quien contrata para 30) y el
// SERVICIO (sus dos recuadros de «como se sirve»). De ahi el reparto desigual:
// una celda grande a la izquierda y tres menores a su lado.
//
// ⚠️ NINGUNA de las fotos existe todavia. Miguel se comprometio en la reunion
// del 07-31 a pasarlas (indice de planes, peticion 1). Hasta entonces cada
// celda se pinta como un HUECO EVIDENTE —marco discontinuo, icono de imagen y
// el pie de lo que ira ahi— en vez de rellenarse con la foto de otro plato:
// una foto prestada aqui contaria una racion que no es la que sirven.
function BentoBuffet({ celdas }: { celdas: NonNullable<CartaCharterDatos['bento']> }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {celdas.map((c) => (
        <figure
          key={c.id}
          className={`relative flex min-h-40 flex-col justify-end gap-2 overflow-hidden rounded-card border p-4 lg:min-h-48 ${
            // Con foto: marco solido y velo para que el pie se lea encima.
            // Sin foto: marco DISCONTINUO — el hueco tiene que verse como
            // hueco, no como una card gris que alguien pueda dar por buena.
            c.foto ? 'border-linea' : 'border-dashed border-linea-fuerte bg-papel-hueso'
          } ${
            c.tamano === 'grande'
              ? 'col-span-2 row-span-2 lg:min-h-[25rem]'
              : c.tamano === 'ancho'
                ? 'col-span-2'
                : ''
          }`}
        >
          {c.foto ? (
            <>
              <img
                src={`/fotos/${c.foto}.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent"
              />
            </>
          ) : (
            <span
              aria-hidden="true"
              className="mb-auto grid size-10 place-items-center rounded-full bg-papel text-navy-soft ring-1 ring-linea"
            >
              <ImageIcon className="size-5" />
            </span>
          )}
          <figcaption className="relative">
            <span
              className={`block font-display text-sm font-semibold sm:text-base ${
                c.foto ? 'text-white' : 'text-navy'
              }`}
            >
              {c.titulo}
            </span>
            {c.texto ? (
              <span className={`mt-0.5 block text-xs ${c.foto ? 'text-white/75' : 'text-navy-soft'}`}>
                {c.texto}
              </span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export function CartaCharter({
  carta,
  etiqueta,
  seleccionAddOns,
}: {
  carta: CartaCharterDatos
  etiqueta: string
  /** [2026-08-07] Deja que la franja de la langosta marque el add-on en la
   *  reserva. Sin ella la franja sigue existiendo, informativa. */
  seleccionAddOns?: SeleccionAddOns
}) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const origen = useOrigenExpansion()
  const seleccion = estadoDeFranja(carta.addOn, seleccionAddOns)

  // Los platos con foto propia, y aparte el grupo de brochetas — que es UNA
  // celda aunque sean tres platos. El `!p.brocheta` del primer filtro es lo que
  // evita que la foto provisional del grupo se cuele además como plato suelto.
  // [v3] Recibe UNA carta (4 h o 3 h), no el menú entero: desde las slides
  // 73-74 el charter tiene dos y la pestaña activa decide cuál se pinta.
  const menu = carta
  const conFoto = menu.platos.filter((p) => p.foto && !p.brocheta)
  const brochetas = menu.platos.filter((p) => p.brocheta)
  const fotoBrochetas = brochetas.find((b) => b.foto)?.foto

  // El lightbox recorre la carta en el mismo orden en que se ve, con la celda
  // de brochetas al final. Se construye de la misma lista que la rejilla, así
  // que no puede desincronizarse de los índices que se le pasan.
  const fotos = [...conFoto.map((p) => p.foto!), ...(fotoBrochetas ? [fotoBrochetas] : [])]

  // [v3] Las cartas de bento (el buffet de pinchos) no tienen platos que
  // listar: su contenido son las fotos del servicio, no una eleccion.
  if (carta.bento) {
    return (
      <>
        <BentoBuffet celdas={carta.bento} />
        {carta.nota ? (
          <p className="mt-2.5 rounded-card bg-papel-hueso px-4 py-3 text-sm text-navy-sub">{carta.nota}</p>
        ) : null}
      </>
    )
  }

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
            // [v3] El rotulo del grupo depende de la carta: en la de 4 h las
            // brochetas ya no estan (se mudaron a la de 3 h), y en el Taste of
            // Hispaniola SON la carta, asi que el titulo es el suyo.
            plato={{ nombre: 'Grilled skewers', foto: fotoBrochetas }}
            titulo="Grilled skewers"
            pie={brochetas
              .map((b) => b.nombre.replace(/^Brocheta de /, '').replace(/ skewer$/i, ''))
              .join(' · ')}
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
        {/* [v3] Solo en la carta de 4 h: es la que se elige plato a plato.
            En el Taste of Hispaniola no hay nada que coordinar antes de
            zarpar, y la celda dejaria de ser mecanica para ser relleno. */}
        {carta.id === '4h' ? (
        <div className="flex flex-col justify-between overflow-hidden rounded-card bg-aqua-tint p-3 sm:p-4">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-papel text-aqua-dark"
          >
            <UtensilsCrossed className="size-4" />
          </span>
          <span className="mt-3">
            <span className="block font-display text-sm font-semibold text-navy sm:text-base">
              One per guest
            </span>
            {/* SIN `block` junto a `line-clamp-3`: el clamp necesita
                `display:-webkit-box` y el `block` de Tailwind se lo pisaba —
                el recorte no se aplicaba y el párrafo se salía igual. */}
            <span className="mt-0.5 line-clamp-3 text-xs text-aqua-dark">
              Chosen before departure and cooked on board.
            </span>
          </span>
        </div>
        ) : null}
      </div>

      {/* [v3, slide 73] La regla de las 21 personas: el mismo menu, otro
          servicio. Va aqui, pegada a la carta que afecta, y no en el lead de
          la seccion — es una condicion de la carta, no del producto. */}
      {carta.nota ? (
        <p className="mt-2.5 rounded-card bg-papel-hueso px-4 py-3 text-sm text-navy-sub">
          <Users className="mr-2 inline size-4 -translate-y-px text-aqua-dark" aria-hidden="true" />
          {carta.nota}
        </p>
      ) : null}

      {/* EL UPSELL, EN LÁMINA DE ORO. Antes era una card gris idéntica a la
          del buffet de Saona (el único extra de pago del menú se leía como una
          nota al pie) y después un rectángulo casi negro, que era peor.
          [2026-08-07] La franja se MUDA a tour/banner-langosta.tsx —ver allí el
          porqué del oro y el detalle de la langosta que sangra— porque desde
          hoy se puede clicar para marcar el add-on en la reserva, y porque el
          bloque de menú de Saona pasa a usar exactamente la misma pieza. */}
      {menu.addOn ? (
        <BannerLangosta
          addOn={menu.addOn}
          activo={seleccion.activo}
          onAlternar={seleccion.alternar}
          // Esta carta se puede abrir a mano desde un barco de 3 h (el
          // visitante compara los dos menús antes de elegir). Ahí la langosta
          // no se puede añadir —esos barcos no llevan la cocina flotante— y la
          // franja lo dice en vez de callarse.
          notaNoElegible="Available on 4-hour charters, which sail with the Floating Kitchen."
          className="mt-2.5"
        />
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

      {/* [v3 2026-08-06] La nota de veda vive PEGADA al banner de la langosta,
          que es lo unico que sustituye. Antes colgaba al pie de la seccion
          entera y, con el menu partido en tres cartas, aparecia tambien bajo
          el buffet de pinchos — una advertencia sobre un plato que esa carta
          no sirve. */}
      {menu.addOn ? (
        <p className="mt-3 text-xs text-navy-soft">
          * Lobster is replaced with wild jumbo shrimp from March to June (closed season).
        </p>
      ) : null}
    </>
  )
}
