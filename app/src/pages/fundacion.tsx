import { Link } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Meta } from '@/components/seo/meta'

// Página de la Fundación (/fundacion) — correcciones v2, plan 08 §3.
//
// ⚠️⚠️ RUTA EN SINGULAR, A PROPÓSITO. `/fundaciones` (PLURAL) es OTRA COSA: la
// página interna de tokens del proyecto (pages/fundaciones.tsx), la que
// documenta la paleta para el traspaso a Figma. Se diferencian en UNA letra —
// decisión de Samuel del 2026-07-26 para no perder esa herramienta. Ver el
// aviso cruzado en App.tsx.
//
// El contenido institucional (fundadores, 2016, el tercer vivero del país, el
// convenio con Medio Ambiente) es CONTENIDO REAL y NUEVO del cliente: sale del
// slide 62 de su PowerPoint. Explica de dónde viene el «proyecto top-3 del
// país» que el sitio ya afirmaba en arrecife-teaser.tsx sin justificar.
//
// Los 5 proyectos (slide 63) son el mejor contenido de todo el PowerPoint: son
// específicos y verificables. «Peces loro, langostas, capitanes, pargos» no lo
// escribe una IA genérica — lo escribe alguien que trabaja ahí.

// ⚠️ Pendiente de confirmar con el cliente: el nombre de la entidad. Hoy
// conviven CUATRO en sus materiales — «Fundación Ecológica Arrecifes de
// Bávaro», «Bávaro Reefs Foundation», «Fundación The Bávaro Reef» y
// «Fundación» a secas. Aquí se usa el nombre legal en español para el bloque
// institucional; hay que fijar un alias corto para el resto del sitio.
const FUNDACION = {
  nombreLegal: 'Fundación Ecológica Arrecifes de Bávaro',
  historia: [
    'Nace de la pasión compartida por el medio ambiente de Fernando Sánchez Fernández y Manuel Alejandro Redondo, con el respaldo de Hispaniola Aquatic Adventures, cuya operación en Playa Bávaro fue testigo del deterioro de los ecosistemas marinos por el crecimiento del turismo.',
    'Ante la alarmante pérdida de arrecifes, en 2016 se inició un ambicioso proyecto de restauración coralina y construcción de arrecifes artificiales, en colaboración con el Ministerio de Medio Ambiente — hoy reconocido como el tercer vivero de coral más importante del país.',
  ],
  hitos: [
    { cifra: '2016', texto: 'inicio del proyecto' },
    { cifra: '3er', texto: 'vivero de coral del país' },
    { cifra: 'Aliados', texto: 'Ministerio de Medio Ambiente' },
  ],
  proyectoDestacado: {
    titulo: 'Arrecifes artificiales',
    texto:
      'Crear las condiciones ecológicas necesarias para la restauración y el desarrollo de arrecifes coralinos, a través de la vigilancia y protección ambiental.',
  },
  proyectos: [
    {
      titulo: 'Restaurar la cobertura viva de coral',
      texto:
        'Rescate de fragmentos de oportunidad, trasplante desde viveros y siembra por fragmentación in-situ en puntos importantes.',
    },
    {
      titulo: 'Aumentar especies clave',
      texto:
        'Recuperar poblaciones ecológicamente importantes: peces loro, langostas, capitanes, pargos y otras.',
    },
    {
      titulo: 'Saneamiento del área',
      texto:
        'Programa de limpieza de Bávaro/Punta Cana con jornadas de recolección de residuos sólidos.',
    },
    {
      titulo: 'Alternativas para pescadores',
      texto:
        'Métodos de pesca sustentables que resuelven conflictos comunitarios y los integran a la conservación.',
    },
    {
      titulo: 'Fomentar el ecoturismo',
      texto:
        'Actividades y campañas de educación ambiental con clientes, centros educativos y comerciantes de la zona.',
    },
  ],
} as const

export function FundacionPage() {
  return (
    <div>
      <Meta
        titulo="La Fundación"
        descripcion="Fundación Ecológica Arrecifes de Bávaro: restauración coralina y arrecifes artificiales desde 2016, en colaboración con el Ministerio de Medio Ambiente."
        ruta="/fundacion"
      />
      <HeroInterna ctaHref="/sostenibilidad">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            Nuestra fundación
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            {FUNDACION.nombreLegal}
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Cuidar los arrecifes empieza con las personas.
          </p>
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
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-linea p-6">
              {FUNDACION.hitos.map((h) => (
                <div key={h.cifra}>
                  <p className="font-display text-3xl font-semibold text-navy">{h.cifra}</p>
                  <p className="text-sm text-navy/60">{h.texto}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
              Proyectos sostenibles
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Cuidar los arrecifes empieza con las personas
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-navy/70">
              Impulsamos acciones que conectan a la comunidad con la conservación: educación,
              voluntariado y experiencias reales que transforman conciencia en impacto.
            </p>

            <div className="mt-10 rounded-2xl bg-navy p-8">
              <h3 className="font-display text-2xl font-semibold text-white">
                {FUNDACION.proyectoDestacado.titulo}
              </h3>
              <p className="mt-3 max-w-2xl text-white/80">
                {FUNDACION.proyectoDestacado.texto}
              </p>
            </div>

            {/* Patrón «editorial de listas apiladas» de la casa: numeral
                fantasma + hairline, cero cards con ring. Es la 4ª vez que
                aparece en el proyecto (Nosotros → Sostenibilidad → Guías → esta)
                y ya está documentado en los Aprendizajes del cerebro como la
                cura del olor a «esto es solo cajas». La maqueta del cliente lo
                pintaba como cards con ring — se usa el patrón de la casa. */}
            <ol className="mt-10 divide-y divide-linea border-t border-linea">
              {FUNDACION.proyectos.map((p, i) => (
                <li key={p.titulo} className="relative pb-8 pt-10">
                  <span
                    className="pointer-events-none absolute -top-1 left-0 font-display text-7xl font-semibold leading-none"
                    style={{ color: 'color-mix(in srgb, var(--color-aqua) 14%, transparent)' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="relative pl-4">
                    <h3 className="font-display text-xl font-semibold text-navy">{p.titulo}</h3>
                    <p className="mt-2 max-w-2xl text-navy/70">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Membresías: el botón «Quiero apoyar la fundación» de la maqueta
              tiene que llevar a algún sitio. Hoy no hay niveles definidos ni
              pasarela (mismo bloqueo Odoo que el resto de pagos), así que
              lleva a /contacto en vez de prometer una página que no existe.
              Cuando el cliente defina niveles y precios, se sustituye. */}
          <section className="rounded-2xl border border-linea px-6 py-10 text-center">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Conoce nuestras membresías
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-navy/70">
              Cada aporte cuenta. Al unirte, apoyas iniciativas que protegen nuestros ecosistemas y
              educan a futuras generaciones.
            </p>
            <Link
              to="/contacto"
              className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Quiero apoyar la fundación
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
