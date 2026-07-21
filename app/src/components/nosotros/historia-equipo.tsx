import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EQUIPO, TIMELINE_FLOTA, type MiembroEquipo } from '@/data/nosotros'
import { WHATSAPP_URL } from '@/data/tours'

// «De un barco a una flota de seis» + «El equipo que te recibe»
// (correcciones v1 del cliente, 2026-07-20 — planes/03-nosotros.md slide 2).
//
// Es lo ÚNICO realmente nuevo que traen las maquetas de /nosotros: el resto
// de esa página (bienvenida, experiencia a bordo, cocina flotante, flota de
// 6) ya existía casi idéntico, así que el cliente en la práctica valida el
// rediseño del 2026-07-17. Aquí se añaden dos cosas que no había:
//
//   1. LA LÍNEA DE TIEMPO. La empresa nace en 2012 y hoy tiene 6 barcos;
//      hasta ahora eso se decía de pasada en el footer («Desde 2012») pero
//      no se contaba. Los años salen de FLOTA (verbatim de
//      about-hispaniola.php), no de la maqueta.
//
//   2. EL EQUIPO CON NOMBRE. Hasta ahora imposible: data/nosotros.ts decía
//      explícitamente que inventar un «Capitán José» sería fabricar
//      contenido. Las maquetas del cliente traen por fin nombres y cargos,
//      así que el bloqueo se levanta. Ver EQUIPO para el estado de esos datos
//      (⚠️ pendientes de confirmar, y sin retratos).
//
// Va DESPUÉS de IntroNosotros (la bienvenida) y ANTES de ExperienciaABordo:
// primero quiénes somos y de dónde venimos, después qué se vive a bordo.

function Retrato({ miembro }: { miembro: MiembroEquipo }) {
  if (miembro.foto) {
    return (
      <img
        src={`/fotos/${miembro.foto}.webp`}
        alt={`${miembro.nombre}, ${miembro.rol}`}
        className="size-16 rounded-full object-cover"
        loading="lazy"
      />
    )
  }
  // Iniciales: mismo placeholder honesto que las reseñas usan para los
  // clientes. Cuando lleguen los retratos, solo cambia el dato.
  return (
    <div
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center rounded-full bg-aqua-tint font-display text-xl font-semibold text-aqua-dark"
    >
      {miembro.nombre.slice(0, 1)}
    </div>
  )
}

export function HistoriaEquipo() {
  const fundador = EQUIPO.find((m) => m.cta.tipo === 'historia')

  return (
    <>
      <section>
        <Etiqueta>Nuestra historia</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
          De un barco a una flota de seis
        </h2>

        {/* La quote del fundador abre el relato. Sale de EQUIPO para no tener
            el mismo texto en dos sitios (la home lo usa en su teaser). */}
        {fundador ? (
          <figure className="mt-6 rounded-card-grande bg-papel-hueso p-6 sm:p-8">
            <blockquote className="font-display text-narrativa-movil font-medium text-navy-sub sm:text-narrativa">
              «{fundador.quote}»
            </blockquote>
            <figcaption className="mt-4 text-sm text-navy-soft">
              <span className="font-semibold text-navy">{fundador.nombre}</span> — {fundador.rol},
              desde {fundador.desde}
            </figcaption>
          </figure>
        ) : null}

        {/* Línea de tiempo. En móvil se apila en vertical con la línea a la
            izquierda; desde sm pasa a horizontal, que es como la dibuja la
            maqueta. El hito «Hoy» no lleva año porque no es una fecha. */}
        <ol className="mt-10 grid gap-6 sm:grid-cols-5 sm:gap-4">
          {TIMELINE_FLOTA.map((hito, i) => (
            <li key={hito.anio} className="relative flex gap-4 sm:block">
              {/* Riel: en móvil vertical a la izquierda, en desktop horizontal
                  arriba. El último hito no pinta riel (no hay nada después). */}
              <div className="flex flex-col items-center sm:flex-row">
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 rounded-full bg-coral ring-4 ring-coral/15"
                />
                {i < TIMELINE_FLOTA.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="w-px grow bg-linea sm:h-px sm:w-full sm:grow"
                  />
                ) : null}
              </div>
              <div className="pb-2 sm:mt-4 sm:pr-4">
                <p className="font-display text-lead font-semibold text-navy">{hito.anio}</p>
                <p className="mt-1 text-sm text-navy-sub">{hito.titulo}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Etiqueta>El equipo que te recibe</Etiqueta>
        <p className="mt-3 max-w-2xl text-lead text-navy-sub">
          Gerencia española afincada en Punta Cana desde 2012, y un equipo que vive el mar contigo.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {EQUIPO.map((m) => (
            <div key={m.id} className="flex flex-col rounded-card bg-papel-hueso p-5">
              <div className="flex items-center gap-4">
                <Retrato miembro={m} />
                <div className="min-w-0">
                  <p className="font-display text-h3 font-semibold text-navy">{m.nombre}</p>
                  <p className="text-sm text-navy-soft">{m.rol}</p>
                  <p className="mt-1 text-xs text-navy-soft">Desde {m.desde}</p>
                </div>
              </div>
              {/* La quote del fundador ya abre la sección de historia, tres
                  bloques más arriba: repetirla aquí palabra por palabra se
                  lee como un error de copia. Su card se queda con el rol y el
                  «desde», que es lo que aporta en la rejilla. */}
              {m.id === fundador?.id ? (
                <div className="grow" />
              ) : (
                <p className="mt-4 grow text-sm italic text-navy-sub">«{m.quote}»</p>
              )}
              {m.cta.tipo === 'whatsapp' ? (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex items-center justify-center rounded-btn bg-menta px-4 py-2.5 text-sm font-semibold text-menta-texto transition-colors hover:bg-menta/70"
                >
                  {m.cta.label}
                </a>
              ) : (
                // El fundador no lleva a WhatsApp: su CTA es la historia, que
                // es justo la sección de arriba — así que ancla ahí en vez de
                // navegar a otra página.
                <Link
                  to="/contacto"
                  className="mt-4 inline-flex items-center justify-center rounded-btn bg-papel px-4 py-2.5 text-sm font-semibold text-navy ring-1 ring-linea transition-colors hover:bg-papel-hueso"
                >
                  Hablar con nosotros
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
