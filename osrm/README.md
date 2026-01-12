
## Setup

---
### Definiera och hämta OpenStreetMap-data för din plats.
https://download.geofabrik.de/
https://extract.bbbike.org/ 

---

### Docker hub image

https://hub.docker.com/r/osrm/osrm-backend/

```sh
docker pull osrm/osrm-backend
# Using default tag: latest
# latest: Pulling from osrm/osrm-backend
# Digest: sha256:af5d4a83fb90086a43b1ae2ca22872e6768766ad5fcbb07a29ff90ec644ee409
# Status: Image is up to date for osrm/osrm-backend:latest
# docker.io/osrm/osrm-backend:latest
```

`osrm/osrm-backend                latest    af5d4a83fb90   4 years ago     151MB`

---


## Förbered din Geo-Data
### Extrahera
`osrm-extract`

Konverterar och skapar nya filer för OSRM med extraherat vägnät:

````bash
docker run --platform=linux/amd64 -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/bicycle.lua /data/rull.osm.pbf
````

Option för cykelvägar, ej motorvägar etc.
`-p /opt/bicycle.lua`

---

### Partitionera
`osrm-partition`

```bash
docker run --platform=linux/amd64 -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/rull.osrm
```

- Delar upp det i partitioner för snabbare routing
- Multi-Level Dijkstra (MLD) Algoritmen
 
---

### Optimera

`osrm-customize`

```bash
docker run --platform=linux/amd64 -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/rull.osrm
```

- Optimerar och lägger till data för restider, genvägar mm

---

## Servera

`osrm-routed`

```bash
docker run --platform=linux/amd64 -t -i -p 6061:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/rull.osrm
```
Använder port:5000 internt, jag mappar den till min localhost:6061

#### Requests

Requestformat:

`http://localhost:6061/route/v1/bicycle/<LON1>,<LAT1>;<LON2>,<LAT2>?overview=full&geometries=geojson`

Exempel:
`http://localhost:6061/route/v1/bike/14.128300,57.863800;14.127100,57.862900;14.128300,57.863800?overview=full&geometries=geojson`

(Bicycle och bike ger samma resultat)

Mer info om requests:
https://project-osrm.org/docs/v5.5.1/api/#general-options
