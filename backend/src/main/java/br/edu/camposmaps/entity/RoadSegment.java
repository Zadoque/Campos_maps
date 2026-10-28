package br.edu.camposmaps.entity;
import org.springframework.data.neo4j.core.schema.*;
@Node("RoadSegment") public class RoadSegment { @Id private String id; private String name; private double meters; private String highway; public RoadSegment(){} public RoadSegment(String id,String name,double meters,String highway){this.id=id;this.name=name;this.meters=meters;this.highway=highway;} public String getId(){return id;} public String getName(){return name;} public double getMeters(){return meters;} public String getHighway(){return highway;} }
