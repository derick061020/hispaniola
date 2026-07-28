import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'

// Las DOS bandas de CTA de /instalaciones (slides 47-49).
//
// [v2 2026-07-28, pedido de Samuel] SE PASAN AL LENGUAJE DE BANNER QUE EL SITIO
// YA USA: «al banner intermedio usa el estilo que ya veníamos usando con la
// imagen de fondo del mar etc., e igual para el banner de final de sección con
// el CTA».
//
// Antes eran dos rectángulos de color plano (aqua y navy) copiados de la
// maqueta. Un fondo grande y plano de color es justo lo que la dirección B
// prohíbe (direccion-visual.md §6: el color vive en las fotos), y además dejaba
// esta página hablando un idioma distinto al de sus vecinas: /flota
// (banner-cero-plastico.tsx), /por-que-reservar (cierre.tsx),
// /ventaja-competitiva (cierre-sostenibilidad.tsx) y nosotros/arrecife-teaser
// ya resuelven este mismo tipo de pieza con foto a sangre + gradiente navy
// encima + texto blanco. Aquí se hereda esa anatomía tal cual.
//
// Las dos variantes NO son dos componentes: son la misma pieza con distinto
// reparto, y ese reparto es el que las distingue de un vistazo cuando aparecen
// en la misma página con veinte segundos de scroll entre medias.
//
//   · `intercalada` — gradiente cargado a la IZQUIERDA, texto a la izquierda y
//     más mar a la derecha. Es el descanso a mitad de recorrido, así que no
//     tiene que parecer un final: se lee como una franja lateral, no como un
//     cierre. Misma composición que el banner de /flota.
//   · `cierre` — texto CENTRADO sobre la foto, con las dos capas de overlay del
//     hero. Es el remate de la página y ahí sí toca el bloque simétrico y
//     rotundo. Misma composición que el cierre de /por-que-reservar.
//
// Los dos overlays son los de esas piezas y no valores nuevos: el tinte parejo
// es --color-overlay-hero (45%) y NO --color-overlay-foto (70%) — con el 70%
// más el gradiente encima la foto desaparece y se paga el coste de cargarla sin
// verla (medido en por-que-reservar/cierre.tsx, mismo problema).
//
// ⚠️ LA FOTO TIENE QUE SER GRANDE DE VERDAD. Debajo de estos overlays, una foto
// pequeña estirada a 1320px no se lee como foto oscura: se lee como un
// rectángulo navy liso, y no hay forma de distinguirlo de un bug. El primer
// intento de cierre usaba `events-5` (una cenital de la flota fondeada, que era
// LA foto que mejor decía «ven a conocernos»), y el banner salía plano: el
// archivo mide 368px de ancho. En /public/fotos solo hay cuatro fotos de mar por
// encima de 1900px — footer-oceano, arrecife-fondo-cenital, incluye-oceano-poster
// y hero-catamaran-1 —, así que la elección para un banner sale de esa lista
// corta, no del catálogo entero.
export function BandaInstalaciones({
  variante,
  foto,
  eyebrow,
  titulo,
  texto,
  cta,
  href = '/#tours',
}: {
  variante: 'intercalada' | 'cierre'
  /** Nombre del archivo en /public/fotos, sin extensión. */
  foto: string
  eyebrow: string
  titulo: string
  texto: string
  cta: string
  href?: string
}) {
  const esCierre = variante === 'cierre'

  return (
    <section className="relative overflow-hidden rounded-card-grande bg-navy">
      <img
        src={`/fotos/${foto}.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      {esCierre ? (
        <>
          <span aria-hidden="true" className="absolute inset-0 bg-overlay-hero" />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/45 to-navy/35"
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-navy/92 via-navy/78 to-navy/35"
        />
      )}

      <div
        className={
          esCierre
            ? 'relative mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center sm:py-20'
            : 'relative max-w-2xl px-8 py-12 sm:px-10 sm:py-14 lg:px-12'
        }
      >
        <Etiqueta sobreOscuro>{eyebrow}</Etiqueta>
        <h2
          className={`text-balance font-display text-h2 font-semibold text-white ${
            esCierre ? '' : 'mt-3'
          }`}
        >
          {titulo}
        </h2>
        <p className={`text-lead text-white/85 ${esCierre ? '' : 'mt-4'}`}>{texto}</p>

        <Link
          to={href}
          className={`group inline-flex items-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark ${
            esCierre ? 'mt-2' : 'mt-7'
          }`}
        >
          {cta}
          <ArrowRight
            className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  )
}
