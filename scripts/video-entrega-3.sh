#!/usr/bin/env bash
# Tercera entrega (2026-09-01) — [4] «Homepage - This is what a day with us
# looks like: cambiar video numero 2 (senalado con un screenshot)».
#
# QUE VIDEO ES. El screenshot (`CAMBIOS/2 - CAMBIAR ESTE VIDEO.png`) lleva una
# flecha roja sobre la SEGUNDA tarjeta de la fila, la titulada «Lunch on board,
# Caribbean style». Esa es `reel-2` (REELS en data/home.ts). El sustituto es
# `CAMBIOS/2.mp4`, y aqui el «2» del nombre coincide con la posicion — ojo, que
# en la entrega anterior NO coincidia: alli el archivo se llamaba `4.mp4` y era
# el numero del ORIGINAL al que sustituia, no el puesto en la fila.
#
# ⚠️ ESTE CAMBIO RESUELVE UNA DEUDA. El reel-2 que se cae era el UNICO de los
# cinco que no era el clip del cliente tal cual: al original («3 PAGINA
# INICIO.mp4») hubo que quitarle 2,2 segundos porque el recorrido del barco
# entraba en el bano y se veian un urinario y un lavabo. El clip nuevo se ha
# revisado fotograma a fotograma y NO tiene ese problema, asi que entra entero
# y el apano desaparece. Con esto los cinco reels vuelven a ser material del
# cliente sin editar.
#
# ⚠️ EL POSTER NO SALE DEL SEGUNDO 1,2, y es la unica excepcion de los seis.
# El criterio del proyecto es que el poster CASE CON EL PIE de la tarjeta (fue
# lo que se verifico en la entrega anterior con la tortuga). Aqui el pie dice
# «Lunch on board, Caribbean style» y el clip abre con un plano cenital del
# barco navegando: a 1,2s no hay comida por ninguna parte, asi que el poster
# prometeria una cosa y el pie otra. Se saca del segundo 22, que es el plano
# cenital de dos huespedes comiendo langosta sobre la red del catamaran — el
# mejor fotograma del clip y, ademas, exactamente lo que promete el pie.
#
# ⚠️ EL CLIP CIERRA CON UNA CARTELA DE LOGOS (Fundacion Bavaro Reefs +
# Hispaniola) en los ultimos ~2 segundos. Los otros cuatro reels son clips
# crudos sin marca, asi que este va a ser el unico que termine en un cartel.
# Se deja porque es material del cliente tal cual y su propia marca, no ajena,
# pero queda anotado por si Samuel prefiere cortarlo: seria `-t 27.5`.
#
# crf 33 en UNA pasada, como los otros cinco (ver scripts/videos2.sh y
# video-entrega-2.sh): una sola pasada a 33 se ve mejor que 30 recodificado.
set -u
FF="$(dirname "$(which ffmpeg)")/ffmpeg"
E="FOTO PARA NUEVA WEB 2026"
SRC="$E/HOMEPAGE/This is what a day with us looks like/CAMBIOS/2.mp4"

# La fuente ya es 1080x1920 (9:16 nativo), asi que el scale no recorta nada:
# solo baja de tamano. Se conserva la cadena completa del resto de reels para
# que el comando sea el mismo aunque manden un clip apaisado.
"$FF" -y -v error -i "$SRC" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libx264 -preset slow -crf 33 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 80k -ac 2 app/public/video/reels/reel-2.mp4
printf '  %-30s %6.1f MB\n' "reel-2.mp4" "$(stat -c%s app/public/video/reels/reel-2.mp4 | awk '{print $1/1048576}')"

# Poster: fotograma real del propio video. Segundo 22 — ver la nota de arriba.
"$FF" -y -v error -ss 22 -i app/public/video/reels/reel-2.mp4 -frames:v 1 \
  -vf "scale=540:960" app/public/fotos/reel-2.webp -quality 82
printf '  %-30s %6.1f KB\n' "reel-2.webp" "$(stat -c%s app/public/fotos/reel-2.webp | awk '{print $1/1024}')"
echo "LISTO"
