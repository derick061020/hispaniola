import { RiMastercardFill, RiPaypalFill, RiVisaFill } from '@remixicon/react'
import type { MedioPago } from '@/data/home'

// Cajita de método de pago del footer (2026-07-22, pedido de Samuel: "en vez
// de que diga mastercard, visa, paypal en unos chips… que estén todos los
// logos en armonía dentro de sus cajitas para darle homogeneidad").
//
// LO QUE ROMPÍA LA FILA ANTES: cada medio era un chip de texto con padding, o
// sea que el ancho lo decidía el nombre — "Visa" 46px, "Efectivo a bordo"
// 132px — y el ojo leía cinco objetos distintos. Aquí la caja es SIEMPRE la
// misma (--spacing-pago-caja-ancho × --spacing-pago-caja-alto) y lo único que
// cambia es lo que va dentro.
//
// DE DÓNDE SALEN LOS LOGOS: de @remixicon/react, que ya es dependencia del
// proyecto (la trajo AlignUI) y trae Visa / Mastercard / PayPal dibujados
// como glifos monocromos en el MISMO viewBox de 24px y con la misma retícula.
// Eso es justo lo que hace falta aquí: la homogeneidad no se consigue
// retocando cinco logos oficiales de cinco marcas distintas, se consigue
// pintándolos todos desde una sola familia. Por eso tampoco se colorean con
// los colores de marca (el azul de Visa, el rojo/ámbar de Mastercard): sobre
// el océano del footer serían cinco manchas de color peleándose entre sí y
// contra el aqua de la marca — van todos en blanco, como los iconos de redes
// de la fila de al lado.
//
// AMERICAN EXPRESS NO ESTÁ EN ESA FAMILIA (Remix no lo trae). Antes que
// dibujar de memoria un logo que no tenemos, se compone el NOMBRE — el mismo
// criterio que ya defendía el comentario de MEDIOS_PAGO en data/home.ts. Va
// en la misma caja, al mismo peso óptico, así que la fila sigue leyéndose
// homogénea (la referencia que pasó Samuel hace lo mismo: mezcla pictogramas
// y wordmarks dentro de cajas iguales).
//
// ⚠️ Si el cliente entrega los assets oficiales (o confirma el TPV y aparecen
// Apple Pay / Google Pay), esto se sustituye pieza a pieza sin tocar el
// layout: la caja es la misma, solo cambia la marca de dentro.

// Talla por CLASE ÓPTICA, no por marca — el porqué (con las medidas de cada
// path) está en el bloque de tokens del footer en tokens.css.
const GLIFO = {
  visa: { Icono: RiVisaFill, clase: 'size-pago-marca-lineal' },
  mastercard: { Icono: RiMastercardFill, clase: 'size-pago-marca-solida' },
  paypal: { Icono: RiPaypalFill, clase: 'size-pago-marca-alta' },
} as const

// Vidrio del footer: mismo relleno que las píldoras de redes (bg-white/10) y
// borde de highlight especular — brillante, no elegido por contraste contra
// el relleno (regla de vidrio del proyecto). Sin hover: no son interactivas,
// son un sello de confianza.
const clasesCaja =
  'grid h-pago-caja-alto w-pago-caja-ancho place-items-center rounded-btn bg-white/10 ring-1 ring-white/25 backdrop-blur-sm'

export function MarcaPago({ medio }: { medio: MedioPago }) {
  const { marca } = medio
  const glifo = marca.tipo === 'glifo' ? GLIFO[marca.glifo] : null

  return (
    // El nombre va en `title` y en el texto oculto: la marca de dentro es
    // decorativa (aria-hidden), así que sin esto un lector de pantalla
    // anunciaría cinco cajas vacías.
    <span className={clasesCaja} title={medio.nombre}>
      <span className="sr-only">{medio.nombre}</span>
      {glifo ? (
        <glifo.Icono className={`${glifo.clase} text-white`} aria-hidden="true" />
      ) : (
        <span
          aria-hidden="true"
          className="text-pago-marca font-semibold uppercase leading-none tracking-pago-marca text-white"
        >
          {marca.tipo === 'texto' ? marca.texto : null}
        </span>
      )}
    </span>
  )
}
