import { ChefHat, Leaf, Sprout, Users, type LucideIcon } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'

// «La diferencia Hispaniola» — rediseño editorial (Pedro, 2026-07-16).
// Antes: 2 columnas con foto a la izquierda y grid 2x2 de texto plano a
// la derecha — los 4 diferenciadores más fuertes de la marca (TOP 3
// restauración coral, cocina flotante, 35% aforo, cero plástico) estaban
// enterrados en bullets sin jerarquía. Sosa y simple.
//
// Ahora: spread editorial asimétrico. La foto de coral ocupa el ~40%
// izquierdo y se estira para acompañar la altura de las 4 verdades
// (items-stretch + h-full en el img). A la derecha, las 4 verdades
// apiladas con:
//   - Un número ENORME (01-04) en text-navy/8 de fondo que crea ritmo
//     vertical — es la "marca tipográfica" de la sección, el detalle
//     que la hace memorable
//   - Un icono lucide (Sprout / ChefHat / Users / Leaf) en aqua al lado
//     del título, pequeño pero presente
//   - El título bold navy
//   - La descripción corta en navy-sub
// El hover de grupo en cada <li> sube la opacidad del número de fondo y
// escala el icono 1.1× — feedback sutil que recompensa la exploración
// sin ser ruidoso.
//
// bg-papel-hueso en la sección para diferenciarla de WhyDirect (blanca
// arriba) y del océano oscuro de IncluyeCrucero (abajo) — la sección
// respira entre las dos con su propio tono.
//
// Los datos (4 verdades con icono) son LOCALES a este componente — son
// contenido de sección específico, no reutilizable. En el traspaso a
// Figma, cada "verdad" se convierte en una instancia de un componente
// `Diferenciador/Item` con la prop Icon como slot.

type Verdad = {
  numero: string
  titulo: string
  texto: string
  Icon: LucideIcon
}

const VERDADES: Verdad[] = [
  {
    numero: '01',
    titulo: 'Coral vivo, no piscina de show',
    texto:
      'Snorkel en uno de los 3 mayores proyectos de restauración de coral de RD, con bióloga marina a bordo.',
    Icon: Sprout,
  },
  {
    numero: '02',
    titulo: 'Cocina flotante',
    texto:
      'Comida preparada al momento en el barco — pescado del Caribe y Angus certificado.',
    Icon: ChefHat,
  },
  {
    numero: '03',
    titulo: 'Barcos a media capacidad',
    texto:
      'Reservamos máximo el 35% del aforo permitido. Espacio, no multitud.',
    Icon: Users,
  },
  {
    numero: '04',
    titulo: 'Eco / cero plástico',
    texto:
      'Coco-loco en coco real. Nada de vasos desechables.',
    Icon: Leaf,
  },
]

export function Diferenciadores() {
  return (
    <section className="bg-papel-hueso px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto grid max-w-contenido grid-cols-1 items-stretch gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* IZQUIERDA — foto alta de coral. items-stretch + h-full hace que
            la foto se estire a la altura de las 4 verdades de la derecha,
            creando un bloque editorial unificado en vez de una foto
            pequeña al lado de texto. */}
        <div className="relative overflow-hidden rounded-card shadow-card">
          <img
            src="/fotos/galeria-snorkel-lovers-6.webp"
            alt="Snorkel sobre un arrecife de coral vivo, rodeado de peces"
            className="h-72 w-full object-cover sm:h-96 lg:h-full"
            loading="lazy"
          />
        </div>

        {/* DERECHA — header + 4 verdades numeradas */}
        <div>
          <div className="mb-12 lg:mb-16">
            <Etiqueta>La diferencia Hispaniola</Etiqueta>
            <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
              No es otro party boat
            </h2>
          </div>

          <ol className="space-y-10">
            {VERDADES.map((v) => (
              <li key={v.numero} className="group relative pl-2">
                {/* Número enorme de fondo — la "marca tipográfica" de la
                    sección. font-serif (stack del sistema) para look
                    editorial. pointer-events-none + select-none +
                    aria-hidden: decorativo, no interactúa, no se
                    selecciona. En hover de grupo sube de /8 a /15 — el
                    detalle "vivo" sin ser ruidoso. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-6 select-none font-serif text-[8rem] leading-none text-navy/8 transition-colors duration-300 group-hover:text-navy/15 lg:-left-3 lg:-top-8 lg:text-[9rem]"
                >
                  {v.numero}
                </span>

                {/* Contenido (relative para ir por encima del número) */}
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <v.Icon
                      className="size-6 shrink-0 text-aqua transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-lg font-semibold text-navy">
                      {v.titulo}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-navy-sub">
                    {v.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
