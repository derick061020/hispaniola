import { Link } from 'react-router-dom'
import { TOURS } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'

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

      <div className="relative z-10 mx-auto mt-14 grid max-w-contenido grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
            <li>
              <Link to="/nosotros" className="hover:text-white">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/sostenibilidad" className="hover:text-white">
                Sostenibilidad
              </Link>
            </li>
            <li>
              <Link to="/guias" className="hover:text-white">
                Guías Punta Cana
              </Link>
            </li>
            <li>
              <Link to="/agentes-de-viaje" className="font-semibold hover:text-white">
                Agentes de viaje
              </Link>
            </li>
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
              <Link to="/reserva-directa" className="font-semibold hover:text-white">
                ¿Por qué reservar directo?
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

      <div className="relative z-10 mx-auto mt-12 flex max-w-contenido flex-col items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:justify-between">
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
