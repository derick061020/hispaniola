// El agua de /underwater-museum, en WebGL 2 (2026-10-07).
//
// POR QUÉ WEBGL Y NO CSS. El V2 del cliente hacía las burbujas con <div> que
// suben con una animación CSS: todas en el mismo plano, del mismo tamaño y a la
// misma velocidad, y eso se lee como confeti, no como agua. Lo que vende la
// sensación de bajar es lo que CSS no da barato: profundidad de campo (burbujas
// cerca, desenfocadas y rápidas; lejos, pequeñas y lentas), la red de luz de
// las cáusticas que se apaga al hundirse, y partículas en suspensión que
// aumentan con la profundidad.
//
// LAS ONDAS (2ª vuelta, Samuel: «que con el movimiento del mouse haya ondas de
// agua, como cuando uno mueve el agua en la vida real»). Es el efecto que se ve
// en redes —el de jquery.ripples—: una SIMULACIÓN de la ecuación de onda sobre
// una textura de alturas, a 1/4 de la resolución. Cada fotograma:
//   1. SIM:    altura nueva = media de los 4 vecinos × 2 − altura anterior,
//              amortiguada. El puntero, el scroll y alguna gota suelta dejan
//              caer «gotas» (un bache de coseno) en esa textura.
//   2. RENDER: la pendiente de la altura en cada píxel DESVÍA dónde se lee
//              todo lo demás (la foto del héroe, las cáusticas, las burbujas) y
//              añade el brillo especular de la cresta. Eso es lo que hace que
//              parezca refracción y no un filtro encima.
//
// LA FOTO DEL HÉROE se pinta AQUÍ y no en un <img>, por dos motivos que pidió
// Samuel en la misma vuelta: (a) que las ondas la deformen igual que al agua,
// y (b) que su borde inferior se funda con el agua sin el corte que dejaba la
// máscara CSS — aquí foto y agua son el mismo píxel, no dos capas. El DOM le
// pasa al shader el rectángulo de la caja del héroe (que GSAP expande al hacer
// scroll) y el shader la recorta con las mismas esquinas redondeadas.
//
// Sin three.js a propósito: para dos pasadas a pantalla completa son 150 KB
// que no hacen nada.

export const VERTEX = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

/** Pasada 1 — la simulación. R = altura ahora, G = altura en el paso anterior. */
export const SIM = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uEstado;
uniform vec2 uTexel;
uniform float uAspecto;
uniform vec4 uGotas[4]; // x, y (0–1), fuerza, radio (en alto de pantalla)
in vec2 vUv;
out vec4 salida;

void main() {
  vec4 c = texture(uEstado, vUv);
  float n = texture(uEstado, vUv + vec2(0.0, uTexel.y)).r;
  float s = texture(uEstado, vUv - vec2(0.0, uTexel.y)).r;
  float e = texture(uEstado, vUv + vec2(uTexel.x, 0.0)).r;
  float o = texture(uEstado, vUv - vec2(uTexel.x, 0.0)).r;
  float h = (n + s + e + o) * 0.5 - c.g;
  h *= 0.982; // amortiguación: cuánto viaja una onda antes de morir

  for (int i = 0; i < 4; i++) {
    vec4 g = uGotas[i];
    if (g.z == 0.0) continue;
    vec2 d = vUv - g.xy;
    d.x *= uAspecto;
    float t = clamp(1.0 - length(d) / g.w, 0.0, 1.0);
    h += g.z * (0.5 - 0.5 * cos(t * 3.14159));
  }
  salida = vec4(h, c.r, 0.0, 1.0);
}
`

/** Pasada 2 — lo que se ve. */
export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTiempo;
uniform float uProf;
uniform float uScroll;
uniform vec2 uPuntero;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
uniform vec3 uLuz;
uniform vec3 uPapel;
uniform vec3 uVelo;

uniform sampler2D uOndas;
uniform float uConOndas;
uniform vec2 uTexelOndas;

uniform sampler2D uFoto;
uniform float uFotoLista;
uniform float uFotoAspecto;
uniform vec4 uMarco;   // x, y (abajo-izquierda), ancho, alto — en píxeles del canvas
uniform float uRadio;  // esquinas de la caja, en píxeles
uniform float uExp;    // 0 = caja con aire alrededor, 1 = foto a sangre
uniform float uOrillaY; // dónde acaba la columna de agua (empieza el footer), en px del canvas

in vec2 vUv;
out vec4 salida;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 agua(float d) {
  d = clamp(d, 0.0, 1.0) * 4.0;
  if (d < 1.0) return mix(uC0, uC1, d);
  if (d < 2.0) return mix(uC1, uC2, d - 1.0);
  if (d < 3.0) return mix(uC2, uC3, d - 2.0);
  return mix(uC3, uC4, d - 3.0);
}

// Cáusticas: la red de luz que el oleaje proyecta. Iteración clásica de
// «agua tileable». ⚠️ El «- 250.0» NO es decorativo: la fórmula está calibrada
// para p lejos del origen; sin él cada término vale ~20 y la luz satura a
// blanco (pasó: la parte somera de la página salía blanca entera).
float causticas(vec2 p, float t) {
  p = mod(p, 6.2831) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}

float rayos(vec2 uv, float t) {
  vec2 v = uv - vec2(0.35, 1.35);
  float ang = atan(v.x, -v.y);
  float r = 0.5 + 0.5 * sin(ang * 23.0 + t * 0.35);
  r *= 0.5 + 0.5 * sin(ang * 41.0 - t * 0.22 + 1.7);
  r *= 0.6 + 0.4 * sin(ang * 9.0 + t * 0.15);
  return r * smoothstep(1.6, 0.2, length(v));
}

vec4 burbujas(vec2 uv, float aspecto, float escala, float vel, float par, float borde, float semilla) {
  vec2 p = vec2(uv.x * aspecto, uv.y) * escala;
  p.y -= uTiempo * vel + uScroll * par;
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float r = hash(id + semilla);
  if (r < 0.88) return vec4(0.0);
  float bam = sin(uTiempo * (1.2 + r) + r * 40.0) * 0.18;
  vec2 centro = vec2((hash(id + semilla + 7.0) - 0.5) * 0.5 + bam, (hash(id + semilla + 3.0) - 0.5) * 0.5);
  float radio = mix(0.07, 0.2, hash(id + semilla + 11.0));
  float dist = length(f - centro);
  float canto = smoothstep(radio + borde, radio, dist) - smoothstep(radio, radio - borde * 2.0 - 0.025, dist) * 0.82;
  float brillo = smoothstep(radio * 0.42, 0.0, length(f - centro - vec2(-radio * 0.35, radio * 0.38)));
  return vec4(uLuz, clamp(canto + brillo * 0.9, 0.0, 1.0));
}

// Caja redondeada (distancia con signo), en píxeles.
float caja(vec2 p, vec2 centro, vec2 mitad, float r) {
  vec2 q = abs(p - centro) - (mitad - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = vUv;
  vec2 px = uv * uRes;
  float aspecto = uRes.x / uRes.y;

  // ── Ondas: pendiente de la superficie en este píxel ──
  vec2 pend = vec2(0.0);
  if (uConOndas > 0.5) {
    float e = texture(uOndas, uv + vec2(uTexelOndas.x, 0.0)).r;
    float o = texture(uOndas, uv - vec2(uTexelOndas.x, 0.0)).r;
    float n = texture(uOndas, uv + vec2(0.0, uTexelOndas.y)).r;
    float s = texture(uOndas, uv - vec2(0.0, uTexelOndas.y)).r;
    pend = vec2(e - o, n - s);
  }
  // Lo que se ve A TRAVÉS del agua, desviado. La pendiente entre texels vecinos
  // es del orden de 0.005: por eso el factor ronda 0.5 y no algo «prudente» como el
  // 0.035 de la 1ª prueba, que desviaba menos de un píxel y no se veía nada.
  vec2 uvR = uv + pend * 0.45;

  // ── El agua ──
  float d = uProf + (0.5 - uvR.y) * 0.14;
  vec3 col = agua(d);

  float sol = 1.0 - smoothstep(0.0, 0.55, uProf);
  float c = 0.0;
  if (sol > 0.001) {
    vec2 pc = vec2(uvR.x * aspecto, uvR.y) * 5.5;
    c = causticas(pc + vec2(0.0, uScroll * 0.6), uTiempo * 0.35);
    col += uLuz * c * 0.32 * sol * smoothstep(0.0, 0.9, uvR.y);
    col += uLuz * rayos(uvR, uTiempo) * 0.16 * sol;
  }

  vec2 dp = vec2((uv.x - uPuntero.x) * aspecto, uv.y - uPuntero.y);
  col += uLuz * exp(-dot(dp, dp) * 5.0) * mix(0.015, 0.045, uProf);

  vec2 pn = vec2(uvR.x * aspecto, uvR.y) * 70.0;
  pn.y += uTiempo * 0.6 + uScroll * 4.0;
  float mota = step(0.985, hash(floor(pn))) * smoothstep(0.35, 0.0, length(fract(pn) - 0.5));
  col += uLuz * mota * mix(0.05, 0.22, uProf);

  vec4 b1 = burbujas(uvR, aspecto, 26.0, 0.10, 2.2, 0.012, 1.0);
  vec4 b2 = burbujas(uvR, aspecto, 14.0, 0.16, 3.4, 0.02, 17.0);
  vec4 b3 = burbujas(uvR, aspecto, 6.5, 0.24, 5.0, 0.06, 41.0);
  col = mix(col, b1.rgb, b1.a * 0.14);
  col = mix(col, b2.rgb, b2.a * 0.2);
  col = mix(col, b3.rgb, b3.a * 0.11);

  float vin = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(aspecto * 0.9, 1.0)));
  col *= mix(1.0, vin, 0.25 + uProf * 0.45);

  // ── La foto del héroe ──
  if (uFotoLista > 0.5 && uMarco.w > 1.0) {
    vec2 mitad = uMarco.zw * 0.5;
    float dist = caja(px, uMarco.xy + mitad, mitad, uRadio);
    float dentro = clamp(0.5 - dist, 0.0, 1.0);

    // object-fit: cover, con el foco un poco por encima del centro (la
    // cabeza del bateador y la superficie, no la arena).
    vec2 p = (px - uMarco.xy) / uMarco.zw;
    float asp = uMarco.z / uMarco.w;
    vec2 escala = asp > uFotoAspecto ? vec2(1.0, uFotoAspecto / asp) : vec2(asp / uFotoAspecto, 1.0);
    vec2 uvF = (p - 0.5) * escala;
    uvF.x += 0.5;
    uvF.y += clamp(0.6, 0.5 * escala.y, 1.0 - 0.5 * escala.y);
    uvF = (uvF - 0.5) / (1.0 + uExp * 0.05) + 0.5; // se acerca un poco al abrirse
    uvF += pend * 0.3;
    vec3 foto = texture(uFoto, uvF).rgb;

    // La luz del agua también cae sobre la foto: un velo de cáusticas arriba.
    foto += uLuz * c * 0.07 * smoothstep(0.4, 1.0, p.y);
    // Velo para el texto (abajo) y para el nav (arriba). En el shader y no
    // en un <div>: un degradado del DOM tendría su propio borde inferior, y
    // ese borde era justo el corte que había que quitar.
    foto = mix(foto, uVelo, smoothstep(0.62, 0.0, p.y) * 0.62);
    foto = mix(foto, uVelo, smoothstep(0.8, 1.0, p.y) * 0.4);

    // Abierta a sangre, su tercio inferior se disuelve en el agua.
    float funde = mix(1.0, smoothstep(0.0, 0.38, p.y), uExp);
    float a = dentro * funde;

    // Fuera de la caja, mientras aún es caja, está el papel de la web: el
    // aire blanco alrededor que tienen todos los héroes del sitio.
    vec3 fuera = mix(col, uPapel, 1.0 - uExp);
    col = mix(fuera, foto, a);
  }

  // LA ORILLA. Al final de la página el agua toca la espuma del footer, que es
  // un turquesa PLANO (--color-museo-somero, ver .museo-pie en museo.css). Con
  // rayos, cáusticas y burbujas encima, el agua salía más clara que la espuma
  // y se veía la costura. Los 30 % de pantalla que hay justo encima del borde
  // de la columna convergen al color exacto de la espuma: dos superficies del
  // mismo color, sin línea. ⚠️ Se mide desde el BORDE DE LA COLUMNA y no desde
  // el pie del canvas: el canvas sticky sigue hasta abajo de la pantalla,
  // tapado por el footer (1ª prueba: el fundido caía detrás del footer).
  float banda = uRes.y * 0.3;
  col = mix(col, uC1, smoothstep(uOrillaY + banda, uOrillaY, px.y) * step(uOrillaY - 1.0, px.y));

  // Brillo especular de las crestas: lo que hace que la onda se VEA.
  if (uConOndas > 0.5) {
    vec3 normal = normalize(vec3(-pend * 35.0, 1.0));
    float spec = pow(max(dot(normal, normalize(vec3(-0.35, 0.55, 1.0))), 0.0), 60.0);
    col += uLuz * spec * 0.3 + vec3(pend.y * 1.6);
  }

  salida = vec4(col, 1.0);
}
`
