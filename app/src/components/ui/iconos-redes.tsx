// Iconos de redes sociales (correcciones v1 del cliente, 2026-07-20 —
// planes/01-home.md slide 18: el footer gana la fila de «Síguenos»).
//
// POR QUÉ SON PROPIOS Y NO DE lucide: la versión de lucide-react que usa el
// proyecto ya NO exporta iconos de marca — `Instagram`, `Facebook`, `Youtube`
// y `Twitter` se retiraron de la librería (el build falla con MISSING_EXPORT
// si se importan). Comprobado: 5.978 exports y ninguno de marca.
//
// Son los glifos estándar de cada red, dibujados con `currentColor` para que
// hereden el color del contenedor (en el footer, blanco sobre el océano). Un
// glifo de red social usado para ENLAZAR al perfil de esa red es uso nominativo
// normal — no hay marca de Hispaniola implicada aquí.
//
// ⚠️ Igual que el resto de logos de terceros del proyecto (premios,
// plataformas de reseñas): si el cliente prefiere los assets oficiales
// descargados de cada marca, se sustituyen. Estos existen para no bloquear el
// footer por un asset que nadie ha pedido todavía.

type Props = { className?: string }

export function IconoInstagram({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function IconoFacebook({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14.5 8.5h2.2V5.6h-2.6c-2.4 0-3.9 1.5-3.9 4v2.1H7.6v3h2.6V21h3.2v-6.3h2.4l.5-3h-2.9v-1.7c0-.9.3-1.5 1.1-1.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconoTikTok({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M15.6 3h-2.7v12.1a2.5 2.5 0 1 1-2-2.45V9.9a5.5 5.5 0 1 0 4.7 5.44V9.16a6.4 6.4 0 0 0 3.6 1.12V7.6a3.7 3.7 0 0 1-3.6-3.6V3z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconoYouTube({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2.2" y="5.5" width="19.6" height="13" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.4 9.4l4.6 2.6-4.6 2.6V9.4z" fill="currentColor" />
    </svg>
  )
}
