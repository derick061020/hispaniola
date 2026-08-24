import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { PasoMenu } from '@/components/reservar/paso-menu'
import { PasoRecogida } from '@/components/reservar/paso-recogida'
import { BannerPremium } from '@/components/reservar/banner-premium'
import { PasoContacto } from '@/components/reservar/paso-contacto'
import { PasoPago } from '@/components/reservar/paso-pago'
import { ResumenReserva } from '@/components/reservar/resumen-reserva'
import { BarraMovilReserva } from '@/components/reservar/barra-movil-reserva'
import { etiquetaOcasion, type DatosCelebracion, type DatosContacto, type DatosRecogida, type Paquete } from '@/components/reservar/tipos'
import { maxPersonasDe } from '@/components/tour/widget-reserva'
import { formatoDinero, TOURS, type Tour } from '@/data/home'
import { FICHAS, type FichaTour } from '@/data/tours'
import { guardarReserva, generarCodigoReserva, type Reserva } from '@/lib/reservas'
import { menuDeLaReserva } from '@/lib/menu-reserva'

// Funnel de reserva (/reservar/:slug, Fase C). El widget de la ficha es el
// CONFIGURADOR (paquete · fecha · hora · personas); «Continuar» abre aquí, con
// esa config en la URL. La FRONTERA del build es el depósito: el motor de
// reservas (xpotours) sigue pendiente de decisión del cliente, así que se
// construye como PROTOTIPO de UX y el «pagar» no cobra (lo dice el paso 4).
//
// LAYOUT estilo Viator (2026-07-17, pedido de Samuel): 2 zonas — a la IZQUIERDA
// (blanca) las secciones que se rellenan en acordeón (la activa expandida, las
// hechas colapsadas con resumen + «Editar», las pendientes en gris; SeccionPaso
// abajo), a la DERECHA la tarjeta «qué estás comprando». TODA la zona derecha es
// GRIS a sangre hasta el borde del viewport y a altura completa (no solo un box
// alrededor de la card) — ver el ::after de la celda derecha. Header MÍNIMO (solo
// logo + selector de moneda, sin Header/megamenú del sitio ni topbar de
// contacto/idioma — todo eso invita a salir a mitad de un checkout). Lo que NO se
// copia de Viator: su urgencia inventada (contador de plaza, «reservado 5+
// veces»), prohibida por revision-wireframes.md §2.7. `noindex`.

// Orden de las secciones (2026-07-17, Samuel): contacto primero, luego el menú.
//
// [2026-08-07] Las secciones dejan de ser una lista fija de 4 y el paso activo
// deja de ser un ÍNDICE: ahora es un id. El motivo es que «Your menu» ya no
// existe en todos los tours (ver lib/menu-reserva.ts — Saona sirve buffet y el
// charter pasa a buffet de pinchos a partir de 21 personas), y en el charter
// puede APARECER Y DESAPARECER sin recargar, porque el nº de personas se edita
// en la tarjeta de al lado. Con índices, subir de 20 a 21 personas movía el
// flujo al paso equivocado; con ids, la numeración se recalcula sola.
type PasoId = 'contacto' | 'menu' | 'recogida' | 'pago'
const TITULOS: Record<PasoId, string> = {
  contacto: 'Contact',
  menu: 'Your menu',
  recogida: 'Pickup',
  pago: 'Payment',
}

export function ReservarPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const tour = TOURS.find((t) => t.slug === slug)
  const ficha = slug ? FICHAS[slug] : undefined

  // El funnel solo existe para tours 'completo' (se venden por fecha+paquete).
  // Charter cotiza y Saona consulta → de vuelta a su ficha (o a la home).
  if (!tour || !ficha || tour.booking !== 'completo' || tour.precioLight === null) {
    return <Navigate to={slug ? `/tours/${slug}` : '/'} replace />
  }

  // Config que trae el widget en la URL; defaults sensatos si se entra directo.
  // Desde 2026-08-07 la URL es solo el VALOR INICIAL: fecha y personas se
  // pueden cambiar ya dentro del funnel (ResumenReserva), sin volver a la ficha.
  const paquete: Paquete = params.get('paquete') === 'premium' ? 'premium' : 'light'
  const horarioIdx = Number(params.get('horario')) || 0
  const fechaISO = params.get('fecha')
  // La SUB-VARIANTE (el bote, en Saona y en el charter). El widget la manda
  // desde siempre; hasta hoy el funnel la ignoraba. Ahora hace falta: es lo que
  // decide qué carta del charter se come (3 h, 4 h o buffet de pinchos).
  const variante = params.get('variante')
  // Mismo tope que el stepper del widget de la ficha, con la misma fórmula
  // (maxPersonasDe): antes aquí había una copia que topaba en 6 salvo tarifa
  // dual, así que un charter de 30 personas entraba al checkout como uno de 6.
  const maxPersonas = maxPersonasDe(tour, ficha)
  const personas = Math.min(Math.max(Number(params.get('personas')) || 2, 1), maxPersonas)

  return (
    <FlujoReserva
      tour={tour}
      ficha={ficha}
      precioLight={tour.precioLight}
      paqueteInicial={paquete}
      varianteInicial={variante}
      personasIniciales={personas}
      maxPersonas={maxPersonas}
      horarioInicial={horarioIdx}
      fechaInicialISO={fechaISO}
    />
  )
}

// El estado del flujo vive aquí (no en ReservarPage) para que sus hooks nunca
// queden detrás del early-return del guard: ReservarPage garantiza tour/ficha
// válidos antes de montar este componente.
function FlujoReserva({
  tour,
  ficha,
  precioLight,
  paqueteInicial,
  varianteInicial,
  personasIniciales,
  maxPersonas,
  horarioInicial,
  fechaInicialISO,
}: {
  tour: Tour
  ficha: FichaTour
  precioLight: number
  paqueteInicial: Paquete
  /** Sub-variante (bote) elegida en el widget; null en los tours sin ellas. */
  varianteInicial: string | null
  personasIniciales: number
  maxPersonas: number
  horarioInicial: number
  fechaInicialISO: string | null
}) {
  const navigate = useNavigate()

  const [paso, setPaso] = useState<PasoId>('contacto')
  // El PAQUETE también es estado desde 2026-08-07: el banner de upsell lo cambia
  // sin salir del checkout (antes había que volver a la ficha).
  const [paquete, setPaquete] = useState<Paquete>(paqueteInicial)
  const [horarioIdx, setHorarioIdx] = useState(horarioInicial)
  const horario = ficha.horarios[horarioIdx] ?? ficha.horarios[0]
  // Fecha y personas son ESTADO desde 2026-08-07 (antes: props de solo lectura
  // leídas de la URL). Cambiarlas aquí evita el viaje de vuelta a la ficha —y,
  // en el caso de la fecha, cierra un agujero: entrando directo a /book/:slug
  // se podía completar el flujo entero sin haber elegido día.
  const [personas, setPersonas] = useState(personasIniciales)
  const [fechaISO, setFechaISO] = useState<string | null>(fechaInicialISO)
  // Empieza SIN plato elegido (2026-07-17, Samuel): cada persona lo escoge
  // activamente en su card. «Continuar» del paso 1 se habilita al elegir todos.
  const [platos, setPlatos] = useState<string[]>(() => Array.from({ length: personasIniciales }, () => ''))
  const [recogida, setRecogida] = useState<DatosRecogida>({ hotel: '', notas: '' })
  const [contacto, setContacto] = useState<DatosContacto>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
  })
  const [celebracion, setCelebracion] = useState<DatosCelebracion>({ ocasion: null, nota: '' })

  const upgrade = paquete === 'premium' && ficha.upgradePremium !== null ? ficha.upgradePremium : 0
  const total = (precioLight + upgrade) * personas
  const deposito = Math.round(total * 0.25)
  const saldo = total - deposito

  // QUÉ COME ESTE GRUPO. Resuelto en un solo sitio (lib/menu-reserva.ts) a
  // partir del paquete, del bote y del aforo — los tres datos que pueden
  // cambiarlo, y los tres editables sin salir de esta pantalla.
  const menu = menuDeLaReserva({ ficha, paquete, variante: varianteInicial, personas })
  // El paso «Your menu» SOLO existe si hay algo que elegir. Con buffet (Saona,
  // charter de 21+) o con una carta de un plato no se le pide una decisión a
  // quien no tiene ninguna: la comida se enseña en la tarjeta de la derecha.
  const hayPasoMenu = menu?.modo === 'eleccion'
  const pasos: PasoId[] = ['contacto', ...(hayPasoMenu ? (['menu'] as const) : []), 'recogida', 'pago']
  // Si el paso activo deja de existir —subir a 21 personas en el charter quita
  // el del menú— el flujo cae al siguiente que sí existe en vez de quedarse en
  // un acordeón sin ninguna sección abierta.
  const pasoActivo: PasoId = pasos.includes(paso) ? paso : 'recogida'
  const indiceDe = (id: PasoId) => pasos.indexOf(id)
  const siguienteDe = (id: PasoId): PasoId => pasos[indiceDe(id) + 1] ?? 'pago'
  const estadoDe = (id: PasoId): EstadoSeccion => {
    const i = indiceDe(id)
    const activo = indiceDe(pasoActivo)
    return i < activo ? 'done' : i === activo ? 'activo' : 'pendiente'
  }

  // Cambiar el nº de personas re-dimensiona la lista de platos conservando los
  // ya elegidos. Si el grupo CRECE y el paso del menú ya estaba cerrado, el
  // flujo vuelve a él: el comensal nuevo no tiene plato y salir a pagar con un
  // menú incompleto sería una reserva que la cocina no puede preparar.
  const cambiarPersonas = (n: number) => {
    setPersonas(n)
    setPlatos((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ''))
    // Se recalcula con el aforo NUEVO: en el charter, crecer hasta 21 elimina
    // el paso del menú (pasa a buffet), así que devolver el flujo ahí sería
    // mandarlo a una sección que ya no existe.
    const menuNuevo = menuDeLaReserva({ ficha, paquete, variante: varianteInicial, personas: n })
    if (n > personas && menuNuevo?.modo === 'eleccion' && indiceDe(pasoActivo) > indiceDe('menu')) {
      setPaso('menu')
    }
  }

  // Subir a Premium desde el banner. Los platos elegidos se BORRAN porque las
  // dos cartas no comparten platos: conservarlos dejaría en la reserva nombres
  // que ya no existen en el menú que se va a cocinar. No devuelve al paso del
  // menú a la fuerza —desde 2026-08-07 elegir plato es opcional— pero el
  // resumen de ese paso vuelve a decir «Por confirmar» y el aviso del correo
  // sigue en pie, así que el visitante ve que hay algo que puede reelegir.
  const subirAPremium = () => {
    setPaquete('premium')
    setPlatos((prev) => prev.map(() => ''))
  }

  // "Pagar" — persiste la reserva en localStorage y navega a la pantalla
  // de confirmación. No hay backend todavía (PLAN-LANZAMIENTO Bloque A),
  // así que la "reserva" vive en el navegador del cliente hasta que se
  // conecte Odoo/xpotours. Cuando exista backend, este handler será
  // `onClick={async () => await api.createReserva(reserva)}` y la nav
  // se hace con el codigo que devuelva el server.
  const handlePagar = () => {
    const codigo = generarCodigoReserva()
    const reserva: Reserva = {
      codigo,
      slug: tour.slug,
      tour: {
        nombre: tour.nombre,
        audienciaChip: tour.audienciaChip,
        duracionCorta: tour.duracionCorta,
        maxPax: tour.maxPax,
        precioLight: tour.precioLight,
      },
      ficha: {
        menuLight: ficha.menuLight,
        menuPremium: ficha.menuPremium,
        // [2026-08-07] Los 3 campos nuevos son lo que necesita el resolutor de
        // menú (lib/menu-reserva.ts) para contestar lo MISMO en «Gracias» y en
        // «Mi reserva» que aquí: sin ellos, esas pantallas volvían a caer en
        // menuLight/menuPremium —vacíos en Saona y en el charter— y pintaban un
        // menú inexistente que además se podía «editar».
        menuBuffet: ficha.menuBuffet,
        menuCharter: ficha.menuCharter,
        subVariantes: ficha.subVariantes,
        horarios: ficha.horarios,
        upgradePremium: ficha.upgradePremium,
      },
      paquete,
      variante: varianteInicial ?? undefined,
      personas,
      horarioIdx,
      fechaISO: fechaISO ?? new Date().toISOString().slice(0, 10),
      // Sin elección de plato (buffet), la lista va VACÍA en vez de con N
      // huecos: no hay nada pendiente de confirmar y las pantallas de después
      // no deben pedirlo.
      platos: hayPasoMenu ? platos : [],
      recogida: { hotel: recogida.hotel.trim(), notas: recogida.notas.trim() },
      contacto: {
        nombre: contacto.nombre.trim(),
        apellidos: contacto.apellidos.trim(),
        email: contacto.email.trim(),
        telefono: contacto.telefono.trim(),
      },
      // Solo viaja si hay algo que celebrar: `ninguna` es una respuesta válida
      // en pantalla, pero guardarla no aporta nada a la tripulación.
      ...(celebracion.ocasion && celebracion.ocasion !== 'ninguna'
        ? { celebracion: { ocasion: celebracion.ocasion, nota: celebracion.nota.trim() } }
        : {}),
      total,
      deposito,
      saldo,
      fechaCreacionISO: new Date().toISOString(),
    }
    guardarReserva(reserva)
    navigate(`/book/${tour.slug}/thank-you?codigo=${codigo}`)
  }

  // [2026-08-21, auditoría móvil] LA ACCIÓN DEL PASO ACTIVO, EN UN SOLO SITIO.
  // Hasta hoy cada sección se traía su propio botón dentro del acordeón, y en
  // móvil eso significaba que el botón se iba de pantalla en cuanto la sección
  // crecía (el paso de contacto mide ~1.100px con las píldoras de celebración
  // abiertas). Describir aquí el CTA —texto, si está habilitado y qué hace—
  // permite que la barra fija de abajo lo lleve sin duplicar ninguna regla:
  // los botones de dentro y el de la barra leen EXACTAMENTE lo mismo, así que
  // no pueden desincronizarse.
  const ctaPaso: { texto: string; habilitado: boolean; accion: () => void } =
    pasoActivo === 'contacto'
      ? {
          texto: 'Continue',
          habilitado: contacto.nombre.trim() !== '' && contacto.email.trim() !== '',
          accion: () => setPaso(siguienteDe('contacto')),
        }
      : pasoActivo === 'menu'
        ? {
            // Mismo copy que el botón de dentro: el menú dejó de ser obligatorio
            // (2026-08-07), pero el texto tiene que decir que se avanza sin
            // haber elegido — si no, se avanza creyendo que ya está hecho.
            texto: platos.every((p) => p) ? 'Continue' : 'Continue and pick the menu later',
            habilitado: true,
            accion: () => setPaso(siguienteDe('menu')),
          }
        : pasoActivo === 'recogida'
          ? {
              texto: 'Continue',
              habilitado: recogida.hotel.trim() !== '',
              accion: () => setPaso(siguienteDe('recogida')),
            }
          : {
              texto: `Pay deposit · ${formatoDinero(deposito)}`,
              habilitado: fechaISO !== null,
              accion: handlePagar,
            }

  // [2026-08-21, auditoría móvil] AL AVANZAR, LLEVAR AL PASO NUEVO. Pulsar
  // «Continuar» abría la sección siguiente pero dejaba el scroll donde estaba:
  // en móvil el acordeón recién abierto nacía por debajo del borde inferior de
  // la pantalla, así que la respuesta visible al clic era que la sección de
  // arriba se plegaba y no pasaba nada más. Ahora el paso nuevo sube al borde
  // superior.
  //
  // ⚠️ Se guarda EL PASO ANTERIOR, no un booleano de «primer render». Con un
  // booleano esto se rompe en desarrollo: `StrictMode` (main.tsx) monta y
  // ejecuta los efectos DOS VECES, así que la primera pasada gastaba el flag y
  // la segunda scrolleaba — al abrir el checkout la página aparecía ya bajada
  // al paso 1, tapando justo la tarjeta del resumen que en móvil se pone la
  // primera a propósito. Comparando el valor no hay nada que gastar: si el
  // paso no ha cambiado, no se scrollea, se ejecute el efecto las veces que se
  // ejecute.
  const pasoPrevio = useRef(pasoActivo)
  useEffect(() => {
    if (pasoPrevio.current === pasoActivo) return
    pasoPrevio.current = pasoActivo
    document.getElementById(`paso-${pasoActivo}`)?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [pasoActivo])

  // La FECHA ya la pinta el propio campo de calendario del resumen (con su hora
  // de salida), así que esta línea solo añade lo que allí no cabe: el regreso.
  const horarioTxt = horario
    ? `Departure ${horario.hora}${horario.regreso ? ` · back at ${horario.regreso}` : ''}`
    : 'Schedule to be confirmed'

  const cambiarPlato = (persona: number, plato: string) =>
    setPlatos((prev) => prev.map((p, i) => (i === persona ? plato : p)))

  return (
    // overflow-x-clip: recorta el ::after w-screen de la zona gris sin volverse
    // contenedor de scroll (a diferencia de overflow-hidden), así el sticky de
    // la derecha sigue funcionando.
    // [2026-08-21, auditoría móvil] pb reservado para BarraMovilReserva, con
    // la misma fórmula que el resto del sitio: el hueco crece con la zona
    // segura del iPhone, o el pie del checkout queda debajo de la barra.
    <div className="flex min-h-screen flex-col overflow-x-clip bg-papel pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Meta
        titulo={`Book · ${tour.nombre}`}
        descripcion={`Set up your ${tour.nombre}: pick each guest’s dish, the pickup and confirm with just a 25% deposit.`}
        ruta={`/book/${tour.slug}`}
        indexable={false}
      />

      {/* Header MÍNIMO estilo Viator: logo (a la home) + selector de moneda. */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" aria-label="Hispaniola Aquatic Adventures home">
            <Logo compacto />
          </Link>
          {/* Selector de moneda visual (Samuel) — como el «USD» de Viator. Los
              precios del sitio son todos en US$; decorativo, igual que el
              SelectorIdioma del topbar (sin conversión real todavía). */}
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-navy-sub transition-colors hover:text-navy"
          >
            USD
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Grid de 2 zonas. Sin `items-start`: las celdas se ESTIRAN a la misma
            altura (la del formulario, más largo), así el gris de la derecha
            llega hasta abajo. La celda derecha lleva bg gris + un ::after que lo
            extiende w-screen hasta el borde del viewport (recortado por el
            overflow-x-clip de arriba) — «todo el lado derecho gris», no un box. */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
          {/* IZQUIERDA (blanca): cabecera + secciones */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <h1 className="sr-only">Complete your booking: {tour.nombre}</h1>

            <div className="flex flex-col gap-4">
              <SeccionPaso
                id="contacto"
                numero={indiceDe('contacto') + 1}
                titulo={TITULOS.contacto}
                estado={estadoDe('contacto')}
                onEditar={() => setPaso('contacto')}
                resumen={
                  <>
                    <p>
                      <span className="font-medium text-navy">
                        {[contacto.nombre, contacto.apellidos].filter(Boolean).join(' ') || '—'}
                      </span>
                      {contacto.email ? ` · ${contacto.email}` : ''}
                      {contacto.telefono ? ` · ${contacto.telefono}` : ''}
                    </p>
                    {etiquetaOcasion(celebracion.ocasion) ? (
                      <p className="mt-0.5 text-coral">
                        {etiquetaOcasion(celebracion.ocasion)}
                        {celebracion.nota.trim() ? ` · ${celebracion.nota.trim()}` : ''}
                      </p>
                    ) : null}
                  </>
                }
              >
                <PasoContacto
                  datos={contacto}
                  onCambio={(parcial) => setContacto((c) => ({ ...c, ...parcial }))}
                  celebracion={celebracion}
                  onCambioCelebracion={(parcial) => setCelebracion((c) => ({ ...c, ...parcial }))}
                />
                <Continuar
                  habilitado={contacto.nombre.trim() !== '' && contacto.email.trim() !== ''}
                  onClick={() => setPaso(siguienteDe('contacto'))}
                />
              </SeccionPaso>

              {/* El paso del menú SOLO se monta si hay platos que elegir. Sin
                  él la numeración se recorre sola (los índices salen de
                  `pasos`), que es justo lo que arregla el bug de Saona: antes
                  aparecía un paso 2 con la rejilla vacía. */}
              {hayPasoMenu && menu ? (
                <SeccionPaso
                  id="menu"
                  numero={indiceDe('menu') + 1}
                  titulo={TITULOS.menu}
                  estado={estadoDe('menu')}
                  onEditar={() => setPaso('menu')}
                  resumen={
                    <ul className="flex flex-col gap-0.5">
                      {platos.map((p, i) => (
                        <li key={i}>
                          <span className="text-navy-soft">Guest {i + 1}:</span>{' '}
                          {p ? (
                            <span className="font-medium text-navy">{p}</span>
                          ) : (
                            <span className="text-navy-soft">to be confirmed by email</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <PasoMenu menu={menu} seleccion={platos} onCambio={cambiarPlato} />
                  {/* Siempre habilitado (2026-08-07): el menú dejó de ser un
                      requisito para reservar. El botón cambia de texto para que
                      nadie avance creyendo que ya eligió. */}
                  <Continuar
                    habilitado
                    texto={platos.every((p) => p) ? 'Continue' : 'Continue and pick the menu later'}
                    onClick={() => setPaso(siguienteDe('menu'))}
                  />
                </SeccionPaso>
              ) : null}

              <SeccionPaso
                id="recogida"
                numero={indiceDe('recogida') + 1}
                titulo={TITULOS.recogida}
                estado={estadoDe('recogida')}
                onEditar={() => setPaso('recogida')}
                resumen={
                  <p>
                    <span className="font-medium text-navy">{recogida.hotel || '—'}</span>
                  </p>
                }
              >
                <PasoRecogida
                  datos={recogida}
                  onCambio={(parcial) => setRecogida((r) => ({ ...r, ...parcial }))}
                  horaSalida={horario?.hora ?? null}
                />
                <Continuar
                  habilitado={recogida.hotel.trim() !== ''}
                  onClick={() => setPaso(siguienteDe('recogida'))}
                />
              </SeccionPaso>

              <SeccionPaso id="pago" numero={indiceDe('pago') + 1} titulo={TITULOS.pago} estado={estadoDe('pago')}>
                <PasoPago
                  deposito={deposito}
                  saldo={saldo}
                  fechaElegida={fechaISO !== null}
                  onPagar={handlePagar}
                />
              </SeccionPaso>
            </div>
          </div>

          {/* DERECHA: zona GRIS a sangre (bg + ::after w-screen), altura completa.
              En MÓVIL va PRIMERA (order-first): ahí no hay dos columnas, y con la
              tarjeta al final el visitante rellenaba el formulario entero sin ver
              qué compra, cuánto paga hoy ni el stepper de personas que ahora vive
              dentro. En desktop no cambia nada (lg:order-none). */}
          <div className="relative order-first bg-fondo-ficha px-5 py-8 sm:px-8 sm:py-10 lg:order-none lg:after:absolute lg:after:inset-y-0 lg:after:left-full lg:after:w-screen lg:after:bg-fondo-ficha lg:after:content-['']">
            {/* [2026-08-21, auditoría móvil] `flex flex-col` + `order` para poder
                INVERTIR el orden en móvil sin tocar el desktop. En desktop el
                banner va arriba de la tarjeta, como pidió Samuel el 2026-08-07.
                En móvil esa misma pila hacía que lo PRIMERO de todo el checkout
                fuese un upsell negro a pantalla completa (medido: 550px, más de
                media pantalla de un iPhone) — se pedía subir de plan antes de
                haber visto qué se compra ni cuánto vale. Con el orden invertido
                se lee en el orden natural: esto es lo que llevas, esto cuesta,
                ¿lo quieres mejor? El banner sigue estando por encima del
                formulario, que es lo que importa para que se vea. */}
            <div className="flex flex-col lg:sticky lg:top-6">
              {/* Banner de upgrade ARRIBA de la tarjeta (2026-08-07, pedido de
                  Samuel). Solo con Light elegido y solo si el tour publica
                  upgrade y ventajas — en Premium desaparece porque ya no hay
                  nada que ofrecer, igual que la caja del widget de la ficha. */}
              {paquete === 'light' && ficha.upgradePremium !== null && ficha.ventajasPremium?.length ? (
                <BannerPremium
                  className="order-2 mt-4 lg:order-none lg:mt-0"
                  upgrade={ficha.upgradePremium}
                  personas={personas}
                  totalActual={total}
                  ventajas={ficha.ventajasPremium}
                  onCambiar={subirAPremium}
                />
              ) : null}
              <ResumenReserva
                className="order-1 lg:order-none"
                tour={tour}
                fechaISO={fechaISO}
                onFecha={setFechaISO}
                horarios={ficha.horarios}
                horarioIdx={horarioIdx}
                onHorario={setHorarioIdx}
                horarioTxt={horarioTxt}
                horaSalida={horario?.hora ?? null}
                menu={menu}
                personas={personas}
                minPersonas={1}
                maxPersonas={maxPersonas}
                onPersonas={cambiarPersonas}
                conceptoBase={
                  ficha.upgradePremium !== null
                    ? `${upgrade > 0 ? 'Light' : paquete === 'premium' ? 'Premium' : 'Light'} menu`
                    : 'Tour fare'
                }
                precioBase={precioLight}
                upgrade={upgrade}
                total={total}
                deposito={deposito}
                saldo={saldo}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-linea py-6 text-center text-xs text-navy-soft">
        Hispaniola Aquatic Adventures · Secure direct booking · Free cancellation up to 7 days before
      </footer>

      {/* Precio + acción del paso activo, siempre a la vista en móvil. */}
      <BarraMovilReserva
        deposito={deposito}
        total={total}
        texto={ctaPaso.texto}
        habilitado={ctaPaso.habilitado}
        onAccion={ctaPaso.accion}
      />
    </div>
  )
}

type EstadoSeccion = 'done' | 'activo' | 'pendiente'

// Una sección del acordeón (columna izquierda). Activa = formulario expandido;
// hecha = colapsada con su resumen + «Editar»; pendiente = cabecera en gris.
function SeccionPaso({
  id,
  numero,
  titulo,
  estado,
  onEditar,
  resumen,
  children,
}: {
  /** Ancla del paso — el auto-scroll al avanzar la busca por `paso-${id}`. */
  id: PasoId
  numero: number
  titulo: string
  estado: EstadoSeccion
  onEditar?: () => void
  resumen?: ReactNode
  children?: ReactNode
}) {
  return (
    <section
      id={`paso-${id}`}
      // scroll-mt-4: el auto-scroll deja el paso pegado al borde superior; sin
      // este respiro la card se lee como si estuviera cortada por arriba.
      className={`scroll-mt-4 overflow-hidden rounded-card-grande border bg-papel ${
        estado === 'activo' ? 'border-linea-fuerte' : 'border-linea'
      }`}
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
              estado === 'pendiente' ? 'bg-papel-hueso text-navy-soft ring-1 ring-linea' : 'bg-navy text-white'
            }`}
          >
            {estado === 'done' ? <Check className="size-4" aria-hidden="true" /> : numero}
          </span>
          <h2
            className={`font-display text-lg font-semibold ${estado === 'pendiente' ? 'text-navy-soft' : 'text-navy'}`}
          >
            {titulo}
          </h2>
        </div>
        {estado === 'done' && onEditar ? (
          <button
            type="button"
            onClick={onEditar}
            className="shrink-0 text-sm font-medium text-aqua-dark transition-colors hover:text-aqua"
          >
            Edit
          </button>
        ) : null}
      </header>

      {estado === 'activo' ? <div className="border-t border-linea px-5 py-5 sm:px-6">{children}</div> : null}
      {estado === 'done' && resumen ? (
        <div className="border-t border-linea px-5 py-4 text-sm text-navy-sub sm:px-6">{resumen}</div>
      ) : null}
    </section>
  )
}

function Continuar({
  habilitado,
  texto = 'Continue',
  onClick,
}: {
  habilitado: boolean
  /** Texto del botón; el paso del menú lo cambia cuando se avanza sin elegir. */
  texto?: string
  onClick: () => void
}) {
  return (
    // [2026-08-21, auditoría móvil] `max-lg:hidden`: por debajo de lg este
    // botón NO se pinta — la acción del paso activo la lleva
    // BarraMovilReserva, fija abajo. Con los dos a la vez habría dos
    // «Continuar» idénticos en la misma pantalla, y este se va de vista en
    // cuanto la sección crece. Los dos leen el MISMO descriptor (`ctaPaso`),
    // así que no pueden decir cosas distintas.
    <div className="mt-5 max-lg:hidden">
      <FancyButton.Root variant="primary" disabled={!habilitado} onClick={onClick}>
        {texto}
      </FancyButton.Root>
    </div>
  )
}
