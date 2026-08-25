#!/usr/bin/env python3
"""Genera src/data/hoteles.ts a partir del volcado de `haa.hotel` de Odoo.

Uso (desde app/):
    ssh ... 'docker exec odoo-db-1 psql -U odoo -d odoo -t -A -F"|" \
        -c "select id, name, coalesce(zone,'"''"') from haa_hotel where is_active order by name"' \
      | python3 scripts/genera-hoteles.py

Por que existe: el selector de hotel del funnel tiene que ofrecer LOS MISMOS
hoteles que Odoo (pedido de Samuel, 2026-08-25). En caliente los pide a
`/hotels`; esta lista es lo que se pinta mientras la respuesta viaja y la red
si Odoo no contesta — igual que el precio local del checkout.
"""
import re
import sys

ZONAS = ['Bavaro', 'Punta Cana', 'Cap Cana', 'Uvero Alto', 'Bayahibe', 'Macao']


def limpia(nombre: str) -> str:
    # Odoo trae nombres del importador del sistema anterior con tandas de
    # espacios dentro ("Royalton Bavaro          MAIN ENTRANCE"): colapsarlos
    # deja duplicados exactos del mismo hotel, que se descartan mas abajo.
    return re.sub(r'\s+', ' ', nombre).strip()


def main() -> None:
    vistos: dict[str, dict] = {}
    for linea in sys.stdin:
        linea = linea.rstrip('\n')
        if not linea.strip():
            continue
        partes = linea.split('|')
        if len(partes) < 3:
            continue
        ident, nombre, zona = partes[0].strip(), limpia(partes[1]), limpia(partes[2])
        if not nombre:
            continue
        clave = nombre.casefold()
        if clave in vistos:
            continue
        vistos[clave] = {'id': int(ident), 'nombre': nombre, 'zona': zona or 'Bavaro'}

    hoteles = sorted(vistos.values(), key=lambda h: (
        ZONAS.index(h['zona']) if h['zona'] in ZONAS else len(ZONAS), h['nombre'].casefold(),
    ))

    salida = [
        '// GENERADO por scripts/genera-hoteles.py — no editar a mano.',
        '// Instantanea de `haa.hotel` (Odoo de produccion) del 2026-08-25.',
        '// Es la red del selector de hotel del funnel: lo que se pinta mientras',
        '// llega `/hotels` y lo que queda si Odoo no contesta. Para refrescarla,',
        '// volver a correr el script con el volcado de la base.',
        '',
        "import type { Hotel } from '@/lib/api/tipos'",
        '',
        f'export const HOTELES: Hotel[] = [',
    ]
    for h in hoteles:
        nombre = h['nombre'].replace('\\', '\\\\').replace("'", "\\'")
        zona = h['zona'].replace("'", "\\'")
        salida.append(f"  {{ id: {h['id']}, name: '{nombre}', zone: '{zona}' }},")
    salida.append(']')
    salida.append('')
    sys.stdout.write('\n'.join(salida))


if __name__ == '__main__':
    main()
