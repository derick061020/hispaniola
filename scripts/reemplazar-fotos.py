# -*- coding: utf-8 -*-
"""Sustituye fotos de app/public/fotos por las de la entrega del cliente.

    python scripts/reemplazar-fotos.py --dry     # solo dice que haria
    python scripts/reemplazar-fotos.py           # aplica

Estrategia: reemplazar EN EL SITIO. El .webp destino conserva su nombre y sus
dimensiones exactas, asi que no hay que tocar codigo y la foto se actualiza en
todos los puntos donde aparezca. NUEVOS es la excepcion: archivos que no
existian y que SI obligan a editar el .ts que los apunta.

⚠️ POR QUE HAY HUECOS QUE NO SE TOCAN AUNQUE HAYA FOTO NUEVA PARA ELLOS.
Este mapeo sale de 11 analistas (uno por seccion) + un revisor adversarial que
abrio las imagenes. El revisor tumbo 22 asignaciones. Las tres razones:

  1. HUECOS COMPARTIDOS. galeria-*, mice-* y events-* NO son de una sola
     pagina: el mismo .webp lo consumen hasta 11 archivos de datos. Meter en
     mice-1 una foto de oficina dejaba dos administrativas bajo el alt
     «Group celebrating the close of an incentive trip on board». Por eso
     TODO lo de instalaciones y fundacion va a archivos NUEVOS.
  2. ALTS QUE DEJARIAN DE SER CIERTOS. El texto alternativo describe la foto
     concreta; si la foto cambia de tema, el alt miente. Ver galeria-semi-
     privado-3 y -6, y galeria-snorkel-lovers-10, que se quedan como estan.
  3. DERECHOS. Marca ajena legible o copyright de otro fotografo en EXIF.
     Esas no se publican hasta que Samuel confirme. Van listadas en NO_ENTRAN.
"""
import sys
import pathlib
from PIL import Image, ImageOps

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ENTREGA = RAIZ / "FOTO PARA NUEVA WEB 2026"
DESTINO = RAIZ / "app/public/fotos"


def convertir(origen, hueco, sesgo_y=0.5, sesgo_x=0.5, medida=None, dry=False):
    """Escribe `origen` sobre DESTINO/hueco.webp con las dimensiones que ya
    tenia (o con `medida` si el archivo es nuevo)."""
    destino = DESTINO / (hueco + ".webp")
    if not origen.exists():
        return ("MAL", "no encuentro %s" % origen.name, 0)
    if destino.exists():
        w, h = Image.open(destino).size
    elif medida:
        w, h = medida
    else:
        return ("MAL", "el hueco %s no existe y no se dio medida" % destino.name, 0)

    im = ImageOps.exif_transpose(Image.open(origen))
    # Muchas vienen de camara con orientacion en EXIF; sin transpose se guardan
    # tumbadas. Y los PNG con alfa se aplanan sobre blanco, no sobre negro.
    if im.mode in ("RGBA", "LA", "P"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        fondo.paste(im, mask=im.split()[3])
        im = fondo
    else:
        im = im.convert("RGB")

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


# ── Huecos que YA existen: se sobrescriben, cero cambios de codigo ───────────
# (archivo de la entrega, hueco, sesgo_y, sesgo_x). Sesgo: 0.0 arriba/izquierda,
# 0.5 centro, 1.0 abajo/derecha. Solo se anota cuando NO es 0.5, y el porque.
MAPEO = [
    # Cabeceras y fondos grandes
    ("TOURS/CARIBBEAN SCAPE/309851022_853479442731938_4097252526470560517_n.jpg", "tour-semi-privado", 0.45),
    ("TOURS/PRIVATE CHARTER/_MG_9052.jpg", "tour-charter-privado"),
    ("HOMEPAGE/FOTO SECCIÓN BOOK DIRECT/1.jpg", "hero-catamaran-1"),

    # Caribbean Escape (semi-privado)
    # sesgo 0.35: la fuente es 4000x6000 VERTICAL contra un hueco de 1.28. Se
    # conserva la banda de la biologa senalando y los visitantes; se van la
    # malla de sombra de arriba y la grava de abajo.
    ("TOURS/CARIBBEAN SCAPE/DSC00210.jpg", "galeria-semi-privado-1", 0.35),
    ("TOURS/CARIBBEAN SCAPE/IMG_2865.jpg", "galeria-semi-privado-2"),
    ("TOURS/CARIBBEAN SCAPE/educational (5).jpg.jpeg", "galeria-semi-privado-4"),
    ("TOURS/CARIBBEAN SCAPE/IMG_0492.jpg", "galeria-semi-privado-5"),
    ("TOURS/CARIBBEAN SCAPE/IMG_0006.jpg", "galeria-semi-privado-7"),

    # Coral Quest (snorkel-lovers)
    ("ABOUT US/MARINE PARK - ABOUT US/UNDERWATER MUSEUM.jpg", "galeria-snorkel-lovers-2"),
    ("TOURS/CORAL QUEST/educational (1).jpg.jpeg", "galeria-snorkel-lovers-4"),
    ("TOURS/CORAL QUEST/IMG_0005.jpg", "galeria-snorkel-lovers-6"),
    ("TOURS/CORAL QUEST/Hispaniola (15) - Copy.jpg", "galeria-snorkel-lovers-7"),
    ("TOURS/CORAL QUEST/IMG_0007.jpg", "galeria-snorkel-lovers-8"),
    ("TOURS/CORAL QUEST/ANMP0290-2.jpg", "galeria-snorkel-lovers-9"),
    ("TOURS/CORAL QUEST/IMG-0013.jpg", "galeria-snorkel-lovers-11"),
    ("ABOUT US/MARINE PARK - ABOUT US/CORAL RESTORA.jpg", "galeria-snorkel-lovers-13"),
    ("TOURS/CORAL QUEST/DSC_0087.jpg", "galeria-snorkel-lovers-16"),
    ("TOURS/CORAL QUEST/laboratorio.jpg", "galeria-snorkel-lovers-17"),
    ("SUSTAINABILITY/THE FOUNDATION/MARINE PROTECTED AREA MANAGEMENT.jpg", "galeria-snorkel-lovers-18"),

    # Private Charter
    ("TOURS/PRIVATE CHARTER/311328254_860570255356190_1677977282157250106_n.jpg", "galeria-charter-privado-1"),
    ("TOURS/PRIVATE CHARTER/7.jpg", "galeria-charter-privado-6"),
    # sesgo 0.0: export cuadrado de redes (1334x1332). Toda la mitad de abajo
    # es agua vacia, asi que se corta por ahi.
    ("TOURS/PRIVATE CHARTER/5.png", "galeria-charter-privado-7", 0.0),

    # Bodas
    ("EVENTS/WEDDINGS/327465943_1015596542733457_2302485152292243686_n.jpg", "weddings-2"),
    ("EVENTS/WEDDINGS/privaxcy.jpg", "weddings-3"),
    ("EVENTS/WEDDINGS/_MG_9277.jpg", "weddings-4"),
    ("EVENTS/WEDDINGS/fotos ok (5).jpg", "weddings-5"),
    ("EVENTS/WEDDINGS/296485566_808445793901970_6379828615875899667_n (1).jpg", "weddings-6"),
    ("EVENTS/WEDDINGS/DSC_0092.JPG", "weddings-7"),
    ("EVENTS/WEDDINGS/Karaya HD (5).jpg", "weddings-9"),
    # sesgo 1.0: cuadrada 4728x4736. Con recorte centrado se van la cola del
    # vestido y los zapatos, que es justo lo que se esta ensenando.
    ("EVENTS/WEDDINGS/Karaya medium (3).png", "weddings-12", 1.0),
    ("EVENTS/WEDDINGS/297366913_807681483978401_2207547620415010561_n.jpg", "weddings-13"),

    # Party boats
    ("EVENTS/PARTYBOATS/_MG_9117.jpg", "events-2"),
    ("EVENTS/PARTYBOATS/COMIDA/CATAMARAN CELENA NOEL_-101.jpg", "events-4"),
    ("EVENTS/PARTYBOATS/Jose and Alejandra catamaran-105.jpg", "events-5"),
    ("EVENTS/PARTYBOATS/DSC_0037-2.jpg", "events-6"),
    ("EVENTS/PARTYBOATS/297774778_808447547235128_8185600368362794796_n.jpg", "events-7"),
    ("EVENTS/PARTYBOATS/311087127_860569968689552_4906102565901882794_n.jpg", "events-8"),

    # Corporate
    ("EVENTS/CORPORATE/316555748_894793101933905_8229126446119761654_n.jpg", "mice-1"),
    ("EVENTS/CORPORATE/IMG_8587.jpg", "mice-4"),

    # Retratos. Son las DOS unicas fichas de /nosotros sin nombre inventado
    # («Captain» / «Marine biologist», rol generico y sin frase atribuida), asi
    # que poner una cara real ahi no fabrica una identidad. Las de Omar, Lola y
    # Eva NO se tocan: llevan nombre y cargo reales y la entrega no dice quien
    # es quien. sesgo_y bajo porque la card usa object-top.
    ("ABOUT US/CREW - ABOUT US/CAPITANES/IMG_8869.jpg", "equipo-capitan", 0.1),
    ("ABOUT US/CREW - ABOUT US/FUNDACIÓN/IMG_8875.jpg", "equipo-biologa", 0.1),
]

# ── Archivos NUEVOS ─────────────────────────────────────────────────────────
# Todo lo de instalaciones y fundacion entra por aqui y NO pisando huecos de
# galeria, porque esos huecos los comparten hasta 11 archivos de datos.
# A 736x574 (el doble del tile de galeria) porque son celdas grandes del bento.
CELDA = (736, 574)
BLOQUE = (1040, 714)
VERT = (720, 1280)   # la celda 9:16 del bento

# ── Recortes con ventana explicita ──────────────────────────────────────────
# (archivo, hueco, caja en coordenadas de la FUENTE, medida final). Solo para
# lo que el sesgo no sabe expresar.
EXACTOS = [
    # ⚠️ `OUR COMPETITIVE ADVANTAGE/1.jpg` y `MARINE PARK/GREEN SEA TURTLE.jpg`
    # son EL MISMO ARCHIVO (md5 58e677be). La tortuga se queda en su bloque de
    # /marine-park, que es donde el cliente la puso por nombre; este hueco es
    # textura de fondo bajo degradado en 4 banners, y uno de ellos es el HERO
    # de esa misma pagina: saldria la misma tortuga dos veces en una pantalla.
    # Se recorta la franja de abajo, sin tortuga y con la mancha de arrecife,
    # que ademas es lo que promete el nombre del hueco.
    ("SUSTAINABILITY/OUR COMPETITIVE ADVANTAGE/1.jpg", "arrecife-fondo-cenital",
     (900, 1850, 2768, 2784), (2400, 1200)),
    # La MISMA foto, pero para el bloque de la historia de las tortugas en
    # /competitive-advantage. Samuel: «está puesta con un tamaño raro donde ni
    # siquiera se ve la tortuga». Aqui la ventana se centra en ella.
    ("SUSTAINABILITY/OUR COMPETITIVE ADVANTAGE/1.jpg", "sostenibilidad-tortuga",
     (876, 675, 3424, 2075), (1200, 660)),
    # La charla de educacion ambiental a bordo. La camara (una AKASO) le quemo
    # la fecha en la esquina inferior derecha: se recorta el 5% de abajo, que
    # es cubierta y no se echa en falta, y de ahi al 4:3 de la caja.
    ("SUSTAINABILITY/OUR COMPETITIVE ADVANTAGE/Community & environmental education.JPG",
     "sostenibilidad-educacion", (160, 0, 4960, 3648), (1200, 900)),
]
NUEVOS = [
    ("ABOUT US/FACILITIES - ABOUT US/GUEST WELCOME CENTER/IMG_8836-HDR.jpg", "instalacion-recibimiento-1", 0.5, 0.5, CELDA),
    # ⚠️ EL VIDEO DEL WELCOME CENTER ES 16:9, no vertical (el cliente no lo
    # grabo en vertical). En vez de recortarlo al hueco 9:16, la zona INTERCAMBIA
    # sitios: el video se va a una celda apaisada y el 9:16 lo ocupa IMG_0337,
    # que es la unica foto vertical de la entrega. Pedido de Samuel 2026-08-21.
    ("ABOUT US/FACILITIES - ABOUT US/GUEST WELCOME CENTER/IMG_0337.jpg", "instalacion-recibimiento-vertical", 0.5, 0.5, VERT),
    ("ABOUT US/FACILITIES - ABOUT US/MARINE BIOLOGY CENTER/IMG_0079.jpg", "instalacion-biologia-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8897-HDR.jpg", "instalacion-cocinas-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8900-HDR.jpg", "instalacion-cocinas-2", 0.5, 0.5, CELDA),
    # ⚠️ El OPERATION CENTER tiene el MISMO problema que el welcome center: su
    # video tambien es 16:9. Samuel no lo menciono —da por hecho que solo el
    # welcome lo era— pero el motivo es identico, asi que recibe el mismo
    # tratamiento. Su hueco 9:16 lo ocupa IMG_8815 recortada en vertical:
    # sesgo_x 0.08 porque la administrativa esta pegada al borde izquierdo y con
    # el recorte centrado se queda fuera de plano.
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8815-HDR.jpg", "instalacion-oficinas-vertical", 0.5, 0.08, VERT),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8812-HDR.jpg", "instalacion-oficinas-2", 0.5, 0.5, CELDA),
    # Las que NO se pintan en el bento y solo salen al abrir el lightbox. El
    # cliente: «las que tengan mas de dos, al darle clic que ahi si esten todas
    # las demas para que se puedan ver».
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8894-HDR.jpg", "instalacion-cocinas-3", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8903-HDR.jpg", "instalacion-cocinas-4", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8818-HDR.jpg", "instalacion-oficinas-3", 0.5, 0.5, CELDA),
    # /marine-park. El cliente nombro cada archivo con la seccion a la que va:
    # UNDERWATER MUSEUM, FOUNDATION BRACELET, CORAL RESTORA, GREEN SEA TURTLE y
    # ARTIFICIAL REEF son, literalmente, los cinco bloques de la pagina. Antes
    # cada bloque tomaba prestado un tile de la galeria de Coral Quest.
    # 1040x714 = la proporcion de la figura (h-96 a media columna), sin escalar
    # ARTIFICIAL REEF, que es la fuente mas pequena de las cinco (1080x806).
    ("ABOUT US/MARINE PARK - ABOUT US/UNDERWATER MUSEUM.jpg", "marine-park-museo", 0.5, 0.5, BLOQUE),
    ("ABOUT US/MARINE PARK - ABOUT US/FOUNDATION BRACELET.jpg", "marine-park-pulsera", 0.5, 0.5, BLOQUE),
    ("ABOUT US/MARINE PARK - ABOUT US/CORAL RESTORA.jpg", "marine-park-coral", 0.5, 0.5, BLOQUE),
    ("ABOUT US/MARINE PARK - ABOUT US/GREEN SEA TURTLE.jpg", "marine-park-tortuga", 0.5, 0.5, BLOQUE),
    ("ABOUT US/MARINE PARK - ABOUT US/ARTIFICIAL REEF.jpg", "marine-park-arrecife", 0.5, 0.5, BLOQUE),

]

# ── Sostenibilidad y fundacion ──────────────────────────────────────────────
# Pedido de Samuel, 2026-08-21. Cada archivo de SUSTAINABILITY lleva en el
# nombre la seccion a la que va, igual que pasaba con MARINE PARK.
FRENTE = (900, 1200)   # la card del carril horizontal de /foundation (3:4)
NUEVOS += [
    ("SUSTAINABILITY/THE FOUNDATION/CORAL REEF RESTORATION.jpg", "fundacion-coral", 0.5, 0.5, FRENTE),
    ("SUSTAINABILITY/THE FOUNDATION/EVIROMENTAL EDUCATION & ECOTOURISM.jpg", "fundacion-educacion", 0.5, 0.5, FRENTE),
    ("SUSTAINABILITY/THE FOUNDATION/MARINE PROTECTED AREA MANAGEMENT.jpg", "fundacion-area-protegida", 0.5, 0.5, FRENTE),
    # RESTORING MARINE.jpg ya estaba convertida como `fundacion-pescadores`,
    # pero su sitio no era «Working with Local Fishermen»: el cliente la nombro
    # por la seccion «Restoring Marine Biodiversity». Se regenera con el nombre
    # que le toca y el frente de pescadores vuelve a su foto anterior.
    ("SUSTAINABILITY/THE FOUNDATION/RESTORING MARINE.jpg", "fundacion-biodiversidad", 0.5, 0.5, FRENTE),
    # La misma limpieza de playa, pero recortada para la card 3:4 del carril.
    ("SUSTAINABILITY/THE FOUNDATION/CLEANER OCEANS.jpeg", "fundacion-limpieza", 0.5, 0.5, FRENTE),
    # /competitive-advantage, bloque 2 «Community & environmental education».
    # ⚠️ Se genera con ventana explicita, en EXACTOS, no aqui: hay que quitarle
    # antes la franja de abajo, donde la camara le quemo la fecha.
]


# ── Los 28 retratos de la tripulacion ───────────────────────────────────────
# La carpeta CREW trae 55 fotos en 6 subcarpetas, 2 o 3 por persona: una de pie
# con los brazos caidos y otra con los BRAZOS CRUZADOS. Samuel (2026-08-21):
# «usa solamente las fotos que estan con los brazos cruzados, ya que se ve un
# poco mas jovial y queda mejor con la web». Donde esa persona no tiene ninguna
# cruzada se usa la que hay.
#
# ⚠️ EL CONTEO NO ES EL QUE DIJO SAMUEL EN DOS CARPETAS, y se deja el suyo por
# escrito para que se pueda comprobar:
#   · CAPITANES: el contaba 3, son 4 (8849/8850, 8853/8854, 8867/8869,
#     8913/8914 — comparadas cara a cara).
# El resto cuadra: cocina 8, fundacion 2, guias 4, marinos 1, oficina 8.
#
# Fuente 3253x4337 = 3:4 exacto, la misma proporcion que la card del muro, asi
# que estos no se recortan: solo se reescalan.
RETRATO = (800, 1067)
PERSONAS = {
    "CAPITANES": ["IMG_8850", "IMG_8854", "IMG_8869", "IMG_8914"],
    # ⚠️ SIN IMG_8771. Al comparar las caras lo separe de 8773 y lo agrupe con
    # 8775; Samuel lo vio en la pagina y corrigio: 8771, 8773 y 8775 son LA
    # MISMA persona, con tres fotos en vez de dos. Con eso cocina son 8, que es
    # justo lo que el contaba. Se queda 8773, la de brazos cruzados.
    "COCINA": ["IMG_8758", "IMG_8762", "IMG_8769", "IMG_8773",
               "IMG_8778", "IMG_8787", "IMG_8859", "IMG_8862"],
    "FUNDACIÓN": ["IMG_8875", "IMG_8913_(2)"],
    "GUÍAS": ["IMG_8908", "IMG_8911", "IMG_8918", "IMG_8922"],
    "MARINOS": ["IMG_8848"],
    "OFICINA": ["IMG_8781", "IMG_8792", "IMG_8796", "IMG_8889", "IMG_8899",
                "IMG_8925", "IMG_8929", "IMG_8936"],
}
# La clave del departamento en data/equipo.ts, sin tildes.
SLUG = {"CAPITANES": "capitanes", "COCINA": "cocina", "FUNDACIÓN": "fundacion",
        "GUÍAS": "guias", "MARINOS": "marinos", "OFICINA": "oficina"}
NUEVOS += [
    ("ABOUT US/CREW - ABOUT US/%s/%s.jpg" % (dep, arch),
     "crew-%s-%d" % (SLUG[dep], n + 1), 0.5, 0.5, RETRATO)
    for dep, archivos in PERSONAS.items()
    for n, arch in enumerate(archivos)
]


# ── Lo que se queda fuera a proposito ───────────────────────────────────────
# No es olvido: cada linea es una decision que Samuel tiene que confirmar.
NO_ENTRAN = [
    ("EVENTS/PARTYBOATS/9.jpg", "events-1",
     "EXIF con copyright de otro fotografo y tres ninos pequenos en primer "
     "plano dentro de una guerra de champan. Es portada de /party-boat."),
    ("EVENTS/CORPORATE/IMG_8270.jpg", "mice-2",
     "Cartel de un cliente ajeno bien legible («AGARA · Hard Rock Retreat · "
     "Punta Cana») y ~20 caras de frente. Ademas no es team building: es un "
     "grupo posando para un selfie."),
    ("EVENTS/CORPORATE/COMIDA/HFS_0035.jpg", "mice-3",
     "Logo de marca ajena («eclipse») legible en el polo del camarero y en el "
     "backdrop. Y es en tierra a mediodia, cuando el hueco es la portada de "
     "/corporate con alt de cubierta al atardecer."),
    ("TOURS/PRIVATE CHARTER/deco.jpg", "galeria-charter-privado-5",
     "EXIF con copyright de otro fotografo. Ademas quitaria a la NOVIA de la "
     "card «Weddings & pre-wedding» de la home, que es la senal que vende."),
    ("SUSTAINABILITY/OUR COMPETITIVE ADVANTAGE/Community & environmental education.JPG",
     "galeria-snorkel-lovers-12",
     "Lleva la FECHA QUEMADA en la esquina («2023/01/02 05:11:09», camara "
     "AKASO Brave 7) y salen varios menores de frente."),
    ("TOURS/CORAL QUEST/8.jpg", "galeria-snorkel-lovers-15",
     "Cuatro o cinco ninos en primerisimo plano, identificables. La alternativa "
     "(MARINE PARK/FOUNDATION BRACELET.jpg) se probo y se descarto al verla: no "
     "es la estructura de coral que promete su nombre, son huespedes en una mesa "
     "de cubierta, y el alt del hueco dice «A Hispaniola coral nursery structure "
     "ready to be planted on the reef». El hueco se queda con la foto vieja."),
    ("EVENTS/CORPORATE/COMIDA/_MG_0947.jpg", "plato-mariscos",
     "Los 10 bodegones de la carta son PLATOS RECORTADOS SOBRE BLANCO con luz "
     "plana; las fotos de comida de la entrega son de mesa puesta, con mantel y "
     "el plato cortado por el encuadre. Se probo tambien recortando el sujeto "
     "sobre blanco: el mantel de rayas viaja con el plato y sigue sin pegar con "
     "la familia. La carta se queda con sus bodegones."),
    ("EVENTS/WEDDINGS/2.jpg", "weddings-10",
     "900x600 y EXIF «Adobe Photoshop CC 2021»: es un reexport de redes, el "
     "archivo de menor resolucion de la entrega. Quedaria mas blando que sus "
     "vecinas en el mismo mosaico."),
]


def aplicar_exactos(lista, dry=False):
    ok = fallo = 0
    for rel, hueco, caja, medida in lista:
        origen, destino = ENTREGA / rel, DESTINO / (hueco + ".webp")
        if not origen.exists():
            print("  MAL  %-30s no encuentro %s" % (hueco, origen.name))
            fallo += 1
            continue
        im = ImageOps.exif_transpose(Image.open(origen)).convert("RGB").crop(caja)
        im = im.resize(medida, Image.LANCZOS)
        if not dry:
            im.save(destino, "WEBP", quality=82, method=6)
        ok += 1
        print("  ok   %-30s <- %-40s %dx%d desde %s  %s" % (
            hueco, rel.split("/")[-1][:40], medida[0], medida[1], caja,
            ("%6.1f KB" % (destino.stat().st_size / 1024)) if not dry else ""))
    return ok, fallo


def aplicar(mapeo, dry=False):
    ok = fallo = 0
    for e in mapeo:
        rel, hueco = e[0], e[1]
        sy = e[2] if len(e) > 2 else 0.5
        sx = e[3] if len(e) > 3 else 0.5
        med = e[4] if len(e) > 4 else None
        estado, detalle, peso = convertir(ENTREGA / rel, hueco, sy, sx, med, dry)
        if estado == "OK":
            ok += 1
            print("  ok   %-30s <- %-46s %-22s %s" % (
                hueco, rel.split("/")[-1][:46], detalle,
                ("%6.1f KB" % (peso / 1024)) if peso else ""))
        else:
            fallo += 1
            print("  MAL  %-30s %s" % (hueco, detalle))
    return ok, fallo


if __name__ == "__main__":
    dry = "--dry" in sys.argv
    # --solo <prefijo>: reaplica unicamente los huecos que empiecen por ahi,
    # para no rehacer las 51 cada vez que se retoca una seccion.
    solo = None
    if "--solo" in sys.argv:
        solo = sys.argv[sys.argv.index("--solo") + 1]
        MAPEO[:] = [e for e in MAPEO if e[1].startswith(solo)]
        NUEVOS[:] = [e for e in NUEVOS if e[1].startswith(solo)]
        EXACTOS[:] = [e for e in EXACTOS if e[1].startswith(solo)]
    print("\n== huecos existentes (sin tocar codigo) ==")
    a, f1 = aplicar(MAPEO, dry)
    print("\n== archivos nuevos (obligan a editar el .ts que los apunta) ==")
    b, f2 = aplicar(NUEVOS, dry)
    print("\n== recortes con ventana explicita ==")
    c, f3 = aplicar_exactos(EXACTOS, dry)
    print("\n== fuera a proposito: %d, pendientes de que Samuel confirme ==" % len(NO_ENTRAN))
    for rel, hueco, motivo in NO_ENTRAN:
        print("  --   %-30s %s" % (hueco, rel.split("/")[-1]))
    print("\n  %d fotos aplicadas (%d sobrescritas + %d nuevas + %d a ventana), "
          "%d con problema" % (a + b + c, a, b, c, f1 + f2 + f3))
    sys.exit(1 if (f1 + f2 + f3) else 0)
