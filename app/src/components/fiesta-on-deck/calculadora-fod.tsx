import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import {
  BANDERAS_FOD,
  DEPOSITO_FOD,
  DESCUENTOS_FOD,
  OCASIONES_FOD,
  PACKS_FOD,
  PANCARTAS_FOD,
  PAX_INCLUIDOS_FOD,
  PAX_MAX_FOD,
  TOPE_DESCUENTO_FOD,
  WHATSAPP_FOD,
  packDe,
  type FiestaOnDeck,
  type PaqueteFod,
} from '@/data/fiesta-on-deck'
import { formatoDinero } from '@/data/home'
import { BARRAS_EVENTO } from '@/data/eventos'
import { crudo, t, tp } from '@/lib/i18n'
import { CabeceraFod } from './secciones-fod'

// «Build your party» (2026-11-24). En la referencia de Marketing era un
// asistente de 4 pasos (Package → Date & crew → Your day → Pay deposit) con
// el carrito a la derecha. Aquí se arma TODO en una sola pantalla con el
// carrito sticky al lado: son siete decisiones cortas y verlas juntas es más
// rápido que ir y volver por pasos — sobre todo en móvil, donde cada «Next»
// era un salto de scroll.
//
// Las reglas de precio son LAS SUYAS, copiadas de su script:
//   · base del paquete hasta 12 invitados + extra fijo por cada uno más;
//   · 5 % por reservar con 30+ días, 5 % por pagar el saldo en efectivo y
//     5 % por haber navegado antes (lo verifica el equipo), con tope 15 %;
//   · depósito del 25 % para fijar la fecha; el resto, el día;
//   · el Celebration Pack se decide por el total ANTES de descuentos.
//
// «Snacks» y «Food» son NOMBRES de paquete (así los llama la referencia) y
// no pasan por t(): el diccionario traduce «Food» como «Gastronomía».
//
// El envío es por WhatsApp — ver RESERVA_POR_WHATSAPP en data/fiesta-on-deck.ts
// para el porqué y lo que falta en Odoo para cobrar online.

function hoyISO(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function diasHasta(fecha: string): number {
  if (!fecha) return -1
  const a = new Date(`${fecha}T12:00:00`).getTime()
  const h = new Date()
  h.setHours(12, 0, 0, 0)
  return Math.round((a - h.getTime()) / 864e5)
}

export function CalculadoraFod({
  fiesta,
  paquetes,
  paquete,
  onPaquete,
  invitados,
  onInvitados,
  banderas,
  barra,
  onBarra,
}: {
  fiesta: FiestaOnDeck
  paquetes: PaqueteFod[]
  paquete: PaqueteFod['id']
  onPaquete: (p: PaqueteFod['id']) => void
  invitados: number
  onInvitados: (n: number) => void
  banderas: string[]
  /** [2026-11-25] id de BARRAS_EVENTO: Caribbean (incluida), Caribbean Plus
   *  (+15) o Signature (+30), por invitado. */
  barra: string
  onBarra: (id: string) => void
}) {
  const [fecha, setFecha] = useState('')
  const [ocasion, setOcasion] = useState('')
  const [musicaPropia, setMusicaPropia] = useState(false)
  const [lista, setLista] = useState('')
  const [pancarta, setPancarta] = useState('')
  const [extras, setExtras] = useState<string[]>([])
  const [tarta, setTarta] = useState(false)
  const [notas, setNotas] = useState('')
  const [efectivo, setEfectivo] = useState(false)
  const [repetidor, setRepetidor] = useState(false)
  const [nombre, setNombre] = useState('')

  const p = paquetes.find((x) => x.id === paquete) ?? paquetes[0]
  const extraInvitados = Math.max(0, invitados - PAX_INCLUIDOS_FOD)
  // [2026-11-25] La barra suma por invitado ANTES de descuentos, como en las
  // landings de evento («added on top of your food package»).
  const b = BARRAS_EVENTO.find((x) => x.id === barra) ?? BARRAS_EVENTO[0]
  const extraBarra = b.extraPorPersona * invitados
  const bruto = p.precioBase + extraInvitados * p.porPersonaExtra + extraBarra
  const pack = packDe(bruto)
  const infoPack = pack ? PACKS_FOD[pack - 1] : null

  const descuentos = useMemo(() => {
    const d: { texto: string; pct: number }[] = []
    if (diasHasta(fecha) >= DESCUENTOS_FOD.anticipada.dias) d.push(DESCUENTOS_FOD.anticipada)
    if (efectivo) d.push(DESCUENTOS_FOD.efectivo)
    if (repetidor) d.push(DESCUENTOS_FOD.repetidor)
    return d
  }, [fecha, efectivo, repetidor])
  const pct = Math.min(
    descuentos.reduce((s, x) => s + x.pct, 0),
    TOPE_DESCUENTO_FOD,
  )
  const total = Math.round(bruto * (1 - pct))
  const deposito = Math.round(total * DEPOSITO_FOD)

  // Al bajar de pack, las opciones elegidas que ya no caben se descartan.
  const extrasValidos = infoPack ? extras.filter((e) => infoPack.opciones.includes(e)).slice(0, infoPack.eligir) : []
  const alternarExtra = (o: string) => {
    if (!infoPack) return
    if (extrasValidos.includes(o)) setExtras(extrasValidos.filter((x) => x !== o))
    else if (extrasValidos.length < infoPack.eligir) setExtras([...extrasValidos, o])
  }

  const cambiarInvitados = (n: number) => onInvitados(Math.min(PAX_MAX_FOD, Math.max(1, Math.round(n) || 1)))

  // El pedido viaja en INGLÉS (crudo) sea cual sea el idioma de la página: lo
  // lee el equipo de reservas, igual que los pedidos que llegaban desde la
  // landing de Marketing.
  const mensaje = useMemo(() => {
    const f = crudo(fiesta)
    const pq = crudo(p)
    const lineas = [
      `Hi! I want to book Fiesta on Deck · ${f.nombre}.`,
      `Package: ${pq.nombre} (${formatoDinero(pq.precioBase)} up to ${PAX_INCLUIDOS_FOD} guests + ${formatoDinero(pq.porPersonaExtra)} per extra guest)`,
      `Date: ${fecha || 'to confirm'}`,
      `Guests: ${invitados}`,
      `Open bar: ${b.nombre}${b.extraPorPersona ? ` (+${formatoDinero(b.extraPorPersona)} per guest = ${formatoDinero(extraBarra)})` : ' (included)'}`,
      `Celebrating: ${ocasion || '-'}`,
      `Music: ${musicaPropia ? `our own playlist${lista ? ` ${lista}` : ' (link later)'}` : `${f.nombre} mix (${f.sonido.estilos.join(', ')})`}`,
    ]
    if (banderas.length)
      lineas.push(`Flags on board: ${banderas.map((c) => BANDERAS_FOD.find((b) => b.codigo === c)?.nombre ?? c).join(', ')}`)
    if (pack) {
      lineas.push(
        `Celebration Pack ${pack}${pancarta ? ` · banner "${pancarta}"` : ' · no banner'}${extrasValidos.length ? ` · extras: ${extrasValidos.join(' + ')}` : ''}`,
      )
    }
    if (tarta) lineas.push('We are bringing a cake')
    lineas.push(`Balance on the day: ${efectivo ? 'cash (5% off)' : 'card'}`)
    if (repetidor) lineas.push('I have sailed with Hispaniola before (5% off, to verify)')
    if (notas.trim()) lineas.push(`Notes: ${notas.trim()}`)
    lineas.push(`Estimated total: ${formatoDinero(total)} · 25% deposit ${formatoDinero(deposito)}`)
    if (nombre.trim()) lineas.push(`Name: ${nombre.trim()}`)
    return lineas.join('\n')
  }, [fiesta, p, fecha, invitados, ocasion, musicaPropia, lista, banderas, pack, pancarta, extrasValidos, tarta, efectivo, repetidor, notas, total, deposito, nombre, b, extraBarra])

  const campo = 'w-full border-2 border-fod-linea bg-fod-fondo px-3 py-2.5 text-sm text-fod-texto focus:border-fod-acento focus:outline-none'
  const rotulo = 'mb-1.5 block font-mono text-xs uppercase tracking-wider text-fod-humo'

  return (
    <section id="fod-reserva" className="scroll-mt-24 bg-fod-fondo py-16 text-fod-texto sm:py-24">
      <div className="mx-auto max-w-contenido px-5 sm:px-10">
        <CabeceraFod
          eyebrow={t('Build your party · about 2 minutes')}
          linea1={t('Build your')}
          linea2={t('party.')}
          estilo2="marcado"
          intro={t('Pick a package, choose your date and crew, make it yours. The price on the right updates with every choice. No surprises at the end.')}
        />

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-10">
            {/* 1 · Paquete */}
            <fieldset>
              <legend className="font-fod text-xl font-extrabold uppercase">
                <span className="text-fod-acento">1 · </span>
                {t('Pick your package')}
              </legend>
              <p className="mt-1 text-sm text-fod-humo">
                {tp('Both include the private boat for 3 hours with 2 stops, {playlist} and hotel pick-up. The difference is the food.', {
                  playlist: fiesta.playlist,
                })}
              </p>
              <div role="radiogroup" className="mt-5 grid gap-5 sm:grid-cols-2">
                {paquetes.map((x) => {
                  const sel = x.id === paquete
                  return (
                    <button
                      key={x.id}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      onClick={() => onPaquete(x.id)}
                      className={`relative flex flex-col border-2 p-5 text-left transition-transform ${
                        sel ? 'fod-sombra-2 border-fod-texto bg-fod-acento text-fod-sobre-acento' : 'border-fod-linea bg-fod-panel hover:-translate-y-0.5'
                      }`}
                    >
                      <span className="absolute -top-3 right-4 border-2 border-current bg-fod-fondo px-2 py-0.5 font-mono text-[0.6rem] uppercase text-fod-texto">
                        {t(x.etiqueta)}
                      </span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider opacity-80">{t(x.numero)}</span>
                      <span className="fod-display mt-1 text-4xl">{x.nombre}</span>
                      <span className="fod-display mt-1 text-3xl">{formatoDinero(x.precioBase)}</span>
                      <span className="mt-1 font-mono text-[0.65rem] uppercase opacity-80">{t('whole boat · up to 12 guests')}</span>
                      <ul className="mt-4 space-y-1.5 border-t-2 border-current pt-3 text-sm">
                        {x.incluye.map((i) => (
                          <li key={i}>— {t(i)}</li>
                        ))}
                      </ul>
                      <span className="mt-3 font-mono text-[0.65rem] uppercase opacity-80">
                        + {formatoDinero(x.porPersonaExtra)} {t('per extra guest')}
                      </span>
                      <span className="mt-4 block border-2 border-current py-2 text-center font-fod text-xs font-extrabold uppercase">
                        {sel ? t('✓ Selected') : tp('Choose {nombre}', { nombre: x.nombre })}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* 2 · La barra (25/11). Va pegada al paquete: son las dos mitades
                de lo que se come y se bebe, igual que en las landings de evento. */}
            <fieldset>
              <legend className="font-fod text-xl font-extrabold uppercase">
                <span className="text-fod-acento">2 · </span>
                {t('Choose your bar')}
              </legend>
              <p className="mt-1 text-sm text-fod-humo">
                {t('The Caribbean open bar is included. Upgrades are per guest, for the whole group.')}
              </p>
              <div role="radiogroup" aria-label={t('Open bar')} className="mt-5 grid gap-3 sm:grid-cols-3">
                {BARRAS_EVENTO.map((x) => {
                  const sel = x.id === barra
                  return (
                    <button
                      key={x.id}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      onClick={() => onBarra(x.id)}
                      className={`flex items-center justify-between gap-3 border-2 p-4 text-left ${
                        sel ? 'fod-sombra-2 border-fod-texto bg-fod-acento text-fod-sobre-acento' : 'border-fod-linea bg-fod-panel'
                      }`}
                    >
                      <span className="font-fod text-sm font-extrabold uppercase leading-tight">{t(x.nombre)}</span>
                      <span className="shrink-0 font-mono text-xs">
                        {x.extraPorPersona ? `+${formatoDinero(x.extraPorPersona)} ${t('pp')}` : t('Included')}
                      </span>
                    </button>
                  )
                })}
              </div>
              <a href="#fod-barra" className="mt-3 inline-block text-xs text-fod-acento underline">
                {t('See what each bar pours')}
              </a>
            </fieldset>

            {/* 2 · Fecha y grupo */}
            <fieldset>
              <legend className="font-fod text-xl font-extrabold uppercase">
                <span className="text-fod-acento">3 · </span>
                {t('When, and how many?')}
              </legend>
              <p className="mt-1 text-sm text-fod-humo">
                {t('The price covers the whole boat with 12 guests. Each extra guest adds a fixed amount.')}
              </p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="fod-fecha" className={rotulo}>
                    {t('Date of your party')}
                  </label>
                  <input id="fod-fecha" type="date" min={hoyISO()} value={fecha} onChange={(e) => setFecha(e.target.value)} className={campo} />
                  {diasHasta(fecha) >= DESCUENTOS_FOD.anticipada.dias ? (
                    <p className="mt-2 text-xs text-fod-acento">
                      {t('Booking 30+ days ahead:')} <b>{t('5% off applied')}</b>.
                    </p>
                  ) : null}
                </div>
                <div>
                  <span id="fod-inv-rot" className={rotulo}>
                    {t('Guests, including you')}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={t('One guest less')}
                      onClick={() => cambiarInvitados(invitados - 1)}
                      className="grid size-11 place-items-center border-2 border-fod-texto"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <output aria-live="polite" className="fod-display w-16 text-center text-4xl text-fod-acento">
                      {invitados}
                    </output>
                    <button
                      type="button"
                      aria-label={t('One guest more')}
                      onClick={() => cambiarInvitados(invitados + 1)}
                      className="grid size-11 place-items-center border-2 border-fod-texto"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={PAX_MAX_FOD}
                    value={invitados}
                    aria-labelledby="fod-inv-rot"
                    onChange={(e) => cambiarInvitados(Number(e.target.value))}
                    className="mt-3 w-full accent-fod-acento"
                  />
                  <div className="flex justify-between font-mono text-[0.65rem] text-fod-humo">
                    <span>1</span>
                    <span>{t('12 included')}</span>
                    <span>{t('120 max')}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-fod-humo">
                {t('Up to 120 guests: we assign the right boat for your group. More than 120?')}{' '}
                <a href={`https://wa.me/${WHATSAPP_FOD}`} target="_blank" rel="noopener" className="text-fod-acento underline">
                  {t('Ask us on WhatsApp')}
                </a>
                .
              </p>
            </fieldset>

            {/* 3 · Tu día */}
            <fieldset>
              <legend className="font-fod text-xl font-extrabold uppercase">
                <span className="text-fod-acento">4 · </span>
                {t('Make it yours')}
              </legend>
              <p className="mt-1 text-sm text-fod-humo">{t('None of this changes the price, except how you pay the balance.')}</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <span className={rotulo}>{t('Music on deck')}</span>
                  <div className="grid gap-2">
                    {[false, true].map((propia) => (
                      <label
                        key={String(propia)}
                        className={`flex cursor-pointer gap-3 border-2 p-3 text-sm ${musicaPropia === propia ? 'border-fod-acento' : 'border-fod-linea'}`}
                      >
                        <input type="radio" name="fod-musica" checked={musicaPropia === propia} onChange={() => setMusicaPropia(propia)} className="accent-fod-acento" />
                        <span>
                          <b className="block">{propia ? t('Or your playlist') : tp('Our {marca} mix', { marca: fiesta.marca === 'afro' ? 'Afro' : 'Latin' })}</b>
                          <span className="text-fod-humo">{propia ? t('Bring your mix, we play it on deck') : fiesta.sonido.estilos.join(' · ')}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {musicaPropia ? (
                    <div className="mt-3">
                      <label htmlFor="fod-lista" className={rotulo}>
                        {t('Link to your playlist (Spotify, Apple Music, YouTube)')}
                      </label>
                      <input id="fod-lista" type="url" value={lista} onChange={(e) => setLista(e.target.value)} className={campo} />
                      <p className="mt-1 text-xs text-fod-humo">{t('No link yet? Send it later on WhatsApp.')}</p>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="fod-ocasion" className={rotulo}>
                      {t('What are you celebrating?')}
                    </label>
                    <select id="fod-ocasion" value={ocasion} onChange={(e) => setOcasion(e.target.value)} className={campo}>
                      <option value="">—</option>
                      {OCASIONES_FOD.map((o) => (
                        <option key={o} value={o}>
                          {t(o)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-2 border-fod-linea p-4">
                    <p className="flex items-center justify-between font-fod text-sm font-extrabold uppercase">
                      {t('Celebration Pack')} {pack || ''}
                      <span className={`px-2 py-0.5 font-mono text-[0.6rem] ${pack ? 'fod-pegatina' : 'border border-fod-linea text-fod-humo'}`}>
                        {pack ? t('Included') : t('Locked')}
                      </span>
                    </p>
                    {pack ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label htmlFor="fod-pancarta" className={rotulo}>
                            {t('Banner for your occasion')}
                          </label>
                          <select id="fod-pancarta" value={pancarta} onChange={(e) => setPancarta(e.target.value)} className={campo}>
                            <option value="">{t('No banner')}</option>
                            {PANCARTAS_FOD.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                        {infoPack && infoPack.eligir ? (
                          <div>
                            <span className={rotulo}>{infoPack.eligir > 1 ? t('Choose your two extras') : t('Choose your extra')}</span>
                            <div className="flex flex-wrap gap-2">
                              {infoPack.opciones.map((o) => (
                                <label
                                  key={o}
                                  className={`cursor-pointer border-2 px-3 py-1.5 text-xs ${extrasValidos.includes(o) ? 'border-fod-acento bg-fod-panel' : 'border-fod-linea'}`}
                                >
                                  <input type="checkbox" className="sr-only" checked={extrasValidos.includes(o)} onChange={() => alternarExtra(o)} />
                                  {extrasValidos.includes(o) ? '✓ ' : ''}
                                  {t(o)}
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-fod-humo">{t('Celebration decor comes with parties from US$1,100.')}</p>
                    )}
                    <label className="mt-3 flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={tarta} onChange={(e) => setTarta(e.target.checked)} className="accent-fod-acento" />
                      {t('We are bringing a cake')}
                    </label>
                    <p className="mt-1 text-xs text-fod-humo">{t('No balloons on board: they end up in the sea.')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="fod-notas" className={rotulo}>
                  {t('Favorite artists, allergies, surprises')}
                </label>
                <textarea id="fod-notas" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} className={campo} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                  <span className={rotulo}>{t('How will you pay the balance on the day?')}</span>
                  <div className="flex gap-2">
                    {[false, true].map((cash) => (
                      <label key={String(cash)} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border-2 p-2.5 text-sm ${efectivo === cash ? 'border-fod-acento' : 'border-fod-linea'}`}>
                        <input type="radio" name="fod-saldo" checked={efectivo === cash} onChange={() => setEfectivo(cash)} className="accent-fod-acento" />
                        {cash ? t('Cash on the day') : t('Card on the day')}
                        {cash ? <span className="fod-pegatina px-1.5 font-mono text-[0.6rem]">{t('5% off')}</span> : null}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-3 self-end border-2 border-fod-linea p-2.5 text-sm">
                  <input type="checkbox" checked={repetidor} onChange={(e) => setRepetidor(e.target.checked)} className="accent-fod-acento" />
                  <span>
                    {t('I have sailed with Hispaniola before')}{' '}
                    <span className="text-xs text-fod-humo">{t('5% off, our team verifies it')}</span>
                  </span>
                </label>
              </div>
            </fieldset>
          </div>

          {/* Carrito */}
          <aside className="fod-sombra border-2 border-fod-acento bg-fod-panel p-5 lg:sticky lg:top-24" aria-label={t('Your party')}>
            <p className="flex justify-between font-mono text-xs uppercase tracking-wider">
              <span className="text-fod-humo">{t('Your party')}</span>
              <span className="font-bold text-fod-acento">{fiesta.nombre}</span>
            </p>
            <dl className="mt-4 space-y-1.5 text-sm">
              {[
                [t('Package'), p.nombre],
                [t('Date'), fecha || t('Choose a date')],
                [t('Guests'), String(invitados)],
                [t('Open bar'), t(b.nombre)],
                [t('Celebration'), pack ? `${t('Pack')} ${pack}` : t('From US$1,100')],
                [t('On board'), t('3 hours · 2 stops')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-fod-humo">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
              {banderas.length ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-fod-humo">{t('Flags')}</dt>
                  <dd className="flex flex-wrap justify-end gap-1">
                    {banderas.map((c) => (
                      <img key={c} src={`/fotos/fiesta-on-deck/banderas/${c}.svg`} alt={c.toUpperCase()} className="h-4 w-auto" />
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-4 space-y-1.5 border-t-2 border-fod-linea pt-3 text-xs">
              <div className="flex justify-between">
                <span>
                  {tp('{nombre} package · boat + {n} guests', { nombre: p.nombre, n: Math.min(invitados, PAX_INCLUIDOS_FOD) })}
                </span>
                <span className="tabular-nums">{formatoDinero(p.precioBase)}</span>
              </div>
              {extraInvitados ? (
                <div className="flex justify-between">
                  <span>
                    {tp('{n} extra guests × {precio}', { n: extraInvitados, precio: formatoDinero(p.porPersonaExtra) })}
                  </span>
                  <span className="tabular-nums">{formatoDinero(extraInvitados * p.porPersonaExtra)}</span>
                </div>
              ) : null}
              {extraBarra ? (
                <div className="flex justify-between">
                  <span>
                    {tp('{barra} bar · {n} guests × {precio}', { barra: t(b.nombre), n: invitados, precio: formatoDinero(b.extraPorPersona) })}
                  </span>
                  <span className="tabular-nums">{formatoDinero(extraBarra)}</span>
                </div>
              ) : null}
              {descuentos.map((d) => (
                <div key={d.texto} className="flex justify-between text-fod-acento">
                  <span>
                    {t(d.texto)} −{Math.round(d.pct * 100)}%
                  </span>
                </div>
              ))}
              {pct ? (
                <div className="flex justify-between text-fod-acento">
                  <span>{t('Discounts')}</span>
                  <span className="tabular-nums">−{formatoDinero(bruto - total)}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t-2 border-fod-texto pt-3">
              <span className="font-fod text-sm font-extrabold uppercase">{t('Total')}</span>
              <span className="fod-display text-4xl text-fod-acento tabular-nums">{formatoDinero(total)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="fod-pegatina p-2">
                <span className="block font-mono text-[0.6rem] uppercase">{t('To lock the date · 25%')}</span>
                <b className="fod-display text-xl">{formatoDinero(deposito)}</b>
              </div>
              <div className="border-2 border-fod-texto p-2">
                <span className="block font-mono text-[0.6rem] uppercase">{t('On the day')}</span>
                <b className="fod-display text-xl">{formatoDinero(total - deposito)}</b>
              </div>
            </div>
            <p className="mt-2 text-right font-mono text-[0.65rem] text-fod-humo">
              {formatoDinero(Math.round(total / invitados))} {t('per person')}
            </p>

            <label htmlFor="fod-nombre" className={`${rotulo} mt-4`}>
              {t('First and last name')}
            </label>
            <input id="fod-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />

            <a
              href={`https://wa.me/${WHATSAPP_FOD}?text=${encodeURIComponent(mensaje)}`}
              target="_blank"
              rel="noopener"
              className="fod-boton fod-boton--whatsapp mt-4 w-full"
            >
              {t('Send this booking on WhatsApp')}
            </a>
            <p className="mt-3 text-xs text-fod-humo">
              {t('We confirm availability and the pick-up time at your hotel on WhatsApp. Pay 25% to lock the date; the rest is paid on the day of your party.')}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-fod-humo">
              {['Taxes included', 'Hotel pick-up and drop-off', 'Free cancellation 7+ days before'].map((x) => (
                <li key={x}>✓ {t(x)}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
