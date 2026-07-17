// Cintillo «Eco-friendly · Cero plástico a bordo» (2026-07-17, pedido de
// Samuel) — la web actual tiene esto como una banda azul sólida a sangre,
// justo debajo de los premios ("ECO FRIENDLY [ícono] NO PLASTIC"). Copiar esa
// banda tal cual violaría el guardarraíl de la dirección B (direccion-visual.md
// §6: el color vive en las fotos, nunca en un fondo grande y plano) — así que
// en vez de un azul a sangre, el mensaje vive en un CINTILLO DELGADO con la
// insignia REAL del cliente (marca/eco-friendly-logo.png, descargada de la
// web actual — no un ícono genérico) sobresaliendo por arriba y por abajo,
// como un sello sobre una cinta. El fondo ya no es sólido: es un
// linear-gradient horizontal (transparente → --color-menta en el tramo
// 15%-85% → transparente) — el color se concentra detrás de la insignia y se
// disuelve al blanco de la web en los extremos, en vez de un bloque de borde
// a borde (2ª vuelta, pedido de Samuel: "más delgado... la imagen sobresalga
// arriba y abajo... background en vez de sólido, linear-gradient
// transparente 25% verde 75% verde 100% transparente". 3ª vuelta, mismo día:
// el 2º stop sube de 75% a 85%. 4ª vuelta, mismo día: el 1er stop baja de
// 25% a 15% — el tramo sólido se ensancha por los dos lados, asimétrico a
// propósito).
//
// Mecánica del "sobresale": el <section> mide el alto de la INSIGNIA (más
// alta que el cintillo), y el cintillo de color es una franja más BAJA,
// centrada verticalmente dentro de esa misma caja — así la insignia asoma
// por arriba y por abajo del color sin overflow real ni pisar las secciones
// vecinas (Premios encima, Experiencia debajo).
//
// Copy: "Eco-friendly" se deja en inglés (ya es el término que usa el propio
// footer — "Eco-friendly · Sin plástico · Desde 2012."); "Cero plástico a
// bordo" reutiliza la frase exacta del stat del hero ("0 / plástico a
// bordo") en vez de traducir "No Plastic" suelto, para que las 3 apariciones
// del dato en la home (hero, este cintillo, footer) hablen igual.
export function EcoFriendly() {
  return (
    <section className="flex justify-center px-5 py-3 sm:px-10 sm:py-4">
      <div className="relative flex h-20 w-full max-w-contenido items-center justify-center sm:h-28">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 sm:h-12"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, var(--color-menta) 15%, var(--color-menta) 85%, transparent 100%)',
          }}
        />
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-center sm:gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-navy sm:text-base">
            Eco-friendly
          </span>
          <img
            src="/marca/eco-friendly-logo.png"
            alt="Sello eco-friendly — cero plástico a bordo"
            className="h-20 w-20 shrink-0 object-contain sm:h-28 sm:w-28"
          />
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-navy sm:text-base">
            Cero plástico a bordo
          </span>
        </div>
      </div>
    </section>
  )
}
