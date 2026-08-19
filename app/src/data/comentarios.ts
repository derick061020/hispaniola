import { traducible } from '@/lib/i18n'

export type RespuestaComentario = {
  autor: string
  fecha: string
  texto: string
}

export type Comentario = {
  autor: string
  fecha: string
  texto: string
  likes: number
  dislikes: number
  respuestas?: RespuestaComentario[]
}

// Pool de comentarios del blog (correcciones v1, pedido de Samuel
// 2026-07-22). Mismo criterio que reviews.tsx con las reseñas reales: nombre
// + iniciales, sin fotos de clientes (privacidad — ver Iniciales en
// comentarios-articulo.tsx). Cada artículo toma un subconjunto determinista
// de este pool según su slug (ver esa misma función) para no repetir
// literalmente el mismo hilo en todos los artículos. `likes`/`dislikes` son
// el conteo INICIAL con el que carga cada comentario — el usuario puede
// sumar el suyo desde el artículo (estado local, ver comentarios-articulo.tsx).
export const COMENTARIOS_POOL: Comentario[] = traducible([
  {
    autor: 'María Gómez',
    fecha: 'Jul 20, 2026',
    texto: 'Exactly what I needed to read before booking. Thanks for such clear info!',
    likes: 14,
    dislikes: 0,
  },
  {
    autor: 'Carlos Reyes',
    fecha: 'Jul 19, 2026',
    texto: 'We were there two weeks ago and I agree with all of it. I’d recommend it to anyone who’s hesitating.',
    likes: 9,
    dislikes: 0,
  },
  {
    autor: 'Luisa Fernández',
    fecha: 'Jul 18, 2026',
    texto: 'This is exactly what happened to us on the tour. I wish I’d read it before going the first time.',
    likes: 6,
    dislikes: 1,
  },
  {
    autor: 'Javier Ortiz',
    fecha: 'Jul 17, 2026',
    texto: 'Does this also apply if we go with young kids? We’re traveling in August.',
    likes: 3,
    dislikes: 0,
    respuestas: [
      {
        autor: 'Hispaniola Aquatic Adventures',
        fecha: 'Jul 17, 2026',
        texto: 'Hi Javier! Yes, we welcome families with children of all ages. If you like, message us on WhatsApp and we’ll recommend the tour that best fits your kids’ ages.',
      },
    ],
  },
  {
    autor: 'Ana Belén Rodríguez',
    fecha: 'Jul 15, 2026',
    texto: 'I love how transparent they are, you can tell it’s not just marketing.',
    likes: 21,
    dislikes: 0,
  },
  {
    autor: 'Pedro Martín',
    fecha: 'Jul 14, 2026',
    texto: 'We booked the day after reading this and it was the best day of the whole trip.',
    likes: 11,
    dislikes: 0,
  },
  {
    autor: 'Sofía Herrera',
    fecha: 'Jul 12, 2026',
    texto: 'Great article. Do you have a similar one about Saona Island?',
    likes: 2,
    dislikes: 0,
  },
  {
    autor: 'Diego Castillo',
    fecha: 'Jul 10, 2026',
    texto: 'I can confirm every word, we went as a family and everyone came back delighted.',
    likes: 7,
    dislikes: 0,
  },
  {
    autor: 'Valentina Ríos',
    fecha: 'Jul 8, 2026',
    texto: 'Saved to read again before our trip in September.',
    likes: 4,
    dislikes: 0,
  },
  {
    autor: 'Tomás Aguilar',
    fecha: 'Jul 5, 2026',
    texto: 'It’s good that they don’t sugarcoat the information. That way you really know what to expect.',
    likes: 8,
    dislikes: 1,
  },
])
