import { TOURS } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="bg-navy px-5 pb-6 pt-14 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="!text-white" />
          <p className="mt-3 text-sm text-white/70">
            Plaza Bibijagua, Bávaro, RD.
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
                <EnlacePrototipo className="hover:text-white">{t.nombre}</EnlacePrototipo>
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
              <EnlacePrototipo className="hover:text-white">Nosotros</EnlacePrototipo>
            </li>
            <li>
              <EnlacePrototipo className="hover:text-white">Sostenibilidad</EnlacePrototipo>
            </li>
            <li>
              <EnlacePrototipo className="hover:text-white">Guías Punta Cana</EnlacePrototipo>
            </li>
            <li>
              <EnlacePrototipo className="font-semibold hover:text-white">Agentes de viaje</EnlacePrototipo>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-white/50">Reservas y ayuda</h5>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <li>
              <a href="#tours" className="hover:text-white">
                Reservar ahora
              </a>
            </li>
            <li>
              <EnlacePrototipo className="hover:text-white">Mi reserva</EnlacePrototipo>
            </li>
            <li>
              <EnlacePrototipo className="font-semibold hover:text-white">¿Por qué reservar directo?</EnlacePrototipo>
            </li>
            <li>
              <EnlacePrototipo className="hover:text-white">FAQ · Contacto</EnlacePrototipo>
            </li>
            <li>
              <a href="https://wa.me/18293052804" target="_blank" rel="noopener" className="hover:text-white">
                WhatsApp +1 829 305 2804
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-5 text-xs text-white/40">
        © {new Date().getFullYear()} Hispaniola Aquatic Adventures.
      </div>
    </footer>
  )
}
