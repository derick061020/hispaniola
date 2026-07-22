import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Boton } from '@/components/ui/boton'
import { TIPS_GUIAS, GUIAS_CIERRE } from '@/data/guias'

// El contenido REAL de la página — portado de tips-for-punta-cana-
// snorkeling-and-sailing.php?lang=es, la página que este /guias reemplaza.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-22, "Guías de Punta Cana - Ajustes web"
// .pdf). La maqueta del cliente pide un formato tipo revista: cada guía es una
// FILA con su foto al lado, y las filas ALTERNAN el lado de la foto (izq/der/
// izq/der). Estructura por fila: eyebrow de categoría → pregunta (h3) → frase-
// resumen en negrita (lead) → cuerpo → dato destacado (stat) → CTAs. Cierra
// con el bloque "Más guías en camino".
//
// VUELTA DE DISEÑO (pedido de Samuel: "que no se vea IA, pero estructuralmente
// como el PDF"). Los bloques de color plano con un número gigante de la maqueta
// se cambian por FOTOS REALES con un tratamiento editorial: scrim inferior,
// el numeral de la serie (01–04) y un pie de foto (nombre del barco / lugar)
// montados sobre la imagen como en una revista — no un placeholder. El "dato"
// deja la píldora verde de plantilla por un pull-stat sobre hairline (cifra en
// aqua sobre línea fina), más acorde a la dirección "Charter Premium". El
// ritmo lo marca el blanco entre filas, no cajas. El reveal de scroll
// (`.guias-reveal`) vive en use-guias-reveal.ts, enganchado una vez desde la
// página (guias.tsx); cada fila entra por su cuenta al cruzar el umbral.
export function TipsRapidos() {
  return (
    <section>
      <Etiqueta className="guias-reveal">Antes de reservar</Etiqueta>
      <h2 className="guias-reveal mt-3 max-w-2xl text-balance font-display text-h3 font-semibold text-navy">
        Lo que más preguntan sobre esnórquel y navegación en Punta Cana
      </h2>

      <div className="mt-14 flex flex-col gap-16 sm:mt-16 sm:gap-24">
        {TIPS_GUIAS.map((t, i) => {
          const numero = String(i + 1).padStart(2, '0')
          const fotoDerecha = i % 2 === 1 // filas pares (02, 04): foto a la derecha en desktop
          return (
            <article
              key={t.pregunta}
              className="guias-reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              {/* Foto — en el DOM va primero; en desktop se manda a la columna
                  derecha en las filas pares con order, para el zigzag. */}
              <figure className={`relative m-0 ${fotoDerecha ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-card-grande shadow-card ring-1 ring-navy/5">
                  <img
                    src={`/fotos/${t.foto}.webp`}
                    alt={t.fotoAlt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  {/* Scrim inferior: hace legibles el numeral y el pie sobre
                      cualquier foto (mismo recurso que el hero interno). */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/5"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, var(--color-overlay-foto) 100%)',
                    }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5">
                    <span className="font-display text-h2 font-semibold leading-none text-white/90" aria-hidden="true">
                      {numero}
                    </span>
                    <span className="pb-0.5 text-sm font-medium text-white/85">{t.fotoPie}</span>
                  </figcaption>
                </div>
              </figure>

              {/* Texto */}
              <div className="lg:max-w-xl">
                <Etiqueta>{t.categoria}</Etiqueta>
                <h3 className="mt-3 text-balance font-display text-h3 font-semibold text-navy">
                  {t.pregunta}
                </h3>
                <p className="mt-3 text-lead font-semibold text-navy">{t.lead}</p>
                <p className="mt-3 text-base leading-relaxed text-navy-sub">{t.respuesta}</p>

                {/* Dato destacado — pull-stat sobre hairline, no píldora. */}
                <div className="mt-6 flex items-baseline gap-4 border-t border-linea pt-5">
                  <span className="shrink-0 font-display text-stat font-semibold text-aqua-dark">
                    {t.stat.valor}
                  </span>
                  <span className="text-sm text-navy-sub">{t.stat.texto}</span>
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Boton to={t.ctaPrimario.to}>{t.ctaPrimario.texto}</Boton>
                  {t.ctaEnlace ? (
                    <Link
                      to={t.ctaEnlace.to}
                      className="text-sm font-semibold text-aqua-dark hover:underline"
                    >
                      {t.ctaEnlace.texto} →
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Cierre — "Más guías en camino". Banner CTA de dos columnas (pedido de
          Samuel: "que sea como los banner de newsletter que tenemos, texto a
          la izquierda botón a la derecha, mismo fondo, mismo tipo de texto")
          — mismo fondo (footer-oceano.webp + --color-overlay-footer +
          degradado hacia navy) y misma tipografía (Etiqueta sobreOscuro + h2
          blanco + párrafo white/80) que el banner Newsletter del blog
          (components/blog/lista-articulos.tsx). Reemplaza la 1ª versión de
          este cierre (bg-papel-hueso, numeral "05" centrado) — ese numeral
          fantasma competía visualmente con el de las 4 filas de arriba en
          vez de leerse como remate. Aquí el botón ocupa el lugar del form de
          la newsletter (esto es un CTA de una sola acción, no una captura de
          email). */}
      <section className="guias-reveal relative mt-16 overflow-hidden rounded-card-grande bg-navy px-6 py-8 sm:mt-24 sm:px-10">
        <div aria-hidden="true" className="absolute inset-0">
          <img
            src="/fotos/footer-oceano.webp"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0" style={{ background: 'var(--color-overlay-footer)' }} />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, var(--color-navy) 30%, transparent 85%)' }}
          />
        </div>

        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <Etiqueta sobreOscuro>Guías</Etiqueta>
            <h2 className="mt-2 text-balance font-display text-h3 font-semibold text-white sm:text-h2">
              {GUIAS_CIERRE.titulo}
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">{GUIAS_CIERRE.texto}</p>
          </div>

          <Boton to={GUIAS_CIERRE.cta.to} className="w-full lg:w-auto">
            {GUIAS_CIERRE.cta.texto}
          </Boton>
        </div>
      </section>
    </section>
  )
}
