# -*- coding: utf-8 -*-
"""SEGUNDA entrega de fotos del cliente (2026-08-23).

    python scripts/fotos-entrega-2.py --dry     # solo dice que haria
    python scripts/fotos-entrega-2.py           # aplica

Es un archivo APARTE de `reemplazar-fotos.py` a proposito: aquel es el registro
de la primera entrega (agosto 20-21) y sigue siendo la unica fuente que dice de
que archivo salio cada hueco de aquella tanda. Rehacerlo entero para meter diez
cambios habria borrado ese registro y regenerado 200 fotos que nadie pidio.

EL CLIENTE DEJO LAS INSTRUCCIONES EN LOS NOMBRES DE ARCHIVO Y EN CAPTURAS.
Cada carpeta nueva trae, ademas de las fotos, un PNG/JPEG con la pantalla de la
web y una flecha roja sobre lo que hay que cambiar. Eso es lo que se ha seguido,
y por eso cada entrada de aqui abajo dice a que hueco EXACTO apunta la flecha.

Reglas heredadas de la primera entrega, que se mantienen:
  · Se reemplaza EN EL SITIO siempre que se pueda: el .webp conserva nombre y
    dimensiones, asi que no hay que tocar codigo y la foto se actualiza en todos
    los puntos donde aparezca.
  · Un archivo NUEVO obliga a editar el .ts que lo apunta. Van listados abajo.
  · Una persona = UN retrato. Si poso dos veces, entra la de brazos cruzados
    (Samuel, 2026-08-21). Ya costo un bug: en cocina salio alguien repetido.
"""
import sys
import pathlib
from PIL import Image, ImageOps

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ENTREGA = RAIZ / "FOTO PARA NUEVA WEB 2026"
DESTINO = RAIZ / "app/public/fotos"

RETRATO = (800, 1067)   # la card del muro de tripulacion (3:4)
FRENTE = (900, 1200)    # la card del carril de frentes de /foundation


def convertir(origen, hueco, sesgo_y=0.5, sesgo_x=0.5, medida=None, dry=False):
    """Escribe `origen` sobre DESTINO/hueco.webp con las dimensiones que ya
    tenia (o con `medida` si el archivo es nuevo)."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)
    if destino.exists() and medida is None:
        w, h = Image.open(destino).size
    elif medida:
        w, h = medida
    else:
        return ("MAL", "el hueco %s no existe y no se dio medida" % destino.name, 0)

    im = ImageOps.exif_transpose(Image.open(origen)).convert("RGB")
    sw, sh = im.size
    escala = max(w / sw, h / sh)
    im = im.resize((max(w, round(sw * escala)), max(h, round(sh * escala))), Image.LANCZOS)
    nw, nh = im.size
    x = round((nw - w) * sesgo_x)
    y = round((nh - h) * sesgo_y)
    im = im.crop((x, y, x + w, y + h))

    if dry:
        return ("OK", "%dx%d <- %dx%d" % (w, h, sw, sh), 0)
    im.save(destino, "WEBP", quality=82, method=6)
    return ("OK", "%dx%d" % (w, h), destino.stat().st_size)


def por_lado_largo(origen, hueco, largo=1600, dry=False):
    """Conserva la proporcion de la fuente y topa el lado largo. Es la regla que
    siguen las `tour-charter-*` de la primera entrega (comprobado: van de 1.00 a
    1.79 de proporcion, todas con el lado largo en 1600 salvo la que venia de
    una fuente mas pequena, que NO se escalo hacia arriba)."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)
    im = ImageOps.exif_transpose(Image.open(origen)).convert("RGB")
    sw, sh = im.size
    escala = min(largo / max(sw, sh), 1.0)
    w, h = round(sw * escala), round(sh * escala)
    im = im.resize((w, h), Image.LANCZOS)
    if dry:
        return ("OK", "%dx%d <- %dx%d" % (w, h, sw, sh), 0)
    im.save(destino, "WEBP", quality=82, method=6)
    return ("OK", "%dx%d" % (w, h), destino.stat().st_size)


# ── 1. Huecos que YA existen: se sobrescriben, cero cambios de codigo ───────
MAPEO = [
    # [1] HOMEPAGE · seccion «Book Direct. Experience More.»
    # La captura `WhatsApp Image ... 13.04.34.jpeg` marca con un «1» rojo la
    # banda azul de Book Direct. Esa banda es `hero-catamaran-1`
    # (components/home/why-direct.tsx).
    # ⚠️ El hueco NO es solo de la home: lo comparten el cierre de /facilities,
    # la galeria de /nosotros y /why-book-direct. Es el mismo caso que en la
    # primera entrega —donde este hueco ya se sobrescribio con `1.jpg`— asi que
    # se mantiene el criterio: la foto es de llegada/flota en los cuatro sitios
    # y la nueva tambien lo es (vista cenital de la plataforma flotante con los
    # barcos fondeados sobre el arrecife).
    # Fuente 8064x3836 (2.10) contra un hueco de 2.69: el recorte centrado se
    # come franja de arriba y de abajo, que es agua abierta; la plataforma y los
    # barcos quedan dentro.
    ("HOMEPAGE/FOTO SECCIÓN BOOK DIRECT/CAMBIAR A ESTA FOTO.jpg", "hero-catamaran-1"),

    # [3] ABOUT US · CREW · Oficina
    # La captura `OFICINA/CAMBIOS/CAMBIAR FOTO.png` pone la flecha sobre el
    # ULTIMO retrato del muro de Office Operations, el octavo: `crew-oficina-8`.
    # El archivo nuevo se llama IGUAL que el que ya estaba publicado
    # (IMG_8936.jpg) pero es otra toma —mismo senor, girado a tres cuartos en
    # vez de frontal— asi que es un reemplazo en el sitio y la cuenta del
    # departamento no cambia.
    # Fuente 3553x4737 = 3:4 exacto, la misma proporcion que la card: no se
    # recorta nada, solo se reescala.
    ("ABOUT US/CREW - ABOUT US/OFICINA/CAMBIOS/IMG_8936.jpg", "crew-oficina-8"),
]

# ── 2. Archivos NUEVOS: obligan a editar el .ts que los apunta ──────────────
NUEVOS = [
    # [4] ABOUT US · CREW · Guias → data/equipo.ts (guias: 4 → 5)
    # ⚠️ ENTRA UNA, NO DOS. La carpeta AGREGAR trae IMG_8924 e IMG_8926 y son
    # LA MISMA PERSONA (comparadas cara a cara: mismo hombre, mismas mangas
    # azul claro de la Fundacion Bavaro Reefs). Se queda 8926, la de brazos
    # cruzados, por la regla que fijo Samuel el 21. Publicar las dos habria
    # repetido a alguien en el muro, que es exactamente el bug que se arreglo
    # en el commit 308114d.
    ("ABOUT US/CREW - ABOUT US/GUÍAS/AGREGAR/IMG_8926.jpg", "crew-guias-5", RETRATO),

    # [5] ABOUT US · CREW · Cocina → data/equipo.ts (cocina: 8 → 10)
    # ⚠️ ENTRAN DOS, NO CUATRO. Se publicaron las cuatro y Samuel las vio en el
    # muro montado (2026-08-24): son solo DOS personas, cada una con su toma de
    # brazos caidos y su toma de brazos cruzados. 8927 y 8929 son el mismo
    # hombre; 8931 y 8935 el mismo chico. Se quedan 8929 (brazos cruzados, por
    # la regla del 21) y 8931 (frontal, la que eligio Samuel de ese par), y los
    # descartados se borraron del repo. Mismo bug que 308114d, otra vez: en
    # estas carpetas AGREGAR el numero de archivos NO es el numero de personas.
    ("ABOUT US/CREW - ABOUT US/COCINA/AGREGAR/IMG_8929.jpg", "crew-cocina-9", RETRATO),
    ("ABOUT US/CREW - ABOUT US/COCINA/AGREGAR/IMG_8931.jpg", "crew-cocina-10", RETRATO),

    # [10] SUSTAINABILITY · The Foundation · «Working with Local Fishermen»
    # → data/fundacion.ts
    # El hueco llevaba `galeria-semi-privado-4` (alguien esnorkeleando) porque
    # en la primera entrega NO habia foto de pescadores: el `RESTORING MARINE`
    # que se probo resulto ser de la seccion de biodiversidad y Samuel lo
    # devolvio a su sitio. Ahora el cliente SI manda el archivo, y lo nombra
    # con el titulo exacto de la seccion, que es la convencion que sigue toda
    # esta carpeta.
    ("SUSTAINABILITY/THE FOUNDATION/WORKING WITH LOCAL FISHERMEN.jpg", "fundacion-pescadores", FRENTE),
]

# ── 3. Fotos que conservan la proporcion de la fuente ───────────────────────
# [9] TOURS · Private Charter → data/tours.ts (galeriaCompleta: 10 → 12)
# La rejilla del charter es «exactamente las de la carpeta y nada mas» (Samuel,
# 2026-08-21), asi que las dos de AGREGAR entran como dos huecos nuevos.
LARGO = [
    # ⚠️ ESTA FOTO YA ESTA PUBLICADA EN OTRO SITIO. `_MG_9277.jpg` es
    # BYTE A BYTE la misma que `EVENTS/WEDDINGS/_MG_9277.jpg`, que se publico
    # como `ev-weddings-6` (md5 6f276344... en las dos). No es un error de
    # lectura: el cliente puso el mismo archivo en las dos carpetas, y tiene
    # sentido —una boda a bordo de un charter privado es las dos cosas—, pero
    # conviene saber que la misma imagen sale en /events/weddings y en
    # /tours/private-charter.
    ("TOURS/PRIVATE CHARTER/AGREGAR/_MG_9277.jpg", "tour-charter-11"),
    ("TOURS/PRIVATE CHARTER/AGREGAR/CATAMARAN CELENA NOEL_-92.jpg", "tour-charter-12"),
]


# ── [7] Facilities · Operation Center ──────────────────────────────────────
# Samuel eligio: la foto nueva va a la CELDA ANCHA del bento, donde se ve
# apaisada y entera. El cliente lo pidio con todas las letras: «cambiar foto, no
# achicar ni colocar vertical».
#
# ⚠️ Y ADEMAS BORRO `IMG_8815-HDR.jpg` DE SU CARPETA, que es justo la foto que
# ocupaba la celda alta 9:16 (la que senala su flecha). Con la regla de siempre
# —en la web solo lo que esta en la carpeta— esa foto tiene que salir, asi que
# la celda alta se queda sin inquilino y hay que darle uno.
#
# En esa carpeta quedan tres fotos y solo UNA tiene gente: IMG_8994, la oficina
# con las tres companeras trabajando. Las otras dos (8812, 8818) son la sala
# vacia.
#
# [2026-08-24] EL REPARTO CAMBIA: BENTO DE 4, NINGUNA VERTICAL. Samuel, viendo
# la zona ya montada: «como todas las imagenes y videos son horizontales haz un
# bento de 4, para que todo entre horizontal». Y es literal — las TRES fotos de
# la carpeta son 3:2 apaisadas (5750x3833, 5580x3720, 5661x3774) y el clip es
# 16:9. La celda 9:16 obligaba a recortar un apaisado a vertical y lo que se
# veia era un rincon de sala vacio: el aire acondicionado, un perchero y una
# estanteria. Ahora el bento tiene una celda por pieza y no se recorta nada a
# contrapelo (bento-zona.tsx, `todoApaisado`):
#   · celda ancha  → el clip 16:9.
#   · las otras 3  → 8994 (la que tiene gente, la que el cliente pidio), 8812
#                    y 8818, las tres apaisadas y ya sin lightbox aparte.
# `instalacion-oficinas-2` (8812 apaisada) VUELVE por eso: es la 4a celda.
# `instalacion-oficinas-vertical` se queda, pero ya NO pinta en el bento: es el
# cartel de la card del carril de verticales, que sigue siendo 9:16.
#
# [2026-08-24, 2ª vuelta de Samuel: «aun se achican un poco, se puede mantener
# el aspect ratio de las imagenes? con el que vienen, solo para este bento 05»]
# LAS TRES SALEN A 3:2, NO A `CELDA`. El bento de 4 ya no recortaba a lo alto,
# pero seguía metiendo las fotos en celdas de 1.28:1 y 2.03:1 con object-cover:
# el material entraba apaisado pero perdía los lados. Y no hacía falta, porque
# las TRES vienen ya en la misma proporcion 3:2 (5750x3833, 5580x3720,
# 5661x3774) y el clip en 16:9 exacto (1280x720). Ahora manda el material: las
# celdas adoptan su proporcion (bento-zona.tsx) y aqui se recorta lo minimo.
#
# ⚠️ `CELDA` (736x574) NO se toca: la comparten los bentos de 3 celdas de las
# otras zonas, que siguen necesitando ese formato. La medida nueva es solo de
# estas tres.
#
# ⚠️ `instalacion-oficinas-3` es de la PRIMERA entrega (reemplazar-fotos.py:202,
# con `CELDA`) y se re-corta aqui. Aquel script no se toca —es el registro de su
# tanda— y ademas no hace falta: su `convertir()` respeta las dimensiones del
# archivo que ya existe y solo usa su `medida` para huecos nuevos, asi que un
# re-run de la primera entrega mantendria el 3:2.
CELDA = (736, 574)
CELDA_3_2 = (900, 600)
VERT = (720, 1280)
NUEVOS += [
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8994-HDR.jpg",
     "instalacion-oficinas-4", CELDA_3_2),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8812-HDR.jpg",
     "instalacion-oficinas-2", CELDA_3_2),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8818-HDR.jpg",
     "instalacion-oficinas-3", CELDA_3_2),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8812-HDR.jpg",
     "instalacion-oficinas-vertical", VERT),
]


# ── [8] Events · Weddings: fotos que SALEN ─────────────────────────────────
# «Eliminar fotos de parejas. Solo dejar las que quedan en la carpeta».
#
# La primera vez que se miro, la carpeta del proyecto todavia tenia las 20
# fotos y la instruccion no se sostenia. El motivo, que conto Samuel: la carpeta
# nueva se copio encima de la vieja SALTANDO los archivos existentes, asi que
# las ALTAS entraron pero las BAJAS no. Comparada la carpeta del proyecto con la
# descarga limpia del OneDrive del cliente (269 archivos), el borrado aparece: el
# cliente quito CINCO fotos de EVENTS/WEDDINGS. Estas son, con el hueco que
# alimentaban — el orden alfabetico de la carpeta es lo que numera las
# `ev-weddings-*`:
BORRAR = [
    ("ev-weddings-14", "Karaya HD (5).jpg", "la novia con sus damas de honor"),
    ("ev-weddings-16", "Karaya medium (3).png", "novios besandose en el columpio"),
    ("ev-weddings-17", "Montaje bodas.png", "montaje de mesas, sin nadie"),
    ("ev-weddings-18", "New Project - 2024-02-12T174002.202.png",
     "novios besandose ante un mural con marca ajena («#EclipsePuntaCana»)"),
    ("ev-weddings-19", "privaxcy.jpg", "novios bajo el arco floral"),
]
# La galeria de /events/weddings pasa de 20 a 15. `ev-weddings-1` (la portada)
# no esta en la lista, asi que la landing conserva su foto de cabecera.


def aplicar(mapeo, dry=False, modo="caja"):
    ok = fallo = 0
    for e in mapeo:
        rel, hueco = e[0], e[1]
        if modo == "largo":
            estado, detalle, peso = por_lado_largo(ENTREGA / rel, hueco, dry=dry)
        else:
            med = e[2] if len(e) > 2 else None
            estado, detalle, peso = convertir(ENTREGA / rel, hueco, 0.5, 0.5, med, dry)
        if estado == "OK":
            ok += 1
            print("  ok   %-26s <- %-46s %-22s %s" % (
                hueco, rel.split("/")[-1][:46], detalle,
                ("%6.1f KB" % (peso / 1024)) if peso else ""))
        else:
            fallo += 1
            print("  MAL  %-26s %s" % (hueco, detalle))
    return ok, fallo


if __name__ == "__main__":
    dry = "--dry" in sys.argv
    print("\n== [1][3] huecos existentes (sin tocar codigo) ==")
    a, f1 = aplicar(MAPEO, dry)
    print("\n== [4][5][10] archivos nuevos (hay que editar el .ts que los apunta) ==")
    b, f2 = aplicar(NUEVOS, dry)
    print("\n== [9] charter: proporcion de la fuente, lado largo 1600 ==")
    c, f3 = aplicar(LARGO, dry, modo="largo")
    print("\n== [8] fotos de bodas que SALEN (el cliente las quito de su carpeta) ==")
    for hueco, archivo, que in BORRAR:
        f = DESTINO / (hueco + ".webp")
        existia = f.exists()
        if existia and not dry:
            f.unlink()
        print("  %-6s %-16s %-42s %s" % ("fuera" if existia else "(ya)", hueco, archivo[:42], que))
    print("\n  [6] Foundation Store sigue SIN material: las dos carpetas del")
    print("      cliente («FOUNDATION STORE» y «FOUNDATION STORE - PENDIENTE»)")
    print("      estan vacias, asi que no hay ninguna foto que agregar.")
    print("\n  %d fotos aplicadas (%d sobrescritas + %d nuevas + %d por lado largo), "
          "%d con problema" % (a + b + c, a, b, c, f1 + f2 + f3))
    sys.exit(1 if (f1 + f2 + f3) else 0)
