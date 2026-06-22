package com.example.kitchen.config;

import java.util.Map;
import javax.sql.DataSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  private final DataSource dataSource;

  public HealthController(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> health() {
    try {
      dataSource.getConnection().close();
      return ResponseEntity.ok(Map.of("status", "UP"));
    } catch (Exception e) {
      return ResponseEntity.status(503).body(Map.of("status", "DOWN"));
    }
  }
}
