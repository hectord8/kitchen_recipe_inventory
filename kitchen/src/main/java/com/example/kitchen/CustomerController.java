package com.example.kitchen;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

// REST Controller for managing Customers
@RestController
@RequestMapping("/Customers")


public class CustomerController {
    private final CustomerRepository repo;

    public CustomerController(CustomerRepository repo) {
        this.repo = repo;
    }

    @Autowired
    private CustomerDAO CustomerDao;


    // GET endpoint to fetch all Customers
    @GetMapping("/")
    public Customers getCustomers() {
        return CustomerDao.getAllCustomers();
    }

    // POST endpoint to add a new Customer
    @PostMapping("/")
    public ResponseEntity<Object> addCustomer(@RequestBody Customer Customer) {

        // Generate ID for the new Customer
        Integer id = CustomerDao.getAllCustomers()
                .getCustomerList().size() + 1;
        Customer.setId(id);

        // Add Customer to the list
        CustomerDao.addCustomer(Customer);
        repo.insert(Customer);
        // Build location URI for the new Customer
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(Customer.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }
}