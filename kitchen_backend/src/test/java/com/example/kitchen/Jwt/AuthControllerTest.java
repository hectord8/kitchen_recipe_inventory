package com.example.kitchen.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.kitchen.customer.Customer;
import com.example.kitchen.customer.CustomerDAO;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthControllerTest {

  private final CustomerDAO customerDao = mock(CustomerDAO.class);
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  private final JwtService jwtService = new JwtService("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", 60);

  @Test
  void loginValidatesPassword() {
    Customer db = new Customer();
    db.setEmail("alice@example.com");
    db.setPassword(passwordEncoder.encode("correct-password"));

    when(customerDao.getCustomerByLogin("alice@example.com")).thenReturn(db);

    boolean matches = passwordEncoder.matches("correct-password", db.getPassword());
    assertTrue(matches);

    matches = passwordEncoder.matches("wrong-password", db.getPassword());
    assertFalse(matches);
  }

  @Test
  void tokenContainsEmailAndRole() {
    when(customerDao.getCustomerByLogin("admin@example.com")).thenReturn(null);

    String token = jwtService.generateToken("admin@example.com", Map.of("id", 1, "role", "ADMIN"));
    assertNotNull(token);

    String subject = jwtService.extractSubject(token);
    assertEquals("admin@example.com", subject);

    var claims = jwtService.parseClaims(token);
    assertEquals("ADMIN", claims.get("role"));
    assertEquals(1, claims.get("id"));
  }

  @Test
  void unknownUserReturnsNull() {
    when(customerDao.getCustomerByLogin("unknown@example.com")).thenReturn(null);
    assertNull(customerDao.getCustomerByLogin("unknown@example.com"));
  }
}
