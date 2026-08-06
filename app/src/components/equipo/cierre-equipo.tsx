import { BandaInstalaciones } from '@/components/instalaciones/banda-instalaciones'
import { EQUIPO_PAGINA } from '@/data/equipo'

// Cierre de /tripulacion — «¿Quieres remar con nosotros?» → /trabaja-con-nosotros.
//
// [v2 2026-07-28, pedido de Samuel] Antes era una caja blanca con un hairline
// alrededor, dentro de GridEquipo: el remate más flojo de la página y el único
// bloque del sitio que cerraba así. Ahora usa EL BANNER DE CIERRE DE LA CASA
// —foto del mar a sangre, tinte + degradado navy encima, texto centrado y CTA
// coral—, que es el mismo que rematan /instalaciones, /por-que-reservar,
// /ventaja-competitiva y /flota.
//
// NO SE REDIBUJA: se instancia el que ya existe. Este archivo es solo el
// cableado del contenido de esta página, para que la página no tenga que
// conocer ni la foto ni la variante.
//
// ⚠️ DEUDA DE NOMBRE: el componente compartido se llama `BandaInstalaciones` y
// vive en components/instalaciones/ porque nació ahí, pero ya lo usan dos
// páginas. Cuando se toque, toca moverlo a components/internas/banda-cta.tsx —
// en Figma es UN componente con dos variantes, no «la banda de instalaciones»
// más una copia.
export function CierreEquipo() {
  return (
    <BandaInstalaciones
      variante="cierre"
      foto={EQUIPO_PAGINA.cierreFoto}
      eyebrow={EQUIPO_PAGINA.cierreEyebrow}
      titulo={EQUIPO_PAGINA.cierreTitulo}
      texto={EQUIPO_PAGINA.cierreTexto}
      cta={EQUIPO_PAGINA.cierreCta}
      href="/careers"
    />
  )
}
