#!/usr/bin/env bash
set -euo pipefail
mkdir -p data
URL="https://download.openstreetmap.fr/extracts/south-america/brazil/southeast/rio-de-janeiro-latest.osm.pbf"
echo "Baixando extrato real OSM do estado RJ: $URL"
FILE="data/rio-de-janeiro-latest.osm.pbf"
curl -L --fail --retry 5 --retry-delay 5 -o "$FILE" "$URL"
curl -L --fail --retry 5 -o data/rio-de-janeiro-latest.osm.pbf.md5 "https://download.openstreetmap.fr/extracts/south-america/brazil/southeast/rio-de-janeiro.osm.pbf.md5"
sed 's/  rio-de-janeiro\.osm\.pbf$/  rio-de-janeiro-latest.osm.pbf/' data/rio-de-janeiro-latest.osm.pbf.md5 > data/rio-de-janeiro-latest.osm.pbf.verify.md5
(cd data && md5sum -c rio-de-janeiro-latest.osm.pbf.verify.md5)
echo "Download e MD5 confirmados: $FILE"
echo "Recortando e exportando apenas as vias de Campos..."
osmium extract -b -41.45,-21.90,-41.18,-21.62 "$FILE" -o data/campos.osm.pbf --overwrite
osmium tags-filter data/campos.osm.pbf w/highway -o data/campos-roads.osm.pbf --overwrite
osmium export data/campos-roads.osm.pbf -o data/campos-roads.geojson --geometry-types=linestring --overwrite
echo "Recorte pronto: data/campos-roads.geojson"
