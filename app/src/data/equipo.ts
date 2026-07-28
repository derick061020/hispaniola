// Página de Tripulación / Equipo (correcciones v2, plan 05) — 2026-07-27.
//
// ⚠️ ESTA PÁGINA ES UN MOLDE CON PLACEHOLDERS. Léelo antes de tocar nada.
//
// Decisión de Samuel (2026-07-27): la página se construye YA, sin esperar a la
// plantilla real, y se dimensiona «bajo el paraguas de 70 empleados». El número
// exacto no se conoce — el cliente dijo «cerca de 70» en la reunión del 07-24
// (27:57) y su propia maqueta listaba 37. Los contadores de los chips se
// DERIVAN del array (nunca se escriben a mano), así que el día que llegue la
// plantilla real la página se ajusta sola.
//
// Escalera de contenido aplicada (ver correcciones-v2-cliente/planes/00-INDICE.md):
//   1. Web original → los 6 nombres de departamento y sus descripciones son
//      REALES: los escribió el cliente en su PowerPoint.
//   2. Assets repetidos → los retratos rotan entre las fotos de equipo que ya
//      hay en el repo; quien no tiene, cae al fallback de iniciales.
//   3. Lorem ipsum → las frases en primera persona.
//
// ⚠️ POR QUÉ LOS NOMBRES SON GENÉRICOS Y NO LOS DE LA MAQUETA DEL CLIENTE:
// su maqueta traía 37 nombres (Rafael, Carmen, Lola…) con frases en primera
// persona. Esos nombres NO están en la web original — los generó la IA con la
// que él hizo la maqueta. Publicar «Al timón, mi trabajo es que disfrutes
// tranquilo» firmado por «Rafael, Capitán» sería poner una declaración en boca
// de una persona identificable que nunca la dijo. Un lorem ipsum se ve a la
// legua; un nombre verosímil con su frase, no — y se queda para siempre.
// Cuando llegue la plantilla real se sustituye todo esto de una vez.

export type DepartamentoId =
  | 'oficina'
  | 'playa'
  | 'marketing'
  | 'administracion'
  | 'cocina'
  | 'fundacion'

export type Departamento = {
  id: DepartamentoId
  nombre: string
  /** Descripción REAL — la escribió el cliente en su PowerPoint. */
  descripcion: string
  /** Cuánta gente se maqueta en este departamento (suman 70). */
  plantilla: number
}

// Los 6 departamentos y sus descripciones son CONTENIDO REAL del cliente
// (slides 37-42 del PDF v2 + confirmados de viva voz en la reunión, 27:46).
export const DEPARTAMENTOS: Departamento[] = [
  {
    id: 'oficina',
    nombre: 'Operaciones Oficina',
    descripcion: 'Coordinan tu reserva y te responden cuando escribes.',
    plantilla: 11,
  },
  {
    id: 'playa',
    nombre: 'Operaciones Playa',
    descripcion: 'La tripulación que te recibe, guía y cuida en cada salida.',
    plantilla: 21,
  },
  {
    id: 'marketing',
    nombre: 'Marketing & Ventas',
    descripcion: 'Te ayudan a encontrar y armar tu experiencia perfecta.',
    plantilla: 9,
  },
  {
    id: 'administracion',
    nombre: 'Equipo de Administración',
    descripcion: 'Hacen que todo funcione detrás de cámaras.',
    plantilla: 8,
  },
  {
    id: 'cocina',
    nombre: 'Equipo de Cocina',
    descripcion: 'El equipo de la cocina flotante, a bordo y en tierra.',
    plantilla: 12,
  },
  {
    id: 'fundacion',
    // ⚠️ Matiz que conviene no pisar: la fundación es una entidad SIN FINES DE
    // LUCRO separada, así que su gente no son empleados de Hispaniola. El
    // encabezado lo dice («el equipo de la fundación que respaldamos») en vez
    // de listarlos como un departamento más de la plantilla.
    nombre: 'Fundación The Bávaro Reef',
    descripcion: 'Restauran el arrecife y cuidan el mar que navegamos.',
    plantilla: 9,
  },
]

/** Roles por departamento — genéricos y verificables (son puestos, no
 *  personas). Se rotan para dar variedad al molde. */
const ROLES: Record<DepartamentoId, string[]> = {
  oficina: ['Atención al viajero', 'Coordinación de reservas', 'Soporte y recepción'],
  playa: ['Capitán', 'Guía de snorkel', 'Tripulación de cubierta', 'Tour leader'],
  marketing: ['Ejecutivo de ventas', 'Marketing', 'Community & contenido'],
  administracion: ['Administración', 'Contabilidad', 'Recursos humanos'],
  cocina: ['Chef a bordo', 'Ayudante de cocina', 'Logística de alimentos'],
  fundacion: ['Biología marina', 'Restauración de coral', 'Coordinación de proyectos'],
}

/** Retratos reales que YA existen en el repo. Se rotan como placeholder —
 *  que se repitan es intencional y se detecta a simple vista, que es
 *  justamente lo que hace segura esta clase de relleno. */
const RETRATOS = ['equipo-omar', 'equipo-lola', 'equipo-eva', 'equipo-capitan', 'equipo-biologa']

/** Frase de relleno. Lorem ipsum a propósito: NO se pone una frase verosímil
 *  en boca de alguien que no la ha dicho. Ver la cabecera del archivo. */
const FRASE_PLACEHOLDER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pendiente de recoger la frase real de cada persona.'

export type MiembroEquipoV2 = {
  id: string
  nombre: string
  rol: string
  departamento: DepartamentoId
  /** Año de entrada — alimenta el filtro «desde cuándo» que pidió el cliente. */
  desde: number
  /** Años de experiencia — campo que salió en la reunión (28:02: «el capitán
   *  con 15 años de experiencia navegando en Punta Cana»). */
  experiencia: number
  frase: string
  foto: string | null
  responsable: boolean
  /** SIEMPRE true mientras sea molde. El grep de `[placeholder-v2]` y este
   *  flag son lo que impide que esto se publique por olvido. */
  placeholder: true
}

/** Genera la plantilla de molde. Se genera en código —y no a mano— para que
 *  quede claro que es relleno y para que cambiar el tamaño sea cambiar un
 *  número en DEPARTAMENTOS. */
function generarPlantilla(): MiembroEquipoV2[] {
  const gente: MiembroEquipoV2[] = []
  let n = 0
  for (const depto of DEPARTAMENTOS) {
    const roles = ROLES[depto.id]
    for (let i = 0; i < depto.plantilla; i++) {
      n++
      gente.push({
        id: `${depto.id}-${i + 1}`,
        // [placeholder-v2] Nombre genérico evidente. Sustituir por la
        // plantilla real cuando el cliente la mande.
        nombre: `Nombre Apellido ${String(n).padStart(2, '0')}`,
        rol: roles[i % roles.length],
        departamento: depto.id,
        desde: 2012 + (i % 13),
        experiencia: 2 + (i % 18),
        frase: FRASE_PLACEHOLDER,
        // [placeholder-v2] Retratos repetidos; 1 de cada 3 sin foto para
        // ejercitar el fallback de iniciales, que es como se verá la mayoría
        // hasta que lleguen los 70 retratos (y su consentimiento).
        foto: i % 3 === 2 ? null : RETRATOS[i % RETRATOS.length],
        responsable: i === 0,
        placeholder: true,
      })
    }
  }
  return gente
}

export const EQUIPO_COMPLETO: MiembroEquipoV2[] = generarPlantilla()

/** El total se DERIVA del array, nunca se escribe a mano: el cliente no ha
 *  confirmado si son 37 o 70 y este número tiene que seguir al dato. */
export const TOTAL_EQUIPO = EQUIPO_COMPLETO.length

export function contarPorDepartamento(id: DepartamentoId): number {
  return EQUIPO_COMPLETO.filter((m) => m.departamento === id).length
}

export const EQUIPO_PAGINA = {
  eyebrow: 'Nuestro equipo',
  titulo: 'Las personas detrás de cada tour',
  // El lead de la maqueta del cliente decía «Gerencia española afincada en
  // Punta Cana desde 2012 y un gran equipo dominicano que vive el mar
  // contigo». El dato RD + España SÍ se publica ahora (ver `datos`, pedido de
  // Samuel 2026-07-28), pero como dato de la franja, no como frase del hero:
  // aquí sigue el lead que dice solo lo que describe la página.
  lead: 'Un equipo repartido en seis departamentos que hacen posible tu día perfecto: desde quien te responde cuando escribes hasta quien cocina frente a ti en el mar.',
  // Franja compacta bajo el hero (slide 37 del PDF v2 — los cuatro datos y su
  // redacción son del cliente). Los dos primeros valores se DERIVAN del array,
  // como todos los contadores de esta página; los dos últimos son texto fijo.
  //
  // El «≈» del total NO es adorno: el cliente dijo «cerca de 70» de viva voz y
  // su maqueta listaba 37. Mientras la plantilla real no llegue, el número es
  // una aproximación y se enseña como tal.
  datos: [
    { id: 'personas', valor: `≈ ${TOTAL_EQUIPO}`, etiqueta: 'personas en el equipo' },
    { id: 'departamentos', valor: `${DEPARTAMENTOS.length} departamentos`, etiqueta: 'de oficina al mar' },
    { id: 'desde', valor: 'Desde 2012', etiqueta: 'creciendo juntos' },
    // ⚠️ Este es el único dato de la franja que afirma algo sobre la EMPRESA y
    // no sobre esta página. No estaba en la web original — sale de la maqueta
    // del cliente (slide 37) y se publica por pedido explícito de Samuel
    // (2026-07-28: «que el equipo es de RD y España»). Si el cliente lo
    // desmiente, es lo primero que cae.
    { id: 'origen', valor: 'RD + España', etiqueta: 'equipo local y gerencia' },
  ],
  // El muro de retratos (equipo/muro-tripulacion.tsx) NO tiene copy: es solo
  // los dos tickers, sin eyebrow ni titular ni descripción (2ª vuelta del
  // 2026-07-28, pedido de Samuel). Aquí vivían `muroEyebrow` y `muroLead`, y
  // se retiran con la cabecera en vez de quedarse huérfanos.
  cierreEyebrow: 'Trabaja con nosotros',
  cierreTitulo: '¿Quieres remar con nosotros?',
  // Foto de fondo del banner de cierre (equipo/cierre-equipo.tsx). Mar abierto
  // y vela: es la toma más UNIFORME de las disponibles, y en un banner con el
  // texto centrado eso es lo que decide. Se probaron 6 candidatas; las de
  // grupo (hero-catamaran-1, galeria-semi-privado-6) traen un cielo muy claro
  // justo en la banda donde cae el eyebrow —la parte del degradado que solo
  // tapa un 35%— y ahí el texto se despega. Y footer-oceano queda descartada
  // por vecindad: es el fondo del Footer, tres centímetros más abajo.
  //
  // La comparte con el cierre de /por-que-reservar, y está bien que así sea:
  // es el mismo componente cerrando dos páginas, no un descuido.
  cierreFoto: 'hero-catamaran-2',
  cierreTexto:
    'Siempre buscamos gente que ame el mar y el trato de verdad con las personas. Si es lo tuyo, cuéntanos quién eres.',
  // El botón de la maqueta decía «Ver vacantes», pero /trabaja-con-nosotros no
  // lista vacantes — es un formulario abierto. Un botón que promete vacantes y
  // no las da es la clase de promesa pequeña que este proyecto evita, así que
  // se usa la frase que el propio cliente escribió debajo.
  cierreCta: 'Cuéntanos quién eres',
} as const
