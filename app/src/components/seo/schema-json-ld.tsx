// Renderiza un bloque JSON-LD. Los datos SIEMPRE vienen de src/lib/seo/schema.ts
// (derivados de src/data/*.ts, nunca inventados) — nunca de input de usuario,
// así que JSON.stringify es seguro; el escape de "</" es solo defensivo
// (evita que un valor con esa secuencia cierre el <script> antes de tiempo).
type Props = { datos: Record<string, unknown> }

export function SchemaJsonLd({ datos }: Props) {
  const json = JSON.stringify(datos).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
