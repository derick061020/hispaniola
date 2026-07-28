import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'

// LA HISTORIA DE LA FUNDACIÓN, EN TRES TIEMPOS (rediseño 2026-07-28, 2ª
// vuelta — Samuel: «hay que darle un rediseño al contenido urgente, me parece
// aburrido, genérico, IA slop… que sea digerible y fácil a la vista»).
//
// Antes: dos párrafos corridos de ~60 palabras, uno detrás de otro, en la
// columna ancha de la página. Toda la información estaba ahí, pero para sacar
// los tres momentos que cuentan —el problema, la decisión, el resultado— había
// que leérselos enteros. Eso es exactamente lo que se lee como «texto de
// relleno»: no porque el copy sea malo (es real y es del cliente), sino porque
// no tiene forma.
//
// Aquí el MISMO texto es una línea de tiempo de tres paradas, con la foto real
// de cada una. La forma hace el trabajo: se entiende de un vistazo sin leer
// una palabra (arrecife pelado → vivero → arrecife lleno de peces) y quien
// quiera el detalle lo tiene debajo en dos líneas.
//
// EL HILO. Un punteado gris finísimo que enhebra las tres paradas por la
// altura del año. Es el mismo recurso —y el mismo color— que la ruta del
// recorrido de /ventaja-competitiva (--color-recorrido-ruta): estructura, no
// acento. No es una divisoria de las que el cliente ha pedido quitar tres
// veces: no separa dos bloques, CONECTA tres. Por eso es punteado y no sólido.
//
// El hilo vive DENTRO de cada parada y se cuela en el pasillo con `-mr-*`
// negativo: así llega al punto de la siguiente sin ningún elemento absoluto ni
// medición en JS. Por debajo de sm no se pinta — apiladas en vertical, un hilo
// horizontal no une nada.
export function CronologiaFundacion() {
  const total = FUNDACION.cronologia.length

  return (
    <section>
      <Etiqueta>{FUNDACION.cronologiaEyebrow}</Etiqueta>

      {/* El pasillo entre paradas lo pone `gap-x`, NO un padding derecho por
          parada: con padding, la última —que no lo lleva— salía más ancha y
          su foto (aspect-4/3) más alta que las otras dos, con el titular
          descolgado un renglón. Con gap las tres columnas miden exactamente
          igual y el hilo lo cruza con un margen negativo del mismo valor. */}
      <ol className="mt-6 grid gap-10 sm:grid-cols-3 sm:gap-x-8">
        {FUNDACION.cronologia.map((paso, i) => (
          <li key={paso.marca}>
            <p className="font-display text-h2 font-semibold text-aqua-dark">{paso.marca}</p>

            {/* La parada: punto lleno + hilo hacia la siguiente. El punto es
                el ÚNICO aqua sólido de la sección (dirección visual B: el aqua
                es acento con cuentagotas). aria-hidden — el orden ya lo da el
                <ol>, y «Antes / 2016 / Hoy» ya está leído en el año. */}
            <div aria-hidden="true" className="mt-4 flex items-center gap-3 sm:-mr-8">
              <span className="size-2.5 shrink-0 rounded-full bg-aqua" />
              {i < total - 1 ? <span className="fund-hilo hidden flex-1 sm:block" /> : null}
            </div>

            <div className="mt-5 aspect-[4/3] overflow-hidden rounded-card">
              <img
                src={`/fotos/${paso.foto}.webp`}
                alt={paso.fotoAlt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </div>

            <h3 className="mt-4 font-display text-h3 font-semibold text-navy">{paso.titulo}</h3>
            <p className="mt-2 text-navy-sub">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
