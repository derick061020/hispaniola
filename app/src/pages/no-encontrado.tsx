import { Meta } from '@/components/seo/meta'
import { Boton } from '@/components/ui/boton'
import { Header } from '@/components/home/header'

// Ruta comodín — App.tsx no tenía ninguna (PLAN-LANZAMIENTO.md Bloque I): una
// URL desconocida no debe devolver una pantalla en blanco ni un 200 mentiroso
// al crawler. `noindex` porque una 404 no es contenido que valga indexar.
//
// Header (auditoría responsive 2026-07-17): la página no tenía NINGÚN nav —
// sin `id="hero"` tampoco activa NavFlotante, así que un usuario perdido
// quedaba sin más salida que "Volver al inicio". El Header 'solida' (mismo
// que el resto del sitio fuera de la home/ficha) da logo + Tours/Eventos/
// Nosotros/Ayuda + Reservar en desktop, y el menú hamburguesa completo en
// móvil — recupera tráfico en vez de solo devolverlo a "/".
export function NoEncontradoPage() {
  return (
    <div>
      <Meta titulo="Página no encontrada" descripcion="La página que buscas no existe." ruta="/404" indexable={false} />
      <Header />
      <div className="grid min-h-[70svh] place-items-center px-5 text-center">
        <div>
          <p className="font-display text-h2 font-semibold text-navy">404</p>
          <p className="mt-2 text-lead text-navy-sub">No encontramos esta página.</p>
          <Boton href="/" className="mt-6">
            Volver al inicio
          </Boton>
        </div>
      </div>
    </div>
  )
}
