package com.example.kitchen;

import org.springframework.stereotype.Repository;

@Repository
public class CustomerDAO {

    private static Customers Customers = new Customers();

    static {
        // Initialize with sample Customers
        Customers.getCustomerList()
                .add(new Customer(1, "Prem", "Tiwari", "prem@gmail.com"));
        Customers.getCustomerList()
                .add(new Customer(2, "Vikash", "Kumar", "vikash@gmail.com"));
        Customers.getCustomerList()
                .add(new Customer(3, "Ritesh", "Ojha", "ritesh@gmail.com"));
    }

    // Retrieve all Customers
    public Customers getAllCustomers() {
        return Customers;
    }

    // Add an Customer
    public void addCustomer(Customer Customer) {
        Customers.getCustomerList().add(Customer);
    }
}