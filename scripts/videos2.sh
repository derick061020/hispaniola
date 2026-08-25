#!/usr/bin/env bash
set -u
FF="$(dirname "$(which ffmpeg)")/ffmpeg"
re () {  # $1 archivo  $2 crf
  "$FF" -y -v error -i "$1" -c:v libx264 -preset slow -crf "$2" -profile:v high \
    -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 80k -ac 2 "$1.tmp.mp4" \
    && mv -f "$1.tmp.mp4" "$1"
  printf '  %-42s %6.1f MB\n' "${1#app/public/video/}" "$(stat -c%s "$1" | awk '{print $1/1048576}')"
}
echo "== segunda pasada sobre los pesados =="
re app/public/video/eventos/corporate.mp4        35
re app/public/video/instalaciones/biologia.mp4   33
re app/public/video/instalaciones/recibimiento.mp4 33
re app/public/video/eventos/party-boat.mp4       33
re app/public/video/reels/reel-3.mp4             33
re app/public/video/reels/reel-1.mp4             33
re app/public/video/reels/reel-2.mp4             33

echo "== posters de los reels (fotograma real del propio video) =="
for i in 1 2 3 4 5; do
  "$FF" -y -v error -ss 1.2 -i "app/public/video/reels/reel-$i.mp4" -frames:v 1 \
    -vf "scale=540:960" "app/public/fotos/reel-$i.webp" -quality 82
  printf '  %-42s %6.1f KB\n' "reel-$i.webp" "$(stat -c%s "app/public/fotos/reel-$i.webp" | awk '{print $1/1024}')"
done
echo "LISTO"
