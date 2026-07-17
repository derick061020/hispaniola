import { Etiqueta } from '@/components/ui/etiqueta'
import type { FichaEvento } from '@/data/eventos'

// Los formatos del evento («Tres momentos, tres formatos» en bodas,
// «Formatos» en empresas): 3 cards de foto + título + una línea — el grid-3
// del prototipo. Las cards NO navegan (no hay una página por formato, el
// formato se cuenta en el formulario de cotización), así que no llevan hover
// de zoom: ese gesto es de las superficies que van a algún sitio (megamenús,
// TourCard).
export function FormatosEvento({ evento }: { evento: FichaEvento }) {
  return (
    <section>
      <Etiqueta>{evento.formatosTitulo}</Etiqueta>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {evento.formatos.map((f) => (
          <article key={f.titulo} className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
            <img src={`/fotos/${f.foto}.webp`} alt={f.fotoAlt} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-display text-base font-semibold text-navy">{f.titulo}</h3>
              <p className="mt-1 text-sm text-navy-soft">{f.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
