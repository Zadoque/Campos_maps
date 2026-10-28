package br.edu.camposmaps.entity;
import org.springframework.data.neo4j.core.schema.*;
@Node("RoadNode") public class RoadNode { @Id private String id; private double lat; private double lon; public RoadNode() {} public RoadNode(String id,double lat,double lon){this.id=id;this.lat=lat;this.lon=lon;} public String getId(){return id;} public double getLat(){return lat;} public double getLon(){return lon;} }
