#!/usr/bin/env bash
# Segunda entrega (2026-08-23) — [2] «This is what a day with us looks like».
#
# El cliente marca con una flecha roja el TERCER reel de la fila
# (`CAMBIOS/CAMBIAR ESTE VIDEO.png`) y deja el sustituto en `CAMBIOS/4.mp4`.
# Ese tercer reel es `reel-3.mp4`, que en la primera entrega salio de
# «4 PAGINA INICIO.mp4» — o sea que el «4» del archivo nuevo es el numero del
# ORIGINAL que sustituye, no la posicion en la fila. Cuadra.
#
# El pie de ese reel dice «A green turtle, right off the boat» y el video nuevo
# ABRE con la tortuga (verificado fotograma a fotograma), asi que el copy sigue
# siendo cierto y no se toca. El poster se saca del segundo 1,2 —igual que los
# otros cinco, en scripts/videos2.sh— y ahi tambien sale la tortuga.
#
# crf 33 en UNA pasada: es la calidad en la que acabaron los reels pesados
# despues de la segunda vuelta de videos2.sh, y una sola pasada a 33 se ve mejor
# que 30 recodificado a 33.
set -u
FF="$(dirname "$(which ffmpeg)")/ffmpeg"
E="FOTO PARA NUEVA WEB 2026"
SRC="$E/HOMEPAGE/This is what a day with us looks like/CAMBIOS/4.mp4"

"$FF" -y -v error -i "$SRC" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libx264 -preset slow -crf 33 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 80k -ac 2 app/public/video/reels/reel-3.mp4
printf '  %-30s %6.1f MB\n' "reel-3.mp4" "$(stat -c%s app/public/video/reels/reel-3.mp4 | awk '{print $1/1048576}')"

# Poster: fotograma real del propio video, mismo instante que los otros cinco.
"$FF" -y -v error -ss 1.2 -i app/public/video/reels/reel-3.mp4 -frames:v 1 \
  -vf "scale=540:960" app/public/fotos/reel-3.webp -quality 82
printf '  %-30s %6.1f KB\n' "reel-3.webp" "$(stat -c%s app/public/fotos/reel-3.webp | awk '{print $1/1024}')"
echo "LISTO"
