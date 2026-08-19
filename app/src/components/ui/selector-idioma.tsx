import { useState } from 'react'
import { fijaIdiomaUI, t, useIdiomaUI } from '@/lib/i18n'

// Selector de idioma del Topbar (components/home/topbar.tsx) — pedido de
// Samuel: "dale más amor", con banderas circulares y que se lea como un
// toggle switch de verdad, no dos botones de texto sueltos.
//
// 2ª vuelta (Samuel, viéndolo ya en el navegador: "no queda claro cuál está
// activo"): la 1ª versión distinguía el activo solo por bg-papel sobre
// bg-papel-hueso — casi blanco contra casi blanco, y encima ocultaba la
// etiqueta del lado activo, así que había que notar una AUSENCIA, no un
// estado. Ahora las 2 etiquetas quedan SIEMPRE visibles (sin animar
// aparecer/desaparecer) y el activo lleva fondo navy sólido + texto blanco
// — máximo contraste posible con el papel-hueso del track, nada sutil.
//
// 3ª vuelta (Samuel): el fondo navy es un elemento aparte (el "thumb") que
// seduce al hover — pasar el puntero sobre el lado NO activo lo adelanta ahí
// como previsualización; si se hace clic, se QUEDA (pasa a ser el nuevo
// activo); si el puntero se va sin clic, vuelve solo al activo real. Por
// eso hay 2 estados: `activo` (comprometido, sobrevive al mouseleave) y
// `hover` (solo mientras el puntero está encima, null si no). Lo que se
// PINTA (`mostrado`) es hover ?? activo — así el thumb sigue al puntero
// pero, sin puntero encima, cae de vuelta al valor comprometido.
//
// El thumb es un <span> `absolute` aparte (no la clase del botón): así
// puede animar `transform` con transición propia sin competir con el
// `transition-colors` del texto de los botones. Ambos botones viven en un
// grid de 2 columnas IGUALES (a diferencia de un flex por contenido) para
// que el thumb pueda deslizarse con un solo `translateX(100%)` — se mueve
// exactamente el ancho de su propia caja, que por el grid coincide con el
// ancho de columna sin tener que medir nada en JS.
//
// España, no República Dominicana, para el ES (Samuel: "se entiende mejor
// por los turistas" — el público internacional reconoce la rojigualda como
// "español" más rápido que la bandera dominicana, aunque el negocio esté en
// RD).
//
// [2026-08-19] YA NO ES VISUAL. Durante un año este toggle movió un thumb y
// no cambiaba una sola palabra; hoy lee y escribe el idioma de verdad
// (lib/i18n). Lo único que se conserva del estado local es el `hover`, que es
// previsualización y no una elección — de ahí que `activo` desaparezca como
// useState y pase a salir del store.
//
// ── CORRECCIONES v3 (2026-08-06, plan 01 §2) ─────────────────────────────
// El idioma principal del sitio pasa a INGLÉS y el español a secundario, así
// que el toggle se INVIERTE: EN primero (izquierda) y activo por defecto, ES
// segundo. Las banderas siguen la misma regla que antes —la del lado
// izquierdo pega al borde izquierdo y la del derecho al derecho— para que el
// par se lea simétrico, así que también se cruzan.
//
// El sitio en español quedó congelado en el tag `v3-pre-en` para usarlo como
// diccionario, y así se hizo: la mayor parte del español que se ve hoy es el
// copy original del cliente recuperado de ahí, no una traducción inventada.
//
// ⚠️ Los colores de las banderas son EXCEPCIÓN a "todo pasa por tokens"
// (CLAUDE.md): son los colores reales, normados, de cada bandera — no
// paleta de marca, así que no hay token que los represente sin mentir.
// Mismo criterio que ya aplica a fotos/logo del cliente.
type Idioma = 'EN' | 'ES'

function BanderaES({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label={t('Spanish, flag of Spain')}>
      <defs>
        <clipPath id="selector-idioma-circulo-es">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#selector-idioma-circulo-es)">
        <rect width="32" height="32" fill="#AA151B" />
        <rect y="8" width="32" height="16" fill="#F1BF00" />
        {/* insinúa el escudo, sin el detalle (ilegible a este tamaño) */}
        <rect x="7" y="12" width="5" height="8" fill="#AD1519" stroke="#F1BF00" strokeWidth="0.6" />
      </g>
    </svg>
  )
}

function BanderaUS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label={t('English, flag of the United States')}>
      <defs>
        <clipPath id="selector-idioma-circulo-us">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#selector-idioma-circulo-us)">
        <rect width="32" height="32" fill="#B22234" />
        <rect y="4.6" width="32" height="4.6" fill="#fff" />
        <rect y="13.7" width="32" height="4.6" fill="#fff" />
        <rect y="22.9" width="32" height="4.6" fill="#fff" />
        <rect width="17" height="18.3" fill="#3C3B6E" />
        <circle cx="5" cy="4.5" r="1.1" fill="#fff" />
        <circle cx="11" cy="4.5" r="1.1" fill="#fff" />
        <circle cx="8" cy="8" r="1.1" fill="#fff" />
        <circle cx="5" cy="11.5" r="1.1" fill="#fff" />
        <circle cx="11" cy="11.5" r="1.1" fill="#fff" />
        <circle cx="8" cy="15" r="1.1" fill="#fff" />
      </g>
    </svg>
  )
}

export function SelectorIdioma({ className = '' }: { className?: string }) {
  const idioma = useIdiomaUI()
  const activo: Idioma = idioma === 'es' ? 'ES' : 'EN'
  const [hover, setHover] = useState<Idioma | null>(null)
  const mostrado = hover ?? activo

  return (
    <div
      role="group"
      aria-label={t('Language')}
      onMouseLeave={() => setHover(null)}
      className={`relative grid grid-cols-2 rounded-full bg-papel-hueso p-0.5 ring-1 ring-linea ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full bg-navy transition-transform duration-200 ease-out"
        style={{ transform: mostrado === 'ES' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      <button
        type="button"
        onClick={() => fijaIdiomaUI('en')}
        onMouseEnter={() => setHover('EN')}
        aria-pressed={activo === 'EN'}
        title={t('English')}
        className={`relative z-10 flex items-center justify-center gap-1 rounded-full py-0.5 pl-0.5 pr-2 text-[10px] font-semibold transition-colors ${
          mostrado === 'EN' ? 'text-white' : 'text-navy-soft'
        }`}
      >
        <BanderaUS className="size-3.5 shrink-0 rounded-full" />
        EN
      </button>
      <button
        type="button"
        onClick={() => fijaIdiomaUI('es')}
        onMouseEnter={() => setHover('ES')}
        aria-pressed={activo === 'ES'}
        title={t('Español')}
        className={`relative z-10 flex items-center justify-center gap-1 rounded-full py-0.5 pl-2 pr-0.5 text-[10px] font-semibold transition-colors ${
          mostrado === 'ES' ? 'text-white' : 'text-navy-soft'
        }`}
      >
        ES
        <BanderaES className="size-3.5 shrink-0 rounded-full" />
      </button>
    </div>
  )
}
