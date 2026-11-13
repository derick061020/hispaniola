import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { CANAPES_TEXTOS, NOTA_PAQUETES } from '@/data/eventos'
import { t } from '@/lib/i18n'
import { CartaCanapesV3 } from './carta-canapes-v3'
import { TarjetasPaquetesComida } from './paquetes-comida-v3'

// [2026-11-12, Fernando vía Marketing: canapés] Cada paquete suma su «or
// bites» (la alternativa al almuerzo, como en la web de Party Boat), un botón
// para preguntar por WhatsApp y otro para planear el evento; debajo, la carta
// de los 28 canapés (carta-canapes-v3.tsx). Los valores por defecto de las
// dudas abiertas viven en data/eventos.ts (CANAPES_TEXTOS y compañía).
// [2026-11-13] Las tarjetas viven en paquetes-comida-v3.tsx (compartidas con
// las 3 páginas de evento).

// LOS MENÚS DE EVENTOS — el corazón de la página de Party Boat (sus cuatro
// cards Starfish · Breeze · Tide · Turtle, con la foto circular asomando, el
// precio grande, «up to 12 guests» y el precio por invitado extra). Aquí son
// LOS MISMOS cuatro paquetes, leídos de PAQUETES_COMIDA (lo que ya publica
// /events): nombre, precio, capacidad, duración, platos y extra. Nada escrito
// a mano.
//
// Como su Turtle, el Premium (Turtle) va destacado (navy + oro) con su badge
// «Most complete» — el mismo que le pone /events.
//
// [2026-10-22, Samuel, tras releer el encargo de Marketing] Las cuatro
// tarjetas pasan a ser iguales entre sí y comparables, con las mismas zonas que
// las de menús de tours (foto · nombre y precio · qué incluye · pie): ver
// tarjetas-v3.tsx. En móvil, carrusel con la siguiente asomando.
//
// [2026-10-21, 2ª revisión de Samuel] «El mar solo donde toca»: esta sección pasa a fondo claro de Hispaniola (el agua se queda en el Open Bar y los niveles de barra).
// El Turtle deja el negro y pasa al NAVY de marca (`comida3-turtle`), con el oro.
//
// [2026-10-21, verificación] PAQUETES_COMIDA no es `traducible()`: cada texto
// pasa por t() aquí. Y debajo va la letra pequeña del tarifario
// (NOTA_PAQUETES: «Starting At Rates», la veda de la langosta del Turtle…),
// con el «Starting at» sobre cada precio, como en la versión actual.
const E = COMIDA_Y_BAR.eventos

export function EventosV3() {
  return (
    <section id="event-menus" className="ancla-comida relative bg-papel py-20 lg:py-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-museo-revelar>
          {/* [2026-11-13, Samuel: «columna demasiado estrecha»] Más ancho: título en 2 líneas y párrafo cómodo. */}
          <div className="max-w-5xl">
            <p className="comida3-eyebrow">{COMIDA_Y_BAR.niveles.eyebrow}</p>
            {/* [2026-11-12] ⚠️ Cabecera pendiente de Marketing (CANAPES_TEXTOS). */}
            <h2 className="comida3-h2 mt-3">{t(CANAPES_TEXTOS.cabecera.titulo)}</h2>
            <p className="mt-4 max-w-3xl text-lead text-navy-sub">{t(CANAPES_TEXTOS.cabecera.texto)}</p>
          </div>
          <Link to="/events#onboard" className="comida3-boton-claro group shrink-0 self-start md:self-auto">
            {E.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14">
          <TarjetasPaquetesComida etiqueta={E.titulo} />
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-navy-soft">{t(NOTA_PAQUETES)}</p>
        <CartaCanapesV3 />
        {/* [2026-10-22, repaso de CTA] La salida natural tras ver los cuatro
            paquetes: planear el evento (la landing de eventos, donde se cotiza). */}
        <div className="mt-8 flex justify-center">
          <Link to="/events" className="museo-boton-coral group">
            {t('Plan an event')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
