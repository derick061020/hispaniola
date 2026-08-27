import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Reserva } from '@/lib/reservas'
import {
  eventoDeReserva,
  urlDescargaICS,
  urlGoogleCalendar,
  urlOutlook,
} from '@/lib/calendario'

// «Añadir al calendario» — un botón con las cuatro salidas dentro (2026-08-27,
// pedido de Samuel: «que sea lo más general posible»).
//
// Vive en `ui/` y no dentro de una pantalla porque son DOS los sitios que lo
// pintan —la de gracias y «Mi reserva»— y las dos tienen que ofrecer el mismo
// evento. Antes eran dos <a> sueltos al .ics de Odoo; la copia se mantuvo
// sincronizada de milagro.
//
// Por qué un desplegable y no un botón por calendario: son cinco enlaces para
// un gesto que la mayoría hace una vez, y en la pantalla de gracias comparten
// fila con «Guardar WhatsApp». Cinco botones ahí dentro convierten el remate de
// la reserva en una barra de herramientas.
//
// Mismo mecanismo de cierre que PasajerosPopover y CalendarioWidget (clic fuera
// + Escape) y no un Dialog de AlignUI: no bloquea la página ni atrapa el foco,
// es un desplegable.

/** Apple y «otro» descargan EL MISMO archivo. No es un descuido: quien busca
 *  dónde pulsar busca el nombre de su aplicación, no una extensión — y quien
 *  usa Thunderbird o el calendario de su móvil necesita que alguien le diga
 *  que ese .ics también es para él. */
type Salida = {
  id: string
  etiqueta: string
  /** Nombre del fichero. Solo lo llevan las salidas que descargan. */
  descarga?: string
}

export function BotonCalendario({ reserva, className = '' }: { reserva: Reserva; className?: string }) {
  const [abierto, setAbierto] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    function onClickFuera(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setAbierto(false)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickFuera)
      document.removeEventListener('keydown', onEscape)
    }
  }, [abierto])

  // El evento se arma una vez y lo comparten las cinco salidas: es la garantía
  // de que el .ics y Google no puedan decir horas distintas.
  const evento = eventoDeReserva(reserva)
  const ics = urlDescargaICS(evento, reserva.codigo)
  const fichero = `${reserva.codigo}.ics`

  const SALIDAS: Array<Salida & { href: string }> = [
    { id: 'google', etiqueta: 'Google Calendar', href: urlGoogleCalendar(evento) },
    { id: 'apple', etiqueta: 'Apple Calendar', href: ics, descarga: fichero },
    { id: 'outlook', etiqueta: 'Outlook.com', href: urlOutlook(evento, 'live') },
    { id: 'office', etiqueta: 'Office 365', href: urlOutlook(evento, 'office') },
    { id: 'ics', etiqueta: t('Other calendar (.ics)'), href: ics, descarga: fichero },
  ]

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className="inline-flex items-center gap-2 rounded-btn border border-linea bg-papel px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-papel-hueso"
      >
        <Calendar className="size-4" aria-hidden="true" />
        {t('Add to calendar')}
        <ChevronDown
          className={`size-4 transition-transform ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {abierto && (
        // `left-1/2 -translate-x-1/2`: en la pantalla de gracias el botón está
        // centrado y el panel se saldría por un lado si colgara de un borde.
        <div
          role="menu"
          className="absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-card border border-linea bg-papel py-1 text-left shadow-lg"
        >
          {SALIDAS.map((s) => (
            <a
              key={s.id}
              role="menuitem"
              href={s.href}
              // Las que descargan NO llevan target: abrir una pestaña para un
              // fichero que se guarda deja una ventana en blanco detrás.
              {...(s.descarga
                ? { download: s.descarga }
                : { target: '_blank', rel: 'noopener' })}
              onClick={() => setAbierto(false)}
              className="block px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso"
            >
              {s.etiqueta}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
