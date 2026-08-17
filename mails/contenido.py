# -*- coding: utf-8 -*-
"""Los 11 correos: que dice cada uno, en espanol y en ingles.

AQUI se toca el texto. El diseno vive en piezas.py — separados a proposito, para
que cambiar una coma no obligue a mirar una tabla de HTML y para que anadir un
idioma sea anadir un diccionario.

DE DONDE SALE EL COPY
  · Espanol: de las plantillas que mando el cliente
    (mails/archivo-del-cliente-mails.html). Se conserva su mensaje; lo que se
    reescribe es la ESTRUCTURA (un aviso que no deja hacer nada pasa a llevar su
    propia salida) y se retiran los emoji, que eran el delator de «hecho con IA».
  · Ingles: NO es una traduccion paralela. Reutiliza los terminos que la web ya
    usa en produccion — pages/gracias.tsx dice «Your booking», «Guests»,
    «Balance on board (cash, -5%)», «What happens next», «Manage my booking» —
    para que el correo y el sitio no se contradigan.

⚠️ Los emoji tambien salen de los ASUNTOS. Es una decision de diseno coherente
con el resto, no una limitacion tecnica: si el cliente los quiere de vuelta ahi
(en un asunto sí suben la tasa de apertura, a diferencia de dentro del cuerpo),
se reponen en este archivo y nada mas.

⚠️ PRECIOS SIN CONFIRMAR: los extras de +US$ 59 / 150 / 39 son del email del
cliente y NO aparecen en docs/proceso/correcciones-v2-cliente/
TARIFARIO-WEB-ORIGINAL.md. Se dejan tal cual, sin inventar. Pendiente Fernando.
"""

import piezas as p

TELEFONO = "+1 829 305 2804"

# Datos de ejemplo para las previsualizaciones. Salen del tarifario canonico:
# semi-privado Premium US$ 114 x 6 = 684, mas el album en alta US$ 20 = 704.
# Deposito 25 % = 176, saldo 528, y el 5 % de 528 deja 501,60 en efectivo.
EJEMPLO = {
    "es": {
        "first_name": "Marta", "booking_id": "HAA-2417", "boat_name": "Karaya",
        "menu_label": "Menú Premium", "tour_date": "jueves 12 de marzo de 2026",
        "old_date": "jueves 12 de marzo de 2026",
        "pickup_time": "08:15", "return_time": "16:30", "pax": "6 adultos",
        "pickup_point": "Hotel Meliá Caribe Beach",
        "extras_list": "Álbum completo en alta",
        "total": "US$ 704.00", "deposit_paid": "US$ 176.00",
        "balance_due": "US$ 528.00", "balance_cash": "US$ 501.60",
        "cash_discount": "US$ 26.40",
        "menu_deadline": "martes 10 de marzo, 08:15",
        "menu_summary": "2 × Surf &amp; Turf · 2 × Mariscos · 1 × Vegetariano · 1 × Kid’s Meal",
        "changed_field": "Personas", "old_value": "4 adultos", "new_value": "6 adultos",
        "refund_amount": "US$ 176.00", "refund_eta": "3 a 5 días hábiles",
        "support_email": "info@hispaniolaaquaticadventures.com",
        "company_address": "Calle El Cortecito 12, Bávaro 23000",
        "unsubscribe_block": "¿Prefieres no recibir estos correos? Date de baja.",
    },
    "en": {
        "first_name": "Marta", "booking_id": "HAA-2417", "boat_name": "Karaya",
        "menu_label": "Premium menu", "tour_date": "Thursday, 12 March 2026",
        "old_date": "Thursday, 12 March 2026",
        "pickup_time": "08:15", "return_time": "16:30", "pax": "6 adults",
        "pickup_point": "Meliá Caribe Beach Hotel",
        "extras_list": "Full high-res album",
        "total": "US$ 704.00", "deposit_paid": "US$ 176.00",
        "balance_due": "US$ 528.00", "balance_cash": "US$ 501.60",
        "cash_discount": "US$ 26.40",
        "menu_deadline": "Tuesday 10 March, 08:15",
        "menu_summary": "2 × Surf &amp; Turf · 2 × Seafood · 1 × Vegetarian · 1 × Kid’s Meal",
        "changed_field": "Guests", "old_value": "4 adults", "new_value": "6 adults",
        "refund_amount": "US$ 176.00", "refund_eta": "3 to 5 business days",
        "support_email": "info@hispaniolaaquaticadventures.com",
        "company_address": "Calle El Cortecito 12, Bávaro 23000",
        "unsubscribe_block": "Rather not get these emails? Unsubscribe.",
    },
}

# Cadenas compartidas por todos los correos.
COMUN = {
    "es": {
        "ref": "Reserva",
        "ayuda": "¿Alguna duda? Habla directo con el equipo del barco:",
        "direccion": "Hispaniola Aquatic Adventures · Punta Cana, República Dominicana<br>{{company_address}}",
        "franja": "Cancelación gratuita hasta 7 días antes" + p.sep() + "Reserva directa, sin intermediarios",
        "gestionar": "Gestionar mi reserva",
        "ver_reserva": "Ver mi reserva",
        "calendario": "Añadir a mi calendario",
    },
    "en": {
        "ref": "Booking",
        "ayuda": "Any questions? Talk straight to the boat crew:",
        "direccion": "Hispaniola Aquatic Adventures · Punta Cana, Dominican Republic<br>{{company_address}}",
        "franja": "Free cancellation up to 7 days before" + p.sep() + "Book direct, no middlemen",
        "gestionar": "Manage my booking",
        "ver_reserva": "View my booking",
        "calendario": "Add to my calendar",
    },
}

EXTRAS = {
    "es": [
        ("extra-celebracion.jpg", "Pack celebración", "Tarta, espumante y decoración a bordo.", "+US$ 59"),
        ("extra-privado.jpg", "Barco 100 % privado", "Solo tu grupo, sin desconocidos a bordo.", "+US$ 150"),
        ("extra-fotos.jpg", "Fotos y vídeo editado", "Tu día en el mar, grabado y montado.", "+US$ 39"),
    ],
    "en": [
        ("extra-celebracion.jpg", "Celebration pack", "Cake, sparkling wine and decorations on board.", "+US$ 59"),
        ("extra-privado.jpg", "Boat 100% private", "Just your group, no strangers on board.", "+US$ 150"),
        ("extra-fotos.jpg", "Photos and edited video", "Your day at sea, filmed and cut.", "+US$ 39"),
    ],
}


# ═══════════════════════════════════════════════════════════════════════════
#  MAQUETAS — el orden de los bloques de cada correo
# ═══════════════════════════════════════════════════════════════════════════

def m01(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(
            p.filas_datos([
                (t["l_experiencia"], "{{boat_name}} · {{menu_label}}"),
                (t["l_fecha"], "{{tour_date}}"),
                (t["l_horario"], t["v_horario"]),
                (t["l_personas"], "{{pax}}"),
                (t["l_extras"], "{{extras_list}}"),
            ]),
            p.etiqueta(t["l_pago"]) + p.filas_dinero(
                [(t["l_total"], "{{total}}"), (t["l_deposito"], "&minus; {{deposit_paid}}")],
                destacado=(t["l_saldo"], "{{balance_due}}"),
                nota=t["nota_efectivo"],
            ),
        ),
        p.boton(c["gestionar"], "{{manage_link}}"),
        p.enlace_icono(c["calendario"], "{{calendar_link}}"),
        # Condicional: solo si el menu quedo aplazado.
        p.aviso(t["av_titulo"], t["av_cuerpo"], (t["av_enlace"], "{{menu_link}}"), t["av_pie"]),
        p.timeline(t["t_titulo"], [
            (t["t1_cuando"], t["t1_que"]), (t["t2_cuando"], t["t2_que"]), (t["t3_cuando"], t["t3_que"]),
        ]),
        p.filete(pad="24px 32px 0"),
        p.filas_producto(t["x_titulo"], t["x_sub"], EXTRAS[idioma], t["x_enlace"], "{{manage_link}}"),
    ]


def m02(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.boton(t["cta"], "{{menu_link}}"),
        p.aviso(t["av_titulo"], t["av_cuerpo"], None, t["av_pie"], tono="ambar", pad="24px 32px 0"),
        p.tarjeta(p.filas_datos([
            (t["l_experiencia"], "{{boat_name}} · {{menu_label}}"),
            (t["l_fecha"], "{{tour_date}}"),
            (t["l_personas"], "{{pax}}"),
        ])),
    ]


def m03(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"], color_etiqueta=p.T["ambar"]),
        p.aviso(t["av_titulo"], t["av_cuerpo"], None, None, tono="ambar", pad="6px 32px 0"),
        p.boton(t["cta"], "{{menu_link}}"),
        p.enlace(t["alt"], "{{whatsapp_link}}"),
    ]


def m04(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(
            p.etiqueta(t["l_menu"]) + p.parrafo("{{menu_summary}}", margen="0", tam="14px", color=p.T["navy"]),
            p.filas_datos([(t["l_fecha"], "{{tour_date}}"), (t["l_recogida"], "{{pickup_time}}")]),
        ),
        p.boton(c["ver_reserva"], "{{manage_link}}"),
        p.filete(pad="26px 32px 0"),
        p.filas_producto(t["x_titulo"], t["x_sub"], EXTRAS[idioma][:2], t["x_enlace"], "{{manage_link}}"),
    ]


def m05(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(
            p.filas_datos([
                (t["l_recogida"], "{{pickup_point}}"),
                (t["l_hora"], "{{pickup_time}}"),
                (t["l_regreso"], "{{return_time}}"),
            ]),
            p.etiqueta(t["l_pago"]) + p.filas_dinero(
                [], destacado=(t["l_saldo"], "{{balance_due}}"), nota=t["nota_efectivo"]
            ),
        ),
        p.boton(c["ver_reserva"], "{{manage_link}}"),
        p.filete(pad="26px 32px 0"),
        # `lista` y no `timeline`: qué llevar no es una secuencia, y numerarlo
        # diría que el protector solar es «el paso 1 de 4».
        p.lista(t["q_titulo"], [
            (t["q1"], t["q1d"]), (t["q2"], t["q2d"]), (t["q3"], t["q3d"]), (t["q4"], t["q4d"]),
        ], pad="24px 32px 0"),
    ]


def m06(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(
            p.filas_datos([(
                "{{changed_field}}",
                '<span style="color:%s;text-decoration:line-through;font-weight:400;">{{old_value}}</span>'
                "&nbsp;&rarr;&nbsp;{{new_value}}" % p.T["navy_soft"],
            )]),
            p.etiqueta(t["l_pago"]) + p.filas_dinero(
                [(t["l_total"], "{{total}}")], destacado=(t["l_saldo"], "{{balance_due}}")
            ),
        ),
        p.boton(c["ver_reserva"], "{{manage_link}}"),
        p.aviso(t["av_titulo"], t["av_cuerpo"], (t["av_enlace"], "{{whatsapp_link}}"), None, tono="coral"),
    ]


def m07(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(p.filas_datos([(t["l_antes"], "{{old_value}}"), (t["l_ahora"], "{{new_value}}")])),
        p.aviso(t["av_titulo"], t["av_cuerpo"], (t["av_enlace"], "{{whatsapp_link}}"), None, tono="coral"),
        p.aviso_ok(t["ok"]),
    ]


def m08(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"], color_etiqueta=p.T["navy_soft"]),
        p.tarjeta(
            p.filas_datos([(t["l_estado"], t["v_estado"]), (t["l_fecha"], "{{tour_date}}")]),
            p.etiqueta(t["l_reembolso"]) + p.filas_dinero(
                [(t["l_cuando"], "{{refund_eta}}")], destacado=(t["l_importe"], "{{refund_amount}}")
            ),
        ),
        p.boton(t["cta"], "{{rebook_link}}", tono="coral"),
    ]


def m09(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"], color_etiqueta=p.T["ambar"]),
        p.aviso(t["o1_t"], t["o1_c"], None, None, tono="aqua", pad="6px 32px 0"),
        p.aviso(t["o2_t"], t["o2_c"], None, None, tono="neutro", pad="10px 32px 0"),
        p.dos_botones((t["cta1"], "{{reschedule_link}}"), (t["cta2"], "{{refund_link}}")),
        p.enlace(t["alt"], "{{whatsapp_link}}"),
    ]


def m10(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.dos_botones((t["cta1"], "{{review_google_link}}"), (t["cta2"], "{{review_tripadvisor_link}}")),
        p.filete(pad="28px 32px 0"),
        p.aviso(t["fo_titulo"], t["fo_cuerpo"], (t["fo_enlace"], "{{photos_link}}"), None),
        p.aviso(t["re_titulo"], t["re_cuerpo"], (t["re_enlace"], "{{referral_link}}"), None, pad="10px 32px 0"),
    ]


def m11(t, c, idioma):
    return [
        p.intro(t["etiqueta"], t["titular"], t["entradilla"]),
        p.tarjeta(p.filas_datos([
            (t["l_deposito"], t["v_deposito"]),
            (t["l_cancela"], t["v_cancela"]),
            (t["l_resto"], t["v_resto"]),
        ])),
        p.boton(t["cta"], "{{resume_link}}", tono="coral"),
        p.enlace(t["alt"], "{{whatsapp_link}}"),
    ]


# ═══════════════════════════════════════════════════════════════════════════
#  LOS 11 CORREOS
# ═══════════════════════════════════════════════════════════════════════════

EMAILS = [
    # ── 1 ────────────────────────────────────────────────────────────────
    dict(
        id="01-reserva-confirmada", mvp=True, foto="hero-catamaran.jpg", ref=True,
        disparador={"es": "Pago del depósito completado", "en": "Deposit payment completed"},
        monta=m01,
        es=dict(
            asunto="Reserva confirmada, {{first_name}} · {{tour_date}}",
            preheader="Tu resumen, el saldo y lo que pasa a partir de ahora.",
            etiqueta="Reserva confirmada", titular="Nos vemos a bordo, {{first_name}}.",
            entradilla="Tu depósito está cobrado y tu plaza en el " + p.fuerte("{{boat_name}}")
            + " queda guardada para el " + p.fuerte("{{tour_date}}") + ". Esto es todo lo que necesitas saber.",
            l_experiencia="Experiencia", l_fecha="Fecha", l_horario="Horario",
            v_horario="Recogida {{pickup_time}} " + p.sep(p.T["navy_soft"]) + " regreso {{return_time}}",
            l_personas="Personas", l_extras="Extras",
            l_pago="Pago", l_total="Total de la experiencia", l_deposito="Depósito pagado hoy",
            l_saldo="Saldo el día del tour",
            nota_efectivo="En efectivo a bordo son <span style=\"font-weight:600;\">{{balance_cash}}</span>. Te ahorras {{cash_discount}} (5 %).",
            av_titulo="Falta elegir el menú",
            av_cuerpo="Cada persona elige su plato. Puedes hacerlo ahora mismo, sin esperar a nada.",
            av_enlace="Elegir el menú",
            av_pie="Hasta el {{menu_deadline}}" + p.sep() + "48 h antes del tour",
            t_titulo="Qué sigue ahora",
            t1_cuando="Hoy", t1_que="Guarda este email: es tu comprobante. Te lo enviamos también por WhatsApp.",
            t2_cuando="La víspera, por la tarde", t2_que="Te confirmamos el punto y la hora exactos de recogida por WhatsApp.",
            t3_cuando="El día del tour", t3_que="Trae bañador, toalla y protector solar biodegradable. El saldo se paga a bordo.",
            x_titulo="Súmale algo a bordo", x_sub="Se puede añadir hasta 48 h antes, sin volver a pagar el depósito.",
            x_enlace="Añadir a mi reserva",
        ),
        en=dict(
            asunto="Booking confirmed, {{first_name}} · {{tour_date}}",
            preheader="Your summary, the balance and what happens from here.",
            etiqueta="Booking confirmed", titular="See you on board, {{first_name}}.",
            entradilla="Your deposit is paid and your spot on the " + p.fuerte("{{boat_name}}")
            + " is held for " + p.fuerte("{{tour_date}}") + ". Here is everything you need to know.",
            l_experiencia="Experience", l_fecha="Date", l_horario="Schedule",
            v_horario="Pickup {{pickup_time}} " + p.sep(p.T["navy_soft"]) + " back at {{return_time}}",
            l_personas="Guests", l_extras="Extras",
            l_pago="Payment", l_total="Experience total", l_deposito="Deposit paid today",
            l_saldo="Balance on the day",
            nota_efectivo="In cash on board it comes to <span style=\"font-weight:600;\">{{balance_cash}}</span>. You save {{cash_discount}} (5%).",
            av_titulo="Your menu is still open",
            av_cuerpo="Each guest picks their own dish. You can do it right now, no need to wait for anything.",
            av_enlace="Choose the menu",
            av_pie="Until {{menu_deadline}}" + p.sep() + "48 h before the tour",
            t_titulo="What happens next",
            t1_cuando="Today", t1_que="Keep this email: it is your receipt. We send it on WhatsApp too.",
            t2_cuando="The day before, in the afternoon", t2_que="We confirm your exact pickup point and time on WhatsApp.",
            t3_cuando="Tour day", t3_que="Bring a swimsuit, a towel and biodegradable sunscreen. The balance is paid on board.",
            x_titulo="Add something on board", x_sub="You can add it up to 48 h before, with no extra deposit.",
            x_enlace="Add to my booking",
        ),
    ),
    # ── 2 ────────────────────────────────────────────────────────────────
    dict(
        id="02-elige-menu", mvp=True, foto=None, ref=True,
        disparador={"es": "Tras la confirmación, si el menú quedó aplazado",
                    "en": "After confirmation, if the menu was deferred"},
        monta=m02,
        es=dict(
            asunto="{{first_name}}, elige tu menú a bordo",
            preheader="Un paso rápido para que todo esté fresco y listo.",
            etiqueta="Falta un paso", titular="Elige qué vas a comer, {{first_name}}.",
            entradilla="Para que todo esté fresco y listo a bordo, dinos qué va a comer cada persona. "
            "Cada quien elige su plato, con calma.",
            cta="Elegir mi menú",
            av_titulo="Tienes hasta el {{menu_deadline}}",
            av_cuerpo="Son 48 h antes de tu tour. Después de esa hora la cocina ya está cerrada y "
            "preparamos por ti la selección Premium más popular.",
            av_pie="¿Sois {{pax}}? Puedes elegir por todo el grupo desde el mismo enlace.",
            l_experiencia="Experiencia", l_fecha="Fecha", l_personas="Personas",
        ),
        en=dict(
            asunto="{{first_name}}, choose your menu on board",
            preheader="One quick step so everything is fresh and ready.",
            etiqueta="One step left", titular="Choose what you will eat, {{first_name}}.",
            entradilla="So everything is fresh and ready on board, tell us what each guest will eat. "
            "Everyone picks their own dish, no rush.",
            cta="Choose my menu",
            av_titulo="You have until {{menu_deadline}}",
            av_cuerpo="That is 48 h before your tour. After that the kitchen is closed and we prepare "
            "the most popular Premium selection for you.",
            av_pie="Travelling as {{pax}}? You can choose for the whole group from the same link.",
            l_experiencia="Experience", l_fecha="Date", l_personas="Guests",
        ),
    ),
    # ── 3 ────────────────────────────────────────────────────────────────
    dict(
        id="03-ultima-llamada-menu", mvp=True, foto=None, ref=True,
        disparador={"es": "~50-54 h antes del tour, si el menú sigue sin completar",
                    "en": "~50-54 h before the tour, if the menu is still incomplete"},
        monta=m03,
        es=dict(
            asunto="{{first_name}}, últimas horas para elegir tu menú",
            preheader="Si no eliges, preparamos la selección Premium más popular.",
            etiqueta="Últimas horas", titular="Se cierra la cocina, {{first_name}}.",
            entradilla="Tu tour es el " + p.fuerte("{{tour_date}}") + " y la elección del menú se cierra el "
            + p.fuerte("{{menu_deadline}}") + ".",
            av_titulo="Si no eliges, no te quedas sin comer",
            av_cuerpo="Prepararemos por ti la selección Premium más popular. Pero preferimos que comas "
            "justo lo que te apetece.",
            cta="Elegir mi menú ahora",
            alt="Prefiero decíroslo por WhatsApp",
        ),
        en=dict(
            asunto="{{first_name}}, last hours to choose your menu",
            preheader="If you do not choose, we prepare the most popular Premium selection.",
            etiqueta="Last hours", titular="The kitchen is closing, {{first_name}}.",
            entradilla="Your tour is on " + p.fuerte("{{tour_date}}") + " and menu selection closes on "
            + p.fuerte("{{menu_deadline}}") + ".",
            av_titulo="If you do not choose, you still eat",
            av_cuerpo="We will prepare the most popular Premium selection for you. But we would rather "
            "you eat exactly what you feel like.",
            cta="Choose my menu now",
            alt="I would rather tell you on WhatsApp",
        ),
    ),
    # ── 4 ────────────────────────────────────────────────────────────────
    dict(
        id="04-menu-confirmado", mvp=True, foto=None, ref=True,
        disparador={"es": "El cliente completa la elección de menú",
                    "en": "The guest completes their menu selection"},
        monta=m04,
        es=dict(
            asunto="Menú confirmado, {{first_name}} · todo listo",
            preheader="Ya sabemos qué cocinar para ti.",
            etiqueta="Menú confirmado", titular="Ya sabemos qué cocinar, {{first_name}}.",
            entradilla="Lo tendremos fresco y listo, cocinado a bordo en la cocina flotante.",
            l_menu="Lo que vais a comer", l_fecha="Fecha", l_recogida="Recogida",
            x_titulo="Ya que estás aquí", x_sub="Se puede añadir hasta 48 h antes, sin volver a pagar el depósito.",
            x_enlace="Añadir a mi reserva",
        ),
        en=dict(
            asunto="Menu confirmed, {{first_name}} · all set",
            preheader="We now know what to cook for you.",
            etiqueta="Menu confirmed", titular="We know what to cook, {{first_name}}.",
            entradilla="We will have it fresh and ready, cooked on board in the floating kitchen.",
            l_menu="What you will eat", l_fecha="Date", l_recogida="Pickup",
            x_titulo="While you are here", x_sub="You can add it up to 48 h before, with no extra deposit.",
            x_enlace="Add to my booking",
        ),
    ),
    # ── 5 ────────────────────────────────────────────────────────────────
    dict(
        id="05-recordatorio-recogida", mvp=True, foto="hero-recogida.jpg", ref=True,
        disparador={"es": "~48 h antes del tour", "en": "~48 h before the tour"},
        monta=m05,
        es=dict(
            asunto="Casi es hora, {{first_name}} · tu recogida y qué llevar",
            preheader="Punto y hora de recogida, y el saldo a pagar.",
            etiqueta="Casi es hora", titular="Nos vemos el {{tour_date}}.",
            entradilla="Esto es todo lo que necesitas para el día. Guárdalo a mano.",
            l_recogida="Recogida", l_hora="Hora", l_regreso="Regreso aprox.",
            l_pago="Pago", l_saldo="Saldo a pagar a bordo",
            nota_efectivo="En efectivo son <span style=\"font-weight:600;\">{{balance_cash}}</span>. Te ahorras {{cash_discount}} (5 %).",
            q_titulo="Qué llevar",
            q1="Protector solar biodegradable", q1d="El normal daña el arrecife en el que vas a bucear.",
            q2="Traje de baño y toalla", q2d="Se cambia a bordo, hay sitio para dejar la ropa seca.",
            q3="Efectivo para el saldo", q3d="Pagando en efectivo se aplica el 5 % de descuento.",
            q4="Poco más", q4d="Las gafas, el snorkel y la comida van incluidos.",
        ),
        en=dict(
            asunto="Almost time, {{first_name}} · your pickup and what to bring",
            preheader="Pickup point and time, and the balance to pay.",
            etiqueta="Almost time", titular="See you on {{tour_date}}.",
            entradilla="This is everything you need for the day. Keep it handy.",
            l_recogida="Pickup", l_hora="Time", l_regreso="Back at approx.",
            l_pago="Payment", l_saldo="Balance to pay on board",
            nota_efectivo="In cash it comes to <span style=\"font-weight:600;\">{{balance_cash}}</span>. You save {{cash_discount}} (5%).",
            q_titulo="What to bring",
            q1="Biodegradable sunscreen", q1d="The regular kind damages the reef you are about to snorkel.",
            q2="Swimsuit and towel", q2d="You change on board, there is room to keep dry clothes.",
            q3="Cash for the balance", q3d="Paying in cash applies the 5% discount.",
            q4="Not much else", q4d="Mask, snorkel and food are all included.",
        ),
    ),
    # ── 6 ────────────────────────────────────────────────────────────────
    dict(
        id="06-modificacion-reserva", mvp=False, foto=None, ref=True,
        disparador={"es": "Cambio en la reserva (fecha, personas, menú, extras)",
                    "en": "A change in the booking (date, guests, menu, extras)"},
        monta=m06,
        es=dict(
            asunto="Hemos actualizado tu reserva {{booking_id}}",
            preheader="Aquí tienes el antes y el después.",
            etiqueta="Reserva actualizada", titular="Hecho, {{first_name}}.",
            entradilla="Hemos aplicado el cambio que pediste. Esto es lo que ha quedado.",
            l_pago="Pago", l_total="Nuevo total", l_saldo="Saldo el día del tour",
            av_titulo="¿No pediste tú este cambio?",
            av_cuerpo="Escríbenos de inmediato y lo revertimos antes de que afecte a tu salida.",
            av_enlace="Avisar por WhatsApp",
        ),
        en=dict(
            asunto="We have updated your booking {{booking_id}}",
            preheader="Here is the before and after.",
            etiqueta="Booking updated", titular="Done, {{first_name}}.",
            entradilla="We have applied the change you asked for. This is how it stands now.",
            l_pago="Payment", l_total="New total", l_saldo="Balance on the day",
            av_titulo="Did you not request this change?",
            av_cuerpo="Write to us straight away and we will revert it before it affects your departure.",
            av_enlace="Report it on WhatsApp",
        ),
    ),
    # ── 7 ────────────────────────────────────────────────────────────────
    dict(
        id="07-cambio-datos", mvp=False, foto=None, ref=True,
        disparador={"es": "Cambio de email, teléfono o nombre. Enviar TAMBIÉN a la dirección anterior",
                    "en": "Email, phone or name changed. Send it to the OLD address as well"},
        monta=m07,
        es=dict(
            asunto="Hemos actualizado tus datos de contacto",
            preheader="Si no fuiste tú, contáctanos.",
            etiqueta="Datos actualizados", titular="Cambiamos tu {{changed_field}}.",
            entradilla="Hola {{first_name}}, esto afecta a la reserva " + p.fuerte("{{booking_id}}") + ".",
            l_antes="Antes", l_ahora="Ahora",
            av_titulo="¿No fuiste tú?",
            av_cuerpo="Escríbenos de inmediato para proteger tu reserva, o a {{support_email}}.",
            av_enlace="Avisar por WhatsApp",
            ok="Si el cambio lo hiciste tú, no tienes que hacer nada.",
        ),
        en=dict(
            asunto="We have updated your contact details",
            preheader="If this was not you, get in touch.",
            etiqueta="Details updated", titular="We changed your {{changed_field}}.",
            entradilla="Hi {{first_name}}, this affects booking " + p.fuerte("{{booking_id}}") + ".",
            l_antes="Before", l_ahora="Now",
            av_titulo="Was this not you?",
            av_cuerpo="Write to us straight away to protect your booking, or to {{support_email}}.",
            av_enlace="Report it on WhatsApp",
            ok="If you made the change yourself, there is nothing to do.",
        ),
    ),
    # ── 8 ────────────────────────────────────────────────────────────────
    dict(
        id="08-cancelacion", mvp=True, foto=None, ref=True,
        disparador={"es": "El cliente cancela", "en": "The guest cancels"},
        monta=m08,
        es=dict(
            asunto="Tu reserva {{booking_id}} ha sido cancelada",
            preheader="Detalles del reembolso y cómo volver a reservar.",
            etiqueta="Reserva cancelada", titular="Queda cancelada, {{first_name}}.",
            entradilla="Lamentamos que esta vez no puedas acompañarnos. El mar sigue aquí cuando quieras volver.",
            l_estado="Estado", v_estado="Cancelada", l_fecha="Fecha del tour",
            l_reembolso="Reembolso", l_cuando="Lo verás en", l_importe="Te devolvemos",
            cta="Reservar otra fecha",
        ),
        en=dict(
            asunto="Your booking {{booking_id}} has been cancelled",
            preheader="Refund details and how to book again.",
            etiqueta="Booking cancelled", titular="It is cancelled, {{first_name}}.",
            entradilla="Sorry you cannot join us this time. The sea is still here whenever you want to come back.",
            l_estado="Status", v_estado="Cancelled", l_fecha="Tour date",
            l_reembolso="Refund", l_cuando="You will see it in", l_importe="We are returning",
            cta="Book another date",
        ),
    ),
    # ── 9 ────────────────────────────────────────────────────────────────
    dict(
        id="09-reprogramacion-clima", mvp=False, foto=None, ref=True,
        disparador={"es": "La empresa mueve o cancela el tour (clima o fuerza mayor)",
                    "en": "The company moves or cancels the tour (weather or force majeure)"},
        monta=m09,
        es=dict(
            asunto="Importante: hemos tenido que mover tu tour del {{old_date}}",
            preheader="Reprograma sin coste o recibe el reembolso total.",
            etiqueta="Cambio de fecha", titular="No podemos salir el {{old_date}}.",
            entradilla="Por tu seguridad y por las condiciones del mar. Sentimos las molestias. "
            "Elige la opción que prefieras, las dos son sin coste.",
            o1_t="Reprograma tu salida", o1_c="A la fecha que mejor te venga, al mismo precio.",
            o2_t="O te devolvemos todo", o2_c="El importe íntegro de lo que has pagado, sin preguntas.",
            cta1="Reprogramar mi tour", cta2="Pedir el reembolso",
            alt="Prefiero hablarlo con alguien",
        ),
        en=dict(
            asunto="Important: we had to move your tour on {{old_date}}",
            preheader="Reschedule at no cost or get a full refund.",
            etiqueta="Date change", titular="We cannot sail on {{old_date}}.",
            entradilla="For your safety and because of sea conditions. Sorry for the trouble. "
            "Pick whichever option suits you, both are free of charge.",
            o1_t="Reschedule your trip", o1_c="To whatever date suits you, at the same price.",
            o2_t="Or we refund everything", o2_c="The full amount you have paid, no questions asked.",
            cta1="Reschedule my tour", cta2="Request the refund",
            alt="I would rather talk to someone",
        ),
    ),
    # ── 10 ───────────────────────────────────────────────────────────────
    dict(
        id="10-gracias-resena", mvp=True, foto="hero-gracias.jpg", ref=False, baja=True,
        disparador={"es": "Unas horas después del tour, o al día siguiente",
                    "en": "A few hours after the tour, or the next day"},
        monta=m10,
        es=dict(
            asunto="{{first_name}}, ¿cómo estuvo tu día en el mar?",
            preheader="Tu opinión nos ayuda muchísimo, y tus fotos te esperan.",
            etiqueta="Gracias", titular="Gracias por navegar con nosotros, {{first_name}}.",
            entradilla="Esperamos que tu día en el Caribe fuera inolvidable. Si te llevaste una buena "
            "experiencia, ¿nos regalas 30 segundos para contarlo?",
            cta1="Escribir reseña en Google", cta2="Escribir reseña en TripAdvisor",
            fo_titulo="Tus fotos ya están listas",
            fo_cuerpo="Las del día, y las de debajo del agua.",
            fo_enlace="Descargar mis fotos",
            re_titulo="¿Conoces a alguien que vendría?",
            re_cuerpo="Comparte tu enlace y ganáis los dos.",
            re_enlace="Compartir",
        ),
        en=dict(
            asunto="{{first_name}}, how was your day at sea?",
            preheader="Your review helps us enormously, and your photos are waiting.",
            etiqueta="Thank you", titular="Thanks for sailing with us, {{first_name}}.",
            entradilla="We hope your day in the Caribbean was unforgettable. If you had a good time, "
            "would you give us 30 seconds to say so?",
            cta1="Write a Google review", cta2="Write a TripAdvisor review",
            fo_titulo="Your photos are ready",
            fo_cuerpo="The ones from the day, and the underwater ones.",
            fo_enlace="Download my photos",
            re_titulo="Know someone who would come?",
            re_cuerpo="Share your link and you both win.",
            re_enlace="Share it",
        ),
    ),
    # ── 11 ───────────────────────────────────────────────────────────────
    dict(
        id="11-carrito-abandonado", mvp=False, foto="hero-catamaran.jpg", ref=False, baja=True,
        disparador={"es": "~1 h sin terminar la reserva; 2º envío a las ~24 h",
                    "en": "~1 h without finishing the booking; 2nd send at ~24 h"},
        monta=m11,
        es=dict(
            asunto="{{first_name}}, te guardamos tu plaza del {{tour_date}}",
            preheader="Termina en dos minutos. Hoy solo pagas el 25 %.",
            etiqueta="Tu plaza sigue guardada", titular="¿Se te quedó algo pendiente, {{first_name}}?",
            entradilla="Aún tienes tu plaza del " + p.fuerte("{{tour_date}}") + " reservada. "
            "Terminar la reserva te lleva un par de clics.",
            l_deposito="Hoy pagas", v_deposito="Solo el 25 % de depósito",
            l_cancela="Cancelación", v_cancela="Gratis hasta 7 días antes",
            l_resto="El resto", v_resto="El día del tour, con 5 % de descuento en efectivo",
            cta="Terminar mi reserva",
            alt="Prefiero reservar por WhatsApp",
        ),
        en=dict(
            asunto="{{first_name}}, we are holding your spot for {{tour_date}}",
            preheader="Two minutes to finish. Today you only pay 25%.",
            etiqueta="Your spot is still held", titular="Did something come up, {{first_name}}?",
            entradilla="Your spot for " + p.fuerte("{{tour_date}}") + " is still held. "
            "Finishing the booking takes a couple of clicks.",
            l_deposito="Today you pay", v_deposito="Just the 25% deposit",
            l_cancela="Cancellation", v_cancela="Free up to 7 days before",
            l_resto="The rest", v_resto="On tour day, with 5% off when paid in cash",
            cta="Finish my booking",
            alt="I would rather book on WhatsApp",
        ),
    ),
]
