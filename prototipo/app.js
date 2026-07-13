/* ============================================================
   Hispaniola — Prototipo. Router + render + interacciones.
   Script clásico (NO type=module) — se abre con file://.
   Ver prototipo/PLAN.md para el contrato de rutas y estado.
   ============================================================ */
(function () {
  'use strict';

  var app = document.getElementById('app');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return (s === null || s === undefined) ? '' : String(s); }

  // ============================================================
  // ROUTER (hash-based, con :params y query string)
  // ============================================================
  var RUTAS = [];

  function ruta(patron, manejador) {
    var nombres = [];
    var regexStr = patron.replace(/:[a-zA-Z]+/g, function (m) {
      nombres.push(m.slice(1));
      return '([^/]+)';
    });
    var regex = new RegExp('^' + regexStr + '$');
    RUTAS.push({ regex: regex, nombres: nombres, manejador: manejador });
  }

  function parseHash() {
    var hash = location.hash.slice(1) || '/';
    var qIdx = hash.indexOf('?');
    var path = qIdx >= 0 ? hash.slice(0, qIdx) : hash;
    var queryStr = qIdx >= 0 ? hash.slice(qIdx + 1) : '';
    var query = {};
    queryStr.split('&').forEach(function (par) {
      if (!par) return;
      var kv = par.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
    return { path: path, query: query };
  }

  function irA(hash) { location.hash = hash; }
  window.irA = irA;

  function enrutar() {
    cerrarTodosLosMenus();
    var info = parseHash();
    for (var i = 0; i < RUTAS.length; i++) {
      var m = info.path.match(RUTAS[i].regex);
      if (m) {
        var params = {};
        RUTAS[i].nombres.forEach(function (n, idx) { params[n] = decodeURIComponent(m[idx + 1]); });
        try {
          RUTAS[i].manejador(params, info.query);
        } catch (e) {
          console.error('Error renderizando ruta', info.path, e);
          app.innerHTML = '<div class="contenedor seccion"><p>Ocurrió un error renderizando esta página. Revisa la consola.</p></div>';
        }
        window.scrollTo(0, 0);
        actualizarNavActiva(info.path);
        return;
      }
    }
    render404();
  }

  function render404() {
    app.innerHTML =
      '<div class="contenedor seccion" style="text-align:center; padding:80px 24px;">' +
      '<p class="etq">404</p>' +
      '<h1 style="font-size:28px; margin-bottom:12px;">Esta página no existe (todavía)</h1>' +
      '<p class="meta" style="margin-bottom:20px;">Ruta no encontrada: <span class="mono">' + esc(location.hash) + '</span></p>' +
      '<a href="#/" class="btn btn-primario">Volver al inicio</a>' +
      '</div>';
  }

  // ============================================================
  // HEADER — megamenús, desplegables, menú móvil
  // ============================================================
  function cerrarTodosLosMenus() {
    $all('.nav-item.abierto').forEach(function (el) { el.classList.remove('abierto'); });
  }

  function inicializarHeaderInteracciones() {
    $all('[data-toggle-menu]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var item = btn.closest('.nav-item');
        var yaAbierto = item.classList.contains('abierto');
        cerrarTodosLosMenus();
        if (!yaAbierto) item.classList.add('abierto');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item')) cerrarTodosLosMenus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cerrarTodosLosMenus(); cerrarMenuMovil(); }
    });

    var btnHam = $('#btn-hamburguesa');
    var btnCerrarMovil = $('#btn-cerrar-movil');
    if (btnHam) btnHam.addEventListener('click', abrirMenuMovil);
    if (btnCerrarMovil) btnCerrarMovil.addEventListener('click', cerrarMenuMovil);
  }

  function abrirMenuMovil() {
    poblarMenuMovil();
    $('#menu-movil').classList.add('abierto');
    document.body.style.overflow = 'hidden';
  }
  function cerrarMenuMovil() {
    var m = $('#menu-movil');
    if (m) m.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  function actualizarNavActiva(path) {
    // placeholder por si se quiere resaltar el item activo del menú desktop
  }

  // ---- Contenido de los megamenús (poblado desde datos.js) ----
  function poblarMegamenus() {
    var mTours = $('#mega-tours');
    if (mTours) mTours.innerHTML = megamenuToursHTML();
    var mEventos = $('#mega-eventos');
    if (mEventos) mEventos.innerHTML = megamenuEventosHTML();
  }

  function megamenuToursHTML() {
    var medioDia = ORDEN_TOURS.filter(function (s) { return s !== 'isla-saona'; });
    var diaCompleto = ['isla-saona'];
    function tarjeta(slug) {
      var t = TOURS[slug];
      return '<a class="mega-tour-item" href="#/tour/' + slug + '">' +
        '<div class="img">Foto</div>' +
        '<div><strong>' + esc(t.nombre) + '</strong>' +
        '<span class="meta">' + esc(t.audiencia) + (t.maxPax ? ' · máx. ' + t.maxPax : '') + '</span>' +
        '<span class="meta" style="display:block; font-weight:700; color:var(--tinta);">desde ' + formatoDinero(t.precioLight) + '</span>' +
        '</div></a>';
    }
    return '<div class="grid-3" style="gap:20px;">' +
      '<div style="grid-column:span 2;">' +
      '<p class="mega-col-title">Medio día · 4 horas</p>' +
      medioDia.map(tarjeta).join('') +
      '</div>' +
      '<div><p class="mega-col-title">Día completo</p>' + diaCompleto.map(tarjeta).join('') + '</div>' +
      '</div>' +
      '<div class="mega-footer">' +
      '<span class="meta">¿No sabes cuál elegir? <a href="#/reserva-directa" style="font-weight:700;">Compara los 4 →</a></span>' +
      '<span class="meta">★ 4.9 · 1.782 reseñas</span>' +
      '<a href="#/tours" class="btn btn-secundario btn-sm">Ver todos los tours →</a>' +
      '</div>';
  }

  function megamenuEventosHTML() {
    var celebraciones = OCASIONES.filter(function (o) { return o.tipo !== 'mice'; });
    var corporativo = OCASIONES.filter(function (o) { return o.tipo === 'mice'; });
    function itemLanding(o) {
      return '<a class="mega-tour-item" href="' + o.ruta + '">' +
        '<div class="img" style="width:56px;">Foto</div>' +
        '<div><strong>' + esc(o.nombre) + '</strong><span class="meta">' + esc(o.meta) + '</span></div></a>';
    }
    function itemChico(o) {
      return '<a class="mega-ev-item" href="' + o.ruta + '">' + esc(o.nombre) + ' <span class="chip" style="margin-left:4px;">form ya elegido</span></a>';
    }
    return '<div class="grid-3" style="gap:20px;">' +
      '<div><p class="mega-col-title">Celebraciones</p>' +
      itemLanding(celebraciones[0]) +
      celebraciones.slice(1).map(itemChico).join('') +
      '</div>' +
      '<div><p class="mega-col-title">Corporativo</p>' +
      itemLanding(corporativo[0]) +
      '<a class="mega-ev-item" href="#/eventos?tipo=mice">Incentivos <span class="chip">form ya elegido</span></a>' +
      '<a class="mega-ev-item" href="#/eventos?tipo=mice">Team building <span class="chip">form ya elegido</span></a>' +
      '<a class="mega-ev-item" href="#/eventos?tipo=mice">Cierre de convención <span class="chip">form ya elegido</span></a>' +
      '<span class="mega-ev-item" style="color:var(--acento);">⬇ Dossier corporativo (PDF)</span>' +
      '</div>' +
      '<div class="benef">' +
      '<h4>Barco entero para tu grupo</h4>' +
      '<p>De 10 a 120 personas · desde US$ 55/pers · comida a bordo, barra y coordinación.</p>' +
      '<p style="margin-top:8px; font-weight:700;">★ Couples\' Choice WeddingWire 2018-2021</p>' +
      '<a href="#/eventos" class="btn btn-primario btn-bloque btn-sm" style="margin-top:10px;">Pedir cotización</a>' +
      '</div></div>';
  }

  function poblarMenuMovil() {
    var cont = $('#menu-movil-acordeon');
    if (!cont) return;
    var secciones = [
      {
        titulo: 'Tours', items: ORDEN_TOURS.map(function (s) {
          var t = TOURS[s];
          return { texto: t.nombre + ' — desde ' + formatoDinero(t.precioLight), href: '#/tour/' + s };
        }).concat([{ texto: 'Ver todos los tours →', href: '#/tours' }])
      },
      {
        titulo: 'Eventos', items: [
          { texto: 'Bodas y pre-boda', href: '#/eventos/bodas' },
          { texto: 'Empresas y MICE', href: '#/eventos/empresas' },
          { texto: 'Cumpleaños', href: '#/eventos?tipo=cumpleanos' },
          { texto: 'Aniversarios', href: '#/eventos?tipo=aniversario' },
          { texto: 'Despedidas de soltero/a', href: '#/eventos?tipo=despedida' },
          { texto: 'Reuniones familiares', href: '#/eventos?tipo=reunion' }
        ]
      },
      { titulo: 'Nosotros', items: [{ texto: 'La tripulación y la flota', href: '#/nosotros' }, { texto: 'El arrecife que reconstruimos', href: '#/sostenibilidad' }] },
      { titulo: 'Guías', items: [{ texto: 'Guías de Punta Cana', href: '#/guias' }] },
      { titulo: 'Ayuda', items: [{ texto: 'Preguntas frecuentes', href: '#/faq' }, { texto: 'Contacto y WhatsApp', href: '#/contacto' }, { texto: 'Gestionar mi reserva', href: '#/mi-reserva' }] }
    ];
    cont.innerHTML = secciones.map(function (sec, i) {
      return '<div class="acordeon-item' + (i === 0 ? ' abierto' : '') + '">' +
        '<button type="button" class="acordeon-cab" data-acc-movil>' + sec.titulo + ' <span>' + (i === 0 ? '−' : '+') + '</span></button>' +
        '<div class="acordeon-cuerpo">' +
        sec.items.map(function (it) { return '<a href="' + it.href + '" data-cierra-movil>' + it.texto + '</a>'; }).join('') +
        '</div></div>';
    }).join('');

    $all('[data-acc-movil]', cont).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acordeon-item');
        var abierto = item.classList.toggle('abierto');
        btn.querySelector('span').textContent = abierto ? '−' : '+';
      });
    });
    $all('[data-cierra-movil]', cont).forEach(function (a) { a.addEventListener('click', cerrarMenuMovil); });
  }
  document.addEventListener('DOMContentLoaded', function () {
    var abrirBtn = $('#menu-movil .menu-movil-cta [data-cierra-movil]');
    if (abrirBtn) abrirBtn.addEventListener('click', cerrarMenuMovil);
  });

  // ============================================================
  // MODO NOTAS (toggle 📝) + toast + drawer
  // ============================================================
  function inicializarBadgeNotas() {
    var btn = $('#btn-notas');
    var drawer = $('#drawer-notas');
    var cerrar = $('#cerrar-drawer');
    btn.addEventListener('click', function () {
      var activo = document.body.classList.toggle('modo-notas');
      btn.classList.toggle('activo', activo);
      if (!activo) drawer.classList.remove('abierto');
    });
    cerrar.addEventListener('click', function () { drawer.classList.remove('abierto'); });

    document.addEventListener('click', function (e) {
      var pin = e.target.closest('.pin-nota');
      if (!pin) return;
      var clave = pin.getAttribute('data-nota-key');
      var nota = NOTAS[clave];
      if (!nota) return;
      $('#drawer-titulo').textContent = nota.titulo;
      $('#drawer-cuerpo').textContent = nota.texto;
      drawer.classList.add('abierto');
    });
  }

  var toastTimeout;
  function mostrarToast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('mostrar');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () { t.classList.remove('mostrar'); }, 3200);
  }
  window.mostrarToast = mostrarToast;

  function conNota(clave, html) {
    return '<div class="con-nota" data-nota-wrap>' + html +
      '<span class="pin-nota" data-nota-key="' + clave + '">i</span></div>';
  }
  window.conNota = conNota;

  // ============================================================
  // PÁGINA: HOME
  // ============================================================
  function renderHome() {
    app.innerHTML =
      seccionHero() +
      seccionStats() +
      seccionTours() +
      seccionWhyDirect() +
      seccionDiferenciadores() +
      seccionReviews() +
      seccionEventosBanda() +
      seccionGaleriaFaqCierre();
    inicializarHero();
    inicializarFaqHome();
  }

  function seccionHero() {
    var opciones = ORDEN_TOURS.map(function (s) { return '<option value="' + s + '">' + TOURS[s].nombre + '</option>'; }).join('');
    return '<section class="contenedor">' + conNota('home-hero',
      '<div class="hero">' +
      '<div>' +
      '<span class="etq">Punta Cana · Bávaro</span>' +
      '<h1>Los catamaranes originales de Punta Cana, en grupos pequeños</h1>' +
      '<p class="sub">Snorkel en un vivero de coral real, cocina flotante con menú a tu elección y barcos a media capacidad. Desde 2012.</p>' +
      '<div class="trust-row">' +
      '<span class="stars">★★★★★</span><span><strong>4.9</strong> · 1.782 reseñas</span>' +
      '<span class="chip">#1 en TripAdvisor · 7 años</span><span class="chip">Premios Viator 22-24</span>' +
      '</div>' +
      '<div class="buscador">' +
      '<div class="campo"><label>Tour</label><select id="hero-tour"><option value="">Todos los tours</option>' + opciones + '</select></div>' +
      '<div class="campo"><label>Fecha</label><input type="date" id="hero-fecha"></div>' +
      '<div class="campo"><label>Personas</label><select id="hero-personas"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></div>' +
      '<button type="button" class="btn btn-primario" id="btn-hero-buscar">Ver disponibilidad</button>' +
      '</div>' +
      '<p class="meta" style="margin-top:10px;">✓ Cancelación gratis hasta 7 días antes · ✓ Confirma con solo 25% de depósito</p>' +
      '</div>' +
      '<div class="img" style="min-height:340px;">Foto/video hero — catamarán navegando</div>' +
      '</div>') + '</section>';
  }

  function inicializarHero() {
    var btn = $('#btn-hero-buscar');
    if (!btn) return;
    btn.addEventListener('click', function () {
      estadoBusquedaHero.tourSlug = $('#hero-tour').value || null;
      estadoBusquedaHero.fecha = $('#hero-fecha').value || null;
      estadoBusquedaHero.personas = parseInt($('#hero-personas').value, 10) || 2;
      irA('#/tours');
    });
  }

  function seccionStats() {
    return '<section class="contenedor">' + conNota('home-stats',
      '<div class="tabla-stats">' +
      '<div><strong>91.607</strong>clientes felices</div>' +
      '<div><strong>4.454</strong>días navegados</div>' +
      '<div><strong>≤35%</strong>de la capacidad del barco</div>' +
      '<div><strong>0</strong>plástico a bordo</div>' +
      '<span class="meta">[TripAdvisor] [Viator] [WeddingWire] [LTG]</span>' +
      '</div>') + '</section>';
  }

  function tarjetaTourHome(slug) {
    var t = TOURS[slug];
    return '<a class="card clic" href="#/tour/' + slug + '">' +
      '<div class="img">Foto</div>' +
      '<div class="cuerpo">' +
      '<span class="chip">' + esc(t.audienciaChip) + '</span>' +
      '<strong>' + esc(t.nombre) + '</strong>' +
      '<span class="meta">★ ' + t.rating + ' (' + t.resenas.toLocaleString('en-US') + ') · ' + esc(t.duracionCorta) + (t.maxPax ? ' · máx. ' + t.maxPax : '') + '</span>' +
      '<span class="meta">✓ Cancelación gratis</span>' +
      '<div class="pie"><span class="precio">' + formatoDinero(t.precioLight) + ' <small>/pers · desde</small></span>' +
      '<span class="btn btn-secundario btn-sm">Ver tour</span></div>' +
      '</div></a>';
  }

  function seccionTours() {
    return '<section class="contenedor seccion">' + conNota('home-tours',
      '<span class="etq">Nuestros tours</span>' +
      '<h2 class="seccion-title">Elige tu día en el Caribe</h2>' +
      '<div class="grid-4" style="margin-top:16px;">' + ORDEN_TOURS.map(tarjetaTourHome).join('') + '</div>') +
      '</section>';
  }

  function seccionWhyDirect() {
    return '<section class="contenedor seccion">' + conNota('home-why-direct',
      '<span class="etq">Reserva directa</span>' +
      '<h2 class="seccion-title">¿Por qué reservar aquí y no en un portal?</h2>' +
      '<div class="grid-4" style="margin-top:16px;">' +
      '<div class="benef"><div class="ico-circ">25%</div><h4>Confirma con 25%</h4><p>Paga el depósito hoy y el resto en efectivo el día del tour.</p></div>' +
      '<div class="benef"><div class="ico-circ">-5%</div><h4>Descuento en cash</h4><p>5% extra si el saldo lo pagas en efectivo a bordo.</p></div>' +
      '<div class="benef"><div class="ico-circ">🍽</div><h4>Elige tu menú</h4><p>Langosta, Angus o vegetariano: solo reservando directo eliges plato por persona.</p></div>' +
      '<div class="benef"><div class="ico-circ">💬</div><h4>WhatsApp directo</h4><p>Hablas con el equipo del barco, no con un call center.</p></div>' +
      '</div>' +
      '<p class="meta" style="margin-top:14px;">+ Reembolso total por mal clima o cancelando con 7 días. Mismo precio que en los portales — pero con todo esto incluido. <a href="#/reserva-directa" style="font-weight:700; color:var(--acento);">Ver la comparación completa →</a></p>') +
      '</section>';
  }

  function seccionDiferenciadores() {
    return '<section class="contenedor seccion">' +
      '<div class="grid-2" style="align-items:center;">' +
      '<div class="img" style="min-height:260px;">Foto grande — bióloga marina / coral</div>' +
      '<div>' +
      '<span class="etq">La diferencia Hispaniola</span>' +
      '<h2 class="seccion-title">No es otro party boat</h2>' +
      '<div class="grid-2" style="margin-top:14px;">' +
      '<div class="benef"><h4>Coral vivo, no piscina de show</h4><p>Snorkel en uno de los 3 mayores proyectos de restauración de coral de RD, con bióloga marina a bordo.</p></div>' +
      '<div class="benef"><h4>Cocina flotante</h4><p>Comida preparada al momento en el barco — pescado del Caribe y Angus certificado.</p></div>' +
      '<div class="benef"><h4>Barcos a media capacidad</h4><p>Reservamos máximo el 35% del aforo permitido. Espacio, no multitud.</p></div>' +
      '<div class="benef"><h4>Eco / cero plástico</h4><p>Coco-loco en coco real. Nada de vasos desechables.</p></div>' +
      '</div></div></div></section>';
  }

  function seccionReviews() {
    return '<section class="contenedor seccion">' + conNota('home-reviews',
      '<span class="etq">Reseñas verificadas</span>' +
      '<h2 class="seccion-title">4.9 de 5 en 1.782 reseñas</h2>' +
      '<div class="grid-3" style="margin-top:16px;">' +
      '<div class="quote"><p>"El coral fue lo mejor del viaje — la bióloga nos explicó todo, y la comida a bordo, increíble."</p><span class="meta">★★★★★ · Jessica M. · Viator · jun 2026</span></div>' +
      '<div class="quote"><p>"Muy buen trato, grupo pequeño como prometían, no como otros catamaranes llenos de gente."</p><span class="meta">★★★★★ · Carlos R. · TripAdvisor · may 2026</span></div>' +
      '<div class="quote"><p>"Reservamos directo por WhatsApp y nos resolvieron todo en minutos. Repetiríamos sin dudar."</p><span class="meta">★★★★★ · Ana P. · Facebook · may 2026</span></div>' +
      '</div>' +
      '<p class="meta" style="margin-top:12px;">Ver más reseñas → <a href="https://www.tripadvisor.com" target="_blank" rel="noopener" style="color:var(--acento);">TripAdvisor</a> · <a href="https://www.facebook.com" target="_blank" rel="noopener" style="color:var(--acento);">Facebook</a></p>') +
      '</section>';
  }

  function seccionEventosBanda() {
    return '<section class="contenedor seccion">' +
      '<div class="banda-cta">' +
      '<div style="max-width:52ch;"><span class="etq">Eventos privados</span>' +
      '<h2 style="font-size:20px;">Bodas, cumpleaños y team-buildings a bordo</h2>' +
      '<p class="meta">Charter completo con comida, barra libre y coordinación. Hasta 120 personas.</p></div>' +
      '<a href="#/eventos" class="btn btn-secundario">Pedir cotización</a>' +
      '</div></section>';
  }

  function seccionGaleriaFaqCierre() {
    var faqsHome = [
      ['¿Qué pasa si llueve el día de mi tour?', 'Reembolso total o cambio de fecha, sin costo.'],
      ['¿Puedo pagar solo el depósito?', 'Sí, confirmas con el 25% y pagas el resto el día del tour.'],
      ['¿Incluye recogida en mi hotel?', 'Sí, en todos los tours (excepto charters con punto de encuentro propio).'],
      ['¿Los niños pueden ir en todos los tours?', 'En Snorkel Lovers sí; Semi-Privado Premium es solo para adultos.']
    ];
    return '<section class="contenedor seccion">' +
      '<div class="grid-2" style="align-items:start; gap:32px;">' +
      '<div>' +
      '<span class="etq">El día, en imágenes</span>' +
      '<div class="grid-2" style="margin-top:10px;">' +
      '<div class="img" style="height:100px;">Foto</div><div class="img" style="height:100px;">Foto</div>' +
      '<div class="img" style="height:100px;">Video ▶</div><div class="img" style="height:100px;">+ galería</div>' +
      '</div></div>' +
      '<div>' +
      '<span class="etq">Preguntas frecuentes</span>' +
      '<div id="faq-home">' + faqsHome.map(function (f, i) {
        return '<div class="acc' + (i === 0 ? ' abierto' : '') + '"><button type="button" class="acc-cab" data-acc-home>' + f[0] + '<span class="signo">' + (i === 0 ? '−' : '+') + '</span></button><div class="acc-cuerpo">' + f[1] + '</div></div>';
      }).join('') + '</div>' +
      '<p class="meta" style="margin-top:6px;"><a href="#/faq" style="color:var(--acento);">Ver todas las preguntas →</a></p>' +
      '</div></div>' +
      '<div class="banda-cta" style="margin-top:32px;">' +
      '<h2 style="font-size:20px;">Tu día en el Caribe empieza aquí</h2>' +
      '<a href="#/tours" class="btn btn-primario">Ver disponibilidad</a>' +
      '</div></section>';
  }

  function inicializarFaqHome() {
    $all('[data-acc-home]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc');
        var abierto = item.classList.toggle('abierto');
        btn.querySelector('.signo').textContent = abierto ? '−' : '+';
      });
    });
  }

  // ============================================================
  // PÁGINA: /tours — doble función (fix 1.3): sin fecha = listado,
  // con fecha = resultados de disponibilidad.
  // ============================================================
  function renderTours() {
    var hayFecha = !!estadoBusquedaHero.fecha;
    app.innerHTML =
      '<div class="contenedor seccion">' +
      barraBusquedaTours() +
      (hayFecha ? resultadosDisponibilidadHTML() : listadoToursHTML()) +
      '</div>';
    inicializarBarraBusquedaTours();
  }

  function barraBusquedaTours() {
    var opciones = ORDEN_TOURS.map(function (s) {
      var sel = estadoBusquedaHero.tourSlug === s ? ' selected' : '';
      return '<option value="' + s + '"' + sel + '>' + TOURS[s].nombre + '</option>';
    }).join('');
    var selTodos = !estadoBusquedaHero.tourSlug ? ' selected' : '';
    if (!estadoBusquedaHero.fecha) {
      return '<span class="etq">Tours</span><h1 style="font-size:26px; margin-bottom:16px;">Elige tu día en el Caribe</h1>' +
        '<div class="buscador" style="margin-bottom:32px;">' +
        '<div class="campo"><label>Tour</label><select id="tours-tour"><option value=""' + selTodos + '>Todos los tours</option>' + opciones + '</select></div>' +
        '<div class="campo"><label>Fecha</label><input type="date" id="tours-fecha" min="' + hoyISO() + '"></div>' +
        '<div class="campo"><label>Personas</label><select id="tours-personas">' +
        [1, 2, 3, 4, 5, 6].map(function (n) { return '<option' + (n === estadoBusquedaHero.personas ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '</select></div>' +
        '<button type="button" class="btn btn-primario" id="btn-tours-buscar">Ver disponibilidad</button>' +
        '</div>';
    }
    return '<div class="banda-cta" style="margin-bottom:28px;">' +
      '<div><span class="etq" style="margin-bottom:2px;">Tu búsqueda</span>' +
      '<strong style="font-size:15px;">' + formatoFechaCorta(estadoBusquedaHero.fecha) + ' · ' + estadoBusquedaHero.personas + ' persona' + (estadoBusquedaHero.personas > 1 ? 's' : '') +
      ' · ' + (estadoBusquedaHero.tourSlug ? TOURS[estadoBusquedaHero.tourSlug].nombre : 'Todos los tours') + '</strong></div>' +
      '<button type="button" class="btn btn-secundario btn-sm" id="btn-editar-busqueda">Editar búsqueda</button>' +
      '</div>';
  }

  function inicializarBarraBusquedaTours() {
    var btnBuscar = $('#btn-tours-buscar');
    if (btnBuscar) {
      btnBuscar.addEventListener('click', function () {
        estadoBusquedaHero.tourSlug = $('#tours-tour').value || null;
        estadoBusquedaHero.fecha = $('#tours-fecha').value || null;
        estadoBusquedaHero.personas = parseInt($('#tours-personas').value, 10) || 2;
        if (!estadoBusquedaHero.fecha) { mostrarToast('Elige una fecha para ver horarios disponibles'); return; }
        renderTours();
      });
    }
    var btnEditar = $('#btn-editar-busqueda');
    if (btnEditar) {
      btnEditar.addEventListener('click', function () {
        estadoBusquedaHero.fecha = null;
        renderTours();
      });
    }
  }

  function listadoToursHTML() {
    var lista = estadoBusquedaHero.tourSlug ? [estadoBusquedaHero.tourSlug] : ORDEN_TOURS;
    return '<div class="grid-4">' + lista.map(function (slug) {
      var t = TOURS[slug];
      return '<a class="card clic" href="#/tour/' + slug + '">' +
        '<div class="img">Foto</div>' +
        '<div class="cuerpo">' +
        '<span class="chip">' + esc(t.audienciaChip) + '</span>' +
        '<strong>' + esc(t.nombre) + '</strong>' +
        '<span class="meta">★ ' + t.rating + ' (' + t.resenas.toLocaleString('en-US') + ') · ' + esc(t.duracionCorta) + (t.maxPax ? ' · máx. ' + t.maxPax : '') + '</span>' +
        '<span class="chip acento">Elige fecha para ver horarios</span>' +
        '<div class="pie"><span class="precio">' + formatoDinero(t.precioLight) + ' <small>/pers · desde</small></span>' +
        '<span class="btn btn-secundario btn-sm">Ver tour</span></div>' +
        '</div></a>';
    }).join('') + '</div>';
  }

  function resultadosDisponibilidadHTML() {
    var lista = estadoBusquedaHero.tourSlug ? [estadoBusquedaHero.tourSlug] : ORDEN_TOURS;
    return conNota('tours-doble-funcion', '<div class="grid-2">' + lista.map(function (slug) {
      var t = TOURS[slug];
      var cuerpoDisp, cta;
      if (slug === 'isla-saona') {
        cuerpoDisp = '<span class="meta" style="color:var(--tinta-2);">Sin cupo el ' + formatoFechaCorta(estadoBusquedaHero.fecha) + '</span>';
        cta = '<button type="button" class="btn btn-secundario btn-sm" data-ir="#/tour/isla-saona">Ver próximas fechas →</button>';
      } else if (t.booking === 'cotizacion') {
        cuerpoDisp = '<span class="meta">Disponible — horario a coordinar</span>';
        cta = '<button type="button" class="btn btn-secundario btn-sm" data-ir="#/eventos?tipo=charter">Cotizar →</button>';
      } else {
        var chipsHorario = t.horarios.map(function (h) {
          if (h.quedan !== null && h.quedan <= 5) return '<span class="chip">últimas ' + h.quedan + ' plazas ' + h.hora + '</span>';
          return '<span class="chip ok">' + h.hora + '</span>';
        }).join(' ');
        cuerpoDisp = '<span class="meta">Horarios libres: ' + chipsHorario + '</span>';
        cta = '<button type="button" class="btn btn-secundario btn-sm" data-ir="#/tour/' + slug + '">Ver horarios →</button>';
      }
      return '<div class="card card-horizontal">' +
        '<div class="img">Foto</div>' +
        '<div class="cuerpo">' +
        '<strong>' + esc(t.nombre) + '</strong>' +
        '<span class="meta">★ ' + t.rating + ' · ' + esc(t.audiencia) + '</span>' +
        cuerpoDisp +
        '<div class="pie">' + (t.precioLight ? '<span class="precio">' + formatoDinero(t.precioLight) + '<small>/pers</small></span>' : '<span></span>') + cta + '</div>' +
        '</div></div>';
    }).join('') + '</div>');
  }

  // ============================================================
  // Registro de rutas
  // ============================================================
  ruta('/', renderHome);
  ruta('/tours', renderTours);

  // Delegación global: cualquier elemento con data-ir="#/ruta" navega al hacer click.
  // Patrón reutilizado en booking, ficha, eventos, etc. (evita listeners repetidos por render).
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-ir]');
    if (el) irA(el.getAttribute('data-ir'));
  });

  window.addEventListener('hashchange', enrutar);
  window.addEventListener('DOMContentLoaded', function () {
    poblarMegamenus();
    inicializarHeaderInteracciones();
    inicializarBadgeNotas();
    enrutar();
  });
})();
