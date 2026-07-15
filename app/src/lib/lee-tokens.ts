// Lee tokens del @theme (tokens.css) desde JS — para los hooks de reveal
// (GSAP), que toman sus constantes de los tokens con getComputedStyle en vez
// de números "a ojo" en el JS (playbook animaciones-a-figma: los tokens son
// la FUENTE del prototipo de Figma). Extraído de use-experiencia-scroll.ts
// cuando use-why-direct-scroll.ts necesitó exactamente los mismos helpers.

/** Lee un token de longitud (rem/px) y lo devuelve en px — GSAP no convierte rem. */
export function tokenAPx(cs: CSSStyleDeclaration, nombre: string, rootPx: number, fallback: number): number {
  const raw = cs.getPropertyValue(nombre).trim()
  if (!raw) return fallback
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return fallback
  return raw.endsWith('rem') ? n * rootPx : n
}

/** Lee un token adimensional (staggers en s, escalas). */
export function tokenNum(cs: CSSStyleDeclaration, nombre: string, fallback: number): number {
  const n = parseFloat(cs.getPropertyValue(nombre))
  return Number.isFinite(n) ? n : fallback
}
