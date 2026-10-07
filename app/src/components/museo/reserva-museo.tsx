import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { MUSEO, PRECIO_MUSEO, RUTA_CORAL_QUEST } from '@/data/museo'

// RESERVA — «Visítalo con Coral Quest» (V1).
//
// [3ª vuelta, Samuel: «mejorar el apartado de book»] Era un panel de vidrio con
// dos cajas de precio iguales dentro: se leía como un formulario. Ahora es una
// FICHA partida en dos:
//   · a la izquierda, una foto del museo con gente (el buzo con el Diablo
//     Cojuelo) y, encima, lo que incluye el tour en cuatro datos — los del
//     propio texto del V1 («cuatro horas, transporte desde tu hotel y almuerzo
//     gourmet a bordo», «para todas las edades»). Vende la experiencia antes
//     que el precio;
//   · a la derecha, el texto, las dos opciones como FILAS de precio —nombre y
//     menú a un lado, cifra al otro— y no como dos botones grandes que parecen
//     elegirse y no eligen nada. Premium lleva el dorado con el que la web
//     marca lo premium en todas partes (--color-premium-oro).
//
// El PRECIO no se escribe aquí: sale de PRECIO_MUSEO, que lo lee de los datos
// del tour, y pasa por formatoDinero (respeta el selector de divisa).
//
// ⚠️ Sin widget de reserva, a propósito: el motor vive en la ficha del tour y
// el botón lleva allí. Un segundo widget aquí sería un segundo sitio donde el
// precio puede desviarse — el problema que costó resolver en agosto.

export function ReservaMuseo() {
  const r = MUSEO.reserva
  const precios = { light: PRECIO_MUSEO.light, premium: PRECIO_MUSEO.premium }

  return (
    <section id="book" className="museo-seccion">
      <div className="museo-reserva" data-museo-revelar>
        <figure className="museo-reserva-foto">
          <img src={`/fotos/${r.foto}.webp`} alt={r.fotoAlt} loading="lazy" className="size-full object-cover" />
          <figcaption className="museo-reserva-datos">
            <span className="museo-eyebrow">{r.tour}</span>
            <ul className="mt-3 flex flex-wrap gap-2">
              {r.datos.map((d) => (
                <li key={d} className="museo-dato">
                  {d}
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>

        <div className="museo-reserva-cuerpo">
          <p className="museo-eyebrow">{r.eyebrow}</p>
          <h2 className="museo-h2 mt-3">{r.titulo}</h2>
          <p className="mt-4 text-museo-texto-suave">{r.texto}</p>

          <ul className="mt-8 flex flex-col">
            {r.opciones.map((o) => (
              <li key={o.id} className="museo-opcion" data-premium={o.id === 'premium' ? '' : undefined}>
                <div className="min-w-0">
                  <p className="museo-opcion-nombre">{o.nombre}</p>
                  <p className="mt-1 text-sm text-museo-texto-suave">{o.texto}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="block font-display text-h2 font-semibold leading-none text-museo-texto">
                    {formatoDinero(precios[o.id as 'light' | 'premium'])}
                  </span>
                  <span className="mt-1 block text-xs text-museo-texto-tenue">{r.porPersona}</span>
                </p>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {r.garantias.map((g) => (
              <li key={g} className="flex items-center gap-2 text-sm text-museo-texto-suave">
                <Check className="size-4 text-museo-luz" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>

          <Link to={RUTA_CORAL_QUEST} className="museo-boton-coral group mt-8 w-full justify-center">
            {r.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-museo-texto-tenue">
            <span aria-hidden="true" className="museo-pulso" />
            {r.nota}
          </p>
        </div>
      </div>
    </section>
  )
}
