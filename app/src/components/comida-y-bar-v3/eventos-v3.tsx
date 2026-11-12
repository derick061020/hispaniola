import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Sparkles, Users } from 'lucide-react'
import { COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import {
  CANAPES_TEXTOS,
  cortoPaqueteComida,
  NOTA_PAQUETES,
  PAQUETES_COMIDA,
  WHATSAPP_URL,
  nombrePaqueteComida,
  type PaqueteEvento,
} from '@/data/eventos'
import { IconoWhatsApp } from '@/components/ui/iconos-redes'
import { t } from '@/lib/i18n'
import { CartaCanapesV3 } from './carta-canapes-v3'
import { pegaUltima, RejillaTarjetas, RotuloZona, TarjetaV3 } from './tarjetas-v3'

// [2026-11-12, Fernando vía Marketing: canapés] Cada paquete suma su «or
// bites» (la alternativa al almuerzo, como en la web de Party Boat), un botón
// para preguntar por WhatsApp y otro para planear el evento; debajo, la carta
// de los 28 canapés (carta-canapes-v3.tsx). Los valores por defecto de las
// dudas abiertas viven en data/eventos.ts (CANAPES_TEXTOS y compañía).
const B = CANAPES_TEXTOS.tarjeta

/** La caja «Or bites» de una tarjeta. */
function CajaBocados({ p, primeroConBocados, premium }: { p: PaqueteEvento; primeroConBocados?: PaqueteEvento; premium: boolean }) {
  const b = p.bocados
  if (!b) return null
  const total = b.classic + b.premium
  const etiqueta = <p className="comida3-bocados-etiqueta">{t(B.oBocados)}</p>

  if (!b.nivel || total === 0) {
    return (
      <div className="comida3-bocados comida3-bocados--vacia">
        {etiqueta}
        <p className="font-display text-base font-semibold text-navy">{t(B.sinBocados)}</p>
        {primeroConBocados ? (
          <p className="mt-1 text-sm text-navy-sub">
            {t(B.empiezan).replace('{paquete}', t(primeroConBocados.nombreCorto))}
          </p>
        ) : null}
      </div>
    )
  }

  // [2026-11-12, 2ª vuelta, Samuel: «que de un vistazo quede claro qué
  // paquete da acceso a qué nivel»] Las DOS familias salen SIEMPRE, en el
  // mismo orden y con el mismo código de color que la carta (Classic = aqua,
  // Premium = navy y oro). La que el paquete no incluye se queda apagada con
  // «Not included»: así, pasando la vista de Breeze a Tide, se ve aparecer
  // la Premium.
  const filas = [
    { id: 'classic' as const, n: b.classic, nombre: B.classic },
    { id: 'premium' as const, n: b.premium, nombre: B.premium },
  ]

  return (
    <div className={`comida3-bocados ${premium ? 'comida3-bocados--vip' : ''}`}>
      {etiqueta}
      <div className="flex items-end justify-between gap-3">
        <p className="flex items-baseline gap-2">
          <span className={`font-display text-5xl font-semibold leading-none ${premium ? 'text-premium-oro' : 'text-navy'}`}>{total}</span>
          <span className={`text-eyebrow font-semibold uppercase tracking-[0.14em] ${premium ? 'text-sobre-navy-suave' : 'text-navy-soft'}`}>
            {t(B.selecciones)}
          </span>
        </p>
        <p
          className={`inline-flex items-center gap-1.5 font-display text-lg font-semibold ${premium ? 'text-premium-oro' : 'text-navy'}`}
        >
          {premium ? <Sparkles className="size-4" aria-hidden="true" /> : null}
          {t(b.nivel)}
        </p>
      </div>
      <ul className="mt-4 grid gap-2">
        {filas.map((f) => (
          <li key={f.id} className={`comida3-bocados-fila ${f.n === 0 ? 'comida3-bocados-fila--fuera' : ''}`}>
            <span className={`comida3-familia comida3-familia--${f.id}`}>
              {f.id === 'premium' ? <Sparkles className="size-3" aria-hidden="true" /> : null}
              {t(f.nombre)}
            </span>
            {f.n > 0 ? (
              <span className="font-semibold">
                {f.n} <span className="font-normal opacity-80">{t(B.deVariedades)}</span>
              </span>
            ) : (
              <span>{t(B.noIncluida)}</span>
            )}
          </li>
        ))}
      </ul>
      <a href="#bites" className={`mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold underline underline-offset-4 ${premium ? 'text-sobre-navy-suave hover:text-white' : 'text-aqua-dark'}`}>
        {t(B.verCarta)}
        <ArrowDown className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  )
}

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
  const primeroConBocados = paquetes.find((p) => p.bocados?.nivel)

  return (
    <section id="event-menus" className="ancla-comida relative bg-papel py-20 lg:py-28">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-museo-revelar>
          <div className="max-w-2xl">
            <p className="comida3-eyebrow">{COMIDA_Y_BAR.niveles.eyebrow}</p>
            {/* [2026-11-12] ⚠️ Cabecera pendiente de Marketing (CANAPES_TEXTOS). */}
            <h2 className="comida3-h2 mt-3">{t(CANAPES_TEXTOS.cabecera.titulo)}</h2>
            <p className="mt-4 text-lead text-navy-sub">{t(CANAPES_TEXTOS.cabecera.texto)}</p>
          </div>
          <Link to="/events#onboard" className="comida3-boton-claro group shrink-0 self-start md:self-auto">
            {E.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14">
          <RejillaTarjetas etiqueta={E.titulo} conBocados>
            {paquetes.map((p) => {
              const premium = p.destacado === 'premium'
              const suave = premium ? 'text-sobre-navy-suave' : 'text-navy-soft'
              const nombre = t(nombrePaqueteComida(p))
              // El nombre corto del botón. El ancla dice «Ask about Turtle», no
              // «…Premium», para no confundirlo con la familia Premium de
              // canapés (ver cortoPaqueteComida en data/eventos.ts).
              const corto = t(cortoPaqueteComida(p))
              const whatsapp = `${WHATSAPP_URL}?text=${encodeURIComponent(t(B.whatsapp).replace('{paquete}', nombre))}`
              return (
                <TarjetaV3
                  key={p.id}
                  id={p.id}
                  destacada={premium}
                  bocados={<CajaBocados p={p} primeroConBocados={primeroConBocados} premium={premium} />}
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
                        {pegaUltima(nombre)}
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
                      {/* [2026-11-12] Cada paquete, su botón: preguntar por
                          WhatsApp (como Party Boat) o ir a planear el evento.
                          Reservar online NO: eso es la integración con Odoo de
                          Derick. */}
                      <div className="mt-4 flex flex-col gap-2">
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener"
                          className={`comida3-pregunta ${premium ? 'comida3-pregunta--vip' : ''}`}
                        >
                          {t(B.preguntar).replace('{paquete}', corto)}
                          <span className="comida3-pregunta-icono">
                            <IconoWhatsApp className="size-5" />
                          </span>
                        </a>
                        <Link
                          to="/events"
                          className={`group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${premium ? 'text-white' : 'text-navy'}`}
                        >
                          {t(B.planear)}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  }
                />
              )
            })}
          </RejillaTarjetas>
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
