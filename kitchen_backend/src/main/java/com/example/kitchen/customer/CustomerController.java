package com.example.kitchen.customer;

import com.example.kitchen.customer.CustomerDto;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
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



    // GET endpoint to fetch all Customers
    @GetMapping("/by-firstname/{firstName}")
    public Customer getCustomerByFirstName(@PathVariable String firstName) {
        return CustomerDao.getCustomerByLogin(firstName);
    }


    @PostMapping("/register")
    public ResponseEntity<Customer> insert(@Valid @RequestBody CustomerDto dto) {
        Customer customer = new Customer();
        customer.setFirstName(dto.getFirstName());
        customer.setEmail(dto.getEmail());
        customer.setPassword(passwordEncoder.encode(dto.getPassword()));
        Customer saved = CustomerDao.insert(customer);

        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}