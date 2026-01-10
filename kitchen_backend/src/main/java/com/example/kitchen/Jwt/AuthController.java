package com.example.kitchen.Jwt;

import com.example.kitchen.customer.Customer;
import com.example.kitchen.customer.CustomerDAO;
import com.example.kitchen.customer.CustomerDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.kitchen.Jwt.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CustomerDAO customerDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthController(CustomerDAO customerDao, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.customerDao = customerDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    record LoginRequest(String email, String password) {}
    record LoginResponse(String token, Customer customer) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Customer db = customerDao.getCustomerByLogin(req.email());
            if (db == null) return ResponseEntity.status(401).body("Invalid login (no user)");

            boolean ok = passwordEncoder.matches(req.password(), db.getPassword());
            if (!ok) return ResponseEntity.status(401).body("Invalid login (wrong password)");

            String token = jwtService.generateToken(db.getEmail(), Map.of("id", db.getId()));
            db.setPassword(null);

            return ResponseEntity.ok(new LoginResponse(token, db));
        } catch (Exception e) {
            e.printStackTrace(); // IMPORTANT: prints real reason in console
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
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