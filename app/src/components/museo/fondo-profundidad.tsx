import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { FRAGMENT, SIM, VERTEX } from './shader-agua'
import type { Descenso } from './use-descenso'

// EL AGUA de /underwater-museum: una capa pegada detrás de toda la página.
//
// Dos capas, de abajo arriba:
//   1. Un DEGRADADO CSS que ya cambia con `--museo-prof` (museo.css). Es lo que
//      se ve si no hay WebGL 2, si el usuario pidió menos movimiento, o
//      mientras el shader compila y la foto del héroe carga. La página funciona
//      entera solo con esto (el héroe usa entonces su <img>).
//   2. El CANVAS (shader-agua.ts) encima, que aparece con un fundido cuando la
//      foto del héroe ya está en la GPU — así nunca hay un destello ni un
//      fotograma sin foto.
//
// Rendimiento, que es donde estos efectos suelen fallar:
//   · Resolución interna limitada (DPR ≤ 1.25, ≤ 1 en móvil). El agua es
//     blanda por naturaleza; renderizarla a 3× en un iPhone solo calienta.
//   · La simulación de ondas va a 1/4 de esa resolución: las ondas son
//     suaves, no necesitan más, y es la pasada que más cuesta.
//   · Se para cuando la pestaña no se ve (lo hace el ticker de GSAP).
//   · Con `prefers-reduced-motion` no se monta.
//
// LAS GOTAS que alimentan las ondas salen SOLO del PUNTERO al moverse (y del
// dedo al arrastrar). [3ª vuelta, Samuel: «el efecto al pasar el mouse está
// bien, pero no me gusta que se haga al hacer scroll; que sea solo de hover»]
// Se quitaron las gotas del scroll y las gotas sueltas de ambiente: el agua se
// mueve cuando tú la tocas, y si no, está en calma.

type Props = { descenso: RefObject<Descenso> }

const FOTO_HERO = '/fotos/museo-hero.webp'

/** Resuelve un token de color a RGB 0–1 pasándolo por el navegador, para que
 *  valga cualquier forma de escribirlo (hex, var(), color-mix…). */
function tokenRGB(nombre: string): [number, number, number] {
  const sonda = document.createElement('span')
  sonda.style.color = `var(${nombre})`
  sonda.style.display = 'none'
  document.body.appendChild(sonda)
  const rgb = getComputedStyle(sonda).color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
  sonda.remove()
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]
}

export function FondoProfundidad({ descenso }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Sube cuando el navegador devuelve un contexto WebGL perdido: vuelve a
  // montar el efecto entero (programas, texturas, simulación) desde cero.
  const [vida, setVida] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // powerPreference por defecto: pedir 'high-performance' obliga, en portátiles
    // con dos gráficas, a cambiar de GPU al cargar — lento y con riesgo de perder
    // el contexto (3ª vuelta, «falla más que antes»).
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false })
    if (!gl) return

    // ── Programas ──
    const compilar = (tipo: number, fuente: string) => {
      const s = gl.createShader(tipo)!
      gl.shaderSource(s, fuente)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        if (import.meta.env.DEV) console.warn('[FondoProfundidad]', gl.getShaderInfoLog(s))
        return null
      }
      return s
    }
    const programa = (frag: string) => {
      const vs = compilar(gl.VERTEX_SHADER, VERTEX)
      const fs = compilar(gl.FRAGMENT_SHADER, frag)
      if (!vs || !fs) return null
      const p = gl.createProgram()!
      gl.attachShader(p, vs)
      gl.attachShader(p, fs)
      gl.bindAttribLocation(p, 0, 'aPos')
      gl.linkProgram(p)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null
    }
    const progAgua = programa(FRAGMENT)
    const progSim = programa(SIM)
    if (!progAgua) return

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uA = (n: string) => gl.getUniformLocation(progAgua, n)
    const uS = (n: string) => (progSim ? gl.getUniformLocation(progSim, n) : null)

    // ── Tamaños ──
    const movil = window.matchMedia('(max-width: 48rem)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, movil ? 1 : 1.25)
    let W = 0
    let H = 0
    let simW = 1
    let simH = 1

    // ── Simulación de ondas: dos texturas de alturas que se alternan ──
    // Necesita poder RENDERIZAR a coma flotante. Casi todo navegador actual lo
    // da; si no, el agua sale igual, solo que sin ondas.
    const flotante = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
    gl.getExtension('OES_texture_float_linear')
    const conOndas = flotante && !!progSim
    canvas.dataset.ondas = conOndas ? 'si' : 'no'
    const tex: WebGLTexture[] = []
    const fbo: WebGLFramebuffer[] = []
    let lee = 0

    const crearSim = () => {
      tex.forEach((t) => gl.deleteTexture(t))
      fbo.forEach((f) => gl.deleteFramebuffer(f))
      tex.length = 0
      fbo.length = 0
      for (let i = 0; i < 2; i++) {
        const t = gl.createTexture()!
        gl.bindTexture(gl.TEXTURE_2D, t)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simW, simH, 0, gl.RGBA, gl.HALF_FLOAT, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        const f = gl.createFramebuffer()!
        gl.bindFramebuffer(gl.FRAMEBUFFER, f)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        tex.push(t)
        fbo.push(f)
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    const ajustar = () => {
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w < 2 || h < 2 || (w === W && h === H)) return
      W = w
      H = h
      canvas.width = W
      canvas.height = H
      simW = Math.max(2, Math.round(W / 4))
      simH = Math.max(2, Math.round(H / 4))
      if (conOndas) crearSim()
    }
    // ⚠️ El tamaño se vigila con un ResizeObserver y no se mide una sola vez.
    // [3ª vuelta, Samuel: «al recargar a veces no carga el mar»] Al recargar a
    // mitad de página, el efecto podía correr antes de que el CSS diera alto a
    // la capa sticky: el canvas se medía a 0 y se quedaba así hasta
    // redimensionar la ventana. Ahora, en cuanto la capa tiene tamaño (o lo
    // cambia), el canvas se ajusta.
    ajustar()
    const vigia = new ResizeObserver(() => ajustar())
    vigia.observe(canvas)

    // ── Uniforms fijos ──
    gl.useProgram(progAgua)
    ;['superficie', 'somero', 'medio', 'hondo', 'abismo'].forEach((p, i) =>
      gl.uniform3fv(uA(`uC${i}`), tokenRGB(`--color-museo-${p}`)),
    )
    gl.uniform3fv(uA('uLuz'), tokenRGB('--color-museo-luz'))
    gl.uniform3fv(uA('uPapel'), tokenRGB('--color-papel'))
    gl.uniform3fv(uA('uVelo'), tokenRGB('--color-museo-abismo'))
    gl.uniform1f(uA('uConOndas'), conOndas ? 1 : 0)
    gl.uniform1i(uA('uOndas'), 0)
    gl.uniform1i(uA('uFoto'), 1)
    if (progSim) {
      gl.useProgram(progSim)
      gl.uniform1i(uS('uEstado'), 0)
    }

    // ── La foto del héroe, como textura ──
    let fotoLista = false
    let fotoAspecto = 1
    const texFoto = gl.createTexture()
    // La foto (2400px) se DECODIFICA antes de subirla a la GPU, con
    // img.decode(), que lo hace fuera del hilo principal. Con un onload pelado
    // el navegador la decodificaba de golpe dentro de texImage2D, en mitad de
    // la carga: era uno de los tropezones al recargar.
    let vivo = true
    const img = new Image()
    img.decoding = 'async'
    const subir = () => {
      if (!vivo || gl.isContextLost()) return
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, texFoto)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      fotoAspecto = img.naturalWidth / img.naturalHeight
      fotoLista = true
      canvas.dataset.foto = ''
    }
    const sinFoto = () => {
      // Sin foto el agua sigue; el héroe se queda con su <img> del DOM.
      fotoLista = false
      canvas.dataset.sinFoto = ''
    }
    // onload + decode, y NUNCA esperar a decode sin más: si decode() se queda
    // colgado o falla (pasa con imágenes grandes en algunos navegadores), la
    // foto se sube igual en cuanto haya cargado.
    img.onload = () => {
      img.decode().catch(() => {}).finally(subir)
    }
    img.onerror = sinFoto
    img.src = FOTO_HERO

    // ── Gotas ──
    const gotas: number[][] = []
    const soltar = (x: number, y: number, fuerza: number, radio: number) => {
      if (gotas.length < 4) gotas.push([x, y, fuerza, radio])
    }
    const puntero = { x: 0.5, y: 0.6, ox: 0.5, oy: 0.6, movido: false }
    // ⚠️ TODO lo que viene del DOM se mide RESPECTO AL CANVAS, no a la ventana.
    // El canvas vive en la columna, que empieza DEBAJO del Topbar: arriba del
    // todo de la página está 34px más abajo que el borde de la ventana. Medido
    // desde la ventana, la foto del héroe se pintaba 34px por debajo de su caja
    // —el logo asomaba por encima y el aire de abajo quedaba tapado— (Samuel,
    // con captura, 3ª vuelta). `caja` se refresca en cada fotograma.
    let caja = canvas.getBoundingClientRect()
    const alMover = (e: PointerEvent) => {
      puntero.ox = (e.clientX - caja.left) / Math.max(1, caja.width)
      puntero.oy = 1 - (e.clientY - caja.top) / Math.max(1, caja.height)
      puntero.movido = true
    }

    let primero = true

    // EL AGUA SE PINTA EN EL RELOJ DE GSAP, no en un requestAnimationFrame
    // propio. [3ª vuelta, Samuel: «tiembla un poco»] Con dos bucles separados,
    // a veces el shader leía la caja del héroe UN FOTOGRAMA ANTES de que GSAP
    // la creciera, y el borde de la foto vibraba al hacer scroll. Los oyentes
    // del ticker corren después de que GSAP haya actualizado sus animaciones,
    // en el mismo fotograma: el shader siempre lee la caja ya crecida. (El
    // ticker también se para solo con la pestaña oculta.)
    const pintar = (tiempo: number) => {
      if (W < 2 || H < 2 || gl.isContextLost()) return
      const t = tiempo
      const d = descenso.current
      caja = canvas.getBoundingClientRect()

      // Puntero: el halo lo sigue suavizado; la gota cae donde está de verdad.
      puntero.x += (puntero.ox - puntero.x) * 0.06
      puntero.y += (puntero.oy - puntero.y) * 0.06
      if (puntero.movido) {
        soltar(puntero.ox, puntero.oy, 0.014, 0.03)
        puntero.movido = false
      }

      // ── Pasada 1: simulación ──
      if (conOndas && progSim) {
        gl.useProgram(progSim)
        gl.viewport(0, 0, simW, simH)
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - lee])
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex[lee])
        gl.uniform2f(uS('uTexel'), 1 / simW, 1 / simH)
        gl.uniform1f(uS('uAspecto'), W / H)
        const plano = new Float32Array(16)
        gotas.forEach((g, i) => plano.set(g, i * 4))
        gl.uniform4fv(uS('uGotas'), plano)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        lee = 1 - lee
      }
      gotas.length = 0

      // ── Pasada 2: el agua (y la foto) ──
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, W, H)
      gl.useProgram(progAgua)
      if (conOndas) {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex[lee])
        gl.uniform2f(uA('uTexelOndas'), 1 / simW, 1 / simH)
      }
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, texFoto)

      // La caja del héroe, en píxeles del canvas y con el eje Y de WebGL.
      const marco = document.querySelector<HTMLElement>('[data-museo-hero-marco]')

      // CUÁNTO SE HA ABIERTO EL HÉROE, leído de la propia caja en cada
      // fotograma: la variable `--museo-cierre` que GSAP le escribe (1 = caja,
      // 0 = a sangre), y si el héroe ya quedó por encima de la pantalla, abierto
      // sí o sí. ⚠️ [3ª vuelta, Samuel, con captura: «recargué más abajo y mira
      // cómo se ve»] Antes se fiaba de un valor que solo se actualizaba
      // mientras la expansión se ANIMABA. Recargando ya abajo no se animaba, el
      // valor se quedaba en «caja» y el shader pintaba el papel blanco que
      // rodea la caja… en toda la pantalla.
      let expansion = d?.expansion ?? 0
      if (marco) {
        const cierre = parseFloat((marco.parentElement?.style.getPropertyValue('--museo-cierre') ?? '').trim())
        if (!Number.isNaN(cierre)) expansion = 1 - cierre
        if (marco.getBoundingClientRect().bottom <= caja.top) expansion = 1
      } else {
        expansion = 1
      }

      if (marco && fotoLista) {
        const r = marco.getBoundingClientRect()
        const radio = parseFloat(getComputedStyle(marco).borderTopLeftRadius) || 0
        gl.uniform4f(uA('uMarco'), (r.left - caja.left) * dpr, (caja.bottom - r.bottom) * dpr, r.width * dpr, r.height * dpr)
        gl.uniform1f(uA('uRadio'), radio * dpr)
      } else {
        gl.uniform4f(uA('uMarco'), 0, 0, 0, 0)
      }
      gl.uniform1f(uA('uFotoLista'), fotoLista ? 1 : 0)
      gl.uniform1f(uA('uFotoAspecto'), fotoAspecto)
      gl.uniform1f(uA('uExp'), expansion)
      const columna = canvas.closest('.museo')
      gl.uniform1f(uA('uOrillaY'), columna ? (caja.bottom - columna.getBoundingClientRect().bottom) * dpr : -1)
      gl.uniform2f(uA('uRes'), W, H)
      gl.uniform1f(uA('uTiempo'), t)
      gl.uniform1f(uA('uProf'), d?.prof ?? 0)
      gl.uniform1f(uA('uScroll'), d?.scroll ?? 0)
      gl.uniform2f(uA('uPuntero'), puntero.x, puntero.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // EL AGUA SE ENSEÑA EN SU PRIMER FOTOGRAMA, sin esperar a la foto.
      // [3ª vuelta, «a veces no carga el mar»] Antes esperaba a que la foto del
      // héroe estuviera en la GPU: si eso se atascaba, el mar no salía nunca.
      // Ahora agua y foto van por separado — mientras la foto no llega, el
      // héroe enseña su <img> del DOM (museo.css, `data-foto`).
      if (primero) {
        primero = false
        canvas.dataset.listo = ''
      }
    }
    // CONTEXTO PERDIDO. Tras muchas recargas (o con la GPU ocupada) el
    // navegador puede quitarle el contexto WebGL a la página. Sin esto el agua
    // se quedaba en negro para siempre. Se para el pintado, se vuelve al
    // degradado CSS y, cuando el navegador lo devuelve, se monta todo otra vez.
    const perdido = (e: Event) => {
      e.preventDefault()
      gsap.ticker.remove(pintar)
      delete canvas.dataset.listo
      delete canvas.dataset.foto
    }
    const recuperado = () => setVida((v) => v + 1)
    canvas.addEventListener('webglcontextlost', perdido)
    canvas.addEventListener('webglcontextrestored', recuperado)

    gsap.ticker.add(pintar)
    window.addEventListener('pointermove', alMover, { passive: true })
    return () => {
      vivo = false
      gsap.ticker.remove(pintar)
      vigia.disconnect()
      canvas.removeEventListener('webglcontextlost', perdido)
      canvas.removeEventListener('webglcontextrestored', recuperado)
      window.removeEventListener('pointermove', alMover)
      // ⚠️ NO `loseContext()` aquí: el canvas devuelve SIEMPRE el mismo
      // contexto, así que perderlo en la limpieza deja muerto el siguiente
      // montaje (StrictMode monta dos veces en desarrollo y el agua no salía).
      // Se liberan los recursos y el contexto lo recoge el GC con el canvas.
      tex.forEach((x) => gl.deleteTexture(x))
      fbo.forEach((x) => gl.deleteFramebuffer(x))
      gl.deleteTexture(texFoto)
      gl.deleteProgram(progAgua)
      if (progSim) gl.deleteProgram(progSim)
      gl.deleteBuffer(buf)
      delete canvas.dataset.listo
      delete canvas.dataset.foto
    }
  }, [descenso, vida])

  return (
    // STICKY y no fixed (museo.css): pegada arriba mientras dura la columna de
    // agua y se va con ella cuando llega el footer. Una capa fixed se pintaría
    // ENCIMA del footer, que va en flujo normal y sin z-index.
    <div aria-hidden="true" className="museo-agua pointer-events-none">
      <canvas ref={canvasRef} className="museo-agua-canvas absolute inset-0 size-full" />
    </div>
  )
}
