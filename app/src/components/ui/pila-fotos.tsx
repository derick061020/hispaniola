// Photo-stack — el efecto que Samuel señaló de la ref. Vacationeeze: fotos con
// passe-partout blanco + sombra, ligeramente rotadas y solapadas, como copias
// en papel sobre una mesa. Componente de `ui/` (no de `home/`) porque es
// reutilizable: se usa en la galería y puede ir en cualquier otro bloque.
//
// Las rotaciones son deliberadamente IRREGULARES: si todas fueran del mismo
// ángulo el conjunto se lee como un error de alineación, no como un gesto.

export type FotoPila = { foto: string; alt: string }

/** Grados de rotación por posición. Se repite cíclicamente si hay más fotos. */
const ROTACIONES = [-5, 3, -2, 4]

export function PilaFotos({
  fotos,
  className = '',
}: {
  fotos: FotoPila[]
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {fotos.map((f, i) => (
        <figure
          key={f.foto}
          // El look y el hover viven en `.pila-foto` (src/styles/componentes.css),
          // no en utilidades — ahí está explicado por qué. Aquí solo se inyectan
          // los datos que cambian de una foto a otra.
          style={{
            ['--rot' as string]: `${ROTACIONES[i % ROTACIONES.length]}deg`,
            ['--z' as string]: i,
            marginLeft: i === 0 ? 0 : '-1.5rem',
          }}
          className="pila-foto"
        >
          <img
            src={`/fotos/${f.foto}.webp`}
            alt={f.alt}
            className="size-full rounded-foto object-cover"
            style={{ width: 'clamp(7rem, 22vw, 12rem)', height: 'clamp(9rem, 26vw, 14rem)' }}
          />
        </figure>
      ))}
    </div>
  )
}
