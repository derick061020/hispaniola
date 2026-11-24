import { useMemo, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { Meta } from '@/components/seo/meta'
import { HeroFod } from '@/components/fiesta-on-deck/hero-fod'
import { CalculadoraFod } from '@/components/fiesta-on-deck/calculadora-fod'
import {
  BanderasFod,
  BuenoSaberFod,
  CelebraFod,
  CierreFod,
  CintaFod,
  ComidaFod,
  CuatroFod,
  DiaRealFod,
  GaleriaFod,
  JergaFod,
  SonidoFod,
} from '@/components/fiesta-on-deck/secciones-fod'
import {
  FIESTAS_ON_DECK,
  PAX_INCLUIDOS_FOD,
  packDe,
  paquetesFod,
  type PaqueteFod,
} from '@/data/fiesta-on-deck'
import { crudo } from '@/lib/i18n'

// /events/fiesta-on-deck-afro y /events/fiesta-on-deck-latin (2026-11-24,
// Sr. Fernando en «Hispaniola Gerencia»: «ambas landing pages deben estar
// integradas dentro de la web de Hispaniola Aquatic Adventures, no como
// páginas independientes en otra web»).
//
// UNA plantilla para las dos experiencias, como las landings de evento: lo que
// cambia sale de data/fiesta-on-deck.ts y el color de la clase del contenedor
// (.fod-afro / .fod-latin, tokens de rol en tokens.css).
//
// No reutiliza la plantilla de evento (pages/evento.tsx) a propósito: esa es
// la línea «Charter Premium» de Hispaniola (blanco, navy, aqua con cuentagotas)
// y Fiesta on Deck es una marca con su propia línea visual —negro y amarillo,
// azul bandera— que Marketing pidió mantener. Lo que SÍ comparte con el resto
// del sitio: el header, el footer, el menú Events, las fotos reales y las
// reglas de precio del tarifario de eventos.
//
// Orden de secciones = el de las referencias:
//   hero · cinta · cuatro cosas · sonido · cinta de ritmos · comida ·
//   (Latin: banderas) · Celebration Packs · Build your party · galería ·
//   (Afro: un día real | Latin: habla como local) · bueno saber · cierre.
export function FiestaOnDeckPage({ slug }: { slug: 'fiesta-on-deck-afro' | 'fiesta-on-deck-latin' }) {
  const fiesta = FIESTAS_ON_DECK[slug]
  // El menú del paquete Food viaja en inglés (crudo) y se traduce al pintar.
  const paquetes = useMemo(() => paquetesFod(crudo(fiesta).menuPaqueteFood), [fiesta])

  // Paquete e invitados viven aquí: los usan la calculadora y los Celebration
  // Packs (que se desbloquean por el total), y las banderas de la Latin viajan
  // dentro del pedido.
  const [paquete, setPaquete] = useState<PaqueteFod['id']>('snacks')
  const [invitados, setInvitados] = useState(20)
  const [banderas, setBanderas] = useState<string[]>([])

  const p = paquetes.find((x) => x.id === paquete) ?? paquetes[0]
  const bruto = p.precioBase + Math.max(0, invitados - PAX_INCLUIDOS_FOD) * p.porPersonaExtra
  const pack = packDe(bruto)
  const esLatin = fiesta.marca === 'latin'

  return (
    <div className={`fod-${fiesta.marca} overflow-x-clip bg-fod-fondo`}>
      <Meta titulo={`Fiesta on Deck ${fiesta.nombre}`} descripcion={fiesta.metaDescripcion} ruta={`/events/${slug}`} />
      <HeroFod fiesta={fiesta} />
      <CintaFod items={fiesta.cinta} banderas={esLatin} />
      <CuatroFod fiesta={fiesta} />
      <SonidoFod fiesta={fiesta} />
      <CintaFod items={fiesta.sonido.estilos} invertida />
      <ComidaFod fiesta={fiesta} />
      {esLatin ? <BanderasFod elegidas={banderas} onCambiar={setBanderas} /> : null}
      <CelebraFod packActual={pack} />
      <CalculadoraFod
        fiesta={fiesta}
        paquetes={paquetes}
        paquete={paquete}
        onPaquete={setPaquete}
        invitados={invitados}
        onInvitados={setInvitados}
        banderas={banderas}
      />
      <GaleriaFod fiesta={fiesta} />
      {esLatin ? <JergaFod fiesta={fiesta} /> : <DiaRealFod fiesta={fiesta} />}
      <BuenoSaberFod />
      <CierreFod fiesta={fiesta} desde={paquetes[0].precioBase} />
      <Footer />
    </div>
  )
}
