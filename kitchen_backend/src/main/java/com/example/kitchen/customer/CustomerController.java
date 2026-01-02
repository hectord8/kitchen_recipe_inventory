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


    @PostMapping("/register")
    public ResponseEntity<Customer> insert(@RequestBody Customer customer) {
        String hashed = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(hashed);
        Customer saved = CustomerDao.insert(customer);

        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}