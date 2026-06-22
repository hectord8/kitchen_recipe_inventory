package com.example.kitchen.Jwt;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

  private JwtService jwtService;

  private static final String BASE64_SECRET = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  private static final long EXPIRATION_MINUTES = 60;

  @BeforeEach
  void setUp() {
    jwtService = new JwtService(BASE64_SECRET, EXPIRATION_MINUTES);
  }

  @Test
  void generatesAndParsesToken() {
    String token = jwtService.generateToken("test@example.com", Map.of("id", 1, "role", "USER"));
    assertNotNull(token);

    String subject = jwtService.extractSubject(token);
    assertEquals("test@example.com", subject);
  }

  @Test
  void validatesOwnToken() {
    String token = jwtService.generateToken("test@example.com", Map.of());
    assertTrue(jwtService.isValid(token));
  }

  @Test
  void rejectsTamperedToken() {
    String token = jwtService.generateToken("test@example.com", Map.of());
    String tampered = token.substring(0, token.length() - 4) + "XXXX";
    assertFalse(jwtService.isValid(tampered));
  }

  @Test
  void rejectsMalformedToken() {
    assertFalse(jwtService.isValid("not-a-jwt"));
  }

  @Test
  void includesExtraClaims() {
    String token =
        jwtService.generateToken("user@example.com", Map.of("id", 42, "role", "ADMIN"));
    var claims = jwtService.parseClaims(token);
    assertEquals(42, claims.get("id"));
    assertEquals("ADMIN", claims.get("role"));
  }

  @Test
  void differentSecretsProduceDifferentTokens() {
    JwtService other = new JwtService("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=", 60);
    String tokenA = jwtService.generateToken("a@a.com", Map.of());
    String tokenB = other.generateToken("a@a.com", Map.of());
    assertNotEquals(tokenA, tokenB);
    assertFalse(jwtService.isValid(tokenB));
  }
}
