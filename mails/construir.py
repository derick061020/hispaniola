# -*- coding: utf-8 -*-
"""Genera los 44 archivos de correo.

    python mails/construir.py

    plantillas/es/  plantillas/en/   con {{variables}}   -> se pega en el ESP
    preview/es/     preview/en/      con datos ficticios -> se mira y se envia
                                                            como prueba a uno mismo

Nada de lo que cae en esas cuatro carpetas se edita a mano: se pierde al
regenerar. El diseno se toca en piezas.py y el texto en contenido.py.

Comprobaciones que hace antes de dar por buena la salida, porque son justo los
fallos que ya se colaron una vez cada uno:
  · Ninguna {{variable}} visible se queda sin dato de ejemplo en el preview.
  · Ningun archivo pasa de 102 KB, que es donde Gmail recorta el correo.
  · Ningun color de BORDE (linea-fuerte) se usa como color de TEXTO: sobre
    blanco da 1,9:1 y el caracter desaparece.
  · Ninguna imagen apunta a un host que no sea el de produccion.
"""

import os
import pathlib
import re
import sys

AQUI = pathlib.Path(__file__).parent
sys.path.insert(0, str(AQUI))

import contenido as C  # noqa: E402
import piezas as p  # noqa: E402

IDIOMAS = ("es", "en")
TOPE_GMAIL = 102 * 1024


def limpia(carpeta):
    """Borra lo generado antes: si un correo se renombra, el viejo no debe
    quedarse ahi enganando."""
    if carpeta.exists():
        for f in carpeta.glob("*.html"):
            f.unlink()
    carpeta.mkdir(parents=True, exist_ok=True)


def construye(email, idioma):
    t = email[idioma]
    c = C.COMUN[idioma]
    filas = [p.cabecera(c["ref"], "{{booking_id}}" if email.get("ref") else None)]
    if email.get("foto"):
        filas.append(p.foto(email["foto"]))
    filas += email["monta"](t, c, idioma)
    # `pie` se trae su propio aire por arriba, distinto en cada variante.
    # ⚠️ La variante por defecto NO se repite aquí: si un correo no pide una en
    # concreto, no se pasa el argumento y manda el de piezas.pie(). Tenerlo en
    # los dos sitios ya hizo que cambiar el defecto en piezas.py no surtiera
    # ningun efecto, porque este get() lo pisaba.
    extra = {"variante": email["pie"]} if "pie" in email else {}
    filas.append(
        p.pie(c["ayuda"], C.TELEFONO, c["direccion"],
              baja="{{unsubscribe_block}}" if email.get("baja") else None, **extra)
    )
    return p.documento(idioma, t["asunto"], t["preheader"], filas)


def rellena(html, idioma):
    d = C.EJEMPLO[idioma]
    return re.sub(r"\{\{(\w+)\}\}", lambda m: d.get(m.group(1), m.group(0)), html)


def visible(html):
    """El HTML sin comentarios ni atributos: lo que de verdad lee una persona."""
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    return re.sub(r"<[^>]+>", " ", html)


def main():
    raiz = AQUI
    for idioma in IDIOMAS:
        limpia(raiz / "plantillas" / idioma)
        limpia(raiz / "preview" / idioma)

    problemas = []
    total = 0
    for email in C.EMAILS:
        linea = "  %-26s" % email["id"]
        for idioma in IDIOMAS:
            html = construye(email, idioma)
            pv = rellena(html, idioma)

            # 1) variables sin dato de ejemplo (solo las que se ven)
            sueltas = sorted(set(re.findall(r"\{\{(\w+)\}\}", visible(pv))))
            if sueltas:
                problemas.append("%s [%s] sin dato de ejemplo: %s"
                                 % (email["id"], idioma, ", ".join(sueltas)))
            # 2) el tope de recorte de Gmail
            for nombre, doc in (("plantilla", html), ("preview", pv)):
                if len(doc.encode("utf-8")) > TOPE_GMAIL:
                    problemas.append("%s [%s] %s pasa de 102 KB: Gmail lo recorta"
                                     % (email["id"], idioma, nombre))
            # 3) el color de borde usado como color de texto (ya paso dos veces)
            if re.search(r"color:%s\s*;" % p.T["linea_fuerte"], html):
                problemas.append("%s [%s] usa linea-fuerte como color de texto (1,9:1)"
                                 % (email["id"], idioma))
            # 4) imagenes fuera del host de produccion
            for src in re.findall(r'src="(https?://[^"]+)"', html):
                if not src.startswith(p.HOST):
                    problemas.append("%s [%s] imagen fuera del host: %s"
                                     % (email["id"], idioma, src))

            f1 = raiz / "plantillas" / idioma / (email["id"] + ".html")
            f2 = raiz / "preview" / idioma / (email["id"] + ".html")
            f1.write_text(html, encoding="utf-8")
            f2.write_text(pv, encoding="utf-8")
            total += 2
            linea += "  %s %5.1f KB" % (idioma, len(html.encode("utf-8")) / 1024)
        print(linea + ("   MVP" if email.get("mvp") else ""))

    print("\n%d archivos en plantillas/{es,en} y preview/{es,en}" % total)
    if problemas:
        print("\n[!] REVISAR:")
        for x in problemas:
            print("    - " + x)
        return 1
    print("[ok] sin variables sueltas, ninguno pasa de 102 KB, "
          "cero colores de borde como texto, todas las imagenes en el host.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
