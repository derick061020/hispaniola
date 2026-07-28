// Cabecera (eyebrow + H1 + lead) de las páginas internas de la tanda v2 —
// Tripulación, Flota e Instalaciones. Va DENTRO de HeroInterna, que es quien
// pone la caja, el vídeo y el header.
//
// [v2 2026-07-28, pedido de Samuel] Existe por dos motivos, los dos suyos:
//
//  1. EL BADGE YA NO VA EN AQUA. Las tres páginas escribían su eyebrow con
//     `text-aqua` (#0e8c9c) sobre el vídeo del hero — un teal oscuro sobre un
//     fondo oscuro: «están en un azul que casi ni se lee». Ahora es blanco
//     transparente, que se lee sobre cualquier fotograma del vídeo pase lo que
//     pase, y deja el acento aqua para donde sí funciona (sobre papel).
//     ⚠️ REGLA: ese aqua NO se usa en NINGÚN hero. El resto del sitio ya usa
//     `Etiqueta sobreOscuro` (aqua-claro, #a9e5ee — pálido, sí legible), que
//     es otra cosa y se queda como está.
//  2. EL H1 LLEVA `text-balance`. Todas las cabeceras del sitio
//     (components/*/cabecera-*.tsx) ya lo tenían; estas tres, escritas a mano
//     en la página, se lo habían saltado y partían el título dejando una
//     palabra suelta en la última línea.
//
// Estaba triplicado literal en las tres páginas, que es justamente cómo se
// coló el mismo fallo tres veces. Un solo sitio donde arreglarlo, y un solo
// componente en Figma.
export function CabeceraInterna({
  eyebrow,
  titulo,
  lead,
}: {
  eyebrow: string
  titulo: string
  lead: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{eyebrow}</p>
      <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-white sm:text-5xl">
        {titulo}
      </h1>
      <p className="mt-4 text-lg text-white/85">{lead}</p>
    </div>
  )
}
