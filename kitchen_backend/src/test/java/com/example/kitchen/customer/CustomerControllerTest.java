package com.example.kitchen.customer;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class CustomerControllerTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void validDtoSerializes() throws Exception {
    CustomerDto dto = new CustomerDto();
    dto.setFirstName("Alice");
    dto.setEmail("alice@example.com");
    dto.setPassword("password123");

    String json = objectMapper.writeValueAsString(dto);
    assertTrue(json.contains("Alice"));
    assertTrue(json.contains("alice@example.com"));
  }

  @Test
  void customerSetsRoleDefault() {
    Customer c = new Customer();
    assertEquals("USER", c.getRole());
  }

  @Test
  void customerConstructorSetsRole() {
    Customer c = new Customer(1, "Alice", "pass", "a@a.com", "ADMIN");
    assertEquals("ADMIN", c.getRole());
  }

  @Test
  void customerHidesPassword() {
    Customer c = new Customer();
    c.setPassword("secret");
    c.setPassword(null);
    assertNull(c.getPassword());
  }
}
