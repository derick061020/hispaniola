# Saca de cada archivo documentado DOS versiones peladas del correo, sin la
# ficha de decisiones ni el interruptor de previsualizacion:
#
#   plantillas/NN-*.html          con {{variables}}  -> es lo que se pega en el ESP
#   plantillas/NN-*.preview.html  con datos ficticios -> es lo que se mira y se
#                                 envia como prueba a uno mismo
#
#     python mails/extraer.py
#
# La FUENTE es siempre `mails/NN-*.html`. Este script no edita diseno: recorta
# lo que hay entre EMAIL START y EMAIL END y lo envuelve en un documento HTML
# completo. Si se toca el diseno, se vuelve a ejecutar y ya esta — nunca se
# edita a mano lo que cae en `mails/plantillas/`, porque se pierde al regenerar.
#
# Los datos ficticios NO se definen aqui: se leen del objeto EJEMPLO que ya vive
# en la fuente. Una sola definicion, o acaban divergiendo.

import json
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


def datos_ejemplo(txt: str, fuente: pathlib.Path) -> dict:
    """Lee el objeto EJEMPLO de la fuente. Es JSON valido a proposito."""
    m = re.search(r"var EJEMPLO = (\{.*?\});", txt, re.S)
    if not m:
        raise SystemExit("%s: no encuentro el objeto EJEMPLO" % fuente.name)
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        raise SystemExit(
            "%s: EJEMPLO dejo de ser JSON valido (%s). Comillas dobles, sin "
            "comas colgando y sin comentarios dentro del objeto." % (fuente.name, e)
        )


def extraer(fuente: pathlib.Path, idioma: str = "es") -> list:
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
    asunto = ASUNTOS.get(clave, clave)
    cabeza_ind = "\n".join("  " + l if l.strip() else l for l in cabeza.splitlines())

    SALIDA.mkdir(exist_ok=True)
    escritos = []

    # 1) La plantilla con {{variables}} — lo que se pega en el ESP.
    destino = SALIDA / fuente.name
    destino.write_text(
        DOC.format(idioma=idioma, asunto=asunto, cabeza=cabeza_ind, cuerpo=cuerpo),
        encoding="utf-8",
    )
    escritos.append(destino)

    # 2) La misma pieza con datos ficticios — para mirarla y para enviarse una
    #    prueba a uno mismo. Una {{variable}} sin valor en EJEMPLO se queda tal
    #    cual y CANTA en la previsualizacion, que es justo lo que se quiere:
    #    asi se ve de un vistazo si falta por mapear algun campo.
    ejemplo = datos_ejemplo(txt, fuente)
    rellena = lambda s: re.sub(
        r"\{\{(\w+)\}\}", lambda m: ejemplo.get(m.group(1), m.group(0)), s
    )
    destino_pv = SALIDA / (fuente.stem + ".preview.html")
    destino_pv.write_text(
        DOC.format(
            idioma=idioma,
            asunto=rellena(asunto),
            cabeza=cabeza_ind,
            cuerpo=rellena(cuerpo),
        ),
        encoding="utf-8",
    )
    escritos.append(destino_pv)

    # Se ignoran los comentarios HTML: ahi viven notas del tipo «en los emails
    # de marketing va aqui {{unsubscribe_block}}», que no se renderizan. Un
    # aviso que da falsos positivos se acaba ignorando, y entonces no sirve.
    visible = re.sub(r"<!--.*?-->", "", rellena(cuerpo), flags=re.S)
    pendientes = sorted(set(re.findall(r"\{\{(\w+)\}\}", visible)))
    if pendientes:
        # Sin emoji ni acentos: la consola de Windows va en cp1252 y un print
        # con caracteres fuera de esa tabla tumba el script entero.
        print("   [!] sin dato de ejemplo: " + ", ".join(pendientes))

    return escritos


if __name__ == "__main__":
    fuentes = sorted(p for p in MAILS.glob("[0-9][0-9]-*.html"))
    if not fuentes:
        raise SystemExit("no hay ningun mails/NN-*.html que extraer")
    for f in fuentes:
        for d in extraer(f):
            print("%-34s -> %-44s (%.1f KB)"
                  % (f.name, str(d.relative_to(MAILS)), d.stat().st_size / 1024))
