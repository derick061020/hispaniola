// [2026-11-19, Sr. Fernando, Gerencia] LOS 5 REELS DE CADA PRODUCTO.
//
// Pedido (10:52): «en cada producto colocaremos 5 reels, que serán el
// contenido visual principal… debajo mantendremos la galería de fotos, más
// compacta». Los vídeos los mandó Marketing (Melvin) al grupo y el Sr.
// Fernando RESPONDIÓ a cada uno con su sitio: «Caribbean escape num2,
// Weddings num4…». El número es la POSICIÓN del reel en esa página; el 1 y el
// 2 de los eventos son los vídeos que ya tenían (audio de las 20:22: «ya
// tenemos el 1 y el 2»). Reparto:
//
//   Reggie's review   → Events 3, Weddings 3, Private boats 3
//   Honey Moon        → Caribbean Escape 2, Weddings 4, Events 4
//   Private Boats     → MICE 1
//   first-time-snorkel→ Caribbean Escape 3, Coral Quest 4 (confirmado 19/11 20:02)
//   in-their-words    → Coral Quest 2, Private tours 4
//   no-worries        → Caribbean Escape 4, Coral Quest 3
//   4 hours           → Caribbean Escape 5, Private tours 5
//   upcoming wedding  → Weddings 4 (⚠️ el 4 ya era Honey Moon: va de 5.º)
//   coral-quest-cierre→ Coral Quest 5 («Coral Quest 5» en el pie)
//
// «Private boats» y «Private tours» son la misma página (/tours/private-charter):
// sus posiciones no se pisan (3, 4, 5). El charter no tiene 2.º: se pintan los que hay, en su orden.
//
// Cada reel: `src` (720p con sonido), `cartel` (6 s mudo a 360p para el bucle)
// y `poster`. Originales de 75–280 MB recomprimidos a 7–20 MB.
export type ReelProducto = { src: string; poster: string; cartel?: string }

const reel = (nombre: string): ReelProducto => ({
  src: `/video/reels-producto/${nombre}.mp4`,
  cartel: `/video/reels-producto/${nombre}-cartel.mp4`,
  poster: `/video/reels-producto/${nombre}-poster.jpg`,
})

// Los que ya estaban en cada página (sus posiciones 1 y 2).
const CARIBBEAN_ESCAPE_ACTUAL: ReelProducto = {
  src: '/video/tours/caribbean-escape.mp4',
  cartel: '/video/tours/caribbean-escape-cartel.mp4',
  poster: '/video/tours/caribbean-escape-cartel.jpg',
}
const CORAL_QUEST_ACTUAL: ReelProducto = {
  src: '/video/tours/coral-quest.mp4',
  cartel: '/video/tours/coral-quest-cartel.mp4',
  poster: '/video/tours/coral-quest-cartel.jpg',
}
const BOTES_PRIVADOS_ACTUAL: ReelProducto = {
  src: '/video/private-boats.mp4',
  cartel: '/video/private-boats-cartel.mp4',
  poster: '/video/private-boats-poster.jpg',
}
const PARTY_BOAT_ACTUAL: ReelProducto = {
  src: '/video/eventos/party-boat-galeria.mp4',
  cartel: '/video/eventos/party-boat-cartel.mp4',
  poster: '/video/eventos/party-boat-cartel.jpg',
}
const BODA_ACTUAL: ReelProducto = {
  src: '/video/eventos/weddings-reel.mp4',
  cartel: '/video/eventos/weddings-reel-cartel.mp4',
  poster: '/video/eventos/weddings-reel-poster.jpg',
}

export const REELS_PRODUCTO = {
  caribbeanEscape: [
    CARIBBEAN_ESCAPE_ACTUAL,
    reel('honey-moon'),
    reel('first-time-snorkel'),
    reel('no-worries'),
    reel('four-hours'),
  ],
  coralQuest: [
    CORAL_QUEST_ACTUAL,
    reel('in-their-words'),
    reel('no-worries'),
    // [19/11 20:02, Sr. Fernando: «coral quest num 4», citando «Caribbean escape3, Coral quest 4»]
    reel('first-time-snorkel'),
    reel('coral-quest-cierre'),
  ],
  privateCharter: [BOTES_PRIVADOS_ACTUAL, reel('reggies-review'), reel('in-their-words'), reel('four-hours')],
  partyBoat: [PARTY_BOAT_ACTUAL, BOTES_PRIVADOS_ACTUAL, reel('reggies-review'), reel('honey-moon')],
  weddings: [BODA_ACTUAL, BOTES_PRIVADOS_ACTUAL, reel('reggies-review'), reel('honey-moon'), reel('upcoming-wedding')],
  /** MICE solo tiene uno: va en la columna de siempre, no en fila de reels. */
  mice: reel('private-boats-mice'),
} satisfies Record<string, ReelProducto[] | ReelProducto>
