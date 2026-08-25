import { useSyncExternalStore } from 'react'
import { UserRound } from 'lucide-react'
import { escuchaMoneda, fechaTasas, fijaMoneda, hayTasa, instantaneaMoneda, monedaActiva, SIMBOLO, type Moneda } from '@/lib/moneda'
import { Link } from 'react-router-dom'
import { useCatalogo } from '@/lib/api/use-catalogo'
import { fusionarLista } from '@/lib/api/fusion-catalogo'
import { TOURS, OCASIONES, MEDIOS_PAGO, REDES, MONEDAS, RESENAS_AGREGADO } from '@/data/home'
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
import { numero, t } from '@/lib/i18n'

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
// incluye). El CTA canónico de cierre se FUNDE aquí, sobre el océano y encima
// de las 4 columnas — ya no vive en una sección propia (su texto llega ahora
// por prop, ver abajo). Footer único: se monta también en la ficha de tour y
// en las landings de evento (por eso «Ver disponibilidad» usa `to="/#tours"`,
// no `href="#tours"` — ScrollAlNavegar, hash-aware, vuelve a la home).
// [v3 2026-08-06, WEBSITE - INICIO pág. 6: «CAMBIAR TU DIA… PARA READY FOR AN
// UNFORGETTABLE DAY?»] La banda CTA deja de tener el texto quemado. No es
// generalizar por si acaso: /ventaja-competitiva pide OTRO texto para esta
// MISMA banda en la tanda v3 («Your Caribbean story starts here», plan 07 §5),
// y el footer es único para toda la web. Prop con el de la home por defecto —
// las páginas que no lo pasen siguen igual que hasta ahora.
export function Footer({ cta = t('Ready for an unforgettable day?') }: { cta?: string }) {
  // La moneda vive fuera de React (`lib/moneda.ts`): se lee con
  // `useSyncExternalStore` para que el propio selector se entere del cambio.
  // La instantánea lleva un contador además de la moneda: sin él, al llegar las
  // tasas del día `useSyncExternalStore` veía el mismo «USD» de antes, se
  // ahorraba el render y las opciones se quedaban deshabilitadas para siempre.
  useSyncExternalStore(escuchaMoneda, instantaneaMoneda, () => 'USD|0')
  const moneda = monedaActiva()
  const fecha = fechaTasas()
  // [2026-08-18] La lista sale de Odoo: un tour despublicado desaparece de aquí
  // sin tocar código, y el «desde US$» es el del catálogo, no el que quedó
  // escrito en `data/home.ts`. Si Odoo no contesta se pinta la lista estática.
  const tours = fusionarLista(TOURS, useCatalogo())
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
        <h2 className="font-display text-h2 font-semibold text-white">{cta}</h2>
        {/* [2026-08-25, pedido de Samuel: «en el footer agrega un botón que
            diga mi cuenta, hacia el área privada del cliente»] El enlace al
            área privada ya existía desde el 07-18, pero como una línea más de
            la lista de «Reservas», entre otras siete: quien vuelve a entrar a
            ver SU reserva no lo encontraba. Aquí es un botón y se ve.

            Al lado del CTA y no en su lugar: «Ver disponibilidad» es para
            quien todavía no ha reservado y manda; esto es para quien ya lo
            hizo. Por eso va perfilado y no en coral — mismo alto y mismo
            radio, pero sin competir con el principal. */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Boton to="/#tours">{t('See availability')}</Boton>
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 rounded-btn border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            <UserRound className="size-4 shrink-0" aria-hidden="true" />
            {t('My account')}
          </Link>
        </div>
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
            {t('C. P.º del Sol, Punta Cana 23500, Dominican Republic.')}
            <br />
            {t('Eco-friendly · Zero plastic · Since 2010.')}
          </p>
          <p className="mt-3 text-xs text-white/50">{t('★ 4.9 · 1,782 reviews · #1 on TripAdvisor for 7 years')}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">{t('Tours')}</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {tours.map((tour) => (
              <li key={tour.slug}>
                <Link to={`/tours/${tour.slug}`} className="hover:text-white">
                  {tour.nombre}
                </Link>
              </li>
            ))}
            {/* [2026-08-24, barrido de enlaces] ERA UN `EnlacePrototipo`
                («Events», href="#", no navegaba) en el footer, o sea en las 25
                paginas. Su motivo caduco: ese componente dice «eventos... son
                otro plan», pero las tres landings existen desde hace tiempo y
                el megamenu y el menu movil YA las enumeran una a una desde
                OCASIONES. Se hace lo mismo aqui, que ademas es como esta
                columna trata a los tours justo arriba. Se filtra por `slug`
                porque en el tipo `Ocasion` es OPCIONAL: sin la guarda, una
                ocasion sin slug pintaria `/events/undefined` en silencio. */}
            {OCASIONES.filter((o) => o.slug).map((o) => (
              <li key={o.tipo}>
                <Link to={`/events/${o.slug}`} className="hover:text-white">
                  {o.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">{t('Company')}</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {/* [v2 2026-07-27] `/nosotros` se partió en tres páginas; el footer
                tiene que repetir la arquitectura del menú nuevo, no seguir
                apuntando a una ruta que ahora solo redirige. */}
            <li>
              <Link to="/crew" className="hover:text-white">
                {t('Crew')}
              </Link>
            </li>
            <li>
              <Link to="/facilities" className="hover:text-white">
                {t('Facilities')}
              </Link>
            </li>
            <li>
              <Link to="/fleet" className="hover:text-white">
                {t('Fleet')}
              </Link>
            </li>
            <li>
              <Link to="/competitive-advantage" className="hover:text-white">
                {t('Sustainability')}
              </Link>
            </li>
            <li>
              <Link to="/foundation" className="hover:text-white">
                {t('The Foundation')}
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-white">
                {t('Punta Cana guides')}
              </Link>
            </li>
            <li>
              {/* Correcciones v1 del cliente (planes/06-blog.md): página nueva. */}
              <Link to="/blog" className="hover:text-white">
                {t('Blog')}
              </Link>
            </li>
            <li>
              <Link to="/travel-agents" className="font-semibold hover:text-white">
                {t('Travel agents')}
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
            {t('Work with us')}
          </h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            {/* Los tres van a la MISMA página con distinto `?perfil=`; la
                etiqueta sale tal cual de PERFILES_TRABAJO (data/trabaja.ts),
                que es la lista que pidió el cliente. */}
            {PERFILES_TRABAJO.map((p) => (
              <li key={p.id}>
                <Link to={`/careers?perfil=${p.id}`} className="hover:text-white">
                  {p.enlace}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">{t('Bookings & help')}</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <li>
              {/* `/#tours` y no `#tours`: el footer también vive en la ficha,
                  donde ese ancla no existe y el enlace no haría nada. Con la
                  ruta delante vuelve a la home y ScrollAlNavegar (hash-aware)
                  baja al grid de tours. */}
              <Link to="/#tours" className="hover:text-white">
                {t('Book now')}
              </Link>
            </li>
            {/* [2026-08-24, Samuel: «la pagina de why book direct quitala de
                todos los lugares que apunten a ella, no la vamos a usar»]
                AQUI VIVIA «Why book direct?», y era el UNICO enlace navegable a
                /why-book-direct de toda la web (el footer se pinta en las 25
                paginas). La pagina NO se borra — su ruta, su contenido y los
                301 de vercel.json siguen en pie: solo se queda sin puertas.
                Tambien sale del sitemap, para no dejar indexada una pagina
                huerfana. Para revivirla basta con devolver este <li>. */}
            <li>
              {/* [2026-08-24, barrido de enlaces] ERA `/#faq`, UN ANCLA
                  HUERFANA. La seccion de preguntas de la home se borro en las
                  correcciones v2 («quitar preguntas de la home»), y con ella el
                  id: hoy `id="faq"` no existe en ninguna pagina. Y no fallaba
                  en silencio del todo — te sacaba de la pagina en la que
                  estabas, te dejaba en la home y ScrollAlNavegar, al no
                  encontrar el destino, ni siquiera subia arriba. El vecino de
                  al lado («Contacto») ya se habia actualizado a /contact cuando
                  paso lo mismo; este se quedo atras. Va a /faq, que es la
                  pagina real y el mismo destino que NAV_AYUDA usa en el
                  megamenu y en el menu movil. */}
              <Link to="/faq" className="hover:text-white">
                {t('FAQ')}
              </Link>
            </li>
            <li>
              {/* 2026-07-17: link a /mi-reserva — la pieza que faltaba para
                  cerrar el ciclo post-checkout. Sin este link, un cliente que
                  quería cambiar el menú o pagar el saldo tenía que
                  contactarnos por WhatsApp (fricción). Va entre FAQ y
                  Contacto: misma columna semántica (gestión + ayuda). */}
              <Link to="/my-booking" className="font-semibold hover:text-white">
                {t('Manage my booking')}
              </Link>
            </li>
            <li>
              {/* [2026-08-18] El área privada. Va justo debajo porque es la
                  misma tarea vista de otra manera: «My booking» abre UNA
                  reserva con su código; esto abre TODAS las tuyas con la
                  contraseña que recibiste al reservar. */}
              <Link to="/account" className="hover:text-white">
                {t('My account')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                {t('Contact')}
              </Link>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="hover:text-white">
                {t('WhatsApp +1 829 305 2804')}
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
          <p className="text-sm font-semibold text-white">{t('How guests rate us')}</p>
          <p className="mt-1 text-sm text-white/70">
            <span className="font-semibold text-white">★ {RESENAS_AGREGADO.rating}</span> ·{' '}
            {numero(RESENAS_AGREGADO.total)} {t('reviews · #1 on TripAdvisor for 7 years')}
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
          <p className="text-sm font-semibold text-white">{t('Payment methods')}</p>
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
            {t('Confirm with 25% online. The rest on the day of the tour. Cash on board works too.')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-white">{t('Language')}</p>
            <SelectorIdioma />
          </div>
          <div>
            <label htmlFor="footer-moneda" className="mb-2 block text-sm font-semibold text-white">
              {t('Currency')}
            </label>
            {/* [2026-08-25] Ya convierte de verdad, con el cambio del día
                (`lib/moneda.ts`). Cambiarla repinta el sitio entero, igual que
                el idioma. Una divisa sin tasa se deshabilita en vez de
                enseñarse: sin cambio real no hay nada que convertir. */}
            <select
              id="footer-moneda"
              value={moneda}
              onChange={(e) => fijaMoneda(e.target.value as Moneda)}
              className="rounded-btn border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {MONEDAS.map((m) => (
                <option key={m} value={m} disabled={!hayTasa(m)} className="text-navy">
                  {SIMBOLO[m]} {m}
                </option>
              ))}
            </select>
            {/* De cuándo es el cambio. Sin esta línea, un precio en pesos es un
                número sin procedencia — y el que se cobra sigue siendo el
                dólar, así que hay que poder comprobarlo. */}
            {moneda !== 'USD' ? (
              <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-white/50">
                {t('Approximate conversion')}
                {fecha ? ` · ${fecha.toLocaleDateString()}` : ''}. {t('You are charged in US dollars.')}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-contenido flex-col items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {t('Hispaniola Aquatic Adventures.')}</p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>
            <Link to="/legal/cancellation-policy" className="hover:text-white/70">
              {t('Cancellation policy')}
            </Link>
          </li>
          <li>
            <Link to="/legal/privacy" className="hover:text-white/70">
              {t('Privacy')}
            </Link>
          </li>
          <li>
            <Link to="/legal/terms" className="hover:text-white/70">
              {t('Terms')}
            </Link>
          </li>
          <li>
            <Link to="/legal/cookies" className="hover:text-white/70">
              {t('Cookies')}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
