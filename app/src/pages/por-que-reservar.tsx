import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraPorQueReservar } from '@/components/por-que-reservar/cabecera-por-que-reservar'
import { Recibo } from '@/components/por-que-reservar/recibo'
import { Duelo } from '@/components/por-que-reservar/duelo'
import { HojaRazones } from '@/components/por-que-reservar/hoja-razones'
import { Ubicacion } from '@/components/por-que-reservar/ubicacion'
import { Cierre } from '@/components/por-que-reservar/cierre'
import { Meta } from '@/components/seo/meta'

// Página «Por qué reservar con nosotros» (/por-que-reservar) — correcciones v2
// del cliente, slides 50-56 (plan en
// correcciones-v2-cliente/planes/07-por-que-reservar.md).
//
// SUSTITUYE a /reserva-directa, que se retiró entera (2026-07-28, Samuel:
// «esa página de reserva directa la vamos a quitar, está horrible»). Aquella
// eran 30 líneas —hero + dos boletos comparativos— nacidas de una decisión de
// arquitectura que el cliente ha revertido: «el argumento no es un destino de
// menú, vive como módulo en home + ficha + checkout». En su web actual la
// insignia amarilla «¿POR QUÉ RESERVAR CON NOSOTROS? PRESIONE AQUÍ» es un
// enlace destacado que la gente pulsa, y quiere que lleve a una página con
// contenido propio. La URL vieja redirige aquí (App.tsx): estaba enlazada
// desde el footer y desde la ficha, y se ha compartido por WhatsApp.
//
// Orden: hero con pruebas → EL RECIBO (lo que pagarías suelto, la mejor idea
// del PowerPoint) → EL DUELO (foto real contra hueco vacío) → LA HOJA de las
// 19 razones → UBICACIÓN → CIERRE. Es una escalera: primero el dinero,
// después el detalle, y al final el sitio y la despedida.
//
// OBJETOS, NO CAJAS (2026-07-28, 2ª vuelta). La primera versión del cuerpo
// eran cuatro secciones con el mismo esqueleto —eyebrow, H2, párrafo, rejilla
// de cards con ring-1 y bullets de check— y Samuel la rechazó entera:
// «horrible, genérico e IA slop». Tenía razón: era una plantilla repetida
// cuatro veces, y encima no se parecía a nada de lo que esta web ya sabe
// hacer. Los tres bloques centrales se rehicieron con la anatomía de papel
// que YA existe en el proyecto (.boleto: papel, troquel real, sello, código
// de barras) — un recibo, un duelo y una hoja, en vez de tres rejillas.
//
// ⚠️ NO ES UNA PÁGINA PARA RETENER, y eso decide su diseño. El cliente fue
// explícito en la reunión del 07-24 (33:30): «no es tampoco para que la gente
// se vaya mucho ahí, pero sí que, si lo pinchan, que sepan por qué», y remató
// (33:52): «sobre todo que haya mucho botón que vaya a la pestaña de Tours».
// Por eso los 5 bloques cierran cada uno con su propia salida a /#tours, y el
// contenido está hecho para ESCANEARSE —fotos con precio, dos barras a escala,
// una tabla, un bento— en vez de leerse de corrido.
//
// Sin widget de reserva ni cotización: es página de ARGUMENTO. «Reservar» del
// header no tiene ancla propia aquí → lleva al grid de tours de la home,
// mismo criterio que /sostenibilidad.
export function PorQueReservarPage() {
  return (
    <div>
      <Meta
        titulo="Why book direct?"
        descripcion="We are the owner, not a middleman. What each piece of the tour would cost separately, how we compare with the rest, and the 19 reasons to book direct."
        ruta="/why-book-direct"
      />
      {/* anchoCompleto: el CTA vive en una columna derecha (pedido de Samuel),
          y con la caja de max-w-4xl del hero compartido quedaba a media
          pantalla en vez de en el borde derecho. */}
      <HeroInterna ctaHref="/#tours" anchoCompleto>
        <CabeceraPorQueReservar />
      </HeroInterna>

      <div className="mx-auto flex max-w-contenido flex-col gap-16 px-5 py-12 sm:px-10 lg:gap-24 lg:py-16">
        <Recibo />
        <Duelo />
        <HojaRazones />
        <Ubicacion />
        <Cierre />
      </div>

      <Footer />
    </div>
  )
}
