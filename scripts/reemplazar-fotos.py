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
    # sesgo 0.0: este archivo es TEXTURA de fondo bajo degradado en 4 banners.
    # Anclado arriba, la tortuga cae abajo-derecha y deja limpia la mitad
    # superior izquierda, que es donde se apoya el texto.
    ("SUSTAINABILITY/OUR COMPETITIVE ADVANTAGE/1.jpg", "arrecife-fondo-cenital", 0.0),

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
NUEVOS = [
    ("ABOUT US/FACILITIES - ABOUT US/GUEST WELCOME CENTER/IMG_8836-HDR.jpg", "instalacion-recibimiento-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/GUEST WELCOME CENTER/IMG_0337.jpg", "instalacion-recibimiento-2", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/MARINE BIOLOGY CENTER/IMG_0079.jpg", "instalacion-biologia-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8897-HDR.jpg", "instalacion-cocinas-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/IMG_8900-HDR.jpg", "instalacion-cocinas-2", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8815-HDR.jpg", "instalacion-oficinas-1", 0.5, 0.5, CELDA),
    ("ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/IMG_8812-HDR.jpg", "instalacion-oficinas-2", 0.5, 0.5, CELDA),
    ("SUSTAINABILITY/THE FOUNDATION/CLEANER OCEANS.jpeg", "fundacion-limpieza", 0.5, 0.5, CELDA),
    ("SUSTAINABILITY/THE FOUNDATION/RESTORING MARINE.jpg", "fundacion-pescadores", 0.5, 0.5, CELDA),
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
    print("\n== huecos existentes (sin tocar codigo) ==")
    a, f1 = aplicar(MAPEO, dry)
    print("\n== archivos nuevos (obligan a editar el .ts que los apunta) ==")
    b, f2 = aplicar(NUEVOS, dry)
    print("\n== fuera a proposito: %d, pendientes de que Samuel confirme ==" % len(NO_ENTRAN))
    for rel, hueco, motivo in NO_ENTRAN:
        print("  --   %-30s %s" % (hueco, rel.split("/")[-1]))
    print("\n  %d fotos aplicadas (%d sobrescritas + %d nuevas), %d con problema"
          % (a + b, a, b, f1 + f2))
    sys.exit(1 if (f1 + f2) else 0)
