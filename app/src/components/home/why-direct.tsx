import { useRef, useState } from 'react'
import { t } from '@/lib/i18n'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Boton } from '@/components/ui/boton'
import { BoletoReserva, type VarianteBoleto } from '@/components/home/boleto-reserva'
import { useWhyDirectScroll } from '@/components/home/use-why-direct-scroll'
import { useDevFlag } from '@/dev/use-dev-flag'

// "Why book direct" — el bloque que no existe en la web actual (ver
// NOTAS['home-why-direct'] del prototipo): Viator vende el mismo tour al
// mismo precio y hoy no hay ninguna razón visible para reservar directo.
//
// v3 «banner que se recoge» (pedido de Samuel, 2026-07-15): la comparación de
// los dos boletos vive DENTRO de un banner con foto de playa de fondo. A la
// izquierda el título + descripción + CTA (en blanco sobre la foto); a la
// derecha los dos boletos, y el directo SOBRESALE del banner por arriba y por
// abajo. El banner arranca a SANGRE (100vw, más alto, esquinas rectas) y al
// scrollear hasta centrarse en el viewport se CONTRAE a una caja compacta con
// esquinas redondeadas (use-why-direct-scroll.ts anima la contracción; el
// estado compacto es el natural/estático — el que viaja a Figma).
//
// En móvil/tablet no caben los dos boletos ni el layout de 2 columnas: el
// título va arriba y un toggle [En un portal | Aquí] alterna el CUERPO de un
// solo boleto (el encabezado es idéntico → el precio no se mueve al cambiar).

// [2026-08-31] Derick: «En un portal» pasa a «En otros portales» y «Aquí» a
// «Con nosotros» — dice quién es cada columna sin que haya que deducirlo.
//
// Y de paso dejan de ser texto fijo en español: eran de lo poco que quedaba sin
// pasar por `t()`, así que el sitio en inglés enseñaba este toggle —y solo
// este— en español. La fuente es el inglés, como en el resto del sitio, y la
// traducción vive en lib/i18n/es.ts.
//
// Se calculan DENTRO del componente: `t()` lee el idioma en el momento de la
// llamada, y un array a nivel de módulo se evaluaría una vez al importar,
// congelando el idioma con el que se cargó la página.
const variantes = (): Array<{ id: VarianteBoleto; label: string }> => [
  { id: 'portal', label: t('On other portals') },
  { id: 'directo', label: t('With us') },
]

export function WhyDirect() {
  const sectionRef = useRef<HTMLElement>(null)
  const [sel, setSel] = useState<VarianteBoleto>('directo')

  // [dev-mode] ?dev-direct=estatico congela la contracción del banner en su
  // estado FINAL (la caja compacta — EL frame que viaja a Figma);
  // ?dev-direct=portal además pone el toggle móvil en «En un portal». Ver
  // dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-direct', (v) => {
    // [dev-mode]
    setEstatico(true) // [dev-mode]
    if (v === 'portal') setSel('portal') // [dev-mode]
  }) // [dev-mode]
  useWhyDirectScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <section ref={sectionRef} className="wd-section relative w-full py-seccion-sm sm:py-seccion">
      {/* data-nav-oscuro (2026-07-22): sentinel que observa NavFlotante para
          pintar el texto de los tabs en blanco al pasar por este banner —
          ver el comentario en home/hero.tsx. Va en .wd-banner (la foto +
          overlay oscuro), NO en el <section> de afuera: ese tiene padding
          transparente (py-seccion) alrededor del banner, sin nada oscuro
          detrás — marcarlo ahí daría un falso positivo en ese padding. */}
      <div data-nav-oscuro className="wd-banner">
        {/* Fondo: foto de playa + overlay de legibilidad (capa aparte para que
            los boletos puedan sobresalir del banner sin recortarse). */}
        <div aria-hidden className="wd-banner-fondo">
          {/* [2026-08-26] LA FOTO ES LA MISMA DE SIEMPRE; LO QUE CAMBIA ES EL
              NOMBRE DEL ARCHIVO, Y ESO ES EL ARREGLO.

              El cliente dijo que el banner «está mal, es otra imagen de fondo»
              y, al ver la que se puso, que la buena es «una vista superior del
              mar y algunos barcos» — o sea, la que el banner ya tenía en el
              servidor. Lo que veía él era la ANTERIOR: el 2026-08-23 la 2ª
              entrega del cliente reemplazó `hero-catamaran-1.webp` dejando el
              MISMO nombre, y este sitio cachea los .webp un año
              (`scripts/genera-htaccess.mjs`, ExpiresDefault access plus 1
              year). Quien hubiera entrado antes seguía viendo la foto vieja
              durante meses, sin forma de enterarse.

              Por eso el banner tiene ahora archivo propio con la foto aérea
              dentro: al ser una URL que nadie tiene cacheada, se ve la
              correcta desde el primer segundo, y de paso este banner deja de
              depender de un hueco que comparte con otras dos páginas
              (`data/instalaciones.ts`, `data/por-que-reservar.ts`), donde ya
              cambió de foto una vez sin que nadie tocara este archivo.

              El nombre lleva `-aerea` porque el intento anterior de este mismo
              arreglo llegó a publicarse con la foto equivocada dentro de
              `banner-reserva-directo.webp`: ese nombre ya está cacheado un año
              en el navegador de quien lo vio, así que cambiarle el contenido
              no habría servido de nada. Es la misma trampa, y la única salida
              es un nombre que nadie tenga guardado.

              ✅ RESUELTO (2026-08-27) para el resto de fotos: las 25 que la 2ª
              entrega reemplazó conservando el nombre Y que alguien carga de
              verdad llevan ahora sufijo `-v2` (`galeria-semi-privado-4-v2`,
              `hero-catamaran-1-v2`, `weddings-2-v2`…). Se comparó el build
              publicado el 19-08 con el actual para saber cuáles cambiaron de
              contenido bajo el mismo nombre; las que solo se nombran en
              comentarios se dejaron quietas, porque un fichero que nadie pide
              no está en la caché de nadie. La regla, para la próxima entrega:
              foto nueva con nombre viejo = sufijo nuevo, o el cliente seguirá
              viendo la anterior durante un año. */}
          <img src="/fotos/banner-reserva-directo-aerea.webp" alt="" />
          <div className="wd-banner-overlay" />
        </div>

        <div className="wd-banner-inner mx-auto grid max-w-contenido grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
          {/* Izquierda — título, descripción y CTA, en blanco sobre la foto */}
          <div className="text-white">
            {/* [v3 2026-08-06, WEBSITE - INICIO pág. 3] Título y bajada
                APROBADOS por el cliente. */}
            <Etiqueta sobreOscuro>{t('Book direct')}</Etiqueta>
            <h2 className="mt-3 text-balance font-display text-h2 font-semibold">
              {t('Book Direct. Experience More.')}
            </h2>
            <p className="mt-4 max-w-md text-lead text-white/80">
              {t('Everything the portals can’t offer.')}
            </p>
            <div className="mt-7">
              {/* [2026-08-24, barrido de enlaces] ERA UN BOTÓN MUERTO: `href="#"`
                  con `onClick={e => e.preventDefault()}`, o sea que ni navegaba
                  ni scrolleaba. Y no era un placeholder declarado — para eso
                  está ui/enlace-prototipo.tsx, que al menos lo dice en su
                  `title`. Era el CTA grande de una sección entera de la home.
                  Va al grid de tours, que es lo mismo que hacen el CTA del hero
                  y el del footer con este mismo texto. Ancla suelta y no
                  `to="/#tours"` porque WhyDirect SOLO se monta en la home
                  (pages/home.tsx): el ancla nativa vuelve a scrollear aunque ya
                  estés en /#tours, y un <Link> al mismo hash no dispara
                  ScrollAlNavegar. Misma elección que hero.tsx y experiencia.tsx. */}
              <Boton href="#tours" tamaño="lg">
                {t('Check availability')}
              </Boton>
            </div>
          </div>

          {/* Derecha — los dos boletos. Móvil: un boleto + toggle. */}
          <div>
            {/* Móvil/tablet: toggle + un boleto (el `key` remonta al cambiar) */}
            <div className="lg:hidden">
              <div className="flex justify-center">
                <div
                  role="group"
                  aria-label="Compare how to book"
                  className="inline-flex rounded-chip bg-white/15 p-1 ring-1 ring-white/25 backdrop-blur-sm"
                >
                  {variantes().map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={sel === v.id}
                      onClick={() => setSel(v.id)}
                      className={`rounded-chip px-4 py-1.5 text-sm font-semibold transition-colors ${
                        sel === v.id ? 'bg-white text-navy' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <BoletoReserva key={sel} variante={sel} cuerpoAnimado className="mx-auto mt-6 w-full max-w-boleto-ancho" />
            </div>

            {/* Desktop: STACK — el portal más chico, más abajo y tapado por el
                directo (items-start: sin stretch, cada uno con su altura
                natural; el margen negativo -ml los solapa). La columna entera
                sobresale del banner (margin-block negativo, en CSS). */}
            <div className="wd-boletos-desktop hidden lg:flex lg:items-start lg:justify-center">
              <BoletoReserva
                variante="portal"
                className="boleto--fondo w-boleto-ancho-banner-fondo shrink-0"
                style={{ marginTop: 'var(--spacing-boleto-stack-caida)' }}
              />
              <BoletoReserva
                variante="directo"
                className="boleto--frente w-boleto-ancho-banner shrink-0"
                style={{ marginLeft: 'calc(var(--spacing-boleto-stack-solape) * -1)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
