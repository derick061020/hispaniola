import { useEffect, useRef, useState } from 'react'

// El número de un stepper «− N +», ESCRIBIBLE a mano (Samuel, 2026-08-07:
// «por si alguien hace click y quiere escribir directamente la cantidad, no
// tenga que pulsar el botón un montón de veces»).
//
// El caso real que lo pide es el charter: Forever Teresa admite 85 personas y
// llegar ahí a base de «+» son 83 clics. Lo mismo en el modal de Snorkel
// Lovers (adultos / niños / bebés) y en la calculadora de eventos, donde los
// grupos grandes son la norma, no la excepción.
//
// POR QUÉ NO ES UN `type="number"`:
//  · Pinta SUS PROPIAS flechas de spinner, justo al lado de los botones −/+
//    que ya tenemos: dos controles para lo mismo, pegados, uno de ellos
//    diminuto. En Firefox además ocupan sitio permanentemente.
//  · La rueda del ratón lo cambia al pasar por encima haciendo scroll — en un
//    widget de reserva eso es cambiar el precio sin querer.
//  · Su `value` admite «e», «+», «-» y separadores según el idioma del
//    navegador, así que igualmente hay que sanear.
// Con `text` + `inputMode="numeric"` sale el teclado numérico en móvil, se
// filtra la entrada a dígitos y las flechas ↑/↓ se reponen a mano abajo (que
// es lo único del spinner nativo que valía la pena).
//
// SIN CAJA EN REPOSO: se lee como el texto que sustituye. La invitación a
// escribir aparece al pasar el ratón (fondo tenue) y al enfocar (anillo). Los
// dos usan --color-navy, que .widget-premium redefine, así que el campo sale
// bien también sobre la piel oscura del widget — un `aqua-tint` fijo habría
// puesto una losa clara sobre el negro.
export function NumeroEditable({
  valor,
  min,
  max,
  onCambio,
  etiqueta,
  className = '',
}: {
  valor: number
  min: number
  max: number
  onCambio: (n: number) => void
  /** Nombre accesible del campo, ej. «Number of guests». */
  etiqueta: string
  /** Tipografía del sitio donde vive (tamaño, peso, color, ancho mínimo). */
  className?: string
}) {
  // Mientras se escribe manda el BORRADOR, no `valor`: sin él, vaciar el campo
  // para teclear «85» lo dejaría en el mínimo tras borrar el primer dígito y
  // habría que escribir contra un número que se mueve solo.
  const [borrador, setBorrador] = useState<string | null>(null)
  const mostrado = borrador ?? String(valor)
  const inputRef = useRef<HTMLInputElement>(null)

  function confirmar(bruto: string) {
    setBorrador(null)
    const n = Number.parseInt(bruto, 10)
    // Vacío o basura: no es un 0 ni un mínimo, es «no ha dicho nada» — se
    // queda el valor que había.
    if (Number.isNaN(n)) return
    const limitado = Math.min(max, Math.max(min, n))
    if (limitado !== valor) onCambio(limitado)
  }

  // Última cantidad que ESTE campo ha pedido. Las flechas ↑/↓ se disparan en
  // ráfaga cuando se dejan pulsadas, y varias pueden caer en el mismo render:
  // todas leerían el mismo `valor` de props y repetirían el mismo salto, así
  // que mantener la tecla pulsada perdería pasos. Un ref se actualiza en el
  // acto, sin esperar al re-render.
  const pedido = useRef(valor)
  useEffect(() => {
    pedido.current = valor
  }, [valor])

  function empujar(paso: number) {
    const escrito = borrador !== null ? Number.parseInt(borrador, 10) : Number.NaN
    const base = Number.isNaN(escrito) ? pedido.current : escrito
    setBorrador(null)
    const limitado = Math.min(max, Math.max(min, base + paso))
    pedido.current = limitado
    if (limitado !== valor) onCambio(limitado)
  }

  // El PULSO al cambiar el valor (.stepper-tick) se conserva, pero solo cuando
  // el cambio viene de fuera del campo — con el foco dentro sería el propio
  // texto escalando bajo el cursor mientras se teclea.
  //
  // Se reinicia quitando y reponiendo la clase con un reflow en medio, en vez
  // de remontar el nodo con `key` como hacían los <span> que este componente
  // sustituye: remontar un input enfocado le quita el foco al vuelo.
  const previo = useRef(valor)
  useEffect(() => {
    if (previo.current === valor) return
    previo.current = valor
    const el = inputRef.current
    if (!el || document.activeElement === el) return
    el.classList.remove('stepper-tick')
    void el.offsetWidth
    el.classList.add('stepper-tick')
  }, [valor])

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={etiqueta}
      value={mostrado}
      // El ancho sigue a los dígitos (`ch` = ancho de un dígito con
      // tabular-nums) para que en «2 guests» no quede un hueco delante de la
      // palabra. Suma el px-1 de abajo, que es el aire que necesita el realce
      // para no tocar la palabra siguiente. Un `min-w-*` que llegue por
      // className gana a este ancho, que es justo lo que quieren las filas del
      // modal de pasajeros.
      style={{ width: `calc(${Math.max(mostrado.length, 1)}ch + 0.5rem)` }}
      onFocus={(e) => e.currentTarget.select()}
      // 4 dígitos de tope: ningún aforo del catálogo se acerca, y evita que un
      // teclado pegado convierta el campo en una tira.
      onChange={(e) => setBorrador(e.currentTarget.value.replace(/\D/g, '').slice(0, 4))}
      onBlur={(e) => confirmar(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          confirmar(e.currentTarget.value)
          e.currentTarget.blur()
        } else if (e.key === 'Escape') {
          setBorrador(null)
          e.currentTarget.blur()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          empujar(1)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          empujar(-1)
        }
      }}
      className={`numero-editable cursor-text rounded-numero bg-transparent px-1 text-center outline-none transition-colors hover:bg-navy/10 focus:bg-navy/10 focus:ring-2 focus:ring-navy/45 ${className}`}
    />
  )
}
