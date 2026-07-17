import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraEvento } from '@/components/evento/cabecera-evento'
import { FormatosEvento } from '@/components/evento/formatos-evento'
import { IncluyeEvento } from '@/components/evento/incluye-evento'
import { CierreEvento } from '@/components/evento/cierre-evento'
import { EVENTOS } from '@/data/eventos'

// Landing de evento — UNA plantilla para las 2 landings con destino propio
// (Bodas y Empresas/MICE, las `esLanding: true` de OCASIONES), igual que la
// ficha de tour es una plantilla para los 4 productos. En Figma: una página
// con frames de variante, no 2 diseños.
//
// Es una página de PERSUASIÓN, no de conversión directa: aquí no hay precio
// ni widget — el evento se cotiza. Por eso no lleva barra móvil ni sticky:
// su único trabajo es que el visitante pida cotización, y ese formulario
// (el hub de eventos, con deep-link ?tipo=) vive en el prototipo, fuera de
// este build — misma frontera que el funnel en la ficha de tour.
//
// Las otras 4 ocasiones (cumpleaños, aniversarios, despedidas, reuniones) NO
// tienen landing: van directas al formulario del hub con el tipo
// preseleccionado (NOTAS['eventos-hub'] del prototipo) — una landing por
// ocasión sin contenido propio sería relleno.
export function EventoPage() {
  const { slug } = useParams()
  const evento = slug ? EVENTOS[slug] : undefined

  // Slug desconocido → a la home, como en la ficha de tour: un 404 diseñado
  // es otra pantalla (y otro plan).
  if (!evento) return <Navigate to="/" replace />

  return (
    <div>
      {/* PLAN-INTERNAS-V2.md §C5: hero compartido con la home y la ficha de
          tour (HeroInterna) — el header pasa a vivir DENTRO, sobre las fotos
          reales del evento en fundido. «Reservar» del header apunta a la
          banda de cierre: en esta página no existe ni #tours (home) ni el
          widget (ficha) — lo reservable aquí es pedir la cotización. */}
      <HeroInterna fotos={evento.galeria} etiqueta={evento.nombre} ctaHref="#evento-cierre">
        <CabeceraEvento evento={evento} />
      </HeroInterna>

      {/* Banda de cifras (solo empresas) — sale de CabeceraEvento (§C5): ya
          no compite con la foto del hero, queda en blanco justo debajo. */}
      {evento.stats ? (
        <div className="mx-auto max-w-contenido px-5 pt-8 sm:px-10 sm:pt-10">
          <dl className="grid grid-cols-2 gap-6 rounded-card bg-papel-hueso p-6 sm:grid-cols-4">
            {evento.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-stat font-semibold text-navy">{s.valor}</span>
                  <span className="mt-1 block text-xs text-navy-soft">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:gap-16">
          <FormatosEvento evento={evento} />
          <IncluyeEvento evento={evento} />
          <CierreEvento evento={evento} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
