import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Sparkles, Users } from 'lucide-react'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import {
  CANAPES_TEXTOS,
  cortoPaqueteComida,
  PAQUETES_COMIDA,
  WHATSAPP_URL,
  nombrePaqueteComida,
  type PaqueteEvento,
} from '@/data/eventos'
import { IconoWhatsApp } from '@/components/ui/iconos-redes'
import { t } from '@/lib/i18n'
import { pegaUltima, RejillaTarjetas, RotuloZona, TarjetaV3 } from './tarjetas-v3'

// LAS CUATRO TARJETAS DE PAQUETES DE COMIDA (Starfish · Breeze · Tide ·
// Turtle) con su «Or bites». [2026-11-13, Fernando aprobó la sección de
// /food-and-bar y pidió llevarla a las 3 páginas de evento] Sale de
// eventos-v3.tsx para que /food-and-bar y /events/:slug pinten EL MISMO
// componente con LOS MISMOS datos (PAQUETES_COMIDA): ni código ni precios
// duplicados. Lo que cambia por página va por props:
//   · `acciones`: el pie de cada tarjeta. Por defecto, WhatsApp + «Plan your
//     event» (/food-and-bar). En /events/:slug, «Choose this package», que
//     elige el paquete en el formulario de la derecha.
//   · `precio` / `extra`: cómo se escribe el precio. Por defecto la cadena del
//     tarifario; en /events, `formatoDinero` (sigue al selector de moneda,
//     como hacía el bloque anterior).
//   · `columna`: la página de evento tiene el formulario a la derecha y la
//     columna mide ~760 px: 2×2 en vez de 4 en fila.
const B = CANAPES_TEXTOS.tarjeta
const V = COMIDA_Y_BAR_V3.eventos

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
        {B.nivelesVisibles.includes(b.nivel) ? (
          <p
            className={`inline-flex items-center gap-1.5 font-display text-lg font-semibold ${premium ? 'text-premium-oro' : 'text-navy'}`}
          >
            {premium ? <Sparkles className="size-4" aria-hidden="true" /> : null}
            {t(b.nivel)}
          </p>
        ) : null}
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

/** El pie por defecto (/food-and-bar): preguntar por WhatsApp o planear. */
function AccionesPorDefecto({ p, premium }: { p: PaqueteEvento; premium: boolean }) {
  const nombre = t(nombrePaqueteComida(p))
  // El nombre corto del botón. El ancla dice «Ask about Turtle», no
  // «…Premium», para no confundirlo con la familia Premium de canapés (ver
  // cortoPaqueteComida en data/eventos.ts).
  const corto = t(cortoPaqueteComida(p))
  const whatsapp = `${WHATSAPP_URL}?text=${encodeURIComponent(t(B.whatsapp).replace('{paquete}', nombre))}`
  return (
    <>
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
    </>
  )
}

export function TarjetasPaquetesComida({
  etiqueta,
  acciones,
  precio,
  extra,
  columna = false,
}: {
  etiqueta: string
  acciones?: (p: PaqueteEvento, premium: boolean) => ReactNode
  precio?: (p: PaqueteEvento) => ReactNode
  extra?: (p: PaqueteEvento) => ReactNode
  columna?: boolean
}) {
  // El Premium al final, como en Party Boat (de menos a más).
  const paquetes = [...PAQUETES_COMIDA].sort((a, b) => (a.precioBase ?? 0) - (b.precioBase ?? 0))
  const primeroConBocados = paquetes.find((p) => p.bocados?.nivel)
  return (
    <RejillaTarjetas etiqueta={etiqueta} conBocados columna={columna}>
            {paquetes.map((p) => {
              const premium = p.destacado === 'premium'
              const suave = premium ? 'text-sobre-navy-suave' : 'text-navy-soft'
              const nombre = t(nombrePaqueteComida(p))
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
                        {precio ? precio(p) : p.precio}
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
                        {p.extraPrecio ? (extra ? extra(p) : t(p.extraPrecio)) : null}
                      </p>
                      {acciones ? acciones(p, premium) : <AccionesPorDefecto p={p} premium={premium} />}
                    </div>
                  }
                />
              )
            })}
    </RejillaTarjetas>
  )
}
