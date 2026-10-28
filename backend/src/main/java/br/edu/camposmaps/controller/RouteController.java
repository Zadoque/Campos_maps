package br.edu.camposmaps.controller;
import br.edu.camposmaps.dto.*; import br.edu.camposmaps.service.RouteService; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/routes") @CrossOrigin public class RouteController { private final RouteService service; public RouteController(RouteService service){this.service=service;} @PostMapping("/alternatives") public RouteResponse alternatives(@Valid @RequestBody RouteRequest request){return service.calculate(request);} @GetMapping("/health") public String health(){return "ok";} }
