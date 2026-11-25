import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento } from '@/data/eventos'
import { TarjetasBarra } from './tarjetas-barra'

// «02 Choose your bar» — la segunda mitad de la decisión.
//
// [2026-10-08, Derick, con el tarifario del cliente delante: «esta información
// debe de agregarse en la sección EVENTS»]
//
// Hasta hoy la web publicaba la comida con su precio y de beber solo decía
// «national open bar», suelto en la lista de «qué incluye». Pero se venden DOS
// cosas, y la barra se cobra POR PERSONA: en un party boat de 30, subir a
// Signature son 900 dólares. Enterarse de eso en la cotización y no en la
// página es la clase de sorpresa que tumba la venta.
//
// POR QUÉ NO SON LAS CARDS DE LOS PAQUETES. Allí las 4 enseñan los MISMOS 8
// platos con ✓ y — porque se comparan plato a plato. Aquí no hay nada que
// tabular: son marcas y cócteles, y una lista de doce bullets por card se lee
// peor que la frase. Lo que sí se copia es lo que allí funcionó: el precio con
// su unidad PEGADA («+US$ 15 · por persona»), que es lo que impide leer el
// número como el precio de la barra entera.
export function BarrasEvento({ evento }: { evento: FichaEvento }) {
  const barras = evento.barras
  if (!barras || barras.items.length === 0) return null

  return (
    <section id="ancla-barras" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{barras.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{barras.intro}</p>

      {/* [2026-11-25] Las tarjetas viven en tarjetas-barra.tsx: las comparten
          estas landings y las de Fiesta on Deck (mismo formato, pidió el Sr.
          Fernando: «mismo formato de hispaniola»). */}
      <TarjetasBarra items={barras.items} />
    </section>
  )
}
