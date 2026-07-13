// Home — se construye por fases (ver app/PLAN.md). F0: solo fundaciones;
// el shell (header/footer) llega en F2, el hero en F3, etc.
export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-papel-hueso px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Hispaniola — F0</p>
      <h1 className="font-display text-h2 font-semibold text-navy">Scaffold listo</h1>
      <p className="max-w-md text-navy-sub">
        La home se construye por fases. Ver <code className="text-sm">/fundaciones</code> para los
        tokens, o <code className="text-sm">app/PLAN.md</code> para el plan completo.
      </p>
    </main>
  )
}
