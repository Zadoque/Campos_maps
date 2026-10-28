package br.edu.camposmaps.exception;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestControllerAdvice public class ApiExceptionHandler { @ExceptionHandler(Exception.class) ResponseEntity<Map<String,String>> handle(Exception ex){return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Requisição inválida", "detail", ex.getMessage()==null?"":ex.getMessage()));} }
