import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { obtenerHoteles } from '@/lib/api/api'
import type { Hotel } from '@/lib/api/tipos'
import { HOTELES } from '@/lib/api/hoteles'
import { t } from '@/lib/i18n'

// [2026-08-25, pedido de Samuel] SELECTOR DE HOTEL DEL FUNNEL.
//
// Hasta hoy «Where do we pick you up?» era un campo de texto libre. El problema
// no era la UI: cada nombre escrito a mano («melia caribe», «Melia caribbe»)
// llegaba a Odoo sin casar con ninguna ficha de `haa.hotel`, y sin ficha no hay
// tabla de recogidas — la hora había que buscarla persona a persona.
//
// Los hoteles son LOS DE ODOO y solo los de Odoo (`GET /hotels`). Dar de alta
// uno en el back-office lo hace aparecer aquí sin desplegar nada;
// `data/hoteles.ts` es la instantánea que se pinta mientras llega la respuesta
// y la red si Odoo no contesta — mismo criterio que el precio del checkout.
//
// Por qué combobox y no un `<select>` pelado: son ~270 hoteles. Un desplegable
// nativo con 270 opciones se recorre a ciegas; aquí se escriben tres letras.
// Y se conserva la salida de emergencia («My hotel isn’t on the list»), que es
// texto libre: la lista no cubre cada villa de Bávaro y perder la recogida por
// no estar en el catálogo sería peor que un nombre sin ficha.

/** Una sola carga por sesión: el paso de recogida se monta y se desmonta cada
 *  vez que el visitante navega entre pasos del funnel. */
let cache: Hotel[] | null = null
let enVuelo: Promise<Hotel[]> | null = null

function useHoteles(): Hotel[] {
  const [hoteles, setHoteles] = useState<Hotel[]>(() => cache ?? HOTELES)

  useEffect(() => {
    if (cache) return
    let vivo = true
    enVuelo ??= obtenerHoteles()
      .then((lista) => {
        // Una respuesta vacía es una base a medio sembrar, no una lista de
        // cero hoteles: en ese caso manda la instantánea.
        cache = lista.length ? lista : HOTELES
        return cache
      })
      .catch(() => HOTELES)
      .finally(() => {
        enVuelo = null
      })
    void enVuelo.then((lista) => {
      if (vivo) setHoteles(lista)
    })
    return () => {
      vivo = false
    }
  }, [])

  return hoteles
}

/** Sin tildes y en minúsculas: quien escribe «bavaro» tiene que encontrar
 *  «Bávaro», y quien escribe «melia», «Meliá». */
function plano(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const OTRO = '__otro__'

// Orden de las zonas en el desplegable: primero donde se aloja casi todo el
// mundo. Una zona que Odoo traiga y no este aqui cae al final, no se pierde.
const ZONAS = ['Bavaro', 'Punta Cana', 'Cap Cana', 'Uvero Alto', 'Bayahibe', 'Macao']

export function SelectorHotel({
  etiqueta,
  value,
  onChange,
}: {
  etiqueta: string
  /** Nombre del hotel tal y como viaja a Odoo. Vacío = sin elegir. */
  value: string
  onChange: (hotel: string) => void
}) {
  const hoteles = useHoteles()
  const id = useId()
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  // «Otro» es pegajoso a propósito: si se activa y luego se borra el texto, el
  // campo libre tiene que seguir ahí en vez de saltar de vuelta a la lista.
  const [otro, setOtro] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)

  const enLista = useMemo(
    () => hoteles.some((h) => plano(h.name) === plano(value)),
    [hoteles, value],
  )

  // Una reserva reanudada puede traer un hotel escrito a mano antes de que
  // existiera este selector: se abre en modo libre para no borrárselo.
  useEffect(() => {
    if (value && !enLista) setOtro(true)
  }, [value, enLista])

  useEffect(() => {
    if (!abierto) return
    function fuera(e: MouseEvent) {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  // Sin recortar la lista: son ~270 hoteles y el desplegable ya scrollea. Un
  // «solo los primeros N» miente — quien no ve su hotel asume que no esta.
  const filtrados = useMemo(() => {
    const q = plano(busqueda)
    const lista = q
      ? hoteles.filter((h) => plano(h.name).includes(q) || plano(h.zone).includes(q))
      : hoteles
    const orden = (zona: string) => {
      const i = ZONAS.indexOf(zona)
      return i === -1 ? ZONAS.length : i
    }
    return [...lista].sort(
      (a, b) => orden(a.zone) - orden(b.zone) || plano(a.name).localeCompare(plano(b.name)),
    )
  }, [hoteles, busqueda])

  // Agrupar por zona ayuda a quien no recuerda el nombre exacto pero sí sabe
  // que su hotel está en Bayahíbe. Se respeta el orden de aparición.
  const porZona = useMemo(() => {
    const grupos = new Map<string, Hotel[]>()
    for (const h of filtrados) {
      const zona = h.zone || 'Bavaro'
      const previos = grupos.get(zona)
      if (previos) previos.push(h)
      else grupos.set(zona, [h])
    }
    return [...grupos.entries()]
  }, [filtrados])

  function elige(nombre: string) {
    if (nombre === OTRO) {
      setOtro(true)
      onChange('')
    } else {
      setOtro(false)
      onChange(nombre)
    }
    setAbierto(false)
    setBusqueda('')
  }

  if (otro) {
    return (
      <div>
        <label htmlFor={id} className="text-sm font-medium text-navy">
          {etiqueta}
        </label>
        <input
          id={id}
          autoFocus
          className="mt-1.5 w-full rounded-btn bg-papel px-4 py-3 text-sm text-navy ring-1 ring-linea placeholder:text-navy-soft focus:outline-none focus:ring-2 focus:ring-aqua"
          placeholder={t('Hotel, villa or address where we pick you up')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="mt-1.5 text-xs font-medium text-aqua-dark underline underline-offset-2"
          onClick={() => {
            setOtro(false)
            onChange('')
          }}
        >
          {t('Choose from the list instead')}
        </button>
      </div>
    )
  }

  return (
    <div ref={contenedor} className="relative">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {etiqueta}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
        className="mt-1.5 flex w-full items-center justify-between gap-2 rounded-btn bg-papel px-4 py-3 text-left text-sm ring-1 ring-linea focus:outline-none focus:ring-2 focus:ring-aqua"
      >
        <span className={value ? 'truncate text-navy' : 'truncate text-navy-soft'}>
          {value || t('Select your hotel')}
        </span>
        <ChevronDown className="size-4 shrink-0 text-navy-soft" aria-hidden="true" />
      </button>

      {abierto ? (
        <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-btn border border-linea bg-papel shadow-lg">
          <div className="flex items-center gap-2 border-b border-linea px-3 py-2">
            <Search className="size-4 shrink-0 text-navy-soft" aria-hidden="true" />
            <input
              autoFocus
              className="w-full bg-transparent py-1 text-sm text-navy placeholder:text-navy-soft focus:outline-none"
              placeholder={t('Search your hotel…')}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {porZona.map(([zona, lista]) => (
              <li key={zona}>
                <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">
                  {zona}
                </p>
                <ul>
                  {lista.map((h) => (
                    <li key={h.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={h.name === value}
                        onClick={() => elige(h.name)}
                        className="flex w-full items-start gap-2 px-4 py-2 text-left text-sm text-navy hover:bg-aqua-tint"
                      >
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${h.name === value ? 'text-aqua-dark' : 'text-transparent'}`}
                          aria-hidden="true"
                        />
                        <span>{h.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            {filtrados.length === 0 ? (
              <li className="px-4 py-3 text-sm text-navy-sub">{t('No hotel matches that search.')}</li>
            ) : null}
          </ul>

          <button
            type="button"
            onClick={() => elige(OTRO)}
            className="w-full border-t border-linea px-4 py-3 text-left text-sm font-medium text-aqua-dark hover:bg-aqua-tint"
          >
            {t('My hotel isn’t on the list')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
