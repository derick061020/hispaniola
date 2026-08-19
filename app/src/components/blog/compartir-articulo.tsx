import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { IconoFacebook, IconoWhatsApp, IconoX } from '@/components/ui/iconos-redes'
import type { Articulo } from '@/data/blog'
import { t } from '@/lib/i18n'

// Compartir en redes (correcciones v1, pedido de Samuel 2026-07-22): a
// diferencia de REDES en el footer (perfiles propios de Hispaniola, algunos
// aún sin URL real), estos son enlaces de INTENT — cada red abre su propio
// composer con la URL del artículo ya rellena. Funcionan sin depender de que
// el cliente entregue nada, son endpoints públicos de cada red. El botón de
// la derecha copia el enlace al portapapeles (mismo patrón que `compartir`
// en tour/widget-reserva.tsx, sin la rama de Web Share API: aquí conviven
// varios botones de red a la vez, no un único gesto "compartir").
//
// `sobreOscuro` (2ª vuelta, correcciones v1 — pedido de Samuel: "que los
// botones de compartir estén arriba dentro del hero"): antes vivía suelto en
// una fila bajo el hero, sobre papel — ahora se monta DENTRO del hero
// (HeroInterna, prop `arriba`), sobre la foto de portada. Mismo patrón de
// círculo translúcido que REDES del footer sobre bg-navy (bg-white/10 →
// hover bg-white/20, footer.tsx) en vez de bg-papel-hueso/ring-linea, que
// desaparecería sobre una foto.
export function CompartirArticulo({
  articulo,
  sobreOscuro = false,
}: {
  articulo: Articulo
  sobreOscuro?: boolean
}) {
  const [copiado, setCopiado] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${articulo.slug}` : ''
  const texto = articulo.titulo

  const redes = [
    {
      nombre: 'Facebook',
      Icono: IconoFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      nombre: 'X',
      Icono: IconoX,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`,
    },
    {
      nombre: 'WhatsApp',
      Icono: IconoWhatsApp,
      href: `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`,
    },
  ]

  const clases = sobreOscuro
    ? 'grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
    : 'grid size-9 place-items-center rounded-full bg-papel-hueso text-navy-sub ring-1 ring-linea transition-colors hover:bg-linea hover:text-navy'

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso de portapapeles no hay nada que hacer desde aquí; el
      // usuario siempre puede copiar la URL de la barra de direcciones.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className={`text-sm font-semibold ${sobreOscuro ? 'text-white/90' : 'text-navy'}`}>{t('Share')}</span>
      <ul className="flex items-center gap-2">
        {redes.map((red) => (
          <li key={red.nombre}>
            <a
              href={red.href}
              target="_blank"
              rel="noopener"
              aria-label={`Share on ${red.nombre}`}
              className={clases}
            >
              <red.Icono className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copiarEnlace} aria-label={t('Copy link')} className={clases}>
            {copiado ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Link2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </li>
      </ul>
    </div>
  )
}
