import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Users } from 'lucide-react'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { NOTA_PAQUETES, PAQUETES_COMIDA } from '@/data/eventos'
import { t } from '@/lib/i18n'
import { pegaUltima, RejillaTarjetas, RotuloZona, TarjetaV3 } from './tarjetas-v3'

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
const V = COMIDA_Y_BAR_V3.eventos

export function EventosV3() {
  // El Premium al final, como en Party Boat (de menos a más).
  const paquetes = [...PAQUETES_COMIDA].sort((a, b) => (a.precioBase ?? 0) - (b.precioBase ?? 0))

  return (
    <section id="event-menus" className="ancla-comida relative bg-papel py-20 lg:py-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-museo-revelar>
          <div className="max-w-2xl">
            <p className="comida3-eyebrow">{COMIDA_Y_BAR.niveles.eyebrow}</p>
            <h2 className="comida3-h2 mt-3">{E.titulo}</h2>
            <p className="mt-4 text-lead text-navy-sub">{E.texto}</p>
          </div>
          <Link to="/events#onboard" className="comida3-boton-claro group shrink-0 self-start md:self-auto">
            {E.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14">
          <RejillaTarjetas etiqueta={E.titulo}>
            {paquetes.map((p) => {
              const premium = p.destacado === 'premium'
              const suave = premium ? 'text-sobre-navy-suave' : 'text-navy-soft'
              return (
                <TarjetaV3
                  key={p.id}
                  id={p.id}
                  destacada={premium}
                  foto={{ src: `/fotos/${p.foto}.webp`, alt: t(V.fotoAlt[p.id] ?? p.fotoAlt) }}
                  cinta={
                    premium ? (
                      <p className="inline-flex items-center gap-1.5 rounded-chip bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-premium-oro">
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        {V.destacado}
                      </p>
                    ) : null
                  }
                  nombre={
                    <>
                      <h3 className={`font-display text-2xl font-semibold leading-tight ${premium ? 'text-white' : 'text-navy'}`}>
                        {pegaUltima(t(p.nombre))}
                      </h3>
                      <p className={`mt-3 text-xs font-semibold uppercase tracking-[0.12em] ${suave}`}>{t('Starting at')}*</p>
                      <p className={`font-display text-4xl font-semibold ${premium ? 'text-premium-oro' : 'text-coral-dark'}`}>
                        {p.precio}
                      </p>
                      <p className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${suave}`}>
                        <Users className="size-3.5" aria-hidden="true" />
                        {t(p.capacidad)}
                      </p>
                    </>
                  }
                  incluye={
                    <>
                      <RotuloZona oscuro={premium}>{t('Includes')}</RotuloZona>
                      <ul className={`mt-3 grid gap-1.5 text-sm ${premium ? 'text-white' : 'text-navy'}`}>
                        {p.items.map((it) => (
                          <li key={it.titulo}>
                            <span className="font-semibold">{t(it.titulo)}</span>
                            {it.texto ? <span className={suave}> · {t(it.texto)}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </>
                  }
                  pie={
                    <div className={`text-xs font-semibold ${premium ? 'text-sobre-navy-suave' : 'text-navy-sub'}`}>
                      <p>{t(p.meta)}</p>
                      <p className={`mt-1 text-sm ${premium ? 'text-premium-oro' : 'text-coral-texto'}`}>
                        {p.extraPrecio ? t(p.extraPrecio) : null}
                      </p>
                    </div>
                  }
                />
              )
            })}
          </RejillaTarjetas>
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-navy-soft">{t(NOTA_PAQUETES)}</p>
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
