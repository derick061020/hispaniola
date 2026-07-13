// [DEV-ONLY] Dev Mode — botón flotante + glosario del prototipo.
// Lista todos los bloques y estados registrados en `dev-registry.ts`, con
// deep-links que activan cada estado vía query params `dev-*`.
// Portado de Synexia (playbook dev-mode-glosario-prototipo), simplificado:
// sin AlignUI/remixicon (este proyecto no usa esa librería) y sin roles
// (la home es un solo producto).
// ⚠️ Nada de `src/dev/` se traslada a Figma.
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Code2, Search, X } from 'lucide-react'
import { devSections, devStats, type DevScreen } from './dev-registry'

const statusStyle: Record<DevScreen['status'], { label: string; className: string }> = {
  done: { label: 'Diseñado', className: 'bg-menta text-menta-texto' },
  wip: { label: 'En curso', className: 'bg-[#FDF0E7] text-[#B4571F]' },
  placeholder: { label: 'Placeholder', className: 'bg-papel-hueso text-navy-soft' },
}

function matchesScreen(screen: DevScreen, q: string) {
  return (
    screen.title.toLowerCase().includes(q) ||
    screen.route.toLowerCase().includes(q) ||
    (screen.description ?? '').toLowerCase().includes(q) ||
    screen.states.some((s) => s.label.toLowerCase().includes(q))
  )
}

export function DevMode() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const go = (to: string) => {
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return devSections
    return devSections
      .map((sec) => ({ ...sec, screens: sec.screens.filter((s) => matchesScreen(s, q)) }))
      .filter((sec) => sec.screens.length > 0)
  }, [query])

  const stats = devStats()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Glosario Dev (Ctrl/⌘ + .)"
        className="fixed bottom-5 right-5 z-[95] flex h-10 items-center gap-2 rounded-full bg-navy pl-3.5 pr-4 text-sm font-medium text-white shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-aqua opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-aqua" />
        </span>
        <Code2 className="size-4" />
        Dev
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-navy/60 p-4 pt-12 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-papel shadow-xl ring-1 ring-linea"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start gap-3 border-b border-linea px-6 py-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-papel-hueso text-aqua">
                <Code2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-navy">Glosario Dev</h2>
                  <span className="rounded-full bg-papel-hueso px-2 py-0.5 text-[11px] text-navy-soft">
                    solo dev · no va a Figma
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-navy-soft">
                  Todos los bloques y estados registrados, con enlaces directos para navegar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-navy-soft transition-colors hover:bg-papel-hueso hover:text-navy"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex flex-wrap items-center gap-3 border-b border-linea px-6 py-3">
              <div className="flex h-9 min-w-56 flex-1 items-center gap-2 rounded-lg bg-papel-hueso px-3">
                <Search className="size-4 shrink-0 text-navy-soft" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filtrar bloques, estados, rutas…"
                  className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-navy-soft"
                />
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <span className="rounded-full bg-menta px-2.5 py-1 text-xs font-medium text-menta-texto">
                  {stats.done} diseñados
                </span>
                <span className="rounded-full bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-soft">
                  {stats.placeholder} placeholder
                </span>
                <span className="rounded-full bg-aqua-tint px-2.5 py-1 text-xs font-medium text-aqua-dark">
                  {stats.states} estados
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {sections.length === 0 ? (
                <p className="py-10 text-center text-sm text-navy-soft">
                  Nada coincide con «{query}».
                </p>
              ) : (
                sections.map((section) => (
                  <section key={section.title} className="py-3 first:pt-0">
                    <h3 className="pb-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {section.screens.map((screen) => (
                        <ScreenRow key={`${section.title}-${screen.title}`} screen={screen} onGo={go} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-linea px-6 py-3">
              <div className="flex items-center gap-2 text-xs text-navy-soft">
                <kbd className="rounded border border-linea-fuerte bg-papel-hueso px-1.5 py-0.5 font-mono">⌘ .</kbd>
                abrir/cerrar
                <kbd className="rounded border border-linea-fuerte bg-papel-hueso px-1.5 py-0.5 font-mono">esc</kbd>
                cerrar
              </div>
              <span className="font-mono text-[11px] text-navy-soft">registro: src/dev/dev-registry.ts</span>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  )
}

function ScreenRow({ screen, onGo }: { screen: DevScreen; onGo: (to: string) => void }) {
  const badge = statusStyle[screen.status]
  return (
    <div className="flex h-full flex-col rounded-xl p-3.5 ring-1 ring-inset ring-linea transition-colors hover:bg-papel-hueso/60">
      <div className="flex items-start gap-2">
        <button type="button" onClick={() => onGo(screen.route)} className="group min-w-0 flex-1 text-left">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-navy group-hover:text-aqua-dark">{screen.title}</span>
            <ArrowUpRight className="size-4 shrink-0 text-navy-soft opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="block truncate font-mono text-[11px] text-aqua-dark">{screen.route}</span>
        </button>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {screen.description ? <p className="mt-1.5 text-xs text-navy-soft">{screen.description}</p> : null}

      {screen.states.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {screen.states.map((state) => (
            <button
              key={state.to + state.label}
              type="button"
              onClick={() => onGo(state.to)}
              title={state.note ?? state.to}
              className="inline-flex h-6 items-center gap-1.5 rounded-full bg-papel-hueso px-2.5 text-[11px] text-navy-soft ring-1 ring-inset ring-linea transition-colors hover:bg-aqua-tint hover:text-aqua-dark hover:ring-aqua/40"
            >
              <span className="font-mono text-[10px] font-semibold text-aqua-dark">{state.kind}</span>
              {state.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
