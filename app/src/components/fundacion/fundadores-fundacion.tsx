import { EquipoTeaser } from '@/components/home/equipo-teaser'
import type { MiembroEquipo } from '@/data/nosotros'
import { FUNDACION } from '@/data/fundacion'

// «QUIÉN ESTÁ DETRÁS» (slide 62) — 3ª versión, 2026-07-28 (Samuel: «haz esa
// sección reutilizando las cards de equipo, para mostrar a los 3 que están
// detrás, y le quitas el fondo gris a esa sección»).
//
// Historial corto: (1) columna estrecha con tres filas de texto al lado de
// los párrafos de la historia; (2) banda gris con tres firmas pequeñas
// (monograma + nombre en una línea); (3) esto — las CARDS DE EQUIPO de la
// home, tal cual.
//
// Y es reutilización de verdad, no un clon: home/equipo-teaser.tsx ya nació
// parametrizado para esto (lo usa /nosotros con 3 cards en vez de 5, ver su
// cabecera). Aquí se le pasan otros miembros, otro copy de cabecera,
// `cierre={null}` (el enlace «Conoce también a la tripulación» no pinta nada
// en la página de la fundación) y `enmarcada={false}` porque la columna de
// /fundacion ya pone su ancho y su padding. Cero CSS nuevo, y el patrón de
// arco al scrollear (use-equipo-scroll.ts) sale gratis — se calcula por
// distancia al centro, así que con 3 cards da [2,1,2] y sigue leyéndose como
// arco.
//
// SIN FONDO GRIS: la superficie --color-papel-hueso que agrupaba la banda
// anterior se retira. Ya no hace falta nada que agrupe — tres cards grandes
// se leen solas como un grupo, y la card ya trae su propio hueso dentro.
//
// ⚠️ LAS TRES VAN SIN RETRATO, y eso es una decisión, no un olvido: no hay
// foto de ninguno de los dos cofundadores, y las caras de /fotos/equipo-*.webp
// son stock recortado. Ponerle una cara de stock a una persona real con
// nombre y apellidos es inventarle un retrato a alguien que existe. La card
// cae a su fallback de monograma (FS · MR · HAA) hasta que el cliente mande
// fotos: ese día es cambiar `foto: null` en data/fundacion.ts y ya.
const MIEMBROS: MiembroEquipo[] = FUNDACION.fundadores.map((f) => ({
  id: f.id,
  nombre: f.nombre,
  rol: f.rol,
  iniciales: f.iniciales,
  foto: f.foto,
}))

export function FundadoresFundacion() {
  return (
    <EquipoTeaser
      miembros={MIEMBROS}
      etiqueta={FUNDACION.fundadoresEyebrow}
      titulo={FUNDACION.fundadoresTitulo}
      texto={FUNDACION.fundadoresIntro}
      cierre={null}
      enmarcada={false}
    />
  )
}
