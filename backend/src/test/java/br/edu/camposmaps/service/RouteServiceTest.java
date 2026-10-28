package br.edu.camposmaps.service;
import br.edu.camposmaps.dto.*; import org.junit.jupiter.api.Test; import java.util.*; import static org.junit.jupiter.api.Assertions.*;
class RouteServiceTest { private final RouteService s=new RouteService(); private RouteRequest req(List<RouteRequest.Point> stops){return new RouteRequest(new RouteRequest.Point(-21.75,-41.33),new RouteRequest.Point(-21.76,-41.32),stops);}
 @Test void returnsThreeAlternatives(){var r=s.calculate(req(List.of()));assertEquals(3,r.routes().size());assertTrue(r.algorithm().contains("Neo4j")||r.algorithm().contains("Teste"));}
 @Test void alternativesExposeDifferentGeometryAndSteps(){var r=s.calculate(req(List.of()));assertNotEquals(r.routes().get(0).geometry(),r.routes().get(1).geometry());assertFalse(r.routes().get(0).steps().isEmpty());}
 @Test void neverReturnsDuplicatedGeometry(){var r=s.calculate(req(List.of()));var signatures=r.routes().stream().map(route->route.geometry().toString()).collect(java.util.stream.Collectors.toSet());assertEquals(r.routes().size(),signatures.size());}
 @Test void preservesStops(){var r=s.calculate(req(List.of(new RouteRequest.Point(-21.755,-41.325))));assertEquals(3,r.explored().size());assertTrue(r.routes().get(0).geometry().size()>=3);}
 @Test void routesAreOrdered(){var r=s.calculate(req(List.of()));assertTrue(r.routes().get(0).distanceKm()<r.routes().get(2).distanceKm());}
}
