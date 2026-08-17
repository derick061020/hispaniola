# Saca de cada archivo documentado la plantilla pelada, lista para pegar en
# Brevo/Mailchimp: solo el correo, sin la ficha de decisiones ni el interruptor
# de previsualizacion.
#
#     python mails/extraer.py
#
# La FUENTE es siempre `mails/NN-*.html`. Este script no edita diseno: recorta
# lo que hay entre EMAIL START y EMAIL END y lo envuelve en un documento HTML
# completo. Si se toca el diseno, se vuelve a ejecutar y ya esta — nunca se
# edita a mano lo que cae en `mails/plantillas/`, porque se pierde al regenerar.

import pathlib
import re

MAILS = pathlib.Path(__file__).parent
SALIDA = MAILS / "plantillas"

# El asunto de cada email. Va al <title>, que ademas es lo que algunos
# clientes muestran como nombre de la pestana al «ver en el navegador».
ASUNTOS = {
    "01-reserva-confirmada": "Reserva confirmada, {{first_name}} · {{tour_date}}",
}

DOC = """<!DOCTYPE html>
<html lang="{idioma}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{asunto}</title>
{cabeza}
</head>
<body style="margin:0;padding:0;background:#eef1f4;">
{cuerpo}
</body>
</html>
"""


def extraer(fuente: pathlib.Path, idioma: str = "es") -> pathlib.Path:
    txt = fuente.read_text(encoding="utf-8")

    bloques = re.findall(r"<!-- EMAIL START -->(.*?)<!-- EMAIL END -->", txt, re.S)
    if len(bloques) != 1:
        raise SystemExit(
            "%s: esperaba 1 bloque EMAIL START/END y hay %d" % (fuente.name, len(bloques))
        )
    email = bloques[0].strip()

    # Todo lo anterior a la primera <table> es material de <head> (los <meta>
    # de color-scheme, el <style> con las media queries y los bloques mso).
    corte = re.search(r"^<table\b", email, re.M)
    if not corte:
        raise SystemExit("%s: no encuentro la <table> raiz del email" % fuente.name)
    cabeza, cuerpo = email[: corte.start()].strip(), email[corte.start():].strip()

    clave = fuente.stem
    doc = DOC.format(
        idioma=idioma,
        asunto=ASUNTOS.get(clave, clave),
        cabeza="\n".join("  " + l if l.strip() else l for l in cabeza.splitlines()),
        cuerpo=cuerpo,
    )

    SALIDA.mkdir(exist_ok=True)
    destino = SALIDA / fuente.name
    destino.write_text(doc, encoding="utf-8")
    return destino


if __name__ == "__main__":
    fuentes = sorted(p for p in MAILS.glob("[0-9][0-9]-*.html"))
    if not fuentes:
        raise SystemExit("no hay ningun mails/NN-*.html que extraer")
    for f in fuentes:
        d = extraer(f)
        print("%-34s -> %s  (%.1f KB)" % (f.name, d.relative_to(MAILS), d.stat().st_size / 1024))
