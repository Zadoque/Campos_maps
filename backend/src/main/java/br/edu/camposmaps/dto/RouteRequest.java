package br.edu.camposmaps.dto;
import jakarta.validation.constraints.*; import java.util.*;
public record RouteRequest(@NotNull Point origin,@NotNull Point destination,List<Point> stops){ public record Point(@NotNull Double lat,@NotNull Double lon){} }
