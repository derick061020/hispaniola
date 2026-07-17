import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { WHATSAPP_URL } from '@/data/tours'
import type { FichaEvento } from '@/data/eventos'

// Banda de cierre (la banda-cta del prototipo): navy, título + meta a la
// izquierda y los CTA a la derecha. Es el ancla del botón «Reservar» del
// header en esta página (#evento-cierre). El CTA de cotización va por
// EnlacePrototipo (el formulario vive en el hub del prototipo); WhatsApp es
// el único enlace externo real — solo bodas lo lleva, como en el prototipo.
export function CierreEvento({ evento }: { evento: FichaEvento }) {
  return (
    <section
      id="evento-cierre"
      className="flex scroll-mt-header-alto flex-col gap-6 rounded-card bg-navy p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
    >
      <div>
        <h2 className="font-display text-h3 font-semibold text-white">{evento.cierreTitulo}</h2>
        <p className="mt-1 text-sm text-white/70">{evento.cierreMeta}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <EnlacePrototipo className="inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark">
          {evento.cierreCta}
        </EnlacePrototipo>
        {evento.cierreWhatsapp ? (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center rounded-btn px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
          >
            💬 WhatsApp
          </a>
        ) : null}
      </div>
    </section>
  )
}
