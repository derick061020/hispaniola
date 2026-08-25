# Hispaniola — build de producción

Esta rama **no tiene código fuente**: es la salida de `npm run build` de `app/`,
con la raíz del sitio en la raíz del repo. Lista para servir tal cual.

El fuente vive en la rama `main`.

## De dónde sale

| | |
|---|---|
| Commit de origen | `1b95c45` — *El aforo de un producto sin tramos ya no sale «infinito»* |
| Comando | `npm run build` en `app/` (= `tsc -b && vite build`) |
| `VITE_API_URL` compilada | `https://sistemashispaniola.com` (de `app/.env.production`) |

⚠️ La URL de la API va **incrustada en el JS**. Si el Odoo cambia de dominio no
basta con tocar una config: hay que recompilar. Y el dominio desde el que se
sirva esto tiene que estar dado de alta en Odoo (Ajustes > Hispaniola Web >
Allowed origins), o el navegador bloquea todas las llamadas por CORS.

## Cómo servirlo

Es una SPA: **cualquier ruta que no sea un archivo real tiene que devolver
`index.html`**, o `/tours/saona-island` da 404 — y también `/my-booking`, que es
a donde llevan los correos de Odoo.

La rama trae un **`.htaccess`** con la reescritura de la SPA, las 34
redirecciones de las URLs viejas en español y el cacheo de `/assets`: es el
equivalente de `app/vercel.json` para el hosting compartido, que no lee ese
archivo. **Si se añade un redirect en `vercel.json`, se añade también ahí.**

En Vercel manda `vercel.json` y el `.htaccess` se ignora; conviven sin estorbarse.

```nginx
# nginx
root /ruta/a/esta/carpeta;
location / { try_files $uri $uri/ /index.html; }
```

Hay además un `404.html` idéntico al `index.html` para los hostings estáticos
que usan esa convención (GitHub Pages).

## Qué pide este build a Odoo

Al abrir una ficha de tour ya no se pinta la tarifa del código: se pide
`GET /api/web/v1/tours/<slug>` y de ahí salen precios, tramos, aforo, horarios
y add-ons. Si Odoo no contesta, se pinta lo estático y la venta sigue viva.

## Las imágenes de los correos

`mails/` son las fotos que piden las plantillas de correo del módulo
`hispaniola_web`. No se tocan a mano aquí: salen de `app/public/mails/` en la
rama `main`.
