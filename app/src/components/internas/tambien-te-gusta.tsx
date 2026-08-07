import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FotosFundido } from '@/components/ui/fotos-fundido'
import { useDevFlag } from '@/dev/use-dev-flag'
import { TOURS, bookingCta, formatoDinero } from '@/data/home'
import { FICHAS } from '@/data/tours'

// «También te puede gustar» (PLAN-INTERNAS-V2.md §C4, pedido de Samuel: no
// quería que compartiera columna con la FAQ, y las cards de antes «parecen
// feas y simples» — pedía boxes que abarquen todo el ancho, prácticamente
// solo imágenes pasando con fade de fondo y el texto encima). Sale de
// FaqTour y se vuelve su propia sección a ancho completo, entre el área gris
// de la ficha y el footer.
//
// Cada box es un <FotosFundido> (las fotos REALES de ESE tour — misma fuente
// que su propio hero: [tour.foto, ...ficha.galeriaCompleta]) con gradiente
// inferior y el nombre/meta encima — el texto es rótulo, no párrafo. Son los
// PRIMEROS enlaces internos reales del sitio (<Link> a otra ficha): hasta
// aquí todo lo que no era la home iba por EnlacePrototipo. Es también la
// prueba viva de ScrollAlNavegar — sin él, ir de una ficha a otra aterrizaría
// a media página.
export function TambienTeGusta({ slugs }: { slugs: string[] }) {
  const relacionados = slugs
    .map((slug) => ({ tour: TOURS.find((t) => t.slug === slug)!, ficha: FICHAS[slug] }))
    .filter((r) => r.tour && r.ficha)

  // [dev-mode] ?dev-tambien=pausado congela el fundido de cada box en su 1ª
  // foto — es el frame que viaja a Figma. Ver src/dev/dev-registry.ts
  const [pausado, setPausado] = useState(false)
  useDevFlag('dev-tambien', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  if (relacionados.length === 0) return null

  return (
    <section className="mx-auto max-w-contenido px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <Etiqueta>You might also like</Etiqueta>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {relacionados.map(({ tour: t, ficha: f }) => (
          <Link
            key={t.slug}
            to={`/tours/${t.slug}`}
            className="group relative flex h-tambien-alto items-end overflow-hidden rounded-card-grande"
          >
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
              <FotosFundido
                fotos={[t.foto, ...f.galeriaCompleta]}
                etiqueta={t.nombre}
                activa={!pausado} // [dev-mode]
                className="absolute inset-0 size-full"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
            <div className="relative z-10 p-5 text-white sm:p-6">
              <p className="font-display text-lg font-semibold sm:text-xl">{t.nombre}</p>
              <p className="mt-1 text-sm text-white/85">
                {f.audiencia} ·{' '}
                {t.precioLight !== null ? `from ${formatoDinero(t.precioLight)} /person` : bookingCta[t.booking]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
