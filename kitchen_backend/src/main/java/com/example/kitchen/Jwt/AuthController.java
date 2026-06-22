package com.example.kitchen.Jwt;

import com.example.kitchen.customer.Customer;
import com.example.kitchen.customer.CustomerDAO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  @Value("${app.cookie.secure:true}")
  private boolean cookieSecure;

  private final CustomerDAO customerDao;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(
      CustomerDAO customerDao, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.customerDao = customerDao;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  record LoginRequest(String email, String password) {}

  record LoginResponse(String token, Customer customer) {}

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse httpRes) {
    try {
      Customer db = customerDao.getCustomerByLogin(req.email());
      if (db == null) return ResponseEntity.status(401).body("Invalid login (no user)");

      boolean ok = passwordEncoder.matches(req.password(), db.getPassword());
      if (!ok) return ResponseEntity.status(401).body("Invalid login (wrong password)");

      String token =
          jwtService.generateToken(
              db.getEmail(), Map.of("id", db.getId(), "role", db.getRole()));
      db.setPassword(null);

      Cookie cookie = new Cookie("token", token);
      cookie.setHttpOnly(true);
      cookie.setSecure(cookieSecure);
      cookie.setPath("/");
      cookie.setMaxAge(60 * 60);
      cookie.setAttribute("SameSite", "None");
      httpRes.addCookie(cookie);

      return ResponseEntity.ok(new LoginResponse(token, db));
    } catch (Exception e) {
      log.error("Login failed for {}", req.email(), e);
      return ResponseEntity.status(500).body("Server error: " + e.getMessage());
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse httpRes) {
    Cookie cookie = new Cookie("token", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(cookieSecure);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    cookie.setAttribute("SameSite", "None");
    httpRes.addCookie(cookie);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
    if (auth == null) return ResponseEntity.status(401).build();

    String email = auth.getName(); // this will now be the email (principal)
    Customer db = customerDao.getCustomerByLogin(email);
    if (db == null) return ResponseEntity.status(401).build();

    db.setPassword(null);
    return ResponseEntity.ok(db);
  }
}
