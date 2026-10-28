package br.edu.camposmaps.service;

import br.edu.camposmaps.dto.RouteRequest;
import br.edu.camposmaps.dto.RouteResponse;
import br.edu.camposmaps.mapper.RouteMapper;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

@Service
public class RouteService {
  private static final int ROUTE_LIMIT = 3;
  private final Neo4jClient neo4j;

  public RouteService() {
    this.neo4j = null;
  }

  @Autowired
  public RouteService(Neo4jClient neo4j) {
    this.neo4j = neo4j;
  }

  public RouteResponse calculate(RouteRequest request) {
    var points = new ArrayList<RouteResponse.Point>();
    points.add(new RouteResponse.Point(request.origin().lat(), request.origin().lon()));
    if (request.stops() != null) {
      request.stops().forEach(
          point -> points.add(new RouteResponse.Point(point.lat(), point.lon())));
    }
    points.add(new RouteResponse.Point(request.destination().lat(), request.destination().lon()));

    if (neo4j != null) {
      var response = calculateFromNeo4j(points);
      if (response != null) {
        return response;
      }
    }
    return calculateForTest(points);
  }

  private RouteResponse calculateFromNeo4j(List<RouteResponse.Point> points) {
    var baseLegs = new ArrayList<PathData>();
    for (int leg = 0; leg < points.size() - 1; leg++) {
      var path = findPath(points.get(leg), points.get(leg + 1), List.of());
      if (path == null) {
        return null;
      }
      baseLegs.add(path);
    }

    var distinct = new LinkedHashMap<String, CompletePath>();
    addDistinct(distinct, new CompletePath(baseLegs));

    for (int leg = 0; leg < baseLegs.size() && distinct.size() < ROUTE_LIMIT; leg++) {
      var baseLeg = baseLegs.get(leg);
      for (var relationshipId : baseLeg.relationshipIds()) {
        var alternative = findPath(
            points.get(leg),
            points.get(leg + 1),
            List.of(relationshipId));
        if (alternative == null) {
          continue;
        }
        var candidateLegs = new ArrayList<>(baseLegs);
        candidateLegs.set(leg, alternative);
        addDistinct(distinct, new CompletePath(candidateLegs));
        if (distinct.size() == ROUTE_LIMIT) {
          break;
        }
      }
    }

    var candidates = distinct.values().stream()
        .sorted((left, right) -> Double.compare(left.meters(), right.meters()))
        .limit(ROUTE_LIMIT)
        .toList();
    var routes = new ArrayList<RouteResponse.Route>();
    for (int index = 0; index < candidates.size(); index++) {
      routes.add(toRoute(candidates.get(index), index + 1));
    }
    return new RouteResponse(
        "Neo4j shortestPath + alternativas distintas",
        routes,
        points);
  }

  private void addDistinct(
      Map<String, CompletePath> distinct,
      CompletePath candidate) {
    distinct.putIfAbsent(candidate.geometrySignature(), candidate);
  }

  private RouteResponse.Route toRoute(CompletePath completePath, int rank) {
    var geometry = completePath.geometry();
    var streets = completePath.streets();
    var kilometers = completePath.meters() / 1000;
    return new RouteResponse.Route(
        rank,
        Math.round(kilometers * 100) / 100.0,
        (int) Math.ceil(kilometers * 3.2),
        geometry,
        streets,
        buildSteps(geometry, streets));
  }

  @SuppressWarnings("unchecked")
  private PathData findPath(
      RouteResponse.Point origin,
      RouteResponse.Point destination,
      List<String> blockedRelationshipIds) {
    var rows = neo4j.query("""
        CALL () {
          MATCH (candidate:RoadNode)
          RETURN candidate AS a
          ORDER BY abs(candidate.lat - $originLat) + abs(candidate.lon - $originLon)
          LIMIT 1
        }
        CALL () {
          MATCH (candidate:RoadNode)
          RETURN candidate AS b
          ORDER BY abs(candidate.lat - $destinationLat) + abs(candidate.lon - $destinationLon)
          LIMIT 1
        }
        MATCH path = shortestPath((a)-[:ROAD*..120]->(b))
        WHERE all(relation IN relationships(path)
          WHERE NOT elementId(relation) IN $blockedRelationshipIds)
        WITH path,
             reduce(total = 0.0, relation IN relationships(path) |
               total + relation.meters) AS meters
        RETURN [node IN nodes(path) | {lat: node.lat, lon: node.lon}] AS geometry,
               meters,
               [relation IN relationships(path) | relation.name] AS streets,
               [relation IN relationships(path) | elementId(relation)] AS relationshipIds
        """)
        .bindAll(Map.of(
            "originLat", origin.lat(),
            "originLon", origin.lon(),
            "destinationLat", destination.lat(),
            "destinationLon", destination.lon(),
            "blockedRelationshipIds", blockedRelationshipIds))
        .fetch()
        .all();

    if (rows.isEmpty()) {
      return null;
    }
    var row = rows.iterator().next();
    var geometry = new ArrayList<RouteResponse.Point>();
    for (var node : (List<Map<String, Object>>) row.get("geometry")) {
      geometry.add(new RouteResponse.Point(
          ((Number) node.get("lat")).doubleValue(),
          ((Number) node.get("lon")).doubleValue()));
    }
    return new PathData(
        geometry,
        ((Number) row.get("meters")).doubleValue(),
        (List<String>) row.get("streets"),
        (List<String>) row.get("relationshipIds"));
  }

  private RouteResponse calculateForTest(List<RouteResponse.Point> points) {
    var routes = new ArrayList<RouteResponse.Route>();
    for (int index = 0; index < ROUTE_LIMIT; index++) {
      var geometry = new ArrayList<RouteResponse.Point>();
      for (int point = 0; point < points.size() - 1; point++) {
        var line = RouteMapper.line(
            points.get(point),
            points.get(point + 1),
            (index - 1) * 0.002);
        if (point > 0) {
          geometry.remove(geometry.size() - 1);
        }
        geometry.addAll(line);
      }
      var streets = List.of(
          "Avenida Alberto Torres",
          "Avenida 28 de Março",
          "BR-101");
      var kilometers = distance(geometry) * (1 + index * 0.055);
      routes.add(new RouteResponse.Route(
          index + 1,
          Math.round(kilometers * 100) / 100.0,
          (int) Math.ceil(kilometers * 3.2),
          geometry,
          streets,
          buildSteps(geometry, streets)));
    }
    return new RouteResponse("Teste local (Neo4j indisponível)", routes, points);
  }

  private List<RouteResponse.Step> buildSteps(
      List<RouteResponse.Point> geometry,
      List<String> streets) {
    var steps = new ArrayList<RouteResponse.Step>();
    if (geometry.size() < 2 || streets.isEmpty()) {
      return steps;
    }
    int start = 0;
    for (int index = 1; index <= streets.size(); index++) {
      if (index == streets.size()
          || !Objects.equals(streets.get(index), streets.get(start))) {
        var end = Math.min(index, geometry.size() - 1);
        var instruction = (steps.isEmpty() ? "Siga" : "Continue")
            + " pela "
            + streets.get(start);
        steps.add(new RouteResponse.Step(
            instruction,
            new ArrayList<>(geometry.subList(start, end + 1))));
        start = index;
      }
    }
    return steps;
  }

  private double distance(List<RouteResponse.Point> points) {
    double sum = 0;
    for (int index = 1; index < points.size(); index++) {
      double latitude = (points.get(index).lat() - points.get(index - 1).lat()) * 111;
      double longitude = (points.get(index).lon() - points.get(index - 1).lon()) * 102;
      sum += Math.sqrt(longitude * longitude + latitude * latitude);
    }
    return sum;
  }

  private record PathData(
      List<RouteResponse.Point> geometry,
      double meters,
      List<String> streets,
      List<String> relationshipIds) {}

  private record CompletePath(List<PathData> legs) {
    List<RouteResponse.Point> geometry() {
      var result = new ArrayList<RouteResponse.Point>();
      for (var leg : legs) {
        var segment = leg.geometry();
        if (!result.isEmpty() && !segment.isEmpty()) {
          segment = segment.subList(1, segment.size());
        }
        result.addAll(segment);
      }
      return result;
    }

    List<String> streets() {
      var result = new ArrayList<String>();
      legs.forEach(leg -> result.addAll(leg.streets()));
      return result;
    }

    double meters() {
      return legs.stream().mapToDouble(PathData::meters).sum();
    }

    String geometrySignature() {
      var signature = new StringBuilder();
      for (var point : geometry()) {
        signature.append(point.lat()).append(',').append(point.lon()).append(';');
      }
      return signature.toString();
    }
  }
}
