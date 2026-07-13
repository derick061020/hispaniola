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
    document.body.classList.remove('tiene-barra-movil');
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
  // PÁGINA: Ficha de tour (plantilla data-driven para los 4 tours)
  // ============================================================
  var fichaDiaSel = null; // fecha ISO elegida en el widget de la ficha (estado local, no global)

  function renderFicha(params) {
    var t = TOURS[params.slug];
    if (!t) { render404(); return; }
    fichaDiaSel = null;
    app.innerHTML =
      '<div class="contenedor" style="padding-top:20px;">' +
      '<p class="migaja"><a href="#/">Inicio</a> / <a href="#/tours">Tours</a> / ' + esc(t.nombre) + '</p>' +
      '<h1 style="font-size:26px; margin-bottom:10px;">' + esc(t.tituloLargo) + '</h1>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:18px;">' +
      '<span class="stars">★★★★★</span><span style="font-size:14px;"><strong>' + t.rating + '</strong> · ' + t.resenas.toLocaleString('en-US') + ' reseñas</span>' +
      (t.booking !== 'consulta' ? '<span class="chip ok">✓ Cancelación gratis</span>' : '') +
      '<span class="chip">' + esc(t.audienciaChip) + '</span><span class="chip">' + esc(t.duracion) + '</span>' +
      (t.booking === 'completo' ? '<span class="chip">Recogida en hotel</span>' : '') +
      '</div>' +
      '<div class="mosaico">' +
      '<div class="img" style="position:relative;">Foto principal<div class="quote-flot">"' + primeraResenaTour(t) + '"</div></div>' +
      '<div class="img">Foto</div><div class="img">Foto</div><div class="img">Video ▶</div>' +
      '<div class="img">Ver 33 fotos →</div>' +
      '</div>' +
      '<div class="ficha-anclas">' +
      '<a href="#ancla-itinerario">Itinerario</a><a href="#ancla-incluye">Incluye</a>' +
      (t.booking === 'completo' ? '<a href="#ancla-menu">Menú</a>' : '') +
      '<a href="#ancla-opiniones">Opiniones</a><a href="#ancla-faq">FAQ</a>' +
      '</div>' +
      '<div class="ficha-grid">' +
      '<div>' +
      '<h2 style="font-size:17px; margin-bottom:8px;">Un día de mar' + (t.booking === 'cotizacion' ? ' a tu medida' : (t.audiencia === 'Solo adultos' ? ' en grupo pequeño' : '')) + '</h2>' +
      '<p class="meta" style="font-size:14px; color:var(--tinta-2);">' + esc(t.descripcionCorta) + '</p>' +
      '</div>' +
      widgetLateralFicha(t) +
      '</div>' +
      (t.booking === 'completo' ? comparadorStripHTML() : '') +
      seccionItinerario(t) +
      seccionIncluye(t) +
      (t.booking === 'completo' ? seccionMenu(t) : '') +
      seccionOpinionesFaq(t) +
      '<div class="barra-movil-fija" id="barra-movil-ficha">' +
      '<div><span class="precio">' + (t.precioLight ? formatoDinero(t.precioLight) : 'Consultar') + '</span> ' + (t.precioLight ? '<span class="meta">/pers</span>' : '') + '<br><span class="meta">★ ' + t.rating + (t.booking !== 'consulta' ? ' · Cancela gratis' : '') + '</span></div>' +
      ctaBarraMovil(t) +
      '</div>' +
      '</div>';
    document.body.classList.add('tiene-barra-movil');
    inicializarFicha(t);
  }

  function primeraResenaTour(t) {
    if (t.slug === 'semi-privado') return 'El coral fue lo mejor del viaje — la bióloga nos explicó todo.';
    if (t.slug === 'snorkel-lovers') return 'Perfecto para ir con los niños, todos se sintieron seguros.';
    if (t.slug === 'charter-privado') return 'Coordinaron todo a nuestra medida, el barco entero para la familia.';
    return 'Playas increíbles, la comida en la isla estuvo deliciosa.';
  }

  function widgetLateralFicha(t) {
    if (t.booking === 'cotizacion') {
      return '<div class="widget-lateral" id="ficha-widget">' +
        '<div><span class="precio-grande">' + formatoDinero(t.precioLight) + '</span><span class="meta"> /persona · desde</span></div>' +
        '<p class="meta">Este tour se cotiza a tu medida según nº de personas y menú — hasta ' + t.maxPax + ' personas.</p>' +
        '<a href="#/eventos?tipo=charter" class="btn btn-primario btn-bloque">Pedir cotización</a>' +
        '<a href="https://wa.me/18293052804" target="_blank" rel="noopener" class="btn btn-secundario btn-bloque">💬 WhatsApp directo</a>' +
        '</div>';
    }
    if (t.booking === 'consulta') {
      return '<div class="widget-lateral" id="ficha-widget">' +
        '<div><span class="precio-grande">US$ —</span></div>' +
        '<p class="meta"><strong>Precio pendiente de confirmar con el cliente.</strong> Duración y capacidad también están por definir.</p>' +
        '<a href="https://wa.me/18293052804" target="_blank" rel="noopener" class="btn btn-primario btn-bloque">💬 Consultar por WhatsApp</a>' +
        '</div>';
    }
    var opcionesHorario = t.horarios.map(function (h, i) { return '<option value="' + i + '">' + h.hora + (h.regreso ? ' — regreso ' + h.regreso : '') + '</option>'; }).join('');
    var maxSel = Math.min(t.maxPax || 6, 6);
    var opcionesPax = '';
    for (var n = 1; n <= maxSel; n++) opcionesPax += '<option' + (n === 2 ? ' selected' : '') + '>' + n + '</option>';
    return '<div class="widget-lateral" id="ficha-widget">' +
      '<div><span class="precio-grande">' + formatoDinero(t.precioLight) + '</span><span class="meta"> /persona · desde</span></div>' +
      '<div class="etq" style="margin-bottom:4px;">Elige una fecha</div>' +
      '<div id="ficha-dias" style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px;"></div>' +
      '<div class="campo"><label>Horario</label><select id="ficha-horario">' + opcionesHorario + '</select></div>' +
      '<div class="campo"><label>Personas</label><select id="ficha-personas">' + opcionesPax + '</select></div>' +
      '<button type="button" class="btn btn-primario btn-bloque" id="btn-ficha-continuar" disabled>Elige una fecha</button>' +
      '<p class="meta" style="margin:0;">✓ Confirma con 25% de depósito<br>✓ Cancela gratis hasta 7 días antes<br>✓ Reembolso total por mal clima</p>' +
      '</div>';
  }

  function comparadorStripHTML() {
    return conNota('ficha-comparador', '<div class="comparador-strip">' +
      '<p style="margin:0; font-size:13.5px;">Mismo precio que en Viator o Civitatis — aquí con <strong>depósito del 25%</strong>, menú a elección y WhatsApp directo.</p>' +
      '<a href="#/reserva-directa" class="btn btn-secundario btn-sm" style="white-space:nowrap; background:var(--papel);">Ver comparación →</a>' +
      '</div>');
  }

  function seccionItinerario(t) {
    return '<div id="ancla-itinerario" class="seccion" style="scroll-margin-top:110px;"><div class="grid-2" style="align-items:start;">' +
      '<div><span class="etq">Itinerario — ' + esc(t.duracion) + '</span><ul class="timeline">' +
      t.itinerario.map(function (it) {
        return '<li><span class="hora">' + esc(it.hora) + '</span><span class="punto"></span><div><h4>' + esc(it.titulo) + '</h4><p>' + esc(it.texto) + '</p></div></li>';
      }).join('') + '</ul></div>' +
      '<div class="img" style="min-height:280px;">Mapa de la ruta<br>(costa Bávaro → Cabo Engaño,<br>3 paradas marcadas)</div>' +
      '</div></div>';
  }

  function seccionIncluye(t) {
    return '<div id="ancla-incluye" class="seccion" style="scroll-margin-top:110px;">' +
      '<span class="etq">Qué incluye</span>' +
      '<div class="grid-4">' + t.incluye.map(function (i) {
        return '<div class="benef"><h4>' + esc(i.titulo) + '</h4><p>' + esc(i.texto) + '</p></div>';
      }).join('') + '</div>' +
      '<p class="meta" style="margin-top:12px;">' + esc(t.noIncluido) + '</p>' +
      '</div>';
  }

  function seccionMenu(t) {
    return conNota('ficha-menu', '<div id="ancla-menu" class="seccion" style="scroll-margin-top:110px;">' +
      '<span class="etq">Tu menú, a tu elección</span>' +
      '<p class="meta" style="margin-bottom:12px;">Cada persona elige su plato al reservar. Recién hecho a bordo, no buffet recalentado.</p>' +
      '<div class="grid-4">' + PLATOS.map(function (p) {
        return '<div class="plato"><div class="img">Foto plato</div><div class="cuerpo"><strong>' + esc(p.nombre) + '</strong><span>' + esc(p.desc) + '</span></div></div>';
      }).join('') + '</div>' +
      '<table class="tabla-comp">' +
      '<tr><th></th><th>Light — ' + formatoDinero(t.precioLight) + '</th><th>Premium — +' + formatoDinero(t.upgradePremium) + '</th></tr>' +
      '<tr><td>Menú</td><td>Pollo o pescado a la parrilla</td><td class="si">4 platos: mariscos, carne, surf&turf, vegetariano</td></tr>' +
      '<tr><td>Todo lo demás</td><td class="si">✓ idéntico</td><td class="si">✓ idéntico</td></tr>' +
      '</table>' +
      '<p class="meta" style="margin-top:8px;">* Langosta se sustituye por langostino salvaje de marzo a junio (veda).</p>' +
      '</div>');
  }

  function seccionOpinionesFaq(t) {
    var relacionados = (t.tambienTeGusta || []).map(function (s) {
      var r = TOURS[s];
      return '<a class="benef" style="display:block;" href="#/tour/' + s + '"><h4>' + esc(r.nombre) + '</h4><p>' + esc(r.audiencia) + ' · ' + (r.precioLight ? formatoDinero(r.precioLight) + '/pers' : 'Consultar') + '</p></a>';
    }).join('');
    return '<div id="ancla-opiniones" class="seccion" style="scroll-margin-top:110px;">' +
      '<div class="grid-3">' +
      '<div><span class="etq">Opiniones</span><p style="font-size:30px; font-weight:800;">' + t.rating + '<span class="meta" style="font-size:13px; font-weight:400;"> / 5</span></p>' +
      '<p class="meta">' + t.resenas.toLocaleString('en-US') + ' reseñas verificadas<br>Ver en <a href="https://www.tripadvisor.com" target="_blank" rel="noopener" style="color:var(--acento);">TripAdvisor</a> →</p></div>' +
      '<div class="benef" style="grid-column:span 2;"><p style="font-size:14px; margin-bottom:6px;">"' + primeraResenaTour(t) + ' Volveríamos sin dudarlo."</p><span class="meta">★★★★★ · Cliente verificado · jun 2026</span></div>' +
      '</div>' +
      '<div id="ancla-faq" class="grid-2" style="margin-top:24px; scroll-margin-top:110px;">' +
      '<div><span class="etq">FAQ de este tour</span>' +
      t.faqTour.map(function (f, i) {
        return '<div class="acc' + (i === 0 ? ' abierto' : '') + '"><button type="button" class="acc-cab" data-acc-ficha>' + esc(f.p) + '<span class="signo">' + (i === 0 ? '−' : '+') + '</span></button><div class="acc-cuerpo">' + esc(f.r) + '</div></div>';
      }).join('') + '</div>' +
      '<div><span class="etq">También te puede gustar</span>' + relacionados + '</div>' +
      '</div></div>';
  }

  function ctaBarraMovil(t) {
    if (t.booking === 'cotizacion') return '<a href="#/eventos?tipo=charter" class="btn btn-primario">Cotizar</a>';
    if (t.booking === 'consulta') return '<a href="https://wa.me/18293052804" target="_blank" rel="noopener" class="btn btn-primario">Consultar</a>';
    return '<a href="#ficha-widget" class="btn btn-primario">Elegir fecha</a>';
  }

  function inicializarFicha(t) {
    $all('[data-acc-ficha]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc');
        var abierto = item.classList.toggle('abierto');
        btn.querySelector('.signo').textContent = abierto ? '−' : '+';
      });
    });
    if (t.booking !== 'completo') return;

    var contDias = $('#ficha-dias');
    var hoy = hoyISO();
    var diasAgotados = [sumarDias(hoy, 3), sumarDias(hoy, 10)];
    var html = '';
    for (var i = 0; i < 14; i++) {
      var iso = sumarDias(hoy, i);
      var d = parseFechaISO(iso);
      var off = diasAgotados.indexOf(iso) >= 0;
      html += '<button type="button" class="btn btn-secundario btn-sm" style="flex-direction:column; height:auto; padding:8px 10px; min-width:52px;" ' +
        'data-dia="' + iso + '"' + (off ? ' disabled' : '') + '>' +
        '<span style="font-size:10px; text-transform:uppercase;">' + DIAS_CORTOS[d.getDay()] + '</span>' +
        '<span style="font-weight:700;">' + d.getDate() + '</span>' +
        '</button>';
    }
    contDias.innerHTML = html;

    $all('[data-dia]', contDias).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $all('[data-dia]', contDias).forEach(function (b) { b.classList.remove('btn-primario'); b.classList.add('btn-secundario'); });
        btn.classList.remove('btn-secundario'); btn.classList.add('btn-primario');
        fichaDiaSel = btn.getAttribute('data-dia');
        actualizarBotonContinuarFicha(t);
      });
    });

    $('#ficha-horario').addEventListener('change', function () { actualizarBotonContinuarFicha(t); });
    $('#ficha-personas').addEventListener('change', function () { actualizarBotonContinuarFicha(t); });

    $('#btn-ficha-continuar').addEventListener('click', function () {
      if (!fichaDiaSel) return;
      estadoReserva.tour = t.slug;
      estadoReserva.fecha = fichaDiaSel;
      estadoReserva.horarioIdx = parseInt($('#ficha-horario').value, 10);
      estadoReserva.personas = parseInt($('#ficha-personas').value, 10);
      estadoReserva.paquete = 'light';
      estadoReserva.platos = [];
      estadoReserva.hotel = null;
      estadoReserva.horaRecogida = null;
      estadoReserva.pago = 'deposito';
      estadoReserva.codigo = null;
      estadoReserva.mesCalendarioOffset = 0;
      irA('#/reservar/' + t.slug + '/1');
    });
  }

  function actualizarBotonContinuarFicha(t) {
    var btn = $('#btn-ficha-continuar');
    if (!fichaDiaSel) { btn.disabled = true; btn.textContent = 'Elige una fecha'; return; }
    var personas = parseInt($('#ficha-personas').value, 10) || 2;
    btn.disabled = false;
    btn.textContent = 'Continuar — ' + formatoDinero(t.precioLight * personas);
  }

  // ============================================================
  // BOOKING — utilidades compartidas (cálculo de totales, calendario, resumen)
  // ============================================================
  function calcularTotales() {
    var t = TOURS[estadoReserva.tour];
    var personas = estadoReserva.personas;
    var subtotal = t.precioLight * personas;
    var upgrade = estadoReserva.paquete === 'premium' ? t.upgradePremium * personas : 0;
    var total = subtotal + upgrade;
    var deposito = Math.round(total * 0.25);
    var saldo = total - deposito;
    var saldoCash = Math.round(saldo * 0.95);
    return { subtotal: subtotal, upgrade: upgrade, total: total, deposito: deposito, saldo: saldo, saldoCash: saldoCash, personas: personas };
  }

  function nombrePlato(id) {
    var p = PLATOS.filter(function (p) { return p.id === id; })[0];
    return p ? p.nombre : '';
  }

  function pasosIndicadorHTML(slug, activo) {
    var pasos = [
      { n: 1, label: 'Fecha y personas', ruta: '#/reservar/' + slug + '/1' },
      { n: 2, label: 'Personaliza', ruta: '#/reservar/' + slug + '/2' },
      { n: 3, label: 'Pago', ruta: '#/reservar/' + slug + '/3' },
      { n: 4, label: '¡Listo!', ruta: '#/reservar/' + slug + '/gracias' }
    ];
    var items = pasos.map(function (p, i) {
      var estado = p.n === activo ? ' activo' : (p.n < activo ? ' hecho' : '');
      var puedeIr = p.n < activo;
      var contenido = '<span class="n">' + (p.n < activo ? '✓' : p.n) + '</span>' + p.label;
      var el = puedeIr
        ? '<button type="button" class="paso' + estado + '" data-ir="' + p.ruta + '">' + contenido + '</button>'
        : '<span class="paso' + estado + '">' + contenido + '</span>';
      return el + (i < pasos.length - 1 ? '<span class="sep"></span>' : '');
    }).join('');
    return '<div class="booking-cab"><div class="pasos-indicador">' + items + '</div><span class="candado">🔒 Pago seguro · Stripe</span></div>';
  }

  function generarCalendarioMes(offsetMeses) {
    var hoy = new Date();
    var mesBase = new Date(hoy.getFullYear(), hoy.getMonth() + offsetMeses, 1);
    var primerDiaSemana = mesBase.getDay();
    var offsetLunes = (primerDiaSemana + 6) % 7;
    var diasEnMes = new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 0).getDate();
    var celdas = [];
    for (var i = 0; i < offsetLunes; i++) celdas.push(null);
    for (var d = 1; d <= diasEnMes; d++) celdas.push(new Date(mesBase.getFullYear(), mesBase.getMonth(), d));
    while (celdas.length % 7 !== 0) celdas.push(null);
    var semanas = [];
    for (var s = 0; s < celdas.length; s += 7) semanas.push(celdas.slice(s, s + 7));
    return { mesBase: mesBase, semanas: semanas };
  }

  function calendarioGrandeHTML(t, offset) {
    var cal = generarCalendarioMes(offset);
    var hoy = hoyISO();
    var agotados = [sumarDias(hoy, 3), sumarDias(hoy, 10)];
    var sinDisponibilidad = offset >= 1;
    var filasHTML = cal.semanas.map(function (semana) {
      return '<tr>' + semana.map(function (d) {
        if (!d) return '<td class="vacio"></td>';
        var iso = fechaAISO(d);
        var esPasado = iso < hoy;
        var off = sinDisponibilidad || esPasado || agotados.indexOf(iso) >= 0;
        var sel = estadoReserva.fecha === iso;
        if (off) return '<td class="off"><button type="button" disabled>' + d.getDate() + '</button></td>';
        return '<td class="' + (sel ? 'sel' : '') + '"><button type="button" data-dia-booking="' + iso + '">' + d.getDate() + '<small>$' + t.precioLight + '</small></button></td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="cal-grande">' +
      '<div class="cal-grande-cab">' +
      '<button type="button" id="btn-mes-prev"' + (offset <= 0 ? ' disabled' : '') + '>‹</button>' +
      '<span>' + MESES_LARGOS[cal.mesBase.getMonth()].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + cal.mesBase.getFullYear() + '</span>' +
      '<button type="button" id="btn-mes-next">›</button>' +
      '</div>' +
      '<table><tr><th>L</th><th>M</th><th>X</th><th>J</th><th>V</th><th>S</th><th>D</th></tr>' + filasHTML + '</table>' +
      '</div>' +
      (sinDisponibilidad ? estadoSinDisponibilidadHTML(cal.mesBase) : '');
  }

  function estadoSinDisponibilidadHTML(mesBase) {
    return conNota('booking-sin-disponibilidad',
      '<div style="margin-top:16px;">' +
      '<p class="meta" style="margin-bottom:10px;">' + MESES_LARGOS[mesBase.getMonth()].replace(/^./, function (c) { return c.toUpperCase(); }) + ' está completo — es temporada alta.</p>' +
      '<div class="grid-2">' +
      '<div class="estado-vacio">' +
      '<h4 style="margin-bottom:6px;">Avísame cuando se libere</h4>' +
      '<p class="meta" style="margin-bottom:10px;">Deja tu email y te escribimos si se abre un cupo o un segundo barco.</p>' +
      '<div class="campo"><input type="email" id="input-email-espera" placeholder="tu@email.com"></div>' +
      '<button type="button" class="btn btn-secundario btn-bloque" id="btn-avisarme" style="margin-top:8px;">Avisarme</button>' +
      '</div>' +
      '<div class="estado-vacio">' +
      '<h4 style="margin-bottom:6px;">💬 Escríbenos por WhatsApp</h4>' +
      '<p class="meta" style="margin-bottom:10px;">A veces abrimos un segundo barco para fechas específicas — pregunta directo, a veces se resuelve en minutos.</p>' +
      '<a href="https://wa.me/18293052804" target="_blank" rel="noopener" class="btn btn-primario btn-bloque">Abrir WhatsApp</a>' +
      '</div></div></div>');
  }

  function renderResumenReserva(pasoActual) {
    var t = TOURS[estadoReserva.tour];
    var hayFechaHora = estadoReserva.fecha && estadoReserva.horarioIdx !== null && estadoReserva.horarioIdx !== undefined;
    var filas = '<div class="fila-r"><span>★ ' + t.rating + ' (' + t.resenas.toLocaleString('en-US') + ')</span></div>';
    filas += filaClicable('Fecha', estadoReserva.fecha ? formatoFechaCorta(estadoReserva.fecha) : '—', slugActual() + '/1', pasoActual);
    if (hayFechaHora) filas += filaClicable('Horario', t.horarios[estadoReserva.horarioIdx].hora, slugActual() + '/1', pasoActual);
    filas += filaClicable('Personas', estadoReserva.personas + ' ' + (estadoReserva.personas > 1 ? 'personas' : 'persona'), slugActual() + '/1', pasoActual);
    if (pasoActual >= 2 && estadoReserva.platos.length && estadoReserva.platos.indexOf(null) < 0) {
      filas += filaClicable('Menú', estadoReserva.platos.map(nombrePlato).join(' + '), slugActual() + '/2', pasoActual);
    }
    if (pasoActual >= 2 && estadoReserva.hotel) {
      filas += filaClicable('Recogida', estadoReserva.hotel.split(' — ')[0] + (estadoReserva.horaRecogida ? ' ' + estadoReserva.horaRecogida : ''), slugActual() + '/2', pasoActual);
    }
    var totalHTML = '';
    if (hayFechaHora) {
      var tot = calcularTotales();
      if (pasoActual === 1) {
        totalHTML += '<div class="fila-r"><span>' + tot.personas + ' pers × ' + formatoDinero(t.precioLight) + '</span><span>' + formatoDinero(tot.subtotal) + '</span></div>';
        if (tot.upgrade > 0) totalHTML += '<div class="fila-r"><span>Upgrade Premium (+' + t.upgradePremium + '×' + tot.personas + ')</span><span>' + formatoDinero(tot.upgrade) + '</span></div>';
      }
      totalHTML += '<div class="linea-total"><span>' + (pasoActual >= 3 ? 'Pagas hoy' : 'Total') + '</span><span>' + formatoDinero(pasoActual >= 3 && estadoReserva.pago === 'deposito' ? tot.deposito : tot.total) + '</span></div>';
      if (pasoActual === 1) totalHTML += '<p class="meta">o confirma hoy con ' + formatoDinero(tot.deposito) + ' (25%)</p>';
      if (pasoActual >= 3 && estadoReserva.pago === 'deposito') totalHTML += '<div class="fila-r"><span>A bordo (cash −5%)</span><span>' + formatoDinero(tot.saldoCash) + '</span></div>';
      var fechaLimite = estadoReserva.fecha ? formatoFechaCorta(sumarDias(estadoReserva.fecha, -7)) : '';
      if (fechaLimite) totalHTML += '<span class="chip ok" style="align-self:start; margin-top:6px;">✓ Cancela gratis hasta el ' + fechaLimite + '</span>';
    }
    return '<div class="resumen-reserva"><div class="img">Foto del tour</div><div class="cuerpo">' +
      '<strong style="font-size:14px;">' + esc(t.nombre) + '</strong>' + filas + totalHTML + '</div></div>';
  }

  function filaClicable(label, valor, rutaSufijo, pasoActual) {
    var pasoDeLaFila = parseInt(rutaSufijo.split('/').pop(), 10);
    var clicable = pasoActual > pasoDeLaFila;
    return '<div class="fila-r' + (clicable ? ' clic' : '') + '"' + (clicable ? ' data-ir="#/reservar/' + rutaSufijo + '"' : '') + '><span>' + label + '</span><span>' + esc(valor) + '</span></div>';
  }

  function slugActual() { return estadoReserva.tour; }

  function asegurarEstadoReserva(slug) {
    if (estadoReserva.tour !== slug) {
      estadoReserva.tour = slug;
      estadoReserva.fecha = null;
      estadoReserva.horarioIdx = null;
      estadoReserva.personas = 2;
      estadoReserva.paquete = 'light';
      estadoReserva.platos = [];
      estadoReserva.hotel = null;
      estadoReserva.horaRecogida = null;
      estadoReserva.pago = 'deposito';
      estadoReserva.codigo = null;
      estadoReserva.mesCalendarioOffset = 0;
    }
  }

  // ============================================================
  // PÁGINA: Booking paso 1 — fecha, horario, personas, paquete
  // ============================================================
  function renderBookingPaso1(params) {
    var t = TOURS[params.slug];
    if (!t || t.booking !== 'completo') { render404(); return; }
    asegurarEstadoReserva(params.slug);

    var offset = estadoReserva.mesCalendarioOffset || 0;
    var sinDisponibilidad = offset >= 1;

    var horarioSeccion = '';
    if (!sinDisponibilidad) {
      if (estadoReserva.fecha) {
        horarioSeccion = '<span class="etq" style="margin-top:18px; display:block;">Horario — ' + formatoFechaLarga(estadoReserva.fecha) + '</span>' +
          '<div class="grid-2">' + t.horarios.map(function (h, i) {
            var sel = estadoReserva.horarioIdx === i;
            return '<button type="button" class="slot' + (sel ? ' sel' : '') + '" data-horario="' + i + '">' +
              '<div style="display:flex; gap:10px; align-items:center;"><span class="slot-radio"></span><div class="slot-info"><strong>' + h.hora + '</strong><span>Regreso ' + h.regreso + '</span></div></div>' +
              '<span class="chip' + (h.quedan <= 5 ? '' : ' ok') + '">quedan ' + h.quedan + '</span></button>';
          }).join('') + '</div>';
      } else {
        horarioSeccion = '<p class="meta" style="margin-top:16px;">Elige un día en el calendario para ver los horarios.</p>';
      }
    }

    var personasPaqueteSeccion = '';
    if (!sinDisponibilidad) {
      var maxSel = Math.min(t.maxPax || 10, 10);
      personasPaqueteSeccion =
        '<span class="etq" style="margin-top:18px; display:block;">Personas</span>' +
        '<div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">' +
        '<div class="stepper-pax"><button type="button" id="btn-pax-menos"' + (estadoReserva.personas <= 1 ? ' disabled' : '') + '>−</button>' +
        '<span id="pax-num">' + estadoReserva.personas + '</span>' +
        '<button type="button" id="btn-pax-mas"' + (estadoReserva.personas >= maxSel ? ' disabled' : '') + '>+</button></div>' +
        (t.audiencia === 'Solo adultos' ? '<span class="meta">Tour solo adultos (18+). ¿Van con niños? → <a href="#/tour/snorkel-lovers" style="color:var(--acento);">Snorkel Lovers</a></span>' : '') +
        '</div>' +
        '<span class="etq" style="margin-top:18px; display:block;">Paquete <span style="text-transform:none; letter-spacing:0; color:var(--tinta-2);">— Light es el default</span></span>' +
        '<div class="grid-2">' +
        '<button type="button" class="slot' + (estadoReserva.paquete === 'light' ? ' sel' : '') + '" data-paquete="light">' +
        '<div style="display:flex; gap:10px; align-items:center;"><span class="slot-radio"></span><div class="slot-info"><strong>Light — ' + formatoDinero(t.precioLight) + '/pers</strong><span>Pollo o pescado a la parrilla</span></div></div>' +
        '<span class="chip ok">base</span></button>' +
        '<button type="button" class="slot' + (estadoReserva.paquete === 'premium' ? ' sel' : '') + '" data-paquete="premium">' +
        '<div style="display:flex; gap:10px; align-items:center;"><span class="slot-radio"></span><div class="slot-info"><strong>Premium <span style="color:var(--acento);">+' + formatoDinero(t.upgradePremium) + '/pers</span></strong><span>Mariscos, carne, surf & turf, vegetariano</span></div></div>' +
        (estadoReserva.paquete === 'premium' ? '<span class="chip">upgrade elegido</span>' : '') + '</button>' +
        '</div>' +
        (estadoReserva.paquete === 'premium' ? '<p class="meta" style="margin-top:6px;">Tocaste el upgrade a Premium — el resumen de la derecha desglosa esa diferencia.</p>' : '');
    }

    var puedeContinuar = !sinDisponibilidad && estadoReserva.fecha && estadoReserva.horarioIdx !== null && estadoReserva.horarioIdx !== undefined;

    app.innerHTML = '<div class="contenedor" style="padding-top:16px;">' +
      pasosIndicadorHTML(t.slug, 1) +
      '<div class="book-grid">' +
      '<div>' +
      '<h3 style="font-size:17px; margin-bottom:10px;">¿Qué día navegamos?</h3>' +
      calendarioGrandeHTML(t, offset) +
      horarioSeccion +
      personasPaqueteSeccion +
      (sinDisponibilidad ? '' : '<button type="button" class="btn btn-primario btn-bloque" id="btn-paso1-continuar" style="margin-top:20px;"' + (puedeContinuar ? '' : ' disabled') + '>Continuar</button>') +
      '</div>' +
      renderResumenReserva(1) +
      '</div></div>';

    inicializarBookingPaso1(t);
  }

  function inicializarBookingPaso1(t) {
    var btnPrev = $('#btn-mes-prev'), btnNext = $('#btn-mes-next');
    if (btnPrev) btnPrev.addEventListener('click', function () { estadoReserva.mesCalendarioOffset--; renderBookingPaso1({ slug: t.slug }); });
    if (btnNext) btnNext.addEventListener('click', function () { estadoReserva.mesCalendarioOffset++; renderBookingPaso1({ slug: t.slug }); });

    $all('[data-dia-booking]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        estadoReserva.fecha = btn.getAttribute('data-dia-booking');
        estadoReserva.horarioIdx = null;
        renderBookingPaso1({ slug: t.slug });
      });
    });
    $all('[data-horario]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        estadoReserva.horarioIdx = parseInt(btn.getAttribute('data-horario'), 10);
        renderBookingPaso1({ slug: t.slug });
      });
    });
    $all('[data-paquete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        estadoReserva.paquete = btn.getAttribute('data-paquete');
        renderBookingPaso1({ slug: t.slug });
      });
    });
    var btnMenos = $('#btn-pax-menos'), btnMas = $('#btn-pax-mas');
    if (btnMenos) btnMenos.addEventListener('click', function () { if (estadoReserva.personas > 1) { estadoReserva.personas--; renderBookingPaso1({ slug: t.slug }); } });
    if (btnMas) btnMas.addEventListener('click', function () { estadoReserva.personas++; renderBookingPaso1({ slug: t.slug }); });

    var btnAvisarme = $('#btn-avisarme');
    if (btnAvisarme) btnAvisarme.addEventListener('click', function () {
      var input = $('#input-email-espera');
      if (!input.value || input.value.indexOf('@') < 0) { mostrarToast('Escribe un email válido'); return; }
      mostrarToast('Listo — te avisaremos apenas se libere un cupo.');
      input.value = '';
    });

    var btnContinuar = $('#btn-paso1-continuar');
    if (btnContinuar) btnContinuar.addEventListener('click', function () {
      if (btnContinuar.disabled) return;
      irA('#/reservar/' + t.slug + '/2');
    });
  }

  // ============================================================
  // PÁGINA: Booking paso 2 — menú por persona + hotel
  // ============================================================
  function renderBookingPaso2(params) {
    var t = TOURS[params.slug];
    if (!t || t.booking !== 'completo') { render404(); return; }
    if (estadoReserva.tour !== t.slug || !estadoReserva.fecha) { irA('#/tour/' + params.slug); return; }
    if (!estadoReserva.platos || estadoReserva.platos.length !== estadoReserva.personas) {
      estadoReserva.platos = new Array(estadoReserva.personas).fill(null);
    }

    var listaHotel = '<datalist id="lista-hoteles">' + HOTELES.map(function (h) { return '<option value="' + h + '">'; }).join('') + '</datalist>';

    var personasHTML = '';
    for (var i = 0; i < estadoReserva.personas; i++) {
      personasHTML += '<span class="etq" style="margin-top:14px; display:block;">Persona ' + (i + 1) + '</span>' +
        '<div class="grid-4">' + PLATOS.map(function (p) {
          var sel = estadoReserva.platos[i] === p.id;
          return '<button type="button" class="plato' + (sel ? ' sel' : '') + '" data-persona="' + i + '" data-plato="' + p.id + '">' +
            '<div class="img">Foto</div><div class="cuerpo"><strong>' + esc(p.nombre) + '</strong><span>' + esc(p.desc) + '</span></div></button>';
        }).join('') + '</div>';
    }

    app.innerHTML = '<div class="contenedor" style="padding-top:16px;">' +
      pasosIndicadorHTML(t.slug, 2) +
      '<div class="book-grid">' +
      '<div>' +
      '<h3 style="font-size:17px; margin-bottom:6px;">El plato de cada uno</h3>' +
      '<p class="meta" style="margin-bottom:6px;">Se cocina a bordo, recién hecho. Puedes cambiarlo hasta 24 h antes del tour desde Mi Reserva.</p>' +
      personasHTML +
      '<span class="etq" style="margin-top:20px; display:block;">¿Dónde te recogemos?</span>' +
      '<div class="grid-2">' +
      '<div class="campo"><label>Tu hotel</label><input type="text" id="input-hotel" list="lista-hoteles" placeholder="Empieza a escribir…" value="' + esc(estadoReserva.hotel || '') + '">' + listaHotel + '</div>' +
      '<div class="benef" id="recogida-info" style="align-self:end; ' + (estadoReserva.horaRecogida ? '' : 'display:none;') + '"><h4>Tu recogida: <span id="recogida-hora">' + esc(estadoReserva.horaRecogida || '') + '</span></h4><p>Lobby principal. Te lo recordamos por WhatsApp la tarde anterior.</p></div>' +
      '</div>' +
      '<p class="meta" style="margin-top:8px;">¿No está tu hotel? Escríbenos por WhatsApp · Alojamiento privado / Airbnb → punto de encuentro</p>' +
      '<div class="campo" style="margin-top:14px;"><label>Algo que debamos saber (opcional)</label><textarea id="input-nota" placeholder="Alergias, movilidad, celebración…">' + esc(estadoReserva.notaAdicional || '') + '</textarea></div>' +
      '<button type="button" class="btn btn-primario btn-bloque" id="btn-paso2-continuar" style="margin-top:18px;">Continuar al pago</button>' +
      '</div>' +
      renderResumenReserva(2) +
      '</div></div>';

    inicializarBookingPaso2(t);
  }

  function calcularHoraRecogida(horaTourStr) {
    var m = horaTourStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return '';
    var h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    var min = parseInt(m[2], 10);
    var total = h * 60 + min - 55;
    if (total < 0) total += 24 * 60;
    var hh = Math.floor(total / 60), mm = total % 60;
    var period = hh >= 12 ? 'PM' : 'AM';
    var hh12 = hh % 12; if (hh12 === 0) hh12 = 12;
    return hh12 + ':' + String(mm).padStart(2, '0') + ' ' + period;
  }

  function inicializarBookingPaso2(t) {
    $all('[data-plato]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-persona'), 10);
        estadoReserva.platos[i] = btn.getAttribute('data-plato');
        renderBookingPaso2({ slug: t.slug });
      });
    });
    var inputHotel = $('#input-hotel');
    inputHotel.addEventListener('change', function () {
      estadoReserva.hotel = inputHotel.value || null;
      if (estadoReserva.hotel && HOTELES.indexOf(estadoReserva.hotel) >= 0) {
        estadoReserva.horaRecogida = calcularHoraRecogida(TOURS[t.slug].horarios[estadoReserva.horarioIdx].hora);
      } else {
        estadoReserva.horaRecogida = null;
      }
      renderBookingPaso2({ slug: t.slug });
    });
    var inputNota = $('#input-nota');
    inputNota.addEventListener('input', function () { estadoReserva.notaAdicional = inputNota.value; });

    $('#btn-paso2-continuar').addEventListener('click', function () {
      if (estadoReserva.platos.indexOf(null) >= 0) { mostrarToast('Falta elegir el plato de alguna persona'); return; }
      if (!estadoReserva.hotel) { mostrarToast('Escribe o elige tu hotel'); return; }
      irA('#/reservar/' + t.slug + '/3');
    });
  }

  // ============================================================
  // PÁGINA: Booking paso 3 — datos + pago
  // ============================================================
  function renderBookingPaso3(params) {
    var t = TOURS[params.slug];
    if (!t || t.booking !== 'completo') { render404(); return; }
    if (estadoReserva.tour !== t.slug || !estadoReserva.hotel) { irA('#/tour/' + params.slug); return; }

    var tot = calcularTotales();
    app.innerHTML = '<div class="contenedor" style="padding-top:16px;">' +
      pasosIndicadorHTML(t.slug, 3) +
      '<div class="book-grid">' +
      '<div>' +
      '<h3 style="font-size:17px; margin-bottom:10px;">Tus datos</h3>' +
      '<div class="form-grid">' +
      '<div class="campo" id="campo-nombre"><label>Nombre</label><input type="text" id="input-nombre" placeholder="Como en tu ID" value="' + esc(estadoReserva.datos.nombre) + '"><span class="error-msg">Falta tu nombre</span></div>' +
      '<div class="campo" id="campo-apellido"><label>Apellido</label><input type="text" id="input-apellido" value="' + esc(estadoReserva.datos.apellido) + '"><span class="error-msg">Falta tu apellido</span></div>' +
      '<div class="campo" id="campo-email"><label>Email — aquí va tu voucher</label><input type="email" id="input-email" value="' + esc(estadoReserva.datos.email) + '"><span class="error-msg">Email inválido</span></div>' +
      '<div class="campo" id="campo-telefono"><label>WhatsApp / móvil</label><input type="tel" id="input-telefono" placeholder="+1 809 000 0000" value="' + esc(estadoReserva.datos.telefono) + '"><span class="error-msg">Falta tu teléfono</span></div>' +
      '</div>' +
      '<h3 style="font-size:17px; margin-top:20px;">Pago exprés</h3>' +
      '<div class="wallets-row">' +
      '<button type="button" class="btn btn-secundario wallet-btn" data-wallet="Apple Pay"> Pay</button>' +
      '<button type="button" class="btn btn-secundario wallet-btn" data-wallet="Google Pay">G Pay</button>' +
      '<button type="button" class="btn btn-secundario wallet-btn" data-wallet="PayPal">PayPal</button>' +
      '</div>' +
      '<p class="meta">o completa con tarjeta abajo</p>' +
      '<h3 style="font-size:17px; margin-top:18px;">¿Cómo prefieres pagar?</h3>' +
      '<div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">' +
      '<button type="button" class="opcion-pago' + (estadoReserva.pago === 'deposito' ? ' sel' : '') + '" data-pago="deposito"><span class="opcion-pago-radio"></span>' +
      '<div><h4>Reserva con el 25% — ' + formatoDinero(tot.deposito) + ' hoy</h4><p>El resto (' + formatoDinero(tot.saldo) + ') en efectivo el día del tour <strong>con 5% de descuento</strong> (pagarías ' + formatoDinero(tot.saldoCash) + ') — o con tarjeta desde tu voucher, sin descuento.</p></div>' +
      '<span class="chip">recomendado</span></button>' +
      '<button type="button" class="opcion-pago' + (estadoReserva.pago === 'completo' ? ' sel' : '') + '" data-pago="completo"><span class="opcion-pago-radio"></span>' +
      '<div><h4>Pago completo — ' + formatoDinero(tot.total) + ' hoy</h4><p>Todo resuelto, nada que llevar el día del tour.</p></div></button>' +
      '</div>' +
      '<div class="campo" style="margin-top:14px;"><label>Tarjeta — Stripe</label><input type="text" id="input-tarjeta" placeholder="💳 Número · MM/AA · CVC"></div>' +
      '<div style="display:flex; gap:8px; align-items:start; margin-top:12px;">' +
      '<input type="checkbox" id="chk-terminos" style="margin-top:3px;">' +
      '<label for="chk-terminos" class="meta" style="margin:0;">Acepto los términos: cancelación gratis hasta 7 días antes · reembolso total por mal clima · no-show sin reembolso · <a href="#/reserva-directa" style="color:var(--acento);">liability release</a>.</label>' +
      '</div>' +
      '<p class="meta error-msg" id="error-terminos" style="margin-top:4px;">Debes aceptar los términos para continuar</p>' +
      '<button type="button" class="btn btn-primario btn-bloque" id="btn-confirmar-reserva" style="margin-top:14px;">Confirmar reserva — pagar ' + formatoDinero(estadoReserva.pago === 'deposito' ? tot.deposito : tot.total) + '</button>' +
      '<p class="meta" style="text-align:center; margin-top:8px;">Confirmación instantánea al email y WhatsApp</p>' +
      '</div>' +
      renderResumenReserva(3) +
      '</div></div>';

    inicializarBookingPaso3(t);
  }

  function inicializarBookingPaso3(t) {
    $all('[data-pago]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        estadoReserva.pago = btn.getAttribute('data-pago');
        renderBookingPaso3({ slug: t.slug });
      });
    });
    $all('[data-wallet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mostrarToast('Simulando pago con ' + btn.getAttribute('data-wallet') + '…');
        if (!estadoReserva.datos.nombre) estadoReserva.datos.nombre = 'Ana';
        if (!estadoReserva.datos.apellido) estadoReserva.datos.apellido = 'Pérez';
        if (!estadoReserva.datos.email) estadoReserva.datos.email = 'ana@email.com';
        if (!estadoReserva.datos.telefono) estadoReserva.datos.telefono = '+1 809 000 0000';
        setTimeout(function () { finalizarReserva(t); }, 500);
      });
    });
    $('#btn-confirmar-reserva').addEventListener('click', function () {
      var ok = true;
      var nombre = $('#input-nombre').value.trim(), apellido = $('#input-apellido').value.trim();
      var email = $('#input-email').value.trim(), telefono = $('#input-telefono').value.trim();
      var terminos = $('#chk-terminos').checked;
      marcarError('campo-nombre', !nombre); if (!nombre) ok = false;
      marcarError('campo-apellido', !apellido); if (!apellido) ok = false;
      var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      marcarError('campo-email', !emailValido); if (!emailValido) ok = false;
      marcarError('campo-telefono', !telefono); if (!telefono) ok = false;
      $('#error-terminos').style.display = terminos ? 'none' : 'block';
      if (!terminos) ok = false;
      if (!ok) { mostrarToast('Revisa los campos marcados'); return; }
      estadoReserva.datos = { nombre: nombre, apellido: apellido, email: email, telefono: telefono };
      finalizarReserva(t);
    });
  }

  function marcarError(idCampo, hayError) {
    var campo = document.getElementById(idCampo);
    if (campo) campo.classList.toggle('error', hayError);
  }

  function finalizarReserva(t) {
    estadoReserva.codigo = generarCodigoReserva();
    estadoReserva.fechaConfirmada = hoyISO();
    irA('#/reservar/' + t.slug + '/gracias');
  }

  // ============================================================
  // Registro de rutas
  // ============================================================
  ruta('/', renderHome);
  ruta('/tours', renderTours);
  ruta('/tour/:slug', renderFicha);
  ruta('/reservar/:slug/1', renderBookingPaso1);
  ruta('/reservar/:slug/2', renderBookingPaso2);
  ruta('/reservar/:slug/3', renderBookingPaso3);

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
