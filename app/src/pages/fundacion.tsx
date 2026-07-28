import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Meta } from '@/components/seo/meta'
import { FUNDACION } from '@/data/fundacion'

// Página de la Fundación (/fundacion) — correcciones v2, plan 08 §3-§5
// (slides 62-64). El copy y las notas de procedencia viven en
// data/fundacion.ts.
//
// ⚠️⚠️ RUTA EN SINGULAR, A PROPÓSITO. `/fundaciones` (PLURAL) es OTRA COSA: la
// página interna de tokens del proyecto (pages/fundaciones.tsx), la que
// documenta la paleta para el traspaso a Figma. Se diferencian en UNA letra —
// decisión de Samuel del 2026-07-26 para no perder esa herramienta. Ver el
// aviso cruzado en App.tsx.
//
// [v2 2026-07-28] Las secciones estrenan `id` (`proyectos`, `membresias`):
// son el destino de dos de los 7 chips de anclas de /ventaja-competitiva
// (slide 58) — ese contenido vive aquí, así que esos chips son enlaces con
// hash, no anclas locales. Si se renombra un id, hay que tocar
// ANCLAS_VENTAJA en data/sostenibilidad.ts.
export function FundacionPage() {
  return (
    <div>
      <Meta
        titulo="La Fundación"
        descripcion="Fundación Ecológica Arrecifes de Bávaro: restauración coralina y arrecifes artificiales desde 2016, en colaboración con el Ministerio de Medio Ambiente."
        ruta="/fundacion"
      />
      <HeroInterna ctaHref="/ventaja-competitiva">
        <div className="max-w-3xl">
          <Etiqueta sobreOscuro>{FUNDACION.teaserEyebrow}</Etiqueta>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            {FUNDACION.nombreLegal}
          </h1>
          <p className="mt-4 text-lg text-white/85">Cuidar los arrecifes empieza con las personas.</p>
        </div>
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div className="flex flex-col gap-4">
              {FUNDACION.historia.map((p) => (
                <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-navy/80">
                  {p}
                </p>
              ))}

              {/* Los 3 hitos en fila: ni las 3 cards con ring de la maqueta
                  ni hairlines (Samuel 2026-07-28: «al cliente no le gusta
                  tanta línea»). Los agrupa una SUPERFICIE papel-hueso, plana
                  y sin borde — mismo recurso que la banda de impacto y el
                  teaser de /ventaja-competitiva, para que las dos páginas
                  hablen el mismo idioma. */}
              <div className="mt-8 grid grid-cols-3 gap-4 rounded-card bg-papel-hueso p-6">
                {FUNDACION.hitos.map((h) => (
                  <div key={h.cifra}>
                    <p className="font-display text-h3 font-semibold text-aqua-dark">{h.cifra}</p>
                    <p className="mt-1 text-sm text-navy-soft">{h.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* «LOS FUNDADORES» (slide 62). Quién está detrás es un dato
                institucional y se lee como ficha, no como 3 tarjetas sueltas
                — así que va agrupado, pero con SUPERFICIE en vez de con
                líneas (2026-07-28): fuera el borde del marco Y fuera las
                divisorias entre las 3 filas. Dos líneas menos y el bloque
                sigue leyéndose como una unidad. */}
            <div className="rounded-card bg-papel-hueso p-6">
              <Etiqueta>Los fundadores</Etiqueta>
              <ul className="mt-4 flex flex-col gap-4">
                {FUNDACION.fundadores.map((f) => (
                  <li key={f.nombre}>
                    <p className="font-display text-base font-semibold text-navy">{f.nombre}</p>
                    <p className="mt-0.5 text-sm text-navy-soft">{f.rol}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="proyectos" className="scroll-mt-header-alto">
            <Etiqueta>{FUNDACION.proyectosEyebrow}</Etiqueta>
            <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
              {FUNDACION.proyectosTitulo}
            </h2>
            <p className="mt-3 max-w-2xl text-lead text-navy-sub">{FUNDACION.proyectosLead}</p>

            <div className="mt-10 rounded-card bg-navy p-8">
              <h3 className="font-display text-h3 font-semibold text-white">
                {FUNDACION.proyectoDestacado.titulo}
              </h3>
              <p className="mt-3 max-w-2xl text-white/80">{FUNDACION.proyectoDestacado.texto}</p>
            </div>

            {/* Patrón «editorial de listas apiladas» de la casa: numeral
                fantasma + hairline, cero cards con ring. Es la 4ª vez que
                aparece en el proyecto (Nosotros → Sostenibilidad → Guías →
                esta) y ya está documentado en los Aprendizajes del cerebro
                como la cura del olor a «esto es solo cajas». La maqueta del
                cliente lo pintaba como cards con ring — se usa el patrón de
                la casa. */}
            <ol className="mt-10 divide-y divide-linea border-t border-linea">
              {FUNDACION.proyectos.map((p, i) => (
                <li key={p.titulo} className="relative pb-8 pt-10">
                  <p className="sost-numero" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <div className="relative">
                    <h3 className="sost-item-titulo font-display text-h3 font-semibold text-navy">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 max-w-2xl text-navy-sub">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            id="membresias"
            className="scroll-mt-header-alto rounded-card border border-linea px-6 py-10 text-center"
          >
            <h2 className="font-display text-h3 font-semibold text-navy">
              {FUNDACION.membresiasTitulo}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-sub">{FUNDACION.membresiasTexto}</p>
            {/* A /contacto pelado, sin `?asunto=` — /contacto no lee query
                params hoy (a diferencia de /trabaja-con-nosotros, que sí con
                `?perfil=`). Precargar el asunto pide un campo nuevo en ese
                formulario: se hará cuando el cliente defina qué son las
                membresías, junto con los niveles y el cobro. */}
            <Boton to="/contacto" className="mt-6">
              {FUNDACION.membresiasCta}
            </Boton>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
