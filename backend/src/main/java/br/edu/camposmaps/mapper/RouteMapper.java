package br.edu.camposmaps.mapper;
import br.edu.camposmaps.dto.RouteResponse; import java.util.*;
public class RouteMapper { public static RouteResponse.Point point(double lat,double lon){return new RouteResponse.Point(lat,lon);} public static List<RouteResponse.Point> line(RouteResponse.Point a,RouteResponse.Point b,double bend){return List.of(a,new RouteResponse.Point((a.lat()+b.lat())/2+bend,(a.lon()+b.lon())/2-bend),b);} }
