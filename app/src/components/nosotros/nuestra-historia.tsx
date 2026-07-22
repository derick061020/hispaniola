import { Etiqueta } from '@/components/ui/etiqueta'
import { EQUIPO, TIMELINE_FLOTA } from '@/data/nosotros'

// «De un barco a una flota de seis» — la historia (correcciones v1 del
// cliente, slide 2). Sustituye a historia-equipo.tsx, que además de esto
// pintaba el equipo con nombre: ese bloque se fue a la sección de equipo de la
// HOME, reutilizada aquí tal cual (pedido de Samuel, 2026-07-22 — ver
// home/equipo-teaser.tsx). Este componente se queda con lo que la maqueta pone
// en esta franja y solo aquí: la voz del fundador y la línea de tiempo.
//
// Dos cosas que la página no tenía antes de las correcciones v1:
//
//   1. LA LÍNEA DE TIEMPO. La empresa nace en 2012 y hoy tiene 6 barcos; hasta
//      ahora eso se decía de pasada en el footer («Desde 2012») pero no se
//      contaba. Los años salen de FLOTA (verbatim de about-hispaniola.php), no
//      de la maqueta. Se TRAZA al hacer scroll — use-timeline-historia.ts.
//
//   2. LA VOZ DEL FUNDADOR con cara. La maqueta la monta como panel gris con
//      retrato vertical a un lado y la cita al otro; aquí igual, con el
//      retrato en una card propia y el chip de nombre sobre ella.
//
// ⚠️ La foto de Omar es de STOCK con el fondo recortado, no es él — ver el
// aviso largo en data/nosotros.ts. Por eso el retrato va sobre un degradado
// (aqua-tint → papel) en vez de a sangre: el recorte deja aire alrededor y sin
// una superficie detrás se leería como una figura flotando en un hueco.
export function NuestraHistoria() {
  const fundador = EQUIPO.find((m) => m.cta.tipo === 'historia')

  return (
    // id + scroll-mt: destino del CTA «Nuestra historia» del fundador cuando
    // la sección de equipo se pinta en ESTA página (ver equipo-teaser.tsx).
    <section id="historia" className="scroll-mt-24">
      <Etiqueta>Nuestra historia</Etiqueta>
      <h2 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
        De un barco a una flota de seis
      </h2>

      {/* La cita del fundador abre el relato. Sale de EQUIPO para no tener el
          mismo texto en dos sitios (la home lo usa en su card de equipo). */}
      {fundador ? (
        <figure className="mt-8 grid grid-cols-1 items-center gap-6 rounded-card-grande bg-papel-hueso p-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10 sm:p-8">
          <div className="relative overflow-hidden rounded-card bg-linear-to-b from-aqua-tint to-papel">
            <img
              src={`/fotos/${fundador.foto}.webp`}
              alt={`${fundador.nombre}, ${fundador.rol}`}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <span className="absolute bottom-3 left-3 rounded-chip bg-papel/90 px-3 py-1 text-xs font-medium text-navy shadow-sm backdrop-blur-sm">
              {fundador.nombre} · Fundador
            </span>
          </div>

          <div>
            <blockquote className="font-display text-narrativa-movil font-medium italic text-navy-sub sm:text-narrativa">
              «{fundador.quote}»
            </blockquote>
            <figcaption className="mt-5 text-sm text-navy-soft">
              <span className="font-semibold text-navy">— {fundador.nombre}</span>, {fundador.rol.toLowerCase()} de
              Hispaniola · desde {fundador.desde}
            </figcaption>
          </div>
        </figure>
      ) : null}

      {/* LÍNEA DE TIEMPO. En móvil se apila en vertical con el riel a la
          izquierda; desde sm pasa a horizontal, que es como la dibuja la
          maqueta. El hito «Hoy» no lleva año porque no es una fecha.

          El riel son DOS capas superpuestas: la gris (siempre entera, para que
          la línea exista aunque no haya GSAP) y la coral encima, que es la que
          se traza con `scaleX` desde el borde izquierdo. La coral va
          `hidden sm:block`: en móvil el riel es vertical y un scaleX no lo
          dibujaría — ahí el efecto se queda en el pop de cada hito, que sí
          funciona en las dos orientaciones.

          Por qué `sm:gap-x-0` + `w-4/5` y no un gap normal: el riel tiene que
          MORIR EN EL ÚLTIMO PUNTO, no seguir hasta el borde (una línea que
          sobrepasa el último hito dice que la historia continúa fuera de
          pantalla). Con las 5 columnas pegadas, el punto 5 cae exactamente al
          80% del ancho y `w-4/5` es exacto sin ningún cálculo a ojo; con gap,
          el 80% se queda corto por una fracción del hueco. El aire entre
          columnas lo pone el `sm:pr-4` de cada hito, no el grid. */}
      {/* `.nosotros-timeline` es el TRIGGER del trazado (use-timeline-historia.ts),
          no una clase con estilos: el hook recibe el contenedor de toda la
          página (los 3 efectos comparten ref) y sin este gancho engancharía el
          recorrido al scroll de la página ENTERA — la línea tardaría media
          página en dibujarse y los últimos hitos no se encenderían nunca. */}
      <div className="nosotros-timeline relative mt-12">
        <div aria-hidden="true" className="absolute left-1.5 top-1.5 hidden h-px w-4/5 bg-linea sm:block" />
        <div
          aria-hidden="true"
          className="timeline-riel-progreso absolute left-1.5 top-1.5 hidden h-px w-4/5 origin-left bg-coral sm:block"
        />

        <ol className="grid gap-6 sm:grid-cols-5 sm:gap-x-0">
          {TIMELINE_FLOTA.map((hito, i) => (
            <li key={hito.anio} className="timeline-hito relative flex gap-4 sm:block">
              {/* Riel de móvil (vertical): el último hito no lo pinta, no hay
                  nada después de «Hoy». */}
              <div className="flex flex-col items-center sm:block">
                {/* `block` no es decorativo: desde sm el envoltorio deja de
                    ser flex y un <span> vuelve a ser inline — ahí `size-3` no
                    aplica y el punto se queda en una caja de 0 (solo se veía
                    el anillo). */}
                <span
                  aria-hidden="true"
                  className="timeline-punto block size-3 shrink-0 rounded-full bg-coral ring-4 ring-coral/15"
                />
                {i < TIMELINE_FLOTA.length - 1 ? (
                  <span aria-hidden="true" className="w-px grow bg-linea sm:hidden" />
                ) : null}
              </div>
              <div className="pb-2 sm:mt-5 sm:pr-4">
                <p className="font-display text-lead font-semibold text-coral">{hito.anio}</p>
                <p className="mt-1 text-sm text-navy-sub">{hito.titulo}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
