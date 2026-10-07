import { useEffect, useRef, useState, type RefObject } from 'react'
import { Anchor, Waves } from 'lucide-react'
import { irAlAncla } from '@/components/ui/use-anclas-activa'
import { PROFUNDIDAD_MUSEO_M, ZONAS_MUSEO } from '@/data/museo'
import { t } from '@/lib/i18n'
import type { Descenso } from './use-descenso'

// EL MEDIDOR DE PROFUNDIDAD — lo que Raymond nombró primero al describir la B2.
//
// El de la B2 era una barra de progreso con un título encima: no se entendía
// que aquello fuera profundidad. La 1ª versión de aquí lo arregló copiando una
// regla de buceo —línea con marcas—, y Samuel en la 2ª vuelta: «no me gusta
// que sea una línea integral con otras líneas transversales». Ahora es una
// CÁPSULA DE VIDRIO (el mismo material que la píldora del nav): arriba la
// superficie (olas), abajo el fondo (ancla), un carril que se llena de luz y
// una burbuja que baja. Se lee como profundidad sin leer nada.
//
// Y HACE DE ÍNDICE: las siete estaciones son las siete secciones (los chips
// del V1) y se pueden pulsar. La activa enseña su nombre en una píldora a la
// izquierda; las otras, al pasar el cursor.
//
// La AGUJA y el relleno se mueven por CSS con `--museo-avance` (museo.css),
// que se escribe en el nodo sin pasar por React. Por React solo pasa la
// estación activa, que cambia siete veces en toda la página.
//
// ⚠️ SIN METROS mientras PROFUNDIDAD_MUSEO_M sea null (ver data/museo.ts).

type Props = { descenso: RefObject<Descenso> }

export function MedidorProfundidad({ descenso }: Props) {
  const navRef = useRef<HTMLElement>(null)
  const metrosRef = useRef<HTMLSpanElement>(null)
  /** −1 = aún en el héroe (superficie). */
  const [indice, setIndice] = useState(-1)

  // EL AVANCE POR SECCIONES. Se toma la línea media de la pantalla y se mira
  // en qué sección cae. La aguja se coloca EN EL PUNTO de esa sección
  // (`--museo-avance` = índice / 6 tramos) y museo.css la desliza al siguiente
  // con una transición.
  //
  // [3ª vuelta, Samuel, con captura: «ese indicador se ve descuadrado»] La 1ª
  // versión movía la aguja de forma CONTINUA dentro de cada sección: a mitad de
  // «What you get» quedaba entre el punto 02 y el 03 mientras la etiqueta
  // «02» señalaba el de arriba — dos indicadores diciendo cosas distintas.
  // Ahora aguja, punto encendido y etiqueta están siempre en el mismo sitio.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const secciones = ZONAS_MUSEO.map((z) => document.getElementById(z.id))
    const tramos = ZONAS_MUSEO.length - 1
    let pendiente = false
    let ultimo = -2
    const medir = () => {
      pendiente = false
      const linea = window.innerHeight * 0.5
      let f = -1
      secciones.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= linea) f = i + Math.min(1, Math.max(0, (linea - r.top) / Math.max(1, r.height)))
      })
      const i = f < 0 ? -1 : Math.min(tramos, Math.floor(f))
      nav.style.setProperty('--museo-avance', (Math.max(0, i) / tramos).toFixed(4))
      if (i !== ultimo) {
        ultimo = i
        setIndice(i)
      }
    }
    const alScroll = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [])

  useEffect(() => {
    if (PROFUNDIDAD_MUSEO_M === null) return
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const m = (descenso.current?.prof ?? 0) * (PROFUNDIDAD_MUSEO_M ?? 0)
      if (metrosRef.current) metrosRef.current.textContent = `−${m.toFixed(1)} m`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [descenso])

  const zona = indice >= 0 ? ZONAS_MUSEO[indice] : null

  return (
    <nav ref={navRef} aria-label={t('Sections on this page')} className="museo-medidor">
      <p className="sr-only" aria-live="polite">
        {zona ? zona.label : t('Surface')}
      </p>
      <div className="museo-medidor-capsula">
        <span className="museo-medidor-tope" title={t('Surface')}>
          <Waves className="size-4" aria-hidden="true" />
        </span>

        <div className="museo-medidor-paradas">
          <span aria-hidden="true" className="museo-medidor-carril" />
          <span aria-hidden="true" className="museo-medidor-aguja" />
          <ol className="museo-medidor-lista">
            {ZONAS_MUSEO.map((z, i) => (
              <li key={z.id}>
                <a
                  href={`#${z.id}`}
                  onClick={(e) => irAlAncla(e, z.id)}
                  className="museo-medidor-parada"
                  data-activa={i === indice ? '' : undefined}
                  data-pasada={i < indice ? '' : undefined}
                  aria-current={i === indice ? 'location' : undefined}
                  aria-label={z.label}
                >
                  <span className="museo-medidor-punto" aria-hidden="true" />
                  <span className="museo-medidor-etiqueta" aria-hidden="true">
                    <b>{String(i + 1).padStart(2, '0')}</b>
                    {z.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {PROFUNDIDAD_MUSEO_M !== null ? <span ref={metrosRef} className="museo-medidor-metros" /> : null}
        <span className="museo-medidor-tope" title={t('Seabed')}>
          <Anchor className="size-4" aria-hidden="true" />
        </span>
      </div>
    </nav>
  )
}
