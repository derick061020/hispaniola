import { PREMIOS } from '@/data/home'

// Banda de premios — v3-F11 (PLAN-v3.md §14): esta sección ERA "cinta de
// stats + premios" (stats.tsx). Las 4 cifras subieron al hero (viven junto al
// CTA que deben empujar); esta sección se queda SOLA con los 7 premios reales
// de la web actual (data/home.ts), que por eso crecen (--spacing-premio-alto).
export function Premios() {
  return (
    <section className="border-b border-linea bg-papel px-5 py-seccion-sm sm:px-10">
      <p className="text-center text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
        Reconocido por
      </p>
      {/* max-w-6xl, no 5xl: heredado de cuando esta fila eran las 4 stats
          (que ya se fueron al hero, §14). Con los logos a 64px de alto, las
          7 juntas necesitan ~1046px + gaps — a 1024px (5xl) envolvían a 2
          filas incluso en un viewport de 1920px, comiéndose el presupuesto
          del fold sin que hiciera falta (PLAN-v3.md §14.7). */}
      <ul className="mx-auto mt-7 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
        {PREMIOS.map((premio) => (
          <li key={premio.id}>
            <img
              src={`/premios/${premio.foto}.webp`}
              alt={premio.nombre}
              width={premio.ancho}
              height={premio.alto}
              loading="lazy"
              className="premio-logo"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
