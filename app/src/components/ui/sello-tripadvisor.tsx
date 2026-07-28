// Sello Travellers' Choice de TripAdvisor + el reclamo de «#1 durante 7 años».
//
// Pieza compartida por la ficha de tour y las landings de evento (Samuel,
// 2026-07-28: «añádelo en todas»). Antes vivía embebido en cabecera-ficha.tsx;
// al necesitarlo en dos cabeceras distintas sube a ui/ — un componente React =
// un futuro componente de Figma, y esto es claramente uno.
//
// EL SELLO MANDA, EL TEXTO ACOMPAÑA (pedido de Samuel: «que la imagen sea más
// grande, sea el protagonista, y el texto sea más sutil»). Tres cambios
// respecto a la versión anterior:
//   · Fuera la píldora (borde + fondo translúcido). Un sello metido en una
//     cápsula se lee como icono de una etiqueta; suelto se lee como sello. La
//     cápsula además le robaba el papel de protagonista al competir con él.
//   · El sello pasa de 40px a 56/64px. Es el elemento reconocible sin leer.
//   · El texto baja a dos líneas pequeñas y apagadas: informa a quien lo busca
//     sin disputarle la vista al sello ni al H1 que va justo debajo.
//
// POR QUÉ EL TEXTO NO SE ESCONDE DEL TODO HASTA EL HOVER (la otra variante que
// planteó Samuel): en móvil no hay hover, y «#1 en TripAdvisor 7 años» es el
// argumento más fuerte del producto — el cliente pidió expresamente DESTACARLO
// más en las correcciones v2. Dejarlo detrás de un gesto que no existe en
// táctil lo borraría para la mitad del tráfico, que en turismo es iPhone. Así
// que el texto está siempre, pero atenuado; el hover lo ENCIENDE (pasa a
// blanco pleno) a la vez que el sello crece. Se conserva la interacción y no
// se paga con el mensaje.
export function SelloTripAdvisor({ className = '' }: { className?: string }) {
  return (
    // `group` para que el hover sobre el conjunto anime las dos partes a la
    // vez: pasar el ratón solo por el texto y ver el sello quieto se sentiría
    // roto. `w-fit` para que el área de hover no se estire a toda la columna.
    <div className={`group flex w-fit items-center gap-3 ${className}`}>
      {/* El sello va envuelto porque el DESTELLO necesita un contenedor con
          recorte circular propio (.sello-brillo, en componentes.css): el
          barrido de luz se pinta en un ::after y sobre la <img> directamente
          no habría dónde ponerlo. El wrapper también es quien escala en el
          hover, para que luz y crecimiento pasen sobre la misma caja. */}
      <span
        aria-hidden="true"
        className="sello-brillo block size-14 shrink-0 transition-transform duration-300 motion-safe:group-hover:scale-105 sm:size-16"
      >
        <img
          src="/premios/premio-tripadvisor-bob-2023.webp"
          alt=""
          width={64}
          height={64}
          // El sello NO lleva sombra propia — es un círculo amarillo pleno
          // sobre el scrim del hero y ya se recorta solo del fondo.
          className="size-full"
        />
      </span>
      <span className="leading-tight">
        {/* El texto ES el texto accesible del sello: la <img> va aria-hidden
            a propósito para que un lector de pantalla no anuncie dos veces lo
            mismo (el alt del sello y esta línea dirían lo mismo). */}
        <span className="block text-sm font-bold tracking-[0.06em] text-white/85 transition-colors duration-300 group-hover:text-white">
          #1 en TripAdvisor
        </span>
        <span className="block text-xs tracking-[0.06em] text-white/55 transition-colors duration-300 group-hover:text-white/80">
          7 años seguidos
        </span>
      </span>
    </div>
  )
}
