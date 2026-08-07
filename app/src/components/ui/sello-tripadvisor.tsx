import { useId } from 'react'

// Sello Travellers' Choice de TripAdvisor + el reclamo de «#1 durante 7 años».
//
// Pieza compartida por la ficha de tour y las landings de evento (Samuel,
// 2026-07-28: «añádelo en todas»). Un componente React = un futuro componente
// de Figma, y esto es claramente uno.
//
// ── EL SELLO MANDA, EL TEXTO ACOMPAÑA ────────────────────────────────────
// (Samuel: «que la imagen sea más grande, sea el protagonista, y el texto más
// sutil»). Fuera la píldora que lo envolvía: un sello metido en una cápsula se
// lee como el icono de una etiqueta, y encima le disputaba el protagonismo.
// El texto baja a dos líneas pequeñas y apagadas.
//
// POR QUÉ EL TEXTO NO SE ESCONDE HASTA EL HOVER (la otra variante que planteó
// Samuel): en móvil no hay hover, y «#1 en TripAdvisor 7 años» es el argumento
// más fuerte del producto — el cliente pidió expresamente DESTACARLO en las
// correcciones v2. Dejarlo detrás de un gesto que no existe en táctil lo
// borraría para la mitad del tráfico, que en turismo es iPhone. Está siempre,
// pero atenuado: el hover lo ENCIENDE en vez de revelarlo.
//
// ── POR QUÉ TODO ESTO ES UN SOLO SVG ─────────────────────────────────────
// (Samuel, 2026-07-28: «agregarle estos picos que estén girando infinitamente
// [...] que pareciera que los picos fueran parte del dorado de la imagen [...]
// y también el efecto de luz lo afecte para que se vea bien integrado»).
//
// La pieza tiene tres capas —picos girando, disco, destello— y la exigencia
// es que se lean como UN objeto de metal, no como tres cosas apiladas. Eso
// obliga a que el destello cruce los picos Y el disco con la misma banda de
// luz, y ahí es donde la versión anterior en CSS se rompía: recortaba el
// brillo con un círculo (`border-radius: 50%`), así que los picos se habrían
// quedado apagados mientras el disco brillaba — justo el pegote a evitar.
//
// Metiéndolo todo en un SVG, el destello se enmascara con la UNIÓN de las dos
// formas (picos + disco) y las recorre como una sola superficie. De paso, los
// picos salen de un `<path>` y no de una imagen: escalan sin pixelarse y su
// oro es el token muestreado del propio PNG, así que no hay costura visible
// entre el metal dibujado y el metal fotografiado.
//
// El MISMO `<path>` se usa dos veces —una para pintar los picos y otra dentro
// de la máscara— vía `<use>`, y las dos llevan la misma clase de rotación. Al
// compartir animación y arrancar en el mismo frame giran sincronizadas, que es
// lo que hace que la luz caiga siempre sobre el pico que toca. Si se hubieran
// duplicado las coordenadas, cualquier retoque futuro tendría que hacerse en
// dos sitios y la máscara se desalinearía en cuanto alguien olvidara uno.
export function SelloTripAdvisor({
  className = '',
  sinTexto = false,
}: {
  className?: string
  /**
   * [v2 2026-07-28, pedido de Samuel para la foto de bienvenida de /flota:
   * «deja solo el badge con su animación infinita, quita el background que
   * tiene y el texto»] Pinta ÚNICAMENTE el sello: sin las dos líneas de copy
   * y, por tanto, sin necesidad de una superficie detrás.
   *
   * Es una variante de USO, no una pieza distinta: encima de una foto con
   * profundidad, el sello ya se lee solo —es un objeto de metal, no un icono
   * plano— y el texto obligaba a meterle un panel debajo para tener contraste,
   * que es justo lo que se veía pegado. Donde el sello vive sobre una
   * superficie plana (ficha de tour, landings de evento) el texto SÍ hace
   * falta: ahí el reclamo «#1 durante 7 años» es el argumento, y por eso el
   * default sigue siendo con texto.
   *
   * La corona de picos girando (la «animación infinita») no depende de esto:
   * vive en el SVG y sigue igual.
   */
  sinTexto?: boolean
}) {
  // Los `id` de SVG son GLOBALES del documento, no del componente: dos sellos
  // en la misma página compartirían máscara y degradado, y el segundo pintaría
  // con las formas del primero. `useId` les da un sufijo único por instancia.
  const uid = useId().replace(/:/g, '')
  const idPicos = `picos-${uid}`
  const idDisco = `disco-${uid}`
  const idLuz = `luz-${uid}`
  const idMascara = `mascara-${uid}`

  return (
    // `group` para que el hover del conjunto encienda texto y destello a la
    // vez: pasar el ratón por el texto y ver el sello apagado se sentiría roto.
    // `w-fit` para que el área de hover no se estire a toda la columna.
    <div className={`group flex w-fit items-center gap-3 ${className}`}>
      {/* La caja crece respecto a la versión sin picos (56/64px) porque ahora
          incluye la corona: el DISCO sigue midiendo lo mismo (es el 76% del
          lado), y son los picos los que ocupan el resto. */}
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="size-18 shrink-0 sm:size-20"
      >
        <defs>
          {/* 22 dientes entre r=36 y r=45,5. Historia de la geometría, que se ha
              afinado en tres pasadas con Samuel el 2026-07-28: 36 dientes →
              «quítale picos, quítale el 50%, son demasiados» (18) → «ponle un
              20% más de picos y no tan altos, reducidos en un 25%» (22, y el
              pico asoma 7,5 sobre el disco en vez de 10).
              OJO CON EL 25%: se aplica a lo que SE VE asomar (r=38→48, o sea 10
              unidades), no a la altura bruta del diente (r=36→48, 12). El radio
              interior está metido POR DENTRO del disco a propósito —así los
              valles no se ven y los picos parecen brotar del borde dorado en vez
              de estar pegados detrás— y por eso 2 de esas 12 unidades nunca
              llegan a verse. Reducir la cifra bruta habría dado un recorte del
              30% de lo visible en lugar del 25% pedido. */}
          <path id={idPicos} d="M50.00 4.50L55.12 14.37L62.82 6.34L64.95 17.25L74.60 11.72L73.57 22.79L84.39 20.20L80.29 30.54L91.39 31.10L84.54 39.86L95.04 43.52L86.00 50.00L95.04 56.48L84.54 60.14L91.39 68.90L80.29 69.46L84.39 79.80L73.57 77.21L74.60 88.28L64.95 82.75L62.82 93.66L55.12 85.63L50.00 95.50L44.88 85.63L37.18 93.66L35.05 82.75L25.40 88.28L26.43 77.21L15.61 79.80L19.71 69.46L8.61 68.90L15.46 60.14L4.96 56.48L14.00 50.00L4.96 43.52L15.46 39.86L8.61 31.10L19.71 30.54L15.61 20.20L26.43 22.79L25.40 11.72L35.05 17.25L37.18 6.34L44.88 14.37Z" />
          <clipPath id={idDisco}>
            <circle cx="50" cy="50" r="38" />
          </clipPath>
          {/* Banda de luz estrecha e inclinada. Ancha parecería un velo blanco
              encima y apagaría el oro en vez de recorrerlo. */}
          <linearGradient id={idLuz} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(12 0.5 0.5)">
            <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.72" />
            <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* LA UNIÓN: picos (girando) + disco. El destello solo existe donde
              hay metal, así que no aparece la banda cruzando el aire de
              alrededor ni los valles entre dientes. */}
          <mask id={idMascara}>
            <use href={`#${idPicos}`} className="sello-picos" fill="#fff" />
            <circle cx="50" cy="50" r="38" fill="#fff" />
          </mask>
        </defs>

        <use href={`#${idPicos}`} className="sello-picos" fill="var(--color-sello-oro)" />
        <image
          href="/premios/premio-tripadvisor-bob-2023.webp"
          x="12"
          y="12"
          width="76"
          height="76"
          clipPath={`url(#${idDisco})`}
        />
        {/* La máscara va en el <g> y el movimiento en el <rect> de dentro: si
            se animara el elemento enmascarado, la máscara viajaría con él y la
            luz se quedaría quieta respecto al sello — o sea, no habría barrido. */}
        <g mask={`url(#${idMascara})`}>
          <rect className="sello-destello" x="0" y="0" width="100" height="100" fill={`url(#${idLuz})`} />
        </g>
      </svg>

      {/* Este texto ES el texto accesible del sello: el SVG va aria-hidden
          para que un lector de pantalla no anuncie dos veces lo mismo.
          ⚠️ Por eso, en `sinTexto`, el reclamo NO desaparece del documento —
          baja a `sr-only`. Sin él, el sello quedaría como una imagen muda:
          quien navega con lector de pantalla vería un adorno donde el resto ve
          el premio. */}
      {sinTexto ? (
        <span className="sr-only">#1 on TripAdvisor, 7 years running</span>
      ) : (
        <span className="leading-tight">
          <span className="block text-sm font-bold tracking-[0.06em] text-white/85 transition-colors duration-300 group-hover:text-white">
            #1 on TripAdvisor
          </span>
          <span className="block text-xs tracking-[0.06em] text-white/55 transition-colors duration-300 group-hover:text-white/80">
            7 years running
          </span>
        </span>
      )}
    </div>
  )
}
