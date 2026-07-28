import { Link } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { ExperienciaABordo } from '@/components/nosotros/experiencia-abordo'
import { Meta } from '@/components/seo/meta'
import { INSTALACIONES, ZONAS } from '@/data/instalaciones'

// Página Instalaciones (/instalaciones) — correcciones v2, plan 06.
//
// Página de CREDIBILIDAD: enseña que detrás del tour hay laboratorio, museo,
// cocinas propias y oficinas. Cualquiera dice que restaura coral; tener
// laboratorio propio es verificable.
//
// ✅ El copy de las 6 zonas es REAL (lo escribió el cliente).
// ⚠️ Las fotos son PLACEHOLDER repetidas del repo — no hay ni una foto de las
//    instalaciones en tierra. Ver data/instalaciones.ts.
// ⚠️ El 360° NO se falsea: sin material, no se pinta el botón. Un «Ver en 360°»
//    que abre una foto normal promete algo que no cumple.
//
// El zigzag alternando lado reutiliza el patrón que el proyecto ya resolvió en
// `sostenibilidad/recorrido-sostenibilidad.tsx` — no se inventa otro layout.
//
// Una sola banda de CTA (la del cierre), no las tres que dibujaba la maqueta:
// tres CTA idénticos en una página de 6 secciones es demasiado y los tres
// decían lo mismo con distinto color de fondo.
export function InstalacionesPage() {
  return (
    <div>
      <Meta
        titulo="Instalaciones"
        descripcion="Un complejo completo en Punta Cana: museo marino al aire libre, laboratorio de biología, cocinas propias, tienda y oficinas."
        ruta="/instalaciones"
      />
      <HeroInterna ctaHref="/#tours">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            {INSTALACIONES.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            {INSTALACIONES.titulo}
          </h1>
          <p className="mt-4 text-lg text-white/85">{INSTALACIONES.lead}</p>
        </div>
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-navy">
            {INSTALACIONES.seccionTitulo}
          </h2>
          <p className="mt-3 text-lg text-navy/70">{INSTALACIONES.seccionLead}</p>
        </div>

        <p className="mt-6 rounded-lg border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-navy">
          <strong>Fotos de ejemplo.</strong> Las imágenes de estas zonas son marcadores de posición
          hasta que lleguen las fotos reales del complejo.
        </p>

        <div className="mt-12 flex flex-col gap-16 lg:gap-24">
          {ZONAS.map((z, i) => (
            <article
              key={z.id}
              className={`flex flex-col gap-8 lg:items-center ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              <div className="lg:w-1/2">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src={`/fotos/${z.foto}.webp`}
                    alt={z.fotoAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="font-display text-2xl font-semibold text-navy">{z.nombre}</h3>
                <p className="mt-3 text-navy/70">{z.descripcion}</p>
                <ul className="mt-5 flex flex-col gap-2 border-t border-linea pt-5">
                  {z.bullets.map((b) => (
                    <li key={b} className="text-sm text-navy/80">
                      {b}
                    </li>
                  ))}
                </ul>
                {/* El botón de 360° solo existe si hay material. Sin `tour360`
                    no se pinta nada — ausencia silenciosa, no un botón muerto. */}
                {z.tour360 ? (
                  <a
                    href={z.tour360}
                    className="mt-5 inline-flex text-sm font-semibold text-aqua underline"
                  >
                    Ver en 360°
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {/* [v2 2026-07-27] «Un día de mar, cuidado al detalle» se REUBICA aquí
            desde /nosotros, que desaparece. Encaja: esta página cuenta lo que
            hay EN TIERRA detrás de la experiencia, y esta franja cuenta cómo se
            traduce eso a bordo — el complejo y el día de mar son las dos
            mitades del mismo argumento. Sin esto se habría perdido con la
            página. ⚠️ Colocación provisional, pendiente del reparto final. */}
        <div className="mt-20">
          <ExperienciaABordo />
        </div>

        <div className="mt-20 rounded-2xl bg-navy px-6 py-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-white">
            {INSTALACIONES.cierreTitulo}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{INSTALACIONES.cierreTexto}</p>
          <Link
            to="/#tours"
            className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {INSTALACIONES.cierreCta}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
