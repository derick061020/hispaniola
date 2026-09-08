import { Etiqueta } from '@/components/ui/etiqueta'
import { EVENTOS } from '@/data/eventos'
import { CardEvento } from './card-evento'
import { t } from '@/lib/i18n'

// "Otras ocasiones" (PLAN-EVENTOS.md) — mini-cards con los OTROS 2
// eventos del catálogo. Misma estructura que `tambien-te-gusta.tsx`
// (la sección de la ficha de tour que enseña 2 tours relacionados),
// pero apuntando a `EVENTOS` en vez de `TOURS`. Sale del grid principal
// de la landing y se vuelve su propia sección a ancho completo entre
// el área de contenido y el footer — mismo principio que
// PLAN-INTERNAS-V2.md §C4 ("También te puede gustar" no comparte
// columna con la FAQ, vive ancho completo).
//
// La card usa `FotoPrincipal` (la pieza compartida con la home) con
// hover-zoom, gradiente inferior y nombre+meta encima. El link es
// `<Link>` real a la otra landing — la primera navegación interna
// entre las 3 landings de eventos (era EnlacePrototipo en la versión
// anterior, antes de que las 3 tuvieran landing propia).

// [2026-09-08] La card se fue a `card-evento.tsx`: la comparte con la rejilla
// de /events. Aqui solo queda lo propio de esta seccion — el eyebrow, el
// filtro del evento actual y las dos columnas.
export function OtrasOcasiones({ slugActual }: { slugActual: string }) {
  const otras = Object.values(EVENTOS).filter((e) => e.slug !== slugActual)
  if (otras.length === 0) return null

  return (
    <section className="mx-auto max-w-contenido px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <Etiqueta>{t('Other occasions')}</Etiqueta>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {otras.map((e) => (
          <CardEvento key={e.slug} evento={e} />
        ))}
      </div>
    </section>
  )
}
