import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { CERO_PLASTICO } from '@/data/flota'

// EL BANNER DE CIERRE DE /flota, ENFOCADO A CERO PLÁSTICO (slide 30).
//
// El cliente dibujó una flecha desde el banner de «El arrecife que
// reconstruimos» con la nota «banner enfocado a 0 plastico». El plan 04 §4
// dejó abiertas dos lecturas —cambiarle el mensaje al banner de coral, o
// añadir un segundo banner— y Samuel las cierra: en esta página el banner
// CAMBIA. «El texto debe ser sobre eso y la imagen de fondo también».
//
// Por qué tiene sentido aquí y no es perder el banner de coral: en una página
// que enseña las embarcaciones una a una, «cero plástico a bordo» es un
// argumento SOBRE LOS BARCOS — habla del equipamiento que acabas de ver en
// las fichas técnicas. El coral es sobre el destino, tiene su propia página, y
// el CTA de aquí sigue llevando allí, así que el tráfico interno que daba el
// banner anterior no se pierde: solo deja de ser el titular.
//
// Anatomía heredada de nosotros/arrecife-teaser.tsx (foto a sangre +
// gradiente navy cargado del lado del texto): son el mismo tipo de pieza y no
// hay motivo para que se vean distintas. Lo que cambia es el contenido.
//
// 2ª vuelta (Samuel, 2026-07-28), dos cambios y los dos van de QUITAR:
//   · las 3 sustituciones ya no van separadas por líneas — «al cliente no le
//     gusta tanta línea», mismo pedido que en la banda de KPIs de arriba;
//   · el sello eco de la home, que ocupaba la derecha, se cae por el recorte
//     real del catamarán. Ver el comentario largo junto a la imagen: el
//     problema no era el dibujo, era que un disco plano sobre una foto se lee
//     como pegatina, y eso no se arregla con tamaño ni con sombra.
//
// ⚠️ Las 3 sustituciones concretas (cristal / vajilla reutilizable / pajitas
// vegetales) están PENDIENTES DE CONFIRMAR con el cliente — ver data/flota.ts
// §4. Sin ellas «cero plástico» es un eslogan; con ellas mal, es un error de
// detalle que nadie detecta. Se pintan porque sin nada concreto el banner no
// tenía cuerpo, pero hay que preguntarlo antes de publicar.
export function BannerCeroPlastico() {
  return (
    <section className="relative overflow-hidden rounded-card-grande">
      <img
        src={`/fotos/${CERO_PLASTICO.foto}.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Gradiente más cargado a la izquierda, donde vive el texto, abriendo
          hacia la derecha para que se vea más mar. Igual que el de arrecife. */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-navy/92 via-navy/78 to-navy/35" />

      {/* `lg:pr-*`: el hueco que se le reserva al barco de la esquina, que ya
          no es una columna de la rejilla sino una capa absoluta (ver abajo).
          Sin esta reserva, las 3 sustituciones se meterían por debajo del
          casco. */}
      <div className="relative p-8 sm:p-10 lg:p-12 lg:pr-64 xl:pr-80">
        <div>
          <Etiqueta sobreOscuro>{CERO_PLASTICO.eyebrow}</Etiqueta>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
            {CERO_PLASTICO.titulo}
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-white/85">{CERO_PLASTICO.texto}</p>

          {/* Las 3 sustituciones. Mismas dos pasadas que la banda de KPIs:
              primero fuera las líneas («al cliente no le gusta tanta línea»),
              después el suelo que se fue con ellas («ahora parece que están
              flotando»).

              Aquí el suelo es VIDRIO, no un gris: debajo hay una foto, y una
              superficie opaca la taparía justo en el tercio donde todavía se
              ve mar. Navy translúcido + `backdrop-blur` es el mismo recurso
              que la píldora del nav —relleno oscuro, canto blanco más opaco
              que el relleno, que es como se comporta el canto de un vidrio
              real— y aquí hace un trabajo extra: los 3 textos dejan de
              depender del trozo de foto que les toque detrás.

              UNA superficie para los tres, no tres. Tres paneles serían las
              «puras cajas» de siempre, y además volverían a dibujar las
              divisiones que se acaban de quitar. */}
          <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 rounded-card bg-navy/45 p-6 ring-1 ring-inset ring-white/12 backdrop-blur-sm sm:grid-cols-3">
            {CERO_PLASTICO.puntos.map((punto) => (
              <div key={punto.titulo}>
                <dt className="font-display text-sm font-semibold text-aqua-claro">{punto.titulo}</dt>
                <dd className="mt-1 text-sm text-white/80">{punto.texto}</dd>
              </div>
            ))}
          </dl>

          <Link
            to={CERO_PLASTICO.ctaHref}
            className="group mt-8 inline-flex items-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark"
          >
            {CERO_PLASTICO.cta}
            <ArrowRight
              className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* EL BARCO, NO UN SELLO (Samuel, 2026-07-28: «el icono a la derecha
            queda raro, no se ve integrado; usa algo que se vea mucho más
            integrado, tal vez una imagen PNG que tenga que ver»).

            Aquí vivía el sello eco de la home — un dibujo vectorial dentro de
            un disco de menta. El problema no era el dibujo: era que un disco
            plano encima de una foto SIEMPRE va a leerse como una pegatina, por
            bien dibujado que esté. No hay sombra ni tamaño que arregle eso.

            Lo que sí se integra es un objeto que PERTENEZCA a la escena. El
            fondo es una cenital de agua turquesa, así que se pone encima lo
            único que puede estar ahí de verdad: uno de nuestros barcos. Es el
            recorte real con fondo transparente que ya usa el proyecto (zarpa
            del CTA del hero de la home y navega el recorrido de Sostenibilidad)
            — activo existente, cero peso nuevo, y coherente con el mensaje:
            el banner habla de lo que NO sube a estos barcos.

            ⚠️ 2ª VUELTA — DÓNDE VA (Samuel: «el barco está decente, pero que
            no esté flotando; que esté un poco tapado y sobresaliente por la
            esquina inferior derecha, que no se vea montado ahí»).

            Como columna de la rejilla, el barco quedaba ENTERO y centrado en
            su celda: una silueta completa, con aire por los cuatro lados, o
            sea exactamente el mismo problema del sello — un objeto recortado
            y pegado encima. Un objeto se lee dentro de una escena cuando la
            escena lo TAPA: si el borde del banner le corta un trozo, el ojo
            entiende que el barco está detrás del marco y no encima.

            Por eso deja de ser una celda y pasa a capa absoluta anclada a la
            esquina inferior derecha, con `-right`/`-bottom` negativos para que
            el `overflow-hidden` de la sección se le coma proa y casco. El
            recorte lo hace además la CURVA de --radius-card-grande, que es
            justo lo que evita que parezca cortado a cuchillo.

            El hueco que deja libre lo reserva el `lg:pr-*` del contenedor de
            texto (arriba), no un `gap`: una capa absoluta no empuja a nadie.

            En móvil no se pinta: a esa anchura competiría con el titular por
            el poco sitio que hay, y el mensaje ya está escrito. */}
        <img
          src="/fotos/catamaran-recorte.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute -bottom-10 -right-8 hidden w-64 drop-shadow-2xl lg:block xl:-bottom-12 xl:-right-10 xl:w-80"
        />
      </div>
    </section>
  )
}
