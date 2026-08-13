# Hispaniola — build de producción

Esta rama **no tiene código fuente**: es la salida de `npm run build` de `app/`,
con la raíz del sitio en la raíz del repo. Lista para servir tal cual.

El fuente vive en la rama `main`.

## De dónde sale

| | |
|---|---|
| Commit de origen | `b0c6f61` — *Conectar el front con Odoo: el precio y las reservas dejan de vivir en el navegador* |
| Comando | `npm run build` en `app/` (= `tsc -b && vite build`) |
| `VITE_API_URL` compilada | `https://sistemashispaniola.com` (de `app/.env.production`) |

⚠️ La URL de la API va **incrustada en el JS**. Si el Odoo cambia de dominio no
basta con tocar una config: hay que recompilar. Y el dominio desde el que se
sirva esto tiene que estar dado de alta en Odoo (Ajustes > Hispaniola Web >
Allowed origins), o el navegador bloquea todas las llamadas por CORS.

## Cómo servirlo

Es una SPA: **cualquier ruta que no sea un archivo real tiene que devolver
`index.html`**, o `/tours/saona-island` da 404. Hay un `404.html` idéntico al
`index.html` para los hostings estáticos que usan esa convención (GitHub Pages).

```nginx
# nginx
root /ruta/a/esta/carpeta;
location / { try_files $uri $uri/ /index.html; }
```

```apache
# Apache — .htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Para una prueba rápida: `npx serve -s .` o `python3 -m http.server`
(este último **no** hace el fallback de SPA — solo sirve para ver la home).

## Lo que este build NO trae

`app/vercel.json` define **33 redirects 301** de las URLs viejas en español
(`/tours/isla-saona` → `/tours/saona-island`, `/reservar/…` → `/book/…`) y las
cabeceras de caché de `/assets/`. Eso lo aplica Vercel en su capa, **no está
dentro del build**. Si esto se sirve fuera de Vercel hay que traducir esos
redirects a la config del servidor, o las URLs indexadas en Google se pierden.
