import { Check } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// EL CIERRE DE /foundation: las dos llamadas a la acción del slide 64, en
// paralelo — 2026-07-28, 5ª vuelta (Samuel: «los 2 banners CTA que estén uno
// al lado del otro y sean similares a cards de precios; por supuesto no tienen
// precios, pero estéticamente sean de ese estilo»).
//
// ⚠️ NACIÓ EN /ventaja-competitiva y por eso está en `sostenibilidad/`. Desde
// el 2026-08-12 su ÚNICO consumidor es /foundation: al mudarse allí el tramo
// de la fundación, las dos tarjetas habrían salido en las dos páginas
// («ya que las 2 cards finales estarían duplicadas quita una») y se quitó la
// de /competitive-advantage. La carpeta y el nombre se arreglan en la próxima
// limpieza, junto con `fundacion-teaser.tsx`, que arrastra lo mismo.
//
// Sustituye a DOS componentes que estaban apilados: membresias-sostenibilidad
// (superficie clara) y cierre-sostenibilidad (banda con foto). Los dos se
// retiran — su contenido vive aquí.
//
// LA ANATOMÍA DE UNA TABLA DE PRECIOS, sin precios: rótulo · titular · texto ·
// lista de puntos con check · botón a ancho completo abajo. Dos piezas la
// hacen leer como tal y no como dos cajas cualesquiera:
//
//  · `items-stretch` + `mt-auto` en el pie. Las dos tarjetas miden lo mismo y
//    los dos botones caen a la MISMA altura aunque los textos difieran. En una
//    tabla de precios comparas en horizontal; si los botones bailan, se rompe.
//  · UNA DESTACADA. En esa anatomía siempre hay un «plan recomendado», y aquí
//    el recomendado es reservar: se lleva la foto cenital del agua de Bávaro
//    con velo navy (el mismo tratamiento que tenía la banda de cierre que
//    sustituye, así que el idioma visual del remate no se pierde) y el botón
//    coral. La de membresías se queda en superficie clara.
//
// ⚠️ Los puntos NO son viñetas de relleno: salen de datos que ya existen en el
// proyecto (los importes por huésped, los hitos de la fundación y dos de sus
// cinco frentes). Ver data/sostenibilidad.ts §cierrePuntos.
//
// El botón de membresías va a /contacto PELADO, sin `?asunto=`: /contacto no
// lee query params hoy y las membresías no existen todavía como producto (no
// hay niveles, ni precios, ni pasarela — mismo bloqueo Odoo que el resto de
// pagos). Recoger interés real desde el primer día es preferible a prometer un
// flujo que no está.
// `id` y `anclaClase` son props porque este bloque tuvo DOS consumidores entre
// el 2026-07-28 y el 2026-08-12 (Samuel: «en el CTA final de /fundacion
// reemplázalo por el que tenemos en ventaja-competitiva, que son 2 cards una
// al lado de la otra tipo card price, ese está mejor»): en /fundacion es el
// ancla `#membresias` de siempre y solo despeja el header, y en
// /ventaja-competitiva era el destino del chip «Membresías» y tenía que
// despejar además la barra de anclas. Hoy solo queda el primero, así que los
// DEFAULTS ya no los usa nadie — se dejan puestos porque son el contrato del
// componente, no la configuración de una página.
export function CierreDoble({
  id = 'ancla-membresias',
  anclaClase = 'scroll-mt-sticky-top',
}: {
  id?: string
  anclaClase?: string
} = {}) {
  return (
    <section id={id} className={anclaClase}>
      {/* [2026-08-12] FUERA LAS DOS CLASES `.sost-reveal` de las tarjetas. Las
          pintaba use-sostenibilidad-reveal.ts, que solo se llama desde
          pages/ventaja-competitiva.tsx; desde que este bloque no se monta allí
          no hay hook que las mire y eran marcadores muertos. En /foundation no
          hay reveal de página: el bloque entra como el resto. */}
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        {/* ---------- Apoyar la fundación ---------- */}
        <article className="flex flex-col rounded-card-grande bg-papel-hueso p-8 sm:p-10">
          <Etiqueta>{FUNDACION.membresiasEyebrow}</Etiqueta>
          <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">
            {FUNDACION.membresiasTitulo}
          </h2>
          <p className="mt-4 text-navy-sub">{FUNDACION.membresiasTexto}</p>

          <ul className="mt-6 flex flex-col gap-3">
            {SOSTENIBILIDAD.membresiasPuntos.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-aqua-dark" strokeWidth={2.5} />
                <span className="text-sm text-navy-sub">{p}</span>
              </li>
            ))}
          </ul>

          {/* mt-auto: empuja el pie al fondo para que los dos botones queden a
              la misma altura pase lo que pase con el largo de los textos. */}
          <div className="mt-auto pt-8">
            <Boton to="/contact" tamaño="lg" className="w-full">
              {FUNDACION.membresiasCta}
            </Boton>
          </div>
        </article>

        {/* ---------- Reservar (la destacada) ---------- */}
        <article className="relative flex flex-col overflow-hidden rounded-card-grande p-8 sm:p-10">
          <img
            src={`/fotos/${SOSTENIBILIDAD.cierreFoto}.webp`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Velo denso: aquí el texto ocupa la tarjeta entera (no solo el
              pie, como en la banda que sustituye), así que no vale un
              gradiente que se abra arriba — el rótulo y el titular viven
              justo ahí. */}
          <div aria-hidden="true" className="absolute inset-0 bg-navy/85" />

          <div className="relative flex flex-1 flex-col">
            <Etiqueta sobreOscuro>{SOSTENIBILIDAD.cierreEyebrow}</Etiqueta>
            <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-white">
              {SOSTENIBILIDAD.cierreTitulo}
            </h2>
            {/* [v3 2026-08-07] El texto aprobado trae DOS párrafos: el gancho
                («The Caribbean has given us everything») y el mecanismo (en qué
                se convierte cada reserva). Separados, el primero funciona como
                lo que es — una frase, no la entrada de un bloque. */}
            {SOSTENIBILIDAD.cierreTexto.map((t, i) => (
              <p key={t.slice(0, 30)} className={`${i === 0 ? 'mt-4' : 'mt-3'} text-white/85`}>
                {t}
              </p>
            ))}

            <ul className="mt-6 flex flex-col gap-3">
              {SOSTENIBILIDAD.cierrePuntos.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-aqua-claro" strokeWidth={2.5} />
                  <span className="text-sm text-white/85">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Boton to="/#tours" tamaño="lg" className="w-full">
                {SOSTENIBILIDAD.cierreCta}
              </Boton>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
