import { Check, Users } from 'lucide-react'
import { DESCUENTO_GRUPO, aplicaDescuentoGrupo } from '@/lib/tarifas'

// Banner de DESCUENTO POR GRUPO. Va en el widget de reserva de todos los tours
// y en el checkout (pedido de Samuel, 2026-09-01: «en el widget de reserva de
// todos los tours hay que poner un banner llamativo y creativo que diga que los
// grupos de más de 6 personas tienen un X descuento […] y en checkout que
// aparezca esto igual»).
//
// LA IDEA, y por qué no es solo un cartel: el banner tiene DOS ESTADOS y el que
// se pinta depende del contador de personas que hay justo encima.
//   · Todavía no llega  → invitación. Dice cuántas personas faltan para
//     conseguirlo. Es la única forma de que un descuento por volumen haga algo:
//     si solo anuncia la regla, quien va con 5 no se entera de que le falta una.
//   · Ya llega          → recompensa. El banner se ENCIENDE (relleno violeta
//     sólido en vez del lavado) y confirma que está dentro. Un descuento
//     conseguido y no celebrado es un descuento que el visitante no sabe que
//     tiene.
//
// [2026-09-01, 2ª vuelta — Samuel: «hazlo un poco más llamativo con alguna
// animación infinita, que tenga un color diferente para romper el esquema y que
// sea llamativo»] La primera versión iba en aqua y menta, o sea en los colores
// que el widget YA usa, y se fundía con el chip de «ahorra hasta 15%» que tiene
// tres píxeles más abajo. Ahora:
//   · COLOR PROPIO. Violeta, el único color de la paleta que no es de la marca
//     — ver el bloque de `--color-grupo` en tokens.css para por qué ese y no el
//     coral (que es el color del botón de reservar y competiría con él).
//   · BRILLO INFINITO que barre y descansa, más un halo que late en el disco.
//     Los dos viven en componentes.css (`.banner-grupo`), que es donde está
//     explicado por qué el brillo NO es continuo y por qué las dos animaciones
//     van desincronizadas a propósito.
//
// ⚠️ [placeholder] LA CIFRA NO EXISTE TODAVÍA. Samuel lo dijo así: «el descuento
// se decide luego». Mientras `DESCUENTO_GRUPO.porcentaje` sea null, el copy
// habla del descuento sin ponerle número — inventar un 10% aquí sería publicar
// un precio que nadie ha aprobado. En cuanto el número llegue, se escribe en
// lib/tarifas.ts y las dos frases lo recogen solas.
//
// ⚠️ EL CASO RARO, Y POR QUÉ TIENE SU PROPIO TEXTO: hay tours cuyo contador no
// LLEGA al umbral. El semi-privado y Coral Quest topan en 6 personas
// (MAX_PERSONAS_DEFAULT, widget-reserva.tsx), así que en su widget el descuento
// de 7+ es inalcanzable por definición. Anunciarlo ahí con un «te faltan 2»
// sería mandar al visitante a pulsar un + que está deshabilitado. En esos tours
// el banner dice la verdad completa: el descuento existe, y un grupo de ese
// tamaño se reserva hablando con el equipo — que es lo que ya contesta la FAQ
// del charter para los grupos que no encajan en un formulario.
export function BannerGrupo({
  personas,
  maxPersonas,
  contactoUrl,
  className = '',
}: {
  personas: number
  /** Tope del contador de ESTE tour. Si no llega al umbral, el banner cambia de
   *  mensaje en vez de prometer algo que el widget no deja alcanzar. */
  maxPersonas?: number
  /** WhatsApp del negocio, para el caso de arriba. Sin él, el mismo texto sin
   *  enlace: nunca se inventa un destino. */
  contactoUrl?: string
  /** El widget y el checkout lo colocan distinto; el aspecto es el mismo. */
  className?: string
}) {
  const conseguido = aplicaDescuentoGrupo(personas)
  const faltan = DESCUENTO_GRUPO.desdePersonas - personas
  const pct = DESCUENTO_GRUPO.porcentaje
  const fueraDeAlcance =
    maxPersonas !== undefined && maxPersonas < DESCUENTO_GRUPO.desdePersonas

  return (
    <div
      // Dos pesos del MISMO objeto, no dos componentes: la caja no se mueve, se
      // enciende. Así el cambio se lee como una reacción a lo que acabas de
      // hacer con el stepper y no como que ha aparecido otra cosa distinta.
      //  · invita     → lavado violeta + aro, con el titular en tinta normal.
      //  · conseguido → relleno sólido en degradado (`.banner-grupo--conseguido`
      //    pinta el degradado; aquí solo va el color del texto encima).
      // El par de tokens se voltea dentro de `.widget-premium`, así que el
      // banner aguanta la piel oscura sin una sola condición aquí — y es el
      // único acento que NO se vuelve oro ahí, que es parte de la gracia.
      className={`banner-grupo flex items-center gap-2.5 rounded-card px-3.5 py-2.5 transition-colors ${
        conseguido
          ? 'banner-grupo--conseguido text-white ring-1 ring-grupo-fuerte'
          : 'banner-grupo--invita bg-grupo-tenue text-navy-sub ring-1 ring-grupo/30'
      } ${className}`}
    >
      {/* El icono va en DISCO RELLENO y no suelto sobre el fondo: un punto de
          color saturado es lo que hace que la caja se lea como un objeto y no
          como otra franja pálida más. El halo que late vive en la clase
          `.banner-grupo-disco` (componentes.css).
          En el estado conseguido el disco se invierte —blanco sobre el relleno
          violeta— porque ahí el violeta ya es el fondo y un disco violeta sobre
          violeta desaparecería. */}
      <span
        aria-hidden="true"
        className={`banner-grupo-disco relative z-[2] grid size-6 shrink-0 place-items-center rounded-full ${
          conseguido ? 'bg-white text-grupo' : 'bg-grupo text-white'
        }`}
      >
        {conseguido ? (
          <Check className="size-3.5" strokeWidth={3} />
        ) : (
          <Users className="size-3.5" />
        )}
      </span>
      {/* z-[2] para quedar por encima del barrido de luz (que va en z-1): el
          brillo tiene que pasar POR DETRÁS del texto, no lavarlo. */}
      <p className="relative z-[2] text-xs leading-relaxed">
        {conseguido ? (
          <>
            <strong className="font-semibold">Group rate unlocked.</strong>{' '}
            {pct === null ? (
              <>
                Your group of {personas} gets a group discount. We apply it when we confirm your
                booking.
              </>
            ) : (
              <>Your group of {personas} saves {pct}% on this booking.</>
            )}
          </>
        ) : (
          <>
            <strong className="font-semibold text-grupo-texto">
              {pct === null
                ? `Groups of ${DESCUENTO_GRUPO.desdePersonas}+ get a group discount.`
                : `Groups of ${DESCUENTO_GRUPO.desdePersonas}+ save ${pct}%.`}
            </strong>{' '}
            {fueraDeAlcance ? (
              // El contador de este tour no llega al umbral: en vez de una
              // cuenta atrás imposible, la vía real para ese grupo.
              contactoUrl ? (
                <a
                  href={contactoUrl}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-grupo-texto underline underline-offset-2 transition-colors hover:text-grupo"
                >
                  Message us to book a larger group.
                </a>
              ) : (
                <>Message us to book a larger group.</>
              )
            ) : /* La cuenta atrás solo tiene sentido si de verdad falta poco.
                  Con 1 persona en el carrito, «te faltan 6» no es un empujón,
                  es una cifra desanimante — ahí basta con anunciar la regla. */
            faltan <= 3 ? (
              <>
                You’re {faltan} {faltan === 1 ? 'guest' : 'guests'} away.
              </>
            ) : (
              <>Bring the whole crew.</>
            )}
          </>
        )}
      </p>
    </div>
  )
}
