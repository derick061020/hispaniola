// GENERADO POR scripts/sincroniza-tarifas.mjs — NO EDITAR A MANO.
//
// Es la foto del catálogo de Odoo que el front pinta cuando el backend no
// contesta. Para actualizarla: `npm run sync:tarifas`.
//
// Última sincronía: 2026-09-03 13:07 UTC
import type { Tour } from '@/lib/api/tipos'

export const CATALOGO_ODOO: Tour[] = [
  {
    "slug": "semi-private-premium",
    "id": 26,
    "name": "Semi-Private Premium",
    "short_description": "An intimate adults-only Caribbean experience featuring protected reef snorkeling, an exclusive underwater museum, a secluded beach, and chef-prepared cuisine from our floating kitchen.",
    "photo": "tour-semi-privado",
    "audience": "Adults only",
    "duration": "4 h",
    "rating": 4.9,
    "reviews": 1782,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "flat",
    "max_pax": 25,
    "adult_price": 99,
    "child_price": null,
    "premium_upgrade": 15,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [
      {
        "departure": "9:00 AM",
        "back": "1:00 PM",
        "slot": "am"
      },
      {
        "departure": "1:00 PM",
        "back": "5:00 PM",
        "slot": "pm"
      }
    ],
    "variants": [],
    "addons": [],
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "coral",
    "id": 27,
    "name": "Snorkel Lovers",
    "short_description": "An all-ages experience where coral restoration, symbolic coral planting, an exclusive underwater museum, and protected reefs inspire unforgettable memories.",
    "photo": "tour-snorkel-lovers",
    "audience": "All ages",
    "duration": "4 h",
    "rating": 4.9,
    "reviews": 1782,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "dual",
    "max_pax": 30,
    "adult_price": 99,
    "child_price": 65,
    "premium_upgrade": 15,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [
      {
        "departure": "9:00 AM",
        "back": "1:00 PM",
        "slot": "am"
      },
      {
        "departure": "1:00 PM",
        "back": "5:00 PM",
        "slot": "pm"
      }
    ],
    "variants": [],
    "addons": [],
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "private-charter",
    "id": 28,
    "name": "Private Charter",
    "short_description": null,
    "photo": "tour-charter-privado",
    "audience": "Private group",
    "duration": "3 or 4 h",
    "rating": 4.9,
    "reviews": 1782,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "tiers",
    "max_pax": 85,
    "adult_price": null,
    "child_price": null,
    "premium_upgrade": null,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [],
    "variants": [
      {
        "slug": "maite",
        "name": "Maite",
        "description": "Intimate cruise · 4h · up to 15 guests",
        "capacity_label": "Up to 15 guests",
        "duration_label": "4 hours",
        "duration_hours": 4,
        "photo": "flota-maite",
        "min_pax": 1,
        "capacity": 20,
        "tiers": [
          {
            "from": 1,
            "to": 8,
            "price": 625,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 9,
            "to": 20,
            "price": 99,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": [
          {
            "departure": "9:00 AM",
            "back": "1:00 PM",
            "slot": "am"
          },
          {
            "departure": "2:00 PM",
            "back": "6:00 PM",
            "slot": "pm"
          }
        ]
      },
      {
        "slug": "grandma",
        "name": "GrandMa",
        "description": "Agile cruise · 3h · up to 50 guests",
        "capacity_label": "Up to 50 guests",
        "duration_label": "3 hours",
        "duration_hours": 3,
        "photo": "flota-grandma",
        "min_pax": 1,
        "capacity": 50,
        "tiers": [
          {
            "from": 1,
            "to": 12,
            "price": 900,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 13,
            "to": 50,
            "price": 75,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": [
          {
            "departure": "9:00 AM",
            "back": "11:55 AM",
            "slot": "am"
          },
          {
            "departure": "12:00 PM",
            "back": "2:55 PM",
            "slot": "pm"
          },
          {
            "departure": "3:00 PM",
            "back": "6:00 PM",
            "slot": "pm"
          }
        ]
      },
      {
        "slug": "santa-maria",
        "name": "Santa Maria",
        "description": "Premium cruise · 4h · up to 45 guests",
        "capacity_label": "Up to 45 guests (plated up to 20, skewers from 21)",
        "duration_label": "4 hours",
        "duration_hours": 4,
        "photo": "flota-santa-maria",
        "min_pax": 1,
        "capacity": 45,
        "tiers": [
          {
            "from": 1,
            "to": 13,
            "price": 1000,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 14,
            "to": 45,
            "price": 99,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": [
          {
            "departure": "9:00 AM",
            "back": "12:55 PM",
            "slot": "am"
          },
          {
            "departure": "2:00 PM",
            "back": "6:00 PM",
            "slot": "pm"
          }
        ]
      },
      {
        "slug": "forever-teresa",
        "name": "Forever Teresa · 3h",
        "description": "Large catamaran · 3h · up to 85 guests",
        "capacity_label": "Up to 85 guests (tiered pricing)",
        "duration_label": "3 hours",
        "duration_hours": 3,
        "photo": "flota-forever-teresa",
        "min_pax": 1,
        "capacity": 120,
        "tiers": [
          {
            "from": 1,
            "to": 30,
            "price": 2250,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 31,
            "to": 85,
            "price": 75,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": [
          {
            "departure": "9:00 AM",
            "back": "12:00 PM",
            "slot": "am"
          },
          {
            "departure": "3:00 PM",
            "back": "6:00 PM",
            "slot": "pm"
          }
        ]
      },
      {
        "slug": "forever-teresa-4h",
        "name": "Forever Teresa · 4h",
        "description": "Large catamaran · 4h · up to 85 guests",
        "capacity_label": "Up to 85 guests (tiered pricing)",
        "duration_label": "4 hours",
        "duration_hours": 4,
        "photo": "flota-forever-teresa",
        "min_pax": 1,
        "capacity": 120,
        "tiers": [
          {
            "from": 1,
            "to": 25,
            "price": 2475,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 26,
            "to": 85,
            "price": 99,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": [
          {
            "departure": "9:00 AM",
            "back": "12:55 PM",
            "slot": "am"
          },
          {
            "departure": "2:00 PM",
            "back": "6:00 PM",
            "slot": "pm"
          }
        ]
      }
    ],
    "addons": [
      {
        "slug": "comida-maite",
        "label": "Meal on board",
        "description": "Lunch cooked on board. Included from 9 guests up.",
        "note": null,
        "base": "person",
        "price": 25,
        "default_on": false,
        "only_variants": [
          "maite"
        ],
        "min_pax": null,
        "max_pax": 8
      },
      {
        "slug": "comida-santa-maria",
        "label": "Meal on board",
        "description": "Lunch cooked on board. Included from 14 guests up.",
        "note": null,
        "base": "person",
        "price": 25,
        "default_on": false,
        "only_variants": [
          "santa-maria"
        ],
        "min_pax": null,
        "max_pax": 13
      }
    ],
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "saona-island",
    "id": 29,
    "name": "Saona Island",
    "short_description": null,
    "photo": "tour-isla-saona",
    "audience": "All ages",
    "duration": "7 h",
    "rating": 4.9,
    "reviews": 1782,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "tiers",
    "max_pax": 70,
    "adult_price": null,
    "child_price": null,
    "premium_upgrade": null,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [
      {
        "departure": "9:00 AM",
        "back": "4:00 PM",
        "slot": "am"
      }
    ],
    "variants": [
      {
        "slug": "speedboat",
        "name": "Private Speedboat",
        "description": "The fastest, most exclusive way",
        "capacity_label": "Up to 9 guests",
        "duration_label": null,
        "duration_hours": null,
        "photo": null,
        "min_pax": 1,
        "capacity": 25,
        "tiers": [
          {
            "from": 1,
            "to": 6,
            "price": 1100,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 7,
            "to": 7,
            "price": 1160,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 8,
            "to": 8,
            "price": 1220,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 9,
            "to": 9,
            "price": 1280,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 10,
            "to": 10,
            "price": 1340,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 11,
            "to": 25,
            "price": 130,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": []
      },
      {
        "slug": "fishing",
        "name": "Speedboat Adventure",
        "description": "With a stop at Mano Juan and Playa Toro",
        "capacity_label": "Up to 10 guests (+US$ 140 per person from 11 up to 25)",
        "duration_label": null,
        "duration_hours": null,
        "photo": null,
        "min_pax": 1,
        "capacity": 25,
        "tiers": [
          {
            "from": 1,
            "to": 6,
            "price": 1200,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 7,
            "to": 7,
            "price": 1270,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 8,
            "to": 8,
            "price": 1340,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 9,
            "to": 9,
            "price": 1410,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 10,
            "to": 10,
            "price": 1450,
            "kind": "group",
            "extra_per_pax": null,
            "note": null
          },
          {
            "from": 11,
            "to": 25,
            "price": 140,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": []
      },
      {
        "slug": "catamaran",
        "name": "Catamaran",
        "description": "The classic Caribbean sailing experience",
        "capacity_label": "Up to 70 guests",
        "duration_label": null,
        "duration_hours": null,
        "photo": null,
        "min_pax": 1,
        "capacity": 70,
        "tiers": [
          {
            "from": 1,
            "to": 30,
            "price": 1950,
            "kind": "group",
            "extra_per_pax": 45,
            "note": null
          },
          {
            "from": 31,
            "to": 70,
            "price": 105,
            "kind": "person",
            "extra_per_pax": null,
            "note": null
          }
        ],
        "schedules": []
      }
    ],
    "addons": [
      {
        "slug": "langosta",
        "label": "Fresh lobster upgrade",
        "description": "Add fresh lobster to your dish, freshly grilled on board. US$ 30 per person.",
        "note": "From March to June lobster may be unavailable; in that case it is replaced with jumbo shrimp.",
        "base": "person",
        "price": 30,
        "default_on": true,
        "only_variants": [],
        "min_pax": null,
        "max_pax": null
      }
    ],
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "party-boat",
    "id": 30,
    "name": "Events & Party Boats",
    "short_description": null,
    "photo": "evento-party-boat",
    "audience": "Private event",
    "duration": null,
    "rating": null,
    "reviews": null,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "marginal",
    "max_pax": 85,
    "adult_price": 1188,
    "child_price": null,
    "premium_upgrade": null,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [],
    "variants": [
      {
        "slug": "classic",
        "name": "Starfish Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "signature",
        "name": "Breeze Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "grand",
        "name": "Tide Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "premium",
        "name": "Premium (Turtle) Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "4 hours on board",
        "duration_hours": 4,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      }
    ],
    "addons": [],
    "marginal": {
      "included_pax": 12,
      "extra_price": 99
    },
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "weddings",
    "id": 31,
    "name": "Weddings",
    "short_description": null,
    "photo": "evento-bodas",
    "audience": "Private event",
    "duration": null,
    "rating": null,
    "reviews": null,
    "zone": "Bavaro",
    "booking_mode": "full",
    "pricing_model": "marginal",
    "max_pax": 85,
    "adult_price": 660,
    "child_price": null,
    "premium_upgrade": null,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [],
    "variants": [
      {
        "slug": "classic",
        "name": "Starfish Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "signature",
        "name": "Breeze Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "grand",
        "name": "Tide Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "3 hours on board",
        "duration_hours": 3,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      },
      {
        "slug": "premium",
        "name": "Premium (Turtle) Package",
        "description": null,
        "capacity_label": "Up to 12 guests included",
        "duration_label": "4 hours on board",
        "duration_hours": 4,
        "photo": null,
        "min_pax": 1,
        "capacity": 85,
        "tiers": [],
        "schedules": []
      }
    ],
    "addons": [],
    "marginal": {
      "included_pax": 12,
      "extra_price": 99
    },
    "included": [],
    "bring": [],
    "terms": []
  },
  {
    "slug": "corporate",
    "id": 32,
    "name": "Corporate & MICE",
    "short_description": null,
    "photo": "evento-corporativo",
    "audience": "Private event",
    "duration": null,
    "rating": null,
    "reviews": null,
    "zone": "Bavaro",
    "booking_mode": "quote",
    "pricing_model": "marginal",
    "max_pax": 85,
    "adult_price": 900,
    "child_price": null,
    "premium_upgrade": null,
    "deposit_pct": 25,
    "infants_are_free": true,
    "min_days_ahead": 1,
    "max_days_ahead": 365,
    "schedules": [],
    "variants": [],
    "addons": [],
    "marginal": {
      "included_pax": 12,
      "extra_price": 99
    },
    "included": [],
    "bring": [],
    "terms": []
  }
]

/** El tour de la foto, por slug. `null` si no estaba cuando se sincronizó. */
export function respaldoDeOdoo(slug: string): Tour | null {
  return CATALOGO_ODOO.find((t) => t.slug === slug) ?? null
}
