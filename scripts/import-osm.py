#!/usr/bin/env python3
"""Importa as vias OSM recortadas como grafo ponderado no Neo4j."""
import json, math, os
from neo4j import GraphDatabase

GEOJSON = os.environ.get("OSM_GEOJSON", "data/campos-roads.geojson")
URI = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
USER = os.environ.get("NEO4J_USER", "neo4j")
PASSWORD = os.environ.get("NEO4J_PASSWORD", "camposmaps")

def distance(a, b):
    dy = (b[1] - a[1]) * 111_320
    dx = (b[0] - a[0]) * 111_320 * math.cos(math.radians((a[1] + b[1]) / 2))
    return math.sqrt(dx * dx + dy * dy)

def key(point): return f"{point[1]:.6f}:{point[0]:.6f}"

with open(GEOJSON, encoding="utf-8") as f:
    features = json.load(f)["features"]

segments = []
for feature in features:
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        if geometry.get("type") == "MultiLineString":
            coords = max(coords, key=len, default=[])
        if len(coords) < 2: continue
        props = feature.get("properties") or {}
        name = props.get("name") or props.get("ref") or "Via sem nome"
        highway = props.get("highway") or "road"
        oneway = str(props.get("oneway", "no")).lower() in ("yes", "true", "1")
        for a, b in zip(coords, coords[1:]):
            if a == b: continue
            ak, bk = key(a), key(b)
            meters = distance(a, b)
            segments.append({"ak":ak,"bk":bk,"alat":a[1],"alon":a[0],"blat":b[1],"blon":b[0],"osm":str(props.get("@id", len(segments))),"segment":len(segments),"meters":meters,"name":name,"highway":highway,"oneway":oneway})

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
with driver.session() as session:
    session.run("MATCH (n:RoadNode) DETACH DELETE n")
    session.run("CREATE CONSTRAINT road_node_id IF NOT EXISTS FOR (n:RoadNode) REQUIRE n.id IS UNIQUE")
    cypher = """
      UNWIND $rows AS row
      MERGE (a:RoadNode {id:row.ak}) SET a.lat=row.alat, a.lon=row.alon
      MERGE (b:RoadNode {id:row.bk}) SET b.lat=row.blat, b.lon=row.blon
      MERGE (a)-[r:ROAD {osm_id:row.osm, segment:row.segment}]->(b)
      SET r.meters=row.meters, r.name=row.name, r.highway=row.highway
      FOREACH (_ IN CASE WHEN row.oneway THEN [] ELSE [1] END |
        MERGE (b)-[back:ROAD {osm_id:row.osm, segment:row.segment}]->(a)
        SET back.meters=row.meters, back.name=row.name, back.highway=row.highway)
    """
    for start in range(0, len(segments), 1000):
        session.run(cypher, rows=segments[start:start+1000]).consume()
    print(f"Neo4j importado: {len(segments)} segmentos de {len(features)} vias")
driver.close()
