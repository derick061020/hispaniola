// [2026-08-31] LA RUEDA DE «ESTOY COBRANDO».
//
// Derick: «cuando le doy a pagar, que haya una animación de carga en lo que se
// procesa el pago». Antes el único aviso era que el texto del botón pasaba a
// «Processing…», y eso en un móvil se lee poco y tarde: confirmar una tarjeta
// con Stripe son dos o tres segundos —a veces con 3-D Secure de por medio—, y
// un botón que no se mueve invita a pulsarlo otra vez.
//
// Va con `currentColor` y `em`: se pinta y se dimensiona con el texto del botón
// que lo lleva, así sirve igual en el CTA coral, en la barra móvil y en el botón
// de pagar el saldo, sin una clase distinta para cada uno.
//
// `aria-hidden`: lo que anuncia el lector de pantalla es el texto de al lado
// («Processing…»), no la ruedita. Y bajo `prefers-reduced-motion` no se para —
// es el ÚNICO indicador de que el cobro sigue vivo—, solo gira más despacio.
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`size-[1.1em] shrink-0 animate-spin motion-reduce:[animation-duration:2s] ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
