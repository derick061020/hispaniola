# -*- coding: utf-8 -*-
"""Los componentes del sistema de email de Hispaniola.

AQUI se toca el diseno. Un cambio en una funcion de este archivo alcanza a los
11 correos y a los dos idiomas a la vez — que es justo el motivo de que exista:
las primeras rondas de correcciones («fuera Poppins», «quita el badge», «boton
al 100%», «quita el filete») habrian sido 22 ediciones a mano cada una, y a la
tercera ya habria archivos desincronizados sin que nadie lo notara.

Reglas que NO se rompen aqui:
  · Cero hex sueltos: todo color sale de TOKENS, que son los de
    app/src/styles/tokens.css. Si hace falta uno nuevo, se anade ahi primero.
  · Nada de SVG (Gmail lo elimina) ni de emoji como icono. Los iconos son PNG
    servidos al doble de su tamano.
  · Nada de webfonts: Gmail elimina @font-face y @import siempre.
  · Todo en tablas con estilos en linea. El <style> solo lleva media queries,
    que es lo unico que los clientes modernos respetan y los viejos ignoran sin
    romper nada.
"""

HOST = "https://hispaniola-ten.vercel.app/mails"

# Espejo de app/src/styles/tokens.css. Mismos nombres para que el traspaso a
# Figma sea 1:1 y para poder cotejarlos de un vistazo.
T = {
    "papel": "#ffffff",
    "hueso": "#f7f9fa",
    "fondo": "#eef1f4",
    # Cuarto escalon de la familia fria (papel -> hueso -> fondo-ficha -> este).
    # Se usa como superficie del pie claro: un escalon POR DEBAJO del fondo de
    # la pagina, para que el panel se lea como panel y no como un agujero en la
    # tarjeta blanca.
    "alerta_ticket": "#e6ebf0",
    "navy": "#0b2545",
    "navy_sub": "#42525f",
    "navy_soft": "#5b6b78",
    "sobre_navy": "#93a7bb",
    "aqua": "#0e8c9c",
    "aqua_dark": "#0b6f7c",
    "aqua_tint": "#eaf3f4",
    "aqua_claro": "#a9e5ee",
    "coral": "#ef5b44",
    "menta_texto": "#0c7a5e",
    "linea": "#dfe6ea",
    "linea_fuerte": "#c3ced4",
    "ambar": "#8a5a00",
    "ambar_borde": "#e8b84b",
}

FUENTE = "'Helvetica Neue',Helvetica,Arial,sans-serif"

# Borde del boton en tinte aqua. Es un color derivado (el aqua-tint un escalon
# hundido) que no existe en tokens.css porque en la web ese boton no existe.
BORDE_BOTON = "#cfe3e6"


def _f(extra=""):
    return "font-family:%s;%s" % (FUENTE, extra)


# ── Estructura ───────────────────────────────────────────────────────────────

def seccion(html, pad="22px 32px 0", clase="m-pad"):
    """Una fila del email con el sangrado estandar."""
    return '<tr><td style="padding:%s;" class="%s">%s</td></tr>' % (pad, clase, html)


def filete(pad="26px 32px 0"):
    """Separador entre bloques de texto suelto.

    ⚠️ NO se pone despues de un elemento que ya trae borde propio (el aviso, la
    tarjeta): ahi se lee como un doble filete mal calculado.
    """
    return (
        '<tr><td style="padding:%s;" class="m-pad">'
        '<div style="height:1px;background:%s;font-size:0;line-height:0;">&nbsp;</div>'
        "</td></tr>" % (pad, T["linea"])
    )


def aire(alto=28):
    return '<tr><td style="height:%dpx;font-size:0;line-height:0;">&nbsp;</td></tr>' % alto


# [2026-08-17, Samuel: «que no se vea que es una hoja larga única, así separamos
# más visualmente los elementos y la importancia de las cosas»]
# Marcador que parte el correo en cajas blancas independientes. Un correo sin
# CORTE sigue saliendo como una sola caja, así que los otros diez no se enteran.
CORTE = "\x00CORTE\x00"

# Hueco entre cajas. Los mismos 12px del aire lateral de la foto y del pie: en
# este sistema las superficies respiran a 12 y el texto sangra a 32.
HUECO_BLOQUES = 12


# ── Cabecera y pie ───────────────────────────────────────────────────────────

def cabecera(etiqueta_ref=None, ref=None):
    """Blanca, con el logo de tinta oscura. La referencia de reserva es
    opcional: los correos de marketing (11) no tienen ninguna que ensenar."""
    derecha = ""
    if ref:
        derecha = (
            '<td align="right" valign="middle" style="%s">%s <span style="font-weight:700;'
            'color:%s;">%s</span></td>'
            % (
                _f("font-size:12px;font-weight:400;color:%s;white-space:nowrap;" % T["navy_soft"]),
                etiqueta_ref,
                T["navy"],
                ref,
            )
        )
    return (
        '<tr><td style="background:%s;padding:18px 32px 12px;" class="m-pad">'
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0"><tr>'
        '<td align="left" valign="middle">'
        '<img src="%s/logo-hispaniola-navy.png" width="100" height="44" alt="Hispaniola Aquatic Adventures" '
        'style="display:block;border:0;width:100px;height:44px;"></td>%s'
        "</tr></table></td></tr>" % (T["papel"], HOST, derecha)
    )


def foto(archivo):
    """Banda de foto con aire lateral y las 4 esquinas redondeadas.

    ⚠️ Outlook para Windows ignora border-radius en imagenes: ahi sale recta.
    Nunca lleva texto encima: si el cliente bloquea imagenes no se pierde nada.
    """
    return (
        '<tr><td style="padding:0 12px 4px;font-size:0;line-height:0;">'
        '<img src="%s/%s" width="576" height="250" alt="" class="m-full m-hero" '
        'style="display:block;border:0;width:100%%;max-width:576px;height:auto;border-radius:16px;">'
        "</td></tr>" % (HOST, archivo)
    )


def pie(texto_ayuda, telefono, direccion, confianza=None, baja=None, variante="claro"):
    """El pie del correo. Dos variantes mientras se decide cuál se queda.

    `claro` (2026-08-17, pedido de Samuel: «que no toque los extremos, que tenga
    un ligero aire alrededor y sus 4 esquinas, y en vez de fondo azul potente un
    ligero gris azulado, más sutil»). Aprobado el mismo día sobre el email 1 y
    puesto por defecto para los once. El `navy` se queda declarado por si algún
    correo futuro pide cerrar en oscuro; hoy no lo usa ninguno.

    Los 12px de aire lateral son los mismos de la banda de foto, no un número
    nuevo: en este email las piezas de superficie van a 12px y el texto a 32px.

    ⚠️ Al pasar a fondo claro TODA la tinta del pie cambia — el gris de «texto
    sobre navy» (#93a7bb) sobre un gris claro es ilegible. El par que se usa
    aquí ya está medido en tokens.css: --color-navy-soft sobre
    --color-alerta-ticket da 4,56:1, que pasa la AA con poco margen. Si algún
    día se oscurece este fondo, hay que oscurecer también ese texto.
    """
    # [2026-08-17, Samuel: «lo de la cancelación gratuita se repite mucho y tiene
    # su propio banner; que esté en el footer y no sea tan protagonista»] La
    # franja de confianza baja aquí y pierde su caja. Es una garantía, no un
    # mensaje: repetida en los once correos con banner propio pesaba más que el
    # contenido de cada uno. Va delante de la dirección porque le importa más al
    # lector, y a 12px para que se lea como letra pequeña.
    if variante == "claro":
        antes = ""
        if confianza:
            antes = '<p style="%s">%s</p>' % (
                _f("margin:0 0 8px;font-size:12px;line-height:1.6;color:%s;" % T["navy_soft"]),
                confianza,
            )
        extra = ""
        if baja:
            extra = '<p style="%s">%s</p>' % (
                _f("margin:10px 0 0;font-size:11.5px;line-height:1.65;color:%s;" % T["navy_soft"]),
                baja,
            )
        return (
            '<tr><td style="padding:30px 12px 12px;">'
            '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
            'style="background:%s;border-radius:16px;">'
            '<tr><td style="padding:22px 24px;" class="m-pad-card">'
            '<p style="%s">%s<br><a href="{{whatsapp_link}}" style="color:%s;text-decoration:none;'
            'font-weight:600;">WhatsApp %s</a></p>'
            '<div style="height:1px;background:%s;font-size:0;line-height:0;margin:0 0 12px;">&nbsp;</div>'
            "%s"
            '<p style="%s">%s</p>%s'
            "</td></tr></table></td></tr>"
            % (
                T["alerta_ticket"],
                _f("margin:0 0 12px;font-size:13.5px;line-height:1.6;color:%s;" % T["navy_sub"]),
                texto_ayuda,
                T["aqua_dark"],
                telefono,
                T["linea_fuerte"],
                antes,
                _f("margin:0;font-size:11.5px;line-height:1.65;color:%s;" % T["navy_soft"]),
                direccion,
                extra,
            )
        )

    extra = ""
    if baja:
        extra = (
            '<p style="%s">%s</p>'
            % (_f("margin:10px 0 0;font-size:11.5px;line-height:1.65;color:%s;" % T["sobre_navy"]), baja)
        )
    return aire(28) + (
        '<tr><td style="background:%s;padding:26px 32px;" class="m-pad">'
        '<p style="%s">%s<br><a href="{{whatsapp_link}}" style="color:%s;text-decoration:none;'
        'font-weight:600;">WhatsApp %s</a></p>'
        '<div style="height:1px;background:rgba(255,255,255,.12);font-size:0;line-height:0;margin:0 0 12px;">&nbsp;</div>'
        # ⚠️ --color-sobre-navy-suave, NO --color-navy-soft: el gris de «texto
        # secundario sobre papel» da 2,8:1 sobre el navy y no pasa la AA.
        '<p style="%s">%s</p>%s'
        "</td></tr>"
        % (
            T["navy"],
            _f("margin:0 0 12px;font-size:13.5px;line-height:1.6;color:%s;" % T["sobre_navy"]),
            texto_ayuda,
            T["aqua_claro"],
            telefono,
            _f("margin:0;font-size:11.5px;line-height:1.65;color:%s;" % T["sobre_navy"]),
            direccion,
            extra,
        )
    )


# ── Texto ────────────────────────────────────────────────────────────────────

def intro(etiqueta, titular, entradilla, color_etiqueta=None):
    """Etiqueta + titular + entradilla. La etiqueta va en caja baja (pedido de
    Samuel): sin mayusculas y sin tracking, que en minuscula estorba."""
    col = color_etiqueta or T["aqua_dark"]
    return seccion(
        '<p style="%s">%s</p>'
        '<h1 class="m-h1" style="%s">%s</h1>'
        '<p style="%s">%s</p>'
        % (
            _f("margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0;color:%s;" % col),
            etiqueta,
            _f(
                "margin:0 0 12px;font-size:27px;line-height:1.25;font-weight:600;"
                "letter-spacing:-.01em;color:%s;" % T["navy"]
            ),
            titular,
            _f("margin:0;font-size:15px;line-height:1.65;color:%s;" % T["navy_sub"]),
            entradilla,
        ),
        pad="34px 32px 18px",
    )


def etiqueta(texto):
    return '<p style="%s">%s</p>' % (
        _f("margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:0;color:%s;" % T["navy_soft"]),
        texto,
    )


def parrafo(texto, margen="0 0 14px", tam="14px", color=None):
    return '<p style="%s">%s</p>' % (
        _f("margin:%s;font-size:%s;line-height:1.65;color:%s;" % (margen, tam, color or T["navy_sub"])),
        texto,
    )


def fuerte(texto):
    return '<span style="color:%s;font-weight:600;">%s</span>' % (T["navy"], texto)


# ── Tarjeta de datos y de dinero ─────────────────────────────────────────────

def tarjeta(*mitades):
    """Tarjeta de borde gris sutil, sin relleno de color (pedido de Samuel).
    Cada mitad va separada por un filete interno."""
    dentro = ""
    for i, m in enumerate(mitades):
        if i:
            dentro += (
                '<tr><td style="padding:16px 22px 0;" class="m-pad-card">'
                '<div style="height:1px;background:%s;font-size:0;line-height:0;">&nbsp;</div></td></tr>'
                % T["fondo"]
            )
        pad = "20px 22px 4px" if i == 0 else "18px 22px 20px"
        dentro += '<tr><td style="padding:%s;" class="m-pad-card">%s</td></tr>' % (pad, m)
    return seccion(
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="background:%s;border:1px solid %s;border-radius:16px;">%s</table>'
        % (T["papel"], T["linea"], dentro),
        pad="10px 32px 0",
    )


def filas_datos(pares):
    """Etiqueta a la izquierda, valor a la derecha, filete entre filas.
    En movil se apilan (clases m-label / m-value)."""
    filas = []
    for i, (lab, val) in enumerate(pares):
        ultimo = i == len(pares) - 1
        pb = "4px" if ultimo else "11px"
        filas.append(
            '<tr><td class="m-label" width="118" valign="top" style="width:118px;padding:0 0 %s;'
            'font-size:13px;color:%s;">%s</td>'
            '<td class="m-value" valign="top" style="padding:0 0 %s;font-size:14px;font-weight:600;'
            'color:%s;">%s</td></tr>' % (pb, T["navy_soft"], lab, pb, T["navy"], val)
        )
        if not ultimo:
            filas.append(
                '<tr><td colspan="2" style="padding:0 0 11px;"><div style="height:1px;'
                'background:%s;font-size:0;line-height:0;">&nbsp;</div></td></tr>' % T["fondo"]
            )
    return (
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="%s">%s</table>' % (_f(), "".join(filas))
    )


def filas_dinero(lineas, destacado=None, nota=None):
    """Cuenta alineada a la derecha. El importe destacado NO lleva fondo: pesa
    por tamano (22px/700) y por el filete que lo precede."""
    filas = []
    for lab, val in lineas:
        filas.append(
            '<tr><td align="left" style="padding:0 0 9px;font-size:14px;color:%s;">%s</td>'
            '<td align="right" style="padding:0 0 9px;font-size:14px;font-weight:600;color:%s;'
            'white-space:nowrap;">%s</td></tr>' % (T["navy_sub"], lab, T["navy"], val)
        )
    if destacado:
        # El filete solo si hay cuenta encima que cerrar. Sin lineas previas
        # (email 5: solo hay saldo) dibujaba una raya con nada arriba.
        if lineas:
            filas.append(
                '<tr><td colspan="2" style="padding:5px 0 13px;"><div style="height:1px;background:%s;'
                'font-size:0;line-height:0;">&nbsp;</div></td></tr>' % T["linea"]
            )
        filas.append(
            '<tr><td align="left" valign="middle" style="font-size:14px;font-weight:600;color:%s;">%s</td>'
            '<td align="right" valign="middle" style="font-size:22px;font-weight:700;'
            'letter-spacing:-.015em;color:%s;white-space:nowrap;">%s</td></tr>'
            % (T["navy"], destacado[0], T["navy"], destacado[1])
        )
    if nota:
        filas.append(
            '<tr><td colspan="2" style="padding-top:7px;font-size:12.5px;line-height:1.55;'
            'color:%s;">%s</td></tr>' % (T["menta_texto"], nota)
        )
    return (
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="%s">%s</table>' % (_f(), "".join(filas))
    )


# ── Aviso ────────────────────────────────────────────────────────────────────

# El filete de acento del aviso DICE algo, no decora:
#   aqua   -> informativo, hay algo que puedes hacer
#   ambar  -> hay un plazo o una consecuencia si no actúas
#   coral  -> algo va mal y hay que reaccionar
#   neutro -> una alternativa del mismo peso que otra (email 9: las dos
#             opciones son gratis y equivalentes; pintar una de ámbar diría
#             «cuidado con esta», que es falso)
TONOS = {"aqua": T["aqua"], "ambar": T["ambar_borde"], "coral": T["coral"], "neutro": T["linea_fuerte"]}


def aviso(titulo, cuerpo, enlace=None, pie_texto=None, tono="aqua", pad="22px 32px 0"):
    """Bloque perfilado con filete de acento a la izquierda. Sin relleno.

    Si lleva `enlace`, el aviso trae su propia salida — que es la diferencia
    entre avisar y dejar al lector con una tarea y ninguna forma de resolverla.
    """
    html = '<p style="%s">%s</p>' % (
        _f("margin:0 0 5px;font-size:14px;font-weight:600;line-height:1.4;color:%s;" % T["navy"]),
        titulo,
    )
    html += '<p style="%s">%s</p>' % (
        _f(
            "margin:0 0 %s;font-size:13.5px;line-height:1.6;color:%s;"
            % ("11px" if (enlace or pie_texto) else "0", T["navy_sub"])
        ),
        cuerpo,
    )
    if enlace:
        html += '<p style="margin:0 0 9px;"><a href="%s" style="%s">%s &rarr;</a></p>' % (
            enlace[1],
            _f("font-size:13.5px;font-weight:600;color:%s;text-decoration:none;" % T["aqua_dark"]),
            enlace[0],
        )
    if pie_texto:
        html += '<p style="%s">%s</p>' % (
            _f("margin:0;font-size:12.5px;line-height:1.5;color:%s;" % T["navy_soft"]),
            pie_texto,
        )
    return seccion(
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="border:1px solid %s;border-left:3px solid %s;border-radius:0 10px 10px 0;">'
        '<tr><td style="padding:16px 18px;%s">%s</td></tr></table>'
        % (T["linea"], TONOS[tono], _f(), html),
        pad=pad,
    )


# ── Acciones ─────────────────────────────────────────────────────────────────

def boton(texto, href, tono="suave", pad="22px 32px 0"):
    """Boton a ancho completo.

    `suave` (tinte aqua) es el de por defecto: en la mayoria de estos correos la
    reserva YA esta hecha y pagada, asi que la accion es mantenimiento y no
    conversion. El `coral` se reserva para los dos correos donde la accion SI es
    convertir — el carrito abandonado y la reprogramacion.

    ⚠️ VML no entiende porcentajes: ahi el ancho va fijo en 536px
    (600 del email menos 32 de sangrado a cada lado).
    """
    if tono == "coral":
        fondo, borde, tinta, vml_borde = T["coral"], T["coral"], T["papel"], T["coral"]
    else:
        fondo, borde, tinta, vml_borde = T["aqua_tint"], BORDE_BOTON, T["aqua_dark"], BORDE_BOTON
    return seccion(
        "<!--[if mso]>"
        '<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" '
        'href="%s" style="height:48px;v-text-anchor:middle;width:536px;" arcsize="21%%" '
        'strokecolor="%s" strokeweight="1px" fillcolor="%s"><w:anchorlock/>'
        '<center style="color:%s;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;">%s</center>'
        "</v:roundrect><![endif]-->"
        "<!--[if !mso]><!-- -->"
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0"><tr>'
        '<td align="center" style="border-radius:10px;background:%s;border:1px solid %s;">'
        '<a href="%s" style="%s">%s</a></td></tr></table>'
        "<!--<![endif]-->"
        % (
            href, vml_borde, fondo, tinta, texto,
            fondo, borde, href,
            _f(
                "display:block;padding:15px 20px;font-size:15px;font-weight:600;line-height:1;"
                "color:%s;text-decoration:none;border-radius:10px;" % tinta
            ),
            texto,
        ),
        pad=pad,
    )


def enlace_icono(texto, href, icono="icono-calendario.png", pad="0 32px 0"):
    """Enlace centrado con icono PNG.

    ⚠️ PNG y no SVG: Gmail elimina el SVG. Y no emoji, que es el tic que se
    quito del diseno del cliente. Se sirve a 32px y se muestra a 16.
    """
    return seccion(
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0"><tr>'
        '<td align="center" style="padding:14px 0 0;%s">'
        '<a href="%s" style="color:%s;text-decoration:none;font-weight:600;">'
        '<img src="%s/%s" width="16" height="16" alt="" style="width:16px;height:16px;border:0;'
        'vertical-align:-3px;margin-right:7px;">%s</a></td></tr></table>'
        % (_f("font-size:13.5px;line-height:1.5;"), href, T["aqua_dark"], HOST, icono, texto),
        pad=pad,
    )


def enlace(texto, href, pad="16px 32px 0"):
    return seccion(
        '<p style="margin:0;%s"><a href="%s" style="color:%s;text-decoration:none;font-weight:600;">'
        "%s &rarr;</a></p>" % (_f("font-size:13px;"), href, T["aqua_dark"], texto),
        pad=pad,
    )


def dos_botones(primario, secundario, pad="22px 32px 0"):
    """Dos opciones del mismo peso (email 9: reprogramar o reembolso).
    Se apilan en movil — dos botones en fila se parten mal por debajo de 480px."""
    return (
        boton(primario[0], primario[1], tono="coral", pad=pad)
        + seccion(
            '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0"><tr>'
            '<td align="center" style="border-radius:10px;background:%s;border:1px solid %s;">'
            '<a href="%s" style="%s">%s</a></td></tr></table>'
            % (
                T["papel"], T["linea_fuerte"], secundario[1],
                _f(
                    "display:block;padding:15px 20px;font-size:15px;font-weight:600;line-height:1;"
                    "color:%s;text-decoration:none;border-radius:10px;" % T["navy"]
                ),
                secundario[0],
            ),
            pad="10px 32px 0",
        )
    )


# ── Bloques compuestos ───────────────────────────────────────────────────────

def timeline(titulo, pasos, pad="34px 32px 0"):
    """Pasos numerados. Sale de la pagina /gracias de la web: es lo que de
    verdad calma a quien acaba de pagar un deposito."""
    filas = []
    for i, (cuando, que) in enumerate(pasos, 1):
        ultimo = i == len(pasos)
        pb = "4px" if ultimo else "16px"
        filas.append(
            '<tr><td width="38" valign="top" style="width:38px;padding:0 0 %s;">'
            '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
            '<td width="26" height="26" align="center" valign="middle" style="width:26px;height:26px;'
            'background:%s;border-radius:999px;font-size:12px;font-weight:700;color:%s;line-height:26px;">%d</td>'
            "</tr></table></td>"
            '<td valign="top" style="padding:0 0 %s;">'
            '<p style="margin:0 0 2px;font-size:13.5px;font-weight:600;color:%s;line-height:1.45;">%s</p>'
            '<p style="margin:0;font-size:13px;color:%s;line-height:1.6;">%s</p></td></tr>'
            % (pb, T["aqua_tint"], T["aqua_dark"], i, pb, T["navy"], cuando, T["navy_soft"], que)
        )
    return seccion(
        etiqueta(titulo)
        + '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="%s">%s</table>' % (_f(), "".join(filas)),
        pad=pad,
    )


def lista(titulo, items, pad="24px 32px 0"):
    """Items que NO son una secuencia — qué llevar, qué incluye, qué opciones hay.

    ⚠️ Deliberadamente SIN numerar. El timeline de arriba numera porque sus pasos
    ocurren en orden; una lista de equipaje no. Numerar algo que no lleva orden
    dice al lector que hay una secuencia donde no la hay: decora en vez de
    informar. Aquí la jerarquía la pone el peso del texto, no un contador.
    """
    filas = []
    for i, (que, detalle) in enumerate(items):
        ultimo = i == len(items) - 1
        pb = "0" if ultimo else "13px"
        filas.append(
            '<tr><td valign="top" style="padding:0 0 %s;">'
            '<p style="margin:0 0 2px;font-size:13.5px;font-weight:600;color:%s;line-height:1.45;">%s</p>'
            '<p style="margin:0;font-size:13px;color:%s;line-height:1.6;">%s</p></td></tr>'
            % (pb, T["navy"], que, T["navy_soft"], detalle)
        )
    return seccion(
        etiqueta(titulo)
        + '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="%s">%s</table>' % (_f(), "".join(filas)),
        pad=pad,
    )


def filas_producto(titulo, subtitulo, items, enlace_texto, enlace_href, pad="24px 32px 0"):
    """Venta cruzada: miniatura + nombre + precio. Filas, no tarjetas — se
    venden experiencias, no lineas de factura.

    El precio comparte fila con el nombre y la descripcion va debajo a todo el
    ancho: con el precio en columna propia, en movil la descripcion se queda en
    ~100px y se parte en cuatro lineas.
    """
    filas = []
    for i, (img, nombre, desc, precio) in enumerate(items):
        ultimo = i == len(items) - 1
        pb = "4px" if ultimo else "14px"
        filas.append(
            '<tr><td width="86" valign="top" style="width:86px;padding:0 0 %s;">'
            '<img src="%s/%s" width="72" height="72" alt="" style="display:block;border:0;'
            'width:72px;height:72px;border-radius:6px;"></td>'
            '<td valign="top" style="padding:2px 0 %s;">'
            '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0"><tr>'
            '<td align="left" style="padding:0 8px 3px 0;font-size:14px;font-weight:600;color:%s;'
            'line-height:1.4;">%s</td>'
            '<td align="right" valign="top" style="padding:0 0 3px;font-size:14px;font-weight:600;'
            'color:%s;white-space:nowrap;">%s</td></tr>'
            '<tr><td colspan="2" style="font-size:13px;color:%s;line-height:1.55;">%s</td></tr>'
            "</table></td></tr>"
            % (pb, HOST, img, pb, T["navy"], nombre, T["navy"], precio, T["navy_soft"], desc)
        )
        if not ultimo:
            filas.append(
                '<tr><td colspan="2" style="padding:0 0 14px;"><div style="height:1px;background:%s;'
                'font-size:0;line-height:0;">&nbsp;</div></td></tr>' % T["fondo"]
            )
    return seccion(
        etiqueta(titulo).replace("margin:0 0 14px", "margin:0 0 4px")
        + parrafo(subtitulo, margen="0 0 16px", tam="13px", color=T["navy_soft"])
        + '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" '
        'style="%s">%s</table>' % (_f(), "".join(filas))
        + '<p style="margin:16px 0 0;%s"><a href="%s" style="color:%s;text-decoration:none;'
        'font-weight:600;">%s &rarr;</a></p>' % (_f("font-size:13px;"), enlace_href, T["aqua_dark"], enlace_texto),
        pad=pad,
    )


def aviso_ok(texto):
    """La nota tranquilizadora del email 7 («si el cambio lo hiciste tu, no
    tienes que hacer nada»).

    Nace al retirar franja(): ese componente existia para la banda de confianza,
    que desde 2026-08-17 vive dentro del pie. Este texto NO es lo mismo —es una
    frase propia de un solo correo, no una garantia repetida— asi que se queda
    con su propia pieza en vez de heredar una caja que ya no significa nada.
    """
    return seccion(
        '<p style="%s">%s</p>'
        % (_f("margin:0;font-size:13px;line-height:1.6;color:%s;" % T["navy_soft"]), texto),
        pad="22px 32px 0",
    )


def sep(color=None):
    """El punto medio entre dos datos.

    ⚠️ NO se usa --color-linea-fuerte aqui: es un color de BORDE y sobre blanco
    da 1,9:1, o sea que el separador desaparece. Ya paso dos veces.
    """
    return '<span style="color:%s;">&nbsp;&middot;&nbsp;</span>' % (color or T["sobre_navy"])


# ── Documento ────────────────────────────────────────────────────────────────

CABEZA = """<!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>
    /* Bloquea que Apple Mail/Outlook.com inviertan los colores por su cuenta. */
    :root{color-scheme:light}
    /* Lo unico que respetan los clientes modernos y los viejos ignoran sin romper. */
    @media only screen and (max-width:480px){
      .m-full{width:100%% !important;max-width:100%% !important}
      .m-pad{padding-left:20px !important;padding-right:20px !important}
      /* La tarjeta va anidada: sin esto se suman 20+22px por lado y en 375px la
         columna de contenido se queda en 291px. */
      .m-pad-card{padding-left:14px !important;padding-right:14px !important}
      .m-h1{font-size:22px !important;line-height:1.28 !important}
      .m-hero{height:auto !important}
      .m-label{display:block !important;width:100%% !important;padding-bottom:2px !important}
      .m-value{display:block !important;width:100%% !important}
    }
  </style>
  <!--[if mso]>
  <style>*{font-family:Arial,Helvetica,sans-serif !important}</style>
  <![endif]-->"""

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
<body style="margin:0;padding:0;background:{fondo};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{fondo};margin:0;padding:0;">
<tr><td align="center" style="padding:28px 12px 40px;">

  <!-- Preheader: se ve en la bandeja, nunca dentro del email -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:{fondo};">{preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

{cuerpo}
</td></tr>
</table>
</body>
</html>
"""

CAJA_INI = ('  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
            'class="m-full" style="width:600px;max-width:600px;background:%s;border-radius:16px;'
            'overflow:hidden;">' % T["papel"])
CAJA_FIN = "  </table>"

# Separador entre cajas. Va en su propia tabla y no en un <div>: Outlook colapsa
# los divs sueltos entre tablas y el hueco desaparece justo donde mas se nota.
HUECO = ('  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
         'class="m-full" style="width:600px;max-width:600px;"><tr>'
         '<td height="%d" style="height:%dpx;font-size:0;line-height:0;">&nbsp;</td>'
         "</tr></table>" % (HUECO_BLOQUES, HUECO_BLOQUES))


def documento(idioma, asunto, preheader, filas):
    """Monta el documento. Si `filas` trae marcadores CORTE, el correo sale
    partido en varias cajas blancas con hueco entre ellas; si no, en una sola."""
    bloques, actual = [], []
    for f in filas:
        if f == CORTE:
            bloques.append(actual)
            actual = []
        else:
            actual.append(f)
    bloques.append(actual)

    partes = []
    for i, bloque in enumerate(bloques):
        if i:
            partes.append(HUECO)
        partes.append(CAJA_INI)
        partes += ["    " + f for f in bloque]
        # Cada caja se cierra con su propio aire: antes ese hueco lo daba el
        # bloque siguiente, y al partir el correo se quedaria pegado al borde.
        if i < len(bloques) - 1:
            partes.append("    " + aire(22))
        partes.append(CAJA_FIN)

    return DOC.format(
        idioma=idioma,
        asunto=asunto,
        preheader=preheader,
        cabeza=CABEZA,
        fondo=T["fondo"],
        cuerpo="\n".join(partes),
    )
