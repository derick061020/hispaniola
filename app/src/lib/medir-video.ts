// Cuánta gente ve los vídeos de la web.
//
// [2026-11-04, Sr. Fernando, grupo MARKETING WEB: «¿se puede contabilizar
// cuánta gente ve el vídeo desde que lo subamos?»] Cada paso se manda a Odoo
// (Finanzas → Vídeos de la web, solo dirección) y, a la vez, a Google
// Analytics por el dataLayer (eventos `video_visto`, `video_abierto`,
// `video_progreso`).
//
// Se cuenta PERSONA, no reproducción: un identificador anónimo por navegador
// (sin nombre, correo ni nada que identifique) y una sola vez por vídeo y paso
// en cada visita. `sendBeacon` en texto plano: no espera respuesta, no frena la
// página y no dispara la petición previa de CORS.

export type PasoVideo = 'visto' | 'abierto' | 'p25' | 'p50' | 'p75' | 'p100'

const BASE = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8069').replace(/\/+$/, '')
const CLAVE = 'haa-visitante-video'
const yaEnviados = new Set<string>()

function visitante(): string {
  try {
    let v = localStorage.getItem(CLAVE)
    if (!v) {
      v = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/[^A-Za-z0-9-]/g, '')
      localStorage.setItem(CLAVE, v)
    }
    return v
  } catch {
    return 'anonimo-sin-storage'
  }
}

export function medirVideo(video: string, paso: PasoVideo) {
  if (!video || typeof window === 'undefined') return
  const k = video + '|' + paso
  if (yaEnviados.has(k)) return
  yaEnviados.add(k)
  const datos = { video, page: location.pathname, visitor: visitante(), event: paso }
  try {
    const cuerpo = new Blob([JSON.stringify(datos)], { type: 'text/plain' })
    if (!navigator.sendBeacon?.(BASE + '/api/web/v1/video-events', cuerpo)) {
      fetch(BASE + '/api/web/v1/video-events', { method: 'POST', body: JSON.stringify(datos), keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
    }
  } catch { /* medir nunca rompe la página */ }
  try {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer
    dl?.push({
      event: paso === 'visto' ? 'video_visto' : paso === 'abierto' ? 'video_abierto' : 'video_progreso',
      video_src: video,
      video_progreso: paso.startsWith('p') ? Number(paso.slice(1)) : undefined,
    })
  } catch { /* nada */ }
}

/** Hasta dónde se ha visto: marca 25/50/75/100 % al pasar por cada punto. */
export function medirProgreso(video: string, el: HTMLVideoElement) {
  if (!el.duration || !isFinite(el.duration)) return
  const pct = (el.currentTime / el.duration) * 100
  if (pct >= 25) medirVideo(video, 'p25')
  if (pct >= 50) medirVideo(video, 'p50')
  if (pct >= 75) medirVideo(video, 'p75')
  if (pct >= 97) medirVideo(video, 'p100')
}

/** «Lo vio en la galería»: el elemento estuvo ≥ 50 % a la vista durante 1 s. */
export function observarVisto(el: Element | null, video: string) {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {}
  let t: number | undefined
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) t = window.setTimeout(() => { medirVideo(video, 'visto'); io.disconnect() }, 1000)
    else window.clearTimeout(t)
  }, { threshold: 0.5 })
  io.observe(el)
  return () => { window.clearTimeout(t); io.disconnect() }
}
