import type { DocumentoLegal } from '@/data/legal'
import { t } from '@/lib/i18n'

// Cuerpo de la plantilla legal — 2 variantes según `contenidoReal`:
// política de cancelación tiene texto real (compuesto de hechos ya vetados en
// el resto del sitio); privacidad/términos/cookies no tienen fuente que
// portar, así que llevan un aviso explícito en vez de fingir un documento
// legal completo que nadie ha revisado (ver data/legal.ts).
export function CuerpoLegal({ doc }: { doc: DocumentoLegal }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-lead text-navy-sub">{doc.intro}</p>

      {!doc.contenidoReal ? (
        <div className="mt-6 rounded-card bg-coral/10 p-5 text-sm text-navy ring-1 ring-coral/30">
          <strong className="font-semibold">{t('A structural draft, not a binding document.')}</strong> {t('The sections below are the ones expected on this page; the actual legal text still has to be drafted with a lawyer before the site goes live in production.')}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-6">
        {doc.secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="font-display text-h3 font-semibold text-navy">{s.titulo}</h2>
            <p className={`mt-2 text-sm ${doc.contenidoReal ? 'text-navy-sub' : 'italic text-navy-soft'}`}>{s.texto}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
