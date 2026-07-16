import { Link } from 'react-router-dom'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Estrellas } from '@/components/ui/estrellas'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Above the fold de la ficha (wireframe A1): rating con nº de reseñas,
// cancelación gratis, audiencia y duración como chips junto al H1 — el patrón
// Civitatis/Viator. La prueba social y la tranquilidad ANTES de que el visitante
// tenga que scrollear ni una vez.

type Props = { tour: Tour; ficha: FichaTour }

function Chip({ children, tono = 'neutro' }: { children: React.ReactNode; tono?: 'neutro' | 'ok' }) {
  const tonos = {
    neutro: 'bg-papel-hueso text-navy-sub ring-linea',
    // Verde menta: el mismo par fondo/texto que ya usan los precios y el
    // "✓ Cancelación gratis" de la TourCard de la home.
    ok: 'bg-menta text-menta-texto ring-menta',
  }
  return (
    <span className={`rounded-chip px-3 py-1 text-xs font-medium ring-1 ${tonos[tono]}`}>{children}</span>
  )
}

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
        {tour.booking !== 'consulta' ? <Chip tono="ok">✓ Cancelación gratis</Chip> : null}
        <Chip>{tour.audienciaChip}</Chip>
        <Chip>{ficha.duracion}</Chip>
        {tour.booking === 'completo' ? <Chip>Recogida en hotel</Chip> : null}
      </div>
    </div>
  )
}
