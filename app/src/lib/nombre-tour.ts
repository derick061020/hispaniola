// [2026-08-25, pedido de Samuel: «en el resumen de la compra me sale
// "Semi-Privado Premium / Premium · 4 h", el de arriba debe ser solo
// semi-privado, igual con todos»]
//
// El nombre del producto en el catálogo es «Semi-Private Premium»: el Premium
// forma parte de cómo se llama el tour, no del paquete que se ha elegido. En
// la tarjeta del checkout eso chocaba con la línea de debajo, que dice el
// paquete y la duración — «Premium» aparecía dos veces seguidas.
//
// Y con Light elegido era peor que redundante: el título seguía diciendo
// «Semi-Private Premium» encima de un «Light · 4 h». Parecía que se estaba
// pagando un Premium por precio de Light.
//
// La regla es una y vale para los cuatro tours (hoy solo se le nota a
// semi-privado, que es el único con la palabra en el nombre): si el título
// TERMINA en el nombre de un paquete y ese paquete ya se dice debajo, sobra
// arriba. No se toca el catálogo — el tour se sigue llamando como se llama en
// Odoo, en la ficha y en los correos; esto es solo cómo se rotula la tarjeta.

const PAQUETES = ['premium', 'light']

/** El nombre del tour sin la coletilla del paquete. */
export function nombreSinPaquete(nombre: string): string {
  const limpio = nombre.trim()
  const palabras = limpio.split(/\s+/)
  if (palabras.length < 2) return limpio
  const ultima = palabras[palabras.length - 1].toLowerCase()
  if (!PAQUETES.includes(ultima)) return limpio
  return palabras.slice(0, -1).join(' ')
}
