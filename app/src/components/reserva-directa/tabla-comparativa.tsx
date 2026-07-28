import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'

// Tabla «Nosotros vs. los otros tours» (correcciones v2, plan 07 §3 — slide 54).
//
// Contenido del cliente, con UNA corrección: la fila «cocina a bordo» venía
// VACÍA en las dos columnas de su maqueta. Es un descuido de la IA con la que
// la hizo, y da igual, porque ahí está el argumento más fuerte que tiene la
// empresa — la única cocina flotante de Punta Cana. Se rellena, no se copia el
// hueco.
//
// La banda de urgencia que su maqueta ponía debajo («cada día que lo piensas,
// se llenan plazas») NO se pinta: apretar escasez justo en la página cuyo
// argumento es «no somos los más baratos, somos los que te tratan bien» es
// contradictorio. Lo que el cliente pidió de verdad en la reunión (33:52) son
// MUCHOS BOTONES hacia Tours — eso sí se hace, y sin inventar presión.
//
// Scroll horizontal propio en móvil: regla del proyecto — el contenido ancho
// hace scroll dentro de su contenedor, la página nunca.

type Fila = { concepto: string; nosotros: string; otros: string }

const FILAS: Fila[] = [
  { concepto: 'Mariscos', nosotros: 'Frescos del día', otros: 'Congelados' },
  { concepto: 'Bebidas', nosotros: 'De marca, sin diluir', otros: 'Diluidas' },
  { concepto: 'Traslado', nosotros: 'Bus con aire acondicionado', otros: 'Vehículo abierto' },
  {
    concepto: 'Cocina',
    nosotros: 'La única cocina flotante de Punta Cana',
    otros: 'Comida recalentada',
  },
  { concepto: 'Fotos del tour', nosotros: 'Incluidas', otros: 'Se cobran aparte' },
  { concepto: 'Reserva', nosotros: 'Directa con el propietario', otros: 'Por intermediario' },
]

export function TablaComparativa() {
  return (
    <section>
      <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua">
        La diferencia, punto por punto
      </p>
      <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
        Nosotros y los otros tours
      </h2>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-linea">
              <th scope="col" className="pb-3 pr-4 text-sm font-medium text-navy-soft">
                &nbsp;
              </th>
              <th scope="col" className="pb-3 pr-4 font-display text-base font-semibold text-navy">
                Hispaniola
              </th>
              <th scope="col" className="pb-3 text-base font-medium text-navy-soft">
                Otros tours
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linea">
            {FILAS.map((f) => (
              <tr key={f.concepto}>
                <th scope="row" className="py-4 pr-4 text-sm font-medium text-navy-sub">
                  {f.concepto}
                </th>
                <td className="py-4 pr-4">
                  <span className="flex items-start gap-2 text-sm font-medium text-navy">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-menta-texto"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {f.nosotros}
                  </span>
                </td>
                <td className="py-4">
                  <span className="flex items-start gap-2 text-sm text-navy-soft">
                    <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {f.otros}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/#tours"
        className="mt-8 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Ver disponibilidad
      </Link>
    </section>
  )
}
