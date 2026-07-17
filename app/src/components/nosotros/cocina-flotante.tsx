import { COCINA_FLOTANTE } from '@/data/nosotros'

// Cocina flotante — el diferenciador único (2026-07-17, pedido de Samuel):
// "casi nos olvidamos de mencionar el hecho de que Hispaniola es la única
// empresa de excursiones en toda la República Dominicana que tiene una
// cocina flotante" (about-hispaniola.php?lang=es). Merece su propio momento
// grande, no una card más del grid de flota — mismo idioma visual que
// internas/tambien-te-gusta.tsx (foto real a sangre + gradiente + texto
// encima), sin el <Link> de esa pieza: aquí no se navega a ningún sitio,
// es puramente informativo. Foto REAL descargada de la web actual
// (cocina-flotante.webp ← images/food/kitchen.jpg — ver cabecera de
// data/nosotros.ts), no una de nuestra galería genérica.
export function CocinaFlotante() {
  return (
    <section className="relative flex h-tambien-alto items-end overflow-hidden rounded-card-grande">
      <img
        src={`/fotos/${COCINA_FLOTANTE.foto}.webp`}
        alt={COCINA_FLOTANTE.fotoAlt}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent" />
      <div className="relative z-10 p-6 text-white sm:p-8">
        <h2 className="max-w-xl font-display text-h2 font-semibold">{COCINA_FLOTANTE.titulo}</h2>
        <p className="mt-3 max-w-xl text-lead text-white/85">{COCINA_FLOTANTE.texto}</p>
      </div>
    </section>
  )
}
