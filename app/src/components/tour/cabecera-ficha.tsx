import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import * as StatusBadge from '@/components/alignui/status-badge'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Estrellas } from '@/components/ui/estrellas'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Above the fold de la ficha (wireframe A1): rating con nº de reseñas,
// cancelación gratis, audiencia y duración como chips junto al H1 — el patrón
// Civitatis/Viator. La prueba social y la tranquilidad ANTES de que el visitante
// tenga que scrollear ni una vez.
//
// Etapa A (PLAN-ALIGNUI.md): los chips son StatusBadge del sistema. La antigua
// distinción tono ok/neutro se traduce a su lenguaje: la cancelación es un
// ESTADO positivo (completed + light = el par menta de siempre, via el slot
// success), los metadatos (audiencia, duración, recogida) van en stroke.

type Props = { tour: Tour; ficha: FichaTour }

export function CabeceraFicha({ tour, ficha }: Props) {
  return (
    <div className="mx-auto max-w-contenido px-5 pt-6 sm:px-10">
      {/* Migaja. "Tours" es el listado, que vive solo en el prototipo (depende
          del motor de reservas, igual que el funnel) — de ahí EnlacePrototipo. */}
      <nav aria-label="Migaja de pan" className="text-xs text-navy-soft">
        <Link to="/" className="hover:text-navy">
          Inicio
        </Link>
        <span className="px-1.5 text-linea-fuerte">/</span>
        <EnlacePrototipo className="hover:text-navy">Tours</EnlacePrototipo>
        <span className="px-1.5 text-linea-fuerte">/</span>
        <span className="text-navy-sub">{tour.nombre}</span>
      </nav>

      {/* --text-h2 (32px), no un tamaño nuevo: en Figma es el mismo text style
          que el título de sección. El H1 de la ficha manda por jerarquía
          (es el <h1> de la página), no por tamaño — el hero de la home es el
          único sitio con --text-hero. */}
      <h1 className="mt-3 max-w-4xl text-balance font-display text-h2 font-semibold text-navy">
        {ficha.tituloLargo}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2">
          <Estrellas calificacion={tour.rating} />
          <span className="text-sm text-navy-sub">
            <strong className="font-semibold text-navy">{tour.rating}</strong> ·{' '}
            {tour.resenas.toLocaleString('en-US')} reseñas
          </span>
        </span>

        {/* Los chips siguen a renderFicha() del prototipo, no al wireframe: la
            cancelación gratis no se promete en 'consulta' (Isla Saona no tiene
            ni precio confirmado), y la recogida en hotel solo se anuncia en los
            tours de horario fijo. El chip "WiFi a bordo" del wireframe no está:
            el WiFi se cuenta en la sección Incluye de la home, no aquí. */}
        {tour.booking !== 'consulta' ? (
          <StatusBadge.Root status="completed" variant="light">
            <StatusBadge.Icon as={Check} />
            Cancelación gratis
          </StatusBadge.Root>
        ) : null}
        <StatusBadge.Root status="disabled" variant="stroke">
          {tour.audienciaChip}
        </StatusBadge.Root>
        <StatusBadge.Root status="disabled" variant="stroke">
          {ficha.duracion}
        </StatusBadge.Root>
        {tour.booking === 'completo' ? (
          <StatusBadge.Root status="completed" variant="stroke">
            <StatusBadge.Dot />
            Recogida en hotel
          </StatusBadge.Root>
        ) : null}
      </div>
    </div>
  )
}
