import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DEPARTAMENTOS,
  EQUIPO_COMPLETO,
  TOTAL_EQUIPO,
  EQUIPO_PAGINA,
  type DepartamentoId,
} from '@/data/equipo'

// Grid del equipo con filtros por departamento (correcciones v2, plan 05).
//
// Los filtros reutilizan el lenguaje visual que el proyecto ya fijó en
// `components/faq/categorias-faq.tsx` (chips con contador, «Todos» primero) —
// no se inventa otro. Los CONTADORES SE DERIVAN del array, nunca se escriben a
// mano: el cliente aún no ha confirmado si son 37 o 70 empleados, así que el
// número tiene que seguir al dato y no al revés.
//
// ⚠️ Todo el contenido de personas es PLACEHOLDER — ver la cabecera larga de
// data/equipo.ts para por qué los nombres son genéricos y las frases lorem
// ipsum en vez de los nombres de la maqueta del cliente.

const TODOS = 'todos' as const
type Filtro = DepartamentoId | typeof TODOS

function Iniciales({ nombre }: { nombre: string }) {
  const iniciales = nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
  return (
    <div className="flex h-full w-full items-center justify-center bg-papel-hueso">
      <span className="font-display text-2xl font-semibold text-navy/40">{iniciales}</span>
    </div>
  )
}

export function GridEquipo() {
  const [filtro, setFiltro] = useState<Filtro>(TODOS)

  const visibles =
    filtro === TODOS ? EQUIPO_COMPLETO : EQUIPO_COMPLETO.filter((m) => m.departamento === filtro)

  return (
    <section className="flex flex-col gap-8">
      {/* Aviso de molde. Mientras el contenido sea placeholder tiene que verse
          — es lo que impide que una plantilla inventada se publique por
          descuido. Se retira junto con los datos reales. */}
      <p className="rounded-lg border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-navy">
        <strong>Contenido de ejemplo.</strong> Los nombres, retratos y frases de esta página son
        marcadores de posición hasta que llegue la plantilla real del cliente.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro(TODOS)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            filtro === TODOS
              ? 'border-navy bg-navy text-white'
              : 'border-linea text-navy hover:bg-papel-hueso'
          }`}
        >
          Todos <span className="opacity-60">{TOTAL_EQUIPO}</span>
        </button>
        {DEPARTAMENTOS.map((d) => {
          const n = EQUIPO_COMPLETO.filter((m) => m.departamento === d.id).length
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setFiltro(d.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filtro === d.id
                  ? 'border-navy bg-navy text-white'
                  : 'border-linea text-navy hover:bg-papel-hueso'
              }`}
            >
              {d.nombre} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      {/* Descripción del departamento activo. Este copy SÍ es real: lo escribió
          el cliente en su PowerPoint. */}
      {filtro !== TODOS ? (
        <p className="max-w-2xl text-lg text-navy/70">
          {DEPARTAMENTOS.find((d) => d.id === filtro)?.descripcion}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {visibles.map((m) => (
          <article key={m.id} className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {m.foto ? (
                <img
                  src={`/fotos/${m.foto}.webp`}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Iniciales nombre={m.nombre} />
              )}
              {m.responsable ? (
                <span className="absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Responsable
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-aqua">{m.rol}</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-navy">{m.nombre}</p>
              <p className="mt-1 text-sm text-navy/60">
                {m.experiencia} años de experiencia · desde {m.desde}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-linea px-6 py-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy">
          {EQUIPO_PAGINA.cierreTitulo}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-navy/70">{EQUIPO_PAGINA.cierreTexto}</p>
        <Link
          to="/trabaja-con-nosotros"
          className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {EQUIPO_PAGINA.cierreCta}
        </Link>
      </div>
    </section>
  )
}
