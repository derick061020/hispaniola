import type { DocumentoLegal } from '@/data/legal'

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
          <strong className="font-semibold">Borrador de estructura, no un documento vinculante.</strong> Los apartados
          de abajo son los que se esperan de esta página; el texto legal real está pendiente de redacción con un
          abogado antes de publicar el sitio en producción.
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
