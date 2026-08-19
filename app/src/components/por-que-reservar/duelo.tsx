import { Check, X } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { CARA_A_CARA } from '@/data/por-que-reservar'
import { t } from '@/lib/i18n'

// «Cara a cara» — slide 54, el duelo.
//
// La primera versión era una tabla de texto con la columna nuestra pintada
// de menta. Correcta y olvidable: seis filas de palabras contra seis filas de
// palabras, que es exactamente la forma en que la competencia también dice
// que su comida es buena.
//
// Aquí cada concepto es un DUELO: a la izquierda la prueba (foto real de lo
// nuestro), a la derecha lo que ofrecen los demás. Se gana antes de leer,
// porque un plato de langosta recién hecho al lado de la palabra
// «congelados» no necesita argumentación.
//
// ⚠️ EL LADO DERECHO NO LLEVA FOTO, Y ES DELIBERADO. No tenemos fotos de la
// competencia y no se inventan ni se compran en un banco de imágenes: sería
// exactamente la clase de trampa que esta página dice no hacer. Ese lado es
// un HUECO rayado (.pqr-hueco, componentes.css) — más honesto y, de paso,
// más elocuente que cualquier foto de relleno.
//
// Las dos últimas filas (traslado y reserva) no tienen foto propia: van al
// final, sólo con texto. Ver el porqué en data/por-que-reservar.ts.
//
// No es un <table> aunque lo parezca: cada fila es una pieza con foto,
// etiqueta y dos afirmaciones enfrentadas, no una celda de datos. Una lista
// de comparaciones se anuncia igual de bien y sin obligar a un lector de
// pantalla a navegar una rejilla de 3×6 para oír «Mariscos: frescos del día».
export function Duelo() {
  return (
    <section>
      <div className="max-w-2xl">
        <Etiqueta>{t('Head to head')}</Etiqueta>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">
          {t('The same thing, they say. Look at it side by side.')}
        </h2>
        <p className="mt-4 text-lead text-navy-sub">
          {t('What you don’t see in the price, but you feel all day.')}
        </p>
      </div>

      {/* Los dos bandos, una sola vez arriba. Dentro de cada fila los rótulos
          van en sr-only: en pantalla los ordena esta cabecera, pero un lector
          de pantalla lee las filas sueltas y sin ellos oiría «frescos del
          día / congelados» sin saber de quién es cada cosa. */}
      <div
        aria-hidden="true"
        className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8"
      >
        <p className="hidden lg:block" />
        <p className="font-display text-lg font-semibold text-navy">{t('With us')}</p>
        <p className="font-display text-lg font-medium text-navy-soft">{t('Other tours')}</p>
      </div>

      <ul className="mt-4 flex flex-col">
        {CARA_A_CARA.map((f) => (
          <li
            key={f.concepto}
            className="grid grid-cols-2 items-stretch gap-4 border-t border-linea py-6 sm:gap-6 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8"
          >
            {/* La etiqueta del concepto: en desktop es la primera columna, el
                raíl que ordena el duelo; en móvil no hay sitio para tres
                columnas, así que encabeza la fila a lo ancho. */}
            <p className="col-span-2 text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft lg:col-span-1 lg:self-center">
              {f.concepto}
            </p>

            {/* Lo nuestro. Sin card ni borde: la foto ES la pieza. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {f.foto ? (
                <img
                  src={`/fotos/${f.foto}.webp`}
                  alt={f.fotoAlt}
                  loading="lazy"
                  className="h-24 w-full shrink-0 rounded-card object-cover shadow-card sm:w-32"
                />
              ) : null}
              <p className="flex items-start gap-2">
                <Check
                  className="mt-1 size-4 shrink-0 text-menta-texto"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="font-display text-lg font-semibold leading-snug text-navy">
                  <span className="sr-only">{t('With us:')}{' '}</span>
                  {f.nosotros}
                </span>
              </p>
            </div>

            {/* Lo suyo. El hueco rayado ocupa el sitio donde nosotros ponemos
                la foto: la fila se lee como una balanza, no como dos listas. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {f.foto ? (
                <span
                  aria-hidden="true"
                  className="pqr-hueco h-24 w-full shrink-0 rounded-card sm:w-32"
                />
              ) : null}
              <p className="flex items-start gap-2">
                <X className="mt-1 size-4 shrink-0 text-linea-fuerte" aria-hidden="true" />
                <span className="text-lg leading-snug text-navy-soft">
                  <span className="sr-only">{t('Other tours:')}{' '}</span>
                  {f.otros}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-4 border-t border-linea pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-lg text-lead text-navy-sub">
          {t('None of these six things is an extra. They all come inside the same price.')}
        </p>
        <Boton to="/#tours" className="shrink-0">
          {t('See availability')}
        </Boton>
      </div>
    </section>
  )
}
