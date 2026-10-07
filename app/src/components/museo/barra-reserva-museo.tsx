import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { APERTURA_MUSEO, MUSEO, PRECIO_MUSEO, RUTA_CORAL_QUEST } from '@/data/museo'
import { dosCifras, useCuentaAtras } from './use-cuenta-atras'

// BARRA DE RESERVA FIJA — [2026-10-07, Marketing tras ver la preview: «agregar
// un botón u opción de compra de forma más visible y comercial; que la opción
// de compra sea clara y fácil de identificar»].
//
// Una píldora de vidrio abajo, centrada, que acompaña el descenso: cuenta
// atrás compacta + «desde US$ 99» + el botón coral. Es lo único fijo que se
// añade, y por eso se CALLA donde estorbaría o sobraría:
//   · en el héroe (ya tiene su botón y su contador grandes),
//   · en la sección Book (ahí está la reserva entera),
//   · y en el footer.
// Así cumple lo de Marketing —«sin sobrecargar la página»—: aparece cuando
// el visitante está leyendo y no tiene un botón de compra a la vista.
//
// ⚠️ Por ella se calla en esta ruta el aviso del Party Boat
// (ui/aviso-party-boat.tsx), igual que en /tours-and-events: dos barras
// fijas abajo se pisarían, y en esta página la que vende es esta.

export function BarraReservaMuseo() {
  const b = MUSEO.barra
  const cuenta = useCuentaAtras(APERTURA_MUSEO)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const vigilados = ['#hero', '#book', '.museo-pie']
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => !!el)
    const enVista = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => enVista.set(e.target, e.isIntersecting))
        setVisible(![...enVista.values()].some(Boolean))
      },
      { threshold: 0.05 },
    )
    vigilados.forEach((el) => {
      enVista.set(el, true)
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="museo-barra" data-visible={visible ? '' : undefined} aria-hidden={!visible}>
      {cuenta.terminada ? null : (
        <p className="museo-barra-cuenta">
          <span aria-hidden="true" className="museo-pulso" />
          <span className="hidden sm:inline">{b.abre}</span>
          <span className="font-semibold text-museo-texto tabular-nums">
            {cuenta.dias}
            {b.d} {dosCifras(cuenta.horas)}
            {b.h} <span className="hidden sm:inline">{dosCifras(cuenta.minutos)}{b.m}</span>
          </span>
        </p>
      )}
      <p className="museo-barra-precio hidden md:block">
        {b.desde} <strong className="font-semibold text-museo-texto">{formatoDinero(PRECIO_MUSEO.light)}</strong>
      </p>
      <Link to={RUTA_CORAL_QUEST} className="museo-boton-coral group" tabIndex={visible ? 0 : -1}>
        {b.cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
