import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { irAlAncla } from '@/components/ui/use-anclas-activa'
import { COMIDA_Y_BAR_V3 } from '@/data/comida-y-bar-v3'
import { t } from '@/lib/i18n'
import { RUTA_EVENTOS_V3, RUTA_RESERVA_V3, useCtaVisible } from './barra-reserva-v3'

// EL ÚNICO MENÚ INTERNO de /food-and-bar.
//
// [2026-10-21, 2ª revisión de Samuel] «Hay dos menús… no debe haber
// duplicados. Uno solo: un menú lateral fijo con puntos que se van marcando al
// bajar, y una ilustración temática pequeña que cambia al llegar a cada
// sección, con un resorte tipo "Gentle" de Figma». Sustituye al submenú de
// chips (SubnavComida), que esta página ya no usa.
//
// [2026-10-21, 3ª revisión de Samuel] «Fuera la ilustración que rota arriba del
// todo, encima de los puntos: confunde. La ilustración aparece en el propio
// punto activo, y al pasar a la siguiente sección aparece en el nuevo punto con
// el resorte. Los demás se quedan como puntos». Y el nombre: se PROBÓ visible
// siempre junto al punto activo; con «Floating Kitchen» (~130 px) se metía en
// el texto de la sección. La versión elegida es la CONTENIDA: nombre CORTO
// (`corta`: Kitchen, Menus, Events…) y pequeño, que aparece al llegar a la
// sección y se desvanece a los ~2,4 s; el largo, al pasar el ratón por
// cualquier punto (como antes). La barra de abajo (móvil) ya funcionaba así —
// ilustración y nombre dentro del elemento activo—, así que no cambia.
//
// [2026-10-22, CTA fijo] En móvil y tableta la barra lleva además el botón «Book
// now» a la derecha (una sola barra fija, sin apilar otra); en escritorio, el CTA
// es la píldora de barra-reserva-v3.tsx.
//
// DOS FORMAS, UN COMPONENTE:
//   · ESCRITORIO (≥ 1024 px): columna fija a la derecha, centrada en vertical
//     — lejos de la píldora del header, que vive arriba. Solo puntos; el
//     activo es la ilustración. Para que NO tape contenido, la página reserva
//     esa franja (comida-y-bar-v3.css, `--spacing-indice-v3`).
//   · MÓVIL Y TABLETA (< 1024 px): barra fija ABAJO. A 390 px una columna
//     lateral de ~88 px se comería el 22 % del ancho o taparía texto; arriba
//     ya están el logo y la hamburguesa del header. Abajo no hay nada fijo de
//     la web (el único botón fijo de abajo es el «Dev» del modo desarrollo).
//     La barra es una píldora: ilustración + nombre de la sección + puntos de
//     progreso; al tocarla se despliega hacia arriba la lista de secciones.
//
// Las dos aparecen al dejar atrás el héroe y se van al llegar al footer.
//
// LA ILUSTRACIÓN cambia con un resorte: masa 1, rigidez 100, amortiguación 15
// (el «Gentle» de Figma), muestreado como `linear()` en tokens.css
// (--ease-resorte-gentil). Con `prefers-reduced-motion`, cambia sin moverse.
const A = COMIDA_Y_BAR_V3.anclas
const I = COMIDA_Y_BAR_V3.indice

function useEstadoIndice() {
  const [activa, setActiva] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let raf = 0
    const calcular = () => {
      raf = 0
      const linea = window.innerHeight * 0.4
      let actual = 0
      A.forEach((a, i) => {
        const el = document.getElementById(a.id)
        if (el && el.getBoundingClientRect().top <= linea) actual = i
      })
      setActiva(actual)
      // [QA] Aparece cuando el héroe ya casi ha salido (no con medio héroe
      // todavía en pantalla) y se va al llegar al footer.
      const hero = document.getElementById('hero')
      const pie = document.querySelector('footer')
      const dentro = !hero || hero.getBoundingClientRect().bottom < window.innerHeight * 0.3
      const antesDelPie = !pie || pie.getBoundingClientRect().top > window.innerHeight * 0.85
      setVisible(dentro && antesDelPie)
    }
    const alMover = () => {
      if (!raf) raf = requestAnimationFrame(calcular)
    }
    calcular()
    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    return () => {
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return { activa, visible }
}

/** La ilustración de la sección activa. `key` la vuelve a montar al cambiar
 *  de sección: así la animación de entrada (el resorte) se repite cada vez. */
function Ilustracion({ indice, className = '' }: { indice: number; className?: string }) {
  return (
    <span className={`comida3-indice-ilus ${className}`} aria-hidden="true">
      <img key={indice} src={A[indice].ilustracion} alt="" decoding="async" className="comida3-indice-ilus-img" />
    </span>
  )
}

/** `true` durante ~2,4 s tras cada cambio de sección activa (el nombre corto
 *  del punto activo se ve ese rato y se desvanece). */
function useReciente(activa: number, visible: boolean) {
  const [reciente, setReciente] = useState(false)
  useEffect(() => {
    if (!visible) return
    setReciente(true)
    const id = window.setTimeout(() => setReciente(false), 2400)
    return () => window.clearTimeout(id)
  }, [activa, visible])
  return reciente
}

export function IndiceV3() {
  const { activa, visible } = useEstadoIndice()
  const [abierto, setAbierto] = useState(false)
  const reciente = useReciente(activa, visible)
  const ctaVisible = useCtaVisible()
  const barraRef = useRef<HTMLDivElement>(null)

  // La lista móvil se cierra al tocar fuera o con Escape.
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: PointerEvent) => {
      if (!barraRef.current?.contains(e.target as Node)) setAbierto(false)
    }
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])
  useEffect(() => {
    if (!visible) setAbierto(false)
  }, [visible])

  const ir = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    irAlAncla(e, id)
    setAbierto(false)
  }

  return (
    <>
      {/* ── Escritorio: columna lateral con puntos ── */}
      <nav aria-label={t(I.titulo)} className="comida3-indice-lateral" data-visible={visible ? '' : undefined}>
        <ol className="flex flex-col items-center">
          {A.map((a, i) => {
            const esActiva = i === activa
            return (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  onClick={(e) => ir(e, a.id)}
                  aria-current={esActiva ? 'true' : undefined}
                  aria-label={t(a.label)}
                  data-pasada={i < activa ? '' : undefined}
                  data-reciente={esActiva && reciente ? '' : undefined}
                  className="comida3-indice-punto group"
                >
                  {/* Activo: el nombre CORTO (un momento). Los demás: el largo,
                      solo al pasar el ratón. */}
                  <span className="comida3-indice-etiqueta" aria-hidden="true">
                    {t(esActiva ? a.corta : a.label)}
                  </span>
                  {esActiva ? (
                    <Ilustracion indice={i} className="comida3-indice-ilus--punto" />
                  ) : (
                    <span className="comida3-indice-bolita" aria-hidden="true" />
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* ── Móvil y tableta: barra fija abajo ── */}
      <div ref={barraRef} className="comida3-indice-barra" data-visible={visible ? '' : undefined}>
        {abierto ? (
          <nav aria-label={t(I.titulo)} className="comida3-indice-lista">
            <ol className="grid gap-1">
              {A.map((a, i) => (
                <li key={a.id}>
                  <a
                    href={`#${a.id}`}
                    onClick={(e) => ir(e, a.id)}
                    aria-current={i === activa ? 'true' : undefined}
                    className="flex min-h-12 items-center gap-3 rounded-btn px-2 text-sm font-semibold text-navy aria-[current]:bg-aqua-tint"
                  >
                    <img src={a.ilustracion} alt="" aria-hidden="true" className="size-9 object-contain" />
                    {a.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {/* [2026-10-22, CTA fijo] UNA sola barra fija abajo: el índice y, a su
            lado, el botón de reservar (el mismo de la píldora de escritorio,
            barra-reserva-v3.tsx). Se esconde en el cierre y el footer. */}
        <div className="comida3-indice-fila">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label={abierto ? t(I.cerrar) : t(I.abrir)}
          className="comida3-indice-pildora"
        >
          <Ilustracion indice={activa} className="comida3-indice-ilus--barra" />
          {/* [2026-10-22, revisión] COMPACTO: ilustración pequeña + nombre CORTO
              + puntos de progreso; la lista completa se abre al tocarlo. Así los
              dos botones caben enteros, a 44 px de alto, hasta en 360 px. */}
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-semibold leading-tight text-navy">{A[activa].corta}</span>
            <span className="mt-1 flex gap-0.5" aria-hidden="true">
              {A.map((a, i) => (
                <span key={a.id} className={`h-1 flex-1 rounded-full ${i <= activa ? 'bg-aqua' : 'bg-linea'}`} />
              ))}
            </span>
          </span>
          <ChevronUp
            className={`size-4 shrink-0 text-navy-soft transition-transform ${abierto ? '' : 'rotate-180'}`}
            aria-hidden="true"
          />
        </button>
        <Link
          to={RUTA_RESERVA_V3}
          className="museo-boton-coral comida3-indice-cta"
          data-oculto={ctaVisible ? undefined : ''}
          tabIndex={ctaVisible ? 0 : -1}
          aria-label={t('Book your tour')}
        >
          {t('Tours')}
        </Link>
        <Link
          to={RUTA_EVENTOS_V3}
          className="comida3-boton-secundario comida3-indice-cta comida3-indice-cta--sec"
          data-oculto={ctaVisible ? undefined : ''}
          tabIndex={ctaVisible ? 0 : -1}
          aria-label={t('Plan an event')}
        >
          {t('Events')}
        </Link>
        </div>
      </div>
    </>
  )
}
