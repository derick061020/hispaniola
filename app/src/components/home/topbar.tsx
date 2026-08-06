import { useLocation } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_URL } from '@/data/tours'
import { CONTACTO } from '@/data/home'
import { SelectorIdioma } from '@/components/ui/selector-idioma'

// Topbar (2026-07-17, pedido de Samuel): banda delgada de contacto/idioma
// que la web actual lleva ARRIBA del header (nº de WhatsApp, teléfono toll
// free, selector ES/EN) — retirada en v3 cuando el Header se mudó DENTRO del
// hero (ver el comentario que reemplaza, header.tsx) y quedó como backlog
// (botones flotantes). Vuelve, pero no como esos botones flotantes: vive
// FUERA de la caja del hero, con fondo blanco sólido — por eso es shell
// aparte (App.tsx, mismo patrón que NavFlotante) y no una fila del propio
// Header, que hoy solo existe en su variante `sobreVideo` (transparente
// sobre el video) y necesita justo lo contrario. Delgada y en texto apagado
// a propósito: es utilidad, no protagonismo — el Header sigue siendo la
// jerarquía principal.
//
// Teléfonos desde CONTACTO (data/home.ts), no repetidos a mano — misma
// fuente que usa la página /contacto.
//
// Selector de idioma: puramente visual por ahora (el sitio no tiene i18n
// real todavía — ES+EN sigue en Pendientes de app/PLAN-LANZAMIENTO.md).
export function Topbar() {
  const { pathname } = useLocation()
  // Sin topbar: /fundaciones (validación de tokens, "no es contenido del sitio"
  // — sin Header ni Footer tampoco), el funnel /reservar/:slug (un checkout
  // enfocado, con su propio header MÍNIMO — reservar.tsx — que no ofrece salidas:
  // nada de contacto/idioma compitiendo con el flujo de compra), y la pantalla
  // post-checkout (/gracias) + la gestión de reserva (/mi-reserva) (2026-07-17,
  // pedido de Samuel: "quita el header fijo de estas secciones, no quiero
  // distracciones de contacto/idioma cuando el cliente está confirmando o
  // editando su reserva"). El header local con Logo de cada página sigue
  // siendo el ancla de marca.
  if (
    pathname === '/fundaciones' ||
    pathname.startsWith('/book') ||
    pathname === '/my-booking'
  )
    return null

  const whatsapp = CONTACTO.cards.find((c) => c.id === 'whatsapp')
  const telefono = CONTACTO.cards.find((c) => c.id === 'telefono')

  return (
    <div className="hidden bg-papel sm:block">
      <div className="mx-auto flex max-w-contenido items-center justify-between px-5 py-1.5 text-xs text-navy-soft sm:px-10">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-navy">
          <MessageCircle className="size-3.5" aria-hidden="true" />
          Questions? WhatsApp {whatsapp?.dato}
        </a>

        <div className="flex items-center gap-4">
          <a href={telefono?.href} className="flex items-center gap-1.5 hover:text-navy">
            <Phone className="size-3.5" aria-hidden="true" />
            Bookings: {telefono?.dato}
          </a>

          <SelectorIdioma />
        </div>
      </div>
    </div>
  )
}
