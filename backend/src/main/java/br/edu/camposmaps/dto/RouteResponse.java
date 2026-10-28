package br.edu.camposmaps.dto;
import java.util.*;
public record RouteResponse(String algorithm,List<Route> routes,List<Point> explored){ public record Route(int rank,double distanceKm,int durationMin,List<Point> geometry,List<String> streets,List<Step> steps){} public record Step(String instruction,List<Point> geometry){} public record Point(double lat,double lon){} }
