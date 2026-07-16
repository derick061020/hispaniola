// Página de validación de fundaciones (F0): swatches de paleta + type scale.
// No es parte de la home — sirve para revisar tokens antes de construir bloques.
// Etapa A (PLAN-ALIGNUI.md): también valida la CAPA ALIGNUI (#alignui) — cada
// pieza vendor renderizada con los slots ya tematizados a la paleta Hispaniola.
import { CalendarDays, MessageCircle } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import * as Button from '@/components/alignui/button'
import * as LinkButton from '@/components/alignui/link-button'
import * as Select from '@/components/alignui/select'
import * as Modal from '@/components/alignui/modal'
import * as Badge from '@/components/alignui/badge'
import * as StatusBadge from '@/components/alignui/status-badge'
import * as TabMenu from '@/components/alignui/tab-menu-horizontal'
import * as Divider from '@/components/alignui/divider'
const swatches: { nombre: string; token: string; hex: string; textoClaro?: boolean }[] = [
  { nombre: 'Papel', token: 'papel', hex: '#FFFFFF' },
  { nombre: 'Papel hueso', token: 'papel-hueso', hex: '#F7F9FA' },
  { nombre: 'Navy', token: 'navy', hex: '#0B2545', textoClaro: true },
  { nombre: 'Navy sub', token: 'navy-sub', hex: '#42525F', textoClaro: true },
  { nombre: 'Aqua', token: 'aqua', hex: '#0E8C9C', textoClaro: true },
  { nombre: 'Coral', token: 'coral', hex: '#EF5B44', textoClaro: true },
  { nombre: 'Menta', token: 'menta', hex: '#E7F5EF' },
  { nombre: 'Línea', token: 'linea', hex: '#DFE6EA' },
]

export function FundacionesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Fundaciones — F0</p>
      <h1 className="mt-2 font-display text-h2 font-semibold text-navy">
        v3 — Hero inmersivo
      </h1>
      <p className="mt-2 max-w-prose text-navy-sub">
        Tokens de <code className="text-sm">src/styles/tokens.css</code>. El aqua se usa con
        cuentagotas (ver guardarraíles en <code className="text-sm">analisis/direccion-visual.md</code>) —
        aquí se ve grande solo para validar el tono, no como referencia de proporción real.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Paleta</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.token} className="overflow-hidden rounded-card ring-1 ring-linea">
              <div
                className="flex h-20 items-end p-2"
                style={{ background: `var(--color-${s.token})`, color: s.textoClaro ? `var(--color-papel)` : `var(--color-navy)` }}
              >
                <span className="text-xs font-medium">{s.hex}</span>
              </div>
              <div className="bg-papel p-2">
                <p className="text-sm font-medium text-navy">{s.nombre}</p>
                <p className="font-mono text-[11px] text-navy-soft">--color-{s.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Type scale</h2>
        <div className="mt-4 space-y-6 rounded-card bg-papel p-6 ring-1 ring-linea">
          <div>
            <p className="text-hero font-display font-medium text-navy">Navega el arrecife</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-hero · Poppins</p>
          </div>
          <div>
            <p className="text-h2 font-display font-semibold text-navy">Título de sección</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-h2 · Poppins</p>
          </div>
          <div>
            <p className="text-h3 font-display font-semibold text-navy">Título de card</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-h3 · Poppins</p>
          </div>
          <div>
            <p className="text-lead text-navy-sub">
              Párrafo destacado / lead — 4.9★ en 1.782 reseñas y #1 en TripAdvisor durante 7 años.
            </p>
            <p className="font-mono text-[11px] text-navy-soft">--text-lead · Poppins</p>
          </div>
          <div>
            <p className="text-precio font-semibold text-menta-texto">$99</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-precio · Poppins (sobre fondo menta)</p>
          </div>
          <div>
            <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua-dark">
              Punta Cana · Desde 2012
            </p>
            <p className="font-mono text-[11px] text-navy-soft">--text-eyebrow · Poppins caps</p>
          </div>
          <div>
            <p className="text-stat font-display font-semibold text-navy">91.607</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-stat · Poppins (v3-F11: vive en el hero, junto al CTA)</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
          Forma y sombra — v3 «Hero inmersivo»
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-6 rounded-card bg-papel p-6 ring-1 ring-linea sm:grid-cols-4">
          <div>
            <div className="h-20 rounded-hero bg-papel-hueso ring-1 ring-linea" />
            <p className="mt-2 text-sm font-medium text-navy">Hero</p>
            <p className="font-mono text-[11px] text-navy-soft">--radius-hero · 28px</p>
          </div>
          <div>
            <div className="h-20 rounded-card bg-papel-hueso ring-1 ring-linea" />
            <p className="mt-2 text-sm font-medium text-navy">Card</p>
            <p className="font-mono text-[11px] text-navy-soft">--radius-card · 16px</p>
          </div>
          <div>
            <div className="h-20 rounded-card bg-papel shadow-card" />
            <p className="mt-2 text-sm font-medium text-navy">Ticker (card)</p>
            <p className="font-mono text-[11px] text-navy-soft">--shadow-card · --radius-card</p>
          </div>
          <div>
            <div className="h-20 rotate-[-4deg] rounded-foto bg-papel p-1.5 shadow-polaroid">
              <div className="size-full rounded-foto bg-papel-hueso" />
            </div>
            <p className="mt-2 text-sm font-medium text-navy">Photo-stack</p>
            <p className="font-mono text-[11px] text-navy-soft">--shadow-polaroid · --radius-foto</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-navy-soft">
          Ritmo vertical: <code>--spacing-seccion</code> 7rem (desktop) /{' '}
          <code>--spacing-seccion-sm</code> 4rem (móvil) — cableados como{' '}
          <code>py-seccion</code> en las secciones (en v1 el token existía pero nadie lo usaba).
          Movimiento del ticker: <code>--ticker-duracion</code> 45s y el dock{' '}
          <code>--ticker-dock-*</code>; morph del notch dinámico:{' '}
          <code>--notch-transicion</code> 300ms / <code>--notch-easing</code> — <strong>de aquí
          sale la duración y el easing del prototipo de Figma</strong>, no de ojo.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Botones</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card bg-papel p-6 ring-1 ring-linea">
          <button className="rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark">
            Ver disponibilidad
          </button>
          <button className="rounded-btn border border-aqua px-5 py-2.5 text-sm font-semibold text-aqua transition hover:bg-aqua-tint">
            Nuestros tours
          </button>
          <div className="rounded-card bg-menta px-4 py-2.5">
            <span className="text-xs text-navy-sub">Desde, por persona&nbsp;&nbsp;</span>
            <span className="text-lg font-semibold text-menta-texto">$99</span>
          </div>
        </div>
      </section>

      {/* ── Sistema AlignUI (PLAN-ALIGNUI.md) ─────────────────────────────
          Cada pieza vendor con los slots tematizados: primary = coral (acción),
          information/verified = aqua, success = menta, faded = grises navy.
          Si algo se ve fuera de paleta aquí, el fallo está en alignui.css,
          no en la pieza. */}
      <section id="alignui" className="mt-12 scroll-mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
          Sistema AlignUI — capa de slots sobre tokens Hispaniola
        </h2>
        <p className="mt-2 max-w-prose text-sm text-navy-sub">
          Componentes de <code className="text-sm">src/components/alignui/</code> (vendor Pro,
          copy-in) hablando el vocabulario de <code className="text-sm">styles/alignui.css</code>.
          El chrome de UI de las páginas internas se construye con estas piezas.
        </p>

        <div className="mt-4 space-y-6 rounded-card bg-papel p-6 ring-1 ring-linea">
          <div>
            <p className="font-mono text-[11px] text-navy-soft">FancyButton — primary (coral) · neutral (navy) · basic · disabled</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <FancyButton.Root variant="primary">
                <FancyButton.Icon as={CalendarDays} />
                Continuar — US$ 198
              </FancyButton.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={MessageCircle} />
                WhatsApp
              </FancyButton.Root>
              <FancyButton.Root variant="basic">Ver comparación</FancyButton.Root>
              <FancyButton.Root variant="primary" disabled>
                Elige una fecha
              </FancyButton.Root>
            </div>
          </div>

          <Divider.Root />

          <div>
            <p className="font-mono text-[11px] text-navy-soft">Button — primary/neutral × filled/stroke/lighter/ghost</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button.Root variant="primary" mode="filled">Reservar</Button.Root>
              <Button.Root variant="primary" mode="stroke">Cotizar</Button.Root>
              <Button.Root variant="primary" mode="lighter">Consultar</Button.Root>
              <Button.Root variant="neutral" mode="stroke">Cancelar</Button.Root>
              <Button.Root variant="neutral" mode="ghost">Cerrar</Button.Root>
            </div>
          </div>

          <Divider.Root />

          <div>
            <p className="font-mono text-[11px] text-navy-soft">Select — el reemplazo de los selects nativos del widget (A2)</p>
            <div className="mt-2 flex max-w-xs flex-col gap-3">
              <Select.Root>
                <Select.Trigger>
                  <Select.Value placeholder="Elige un horario" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="0900">09:00 — regreso 13:00</Select.Item>
                  <Select.Item value="1400">14:00 — regreso 18:00</Select.Item>
                </Select.Content>
              </Select.Root>
              <Select.Root size="small" defaultValue="2">
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="1">1 persona</Select.Item>
                  <Select.Item value="2">2 personas</Select.Item>
                  <Select.Item value="3">3 personas</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <Divider.Root />

          <div>
            <p className="font-mono text-[11px] text-navy-soft">
              StatusBadge / Badge — completed=menta · blue→information=aqua · red→error=coral · gray→faded
              (pending/amarillo queda sin mapear a propósito — ver alignui.css)
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge.Root status="completed" variant="light">
                <StatusBadge.Dot />
                Cancelación gratis
              </StatusBadge.Root>
              <StatusBadge.Root status="completed" variant="stroke">
                <StatusBadge.Dot />
                Recogida incluida
              </StatusBadge.Root>
              <StatusBadge.Root status="disabled" variant="stroke">
                <StatusBadge.Dot />
                Precio pendiente
              </StatusBadge.Root>
              <Badge.Root color="blue" variant="light">Semi-privado</Badge.Root>
              <Badge.Root color="green" variant="lighter">Eco-friendly</Badge.Root>
              <Badge.Root color="gray" variant="stroke">Máx. 12</Badge.Root>
              <Badge.Root color="red" variant="filled">Últimas plazas</Badge.Root>
            </div>
          </div>

          <Divider.Root />

          <div>
            <p className="font-mono text-[11px] text-navy-soft">LinkButton — primary/gray/black · TabMenuHorizontal — las anclas de la ficha (A4)</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <LinkButton.Root variant="primary">Ver las 8 fotos</LinkButton.Root>
              <LinkButton.Root variant="gray">Ver comparación</LinkButton.Root>
              <LinkButton.Root variant="black">Gestionar mi reserva</LinkButton.Root>
            </div>
            <div className="mt-4">
              <TabMenu.Root defaultValue="descripcion">
                <TabMenu.List>
                  <TabMenu.Trigger value="descripcion">Descripción</TabMenu.Trigger>
                  <TabMenu.Trigger value="itinerario">Itinerario</TabMenu.Trigger>
                  <TabMenu.Trigger value="menu">Menú</TabMenu.Trigger>
                  <TabMenu.Trigger value="opiniones">Opiniones</TabMenu.Trigger>
                </TabMenu.List>
              </TabMenu.Root>
            </div>
          </div>

          <Divider.Root />

          <div>
            <p className="font-mono text-[11px] text-navy-soft">Modal — la base del lightbox (A3) y de futuros diálogos del funnel</p>
            <div className="mt-2">
              <Modal.Root>
                <Modal.Trigger asChild>
                  <Button.Root variant="neutral" mode="stroke" size="small">
                    Abrir modal de muestra
                  </Button.Root>
                </Modal.Trigger>
                <Modal.Content>
                  <Modal.Header
                    title="¿Cancelar la reserva?"
                    description="Cancelación gratuita hasta 24 h antes de la salida."
                  />
                  <Modal.Body>
                    <p className="text-paragraph-sm text-text-sub-600">
                      Recibirás el reembolso completo por el mismo medio de pago.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Modal.Close asChild>
                      <Button.Root variant="neutral" mode="stroke" size="small" className="w-full">
                        Volver
                      </Button.Root>
                    </Modal.Close>
                    <FancyButton.Root variant="primary" size="small" className="w-full">
                      Confirmar
                    </FancyButton.Root>
                  </Modal.Footer>
                </Modal.Content>
              </Modal.Root>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
