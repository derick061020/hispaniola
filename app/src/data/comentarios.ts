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
export const COMENTARIOS_POOL: Comentario[] = [
  {
    autor: 'María Gómez',
    fecha: '20 jul 2026',
    texto: 'Justo lo que necesitaba leer antes de reservar. ¡Gracias por la info tan clara!',
    likes: 14,
    dislikes: 0,
  },
  {
    autor: 'Carlos Reyes',
    fecha: '19 jul 2026',
    texto: 'Estuvimos hace dos semanas y coincido en todo. Se lo recomiendo a cualquiera que dude.',
    likes: 9,
    dislikes: 0,
  },
  {
    autor: 'Luisa Fernández',
    fecha: '18 jul 2026',
    texto: 'Nos pasó exactamente esto en el tour. Ojalá lo hubiera leído antes de ir la primera vez.',
    likes: 6,
    dislikes: 1,
  },
  {
    autor: 'Javier Ortiz',
    fecha: '17 jul 2026',
    texto: '¿Esto aplica también si vamos con niños pequeños? Nos vamos en agosto.',
    likes: 3,
    dislikes: 0,
    respuestas: [
      {
        autor: 'Hispaniola Aquatic Adventures',
        fecha: '17 jul 2026',
        texto: '¡Hola Javier! Sí, recibimos familias con niños de todas las edades — si quieres, escríbenos por WhatsApp y te recomendamos el tour que mejor encaja con la edad de los tuyos.',
      },
    ],
  },
  {
    autor: 'Ana Belén Rodríguez',
    fecha: '15 jul 2026',
    texto: 'Me encanta que sean tan transparentes, se nota que no es solo marketing.',
    likes: 21,
    dislikes: 0,
  },
  {
    autor: 'Pedro Martín',
    fecha: '14 jul 2026',
    texto: 'Reservamos al día siguiente de leer esto y fue el mejor día de todo el viaje.',
    likes: 11,
    dislikes: 0,
  },
  {
    autor: 'Sofía Herrera',
    fecha: '12 jul 2026',
    texto: 'Buenísimo artículo. ¿Tienen alguno parecido sobre Isla Saona?',
    likes: 2,
    dislikes: 0,
  },
  {
    autor: 'Diego Castillo',
    fecha: '10 jul 2026',
    texto: 'Confirmo cada palabra, fuimos en familia y todos salieron encantados.',
    likes: 7,
    dislikes: 0,
  },
  {
    autor: 'Valentina Ríos',
    fecha: '8 jul 2026',
    texto: 'Guardado para releerlo antes de nuestro viaje en septiembre.',
    likes: 4,
    dislikes: 0,
  },
  {
    autor: 'Tomás Aguilar',
    fecha: '5 jul 2026',
    texto: 'Se agradece que no endulcen la información. Así uno sabe realmente qué esperar.',
    likes: 8,
    dislikes: 1,
  },
]
