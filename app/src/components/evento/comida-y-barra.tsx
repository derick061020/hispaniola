import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { PAQUETES_COMIDA, BARRAS_EVENTO } from '@/data/eventos'
import { t } from '@/lib/i18n'

// El tarifario de a bordo, para la portada de /events.
//
// [2026-10-08, Derick: «esta información debe de agregarse en la sección
// EVENTS», con la captura del tarifario del cliente: «01 Choose your food» y
// «02 Choose your bar».]
//
// /events era solo la rejilla de las tres ocasiones: para saber qué se come y
// qué se bebe —y cuánto cuesta— había que entrar en una landing. Esto lo pone
// en la portada, que es donde llega quien aún no sabe si es party boat o boda.
//
// ES UN ESCAPARATE, NO UN SELECTOR. Las cards de las landings se eligen y
// mueven el widget de reserva; estas no hacen nada, porque aquí todavía no hay
// evento al que reservar. Por eso tampoco repiten la tabla comparativa de 8
// platos: ahí se compara plato a plato con el presupuesto delante, y aquí solo
// hace falta saber qué hay y de qué orden es el precio.
//
// Los dos arrays son LOS MISMOS que usan las landings (`PAQUETES_COMIDA` y
// `BARRAS_EVENTO`): si el cliente cambia un precio, cambia en los dos sitios o
// en ninguno. Dos copias del tarifario se separan a la primera subida.
function Paso({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
        {numero}
      </span>
      <TituloSeccion>{titulo}</TituloSeccion>
    </div>
  )
}

export function ComidaYBarra() {
  return (
    <section id="onboard" className="mx-auto max-w-7xl scroll-mt-sticky-top px-4 py-12 sm:px-6 lg:px-8">
      <Paso numero="01" titulo={t('Choose your food')} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PAQUETES_COMIDA.map((paquete) => (
          <article
            key={paquete.id}
            className={[
              'flex h-full flex-col rounded-card p-5',
              paquete.destacado === 'premium'
                ? 'bg-aqua-tint/40 ring-1 ring-aqua'
                : 'ring-1 ring-linea',
            ].join(' ')}
          >
            {paquete.destacado === 'premium' ? (
              <span className="mb-2 inline-flex w-fit rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-semibold text-aqua-dark">
                {t('Most complete')}
              </span>
            ) : null}
            <h3 className="font-display text-base font-semibold text-navy">
              {paquete.nombreCorto}
            </h3>
            <p className="mt-2 font-display text-h3 font-semibold text-coral">
              {paquete.precio}
            </p>
            <p className="text-xs uppercase tracking-wide text-navy-sub">
              {paquete.capacidad}
            </p>
            {/* Qué se come, derivado de los MISMOS items de la landing. No se
                resume como «todo lo del anterior y además…»: el Tide pierde el
                hot dog del Breeze, así que esa escalera sería mentira. */}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-sub">
              {paquete.items.map((i) => i.titulo).join(', ')}
            </p>
            <div className="mt-4 border-t border-linea pt-3 text-xs text-navy-sub">
              <p>{paquete.meta}</p>
              {paquete.extraPrecio ? (
                <p className="font-semibold text-navy">{paquete.extraPrecio}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <Paso numero="02" titulo={t('Choose your bar')} />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {BARRAS_EVENTO.map((barra) => (
            <article
              key={barra.id}
              className={[
                'flex h-full flex-col rounded-card p-5',
                barra.destacado
                  ? 'bg-aqua-tint/40 ring-1 ring-aqua'
                  : 'ring-1 ring-linea',
              ].join(' ')}
            >
              <h3 className="font-display text-base font-semibold text-navy">
                {barra.nombre}
              </h3>
              <p className="mt-2 font-display text-h3 font-semibold text-coral">
                {barra.precio}
              </p>
              <p className="text-xs uppercase tracking-wide text-navy-sub">
                {barra.precioNota}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-navy-sub">
                {barra.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
