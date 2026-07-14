import { PREMIOS } from '@/data/home'

// Banda de premios — v3-F11 (PLAN-v3.md §14): esta sección ERA "cinta de
// stats + premios" (stats.tsx). Las 4 cifras subieron al hero (viven junto al
// CTA que deben empujar); esta sección se queda SOLA con los 7 premios reales
// de la web actual (data/home.ts), que por eso crecen (--spacing-premio-alto).
//
// v3-F13 (PLAN-v3.md §15.12): el eyebrow "Reconocido por" se retira (decisión
// de Samuel al ver la banda apretada contra el ticker) — 7 badges de premios
// en fila ya dicen lo que son, y el texto costaba 30px del presupuesto
// vertical que hacía falta para separarlos del ticker.
export function Premios() {
  return (
    // pt-premios-aire, no un pt- suelto: el ticker cuelga media card DENTRO de
    // este padding (es `absolute`, no empuja), así que el padding tiene que
    // absorber ese vuelo antes de dar aire — ver el token en tokens.css.
    <section className="border-b border-linea bg-papel px-5 pb-seccion-sm pt-premios-aire sm:px-10">
      {/* v3-F13: max-w-contenido (antes max-w-6xl, no 5xl — con los logos a
          64px de alto las 7 juntas necesitan ~1046px + gaps, y a 1024px/5xl
          envolvían a 2 filas incluso en 1920px). */}
      <ul className="mx-auto flex max-w-contenido flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
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
