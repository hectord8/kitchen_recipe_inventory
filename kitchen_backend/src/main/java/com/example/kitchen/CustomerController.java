package com.example.kitchen;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;




// REST Controller for managing Customers
@RestController
@RequestMapping("/Customers")
public class CustomerController {


    @Autowired
    private CustomerDAO CustomerDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public CustomerController(CustomerDAO CustomerDao, PasswordEncoder passwordEncoder) {
        this.CustomerDao = CustomerDao;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/debug/session")
    public Object debug(HttpSession session) {
        System.out.println("Session ID = " + session.getId());
        System.out.println("customer attr = " + session.getAttribute("customer"));
        return session.getAttribute("customer");
    }



    // GET endpoint to fetch all Customers
    @GetMapping("/by-firstname/{firstName}")
    public Customer getCustomerByFirstName(@PathVariable String firstName) {
        return CustomerDao.getCustomerByLogin(firstName);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer body , HttpSession session) {

        try {
            Customer db = CustomerDao.getCustomerByLogin(body.getEmail());
            if (db == null) {
                return ResponseEntity.status(401).body("Invalid login");
            }

            boolean ok = passwordEncoder.matches(body.getPassword(), db.getPassword());
            if (!ok) return ResponseEntity.status(401).body("Invalid login");

            session.setAttribute("customer", db);

            db.setPassword(null);
            return ResponseEntity.ok(db);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid login");
        }
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("customer");
        if (customer == null) {
            return ResponseEntity.status(401).build();
        }

        customer.setPassword(null);
        return ResponseEntity.ok(customer);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }


    @PostMapping("/register")
    public ResponseEntity<Customer> insert(@RequestBody Customer customer) {
        String hashed = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(hashed);
        Customer saved = CustomerDao.insert(customer);

        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}