import { Check, X } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { CARA_A_CARA } from '@/data/por-que-reservar'

// Tabla «Nosotros vs. los otros tours» — slide 54.
//
// Tabla de verdad (<table> con <th scope>), no una rejilla de divs: son datos
// tabulares y un lector de pantalla tiene que poder anunciar «Mariscos:
// Hispaniola, frescos del día; otros tours, congelados». Con divs se lee una
// lista de palabras sueltas.
//
// La columna nuestra va sobre un panel de menta que la recorre entera y se
// sale por arriba con su propia cabecera: es lo que hace que la tabla se
// «lea» antes de leerse — el ojo ve una columna encendida y otra apagada.
// La de al lado va en gris a propósito (linea/navy-soft, sin acento): no se
// insulta a nadie, simplemente no brilla.
//
// Scroll horizontal propio en móvil (regla del proyecto: el contenido ancho
// hace scroll dentro de su contenedor, la página nunca).
//
// La banda de urgencia que su maqueta ponía debajo («cada día que lo piensas,
// se llenan plazas») NO se pinta. Apretar escasez justo en la página cuyo
// argumento es «no somos los más baratos, somos los que te tratan bien» es
// contradictorio, y este proyecto ya dejó los patrones de urgencia de la v1
// marcados como duda de tono abierta. Lo que el cliente pidió de verdad en la
// reunión (33:52) son MUCHOS BOTONES hacia Tours — eso sí se hace, aquí y en
// cada bloque, sin inventar presión.
export function CaraACara() {
  return (
    <section>
      <div className="max-w-2xl">
        <Etiqueta>Cara a cara</Etiqueta>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">
          Nosotros y los otros tours
        </h2>
        <p className="mt-4 text-lead text-navy-sub">
          Lo que no se ve en el precio — pero se nota en tu día.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Comparación punto por punto entre Hispaniola y otros tours de la zona
          </caption>
          <thead>
            <tr>
              {/* Anchos explícitos: sin ellos el navegador reparte por
                  contenido y la columna de en medio —la nuestra, la del panel
                  de menta— salía desproporcionada frente a las otras dos. */}
              <th scope="col" className="w-[26%] pb-3 pr-4 text-sm font-medium text-navy-soft">
                <span className="sr-only">Concepto</span>
              </th>
              <th
                scope="col"
                className="w-[37%] rounded-t-card bg-menta px-5 pb-4 pt-4 font-display text-lg font-semibold text-menta-texto"
              >
                Hispaniola
              </th>
              <th
                scope="col"
                className="w-[37%] px-5 pb-4 pt-4 font-display text-lg font-medium text-navy-soft"
              >
                Otros tours
              </th>
            </tr>
          </thead>
          <tbody>
            {CARA_A_CARA.map((f, i) => (
              <tr key={f.concepto}>
                <th
                  scope="row"
                  className="border-t border-linea py-4 pr-4 align-middle text-sm font-medium text-navy-sub"
                >
                  {f.concepto}
                </th>
                <td
                  className={`bg-menta px-5 py-4 align-middle ${
                    i === CARA_A_CARA.length - 1 ? 'rounded-b-card' : ''
                  }`}
                >
                  <span className="flex items-start gap-2 text-sm font-semibold text-navy">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-menta-texto"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {f.nosotros}
                  </span>
                </td>
                <td className="border-t border-linea px-5 py-4 align-middle">
                  <span className="flex items-start gap-2 text-sm text-navy-soft">
                    <X className="mt-0.5 size-4 shrink-0 text-linea-fuerte" aria-hidden="true" />
                    {f.otros}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Boton to="/#tours">Ver disponibilidad</Boton>
      </div>
    </section>
  )
}
