import { Link } from 'react-router-dom'
import { ArrowRight, Baby } from 'lucide-react'
import { menusComida, nombreTour, type MenuComida, type PlatoComida } from '@/components/comida-y-bar/menus-datos'
import { recortePlato, COMIDA_Y_BAR } from '@/data/comida-y-bar'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { t, tp } from '@/lib/i18n'
import { ChipsTours, pegaUltima, RejillaTarjetas, RotuloZona, TarjetaV3 } from './tarjetas-v3'

// 02 · MENÚS DE TUS TOURS — cuatro tarjetas comparables.
//
// [2026-10-22, Samuel, tras releer el encargo de Marketing] «No pidieron los
// platos uno a uno: piden que cada menú tenga una fotografía clara, nombre y
// contenido, que se distingan y que se puedan comparar sin leer demasiado,
// como los paquetes de Party Boat». Se acabó la carta de 8 platos sueltos en
// rejilla: los platos viven DENTRO de la tarjeta de su menú.
//
//   1. Light  2. Premium  3. Taste of Hispaniola (+ el buffet de brochetas,
//   que es del mismo charter)  4. Buffet de la playa (Saona).
//
// Todo sale del MISMO modelo que la v2 (menus-datos.ts → FICHAS): nombres,
// platos, tours y su estado («Included in price», «Upgrade»…). Ni un
// ingrediente, precio o inclusión escrito aquí. Lo único de este archivo son
// las FOTOS de cada tarjeta (ver FOTOS) y los rótulos de zona.
//
// FOTOS — todas reales del cliente, ninguna de stock ni generada:
//   · Light     → el plato de pollo a la parrilla (el primero de la carta Light).
//   · Premium   → el Surf & Turf (el plato estrella de la carta Premium).
//   · Taste     → las brochetas con papas y camarón del paquete Tide de eventos.
//                 ⚠️ Es la misma foto que el Tide del bloque de eventos: sigue
//                 pendiente la foto propia de las brochetas del charter (Miguel).
//   · Playa     → la foto real del buffet en la isla (galería de Saona).
const M = COMIDA_Y_BAR.menus
const V = COMIDA_Y_BAR_V3.menus

/** Cuántos platos se ven sin desplegar (máximo, en cualquier tarjeta). */
const PLATOS_VISIBLES = 3

const textoPlato = (p: PlatoComida) => (p.desc ? `${p.nombre}. ${p.desc}` : p.nombre)

/** Un plato de la lista: nombre en negrita y, como mucho, su línea de
 *  descripción. El asterisco ata la langosta a la veda de la propia tarjeta. */
function Plato({ p }: { p: PlatoComida }) {
  return (
    <li>
      {p.ninos ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-premium-oro-oscuro">
          <Baby className="size-3.5" aria-hidden="true" />
          {t('Kids')} · {nombreTour('coral-quest')}
        </span>
      ) : null}
      <p className="text-sm font-semibold leading-snug text-navy">{p.nombre}</p>
      {p.desc ? (
        <p className="text-xs leading-snug text-navy-sub">
          {p.desc}
          {/lobster/i.test(p.desc) ? '*' : ''}
        </p>
      ) : null}
    </li>
  )
}

const ListaPlatos = ({ platos, className = '' }: { platos: PlatoComida[]; className?: string }) => (
  <ul className={`grid gap-2.5 ${className}`}>
    {platos.map((p) => (
      <Plato key={p.nombre} p={p} />
    ))}
  </ul>
)

function Nombre({ menu }: { menu: MenuComida }) {
  return <h3 className="font-display text-2xl font-semibold leading-tight text-navy">{pegaUltima(menu.titulo)}</h3>
}

/** Como mucho 3 platos a la vista; el resto, en «See all N dishes», DENTRO de
 *  la tarjeta. Al abrirse el rótulo pasa a «Show fewer». */
function PlatosPlegables({ platos }: { platos: PlatoComida[] }) {
  const primeros = platos.slice(0, PLATOS_VISIBLES)
  const resto = platos.slice(PLATOS_VISIBLES)
  return (
    <>
      <ListaPlatos platos={primeros} className="mt-2.5" />
      {resto.length ? (
        <details className="comida3-tm-mas">
          <summary className="comida3-tm-mas-boton">
            <span className="comida3-tm-mas-n">{tp(V.verTodos, { n: platos.length })}</span>
            <span className="comida3-tm-menos">{V.verMenos}</span>
          </summary>
          <ListaPlatos platos={resto} className="mt-2.5" />
        </details>
      ) : null}
    </>
  )
}

function NotaVeda() {
  return <p className="mt-3 text-xs leading-relaxed text-navy-sub">{M.veda}</p>
}

/** La nota/extra de pago en menta (la langosta de Saona), de la ficha. */
function Extra({ menu }: { menu: MenuComida }) {
  if (!menu.extra) return null
  return (
    <div className="mt-4 rounded-card bg-menta px-4 py-3">
      <p className="text-sm font-semibold text-menta-texto">{menu.extra}</p>
      {menu.extraNota ? <p className="mt-1 text-xs leading-relaxed text-navy-sub">{menu.extraNota}</p> : null}
    </div>
  )
}

export function MenusV3() {
  const menus = menusComida()
  const light = menus.find((m) => m.id === 'menu-light')
  const premium = menus.find((m) => m.id === 'menu-premium')
  const taste = menus.find((m) => m.id === 'menu-taste')
  const buffetBrochetas = menus.find((m) => m.id === 'menu-skewer-buffet')
  const playa = menus.find((m) => m.id === 'menu-beach-buffet')

  return (
    <div id="menus" className="ancla-comida relative bg-papel-hueso">
      <section className="relative pb-20 pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-contenido px-5 sm:px-10">
          {/* El plato que asoma por la esquina (la bandeja de Party Boat). En
              móvil, entero y centrado sobre el título, como allí. */}
          <div className="comida3-esquina relative">
            <img
              src={recortePlato('plato-surf-turf')}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              data-museo-flotar
              className="comida3-plato-esquina"
            />
            <div className="max-w-2xl" data-museo-revelar>
              <p className="comida3-eyebrow">
                {V.numero} · {V.eyebrow}
              </p>
              <h2 className="comida3-h2 mt-3">{M.titulo}</h2>
              <p className="mt-4 text-lead text-navy-sub">{M.texto}</p>
            </div>
          </div>

          <div className="mt-14">
            <RejillaTarjetas etiqueta={V.eyebrow}>
              {light ? (
                <TarjetaV3
                  id={light.id}
                  foto={{
                    src: recortePlato('plato-chicken-bodegon'),
                    alt: textoPlato(light.platos[0]),
                    ajuste: 'contain',
                  }}
                  nombre={<Nombre menu={light} />}
                  incluye={
                    <>
                      <RotuloZona>{t('Includes')}</RotuloZona>
                      <ListaPlatos platos={light.platos} className="mt-3" />
                    </>
                  }
                  pie={<ChipsTours tours={light.tours} />}
                />
              ) : null}

              {premium ? (
                <TarjetaV3
                  id={premium.id}
                  foto={{
                    src: recortePlato('plato-surf-turf'),
                    alt: textoPlato(premium.platos.find((p) => p.nombre === 'Surf & Turf') ?? premium.platos[0]),
                    ajuste: 'contain',
                  }}
                  nombre={<Nombre menu={premium} />}
                  incluye={
                    <>
                      <RotuloZona>{t('Includes')}</RotuloZona>
                      {premium.bajada ? <p className="mt-3 text-xs font-semibold text-premium-oro-oscuro">{premium.bajada}</p> : null}
                      <PlatosPlegables platos={premium.platos} />
                      <NotaVeda />
                    </>
                  }
                  pie={<ChipsTours tours={premium.tours} />}
                />
              ) : null}

              {taste && buffetBrochetas ? (
                <TarjetaV3
                  id={taste.id}
                  foto={{ src: '/fotos/paquete-iii.webp', alt: t('Grilled chicken, beef and shrimp skewers with fries') }}
                  nombre={<Nombre menu={taste} />}
                  incluye={
                    <>
                      <RotuloZona>{t('Includes')}</RotuloZona>
                      {taste.texto ? <p className="mt-3 text-xs leading-snug text-navy-sub">{taste.texto}</p> : null}
                      <ListaPlatos platos={taste.platos} className="mt-3" />
                      {/* El buffet de brochetas es del mismo charter: va dentro. */}
                      <div id={buffetBrochetas.id} className="ancla-comida mt-4 border-t border-dashed border-linea-fuerte pt-4">
                        <h4 className="text-sm font-semibold text-navy">{buffetBrochetas.titulo}</h4>
                        {buffetBrochetas.texto ? (
                          <p className="mt-1 text-xs leading-snug text-navy-sub">{buffetBrochetas.texto}</p>
                        ) : null}
                      </div>
                    </>
                  }
                  pie={<ChipsTours tours={[...taste.tours, ...buffetBrochetas.tours]} />}
                />
              ) : null}

              {playa ? (
                <TarjetaV3
                  id={playa.id}
                  foto={{ src: '/fotos/comida-bar/galeria-isla-saona-5-x2.webp', alt: t('The buffet served on Saona Island') }}
                  nombre={<Nombre menu={playa} />}
                  incluye={
                    <>
                      <RotuloZona>{t('Includes')}</RotuloZona>
                      <PlatosPlegables platos={playa.platos} />
                      <Extra menu={playa} />
                    </>
                  }
                  pie={<ChipsTours tours={playa.tours} />}
                />
              ) : null}
            </RejillaTarjetas>
          </div>

          {/* [2026-10-22, repaso de CTA] Tras ver los menús, la salida natural:
              elegir tour (los menús se sirven a bordo de cada uno). */}
          <div className="mt-14 flex justify-center">
            <Link to="/tours" className="museo-boton-coral group">
              {t('Book your tour')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
