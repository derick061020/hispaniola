import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAnclasActiva, irAlAncla } from '@/components/ui/use-anclas-activa'
import { t } from '@/lib/i18n'

export type AnclaChip = {
  /** id de la sección en ESTA página… */
  id: string
  label: string
  /** …o ruta, si el contenido de ese chip vive en otra página (/fundacion) */
  to?: string
}

// Fila de chips de secciones — correcciones v2 del cliente, plan 08 §2
// (slide 58: `En vídeo · Conservación · Impacto por huésped · Comunidad · La
// fundación · Proyectos · Membresías`). Su maqueta los dibuja como chips de
// «filtro», pero no filtran nada: cada uno corresponde a una sección que
// existe, así que son ANCLAS. Se usan como tales.
//
// El ORDEN es el REAL de la página, no el de la maqueta (que abre por «En
// vídeo», cuando los videos van cuartos). Un índice que no sigue el orden de
// lectura desincroniza el resaltado al scrollear y, sobre todo, miente sobre
// cómo está contada la página: el recorrido de los 3 pilares está pensado
// como narrativa (ver pages/ventaja-competitiva.tsx).
//
// Los 3 últimos chips (fundación, proyectos, membresías) apuntan a
// /fundacion: ese contenido se mudó a página propia por decisión de Samuel
// del 2026-07-26. El chip «La fundación» sí tiene ancla aquí (el teaser), los
// otros dos son enlaces — y el scroll-spy los ignora solo (ver
// use-anclas-activa.ts).
//
// ⚠️ STICKY EN `top-0`, y por eso NavFlotante cede el tope en esta ruta
// (ver `cedeElTope` en home/nav-flotante.tsx): dos barras peleando por la
// misma franja es exactamente lo que Samuel rechazó en la ficha de tour
// («aquí me importa mucho más el menú interno de las secciones y debe estar
// totalmente arriba»). Mismo criterio, misma resolución.
//
// El alto de la fila se calca del de la barra de la ficha
// (--spacing-anclas-alto, 48.8px + los 2 hairlines = 52px medidos): así
// `scroll-mt-sticky-top`, que se deriva de ese token, es también el
// aterrizaje correcto aquí y no hace falta inventar un token gemelo.
//
// z-40 y no z-30 como AnclasFicha: aquí abajo navega el catamarán del
// recorrido, que va en z-30 para pasar por encima de la ruta y de las fotos
// — sin subir la barra, el barco le pasa por delante al llegar a lo alto del
// viewport. (En la ficha no hay nada en z-30, por eso allí no hizo falta.)
//
// Solo desktop (md:), igual que AnclasFicha: en móvil esta franja ya la pelea
// el CTA sticky, y una fila de 7 chips con scroll horizontal encima del
// contenido resta más de lo que suma.
export function NavAnclasChips({ anclas }: { anclas: AnclaChip[] }) {
  const [activa] = useAnclasActiva(anclas.filter((a) => !a.to).map((a) => a.id))

  // Un chip cuyo ancla no existe NO rompe nada: el enlace no hace scroll y el
  // scroll-spy ignora el id sin rechistar. Eso es exactamente lo que lo hace
  // peligroso — se cuela renombrando el id de una sección y no se nota hasta
  // que alguien lo pulsa. Aviso en consola solo en desarrollo (a producción no
  // viaja: Vite elimina la rama entera con import.meta.env.DEV en false).
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const huerfanos = anclas.filter((a) => !a.to && !document.getElementById(a.id))
    if (huerfanos.length > 0) {
      console.warn(
        `[NavAnclasChips] ${huerfanos.length} chip(s) apuntan a una sección que no existe en esta página:`,
        huerfanos.map((a) => `${a.label} → #${a.id}`),
      )
    }
  }, [anclas])

  return (
    <nav
      aria-label={t('Sections on this page')}
      className="sticky top-0 z-40 hidden border-y border-linea bg-papel/90 py-2 backdrop-blur-sm md:block"
    >
      <div className="mx-auto flex max-w-contenido flex-wrap justify-center gap-2 px-5 sm:px-10">
        {anclas.map((a) => {
          const esActiva = !a.to && a.id === activa
          const clases = `rounded-chip border px-4 py-1.5 text-sm font-medium transition-colors ${
            esActiva
              ? 'border-aqua-dark text-aqua-dark'
              : 'border-linea text-navy-sub hover:border-navy-soft hover:text-navy'
          }`
          return a.to ? (
            <Link key={a.id} to={a.to} className={clases}>
              {a.label}
            </Link>
          ) : (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={(e) => irAlAncla(e, a.id)}
              aria-current={esActiva ? 'true' : undefined}
              className={clases}
            >
              {a.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
