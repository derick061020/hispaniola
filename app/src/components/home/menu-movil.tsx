import { useState } from 'react'
import { X } from 'lucide-react'
import { TOURS, OCASIONES, bookingCta, formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Boton } from '@/components/ui/boton'

type Seccion = 'tours' | 'eventos' | 'nosotros' | 'ayuda'

const secciones: { id: Seccion; label: string }[] = [
  { id: 'tours', label: 'Tours' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'ayuda', label: 'Ayuda' },
]

export function MenuMovil({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const [expandida, setExpandida] = useState<Seccion | null>('tours')

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-papel md:hidden">
      <div className="flex items-center justify-between border-b border-linea px-5 py-4">
        <strong className="font-display text-lg text-navy">Menú</strong>
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="grid size-9 place-items-center rounded-lg text-navy hover:bg-papel-hueso">
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-2">
        {secciones.map((s) => (
          <div key={s.id} className="border-b border-linea py-1">
            <button
              type="button"
              onClick={() => setExpandida((e) => (e === s.id ? null : s.id))}
              className="flex w-full items-center justify-between py-3 text-left font-display text-base font-semibold text-navy"
            >
              {s.label}
              <span className={`text-navy-soft transition-transform ${expandida === s.id ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {expandida === s.id ? (
              <div className="pb-3">
                {s.id === 'tours' ? (
                  <div className="flex flex-col gap-2">
                    {TOURS.map((t) => (
                      <EnlacePrototipo key={t.slug} className="flex items-center justify-between rounded-lg bg-papel-hueso px-3 py-2.5">
                        <span className="text-sm font-medium text-navy">{t.nombre}</span>
                        <span className="text-xs font-semibold text-menta-texto">
                          {t.precioLight !== null ? `Desde ${formatoDinero(t.precioLight)}` : bookingCta[t.booking]}
                        </span>
                      </EnlacePrototipo>
                    ))}
                  </div>
                ) : null}
                {s.id === 'eventos' ? (
                  <div className="flex flex-col gap-1.5">
                    {OCASIONES.map((o) => (
                      <EnlacePrototipo key={o.tipo} className="rounded-lg px-3 py-2 hover:bg-papel-hueso">
                        <span className="text-sm font-medium text-navy">{o.nombre}</span>
                      </EnlacePrototipo>
                    ))}
                  </div>
                ) : null}
                {s.id === 'nosotros' ? (
                  <div className="flex flex-col gap-1.5">
                    <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                      La tripulación y la flota
                    </EnlacePrototipo>
                    <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                      El arrecife que reconstruimos
                    </EnlacePrototipo>
                  </div>
                ) : null}
                {s.id === 'ayuda' ? (
                  <div className="flex flex-col gap-1.5">
                    <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                      Preguntas frecuentes
                    </EnlacePrototipo>
                    <a href="https://wa.me/18293052804" target="_blank" rel="noopener" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                      Contacto y WhatsApp
                    </a>
                    <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                      Gestionar mi reserva
                    </EnlacePrototipo>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
        <EnlacePrototipo className="block py-3 font-display text-base font-semibold text-navy">Guías</EnlacePrototipo>
      </div>

      <div className="border-t border-linea p-4">
        <Boton href="#tours" onClick={onCerrar} className="w-full">
          Reservar ahora
        </Boton>
      </div>
    </div>
  )
}
