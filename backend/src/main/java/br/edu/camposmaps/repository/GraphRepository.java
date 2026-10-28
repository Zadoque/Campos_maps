package br.edu.camposmaps.repository;
import org.springframework.data.neo4j.repository.query.Query; import org.springframework.data.neo4j.repository.Neo4jRepository; import br.edu.camposmaps.entity.RoadNode; import java.util.*;
public interface GraphRepository extends Neo4jRepository<RoadNode,String> { @Query("MATCH (n:RoadNode) RETURN n LIMIT 1") Optional<RoadNode> any(); }
