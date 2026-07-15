import { OCASIONES } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Etiqueta } from '@/components/ui/etiqueta'

// Megamenú Eventos — v3-F14 (PLAN-v3.md §16): antes 2 landings en cards +
// 4 ocasiones en texto plano con una divisoria vertical — el único menú del
// sitio sin una sola imagen, vendiendo lo más visual del negocio (una boda en
// un barco). Ahora foto editorial (columna izquierda) + lista con thumbnail
// (columna derecha): mismo lenguaje que el megamenú de Tours (foto + texto),
// sin la jerarquía landing/no-landing en el LAYOUT — esa distinción (destino
// propio vs. formulario del hub) es asunto de a dónde navega cada ítem, no de
// cómo se ve en el menú (§16.2).
export function MegaEventos() {
  return (
    // Mismo ajuste que MegaTours: angosto entre md y xl para no tapar el
    // logo/Reservar del notch centrado. Entre md y xl la columna de la foto se
    // OCULTA (xl:flex en vez de flex): a 448px de panel la foto grande solo
    // estorbaría — queda la lista sola, que con los thumbnails ya no es "puro
    // texto" (§16.4).
    //
    // Desde xl: 55rem (880px, antes 40rem/640px) — el mismo ancho que MegaTours,
    // ya verificado sin solape con el logo/Reservar a 1280px. El panel crece a lo
    // ANCHO para dejar de crecer a lo ALTO: con las 6 ocasiones en 2 columnas
    // (abajo) el menú pasa de 6 filas a 3, y la foto —que ocupa el alto de la
    // lista— deja de ser un rectángulo de pie y se acerca al cuadrado.
    <div className="grid w-[min(92vw,28rem)] grid-cols-1 gap-4 p-4 xl:w-[min(92vw,55rem)] xl:grid-cols-[1fr_2fr]">
      <div className="relative hidden overflow-hidden rounded-card xl:flex xl:flex-col xl:justify-end">
        {/* Foto decorativa: el contenido está en el texto de encima, no en
            la imagen. galeria-charter-privado-4 — la más escénica de la
            galería (catamarán fondeado frente a playa de palmeras), ya
            usada en la pila de fotos de GaleriaFaqCierre. */}
        <img
          src="/fotos/galeria-charter-privado-4.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        {/* Overlay obligatorio: sin él el texto blanco muere contra la playa
            clara y el casco blanco del barco. Los stops estaban calculados
            para la foto ALTA (columna de pie): al volverse una caja (~1.1:1)
            el bloque de texto pasó a ocupar la mitad del alto y su primera
            línea caía sobre las palmeras iluminadas, ya fuera del gradiente.
            Ahora el pie está OSCURO DEL TODO desde el 60% (donde empieza el
            texto), no degradando hasta el borde — ver --color-overlay-foto. */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 5%, var(--color-overlay-foto) 60%)' }}
        />
        <div className="relative p-4">
          <Etiqueta sobreOscuro>Eventos privados</Etiqueta>
          <p className="mt-2 text-sm text-white/90">
            Charter completo con comida, barra libre y coordinación. Hasta 120 personas.
          </p>
          <EnlacePrototipo className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline">
            Pedir cotización →
          </EnlacePrototipo>
        </div>
      </div>

      {/* Las 6 ocasiones en 2 columnas desde xl (3 filas en vez de 6): es lo que
          baja la altura del menú. Debajo de xl sigue en 1 columna — a 448px de
          panel, dos ítems por fila dejarían el texto en un canal tan estrecho
          que la meta se partiría en 4 líneas y la fila crecería MÁS que en una
          sola columna. */}
      <div className="grid grid-cols-1 gap-1 xl:grid-cols-2 xl:gap-x-2">
        {OCASIONES.map((o) => (
          <EnlacePrototipo
            key={o.tipo}
            className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-papel-hueso"
          >
            {/* El zoom vive DENTRO de un contenedor con overflow-hidden, no en
                el <img> suelto: escalando la imagen directamente crecería su
                caja entera y se comería el gap con el texto. Misma mecánica
                que la foto de TourCard y del megamenú de Tours — el hover de
                una foto es un zoom, no un salto. */}
            <span className="size-16 shrink-0 overflow-hidden rounded-lg bg-papel-hueso">
              <img
                src={`/fotos/${o.foto}.webp`}
                alt=""
                aria-hidden="true"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold text-navy transition-colors group-hover:text-aqua-dark">
                {o.nombre}
              </span>
              <span className="mt-0.5 block text-xs text-navy-soft">{o.meta}</span>
            </span>
          </EnlacePrototipo>
        ))}
      </div>
    </div>
  )
}
