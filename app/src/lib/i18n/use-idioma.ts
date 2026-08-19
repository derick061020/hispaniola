import { useSyncExternalStore } from 'react'
import { escuchaIdioma, idiomaUI } from './nucleo'

/** El idioma actual, ya reactivo. Lo usa el selector para saber qué lado
 *  pintar activo.
 *
 *  Vive en su propio fichero y no junto al proveedor porque mezclarlo con un
 *  componente rompe el Fast Refresh de Vite (un módulo que exporta un
 *  componente Y otra cosa deja de recargarse en caliente). Es la misma regla
 *  que ya avisa oxlint en el resto del proyecto. */
export function useIdiomaUI() {
  return useSyncExternalStore(escuchaIdioma, idiomaUI, () => 'en' as const)
}
