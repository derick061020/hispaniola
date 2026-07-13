// "No es otro party boat" — diferenciadores reales frente al resto del
// mercado (benchmark de competencia). Foto real de coral/snorkel (no stock).
const BENEFICIOS = [
  { titulo: 'Coral vivo, no piscina de show', texto: 'Snorkel en uno de los 3 mayores proyectos de restauración de coral de RD, con bióloga marina a bordo.' },
  { titulo: 'Cocina flotante', texto: 'Comida preparada al momento en el barco — pescado del Caribe y Angus certificado.' },
  { titulo: 'Barcos a media capacidad', texto: 'Reservamos máximo el 35% del aforo permitido. Espacio, no multitud.' },
  { titulo: 'Eco / cero plástico', texto: 'Coco-loco en coco real. Nada de vasos desechables.' },
]

export function Diferenciadores() {
  return (
    <section className="px-5 py-16 sm:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-card">
          <img
            src="/fotos/galeria-snorkel-lovers-6.webp"
            alt="Snorkel sobre un arrecife de coral vivo, rodeado de peces"
            className="h-72 w-full object-cover sm:h-96"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">La diferencia Hispaniola</p>
          <h2 className="mt-2 font-display text-h2 font-semibold text-navy">No es otro party boat</h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo}>
                <p className="font-display text-base font-semibold text-navy">{b.titulo}</p>
                <p className="mt-1 text-sm text-navy-soft">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
