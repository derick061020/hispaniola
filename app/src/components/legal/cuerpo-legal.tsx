import type { BloqueLegal, DocumentoLegal } from '@/data/legal'
import { t } from '@/lib/i18n'

// Cuerpo de la plantilla legal — 2 variantes según `contenidoReal`:
// política de cancelación tiene texto real (compuesto de hechos ya vetados en
// el resto del sitio); privacidad/términos/cookies no tienen fuente que
// portar, así que llevan un aviso explícito en vez de fingir un documento
// legal completo que nadie ha revisado (ver data/legal.ts).
//
// [2026-10-30] Cancelación, Términos y Privacidad ya son el documento oficial
// HAA-LEG-002, y el PDF mezcla párrafos y listas dentro de una misma cláusula:
// cada sección pinta ahora sus `bloques` en orden (string = párrafo, array =
// lista con viñetas). Solo Cookies sigue siendo placeholder.
function Bloque({ bloque, real }: { bloque: BloqueLegal; real: boolean }) {
  const tono = real ? 'text-navy-sub' : 'italic text-navy-soft'
  if (typeof bloque === 'string') return <p className={`text-sm ${tono}`}>{bloque}</p>
  return (
    <ul className={`flex list-disc flex-col gap-1.5 pl-5 text-sm marker:text-navy-soft ${tono}`}>
      {bloque.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function CuerpoLegal({ doc }: { doc: DocumentoLegal }) {
  return (
    <div className="mx-auto max-w-3xl">
      {doc.intro ? <p className="text-lead text-navy-sub">{doc.intro}</p> : null}

      {!doc.contenidoReal ? (
        <div className="mt-6 rounded-card bg-coral/10 p-5 text-sm text-navy ring-1 ring-coral/30">
          <strong className="font-semibold">{t('A structural draft, not a binding document.')}</strong> {t('The sections below are the ones expected on this page; the actual legal text still has to be drafted with a lawyer before the site goes live in production.')}
        </div>
      ) : null}

      <div className={`flex flex-col gap-6 ${doc.intro || !doc.contenidoReal ? 'mt-8' : ''}`}>
        {doc.secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="font-display text-h3 font-semibold text-navy">{s.titulo}</h2>
            <div className="mt-2 flex flex-col gap-3">
              {s.bloques.map((b, i) => (
                <Bloque key={i} bloque={b} real={doc.contenidoReal} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
