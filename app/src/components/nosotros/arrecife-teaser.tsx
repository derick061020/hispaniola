import { Link } from 'react-router-dom'
import { NOSOTROS } from '@/data/nosotros'

// Mención sin detalles + botón a Sostenibilidad (2026-07-17, decisión de
// Samuel): desde que Sostenibilidad es tab propio, Nosotros no vuelve a
// contar la historia del arrecife — solo la menciona y manda para allá.
// Mismo criterio que el ítem "El arrecife que reconstruimos" del dropdown
// Nosotros del header (data/home.ts → NAV_NOSOTROS).
//
// Foto de fondo (2026-07-17, pedido de Samuel: "ponle una imagen fundida de
// fondo para darle más diseño"). 6ª vuelta: "usa otra imagen, usa una
// imagen de stock del océano Caribeño vista cenital" — sustituimos la foto
// del vivero de coral real por una cenital genérica de agua turquesa
// caribeña (stock, sin marca de agua, /fotos/arrecife-fondo-cenital.webp —
// 2400x1200, crop 2/3 superior de la original para quedarnos solo con la
// zona de agua). Cubre toda la sección a sangre, con un gradiente navy
// encima — más cargado a la izquierda, donde vive el texto (max-w-2xl), y
// abriendo hacia la derecha para que se vea más mar. Mismo idioma visual
// que cocina-flotante.tsx y tambien-te-gusta.tsx (foto + gradiente + texto
// encima). La foto es decorativa (el texto ya cuenta el arrecife): alt=""
// + aria-hidden para que screen readers no la lean dos veces.
export function ArrecifeTeaser() {
  return (
    <section className="relative overflow-hidden rounded-card p-8 sm:p-10">
      <img
        src={`/fotos/${NOSOTROS.arrecifeFoto}.webp`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/35" />
      <div className="relative">
        <h2 className="max-w-2xl font-display text-h3 font-semibold text-white">{NOSOTROS.arrecifeTitulo}</h2>
        <p className="mt-3 max-w-2xl text-lead text-white/85">{NOSOTROS.arrecifeTexto}</p>
        <Link
          to="/sostenibilidad"
          className="mt-6 inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark"
        >
          {NOSOTROS.arrecifeCta}
        </Link>
      </div>
    </section>
  )
}
