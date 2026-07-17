import { Users, CalendarCheck, Smile } from 'lucide-react'

// Barra de KPIs de confianza (2026-07-17, pedido de Samuel), debajo del
// mosaico de fotos — mismo lugar que la barra de datos de hellocaribetours
// (que Samuel referenció). Reproduce los 3 KPIs que la web actual destaca en
// sus páginas de tour: «Limited Capacity · 4460 Days Sailed · 91733 Happy
// Clients».
//
// Tratamiento LIGERO (2026-07-17, tras verlo en navy: "pesa demasiado"): son
// info de APOYO (confianza), no contenido protagonista — así que en vez de un
// bloque navy sólido van sobre blanco, con solo dos hairlines arriba/abajo que
// los enmarcan (como los KPIs de la propia web actual). Iconos coral, números
// en navy, etiquetas en gris. Pesa como lo que es: una fila de datos, no una
// sección.
//
// Son stats de la EMPRESA (mismas en todos los tours), no por producto — por
// eso el componente no recibe props. Números con separador de miles español.
// `valor` puede ser texto (el KPI cualitativo «Aforo limitado» no lleva
// número, igual que en la web original) o cifra; `label` solo lo llevan los
// cuantitativos.
const KPIS = [
  { icon: Users, valor: 'Aforo limitado', label: '' },
  { icon: CalendarCheck, valor: '4.460', label: 'días navegados' },
  { icon: Smile, valor: '91.733', label: 'clientes felices' },
]

export function KpisTour() {
  return (
    <div className="grid grid-cols-3 divide-x divide-linea border-y border-linea py-4">
      {KPIS.map((kpi) => (
        <div key={kpi.valor} className="flex flex-col items-center justify-center gap-1.5 px-2 text-center">
          <kpi.icon className="size-5 text-coral" aria-hidden="true" />
          <p className="font-display text-base font-semibold leading-tight text-navy">{kpi.valor}</p>
          {kpi.label ? <p className="text-xs text-navy-soft">{kpi.label}</p> : null}
        </div>
      ))}
    </div>
  )
}
