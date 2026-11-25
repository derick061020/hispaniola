import { traducible } from '@/lib/i18n'

// [2026-11-19, Sr. Fernando, Gerencia] «Añadir los perritos en tripulación,
// arriba del todo, los primeros» y, un minuto después, «creo que sería lo más
// aconsejable ponerlos por debajo de un servidor» → van justo DEBAJO de la
// historia del CEO (Fernando) y antes de los departamentos.
//
// Textos y fotos LITERALES suyos (fotos: Presidenta.jpg, Firulais.jpg,
// Machete.jpg). El nombre se escribe «Firulay», como en su texto (el archivo
// decía «Firulais»). Machete lleva la versión corregida de las 17:21 («in
// March 2026»). [20:28, Sr. Fernando: «cambiar I found por we found en
// todos»] En primera persona del plural.
export type Perrito = {
  nombre: string
  /** Slug en /public/fotos (`perrito-<slug>.webp`). */
  foto: string
  texto: string
}

export const PERRITOS_INTRO = traducible({
  titulo: 'Our Four-Legged Crew',
  lead: 'Presidenta, Firulay, and Machete came to us under difficult circumstances. Over time, each found a place in our crew.',
})

export const PERRITOS: Perrito[] = traducible([
  {
    nombre: 'Presidenta',
    foto: 'perrito-presidenta',
    texto:
      'We found her on January 9, 2023, after she’d been hit by a vehicle. Back then, her name was Luna, and she lived aboard Eclipse. On the night of April 10, she helped save a life. After that night, we named her Presidenta, a name that holds special meaning for us.',
  },
  {
    nombre: 'Firulay',
    foto: 'perrito-firulay',
    texto:
      'We found him in December 2024, lying in a puddle at a gas station in the rain. He’d had a hard life and was wary of people. With time and patience, he learned to trust us. Today, the whole crew loves him.',
  },
  {
    nombre: 'Machete',
    foto: 'perrito-machete',
    texto:
      'We found him in March 2026 on the street with a machete wound. He spent six weeks recovering in Santo Domingo and lost several teeth. When he came back, he settled right in. Today, he’s an important part of our crew.',
  },
])
