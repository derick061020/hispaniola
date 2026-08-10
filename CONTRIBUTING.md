# Cómo trabajamos dos personas en este repo

Somos dos y tocamos el mismo código a la vez:

- **Samuel** — diseño y contenido. Trabaja en `staging`, todos los días, en todo el sitio.
- **Derick** — backend. Conectar el motor de reservas (Odoo / sustituir xpotours) y
  terminar el multi-idioma. Trabaja en su propia rama.

Este documento es el acuerdo para que eso no acabe en un merge imposible.
Si algo aquí choca con la realidad, gana la realidad: avisad y lo cambiamos.

---

## Las ramas

```
master        lo que está publicado. Solo recibe cosas revisadas.
  └ staging   integración: donde se juntan los dos. Samuel vive aquí.
      └ backend-odoo   Derick vive aquí (y ramas cortas que salgan de ella)
```

`respaldo-antes-de-reordenar` es un archivo histórico. No se toca.

⚠️ **Comprobad en el panel de Vercel qué rama es la de producción.** Hoy `master` y
`staging` apuntan al mismo commit y no se nota; en cuanto divergáis, importa.

---

## El día a día

### Samuel

Nada cambia. Trabaja en `staging` como hasta ahora. Lo único importante:

```bash
git add -A && git commit -m "..." && git push
```

**Empuja todos los días.** El trabajo que solo existe en tu disco es el que se pierde
y el que provoca los merges monstruosos.

### Derick

Primera vez:

```bash
git clone https://github.com/samuelurbi/hispaniola.git
cd hispaniola/app
npm ci
npm run dev
```

Lee el [`README.md`](README.md) de la raíz antes de nada: está el estado real, la
frontera con el backend y las trampas verificadas.

**Cada mañana, antes de escribir una línea:**

```bash
git checkout backend-odoo
git merge staging          # traes el trabajo de Samuel a tu rama
```

Esta es **la regla que de verdad importa**. Un merge diario son tres conflictos de dos
líneas. Un merge de tres semanas son doscientos y nadie recuerda por qué. Si un día
sale un conflicto que no entiendes, para y pregunta — no lo resuelvas a ojo.

---

## Cómo se junta el trabajo

Cuando una pieza esté terminada, **Pull Request en GitHub** hacia `staging`. Nunca un
merge directo a ciegas. El PR da tres cosas gratis:

1. El diff completo antes de aceptar.
2. GitHub avisa si hay conflictos.
3. **Vercel construye una URL de preview de esa rama** — se mira en un sitio real antes
   de fusionar.

Antes de abrir el PR, en `app/`:

```bash
npm run typecheck     # NO uses "tsc --noEmit": no comprueba nada en este repo
npm run lint
npm run build && npm run preview   # los redirects solo se ven aquí, no en dev
```

Para ensayar un merge sin hacerlo:

```bash
git merge --no-commit --no-ff backend-odoo
git merge --abort
```

---

## Quién es dueño de qué

No es burocracia: son los sitios donde un conflicto duele de verdad.

| Zona | Dueño | Nota |
|---|---|---|
| `src/dev/dev-registry.ts` | **Samuel, en exclusiva** | Líneas de hasta 35.000 caracteres. Un conflicto aquí es ilegible. Derick no lo toca nunca; mantenerlo tampoco es tarea suya. |
| `src/data/*.ts` | Samuel (contenido) | Derick va a cambiar de dónde salen los datos. **Avisar antes** de tocar la forma de estos archivos. |
| `src/styles/`, `src/components/**` (diseño) | Samuel | |
| `src/App.tsx` (rutas) | Compartido | Avisar. Una ruta nueva se toca en `App.tsx` + `public/sitemap.xml` + `vercel.json`, en el mismo commit. |
| `src/lib/api.ts`, `.env*`, tipos de API | **Derick, en exclusiva** | Archivos nuevos: cero conflicto posible. |
| `src/lib/reservas.ts`, `src/lib/cotizacion-evento.ts` | Derick | Es el contrato con el backend. |
| `app/qa/`, `vercel.json`, `package.json` | Compartido | Avisar. |

---

## Por dónde empezar, Derick

**Empieza por la capa de red.** `src/lib/api.ts`, `.env.example`, los tipos, los estados
de carga y error. Son **archivos nuevos**: puedes correr desde hoy sin rozar a Samuel.

Lee en el README la sección «La frontera con el backend»: están los 9 puntos que fingen
servidor y los 3 campos que le faltan al contrato de `reservas.ts` para Odoo.

🔴 **Habla con Samuel del bug de precios antes de escribir el primer endpoint.** El
checkout calcula el total con una fórmula distinta a la de la ficha (hasta 3.570 USD de
desvío) y hay que decidir si ese cálculo se queda en el front o pasa al backend. Está
explicado con números en el README.

### El multi-idioma NO va en una rama larga

Tocar el i18n significa tocar ~550-650 cadenas en **112 archivos de componentes** — casi
todo lo que Samuel edita a diario. En una rama de tres semanas, el merge final es
inmanejable.

**Se hace en una ventana corta y acordada**, en la que Samuel no toca componentes, o en
tajadas pequeñas que se fusionan el mismo día. Es la única parte del proyecto donde
conviene turnarse en vez de ir en paralelo. Antes de empezar, leer
`docs/proceso/correcciones-v3-cliente/planes/01-idioma-ingles.md`, que es la spec vigente
(el Bloque H de `app/PLAN-LANZAMIENTO.md` está derogado).

---

## Lo que no se hace nunca

Estas tres ya costaron trabajo perdido en este repo:

- **`git stash` mientras el otro puede estar guardando archivos.** Hubo una colisión
  real: el stash se llevó archivos que la otra sesión estaba escribiendo.
- **`git add -A` cuando el árbol tiene trabajo ajeno sin commitear.** Un commit titulado
  «selector premium» se llevó por delante 75 archivos y 5.327 líneas de otro. Si
  `git status` muestra más cambios de los que hiciste tú, para y pregunta.
- **`git push --force` sobre una rama compartida.** Borra el trabajo del otro en el
  remoto. Si crees que lo necesitas, no lo necesitas: pregunta.

Y una regla de git que casi nadie sabe y aquí ya mordió:
**`git commit -- <archivos>` NO respeta lo que ya has preparado en el índice** — relee el
working tree para esas rutas. Cuando hayas preparado algo a mano, commitea sin poner
rutas detrás.

---

## Si algo sale mal

Casi nada es irrecuperable si está empujado. Puntos de retorno:

```bash
git log --oneline            # el historial
git tag                      # 18 tags: v3-pre-en, v2-internas, v1.1-ficha-alignui...
git reset --soft HEAD~1      # deshace el último commit SIN tocar tus archivos
```

Antes de cualquier operación que dé miedo: `git branch respaldo-$(date +%m%d)` y ya
tienes de dónde volver.
