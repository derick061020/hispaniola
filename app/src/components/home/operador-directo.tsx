import { t } from '@/lib/i18n'
import { Etiqueta } from '@/components/ui/etiqueta'

// [2026-10-02, Fernando, vía Rossanna: «quiere que pongas ese texto en la
// página original de Hispaniola»]
//
// Es el bloque «Direct operator» que ya está en hispaniolapartyboat.com. Dice
// lo único que ningún portal puede decir: que los barcos, la tripulación y la
// cocina son de la casa, y que la reserva no se le pasa a nadie.
//
// Va DEBAJO de los premios y ENCIMA de la banda eco, que es donde lo marcó
// Fernando. Y encaja ahí: los premios son lo que dicen otros de nosotros, y
// esto es lo que decimos nosotros. Después ya empieza la playa.
//
// No duplica a `WhyDirect`, que está más abajo: aquel compara precios contra
// los portales (cuánto te cuesta el intermediario) y este responde a otra
// pregunta — con quién estás contratando. Uno habla de dinero y el otro de
// quién responde si algo sale mal.
//
// El copy es el de esa web, traducido, sin añadirle nada: lo que se promete
// aquí acaba en una reserva de verdad.
export function OperadorDirecto() {
  return (
    <section className="w-full bg-papel px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="max-w-3xl">
          <Etiqueta>{t('Direct operator')}</Etiqueta>

          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {t('You book with the company that runs the boat.')}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-navy-sub sm:text-lg">
            {t('Hispaniola owns the boats, employs the crew, and prepares the food on board. You are booking directly with the company that organizes the experience:')}{' '}
            {/* El resalte va SOLO en esta frase. Es la que resume el bloque, y
                la que un cliente que compara portales necesita ver sin leer el
                párrafo entero. */}
            <strong className="rounded-sm bg-resalte px-1 font-semibold text-navy">
              {t('no resellers, no middlemen')}
            </strong>
            {t(', and with the guarantee that your reservation will never be handed over to third parties.')}
          </p>

          <p className="mt-6 border-l-[3px] border-aqua pl-4 font-display text-base font-semibold text-navy sm:text-lg">
            {t('The name on the boat is the name on your booking.')}
          </p>
        </div>
      </div>
    </section>
  )
}
