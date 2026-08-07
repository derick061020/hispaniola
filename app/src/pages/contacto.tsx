import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraContacto } from '@/components/contacto/cabecera-contacto'
import { Contacto } from '@/components/home/contacto'
import { Meta } from '@/components/seo/meta'

// Página Contacto (/contacto) — mapea contact.php de la web actual (H1
// "Contact Us", subtítulo de ubicación, bloque de teléfono/WhatsApp/email/
// oficina y el formulario "Leave a Message"). El bloque WhatsApp/teléfono/
// email/oficina + mapa + formulario YA existía como sección embebida de la
// home (home/contacto.tsx, 2026-07-17) — se reusa tal cual aquí, con
// `mostrarEncabezado={false}` porque HeroInterna+CabeceraContacto ya cubren
// el titular. Antes de esta página, el link de "Contacto" del footer y del
// dropdown Ayuda del header (NAV_AYUDA) apuntaban a `/#contacto` (ancla de la
// home) — roto/confuso desde cualquier página que no fuera la home.
//
// Datos de contacto.php NO portados aquí a propósito: la dirección visible en
// esa página ("Plaza Bibijagua, Punta Cana - Bavaro") difiere de la que ya
// usa CONTACTO.direccion ("C. P.º del Sol, Punta Cana 23500") — esa fue dada
// directamente por Samuel el 2026-07-17, no inconsistencia nuestra; el propio
// contact.php se contradice (su JSON-LD interno usa la dirección de C. P.º
// del Sol). El bloque legal "by Events & Entertainment Punta Cana LLC" (la
// entidad de Miami) tampoco se porta: es información de facturación, no de
// contacto — encaja mejor en una página Legal/Términos si Samuel la quiere.
export function ContactoPage() {
  return (
    <div>
      <Meta
        titulo="Contact"
        descripcion="Write to us, call or send a WhatsApp. You talk straight to the boat crew. Office in Punta Cana, reply in under 24 h."
        ruta="/contact"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraContacto />
      </HeroInterna>

      <Contacto mostrarEncabezado={false} />

      <Footer />
    </div>
  )
}
