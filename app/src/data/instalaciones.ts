// Página de Instalaciones (correcciones v2, plan 06) — 2026-07-27.
//
// El argumento de la página, en palabras del propio cliente: «Mucho más que una
// empresa de excursiones: un complejo completo en Punta Cana». Es una página de
// CREDIBILIDAD — enseña que detrás del tour hay laboratorio, museo, cocinas
// propias y oficinas. Cualquiera dice que restaura coral; tener laboratorio
// propio es verificable.
//
// ✅ EL COPY DE LAS 6 ZONAS ES REAL: lo escribió el cliente en su PowerPoint
// (slides 46-49). Es la parte más valiosa de esas slides y se usa tal cual.
//
// ⚠️ LA MEDIA ES PLACEHOLDER. No hay ni una foto de las instalaciones en tierra
// en el repo. Decisión de Samuel (2026-07-27): la página se construye igual,
// con fotos y verticales repetidos del propio repo, y se sustituyen cuando
// lleguen. Se marcan con `[placeholder-v2]`.
//
// ⚠️ EL 360° NO SE FALSEA. Un botón «Ver en 360°» que abre una foto normal
// promete algo que no cumple — es justo el patrón que este proyecto ha evitado
// siempre. `tour360` va ausente hasta que exista el material: la celda
// simplemente no se pinta (2 celdas en vez de 3, sin hueco muerto).
// En la reunión del 07-24 (29:48) el cliente los llamó «vídeo 360», lo que
// sugiere archivo de video y no foto equirectangular — pero sigue sin
// confirmarse si existen o hay que grabarlos.

export type ZonaInstalacion = {
  id: string
  nombre: string
  /** Copy REAL del cliente. */
  descripcion: string
  /** Copy REAL del cliente. */
  bullets: string[]
  /** [placeholder-v2] Foto repetida del repo hasta tener la real. */
  foto: string
  fotoAlt: string
  /** [placeholder-v2] Vertical reutilizado. undefined = no se pinta la celda. */
  vertical?: string
  /** Ausente a propósito: no existe el material. NO poner un placeholder aquí. */
  tour360?: string
}

export const INSTALACIONES = {
  eyebrow: 'Nuestras instalaciones',
  titulo: 'Conócenos por dentro',
  lead: 'Mucho más que una empresa de excursiones: un complejo completo en Punta Cana. Cocinas propias, laboratorio de biología marina, museo al aire libre, tienda y oficinas.',
  seccionTitulo: 'Todo lo que hay detrás de tu experiencia',
  seccionLead:
    'Un complejo, no solo un muelle. Recórrelo zona por zona y mira dónde empieza de verdad tu día en el mar.',
  cierreTitulo: 'Ven a conocernos en persona',
  cierreTexto:
    'Todo esto te espera antes y después de tu tour. Reserva tu día y descubre por qué somos mucho más que una excursión.',
  cierreCta: 'Reserva tu tour',
} as const

export const ZONAS: ZonaInstalacion[] = [
  {
    id: 'recibimiento',
    nombre: 'Zona de recibimiento y presentación del tour',
    descripcion:
      'Te damos la bienvenida, hacemos el check-in y te explicamos el día antes de zarpar. Subes a bordo sabiendo exactamente qué te espera.',
    bullets: [
      'Bienvenida y check-in cómodo',
      'Explicación del tour antes de salir',
      'Zona de espera y baños',
    ],
    // [placeholder-v2] No hay foto de la zona de recibimiento en tierra.
    foto: 'incluye-barco-cenital',
    fotoAlt: 'Placeholder — pendiente de la foto real de la zona de recibimiento',
  },
  {
    id: 'museo',
    nombre: 'Museo exterior marino',
    descripcion:
      'Un museo al aire libre donde conocerás el ecosistema del arrecife y el trabajo de restauración de coral. Le da sentido a todo lo que verás bajo el agua.',
    bullets: [
      'Al aire libre, abierto a visitantes',
      'El ecosistema marino, explicado',
      'El proyecto de restauración de coral',
    ],
    // [placeholder-v2] Foto de arrecife como relleno.
    foto: 'arrecife-fondo-cenital',
    fotoAlt: 'Placeholder — pendiente de la foto real del museo marino',
  },
  {
    id: 'biologia',
    nombre: 'Departamento de biología',
    descripcion:
      'Nuestro laboratorio propio, donde los biólogos marinos cultivan coral y estudian el arrecife para la Fundación The Bávaro Reef. No es marketing: es trabajo real.',
    bullets: [
      'Laboratorio de cultivo de coral',
      'Biólogos marinos en plantilla',
      'Base de la Fundación The Bávaro Reef',
    ],
    // [placeholder-v2] Retrato de la bióloga como relleno.
    foto: 'equipo-biologa',
    fotoAlt: 'Placeholder — pendiente de la foto real del laboratorio',
  },
  {
    id: 'cocinas',
    nombre: 'Cocinas',
    descripcion:
      'Nuestras cocinas en tierra, donde preparamos y controlamos la calidad de todo lo que sube a bordo. De aquí sale lo que el chef cocina frente a ti.',
    bullets: [
      'Higiene y estándares certificados',
      'Producto fresco cada día',
      'Control de calidad antes de zarpar',
    ],
    // [placeholder-v2] La cocina FLOTANTE no es la cocina en tierra — es otra
    // cosa. Se usa como relleno visual, pero no es esta zona.
    foto: 'cocina-flotante',
    fotoAlt: 'Placeholder — pendiente de la foto real de las cocinas en tierra',
  },
  {
    id: 'tienda',
    nombre: 'Tienda de regalos',
    descripcion:
      'A la entrada del complejo, souvenirs, ropa y productos locales para que te lleves un pedacito de tu día en Hispaniola a casa.',
    bullets: [
      'Souvenirs y ropa de la marca',
      'Productos locales dominicanos',
      'A la entrada, fácil de visitar',
    ],
    // [placeholder-v2]
    foto: 'bar-flotante',
    fotoAlt: 'Placeholder — pendiente de la foto real de la tienda',
  },
  {
    id: 'oficinas',
    nombre: 'Oficinas corporativas',
    descripcion:
      'El centro de operaciones desde donde coordinamos reservas, logística y equipo. Aquí trabaja la gente que te responde cuando escribes.',
    bullets: [
      'Coordinación de reservas y atención',
      'Logística y gestión del equipo',
      'El corazón administrativo de Hispaniola',
    ],
    // [placeholder-v2]
    foto: 'equipo-eva',
    fotoAlt: 'Placeholder — pendiente de la foto real de las oficinas',
  },
]
