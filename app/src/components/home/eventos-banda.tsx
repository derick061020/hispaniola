import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Etiqueta } from '@/components/ui/etiqueta'

// Banda de eventos privados — enlaza al hub de eventos del prototipo
// (fuera de alcance de este build).
export function EventosBanda() {
  return (
    <section className="px-5 py-seccion-sm sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 rounded-card bg-navy p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="max-w-lg">
            <Etiqueta sobreOscuro>Eventos privados</Etiqueta>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">
              Bodas, cumpleaños y team-buildings a bordo
            </h2>
            <p className="mt-1.5 text-sm text-white/75">
              Charter completo con comida, barra libre y coordinación. Hasta 120 personas.
            </p>
          </div>
          <EnlacePrototipo className="inline-flex shrink-0 items-center justify-center rounded-btn border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            Pedir cotización
          </EnlacePrototipo>
        </div>
      </div>
    </section>
  )
}
