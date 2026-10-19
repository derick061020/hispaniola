// [2026-10-19, Rossanna: «eso no debiera salir con nuestro correo en Stripe,
// sino con el de quien pagó»] Las reservas de oficina y de Inspirato llevan
// a veces NUESTRO correo (info@, cruise@…) porque el cliente no dio el suyo.
// Ese correo no se le pasa a Stripe: el pagador quedaba registrado como
// «info@hispaniolaaquaticadventures.com» y no había forma de saber quién pagó.
const DOMINIOS_PROPIOS = [
  'hispaniolaaquaticadventures.com',
  'bavaroreefsgroup.com',
  'sistemashispaniola.com',
  'karayapuntacana.com',
  'eclipsepuntacana.com',
  'hispaniolapartyboat.com',
]

export function esCorreoPropio(email?: string | null): boolean {
  const dominio = (email ?? '').trim().toLowerCase().split('@')[1] ?? ''
  return DOMINIOS_PROPIOS.some((d) => dominio === d || dominio.endsWith('.' + d))
}
