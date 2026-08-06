import { Link } from 'react-router-dom'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { CIERRE } from '@/data/por-que-reservar'

// Cierre — slide 56, segunda mitad. «Nos vemos en la playa».
//
// Sustituye a la banda de urgencia que su maqueta ponía en el slide 54: dice
// lo mismo (ve y reserva) en el registro correcto para una página cuyo
// argumento es «no somos los más baratos, somos los que te tratan bien».
//
// La letra pequeña de licencias es contenido nuevo del cliente y se pinta tal
// como lo escribió. ⚠️ Pendiente de que Fernando confirme que se puede
// afirmar «todas las licencias turísticas» — es de las frases que, si no son
// exactas, hacen daño justo donde la página promete confianza.
export function Cierre() {
  return (
    <section className="relative overflow-hidden rounded-card-grande bg-navy">
      <img
        src={`/fotos/${CIERRE.foto}.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Dos capas, como en el hero: tinte parejo + gradiente. El texto va
          centrado sobre la foto y una sola capa lo deja por debajo de la AA
          en las tomas con cielo claro.
          El tinte es --color-overlay-hero (45%) y NO --color-overlay-foto
          (70%): con el 70% MÁS el gradiente encima, la foto desaparecía y el
          bloque se leía como un rectángulo navy liso — se pagaba el coste de
          cargar una foto sin verla. Con el 45% el catamarán se ve y el blanco
          sigue holgado sobre un mar oscuro. */}
      <span aria-hidden="true" className="absolute inset-0 bg-overlay-hero" />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/45 to-navy/35"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-16 text-center sm:py-20">
        <Etiqueta sobreOscuro>{CIERRE.eyebrow}</Etiqueta>
        <h2 className="text-balance font-display text-h2 font-semibold text-white">
          {CIERRE.titulo}
        </h2>
        <p className="text-lead text-white/85">{CIERRE.texto}</p>

        <Boton to="/#tours" tamaño="lg" className="mt-2">
          Reservar mi tour
        </Boton>

        <p className="text-xs text-white/70">{CIERRE.letraPequena}</p>

        {/* El único enlace de la página que NO va a Tours: el argumento
            medioambiental vive entero en /ventaja-competitiva y aquí se enlaza
            en vez de repetirlo. La maqueta del cliente ponía aquí su banda
            verde de «huella positiva», que es literalmente el cierre de esa
            página — duplicar copy entre dos páginas es malo para SEO y peor
            de mantener. */}
        <p className="text-xs text-white/60">
          ¿Te interesa lo que hacemos por el arrecife?{' '}
          <Link to="/competitive-advantage" className="font-semibold text-aqua-claro hover:text-white">
            Nuestra sostenibilidad →
          </Link>
        </p>
      </div>
    </section>
  )
}
