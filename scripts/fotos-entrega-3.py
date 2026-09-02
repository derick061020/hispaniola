# -*- coding: utf-8 -*-
"""Tercera entrega del cliente (2026-09-01) — «FOTO PARA NUEVA WEB 2026 V3».

    python scripts/fotos-entrega-3.py --dry     # solo dice que haria
    python scripts/fotos-entrega-3.py           # aplica

Los cuatro encargos del correo del cliente, literales:

  1. «Carpeta: Tours - Caribbean Scape → agregar las fotos en el tour»
  2. «Carpeta: Tours - Private Charter → agregar las fotos en el tour»
  3. «Carpeta: About Us - Crew → agregar las fotos de CEO y Sales and Marketing»
  4. «Homepage - This is what a day with us looks like → cambiar video numero 2»

El 4 no esta aqui: es ffmpeg y vive en scripts/video-entrega-3.sh, igual que la
entrega anterior separo scripts/video-entrega-2.sh.

DIFERENCIA CON reemplazar-fotos.py, que conviene entender antes de tocar esto:
aquel SUSTITUIA fotos en huecos que ya existian, conservando sus dimensiones
exactas para no tocar codigo. Aqui casi todo son ALTAS, y las galerias de tour
no usan una medida fija —conviven 1600x1200, 1080x1350, 1067x1600 y mas—
porque cada foto CONSERVA SU PROPORCION y solo se capa el lado largo a 1600.
Asi que la funcion de aqui escala, no recorta. Los retratos son la excepcion:
los tres vienen en 3:4 exacto, igual que los 28 ya publicados, asi que tampoco
hay recorte que hacer.

⚠️ COMPARACION CONTRA LA ENTREGA ANTERIOR (hecha antes de sustituir la carpeta):
304 archivos contra 269. 37 altas, 0 modificaciones y 0 bajas reales — las dos
que parecian borradas (`CATAMARAN CELENA NOEL_-92.jpg` y `_MG_9277.jpg`) son
MOVIMIENTOS de `PRIVATE CHARTER/AGREGAR/` a `PRIVATE CHARTER/`, verificado por
md5. Las dos ya estaban publicadas como tour-charter-12 y tour-charter-11.
Es la leccion de la 2a entrega: copiar «saltando existentes» habria perdido
cualquier borrado, asi que se compara, no se confia.

⚠️ `AGREGAR (1)` NO SE USA. Es un duplicado byte a byte de `AGREGAR` (mismos
md5) menos `_MG_2186.jpg`: basura de una descarga repetida. Si se procesaran las
dos carpetas, el charter tendria cinco fotos duplicadas.
"""
import sys
import pathlib
from PIL import Image, ImageOps

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ENTREGA = RAIZ / "FOTO PARA NUEVA WEB 2026"
DESTINO = RAIZ / "app/public/fotos"

# Lado largo de las fotos de galeria. Sale de medir las 24 ya publicadas: el
# lado largo es 1600 en casi todas y ninguna lo supera (salvo un panoramico de
# 1920 que es un caso aparte).
LADO_LARGO = 1600
# Los retratos del muro de tripulacion. Misma medida que los 28 publicados.
RETRATO = (800, 1067)


def escalar(origen, hueco, lado=LADO_LARGO, dry=False):
    """Escala conservando la proporcion, capando el lado largo. No recorta."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)

    im = ImageOps.exif_transpose(Image.open(origen))
    # Los PNG con alfa se aplanan sobre BLANCO, no sobre negro (IMG_1000.png).
    if im.mode in ("RGBA", "LA", "P"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        fondo.paste(im, mask=im.split()[3])
        im = fondo
    else:
        im = im.convert("RGB")

    sw, sh = im.size
    escala = min(1.0, lado / max(sw, sh))  # nunca se agranda una fuente pequena
    w, h = round(sw * escala), round(sh * escala)
    im = im.resize((w, h), Image.LANCZOS)

    if dry:
        return ("OK", "%dx%d <- %dx%d" % (w, h, sw, sh), 0)
    im.save(destino, "WEBP", quality=82, method=6)
    return ("OK", "%dx%d" % (w, h), destino.stat().st_size)


def recortar_a(origen, hueco, medida, sesgo_y=0.5, sesgo_x=0.5, dry=False):
    """Escala para CUBRIR la medida y recorta el sobrante. Es lo que hay que
    usar cuando la fuente y el hueco NO tienen la misma proporcion: un
    `resize()` a secas deformaria a la persona.

    Misma logica que `convertir()` de scripts/reemplazar-fotos.py — se repite
    aqui, y no se importa, porque aquel script apunta a la entrega ANTERIOR y
    los dos tienen que poder ejecutarse por separado."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)
    im = ImageOps.exif_transpose(Image.open(origen))
    if im.mode in ("RGBA", "LA", "P"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        fondo.paste(im, mask=im.split()[3])
        im = fondo
    else:
        im = im.convert("RGB")
    w, h = medida
    sw, sh = im.size
    escala = max(w / sw, h / sh)
    im = im.resize((max(w, round(sw * escala)), max(h, round(sh * escala))), Image.LANCZOS)
    nw, nh = im.size
    x, y = round((nw - w) * sesgo_x), round((nh - h) * sesgo_y)
    im = im.crop((x, y, x + w, y + h))
    if dry:
        return ("OK", "%dx%d <- %dx%d" % (w, h, sw, sh), 0)
    im.save(destino, "WEBP", quality=82, method=6)
    return ("OK", "%dx%d" % (w, h), destino.stat().st_size)


def a_medida(origen, hueco, medida, dry=False):
    """Reescala a una medida exacta. Solo para los retratos, que ya vienen en
    la proporcion correcta (3:4) y por tanto no pierden nada."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)
    im = ImageOps.exif_transpose(Image.open(origen))
    if im.mode in ("RGBA", "LA", "P"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        fondo.paste(im, mask=im.split()[3])
        im = fondo
    else:
        im = im.convert("RGB")
    sw, sh = im.size
    im = im.resize(medida, Image.LANCZOS)
    if dry:
        return ("OK", "%dx%d <- %dx%d" % (medida[0], medida[1], sw, sh), 0)
    im.save(destino, "WEBP", quality=82, method=6)
    return ("OK", "%dx%d" % medida, destino.stat().st_size)


# ── 1. Caribbean Escape: 5 altas ────────────────────────────────────────────
# Van al FINAL del array de `galeriaCompleta` (data/tours.ts), no intercaladas:
# el orden de esa lista es editorial —las primeras son las que se ven sin abrir
# el visor— y esas posiciones ya las decidio Samuel con la entrega anterior.
#
# ⚠️ TENSION CON EL PRODUCTO, ANOTADA PARA QUE SAMUEL DECIDA. Esta ficha se
# vende como semi-privada: «no more than 35% of the catamaran's capacity»,
# «Limited Participants», «plenty of personal space». Dos de estas cinco
# ensenan un barco LLENO de gente (43246116 y _MG_8954, esta ultima ademas del
# «SANTA MARIA», que es un barco del charter), y una tercera (_MG_2554) esta
# tomada en una LANCHA, no en el catamaran. Se publican porque el cliente las
# manda para esta ficha y el ultimo lugar del orden limita el dano, pero si
# alguna sobra, son esas tres.
ESCAPE = [
    ("TOURS/CARIBBEAN SCAPE/AGREGAR/IMG_1419.jpg", "tour-escape-12"),
    ("TOURS/CARIBBEAN SCAPE/AGREGAR/_DSC0082.jpg", "tour-escape-13"),
    ("TOURS/CARIBBEAN SCAPE/AGREGAR/_MG_8954.jpg", "tour-escape-14"),
    ("TOURS/CARIBBEAN SCAPE/AGREGAR/43246116_2790376697655148_5260539393692663808_o.jpg", "tour-escape-15"),
    ("TOURS/CARIBBEAN SCAPE/AGREGAR/_MG_2554.jpg", "tour-escape-16"),
]

# ── 2. Private Charter: 6 altas ─────────────────────────────────────────────
# Estas seis SI encajan sin reservas con lo que vende la ficha («the whole
# catamaran for your group»): las seis son de grupo. Orden por calidad
# editorial dentro del bloque nuevo — DSC_0002 (el arcoiris sobre la proa) es
# la mejor de la entrega y por eso abre.
#
# ⚠️ `_DSC0082.jpg` es EL MISMO ARCHIVO que el de Caribbean Scape (md5
# abb59445): el cliente lo puso en las dos carpetas. Se publica en las dos, que
# es lo que pidio, pero queda anotado — ya hay precedente con tour-charter-11,
# que es byte a byte `ev-weddings-6`.
CHARTER = [
    ("TOURS/PRIVATE CHARTER/AGREGAR/DSC_0002.jpg", "tour-charter-13"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/44407277_2823523741007110_2845443256966184960_o.jpg", "tour-charter-14"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/_DSC0257.jpg", "tour-charter-15"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/_MG_0554.jpg", "tour-charter-16"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/_MG_2186.jpg", "tour-charter-17"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/_DSC0082.jpg", "tour-charter-18"),
]

# ── 3. Los 3 retratos nuevos ────────────────────────────────────────────────
# Son TRES PERSONAS DISTINTAS, comprobado abriendo las tres. Es la primera
# entrega de retratos en la que el numero de archivos coincide con el de
# personas: en las dos anteriores no pasaba (una misma persona posaba con los
# brazos caidos y con los brazos cruzados, y solo entraba una toma). Aqui no
# hay ningun par que descartar.
#
# ⚠️ NO EXISTIA EL DEPARTAMENTO DE VENTAS. `DepartamentoId` en data/equipo.ts
# tenia seis (capitanes, guias, marinos, cocina, oficina, fundacion) y el
# cliente manda un grupo nuevo. Se crea como departamento propio y no se mete
# dentro de `oficina` porque el cliente lo separa por carpeta, que es como ha
# separado siempre los departamentos de esta pagina.
#
# ⚠️⚠️ LA FOTO DEL CEO NO ES UN DEPARTAMENTO — CORREGIDO POR SAMUEL (2026-09-01,
# 2a vuelta): «quita el apartado management ya que ese es el ceo y ponlo aqui y
# en el resto de lados donde salga la foto de omar ceo».
# En el primer pase se creo un departamento `direccion` con esa unica foto. Era
# un error de lectura: la carpeta «AGREGAR - CEO» no es un grupo nuevo, es el
# RETRATO REAL DE OMAR, que ya existe en el sitio como `equipo-omar` (id 'omar',
# «Founder & CEO» en data/nosotros.ts) con una foto de stock.
# Asi que la foto NO va a un hueco nuevo: SOBRESCRIBE `equipo-omar`, y con eso
# se actualiza sola en todos los sitios donde sale — la card de /crew, el teaser
# de la home, la firma de sus 5 articulos del blog y el contacto.
#
# ⚠️ IMG_1000.png (la comercial) tiene DOS cosas distintas a las demas y las
# dos quedan anotadas:
#   · Resolucion: 1086x1448, contra los ~3000x4000 del resto. A 800x1067 aun
#     sobra, pero es la fuente mas pequena del muro.
#   · Lleva el polo de BAVARO REEFS GROUP, no el de Hispaniola. Es el grupo
#     matriz (la fundacion se llama «Bavaro Reefs Foundation»), asi que no es
#     un error, pero en el muro sera el unico logo distinto.
#   · Y esta SENTADA, con un plano mas abierto que los 28 de pie. Como la
#     fuente ya es 3:4 no se recorta, asi que su encuadre se nota mas suelto.
RETRATOS = [
    ("ABOUT US/CREW - ABOUT US/AGREGAR - SALES AND MARKETING/IMG_9005.jpg", "crew-ventas-1"),
    ("ABOUT US/CREW - ABOUT US/AGREGAR - SALES AND MARKETING/IMG_1000.png", "crew-ventas-2"),
]

# ── El retrato de Omar ──────────────────────────────────────────────────────
# Va aparte porque NO es un retrato del muro: es la ficha de persona con nombre
# y cargo, y su hueco tiene otra proporcion. `equipo-omar` es 800x1200 (2:3) y
# la fuente es 3:4, asi que aqui SI hay recorte — se va ancho por los lados, no
# alto. Sesgo 0.5/0.5: esta centrado en el encuadre original.
#
# Con esto desaparece del sitio una de las fotos de STOCK que quedaban: hasta
# hoy la card del fundador llevaba un retrato generico de banco.
OMAR = ("ABOUT US/CREW - ABOUT US/AGREGAR - CEO/IMG_9024.jpg", "equipo-omar", (800, 1200))


# ── Lo que la entrega trae y NO se aplica en este pase ───────────────────────
# No es olvido: el cliente no lo pide en su correo y toca decisiones abiertas.
NO_ENTRAN = [
    ("TOURS/PRIVATE CHARTER/MENU/GROUP OF 21+/", "bento del buffet de pinchos",
     "La entrega TRAE por fin las cuatro fotos que el bento de `21+` lleva "
     "marcadas como [placeholder-v3] desde el 2026-08-06 (THE FULL SKEWER "
     "BUFFET, PORTION PER GUEST, HOW ITS SERVED). El cliente NO las menciona "
     "en su correo, y ademas `HOW ITS SERVED.jpg` es byte a byte `PRIVATE "
     "CHARTER/3.jpg`, que ya esta publicada en la galeria del charter — o sea "
     "que la celda `servicio-2` seguiria sin foto propia. Se deja para "
     "preguntarselo a Samuel: es el hueco marcado mas antiguo del proyecto."),
    ("TOURS/PRIVATE CHARTER/MENU/3 HOUR MENU/", "carta de 3 horas",
     "Trae `paq 1.png`, `paquete 3 (1).png`, `package-2-2022.jpg` y tres fotos "
     "de brocheta (_MG_9942/9944/9946). Las tres brochetas resolverian el otro "
     "[placeholder-v3] vivo: hoy las tres comparten la foto de la pechuga a la "
     "parrilla. Tampoco esta en el correo del cliente."),
]


def aplicar(lista, dry=False, medida=None):
    ok = fallo = 0
    for rel, hueco in lista:
        if medida:
            estado, detalle, peso = a_medida(ENTREGA / rel, hueco, medida, dry)
        else:
            estado, detalle, peso = escalar(ENTREGA / rel, hueco, dry=dry)
        if estado == "OK":
            ok += 1
            print("  ok   %-20s <- %-52s %-24s %s" % (
                hueco, rel.split("/")[-1][:52], detalle,
                ("%6.1f KB" % (peso / 1024)) if peso else ""))
        else:
            fallo += 1
            print("  MAL  %-20s %s" % (hueco, detalle))
    return ok, fallo


if __name__ == "__main__":
    dry = "--dry" in sys.argv
    print("\n== 1. Caribbean Escape (altas al final de la galeria) ==")
    a, f1 = aplicar(ESCAPE, dry)
    print("\n== 2. Private Charter (altas al final de la galeria) ==")
    b, f2 = aplicar(CHARTER, dry)
    print("\n== 3. Retratos del muro: departamento `ventas`, NUEVO en data/equipo.ts ==")
    c, f3 = aplicar(RETRATOS, dry, medida=RETRATO)
    print("\n== 4. El CEO: sobrescribe la foto de stock de Omar ==")
    rel, hueco, med = OMAR
    estado, detalle, peso = recortar_a(ENTREGA / rel, hueco, med, dry=dry)
    if estado == "OK":
        c += 1
        print("  ok   %-20s <- %-52s %-24s %s" % (
            hueco, rel.split("/")[-1], detalle,
            ("%6.1f KB" % (peso / 1024)) if peso else ""))
    else:
        f3 += 1
        print("  MAL  %-20s %s" % (hueco, detalle))
    print("\n== la entrega trae mas cosas que el correo no pide: %d bloques ==" % len(NO_ENTRAN))
    for rel, que, _motivo in NO_ENTRAN:
        print("  --   %-28s %s" % (que, rel))
    print("\n  %d fotos aplicadas (%d escape + %d charter + %d retratos), %d con problema"
          % (a + b + c, a, b, c, f1 + f2 + f3))
    sys.exit(1 if (f1 + f2 + f3) else 0)
