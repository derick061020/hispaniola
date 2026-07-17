import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import * as Breadcrumb from '@/components/alignui/breadcrumb'
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
//
// PLAN-INTERNAS-V2.md (§C1): deja de ser una sección propia sobre blanco — se
// disuelve en el `children` de HeroInterna, sobre la foto del tour. Pierde su
// contenedor (lo pone el hero) y sus colores pasan a blanco: el H1 y el
// contador de reseñas por clase directa; la migaja AlignUI por el wrapper
// `.migaja-sobre-foto` (componentes.css — re-tema sus slots de color sin
// tocar el vendor). Los StatusBadge NO cambian: sus 3 variantes (stroke,
// completed+light, completed+stroke) ya pintan un fondo OPACO (blanco o
// verde claro — nunca transparente), así que ya leen bien sobre cualquier
// foto, igual que el chip de audiencia de la TourCard.

type Props = { tour: Tour; ficha: FichaTour }

export function CabeceraFicha({ tour, ficha }: Props) {
  return (
    <div>
      {/* Migaja: Breadcrumb del sistema (portado de las docs públicas — el
          plan lo daba por inexistente mirando solo los templates Pro, decisión
          §13.1 reabierta y cerrada). "Tours" es el listado, que vive solo en
          el prototipo (depende del motor de reservas) — de ahí EnlacePrototipo.
          El asChild pone los estilos del Item directamente sobre el Link. */}
      <nav aria-label="Migaja de pan" className="migaja-sobre-foto">
        <Breadcrumb.Root>
          <Breadcrumb.Item asChild>
            <Link to="/">Inicio</Link>
          </Breadcrumb.Item>
          <Breadcrumb.ArrowIcon as={ChevronRight} className="size-4 self-center" />
          <Breadcrumb.Item asChild>
            <EnlacePrototipo>Tours</EnlacePrototipo>
          </Breadcrumb.Item>
          <Breadcrumb.ArrowIcon as={ChevronRight} className="size-4 self-center" />
          <Breadcrumb.Item active>{tour.nombre}</Breadcrumb.Item>
        </Breadcrumb.Root>
      </nav>

      {/* --text-h2 (32px), no un tamaño nuevo: en Figma es el mismo text style
          que el título de sección. El H1 de la ficha manda por jerarquía
          (es el <h1> de la página), no por tamaño — el hero de la home es el
          único sitio con --text-hero. */}
      <h1 className="mt-3 text-balance font-display text-h2 font-semibold text-white">{ficha.tituloLargo}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2">
          <Estrellas calificacion={tour.rating} sobreOscuro />
          <span className="text-sm text-white/80">
            <strong className="font-semibold text-white">{tour.rating}</strong> ·{' '}
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
