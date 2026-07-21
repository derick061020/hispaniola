import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EQUIPO, type MiembroEquipo } from '@/data/nosotros'
import { WHATSAPP_URL } from '@/data/tours'

// «Las personas detrás de tu día en el mar» — sección de equipo en la home
// (correcciones v1 del cliente, 2026-07-20, planes/01-home.md slide 15:
// «agregar sección del equipo»).
//
// Es un TEASER, no la sección completa: el equipo con nombre, la tripulación
// a bordo y la flota ya viven en /nosotros, y duplicar los 3 bloques en la
// home dejaría dos sitios que corregir cada vez que el cliente cambie un
// cargo. Aquí van las 3 personas y un CTA a la página; allí va la historia
// completa con timeline. Misma fuente de datos (EQUIPO en data/nosotros.ts),
// que además alimenta la card de persona de Contacto.
//
// Ubicación (pages/home.tsx): entre WhyDirect e IncluyeCrucero — la zona de
// «por qué nosotros». Justo después de que la página argumenta por qué
// reservar directo, enseña con quién estás hablando.
//
// ⚠️ Sin fotos: EQUIPO tiene foto: null en los 3 (el cliente no las ha
// mandado). Se pintan iniciales en un círculo, el mismo placeholder honesto
// que las reseñas de la home usan para los clientes. Cuando lleguen los
// retratos, solo cambia el dato.

function Retrato({ miembro }: { miembro: MiembroEquipo }) {
  if (miembro.foto) {
    return (
      <img
        src={`/fotos/${miembro.foto}.webp`}
        alt={`${miembro.nombre}, ${miembro.rol}`}
        className="size-20 rounded-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="grid size-20 place-items-center rounded-full bg-aqua-tint font-display text-2xl font-semibold text-aqua-dark"
    >
      {miembro.nombre.slice(0, 1)}
    </div>
  )
}

function CardMiembro({ miembro }: { miembro: MiembroEquipo }) {
  // El CTA de cada persona: los de trato directo abren WhatsApp (es el canal
  // real del cliente); el del fundador lleva a la historia completa.
  const esWhatsapp = miembro.cta.tipo === 'whatsapp'
  const clasesCta = esWhatsapp
    ? 'bg-menta text-menta-texto hover:bg-menta/70'
    : 'ring-1 ring-linea text-navy hover:bg-papel-hueso'

  return (
    <div className="flex flex-col items-center rounded-card-grande bg-papel p-6 text-center ring-1 ring-linea">
      <Retrato miembro={miembro} />
      <p className="mt-4 font-display text-h3 font-semibold text-navy">{miembro.nombre}</p>
      <p className="mt-0.5 text-sm text-navy-soft">{miembro.rol}</p>
      <p className="mt-3 rounded-chip bg-papel-hueso px-3 py-1 text-xs font-medium text-navy-sub">
        En el equipo desde {miembro.desde}
      </p>
      <p className="mt-4 grow text-sm italic text-navy-sub">«{miembro.quote}»</p>
      {esWhatsapp ? (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          className={`mt-5 inline-flex w-full items-center justify-center rounded-btn px-4 py-2.5 text-sm font-semibold transition-colors ${clasesCta}`}
        >
          {miembro.cta.label}
        </a>
      ) : (
        <Link
          to="/nosotros"
          className={`mt-5 inline-flex w-full items-center justify-center rounded-btn px-4 py-2.5 text-sm font-semibold transition-colors ${clasesCta}`}
        >
          {miembro.cta.label}
        </Link>
      )}
    </div>
  )
}

export function EquipoTeaser() {
  return (
    <section className="bg-papel-hueso px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="text-center">
          <Etiqueta>Conócenos</Etiqueta>
          <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
            Las personas detrás de tu día en el mar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lead text-navy-sub">
            Gerencia española afincada en Punta Cana desde 2012. Conocemos el Caribe de cerca — y esa
            cercanía es justo lo que nos permite ofrecerte tours de calidad sin pasar por un portal.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {EQUIPO.map((m) => (
            <CardMiembro key={m.id} miembro={m} />
          ))}
        </div>

        {/* Cierre: la tripulación a bordo (capitán, bióloga, chef, guía) NO se
            lista aquí — vive en /nosotros. Esta línea la menciona y lleva
            allí, que es el trabajo de un teaser. */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/nosotros"
            className="group inline-flex items-center gap-1.5 text-lead font-semibold text-coral transition-colors hover:text-coral-dark"
          >
            Conoce también a la tripulación a bordo
            <ArrowRight
              className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
