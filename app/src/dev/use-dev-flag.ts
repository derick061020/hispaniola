// [DEV-ONLY] Consume un query param `dev-*` del Glosario Dev: aplica el valor
// al estado local del componente y limpia el param de la URL, de modo que el
// mismo enlace del glosario funcione las veces que haga falta.
// Portado de Synexia (playbook dev-mode-glosario-prototipo).
// ⚠️ Nada de `src/dev/` (ni sus llamadas marcadas [dev-mode]) va a Figma.
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useDevFlag(key: string, onValue: (value: string) => void) {
  const [searchParams, setSearchParams] = useSearchParams()

  // `onValue` se pasa inline en cada call site (identidad nueva en cada
  // render) — se guarda en un ref para que NO dispare el efecto de nuevo.
  const onValueRef = useRef(onValue)
  onValueRef.current = onValue

  useEffect(() => {
    const value = searchParams.get(key)
    if (value === null) return
    onValueRef.current(value)
    const next = new URLSearchParams(searchParams)
    next.delete(key)
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, key, setSearchParams])
}
