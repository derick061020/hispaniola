import { Meta } from '@/components/seo/meta'
import { Boton } from '@/components/ui/boton'

// Ruta comodín — App.tsx no tenía ninguna (PLAN-LANZAMIENTO.md Bloque I): una
// URL desconocida no debe devolver una pantalla en blanco ni un 200 mentiroso
// al crawler. `noindex` porque una 404 no es contenido que valga indexar.
export function NoEncontradoPage() {
  return (
    <div className="grid min-h-svh place-items-center px-5 text-center">
      <Meta titulo="Página no encontrada" descripcion="La página que buscas no existe." ruta="/404" indexable={false} />
      <div>
        <p className="font-display text-h2 font-semibold text-navy">404</p>
        <p className="mt-2 text-lead text-navy-sub">No encontramos esta página.</p>
        <Boton href="/" className="mt-6">
          Volver al inicio
        </Boton>
      </div>
    </div>
  )
}
