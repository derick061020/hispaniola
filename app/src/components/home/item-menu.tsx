import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CircleHelp,
  Compass,
  Fish,
  MessageCircle,
  Newspaper,
  Leaf,
  Ship,
  Sprout,
  TicketCheck,
  User,
  Users,
} from 'lucide-react'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import type { ItemNav } from '@/data/home'

const ICONOS: Record<string, ComponentType<{ className?: string }>> = {
  tripulacion: Users,
  arrecife: Fish,
  // 2026-07-20 (correcciones v1 del cliente) — entrada nueva para el ítem
  // "Blog" de NAV_NOSOTROS (data/home.ts). Faltaba: se agregó el ítem sin
  // su ícono, exactamente el escenario que el comentario de abajo advertía
  // — pantalla en blanco al abrir el dropdown, detectado hoy con Playwright.
  blog: Newspaper,
  faq: CircleHelp,
  reserva: TicketCheck,
  guias: Compass,
  contacto: MessageCircle,
  // 2026-07-17 — entrada nueva para /mi-reserva (subtab de "Ayuda" +
  // link en el footer). User (singular, no Users) para señalar que es
  // "TU" reserva, personal. Si ICONOS no tiene el id del item,
  // `Icono` queda undefined y `<Icono />` revienta React → pantalla
  // en blanco al abrir el dropdown.
  'mi-reserva': User,
  // [v2 2026-07-27] Los 4 destinos nuevos del menú v2. Y sí: al añadirlos al
  // nav se me olvidó añadirlos AQUÍ, y los dropdowns de «Nosotros» y
  // «Sostenibilidad» reventaron en blanco — exactamente el escenario que
  // advertía el comentario de arriba, por tercera vez en este archivo.
  // Por eso ahora hay un fallback (ver ICONO_FALLBACK): que falte un icono
  // debe degradar, no tumbar el menú.
  instalaciones: Building2,
  flota: Ship,
  sostenibilidad: Leaf,
  fundacion: Sprout,
}

// [v2 2026-07-27] Red de seguridad. Este archivo ya ha tumbado el menú DOS
// veces por la misma causa (el ítem «Blog» en las correcciones v1, y los 4
// destinos del menú v2 hoy): se añade una entrada a NAV_* y se olvida el
// icono, `Icono` queda undefined y React revienta al abrir el dropdown.
//
// Un comentario de aviso no bastó — la solución es que el fallo sea
// imposible. Con esto, un id sin icono se pinta con la brújula genérica y el
// menú sigue funcionando; el que falte se nota en pantalla, no en un crash.
const ICONO_FALLBACK = Compass

// Ítem del notch dinámico (PLAN-v3.md §12.1) — icono + título + descripción,
// para los dropdowns "simples" (Nosotros/Ayuda): antes eran solo una lista de
// links, y el panel (240/224px) no mandaba sobre la fila de tabs (457px) —
// la caja del notch se quedaba en el ancho de los tabs y el panel flotaba
// centrado con aire muerto a los lados (§12.0).
//
// El chip es un CUADRADO gris (decisión de Samuel, 2026-07-14) — no el
// círculo aqua de WhyDirect. El hover se INVIERTE (chip gris → blanco, fila
// blanca → gris) a propósito: si el chip se quedara gris dentro del hover
// (también gris), los dos se fundirían en una sola mancha y el chip
// "desaparecería" bajo el ratón.
//
// v3-F13 (PLAN-v3.md §15.4): entre md y lg el panel va en su variante
// compacta (448px, sin sitio para 2 columnas con descripción — cada celda
// daría ~160px, 6 líneas de texto). La descripción se oculta ahí (`hidden
// lg:block`), quedando chip + título — misma decisión que ya tomó Samuel
// para el móvil, aplicada a la franja donde el ancho tampoco da.
export function ItemMenu({ item }: { item: ItemNav }) {
  const Icono = ICONOS[item.id] ?? ICONO_FALLBACK
  const clases = 'group flex gap-3 rounded-lg p-3 transition-colors hover:bg-papel-hueso'
  const contenido = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-btn bg-papel-hueso text-navy-soft transition-colors group-hover:bg-papel group-hover:text-aqua-dark">
        <Icono className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold text-navy">{item.nombre}</span>
        <span className="mt-0.5 hidden text-xs text-navy-soft lg:block">{item.descripcion}</span>
      </span>
    </>
  )

  // Con `to` es página real (Link SPA — hoy solo "El arrecife…" → /sostenibilidad);
  // sin él sigue siendo placeholder del prototipo. Misma unión por dato que las
  // ocasiones del megamenú.
  //
  // data-mega-item (2026-07-22, pedido de Samuel: "que los elementos de
  // dentro del megamenú también aparezcan con animación, con interpolación
  // cada uno"): marcador SIN estilo — TabsConPaneles (nav-tabs.tsx) lo
  // busca con querySelectorAll al abrir el panel y anima cada uno con un
  // stagger corto. No pasa por props (ItemMenu no sabe ni le importa que lo
  // estén animando desde afuera) — mismo trato que MegaTours/MegaEventos.
  if (item.to) {
    return (
      <Link to={item.to} className={clases} data-mega-item>
        {contenido}
      </Link>
    )
  }
  return (
    <EnlacePrototipo className={clases} data-mega-item>
      {contenido}
    </EnlacePrototipo>
  )
}
