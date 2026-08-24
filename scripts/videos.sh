#!/usr/bin/env bash
# Transcodifica los videos de la entrega a tamano web.
# Los originales pesan 30-480 MB: son masters, no assets de web.
set -u
FF="$(dirname "$(which ffmpeg)")/ffmpeg"
E="FOTO PARA NUEVA WEB 2026"
mkdir -p app/public/video/reels app/public/video/instalaciones app/public/video/eventos

# vertical 9:16 -> 720x1280
vert () {  # $1 origen  $2 destino  $3 crf
  "$FF" -y -v error -i "$1" \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
    -c:v libx264 -preset slow -crf "$3" -profile:v high -pix_fmt yuv420p \
    -movflags +faststart -c:a aac -b:a 96k -ac 2 "$2"
  printf '  %-42s %6.1f MB\n' "$(basename "$2")" "$(stat -c%s "$2" | awk '{print $1/1048576}')"
}
# horizontal 16:9 -> 1280x720
horiz () {
  "$FF" -y -v error -i "$1" \
    -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" \
    -c:v libx264 -preset slow -crf "$3" -profile:v high -pix_fmt yuv420p \
    -movflags +faststart -c:a aac -b:a 96k -ac 2 "$2"
  printf '  %-42s %6.1f MB\n' "$(basename "$2")" "$(stat -c%s "$2" | awk '{print $1/1048576}')"
}

# ⚠️ [2026-08-23] ESTE BUCLE YA NO SE PUEDE REEJECUTAR TAL CUAL. En la 2ª
# entrega el cliente BORRO «4 PAGINA INICIO.mp4» de su carpeta y lo sustituyo
# por «CAMBIOS/4.mp4», que es el que hoy alimenta reel-3. Correrlo otra vez
# fallaria en esa iteracion y dejaria reel-3 a medias. Para rehacer solo ese,
# usa scripts/video-entrega-2.sh, que documenta el cambio.
echo "== reels de la home (2..6 -> posicion 1..5) =="
i=1
for n in 2 3 4 5 6; do
  vert "$E/HOMEPAGE/This is what a day with us looks like/$n PAGINA INICIO.mp4" \
       "app/public/video/reels/reel-$i.mp4" 30
  i=$((i+1))
done

echo "== instalaciones =="
vert  "$E/ABOUT US/FACILITIES - ABOUT US/CULINARY CENTER/CULINARY CENTER.mp4"            app/public/video/instalaciones/cocinas.mp4 30
vert  "$E/ABOUT US/FACILITIES - ABOUT US/MARINE BIOLOGY CENTER/Marine Biology Center.mp4" app/public/video/instalaciones/biologia.mp4 30
vert  "$E/ABOUT US/FACILITIES - ABOUT US/GUEST WELCOME CENTER/GUEST WELCOME CENTER.mp4"   app/public/video/instalaciones/recibimiento.mp4 30
vert  "$E/ABOUT US/FACILITIES - ABOUT US/OPERATON CENTER/OPERATION CENTER.mp4"            app/public/video/instalaciones/oficinas.mp4 30

echo "== eventos =="
horiz "$E/EVENTS/PARTYBOATS/party boat.mp4"                    app/public/video/eventos/party-boat.mp4 30
horiz "$E/EVENTS/CORPORATE/VIDEO- (CATAMARÁN) #1 Eclipse.mp4"  app/public/video/eventos/corporate.mp4 31

echo "== tripulacion (master de 3 min) =="
horiz "$E/ABOUT US/CREW - ABOUT US/VIDEO/hispaniola staff-HD.mp4" app/public/video/tripulacion.mp4 32
echo "LISTO"
