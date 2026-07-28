// Langosta del banner de upsell del charter (tour/carta-charter.tsx).
//
// 2026-07-28, Samuel: «me gustaría que pusieras una langosta png que al hacer
// hover sobre el banner se mueva ligeramente».
//
// Va en SVG y no en PNG, a propósito y con ventaja:
//  · Un PNG de langosta habría que sacarlo de un banco de imágenes y bajarlo.
//    Esto se dibuja aquí, no depende de una licencia de nadie y no añade un
//    archivo binario al repo.
//  · Hereda el color con `currentColor`: el día que el banner cambie de piel,
//    la langosta cambia con él sin reexportar nada.
//  · Nítida a cualquier tamaño y densidad de pantalla — un PNG recortado a
//    110px se vería blando en un retina.
//  · En Figma entra como vector editable, que es exactamente lo que se quiere
//    de una pieza decorativa (un PNG llegaría como un rectángulo intocable).
//
// Es una SILUETA estilizada vista desde arriba —emblema de carta, no
// ilustración científica—: dos pinzas al frente, caparazón, cinco anillos que
// se estrechan y el abanico de la cola. A 110px el ojo la lee como langosta
// por la silueta, no por el detalle; por eso se dibuja con formas primitivas
// (elipses y rectángulos redondeados) en vez de un trazo a mano alzada, que a
// este tamaño solo añadiría ruido.
export function IlustracionLangosta({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 116"
      fill="none"
      aria-hidden="true"
      // focusable="false": IE/Edge legacy meten los SVG en el orden de
      // tabulación; es decoración, no debe recibir foco nunca.
      focusable="false"
      className={className}
    >
      <g fill="currentColor">
        {/* Antenas — las dos primeras cosas que dicen «langosta» de un
            vistazo. Van con stroke y no con fill: son líneas, y a este
            grosor un fill las volvería dos cuñas. */}
        <path
          d="M64 46C48 38 30 26 12 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M64 66C48 74 30 86 12 100"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Brazos + pinzas. La muesca de cada pinza (el hueco entre los dos
            dedos) es lo que la separa de «una gota»: sin ella la silueta se
            lee como un remo.
            [2ª vuelta] Las pinzas CRECEN y el abanico de la cola se encoge.
            En la primera versión pasaba lo contrario y la silueta se leía como
            un escorpión: en una langosta el peso visual está delante. */}
        <path
          d="M70 44C62 38 54 32 46 27"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M70 68C62 74 54 80 46 85"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M50 30C42 19 27 11 16 16C7 21 8 34 19 41C29 48 43 45 50 38L34 34Z" />
        <path d="M50 82C42 93 27 101 16 96C7 91 8 78 19 71C29 64 43 67 50 74L34 78Z" />

        {/* Patas: tres pares cortos, apenas insinuados. Con más pares la
            silueta se emborrona; con ninguno parece un camarón. */}
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M84 36L78 24" />
          <path d="M96 34L93 22" />
          <path d="M84 76L78 88" />
          <path d="M96 78L93 90" />
        </g>

        {/* Caparazón */}
        <ellipse cx="86" cy="56" rx="25" ry="26" />

        {/* Abdomen: cinco anillos que se estrechan hacia la cola. El
            escalonado es lo que da la lectura de crustáceo. */}
        <rect x="108" y="35" width="13" height="42" rx="5" />
        <rect x="121" y="38" width="12" height="36" rx="5" />
        <rect x="133" y="41" width="11" height="30" rx="5" />
        <rect x="144" y="44" width="10" height="24" rx="4" />
        <rect x="154" y="47" width="9" height="18" rx="4" />

        {/* Abanico de la cola: cinco palas abiertas desde el último anillo.
            Contenido a propósito — un abanico grande roba el protagonismo a
            las pinzas y convierte la silueta en la de un bicho cualquiera. */}
        <g>
          <ellipse cx="173" cy="56" rx="13" ry="7" />
          <ellipse cx="172" cy="56" rx="12" ry="6" transform="rotate(-19 163 56)" />
          <ellipse cx="170" cy="56" rx="11" ry="5" transform="rotate(-37 163 56)" />
          <ellipse cx="172" cy="56" rx="12" ry="6" transform="rotate(19 163 56)" />
          <ellipse cx="170" cy="56" rx="11" ry="5" transform="rotate(37 163 56)" />
        </g>
      </g>
    </svg>
  )
}
