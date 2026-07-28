import { Link } from 'react-router-dom'
import { TOURS, MEDIOS_PAGO, REDES, MONEDAS, RESENAS_AGREGADO } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { MarcaPago } from '@/components/ui/marcas-pago'
import { SelectorIdioma } from '@/components/ui/selector-idioma'
import { PERFILES_TRABAJO } from '@/data/trabaja'
import {
  IconoFacebook,
  IconoInstagram,
  IconoTikTok,
  IconoYouTube,
} from '@/components/ui/iconos-redes'

// Iconos de red: propios (ui/iconos-redes.tsx) — esta versión de lucide-react
// ya no exporta iconos de marca, ver el porqué en ese archivo.
const ICONO_RED: Record<string, (p: { className?: string }) => React.ReactElement> = {
  instagram: IconoInstagram,
  facebook: IconoFacebook,
  tiktok: IconoTikTok,
  youtube: IconoYouTube,
}

// Footer «océano» (2026-07-17, pedido de Samuel) — reemplaza el corte duro
// blanco→navy: misma TÉCNICA de espuma que IncluyeCrucero (ver
// .footer-espuma en componentes.css) pero ESTÁTICA — img en vez de video,
// sin sticky ni GSAP — y con assets PROPIOS (footer-oceano.webp +
// footer-espuma-mapa.webp, Magnific — Samuel prohibió reutilizar los del
// incluye). El CTA canónico de cierre ("Tu día en el Caribe empieza aquí")
// se FUNDE aquí, sobre el océano y encima de las 4 columnas — ya no vive en
// una sección propia. Footer único: se monta también en la ficha de tour y
// en las landings de evento (por eso «Ver disponibilidad» usa `to="/#tours"`,
// no `href="#tours"` — ScrollAlNavegar, hash-aware, vuelve a la home).
export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-oceano-footer px-5 pb-6 text-white
        pt-[calc(var(--spacing-footer-espuma-movil)+2rem)]
        sm:pt-[calc(var(--spacing-footer-espuma)+3rem)]"
    >
      <div className="footer-oceano" aria-hidden="true">
        <img
          src="/fotos/footer-oceano.webp"
          alt=""
          width={2400}
          height={1340}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'var(--color-overlay-footer)' }} />
      </div>
      {/* Hermana de .footer-oceano, no hija — ver el porqué del subpíxel en componentes.css */}
      <div className="footer-espuma" />

      <div className="relative z-10 mx-auto flex max-w-contenido flex-col items-center gap-4 text-center">
        <h2 className="font-display text-h2 font-semibold text-white">Tu día en el Caribe empieza aquí</h2>
        <Boton to="/#tours">Ver disponibilidad</Boton>
      </div>

      {/* [v2 2026-07-28] De 4 a 5 columnas al sacar «Trabaja con nosotros» de
          dentro de «Empresa». No es `grid-cols-5` a secas: la 1ª columna lleva
          logo, dirección y rating, así que con cinco partes iguales se
          estrecharía y el texto se rompería en más líneas. `1.4fr` para la
          marca y cuatro columnas iguales para las listas mantiene el reparto
          que ya tenía y deja las cuatro arrancando a la misma altura. */}
      <div className="relative z-10 mx-auto mt-14 grid max-w-contenido grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          {/* sobreOscuro, no una clase de color: Logo renderiza un <img> (el
              PNG del cliente), así que un className de texto no cambia sus
              píxeles — hace falta la variante reversed (texto blanco) que ya
              usa el header sobre fondos oscuros. */}
          <Logo sobreOscuro />
          <p className="mt-3 text-sm text-white/70">
            C. P.º del Sol, Punta Cana 23500, RD.
            <br />
            Eco-friendly · Sin plástico · Desde 2012.
          </p>
          <p className="mt-3 text-xs text-white/50">★ 4.9 · 1.782 reseñas · #1 TripAdvisor 7 años</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">Tours</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {TOURS.map((t) => (
              <li key={t.slug}>
                <Link to={`/tours/${t.slug}`} className="hover:text-white">
                  {t.nombre}
                </Link>
              </li>
            ))}
            <li>
              <EnlacePrototipo className="hover:text-white">Eventos</EnlacePrototipo>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">Empresa</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {/* [v2 2026-07-27] `/nosotros` se partió en tres páginas; el footer
                tiene que repetir la arquitectura del menú nuevo, no seguir
                apuntando a una ruta que ahora solo redirige. */}
            <li>
              <Link to="/tripulacion" className="hover:text-white">
                Tripulación
              </Link>
            </li>
            <li>
              <Link to="/instalaciones" className="hover:text-white">
                Instalaciones
              </Link>
            </li>
            <li>
              <Link to="/flota" className="hover:text-white">
                Flota
              </Link>
            </li>
            <li>
              <Link to="/ventaja-competitiva" className="hover:text-white">
                Sostenibilidad
              </Link>
            </li>
            <li>
              <Link to="/fundacion" className="hover:text-white">
                La Fundación
              </Link>
            </li>
            <li>
              <Link to="/guias" className="hover:text-white">
                Guías Punta Cana
              </Link>
            </li>
            <li>
              {/* Correcciones v1 del cliente (planes/06-blog.md): página nueva. */}
              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/agentes-de-viaje" className="font-semibold hover:text-white">
                Agentes de viaje
              </Link>
            </li>
          </ul>

        </div>

        {/* ── Trabaja con nosotros ── [v2 2026-07-28] AHORA ES COLUMNA PROPIA.
            Nació (correcciones v1, 2026-07-22) como sub-bloque colgado de
            «Empresa», con este argumento: son enlaces de partners, hermanos de
            «Agentes de viaje», y una columna para tres links rompería el ritmo
            de 4 del footer.
            Ese argumento CADUCÓ esta misma tanda: «Empresa» pasó de 4 enlaces a
            8 al partirse `/nosotros` en tres páginas y sumarse la Fundación,
            así que este bloque quedaba colgando muy por debajo del pie de las
            otras columnas y se leía como un descuelgue, no como un sub-bloque
            (lo señaló Samuel: «se ve raro y mal que solo esa esté debajo»).
            Como columna hermana, las cuatro listas vuelven a arrancar a la
            misma altura. */}
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Trabaja con nosotros
          </h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {/* Los tres van a la MISMA página con distinto `?perfil=`; la
                etiqueta sale tal cual de PERFILES_TRABAJO (data/trabaja.ts),
                que es la lista que pidió el cliente. */}
            {PERFILES_TRABAJO.map((p) => (
              <li key={p.id}>
                <Link to={`/trabaja-con-nosotros?perfil=${p.id}`} className="hover:text-white">
                  {p.enlace}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">Reservas y ayuda</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <li>
              {/* `/#tours` y no `#tours`: el footer también vive en la ficha,
                  donde ese ancla no existe y el enlace no haría nada. Con la
                  ruta delante vuelve a la home y ScrollAlNavegar (hash-aware)
                  baja al grid de tours. */}
              <Link to="/#tours" className="hover:text-white">
                Reservar ahora
              </Link>
            </li>
            <li>
              {/* [v2 2026-07-28] /reserva-directa → /por-que-reservar: la
                  página se rehízo entera con los slides 50-56 del cliente. */}
              <Link to="/por-que-reservar" className="font-semibold hover:text-white">
                ¿Por qué reservar con nosotros?
              </Link>
            </li>
            <li>
              <Link to="/#faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              {/* 2026-07-17: link a /mi-reserva — la pieza que faltaba para
                  cerrar el ciclo post-checkout. Sin este link, un cliente que
                  quería cambiar el menú o pagar el saldo tenía que
                  contactarnos por WhatsApp (fricción). Va entre FAQ y
                  Contacto: misma columna semántica (gestión + ayuda). */}
              <Link to="/mi-reserva" className="font-semibold hover:text-white">
                Gestionar mi reserva
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-white">
                Contacto
              </Link>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="hover:text-white">
                WhatsApp +1 829 305 2804
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Banda de servicio (correcciones v1 del cliente, slide 18) ──
          Valoración + redes + medios de pago + idioma/moneda. El cliente puso
          de referencia el pie de Civitatis, que agrupa justo esto: las
          señales que un turista busca antes de dejar la tarjeta.

          Va DEBAJO de las 4 columnas y ENCIMA del legal: es información de
          servicio, no navegación. Sobre el océano, así que todo el bloque
          respira en blancos translúcidos (nada de cards opacas que taparían
          el agua que costó generar). */}
      <div className="relative z-10 mx-auto mt-12 grid max-w-contenido gap-6 border-t border-white/10 pt-8 lg:grid-cols-[auto_1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-white">Cómo nos valoran</p>
          <p className="mt-1 text-sm text-white/70">
            <span className="font-semibold text-white">★ {RESENAS_AGREGADO.rating}</span> ·{' '}
            {RESENAS_AGREGADO.total.toLocaleString('es-ES')} reseñas · #1 TripAdvisor 7 años
          </p>
          <ul className="mt-3 flex flex-wrap items-center gap-2">
            {REDES.map((red) => {
              const Icono = ICONO_RED[red.id]
              const clases =
                'grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
              // Sin URL real no se inventa un destino: EnlacePrototipo deja
              // claro (title) que el enlace está pendiente del cliente.
              return (
                <li key={red.id}>
                  {red.url ? (
                    <a href={red.url} target="_blank" rel="noopener" aria-label={red.nombre} className={clases}>
                      <Icono className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <EnlacePrototipo aria-label={red.nombre} className={clases}>
                      <Icono className="size-4" aria-hidden="true" />
                    </EnlacePrototipo>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:px-8">
          <p className="text-sm font-semibold text-white">Métodos de pago</p>
          {/* 2026-07-22 (pedido de Samuel): cajitas de tamaño fijo con el logo
              dentro, no chips de texto que se ensanchaban con el nombre. El
              detalle de por qué así y de dónde salen los logos, en
              ui/marcas-pago.tsx. */}
          <ul className="mt-3 flex flex-wrap gap-2">
            {MEDIOS_PAGO.map((m) => (
              <li key={m.id}>
                <MarcaPago medio={m} />
              </li>
            ))}
          </ul>
          {/* «Efectivo a bordo» era la 5ª cajita y baja aquí, a la frase que
              ya hablaba del saldo: no es una marca, y un pictograma genérico
              entre logos era justo lo que delataba que las cajas no eran
              todas lo mismo (ver el porqué largo en data/home.ts). El dato
              se conserva — es el ÚNICO medio de pago que el proyecto tiene
              confirmado. */}
          <p className="mt-3 text-xs text-white/50">
            Confirmas con el 25% online. El resto, el día del tour — también en efectivo a bordo.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Idioma</p>
            <SelectorIdioma />
          </div>
          <div>
            <label htmlFor="footer-moneda" className="mb-2 block text-sm font-semibold text-white">
              Moneda
            </label>
            {/* Visual, como el idioma: el sitio publica en USD y no hay
                conversión real todavía (ver MONEDAS en data/home.ts). */}
            <select
              id="footer-moneda"
              defaultValue="USD"
              className="rounded-btn border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {MONEDAS.map((m) => (
                <option key={m} value={m} className="text-navy">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-contenido flex-col items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Hispaniola Aquatic Adventures.</p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>
            <Link to="/legal/politica-de-cancelacion" className="hover:text-white/70">
              Política de cancelación
            </Link>
          </li>
          <li>
            <Link to="/legal/privacidad" className="hover:text-white/70">
              Privacidad
            </Link>
          </li>
          <li>
            <Link to="/legal/terminos" className="hover:text-white/70">
              Términos
            </Link>
          </li>
          <li>
            <Link to="/legal/cookies" className="hover:text-white/70">
              Cookies
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
