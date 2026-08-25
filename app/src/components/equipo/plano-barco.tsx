import { iconoDepartamento, TODOS, type Filtro } from '@/components/equipo/grid-equipo'
import { Etiqueta } from '@/components/ui/etiqueta'
import { DEPARTAMENTOS, contarPorDepartamento, type DepartamentoId } from '@/data/equipo'

// EL BARCO COMO ÍNDICE — variante ARRIESGADA de /tripulacion, para comparar
// ([v2 2026-07-28, Samuel: «me gusta tu idea del barco como índice, crea un
// duplicado de la página y hazla a ver qué tal se ve»).
//
// LA IDEA: el equipo no se filtra por chips, se filtra por DÓNDE ESTÁ la
// gente. Pinchas la cubierta y salen los 21 de operaciones playa; pinchas la
// cocina y salen los 12 de cocina. Es la historia real de la empresa —tienen
// barcos y tienen un complejo en tierra— contada como plano en vez de como
// lista de categorías.
//
// ⚠️ DÓNDE COJEABA, Y POR QUÉ YA CASI NO: cuando esto se escribió, de los 6
// departamentos solo 2 vivían a bordo (cubierta y cocina) y los otros 4
// —oficina, marketing, administración y la fundación— trabajaban en tierra.
// Eran 4 de 6 fuera del barco, mucho para una metáfora que se llama «el barco
// como índice».
//
// [2026-08-21] La proporción se da la vuelta sola. Los departamentos pasan a
// ser las seis subcarpetas de retratos del cliente, y eso parte el antiguo
// «Marine Operations» en los tres oficios que de verdad van a bordo:
// capitanes, guías y marinos. Con la cocina son 4 de 6 EN el barco y solo 2 en
// tierra (oficina y fundación). La línea de flotación se queda igual: sigue
// habiendo dos zonas declaradas y sigue sin colocarse en cubierta a nadie que
// no navegue.
//
// Si gana, el trabajo pendiente es de ilustración: hoy el barco es el recorte
// real que ya había en el repo (catamaran-recorte.webp) y la tierra es una
// columna de puntos. Con una ilustración propia —el complejo dibujado como el
// barco— las dos mitades pesarían igual y la cojera se iría.

/** Qué departamentos viven a bordo y dónde cae su punto SOBRE la foto del
 *  barco (% del ancho/alto de la caja del recorte). Los porcentajes están
 *  medidos contra catamaran-recorte.webp: el trampolín de proa cae abajo a la
 *  izquierda y la bañera/cabina a la derecha del mástil. */
// La separación VERTICAL entre los dos es lo que hay que respetar si se
// mueven: los rótulos miden ~180×48px y a poco que se acerquen se pisan (pasó
// en la 1ª versión, con 82% y 76%).
// Los cuatro puntos van de popa a proa, que es como se lee un barco: el puente
// arriba a la derecha, la cubierta en medio, la cocina flotante al costado y el
// trampolín de proa abajo a la izquierda. La separación VERTICAL entre puntos
// consecutivos no baja de 20 puntos por lo dicho arriba.
const A_BORDO: { id: DepartamentoId; x: string; y: string; zona: string }[] = [
  { id: 'capitanes', x: '66%', y: '30%', zona: 'Helm' },
  { id: 'guias', x: '34%', y: '52%', zona: 'Deck' },
  { id: 'cocina', x: '54%', y: '72%', zona: 'Floating kitchen' },
  { id: 'marinos', x: '16%', y: '93%', zona: 'Bow' },
]

const EN_TIERRA: { id: DepartamentoId; zona: string }[] = [
  { id: 'oficina', zona: 'Offices' },
  { id: 'fundacion', zona: 'Marine lab' },
]

function Punto({
  id,
  zona,
  activo,
  onClick,
  className = '',
  style,
}: {
  id: DepartamentoId
  zona: string
  activo: boolean
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}) {
  const depto = DEPARTAMENTOS.find((d) => d.id === id)
  if (!depto) return null
  const Icono = iconoDepartamento(id)
  const n = contarPorDepartamento(id)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      style={style}
      // El punto es un botón con etiqueta al lado, no un pin con tooltip: un
      // plano donde hay que pasar el ratón por 6 puntos para saber qué son es
      // un juego de adivinanzas. Con los rótulos siempre puestos se lee como
      // un diagrama, que es lo que es.
      className={`group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-left transition ${
        activo ? 'bg-navy text-white' : 'bg-papel text-navy shadow-sm hover:bg-aqua-tint'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`grid size-9 shrink-0 place-items-center rounded-full transition ${
          activo ? 'bg-white/15 text-white' : 'bg-aqua-tint text-aqua-dark'
        }`}
      >
        <Icono className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{depto.nombre}</span>
        <span className={`block text-xs ${activo ? 'text-white/70' : 'text-navy-soft'}`}>
          {zona} · {n}
        </span>
      </span>
    </button>
  )
}

export function PlanoBarco({
  filtro,
  onFiltro,
}: {
  filtro: Filtro
  onFiltro: (f: Filtro) => void
}) {
  // Pinchar el punto ya activo vuelve a «todo el equipo». Sin esa vuelta, el
  // plano es una trampa: entras a un departamento y no hay manera obvia de
  // salir (no hay chips que lo digan).
  const alternar = (id: DepartamentoId) => onFiltro(filtro === id ? TODOS : id)

  return (
    <section className="relative overflow-hidden rounded-card-grande bg-linear-to-b from-papel-hueso to-aqua-tint px-6 py-10 sm:px-10 sm:py-12">
      <div className="text-center">
        <Etiqueta>The team, by where they are based</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
          Some sail, others keep the ship afloat
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-navy-sub">
          Tap an area to see its people. Tap it again to see them all.
        </p>
      </div>

      {/* justify-center + un ancho tope para el barco: la 1ª versión dejaba
          que la columna del barco se comiera todo el espacio sobrante y el
          catamarán salía a 600px con el mástil entero, así que los dos puntos
          de a bordo quedaban amontonados abajo y arriba había medio panel
          vacío. Con el barco acotado, las dos zonas pesan parecido. */}
      <div className="mt-10 flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-center lg:gap-14">
        {/* EN TIERRA — columna de puntos. No hay ilustración del complejo
            todavía (ver la cabecera), así que en vez de inventarse un dibujo
            se declara como lo que es: la lista de los que no están a bordo. */}
        {/* Alineada ABAJO (lg:items-end del padre) y no centrada: el barco es
            una figura alta y estrecha, y centrar la columna contra él dejaba
            medio panel vacío arriba. Pegadas al mismo canto inferior, las dos
            zonas comparten «línea de flotación» y el bloque se lee como un
            plano en vez de como dos cosas sueltas. */}
        <div className="flex w-full max-w-xs flex-col gap-3 lg:pb-6">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">
            En tierra
          </p>
          {EN_TIERRA.map((p) => (
            <Punto
              key={p.id}
              id={p.id}
              zona={p.zona}
              activo={filtro === p.id}
              onClick={() => alternar(p.id)}
            />
          ))}
        </div>

        {/* A BORDO — el recorte real del catamarán con sus dos puntos encima.
            La línea de flotación es el degradado de la sección, no una raya:
            el cliente ya pidió menos rayas (slide 8) y aquí el cambio de color
            del panel hace el mismo trabajo. */}
        <div className="relative w-full max-w-sm">
          <p className="mb-2 text-center text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">
            A bordo
          </p>
          <div className="relative">
            <img
              src="/fotos/catamaran-recorte.webp"
              alt="One of the Hispaniola catamarans, seen from the side"
              className="w-full"
              loading="lazy"
            />
            {A_BORDO.map((p) => (
              <Punto
                key={p.id}
                id={p.id}
                zona={p.zona}
                activo={filtro === p.id}
                onClick={() => alternar(p.id)}
                // -translate-y-1/2 y no un top calculado: el punto se centra
                // en su coordenada, así que mover el % mueve el CENTRO del
                // rótulo y no su esquina.
                className="absolute -translate-y-1/2 whitespace-nowrap"
                style={{ left: p.x, top: p.y }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
