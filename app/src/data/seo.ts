// Títulos y descripciones para buscadores, por ruta.
//
// [2026-10-23, Marketing, «CAMBIOS-SEO-GEO-PARA-DESARROLLO-ODOO-hispaniola»,
// punto 3] Cada página se titulaba con el nombre comercial más la marca («Our
// tours · Hispaniola Aquatic Adventures»), y nadie busca «Our tours»: la
// búsqueda «catamaran excursion bavaro» estaba en posición 3 con cero clics.
// Estos textos los escribió y midió Marketing (≤ 60 caracteres el título,
// ≤ 160 la descripción): se pegan TAL CUAL, sin añadir la marca detrás, que ya
// la llevan donde cabe.
//
// Van en inglés y solo con la web en inglés, que es la que lee Google; en
// español cada página sigue con su título traducido. Los H1 no se tocan (voz de
// marca, regla 1 del documento) y las rutas tampoco (regla 3).
//
// ⚠️ La portada dice «4.9 stars from 1,782 reviews»: Marketing pide confirmarlo
// con Operaciones, porque cambia con el tiempo. Ya no dice «#1 on TripAdvisor
// 7 years running», que habría que poder demostrar.

export type SeoRuta = { titulo: string; descripcion: string }

export const SEO_POR_RUTA: Record<string, SeoRuta> = {
  // objetivo: catamaran punta cana · 2.514 impresiones
  '/': {
    titulo: 'Catamaran Tours in Punta Cana | Hispaniola Aquatic',
    descripcion:
      'Snorkeling in a real coral nursery, a secluded beach and food cooked on board. Small groups, 4.9 stars from 1,782 reviews. Book direct.',
  },
  // objetivo: punta cana catamaran tours 303 + punta cana boat tours 558
  '/tours': {
    titulo: 'Punta Cana Catamaran Tours and Boat Excursions',
    descripcion:
      'Catamaran tours and boat excursions in Punta Cana: shared snorkeling trips, Saona Island and private charters. Small groups, book direct.',
  },
  // objetivo: snorkeling punta cana · 1.568 impresiones
  '/tours/coral-quest': {
    titulo: 'Coral Reef Snorkeling Tour in Punta Cana | All Ages',
    descripcion:
      'Snorkeling tour in Punta Cana for all ages: coral nursery, symbolic coral planting, underwater museum and protected reefs. Marine biologist on board.',
  },
  // objetivo: punta cana snorkeling excursions · 257 impresiones
  '/tours/caribbean-escape': {
    titulo: 'Adults-Only Catamaran Snorkeling Tour in Punta Cana',
    descripcion:
      'Adults-only catamaran in Punta Cana: protected reef snorkeling, underwater museum, secluded beach and chef-cooked lunch on board. 15+.',
  },
  // objetivo: isla saona tours 828 + saona island excursion 357
  '/tours/saona-island': {
    titulo: 'Saona Island Excursion from Punta Cana by Catamaran',
    descripcion:
      'Saona Island excursion from Punta Cana: full day by catamaran or speedboat, natural pool, Catuano beach and lunch. Choose your boat.',
  },
  // objetivo: private catamaran punta cana · 433 impresiones
  '/tours/private-charter': {
    titulo: 'Private Catamaran in Punta Cana | Charter for Groups',
    descripcion:
      'Private catamaran charter in Punta Cana: the whole boat for your group, any size. Snorkeling, natural pool, bar and food on board.',
  },
  // objetivo: party boat punta cana excursion · 203 impresiones
  '/events/party-boat': {
    titulo: 'Party Boat in Punta Cana | Private Catamaran Parties',
    descripcion:
      'Party boat in Punta Cana on a private catamaran: music, bar and the whole boat for your group. Birthdays, bachelor and bachelorette parties.',
  },
}
