import { Navigate, useParams } from 'react-router-dom'
import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'
import { CabeceraFicha } from '@/components/tour/cabecera-ficha'
import { TOURS } from '@/data/home'
import { FICHAS } from '@/data/tours'

// Ficha de tour — UNA plantilla para los 4 productos (PLAN-TOURS.md).
// Es la página de conversión del sitio: aquí el visitante tiene el precio
// delante, compara contra Viator y decide.
//
// Las 3 variantes NO son 3 diseños: son el mismo layout con el widget y las
// secciones que cada modo de `booking` puede sostener honestamente
// (`completo` / `cotizacion` / `consulta`). En Figma, una página con frames de
// variante — no 4 páginas.
//
// El funnel de reserva (4 pasos) NO es parte de este build: sigue bloqueado
// por la decisión del motor xpotours (reemplazar / re-skinear), pendiente del
// cliente. El CTA del widget es la frontera — se pinta con su estado real
// pero no navega (EnlacePrototipo).
export function TourPage() {
  const { slug } = useParams()
  const tour = TOURS.find((t) => t.slug === slug)
  const ficha = slug ? FICHAS[slug] : undefined

  // Slug desconocido → a la home. Un 404 diseñado es otra pantalla (y otro
  // plan): fingir una aquí sería inventarse una página que nadie ha aprobado.
  if (!tour || !ficha) return <Navigate to="/" replace />

  return (
    <div className="pb-16 md:pb-0">
      {/* Primer uso real de la variante 'solida' del header: existe desde
          v3-F8 pero hasta ahora solo vivía la 'sobreVideo' dentro del hero.
          El CTA apunta al widget de esta página — en la home apunta al grid
          de tours (#tours), que aquí no existe. */}
      <Header ctaHref="#ficha-widget" />
      <CabeceraFicha tour={tour} ficha={ficha} />
      <Footer />
    </div>
  )
}
