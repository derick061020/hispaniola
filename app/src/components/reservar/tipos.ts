// Tipos compartidos del funnel de reserva (/reservar/:slug, Fase C). Viven
// aparte para que los pasos y la página los importen sin ciclos (la página
// importa los pasos; los pasos importan solo estos tipos).

export type Paquete = 'light' | 'premium'

export type DatosRecogida = { hotel: string; habitacion: string; notas: string }

export type DatosContacto = { nombre: string; email: string; telefono: string }
