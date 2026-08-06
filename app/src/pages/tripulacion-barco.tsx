import { useState } from 'react'
import { Footer } from '@/components/home/footer'
import { CierreEquipo } from '@/components/equipo/cierre-equipo'
import { FranjaEquipo } from '@/components/equipo/franja-equipo'
import { GridEquipo, TODOS, type Filtro } from '@/components/equipo/grid-equipo'
import { PlanoBarco } from '@/components/equipo/plano-barco'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Meta } from '@/components/seo/meta'
import { EQUIPO_PAGINA } from '@/data/equipo'

// ⚠️⚠️ PÁGINA DE COMPARACIÓN, NO UNA PÁGINA DEL SITIO. ⚠️⚠️
//
// [v2 2026-07-28] Samuel quiso ver las dos ideas para la sección de equipo una
// al lado de la otra antes de decidir: «la del carril me parece más safe, pero
// intentemos la otra también, más arriesgada, y ya luego comparamos».
//
//   /tripulacion        → EL MURO (la segura): las ~70 caras desfilando en dos
//                         filas cruzadas, y debajo los chips de siempre.
//   /tripulacion-barco  → EL PLANO (la arriesgada): sin chips; se filtra
//                         tocando el barco o la columna de tierra.
//
// TODO LO DEMÁS ES LITERALMENTE LO MISMO: mismo hero, misma franja de datos,
// misma rejilla (GridEquipo, con el filtro controlado desde fuera) y mismo
// banner de cierre. Se comparan las dos ideas, no dos páginas distintas — si
// además cambiara el resto, la comparación no diría nada.
//
// CUANDO SE DECIDA: esta ruta y estos dos archivos (pages/tripulacion-barco.tsx
// y, si pierde, components/equipo/plano-barco.tsx) SE BORRAN. Si gana el plano,
// lo que se borra es el muro. No se queda una ruta duplicada viva: es
// exactamente la clase de página fantasma que luego nadie sabe si publicar.
// La ruta NO está en el menú ni en el sitemap a propósito — se llega por el
// Dev Mode.
export function TripulacionBarcoPage() {
  // El filtro vive AQUÍ y no dentro de la rejilla: en esta variante quien
  // filtra es el plano, así que los dos tienen que leer el mismo estado.
  const [filtro, setFiltro] = useState<Filtro>(TODOS)

  return (
    <div>
      {/* noindex implícito: esta ruta no se enlaza desde ninguna parte. Si la
          comparación se alarga y empieza a circular el enlace, hay que
          añadirle un robots noindex de verdad. */}
      <Meta
        titulo="Tripulación (variante: el barco como índice)"
        descripcion="Variante de comparación de la página de Tripulación: el equipo se filtra tocando el plano del barco en vez de los chips de departamento."
        ruta="/crew-boat"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraInterna
          eyebrow={EQUIPO_PAGINA.eyebrow}
          titulo={EQUIPO_PAGINA.titulo}
          lead={EQUIPO_PAGINA.lead}
        />
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-10 lg:gap-12">
          <FranjaEquipo />

          {/* El plano SUSTITUYE a los chips, no se suma a ellos: dos mandos
              para lo mismo, uno encima del otro, es peor que cualquiera de los
              dos por separado. */}
          <PlanoBarco filtro={filtro} onFiltro={setFiltro} />
          <GridEquipo filtro={filtro} onFiltro={setFiltro} conChips={false} />

          <div className="mt-6">
            <CierreEquipo />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
