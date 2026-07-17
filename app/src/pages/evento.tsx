import { Navigate, useParams } from 'react-router-dom'
import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'
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
      {/* «Reservar» del header apunta a la banda de cierre: en esta página
          no existe ni #tours (home) ni el widget (ficha) — lo reservable
          aquí es pedir la cotización. */}
      <Header ctaHref="#evento-cierre" />
      <CabeceraEvento evento={evento} />

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
