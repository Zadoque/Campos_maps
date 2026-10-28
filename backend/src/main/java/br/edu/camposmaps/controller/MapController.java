package br.edu.camposmaps.controller;
import org.springframework.web.bind.annotation.*; import org.springframework.web.client.RestClient; import java.util.*;
@RestController @RequestMapping("/api/map") @CrossOrigin public class MapController {
  private final RestClient nominatim=RestClient.builder().baseUrl("https://nominatim.openstreetmap.org").defaultHeader("User-Agent","CamposMaps/1.0 academic project").build();
  @GetMapping("/metadata") public Map<String,Object> metadata(){return Map.of("city","Campos dos Goytacazes","source","OpenStreetMap / Geofabrik","license","ODbL","center",List.of(-21.7523,-41.3304));}
  @GetMapping("/search") public List<Map<String,Object>> search(@RequestParam String q){if(q.isBlank())return List.of(); var result=nominatim.get().uri(uri->uri.path("/search").queryParam("format","jsonv2").queryParam("limit",5).queryParam("countrycodes","br").queryParam("q",q+", Campos dos Goytacazes, RJ, Brasil").build()).retrieve().body(List.class); return result==null?List.of():result;}
}
