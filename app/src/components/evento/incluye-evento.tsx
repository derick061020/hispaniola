import { Music, Utensils, Camera, Wifi, Bus, Users, Waves, Package, Wine, Heart, MapPin, Briefcase, Receipt, CloudRain, Phone } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento, BeneficioEvento } from '@/data/eventos'
import { crudo } from '@/lib/i18n'

// "Qué incluye" de las landings de eventos (PLAN-EVENTOS.md) — grid de
// items icono + texto, mismo lenguaje que `IncluyeTour` de la ficha de
// tour (mismo `BLOQUE_FICHA`, mismo `TituloSeccion`). Reemplaza al
// `incluye-evento.tsx` anterior (que era la versión "persuasión", sin
// tokens, sin icono).
//
// Mapeo de icono por PALABRA CLAVE en el título — la lista es corta y
// estable. Si un título no matchea, cae en `Package` (genérico).
//
// ── [2026-08-19] DOS ARREGLOS DE UNA VEZ ─────────────────────────────────
// 1. Buscaba en CASTELLANO («comida», «bebida», «música», «transporte») sobre
//    unos datos que se tradujeron al inglés en la v3: casi nada acertaba y
//    medio bloque salía con el icono genérico. Estaba anotado en el README
//    como pendiente. Las palabras pasan al idioma en el que está escrito el
//    dato.
// 2. Lee `crudo(b).titulo`, el título SIN traducir. Es lo mismo que ya se hace
//    con el plato elegido (ver `crudo()` en lib/i18n): mirar el texto de
//    pantalla haría que el icono dependiera del idioma del visitante — el
//    mismo beneficio saldría con copa en inglés y con caja en español.
function iconoPorTitulo(titulo: string) {
  const txt = titulo.toLowerCase()
  if (txt.includes('snorkel')) return Waves
  if (
    txt.includes('food') || txt.includes('menu') || txt.includes('lunch') || txt.includes('kitchen') ||
    txt.includes('skewer') || txt.includes('fish') || txt.includes('lobster') || txt.includes('fries') ||
    txt.includes('croissant') || txt.includes('shrimp') || txt.includes('buffet') || txt.includes('hot dog')
  )
    return Utensils
  if (
    txt.includes('bar') || txt.includes('drink') || txt.includes('open bar') || txt.includes('mamajuana') ||
    txt.includes('champagne') || txt.includes('toast') || txt.includes('fruit')
  )
    return Wine
  if (txt.includes('music') || txt.includes('sound') || txt.includes('aux') || txt.includes('dance') || txt.includes('dj'))
    return Music
  if (txt.includes('photo') || txt.includes('gopro')) return Camera
  if (txt.includes('wifi') || txt.includes('wi-fi')) return Wifi
  if (txt.includes('transport') || txt.includes('transfer') || txt.includes('logistic') || txt.includes('hotel'))
    return Bus
  if (txt.includes('guide') || txt.includes('coordinator') || txt.includes('crew') || txt.includes('team'))
    return Users
  if (txt.includes('beach') || txt.includes('stop') || txt.includes('route')) return MapPin
  if (txt.includes('check-in') || txt.includes('lobby') || txt.includes('welcome')) return MapPin
  if (txt.includes('capacity') || txt.includes('fleet') || txt.includes('multi-boat') || txt.includes('guests'))
    return Briefcase
  if (txt.includes('weather') || txt.includes('cancellation') || txt.includes('refund') || txt.includes('plan b'))
    return CloudRain
  if (txt.includes('invoic') || txt.includes('payment') || txt.includes('tax')) return Receipt
  if (txt.includes('wedding planner') || txt.includes('dedicated') || txt.includes('ceremony') || txt.includes('bride'))
    return Heart
  if (txt.includes('whatsapp') || txt.includes('contact') || txt.includes('language')) return Phone
  return Package
}

function Item({ b }: { b: BeneficioEvento }) {
  const Icono = iconoPorTitulo(crudo(b).titulo)
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-card bg-aqua-tint text-aqua-dark"
      >
        <Icono className="size-4" />
      </span>
      <div className="pt-0.5">
        <p className="font-display text-sm font-semibold text-navy">{b.titulo}</p>
        {b.texto ? <p className="mt-0.5 text-sm text-navy-sub">{b.texto}</p> : null}
      </div>
    </div>
  )
}

export function IncluyeEvento({ evento }: { evento: FichaEvento }) {
  if (evento.incluye.length === 0) return null

  return (
    <section id="ancla-incluye" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{evento.incluyeTitulo}</TituloSeccion>

      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {evento.incluye.map((b) => (
          <Item key={b.titulo} b={b} />
        ))}
      </div>

      {/* Nota al pie (honesta, como el `noIncluido` de la ficha de tour):
          la web del cliente de bodas decía "Trabajamos con los wedding
          planners de la zona. ¿Ya tenéis uno? Nos coordinamos con él."
          — se OMITE porque bodas ya tiene una FAQ con esa pregunta, y
          poner la misma info en 2 sitios genera redundancia visual. */}
    </section>
  )
}
