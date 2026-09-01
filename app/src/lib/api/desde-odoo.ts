import { idiomaDelNavegador } from '@/lib/idioma'
import type { Reserva as ReservaLocal } from '@/lib/reservas'
import type { Reserva as ReservaOdoo } from './tipos'
import { FICHAS } from '@/data/tours'
import { TOURS } from '@/data/home'

// Traductor Odoo -> el tipo `Reserva` que ya usan «Gracias» y «Mi reserva».
//
// Existe para que conectar el backend NO obligue a reescribir esas dos
// pantallas: siguen recibiendo exactamente la forma que esperan. El tipo
// `Reserva` de `lib/reservas.ts` se autodeclaraba «el shape que el contrato de
// API tendrá que respetar»; esto es ese contrato, cumplido desde el otro lado.
//
// ⚠️ Odoo NO guarda el catálogo del front (menús, horarios, sub-variantes): eso
// vive en `data/tours.ts` y es de Samuel. Así que la ficha se REHIDRATA desde
// los datos locales por slug, igual que hacía la copia denormalizada que
// `reservar.tsx` metía dentro de cada reserva. Si el slug no existe en el
// catálogo local (un tour retirado, una reserva antigua), se devuelven menús
// vacíos: la pantalla se degrada, no se rompe.

export function reservaDesdeOdoo(odoo: ReservaOdoo): ReservaLocal {
  const slug = odoo.tour.slug ?? ''
  const ficha = FICHAS[slug]
  const tour = TOURS.find((t) => t.slug === slug)

  return {
    codigo: odoo.code,
    slug,
    tour: {
      nombre: tour?.nombre ?? odoo.tour.name,
      audienciaChip: tour?.audienciaChip ?? odoo.tour.audience ?? '',
      duracionCorta: tour?.duracionCorta ?? odoo.tour.duration ?? '',
      maxPax: tour?.maxPax ?? null,
      precioLight: tour?.precioLight ?? null,
    },
    ficha: {
      menuLight: ficha?.menuLight ?? [],
      menuPremium: ficha?.menuPremium ?? [],
      menuBuffet: ficha?.menuBuffet,
      menuCharter: ficha?.menuCharter,
      subVariantes: ficha?.subVariantes,
      horarios: ficha?.horarios ?? [],
      upgradePremium: ficha?.upgradePremium ?? null,
    },
    paquete: odoo.package ?? 'light',
    variante: odoo.variant ?? undefined,
    // El front cuenta con UN número de personas; Odoo guarda el desglose por
    // rol (que es lo que la tripulación necesita para los chalecos). Aquí se
    // devuelve el total, que es lo que estas pantallas pintan.
    personas: odoo.pax.total,
    // El índice de horario no viaja a Odoo —Odoo guarda la HORA, no la
    // posición en un array que puede reordenarse—, así que se recalcula
    // buscando la hora de salida en la ficha local.
    horarioIdx: Math.max(
      (ficha?.horarios ?? []).findIndex((h) => h.hora === odoo.pickup_time),
      0,
    ),
    fechaISO: odoo.date ?? '',
    platos: odoo.dishes.map((d) => d.dish),
    recogida: {
      hotel: odoo.pickup.hotel,
      notas: odoo.pickup.room ? `Room ${odoo.pickup.room}` : '',
    },
    // El idioma no viaja en la reserva que devuelve Odoo (vive en la ficha del
    // cliente, que es privada). Para pintar la pantalla da igual; se repone el
    // del navegador para que el tipo cuadre y un reenvio no lo pise.
    contacto: {
      ...partirNombre(odoo.contact.name, odoo.contact.email, odoo.contact.phone),
      idioma: idiomaDelNavegador(),
    },
    total: odoo.amounts.total,
    deposito: odoo.amounts.deposit,
    saldo: odoo.amounts.balance,
    saldoTotal: odoo.amounts.balance_total ?? odoo.amounts.balance,
    desglose: odoo.amounts.lines ?? [],
    fechaCreacionISO: odoo.created_at ?? new Date().toISOString(),
  }
}

function partirNombre(completo: string, email: string, telefono: string) {
  const partes = (completo || '').trim().split(/\s+/)
  return {
    nombre: partes[0] ?? '',
    apellidos: partes.slice(1).join(' '),
    email,
    telefono,
  }
}
