import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { MUSEO, RUTA_CORAL_QUEST } from '@/data/museo'

// CIERRE — «Tu historia caribeña empieza aquí» (V1), en el fondo del todo.
//
// «Back to the surface» (la B2 lo llamaba «Subir a la superficie ↑») sube al
// héroe con scroll suave: el agua se aclara por el camino porque el fondo
// sigue al scroll, así que el regreso se VE, no es un salto.
//
// `data-museo-ascenso`: desde esta sección el agua vuelve a subir hacia aguas
// someras (use-descenso.ts), para que la espuma del footer rompa sobre
// turquesa y no sobre el abismo.

export function CierreMuseo() {
  const c = MUSEO.cierre
  const subir = () => {
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <section className="museo-seccion pb-28 text-center" data-museo-ascenso>
      <h2 className="mx-auto max-w-3xl font-display text-museo-titular font-semibold text-balance text-museo-texto" data-museo-revelar>
        {c.titulo}
      </h2>
      <p className="mt-5 text-lg text-museo-texto-suave" data-museo-revelar>
        {c.texto}
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3" data-museo-revelar>
        <Link to={RUTA_CORAL_QUEST} className="museo-boton-coral">
          {c.cta}
        </Link>
        <Link to="/foundation" className="museo-boton-vidrio">
          {c.ctaFundacion}
        </Link>
      </div>
      <button type="button" onClick={subir} className="museo-subir mt-16" data-museo-revelar>
        <ArrowUp className="size-4" aria-hidden="true" />
        {c.subir}
      </button>
    </section>
  )
}
