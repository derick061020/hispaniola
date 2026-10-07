#!/usr/bin/env bash
# Medios de /underwater-museum (2026-10-07, encargo de Raymond en la reunión
# del 05-10; carpeta «Ejemplo visual/MUSEO SUBACUATICO» que pasó Samuel).
#
# Uso:  bash scripts/museo-medios.sh "<ruta a MUSEO SUBACUATICO>"
#
# QUÉ SE USA Y POR QUÉ.
#   · FOTOS — las de `MEJORADAS/` (y las `IMG_00x.png` de la raíz, que son las
#     mismas que `MEJORADAS/GOPRO_102..106`). Vienen ya etalonadas en azul y a
#     5504×3072; las `GP*.JPG` crudas de la GoPro salen verdes y no se usan.
#     Pesan ~20 MB cada una en PNG: aquí bajan a WEBP de 150–350 KB.
#   · VÍDEOS — los tres que el cliente apartó en `PARA USAR/` (los domos del
#     vivero) + la raya de GX010202 para «Species that make the museum their
#     home». Son 4K HEVC de 80–145 MB: el HEVC no lo reproduce todo navegador,
#     así que salen a H.264 720×1280 (9:16 nativo de la GoPro), sin audio
#     (bajo el agua solo hay ruido de carcasa), 10 s y crf 32.
#
# ⚠️ EL COLOR. La GoPro graba sin corregir y el agua sale verde; las fotos
# mejoradas que van al lado son turquesa. Sin igualarlos, los reels parecen de
# otro sitio. `CURVAS` baja el verde en medios, sube el azul y da un punto de
# contraste: es la tercera de cuatro pruebas comparadas contra
# MEJORADAS/GOPRO_116 — la que más se acercaba sin volverse cian plano.
set -u
SRC="${1:?Pasa la ruta de la carpeta MUSEO SUBACUATICO}"
FOTOS=app/public/fotos
VID=app/public/video/museo
mkdir -p "$VID"

CURVAS="curves=r='0/0 0.5/0.40 1/0.95':g='0/0 0.5/0.45 1/0.97':b='0/0.03 0.5/0.60 1/1',eq=saturation=1.18:contrast=1.12"

kb() { printf '  %-32s %7.0f KB\n' "$(basename "$1")" "$(stat -c%s "$1" | awk '{print $1/1024}')"; }

# ── FOTOS ── nombre-destino:origen:ancho
# El héroe va a 2400 (se ve a pantalla completa en monitores grandes); el
# resto a 1600, que es el doble del mayor hueco que ocupan en la página.
while IFS=: read -r dst org ancho; do
  [ -z "$dst" ] && continue
  ffmpeg -nostdin -y -v error -i "$SRC/$org" -vf "scale=$ancho:-2" -c:v libwebp -quality 80 "$FOTOS/$dst.webp"
  kb "$FOTOS/$dst.webp"
done <<'EOF'
museo-hero:IMG_004.png:2400
museo-bateador:IMG_002.png:1600
museo-lanzador:IMG_001.png:1600
museo-lanzador-lateral:IMG_006.png:1600
museo-figura-superficie:IMG_005.png:1600
museo-brazos-cruzados:MEJORADAS/GOPRO_1088.png:1600
museo-diablo:MEJORADAS/GOPRO_114.png:1600
museo-buzo-diablo:MEJORADAS/IMG_5757.png:1600
museo-buzo-figura:MEJORADAS/IMG_5758.png:1600
museo-vivero-domo:MEJORADAS/GOPRO_115.png:1600
museo-vivero-arrecife:MEJORADAS/GOPRO_116.png:1600
EOF

# ── VÍDEOS ── nombre:origen:segundo-de-inicio:segundo-del-póster
while IFS=: read -r dst org ini pos; do
  [ -z "$dst" ] && continue
  ffmpeg -nostdin -y -v error -ss "$ini" -t 10 -i "$SRC/$org" -an \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,$CURVAS" \
    -c:v libx264 -preset slow -crf 32 -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "$VID/$dst.mp4"
  kb "$VID/$dst.mp4"
  ffmpeg -nostdin -y -v error -ss "$pos" -i "$VID/$dst.mp4" -frames:v 1 -vf "scale=540:960" \
    -c:v libwebp -quality 80 "$FOTOS/$dst.webp"
  kb "$FOTOS/$dst.webp"
done <<'EOF'
museo-reel-arrecife:PARA USAR/GX010203.MP4:3:4
museo-reel-especies:GX010202.MP4:2:5
museo-reel-ciencia:PARA USAR/GX010205.MP4:2:3
EOF
echo LISTO
