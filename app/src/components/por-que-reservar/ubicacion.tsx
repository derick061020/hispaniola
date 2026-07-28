import { Check } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { UBICACION } from '@/data/por-que-reservar'

// «Ubicación, ubicación, ubicación» — slide 56, primera mitad.
//
// Es el único contenido REALMENTE nuevo del PowerPoint: el argumento de la
// ubicación como ventaja competitiva no estaba dicho en ninguna parte del
// sitio, y «no pierdes hora y media en bus antes de empezar» contesta una
// objeción real de comprador que hoy no contesta nadie.
//
// El «1½ h» sale de la lista y se convierte en una ficha que monta sobre la
// foto: es el dato que hace el trabajo de toda la sección, y dentro de un
// párrafo pasaría desapercibido. Sólo monta a partir de sm — en móvil va en
// flujo, debajo de la foto, porque una ficha colgando de la esquina en una
// pantalla de 390px se sale o tapa la imagen.
//
// La foto es la vista aérea real del arrecife (arrecifeFoto de data/nosotros),
// no un mapa: la maqueta pide «foto/dron: Cabeza de Toro · Cabo Engaño» y el
// archivo la tiene.
//
// La banda verde de «huella positiva» que su maqueta ponía aquí NO se repite:
// es literalmente el cierre de /sostenibilidad. Duplicar copy entre dos
// páginas es malo para SEO y peor de mantener — se enlaza en su lugar.
export function Ubicacion() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="relative">
        <div className="overflow-hidden rounded-card-grande bg-papel-hueso shadow-card">
          <img
            src={`/fotos/${UBICACION.foto}.webp`}
            alt={UBICACION.fotoAlt}
            loading="lazy"
            className="aspect-[4/3] size-full object-cover"
          />
        </div>
        <p className="absolute left-4 top-4 rounded-chip bg-navy/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Cabeza de Toro · Cabo Engaño
        </p>

        <div className="mt-4 w-fit rounded-card bg-papel px-5 py-4 shadow-card-flotante ring-1 ring-linea sm:absolute sm:-bottom-7 sm:right-6 sm:mt-0">
          <p className="font-display text-3xl font-semibold leading-none text-coral">
            {UBICACION.cifra}
          </p>
          <p className="mt-1.5 max-w-[13rem] text-xs leading-snug text-navy-sub">
            {UBICACION.cifraLabel}
          </p>
        </div>
      </div>

      <div>
        <Etiqueta>{UBICACION.eyebrow}</Etiqueta>
        <h2 className="mt-2 text-balance font-display text-h2 font-semibold text-navy">
          {UBICACION.titulo}
        </h2>
        <p className="mt-4 text-lead text-navy-sub">{UBICACION.texto}</p>

        <ul className="mt-6 flex flex-col gap-3 border-t border-linea pt-6">
          {UBICACION.claves.map((c) => (
            <li key={c} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-aqua-dark" strokeWidth={2.5} aria-hidden="true" />
              <span className="text-sm text-navy-sub">{c}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7">
          <Boton to="/#tours">Ver los tours</Boton>
        </div>
      </div>
    </section>
  )
}
