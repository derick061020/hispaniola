import { Music, Utensils, Camera, Wifi, Bus, Users, Waves, Package, Wine, Heart, MapPin, Briefcase, Receipt, CloudRain, Phone } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento, BeneficioEvento } from '@/data/eventos'

// "Qué incluye" de las landings de eventos (PLAN-EVENTOS.md) — grid de
// items icono + texto, mismo lenguaje que `IncluyeTour` de la ficha de
// tour (mismo `BLOQUE_FICHA`, mismo `TituloSeccion`). Reemplaza al
// `incluye-evento.tsx` anterior (que era la versión "persuasión", sin
// tokens, sin icono).
//
// Mapeo de icono por PALABRA CLAVE en el título — la lista es corta y
// estable. Si un título no matchea, cae en `Package` (genérico).
function iconoPorTitulo(titulo: string) {
  const t = titulo.toLowerCase()
  if (t.includes('snorkel')) return Waves
  if (t.includes('comida') || t.includes('menú')) return Utensils
  if (t.includes('bebida') || t.includes('barra')) return Wine
  if (t.includes('música') || t.includes('sonido')) return Music
  if (t.includes('foto')) return Camera
  if (t.includes('wifi')) return Wifi
  if (t.includes('transporte') || t.includes('traslado') || t.includes('logística') || t.includes('hoteles')) return Bus
  if (t.includes('guía') || t.includes('coordinador') || t.includes('tripulación')) return Users
  if (t.includes('playa')) return MapPin
  if (t.includes('capacidad') || t.includes('flota') || t.includes('multi-barco')) return Briefcase
  if (t.includes('clima') || t.includes('cancelación') || t.includes('plan b')) return CloudRain
  if (t.includes('facturación') || t.includes('factura') || t.includes('pago')) return Receipt
  if (t.includes('coordinadora') || t.includes('wedding planner') || t.includes('dedicad')) return Heart
  if (t.includes('whatsapp') || t.includes('contacto') || t.includes('idioma')) return Phone
  return Package
}

function Item({ b }: { b: BeneficioEvento }) {
  const Icono = iconoPorTitulo(b.titulo)
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
