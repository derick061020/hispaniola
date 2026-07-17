import { Anchor, ChefHat, Fish, Waves } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { NOSOTROS, TRIPULACION, FLOTA } from '@/data/nosotros'

// Sin fotos de personas reales (el cliente no ha dado nombres ni fotos del
// equipo — inventarlas violaría "contenido jamás inventado"): cada rol es un
// chip de icono, mismo lenguaje que ItemMenu del header. El orden sigue
// TRIPULACION del prototipo. Párrafo de equipo añadido 2026-07-17 (rediseño
// de Samuel), condensado de about-hispaniola.php?lang=es.
//
// FLOTA: 2026-07-17 (misma sesión, 2ª vuelta — Samuel: "mete toda la flota
// de barcos") pasa de 3 cards genéricas (Catamarán A/B + cocina flotante) a
// los 6 catamaranes reales con nombre propio de la web actual. La cocina
// flotante se retira de este bloque: tiene su propia sección más arriba
// (CocinaFlotante), ver data/nosotros.ts para el detalle de fuentes.
//
// 3ª vuelta (mismo día, Samuel: "no me gusta que los barcos se vean en
// cards, haz que cada barco sea una sección con el texto de un lado y el
// barco del otro, y vaya alternando el orden a medida que bajamos"): cada
// barco es su propia fila foto+texto (mismo anatómico que IntroNosotros),
// alternando lado según el índice sea par o impar. En móvil la foto
// SIEMPRE va primero (una sola columna, alternar no tendría sentido ahí) —
// el alternado es solo `lg:order-*`.
//
// 4ª vuelta (mismo día, Samuel: "que estas secciones de barcos tengan el
// efecto de gsap de que vamos bajando con scroll y se van stackeando"):
// envolvía cada fila en .flota-barco-envoltorio con la card pegada arriba
// (position: sticky) y GSAP (use-flota-scroll.ts) animaba el achicado/
// oscurecido de la que se iba tapando.
//
// 5ª vuelta (mismo día, Samuel: "quita los efectos de gsap de los barcos
// y haz que sean una sección estática normal, sin esos cards con sombra o
// borders"): se retira el stacking — ni pin de CSS, ni hook de GSAP, ni
// wrapper alto. Cada barco vuelve a ser una fila plana en flujo normal,
// sin fondo ni sombra ni radio (la foto es la única que conserva su
// --radius-card-grande propio). El flag ?dev-flota=estatico se va con
// el hook — ya no hay nada que apagar.
const ICONOS: Record<string, typeof Anchor> = {
  Capitán: Anchor,
  'Bióloga marina': Fish,
  'Chef a bordo': ChefHat,
  'Guía de snorkel': Waves,
}

export function TripulacionFlota() {
  return (
    <>
      <section>
        <Etiqueta>{NOSOTROS.tripulacionTitulo}</Etiqueta>
        <p className="mt-3 max-w-2xl text-lead text-navy-sub">{NOSOTROS.tripulacionTexto}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRIPULACION.map((m) => {
            const Icono = ICONOS[m.rol] ?? Anchor
            return (
              <div key={m.rol} className="flex flex-col items-center gap-3 rounded-card bg-papel-hueso p-5 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-papel text-aqua-dark ring-1 ring-linea">
                  <Icono className="size-6" strokeWidth={2} />
                </span>
                <span className="font-display text-sm font-semibold text-navy">{m.rol}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <Etiqueta>{NOSOTROS.flotaTitulo}</Etiqueta>
        <p className="mt-3 max-w-2xl text-lead text-navy-sub">{NOSOTROS.flotaTexto}</p>

        <div className="mt-10 flex flex-col gap-12">
          {FLOTA.map((b, i) => {
            const invertido = i % 2 === 1
            return (
              <div key={b.nombre} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className={`overflow-hidden rounded-card-grande ${invertido ? 'lg:order-2' : 'lg:order-1'}`}>
                  <img
                    src={`/fotos/${b.foto}.webp`}
                    alt={b.fotoAlt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className={invertido ? 'lg:order-1' : 'lg:order-2'}>
                  <h3 className="font-display text-h3 font-semibold text-navy">{b.nombre}</h3>
                  <p className="mt-3 text-lead text-navy-sub">{b.meta}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
