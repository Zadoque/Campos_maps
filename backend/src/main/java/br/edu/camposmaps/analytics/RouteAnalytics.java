package br.edu.camposmaps.analytics;
import br.edu.camposmaps.dto.RouteResponse; import org.springframework.stereotype.Component;
@Component public class RouteAnalytics { public RouteResponse.Route annotate(RouteResponse.Route route,int rank){return new RouteResponse.Route(rank,route.distanceKm(),route.durationMin(),route.geometry(),route.streets(),route.steps());} }
